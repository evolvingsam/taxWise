from dataclasses import dataclass
from typing import Optional
from ..assembly.assembler import AssembledData
from ..pipeline.exemption import ExemptionResult
from ..pipeline.deductions import DeductionResult
from ..pipeline.brackets import BracketResult
from ..grader.waec import WAECResult

PLATFORM_FILING_FEE = 1_000.0


@dataclass
class FormattedResult:
    status:             str
    user_id:            str
    tax_year:           int
    gross_income:       float
    deductions_applied: float
    taxable_income:     float
    final_tax_owed:     float
    platform_filing_fee: float
    waec_grade:         str
    log_count:          int
    message:            str

    def to_response_dict(self) -> dict:
        return {
            "status": self.status,
            "breakdown": {
                "gross_income":        self.gross_income,
                "deductions_applied":  self.deductions_applied,
                "taxable_income":      self.taxable_income,
                "final_tax_owed":      self.final_tax_owed,
                "platform_filing_fee": self.platform_filing_fee,
            },
            "tax_waec_result": self.waec_grade,
            "message":         self.message,
        }

    def to_db_dict(self) -> dict:
        return {
            "user_id":            self.user_id,
            "tax_year":           self.tax_year,
            "status":             self.status,
            "gross_income":       self.gross_income,
            "deductions_applied": self.deductions_applied,
            "taxable_income":     self.taxable_income,
            "final_tax_owed":     self.final_tax_owed,
            "platform_filing_fee": self.platform_filing_fee,
            "waec_grade":         self.waec_grade,
            "log_count":          self.log_count,
            "message":            self.message,
        }


class ResultFormatter:
    """
    Packages all stage outputs into a single clean result.
    Knows nothing about tax rules — just assembles the final picture.
    """

    def format_exempt(
        self,
        data: AssembledData,
        exemption: ExemptionResult,
        waec: WAECResult,
    ) -> FormattedResult:
        message = (
            f"{exemption.reason} "
            f"Your WAEC compliance grade is {waec.grade}. "
            f"{waec.message} Pay the ₦1,000 filing fee to generate your Zero-Tax Certificate."
        )
        return FormattedResult(
            status              = "exempt",
            user_id             = data.user_id,
            tax_year            = data.tax_year,
            gross_income        = data.gross_income,
            deductions_applied  = 0.0,
            taxable_income      = 0.0,
            final_tax_owed      = 0.0,
            platform_filing_fee = PLATFORM_FILING_FEE,
            waec_grade          = waec.grade,
            log_count           = data.all_year_log_count,
            message             = message,
        )

    def format_taxable(
        self,
        data:       AssembledData,
        deduction:  DeductionResult,
        bracket:    BracketResult,
        waec:       WAECResult,
    ) -> FormattedResult:
        message = (
            f"Your WAEC compliance grade is {waec.grade}. "
            f"{waec.message} "
            f"Pay ₦{bracket.final_tax_owed:,.2f} in tax plus the ₦1,000 filing fee "
            f"to generate your official Tax Clearance Certificate."
        )
        return FormattedResult(
            status              = "success",
            user_id             = data.user_id,
            tax_year            = data.tax_year,
            gross_income        = data.gross_income,
            deductions_applied  = deduction.deductions_applied,
            taxable_income      = deduction.taxable_income,
            final_tax_owed      = bracket.final_tax_owed,
            platform_filing_fee = PLATFORM_FILING_FEE,
            waec_grade          = waec.grade,
            log_count           = data.all_year_log_count,
            message             = message,
        )