"use client";

// ─── Feature 3: Global Authentication Context — AuthContext ────────────────
//
// Manages authentication state (user profile and JWT token) across the application.
//
// Features:
//   - Persists JWT token in localStorage for session restoration on page reload
//   - Validates active token on startup by calling /api/auth/me
//   - Exposes register(), login(), and logout() methods to form pages
//   - Provides isAuthenticated and user state to Navbar and booking components
//
// ────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ─── 1. Restore session from localStorage on initial mount ────────────────
  useEffect(() => {
    async function restoreSession() {
      try {
        const storedToken = localStorage.getItem("swiftvolt_token");
        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        // Validate token with backend /api/auth/me
        const res = await fetch("/api/auth/me", {
          headers: {
            "Authorization": `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setToken(storedToken);
        } else {
          // Token is expired or invalid — clear it
          localStorage.removeItem("swiftvolt_token");
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error("[AuthContext] Session restore error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  // ─── 2. Register Function ────────────────────────────────────────────────
  const register = async ({ email, password, full_name, phone }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name, phone }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Registration failed.");
    }

    // Save token and user in state and localStorage
    localStorage.setItem("swiftvolt_token", data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  // ─── 3. Login Function ───────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed.");
    }

    // Save token and user in state and localStorage
    localStorage.setItem("swiftvolt_token", data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  // ─── 4. Logout Function ──────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("swiftvolt_token");
    setToken(null);
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Custom Hook to consume AuthContext ─────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
