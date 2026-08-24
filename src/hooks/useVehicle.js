"use client";

// ─── Feature 2: Custom Data Hook — useVehicle ──────────────────────────────
//
// This hook uses TanStack Query to fetch and cache a single scooter's details
// using its unique vehicle ID.
//
// States handled:
//   - data: The scooter profile (name, specs, pricing, image)
//   - isLoading: True while fetching data from /api/vehicles/[id]
//   - isError: True if vehicle ID does not exist (404) or server is unreachable
//
// ────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";

async function fetchVehicleById(id) {
  if (!id) return null;

  const res = await fetch(`/api/vehicles/${id}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Vehicle not found (${res.status})`);
  }

  return res.json();
}

export function useVehicle(id) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => fetchVehicleById(id),
    enabled: Boolean(id),     // Only fetch when a valid ID is provided
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,                 // Don't retry endlessly if 404
  });

  return {
    vehicle: data,
    isLoading,
    isError,
    errorMessage: error?.message,
  };
}
