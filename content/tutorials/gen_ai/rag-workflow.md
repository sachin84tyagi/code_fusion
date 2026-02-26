# Phase 5: Embeddings + Vector DB + RAG - Step 3 (The RAG Workflow)

You have the **Search Engine** (ChromaDB) and the **Intelligence** (OpenAI). Now, we are going to perform the "Marriage" of these two: **RAG**.

RAG stands for **Retrieval-Augmented Generation**.

---

## 1. The Three-Step Dance
Instead of just asking the AI a question, we follow a process:

1.  **Retrieve:** You take the user's question, turn it into a vector, and find the most relevant document in your **Vector DB**.
2.  **Augment:** You take that document and "stuff" it into a new prompt for the AI.
3.  **Generate:** You ask the AI: *"Using this document as your only source of truth, answer the user's question."*

**The Result:** The AI answers using your private data, but with the perfect grammar and reasoning of a world-class model.

## 2. The "Context Window"
Think of the LLM like a **Goldfish**. It has a limited "Context Window" (Short-term memory). We use RAG to feed it exactly what it needs for the current question, so it doesn't get overwhelmed by your millions of other documents.

---

## 3. The Coding Exercise (Hands-on)

We are going to build a script that retrieves a "Secret Recipe" from ChromaDB and uses it to answer a cooking question via OpenAI (Mock Mode).

#### Step 1: The "RAG workflow" script
Create a file named `rag_workflow.py` inside your `Phase5` folder:

```python
import chromadb
from openai import OpenAI

# 1. Setup Clients
client_db = chromadb.PersistentClient(path="Phase5/chroma_storage")
client_ai = OpenAI(api_key="sk-DUMMY")
USE_MOCK = True

# 2. Prepare our "Knowledge"
collection = client_db.get_or_create_collection(name="recipes")
collection.add(
    documents=["The Secret Sauce uses 2 cups of sugar, 1 cup of vinegar, and secret spice X."],
    ids=["recipe_01"]
)

def run_rag(user_query):
    print(f"\n[USER]: {user_query}")

    # --- STEP 1: RETRIEVE ---
    results = collection.query(query_texts=[user_query], n_results=1)
    retrieved_context = results['documents'][0][0]
    print(f"✅ Retrieved Context: {retrieved_context}")

    # --- STEP 2: AUGMENT ---
    # We build a 'Super-Prompt' that includes the secret knowledge
    rag_prompt = f"""
    Use the following CONTEXT to answer the user's question.
    If the answer is not in the context, say 'I do not know'.
    
    CONTEXT: {retrieved_context}
    USER QUESTION: {user_query}
    """

    # --- STEP 3: GENERATE ---
    if USE_MOCK:
        ai_reply = f"MOCK: To make the Secret Sauce, you need {retrieved_context.split('uses ')[1]}"
    else:
        response = client_ai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": rag_prompt}]
        )
        ai_reply = response.choices[0].message.content

    print(f"\n[FINAL AI ANSWER]:\n{ai_reply}")

# Test the RAG Loop
run_rag("What are the ingredients for the Secret Sauce?")
```

---

## 4. Why this matters (Production Insight)
This is how **enterprise search** works. When you ask a bot inside a big company "What is the policy on maternity leave?", it doesn't "know" the answer. It **retrieves** the HR PDF, **augments** the prompt with that text, and **generates** a human-like summary for you.

---
**Summary:**
- **RAG:** Search -> Combine -> Ask.
- **Grounding:** Giving the AI a "Source of Truth" to stop hallucinations.

**Next Step:** Once you run this, we'll build the Phase 5 Capstone: [Project: Chat with your PDF](file:///d:/myFirstAITest/Phase5/phase5_project.md). 🚀
