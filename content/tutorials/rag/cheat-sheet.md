# RAG Mastery — Complete Cheat Sheet
> Your one-stop reference from zero to production. Print it, pin it, live by it.

---

## 🧠 Core Concept (One Sentence)

> **RAG = Find relevant documents FIRST → Give them to the LLM → Get a grounded answer**

---

## 📐 RAG Architecture at a Glance

```
INDEXING (Run Once):
Documents → Loader → Chunker → Embedding Model → Vector DB

QUERYING (Every Request):
User Question → Embed → Search Vector DB → Top-K Chunks
                                                  ↓
                              Prompt: "Context: [chunks] + Question: [q]"
                                                  ↓
                                          LLM → Final Answer
```

---

## 📦 Packages Quick Install

```bash
# Core
pip install langchain langchain-community langchain-openai langchain-ollama

# Vector DBs
pip install chromadb faiss-cpu

# Embeddings (local, free)
pip install sentence-transformers

# Documents
pip install pypdf python-docx unstructured

# Production
pip install fastapi uvicorn redis pydantic python-dotenv

# Evaluation
pip install ragas datasets

# Token counting
pip install tiktoken
```

---

## 🧩 Phase-by-Phase Quick Reference

### Phase 01 — Fundamentals

| Concept | Quick Definition |
|---------|----------------|
| RAG | Retrieval-Augmented Generation — give AI access to your documents |
| Hallucination | AI making up confident-sounding wrong answers |
| Knowledge Cutoff | Model knows nothing after its training date |
| Indexing Phase | Process documents once: Load → Chunk → Embed → Store |
| Query Phase | On every question: Embed → Search → Retrieve → Generate |
| RAG vs Fine-tuning | RAG = open book exam. Fine-tuning = back to school |

---

### Phase 02 — Environment Setup

```bash
# Virtual environment (do this FIRST every project)
python -m venv venv
venv\Scripts\activate           # Windows
source venv/bin/activate        # Mac/Linux

# API keys — always in .env, never hardcoded
OPENAI_API_KEY=sk-...
LANGCHAIN_API_KEY=ls-...

# Load in Python
from dotenv import load_dotenv
load_dotenv()
```

**Project Structure:**
```
my_rag_project/
├── .env              ← API keys
├── .gitignore        ← include .env here!
├── requirements.txt
├── data/             ← raw documents
├── vector_store/     ← ChromaDB data
└── src/              ← Python modules
```

---

### Phase 03 — Embeddings

```python
# Local (FREE) — use this in development
from langchain_community.embeddings import SentenceTransformerEmbeddings
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

# Ollama (FREE, local) — best for local production
from langchain_ollama import OllamaEmbeddings
embeddings = OllamaEmbeddings(model="nomic-embed-text")

# OpenAI (PAID, high quality)
from langchain_openai import OpenAIEmbeddings
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Generate a single vector
vector = embeddings.embed_query("What is machine learning?")
print(len(vector))  # 384 / 768 / 1536 depending on model

# Cosine similarity (how close are two vectors?)
from sklearn.metrics.pairwise import cosine_similarity
score = cosine_similarity([vec1], [vec2])[0][0]
# 1.0 = identical, 0.0 = unrelated, -1.0 = opposite
```

**Embedding Model Comparison:**

| Model | Dimensions | Cost | Best For |
|-------|-----------|------|---------|
| `all-MiniLM-L6-v2` | 384 | Free | Dev/Testing |
| `nomic-embed-text` | 768 | Free (Ollama) | Local Production |
| `text-embedding-3-small` | 1536 | ~$0.02/1M tokens | Cloud Production |
| `text-embedding-3-large` | 3072 | ~$0.13/1M tokens | Enterprise |

> ⚠️ **GOLDEN RULE:** Always use the **same** embedding model for both indexing AND querying!

---

### Phase 04 — Chunking

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

# The best general-purpose splitter
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,       # Max characters per chunk
    chunk_overlap=50,     # Shared chars between chunks (prevent cuts)
    separators=["\n\n", "\n", ". ", " ", ""],  # Try paragraph → sentence → word
    add_start_index=True  # Adds position metadata
)

chunks = splitter.split_documents(documents)

# Token-based (production-grade)
import tiktoken
tokenizer = tiktoken.encoding_for_model("gpt-4o")
count_tokens = lambda text: len(tokenizer.encode(text))

splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,             # Now measured in TOKENS
    length_function=count_tokens
)

# Markdown-aware splitting
from langchain_text_splitters import MarkdownHeaderTextSplitter
splitter = MarkdownHeaderTextSplitter(headers_to_split_on=[
    ("#", "h1"), ("##", "h2"), ("###", "h3")
])
```

**Chunk Size Guide:**

| Document Type | Chunk Size | Overlap |
|---------------|-----------|---------|
| FAQ / Short answers | 200-300 chars | 20-30 |
| Product manuals | 400-600 chars | 50-75 |
| Legal contracts | 600-800 chars | 75-100 |
| Research papers | 500-700 chars | 50-75 |
| Code documentation | 400-600 chars | 50 |

> 💡 Answers too vague? → Decrease chunk size. Missing context? → Increase chunk size.

---

### Phase 05 — Vector Databases

```python
# ── ChromaDB (Best for beginners) ───────────────────────────
from langchain_community.vectorstores import Chroma

# Build (first time)
vector_store = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"  # Saves to disk
)

# Load (subsequent times — much faster!)
vector_store = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

# Search
results = vector_store.similarity_search(query, k=4)
results_with_scores = vector_store.similarity_search_with_score(query, k=4)

# Filter by metadata
results = vector_store.similarity_search(query, k=4,
    filter={"category": "refunds", "year": 2024})

# ── FAISS (Best for speed) ───────────────────────────────────
from langchain_community.vectorstores import FAISS
vector_store = FAISS.from_documents(chunks, embeddings)
vector_store.save_local("./faiss_index")
vector_store = FAISS.load_local("./faiss_index", embeddings,
                                allow_dangerous_deserialization=True)
```

**Vector DB Comparison:**

| Database | Best For | Cost | Scale |
|----------|---------|------|-------|
| ChromaDB | Learning, small apps | Free | < 1M vectors |
| FAISS | Speed, batch processing | Free | Billions |
| Pinecone | Production SaaS | Paid | Unlimited |
| Weaviate | Hybrid search, enterprise | Free/Paid | Large |

---

### Phase 06 — First RAG System (The Core Pattern)

```python
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain.prompts import PromptTemplate

# 1. Setup
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma(persist_directory="./db", embedding_function=embeddings)
llm = OllamaLLM(model="llama3.2", temperature=0)

# 2. Anti-hallucination prompt (use this template ALWAYS)
prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""Use ONLY the context below. If the answer isn't there, say so.

Context:
{context}

Question: {question}
Answer:"""
)

# 3. The RAG function
def ask(question: str) -> str:
    docs = vector_store.similarity_search(question, k=4)
    context = "\n\n".join([d.page_content for d in docs])
    return llm.invoke(prompt.format(context=context, question=question))
```

---

### Phase 07 — Retrieval Systems

```python
# ── Hybrid Search (Dense + BM25) — Production Standard ──────
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

bm25 = BM25Retriever.from_documents(documents); bm25.k = 3
dense = vector_store.as_retriever(search_kwargs={"k": 3})

hybrid = EnsembleRetriever(
    retrievers=[bm25, dense],
    weights=[0.4, 0.6]  # Favor semantic search slightly
)

# ── Multi-Query (Handles vague questions) ────────────────────
from langchain.retrievers.multi_query import MultiQueryRetriever
retriever = MultiQueryRetriever.from_llm(
    retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
    llm=llm
)

# ── Re-Ranking (Cross-Encoder) ───────────────────────────────
from sentence_transformers import CrossEncoder
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
pairs = [[query, doc] for doc in candidate_docs]
scores = cross_encoder.predict(pairs)

# ── Contextual Compression (Remove noise) ───────────────────
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
compressor = LLMChainExtractor.from_llm(llm)
retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=base_retriever
)
```

**When to Use Which:**

| Situation | Use |
|-----------|-----|
| General Q&A | Dense (similarity search) |
| Technical terms, codes, acronyms | BM25 or Hybrid |
| Vague / ambiguous questions | Multi-Query |
| Noisy retrieved chunks | Contextual Compression |
| Quality over speed | Hybrid + Cross-Encoder re-rank |

---

### Phase 08 — Pipeline Architecture

```
MODULAR STRUCTURE (One job per file):
config.py       ← All settings (chunk_size, model names, paths)
loader.py       ← Load PDFs, TXTs, URLs, directories
chunker.py      ← Split documents into chunks
vector_store.py ← Build, save, load ChromaDB
retriever.py    ← Search logic
pipeline.py     ← Orchestrate: ingest() + query()
main.py         ← Entry point
```

```python
# config.py pattern (use this!)
from dataclasses import dataclass

@dataclass
class RAGConfig:
    embedding_model: str = "all-MiniLM-L6-v2"
    chunk_size: int = 500
    chunk_overlap: int = 50
    vector_db_path: str = "./vector_store"
    llm_model: str = "llama3.2"
    llm_temperature: float = 0.0
    retrieval_k: int = 4

config = RAGConfig()
```

---

### Phase 09 — Advanced RAG Techniques

```python
# ── Parent-Child Retrieval ────────────────────────────────────
# Search small chunks, return big parent chunks to LLM
from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore

retriever = ParentDocumentRetriever(
    vectorstore=child_vectorstore,   # Small chunks (searched)
    docstore=InMemoryStore(),        # Big parent chunks (returned)
    child_splitter=RecursiveCharacterTextSplitter(chunk_size=150),
    parent_splitter=RecursiveCharacterTextSplitter(chunk_size=1000),
)

# ── Self-Query Retriever ─────────────────────────────────────
# LLM converts natural language into metadata filters
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain.chains.query_constructor.base import AttributeInfo

retriever = SelfQueryRetriever.from_llm(
    llm=llm,
    vectorstore=vector_store,
    document_contents="company policy docs",
    metadata_field_info=[
        AttributeInfo(name="year", description="Publication year", type="integer"),
        AttributeInfo(name="plan", description="basic, pro, or enterprise", type="string"),
    ]
)
# "Enterprise refund policy from 2024" → filter: {year: 2024, plan: "enterprise"}
```

**Advanced Techniques Matrix:**

| Technique | Solves | Complexity |
|-----------|--------|-----------|
| Parent-Child | Need precise retrieval + full context | Medium |
| Self-Query | Natural language metadata filtering | Medium |
| Adaptive RAG | Route to right strategy per question | High |
| Multi-Hop | Questions requiring multiple retrieval steps | High |
| Graph RAG | Entity relationship questions | Very High |

---

### Phase 10 — LangChain LCEL

```python
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

def format_docs(docs):
    return "\n\n".join([d.page_content for d in docs])

# LCEL pipe syntax — the modern way
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt    # Fill template with context + question
    | llm       # Generate answer
    | StrOutputParser()  # Convert to string
)

answer = rag_chain.invoke("What is the refund policy?")

# Conversational RAG with memory
from langchain_core.messages import HumanMessage, AIMessage
chat_history = []

def chat(question: str) -> str:
    answer = qa_chain.invoke({"input": question, "chat_history": chat_history})
    chat_history.append(HumanMessage(content=question))
    chat_history.append(AIMessage(content=answer))
    return answer
```

**Key LCEL Components:**

| Component | Purpose |
|-----------|---------|
| `RunnablePassthrough()` | Pass input unchanged to next step |
| `retriever \| format_docs` | Retrieve docs then join into string |
| `StrOutputParser()` | Convert LLM output to plain string |
| `MessagesPlaceholder("chat_history")` | Insert message list into prompt |

---

### Phase 11 — LangGraph RAG

```python
from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain_core.documents import Document

# 1. Define State (what flows through the graph)
class RAGState(TypedDict):
    question: str
    documents: List[Document]
    generation: str

# 2. Define Nodes (functions that transform state)
def retrieve(state): return {"documents": retriever.invoke(state["question"])}
def generate(state): return {"generation": llm.invoke(build_prompt(state))}

# 3. Build Graph
workflow = StateGraph(RAGState)
workflow.add_node("retrieve", retrieve)
workflow.add_node("generate", generate)
workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "generate")
workflow.add_edge("generate", END)
app = workflow.compile()

# 4. Run
result = app.invoke({"question": "What is the refund policy?"})

# CONDITIONAL EDGES (for CRAG, Self-RAG, routing)
workflow.add_conditional_edges(
    "grade",               # Source node
    decide_function,       # Returns a string key
    {"generate": "gen_node", "web_search": "web_node"}  # Routes
)
```

---

### Phase 12 — Multi-Modal RAG

```python
# OCR for scanned PDFs
import pytesseract
from pdf2image import convert_from_path
pages = convert_from_path("scan.pdf", dpi=300)  # Always 300 DPI minimum
text = pytesseract.image_to_string(pages[0], config="--psm 6")

# Table extraction
import camelot
tables = camelot.read_pdf("report.pdf", pages="all", flavor="lattice")
markdown = tables[0].df.to_markdown(index=False)

# Vision LLM (image → text description)
import ollama
response = ollama.chat(model="llava",
    messages=[{"role": "user", "content": "Describe this chart", "images": [img_bytes]}])
description = response["message"]["content"]

# Always tag content type in metadata!
Document(page_content=text, metadata={"content_type": "text"})    # text
Document(page_content=table, metadata={"content_type": "table"})  # table
Document(page_content=desc, metadata={"content_type": "image"})   # image
```

---

### Phase 13 — Production

```python
# FastAPI RAG Service skeleton
from fastapi import FastAPI
from pydantic import BaseModel, validator

class QueryRequest(BaseModel):
    question: str

    @validator("question")
    def validate(cls, v):
        if len(v) < 3: raise ValueError("Too short")
        if len(v) > 500: raise ValueError("Too long")
        return v.strip()

app = FastAPI()

@app.on_event("startup")
async def startup():
    global vector_store, llm
    vector_store = Chroma(...)  # Load once at startup, not per request!
    llm = OllamaLLM(...)

@app.post("/query")
async def query(req: QueryRequest):
    docs = vector_store.similarity_search(req.question, k=4)
    answer = llm.invoke(build_prompt(docs, req.question))
    return {"answer": answer, "sources": [...]}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Run: uvicorn api:app --reload --port 8000
```

```python
# Redis caching
from langchain_community.cache import RedisCache
from langchain.globals import set_llm_cache
import redis
set_llm_cache(RedisCache(redis_=redis.Redis(host="localhost", port=6379)))
# All LLM responses are now automatically cached!
```

**LangSmith Monitoring (2 env vars is all you need):**
```bash
LANGCHAIN_API_KEY=ls__your_key
LANGCHAIN_TRACING_V2=true
# Done! All LangChain calls now traced automatically.
```

---

### Phase 14 — Industry Projects (Cheat Sheet)

```
Project 1 — PDF Chatbot:     PyPDFLoader → Chunk → Chroma → Streamlit
Project 2 — Company KB:      DirectoryLoader → Chroma → FastAPI
Project 3 — Research Assist: FAISS + MultiQueryRetriever + analysis prompt
Project 6 — Support Bot:     LangGraph + classify → retrieve → respond → escalate
Project 8 — Resume Search:   Chroma + similarity_search_with_score + LLM rating
Project 10 — Multi-Agent:    LangGraph planner → researcher → synthesizer → QA checker
```

---

### Phase 15 — Evaluation

```python
# RAGAS evaluation
from ragas import evaluate
from ragas.metrics import answer_relevancy, faithfulness, context_recall, context_precision
from datasets import Dataset

dataset = Dataset.from_dict({
    "question": ["What is the refund policy?"],
    "answer": ["Refunds within 30 days."],       # AI answer
    "contexts": [["Our policy: 30-day returns"]], # Retrieved chunks
    "ground_truth": ["Returns within 30 days."]   # Correct answer
})

results = evaluate(dataset, metrics=[answer_relevancy, faithfulness,
                                      context_recall, context_precision])
```

**Target RAGAS Scores:**

| Metric | Target | If Below → Fix |
|--------|--------|---------------|
| Faithfulness | > 0.90 | Tighten prompt, use temperature=0 |
| Answer Relevancy | > 0.85 | Improve retrieval or prompt |
| Context Recall | > 0.80 | Increase top-K, use multi-query |
| Context Precision | > 0.75 | Add re-ranker, use metadata filter |

---

## 🔑 The Most Important Rules

```
1. SAME EMBEDDING MODEL for indexing AND querying. Never mix.
2. LOAD vector store from disk — never rebuild on every startup.
3. ALWAYS instruct LLM: "ONLY use the context. If not there, say so."
4. USE temperature=0 for factual Q&A.
5. ADD metadata (source, page, date, category) to every chunk.
6. CACHE with Redis to avoid paying for repeated API calls.
7. EVALUATE with RAGAS before going to production.
8. NEVER hardcode API keys — use .env + python-dotenv.
```

---

## ⚡ Full RAG in 15 Lines

```python
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM

# Index
loader = PyPDFLoader("your_doc.pdf")
chunks = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50).split_documents(loader.load())
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
db = Chroma.from_documents(chunks, embeddings, persist_directory="./db")

# Query
llm = OllamaLLM(model="llama3.2", temperature=0)

def ask(q):
    ctx = "\n\n".join([d.page_content for d in db.similarity_search(q, k=4)])
    return llm.invoke(f"Use ONLY this context:\n{ctx}\n\nQuestion: {q}\nAnswer:")

print(ask("What does the document say about refunds?"))
```

---

## 🛠️ Debugging Cheat Sheet

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| AI makes up answers | Prompt too loose | Add "ONLY use context. Say if not found." |
| Wrong chunks retrieved | Wrong embedding model | Use same model as indexing time |
| AI says "no info" but doc exists | top-K too low | Increase k from 4 to 7 |
| Answers too vague | Chunks too large | Decrease chunk_size |
| Answers miss context | Chunks too small | Increase chunk_size or overlap |
| Slow responses | No caching | Add Redis cache |
| Tables not found | Table not extracted | Use camelot or unstructured |
| High hallucination | Temperature too high | Set temperature=0 |
| LLM connection error | Ollama not running | Run `ollama serve` |

---

## 🚀 Production Checklist

```
Pre-Launch:
[ ] Input validation (length, injection patterns)
[ ] Output sanitization (no PII)
[ ] Rate limiting (slowapi)
[ ] Authentication (API keys or JWT)
[ ] /health endpoint
[ ] Structured JSON logging
[ ] Redis caching
[ ] RAGAS score > 0.80 on test suite
[ ] Docker + docker-compose
[ ] .env in .gitignore
[ ] LangSmith tracing enabled
[ ] Load tested at 100+ concurrent users
```

---

## 📊 Model Selection Guide

```
FREE + LOCAL:
  Embeddings: nomic-embed-text (768d) via Ollama
  LLM:        llama3.2 (good quality, fast)
  LLM:        qwen2.5-coder:3b (best for code questions)

PAID + CLOUD:
  Embeddings: text-embedding-3-small (1536d) — cheap, high quality
  LLM:        gpt-4o-mini (cost-efficient)
  LLM:        gpt-4o (highest quality)
  LLM:        claude-3-5-sonnet (great reasoning)
```

---

*RAG Mastery Course — All 15 Phases | Keep this file open while you build!*
