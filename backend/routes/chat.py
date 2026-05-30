# chat.py
# API endpoints for chat, debug, generate, and image analysis
# These are the URLs the frontend will call

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from models.schemas import ChatRequest
from services.gemini_service import chat_with_gemini, analyze_image_with_gemini
from services.db_service import (
    create_session, get_session_messages,
    save_message, update_session_title
)

# APIRouter groups related routes together
router = APIRouter(prefix="/api", tags=["chat"])

@router.post("/chat")
async def chat(req: ChatRequest):
    """Main chat endpoint — handles all modes"""
    try:
        # Step 1: Get or create session
        session_id = req.session_id
        if not session_id:
            # First message — create a new session
            title = req.message[:45] + "..." if len(req.message) > 45 else req.message
            session = create_session(title, req.mode)
            session_id = session["id"]
        
        # Step 2: Load previous messages for context
        history = get_session_messages(session_id)
        
        # Step 3: Send to Gemini
        response = chat_with_gemini(
            message=req.message,
            mode=req.mode,
            history=history,
            language=req.language or "python"
        )
        
        # Step 4: Save both messages to database
        save_message(session_id, "user", req.message)
        save_message(session_id, "assistant", response)
        
        # Step 5: Update title if this is the first message
        if not history:
            title = req.message[:45] + "..." if len(req.message) > 45 else req.message
            update_session_title(session_id, title)
        
        return {
            "session_id": session_id,
            "response": response,
            "mode": req.mode
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-image")
async def analyze_image(
    image: UploadFile = File(...),       # The uploaded image file
    question: str = Form("Debug this code"),  # Question about the image
    mode: str = Form("debug")            # What mode to analyze in
):
    """Vision endpoint — analyzes uploaded screenshots"""
    try:
        # Read image bytes from upload
        image_data = await image.read()
        
        # Send to Gemini Vision
        response = analyze_image_with_gemini(
            image_data=image_data,
            question=question,
            mode=mode
        )
        
        return {"response": response, "mode": mode}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))