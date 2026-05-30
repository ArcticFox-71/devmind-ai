# main.py
# Entry point of the entire backend server
# This is the file we run to start everything

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env file FIRST before anything else
load_dotenv()

# Import our route files
from routes.chat import router as chat_router
from routes.history import router as history_router
from database.init_db import init_db

# Create the FastAPI app
app = FastAPI(
    title="DevMind AI",
    description="AI-powered code debugger, generator and explainer",
    version="1.0.0"
)

# CORS = allows frontend (different port) to talk to backend
# Without this, browser blocks all requests!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register our routes
app.include_router(chat_router)
app.include_router(history_router)

# Initialize database when server starts
@app.on_event("startup")
async def startup_event():
    init_db()
    print("🚀 DevMind AI Backend is running!")
    print("📖 API Docs: http://localhost:8000/docs")

@app.get("/")
def root():
    return {
        "message": "DevMind AI Backend Running! 🚀",
        "docs": "http://localhost:8000/docs",
        "version": "1.0.0"
    }