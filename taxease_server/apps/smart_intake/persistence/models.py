import uuid
from django.db import models


class IntakeRecord(models.Model):
    """Raw intake — exactly what the user submitted."""

    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id    = models.CharField(max_length=128, db_index=True)
    source     = models.CharField(max_length=20, default="web")
    raw_text   = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"IntakeRecord({self.user_id}, {self.created_at:%Y-%m-%d})"


class IntakeLedgerEntry(models.Model):
    """
    Structured output of the AI parsing stage.
    Status 'pending' signals the Tax Engine that this entry needs processing.
    """

    STATUS_PENDING   = "pending"
    STATUS_PROCESSED = "processed"
    STATUS_FAILED    = "failed"

    STATUS_CHOICES = [
        (STATUS_PENDING,   "Pending"),
        (STATUS_PROCESSED, "Processed"),
        (STATUS_FAILED,    "Failed"),
    ]

    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    intake         = models.OneToOneField(
        IntakeRecord,
        on_delete=models.CASCADE,
        related_name="ledger_entry",
    )
    user_id        = models.CharField(max_length=128, db_index=True)
    user_type      = models.CharField(max_length=20)       # individual | sme | corporate
    income         = models.DecimalField(max_digits=15, decimal_places=2)
    expenses       = models.JSONField(default=dict)        # {"rent": 150000, ...}
    period         = models.CharField(max_length=20)       # weekly | monthly | annual
    ai_confidence  = models.DecimalField(max_digits=4, decimal_places=3)
    status         = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        db_index=True,
    )
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"LedgerEntry({self.user_id}, {self.status}, {self.created_at:%Y-%m-%d})"