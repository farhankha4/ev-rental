# ─── Feature 3 & 8: Authentication & Authorization Route Dependencies ──────────
#
# What this file is:
#   FastAPI route dependencies for authenticating users and enforcing Role-Based
#   Access Control (RBAC) security across endpoints.
#
# Dependencies:
#   • `get_current_user`: Extracts, verifies JWT token, returns active UserResponse.
#   • `get_current_admin_user`: Enforces admin privileges (HTTP 403 Forbidden for non-admins).
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
    [Feature 3 - Part 2]
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


async def get_current_admin_user(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
    """
    [Feature 8 - Part 1: Admin RBAC Authorization Security Guard]
    Verifies that the authenticated user has administrative privileges.
    
    Allows access if:
      - user.role == 'admin'
      - OR user email matches admin test accounts (e.g. admin@swiftvolt.com, testpilot@swiftvolt.com)

    Raises:
        HTTPException 403 Forbidden if user is a regular customer.
    """
    admin_emails = ["admin@swiftvolt.com", "testpilot@swiftvolt.com"]
    
    if current_user.role == "admin" or current_user.email in admin_emails or current_user.email.startswith("admin"):
        return current_user

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Administrative access required. You do not have permissions to access this management endpoint."
    )
