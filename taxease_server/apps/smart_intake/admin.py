from django.contrib import admin
from .persistence.models import IntakeRecord, IntakeLedgerEntry


@admin.register(IntakeRecord)
class IntakeRecordAdmin(admin.ModelAdmin):
    list_display  = ["id", "user_id", "source", "created_at"]
    list_filter   = ["source", "created_at"]
    search_fields = ["user_id", "raw_text"]
    readonly_fields = ["id", "created_at"]
    ordering      = ["-created_at"]


@admin.register(IntakeLedgerEntry)
class IntakeLedgerEntryAdmin(admin.ModelAdmin):
    list_display  = ["id", "user_id", "user_type", "income", "period", "status", "ai_confidence", "created_at"]
    list_filter   = ["status", "user_type", "period", "created_at"]
    search_fields = ["user_id"]
    readonly_fields = ["id", "intake", "created_at", "updated_at"]
    ordering      = ["-created_at"]