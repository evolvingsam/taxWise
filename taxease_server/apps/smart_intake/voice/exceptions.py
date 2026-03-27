class TranscriptionError(Exception):
    """Raised when audio transcription fails."""
    pass

class AudioValidationError(TranscriptionError):
    """Raised when the uploaded audio file is invalid or unsupported."""
    pass

class TranscriptionServiceUnavailableError(TranscriptionError):
    """Raised when the transcription service is unreachable."""
    pass