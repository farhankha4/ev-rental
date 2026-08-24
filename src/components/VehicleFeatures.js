// ─── Feature 2: Component — VehicleFeatures ────────────────────────────────
//
// Highlights standard convenience, safety, and technology features included
// with every SwiftVolt scooter rental.
//
// ────────────────────────────────────────────────────────────────────────────

export default function VehicleFeatures() {
  const features = [
    {
      title: "Fast Charging Capable",
      description: "0 to 80% charge in under 45 minutes at any SwiftVolt rapid charger.",
      icon: "⚡",
    },
    {
      title: "Smart Digital Dashboard",
      description: "Bluetooth-enabled display with real-time GPS navigation and battery telemetry.",
      icon: "📱",
    },
    {
      title: "Anti-Theft GPS Tracking",
      description: "24/7 continuous satellite tracking with remote electronic motor lock.",
      icon: "🛡️",
    },
    {
      title: "Regenerative Braking",
      description: "Recovers kinetic energy during braking to extend overall driving range.",
      icon: "🔄",
    },
    {
      title: "DOT Certified Helmet Included",
      description: "Sanitized safety helmet provided at pickup with every rental package.",
      icon: "🪖",
    },
    {
      title: "Roadside Assistance Included",
      description: "24/7 on-demand support and rapid battery swap service anywhere in town.",
      icon: "🔧",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
        Included Features & Benefits
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <span className="text-2xl p-2 bg-sky-50 rounded-lg">{feat.icon}</span>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{feat.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{feat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
