from dataclasses import dataclass, field
from ..persistence.repository import TaxEngineRepository
from ..utils.logging import get_logger

logger = get_logger(__name__)


@dataclass
class AssembledData:
    user_id:             str
    entity_type:         str
    tax_year:            int
    gross_income:        float
    total_expenses:      float
    total_rent_paid:     float
    log_count:           int
    all_year_log_count:  int
    pending_entries:     list = field(default_factory=list)


class DataAssembler:
    """
    Stage 1 — Pulls and aggregates all pending ledger data for a user.
    Knows nothing about tax rules. Just gathers raw materials.
    """

    def __init__(self):
        self.repository = TaxEngineRepository()
    def assemble(self, user_id: str, tax_year: int, entity_type: str = "individual") -> AssembledData:
        logger.info("Assembling data for user=%s year=%d", user_id, tax_year)

        # Use entity_type from the token instead of creating a TaxProfile
        pending_entries  = self.repository.get_pending_ledger_entries(user_id)
        all_year_entries = self.repository.get_all_ledger_entries_this_year(user_id, tax_year)

        gross_income    = 0.0
        total_expenses  = 0.0
        total_rent_paid = 0.0

        for entry in pending_entries:
            gross_income    += float(entry.income)
            total_expenses  += sum(entry.expenses.values()) if entry.expenses else 0.0
            total_rent_paid += float(entry.expenses.get("rent", 0))

        return AssembledData(
            user_id            = user_id,
            entity_type        = entity_type,   # ← from JWT, not DB
            tax_year           = tax_year,
            gross_income       = gross_income,
            total_expenses     = total_expenses,
            total_rent_paid    = total_rent_paid,
            log_count          = len(pending_entries),
            all_year_log_count = len(all_year_entries),
            pending_entries    = pending_entries,
        )