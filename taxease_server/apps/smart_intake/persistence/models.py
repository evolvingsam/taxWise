import uuid
from django.db import models
from django.conf import settings


class IntakeRecord(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user       = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="intake_records",
    )
    source     = models.CharField(max_length=20, default="web")
    raw_text   = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"IntakeRecord({self.user.email}, {self.created_at:%Y-%m-%d})"


class IntakeLedgerEntry(models.Model):
    STATUS_PENDING   = "pending"
    STATUS_PROCESSED = "processed"
    STATUS_FAILED    = "failed"

    STATUS_CHOICES = [
        (STATUS_PENDING,   "Pending"),
        (STATUS_PROCESSED, "Processed"),
        (STATUS_FAILED,    "Failed"),
    ]

    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    intake        = models.OneToOneField(
        IntakeRecord,
        on_delete=models.CASCADE,
        related_name="ledger_entry",
    )
    user          = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ledger_entries",
    )
    user_type     = models.CharField(max_length=20)
    income        = models.DecimalField(max_digits=15, decimal_places=2)
    expenses      = models.JSONField(default=dict)
    period        = models.CharField(max_length=20)
    ai_confidence = models.DecimalField(max_digits=4, decimal_places=3)
    status        = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        db_index=True,
    )
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"LedgerEntry({self.user.email}, {self.status})"