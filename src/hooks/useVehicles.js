"use client";

// ─── Feature 1: Custom Data Hook — useVehicles ──────────────────────────────
//
// Reusable React hook for fetching and caching the entire scooter catalog.
//
// Why use TanStack Query?
//   1. Automatic background refetching and data caching (staleTime).
//   2. Handles loading, error, and data states automatically without boilerplate useEffect.
//   3. Avoids duplicate HTTP requests across components sharing the same queryKey.
//
// Usage in components:
//   const { vehicles, isLoading, isError, error } = useVehicles();
//
// ────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";

// ─── Data Fetcher Function ───────────────────────────────────────────────────
// Calls our Next.js server proxy at /api/vehicles, which forwards to FastAPI /vehicles.
async function fetchVehicles() {
  const res = await fetch("/api/vehicles");

  // Throw on non-200 responses so TanStack Query catches the error
  if (!res.ok) {
    throw new Error(`Failed to fetch vehicles catalog (HTTP ${res.status})`);
  }

  return res.json();
}

// ─── Custom Hook Definition ──────────────────────────────────────────────────
export function useVehicles() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["vehicles"],   // Cache key identifier for the catalog query
    queryFn: fetchVehicles,   // Function executed when data needs fetching
    staleTime: 1000 * 60 * 5, // Data stays fresh in cache for 5 minutes
  });

  return {
    vehicles: data ?? [],     // Always return an array (defaults to empty list)
    isLoading,                // True during initial fetch
    isError,                  // True if the request failed
    error,                    // The Error instance with error message
  };
}
