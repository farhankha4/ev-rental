// ─── Feature 6: Next.js Route Handler — /api/bookings/my-bookings ───────────
//
// What this file is:
//   This is a Next.js App Router API proxy route handler.
//   It acts as a server-side gateway forwarding user dashboard queries from the browser
//   to the FastAPI backend (`http://localhost:8000/bookings/my-bookings`).
//
// Which feature & part:
//   Feature 6 (My Bookings Dashboard) — Next.js API Proxy Route
//
// Why use a proxy route?
//   1. Prevents CORS browser errors when fetching backend APIs.
//   2. Safely forwards the client's `Authorization: Bearer <token>` header to FastAPI.
//   3. Keeps the backend server URL configurable via `FASTAPI_URL` environment variable.
//
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request) {
  // Read backend base URL from environment or default to local port 8000
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";

  // Extract Bearer Authorization token from incoming browser request
  const authHeader = request.headers.get("authorization");

  // Reject unauthenticated requests if header is missing
  if (!authHeader) {
    return Response.json(
      { error: "Authentication required to view your bookings." },
      { status: 401 }
    );
  }

  try {
    // Forward GET request to FastAPI protected endpoint
    const res = await fetch(`${apiUrl}/bookings/my-bookings`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always request fresh data from database
    });

    const data = await res.json().catch(() => ([]));

    // Handle error statuses from FastAPI (e.g. 401, 503)
    if (!res.ok) {
      return Response.json(
        { error: data.detail || "Failed to fetch user bookings." },
        { status: res.status }
      );
    }

    // Return JSON array of BookingResponse objects to browser
    return Response.json(data);

  } catch {
    // Return 503 Service Unavailable if FastAPI server is unreachable
    return Response.json(
      { error: "Cannot reach booking service on port 8000." },
      { status: 503 }
    );
  }
}
