from django.contrib import admin
from .persistence.models import IntakeRecord, IntakeLedgerEntry

@admin.register(IntakeRecord)
class IntakeRecordAdmin(admin.ModelAdmin):
    list_display  = ["id", "user", "source", "created_at"]
    search_fields = ["user__email"]
    readonly_fields = ["id", "created_at"]

@admin.register(IntakeLedgerEntry)
class IntakeLedgerEntryAdmin(admin.ModelAdmin):
    list_display  = ["id", "user", "user_type", "income", "period", "status", "created_at"]
    list_filter   = ["status", "user_type"]
    search_fields = ["user__email"]
    readonly_fields = ["id", "created_at", "updated_at"]