# Phase 07 — Retrieval Systems: Making Search Smarter

> **Level:** Intermediate | **Goal:** Go beyond basic similarity search to production-grade retrieval

---

## 1. Why Basic Retrieval Is Not Enough

The basic RAG system from Phase 06 uses simple **cosine similarity** — it finds the vectors closest to your question. This works well most of the time, but fails in real production scenarios.

**Real problems you will face:**

```
Problem 1: Keyword Precision
User asks: "SOC 2 compliance"
Semantic search may miss exact acronyms and proper nouns
Better solution: Combine semantic + keyword search (Hybrid Search)

Problem 2: Short Queries vs Long Queries
User asks: "refund" (just one word)
Semantic embedding of one word is poor quality
Better solution: Query expansion (expand to full question)

Problem 3: Retrieval Quality vs LLM Quality
You retrieve the right chunks, but they have noise (tables, headers)
Better solution: Reranking to prioritize the best chunks

Problem 4: User asks ambiguous question
"What is the policy?" — Which policy?
Better solution: Multi-query retrieval
```

---

## 2. Types of Retrieval Systems

```
                    RETRIEVAL TYPES
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
   Dense Retrieval   Sparse Retrieval   Hybrid Retrieval
   (Semantic)        (Keyword)          (Both Combined)
         │                │                │
   Uses embeddings   Uses BM25/TF-IDF   Best of both worlds
   Understands       Exact word match   Most powerful
   meaning           Very fast          Production standard
```

---

## 3. Dense Retrieval (What You Already Know)

Dense retrieval is what you built in Phase 06. It uses embedding vectors.

```
Query: "How do I get my money back?"
Embedding: [0.23, -0.41, 0.87, ...]

Stored chunks:
"Refund policy: 30-day returns" → [0.21, -0.39, 0.85, ...] ← Similar!
"Product pricing page"         → [-0.62, 0.71, -0.33, ...] ← Different

Result: Correctly finds the refund policy!
```

**Strength:** Understands meaning and synonyms
**Weakness:** Misses exact proper nouns, codes, acronyms

---

## 4. Sparse Retrieval — BM25

BM25 is the algorithm that powers old-school search engines. It counts word frequencies and ranks by exact keyword matches.

```
Query: "GPT-4 architecture"

BM25 finds: Documents literally containing "GPT-4" and "architecture"
Dense search finds: Documents about "large language model design"

Winner: BM25 for exact technical terms, Dense for concept understanding
```

```python
# Using BM25 in LangChain
# pip install rank_bm25 langchain-community

from langchain_community.retrievers import BM25Retriever
from langchain_core.documents import Document

# Create documents
docs = [
    Document(page_content="GPT-4 uses a transformer architecture with 1.7T parameters"),
    Document(page_content="BERT is a bidirectional transformer model by Google"),
    Document(page_content="Llama 3.2 is Meta's open source language model"),
    Document(page_content="Claude uses constitutional AI for alignment"),
]

# Create BM25 retriever
bm25_retriever = BM25Retriever.from_documents(docs)
bm25_retriever.k = 2  # Return top 2 results

# Search (exact keyword matching)
results = bm25_retriever.invoke("GPT-4 architecture")
for doc in results:
    print(doc.page_content)
```

---

## 5. Hybrid Search — The Production Standard

Hybrid search combines BM25 (keyword) and dense (semantic) retrieval. You get the best of both worlds.

```
Query: "How does GPT-4 handle context windows?"

BM25 finds: "GPT-4 supports 128K context windows" (exact match!)
Dense finds: "Large language models process long text sequences" (meaning match!)

Hybrid combines: Both results, deduplicated and re-ranked
Final result: The most relevant chunk from either search method
```

```python
# hybrid_search.py
# Combining dense + sparse retrieval

from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_core.documents import Document

# Sample documents
documents = [
    Document(page_content="GPT-4 supports 128K context window tokens"),
    Document(page_content="Claude 3 by Anthropic handles very long documents"),
    Document(page_content="Our refund policy: returns accepted within 30 days"),
    Document(page_content="Customer support hours: Monday to Friday 9AM-6PM"),
    Document(page_content="GPT-4 Vision can analyze and describe images"),
    Document(page_content="API pricing: $0.01 per 1000 tokens for GPT-3.5"),
]

# --- Dense Retriever (Semantic) ---
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma.from_documents(documents=documents, embedding=embeddings)
dense_retriever = vector_store.as_retriever(search_kwargs={"k": 3})

# --- Sparse Retriever (BM25 Keyword) ---
bm25_retriever = BM25Retriever.from_documents(documents)
bm25_retriever.k = 3

# --- Hybrid Retriever (Combine Both!) ---
hybrid_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, dense_retriever],
    weights=[0.5, 0.5]  # Equal weight to both methods
    # Try weights=[0.3, 0.7] to favor semantic search
)

# Test it
query = "GPT-4 context length"
results = hybrid_retriever.invoke(query)

print(f"Hybrid search results for: '{query}'")
for i, doc in enumerate(results, 1):
    print(f"\n{i}. {doc.page_content}")
```

---

## 6. Multi-Query Retrieval — Handle Ambiguous Questions

If the user asks a vague question, generate multiple variations and retrieve for all of them.

```
User asks: "Tell me about the policy"

Multi-query generates 3 variations:
  1. "What is the refund policy?"
  2. "What is the privacy policy?"
  3. "What are the terms of service?"

Retrieves documents for ALL 3 queries
Deduplicates and combines results

Result: Much better coverage than a single vague query!
```

```python
# multi_query_retrieval.py

from langchain.retrievers.multi_query import MultiQueryRetriever
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain_core.documents import Document

# Sample documents
docs = [
    Document(page_content="Our data is encrypted with AES-256 at rest"),
    Document(page_content="Refunds must be requested within 30 days"),
    Document(page_content="Users can delete their account from Settings > Privacy"),
    Document(page_content="We never sell your personal data to third parties"),
    Document(page_content="GDPR compliance: EU users can request data export"),
]

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma.from_documents(documents=docs, embedding=embeddings)

# The LLM is used to GENERATE multiple query variations
llm = OllamaLLM(model="llama3.2")

# Multi-query retriever uses LLM to rephrase the question 3 different ways
multi_query_retriever = MultiQueryRetriever.from_llm(
    retriever=vector_store.as_retriever(search_kwargs={"k": 2}),
    llm=llm
)

# Ask a vague question
results = multi_query_retriever.invoke("What are your privacy practices?")

print("Multi-query results:")
for doc in results:
    print(f"- {doc.page_content}")
```

---

## 7. Re-Ranking — Quality Over Quantity

After retrieval, use a re-ranker to sort results by actual relevance to the question.

```
Before re-ranking:
Rank 1 (similarity 0.82): "Refunds allowed after 30 days of request"  ← Actually less relevant
Rank 2 (similarity 0.79): "Returns accepted within 30 days of purchase" ← Actually most relevant
Rank 3 (similarity 0.75): "Contact support for refund help"

After re-ranking (Cross-Encoder):
Rank 1: "Returns accepted within 30 days of purchase"  ← Correctly promoted!
Rank 2: "Contact support for refund help"
Rank 3: "Refunds allowed after 30 days of request"
```

```python
# reranking_demo.py
# pip install sentence-transformers

from sentence_transformers import CrossEncoder

# Cross-encoder: Takes (query, document) pair and gives a relevance score
# More accurate than bi-encoder similarity but slower
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

query = "What is the refund window?"

# Candidate documents retrieved by vector search
candidates = [
    "Our return window is 14 days for all products.",
    "Contact customer support for help with orders.",
    "All products come with a 1-year manufacturer warranty.",
    "Refunds are processed within 5-7 business days to your original payment method.",
    "Shipping is free for orders over $50.",
]

# Re-rank: Score each (query, candidate) pair
pairs = [[query, candidate] for candidate in candidates]
scores = cross_encoder.predict(pairs)

# Sort by score (highest first)
ranked = sorted(zip(scores, candidates), reverse=True)

print(f"Re-ranked results for: '{query}'\n")
for score, doc in ranked:
    bar = "#" * int((score + 5) * 3)  # Normalize for display
    print(f"  Score {score:.3f}: {doc}")
```

---

## 8. Contextual Compression — Reduce Noise

Retrieved chunks often contain irrelevant sentences. Compression extracts only the relevant parts.

```python
# contextual_compression.py

from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain_core.documents import Document

# A chunk that contains a lot of information (some relevant, some not)
docs = [
    Document(page_content="""
Our company policies are as follows. 
Working hours are 9AM to 6PM Monday through Friday. 
Refunds are processed within 3 business days of the return being received. 
We offer free parking in lot B. 
The kitchen is available 24 hours. 
Overtime pay is 1.5x for hours over 40 per week.
    """),
    Document(page_content="""
Customer accounts can be managed from the profile page.
Passwords must be at least 12 characters with a number and symbol.
Two-factor authentication is strongly recommended.
Profile pictures can be up to 5MB in PNG or JPG format.
Display names can be changed once every 30 days.
    """),
]

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma.from_documents(documents=docs, embedding=embeddings)
base_retriever = vector_store.as_retriever(search_kwargs={"k": 2})

llm = OllamaLLM(model="llama3.2")

# The compressor uses the LLM to extract ONLY the relevant sentence(s)
compressor = LLMChainExtractor.from_llm(llm)

compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=base_retriever
)

query = "How quickly are refunds processed?"
compressed_docs = compression_retriever.invoke(query)

print(f"Query: {query}")
print("\nCompressed (only relevant parts):")
for doc in compressed_docs:
    print(f"  - {doc.page_content}")
```

---

## 9. Retrieval Decision Guide

```
Your Situation                    → Best Retrieval Method
──────────────────────────────────────────────────────────
Simple Q&A, clean documents      → Dense (basic similarity search)
Technical docs with codes/names  → Hybrid (Dense + BM25)
Ambiguous user questions          → Multi-Query Retrieval
Speed is critical                 → FAISS + no re-ranking
Quality is critical               → Hybrid + Cross-Encoder re-ranking
Large noisy documents             → Contextual Compression
Production enterprise system      → All of the above combined!
```

---

## 10. Mini Challenge

1. Run `hybrid_search.py` and compare results with just dense search
2. Add 5 more documents on any topic
3. Try querying with a keyword that only BM25 would find (a product code, exact name)
4. Does hybrid search find it? Does pure semantic search find it?

---

## Quick Recap

| Technique | What It Does | When To Use |
|-----------|-------------|-------------|
| Dense Retrieval | Find by meaning/semantics | General questions |
| BM25 Retrieval | Find by exact keywords | Technical terms, codes |
| Hybrid Search | Combine both | Production (most cases) |
| Multi-Query | Generate 3+ query variations | Vague/ambiguous questions |
| Re-Ranking | Re-score results by true relevance | When precision matters |
| Compression | Extract only relevant sentences | Noisy, long documents |

---

> **Up Next: Phase 08 — RAG Pipeline Architecture**
> Design the full production RAG pipeline from data ingestion to response delivery.
