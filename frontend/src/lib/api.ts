// @ts-nocheck
export const BASE_API_URL = "https://taxease-rpkq.onrender.com/api";
export const API_URL = `${BASE_API_URL}/accounts`;

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to log in");
  return data;
}

export async function register(userData: any) {
  const res = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to register");
  return data;
}

export async function getProfile(token: string) {
  const res = await fetch(`${API_URL}/me/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
  return data;
}

export async function updateProfile(token: string, profileData: any) {
  const res = await fetch(`${API_URL}/me/`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(profileData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update profile");
  return data;
}

export async function refreshToken(refresh: string) {
  const res = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to refresh token");
  return data;
}

export async function logout(refresh: string) {
  const res = await fetch(`${API_URL}/logout/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to log out");
  return data;
}

export async function submitSmartIntake(token: string, raw_text: string, source: string = "web") {
  const res = await fetch(`${BASE_API_URL}/smart-intake/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ raw_text, source }),
  });
  
  const data = await res.json();
  
  // We accept 201 (success) and 207 (partial_failure)
  if (!res.ok && res.status !== 207) {
    throw new Error(data.message || "Failed to submit financial intake");
  }
  
  return data;
}

export async function getLedgerHistory(token: string) {
  const res = await fetch(`${BASE_API_URL}/smart-intake/ledger/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch ledger history");
  return data;
}

export async function getLedgerEntry(token: string, entryId: string) {
  const res = await fetch(`${BASE_API_URL}/smart-intake/ledger/${entryId}/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch ledger entry");
  return data;
}

export async function calculateTax(token: string) {
  const res = await fetch(`${BASE_API_URL}/tax-engine/calculate/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to calculate tax");
  return data;
}

export interface PaymentPayload {
  tx_ref: string;
  amount: number;
  tax_year: number;
}

export async function initiatePayment(token: string, payload: PaymentPayload) {
  const res = await fetch(`${BASE_API_URL}/payments/initiate/`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(payload),
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to initiate payment");
  return data;
}

export async function getTransactionStatus(token: string, txRef: string) {
  const res = await fetch(`${BASE_API_URL}/payments/transaction/${txRef}/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch transaction status");
  return data;
}
