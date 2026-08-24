// ─── Feature 1 & 2: Presentational Component — VehicleCard ─────────────────
//
// Displays a summary card for a single electric scooter in the browsing catalog.
//
// Features:
//   • Feature 1: Renders scooter image, name, technical specs badges, and daily rate.
//   • Feature 2: Clicking the card or "View Details" navigates directly to
//     the dynamic scooter profile page `/vehicles/[id]` using Next.js <Link>.
//
// Props:
//   vehicle: Object containing { id, name, range_km, top_speed_kmh, battery_kwh, price_per_day, image_url }
//
// ────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

export default function VehicleCard({ vehicle }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">

      {/* ── 1. Scooter Hero Image with Link to Detail Page ────────────────── */}
      <Link
        href={`/vehicles/${vehicle.id}`}
        className="block relative w-full h-48 bg-gray-100 group overflow-hidden"
      >
        {vehicle.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vehicle.image_url}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
            ⚡
          </div>
        )}
      </Link>

      {/* ── 2. Card Content & Technical Specs ─────────────────────────────── */}
      <div className="p-5 flex flex-col flex-1">

        {/* Scooter Name */}
        <Link href={`/vehicles/${vehicle.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-sky-600 transition-colors">
            SwiftVolt {vehicle.name}
          </h3>
        </Link>

        {/* Specs Grid: Range, Speed, Battery */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <SpecBadge label="Range" value={`${vehicle.range_km} km`} />
          <SpecBadge label="Top Speed" value={`${vehicle.top_speed_kmh} km/h`} />
          <SpecBadge label="Battery" value={`${vehicle.battery_kwh} kWh`} />
        </div>

        {/* ── 3. Pricing and Navigation Action ─────────────────────────────── */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-2xl font-extrabold text-gray-900">
              ₹{Number(vehicle.price_per_day).toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-gray-500 ml-1">/ day</span>
          </div>

          <Link
            href={`/vehicles/${vehicle.id}`}
            className="bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            View Details
          </Link>
        </div>

      </div>
    </div>
  );
}

// ─── Helper: Mini Spec Badge ────────────────────────────────────────────────
function SpecBadge({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
      <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
      <p className="text-xs font-bold text-gray-800">{value}</p>
    </div>
  );
}
