from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class ParsedFinancialData:
    income:     float
    expenses:   dict  = field(default_factory=dict)
    user_type:  str   = "individual"   # individual | sme | corporate
    period:     str   = "monthly"      # weekly | monthly | annual
    raw_text:   str   = ""
    confidence: float = 0.0

    def to_dict(self) -> dict:
        return {
            "income":     self.income,
            "expenses":   self.expenses,
            "user_type":  self.user_type,
            "period":     self.period,
            "confidence": self.confidence,
        }


class BaseFinancialParser(ABC):
    """
    Abstract interface for all AI parsers.
    Swap OpenAI for any other provider without touching the pipeline.
    """

    @abstractmethod
    def parse(self, raw_text: str) -> ParsedFinancialData:
        raise NotImplementedError