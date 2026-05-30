# schemas.py
# These define the SHAPE of data coming in and going out
# FastAPI uses these to validate requests automatically

from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    """Shape of every chat message sent from frontend"""
    session_id: Optional[str] = None   # None = start new session
    message: str                        # The actual message text
    mode: str = "chat"                  # chat | debug | generate
    language: Optional[str] = "python" # For code-related modes

class SessionCreate(BaseModel):
    """Shape for creating a new chat session"""
    title: Optional[str] = "New Chat"
    mode: str = "chat"

class ApiKeyRequest(BaseModel):
    """Shape for setting API key from frontend settings"""
    api_key: str