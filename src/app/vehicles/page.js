// ─── Scooter Catalog Page — /vehicles ───────────────────────────────────────
// Supports Light & Dark Theme.
//
// ────────────────────────────────────────────────────────────────────────────

import VehicleGrid from "@/components/VehicleGrid";

export const metadata = {
  title: "Electric Fleet Catalog — Evora EV Rentals",
  description: "Browse all available Evora electric scooters for rent.",
};

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-[#F0EDE5] dark:bg-[#021B19] text-[#004643] dark:text-[#F0EDE5] transition-colors duration-300">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="bg-[#004643] dark:bg-[#002A28] text-[#F0EDE5] border-b border-white/10 dark:border-emerald-500/20 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#F0EDE5] dark:bg-emerald-400 text-[#004643] dark:text-[#002A28] text-[10px] font-black uppercase px-3 py-1 rounded-full">
            Available Fleet
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Electric Scooter Fleet
          </h1>
          <p className="text-[#F0EDE5]/80 text-sm max-w-xl font-medium">
            Explore our high-performance electric vehicles. Daily & monthly rental plans with zero security deposit.
          </p>
        </div>
      </div>

      {/* ── Vehicle Grid ─────────────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <VehicleGrid />
      </div>

    </div>
  );
}
