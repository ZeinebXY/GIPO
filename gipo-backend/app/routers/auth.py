from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..email_utils import send_password_reset_email, send_verification_email
from ..models import User
from ..schemas import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    ResetPasswordRequest,
    SignupRequest,
    TokenResponse,
)
from ..security import (
    create_access_token,
    create_email_verification_token,
    create_password_reset_token,
    decode_email_verification_token,
    decode_password_reset_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        is_verified=False,
    )
    db.add(user)
    db.commit()

    token = create_email_verification_token(user.email)
    send_verification_email(user.email, token)

    return {"message": "Account created. Check your email to verify your address before logging in."}


@router.get("/verify-email", response_model=MessageResponse)
def verify_email(token: str, db: Session = Depends(get_db)):
    try:
        email = decode_email_verification_token(token)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="This link is invalid.")

    if not user.is_verified:
        user.is_verified = True
        db.commit()

    return {"message": "Email verified. You can now log in."}


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    # Same generic error whether the email doesn't exist or the password is
    # wrong, so we don't reveal which accounts exist.
    invalid_credentials = HTTPException(status_code=401, detail="Incorrect email or password.")
    if not user or not verify_password(payload.password, user.hashed_password):
        raise invalid_credentials

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email before logging in.")

    access_token = create_access_token(user.email)
    return {"access_token": access_token, "user": user}


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user:
        token = create_password_reset_token(user.email)
        send_password_reset_email(user.email, token)

    # Always return the same message, whether or not the account exists —
    # this avoids leaking which emails are registered.
    return {"message": "If an account exists for that email, a reset link has been sent."}


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        email = decode_password_reset_token(payload.token)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="This link is invalid.")

    user.hashed_password = hash_password(payload.new_password)
    db.commit()

    return {"message": "Password updated. You can now log in with your new password."}