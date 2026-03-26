import hashlib
from django.conf import settings
from ..utils.logging import get_logger

logger = get_logger(__name__)


class InterswitchVerifier:
    """
    Verifies the SHA-512 signature Interswitch attaches to every webhook.
    Rejects any payload that cannot be verified — prevents spoofed webhooks.

    Interswitch signature formula:
        SHA-512(txnref + amount + product_id + secret_key)
    """

    def verify(self, payload: dict) -> bool:
        try:
            tx_ref     = payload.get("txnref", "")
            amount     = str(payload.get("amount", ""))
            product_id = settings.INTERSWITCH_PRODUCT_ID
            secret_key = settings.INTERSWITCH_SECRET_KEY

            raw        = f"{tx_ref}{amount}{product_id}{secret_key}"
            expected   = hashlib.sha512(raw.encode()).hexdigest()
            received   = payload.get("hash", "")

            is_valid = expected.lower() == received.lower()

            if is_valid:
                logger.info("Webhook signature verified for tx_ref=%s", tx_ref)
            else:
                logger.warning(
                    "Webhook signature MISMATCH for tx_ref=%s. "
                    "expected=%s received=%s",
                    tx_ref, expected[:16], received[:16],
                )

            return is_valid

        except Exception as e:
            logger.error("Signature verification error: %s", str(e), exc_info=True)
            return False