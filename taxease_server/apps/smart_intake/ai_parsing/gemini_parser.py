import re
import json
from pydantic import BaseModel, Field
from typing import Optional
from google import genai
from google.genai import types
from django.conf import settings

from .parser import BaseFinancialParser, ParsedFinancialData
from .exceptions import AIParsingError, AIServiceUnavailableError, NoFinancialDataError
from ..utils.logging import get_logger

logger = get_logger(__name__)

# ─── PYDANTIC SCHEMAS ─────────────────────────────────────────────────────────

class ExpenseItem(BaseModel):
    category: str = Field(description="The category of the expense (e.g., rent, food, transport, marketing).")
    amount: float = Field(description="The amount spent in NGN.")

class FinancialExtractionSchema(BaseModel):
    income: Optional[float] = Field(
        default=0.0, 
        description="Total income in Nigerian Naira (NGN)."
    )
    expenses: Optional[list[ExpenseItem]] = Field(
        default_factory=list, 
        description="A list of all expenses extracted from the text. Return an empty list if none."
    )
    user_type: Optional[str] = Field(
        default="individual",
        description="The type of entity: individual, sme, or corporate."
    )
    period: Optional[str] = Field(
        default="monthly",
        description="The time period: weekly, monthly, or annual."
    )
    confidence: Optional[float] = Field(
        default=0.5,
        ge=0.0, le=1.0, 
        description="Confidence score of the extraction between 0.0 and 1.0."
    )
    has_financial_data: bool = Field(       # ← new field
        default=False,
        description=(
            "Set to true ONLY if the text contains actual financial information "
            "such as income, revenue, profit, sales, or expenses. "
            "Set to false if the text is random, irrelevant, or contains no financial data."
        )
    )


# ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """
You are a Nigerian tax intake assistant. Extract financial data from the
user's plain-English description. All monetary values must be interpreted as Nigerian Naira (NGN).

IMPORTANT: Set has_financial_data to true ONLY if the text contains real financial 
information such as income, profit, revenue, sales, or expenses.
If the text is random, a greeting, irrelevant, or contains no financial data at all,
set has_financial_data to false and leave all other fields at their defaults.
"""

# ─── PARSER CLASS ─────────────────────────────────────────────────────────────

class GeminiFinancialParser(BaseFinancialParser):

    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        self.model_name = getattr(settings, "GEMINI_MODEL", "gemini-2.5-flash")
    
    def _validate_has_financial_data(
        self,
        has_financial_data: bool,
        income: float,
        expenses: dict,
        confidence: float,
        raw_text: str,
    ):
        """
        Rejects intake if the AI determined there is no financial data,
        or if the extracted values are all zero with very low confidence.
        """
        no_data_flag    = not has_financial_data
        no_income       = income == 0.0
        no_expenses     = len(expenses) == 0
        low_confidence  = confidence < 0.3

        if no_data_flag or (no_income and no_expenses and low_confidence):
            logger.warning(
                "No financial data detected. has_financial_data=%s income=%.2f "
                "expenses=%s confidence=%.2f raw_text='%s'",
                has_financial_data, income, expenses, confidence, raw_text[:80],
            )
            raise NoFinancialDataError(
                "No financial information found in your input. "
                "Please describe your income or expenses."
            )

    def parse(self, raw_text: str) -> ParsedFinancialData:
        logger.info("Sending text to Gemini (google-genai). length=%d", len(raw_text))

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=raw_text,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    temperature=0.1,
                    max_output_tokens=300,
                    response_mime_type="application/json",
                    response_schema=FinancialExtractionSchema,
                    safety_settings=[
                        types.SafetySetting(
                            category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                            threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH,
                        ),
                        types.SafetySetting(
                            category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
                            threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH,
                        ),
                        types.SafetySetting(
                            category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                            threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH,
                        ),
                        types.SafetySetting(
                            category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                            threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH,
                        ),
                    ]
                )
            )

            if not response.text:
                if response.candidates and response.candidates[0].finish_reason:
                    reason = response.candidates[0].finish_reason
                    logger.error("Gemini blocked generation. Reason: %s", reason)
                else:
                    logger.error("Gemini returned empty response. Raw: %s", response)
                raise AIParsingError("AI returned an empty response.")

            logger.debug("Raw Gemini response text: %s", response.text)

            extracted = response.parsed

            if extracted is not None:
                # Guard against Gemini returning null fields when no financial data found
                if not extracted.has_financial_data:
                    self._validate_has_financial_data(
                        has_financial_data = False,
                        income             = 0.0,
                        expenses           = {},
                        confidence         = 0.0,
                        raw_text           = raw_text,
                    )

                expenses_dict = {
                    item.category: item.amount
                    for item in (extracted.expenses or [])   # ← guard against None
                }

                self._validate_has_financial_data(
                    has_financial_data = extracted.has_financial_data or False,
                    income             = extracted.income or 0.0,
                    expenses           = expenses_dict,
                    confidence         = extracted.confidence or 0.0,
                    raw_text           = raw_text,
                )

                return ParsedFinancialData(
                    income     = extracted.income or 0.0,
                    expenses   = expenses_dict,
                    user_type  = extracted.user_type or "individual",
                    period     = extracted.period or "monthly",
                    raw_text   = raw_text,
                    confidence = extracted.confidence or 0.0,
                )

            else:
                logger.warning("response.parsed was None. Falling back to manual JSON parse.")
                import json

                raw_json = response.text.strip()
                if "```" in raw_json:
                    parts    = raw_json.split("```")
                    raw_json = parts[1] if len(parts) >= 2 else raw_json
                    if raw_json.lower().startswith("json"):
                        raw_json = raw_json[4:]
                raw_json = raw_json.strip()

                data = json.loads(raw_json)

                raw_expenses = data.get("expenses", {})
                if isinstance(raw_expenses, list):
                    expenses_dict = {
                        item.get("category", "other"): float(item.get("amount", 0))
                        for item in raw_expenses
                    }
                elif isinstance(raw_expenses, dict):
                    expenses_dict = {k: float(v) for k, v in raw_expenses.items()}
                else:
                    expenses_dict = {}

                # ── Validate financial content ─────────────────────────────────
                self._validate_has_financial_data(
                    has_financial_data = data.get("has_financial_data", False),
                    income             = float(data.get("income", 0.0)),
                    expenses           = expenses_dict,
                    confidence         = float(data.get("confidence", 0.5)),
                    raw_text           = raw_text,
                )

                return ParsedFinancialData(
                    income     = float(data.get("income", 0.0)),
                    expenses   = expenses_dict,
                    user_type  = data.get("user_type", "individual"),
                    period     = data.get("period", "monthly"),
                    raw_text   = raw_text,
                    confidence = float(data.get("confidence", 0.5)),
                )

        except (AIParsingError, AIServiceUnavailableError, NoFinancialDataError):
            raise   # let these bubble up cleanly

        except Exception as e:
            if "quota" in str(e).lower() or "unavailable" in str(e).lower() or "429" in str(e):
                logger.error("Gemini service unavailable: %s", str(e))
                raise AIServiceUnavailableError("AI service is currently unavailable.") from e
            logger.error("Gemini parsing failed: %s", str(e))
            raise AIParsingError("AI returned an unparseable response.") from e