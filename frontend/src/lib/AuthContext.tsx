// @ts-nocheck
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import * as api from "./api";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = Cookies.get("access_token");
      if (token) {
        try {
          const profile = await api.getProfile(token);
          setUser(profile);
        } catch (err) {
          console.error("Failed to load user profile", err);
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    Cookies.set("access_token", data.access, { expires: 1, secure: true, sameSite: 'strict' });
    Cookies.set("refresh_token", data.refresh, { expires: 7, secure: true, sameSite: 'strict' });
    setUser(data.user);
  };

  const register = async (userData) => {
    await api.register(userData);
    // After registration, depending on the flow, they might need to log in separately
    // Or we could auto log them in: await login(userData.email, userData.password);
  };

  const logout = async () => {
    const refresh = Cookies.get("refresh_token");
    if (refresh) {
      try {
        await api.logout(refresh);
      } catch (e) {
        console.error("Logout error", e);
      }
    }
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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
