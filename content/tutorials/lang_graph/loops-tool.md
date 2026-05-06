# 🤖 Phase 5 — Agent Loops & Tool Use
### "Building Autonomous Agents That Think, Act, and Observe"

> **Difficulty**: ⭐⭐⭐ Intermediate | **Time**: ~90 minutes | **Prerequisites**: Phase 4 Complete

---

## 🎯 What You'll Learn

- ✅ The ReAct (Reason + Act) loop inside LangGraph
- ✅ Integrating LangChain tools into LangGraph
- ✅ `ToolNode` — the built-in tool runner
- ✅ `create_react_agent` — one-line agent creation
- ✅ Custom agent loops with full control
- ✅ Build: Research Agent, Coding Agent, Task Agent

---

## 📖 Lesson 5.1 — The Agent Loop Pattern

### What Makes an Agent?

An agent is an AI system that runs a **loop**:

```
    ┌────────────────────────────────────────────────┐
    │                  AGENT LOOP                    │
    │                                                │
    │  User Goal                                     │
    │      ↓                                         │
    │  ┌────────────┐                               │
    │  │    THINK   │  AI reasons: "What should     │
    │  │   (LLM)    │  I do next?"                  │
    │  └─────┬──────┘                               │
    │        │                                       │
    │        ↓                                       │
    │  Has tool calls?                               │
    │    ├── YES ──→ ┌────────────┐                 │
    │    │           │    ACT     │  Execute tool   │
    │    │           │  (Tools)   │  get result     │
    │    │           └─────┬──────┘                 │
    │    │                 │                         │
    │    │           ┌─────▼──────┐                 │
    │    │           │  OBSERVE   │  Add result     │
    │    │           │  (State)   │  to messages    │
    │    │           └─────┬──────┘                 │
    │    │                 │                         │
    │    │           Loop back to THINK ←────────────┘
    │    │                                           │
    │    └── NO ──→ Final answer to user             │
    │                (No more tools needed)           │
    └────────────────────────────────────────────────┘
```

In LangGraph terms:
- **THINK** = the `agent` node (calls LLM)
- **ACT + OBSERVE** = the `tools` node (runs tools, adds results)
- **Conditional edge** = decides to loop or end

---

## 📖 Lesson 5.2 — Method 1: The Prebuilt ReAct Agent

LangGraph provides `create_react_agent` — a one-line agent with a standard ReAct loop:

```python
# ============================================================
# FILE: 03_agents/prebuilt_react_agent.py
# PURPOSE: Fastest way to create an agent with LangGraph
# ============================================================

from langgraph.prebuilt import create_react_agent
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage
from datetime import datetime

# ---- Define Tools ----
@tool
def get_current_time() -> str:
    """Get the current date and time. Use when asked about time."""
    return f"Current time: {datetime.now().strftime('%A, %B %d %Y at %H:%M:%S')}"

@tool
def calculate(expression: str) -> str:
    """
    Evaluate a mathematical expression.
    Input: valid math expression like '100 * 0.15' or '(50 + 30) / 4'
    """
    try:
        result = eval(expression, {"__builtins__": {}}, {
            "abs": abs, "round": round, "min": min, "max": max,
            "sum": sum, "pow": pow
        })
        return f"{expression} = {result}"
    except Exception as e:
        return f"Error: {e}"

@tool
def search_info(topic: str) -> str:
    """
    Search for information about a topic.
    Use for research, facts, current events.
    Input: search topic string
    """
    # Mock search results for demo
    knowledge = {
        "python": "Python is a high-level programming language created in 1991 by Guido van Rossum.",
        "langchain": "LangChain is a framework for building LLM-powered applications, created in 2022.",
        "langgraph": "LangGraph is a library for building stateful multi-actor AI applications using graphs.",
        "openai": "OpenAI is an AI company that created GPT-4, ChatGPT, and DALL-E models.",
        "machine learning": "ML is a subset of AI that enables computers to learn from data without explicit programming.",
    }
    topic_lower = topic.lower()
    for key, value in knowledge.items():
        if key in topic_lower:
            return f"Found: {value}"
    return f"General information about '{topic}': [Would fetch from real search API in production]"

@tool
def word_count(text: str) -> str:
    """Count words, characters, and sentences in text."""
    words = len(text.split())
    chars = len(text)
    sentences = text.count('.') + text.count('!') + text.count('?')
    return f"Words: {words} | Characters: {chars} | Sentences: {sentences}"

# ---- Create Agent (ONE LINE!) ----
llm = ChatOllama(model="llama3.2")
tools = [get_current_time, calculate, search_info, word_count]

# create_react_agent builds a complete LangGraph with:
# → agent node (calls LLM with tools)
# → tools node (executes tool calls)
# → conditional routing (loop or end)
agent = create_react_agent(llm, tools)

# ---- Run the Agent ----
def ask_agent(question: str) -> str:
    """Run the agent and get the final answer."""
    result = agent.invoke({
        "messages": [HumanMessage(content=question)]
    })
    return result["messages"][-1].content

# Test various capabilities
print("🤖 Prebuilt ReAct Agent Demo\n")
print("=" * 50)

tests = [
    "What time is it right now?",
    "If I earn $85,000 per year, what's my monthly salary?",
    "Tell me about LangChain and LangGraph",
    "What is 15% tip on a $47.50 restaurant bill? And what is today's date?",
]

for question in tests:
    print(f"\n❓ {question}")
    answer = ask_agent(question)
    print(f"🤖 {answer[:200]}")
```

---

## 📖 Lesson 5.3 — Method 2: Custom Agent Loop (Full Control)

When you need more control, build the agent loop yourself:

```python
# ============================================================
# FILE: 03_agents/custom_agent_loop.py
# PURPOSE: Build a custom agent with full control
# ============================================================

from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List, Literal
import operator

# ---- Tools ----
@tool
def search(query: str) -> str:
    """Search for information. Input: search query."""
    results = {
        "capital france": "Paris is the capital of France",
        "python creator": "Python was created by Guido van Rossum in 1991",
        "langchain": "LangChain is a framework for building LLM applications",
    }
    q = query.lower()
    for key, val in results.items():
        if any(word in q for word in key.split()):
            return val
    return f"Search result for '{query}': Information retrieved successfully"

@tool
def calculator(expression: str) -> str:
    """Evaluate math expressions. Input: math expression string."""
    try:
        return f"Result: {eval(expression, {'__builtins__': {}}, {})}"
    except Exception as e:
        return f"Error: {e}"

@tool
def get_date() -> str:
    """Get today's date."""
    from datetime import datetime
    return f"Today: {datetime.now().strftime('%Y-%m-%d')}"

tools = [search, calculator, get_date]

# ---- State ----
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    step_count: int

# ---- Model ----
llm = ChatOllama(model="llama3.2")
llm_with_tools = llm.bind_tools(tools)

SYSTEM = SystemMessage(content="""You are a helpful AI assistant with access to tools.
Use tools when you need information or calculations.
Be concise and accurate. Think step by step.""")

# ---- Nodes ----
def agent_node(state: AgentState) -> dict:
    """The thinking node: LLM decides what to do next."""
    messages = [SYSTEM] + list(state["messages"])
    response = llm_with_tools.invoke(messages)
    
    step = state.get("step_count", 0) + 1
    
    # Show what the agent is doing
    if response.tool_calls:
        tools_used = [tc["name"] for tc in response.tool_calls]
        print(f"  🧠 Step {step}: Agent using tools: {tools_used}")
    else:
        print(f"  🧠 Step {step}: Agent has final answer")
    
    return {
        "messages": [response],
        "step_count": step
    }

# ToolNode is a prebuilt node that:
# 1. Reads tool_calls from the last AI message
# 2. Executes each tool
# 3. Returns ToolMessage results
tool_node = ToolNode(tools)

# ---- Routing ----
def should_continue(state: AgentState) -> Literal["tools", "end"]:
    """
    Check if agent wants to use tools.
    If yes → loop to tools node.
    If no  → finish.
    """
    last_message = state["messages"][-1]
    
    # AIMessage with tool_calls → agent wants to use tools
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    
    # No tool calls → agent is done
    return "end"

# ---- Build the Graph ----
graph = StateGraph(AgentState)

# Register nodes
graph.add_node("agent", agent_node)
graph.add_node("tools", tool_node)   # Prebuilt ToolNode

# Entry: start at agent
graph.set_entry_point("agent")

# THE KEY LOOP:
# After agent runs → check if tools needed
graph.add_conditional_edges("agent", should_continue, {
    "tools": "tools",  # Go to tool execution
    "end": END         # Finish
})

# After tools run → ALWAYS go back to agent (to process tool results)
graph.add_edge("tools", "agent")

# Compile
app = graph.compile()

# ---- Run ----
def run_agent(question: str, max_steps: int = 10):
    """Run the custom agent."""
    print(f"\n🎯 Task: {question}")
    print("-" * 50)
    
    result = app.invoke({
        "messages": [HumanMessage(content=question)],
        "step_count": 0
    })
    
    final_answer = result["messages"][-1].content
    steps_taken = result["step_count"]
    
    print(f"\n✅ Answer ({steps_taken} steps): {final_answer}")
    return final_answer

run_agent("What is the capital of France?")
run_agent("What is 347 multiplied by 18?")
run_agent("Search for information about LangChain and tell me today's date too")
```

---

## 📖 Lesson 5.4 — Adding Step Limits and Timeouts

```python
# ============================================================
# FILE: 03_agents/safe_agent.py
# PURPOSE: Agent with safety limits to prevent infinite loops
# ============================================================

from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List, Optional
import operator

llm = ChatOllama(model="llama3.2")

@tool
def sometimes_slow_tool(query: str) -> str:
    """A tool that does research."""
    import time
    time.sleep(0.5)  # Simulate work
    return f"Research result for: {query}"

tools = [sometimes_slow_tool]

class SafeAgentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    steps: int
    max_steps: int
    timed_out: bool
    final_answer: Optional[str]

def agent_node(state: SafeAgentState) -> dict:
    """Agent with step counting."""
    current_steps = state.get("steps", 0)
    max_steps = state.get("max_steps", 5)
    
    # Step limit check
    if current_steps >= max_steps:
        print(f"  ⚠️  Step limit ({max_steps}) reached! Forcing conclusion.")
        forced_response = AIMessage(content=f"I've reached my step limit. Based on what I've gathered so far: {state['messages'][-1].content if state['messages'] else 'Unable to complete task.'}")
        return {
            "messages": [forced_response],
            "steps": current_steps + 1,
            "timed_out": True
        }
    
    llm_with_tools = llm.bind_tools(tools)
    response = llm_with_tools.invoke(
        [SystemMessage(content="You are helpful. Use tools wisely.")] + list(state["messages"])
    )
    
    return {"messages": [response], "steps": current_steps + 1}

def safe_route(state: SafeAgentState) -> str:
    """Route with timeout check."""
    if state.get("timed_out"):
        return "end"
    
    last_msg = state["messages"][-1]
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        return "tools"
    return "end"

graph = StateGraph(SafeAgentState)
graph.add_node("agent", agent_node)
graph.add_node("tools", ToolNode(tools))

graph.set_entry_point("agent")
graph.add_conditional_edges("agent", safe_route, {"tools": "tools", "end": END})
graph.add_edge("tools", "agent")

app = graph.compile()

# Run with limits
result = app.invoke({
    "messages": [HumanMessage(content="Research Python programming language")],
    "steps": 0,
    "max_steps": 3,  # Max 3 steps
    "timed_out": False,
    "final_answer": None
})

print(f"Steps taken: {result['steps']}")
print(f"Timed out: {result['timed_out']}")
print(f"Answer: {result['messages'][-1].content[:200]}")
```

---

## 📖 Lesson 5.5 — Streaming Agent Events

```python
# ============================================================
# FILE: 03_agents/streaming_agent.py
# PURPOSE: See every step of agent execution in real time
# ============================================================

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
def calculate(expr: str) -> str:
    """Calculate math."""
    try:
        return str(eval(expr, {"__builtins__": {}}, {}))
    except:
        return "Error in calculation"

agent = create_react_agent(llm, [search, calculate])

print("🌊 Streaming Agent Execution\n")
print("=" * 50)

# stream() shows EVERY event as it happens
for event in agent.stream(
    {"messages": [HumanMessage(content="Search for Python and calculate 250 * 4")]},
    stream_mode="values"  # Show state values at each step
):
    last_msg = event["messages"][-1]
    
    if isinstance(last_msg, HumanMessage):
        print(f"👤 USER: {last_msg.content}")
    
    elif isinstance(last_msg, AIMessage):
        if last_msg.tool_calls:
            for tc in last_msg.tool_calls:
                print(f"🤖 AGENT THINKS: I'll use '{tc['name']}' with {tc['args']}")
        elif last_msg.content:
            print(f"🤖 AGENT SAYS: {last_msg.content[:200]}")
    
    elif isinstance(last_msg, ToolMessage):
        print(f"🔧 TOOL RESULT: {last_msg.content[:150]}")
    
    print()  # Spacing between events
```

---

## 🏭 Real Project: Research & Report Agent

```python
# ============================================================
# FILE: 03_agents/projects/research_agent.py
# PURPOSE: Full research agent that writes reports
# ============================================================

from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage
from datetime import datetime
import json

llm = ChatOllama(model="llama3.2", temperature=0.3)

@tool
def web_search(query: str) -> str:
    """Search for information on the web. Input: search query."""
    knowledge = {
        "artificial intelligence": "AI is the simulation of human intelligence processes by machines...",
        "machine learning": "ML is a method of data analysis that automates analytical model building...",
        "deep learning": "Deep learning is part of ML based on artificial neural networks...",
        "natural language processing": "NLP is a subfield of AI that focuses on language understanding...",
        "computer vision": "CV is an AI field that enables computers to interpret visual information...",
    }
    q = query.lower()
    for key, val in knowledge.items():
        if any(w in q for w in key.split()):
            return f"[SEARCH] {val}"
    return f"[SEARCH] Research on '{query}': Key findings gathered from multiple sources."

@tool
def save_report(title: str, content: str, filename: str = None) -> str:
    """Save a research report to a file. Input: title, content, optional filename."""
    if not filename:
        filename = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
    
    report = f"# {title}\n\n*Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*\n\n{content}"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(report)
    
    return f"✅ Report saved: {filename} ({len(content)} characters)"

@tool
def calculate_stats(numbers: str) -> str:
    """Calculate statistics for a list of numbers. Input: comma-separated numbers like '10,20,30'."""
    try:
        nums = [float(x.strip()) for x in numbers.split(',')]
        return (f"Count: {len(nums)} | Sum: {sum(nums):.2f} | "
                f"Average: {sum(nums)/len(nums):.2f} | "
                f"Min: {min(nums):.2f} | Max: {max(nums):.2f}")
    except:
        return "Error parsing numbers. Use comma-separated format: '10,20,30'"

# Create agent with memory (remembers across calls)
checkpointer = MemorySaver()
agent = create_react_agent(llm, [web_search, save_report, calculate_stats], checkpointer=checkpointer)

def research(topic: str, session_id: str = "research_session"):
    """Run a research task."""
    print(f"\n🔬 Researching: {topic}\n")
    
    result = agent.invoke(
        {"messages": [HumanMessage(content=f"Research '{topic}' thoroughly. Then save a well-structured report to a file.")]},
        config={"configurable": {"thread_id": session_id}}
    )
    
    return result["messages"][-1].content

# Run research
print(research("artificial intelligence and its applications"))
print("\n" + "="*50)
print(research("How does machine learning relate to AI?"))  # Uses memory from previous!
```

---

## ⚠️ Common Agent Mistakes

### Mistake 1: Infinite Loop — No Termination Condition

```python
# ❌ Agent could loop forever if LLM always returns tool calls
def route(state):
    if state["messages"][-1].tool_calls:
        return "tools"
    return "continue"  # Always continues — infinite loop!

# ✅ Always check step count as a safety net
def route(state):
    steps = state.get("steps", 0)
    last_msg = state["messages"][-1]
    
    if steps >= 10:  # Hard limit
        return "end"
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        return "tools"
    return "end"
```

### Mistake 2: Not Adding System Prompt

```python
# ❌ No guidance for the agent
response = llm_with_tools.invoke(state["messages"])

# ✅ Always provide a system prompt
response = llm_with_tools.invoke(
    [SystemMessage(content="You are helpful. Use tools when needed.")] 
    + list(state["messages"])
)
```

---

## 🎯 Mini Challenges

**Challenge 1**: Build an agent with 3 tools: word counter, sentence reverser, text uppercaser. Test it with "Reverse 'hello world' and count the words, then make it uppercase."

**Challenge 2**: Create a "Personal Finance Agent" with tools: expense calculator, budget tracker (saves to JSON), and spending analyzer. It should handle multi-step financial queries.

**Challenge 3**: Build an agent that can write a Python function, save it to a file, and check its syntax — all autonomously.

---

## ✅ Phase 5 Recap

| Concept | What It Does |
|---------|-------------|
| `create_react_agent` | One-line prebuilt ReAct agent |
| `ToolNode` | Prebuilt node that executes tools |
| `agent_node` | Custom LLM node with tool binding |
| `should_continue` | Routing: loop or end |
| `stream()` | See every agent step live |
| Step limit | Prevent infinite loops |
| `MemorySaver` | Agent remembers across calls |

---

## 🚀 What's Next?

**Phase 6** — Memory & Persistence: giving your agents long-term memory that survives restarts, supports multiple users, and can be queried.

> **Go to**: `Phase06_Memory/lesson.md` →

---

*Phase 5 Complete! 🤖 You can build autonomous agents. The hardest part is done!*
