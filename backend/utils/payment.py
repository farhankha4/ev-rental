# ─── Feature 7: Payment Cryptography Utilities ────────────────────────────────
#
# What this file is:
#   Cryptographic verification helpers for Razorpay payments.
#   Uses standard Python `hmac` and `hashlib` libraries to verify payment signatures.
#
# Which feature & part:
#   Feature 7 (Razorpay Payments Integration) — Security Utilities
#
# How Razorpay Signature Verification Works:
#   1. When a user pays on Razorpay Checkout, Razorpay returns:
#      - razorpay_order_id
#      - razorpay_payment_id
#      - razorpay_signature
#   2. The server constructs string: `order_id + "|" + payment_id`
#   3. The server calculates HMAC-SHA256 hash of that string using RAZORPAY_KEY_SECRET.
#   4. If calculated_hash == razorpay_signature, the payment is genuine!
#
# ────────────────────────────────────────────────────────────────────────────

import hmac
import hashlib


def verify_razorpay_signature(
    order_id: str,
    payment_id: str,
    signature: str,
    secret: str
) -> bool:
    """
    [Feature 7 - Part 2]
    Verifies that the payment payload received from Razorpay Checkout is authentic.

    Args:
        order_id: Razorpay order ID (e.g. order_9A33XCD89)
        payment_id: Razorpay payment transaction ID (e.g. pay_293849182)
        signature: Received razorpay_signature hash
        secret: Your RAZORPAY_KEY_SECRET from backend/.env

    Returns:
        bool: True if signature matches, False if forged/invalid.
    """
    if not order_id or not payment_id or not signature or not secret:
        return False

    try:
        # Construct expected data string: order_id|payment_id
        message = f"{order_id}|{payment_id}".encode("utf-8")
        secret_bytes = secret.encode("utf-8")

        # Compute HMAC SHA256 digest
        generated_signature = hmac.new(
            secret_bytes,
            message,
            hashlib.sha256
        ).hexdigest()

        # Secure constant-time comparison to prevent timing attacks
        return hmac.compare_digest(generated_signature, signature)

    except Exception as exc:
        print(f"[payment_utils] Signature verification error: {exc}")
        return False
