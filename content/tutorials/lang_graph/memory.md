# 🧠 Phase 6 — Memory & Persistence
### "Giving Your AI a Brain That Never Forgets"

> **Difficulty**: ⭐⭐⭐ Intermediate | **Time**: ~90 minutes | **Prerequisites**: Phase 5 Complete

---

## 🎯 What You'll Learn

- ✅ Checkpointers: what they are and how they work
- ✅ `MemorySaver` — in-memory persistence
- ✅ `SqliteSaver` — persistent disk storage
- ✅ Thread IDs for multi-user isolation
- ✅ Resuming interrupted workflows
- ✅ Conversation history management
- ✅ Build: Personal AI Assistant with long-term memory

---

## 📖 Lesson 6.1 — Why Persistence Matters

### The Stateless Problem

Without persistence, every `app.invoke()` call starts fresh:

```
Session 1:
  User: "My name is Ahmed"
  AI: "Nice to meet you, Ahmed!"
  [Program restarts or new session starts]
  
Session 2:
  User: "What's my name?"
  AI: "I don't know your name."  ← 😤 All memory lost!
```

With persistence (checkpointing):

```
Session 1:
  User: "My name is Ahmed"
  AI: "Nice to meet you, Ahmed!"
  [State saved to checkpointer automatically]
  
Session 2 (same thread_id):
  User: "What's my name?"
  AI: "Your name is Ahmed!"  ← ✅ Memory restored!
```

### How Checkpointers Work

```
┌─────────────────────────────────────────────────────┐
│                 CHECKPOINTER FLOW                   │
│                                                     │
│  Before each node runs:                             │
│    ← Load state from checkpointer                   │
│                                                     │
│  After each node runs:                              │
│    → Save state to checkpointer                     │
│                                                     │
│  Key: thread_id                                     │
│    Each unique thread_id = separate conversation    │
│    user_001, user_002, session_abc, etc.            │
│                                                     │
│  Checkpointer types:                                │
│    MemorySaver   → RAM (lost on restart)            │
│    SqliteSaver   → SQLite file (survives restart)   │
│    RedisSaver    → Redis (production, multi-server) │
└─────────────────────────────────────────────────────┘
```

---

## 📖 Lesson 6.2 — MemorySaver (In-Memory)

```python
# ============================================================
# FILE: 04_memory/memory_saver_demo.py
# PURPOSE: Basic in-memory checkpointing
# ============================================================

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List
import operator

llm = ChatOllama(model="llama3.2", temperature=0.7)

class ConversationState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]

def chat_node(state: ConversationState) -> dict:
    """The main chat node — remembers full conversation history."""
    response = llm.invoke(
        [SystemMessage(content="You are a helpful assistant. Remember everything the user tells you.")] 
        + list(state["messages"])
    )
    return {"messages": [response]}

# ---- Build graph WITH checkpointer ----
graph = StateGraph(ConversationState)
graph.add_node("chat", chat_node)
graph.set_entry_point("chat")
graph.add_edge("chat", END)

# The checkpointer is what enables memory!
checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)

# ---- The thread_id is the key to memory ----
# Same thread_id = same conversation = memory persists
# Different thread_id = new conversation = fresh start

def chat(message: str, thread_id: str = "user_001") -> str:
    """Send a message and get response. Memory persists per thread_id."""
    result = app.invoke(
        {"messages": [HumanMessage(content=message)]},
        config={"configurable": {"thread_id": thread_id}}
    )
    return result["messages"][-1].content

# ---- Demo: Memory across multiple turns ----
print("🧠 Conversation with Memory\n")
print("=" * 50)

# User 1 conversation
print("[User 1 session - thread: user_001]")
print(f"👤: My name is Ahmed and I'm 28 years old")
print(f"🤖: {chat('My name is Ahmed and I am 28 years old', 'user_001')[:150]}\n")

print(f"👤: I work as a Python developer in Cairo")
print(f"🤖: {chat('I work as a Python developer in Cairo', 'user_001')[:150]}\n")

print(f"👤: What do you know about me so far?")
print(f"🤖: {chat('What do you know about me so far?', 'user_001')[:200]}\n")

# User 2 conversation (different thread_id = separate memory)
print("\n[User 2 session - thread: user_002]")
print(f"👤: What's my name?")
print(f"🤖: {chat('What is my name?', 'user_002')[:150]}\n")
# User 2 gets no info about Ahmed - memories are isolated!

# ---- View saved checkpoints ----
print("\n📊 Checkpoint Info:")
config = {"configurable": {"thread_id": "user_001"}}
state_snapshot = app.get_state(config)
print(f"  Messages in memory: {len(state_snapshot.values['messages'])}")
print(f"  Checkpoint ID: {state_snapshot.config['configurable'].get('checkpoint_id', 'N/A')}")
```

---

## 📖 Lesson 6.3 — SqliteSaver (Persistent Storage)

This survives program restarts — real production memory!

```python
# ============================================================
# FILE: 04_memory/sqlite_saver_demo.py
# PURPOSE: Persistent memory that survives restarts
# Install: pip install langgraph-checkpoint-sqlite
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List
import operator

try:
    from langgraph.checkpoint.sqlite import SqliteSaver
    SQLITE_AVAILABLE = True
except ImportError:
    from langgraph.checkpoint.memory import MemorySaver
    SQLITE_AVAILABLE = False
    print("⚠️  SqliteSaver not available. Using MemorySaver instead.")
    print("   Install: pip install langgraph-checkpoint-sqlite")

llm = ChatOllama(model="llama3.2", temperature=0.5)

class PersistentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    user_name: str
    session_count: int

def chat_node(state: PersistentState) -> dict:
    system = f"""You are a personal AI assistant.
You remember everything the user has told you.
Current user: {state.get('user_name', 'Unknown')}
This is conversation session #{state.get('session_count', 1)}"""
    
    response = llm.invoke([SystemMessage(content=system)] + list(state["messages"]))
    return {"messages": [response]}

def update_session(state: PersistentState) -> dict:
    """Track session count."""
    count = state.get("session_count", 0)
    return {"session_count": count + 1}

graph = StateGraph(PersistentState)
graph.add_node("update_session", update_session)
graph.add_node("chat", chat_node)
graph.set_entry_point("update_session")
graph.add_edge("update_session", "chat")
graph.add_edge("chat", END)

# ---- Create persistent checkpointer ----
if SQLITE_AVAILABLE:
    # Save to a SQLite file — survives restarts!
    checkpointer = SqliteSaver.from_conn_string("agent_memory.db")
    print("✅ Using SQLite persistence (agent_memory.db)")
else:
    checkpointer = MemorySaver()
    print("ℹ️  Using in-memory storage")

app = graph.compile(checkpointer=checkpointer)

def persistent_chat(message: str, user_id: str, user_name: str = "") -> str:
    """Chat with persistent memory."""
    initial_state = {
        "messages": [HumanMessage(content=message)],
        "user_name": user_name,
        "session_count": 0
    }
    
    result = app.invoke(
        initial_state,
        config={"configurable": {"thread_id": f"user_{user_id}"}}
    )
    return result["messages"][-1].content

# ---- Demo ----
print("\n💾 Persistent Memory Demo")
print("(Run this script multiple times - AI will remember!)\n")

# First run: introduce yourself
user_id = "ahmed_hassan"
user_name = "Ahmed Hassan"

print(f"Session started for: {user_name}")
print()

conversations = [
    "Hi! I'm Ahmed Hassan. I'm a Python developer.",
    "I specialize in building AI applications with LangChain.",
    "My favorite hobby is reading science fiction books.",
]

for msg in conversations:
    print(f"👤 Ahmed: {msg}")
    response = persistent_chat(msg, user_id, user_name)
    print(f"🤖 AI: {response[:200]}\n")

# Test memory
print("👤 Ahmed: What do you know about me?")
response = persistent_chat("What do you know about me?", user_id, user_name)
print(f"🤖 AI: {response[:300]}")
```

---

## 📖 Lesson 6.4 — Accessing and Modifying State

```python
# ============================================================
# FILE: 04_memory/state_management.py
# PURPOSE: Read, inspect, and update saved state
# ============================================================

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List
import operator

llm = ChatOllama(model="llama3.2")

class ManagedState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    preferences: dict

def chat_node(state: ManagedState) -> dict:
    prefs = state.get("preferences", {})
    pref_str = ", ".join([f"{k}: {v}" for k, v in prefs.items()]) if prefs else "none set"
    
    response = llm.invoke(
        [HumanMessage(content=f"User preferences: {pref_str}\n\nMessage: {state['messages'][-1].content}")]
    )
    return {"messages": [response]}

checkpointer = MemorySaver()
graph = StateGraph(ManagedState)
graph.add_node("chat", chat_node)
graph.set_entry_point("chat")
graph.add_edge("chat", END)
app = graph.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "demo_user"}}

# Initial chat
app.invoke({"messages": [HumanMessage(content="Hello!")], "preferences": {}}, config=config)

# ---- GET current state ----
state = app.get_state(config)
print("📊 Current State:")
print(f"  Messages: {len(state.values['messages'])}")
print(f"  Preferences: {state.values.get('preferences', {})}")

# ---- UPDATE state manually (inject information) ----
# This is powerful - you can inject facts without the user saying them!
app.update_state(
    config,
    {
        "preferences": {
            "name": "Ahmed",
            "language": "English",
            "expertise": "Python developer",
            "timezone": "Cairo (UTC+2)"
        }
    }
)
print("\n✅ Injected user preferences into state")

# ---- Verify the update ----
state_after = app.get_state(config)
print(f"  Updated preferences: {state_after.values.get('preferences', {})}")

# ---- Now chat with the injected context ----
result = app.invoke(
    {"messages": [HumanMessage(content="What time is it in my timezone?")], "preferences": {}},
    config=config
)
print(f"\n🤖 AI (with injected context): {result['messages'][-1].content[:200]}")

# ---- GET state history ----
print("\n📜 State History (last 3 checkpoints):")
history = list(app.get_state_history(config))
for i, snapshot in enumerate(history[:3]):
    msg_count = len(snapshot.values.get("messages", []))
    checkpoint_id = snapshot.config["configurable"].get("checkpoint_id", "N/A")[:20]
    print(f"  Checkpoint {i+1}: {msg_count} messages | ID: {checkpoint_id}...")
```

---

## 📖 Lesson 6.5 — Multi-User Memory Architecture

```python
# ============================================================
# FILE: 04_memory/multi_user_memory.py
# PURPOSE: Handle memory for many users simultaneously
# ============================================================

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List, Optional
import operator
from datetime import datetime

llm = ChatOllama(model="llama3.2", temperature=0.5)

class UserState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    user_id: str
    user_name: str
    message_count: int

def personalized_chat(state: UserState) -> dict:
    system = f"""You are a personal AI assistant for {state.get('user_name', 'the user')}.
You have their full conversation history. Be personal and remember their context.
Total messages with this user: {state.get('message_count', 0)}"""
    
    response = llm.invoke([SystemMessage(content=system)] + list(state["messages"]))
    
    return {
        "messages": [response],
        "message_count": state.get("message_count", 0) + 1
    }

checkpointer = MemorySaver()
graph = StateGraph(UserState)
graph.add_node("chat", personalized_chat)
graph.set_entry_point("chat")
graph.add_edge("chat", END)
app = graph.compile(checkpointer=checkpointer)

class AIAssistantService:
    """Manages AI conversations for multiple users."""
    
    def __init__(self):
        self.app = app
    
    def _get_config(self, user_id: str) -> dict:
        """Generate config for a specific user."""
        return {"configurable": {"thread_id": f"user_{user_id}"}}
    
    def chat(self, user_id: str, user_name: str, message: str) -> str:
        """Process a message from a specific user."""
        result = self.app.invoke(
            {
                "messages": [HumanMessage(content=message)],
                "user_id": user_id,
                "user_name": user_name,
                "message_count": 0
            },
            config=self._get_config(user_id)
        )
        return result["messages"][-1].content
    
    def get_user_stats(self, user_id: str) -> dict:
        """Get memory stats for a user."""
        config = self._get_config(user_id)
        try:
            state = self.app.get_state(config)
            if state.values:
                return {
                    "user_id": user_id,
                    "message_count": state.values.get("message_count", 0),
                    "history_length": len(state.values.get("messages", []))
                }
        except:
            pass
        return {"user_id": user_id, "message_count": 0, "history_length": 0}
    
    def clear_user_memory(self, user_id: str):
        """Reset a user's conversation."""
        # Re-initialize with empty state
        config = self._get_config(user_id)
        self.app.update_state(config, {"messages": [], "message_count": 0})
        print(f"✅ Memory cleared for user: {user_id}")

# ---- Demo with multiple users ----
service = AIAssistantService()

print("👥 Multi-User AI Service Demo\n")

# User 1: Ahmed
print("--- Ahmed's Session ---")
service.chat("ahmed_001", "Ahmed", "Hi! I'm Ahmed. I love Python.")
service.chat("ahmed_001", "Ahmed", "I'm building an AI startup called NeuralFlow.")
response = service.chat("ahmed_001", "Ahmed", "What do you know about me?")
print(f"🤖 To Ahmed: {response[:200]}\n")

# User 2: Sara (completely separate memory!)
print("--- Sara's Session ---")
service.chat("sara_002", "Sara", "Hello! I'm Sara. I'm a data scientist.")
response = service.chat("sara_002", "Sara", "What's my name and profession?")
print(f"🤖 To Sara: {response[:200]}\n")

# Stats
for uid in ["ahmed_001", "sara_002"]:
    stats = service.get_user_stats(uid)
    print(f"📊 {uid}: {stats['message_count']} messages, {stats['history_length']} stored")
```

---

## ⚠️ Common Memory Mistakes

### Mistake 1: Not Using thread_id

```python
# ❌ No thread_id → all users share same memory!
result = app.invoke({"messages": [HumanMessage(content=msg)]}, 
                    config={"configurable": {}})

# ✅ Always use unique thread_id per user/session
result = app.invoke({"messages": [HumanMessage(content=msg)]},
                    config={"configurable": {"thread_id": f"user_{user_id}"}})
```

### Mistake 2: Memory Not Persisting

```python
# ❌ Compiled without checkpointer
app = graph.compile()  # No checkpointer → no memory!

# ✅ Always compile with checkpointer
checkpointer = MemorySaver()  # or SqliteSaver(...)
app = graph.compile(checkpointer=checkpointer)
```

---

## 🎯 Mini Challenges

**Challenge 1**: Build a "Personal Journal AI" — users can record daily entries, and the AI remembers all previous entries and references them when relevant.

**Challenge 2**: Create a "Study Tracker" — tracks subjects studied, time spent, and topics covered. After each session, AI gives a progress summary.

**Challenge 3**: Build a multi-user "Book Club AI" — each user has their own reading list memory. Users can ask for recommendations based on what they've told the AI they've read.

---

## ✅ Phase 6 Recap

| Concept | What It Does |
|---------|-------------|
| Checkpointer | Saves/loads state automatically |
| `MemorySaver` | RAM storage (lost on restart) |
| `SqliteSaver` | Disk storage (survives restart) |
| `thread_id` | Unique key per user/conversation |
| `app.get_state()` | Read saved state |
| `app.update_state()` | Inject/modify saved state |
| `app.get_state_history()` | See all past checkpoints |

---

## 🚀 What's Next?

**Phase 7** — Human-in-the-Loop: the ability to PAUSE your workflow and wait for a human to review, approve, edit, or redirect before continuing.

> **Go to**: `Phase07_Human_Loop/lesson.md` →

---

*Phase 6 Complete! 🧠 Your AI now has long-term memory. Time for human supervision!*
