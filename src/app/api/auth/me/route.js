// ─── Feature 3: Next.js API Proxy — /api/auth/me ────────────────────────────
//
// Forwards the Bearer Authorization header to FastAPI GET /auth/me
// to verify the current session and retrieve the active user profile.
//
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request) {
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Response.json(
      { error: "Authorization header is missing." },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${apiUrl}/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return Response.json(
        { error: data.detail || "Session is invalid or expired." },
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
