# Phase 5: Embeddings + Vector DB + RAG - Step 2 (Vector Database Basics)

In the last step, we manually searched through a small list of sentences. But what if you have 10,000 PDFs? You need a **Vector Database**. 

A Vector Database is like a specialized filing cabinet that stores "Meanings" (Vectors) instead of just words.

---

## 1. Why ChromaDB?
There are many vector databases (Pinecone, Milvus, Weaviate), but **ChromaDB** is the favorite for AI Engineers because:
- **It's Local:** You don't need a cloud account or a credit card to start.
- **It's Simple:** You can set it up in 4 lines of Python.
- **It's "Batteries Included":** It can handle the embedding calculation for you automatically.

## 2. The Core Concept: Collections
Instead of "Tables" (like SQL), ChromaDB uses **Collections**. 
- You add **Documents** (text) to a collection.
- ChromaDB turns them into **Embeddings** (vectors) and saves them to your hard drive.
- Later, you **Query** the collection to find the most similar items.

---

## 3. The Coding Exercise (Hands-on)

We are going to build a persistent "AI Memory" that saves your notes to a folder.

#### Step 1: Install ChromaDB
Run this in your terminal:
```bash
pip install chromadb
```

#### Step 2: The "Chroma Basics" script
Create a file named `chroma_db_basics.py` inside your `Phase5` folder:

```python
import chromadb

# 1. Initialize the Client
# 'path' tells Chroma where to save the data on your disk.
client = chromadb.PersistentClient(path="Phase5/chroma_storage")

# 2. Create a 'Collection' (Like a table for AI)
# get_or_create means it won't error if you run the script twice.
collection = client.get_or_create_collection(name="my_notes")

# 3. Add data to the collection
# Chroma will handle the 'Vectorizing' automatically!
collection.add(
    documents=[
        "The project deadline is next Friday.",
        "The server password is 'ai_is_cool_2024'.",
        "Lunch is at 1 PM in the cafeteria."
    ],
    ids=["id1", "id2", "id3"]
)

print("✅ Data saved to Vector DB.")

# 4. Query the database
# We search for 'meeting time' - even though that phrase isn't in the docs!
results = collection.query(
    query_texts=["When should I eat?"],
    n_results=1
)

print(f"\n[QUERY]: When should I eat?")
print(f"[RESULT]: {results['documents'][0][0]}")
```

---

## 4. Why this matters (Production Insight)
This is exactly how companies build **"Chat with your Data"** apps. 
1. They take all their internal Slack messages/Emails.
2. They save them into **ChromaDB**.
3. When an employee asks a question, ChromaDB finds the relevant message and gives it to the LLM to summarize.

---
**Summary:**
- **PersistentClient:** Saves your AI memory to a folder.
- **Collection:** A group of related AI documents.
- **Query:** Finding data by "Vibe" or "Meaning."

**Next Step:** Once you run this, we'll combine everything into the full [RAG Workflow (Retrieve -> Augment -> Generate)](file:///d:/myFirstAITest/Phase5/phase5_rag_workflow.md). 🚀
