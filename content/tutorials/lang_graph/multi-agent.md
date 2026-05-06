# 🤝 Phase 8 — Multi-Agent Systems
### "Building AI Teams That Work Together"

> **Difficulty**: ⭐⭐⭐⭐ Advanced | **Time**: ~120 minutes | **Prerequisites**: Phase 7 Complete

---

## 🎯 What You'll Learn

- ✅ Multi-agent architecture patterns
- ✅ Supervisor pattern (manager + workers)
- ✅ Swarm pattern (peer-to-peer agents)
- ✅ Agent handoffs and message passing
- ✅ Shared state vs private state
- ✅ Build: Content Team, Research Team, Dev Team

---

## 📖 Lesson 8.1 — Why Multiple Agents?

### The Single Agent Limitation

One agent trying to do everything gets:
- **Confused** — too many instructions
- **Inconsistent** — can't switch "modes" cleanly
- **Limited** — one model can't be expert at everything
- **Slow** — can't parallelize work

### The Multi-Agent Solution

```
┌───────────────────────────────────────────────────┐
│                 SINGLE AGENT                      │
│                                                   │
│  One prompt: "You are a researcher AND writer     │
│  AND editor AND publisher AND fact-checker..."    │
│  → Gets confused, inconsistent                    │
└───────────────────────────────────────────────────┘

    vs

┌───────────────────────────────────────────────────┐
│              MULTI-AGENT TEAM                     │
│                                                   │
│  🔬 Research Agent  → expert at finding facts     │
│  ✍️  Writing Agent   → expert at clear writing    │
│  📋 Editor Agent    → expert at improvement       │
│  ✅ QA Agent        → expert at quality checks    │
│                                                   │
│  Each is laser-focused → better results!          │
└───────────────────────────────────────────────────┘
```

---

## 📖 Lesson 8.2 — Pattern 1: Supervisor-Worker Architecture

The most common pattern: one supervisor orchestrates worker agents.

```
USER TASK
    ↓
┌──────────────────┐
│   SUPERVISOR     │  ← Decides what to do next
│   (Orchestrator) │  ← Routes to workers
└──────┬───────────┘
       │
   ┌───┼───┐
   ↓   ↓   ↓
[W1][W2][W3]  ← Specialized workers
       │
  Result back to supervisor
       │
  Task complete → Answer
```

```python
# ============================================================
# FILE: 06_multi_agent/supervisor_pattern.py
# PURPOSE: Supervisor-Worker multi-agent system
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import TypedDict, Annotated, List, Literal, Optional
import operator

llm = ChatOllama(model="llama3.2", temperature=0.3)
parser = StrOutputParser()

# ---- Routing Decision Schema ----
class SupervisorDecision(BaseModel):
    """Supervisor decides which worker to delegate to."""
    next_worker: Literal["researcher", "writer", "editor", "FINISH"] = Field(
        description="Which worker should act next, or FINISH if task is complete"
    )
    reasoning: str = Field(description="Why this worker was chosen")

# ---- Shared State ----
class TeamState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    task: str
    research_notes: Optional[str]
    draft: Optional[str]
    final_content: Optional[str]
    next_step: str
    iteration: int

# ---- Worker Nodes ----
def researcher(state: TeamState) -> dict:
    """Research Agent: gathers information."""
    print("  🔬 Researcher working...")
    
    notes = (
        ChatPromptTemplate.from_messages([
            ("system", "You are an expert researcher. Find key facts, statistics, and insights. Be thorough and accurate."),
            ("human", "Research this topic thoroughly:\n{task}")
        ]) | llm | parser
    ).invoke({"task": state["task"]})
    
    return {
        "research_notes": notes,
        "messages": [AIMessage(content=f"[RESEARCHER] Completed research:\n{notes[:200]}...")]
    }

def writer(state: TeamState) -> dict:
    """Writing Agent: creates content from research."""
    print("  ✍️  Writer working...")
    
    context = f"Research:\n{state.get('research_notes', 'No research yet')}"
    if state.get("draft"):
        context += f"\n\nPrevious draft:\n{state['draft'][:300]}"
    
    draft = (
        ChatPromptTemplate.from_messages([
            ("system", "You are a professional writer. Create engaging, well-structured content."),
            ("human", f"Write content about: {{task}}\n\nContext:\n{context}")
        ]) | llm | parser
    ).invoke({"task": state["task"]})
    
    return {
        "draft": draft,
        "messages": [AIMessage(content=f"[WRITER] Draft created:\n{draft[:200]}...")]
    }

def editor(state: TeamState) -> dict:
    """Editor Agent: improves the draft."""
    print("  📋 Editor working...")
    
    edited = (
        ChatPromptTemplate.from_messages([
            ("system", "You are a senior editor. Improve clarity, fix errors, enhance engagement. Maintain the author's voice."),
            ("human", "Edit and improve this content:\n\n{draft}")
        ]) | llm | parser
    ).invoke({"draft": state.get("draft", "")})
    
    return {
        "final_content": edited,
        "messages": [AIMessage(content=f"[EDITOR] Final version ready:\n{edited[:200]}...")]
    }

# ---- Supervisor Node ----
def supervisor(state: TeamState) -> dict:
    """Supervisor decides what to do next."""
    print("  👔 Supervisor deciding...")
    
    iteration = state.get("iteration", 0)
    
    # Check what's been done and what's needed
    has_research = bool(state.get("research_notes"))
    has_draft = bool(state.get("draft"))
    has_final = bool(state.get("final_content"))
    
    # Simple rule-based supervisor (could use AI for complex decisions)
    if not has_research:
        next_step = "researcher"
        reason = "Need research before writing"
    elif not has_draft:
        next_step = "writer"
        reason = "Research done, need to write draft"
    elif not has_final and iteration < 2:
        next_step = "editor"
        reason = "Draft ready, needs editing"
    else:
        next_step = "FINISH"
        reason = "All steps complete"
    
    print(f"  → Next: {next_step} ({reason})")
    
    return {
        "next_step": next_step,
        "iteration": iteration + 1,
        "messages": [AIMessage(content=f"[SUPERVISOR] Directing: {next_step} — {reason}")]
    }

# ---- Routing ----
def route_supervisor(state: TeamState) -> str:
    next_step = state.get("next_step", "FINISH")
    if next_step == "FINISH":
        return END
    return next_step

# ---- Build Graph ----
graph = StateGraph(TeamState)

graph.add_node("supervisor", supervisor)
graph.add_node("researcher", researcher)
graph.add_node("writer", writer)
graph.add_node("editor", editor)

graph.set_entry_point("supervisor")

graph.add_conditional_edges("supervisor", route_supervisor, {
    "researcher": "researcher",
    "writer": "writer",
    "editor": "editor",
    END: END
})

# All workers report back to supervisor
graph.add_edge("researcher", "supervisor")
graph.add_edge("writer", "supervisor")
graph.add_edge("editor", "supervisor")

app = graph.compile()

# ---- Run the Team ----
def run_content_team(topic: str) -> dict:
    print(f"\n🚀 Content Team: '{topic}'\n")
    print("=" * 60)
    
    result = app.invoke({
        "messages": [HumanMessage(content=f"Create comprehensive content about: {topic}")],
        "task": topic,
        "research_notes": None,
        "draft": None,
        "final_content": None,
        "next_step": "",
        "iteration": 0
    })
    
    print("\n" + "="*60)
    print("📊 TEAM RESULTS:")
    print(f"✅ Iterations: {result['iteration']}")
    print(f"📝 Research: {len(result.get('research_notes', '') or '')} chars")
    print(f"📄 Draft: {len(result.get('draft', '') or '')} chars")
    print(f"🎯 Final: {len(result.get('final_content', '') or '')} chars")
    
    return result

result = run_content_team("The future of AI agents in software development")
print(f"\n📖 FINAL CONTENT (excerpt):")
print(result.get("final_content", "No content")[:500])
```

---

## 📖 Lesson 8.3 — Pattern 2: Agent Handoff (Pass the Baton)

```python
# ============================================================
# FILE: 06_multi_agent/agent_handoff.py
# PURPOSE: Agents that pass work to each other
# ============================================================

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage, ToolMessage
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode
from typing import TypedDict, Annotated, List, Optional, Literal
import operator

llm = ChatOllama(model="llama3.2", temperature=0.3)

# ---- Handoff tools (agents use these to delegate) ----
@tool
def handoff_to_researcher(task: str) -> str:
    """Transfer this task to the Research Agent. Use when research or information is needed."""
    return f"HANDOFF_TO:researcher|TASK:{task}"

@tool
def handoff_to_writer(content_brief: str) -> str:
    """Transfer to the Writing Agent. Use when you have research and need content written."""
    return f"HANDOFF_TO:writer|BRIEF:{content_brief}"

@tool
def handoff_to_reviewer(content: str) -> str:
    """Transfer to the Review Agent. Use when content needs quality review."""
    return f"HANDOFF_TO:reviewer|CONTENT:{content}"

@tool
def complete_task(final_result: str) -> str:
    """Mark task as complete with the final result."""
    return f"COMPLETE:{final_result}"

# ---- State ----
class HandoffState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    current_agent: str
    task: str
    research: Optional[str]
    content: Optional[str]
    status: str

# ---- Agent Factory ----
def make_agent_node(agent_name: str, system_prompt: str, tools: list):
    """Create a specialized agent node."""
    llm_with_tools = llm.bind_tools(tools)
    
    def agent_node(state: HandoffState) -> dict:
        print(f"  🤖 {agent_name} thinking...")
        
        messages = [SystemMessage(content=system_prompt)] + list(state["messages"])
        response = llm_with_tools.invoke(messages)
        
        # Detect handoff from tool call
        next_agent = state["current_agent"]
        if response.tool_calls:
            for tc in response.tool_calls:
                if tc["name"].startswith("handoff_to_"):
                    next_agent = tc["name"].replace("handoff_to_", "")
                    print(f"  → Handing off to: {next_agent}")
                elif tc["name"] == "complete_task":
                    next_agent = "COMPLETE"
        
        return {
            "messages": [response],
            "current_agent": next_agent
        }
    
    agent_node.__name__ = f"{agent_name.lower()}_node"
    return agent_node

# Create specialized agents
triage_agent = make_agent_node(
    "Triage",
    "You are a triage agent. Analyze the task and route to the right specialist. Use handoff tools.",
    [handoff_to_researcher, handoff_to_writer, complete_task]
)

research_agent = make_agent_node(
    "Researcher",
    "You are a research expert. Gather key information, then hand off to writer with your findings.",
    [handoff_to_writer, complete_task]
)

writer_agent = make_agent_node(
    "Writer",
    "You are a professional writer. Create content from research, then hand off to reviewer.",
    [handoff_to_reviewer, complete_task]
)

reviewer_agent = make_agent_node(
    "Reviewer",
    "You are a quality reviewer. Review content and either mark complete or send back for revision.",
    [handoff_to_writer, complete_task]
)

# ---- Tool execution node ----
all_tools = [handoff_to_researcher, handoff_to_writer, handoff_to_reviewer, complete_task]
tool_node = ToolNode(all_tools)

# ---- Routing ----
def route_after_agent(state: HandoffState) -> str:
    """Route based on handoff decision."""
    current = state.get("current_agent", "triage")
    last_msg = state["messages"][-1]
    
    # If agent made tool calls, execute them first
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        return "tools"
    
    if current == "COMPLETE":
        return END
    
    agent_map = {"triage": "triage", "researcher": "researcher",
                  "writer": "writer", "reviewer": "reviewer"}
    return agent_map.get(current, END)

def route_after_tools(state: HandoffState) -> str:
    """After tool execution, go to the designated agent."""
    current = state.get("current_agent", "triage")
    if current == "COMPLETE":
        return END
    
    return current if current in ["triage", "researcher", "writer", "reviewer"] else "triage"

# ---- Build Graph ----
graph = StateGraph(HandoffState)

for name, fn in [("triage", triage_agent), ("researcher", research_agent),
                  ("writer", writer_agent), ("reviewer", reviewer_agent), ("tools", tool_node)]:
    graph.add_node(name, fn)

graph.set_entry_point("triage")

for agent in ["triage", "researcher", "writer", "reviewer"]:
    graph.add_conditional_edges(agent, route_after_agent, {
        "tools": "tools",
        "triage": "triage", "researcher": "researcher",
        "writer": "writer", "reviewer": "reviewer",
        END: END
    })

graph.add_conditional_edges("tools", route_after_tools, {
    "triage": "triage", "researcher": "researcher",
    "writer": "writer", "reviewer": "reviewer",
    END: END
})

app = graph.compile()

print("🤝 Agent Handoff System\n")
result = app.invoke({
    "messages": [HumanMessage(content="Write a 3-paragraph intro about machine learning for beginners")],
    "current_agent": "triage",
    "task": "Write intro about machine learning",
    "research": None, "content": None, "status": "active"
})

print(f"\n✅ Complete! Final message:")
print(result["messages"][-1].content[:300])
```

---

## 📖 Lesson 8.4 — Pattern 3: Parallel Agent Execution

```python
# ============================================================
# FILE: 06_multi_agent/parallel_agents.py
# PURPOSE: Run multiple agents simultaneously
# ============================================================

import asyncio
from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from typing import TypedDict, Annotated, List, Optional
import operator

llm = ChatOllama(model="llama3.2", temperature=0.3)
parser = StrOutputParser()

class ParallelState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    topic: str
    technical_analysis: Optional[str]
    business_analysis: Optional[str]
    risk_analysis: Optional[str]
    combined_report: Optional[str]

# These three agents run SEQUENTIALLY in this simple version
# For true parallel execution, use asyncio.gather (shown below)

async def run_parallel_analysis(topic: str) -> dict:
    """Run all analyses concurrently using async."""
    
    make_chain = lambda system: (
        ChatPromptTemplate.from_messages([
            ("system", system),
            ("human", "Analyze: {topic}")
        ]) | llm | parser
    )
    
    tech_chain = make_chain("You are a technical expert. Analyze technical aspects, feasibility, and implementation.")
    biz_chain = make_chain("You are a business analyst. Analyze market opportunity, revenue potential, and business model.")
    risk_chain = make_chain("You are a risk analyst. Identify key risks, mitigation strategies, and failure modes.")
    
    print(f"🔄 Running 3 parallel analyses on: {topic}")
    
    # Run ALL THREE simultaneously!
    tech, biz, risk = await asyncio.gather(
        tech_chain.ainvoke({"topic": topic}),
        biz_chain.ainvoke({"topic": topic}),
        risk_chain.ainvoke({"topic": topic})
    )
    
    print("✅ All parallel analyses complete!")
    return {
        "technical_analysis": tech,
        "business_analysis": biz,
        "risk_analysis": risk
    }

async def synthesize_report(analyses: dict, topic: str) -> str:
    """Combine all analyses into a unified report."""
    return (
        ChatPromptTemplate.from_messages([
            ("system", "You are a management consultant. Synthesize these analyses into an executive summary."),
            ("human", """Topic: {topic}

TECHNICAL: {technical}
BUSINESS: {business}  
RISK: {risk}

Create a concise executive summary (3 paragraphs).""")
        ]) | llm | parser
    ).invoke({
        "topic": topic,
        "technical": analyses["technical_analysis"][:300],
        "business": analyses["business_analysis"][:300],
        "risk": analyses["risk_analysis"][:300]
    })

async def full_analysis(topic: str):
    """Complete parallel analysis workflow."""
    import time
    start = time.time()
    
    # Step 1: Parallel analyses
    analyses = await run_parallel_analysis(topic)
    
    # Step 2: Synthesize
    print("📊 Synthesizing report...")
    report = await synthesize_report(analyses, topic)
    
    elapsed = time.time() - start
    print(f"⏱️  Total time: {elapsed:.2f}s (vs ~{elapsed*3:.1f}s sequential)")
    
    return {**analyses, "combined_report": report}

# Run the parallel system
result = asyncio.run(full_analysis("AI-powered customer service automation"))

print("\n📋 PARALLEL ANALYSIS REPORT")
print("="*60)
print("🔧 Technical (excerpt):", result["technical_analysis"][:150])
print("💼 Business (excerpt):", result["business_analysis"][:150])
print("⚠️  Risk (excerpt):", result["risk_analysis"][:150])
print("\n🎯 COMBINED REPORT:")
print(result["combined_report"][:500])
```

---

## ⚠️ Common Multi-Agent Mistakes

### Mistake 1: Circular Dependencies Without Exit

```python
# ❌ Writer → Editor → Writer → Editor (infinite loop!)
graph.add_edge("writer", "editor")
graph.add_edge("editor", "writer")  # Loops forever!

# ✅ Use iteration counter to break loops
def route_editor(state):
    if state.get("iterations", 0) >= 2 or state.get("approved"):
        return END
    return "writer"
```

### Mistake 2: State Conflicts Between Agents

```python
# ❌ Two agents both write to "result" — last one wins, data lost!
agent_a → {"result": "A's answer"}
agent_b → {"result": "B's answer"}  # Overwrites A!

# ✅ Use separate keys per agent
agent_a → {"research_result": "A's research"}
agent_b → {"writing_result": "B's content"}
```

---

## 🎯 Mini Challenges

**Challenge 1**: Build a "Code Review Team" — Writer Agent writes a function, Reviewer Agent finds bugs, Fixer Agent fixes them. Loop until no bugs found.

**Challenge 2**: Create a "News Analysis Team" — Research Agent finds article facts, Bias Detector Agent identifies bias, Summary Agent creates neutral summary.

**Challenge 3**: Build a "Product Launch Team" — 4 parallel agents: Market Researcher, Competitor Analyzer, Price Strategist, Launch Planner — then Synthesizer combines all inputs.

---

## ✅ Phase 8 Recap

| Pattern | When To Use |
|---------|------------|
| Supervisor-Worker | Complex tasks needing coordination |
| Agent Handoff | Sequential specialist pipeline |
| Parallel Agents | Independent tasks, speed critical |
| Swarm | Emergent behavior, peer collaboration |

---

## 🚀 What's Next?

**Phase 9** — Advanced State Patterns: complex state designs, subgraphs, state channels, and enterprise-grade workflow patterns.

> **Go to**: `Phase09_Advanced_State/lesson.md` →

---

*Phase 8 Complete! 🤝 You can orchestrate AI teams. This is advanced AI engineering!*
