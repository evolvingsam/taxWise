from django.contrib import admin
from .persistence.models import TaxProfile, TaxCalculationResult


@admin.register(TaxProfile)
class TaxProfileAdmin(admin.ModelAdmin):
    list_display  = ["user_id", "entity_type", "created_at"]
    list_filter   = ["entity_type"]
    search_fields = ["user_id"]
    readonly_fields = ["id", "created_at", "updated_at"]


@admin.register(TaxCalculationResult)
class TaxCalculationResultAdmin(admin.ModelAdmin):
    list_display  = ["user_id", "tax_year", "status", "gross_income", "final_tax_owed", "waec_grade", "created_at"]
    list_filter   = ["status", "waec_grade", "tax_year"]
    search_fields = ["user_id"]
    readonly_fields = ["id", "created_at"]