// ─── VehicleDescription Component — Light & Dark Theme ───────────────────────
// Renders the vehicle description, overview narrative, and pickup guidelines.
//
// ────────────────────────────────────────────────────────────────────────────

export default function VehicleDescription({ vehicle }) {
  if (!vehicle) return null;

  return (
    <div className="bg-white dark:bg-[#002A28] rounded-3xl p-6 border border-[#004643]/15 dark:border-emerald-500/20 shadow-sm space-y-4 text-[#004643] dark:text-[#F0EDE5]">
      <h2 className="text-lg font-black text-[#004643] dark:text-white border-b border-[#004643]/10 dark:border-emerald-500/20 pb-3">
        About the {vehicle.name}
      </h2>

      <div className="text-xs text-gray-700 dark:text-gray-300 space-y-3 leading-relaxed font-medium">
        {vehicle.description ? (
          <p>{vehicle.description}</p>
        ) : (
          <>
            <p>
              The <strong className="text-[#004643] dark:text-white">{vehicle.name}</strong> is engineered for
              urban commuters and weekend adventurers who demand zero emissions without compromising
              on power or agility. With an aerodynamic chassis, instant electric torque, and responsive handling,
              it effortlessly weaves through city traffic.
            </p>

            <p>
              Equipped with a high-density <strong>{vehicle.battery_kwh} kWh</strong> lithium battery,
              this model delivers up to <strong>{vehicle.range_km} km</strong> on a single charge and achieves
              a top speed of <strong>{vehicle.top_speed_kmh} km/h</strong>.
            </p>
          </>
        )}
      </div>

      <div className="bg-[#F0EDE5] dark:bg-[#001F1D] border border-[#004643]/10 dark:border-emerald-500/20 rounded-2xl p-4 mt-4 space-y-1">
        <h3 className="text-xs font-black text-[#004643] dark:text-emerald-400 uppercase tracking-wider">
          Pickup & Dropoff Guarantee
        </h3>
        <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
          Pick up fully charged (100%) at any Evora Hub station. Return to any convenient hub
          in our service area with at least 15% battery remaining.
        </p>
      </div>
    </div>
  );
}
