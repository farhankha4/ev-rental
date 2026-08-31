// ─── VehicleFeatures Component — Cyprus & Sand Dune Theme ────────────────────
// Replaced emojis with clean vector SVG icons.
//
// ────────────────────────────────────────────────────────────────────────────

export default function VehicleFeatures() {
  return (
    <div className="bg-white dark:bg-[#002A28] rounded-3xl p-6 border border-[#004643]/15 dark:border-emerald-500/20 shadow-sm space-y-4 text-[#004643] dark:text-[#F0EDE5]">
      <h2 className="text-lg font-black text-[#004643] dark:text-white border-b border-[#004643]/10 dark:border-emerald-500/20 pb-3">
        Included Features & Benefits
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Feature 1 */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F0EDE5]/60 dark:bg-[#001F1D] border border-[#004643]/10 dark:border-emerald-500/20">
          <div className="w-9 h-9 rounded-xl bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M13 2L3 14h7v8l10-12h-7V2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#004643] dark:text-white">Fast Charging Capable</h3>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium mt-0.5 leading-snug">
              0 to 80% charge in under 45 minutes at any Evora rapid charger.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F0EDE5]/60 dark:bg-[#001F1D] border border-[#004643]/10 dark:border-emerald-500/20">
          <div className="w-9 h-9 rounded-xl bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#004643] dark:text-white">Smart Digital Dashboard</h3>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium mt-0.5 leading-snug">
              Bluetooth-enabled display with real-time GPS navigation and battery telemetry.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F0EDE5]/60 dark:bg-[#001F1D] border border-[#004643]/10 dark:border-emerald-500/20">
          <div className="w-9 h-9 rounded-xl bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8s0 0 0 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#004643] dark:text-white">Anti-Theft GPS Tracking</h3>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium mt-0.5 leading-snug">
              24/7 continuous satellite tracking with remote electronic motor lock.
            </p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F0EDE5]/60 dark:bg-[#001F1D] border border-[#004643]/10 dark:border-emerald-500/20">
          <div className="w-9 h-9 rounded-xl bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#004643] dark:text-white">Regenerative Braking</h3>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium mt-0.5 leading-snug">
              Recovers kinetic energy during braking to extend overall driving range.
            </p>
          </div>
        </div>

        {/* Feature 5 */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F0EDE5]/60 dark:bg-[#001F1D] border border-[#004643]/10 dark:border-emerald-500/20">
          <div className="w-9 h-9 rounded-xl bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#004643] dark:text-white">DOT Certified Helmet Included</h3>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium mt-0.5 leading-snug">
              Sanitized safety helmet provided at pickup with every rental package.
            </p>
          </div>
        </div>

        {/* Feature 6 */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F0EDE5]/60 dark:bg-[#001F1D] border border-[#004643]/10 dark:border-emerald-500/20">
          <div className="w-9 h-9 rounded-xl bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.4-2.4c.4-.4.4-1 0-1.3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#004643] dark:text-white">Roadside Assistance Included</h3>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium mt-0.5 leading-snug">
              24/7 on-demand support and rapid battery swap service anywhere in town.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
