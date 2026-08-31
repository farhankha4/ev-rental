// ─── VehicleCard Component — Light & Dark Theme ────────────────────────────
// Presentational component for scooter catalog cards.
//
// ────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

const defaultImage = "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80";

export default function VehicleCard({ vehicle }) {
  return (
    <div className="bg-white dark:bg-[#002A28] rounded-3xl shadow-xl border border-[#004643]/15 dark:border-emerald-500/20 overflow-hidden flex flex-col hover:scale-[1.02] transition-all duration-300">

      {/* Scooter Hero Image */}
      <Link
        href={`/vehicles/${vehicle.id}`}
        className="block relative w-full h-52 bg-gray-100 dark:bg-gray-800 group overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={vehicle.image_url || defaultImage}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5] dark:text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-md">
          ₹{Number(vehicle.price_per_day).toLocaleString("en-IN")} / day
        </div>
      </Link>

      {/* Card Content & Specs */}
      <div className="p-6 flex flex-col flex-1 space-y-4">

        <Link href={`/vehicles/${vehicle.id}`}>
          <h3 className="text-xl font-black text-[#004643] dark:text-white hover:underline">
            Evora {vehicle.name}
          </h3>
        </Link>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2">
          <SpecBadge label="Range" value={`${vehicle.range_km} km`} />
          <SpecBadge label="Top Speed" value={`${vehicle.top_speed_kmh} km/h`} />
          <SpecBadge label="Battery" value={`${vehicle.battery_kwh} kWh`} />
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-3 border-t border-[#004643]/10 dark:border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-[#004643] dark:text-emerald-400">
              ₹{Number(vehicle.price_per_day).toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold ml-1">/ day</span>
          </div>

          <Link
            href={`/vehicles/${vehicle.id}`}
            className="bg-[#004643] dark:bg-emerald-600 hover:bg-[#003633] dark:hover:bg-emerald-500 text-[#F0EDE5] dark:text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Book Scooter</span>
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}

function SpecBadge({ label, value }) {
  return (
    <div className="bg-[#F0EDE5] dark:bg-[#001F1D] rounded-xl p-2.5 text-center border border-[#004643]/10 dark:border-emerald-500/20">
      <p className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase">{label}</p>
      <p className="text-xs font-black text-[#004643] dark:text-emerald-400">{value}</p>
    </div>
  );
}
