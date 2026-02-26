# Phase 5: Embeddings + Vector DB + RAG - Step 1 (Vector Search)

In Phase 1, we learned that **Embeddings** turn words into numbers. Now, we are going to use those numbers to build a **Search Engine** that understands meaning, not just keywords.

---

## 1. Keyword Search vs. Semantic Search
- **Keyword Search (Old Way):** You search for "dog." It only finds pages with the exact word "dog." It misses "Golden Retriever" or "puppy."
- **Semantic Search (AI Way):** You search for "dog." The computer sees the vector (numbers) for "dog" is very close to "puppy." It finds the result even without the exact word.

**Why this matters:** This is the foundation of **RAG (Retrieval Augmented Generation)**. Before the AI answers a question, it "searches" your private documents for the answer first.

## 2. Measuring Similarity (Cosine Similarity)
AI Engineers use a math formula called **Cosine Similarity** to calculate how "close" two vectors are.
- Score = **1.0**: The meanings are identical.
- Score = **0.8**: High similarity (e.g., "Apple" and "Fruit").
- Score = **0.1**: No relation (e.g., "Apple" and "Airplane").

---

## 3. The Coding Exercise (Hands-on)

We are going to build a "Semantic Matcher" that finds the most relevant document for a user's question.

#### Step 1: Install the requirements
We'll use `scikit-learn` for the math and `sentence-transformers` for the embeddings.
```bash
pip install sentence-transformers scikit-learn
```

#### Step 2: The "Vector Search" script
Create a file named `vector_search_basics.py` inside your `Phase5` folder:

```python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# 1. Load the "Encoder" (The Brain that turns text to vectors)
print("Loading model... (This may take a moment)")
model = SentenceTransformer('all-MiniLM-L6-v2')

# 2. Our "Database" of private documents
documents = [
    "Python is a versatile programming language.",
    "The capital of France is Paris.",
    "Machine learning is a subset of AI.",
    "A Great Dane is a large breed of dog."
]

# Convert documents to vectors (Embeddings)
doc_vectors = model.encode(documents)

def semantic_search(query):
    print(f"\n[QUERY]: {query}")
    
    # Convert query to a vector
    query_vector = model.encode([query])
    
    # Calculate similarity between query and all docs
    distances = cosine_similarity(query_vector, doc_vectors)[0]
    
    # Find the index of the highest score
    best_index = distances.argmax()
    best_score = distances[best_index]
    
    print(f"--- MATCH FOUND (Confidence: {best_score:.2f}) ---")
    print(f"RESULT: {documents[best_index]}")

# Test the Semantic Search
# Notice: I don't use the word 'AI' or 'Dog' in the search!
semantic_search("Tell me about neural networks")
semantic_search("Information about puppies")
```

---

## 4. Why this matters (Production Insight)
In a real company, you don't just have 4 sentences. You have 4 million. You store these vectors in a **Vector Database** (like ChromaDB or Pinecone). When a user asks a question, the database finds the best document in milliseconds. 

That document is then "stuffed" into the prompt for the LLM to read. This is how you stop AI from hallucinating—you give it the open-book answer!

---
**Summary:**
- **Vector Search:** Finding data by meaning, not text.
- **RAG:** The process of searching first, then generating.

**Next Step:** Once you run this, we'll learn how to use a real database: [ChromaDB / Vector Database Basics](file:///d:/myFirstAITest/Phase5/phase5_vector_db.md). 🚀
