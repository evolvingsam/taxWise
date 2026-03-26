from django.contrib.auth import get_user_model
from .models import PaymentTransaction
from apps.tax_engine.persistence.models import TaxCalculationResult
from ..utils.logging import get_logger

User = get_user_model()
logger = get_logger(__name__)


class PaymentRepository:

    def create_transaction(
        self,
        user_id:  int,
        tx_ref:   str,
        amount:   float,
        tax_year: int,
    ) -> PaymentTransaction:
        user = User.objects.get(id=user_id)
        tx = PaymentTransaction.objects.create(
            user               = user,
            interswitch_tx_ref = tx_ref,
            amount             = amount,
            tax_year           = tax_year,
            status             = PaymentTransaction.STATUS_PENDING,
        )
        logger.info("PaymentTransaction created: id=%s user=%s", tx.id, user.email)
        return tx

    def get_transaction_by_ref(self, tx_ref: str) -> PaymentTransaction | None:
        try:
            return PaymentTransaction.objects.get(interswitch_tx_ref=tx_ref)
        except PaymentTransaction.DoesNotExist:
            logger.warning("Transaction not found: tx_ref=%s", tx_ref)
            return None

    def mark_paid(self, tx: PaymentTransaction, rrr_code: str, raw_payload: dict):
        tx.status              = PaymentTransaction.STATUS_PAID
        tx.rrr_code            = rrr_code
        tx.raw_webhook_payload = raw_payload
        tx.save()
        logger.info("Transaction PAID: id=%s rrr=%s", tx.id, rrr_code)

    def mark_failed(self, tx: PaymentTransaction, raw_payload: dict):
        tx.status              = PaymentTransaction.STATUS_FAILED
        tx.raw_webhook_payload = raw_payload
        tx.save()
        logger.warning("Transaction FAILED: id=%s", tx.id)

    def upgrade_waec_to_a(self, user_id: int, tax_year: int):
        result = TaxCalculationResult.objects.filter(
            user_id=user_id,
            tax_year=tax_year,
        ).order_by("-created_at").first()

        if result:
            result.waec_grade = "A"
            result.save()
            logger.info("WAEC upgraded to A after payment. user_id=%s", user_id)