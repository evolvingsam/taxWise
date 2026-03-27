from django.contrib.auth import get_user_model
from .models import IntakeRecord, IntakeLedgerEntry
from ..intake.validators import RawIntakePayload
from ..ai_parsing.parser import ParsedFinancialData
from ..utils.logging import get_logger

User = get_user_model()
logger = get_logger(__name__)


class IntakeRepository:

    def save(
        self,
        payload: RawIntakePayload,
        parsed:  ParsedFinancialData,
    ) -> IntakeLedgerEntry:
        user = User.objects.get(id=payload.user_id)

        intake = IntakeRecord.objects.create(
            user     = user,
            source   = payload.source,
            raw_text = payload.raw_text,
        )

        entry = IntakeLedgerEntry.objects.create(
            intake        = intake,
            user          = user,
            user_type     = parsed.user_type,
            income        = parsed.income,
            expenses      = parsed.expenses,
            period        = parsed.period,
            ai_confidence = parsed.confidence,
            status        = IntakeLedgerEntry.STATUS_PENDING,
        )
        logger.info("IntakeLedgerEntry saved: id=%s status=pending", entry.id)
        return entry

    def get_all_for_user(self, user_id: int) -> list:
        """Returns all ledger entries for a user, newest first."""
        return list(
            IntakeLedgerEntry.objects.filter(
                user_id=user_id,
            ).select_related("intake")   # avoids N+1 when accessing raw_text
        )

    def get_single_for_user(
        self,
        user_id:  int,
        entry_id: str,
    ) -> IntakeLedgerEntry | None:
        """Returns a single ledger entry — only if it belongs to this user."""
        try:
            return IntakeLedgerEntry.objects.select_related("intake").get(
                id=entry_id,
                user_id=user_id,
            )
        except IntakeLedgerEntry.DoesNotExist:
            return None