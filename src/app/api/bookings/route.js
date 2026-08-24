// ─── Feature 4: Next.js API Proxy — /api/bookings ───────────────────────────
//
// Proxies reservation requests from the frontend to the FastAPI backend:
// POST /api/bookings -> POST http://localhost:8000/bookings
//
// Forwards the logged-in user's Bearer token in the Authorization header.
//
// ────────────────────────────────────────────────────────────────────────────

export async function POST(request) {
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Response.json(
      { error: "Authentication required to create a booking." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const res = await fetch(`${apiUrl}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return Response.json(
        { error: data.detail || "Booking creation failed." },
        { status: res.status }
      );
    }

    return Response.json(data);

  } catch {
    return Response.json(
      { error: "Cannot reach booking service on port 8000." },
      { status: 503 }
    );
  }
}
