import uuid
from django.db import models
from django.conf import settings


class PaymentTransaction(models.Model):
    STATUS_PENDING = "pending"
    STATUS_PAID    = "paid"
    STATUS_FAILED  = "failed"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_PAID,    "Paid"),
        (STATUS_FAILED,  "Failed"),
    ]

    id                    = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user                  = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payment_transactions",
    )
    interswitch_tx_ref    = models.CharField(max_length=256, unique=True, db_index=True)
    interswitch_order_ref = models.CharField(max_length=256, blank=True)
    amount                = models.DecimalField(max_digits=10, decimal_places=2)
    status                = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        db_index=True,
    )
    rrr_code              = models.CharField(max_length=50, blank=True, null=True)
    tax_year              = models.IntegerField()
    raw_webhook_payload   = models.JSONField(default=dict)
    created_at            = models.DateTimeField(auto_now_add=True)
    updated_at            = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"PaymentTransaction({self.user.email}, {self.status})"