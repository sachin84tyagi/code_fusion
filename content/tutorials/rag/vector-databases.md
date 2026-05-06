# Phase 05 — Vector Databases: The Memory of Your RAG System

> **Level:** Beginner-Intermediate | **Goal:** Understand where vectors are stored and how lightning-fast search works

---

## 1. Simple Explanation

You now know how to turn text into vectors (numbers). But where do you keep thousands of these vectors? And how do you find the most similar ones instantly?

That is the job of a **Vector Database**.

Think of it as a **super-powered filing cabinet** that doesn't organize files by alphabetical order or by date — it organizes them by **meaning**. When you ask a question, the cabinet instantly finds the files that are most *semantically similar* to your question.

---

## 2. Real-Life Analogy — Netflix Recommendation System

When Netflix recommends a movie, it doesn't search for movies with the same title. It finds movies that feel similar based on genre, director style, cast, pacing, and themes.

That is exactly what vector databases do:
- **Traditional search** → Find documents containing the exact words "password reset"
- **Vector search** → Find documents that *talk about the concept* of resetting login credentials

---

## 3. SQL Database vs Vector Database

```
SQL DATABASE:                          VECTOR DATABASE:
─────────────────────────────────────────────────────────
Stores: Structured rows & columns      Stores: High-dimensional vectors

Query: "WHERE name = 'John'"           Query: "Find vectors similar to [0.23, -0.41, ...]"

Search: Exact match                    Search: Approximate nearest neighbor (ANN)

Speed: Fast for exact lookups          Speed: Fast for similarity search

Best for: User accounts, orders,       Best for: Semantic search, RAG,
          financial records            recommendations, image search

Example:                               Example:
┌────────────────────┐                 Vector Space:
│id │name  │age │dept│                   ●cat
│───┼──────┼────┼────│                    ●kitten    ← nearby
│1  │Alice │28  │Eng │                 ●dog (a bit further)
│2  │Bob   │34  │HR  │                          ●car (far away)
└────────────────────┘
```

---

## 4. How Vector Search Works Internally

```
Your Question: "What is the refund policy?"
        ↓
[Embedding Model]
Converts question to vector: [0.23, -0.41, 0.87, ...]
        ↓
[Vector Database — ANN Search]
Compares against ALL stored vectors using cosine similarity
Finds the TOP-K most similar vectors (e.g., top 3)
        ↓
[Results]
Chunk 1 (similarity: 0.92): "Refunds are accepted within 14 days..."
Chunk 2 (similarity: 0.87): "To request a refund, visit the returns page..."
Chunk 3 (similarity: 0.79): "For damaged items, contact support within 48 hours..."
        ↓
These 3 chunks are sent to the LLM as context
```

The search algorithm (called **ANN — Approximate Nearest Neighbor**) is smart enough to search millions of vectors in milliseconds.

---

## 5. The Four Major Vector Databases

### ChromaDB (Best for Beginners — Free, Local)

```
Pros:
- Runs locally on your computer (no cloud account needed)
- Very easy to set up (5 lines of code)
- Free forever
- Persists data to disk

Cons:
- Not designed for massive scale (tens of millions of vectors)
- Single machine only

Best for: Development, learning, small production apps
```

### FAISS by Facebook (Best for Speed — Free)

```
Pros:
- Extremely fast (designed for billions of vectors)
- Open source, made by Meta AI Research
- Excellent for research and offline batch processing

Cons:
- No built-in metadata filtering
- Doesn't persist automatically (you save/load manually)
- Requires more manual management

Best for: Speed-critical applications, research, large offline datasets
```

### Pinecone (Best for Production Cloud — Paid)

```
Pros:
- Fully managed (no servers to maintain)
- Scales automatically
- Built-in metadata filtering
- Global, low-latency search

Cons:
- Costs money (paid service)
- Requires internet connection

Best for: Production SaaS apps, enterprise products, teams
```

### Weaviate (Best for Advanced Features — Free/Cloud)

```
Pros:
- Hybrid search (vector + keyword in one query)
- GraphQL API
- Built-in schema management
- Self-hostable

Cons:
- More complex to set up
- Steeper learning curve

Best for: Enterprise search platforms, advanced retrieval systems
```

---

## 6. Code Example — ChromaDB (Start Here!)

```python
# chroma_demo.py
# Building a simple vector store with ChromaDB
# pip install chromadb sentence-transformers langchain langchain-community

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings

# ============================================================
# STEP 1: Prepare some sample documents (like chunks from a PDF)
# ============================================================
documents = [
    "Our refund policy allows returns within 14 days of purchase.",
    "To reset your password, click 'Forgot Password' on the login page.",
    "We offer three subscription tiers: Basic, Pro, and Enterprise.",
    "Our customer support team is available Monday through Friday, 9AM to 6PM EST.",
    "To upgrade your plan, go to Account Settings and click on 'Billing'.",
    "All orders over $50 qualify for free standard shipping.",
    "We accept Visa, Mastercard, American Express, and PayPal.",
]

# ============================================================
# STEP 2: Set up the embedding model (converts text to vectors)
# ============================================================
embeddings = SentenceTransformerEmbeddings(
    model_name="all-MiniLM-L6-v2"  # Free, local, fast
)

print("[1] Embedding model ready")

# ============================================================
# STEP 3: Create the vector store and add documents
# ============================================================
# ChromaDB will:
# 1. Embed each document (convert to vector)
# 2. Store both the text and its vector in a local database
vector_store = Chroma.from_texts(
    texts=documents,
    embedding=embeddings,
    persist_directory="./chroma_db"  # Save to disk so it survives restarts
)

print("[2] Vector store created with all documents!")
print(f"    Stored {len(documents)} documents")

# ============================================================
# STEP 4: Search the vector store
# ============================================================
query = "How do I get a refund?"

print(f"\n[3] Searching for: '{query}'")
results = vector_store.similarity_search(
    query=query,
    k=2  # Return top 2 most similar documents
)

print("\n[4] Top results:")
for i, doc in enumerate(results, 1):
    print(f"\n  Result {i}:")
    print(f"  Text: {doc.page_content}")

# ============================================================
# STEP 5: Search with similarity scores
# ============================================================
results_with_scores = vector_store.similarity_search_with_score(
    query=query,
    k=3
)

print("\n\n[5] Results with similarity scores:")
print("-" * 55)
for doc, score in results_with_scores:
    # Score is distance (lower = more similar for Chroma)
    similarity = 1 - score  # Convert distance to similarity
    bar = "#" * int(similarity * 30)
    print(f"  {similarity:.3f} |{bar}|")
    print(f"         {doc.page_content[:80]}...")
    print()
```

**Expected Output:**
```
[1] Embedding model ready
[2] Vector store created with all documents!
    Stored 7 documents

[3] Searching for: 'How do I get a refund?'

[4] Top results:

  Result 1:
  Text: Our refund policy allows returns within 14 days of purchase.

  Result 2:
  Text: Our customer support team is available Monday through Friday, 9AM to 6PM EST.


[5] Results with similarity scores:
-------------------------------------------------------
  0.821 |########################|
         Our refund policy allows returns within 14 days of purchase....

  0.643 |###################|
         Our customer support team is available Monday through Friday...

  0.511 |###############|
         All orders over $50 qualify for free standard shipping....
```

---

## 7. Line-by-Line Explanation

```python
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
# ↑ Creates an embedding model object
# When we add documents or search, this model converts text to vectors

vector_store = Chroma.from_texts(texts=documents, embedding=embeddings, persist_directory="./chroma_db")
# ↑ Chroma.from_texts does three things:
#   1. Takes each text in the list
#   2. Passes it through the embedding model to get a vector
#   3. Stores the (vector, text) pairs in a ChromaDB database on disk

results = vector_store.similarity_search(query=query, k=2)
# ↑ similarity_search does:
#   1. Embeds the query using the same embedding model
#   2. Searches the database for the k most similar vectors
#   3. Returns the original text chunks (not the vectors) for those results
```

---

## 8. Adding Metadata to Your Chunks

Metadata is extra information attached to each chunk. It helps you filter and track sources.

```python
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain.schema import Document

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

# Create Document objects with metadata
documents_with_metadata = [
    Document(
        page_content="Our refund policy allows returns within 14 days.",
        metadata={"source": "policy.pdf", "page": 1, "category": "refunds"}
    ),
    Document(
        page_content="To reset your password, click 'Forgot Password'.",
        metadata={"source": "help.pdf", "page": 3, "category": "account"}
    ),
    Document(
        page_content="Enterprise plans include unlimited users.",
        metadata={"source": "pricing.pdf", "page": 5, "category": "billing"}
    ),
]

# Create vector store with metadata
vector_store = Chroma.from_documents(
    documents=documents_with_metadata,
    embedding=embeddings,
    persist_directory="./chroma_db_with_metadata"
)

# Filter search by metadata!
results = vector_store.similarity_search(
    query="What are my account options?",
    k=2,
    filter={"category": "account"}  # Only search in "account" category
)

print("Filtered results:")
for doc in results:
    print(f"  Source: {doc.metadata['source']}")
    print(f"  Text: {doc.page_content}")
```

---

## 9. Loading an Existing Vector Store (Don't Re-Index Every Time!)

```python
# WRONG way (rebuilds from scratch every time — SLOW and EXPENSIVE)
vector_store = Chroma.from_texts(texts=documents, embedding=embeddings)

# RIGHT way (loads existing database from disk — FAST)
vector_store = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings
)
# Now it's loaded from disk — use it immediately for search
```

---

## 10. FAISS Example (Super Fast Alternative)

```python
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import SentenceTransformerEmbeddings

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

documents = [
    "Refunds are accepted within 14 days.",
    "Free shipping on orders over $50.",
    "Contact support at help@company.com",
]

# Create FAISS vector store
vector_store = FAISS.from_texts(texts=documents, embedding=embeddings)

# Save to disk (FAISS doesn't auto-save)
vector_store.save_local("./faiss_index")

# Load from disk
loaded_store = FAISS.load_local(
    "./faiss_index",
    embeddings,
    allow_dangerous_deserialization=True  # Required for loading saved FAISS
)

# Search
results = loaded_store.similarity_search("refund policy", k=1)
print(results[0].page_content)
```

---

## 11. Common Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Using different embedding model for search vs indexing | Complete garbage results | Use the SAME embedding model always |
| Rebuilding the index on every app start | 10-60 second startup, high API cost | Save index to disk, load at startup |
| Not using metadata | Can't filter by source/date/category | Always add source, page, date metadata |
| Ignoring similarity scores | Fetching irrelevant results | Set a minimum similarity threshold |
| One giant collection for all content | Mixes unrelated document types | Separate collections per document type |

---

## 12. Mini Challenge

1. Run the `chroma_demo.py` code above
2. Add 5 more documents of your choice (about any topic)
3. Search for a question related to your new documents
4. Does the retrieval find the right answer?
5. Try changing `k=2` to `k=5` — what happens?

---

## Quick Recap

| Concept | Explanation |
|---------|-------------|
| Vector Database | A database optimized for storing and searching high-dimensional vectors |
| ANN Search | Approximate Nearest Neighbor — finds similar vectors at lightning speed |
| ChromaDB | Best beginner vector DB — free, local, easy |
| FAISS | Best for speed — made by Facebook, excellent for large datasets |
| Pinecone | Best cloud vector DB — managed, production-ready |
| Metadata filtering | Narrow your search to specific document types, dates, categories |
| k (Top-K) | How many results to retrieve (usually 3-5 for RAG) |

---

> **Up Next: Phase 06 — Building Your First RAG System**
> We put everything together: load a PDF, chunk it, embed it, store it, and answer questions!
