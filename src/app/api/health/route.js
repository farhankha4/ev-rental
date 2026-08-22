// ─── What this file is ──────────────────────────────────────────────────────
//
// This is a Next.js "Route Handler" — it works like a tiny API endpoint
// that lives inside the Next.js app itself.
//
// URL:  /api/health
// Job:  Forward the request to FastAPI, get its response, and pass it back.
//
// Why not call FastAPI directly from the browser?
//   Because CORS (Cross-Origin Resource Sharing) rules would block it.
//   By routing through here (server → server), we avoid that problem entirely.
//
// ────────────────────────────────────────────────────────────────────────────


// GET /api/health
// Called by the home page (page.js) to check if all layers are alive
export async function GET() {

  // Read the FastAPI URL from the environment variable.
  // Falls back to localhost:8000 if the variable isn't set.
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";

  try {
    // Forward the request to FastAPI's own /health endpoint
    const res = await fetch(`${apiUrl}/health`, {
      cache: "no-store", // never cache — always get a fresh live response
    });

    // If FastAPI responded but with an error status code, pass that error along
    if (!res.ok) {
      return Response.json(
        { status: "error", detail: `FastAPI returned HTTP ${res.status}` },
        { status: 502 } // 502 = "Bad Gateway" (we got a bad response upstream)
      );
    }

    // Everything is fine — parse FastAPI's JSON and send it to the browser
    const data = await res.json();
    return Response.json(data);

  } catch {
    // The fetch itself failed — FastAPI is probably not running
    return Response.json(
      {
        status: "error",
        detail: "Cannot reach FastAPI backend. Is it running on port 8000?",
      },
      { status: 503 } // 503 = "Service Unavailable"
    );
  }
}
