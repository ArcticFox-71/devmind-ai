# init_db.py
# This file creates our SQLite database tables when the server starts
# Think of tables like Excel sheets — each row is one record

import sqlite3
import os

# Database file will be created here automatically
DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'devmind.db')

def init_db():
    """Creates all tables if they don't exist yet"""
    
    # connect() creates the .db file if it doesn't exist
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Sessions table — one row per conversation
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            title TEXT,
            mode TEXT DEFAULT 'chat',
            created_at TEXT
        )
    """)
    
    # Messages table — every single message stored here
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            session_id TEXT,
            role TEXT,
            content TEXT,
            created_at TEXT,
            FOREIGN KEY (session_id) REFERENCES sessions(id)
        )
    """)
    
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully!")

def get_db():
    """Returns a database connection — used by other files"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Makes rows behave like dictionaries
    return conn