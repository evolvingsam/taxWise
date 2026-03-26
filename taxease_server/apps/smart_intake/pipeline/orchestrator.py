from dataclasses import dataclass, field
from typing import Optional

from ..intake.validators import RawIntakePayload
from ..ai_parsing.gemini_parser import GeminiFinancialParser
from ..ai_parsing.parser import ParsedFinancialData
from ..ai_parsing.exceptions import AIParsingError, AIServiceUnavailableError
from ..ledger.writer import LedgerWriter
from ..utils.logging import get_logger

logger = get_logger(__name__)


@dataclass
class PipelineResult:
    success: bool
    error:   Optional[str]          = None
    ledger_id: Optional[str]        = None
    parsed:  Optional[dict]         = field(default_factory=dict)
    intake_status: str              = "pending"

    def to_dict(self) -> dict:
        return {
            "status":        "success",
            "ledger_id":     str(self.ledger_id) if self.ledger_id else None,
            "intake_status": self.intake_status,
            "parsed":        self.parsed,
        }


class IntakePipelineOrchestrator:
    """
    Wires the three Smart Intake stages together:
        RawText → AI Parsing → Ledger Write

    Tax calculation is NOT this app's concern.
    Each stage fails independently — no single failure crashes the pipeline.
    """

    def __init__(self):
        self.parser        = GeminiFinancialParser()
        self.ledger_writer = LedgerWriter()

    def run(self, payload: RawIntakePayload) -> PipelineResult:
        logger.info("Pipeline started. user_id=%s source=%s", payload.user_id, payload.source)

        # ── Stage 1: AI Parsing ────────────────────────────────────────────────
        try:
            parsed = self.parser.parse(payload.raw_text)
            logger.info("AI parsing succeeded. confidence=%.2f", parsed.confidence)
        except AIServiceUnavailableError as e:
            logger.error("AI service unavailable: %s", str(e))
            return PipelineResult(
                success=False,
                error="AI service temporarily unavailable. Please try again shortly.",
            )
        except AIParsingError as e:
            logger.error("AI parsing failed: %s", str(e))
            return PipelineResult(
                success=False,
                error="Could not understand your input. Please rephrase and try again.",
            )

        # ── Stage 2: Ledger Write ──────────────────────────────────────────────
        try:
            entry = self.ledger_writer.write(payload, parsed)
        except Exception as e:
            # DB failure is non-blocking — user still gets their parsed result
            logger.error("Ledger write failed (non-blocking): %s", str(e), exc_info=True)
            return PipelineResult(
                success=False,
                error="Your data was parsed but could not be saved. Please try again.",
                parsed=parsed.to_dict(),
            )

        logger.info("Pipeline complete. ledger_id=%s", entry.id)
        return PipelineResult(
            success=True,
            ledger_id=entry.id,
            parsed=parsed.to_dict(),
            intake_status=entry.status,
        )