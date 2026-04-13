# 🤖 Agentic AI Full Stack Developer Course
## Chapter 8: Full Stack Agentic App — React + FastAPI + Python Agent

> **Professor's Note:** You've built the brain (LLMs), the memory (vector DBs), the planning engine (ToT/ReAct), and the multi-agent orchestra (workers + bus). Every piece has been a Python script you run in a terminal. That's great for learning — terrible for shipping. In this chapter, we wire everything into a production-grade full-stack application: a **React frontend** with a streaming chat UI, a **FastAPI backend** that hosts your agent, and **Server-Sent Events (SSE)** that stream tokens as they're generated — giving you that satisfying "words appearing live" effect your users love. By the end, you'll have a deployable agentic web app. Let's build something real. 🌐⚡

---

```
╔══════════════════════════════════════════════════════════════╗
║  📦 CHAPTER 8 AT A GLANCE                                   ║
╠══════════════════════════════════════════════════════════════╣
║  🏗️  Full-stack architecture — how all pieces connect       ║
║  ⚡  SSE vs WebSockets — when to use which                  ║
║  🐍  FastAPI backend — routes, streaming, agent integration  ║
║  ⚛️  React frontend — streaming chat UI from scratch        ║
║  🔄  Token streaming — live agent output in the browser     ║
║  🛠️  Tool-call visibility — show agent "thinking" in UI    ║
║  🔐  Auth, CORS, rate limiting — production hardening       ║
║  📝  Mini quiz — 5 questions                                 ║
║  👀  Chapter 9 preview — Deployment & DevOps               ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 📋 Table of Contents

1. [Architecture Overview — How It All Connects](#1-architecture-overview--how-it-all-connects)
2. [SSE vs WebSockets — Choosing Your Streaming Protocol](#2-sse-vs-websockets--choosing-your-streaming-protocol)
3. [FastAPI Backend — The Agent Server](#3-fastapi-backend--the-agent-server)
4. [Agent Integration — Streaming ReAct Engine](#4-agent-integration--streaming-react-engine)
5. [React Frontend — The Streaming Chat UI](#5-react-frontend--the-streaming-chat-ui)
6. [Tool-Call Visibility — "Thinking" in the UI](#6-tool-call-visibility--thinking-in-the-ui)
7. [Production Hardening — Auth, CORS, Rate Limiting](#7-production-hardening--auth-cors-rate-limiting)
8. [Running the Full Stack Locally](#8-running-the-full-stack-locally)
9. [Mini Quiz](#9-mini-quiz)
10. [Chapter 9 Preview](#10-chapter-9-preview)

---

## 1. Architecture Overview — How It All Connects

Before writing a single line, let's establish the full picture. You're a full-stack dev — you know how React + FastAPI work. What's *different* here is the streaming layer and the agent runtime.

```
FULL-STACK AGENTIC APP — COMPLETE ARCHITECTURE:
════════════════════════════════════════════════════════════════

  ┌─────────────────────────────────────────────────────────┐
  │                   BROWSER (React)                       │
  │                                                         │
  │  ┌────────────┐   ┌────────────┐   ┌─────────────────┐ │
  │  │  ChatInput │   │ MessageList│   │  ThinkingPanel  │ │
  │  │  Component │   │  Component │   │  (tool calls)   │ │
  │  └─────┬──────┘   └─────▲──────┘   └────────▲────────┘ │
  │        │                │                    │          │
  │        │                │ streaming tokens   │ events   │
  │        │           ┌────┴────────────────────┴───┐      │
  │        └──────────►│      useAgentStream()       │      │
  │     POST /chat     │      (custom hook)           │      │
  │                    │  EventSource + fetch SSE     │      │
  │                    └────────────┬────────────────-┘      │
  └─────────────────────────────────│────────────────────────┘
                                    │ HTTP / SSE Stream
  ┌─────────────────────────────────│────────────────────────┐
  │                   FASTAPI SERVER                        │
  │                                                         │
  │  ┌──────────────┐   ┌──────────┐   ┌─────────────────┐ │
  │  │  POST /chat  │   │  auth    │   │  rate limiter   │ │
  │  │  GET /stream │   │middleware│   │  middleware      │ │
  │  └──────┬───────┘   └──────────┘   └─────────────────┘ │
  │         │                                               │
  │  ┌──────▼──────────────────────────────────────────┐   │
  │  │              StreamingAgentRunner                │   │
  │  │                                                  │   │
  │  │  ┌──────────────┐    ┌───────────────────────┐  │   │
  │  │  │  ReActEngine │    │    Memory Manager     │  │   │
  │  │  │              │◄───┤  (Ch5 SQLite + Chroma)│  │   │
  │  │  └──────┬───────┘    └───────────────────────┘  │   │
  │  │         │ yields                                  │   │
  │  │         │ StreamEvent objects                     │   │
  │  └─────────│───────────────────────────────────────-┘   │
  └────────────│────────────────────────────────────────────┘
               │ SSE data: text/token/tool/done events
               │
  ┌────────────▼────────────────────────────────────────────┐
  │                    OpenAI API                           │
  │         (streaming=True → yields partial chunks)        │
  └─────────────────────────────────────────────────────────┘

  DATA FLOW (one user message):
  ─────────────────────────────────────────────────────────
  1. User types → React POSTs to /api/chat
  2. FastAPI creates StreamingAgentRunner
  3. Runner calls OpenAI with stream=True
  4. OpenAI yields token chunks
  5. Runner yields SSE events ("token", "tool_call", "done")
  6. FastAPI's StreamingResponse sends each event as SSE
  7. React's EventSource receives events in real-time
  8. React updates UI: tokens appended, tool calls shown
  9. "done" event triggers final state updates
```

### The Files We'll Build

```
PROJECT STRUCTURE:
════════════════════════════════════════════════════════════════

  agent-app/
  ├── backend/                    ← FastAPI Python app
  │   ├── main.py                 ← FastAPI app, routes, middleware
  │   ├── agent_runner.py         ← Streaming ReAct agent
  │   ├── stream_events.py        ← SSE event schema
  │   ├── memory_manager.py       ← Session memory (SQLite)
  │   ├── tools.py                ← Agent tools (search, calculate)
  │   ├── auth.py                 ← API key auth middleware
  │   └── requirements.txt
  │
  └── frontend/                   ← React (Vite) app
      ├── src/
      │   ├── App.jsx             ← Root component + routing
      │   ├── components/
      │   │   ├── ChatInput.jsx   ← Message input + send button
      │   │   ├── MessageList.jsx ← Scrolling message history
      │   │   ├── Message.jsx     ← Single message bubble
      │   │   └── ThinkingPanel.jsx ← Live tool-call visualizer
      │   ├── hooks/
      │   │   └── useAgentStream.js ← Core SSE streaming hook
      │   ├── api/
      │   │   └── agentApi.js     ← Backend API client
      │   └── index.css           ← Dark theme styles
      ├── package.json
      └── vite.config.js
```

---

## 2. SSE vs WebSockets — Choosing Your Streaming Protocol

Before writing the backend, let's settle the most common decision in streaming apps: **Server-Sent Events (SSE)** or **WebSockets**?

```
SSE vs WEBSOCKETS — THE DECISION TABLE:
════════════════════════════════════════════════════════════════

  ┌──────────────────┬───────────────────┬───────────────────┐
  │ Feature           │ SSE               │ WebSocket         │
  ├──────────────────┼───────────────────┼───────────────────┤
  │ Direction         │ Server → Client   │ Bidirectional     │
  │                   │ (one-way only)    │ (both ways)       │
  ├──────────────────┼───────────────────┼───────────────────┤
  │ Protocol          │ Plain HTTP        │ WS:// upgrade     │
  ├──────────────────┼───────────────────┼───────────────────┤
  │ Browser support   │ Native EventSource│ Native WebSocket  │
  ├──────────────────┼───────────────────┼───────────────────┤
  │ Auto-reconnect    │ ✅ Built-in       │ ❌ Manual code    │
  ├──────────────────┼───────────────────┼───────────────────┤
  │ Load balancer     │ ✅ Works fine     │ ⚠️ Needs sticky  │
  │ compatibility     │ (stateless HTTP)  │    sessions       │
  ├──────────────────┼───────────────────┼───────────────────┤
  │ Proxy/CDN support │ ✅ Excellent      │ ⚠️ Varies        │
  ├──────────────────┼───────────────────┼───────────────────┤
  │ Setup complexity  │ Low               │ Medium-High       │
  ├──────────────────┼───────────────────┼───────────────────┤
  │ Best for          │ Chat, logs, feeds │ Games, live collab│
  │                   │ AI streaming      │ cursor tracking   │
  └──────────────────┴───────────────────┴───────────────────┘

  FOR AI CHAT STREAMING: USE SSE ✅

  Why?
  - Agent only sends TO browser (tokens, events) — one-way is fine
  - User input is a regular POST request (not streaming from browser)
  - SSE works through Cloudflare, nginx, AWS ALB without special config
  - Zero reconnect code needed — EventSource handles it
  - Cleaner REST semantics: POST to start chat, GET to receive stream

  SSE FORMAT:
  ─────────────────────────────────────────────────────────
  Each event is plain text, looking like this:
  ┌──────────────────────────────────────────────────────┐
  │ event: token                                         │
  │ data: {"text": "The capital of France is "}          │
  │                                                      │
  │ event: token                                         │
  │ data: {"text": "Paris."}                             │
  │                                                      │
  │ event: tool_call                                     │
  │ data: {"tool": "web_search", "args": {"q": "Paris"}} │
  │                                                      │
  │ event: done                                          │
  │ data: {"total_tokens": 142, "elapsed_s": 3.2}        │
  └──────────────────────────────────────────────────────┘
  ← Each event is separated by a blank line.
  ← "data:" is the JSON payload.
  ← "event:" is the event type (listened to in JS).
```

---

## 3. FastAPI Backend — The Agent Server

Let's build the backend. FastAPI's `StreamingResponse` is perfect for SSE — it keeps the HTTP connection open and yields data as fast as the agent produces it.

```python
# =========================================================
# FILE: backend/stream_events.py
# Event schema for SSE — the contract between backend and frontend.
# Every event the server sends matches one of these types.
# pip install pydantic
# =========================================================

import json
from dataclasses import dataclass
from typing import Any, Optional
from enum import Enum


class EventType(str, Enum):
    """All possible SSE event types the agent can emit."""
    TOKEN      = "token"        # a chunk of the agent's text response
    TOOL_START = "tool_start"   # agent is about to call a tool
    TOOL_END   = "tool_end"     # tool call completed, here's the result
    THINKING   = "thinking"     # agent's internal reasoning (optional)
    ERROR      = "error"        # something went wrong
    DONE       = "done"         # stream complete, session stats
    PING       = "ping"         # keep-alive heartbeat (every 15s)


@dataclass
class StreamEvent:
    """
    A single server-sent event.
    Serializes to the exact SSE wire format (text/event-stream).

    SSE format spec:
      event: <type>\n
      data: <json>\n
      \n          ← blank line terminates the event

    Args:
        event_type: One of EventType enum values
        payload:    Dict payload (will be JSON-encoded in "data:")
        event_id:   Optional ID for EventSource's lastEventId
    """
    event_type: EventType
    payload:    dict
    event_id:   Optional[str] = None

    def to_sse_bytes(self) -> bytes:
        """
        Serialize this event to SSE wire format bytes.
        FastAPI's StreamingResponse yields this directly.

        Returns:
            UTF-8 encoded SSE string ready to send over HTTP.
        """
        lines = []

        if self.event_id:
            lines.append(f"id: {self.event_id}")

        lines.append(f"event: {self.event_type.value}")
        lines.append(f"data: {json.dumps(self.payload)}")
        lines.append("")   # blank line = event terminator

        return "\n".join(lines).encode("utf-8") + b"\n"

    # ── Factory methods ───────────────────────────────────

    @classmethod
    def token(cls, text: str, is_final: bool = False) -> "StreamEvent":
        """Emit a text token chunk."""
        return cls(EventType.TOKEN, {"text": text, "is_final": is_final})

    @classmethod
    def tool_start(cls, tool_name: str, args: dict) -> "StreamEvent":
        """Emit when agent starts calling a tool."""
        return cls(EventType.TOOL_START, {"tool": tool_name, "args": args})

    @classmethod
    def tool_end(cls, tool_name: str, result: str, elapsed_ms: int) -> "StreamEvent":
        """Emit when a tool call completes."""
        return cls(EventType.TOOL_END, {
            "tool":       tool_name,
            "result":     result[:300],   # truncate long results in UI
            "elapsed_ms": elapsed_ms,
        })

    @classmethod
    def thinking(cls, thought: str) -> "StreamEvent":
        """Emit agent's chain-of-thought (only if exposing reasoning)."""
        return cls(EventType.THINKING, {"thought": thought})

    @classmethod
    def error(cls, message: str, recoverable: bool = True) -> "StreamEvent":
        """Emit an error event."""
        return cls(EventType.ERROR, {"message": message, "recoverable": recoverable})

    @classmethod
    def done(cls, total_tokens: int, elapsed_s: float, tool_calls_made: int) -> "StreamEvent":
        """Emit the final completion event with session stats."""
        return cls(EventType.DONE, {
            "total_tokens":    total_tokens,
            "elapsed_s":       round(elapsed_s, 2),
            "tool_calls_made": tool_calls_made,
        })

    @classmethod
    def ping(cls) -> "StreamEvent":
        """Keep-alive heartbeat to prevent proxy timeouts."""
        return cls(EventType.PING, {"ts": __import__("time").time()})
```

```python
# =========================================================
# FILE: backend/tools.py
# Agent tools available in the full-stack app.
# Lightweight, safe, no credentials needed (except search).
# pip install requests wikipedia-api python-dotenv
# =========================================================

import time
import math
import json
import re
import requests
from datetime import datetime


def web_search(query: str, max_results: int = 4) -> str:
    """
    Search the web via DuckDuckGo (no API key required).

    Args:
        query:       Search query string
        max_results: Max number of results to return

    Returns:
        Formatted string of search results.
    """
    try:
        from bs4 import BeautifulSoup
        resp = requests.post(
            "https://html.duckduckgo.com/html/",
            data={"q": query},
            headers={"User-Agent": "Mozilla/5.0 Chrome/122.0"},
            timeout=12,
        )
        soup    = BeautifulSoup(resp.text, "html.parser")
        results = soup.find_all("div", class_="result__body", limit=max_results)

        if not results:
            return f"No results found for: '{query}'"

        lines = [f"Search results for '{query}':"]
        for i, r in enumerate(results, 1):
            title   = r.find("a", class_="result__a")
            snippet = r.find("a", class_="result__snippet")
            t = title.get_text(strip=True)   if title   else "No title"
            s = snippet.get_text(strip=True) if snippet else ""
            lines.append(f"[{i}] {t}\n    {s[:200]}")

        return "\n\n".join(lines)

    except Exception as e:
        return f"Search error: {type(e).__name__} — {e}"


def calculate(expression: str) -> str:
    """
    Safely evaluate a mathematical expression.
    Supports: +, -, *, /, **, sqrt, log, sin, cos, pi, e

    Args:
        expression: Math expression as string (e.g., "sqrt(144) + 2**8")

    Returns:
        Result as string, or error message.
    """
    # Whitelist safe names — never use bare eval() without this!
    safe_names = {
        "sqrt":  math.sqrt,
        "log":   math.log,
        "log10": math.log10,
        "sin":   math.sin,
        "cos":   math.cos,
        "tan":   math.tan,
        "pi":    math.pi,
        "e":     math.e,
        "abs":   abs,
        "round": round,
        "pow":   pow,
        "min":   min,
        "max":   max,
    }

    # Remove any characters not in the safe set
    clean = re.sub(r"[^0-9\+\-\*\/\.\(\)\s\_a-zA-Z,]", "", expression)

    try:
        result = eval(clean, {"__builtins__": {}}, safe_names)
        # ↑ __builtins__={} disables all built-in functions except our whitelist.
        # This prevents: eval("__import__('os').system('rm -rf /')")
        return f"{expression} = {result}"
    except Exception as e:
        return f"Calculation error: {e}"


def get_current_datetime(timezone: str = "UTC") -> str:
    """Get the current date and time."""
    now = datetime.utcnow()
    return f"Current UTC time: {now.strftime('%Y-%m-%d %H:%M:%S')} UTC"


def get_wikipedia_summary(topic: str, sentences: int = 3) -> str:
    """
    Get a Wikipedia summary for a topic.

    Args:
        topic:     Wikipedia page title or search term
        sentences: Number of summary sentences to return
    """
    try:
        import wikipediaapi
        wiki = wikipediaapi.Wikipedia("AgentApp/1.0 (contact@example.com)", "en")
        page = wiki.page(topic)
        if not page.exists():
            return f"No Wikipedia page found for '{topic}'."
        # Take first N sentences of the summary
        text = page.summary
        sentences_list = text.split(". ")[:sentences]
        return ". ".join(sentences_list) + "."
    except ImportError:
        # Fallback to REST API if library not installed
        try:
            url  = f"https://en.wikipedia.org/api/rest_v1/page/summary/{requests.utils.quote(topic)}"
            resp = requests.get(url, timeout=8)
            if resp.status_code == 200:
                data = resp.json()
                return data.get("extract", "")[:500]
            return f"Wikipedia lookup failed: HTTP {resp.status_code}"
        except Exception as e:
            return f"Wikipedia error: {e}"
    except Exception as e:
        return f"Wikipedia error: {e}"


# ── OpenAI Tool Schemas ────────────────────────────────────
# These describe each tool to the LLM in the format it expects.

TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name":        "web_search",
            "description": "Search the web for current information, news, facts, or recent events.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query":       {"type": "string",  "description": "Search query"},
                    "max_results": {"type": "integer", "description": "Max results (1-6)"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name":        "calculate",
            "description": "Evaluate mathematical expressions. Use for any arithmetic, algebra, or math.",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "Math expression, e.g. 'sqrt(144) + 2**8'"}
                },
                "required": ["expression"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name":        "get_current_datetime",
            "description": "Get the current date and time.",
            "parameters": {
                "type": "object",
                "properties": {
                    "timezone": {"type": "string", "description": "Timezone (default: UTC)"}
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name":        "get_wikipedia_summary",
            "description": "Get a factual summary about a topic from Wikipedia. Good for definitions and background.",
            "parameters": {
                "type": "object",
                "properties": {
                    "topic":     {"type": "string",  "description": "Topic to look up"},
                    "sentences": {"type": "integer", "description": "Number of sentences (1-5)"}
                },
                "required": ["topic"]
            }
        }
    }
]

TOOL_FN_MAP = {
    "web_search":           web_search,
    "calculate":            calculate,
    "get_current_datetime": get_current_datetime,
    "get_wikipedia_summary": get_wikipedia_summary,
}
```

```python
# =========================================================
# FILE: backend/memory_manager.py
# Per-session conversation memory for the API.
# Stores message history so agent remembers across API calls.
# pip install python-dotenv
# =========================================================

import sqlite3
import json
import time
from contextlib import contextmanager
from typing import Optional


class SessionMemory:
    """
    SQLite-backed session memory.
    Stores conversation history per session_id.
    In production: replace with Redis (faster, TTL support).

    Schema:
      sessions:  session_id, created_at, last_active
      messages:  id, session_id, role, content, tokens, ts
    """

    def __init__(self, db_path: str = "sessions.db", max_history: int = 20):
        self.db_path    = db_path
        self.max_history = max_history    # max messages to keep per session
        self._init_db()

    @contextmanager
    def _get_conn(self):
        """Context manager for safe SQLite connections."""
        conn = sqlite3.connect(self.db_path, check_same_thread=False)
        conn.execute("PRAGMA journal_mode=WAL")   # concurrent reads + writes
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def _init_db(self) -> None:
        """Create tables if they don't exist."""
        with self._get_conn() as conn:
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS sessions (
                    session_id   TEXT PRIMARY KEY,
                    created_at   REAL NOT NULL,
                    last_active  REAL NOT NULL,
                    metadata     TEXT DEFAULT '{}'
                );

                CREATE TABLE IF NOT EXISTS messages (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id  TEXT NOT NULL,
                    role        TEXT NOT NULL,
                    content     TEXT NOT NULL,
                    tokens      INTEGER DEFAULT 0,
                    ts          REAL NOT NULL,
                    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
                );

                CREATE INDEX IF NOT EXISTS idx_messages_session
                    ON messages(session_id, ts);
            """)

    def get_or_create_session(self, session_id: str) -> dict:
        """Get an existing session or create a new one."""
        now = time.time()
        with self._get_conn() as conn:
            row = conn.execute(
                "SELECT * FROM sessions WHERE session_id = ?", (session_id,)
            ).fetchone()

            if row:
                conn.execute(
                    "UPDATE sessions SET last_active = ? WHERE session_id = ?",
                    (now, session_id)
                )
                return dict(row)
            else:
                conn.execute(
                    "INSERT INTO sessions (session_id, created_at, last_active) VALUES (?, ?, ?)",
                    (session_id, now, now)
                )
                return {"session_id": session_id, "created_at": now, "last_active": now}

    def add_message(
        self,
        session_id: str,
        role:       str,
        content:    str,
        tokens:     int = 0,
    ) -> None:
        """
        Add a message to the session history.
        Automatically prunes old messages when max_history is exceeded.
        """
        now = time.time()
        with self._get_conn() as conn:
            conn.execute(
                "INSERT INTO messages (session_id, role, content, tokens, ts) VALUES (?, ?, ?, ?, ?)",
                (session_id, role, content, tokens, now)
            )
            # Prune: keep only the most recent max_history messages
            # This prevents unbounded memory growth in long sessions
            conn.execute("""
                DELETE FROM messages WHERE id IN (
                    SELECT id FROM messages
                    WHERE session_id = ?
                    ORDER BY ts DESC
                    LIMIT -1 OFFSET ?
                )
            """, (session_id, self.max_history))

    def get_history(self, session_id: str) -> list[dict]:
        """
        Get the conversation history for a session.
        Returns messages in chronological order (oldest first).
        This becomes the "messages" list sent to the LLM.
        """
        self.get_or_create_session(session_id)     # ensure session exists

        with self._get_conn() as conn:
            rows = conn.execute(
                "SELECT role, content FROM messages WHERE session_id = ? ORDER BY ts ASC",
                (session_id,)
            ).fetchall()

        return [{"role": row["role"], "content": row["content"]} for row in rows]

    def clear_session(self, session_id: str) -> None:
        """Delete all messages for a session (user clicked 'New Chat')."""
        with self._get_conn() as conn:
            conn.execute("DELETE FROM messages WHERE session_id = ?", (session_id,))
```

```python
# =========================================================
# FILE: backend/agent_runner.py
# The streaming ReAct agent — the core intelligence of the backend.
# Yields StreamEvent objects as it processes each user message.
# pip install openai python-dotenv
# =========================================================

import os
import json
import time
from typing import Generator, Optional
from openai import OpenAI
from dotenv import load_dotenv

from stream_events import StreamEvent, EventType
from tools import TOOL_SCHEMAS, TOOL_FN_MAP
from memory_manager import SessionMemory

load_dotenv()


SYSTEM_PROMPT = """You are a helpful, intelligent AI assistant with access to tools.

You can:
- Search the web for current information
- Perform mathematical calculations
- Look up information on Wikipedia
- Tell the current date and time

Guidelines:
- Be concise but thorough. Use bullet points for lists.
- When using tools, briefly mention what you're looking up.
- If you're unsure about something, say so honestly.
- Format code with markdown code blocks.
- Keep responses friendly and professional."""


class StreamingAgentRunner:
    """
    A streaming ReAct agent that yields SSE events as it processes.

    Unlike the Chapter 4 ReAct engine that returned a final string,
    this yields events in real-time:
    - token: each text chunk as it's generated
    - tool_start: when a tool call begins
    - tool_end: when a tool call completes with result
    - done: session complete with stats

    This makes the UI feel responsive even for slow operations.
    """

    def __init__(
        self,
        session_memory: SessionMemory,
        model:          str = "gpt-4o-mini",
        max_iterations: int = 8,
    ):
        self.memory         = session_memory
        self.model          = model
        self.max_iterations = max_iterations
        self.client         = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    def run(
        self,
        user_message: str,
        session_id:   str,
    ) -> Generator[StreamEvent, None, None]:
        """
        Process a user message and yield StreamEvents as they're produced.
        This is a Python generator function — it uses "yield" to stream events.

        Args:
            user_message: The user's latest input
            session_id:   Session identifier for memory lookup

        Yields:
            StreamEvent objects (converted to SSE in main.py)
        """
        start_time      = time.time()
        total_tokens    = 0
        tool_calls_made = 0
        full_response   = ""

        # ── Load conversation history ─────────────────────
        history = self.memory.get_history(session_id)

        # Add the new user message to history and memory
        history.append({"role": "user", "content": user_message})
        self.memory.add_message(session_id, "user", user_message)

        # Build the messages list with system prompt at top
        messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history

        # ── ReAct Loop ────────────────────────────────────
        for iteration in range(self.max_iterations):

            # ── Streaming LLM Call ────────────────────────
            # stream=True returns a generator of chunks instead of waiting
            # for the entire response. Each chunk has a partial delta.
            stream_response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=TOOL_SCHEMAS,
                tool_choice="auto",
                temperature=0.3,
                max_tokens=1500,
                stream=True,       # ← THE KEY: enables token-by-token streaming
            )

            # ── Collect streamed response ─────────────────
            # We need to accumulate the full delta to process tool calls.
            # But we ALSO yield token events as they arrive for the UI.
            collected_content    = ""
            collected_tool_calls = {}    # tool_call_index → {id, name, args}

            finish_reason = None

            for chunk in stream_response:
                # Each chunk is a ChatCompletionChunk object
                delta        = chunk.choices[0].delta
                finish_reason = chunk.choices[0].finish_reason

                # ── Handle text content chunks ────────────
                if delta.content:
                    # This is a text token — yield it immediately for live display
                    collected_content += delta.content
                    full_response     += delta.content
                    yield StreamEvent.token(delta.content)

                # ── Handle tool call chunks ───────────────
                # Tool calls arrive in pieces: name in one chunk, args in several
                # We accumulate them in collected_tool_calls dict
                if delta.tool_calls:
                    for tc_delta in delta.tool_calls:
                        idx = tc_delta.index     # which tool call (0, 1, 2...)

                        if idx not in collected_tool_calls:
                            # First chunk for this tool call — initialize
                            collected_tool_calls[idx] = {
                                "id":   tc_delta.id or "",
                                "name": tc_delta.function.name or "",
                                "args": "",
                            }
                        else:
                            # Subsequent chunks — append
                            if tc_delta.id:
                                collected_tool_calls[idx]["id"] = tc_delta.id
                            if tc_delta.function and tc_delta.function.name:
                                collected_tool_calls[idx]["name"] += tc_delta.function.name
                            if tc_delta.function and tc_delta.function.arguments:
                                collected_tool_calls[idx]["args"] += tc_delta.function.arguments

                if finish_reason in ("stop", "tool_calls", "length"):
                    break

            # ── Process finish reason ─────────────────────

            if finish_reason == "stop":
                # Agent is done — no more tool calls
                total_tokens += len(collected_content.split()) * 1.3   # rough estimate

                # Save full assistant response to memory
                if collected_content:
                    self.memory.add_message(session_id, "assistant", collected_content)

                # Send the final done event
                yield StreamEvent.done(
                    total_tokens=int(total_tokens),
                    elapsed_s=time.time() - start_time,
                    tool_calls_made=tool_calls_made,
                )
                return   # exit the generator

            elif finish_reason == "tool_calls":
                # Agent wants to call tools — execute them and continue loop

                # First, add the assistant's response (with tool calls) to messages
                assistant_msg = {
                    "role":       "assistant",
                    "content":    collected_content or None,
                    "tool_calls": [
                        {
                            "id":   tc["id"],
                            "type": "function",
                            "function": {
                                "name":      tc["name"],
                                "arguments": tc["args"]
                            }
                        }
                        for tc in collected_tool_calls.values()
                    ]
                }
                messages.append(assistant_msg)

                # Execute each tool call and yield events
                for tc in collected_tool_calls.values():
                    tool_name = tc["name"]
                    try:
                        tool_args = json.loads(tc["args"]) if tc["args"].strip() else {}
                    except json.JSONDecodeError:
                        tool_args = {}

                    # Yield tool_start so UI can show "🔍 Searching..."
                    yield StreamEvent.tool_start(tool_name, tool_args)

                    # Execute the actual tool
                    tool_start_time = time.time()
                    fn              = TOOL_FN_MAP.get(tool_name)
                    if fn:
                        try:
                            result = str(fn(**tool_args))
                        except Exception as e:
                            result = f"Tool error: {e}"
                    else:
                        result = f"Unknown tool: {tool_name}"

                    elapsed_ms = int((time.time() - tool_start_time) * 1000)
                    tool_calls_made += 1

                    # Yield tool_end so UI can show the result
                    yield StreamEvent.tool_end(tool_name, result, elapsed_ms)

                    # Add the tool result to messages so LLM sees it
                    messages.append({
                        "role":         "tool",
                        "tool_call_id": tc["id"],
                        "content":      result,
                    })

                # Continue the loop — LLM will process tool results
                continue

            elif finish_reason == "length":
                # Hit max_tokens — emit what we have and stop
                yield StreamEvent.error(
                    "Response truncated — try a shorter question.",
                    recoverable=True
                )
                yield StreamEvent.done(int(total_tokens), time.time() - start_time, tool_calls_made)
                return

        # If we exhausted max_iterations without a "stop"
        yield StreamEvent.error("Agent reached max iterations. Please try again.", recoverable=True)
        yield StreamEvent.done(int(total_tokens), time.time() - start_time, tool_calls_made)
```

```python
# =========================================================
# FILE: backend/main.py
# FastAPI application — routes, middleware, SSE streaming.
# pip install fastapi uvicorn python-multipart python-dotenv
# =========================================================

import os
import uuid
import json
import asyncio
from contextlib import asynccontextmanager
from typing import Optional, AsyncGenerator

from fastapi import FastAPI, HTTPException, Header, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field

from agent_runner import StreamingAgentRunner
from memory_manager import SessionMemory
from stream_events import StreamEvent, EventType


# ══════════════════════════════════════════════════════════
# APP SETUP
# ══════════════════════════════════════════════════════════

# Lifespan context manager: runs setup/teardown on app start/stop
@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP: initialize shared resources
    app.state.memory = SessionMemory(db_path="sessions.db", max_history=30)
    print("✅ Session memory initialized")
    yield
    # SHUTDOWN: nothing to clean up for SQLite


app = FastAPI(
    title="Agentic AI API",
    description="Streaming AI agent backend with ReAct + tools",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS: Allow React dev server to call us ───────────────
# In production: replace "*" with your actual frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",    # Vite dev server
        "http://localhost:3000",    # CRA dev server
        "https://yourdomain.com",   # Production (add your domain)
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# ══════════════════════════════════════════════════════════
# REQUEST/RESPONSE MODELS
# ══════════════════════════════════════════════════════════

class ChatRequest(BaseModel):
    """Request body for POST /api/chat"""
    message:    str = Field(..., min_length=1, max_length=4000,
                            description="The user's message")
    session_id: Optional[str] = Field(
        default=None,
        description="Session ID for conversation continuity. Auto-generated if omitted."
    )

class SessionInfo(BaseModel):
    """Response from session info endpoint"""
    session_id:    str
    message_count: int


# ══════════════════════════════════════════════════════════
# SSE STREAMING GENERATOR
# ══════════════════════════════════════════════════════════

async def generate_sse_stream(
    message:    str,
    session_id: str,
    memory:     SessionMemory,
) -> AsyncGenerator[bytes, None]:
    """
    Async generator that yields SSE-formatted bytes.
    FastAPI's StreamingResponse calls this and sends each yielded
    value immediately over the open HTTP connection.

    This is the bridge between the sync agent generator
    and FastAPI's async streaming response.

    Args:
        message:    User message to process
        session_id: Session identifier
        memory:     Session memory instance

    Yields:
        bytes: SSE-formatted event data
    """
    runner = StreamingAgentRunner(session_memory=memory, model="gpt-4o-mini")

    # Send an initial ping so the browser knows the stream started
    yield StreamEvent.ping().to_sse_bytes()

    try:
        # run() is a synchronous generator — we run it in a thread
        # to avoid blocking the async event loop.
        # asyncio.to_thread wraps a sync call in a thread pool executor.
        loop = asyncio.get_event_loop()

        # We use a queue to bridge the sync generator with async streaming
        # This pattern is the cleanest way to stream from sync code in FastAPI
        queue: asyncio.Queue[Optional[StreamEvent]] = asyncio.Queue()

        def run_agent_in_thread():
            """Run the synchronous agent generator in a background thread."""
            try:
                for event in runner.run(message, session_id):
                    # put_nowait can fail if queue is full — use loop.call_soon_threadsafe
                    loop.call_soon_threadsafe(queue.put_nowait, event)
            except Exception as e:
                error_event = StreamEvent.error(str(e), recoverable=False)
                loop.call_soon_threadsafe(queue.put_nowait, error_event)
            finally:
                # Signal that the generator is done
                loop.call_soon_threadsafe(queue.put_nowait, None)

        # Start the agent in a background thread
        import threading
        thread = threading.Thread(target=run_agent_in_thread, daemon=True)
        thread.start()

        # Read events from the queue and yield them
        while True:
            event = await queue.get()
            if event is None:
                break    # generator finished
            yield event.to_sse_bytes()

            # If this was the DONE event, we can stop
            if event.event_type == EventType.DONE:
                break

    except asyncio.CancelledError:
        # User disconnected (closed browser tab) — stop gracefully
        print(f"  [SSE] Client disconnected: session={session_id}")
    except Exception as e:
        yield StreamEvent.error(f"Internal error: {e}", recoverable=False).to_sse_bytes()


# ══════════════════════════════════════════════════════════
# API ROUTES
# ══════════════════════════════════════════════════════════

@app.post("/api/chat")
async def chat(
    request: ChatRequest,
    req:     Request,
) -> StreamingResponse:
    """
    Main chat endpoint — starts the streaming agent.

    POST /api/chat
    Body: {"message": "...", "session_id": "optional-uuid"}

    Returns: text/event-stream (SSE)

    The response is a streaming HTTP connection that stays open
    and pushes events as the agent processes them.
    """
    # Auto-generate session ID if not provided
    session_id = request.session_id or str(uuid.uuid4())
    memory     = req.app.state.memory

    # Ensure session exists in memory
    memory.get_or_create_session(session_id)

    return StreamingResponse(
        generate_sse_stream(
            message=request.message,
            session_id=session_id,
            memory=memory,
        ),
        media_type="text/event-stream",
        # These headers are CRITICAL for SSE to work properly:
        headers={
            "Cache-Control":    "no-cache",          # never cache SSE
            "X-Accel-Buffering": "no",               # disable nginx buffering
            "Connection":       "keep-alive",         # keep the connection open
            "X-Session-Id":     session_id,           # client reads this for continuity
        }
    )


@app.delete("/api/sessions/{session_id}")
async def clear_session(session_id: str, req: Request) -> JSONResponse:
    """
    Clear a session's conversation history.
    Called when user clicks "New Chat" in the UI.
    """
    req.app.state.memory.clear_session(session_id)
    return JSONResponse({"ok": True, "session_id": session_id})


@app.get("/api/sessions/{session_id}/history")
async def get_history(session_id: str, req: Request) -> JSONResponse:
    """
    Get the conversation history for a session.
    Used to restore the UI when user refreshes the page.
    """
    history = req.app.state.memory.get_history(session_id)
    return JSONResponse({"session_id": session_id, "messages": history})


@app.get("/api/health")
async def health_check() -> JSONResponse:
    """Health check endpoint — used by load balancers and monitoring."""
    return JSONResponse({"status": "ok", "version": "1.0.0"})


@app.get("/")
async def root() -> JSONResponse:
    return JSONResponse({"message": "Agentic AI API", "docs": "/docs"})


# ── Launch command ────────────────────────────────────────
# uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

```ini
# =========================================================
# FILE: backend/requirements.txt
# =========================================================
fastapi>=0.111.0
uvicorn[standard]>=0.29.0
openai>=1.30.0
python-dotenv>=1.0.0
python-multipart>=0.0.9
pydantic>=2.7.0
requests>=2.31.0
beautifulsoup4>=4.12.0
wikipedia-api>=0.6.0
```

---

## 4. Agent Integration — Streaming ReAct Engine

Let's see the streaming engine's token chunk handling under the microscope, because this is where most developers get confused.

```
HOW STREAMING TOKEN CHUNKS WORK:
════════════════════════════════════════════════════════════════

  OpenAI stream=True returns a generator of ChatCompletionChunk objects.
  Each chunk has a "delta" — the NEW content added in this chunk.

  For a text response "Hello, world!":
  ─────────────────────────────────────────────────────────
  Chunk 1: delta.content = "Hello"
  Chunk 2: delta.content = ","
  Chunk 3: delta.content = " world"
  Chunk 4: delta.content = "!"
  Chunk 5: finish_reason = "stop"

  For a tool call:
  ─────────────────────────────────────────────────────────
  Chunk 1: delta.tool_calls[0].function.name = "web_se"
  Chunk 2: delta.tool_calls[0].function.name = "arch"     ← incremental!
  Chunk 3: delta.tool_calls[0].function.arguments = '{"q'
  Chunk 4: delta.tool_calls[0].function.arguments = 'uery'
  Chunk 5: delta.tool_calls[0].function.arguments = '": "Python"}'
  Chunk 6: finish_reason = "tool_calls"

  ← Note: tool call name and args also arrive incrementally!
  ← That's why we accumulate them in collected_tool_calls dict.
  ← Only yield tool_start AFTER finish_reason="tool_calls" confirmed.

  COMMON BUG: yielding tool_start on the FIRST chunk of tool name
  → "web_se" shows in UI → looks broken.
  CORRECT: wait for finish_reason="tool_calls", THEN emit tool_start.
```

---

## 5. React Frontend — The Streaming Chat UI

Now the fun part. Let's build the React frontend from scratch. No UI library — pure JSX with CSS. This gives you full control and clarity.

```bash
# Set up the React project with Vite
# Run from agent-app/ directory:
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

```javascript
// =========================================================
// FILE: frontend/src/api/agentApi.js
// Backend API client — the layer between React and FastAPI.
// All API calls go through here. No fetch() calls in components.
// =========================================================

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";


/**
 * chatStream — initiates a streaming chat request.
 *
 * How SSE + POST works together (non-obvious pattern):
 * 1. POST the message to /api/chat (includes body — GET can't)
 * 2. Receive the session_id from response headers
 * 3. Use the response body as a ReadableStream (SSE stream)
 *
 * We DON'T use EventSource because EventSource only supports GET requests.
 * Instead, we use fetch() with ReadableStream, which supports POST + body.
 *
 * @param {string} message      - User's message text
 * @param {string|null} sessionId - Session ID (null for new session)
 * @param {Object} callbacks    - Event handlers
 * @param {Function} callbacks.onToken     - Called for each text token
 * @param {Function} callbacks.onToolStart - Called when tool call starts
 * @param {Function} callbacks.onToolEnd   - Called when tool call ends
 * @param {Function} callbacks.onDone      - Called when stream completes
 * @param {Function} callbacks.onError     - Called on error
 * @returns {Promise<string>} - The session ID (new or existing)
 */
export async function chatStream(message, sessionId, callbacks) {
  const { onToken, onToolStart, onToolEnd, onDone, onError } = callbacks;

  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        session_id: sessionId || undefined,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Get the session ID from response headers (set by FastAPI)
    const newSessionId = response.headers.get("X-Session-Id") || sessionId;

    // Read the response as a streaming text stream
    const reader  = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let   buffer  = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      // Decode the chunk and add to buffer
      // Why buffer? Because a single "read" may contain partial events,
      // or multiple events. We buffer and split on the SSE event delimiter.
      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by double newline (\n\n)
      const events = buffer.split("\n\n");
      // Keep the last incomplete event in the buffer
      buffer = events.pop();

      // Process each complete event
      for (const eventText of events) {
        if (!eventText.trim()) continue;

        // Parse the SSE event
        // Format:
        //   event: token
        //   data: {"text": "Hello"}
        const parsed = parseSSEEvent(eventText);
        if (!parsed) continue;

        const { eventType, data } = parsed;

        switch (eventType) {
          case "token":
            onToken?.(data.text, data.is_final);
            break;
          case "tool_start":
            onToolStart?.(data.tool, data.args);
            break;
          case "tool_end":
            onToolEnd?.(data.tool, data.result, data.elapsed_ms);
            break;
          case "done":
            onDone?.(data);
            break;
          case "error":
            onError?.(data.message, data.recoverable);
            break;
          case "ping":
            // Keep-alive, ignore
            break;
          default:
            console.debug("Unknown SSE event type:", eventType);
        }
      }
    }

    return newSessionId;

  } catch (err) {
    onError?.(err.message, false);
    throw err;
  }
}


/**
 * parseSSEEvent — parse a raw SSE event text block.
 *
 * @param {string} raw - Raw event text (multiple "key: value" lines)
 * @returns {{ eventType: string, data: Object } | null}
 */
function parseSSEEvent(raw) {
  const lines     = raw.split("\n");
  let   eventType = "message";   // default SSE type if no "event:" line
  let   dataStr   = "";

  for (const line of lines) {
    if (line.startsWith("event: ")) {
      eventType = line.slice(7).trim();
    } else if (line.startsWith("data: ")) {
      dataStr = line.slice(6).trim();
    }
  }

  if (!dataStr) return null;

  try {
    return { eventType, data: JSON.parse(dataStr) };
  } catch {
    return { eventType, data: { raw: dataStr } };
  }
}


/**
 * clearSession — deletes a session's conversation history.
 *
 * @param {string} sessionId - Session to clear
 */
export async function clearSession(sessionId) {
  if (!sessionId) return;
  await fetch(`${API_BASE}/api/sessions/${sessionId}`, { method: "DELETE" });
}


/**
 * getHistory — fetches conversation history for a session.
 * Used to restore UI state on page refresh.
 *
 * @param {string} sessionId
 * @returns {Promise<Array>} Array of {role, content} message objects
 */
export async function getHistory(sessionId) {
  if (!sessionId) return [];
  const res  = await fetch(`${API_BASE}/api/sessions/${sessionId}/history`);
  const data = await res.json();
  return data.messages || [];
}
```

```javascript
// =========================================================
// FILE: frontend/src/hooks/useAgentStream.js
// The core React hook for streaming agent communication.
// Manages: streaming state, message list, tool call events.
// =========================================================

import { useState, useCallback, useRef } from "react";
import { chatStream, clearSession } from "../api/agentApi";


/**
 * useAgentStream — custom hook for streaming agent chat.
 *
 * Manages all the state complexity of streaming:
 * - Appending tokens to the current assistant message character by character
 * - Tracking active tool calls for the ThinkingPanel
 * - Error handling and stream aborting
 *
 * Usage:
 *   const { messages, send, isStreaming, toolEvents, ... } = useAgentStream();
 *
 * @returns {Object} Hook state and actions
 */
export function useAgentStream() {
  // messages: the full conversation history for display
  // Each message: { id, role, content, isStreaming, toolCalls }
  const [messages,    setMessages]    = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [toolEvents,  setToolEvents]  = useState([]);   // active tool calls
  const [error,       setError]       = useState(null);

  // sessionId persists across messages (same conversation)
  const sessionIdRef = useRef(null);
  // streamingMsgId: the ID of the message currently being streamed
  const streamingMsgIdRef = useRef(null);

  /**
   * addMessage — add a new message to the conversation.
   * Returns the new message's ID (used to update it while streaming).
   */
  const addMessage = useCallback((role, content, extra = {}) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setMessages(prev => [...prev, { id, role, content, ...extra }]);
    return id;
  }, []);

  /**
   * appendToken — append a token to the currently streaming message.
   * This is called dozens of times per second during streaming.
   * Critical: must be fast — no heavy operations.
   */
  const appendToken = useCallback((token) => {
    const targetId = streamingMsgIdRef.current;
    if (!targetId) return;

    setMessages(prev =>
      prev.map(msg =>
        msg.id === targetId
          ? { ...msg, content: msg.content + token, isStreaming: true }
          : msg
      )
    );
  }, []);

  /**
   * finalizeMessage — mark the streaming message as complete.
   */
  const finalizeMessage = useCallback(() => {
    const targetId = streamingMsgIdRef.current;
    if (!targetId) return;

    setMessages(prev =>
      prev.map(msg =>
        msg.id === targetId
          ? { ...msg, isStreaming: false }
          : msg
      )
    );
    streamingMsgIdRef.current = null;
  }, []);

  /**
   * send — the main action. Sends a message and starts streaming.
   *
   * @param {string} userText - The user's message
   */
  const send = useCallback(async (userText) => {
    if (!userText.trim() || isStreaming) return;

    setError(null);
    setToolEvents([]);
    setIsStreaming(true);

    // Add user message to the conversation
    addMessage("user", userText);

    // Add an empty assistant message that we'll fill via streaming
    const assistantMsgId = addMessage("assistant", "", {
      isStreaming: true,
      toolCalls:  [],
    });
    streamingMsgIdRef.current = assistantMsgId;

    try {
      const newSessionId = await chatStream(
        userText,
        sessionIdRef.current,
        {
          onToken: (text) => {
            appendToken(text);
          },

          onToolStart: (toolName, args) => {
            // Add a new active tool call to the ThinkingPanel
            setToolEvents(prev => [...prev, {
              id:       `tc-${Date.now()}`,
              tool:     toolName,
              args,
              status:   "running",
              result:   null,
              elapsed:  null,
            }]);
          },

          onToolEnd: (toolName, result, elapsedMs) => {
            // Mark the most recent matching tool call as done
            setToolEvents(prev =>
              prev.map((tc, i) =>
                i === prev.length - 1 && tc.tool === toolName
                  ? { ...tc, status: "done", result, elapsed: elapsedMs }
                  : tc
              )
            );
          },

          onDone: (stats) => {
            finalizeMessage();
            setIsStreaming(false);
            // Could display stats: total_tokens, elapsed_s, tool_calls_made
            console.debug("Stream complete:", stats);
          },

          onError: (message, recoverable) => {
            setError({ message, recoverable });
            finalizeMessage();
            setIsStreaming(false);
          },
        }
      );

      // Persist the session ID for the next message in this conversation
      if (newSessionId) {
        sessionIdRef.current = newSessionId;
      }

    } catch (err) {
      setError({ message: err.message, recoverable: false });
      finalizeMessage();
      setIsStreaming(false);
    }
  }, [isStreaming, addMessage, appendToken, finalizeMessage]);

  /**
   * newChat — clear the conversation and start fresh.
   */
  const newChat = useCallback(async () => {
    if (sessionIdRef.current) {
      await clearSession(sessionIdRef.current);
    }
    sessionIdRef.current        = null;
    streamingMsgIdRef.current   = null;
    setMessages([]);
    setToolEvents([]);
    setError(null);
    setIsStreaming(false);
  }, []);

  return {
    messages,
    isStreaming,
    toolEvents,
    error,
    sessionId: sessionIdRef.current,
    send,
    newChat,
  };
}
```

```jsx
// =========================================================
// FILE: frontend/src/components/Message.jsx
// Single message bubble — renders user or assistant messages.
// Handles: markdown-like formatting, streaming cursor, code blocks.
// =========================================================

import React from "react";

/**
 * Message — renders a single chat message bubble.
 *
 * Props:
 *   role:        "user" | "assistant"
 *   content:     string (message text, may include markdown)
 *   isStreaming: bool (show blinking cursor if true)
 */
export function Message({ role, content, isStreaming }) {
  const isUser      = role === "user";
  const displayText = content || (isStreaming ? "" : "...");

  return (
    <div className={`message ${isUser ? "message--user" : "message--assistant"}`}>
      {/* Role avatar */}
      <div className="message__avatar">
        {isUser ? "👤" : "🤖"}
      </div>

      {/* Message bubble */}
      <div className="message__bubble">
        <div className="message__role">
          {isUser ? "You" : "Agent"}
        </div>

        {/* Content with basic markdown rendering */}
        <div className="message__content">
          <FormattedContent text={displayText} />
          {/* Blinking cursor shown while the message is still streaming */}
          {isStreaming && <span className="streaming-cursor" aria-label="typing" />}
        </div>
      </div>
    </div>
  );
}


/**
 * FormattedContent — simple inline markdown renderer.
 * Handles: code blocks, inline code, bold, line breaks.
 * (In production: use react-markdown for full CommonMark support)
 */
function FormattedContent({ text }) {
  if (!text) return null;

  // Split on code blocks first (``` ... ```)
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          // Code block
          const inner    = part.slice(3, -3);
          const newline  = inner.indexOf("\n");
          const lang     = newline > 0 ? inner.slice(0, newline).trim() : "";
          const code     = newline > 0 ? inner.slice(newline + 1) : inner;
          return (
            <pre key={i} className="code-block">
              {lang && <span className="code-block__lang">{lang}</span>}
              <code>{code}</code>
            </pre>
          );
        }

        // Inline formatting
        return (
          <span key={i}>
            {part.split(/(`[^`]+`|\*\*[^*]+\*\*|\n)/g).map((sub, j) => {
              if (sub.startsWith("`") && sub.endsWith("`")) {
                return <code key={j} className="inline-code">{sub.slice(1, -1)}</code>;
              }
              if (sub.startsWith("**") && sub.endsWith("**")) {
                return <strong key={j}>{sub.slice(2, -2)}</strong>;
              }
              if (sub === "\n") {
                return <br key={j} />;
              }
              return sub;
            })}
          </span>
        );
      })}
    </>
  );
}
```

```jsx
// =========================================================
// FILE: frontend/src/components/ThinkingPanel.jsx
// Shows the agent's tool calls in real-time.
// The "thinking" visualization — users can see WHAT the agent is doing.
// This is the differentiator vs. a vanilla chatbot.
// =========================================================

import React from "react";

/**
 * ThinkingPanel — live tool-call visualizer component.
 *
 * Shows when the agent is:
 * - 🔍 Searching the web (in progress)
 * - ✅ Got search results (completed)
 * - 🔢 Running a calculation
 *
 * Props:
 *   toolEvents: Array of tool call event objects:
 *     { id, tool, args, status: "running"|"done", result, elapsed }
 *   isVisible:  boolean (show/hide the panel)
 */
export function ThinkingPanel({ toolEvents, isVisible }) {
  if (!isVisible || toolEvents.length === 0) return null;

  return (
    <div className="thinking-panel" role="status" aria-label="Agent actions">
      <div className="thinking-panel__header">
        <span className="thinking-panel__icon">⚙️</span>
        <span className="thinking-panel__title">Agent Actions</span>
      </div>

      <div className="thinking-panel__events">
        {toolEvents.map((event) => (
          <ToolCallRow key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}


/**
 * ToolCallRow — one tool call's status row.
 */
function ToolCallRow({ event }) {
  const isRunning = event.status === "running";

  const toolIcons = {
    web_search:            "🔍",
    calculate:             "🔢",
    get_current_datetime:  "🕒",
    get_wikipedia_summary: "📚",
  };

  const toolLabels = {
    web_search:            "Web Search",
    calculate:             "Calculate",
    get_current_datetime:  "Get Time",
    get_wikipedia_summary: "Wikipedia",
  };

  const icon  = toolIcons[event.tool]  || "🛠️";
  const label = toolLabels[event.tool] || event.tool;

  // Format args for display
  const argsDisplay = Object.values(event.args || {})[0] || "";

  return (
    <div className={`tool-call ${isRunning ? "tool-call--running" : "tool-call--done"}`}>
      <div className="tool-call__header">
        <span className="tool-call__icon">{icon}</span>
        <span className="tool-call__name">{label}</span>
        {argsDisplay && (
          <span className="tool-call__args">
            "{String(argsDisplay).slice(0, 50)}"
          </span>
        )}
        <span className="tool-call__status">
          {isRunning
            ? <span className="spinner" aria-hidden="true" />
            : <span className="check">✓ {event.elapsed}ms</span>
          }
        </span>
      </div>

      {/* Show result when done */}
      {!isRunning && event.result && (
        <div className="tool-call__result">
          {String(event.result).slice(0, 120)}
          {event.result.length > 120 ? "..." : ""}
        </div>
      )}
    </div>
  );
}
```

```jsx
// =========================================================
// FILE: frontend/src/components/ChatInput.jsx
// The message input box — handles typing, sending, keyboard shortcuts.
// =========================================================

import React, { useRef, useEffect } from "react";

/**
 * ChatInput — message input component.
 *
 * Props:
 *   onSend:      Function(text) — called when user submits
 *   isStreaming: bool — disables input while agent is responding
 *   placeholder: string
 */
export function ChatInput({ onSend, isStreaming, placeholder = "Ask me anything..." }) {
  const textareaRef = useRef(null);

  // Auto-focus when streaming stops (ready for next message)
  useEffect(() => {
    if (!isStreaming) {
      textareaRef.current?.focus();
    }
  }, [isStreaming]);

  const handleSubmit = () => {
    const text = textareaRef.current?.value?.trim();
    if (!text || isStreaming) return;
    onSend(text);
    textareaRef.current.value = "";
    // Reset height after clearing
    textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    // New line on Shift+Enter (standard chat convention)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e) => {
    // Auto-resize the textarea as user types
    const el    = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
    // ↑ Cap height at 200px — beyond that, it scrolls
  };

  return (
    <div className="chat-input">
      <textarea
        ref={textareaRef}
        className="chat-input__field"
        placeholder={isStreaming ? "Agent is thinking..." : placeholder}
        disabled={isStreaming}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        rows={1}
        aria-label="Message input"
        id="chat-message-input"
      />
      <button
        className={`chat-input__send ${isStreaming ? "chat-input__send--disabled" : ""}`}
        onClick={handleSubmit}
        disabled={isStreaming}
        aria-label="Send message"
        id="chat-send-button"
      >
        {isStreaming ? (
          <span className="button-spinner" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )}
      </button>
    </div>
  );
}
```

```jsx
// =========================================================
// FILE: frontend/src/App.jsx
// Root application component — puts it all together.
// =========================================================

import React, { useEffect, useRef } from "react";
import { Message }       from "./components/Message";
import { ChatInput }     from "./components/ChatInput";
import { ThinkingPanel } from "./components/ThinkingPanel";
import { useAgentStream } from "./hooks/useAgentStream";
import "./index.css";

export default function App() {
  const {
    messages,
    isStreaming,
    toolEvents,
    error,
    send,
    newChat,
  } = useAgentStream();

  // Auto-scroll to bottom when new messages/tokens arrive
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="app">
      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">⚡</span>
          <span className="sidebar__logo-text">AgentChat</span>
        </div>

        <button
          className="sidebar__new-chat"
          onClick={newChat}
          disabled={isStreaming}
          id="new-chat-button"
        >
          + New Chat
        </button>

        <div className="sidebar__info">
          <h3>Tools Available</h3>
          <ul>
            <li>🔍 Web Search</li>
            <li>🔢 Calculator</li>
            <li>📚 Wikipedia</li>
            <li>🕒 Date & Time</li>
          </ul>
        </div>

        <div className="sidebar__footer">
          <span>Powered by GPT-4o-mini</span>
        </div>
      </aside>

      {/* ── Main Chat Area ────────────────────────────── */}
      <main className="chat-area">
        {/* Messages */}
        <div className="messages-container" id="messages-container">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            messages.map((msg) => (
              <Message
                key={msg.id}
                role={msg.role}
                content={msg.content}
                isStreaming={msg.isStreaming}
              />
            ))
          )}

          {/* Tool calls panel — shown while streaming */}
          <ThinkingPanel
            toolEvents={toolEvents}
            isVisible={isStreaming || toolEvents.some(t => t.status === "running")}
          />

          {/* Error display */}
          {error && (
            <div className="error-banner" role="alert">
              ⚠️ {error.message}
              {error.recoverable && " — Please try again."}
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="input-area">
          <ChatInput
            onSend={send}
            isStreaming={isStreaming}
          />
          <p className="input-hint">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </main>
    </div>
  );
}


function WelcomeScreen() {
  return (
    <div className="welcome">
      <div className="welcome__icon">🤖</div>
      <h1 className="welcome__title">AI Agent</h1>
      <p className="welcome__subtitle">
        Ask me anything. I can search the web, do math, and look up facts.
      </p>
      <div className="welcome__examples">
        <ExamplePrompt text="What's the latest in quantum computing?" />
        <ExamplePrompt text="Calculate the compound interest on $10,000 at 7% for 10 years" />
        <ExamplePrompt text="Explain async/await in Python with an example" />
      </div>
    </div>
  );
}

function ExamplePrompt({ text }) {
  return (
    <button
      className="example-prompt"
      onClick={() => {
        // Populate the input field
        const input = document.getElementById("chat-message-input");
        if (input) {
          input.value = text;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.focus();
        }
      }}
    >
      {text}
    </button>
  );
}
```

---

## 6. Tool-Call Visibility — "Thinking" in the UI

The ThinkingPanel is the feature that makes your agent feel *alive*. Here's the complete CSS that makes the whole UI look premium.

```css
/* =========================================================
   FILE: frontend/src/index.css
   Dark theme for the agentic chat app.
   Rich glassmorphism, smooth animations, premium feel.
   ========================================================= */

/* ── Google Fonts ─────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* ── Design Tokens ────────────────────────────────────── */
:root {
  --bg-primary:    #0d0d0f;
  --bg-secondary:  #141416;
  --bg-tertiary:   #1c1c1f;
  --bg-glass:      rgba(255, 255, 255, 0.03);
  --border:        rgba(255, 255, 255, 0.08);
  --border-hover:  rgba(255, 255, 255, 0.15);

  --text-primary:  #f0f0f2;
  --text-secondary:#9898a6;
  --text-muted:    #5a5a6a;

  --accent:        #7c6af7;   /* purple */
  --accent-hover:  #9585ff;
  --accent-dim:    rgba(124, 106, 247, 0.15);

  --user-bg:       rgba(124, 106, 247, 0.12);
  --user-border:   rgba(124, 106, 247, 0.25);
  --bot-bg:        var(--bg-tertiary);

  --success:       #34d399;
  --warning:       #fbbf24;
  --error:         #f87171;

  --radius-sm:     6px;
  --radius-md:     12px;
  --radius-lg:     18px;
  --radius-xl:     24px;

  --shadow-md:     0 4px 24px rgba(0,0,0,0.4);
  --shadow-lg:     0 8px 40px rgba(0,0,0,0.5);
}

/* ── Reset ────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, sans-serif;
  background:  var(--bg-primary);
  color:       var(--text-primary);
  height:      100vh;
  overflow:    hidden;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ── App Layout ───────────────────────────────────────── */
.app {
  display:    flex;
  height:     100vh;
  overflow:   hidden;
}

/* ── Sidebar ──────────────────────────────────────────── */
.sidebar {
  width:       260px;
  min-width:   260px;
  background:  var(--bg-secondary);
  border-right: 1px solid var(--border);
  display:     flex;
  flex-direction: column;
  padding:     20px 16px;
  gap:         16px;
}

.sidebar__logo {
  display:     flex;
  align-items: center;
  gap:         10px;
  padding:     8px 4px;
}

.sidebar__logo-icon {
  font-size:   22px;
}

.sidebar__logo-text {
  font-size:   18px;
  font-weight: 700;
  background:  linear-gradient(135deg, var(--accent), #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar__new-chat {
  background:  var(--accent-dim);
  color:       var(--accent-hover);
  border:      1px solid rgba(124, 106, 247, 0.3);
  border-radius: var(--radius-md);
  padding:     10px 16px;
  font-size:   14px;
  font-weight: 500;
  cursor:      pointer;
  transition:  all 0.2s ease;
  text-align:  left;
  font-family: inherit;
}

.sidebar__new-chat:hover:not(:disabled) {
  background:  rgba(124, 106, 247, 0.25);
  transform:   translateY(-1px);
}

.sidebar__new-chat:disabled {
  opacity: 0.4;
  cursor:  not-allowed;
}

.sidebar__info {
  padding:     12px;
  background:  var(--bg-glass);
  border:      1px solid var(--border);
  border-radius: var(--radius-md);
}

.sidebar__info h3 {
  font-size:   11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color:       var(--text-muted);
  margin-bottom: 10px;
}

.sidebar__info ul {
  list-style:  none;
  display:     flex;
  flex-direction: column;
  gap:         8px;
}

.sidebar__info li {
  font-size:   13px;
  color:       var(--text-secondary);
}

.sidebar__footer {
  margin-top:  auto;
  font-size:   11px;
  color:       var(--text-muted);
  text-align:  center;
}

/* ── Chat Area ────────────────────────────────────────── */
.chat-area {
  flex:        1;
  display:     flex;
  flex-direction: column;
  overflow:    hidden;
  background:  var(--bg-primary);
}

.messages-container {
  flex:        1;
  overflow-y:  auto;
  padding:     24px 0;
  display:     flex;
  flex-direction: column;
  gap:         4px;
  scroll-behavior: smooth;
}

/* Subtle scrollbar */
.messages-container::-webkit-scrollbar { width: 4px; }
.messages-container::-webkit-scrollbar-track { background: transparent; }
.messages-container::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

/* ── Messages ─────────────────────────────────────────── */
.message {
  display:     flex;
  gap:         14px;
  padding:     12px 24px;
  transition:  background 0.15s ease;
  max-width:   800px;
  margin:      0 auto;
  width:       100%;
}

.message:hover {
  background: var(--bg-glass);
}

.message__avatar {
  width:       36px;
  height:      36px;
  min-width:   36px;
  border-radius: 50%;
  display:     flex;
  align-items: center;
  justify-content: center;
  font-size:   16px;
  background:  var(--bg-tertiary);
  border:      1px solid var(--border);
}

.message--user .message__avatar {
  background:  var(--user-bg);
  border-color: var(--user-border);
}

.message__bubble { flex: 1; min-width: 0; }

.message__role {
  font-size:   11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color:       var(--text-muted);
  margin-bottom: 6px;
}

.message--user .message__role { color: var(--accent); }

.message__content {
  font-size:   15px;
  color:       var(--text-primary);
  line-height: 1.7;
  word-break:  break-word;
}

/* Streaming cursor */
.streaming-cursor {
  display:       inline-block;
  width:         2px;
  height:        1.1em;
  background:    var(--accent);
  margin-left:   2px;
  vertical-align: text-bottom;
  animation:     blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* Code blocks */
.code-block {
  background:   #0a0a0c;
  border:       1px solid var(--border);
  border-radius: var(--radius-md);
  padding:      16px;
  margin:       10px 0;
  overflow-x:   auto;
  font-family:  'JetBrains Mono', monospace;
  font-size:    13px;
  line-height:  1.6;
  position:     relative;
}

.code-block__lang {
  position:     absolute;
  top:          8px;
  right:        12px;
  font-size:    10px;
  color:        var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.inline-code {
  font-family:  'JetBrains Mono', monospace;
  font-size:    13px;
  background:   rgba(124, 106, 247, 0.1);
  color:        #a78bfa;
  padding:      2px 6px;
  border-radius: 4px;
}

/* ── Thinking Panel ───────────────────────────────────── */
.thinking-panel {
  max-width:    800px;
  margin:       8px auto;
  width:        calc(100% - 48px);
  background:   var(--bg-secondary);
  border:       1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow:     hidden;
  animation:    slideDown 0.2s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0);    }
}

.thinking-panel__header {
  display:      flex;
  align-items:  center;
  gap:          8px;
  padding:      10px 16px;
  border-bottom: 1px solid var(--border);
  font-size:    12px;
  font-weight:  600;
  color:        var(--text-secondary);
}

.thinking-panel__events {
  display:      flex;
  flex-direction: column;
}

/* ── Tool Call Rows ───────────────────────────────────── */
.tool-call {
  padding:      10px 16px;
  border-bottom: 1px solid var(--border);
  transition:   background 0.2s ease;
}

.tool-call:last-child { border-bottom: none; }

.tool-call--running { background: rgba(251, 191, 36, 0.04); }
.tool-call--done    { background: rgba(52, 211, 153, 0.03); }

.tool-call__header {
  display:      flex;
  align-items:  center;
  gap:          8px;
  font-size:    13px;
}

.tool-call__icon    { font-size: 15px; }
.tool-call__name    { font-weight: 600; color: var(--text-primary); }
.tool-call__args    { color: var(--text-muted); font-size: 12px; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.tool-call__status  { margin-left: auto; font-size: 12px; }

.tool-call__result {
  margin-top:   6px;
  font-size:    12px;
  color:        var(--text-muted);
  font-family:  'JetBrains Mono', monospace;
  background:   var(--bg-primary);
  padding:      6px 10px;
  border-radius: var(--radius-sm);
  border:       1px solid var(--border);
}

.check { color: var(--success); font-weight: 500; }

/* ── Spinners ─────────────────────────────────────────── */
.spinner, .button-spinner {
  display:      inline-block;
  width:        14px;
  height:       14px;
  border:       2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation:    spin 0.7s linear infinite;
}

.button-spinner { width: 18px; height: 18px; }

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Input Area ───────────────────────────────────────── */
.input-area {
  padding:      16px 24px 20px;
  border-top:   1px solid var(--border);
  background:   var(--bg-secondary);
  max-width:    800px;
  width:        100%;
  margin:       0 auto;
  align-self:   stretch;
}

.chat-input {
  display:      flex;
  align-items:  flex-end;
  gap:          10px;
  background:   var(--bg-tertiary);
  border:       1px solid var(--border);
  border-radius: var(--radius-xl);
  padding:      10px 10px 10px 18px;
  transition:   border-color 0.2s, box-shadow 0.2s;
}

.chat-input:focus-within {
  border-color: var(--accent);
  box-shadow:   0 0 0 3px var(--accent-dim);
}

.chat-input__field {
  flex:         1;
  background:   transparent;
  border:       none;
  outline:      none;
  color:        var(--text-primary);
  font-family:  inherit;
  font-size:    15px;
  line-height:  1.5;
  resize:       none;
  max-height:   200px;
  overflow-y:   auto;
}

.chat-input__field::placeholder { color: var(--text-muted); }

.chat-input__send {
  width:        38px;
  height:       38px;
  min-width:    38px;
  border-radius: 50%;
  background:   var(--accent);
  border:       none;
  cursor:       pointer;
  display:      flex;
  align-items:  center;
  justify-content: center;
  transition:   all 0.2s ease;
  color:        white;
}

.chat-input__send:hover:not(.chat-input__send--disabled) {
  background:   var(--accent-hover);
  transform:    scale(1.08);
}

.chat-input__send--disabled {
  background:   var(--bg-glass);
  cursor:       not-allowed;
}

.chat-input__send svg {
  width:  16px;
  height: 16px;
}

.input-hint {
  font-size:   11px;
  color:       var(--text-muted);
  text-align:  center;
  margin-top:  8px;
}

/* ── Welcome Screen ───────────────────────────────────── */
.welcome {
  flex:         1;
  display:      flex;
  flex-direction: column;
  align-items:  center;
  justify-content: center;
  text-align:   center;
  padding:      48px 24px;
  gap:          16px;
  animation:    fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0);    }
}

.welcome__icon { font-size: 56px; }

.welcome__title {
  font-size:    28px;
  font-weight:  700;
  background:   linear-gradient(135deg, var(--text-primary), var(--text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome__subtitle {
  font-size:    16px;
  color:        var(--text-secondary);
  max-width:    480px;
}

.welcome__examples {
  display:      flex;
  flex-wrap:    wrap;
  gap:          10px;
  justify-content: center;
  margin-top:   8px;
  max-width:    640px;
}

.example-prompt {
  background:   var(--bg-secondary);
  border:       1px solid var(--border);
  border-radius: var(--radius-xl);
  padding:      10px 18px;
  font-size:    13px;
  color:        var(--text-secondary);
  cursor:       pointer;
  transition:   all 0.2s ease;
  font-family:  inherit;
}

.example-prompt:hover {
  background:   var(--bg-tertiary);
  border-color: var(--border-hover);
  color:        var(--text-primary);
  transform:    translateY(-2px);
}

/* ── Error Banner ─────────────────────────────────────── */
.error-banner {
  max-width:    800px;
  width:        calc(100% - 48px);
  margin:       8px auto;
  padding:      12px 16px;
  background:   rgba(248, 113, 113, 0.08);
  border:       1px solid rgba(248, 113, 113, 0.25);
  border-radius: var(--radius-md);
  color:        var(--error);
  font-size:    14px;
}

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 700px) {
  .sidebar     { display: none; }
  .message     { padding: 10px 16px; }
  .input-area  { padding: 12px 16px 16px; }
}
```

```javascript
// =========================================================
// FILE: frontend/vite.config.js
// Vite configuration with proxy to FastAPI backend.
// =========================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls to FastAPI during development.
    // Without this: browser blocks cross-origin requests.
    // Replace with CORS config in production.
    proxy: {
      "/api": {
        target:    "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
```

---

## 7. Production Hardening — Auth, CORS, Rate Limiting

You have a working app. Before shipping, add the three essentials.

```python
# =========================================================
# FILE: backend/auth.py
# API key authentication middleware + rate limiting.
# In production: use a proper auth service (Auth0, Clerk).
# pip install fastapi slowapi
# =========================================================

import os
import time
from collections import defaultdict
from fastapi import HTTPException, Request, Security
from fastapi.security.api_key import APIKeyHeader

# ── API Key Auth ───────────────────────────────────────────
API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)

VALID_API_KEYS = set(
    os.environ.get("VALID_API_KEYS", "dev-key-12345").split(",")
)

async def verify_api_key(
    api_key: str = Security(API_KEY_HEADER)
) -> str:
    """
    FastAPI dependency: validates the X-API-Key header.
    Add to any route: async def route(key=Depends(verify_api_key))

    In development: set VALID_API_KEYS=dev-key-12345 in .env
    In production: use a secrets manager (AWS Secrets Manager, etc.)
    """
    if not api_key:
        raise HTTPException(
            status_code=403,
            detail="Missing API key. Include X-API-Key header."
        )
    if api_key not in VALID_API_KEYS:
        raise HTTPException(
            status_code=403,
            detail="Invalid API key."
        )
    return api_key


# ── In-Memory Rate Limiter ─────────────────────────────────
# Simple token bucket per IP address.
# In production: use Redis-based rate limiter (slowapi + Redis).

class RateLimiter:
    """
    Token bucket rate limiter.
    Each IP gets N requests per window_s seconds.
    """

    def __init__(self, requests_per_window: int = 10, window_s: int = 60):
        self.limit        = requests_per_window
        self.window_s     = window_s
        self._buckets: dict[str, list[float]] = defaultdict(list)

    def is_allowed(self, identifier: str) -> tuple[bool, int]:
        """
        Check if a request from 'identifier' (IP) is allowed.

        Returns:
            Tuple of (allowed: bool, remaining: int)
        """
        now    = time.time()
        bucket = self._buckets[identifier]

        # Remove requests outside the current window
        self._buckets[identifier] = [t for t in bucket if now - t < self.window_s]
        bucket = self._buckets[identifier]

        if len(bucket) >= self.limit:
            return False, 0

        bucket.append(now)
        return True, self.limit - len(bucket)

# Shared rate limiter instance
rate_limiter = RateLimiter(requests_per_window=20, window_s=60)


async def check_rate_limit(request: Request) -> None:
    """
    FastAPI dependency: checks rate limit for the requesting IP.
    Raises 429 if limit exceeded.
    """
    client_ip = request.client.host if request.client else "unknown"
    allowed, remaining = rate_limiter.is_allowed(client_ip)

    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please wait before sending more messages.",
            headers={"Retry-After": "60"}
        )

# ── Add to routes in main.py: ────────────────────────────
# @app.post("/api/chat")
# async def chat(
#     request: ChatRequest,
#     req: Request,
#     _key: str = Depends(verify_api_key),      ← add this
#     _rl: None = Depends(check_rate_limit),    ← and this
# ):
```

---

## 8. Running the Full Stack Locally

```
STARTUP SEQUENCE:
════════════════════════════════════════════════════════════════

  Terminal 1 — Backend:
  ─────────────────────────────────────────────────────────
  cd agent-app/backend

  # Create .env
  echo "OPENAI_API_KEY=sk-your-key-here" > .env
  echo "VALID_API_KEYS=dev-key-12345" >> .env

  # Install dependencies
  pip install -r requirements.txt

  # Start FastAPI
  uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  Output:
  ✅ Session memory initialized
  INFO:     Uvicorn running on http://0.0.0.0:8000
  INFO:     Application startup complete.


  Terminal 2 — Frontend:
  ─────────────────────────────────────────────────────────
  cd agent-app/frontend

  # Install dependencies
  npm install

  # Create .env
  echo "VITE_API_URL=http://localhost:8000" > .env

  # Start Vite dev server
  npm run dev

  Output:
  VITE v5.x.x  ready in 312ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/


  Browser:
  ─────────────────────────────────────────────────────────
  Open: http://localhost:5173
  Type: "What is the latest news in AI?"
  Watch: tokens stream in real-time + ThinkingPanel shows search
```

```
WHAT THE APP LOOKS LIKE (ASCII mockup):
════════════════════════════════════════════════════════════════

  ┌──────────────┬──────────────────────────────────────────┐
  │ ⚡ AgentChat  │                                          │
  │              │  👤 You                                  │
  │ + New Chat   │  What's the latest in quantum computing? │
  │              │                                          │
  │ Tools:       │  🤖 Agent                               │
  │ 🔍 Web Search│  Let me search for that...              │
  │ 🔢 Calculator│                                          │
  │ 📚 Wikipedia │  ┌──────────────────────────────────┐   │
  │ 🕒 Date/Time │  │ ⚙️ Agent Actions                  │   │
  │              │  │ 🔍 Web Search "quantum computing  │   │
  │              │  │    2024 breakthroughs"     ⠋ ...  │   │
  │              │  │ 🔍 Web Search "quantum error      │   │
  │              │  │    correction progress" ✓ 892ms  │   │
  │              │  └──────────────────────────────────┘   │
  │              │                                          │
  │              │  IBM and Google made significant         │
  │              │  breakthroughs in 2024...█               │
  │              │  ← Live streaming cursor                 │
  │              │                                          │
  │              │  ┌─────────────────────────────────┐    │
  │              │  │ Ask me anything...          [→]  │    │
  │              │  └─────────────────────────────────┘    │
  │ GPT-4o-mini  │  Press Enter · Shift+Enter for newline  │
  └──────────────┴──────────────────────────────────────────┘
```

---

## 9. Mini Quiz

**Question 1 — SSE vs WebSocket**

Your product manager wants to add real-time collaboration where two users can **both type simultaneously** and see each other's cursors in a shared document. Should you use SSE or WebSockets here? Why does your Chapter 8 chat use SSE instead?

<details>
<summary>👆 Click to reveal answer</summary>

**Use WebSockets for real-time collaboration. Keep SSE for the chat.**

**Real-time collaboration (cursors, simultaneous typing) → WebSocket:**
- Bidirectional: User A's cursor position must reach User B's browser AND User B's keystrokes must reach User A in real-time.
- SSE is server→client only — User A's typing would need a separate HTTP POST for every keystroke, which would be 50-100 requests/second. That's insane.
- WebSocket maintains a single persistent bidirectional connection: User A's events flow to the server, server broadcasts to User B, all on the same socket. Zero per-event HTTP overhead.

**AI chat (streaming agent response) → SSE:**
- The user types once (one POST request with the message body — GET doesn't support body)
- The server streams back tokens (server → client only)
- SSE's one-way constraint is perfectly matched
- SSE works through CDNs, load balancers, and proxies without sticky session config (huge ops win)
- EventSource auto-reconnects if connection drops (WebSocket requires reconnect code)

**The practical summary:** If your streaming is server-pushing-to-client only, SSE is simpler, more HTTP-native, and operationally easier. If you need the client to also push data in real-time (cursor positions, collaborative edits, game state), use WebSockets.
</details>

---

**Question 2 — Streaming Architecture**

In `generate_sse_stream()`, we use a `threading.Thread` + `asyncio.Queue` pattern to bridge the synchronous `StreamingAgentRunner.run()` generator with FastAPI's async streaming. Why can't we just call the sync generator directly with `async for`?

<details>
<summary>👆 Click to reveal answer</summary>

**Because a synchronous generator blocks the async event loop.**

FastAPI runs on an async event loop (asyncio). This loop handles ALL requests on a single thread by switching between coroutines whenever one awaits something.

If you `await` a synchronous generator that blocks (e.g., makes a blocking OpenAI API call with `stream=True`), the event loop is stuck for the entire duration of that blocking call — it can't handle any other requests, websocket heartbeats, or internal tasks.

```python
# ❌ BREAKS THE EVENT LOOP:
async def generate_sse_stream(...):
    for event in runner.run(message, session_id):  # sync generator = blocking!
        yield event.to_sse_bytes()
        # While OpenAI API call inside runner.run() is waiting,
        # NO other request can be processed. Server appears hung.
```

**The fix: run the sync generator in a thread pool, bridge via asyncio.Queue:**

```python
# ✅ CORRECT PATTERN:
def run_agent_in_thread():
    for event in runner.run(...):   # blocking — but runs in a thread, not event loop
        loop.call_soon_threadsafe(queue.put_nowait, event)

thread = threading.Thread(target=run_agent_in_thread, daemon=True)
thread.start()

while True:
    event = await queue.get()   # ← this YIELDS to the event loop! Other requests can run.
    yield event.to_sse_bytes()
```

`await queue.get()` suspends the current coroutine and lets the event loop run other things while waiting. The thread runs the blocking generator in the background. This is the correct async/sync bridge pattern in FastAPI.

**Alternative:** Convert `StreamingAgentRunner.run()` to be a proper `async` generator with `async for`/`yield`, using `AsyncOpenAI` client. That's cleaner but requires rewriting the agent.
</details>

---

**Question 3 — Token Accumulation**

In `agent_runner.py`, tool call arguments arrive incrementally across multiple chunks. Explain the bug if you parse `tc.function.arguments` on the FIRST chunk and call the tool immediately, using a specific example.

<details>
<summary>👆 Click to reveal answer</summary>

**The JSON will be incomplete → JSONDecodeError → tool execution fails.**

OpenAI streams tool call arguments as partial strings across many chunks. Example for `web_search(query="Python async programming best practices 2024")`:

```
Chunk 1: arguments = '{"quer'
Chunk 2: arguments = 'y": "Python'
Chunk 3: arguments = ' async p'
Chunk 4: arguments = 'rogramming best'
Chunk 5: arguments = ' practices 2024"}'
```

If you call `json.loads('{"quer')` on Chunk 1 → `JSONDecodeError: Expecting value at line 1 column 8`.

Even worse: if the partial JSON happens to be valid (rare but possible), you get a completely wrong argument:
```
Chunk 1: arguments = '{"query": '     # NOT valid JSON
Chunk 2: arguments = '"Python"}'      # Together they're valid
```

If Chunk 1 alone happened to parse as something, you'd search for the wrong thing entirely.

**The correct approach (from the code):
```python
# ACCUMULATE across all chunks
if tc_delta.function and tc_delta.function.arguments:
    collected_tool_calls[idx]["args"] += tc_delta.function.arguments
    # ↑ += appends. Don't try to parse until finish_reason == "tool_calls"

# ONLY parse and execute AFTER finish_reason confirms tool call is complete
if finish_reason == "tool_calls":
    tool_args = json.loads(tc["args"])   # NOW it's complete JSON → safe to parse
    result = fn(**tool_args)
```

Same principle applies to `function.name` — it also arrives incrementally. A function named `get_wikipedia_summary` might arrive as `"get_w"`, `"ikipedia_s"`, `"ummary"`. Never match on partial names.
</details>

---

**Question 4 — The Proxy Config**

In `vite.config.js`, we proxy `/api` to `http://localhost:8000`. What browser security feature makes this necessary during development? Will you need this proxy config in production? What do you use instead?

<details>
<summary>👆 Click to reveal answer</summary>

**Same-Origin Policy (CORS) makes the proxy necessary in development.**

Without the proxy:
- React app runs on `http://localhost:5173`
- FastAPI runs on `http://localhost:8000`
- These are different origins (different ports!)
- The browser's Same-Origin Policy blocks the fetch request from 5173 to 8000 with: `Access to fetch at 'http://localhost:8000/api/chat' from origin 'http://localhost:5173' has been blocked by CORS policy`

**The proxy workaround:** Vite's proxy intercepts requests to `/api/*` from the React dev server and forwards them to FastAPI on port 8000. From the browser's perspective, BOTH the React app AND the API are served from `localhost:5173` → same origin → no CORS issue.

```
Browser                 Vite Dev Server         FastAPI
  |                          |                     |
  |── fetch /api/chat ──────►|── proxy →  ────────►|
  |                          |    http://5173  8000
  |  (browser thinks it's    |
  |   talking to port 5173)
```

**In production, you do NOT need the proxy.** Instead, you configure `CORS` on the FastAPI server with your actual domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],   # ✅ allow your frontend domain
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)
```

OR serve both React (static files) and FastAPI from the SAME origin:
```
nginx.conf:
  location /        → serve React build (same-origin: no CORS needed)
  location /api/    → proxy to FastAPI (uvicorn on localhost:8000)
```

This is the cleanest production setup: one domain, nginx serves static files, proxies API calls.
</details>

---

**Question 5 — useAgentStream Performance**

In `useAgentStream.js`, `appendToken` calls `setMessages` potentially 30-50 times per second during streaming. A React developer on your team says this will "destroy performance — 50 re-renders per second!" Are they right? How does React handle this, and is there a better pattern?

<details>
<summary>👆 Click to reveal answer</summary>

**Partially right — but React 18's automatic batching makes it much better than feared.**

React 18 introduced **automatic batching**: state updates that happen synchronously (even in setTimeout, Promises, and native event handlers) are batched into a single render. But the SSE callbacks in our EventSource reader are async — each `onToken` call happens as a separate microtask from the stream reader.

**What actually happens:**
- Each `onToken` → `appendToken` → `setMessages` triggers ONE re-render
- At 30-50 tokens/second → 30-50 renders/second
- Each render re-renders `<MessageList>` → re-renders each `<Message>` → DOM updates

**Is this a problem?** For a chat UI with 10-20 messages: **No.** React's reconciliation is fast enough. Browsers run at 60fps; React's virtual DOM diffing for this simple list is <1ms per render.

**When it BECOMES a problem:** Hundreds of messages, complex message components with heavy calculation, or mobile devices with GPU constraints.

**Better patterns for high-performance streaming:**

1. **Ref + interval flush (most optimal):**
```javascript
const tokenBufferRef = useRef("");

const appendToken = useCallback((token) => {
    tokenBufferRef.current += token;   // accumulate in ref (no re-render)
}, []);

// Flush to state at 60fps max
useEffect(() => {
    const interval = setInterval(() => {
        if (tokenBufferRef.current) {
            setMessages(prev => /* update with buffer */);
            tokenBufferRef.current = "";
        }
    }, 16);   // 60fps = 16ms
    return () => clearInterval(interval);
}, []);
```

2. **`useTransition` (React 18):**
```javascript
const [isPending, startTransition] = useTransition();
startTransition(() => setMessages(...));   // marks as low-priority update
```

3. **Virtual list (react-virtual):** For 1000+ messages, only render visible ones.

**For our use case (50 messages max, 50 tokens/sec): the current implementation is fine.** Add the ref+interval pattern when you measure actual jank, not before — premature optimization and all that.
</details>

---

## 10. Chapter 9 Preview

```
╔══════════════════════════════════════════════════════════════╗
║  👀 COMING UP: Chapter 9                                     ║
║  "Deployment & DevOps — Shipping Your Agent to Production"  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Chapter 8 gave you a working full-stack agent app.         ║
║  It runs beautifully on localhost.                           ║
║  And it will STAY on localhost if you stop here.            ║
║                                                              ║
║  Chapter 9 ships it. Properly.                              ║
║                                                              ║
║  🐳  DOCKER — "Works on my machine" → "Works everywhere"   ║
║      Dockerize the FastAPI backend (multi-stage build)      ║
║      Dockerize the React frontend (nginx static serve)      ║
║      docker-compose for local full-stack                    ║
║      .dockerignore, non-root users, layer caching tricks    ║
║                                                              ║
║  ☁️  CLOUD DEPLOYMENT — Three paths                         ║
║      Railway / Render: simplest — push to deploy            ║
║      AWS ECS Fargate: production-grade containerized        ║
║      Vercel (frontend) + Railway (backend): hybrid          ║
║                                                              ║
║  🔐  SECRETS MANAGEMENT                                      ║
║      Never commit API keys (the #1 junior dev mistake)      ║
║      AWS Secrets Manager, Railway env vars, Vault           ║
║      Secret rotation without downtime                       ║
║                                                              ║
║  📊  MONITORING & ALERTS                                     ║
║      Structured logs → CloudWatch / Datadog                 ║
║      Error tracking with Sentry                             ║
║      Agent-specific metrics: token costs, latency, errors   ║
║      PagerDuty alerts when agent error rate spikes          ║
║                                                              ║
║  🔄  CI/CD PIPELINE                                          ║
║      GitHub Actions: test → lint → build → deploy           ║
║      Blue-green deployments (zero downtime)                 ║
║      Automatic rollback on health check failure             ║
║                                                              ║
║  🚀  Real use case:                                          ║
║      Full deployment of the Chapter 8 chat app:             ║
║      Frontend on Vercel, Backend on Railway, auto-deploy    ║
║      on main branch push. The whole pipeline in 60 minutes. ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  PREREQUISITE CHECKLIST BEFORE CHAPTER 9:                    ║
║  ✅ Both servers run locally without errors                  ║
║  ✅ You understand why the queue/thread bridge is needed     ║
║  ✅ You understand SSE event parsing in the frontend         ║
║  ✅ You've tested streaming with at least one tool call      ║
║  ✅ You can explain the Vite proxy vs production CORS        ║
╚══════════════════════════════════════════════════════════════╝
```

> **Professor's Final Word:** You just built something a senior engineer would be proud to show in a demo. A chat UI that streams live, shows the agent "thinking" in real-time, maintains conversation memory, and has the production foundations (auth, rate limiting, CORS) all in place. The most important thing you built today? The `parseSSEEvent` function and the `useAgentStream` hook. Those are the two pieces that turn your Python agent from a terminal script into a living, breathing web product. Every AI product you've ever admired — Claude web, ChatGPT, Perplexity — uses these exact patterns at scale. You're no longer just studying them. You've built one. 🎓🚀

---

```
────────────────────────────────────────────────────────────────────
  Chapter 8 Complete ✅  |  Next: Chapter 9 — Deployment & DevOps
  Files covered this chapter:
  Backend:
    stream_events.py    — StreamEvent SSE serializer, EventType enum
    tools.py            — web_search, calculate, wikipedia, datetime
    memory_manager.py   — SessionMemory (SQLite, per-session history)
    agent_runner.py     — StreamingAgentRunner (streaming ReAct + SSE events)
    main.py             — FastAPI app, SSE route, thread/queue bridge
    auth.py             — API key dependency, in-memory rate limiter
  Frontend:
    agentApi.js         — chatStream(), parseSSEEvent(), getHistory()
    useAgentStream.js   — streaming state hook, token appending, events
    Message.jsx         — message bubble + inline markdown renderer
    ThinkingPanel.jsx   — live tool-call visualizer
    ChatInput.jsx       — auto-resize textarea, Shift+Enter newline
    App.jsx             — root layout, welcome screen, auto-scroll
    index.css           — dark theme, glassmorphism, animations
    vite.config.js      — dev proxy configuration
────────────────────────────────────────────────────────────────────
```
