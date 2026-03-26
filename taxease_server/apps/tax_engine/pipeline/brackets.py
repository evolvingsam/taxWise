from dataclasses import dataclass
from ..utils.logging import get_logger

logger = get_logger(__name__)

# 2026 Nigerian PAYE progressive brackets
PAYE_BRACKETS = [
    (800_000,      0.00),
    (2_200_000,    0.15),
    (4_000_000,    0.18),
    (6_000_000,    0.21),
    (float("inf"), 0.25),
]


@dataclass
class BracketResult:
    final_tax_owed: float
    effective_rate: float


class BracketCalculator:
    """
    Step C — Applies progressive tax brackets to taxable income.
    """

    def calculate(self, taxable_income: float) -> BracketResult:
        tax_due   = 0.0
        remaining = taxable_income

        for ceiling, rate in PAYE_BRACKETS:
            if remaining <= 0:
                break
            band     = min(remaining, ceiling)
            tax_due += band * rate
            remaining -= band

        effective_rate = (tax_due / taxable_income) if taxable_income > 0 else 0.0

        logger.info(
            "Bracket calc complete. taxable=%.2f tax_due=%.2f effective_rate=%.4f",
            taxable_income, tax_due, effective_rate,
        )

        return BracketResult(
            final_tax_owed=round(tax_due, 2),
            effective_rate=round(effective_rate, 4),
        )



