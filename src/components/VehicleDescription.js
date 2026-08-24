// ─── Feature 2: Component — VehicleDescription ─────────────────────────────
//
// Renders the vehicle description, overview narrative, and pickup guidelines.
//
// ────────────────────────────────────────────────────────────────────────────

export default function VehicleDescription({ vehicle }) {
  if (!vehicle) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
        About the SwiftVolt {vehicle.name}
      </h2>

      <div className="prose prose-sm text-gray-600 space-y-3 leading-relaxed">
        <p>
          The <strong className="text-gray-900">SwiftVolt {vehicle.name}</strong> is engineered for
          urban commuters and weekend adventurers who demand zero emissions without compromising
          on power or agility. With an aerodynamic chassis, instant electric torque, and responsive handling,
          it effortlessly weaves through city traffic.
        </p>

        <p>
          Equipped with a high-density <strong>{vehicle.battery_kwh} kWh</strong> lithium battery,
          this model delivers up to <strong>{vehicle.range_km} km</strong> on a single charge and achieves
          a top speed of <strong>{vehicle.top_speed_kmh} km/h</strong>.
        </p>
      </div>

      <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mt-4">
        <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-1">
          Pickup & Dropoff Guarantee
        </h3>
        <p className="text-xs text-sky-800">
          Pick up fully charged (100%) at any SwiftVolt Hub station. Return to any convenient hub
          in our service area with at least 15% battery remaining.
        </p>
      </div>
    </div>
  );
}
