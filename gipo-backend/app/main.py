from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import Base, engine
from app.routers import auth, conversations, messages

# Creates gipo.db (or connects to DATABASE_URL) and the tables above,
# if they don't already exist. Fine for this scale; swap for Alembic
# migrations once the schema needs to evolve carefully in production.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="GIPO API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(conversations.router)
app.include_router(messages.router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "gipo-api"}
