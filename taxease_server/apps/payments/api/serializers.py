from rest_framework import serializers


class InitiatePaymentSerializer(serializers.Serializer):
    """Backend generates tx_ref — frontend only sends amount and tax_year."""
    amount   = serializers.FloatField(help_text="Amount in NGN.")
    tax_year = serializers.IntegerField(help_text="Tax year this payment covers.")


class WebhookPayloadSerializer(serializers.Serializer):
    """Interswitch webhook payload."""

    txnref = serializers.CharField(help_text="Transaction reference.")
    amount = serializers.CharField(help_text="Amount paid (as string from Interswitch).")
    resp   = serializers.CharField(help_text="Response code. '00' means success.")
    hash   = serializers.CharField(help_text="SHA-512 signature for verification.")


class PaymentSuccessResponseSerializer(serializers.Serializer):
    status   = serializers.ChoiceField(choices=["success"])
    rrr_code = serializers.CharField(help_text="Government payment reference e.g. NRS-4829-1102.")
    message  = serializers.CharField()


class PaymentErrorResponseSerializer(serializers.Serializer):
    status  = serializers.ChoiceField(choices=["error"])
    message = serializers.CharField()


class InitiatePaymentResponseSerializer(serializers.Serializer):
    status  = serializers.ChoiceField(choices=["success"])
    message = serializers.CharField()
    tx_ref  = serializers.CharField()