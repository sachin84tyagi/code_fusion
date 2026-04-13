# 🤖 Agentic AI Full Stack Developer Course
## Chapter 12: Capstone Project — Build a Production AI Agent from Scratch

> **Professor's Note:** You made it. Twelve chapters. ReAct patterns, memory systems, multi-agent orchestration, streaming UIs, safety guardrails, production deployment — you've built every piece individually. Now we stop teaching you pieces. We build the whole machine. Today you ship a **portfolio-ready, production-grade, multi-agent AI platform** called **ARIA** (Adaptive Research Intelligence Architecture). By the end of this chapter, you will have: a working multi-agent backend, a stunning React UI with real-time streaming, persistent memory, safety guardrails, cost tracking, Docker, and a deployment script. The kind of thing you put on your GitHub, link in your resume, and demo in job interviews while the interviewer's jaw slowly drops. Let's build something real. 🏗️🔥

---

```
╔══════════════════════════════════════════════════════════════╗
║  🎓 ARIA — Adaptive Research Intelligence Architecture       ║
║  The Capstone Project                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  What you'll build:                                          ║
║  A multi-agent AI research platform where users submit       ║
║  complex research tasks and a team of specialized agents     ║
║  collaborate in real-time to produce comprehensive reports.  ║
║                                                              ║
║  Agent Team:                                                 ║
║  • Orchestrator  — decomposes tasks, routes to experts       ║
║  • Researcher    — web search, news, academic abstracts      ║
║  • Analyst       — data synthesis, pattern identification    ║
║  • Writer        — report generation, structured formatting  ║
║  • Safety Guard  — validates inputs and outputs              ║
║                                                              ║
║  Stack:                                                      ║
║  Backend:  FastAPI + Python (multi-agent + SSE streaming)    ║
║  Frontend: React + Vite (live agent activity panel)          ║
║  Memory:   Redis (sessions) + ChromaDB (long-term RAG)       ║
║  Safety:   Input validator + output guardrails               ║
║  Deploy:   Docker Compose (local) + GCP Cloud Run (prod)     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 📋 Table of Contents

1. [System Architecture — The Full Picture](#1-system-architecture--the-full-picture)
2. [Project Setup — File Structure](#2-project-setup--file-structure)
3. [Phase 1: The Multi-Agent Backend](#3-phase-1-the-multi-agent-backend)
   - 3a. Agent Base Classes
   - 3b. Specialized Worker Agents
   - 3c. Orchestrator Agent
   - 3d. Tool Registry
   - 3e. Memory System
4. [Phase 2: FastAPI Streaming Backend](#4-phase-2-fastapi-streaming-backend)
   - 4a. Main Application
   - 4b. Session Management
   - 4c. Safety Middleware
5. [Phase 3: React Frontend](#5-phase-3-react-frontend)
   - 5a. App Shell and Routing
   - 5b. Research Dashboard Component
   - 5c. Live Agent Activity Panel
   - 5d. Report Viewer Component
6. [Phase 4: Infrastructure](#6-phase-4-infrastructure)
   - 6a. Docker Compose
   - 6b. Production Deployment
7. [Phase 5: Putting it All Together — Demo Runs](#7-phase-5-putting-it-all-together--demo-runs)
8. [Course Completion Checklist](#8-course-completion-checklist)

---

## 1. System Architecture — The Full Picture

```
ARIA — FULL SYSTEM ARCHITECTURE
════════════════════════════════════════════════════════════════════════

  BROWSER                            SERVER
  ┌──────────────────────────────┐   ┌──────────────────────────────────────┐
  │   REACT FRONTEND (Vite)      │   │   FASTAPI BACKEND                    │
  │                              │   │                                      │
  │  ┌─────────────────────────┐ │   │  ┌─────────────────────────────────┐ │
  │  │  Research Dashboard     │ │   │  │  API Routes                     │ │
  │  │  • Task input form      │◄├───┤  │  POST /research    (start task) │ │
  │  │  • History sidebar      │ │   │  │  GET  /stream/{id} (SSE stream) │ │
  │  └────────────┬────────────┘ │   │  │  GET  /report/{id} (get result) │ │
  │               │              │   │  │  GET  /sessions    (history)    │ │
  │  ┌────────────▼────────────┐ │   │  └────────────┬────────────────────┘ │
  │  │  Live Activity Panel    │ │   │               │                      │
  │  │  • Agent status badges  │◄├────SSE────────────┤   ┌──────────────────┐│
  │  │  • Streaming thoughts   │ │   │               │   │ ORCHESTRATOR     ││
  │  │  • Tool call log        │ │   │               ├──►│ AGENT            ││
  │  └────────────┬────────────┘ │   │               │   │ │                ││
  │               │              │   │               │   │ ├──►RESEARCHER   ││
  │  ┌────────────▼────────────┐ │   │               │   │ ├──►ANALYST      ││
  │  │  Report Viewer          │◄├───┤               │   │ └──►WRITER       ││
  │  │  • Markdown rendered    │ │   │               │   └──────────────────┘│
  │  │  • Export PDF/MD        │ │   │               │                      │
  │  └─────────────────────────┘ │   │  MEMORY LAYER │                      │
  └──────────────────────────────┘   │  ┌────────────▼────────────────────┐ │
                                     │  │ Redis (sessions + queues)       │ │
                                     │  │ ChromaDB (vector long-term mem) │ │
                                     │  └─────────────────────────────────┘ │
                                     │                                      │
                                     │  EXTERNAL APIs                       │
                                     │  ┌─────────────────────────────────┐ │
                                     │  │ OpenAI API  │ Tavily Search API │ │
                                     │  └─────────────────────────────────┘ │
                                     └──────────────────────────────────────┘


  THE RESEARCH FLOW (what happens when user submits a task):
  ────────────────────────────────────────────────────────────────────────

  User: "Research the current state of quantum computing and
         write a report on its business implications"
         │
         ▼
  [1] Safety Guard validates input (is it safe? on-topic?)
         │
         ▼
  [2] Orchestrator decomposes task:
         • Subtask A: Researcher gets recent news + papers
         • Subtask B: Analyst identifies key trends
         • Subtask C: Writer produces structured report
         SSE: each thought/action streams to the UI
         │
         ▼
  [3] Researcher runs tools in parallel:
         • web_search("quantum computing 2024 breakthroughs")
         • web_search("quantum computing business applications")
         • news_search("IBM Google quantum milestone")
         Results cached in Redis for this session
         │
         ▼
  [4] Analyst synthesizes:
         • Retrieves similar past analyses from ChromaDB (RAG)
         • Identifies 3 key themes across all search results
         • Flags contradictions and knowledge gaps
         │
         ▼
  [5] Writer produces:
         • Structured Markdown report with sections
         • Executive summary first
         • Data tables and key statistics
         SSE: streams each section as it's written
         │
         ▼
  [6] Output guardrails validate final report
  [7] Report stored in DB + ChromaDB (future RAG retrieval)
  [8] Frontend renders the streamed report beautifully
```

---

## 2. Project Setup — File Structure

```bash
# =========================================================
# Run these commands to set up the project:
# =========================================================

# Create project directory
mkdir aria-agent && cd aria-agent

# Backend (Python)
mkdir -p backend/{agents,tools,memory,safety,api}
touch backend/main.py backend/config.py backend/requirements.txt
touch backend/agents/{__init__,base,orchestrator,researcher,analyst,writer,safety_guard}.py
touch backend/tools/{__init__,registry,web_search,news,calculator}.py
touch backend/memory/{__init__,session,vector_store}.py
touch backend/safety/{__init__,input_validator,output_guard}.py
touch backend/api/{__init__,routes,events}.py

# Frontend (React + Vite)
cd frontend
npm create vite@latest . -- --template react
npm install

# Infrastructure
mkdir -p infra/{docker,gcp}
touch docker-compose.yml Dockerfile .env.example
```

```
PROJECT STRUCTURE:
════════════════════════════════════════════════════════════
aria-agent/
├── backend/
│   ├── main.py                ← FastAPI app entry point
│   ├── config.py              ← Pydantic settings
│   ├── requirements.txt       ← pinned deps
│   ├── agents/
│   │   ├── base.py            ← BaseAgent, AgentEvent, EventType
│   │   ├── orchestrator.py    ← task decomposition + routing
│   │   ├── researcher.py      ← web search + news tools
│   │   ├── analyst.py         ← synthesis + RAG
│   │   ├── writer.py          ← report generation
│   │   └── safety_guard.py    ← input/output validation
│   ├── tools/
│   │   ├── registry.py        ← ToolRegistry (from Ch.3)
│   │   ├── web_search.py      ← Tavily API wrapper
│   │   ├── news.py            ← news aggregation
│   │   └── calculator.py      ← safe math evaluator
│   ├── memory/
│   │   ├── session.py         ← Redis session store
│   │   └── vector_store.py    ← ChromaDB long-term memory
│   ├── safety/
│   │   ├── input_validator.py ← Ch.10 input validation
│   │   └── output_guard.py    ← Ch.10 output guardrails
│   └── api/
│       ├── routes.py          ← all API endpoints
│       └── events.py          ← SSE event streaming
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── Dashboard.jsx      ← main research interface
│   │   │   ├── TaskInput.jsx      ← submit research tasks
│   │   │   ├── AgentPanel.jsx     ← live agent activity
│   │   │   ├── ReportViewer.jsx   ← rendered report
│   │   │   └── HistorySidebar.jsx ← past research sessions
│   │   └── hooks/
│   │       └── useAgentStream.js  ← SSE streaming hook
│   ├── index.html
│   └── package.json
├── docker-compose.yml         ← local dev: backend + redis + chroma
├── Dockerfile                 ← production backend image
└── .env.example               ← required environment variables
```

---

## 3. Phase 1: The Multi-Agent Backend

### 3a. Agent Base Classes

```python
# =========================================================
# FILE: backend/agents/base.py
# Foundation: AgentEvent, EventType, BaseAgent.
# Every agent in ARIA inherits from BaseAgent.
# =========================================================

import asyncio
import time
import uuid
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import AsyncGenerator, Optional, Any

import structlog

log = structlog.get_logger()


class EventType(str, Enum):
    """
    Events that agents emit during execution.
    The frontend listens for these via SSE and renders them in real-time.

    THOUGHT    → agent's internal reasoning (shown in "Thinking..." panel)
    TOOL_CALL  → agent is calling a tool (shown with spinner + tool name)
    TOOL_RESULT→ tool returned a result (shown collapsed, expandable)
    PROGRESS   → quantified progress update (updates progress bar)
    CONTENT    → streaming content/report (rendered in report panel)
    ERROR      → something went wrong (shown in red)
    DONE       → agent completed its subtask (badge turns green)
    HANDOFF    → orchestrator passing work to a specialist
    """
    THOUGHT     = "thought"
    TOOL_CALL   = "tool_call"
    TOOL_RESULT = "tool_result"
    PROGRESS    = "progress"
    CONTENT     = "content"
    ERROR       = "error"
    DONE        = "done"
    HANDOFF     = "handoff"


@dataclass
class AgentEvent:
    """
    A single event emitted by an agent.
    Serialized to JSON and sent via SSE to the frontend.

    The frontend receives a stream of these events and builds
    the live activity panel from them as they arrive.
    """
    event_type:  EventType
    agent_name:  str
    content:     str
    metadata:    dict          = field(default_factory=dict)
    timestamp:   float         = field(default_factory=time.time)
    event_id:    str           = field(default_factory=lambda: uuid.uuid4().hex[:8])

    def to_sse(self) -> str:
        """Format as Server-Sent Event string."""
        import json
        data = json.dumps({
            "type":      self.event_type.value,
            "agent":     self.agent_name,
            "content":   self.content,
            "metadata":  self.metadata,
            "ts":        self.timestamp,
            "id":        self.event_id,
        })
        return f"data: {data}\n\n"


@dataclass
class AgentResult:
    """Final result from an agent after completing its task."""
    agent_name:  str
    output:      str           # the main content produced
    success:     bool
    metadata:    dict          = field(default_factory=dict)
    error:       Optional[str] = None
    tokens_used: int           = 0
    duration_s:  float         = 0.0


class BaseAgent(ABC):
    """
    Base class for all ARIA agents.

    Every agent:
    1. Has a name and a system prompt that defines its role
    2. Emits AgentEvents as it works (for streaming to UI)
    3. Has access to a shared tool registry and memory system
    4. Returns an AgentResult when done

    Subclasses override the `run()` method with their specific logic.
    They use `self.emit()` to push events to the shared event queue.
    """

    def __init__(
        self,
        name:         str,
        system_prompt: str,
        model:        str = "gpt-4o-mini",
    ):
        self.name          = name
        self.system_prompt = system_prompt
        self.model         = model
        self._event_queue: Optional[asyncio.Queue] = None
        self._tools        = {}      # populated by orchestrator
        self._memory       = None    # populated by orchestrator

        # Import here to avoid circular dependencies at module load time
        from openai import AsyncOpenAI
        import os
        self.client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

        log.info("agent_initialized", agent=self.name, model=self.model)

    def attach_queue(self, queue: asyncio.Queue) -> None:
        """Attach the shared event queue. Called by orchestrator."""
        self._event_queue = queue

    def attach_tools(self, tools: dict) -> None:
        """Attach available tools. Called by orchestrator."""
        self._tools = tools

    def attach_memory(self, memory) -> None:
        """Attach the memory system. Called by orchestrator."""
        self._memory = memory

    async def emit(
        self,
        event_type: EventType,
        content:    str,
        metadata:   dict = None,
    ) -> None:
        """
        Emit an event to the shared queue.
        The SSE endpoint reads from this queue and forwards to the browser.

        This is the mechanism that makes everything appear live in the UI.
        Every agent.emit() call = one SSE event = one UI update.
        """
        if self._event_queue is None:
            return

        event = AgentEvent(
            event_type = event_type,
            agent_name = self.name,
            content    = content,
            metadata   = metadata or {},
        )
        await self._event_queue.put(event)

    async def call_llm(
        self,
        messages:   list[dict],
        stream:     bool   = False,
        max_tokens: int    = 2000,
        json_mode:  bool   = False,
    ) -> str:
        """
        Wrapper around the OpenAI API.
        Handles streaming vs non-streaming, JSON mode, and error logging.
        """
        kwargs = {
            "model":      self.model,
            "messages":   messages,
            "max_tokens": max_tokens,
        }
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}

        if stream:
            # Streaming: emit each chunk as a CONTENT event
            full_content = ""
            async for chunk in await self.client.chat.completions.create(
                **kwargs, stream=True
            ):
                delta = chunk.choices[0].delta.content or ""
                if delta:
                    full_content += delta
                    await self.emit(EventType.CONTENT, delta)
            return full_content
        else:
            resp = await self.client.chat.completions.create(**kwargs)
            return resp.choices[0].message.content.strip()

    async def use_tool(self, tool_name: str, **kwargs) -> str:
        """
        Call a tool by name, emitting events for the UI.
        Shows as an animated tool call in the agent activity panel.
        """
        await self.emit(
            EventType.TOOL_CALL,
            f"Calling tool: `{tool_name}`",
            metadata={"tool": tool_name, "args": kwargs},
        )

        tool_fn = self._tools.get(tool_name)
        if not tool_fn:
            error = f"Tool '{tool_name}' not found"
            await self.emit(EventType.ERROR, error)
            return error

        try:
            start  = time.monotonic()
            result = await tool_fn(**kwargs)
            elapsed = round(time.monotonic() - start, 2)

            await self.emit(
                EventType.TOOL_RESULT,
                str(result)[:500],    # truncate long results for display
                metadata={"tool": tool_name, "duration_s": elapsed},
            )
            return result

        except Exception as e:
            error = f"Tool error: {e}"
            await self.emit(EventType.ERROR, error)
            return error

    @abstractmethod
    async def run(self, task: str, context: dict = None) -> AgentResult:
        """
        Execute the agent's task.
        Subclasses implement the specific logic here.

        Args:
            task:    Natural language description of what to do
            context: Shared context dict (can read AND write to this)

        Returns:
            AgentResult with the output and metadata
        """
        ...
```

### 3b. Specialized Worker Agents

```python
# =========================================================
# FILE: backend/agents/researcher.py
# The Researcher: finds information using web search tools.
# Google it, but smarter. Returns structured research notes.
# =========================================================

import json
import time
from agents.base import BaseAgent, AgentResult, EventType


class ResearcherAgent(BaseAgent):
    """
    Specialist in information gathering.

    Given a research topic, the Researcher:
    1. Breaks it into 3-5 focused search queries
    2. Executes searches in parallel (for speed)
    3. Deduplicates and ranks results by relevance
    4. Returns structured research notes

    Uses: web_search tool, news_search tool
    Produces: dict of {"sources": [...], "notes": "...", "gaps": [...]}
    """

    def __init__(self):
        super().__init__(
            name          = "Researcher",
            system_prompt = """You are an expert research agent. Your job is to gather
comprehensive, accurate information on any topic.

When given a research task:
1. Think of 3-5 specific, focused search queries that will get the best results
2. Execute those searches using your tools
3. Synthesize the results into clear research notes
4. Identify what important information might still be missing

Output your research notes in this JSON format:
{
  "topic": "what you researched",
  "key_findings": ["finding 1", "finding 2", ...],
  "sources": [{"title": "...", "url": "...", "snippet": "..."}],
  "data_points": ["specific stats, dates, numbers"],
  "knowledge_gaps": ["what we don't know yet"],
  "suggested_follow_up": ["additional queries that might help"]
}""",
            model = "gpt-4o-mini",    # fast model for search query generation
        )

    async def run(self, task: str, context: dict = None) -> AgentResult:
        context = context or {}
        start   = time.monotonic()

        await self.emit(EventType.THOUGHT,
            f"Analyzing research task: '{task[:100]}...'\nPlanning search strategy.")

        # ── Step 1: Generate search queries ──────────────
        await self.emit(EventType.THOUGHT, "Generating optimal search queries...")

        queries_raw = await self.call_llm([
            {"role": "system", "content": self.system_prompt},
            {"role": "user",   "content": f"""Generate 4 focused search queries for this task:
{task}

Return JSON: {{"queries": ["query1", "query2", "query3", "query4"]}}"""},
        ], json_mode=True)

        try:
            queries_data = json.loads(queries_raw)
            queries      = queries_data.get("queries", [task])[:4]
        except json.JSONDecodeError:
            queries = [task]

        await self.emit(EventType.THOUGHT,
            f"Generated {len(queries)} search queries:\n" +
            "\n".join(f"  • {q}" for q in queries))

        # ── Step 2: Execute searches ──────────────────────
        all_results = []
        for query in queries:
            result = await self.use_tool("web_search", query=query, max_results=3)
            all_results.append({"query": query, "results": result})

        # Also search news for recent developments
        news_result = await self.use_tool("news_search",
                                          query=queries[0],
                                          max_results=3)
        all_results.append({"query": f"[NEWS] {queries[0]}", "results": news_result})

        # ── Step 3: Synthesize findings ───────────────────
        await self.emit(EventType.THOUGHT,
            "Search complete. Synthesizing findings into research notes...")

        synthesis_prompt = f"""You ran these searches for the task: "{task}"

Search results:
{json.dumps(all_results, indent=2)[:8000]}

Synthesize these into structured research notes. Be specific — include actual data, dates, names.
Return valid JSON matching the format in your system prompt."""

        synthesis = await self.call_llm([
            {"role": "system", "content": self.system_prompt},
            {"role": "user",   "content": synthesis_prompt},
        ], json_mode=True)

        try:
            research_notes = json.loads(synthesis)
        except json.JSONDecodeError:
            research_notes = {"key_findings": [synthesis], "sources": [], "gaps": []}

        # Store in shared context for other agents to use
        context["research_notes"] = research_notes
        context["raw_results"]    = all_results

        duration = round(time.monotonic() - start, 1)
        findings_count = len(research_notes.get("key_findings", []))

        await self.emit(EventType.DONE,
            f"Research complete in {duration}s — found {findings_count} key findings",
            metadata={"duration_s": duration, "findings": findings_count})

        return AgentResult(
            agent_name = self.name,
            output     = json.dumps(research_notes, indent=2),
            success    = True,
            metadata   = {"queries_run": len(queries), "duration_s": duration},
            duration_s = duration,
        )
```

```python
# =========================================================
# FILE: backend/agents/analyst.py
# The Analyst: synthesizes research, finds patterns, uses RAG.
# Takes raw research notes → structured analysis with insights.
# =========================================================

import json
import time
from agents.base import BaseAgent, AgentResult, EventType


class AnalystAgent(BaseAgent):
    """
    Specialist in data synthesis and pattern recognition.

    Given research notes from the Researcher, the Analyst:
    1. Retrieves relevant past analyses from ChromaDB (RAG)
    2. Identifies key themes and patterns across all data
    3. Flags contradictions and uncertainties
    4. Produces structured analytical insights

    Uses: ChromaDB memory (RAG), no external tools needed
    Produces: dict of themes, insights, data table, and sentiment
    """

    def __init__(self):
        super().__init__(
            name          = "Analyst",
            system_prompt = """You are a senior research analyst. Your specialty is
finding patterns, synthesizing complex information, and producing clear analytical insights.

When given research notes, you:
1. Identify 3-5 major themes or trends
2. Note any contradictions or conflicting data points
3. Assess the confidence level in each finding
4. Structure insights for a business audience

Format your analysis as JSON:
{
  "executive_summary": "2-3 sentence summary",
  "themes": [
    {
      "name": "Theme name",
      "description": "What this theme means",
      "evidence": ["evidence 1", "evidence 2"],
      "confidence": "high|medium|low",
      "business_impact": "why this matters to businesses"
    }
  ],
  "key_statistics": [{"stat": "...", "source": "...", "significance": "..."}],
  "contradictions": ["any conflicting data points found"],
  "overall_sentiment": "positive|neutral|negative|mixed",
  "confidence_level": "high|medium|low",
  "caveats": ["important caveats or limitations"]
}""",
            model = "gpt-4o",    # use stronger model for analysis
        )

    async def run(self, task: str, context: dict = None) -> AgentResult:
        context = context or {}
        start   = time.monotonic()

        research_notes = context.get("research_notes", {})
        if not research_notes:
            await self.emit(EventType.ERROR, "No research notes found in context.")
            return AgentResult(agent_name=self.name, output="",
                              success=False, error="No research notes available")

        await self.emit(EventType.THOUGHT,
            "Received research notes. Checking memory for relevant past analyses...")

        # ── Step 1: RAG — retrieve past similar analyses ──
        past_context = ""
        if self._memory:
            try:
                past_results = await self._memory.search(
                    query     = task,
                    n_results = 3,
                )
                if past_results:
                    past_context = "Relevant past analyses:\n" + \
                                   "\n---\n".join(r["content"] for r in past_results)
                    await self.emit(EventType.THOUGHT,
                        f"Found {len(past_results)} relevant past analyses in memory. "
                        "Incorporating into analysis...")
                else:
                    await self.emit(EventType.THOUGHT,
                        "No relevant past analyses found. Starting fresh.")
            except Exception as e:
                await self.emit(EventType.THOUGHT, f"Memory search skipped: {e}")

        # ── Step 2: Generate analysis ─────────────────────
        await self.emit(EventType.THOUGHT,
            "Identifying key themes and patterns across all research findings...")

        analysis_prompt = f"""Task: {task}

Research Notes (from Researcher agent):
{json.dumps(research_notes, indent=2)[:6000]}

{past_context}

Analyze this research and produce structured insights in the JSON format from your system prompt.
Be specific. Use actual data points from the research. Assess confidence honestly."""

        analysis_raw = await self.call_llm([
            {"role": "system", "content": self.system_prompt},
            {"role": "user",   "content": analysis_prompt},
        ], json_mode=True)

        try:
            analysis = json.loads(analysis_raw)
        except json.JSONDecodeError:
            analysis = {"executive_summary": analysis_raw, "themes": []}

        context["analysis"] = analysis

        # ── Step 3: Store this analysis in memory ─────────
        if self._memory:
            try:
                await self._memory.store(
                    content  = json.dumps(analysis),
                    metadata = {"type": "analysis", "task": task[:200]},
                )
                await self.emit(EventType.THOUGHT,
                    "Analysis stored in long-term memory for future reference.")
            except Exception as e:
                log.warning("memory_store_failed", error=str(e))

        duration = round(time.monotonic() - start, 1)
        themes   = len(analysis.get("themes", []))

        await self.emit(EventType.DONE,
            f"Analysis complete in {duration}s — identified {themes} key themes",
            metadata={"themes": themes, "duration_s": duration,
                      "sentiment": analysis.get("overall_sentiment", "unknown")})

        return AgentResult(
            agent_name = self.name,
            output     = json.dumps(analysis, indent=2),
            success    = True,
            metadata   = {"themes_found": themes, "sentiment": analysis.get("overall_sentiment")},
            duration_s = duration,
        )
```

```python
# =========================================================
# FILE: backend/agents/writer.py
# The Writer: turns analysis into a polished, readable report.
# Streams the report in real-time so users see it being written.
# =========================================================

import json
import time
import re
from agents.base import BaseAgent, AgentResult, EventType


class WriterAgent(BaseAgent):
    """
    Specialist in content creation and report writing.

    Given analysis from the Analyst, the Writer:
    1. Plans the report structure (sections)
    2. Writes each section progressively (STREAMS to UI)
    3. Adds executive summary, data tables, and conclusions
    4. Formats in clean Markdown

    Key feature: streams the report as it's written.
    Users see words appearing in real-time — very satisfying.
    """

    def __init__(self):
        super().__init__(
            name          = "Writer",
            system_prompt = """You are an expert technical writer specializing in research reports.
Your reports are:
- Clear and scannable (headers, bullets, tables where appropriate)
- Well-structured: Executive Summary → Key Findings → Deep Dive → Implications → Conclusion
- Evidence-based: every claim tied to a source or data point
- Business-oriented: "so what?" is always answered
- Written in Markdown format (render nicely in the UI)

Length: 800-1500 words. Comprehensive but not padded.""",
            model = "gpt-4o",    # best model for writing quality
        )

    async def run(self, task: str, context: dict = None) -> AgentResult:
        context  = context or {}
        start    = time.monotonic()

        research = context.get("research_notes", {})
        analysis = context.get("analysis", {})

        await self.emit(EventType.THOUGHT,
            "Planning report structure based on research and analysis...")

        # ── Step 1: Plan report outline ───────────────────
        outline_prompt = f"""Plan a structured research report for this task: {task}

Available research: {json.dumps(research.get("key_findings", [])[:5], indent=2)}
Key themes: {json.dumps([t.get("name","") for t in analysis.get("themes", [])], indent=2)}
Executive summary: {analysis.get("executive_summary", "")}

Return the report structure as JSON:
{{
  "title": "Report title",
  "sections": [
    {{"heading": "Executive Summary", "key_points": ["point1", "point2"]}},
    {{"heading": "Section Name", "key_points": ["point1", "point2"]}}
  ]
}}"""

        outline_raw = await self.call_llm([
            {"role": "system", "content": "You are a report planner. Return clean JSON."},
            {"role": "user",   "content": outline_prompt},
        ], json_mode=True)

        try:
            outline  = json.loads(outline_raw)
            sections = outline.get("sections", [])
            title    = outline.get("title", f"Research Report: {task[:80]}")
        except json.JSONDecodeError:
            title    = f"Research Report: {task[:80]}"
            sections = [{"heading": "Findings", "key_points": []}]

        await self.emit(EventType.THOUGHT,
            f"Report outline:\n" + "\n".join(f"  • {s['heading']}" for s in sections))

        # ── Step 2: Write the full report (streaming) ─────
        await self.emit(EventType.THOUGHT,
            "Writing report... (you'll see it appear in real-time below)")

        full_report = f"# {title}\n\n"
        await self.emit(EventType.CONTENT, f"# {title}\n\n")

        report_prompt = f"""Write a comprehensive research report.

TASK: {task}

RESEARCH FINDINGS:
{json.dumps(research, indent=2)[:4000]}

ANALYSIS:
{json.dumps(analysis, indent=2)[:4000]}

REQUIRED SECTIONS:
{json.dumps(sections, indent=2)}

Write the complete report in Markdown. Include:
- Data tables where you have comparative statistical information
- Bold key findings for scannability
- A final "Key Takeaways" section with 3-5 bullet points
- A "Sources" section listing the sources from research notes

Write fluently — do not break to mention you are an AI."""

        # Stream the report writing
        report_body = await self.call_llm(
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user",   "content": report_prompt},
            ],
            stream     = True,   # ← THIS is what streams words to the UI
            max_tokens = 3000,
        )

        full_report    += report_body
        context["report"] = full_report

        duration    = round(time.monotonic() - start, 1)
        word_count  = len(full_report.split())

        await self.emit(EventType.DONE,
            f"Report written in {duration}s — {word_count} words",
            metadata={"word_count": word_count, "duration_s": duration})

        return AgentResult(
            agent_name = self.name,
            output     = full_report,
            success    = True,
            metadata   = {"word_count": word_count, "sections": len(sections)},
            duration_s = duration,
        )
```

### 3c. Orchestrator Agent

```python
# =========================================================
# FILE: backend/agents/orchestrator.py
# The Orchestrator: master coordinator of all specialists.
# Decomposes tasks, routes to agents, manages context flow.
# =========================================================

import asyncio
import json
import time
import uuid
from typing import AsyncGenerator

from agents.base import BaseAgent, AgentEvent, AgentResult, EventType
from agents.researcher import ResearcherAgent
from agents.analyst     import AnalystAgent
from agents.writer      import WriterAgent
from agents.safety_guard import SafetyGuardAgent
from tools.registry     import build_tool_registry
from memory.session     import SessionMemory
from memory.vector_store import VectorStoreMemory

import structlog
log = structlog.get_logger()


class OrchestratorAgent(BaseAgent):
    """
    The master coordinator — the brain of ARIA.

    The Orchestrator doesn't do research, analysis, or writing itself.
    It decides WHO should do WHAT and in WHAT ORDER.

    Pipeline for a research task:
    1. Safety check input
    2. Researcher → gather information
    3. Analyst    → synthesize and find patterns
    4. Writer     → produce polished report
    5. Safety check output
    6. Return final result

    All events from ALL agents flow through ONE shared queue →
    ONE SSE stream → client sees everything in real-time.

    The context dict is the shared memory between agents in a run.
    Each agent can READ from it and WRITE to it.
    """

    def __init__(self):
        super().__init__(
            name          = "Orchestrator",
            system_prompt = "You coordinate a team of AI specialists.",
            model         = "gpt-4o-mini",
        )
        # Initialize specialist agents
        self.researcher   = ResearcherAgent()
        self.analyst      = AnalystAgent()
        self.writer       = WriterAgent()
        self.safety_guard = SafetyGuardAgent()

        # The specialists (all workers)
        self._specialists = [
            self.researcher,
            self.analyst,
            self.writer,
            self.safety_guard,
        ]

    async def run_research_pipeline(
        self,
        task:       str,
        session_id: str,
        event_queue: asyncio.Queue,
    ) -> AsyncGenerator[AgentEvent, None]:
        """
        Run the full research pipeline and yield events as they happen.
        This is the main entry point called by the API route.

        The caller (SSE endpoint) iterates over the yielded events
        and sends them to the browser.

        Args:
            task:        The research task from the user
            session_id:  Current session ID (for memory/context isolation)
            event_queue: Shared queue for collecting events from all agents
        """
        start   = time.monotonic()
        context = {"session_id": session_id, "task": task}

        # Wire up shared resources to all agents
        long_term_memory = VectorStoreMemory(collection_name=f"aria_{session_id[:8]}")
        tools            = await build_tool_registry()

        for agent in self._specialists + [self]:
            agent.attach_queue(event_queue)
            agent.attach_tools(tools)
            agent.attach_memory(long_term_memory)

        # ── Pipeline begins ───────────────────────────────
        try:
            # 1. Input safety check
            await self.emit(EventType.HANDOFF,
                "Starting ARIA research pipeline",
                metadata={"task": task[:200], "session_id": session_id})

            safety_result = await self.safety_guard.run(
                task    = task,
                context = {"check_type": "input"},
            )

            if not safety_result.success:
                await self.emit(EventType.ERROR,
                    f"Task rejected by safety check: {safety_result.error}")
                await self.emit(EventType.DONE, "Pipeline aborted",
                    metadata={"reason": "safety_check_failed"})
                return

            # 2. Research phase
            await self.emit(EventType.HANDOFF,
                "Handing off to Researcher agent",
                metadata={"agent": "Researcher", "phase": "1/3"})

            await self.researcher.run(task=task, context=context)

            # 3. Analysis phase
            await self.emit(EventType.HANDOFF,
                "Handing off to Analyst agent",
                metadata={"agent": "Analyst", "phase": "2/3"})

            await self.analyst.run(task=task, context=context)

            # 4. Writing phase
            await self.emit(EventType.HANDOFF,
                "Handing off to Writer agent — generating report",
                metadata={"agent": "Writer", "phase": "3/3"})

            writer_result = await self.writer.run(task=task, context=context)

            # 5. Output safety check
            output_safety = await self.safety_guard.run(
                task    = writer_result.output,
                context = {"check_type": "output"},
            )

            final_output = output_safety.output if output_safety.success \
                           else writer_result.output

            # 6. Signal pipeline completion
            duration = round(time.monotonic() - start, 1)
            await self.emit(EventType.DONE,
                f"Research pipeline complete in {duration}s",
                metadata={
                    "duration_s":  duration,
                    "session_id":  session_id,
                    "report_ready": True,
                    "word_count":  len(final_output.split()),
                })

            # Store the final report in context for retrieval
            context["final_report"] = final_output

        except Exception as e:
            log.error("pipeline_error", error=str(e), session_id=session_id)
            await self.emit(EventType.ERROR,
                f"Pipeline error: {str(e)[:200]}")
            await self.emit(EventType.DONE, "Pipeline complete with errors",
                metadata={"error": str(e)[:200]})

        finally:
            # Signal to the SSE endpoint that event emission is complete
            await event_queue.put(None)   # ← sentinel value

    async def run(self, task: str, context: dict = None) -> AgentResult:
        """Required by BaseAgent — delegates to run_research_pipeline."""
        pass    # orchestrated via run_research_pipeline()
```

### 3d. Tool Registry

```python
# =========================================================
# FILE: backend/tools/registry.py
# Builds and returns the tool registry for all agents.
# Tools are async functions that agents can call by name.
# =========================================================

import asyncio
import json
import os
import aiohttp
import structlog

log = structlog.get_logger()


async def _web_search(query: str, max_results: int = 5) -> str:
    """
    Web search using Tavily API — purpose-built for LLM agents.
    Returns clean, structured results (not raw HTML).

    Sign up at tavily.com — free tier: 1000 searches/month.
    Alternative: You can use DuckDuckGo via duckduckgo-search library.
    """
    api_key = os.environ.get("TAVILY_API_KEY")

    if not api_key:
        # Fallback: return mock data if no API key (for development)
        log.warning("TAVILY_API_KEY not set — returning mock search results")
        return json.dumps({
            "results": [
                {
                    "title":   f"Mock result for: {query}",
                    "url":     "https://example.com",
                    "content": f"This is a mock search result for '{query}'. "
                               "Set TAVILY_API_KEY in your .env to get real results."
                }
            ]
        })

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.tavily.com/search",
                json={
                    "api_key":        api_key,
                    "query":          query,
                    "max_results":    max_results,
                    "include_answer": True,
                    "search_depth":   "basic",    # "advanced" for better quality (uses 2 credits)
                },
                timeout=aiohttp.ClientTimeout(total=15),
            ) as resp:
                data = await resp.json()

                # Format results cleanly for the LLM
                results = []
                for r in data.get("results", []):
                    results.append({
                        "title":   r.get("title", ""),
                        "url":     r.get("url", ""),
                        "content": r.get("content", "")[:500],    # truncate for tokens
                    })

                return json.dumps({
                    "query":    query,
                    "answer":   data.get("answer", ""),     # Tavily's AI-generated answer
                    "results":  results,
                })

    except Exception as e:
        log.error("web_search_failed", query=query[:50], error=str(e))
        return json.dumps({"error": str(e), "results": []})


async def _news_search(query: str, max_results: int = 5) -> str:
    """
    News-specific search via Tavily with news topic filter.
    Returns recent news articles (last 24h-7 days).
    """
    api_key = os.environ.get("TAVILY_API_KEY")

    if not api_key:
        return json.dumps({"results": [{"title": f"Mock news: {query}",
                                        "content": "Set TAVILY_API_KEY for real results."}]})

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.tavily.com/search",
                json={
                    "api_key":     api_key,
                    "query":       query,
                    "max_results": max_results,
                    "topic":       "news",         # ← news-specific search
                    "days":        7,              # last 7 days
                },
                timeout=aiohttp.ClientTimeout(total=15),
            ) as resp:
                data = await resp.json()
                results = [{"title": r.get("title", ""),
                            "url":   r.get("url", ""),
                            "content": r.get("content", "")[:400],
                            "published_date": r.get("published_date", "")}
                           for r in data.get("results", [])]
                return json.dumps({"query": query, "results": results})

    except Exception as e:
        return json.dumps({"error": str(e), "results": []})


async def _calculator(expression: str) -> str:
    """
    Safe math expression evaluator.
    Only allows numbers and basic operators — NO eval() of arbitrary code.
    """
    import re
    import math

    # Whitelist: only safe characters
    safe_expr = re.sub(r"[^0-9+\-*/().% ]", "", expression)

    try:
        # Use a restricted namespace (only math functions, no builtins)
        result = eval(safe_expr, {"__builtins__": {}}, {
            "abs": abs, "round": round, "min": min, "max": max,
            "sqrt": math.sqrt, "log": math.log, "pi": math.pi,
        })
        return str(result)
    except Exception as e:
        return f"Calculation error: {e}"


async def build_tool_registry() -> dict:
    """
    Returns a dict mapping tool names to async functions.
    This is what gets attached to every agent via agent.attach_tools().

    Adding a new tool: just add a function above and register it here.
    """
    return {
        "web_search":  _web_search,
        "news_search": _news_search,
        "calculator":  _calculator,
    }
```

### 3e. Memory System

```python
# =========================================================
# FILE: backend/memory/vector_store.py
# ChromaDB-based long-term memory with semantic search.
# Agents store their outputs here; retrieve similar past work.
# pip install chromadb
# =========================================================

import uuid
from typing import Optional

import chromadb
from chromadb.config import Settings
import structlog

log = structlog.get_logger()


class VectorStoreMemory:
    """
    Long-term memory that persists between sessions using ChromaDB.
    Enables semantic search: "find past analyses similar to this task."

    ChromaDB is an embedded vector database — it runs in-process,
    no separate server needed in development.
    For production, use chromadb.cloud or a hosted alternative.
    """

    def __init__(self, collection_name: str = "aria_memory"):
        self.collection_name = collection_name

        # Persistent: data survives container restarts
        # In production: use chromadb.cloud or configure a persistent path
        self.client = chromadb.Client(Settings(
            chroma_db_impl    = "duckdb+parquet",
            persist_directory = "./chroma_data",
            anonymized_telemetry = False,
        ))

        # Get or create the collection (like a table in ChromaDB)
        self.collection = self.client.get_or_create_collection(
            name     = collection_name,
            metadata = {"hnsw:space": "cosine"},   # cosine similarity for text
        )

        log.info("vector_store_initialized",
                 collection=collection_name,
                 existing_docs=self.collection.count())

    async def store(
        self,
        content:  str,
        metadata: dict = None,
    ) -> str:
        """
        Store a document in the vector store.
        ChromaDB automatically creates embeddings using its default model.

        Args:
            content:  The text content to store (max 8000 chars recommended)
            metadata: Optional metadata for filtering later

        Returns:
            The document ID
        """
        doc_id = uuid.uuid4().hex

        try:
            self.collection.add(
                documents = [content[:8000]],    # truncate for embedding limits
                metadatas = [metadata or {}],
                ids       = [doc_id],
            )
            log.debug("memory_stored", doc_id=doc_id, chars=len(content))
            return doc_id

        except Exception as e:
            log.error("memory_store_failed", error=str(e))
            raise

    async def search(
        self,
        query:     str,
        n_results: int = 3,
        where:     Optional[dict] = None,   # filter by metadata
    ) -> list[dict]:
        """
        Semantic search: find documents similar to the query.
        ChromaDB embeds the query and finds nearest neighbors.

        Args:
            query:     The search query (can be a full sentence)
            n_results: How many results to return
            where:     Optional metadata filter (e.g., {"type": "analysis"})

        Returns:
            List of dicts with "content", "metadata", "distance"
        """
        if self.collection.count() == 0:
            return []

        try:
            results = self.collection.query(
                query_texts = [query],
                n_results   = min(n_results, self.collection.count()),
                where       = where,
                include     = ["documents", "metadatas", "distances"],
            )

            output = []
            for i in range(len(results["documents"][0])):
                distance = results["distances"][0][i]
                # Only return results above similarity threshold (distance < 0.5)
                if distance < 0.5:
                    output.append({
                        "content":  results["documents"][0][i],
                        "metadata": results["metadatas"][0][i],
                        "distance": round(distance, 3),
                    })

            log.debug("memory_searched", query=query[:50],
                      results_found=len(output))
            return output

        except Exception as e:
            log.error("memory_search_failed", error=str(e))
            return []
```

---

## 4. Phase 2: FastAPI Streaming Backend

```python
# =========================================================
# FILE: backend/api/routes.py
# All API endpoints. The SSE streaming endpoint is the star.
# =========================================================

import asyncio
import json
import uuid
import time
from typing import Optional

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from agents.orchestrator import OrchestratorAgent
from memory.session      import SessionMemory
import structlog

log = structlog.get_logger()
router = APIRouter()

# Module-level session store (use Redis in production)
session_memory = SessionMemory()


class ResearchRequest(BaseModel):
    task:       str
    session_id: Optional[str] = None    # if None, creates new session


# ─── POST /research ───────────────────────────────────────
# Starts a research task, returns task_id for streaming
@router.post("/research")
async def start_research(body: ResearchRequest, request: Request):
    """
    Start a new research task.
    Returns task_id immediately — client then opens SSE stream
    with GET /stream/{task_id} to receive real-time updates.
    """
    if not body.task.strip():
        raise HTTPException(status_code=400, detail="Task cannot be empty")
    if len(body.task) > 2000:
        raise HTTPException(status_code=400, detail="Task too long (max 2000 chars)")

    task_id    = uuid.uuid4().hex
    session_id = body.session_id or uuid.uuid4().hex

    # Create a shared asyncio.Queue for this task
    # The orchestrator writes events → the SSE endpoint reads events
    event_queue = asyncio.Queue()
    request.app.state.task_queues[task_id] = event_queue

    # Save task to session history (so /sessions can list it)
    await session_memory.save_task(session_id, {
        "task_id":    task_id,
        "task":       body.task,
        "status":     "running",
        "created_at": time.time(),
    })

    # Launch the pipeline in the background (don't await it here)
    orchestrator = OrchestratorAgent()

    async def run_and_cleanup():
        """Runs the pipeline, then cleans up the queue reference."""
        try:
            await orchestrator.run_research_pipeline(
                task        = body.task,
                session_id  = session_id,
                event_queue = event_queue,
            )
            # Save the final report to session
            context = {}    # orchestrator populates context internally
            await session_memory.update_task(session_id, task_id, {
                "status": "complete",
            })
        except Exception as e:
            log.error("pipeline_run_error", task_id=task_id, error=str(e))
            await event_queue.put(None)   # signal done even on error
        finally:
            # Keep queue in state for 60s so client can finish reading
            await asyncio.sleep(60)
            request.app.state.task_queues.pop(task_id, None)

    asyncio.create_task(run_and_cleanup())

    log.info("research_started", task_id=task_id, session_id=session_id,
             task_preview=body.task[:80])

    return {
        "task_id":    task_id,
        "session_id": session_id,
        "status":     "started",
        "stream_url": f"/stream/{task_id}",
    }


# ─── GET /stream/{task_id} ───────────────────────────────
# SSE endpoint: streams agent events in real-time to the browser
@router.get("/stream/{task_id}")
async def stream_events(task_id: str, request: Request):
    """
    Server-Sent Events (SSE) endpoint.
    Streams all agent events for a running task.

    The client connects once, receives events until DONE,
    then closes the connection.

    SSE format:
        data: {"type": "thought", "agent": "Researcher", "content": "..."}\n\n
        data: {"type": "content", "agent": "Writer", "content": "..."}\n\n
        data: [DONE]\n\n
    """
    event_queue = request.app.state.task_queues.get(task_id)
    if not event_queue:
        raise HTTPException(status_code=404,
                           detail="Task not found or already complete")

    async def generate_events():
        """
        Generator: yields SSE events until the queue emits the sentinel (None).
        If the client disconnects, we stop generating (request.is_disconnected).
        """
        try:
            while True:
                # Check for client disconnect (user closed browser tab, etc.)
                if await request.is_disconnected():
                    log.info("client_disconnected", task_id=task_id)
                    break

                try:
                    # Wait up to 1s for the next event
                    # Timeout prevents holding the connection if queue is slow
                    event = await asyncio.wait_for(event_queue.get(), timeout=1.0)
                except asyncio.TimeoutError:
                    # Send a heartbeat comment to keep the connection alive
                    # (proxies and browsers close idle SSE connections)
                    yield ": heartbeat\n\n"
                    continue

                # None is our sentinel value — means the pipeline is done
                if event is None:
                    yield "data: [DONE]\n\n"
                    break

                # Forward the event to the client
                yield event.to_sse()

        except asyncio.CancelledError:
            log.info("stream_cancelled", task_id=task_id)
        except Exception as e:
            log.error("stream_error", task_id=task_id, error=str(e))
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

    return StreamingResponse(
        generate_events(),
        media_type = "text/event-stream",
        headers    = {
            "Cache-Control":    "no-cache",
            "X-Accel-Buffering": "no",     # ← disables Nginx buffering (CRITICAL for SSE)
            "Connection":       "keep-alive",
        },
    )


# ─── GET /sessions ────────────────────────────────────────
@router.get("/sessions")
async def get_sessions(session_id: Optional[str] = None):
    """Return list of past research tasks for the history sidebar."""
    if session_id:
        tasks = await session_memory.get_tasks(session_id)
        return {"session_id": session_id, "tasks": tasks}
    return {"sessions": await session_memory.list_sessions()}


# ─── GET /report/{task_id} ───────────────────────────────
@router.get("/report/{task_id}")
async def get_report(task_id: str):
    """
    Retrieve the completed report for a finished task.
    Used when the user comes back later to view a past report.
    """
    report = await session_memory.get_report(task_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"task_id": task_id, "report": report}
```

```python
# =========================================================
# FILE: backend/main.py
# FastAPI application entry point. Wires everything together.
# =========================================================

import asyncio
import os
import structlog

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from api.routes import router
from config     import settings

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.add_log_level,
        structlog.processors.JSONRenderer(),
    ],
)
log = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: initialize shared state. Shutdown: clean up."""
    # Shared dict mapping task_id → asyncio.Queue
    # Each running research task gets its own event queue
    app.state.task_queues = {}

    log.info("aria_starting", version="1.0.0")
    yield
    log.info("aria_shutdown")
    # In-flight tasks will naturally finish or timeout


app = FastAPI(
    title    = "ARIA — Adaptive Research Intelligence Architecture",
    version  = "1.0.0",
    lifespan = lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["http://localhost:5173"],   # Vite dev server
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

app.include_router(router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "alive", "service": "ARIA"}
```

---

## 5. Phase 3: React Frontend

### 5a. Global Styles

```css
/* =========================================================
   FILE: frontend/src/index.css
   ARIA design system — dark theme with glassmorphism panels.
   ========================================================= */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  /* Color palette */
  --bg-primary:    #0a0a0f;
  --bg-secondary:  #111118;
  --bg-panel:      rgba(255, 255, 255, 0.04);
  --bg-panel-hover:rgba(255, 255, 255, 0.07);
  --border:        rgba(255, 255, 255, 0.08);
  --border-active: rgba(99, 102, 241, 0.5);

  /* Brand colors */
  --indigo:        #6366f1;
  --indigo-light:  #818cf8;
  --violet:        #8b5cf6;
  --cyan:          #22d3ee;
  --emerald:       #10b981;
  --amber:         #f59e0b;
  --rose:          #f43f5e;

  /* Text */
  --text-primary:  #f1f5f9;
  --text-secondary:#94a3b8;
  --text-muted:    #475569;

  /* Agent colors */
  --agent-orchestrator: #6366f1;
  --agent-researcher:   #22d3ee;
  --agent-analyst:      #8b5cf6;
  --agent-writer:       #10b981;
  --agent-safety:       #f59e0b;

  /* Spacing */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family:      'Inter', -apple-system, sans-serif;
  background-color: var(--bg-primary);
  color:            var(--text-primary);
  min-height:       100vh;
  overflow-x:       hidden;
}

/* Glass panel effect */
.glass {
  background:    var(--bg-panel);
  border:        1px solid var(--border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(12px);
}

/* Agent badge color mapping */
.agent-orchestrator { color: var(--agent-orchestrator); }
.agent-researcher   { color: var(--agent-researcher); }
.agent-analyst      { color: var(--agent-analyst); }
.agent-writer       { color: var(--agent-writer); }
.agent-safety       { color: var(--agent-safety); }

/* Streaming cursor animation */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
.streaming-cursor::after {
  content:   "▋";
  color:     var(--indigo-light);
  animation: blink 1s infinite;
}

/* Thinking animation */
@keyframes pulse-dot {
  0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
  40%           { transform: scale(1); opacity: 1; }
}
.thinking-dots span {
  display:          inline-block;
  width:            6px; height: 6px;
  border-radius:    50%;
  background:       var(--indigo-light);
  margin:           0 2px;
  animation:        pulse-dot 1.4s infinite ease-in-out;
}
.thinking-dots span:nth-child(2) { animation-delay: 0.16s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.32s; }

/* Glow effects */
.glow-indigo { box-shadow: 0 0 24px rgba(99, 102, 241, 0.2); }
.glow-cyan   { box-shadow: 0 0 24px rgba(34, 211, 238, 0.2); }

/* Scrollbar */
::-webkit-scrollbar       { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
```

### 5b. SSE Hook

```javascript
// =========================================================
// FILE: frontend/src/hooks/useAgentStream.js
// Custom hook that manages the SSE connection to the backend.
// Parses incoming events and updates component state.
// =========================================================

import { useState, useCallback, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * useAgentStream — manages the entire research pipeline flow:
 *
 * 1. POST /research to start the pipeline
 * 2. Open SSE stream to GET /stream/{task_id}
 * 3. Parse incoming events and categorize them
 * 4. Build a live activity log and accumulate streaming content
 *
 * Returns status, events (for activity panel), and streamed content (for report)
 */
export function useAgentStream() {
  const [status, setStatus]           = useState("idle");
  // "idle" | "starting" | "running" | "complete" | "error"

  const [events, setEvents]           = useState([]);
  // Array of { id, type, agent, content, ts }

  const [streamedContent, setStreamedContent] = useState("");
  // Accumulated CONTENT events — this builds the report in real-time

  const [taskId, setTaskId]           = useState(null);
  const [sessionId, setSessionId]     = useState(null);
  const [error, setError]             = useState(null);

  const eventSourceRef = useRef(null);
  const contentRef     = useRef("");    // ref to avoid stale closure in accumulator

  const addEvent = useCallback((event) => {
    setEvents(prev => [...prev, { ...event, id: Date.now() + Math.random() }]);
  }, []);

  const startResearch = useCallback(async (task, currentSessionId = null) => {
    // Reset state for new research run
    setStatus("starting");
    setEvents([]);
    setStreamedContent("");
    contentRef.current = "";
    setError(null);

    try {
      // Step 1: Start the research pipeline
      const response = await fetch(`${API_BASE}/research`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          task,
          session_id: currentSessionId,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to start research");
      }

      const { task_id, session_id } = await response.json();
      setTaskId(task_id);
      setSessionId(session_id);
      setStatus("running");

      // Step 2: Open SSE stream for real-time events
      // Note: EventSource only supports GET requests — that's why we use
      // a separate POST to start and GET for the stream.
      const eventSource = new EventSource(`${API_BASE}/stream/${task_id}`);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (e) => {
        // Handle the done sentinel
        if (e.data === "[DONE]") {
          setStatus("complete");
          eventSource.close();
          return;
        }

        try {
          const event = JSON.parse(e.data);

          // Accumulate CONTENT events into the streamed report
          if (event.type === "content") {
            contentRef.current += event.content;
            setStreamedContent(contentRef.current);
            // Don't add content events to the activity log (too noisy)
            return;
          }

          // Add all other events to the activity panel
          addEvent(event);

          if (event.type === "error") {
            setError(event.content);
          }

        } catch (parseErr) {
          console.warn("Failed to parse SSE event:", e.data);
        }
      };

      eventSource.onerror = (e) => {
        if (eventSource.readyState === EventSource.CLOSED) {
          // Connection closed normally — check if we're "complete"
          setStatus(prev => prev === "complete" ? "complete" : "error");
        } else {
          setError("Stream connection error");
          setStatus("error");
          eventSource.close();
        }
      };

    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }, [addEvent]);

  const stopResearch = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setStatus("idle");
  }, []);

  return {
    status,
    events,
    streamedContent,
    taskId,
    sessionId,
    error,
    startResearch,
    stopResearch,
    isRunning: status === "running" || status === "starting",
  };
}
```

### 5c. Main App

```jsx
// =========================================================
// FILE: frontend/src/App.jsx
// Root component: handles routing and shared state.
// =========================================================

import { useState } from "react";
import Dashboard from "./components/Dashboard";
import "./index.css";

export default function App() {
  const [sessionId, setSessionId] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Background gradient decoration */}
      <div style={{
        position:   "fixed",
        top:        "-20%",
        left:       "-10%",
        width:      "60%",
        height:     "60%",
        background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex:     0,
      }} />
      <div style={{
        position:   "fixed",
        bottom:     "-20%",
        right:      "-10%",
        width:      "60%",
        height:     "60%",
        background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex:     0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Dashboard sessionId={sessionId} setSessionId={setSessionId} />
      </div>
    </div>
  );
}
```

### 5d. Dashboard & Agent Panel

```jsx
// =========================================================
// FILE: frontend/src/components/Dashboard.jsx
// Main research interface — the heart of the ARIA UI.
// =========================================================

import { useState } from "react";
import { useAgentStream } from "../hooks/useAgentStream";
import TaskInput    from "./TaskInput";
import AgentPanel   from "./AgentPanel";
import ReportViewer from "./ReportViewer";

export default function Dashboard({ sessionId, setSessionId }) {
  const {
    status, events, streamedContent,
    taskId, error, startResearch, stopResearch, isRunning,
  } = useAgentStream();

  const handleSubmit = async (task) => {
    await startResearch(task, sessionId);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{
        padding:      "20px 32px",
        borderBottom: "1px solid var(--border)",
        display:      "flex",
        alignItems:   "center",
        gap:          "12px",
      }}>
        <div style={{
          width:        "36px", height: "36px",
          background:   "linear-gradient(135deg, var(--indigo), var(--violet))",
          borderRadius: "10px",
          display:      "flex", alignItems: "center", justifyContent: "center",
          fontSize:     "18px",
        }}>🔭</div>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.3px" }}>
            ARIA
          </h1>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
            ADAPTIVE RESEARCH INTELLIGENCE
          </p>
        </div>

        {/* Status indicator */}
        {isRunning && (
          <div style={{
            marginLeft:    "auto",
            display:       "flex",
            alignItems:    "center",
            gap:           "8px",
            padding:       "6px 14px",
            background:    "rgba(99,102,241,0.12)",
            border:        "1px solid rgba(99,102,241,0.3)",
            borderRadius:  "20px",
            fontSize:      "13px",
            color:         "var(--indigo-light)",
          }}>
            <span className="thinking-dots">
              <span/><span/><span/>
            </span>
            Research in progress
          </div>
        )}

        {status === "complete" && (
          <div style={{
            marginLeft:   "auto",
            padding:      "6px 14px",
            background:   "rgba(16,185,129,0.12)",
            border:       "1px solid rgba(16,185,129,0.3)",
            borderRadius: "20px",
            fontSize:     "13px",
            color:        "var(--emerald)",
          }}>
            ✓ Complete
          </div>
        )}
      </header>

      {/* ── Main content ───────────────────────────────── */}
      <main style={{ flex: 1, padding: "32px", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>

        {/* Task Input */}
        <TaskInput onSubmit={handleSubmit} isRunning={isRunning} onStop={stopResearch} />

        {/* Error display */}
        {error && (
          <div style={{
            marginTop:    "16px",
            padding:      "12px 16px",
            background:   "rgba(244, 63, 94, 0.1)",
            border:       "1px solid rgba(244, 63, 94, 0.3)",
            borderRadius: "var(--radius-md)",
            color:        "var(--rose)",
            fontSize:     "14px",
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Content area: Agent Panel + Report side by side */}
        {(events.length > 0 || streamedContent) && (
          <div style={{
            marginTop:     "24px",
            display:       "grid",
            gridTemplateColumns: "380px 1fr",
            gap:           "24px",
            alignItems:    "start",
          }}>
            {/* Left: Agent Activity Panel */}
            <AgentPanel events={events} status={status} />

            {/* Right: Report Viewer (streaming) */}
            <ReportViewer
              content     = {streamedContent}
              isStreaming = {isRunning && streamedContent.length > 0}
              status      = {status}
            />
          </div>
        )}

        {/* Empty state */}
        {status === "idle" && events.length === 0 && (
          <div style={{
            marginTop:     "80px",
            textAlign:     "center",
            color:         "var(--text-muted)",
          }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔭</div>
            <h2 style={{ fontSize: "24px", color: "var(--text-secondary)", marginBottom: "8px" }}>
              What would you like to research?
            </h2>
            <p style={{ fontSize: "15px", maxWidth: "500px", margin: "0 auto" }}>
              ARIA will deploy a team of specialized AI agents to research, analyze,
              and write a comprehensive report on any topic.
            </p>
            {/* Example prompts */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "32px", flexWrap: "wrap" }}>
              {[
                "Current state of quantum computing and business implications",
                "Competitive landscape of the no-code AI tool market in 2024",
                "How are leading companies implementing AI in their workflows?",
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(prompt)}
                  style={{
                    padding:      "10px 18px",
                    background:   "var(--bg-panel)",
                    border:       "1px solid var(--border)",
                    borderRadius: "20px",
                    color:        "var(--text-secondary)",
                    fontSize:     "13px",
                    cursor:       "pointer",
                    transition:   "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.target.style.borderColor = "var(--border-active)";
                    e.target.style.color       = "var(--text-primary)";
                  }}
                  onMouseLeave={e => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.color       = "var(--text-secondary)";
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
```

```jsx
// =========================================================
// FILE: frontend/src/components/AgentPanel.jsx
// Live activity panel: shows what each agent is doing in real-time.
// This is the "glass cockpit" of your agent system.
// =========================================================

import { useEffect, useRef } from "react";

const AGENT_CONFIG = {
  Orchestrator: { emoji: "🎯", color: "var(--agent-orchestrator)" },
  Researcher:   { emoji: "🔍", color: "var(--agent-researcher)"   },
  Analyst:      { emoji: "🧠", color: "var(--agent-analyst)"      },
  Writer:       { emoji: "✍️", color: "var(--agent-writer)"       },
  SafetyGuard:  { emoji: "🛡️", color: "var(--agent-safety)"      },
};

const EVENT_ICONS = {
  thought:     "💭",
  tool_call:   "🔧",
  tool_result: "📦",
  progress:    "📊",
  error:       "⚠️",
  done:        "✅",
  handoff:     "🔀",
};

export default function AgentPanel({ events, status }) {
  const scrollRef = useRef(null);

  // Auto-scroll to latest event
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="glass" style={{ maxHeight: "75vh", display: "flex", flexDirection: "column" }}>
      {/* Panel header */}
      <div style={{
        padding:      "16px 20px",
        borderBottom: "1px solid var(--border)",
        display:      "flex",
        alignItems:   "center",
        gap:          "8px",
      }}>
        <span style={{ fontSize: "14px" }}>⚡</span>
        <span style={{ fontSize: "14px", fontWeight: 600 }}>Agent Activity</span>
        <span style={{
          marginLeft:   "auto",
          fontSize:     "11px",
          padding:      "2px 8px",
          background:   "rgba(99,102,241,0.1)",
          borderRadius: "10px",
          color:        "var(--indigo-light)",
        }}>
          {events.length} events
        </span>
      </div>

      {/* Event log */}
      <div ref={scrollRef} style={{
        flex:     1,
        overflowY:"auto",
        padding:  "12px",
        display:  "flex",
        flexDirection: "column",
        gap:      "6px",
      }}>
        {events.length === 0 && (
          <div style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", padding: "20px" }}>
            Waiting for agents...
          </div>
        )}

        {events.map((event) => {
          const agentConfig = AGENT_CONFIG[event.agent] || { emoji: "🤖", color: "var(--text-secondary)" };
          const icon        = EVENT_ICONS[event.type]   || "•";
          const isError     = event.type === "error";
          const isDone      = event.type === "done";
          const isHandoff   = event.type === "handoff";

          return (
            <div
              key={event.id}
              style={{
                display:      "flex",
                gap:          "10px",
                padding:      "8px 10px",
                borderRadius: "var(--radius-sm)",
                background:   isError   ? "rgba(244,63,94,0.06)"   :
                              isDone    ? "rgba(16,185,129,0.06)"   :
                              isHandoff ? "rgba(99,102,241,0.06)"   : "transparent",
                border:       isError   ? "1px solid rgba(244,63,94,0.2)"    :
                              isDone    ? "1px solid rgba(16,185,129,0.2)"   :
                              isHandoff ? "1px solid rgba(99,102,241,0.15)"  : "1px solid transparent",
                animation:    "fadeIn 0.2s ease",
              }}
            >
              {/* Event icon */}
              <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>
                {icon}
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Agent name */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                  <span style={{ fontSize: "12px" }}>{agentConfig.emoji}</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: agentConfig.color }}>
                    {event.agent}
                  </span>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "auto" }}>
                    {new Date(event.ts * 1000).toLocaleTimeString()}
                  </span>
                </div>

                {/* Event content */}
                <p style={{
                  fontSize:   "12px",
                  color:      isError ? "var(--rose)" : "var(--text-secondary)",
                  lineHeight: "1.5",
                  wordBreak:  "break-word",
                }}>
                  {event.content}
                </p>

                {/* Tool metadata */}
                {event.metadata?.tool && (
                  <code style={{
                    display:       "inline-block",
                    marginTop:     "4px",
                    fontSize:      "10px",
                    padding:       "2px 6px",
                    background:    "rgba(255,255,255,0.05)",
                    borderRadius:  "4px",
                    color:         "var(--cyan)",
                    fontFamily:    "JetBrains Mono, monospace",
                  }}>
                    {event.metadata.tool}
                    {event.metadata.duration_s ? ` (${event.metadata.duration_s}s)` : ""}
                  </code>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking animation when agents are active */}
        {status === "running" && events.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px" }}>
            <span className="thinking-dots" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              <span/><span/><span/>
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Agents working...</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

```jsx
// =========================================================
// FILE: frontend/src/components/ReportViewer.jsx
// Renders the streaming Markdown report with beautiful formatting.
// Shows words appearing in real-time as the Writer generates them.
// =========================================================

// npm install react-markdown remark-gfm
import ReactMarkdown from "react-markdown";
import remarkGfm     from "remark-gfm";

export default function ReportViewer({ content, isStreaming, status }) {
  if (!content && status === "running") {
    return (
      <div className="glass" style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>📝</div>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Researching and analyzing... report will appear here shortly.
        </p>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="glass glow-indigo" style={{
      maxHeight: "75vh",
      display:   "flex",
      flexDirection: "column",
      overflow:  "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding:      "16px 20px",
        borderBottom: "1px solid var(--border)",
        display:      "flex",
        alignItems:   "center",
        gap:          "8px",
      }}>
        <span>📄</span>
        <span style={{ fontSize: "14px", fontWeight: 600 }}>Research Report</span>
        {isStreaming && (
          <span style={{
            marginLeft:   "auto",
            fontSize:     "11px",
            color:        "var(--emerald)",
            display:      "flex",
            alignItems:   "center",
            gap:          "5px",
          }}>
            <span style={{
              width:      "6px", height: "6px",
              borderRadius: "50%",
              background:  "var(--emerald)",
              animation:   "pulse-dot 1s infinite",
            }}/>
            Writing...
          </span>
        )}
        {!isStreaming && status === "complete" && (
          <button
            onClick={() => {
              const blob = new Blob([content], { type: "text/markdown" });
              const url  = URL.createObjectURL(blob);
              const a    = document.createElement("a");
              a.href     = url;
              a.download = "aria-report.md";
              a.click();
            }}
            style={{
              marginLeft:   "auto",
              padding:      "6px 14px",
              background:   "rgba(99,102,241,0.15)",
              border:       "1px solid rgba(99,102,241,0.4)",
              borderRadius: "var(--radius-sm)",
              color:        "var(--indigo-light)",
              cursor:       "pointer",
              fontSize:     "12px",
            }}
          >
            ↓ Export
          </button>
        )}
      </div>

      {/* Markdown content */}
      <div style={{
        flex:      1,
        overflowY: "auto",
        padding:   "24px 28px",
      }}>
        <div style={{
          fontFamily:  "'Inter', sans-serif",
          lineHeight:  "1.7",
          fontSize:    "14px",
          color:       "var(--text-primary)",
        }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => (
                <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px",
                             background: "linear-gradient(90deg, var(--indigo-light), var(--cyan))",
                             WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                           }} {...props} />
              ),
              h2: ({node, ...props}) => (
                <h2 style={{ fontSize: "18px", fontWeight: 600, marginTop: "28px",
                             marginBottom: "12px", color: "var(--text-primary)",
                             paddingBottom: "8px", borderBottom: "1px solid var(--border)"
                           }} {...props} />
              ),
              h3: ({node, ...props}) => (
                <h3 style={{ fontSize: "15px", fontWeight: 600, marginTop: "20px",
                             marginBottom: "8px", color: "var(--indigo-light)" }} {...props} />
              ),
              p: ({node, ...props}) => (
                <p style={{ marginBottom: "14px", color: "var(--text-secondary)" }} {...props} />
              ),
              li: ({node, ...props}) => (
                <li style={{ marginBottom: "6px", color: "var(--text-secondary)" }} {...props} />
              ),
              strong: ({node, ...props}) => (
                <strong style={{ color: "var(--text-primary)", fontWeight: 600 }} {...props} />
              ),
              table: ({node, ...props}) => (
                <div style={{ overflowX: "auto", marginBottom: "16px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse",
                                  fontSize: "13px" }} {...props} />
                </div>
              ),
              th: ({node, ...props}) => (
                <th style={{ padding: "8px 12px", textAlign: "left",
                             background: "rgba(99,102,241,0.1)",
                             color: "var(--indigo-light)",
                             fontWeight: 600, fontSize: "12px",
                             border: "1px solid var(--border)" }} {...props} />
              ),
              td: ({node, ...props}) => (
                <td style={{ padding: "8px 12px",
                             border:  "1px solid var(--border)",
                             color:   "var(--text-secondary)" }} {...props} />
              ),
              code: ({inline, ...props}) => inline ? (
                <code style={{ fontFamily: "JetBrains Mono, monospace",
                               fontSize: "12px", padding: "1px 5px",
                               background: "rgba(255,255,255,0.07)",
                               borderRadius: "4px",
                               color: "var(--cyan)" }} {...props} />
              ) : (
                <pre style={{ background: "rgba(0,0,0,0.3)", padding: "16px",
                              borderRadius: "var(--radius-sm)", overflowX: "auto",
                              border: "1px solid var(--border)", marginBottom: "16px" }}>
                  <code style={{ fontFamily: "JetBrains Mono, monospace",
                                 fontSize: "12px", color: "var(--text-primary)" }} {...props} />
                </pre>
              ),
              blockquote: ({node, ...props}) => (
                <blockquote style={{ borderLeft: "3px solid var(--indigo)",
                                     paddingLeft: "16px", marginBottom: "16px",
                                     color: "var(--text-muted)" }} {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>

          {/* Streaming cursor */}
          {isStreaming && <span className="streaming-cursor" />}
        </div>
      </div>
    </div>
  );
}
```

### 5e. Task Input Component

```jsx
// =========================================================
// FILE: frontend/src/components/TaskInput.jsx
// The research task submission form.
// Supports multi-line input with keyboard shortcuts.
// =========================================================

import { useState, useRef } from "react";

export default function TaskInput({ onSubmit, isRunning, onStop }) {
  const [task, setTask]           = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef               = useRef(null);

  const maxLen   = 2000;
  const charLeft = maxLen - task.length;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!task.trim() || isRunning) return;
    onSubmit(task.trim());
    // Don't clear — user may want to modify and re-run
  };

  const handleKeyDown = (e) => {
    // Cmd/Ctrl + Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="glass" style={{
      padding:    "20px",
      border:     `1px solid ${isFocused ? "var(--border-active)" : "var(--border)"}`,
      transition: "border-color 0.2s",
    }}>
      <form onSubmit={handleSubmit}>
        <textarea
          ref         = {textareaRef}
          value       = {task}
          onChange    = {e => setTask(e.target.value)}
          onKeyDown   = {handleKeyDown}
          onFocus     = {() => setIsFocused(true)}
          onBlur      = {() => setIsFocused(false)}
          placeholder = "What would you like ARIA to research? Be specific — the more context you give, the better the report.

Examples:
• Analyze the current state of quantum computing and its near-term business implications
• Research the competitive landscape of no-code AI platforms targeting enterprise customers
• Summarize recent breakthroughs in mRNA vaccine technology and their clinical applications"
          disabled    = {isRunning}
          rows        = {5}
          style={{
            width:       "100%",
            background:  "transparent",
            border:      "none",
            outline:     "none",
            color:       "var(--text-primary)",
            fontSize:    "15px",
            lineHeight:  "1.6",
            resize:      "vertical",
            fontFamily:  "'Inter', sans-serif",
            opacity:     isRunning ? 0.5 : 1,
          }}
        />

        <div style={{
          marginTop:    "14px",
          display:      "flex",
          alignItems:   "center",
          gap:          "12px",
        }}>
          {/* Submit button */}
          {!isRunning ? (
            <button
              type    = "submit"
              disabled = {!task.trim()}
              style={{
                padding:      "10px 24px",
                background:   task.trim()
                              ? "linear-gradient(135deg, var(--indigo), var(--violet))"
                              : "var(--bg-panel)",
                border:       "none",
                borderRadius: "var(--radius-sm)",
                color:        task.trim() ? "#fff" : "var(--text-muted)",
                fontSize:     "14px",
                fontWeight:   600,
                cursor:       task.trim() ? "pointer" : "not-allowed",
                transition:   "all 0.2s",
              }}
            >
              Research →
            </button>
          ) : (
            <button
              type    = "button"
              onClick = {onStop}
              style={{
                padding:      "10px 24px",
                background:   "rgba(244,63,94,0.1)",
                border:       "1px solid rgba(244,63,94,0.3)",
                borderRadius: "var(--radius-sm)",
                color:        "var(--rose)",
                fontSize:     "14px",
                fontWeight:   600,
                cursor:       "pointer",
              }}
            >
              ■ Stop
            </button>
          )}

          {/* Keyboard shortcut hint */}
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            ⌘ + Enter to submit
          </span>

          {/* Character count */}
          <span style={{
            marginLeft: "auto",
            fontSize:   "11px",
            color:      charLeft < 200 ? "var(--amber)" : "var(--text-muted)",
          }}>
            {charLeft.toLocaleString()} chars remaining
          </span>
        </div>
      </form>
    </div>
  );
}
```

---

## 6. Phase 4: Infrastructure

### 6a. Docker Compose (Local Dev)

```yaml
# =========================================================
# FILE: docker-compose.yml
# Local development: backend + Redis + ChromaDB all in one command.
# Run: docker-compose up --build
# =========================================================

version: "3.9"

services:

  # ── FastAPI Backend ──────────────────────────────────────
  backend:
    build:
      context:    .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - TAVILY_API_KEY=${TAVILY_API_KEY}
      - REDIS_URL=redis://redis:6379
      - ENV=development
      - LOG_LEVEL=INFO
      - CHROMA_HOST=chromadb
      - CHROMA_PORT=8001
    volumes:
      - ./backend:/app        # ← hot reload: code changes reflect immediately
      - chroma_data:/app/chroma_data
    depends_on:
      redis:
        condition: service_healthy
    command: >
      uvicorn main:app
        --host 0.0.0.0
        --port 8000
        --reload           # hot reload in dev
        --reload-dir /app
    healthcheck:
      test:     ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout:  10s
      retries:  3
    restart: unless-stopped

  # ── Redis (Session Storage + Rate Limiting) ──────────────
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    healthcheck:
      test:     ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout:  5s
      retries:  5
    restart: unless-stopped

  # ── ChromaDB (Vector Store) ───────────────────────────────
  chromadb:
    image: chromadb/chroma:latest
    ports:
      - "8001:8000"
    volumes:
      - chroma_data:/chroma/chroma
    environment:
      - IS_PERSISTENT=TRUE
    restart: unless-stopped


volumes:
  chroma_data:
    driver: local
```

```dockerfile
# =========================================================
# FILE: Dockerfile
# Production-ready multi-stage build (from Ch.11 pattern)
# =========================================================

FROM python:3.12-slim AS builder
RUN apt-get update && apt-get install -y gcc libffi-dev && rm -rf /var/lib/apt/lists/*
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim AS runtime
RUN groupadd -r aria && useradd -r -g aria aria
COPY --from=builder /opt/venv /opt/venv
WORKDIR /app
COPY --chown=aria:aria backend/ .
ENV PATH="/opt/venv/bin:$PATH" PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1 PORT=8000
USER aria
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

```env
# =========================================================
# FILE: .env.example
# Copy to .env and fill in your values.
# NEVER commit .env to git.
# =========================================================

# Required
OPENAI_API_KEY=sk-your-openai-key-here
TAVILY_API_KEY=tvly-your-tavily-key-here

# Optional — override defaults
ENV=development
LOG_LEVEL=INFO
REDIS_URL=redis://localhost:6379
DAILY_BUDGET_USD=20
VITE_API_URL=http://localhost:8000/api
```

### 6b. Production Deployment (GCP Cloud Run)

```bash
# =========================================================
# FILE: deploy.sh
# Deploy ARIA to GCP Cloud Run (backend) + Vercel (frontend).
# Run: chmod +x deploy.sh && ./deploy.sh
# =========================================================

#!/bin/bash
set -e

PROJECT_ID=${GCP_PROJECT_ID:-"your-gcp-project"}
REGION=${GCP_REGION:-"us-central1"}
SERVICE_NAME="aria-backend"
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "╔══════════════════════════════════════════╗"
echo "║  Deploying ARIA to Production            ║"
echo "╚══════════════════════════════════════════╝"

# ── Step 1: Build and push backend image ──
echo ""
echo "📦 Building Docker image..."
gcloud builds submit \
    --tag  "${IMAGE}:latest" \
    --project "${PROJECT_ID}" \
    .

# ── Step 2: Create secrets in GCP Secret Manager ──
echo ""
echo "🔐 Configuring secrets..."
# Only run these once — they'll error if secrets already exist
# gcloud secrets create openai-api-key --data-file=- <<< "${OPENAI_API_KEY}"
# gcloud secrets create tavily-api-key  --data-file=- <<< "${TAVILY_API_KEY}"

# ── Step 3: Deploy backend to Cloud Run ──
echo ""
echo "🚀 Deploying backend to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
    --image           "${IMAGE}:latest" \
    --platform        managed \
    --region          "${REGION}" \
    --allow-unauthenticated \
    --min-instances   1 \
    --max-instances   10 \
    --concurrency     50 \
    --cpu             2 \
    --memory          2Gi \
    --timeout         300s \
    --set-env-vars    "ENV=production,LOG_LEVEL=INFO" \
    --set-secrets     "OPENAI_API_KEY=openai-api-key:latest,TAVILY_API_KEY=tavily-api-key:latest"

BACKEND_URL=$(gcloud run services describe "${SERVICE_NAME}" \
    --platform managed \
    --region "${REGION}" \
    --format "value(status.url)")

echo ""
echo "✅ Backend deployed: ${BACKEND_URL}"

# ── Step 4: Deploy frontend to Vercel ──
echo ""
echo "🌐 Deploying frontend..."
cd frontend

# Set the backend URL as an environment variable for the frontend build
echo "VITE_API_URL=${BACKEND_URL}/api" > .env.production

npx vercel --prod --yes

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  ARIA Deployed Successfully! 🎉              ║"
echo "╠══════════════════════════════════════════════╣"
echo "║  Backend:  ${BACKEND_URL}"
echo "║  Check frontend URL from Vercel output above  ║"
echo "╚══════════════════════════════════════════════╝"
```

---

## 7. Phase 5: Putting it All Together — Demo Runs

```
RUNNING ARIA LOCALLY:
════════════════════════════════════════════════════════════════

  Terminal 1: Start the backend stack
  ─────────────────────────────────────────────────────────
  $ cp .env.example .env
  $ nano .env          # add your OPENAI_API_KEY and TAVILY_API_KEY
  $ docker-compose up  # starts backend + Redis + ChromaDB

  Terminal 2: Start the frontend
  ─────────────────────────────────────────────────────────
  $ cd frontend
  $ npm install
  $ npm run dev        # Vite at http://localhost:5173

  Visit: http://localhost:5173

  ──────────────────────────────────────────────────────────

  SAMPLE RESEARCH TASK:
  "Analyze the current competitive landscape of AI coding assistants
   (GitHub Copilot, Cursor, Tabnine, Amazon Q) and their market share,
   pricing models, and key differentiators."

  WHAT YOU'LL SEE:
  1. (0s)   Orchestrator: "Starting ARIA research pipeline"
  2. (1s)   Researcher: "Analyzing research task..."
  3. (2s)   Researcher: 🔧 Calling tool: web_search("AI coding assistants comparison 2024")
  4. (4s)   Researcher: 📦 tool result (search data)
  5. (5s)   Researcher: 🔧 Calling tool: news_search("GitHub Copilot vs Cursor 2024")
  6. (8s)   Researcher: ✅ "Research complete in 7.3s — found 8 key findings"
  7. (9s)   Orchestrator: "Handing off to Analyst agent"
  8. (10s)  Analyst: 💭 "Checking memory for relevant past analyses..."
  9. (12s)  Analyst: "Identifying key themes and patterns..."
  10. (18s) Analyst: ✅ "Analysis complete — identified 4 key themes"
  11. (19s) Orchestrator: "Handing off to Writer agent — generating report"
  12. (20s) Writer: 💭 "Planning report structure..."
  13. (22s) Writer: [REPORT STARTS STREAMING WORD BY WORD...]
      # AI Coding Assistants: Competitive Landscape 2024
      ## Executive Summary
      The AI coding assistant market has undergone rapid consolidation...
  14. (55s) Writer: ✅ "Report written in 35s — 1,247 words"
  15. (56s) Orchestrator: ✅ "Research pipeline complete in 51s"

  The full report is rendered beautifully with tables, headers,
  data points — and the user can export it as Markdown.
```

---

## 8. Course Completion Checklist

```
╔══════════════════════════════════════════════════════════════════╗
║  🎓 ARIA CAPSTONE — COMPLETION CHECKLIST                        ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  CHAPTER CONCEPTS APPLIED:                                       ║
║                                                                  ║
║  Ch.1  ✅ What agents are (ReAct pattern via BaseAgent)         ║
║  Ch.2  ✅ LLM prompting (system prompts per specialist agent)   ║
║  Ch.3  ✅ Tool registry (web_search, news_search, calculator)   ║
║  Ch.4  ✅ First agent (BaseAgent with call_llm + use_tool)      ║
║  Ch.5  ✅ Memory (VectorStoreMemory + ChromaDB RAG)             ║
║  Ch.6  ✅ Planning (OrchestratorAgent decomposes tasks)         ║
║  Ch.7  ✅ Multi-agent (Orchestrator + 4 specialist workers)     ║
║  Ch.8  ✅ Full stack (React + FastAPI + SSE streaming)          ║
║  Ch.9  ✅ Workflows (pipeline: Research → Analyze → Write)      ║
║  Ch.10 ✅ Safety (SafetyGuardAgent, input/output validation)    ║
║  Ch.11 ✅ Deployment (Docker + docker-compose + Cloud Run)      ║
║  Ch.12 ✅ This chapter — all of the above, integrated!          ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  WHAT MAKES THIS PORTFOLIO-READY:                               ║
║                                                                  ║
║  ✅ Multi-agent system with clear agent specialization          ║
║  ✅ Real-time streaming UI (words appear as written)            ║
║  ✅ Vector memory (RAG — agents get smarter over time)         ║
║  ✅ Production safety (input/output guardrails)                 ║
║  ✅ Docker + cloud deployment (actually deployable)             ║
║  ✅ Cost tracking (monitors OpenAI spend)                       ║
║  ✅ Structured logging (observable in production)               ║
║  ✅ Beautiful dark UI that impresses in demos                   ║
║  ✅ Clean, readable code (interviewers can read it)             ║
║  ✅ Export functionality (reports as Markdown)                  ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  HOW TO EXTEND ARIA FURTHER:                                    ║
║                                                                  ║
║  1. Add a Code Agent                                            ║
║     Include code examples in reports, run code analysis         ║
║                                                                  ║
║  2. Add PDF/web scraping                                        ║
║     Let users upload PDFs or paste URLs for analysis            ║
║                                                                  ║
║  3. Add collaboration                                           ║
║     Multiple users in one research session (WebSocket)          ║
║                                                                  ║
║  4. Add fine-tuning (Chapter 12 original topic)                 ║
║     Fine-tune writer on your company's style guide              ║
║                                                                  ║
║  5. Add evaluation                                              ║
║     LLM-as-judge scores each report after generation            ║
║                                                                  ║
║  6. Add human-in-the-loop                                       ║
║     "Approve this research plan before I execute it?"           ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

> **Professor's Final Word:** 12 chapters. 12 weeks worth of production engineering, distributed systems thinking, and AI architecture. You started with a `for` loop calling the OpenAI API. You're finishing with a multi-agent research platform with real-time streaming, RAG memory, safety guardrails, Docker, and cloud deployment. That arc — from "hello world LLM" to "production agent system" — is the arc of every great AI engineer. The technology will keep evolving. New models, new frameworks, new APIs. But the *principles* you've internalized — ReAct loops, agent specialization, memory hierarchies, defense-in-depth safety, observability-first design — those don't go stale. You have the mental models. That's what makes you dangerous in this field. Now go build something that makes people say "wait, how did you do that?" 🎓🚀

---

```
────────────────────────────────────────────────────────────────────────
  🎓 COURSE COMPLETE — All Chapters Unlocked
  ────────────────────────────────────────────────────────────────────
  Chapter  1: What Are AI Agents?
  Chapter  2: The Agent Brain — LLMs, Prompting & Tools
  Chapter  3: Environments & Tools — How Agents Interact
  Chapter  4: Building Your First Agent in Python (ReAct)
  Chapter  5: Memory Systems for AI Agents
  Chapter  6: Planning & Reasoning — How Agents Decide
  Chapter  7: Multi-Agent Systems — Orchestrators & Workers
  Chapter  8: Full Stack Agentic App — React + FastAPI
  Chapter  9: Agentic Workflows — Automating Business Pipelines
  Chapter 10: Safety, Guardrails & Evaluation
  Chapter 11: Deploying Agents to Production
  Chapter 12: Capstone — ARIA Multi-Agent Research Platform ← YOU ARE HERE
  ────────────────────────────────────────────────────────────────────
  Files built in this chapter:
  Backend (Python):
    agents/base.py         — BaseAgent, AgentEvent, AgentResult, EventType
    agents/orchestrator.py — OrchestratorAgent, pipeline coordination
    agents/researcher.py   — web search, news, query planning
    agents/analyst.py      — synthesis, RAG retrieval, pattern finding
    agents/writer.py       — streaming report generation
    tools/registry.py      — web_search, news_search, calculator tools
    memory/vector_store.py — ChromaDB semantic memory + RAG
    api/routes.py          — /research, /stream/{id}, /sessions, /report
    main.py                — FastAPI app with lifespan + CORS
  Frontend (React):
    hooks/useAgentStream.js — SSE streaming hook + state management
    components/Dashboard.jsx — main layout + routing
    components/TaskInput.jsx — research submission form
    components/AgentPanel.jsx — live agent activity visualization
    components/ReportViewer.jsx — streaming Markdown report renderer
    index.css              — dark glass design system
  Infrastructure:
    Dockerfile             — multi-stage production build
    docker-compose.yml     — backend + Redis + ChromaDB local stack
    deploy.sh              — GCP Cloud Run + Vercel deploy script
    .env.example           — required environment variables
────────────────────────────────────────────────────────────────────────
```
