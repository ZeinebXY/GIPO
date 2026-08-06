import os
from dotenv import load_dotenv

load_dotenv()


def _require(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(
            f"Missing required environment variable '{name}'. "
            f"Copy .env.example to .env and fill it in."
        )
    return value


class Settings:
    BREVO_API_KEY: str = _require("BREVO_API_KEY")
    # Must be an email address you've verified in Brevo (Senders & IP ->
    # Senders). No default — Brevo rejects unverified senders.
    BREVO_FROM_EMAIL: str = _require("BREVO_FROM_EMAIL")

    SECRET_KEY: str = _require("SECRET_KEY")
    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    EMAIL_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("EMAIL_TOKEN_EXPIRE_MINUTES", "30"))
    RESET_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("RESET_TOKEN_EXPIRE_MINUTES", "30"))

    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./gipo.db")


settings = Settings()
