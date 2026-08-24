// ─── Feature 1 & 2: Presentational Component — VehicleCard ─────────────────
//
// Displays a scooter card summary on the /vehicles browsing catalog.
// Clicking "View Details" or the card title navigates directly to /vehicles/[id]
// using Next.js <Link> for seamless client-side page transitions.
//
// ────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

export default function VehicleCard({ vehicle }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">

      {/* ── Scooter Image with Link ──────────────────────────────────────── */}
      <Link href={`/vehicles/${vehicle.id}`} className="block relative w-full h-48 bg-gray-100 group overflow-hidden">
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

      {/* ── Card Content ─────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Scooter Name */}
        <Link href={`/vehicles/${vehicle.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-sky-600 transition-colors">
            {vehicle.name}
          </h3>
        </Link>

        {/* ── Key Specs Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <SpecBadge label="Range" value={`${vehicle.range_km} km`} />
          <SpecBadge label="Top Speed" value={`${vehicle.top_speed_kmh} km/h`} />
          <SpecBadge label="Battery" value={`${vehicle.battery_kwh} kWh`} />
        </div>

        {/* ── Price and Details Action Button ────────────────────────────── */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ₹{Number(vehicle.price_per_day).toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-gray-500 ml-1">/ day</span>
          </div>

          <Link
            href={`/vehicles/${vehicle.id}`}
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-150"
          >
            View Details
          </Link>
        </div>

      </div>
    </div>
  );
}

// ─── Reusable Spec Mini-Badge ───────────────────────────────────────────────
function SpecBadge({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2 text-center">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-xs font-semibold text-gray-700">{value}</p>
    </div>
  );
}
