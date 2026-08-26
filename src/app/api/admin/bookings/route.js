// ─── Feature 8: Next.js Proxy Route Handler — /api/admin/bookings ────────────
//
// Server proxy route for Admin Overview of all platform bookings:
// GET /api/admin/bookings -> GET http://localhost:8000/admin/bookings
//
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request) {
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Response.json({ error: "Admin authorization required." }, { status: 401 });
  }

  try {
    const res = await fetch(`${apiUrl}/admin/bookings`, {
      headers: { "Authorization": authHeader },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ([]));
    if (!res.ok) {
      return Response.json({ error: data.detail || "Failed to fetch platform bookings." }, { status: res.status });
    }

    return Response.json(data);
  } catch {
    return Response.json({ error: "Cannot reach admin service on port 8000." }, { status: 503 });
  }
}
