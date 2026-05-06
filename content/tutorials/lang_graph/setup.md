# 🛠️ Phase 2 — Environment Setup
### "Installing Everything and Running Your First LangGraph"

> **Difficulty**: ⭐ Beginner | **Time**: ~45 minutes | **Prerequisites**: Phase 1 Complete, Python installed

---

## 🎯 What You'll Set Up

- ✅ Python virtual environment
- ✅ LangGraph and all dependencies installed
- ✅ Ollama running locally (free AI)
- ✅ Project folder structure
- ✅ Your first LangGraph "Hello World" running
- ✅ Graph visualization tool working

---

## 📖 Lesson 2.1 — What We're Installing and Why

```
┌─────────────────────────────────────────────────────────┐
│              WHAT WE NEED                               │
├────────────────────┬────────────────────────────────────┤
│  Package           │  Why                               │
├────────────────────┼────────────────────────────────────┤
│  langgraph         │  The main framework                │
│  langchain-core    │  Messages, prompts, base classes   │
│  langchain-ollama  │  Local AI (free!)                  │
│  langchain-openai  │  Cloud AI (optional)               │
│  python-dotenv     │  Manage API keys safely            │
│  ipython           │  For displaying graph visuals      │
└────────────────────┴────────────────────────────────────┘
```

---

## 📖 Lesson 2.2 — Step 1: Create Project Folder & Virtual Environment

Open PowerShell/Terminal and run:

```bash
# Navigate to your course folder
cd d:\myFirstAITest\LangGraph_Course

# Create project folder
mkdir langgraph_projects
cd langgraph_projects

# Create virtual environment
python -m venv .venv

# Activate it (Windows)
.venv\Scripts\activate

# You should see (.venv) at the start of your terminal line
```

---

## 📖 Lesson 2.3 — Step 2: Install LangGraph

```bash
# Core LangGraph
pip install langgraph

# LangChain components (LangGraph uses LangChain internally)
pip install langchain-core langchain-community

# AI Model providers
pip install langchain-ollama      # Local AI (FREE)
pip install langchain-openai      # OpenAI GPT (optional)

# Utilities
pip install python-dotenv         # For .env file
pip install grandalf               # For graph visualization (optional)
```

### Verify Installation

```bash
python -c "import langgraph; print('LangGraph version:', langgraph.__version__)"
# Should print: LangGraph version: 0.2.x or higher
```

---

## 📖 Lesson 2.4 — Step 3: Setup Ollama

```bash
# Download from https://ollama.com and install

# Pull a model (runs locally, FREE)
ollama pull llama3.2

# Verify it works
ollama run llama3.2
# Type "hello" and press Enter - you should get a response
# Press Ctrl+D to exit
```

---

## 📖 Lesson 2.5 — Step 4: Project Structure

```
langgraph_projects/
│
├── .env                    ← API keys (never commit!)
├── .gitignore              ← Tell git to ignore .env
├── requirements.txt        ← All dependencies
│
├── 01_basics/              ← Phase 3 exercises
│   ├── first_graph.py
│   └── simple_agent.py
│
├── 02_routing/             ← Phase 4 exercises
│   └── conditional_edges.py
│
├── 03_agents/              ← Phase 5 exercises
│   └── tool_agent.py
│
├── 04_memory/              ← Phase 6 exercises
│   └── persistent_agent.py
│
├── 05_human_loop/          ← Phase 7 exercises
│   └── approval_system.py
│
├── 06_multi_agent/         ← Phase 8 exercises
│   └── agent_team.py
│
└── projects/               ← Phase 11 full projects
    ├── customer_support/
    ├── content_creator/
    └── code_reviewer/
```

Create the `.env` file:

```bash
# .env
OPENAI_API_KEY=sk-your-key-here          # Optional
LANGCHAIN_TRACING_V2=true                # LangSmith tracing
LANGCHAIN_API_KEY=ls-your-key-here       # Optional
LANGCHAIN_PROJECT=langgraph-course
```

Create `.gitignore`:

```
.env
.venv/
__pycache__/
*.pyc
*.db
chroma_db/
```

---

## 📖 Lesson 2.6 — Your First LangGraph Program

Let's write the simplest possible LangGraph. Think of it as "Hello World" for graph-based AI.

```python
# ============================================================
# FILE: 01_basics/hello_langgraph.py
# PURPOSE: The absolute simplest LangGraph program
# ============================================================

# ---- Step 1: Import everything we need ----
from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List
import operator

# ---- Step 2: Define the STATE ----
# State = the shared memory that ALL nodes can read and write
# TypedDict = a dictionary with defined key types (like a data class)
class SimpleState(TypedDict):
    # Annotated[List[...], operator.add] means:
    # → This is a list of BaseMessage objects
    # → When nodes return new messages, APPEND them (not overwrite)
    messages: Annotated[List[BaseMessage], operator.add]

# ---- Step 3: Create the AI Model ----
llm = ChatOllama(model="llama3.2", temperature=0.7)

# ---- Step 4: Define NODES (functions that process state) ----
def greet_node(state: SimpleState) -> dict:
    """
    NODE: Takes the current state, processes it, returns updated fields.
    
    Input:  state (the full current state)
    Output: dict with ONLY the fields we're updating
    """
    print("📍 Greet Node executing...")
    
    # Get the user's messages from state
    user_messages = state["messages"]
    
    # Call the AI
    response = llm.invoke(user_messages)
    
    # Return ONLY what changed (just the new messages)
    # LangGraph merges this with existing state automatically
    return {"messages": [response]}

def farewell_node(state: SimpleState) -> dict:
    """
    NODE: Says goodbye based on what was discussed.
    """
    print("📍 Farewell Node executing...")
    
    # Get all messages so far (includes user message AND AI's greeting)
    all_messages = state["messages"]
    
    # Ask AI to say goodbye based on conversation
    farewell_messages = all_messages + [
        HumanMessage(content="Now please say a warm goodbye!")
    ]
    
    response = llm.invoke(farewell_messages)
    
    return {"messages": [response]}

# ---- Step 5: Build the GRAPH ----
# StateGraph = the graph container (knows about our state type)
graph = StateGraph(SimpleState)

# Add nodes: graph.add_node("node_name", function)
graph.add_node("greet", greet_node)
graph.add_node("farewell", farewell_node)

# Set entry point: where does the graph START?
graph.set_entry_point("greet")

# Add edges: graph.add_edge("from_node", "to_node")
# After greet → go to farewell
graph.add_edge("greet", "farewell")

# After farewell → END (workflow is complete)
graph.add_edge("farewell", END)

# ---- Step 6: COMPILE the graph ----
# Compile validates the graph and makes it executable
app = graph.compile()

# ---- Step 7: RUN the graph ----
print("🕸️ Running my first LangGraph!\n")

# The initial state: just the user's message
initial_state = {
    "messages": [
        HumanMessage(content="Hi! My name is Ahmed and I'm learning LangGraph!")
    ]
}

# .invoke() runs the ENTIRE graph from start to end
# Returns the FINAL state after all nodes have run
final_state = app.invoke(initial_state)

# Print all messages accumulated in state
print("\n📋 Full Conversation:")
for msg in final_state["messages"]:
    role = "👤 You" if isinstance(msg, HumanMessage) else "🤖 AI"
    print(f"{role}: {msg.content[:150]}")
```

### Run It!

```bash
python 01_basics/hello_langgraph.py
```

### Expected Output

```
🕸️ Running my first LangGraph!

📍 Greet Node executing...
📍 Farewell Node executing...

📋 Full Conversation:
👤 You: Hi! My name is Ahmed and I'm learning LangGraph!
🤖 AI: Hello Ahmed! That's wonderful that you're learning LangGraph...
🤖 AI: Goodbye Ahmed! It was lovely chatting with you...
```

🎉 **That's a real LangGraph workflow!**

---

## 📖 Lesson 2.7 — Line-by-Line Explanation

Let's break down every important concept from the code above:

```python
class SimpleState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
```
- **TypedDict**: A special dictionary that has type annotations. Like a blueprint for what data the graph carries.
- **Annotated**: Adds extra info to the type. Here it tells LangGraph: "when merging new messages, ADD them to the list (don't replace it)."
- **operator.add**: The "reducer" — how to merge new state with existing state.

```python
def greet_node(state: SimpleState) -> dict:
    ...
    return {"messages": [response]}
```
- Every node RECEIVES the full state
- Every node RETURNS only the fields it changed
- LangGraph **merges** the returned dict with existing state
- Because of `operator.add`, new messages are **appended** not overwritten

```python
graph = StateGraph(SimpleState)
graph.add_node("greet", greet_node)
graph.set_entry_point("greet")
graph.add_edge("greet", "farewell")
graph.add_edge("farewell", END)
app = graph.compile()
```
- `StateGraph(SimpleState)` → "I'm building a graph that carries SimpleState"
- `add_node("name", function)` → Register a node
- `set_entry_point` → Where to start
- `add_edge(from, to)` → Draw a connection
- `END` → Special LangGraph constant meaning "workflow is done"
- `compile()` → Validate and finalize the graph

---

## 📖 Lesson 2.8 — Visualizing Your Graph

```python
# ============================================================
# FILE: 01_basics/visualize_graph.py
# PURPOSE: See what your graph looks like
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage
from typing import TypedDict, Annotated, List
import operator

class SimpleState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]

def node_a(state): return {}
def node_b(state): return {}
def node_c(state): return {}

graph = StateGraph(SimpleState)
graph.add_node("A", node_a)
graph.add_node("B", node_b)
graph.add_node("C", node_c)

graph.set_entry_point("A")
graph.add_edge("A", "B")
graph.add_edge("B", "C")
graph.add_edge("C", END)

app = graph.compile()

# ---- Method 1: ASCII representation ----
print("Graph Structure:")
print(app.get_graph().draw_ascii())

# ---- Method 2: Save as image (requires graphviz) ----
# pip install grandalf
try:
    png_data = app.get_graph().draw_mermaid_png()
    with open("my_graph.png", "wb") as f:
        f.write(png_data)
    print("Graph saved as my_graph.png")
except Exception:
    print("Install graphviz for image output")

# ---- Method 3: Mermaid diagram (paste at mermaid.live) ----
print("\nMermaid Diagram (paste at https://mermaid.live):")
print(app.get_graph().draw_mermaid())
```

---

## 📖 Lesson 2.9 — Understanding the Execution Flow

Let's trace exactly what happens when you call `app.invoke()`:

```
app.invoke({"messages": [HumanMessage("Hello")]})
          │
          │  LangGraph's Pregel execution engine:
          ▼
┌─────────────────────────────────────────────────────┐
│  1. Start with initial state:                       │
│     { messages: [HumanMessage("Hello")] }           │
│                                                     │
│  2. Entry point → "greet" node                      │
│     greet_node receives full state                  │
│     greet_node returns {"messages": [AIMessage(...)]}│
│     State updated: { messages: [Human, AI_greet] } │
│                                                     │
│  3. Edge: greet → farewell                          │
│     farewell_node receives updated state            │
│     farewell_node returns {"messages": [AIMessage]}  │
│     State updated: { messages: [Human, AI1, AI2] } │
│                                                     │
│  4. Edge: farewell → END                            │
│     Workflow complete!                              │
│     Return final state                              │
└─────────────────────────────────────────────────────┘
```

---

## ⚠️ Common Setup Mistakes

### Mistake 1: Not Activating Virtual Environment

```
Error: ModuleNotFoundError: No module named 'langgraph'
```
**Fix**: Run `.venv\Scripts\activate` first (Windows)

---

### Mistake 2: Returning Full State Instead of Changes Only

```python
# ❌ WRONG - Returns entire state (causes issues)
def my_node(state):
    state["messages"].append(new_msg)  # Never mutate!
    return state

# ✅ CORRECT - Return only what changed
def my_node(state):
    return {"messages": [new_msg]}  # LangGraph handles the merge
```

---

### Mistake 3: Forgetting to Compile

```python
# ❌ Forgot to compile
app = graph  # This is the builder, not runnable!
app.invoke(...)  # Error!

# ✅ Always compile before running
app = graph.compile()  # Creates the runnable version
app.invoke(...)  # Works!
```

---

### Mistake 4: Wrong Import for END

```python
# ❌ Wrong
from langgraph.graph import END  # This doesn't exist alone
graph.add_edge("last_node", "END")  # String "END" won't work

# ✅ Correct
from langgraph.graph import StateGraph, END  # Import END from here
graph.add_edge("last_node", END)  # Use the constant
```

---

## 🎯 Mini Challenges

**Challenge 1** (Beginner): Create a 3-node graph:
- Node 1: Takes user input and translates it to French
- Node 2: Takes the French text and makes it formal/polite  
- Node 3: Takes the formal French text and writes an English summary

**Challenge 2** (Intermediate): Create a 2-node graph where:
- Node 1: AI writes a haiku about a given topic
- Node 2: AI gives feedback on the haiku's quality
Then print both the haiku and the feedback from the final state.

**Challenge 3** (Advanced): Create a graph and:
1. Generate the Mermaid diagram
2. Paste it at https://mermaid.live
3. Take a screenshot of the visual graph

---

## ✅ Phase 2 Recap

| Step | What You Did | Why |
|------|-------------|-----|
| Virtual env | Created `.venv` | Isolated dependencies |
| `pip install langgraph` | Core framework | The main tool |
| `pip install langchain-ollama` | Local AI | Free model for dev |
| `.env` file | API key storage | Security |
| State definition | `TypedDict` with reducers | Tells graph what to carry |
| Node function | Takes state, returns dict | The worker unit |
| Graph building | `add_node`, `add_edge` | Defines workflow |
| `compile()` | Validates + finalizes | Makes it runnable |
| `invoke()` | Runs the workflow | Execute! |

---

## 🚀 What's Next?

In **Phase 3**, we go deep into the three core building blocks of every LangGraph: **State, Nodes, and Edges**. You'll understand every detail and be able to design any workflow you can imagine.

> **Go to**: `Phase03_State_Nodes_Edges/lesson.md` →

---

*Phase 2 Complete! 🛠️ LangGraph is installed and your first graph is running!*
