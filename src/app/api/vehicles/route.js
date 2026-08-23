// ─── What this file is ──────────────────────────────────────────────────────
//
// Next.js Route Handler — /api/vehicles
//
// This is a server-side proxy. The browser calls /api/vehicles (Next.js),
// and this handler forwards the request to FastAPI's /vehicles endpoint.
//
// Why proxy instead of calling FastAPI directly from the browser?
//   Browser → FastAPI directly would require CORS to be perfectly configured.
//   Server → Server has no CORS restrictions at all — simpler and safer.
//
// ────────────────────────────────────────────────────────────────────────────

export async function GET() {
  // Read the FastAPI URL from the environment (defaults to localhost:8000)
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";

  try {
    // Forward the request to FastAPI
    const res = await fetch(`${apiUrl}/vehicles`, {
      cache: "no-store", // always fetch fresh data — don't use a stale cache
    });

    // If FastAPI responded with an error status, pass it along
    if (!res.ok) {
      return Response.json(
        { error: `FastAPI returned HTTP ${res.status}` },
        { status: 502 } // 502 = Bad Gateway
      );
    }

    // Parse FastAPI's JSON and send it straight to the browser
    const data = await res.json();
    return Response.json(data);

  } catch {
    // FastAPI is not running — return a clear error message
    return Response.json(
      { error: "Cannot reach FastAPI backend. Is it running on port 8000?" },
      { status: 503 } // 503 = Service Unavailable
    );
  }
}
