"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/auth.services";

const AuthContext = createContext(null);

function getUserFromPayload(payload) {
  const candidates = [
    payload?.user,
    payload?.data?.user,
    payload?.data,
    payload,
  ];

  return (
    candidates.find(
      (candidate) =>
        candidate &&
        typeof candidate === "object" &&
        ("fullName" in candidate ||
          "email" in candidate ||
          "role" in candidate ||
          "_id" in candidate)
    ) ?? null
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const payload = await authService.getCurrentUser();
        setUser(getUserFromPayload(payload));
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (credentials) => {
    const payload = await authService.login(credentials);
    const loggedInUser = getUserFromPayload(payload);

    if (!loggedInUser) {
      throw new Error("Login succeeded, but no user data was returned.");
    }

    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      if (error?.response?.status !== 401) {
        throw error;
      }
    } finally {
      setUser(null);
    }
  };

  const register = async (userData) => {
    const payload = await authService.register(userData);
    return payload;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
