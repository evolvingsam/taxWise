import io
from abc import ABC, abstractmethod

from google import genai
from google.genai import types
from django.conf import settings

from .exceptions import (
    TranscriptionError,
    AudioValidationError,
    TranscriptionServiceUnavailableError,
)
from ..utils.logging import get_logger

logger = get_logger(__name__)

SUPPORTED_FORMATS   = {"mp3", "mp4", "mpeg", "mpga", "m4a", "wav", "webm", "ogg"}
MAX_FILE_SIZE_MB    = 25
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

AUDIO_MIME_TYPES = {
    "mp3":  "audio/mpeg",
    "mp4":  "audio/mp4",
    "mpeg": "audio/mpeg",
    "mpga": "audio/mpeg",
    "m4a":  "audio/mp4",
    "wav":  "audio/wav",
    "webm": "audio/webm",
    "ogg":  "audio/ogg",
}

TRANSCRIPTION_PROMPT = """
Listen to this audio and transcribe exactly what the speaker says.
The speaker is describing their personal or business finances in Nigeria.
They may mention Naira amounts, income, profit, sales, rent, or expenses.
Return ONLY the transcribed text — no commentary, no formatting, no explanation.
"""


class BaseTranscriber(ABC):
    """
    Abstract interface for all transcription providers.
    Swap Gemini for any other provider without touching the pipeline.
    """

    @abstractmethod
    def transcribe(self, audio_file) -> str:
        raise NotImplementedError


class GeminiAudioTranscriber(BaseTranscriber):
    """
    Transcribes audio using Google Gemini's multimodal capability.
    Sends the audio file inline as base64 and prompts for transcription.
    No separate Whisper/OpenAI dependency needed.
    """

    def __init__(self):
        self.client     = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = getattr(settings, "GEMINI_MODEL", "gemini-2.5-flash")

    def transcribe(self, audio_file) -> str:
        self._validate(audio_file)

        extension = audio_file.name.rsplit(".", 1)[-1].lower()
        mime_type = AUDIO_MIME_TYPES.get(extension, "audio/mpeg")

        logger.info(
            "Transcribing audio via Gemini. filename=%s size=%d mime=%s",
            audio_file.name, audio_file.size, mime_type,
        )

        try:
            audio_file.seek(0)
            audio_bytes = audio_file.read()

            response = self.client.models.generate_content(
                model    = self.model_name,
                contents = [
                    types.Part.from_bytes(
                        data      = audio_bytes,
                        mime_type = mime_type,
                    ),
                    TRANSCRIPTION_PROMPT,
                ],
                config = types.GenerateContentConfig(
                    temperature      = 0.0,    # deterministic — transcription only
                    max_output_tokens = 1000,
                    safety_settings  = [
                        types.SafetySetting(
                            category  = types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                            threshold = types.HarmBlockThreshold.BLOCK_ONLY_HIGH,
                        ),
                        types.SafetySetting(
                            category  = types.HarmCategory.HARM_CATEGORY_HARASSMENT,
                            threshold = types.HarmBlockThreshold.BLOCK_ONLY_HIGH,
                        ),
                        types.SafetySetting(
                            category  = types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                            threshold = types.HarmBlockThreshold.BLOCK_ONLY_HIGH,
                        ),
                        types.SafetySetting(
                            category  = types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                            threshold = types.HarmBlockThreshold.BLOCK_ONLY_HIGH,
                        ),
                    ],
                )
            )

            if not response.text:
                logger.error("Gemini returned empty transcription response.")
                raise TranscriptionError("Could not transcribe audio — empty response.")

            transcript = response.text.strip()
            logger.info("Transcription complete. length=%d", len(transcript))
            logger.debug("Transcript: %s", transcript)
            return transcript

        except TranscriptionError:
            raise

        except Exception as e:
            if "quota" in str(e).lower() or "429" in str(e) or "unavailable" in str(e).lower():
                logger.error("Gemini transcription service unavailable: %s", str(e))
                raise TranscriptionServiceUnavailableError(
                    "Voice transcription service is currently unavailable. Please try again."
                ) from e

            logger.error("Gemini transcription failed: %s", str(e), exc_info=True)
            raise TranscriptionError("Could not transcribe audio. Please try again.") from e

    def _validate(self, audio_file):
        if audio_file.size > MAX_FILE_SIZE_BYTES:
            raise AudioValidationError(
                f"Audio file too large. Maximum size is {MAX_FILE_SIZE_MB}MB."
            )

        extension = audio_file.name.rsplit(".", 1)[-1].lower()
        if extension not in SUPPORTED_FORMATS:
            raise AudioValidationError(
                f"Unsupported audio format '{extension}'. "
                f"Supported: {', '.join(sorted(SUPPORTED_FORMATS))}."
            )

        logger.debug("Audio validation passed. ext=%s size=%d", extension, audio_file.size)