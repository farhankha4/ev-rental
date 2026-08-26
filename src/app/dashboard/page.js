"use client";

// ─── Feature 6 & 7: User Dashboard Page — /dashboard ─────────────────────────
//
// What this file is:
//   This is the client-side page rendered when a user navigates to `/dashboard`.
//   It displays the logged-in user's personal electric scooter reservation history,
//   categorized cleanly into two interactive tabs:
//     1. "Upcoming & Active Rentals" -> Reserved scooters with future or ongoing return dates
//     2. "Past & Completed"          -> Completed, expired, or cancelled reservations
//
// Which feature & part:
//   • Feature 6 (My Bookings Dashboard) — Frontend Page Component
//   • Feature 7 (Razorpay Payments)     — Triggers list refetch after payment verification
//
// How it works:
//   • Uses `useAuth()` to check if the user is authenticated.
//   • Uses `useMyBookings()` custom TanStack Query hook to fetch real-time booking records.
//   • Uses React `useMemo` to sort reservations into `upcomingBookings` and `pastBookings`.
//   • Handles 4 states: Auth Loading, Guest Access Warning, Error State, and Populated List / Empty State.
//
// ────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useMyBookings } from "@/hooks/useMyBookings";
import BookingCard from "@/components/BookingCard";

export default function DashboardPage() {
  // ─── 1. Auth & Data Hooks ──────────────────────────────────────────────────
  // Obtain active user session from AuthContext
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Obtain user's bookings array and status from custom TanStack Query hook
  const { bookings, isLoading: bookingsLoading, isError, errorMessage, refetch } = useMyBookings();

  // Active UI tab state: 'upcoming' or 'past'
  const [activeTab, setActiveTab] = useState("upcoming");

  // ─── 2. Categorize Bookings into Upcoming vs Past (useMemo for performance) ─
  // Re-evaluates only when `bookings` array changes.
  const { upcomingBookings, pastBookings } = useMemo(() => {
    const now = new Date();

    const upcoming = [];
    const past = [];

    bookings.forEach((booking) => {
      const returnDate = new Date(booking.return_time);

      // Bookings that are cancelled, completed, or whose return date has passed belong to 'past'
      if (booking.booking_status === "cancelled" || booking.booking_status === "completed" || returnDate < now) {
        past.push(booking);
      } else {
        // Active or future reservations belong to 'upcoming'
        upcoming.push(booking);
      }
    });

    return { upcomingBookings: upcoming, pastBookings: past };
  }, [bookings]);

  // ─── 3. State 1: Auth or Data Loading Skeleton ─────────────────────────────
  if (authLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          {/* Skeleton Title Bar */}
          <div className="h-10 w-48 bg-gray-200 rounded-xl" />
          {/* Skeleton Tabs Bar */}
          <div className="h-12 w-64 bg-gray-200 rounded-xl" />
          {/* Skeleton Cards List */}
          <div className="space-y-4">
            <div className="h-44 bg-gray-200 rounded-3xl" />
            <div className="h-44 bg-gray-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // ─── 4. State 2: Auth Guard for Unauthenticated Guests ────────────────────
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-center max-w-md w-full space-y-4">
          <div className="text-5xl">🔐</div>
          <h1 className="text-2xl font-extrabold text-gray-900">Login Required</h1>
          <p className="text-xs text-gray-500">
            Please log in to your SwiftVolt account to view your rental dashboard and active bookings.
          </p>
          <Link
            href="/login"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  // Select current active list based on active tab state
  const currentList = activeTab === "upcoming" ? upcomingBookings : pastBookings;

  // ─── 5. State 3 & 4: Main Populated Dashboard View ────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Dashboard Top Header & User Welcome ─────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              My Rental Dashboard
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Welcome back, <strong className="text-gray-800">{user.full_name}</strong> ({user.email})
            </p>
          </div>

          <Link
            href="/vehicles"
            className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <span>⚡ Rent Another Scooter</span>
          </Link>
        </div>

        {/* ── Error Banner ─────────────────────────────────────────────────── */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage || "Could not load bookings."}</span>
            </div>
            <button
              onClick={() => refetch()}
              className="text-xs font-bold underline hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Tab Switcher: Upcoming vs Past Rentals ──────────────────────── */}
        <div className="space-y-6">
          <div className="flex border-b border-gray-200 gap-8 text-sm font-bold">
            {/* Tab 1: Upcoming & Active */}
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "upcoming"
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <span>Upcoming & Active Rentals</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === "upcoming" ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-600"
              }`}>
                {upcomingBookings.length}
              </span>
            </button>

            {/* Tab 2: Past & Completed */}
            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "past"
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <span>Past & Completed</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === "past" ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-600"
              }`}>
                {pastBookings.length}
              </span>
            </button>
          </div>

          {/* ── Reservations List or Empty State ───────────────────────────── */}
          {currentList.length > 0 ? (
            <div className="space-y-4">
              {currentList.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onPaymentSuccess={() => refetch()}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-gray-200 text-center space-y-4 shadow-sm">
              <div className="text-5xl">🛴</div>
              <h2 className="text-lg font-bold text-gray-800">
                {activeTab === "upcoming" ? "No Active or Upcoming Reservations" : "No Past Rentals Recorded"}
              </h2>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                {activeTab === "upcoming"
                  ? "You don't have any scooters reserved right now. Explore our catalog of electric scooters!"
                  : "Your past completed rentals will appear here once finished."}
              </p>
              {activeTab === "upcoming" && (
                <div>
                  <Link
                    href="/vehicles"
                    className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
                  >
                    Browse Catalog
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
