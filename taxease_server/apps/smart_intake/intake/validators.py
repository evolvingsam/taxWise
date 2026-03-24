from dataclasses import dataclass

@dataclass
class RawIntakePayload:
    user_id:  str
    raw_text: str
    source:   str = "web"   # "web" | "voice" | "api"

    def validate(self):
        if not self.raw_text or not self.raw_text.strip():
            raise ValueError("raw_text cannot be empty.")
        if len(self.raw_text) > 2000:
            raise ValueError("Input exceeds maximum allowed length of 2000 characters.")
        if not self.user_id:
            raise ValueError("user_id is required.")