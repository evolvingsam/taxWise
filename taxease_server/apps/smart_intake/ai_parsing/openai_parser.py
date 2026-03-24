import json

from openai import OpenAI, APIConnectionError, APIStatusError
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


class OpenAIFinancialParser(BaseFinancialParser):

    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model  = getattr(settings, "OPENAI_MODEL", "gpt-4o-mini")

    def parse(self, raw_text: str) -> ParsedFinancialData:
        logger.info("Sending text to OpenAI parser. length=%d", len(raw_text))

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user",   "content": raw_text},
                ],
                temperature=0.1,
                max_tokens=300,
            )

            raw_json = response.choices[0].message.content.strip()
            logger.debug("Raw AI response: %s", raw_json)

            data = json.loads(raw_json)

            return ParsedFinancialData(
                income     = float(data.get("income", 0.0)),
                expenses   = data.get("expenses", {}),
                user_type  = data.get("user_type", "individual"),
                period     = data.get("period", "monthly"),
                raw_text   = raw_text,
                confidence = float(data.get("confidence", 0.5)),
            )

        except APIConnectionError as e:
            logger.error("OpenAI unreachable: %s", str(e))
            raise AIServiceUnavailableError("AI service is currently unavailable.") from e

        except APIStatusError as e:
            logger.error("OpenAI API error [%s]: %s", e.status_code, str(e))
            raise AIParsingError(f"AI API returned an error: {e.status_code}") from e

        except (json.JSONDecodeError, KeyError, ValueError) as e:
            logger.error("Failed to parse AI response: %s", str(e))
            raise AIParsingError("AI returned an unparseable response.") from e