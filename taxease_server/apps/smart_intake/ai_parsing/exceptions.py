class AIParsingError(Exception):
    """Raised when the AI layer fails to parse the intake text."""
    pass

class AIServiceUnavailableError(AIParsingError):
    """Raised when the AI API is unreachable."""
    pass