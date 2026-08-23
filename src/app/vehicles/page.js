// ─── What this file is ──────────────────────────────────────────────────────
//
// This is the /vehicles page — what users see at localhost:3000/vehicles
//
// It is a Server Component (no "use client" needed) — it just renders
// the page shell (heading, description) and drops in the VehicleGrid.
//
// VehicleGrid is a Client Component that handles all the data fetching
// and different states (loading/error/success) on its own.
//
// This separation is intentional:
//   - Server Component = fast, SEO-friendly page shell
//   - Client Component = interactive, data-fetching grid
//
// ────────────────────────────────────────────────────────────────────────────

import VehicleGrid from "@/components/VehicleGrid";

// Metadata for this specific page (overrides the default in layout.js)
export const metadata = {
  title: "Browse Scooters — EV Rental",
  description: "Browse all available SwiftVolt electric scooters for rent.",
};

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900">
            ⚡ Browse Scooters
          </h1>
          <p className="mt-2 text-gray-500">
            All available SwiftVolt electric scooters — pick your ride.
          </p>
        </div>
      </div>

      {/* ── Vehicle Grid ─────────────────────────────────────────────────── */}
      {/*
        VehicleGrid is a Client Component.
        It fetches the vehicle list from /api/vehicles using TanStack Query
        and renders the cards (or loading/error states) automatically.
      */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <VehicleGrid />
      </div>

    </div>
  );
}
