# 🧱 Phase 3 — State, Nodes & Edges
### "The Three Building Blocks of Every LangGraph"

> **Difficulty**: ⭐⭐ Beginner-Intermediate | **Time**: ~75 minutes | **Prerequisites**: Phase 2 Complete

---

## 🎯 What You'll Learn

- ✅ State in-depth: TypedDict, reducers, Annotated
- ✅ Nodes: how they work, best practices, error handling
- ✅ Edges: regular edges, conditional edges
- ✅ The `END` constant and how to finish workflows
- ✅ Multiple state fields and complex state design

---

## 📖 Lesson 3.1 — STATE: The Shared Memory

### What Is State?

State is the **shared notepad** that every node in your graph can read from and write to.

```
Think of it like a whiteboard in a meeting room:
- Anyone can read what's on it
- Anyone can add or update content
- It persists across the whole meeting (workflow)
```

### Defining State with TypedDict

```python
# ============================================================
# FILE: 01_basics/state_deep_dive.py
# PURPOSE: Understanding all the ways to define state
# ============================================================

from typing import TypedDict, Annotated, List, Optional
from langchain_core.messages import BaseMessage
import operator

# ---- BASIC STATE ----
class BasicState(TypedDict):
    name: str          # Simple string field
    age: int           # Simple integer field
    is_done: bool      # Boolean flag

# ---- STATE WITH MESSAGES ----
class ChatState(TypedDict):
    # Annotated[List[BaseMessage], operator.add]
    # → List of messages, new ones get APPENDED (not replaced)
    messages: Annotated[List[BaseMessage], operator.add]

# ---- COMPLEX STATE (real-world example) ----
class AgentState(TypedDict):
    # Messages: always use operator.add (append new messages)
    messages: Annotated[List[BaseMessage], operator.add]
    
    # Regular fields: these get OVERWRITTEN each time a node updates them
    task: str                    # What we're working on
    current_step: str            # Which step we're on
    attempts: int                # How many times we've tried
    result: Optional[str]        # Final result (None until done)
    error: Optional[str]         # Any error that occurred
    approved: bool               # Was it human-approved?
    metadata: dict               # Extra data
```

### Understanding Reducers (The Most Important Part!)

A **reducer** is the function that decides HOW to merge new state with old state.

```python
# ============================================================
# Reducer Deep Dive
# ============================================================
import operator
from typing import Annotated, List

# ---- operator.add (APPEND) ----
# Use for: messages, lists of items that accumulate
messages: Annotated[List[str], operator.add]
# Old: ["hello"]     New returned: ["world"]
# Result: ["hello", "world"]  ← APPENDED

# ---- No annotation (OVERWRITE) ----
# Use for: status flags, current step, result values
status: str
# Old: "running"     New returned: "done"
# Result: "done"  ← OVERWRITTEN

# ---- Custom reducer ----
def keep_last_n(existing: list, new: list, n: int = 5) -> list:
    """Custom reducer: keep only last 5 items."""
    combined = existing + new
    return combined[-n:]

# Use it:
recent_logs: Annotated[List[str], keep_last_n]
```

### Reducer Visualization

```
With operator.add (APPEND):
─────────────────────────────────────────
BEFORE: state["messages"] = [msg1, msg2]
NODE returns: {"messages": [msg3]}
AFTER:  state["messages"] = [msg1, msg2, msg3]  ← msg3 was appended!

Without reducer (OVERWRITE):
─────────────────────────────────────────
BEFORE: state["status"] = "running"
NODE returns: {"status": "complete"}
AFTER:  state["status"] = "complete"  ← replaced completely!
```

---

## 📖 Lesson 3.2 — NODES: The Workers

### What Is a Node?

A node is just a **Python function** that:
1. Receives the current state as input
2. Does some work (calls AI, uses a tool, etc.)
3. Returns a dictionary with ONLY the fields that changed

```python
# ============================================================
# FILE: 01_basics/node_patterns.py
# PURPOSE: Every pattern you'll use for nodes
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from typing import TypedDict, Annotated, List, Optional
import operator
import time

llm = ChatOllama(model="llama3.2", temperature=0.7)

class WorkflowState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    task: str
    result: Optional[str]
    attempts: int
    status: str

# ---- Pattern 1: Simple AI Node ----
def simple_ai_node(state: WorkflowState) -> dict:
    """Simplest node: call AI and return response."""
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

# ---- Pattern 2: Node with Logic ----
def smart_node(state: WorkflowState) -> dict:
    """Node with decision logic before calling AI."""
    
    # Read current state
    task = state["task"]
    attempts = state.get("attempts", 0)
    
    # Add context to the prompt based on state
    system_prompt = f"You are solving this task: {task}"
    if attempts > 0:
        system_prompt += f" This is attempt #{attempts + 1}. Previous attempts failed."
    
    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    response = llm.invoke(messages)
    
    # Update multiple state fields
    return {
        "messages": [response],
        "attempts": attempts + 1,  # Increment attempt counter
        "status": "processing"
    }

# ---- Pattern 3: Node with Error Handling ----
def robust_node(state: WorkflowState) -> dict:
    """Node that gracefully handles errors."""
    try:
        response = llm.invoke(state["messages"])
        return {
            "messages": [response],
            "status": "success",
            "error": None
        }
    except Exception as e:
        error_msg = f"Node failed: {str(e)}"
        print(f"❌ Error in node: {error_msg}")
        return {
            "messages": [AIMessage(content="I encountered an error. Please try again.")],
            "status": "error",
            "error": error_msg
        }

# ---- Pattern 4: Node without AI (pure logic) ----
def validation_node(state: WorkflowState) -> dict:
    """A node that doesn't call AI — just validates data."""
    
    last_message = state["messages"][-1].content if state["messages"] else ""
    
    # Pure Python logic — no AI needed!
    is_valid = len(last_message) > 10 and not last_message.startswith("Error")
    
    return {
        "status": "valid" if is_valid else "invalid",
        "result": last_message if is_valid else None
    }

# ---- Pattern 5: Async Node ----
async def async_node(state: WorkflowState) -> dict:
    """Async node for concurrent operations."""
    response = await llm.ainvoke(state["messages"])
    return {"messages": [response]}

print("✅ All node patterns defined!")
print("""
NODE RULES:
1. Input: full state (TypedDict)
2. Output: dict with ONLY changed fields  
3. Never mutate state in-place
4. Always return a dict (even empty {})
5. Can return multiple fields at once
""")
```

---

## 📖 Lesson 3.3 — EDGES: The Connections

### Regular Edges (Always go from A to B)

```python
# These always go in the specified direction
graph.add_edge("node_a", "node_b")  # A → B always
graph.add_edge("node_b", END)        # B → END always
```

### Conditional Edges (Smart routing!)

Conditional edges route based on a **routing function** that reads the state and returns the name of the next node.

```python
# ============================================================
# FILE: 01_basics/edge_patterns.py
# PURPOSE: All edge patterns in LangGraph
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List, Optional
import operator

llm = ChatOllama(model="llama3.2", temperature=0)

class MyState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    quality_score: int
    attempts: int
    category: str
    approved: bool

# ---- Routing Function Pattern ----
def route_by_quality(state: MyState) -> str:
    """
    Routing function: reads state, returns name of next node.
    MUST return a string matching one of the registered node names
    (or the END constant).
    """
    score = state.get("quality_score", 0)
    attempts = state.get("attempts", 0)
    
    if score >= 80:
        return "publish"          # High quality → publish
    elif attempts >= 3:
        return "escalate"         # Too many tries → escalate
    else:
        return "improve"          # Low quality → try to improve

def route_by_category(state: MyState) -> str:
    """Route based on content category."""
    category = state.get("category", "general").lower()
    
    routing_map = {
        "billing": "billing_agent",
        "technical": "tech_agent",
        "shipping": "shipping_agent",
    }
    
    return routing_map.get(category, "general_agent")  # Default: general

def route_approval(state: MyState) -> str:
    """Route based on human approval status."""
    if state.get("approved"):
        return "execute"
    else:
        return "reject"

# ---- Stub nodes (for demonstration) ----
def classify_node(state): 
    return {"category": "billing", "quality_score": 45, "attempts": 1}

def billing_agent(state): return {"messages": [AIMessage(content="Billing handled!")]}
def tech_agent(state): return {"messages": [AIMessage(content="Tech issue resolved!")]}
def shipping_agent(state): return {"messages": [AIMessage(content="Shipping checked!")]}
def general_agent(state): return {"messages": [AIMessage(content="General help provided!")]}
def publish(state): return {"messages": [AIMessage(content="Content published!")]}
def improve(state): return {"messages": [AIMessage(content="Content improved!")], "quality_score": 85, "attempts": state.get("attempts", 0) + 1}
def escalate(state): return {"messages": [AIMessage(content="Escalated to human!")]}
def execute(state): return {"messages": [AIMessage(content="Action executed!")]}
def reject(state): return {"messages": [AIMessage(content="Action rejected!")]}

# ---- Build graph with multiple conditional edges ----
graph = StateGraph(MyState)

# Add nodes
for name, fn in [("classify", classify_node), ("billing_agent", billing_agent),
                  ("tech_agent", tech_agent), ("shipping_agent", shipping_agent),
                  ("general_agent", general_agent), ("publish", publish),
                  ("improve", improve), ("escalate", escalate)]:
    graph.add_node(name, fn)

graph.set_entry_point("classify")

# ---- Conditional edge from classify ----
graph.add_conditional_edges(
    "classify",          # From this node
    route_by_category,   # Use this routing function
    {                    # Map: return value → next node name
        "billing_agent":  "billing_agent",
        "tech_agent":     "tech_agent",
        "shipping_agent": "shipping_agent",
        "general_agent":  "general_agent",
    }
)

# All agents end the workflow
for agent in ["billing_agent", "tech_agent", "shipping_agent", "general_agent"]:
    graph.add_edge(agent, END)

app = graph.compile()

# Test it
result = app.invoke({
    "messages": [HumanMessage(content="I have a billing question")],
    "quality_score": 0, "attempts": 0, "category": "", "approved": False
})
print("Result:", result["messages"][-1].content)
```

---

## 📖 Lesson 3.4 — Complete Workflow Example

```python
# ============================================================
# FILE: 01_basics/complete_workflow.py
# PURPOSE: Full workflow combining State + Nodes + Edges
# SCENARIO: AI article writer with quality check loop
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List, Optional
import operator

llm = ChatOllama(model="llama3.2", temperature=0.7)
parser = StrOutputParser()

# ---- State ----
class ArticleState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    topic: str
    draft: Optional[str]
    quality_score: int     # 0-100
    feedback: Optional[str]
    final_article: Optional[str]
    revision_count: int
    status: str

# ---- Nodes ----
def writer_node(state: ArticleState) -> dict:
    """Write or rewrite an article draft."""
    print(f"  ✍️  Writing draft (revision #{state['revision_count'] + 1})...")
    
    prompt = f"Write a 200-word article about: {state['topic']}"
    if state.get("feedback"):
        prompt += f"\n\nPrevious feedback to address: {state['feedback']}"
    
    draft = (
        ChatPromptTemplate.from_messages([
            ("system", "You are a professional content writer. Write engaging, accurate articles."),
            ("human", "{prompt}")
        ]) | llm | parser
    ).invoke({"prompt": prompt})
    
    return {
        "draft": draft,
        "revision_count": state["revision_count"] + 1,
        "status": "draft_ready"
    }

def quality_checker_node(state: ArticleState) -> dict:
    """Score the draft and provide feedback."""
    print("  🔍 Checking quality...")
    
    assessment = (
        ChatPromptTemplate.from_messages([
            ("system", "You are an editor. Score articles 0-100 and give specific feedback."),
            ("human", "Score this article and give feedback:\n\n{draft}\n\nReturn format:\nSCORE: [number]\nFEEDBACK: [your feedback]")
        ]) | llm | parser
    ).invoke({"draft": state["draft"]})
    
    # Parse score from response
    score = 70  # Default
    feedback = assessment
    
    for line in assessment.split('\n'):
        if line.startswith("SCORE:"):
            try:
                score = int(''.join(filter(str.isdigit, line)))
            except:
                pass
        elif line.startswith("FEEDBACK:"):
            feedback = line.replace("FEEDBACK:", "").strip()
    
    print(f"  📊 Quality Score: {score}/100")
    return {"quality_score": score, "feedback": feedback, "status": "checked"}

def publisher_node(state: ArticleState) -> dict:
    """Finalize and 'publish' the article."""
    print("  📤 Publishing article!")
    return {
        "final_article": state["draft"],
        "status": "published"
    }

# ---- Routing ----
def should_revise(state: ArticleState) -> str:
    """Decide: publish or revise?"""
    score = state.get("quality_score", 0)
    revisions = state.get("revision_count", 0)
    
    if score >= 75:
        print(f"  ✅ Quality good ({score}/100) → Publishing")
        return "publish"
    elif revisions >= 3:
        print(f"  ⚠️  Max revisions reached → Publishing anyway")
        return "publish"
    else:
        print(f"  🔄 Score {score}/100 too low → Revising")
        return "revise"

# ---- Build Graph ----
graph = StateGraph(ArticleState)

graph.add_node("writer", writer_node)
graph.add_node("quality_check", quality_checker_node)
graph.add_node("publisher", publisher_node)

graph.set_entry_point("writer")
graph.add_edge("writer", "quality_check")

# THE LOOP: After checking quality, either revise or publish
graph.add_conditional_edges(
    "quality_check",
    should_revise,
    {
        "revise": "writer",    # Loop back to writer!
        "publish": "publisher"
    }
)

graph.add_edge("publisher", END)
app = graph.compile()

# ---- Run the workflow ----
print("📰 AI Article Writer with Quality Loop\n")

result = app.invoke({
    "messages": [],
    "topic": "How AI is transforming software development",
    "draft": None,
    "quality_score": 0,
    "feedback": None,
    "final_article": None,
    "revision_count": 0,
    "status": "starting"
})

print(f"\n🎯 Final Status: {result['status']}")
print(f"📊 Final Quality Score: {result['quality_score']}/100")
print(f"🔄 Total Revisions: {result['revision_count']}")
print(f"\n📄 PUBLISHED ARTICLE:")
print("=" * 50)
print(result["final_article"])
```

---

## ⚠️ Common Mistakes

### Mistake 1: Mutating State In-Place

```python
# ❌ NEVER DO THIS
def bad_node(state):
    state["messages"].append(new_msg)  # Mutating in place!
    state["count"] += 1                # Mutating in place!
    return state

# ✅ Return a new dict with changes only
def good_node(state):
    return {
        "messages": [new_msg],              # Append via reducer
        "count": state["count"] + 1         # New value
    }
```

### Mistake 2: Routing Function Returns Unknown Key

```python
# ❌ Returns "done" but it's not in the edge map!
def bad_route(state):
    return "done"  # Not in edge map → Error!

graph.add_conditional_edges("node", bad_route, {
    "continue": "next_node",
    # "done" is missing!
})

# ✅ Always have a complete mapping including defaults
def good_route(state):
    if condition:
        return "continue"
    return "end"  # Must be in the map!

graph.add_conditional_edges("node", good_route, {
    "continue": "next_node",
    "end": END  # Mapped to END
})
```

---

## 🎯 Mini Challenges

**Challenge 1** (State Design): Design the state for a "job application processor" — what fields would you need? Which use `operator.add`? Which get overwritten?

**Challenge 2** (Loop): Build a "poem polisher" — Node 1 writes a haiku, Node 2 rates it 1-10. If below 7, loop back to Node 1 with feedback. Max 3 loops.

**Challenge 3** (Routing): Build a 4-way router that classifies text as: `question`, `complaint`, `compliment`, or `other` — then routes to a specialized handler node for each.

---

## ✅ Phase 3 Recap

| Concept | Rule |
|---------|------|
| State | TypedDict with annotated reducers |
| `operator.add` | Appends new list items |
| No reducer | Overwrites the field |
| Node input | Full state (TypedDict) |
| Node output | Dict with ONLY changed fields |
| Regular edge | `graph.add_edge(A, B)` — always A→B |
| Conditional edge | `graph.add_conditional_edges(A, fn, map)` |
| Routing function | Reads state, returns string key |
| `END` | Special constant to finish workflow |

---

## 🚀 What's Next?

**Phase 4** — Conditional Routing in depth: advanced routing patterns, multiple conditions, fallbacks, and real-world examples.

> **Go to**: `Phase04_Routing/lesson.md` →

---

*Phase 3 Complete! 🧱 You understand the building blocks. Now let's route smartly!*
