# 🚀 Phase 13 — Production & Deployment
### "Shipping Your LangGraph Apps to the Real World"

> **Difficulty**: ⭐⭐⭐⭐ Advanced | **Time**: ~90 minutes | **Prerequisites**: All Phases

---

## 🎯 What You'll Learn

- ✅ FastAPI + LangGraph (REST API)
- ✅ Streaming responses to frontend
- ✅ Streamlit chat UI
- ✅ Docker containerization
- ✅ Cloud deployment strategies
- ✅ Production architecture patterns
- ✅ Environment and secrets management

---

## 📖 Lesson 13.1 — FastAPI + LangGraph

### The Production API Pattern

```python
# ============================================================
# FILE: deployment/api/main.py
# PURPOSE: Production FastAPI server for LangGraph
# Install: pip install fastapi uvicorn
# Run: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# ============================================================

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from typing import TypedDict, Annotated, List, Optional, AsyncIterator
import operator, uuid, logging, time
from datetime import datetime
from contextlib import asynccontextmanager
from functools import lru_cache

# ---- Logging ----
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)

# ============================================================
# BUILD THE LANGGRAPH (done once at startup)
# ============================================================

class ChatState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]

llm = ChatOllama(model="llama3.2", temperature=0.7)
parser = StrOutputParser()

def chat_node(state: ChatState) -> dict:
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful AI assistant. Be concise and friendly."),
        *[(m.type, m.content) for m in state["messages"]]
    ])
    # Simple: just invoke with all messages
    response = llm.invoke(
        [SystemMessage(content="You are a helpful AI assistant.")] + list(state["messages"])
    )
    return {"messages": [response]}

graph = StateGraph(ChatState)
graph.add_node("chat", chat_node)
graph.set_entry_point("chat")
graph.add_edge("chat", END)

checkpointer = MemorySaver()
app_graph = graph.compile(checkpointer=checkpointer)

logger.info("✅ LangGraph compiled and ready")

# ============================================================
# FASTAPI APP
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown logic."""
    logger.info("🚀 Server starting...")
    yield  # App runs here
    logger.info("🛑 Server shutting down...")

app = FastAPI(
    title="LangGraph AI API",
    description="Production LangGraph-powered AI API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# REQUEST/RESPONSE MODELS
# ============================================================

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = Field(None, description="Leave empty for new session")

class ChatResponse(BaseModel):
    response: str
    session_id: str
    elapsed_ms: int

class StreamRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None

# ============================================================
# ROUTES
# ============================================================

@app.get("/", tags=["Health"])
async def root():
    return {"status": "running", "message": "LangGraph AI API is live!"}

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest):
    """Send a message and get a full response."""
    
    session_id = request.session_id or str(uuid.uuid4())
    logger.info(f"Chat request | session={session_id} | len={len(request.message)}")
    
    start = time.time()
    
    try:
        result = app_graph.invoke(
            {"messages": [HumanMessage(content=request.message)]},
            config={"configurable": {"thread_id": session_id}}
        )
        
        response_text = result["messages"][-1].content
        elapsed = int((time.time() - start) * 1000)
        
        logger.info(f"Chat done | session={session_id} | {elapsed}ms")
        
        return ChatResponse(
            response=response_text,
            session_id=session_id,
            elapsed_ms=elapsed
        )
    
    except Exception as e:
        logger.error(f"Chat error | session={session_id} | {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/stream", tags=["Chat"])
async def chat_stream(request: StreamRequest):
    """Stream a response token by token (like ChatGPT)."""
    
    session_id = request.session_id or str(uuid.uuid4())
    
    async def token_generator() -> AsyncIterator[str]:
        try:
            # Stream from LangGraph
            async for event in app_graph.astream_events(
                {"messages": [HumanMessage(content=request.message)]},
                config={"configurable": {"thread_id": session_id}},
                version="v2"
            ):
                if event["event"] == "on_chat_model_stream":
                    chunk = event["data"]["chunk"].content
                    if chunk:
                        yield f"data: {chunk}\n\n"
            
            yield f"data: [DONE]\n\n"
            yield f"data: [SESSION:{session_id}]\n\n"
        
        except Exception as e:
            yield f"data: [ERROR]{str(e)}\n\n"
    
    return StreamingResponse(
        token_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Session-ID": session_id
        }
    )

@app.delete("/session/{session_id}", tags=["Session"])
async def clear_session(session_id: str):
    """Clear a session's conversation history."""
    config = {"configurable": {"thread_id": session_id}}
    try:
        app_graph.update_state(config, {"messages": []})
        return {"message": f"Session {session_id} cleared"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Session not found: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

---

## 📖 Lesson 13.2 — Streamlit Chat Interface

```python
# ============================================================
# FILE: deployment/ui/streamlit_app.py
# PURPOSE: Beautiful Streamlit chat UI for LangGraph
# Install: pip install streamlit
# Run: streamlit run streamlit_app.py
# ============================================================

import streamlit as st
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List
import operator, time

# ---- Page Config ----
st.set_page_config(
    page_title="LangGraph AI Chat",
    page_icon="🕸️",
    layout="centered"
)

# ---- Custom CSS ----
st.markdown("""
<style>
    body { background-color: #0e1117; }
    .stChatMessage { border-radius: 12px; }
    .stChatInput textarea {
        background-color: #1e2330 !important;
        border-color: #4a4a6a !important;
    }
    .main-header {
        text-align: center;
        padding: 1rem;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 12px;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# ---- Header ----
st.markdown('<div class="main-header"><h2>🕸️ LangGraph AI Chat</h2><p>Stateful conversations powered by LangGraph</p></div>', unsafe_allow_html=True)

# ============================================================
# BUILD LANGGRAPH (cached — built once)
# ============================================================
@st.cache_resource
def build_graph():
    """Build and cache the LangGraph app."""
    
    class State(TypedDict):
        messages: Annotated[List[BaseMessage], operator.add]
    
    llm = ChatOllama(model="llama3.2", temperature=0.7)
    
    def chat_node(state: State) -> dict:
        response = llm.invoke(
            [SystemMessage(content="You are a helpful, friendly AI assistant.")] 
            + list(state["messages"])
        )
        return {"messages": [response]}
    
    g = StateGraph(State)
    g.add_node("chat", chat_node)
    g.set_entry_point("chat")
    g.add_edge("chat", END)
    
    return g.compile(checkpointer=MemorySaver())

graph_app = build_graph()

# ============================================================
# SESSION STATE
# ============================================================
if "messages" not in st.session_state:
    st.session_state.messages = []
    st.session_state.session_id = f"session_{int(time.time())}"

# ---- Sidebar ----
with st.sidebar:
    st.title("⚙️ Settings")
    
    st.metric("Messages", len(st.session_state.messages))
    st.caption(f"Session: {st.session_state.session_id[:20]}...")
    
    if st.button("🗑️ New Conversation", type="secondary", use_container_width=True):
        st.session_state.messages = []
        st.session_state.session_id = f"session_{int(time.time())}"
        st.rerun()
    
    st.divider()
    st.markdown("""
    **Features:**
    - 🧠 Full conversation memory
    - 🕸️ Powered by LangGraph
    - 💾 Per-session state
    - 🔒 Private & local
    """)

# ============================================================
# CHAT DISPLAY
# ============================================================
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# ============================================================
# CHAT INPUT
# ============================================================
if user_input := st.chat_input("Ask me anything..."):
    
    # Add user message to display
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.write(user_input)
    
    # Get AI response
    with st.chat_message("assistant"):
        response_placeholder = st.empty()
        full_response = ""
        
        # Stream the response
        with st.spinner(""):
            result = graph_app.invoke(
                {"messages": [HumanMessage(content=user_input)]},
                config={"configurable": {"thread_id": st.session_state.session_id}}
            )
            full_response = result["messages"][-1].content
        
        # Animate the response
        displayed = ""
        for char in full_response:
            displayed += char
            response_placeholder.write(displayed + "▌")
            time.sleep(0.008)
        response_placeholder.write(full_response)
    
    st.session_state.messages.append({"role": "assistant", "content": full_response})
```

---

## 📖 Lesson 13.3 — Docker Setup

```dockerfile
# ============================================================
# FILE: deployment/Dockerfile
# ============================================================

FROM python:3.11-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y \
    curl gcc && rm -rf /var/lib/apt/lists/*

# Install Python deps first (better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Create data directories
RUN mkdir -p /app/data /app/checkpoints

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

```yaml
# ============================================================
# FILE: deployment/docker-compose.yml
# ============================================================

version: '3.8'

services:
  # LangGraph API
  langgraph-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - LANGCHAIN_API_KEY=${LANGCHAIN_API_KEY}
      - LANGCHAIN_TRACING_V2=true
      - LANGCHAIN_PROJECT=production
    volumes:
      - ./data:/app/data
      - checkpoints:/app/checkpoints
    restart: unless-stopped
    depends_on:
      - ollama

  # Local AI (Ollama)
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_models:/root/.ollama
    restart: unless-stopped

  # Streamlit UI
  streamlit-ui:
    build:
      context: .
      dockerfile: Dockerfile.streamlit
    ports:
      - "8501:8501"
    environment:
      - API_URL=http://langgraph-api:8000
    depends_on:
      - langgraph-api
    restart: unless-stopped

volumes:
  checkpoints:
  ollama_models:
```

```bash
# ============================================================
# FILE: deployment/Dockerfile.streamlit
# ============================================================
# FROM python:3.11-slim
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install streamlit langchain-ollama langgraph
# COPY ui/ .
# EXPOSE 8501
# CMD ["streamlit", "run", "streamlit_app.py", "--server.port=8501", "--server.address=0.0.0.0"]

# Build and run everything:
# docker-compose up -d
# docker-compose exec ollama ollama pull llama3.2
# Open http://localhost:8501 for UI
# Open http://localhost:8000/docs for API docs
```

---

## 📖 Lesson 13.4 — Cloud Deployment

### Option A: Railway (Easiest)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway variables set OPENAI_API_KEY=your-key

# Deploy
railway up

# Your app is live! Railway provides the URL.
```

### Option B: Google Cloud Run

```bash
# Build and push Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT/langgraph-api

# Deploy to Cloud Run (serverless, pay per request)
gcloud run deploy langgraph-api \
    --image gcr.io/YOUR_PROJECT/langgraph-api \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars "OPENAI_API_KEY=your-key"
```

### Option C: AWS Lambda (Serverless)

```python
# handler.py - for AWS Lambda deployment via Mangum
from mangum import Mangum
from api.main import app  # Your FastAPI app

# Mangum wraps FastAPI for Lambda
handler = Mangum(app, lifespan="off")
```

---

## 📖 Lesson 13.5 — Production Architecture

```
                    PRODUCTION LANGGRAPH ARCHITECTURE
                    ────────────────────────────────

  Users (Browser/Mobile/API)
             │ HTTPS
             ▼
    ┌─────────────────┐
    │  Cloudflare CDN │  ← DDoS protection, global edge
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │  Load Balancer  │  ← Distributes traffic
    └──┬───┬───┬──────┘
       │   │   │
   ┌───▼─┐ ┌▼──┐ ┌▼──┐
   │API 1│ │ 2 │ │ 3 │  ← FastAPI + LangGraph instances
   └──┬──┘ └┬──┘ └┬──┘
      └──────┼─────┘
             │
    ┌────────┼────────────┐
    │        │            │
  ┌─▼──┐  ┌─▼────┐  ┌───▼──┐
  │ DB │  │Redis │  │Ollama│
  │Psql│  │Cache │  │ LLM  │
  └────┘  └──────┘  └──────┘
             │
    ┌────────▼────────┐
    │  LangSmith      │  ← Observability
    │  Monitoring     │
    └─────────────────┘
```

### `requirements.txt` for Production

```
# Core
langgraph>=0.2.0
langchain-core>=0.3.0
langchain-community>=0.3.0
langchain-ollama>=0.2.0
langchain-openai>=0.2.0

# Vector DB
chromadb>=0.5.0

# API
fastapi>=0.111.0
uvicorn[standard]>=0.30.0
pydantic>=2.7.0

# UI
streamlit>=1.35.0

# DB & Caching
langgraph-checkpoint-sqlite>=2.0.0

# Observability
langsmith>=0.1.0

# Utilities
python-dotenv>=1.0.0
tenacity>=8.3.0
httpx>=0.27.0

# Deploy
gunicorn>=22.0.0
mangum>=0.17.0  # For AWS Lambda
```

---

## 🎓 COURSE COMPLETE!

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎓 CONGRATULATIONS!                                    ║
║                                                           ║
║   You've completed the entire LangGraph Mastery Course!  ║
║                                                           ║
║   You can now build:                                      ║
║   ✅ Stateful AI workflows with full control             ║
║   ✅ Multi-agent AI teams with supervision               ║
║   ✅ Human-in-the-loop safety systems                    ║
║   ✅ Corrective RAG with quality validation              ║
║   ✅ Persistent AI with SQLite/Redis memory              ║
║   ✅ Production APIs with FastAPI + Docker               ║
║   ✅ Beautiful UIs with Streamlit                        ║
║   ✅ Cloud-deployed LangGraph applications               ║
║                                                           ║
║   You are now a LangGraph Engineer.                      ║
║   Go build something amazing! 🚀                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 🗺️ What To Do Next

```
1. ⭐ Build your flagship portfolio project from Phase 11
2. 📤 Deploy it live (Railway is the easiest)
3. 📝 Write a LinkedIn post about what you built
4. 🤝 Join the LangChain Discord: discord.gg/langchain
5. 📚 Read LangGraph docs: langchain-ai.github.io/langgraph
6. 🔄 Follow LangChain on GitHub for updates
7. 🚀 Start applying to AI engineer roles!
```

---

*🚀 Phase 13 Complete! The course is done. Now go build real AI systems!*
