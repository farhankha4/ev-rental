// ─── SwiftVolt EV Rental — Animated Landing Page — / ─────────────────────────
// Simultaneous horizontal row scroll reveals & button animations.
//
// ────────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

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

const defaultScooterImages = [
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
];

export default async function HomePage() {
  const vehicles = await getFeaturedVehicles();
  const featuredList = vehicles.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F0EDE5] dark:bg-[#021B19] text-[#004643] dark:text-[#F0EDE5] font-sans transition-colors duration-300">

      {/* ── 1. HERO SECTION (#hero) ───────────────────────────────────────── */}
      <section id="hero" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#F0EDE5] dark:bg-[#021B19] border-b border-[#004643]/10 dark:border-emerald-500/20 overflow-hidden">
        
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <ScrollReveal delay={0}>
              <div className="inline-flex items-center gap-2 bg-[#004643]/10 dark:bg-emerald-500/10 text-[#004643] dark:text-emerald-400 border border-[#004643]/20 dark:border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <span className="w-2.5 h-2.5 bg-[#004643] dark:bg-emerald-400 rounded-full animate-pulse" />
                <span>India's Most Dependable EV Rental Platform</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0}>
              <h1 className="text-4xl sm:text-6xl font-black text-[#004643] dark:text-white tracking-tight leading-[1.15]">
                Affordable & Electric <br />
                <span className="underline decoration-[#004643]/30 dark:decoration-emerald-500/40 underline-offset-8">
                  EV Rentals for Everyone
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0}>
              <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Rent high-performance electric scooters for daily commuting and logistics. 
                Zero maintenance costs, flexible plans starting at ₹200/day, instant online booking, and 24/7 support.
              </p>
            </ScrollReveal>

            {/* Quick Stats Banner */}
            <ScrollReveal delay={0}>
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 pt-2">
                <div className="bg-white dark:bg-[#002A28] p-3.5 rounded-2xl border border-[#004643]/10 dark:border-emerald-500/20 text-center shadow-xs hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl sm:text-3xl font-black text-[#004643] dark:text-emerald-400">150+</div>
                  <div className="text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase">Fleet Vehicles</div>
                </div>
                <div className="bg-white dark:bg-[#002A28] p-3.5 rounded-2xl border border-[#004643]/10 dark:border-emerald-500/20 text-center shadow-xs hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl sm:text-3xl font-black text-[#004643] dark:text-emerald-400">₹200</div>
                  <div className="text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase">Starts / Day</div>
                </div>
                <div className="bg-white dark:bg-[#002A28] p-3.5 rounded-2xl border border-[#004643]/10 dark:border-emerald-500/20 text-center shadow-xs hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl sm:text-3xl font-black text-[#004643] dark:text-emerald-400">24/7</div>
                  <div className="text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase">Rider Support</div>
                </div>
              </div>
            </ScrollReveal>

            {/* Action Buttons */}
            <ScrollReveal delay={0}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/vehicles"
                  className="btn-animate w-full sm:w-auto bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white font-black px-8 py-4 rounded-2xl shadow-lg text-sm flex items-center justify-center gap-2 group"
                >
                  <span>Book Your EV Now</span>
                  <svg className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>

                <Link
                  href="/dashboard"
                  className="btn-animate w-full sm:w-auto bg-white dark:bg-[#002A28] text-[#004643] dark:text-[#F0EDE5] font-extrabold px-7 py-4 rounded-2xl border-2 border-[#004643] dark:border-emerald-500/40 text-sm flex items-center justify-center gap-2"
                >
                  <span>My Dashboard</span>
                </Link>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal delay={0} className="animate-float">
              <div className="bg-[#004643] dark:bg-[#002F2D] text-[#F0EDE5] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden border border-white/10 dark:border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white">Available Fleet</h3>
                    <p className="text-xs text-[#F0EDE5]/80 font-medium">Ready for immediate pickup</p>
                  </div>
                  <span className="bg-[#F0EDE5] dark:bg-emerald-400 text-[#004643] dark:text-[#002A28] text-[10px] font-black uppercase px-3 py-1 rounded-full">
                    Instant Booking
                  </span>
                </div>

                {/* Scooter Card 1 */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#F0EDE5] text-[#004643] rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M13 2L3 14h7v8l10-12h-7V2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Evora Escout Pro</h4>
                      <p className="text-[11px] text-[#F0EDE5]/70">140 km Range | 95 km/h</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-white">₹900/day</span>
                    <p className="text-[10px] text-[#F0EDE5]/70">Daily & Monthly</p>
                  </div>
                </div>

                {/* Scooter Card 2 */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#F0EDE5] text-[#004643] rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M13 2L3 14h7v8l10-12h-7V2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Evora MCFLY</h4>
                      <p className="text-[11px] text-[#F0EDE5]/70">160 km Range | 110 km/h</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-white">₹1100/day</span>
                    <p className="text-[10px] text-[#F0EDE5]/70">High Performance</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 text-center text-xs text-[#F0EDE5]/90 font-medium">
                  Documents Required: Aadhaar Card + Driver's License
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* ── 2. SERVICES SECTION (#services) ───────────────────────────────── */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#001F1D] border-b border-[#004643]/10 dark:border-emerald-500/20">
        <div className="max-w-[1600px] mx-auto space-y-12">

          <ScrollReveal delay={0}>
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-black text-[#004643] dark:text-emerald-400 uppercase tracking-widest bg-[#F0EDE5] dark:bg-[#002A28] px-3 py-1 rounded-full border border-[#004643]/20 dark:border-emerald-500/30">
                Complete EV Solutions
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#004643] dark:text-white">
                EV Mobility & Logistics Services
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-medium">
                From individual daily commuting to delivery partner logistics, we provide the perfect electric vehicle solutions.
              </p>
            </div>
          </ScrollReveal>

          {/* All 3 Service Cards in 1 horizontal row animate together at once (delay={0}) */}
          <ScrollReveal delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-[#F0EDE5] dark:bg-[#002A28] p-8 rounded-3xl border border-[#004643]/15 dark:border-emerald-500/20 space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M19 7h-3V6a3 3 0 00-3-3h-2a3 3 0 00-3 3v1H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2zm-8-1a1 1 0 011-1h2a1 1 0 011 1v1h-4V6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#004643] dark:text-white">Daily & Monthly E-Scooter Rentals</h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  Flexible rental plans starting from 1 day up to monthly subscriptions. Perfect for daily office commutes and city travel.
                </p>
              </div>

              <div className="bg-[#F0EDE5] dark:bg-[#002A28] p-8 rounded-3xl border border-[#004643]/15 dark:border-emerald-500/20 space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-3.5H18c0-1.66-1.34-3-3-3s-3 1.34-3 3H9c0-1.66-1.34-3-3-3s-3 1.34-3 3H3V6h11v5h5.5l2 2.5V15z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#004643] dark:text-white">Last-Mile Delivery Fleet</h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  Tailored EV fleet rentals for Zomato, Swiggy, and BigBasket delivery partners with zero fuel expenditure and maximum savings.
                </p>
              </div>

              <div className="bg-[#F0EDE5] dark:bg-[#002A28] p-8 rounded-3xl border border-[#004643]/15 dark:border-emerald-500/20 space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#004643] dark:text-white">Zero Maintenance & 24/7 Support</h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  We handle 100% of vehicle maintenance, roadside assistance, and battery health checks so you ride worry-free.
                </p>
              </div>

            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── 3. SCOOTER FLEET SHOWCASE (#fleet) ────────────────────────────── */}
      <section id="fleet" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#004643] dark:bg-[#002A28] text-[#F0EDE5]">
        <div className="max-w-[1600px] mx-auto space-y-12">

          <ScrollReveal delay={0}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-black text-[#004643] uppercase tracking-widest bg-[#F0EDE5] px-3 py-1 rounded-full">
                  Electric Fleet Models
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
                  Featured Electric Scooters
                </h2>
              </div>

              <Link
                href="/vehicles"
                className="btn-animate text-xs font-black text-[#004643] bg-[#F0EDE5] hover:bg-white px-5 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2"
              >
                <span>View All Fleet Models ({vehicles.length})</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>

          {/* All 3 Fleet Cards in 1 horizontal row animate together at once (delay={0}) */}
          <ScrollReveal delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredList.map((scooter, index) => {
                const displayImage = scooter.image_url || defaultScooterImages[index % defaultScooterImages.length];

                return (
                  <div key={scooter.id} className="bg-white dark:bg-[#001F1D] text-[#004643] dark:text-[#F0EDE5] rounded-3xl border border-white/20 dark:border-emerald-500/20 overflow-hidden flex flex-col justify-between shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group">
                    <div>
                      <div className="h-56 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={displayImage}
                          alt={scooter.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-md">
                          ₹{scooter.price_per_day} / day
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black text-[#004643] dark:text-white">
                            Evora {scooter.name}
                          </h3>
                          <span className="text-[10px] font-black uppercase tracking-wider bg-[#004643]/10 dark:bg-emerald-500/20 text-[#004643] dark:text-emerald-400 px-2.5 py-1 rounded-full">
                            Available
                          </span>
                        </div>

                        {/* Specs */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs bg-[#F0EDE5] dark:bg-[#002A28] p-3 rounded-2xl border border-[#004643]/10 dark:border-emerald-500/20">
                          <div>
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 uppercase font-bold">Range</p>
                            <p className="font-black text-[#004643] dark:text-emerald-400">{scooter.range_km} km</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 uppercase font-bold">Speed</p>
                            <p className="font-black text-[#004643] dark:text-emerald-400">{scooter.top_speed_kmh} km/h</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 uppercase font-bold">Battery</p>
                            <p className="font-black text-[#004643] dark:text-emerald-400">{scooter.battery_kwh} kWh</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <Link
                        href={`/vehicles/${scooter.id}`}
                        className="btn-animate w-full bg-[#004643] dark:bg-emerald-600 hover:bg-[#003633] dark:hover:bg-emerald-500 text-[#F0EDE5] dark:text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <span>Book Scooter Now</span>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── 4. WHY CHOOSE US (#why-us) ───────────────────────────────────── */}
      <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F0EDE5] dark:bg-[#021B19] border-b border-[#004643]/10 dark:border-emerald-500/20">
        <div className="max-w-[1600px] mx-auto space-y-12">

          <ScrollReveal delay={0}>
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-black text-[#004643] dark:text-emerald-400 uppercase tracking-widest bg-white dark:bg-[#002A28] px-3 py-1 rounded-full border border-[#004643]/20 dark:border-emerald-500/30">
                Why Evora?
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#004643] dark:text-white">
                Why Choose Our Electric Fleet
              </h2>
            </div>
          </ScrollReveal>

          {/* All 4 Why Us Feature Cards in 1 horizontal row animate together at once (delay={0}) */}
          <ScrollReveal delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              <div className="bg-white dark:bg-[#002A28] p-6 rounded-3xl border border-[#004643]/10 dark:border-emerald-500/20 space-y-3 shadow-xs hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-[#F0EDE5] dark:bg-[#001F1D] text-[#004643] dark:text-emerald-400 rounded-2xl flex items-center justify-center text-xl font-bold">
                  ₹0
                </div>
                <h3 className="text-base font-bold text-[#004643] dark:text-white">Zero Security Deposit</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  No security deposits or hidden holds on your cards. Transparent daily & monthly pricing.
                </p>
              </div>

              <div className="bg-white dark:bg-[#002A28] p-6 rounded-3xl border border-[#004643]/10 dark:border-emerald-500/20 space-y-3 shadow-xs hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-[#F0EDE5] dark:bg-[#001F1D] text-[#004643] dark:text-emerald-400 rounded-2xl flex items-center justify-center text-xl font-bold">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#004643] dark:text-white">Conflict-Free Availability</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  Real-time booking engine guarantees zero date overlaps for your chosen reservation.
                </p>
              </div>

              <div className="bg-white dark:bg-[#002A28] p-6 rounded-3xl border border-[#004643]/10 dark:border-emerald-500/20 space-y-3 shadow-xs hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-[#F0EDE5] dark:bg-[#001F1D] text-[#004643] dark:text-emerald-400 rounded-2xl flex items-center justify-center text-xl font-bold">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#004643] dark:text-white">Razorpay Secure Checkout</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  Instant UPI, card, and NetBanking payments with cryptographic HMAC SHA-256 verification.
                </p>
              </div>

              <div className="bg-white dark:bg-[#002A28] p-6 rounded-3xl border border-[#004643]/10 dark:border-emerald-500/20 space-y-3 shadow-xs hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-[#F0EDE5] dark:bg-[#001F1D] text-[#004643] dark:text-emerald-400 rounded-2xl flex items-center justify-center text-xl font-bold">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#004643] dark:text-white">Instant Email Receipts</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  Automated HTML email confirmations dispatched asynchronously right after booking & payment.
                </p>
              </div>

            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── 5. HOW IT WORKS (#how-it-works) ──────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#001F1D]">
        <div className="max-w-[1600px] mx-auto space-y-12 text-center">

          <ScrollReveal delay={0}>
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-black text-[#004643] dark:text-emerald-400 uppercase tracking-widest bg-[#F0EDE5] dark:bg-[#002A28] px-3 py-1 rounded-full border border-[#004643]/20 dark:border-emerald-500/30">
                Simple Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#004643] dark:text-white">
                How Booking Works
              </h2>
            </div>
          </ScrollReveal>

          {/* All 3 How It Works Process Step Cards in 1 horizontal row animate together at once (delay={0}) */}
          <ScrollReveal delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              <div className="bg-[#F0EDE5] dark:bg-[#002A28] p-8 rounded-3xl border border-[#004643]/15 dark:border-emerald-500/20 space-y-4 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white font-black text-xl rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  01
                </div>
                <h3 className="text-lg font-bold text-[#004643] dark:text-white">Select Your EV</h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed max-w-xs mx-auto font-medium">
                  Choose your electric scooter model, check range, top speed, and battery specifications.
                </p>
              </div>

              <div className="bg-[#F0EDE5] dark:bg-[#002A28] p-8 rounded-3xl border border-[#004643]/15 dark:border-emerald-500/20 space-y-4 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white font-black text-xl rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  02
                </div>
                <h3 className="text-lg font-bold text-[#004643] dark:text-white">Pick Dates & Pay</h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed max-w-xs mx-auto font-medium">
                  Select your rental duration with guaranteed availability and pay securely via Razorpay.
                </p>
              </div>

              <div className="bg-[#F0EDE5] dark:bg-[#002A28] p-8 rounded-3xl border border-[#004643]/15 dark:border-emerald-500/20 space-y-4 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white font-black text-xl rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  03
                </div>
                <h3 className="text-lg font-bold text-[#004643] dark:text-white">Ride & Enjoy</h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed max-w-xs mx-auto font-medium">
                  Receive instant email receipt details, pick up your prepped vehicle, and enjoy zero-emission riding.
                </p>
              </div>

            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── 6. REVIEWS (#reviews) ─────────────────────────────────────────── */}
      <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#004643] dark:bg-[#002A28] text-[#F0EDE5]">
        <div className="max-w-[1600px] mx-auto space-y-12">

          <ScrollReveal delay={0}>
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-black text-[#004643] uppercase tracking-widest bg-[#F0EDE5] px-3 py-1 rounded-full">
                Rider Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Trusted by 1,000+ City Riders
              </h2>
            </div>
          </ScrollReveal>

          {/* All 3 Review Cards in 1 horizontal row animate together at once (delay={0}) */}
          <ScrollReveal delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              <div className="bg-[#F0EDE5] dark:bg-[#001F1D] text-[#004643] dark:text-[#F0EDE5] p-6 rounded-3xl space-y-4 shadow-xl border border-transparent dark:border-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 italic font-medium leading-relaxed">
                  "Rented the SwiftVolt Escout Pro for delivery shifts. Zero maintenance issues, battery range is unbelievable, and Razorpay checkout was super fast!"
                </p>
                <div className="pt-2 border-t border-[#004643]/10 dark:border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004643] dark:text-white">Aarav Mehta</span>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Delivery Partner</span>
                </div>
              </div>

              <div className="bg-[#F0EDE5] dark:bg-[#001F1D] text-[#004643] dark:text-[#F0EDE5] p-6 rounded-3xl space-y-4 shadow-xl border border-transparent dark:border-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 italic font-medium leading-relaxed">
                  "Instant confirmation email right after payment. Smooth riding, freshly prepped scooter upon pickup. Highly recommended!"
                </p>
                <div className="pt-2 border-t border-[#004643]/10 dark:border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004643] dark:text-white">Riya Sharma</span>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Daily Commuter</span>
                </div>
              </div>

              <div className="bg-[#F0EDE5] dark:bg-[#001F1D] text-[#004643] dark:text-[#F0EDE5] p-6 rounded-3xl space-y-4 shadow-xl border border-transparent dark:border-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 italic font-medium leading-relaxed">
                  "Zero deposit policy is a game changer. Friendly support staff and great vehicle options."
                </p>
                <div className="pt-2 border-t border-[#004643]/10 dark:border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004643] dark:text-white">Karan Verma</span>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Verified Rider</span>
                </div>
              </div>

            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── 7. FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-[#004643] dark:bg-[#001716] text-[#F0EDE5] py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F0EDE5] text-[#004643] flex items-center justify-center font-black">
              <svg className="w-5 h-5 text-[#004643] fill-current" viewBox="0 0 24 24">
                <path d="M13 2L3 14h7v8l10-12h-7V2z" />
              </svg>
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">Evora EV Rentals</span>
          </div>

          <div className="flex items-center gap-6 font-bold">
            <Link href="/vehicles" className="hover:text-white transition-colors">Catalog</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link>
          </div>

          <p className="text-[#F0EDE5]/70 font-medium">
            © {new Date().getFullYear()} Evora EV Rentals. All rights reserved.
          </p>

        </div>
      </footer>

    </div>
  );
}
