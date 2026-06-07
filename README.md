# ⚡ DevMind AI

> An intelligent AI-powered coding assistant built for developers — powered by Google Gemini 2.5 Flash

![DevMind AI](https://devmindai-chi.vercel.app)

## 🌐 Live Demo
**[https://devmindai-chi.vercel.app](https://devmindai-chi.vercel.app)**

## 📖 Description
DevMind AI is a full-stack AI-powered developer chatbot built for the GDG on Campus — PES College of Engineering, Mandya BYOC Challenge. It helps developers debug code, generate code, explain algorithms, and answer coding questions using Google's Gemini 2.5 Flash API.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💬 **Chat Mode** | General coding questions and concepts |
| 🐛 **Debug Mode** | Paste broken code — get bug analysis + fixes |
| ⚡ **Generate Mode** | Describe what you want — get production-ready code |
| 📖 **Explain Mode** | Paste any code — get detailed explanation |
| 🎤 **Voice Input** | Speak your question using browser Speech API |
| 📎 **Image Upload** | Upload screenshots of code/errors for analysis |
| 🌍 **Multi-Language** | Support for 22+ programming languages |
| 💾 **Chat History** | All sessions saved with SQLite database |
| 🌙 **Dark/Light Theme** | Toggle between themes |
| 🔄 **Regenerate** | Regenerate any AI response |

## 🛠️ Tech Stack

### Frontend
- **React** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Axios** — HTTP client

### Backend
- **Python** — Core language
- **FastAPI** — REST API framework
- **SQLite** — Chat history database
- **Google Gemini 2.5 Flash** — AI model

### Deployment
- **Vercel** — Frontend hosting
- **Render** — Backend hosting

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Gemini API Key from [Google AI Studio](https://aistudio.google.com)

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Create `.env` file in backend folder: