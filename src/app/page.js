// ─── SwiftVolt EV Rental — Premium Hero Landing Page — / ────────────────────────
//
// What this file is:
//   The official homepage and landing page for SwiftVolt EV Rental platform.
//
// Role in the Project:
//   • Serves as the primary marketing & conversion portal for users visiting http://localhost:3000.
//   • Features Hero banner, Key Selling Points, Featured Scooter Fleet Grid,
//     "How It Works" 3-step guide, Customer Reviews, and System Health Monitor.
//
// ────────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";

// ─── Data Fetcher Functions ──────────────────────────────────────────────────

// Fetch catalog vehicles for the Featured Fleet Preview grid
async function getFeaturedVehicles() {
  try {
    const res = await fetch("http://localhost:3000/api/vehicles", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Fetch live system health status (Feature 0 monitor)
async function getHealthStatus() {
  try {
    const res = await fetch("http://localhost:3000/api/health", {
      cache: "no-store",
    });
    return await res.json();
  } catch {
    return { status: "error", detail: "Health API unreachable" };
  }
}

export default async function HomePage() {
  const [vehicles, health] = await Promise.all([
    getFeaturedVehicles(),
    getHealthStatus(),
  ]);

  const featuredList = vehicles.slice(0, 3); // Take top 3 scooters for landing preview
  const backendOk = health.status === "ok";
  const dbOk = health.db === "connected";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

      {/* ── 1. HERO SECTION ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-sky-900 via-slate-900 to-gray-900 text-white py-20 px-4 relative overflow-hidden">
        {/* Subtle Decorative Background Gradients */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-400/30 text-sky-300 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xs">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span>Next-Gen Zero Emission Mobility</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Urban Mobility Redefined. <br />
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Rent Premium EV Scooters.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-sm sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Experience smooth, silent, and eco-friendly rides. Instant online booking,
            Razorpay secure payments, zero deposit, and automated email receipts.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/vehicles"
              className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg shadow-sky-500/25 transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>⚡ Explore Scooter Fleet</span>
              <span>→</span>
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold px-7 py-4 rounded-2xl backdrop-blur-xs border border-white/20 transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>📋 My Rentals</span>
            </Link>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-10 border-t border-white/10 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-sky-400">100%</p>
              <p className="text-[11px] text-gray-400 uppercase font-semibold">Electric Fleet</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">₹0</p>
              <p className="text-[11px] text-gray-400 uppercase font-semibold">Security Deposit</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">4.9 ★</p>
              <p className="text-[11px] text-gray-400 uppercase font-semibold">Customer Rating</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. FEATURE HIGHLIGHTS (WHY CHOOSE SWIFTVOLT?) ─────────────────── */}
      <section className="py-16 px-4 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">
              Why SwiftVolt EV Rental?
            </h2>
            <p className="text-3xl font-black text-gray-900">
              Engineered for Seamless City Commutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center text-2xl">
                ⚡
              </div>
              <h3 className="text-base font-bold text-gray-900">Long Range Battery</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                High-density lithium-ion battery packs offering up to 140 km range on a single charge.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">
                📅
              </div>
              <h3 className="text-base font-bold text-gray-900">Conflict-Free Dates</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Real-time booking engine prevents scheduling overlaps so your scooter is guaranteed.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                💳
              </div>
              <h3 className="text-base font-bold text-gray-900">Razorpay Payments</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Instant digital payment processing via UPI, credit/debit cards, and NetBanking with HMAC security.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl">
                ✉️
              </div>
              <h3 className="text-base font-bold text-gray-900">Instant Email Receipts</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Automated confirmation and payment receipt emails sent straight to your inbox via BackgroundTasks.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. FEATURED SCOOTER CATALOG PREVIEW ──────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-10">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">
                Our Electric Fleet
              </h2>
              <p className="text-3xl font-black text-gray-900 mt-1">
                Featured Electric Scooters
              </p>
            </div>

            <Link
              href="/vehicles"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>View All Models ({vehicles.length})</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredList.map((scooter) => (
              <div
                key={scooter.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="h-48 bg-gray-100 relative overflow-hidden">
                    {scooter.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={scooter.image_url}
                        alt={scooter.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">⚡</div>
                    )}
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-gray-900 font-extrabold text-xs px-3 py-1 rounded-full shadow-xs">
                      ₹{scooter.price_per_day}/day
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      SwiftVolt {scooter.name}
                    </h3>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Range</p>
                        <p className="font-bold text-gray-800">{scooter.range_km} km</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Speed</p>
                        <p className="font-bold text-gray-800">{scooter.top_speed_kmh} km/h</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Battery</p>
                        <p className="font-bold text-gray-800">{scooter.battery_kwh} kWh</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/vehicles/${scooter.id}`}
                    className="w-full bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>View Specs & Book</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 4. HOW IT WORKS (3 EASY STEPS) ───────────────────────────────── */}
      <section className="py-16 px-4 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto space-y-12 text-center">

          <div className="space-y-2">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">
              Simple 3-Step Process
            </h2>
            <p className="text-3xl font-black text-gray-900">
              How Renting Works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            <div className="space-y-3">
              <div className="w-14 h-14 bg-sky-500 text-white font-black text-xl rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-sky-500/20">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900">Choose Scooter</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                Browse our catalog of electric scooters, check battery specs, daily rates, and rider reviews.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-14 h-14 bg-sky-500 text-white font-black text-xl rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-sky-500/20">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900">Pick Dates & Pay</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                Select your pickup and return dates with conflict prevention, and complete secure Razorpay payment.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-14 h-14 bg-sky-500 text-white font-black text-xl rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-sky-500/20">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900">Ride & Enjoy</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                Receive instant email receipts, pick up your prepped scooter, and enjoy zero-emission riding.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. SYSTEM HEALTH MONITOR (FEATURE 0 INTEGRATION) ──────────────── */}
      <section className="py-8 px-4 bg-gray-100 border-b border-gray-200">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <span className="font-bold text-gray-900">System Architecture Status:</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              <span className="text-gray-600">Next.js Frontend</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 ${backendOk ? "bg-green-500" : "bg-red-500"} rounded-full`} />
              <span className="text-gray-600">FastAPI Backend</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 ${dbOk ? "bg-green-500" : "bg-red-500"} rounded-full`} />
              <span className="text-gray-600">Supabase Database</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <span>⚡</span>
            <span>SwiftVolt EV Rental</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/vehicles" className="hover:text-white transition-colors">Catalog</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link>
          </div>

          <p>© {new Date().getFullYear()} SwiftVolt EV Rental Platform. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
