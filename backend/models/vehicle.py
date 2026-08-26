# ─── Feature 1, 2 & 8: Vehicle Pydantic Models ─────────────────────────────────
#
# What this file is:
#   Pydantic data models for electric scooters in the catalog.
#   Provides schema validation for reading, creating, and updating scooters.
#
# Schemas:
#   • Vehicle       -> Complete scooter profile matching Supabase columns.
#   • VehicleCreate -> Incoming payload when an admin creates a new scooter.
#   • VehicleUpdate -> Incoming payload when an admin updates an existing scooter.
#
# ────────────────────────────────────────────────────────────────────────────

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Vehicle(BaseModel):
    """
    [Feature 1 & 2]
    Represents one row from the `vehicles` table in Supabase.
    """
    id:            str
    name:          str
    battery_kwh:   float
    range_km:      int
    top_speed_kmh: int
    price_per_day: float
    image_url:     Optional[str] = None
    available:     bool = True
    created_at:    Optional[datetime] = None


class VehicleCreate(BaseModel):
    """
    [Feature 8 - Part 2]
    Payload schema when an admin adds a new scooter model to the fleet.
    """
    name:          str
    battery_kwh:   float
    range_km:      int
    top_speed_kmh: int
    price_per_day: float
    image_url:     Optional[str] = None
    available:     bool = True


class VehicleUpdate(BaseModel):
    """
    [Feature 8 - Part 2]
    Payload schema when an admin updates specifications or status of a scooter.
    """
    name:          Optional[str] = None
    battery_kwh:   Optional[float] = None
    range_km:      Optional[int] = None
    top_speed_kmh: Optional[int] = None
    price_per_day: Optional[float] = None
    image_url:     Optional[str] = None
    available:     Optional[bool] = None
