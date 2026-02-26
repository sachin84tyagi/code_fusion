# Phase 5: Embeddings + Vector DB + RAG - Step 6 (Final Project: AI Knowledgebase Chatbot)

Congratulations! You've reached the graduation project for Phase 5. 

You are going to build an **AI Knowledgebase Chatbot**. This bot will allow you to "Upload" text data into a persistent memory and then "Chat" with it using a professional RAG pipeline.

---

## 1. Project Requirements
Your chatbot must demonstrate the "Pro RAG Stack":
1.  **Ingestion:** A way to add new facts to a persistent **ChromaDB** collection.
2.  **Retrieval:** Use **Semantic Search** to find facts based on the user's query.
3.  **Grounding:** An OpenAI prompt that forces the AI to use the **Retrieved Context** as its only source of truth.

---

## 2. The Coding Project (Hands-on)

#### Step 1: The Knowledgebase Chatbot script
Create a file named `kb_chatbot.py` inside your `Phase5` folder:

```python
import chromadb
from openai import OpenAI

# 1. Setup Clients
client_db = chromadb.PersistentClient(path="Phase5/kb_storage")
client_ai = OpenAI(api_key="sk-DUMMY")
USE_MOCK = True

# 2. Setup Collection
collection = client_db.get_or_create_collection(name="my_knowledge")

def add_fact(fact_text, fact_id):
    """Saves a new fact to the database."""
    collection.add(documents=[fact_text], ids=[fact_id])
    print(f"✅ Fact Added: {fact_id}")

def chat_with_data(user_query):
    print(f"\n[USER]: {user_query}")

    # --- RETRIEVAL ---
    results = collection.query(query_texts=[user_query], n_results=2)
    
    if not results['documents'][0]:
        print("[AI]: I don't have enough information in my database.")
        return

    context = " ".join(results['documents'][0])
    
    # --- PROMPT AUGMENTATION ---
    prompt = f"""
    You are a helpdesk assistant. Use ONLY the context below. 
    If the answer isn't there, say 'I cannot help with that'.
    
    CONTEXT: {context}
    QUESTION: {user_query}
    """

    # --- GENERATION ---
    if USE_MOCK:
        reply = f"MOCK: Based on my database, {context}. To answer you: yes, that's correct."
    else:
        response = client_ai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        reply = response.choices[0].message.content

    print(f"[AI]: {reply}")

# --- TEST THE SYSTEM ---
# 1. Add some facts
add_fact("The company printer is located on the 3rd floor, Room 302.", "printer_loc")
add_fact("Our technical lead is Sachi, who specializes in AI Engineering.", "tech_lead")

# 2. Ask questions
chat_with_data("Where can I find the printer?")
chat_with_data("Who is Sachi?")
```

---

## 3. Graduation Insight
You have just built the core logic of apps like **PDF.ai** or **ChatPDF**. 
- In those apps, they "Chunk" the PDF file into thousand of small pieces.
- They "Index" them in a Vector DB.
- They "Search" them when the user types a question.

By mastering this, you are now capable of building chatbots that know things that are **NOT** in the AI's training data. This is the #1 skill in AI development today.

**Phase 5 is now officially COMPLETE!** 🚀🎓

Next, we enter **Phase 6: LLM Engineering (Real Systems)**. We'll learn how to build production-grade systems that handle errors, rate limits, and multi-step reasoning! 🏗️🔥
