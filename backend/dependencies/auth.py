# ─── Feature 3: Authentication Route Dependencies ────────────────────────────
#
# Provides the `get_current_user` FastAPI dependency.
# Used by any protected endpoints (e.g. /auth/me, and future /bookings) to extract,
# verify, and load the currently authenticated user from HTTP Bearer headers.
#
# ────────────────────────────────────────────────────────────────────────────

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.auth import decode_access_token
from services.auth_service import get_user_by_id
from models.user import UserResponse

# HTTP Bearer scheme expects: Authorization: Bearer <JWT_TOKEN>
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    """
    Dependency that inspects the Authorization header, validates the JWT,
    and returns the UserResponse object.

    Raises 401 Unauthorized if:
      - Header is missing or malformed
      - Token is expired or tampered with
      - User record no longer exists in Supabase
    """
    token = credentials.credentials
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: str = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is missing subject identifier.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Import main.supabase_client dynamically to avoid circular imports
    import main
    if main.supabase_client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service is unavailable."
        )

    user = get_user_by_id(main.supabase_client, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with this token no longer exists.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
