from dataclasses import dataclass
from django.utils import timezone
from ..assembly.assembler import AssembledData
from ..utils.logging import get_logger

logger = get_logger(__name__)

WAEC_MESSAGES = {
    "A": "Excellent compliance! You qualify for premium Aegis Score benefits.",
    "B": "Good compliance. Keep logging consistently to reach an A grade.",
    "C": "Fair compliance. You need more frequent logs to improve your score.",
    "D": "Poor compliance. Irregular logging affects your Aegis Score negatively.",
    "F": "Filing deadline missed. This significantly impacts your financial profile.",
}


@dataclass
class WAECResult:
    grade:   str
    message: str


class WAECGrader:
    """
    Parallel grader — evaluates compliance frequency independently of tax math.
    Grades based on total log count for the current tax year.
    """

    def grade(self, data: AssembledData) -> WAECResult:
        count = data.all_year_log_count

        if count >= 20:
            grade = "A"
        elif count >= 10:
            grade = "B"
        elif count >= 5:
            grade = "C"
        elif count > 0:
            grade = "D"
        else:
            grade = "F"

        logger.info(
            "WAEC grade for user=%s log_count=%d grade=%s",
            data.user_id, count, grade,
        )

        return WAECResult(grade=grade, message=WAEC_MESSAGES[grade])