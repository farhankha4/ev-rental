# ─── Feature 1, 2 & 8: Vehicle Service Layer ───────────────────────────────────
#
# What this file is:
#   Database query logic for the `vehicles` table in Supabase.
#
# Capabilities:
#   • `get_all_vehicles`: Returns list of active scooters.
#   • `get_vehicle_by_id`: Fetches specs for a single scooter by UUID.
#   • [Feature 8] `create_vehicle`: Admin inserts a new scooter.
#   • [Feature 8] `update_vehicle`: Admin updates specs or pricing.
#   • [Feature 8] `toggle_vehicle_availability`: Admin flips Active <-> Maintenance mode.
#   • [Feature 8] `delete_vehicle`: Admin removes scooter row from catalog.
#
# ────────────────────────────────────────────────────────────────────────────

from typing import Optional
from fastapi import HTTPException
from models.vehicle import Vehicle, VehicleCreate, VehicleUpdate


def get_all_vehicles(supabase_client, include_disabled: bool = False) -> list[Vehicle]:
    """
    [Feature 1 & Feature 8]
    Fetches all vehicles from the `vehicles` table in Supabase.

    Args:
        supabase_client: Initialized Supabase client instance.
        include_disabled: If True (admin mode), returns maintenance vehicles too.

    Returns:
        list[Vehicle]: List of validated Vehicle Pydantic models.
    """
    try:
        query = supabase_client.table("vehicles").select("*")

        if not include_disabled:
            query = query.eq("available", True)

        response = query.order("name").execute()
        return [Vehicle(**row) for row in response.data]

    except Exception as exc:
        print(f"[vehicle_service] Error fetching vehicles: {exc}")
        return []


def get_vehicle_by_id(supabase_client, vehicle_id: str) -> Optional[Vehicle]:
    """
    [Feature 2 - Part 1]
    Fetches a single vehicle by its UUID from the `vehicles` table.
    """
    try:
        response = (
            supabase_client
            .table("vehicles")
            .select("*")
            .eq("id", vehicle_id)
            .execute()
        )

        if response.data and len(response.data) > 0:
            return Vehicle(**response.data[0])

        return None

    except Exception as exc:
        print(f"[vehicle_service] Error fetching vehicle '{vehicle_id}': {exc}")
        return None


def create_vehicle(supabase_client, vehicle_data: VehicleCreate) -> Vehicle:
    """
    [Feature 8 - Part 2: Admin Fleet Management]
    Inserts a new electric scooter model into the `vehicles` database table.
    """
    try:
        insert_payload = vehicle_data.model_dump(exclude_unset=True)

        res = (
            supabase_client
            .table("vehicles")
            .insert(insert_payload)
            .execute()
        )

        if not res.data or len(res.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to insert vehicle into database.")

        return Vehicle(**res.data[0])

    except HTTPException:
        raise
    except Exception as exc:
        print(f"[vehicle_service] Create vehicle error: {exc}")
        raise HTTPException(status_code=500, detail=f"Could not create vehicle: {str(exc)}")


def update_vehicle(supabase_client, vehicle_id: str, vehicle_data: VehicleUpdate) -> Vehicle:
    """
    [Feature 8 - Part 2: Admin Fleet Management]
    Updates specs, pricing, or details for an existing vehicle.
    """
    vehicle = get_vehicle_by_id(supabase_client, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail=f"Vehicle with ID '{vehicle_id}' not found.")

    update_payload = vehicle_data.model_dump(exclude_none=True)
    if not update_payload:
        return vehicle

    try:
        res = (
            supabase_client
            .table("vehicles")
            .update(update_payload)
            .eq("id", vehicle_id)
            .execute()
        )

        if not res.data or len(res.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to update vehicle record.")

        return Vehicle(**res.data[0])

    except HTTPException:
        raise
    except Exception as exc:
        print(f"[vehicle_service] Update vehicle error: {exc}")
        raise HTTPException(status_code=500, detail=f"Could not update vehicle: {str(exc)}")


def toggle_vehicle_availability(supabase_client, vehicle_id: str) -> Vehicle:
    """
    [Feature 8 - Part 2: Admin Fleet Management]
    Toggles a vehicle's availability status between Active (True) and Maintenance (False).
    """
    vehicle = get_vehicle_by_id(supabase_client, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail=f"Vehicle with ID '{vehicle_id}' not found.")

    new_status = not vehicle.available
    return update_vehicle(supabase_client, vehicle_id, VehicleUpdate(available=new_status))


def delete_vehicle(supabase_client, vehicle_id: str) -> bool:
    """
    [Feature 8 - Part 2: Admin Fleet Management]
    Removes a scooter from the `vehicles` table.
    """
    vehicle = get_vehicle_by_id(supabase_client, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail=f"Vehicle with ID '{vehicle_id}' not found.")

    try:
        supabase_client.table("vehicles").delete().eq("id", vehicle_id).execute()
        return True
    except Exception as exc:
        print(f"[vehicle_service] Delete vehicle error: {exc}")
        raise HTTPException(status_code=500, detail=f"Could not delete vehicle: {str(exc)}")
