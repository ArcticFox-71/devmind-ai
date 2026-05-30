# history.py
# API endpoints for managing chat sessions and history

from fastapi import APIRouter, HTTPException
from services.db_service import (
    get_all_sessions, get_session_messages, delete_session
)

router = APIRouter(prefix="/api", tags=["history"])

@router.get("/sessions")
def get_sessions():
    """Returns all chat sessions for the sidebar"""
    try:
        return get_all_sessions()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}/messages")
def get_messages(session_id: str):
    """Returns all messages for a specific session"""
    try:
        return get_session_messages(session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/sessions/{session_id}")
def remove_session(session_id: str):
    """Deletes a session and all its messages"""
    try:
        delete_session(session_id)
        return {"status": "deleted", "session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))