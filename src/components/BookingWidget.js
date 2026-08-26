"use client";

// ─── Feature 4 & 5: Interactive Component — BookingWidget ───────────────────
//
// Rendered on the scooter profile page (/vehicles/[id]).
// Enables users to select rental dates, view live price calculations, and create
// reservations with automated double-booking prevention.
//
// Key Capabilities:
//   • Feature 4: Live duration in days & total rental cost computation.
//   • Feature 5: Conflict checking against existing reservations (HTTP 400 rejection).
//   • Auth-Aware: Seamlessly toggles between "Log In to Reserve" and "Confirm & Reserve".
//   • Instant Receipt: Displays full booking confirmation receipt upon success.
//
// ────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

// Helper: Format a Date object to YYYY-MM-DD string for HTML date pickers
function toDateInputValue(date) {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export default function BookingWidget({ vehicle }) {
  const { user, token, isAuthenticated } = useAuth();

  // Set default dates: pickup tomorrow, return 3 days later
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }, []);

  const threeDaysLater = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d;
  }, []);

  const [pickupDate, setPickupDate] = useState(toDateInputValue(tomorrow));
  const [returnDate, setReturnDate] = useState(toDateInputValue(threeDaysLater));
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("18:00");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // ─── Real-Time Duration and Price Calculation ─────────────────────────────
  const { days, totalCost, isValidRange } = useMemo(() => {
    const start = new Date(`${pickupDate}T${pickupTime}:00`);
    const end = new Date(`${returnDate}T${returnTime}:00`);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return { days: 0, totalCost: 0, isValidRange: false };
    }

    const diffSeconds = (end - start) / 1000;
    const computedDays = Math.max(1, Math.ceil(diffSeconds / 86400));
    const cost = computedDays * Number(vehicle.price_per_day);

    return { days: computedDays, totalCost: cost, isValidRange: true };
  }, [pickupDate, returnDate, pickupTime, returnTime, vehicle.price_per_day]);

  // ─── Form Submission Handler ──────────────────────────────────────────────
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isAuthenticated || !token) {
      setErrorMsg("Please log in to make a reservation.");
      return;
    }

    if (!isValidRange) {
      setErrorMsg("Return date & time must be strictly after pickup date & time.");
      return;
    }

    setIsLoading(true);

    try {
      const pickupDateTime = new Date(`${pickupDate}T${pickupTime}:00`).toISOString();
      const returnDateTime = new Date(`${returnDate}T${returnTime}:00`).toISOString();

      // Submit reservation request with Bearer JWT
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicle_id: vehicle.id,
          pickup_time: pickupDateTime,
          return_time: returnDateTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // [Feature 5] Capture conflict rejection message from server
        throw new Error(data.error || "Failed to create booking.");
      }

      // Booking created successfully
      setBookingSuccess(data);
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong while booking.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── View 1: Success Receipt Confirmation Card ────────────────────────────
  if (bookingSuccess) {
    return (
      <div className="bg-white rounded-3xl p-6 border-2 border-green-200 shadow-sm space-y-4 text-center">
        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-2xl mx-auto">
          ✓
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">Reservation Confirmed!</h2>
        <p className="text-xs text-gray-500">
          Your SwiftVolt {vehicle.name} has been reserved successfully.
        </p>

        {/* Feature 10: Email Notification Confirmation Notice */}
        <div className="bg-sky-50 text-sky-800 text-[11px] font-medium p-2.5 rounded-xl border border-sky-100 flex items-center justify-center gap-1.5">
          <span>📧</span>
          <span>Confirmation email sent to your inbox!</span>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 text-left text-xs space-y-2.5 border border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500">Booking ID:</span>
            <span className="font-mono font-semibold text-gray-800">{bookingSuccess.id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Pickup:</span>
            <span className="font-semibold text-gray-800">{new Date(bookingSuccess.pickup_time).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Return:</span>
            <span className="font-semibold text-gray-800">{new Date(bookingSuccess.return_time).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-sm">
            <span className="text-gray-900">Total Amount:</span>
            <span className="text-sky-600">₹{Number(bookingSuccess.total_amount).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-[11px] pt-1 text-amber-700">
            <span>Status:</span>
            <span className="capitalize font-semibold">{bookingSuccess.booking_status} ({bookingSuccess.payment_status} payment)</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setBookingSuccess(null)}
          className="text-xs text-sky-600 font-semibold hover:underline"
        >
          Book another rental for this scooter
        </button>
      </div>
    );
  }

  // ─── View 2: Interactive Date Selection & Price Calculator ─────────────────
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
      <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          Reserve Scooter
        </h2>
        <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
          Zero Deposit
        </span>
      </div>

      {/* Date Conflict / Error Alert */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl flex items-start gap-2">
          <span className="text-base">📅</span>
          <div>
            <p className="font-semibold">{errorMsg.includes("already reserved") ? "Dates Unavailable" : "Booking Notice"}</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleBookingSubmit} className="space-y-4">
        {/* ── Pickup Date & Time ────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Pickup Date & Time
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="date"
              min={toDateInputValue(new Date())}
              value={pickupDate}
              onChange={(e) => {
                setPickupDate(e.target.value);
                setErrorMsg("");
              }}
              className="col-span-2 px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              required
            />
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => {
                setPickupTime(e.target.value);
                setErrorMsg("");
              }}
              className="px-2 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              required
            />
          </div>
        </div>

        {/* ── Return Date & Time ────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Return Date & Time
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="date"
              min={pickupDate}
              value={returnDate}
              onChange={(e) => {
                setReturnDate(e.target.value);
                setErrorMsg("");
              }}
              className="col-span-2 px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              required
            />
            <input
              type="time"
              value={returnTime}
              onChange={(e) => {
                setReturnTime(e.target.value);
                setErrorMsg("");
              }}
              className="px-2 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              required
            />
          </div>
        </div>

        {/* ── Live Calculated Pricing Breakdown ─────────────────────────── */}
        {isValidRange ? (
          <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Rental Rate:</span>
              <span>₹{Number(vehicle.price_per_day).toLocaleString("en-IN")} / day</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Duration:</span>
              <span>{days} {days === 1 ? "day" : "days"}</span>
            </div>
            <div className="flex justify-between border-t border-sky-200 pt-2 font-bold text-sm text-gray-900">
              <span>Total Rental Price:</span>
              <span className="text-sky-700 text-base">₹{totalCost.toLocaleString("en-IN")}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-center">
            Select a return date after pickup date to calculate price.
          </p>
        )}

        {/* ── Auth-Aware Reservation Action Button ──────────────────────── */}
        {isAuthenticated ? (
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={!isValidRange}
          >
            Confirm & Reserve
          </Button>
        ) : (
          <div className="space-y-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-sm py-3 px-4 shadow-xs transition-colors"
            >
              Log In to Reserve
            </Link>
            <p className="text-[11px] text-gray-400 text-center">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-sky-600 hover:underline">
                Sign up in 30 seconds
              </Link>
            </p>
          </div>
        )}
      </form>

      <div className="pt-2 text-[11px] text-gray-400 space-y-1 text-center border-t border-gray-100">
        <p>🔒 Instant confirmation • 24/7 Hub Pickup</p>
        <p>Free cancellation up to 1 hour before pickup.</p>
      </div>
    </div>
  );
}
