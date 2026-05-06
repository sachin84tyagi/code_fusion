# 🤖 Phase 8 — AI Agents (THE MOST IMPORTANT PHASE!)
### "Building Autonomous AI That Plans, Acts, and Thinks"

> **Difficulty**: ⭐⭐⭐⭐ Advanced | **Time**: ~120 minutes | **Prerequisites**: ALL previous phases

---

## 🎯 What You'll Learn

- ✅ What AI Agents actually are (clearly explained)
- ✅ Agent vs Chatbot — the key difference
- ✅ The Thought → Action → Observation cycle (ReAct)
- ✅ Building ReAct agents
- ✅ Tool-calling agents
- ✅ Autonomous multi-step agents
- ✅ LangGraph-based stateful agents
- ✅ Real projects: Coding Agent, Research Agent, Business Automation

---

## 📖 Lesson 8.1 — What Is An AI Agent?

### Simple Explanation

A **chatbot** answers one question at a time. An **agent** can:
1. **Receive a complex goal**
2. **Break it down into steps**
3. **Decide which tools to use**
4. **Execute actions**
5. **Observe results**
6. **Adjust its plan**
7. **Repeat until the goal is achieved**

```
CHATBOT:
─────────────────────────────────────
User: "Book me a flight to Paris"
Bot:  "I can't book flights, but here's 
       info about flights to Paris..."
─────────────────────────────────────

AGENT:
─────────────────────────────────────
User: "Book me the cheapest flight to 
       Paris next week"
Agent: THINKS → "I need to search for flights"
       ACTS   → [Uses flight search tool]
       SEES   → "Found 5 options, cheapest is $450 on Tuesday"
       THINKS → "Should I confirm with the user?"
       ACTS   → "I found the cheapest option: $450 on Tuesday, 
                  Air France. Shall I book it?"
       USER   → "Yes!"
       ACTS   → [Uses booking tool]
       SEES   → "Booking confirmed! Confirmation: AF2847"
       RESPONDS → "✅ Booked! Confirmation #AF2847"
─────────────────────────────────────
```

### Real-Life Analogy

**Chatbot** = A receptionist who answers questions but can't do anything

**Agent** = A personal assistant who:
- Takes instructions
- Makes a plan
- Uses resources (phone, computer, etc.)
- Executes the plan
- Handles problems that come up
- Reports back when done

---

## 📖 Lesson 8.2 — The ReAct Framework (Thought-Action-Observation)

ReAct = **Re**asoning + **Act**ing

This is the core pattern ALL AI agents use:

```
┌─────────────────────────────────────────────────────────┐
│                     REACT LOOP                           │
│                                                          │
│  USER GOAL: "Research top 3 AI companies and write report"
│                                                          │
│  ┌─────────┐                                            │
│  │ THOUGHT │  "I should search for leading AI companies"│
│  └────┬────┘                                            │
│       ↓                                                  │
│  ┌─────────┐                                            │
│  │  ACTION │  → web_search("top AI companies 2024")    │
│  └────┬────┘                                            │
│       ↓                                                  │
│  ┌─────────────┐                                        │
│  │ OBSERVATION │  "OpenAI, Google DeepMind, Anthropic..." │
│  └────┬────────┘                                        │
│       ↓                                                  │
│  ┌─────────┐                                            │
│  │ THOUGHT │  "Now I need details about each company"  │
│  └────┬────┘                                            │
│       ↓                                                  │
│  ┌─────────┐                                            │
│  │  ACTION │  → web_search("OpenAI company details")   │
│  └────┬────┘                                            │
│       ↓                                                  │
│       ... (continues until goal is achieved)            │
│       ↓                                                  │
│  ┌──────────────┐                                       │
│  │ FINAL ANSWER │  Complete report with all 3 companies │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📖 Lesson 8.3 — Building Your First Agent

### The Agent Class

```python
# ============================================================
# FILE: agents/basic_agent.py
# PURPOSE: Build your first AI agent from scratch
# ============================================================

from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import (
    HumanMessage, SystemMessage, ToolMessage, AIMessage
)
from datetime import datetime
import json

# ---- Tools ----
@tool
def web_search(query: str) -> str:
    """Search the web for current information. Use for facts, news, and research."""
    # Mock search results
    results = {
        "openai": "OpenAI is an AI safety company founded in 2015. Created GPT-4, DALL-E, ChatGPT.",
        "anthropic": "Anthropic founded in 2021 by ex-OpenAI researchers. Created Claude AI assistant.",
        "google deepmind": "Google DeepMind merged in 2023. Created Gemini, AlphaFold, AlphaGo.",
        "langchain": "LangChain created by Harrison Chase in 2022. Most popular LLM framework.",
        "python": "Python programming language created by Guido van Rossum. Version 3.12 is current.",
    }
    for key, value in results.items():
        if key in query.lower():
            return f"Search: '{query}'\nResult: {value}"
    return f"Search: '{query}'\nResult: General information found. [Integrate real search API]"

@tool
def calculate(expression: str) -> str:
    """Perform mathematical calculations. Input: math expression like '100 * 0.15 + 50'"""
    try:
        result = eval(expression, {"__builtins__": {}}, {})
        return f"Calculation: {expression} = {result}"
    except Exception as e:
        return f"Error: {e}"

@tool
def save_to_file(filename: str, content: str) -> str:
    """Save content to a text file. Use when asked to create or save a report/document."""
    with open(filename, 'w') as f:
        f.write(content)
    return f"✅ Saved {len(content)} characters to {filename}"

@tool
def get_current_date() -> str:
    """Get today's date and time. Use when the task involves dates."""
    return f"Today: {datetime.now().strftime('%A, %B %d, %Y at %H:%M')}"

# ---- The Agent Class ----
class SimpleAgent:
    """A basic AI agent that can plan and use tools."""
    
    def __init__(self, model_name: str = "llama3.2", tools: list = None, verbose: bool = True):
        self.llm = ChatOllama(model=model_name)
        self.tools = tools or []
        self.tool_map = {t.name: t for t in self.tools}
        self.verbose = verbose
        
        # Bind tools to model
        self.llm_with_tools = self.llm.bind_tools(self.tools)
        
        self.system_prompt = """You are an autonomous AI agent with access to powerful tools.

Your approach:
1. THINK: Understand what needs to be done
2. ACT: Use the right tool(s) 
3. OBSERVE: Check the results
4. REPEAT: Until the task is complete
5. RESPOND: Give a clear final answer

Always use tools when you need:
- Current information (use search)
- Calculations (use calculator)
- Saving results (use file saver)
- Date/time info (use date tool)

Be systematic and thorough. Break complex tasks into steps."""

    def run(self, task: str, max_steps: int = 10) -> str:
        """Execute a task autonomously."""
        if self.verbose:
            print(f"\n🎯 AGENT TASK: {task}")
            print("=" * 60)
        
        messages = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=task)
        ]
        
        step = 0
        while step < max_steps:
            step += 1
            
            if self.verbose:
                print(f"\n📍 AGENT STEP {step}")
            
            # Get agent's response (may include tool calls)
            response = self.llm_with_tools.invoke(messages)
            messages.append(response)
            
            # If no tool calls, agent has finished
            if not response.tool_calls:
                if self.verbose:
                    print(f"\n✅ AGENT FINAL ANSWER:")
                    print(response.content)
                return response.content
            
            # Execute all tool calls
            for tool_call in response.tool_calls:
                tool_name = tool_call["name"]
                tool_args = tool_call["args"]
                
                if self.verbose:
                    print(f"  🔧 Tool: {tool_name}")
                    print(f"     Args: {json.dumps(tool_args, indent=6)}")
                
                if tool_name in self.tool_map:
                    result = self.tool_map[tool_name].invoke(tool_args)
                    
                    if self.verbose:
                        print(f"  📥 Result: {str(result)[:200]}")
                else:
                    result = f"Error: Tool '{tool_name}' not found"
                    if self.verbose:
                        print(f"  ❌ {result}")
                
                messages.append(ToolMessage(
                    content=str(result),
                    tool_call_id=tool_call["id"]
                ))
        
        return "Max steps reached without completing task."

# ---- Create and Test the Agent ----
agent = SimpleAgent(
    model_name="llama3.2",
    tools=[web_search, calculate, save_to_file, get_current_date],
    verbose=True
)

# Test 1: Simple research task
agent.run("What is Anthropic and when was it founded?")

# Test 2: Calculation task
agent.run("If I invest $5,000 per month for 2 years, how much total will I have invested?")

# Test 3: Complex multi-step task
agent.run("""Research the top 2 AI companies (OpenAI and Anthropic), 
           then create a comparison report and save it as 'ai_companies_report.txt'""")
```

---

## 📖 Lesson 8.4 — LangGraph Agents (Production Standard)

For production agents, we use **LangGraph** — it gives us:
- State management
- Proper loops
- Better error handling
- Human-in-the-loop support

```python
# ============================================================
# FILE: agents/langgraph_agent.py
# PURPOSE: Production-grade agent using LangGraph
# ============================================================

# Install: pip install langgraph

from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, BaseMessage
from typing import TypedDict, Annotated, Sequence
import operator

# ---- Define State ----
# State = what the agent "remembers" between steps
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    # Annotated with operator.add means: append new messages, don't overwrite

# ---- Tools ----
@tool
def search(query: str) -> str:
    """Search for information. Use for research and facts."""
    results = {
        "python": "Python: versatile language, great for AI/ML, easy to learn",
        "javascript": "JavaScript: language of the web, runs in browsers and Node.js",
        "ai agent": "AI agents are autonomous systems that can plan and execute tasks",
    }
    for key, value in results.items():
        if key in query.lower():
            return value
    return f"Found information about: {query}"

@tool
def calculator(expression: str) -> str:
    """Calculate math. Input: valid math expression."""
    try:
        result = eval(expression, {"__builtins__": {}}, {})
        return str(result)
    except:
        return "Calculation error"

tools = [search, calculator]

# ---- Build the Agent Graph ----
llm = ChatOllama(model="llama3.2")
llm_with_tools = llm.bind_tools(tools)

def should_continue(state: AgentState) -> str:
    """
    Decide whether to continue (use more tools) or stop.
    This is the routing function — the brain of the control flow.
    """
    last_message = state["messages"][-1]
    
    # If the last AI message has tool calls, continue
    if last_message.tool_calls:
        return "use_tools"
    
    # Otherwise, we're done
    return END

def call_model(state: AgentState) -> dict:
    """
    Call the LLM with current state.
    Returns updated messages.
    """
    system = SystemMessage(content="""You are a helpful AI agent. 
    Use tools when you need to look up information or calculate things.
    Think step by step.""")
    
    # Add system message if not present
    messages = state["messages"]
    if not any(isinstance(m, SystemMessage) for m in messages):
        messages = [system] + list(messages)
    
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

# ---- Build Graph ----
# Create the state graph
graph = StateGraph(AgentState)

# Add nodes
graph.add_node("agent", call_model)      # The LLM thinking step
graph.add_node("tools", ToolNode(tools)) # The tool execution step

# Set entry point
graph.set_entry_point("agent")

# Add conditional edge from agent
graph.add_conditional_edges(
    "agent",          # From this node
    should_continue,  # Use this function to decide
    {
        "use_tools": "tools",  # If "use_tools" → go to tools node
        END: END               # If END → finish
    }
)

# After tools, always go back to agent
graph.add_edge("tools", "agent")

# Compile the graph
app = graph.compile()

# ---- Run the Agent ----
def run_langgraph_agent(question: str):
    """Run the LangGraph agent."""
    print(f"\n🤖 LANGGRAPH AGENT")
    print(f"❓ Question: {question}")
    print("-" * 40)
    
    # Stream shows each step
    for event in app.stream(
        {"messages": [HumanMessage(content=question)]},
        stream_mode="values"
    ):
        # Get the last message
        last_msg = event["messages"][-1]
        
        if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
            for tc in last_msg.tool_calls:
                print(f"🔧 Using tool: {tc['name']}({tc['args']})")
        elif last_msg.type == "tool":
            print(f"📥 Tool result: {last_msg.content[:100]}")
        elif last_msg.type == "ai" and not last_msg.tool_calls:
            print(f"\n✅ ANSWER: {last_msg.content}")

# Test it
run_langgraph_agent("What is Python good for and how many times is 25 * 400?")
run_langgraph_agent("Search for information about AI agents and summarize it")
```

---

## 📖 Lesson 8.5 — Multi-Agent Systems

Sometimes one agent isn't enough. Real production systems use **multiple specialized agents** that work together:

```
                    ┌──────────────────┐
                    │  SUPERVISOR      │
                    │  AGENT           │
                    │  (Orchestrator)  │
                    └──────┬───────────┘
              ┌────────────┼────────────┐
              ↓            ↓            ↓
     ┌────────────┐ ┌───────────┐ ┌──────────────┐
     │ RESEARCH   │ │ CODING    │ │ WRITING      │
     │ AGENT      │ │ AGENT     │ │ AGENT        │
     │            │ │           │ │              │
     │ - Search   │ │ - Python  │ │ - Reports    │
     │ - Analyze  │ │ - Debug   │ │ - Emails     │
     │ - Summarize│ │ - Review  │ │ - Docs       │
     └────────────┘ └───────────┘ └──────────────┘
```

```python
# ============================================================
# FILE: agents/multi_agent.py
# PURPOSE: Simple multi-agent system
# ============================================================

from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOllama(model="llama3.2", temperature=0.3)

# ============================================================
# SPECIALIST AGENTS
# ============================================================

class ResearchAgent:
    """Specialized in research and information gathering."""
    
    def __init__(self):
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert research analyst. 
            You find, verify, and synthesize information accurately.
            Always cite sources and note uncertainties.
            Return structured research findings."""),
            ("human", "{task}")
        ])
        self.chain = self.prompt | llm | StrOutputParser()
    
    def research(self, topic: str) -> str:
        print(f"  🔬 Research Agent: investigating '{topic}'")
        return self.chain.invoke({"task": f"Research and analyze: {topic}"})


class WritingAgent:
    """Specialized in creating well-written content."""
    
    def __init__(self):
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a professional business writer.
            You create clear, engaging, well-structured documents.
            Adapt tone and format to the audience.
            Always produce polished, publication-ready content."""),
            ("human", "{task}")
        ])
        self.chain = self.prompt | llm | StrOutputParser()
    
    def write(self, task: str, research: str = "") -> str:
        print(f"  ✍️ Writing Agent: creating content")
        full_task = task
        if research:
            full_task = f"{task}\n\nBased on this research:\n{research}"
        return self.chain.invoke({"task": full_task})


class ReviewAgent:
    """Specialized in reviewing and improving content."""
    
    def __init__(self):
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a senior editor and fact-checker.
            Review content for accuracy, clarity, and completeness.
            Provide specific, actionable feedback.
            Rate quality on a scale of 1-10."""),
            ("human", "{task}")
        ])
        self.chain = self.prompt | llm | StrOutputParser()
    
    def review(self, content: str) -> str:
        print(f"  📋 Review Agent: checking quality")
        return self.chain.invoke({
            "task": f"Review this content and provide feedback:\n\n{content}"
        })


class SupervisorAgent:
    """Orchestrates other agents to complete complex tasks."""
    
    def __init__(self):
        self.research_agent = ResearchAgent()
        self.writing_agent = WritingAgent()
        self.review_agent = ReviewAgent()
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a project supervisor managing a team of AI agents.
            Your team: Research Agent, Writing Agent, Review Agent.
            Break complex tasks into steps and delegate appropriately.
            Coordinate the team and ensure quality output."""),
            ("human", "{task}")
        ])
        self.chain = self.prompt | llm | StrOutputParser()
    
    def execute(self, task: str) -> str:
        """Execute a complex task using the agent team."""
        print(f"\n👔 SUPERVISOR: Task received: '{task}'")
        print("=" * 60)
        
        # Step 1: Research phase
        print("\n📍 Phase 1: Research")
        research_results = self.research_agent.research(task)
        
        # Step 2: Writing phase
        print("\n📍 Phase 2: Writing")
        draft = self.writing_agent.write(
            f"Write a comprehensive report about: {task}",
            research=research_results
        )
        
        # Step 3: Review phase
        print("\n📍 Phase 3: Review")
        review = self.review_agent.review(draft)
        
        # Step 4: Supervisor compiles final output
        print("\n📍 Phase 4: Final Compilation")
        final = self.chain.invoke({
            "task": f"""Compile the final deliverable for: {task}
            
Research: {research_results[:500]}
Draft: {draft[:500]}
Review feedback: {review[:300]}

Create a polished final summary."""
        })
        
        return {
            "research": research_results,
            "draft": draft,
            "review": review,
            "final": final
        }

# ---- Test the Multi-Agent System ----
supervisor = SupervisorAgent()

result = supervisor.execute("The impact of AI agents on software development jobs")

print("\n" + "="*60)
print("📊 MULTI-AGENT REPORT COMPLETE")
print("="*60)
print("\n🔬 RESEARCH:")
print(result["research"][:400])
print("\n✍️ DRAFT:")
print(result["draft"][:400])
print("\n📋 REVIEW FEEDBACK:")
print(result["review"][:300])
print("\n🎯 FINAL OUTPUT:")
print(result["final"])
```

---

## 🏭 Real Project: AI Coding Agent

```python
# ============================================================
# FILE: agents/projects/coding_agent.py
# PURPOSE: AI agent that writes, reviews, and fixes code
# ============================================================

from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
import subprocess
import ast
import os

llm = ChatOllama(model="llama3.2", temperature=0.2)

@tool
def write_code(filename: str, code: str) -> str:
    """
    Write Python code to a file.
    Use when creating new code files.
    Input: filename (e.g., 'solution.py') and code string
    """
    with open(filename, 'w') as f:
        f.write(code)
    return f"Code written to {filename} ({len(code)} characters)"

@tool
def run_python_code(filename: str) -> str:
    """
    Execute a Python file and return its output.
    Use to test if code works correctly.
    Input: the filename to run
    """
    try:
        result = subprocess.run(
            ["python", filename],
            capture_output=True,
            text=True,
            timeout=10  # 10 second timeout
        )
        if result.returncode == 0:
            return f"✅ Success:\n{result.stdout}"
        else:
            return f"❌ Error:\n{result.stderr}"
    except subprocess.TimeoutExpired:
        return "❌ Timeout: Code took too long to run"
    except FileNotFoundError:
        return f"❌ File not found: {filename}"

@tool
def check_syntax(code: str) -> str:
    """
    Check Python code for syntax errors without running it.
    Use before writing code to verify it's valid.
    Input: Python code string
    """
    try:
        ast.parse(code)
        return "✅ Syntax is valid - no errors found"
    except SyntaxError as e:
        return f"❌ Syntax Error at line {e.lineno}: {e.msg}"

@tool
def read_code_file(filename: str) -> str:
    """
    Read the contents of a code file.
    Use when you need to review existing code.
    Input: filename to read
    """
    try:
        with open(filename, 'r') as f:
            return f"Contents of {filename}:\n```python\n{f.read()}\n```"
    except FileNotFoundError:
        return f"File not found: {filename}"

# ---- The Coding Agent ----
tools = [write_code, run_python_code, check_syntax, read_code_file]
tool_map = {t.name: t for t in tools}

llm_with_tools = llm.bind_tools(tools)

CODING_SYSTEM_PROMPT = """You are an expert Python developer and coding agent.

Your workflow for coding tasks:
1. Understand what code needs to be written
2. Write the code (check syntax first if complex)
3. Save it to a file
4. Run it to verify it works
5. If errors, fix and retry
6. Report the final result

Best practices:
- Write clean, well-commented code
- Include error handling
- Test edge cases
- Follow Python conventions"""

def coding_agent(task: str, max_iterations: int = 8):
    """AI agent that writes and tests code."""
    print(f"\n💻 CODING AGENT ACTIVATED")
    print(f"Task: {task}")
    print("=" * 60)
    
    messages = [
        SystemMessage(content=CODING_SYSTEM_PROMPT),
        HumanMessage(content=task)
    ]
    
    for i in range(max_iterations):
        response = llm_with_tools.invoke(messages)
        messages.append(response)
        
        if not response.tool_calls:
            print(f"\n✅ CODING COMPLETE:\n{response.content}")
            return response.content
        
        print(f"\n📍 Iteration {i+1}:")
        for tc in response.tool_calls:
            print(f"  🔧 {tc['name']}({list(tc['args'].keys())})")
            result = tool_map.get(tc['name'], lambda x: "Tool not found").invoke(tc['args']) if tc['name'] in tool_map else "Tool not found"
            print(f"  → {str(result)[:150]}")
            messages.append(ToolMessage(content=str(result), tool_call_id=tc['id']))
    
    return "Max iterations reached"

# Test the coding agent
coding_agent("Write a Python function that checks if a number is prime, test it with numbers 1-20, and save it as prime_checker.py")
```

---

## ⚠️ Common Agent Mistakes

### Mistake 1: No Max Steps Limit

```python
# ❌ DANGEROUS - Agent can run forever!
while True:
    response = llm.invoke(messages)
    ...

# ✅ Always set a limit
for step in range(10):  # Max 10 steps
    response = llm.invoke(messages)
    if not response.tool_calls:
        break
```

### Mistake 2: Not Handling Tool Errors

```python
# ❌ Agent crashes if tool fails
result = my_tool.invoke(args)

# ✅ Handle errors gracefully
try:
    result = my_tool.invoke(args)
except Exception as e:
    result = f"Tool failed: {str(e)}. Try a different approach."
```

---

## 🧠 Quick Quiz

1. What's the key difference between a chatbot and an agent?
2. What does ReAct stand for?
3. In the ReAct loop, what are the three steps?
4. Why do we set a `max_steps` limit for agents?
5. What is a multi-agent system?
6. What does LangGraph add that simple agents don't have?

---

## 🎯 Mini Challenges

**Challenge 1**: Build a "Personal Task Manager Agent" that can: add tasks, list tasks, mark tasks complete, and give you a daily briefing. Store tasks in a JSON file.

**Challenge 2**: Build a "Data Analysis Agent" with tools: read CSV, calculate statistics, find max/min/average, and generate a summary report.

**Challenge 3**: Design a 2-agent system: Agent 1 = Research Agent (finds information), Agent 2 = Summary Agent (condenses research into key points). Have a Supervisor coordinate them.

---

## ✅ Phase 8 Recap

| Concept | What It Is |
|---------|-----------|
| Agent | Autonomous AI that plans and executes multi-step tasks |
| ReAct | Think → Act → Observe loop |
| Tool Calling | Agent using tools to interact with the world |
| Agent Loop | Repeated cycles until task complete |
| Max Steps | Safety limit to prevent infinite loops |
| LangGraph | Framework for stateful, production-grade agents |
| Multi-Agent | Multiple specialized agents working together |

---

## 🚀 What's Next?

In **Phase 9**, we build **RAG (Retrieval-Augmented Generation)** — teaching AI your own data:
- PDF chatbots
- Company knowledge bases
- Document Q&A systems

> **Go to**: `Phase09_RAG/lesson.md` →

---

*Phase 8 Complete! 🤖 You can now build autonomous AI agents. You're a real AI engineer!*
