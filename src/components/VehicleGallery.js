// ─── Feature 2: Component — VehicleGallery ─────────────────────────────────
//
// Renders the primary media showcase for the scooter on its detail page.
// Shows the hero image with availability status badge and model branding.
//
// ────────────────────────────────────────────────────────────────────────────

export default function VehicleGallery({ vehicle }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 aspect-[16/10] sm:aspect-[16/9] shadow-sm">
      {vehicle?.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={vehicle.image_url}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
          <span className="text-6xl mb-2">⚡</span>
          <p className="text-sm">SwiftVolt Electric Vehicle</p>
        </div>
      )}

      {/* ── Status Pill Overlay ──────────────────────────────────────────── */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${vehicle?.available ? "bg-green-500" : "bg-amber-500"}`} />
        <span className={vehicle?.available ? "text-green-700" : "text-amber-700"}>
          {vehicle?.available ? "Available Now" : "Currently Booked"}
        </span>
      </div>

      {/* ── Model Watermark Badge ────────────────────────────────────────── */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-mono">
        SwiftVolt {vehicle?.name}
      </div>
    </div>
  );
}
