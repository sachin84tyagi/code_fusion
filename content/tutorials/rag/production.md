# Phase 13 — Production-Level RAG: Scaling, Monitoring & Optimization

> **Level:** Expert | **Goal:** Deploy RAG systems the way Fortune 500 companies do it

---

## 1. The Gap Between Prototype and Production

Your Phase 06 RAG chatbot works great on your laptop. But production means:

```
Your Laptop RAG:
- 1 user at a time
- 10 documents
- No monitoring
- Crashes = you restart it

Production RAG:
- 10,000 concurrent users
- Millions of documents
- Real-time monitoring & alerts
- 99.9% uptime SLA
- Security (no data leaks)
- Cost tracking (API bills)
- Latency < 2 seconds
```

This phase bridges that gap.

---

## 2. Production Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION RAG SYSTEM                        │
│                                                                 │
│  [Load Balancer]                                                │
│       ↓                                                         │
│  [API Gateway] — Rate limiting, Auth, Logging                  │
│       ↓                                                         │
│  [FastAPI Service] — Your RAG application                      │
│       ↓                                                         │
│  [Cache Layer] — Redis (avoid repeating expensive queries)     │
│       ↓                                                         │
│  [Retrieval Service]     [LLM Service]                         │
│       ↓                        ↓                               │
│  [Vector DB]            [OpenAI/Ollama]                        │
│  (Pinecone/Weaviate)                                           │
│                                                                 │
│  [Monitoring] — LangSmith, Prometheus, Grafana                 │
│  [Logging] — Structured logs to CloudWatch/Datadog             │
│  [Evaluation] — RAGAS score tracking                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Building a FastAPI RAG Service

FastAPI is the industry standard for building Python AI APIs.

```python
# api.py
# Production-ready RAG API with FastAPI
# pip install fastapi uvicorn pydantic

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, validator
from typing import Optional, List
import time
import logging
import uuid

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain.prompts import PromptTemplate

# ============================================================
# LOGGING SETUP
# ============================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# ============================================================
# REQUEST / RESPONSE MODELS (Pydantic validation)
# ============================================================
class QueryRequest(BaseModel):
    question: str
    top_k: Optional[int] = 4
    session_id: Optional[str] = None
    
    @validator("question")
    def validate_question(cls, v):
        if len(v.strip()) < 3:
            raise ValueError("Question must be at least 3 characters")
        if len(v) > 500:
            raise ValueError("Question must be under 500 characters")
        # Security: reject obvious prompt injection attempts
        dangerous_patterns = ["ignore previous", "system prompt", "jailbreak"]
        for pattern in dangerous_patterns:
            if pattern.lower() in v.lower():
                raise ValueError("Invalid question content")
        return v.strip()

class QueryResponse(BaseModel):
    request_id: str
    answer: str
    sources: List[str]
    chunks_used: int
    latency_ms: float

class HealthResponse(BaseModel):
    status: str
    vector_db_status: str
    llm_status: str

# ============================================================
# INITIALIZE COMPONENTS (at startup, not per request)
# ============================================================
app = FastAPI(
    title="RAG Knowledge API",
    description="Production RAG API for enterprise knowledge retrieval",
    version="1.0.0"
)

# Initialize once at startup (expensive operations)
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = None
llm = None

@app.on_event("startup")
async def startup_event():
    """Initialize all components when the API starts."""
    global vector_store, llm
    
    logger.info("Starting RAG API...")
    
    try:
        vector_store = Chroma(
            persist_directory="./vector_store",
            embedding_function=embeddings
        )
        logger.info("Vector store loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load vector store: {e}")
    
    try:
        llm = OllamaLLM(model="llama3.2", temperature=0)
        logger.info("LLM connected successfully")
    except Exception as e:
        logger.error(f"Failed to connect to LLM: {e}")

# ============================================================
# API ENDPOINTS
# ============================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check if all services are running."""
    return HealthResponse(
        status="healthy",
        vector_db_status="connected" if vector_store else "error",
        llm_status="connected" if llm else "error"
    )

@app.post("/query", response_model=QueryResponse)
async def query_rag(request: QueryRequest, background_tasks: BackgroundTasks):
    """Main RAG query endpoint."""
    
    request_id = str(uuid.uuid4())[:8]
    start_time = time.time()
    
    logger.info(f"[{request_id}] Question: {request.question[:50]}...")
    
    if not vector_store or not llm:
        raise HTTPException(status_code=503, detail="Service not ready")
    
    try:
        # Retrieve
        docs = vector_store.similarity_search(
            request.question,
            k=request.top_k
        )
        
        if not docs:
            return QueryResponse(
                request_id=request_id,
                answer="I don't have enough information to answer this question.",
                sources=[],
                chunks_used=0,
                latency_ms=(time.time() - start_time) * 1000
            )
        
        # Build context
        context = "\n\n".join([doc.page_content for doc in docs])
        sources = list(set([
            doc.metadata.get("source", "unknown") for doc in docs
        ]))
        
        # Generate
        prompt = f"""Answer based ONLY on the context. Be concise and accurate.
Context: {context}
Question: {request.question}
Answer:"""
        
        answer = llm.invoke(prompt)
        latency = (time.time() - start_time) * 1000
        
        logger.info(f"[{request_id}] Answered in {latency:.0f}ms, {len(docs)} chunks used")
        
        # Log to monitoring in background (doesn't slow down response)
        background_tasks.add_task(
            log_query,
            request_id, request.question, answer, latency
        )
        
        return QueryResponse(
            request_id=request_id,
            answer=answer,
            sources=sources,
            chunks_used=len(docs),
            latency_ms=round(latency, 2)
        )
    
    except Exception as e:
        logger.error(f"[{request_id}] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def log_query(request_id: str, question: str, answer: str, latency: float):
    """Background task: log query for monitoring."""
    # In production: send to LangSmith, DataDog, CloudWatch, etc.
    logger.info(f"[AUDIT] {request_id} | latency={latency:.0f}ms")

# Run with: uvicorn api:app --reload --port 8000
```

---

## 4. Caching — The Performance Multiplier

```python
# caching_rag.py
# Redis caching for expensive RAG operations

import hashlib
import json
from typing import Optional
from langchain_community.cache import RedisCache
from langchain.globals import set_llm_cache
import redis

# ============================================================
# OPTION 1: Cache LLM responses (LangChain built-in)
# ============================================================
# pip install redis langchain-community

redis_client = redis.Redis(host="localhost", port=6379, db=0)
set_llm_cache(RedisCache(redis_=redis_client))
# Now ALL LLM calls are automatically cached!
# Same question → same answer → served from cache in <5ms

# ============================================================
# OPTION 2: Custom query-level caching
# ============================================================
class RAGCache:
    """Cache entire RAG responses to avoid reprocessing."""
    
    def __init__(self, redis_host="localhost", redis_port=6379, ttl_seconds=3600):
        self.redis = redis.Redis(host=redis_host, port=redis_port, db=1)
        self.ttl = ttl_seconds  # Cache expires after 1 hour
    
    def _make_key(self, question: str) -> str:
        """Create a unique cache key from the question."""
        return f"rag:query:{hashlib.md5(question.lower().strip().encode()).hexdigest()}"
    
    def get(self, question: str) -> Optional[dict]:
        """Try to get a cached answer."""
        key = self._make_key(question)
        cached = self.redis.get(key)
        if cached:
            return json.loads(cached)
        return None
    
    def set(self, question: str, result: dict):
        """Cache a result."""
        key = self._make_key(question)
        self.redis.setex(key, self.ttl, json.dumps(result))
    
    def invalidate(self, pattern: str = "rag:query:*"):
        """Clear all cached queries (after updating documents)."""
        keys = self.redis.keys(pattern)
        if keys:
            self.redis.delete(*keys)
            print(f"[Cache] Invalidated {len(keys)} cached queries")

# Usage
# cache = RAGCache()
# result = cache.get(question) or expensive_rag_operation(question)
# cache.set(question, result)
```

---

## 5. Monitoring with LangSmith

LangSmith is LangChain's observability platform. It traces every step of your RAG pipeline.

```python
# langsmith_setup.py

import os
from dotenv import load_dotenv

load_dotenv()

# Set these in your .env file:
# LANGCHAIN_API_KEY=ls__your_key_here
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_PROJECT=my-rag-system

# With these environment variables set, ALL LangChain operations
# are automatically traced in LangSmith — no other code needed!

# What LangSmith shows you:
# - Every retrieval: which chunks were found, similarity scores
# - Every LLM call: exact prompt, token count, cost, latency
# - Full chain trace: see every step and where time was spent
# - Failed queries: debug exactly where it went wrong
# - Usage analytics: which questions are asked most often
```

---

## 6. Evaluation with RAGAS

RAGAS is the standard framework for measuring RAG quality.

```python
# evaluation.py
# pip install ragas datasets

from ragas import evaluate
from ragas.metrics import (
    answer_relevancy,      # Is the answer relevant to the question?
    faithfulness,          # Is the answer faithful to the retrieved context?
    context_recall,        # Were the right chunks retrieved?
    context_precision,     # Were the retrieved chunks precise?
)
from datasets import Dataset

# Your test dataset: questions + expected answers + retrieved contexts + AI answers
test_data = {
    "question": [
        "What is the refund window?",
        "Is the product GDPR compliant?",
    ],
    "answer": [  # AI-generated answers
        "Refunds are accepted within 30 days of purchase.",
        "Yes, the product is GDPR compliant for EU users.",
    ],
    "contexts": [  # Retrieved chunks used to generate the answer
        [["Our refund policy: returns within 30 days with receipt."]],
        [["We are GDPR compliant. EU users can request data export at any time."]],
    ],
    "ground_truth": [  # The correct expected answers
        "Returns must be made within 30 days of purchase.",
        "The product is GDPR compliant.",
    ]
}

dataset = Dataset.from_dict(test_data)

# Run evaluation
results = evaluate(
    dataset,
    metrics=[
        answer_relevancy,
        faithfulness,
        context_recall,
        context_precision,
    ]
)

print("RAG Evaluation Results:")
print(f"  Answer Relevancy:  {results['answer_relevancy']:.3f}  (1.0 = perfect)")
print(f"  Faithfulness:      {results['faithfulness']:.3f}  (1.0 = no hallucinations)")
print(f"  Context Recall:    {results['context_recall']:.3f}  (1.0 = found all needed docs)")
print(f"  Context Precision: {results['context_precision']:.3f}  (1.0 = no noisy chunks)")

# Target scores for production:
# answer_relevancy > 0.85
# faithfulness > 0.90  ← Most important! Prevents hallucinations
# context_recall > 0.80
# context_precision > 0.75
```

---

## 7. Security Best Practices

```python
# security.py

# ============================================================
# 1. INPUT VALIDATION — Block prompt injection
# ============================================================
def sanitize_user_input(text: str) -> str:
    """Remove potentially dangerous content from user input."""
    
    # Remove null bytes
    text = text.replace("\x00", "")
    
    # Detect prompt injection attempts
    dangerous_phrases = [
        "ignore previous instructions",
        "system prompt",
        "you are now",
        "jailbreak",
        "DAN mode",
        "disregard all rules",
    ]
    
    for phrase in dangerous_phrases:
        if phrase.lower() in text.lower():
            raise ValueError(f"Invalid input detected")
    
    # Limit length
    if len(text) > 500:
        raise ValueError("Input too long")
    
    return text.strip()

# ============================================================
# 2. OUTPUT VALIDATION — Block sensitive data leaks
# ============================================================
import re

def sanitize_output(text: str) -> str:
    """Remove sensitive information from AI output."""
    
    # Remove credit card numbers
    text = re.sub(r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b', '[REDACTED]', text)
    
    # Remove SSN patterns
    text = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', '[REDACTED]', text)
    
    # Remove email addresses (if privacy required)
    # text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL REDACTED]', text)
    
    return text

# ============================================================
# 3. RATE LIMITING (Use slowapi in FastAPI)
# ============================================================
# from slowapi import Limiter
# from slowapi.util import get_remote_address
# limiter = Limiter(key_func=get_remote_address)
# @app.post("/query")
# @limiter.limit("20/minute")  # Max 20 requests per minute per IP
# async def query_rag(request: Request, ...):
```

---

## 8. Cost Optimization

```
Strategy                    Savings     Implementation
──────────────────────────────────────────────────────
Use local embedding models  60-80%      sentence-transformers vs OpenAI
Cache frequent queries      40-60%      Redis cache (see section 4)
Use smaller LLM for routing 50%         Route to big model only when needed
Compress retrieved context  20-30%      Contextual compression (Phase 07)
Batch embedding operations  30%         Embed in batches, not one by one

Estimated cost comparison:
- OpenAI text-embedding-3-small: $0.02 per 1M tokens
- Local nomic-embed-text (Ollama): $0.00
- GPT-4o per query (avg 2K tokens): $0.01
- Local llama3.2 per query: $0.00
```

---

## 9. Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the API port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s \
  CMD curl -f http://localhost:8000/health || exit 1

# Run the FastAPI server
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

```yaml
# docker-compose.yml
version: "3.8"
services:
  rag-api:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./vector_store:/app/vector_store  # Persist vector DB
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

---

## 10. Production RAG Checklist

```
Pre-Launch Checklist:
[ ] Input validation and sanitization
[ ] Output sanitization (no PII leaks)
[ ] Rate limiting on all endpoints
[ ] API authentication (JWT/API keys)
[ ] Health check endpoint
[ ] Structured logging (JSON format)
[ ] Error handling with proper HTTP codes
[ ] Redis caching for common queries
[ ] RAGAS evaluation score > 0.80
[ ] Load testing done (100+ concurrent users)
[ ] Docker containerized
[ ] .env file in .gitignore
[ ] Secret management (no hardcoded keys)
[ ] Monitoring alerts configured
[ ] Rollback plan documented
```

---

## 11. Mini Challenge

1. Run the FastAPI app: `uvicorn api:app --reload`
2. Open your browser to `http://localhost:8000/docs`
3. Try the `/health` endpoint
4. Try the `/query` endpoint with a question
5. Read the logs — can you see the structured output?

---

> **Up Next: Phase 14 — Real Industry Projects**
> Build 10 complete, production-grade RAG applications from scratch.
