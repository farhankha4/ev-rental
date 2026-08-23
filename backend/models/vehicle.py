# ─── What this file is ──────────────────────────────────────────────────────
#
# This is the Pydantic "model" for a single vehicle.
#
# Pydantic models serve two purposes:
#   1. VALIDATION — when FastAPI receives data (e.g. from Supabase), it checks
#      that every required field is present and has the correct type.
#   2. SERIALIZATION — when FastAPI sends a response to the frontend, it
#      automatically converts this model to clean JSON.
#
# Think of it as a blueprint that describes exactly what one scooter looks like.
#
# ────────────────────────────────────────────────────────────────────────────

from pydantic import BaseModel   # BaseModel is Pydantic's base class for all models
from typing import Optional      # Optional means the field can be None (nullable)
from datetime import datetime    # for the created_at timestamp field


class Vehicle(BaseModel):
    """
    Represents one row from the `vehicles` table in Supabase.
    Each field name here must match the column name in the database exactly.
    """

    id:            str             # UUID stored as a string (e.g. "abc123-...")
    name:          str             # e.g. "EWON Pro"
    battery_kwh:   float           # battery capacity in kilowatt-hours
    range_km:      int             # maximum range on a full charge, in km
    top_speed_kmh: int             # top speed in km/h
    price_per_day: float           # rental price in rupees per day
    image_url:     Optional[str]   # URL to the scooter image — can be null
    available:     bool            # True = available to rent, False = not available
    created_at:    Optional[datetime]  # when the row was inserted — can be null
