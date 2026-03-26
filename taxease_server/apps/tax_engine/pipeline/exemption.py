from dataclasses import dataclass
from ..assembly.assembler import AssembledData
from ..utils.logging import get_logger

logger = get_logger(__name__)

INDIVIDUAL_EXEMPTION_THRESHOLD = 800_000
SME_EXEMPTION_THRESHOLD        = 100_000_000


@dataclass
class ExemptionResult:
    is_exempt:  bool
    reason:     str = ""


class ExemptionFilter:
    """
    Step A — Checks if the user qualifies for zero-tax exemption.
    If exempt, the pipeline stops here.
    """

    def check(self, data: AssembledData) -> ExemptionResult:
        if (
            data.entity_type == "individual"
            and data.gross_income <= INDIVIDUAL_EXEMPTION_THRESHOLD
        ):
            logger.info(
                "User=%s EXEMPT (individual income=%.2f <= %.2f)",
                data.user_id, data.gross_income, INDIVIDUAL_EXEMPTION_THRESHOLD,
            )
            return ExemptionResult(
                is_exempt=True,
                reason=f"Annual income of ₦{data.gross_income:,.2f} is below the ₦800,000 exemption threshold.",
            )

        if (
            data.entity_type == "sme"
            and data.gross_income <= SME_EXEMPTION_THRESHOLD
        ):
            logger.info(
                "User=%s EXEMPT (sme income=%.2f <= %.2f)",
                data.user_id, data.gross_income, SME_EXEMPTION_THRESHOLD,
            )
            return ExemptionResult(
                is_exempt=True,
                reason=f"SME income of ₦{data.gross_income:,.2f} is below the ₦100,000,000 exemption threshold.",
            )

        logger.info("User=%s is NOT exempt. Proceeding to deductions.", data.user_id)
        return ExemptionResult(is_exempt=False)