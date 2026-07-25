from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, security

router = APIRouter(prefix="/conversations", tags=["conversations"])


def _get_owned_conversation(conversation_id: str, user: models.User, db: Session) -> models.Conversation:
    conv = (
        db.query(models.Conversation)
        .filter(models.Conversation.id == conversation_id, models.Conversation.user_id == user.id)
        .first()
    )
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    return conv


@router.get("", response_model=list[schemas.ConversationOut])
def list_conversations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    return (
        db.query(models.Conversation)
        .filter(models.Conversation.user_id == current_user.id)
        .order_by(models.Conversation.updated_at.desc())
        .all()
    )


@router.post("", response_model=schemas.ConversationOut)
def create_conversation(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    conv = models.Conversation(user_id=current_user.id, title="New conversation")
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv


@router.patch("/{conversation_id}", response_model=schemas.ConversationOut)
def rename_conversation(
    conversation_id: str,
    payload: schemas.ConversationRenameRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    conv = _get_owned_conversation(conversation_id, current_user, db)
    title = payload.title.strip()
    if title:
        conv.title = title
        db.commit()
        db.refresh(conv)
    return conv


@router.delete("/{conversation_id}", status_code=204)
def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    conv = _get_owned_conversation(conversation_id, current_user, db)
    db.delete(conv)
    db.commit()
