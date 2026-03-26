// @ts-nocheck
export const API_URL = "http://localhost:8000/api/accounts";

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
