from datetime import datetime, timedelta, timezone

import jwt
from passlib.context import CryptContext

from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def _create_token(subject: str, purpose: str, expires_minutes: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "purpose": purpose,
        "iat": now,
        "exp": now + timedelta(minutes=expires_minutes),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def _decode_token(token: str, expected_purpose: str) -> str:
    """Returns the subject (email) if the token is valid, well-formed, and
    matches expected_purpose. Raises ValueError otherwise."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise ValueError("This link has expired.")
    except jwt.InvalidTokenError:
        raise ValueError("This link is invalid.")

    if payload.get("purpose") != expected_purpose:
        raise ValueError("This link is invalid.")

    subject = payload.get("sub")
    if not subject:
        raise ValueError("This link is invalid.")
    return subject


# --- Access tokens (login sessions) ---

def create_access_token(email: str) -> str:
    return _create_token(email, "access", settings.ACCESS_TOKEN_EXPIRE_MINUTES)


def decode_access_token(token: str) -> str:
    return _decode_token(token, "access")


# --- Email verification tokens ---

def create_email_verification_token(email: str) -> str:
    return _create_token(email, "email_verify", settings.EMAIL_TOKEN_EXPIRE_MINUTES)


def decode_email_verification_token(token: str) -> str:
    return _decode_token(token, "email_verify")


# --- Password reset tokens ---

def create_password_reset_token(email: str) -> str:
    return _create_token(email, "password_reset", settings.RESET_TOKEN_EXPIRE_MINUTES)


def decode_password_reset_token(token: str) -> str:
    return _decode_token(token, "password_reset")