// ─── Feature 9: Next.js Proxy Route Handler — /api/vehicles/[id]/reviews ──────
//
// What this file is:
//   Server-side API proxy for customer reviews and star rating summaries.
//   Proxies requests from browser to FastAPI:
//     • GET  /api/vehicles/[id]/reviews -> GET  http://localhost:8000/vehicles/[id]/reviews
//     • POST /api/vehicles/[id]/reviews -> POST http://localhost:8000/vehicles/[id]/reviews
//
// Which feature & part:
//   Feature 9 (Reviews & Ratings) — Frontend API Proxy Route
//
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request, { params }) {
  const { id } = await params;
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";

  try {
    const res = await fetch(`${apiUrl}/vehicles/${id}/reviews`, {
      cache: "no-store", // Always fetch fresh review ratings
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return Response.json(
        { error: data.detail || "Failed to fetch scooter reviews." },
        { status: res.status }
      );
    }

    return Response.json(data);

  } catch {
    return Response.json(
      { error: "Cannot reach review service on port 8000." },
      { status: 503 }
    );
  }
}

export async function POST(request, { params }) {
  const { id } = await params;
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Response.json(
      { error: "Authentication required to submit a review." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const res = await fetch(`${apiUrl}/vehicles/${id}/reviews`, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return Response.json(
        { error: data.detail || "Failed to submit review." },
        { status: res.status }
      );
    }

    return Response.json(data);

  } catch {
    return Response.json(
      { error: "Cannot reach review service on port 8000." },
      { status: 503 }
    );
  }
}
