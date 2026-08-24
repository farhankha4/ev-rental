// ─── Feature 0: Home / Diagnostic Landing Page — / ───────────────────────────
//
// This is the default index page rendered when a user opens http://localhost:3000.
//
// It is a React "Server Component", meaning Next.js runs this code on the server
// before streaming HTML to the browser.
//
// Role in the Project:
//   • Feature 0 (Skeleton Setup): Acts as the health monitor proving all 3 layers
//     (Next.js Frontend → FastAPI Backend → Supabase Cloud Database) are alive.
//
// ────────────────────────────────────────────────────────────────────────────

// ─── 1. Health Status Data Fetcher ───────────────────────────────────────────
// Calls our internal Next.js proxy route (/api/health), which forwards the probe
// to FastAPI (http://localhost:8000/health) and Supabase.
async function getHealthStatus() {
  try {
    const res = await fetch("http://localhost:3000/api/health", {
      cache: "no-store", // Always fetch fresh live data — bypass static caching
    });
    return await res.json();
  } catch {
    // If the fetch fails (e.g. backend server offline), return safe fallback object
    return { status: "error", detail: "Could not reach the health API." };
  }
}

// ─── 2. Small UI Sub-Components ──────────────────────────────────────────────

// StatusDot: Renders a green circle when layer is OK, or red when offline
function StatusDot({ ok }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        ok ? "bg-green-500" : "bg-red-500"
      }`}
    />
  );
}

// StatusRow: A single row displaying a service name, status text, and colored dot
function StatusRow({ label, value, ok }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <StatusDot ok={ok} />
      <span className="font-medium text-gray-700">{label}:</span>
      <span className={ok ? "text-green-700" : "text-red-600"}>{value}</span>
    </div>
  );
}

// ─── 3. Home Page Server Component ───────────────────────────────────────────
export default async function Home() {
  // Fetch live health status during server-side render
  const health = await getHealthStatus();

  const backendOk = health.status === "ok";       // True if FastAPI returned 200
  const dbOk      = health.db === "connected";    // True if Supabase responded

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">

      {/* ── App Brand Header ─────────────────────────────────────────────── */}
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          ⚡ EV Rental
        </h1>
        <p className="text-gray-500 text-base max-w-sm mx-auto">
          Electric vehicle rental platform powered by Next.js, FastAPI & Supabase.
        </p>
      </div>

      {/* ── Stack Status Diagnostic Card ─────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 w-full max-w-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">
          Architecture Health
        </h2>

        {/* Frontend status (always running if page is viewable) */}
        <StatusRow label="Next.js (frontend)" value="running" ok={true} />

        {/* FastAPI backend status */}
        <StatusRow
          label="FastAPI (backend)"
          value={backendOk ? "ok" : (health.detail ?? "unreachable")}
          ok={backendOk}
        />

        {/* Supabase PostgreSQL database status */}
        <StatusRow
          label="Supabase (database)"
          value={
            dbOk
              ? "connected"
              : backendOk
              ? (health.db_detail ?? health.db ?? "not configured")
              : "—" // Dash shown if backend is down
          }
          ok={dbOk}
        />
      </div>

      {/* ── Quick Navigation to Catalog ──────────────────────────────────── */}
      <div className="mt-8 text-center">
        <a
          href="/vehicles"
          className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-semibold text-sm px-6 py-3 rounded-2xl shadow-xs transition-colors"
        >
          <span>Browse Scooters Catalog</span>
          <span>→</span>
        </a>
      </div>

    </div>
  );
}
