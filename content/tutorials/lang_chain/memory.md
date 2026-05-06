# 🧠 Phase 6 — Memory
### "Giving Your AI a Brain That Remembers"

> **Difficulty**: ⭐⭐ Intermediate | **Time**: ~75 minutes | **Prerequisites**: Phase 5 Complete

---

## 🎯 What You'll Learn

- ✅ Why AI forgets and why memory matters
- ✅ Buffer Memory (remember everything)
- ✅ Window Memory (remember last N messages)
- ✅ Summary Memory (compress history)
- ✅ Persistent Memory (save to disk/database)
- ✅ Build a real conversational AI with memory

---

## 📖 Lesson 6.1 — The Memory Problem

### Why Does AI Forget?

Here's the uncomfortable truth about AI models:

```
Turn 1: "Hi! My name is Ahmed."       AI: "Nice to meet you, Ahmed!"
Turn 2: "I love Python."              AI: "Python is great!"
Turn 3: "What's my name?"            AI: "I don't know your name." 😱
```

**Why?** Because each call to an LLM is **stateless** — it has NO memory of previous calls. Every message is sent fresh.

Think of it like talking to someone with amnesia who resets every 5 seconds.

### The Solution: Conversation History

The fix is simple but powerful: we keep track of the conversation history and **send it with every new message**.

```
Turn 3 actual message sent to AI:
═══════════════════════════════════════
HISTORY: 
  Human: Hi! My name is Ahmed.
  AI: Nice to meet you, Ahmed!
  Human: I love Python.
  AI: Python is great!

NEW MESSAGE: What's my name?
═══════════════════════════════════════
Now AI can answer: "Your name is Ahmed!"
```

**LangChain Memory** does this history management automatically.

---

## 📖 Lesson 6.2 — Memory Types Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LANGCHAIN MEMORY TYPES                    │
├──────────────────────┬──────────────────────────────────────┤
│ Memory Type          │ What It Does                         │
├──────────────────────┼──────────────────────────────────────┤
│ Buffer Memory        │ Stores ALL messages (complete history)│
│                      │ 🟢 Simple | 🔴 Uses lots of tokens    │
├──────────────────────┼──────────────────────────────────────┤
│ Window Memory        │ Stores last N messages only           │
│                      │ 🟢 Token-efficient | 🟡 Loses old info│
├──────────────────────┼──────────────────────────────────────┤
│ Summary Memory       │ AI summarizes old messages            │
│                      │ 🟢 Very efficient | 🟡 May lose detail│
├──────────────────────┼──────────────────────────────────────┤
│ Entity Memory        │ Remembers specific facts about people │
│                      │ 🟢 Smart | 🟡 Complex to set up       │
├──────────────────────┼──────────────────────────────────────┤
│ Persistent Memory    │ Saves to database/disk               │
│                      │ 🟢 Survives restarts | 🟡 Setup needed│
└──────────────────────┴──────────────────────────────────────┘
```

---

## 📖 Lesson 6.3 — Modern Memory Pattern (LCEL Way)

> ⚠️ **Important Note**: LangChain has evolved. The old `ConversationBufferMemory` class is now legacy. Modern LangChain uses a cleaner pattern with `RunnableWithMessageHistory`. We'll learn the modern way!

### The Modern Architecture

```
User Input
    ↓
[Chat History Loaded from Store]
    +
[Current User Input]
    ↓
[Prompt Template fills in history + input]
    ↓
[LLM processes everything]
    ↓
[Response saved to Store]
    ↓
User Gets Response
```

---

## 📖 Lesson 6.4 — Buffer Memory (Remember Everything)

```python
# ============================================================
# FILE: memory/buffer_memory.py
# PURPOSE: Complete conversation history management
# ============================================================

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import HumanMessage, AIMessage

# ---- Step 1: Setup the chain ----
llm = ChatOllama(model="llama3.2", temperature=0.7)
parser = StrOutputParser()

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful AI assistant. Be friendly and remember context from the conversation."),
    MessagesPlaceholder(variable_name="history"),  # ← This injects conversation history!
    ("human", "{input}")
])

chain = prompt | llm | parser

# ---- Step 2: Create message history store ----
# This stores conversation history per session
# Key = session_id, Value = chat history
store = {}  # In-memory store (resets when program restarts)

def get_session_history(session_id: str) -> InMemoryChatMessageHistory:
    """Get or create history for a session."""
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

# ---- Step 3: Wrap chain with memory ----
chain_with_memory = RunnableWithMessageHistory(
    chain,
    get_session_history,         # Function to get/create history
    input_messages_key="input",  # Which key contains user's message
    history_messages_key="history"  # Which key for history in prompt
)

# ---- Step 4: Chat! ----
def chat(message: str, session_id: str = "user_1") -> str:
    """Send a message and get response with memory."""
    response = chain_with_memory.invoke(
        {"input": message},
        config={"configurable": {"session_id": session_id}}
    )
    return response

# Test the memory!
print("🤖 AI Chatbot with Memory")
print("=" * 40)

turns = [
    "Hi! My name is Ahmed and I'm learning LangChain.",
    "I'm a 25-year-old software engineer from Cairo.",
    "My favorite programming language is Python.",
    "What's my name and where am I from?",         # Test memory!
    "What do I do for work and how old am I?",     # Test more memory!
    "What programming language did I mention?",    # Test deeper memory!
]

for message in turns:
    print(f"\n👤 You: {message}")
    response = chat(message)
    print(f"🤖 AI: {response}")
```

### Expected Output

```
👤 You: Hi! My name is Ahmed and I'm learning LangChain.
🤖 AI: Hi Ahmed! Welcome to the LangChain journey! It's great to meet you...

👤 You: I'm a 25-year-old software engineer from Cairo.
🤖 AI: That's wonderful! Cairo is a vibrant city...

👤 You: What's my name and where am I from?
🤖 AI: Your name is Ahmed, and you're from Cairo, Egypt! You're 25 years old...
       ↑ IT REMEMBERED! ✅
```

---

## 📖 Lesson 6.5 — Window Memory (Remember Last N Messages)

When conversations get long, buffer memory wastes tokens sending the entire history. Window memory is smarter — it only remembers the **last K messages**.

```python
# ============================================================
# FILE: memory/window_memory.py
# PURPOSE: Token-efficient memory using message window
# ============================================================

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import BaseMessage

llm = ChatOllama(model="llama3.2")
parser = StrOutputParser()

# Window memory: custom history class that limits messages
class WindowChatHistory(InMemoryChatMessageHistory):
    """Chat history that only keeps last N messages."""
    
    def __init__(self, max_messages: int = 10):
        super().__init__()
        self.max_messages = max_messages
    
    @property
    def messages(self) -> list[BaseMessage]:
        """Return only the last max_messages messages."""
        all_messages = super().messages
        # Keep only the last N messages
        return all_messages[-self.max_messages:]

# Store with window memory
window_store = {}

def get_window_history(session_id: str) -> WindowChatHistory:
    """Get window-limited history."""
    if session_id not in window_store:
        window_store[session_id] = WindowChatHistory(max_messages=6)  # Last 3 turns
    return window_store[session_id]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant with limited memory (last 3 turns only)."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

chain = prompt | llm | parser

chain_with_window = RunnableWithMessageHistory(
    chain,
    get_window_history,
    input_messages_key="input",
    history_messages_key="history"
)

# Demonstrate window behavior
messages = [
    "Message 1: The sky is blue",
    "Message 2: Python was created in 1991",
    "Message 3: LangChain is awesome",
    "Message 4: I love coffee",
    "What was Message 1 about?",   # Should be forgotten (outside window)!
    "What was Message 3 about?",   # Should be remembered (in window)
]

for msg in messages:
    print(f"\n👤 {msg}")
    response = chain_with_window.invoke(
        {"input": msg},
        config={"configurable": {"session_id": "window_test"}}
    )
    print(f"🤖 {response[:150]}")
```

---

## 📖 Lesson 6.6 — Summary Memory

Instead of keeping all messages (wasteful) or cutting them off (lossy), Summary Memory **uses AI to compress old messages into a summary**. Smart!

```python
# ============================================================
# FILE: memory/summary_memory.py
# PURPOSE: AI-powered conversation summarization
# ============================================================

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.chat_history import InMemoryChatMessageHistory

llm = ChatOllama(model="llama3.2", temperature=0.3)
parser = StrOutputParser()

class SummaryChatHistory(InMemoryChatMessageHistory):
    """
    Chat history that summarizes old messages when it gets too long.
    
    How it works:
    - Keeps last N messages in full
    - Older messages get compressed into a summary
    - Summary is injected as a SystemMessage at the start
    """
    
    def __init__(self, max_recent: int = 6, llm=None):
        super().__init__()
        self.max_recent = max_recent
        self.llm = llm
        self.summary = ""  # Running summary of old messages
    
    def add_messages(self, messages):
        """Add messages and summarize if needed."""
        super().add_messages(messages)
        
        # If we have too many messages, summarize the old ones
        all_msgs = super().messages
        if len(all_msgs) > self.max_recent:
            self._summarize_old_messages()
    
    def _summarize_old_messages(self):
        """Use AI to summarize old conversation."""
        all_msgs = super().messages
        
        # Split: old messages to summarize, recent to keep
        old_messages = all_msgs[:-self.max_recent]
        recent_messages = all_msgs[-self.max_recent:]
        
        # Build summary prompt
        history_text = "\n".join([
            f"{m.type}: {m.content}" 
            for m in old_messages
        ])
        
        if self.llm and history_text:
            summary_prompt = f"""Summarize this conversation in 2-3 sentences, 
            capturing key facts and context:
            
            {history_text}
            
            Summary:"""
            
            new_summary = self.llm.invoke(summary_prompt).content
            
            # Update summary (combine with any previous summary)
            if self.summary:
                self.summary = f"{self.summary} {new_summary}"
            else:
                self.summary = new_summary
        
        # Clear old messages, keep only recent
        # (This is a simplified version - in production you'd store properly)
        self._messages = recent_messages

# Usage example
print("🧠 Summary Memory Demo")
print("(Old messages get summarized automatically)")
print("=" * 50)

history = SummaryChatHistory(max_recent=4, llm=llm)

conversations = [
    ("human", "Hi! I'm building an AI startup called NeuralFlow"),
    ("ai", "That's exciting! What does NeuralFlow do?"),
    ("human", "We build AI agents for healthcare companies"),
    ("ai", "Healthcare AI is a great market!"),
    ("human", "Our main product is an AI diagnostic assistant"),
    ("ai", "That could really help doctors!"),
    ("human", "We have 5 customers already and $500k in revenue"),
    ("ai", "Impressive early traction!"),
    # These will cause summarization:
    ("human", "Now I want to expand to finance sector"),
]

print(f"Initial messages in history: {len(history.messages)}")
print(f"Max recent to keep: {history.max_recent}")
print()

for role, content in conversations[:6]:
    if role == "human":
        history.add_messages([HumanMessage(content=content)])
    else:
        history.add_messages([AIMessage(content=content)])

print(f"After 6 messages: {len(history.messages)} messages in memory")
print(f"Summary: {history.summary or 'None yet'}")
```

---

## 📖 Lesson 6.7 — Persistent Memory (Saves to Disk)

All previous examples lose memory when the program restarts. Persistent memory saves conversations to a file or database.

```python
# ============================================================
# FILE: memory/persistent_memory.py
# PURPOSE: Save conversation history to JSON file
# ============================================================

import json
import os
from datetime import datetime
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import HumanMessage, AIMessage

HISTORY_FILE = "chat_history_persistent.json"

def save_history_to_file(session_id: str, history: InMemoryChatMessageHistory):
    """Save conversation history to JSON file."""
    # Load existing data
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            data = json.load(f)
    else:
        data = {}
    
    # Convert messages to serializable format
    data[session_id] = [
        {
            "type": msg.type,        # "human" or "ai"
            "content": msg.content,  # The message text
            "timestamp": datetime.now().isoformat()
        }
        for msg in history.messages
    ]
    
    # Save to file
    with open(HISTORY_FILE, "w") as f:
        json.dump(data, f, indent=2)

def load_history_from_file(session_id: str) -> InMemoryChatMessageHistory:
    """Load conversation history from JSON file."""
    history = InMemoryChatMessageHistory()
    
    if not os.path.exists(HISTORY_FILE):
        return history  # No saved history yet
    
    with open(HISTORY_FILE, "r") as f:
        data = json.load(f)
    
    if session_id not in data:
        return history  # No history for this session
    
    # Restore messages
    for msg_data in data[session_id]:
        if msg_data["type"] == "human":
            history.add_message(HumanMessage(content=msg_data["content"]))
        elif msg_data["type"] == "ai":
            history.add_message(AIMessage(content=msg_data["content"]))
    
    return history

# ---- Chatbot with persistent memory ----
llm = ChatOllama(model="llama3.2")
parser = StrOutputParser()

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a personal AI assistant. Remember everything about the user."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

chain = prompt | llm | parser

# In-memory store (backed by file persistence)
persistent_store = {}

def get_persistent_history(session_id: str) -> InMemoryChatMessageHistory:
    """Get history, loading from file if not in memory."""
    if session_id not in persistent_store:
        # Try to load from file first
        persistent_store[session_id] = load_history_from_file(session_id)
    return persistent_store[session_id]

chain_with_persistent_memory = RunnableWithMessageHistory(
    chain,
    get_persistent_history,
    input_messages_key="input",
    history_messages_key="history"
)

def chat_with_save(message: str, user_id: str = "user_001"):
    """Chat and automatically save history."""
    response = chain_with_persistent_memory.invoke(
        {"input": message},
        config={"configurable": {"session_id": user_id}}
    )
    
    # Save after each message
    save_history_to_file(user_id, persistent_store[user_id])
    
    return response

# ---- Interactive Demo ----
print("💾 Persistent Memory Chatbot")
print("(Your conversations are saved and restored automatically!)")
print("Type 'quit' to exit\n")

# Check for existing history
if os.path.exists(HISTORY_FILE):
    print("📂 Found saved conversation history - loading...")
    with open(HISTORY_FILE, "r") as f:
        existing = json.load(f)
    if "user_001" in existing and existing["user_001"]:
        print(f"  Restored {len(existing['user_001'])} messages from last session!")
        print()

while True:
    user_input = input("👤 You: ").strip()
    if user_input.lower() in ["quit", "exit", "bye"]:
        print("💾 Conversation saved! See you next time!")
        break
    
    if not user_input:
        continue
    
    response = chat_with_save(user_input)
    print(f"🤖 AI: {response}\n")
```

---

## 🏭 Real Project: AI Customer Support Bot with Memory

```python
# ============================================================
# FILE: memory/projects/support_bot.py
# PURPOSE: Production-style customer support bot with memory
# ============================================================

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from datetime import datetime

llm = ChatOllama(model="llama3.2", temperature=0.5)
parser = StrOutputParser()

SYSTEM_PROMPT = """You are Maya, a friendly customer support agent for TechStore.

PERSONALITY: Warm, professional, patient, solution-focused

RULES:
1. Always address the customer by name once you know it
2. Remember all issues mentioned in the conversation
3. Don't ask for information they've already given
4. Track the main issue and any sub-issues
5. Always confirm resolution before closing
6. If unsatisfied, escalate to human agent

PRODUCT INFO:
- Warranty: 1 year standard, 2 years premium
- Returns: 30 days, no questions asked
- Shipping: 2-3 days standard, next-day available

Today's date: {current_date}"""

prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{customer_message}")
])

chain = prompt | llm | parser

sessions = {}

def get_support_history(session_id: str) -> InMemoryChatMessageHistory:
    if session_id not in sessions:
        sessions[session_id] = InMemoryChatMessageHistory()
    return sessions[session_id]

support_chain = RunnableWithMessageHistory(
    chain,
    get_support_history,
    input_messages_key="customer_message",
    history_messages_key="chat_history"
)

def support_chat(message: str, ticket_id: str):
    """Handle a customer support message."""
    return support_chain.invoke(
        {
            "customer_message": message,
            "current_date": datetime.now().strftime("%B %d, %Y")
        },
        config={"configurable": {"session_id": ticket_id}}
    )

# Demo conversation
ticket = "TICKET_2024_001"
print("🎧 TechStore Customer Support")
print("=" * 50)

conversation = [
    "Hi, I'm Sarah. I bought a laptop from you guys last month.",
    "The screen started flickering yesterday.",
    "I'm not sure of the exact order number but I bought it on March 15th.",
    "I mainly use it for video editing and can't afford downtime.",
    "Does it qualify for replacement under warranty?",
    "How quickly can you ship the replacement?",
]

for msg in conversation:
    print(f"\n👤 Customer: {msg}")
    response = support_chat(msg, ticket)
    print(f"🤖 Maya: {response}")
    print("-" * 40)
```

---

## ⚠️ Common Memory Mistakes

### Mistake 1: Forgetting `session_id`

```python
# ❌ All users share the same memory!
response = chain_with_memory.invoke(
    {"input": message},
    config={"configurable": {}}  # No session_id!
)

# ✅ Each user gets their own memory
response = chain_with_memory.invoke(
    {"input": message},
    config={"configurable": {"session_id": f"user_{user_id}"}}
)
```

### Mistake 2: Not Adding `MessagesPlaceholder` to Prompt

```python
# ❌ No placeholder - history never gets injected!
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are helpful."),
    ("human", "{input}")  # History is lost!
])

# ✅ Include the placeholder
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are helpful."),
    MessagesPlaceholder(variable_name="history"),  # ← Required!
    ("human", "{input}")
])
```

---

## 🧠 Quick Quiz

1. Why does AI forget by default?
2. What's the difference between Window Memory and Summary Memory?
3. What is `MessagesPlaceholder` used for?
4. How does persistent memory work?
5. What's a `session_id` and why is it important?

---

## 🎯 Mini Challenges

**Challenge 1**: Build a "Personal AI Journal" — remembers facts you tell it about yourself across sessions (save to JSON). Ask it to recall things you told it yesterday.

**Challenge 2**: Create a "Study Buddy" chatbot that remembers: what subject you're studying, topics you've covered, and topics you found difficult. After 5 messages, ask it to give a progress summary.

**Challenge 3**: Build a "Shopping Assistant" that remembers a customer's wishlist, budget, and preferences throughout the conversation. It should recommend products based on what it learned earlier.

---

## ✅ Phase 6 Recap

| Memory Type | Stores What | Best For |
|-------------|------------|----------|
| Buffer | All messages | Short conversations |
| Window | Last N messages | Medium conversations |
| Summary | AI-compressed history | Long conversations |
| Persistent | Saved to file/DB | Production apps |

---

## 🚀 What's Next?

In **Phase 7**, we give AI real **superpowers** — Tools that let it search the web, read files, run code, call APIs, and interact with the world:

> **Go to**: `Phase07_Tools/lesson.md` →

---

*Phase 6 Complete! 🧠 Your AI now has a memory. Time to give it superpowers!*
