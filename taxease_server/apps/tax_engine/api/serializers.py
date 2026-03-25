from rest_framework import serializers


class TaxBreakdownSerializer(serializers.Serializer):
    gross_income        = serializers.FloatField()
    deductions_applied  = serializers.FloatField()
    taxable_income      = serializers.FloatField()
    final_tax_owed      = serializers.FloatField()
    platform_filing_fee = serializers.FloatField()


class TaxCalculationResponseSerializer(serializers.Serializer):
    status          = serializers.ChoiceField(choices=["success", "exempt"])
    breakdown       = TaxBreakdownSerializer()
    tax_waec_result = serializers.CharField()
    message         = serializers.CharField()


class TaxErrorResponseSerializer(serializers.Serializer):
    status  = serializers.ChoiceField(choices=["error"])
    message = serializers.CharField()