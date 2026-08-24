# ─── Feature 3: User Pydantic Schemas ─────────────────────────────────────────
#
# This file defines the data models for user registration, authentication,
# and public user profiles.
#
# Schemas:
#   - UserRegister: Payload sent when a user signs up.
#   - UserLogin: Payload sent when a user logs in.
#   - UserResponse: Safe user profile (never includes password hashes).
#   - TokenResponse: Returned upon successful login/registration containing JWT.
#
# ────────────────────────────────────────────────────────────────────────────

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserRegister(BaseModel):
    """
    [Feature 3 - Part 2]
    Incoming request payload for user registration (POST /auth/register).
    """
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None


class UserLogin(BaseModel):
    """
    [Feature 3 - Part 2]
    Incoming request payload for user login (POST /auth/login).
    """
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """
    [Feature 3 - Part 2]
    Public user representation returned to frontend clients.
    Excludes sensitive fields like hashed_password.
    """
    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str = "customer"
    created_at: Optional[datetime] = None


class TokenResponse(BaseModel):
    """
    [Feature 3 - Part 2]
    Authentication response containing access token and basic user details.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
