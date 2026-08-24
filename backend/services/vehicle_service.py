# ─── Feature 1 & 2: Vehicle Service Layer ─────────────────────────────────────
#
# This file contains all database query logic for vehicles in Supabase.
# Keeping queries isolated here ensures:
#   1. Route handlers in main.py remain clean and focused only on HTTP logic.
#   2. Changes to database schema or client only require updating this file.
#   3. Service functions can be unit-tested independently.
#
# ────────────────────────────────────────────────────────────────────────────

from typing import Optional
from models.vehicle import Vehicle   # Pydantic model for vehicle validation


def get_all_vehicles(supabase_client) -> list[Vehicle]:
    """
    [Feature 1 - Part 2]
    Fetches all available vehicles from the `vehicles` table in Supabase.

    Args:
        supabase_client: Initialized Supabase client instance from main.py.

    Returns:
        list[Vehicle]: List of validated Vehicle Pydantic models.
    """
    try:
        # Query all rows where available == True
        response = (
            supabase_client
            .table("vehicles")
            .select("*")
            .eq("available", True)
            .execute()
        )

        # Convert raw database dictionaries into Pydantic models
        return [Vehicle(**row) for row in response.data]

    except Exception as exc:
        print(f"[vehicle_service] Error fetching all vehicles: {exc}")
        return []


def get_vehicle_by_id(supabase_client, vehicle_id: str) -> Optional[Vehicle]:
    """
    [Feature 2 - Part 1]
    Fetches a single vehicle by its UUID from the `vehicles` table in Supabase.

    Args:
        supabase_client: Initialized Supabase client instance.
        vehicle_id: The string representation of the vehicle UUID.

    Returns:
        Optional[Vehicle]: Vehicle object if found, or None if not found/error.
    """
    try:
        # Query exactly matching the vehicle ID
        response = (
            supabase_client
            .table("vehicles")
            .select("*")
            .eq("id", vehicle_id)
            .execute()
        )

        # If matching rows exist, validate and return the first row
        if response.data and len(response.data) > 0:
            return Vehicle(**response.data[0])

        return None

    except Exception as exc:
        print(f"[vehicle_service] Error fetching vehicle by id '{vehicle_id}': {exc}")
        return None
