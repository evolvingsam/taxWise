# TaxEase Server - Frontend Developer Guide

This guide provides the necessary information to integrate your frontend application with the TaxEase Server backend. It covers authentication, intake, tax calculation, and payment initiation.

## Table of Contents
1. [Base URL & Authentication](#1-base-url--authentication)
2. [Accounts App](#2-accounts-app)
3. [Smart Intake App](#3-smart-intake-app)
4. [Tax Engine App](#4-tax-engine-app)
5. [Payments App](#5-payments-app)

---

## 1. Base URL & Authentication

**Base URL:** `http://localhost:8000/api`

### JWT Authentication Flow
Most endpoints require a **Bearer Token**.
1. **Login**: POST your credentials to `/accounts/login/` to receive an `access` and `refresh` token.
2. **Authorize**: Include the access token in your headers: `Authorization: Bearer <your_access_token>`.
3. **Refresh**: When the access token expires (usually 60 mins), POST the refresh token to `/accounts/token/refresh/` to get a new one.

---

## 2. Accounts App

### Register User
**Method:** `POST` | **URL:** `/accounts/register/` | **Auth:** None

**Payload:**
```json
{
    "email": "user@example.com",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "individual" // options: "individual", "sme", "corporate"
}
```

### Login
**Method:** `POST` | **URL:** `/accounts/login/` | **Auth:** None

**Payload:**
```json
{
    "email": "user@example.com",
    "password": "securepassword123"
}
```
**Response Details:** Returns `access`, `refresh`, and a `user` object with profile info.

### Get / Update Profile
**Method:** `GET` / `PATCH` | **URL:** `/accounts/me/` | **Auth:** Bearer Token

**PATCH Payload:** (All fields optional)
```json
{
    "first_name": "Johnny",
    "last_name": "Smith"
}
```

---

## 3. Smart Intake App

### Submit Financial Intake
**Method:** `POST` | **URL:** `/smart-intake/` | **Auth:** Bearer Token

Accepts plain-English financial text. The AI extracts income and expenses to create a pending ledger entry.

**Payload:**
```json
{
    "raw_text": "I run a shop. My profit this week was ₦40,200 and I paid ₦15,000 rent.",
    "source": "web" // options: "web", "voice", "api"
}
```

**Success Response (201):** Returns `ledger_id` and the `parsed` data extracted by AI.

---

## 4. Tax Engine App

### Calculate Tax Owed
**Method:** `GET` | **URL:** `/tax-engine/calculate/` | **Auth:** Bearer Token

Triggers the 2026 Nigerian tax calculation pipeline for the authenticated user. No payload required.

**Success Response (200):**
```json
{
    "status": "success",
    "breakdown": {
        "gross_income": 4500000,
        "deductions_applied": 500000,
        "taxable_income": 4000000,
        "final_tax_owed": 45000,
        "platform_filing_fee": 1000
    },
    "message": "Pay ₦45,000 in tax plus ₦1,000 filing fee."
}
```

---

## 5. Payments App

### Initiate Transaction
**Method:** `POST` | **URL:** `/payments/initiate/` | **Auth:** Bearer Token

Must be called **before** opening the Interswitch WebPay modal. This creates a pending record in our database.

**Payload:**
```json
{
    "tx_ref": "TAXEASE-usr_abc123-1711234567", // Unique frontend-generated ref
    "amount": 1000.00,
    "tax_year": 2026
}
```

### Interswitch Webhook
**Method:** `POST` | **URL:** `/payments/webhooks/interswitch/` | **Auth:** None

This is for Interswitch's backend callback. If you are simulating a payment locally, use this endpoint.

**Payload:**
```json
{
    "txnref": "TAXEASE-usr_abc123-1711234567",
    "amount": "100000", // Amount in Kobo (string)
    "resp": "00", // "00" indicates success
    "hash": "sha512hash..."
}
```
