import uuid
from django.db import models


class TaxProfile(models.Model):
    """
    Stores the user's entity type.
    Created once per user, updated as their status changes.
    """

    ENTITY_INDIVIDUAL = "individual"
    ENTITY_SME        = "sme"
    ENTITY_CORPORATE  = "corporate"

    ENTITY_CHOICES = [
        (ENTITY_INDIVIDUAL, "Individual"),
        (ENTITY_SME,        "SME"),
        (ENTITY_CORPORATE,  "Corporate"),
    ]

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id     = models.CharField(max_length=128, unique=True, db_index=True)
    entity_type = models.CharField(max_length=20, choices=ENTITY_CHOICES, default=ENTITY_INDIVIDUAL)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"TaxProfile({self.user_id}, {self.entity_type})"


class TaxCalculationResult(models.Model):
    """
    Stores the output of every tax calculation run.
    One record per calculation — full audit trail.
    """

    STATUS_SUCCESS = "success"
    STATUS_EXEMPT  = "exempt"
    STATUS_FAILED  = "failed"

    STATUS_CHOICES = [
        (STATUS_SUCCESS, "Success"),
        (STATUS_EXEMPT,  "Exempt"),
        (STATUS_FAILED,  "Failed"),
    ]

    WAEC_CHOICES = [("A", "A"), ("B", "B"), ("C", "C"), ("D", "D"), ("F", "F")]

    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id             = models.CharField(max_length=128, db_index=True)
    tax_year            = models.IntegerField()
    status              = models.CharField(max_length=20, choices=STATUS_CHOICES)

    # Breakdown
    gross_income        = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    deductions_applied  = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    taxable_income      = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    final_tax_owed      = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    platform_filing_fee = models.DecimalField(max_digits=10, decimal_places=2, default=1000)

    # WAEC
    waec_grade          = models.CharField(max_length=1, choices=WAEC_CHOICES, null=True, blank=True)
    log_count           = models.IntegerField(default=0)

    message             = models.TextField(blank=True)
    created_at          = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"TaxResult({self.user_id}, {self.tax_year}, {self.status})"