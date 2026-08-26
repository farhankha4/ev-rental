// ─── Feature 8: Next.js Proxy Route Handler — /api/admin/vehicles/[id] ───────
//
// Server proxy route for updating or deleting an existing scooter:
//   • PUT    /api/admin/vehicles/[id] -> PUT    http://localhost:8000/admin/vehicles/[id]
//   • DELETE /api/admin/vehicles/[id] -> DELETE http://localhost:8000/admin/vehicles/[id]
//
// ────────────────────────────────────────────────────────────────────────────

export async function PUT(request, { params }) {
  const { id } = await params;
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Response.json({ error: "Admin authorization required." }, { status: 401 });
  }

  try {
    const body = await request.json();

    const res = await fetch(`${apiUrl}/admin/vehicles/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return Response.json({ error: data.detail || "Failed to update scooter specs." }, { status: res.status });
    }

    return Response.json(data);
  } catch {
    return Response.json({ error: "Cannot reach admin service on port 8000." }, { status: 503 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Response.json({ error: "Admin authorization required." }, { status: 401 });
  }

  try {
    const res = await fetch(`${apiUrl}/admin/vehicles/${id}`, {
      method: "DELETE",
      headers: { "Authorization": authHeader },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return Response.json({ error: data.detail || "Failed to delete scooter." }, { status: res.status });
    }

    return Response.json(data);
  } catch {
    return Response.json({ error: "Cannot reach admin service on port 8000." }, { status: 503 });
  }
}
