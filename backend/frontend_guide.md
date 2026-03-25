# Frontend Developer Guide - TaxWise JWT Auth API

This document provides details on how to integrate with the backend JWT-based authentication system.

## Base URL
`http://localhost:8000/api/accounts/`

## Authentication
The system uses **JWT (JSON Web Tokens)**.
1. **Login**: Send credentials to `/login/` to receive `access` and `refresh` tokens.
2. **Authorized Requests**: Include the `access` token in the `Authorization` header:
   `Authorization: Bearer <your_access_token>`
3. **Token Refresh**: When the `access` token expires, send the `refresh` token to `/token/refresh/` to get a new `access` token.

---

### 1. User Registration
**Endpoint:** `POST /register/`

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "yourpassword",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "individual" // Values: "individual", "sme", "corporate"
}
```

---

### 2. User Login (Obtain Token)
**Endpoint:** `POST /login/`

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "yourpassword"
}
```

**Response (200 OK):**
```json
{
    "refresh": "eyJhbG...",
    "access": "eyJhbG...",
    "user": {
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "user_type": "individual"
    }
}
```

---

### 3. Token Refresh
**Endpoint:** `POST /token/refresh/`

**Request Body:**
```json
{
    "refresh": "<your_refresh_token>"
}
```

**Response (200 OK):**
```json
{
    "access": "eyJhbG..."
}
```

---

### 4. Fetch/Update Profile (Me)
**Endpoint:** `GET /me/` or `PATCH /me/`

**GET Response (200 OK):**
```json
{
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "individual"
}
```

**PATCH Request Body:**
```json
{
    "first_name": "Johnny",
    "last_name": "Smith"
}
```

---

### 5. User Logout (Blacklist Token)
**Endpoint:** `POST /logout/`

**Request Body:**
```json
{
    "refresh": "<your_refresh_token>"
}
```

**Response (200 OK):**
```json
{
    "message": "Successfully logged out."
}
```
---

### 6. Role-Based Access
The backend supports restricted access based on `user_type`. Certain endpoints may be restricted to:
- `IsIndividual`: Only accessible by users with `user_type: "individual"`
- `IsSME`: Only accessible by users with `user_type: "sme"`
- `IsCorporate`: Only accessible by users with `user_type: "corporate"`

Ensure your frontend handles 403 Forbidden errors if a user tries to access a restricted resource.
