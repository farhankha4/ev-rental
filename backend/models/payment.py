# ─── Feature 7: Payment Pydantic Schemas ──────────────────────────────────────
#
# What this file is:
#   Data contracts for Razorpay online payment order generation and HMAC-SHA256
#   signature verification payloads.
#
# Which feature & part:
#   Feature 7 (Razorpay Payments Integration) — Models Layer
#
# Schemas:
#   • PaymentOrderCreate  -> Incoming payload requesting a Razorpay order ID.
#   • PaymentOrderResponse-> Response returned to frontend containing order_id and key_id.
#   • PaymentVerify       -> Payload sent after user completes Razorpay popup checkout.
#   • PaymentVerifyResponse-> Response returned after HMAC signature is verified & booking updated.
#
# ────────────────────────────────────────────────────────────────────────────

from pydantic import BaseModel
from models.booking import BookingResponse


class PaymentOrderCreate(BaseModel):
    """
    [Feature 7 - Part 2]
    Payload sent by frontend to initiate payment for an existing reservation.
    """
    booking_id: str


class PaymentOrderResponse(BaseModel):
    """
    [Feature 7 - Part 2]
    Razorpay order details returned to frontend to populate the Razorpay Checkout popup modal.
    Note: `amount` is in Indian currency smallest unit (paise, e.g. ₹1500 = 150000 paise).
    """
    order_id: str
    amount: int
    currency: str = "INR"
    key_id: str
    booking_id: str


class PaymentVerify(BaseModel):
    """
    [Feature 7 - Part 2]
    Verification payload returned from Razorpay Checkout modal after user pays.
    Contains the order_id, payment_id, and razorpay_signature for HMAC-SHA256 verification.
    """
    booking_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class PaymentVerifyResponse(BaseModel):
    """
    [Feature 7 - Part 2]
    Response returned after payment verification and DB update.
    """
    status: str = "success"
    message: str
    booking: BookingResponse
