import requests

from .config import settings

RESEND_API_URL = "https://api.resend.com/emails"


def _send_email(to_email: str, subject: str, html_body: str) -> None:
    response = requests.post(
        RESEND_API_URL,
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "from": settings.RESEND_FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "html": html_body,
        },
        timeout=10,
    )
    if response.status_code >= 400:
        # Surface Resend's own error message (e.g. bad API key, unverified
        # sender domain) instead of a generic failure.
        raise RuntimeError(f"Resend API error ({response.status_code}): {response.text}")


def send_verification_email(to_email: str, token: str) -> None:
    link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    _send_email(
        to_email=to_email,
        subject="Verify your GIPO account",
        html_body=f"""
            <p>Welcome to GIPO!</p>
            <p>Click the link below to verify your email address. It expires in
            {settings.EMAIL_TOKEN_EXPIRE_MINUTES} minutes.</p>
            <p><a href="{link}">{link}</a></p>
            <p>If you didn't create this account, you can ignore this email.</p>
        """,
    )


def send_password_reset_email(to_email: str, token: str) -> None:
    link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    _send_email(
        to_email=to_email,
        subject="Reset your GIPO password",
        html_body=f"""
            <p>We received a request to reset your GIPO password.</p>
            <p>Click the link below to choose a new one. It expires in
            {settings.RESET_TOKEN_EXPIRE_MINUTES} minutes.</p>
            <p><a href="{link}">{link}</a></p>
            <p>If you didn't request this, you can ignore this email — your
            password won't change.</p>
        """,
    )
