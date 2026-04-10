# 🤖 Agentic AI Full Stack Developer Course
## Chapter 6: Planning & Reasoning — How Agents Decide What To Do

> **Professor's Note:** Your agent from Chapter 5 remembers everything. Now the question is: when faced with a complex, multi-step goal, how does it *decide* what to do first? An agent that acts without planning is like a surgeon who just starts cutting without reading the patient's chart. This chapter is about giving your agent the power to **think before acting** — decomposing hard problems, exploring multiple solution paths, catching its own mistakes, and arriving at the right answer through deliberate reasoning. By the end, you'll build an automated research pipeline that thinks as rigorously as a senior analyst. Let's make your agent genuinely intelligent. 🧩🎯

---

```
╔══════════════════════════════════════════════════════════════╗
║  📦 CHAPTER 6 AT A GLANCE                                   ║
╠══════════════════════════════════════════════════════════════╣
║  🧩  Task decomposition — breaking big goals into steps     ║
║  🌳  Tree of Thoughts — exploring multiple reasoning paths  ║
║  🔄  Self-reflection loops — agents catching their errors   ║
║  🗺️  Plan-and-Execute pattern — plan first, act second     ║
║  ✅  Self-consistency — vote across multiple reasoning runs  ║
║  🏭  Real use case: Automated Research Pipeline             ║
║  📝  Mini quiz — 5 questions                                 ║
║  👀  Chapter 7 preview — Multi-Agent Systems                 ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 📋 Table of Contents

1. [Why Planning Matters — The Problem With Reactive Agents](#1-why-planning-matters--the-problem-with-reactive-agents)
2. [Task Decomposition — Breaking It Down](#2-task-decomposition--breaking-it-down)
3. [Plan-and-Execute Pattern](#3-plan-and-execute-pattern)
4. [Tree of Thoughts — Exploring Multiple Paths](#4-tree-of-thoughts--exploring-multiple-paths)
5. [Self-Reflection Loops — Agents That Critique Themselves](#5-self-reflection-loops--agents-that-critique-themselves)
6. [Self-Consistency — Voting Across Reasoning Runs](#6-self-consistency--voting-across-reasoning-runs)
7. [Real Use Case: Automated Research Pipeline](#7-real-use-case-automated-research-pipeline)
8. [Mini Quiz](#8-mini-quiz)
9. [Chapter 7 Preview](#9-chapter-7-preview)

---

## 1. Why Planning Matters — The Problem With Reactive Agents

Every agent you've built so far uses **reactive reasoning**: see a message → think → act. That works perfectly for simple tasks. But give it a genuinely hard problem and watch it fail in creative ways.

```
REACTIVE AGENT — HOW IT FAILS ON COMPLEX TASKS:
════════════════════════════════════════════════════════════════

  Task: "Write a comprehensive competitor analysis for our
         SaaS product, covering pricing, features, market
         positioning, and growth trends for 5 competitors."

  REACTIVE AGENT ATTEMPT:
  ────────────────────────────────────────────────────────────
  Iteration 1: "I'll search for competitor 1"
               → calls search_web("SaaS competitors")
               → gets generic results about "top 100 SaaS"

  Iteration 2: "I'll look at pricing"
               → calls search_web("SaaS pricing")
               → gets unrelated pricing articles

  Iteration 3: "Hmm, let me try a different approach"
               → calls search_web("competitor analysis template")
               ← RABBIT HOLE. Now it's researching templates.

  Iteration 4: "Let me write what I have so far"
               → Writes thin, disorganized 200-word answer
               → Misses 4 of the 5 competitors entirely

  Result: ❌ Shallow, incomplete, disorganized
  Problem: No plan! Each step reacts to the previous output
           with no overarching strategy.


  PLANNING AGENT ATTEMPT:
  ────────────────────────────────────────────────────────────
  Step 0 (PLAN):
    1. Identify the 5 top competitors by name
    2. For each competitor, research: pricing / features / positioning
    3. Synthesize growth trends from recent news
    4. Write structured comparison with recommendations

  Step 1 (EXECUTE #1): search for competitors → [Salesforce, HubSpot,
                        Pipedrive, Freshsales, Zoho CRM]
  Step 2 (EXECUTE #2-6): research each competitor in parallel
  Step 3 (EXECUTE #7): gather growth trend news
  Step 4 (EXECUTE #8): synthesize and write report

  Result: ✅ Comprehensive, structured, all 5 competitors covered
  Difference: The plan acts as a scaffold. Each step knows its place.
```

### The Three Levels of Agent Planning

```
PLANNING SOPHISTICATION SPECTRUM:
════════════════════════════════════════════════════════════════

  LEVEL 1: Reactive (Chapters 1-5)
  ─────────────────────────────────────────────────────────────
  "See message → pick tool → act → repeat"
  Good for: simple, single-step tasks
  Fails on: complex multi-step goals, tasks needing strategy
  Used by: basic chatbots, simple Q&A bots

  LEVEL 2: Plan-then-Execute (this chapter, §3)
  ─────────────────────────────────────────────────────────────
  "Create full plan → execute steps in order → verify"
  Good for: predictable multi-step tasks with clear subtasks
  Fails on: plans that need to change mid-execution
  Used by: coding assistants, form-filling agents

  LEVEL 3: Dynamic Re-Planning (this chapter, §4-5)
  ─────────────────────────────────────────────────────────────
  "Plan → execute → observe → revise plan if needed → continue"
  Good for: complex research, scientific reasoning, debugging
  Fails on: nothing it can't at least try
  Used by: research agents, executive assistants, coding agents
  Cost: more LLM calls, higher latency, worth it for hard tasks
```

> 💡 **Professor's Insight:** The difference between Level 1 and Level 3 is the difference between a junior employee who asks "what do I do next?" after every micro-step, and a senior engineer who says "here's my plan for the week, here's my progress so far, and here's why I changed approach when the database turned out to be different from the docs." You want your agents at Level 3 for hard problems.

---

## 2. Task Decomposition — Breaking It Down

**Task decomposition** is the art of breaking a complex goal into a sequence of concrete, achievable subtasks. It's the foundational planning skill. Everything else builds on it.

```
GOOD vs BAD DECOMPOSITION:
════════════════════════════════════════════════════════════════

  GOAL: "Analyze the viability of launching our app in Japan"

  BAD DECOMPOSITION (too vague):
  ┌────────────────────────────────────────────────────────┐
  │  Step 1: Research Japan                                 │
  │  Step 2: Analyze viability                             │
  │  Step 3: Write report                                   │
  └────────────────────────────────────────────────────────┘
  ← "Research Japan" is not actionable. Research WHAT about Japan?
  ← "Analyze viability" — what does that mean operationally?
  ← Agent will be confused at every step.


  GOOD DECOMPOSITION (concrete + verifiable):
  ┌────────────────────────────────────────────────────────┐
  │  Step 1: Find Japan app store top 10 in our category   │
  │  Step 2: Get Japan mobile internet penetration data    │
  │  Step 3: Research local competitors in our space       │
  │  Step 4: Find Japan payment preferences (QR vs card)   │
  │  Step 5: Look up Japan app store fee/approval rules    │
  │  Step 6: Estimate TAM using population + smartphone %  │
  │  Step 7: List top 3 risks + top 3 opportunities        │
  │  Step 8: Write executive summary + go/no-go verdict    │
  └────────────────────────────────────────────────────────┘
  ← Each step is a concrete research action with a clear output.
  ← Agent knows exactly what tool to call for each step.
  ← Subtasks can be verified (did we get real data?).
  ← Steps build on each other in logical order.

  DECOMPOSITION PRINCIPLES:
  ─────────────────────────
  ✅ Each step is independently executable
  ✅ Each step has a verifiable output ("got pricing data")
  ✅ Steps are ordered by dependency (don't synthesize before gather)
  ✅ Steps are granular enough for one tool call each
  ✅ Total steps < 10 for readability (nest if more needed)
```

```python
# =========================================================
# FILE: task_decomposition.py
# Two approaches to task decomposition:
#   A) LLM-generated decomposition (dynamic)
#   B) Programmatic decomposition (structured + predictable)
# pip install openai python-dotenv
# =========================================================

import os
import json
from dataclasses import dataclass, field
from typing import Optional
from enum import Enum
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


# ══════════════════════════════════════════════════════════
# TASK DATA STRUCTURES
# ══════════════════════════════════════════════════════════

class TaskStatus(Enum):
    PENDING    = "pending"    # not yet started
    RUNNING    = "running"    # currently executing
    DONE       = "done"       # completed successfully
    FAILED     = "failed"     # execution failed
    SKIPPED    = "skipped"    # skipped (dependency failed)
    BLOCKED    = "blocked"    # waiting for dependencies


@dataclass
class SubTask:
    """
    A single decomposed step in a larger plan.
    Think of this as one row in a project plan.
    """
    id:           str                        # unique step ID ("step-1", "step-2-a", etc.)
    description:  str                        # what this step does, for the LLM
    depends_on:   list[str] = field(default_factory=list)
    # ↑ IDs of subtasks that must complete before this one runs.
    #   Enables dependency graph execution (not just sequential).

    status:       TaskStatus = TaskStatus.PENDING
    result:       Optional[str] = None       # output from executing this step
    error:        Optional[str] = None       # error message if failed
    tool_hint:    Optional[str] = None       # suggested tool to use (hint to LLM)
    expected_output: Optional[str] = None   # what a good result looks like (for validation)

    def is_ready(self, completed_ids: set[str]) -> bool:
        """Can this task run? All dependencies must be done."""
        return all(dep in completed_ids for dep in self.depends_on)

    def to_dict(self) -> dict:
        return {
            "id":          self.id,
            "description": self.description,
            "depends_on":  self.depends_on,
            "status":      self.status.value,
            "result":      (self.result[:100] + "...") if self.result and len(self.result) > 100 else self.result,
        }


@dataclass
class Plan:
    """
    A complete multi-step plan for achieving a goal.
    Contains an ordered list of SubTasks with dependency relationships.
    """
    goal:       str
    subtasks:   list[SubTask]
    context:    str  = ""    # background context used when creating the plan
    created_at: str  = ""

    def get_pending_ready(self) -> list[SubTask]:
        """Return tasks that are PENDING and have all dependencies satisfied."""
        completed_ids = {t.id for t in self.subtasks if t.status == TaskStatus.DONE}
        return [
            t for t in self.subtasks
            if t.status == TaskStatus.PENDING and t.is_ready(completed_ids)
        ]

    def is_complete(self) -> bool:
        """Is the entire plan finished (done or failed)?"""
        return all(t.status in (TaskStatus.DONE, TaskStatus.FAILED, TaskStatus.SKIPPED)
                   for t in self.subtasks)

    def summary(self) -> str:
        """Print a readable plan status table."""
        lines = [f"\n{'─'*65}", f"  PLAN: {self.goal[:55]}", f"{'─'*65}"]
        for t in self.subtasks:
            status_icon = {
                TaskStatus.PENDING: "⏳",
                TaskStatus.RUNNING: "🔄",
                TaskStatus.DONE:    "✅",
                TaskStatus.FAILED:  "❌",
                TaskStatus.SKIPPED: "⏭️ ",
                TaskStatus.BLOCKED: "🔒",
            }.get(t.status, "?")
            deps = f" [needs: {','.join(t.depends_on)}]" if t.depends_on else ""
            lines.append(f"  {status_icon} [{t.id}] {t.description[:55]}{deps}")
        lines.append(f"{'─'*65}")
        return "\n".join(lines)


# ══════════════════════════════════════════════════════════
# APPROACH A: LLM-GENERATED DECOMPOSITION
# ══════════════════════════════════════════════════════════

def llm_decompose_goal(
    goal:           str,
    context:        str = "",
    available_tools: list[str] = None,
    max_steps:      int = 8
) -> Plan:
    """
    Use the LLM to decompose a complex goal into concrete subtasks.
    The LLM reads the goal and produces a JSON plan.

    Args:
        goal:            The high-level goal to decompose
        context:         Background information (e.g., domain, constraints)
        available_tools: Tool names the agent has access to
        max_steps:       Maximum number of subtasks to generate

    Returns:
        A Plan object with ordered SubTask list.
    """
    tools_str = "\n".join(f"  - {t}" for t in (available_tools or []))
    context_str = f"\nContext: {context}" if context else ""

    decomposition_prompt = f"""You are a careful planning assistant.

Break this goal into {max_steps} or fewer concrete, executable subtasks:
Goal: {goal}{context_str}

Available tools:
{tools_str if tools_str else "  - web_search(query)\n  - take_note(content)\n  - write_file(content)"}

Rules for good decomposition:
1. Each subtask must be independently executable by a tool call.
2. Each subtask must have a clear, verifiable output.
3. Order steps by dependency — don't synthesize before gathering.
4. Use "depends_on" to show which steps need to complete first.
5. Keep descriptions concrete: "Search for X" not "Research X".

Return ONLY valid JSON in this exact format:
{{
  "steps": [
    {{
      "id": "step-1",
      "description": "Concrete action description",
      "depends_on": [],
      "tool_hint": "web_search",
      "expected_output": "What a good result looks like"
    }},
    {{
      "id": "step-2",
      "description": "Another action",
      "depends_on": ["step-1"],
      "tool_hint": "take_note",
      "expected_output": "Expected output description"
    }}
  ]
}}"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You create JSON task decomposition plans. Return only valid JSON."},
            {"role": "user",   "content": decomposition_prompt}
        ],
        temperature=0.1,
        max_tokens=1500,
        response_format={"type": "json_object"},
        # response_format forces valid JSON — prevents partial or broken JSON output.
        # Only available on gpt-4o and gpt-4o-mini models.
    )

    raw = json.loads(response.choices[0].message.content)
    steps_data = raw.get("steps", raw.get("subtasks", raw.get("tasks", [])))

    subtasks = []
    for s in steps_data:
        subtasks.append(SubTask(
            id=s.get("id", f"step-{len(subtasks)+1}"),
            description=s.get("description", ""),
            depends_on=s.get("depends_on", []),
            tool_hint=s.get("tool_hint", ""),
            expected_output=s.get("expected_output", ""),
        ))

    from datetime import datetime
    plan = Plan(
        goal=goal,
        subtasks=subtasks,
        context=context,
        created_at=datetime.now().isoformat()
    )

    print(plan.summary())
    return plan


# ══════════════════════════════════════════════════════════
# APPROACH B: HIERARCHICAL DECOMPOSITION
# ══════════════════════════════════════════════════════════

def hierarchical_decompose(
    goal:        str,
    depth:       int  = 2,
    breadth:     int  = 3,
) -> dict:
    """
    Recursively decompose a goal into a tree of subtasks.
    Level 1: 3 major phases.
    Level 2: 3 concrete steps within each phase.

    This is the "Work Breakdown Structure (WBS)" pattern
    used in project management — now applied to AI agents.

    Args:
        goal:    The top-level goal
        depth:   How many levels deep to decompose (2 = phase → step)
        breadth: How many subtasks per level

    Returns:
        Nested dict representing the decomposition tree.
    """
    prompt = f"""Decompose this goal hierarchically.
Goal: {goal}

Create exactly {breadth} major phases, each with {breadth} concrete sub-steps.
Return ONLY valid JSON:
{{
  "goal": "{goal}",
  "phases": [
    {{
      "id": "phase-1",
      "name": "Phase name",
      "description": "What this phase accomplishes",
      "steps": [
        {{"id": "1.1", "action": "Concrete action", "output": "Expected result"}},
        {{"id": "1.2", "action": "Concrete action", "output": "Expected result"}},
        {{"id": "1.3", "action": "Concrete action", "output": "Expected result"}}
      ]
    }}
  ]
}}"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You create hierarchical task decompositions. Return only JSON."},
            {"role": "user",   "content": prompt}
        ],
        temperature=0.1,
        max_tokens=1500,
        response_format={"type": "json_object"},
    )

    tree = json.loads(response.choices[0].message.content)

    # Pretty-print the tree
    print(f"\n{'═'*60}")
    print(f"  HIERARCHICAL PLAN: {goal[:50]}")
    print(f"{'═'*60}")
    for phase in tree.get("phases", []):
        print(f"\n  📂 [{phase['id']}] {phase['name']}")
        print(f"     {phase['description'][:70]}")
        for step in phase.get("steps", []):
            print(f"       ├── [{step['id']}] {step['action'][:60]}")
            print(f"       │   Output: {step.get('output','')[:50]}")

    return tree


# ── Demo ──────────────────────────────────────────────────
if __name__ == "__main__":
    # Test LLM decomposition
    plan = llm_decompose_goal(
        goal="Research Python async frameworks and write a comparison article",
        available_tools=["web_search(query)", "take_note(content, label)", "write_report(title, content)"],
        max_steps=6
    )

    # Test hierarchical decomposition
    tree = hierarchical_decompose(
        goal="Launch a mobile app in the Japanese market within 6 months",
        breadth=3
    )
```

---

## 3. Plan-and-Execute Pattern

Now let's build the full **Plan-and-Execute** engine. This is the production pattern used by OpenAI's Assistants API and LangChain's Plan-and-Execute agent: generate a complete plan upfront, then execute each step with full context from previous steps.

```
PLAN-AND-EXECUTE FLOW:
════════════════════════════════════════════════════════════════

  ┌──────────────────────────────────────────────────────────┐
  │                    PLAN PHASE                            │
  │                                                          │
  │  User Goal ─► Planner LLM ─► Structured Plan (JSON)     │
  │                │                                         │
  │                │  [step-1, step-2, step-3, step-4]       │
  └──────────────────────────────────────────────────────────┘
                   │
                   ▼
  ┌──────────────────────────────────────────────────────────┐
  │                   EXECUTE PHASE                          │
  │                                                          │
  │  For each step in plan:                                  │
  │                                                          │
  │  step-1 ──► Executor LLM ──► tool_call ──► result       │
  │               ↑ reads                        │           │
  │               │ plan + prev results           │ stored   │
  │               └───────────────────────────────┘          │
  │                                                          │
  │  step-2 ──► Executor LLM ──► tool_call ──► result       │
  │               ↑ reads step-1 result                      │
  │  ...                                                     │
  │                                                          │
  │  step-N ──► Executor LLM ──► final synthesis            │
  └──────────────────────────────────────────────────────────┘

  KEY INSIGHT: The PLANNER and EXECUTOR can be different LLMs!
  Planner: gpt-4o (smart, expensive) — plans once
  Executor: gpt-4o-mini (fast, cheap) — executes N times
  Typical cost split: 20% planning, 80% execution
```

```python
# =========================================================
# FILE: plan_execute_engine.py
# The Plan-and-Execute agent pattern.
# Separates planning (expensive) from execution (cheap).
# pip install openai python-dotenv
# =========================================================

import json
import os
import time
from typing import Callable
from openai import OpenAI
from dotenv import load_dotenv
from task_decomposition import Plan, SubTask, TaskStatus, llm_decompose_goal

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


# ══════════════════════════════════════════════════════════
# STEP EXECUTOR
# ══════════════════════════════════════════════════════════

class StepExecutor:
    """
    Executes a single SubTask step using the LLM + tools.
    Gets the step description and all previous results as context.
    """

    def __init__(
        self,
        tools:         list[dict],
        tool_fn_map:   dict[str, Callable],
        executor_model: str = "gpt-4o-mini",
    ):
        self.tools          = tools
        self.tool_fn_map    = tool_fn_map
        self.executor_model = executor_model

    def execute_step(
        self,
        step:             SubTask,
        completed_results: dict[str, str],   # step_id → result_text
        goal:             str,
    ) -> str:
        """
        Execute a single step in the plan.
        Builds a focused prompt for just this step, with context from completed steps.

        Args:
            step:               The SubTask to execute
            completed_results:  Results from previously completed steps
            goal:               The original high-level goal (for context)

        Returns:
            The result string from executing this step.
        """
        # Build context from relevant prior steps
        prior_context = ""
        if completed_results:
            relevant = {sid: res for sid, res in completed_results.items()
                        if sid in step.depends_on}
            if relevant:
                prior_context = "\n\nResults from prior steps:\n"
                for sid, res in relevant.items():
                    prior_context += f"[{sid}]: {res[:300]}\n"

        # Tool hint in the prompt guides the LLM toward the right tool
        tool_guidance = f"\nSuggested tool: {step.tool_hint}" if step.tool_hint else ""
        expected = f"\nExpected output: {step.expected_output}" if step.expected_output else ""

        step_prompt = (
            f"You are executing step [{step.id}] of a research plan.\n"
            f"Overall goal: {goal}\n"
            f"Your specific task: {step.description}"
            f"{tool_guidance}"
            f"{expected}"
            f"{prior_context}\n\n"
            f"Execute this step now. Use the most appropriate tool. "
            f"Return a concise but complete result for this specific step."
        )

        messages = [
            {"role": "system", "content": "You are a precise research executor. Complete the given step using your tools. Be specific and thorough."},
            {"role": "user",   "content": step_prompt}
        ]

        # Execute in a mini ReAct loop (up to 4 iterations per step)
        for iteration in range(4):
            response = client.chat.completions.create(
                model=self.executor_model,
                messages=messages,
                tools=self.tools if self.tools else None,
                tool_choice="auto" if self.tools else None,
                temperature=0.1,
                max_tokens=1000,
            )
            msg           = response.choices[0].message
            finish_reason = response.choices[0].finish_reason
            messages.append(msg)

            if finish_reason == "stop":
                return msg.content or "Step completed (no text output)"

            elif finish_reason == "tool_calls":
                for tc in msg.tool_calls:
                    fn   = self.tool_fn_map.get(tc.function.name)
                    args = json.loads(tc.function.arguments) if tc.function.arguments.strip() else {}
                    result = fn(**args) if fn else f"Unknown tool: {tc.function.name}"
                    messages.append({
                        "role":         "tool",
                        "tool_call_id": tc.id,
                        "content":      str(result)
                    })

        return "Step execution did not produce a clear result within iteration limit."


# ══════════════════════════════════════════════════════════
# THE PLAN-AND-EXECUTE AGENT
# ══════════════════════════════════════════════════════════

class PlanAndExecuteAgent:
    """
    Full Plan-and-Execute agent with:
    - LLM-based planning (generates structured JSON plan)
    - Step-by-step execution with dependency tracking
    - Result accumulation across steps
    - Plan revision when steps fail
    - Final synthesis from all results
    """

    def __init__(
        self,
        tools:          list[dict],
        tool_fn_map:    dict[str, Callable],
        planner_model:  str = "gpt-4o-mini",
        executor_model: str = "gpt-4o-mini",
    ):
        self.executor      = StepExecutor(tools, tool_fn_map, executor_model)
        self.planner_model = planner_model
        self.tools         = tools
        self.tool_fn_map   = tool_fn_map
        self.available_tool_names = [t["function"]["name"] for t in tools]

    def run(self, goal: str, context: str = "") -> str:
        """
        Full Plan-and-Execute run.

        Args:
            goal:    High-level goal to accomplish
            context: Optional background context

        Returns:
            Final synthesized answer/report.
        """
        start_time = time.time()
        print(f"\n{'═'*65}")
        print(f"  🗺️  PLAN-AND-EXECUTE AGENT")
        print(f"  Goal: {goal[:60]}")
        print(f"{'═'*65}")

        # ── PHASE 1: PLAN ─────────────────────────────────
        print("\n  📋 Phase 1: Generating plan...")
        plan = llm_decompose_goal(
            goal=goal,
            context=context,
            available_tools=self.available_tool_names,
            max_steps=7
        )

        # ── PHASE 2: EXECUTE ───────────────────────────────
        print("\n  ⚙️  Phase 2: Executing steps...\n")
        completed_results: dict[str, str] = {}
        failed_steps = []

        # Execute steps respecting dependency order.
        # We use a simple loop: try all pending-and-ready steps each round.
        max_rounds = len(plan.subtasks) * 2   # safety cap
        for round_num in range(max_rounds):
            ready_steps = plan.get_pending_ready()

            if not ready_steps:
                if plan.is_complete():
                    break    # all done
                # Check for blocked steps (dependencies all failed)
                for t in plan.subtasks:
                    if t.status == TaskStatus.PENDING:
                        deps_failed = any(
                            plan.subtasks[i].status == TaskStatus.FAILED
                            for i in range(len(plan.subtasks))
                            if plan.subtasks[i].id in t.depends_on
                        )
                        if deps_failed:
                            t.status = TaskStatus.SKIPPED
                break

            for step in ready_steps:
                print(f"  ▶  Executing [{step.id}]: {step.description[:55]}...")
                step.status = TaskStatus.RUNNING

                try:
                    result = self.executor.execute_step(
                        step=step,
                        completed_results=completed_results,
                        goal=goal,
                    )
                    step.status = TaskStatus.DONE
                    step.result = result
                    completed_results[step.id] = result
                    print(f"     ✅ Done. Result: {result[:80]}...")

                except Exception as e:
                    step.status = TaskStatus.FAILED
                    step.error  = str(e)
                    failed_steps.append(step.id)
                    print(f"     ❌ Failed: {e}")

        # Show final plan status
        print(plan.summary())

        # ── PHASE 3: SYNTHESIZE ────────────────────────────
        print("\n  📝 Phase 3: Synthesizing final answer...")
        final_answer = self._synthesize(goal, plan, completed_results)

        elapsed = time.time() - start_time
        print(f"\n  ⏱  Total time: {elapsed:.1f}s")
        print(f"  📊 Steps completed: {len(completed_results)}/{len(plan.subtasks)}")
        if failed_steps:
            print(f"  ⚠️  Failed steps:   {failed_steps}")

        return final_answer

    def _synthesize(
        self,
        goal:              str,
        plan:              Plan,
        completed_results: dict[str, str]
    ) -> str:
        """
        Use the LLM to synthesize all step results into a final answer.
        This is the "reduce" step in map-reduce: condense all findings.
        """
        results_text = "\n\n".join(
            f"[{sid}]: {res[:500]}"
            for sid, res in completed_results.items()
        )

        synthesis_prompt = (
            f"You collected research results for achieving this goal:\n"
            f"Goal: {goal}\n\n"
            f"Here are all the step results:\n{results_text}\n\n"
            f"Now write a comprehensive, well-structured final answer that:\n"
            f"1. Directly addresses the original goal\n"
            f"2. Uses all relevant information gathered\n"
            f"3. Is formatted clearly with sections and bullet points\n"
            f"4. Notes any gaps or limitations in the research"
        )

        response = client.chat.completions.create(
            model=self.planner_model,    # use the smarter model for synthesis
            messages=[
                {"role": "system", "content": "You synthesize research findings into clear, comprehensive reports."},
                {"role": "user",   "content": synthesis_prompt}
            ],
            temperature=0.2,
            max_tokens=2000,
        )
        return response.choices[0].message.content
```

---

## 4. Tree of Thoughts — Exploring Multiple Paths

ReAct and Plan-and-Execute both follow **one path** through the problem. That works for tasks with clear correct answers. But for genuinely hard reasoning problems — debugging, strategy decisions, complex analysis — there might be **multiple plausible approaches**, and following just one might lead you down a dead end.

**Tree of Thoughts (ToT)** (Yao et al., 2023) explores multiple reasoning paths simultaneously and picks the best one.

```
TREE OF THOUGHTS — VISUAL:
════════════════════════════════════════════════════════════════

  PROBLEM: "Why is our API returning 500 errors intermittently?"

                        [ROOT: Problem]
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
     [Thought A]       [Thought B]       [Thought C]
   "Database        "Memory leak     "Race condition
    connection       in connection    in concurrent
    pool exhausted"  pooling"         requests"
            │                ▼                │
          EVAL            EVAL             EVAL
         Score:7         Score:9          Score:5
            │                │                │
         [A.1]            [B.1]           PRUNED ✗
    "Check pool      "Check heap
     config limits"   memory trends"
            │                │
          EVAL            EVAL
         Score:8         Score:9
            │                │
         [A.2]            [B.2]
    "Increase pool   "Profile memory
     size to 50"      usage in prod"
                             │
                           [B.3]  ← BEST PATH
                      "Found: connection
                       not being released
                       in error handlers"
                             │
                       ┌─────┘
                    SOLUTION ✅
               "Add finally: blocks to
                release connections
                even on exceptions"

  TRADITIONAL APPROACH would have picked Thought A (plausible!)
  and spent time tuning pool size → wrong fix.
  ToT's evaluation caught that B is more promising at step 1.
```

### How ToT Works — The Algorithm

```
TREE OF THOUGHTS ALGORITHM:
════════════════════════════════════════════════════════════════

  GENERATE: At each node, generate N candidate next thoughts.
  EVALUATE: Score each candidate (0-10) for promise/correctness.
  SELECT:   Keep only the top K candidates (prune the rest).
  REPEAT:   Continue generating/evaluating until solution found.

  Parameters you control:
  ┌──────────────────────────────────────────────────────────┐
  │  breadth (B): thoughts generated per node (e.g., 3)     │
  │  depth (D):   max reasoning steps before answer (e.g., 4)│
  │  beam_width:  how many paths survive pruning (e.g., 2)   │
  │                                                          │
  │  Total LLM calls ≈ B × D × beam_width                   │
  │  Example: B=3, D=4, beam=2 → ~24 LLM calls              │
  │  Use for genuinely hard problems only — it's expensive.  │
  └──────────────────────────────────────────────────────────┘
```

```python
# =========================================================
# FILE: tree_of_thoughts.py
# Tree of Thoughts implementation for complex reasoning.
# pip install openai python-dotenv
# =========================================================

import os
import json
from dataclasses import dataclass, field
from typing import Optional
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


# ══════════════════════════════════════════════════════════
# TOT DATA STRUCTURES
# ══════════════════════════════════════════════════════════

@dataclass
class ThoughtNode:
    """
    A single node in the Tree of Thoughts.
    Represents one reasoning step / hypothesis.
    """
    id:           str
    content:      str              # the thought text
    parent_id:    Optional[str]    # ID of parent node (None for root)
    depth:        int              # how deep in the tree (0 = root thoughts)
    score:        float = 0.0      # evaluation score (0-10)
    is_solution:  bool  = False    # is this a final answer?
    children:     list["ThoughtNode"] = field(default_factory=list)
    path_from_root: list[str] = field(default_factory=list)
    # path_from_root: list of thought contents from root to here.
    # This gives the LLM the full reasoning chain when generating child thoughts.

    def get_context_string(self) -> str:
        """Build the reasoning chain as a readable string for LLM context."""
        if not self.path_from_root:
            return ""
        lines = ["Previous reasoning steps:"]
        for i, thought in enumerate(self.path_from_root, 1):
            lines.append(f"Step {i}: {thought}")
        return "\n".join(lines)


# ══════════════════════════════════════════════════════════
# TOT CORE OPERATIONS
# ══════════════════════════════════════════════════════════

def generate_thoughts(
    problem:     str,
    parent_node: Optional[ThoughtNode],
    n_thoughts:  int = 3,
    model:       str = "gpt-4o-mini"
) -> list[str]:
    """
    Generate N candidate thoughts for the next reasoning step.
    Each thought is one plausible next step toward solving the problem.

    Args:
        problem:     The original problem statement
        parent_node: The current node (None for root thoughts)
        n_thoughts:  How many candidate thoughts to generate
        model:       LLM model name

    Returns:
        List of thought strings (candidate next steps)
    """
    prior_context = ""
    if parent_node and parent_node.path_from_root:
        prior_context = parent_node.get_context_string() + f"\nStep {parent_node.depth + 1}: {parent_node.content}"

    prompt = f"""Problem: {problem}

{prior_context}

Generate exactly {n_thoughts} DIFFERENT next reasoning steps.
Each step should:
- Take a DIFFERENT analytical angle than the others
- Be specific and build toward a solution
- Represent a plausible path from the current state

Return ONLY JSON:
{{
  "thoughts": [
    "First candidate reasoning step",
    "Second candidate reasoning step (different approach)",
    "Third candidate reasoning step (yet another angle)"
  ]
}}"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You generate diverse, specific reasoning steps for problem solving. Return only JSON."},
            {"role": "user",   "content": prompt}
        ],
        temperature=0.7,
        # ↑ HIGHER temperature here intentionally!
        # We WANT diversity in thought generation.
        # Low temp would make all 3 thoughts nearly identical.
        # This is different from execution (where we use 0.1 for consistency).
        max_tokens=600,
        response_format={"type": "json_object"},
    )

    data     = json.loads(response.choices[0].message.content)
    thoughts = data.get("thoughts", data.get("steps", data.get("ideas", [])))
    return thoughts[:n_thoughts]   # ensure we don't return more than requested


def evaluate_thought(
    problem:    str,
    thought:    str,
    path:       list[str],
    model:      str = "gpt-4o-mini"
) -> tuple[float, str, bool]:
    """
    Score a thought (0-10) for how promising it is.
    Also determines if this thought IS the final solution.

    Args:
        problem: The original problem
        thought: The thought to evaluate
        path:    Previous thoughts leading to this one
        model:   LLM model name

    Returns:
        Tuple of (score: float, reasoning: str, is_solution: bool)
    """
    path_str = "\n".join(f"Step {i+1}: {t}" for i, t in enumerate(path)) if path else "None yet."

    eval_prompt = f"""Problem: {problem}

Reasoning path so far:
{path_str}

Current thought to evaluate: {thought}

Evaluate this thought on two dimensions:
1. Promise (0-10): How likely is this path to reach a correct solution?
   - 9-10: Almost certainly leads to solution
   - 7-8:  Promising, worth pursuing
   - 5-6:  Uncertain, could go either way
   - 3-4:  Unlikely to help, probably a dead end
   - 0-2:  Wrong direction / definitely won't work

2. Is this thought itself a complete, correct solution to the problem?

Return ONLY JSON:
{{
  "score": 7.5,
  "reasoning": "One sentence explaining the score",
  "is_solution": false,
  "solution_text": ""
}}

If is_solution is true, put the full final answer in solution_text."""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You evaluate reasoning steps for problem-solving potential. Return only JSON."},
            {"role": "user",   "content": eval_prompt}
        ],
        temperature=0.1,    # low temp for consistent evaluation
        max_tokens=300,
        response_format={"type": "json_object"},
    )

    data        = json.loads(response.choices[0].message.content)
    score       = float(data.get("score", 5.0))
    reasoning   = data.get("reasoning", "")
    is_solution = bool(data.get("is_solution", False))

    return score, reasoning, is_solution


# ══════════════════════════════════════════════════════════
# THE TREE OF THOUGHTS SOLVER
# ══════════════════════════════════════════════════════════

class TreeOfThoughtsSolver:
    """
    Implements the Tree of Thoughts reasoning algorithm.
    Uses Beam Search to explore and prune the reasoning tree.

    Beam Search = keep the top K most promising paths at each level.
    This prevents exponential explosion while still exploring diversity.
    """

    def __init__(
        self,
        breadth:    int   = 3,      # thoughts per node
        max_depth:  int   = 4,      # max reasoning steps
        beam_width: int   = 2,      # paths to keep after pruning
        model:      str   = "gpt-4o-mini",
        verbose:    bool  = True,
    ):
        self.breadth    = breadth
        self.max_depth  = max_depth
        self.beam_width = beam_width
        self.model      = model
        self.verbose    = verbose
        self.all_nodes: list[ThoughtNode] = []
        self._node_counter = 0

    def _new_node(
        self,
        content:        str,
        parent:         Optional[ThoughtNode],
        depth:          int
    ) -> ThoughtNode:
        """Create a new ThoughtNode with auto-generated ID."""
        self._node_counter += 1
        node_id = f"node-{self._node_counter}"

        # Build the path by extending the parent's path
        path = (parent.path_from_root + [parent.content]) if parent else []

        node = ThoughtNode(
            id=node_id,
            content=content,
            parent_id=parent.id if parent else None,
            depth=depth,
            path_from_root=path
        )
        self.all_nodes.append(node)
        return node

    def solve(self, problem: str) -> str:
        """
        Run Tree of Thoughts on a problem using Beam Search.

        Args:
            problem: The problem to solve

        Returns:
            The best solution found.
        """
        if self.verbose:
            print(f"\n{'═'*65}")
            print(f"  🌳 TREE OF THOUGHTS SOLVER")
            print(f"  Problem: {problem[:60]}")
            print(f"  Config:  breadth={self.breadth}, depth={self.max_depth}, beam={self.beam_width}")
            print(f"{'═'*65}")

        # Beam = the currently active frontier of nodes.
        # We start with None (root level — no parent).
        current_beam: list[Optional[ThoughtNode]] = [None]
        best_solution: Optional[str] = None
        best_score: float = 0.0

        for depth in range(self.max_depth):
            if self.verbose:
                print(f"\n  ── Depth {depth + 1} ──────────────────────────────────")

            # ── GENERATE: Expand each node in the beam ────
            all_candidates: list[ThoughtNode] = []

            for parent in current_beam:
                # Generate breadth candidate thoughts for this parent
                thoughts = generate_thoughts(
                    problem=problem,
                    parent_node=parent,
                    n_thoughts=self.breadth,
                    model=self.model
                )

                for think_text in thoughts:
                    node = self._new_node(think_text, parent, depth + 1)

                    # ── EVALUATE: Score this thought ───────
                    score, reasoning, is_solution = evaluate_thought(
                        problem=problem,
                        thought=think_text,
                        path=node.path_from_root,
                        model=self.model
                    )
                    node.score       = score
                    node.is_solution = is_solution

                    if self.verbose:
                        status = "✅ SOLUTION!" if is_solution else f"Score: {score:.1f}"
                        print(f"    [{node.id}] {status}")
                        print(f"    Thought: {think_text[:70]}")
                        print(f"    Eval:    {reasoning[:70]}\n")

                    # Check for solution
                    if is_solution:
                        if score > best_score:
                            best_score    = score
                            best_solution = think_text
                            if self.verbose:
                                print(f"  🎯 Solution found! Score: {score}")

                    all_candidates.append(node)

            # ── SELECT: Prune to beam_width best candidates
            all_candidates.sort(key=lambda n: n.score, reverse=True)
            current_beam = all_candidates[:self.beam_width]
            # ↑ Keep only the top K nodes by score.
            # The rest are abandoned — their paths are not explored further.
            # This is the pruning that makes ToT tractable.

            if self.verbose:
                print(f"  Beam after pruning: {[f'{n.id}(score={n.score:.1f})' for n in current_beam]}")

            # Early exit if we found a good solution
            if best_solution and best_score >= 8.5:
                if self.verbose:
                    print(f"\n  ✅ High-confidence solution found. Stopping early.")
                break

        # If no explicit solution was flagged, use the highest-scored leaf node
        if not best_solution:
            best_node   = max(self.all_nodes, key=lambda n: n.score)
            best_solution = self._generate_final_answer(problem, best_node)

        return best_solution

    def _generate_final_answer(self, problem: str, best_node: ThoughtNode) -> str:
        """
        Given the best reasoning path, generate a polished final answer.
        Used when no step was explicitly flagged as a solution.
        """
        path_context = best_node.get_context_string() + f"\nFinal step: {best_node.content}"

        response = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You synthesize a reasoning chain into a clear, definitive answer."},
                {"role": "user",   "content": f"Problem: {problem}\n\n{path_context}\n\nBased on this reasoning, provide the complete, definitive answer."}
            ],
            temperature=0.1,
            max_tokens=800,
        )
        return response.choices[0].message.content

    def print_tree_summary(self) -> None:
        """Print a visual summary of the explored tree."""
        print(f"\n{'─'*65}")
        print(f"  🌳 TREE SUMMARY ({len(self.all_nodes)} nodes explored)")
        print(f"{'─'*65}")
        # Sort by depth then score
        sorted_nodes = sorted(self.all_nodes, key=lambda n: (n.depth, -n.score))
        for node in sorted_nodes:
            indent = "  " * node.depth
            score_bar = "█" * int(node.score)
            solution_flag = " ← SOLUTION" if node.is_solution else ""
            print(f"  {indent}[{node.id}] Score: {node.score:.1f} {score_bar}{solution_flag}")
            print(f"  {indent}  {node.content[:60]}")


# ── Demo ──────────────────────────────────────────────────
if __name__ == "__main__":
    solver = TreeOfThoughtsSolver(
        breadth=3,
        max_depth=3,
        beam_width=2,
        verbose=True
    )

    solution = solver.solve(
        "Our Python web app has a memory leak. Server RAM usage grows by "
        "50MB per hour under normal load and crashes every 20 hours. "
        "The app uses FastAPI, SQLAlchemy, and Celery. How do we find and fix the leak?"
    )

    print(f"\n{'═'*65}")
    print("  🎯 FINAL SOLUTION:")
    print(f"{'═'*65}")
    print(solution)
    solver.print_tree_summary()
```

---

## 5. Self-Reflection Loops — Agents That Critique Themselves

The most humbling thing you can teach an LLM to do is **criticize its own output**. The basic idea: after generating an answer, a second LLM call (or the same LLM with a fresh perspective) reviews the answer for errors, gaps, and quality issues. If the critique finds problems, the agent revises.

```
SELF-REFLECTION LOOP:
════════════════════════════════════════════════════════════════

  ┌────────────────────────────────────────────────────────┐
  │                                                        │
  │   INPUT ──► GENERATE ──► CRITIQUE ────► REVISE        │
  │                │              │              │         │
  │           "Initial       "Found 3         "Revised    │
  │            answer"        issues:          answer     │
  │                          1. Missing X      with all   │
  │                          2. Wrong Y        issues     │
  │                          3. Vague Z"       fixed"     │
  │                               │                │      │
  │                           Passes? ──No──► REVISE again│
  │                               │                       │
  │                              Yes                      │
  │                               │                       │
  │                             OUTPUT                     │
  └────────────────────────────────────────────────────────┘

  APPLICATIONS:
  ┌──────────────────────────────────────────────────────────┐
  │  CODE REVIEW LOOP     Generated code → Critique →       │
  │  (compiler-like)      "Missing null check" → Fix       │
  │                                                          │
  │  FACTUAL ACCURACY     Research answer → Critique →      │
  │  LOOP                 "Needs source for claim X" → Fix  │
  │                                                          │
  │  COMPLETENESS LOOP    Report → Critique → "Missing      │
  │                       competitor 3" → Add section      │
  │                                                          │
  │  TONE LOOP            Email draft → Critique →          │
  │                       "Too aggressive in line 3" → Fix  │
  └──────────────────────────────────────────────────────────┘

  COST: Each reflection = 2 LLM calls (critique + revise).
  LIMIT: Usually 2-3 reflection rounds. Diminishing returns after 3.
  WHEN TO USE: High-stakes outputs (code, reports, customer comms).
```

```python
# =========================================================
# FILE: self_reflection.py
# Self-reflection patterns for agents.
# Three variants:
#   A) Simple reflect-revise loop
#   B) Structured critique with rubric
#   C) Constitutional AI self-critique
# pip install openai python-dotenv
# =========================================================

import os
from dataclasses import dataclass
from typing import Optional
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


# ══════════════════════════════════════════════════════════
# VARIANT A: SIMPLE REFLECT-REVISE LOOP
# ══════════════════════════════════════════════════════════

def reflect_and_revise(
    task:           str,
    initial_output: str,
    max_rounds:     int  = 3,
    model:          str  = "gpt-4o-mini",
    verbose:        bool = True,
) -> str:
    """
    Simple self-reflection loop.
    Loops: critique → revise → critique → revise until quality passes.

    Args:
        task:           The original task/question
        initial_output: The agent's initial attempt
        max_rounds:     Maximum critique-revise cycles (usually 2-3)
        model:          LLM model name
        verbose:        Print each round

    Returns:
        The final, revised output after reflection.
    """
    current   = initial_output
    round_num = 0

    if verbose:
        print(f"\n{'─'*65}")
        print(f"  🔄 SELF-REFLECTION LOOP")
        print(f"  Max rounds: {max_rounds}")
        print(f"{'─'*65}")

    while round_num < max_rounds:
        round_num += 1
        if verbose:
            print(f"\n  ── Round {round_num} ──────────────────────────────────")

        # ── CRITIQUE ────────────────────────────────────────
        # A fresh LLM call reads the output with "critic eyes."
        # Using the SAME model with a DIFFERENT system prompt feels genuinely different
        # because the system prompt dramatically shifts the model's "perspective."
        critique_response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role":    "system",
                    "content": (
                        "You are a rigorous quality critic. Your job is to find EVERY flaw "
                        "in the given response. Be harsh but fair. Look for:\n"
                        "- Factual errors or unsupported claims\n"
                        "- Missing important information\n"
                        "- Logical inconsistencies or gaps in reasoning\n"
                        "- Poor structure or unclear writing\n"
                        "- Vague or unactionable statements\n\n"
                        "End with: VERDICT: PASS (minor issues only, output is good enough) "
                        "or VERDICT: REVISE (significant issues that must be fixed)."
                    )
                },
                {
                    "role":    "user",
                    "content": f"Task: {task}\n\nResponse to critique:\n{current}"
                }
            ],
            temperature=0.3,   # slight warmth to catch diverse issues
            max_tokens=600,
        )
        critique = critique_response.choices[0].message.content

        if verbose:
            print(f"  📋 CRITIQUE:\n  {critique[:250]}...")

        # Check verdict: PASS means quality is acceptable, stop looping
        if "VERDICT: PASS" in critique.upper():
            if verbose:
                print(f"  ✅ Quality check PASSED. No further revision needed.")
            break

        # ── REVISE ──────────────────────────────────────────
        # Give the LLM the original task, its current answer, and the critique.
        # Ask it to produce an improved version that addresses all issues.
        revise_response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role":    "system",
                    "content": (
                        "You are revising your previous response based on a critique. "
                        "Address EVERY issue raised in the critique. "
                        "Produce a significantly better version — don't just make cosmetic changes."
                    )
                },
                {
                    "role":    "user",
                    "content": (
                        f"Original task: {task}\n\n"
                        f"Your previous response:\n{current}\n\n"
                        f"Critique:\n{critique}\n\n"
                        f"Write an improved response that addresses all issues in the critique."
                    )
                }
            ],
            temperature=0.1,
            max_tokens=1500,
        )
        current = revise_response.choices[0].message.content

        if verbose:
            print(f"  ✏️  REVISED OUTPUT:\n  {current[:200]}...")

    if verbose:
        print(f"\n  Reflection complete. Rounds used: {round_num}")

    return current


# ══════════════════════════════════════════════════════════
# VARIANT B: STRUCTURED RUBRIC CRITIQUE
# ══════════════════════════════════════════════════════════

@dataclass
class RubricItem:
    """One criterion in an evaluation rubric."""
    name:       str
    question:   str        # evaluator's exact question to assess this criterion
    weight:     float = 1.0   # relative importance (higher = more important)
    threshold:  float = 0.7   # minimum score (0-1) to pass this criterion


def evaluate_with_rubric(
    task:    str,
    output:  str,
    rubric:  list[RubricItem],
    model:   str = "gpt-4o-mini"
) -> dict:
    """
    Evaluate an output against a structured rubric.
    Each criterion is scored independently.

    Args:
        task:   The original task
        output: The output to evaluate
        rubric: List of RubricItem criteria
        model:  LLM model name

    Returns:
        Dict with per-criterion scores, overall score, and pass/fail.
    """
    criteria_json = json.dumps([
        {"name": r.name, "question": r.question, "weight": r.weight}
        for r in rubric
    ], indent=2)

    eval_prompt = f"""Evaluate this response against these criteria.

Task: {task}

Response: {output[:1000]}

Evaluation Criteria (JSON): {criteria_json}

For each criterion, give a score from 0.0 to 1.0 and a brief reason.
Return ONLY valid JSON:
{{
  "criteria_scores": [
    {{"name": "criterion_name", "score": 0.85, "reason": "Brief reason"}},
    ...
  ],
  "overall_feedback": "One paragraph overall assessment",
  "critical_issues": ["Any must-fix issues"] 
}}"""

    import json as json_module
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You evaluate responses against structured rubrics. Return only JSON."},
            {"role": "user",   "content": eval_prompt}
        ],
        temperature=0.1,
        max_tokens=600,
        response_format={"type": "json_object"},
    )
    eval_data = json_module.loads(response.choices[0].message.content)

    # Calculate weighted overall score
    criteria_scores = eval_data.get("criteria_scores", [])
    total_weight  = sum(r.weight for r in rubric)
    weighted_sum  = 0.0
    failed_criteria = []

    score_map = {s["name"]: s["score"] for s in criteria_scores}
    for criterion in rubric:
        score = score_map.get(criterion.name, 0.0)
        weighted_sum += score * criterion.weight
        if score < criterion.threshold:
            failed_criteria.append(criterion.name)

    overall_score = weighted_sum / total_weight if total_weight > 0 else 0.0

    return {
        "overall_score":    round(overall_score, 3),
        "passed":           len(failed_criteria) == 0,
        "failed_criteria":  failed_criteria,
        "criteria_scores":  criteria_scores,
        "overall_feedback": eval_data.get("overall_feedback", ""),
        "critical_issues":  eval_data.get("critical_issues", []),
    }


def rubric_reflect_and_revise(
    task:        str,
    output:      str,
    rubric:      list[RubricItem],
    max_rounds:  int = 3,
    model:       str = "gpt-4o-mini",
    verbose:     bool = True,
) -> tuple[str, dict]:
    """
    Rubric-based reflection loop.
    Revise until all rubric criteria pass or max rounds reached.

    Returns:
        Tuple of (final_output, final_evaluation_dict)
    """
    import json as json_module

    current = output
    for round_num in range(max_rounds):
        eval_result = evaluate_with_rubric(task, current, rubric, model)

        if verbose:
            print(f"\n  [Round {round_num+1}] Score: {eval_result['overall_score']:.2f} | "
                  f"Pass: {eval_result['passed']}")
            if eval_result["failed_criteria"]:
                print(f"  Failed criteria: {eval_result['failed_criteria']}")

        if eval_result["passed"]:
            if verbose:
                print(f"  ✅ All criteria passed!")
            return current, eval_result

        # Build targeted revision prompt using failed criteria
        failed_detail = "\n".join(
            f"- {s['name']}: {s['reason']}"
            for s in eval_result["criteria_scores"]
            if s["name"] in eval_result["failed_criteria"]
        )

        revise_response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role":    "system",
                    "content": "You improve responses to meet specific quality criteria. Be thorough and specific."
                },
                {
                    "role":    "user",
                    "content": (
                        f"Task: {task}\n\n"
                        f"Current response:\n{current}\n\n"
                        f"These quality criteria FAILED and must be fixed:\n{failed_detail}\n\n"
                        f"Overall feedback: {eval_result['overall_feedback']}\n\n"
                        f"Write an improved response that specifically addresses all failed criteria."
                    )
                }
            ],
            temperature=0.1,
            max_tokens=1500,
        )
        current = revise_response.choices[0].message.content

    final_eval = evaluate_with_rubric(task, current, rubric, model)
    return current, final_eval


# ══════════════════════════════════════════════════════════
# VARIANT C: CONSTITUTIONAL SELF-CRITIQUE
# ══════════════════════════════════════════════════════════
# Inspired by Anthropic's Constitutional AI (Bai et al., 2022).
# The agent has a "constitution" — a set of principles it must follow.
# After generating, it checks its output against each principle
# and revises if any are violated.

SUPPORT_AGENT_CONSTITUTION = [
    "Be honest: never claim certainty about information you don't have.",
    "Be helpful: always provide at least one actionable next step.",
    "Be safe: never promise outcomes you cannot guarantee (e.g., specific refund timings).",
    "Be empathetic: acknowledge the customer's frustration before jumping into solutions.",
    "Be complete: address every question the customer asked, not just the first one.",
    "Be transparent: if you need to escalate, explain exactly why.",
]


def constitutional_critique(
    output:       str,
    principles:   list[str],
    model:        str = "gpt-4o-mini"
) -> tuple[bool, list[str]]:
    """
    Check an output against constitutional principles.

    Args:
        output:     The text to check
        principles: List of principle strings
        model:      LLM model name

    Returns:
        Tuple of (all_passed: bool, violations: list[str])
    """
    import json as json_module
    principles_formatted = "\n".join(f"{i+1}. {p}" for i, p in enumerate(principles))

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role":    "system",
                "content": "You check texts for principle violations. Return only JSON."
            },
            {
                "role":    "user",
                "content": (
                    f"Check this response against each principle:\n\n"
                    f"Response: {output}\n\n"
                    f"Principles:\n{principles_formatted}\n\n"
                    f"For each violated principle, explain why. Return JSON:\n"
                    f'{{"violations": ["Principle 3 violated: the response promised a 24h refund without checking policy"]}}'
                    f'\nReturn {{"violations": []}} if all principles are satisfied.'
                )
            }
        ],
        temperature=0.1,
        max_tokens=400,
        response_format={"type": "json_object"},
    )

    data       = json_module.loads(response.choices[0].message.content)
    violations = data.get("violations", [])
    return len(violations) == 0, violations


# ── Demo: Compare all three reflection approaches ─────────
if __name__ == "__main__":
    import json

    TASK = "Write a customer support response to: 'I was charged twice and I need a refund immediately!'"

    INITIAL_RESPONSE = (
        "Hi. You were charged twice. I'll process a refund. "
        "It takes 5-7 days. Let me know if you need anything else."
    )

    print("=" * 65)
    print("  🔄 SELF-REFLECTION DEMO")
    print("=" * 65)
    print(f"\n  Initial (poor) response:\n  {INITIAL_RESPONSE}\n")

    # Test Variant A: Simple reflection
    print("\n─── VARIANT A: Simple Reflect-Revise ───")
    final_a = reflect_and_revise(
        task=TASK,
        initial_output=INITIAL_RESPONSE,
        max_rounds=2,
        verbose=True
    )

    # Test Variant B: Rubric-based
    print("\n─── VARIANT B: Rubric-Based Reflection ───")
    support_rubric = [
        RubricItem("empathy",      "Does it acknowledge the customer's frustration?", weight=2.0, threshold=0.7),
        RubricItem("completeness", "Does it address both the double charge AND the refund timeline?", weight=1.5, threshold=0.8),
        RubricItem("actionability","Does it provide a clear next step?",               weight=1.5, threshold=0.8),
        RubricItem("accuracy",     "Are refund timelines stated as approximate, not guaranteed?", weight=1.0, threshold=0.6),
    ]
    final_b, eval_b = rubric_reflect_and_revise(
        task=TASK,
        output=INITIAL_RESPONSE,
        rubric=support_rubric,
        max_rounds=2,
        verbose=True
    )
    print(f"\n  Final score: {eval_b['overall_score']:.2f}")

    # Test Variant C: Constitutional
    print("\n─── VARIANT C: Constitutional Critique ───")
    passed, violations = constitutional_critique(INITIAL_RESPONSE, SUPPORT_AGENT_CONSTITUTION)
    print(f"  All principles passed: {passed}")
    for v in violations:
        print(f"  ⚠️  {v}")
```

---

## 6. Self-Consistency — Voting Across Reasoning Runs

ToT explores paths within one reasoning chain. **Self-Consistency** (Wang et al., 2022) takes a different approach: run the *same problem multiple times* with different random seeds, then **vote** on the most common answer. No expensive tree search needed — just brute-force diversity.

```
SELF-CONSISTENCY — HOW IT WORKS:
════════════════════════════════════════════════════════════════

  PROBLEM: "Should we add multi-currency support to our SaaS?"

  RUN 1 (temp=0.7): "Yes — 35% of users are international.
                     Revenue opportunity: $2M ARR."

  RUN 2 (temp=0.7): "Yes — competitor analysis shows 80% of
                     alternatives already have it."

  RUN 3 (temp=0.7): "Yes — but phase it: start with EUR and GBP
                     only in Q3, expand Q4."

  RUN 4 (temp=0.7): "No — technical debt from currency rounding
                     is severe. Delay until team grows."

  RUN 5 (temp=0.7): "Yes — essential for enterprise tier
                     customers who need EUR invoicing."

  VOTE TALLY:
    YES (with various details): 4/5 runs
    NO:                         1/5 runs

  CONSENSUS ANSWER: YES — 80% agreement
  Final answer synthesizes the specific reasons from YES runs.

  WHEN TO USE SELF-CONSISTENCY:
  ────────────────────────────────────────────────────────────
  ✅ High-stakes binary decisions (go/no-go, yes/no, A/B)
  ✅ Mathematical reasoning (check if all runs agree on answer)
  ✅ Classification tasks (sentiment, category, priority)
  ✅ When you need confidence intervals on LLM outputs
  ✗ Not needed for creative writing (diversity is the point)
  ✗ Overkill for simple factual retrieval
```

```python
# =========================================================
# FILE: self_consistency.py
# Self-consistency voting for reliable agent decisions.
# pip install openai python-dotenv
# =========================================================

import os
import json
from collections import Counter
from dataclasses import dataclass
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


@dataclass
class ConsistencyResult:
    """Result of a self-consistency voting run."""
    final_answer:   str
    confidence:     float        # fraction of runs that agreed (0.0-1.0)
    vote_counts:    dict         # answer → count
    all_responses:  list[str]    # raw responses from each run
    n_runs:         int


def self_consistency_vote(
    prompt:         str,
    n_runs:         int   = 5,
    temperature:    float = 0.7,    # MUST be > 0 to get diverse answers
    model:          str   = "gpt-4o-mini",
    answer_format:  str   = "text", # "text", "yes_no", or "json"
    verbose:        bool  = True,
) -> ConsistencyResult:
    """
    Run the same prompt N times and vote on the most consistent answer.

    Args:
        prompt:         The problem/question to answer
        n_runs:         Number of independent runs (5-10 typical)
        temperature:    Sampling temperature — MUST be > 0 for diversity!
                        0.7-0.9 recommended for good diversity.
        model:          LLM model to use
        answer_format:  How to extract the final answer from each response:
                        "text"   → use the full response text
                        "yes_no" → extract yes/no verdict
                        "json"   → parse JSON from each response
        verbose:        Print each run's answer

    Returns:
        ConsistencyResult with consensus answer and confidence.
    """
    if temperature == 0.0:
        raise ValueError(
            "temperature must be > 0 for self-consistency! "
            "With temp=0, all runs are identical — there's nothing to vote on. "
            "Use temperature=0.7 to get diverse reasoning paths."
        )

    all_responses = []
    extracted_answers = []

    if verbose:
        print(f"\n{'─'*65}")
        print(f"  🗳️  SELF-CONSISTENCY VOTING")
        print(f"  Runs: {n_runs} | Temp: {temperature} | Format: {answer_format}")
        print(f"{'─'*65}")

    # ── Run N independent completions ─────────────────────
    for run_i in range(n_runs):
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role":    "system",
                    "content": "Reason carefully about the problem. Show your thinking, then give a clear final answer."
                },
                {
                    "role":    "user",
                    "content": prompt
                }
            ],
            temperature=temperature,
            max_tokens=800,
            # n=1 — we make N separate API calls, not n=N in one call.
            # Reason: using n>1 in one call uses the SAME KV cache,
            # which means the reasoning is correlated. Separate calls
            # produce truly independent reasoning paths.
        )

        raw_response = response.choices[0].message.content
        all_responses.append(raw_response)

        # Extract the answer based on format
        if answer_format == "yes_no":
            answer = extract_yes_no(raw_response)
        elif answer_format == "json":
            answer = extract_json_answer(raw_response)
        else:
            # For free-text, use the last sentence or paragraph as the "answer"
            # This is a heuristic — the final conclusion tends to be at the end.
            answer = raw_response.strip().split("\n")[-1][:100]

        extracted_answers.append(answer)

        if verbose:
            print(f"  Run {run_i+1}: {answer[:80]}")

    # ── Vote on most common answer ─────────────────────────
    vote_counter = Counter(extracted_answers)
    winner, winner_count = vote_counter.most_common(1)[0]
    confidence = winner_count / n_runs

    if verbose:
        print(f"\n  Vote Results:")
        for answer, count in vote_counter.most_common():
            bar = "█" * count
            print(f"    {bar} ({count}/{n_runs}) {answer[:60]}")
        print(f"\n  Winner: '{winner}' with {confidence:.0%} confidence")

    # ── Synthesize final answer ───────────────────────────
    # The winning answer is a short extracted fragment.
    # If confidence is high and answer_format is yes_no, that's enough.
    # For free-text, synthesize a final answer from the majority-agreement responses.
    if answer_format == "text" and confidence < 1.0:
        majority_responses = [
            all_responses[i] for i, a in enumerate(extracted_answers) if a == winner
        ]
        final_answer = _synthesize_majority_responses(prompt, majority_responses)
    else:
        final_answer = winner

    return ConsistencyResult(
        final_answer=final_answer,
        confidence=confidence,
        vote_counts=dict(vote_counter),
        all_responses=all_responses,
        n_runs=n_runs,
    )


def extract_yes_no(text: str) -> str:
    """Extract yes/no verdict from a response."""
    text_lower = text.lower()
    # Look for explicit yes/no patterns
    for line in reversed(text_lower.split("\n")):
        line = line.strip()
        if line.startswith("verdict:") or line.startswith("answer:") or line.startswith("conclusion:"):
            if "yes" in line:
                return "YES"
            if "no" in line:
                return "NO"
    # Fallback: overall sentiment of the last 200 chars
    last_portion = text_lower[-200:]
    yes_count = last_portion.count("yes") + last_portion.count("recommend") + last_portion.count("should")
    no_count  = last_portion.count("no") + last_portion.count("not recommend") + last_portion.count("should not")
    if yes_count > no_count:
        return "YES"
    if no_count > yes_count:
        return "NO"
    return "UNCLEAR"


def extract_json_answer(text: str) -> str:
    """Extract a structured JSON answer from a response."""
    import re
    # Find JSON block in response
    json_match = re.search(r"\{[^{}]+\}", text, re.DOTALL)
    if json_match:
        try:
            data = json.loads(json_match.group())
            # Try common answer field names
            for key in ("answer", "verdict", "decision", "result", "recommendation"):
                if key in data:
                    return str(data[key])
        except json.JSONDecodeError:
            pass
    return text[-100:].strip()    # fallback to last 100 chars


def _synthesize_majority_responses(prompt: str, majority_responses: list[str]) -> str:
    """Synthesize a polished answer from the majority-agreement responses."""
    combined = "\n\n---\n\n".join(f"Reasoning path {i+1}:\n{r[:400]}"
                                    for i, r in enumerate(majority_responses))
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You synthesize multiple reasoning paths into one clear, comprehensive answer."},
            {"role": "user",   "content": f"Problem: {prompt}\n\nMultiple reasoning paths that reached consistent conclusions:\n{combined}\n\nSynthesize these into one definitive, well-reasoned answer."}
        ],
        temperature=0.1,
        max_tokens=800,
    )
    return response.choices[0].message.content


# ── Demo ──────────────────────────────────────────────────
if __name__ == "__main__":
    # Test 1: Yes/No decision
    result_1 = self_consistency_vote(
        prompt=(
            "We run a B2B SaaS with 500 customers. 40% of revenue comes from 3 enterprise clients. "
            "Should we prioritize building a self-serve onboarding flow or an enterprise-focused "
            "professional services team? Reason carefully, then give a clear YES (self-serve) or NO (enterprise) verdict."
        ),
        n_runs=5,
        temperature=0.7,
        answer_format="yes_no",
        verbose=True
    )
    print(f"\n  Decision: {result_1.final_answer}")
    print(f"  Confidence: {result_1.confidence:.0%}")
```

---

## 7. Real Use Case: Automated Research Pipeline

Let's assemble all five techniques into one production-quality system: an **Automated Research Pipeline** that a startup could use to analyze a market or technology in minutes instead of days.

```
AUTOMATED RESEARCH PIPELINE — ARCHITECTURE:
════════════════════════════════════════════════════════════════

  INPUT: "Research quantum computing applications in cybersecurity"

  ┌──────────────────────────────────────────────────────────┐
  │  STAGE 1: DECOMPOSE (Task Decomposition)                 │
  │  Break the research goal into 6 concrete steps           │
  │  → [search market, find players, get trends, ...]        │
  └───────────────────────┬──────────────────────────────────┘
                          │
  ┌───────────────────────▼──────────────────────────────────┐
  │  STAGE 2: EXECUTE (Plan-and-Execute)                     │
  │  Run each step's research with tools                     │
  │  → Accumulated research data from all steps              │
  └───────────────────────┬──────────────────────────────────┘
                          │
  ┌───────────────────────▼──────────────────────────────────┐
  │  STAGE 3: REASON (Tree of Thoughts — optional)           │
  │  For ambiguous questions, explore multiple hypotheses    │
  │  → Best-scoring analytical conclusion                    │
  └───────────────────────┬──────────────────────────────────┘
                          │
  ┌───────────────────────▼──────────────────────────────────┐
  │  STAGE 4: DRAFT REPORT (LLM Generation)                  │
  │  Synthesize all data into a structured report            │
  └───────────────────────┬──────────────────────────────────┘
                          │
  ┌───────────────────────▼──────────────────────────────────┐
  │  STAGE 5: QUALITY CHECK (Self-Reflection)               │
  │  Critique report against quality rubric                  │
  │  Revise if any criteria fail                             │
  └───────────────────────┬──────────────────────────────────┘
                          │
  ┌───────────────────────▼──────────────────────────────────┐
  │  STAGE 6: VALIDATE DECISION (Self-Consistency)          │
  │  If a strategic recommendation is included,             │
  │  vote with N=5 runs to verify confidence                │
  └───────────────────────┬──────────────────────────────────┘
                          │
                     FINAL REPORT ✅
```

```python
# =========================================================
# FILE: research_pipeline.py
# Automated Research Pipeline combining all planning techniques.
# pip install openai python-dotenv
# =========================================================

import os
import json
import time
import math
import requests
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv

from task_decomposition import llm_decompose_goal, TaskStatus
from plan_execute_engine import PlanAndExecuteAgent
from self_reflection import reflect_and_revise, RubricItem, rubric_reflect_and_revise
from self_consistency import self_consistency_vote

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


# ══════════════════════════════════════════════════════════
# RESEARCH TOOLS
# ══════════════════════════════════════════════════════════

_research_notes: list[dict] = []

def web_search_ddg(query: str, max_results: int = 5) -> str:
    """DuckDuckGo web search (no API key needed)."""
    try:
        from bs4 import BeautifulSoup
        resp = requests.post(
            "https://html.duckduckgo.com/html/",
            data={"q": query, "kl": "en-us"},
            headers={"User-Agent": "Mozilla/5.0 Chrome/120.0.0"},
            timeout=15
        )
        soup    = BeautifulSoup(resp.text, "html.parser")
        results = soup.find_all("div", class_="result__body", limit=max_results)

        if not results:
            return f"No results found for '{query}'. Try rephrasing."

        lines = [f"Search: '{query}'"]
        for i, r in enumerate(results, 1):
            title   = (r.find("a", class_="result__a") or {}).get_text(strip=True) if r.find("a", class_="result__a") else "No title"
            snippet = (r.find("a", class_="result__snippet") or {}).get_text(strip=True) if r.find("a", class_="result__snippet") else ""
            lines.append(f"[{i}] {title}\n    {snippet[:250]}")
        return "\n\n".join(lines)
    except Exception as e:
        # Graceful fallback — never crash the agent
        return f"Search '{query}': result unavailable ({type(e).__name__}). Proceeding with available knowledge."


def take_research_note(content: str, category: str = "finding") -> str:
    """Save a research finding to session notes."""
    _research_notes.append({
        "id":       len(_research_notes) + 1,
        "content":  content,
        "category": category,
        "ts":       datetime.utcnow().strftime("%H:%M")
    })
    return f"Noted [{category}]: {content[:60]}..."


def get_research_notes_summary() -> str:
    """Retrieve all accumulated research notes."""
    if not _research_notes:
        return "No notes yet."
    lines = [f"Research Notes ({len(_research_notes)} total):"]
    for n in _research_notes:
        lines.append(f"  [{n['id']}][{n['category']}] {n['content'][:120]}")
    return "\n".join(lines)


def analyze_data(data_description: str, analysis_question: str) -> str:
    """Use LLM to analyze described data and answer a specific analytical question."""
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a data analyst. Analyze the described data and provide specific insights."},
            {"role": "user",   "content": f"Data: {data_description}\n\nAnalyze: {analysis_question}"}
        ],
        temperature=0.1,
        max_tokens=600
    )
    return resp.choices[0].message.content


RESEARCH_TOOLS_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name":        "web_search_ddg",
            "description": "Search the web for information. Use specific, focused queries.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query":       {"type": "string",  "description": "Search query"},
                    "max_results": {"type": "integer", "description": "Results to return (1-8)"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name":        "take_research_note",
            "description": "Save an important finding. Call after every search that yields useful data.",
            "parameters": {
                "type": "object",
                "properties": {
                    "content":  {"type": "string", "description": "The finding to save"},
                    "category": {
                        "type":   "string",
                        "enum":   ["statistic", "trend", "player", "technology", "risk", "opportunity", "finding"],
                        "description": "Category of this note"
                    }
                },
                "required": ["content"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name":        "get_research_notes_summary",
            "description": "Retrieve all notes. Call before writing report to review all gathered data.",
            "parameters":  {"type": "object", "properties": {}, "required": []}
        }
    },
    {
        "type": "function",
        "function": {
            "name":        "analyze_data",
            "description": "Analyze data you've gathered to answer a specific analytical question.",
            "parameters": {
                "type": "object",
                "properties": {
                    "data_description":  {"type": "string", "description": "Description of the data"},
                    "analysis_question": {"type": "string", "description": "Specific question to answer"}
                },
                "required": ["data_description", "analysis_question"]
            }
        }
    }
]

RESEARCH_TOOL_FN_MAP = {
    "web_search_ddg":          web_search_ddg,
    "take_research_note":      take_research_note,
    "get_research_notes_summary": get_research_notes_summary,
    "analyze_data":            analyze_data,
}


# ══════════════════════════════════════════════════════════
# THE RESEARCH PIPELINE
# ══════════════════════════════════════════════════════════

REPORT_RUBRIC = [
    RubricItem("executive_summary", "Does the report have a clear 2-3 sentence executive summary?",          weight=2.0, threshold=0.8),
    RubricItem("data_backed",       "Are all major claims supported by specific data points or sources?",    weight=2.5, threshold=0.7),
    RubricItem("completeness",      "Does the report cover all major aspects of the research question?",     weight=2.0, threshold=0.8),
    RubricItem("actionable",        "Does the report include actionable recommendations or next steps?",     weight=1.5, threshold=0.7),
    RubricItem("risks",             "Are key risks or limitations explicitly identified?",                    weight=1.5, threshold=0.6),
    RubricItem("structure",         "Is the report well-structured with clear sections and headings?",        weight=1.0, threshold=0.8),
]


class AutomatedResearchPipeline:
    """
    End-to-end automated research pipeline using all planning techniques.
    Produces professional research reports in minutes.
    """

    def __init__(
        self,
        model:          str  = "gpt-4o-mini",
        use_tot:        bool = False,   # enable Tree of Thoughts for analysis step
        use_consistency: bool = True,   # enable self-consistency for recommendations
        reflection_rounds: int = 2,     # self-reflection iterations
        verbose:        bool = True,
    ):
        self.model             = model
        self.use_tot           = use_tot
        self.use_consistency   = use_consistency
        self.reflection_rounds = reflection_rounds
        self.verbose           = verbose

        self.agent = PlanAndExecuteAgent(
            tools=RESEARCH_TOOLS_SCHEMAS,
            tool_fn_map=RESEARCH_TOOL_FN_MAP,
            planner_model=model,
            executor_model=model,
        )

    def run(self, research_topic: str, report_context: str = "") -> dict:
        """
        Run the complete research pipeline.

        Args:
            research_topic: Topic to research
            report_context: Optional context (industry, audience, depth)

        Returns:
            Dict with report, metadata, quality score
        """
        start_time = time.time()
        global _research_notes
        _research_notes = []    # reset notes for fresh session

        if self.verbose:
            print(f"\n{'═'*68}")
            print(f"  📚 AUTOMATED RESEARCH PIPELINE")
            print(f"  Topic:   {research_topic[:60]}")
            print(f"  Config:  ToT={'ON' if self.use_tot else 'OFF'} | "
                  f"Consistency={'ON' if self.use_consistency else 'OFF'} | "
                  f"Reflection rounds={self.reflection_rounds}")
            print(f"{'═'*68}")

        # ── STAGE 1 & 2: PLAN + EXECUTE ──────────────────────
        if self.verbose:
            print("\n  📋 Stage 1-2: Plan + Execute Research Steps")
        research_data = self.agent.run(
            goal=(
                f"Research topic: {research_topic}. "
                f"{'Context: ' + report_context if report_context else ''} "
                f"Gather: current state, key players, statistics, trends, challenges, opportunities. "
                f"After each search, save findings with take_research_note()."
            ),
            context=report_context
        )

        # ── STAGE 3: TREE OF THOUGHTS ANALYSIS (optional) ────
        analytical_insight = ""
        if self.use_tot:
            if self.verbose:
                print("\n  🌳 Stage 3: Tree of Thoughts Analysis")
            from tree_of_thoughts import TreeOfThoughtsSolver
            tot_solver = TreeOfThoughtsSolver(breadth=3, max_depth=3, beam_width=2, verbose=False)
            analytical_insight = tot_solver.solve(
                f"Based on research about '{research_topic}', what is the single most "
                f"important insight or strategic implication? Reason through this carefully."
            )
            if self.verbose:
                print(f"  ToT Insight: {analytical_insight[:100]}...")
        else:
            # Simple analytical synthesis without ToT
            analytical_insight = self._simple_analysis(research_topic, research_data)

        # ── STAGE 4: DRAFT REPORT ─────────────────────────────
        if self.verbose:
            print("\n  📝 Stage 4: Drafting Research Report")

        notes_summary = get_research_notes_summary()
        draft_report  = self._draft_report(research_topic, research_data, notes_summary, analytical_insight)

        # ── STAGE 5: SELF-REFLECTION QUALITY CHECK ────────────
        if self.verbose:
            print("\n  🔄 Stage 5: Quality Check & Reflection")

        final_report, eval_result = rubric_reflect_and_revise(
            task=(
                f"Write a comprehensive, professional research report on: {research_topic}. "
                f"Must include: executive summary, key findings, analysis, recommendations, risks."
            ),
            output=draft_report,
            rubric=REPORT_RUBRIC,
            max_rounds=self.reflection_rounds,
            model=self.model,
            verbose=self.verbose
        )

        # ── STAGE 6: VALIDATE STRATEGIC RECOMMENDATION ────────
        consistency_result = None
        if self.use_consistency:
            if self.verbose:
                print("\n  🗳️  Stage 6: Self-Consistency Validation")

            consistency_result = self_consistency_vote(
                prompt=(
                    f"Based on research about '{research_topic}', should an organization "
                    f"actively invest resources in this area now? "
                    f"Reason carefully through market maturity, competitive landscape, "
                    f"and timing. Give a YES (invest now) or NO (wait/avoid) verdict."
                ),
                n_runs=5,
                temperature=0.7,
                answer_format="yes_no",
                verbose=self.verbose
            )

        # ── COMPILE RESULTS ───────────────────────────────────
        elapsed = time.time() - start_time

        results = {
            "report":         final_report,
            "topic":          research_topic,
            "quality_score":  eval_result.get("overall_score", 0.0),
            "quality_passed": eval_result.get("passed", False),
            "notes_count":    len(_research_notes),
            "elapsed_s":      round(elapsed, 1),
            "timestamp":      datetime.now().isoformat(),
        }

        if consistency_result:
            results["invest_recommendation"] = consistency_result.final_answer
            results["recommendation_confidence"] = consistency_result.confidence

        if self.verbose:
            self._print_final_summary(results)

        return results

    def _simple_analysis(self, topic: str, data: str) -> str:
        """Simple (non-ToT) analytical synthesis."""
        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You identify the most important strategic insight from research data."},
                {"role": "user",   "content": f"Topic: {topic}\n\nResearch data:\n{data[:1000]}\n\nWhat is the single most important strategic insight?"}
            ],
            temperature=0.2, max_tokens=400,
        )
        return resp.choices[0].message.content

    def _draft_report(
        self,
        topic:     str,
        data:      str,
        notes:     str,
        analysis:  str
    ) -> str:
        """Generate the initial report draft."""
        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role":    "system",
                    "content": (
                        "You write professional research reports. "
                        "Use data-backed claims. Be specific and actionable. "
                        "Structure all reports with: Executive Summary, Key Findings (with data), "
                        "Analysis, Opportunities, Risks, Recommendations."
                    )
                },
                {
                    "role":    "user",
                    "content": (
                        f"Write a comprehensive research report on: {topic}\n\n"
                        f"Research data gathered:\n{data[:1500]}\n\n"
                        f"Research notes:\n{notes[:800]}\n\n"
                        f"Key analytical insight:\n{analysis[:400]}\n\n"
                        f"Write the full report now."
                    )
                }
            ],
            temperature=0.2,
            max_tokens=2500,
        )
        return resp.choices[0].message.content

    def _print_final_summary(self, results: dict) -> None:
        print(f"\n{'═'*68}")
        print(f"  ✅ PIPELINE COMPLETE")
        print(f"{'─'*68}")
        print(f"  Topic:           {results['topic'][:55]}")
        print(f"  Quality Score:   {results['quality_score']:.2f}/1.00 ({'PASS ✅' if results['quality_passed'] else 'PARTIAL ⚠️'})")
        print(f"  Notes gathered:  {results['notes_count']}")
        print(f"  Time elapsed:    {results['elapsed_s']}s")
        if "invest_recommendation" in results:
            conf_pct = int(results['recommendation_confidence'] * 100)
            print(f"  Invest verdict:  {results['invest_recommendation']} ({conf_pct}% confidence)")
        print(f"{'═'*68}")


# ── Entry Point ───────────────────────────────────────────
if __name__ == "__main__":
    pipeline = AutomatedResearchPipeline(
        model="gpt-4o-mini",
        use_tot=False,           # set True for deeper analysis (more API calls)
        use_consistency=True,
        reflection_rounds=2,
        verbose=True,
    )

    results = pipeline.run(
        research_topic="Current state and adoption of WebAssembly (WASM) in production web applications",
        report_context="Target audience: senior engineering leadership deciding on technology investments"
    )

    print("\n" + "═"*68)
    print("  📄 FINAL RESEARCH REPORT:")
    print("═"*68)
    print(results["report"])
```

---

## 8. Mini Quiz

Five sharp questions. Senior AI engineers get asked these in system design interviews.

```
╔════════════════════════════════════════════════════════════════╗
║  📝 CHAPTER 6 QUIZ — 5 Questions                               ║
╚════════════════════════════════════════════════════════════════╝
```

**Question 1 — Planning Level Selection**

Your team needs to build an agent to process incoming customer invoices: extract line items, validate totals, flag anomalies, and save to the database. Which planning level (1=Reactive, 2=Plan-then-Execute, 3=Dynamic Re-Planning) would you choose, and why?

<details>
<summary>👆 Click to reveal answer</summary>

**Answer: Level 2 — Plan-then-Execute.**

**Why not Level 1 (Reactive)?** Invoice processing is a multi-step pipeline with a fixed structure: extract → validate → flag → save. A reactive agent would figure out "what to do next" at each step, wasting LLM calls on decisions that are already known upfront (validation always comes after extraction, period).

**Why not Level 3 (Dynamic Re-Planning)?** Dynamic re-planning is for tasks where the optimal path *changes based on what you discover mid-execution*. Invoice processing doesn't need that — the steps are always the same regardless of the invoice content. Dynamic re-planning would add cost and latency with no benefit.

**Level 2 wins because:**
- The steps are fixed and predictable (always the same pipeline)
- Each step has a clear, verifiable output ("did we extract all line items?")
- The plan can be pre-generated once and reused for every invoice
- Simpler to test, debug, and audit (compliance requirement for financial processing)

**Exception:** If invoices sometimes have anomalies that require different handling paths (e.g., PO vs. non-PO invoices needing different validation rules), you'd add a light branching condition to the plan — still Level 2, just with conditional steps.
</details>

---

**Question 2 — Tree of Thoughts Cost**

Your manager wants to use Tree of Thoughts for every agent query because "it's the most accurate." You need to push back. Write the technical argument, including approximate token costs for a ToT with breadth=3, depth=4, beam=2 vs. standard ReAct.

<details>
<summary>👆 Click to reveal answer</summary>

**The argument against blanket ToT usage:**

**Cost analysis:**
- **Standard ReAct:** ~5 iterations × ~800 tokens/iteration = ~4,000 tokens per query
- **ToT (B=3, D=4, B=2):** At each depth level, generate 3 thoughts per beam node, evaluate each:
  - Generate: `beam_width × breadth = 2 × 3 = 6` thoughts per depth level × 4 depths = 24 generations
  - Evaluate: 24 evaluations (1 call each)
  - Total LLM calls: ~48 per query
  - Tokens: 48 × ~500 tokens avg = ~24,000 tokens per query
  - Cost ratio: **6x more expensive than standard ReAct**

**And it's not just cost — it's also latency:**
- ReAct: ~8 seconds (5 sequential calls)
- ToT: ~35-45 seconds (48 calls, some sequential)

**When ToT is worth it:**
- Mathematical reasoning problems where wrong early steps compound into catastrophically wrong answers
- Strategic decisions with high business cost of error (go/no-go on $1M initiative)
- Complex debugging with many plausible root causes
- Estimated annual cost difference: If serving 10,000 queries/day → ToT adds ~$300/day unnecessary cost on gpt-4o-mini ($0.03 avg per ToT vs $0.005 for ReAct)

**The right architecture:** Use ToT selectively. Route simple queries to ReAct, route complex analytical/reasoning queries to ToT. Add a "complexity classifier" as the router — a single cheap LLM call that classifies the query and routes accordingly.
</details>

---

**Question 3 — Self-Reflection Temperature**

In the self-reflection loop, you use `temperature=0.3` for critique and `temperature=0.1` for revision. Why not `temperature=0.0` for critique, and why not `temperature=0.7` for revision?

<details>
<summary>👆 Click to reveal answer</summary>

**Why not 0.0 for critique:**
At temperature=0, the LLM always takes the single highest-probability token. For critique, this means it will always find *the same* issues — typically only the most obvious problems. With slight temperature (0.3), it explores a slightly larger space of critiques, which means it's more likely to catch subtle errors like inconsistent reasoning, missing edge cases, or slightly off-tone phrasing that the deterministic path misses.

*Analogy:* A code reviewer who uses exactly the same checklist every time will miss context-specific issues. A reviewer who approaches it slightly differently each time catches more diverse problems.

**Why not 0.7 for revision:**
Revision must be *precise* and *targeted*. The critique identified specific issues. We need the LLM to fix *exactly those issues* without introducing new creative variations that might accidentally break things that were working. High temperature would cause the LLM to drift — rewriting the whole thing in a different style, changing things that didn't need changing, or ignoring the specific critique in favor of "interesting" variations.

**The design principle:** 
- **Divergence tasks** (exploration, critique, brainstorming, thought generation) → higher temperature
- **Convergence tasks** (execution, revision, extraction, classification) → lower temperature

This is a general rule that applies throughout agentic AI design, not just in reflection loops.
</details>

---

**Question 4 — Decomposition Anti-Patterns**

You're reviewing a junior developer's task decomposition for "Deploy our API to production":
```
Step 1: Prepare deployment
Step 2: Deploy
Step 3: Verify deployment
Step 4: Done
```
List at least **5 specific problems** with this decomposition and rewrite Step 2 properly.

<details>
<summary>👆 Click to reveal answer</summary>

**5 problems:**

1. **Too vague to execute:** "Prepare deployment" — prepare *what*? Update config files? Build Docker image? Run tests? An agent cannot take a specific tool action for this.

2. **Missing dependencies:** There's no dependency tracking. Step 3 must depend on Step 2, but this isn't expressed. More critically, Step 2 implicitly requires Step 1 — but if Step 1 fails, there's nothing to stop Step 2 from running and deploying broken code.

3. **"Step 4: Done" is not a step:** This is not an action. It's a state. Decompositions should end at the last actionable step, not a status label.

4. **No verification criteria:** "Verify deployment" — how? Check HTTP 200? Run smoke tests? Monitor error rates for 5 minutes? Without specifics, an agent will guess — often incorrectly.

5. **Missing failure handling:** No rollback step. Production deployments must include "If deployment fails: rollback to previous version and alert team." Agents need explicit paths for failure scenarios.

**Rewritten Step 2 (deploy):**
```
Step 2: Run deployment
  Depends on: step-1
  Actions:
    2a. Build Docker image: docker build -t api:v{version} .
    2b. Push to registry:   docker push registry.company.com/api:v{version}
    2c. Update K8s manifest: kubectl set image deployment/api api=registry.company.com/api:v{version}
    2d. Wait for rollout:   kubectl rollout status deployment/api --timeout=120s
  Expected output: All pods running new version, kubectl reports "successfully rolled out"
  On failure: trigger step-2-rollback (kubectl rollout undo deployment/api)
```
*This is the difference between a vague human instruction and a machine-executable plan.*
</details>

---

**Question 5 — Self-Consistency Pitfall**

You implement self-consistency with `n_runs=5, temperature=0.0`. After testing, you notice all 5 runs give identical answers and the "confidence" is always 100%. Your colleague says "great, 100% confidence — ship it!" What's the problem?

<details>
<summary>👆 Click to reveal answer</summary>

**The problem: you broke self-consistency with temperature=0.**

**Why identical answers ≠ high confidence:**
At `temperature=0.0`, the LLM is deterministic — it always picks the maximum-probability token. Running it 5 times with the same input at temperature=0 produces 5 *identical* outputs every time. The "vote" of 5/5 is meaningless — you're not measuring agreement across different reasoning paths, you're measuring that deterministic systems are deterministic.

True 100% self-consistency would mean: "5 independent reasoning paths with diverse starting points all arrived at the same conclusion." That's genuinely meaningful. What you have is: "one reasoning path copied 5 times."

**The real risk:** Your deterministic answer might be confidently *wrong*. If the LLM's highest-probability reasoning path has a flaw, you've run that same flawed path 5 times and "voted" that the flaw is correct with 100% confidence.

**Fix:** Use `temperature=0.6` to `temperature=0.9` for self-consistency. You need genuine diversity in reasoning paths to get meaningful voting data.

**Bonus insight:** This is analogous to the statistical concept of correlated samples. If you sample 5 people from the same family to estimate the general population's opinion, you've not gotten 5 independent data points. Self-consistency sampling requires genuinely independent reasoning paths — temperature > 0 is what enables this independence.
</details>

---

## 9. Chapter 7 Preview

```
╔══════════════════════════════════════════════════════════════╗
║  👀 COMING UP: Chapter 7                                     ║
║  "Multi-Agent Systems — When One Agent Isn't Enough"        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Your Chapter 6 agent plans brilliantly — but it still       ║
║  works alone, sequentially, one step at a time.              ║
║                                                              ║
║  Real enterprise tasks need more:                            ║
║                                                              ║
║  "Research 10 competitors in parallel, have a legal          ║
║   agent check compliance, a writing agent draft the          ║
║   report, and a QA agent verify everything —                 ║
║   all while a supervisor monitors for quality."              ║
║                                                              ║
║  That's a multi-agent system. Chapter 7 builds one.         ║
║                                                              ║
║  You'll learn:                                               ║
║                                                              ║
║  🏗️  ORCHESTRATOR-WORKER PATTERN                            ║
║     One "boss" agent that delegates.                         ║
║     Multiple "worker" agents that specialize.                ║
║     The boss doesn't do the work — it coordinates.          ║
║                                                              ║
║  ⚡  PARALLEL EXECUTION                                      ║
║     asyncio + ThreadPoolExecutor for true parallelism.       ║
║     Run 5 research agents simultaneously — 5x speedup.      ║
║     The hardest engineering problem in multi-agent systems.  ║
║                                                              ║
║  📨  AGENT COMMUNICATION                                     ║
║     Structured message passing between agents.               ║
║     Result aggregation from parallel workers.                ║
║     Shared state vs. isolated agents — tradeoffs.           ║
║                                                              ║
║  🔐  TRUST & SAFETY                                          ║
║     Prompt injection attacks between agents.                 ║
║     Authority levels — which agent can override which?       ║
║     Circuit breakers — when to stop a runaway agent network. ║
║                                                              ║
║  🏭  Real use case:                                          ║
║     Competitive Intelligence System:                         ║
║     Orchestrator → 5 parallel researcher agents →           ║
║     Legal compliance agent → Writing agent →                 ║
║     QA agent → Supervisor → Board-ready PDF.                 ║
║     Built in 1 chapter. Would take a human team 2 days.     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  PREREQUISITE CHECKLIST BEFORE CHAPTER 7:                    ║
║  ✅ You understand all 3 planning levels                     ║
║  ✅ You've built a Plan-and-Execute agent                    ║
║  ✅ You understand Tree of Thoughts (even if not used yet)   ║
║  ✅ You've implemented at least 1 self-reflection loop       ║
║  ✅ You understand why temp>0 is required for self-consistency║
╚══════════════════════════════════════════════════════════════╝
```

> **Professor's Final Word:** You just learned how top AI research labs give their agents the ability to *think strategically, not just react*. Task decomposition is project management. Tree of Thoughts is intellectual rigour. Self-reflection is quality control. Self-consistency is statistical confidence. Put them together and you have something that genuinely earns the title "intelligent agent" rather than "autocomplete with a loop." The research pipeline you built today is, architecturally, what Bloomberg's AI, McKinsey's QuantumBlack research tools, and dozens of Series B AI startups are running in production. You're not learning toys — you're learning what the industry uses. 🎓🚀

---

```
──────────────────────────────────────────────────────────────────────
  Chapter 6 Complete ✅  |  Next: Chapter 7 — Multi-Agent Systems  →
  Files covered this chapter:
    task_decomposition.py       — SubTask, Plan, llm_decompose_goal, hierarchical_decompose
    plan_execute_engine.py      — StepExecutor, PlanAndExecuteAgent (plan + execute + synthesize)
    tree_of_thoughts.py         — ThoughtNode, ToT solver with Beam Search
    self_reflection.py          — simple loop, rubric-based reflection, constitutional critique
    self_consistency.py         — ConsistencyResult, voting, extract_yes_no
    research_pipeline.py        — AutomatedResearchPipeline combining all 5 techniques
──────────────────────────────────────────────────────────────────────
```
