from dataclasses import dataclass
from ..assembly.assembler import AssembledData
from ..utils.logging import get_logger

logger = get_logger(__name__)

MAX_RENT_DEDUCTION      = 500_000
RENT_DEDUCTION_PERCENT  = 0.20


@dataclass
class DeductionResult:
    deductions_applied: float
    taxable_income:     float


class DeductionFilter:
    """
    Step B — Applies legal reliefs to reduce taxable income.
    2026 law: rent deduction capped at ₦500,000 or 20% of income, whichever is lower.
    """

    def apply(self, data: AssembledData) -> DeductionResult:
        rent_cap_by_percent = data.gross_income * RENT_DEDUCTION_PERCENT
        allowable_rent      = min(data.total_rent_paid, MAX_RENT_DEDUCTION, rent_cap_by_percent)
        taxable_income      = max(0.0, data.gross_income - allowable_rent)

        logger.info(
            "Deductions applied. rent_paid=%.2f allowable=%.2f taxable_income=%.2f",
            data.total_rent_paid, allowable_rent, taxable_income,
        )

        return DeductionResult(
            deductions_applied=allowable_rent,
            taxable_income=taxable_income,
        )