// ─── Feature 2: Loading State — /vehicles/[id]/loading.js ───────────────────
//
// Instant streaming skeleton rendered by Next.js App Router while
// navigating to any scooter detail page.
//
// ────────────────────────────────────────────────────────────────────────────

export default function VehicleDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        {/* Navigation placeholder */}
        <div className="h-5 w-32 bg-gray-200 rounded" />

        {/* Header banner placeholder */}
        <div className="h-24 bg-gray-200 rounded-2xl" />

        {/* Two-column layout placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-80 sm:h-96 bg-gray-200 rounded-2xl" />
            <div className="h-44 bg-gray-200 rounded-2xl" />
            <div className="h-48 bg-gray-200 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <div className="h-72 bg-gray-200 rounded-2xl" />
            <div className="h-52 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
