from rest_framework import serializers


class IntakeInputSerializer(serializers.Serializer):
    """Payload the client sends to the Smart Intake endpoint."""

    user_id = serializers.CharField(
        max_length=128,
        help_text="Unique identifier for the user.",
    )
    raw_text = serializers.CharField(
        max_length=2000,
        help_text=(
            "Plain-English description of the user's finances. "
            "Example: 'I run a shop. My profit this week was ₦40,200 "
            "and I paid ₦15,000 rent.'"
        ),
    )
    source = serializers.ChoiceField(
        choices=["web", "voice", "api"],
        default="web",
        help_text="Origin of the intake request.",
    )


class ParsedDataSerializer(serializers.Serializer):
    """The structured financial data extracted by the AI layer."""

    income    = serializers.FloatField(help_text="Extracted income in NGN.")
    expenses  = serializers.DictField(
        child=serializers.FloatField(),
        help_text="Expense categories and amounts in NGN.",
    )
    user_type = serializers.CharField(help_text="individual | sme | corporate")
    period    = serializers.CharField(help_text="weekly | monthly | annual")
    confidence = serializers.FloatField(help_text="AI confidence score (0.0 - 1.0).")


class IntakeSuccessResponseSerializer(serializers.Serializer):
    """Returned when the full pipeline completes successfully."""

    status     = serializers.ChoiceField(choices=["success"])
    ledger_id  = serializers.UUIDField(help_text="ID of the saved IntakeLedgerEntry.")
    parsed     = ParsedDataSerializer(help_text="Structured data extracted by the AI.")
    intake_status = serializers.CharField(
        help_text="Always 'pending' — awaiting the Tax Engine."
    )


class IntakePartialResponseSerializer(serializers.Serializer):
    """Returned when AI parsing succeeded but DB write failed."""

    status  = serializers.ChoiceField(choices=["partial_failure"])
    message = serializers.CharField()
    parsed  = ParsedDataSerializer(help_text="AI result is still returned to the client.")


class IntakeErrorResponseSerializer(serializers.Serializer):
    """Returned on validation or unrecoverable failures."""

    status  = serializers.ChoiceField(choices=["error"])
    message = serializers.CharField(required=False)
    errors  = serializers.DictField(required=False)