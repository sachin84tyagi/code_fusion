# 🚀 Phase 13 — Production & Deployment
### "Taking Your AI Apps Live to the World"

> **Difficulty**: ⭐⭐⭐⭐ Advanced | **Time**: ~90 minutes | **Prerequisites**: All previous phases

---

## 🎯 What You'll Learn

- ✅ FastAPI integration (REST API for your AI)
- ✅ Streamlit web UI (chat interface in 50 lines)
- ✅ Docker containerization
- ✅ Cloud deployment (AWS/GCP/Railway)
- ✅ Environment management
- ✅ Production architecture patterns

---

## 📖 Lesson 13.1 — FastAPI + LangChain

### Why FastAPI?

FastAPI lets you expose your LangChain app as a REST API, so:
- Other apps can call your AI
- Mobile apps can use it
- Multiple frontends can share one AI backend
- You can scale it with multiple workers

### Complete FastAPI AI Server

```python
# ============================================================
# FILE: deployment/api/main.py
# PURPOSE: Production FastAPI server with LangChain
# Install: pip install fastapi uvicorn
# Run: uvicorn main:app --reload
# ============================================================

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import HumanMessage
from typing import Optional, AsyncIterator
from datetime import datetime
import asyncio
import uuid
import logging

# ---- Setup logging ----
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)
logger = logging.getLogger(__name__)

# ---- Initialize FastAPI app ----
app = FastAPI(
    title="LangChain AI API",
    description="Production AI API built with LangChain",
    version="1.0.0",
    docs_url="/docs"  # Swagger UI at /docs
)

# ---- CORS (allows browser apps to call this API) ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # In production: specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- LangChain Setup ----
llm = ChatOllama(model="llama3.2", temperature=0.7)
parser = StrOutputParser()

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful AI assistant. Be concise and friendly."),
    ("human", "{input}")
])

chain = prompt | llm | parser

# Session storage (use Redis in production!)
sessions = {}

def get_session_history(session_id: str) -> InMemoryChatMessageHistory:
    if session_id not in sessions:
        sessions[session_id] = InMemoryChatMessageHistory()
    return sessions[session_id]

chain_with_memory = RunnableWithMessageHistory(
    prompt | llm | parser,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history"
)

# ---- Request/Response Models ----
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User's message")
    session_id: Optional[str] = Field(None, description="Session ID for memory. Leave blank for new session.")
    stream: bool = Field(False, description="Stream the response")

class ChatResponse(BaseModel):
    response: str
    session_id: str
    processing_time_ms: int
    timestamp: str

class HealthResponse(BaseModel):
    status: str
    model: str
    sessions_active: int
    timestamp: str

# ---- API Routes ----

@app.get("/", tags=["Health"])
async def root():
    return {"message": "LangChain AI API is running! Visit /docs for documentation."}

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Check if the API is healthy."""
    return HealthResponse(
        status="healthy",
        model="llama3.2",
        sessions_active=len(sessions),
        timestamp=datetime.now().isoformat()
    )

@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest):
    """
    Send a message and get an AI response.
    
    - **message**: Your question or message
    - **session_id**: Optional. Use same ID to continue conversation
    - **stream**: Set True for streaming response
    """
    
    # Generate session ID if not provided
    session_id = request.session_id or str(uuid.uuid4())
    
    logger.info(f"Chat request | session={session_id} | msg_length={len(request.message)}")
    
    start_time = datetime.now()
    
    try:
        # Stream or regular response
        if request.stream:
            # For streaming, redirect to stream endpoint
            raise HTTPException(
                status_code=400, 
                detail="Use /chat/stream endpoint for streaming"
            )
        
        # Regular (non-streaming) response
        response = chain_with_memory.invoke(
            {"input": request.message},
            config={"configurable": {"session_id": session_id}}
        )
        
        elapsed_ms = int((datetime.now() - start_time).total_seconds() * 1000)
        
        logger.info(f"Chat response | session={session_id} | elapsed={elapsed_ms}ms")
        
        return ChatResponse(
            response=response,
            session_id=session_id,
            processing_time_ms=elapsed_ms,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Chat error | session={session_id} | error={str(e)}")
        raise HTTPException(status_code=500, detail=f"AI processing error: {str(e)}")

@app.post("/chat/stream", tags=["Chat"])
async def chat_stream(request: ChatRequest):
    """
    Stream an AI response in real-time (like ChatGPT).
    The response is streamed as Server-Sent Events (SSE).
    """
    session_id = request.session_id or str(uuid.uuid4())
    
    async def stream_generator() -> AsyncIterator[str]:
        try:
            async for chunk in chain_with_memory.astream(
                {"input": request.message},
                config={"configurable": {"session_id": session_id}}
            ):
                yield f"data: {chunk}\n\n"
            
            yield f"data: [DONE]\n\n"
            
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"
    
    return StreamingResponse(
        stream_generator(),
        media_type="text/event-stream",
        headers={
            "X-Session-ID": session_id,
            "Cache-Control": "no-cache"
        }
    )

@app.delete("/session/{session_id}", tags=["Session"])
async def clear_session(session_id: str):
    """Clear a conversation session (reset memory)."""
    if session_id in sessions:
        del sessions[session_id]
        return {"message": f"Session {session_id} cleared successfully"}
    raise HTTPException(status_code=404, detail="Session not found")

@app.get("/sessions", tags=["Session"])
async def list_sessions():
    """List all active sessions."""
    return {
        "active_sessions": len(sessions),
        "session_ids": list(sessions.keys())
    }

# ---- Run the server ----
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,          # Auto-reload on code changes
        log_level="info"
    )

# To run: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# API docs: http://localhost:8000/docs
```

---

## 📖 Lesson 13.2 — Streamlit Chat UI

```python
# ============================================================
# FILE: deployment/ui/app.py
# PURPOSE: Beautiful chat interface with Streamlit
# Install: pip install streamlit
# Run: streamlit run app.py
# ============================================================

import streamlit as st
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import HumanMessage, AIMessage
import time

# ---- Page Config ----
st.set_page_config(
    page_title="AI Assistant",
    page_icon="🤖",
    layout="centered",
    initial_sidebar_state="auto"
)

# ---- Custom CSS for beautiful chat UI ----
st.markdown("""
<style>
    .stApp { background-color: #0e1117; }
    .chat-message {
        padding: 1rem;
        border-radius: 12px;
        margin: 8px 0;
        display: flex;
        align-items: flex-start;
    }
    .user-message {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        margin-left: 20%;
    }
    .ai-message {
        background: #1e2330;
        color: #e0e0e0;
        margin-right: 20%;
        border: 1px solid #2d3446;
    }
    .stChatInput input { 
        background-color: #1e2330 !important;
        border-color: #4a4a6a !important;
        color: white !important;
    }
</style>
""", unsafe_allow_html=True)

# ---- Initialize LangChain ----
@st.cache_resource  # Cache the model (don't recreate on each run)
def get_chain():
    """Create and cache the LangChain chain."""
    llm = ChatOllama(model="llama3.2", temperature=0.7)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful, friendly AI assistant. Be concise and clear."),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}")
    ])
    
    chain = prompt | llm | StrOutputParser()
    return chain

# ---- Session State (Streamlit's memory) ----
if "messages" not in st.session_state:
    st.session_state.messages = []          # Chat history for display
    st.session_state.lc_history = InMemoryChatMessageHistory()  # LangChain history

# ---- Sidebar ----
with st.sidebar:
    st.title("⚙️ Settings")
    
    model_choice = st.selectbox(
        "AI Model",
        ["llama3.2", "gemma2:2b", "phi3:mini"],
        index=0
    )
    
    temperature = st.slider("Temperature", 0.0, 1.0, 0.7, 0.1)
    
    if st.button("🗑️ Clear Chat", type="secondary"):
        st.session_state.messages = []
        st.session_state.lc_history = InMemoryChatMessageHistory()
        st.rerun()
    
    st.divider()
    st.markdown("""
    **About This Chat:**
    - 🧠 Has conversation memory
    - ⚡ Powered by LangChain
    - 🔒 Runs locally (private)
    """)

# ---- Main Chat Interface ----
st.title("🤖 AI Assistant")
st.caption("Powered by LangChain + Ollama | Ask me anything!")

# Display chat history
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# Chat input
if prompt_text := st.chat_input("Type your message here..."):
    
    # Add user message to display
    st.session_state.messages.append({
        "role": "user",
        "content": prompt_text
    })
    
    with st.chat_message("user"):
        st.write(prompt_text)
    
    # Get AI response with streaming
    with st.chat_message("assistant"):
        chain = get_chain()
        
        def get_session_history(session_id: str):
            return st.session_state.lc_history
        
        chain_with_memory = RunnableWithMessageHistory(
            chain,
            get_session_history,
            input_messages_key="input",
            history_messages_key="history"
        )
        
        # Stream the response
        with st.spinner("Thinking..."):
            response_placeholder = st.empty()
            full_response = ""
            
            for chunk in chain_with_memory.stream(
                {"input": prompt_text},
                config={"configurable": {"session_id": "streamlit_session"}}
            ):
                full_response += chunk
                response_placeholder.write(full_response + "▌")
                time.sleep(0.01)  # Small delay for visual effect
            
            response_placeholder.write(full_response)
    
    # Save to display history
    st.session_state.messages.append({
        "role": "assistant",
        "content": full_response
    })

# To run: streamlit run app.py
```

---

## 📖 Lesson 13.3 — Dockerizing Your AI App

```dockerfile
# ============================================================
# FILE: deployment/Dockerfile
# PURPOSE: Containerize your LangChain app
# ============================================================

# Use official Python image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
    CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# ============================================================
# FILE: deployment/docker-compose.yml
# PURPOSE: Run your entire AI stack with one command
# ============================================================

version: '3.8'

services:
  # Your LangChain AI API
  ai-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - LANGCHAIN_API_KEY=${LANGCHAIN_API_KEY}
    volumes:
      - ./data:/app/data          # Persist data
      - ./vector_db:/app/vector_db # Persist vector database
    restart: unless-stopped
    depends_on:
      - ollama
  
  # Ollama (local AI models)
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama  # Persist downloaded models
    restart: unless-stopped
  
  # Streamlit UI (optional)
  ai-ui:
    build:
      context: .
      dockerfile: Dockerfile.streamlit
    ports:
      - "8501:8501"
    environment:
      - API_URL=http://ai-api:8000
    depends_on:
      - ai-api
    restart: unless-stopped

volumes:
  ollama_data:
```

```bash
# ============================================================
# FILE: deployment/commands.sh
# PURPOSE: Common Docker commands for your AI app
# ============================================================

# Build and start everything
docker-compose up -d

# Pull Ollama models after startup
docker-compose exec ollama ollama pull llama3.2

# View logs
docker-compose logs -f ai-api

# Stop everything
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Scale the API (3 instances for load balancing)
docker-compose up -d --scale ai-api=3
```

---

## 📖 Lesson 13.4 — Cloud Deployment

### Option 1: Railway (Easiest — Free Tier Available)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy from your project folder
cd your-ai-app
railway up

# Your app is live at: https://your-app.railway.app
```

### Option 2: AWS ECS (Production Scale)

```yaml
# ============================================================
# FILE: deployment/aws/task-definition.json
# PURPOSE: AWS ECS task definition for AI API
# ============================================================
# {
#   "family": "langchain-ai-api",
#   "networkMode": "awsvpc",
#   "requiresCompatibilities": ["FARGATE"],
#   "cpu": "1024",
#   "memory": "2048",
#   "containerDefinitions": [
#     {
#       "name": "ai-api",
#       "image": "your-ecr-repo/ai-api:latest",
#       "portMappings": [{"containerPort": 8000}],
#       "environment": [
#         {"name": "OPENAI_API_KEY", "value": "{{resolve:secretsmanager:prod/openai-key}}"}
#       ],
#       "logConfiguration": {
#         "logDriver": "awslogs",
#         "options": {
#           "awslogs-group": "/ecs/langchain-ai-api",
#           "awslogs-region": "us-east-1",
#           "awslogs-stream-prefix": "ecs"
#         }
#       }
#     }
#   ]
# }
```

### Option 3: Google Cloud Run (Serverless — Pay Per Request)

```bash
# Build and push to Google Container Registry
docker build -t gcr.io/YOUR_PROJECT/ai-api .
docker push gcr.io/YOUR_PROJECT/ai-api

# Deploy to Cloud Run
gcloud run deploy ai-api \
    --image gcr.io/YOUR_PROJECT/ai-api \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 1 \
    --concurrency 10 \
    --set-env-vars "OPENAI_API_KEY=your-key"

# Your app is live at: https://ai-api-xxxxx-uc.a.run.app
```

---

## 📖 Lesson 13.5 — Production Architecture

### Complete Production Architecture

```
                         ┌─────────────────────────────────┐
                         │         USERS                    │
                         │  (Browser, Mobile, API clients) │
                         └──────────────┬──────────────────┘
                                        │ HTTPS
                         ┌──────────────▼──────────────────┐
                         │      CLOUDFLARE / CDN            │
                         │  (DDoS protection, caching)      │
                         └──────────────┬──────────────────┘
                                        │
                         ┌──────────────▼──────────────────┐
                         │      LOAD BALANCER               │
                         │  (distributes traffic)           │
                         └──────┬───────┬────────┬─────────┘
                                │       │        │
              ┌─────────────────┘       │        └──────────────────┐
              │                         │                           │
    ┌─────────▼─────────┐   ┌──────────▼────────┐  ┌──────────────▼─────────┐
    │  AI-API Instance 1│   │ AI-API Instance 2  │  │ AI-API Instance 3      │
    │  (FastAPI)        │   │ (FastAPI)          │  │ (FastAPI)              │
    └─────────┬─────────┘   └──────────┬─────────┘  └──────────────┬─────────┘
              │                         │                            │
              └─────────────────────────┼────────────────────────────┘
                                        │
              ┌─────────────────────────┼────────────────────────────┐
              │                         │                            │
    ┌─────────▼─────────┐   ┌──────────▼────────┐  ┌──────────────▼─────────┐
    │  VECTOR DATABASE  │   │    REDIS CACHE     │  │   POSTGRESQL DB        │
    │  (ChromaDB/Pinecone│  │  (session memory)  │  │  (user data, logs)     │
    └───────────────────┘   └───────────────────┘  └────────────────────────┘
              │
    ┌─────────▼─────────┐
    │   LLM PROVIDERS   │
    │  OpenAI / Ollama  │
    │  Anthropic / etc  │
    └───────────────────┘
```

### requirements.txt (Production)

```
# Core LangChain
langchain==0.3.x
langchain-core==0.3.x
langchain-community==0.3.x
langchain-ollama==0.2.x
langchain-openai==0.2.x

# Vector DB
chromadb==0.5.x
faiss-cpu==1.8.x

# API Framework
fastapi==0.111.x
uvicorn[standard]==0.30.x
pydantic==2.7.x

# UI
streamlit==1.35.x

# Async & Performance
httpx==0.27.x
anyio==4.3.x

# Utilities
python-dotenv==1.0.x
tenacity==8.3.x  # For retries

# Observability
langsmith==0.1.x

# Document loading
pypdf==4.2.x
python-docx==1.1.x

# Deployment
gunicorn==22.0.x
```

---

## 📖 Lesson 13.6 — Monitoring and Logging

```python
# ============================================================
# FILE: deployment/monitoring/logger.py
# PURPOSE: Production logging setup
# ============================================================

import logging
import json
from datetime import datetime
from functools import wraps
import time

# Configure structured logging
def setup_logger(name: str, log_file: str = None) -> logging.Logger:
    """Setup a production-ready logger."""
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    
    # JSON formatter for structured logs (works with log aggregators)
    class JSONFormatter(logging.Formatter):
        def format(self, record):
            log_entry = {
                "timestamp": datetime.utcnow().isoformat(),
                "level": record.levelname,
                "message": record.getMessage(),
                "module": record.module,
                "function": record.funcName,
            }
            if hasattr(record, "extra"):
                log_entry.update(record.extra)
            return json.dumps(log_entry)
    
    console_handler.setFormatter(JSONFormatter())
    logger.addHandler(console_handler)
    
    # File handler (if specified)
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(JSONFormatter())
        logger.addHandler(file_handler)
    
    return logger

# Usage
logger = setup_logger("ai-api", "app.log")

# ---- Decorator for tracking AI calls ----
def track_ai_call(func):
    """Decorator to log and time AI function calls."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        logger.info(f"AI call started: {func.__name__}")
        
        try:
            result = func(*args, **kwargs)
            elapsed = time.time() - start
            logger.info(f"AI call completed: {func.__name__} | {elapsed:.2f}s")
            return result
        except Exception as e:
            elapsed = time.time() - start
            logger.error(f"AI call failed: {func.__name__} | {elapsed:.2f}s | {str(e)}")
            raise
    
    return wrapper

# Usage
@track_ai_call
def my_ai_function(prompt: str) -> str:
    # Your LangChain code here
    pass
```

---

## 🎯 Final Challenge

**Build and Deploy a Complete AI Application!**

Requirements:
1. Choose any project from Phase 11
2. Wrap it with a FastAPI backend
3. Build a Streamlit frontend
4. Dockerize everything
5. Deploy to Railway or similar
6. Share the URL

This becomes your **portfolio project** that proves you can build and ship real AI applications.

---

## ✅ Phase 13 Recap

| Component | Tool | Purpose |
|-----------|------|---------|
| REST API | FastAPI + Uvicorn | Serve AI over HTTP |
| Chat UI | Streamlit | Rapid web interface |
| Containerization | Docker | Portable deployment |
| Orchestration | Docker Compose | Multi-service apps |
| Cloud Deploy | Railway/GCP/AWS | Production hosting |
| Monitoring | LangSmith + logging | Observability |

---

## 🎓 COURSE COMPLETE! 

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎓 CONGRATULATIONS! YOU'VE COMPLETED THE ENTIRE        ║
║       LANGCHAIN MASTERY COURSE!                          ║
║                                                           ║
║   What you can now build:                                ║
║   ✅ Production AI chatbots with memory                  ║
║   ✅ RAG systems for any document set                    ║
║   ✅ Autonomous AI agents with tools                     ║
║   ✅ Multi-agent AI systems                              ║
║   ✅ LangGraph stateful workflows                        ║
║   ✅ FastAPI + Streamlit AI apps                         ║
║   ✅ Dockerized, cloud-deployed AI products              ║
║                                                           ║
║   You are now an AI Engineer.                            ║
║   Go build something amazing! 🚀                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 🗺️ Your Learning Path Forward

```
After this course:
├── Join LangChain Discord community
├── Follow LangChain GitHub for updates
├── Read LangChain docs: docs.langchain.com
├── Practice on real problems (the best way!)
├── Contribute to open source AI projects
├── Build your portfolio with Phase 11 projects
└── Share what you've built on LinkedIn/Twitter
```

---

*🚀 Phase 13 Complete! The course is done. Now go build real AI products!*
