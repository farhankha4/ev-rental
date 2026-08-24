// ─── Feature 2: Component — VehicleSpecs ───────────────────────────────────
//
// Renders the comprehensive technical specification matrix for the scooter.
// Shows battery capacity, estimated range, maximum speed, and pricing rate.
//
// ────────────────────────────────────────────────────────────────────────────

export default function VehicleSpecs({ vehicle }) {
  if (!vehicle) return null;

  const specs = [
    {
      label: "Estimated Range",
      value: `${vehicle.range_km} km`,
      subtext: "Per full charge cycle",
      icon: "🛣️",
    },
    {
      label: "Top Speed",
      value: `${vehicle.top_speed_kmh} km/h`,
      subtext: "Eco & Sport modes available",
      icon: "⚡",
    },
    {
      label: "Battery Pack",
      value: `${vehicle.battery_kwh} kWh`,
      subtext: "Lithium-ion with fast charging",
      icon: "🔋",
    },
    {
      label: "Rental Rate",
      value: `₹${Number(vehicle.price_per_day).toLocaleString("en-IN")}`,
      subtext: "Per 24-hour rental period",
      icon: "🏷️",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
        Technical Specifications
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {specs.map((item, idx) => (
          <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs text-gray-500 font-medium">{item.label}</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{item.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{item.subtext}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
