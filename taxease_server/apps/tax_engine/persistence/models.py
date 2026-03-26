import uuid
from django.db import models
from django.conf import settings


class TaxCalculationResult(models.Model):
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
    user                = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tax_results",
    )
    tax_year            = models.IntegerField()
    status              = models.CharField(max_length=20, choices=STATUS_CHOICES)
    gross_income        = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    deductions_applied  = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    taxable_income      = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    final_tax_owed      = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    platform_filing_fee = models.DecimalField(max_digits=10, decimal_places=2, default=1000)
    waec_grade          = models.CharField(max_length=1, choices=WAEC_CHOICES, null=True, blank=True)
    log_count           = models.IntegerField(default=0)
    message             = models.TextField(blank=True)
    created_at          = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"TaxResult({self.user.email}, {self.tax_year}, {self.status})"