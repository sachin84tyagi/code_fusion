# 🧠 Chapter 5: The Agent's Brain Part 2 — Memory Systems

> **Professor's Note:** Welcome to Stage 2. You've graduated from the masterclass, and now we're building for production. In Chapter 4, we built an agent that could "think." But a thinking agent without memory is just a calculator. Today, we're giving your agent a **personality** and a **library**. We are implementing the **Three-Layer Memory Architecture** used by companies like OpenAI and Anthropic. By the end of this chapter, your agent won't just answer questions; it will remember who you are, what you like, and everything it has ever learned. 🧠💾

---

## 🏗️ The Three Layers of Memory

In production Agentic AI, we don't just use one "list of messages." we use three distinct layers:

### 1. Short-Term Working Memory (The "Context Window")
- **What it is:** The actual messages sent to the LLM in the current request.
- **Constraint:** Limited by tokens (e.g., 128k).
- **Tool:** A Python `list` of dictionaries.

### 2. Episodic Memory (The "Diary")
- **What it is:** A history of every conversation the user has ever had with the agent.
- **Why it matters:** So the agent can say, "Hey, how did that meditation go that you mentioned last Tuesday?"
- **Tool:** **SQLite** (Relational Database).

### 3. Semantic Memory (The "Library")
- **What it is:** Thousands of documents, manuals, or research papers that the agent can "look up."
- **Why it matters:** To handle massive amounts of data that won't fit in the prompt.
- **Tool:** **ChromaDB** (Vector Database).

---

## 🛠️ The Tech Stack for Chapter 5
1. **SQLite:** Built into Python. Perfect for structured conversation history.
2. **ChromaDB:** The industry standard for local vector storage. It allows "Semantic Search."
3. **Embeddings:** We'll use Ollama's `nomic-embed-text` to turn text into math.

---

## 🚀 Let's Build: ZenSupport AI
We're building a support agent for "ZenSpace," a meditation app.
- **Task:** Answer user questions about meditation techniques using a manual.
- **Memory:** Remember the user's name and their favorite meditation style.

### 🏃 Setting Up Your Environment
Before running the code, make sure you have the dependencies:
```bash
pip install chromadb
ollama pull nomic-embed-text
```

---

## 🎓 Summary & Homework
### What we learned:
1. **Memory Layers:** The difference between Short-term, Episodic, and Semantic memory.
2. **Vector DBs:** How ChromaDB stores "meaning" instead of "keywords."
3. **Persistence:** Moving from JSON files to professional databases (SQLite/Chroma).

### 📝 Exercise:
Modify the `ZenSupport` agent to store "User Mood" in the Episodic memory and adjust its tone based on how the user was feeling in the last session!

---
**Next Module: Chapter 6 — Planning & Reasoning (The Agent's Strategy)** 🧩
