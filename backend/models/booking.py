# ─── Feature 4: Booking Pydantic Schemas ──────────────────────────────────────
#
# This file defines the data contracts for creating reservations and returning
# booking confirmations.
#
# Schemas:
#   - BookingCreate: Payload sent by the frontend when a user reserves a scooter.
#   - BookingResponse: Complete booking profile including calculated total price,
#     dates, status, and associated vehicle details.
#
# ────────────────────────────────────────────────────────────────────────────

from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.vehicle import Vehicle


class BookingCreate(BaseModel):
    """
    [Feature 4 - Part 2]
    Incoming request payload for creating a new booking (POST /bookings).
    """
    vehicle_id: str
    pickup_time: datetime
    return_time: datetime


class BookingResponse(BaseModel):
    """
    [Feature 4 - Part 2]
    Complete booking details returned after reservation creation or lookup.
    """
    id: str
    user_id: str
    vehicle_id: str
    pickup_time: datetime
    return_time: datetime
    total_amount: float
    booking_status: str = "reserved" # 'reserved', 'confirmed', 'cancelled', 'completed'
    payment_status: str = "pending"  # 'pending', 'paid', 'refunded'
    created_at: Optional[datetime] = None
    vehicle: Optional[Vehicle] = None
