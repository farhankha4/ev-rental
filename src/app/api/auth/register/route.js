// ─── Feature 3: Next.js API Proxy — /api/auth/register ──────────────────────
//
// Proxies registration requests from the Next.js frontend to the FastAPI backend:
// POST /api/auth/register -> POST http://localhost:8000/auth/register
//
// ────────────────────────────────────────────────────────────────────────────

export async function POST(request) {
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";

  try {
    const body = await request.json();

    const res = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return Response.json(
        { error: data.detail || "Registration failed on server." },
        { status: res.status }
      );
    }

    return Response.json(data);

  } catch {
    return Response.json(
      { error: "Cannot reach authentication server on port 8000." },
      { status: 503 }
    );
  }
}
