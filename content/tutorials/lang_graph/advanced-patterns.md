# ⚡ Phase 12 — Advanced Patterns
### "Production-Grade LangGraph Techniques"

> **Difficulty**: ⭐⭐⭐⭐⭐ Expert | **Time**: ~90 minutes | **Prerequisites**: Phase 11

---

## 🎯 What You'll Learn

- ✅ Async LangGraph (concurrent execution)
- ✅ Streaming events and tokens
- ✅ LangSmith observability
- ✅ Callbacks and custom event handlers
- ✅ Graph visualization and debugging
- ✅ Performance optimization

---

## 📖 Lesson 12.1 — Async LangGraph

```python
# ============================================================
# FILE: 09_advanced/async_graph.py
# PURPOSE: Run LangGraph workflows asynchronously
# ============================================================

import asyncio
from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from typing import TypedDict, Annotated, List, Optional
import operator, time

llm = ChatOllama(model="llama3.2", temperature=0.3)
parser = StrOutputParser()

class AsyncState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    query: str
    result: Optional[str]

async def async_process_node(state: AsyncState) -> dict:
    """Async node — uses ainvoke instead of invoke."""
    result = await (
        ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant. Be concise."),
            ("human", "{query}")
        ]) | llm | parser
    ).ainvoke({"query": state["query"]})
    
    return {"result": result, "messages": [AIMessage(content=result)]}

# ---- Build async graph ----
graph = StateGraph(AsyncState)
graph.add_node("process", async_process_node)
graph.set_entry_point("process")
graph.add_edge("process", END)
app = graph.compile()

# ---- Method 1: Single async invocation ----
async def single_async_call():
    result = await app.ainvoke({
        "messages": [HumanMessage(content="What is Python?")],
        "query": "What is Python in one sentence?",
        "result": None
    })
    return result["result"]

# ---- Method 2: Run many workflows concurrently ----
async def concurrent_workflows():
    """Process 5 queries simultaneously!"""
    
    queries = [
        "What is Python?",
        "What is Docker?",
        "What is LangChain?",
        "What is FastAPI?",
        "What is LangGraph?",
    ]
    
    # Create tasks for all queries
    tasks = [
        app.ainvoke({
            "messages": [HumanMessage(content=q)],
            "query": q,
            "result": None
        })
        for q in queries
    ]
    
    # Run ALL simultaneously
    start = time.time()
    results = await asyncio.gather(*tasks)
    elapsed = time.time() - start
    
    print(f"⚡ Processed {len(queries)} queries in {elapsed:.2f}s (parallel)")
    
    for q, r in zip(queries, results):
        print(f"\n❓ {q}")
        print(f"   {r['result'][:100]}")

# ---- Method 3: Async streaming ----
async def stream_tokens():
    """Stream tokens as they're generated."""
    print("\n🌊 Streaming response:")
    
    async for event in app.astream_events(
        {"messages": [HumanMessage(content="Explain AI agents")],
         "query": "Explain AI agents in 3 sentences",
         "result": None},
        version="v2"
    ):
        if event["event"] == "on_chat_model_stream":
            chunk = event["data"]["chunk"].content
            if chunk:
                print(chunk, end="", flush=True)
    
    print()  # Newline

async def main():
    print("🔄 Async LangGraph Demo\n")
    
    print("1️⃣  Single async call:")
    result = await single_async_call()
    print(f"   Result: {result[:100]}")
    
    print("\n2️⃣  Concurrent workflows:")
    await concurrent_workflows()
    
    print("\n3️⃣  Token streaming:")
    await stream_tokens()

asyncio.run(main())
```

---

## 📖 Lesson 12.2 — Event Streaming

```python
# ============================================================
# FILE: 09_advanced/event_streaming.py
# PURPOSE: Stream every event from graph execution
# ============================================================

import asyncio
from langgraph.prebuilt import create_react_agent
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage

llm = ChatOllama(model="llama3.2")

@tool
def search(query: str) -> str:
    """Search for information."""
    return f"Found information about: {query}"

@tool
def calculate(expression: str) -> str:
    """Calculate math."""
    try:
        return str(eval(expression, {"__builtins__": {}}, {}))
    except:
        return "Calculation error"

agent = create_react_agent(llm, [search, calculate])

async def stream_agent_events(question: str):
    """Stream ALL events from the agent, categorized."""
    
    print(f"❓ {question}\n")
    
    async for event in agent.astream_events(
        {"messages": [HumanMessage(content=question)]},
        version="v2"
    ):
        event_type = event.get("event", "")
        name = event.get("name", "")
        
        # Chat model starts generating
        if event_type == "on_chat_model_start":
            print(f"🤖 [LLM START] {name}")
        
        # Token-by-token streaming
        elif event_type == "on_chat_model_stream":
            chunk = event["data"]["chunk"].content
            if chunk:
                print(chunk, end="", flush=True)
        
        # LLM done
        elif event_type == "on_chat_model_end":
            print(f"\n✅ [LLM DONE]")
        
        # Tool starts
        elif event_type == "on_tool_start":
            tool_name = name
            tool_input = event["data"].get("input", {})
            print(f"🔧 [TOOL START] {tool_name}({tool_input})")
        
        # Tool returns result
        elif event_type == "on_tool_end":
            tool_output = event["data"].get("output", "")
            print(f"📥 [TOOL RESULT] {str(tool_output)[:100]}")
        
        # Graph node changes
        elif event_type in ("on_chain_start", "on_chain_end"):
            pass  # Skip for cleaner output

asyncio.run(stream_agent_events("Search for Python and calculate 25 * 48"))
```

---

## 📖 Lesson 12.3 — LangSmith Observability

```python
# ============================================================
# FILE: 09_advanced/langsmith_setup.py
# PURPOSE: Monitor LangGraph in production with LangSmith
# ============================================================

# 1. Sign up at https://smith.langchain.com (free tier available)
# 2. Create an API key in Settings
# 3. Add to .env:
#    LANGCHAIN_TRACING_V2=true
#    LANGCHAIN_API_KEY=ls-your-key
#    LANGCHAIN_PROJECT=my-langgraph-app

from dotenv import load_dotenv
load_dotenv()

# LangSmith traces AUTOMATICALLY once env vars are set!
# No code changes needed.

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List
import operator

llm = ChatOllama(model="llama3.2")

class State(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]

def my_node(state: State) -> dict:
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

graph = StateGraph(State)
graph.add_node("chat", my_node)
graph.set_entry_point("chat")
graph.add_edge("chat", END)
app = graph.compile()

# This call appears in LangSmith automatically!
result = app.invoke(
    {"messages": [HumanMessage(content="Hello, how are you?")]},
    config={"run_name": "greeting_test"}  # Optional: name this run
)

print("✅ Run traced in LangSmith!")
print("   Go to https://smith.langchain.com to see the trace")
print(f"   Response: {result['messages'][-1].content[:100]}")

# ---- Manual tracing with langsmith ----
from langsmith import traceable

@traceable(name="Custom Business Logic")
def process_with_ai(input_data: dict) -> str:
    """This function is traced end-to-end in LangSmith."""
    result = app.invoke({
        "messages": [HumanMessage(content=str(input_data))]
    })
    return result["messages"][-1].content

# Call it — shows as a named trace in LangSmith
response = process_with_ai({"user": "Ahmed", "query": "Summarize LangGraph"})
print(f"\n🔍 Traced function response: {response[:100]}")
```

---

## 📖 Lesson 12.4 — Graph Debugging

```python
# ============================================================
# FILE: 09_advanced/debugging.py
# PURPOSE: Debug and inspect LangGraph workflows
# ============================================================

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List
import operator, json

llm = ChatOllama(model="llama3.2")

class DebugState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    step: int

def node_a(state: DebugState) -> dict:
    return {"messages": [AIMessage(content="Response from A")], "step": 1}

def node_b(state: DebugState) -> dict:
    return {"messages": [AIMessage(content="Response from B")], "step": 2}

checkpointer = MemorySaver()
graph = StateGraph(DebugState)
graph.add_node("a", node_a)
graph.add_node("b", node_b)
graph.set_entry_point("a")
graph.add_edge("a", "b")
graph.add_edge("b", END)
app = graph.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "debug_session"}}

# Run the graph
app.invoke({"messages": [HumanMessage(content="Hello")], "step": 0}, config=config)

# ---- Debugging Tools ----

# 1. Get current state
state = app.get_state(config)
print("📊 Current State:")
print(f"   Step: {state.values.get('step')}")
print(f"   Messages: {len(state.values.get('messages', []))}")
print(f"   Next nodes: {state.next}")

# 2. Get full history
print("\n📜 State History:")
for i, snap in enumerate(app.get_state_history(config)):
    print(f"   Checkpoint {i+1}: step={snap.values.get('step', 0)}, "
          f"msgs={len(snap.values.get('messages', []))}, "
          f"id={str(snap.config.get('configurable', {}).get('checkpoint_id', 'N/A'))[:20]}")

# 3. Get graph structure
print("\n🗺️  Graph Structure:")
graph_data = app.get_graph()
print(f"   Nodes: {list(graph_data.nodes.keys())}")
print(f"   Edges: {[(e.source, e.target) for e in graph_data.edges]}")

# 4. Draw as ASCII
print("\n🖼️  ASCII Graph:")
try:
    print(app.get_graph().draw_ascii())
except:
    print("   (ASCII drawing requires graphviz)")

# 5. Export as Mermaid
print("\n📊 Mermaid Diagram (paste at mermaid.live):")
print(app.get_graph().draw_mermaid())

# ---- Step-by-step execution with debug ----
print("\n🐛 Step-by-step execution:")
for event in app.stream(
    {"messages": [HumanMessage(content="Test debug")], "step": 0},
    config={"configurable": {"thread_id": "debug_step"}},
    stream_mode="updates"  # Shows what each node changed
):
    node_name = list(event.keys())[0]
    changes = event[node_name]
    print(f"   Node '{node_name}' changed: {list(changes.keys())}")
```

---

## 📖 Lesson 12.5 — Performance Optimization

```python
# ============================================================
# FILE: 09_advanced/optimization.py
# PURPOSE: Make LangGraph fast in production
# ============================================================

# ============================================================
# OPTIMIZATION 1: Compile once, reuse many times
# ============================================================
from functools import lru_cache
from langgraph.graph import StateGraph, END

@lru_cache(maxsize=None)
def get_compiled_app():
    """
    Compile the graph ONCE and cache it.
    In FastAPI: call this at startup, not per-request!
    """
    # ... build your graph ...
    graph = StateGraph(...)
    return graph.compile(checkpointer=...)

# ✅ Gets cached instance (same object every call)
app = get_compiled_app()

# ============================================================
# OPTIMIZATION 2: Connection pooling for SQLite
# ============================================================
# Use a single connection, not a new one per request
from langchain_core.messages import BaseMessage

# In your FastAPI app:
# checkpointer = SqliteSaver.from_conn_string("memory.db")
# app = graph.compile(checkpointer=checkpointer)
# Store both as module-level globals, not per-request

# ============================================================
# OPTIMIZATION 3: Selective streaming
# ============================================================
import asyncio

async def efficient_stream(query: str):
    """Stream only the final AI response tokens."""
    async for event in app.astream_events(
        {"messages": [HumanMessage(content=query)]},
        version="v2",
        include_names=["chat"]  # Only stream events from "chat" node
    ):
        if (event["event"] == "on_chat_model_stream" 
            and event.get("name") == "chat"):
            chunk = event["data"]["chunk"].content
            if chunk:
                yield chunk  # Generator for FastAPI StreamingResponse

# ============================================================
# OPTIMIZATION 4: Batch processing
# ============================================================
async def batch_process(items: list, batch_size: int = 5):
    """Process items in controlled batches."""
    results = []
    
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        batch_results = await asyncio.gather(*[
            app.ainvoke({"messages": [HumanMessage(content=item)]})
            for item in batch
        ])
        results.extend(batch_results)
        await asyncio.sleep(0.1)  # Brief pause between batches
    
    return results

print("""
⚡ PERFORMANCE TIPS:
───────────────────────────────────────────────
✅ Compile graph once at startup (not per-request)
✅ Use async/await for I/O-bound operations
✅ Batch process with asyncio.gather()
✅ Cache embedding models (expensive to create)
✅ Persist vector stores to disk (avoid re-indexing)
✅ Use selective streaming (only the nodes you need)
✅ Profile with LangSmith (find bottlenecks)
✅ Use Redis for checkpointing in multi-server setups
✅ Set max_steps to prevent runaway agent loops
✅ Use connection pooling for databases
""")
```

---

## 🎯 Mini Challenges

**Challenge 1**: Convert a synchronous LangGraph from Phase 5 to async. Process 5 different queries concurrently and measure the speed improvement.

**Challenge 2**: Add LangSmith tracing to one of your Phase 11 projects. Analyze the traces and find the slowest node.

**Challenge 3**: Build a "Debug Dashboard" — a Streamlit app that shows the current state, history, and graph visualization for a running LangGraph workflow.

---

## ✅ Phase 12 Recap

| Technique | Benefit |
|-----------|---------|
| `ainvoke` / `astream` | Async execution |
| `asyncio.gather` | Concurrent workflows |
| `astream_events` | Token-level streaming |
| LangSmith | Full observability |
| `@traceable` | Custom function tracing |
| `get_state` | Inspect checkpoint |
| `get_state_history` | See all checkpoints |
| `draw_mermaid` | Visualize graph |
| Compile once | Better performance |
| Batch processing | Controlled throughput |

---

## 🚀 What's Next?

**Phase 13** — Production & Deployment: ship your LangGraph apps to the world with FastAPI, Streamlit, Docker, and cloud platforms!

> **Go to**: `Phase13_Production/lesson.md` →

---

*Phase 12 Complete! ⚡ You write expert-level LangGraph code. Final phase ahead!*
