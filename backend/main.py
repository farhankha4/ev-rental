# ─── Feature 0, 1, 2, 3 & 4: FastAPI Backend Server ────────────────────────
#
# Central entrypoint for the FastAPI REST API.
#
# Endpoints:
#   GET  /health           -> Feature 0: Health check & DB connection probe
#   GET  /vehicles         -> Feature 1: List all available scooters
#   GET  /vehicles/{id}    -> Feature 2: Get full details of a specific scooter
#   POST /auth/register    -> Feature 3: Register new user (bcrypt hash & JWT)
#   POST /auth/login       -> Feature 3: Login user & return JWT token
#   GET  /auth/me          -> Feature 3: Get profile of logged-in user (protected)
#   POST /bookings         -> Feature 4: Create scooter reservation (protected)
#   GET  /bookings/{id}    -> Feature 4: Get booking confirmation (protected)
#
# ────────────────────────────────────────────────────────────────────────────

import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# ─── App Initialization ──────────────────────────────────────────────────────

app = FastAPI(
    title="EV Rental API",
    description="Backend API for SwiftVolt electric vehicle rental platform",
    version="0.4.0"
)

# Allow Cross-Origin Resource Sharing (CORS) from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
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


# ─── Feature 0: Health Routes ────────────────────────────────────────────────

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


# ─── Feature 1 & 2: Vehicle Routes ──────────────────────────────────────────

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
    [Feature 2]
    Returns the detailed specification for a specific scooter identified by UUID.
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


# ─── Feature 3: Authentication Routes ───────────────────────────────────────

from models.user import UserRegister, UserLogin, UserResponse, TokenResponse
from dependencies.auth import get_current_user


@app.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    """
    [Feature 3 - Part 2]
    Registers a new user with hashed password and returns access token.
    """
    if supabase_client is None:
        raise HTTPException(status_code=503, detail=db_init_error or "Database is offline.")

    from services.auth_service import register_user
    return register_user(supabase_client, user_data)


@app.post("/auth/login", response_model=TokenResponse)
async def login(login_data: UserLogin):
    """
    [Feature 3 - Part 2]
    Authenticates email & password, returning JWT access token on success.
    """
    if supabase_client is None:
        raise HTTPException(status_code=503, detail=db_init_error or "Database is offline.")

    from services.auth_service import authenticate_user
    return authenticate_user(supabase_client, login_data)


@app.get("/auth/me", response_model=UserResponse)
async def get_my_profile(current_user: UserResponse = Depends(get_current_user)):
    """
    [Feature 3 - Part 2]
    Protected endpoint: returns the authenticated user's profile.
    Requires header: `Authorization: Bearer <access_token>`
    """
    return current_user


# ─── Feature 4: Booking Routes ──────────────────────────────────────────────

from models.booking import BookingCreate, BookingResponse


@app.post("/bookings", response_model=BookingResponse)
async def create_new_booking(
    booking_data: BookingCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    [Feature 4 - Part 2]
    Creates a new reservation for a scooter tied to the logged-in user.
    Calculates duration, applies pricing, and records the booking in Supabase.
    """
    if supabase_client is None:
        raise HTTPException(status_code=503, detail=db_init_error or "Database is offline.")

    from services.booking_service import create_booking
    return create_booking(supabase_client, str(current_user.id), booking_data)


@app.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking_details(
    booking_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    [Feature 4 - Part 2]
    Retrieves booking details for a specific reservation belonging to current user.
    """
    if supabase_client is None:
        raise HTTPException(status_code=503, detail=db_init_error or "Database is offline.")

    from services.booking_service import get_booking_by_id
    booking = get_booking_by_id(supabase_client, booking_id, str(current_user.id))

    if not booking:
        raise HTTPException(status_code=404, detail=f"Booking with ID '{booking_id}' not found.")

    return booking
