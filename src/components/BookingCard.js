// ─── Feature 6: Presentational Component — BookingCard ─────────────────────
//
// What this file is:
//   A reusable presentational card component that renders the full details of a single
//   scooter reservation card on the `/dashboard` page.
//
// Which feature & part:
//   Feature 6 (My Bookings Dashboard) — Reservation Card UI Component
//
// Props:
//   booking -> Object containing reservation details:
//     {
//       id, user_id, vehicle_id, pickup_time, return_time, total_amount,
//       booking_status, payment_status, created_at,
//       vehicle: { name, range_km, top_speed_kmh, price_per_day, image_url }
//     }
//
// ────────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";

export default function BookingCard({ booking }) {
  // Extract associated scooter metadata object
  const vehicle = booking.vehicle;

  // ─── 1. Format Datetimes for Local Display ──────────────────────────────────
  // Formats ISO string into e.g. "Thu, 15 Oct 2026, 10:00 AM"
  const pickupFormatted = new Date(booking.pickup_time).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const returnFormatted = new Date(booking.return_time).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // ─── 2. Calculate Rental Duration in Days ─────────────────────────────────
  const start = new Date(booking.pickup_time);
  const end = new Date(booking.return_time);
  const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

  // ─── 3. Color Badges Mapping ──────────────────────────────────────────────
  // Assigns soft background and text colors depending on reservation status
  const statusStyles = {
    reserved: "bg-sky-50 text-sky-700 border-sky-200",
    confirmed: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-gray-100 text-gray-700 border-gray-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const paymentStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    paid: "bg-green-50 text-green-700 border-green-200",
    refunded: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      
      {/* ── Top Header Bar: Booking ID & Status Badges ─────────────────────── */}
      <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
          <span>Booking ID:</span>
          <span className="font-semibold text-gray-900">{booking.id.slice(0, 8)}...</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          {/* Booking Status Pill (Reserved / Confirmed / Completed / Cancelled) */}
          <span className={`px-2.5 py-1 rounded-full border capitalize ${statusStyles[booking.booking_status] || statusStyles.reserved}`}>
            {booking.booking_status}
          </span>

          {/* Payment Status Pill (Pending / Paid / Refunded) */}
          <span className={`px-2.5 py-1 rounded-full border capitalize ${paymentStyles[booking.payment_status] || paymentStyles.pending}`}>
            Payment: {booking.payment_status}
          </span>
        </div>
      </div>

      {/* ── Card Main Body ────────────────────────────────────────────────── */}
      <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
        
        {/* Scooter Image Thumbnail */}
        <div className="w-full md:w-48 h-36 bg-gray-100 rounded-2xl overflow-hidden relative shrink-0">
          {vehicle?.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={vehicle.image_url}
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">⚡</div>
          )}
        </div>

        {/* Scooter Details & Date Timeline */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              SwiftVolt {vehicle?.name || "Electric Scooter"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Range: {vehicle?.range_km ?? "—"} km • Top Speed: {vehicle?.top_speed_kmh ?? "—"} km/h
            </p>
          </div>

          {/* Pickup and Return Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 text-xs">
            <div>
              <p className="text-gray-400 font-medium uppercase text-[10px]">Pickup Schedule</p>
              <p className="font-semibold text-gray-800 mt-0.5">{pickupFormatted}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium uppercase text-[10px]">Return Schedule</p>
              <p className="font-semibold text-gray-800 mt-0.5">{returnFormatted}</p>
            </div>
          </div>
        </div>

        {/* Total Pricing & View Scooter Link */}
        <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex md:flex-col justify-between md:justify-center items-end gap-3 shrink-0">
          <div className="text-left md:text-right">
            <p className="text-[11px] text-gray-400 font-medium uppercase">
              {diffDays} {diffDays === 1 ? "day" : "days"} rental
            </p>
            <p className="text-2xl font-black text-sky-600">
              ₹{Number(booking.total_amount).toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-gray-400">
              ₹{Number(vehicle?.price_per_day || 0).toLocaleString("en-IN")} / day
            </p>
          </div>

          {vehicle?.id && (
            <Link
              href={`/vehicles/${vehicle.id}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              View Scooter
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
