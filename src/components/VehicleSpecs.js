// ─── VehicleSpecs Component — Premium Cyprus & Sand Dune Theme ──────────────
// Replaced emojis with clean, professional vector SVG icons.
//
// ────────────────────────────────────────────────────────────────────────────

export default function VehicleSpecs({ vehicle }) {
  if (!vehicle) return null;

  return (
    <div className="bg-white dark:bg-[#002A28] rounded-3xl p-6 border border-[#004643]/15 dark:border-emerald-500/20 shadow-sm space-y-4 text-[#004643] dark:text-[#F0EDE5]">
      <h2 className="text-lg font-black text-[#004643] dark:text-white border-b border-[#004643]/10 dark:border-emerald-500/20 pb-3">
        Technical Specifications
      </h2>

      <div className="grid grid-cols-2 gap-4">
        
        {/* 1. Estimated Range */}
        <div className="bg-[#F0EDE5] dark:bg-[#001F1D] rounded-2xl p-4 border border-[#004643]/10 dark:border-emerald-500/20 flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Estimated Range</span>
          </div>
          <div>
            <p className="text-xl font-black text-[#004643] dark:text-emerald-400">{vehicle.range_km} km</p>
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">Per full charge cycle</p>
          </div>
        </div>

        {/* 2. Top Speed */}
        <div className="bg-[#F0EDE5] dark:bg-[#001F1D] rounded-2xl p-4 border border-[#004643]/10 dark:border-emerald-500/20 flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M13 2L3 14h7v8l10-12h-7V2z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Top Speed</span>
          </div>
          <div>
            <p className="text-xl font-black text-[#004643] dark:text-emerald-400">{vehicle.top_speed_kmh} km/h</p>
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">Eco & Sport modes</p>
          </div>
        </div>

        {/* 3. Battery Pack */}
        <div className="bg-[#F0EDE5] dark:bg-[#001F1D] rounded-2xl p-4 border border-[#004643]/10 dark:border-emerald-500/20 flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Battery Pack</span>
          </div>
          <div>
            <p className="text-xl font-black text-[#004643] dark:text-emerald-400">{vehicle.battery_kwh} kWh</p>
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">Lithium-ion fast charge</p>
          </div>
        </div>

        {/* 4. Rental Rate */}
        <div className="bg-[#F0EDE5] dark:bg-[#001F1D] rounded-2xl p-4 border border-[#004643]/10 dark:border-emerald-500/20 flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white flex items-center justify-center shrink-0 font-black text-xs">
              ₹
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Rental Rate</span>
          </div>
          <div>
            <p className="text-xl font-black text-[#004643] dark:text-emerald-400">
              ₹{Number(vehicle.price_per_day).toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">Per 24-hour period</p>
          </div>
        </div>

      </div>
    </div>
  );
}
