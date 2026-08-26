// ─── Feature 8: Next.js Proxy Route Handler — /api/admin/vehicles ───────────
//
// Server proxy route for Admin Fleet Management:
//   • GET  /api/admin/vehicles -> GET  http://localhost:8000/admin/vehicles (All scooters incl. disabled)
//   • POST /api/admin/vehicles -> POST http://localhost:8000/admin/vehicles (Add new scooter)
//
// Forwards `Authorization: Bearer <token>` header to FastAPI.
//
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request) {
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Response.json({ error: "Admin authorization required." }, { status: 401 });
  }

  try {
    const res = await fetch(`${apiUrl}/admin/vehicles`, {
      headers: { "Authorization": authHeader },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ([]));
    if (!res.ok) {
      return Response.json({ error: data.detail || "Failed to fetch admin vehicle fleet." }, { status: res.status });
    }

    return Response.json(data);
  } catch {
    return Response.json({ error: "Cannot reach admin service on port 8000." }, { status: 503 });
  }
}

export async function POST(request) {
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Response.json({ error: "Admin authorization required." }, { status: 401 });
  }

  try {
    const body = await request.json();

    const res = await fetch(`${apiUrl}/admin/vehicles`, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return Response.json({ error: data.detail || "Failed to create new scooter." }, { status: res.status });
    }

    return Response.json(data);
  } catch {
    return Response.json({ error: "Cannot reach admin service on port 8000." }, { status: 503 });
  }
}
