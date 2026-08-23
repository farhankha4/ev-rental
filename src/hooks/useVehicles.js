"use client";

// ─── What this file is ──────────────────────────────────────────────────────
//
// This is a custom React hook that fetches the list of vehicles.
//
// A "hook" is a reusable piece of logic — instead of writing the same
// fetch call in every component that needs vehicles, we write it once
// here and every component just calls: const { vehicles } = useVehicles()
//
// TanStack Query's useQuery handles:
//   - Running the fetch automatically when a component mounts
//   - Giving us loading / error / success states
//   - Caching the result so we don't re-fetch unnecessarily
//   - Retrying failed requests automatically
//
// ────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";

// The function that actually does the HTTP request.
// Separated from the hook so it's easy to read and test independently.
async function fetchVehicles() {
  const res = await fetch("/api/vehicles"); // calls our Next.js proxy route

  // If the server returned an error status, throw so TanStack Query
  // can catch it and put the hook into the "error" state
  if (!res.ok) {
    throw new Error(`Failed to fetch vehicles (HTTP ${res.status})`);
  }

  return res.json(); // returns the array of vehicle objects
}

// The custom hook — this is what components import and call
export function useVehicles() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["vehicles"],   // unique cache key — TanStack uses this to cache/invalidate
    queryFn: fetchVehicles,   // the function to call when data is needed
    staleTime: 1000 * 60 * 5, // data is "fresh" for 5 minutes — won't re-fetch in that window
  });

  return {
    vehicles: data ?? [],  // always return an array (never undefined)
    isLoading,             // true while the first fetch is in progress
    isError,               // true if the fetch failed
    error,                 // the actual Error object (has .message)
  };
}
