import requests

from .config import settings

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def _send_email(to_email: str, subject: str, html_body: str) -> None:
    response = requests.post(
        BREVO_API_URL,
        headers={
            "api-key": settings.BREVO_API_KEY,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        json={
            "sender": {"email": settings.BREVO_FROM_EMAIL, "name": "GIPO"},
            "to": [{"email": to_email}],
            "subject": subject,
            "htmlContent": html_body,
        },
        timeout=10,
    )
    if response.status_code >= 400:
        # Surface Brevo's own error message (e.g. unverified sender, bad API
        # key) instead of a generic failure.
        raise RuntimeError(f"Brevo API error ({response.status_code}): {response.text}")


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
