# db_service.py
# All database operations live here
# Clean separation — routes don't touch DB directly

import uuid
from datetime import datetime
from database.init_db import get_db

def create_session(title: str, mode: str) -> dict:
    """Creates a new chat session and returns it"""
    session_id = str(uuid.uuid4())  # Unique ID like: "a1b2-c3d4-..."
    created_at = datetime.now().isoformat()
    
    conn = get_db()
    conn.execute(
        "INSERT INTO sessions VALUES (?, ?, ?, ?)",
        (session_id, title, mode, created_at)
    )
    conn.commit()
    conn.close()
    
    return {
        "id": session_id,
        "title": title,
        "mode": mode,
        "created_at": created_at
    }

def get_all_sessions() -> list:
    """Returns all sessions ordered by newest first"""
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM sessions ORDER BY created_at DESC LIMIT 50"
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]

def delete_session(session_id: str):
    """Deletes a session and all its messages"""
    conn = get_db()
    # Delete messages first (foreign key relationship)
    conn.execute("DELETE FROM messages WHERE session_id = ?", (session_id,))
    conn.execute("DELETE FROM sessions WHERE id = ?", (session_id,))
    conn.commit()
    conn.close()

def get_session_messages(session_id: str) -> list:
    """Returns all messages for a session in order"""
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC",
        (session_id,)
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]

def save_message(session_id: str, role: str, content: str):
    """Saves a single message to the database"""
    conn = get_db()
    conn.execute(
        "INSERT INTO messages VALUES (?, ?, ?, ?, ?)",
        (str(uuid.uuid4()), session_id, role, content, datetime.now().isoformat())
    )
    conn.commit()
    conn.close()

def update_session_title(session_id: str, title: str):
    """Updates session title based on first message"""
    conn = get_db()
    conn.execute(
        "UPDATE sessions SET title = ? WHERE id = ?",
        (title, session_id)
    )
    conn.commit()
    conn.close()