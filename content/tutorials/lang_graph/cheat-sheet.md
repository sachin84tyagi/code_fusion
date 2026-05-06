# 🕸️ LangGraph Mastery — Quick Reference Cheat Sheet
> *Print this and keep it beside you while coding!*

---

## ⚡ Installation

```bash
pip install langgraph langchain-core langchain-community
pip install langchain-ollama langchain-openai
pip install langgraph-checkpoint-sqlite  # For persistent memory
pip install fastapi uvicorn streamlit python-dotenv
```

---

## 🏗️ Core Graph Pattern

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List
import operator

# 1. Define State
class MyState(TypedDict):
    messages: Annotated[List, operator.add]  # append
    status: str                              # overwrite

# 2. Define Nodes (functions)
def my_node(state: MyState) -> dict:
    return {"status": "done"}  # Return ONLY changed fields!

# 3. Build Graph
graph = StateGraph(MyState)
graph.add_node("my_node", my_node)
graph.set_entry_point("my_node")
graph.add_edge("my_node", END)

# 4. Compile & Run
app = graph.compile()
result = app.invoke({"messages": [], "status": "starting"})
```

---

## 🌿 Conditional Routing

```python
def route(state: MyState) -> str:
    if state["status"] == "done":
        return "end"
    return "continue"

graph.add_conditional_edges("node_a", route, {
    "continue": "node_b",
    "end": END
})
```

---

## 🤖 ReAct Agent Loop

```python
from langgraph.prebuilt import create_react_agent, ToolNode
from langchain_core.tools import tool

@tool
def my_tool(query: str) -> str:
    """Tool description for the AI."""
    return "result"

# One-liner prebuilt agent
agent = create_react_agent(llm, [my_tool])
result = agent.invoke({"messages": [HumanMessage(content="...")]})

# OR: Custom loop
llm_with_tools = llm.bind_tools(tools)
tool_node = ToolNode(tools)

graph.add_node("agent", agent_node)
graph.add_node("tools", tool_node)
graph.add_conditional_edges("agent", should_continue, {
    "tools": "tools", END: END
})
graph.add_edge("tools", "agent")  # THE LOOP
```

---

## 🧠 Memory & Persistence

```python
from langgraph.checkpoint.memory import MemorySaver

# Compile with memory
checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)

# Use thread_id for per-user memory
config = {"configurable": {"thread_id": "user_001"}}

result = app.invoke(state, config=config)      # Save state
result = app.invoke(new_state, config=config)  # Load + save

# Inspect state
app.get_state(config)                # Current state
app.get_state_history(config)        # All checkpoints
app.update_state(config, {"k": "v"}) # Inject state
```

---

## 🧑‍💼 Human-in-the-Loop

```python
# Pause BEFORE a node runs
app = graph.compile(
    checkpointer=MemorySaver(),
    interrupt_before=["risky_node"]
)

# Run until pause
result = app.invoke(state, config=config)

# Human reviews, then update state
app.update_state(config, {"approved": True})

# Resume from pause
final = app.invoke(None, config=config)  # None = continue
```

---

## 🤝 Supervisor Pattern

```python
class TeamState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    next_worker: str

def supervisor(state):
    # Decide who works next
    return {"next_worker": "researcher"}

def route_supervisor(state):
    next = state["next_worker"]
    return next if next != "DONE" else END

graph.add_conditional_edges("supervisor", route_supervisor, {
    "researcher": "researcher",
    "writer": "writer",
    END: END
})
graph.add_edge("researcher", "supervisor")  # Workers → back to supervisor
graph.add_edge("writer", "supervisor")
```

---

## 📚 Corrective RAG

```python
# Grade retrieved docs
def grade_docs(state):
    relevant = [d for d in state["docs"] if is_relevant(d, state["question"])]
    return {"relevant_docs": relevant, "web_search": len(relevant) == 0}

# Route: if no good docs → web search
graph.add_conditional_edges("grade_docs", 
    lambda s: "web_search" if s["web_search"] else "generate", {
    "web_search": "web_search", "generate": "generate"
})
```

---

## ⚡ Async

```python
# Single async call
result = await app.ainvoke(state, config=config)

# Concurrent workflows
results = await asyncio.gather(*[
    app.ainvoke(state, config=cfg) for state, cfg in items
])

# Stream events
async for event in app.astream_events(state, version="v2"):
    if event["event"] == "on_chat_model_stream":
        print(event["data"]["chunk"].content, end="")
```

---

## 🔍 Debugging

```python
# Stream execution steps
for event in app.stream(state, stream_mode="updates"):
    print(event)  # Shows what each node changed

# ASCII graph visualization
print(app.get_graph().draw_ascii())

# Mermaid diagram (paste at mermaid.live)
print(app.get_graph().draw_mermaid())

# State inspection
state = app.get_state(config)
print(state.values)   # Current state values
print(state.next)     # Upcoming nodes
```

---

## 🛡️ Safety Patterns

```python
# Step limit (prevent infinite loops)
def route(state):
    if state["steps"] >= 10:  # Hard limit
        return "end"
    if state["messages"][-1].tool_calls:
        return "tools"
    return "end"

# Error routing
def route_after_node(state):
    if state.get("error"):
        return "error_handler"
    return "success"
```

---

## 🐛 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `KeyError` in routing | Add default return value in routing fn |
| Infinite loop | Add step counter + max_steps check |
| State not saved | Compile with `checkpointer=MemorySaver()` |
| Memory lost on restart | Use `SqliteSaver` not `MemorySaver` |
| `NotImplementedError` | Make sure to call `graph.compile()` |
| Thread state mixing | Use unique `thread_id` per user |
| Node mutates state | Return new dict, never mutate `state` in-place |
| Missing edge | Every node needs at least one outgoing edge |

---

## 📁 Project Structure

```
my_langgraph_app/
├── .env                  # API keys
├── .gitignore            # Include .env, __pycache__
├── requirements.txt
├── main.py               # Entry point
├── graphs/
│   ├── main_graph.py     # Primary graph
│   └── subgraphs.py      # Reusable subgraphs
├── nodes/
│   ├── ai_nodes.py       # LLM-based nodes
│   └── tool_nodes.py     # Tool execution nodes
├── state/
│   └── schemas.py        # State TypedDicts
├── tools/
│   └── custom_tools.py   # @tool decorated functions
├── api/
│   └── main.py           # FastAPI server
└── ui/
    └── app.py            # Streamlit UI
```

---

## 🔑 State Reducer Rules

| Annotation | Behavior |
|-----------|---------|
| `Annotated[List, operator.add]` | Appends new items |
| `Annotated[dict, merge_dicts]` | Merges dicts |
| No annotation | Overwrites entirely |
| `Annotated[int, max]` | Keeps maximum |

---

*Keep this handy while building your LangGraph apps! 🚀*
