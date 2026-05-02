# 🧠 Module 9: The Agent's Library (Vector Databases & RAG)

> **Professor's Note:** Welcome back, class. You've built a "Boss Agent" that can think and act. But even the smartest agent has a flaw: it can only "remember" what fits in its context window. It's like having a genius assistant who has a desk the size of a postage stamp. If you give them a 500-page manual, they have to throw away the first page to read the last one. Today, we fix that. We're building a **Library** for our agent using **Vector Databases** and **RAG (Retrieval-Augmented Generation)**. Now, your agent won't just "remember" the last few messages; it will "lookup" exactly what it needs from a massive knowledge base. 📚⚡

---

## 🏗️ The Problem: Context Limits
Every LLM has a "Context Window."
- **GPT-4o:** ~128k tokens.
- **Llama 3:** ~8k - 128k tokens.
- **Human Brain:** (Variable, but we use libraries too!)

If you want an agent to answer questions about a 10,000-page PDF, you can't just paste it into the prompt. It will crash, or worse, it will "hallucinate" because it's overwhelmed.

---

## 🛠️ The Solution: RAG (Retrieval-Augmented Generation)
RAG is a 3-step process:
1. **Retrieve:** Look through a database for the most relevant "chunks" of information.
2. **Augment:** Stuff those chunks into the prompt as "Context."
3. **Generate:** Let the LLM answer based *only* on that context.

### The "Magic" Ingredient: Vector Embeddings
How does a computer "find" relevant text? Not by keyword matching (that's old school). It uses **Embeddings**.
- An embedding is a list of numbers (a vector) that represents the **meaning** of a sentence.
- "The cat sat on the mat" and "A feline rested on the rug" will have very similar numbers, even though they share zero words!

---

## 📝 Coding the Library
In this module, we will use a simple, manual implementation of a Vector Store so you understand the math, then we'll show you how to use a real one like **ChromaDB**.

### 1. The Manual "Vector" Search (Concept)
```python
# Conceptual: How similarity works
import math

def dot_product(v1, v2):
    return sum(x*y for x, y in zip(v1, v2))

# If dot product is high, meanings are similar!
```

### 2. The Full RAG Agent
We're going to build an agent that has a "Knowledge Base" of space facts. When you ask it a question, it will search its library first.

---

## 🚀 Let's Build: `09_vector_memory.py`

```python
import json
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# We'll use a mock "Knowledge Base" for this lesson
KNOWLEDGE_BASE = [
    "The Moon is 384,400 km away from Earth.",
    "Mars is known as the Red Planet due to iron oxide on its surface.",
    "Venus is the hottest planet in our solar system because of its thick atmosphere.",
    "Jupiter is a gas giant and is the largest planet in our solar system.",
    "Saturn has the most extensive ring system of any planet.",
    "A day on Venus is longer than a year on Venus.",
    "The sun accounts for 99.86% of the mass in the solar system."
]

class LibraryAgent:
    def __init__(self):
        self.client = OpenAI(
            base_url="http://localhost:11434/v1",
            api_key="ollama"
        )
        self.memory = KNOWLEDGE_BASE

    def find_relevant_info(self, query: str):
        """
        In a real app, we'd use 'Embeddings' and a Vector DB here.
        For this lesson, we'll use a 'Keyword Matcher' to simulate retrieval.
        """
        print(f"🔍 Searching library for: '{query}'...")
        keywords = query.lower().split()
        results = []
        for fact in self.memory:
            if any(word in fact.lower() for word in keywords):
                results.append(fact)
        
        return "\n".join(results) if results else "No specific facts found in library."

    def ask(self, question: str):
        # 1. RETRIEVE
        context = self.find_relevant_info(question)

        # 2. AUGMENT
        prompt = f"""
        You are a Space Expert Agent. Use the following pieces of context to answer the user's question.
        If the answer isn't in the context, say you don't know based on the library.

        LIBRARY CONTEXT:
        {context}

        USER QUESTION:
        {question}
        """

        # 3. GENERATE
        response = self.client.chat.completions.create(
            model="llama3.2",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content

# --- TEST DRIVE ---
agent = LibraryAgent()
print("\n🤖 Agent:", agent.ask("How hot is Venus and why?"))
print("\n🤖 Agent:", agent.ask("Tell me about the moon's distance."))
```

---

## 🎓 Summary & Homework
### What we learned:
1. **Context Limits:** Why agents need external memory.
2. **RAG:** The Retrieve -> Augment -> Generate workflow.
3. **Embeddings:** Turning meaning into numbers (conceptually).

### 🏆 Pro-Tip:
In the next chapter, we will replace our "Keyword Matcher" with a real Vector Database called **ChromaDB**. This will allow the agent to find facts even if the words don't match exactly!

### 📝 Exercise:
Add 3 more facts to the `KNOWLEDGE_BASE` about your favorite topic (e.g., coding, cooking, or history) and see if the agent can retrieve them.

---
**Next Module: The Agent's Face (Web Dashboard)** — We'll give our agent a UI! 🌐
