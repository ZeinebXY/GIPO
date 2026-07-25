import os
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, security
from app.orchestration import orchestrate
from app.routers.conversations import _get_owned_conversation

router = APIRouter(prefix="/conversations", tags=["messages"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/{conversation_id}/messages", response_model=list[schemas.MessageOut])
def list_messages(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    conv = _get_owned_conversation(conversation_id, current_user, db)
    return conv.messages


@router.post("/{conversation_id}/messages", response_model=schemas.SendMessageResponse)
async def send_message(
    conversation_id: str,
    content: str = Form(""),
    profound_search: bool = Form(False),
    files: list[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    conv = _get_owned_conversation(conversation_id, current_user, db)

    if not content.strip() and not files:
        raise HTTPException(status_code=400, detail="Message needs text or at least one file.")

    # Save any attached files to disk and record their public URL.
    saved_attachments = []
    for upload in files:
        ext = os.path.splitext(upload.filename or "")[1]
        stored_name = f"{uuid.uuid4()}{ext}"
        path = os.path.join(UPLOAD_DIR, stored_name)
        with open(path, "wb") as f:
            f.write(await upload.read())
        saved_attachments.append({"name": upload.filename, "url": f"/uploads/{stored_name}"})

    user_message = models.Message(
        conversation_id=conv.id,
        role="user",
        content=content,
        attachments=saved_attachments,
    )
    db.add(user_message)

    # First message in a conversation becomes its title.
    if len(conv.messages) == 0 and content.strip():
        conv.title = content.strip()[:40]

    result = orchestrate(content, profound_search=profound_search)

    assistant_message = models.Message(
        conversation_id=conv.id,
        role="assistant",
        content=result.reply,
        optimized_prompt=result.optimized_prompt,
        recommended_tool=result.recommended_tool,
    )
    db.add(assistant_message)

    db.commit()
    db.refresh(user_message)
    db.refresh(assistant_message)
    db.refresh(conv)

    return schemas.SendMessageResponse(
        user_message=user_message,
        assistant_message=assistant_message,
        conversation=conv,
    )
