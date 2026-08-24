# ─── Feature 3: Authentication & Cryptography Utilities ──────────────────────
#
# Provides password hashing and verification using bcrypt, as well as
# generation and decoding of JSON Web Tokens (JWT).
#
# Functions:
#   - hash_password: Uses bcrypt to salt and hash plaintext passwords.
#   - verify_password: Validates a plaintext password against a stored bcrypt hash.
#   - create_access_token: Encodes user payload into a signed JWT string.
#   - decode_access_token: Decodes and verifies JWT signature and expiry.
#
# ────────────────────────────────────────────────────────────────────────────

import os
from datetime import datetime, timedelta, timezone
from typing import Optional
import bcrypt
import jwt
from dotenv import load_dotenv

# Load secret key and algorithm from backend/.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "swiftvolt-default-secret-key-2026")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
DEFAULT_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))


def hash_password(plain_password: str) -> str:
    """
    Hashes a plaintext password using bcrypt with auto-generated salt.
    """
    # bcrypt requires bytes
    pwd_bytes = plain_password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plaintext password against a stored bcrypt hash.
    """
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a signed JWT access token containing the provided payload dict and expiry.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)

    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=DEFAULT_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "iat": now})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodes and validates a JWT token. Returns payload dict or None if invalid/expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except (jwt.PyJWTError, Exception):
        return None
