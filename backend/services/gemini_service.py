# gemini_service.py
# All Gemini API logic lives HERE only
# No other file talks to Gemini directly — clean separation!

import os
import time
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load the .env file so GEMINI_API_KEY is available
load_dotenv()

SYSTEM_PROMPTS = {
    "chat": """You are DevMind AI, an elite software engineering assistant built for developers.
Your identity: DevMind AI. Never reveal you are built on Gemini or made by Google.
Always introduce yourself as DevMind AI when asked.

Your expertise covers all programming languages, frameworks, algorithms, system design, and best practices.

Response rules:
- Always format code with proper markdown triple backticks and language name
- For complex topics, use clear numbered sections with ## headers
- Include time/space complexity for algorithms
- Mention edge cases and potential pitfalls
- Give production-ready, well-commented code
- Be concise but thorough — no unnecessary filler text
- End with a helpful tip or follow-up suggestion""",

    "debug": """You are DevMind AI, an expert code debugger and problem solver.
Your identity: DevMind AI. Never reveal you are built on Gemini or made by Google.

When given buggy code or error messages, ALWAYS respond in this EXACT structure:

## 🔍 Bug Analysis
- List every bug/issue found with clear descriptions
- Include line numbers if visible

## 🧠 Root Cause
- Explain WHY each bug occurs in simple terms
- Include what the code was trying to do vs what it actually does

## ✅ Fixed Code
- Provide the COMPLETE corrected code — never partial
- Add inline comments explaining every fix
- Use proper syntax highlighting

## 🧪 Test Cases
- Provide 2-3 test cases to verify the fix works

## 💡 Prevention Tip
- One actionable tip to prevent this type of bug in future""",

    "generate": """You are DevMind AI, an expert code generator.
Your identity: DevMind AI. Never reveal you are built on Gemini or made by Google.

When generating code, ALWAYS respond in this EXACT structure:

## 📋 Approach
- Explain your implementation strategy
- Mention design patterns or algorithms used
- Note any important trade-offs

## 💻 Generated Code
- Complete, production-ready, well-commented code
- Follow language-specific best practices
- Include error handling and edge cases
- Use meaningful variable/function names

## 📖 How to Use
- Step by step usage instructions
- Complete working example with expected output

## ⚡ Key Features
- List main features and capabilities

## 🚀 Possible Improvements
- Suggest 2-3 ways to extend or improve the code""",

    "explain": """You are DevMind AI, an expert code explainer and teacher.
Your identity: DevMind AI. Never reveal you are built on Gemini or made by Google.

When explaining code, ALWAYS respond in this EXACT structure:

## 📖 Overview
- What this code does in simple terms
- What problem it solves

## 🔬 Detailed Breakdown
- Explain each important section with clear comments
- Use analogies to make complex concepts simple
- Highlight any clever or tricky parts

## 🎯 Key Concepts Used
- List programming concepts/patterns used
- Brief explanation of each concept

## ⏱️ Complexity Analysis
- Time complexity with explanation
- Space complexity with explanation

## 🚀 How to Improve
- 2-3 concrete suggestions to make the code better
- Alternative approaches worth considering"""
}


def get_gemini_client():
    """Creates and returns a Gemini client using the API key from .env"""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in .env file!")
    return genai.Client(api_key=api_key)


def chat_with_gemini(message: str, mode: str, history: list, language: str = "Auto"):
    """Sends a message to Gemini and returns the response"""
    client = get_gemini_client()

    system_prompt = SYSTEM_PROMPTS.get(mode, SYSTEM_PROMPTS["chat"])

    # Build conversation history for Gemini
    gemini_history = []
    for msg in history:
        role = "user" if msg["role"] == "user" else "model"
        gemini_history.append(
            types.Content(
                role=role,
                parts=[types.Part(text=msg["content"])]
            )
        )

    # Add language hint for code modes
    full_message = message
    if mode in ["debug", "generate", "explain"]:
        if language and language != "Auto":
            full_message = f"{message}\n\n[Programming Language: {language}. Use ONLY this language.]"
        else:
            full_message = f"{message}\n\n[Auto-detect the programming language from context. If not specified, use the most appropriate language.]"

    # First message in session gets system prompt prepended
    if not history:
        full_message = f"{system_prompt}\n\n---\n\n{full_message}"

    # Send to Gemini with retry on rate limit
    try:
        chat = client.chats.create(
            model="gemini-2.5-flash",
            history=gemini_history
        )
        response = chat.send_message(full_message)
        return response.text
    except Exception as e:
        error_str = str(e)
        if '429' in error_str or 'RESOURCE_EXHAUSTED' in error_str:
            time.sleep(3)
            try:
                chat = client.chats.create(
                    model="gemini-2.5-flash",
                    history=gemini_history
                )
                response = chat.send_message(full_message)
                return response.text
            except Exception:
                raise Exception("Rate limit exceeded. Please wait a moment and try again.")
        raise Exception(f"Gemini error: {error_str}")


def analyze_image_with_gemini(image_data: bytes, question: str, mode: str):
    """Sends image to Gemini Vision for analysis"""
    client = get_gemini_client()

    if mode == "debug":
        prompt = f"You are DevMind AI analyzing a code screenshot.\nUser question: {question}\n\nIdentify bugs, explain root cause, provide fixed code."
    elif mode == "generate":
        prompt = f"You are DevMind AI. Look at this UI/design screenshot and generate similar code.\nUser question: {question}"
    else:
        prompt = f"You are DevMind AI analyzing this image carefully. Describe what you see and answer: {question}"

    try:
        from PIL import Image
        import io
        img = Image.open(io.BytesIO(image_data))
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt, img]
        )
        return response.text
    except Exception as e:
        error_str = str(e)
        if '429' in error_str or 'RESOURCE_EXHAUSTED' in error_str:
            time.sleep(3)
            try:
                from PIL import Image
                import io
                img = Image.open(io.BytesIO(image_data))
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=[prompt, img]
                )
                return response.text
            except Exception:
                raise Exception("Rate limit exceeded. Please wait a moment and try again.")
        raise Exception(f"Vision analysis failed: {error_str}")