"use client";

// ─── What this file is ──────────────────────────────────────────────────────
//
// VehicleGrid — the component that fetches all scooters and displays them.
//
// It's a Client Component ("use client") because it uses the useVehicles
// hook, which in turn uses TanStack Query — hooks only work in Client
// Components in Next.js App Router.
//
// This component handles all three possible states:
//   1. Loading  — shows a skeleton grid so the page doesn't feel empty
//   2. Error    — shows a friendly message if the backend is unreachable
//   3. Success  — maps over vehicles and renders a VehicleCard for each
//
// ────────────────────────────────────────────────────────────────────────────

import { useVehicles } from "@/hooks/useVehicles";
import VehicleCard from "@/components/VehicleCard";

export default function VehicleGrid() {
  // Get the vehicle data (and its loading/error state) from our custom hook
  const { vehicles, isLoading, isError, error } = useVehicles();

  // ── State 1: Loading ─────────────────────────────────────────────────────
  // Show placeholder skeleton cards while the data is being fetched.
  // We show 9 skeletons because we expect 9 scooters.
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // ── State 2: Error ───────────────────────────────────────────────────────
  // Show a helpful error message if the fetch failed (e.g. backend is down)
  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="text-lg font-semibold text-gray-800">
          Could not load vehicles
        </p>
        <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
          {error?.message ?? "Unknown error. Is the FastAPI backend running?"}
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Run:{" "}
          <code className="bg-gray-100 px-1 rounded">
            cd backend &amp;&amp; uvicorn main:app --reload
          </code>
        </p>
      </div>
    );
  }

  // ── State 3: Empty ───────────────────────────────────────────────────────
  // Unlikely but handled — if the DB returns zero rows
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-4xl mb-4">🛴</p>
        <p>No vehicles available right now.</p>
      </div>
    );
  }

  // ── State 4: Success ─────────────────────────────────────────────────────
  // Render one VehicleCard per scooter in a responsive grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        // key is required by React when rendering a list — use the unique DB id
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────

// A grey animated placeholder shown while real cards are loading.
// Gives the user a sense of the layout before data arrives.
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        {/* Title placeholder */}
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        {/* Specs placeholder */}
        <div className="grid grid-cols-3 gap-2">
          <div className="h-10 bg-gray-100 rounded-lg" />
          <div className="h-10 bg-gray-100 rounded-lg" />
          <div className="h-10 bg-gray-100 rounded-lg" />
        </div>
        {/* Price + button placeholder */}
        <div className="flex justify-between items-center pt-1">
          <div className="h-7 bg-gray-200 rounded w-1/3" />
          <div className="h-9 bg-gray-200 rounded-xl w-1/4" />
        </div>
      </div>
    </div>
  );
}
