from django.contrib import admin
from .persistence.models import TaxCalculationResult


@admin.register(TaxCalculationResult)
class TaxCalculationResultAdmin(admin.ModelAdmin):
    list_display    = ["user", "tax_year", "status", "gross_income", "final_tax_owed", "waec_grade", "created_at"]
    list_filter     = ["status", "waec_grade", "tax_year"]
    search_fields   = ["user__email"]
    readonly_fields = ["id", "created_at"]