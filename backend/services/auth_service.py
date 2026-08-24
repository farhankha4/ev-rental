# ─── Feature 3: Authentication Service Layer ─────────────────────────────────
#
# Contains database interactions for user management in Supabase:
#   - Register new users with hashed passwords
#   - Authenticate users against stored hashes and issue JWTs
#   - Retrieve user profile by UUID
#
# ────────────────────────────────────────────────────────────────────────────

from typing import Optional
from fastapi import HTTPException
from models.user import UserRegister, UserLogin, UserResponse, TokenResponse
from utils.auth import hash_password, verify_password, create_access_token


def register_user(supabase_client, user_data: UserRegister) -> TokenResponse:
    """
    [Feature 3 - Part 2]
    Registers a new user record in Supabase after verifying unique email.
    Hashes the password before insertion, then returns an access token.
    """
    email_clean = user_data.email.strip().lower()

    try:
        # Check if email is already taken
        existing = (
            supabase_client
            .table("users")
            .select("id")
            .eq("email", email_clean)
            .execute()
        )

        if existing.data and len(existing.data) > 0:
            raise HTTPException(
                status_code=400,
                detail="An account with this email address already exists."
            )

        # Hash password securely
        password_hash = hash_password(user_data.password)

        # Insert new user record
        insert_payload = {
            "email": email_clean,
            "hashed_password": password_hash,
            "full_name": user_data.full_name.strip(),
            "phone": user_data.phone.strip() if user_data.phone else None,
            "role": "customer"
        }

        insert_res = (
            supabase_client
            .table("users")
            .insert(insert_payload)
            .execute()
        )

        if not insert_res.data or len(insert_res.data) == 0:
            raise HTTPException(
                status_code=500,
                detail="Failed to create user account in database."
            )

        user_row = insert_res.data[0]
        user_response = UserResponse(
            id=str(user_row["id"]),
            email=user_row["email"],
            full_name=user_row["full_name"],
            phone=user_row.get("phone"),
            role=user_row.get("role", "customer"),
            created_at=user_row.get("created_at")
        )

        # Generate JWT token
        token = create_access_token(data={"sub": str(user_response.id), "email": user_response.email, "role": user_response.role})

        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=user_response
        )

    except HTTPException:
        raise
    except Exception as exc:
        print(f"[auth_service] Registration error: {exc}")
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(exc)}"
        )


def authenticate_user(supabase_client, login_data: UserLogin) -> TokenResponse:
    """
    [Feature 3 - Part 2]
    Verifies user credentials against stored bcrypt hash in Supabase.
    If valid, returns a signed JWT access token.
    """
    email_clean = login_data.email.strip().lower()

    try:
        # Fetch user record by email
        res = (
            supabase_client
            .table("users")
            .select("*")
            .eq("email", email_clean)
            .execute()
        )

        if not res.data or len(res.data) == 0:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        user_row = res.data[0]

        # Verify password hash
        is_valid = verify_password(login_data.password, user_row["hashed_password"])
        if not is_valid:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        user_response = UserResponse(
            id=str(user_row["id"]),
            email=user_row["email"],
            full_name=user_row["full_name"],
            phone=user_row.get("phone"),
            role=user_row.get("role", "customer"),
            created_at=user_row.get("created_at")
        )

        # Issue JWT token
        token = create_access_token(data={"sub": str(user_response.id), "email": user_response.email, "role": user_response.role})

        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=user_response
        )

    except HTTPException:
        raise
    except Exception as exc:
        print(f"[auth_service] Authentication error: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Authentication service encountered an error."
        )


def get_user_by_id(supabase_client, user_id: str) -> Optional[UserResponse]:
    """
    [Feature 3 - Part 2]
    Fetches a user profile by UUID without returning password hashes.
    """
    try:
        res = (
            supabase_client
            .table("users")
            .select("id, email, full_name, phone, role, created_at")
            .eq("id", user_id)
            .execute()
        )

        if res.data and len(res.data) > 0:
            return UserResponse(**res.data[0])

        return None
    except Exception as exc:
        print(f"[auth_service] Get user by id error: {exc}")
        return None
