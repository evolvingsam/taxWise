from rest_framework import serializers


class IntakeInputSerializer(serializers.Serializer):
    """user_id is NOT accepted here — it comes from the JWT token."""

    raw_text = serializers.CharField(
        max_length=2000,
        help_text="Plain-English description of your finances.",
    )
    source = serializers.ChoiceField(
        choices=["web", "voice", "api"],
        default="web",
    )


class ParsedDataSerializer(serializers.Serializer):
    income     = serializers.FloatField()
    expenses   = serializers.DictField(child=serializers.FloatField())
    user_type  = serializers.CharField()
    period     = serializers.CharField()
    confidence = serializers.FloatField()


class IntakeSuccessResponseSerializer(serializers.Serializer):
    status        = serializers.ChoiceField(choices=["success"])
    ledger_id     = serializers.UUIDField()
    parsed        = ParsedDataSerializer()
    intake_status = serializers.CharField()


class IntakePartialResponseSerializer(serializers.Serializer):
    status  = serializers.ChoiceField(choices=["partial_failure"])
    message = serializers.CharField()
    parsed  = ParsedDataSerializer()


class IntakeErrorResponseSerializer(serializers.Serializer):
    status  = serializers.ChoiceField(choices=["error"])
    message = serializers.CharField(required=False)
    errors  = serializers.DictField(required=False)



class LedgerEntrySerializer(serializers.Serializer):
    """Serializes a single IntakeLedgerEntry for history responses."""

    id            = serializers.UUIDField()
    user_type     = serializers.CharField()
    income        = serializers.DecimalField(max_digits=15, decimal_places=2)
    expenses      = serializers.DictField()
    period        = serializers.CharField()
    ai_confidence = serializers.DecimalField(max_digits=4, decimal_places=3)
    status        = serializers.CharField()
    created_at    = serializers.DateTimeField()
    updated_at    = serializers.DateTimeField()
    raw_text      = serializers.SerializerMethodField()

    def get_raw_text(self, obj) -> str:
        # Pull raw_text from the related IntakeRecord
        return obj.intake.raw_text if obj.intake else ""


class LedgerHistoryResponseSerializer(serializers.Serializer):
    status  = serializers.ChoiceField(choices=["success"])
    count   = serializers.IntegerField()
    results = LedgerEntrySerializer(many=True)


class LedgerDetailResponseSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=["success"])
    data   = LedgerEntrySerializer()

class VoiceIntakeSerializer(serializers.Serializer):
    """Accepts an audio file for voice-based financial intake."""

    audio = serializers.FileField(
        help_text=(
            "Audio file containing the user's financial description. "
            "Supported formats: mp3, mp4, wav, webm, ogg, m4a. Max size: 25MB."
        )
    )
    source = serializers.ChoiceField(
        choices=["web", "voice", "api"],
        default="voice",
    )


class VoiceIntakeSuccessResponseSerializer(serializers.Serializer):
    status        = serializers.ChoiceField(choices=["success"])
    ledger_id     = serializers.UUIDField()
    transcript    = serializers.CharField(help_text="The text Whisper extracted from your audio.")
    parsed        = ParsedDataSerializer()
    intake_status = serializers.CharField()


class VoiceIntakeErrorResponseSerializer(serializers.Serializer):
    status  = serializers.ChoiceField(choices=["error"])
    message = serializers.CharField()