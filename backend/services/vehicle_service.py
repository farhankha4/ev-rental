# ─── What this file is ──────────────────────────────────────────────────────
#
# This is the "service" layer for vehicles.
#
# A service is where all the database logic lives — keeping it separate from
# the route (which just handles HTTP) means:
#   - Routes stay thin and readable
#   - If we swap Supabase for a different DB later, we only change this file
#   - We can test the database logic independently of the HTTP layer
#
# ────────────────────────────────────────────────────────────────────────────

from models.vehicle import Vehicle   # import our Pydantic model


def get_all_vehicles(supabase_client) -> list[Vehicle]:
    """
    Fetches all rows from the `vehicles` table in Supabase.

    Args:
        supabase_client: the already-initialised Supabase client from main.py

    Returns:
        A list of Vehicle objects (one per scooter row in the DB).
        Returns an empty list if something goes wrong, so the route
        can still respond with [] rather than crashing.
    """

    try:
        # .table()   → which table to query
        # .select()  → which columns to return (* means all columns)
        # .eq()      → filter: only return rows where available = True
        # .execute() → actually run the query and get the result
        response = (
            supabase_client
            .table("vehicles")
            .select("*")
            .eq("available", True)   # only show scooters that can be rented
            .execute()
        )

        # response.data is a list of dicts, one dict per row.
        # We convert each dict into a Vehicle object so Pydantic
        # can validate and serialize it cleanly.
        return [Vehicle(**row) for row in response.data]

    except Exception as exc:
        # Log the error for the developer and return an empty list
        # so the API response is [] rather than a 500 crash
        print(f"[vehicle_service] Error fetching vehicles: {exc}")
        return []
