import re
import json
from pydantic import BaseModel, Field
from typing import Optional
from google import genai
from google.genai import types
from django.conf import settings

from .parser import BaseFinancialParser, ParsedFinancialData
from .exceptions import AIParsingError, AIServiceUnavailableError
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


# ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """
You are a Nigerian tax intake assistant. Extract financial data from the
user's plain-English description. All monetary values must be interpreted as Nigerian Naira (NGN).

CRITICAL INSTRUCTION: Return ONLY the raw JSON object. Do not include any conversational text like "Here is the JSON", and do not use Markdown formatting (e.g., ```json). Your response must begin with { and end with }.
"""


# ─── PARSER CLASS ─────────────────────────────────────────────────────────────

class GeminiFinancialParser(BaseFinancialParser):

    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        # Defaulting to the stable model. 
        # NOTE: Ensure your .env file does not override this with a 404 model!
        self.model_name = getattr(settings, "GEMINI_MODEL", "gemini-2.5-flash")

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
                    
                    # Lowered safety thresholds to prevent silent blocks on financial terms
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

            # Check if Gemini blocked the output despite the lowered thresholds
            if not response.text:
                if response.candidates and response.candidates[0].finish_reason:
                    reason = response.candidates[0].finish_reason
                    logger.error(f"Gemini blocked generation. Reason: {reason}")
                else:
                    logger.error(f"Gemini returned an empty response. Raw: {response}")
                
                raise AIParsingError("AI returned an empty response (possibly blocked by safety filters).")

            # Access the parsed Pydantic object
            extracted = response.parsed

            # Fallback manual parse if Pydantic rejected the JSON due to strict formatting issues
            if not extracted:
                logger.warning("response.parsed was None. Falling back to manual JSON parse.")
                raw_response = response.text
                
                # Use regex to extract only the JSON payload between brackets
                match = re.search(r'(\{.*\})', raw_response, re.DOTALL)
                
                if not match:
                    logger.error(f"Failed to find JSON block in: {raw_response}")
                    raise AIParsingError("AI returned an unparseable response.")
                
                data = json.loads(match.group(1))
                safe_expenses = data.get("expenses") or []
                
                # Safely map the fallback dict
                expenses_dict = {}
                for item in safe_expenses:
                    if isinstance(item, dict):
                        expenses_dict[item.get("category", "")] = item.get("amount", 0.0)
                
                return ParsedFinancialData(
                    income     = float(data.get("income", 0.0)),
                    expenses   = expenses_dict,
                    user_type  = data.get("user_type", "individual"),
                    period     = data.get("period", "monthly"),
                    raw_text   = raw_text,
                    confidence = float(data.get("confidence", 0.5)),
                )

            # ── If Pydantic parsing succeeded ──
            
            # Safely handle if the AI returned null instead of an empty list
            safe_expenses = extracted.expenses if extracted.expenses is not None else []
            
            # Convert the list of ExpenseItems back into a standard dictionary for your app
            expenses_dict = {item.category: item.amount for item in safe_expenses}

            logger.debug("Successfully parsed Gemini response.")

            return ParsedFinancialData(
                income     = extracted.income or 0.0,
                expenses   = expenses_dict,
                user_type  = extracted.user_type or "individual",
                period     = extracted.period or "monthly",
                raw_text   = raw_text,
                confidence = extracted.confidence or 0.5,
            )

        except json.JSONDecodeError as e:
            logger.error(f"Manual JSON decode failed: {str(e)}")
            raise AIParsingError("AI returned an unparseable response.") from e

        except Exception as e:
            if "quota" in str(e).lower() or "unavailable" in str(e).lower():
                logger.error("Gemini service unavailable: %s", str(e))
                raise AIServiceUnavailableError("AI service is currently unavailable.") from e

            logger.error("Gemini parsing failed: %s", str(e))
            raise AIParsingError("AI returned an unparseable response.") from e