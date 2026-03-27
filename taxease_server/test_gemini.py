import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taxease_server.settings')
django.setup()

from apps.smart_intake.ai_parsing.gemini_parser import GeminiFinancialParser

parser = GeminiFinancialParser()
text = "I run a shop. My profit this week was ₦40,200 and I paid ₦15,000 rent."
try:
    result = parser.parse(text)
    print(f"SUCCESS: {result}")
except Exception as e:
    print(f"ERROR: {e}")
