// ─── Feature 8: Next.js Proxy Route Handler — Toggle Availability ───────────
//
// Proxy route for toggling a scooter between Active and Maintenance mode:
// PATCH /api/admin/vehicles/[id]/toggle-availability -> PATCH http://localhost:8000/admin/vehicles/[id]/toggle-availability
//
// ────────────────────────────────────────────────────────────────────────────

export async function PATCH(request, { params }) {
  const { id } = await params;
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Response.json({ error: "Admin authorization required." }, { status: 401 });
  }

  try {
    const res = await fetch(`${apiUrl}/admin/vehicles/${id}/toggle-availability`, {
      method: "PATCH",
      headers: { "Authorization": authHeader },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return Response.json({ error: data.detail || "Failed to toggle scooter availability." }, { status: res.status });
    }

    return Response.json(data);
  } catch {
    return Response.json({ error: "Cannot reach admin service on port 8000." }, { status: 503 });
  }
}
