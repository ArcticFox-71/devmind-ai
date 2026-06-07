# ⚡ DevMind AI

An intelligent AI-powered coding assistant built for developers — powered by Google Gemini 2.5 Flash

## 🌐 Live Demo

**[https://devmindai-chi.vercel.app](https://devmindai-chi.vercel.app)**

## 📖 About

DevMind AI is a full-stack AI-powered developer chatbot built for the GDG on Campus — PES College of Engineering, Mandya BYOC Challenge. It helps developers debug code, generate code, explain algorithms, and answer coding questions using Google Gemini 2.5 Flash API.

## ✨ Features

- 💬 **Chat Mode** — General coding questions and concepts
- 🐛 **Debug Mode** — Paste broken code and get bug analysis with fixes
- ⚡ **Generate Mode** — Describe what you want and get production ready code
- 📖 **Explain Mode** — Paste any code and get a detailed explanation
- 🎤 **Voice Input** — Speak your question using browser Speech API
- 📎 **Image Upload** — Upload screenshots of code or errors for vision analysis
- 🌍 **Multi Language** — Support for 22+ programming languages
- 💾 **Chat History** — All sessions saved with SQLite database
- 🌙 **Dark and Light Theme** — Toggle between themes
- 🔄 **Regenerate** — Regenerate any AI response

## 🛠️ Tech Stack

**Frontend**
- React with Vite
- Tailwind CSS
- Axios

**Backend**
- Python with FastAPI
- SQLite for chat history
- Google Gemini 2.5 Flash API

**Deployment**
- Vercel for frontend
- Render for backend

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher
- Gemini API Key from Google AI Studio

### Backend Setup

Open terminal and run:

    cd backend
    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt

Create a .env file inside the backend folder and add:

    GEMINI_API_KEY=your_api_key_here

Run the backend server:

    uvicorn main:app --reload

### Frontend Setup

Open a new terminal and run:

    cd frontend
    npm install
    npm run dev

Open http://localhost:5173 in your browser.

## 📁 Project Structure

    devmind-ai/
    ├── backend/
    │   ├── main.py
    │   ├── routes/
    │   │   ├── chat.py
    │   │   └── history.py
    │   ├── services/
    │   │   ├── gemini_service.py
    │   │   └── db_service.py
    │   ├── models/
    │   │   └── schemas.py
    │   ├── database/
    │   │   └── init_db.py
    │   └── requirements.txt
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── utils/
    │   │   └── assets/
    │   └── package.json
    └── README.md

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/chat | Send message to Gemini AI |
| POST | /api/analyze-image | Analyze image with Gemini Vision |
| GET | /api/sessions | Get all chat sessions |
| GET | /api/sessions/{id}/messages | Get messages for a session |
| DELETE | /api/sessions/{id} | Delete a session |

## 👤 Team

**Arjun Thimmaiah**
- CSE Student at PES College of Engineering, Mandya
- GitHub: [ArcticFox-71](https://github.com/ArcticFox-71)

## 📋 Submission Details

- **Event**: GDG on Campus BYOC Challenge
- **College**: PES College of Engineering, Mandya
- **AI Model**: Google Gemini 2.5 Flash
- **Frontend**: https://devmindai-chi.vercel.app
- **Backend**: https://devmind-ai-backend01.onrender.com
- **GitHub**: https://github.com/ArcticFox-71/devmind-ai