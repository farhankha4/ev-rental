"use client";

// ─── VehicleGallery Component — Light & Dark Theme with Image Error Fallback ────
//
// Renders the primary media showcase for the scooter on its detail page.
// Includes automatic fallback to high-res Unsplash image if custom image URL fails.
//
// ────────────────────────────────────────────────────────────────────────────

const fallbackImage = "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80";

export default function VehicleGallery({ vehicle }) {
  const displayImage = vehicle?.image_url || fallbackImage;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gray-900 border border-[#004643]/15 dark:border-emerald-500/20 aspect-[16/10] sm:aspect-[16/9] shadow-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displayImage}
        alt={vehicle?.name || "Electric Scooter"}
        onError={(e) => {
          e.currentTarget.src = fallbackImage;
        }}
        className="w-full h-full object-cover"
      />

      {/* ── Status Pill Overlay ──────────────────────────────────────────── */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#002A28]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black shadow-md flex items-center gap-2 border border-white/20">
        <span className={`w-2.5 h-2.5 rounded-full ${vehicle?.available ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
        <span className={vehicle?.available ? "text-[#004643] dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
          {vehicle?.available ? "Available Now" : "Maintenance Mode"}
        </span>
      </div>

      {/* ── Model Watermark Badge ────────────────────────────────────────── */}
      <div className="absolute bottom-4 right-4 bg-[#004643]/90 dark:bg-[#001716]/90 backdrop-blur-md text-[#F0EDE5] dark:text-white px-3.5 py-1.5 rounded-2xl text-xs font-black tracking-tight border border-white/10 shadow-md">
        {vehicle?.name}
      </div>
    </div>
  );
}
