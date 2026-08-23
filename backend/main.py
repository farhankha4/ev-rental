import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env from this same directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# ─── App ─────────────────────────────────────────────────────────────────────

app = FastAPI(title="EV Rental API", version="0.1.0")

# Allow requests from the Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Supabase Client Setup ────────────────────────────────────────────────────

# We create the Supabase client ONCE when the server starts (not on every
# request) because creating it is slow — this way it's ready instantly.
supabase_client = None
db_init_error   = None


def init_supabase():
    """
    Reads credentials from .env and creates the Supabase client.
    If the credentials are missing or wrong, we store the error message
    so the /health endpoint can report it instead of crashing the server.
    """
    global supabase_client, db_init_error

    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_KEY", "")

    # Check that the user has actually filled in the .env file
    if not url or url == "https://your-project.supabase.co":
        db_init_error = "SUPABASE_URL not set — fill in backend/.env"
        return
    if not key or key == "your-anon-key-here":
        db_init_error = "SUPABASE_KEY not set — fill in backend/.env"
        return

    # Try to create the client — this connects to Supabase
    try:
        from supabase import create_client
        supabase_client = create_client(url, key)
        db_init_error = None
    except Exception as exc:
        db_init_error = str(exc)


# Run setup immediately when the server starts
init_supabase()

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    """
    Health check — verifies that FastAPI is running and Supabase is reachable.
    Called by the Next.js home page to show the stack status card.
    """
    db_status = "not_configured"
    db_detail = db_init_error

    if supabase_client is not None:
        try:
            # Query a non-existent table on purpose.
            # Wrong credentials → auth error (real problem).
            # Correct credentials → "table not found" (expected — connection works).
            supabase_client.table("_health_check_does_not_exist") \
                           .select("*").limit(0).execute()
            db_status = "connected"
            db_detail = None
        except Exception as exc:
            err = str(exc)
            # These signals all mean "table not found" = we're connected fine
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
        "status":  "ok",
        "service": "ev-rental-api",
        "db":      db_status,
        **( {"db_detail": db_detail} if db_detail else {} ),
    }


@app.get("/vehicles")
async def list_vehicles():
    """
    Returns all available scooters from the Supabase vehicles table.

    Called by the Next.js /api/vehicles route handler, which is in turn
    called by the frontend VehicleGrid component via TanStack Query.

    Flow:  Browser → Next.js /api/vehicles → HERE → Supabase
    """
    # If the DB client never initialised, return a 503 immediately
    if supabase_client is None:
        raise HTTPException(
            status_code=503,
            detail=db_init_error or "Database client not initialised."
        )

    # Delegate to the service layer — all Supabase logic lives there
    from services.vehicle_service import get_all_vehicles
    vehicles = get_all_vehicles(supabase_client)

    # Return the list — FastAPI serialises each Vehicle model to JSON automatically
    return vehicles
