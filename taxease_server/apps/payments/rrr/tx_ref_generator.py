import uuid
import time
from ..utils.logging import get_logger

logger = get_logger(__name__)


class TxRefGenerator:
    """
    Generates a unique, collision-proof transaction reference.
    Format: TAXEASE-{user_id}-{timestamp}-{random_suffix}
    Example: TAXEASE-42-1711234567-a3f9
    """

    PREFIX = "TAXEASE"

    def generate(self, user_id: int) -> str:
        timestamp     = int(time.time())
        random_suffix = uuid.uuid4().hex[:6].upper()
        tx_ref        = f"{self.PREFIX}-{user_id}-{timestamp}-{random_suffix}"

        logger.info("Generated tx_ref=%s for user_id=%s", tx_ref, user_id)
        return tx_ref