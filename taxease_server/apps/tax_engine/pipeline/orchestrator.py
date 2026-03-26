from dataclasses import dataclass
from typing import Optional
from django.utils import timezone

from ..assembly.assembler import DataAssembler
from ..pipeline.exemption import ExemptionFilter
from ..pipeline.deductions import DeductionFilter
from ..pipeline.brackets import BracketCalculator
from ..grader.waec import WAECGrader
from ..output.formatter import ResultFormatter, FormattedResult
from ..persistence.repository import TaxEngineRepository
from ..utils.logging import get_logger

logger = get_logger(__name__)


@dataclass
class EngineResult:
    success:  bool
    error:    Optional[str]          = None
    result:   Optional[FormattedResult] = None

    def to_response_dict(self) -> dict:
        if self.result:
            return self.result.to_response_dict()
        return {"status": "error", "message": self.error}


class TaxEngineOrchestrator:
    """
    Wires all Tax Engine stages together.
    Each stage is independent — one failure does not crash the others.

    Flow:
        DataAssembler
            ├── WAECGrader          (parallel, always runs)
            └── ExemptionFilter
                    └── (if not exempt)
                        DeductionFilter → BracketCalculator
                                │
                            ResultFormatter → Repository
    """

    def __init__(self):
        self.assembler   = DataAssembler()
        self.exemption   = ExemptionFilter()
        self.deductions  = DeductionFilter()
        self.brackets    = BracketCalculator()
        self.grader      = WAECGrader()
        self.formatter   = ResultFormatter()
        self.repository  = TaxEngineRepository()

    def run(self, user_id: str) -> EngineResult:
        tax_year = timezone.now().year
        logger.info("Tax engine started. user=%s year=%d", user_id, tax_year)

        # ── Stage 1: Assemble ──────────────────────────────────────────────────
        try:
            data = self.assembler.assemble(user_id, tax_year)
        except Exception as e:
            logger.error("Data assembly failed: %s", str(e), exc_info=True)
            return EngineResult(success=False, error="Failed to retrieve your financial data.")

        # ── Stage 2: WAEC Grade (always runs, parallel to tax math) ───────────
        try:
            waec = self.grader.grade(data)
        except Exception as e:
            logger.error("WAEC grading failed (non-blocking): %s", str(e))
            # Non-blocking — give a default grade rather than crash
            from ..grader.waec import WAECResult
            waec = WAECResult(grade="F", message="Compliance grade unavailable.")

        # ── Stage 3: Exemption Check ───────────────────────────────────────────
        try:
            exemption = self.exemption.check(data)
        except Exception as e:
            logger.error("Exemption check failed: %s", str(e), exc_info=True)
            return EngineResult(success=False, error="Tax exemption check failed.")

        if exemption.is_exempt:
            result = self.formatter.format_exempt(data, exemption, waec)
            self._persist(data, result)
            return EngineResult(success=True, result=result)

        # ── Stage 4: Deductions ────────────────────────────────────────────────
        try:
            deduction = self.deductions.apply(data)
        except Exception as e:
            logger.error("Deduction filter failed: %s", str(e), exc_info=True)
            return EngineResult(success=False, error="Failed to apply tax deductions.")

        # ── Stage 5: Bracket Calculation ───────────────────────────────────────
        try:
            bracket = self.brackets.calculate(deduction.taxable_income)
        except Exception as e:
            logger.error("Bracket calculation failed: %s", str(e), exc_info=True)
            return EngineResult(success=False, error="Tax bracket calculation failed.")

        # ── Stage 6: Format & Persist ──────────────────────────────────────────
        result = self.formatter.format_taxable(data, deduction, bracket, waec)
        self._persist(data, result)

        logger.info(
            "Tax engine complete. user=%s tax_owed=%.2f waec=%s",
            user_id, result.final_tax_owed, result.waec_grade,
        )
        return EngineResult(success=True, result=result)

    def _persist(self, data, result: FormattedResult):
        """Save result and mark ledger entries processed. Non-blocking."""
        try:
            self.repository.save_result(result.to_db_dict())
            self.repository.mark_entries_processed(data.pending_entries)
        except Exception as e:
            logger.error("Persist failed (non-blocking): %s", str(e), exc_info=True)