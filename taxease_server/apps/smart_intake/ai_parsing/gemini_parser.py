import json
import google.genai as genai
from django.conf import settings

from .parser import BaseFinancialParser, ParsedFinancialData
from .exceptions import AIParsingError, AIServiceUnavailableError
from ..utils.logging import get_logger

logger = get_logger(__name__)

SYSTEM_PROMPT = """
You are a Nigerian tax intake assistant. Extract financial data from the
user's plain-English description and return ONLY a valid JSON object with
this exact schema:

{
  "income": <float>,
  "expenses": { "<category>": <float> },
  "user_type": "<individual|sme|corporate>",
  "period": "<weekly|monthly|annual>",
  "confidence": <float between 0 and 1>
}

Rules:
- All monetary values in Nigerian Naira (NGN).
- If the period is not stated, default to "monthly".
- If user_type is unclear, default to "individual".
- Return ONLY the JSON. No prose, no markdown, no explanation.
"""


class GeminiFinancialParser(BaseFinancialParser):

    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(
            model_name=getattr(settings, "GEMINI_MODEL", "gemini-1.5-flash"),
            system_instruction=SYSTEM_PROMPT,
        )

    def parse(self, raw_text: str) -> ParsedFinancialData:
        logger.info("Sending text to Gemini parser. length=%d", len(raw_text))

        try:
            response = self.model.generate_content(
                raw_text,
                generation_config=genai.GenerationConfig(
                    temperature=0.1,
                    max_output_tokens=300,
                )
            )

            raw_json = response.text.strip()

            # Strip markdown fences if Gemini adds them
            if raw_json.startswith("```"):
                raw_json = raw_json.split("```")[1]
                if raw_json.startswith("json"):
                    raw_json = raw_json[4:]
            raw_json = raw_json.strip()

            logger.debug("Raw Gemini response: %s", raw_json)
            data = json.loads(raw_json)

            return ParsedFinancialData(
                income     = float(data.get("income", 0.0)),
                expenses   = data.get("expenses", {}),
                user_type  = data.get("user_type", "individual"),
                period     = data.get("period", "monthly"),
                raw_text   = raw_text,
                confidence = float(data.get("confidence", 0.5)),
            )

        except Exception as e:
            if "quota" in str(e).lower() or "unavailable" in str(e).lower():
                logger.error("Gemini service unavailable: %s", str(e))
                raise AIServiceUnavailableError("AI service is currently unavailable.") from e

            logger.error("Gemini parsing failed: %s", str(e))
            raise AIParsingError("AI returned an unparseable response.") from e