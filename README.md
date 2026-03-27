# TaxEase — AI-Powered Nigerian Tax Filing Platform

> **The intelligent tax filing and financial identity platform for every Nigerian.**

TaxEase replaces 20-page tax forms with a conversational AI interface. A market trader, freelancer, or corporate employee describes their finances in plain English — TaxEase handles the rest: parsing, calculation, filing, and compliance scoring.

---

## 🔗 Important Links

| Resource | URL |
|---|---|
| **Live API (Backend)** | https://taxease-rpkq.onrender.com |
| **Swagger UI (Interactive Docs)** | https://taxease-rpkq.onrender.com/api/docs/ |
| **ReDoc (Reference Docs)** | https://taxease-rpkq.onrender.com/api/redoc/ |
| **Frontend Repository** | _(add your frontend repo link here)_ |
| **Backend Repository** | _(add your backend repo link here)_ |

---

## 🧪 Test Credentials

Use these pre-seeded credentials to test the platform without registering:

| Role | Email | Password |
|---|---|---|
| Individual User | `test_individual@taxease.com` | `testpass123` |
| SME User | `test_sme@taxease.com` | `testpass123` |
| Corporate User | `test_corporate@taxease.com` | `testpass123` |
| Admin | `admin@taxease.com` | `adminpass123` |

> Admin panel: https://taxease-rpkq.onrender.com/admin/

---

## 🏗️ Architecture Overview

TaxEase is built as a **microservice-style Django monorepo** with four loosely coupled apps, each with a single responsibility:

```
taxease_server/
├── apps/
│   ├── accounts/        → Authentication (JWT), user profiles, user types
│   ├── smart_intake/    → AI parsing of plain-English financial text → Ledger
│   │   └── voice/       → Audio transcription (Whisper) → feeds into intake pipeline
│   ├── tax_engine/      → 2026 Nigerian tax rules, WAEC compliance grading
│   └── payments/        → Interswitch payment processing, RRR generation
```

Each app follows the same internal structure:
```
app/
├── api/           → Views + Serializers (HTTP layer only)
├── pipeline/      → Orchestrator (wires stages together)
├── persistence/   → Models + Repository (DB layer only)
├── voice/         → Transcription layer (smart_intake only)
└── utils/         → Logging
```

**Design principles:** SOLID, DRY, separation of concerns, loose coupling. No single failure breaks the app — every stage fails independently with full error logging.

---

## 🔄 User Journey (End to End)

### 1. Register
```
POST /api/accounts/register/
```
User creates an account with their email, name, and entity type (`individual`, `sme`, or `corporate`). Entity type determines which 2026 tax rules apply.

### 2. Login
```
POST /api/accounts/login/
```
Returns a JWT **access token** (60 min) and **refresh token** (7 days). All subsequent requests require:
```
Authorization: Bearer <access_token>
```

### 3. Submit Financial Intake (Text)
```
POST /api/smart-intake/
Body: { "raw_text": "My profit this week was ₦40,200 and I paid ₦15,000 rent." }
```
The AI layer (Google Gemini) parses the plain-English text into structured financial data:
```json
{
  "income": 40200.0,
  "expenses": { "rent": 15000.0 },
  "user_type": "individual",
  "period": "weekly",
  "confidence": 0.94
}
```
This is saved as a **pending** `IntakeLedgerEntry`. Repeat this step multiple times to build financial history.

### 3b. Submit Financial Intake (Voice) 🎙️
```
POST /api/smart-intake/voice/
Body: multipart/form-data — audio file (mp3, wav, webm, m4a, ogg. Max 25MB)
```
User records themselves describing their finances out loud. The voice pipeline runs in two stages:

**Stage 1 — Transcription:** The audio file is sent to **Gemini Whisper**, which transcribes it to text. The Whisper prompt is tuned for Nigerian financial terminology (Naira amounts, business income, rent, expenses).

**Stage 2 — Same pipeline as text:** The transcript is passed directly into the existing Gemini AI parsing pipeline. The result is identical to a text intake — a pending `IntakeLedgerEntry` saved to the database.

The response includes the transcript so the user can verify what was understood:
```json
{
  "status": "success",
  "transcript": "My profit this week was 40,200 naira and I paid 15,000 for rent.",
  "ledger_id": "a1b2c3d4-...",
  "intake_status": "pending",
  "parsed": {
    "income": 40200.0,
    "expenses": { "rent": 15000.0 },
    "period": "weekly",
    "confidence": 0.91
  }
}
```

> **Input validation:** Both text and voice intake reject random or non-financial input. If no income or expenses are detected, nothing is saved to the ledger and the user receives a clear error message.

### 4. View Ledger History
```
GET /api/smart-intake/ledger/
GET /api/smart-intake/ledger/<uuid>/
```
Returns all past intake submissions. Users can only see their own entries.

### 5. Calculate Tax
```
GET /api/tax/calculate/
```
Triggers the full 2026 Nigerian tax pipeline:

| Stage | What happens |
|---|---|
| **Data Assembly** | Aggregates all pending ledger entries — income, expenses, rent paid |
| **WAEC Grading** | Grades compliance frequency (A–F) based on number of logs |
| **Exemption Filter** | Individuals ≤ ₦800k or SMEs ≤ ₦100M → zero tax, stop here |
| **Deduction Filter** | Rent relief applied (capped at ₦500k or 20% of income) |
| **Bracket Calculator** | Progressive 2026 PAYE brackets (0% → 25%) applied to taxable income |

Returns a full breakdown + WAEC grade + filing instructions.

### 6. Initiate Payment
```
POST /api/payments/initiate/
Body: { "amount": 1000.00, "tax_year": 2026 }
```
Backend generates a unique transaction reference (`TAXEASE-{id}-{timestamp}-{random}`), creates a pending `PaymentTransaction` record, and returns the `tx_ref` to the frontend.

### 7. Pay via Interswitch
The React frontend opens the **Interswitch WebPay modal** using the `tx_ref`. User pays the ₦1,000 platform filing fee.

### 8. Webhook Processing
```
POST /api/payments/webhooks/interswitch/
```
Interswitch fires a silent webhook. Django:
1. Verifies the SHA-512 signature
2. Confirms `resp === "00"` (success code)
3. Generates the government **RRR code** (`NRS-XXXX-XXXX`)
4. Marks transaction as `paid`
5. Upgrades user's WAEC grade to **A**

### 9. Get RRR
```
GET /api/payments/transaction/<tx_ref>/
```
Frontend polls this endpoint and displays the RRR to the user. They use this code to complete their tax remittance via their bank app.

---

## 📐 2026 Nigerian Tax Rules Implemented

### PAYE Brackets (Individuals)
| Income Band | Rate |
|---|---|
| First ₦800,000 | 0% |
| Next ₦2,200,000 | 15% |
| Next ₦4,000,000 | 18% |
| Next ₦6,000,000 | 21% |
| Above ₦13,000,000 | 25% |

### Exemptions
| Entity | Threshold |
|---|---|
| Individual | ≤ ₦800,000 annual income |
| SME | ≤ ₦100,000,000 annual income |
| Corporate | 30% flat rate, no exemption |

### Deductions
- **Rent Relief:** Capped at the lowest of: actual rent paid, ₦500,000, or 20% of gross income

### WAEC Compliance Grade
| Logs This Year | Grade |
|---|---|
| 20+ | A |
| 10–19 | B |
| 5–9 | C |
| 1–4 | D |
| 0 | F |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | Django 4.2 + Django REST Framework |
| Authentication | SimpleJWT (JWT tokens) |
| AI Parser | Google Gemini (`gemini-2.5-flash`) |
| Voice Transcription | Gemini Whisper (`whisper-1`) |
| Payment Gateway | Interswitch WebPay |
| API Documentation | drf-spectacular (Swagger UI + ReDoc) |
| Database (dev) | SQLite |
| Database (prod) | PostgreSQL (via Render) |
| Deployment | Render |
| Config Management | python-decouple |

---

## 🚀 Running Locally

### Prerequisites
- Python 3.12+
- pip
- A Gemini API key — free at https://aistudio.google.com/apikey

### Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd taxease_server

# 2. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
cp .env.example .env
# Fill in your values (see Environment Variables section below)

# 5. Run migrations
python manage.py migrate

# 6. Create a superuser (optional)
python manage.py createsuperuser

# 7. Start the server
python manage.py runserver
```

Visit:
- **Swagger UI:** http://localhost:8000/api/docs/
- **Admin:** http://localhost:8000/admin/

---

## ⚙️ Environment Variables

Create a `.env` file at the project root. See `.env.example` for the template:

```bash
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# AI — Text Parsing
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# AI — Voice Transcription
Gemini_API_KEY=your-Gemini-api-key

# Payments
INTERSWITCH_PRODUCT_ID=your-product-id
INTERSWITCH_SECRET_KEY=your-mac-key

# Database (leave blank for SQLite in development)
DATABASE_URL=
```

---

## 📡 API Reference

All endpoints are fully documented and testable via Swagger UI:
> https://taxease-rpkq.onrender.com/api/docs/

### Quick Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/accounts/register/` | None | Register new user |
| POST | `/api/accounts/login/` | None | Login, get JWT tokens |
| POST | `/api/accounts/token/refresh/` | None | Refresh access token |
| POST | `/api/accounts/logout/` | ✅ | Blacklist refresh token |
| GET | `/api/accounts/me/` | ✅ | Get current user profile |
| PATCH | `/api/accounts/me/` | ✅ | Update profile |
| POST | `/api/smart-intake/` | ✅ | Submit text financial intake |
| POST | `/api/smart-intake/voice/` | ✅ | Submit voice financial intake (audio file) |
| GET | `/api/smart-intake/ledger/` | ✅ | Get ledger history |
| GET | `/api/smart-intake/ledger/<uuid>/` | ✅ | Get single ledger entry |
| GET | `/api/tax/calculate/` | ✅ | Run tax calculation |
| POST | `/api/payments/initiate/` | ✅ | Initiate payment |
| POST | `/api/payments/webhooks/interswitch/` | None | Interswitch webhook |
| GET | `/api/payments/transaction/<tx_ref>/` | ✅ | Get transaction + RRR |

---

## 🔐 Authentication

TaxEase uses JWT authentication via SimpleJWT.

**Login to get tokens:**
```bash
curl -X POST https://taxease-rpkq.onrender.com/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test_individual@taxease.com", "password": "testpass123"}'
```

**Use the access token on protected endpoints:**
```bash
curl https://taxease-rpkq.onrender.com/api/tax/calculate/ \
  -H "Authorization: Bearer <your_access_token>"
```

**In Swagger UI:** Click the **Authorize** button (top right), paste your access token, click Authorize. All protected endpoints will now work.

---

## 💡 The WAEC Score (Vision)

Every time a user files — even a zero-tax return — TaxEase records a verified financial event. Over time, this builds an **WAEC Score**: an alternative credit rating based on tax compliance rather than traditional banking history.

Partner banks and lenders can use the WAEC Score API to extend credit to the informal sector — turning tax filing into a wealth-building tool for the 80 million Nigerians currently excluded from formal finance.

---

## 👥 Team

| Name | Role |
|---|---|
| _Samuel Alawode_ | _Backend Developer_ |
| _Oluwafemi Onadokun_ | _Frontend Developer_ |
| _Godwin Adah_ | _Frontend Developer_ |
| _Olamide Anifowose_ | _Backend Developer_ |

---

## 📝 Notes for Judges

- The Interswitch integration runs in **sandbox mode** for this submission. All payment flows are fully functional end-to-end — only live bank settlement requires a production QTB merchant account.
- The RRR (government payment reference) generation is a **mock implementation** of the Remita API. The format (`NRS-XXXX-XXXX`) and logic mirror the real integration.
- AI parsing uses **Google Gemini** (`gemini-2.5-flash`) via the free tier. The `BaseFinancialParser` abstract interface means any AI provider (OpenAI, Anthropic, etc.) can be swapped in without touching the pipeline.
- Voice transcription uses **Google Gemini** (`gemini-2.5-flash`). The `BaseTranscriber` abstract interface means any transcription provider can be swapped in without touching the pipeline.
- Both text and voice intake include **financial content validation** — random or irrelevant input is rejected before anything is saved to the database.
- All endpoints are testable live via the Swagger UI linked above.