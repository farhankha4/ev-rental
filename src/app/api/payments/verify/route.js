// ─── Feature 7: Next.js Proxy Route Handler — /api/payments/verify ─────────
//
// What this file is:
//   Server-side API proxy for verifying Razorpay HMAC SHA256 payment signatures.
//   Proxies POST requests from browser to FastAPI `http://localhost:8000/payments/verify`.
//
// Which feature & part:
//   Feature 7 (Razorpay Payments Integration) — Frontend API Proxy Route
//
// Forwards:
//   • `Authorization: Bearer <token>`
//   • `{ booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature }`
//
// ────────────────────────────────────────────────────────────────────────────

export async function POST(request) {
  const apiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000";
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Response.json(
      { error: "Authentication required to verify payment." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const res = await fetch(`${apiUrl}/payments/verify`, {
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
        { error: data.detail || "Payment verification failed." },
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
