// ─── Feature 5: Next.js Route Handler — /api/vehicles/[id]/availability ─────
//
// Proxies availability check queries to the FastAPI backend:
// GET /api/vehicles/[id]/availability?pickup_time=...&return_time=...
//
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request, { params }) {
  const { id } = await params;
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";

  const { searchParams } = new URL(request.url);
  const pickupTime = searchParams.get("pickup_time");
  const returnTime = searchParams.get("return_time");

  if (!pickupTime || !returnTime) {
    return Response.json(
      { error: "Both pickup_time and return_time parameters are required." },
      { status: 400 }
    );
  }

  try {
    const url = `${apiUrl}/vehicles/${id}/availability?pickup_time=${encodeURIComponent(pickupTime)}&return_time=${encodeURIComponent(returnTime)}`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return Response.json(
        { error: data.detail || `Availability check failed (${res.status})` },
        { status: res.status }
      );
    }

    return Response.json(data);

  } catch {
    return Response.json(
      { error: "Cannot reach backend availability service on port 8000." },
      { status: 503 }
    );
  }
}
