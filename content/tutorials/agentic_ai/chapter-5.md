# 🤖 Agentic AI Full Stack Developer Course
## Chapter 5: Memory Systems for AI Agents

> **Professor's Note:** Your Chapter 4 agent is brilliant — but it has the memory of a goldfish. Every session it wakes up not knowing your name, your preferences, or what it researched for you yesterday. Today we fix that permanently. We'll build a **four-layer memory architecture** that gives your agents human-like recall: short-term working memory, long-term episodic memory, semantic search memory (RAG), and procedural memory. By the end, you'll have a customer support bot that *remembers every customer*, *finds relevant past tickets in milliseconds*, and *learns from experience*. This is the chapter that transforms your agent from a clever tool into a genuine AI assistant. 🧠💾

---

```
╔══════════════════════════════════════════════════════════════╗
║  📦 CHAPTER 5 AT A GLANCE                                   ║
╠══════════════════════════════════════════════════════════════╣
║  🧠  The 4 memory types — theory + when to use each         ║
║  📝  Short-term memory — conversation management at scale   ║
║  💾  Long-term memory — SQLite persistence across sessions  ║
║  🔍  Semantic memory — ChromaDB vector search (local)       ║
║  ☁️  Pinecone — production vector DB in the cloud           ║
║  🔗  RAG pipeline — retrieval-augmented generation, built   ║
║  🏭  Real use case: Customer Support Bot with full memory   ║
║  📝  Mini quiz — 5 questions                                 ║
║  👀  Chapter 6 preview — Multi-Agent Systems                 ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 📋 Table of Contents

1. [The 4 Memory Types — The Full Picture](#1-the-4-memory-types--the-full-picture)
2. [Short-Term Memory — Taming the Context Window](#2-short-term-memory--taming-the-context-window)
3. [Long-Term Memory — SQLite Persistence](#3-long-term-memory--sqlite-persistence)
4. [Semantic Memory — ChromaDB Vector Search](#4-semantic-memory--chromadb-vector-search)
5. [Pinecone — Production Vector Database](#5-pinecone--production-vector-database)
6. [The RAG Pipeline — Retrieval-Augmented Generation](#6-the-rag-pipeline--retrieval-augmented-generation)
7. [Real Use Case: Customer Support Bot](#7-real-use-case-customer-support-bot)
8. [Choosing the Right Memory for the Job](#8-choosing-the-right-memory-for-the-job)
9. [Mini Quiz](#9-mini-quiz)
10. [Chapter 6 Preview](#10-chapter-6-preview)

---

## 1. The 4 Memory Types — The Full Picture

Before writing a line of code, let's understand the full landscape. Your agent can have up to four distinct memory systems, each serving a different purpose. This mirrors how human memory actually works — and for good reason.

```
THE COMPLETE AGENT MEMORY ARCHITECTURE:
════════════════════════════════════════════════════════════════

  ┌──────────────────────────────────────────────────────────────┐
  │                    MEMORY SYSTEMS                            │
  │                                                              │
  │  ┌──────────────────────┐  ┌──────────────────────────────┐ │
  │  │  SHORT-TERM (Working)│  │  LONG-TERM (Episodic)        │ │
  │  │                      │  │                              │ │
  │  │  What: messages[]    │  │  What: SQLite / PostgreSQL   │ │
  │  │  Lives: in RAM       │  │  Lives: on disk / cloud DB   │ │
  │  │  Scope: this session │  │  Scope: all time             │ │
  │  │  Max:   ~128k tokens │  │  Max:   unlimited            │ │
  │  │                      │  │                              │ │
  │  │  "What just happened"│  │  "What happened last week"   │ │
  │  └──────────────────────┘  └──────────────────────────────┘ │
  │                                                              │
  │  ┌──────────────────────┐  ┌──────────────────────────────┐ │
  │  │  SEMANTIC (Vector)   │  │  PROCEDURAL (Skills)         │ │
  │  │                      │  │                              │ │
  │  │  What: embeddings +  │  │  What: learned behaviors     │ │
  │  │        vector DB     │  │  Lives: system prompt /      │ │
  │  │  Lives: Chroma /     │  │         fine-tuned model     │ │
  │  │         Pinecone     │  │  Scope: baked-in capability  │ │
  │  │  Max:   millions of  │  │  Max:   token limit of       │ │
  │  │         chunks       │  │         system prompt        │ │
  │  │                      │  │                              │ │
  │  │  "What's relevant"   │  │  "How to do things"          │ │
  │  └──────────────────────┘  └──────────────────────────────┘ │
  └──────────────────────────────────────────────────────────────┘

  SPEED COMPARISON:
  Short-term   → Instant (already in RAM)
  Procedural   → Instant (baked into the system prompt)
  Semantic     → ~20ms  (vector database similarity search)
  Long-term    → ~5ms   (SQL database query)
```

### The Human Memory Analogy

```
HOW THIS MAPS TO HUMAN MEMORY:
═══════════════════════════════════════════════════════════════

  HUMAN                     AGENT EQUIVALENT
  ─────────────────────     ──────────────────────────────────
  Working memory            Short-Term: messages[] array
  (things you're actively   (what happened in this conv.)
   thinking about right now)

  Long-term episodic        Long-Term: SQLite/PostgreSQL
  (memories of specific     (user profiles, past tickets,
   events: "on Monday I      past conversations stored
   talked to Alice about X") and retrievable by ID)

  Semantic memory           Vector DB: Chroma/Pinecone
  (general knowledge:       (embeddings of docs, FAQs,
   facts, concepts you       previous answers — retrieved
   can recall by meaning)    by semantic similarity)

  Procedural memory         System Prompt / Fine-tuning
  (how to ride a bike,      (baked-in skills: "how to
   how to write an email)    handle escalations", "tone")

  A world-class agent uses ALL FOUR simultaneously.
```

> 💡 **Professor's Insight:** Most beginner agents only use short-term memory (the messages array). That's like hiring a brilliant employee who has amnesia after each work day. They're great *during* a session but forget everything tomorrow. Adding long-term and semantic memory is what turns a demo into a product that users actually love.

---

## 2. Short-Term Memory — Taming the Context Window

Short-term memory is the `messages[]` array you've been building since Chapter 2. But there's a fundamental problem: **context windows are finite**. GPT-4o supports 128k tokens. Sounds huge — until your agent runs 50 research iterations, processes 20 tool results, and the user has a 2-hour session. Suddenly you're hitting the wall.

```
THE CONTEXT WINDOW PROBLEM:
════════════════════════════════════════════════════════════════

  Session start:            After 30 iterations:
  ┌─────────────────────┐   ┌─────────────────────────────────┐
  │ [system]     ~500t  │   │ [system]             ~500t      │
  │ [user]       ~100t  │   │ [user turn 1]        ~100t      │
  │                     │   │ [assistant+tools]    ~800t      │
  │                     │   │ [tool results]        ~600t     │
  │ USED:   600 tokens  │   │ ... × 30 iterations             │
  │ FREE: 127,400 tokens│   │                                 │
  └─────────────────────┘   │ USED:  ~45,000 tokens           │
                            │ FREE:   ~83,000 tokens          │
  After 100 iterations:     └─────────────────────────────────┘
  ┌─────────────────────────────────────────────────────────┐
  │ [150,000 tokens of history]                             │
  │                                                         │
  │ USED:  150,000 tokens — OVER LIMIT!                     │
  │ OpenAI API returns: "context_length_exceeded" error     │
  └─────────────────────────────────────────────────────────┘

  Three strategies to fix this:
  1. SLIDING WINDOW — keep only the last N messages
  2. SUMMARIZATION — compress old turns into a summary
  3. PRUNING — remove tool messages, keep only answers
```

### Strategy 1: Sliding Window

```python
# =========================================================
# FILE: memory_short_term.py
# Short-term memory management strategies.
# pip install openai python-dotenv tiktoken
# =========================================================

import os
import json
import tiktoken
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


# ── Token Counter ──────────────────────────────────────────
# tiktoken tokenizes text the same way OpenAI's models do.
# Use this to measure how much context you're using.

def count_tokens(messages: list[dict], model: str = "gpt-4o-mini") -> int:
    """
    Count the total tokens in a messages list.
    Uses tiktoken — the same tokenizer OpenAI uses internally.

    Args:
        messages: The messages array
        model:    Model name (affects tokenizer choice)

    Returns:
        Total token count
    """
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        # Fallback for unknown models
        encoding = tiktoken.get_encoding("cl100k_base")

    # Each message has a small token overhead beyond its content
    tokens_per_message = 3   # "<|start|>role\n" + "<|end|>"
    tokens_per_name    = 1   # if "name" field is present

    total = 0
    for msg in messages:
        total += tokens_per_message
        for key, value in msg.items():
            if isinstance(value, str):
                total += len(encoding.encode(value))
            elif isinstance(value, list):
                # Handle tool_calls and content arrays
                total += len(encoding.encode(str(value)))
            if key == "name":
                total += tokens_per_name

    total += 3   # reply priming tokens (every response starts with 3)
    return total


# ── Strategy 1: Sliding Window ────────────────────────────
# Keep the system prompt + the last N messages.
# Simple, predictable, easy to implement.
# Downside: loses context from early in the conversation.

def apply_sliding_window(
    messages:         list[dict],
    max_tokens:       int = 4000,
    model:            str = "gpt-4o-mini"
) -> list[dict]:
    """
    Truncate messages to fit within max_tokens.
    Always preserves:
      - The system message (index 0) — your agent's DNA
      - The most recent messages (from the end)
    Drops the oldest middle messages when over limit.

    Args:
        messages:   Full messages array
        max_tokens: Token budget (leave room for the response!)
        model:      Model name for tokenizer

    Returns:
        Trimmed messages list that fits within max_tokens.
    """
    # Separate system message from the rest
    # System message ALWAYS stays — it defines the agent's behavior.
    if messages and messages[0]["role"] == "system":
        system_msg    = [messages[0]]
        conversation  = messages[1:]
    else:
        system_msg   = []
        conversation = messages[:]

    # If already within budget, return unchanged
    if count_tokens(system_msg + conversation, model) <= max_tokens:
        return system_msg + conversation

    # Drop messages from the START (oldest) until we fit.
    # We never drop the system message or the last user message.
    while conversation and count_tokens(system_msg + conversation, model) > max_tokens:
        conversation.pop(0)     # remove oldest message

    dropped_count = len(messages) - len(system_msg) - len(conversation)
    if dropped_count > 0:
        # Add a synthetic context message so the LLM knows history was truncated
        # Without this, the LLM might reference something it "said" that's now gone.
        context_note = {
            "role":    "system",
            "content": (
                f"[Context note: {dropped_count} earlier messages were pruned "
                f"to fit the context window. The conversation continues below.]"
            )
        }
        return system_msg + [context_note] + conversation

    return system_msg + conversation


# ── Strategy 2: Conversation Summarization ────────────────
# Use the LLM itself to compress old conversation history.
# More expensive (extra API call) but preserves semantic content.

async def summarize_old_messages(
    messages_to_summarize: list[dict],
    model: str = "gpt-4o-mini"
) -> str:
    """
    Use the LLM to create a concise summary of old conversation turns.
    The summary preserves important facts without the full verbatim text.

    Args:
        messages_to_summarize: The messages to compress
        model:                 Model to use for summarization

    Returns:
        A text summary of the compressed conversation history.
    """
    # Format the messages as a readable transcript
    transcript_lines = []
    for msg in messages_to_summarize:
        role = msg.get("role", "unknown").upper()
        content = msg.get("content", "")

        if isinstance(content, str):
            transcript_lines.append(f"{role}: {content[:500]}")
        elif msg.get("tool_calls"):
            # Represent tool calls compactly
            calls = [f"{tc['function']['name']}({tc['function']['arguments'][:100]})"
                     for tc in msg.get("tool_calls", [])]
            transcript_lines.append(f"{role} [TOOL CALLS]: {', '.join(calls)}")

    transcript = "\n".join(transcript_lines)

    summary_response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role":    "system",
                "content": (
                    "You summarize conversation history for an AI agent. "
                    "Create a concise but complete summary that captures: "
                    "1) The user's original goal "
                    "2) Key facts discovered (especially from tool calls) "
                    "3) Decisions made so far "
                    "4) What still needs to be done. "
                    "Max 200 words. Use bullet points."
                )
            },
            {
                "role":    "user",
                "content": f"Summarize this conversation history:\n\n{transcript}"
            }
        ],
        temperature=0.1,
        max_tokens=300,
    )

    return summary_response.choices[0].message.content


def apply_summarization_window(
    messages:         list[dict],
    max_tokens:       int   = 4000,
    keep_recent:      int   = 6,      # always keep the last N messages verbatim
    model:            str   = "gpt-4o-mini"
) -> list[dict]:
    """
    When over token limit: summarize old messages, keep recent ones verbatim.

    Strategy:
      [system] + [SUMMARY of old messages] + [last 6 messages verbatim]

    This preserves semantic content better than sliding window,
    at the cost of one extra LLM call when compression is needed.

    Args:
        messages:     Full messages array
        max_tokens:   Token budget
        keep_recent:  How many recent messages to keep verbatim
        model:        Model name
    """
    if count_tokens(messages, model) <= max_tokens:
        return messages      # no trimming needed

    # Split: system prompt | old messages to summarize | recent messages to keep
    system_msgs = [m for m in messages if m.get("role") == "system"]
    non_system  = [m for m in messages if m.get("role") != "system"]

    if len(non_system) <= keep_recent:
        return messages      # not enough to summarize

    old_messages    = non_system[:-keep_recent]   # everything except last N
    recent_messages = non_system[-keep_recent:]   # the last N messages

    # Synchronous summary (simplified — in production use async)
    transcript = "\n".join(
        f"{m['role'].upper()}: {str(m.get('content', ''))[:300]}"
        for m in old_messages
    )
    summary_response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "Summarize this conversation history in under 150 words. Capture: user goal, key facts found, decisions made."},
            {"role": "user",   "content": transcript}
        ],
        max_tokens=200,
        temperature=0.1,
    )
    summary_text = summary_response.choices[0].message.content

    # Inject summary as a system note BEFORE recent messages
    summary_message = {
        "role":    "system",
        "content": f"[Conversation summary — {len(old_messages)} earlier messages compressed]:\n{summary_text}"
    }

    return system_msgs + [summary_message] + recent_messages


# ── Strategy 3: Tool Result Pruning ───────────────────────
# Tool results are often the biggest token consumers.
# After the LLM has read and processed a tool result, it doesn't
# need the full result anymore — just a reference that it happened.

def prune_tool_results(
    messages:          list[dict],
    max_result_length: int = 200
) -> list[dict]:
    """
    Truncate tool result messages to save tokens.
    Once the LLM has read a tool result and responded, the full
    result text is no longer needed — a summary is enough.

    Args:
        messages:          Full messages array
        max_result_length: Max characters to keep per tool result

    Returns:
        Messages with truncated tool results.
    """
    pruned = []
    for i, msg in enumerate(messages):
        if msg.get("role") == "tool":
            content = msg.get("content", "")
            # Only truncate "old" tool results (not the most recent one)
            # Keep the last tool result intact — LLM may still need it.
            is_last_tool = not any(
                m.get("role") == "tool"
                for m in messages[i+1:]
            )
            if not is_last_tool and len(content) > max_result_length:
                pruned_content = content[:max_result_length] + f"... [truncated, {len(content)} chars total]"
                pruned.append({**msg, "content": pruned_content})
            else:
                pruned.append(msg)
        else:
            pruned.append(msg)

    return pruned


# ── Demo ──────────────────────────────────────────────────
if __name__ == "__main__":
    # Simulate a long conversation and show trimming
    test_messages = [
        {"role": "system",    "content": "You are a helpful assistant."},
        {"role": "user",      "content": "What is the capital of France?"},
        {"role": "assistant", "content": "The capital of France is Paris."},
        {"role": "user",      "content": "Tell me about its history."},
        {"role": "assistant", "content": "Paris has a rich history spanning over 2000 years..."},
        {"role": "user",      "content": "What about the Eiffel Tower?"},
        {"role": "assistant", "content": "The Eiffel Tower was built in 1889..."},
        {"role": "user",      "content": "How tall is it?"},
    ]

    original_tokens = count_tokens(test_messages)
    trimmed         = apply_sliding_window(test_messages, max_tokens=200)
    trimmed_tokens  = count_tokens(trimmed)

    print(f"Original: {len(test_messages)} messages, {original_tokens} tokens")
    print(f"Trimmed:  {len(trimmed)} messages, {trimmed_tokens} tokens")
```

---

## 3. Long-Term Memory — SQLite Persistence

Short-term memory lives in RAM and dies when the process ends. **Long-term memory** survives forever — stored in a database keyed by user ID, session ID, or topic. This is how your agent remembers who it talked to yesterday.

```
LONG-TERM MEMORY ARCHITECTURE:
════════════════════════════════════════════════════════════════

  SESSION 1 (yesterday):             SESSION 2 (today):
  ──────────────────────────         ─────────────────────────
  User: "I'm Alice, a nurse."        User: "Hi, same issue
  Agent: looks up Alice → nothing         as before."
  Agent: "Nice to meet you, Alice."  Agent: looks up Alice
         Takes notes, saves them.         → finds profile!
                                          "Hi Alice! Nurse,
  ┌──────────────────────────┐            last ticket was
  │  LONG-TERM DB            │            about the billing
  │                          │            module. How can I
  │  user: alice@xyz.com     │            help today?"
  │  name: Alice             │
  │  role: nurse             │    Agent knows Alice without
  │  past_issues: billing... │    being told again. Magic!
  │  preferences: concise    │
  └──────────────────────────┘

  This is the difference between a chatbot and an assistant.
```

```python
# =========================================================
# FILE: memory_long_term.py
# Long-term memory using SQLite.
# In production: swap for PostgreSQL + SQLAlchemy.
# pip install python-dotenv  (sqlite3 is built into Python)
# =========================================================

import sqlite3
import json
import os
import re
from datetime import datetime
from contextlib import contextmanager
from typing import Optional

DB_PATH = "agent_memory.db"


# ══════════════════════════════════════════════════════════
# DATABASE SETUP
# ══════════════════════════════════════════════════════════

@contextmanager
def get_db():
    """Thread-safe database connection with auto commit/rollback."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row        # rows behave like dicts
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    # WAL = Write-Ahead Logging.
    # Allows concurrent reads while writing — critical for web apps.
    # Default journal mode blocks reads during writes.
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def initialize_memory_db() -> None:
    """
    Create all memory tables.
    Run once at application startup.
    """
    with get_db() as conn:
        conn.executescript("""
            -- User profiles: persistent facts about each user
            CREATE TABLE IF NOT EXISTS user_profiles (
                user_id      TEXT PRIMARY KEY,
                name         TEXT,
                email        TEXT,
                role         TEXT,
                company      TEXT,
                preferences  TEXT,    -- JSON: {"tone": "formal", "language": "en"}
                tags         TEXT,    -- CSV: "vip,enterprise,technical"
                created_at   TEXT DEFAULT (datetime('now')),
                updated_at   TEXT DEFAULT (datetime('now'))
            );

            -- Conversation sessions: each chat session has one row
            CREATE TABLE IF NOT EXISTS sessions (
                session_id   TEXT PRIMARY KEY,
                user_id      TEXT REFERENCES user_profiles(user_id),
                started_at   TEXT DEFAULT (datetime('now')),
                ended_at     TEXT,
                message_count INTEGER DEFAULT 0,
                summary      TEXT    -- LLM-generated summary of session
            );

            -- Individual memories: searchable facts extracted from conversations
            CREATE TABLE IF NOT EXISTS memories (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id      TEXT REFERENCES user_profiles(user_id),
                session_id   TEXT REFERENCES sessions(session_id),
                memory_type  TEXT,   -- "fact", "preference", "issue", "resolution"
                content      TEXT NOT NULL,
                importance   INTEGER DEFAULT 5,  -- 1 (low) to 10 (high)
                tags         TEXT,   -- CSV for filtering
                created_at   TEXT DEFAULT (datetime('now'))
            );

            -- Agent actions log: what the agent did and outcome
            CREATE TABLE IF NOT EXISTS agent_actions (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id   TEXT,
                user_id      TEXT,
                action_type  TEXT,   -- "tool_call", "escalation", "refund", etc.
                action_data  TEXT,   -- JSON: tool name + args
                outcome      TEXT,   -- "success", "failure", "escalated"
                notes        TEXT,
                created_at   TEXT DEFAULT (datetime('now'))
            );

            -- Create indexes for fast lookups by user_id
            CREATE INDEX IF NOT EXISTS idx_memories_user     ON memories(user_id);
            CREATE INDEX IF NOT EXISTS idx_memories_type     ON memories(memory_type);
            CREATE INDEX IF NOT EXISTS idx_actions_user      ON agent_actions(user_id);
            CREATE INDEX IF NOT EXISTS idx_sessions_user     ON sessions(user_id);
        """)
    print("✅ Memory database initialized.")


# ══════════════════════════════════════════════════════════
# USER PROFILE OPERATIONS
# ══════════════════════════════════════════════════════════

def get_or_create_user(user_id: str, name: str = "", email: str = "") -> dict:
    """
    Retrieve a user profile or create one if it doesn't exist.
    This is the first call for every conversation — always do it.

    Args:
        user_id: Unique identifier (email, UUID, etc.)
        name:    User's name (used only on creation)
        email:   User's email (used only on creation)

    Returns:
        User profile dict with all fields.
    """
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM user_profiles WHERE user_id = ?", (user_id,)
        ).fetchone()

        if row:
            # User exists — return their profile
            return dict(row)
        else:
            # New user — create a minimal profile
            conn.execute(
                """INSERT INTO user_profiles (user_id, name, email, preferences, tags)
                   VALUES (?, ?, ?, ?, ?)""",
                (user_id, name, email, "{}", "")
            )
            return {
                "user_id":     user_id,
                "name":        name,
                "email":       email,
                "role":        None,
                "company":     None,
                "preferences": "{}",
                "tags":        "",
                "created_at":  datetime.now().isoformat(),
            }


def update_user_profile(user_id: str, **kwargs) -> str:
    """
    Update fields on a user profile.
    Only updates the fields you explicitly pass.

    Args:
        user_id:  User identifier
        **kwargs: Fields to update (name, role, company, preferences, tags)

    Returns:
        Confirmation string.
    """
    allowed_fields = {"name", "role", "company", "email", "preferences", "tags"}
    updates        = {k: v for k, v in kwargs.items() if k in allowed_fields}

    if not updates:
        return "No valid fields to update."

    # Build dynamic UPDATE SQL safely (field names are whitelisted above)
    set_clauses = ", ".join(f"{field} = ?" for field in updates)
    values      = list(updates.values()) + [datetime.now().isoformat(), user_id]

    with get_db() as conn:
        conn.execute(
            f"UPDATE user_profiles SET {set_clauses}, updated_at = ? WHERE user_id = ?",
            values
        )

    return f"Profile updated for {user_id}: {list(updates.keys())}"


# ══════════════════════════════════════════════════════════
# MEMORY STORAGE & RETRIEVAL
# ══════════════════════════════════════════════════════════

def store_memory(
    user_id:     str,
    content:     str,
    memory_type: str = "fact",
    importance:  int = 5,
    session_id:  str = "",
    tags:        str = ""
) -> str:
    """
    Store a discrete memory (fact, preference, issue, resolution).

    Args:
        user_id:     Who this memory belongs to
        content:     The memory text
        memory_type: Category: "fact", "preference", "issue", "resolution", "complaint"
        importance:  1 (trivial) to 10 (critical) — affects retrieval priority
        session_id:  Which session this came from
        tags:        CSV tags for filtering (e.g., "billing,refund,escalated")

    Returns:
        Confirmation with memory ID.
    """
    with get_db() as conn:
        cursor = conn.execute(
            """INSERT INTO memories (user_id, session_id, memory_type, content, importance, tags)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (user_id, session_id, memory_type, content, importance, tags)
        )
        mem_id = cursor.lastrowid

    return f"Memory #{mem_id} stored [{memory_type}, importance={importance}]: {content[:60]}"


def recall_memories(
    user_id:     str,
    memory_type: str   = "",
    min_importance: int = 1,
    limit:       int   = 10,
    keyword:     str   = ""
) -> list[dict]:
    """
    Retrieve memories for a user, with optional filtering.

    Args:
        user_id:        Whose memories to retrieve
        memory_type:    Filter by type (empty = all types)
        min_importance: Only return memories at or above this level (1-10)
        limit:          Max memories to return (most recent first)
        keyword:        Optional keyword filter on content

    Returns:
        List of memory dicts, sorted by importance then recency.
    """
    conditions = ["user_id = ?"]
    params     = [user_id]

    if memory_type:
        conditions.append("memory_type = ?")
        params.append(memory_type)

    if min_importance > 1:
        conditions.append("importance >= ?")
        params.append(min_importance)

    if keyword:
        conditions.append("content LIKE ?")
        params.append(f"%{keyword}%")

    where_clause = " AND ".join(conditions)
    params.append(limit)

    with get_db() as conn:
        rows = conn.execute(
            f"""SELECT * FROM memories
                WHERE {where_clause}
                ORDER BY importance DESC, created_at DESC
                LIMIT ?""",
            params
        ).fetchall()

    return [dict(row) for row in rows]


def format_memories_for_llm(memories: list[dict]) -> str:
    """
    Format retrieved memories into a clean string for injection
    into the system prompt or user message.

    This is the bridge between your database and the LLM.
    The LLM reads this string and "knows" the user's history.
    """
    if not memories:
        return "No relevant memories found for this user."

    lines = ["Relevant memories about this user:"]
    for m in memories:
        importance_str = "★" * min(m["importance"] // 2, 5)   # visual importance indicator
        type_emoji = {
            "fact":       "📌",
            "preference": "💛",
            "issue":      "⚠️",
            "resolution": "✅",
            "complaint":  "🔴",
        }.get(m["memory_type"], "📝")

        lines.append(
            f"  {type_emoji} [{m['memory_type'].upper()}] {importance_str}\n"
            f"     {m['content']}\n"
            f"     (from: {m['created_at'][:10]})"
        )

    return "\n".join(lines)


# ══════════════════════════════════════════════════════════
# SESSION MANAGEMENT
# ══════════════════════════════════════════════════════════

def start_session(user_id: str) -> str:
    """Create a new conversation session and return its ID."""
    import uuid
    session_id = str(uuid.uuid4())[:8]      # short 8-char ID for readability

    with get_db() as conn:
        conn.execute(
            "INSERT INTO sessions (session_id, user_id) VALUES (?, ?)",
            (session_id, user_id)
        )

    return session_id


def end_session(session_id: str, summary: str = "", message_count: int = 0) -> None:
    """Mark a session as ended, save summary and message count."""
    with get_db() as conn:
        conn.execute(
            """UPDATE sessions
               SET ended_at = ?, summary = ?, message_count = ?
               WHERE session_id = ?""",
            (datetime.now().isoformat(), summary, message_count, session_id)
        )


def get_recent_sessions(user_id: str, limit: int = 3) -> list[dict]:
    """Get the most recent sessions for a user, newest first."""
    with get_db() as conn:
        rows = conn.execute(
            """SELECT session_id, started_at, ended_at, message_count, summary
               FROM sessions WHERE user_id = ?
               ORDER BY started_at DESC LIMIT ?""",
            (user_id, limit)
        ).fetchall()
    return [dict(r) for r in rows]


# ── Demo ──────────────────────────────────────────────────
if __name__ == "__main__":
    initialize_memory_db()

    # Simulate a first session with a user
    user = get_or_create_user("alice@hospital.com", name="Alice Chen", email="alice@hospital.com")
    print(f"\nUser: {user['name']} (new={user['created_at'] == user.get('updated_at', '')})")

    update_user_profile("alice@hospital.com", role="Head Nurse", company="City General Hospital")
    session_id = start_session("alice@hospital.com")

    store_memory("alice@hospital.com", "Alice is the Head Nurse at City General Hospital.",
                 memory_type="fact", importance=8, session_id=session_id)
    store_memory("alice@hospital.com", "Alice prefers concise, bullet-point responses.",
                 memory_type="preference", importance=7, session_id=session_id)
    store_memory("alice@hospital.com", "Alice reported billing error: charged twice for March.",
                 memory_type="issue", importance=9, session_id=session_id, tags="billing,duplicate")

    # Simulate session 2 — recall memories
    print("\n--- SESSION 2: Recalling memories ---")
    memories = recall_memories("alice@hospital.com", min_importance=6)
    print(format_memories_for_llm(memories))
```

---

## 4. Semantic Memory — ChromaDB Vector Search

Long-term memory is great for structured facts about specific users. But what if your agent needs to search through **thousands of past support tickets** or **an entire product documentation library** to find the *most relevant* information? That's semantic memory — and it needs **vector embeddings**.

```
WHY KEYWORD SEARCH FAILS FOR AGENTS:
════════════════════════════════════════════════════════════════

  USER ASKS:  "My login keeps failing after I changed my email"

  DATABASE HAS:
    Ticket #1021: "authentication error after account update"
    Ticket #1055: "Can't sign in following profile modification"
    Ticket #1089: "password reset not working"

  KEYWORD SEARCH ("login failing email"):
    → Ticket #1089 matches "email"? No exact matches!
    → Returns 0 results. ← WRONG!

  VECTOR SEARCH (semantic similarity):
    → Embed "My login keeps failing after I changed my email"
    → Find nearest embedding vectors in the database
    → Ticket #1021: similarity 0.91 ← "authentication error after account update"
    → Ticket #1055: similarity 0.88 ← "Can't sign in following profile modification"
    → Returns both! ← CORRECT!

  Why? Because embeddings capture MEANING, not keywords.
  "login" ≈ "authentication" ≈ "sign in"
  "email" ≈ "account" ≈ "profile"
  The semantic space understands these are equivalent.
```

### How Embeddings Work

```
EMBEDDING: TURNING TEXT INTO NUMBERS FOR COMPARISON
════════════════════════════════════════════════════════════════

  "login failing"    → [0.12, -0.34, 0.78, ..., 0.45]  (1536 numbers)
  "authentication"   → [0.11, -0.36, 0.81, ..., 0.43]  (1536 numbers)
  "cooking recipes"  → [-0.89, 0.12, -0.23, ..., -0.67] (1536 numbers)

  Cosine Similarity:
    "login failing" vs "authentication" → 0.94 (VERY similar!) ✅
    "login failing" vs "cooking recipes" → 0.08 (very different) ✗

  ┌──────────────────────────────────────────────────────────┐
  │            EMBEDDING SPACE (simplified to 2D)            │
  │                                                          │
  │  ●  authentication         ● login                       │
  │  ●  sign in   ←close→      ● password                   │
  │                                                          │
  │                                                          │
  │                                     ● cooking            │
  │                                     ● recipes            │
  │                                     ● kitchen            │
  └──────────────────────────────────────────────────────────┘
  Related concepts cluster together in 1536-dimensional space.
  Vector search finds the closest cluster to your query.
```

```python
# =========================================================
# FILE: memory_semantic_chroma.py
# Semantic memory using ChromaDB (fully local, no API key needed).
# ChromaDB stores embeddings + documents on your local machine.
# pip install chromadb openai python-dotenv
# =========================================================

import os
import json
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# ChromaDB: a fully local vector database.
# No cloud account needed. Data persists to disk automatically.
# Perfect for development; scales to millions of docs in production.
import chromadb
from chromadb.utils import embedding_functions


# ══════════════════════════════════════════════════════════
# STEP 1: SET UP CHROMADB
# ══════════════════════════════════════════════════════════

def create_chroma_client(persist_dir: str = "./chroma_data") -> chromadb.ClientAPI:
    """
    Create a persistent ChromaDB client.
    Data is saved to disk in persist_dir — survives process restarts.
    This is equivalent to connecting to a database.

    Args:
        persist_dir: Directory to store the vector database files.

    Returns:
        ChromaDB client instance.
    """
    # PersistentClient saves data to disk automatically.
    # Alternative: chromadb.Client() for in-memory only (testing).
    chroma_client = chromadb.PersistentClient(path=persist_dir)
    print(f"✅ ChromaDB connected. Data dir: {persist_dir}")
    return chroma_client


def get_or_create_collection(
    chroma_client: chromadb.ClientAPI,
    collection_name: str = "support_memory"
) -> chromadb.Collection:
    """
    Get or create a ChromaDB collection (analogous to a table in SQL).
    Uses OpenAI's text-embedding-3-small for embedding generation.

    Args:
        chroma_client:   The ChromaDB client
        collection_name: Name of the collection to use or create

    Returns:
        ChromaDB Collection object for adding/querying documents.
    """
    # Define the embedding function — converts text → vectors.
    # OpenAI's text-embedding-3-small:
    #   • 1536 dimensions
    #   • Fast, cheap ($0.02 per 1M tokens)
    #   • Excellent for English text
    openai_ef = embedding_functions.OpenAIEmbeddingFunction(
        api_key=os.environ.get("OPENAI_API_KEY"),
        model_name="text-embedding-3-small"
        # Other options:
        # "text-embedding-3-large" → 3072 dims, more accurate, 2x cost
        # "text-embedding-ada-002" → legacy, 1536 dims, slightly less accurate
    )

    # get_or_create_collection: idempotent — safe to call multiple times.
    # If "support_memory" already exists, it returns the existing one.
    # If not, it creates a new empty collection.
    collection = chroma_client.get_or_create_collection(
        name=collection_name,
        embedding_function=openai_ef,
        metadata={
            "description": "Customer support ticket memory",
            "hnsw:space":  "cosine"    # use cosine similarity (best for text)
            # other options: "l2" (Euclidean), "ip" (inner product)
        }
    )

    print(f"✅ Collection '{collection_name}' ready. Documents: {collection.count()}")
    return collection


# ══════════════════════════════════════════════════════════
# STEP 2: ADD DOCUMENTS TO SEMANTIC MEMORY
# ══════════════════════════════════════════════════════════

def add_to_semantic_memory(
    collection:  chromadb.Collection,
    text:        str,
    doc_id:      str,
    metadata:    dict = None
) -> str:
    """
    Add a single document to semantic memory.
    ChromaDB automatically generates the embedding via OpenAI.

    Args:
        collection: The ChromaDB collection to add to
        text:       The text content to store and make searchable
        doc_id:     Unique ID for this document (e.g., "ticket-1021")
        metadata:   Optional dict of filterable metadata fields
                    (must be strings, ints, floats, or bools — no nested dicts)

    Returns:
        Confirmation string.
    """
    # Ensure metadata values are primitive types (ChromaDB requirement)
    safe_metadata = {}
    for k, v in (metadata or {}).items():
        if isinstance(v, (str, int, float, bool)):
            safe_metadata[k] = v
        else:
            safe_metadata[k] = str(v)    # convert complex types to string

    # Add timestamp if not provided
    safe_metadata.setdefault("added_at", datetime.now().isoformat()[:10])

    try:
        collection.add(
            documents=[text],     # ← the text that gets embedded
            ids=[doc_id],         # ← unique ID (must be unique per collection)
            metadatas=[safe_metadata]
            # ChromaDB will call OpenAI's embedding API automatically
            # using the embedding_function we set in get_or_create_collection()
        )
        return f"✅ Added to semantic memory: [{doc_id}] {text[:60]}..."
    except Exception as e:
        if "already exists" in str(e).lower():
            return f"Document '{doc_id}' already in memory (no update needed)."
        return f"Error adding to semantic memory: {e}"


def bulk_add_to_semantic_memory(
    collection: chromadb.Collection,
    documents:  list[dict]
) -> str:
    """
    Add multiple documents in one API call — much more efficient.
    ChromaDB batches the embedding requests automatically.

    Args:
        collection: ChromaDB collection
        documents:  List of dicts, each with "id", "text", and "metadata"

    Returns:
        Summary of what was added.
    """
    # ChromaDB's max batch size is ~5000. For larger sets, chunk it.
    BATCH_SIZE = 100

    all_ids      = [d["id"]   for d in documents]
    all_texts    = [d["text"] for d in documents]
    all_metadata = [d.get("metadata", {}) for d in documents]

    # Convert metadata values to primitive types
    safe_metas = []
    for meta in all_metadata:
        safe_metas.append({
            k: v if isinstance(v, (str, int, float, bool)) else str(v)
            for k, v in meta.items()
        })

    try:
        collection.add(
            documents=all_texts,    # ChromaDB embeds all at once (batched)
            ids=all_ids,
            metadatas=safe_metas
        )
        return f"✅ Added {len(documents)} documents to semantic memory."
    except Exception as e:
        return f"Bulk add error: {e}"


# ══════════════════════════════════════════════════════════
# STEP 3: SEARCH SEMANTIC MEMORY
# ══════════════════════════════════════════════════════════

def semantic_search(
    collection:  chromadb.Collection,
    query:       str,
    n_results:   int  = 5,
    where:       dict = None,
    min_score:   float = 0.3
) -> list[dict]:
    """
    Find the most semantically similar documents to a query.
    This is the core RAG retrieval operation.

    Args:
        collection:  ChromaDB collection to search
        query:       The search query (will be embedded automatically)
        n_results:   How many similar docs to return (default 5)
        where:       Optional metadata filter dict
                     e.g., {"category": "billing"} or {"user_id": "alice"}
        min_score:   Minimum similarity threshold (0.0 to 1.0)
                     Documents below this are excluded.
                     Note: ChromaDB returns "distances" not "similarities"
                     Distance = 1 - similarity for cosine.

    Returns:
        List of result dicts with text, metadata, and similarity score.
    """
    # Build the query call
    query_kwargs = {
        "query_texts": [query],      # ChromaDB embeds this automatically
        "n_results":   min(n_results, collection.count() or 1),
        "include":     ["documents", "metadatas", "distances"]
        # "distances": ChromaDB uses distance (lower = more similar for cosine)
        # similarity = 1 - distance (so 0.0 distance = 1.0 similarity)
    }

    if where:
        query_kwargs["where"] = where
        # where supports: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
        # Example: {"$and": [{"category": {"$eq": "billing"}}, {"importance": {"$gte": 7}}]}

    results = collection.query(**query_kwargs)

    # Unpack results (ChromaDB returns nested lists because you can query multiple texts)
    docs       = results["documents"][0]       # ← [0] because we passed 1 query
    metas      = results["metadatas"][0]
    distances  = results["distances"][0]

    # Convert to clean list of dicts
    output = []
    for doc, meta, dist in zip(docs, metas, distances):
        similarity = round(1.0 - dist, 4)     # convert distance to similarity score
        if similarity >= min_score:            # filter by minimum score
            output.append({
                "text":       doc,
                "metadata":   meta,
                "similarity": similarity,
            })

    # Sort by similarity (highest first)
    output.sort(key=lambda x: x["similarity"], reverse=True)
    return output


def format_search_results_for_llm(
    results: list[dict],
    max_chars_per_result: int = 400
) -> str:
    """
    Format semantic search results for injection into the LLM context.
    Compact format: preserves meaning, minimizes tokens.

    Args:
        results:              List from semantic_search()
        max_chars_per_result: Truncate each result to this length

    Returns:
        Formatted string ready to inject into the system prompt.
    """
    if not results:
        return "No relevant information found in semantic memory."

    lines = [f"Relevant context from knowledge base ({len(results)} results):"]
    lines.append("─" * 55)

    for i, r in enumerate(results, 1):
        score_bar = "█" * int(r["similarity"] * 10)   # visual similarity bar
        meta_str  = " | ".join(f"{k}={v}" for k, v in r["metadata"].items()
                               if k not in ("added_at",))

        text_preview = r["text"][:max_chars_per_result]
        if len(r["text"]) > max_chars_per_result:
            text_preview += "..."

        lines.append(
            f"[{i}] Similarity: {r['similarity']:.2f} {score_bar}\n"
            f"     Meta: {meta_str}\n"
            f"     {text_preview}\n"
        )

    return "\n".join(lines)


# ── Demo: Build a support knowledge base ──────────────────
if __name__ == "__main__":
    chroma = create_chroma_client()
    collection = get_or_create_collection(chroma, "support_kb")

    # Add sample support tickets
    sample_tickets = [
        {
            "id":   "ticket-001",
            "text": "Customer unable to login after changing email address. Issue: authentication token bound to old email. Resolution: manually reset auth token and resend verification.",
            "metadata": {"category": "authentication", "status": "resolved", "importance": 8}
        },
        {
            "id":   "ticket-002",
            "text": "Duplicate charge on credit card for monthly subscription. Refund of $99 issued. Root cause: payment webhook fired twice due to timeout retry.",
            "metadata": {"category": "billing", "status": "resolved", "importance": 9}
        },
        {
            "id":   "ticket-003",
            "text": "User cannot access dashboard after password reset. Browser cache issue. Fix: clear cookies and hard refresh (Ctrl+Shift+R).",
            "metadata": {"category": "authentication", "status": "resolved", "importance": 7}
        },
        {
            "id":   "ticket-004",
            "text": "Data export feature producing empty CSV files. Bug confirmed in v2.3.1. Workaround: use API endpoint /export?format=json until patch released.",
            "metadata": {"category": "bug", "status": "workaround", "importance": 8}
        },
        {
            "id":   "ticket-005",
            "text": "Account locked after 5 failed login attempts. Password reset email not delivered. Add customer email to allowlist to bypass spam filter.",
            "metadata": {"category": "authentication", "status": "resolved", "importance": 8}
        },
    ]

    result = bulk_add_to_semantic_memory(collection, sample_tickets)
    print(result)

    # Test semantic search
    print("\n--- Semantic Search Test ---")
    query  = "I can't log into my account after updating my profile"
    hits   = semantic_search(collection, query, n_results=3)
    output = format_search_results_for_llm(hits)
    print(f"\nQuery: '{query}'")
    print(output)
```

---

## 5. Pinecone — Production Vector Database

ChromaDB is perfect for local development, but for a real production system serving thousands of users, you need a **managed cloud vector database**. Enter Pinecone — the industry standard for production semantic search.

```
CHROMADB vs PINECONE — WHEN TO USE WHICH:
════════════════════════════════════════════════════════════════

  ChromaDB                        Pinecone
  ──────────────────────────      ─────────────────────────────
  Fully local, no API key         Cloud-managed, needs API key
  Zero configuration              Simple API setup
  Perfect for dev / testing       Production at any scale
  File-based persistence          Replicated, durable, HA
  Free forever                    Free tier: 100k vectors
  Max: millions of vectors        Max: billions of vectors
  Single machine only             Global CDN, multi-region
  No SLA, no uptime guarantee     99.99% uptime SLA
  Open source, self-hostable      Fully managed, auto-scaling

  USE CHROMADB:                   USE PINECONE:
  → Development and testing       → Production apps
  → Proof of concept              → >1M vectors
  → Air-gapped / private env      → Need high availability
  → Budget is zero                → Multi-region needed
```

```python
# =========================================================
# FILE: memory_semantic_pinecone.py
# Semantic memory using Pinecone cloud vector database.
# pip install pinecone-client openai python-dotenv
# Get free API key: https://app.pinecone.io
# =========================================================

import os
import json
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")


# ══════════════════════════════════════════════════════════
# STEP 1: EMBEDDING HELPER
# ══════════════════════════════════════════════════════════
# Unlike ChromaDB, Pinecone does NOT auto-embed your text.
# You MUST generate the embedding yourself before adding/querying.
# This gives you more control over which embedding model you use.

def embed_text(text: str, model: str = "text-embedding-3-small") -> list[float]:
    """
    Convert text to an embedding vector using OpenAI.
    This is the embedding we store in (and query against) Pinecone.

    Args:
        text:  The text to embed
        model: Embedding model name

    Returns:
        List of floats (1536 dimensions for text-embedding-3-small)
    """
    # Strip and clean text — embedding quality degrades with leading/trailing whitespace
    text = text.strip()
    if not text:
        raise ValueError("Cannot embed empty text.")

    response = openai_client.embeddings.create(
        model=model,
        input=text,
        # encoding_format="float"  ← default, produces list of floats
        # encoding_format="base64" ← more efficient for large batches
    )
    return response.data[0].embedding
    # .data[0].embedding is a list of 1536 floats for text-embedding-3-small


def embed_batch(texts: list[str], model: str = "text-embedding-3-small") -> list[list[float]]:
    """
    Embed multiple texts in a single API call — much more efficient.
    OpenAI's embedding API supports up to 2048 inputs per call.

    Args:
        texts: List of text strings to embed
        model: Embedding model name

    Returns:
        List of embedding vectors (same order as input texts)
    """
    # Clean all texts
    texts = [t.strip() for t in texts if t.strip()]

    response = openai_client.embeddings.create(
        model=model,
        input=texts
    )
    # Response has .data sorted by index, so order matches input
    return [item.embedding for item in sorted(response.data, key=lambda x: x.index)]


# ══════════════════════════════════════════════════════════
# STEP 2: PINECONE SETUP
# ══════════════════════════════════════════════════════════

def setup_pinecone_index(
    index_name:  str = "support-memory",
    dimension:   int = 1536,      # must match your embedding model's output size
    metric:      str = "cosine"   # "cosine" for text similarity
) -> object:
    """
    Connect to Pinecone and get (or create) an index.
    An index is like a database table — stores your vectors.

    Args:
        index_name: Name of the Pinecone index
        dimension:  Vector size — MUST match embedding model:
                      text-embedding-3-small  → 1536
                      text-embedding-3-large  → 3072
                      text-embedding-ada-002  → 1536
        metric:     Distance metric:
                      "cosine"     → best for text similarity (normalized vectors)
                      "euclidean"  → best for continuous data
                      "dotproduct" → best when magnitude matters

    Returns:
        Pinecone Index object (use .upsert(), .query(), .delete())
    """
    if not PINECONE_API_KEY:
        raise ValueError("PINECONE_API_KEY not set in .env file")

    # Initialize the Pinecone client
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # Check if index already exists
    existing_indexes = [idx.name for idx in pc.list_indexes()]

    if index_name not in existing_indexes:
        print(f"Creating new Pinecone index: '{index_name}'...")
        pc.create_index(
            name=index_name,
            dimension=dimension,
            metric=metric,
            spec=ServerlessSpec(
                cloud="aws",       # AWS or GCP
                region="us-east-1" # choose the region closest to your users
                # Pinecone free tier: us-east-1 on AWS
            )
        )
        print(f"✅ Index '{index_name}' created.")
    else:
        print(f"✅ Connected to existing index '{index_name}'.")

    # Get the index object for operations
    index = pc.Index(index_name)

    # Show index stats
    stats = index.describe_index_stats()
    print(f"   Total vectors: {stats['total_vector_count']:,}")
    print(f"   Namespaces:    {list(stats.get('namespaces', {}).keys()) or ['(default)']}")

    return index


# ══════════════════════════════════════════════════════════
# STEP 3: ADD DOCUMENTS TO PINECONE
# ══════════════════════════════════════════════════════════

def upsert_to_pinecone(
    index:      object,
    doc_id:     str,
    text:       str,
    metadata:   dict = None,
    namespace:  str  = ""
) -> str:
    """
    Add or update a document in Pinecone.
    "Upsert" = insert if new, update if ID already exists.
    This is safe to call multiple times with the same ID.

    Args:
        index:     Pinecone index object
        doc_id:    Unique ID for this vector (e.g., "ticket-1021")
        text:      The text to embed and store
        metadata:  Key-value metadata for filtering.
                   IMPORTANT: always include the original text in metadata!
                   Pinecone stores vectors — the text is NOT stored unless you add it.
        namespace: Logical partition within the index
                   Use to separate: "tickets", "faqs", "user-notes", etc.
                   Queries within a namespace only search that namespace.

    Returns:
        Confirmation string.
    """
    # Generate the embedding
    embedding = embed_text(text)

    # Always store the text in metadata — Pinecone only stores the vector,
    # not the original text. If you don't save it in metadata, you lose it.
    full_metadata = {"text": text, **(metadata or {})}

    # Ensure all metadata values are Pinecone-compatible types
    safe_metadata = {}
    for k, v in full_metadata.items():
        if isinstance(v, (str, int, float, bool)):
            safe_metadata[k] = v
        elif isinstance(v, list):
            # Pinecone supports list values for filtering
            safe_metadata[k] = v
        else:
            safe_metadata[k] = str(v)

    # Pinecone "upsert" takes a list of tuples: (id, vector, metadata)
    index.upsert(
        vectors=[(doc_id, embedding, safe_metadata)],
        namespace=namespace
    )

    return f"✅ Upserted to Pinecone: [{doc_id}] {text[:50]}..."


def bulk_upsert_to_pinecone(
    index:     object,
    documents: list[dict],
    namespace: str = "",
    batch_size: int = 100
) -> str:
    """
    Add multiple documents efficiently using batch embedding + batch upsert.
    This is significantly faster and cheaper than one-at-a-time.

    Args:
        index:     Pinecone index
        documents: List of {id, text, metadata} dicts
        namespace: Pinecone namespace
        batch_size: How many to upsert per batch (Pinecone limit: 100)

    Returns:
        Summary of what was upserted.
    """
    # Batch embed all texts at once — one API call instead of N
    texts      = [d["text"] for d in documents]
    embeddings = embed_batch(texts)

    # Build vector tuples for Pinecone
    vectors = []
    for doc, embedding in zip(documents, embeddings):
        meta = {"text": doc["text"], **doc.get("metadata", {})}
        safe_meta = {k: v if isinstance(v, (str, int, float, bool)) else str(v)
                     for k, v in meta.items()}
        vectors.append((doc["id"], embedding, safe_meta))

    # Upsert in batches (Pinecone recommends max 100 per batch)
    total_upserted = 0
    for i in range(0, len(vectors), batch_size):
        batch = vectors[i:i + batch_size]
        index.upsert(vectors=batch, namespace=namespace)
        total_upserted += len(batch)
        print(f"  Upserted batch {i//batch_size + 1}: {total_upserted}/{len(vectors)} vectors")

    return f"✅ Bulk upserted {total_upserted} documents to Pinecone namespace='{namespace}'"


# ══════════════════════════════════════════════════════════
# STEP 4: QUERY PINECONE
# ══════════════════════════════════════════════════════════

def query_pinecone(
    index:       object,
    query_text:  str,
    top_k:       int   = 5,
    namespace:   str   = "",
    filter_dict: dict  = None,
    min_score:   float = 0.5
) -> list[dict]:
    """
    Semantic search in Pinecone.
    Embeds the query and finds the most similar stored vectors.

    Args:
        index:       Pinecone index
        query_text:  Natural language query to search for
        top_k:       Number of results to return
        namespace:   Which namespace to search
        filter_dict: Pinecone metadata filter
                     e.g., {"category": {"$eq": "billing"}}
                           {"importance": {"$gte": 7}}
        min_score:   Minimum similarity to include (0.0 to 1.0)

    Returns:
        List of result dicts with text, metadata, and score.
    """
    # Embed the query using the SAME model as at upsert time!
    # Mixing models (ada-002 for documents, text-embedding-3-small for query)
    # produces completely wrong results — a very sneaky bug.
    query_embedding = embed_text(query_text)

    # Build query kwargs
    query_kwargs = {
        "vector":          query_embedding,
        "top_k":           top_k,
        "namespace":       namespace,
        "include_metadata": True,    # return metadata including stored text
        "include_values":  False,    # don't return raw vectors (saves bandwidth)
    }

    if filter_dict:
        query_kwargs["filter"] = filter_dict
        # Filter examples:
        # {"category": {"$eq": "billing"}}         → exact match
        # {"importance": {"$gte": 7}}              → greater than or equal
        # {"tags": {"$in": ["escalated", "vip"]}}  → value in list

    results = index.query(**query_kwargs)

    # Format results
    output = []
    for match in results["matches"]:
        score = round(match["score"], 4)      # cosine similarity (0-1)
        if score < min_score:
            continue                           # skip low-relevance results

        meta = match.get("metadata", {})
        text = meta.pop("text", "")           # extract stored text from metadata

        output.append({
            "id":         match["id"],
            "text":       text,
            "metadata":   meta,
            "similarity": score,
        })

    return output


# ── Demonstration ──────────────────────────────────────────
if __name__ == "__main__":
    # Comment this out if you don't have a Pinecone key yet.
    # The ChromaDB version (Section 4) works without any cloud keys.
    print("Pinecone demo requires PINECONE_API_KEY in .env")
    print("Get a free key at: https://app.pinecone.io")
    print("The ChromaDB version in Section 4 works without any cloud keys.")
```

---

## 6. The RAG Pipeline — Retrieval-Augmented Generation

Now we connect everything. **RAG (Retrieval-Augmented Generation)** is the pattern that makes your agent intelligent about a specific knowledge domain — without retraining the model. It retrieves relevant context *at query time* and injects it into the prompt.

```
THE RAG PIPELINE — FULL FLOW:
════════════════════════════════════════════════════════════════

  OFFLINE (Index Building — done once):
  ──────────────────────────────────────────────────────────
  Your Docs                   Vector Database
  ┌──────────────┐            ┌──────────────────────────┐
  │ FAQ article  │  embed()   │ [0.12, -0.34, 0.78, ...] │
  │ Support ticket├──────────►│ ID: "ticket-001"         │
  │ Product docs │            │ Text: "can't login after" │
  │ Policy PDF   │            │ Meta: {category:"auth"}  │
  └──────────────┘            └──────────────────────────┘

  ONLINE (Query Time — happens for every user message):
  ──────────────────────────────────────────────────────────

  User: "My login fails after changing email"
     │
     ▼
  1. EMBED the user query → [0.11, -0.36, 0.81, ...]
     │
     ▼
  2. SEARCH vector DB → top 3 similar documents
     │ • ticket-001 (sim: 0.94): "can't login after email change..."
     │ • ticket-003 (sim: 0.88): "login issue after password reset..."
     │ • faq-012   (sim: 0.81): "authentication troubleshooting..."
     ▼
  3. INJECT retrieved docs into the LLM prompt
     │
     │  System prompt + retrieved context:
     │  "You are a support agent. Use this context:
     │   [ticket-001]: can't login after email change...
     │   [ticket-003]: login issue after password reset..."
     │
     ▼
  4. LLM GENERATES answer grounded in real retrieved data
     │
     ▼
  User gets: "This is a known issue. After changing your email,
              the auth token can become invalid. To fix:
              1) Request a new verification email
              2) Clear browser cookies
              3) Try logging in with your NEW email address."

  The LLM didn't know this — it was retrieved from past tickets! ✅
```

```python
# =========================================================
# FILE: rag_pipeline.py
# Complete RAG pipeline: index builder + query-time retrieval.
# Uses ChromaDB (local) — swap collection for Pinecone in prod.
# pip install chromadb openai python-dotenv
# =========================================================

import os
import json
from openai import OpenAI
from dotenv import load_dotenv
import chromadb
from chromadb.utils import embedding_functions

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


# ══════════════════════════════════════════════════════════
# STEP 1: DOCUMENT CHUNKING
# ══════════════════════════════════════════════════════════
# Large documents need to be split into chunks before embedding.
# Why? Two reasons:
# 1. Embedding models have token limits (~8000 tokens for text-embedding-3-small)
# 2. Smaller, focused chunks retrieve more precisely

def chunk_document(
    text:        str,
    chunk_size:  int = 500,    # characters per chunk (approx 125 tokens)
    overlap:     int = 100     # overlap between chunks (preserves context at boundaries)
) -> list[str]:
    """
    Split a document into overlapping chunks for embedding.

    Args:
        text:       The full document text
        chunk_size: Characters per chunk (500 chars ≈ 125 tokens)
        overlap:    Characters repeated between adjacent chunks.
                    Overlap prevents losing context that spans boundaries.
                    E.g., if a sentence starts at position 490, it falls
                    entirely in the next chunk with overlap.

    Returns:
        List of text chunks.

    Chunking strategy options:
      - Fixed character size (what we do here — simple, works well)
      - Sentence boundary (split at "." — preserves sentence integrity)
      - Paragraph boundary (split at "\n\n" — good for docs with structure)
      - Semantic chunking (uses embeddings to find natural topic boundaries — expensive)
    """
    chunks = []
    start  = 0

    while start < len(text):
        end   = start + chunk_size
        chunk = text[start:end]

        # Don't create very tiny chunks at the end
        if len(chunk) > 50:
            chunks.append(chunk.strip())

        # Move forward by (chunk_size - overlap) to create the next chunk
        start += chunk_size - overlap

    return chunks


def chunk_and_index(
    collection:    chromadb.Collection,
    document_text: str,
    doc_id_prefix: str,
    metadata:      dict = None
) -> int:
    """
    Chunk a document and add all chunks to the collection.
    Each chunk gets a unique ID like "faq-001-chunk-0", "faq-001-chunk-1", etc.

    Args:
        collection:    ChromaDB collection
        document_text: Full document text
        doc_id_prefix: Prefix for chunk IDs (e.g., "faq-001")
        metadata:      Metadata to attach to every chunk

    Returns:
        Number of chunks added.
    """
    chunks = chunk_document(document_text)

    ids       = [f"{doc_id_prefix}-chunk-{i}" for i in range(len(chunks))]
    metas     = [{**(metadata or {}), "chunk_index": i, "total_chunks": len(chunks)}
                 for i in range(len(chunks))]

    collection.add(
        documents=ids,
        ids=ids,
        metadatas=metas
    )

    # Override: actually add the text (ChromaDB's `documents` param should be text)
    collection.upsert(
        documents=chunks,     # ← the actual text content
        ids=ids,
        metadatas=metas
    )

    return len(chunks)


# ══════════════════════════════════════════════════════════
# STEP 2: THE RAG RETRIEVER
# ══════════════════════════════════════════════════════════

class RAGRetriever:
    """
    Handles retrieval for the RAG pipeline.
    Wraps ChromaDB search with prompt formatting.
    """

    def __init__(self, collection: chromadb.Collection):
        self.collection = collection

    def retrieve(
        self,
        query:       str,
        n_results:   int   = 4,
        where:       dict  = None,
        min_score:   float = 0.4
    ) -> list[dict]:
        """
        Retrieve relevant documents for a query.
        This is the R in RAG — pure retrieval, no generation.

        Args:
            query:     Natural language query
            n_results: Number of results to retrieve
            where:     Optional ChromaDB metadata filter
            min_score: Minimum cosine similarity threshold

        Returns:
            List of {text, metadata, similarity} dicts.
        """
        if self.collection.count() == 0:
            return []   # no documents in collection

        query_params = {
            "query_texts": [query],
            "n_results":   min(n_results, self.collection.count()),
            "include":     ["documents", "metadatas", "distances"]
        }
        if where:
            query_params["where"] = where

        results  = self.collection.query(**query_params)
        docs     = results["documents"][0]
        metas    = results["metadatas"][0]
        distances = results["distances"][0]

        output = []
        for doc, meta, dist in zip(docs, metas, distances):
            sim = round(1.0 - dist, 4)
            if sim >= min_score:
                output.append({"text": doc, "metadata": meta, "similarity": sim})

        output.sort(key=lambda x: x["similarity"], reverse=True)
        return output

    def build_context_string(
        self,
        results:       list[dict],
        max_tokens:    int = 1500,
        header:        str = "Relevant knowledge base context:"
    ) -> str:
        """
        Format retrieval results into a context string for the LLM.
        This is what gets injected into the prompt.

        Args:
            results:    From retrieve()
            max_tokens: Approximate token budget (1 token ≈ 4 chars)
            header:     Header line for the context block

        Returns:
            Formatted context string.
        """
        if not results:
            return ""

        max_chars = max_tokens * 4   # rough estimate
        lines     = [header, "─" * 55]
        chars_used = len(header) + 58

        for i, r in enumerate(results, 1):
            # Format metadata compactly
            meta_parts = [f"{k}: {v}" for k, v in r["metadata"].items()
                          if k not in ("chunk_index", "total_chunks", "added_at")]
            meta_str = " | ".join(meta_parts)

            entry = (
                f"[Source {i}] (Relevance: {r['similarity']:.2f})\n"
                f"{meta_str}\n"
                f"{r['text']}\n"
            )

            if chars_used + len(entry) > max_chars:
                lines.append(f"[...{len(results) - i + 1} more sources omitted for brevity]")
                break

            lines.append(entry)
            chars_used += len(entry)

        return "\n".join(lines)


# ══════════════════════════════════════════════════════════
# STEP 3: RAG-POWERED LLM CALL
# ══════════════════════════════════════════════════════════

def rag_query(
    retriever:   RAGRetriever,
    user_query:  str,
    system_base: str,
    model:       str = "gpt-4o-mini",
    n_results:   int = 4
) -> str:
    """
    Full RAG query: retrieve relevant context → inject → generate.
    This is the complete Retrieval-Augmented Generation pattern.

    Args:
        retriever:   RAGRetriever instance
        user_query:  The user's question
        system_base: Base system prompt (role definition, rules)
        model:       LLM model to use
        n_results:   How many docs to retrieve

    Returns:
        LLM response grounded in retrieved context.
    """
    # ── RETRIEVE ──────────────────────────────────────────
    # Step 1: Find relevant docs for this query
    results = retriever.retrieve(user_query, n_results=n_results)
    context = retriever.build_context_string(results)

    # ── AUGMENT ──────────────────────────────────────────
    # Step 2: Build the augmented system prompt.
    # We inject retrieved context BEFORE the user's question.
    # This ensures the LLM has the most relevant information
    # when it starts reasoning about the query.

    if context:
        augmented_system = (
            f"{system_base}\n\n"
            f"{context}\n\n"
            f"INSTRUCTIONS:\n"
            f"- Answer based on the context above when relevant.\n"
            f"- If the context doesn't address the question, say so.\n"
            f"- Always cite which source (Source 1, 2, etc.) informed your answer.\n"
            f"- Never make up information not contained in the sources."
        )
    else:
        augmented_system = (
            f"{system_base}\n\n"
            f"Note: No relevant knowledge base context found for this query. "
            f"Answer based on your general knowledge, but note this limitation."
        )

    # ── GENERATE ─────────────────────────────────────────
    # Step 3: Call the LLM with context-enriched prompt
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": augmented_system},
            {"role": "user",   "content": user_query}
        ],
        temperature=0.1,
        max_tokens=800,
    )

    return response.choices[0].message.content
```

---

## 7. Real Use Case: Customer Support Bot

Let's assemble the complete system. This is a production-quality customer support bot with **all four memory layers** working together.

```
CUSTOMER SUPPORT BOT — COMPLETE MEMORY ARCHITECTURE:
════════════════════════════════════════════════════════════════

  EVERY TIME A USER SENDS A MESSAGE:
  ───────────────────────────────────────────────────────────

  ┌─────────────────────────────────────────────────────────┐
  │  1. LOAD USER CONTEXT (Long-Term Memory)                │
  │     SQLite: load profile, recent sessions, memories     │
  │     → "Alice, Head Nurse, prefers concise answers"      │
  └────────────────────────┬────────────────────────────────┘
                           │
  ┌────────────────────────▼────────────────────────────────┐
  │  2. SEMANTIC SEARCH (Semantic Memory / RAG)             │
  │     ChromaDB: find relevant FAQ + past tickets          │
  │     → "2 past tickets match this login issue"           │
  └────────────────────────┬────────────────────────────────┘
                           │
  ┌────────────────────────▼────────────────────────────────┐
  │  3. BUILD CONTEXT-RICH SYSTEM PROMPT                    │
  │     Combine: base prompt + user profile + RAG context   │
  └────────────────────────┬────────────────────────────────┘
                           │
  ┌────────────────────────▼────────────────────────────────┐
  │  4. MANAGE CONVERSATION (Short-Term Memory)             │
  │     Add to messages[], apply sliding window if needed   │
  └────────────────────────┬────────────────────────────────┘
                           │
  ┌────────────────────────▼────────────────────────────────┐
  │  5. LLM GENERATES RESPONSE (with full context)          │
  └────────────────────────┬────────────────────────────────┘
                           │
  ┌────────────────────────▼────────────────────────────────┐
  │  6. SAVE NEW MEMORIES (Long-Term Memory Update)         │
  │     Extract entities from conversation, store memories  │
  │     "Alice reported billing issue on 2025-03-01"        │
  └─────────────────────────────────────────────────────────┘
```

```python
# =========================================================
# FILE: customer_support_bot.py
# Production customer support bot with all 4 memory layers.
# pip install openai chromadb python-dotenv
# =========================================================

import os
import json
import sqlite3
import uuid
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv

import chromadb
from chromadb.utils import embedding_functions

# Import our memory modules (defined in previous sections)
# In a real project these would be separate module imports

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


# ══════════════════════════════════════════════════════════
# SUPPORT BOT KNOWLEDGE BASE (Semantic Memory)
# ══════════════════════════════════════════════════════════

SUPPORT_KNOWLEDGE = [
    {
        "id": "faq-001",
        "text": """Login Issue After Email Change:
When a user changes their email address, the authentication token bound to the old email
becomes invalid. The user will be unable to log in.
Resolution Steps:
1. Request a new verification email from the login page.
2. Check spam/junk folder if email doesn't arrive within 5 minutes.
3. Click the verification link in the email.
4. Clear browser cookies and cache.
5. Log in with the NEW email address.
If issue persists after these steps, the account may need manual reset by Tier 2.""",
        "metadata": {"category": "authentication", "type": "faq", "importance": 9}
    },
    {
        "id": "faq-002",
        "text": """Duplicate Billing / Double Charge:
Root cause: Payment webhook occasionally fires twice due to timeout retry logic.
This results in the customer being charged twice for the same billing period.
Policy: All duplicate charges must be refunded within 24 hours.
Resolution Steps:
1. Verify in the billing system that two charges occurred same day/month.
2. If confirmed duplicate: issue full refund for one charge via Stripe dashboard.
3. Send written confirmation of refund to customer (3-5 business days to appear).
4. Log incident in billing-bugs tracker.
Refunds under $500 can be issued by Tier 1 agents. Over $500 requires manager approval.""",
        "metadata": {"category": "billing", "type": "faq", "importance": 10}
    },
    {
        "id": "faq-003",
        "text": """Data Export Producing Empty Files:
Known bug in versions 2.3.0–2.3.2 affecting CSV export.
Symptoms: Export button completes, file downloads but has zero rows.
Workaround (until patch): Use the API endpoint instead:
  GET /api/v2/export?format=csv&token=USER_API_TOKEN
  Or use: /api/v2/export?format=json for JSON format.
Permanent fix: Upgrade to version 2.3.3 or higher.
Bug report: https://github.com/company/app/issues/4421""",
        "metadata": {"category": "bug", "type": "faq", "importance": 8}
    },
    {
        "id": "faq-004",
        "text": """Account Locked After Failed Login Attempts:
Security policy: accounts lock after 5 consecutive failed login attempts.
Resolution Steps:
1. Wait 30 minutes (auto-unlocks) and try again.
2. Or: use "Forgot Password" to reset and unlock immediately.
3. If password reset email not received: check spam, or add support@company.com to contacts.
4. If email truly not arriving: verify email address matches what's on account.
   Some users have multiple emails and the account uses a different one.
Enterprise customers: can request admin unlock via the admin panel.""",
        "metadata": {"category": "authentication", "type": "faq", "importance": 8}
    },
    {
        "id": "policy-001",
        "text": """Refund Policy:
- Within 14 days of purchase: full refund, no questions asked.
- 15-30 days: 50% refund or account credit for 1 year.
- After 30 days: no cash refund. Account credit only.
- Exception: Billing errors (duplicate charges, wrong amount) → full refund anytime.
- Enterprise contracts: governed by contract terms, contact account manager.
Maximum refund per Tier 1 agent: $500 USD.
Refunds over $500 require Tier 2 manager approval.
Processing time: 3-5 business days for credit cards, 5-10 days for bank transfers.""",
        "metadata": {"category": "policy", "type": "policy", "importance": 9}
    },
    {
        "id": "policy-002",
        "text": """Escalation Policy:
Escalate to Tier 2 (Senior Support) when:
- Customer has asked for a manager or senior agent explicitly.
- Issue unresolved after 2 troubleshooting attempts.
- Legal threats or mentions of lawyers, lawsuits, regulatory complaints.
- Refund request exceeding $500.
- Data breach or security incident reports.
- Customer is a VIP (tagged in profile) or pays over $1000/month.
How to escalate: Use create_escalation_ticket() tool with full context.
SLA for Tier 2 response: 2 hours (business hours), 6 hours (after hours).""",
        "metadata": {"category": "policy", "type": "policy", "importance": 10}
    },
]


# ══════════════════════════════════════════════════════════
# SUPPORT BOT CLASS — orchestrates all memory systems
# ══════════════════════════════════════════════════════════

class CustomerSupportBot:
    """
    AI customer support agent with 4-layer memory architecture.

    Memory layers:
      1. Short-term:  messages[] with sliding window compression
      2. Long-term:   SQLite user profiles + episodic memories
      3. Semantic:    ChromaDB FAQ + ticket knowledge base
      4. Procedural:  System prompt encoding support policies

    Usage:
        bot = CustomerSupportBot()
        bot.setup()
        response = bot.chat(user_id="alice@hospital.com", message="I can't log in")
    """

    SYSTEM_PROMPT_BASE = """You are Aria, a customer support agent for Acme SaaS platform.

YOUR PERSONALITY:
- Professional, empathetic, efficient
- You remember returning customers and acknowledge their history
- You always verify facts before acting (check user profile, search knowledge base)
- If a resolution requires a refund over $500 or legal threats, ESCALATE immediately

YOUR TOOLS:
1. Reference the [USER CONTEXT] section for what you know about this customer.
2. Reference the [KNOWLEDGE BASE] section for company policies and known solutions.
3. For billing issues: ask for the invoice number before making changes.
4. For account issues: verify name and email before any account actions.

RESPONSE STYLE:
- Acknowledge the issue in 1 sentence.
- Provide resolution steps clearly (numbered list if multiple steps).
- End with: "Is there anything else I can help you with today?"
- Keep responses under 200 words unless the solution requires more detail.

ESCALATION TRIGGERS (say "Let me connect you with a senior specialist"):
- Customer mentions lawyer, lawsuit, or regulatory body
- Same issue occurring for the 3rd time
- Refund request > $500
- Customer asks for a manager
- Data breach or security concern"""

    def __init__(
        self,
        db_path:      str = "support_memory.db",
        chroma_path:  str = "./support_chroma",
        model:        str = "gpt-4o-mini"
    ):
        self.db_path     = db_path
        self.chroma_path = chroma_path
        self.model       = model
        self._sessions:  dict[str, list[dict]] = {}
        # _sessions: user_id → messages[]
        # In production: persist session state in Redis for multi-server deployments

    def setup(self) -> None:
        """Initialize database and load knowledge base into ChromaDB."""
        # ── Long-term memory DB ───────────────────────────
        self._init_db()
        print("✅ Long-term memory database ready.")

        # ── Semantic memory (ChromaDB) ────────────────────
        self._chroma_client = chromadb.PersistentClient(path=self.chroma_path)
        self._openai_ef     = embedding_functions.OpenAIEmbeddingFunction(
            api_key=os.environ.get("OPENAI_API_KEY"),
            model_name="text-embedding-3-small"
        )
        self._knowledge_col = self._chroma_client.get_or_create_collection(
            name="support_knowledge",
            embedding_function=self._openai_ef,
            metadata={"hnsw:space": "cosine"}
        )

        # Seed knowledge base if empty
        if self._knowledge_col.count() == 0:
            self._seed_knowledge_base()

        print(f"✅ Semantic memory ready. Documents: {self._knowledge_col.count()}")

    # ─── Chat Entry Point ──────────────────────────────────

    def chat(self, user_id: str, message: str) -> str:
        """
        Process a user message through all memory layers.
        Returns the agent's response string.

        Args:
            user_id: Unique user identifier (email, UUID, etc.)
            message: The user's message text

        Returns:
            Agent response string.
        """
        print(f"\n{'─'*60}")
        print(f"  💬 User [{user_id[:20]}]: {message[:70]}")

        # ── LAYER 1: Load long-term memory ────────────────
        user_profile   = self._get_or_create_user(user_id)
        past_memories  = self._get_memories(user_id, limit=5)
        user_context   = self._format_user_context(user_profile, past_memories)

        # ── LAYER 2: Semantic retrieval (RAG) ────────────
        kb_results     = self._semantic_search(message, n_results=3)
        kb_context     = self._format_kb_context(kb_results)

        # ── LAYER 3: Build system prompt with full context ─
        # This is the "Augmentation" step of RAG.
        # We inject user context + knowledge base context into the system prompt.
        full_system = self._build_system_prompt(user_context, kb_context)

        # ── LAYER 4: Short-term memory (conversation) ─────
        if user_id not in self._sessions:
            self._sessions[user_id] = []

        session = self._sessions[user_id]
        session.append({"role": "user", "content": message})

        # Apply sliding window to keep context manageable
        session = self._apply_sliding_window(session, max_messages=20)
        self._sessions[user_id] = session

        # ── Generate response ─────────────────────────────
        messages = [{"role": "system", "content": full_system}] + session

        print(f"  📚 Context: {len(kb_results)} KB docs | {len(past_memories)} memories")

        response = client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.2,    # Slight warmth for human-feeling support tone
            max_tokens=600,
        )
        agent_reply = response.choices[0].message.content

        # Add agent reply to session history
        self._sessions[user_id].append({
            "role":    "assistant",
            "content": agent_reply
        })

        # ── Save new memory from this interaction ─────────
        self._extract_and_save_memory(user_id, message, agent_reply)

        print(f"  🤖 Aria: {agent_reply[:80]}...")
        return agent_reply

    # ─── Memory Helper Methods ─────────────────────────────

    def _build_system_prompt(self, user_context: str, kb_context: str) -> str:
        """Assemble the full system prompt with all context injected."""
        sections = [self.SYSTEM_PROMPT_BASE]

        if user_context:
            sections.append(f"\n[USER CONTEXT]\n{user_context}")

        if kb_context:
            sections.append(f"\n[KNOWLEDGE BASE — use this to answer]\n{kb_context}")

        return "\n".join(sections)

    def _format_user_context(self, profile: dict, memories: list[dict]) -> str:
        """Format user profile and memories for prompt injection."""
        lines = []

        if profile.get("name"):
            lines.append(f"Customer Name: {profile['name']}")
        if profile.get("role"):
            lines.append(f"Role: {profile['role']} at {profile.get('company', 'unknown company')}")
        if profile.get("tags"):
            lines.append(f"Tags: {profile['tags']}")

        if memories:
            lines.append("\nRelevant past memories:")
            for m in memories:
                emoji = {"issue": "⚠️", "preference": "💛", "resolution": "✅", "fact": "📌"}.get(m.get("memory_type", ""), "📝")
                lines.append(f"  {emoji} [{m.get('memory_type','').upper()}] {m.get('content','')}")

        return "\n".join(lines) if lines else ""

    def _format_kb_context(self, results: list[dict]) -> str:
        """Format knowledge base search results for prompt injection."""
        if not results:
            return ""
        lines = []
        for i, r in enumerate(results, 1):
            score_pct = int(r["similarity"] * 100)
            lines.append(f"[Source {i}] Relevance: {score_pct}%\n{r['text'][:600]}")
        return "\n\n".join(lines)

    def _semantic_search(self, query: str, n_results: int = 3) -> list[dict]:
        """Search knowledge base for relevant documents."""
        if self._knowledge_col.count() == 0:
            return []

        results = self._knowledge_col.query(
            query_texts=[query],
            n_results=min(n_results, self._knowledge_col.count()),
            include=["documents", "metadatas", "distances"]
        )
        output = []
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0]
        ):
            sim = round(1.0 - dist, 4)
            if sim >= 0.35:    # minimum relevance threshold
                output.append({"text": doc, "metadata": meta, "similarity": sim})
        return sorted(output, key=lambda x: x["similarity"], reverse=True)

    def _extract_and_save_memory(
        self, user_id: str, user_msg: str, agent_reply: str
    ) -> None:
        """
        Use the LLM to extract memorable facts from this exchange.
        This is "active memory formation" — not just storing raw text
        but intelligently extracting the key takeaways.
        """
        extraction_prompt = f"""Extract memorable facts from this support exchange.
Return a JSON array of objects with fields: "content", "type", "importance" (1-10).
Types: "fact", "preference", "issue", "resolution".
Only include facts worth remembering (importance >= 6). Return [] if nothing important.

User said: {user_msg[:200]}
Agent replied: {agent_reply[:200]}

Return ONLY valid JSON, no explanation."""

        try:
            extract_response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You extract structured memory facts from conversations. Return only JSON arrays."},
                    {"role": "user",   "content": extraction_prompt}
                ],
                temperature=0.0,
                max_tokens=400,
                response_format={"type": "json_object"}
                # response_format enforces valid JSON output — prevents parse errors.
                # Only available on gpt-4o and gpt-4o-mini.
            )
            # The LLM might return {"memories": [...]} or {"facts": [...]} or just [...]
            raw = json.loads(extract_response.choices[0].message.content)

            # Normalize to a list
            memories_list = raw if isinstance(raw, list) else next(
                (v for v in raw.values() if isinstance(v, list)), []
            )

            for mem in memories_list:
                if isinstance(mem, dict) and mem.get("content"):
                    self._store_memory(
                        user_id,
                        content=mem["content"],
                        memory_type=mem.get("type", "fact"),
                        importance=int(mem.get("importance", 5))
                    )
        except Exception as e:
            pass   # Memory extraction failing is non-critical — don't crash the chat

    def _apply_sliding_window(
        self, messages: list[dict], max_messages: int = 20
    ) -> list[dict]:
        """Keep only the most recent N messages (simple sliding window)."""
        if len(messages) <= max_messages:
            return messages
        # Always keep an initial context note when truncating
        dropped = len(messages) - max_messages
        note    = {"role": "system", "content": f"[{dropped} earlier messages in this session omitted]"}
        return [note] + messages[-max_messages:]

    # ─── Database Operations ────────────────────────────────

    def _init_db(self) -> None:
        with sqlite3.connect(self.db_path) as conn:
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    name TEXT, role TEXT, company TEXT,
                    tags TEXT DEFAULT '', created_at TEXT DEFAULT (datetime('now'))
                );
                CREATE TABLE IF NOT EXISTS memories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT, memory_type TEXT, content TEXT,
                    importance INTEGER DEFAULT 5,
                    created_at TEXT DEFAULT (datetime('now'))
                );
                CREATE INDEX IF NOT EXISTS idx_mem_user ON memories(user_id);
            """)

    def _get_or_create_user(self, user_id: str) -> dict:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            row = conn.execute("SELECT * FROM users WHERE user_id=?", (user_id,)).fetchone()
            if not row:
                conn.execute("INSERT INTO users (user_id) VALUES (?)", (user_id,))
                return {"user_id": user_id, "name": None, "role": None, "company": None, "tags": ""}
            return dict(row)

    def _get_memories(self, user_id: str, limit: int = 5) -> list[dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                "SELECT * FROM memories WHERE user_id=? ORDER BY importance DESC, created_at DESC LIMIT ?",
                (user_id, limit)
            ).fetchall()
        return [dict(r) for r in rows]

    def _store_memory(
        self, user_id: str, content: str, memory_type: str = "fact", importance: int = 5
    ) -> None:
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT INTO memories (user_id, memory_type, content, importance) VALUES (?,?,?,?)",
                (user_id, memory_type, content, importance)
            )

    def _seed_knowledge_base(self) -> None:
        """Load the support knowledge into ChromaDB on first run."""
        self._knowledge_col.add(
            ids=[k["id"] for k in SUPPORT_KNOWLEDGE],
            documents=[k["text"] for k in SUPPORT_KNOWLEDGE],
            metadatas=[k["metadata"] for k in SUPPORT_KNOWLEDGE]
        )
        print(f"   Seeded {len(SUPPORT_KNOWLEDGE)} knowledge base entries.")


# ══════════════════════════════════════════════════════════
# DEMO CONVERSATION
# ══════════════════════════════════════════════════════════

if __name__ == "__main__":
    bot = CustomerSupportBot()
    bot.setup()

    print("\n" + "═"*60)
    print("  🎧 CUSTOMER SUPPORT BOT — Interactive Demo")
    print("  Type 'quit' to exit, 'new_user' to switch user")
    print("═"*60)

    USER_ID = "alice@hospital.com"

    # Simulate a returning customer conversation
    test_conversations = [
        "Hi, I changed my email address and now I can't log into my account at all.",
        "I tried clearing cookies but it's still not working.",
        "Also, I got charged twice this month for my subscription!",
        "What's your refund policy?",
    ]

    for turn, msg in enumerate(test_conversations, 1):
        print(f"\n  [Turn {turn}] 💬 User: {msg}")
        reply = bot.chat(USER_ID, msg)
        print(f"\n  🤖 Aria:\n{reply}")
        print()

    # Show what memories were accumulated
    print("\n" + "─"*60)
    print("  📚 MEMORIES ACCUMULATED THIS SESSION:")
    memories = bot._get_memories(USER_ID, limit=10)
    for m in memories:
        print(f"   [{m['memory_type'].upper()} | imp:{m['importance']}] {m['content'][:80]}")
```

---

## 8. Choosing the Right Memory for the Job

```
DECISION GUIDE — WHICH MEMORY TO USE:
════════════════════════════════════════════════════════════════

  QUESTION                        ANSWER              USE
  ──────────────────────────────  ──────────────────  ─────────────────
  "What did we discuss just now?" Within this session Short-term (messages[])
  "Who is this user?"             Specific user info  Long-term (SQLite)
  "What plan are they on?"        Structured data     Long-term (SQLite)
  "Any relevant past tickets?"    Semantic similarity Semantic (ChromaDB)
  "What does the FAQ say?"        Unstructured search Semantic (ChromaDB)
  "How should I handle this?"     Baked-in rules      Procedural (system prompt)
  "What did I find 3 sessions?"   Past conversations  Long-term (SQLite sessions)


  PERFORMANCE vs COST:
  ──────────────────────────────────────────────────────────
  Short-term    → 0 API calls, instant, 0 cost
  Long-term     → 0 API calls, ~5ms, 0 cost
  Semantic      → 1 embedding API call per query (~$0.00002)
  Procedural    → Included in every prompt (burns context tokens)


  CAPACITY:
  ──────────────────────────────────────────────────────────
  Short-term    → ~128k tokens (fits ~500 chat turns per session)
  Long-term     → Unlimited (bounded only by database storage)
  Semantic      → Unlimited (ChromaDB: millions; Pinecone: billions)
  Procedural    → ~4k tokens (bigger system prompts → higher cost per call)


  WHEN SOMETHING GOES WRONG:
  ──────────────────────────────────────────────────────────
  Agent forgets what user said 3 turns ago    → Short-term window too small
  Agent doesn't recognize returning user      → Long-term memory not implemented
  Agent gives wrong answer despite docs exist → Semantic retrieval failing (check embeddings)
  Agent ignores your rules                    → Procedural (system prompt) too weak
```

---

## 9. Mini Quiz

Classic senior-level questions on memory systems. Think carefully — these require real understanding.

```
╔════════════════════════════════════════════════════════════════╗
║  📝 CHAPTER 5 QUIZ — 5 Questions                               ║
╚════════════════════════════════════════════════════════════════╝
```

**Question 1 — Context Window**

Your agent uses `max_tokens=4096` for responses and has a 128k token context window. After 100 iterations of a research session, each adding ~800 tokens, what happens and what are your three options?

<details>
<summary>👆 Click to reveal answer</summary>

**What happens:** After 100 iterations at ~800 tokens/iteration, you've added ~80,000 tokens. Combined with the base system prompt (~500 tokens), you're at ~80,500 tokens. Plus the `max_tokens=4096` reservation, that's ~84,596 tokens — still within 128k, but approaching the limit. At ~155 iterations, you'd exceed it and get a `context_length_exceeded` error.

**Three options:**

1. **Sliding Window:** Delete oldest messages until under the limit. Simple, fast. Loses early context. Best when early turns are less important than recent ones.

2. **Summarization:** Use a second LLM call to compress old turns into a ~150-word summary, then replace the old messages with `{"role":"system","content":"[Summary]: ..."}`. Preserves semantic content at the cost of one extra API call and slight information loss.

3. **Tool Result Pruning:** Instead of pruning all messages, only truncate tool result messages (often the biggest consumers). Keep the full conversation structure but reduce tool output verbosity. Best combined with option 1 or 2.

**Production recommendation:** Use pruning first, then sliding window, with optional summarization for sessions that must preserve long context.
</details>

---

**Question 2 — Embedding Mismatch**

You build a knowledge base: you embed all documents using `text-embedding-3-small` and store them in Pinecone. Six months later, a colleague updates the query code to use `text-embedding-3-large`. Searches suddenly return nonsensical results. Why?

<details>
<summary>👆 Click to reveal answer</summary>

**Embedding model mismatch — a silent and deadly bug.**

`text-embedding-3-small` produces **1536-dimensional vectors**. `text-embedding-3-large` produces **3072-dimensional vectors**. You cannot compare vectors from different models — or even from the same model at different dimension settings.

Even if dimensions accidentally matched (e.g., if you truncated large to 1536), the *embedding space* is completely different. A query vector from model A lives in a different geometric space than documents from model B. Similarity scores become meaningless — you're comparing distances between points that don't belong to the same coordinate system.

**Symptoms:** Queries always return the same documents regardless of query text, or always return documents with very low similarity scores, or return completely irrelevant documents confidently.

**Fix:** Always document and pin the exact embedding model + dimensions used to create a collection/index. When upgrading embedding models, **re-embed all documents** from scratch and rebuild the index. There's no shortcut.

**Prevention rule:** Store the model name in your collection/index metadata. Assert at query time that the query model matches the index model.
</details>

---

**Question 3 — Chunking Strategy**

You're building a RAG system over a 500-page technical manual. A colleague says "let's just embed the entire book as one document." What's wrong with this, and what chunking strategy would you recommend?

<details>
<summary>👆 Click to reveal answer</summary>

**Three problems with one-document embedding:**

1. **Embedding model limit:** Most embedding models accept ~8000 tokens (≈6000 words). A 500-page manual is ~125,000 words. It physically won't fit.

2. **Retrieval imprecision:** Even if you could embed it whole, the embedding captures the "average meaning" of the entire book. A user asking about Chapter 12's error codes would retrieve the same document as a user asking about Chapter 1's installation guide. Zero precision.

3. **Context injection problem:** If you inject the retrieved "document" into the LLM context, you're injecting the entire 500 pages — instantly burning your entire context window.

**Recommended chunking strategy:**

- **Chunk size:** 500-800 characters with 100-150 character overlap
- **Preserve structure:** Try to break at natural boundaries (paragraph ends, section headers). Add the section title to start of each chunk: `"Chapter 12: Error Codes\n\n{chunk_text}"`
- **Metadata enrichment:** Each chunk gets `{"chapter": 12, "section": "Error Codes", "page": 347}` — enables filtered retrieval
- **Parent-child chunking (advanced):** Small chunks (200 chars) for precise retrieval, but return the parent chunk (800 chars) for LLM context. Best of both worlds on precision and context.

**Result:** Query "ERRC_503 error" retrieves the 3 most relevant 800-char sections from the manual in ~20ms, rather than the whole book.
</details>

---

**Question 4 — Semantic vs Keyword Search**

Your CTO says "Elasticsearch with keyword search is already fast and free — why do we need vector search for the support bot?" Write a convincing technical argument.

<details>
<summary>👆 Click to reveal answer</summary>

**The case for vector search in a support context:**

**Problem with keyword search:**
- User types: "I can't get into my account"
- FAQ says: "Authentication failure after credential update"
- Keyword search: 0 matching keywords → returns nothing
- User is frustrated, escalates, costs $15 in human support time

**Vector search finds it:**
- "get into account" ≈ "authentication failure" (similarity: 0.89)
- Correct FAQ returned, issue resolved self-service, $0 cost

**Concrete numbers:** In support systems, users rarely use exact technical terms that match documentation. Studies show keyword search misses ~40% of semantically equivalent queries. In a support context with 1000 tickets/day, that's 400 unnecessary escalations daily.

**The hybrid approach (best of both):**
In production, use BOTH:
- Keyword search: fast, exact, great for product names, order numbers, codes
- Vector search: semantic, fuzzy, great for natural language descriptions
- Combine scores: `final_score = 0.6 * semantic_score + 0.4 * bm25_score`

This gives you BM25's precision for structured queries AND vector search's recall for natural language — both Pinecone and Elasticsearch now support this natively (Pinecone Sparse-Dense, Elasticsearch's `knn` + `match` query).

**Bottom line:** Keyword search is a hammer. Support queries are often not nails. Use the right tool, or use both.
</details>

---

**Question 5 — Memory Injection Position**

In your RAG system, should the retrieved context go in the `system` message or the `user` message? Write the argument for each position and what you'd choose for a production support bot.

<details>
<summary>👆 Click to reveal answer</summary>

**Option A — System message injection:**
```python
{"role": "system", "content": base_prompt + "\n\n[CONTEXT]\n" + retrieved_docs}
{"role": "user",   "content": "How do I reset my password?"}
```
- ✅ Context feels like "background knowledge" the agent naturally knows
- ✅ Positioned before the conversation — sets the frame for reasoning
- ❌ System prompt grows with every message (if using multi-turn RAG)
- ❌ With sliding window, old system prompts with stale context can persist

**Option B — User message injection:**
```python
{"role": "system",  "content": base_prompt}
{"role": "user",    "content": "CONTEXT:\n" + retrieved_docs + "\n\nQUESTION: How do I reset my password?"}
```
- ✅ Context is specific to this turn — no stale injection from previous turns
- ✅ Easy to control which turn gets which context
- ❌ Long user messages look odd in logs/debugging
- ❌ Some models don't weight user-message context as heavily as system-message context

**Option C — Hybrid (production recommendation):**
```python
{"role": "system",  "content": base_prompt + "\n\n[USER PROFILE]\n" + user_context}
{"role": "user",    "content": "RELEVANT DOCS:\n" + retrieved_docs + "\n\n" + user_query}
```
- User profile (stable across session) → system message
- Retrieved docs (fresh per-turn) → user message
- Clean separation of concerns, correct token budgeting per turn

**For a production support bot: use the hybrid approach.** User profile is session-stable and belongs in the system prompt. Retrieved knowledge is query-specific and belongs in the user turn. This is what Intercom, Zendesk AI, and Salesforce Einstein all do internally.
</details>

---

## 10. Chapter 6 Preview

```
╔══════════════════════════════════════════════════════════════╗
║  👀 COMING UP: Chapter 6                                     ║
║  "Multi-Agent Systems — When One Agent Isn't Enough"        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Your Chapter 5 agent is excellent at one thing at a time.  ║
║  But real enterprise tasks need parallelism and             ║
║  specialization:                                             ║
║                                                              ║
║  "Research 10 competitors, analyze their pricing,            ║
║   check their news, write a comparison report,              ║
║   and email it to the board by 9am."                        ║
║                                                              ║
║  A single agent, doing this sequentially, takes hours.       ║
║  A multi-agent system, running in parallel, takes minutes.   ║
║                                                              ║
║  Chapter 6 covers:                                           ║
║                                                              ║
║  🏗️  ORCHESTRATOR-WORKER PATTERN                            ║
║     One "boss" agent that plans and delegates.               ║
║     Multiple "worker" agents that specialize.                ║
║     Workers run in parallel using asyncio.                   ║
║                                                              ║
║  📡  AGENT COMMUNICATION                                     ║
║     How agents pass context and results to each other.       ║
║     Message queues, shared memory, and result aggregation.   ║
║                                                              ║
║  🔄  PARALLEL AGENT EXECUTION                               ║
║     asyncio + concurrent.futures for true parallelism.       ║
║     Run 5 research agents simultaneously, 5x speedup.        ║
║                                                              ║
║  🔐  TRUST & SAFETY IN MULTI-AGENT SYSTEMS                  ║
║     What happens when one agent manipulates another?         ║
║     Prompt injection attacks between agents.                 ║
║     How to build authority boundaries.                       ║
║                                                              ║
║  🏭  Real use case:                                          ║
║     Competitive Intelligence System:                         ║
║     5 parallel research agents → 1 synthesis agent →        ║
║     1 report-writing agent → auto-emailed board report.     ║
║     Built in 1 hour. Would take a human team 2 days.        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  PREREQUISITE CHECKLIST BEFORE CHAPTER 6:                    ║
║  ✅ You can implement sliding window + summarization         ║
║  ✅ You've built a working ChromaDB semantic search          ║
║  ✅ You understand RAG: chunk → embed → store → retrieve    ║
║  ✅ You built the Customer Support Bot (or followed along)   ║
║  ✅ You can explain why cosine similarity is used for text   ║
╚══════════════════════════════════════════════════════════════╝
```

> **Professor's Final Word:** You now understand that memory is not a single thing — it's a *system*. Short-term for working context. Long-term for persistent identity. Semantic for fuzzy knowledge retrieval. Procedural for baked-in behavior. The best AI products use all four, tuned carefully for their use case. Netflix's recommendation AI, Google's search, GitHub Copilot Chat — they're all sophisticated memory architectures underneath. Now you know how to build one. The customer support bot you built today? That's production-quality architecture. Be proud. 🎓🧠

---

```
────────────────────────────────────────────────────────────────────
  Chapter 5 Complete ✅  |  Next: Chapter 6 — Multi-Agent Systems →
  Files covered this chapter:
    memory_short_term.py         — sliding window, summarization, pruning
    memory_long_term.py          — SQLite user profiles + episodic memory
    memory_semantic_chroma.py    — ChromaDB: add, search, format
    memory_semantic_pinecone.py  — Pinecone: setup, upsert, query
    rag_pipeline.py              — complete RAG: chunk → embed → retrieve → generate
    customer_support_bot.py      — full 4-layer memory support bot
────────────────────────────────────────────────────────────────────
```
