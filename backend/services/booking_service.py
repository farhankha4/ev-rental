# ─── Feature 4: Booking Service Layer ─────────────────────────────────────────
#
# Contains business logic and database interactions for rentals:
#   - Validates that the requested scooter exists and is available
#   - Ensures pickup date is before return date
#   - Calculates total rental duration in days (minimum 1 day)
#   - Computes total cost: duration_days * vehicle.price_per_day
#   - Creates and inserts the reservation record into Supabase
#
# ────────────────────────────────────────────────────────────────────────────

import math
from datetime import datetime, timezone
from typing import Optional
from fastapi import HTTPException
from models.booking import BookingCreate, BookingResponse
from services.vehicle_service import get_vehicle_by_id


def create_booking(supabase_client, user_id: str, booking_data: BookingCreate) -> BookingResponse:
    """
    [Feature 4 - Part 2]
    Validates date ranges, calculates total pricing, and creates a reservation row.

    Args:
        supabase_client: Active Supabase client instance.
        user_id: The UUID of the authenticated user creating the booking.
        booking_data: Vehicle ID, pickup datetime, and return datetime.

    Returns:
        BookingResponse: Validated booking profile with computed amount and vehicle specs.
    """
    # 1. Fetch and verify vehicle existence
    vehicle = get_vehicle_by_id(supabase_client, booking_data.vehicle_id)
    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail=f"Scooter with ID '{booking_data.vehicle_id}' not found."
        )

    if not vehicle.available:
        raise HTTPException(
            status_code=400,
            detail=f"Scooter '{vehicle.name}' is currently unavailable for rent."
        )

    # 2. Validate dates
    pickup = booking_data.pickup_time
    dropoff = booking_data.return_time

    if dropoff <= pickup:
        raise HTTPException(
            status_code=400,
            detail="Return date and time must be after pickup date and time."
        )

    # 3. Calculate rental duration in days (ceil up to full days, minimum 1)
    duration_seconds = (dropoff - pickup).total_seconds()
    duration_days = max(1, math.ceil(duration_seconds / 86400.0))

    # 4. Calculate total amount
    total_price = round(duration_days * float(vehicle.price_per_day), 2)

    try:
        # 5. Insert reservation row into Supabase
        insert_payload = {
            "user_id": user_id,
            "vehicle_id": vehicle.id,
            "pickup_time": pickup.isoformat(),
            "return_time": dropoff.isoformat(),
            "total_amount": total_price,
            "booking_status": "reserved",
            "payment_status": "pending"
        }

        res = (
            supabase_client
            .table("bookings")
            .insert(insert_payload)
            .execute()
        )

        if not res.data or len(res.data) == 0:
            raise HTTPException(
                status_code=500,
                detail="Failed to record booking in the database."
            )

        row = res.data[0]

        return BookingResponse(
            id=str(row["id"]),
            user_id=str(row["user_id"]),
            vehicle_id=str(row["vehicle_id"]),
            pickup_time=row["pickup_time"],
            return_time=row["return_time"],
            total_amount=float(row["total_amount"]),
            booking_status=row.get("booking_status", "reserved"),
            payment_status=row.get("payment_status", "pending"),
            created_at=row.get("created_at"),
            vehicle=vehicle
        )

    except HTTPException:
        raise
    except Exception as exc:
        print(f"[booking_service] Create booking error: {exc}")
        raise HTTPException(
            status_code=500,
            detail=f"Could not create booking: {str(exc)}"
        )


def get_booking_by_id(supabase_client, booking_id: str, user_id: str) -> Optional[BookingResponse]:
    """
    [Feature 4 - Part 2]
    Fetches a specific booking record belonging to the authenticated user.
    """
    try:
        res = (
            supabase_client
            .table("bookings")
            .select("*")
            .eq("id", booking_id)
            .eq("user_id", user_id)
            .execute()
        )

        if res.data and len(res.data) > 0:
            row = res.data[0]
            vehicle = get_vehicle_by_id(supabase_client, row["vehicle_id"])
            return BookingResponse(
                id=str(row["id"]),
                user_id=str(row["user_id"]),
                vehicle_id=str(row["vehicle_id"]),
                pickup_time=row["pickup_time"],
                return_time=row["return_time"],
                total_amount=float(row["total_amount"]),
                booking_status=row.get("booking_status", "reserved"),
                payment_status=row.get("payment_status", "pending"),
                created_at=row.get("created_at"),
                vehicle=vehicle
            )

        return None
    except Exception as exc:
        print(f"[booking_service] Get booking error: {exc}")
        return None
