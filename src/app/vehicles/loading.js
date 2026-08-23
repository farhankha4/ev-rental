// ─── What this file is ──────────────────────────────────────────────────────
//
// loading.js — the instant loading UI for the /vehicles route.
//
// Next.js automatically shows this while the page component is preparing.
// It wraps the page in a <Suspense> boundary behind the scenes, so the
// user sees something immediately instead of a blank screen.
//
// ────────────────────────────────────────────────────────────────────────────

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Simple spinning ring */}
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
        <p className="mt-4 text-gray-500 text-sm">Loading scooters...</p>
      </div>
    </div>
  );
}
