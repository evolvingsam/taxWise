from .models import IntakeRecord, IntakeLedgerEntry
from ..intake.validators import RawIntakePayload
from ..ai_parsing.parser import ParsedFinancialData
from ..utils.logging import get_logger

logger = get_logger(__name__)


class IntakeRepository:
    """
    All DB writes for the Smart Intake app.
    Nothing outside this class touches models directly.
    """

    def save(
        self,
        payload: RawIntakePayload,
        parsed:  ParsedFinancialData,
    ) -> IntakeLedgerEntry:

        intake = IntakeRecord.objects.create(
            user_id  = payload.user_id,
            source   = payload.source,
            raw_text = payload.raw_text,
        )
        logger.info("IntakeRecord saved: id=%s user=%s", intake.id, intake.user_id)

        entry = IntakeLedgerEntry.objects.create(
            intake        = intake,
            user_id       = payload.user_id,
            user_type     = parsed.user_type,
            income        = parsed.income,
            expenses      = parsed.expenses,
            period        = parsed.period,
            ai_confidence = parsed.confidence,
            status        = IntakeLedgerEntry.STATUS_PENDING,
        )
        logger.info("IntakeLedgerEntry saved: id=%s status=pending", entry.id)

        return entry