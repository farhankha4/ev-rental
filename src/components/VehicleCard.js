// ─── What this file is ──────────────────────────────────────────────────────
//
// VehicleCard — displays one scooter as a styled card.
//
// This is a pure "presentational" component: it receives one vehicle
// object as a prop and just renders it. It doesn't fetch data itself.
//
// Props:
//   vehicle — a single vehicle object from the API, shaped like:
//   {
//     id, name, battery_kwh, range_km, top_speed_kmh,
//     price_per_day, image_url, available
//   }
//
// ────────────────────────────────────────────────────────────────────────────

export default function VehicleCard({ vehicle }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">

      {/* ── Scooter Image ──────────────────────────────────────────────── */}
      <div className="relative w-full h-48 bg-gray-100">
        {vehicle.image_url ? (
          // We use a regular <img> here because the images are from an
          // external placeholder service. When we add real images later
          // we'll switch to Next.js <Image> for automatic optimisation.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vehicle.image_url}
            alt={vehicle.name}
            className="w-full h-full object-cover"
          />
        ) : (
          // Fallback when there's no image URL
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
            ⚡
          </div>
        )}
      </div>

      {/* ── Card Body ──────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Scooter name */}
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          {vehicle.name}
        </h3>

        {/* ── Specs Grid ─────────────────────────────────────────────── */}
        {/* Three key specs shown as a small 3-column grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <SpecBadge label="Range" value={`${vehicle.range_km} km`} />
          <SpecBadge label="Top Speed" value={`${vehicle.top_speed_kmh} km/h`} />
          <SpecBadge label="Battery" value={`${vehicle.battery_kwh} kWh`} />
        </div>

        {/* Push price and button to the bottom of the card */}
        <div className="mt-auto flex items-center justify-between">

          {/* Price per day */}
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ₹{vehicle.price_per_day.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-gray-500 ml-1">/ day</span>
          </div>

          {/* Rent Now button — non-functional for now (Feature 2 adds booking) */}
          <button
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-150"
            onClick={() => console.log(`Rent clicked: ${vehicle.id}`)}
          >
            Rent Now
          </button>

        </div>
      </div>
    </div>
  );
}

// ─── Small helper component ──────────────────────────────────────────────────

// SpecBadge — renders one labelled spec value (e.g. "Range / 140 km")
function SpecBadge({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2 text-center">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-xs font-semibold text-gray-700">{value}</p>
    </div>
  );
}
