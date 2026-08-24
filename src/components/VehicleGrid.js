"use client";

// ─── Feature 1: Client Component — VehicleGrid ─────────────────────────────
//
// Manages the complete data lifecycle of the scooter catalog on the /vehicles page.
//
// Why is this a Client Component ("use client")?
//   Because it uses the `useVehicles()` custom hook, which relies on React hooks
//   and TanStack Query state (loading, error, cached data).
//
// States handled:
//   1. Loading: Displays 9 gray animated skeleton placeholder cards.
//   2. Error: Displays a helpful warning screen with troubleshooting instructions.
//   3. Empty: Fallback message if no scooters are found in the database.
//   4. Success: Renders a responsive 3-column grid of <VehicleCard> components.
//
// ────────────────────────────────────────────────────────────────────────────

import { useVehicles } from "@/hooks/useVehicles";
import VehicleCard from "@/components/VehicleCard";

export default function VehicleGrid() {
  // Fetch live scooter data using our TanStack Query hook
  const { vehicles, isLoading, isError, error } = useVehicles();

  // ─── State 1: Loading Skeletons ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // ─── State 2: Error State ─────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-lg mx-auto shadow-xs">
        <p className="text-4xl mb-3">⚠️</p>
        <h2 className="text-lg font-bold text-gray-900">Could Not Load Scooters</h2>
        <p className="text-xs text-gray-500 mt-2">
          {error?.message ?? "Unable to reach the FastAPI backend service."}
        </p>
        <div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-600 font-mono">
          Ensure FastAPI backend is running on port 8000
        </div>
      </div>
    );
  }

  // ─── State 3: Empty State ─────────────────────────────────────────────────
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 bg-white rounded-3xl border border-gray-200 p-8">
        <p className="text-4xl mb-2">🛴</p>
        <p className="text-sm font-semibold text-gray-700">No Scooters Available</p>
        <p className="text-xs text-gray-400 mt-1">All vehicles are currently checked out.</p>
      </div>
    );
  }

  // ─── State 4: Populated Catalog Grid ─────────────────────────────────────
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        // Always supply unique `key` prop when mapping elements in React
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}

// ─── Reusable Skeleton Card Placeholder ─────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded-md w-2/3" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-10 bg-gray-100 rounded-xl" />
          <div className="h-10 bg-gray-100 rounded-xl" />
          <div className="h-10 bg-gray-100 rounded-xl" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-7 bg-gray-200 rounded-md w-1/3" />
          <div className="h-9 bg-gray-200 rounded-xl w-1/4" />
        </div>
      </div>
    </div>
  );
}
