"use client";

// ─── Feature 2: Custom Data Hook — useVehicle ──────────────────────────────
//
// Reusable React hook for fetching and caching the technical profile of a
// single scooter using its unique UUID.
//
// Features:
//   • Uses TanStack Query with queryKey `["vehicle", id]` to cache each scooter individually.
//   • Automatically skips fetching (`enabled: Boolean(id)`) if the ID is missing.
//   • Exposes simple `{ vehicle, isLoading, isError, errorMessage }` state.
//
// Usage in components:
//   const { vehicle, isLoading, isError } = useVehicle(vehicleId);
//
// ────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";

// ─── Data Fetcher Function ───────────────────────────────────────────────────
// Calls our Next.js dynamic proxy route /api/vehicles/[id]
async function fetchVehicleById(id) {
  if (!id) return null;

  const res = await fetch(`/api/vehicles/${id}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Vehicle not found (${res.status})`);
  }

  return res.json();
}

// ─── Custom Hook Definition ──────────────────────────────────────────────────
export function useVehicle(id) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => fetchVehicleById(id),
    enabled: Boolean(id),     // Only execute query when a valid ID parameter is present
    staleTime: 1000 * 60 * 5, // Cache scooter details in memory for 5 minutes
    retry: 1,                 // Do not retry repeatedly on 404 Not Found errors
  });

  return {
    vehicle: data,            // The validated scooter object (or undefined)
    isLoading,                // True while loading from API
    isError,                  // True if scooter does not exist or server is down
    errorMessage: error?.message,
  };
}
