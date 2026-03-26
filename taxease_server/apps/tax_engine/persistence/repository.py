from django.utils import timezone
from apps.smart_intake.persistence.models import IntakeLedgerEntry
from .models import TaxProfile, TaxCalculationResult
from ..utils.logging import get_logger

logger = get_logger(__name__)


class TaxEngineRepository:
    """
    All DB reads and writes for the Tax Engine.
    Nothing outside this class touches models directly.
    """

    def get_or_create_profile(self, user_id: str) -> TaxProfile:
        profile, created = TaxProfile.objects.get_or_create(user_id=user_id)
        if created:
            logger.info("Created new TaxProfile for user=%s", user_id)
        return profile

    def get_pending_ledger_entries(self, user_id: str) -> list:
        """Fetch all pending IntakeLedgerEntries for this user."""
        return list(
            IntakeLedgerEntry.objects.filter(
                user_id=user_id,
                status=IntakeLedgerEntry.STATUS_PENDING,
            )
        )

    def get_all_ledger_entries_this_year(self, user_id: str, year: int) -> list:
        """Fetch all ledger entries for the current tax year for WAEC grading."""
        return list(
            IntakeLedgerEntry.objects.filter(
                user_id=user_id,
                created_at__year=year,
            )
        )

    def mark_entries_processed(self, entries: list):
        """Mark all IntakeLedgerEntries as processed after calculation."""
        ids = [e.id for e in entries]
        IntakeLedgerEntry.objects.filter(id__in=ids).update(
            status=IntakeLedgerEntry.STATUS_PROCESSED
        )
        logger.info("Marked %d ledger entries as processed.", len(ids))

    def save_result(self, result_data: dict) -> TaxCalculationResult:
        result = TaxCalculationResult.objects.create(**result_data)
        logger.info(
            "TaxCalculationResult saved: id=%s user=%s status=%s",
            result.id, result.user_id, result.status,
        )
        return result