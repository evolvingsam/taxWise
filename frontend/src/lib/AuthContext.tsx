"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import * as api from "./api";
import Cookies from "js-cookie";

type AuthContextValue = {
  user: api.AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<api.AuthUser | null>;
  register: (userData: api.RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: (accessToken?: string) => Promise<api.AuthUser | null>;
  updateProfile: (profileData: api.ProfileUpdatePayload) => Promise<api.AuthUser>;
  refreshSession: () => Promise<string>;
  withFreshAccessToken: () => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<api.AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const accessTokenRef = useRef<string | null>(null);
  const refreshTokenRef = useRef<string | null>(null);

  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";

  const getAccessToken = () => {
    if (accessTokenRef.current) return accessTokenRef.current;
    const fromCookie = Cookies.get("access_token");
    if (fromCookie) return fromCookie;
    if (typeof window !== "undefined") {
      try {
        return window.localStorage.getItem("access_token");
      } catch {
        return null;
      }
    }
    return null;
  };

  const getRefreshToken = () => {
    if (refreshTokenRef.current) return refreshTokenRef.current;
    const fromCookie = Cookies.get("refresh_token");
    if (fromCookie) return fromCookie;
    if (typeof window !== "undefined") {
      try {
        return window.localStorage.getItem("refresh_token");
      } catch {
        return null;
      }
    }
    return null;
  };

  const persistTokens = (access: string, refresh?: string) => {
    const nextAccess = access.trim();
    const nextRefresh = refresh?.trim();

    accessTokenRef.current = nextAccess;
    if (nextRefresh) refreshTokenRef.current = nextRefresh;

    const cookieOptions = { path: "/", secure: isHttps, sameSite: "lax" as const };
    Cookies.set("access_token", nextAccess, { ...cookieOptions, expires: 1 });
    if (nextRefresh) {
      Cookies.set("refresh_token", nextRefresh, { ...cookieOptions, expires: 7 });
    }

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("access_token", nextAccess);
        if (nextRefresh) window.localStorage.setItem("refresh_token", nextRefresh);
      } catch {
        // Ignore storage failures; cookies + in-memory token refs remain valid.
      }
    }
  };

  const fetchProfile = async (accessToken?: string) => {
    const token = accessToken || getAccessToken();
    if (!token) return null;

    const profile = await api.getProfile(token);
    setUser(profile);
    return profile;
  };

  const clearSession = () => {
    accessTokenRef.current = null;
    refreshTokenRef.current = null;
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("refresh_token", { path: "/" });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("refresh_token");
      } catch {
        // Ignore storage failures.
      }
    }
    setUser(null);
  };

  const refreshSession = async () => {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error("Session expired. Please log in again.");

    const data = await api.refreshToken(refresh);
    persistTokens(data.access, data.refresh);
    return data.access;
  };

  useEffect(() => {
    async function loadUser() {
      const cookieAccess = Cookies.get("access_token") || null;
      const cookieRefresh = Cookies.get("refresh_token") || null;
      const storageAccess = typeof window !== "undefined" ? (() => {
        try {
          return window.localStorage.getItem("access_token");
        } catch {
          return null;
        }
      })() : null;
      const storageRefresh = typeof window !== "undefined" ? (() => {
        try {
          return window.localStorage.getItem("refresh_token");
        } catch {
          return null;
        }
      })() : null;

      accessTokenRef.current = cookieAccess || storageAccess;
      refreshTokenRef.current = cookieRefresh || storageRefresh;

      const token = getAccessToken();
      const refresh = getRefreshToken();

      if (token) {
        try {
          await fetchProfile(token);
        } catch (err) {
          console.error("Access token profile fetch failed, trying refresh", err);
          try {
            const newAccess = await refreshSession();
            await fetchProfile(newAccess);
          } catch (refreshErr) {
            console.error("Refresh during bootstrap failed", refreshErr);
            clearSession();
          }
        }
      } else if (refresh) {
        try {
          const newAccess = await refreshSession();
          await fetchProfile(newAccess);
        } catch (refreshErr) {
          console.error("Refresh-only bootstrap failed", refreshErr);
          clearSession();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);
      
      if (!data.access) {
        throw new Error("No access token returned from login");
      }
      if (!data.refresh) {
        throw new Error("No refresh token returned from login");
      }

      persistTokens(data.access, data.refresh);

      if (data.user) {
        setUser(data.user);
        return data.user;
      }

      return await fetchProfile(data.access);
    } catch (err: unknown) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const register = async (userData: api.RegisterPayload) => {
    await api.register(userData);
    // After registration, depending on the flow, they might need to log in separately
    // Or we could auto log them in: await login(userData.email, userData.password);
  };

  const updateProfile = async (profileData: api.ProfileUpdatePayload) => {
    const token = getAccessToken();
    if (!token) throw new Error("Please log in to update your profile.");

    const updated = await api.updateProfile(token, profileData);
    setUser(updated);
    return updated;
  };

  const logout = async () => {
    const refresh = getRefreshToken();
    if (refresh) {
      try {
        await api.logout(refresh);
      } catch (e: unknown) {
        console.error("Logout error", e);
      }
    }
    clearSession();
  };

  const withFreshAccessToken = async () => {
    let token = getAccessToken();
    if (token) return token;

    try {
      token = await refreshSession();
      return token;
    } catch (err: unknown) {
      clearSession();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired. Redirecting to login...");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        fetchProfile,
        updateProfile,
        refreshSession,
        withFreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
