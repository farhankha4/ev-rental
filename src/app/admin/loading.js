// ─── Feature 8: Admin Loading Skeleton — /admin/loading.js ───────────────────
//
// Streaming loading skeleton state automatically rendered by Next.js while the
// /admin management portal route is loading.
//
// ────────────────────────────────────────────────────────────────────────────

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-3xl" />
        <div className="h-10 w-72 bg-gray-200 rounded-xl" />
        <div className="h-96 bg-gray-200 rounded-3xl" />
      </div>
    </div>
  );
}
