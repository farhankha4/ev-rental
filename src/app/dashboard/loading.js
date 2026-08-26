// ─── Feature 6: Dashboard Loading Skeleton — /dashboard/loading.js ─────────
//
// Streaming loading state automatically rendered by Next.js while the user
// dashboard route is preparing.
//
// ────────────────────────────────────────────────────────────────────────────

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div className="h-24 bg-gray-200 rounded-3xl" />

        {/* Tabs skeleton */}
        <div className="h-10 w-72 bg-gray-200 rounded-xl" />

        {/* Cards skeleton */}
        <div className="space-y-4">
          <div className="h-44 bg-gray-200 rounded-3xl" />
          <div className="h-44 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
