# ─── What this file is ────────────────────────────────────────────────────────
#
# This is the FastAPI backend — the server that sits between the
# Next.js frontend and the Supabase database.
#
# To run it:
#   cd backend
#   uvicorn main:app --reload
#
# It will be available at:  http://localhost:8000
# Auto-generated API docs:  http://localhost:8000/docs
#
# ──────────────────────────────────────────────────────────────────────────────


# ─── Imports ──────────────────────────────────────────────────────────────────

import os                                          # read environment variables
from fastapi import FastAPI                        # the web framework
from fastapi.middleware.cors import CORSMiddleware # allow Next.js to talk to us
from dotenv import load_dotenv                     # load variables from .env file


# ─── Load Environment Variables ───────────────────────────────────────────────

# Reads SUPABASE_URL and SUPABASE_KEY from the backend/.env file
# so we never hardcode secret credentials in the source code
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))


# ─── Create the FastAPI App ───────────────────────────────────────────────────

# `app` is the central object — all routes (URLs) are registered on it
app = FastAPI(title="EV Rental API", version="0.1.0")


# ─── CORS Middleware ──────────────────────────────────────────────────────────

# CORS (Cross-Origin Resource Sharing) is a browser security rule that blocks
# requests from one domain to another unless the server explicitly allows it.
# Here we tell FastAPI: "it's okay to accept requests from localhost:3000"
# (which is where Next.js runs during development).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # only allow our Next.js dev server
    allow_methods=["*"],                      # allow GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],                      # allow any request headers
)


# ─── Supabase Client Setup ────────────────────────────────────────────────────

# We create the Supabase client ONCE when the server starts (not on every
# request) because creating it is slow — this way it's ready instantly.

supabase_client = None   # will hold the connected client, or stay None on error
db_init_error   = None   # will hold an error message if something goes wrong


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
        db_init_error = None  # clear any previous error
    except Exception as exc:
        db_init_error = str(exc)  # store the error so /health can report it


# Run the setup function immediately when the server starts
init_supabase()


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    """
    Health check endpoint — called by the Next.js frontend to verify
    that the backend is running AND that the database is reachable.

    Returns JSON like:
      { "status": "ok", "service": "ev-rental-api", "db": "connected" }
    """

    # Default state — will be updated below
    db_status = "not_configured"
    db_detail = db_init_error

    if supabase_client is not None:
        try:
            # Send a query to a table that doesn't exist on purpose.
            # If our credentials are WRONG → Supabase returns an auth error.
            # If our credentials are CORRECT → Supabase returns a "table not
            # found" error — which still proves the connection works fine.
            supabase_client.table("_health_check_does_not_exist") \
                           .select("*") \
                           .limit(0) \
                           .execute()

            # If no exception was raised at all, we're also connected
            db_status = "connected"
            db_detail = None

        except Exception as exc:
            err = str(exc)

            # These error codes/phrases all mean "table not found" —
            # i.e. we successfully REACHED Supabase, the credentials work,
            # the table just doesn't exist (which is expected and fine).
            connected_signals = [
                "PGRST205",              # PostgREST: table not in schema cache
                "42P01",                 # PostgreSQL: undefined table
                "does not exist",        # generic not-found wording
                "Could not find the table",
                "relation",
            ]

            if any(signal in err for signal in connected_signals):
                # "Table not found" = we're connected — mark as success
                db_status = "connected"
                db_detail = None
            else:
                # Something else went wrong (bad credentials, network error, etc.)
                db_status = "error"
                db_detail = err

    # Build and return the response
    # The `**{...} if db_detail else {}` part only adds "db_detail" to the
    # response when there is actually an error message to show
    return {
        "status":  "ok",
        "service": "ev-rental-api",
        "db":      db_status,
        **( {"db_detail": db_detail} if db_detail else {} ),
    }
