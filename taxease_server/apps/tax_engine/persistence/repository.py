from django.contrib.auth import get_user_model
from apps.smart_intake.persistence.models import IntakeLedgerEntry
from .models import TaxCalculationResult
from ..utils.logging import get_logger

User = get_user_model()
logger = get_logger(__name__)


class TaxEngineRepository:

    def get_pending_ledger_entries(self, user_id: int) -> list:
        return list(
            IntakeLedgerEntry.objects.filter(
                user_id=user_id,
                status=IntakeLedgerEntry.STATUS_PENDING,
            )
        )

    def get_all_ledger_entries_this_year(self, user_id: int, year: int) -> list:
        return list(
            IntakeLedgerEntry.objects.filter(
                user_id=user_id,
                created_at__year=year,
            )
        )

    def mark_entries_processed(self, entries: list):
        ids = [e.id for e in entries]
        IntakeLedgerEntry.objects.filter(id__in=ids).update(
            status=IntakeLedgerEntry.STATUS_PROCESSED
        )
        logger.info("Marked %d entries as processed.", len(ids))

    def save_result(self, user_id: int, result_data: dict) -> TaxCalculationResult:
        user = User.objects.get(id=user_id)
        result_data.pop("user_id", None)   # remove string user_id if present
        result = TaxCalculationResult.objects.create(user=user, **result_data)
        logger.info("TaxCalculationResult saved: id=%s", result.id)
        return result

    def upgrade_waec_to_a(self, user_id: int, tax_year: int):
        result = TaxCalculationResult.objects.filter(
            user_id=user_id,
            tax_year=tax_year,
        ).order_by("-created_at").first()

        if result:
            result.waec_grade = "A"
            result.save()
            logger.info("WAEC upgraded to A. user_id=%s year=%d", user_id, tax_year)