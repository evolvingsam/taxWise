from dataclasses import dataclass
from typing import Optional

from ..verification.interswitch import InterswitchVerifier
from ..rrr.generator import RRRGenerator
from ..persistence.repository import PaymentRepository
from ..utils.logging import get_logger

logger = get_logger(__name__)


@dataclass
class PaymentResult:
    success:  bool
    rrr_code: Optional[str] = None
    message:  Optional[str] = None
    error:    Optional[str] = None

    def to_dict(self) -> dict:
        if self.success:
            return {
                "status":   "success",
                "rrr_code": self.rrr_code,
                "message":  self.message,
            }
        return {
            "status":  "error",
            "message": self.error,
        }


class PaymentOrchestrator:
    """
    Handles the full post-payment pipeline:
        Verify → Mark Paid → Generate RRR → Upgrade WAEC → Return result

    Each stage fails independently.
    """

    def __init__(self):
        self.verifier   = InterswitchVerifier()
        self.generator  = RRRGenerator()
        self.repository = PaymentRepository()

    def handle_webhook(self, payload: dict) -> PaymentResult:
        tx_ref = payload.get("txnref", "unknown")
        logger.info("Webhook received. tx_ref=%s", tx_ref)

        # ── Stage 1: Verify Signature ──────────────────────────────────────────
        if not self.verifier.verify(payload):
            logger.warning("Rejected webhook — invalid signature. tx_ref=%s", tx_ref)
            return PaymentResult(
                success=False,
                error="Invalid webhook signature.",
            )

        # ── Stage 2: Fetch Transaction ─────────────────────────────────────────
        tx = self.repository.get_transaction_by_ref(tx_ref)
        if not tx:
            return PaymentResult(
                success=False,
                error=f"Transaction not found for ref={tx_ref}.",
            )

        # ── Stage 3: Check Payment Status from Interswitch ────────────────────
        interswitch_status = str(payload.get("resp", "")).strip()

        if interswitch_status != "00":
            # "00" is Interswitch's success code
            self.repository.mark_failed(tx, payload)
            logger.warning("Payment failed. tx_ref=%s resp=%s", tx_ref, interswitch_status)
            return PaymentResult(
                success=False,
                error="Payment was not successful.",
            )

        # ── Stage 4: Generate RRR ──────────────────────────────────────────────
        try:
            rrr_code = self.generator.generate(tx.user_id, tx.tax_year)
        except Exception as e:
            logger.error("RRR generation failed: %s", str(e), exc_info=True)
            return PaymentResult(
                success=False,
                error="Payment received but RRR generation failed. Contact support.",
            )

        # ── Stage 5: Persist & Upgrade WAEC ───────────────────────────────────
        try:
            self.repository.mark_paid(tx, rrr_code, payload)
            self.repository.upgrade_waec_to_a(tx.user_id, tx.tax_year)
        except Exception as e:
            logger.error("Post-payment persistence failed: %s", str(e), exc_info=True)
            # Still return RRR — user should not lose their code
            return PaymentResult(
                success=True,
                rrr_code=rrr_code,
                message=(
                    f"Payment confirmed. Your RRR is {rrr_code}. "
                    f"Note: Record update failed — please contact support."
                ),
            )

        logger.info(
            "Payment pipeline complete. user=%s rrr=%s",
            tx.user_id, rrr_code,
        )
        return PaymentResult(
            success=True,
            rrr_code=rrr_code,
            message=(
                f"Payment confirmed! Your government payment reference is {rrr_code}. "
                f"Use this code to complete your tax remittance via your bank app."
            ),
        )

    def initiate_transaction(
        self,
        user_id:  str,
        tx_ref:   str,
        amount:   float,
        tax_year: int,
    ):
        """Called by the frontend before opening the Interswitch modal."""
        return self.repository.create_transaction(
            user_id=user_id,
            tx_ref=tx_ref,
            amount=amount,
            tax_year=tax_year,
        )