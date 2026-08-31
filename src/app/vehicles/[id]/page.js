"use client";

// ─── Scooter Detail Page — /vehicles/[id] — Light & Dark Theme ──────────────
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0EDE5] dark:bg-[#021B19] py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-white/40 dark:bg-white/10 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-white/40 dark:bg-white/10 rounded-2xl" />
              <div className="h-48 bg-white/40 dark:bg-white/10 rounded-2xl" />
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-white/40 dark:bg-white/10 rounded-2xl" />
              <div className="h-64 bg-white/40 dark:bg-white/10 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <div className="min-h-[80vh] bg-[#F0EDE5] dark:bg-[#021B19] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-[#002A28] p-8 rounded-3xl border border-[#004643]/20 dark:border-emerald-500/20 shadow-xl text-center max-w-md w-full">
          <h1 className="text-2xl font-black text-[#004643] dark:text-white mb-2">Scooter Not Found</h1>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-6 font-medium">
            {errorMessage || "The scooter model you requested does not exist or is currently unavailable."}
          </p>
          <Link
            href="/vehicles"
            className="inline-block bg-[#004643] dark:bg-emerald-600 hover:bg-[#003633] text-[#F0EDE5] dark:text-white font-black px-6 py-3 rounded-2xl transition-colors text-xs"
          >
            Back to All Scooters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EDE5] dark:bg-[#021B19] text-[#004643] dark:text-[#F0EDE5] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 text-xs font-black text-[#004643] dark:text-emerald-400 hover:underline"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back to Fleet Catalog</span>
          </Link>

          <span className="text-[10px] font-bold font-mono text-[#004643] dark:text-emerald-400 bg-white/60 dark:bg-[#002A28] px-3 py-1 rounded-full border border-[#004643]/10 dark:border-emerald-500/20">
            ID: {vehicle.id.slice(0, 8)}...
          </span>
        </div>

        {/* Summary Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#002A28] p-6 rounded-3xl border border-[#004643]/15 dark:border-emerald-500/20 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#004643]/10 dark:bg-emerald-500/20 text-[#004643] dark:text-emerald-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1">
              Evora EV
            </div>
            <h1 className="text-3xl font-black text-[#004643] dark:text-white">
              Evora {vehicle.name}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mt-1">
              Urban Electric Scooter • Zero Emissions • High Performance
            </p>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-[#004643]/15 dark:sm:border-emerald-500/20 sm:pl-6">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Daily Rental Rate</p>
              <p className="text-2xl font-black text-[#004643] dark:text-emerald-400">
                ₹{Number(vehicle.price_per_day).toLocaleString("en-IN")}
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">/ day</span>
              </p>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <VehicleGallery vehicle={vehicle} />
            <VehicleDescription vehicle={vehicle} />
            <VehicleFeatures />
            <VehicleReviews vehicleId={vehicle.id} />
          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            <BookingWidget vehicle={vehicle} />
            <VehicleSpecs vehicle={vehicle} />
          </div>
        </div>

      </div>
    </div>
  );
}
