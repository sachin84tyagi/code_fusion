# 🕸️ Phase 10 — LangGraph
### "Building Stateful AI Workflows and Multi-Agent Systems"

> **Difficulty**: ⭐⭐⭐⭐⭐ Advanced | **Time**: ~120 minutes | **Prerequisites**: Phase 8 + 9

---

## 🎯 What You'll Learn

- ✅ What LangGraph is and why it's powerful
- ✅ Nodes, Edges, and State
- ✅ Conditional routing
- ✅ Stateful agent loops
- ✅ Human-in-the-loop systems
- ✅ Multi-agent orchestration
- ✅ Build production AI workflows

---

## 📖 Lesson 10.1 — Why LangGraph?

### The Problem With Simple Agents

Regular agents are like a **straight road** — go from A to B:
```
Input → Think → Act → Output
```

Real AI systems need **road networks**:
```
Input → Decision Point → Path A → Check → Maybe loop back → Output
                      ↘ Path B → Get human input → Continue
```

LangGraph gives you that flexibility with:
- **Cycles** (loops, retries)
- **Branches** (conditional paths)
- **State** (remembers what happened)
- **Checkpoints** (save progress, resume)
- **Human-in-the-loop** (pause for human review)

### LangGraph vs Simple Chains

```
┌────────────────────────────────────────────────┐
│  LANGCHAIN CHAINS    │   LANGGRAPH             │
│  (Simple Pipeline)   │   (Stateful Workflow)   │
├──────────────────────┼─────────────────────────┤
│  A → B → C → Done   │  A → B → C              │
│  Linear only         │  ↑_________↓ (loops ok) │
│  No branching        │  A → B or C (branches)  │
│  No state            │  Full state tracking     │
│  Can't pause         │  Human-in-the-loop ✅    │
│  Simple apps         │  Production systems      │
└────────────────────────────────────────────────┘
```

---

## 📖 Lesson 10.2 — Core Concepts

### The Three Concepts

```
1. STATE    = What the agent "knows" at any point
             Like short-term memory for the workflow
             
2. NODES    = Steps/functions that process state
             Like workers on an assembly line
             
3. EDGES    = Connections between nodes
             Regular: always go from A to B
             Conditional: go to B or C depending on a condition
```

### State Example

```python
# State is defined as a TypedDict
from typing import TypedDict, List, Annotated
from langchain_core.messages import BaseMessage
import operator

class WorkflowState(TypedDict):
    # Annotated with operator.add = append, don't overwrite
    messages: Annotated[List[BaseMessage], operator.add]
    
    # These are overwritten each time
    current_step: str
    data: dict
    error: str
    approved: bool
    attempts: int
```

---

## 📖 Lesson 10.3 — Your First LangGraph

```python
# ============================================================
# FILE: langgraph/first_graph.py
# PURPOSE: Building your first LangGraph workflow
# Install: pip install langgraph
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, BaseMessage
from typing import TypedDict, Annotated, List
import operator

# ---- Step 1: Define State ----
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]

# ---- Step 2: Define Nodes (Functions) ----
llm = ChatOllama(model="llama3.2")

def greet_node(state: AgentState) -> dict:
    """Node 1: Greet the user"""
    print("📍 Node: Greet")
    response = llm.invoke([
        SystemMessage(content="You are a friendly greeter."),
        *state["messages"],
        HumanMessage(content="Greet the user warmly in one sentence.")
    ])
    return {"messages": [response]}

def help_node(state: AgentState) -> dict:
    """Node 2: Offer help"""
    print("📍 Node: Help")
    response = llm.invoke([
        SystemMessage(content="You are a helpful assistant."),
        *state["messages"]
    ])
    return {"messages": [response]}

def farewell_node(state: AgentState) -> dict:
    """Node 3: Say goodbye"""
    print("📍 Node: Farewell")
    response = llm.invoke([
        SystemMessage(content="Say a warm goodbye."),
        *state["messages"]
    ])
    return {"messages": [response]}

# ---- Step 3: Routing Function ----
def route_after_greet(state: AgentState) -> str:
    """Decide what to do after greeting."""
    last_msg = state["messages"][-1].content.lower()
    
    if "bye" in last_msg or "goodbye" in last_msg:
        return "farewell"
    else:
        return "help"

# ---- Step 4: Build the Graph ----
graph = StateGraph(AgentState)

# Add nodes
graph.add_node("greet", greet_node)
graph.add_node("help", help_node)
graph.add_node("farewell", farewell_node)

# Set entry point
graph.set_entry_point("greet")

# Add edges
graph.add_conditional_edges(
    "greet",
    route_after_greet,
    {
        "help": "help",
        "farewell": "farewell"
    }
)
graph.add_edge("help", END)
graph.add_edge("farewell", END)

# Compile
app = graph.compile()

# ---- Step 5: Run It! ----
print("🕸️ Running LangGraph Workflow\n")

result = app.invoke({
    "messages": [HumanMessage(content="Hello! I need help with Python.")]
})

print("\n📋 Final Messages:")
for msg in result["messages"]:
    print(f"  [{msg.type}]: {msg.content[:100]}")
```

---

## 📖 Lesson 10.4 — Agent with Loop (The Core Pattern)

```python
# ============================================================
# FILE: langgraph/agent_with_loop.py
# PURPOSE: Production agent with tool-use loop
# ============================================================

from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import (
    HumanMessage, SystemMessage, BaseMessage, AIMessage
)
from typing import TypedDict, Annotated, List, Sequence
import operator

# ---- Tools ----
@tool
def search(query: str) -> str:
    """Search for information. Input: search query."""
    data = {
        "python": "Python is a high-level programming language known for simplicity.",
        "langchain": "LangChain is a framework for building LLM applications.",
        "langgraph": "LangGraph builds stateful multi-actor apps with LLMs.",
    }
    for k, v in data.items():
        if k in query.lower():
            return v
    return f"Search result for: {query}"

@tool
def calculate(expression: str) -> str:
    """Calculate math expressions."""
    try:
        return str(eval(expression, {"__builtins__": {}}, {}))
    except:
        return "Error in calculation"

tools = [search, calculate]

# ---- State ----
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]

# ---- Model ----
llm = ChatOllama(model="llama3.2")
llm_with_tools = llm.bind_tools(tools)

# ---- Nodes ----
SYSTEM = SystemMessage(content="""You are a helpful AI agent with tools.
Use search for information and calculator for math.
Think step by step.""")

def agent_node(state: AgentState) -> dict:
    """The main agent thinking node."""
    messages = [SYSTEM] + list(state["messages"])
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

def should_continue(state: AgentState) -> str:
    """Route: continue to tools, or finish."""
    last_msg = state["messages"][-1]
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        return "tools"
    return END

# ---- Build Graph ----
graph = StateGraph(AgentState)

graph.add_node("agent", agent_node)
graph.add_node("tools", ToolNode(tools))  # LangGraph's built-in tool runner!

graph.set_entry_point("agent")

graph.add_conditional_edges("agent", should_continue, {
    "tools": "tools",
    END: END
})

graph.add_edge("tools", "agent")  # After tools, back to agent

app = graph.compile()

# ---- Run ----
def ask_agent(question: str):
    print(f"\n❓ Question: {question}")
    print("-" * 40)
    
    result = app.invoke(
        {"messages": [HumanMessage(content=question)]}
    )
    
    final = result["messages"][-1]
    print(f"✅ Answer: {final.content}")

ask_agent("What is LangChain and how many characters is its name? Calculate: len('LangChain')")
ask_agent("Search for Python and calculate 15 * 47")
```

---

## 📖 Lesson 10.5 — Human-in-the-Loop

One of LangGraph's most powerful features — **pause the agent and wait for human approval**:

```python
# ============================================================
# FILE: langgraph/human_in_loop.py
# PURPOSE: Agent that pauses for human review before acting
# ============================================================

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, BaseMessage
from typing import TypedDict, Annotated, List
import operator

@tool
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email. Requires human approval before sending!"""
    # In real app: use email API
    print(f"\n📧 EMAIL SENT!")
    print(f"  To: {to}")
    print(f"  Subject: {subject}")
    print(f"  Body: {body[:100]}")
    return f"Email sent to {to} successfully"

@tool
def delete_file(filename: str) -> str:
    """Delete a file. Requires human approval!"""
    print(f"🗑️ DELETED: {filename}")
    return f"File {filename} deleted"

tools = [send_email, delete_file]

class State(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    awaiting_approval: bool

llm = ChatOllama(model="llama3.2")
llm_with_tools = llm.bind_tools(tools)

def agent(state: State) -> dict:
    response = llm_with_tools.invoke(
        [SystemMessage(content="You help manage emails and files.")] + state["messages"]
    )
    return {"messages": [response]}

def human_approval_node(state: State) -> dict:
    """
    This node PAUSES the graph.
    The graph will wait here until a human provides input.
    """
    last_msg = state["messages"][-1]
    
    print("\n⚠️  HUMAN APPROVAL REQUIRED")
    print("The agent wants to perform this action:")
    
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        for tc in last_msg.tool_calls:
            print(f"  Tool: {tc['name']}")
            print(f"  Args: {tc['args']}")
    
    approval = input("\n✅ Approve? (yes/no): ").strip().lower()
    
    if approval == "yes":
        return {"awaiting_approval": False}
    else:
        # Inject a message to tell agent it was rejected
        return {
            "messages": [HumanMessage(content="Action rejected by human. Please suggest an alternative.")],
            "awaiting_approval": False
        }

def needs_approval(state: State) -> str:
    """Check if the action needs human approval."""
    last_msg = state["messages"][-1]
    
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        # These tools are risky — need approval!
        risky_tools = ["send_email", "delete_file"]
        for tc in last_msg.tool_calls:
            if tc["name"] in risky_tools:
                return "human_approval"
        return "tools"  # Safe tools, no approval needed
    return END

from langgraph.prebuilt import ToolNode

graph = StateGraph(State)
graph.add_node("agent", agent)
graph.add_node("tools", ToolNode(tools))
graph.add_node("human_approval", human_approval_node)

graph.set_entry_point("agent")

graph.add_conditional_edges("agent", needs_approval, {
    "human_approval": "human_approval",
    "tools": "tools",
    END: END
})

graph.add_edge("human_approval", "tools")  # After approval, run tools
graph.add_edge("tools", "agent")

# Memory saver for checkpointing
checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)

# Run with human-in-the-loop
print("🕸️ Human-in-the-Loop Agent")
print("This agent will ask for your approval before risky actions\n")

result = app.invoke(
    {"messages": [HumanMessage(content="Send an email to boss@company.com with subject 'Hello' and body 'This is a test'")], "awaiting_approval": False},
    config={"configurable": {"thread_id": "test_thread"}}
)

print("\n✅ Workflow complete!")
print(f"Final message: {result['messages'][-1].content[:200]}")
```

---

## 📖 Lesson 10.6 — Multi-Agent Orchestration

```python
# ============================================================
# FILE: langgraph/multi_agent_orchestration.py
# PURPOSE: LangGraph multi-agent system with supervisor
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from typing import TypedDict, Annotated, List, Literal
import operator

# ---- Agents ----
llm = ChatOllama(model="llama3.2", temperature=0.3)

def create_agent(system_prompt: str):
    """Factory function to create specialized agents."""
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}")
    ])
    return prompt | llm | StrOutputParser()

research_agent = create_agent(
    "You are an expert researcher. Provide detailed, accurate information. "
    "Structure findings clearly. Focus on facts and data."
)

writing_agent = create_agent(
    "You are a professional content writer. Transform research into engaging, "
    "well-structured content. Use clear language and good formatting."
)

critic_agent = create_agent(
    "You are a critical reviewer. Evaluate content for accuracy, clarity, "
    "and completeness. Give a score 1-10 and specific feedback."
)

# ---- State ----
class TeamState(TypedDict):
    task: str
    research: str
    draft: str
    critique: str
    final: str
    iteration: int
    next_step: str

# ---- Node Functions ----
def supervisor(state: TeamState) -> dict:
    """Decides what to do next."""
    print(f"\n👔 SUPERVISOR (iteration {state.get('iteration', 0)})")
    
    if not state.get("research"):
        print("  → Routing to research")
        return {"next_step": "research"}
    elif not state.get("draft"):
        print("  → Routing to writing")
        return {"next_step": "write"}
    elif state.get("iteration", 0) < 2 and not state.get("final"):
        print("  → Routing to critique")
        return {"next_step": "critique"}
    else:
        print("  → Task complete!")
        return {"next_step": "done", "final": state.get("draft", "")}

def research_node(state: TeamState) -> dict:
    print("🔬 RESEARCH AGENT working...")
    result = research_agent.invoke({"input": f"Research this topic thoroughly: {state['task']}"})
    return {"research": result}

def write_node(state: TeamState) -> dict:
    print("✍️ WRITING AGENT working...")
    result = writing_agent.invoke({
        "input": f"Write content about '{state['task']}' using this research:\n{state['research'][:500]}"
    })
    return {"draft": result}

def critique_node(state: TeamState) -> dict:
    print("📋 CRITIC AGENT reviewing...")
    result = critic_agent.invoke({
        "input": f"Review this content:\n{state['draft'][:500]}"
    })
    iteration = state.get("iteration", 0) + 1
    
    # If score is high enough or we've iterated twice, finalize
    if "8" in result or "9" in result or "10" in result or iteration >= 2:
        return {"critique": result, "iteration": iteration, "final": state["draft"]}
    else:
        # Revise the draft
        revision = writing_agent.invoke({
            "input": f"Improve this content based on feedback:\n\nContent: {state['draft'][:400]}\n\nFeedback: {result[:300]}"
        })
        return {"critique": result, "draft": revision, "iteration": iteration}

def route(state: TeamState) -> str:
    """Route based on supervisor decision."""
    return state.get("next_step", "done")

# ---- Build Graph ----
graph = StateGraph(TeamState)

graph.add_node("supervisor", supervisor)
graph.add_node("research", research_node)
graph.add_node("write", write_node)
graph.add_node("critique", critique_node)

graph.set_entry_point("supervisor")

graph.add_conditional_edges("supervisor", route, {
    "research": "research",
    "write": "write",
    "critique": "critique",
    "done": END
})

graph.add_edge("research", "supervisor")
graph.add_edge("write", "supervisor")
graph.add_edge("critique", "supervisor")

app = graph.compile()

# ---- Run ----
print("🕸️ MULTI-AGENT CONTENT CREATION SYSTEM\n")

result = app.invoke({
    "task": "The benefits of AI agents for small businesses",
    "research": "",
    "draft": "",
    "critique": "",
    "final": "",
    "iteration": 0,
    "next_step": ""
})

print("\n" + "="*60)
print("📊 FINAL OUTPUT:")
print("="*60)
print(result["final"][:800])
print(f"\n(Completed in {result['iteration']} critique cycles)")
```

---

## ⚠️ Common LangGraph Mistakes

### Mistake 1: State Mutability

```python
# ❌ Returning entire state (causes merge issues)
def my_node(state):
    state["messages"].append(new_msg)  # Never mutate!
    return state

# ✅ Return only what changed
def my_node(state):
    return {"messages": [new_msg]}  # LangGraph merges this properly
```

### Mistake 2: Missing Edge Cases in Routing

```python
# ❌ Only handles some cases
def route(state):
    if condition_a:
        return "node_a"
    # Forgets to handle everything else!

# ✅ Always have a default
def route(state):
    if condition_a:
        return "node_a"
    elif condition_b:
        return "node_b"
    else:
        return END  # Always have a fallback!
```

---

## 🎯 Mini Challenges

**Challenge 1**: Build a "Code Review Workflow" in LangGraph: Node 1 writes code, Node 2 reviews it, Node 3 fixes issues if any, loop until quality is acceptable.

**Challenge 2**: Create a "Content Approval Pipeline" with human-in-the-loop: AI writes content → AI reviews → Human approves/rejects → If approved, save to file.

**Challenge 3**: Build a "Customer Journey Graph": Different paths for new users vs returning users, with specialized handling for VIP customers.

---

## ✅ Phase 10 Recap

| LangGraph Concept | What It Does |
|-------------------|-------------|
| StateGraph | The workflow container |
| State (TypedDict) | Shared memory between nodes |
| Nodes | Processing functions |
| Edges | Connections between nodes |
| Conditional Edges | Smart routing based on state |
| ToolNode | Built-in tool execution node |
| MemorySaver | Checkpoint/save progress |
| Human-in-the-loop | Pause for human review |

---

## 🚀 What's Next?

**Phase 11 — Real Industry Projects** — put everything together to build 10 complete, production-ready AI projects!

> **Go to**: `Phase11_Projects/lesson.md` →

---

*Phase 10 Complete! 🕸️ You now master LangGraph. You're a senior AI engineer!*
