from django.contrib import admin
from .persistence.models import PaymentTransaction


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display  = ["user", "interswitch_tx_ref", "amount", "status", "rrr_code", "tax_year", "created_at"]
    list_filter   = ["status", "tax_year"]
    search_fields = ["user__email", "interswitch_tx_ref", "rrr_code"]
    readonly_fields = ["id", "created_at", "updated_at", "raw_webhook_payload"]