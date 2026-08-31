"use client";

// ─── User Dashboard Page — /dashboard — Light & Dark Theme ──────────────────
//
// ────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useMyBookings } from "@/hooks/useMyBookings";
import BookingCard from "@/components/BookingCard";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { bookings, isLoading: bookingsLoading, isError, errorMessage, refetch } = useMyBookings();
  const [activeTab, setActiveTab] = useState("upcoming");

  const { upcomingBookings, pastBookings } = useMemo(() => {
    const now = new Date();
    const upcoming = [];
    const past = [];

    bookings.forEach((booking) => {
      const returnDate = new Date(booking.return_time);
      if (booking.booking_status === "cancelled" || booking.booking_status === "completed" || returnDate < now) {
        past.push(booking);
      } else {
        upcoming.push(booking);
      }
    });

    return { upcomingBookings: upcoming, pastBookings: past };
  }, [bookings]);

  if (authLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-[#F0EDE5] dark:bg-[#021B19] py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-10 w-48 bg-white/40 dark:bg-white/10 rounded-xl" />
          <div className="h-12 w-64 bg-white/40 dark:bg-white/10 rounded-xl" />
          <div className="space-y-4">
            <div className="h-44 bg-white/40 dark:bg-white/10 rounded-3xl" />
            <div className="h-44 bg-white/40 dark:bg-white/10 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[80vh] bg-[#F0EDE5] dark:bg-[#021B19] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-[#002A28] p-8 rounded-3xl border border-[#004643]/20 dark:border-emerald-500/20 shadow-xl text-center max-w-md w-full space-y-4">
          <h1 className="text-2xl font-black text-[#004643] dark:text-white">Login Required</h1>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            Please log in to your Evora account to view your rental dashboard and active bookings.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#004643] dark:bg-emerald-600 hover:bg-[#003633] text-[#F0EDE5] dark:text-white font-black px-6 py-3 rounded-2xl transition-colors text-xs shadow-md"
          >
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  const currentList = activeTab === "upcoming" ? upcomingBookings : pastBookings;

  return (
    <div className="min-h-screen bg-[#F0EDE5] dark:bg-[#021B19] text-[#004643] dark:text-[#F0EDE5] py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#002A28] p-6 sm:p-8 rounded-3xl border border-[#004643]/15 dark:border-emerald-500/20 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#004643]/10 dark:bg-emerald-500/20 text-[#004643] dark:text-emerald-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1">
              Customer Portal
            </div>
            <h1 className="text-3xl font-black text-[#004643] dark:text-white">
              My Rental Dashboard
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mt-1">
              Welcome back, <strong className="text-[#004643] dark:text-emerald-400">{user.full_name}</strong> ({user.email})
            </p>
          </div>

          <Link
            href="/vehicles"
            className="inline-flex items-center justify-center gap-2 bg-[#004643] dark:bg-emerald-600 hover:bg-[#003633] text-[#F0EDE5] dark:text-white font-black text-xs px-5 py-3 rounded-2xl shadow-md transition-all"
          >
            <span>Rent Another Scooter</span>
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Error Alert */}
        {isError && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs p-4 rounded-2xl flex items-center justify-between font-bold">
            <span>{errorMessage || "Could not load bookings."}</span>
            <button
              onClick={() => refetch()}
              className="text-xs underline hover:text-rose-950 dark:hover:text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="space-y-6">
          <div className="flex border-b border-[#004643]/20 dark:border-emerald-500/20 gap-8 text-sm font-black">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "upcoming"
                  ? "border-[#004643] dark:border-emerald-400 text-[#004643] dark:text-emerald-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-[#004643]"
              }`}
            >
              <span>Upcoming & Active Rentals</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                activeTab === "upcoming" ? "bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5]" : "bg-white dark:bg-[#002A28] text-gray-700 dark:text-gray-300 border border-[#004643]/10"
              }`}>
                {upcomingBookings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "past"
                  ? "border-[#004643] dark:border-emerald-400 text-[#004643] dark:text-emerald-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-[#004643]"
              }`}
            >
              <span>Past & Completed</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                activeTab === "past" ? "bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5]" : "bg-white dark:bg-[#002A28] text-gray-700 dark:text-gray-300 border border-[#004643]/10"
              }`}>
                {pastBookings.length}
              </span>
            </button>
          </div>

          {/* List or Empty State */}
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
            <div className="bg-white dark:bg-[#002A28] rounded-3xl p-12 border border-[#004643]/15 dark:border-emerald-500/20 text-center space-y-4 shadow-sm">
              <h2 className="text-lg font-black text-[#004643] dark:text-white">
                {activeTab === "upcoming" ? "No Active or Upcoming Reservations" : "No Past Rentals Recorded"}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-sm mx-auto font-medium">
                {activeTab === "upcoming"
                  ? "You don't have any electric scooters reserved right now. Explore our fleet catalog!"
                  : "Your past completed rentals will appear here once finished."}
              </p>
              {activeTab === "upcoming" && (
                <div>
                  <Link
                    href="/vehicles"
                    className="inline-block bg-[#004643] dark:bg-emerald-600 hover:bg-[#003633] text-[#F0EDE5] dark:text-white font-black px-6 py-3 rounded-2xl text-xs transition-colors shadow-md"
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
