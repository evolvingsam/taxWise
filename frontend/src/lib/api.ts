export const BASE_API_URL = "https://taxease-rpkq.onrender.com/api";
export const API_URL = `${BASE_API_URL}/accounts`;

interface ApiMessage {
  message?: string;
}

export type UserType = "individual" | "sme" | "corporate";

export interface AuthUser {
  email: string;
  first_name?: string;
  last_name?: string;
  user_type?: UserType | string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: AuthUser;
}

export interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  user_type: UserType | string;
  password: string;
}

export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  user_type?: UserType | string;
}

export interface RefreshResponse {
  access: string;
  refresh?: string;
}

export interface SmartIntakeParsed {
  income?: number;
  expenses?: Record<string, number>;
  user_type?: string;
  period?: string;
  confidence?: number;
}

export interface SmartIntakeResponse {
  status: "success" | "partial_failure" | "error" | string;
  message?: string;
  ledger_id?: string;
  parsed?: SmartIntakeParsed;
  intake_status?: string;
}

export interface LedgerEntry {
  id: string;
  user_type: string;
  income: string;
  expenses: Record<string, number>;
  period: string;
  ai_confidence: string;
  status: string;
  raw_text: string;
  created_at: string;
  updated_at: string;
}

export interface LedgerHistoryResponse {
  status: "success" | string;
  count: number;
  results: LedgerEntry[];
}

export interface LedgerEntryResponse {
  status: "success" | string;
  data: LedgerEntry;
}

export interface TaxCalculationResponse {
  status: "success" | "error" | string;
  message?: string;
  tax_waec_result?: string;
  breakdown?: {
    gross_income: number;
    deductions_applied: number;
    taxable_income: number;
    final_tax_owed: number;
    platform_filing_fee: number;
  };
}

export interface PaymentInitiateResponse {
  status: "success" | "error" | string;
  message?: string;
  tx_ref: string;
  payment_id?: number;
  redirect_url?: string;
}

export interface TransactionStatusResponse {
  status?: string;
  message?: string;
  rrr_code?: string;
  rrr?: string;
}

export interface InterswitchWebhookPayload {
  txnref: string;
  amount: string;
  resp: string;
  hash: string;
}

export interface InterswitchWebhookResponse {
  status: "success" | "error" | string;
  rrr_code?: string;
  message?: string;
}

async function parseResponse<T>(res: Response): Promise<T | ApiMessage | null> {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    const msg = (data as ApiMessage).message;
    if (typeof msg === "string" && msg.trim().length > 0) {
      return msg;
    }
  }
  return fallback;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseResponse<LoginResponse>(res);
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to log in"));
  return data as LoginResponse;
}

export async function register(userData: RegisterPayload) {
  const res = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await parseResponse<AuthUser>(res);
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to register"));
  return data as AuthUser;
}

export async function getProfile(token: string) {
  const res = await fetch(`${API_URL}/me/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await parseResponse<AuthUser>(res);
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to fetch profile"));
  return data as AuthUser;
}

export async function updateProfile(token: string, profileData: ProfileUpdatePayload) {
  const res = await fetch(`${API_URL}/me/`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(profileData),
  });
  const data = await parseResponse<AuthUser>(res);
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to update profile"));
  return data as AuthUser;
}

export async function refreshToken(refresh: string) {
  const res = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  const data = await parseResponse<RefreshResponse>(res);
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to refresh token"));
  return data as RefreshResponse;
}

export async function logout(refresh: string) {
  const res = await fetch(`${API_URL}/logout/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  const data = await parseResponse<unknown>(res);
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to log out"));
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
  
  const data = await parseResponse<SmartIntakeResponse>(res);
  
  // We accept 201 (success) and 207 (partial_failure)
  if (!res.ok && res.status !== 207) {
    throw new Error(getErrorMessage(data, "Failed to submit financial intake"));
  }
  
  return data as SmartIntakeResponse;
}

export async function getLedgerHistory(token: string) {
  const res = await fetch(`${BASE_API_URL}/smart-intake/ledger/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await parseResponse<LedgerHistoryResponse>(res);
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to fetch ledger history"));
  return data as LedgerHistoryResponse;
}

export async function getLedgerEntry(token: string, entryId: string) {
  const res = await fetch(`${BASE_API_URL}/smart-intake/ledger/${entryId}/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await parseResponse<LedgerEntryResponse | LedgerEntry>(res);
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to fetch ledger entry"));
  return data as LedgerEntryResponse | LedgerEntry;
}

export async function calculateTax(token: string) {
  const res = await fetch(`${BASE_API_URL}/tax-engine/calculate/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await parseResponse<TaxCalculationResponse>(res);
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to calculate tax"));
  return data as TaxCalculationResponse;
}

export interface PaymentPayload {
  amount: number;
  tax_year: number;
  tx_ref?: string;
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
  
  const data = await parseResponse<PaymentInitiateResponse>(res);
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to initiate payment"));
  return data as PaymentInitiateResponse;
}

export async function getTransactionStatus(token: string, txRef: string) {
  const res = await fetch(`${BASE_API_URL}/payments/transaction/${txRef}/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await parseResponse<TransactionStatusResponse>(res);
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to fetch transaction status"));
  return (data as TransactionStatusResponse) ?? { status: "success" };
}

export async function submitInterswitchWebhook(payload: InterswitchWebhookPayload) {
  const res = await fetch(`${BASE_API_URL}/payments/webhooks/interswitch/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseResponse<InterswitchWebhookResponse>(res);
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to submit Interswitch webhook payload"));
  return data as InterswitchWebhookResponse;
}
