"use client";

// ─── Feature 3 & 6: Navigation Bar — Navbar ──────────────────────────────────
//
// Dynamic navigation bar displayed across all pages.
//
// Behavior:
//   - Unauthenticated: Shows "Browse Scooters", "Log In", and "Register" buttons.
//   - Authenticated: Shows "Browse Scooters", "My Bookings" link, user greeting badge
//     "Hi, [Name]", and an interactive "Log Out" button.
//
// ────────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* ── Brand Logo & Home Link ─────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-sky-600 transition-colors">
          <span className="text-xl">⚡</span>
          <span>EV Rental</span>
        </Link>

        {/* ── Navigation & Auth Actions ───────────────────────────────────── */}
        <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium">

          {/* Catalog Link */}
          <Link
            href="/vehicles"
            className="text-gray-600 hover:text-sky-600 transition-colors"
          >
            Browse Scooters
          </Link>

          {/* Feature 6: Dashboard Link (Only visible when logged in) */}
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-sky-600 transition-colors"
            >
              My Bookings
            </Link>
          )}

          {/* Loading state indicator (subtle pulse while session resolves) */}
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-100 animate-pulse rounded-lg" />
          ) : isAuthenticated && user ? (
            /* ── Authenticated User State ──────────────────────────────── */
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 bg-sky-50 text-sky-800 px-3 py-1.5 rounded-full text-xs font-semibold border border-sky-100 hover:bg-sky-100 transition-colors"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Hi, {user.full_name.split(" ")[0]}</span>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="text-gray-500 hover:text-red-600 transition-colors text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50"
              >
                Log Out
              </button>
            </div>
          ) : (
            /* ── Guest / Logged-out State ──────────────────────────────── */
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs"
              >
                Sign Up
              </Link>
            </div>
          )}

        </div>

      </div>
    </nav>
  );
}
