"use client";

// ─── Feature 2, 4 & 9: Dynamic Page — /vehicles/[id] ──────────────────────────
//
// Scooter Detail Page with embedded real-time Booking Widget and Customer Reviews.
//
// Features:
//   - Feature 2: Gallery, Specs, Narrative Description, Included Benefits
//   - Feature 4: Interactive BookingWidget for date selection & real reservations
//   - Feature 9: VehicleReviews for customer ratings, star breakdowns, and reviews
//
// ────────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useVehicle } from "@/hooks/useVehicle";
import VehicleGallery from "@/components/VehicleGallery";
import VehicleSpecs from "@/components/VehicleSpecs";
import VehicleFeatures from "@/components/VehicleFeatures";
import VehicleDescription from "@/components/VehicleDescription";
import BookingWidget from "@/components/BookingWidget";
import VehicleReviews from "@/components/VehicleReviews";

export default function VehicleDetailPage() {
  const params = useParams();
  const vehicleId = params?.id;

  const { vehicle, isLoading, isError, errorMessage } = useVehicle(vehicleId);

  // ─── State 1: Loading Skeleton ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-gray-200 rounded-2xl" />
              <div className="h-48 bg-gray-200 rounded-2xl" />
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded-2xl" />
              <div className="h-64 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── State 2: Error / Not Found ──────────────────────────────────────────
  if (isError || !vehicle) {
    return (
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center max-w-md w-full">
          <div className="text-5xl mb-4">🛴❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Scooter Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">
            {errorMessage || "The scooter ID you are looking for does not exist or is currently unavailable."}
          </p>
          <Link
            href="/vehicles"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            ← Back to All Scooters
          </Link>
        </div>
      </div>
    );
  }

  // ─── State 3: Populated Detail View ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Breadcrumb & Back Navigation ──────────────────────────────── */}
        <div className="flex items-center justify-between">
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-sky-600 transition-colors"
          >
            <span>←</span> Back to Scooters
          </Link>

          <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md">
            ID: {vehicle.id.slice(0, 8)}...
          </span>
        </div>

        {/* ── Title and Summary Banner ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              SwiftVolt {vehicle.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Urban Electric Scooter • Zero Emissions • Premium Performance
            </p>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-gray-200 sm:pl-6">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Daily Rate</p>
              <p className="text-2xl font-black text-gray-900">
                ₹{Number(vehicle.price_per_day).toLocaleString("en-IN")}
                <span className="text-xs font-normal text-gray-500 ml-1">/ day</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Main Two-Column Layout ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left / Center Column (2 cols wide): Gallery, Narrative & Feature 9 Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <VehicleGallery vehicle={vehicle} />
            <VehicleDescription vehicle={vehicle} />
            <VehicleFeatures />
            
            {/* Feature 9: Customer Reviews & Ratings */}
            <VehicleReviews vehicleId={vehicle.id} />
          </div>

          {/* Right Column (1 col wide): Specs & Feature 4 Booking Widget */}
          <div className="space-y-6 lg:sticky lg:top-20">
            {/* Feature 4: Interactive Booking Widget */}
            <BookingWidget vehicle={vehicle} />

            {/* Technical Specifications */}
            <VehicleSpecs vehicle={vehicle} />
          </div>

        </div>

      </div>
    </div>
  );
}
