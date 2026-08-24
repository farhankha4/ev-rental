# ─── Feature 4 & 5: Booking Service Layer ─────────────────────────────────────
#
# Contains business logic and database interactions for rentals:
#   - Validates that the requested scooter exists and is available
#   - Ensures pickup date is before return date
#   - [Feature 5] Checks for scheduling conflicts against existing active bookings
#   - Calculates total rental duration in days (minimum 1 day)
#   - Computes total cost: duration_days * vehicle.price_per_day
#   - Creates and inserts the reservation record into Supabase
#
# ────────────────────────────────────────────────────────────────────────────

import math
from datetime import datetime
from typing import Optional
from fastapi import HTTPException
from models.booking import BookingCreate, BookingResponse
from services.vehicle_service import get_vehicle_by_id


def is_vehicle_available(
    supabase_client,
    vehicle_id: str,
    pickup_time: datetime,
    return_time: datetime,
    exclude_booking_id: Optional[str] = None
) -> bool:
    """
    [Feature 5 - Part 1: Date-Overlap Conflict Checker]
    Checks if a vehicle has any active bookings overlapping with the requested interval.

    Two date intervals [P1, R1) and [P2, R2) overlap if and only if:
        P1 < R2  AND  R1 > P2

    Args:
        supabase_client: Active Supabase client.
        vehicle_id: UUID of the scooter.
        pickup_time: Proposed rental start datetime.
        return_time: Proposed rental return datetime.
        exclude_booking_id: Optional booking ID to ignore (useful when updating a booking).

    Returns:
        bool: True if scooter is available (no overlap), False if conflict exists.
    """
    try:
        # Fetch all active bookings for this scooter
        query = (
            supabase_client
            .table("bookings")
            .select("id, pickup_time, return_time, booking_status")
            .eq("vehicle_id", vehicle_id)
            .in_("booking_status", ["reserved", "confirmed"])
        )

        if exclude_booking_id:
            query = query.neq("id", exclude_booking_id)

        res = query.execute()

        if not res.data:
            return True

        req_pickup_iso = pickup_time.isoformat()
        req_return_iso = return_time.isoformat()

        # Check each active booking for date collision
        for booking in res.data:
            exist_pickup_iso = booking["pickup_time"]
            exist_return_iso = booking["return_time"]

            # Parse ISO strings (handling potential Z / offset suffixes)
            exist_pickup = datetime.fromisoformat(exist_pickup_iso.replace("Z", "+00:00"))
            exist_return = datetime.fromisoformat(exist_return_iso.replace("Z", "+00:00"))
            req_pickup = datetime.fromisoformat(req_pickup_iso.replace("Z", "+00:00"))
            req_return = datetime.fromisoformat(req_return_iso.replace("Z", "+00:00"))

            # Overlap Condition:
            # New booking starts before existing ends, AND new booking ends after existing starts
            if req_pickup < exist_return and req_return > exist_pickup:
                return False  # Collision found!

        return True  # No conflicts

    except Exception as exc:
        print(f"[booking_service] Availability check error: {exc}")
        # In case of DB error, let the caller handle it
        return False


def create_booking(supabase_client, user_id: str, booking_data: BookingCreate) -> BookingResponse:
    """
    [Feature 4 & 5 - Part 2]
    Validates date ranges, verifies availability, calculates total pricing, and creates a reservation.

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
            detail=f"Scooter '{vehicle.name}' is currently disabled for maintenance."
        )

    # 2. Validate dates
    pickup = booking_data.pickup_time
    dropoff = booking_data.return_time

    if dropoff <= pickup:
        raise HTTPException(
            status_code=400,
            detail="Return date and time must be after pickup date and time."
        )

    # 3. [Feature 5] Check for scheduling conflicts (Double-Booking Prevention)
    available = is_vehicle_available(
        supabase_client=supabase_client,
        vehicle_id=vehicle.id,
        pickup_time=pickup,
        return_time=dropoff
    )

    if not available:
        raise HTTPException(
            status_code=400,
            detail=(
                f"SwiftVolt {vehicle.name} is already reserved for the selected dates. "
                "Please choose different dates or select another model."
            )
        )

    # 4. Calculate rental duration in days (minimum 1 day)
    duration_seconds = (dropoff - pickup).total_seconds()
    duration_days = max(1, math.ceil(duration_seconds / 86400.0))

    # 5. Calculate total amount
    total_price = round(duration_days * float(vehicle.price_per_day), 2)

    try:
        # 6. Insert reservation row into Supabase
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
