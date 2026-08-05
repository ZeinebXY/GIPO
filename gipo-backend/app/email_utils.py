import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from .config import settings

GMAIL_SMTP_HOST = "smtp.gmail.com"
GMAIL_SMTP_PORT = 587


def _send_email(to_email: str, subject: str, html_body: str) -> None:
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = settings.GMAIL_USER
    message["To"] = to_email
    message.attach(MIMEText(html_body, "html"))

    # Gmail app passwords are shown with spaces; SMTP wants them without.
    app_password = settings.GMAIL_APP_PASSWORD.replace(" ", "")

    with smtplib.SMTP(GMAIL_SMTP_HOST, GMAIL_SMTP_PORT) as server:
        server.starttls()
        server.login(settings.GMAIL_USER, app_password)
        server.sendmail(settings.GMAIL_USER, to_email, message.as_string())


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