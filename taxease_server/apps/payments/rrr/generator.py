import random
import string
from ..utils.logging import get_logger

logger = get_logger(__name__)


class RRRGenerator:
    """
    Mock NRS (NIBSS Remita Reference) generator.
    In production this would call the actual Remita API.
    For the hackathon demo, generates a realistic-looking reference code.

    Format: NRS-XXXX-XXXX  (e.g., NRS-4829-1102)
    """

    PREFIX = "NRS"

    def generate(self, user_id: str, tax_year: int) -> str:
        segment_a = "".join(random.choices(string.digits, k=4))
        segment_b = "".join(random.choices(string.digits, k=4))
        rrr = f"{self.PREFIX}-{segment_a}-{segment_b}"

        logger.info(
            "RRR generated: %s for user=%s year=%d",
            rrr, user_id, tax_year,
        )
        return rrr