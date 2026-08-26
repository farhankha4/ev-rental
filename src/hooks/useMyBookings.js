"use client";

// ─── Feature 6: Custom Data Hook — useMyBookings ───────────────────────────
//
// What this file is:
//   A custom React hook powered by TanStack Query that handles fetching, caching,
//   and re-fetching the active user's personal rental history.
//
// Which feature & part:
//   Feature 6 (My Bookings Dashboard) — Data Hook
//
// How it works:
//   • Reads `token` and `user` from `AuthContext`.
//   • Executes HTTP GET `/api/bookings/my-bookings` passing `Authorization: Bearer <token>`.
//   • Caches the resulting array using TanStack Query key `["my-bookings", user?.id]`.
//   • Automatically skips execution (`enabled: Boolean(...)`) if the user is not logged in.
//
// ────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

// ─── Async Fetcher Function ──────────────────────────────────────────────────
// Makes HTTP GET request to Next.js route handler /api/bookings/my-bookings
async function fetchMyBookings(token) {
  if (!token) return [];

  const res = await fetch("/api/bookings/my-bookings", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to fetch bookings (${res.status})`);
  }

  return res.json();
}

// ─── Custom Hook Definition ──────────────────────────────────────────────────
export function useMyBookings() {
  // Extract authenticated user profile and JWT token from AuthContext
  const { user, token, isAuthenticated } = useAuth();

  // Execute TanStack Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["my-bookings", user?.id],        // Unique cache key tied to user ID
    queryFn: () => fetchMyBookings(token),      // Query execution function
    enabled: Boolean(isAuthenticated && token), // Only run query when user is logged in
    staleTime: 1000 * 60 * 2,                   // Data remains fresh in cache for 2 minutes
  });

  return {
    bookings: data ?? [],        // Array of BookingResponse objects (defaults to [])
    isLoading,                   // True while loading initial data
    isError,                     // True if query failed
    errorMessage: error?.message, // Error message string
    refetch,                     // Trigger function to force refresh
  };
}
