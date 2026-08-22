// ─── What this file is ──────────────────────────────────────────────────────
//
// This is the HOME PAGE of the app — what users see at localhost:3000
//
// It is a "Server Component" which means Next.js runs this code on the
// SERVER before sending HTML to the browser. That lets us fetch data
// (the health check) without any loading spinner — the page arrives
// already filled in.
//
// ────────────────────────────────────────────────────────────────────────────


// ─── Data Fetching ──────────────────────────────────────────────────────────

// This function asks our own Next.js API route (/api/health) for the
// current status of the backend and database.
// It returns a JSON object like: { status: "ok", db: "connected" }
async function getHealthStatus() {
  try {
    const res = await fetch("http://localhost:3000/api/health", {
      cache: "no-store", // always fetch fresh — don't use a cached response
    });
    return await res.json(); // parse and return the JSON response
  } catch {
    // If the fetch itself fails (e.g. network error), return a safe fallback
    return { status: "error", detail: "Could not reach the health API." };
  }
}


// ─── Small Reusable Components ──────────────────────────────────────────────

// Shows a small green dot (ok) or red dot (error)
function StatusDot({ ok }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        ok ? "bg-green-500" : "bg-red-500"
      }`}
    />
  );
}

// One row in the status card — a dot + label + value
function StatusRow({ label, value, ok }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <StatusDot ok={ok} />
      <span className="font-medium text-gray-700">{label}:</span>
      <span className={ok ? "text-green-700" : "text-red-600"}>{value}</span>
    </div>
  );
}


// ─── Page Component ─────────────────────────────────────────────────────────

// This is the main page. The `async` keyword lets us use `await` inside it,
// which is only possible because it's a Server Component.
export default async function Home() {

  // Fetch the health status from our API when the page loads
  const health = await getHealthStatus();

  // Decide whether each layer is working
  const backendOk = health.status === "ok";       // FastAPI responded correctly
  const dbOk      = health.db === "connected";    // Supabase is reachable

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">

      {/* ── App Title ───────────────────────────────────────────────────── */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          ⚡ EV Rental
        </h1>
        <p className="mt-2 text-gray-500 text-lg">
          Electric vehicle rental platform
        </p>
      </div>

      {/* ── Stack Status Card ───────────────────────────────────────────── */}
      {/* Shows whether each layer of the stack is up and running */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full max-w-sm space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Stack Status
        </h2>

        {/* Next.js is always running if you can see this page */}
        <StatusRow label="Next.js (frontend)" value="running" ok={true} />

        {/* FastAPI status — comes from the /api/health response */}
        <StatusRow
          label="FastAPI (backend)"
          value={backendOk ? "ok" : (health.detail ?? "unreachable")}
          ok={backendOk}
        />

        {/* Supabase status — also comes from the /api/health response */}
        <StatusRow
          label="Supabase (database)"
          value={
            dbOk
              ? "connected"
              : backendOk
              ? (health.db_detail ?? health.db ?? "not configured")
              : "—"   // show dash if backend is down (can't know DB status)
          }
          ok={dbOk}
        />
      </div>

      {/* ── Help Message ────────────────────────────────────────────────── */}
      {/* Only shown when something is not working — guides the developer */}
      {(!backendOk || !dbOk) && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 w-full max-w-sm text-sm text-amber-800 space-y-1">
          {!backendOk && (
            <p>
              <strong>Backend offline:</strong> open a terminal and run:{" "}
              <code className="bg-amber-100 px-1 rounded">
                cd backend &amp;&amp; uvicorn main:app --reload
              </code>
            </p>
          )}
          {backendOk && !dbOk && (
            <p>
              <strong>DB not connected:</strong> add your Supabase URL and key
              to{" "}
              <code className="bg-amber-100 px-1 rounded">backend/.env</code>
            </p>
          )}
        </div>
      )}

      {/* Note reminding us this is a temporary diagnostic screen */}
      <p className="mt-8 text-xs text-gray-400">
        This status card is temporary — it will be replaced by Feature 1 (Browse Scooters).
      </p>

    </div>
  );
}
