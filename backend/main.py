# ─── Feature 0, 1, 2, 3, 4, 5, 6 & 7: FastAPI Backend Server Entrypoint ────────
#
# This is the central entrypoint and routing hub for the SwiftVolt FastAPI backend.
# It handles HTTP requests from the Next.js frontend, connects to the Supabase
# database, and enforces authentication and business logic across all features.
#
# Summary of Endpoints by Feature:
#   • Feature 0 (Skeleton Setup):
#       GET  /health                      -> Verifies server status & database connectivity
#   • Feature 1 (Browse Scooters):
#       GET  /vehicles                    -> Retrieves all available SwiftVolt scooters
#   • Feature 2 (Scooter Details):
#       GET  /vehicles/{id}               -> Retrieves detailed technical profile of one scooter
#   • Feature 3 (Authentication):
#       POST /auth/register               -> Hashes password with bcrypt & registers new user
#       POST /auth/login                  -> Validates credentials & issues signed JWT token
#       GET  /auth/me                     -> Protected: Returns logged-in user's profile
#   • Feature 4 & 5 (Bookings & Availability):
#       POST /bookings                    -> Protected: Reserves scooter with strict conflict checks
#       GET  /bookings/{id}               -> Protected: Fetches confirmation receipt for a booking
#       GET  /vehicles/{id}/availability  -> Checks if date range is free from collisions
#   • Feature 6 (My Bookings Dashboard):
#       GET  /bookings/my-bookings        -> Protected: Returns all reservations for logged-in user
#   • Feature 7 (Razorpay Payments):
#       POST /payments/create-order       -> Protected: Generates Razorpay order ID for checkout
#       POST /payments/verify             -> Protected: Verifies HMAC signature & confirms payment
#
# ────────────────────────────────────────────────────────────────────────────

import os
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# ─── 1. Load Environment Variables ───────────────────────────────────────────
# Reads Supabase credentials (URL, anon key) and JWT settings from backend/.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# ─── 2. FastAPI Application Initialization ───────────────────────────────────
app = FastAPI(
    title="EV Rental API",
    description="REST API backend for SwiftVolt electric scooter rental platform",
    version="0.7.0"
)

# ─── 3. CORS (Cross-Origin Resource Sharing) Middleware ───────────────────────
# Allows our Next.js frontend (running on http://localhost:3000) to communicate
# with this backend without browser security blocks.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── 4. Supabase Client Lifecycle Management ──────────────────────────────────
# The Supabase client is initialized once when the server boots up.
# Reusing this single client avoids expensive connection handshakes on every request.
supabase_client = None
db_init_error   = None


def init_supabase():
    """
    Reads credentials from .env and creates the global Supabase client instance.
    If credentials are missing or invalid, errors are stored in `db_init_error`
    so the /health route can report them clearly rather than crashing the server.
    """
    global supabase_client, db_init_error

    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_KEY", "")

    if not url or url == "https://your-project.supabase.co":
        db_init_error = "SUPABASE_URL not configured — please check backend/.env"
        return
    if not key or key == "your-anon-key-here":
        db_init_error = "SUPABASE_KEY not configured — please check backend/.env"
        return

    try:
        from supabase import create_client
        supabase_client = create_client(url, key)
        db_init_error = None
    except Exception as exc:
        db_init_error = str(exc)


# Initialize database connection on boot
init_supabase()


# ─── Feature 0: Health & Diagnostic Endpoints ─────────────────────────────────

@app.get("/health")
async def health():
    """
    [Feature 0 - Part 2 & 3: Health Check]
    Verifies that FastAPI is running and sends a probe query to Supabase.
    Called by Next.js /api/health to power the Stack Status card on the home page.
    """
    db_status = "not_configured"
    db_detail = db_init_error

    if supabase_client is not None:
        try:
            # Query a non-existent table on purpose:
            # If credentials are WRONG -> Auth/API key error (real issue).
            # If credentials are OK -> "Table not found" error (expected -> proves DB is reachable).
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


# ─── Feature 1, 2 & 5: Scooter Endpoints ─────────────────────────────────────

@app.get("/vehicles")
async def list_vehicles():
    """
    [Feature 1 - Part 2: Browse Scooters]
    Returns a list of all available scooters in the catalog.
    Delegates database querying to services/vehicle_service.py.
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
    [Feature 2 - Part 1: Scooter Details]
    Fetches full specifications for a single scooter by UUID.
    Returns HTTP 404 if the scooter ID is not found.
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


@app.get("/vehicles/{vehicle_id}/availability")
async def check_vehicle_availability(
    vehicle_id: str,
    pickup_time: datetime = Query(..., description="ISO 8601 pickup datetime"),
    return_time: datetime = Query(..., description="ISO 8601 return datetime")
):
    """
    [Feature 5 - Part 1: Date Collision Check]
    Checks if a scooter has any overlapping bookings for the requested dates.
    Returns: { "available": true/false, "vehicle_id": ..., "pickup_time": ..., "return_time": ... }
    """
    if supabase_client is None:
        raise HTTPException(status_code=503, detail=db_init_error or "Database is offline.")

    if return_time <= pickup_time:
        raise HTTPException(status_code=400, detail="Return time must be after pickup time.")

    from services.booking_service import is_vehicle_available
    is_free = is_vehicle_available(
        supabase_client=supabase_client,
        vehicle_id=vehicle_id,
        pickup_time=pickup_time,
        return_time=return_time
    )

    return {
        "vehicle_id": vehicle_id,
        "pickup_time": pickup_time.isoformat(),
        "return_time": return_time.isoformat(),
        "available": is_free
    }


# ─── Feature 3: User Authentication Endpoints ────────────────────────────────

from models.user import UserRegister, UserLogin, UserResponse, TokenResponse
from dependencies.auth import get_current_user


@app.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    """
    [Feature 3 - Part 2: User Registration]
    Validates input schema, hashes password using bcrypt, stores user row
    in Supabase, and returns a signed JWT access token.
    """
    if supabase_client is None:
        raise HTTPException(status_code=503, detail=db_init_error or "Database is offline.")

    from services.auth_service import register_user
    return register_user(supabase_client, user_data)


@app.post("/auth/login", response_model=TokenResponse)
async def login(login_data: UserLogin):
    """
    [Feature 3 - Part 2: User Login]
    Validates email and plaintext password against stored bcrypt hash in Supabase.
    Returns a signed JWT access token and public user profile on success.
    """
    if supabase_client is None:
        raise HTTPException(status_code=503, detail=db_init_error or "Database is offline.")

    from services.auth_service import authenticate_user
    return authenticate_user(supabase_client, login_data)


@app.get("/auth/me", response_model=UserResponse)
async def get_my_profile(current_user: UserResponse = Depends(get_current_user)):
    """
    [Feature 3 - Part 2: Current User Session]
    Protected route: verifies the Bearer JWT token from the Authorization header
    and returns the active user's account details.
    """
    return current_user


# ─── Feature 4, 5 & 6: Reservation Endpoints ──────────────────────────────────

from models.booking import BookingCreate, BookingResponse


@app.post("/bookings", response_model=BookingResponse)
async def create_new_booking(
    booking_data: BookingCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    [Feature 4 & 5 - Part 2: Create Reservation with Overlap Check]
    Protected route: creates a new scooter reservation for the logged-in user.
    1. Checks for scheduling conflicts (Feature 5).
    2. Computes rental duration in days (math.ceil).
    3. Calculates total cost = days * vehicle.price_per_day.
    4. Inserts the booking row into Supabase.
    """
    if supabase_client is None:
        raise HTTPException(status_code=503, detail=db_init_error or "Database is offline.")

    from services.booking_service import create_booking
    return create_booking(supabase_client, str(current_user.id), booking_data)


@app.get("/bookings/my-bookings", response_model=list[BookingResponse])
async def list_my_bookings(
    current_user: UserResponse = Depends(get_current_user)
):
    """
    [Feature 6 - Part 2: My Bookings Dashboard]
    Protected route: retrieves all bookings belonging to the currently logged-in user.
    MUST come before /bookings/{booking_id} so FastAPI doesn't treat 'my-bookings' as an ID parameter.
    """
    if supabase_client is None:
        raise HTTPException(status_code=503, detail=db_init_error or "Database is offline.")

    from services.booking_service import get_user_bookings
    return get_user_bookings(supabase_client, str(current_user.id))


@app.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking_details(
    booking_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    [Feature 4 - Part 2: Booking Details Lookup]
    Protected route: retrieves booking details for a specific reservation
    belonging to the currently logged-in user.
    """
    if supabase_client is None:
        raise HTTPException(status_code=503, detail=db_init_error or "Database is offline.")

    from services.booking_service import get_booking_by_id
    booking = get_booking_by_id(supabase_client, booking_id, str(current_user.id))

    if not booking:
        raise HTTPException(status_code=404, detail=f"Booking with ID '{booking_id}' not found.")

    return booking


# ─── Feature 7: Razorpay Payment Endpoints ────────────────────────────────────

from models.payment import (
    PaymentOrderCreate,
    PaymentOrderResponse,
    PaymentVerify,
    PaymentVerifyResponse
)


@app.post("/payments/create-order", response_model=PaymentOrderResponse)
async def generate_payment_order(
    payload: PaymentOrderCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    [Feature 7 - Part 2: Generate Razorpay Payment Order]
    Protected route: creates a official Razorpay order ID for the specified booking.
    Returns: order_id, amount in paise, currency, key_id, booking_id
    """
    if supabase_client is None:
        raise HTTPException(status_code=503, detail=db_init_error or "Database is offline.")

    from services.payment_service import create_payment_order
    return create_payment_order(supabase_client, str(current_user.id), payload.booking_id)


@app.post("/payments/verify", response_model=PaymentVerifyResponse)
async def verify_payment_signature(
    payload: PaymentVerify,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    [Feature 7 - Part 2: Verify Razorpay Signature & Confirm Booking]
    Protected route: validates HMAC SHA256 signature from Razorpay Checkout popup modal.
    Updates database: payment_status -> 'paid', booking_status -> 'confirmed'.
    """
    if supabase_client is None:
        raise HTTPException(status_code=503, detail=db_init_error or "Database is offline.")

    from services.payment_service import verify_payment_and_update_booking
    return verify_payment_and_update_booking(supabase_client, str(current_user.id), payload)
