from datetime import datetime
from pydantic import BaseModel, EmailStr


# ---------- Auth ----------

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Conversations ----------

class ConversationOut(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConversationRenameRequest(BaseModel):
    title: str


# ---------- Messages ----------

class AttachmentOut(BaseModel):
    name: str
    url: str


class MessageOut(BaseModel):
    id: str
    role: str
    content: str
    optimized_prompt: str | None = None
    recommended_tool: str | None = None
    attachments: list[AttachmentOut] = []
    created_at: datetime

    class Config:
        from_attributes = True


class SendMessageResponse(BaseModel):
    user_message: MessageOut
    assistant_message: MessageOut
    conversation: ConversationOut
