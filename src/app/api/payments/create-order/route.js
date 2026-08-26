// ─── Feature 7: Next.js Proxy Route Handler — /api/payments/create-order ────
//
// What this file is:
//   Server-side API proxy for generating a Razorpay order ID.
//   Proxies POST requests from browser to FastAPI `http://localhost:8000/payments/create-order`.
//
// Which feature & part:
//   Feature 7 (Razorpay Payments Integration) — Frontend API Proxy Route
//
// Forwards:
//   • `Authorization: Bearer <token>`
//   • `{ booking_id }` body
//
// ────────────────────────────────────────────────────────────────────────────

export async function POST(request) {
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Response.json(
      { error: "Authentication required to initiate payment." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const res = await fetch(`${apiUrl}/payments/create-order`, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return Response.json(
        { error: data.detail || "Failed to create payment order." },
        { status: res.status }
      );
    }

    return Response.json(data);

  } catch {
    return Response.json(
      { error: "Cannot reach payment service on port 8000." },
      { status: 503 }
    );
  }
}
