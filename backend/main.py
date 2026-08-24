# ─── Feature 0, 1 & 2: FastAPI Backend Server ───────────────────────────────
#
# This is the central entrypoint for the FastAPI REST API.
# It registers middleware, manages Supabase client lifecycle,
# and exposes HTTP routes for health checks and vehicle data.
#
# Endpoints:
#   GET /health         -> Feature 0: Health check & DB connection probe
#   GET /vehicles       -> Feature 1: List all available scooters
#   GET /vehicles/{id}  -> Feature 2: Get full details of a specific scooter
#
# ────────────────────────────────────────────────────────────────────────────

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# ─── App Initialization ──────────────────────────────────────────────────────

app = FastAPI(
    title="EV Rental API",
    description="Backend API for SwiftVolt electric vehicle rental platform",
    version="0.2.0"
)

# Allow Cross-Origin Resource Sharing (CORS) from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Supabase Client Lifecycle ───────────────────────────────────────────────

supabase_client = None
db_init_error   = None


def init_supabase():
    """
    Reads credentials from .env and initializes the Supabase client once at startup.
    Any configuration errors are captured without terminating the server.
    """
    global supabase_client, db_init_error

    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_KEY", "")

    if not url or url == "https://your-project.supabase.co":
        db_init_error = "SUPABASE_URL not configured — check backend/.env"
        return
    if not key or key == "your-anon-key-here":
        db_init_error = "SUPABASE_KEY not configured — check backend/.env"
        return

    try:
        from supabase import create_client
        supabase_client = create_client(url, key)
        db_init_error = None
    except Exception as exc:
        db_init_error = str(exc)


# Run client initialization immediately
init_supabase()


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    """
    [Feature 0]
    Verifies that FastAPI is running and Supabase is reachable.
    """
    db_status = "not_configured"
    db_detail = db_init_error

    if supabase_client is not None:
        try:
            # Query a non-existent table to verify network connection and API key validity
            supabase_client.table("_health_check_does_not_exist").select("*").limit(0).execute()
            db_status = "connected"
            db_detail = None
        except Exception as exc:
            err = str(exc)
            connected_signals = [
                "PGRST205", "42P01", "does not exist",
                "Could not find the table", "relation",
            ]
            if any(signal in err for signal in connected_signals):
                db_status = "connected"
                db_detail = None
            else:
                db_status = "error"
                db_detail = err

    return {
        "status": "ok",
        "service": "ev-rental-api",
        "db": db_status,
        **({"db_detail": db_detail} if db_detail else {}),
    }


@app.get("/vehicles")
async def list_vehicles():
    """
    [Feature 1]
    Returns a list of all available scooters.
    """
    if supabase_client is None:
        raise HTTPException(
            status_code=503,
            detail=db_init_error or "Database client is not initialized."
        )

    from services.vehicle_service import get_all_vehicles
    return get_all_vehicles(supabase_client)


@app.get("/vehicles/{vehicle_id}")
async def get_vehicle(vehicle_id: str):
    """
    [Feature 2 - Part 1]
    Returns the detailed specification for a specific scooter identified by UUID.
    If the scooter is not found or invalid, returns HTTP 404.
    """
    if supabase_client is None:
        raise HTTPException(
            status_code=503,
            detail=db_init_error or "Database client is not initialized."
        )

    from services.vehicle_service import get_vehicle_by_id
    vehicle = get_vehicle_by_id(supabase_client, vehicle_id)

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail=f"Vehicle with ID '{vehicle_id}' was not found."
        )

    return vehicle
