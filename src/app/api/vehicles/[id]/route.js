// ─── Feature 2: Route Handler — /api/vehicles/[id] ──────────────────────────
//
// This is a Next.js App Router dynamic route handler.
// It acts as a server-side proxy between the frontend client and the FastAPI backend.
//
// When a user visits /vehicles/[id], the frontend fetches /api/vehicles/[id],
// which forwards the request to FastAPI: http://localhost:8000/vehicles/{id}.
//
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request, { params }) {
  // In Next.js 15+, params is a Promise that must be awaited
  const { id } = await params;
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";

  try {
    const res = await fetch(`${apiUrl}/vehicles/${id}`, {
      cache: "no-store", // Always fetch fresh vehicle details
    });

    // If FastAPI returns 404 Not Found or another error status
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return Response.json(
        { error: errorData.detail || `FastAPI error with status ${res.status}` },
        { status: res.status }
      );
    }

    const vehicle = await res.json();
    return Response.json(vehicle);

  } catch {
    return Response.json(
      { error: "Cannot reach FastAPI backend server on port 8000." },
      { status: 503 }
    );
  }
}
