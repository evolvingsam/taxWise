"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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

  const fetchProfile = async (accessToken?: string) => {
    const token = accessToken || Cookies.get("access_token");
    if (!token) return null;

    const profile = await api.getProfile(token);
    setUser(profile);
    return profile;
  };

  const clearSession = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setUser(null);
  };

  const refreshSession = async () => {
    const refresh = Cookies.get("refresh_token");
    if (!refresh) throw new Error("Session expired. Please log in again.");

    const data = await api.refreshToken(refresh);
    Cookies.set("access_token", data.access, { expires: 1, secure: true, sameSite: "strict" });
    if (data.refresh) {
      Cookies.set("refresh_token", data.refresh, { expires: 7, secure: true, sameSite: "strict" });
    }
    return data.access;
  };

  useEffect(() => {
    async function loadUser() {
      const token = Cookies.get("access_token");
      if (token) {
        try {
          await fetchProfile(token);
        } catch (err) {
          console.error("Failed to load user profile", err);
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
      
      Cookies.set("access_token", data.access, { expires: 1, secure: false, sameSite: "lax" });
      Cookies.set("refresh_token", data.refresh, { expires: 7, secure: false, sameSite: "lax" });
      
      console.log("Tokens stored:", {
        hasAccess: !!Cookies.get("access_token"),
        hasRefresh: !!Cookies.get("refresh_token"),
      });

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
    const token = Cookies.get("access_token");
    if (!token) throw new Error("Please log in to update your profile.");

    const updated = await api.updateProfile(token, profileData);
    setUser(updated);
    return updated;
  };

  const logout = async () => {
    const refresh = Cookies.get("refresh_token");
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
    let token = Cookies.get("access_token");
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
