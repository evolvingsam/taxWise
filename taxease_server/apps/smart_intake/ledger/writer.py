from ..ai_parsing.parser import ParsedFinancialData
from ..intake.validators import RawIntakePayload
from ..persistence.repository import IntakeRepository
from ..persistence.models import IntakeLedgerEntry
from ..utils.logging import get_logger

logger = get_logger(__name__)


class LedgerWriter:
    """
    Thin coordinator between the AI parsing output and the repository.
    Its only job: take ParsedFinancialData and ensure it gets stored.
    """

    def __init__(self):
        self.repository = IntakeRepository()

    def write(
        self,
        payload: RawIntakePayload,
        parsed:  ParsedFinancialData,
    ) -> IntakeLedgerEntry:
        logger.info("LedgerWriter writing entry for user=%s", payload.user_id)
        return self.repository.save(payload, parsed)