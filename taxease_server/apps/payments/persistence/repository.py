from django.utils import timezone
from .models import PaymentTransaction
from apps.tax_engine.persistence.models import TaxCalculationResult
from ..utils.logging import get_logger

logger = get_logger(__name__)


class PaymentRepository:
    """
    All DB reads and writes for the Payments app.
    Also updates TaxCalculationResult WAEC grade post-payment.
    """

    def create_transaction(
        self,
        user_id:            str,
        tx_ref:             str,
        amount:             float,
        tax_year:           int,
    ) -> PaymentTransaction:
        tx = PaymentTransaction.objects.create(
            user_id               = user_id,
            interswitch_tx_ref    = tx_ref,
            amount                = amount,
            tax_year              = tax_year,
            status                = PaymentTransaction.STATUS_PENDING,
        )
        logger.info("PaymentTransaction created: id=%s user=%s", tx.id, user_id)
        return tx

    def get_transaction_by_ref(self, tx_ref: str) -> PaymentTransaction | None:
        try:
            return PaymentTransaction.objects.get(interswitch_tx_ref=tx_ref)
        except PaymentTransaction.DoesNotExist:
            logger.warning("Transaction not found for tx_ref=%s", tx_ref)
            return None

    def mark_paid(self, tx: PaymentTransaction, rrr_code: str, raw_payload: dict):
        tx.status             = PaymentTransaction.STATUS_PAID
        tx.rrr_code           = rrr_code
        tx.raw_webhook_payload = raw_payload
        tx.save()
        logger.info("Transaction marked PAID: id=%s rrr=%s", tx.id, rrr_code)

    def mark_failed(self, tx: PaymentTransaction, raw_payload: dict):
        tx.status              = PaymentTransaction.STATUS_FAILED
        tx.raw_webhook_payload = raw_payload
        tx.save()
        logger.warning("Transaction marked FAILED: id=%s", tx.id)

    def upgrade_waec_to_a(self, user_id: str, tax_year: int):
        """
        Once payment is confirmed, upgrade the user's WAEC grade to A
        in the most recent TaxCalculationResult for this year.
        """
        updated = TaxCalculationResult.objects.filter(
            user_id=user_id,
            tax_year=tax_year,
        ).order_by("-created_at").first()

        if updated:
            updated.waec_grade = "A"
            updated.save()
            logger.info(
                "WAEC grade upgraded to A for user=%s year=%d",
                user_id, tax_year,
            )
        else:
            logger.warning(
                "No TaxCalculationResult found to upgrade WAEC. user=%s year=%d",
                user_id, tax_year,
            )