# 🤖 Agentic AI Full Stack Developer Course
## Chapter 1: What is Agentic AI?
### *From "chatbot that answers" → "AI that acts"*

---

```
╔══════════════════════════════════════════════════════════════════╗
║              📦 WHAT YOU'LL LEARN IN THIS CHAPTER               ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  CONCEPTS:                                                       ║
║  → What makes AI "agentic" vs. a regular chatbot                ║
║  → The 4 core components of every AI agent                      ║
║  → The Think → Act → Observe loop (ReAct pattern)               ║
║  → Single-agent vs. multi-agent architectures                   ║
║  → Tools, memory, planning, and action explained                ║
║                                                                  ║
║  CODE:                                                           ║
║  → Build your first minimal Python AI agent from scratch        ║
║  → Give it tools it can choose to call on its own               ║
║  → See it make decisions and chain multiple steps               ║
║                                                                  ║
║  REAL INDUSTRY CONTEXT:                                          ║
║  → How Cursor AI, Devin, and GitHub Copilot Workspace work      ║
║  → How e-commerce agents handle full order workflows            ║
║  → Why every enterprise is building agents right now            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 📋 Table of Contents

1. [The Chatbot vs. Agent Distinction](#1-the-chatbot-vs-agent-distinction)
2. [What Makes AI "Agentic"](#2-what-makes-ai-agentic)
3. [The 4 Core Components of Every Agent](#3-the-4-core-components-of-every-agent)
4. [The Think-Act-Observe Loop](#4-the-think-act-observe-loop)
5. [Single vs. Multi-Agent Systems](#5-single-vs-multi-agent-systems)
6. [Real Industry Use Cases](#6-real-industry-use-cases)
7. [Code: Build Your First Agent from Scratch](#7-code-build-your-first-agent-from-scratch)
8. [Hands-On Exercise](#8-hands-on-exercise)
9. [Chapter Summary](#9-chapter-summary)

---

## 1. The Chatbot vs. Agent Distinction

Before we write a single line of code, let's nail the most important concept in this entire course.

You already know what ChatGPT does. You type something, it replies. Done. That's **reactive** AI.

An AI Agent is completely different. It **acts** in the world.

```
CHATBOT (Reactive):
═══════════════════

  You ──── "What's the weather in Paris?" ────► LLM
                                                  │
  You ◄─── "I don't know, I have no internet." ──┘

  One turn. One answer. Nothing happened in the world.


AGENT (Proactive):
══════════════════

  You ──── "Book me the cheapest flight to Paris next Friday." ───► Agent
                                                                       │
                                                            Agent THINKS:
                                                            "I need to:
                                                             1. Search flights
                                                             2. Compare prices
                                                             3. Check your calendar
                                                             4. Book the best one
                                                             5. Email confirmation"
                                                                       │
                                                            Agent ACTS:
                                                            → calls search_flights()
                                                            → calls get_calendar()
                                                            → calls book_flight()
                                                            → calls send_email()
                                                                       │
  You ◄─── "Done! Booked Air France FR1234, €287, departs 09:15." ────┘

  Multiple turns. Multiple tool calls. Real things happened.
```

> This is the fundamental shift. A chatbot **talks**. An agent **does**.

---

## 2. What Makes AI "Agentic"

Here's the precise definition used in industry:

> **An AI system is "agentic" when it can autonomously decide WHAT to do next, WHICH tools to use, and WHEN it's done — without a human approving every single step.**

The keyword is **autonomy**. Let's break down the spectrum:

```
THE AUTONOMY SPECTRUM:
══════════════════════

  FULLY HUMAN                                      FULLY AUTONOMOUS
  CONTROLLED                                           AGENT
       │                                                  │
       ▼                                                  ▼
  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────────────┐
  │ Static  │   │Chatbot  │   │ Copilot │   │  Agentic AI     │
  │  App    │   │(react.) │   │(assist.)│   │  (autonomous)   │
  │         │   │         │   │         │   │                 │
  │ No AI   │   │ Answers │   │Suggests │   │ Plans + Decides │
  │         │   │questions│   │ code    │   │ + Acts + Loops  │
  └─────────┘   └─────────┘   └─────────┘   └─────────────────┘
  "Show me     "What does   "Here's a   "I refactored your
  all users"   this error   fix for     entire codebase,
               mean?"       this bug"   ran tests, opened
                                        a PR, and pinged
                                        your tech lead."

  ← Less Agent                               More Agent →
```

The three properties that make something truly "agentic":

```
THE 3 AGENTIC PROPERTIES:
══════════════════════════

  1. AUTONOMY (self-directing)
     ┌────────────────────────────────────────────┐
     │ The agent decides what step to take next.  │
     │ No human approval needed for each action.  │
     └────────────────────────────────────────────┘

  2. TOOL USE (acting in the world)
     ┌────────────────────────────────────────────┐
     │ The agent can call external functions:     │
     │ APIs, databases, browsers, terminals, etc. │
     └────────────────────────────────────────────┘

  3. MULTI-STEP REASONING (planning)
     ┌────────────────────────────────────────────┐
     │ The agent breaks goals into subtasks and   │
     │ executes them in sequence or parallel.     │
     └────────────────────────────────────────────┘
```

---

## 3. The 4 Core Components of Every Agent

Every AI agent — from the simplest toy to Devin (the coding AI) — has exactly 4 components. Learn these, and you understand 90% of every agent framework.

```
THE 4 PILLARS OF AN AI AGENT:
══════════════════════════════

                    ┌─────────────────────────────┐
                    │         AI AGENT            │
                    │                             │
          ┌─────────┤  ┌───────┐   ┌──────────┐  ├──────────┐
          │         │  │  🧠   │   │   🔧     │  │          │
          │         │  │  LLM  │   │  TOOLS   │  │          │
          │         │  │(brain)│   │(hands)   │  │          │
     ┌────▼────┐    │  └───┬───┘   └────┬─────┘  │    ┌─────▼────┐
     │   📝    │    │      │             │        │    │   📋     │
     │ MEMORY  │    │  ┌───▼─────────────▼────┐  │    │ PLANNING │
     │(context)│    │  │     ORCHESTRATOR     │  │    │(strategy)│
     └─────────┘    │  │  (agent loop / brain)│  │    └──────────┘
                    │  └──────────────────────┘  │
                    └─────────────────────────────┘


  COMPONENT 1: 🧠 LLM (The Brain)
  ─────────────────────────────────
  The core language model that reasons about what to do.
  Examples: GPT-4o, Claude 3.5, Gemini 1.5 Pro, Llama 3
  Role: Reads the situation → decides next action

  COMPONENT 2: 🔧 TOOLS (The Hands)
  ─────────────────────────────────
  Python functions the LLM can choose to call.
  Examples: search_web(), run_python(), send_email(), query_db()
  Role: Actually DO things in the real world

  COMPONENT 3: 📝 MEMORY (The Context)
  ─────────────────────────────────────
  Ways to store and recall information across steps.
  Types:
    - Short-term: the conversation history (in the prompt)
    - Long-term:  a vector database (like Chapter 4 of RAG course!)
    - Episodic:   "what I did in past runs"
  Role: Remember what happened, what you tried, what worked

  COMPONENT 4: 📋 PLANNING (The Strategy)
  ─────────────────────────────────────────
  How the agent breaks a big goal into smaller steps.
  Types:
    - ReAct: think → act → observe → repeat
    - Plan-and-Execute: make full plan first, then run it
    - Tree-of-Thought: explore multiple reasoning paths
  Role: Don't just react, think AHEAD
```

---

## 4. The Think-Act-Observe Loop

This is the **heartbeat** of every agentic system. It's called the **ReAct pattern** (Reasoning + Acting), and once you see it, you'll recognize it everywhere.

```
THE REACT LOOP (Think → Act → Observe → Repeat):
══════════════════════════════════════════════════

  USER GOAL: "Find the latest AI research paper on RAG and
              summarize its key findings"

  ┌─────────────────────────────────────────────────────────┐
  │  ITERATION 1                                            │
  │                                                         │
  │  THINK: "I need to search for recent RAG papers.        │
  │          I'll use the search_web tool with a good query"│
  │                                                         │
  │  ACT:   search_web("RAG retrieval augmented generation  │
  │                     2024 research paper arxiv")         │
  │                                                         │
  │  OBS:   "Found 10 results. Top result: 'RankRAG:        │
  │          Unifying Context Ranking...' arxiv.org/2407..."│
  └──────────────────────────┬──────────────────────────────┘
                             │
  ┌──────────────────────────▼──────────────────────────────┐
  │  ITERATION 2                                            │
  │                                                         │
  │  THINK: "Good, I found a paper. Now I need to read it.  │
  │          I'll use fetch_url to get the abstract."       │
  │                                                         │
  │  ACT:   fetch_url("https://arxiv.org/abs/2407.02485")  │
  │                                                         │
  │  OBS:   "Abstract: RankRAG instructs a single LLM to   │
  │          both rank and answer... key contributions: ... │
  └──────────────────────────┬──────────────────────────────┘
                             │
  ┌──────────────────────────▼──────────────────────────────┐
  │  ITERATION 3                                            │
  │                                                         │
  │  THINK: "I have enough info to write the summary now.   │
  │          I don't need any more tools. I can answer."    │
  │                                                         │
  │  ACT:   [FINAL ANSWER]                                  │
  │                                                         │
  │  "The paper RankRAG (2024) proposes a unified approach  │
  │   where a single LLM handles both retrieval ranking     │
  │   AND answer generation. Key findings: ..."             │
  └─────────────────────────────────────────────────────────┘

  GOAL ACHIEVED in 3 iterations without human input! ✅
```

The loop runs until one of three things happens:

```
STOPPING CONDITIONS:
════════════════════

  ┌───────────────────────────────────────────────────┐
  │  STOP WHEN:                                       │
  │                                                   │
  │  1. GOAL REACHED                                  │
  │     Agent decides it has enough info to answer    │
  │     → Produces FINAL ANSWER                       │
  │                                                   │
  │  2. MAX ITERATIONS HIT                            │
  │     Safety limit (e.g., 10 steps) prevents        │
  │     infinite loops → Graceful error returned      │
  │                                                   │
  │  3. TOOL ERROR / IMPOSSIBLE TASK                  │
  │     Tool fails, agent can't recover               │
  │     → Agent reports failure with context          │
  └───────────────────────────────────────────────────┘
```

> 💡 **Pro Tip:** Always set a `max_iterations` limit in your agents. Without it, a confused agent will happily loop forever burning your API credits at 3am. Ask me how I know. 💸

---

## 5. Single vs. Multi-Agent Systems

As your tasks get more complex, one agent isn't enough. Welcome to **Multi-Agent Systems**.

```
SINGLE AGENT:
═════════════

  User ──► [Agent] ──► Answer
               │
           Does EVERYTHING:
           - searches web
           - writes code
           - sends emails
           - updates DB

  Good for: simple tasks, prototyping
  Bad for:  complex parallel tasks, specialization needed


MULTI-AGENT SYSTEM:
═══════════════════

                        ┌─────────────────────┐
                        │   ORCHESTRATOR      │
                        │   (Manager Agent)   │
                        │  "Directs the team" │
                        └──────┬──────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │  RESEARCHER │    │   CODER     │    │   WRITER    │
   │    Agent    │    │   Agent     │    │   Agent     │
   │             │    │             │    │             │
   │ Searches &  │    │  Writes &   │    │  Formats &  │
   │ reads docs  │    │  runs code  │    │  publishes  │
   └─────────────┘    └─────────────┘    └─────────────┘

  Task: "Write a technical blog post about our new API"
  ─────
  Orchestrator: "Researcher: find competitors. Coder: generate
                 code examples. Writer: combine into blog post."

  All three work in PARALLEL → 3x faster!

  Good for: complex workflows, parallelism, specialization
  Bad for:  simple tasks (too much overhead overhead)
```

Real-world example of multi-agent you've already used:

```
CURSOR AI UNDER THE HOOD (simplified):
═══════════════════════════════════════

  You type: "Add authentication to my Express app"

  ┌──────────────────────────────────────────────────────┐
  │  ORCHESTRATOR: "Break this down..."                  │
  │    → Task 1: Read existing codebase structure        │
  │    → Task 2: Generate auth middleware                │
  │    → Task 3: Update routes                          │
  │    → Task 4: Add environment variable handling       │
  │    → Task 5: Write tests                            │
  └──────────┬───────────────────────────────────────────┘
             │
  ┌──────────▼───────────────────────────────────────────┐
  │  CODEBASE READER AGENT: Reads your files             │
  │  → Understands your Express version, folder layout   │
  └──────────┬───────────────────────────────────────────┘
             │
  ┌──────────▼───────────────────────────────────────────┐
  │  CODE GENERATOR AGENT: Writes the auth code          │
  │  → Tailored to YOUR project, not generic boilerplate │
  └──────────┬───────────────────────────────────────────┘
             │
  ┌──────────▼───────────────────────────────────────────┐
  │  DIFF APPLIER AGENT: Makes the actual file changes   │
  └──────────────────────────────────────────────────────┘

  This is why Cursor feels SMART — it's not one model.
  It's a choreography of specialized agents.
```

---

## 6. Real Industry Use Cases

Let's look at what real companies are shipping today. These aren't demos — these are production systems.

### 🛒 Use Case 1: E-Commerce Order Management Agent (Shopify Scale)

```
TRADITIONAL (pre-agent):
═════════════════════════

  Customer: "Where is my order?"
  Chatbot:  "Please contact support at support@store.com"
  Customer: [frustrated, churns]

WITH AGENTIC AI:
════════════════

  Customer: "Where is my order? It's been 10 days."

  Agent THINKS: "10 days is past estimated delivery.
                 I need to: 1) look up the order,
                            2) check shipping status,
                            3) decide if I should refund"

  Agent ACTS:
  → lookup_order(customer_id="C4821", recent=True)
    OBS: "Order #8821, shipped 8 days ago via FedEx"

  → track_shipment(tracking_id="FX992811022")
    OBS: "Status: STUCK IN CUSTOMS since Day 3"

  → check_policy(issue="customs_delay", days=7)
    OBS: "Policy: refund or reship after 7 days in customs"

  → issue_refund(order_id="8821", amount=49.99)
    OBS: "Refund issued. Confirmation #R-4921"

  → send_email(to=customer, template="refund_issued",
               details={order: 8821, amount: 49.99})
    OBS: "Email sent"

  Agent RESPONDS:
  "I found your order #8821. It's been stuck in customs
   for 7 days — I've already issued a full refund of $49.99
   to your original payment method. You'll see it in 3-5 days.
   I also sent you a confirmation email. So sorry for the delay!"

RESULT:
  → Zero human support agents involved
  → Customer served in 8 seconds
  → Resolution rate: 94%
  → CSAT score: 4.8/5
```

### 🏥 Use Case 2: Clinical Trial Matching Agent (Healthcare)

```
PROBLEM:
═════════
  Matching patients to clinical trials requires reading
  hundreds of eligibility criteria documents and patient
  records. Manual process takes 45 minutes per patient.

AGENTIC SOLUTION:
═════════════════

  INPUT: Patient record (age, diagnosis, medications, lab results)

  Agent PLAN:
  ┌──────────────────────────────────────────────────────┐
  │ Step 1: Extract key medical facts from patient record │
  │ Step 2: Query clinical trials database               │
  │ Step 3: For each trial, check inclusion criteria     │
  │ Step 4: Check exclusion criteria                     │
  │ Step 5: Rank trials by match score                   │
  │ Step 6: Generate clinician briefing report           │
  └──────────────────────────────────────────────────────┘

  Agent TOOLS:
  → extract_medical_entities(record_text)
  → search_trials_db(condition, phase, location)
  → check_eligibility(patient_data, trial_criteria)
  → generate_report(matches, patient_id)

  OUTPUT:
  "Patient qualifies for 3 trials. TRIAL-2847 is the
   best match (96% criteria met). Exclusion flag: patient
   takes warfarin — Trial TRIAL-1923 is excluded.
   Full briefing attached for oncologist review."

RESULT:
  → 45 minutes → 47 seconds
  → Trial enrollment up 31%
  → Physician review still required (human-in-the-loop)
```

> 💡 **Pro Tip:** Notice "Physician review still required" above. The best production agents keep humans **in the loop** for high-stakes decisions. Full autonomy is not always the goal. Design your agent to know when to STOP and ask.

---

## 7. Code: Build Your First Agent from Scratch

We're going to build a real, working AI agent step by step. No frameworks yet — we build from scratch first, so you understand what frameworks are actually doing for you.

**Goal:** An agent that can answer questions by choosing to use tools — a calculator and a web-style fact lookup.

### Setup First

```bash
# Install required packages
pip install openai python-dotenv

# Create .env file with your API key
# OPENAI_API_KEY=sk-your-key-here
```

### The Full Agent Code

```python
# =========================================================
# FILE: first_agent.py
# Your first AI agent, built completely from scratch.
# No LangChain. No AutoGen. Just Python + OpenAI.
# =========================================================

import json          # For parsing tool calls (JSON format)
import os            # For reading environment variables
from dotenv import load_dotenv  # Loads .env file into os.environ
from openai import OpenAI       # The OpenAI Python client

# ── STEP 1: Load your API key from .env file ─────────────
# Never hardcode API keys! Always use environment variables.
load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# ── STEP 2: Define the tools our agent can use ───────────
# This is a Python dictionary that DESCRIBES the tool to the LLM.
# The LLM reads this description and decides WHEN to call it.
# The actual Python function is defined separately below.

TOOLS = [
    {
        "type": "function",     # Always "function" for custom tools
        "function": {
            "name": "calculate", # Must match the Python function name
            "description": (
                "Performs arithmetic calculations. "
                "Use this for any math operation: "
                "addition, subtraction, multiplication, division, "
                "percentages, and powers."
            ),
            # "parameters" tells the LLM what arguments to pass
            "parameters": {
                "type": "object",  # Arguments are a JSON object
                "properties": {    # Each property is one argument
                    "expression": {
                        "type": "string",
                        "description": (
                            "A valid Python math expression. "
                            "Examples: '2 + 2', '15 * 8', "
                            "'100 / 4', '2 ** 10'"
                        )
                    }
                },
                "required": ["expression"]  # This arg is mandatory
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "lookup_fact",
            "description": (
                "Looks up factual information from our knowledge base. "
                "Use this to find company data, product info, "
                "employee count, or any factual question."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The factual question to look up"
                    }
                },
                "required": ["query"]
            }
        }
    }
]


# ── STEP 3: Implement the actual tool functions ───────────
# These are regular Python functions. The LLM can't run them —
# WE run them and feed the result back to the LLM.

def calculate(expression: str) -> str:
    """
    Safely evaluate a math expression.

    Args:
        expression: A Python math expression like "2 + 2"

    Returns:
        The result as a string, or an error message
    """
    try:
        # eval() runs a string as Python code.
        # We restrict it to math only using empty __builtins__.
        # WARNING: Never use plain eval() on user input in production!
        # Use a proper math parser library like `simpleeval` instead.
        result = eval(expression, {"__builtins__": {}})
        return f"{expression} = {result}"
    except Exception as e:
        return f"Error calculating '{expression}': {str(e)}"


def lookup_fact(query: str) -> str:
    """
    Fake knowledge base lookup (in real life, this queries a DB or RAG).
    For learning purposes, we hardcode some facts here.

    Args:
        query: A question about our fake company "TechCorp"

    Returns:
        The fact as a string, or "Not found"
    """
    # In a real agent, this would call:
    # - A vector database (RAG!) for document search
    # - A SQL database for structured data
    # - An external API for live data
    knowledge_base = {
        "revenue":         "TechCorp's annual revenue is $4.2 billion (2024).",
        "employees":       "TechCorp has 12,400 employees across 23 countries.",
        "founded":         "TechCorp was founded in 2008 by Sarah Chen and Marcus Webb.",
        "headquarters":    "TechCorp is headquartered in Austin, Texas.",
        "products":        "TechCorp's main products are DataPipe, CloudSync, and AIPlatform.",
        "aipLatform":      "AIPlatform launched in Q1 2024 with 8,000 enterprise customers.",
        "stock":           "TechCorp (TCRP) is listed on NASDAQ.",
    }

    # Simple keyword matching (in real life: embedding similarity search)
    query_lower = query.lower()
    for key, value in knowledge_base.items():
        if key in query_lower:
            return value

    return f"No information found for: '{query}'"


# ── STEP 4: Build the tool dispatcher ────────────────────
# This function routes tool calls from the LLM to the right function.
# It's like a traffic controller: "Oh, LLM wants 'calculate'?
# Route it to the calculate() function."

def run_tool(tool_name: str, tool_args: dict) -> str:
    """
    Execute a tool by name with given arguments.
    Returns the result as a string.
    """
    print(f"  🔧 Running tool: {tool_name}({tool_args})")

    if tool_name == "calculate":
        # Extract the "expression" argument and call calculate()
        return calculate(tool_args["expression"])

    elif tool_name == "lookup_fact":
        # Extract the "query" argument and call lookup_fact()
        return lookup_fact(tool_args["query"])

    else:
        # Safety net: if LLM hallucinates a tool name, return error
        return f"Unknown tool: {tool_name}"


# ── STEP 5: Build the Agent Loop ─────────────────────────
# This is the HEART of the agent.
# It implements the Think → Act → Observe cycle.

def run_agent(user_question: str, max_iterations: int = 10) -> str:
    """
    Run the AI agent to answer a question.

    The agent will:
    1. Think about what tools it needs
    2. Call tools to gather information
    3. Observe the results
    4. Repeat until it can give a final answer

    Args:
        user_question : The question from the user
        max_iterations: Safety limit to prevent infinite loops

    Returns:
        The agent's final answer as a string
    """

    print(f"\n{'='*60}")
    print(f"AGENT STARTING: {user_question}")
    print('='*60)

    # The conversation history is how we implement SHORT-TERM MEMORY.
    # We build a list of messages that grows with each iteration.
    # The LLM reads the FULL list each time, so it "remembers" what happened.
    messages = [
        {
            "role": "system",
            # The system prompt defines the agent's identity and behavior.
            # This is the most important prompt you'll write for an agent.
            "content": (
                "You are a helpful AI assistant for TechCorp with access to tools. "
                "When you need to do math, use the calculate tool. "
                "When you need company facts, use the lookup_fact tool. "
                "Think step by step. Use tools when needed. "
                "Only give your final answer when you have all the info you need."
            )
        },
        {
            "role": "user",
            "content": user_question  # The user's actual question
        }
    ]

    # The main agent loop — runs until DONE or max iterations
    for iteration in range(max_iterations):
        print(f"\n--- Iteration {iteration + 1} ---")

        # ── THINK PHASE ──────────────────────────────────────
        # Send current conversation to the LLM.
        # The LLM will either:
        #   a) Call a tool (tool_calls in response)
        #   b) Give a final answer (content in response)

        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Cheap + fast for agent loops
            messages=messages,    # Full conversation history
            tools=TOOLS,          # Tell LLM what tools are available
            tool_choice="auto",   # "auto" = LLM decides when to use tools
                                  # Alternative: "required" forces tool use
        )

        # Extract the LLM's message from the response
        # response.choices[0] = first (and usually only) completion
        # .message = the actual message object
        assistant_message = response.choices[0].message

        # Add the LLM's response to conversation history
        # This is crucial! The LLM needs to see its own previous responses.
        messages.append(assistant_message)

        # ── DECISION POINT ───────────────────────────────────
        # Did the LLM want to use a tool, or give a final answer?

        if assistant_message.tool_calls:
            # ── ACT PHASE ──────────────────────────────────
            # LLM decided to call one or more tools.
            # tool_calls is a list (LLM can call multiple tools at once!)

            print(f"  🤔 THINK: Agent wants to call {len(assistant_message.tool_calls)} tool(s)")

            for tool_call in assistant_message.tool_calls:
                # Extract info about which tool to call
                tool_name = tool_call.function.name

                # The LLM sends arguments as a JSON string — parse it!
                tool_args = json.loads(tool_call.function.arguments)

                # ── OBSERVE PHASE ─────────────────────────
                # Run the actual tool
                tool_result = run_tool(tool_name, tool_args)
                print(f"  👁 OBSERVE: {tool_result}")

                # Add the tool result to the conversation.
                # "role: tool" is special — it tells the LLM
                # "this is the result of the tool YOU called."
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,  # Links result to the call
                    "content": tool_result         # The actual result
                })

        else:
            # ── FINAL ANSWER ──────────────────────────────
            # LLM didn't call any tools — it's ready to answer!
            final_answer = assistant_message.content
            print(f"\n✅ AGENT DONE after {iteration + 1} iteration(s)")
            print(f"\nFINAL ANSWER:\n{final_answer}")
            return final_answer

    # If we hit max_iterations without a final answer, return an error.
    # This is your safety net against infinite loops.
    return f"Error: Agent did not complete within {max_iterations} iterations."


# ── STEP 6: Test the Agent ────────────────────────────────
if __name__ == "__main__":

    # Test 1: Pure math — agent should use calculate tool
    run_agent("What is 15% of TechCorp's annual revenue?")

    # Test 2: Mixed — needs lookup_fact + calculate
    run_agent(
        "If TechCorp's revenue grows by 12% next year, "
        "what will it be in dollars?"
    )

    # Test 3: Multi-step reasoning
    run_agent(
        "How much revenue does each TechCorp employee generate on average?"
    )
```

### What Happens When You Run It

Let's trace through exactly what happens for Test 3:

```
TRACE: "How much revenue does each employee generate?"
═══════════════════════════════════════════════════════

  Iteration 1:
  ───────────
  THINK: LLM reads the question.
         "I need revenue AND employee count to divide.
          Let me get the revenue first."

  TOOL CALL:  lookup_fact("revenue")
  OBSERVE:    "TechCorp's annual revenue is $4.2 billion"

  Iteration 2:
  ───────────
  THINK: "Good, I have revenue. Now I need employees."

  TOOL CALL:  lookup_fact("employees")
  OBSERVE:    "TechCorp has 12,400 employees"

  Iteration 3:
  ───────────
  THINK: "Now I can calculate 4,200,000,000 / 12,400"

  TOOL CALL:  calculate("4200000000 / 12400")
  OBSERVE:    "4200000000 / 12400 = 338709.67..."

  Iteration 4:
  ───────────
  THINK: "I have everything I need. Provide final answer."

  FINAL ANSWER:
  "Each TechCorp employee generates approximately $338,710
   in annual revenue on average ($4.2B ÷ 12,400 employees)."
```

Notice the agent:
1. Planned what info it needed
2. Made 3 tool calls in sequence
3. Did the math
4. Composed a clean answer

All without you writing a single `if` statement about what order to do things!

---

> ⚠️ **Common Mistake #1:** Using `eval()` without restrictions.
> ```python
> # DANGEROUS - never do this in production:
> result = eval(user_input)  # User could type: __import__('os').system('rm -rf /')
>
> # SAFER (but still not production-grade):
> result = eval(expression, {"__builtins__": {}})
>
> # PRODUCTION-GRADE: use the `simpleeval` library
> from simpleeval import simple_eval
> result = simple_eval(expression)  # Only evaluates math, nothing else
> ```

---

> ⚠️ **Common Mistake #2:** Forgetting to append tool results to `messages`.
> ```python
> # WRONG: LLM never sees what the tool returned
> tool_result = run_tool(tool_name, args)
> # (forgot to append!) → LLM gets confused, loops forever
>
> # CORRECT: Always append with role="tool"
> tool_result = run_tool(tool_name, args)
> messages.append({
>     "role": "tool",
>     "tool_call_id": tool_call.id,  # Required! Links result to call
>     "content": tool_result
> })
> ```

---

> 💡 **Pro Tip:** Use `gpt-4o-mini` for your agent loops, not `gpt-4o`. Agents make multiple API calls per task. At 10 iterations × 10 tasks/day = 100 API calls. `gpt-4o-mini` costs ~30x less and is fast enough for tool-calling decisions. Save `gpt-4o` for the final answer generation if you need max quality.

---

> 💡 **Pro Tip:** The `system` prompt is your agent's DNA. A bad system prompt = a confused, loopy, expensive agent. Spend 80% of your time on the system prompt, 20% on code. The best system prompts describe:
> 1. WHO the agent is
> 2. WHAT it can do (and can't do)
> 3. HOW it should reason
> 4. WHEN to stop and ask the user
> 5. What format to use for answers

---

## 8. Hands-On Exercise

> ✋ **Your turn! Do this before Chapter 2.**

### Exercise: Add a "Database Query" Tool

You've just built an agent with `calculate` and `lookup_fact`. Now extend it:

**Task:** Add a third tool called `count_orders` that simulates querying an orders database.

```python
# STARTER CODE — add this tool to your first_agent.py

# Step 1: Add this to the TOOLS list:
{
    "type": "function",
    "function": {
        "name": "count_orders",
        "description": "???",  # Write a good description!
        "parameters": {
            "type": "object",
            "properties": {
                "status":  {"type": "string", "description": "???"},
                "days_ago": {"type": "integer", "description": "???"}
            },
            "required": ["status"]
        }
    }
}

# Step 2: Implement this function:
def count_orders(status: str, days_ago: int = 30) -> str:
    """Your implementation here."""
    # Fake data — return order counts for different statuses
    fake_data = {
        "pending":   142,
        "shipped":   1823,
        "delivered": 9241,
        "refunded":  87,
        "cancelled": 203,
    }
    # Return a meaningful string with the count
    # ... your code here ...

# Step 3: Add it to the run_tool() dispatcher

# Step 4: Test with this question:
run_agent(
    "What percentage of our last 30 days of orders were refunded?"
)
# Expected behavior: agent should call count_orders("refunded")
# AND count_orders for total, then calculate the percentage.
# Can you predict how many iterations it will take?
```

**Bonus Challenge:** What happens if you ask:
> "If our refund rate is costing us 15% of revenue, how much money is that?"

Can the agent chain `lookup_fact` + `count_orders` + `calculate` all in one run?

---

## 9. Chapter Summary

```
WHAT YOU LEARNED TODAY:
═══════════════════════
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  CONCEPT               KEY TAKEAWAY                         │
│  ─────────────────────────────────────────────────────────  │
│  Chatbot vs Agent      Agent ACTS, chatbot TALKS            │
│  3 Agentic Properties  Autonomy + Tools + Multi-step        │
│  4 Core Components     LLM + Tools + Memory + Planning      │
│  ReAct Loop            Think → Act → Observe → Repeat       │
│  Multi-Agent           Orchestrator + Specialist Agents      │
│  Tool Definition       JSON schema describes tool to LLM    │
│  Tool Execution        YOU run the tool, feed result back    │
│  Message History       How agents "remember" past steps     │
│  Max Iterations        Safety net against infinite loops     │
│                                                             │
│  GOLDEN RULES:                                              │
│  ✅ Always set max_iterations                               │
│  ✅ Always append tool results back to messages             │
│  ✅ Spend most time on your system prompt                   │
│  ✅ Use cheaper models for iteration, better for answers    │
│  ✅ Keep humans in the loop for high-stakes decisions       │
│  ✅ One tool = one clear responsibility                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║  Ready for Chapter 2? Type NEXT →                                ║
║                                                                  ║
║  CHAPTER 2 PREVIEW: Tools & Tool Calling Deep Dive              ║
║  ─────────────────────────────────────────────────              ║
║  → Design tools that agents actually use (and don't misuse)     ║
║  → Async tools for parallel action                              ║
║  → Real tools: browser control, code execution, file system     ║
║  → Tool error handling & retry logic                            ║
║  → Build a coding agent that can run its own Python output      ║
║  → Industry use case: DevOps agent that monitors & self-heals   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

*📝 Chapter 1 Complete! Authored for Agentic AI Full Stack Developer Course*
*Next: Chapter 2 → Tools and Tool Calling Deep Dive*
# 🤖 Agentic AI Full Stack Developer Course
## Chapter 1: What is Agentic AI?
### *LLMs vs Agents · The Agent Loop · Why It Matters*

> **Your Professor Today:** 20+ years shipping production AI systems. I've seen the whole journey — from expert systems in the 90s to GPT wrappers in 2023 to real autonomous agents today. This chapter gives you the mental model you need before writing a single line of agentic code. Let's go! 🚀

---

```
╔═══════════════════════════════════════════════════════════════╗
║  📦 CHAPTER 1 AT A GLANCE                                    ║
╠═══════════════════════════════════════════════════════════════╣
║  🧠 LLMs vs. Agents — what's the actual difference?          ║
║  🔄 The Agent Loop — the heartbeat of every agentic system   ║
║  🌍 Why Agentic AI matters — industry context + ROI          ║
║  🐍 Code — your first agent in ~60 lines of Python           ║
║  🏭 Real Use Cases — e-commerce, DevOps, legal               ║
║  📝 Mini-Quiz — 4 questions to lock in the knowledge         ║
║  👀 Chapter 2 Preview — what's coming next                   ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📋 Table of Contents

1. [What is an LLM? (Quick Recap)](#1-what-is-an-llm-quick-recap)
2. [LLMs vs. Agents — The Core Distinction](#2-llms-vs-agents--the-core-distinction)
3. [The Agent Loop — The Heartbeat of Agentic AI](#3-the-agent-loop--the-heartbeat-of-agentic-ai)
4. [Why Agentic AI Matters](#4-why-agentic-ai-matters)
5. [Real Industry Examples](#5-real-industry-examples)
6. [Code: Your First Agent in Python](#6-code-your-first-agent-in-python)
7. [Mini-Quiz](#7-mini-quiz)
8. [Chapter 2 Preview](#8-chapter-2-preview)

---

## 1. What is an LLM? (Quick Recap)

Before we can understand what an *agent* is, we need to be crystal clear on what an LLM is — and more importantly, what it **isn't**.

A **Large Language Model (LLM)** is a neural network trained on massive amounts of text. It does one thing really well:

```
THE CORE LLM OPERATION:
════════════════════════

  INPUT (prompt):        OUTPUT (completion):
  ┌──────────────┐       ┌────────────────────────┐
  │ "What is the │  ───► │ "The capital of France  │
  │  capital of  │       │  is Paris."             │
  │  France?"    │       └────────────────────────┘
  └──────────────┘
         │
         ▼
  Text in → Text out.
  That's it. That's ALL it does.

  Under the hood:
  ┌──────────────────────────────────────────────────────┐
  │  Input tokens → Transformer layers → Output tokens   │
  │                                                      │
  │  The model predicts the MOST LIKELY next token,      │
  │  one at a time, until it decides to stop.            │
  └──────────────────────────────────────────────────────┘
```

An LLM is a **frozen function**. It has no memory between conversations. It can't browse the internet. It can't run your code. It can't send an email. It can't call an API.

It just turns text into text. *Fast. Brilliantly. But that's the limit.*

---

## 2. LLMs vs. Agents — The Core Distinction

Here's the most important diagram in this entire course. Burn it into your brain:

```
LLM (Language Model):
══════════════════════

  ┌──────────────────────────────────────────────────────────┐
  │                                                          │
  │   User Message ──────────────────►  LLM  ──►  Reply     │
  │                                                          │
  │   One input. One output. One turn.                       │
  │   Nothing in the real world changes.                     │
  │   No tools. No memory. No loops.                         │
  │                                                          │
  └──────────────────────────────────────────────────────────┘

  Example:
  "Summarize this article" → LLM → "Here's a summary: ..."
  Done. Process over.


AI AGENT:
══════════

  ┌──────────────────────────────────────────────────────────┐
  │                                                          │
  │   User Goal                                              │
  │       │                                                  │
  │       ▼                                                  │
  │   ┌────────────┐                                         │
  │   │            │──── Thinks ──────────────┐             │
  │   │    LLM     │                          │             │
  │   │  (brain)   │◄─── Observes ────────────┤             │
  │   │            │                          │             │
  │   └────────────┘                          │             │
  │         │                                 │             │
  │         │ Decides to call                 │             │
  │         ▼                                 │             │
  │   ┌──────────┐  ┌──────────┐  ┌────────┐  │             │
  │   │ Search   │  │ Run Code │  │ Send   │  │             │
  │   │  Web     │  │          │  │ Email  │  │             │
  │   └──────────┘  └──────────┘  └────────┘  │             │
  │         │              │           │       │             │
  │         └──── Results ─┴───────────┘───────┘             │
  │                                                          │
  │   Loops until goal is achieved.                          │
  │   Real things happen in the real world.                  │
  │                                                          │
  └──────────────────────────────────────────────────────────┘

  Example:
  "Research competitors and email me a report"
  → searches web → reads pages → writes report → sends email
  Done. Four real-world actions executed. No human involved.
```

### The Two Key Differences, Side by Side

```
┌────────────────────┬──────────────────────┬──────────────────────┐
│   PROPERTY         │   LLM ALONE           │   AI AGENT           │
├────────────────────┼──────────────────────┼──────────────────────┤
│ Action             │ Generates text        │ Executes actions     │
│ Memory             │ Resets each call      │ Persists across steps│
│ Decision-making    │ One response          │ Multi-step planning  │
│ Tools              │ None                  │ Calculator, browser, │
│                    │                       │ DB, APIs, terminal   │
│ World impact       │ Zero — words only     │ Sends emails, books  │
│                    │                       │ flights, writes code │
│ Loop               │ No                    │ Yes — repeats until  │
│                    │                       │ goal reached         │
│ Autonomy           │ Zero                  │ High                 │
└────────────────────┴──────────────────────┴──────────────────────┘
```

> **Think of it this way:** An LLM is a brilliant consultant who can only give *advice* in text. An AI Agent is that same consultant but they can also *pick up the phone, call suppliers, update the spreadsheet, and close the deal* — all by themselves.

---

## 3. The Agent Loop — The Heartbeat of Agentic AI

Every AI agent ever built — from a simple toy to Devin (the $500/hour coding AI) — runs on this same loop. It's called **ReAct** (Reasoning + Acting):

```
THE REACT LOOP:
════════════════

  ┌──────────────────────────────────────────────────────────┐
  │                                                          │
  │   GOAL: "Find the cheapest GPU on Amazon under $400"     │
  │                                                          │
  │   ┌──────────────────────────────────────────────────┐   │
  │   │  ITERATION 1                                     │   │
  │   │                                                  │   │
  │   │  💭 THINK: "I need to search Amazon for GPUs." │   │
  │   │                                                  │   │
  │   │  ⚡ ACT:   search_amazon("GPU under $400")       │   │
  │   │                                                  │   │
  │   │  👁 OBSERVE: "Found 12 results. Top: RTX 4060    │   │
  │   │              $389, RTX 3070 $349, RX 7600 $289"  │   │
  │   └───────────────────────┬──────────────────────────┘   │
  │                           │                              │
  │   ┌───────────────────────▼──────────────────────────┐   │
  │   │  ITERATION 2                                     │   │
  │   │                                                  │   │
  │   │  💭 THINK: "RX 7600 is cheapest. But is it      │   │
  │   │             actually in stock and good reviews?" │   │
  │   │                                                  │   │
  │   │  ⚡ ACT:   get_product_details("RX 7600 AMD")    │   │
  │   │                                                  │   │
  │   │  👁 OBSERVE: "In stock. 4.3/5 stars. 847 reviews │   │
  │   │              Excellent for 1080p gaming."        │   │
  │   └───────────────────────┬──────────────────────────┘   │
  │                           │                              │
  │   ┌───────────────────────▼──────────────────────────┐   │
  │   │  ITERATION 3                                     │   │
  │   │                                                  │   │
  │   │  💭 THINK: "I have price, stock, and reviews.   │   │
  │   │             I can answer now. No more tools."    │   │
  │   │                                                  │   │
  │   │  ✅ FINAL ANSWER: "The cheapest GPU is the AMD   │   │
  │   │     RX 7600 at $289. In stock, 4.3/5 stars,     │   │
  │   │     great for 1080p. Here's the link: ..."       │   │
  │   └──────────────────────────────────────────────────┘   │
  │                                                          │
  └──────────────────────────────────────────────────────────┘
```

### The Loop as Python Pseudocode

Before we write the real thing, here's the loop in plain English Python:

```python
# This is NOT real code yet — just the logical skeleton
# so you can SEE the loop structure

def agent_loop(user_goal):

    messages = [system_prompt, user_goal]  # Start conversation

    for step in range(max_steps):           # Safety limit!

        response = llm.think(messages)      # 💭 THINK

        if response.wants_to_use_tool():
            tool_name, tool_args = response.get_tool_call()
            result = run_tool(tool_name, tool_args)    # ⚡ ACT
            messages.append(result)                    # 👁 OBSERVE
            # → loop continues

        else:
            return response.final_answer    # ✅ DONE
```

That's it. That's the entire architecture of 95% of AI agents. Before we code it for real, let's understand WHY this matters.

---

## 4. Why Agentic AI Matters

Let's be direct about the business case. Why should a full-stack developer care about this right now?

### The Automation Gap

```
WHERE AUTOMATION WAS (before agents):
════════════════════════════════════════

  COMPUTER              │  HUMAN REQUIRED
  ──────────────────────┼──────────────────────────────────
  Form validation       │  Read the angry email
  Database queries      │  Decide what to do about it
  Send standard reply   │  Write a custom response
  Process payment       │  Handle the edge case
  Log the transaction   │  File the exception report
                        │  Notify the right team
                        │  Update the status tracker

  Software handled the EASY parts.
  Humans handled everything that required JUDGMENT.

WHERE AUTOMATION IS NOW (with agents):
════════════════════════════════════════

  COMPUTER + AGENT      │  HUMAN REQUIRED (sometimes)
  ──────────────────────┼──────────────────────────────────
  Form validation       │  Approve high-value refunds
  Database queries      │  Review policy changes
  Read the email        │  Handle truly novel edge cases
  Diagnose the issue    │
  Decide what to do     │  ← Agents can now do this!
  Write custom response │
  Send + log + notify   │
  Update all trackers   │

  Agents handle JUDGMENT calls too.
```

### The Numbers That Are Moving Industry

```
REAL PRODUCTION NUMBERS (2024-2025):
══════════════════════════════════════

  Customer Support (Klarna AI):
  ├── 700 human agents replaced by 1 AI agent
  ├── Handles 2.3M conversations/month
  ├── Same CSAT as human agents
  └── Saves $40M/year

  Code Review (GitHub Copilot Workspace):
  ├── 55% of developers ship faster
  ├── First draft PRs in minutes not hours
  └── Bug catch rate improved 23%

  Legal Research (Harvey AI):
  ├── 3-hour research task → 4 minutes
  ├── Used by Allen & Overy (3,000+ lawyers)
  └── $80M Series B in 2024

  Healthcare (Ambience Healthcare):
  ├── Clinical note writing: 30 min → 2 min
  ├── Physicians see 20% more patients/day
  └── Burnout scores dropped 40%
```

### Why YOU as a Full-Stack Dev Should Care

```
THE FULL-STACK DEVELOPER OPPORTUNITY:
═══════════════════════════════════════

  OLD FULL-STACK ROLE:           NEW FULL-STACK ROLE:
  ─────────────────────          ─────────────────────
  Build the UI         ────►     Build the UI
  Connect to API       ────►     Connect to API
  Write CRUD logic     ────►     Write CRUD logic
                                 + Design agent workflows
                                 + Build tool libraries
                                 + Wire LLM orchestration
                                 + Manage agent memory
                                 + Handle async agent tasks

  Companies are looking for devs who can ship
  BOTH a beautiful React frontend AND the
  agentic backend that powers it.

  That full-stack agent dev?
  Currently commands $180K-$280K in the US market.
```

---

## 5. Real Industry Examples

### 🛒 E-Commerce: Customer Service Agent

```
SCENARIO: Customer emails "I want to cancel my order #8821"

WITHOUT AN AGENT:
  Customer emails → Ticket created → Queued → Human reads it
  → Checks order DB → Checks cancellation policy → Replies
  Time: 4-24 hours. Cost: ~$8 per ticket.

WITH AN AGENT:
  Email arrives ──► Agent activated
                         │
          ┌──────────────▼──────────────┐
          │  THINK: "Cancellation       │
          │  request. I need to check:  │
          │  1) order status            │
          │  2) cancellation policy     │
          │  3) refund eligibility"     │
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │  ACT: lookup_order(8821)    │
          │  OBS: "Status: Processing.  │
          │        Paid: $94.99"        │
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │  ACT: check_policy(         │
          │         "cancellation",     │
          │         order_status=       │
          │         "Processing")       │
          │  OBS: "Eligible for full    │
          │        refund if cancelled  │
          │        within 2 hours"      │
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │  ACT: cancel_order(8821)    │
          │  OBS: "Cancelled. Refund    │
          │        issued: $94.99"      │
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │  ACT: send_email(customer,  │
          │    "Your order #8821 has    │
          │     been cancelled. Full    │
          │     refund of $94.99 in     │
          │     3-5 business days.")    │
          └──────────────┬──────────────┘
                         │
                    ✅ DONE in 6 seconds
                    Cost: ~$0.03
```

### ⚙️ DevOps: Self-Healing Infrastructure Agent

```
SCENARIO: Production server CPU spikes to 98% at 3am

WITHOUT AN AGENT:
  Alert fires → PagerDuty wakes up on-call dev → Dev logs in
  → Checks dashboards → Reads logs → Diagnoses → Fixes
  Time: 20-45 min. Dev is exhausted. Incident report tomorrow.

WITH AN AGENT:
  Alert fires → Agent wakes up (no human paged yet)

  THINK: "High CPU. Let me diagnose before escalating."

  ACT:   get_server_metrics(server="prod-api-03")
  OBS:   "CPU: 98%. Memory: 67%. 847 open connections."

  THINK: "Too many connections. Check for a runaway process."

  ACT:   run_command("ps aux --sort=-%cpu | head -20")
  OBS:   "PID 19284 using 87% CPU: /app/report-generator"

  THINK: "Report generator is stuck. Safe to restart."

  ACT:   restart_process(pid=19284)
  OBS:   "Process restarted. CPU now: 12%."

  THINK: "Resolved. Log it and notify team."

  ACT:   create_incident_report(
           issue="runaway report-generator",
           resolution="restarted PID 19284",
           duration="4 minutes",
           human_paged=False
         )
  ACT:   notify_slack(channel="#incidents",
           msg="Auto-resolved: prod-api-03 CPU spike. "
               "Report generator restarted. All clear.")

  ✅ DONE in 4 minutes. Dev sleeps through the night.
  The incident reports itself. 🎉
```

---

## 6. Code: Your First Agent in Python

Now let's build a real, working agent. We're using the OpenAI API directly — **no frameworks** — so you see exactly what's happening under the hood.

### Prerequisites

```bash
# In your terminal:
pip install openai python-dotenv

# Create a file called .env in your project root:
# OPENAI_API_KEY=sk-your-key-here
```

### The Agent — Fully Annotated

```python
# =========================================================
# FILE: my_first_agent.py
# A working AI agent — no LangChain, no magic, just Python
# =========================================================

# -- Imports ----------------------------------------------

import json           # We need this to parse tool arguments
                      # The LLM sends args as JSON strings

import os             # To read environment variables

from openai import OpenAI     # The official OpenAI client library

from dotenv import load_dotenv  # Reads your .env file into os.environ
                                # So you don't hardcode API keys


# -- Configuration ----------------------------------------

load_dotenv()   # Load OPENAI_API_KEY from .env file into environment

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
    # If OPENAI_API_KEY isn't set, this returns None
    # and the next API call will raise an AuthenticationError
)

MODEL = "gpt-4o-mini"    # We use the mini model for the loop.
                          # It's ~30x cheaper than gpt-4o.
                          # Save the big model for final answers.

MAX_ITERATIONS = 8        # Safety limit. Without this, a confused
                          # agent will loop forever burning your budget.


# -- Tool Definitions -------------------------------------
# These JSON objects DESCRIBE your tools to the LLM.
# The LLM reads these descriptions to decide WHEN to call each tool.
# Writing good descriptions is an art — be specific!

TOOLS = [
    {
        "type": "function",         # Always "function" for Python tools
        "function": {
            "name": "search_products",   # Must match Python function below
            "description": (
                "Search the product catalog for items matching a query. "
                "Use this when the user asks about product availability, "
                "pricing, or specifications. Returns a list of matches."
            ),
            "parameters": {
                "type": "object",    # Parameters are always an object
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search term, e.g. 'wireless headphones'"
                    },
                    "max_price": {
                        "type": "number",
                        "description": "Optional: maximum price filter in USD"
                    }
                },
                "required": ["query"]  # Only 'query' is mandatory
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_order_status",
            "description": (
                "Look up the current status of a customer order by order ID. "
                "Use this when the user asks where their order is, "
                "if it shipped, or when it will arrive."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "string",
                        "description": "The order ID, e.g. 'ORD-4821'"
                    }
                },
                "required": ["order_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": (
                "Perform arithmetic calculations. "
                "Use for totals, percentages, discounts, tax calculations. "
                "Pass a valid Python math expression as a string."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": (
                            "A Python math expression. "
                            "Examples: '99.99 * 0.9', '(50 + 30) * 1.08'"
                        )
                    }
                },
                "required": ["expression"]
            }
        }
    }
]


# -- Tool Implementations ---------------------------------
# These are the ACTUAL functions the agent will call.
# In production, these would query real databases and APIs.
# Here we use hardcoded data to keep things runnable.

def search_products(query: str, max_price: float = None) -> str:
    """Simulate searching a product catalog."""

    # In production: SELECT * FROM products WHERE name LIKE %query%
    # For this demo: fake hardcoded catalog
    catalog = [
        {"name": "Sony WH-1000XM5 Headphones", "price": 349.99, "in_stock": True},
        {"name": "Bose QuietComfort 45",         "price": 279.99, "in_stock": True},
        {"name": "Apple AirPods Pro 2",           "price": 249.99, "in_stock": False},
        {"name": "Jabra Evolve2 85",              "price": 449.99, "in_stock": True},
        {"name": "Samsung Galaxy Buds2 Pro",      "price": 189.99, "in_stock": True},
    ]

    # Filter: keyword match
    results = [
        p for p in catalog
        if query.lower() in p["name"].lower()
    ]

    # Filter: price limit if given
    if max_price is not None:
        results = [p for p in results if p["price"] <= max_price]

    # Format results as readable text for the LLM
    if not results:
        return f"No products found matching '{query}'" + (
            f" under ${max_price}" if max_price else ""
        )

    lines = [f"Found {len(results)} product(s):"]
    for p in results:
        stock = "In Stock" if p["in_stock"] else "Out of Stock"
        lines.append(f"  - {p['name']}: ${p['price']} ({stock})")

    return "\n".join(lines)


def get_order_status(order_id: str) -> str:
    """Simulate looking up an order in the database."""

    # In production: SELECT * FROM orders WHERE id = order_id
    fake_orders = {
        "ORD-4821": {
            "status": "Shipped",
            "carrier": "FedEx",
            "tracking": "FX998123456",
            "eta": "Tomorrow by 8pm"
        },
        "ORD-3392": {
            "status": "Processing",
            "eta": "Ships within 1-2 business days"
        },
        "ORD-9001": {
            "status": "Delivered",
            "delivered_on": "Yesterday at 2:34pm",
            "signed_by": "Left at door"
        }
    }

    order = fake_orders.get(order_id.upper())

    if not order:
        return f"Order {order_id} not found. Please check the order ID."

    # Build a readable status string
    info = f"Order {order_id}: Status = {order['status']}"
    if "carrier" in order:
        info += f", Carrier: {order['carrier']}, Tracking: {order['tracking']}"
    if "eta" in order:
        info += f", ETA: {order['eta']}"
    if "delivered_on" in order:
        info += f", Delivered: {order['delivered_on']}"

    return info


def calculate(expression: str) -> str:
    """Safely evaluate a math expression."""
    try:
        # We restrict eval to math only.
        # For production, use the `simpleeval` library instead.
        result = eval(expression, {"__builtins__": {}})
        return f"Result: {expression} = {result}"
    except Exception as e:
        return f"Calculation error: {str(e)}"


# -- Tool Dispatcher --------------------------------------
# This routes the LLM's tool requests to the right Python function.
# Think of it as a switchboard operator.

def execute_tool(tool_name: str, tool_args: dict) -> str:
    """Call the right function based on which tool the LLM requested."""

    print(f"    🔧 Calling: {tool_name}({tool_args})")

    if tool_name == "search_products":
        return search_products(**tool_args)
                               # ** unpacks {"query": "headphones"} into
                               # search_products(query="headphones")

    elif tool_name == "get_order_status":
        return get_order_status(**tool_args)

    elif tool_name == "calculate":
        return calculate(**tool_args)

    else:
        # Safety net: if LLM invents a tool name (it sometimes does!)
        return f"Error: Unknown tool '{tool_name}'. Available: search_products, get_order_status, calculate"


# -- The Agent Loop ---------------------------------------
# This is the core. Everything above was setup.
# This is where the magic actually happens.

def run_agent(user_message: str) -> str:
    """
    Run the AI agent to respond to a user message.

    The agent will think, call tools as needed, observe results,
    and repeat until it can give a confident final answer.

    Args:
        user_message: What the user typed/said

    Returns:
        The agent's final response string
    """

    print(f"\n{'='*60}")
    print(f"USER: {user_message}")
    print('='*60)

    # The message list is the agent's SHORT-TERM MEMORY.
    # Every message — user, assistant, tool result — gets added here.
    # The LLM reads the FULL list on every call, so it "remembers"
    # what it decided and what the tools returned.
    messages = [
        {
            "role": "system",
            # The system prompt is the MOST IMPORTANT thing you write.
            # It defines: who the agent is, what it can do,
            # how it should reason, and when to give a final answer.
            "content": (
                "You are a helpful e-commerce assistant for ShopBot. "
                "You help customers find products, track orders, and "
                "calculate discounts and totals. "
                "Use your tools to look up real information before answering. "
                "If you need multiple pieces of info, get them all via tools "
                "before writing your final response. "
                "Be friendly, concise, and always include specific details "
                "like prices, ETAs, and order statuses in your answers."
            )
        },
        {
            "role": "user",         # This is the customer's message
            "content": user_message
        }
    ]

    # THE LOOP: iterate until we get a final answer (or hit max_iterations)
    for iteration in range(MAX_ITERATIONS):

        print(f"\n  [Iteration {iteration + 1}]")

        # ── THINK ────────────────────────────────────────────
        # Send the conversation to the LLM.
        # It will either call a tool OR give a final answer.

        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,    # Full conversation so far
            tools=TOOLS,          # What tools are available
            tool_choice="auto",   # Let the LLM decide when to use tools
                                  # "auto" = LLM chooses
                                  # "none"  = force no tool use
                                  # "required" = force tool use
        )

        # Get the LLM's response message
        assistant_msg = response.choices[0].message
        # response.choices[0]  → the first completion (there's usually 1)
        # .message             → the Message object with role + content

        # CRITICAL: Add the LLM's message back to conversation history.
        # If you forget this, the LLM won't know what it decided.
        messages.append(assistant_msg)

        # ── DECISION: Tool Call or Final Answer? ─────────────

        if assistant_msg.tool_calls:
            # The LLM wants to call one or more tools
            print(f"  💭 THINK: Agent chose {len(assistant_msg.tool_calls)} tool(s)")

            # Process each tool call (there can be multiple!)
            for tool_call in assistant_msg.tool_calls:

                # Extract what tool to call
                name = tool_call.function.name

                # Arguments come as a JSON string — parse it
                # e.g., '{"query": "headphones", "max_price": 300}'
                args = json.loads(tool_call.function.arguments)

                # ── ACT ──────────────────────────────────────
                # Actually run the tool
                result = execute_tool(name, args)

                print(f"    👁 OBSERVE: {result[:100]}...")

                # ── OBSERVE ───────────────────────────────────
                # Add the tool result to conversation history.
                # "role: tool" is a special role that tells the LLM:
                # "this is the result of the tool YOU requested."
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,  # Links this result to the call
                    "content": result              # The actual result text
                })

            # Loop continues → LLM will think again with the new info

        else:
            # ── FINAL ANSWER ──────────────────────────────────
            # The LLM didn't call any tools.
            # It has all the info it needs and is ready to respond.

            final_answer = assistant_msg.content
            print(f"\n  ✅ AGENT DONE ({iteration + 1} iteration(s))")
            print(f"\nAGENT RESPONSE:\n{final_answer}")
            return final_answer

    # If we made it here, the agent used all MAX_ITERATIONS without
    # giving a final answer. Return a graceful error.
    return (
        f"I wasn't able to complete your request within "
        f"{MAX_ITERATIONS} steps. Please try rephrasing."
    )


# -- Run It! ----------------------------------------------

if __name__ == "__main__":

    # Test 1: Simple product search
    run_agent("Do you have any wireless headphones under $300?")

    # Test 2: Order lookup
    run_agent("Where is my order ORD-4821? Will it arrive today?")

    # Test 3: Multi-step: search + calculate
    run_agent(
        "I want the Sony headphones. "
        "How much would they cost with a 15% student discount?"
    )
```

### Tracing Test 3 Step by Step

Let's manually trace what happens when we ask about the student discount:

```
QUERY: "I want the Sony headphones. How much with 15% student discount?"
═══════════════════════════════════════════════════════════════════════════

  Iteration 1:
  ─────────────
  💭 THINK: "User wants Sony headphones price with discount.
             I need the Sony price first. Let me search."

  🔧 CALL:   search_products(query="Sony")
  👁 OBSERVE: "Sony WH-1000XM5 Headphones: $349.99 (In Stock)"

  → Loop continues (still need to calculate discount)

  Iteration 2:
  ─────────────
  💭 THINK: "Sony costs $349.99. 15% student discount means
             they pay 85% of the price. Let me calculate."

  🔧 CALL:   calculate(expression="349.99 * 0.85")
  👁 OBSERVE: "Result: 349.99 * 0.85 = 297.4915"

  → Loop continues (rounding needed? LLM will decide)

  Iteration 3:
  ─────────────
  💭 THINK: "Have price ($349.99) and discounted price ($297.49).
             I have everything I need to answer. No more tools."

  ✅ FINAL ANSWER:
  "The Sony WH-1000XM5 headphones are normally $349.99.
   With your 15% student discount, you'd pay $297.49 —
   saving $52.50! They're currently in stock. Want me to
   help you add them to your cart?"

  3 iterations. 2 tool calls. Zero human involvement. ✅
```

---

## 7. Mini-Quiz

Test yourself! No peeking until you've thought about each one. 🧠

---

**Q1:** A developer builds a system where a user asks a question and receives one AI-generated response. No tools, no loops, no memory between questions. Is this an LLM or an AI Agent?

```
A) AI Agent — it uses an LLM internally
B) LLM-based system — no autonomous action or loops
C) Neither — it's just a chatbot
D) Both — all LLM systems are agents
```

---

**Q2:** In the ReAct loop, what happens IMMEDIATELY after the agent calls a tool?

```
A) The agent sends the final answer to the user
B) The agent calls another tool automatically
C) The tool result is added to the conversation → LLM thinks again
D) The conversation resets and starts from scratch
```

---

**Q3:** You forget to append the tool result back to the `messages` list. What happens?

```
A) Nothing — the LLM still gets the result somehow
B) The tool doesn't execute
C) The LLM doesn't know the tool ran and may call it again, looping forever
D) The code raises an exception immediately
```

---

**Q4:** Why do we set `MAX_ITERATIONS = 8` (or similar) in every agent?

```
A) The OpenAI API limits us to 8 calls per request
B) To prevent confused agents from looping forever and burning API credits
C) Because 8 is the maximum number of tools you can define
D) To make the agent faster by limiting its thinking time
```

---

<details>
<summary>📋 Click to reveal answers + explanations</summary>

**Q1: B — LLM-based system**

An AI Agent requires: autonomous decision-making across multiple steps, the ability to call tools that affect the real world, and a loop that continues until a goal is achieved. A one-shot Q&A system has none of these. It's a great LLM application, but not an agent.

**Q2: C — Tool result is added to conversation → LLM thinks again**

This is the OBSERVE step of the ReAct loop. The tool runs, its result is appended to `messages` with `"role": "tool"`, and the loop continues with another LLM call. The LLM then sees the result and decides: call another tool, or give the final answer.

**Q3: C — The LLM doesn't know the tool ran and may loop forever**

This is the #1 most common bug in first-time agent code. If you call `execute_tool()` but forget `messages.append(tool_result)`, the LLM's next call has no knowledge that the tool was called. It will think it still needs to call the tool and do so again. Repeat until MAX_ITERATIONS. Always append tool results!

**Q4: B — Safety net against infinite loops**

A confused or misbehaving agent can get stuck in a loop — calling the same tool repeatedly, getting ambiguous results, and never reaching a final answer. Without a limit, this runs indefinitely and costs real money ($0.002–$0.03 per loop on LLM APIs). Always set a limit and always handle the "limit reached" case gracefully.

</details>

---

## 8. Chapter 2 Preview

```
╔═══════════════════════════════════════════════════════════════╗
║  🔜 COMING UP IN CHAPTER 2: Tools & Tool Calling Deep Dive  ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  In Chapter 1 we saw tools at a surface level.               ║
║  Chapter 2 goes deep:                                         ║
║                                                               ║
║  🔧 Designing tools agents actually use correctly             ║
║     → The art of writing tool descriptions the LLM loves     ║
║     → When to use 1 tool vs. 10 tools                        ║
║     → Tool input validation & output formatting              ║
║                                                               ║
║  ⚡ Parallel tool calling                                     ║
║     → Run multiple tools at the SAME TIME (async)            ║
║     → 3x speed improvement on multi-step tasks               ║
║                                                               ║
║  🌐 Real-world tools, built end-to-end:                      ║
║     → Browser control tool (Playwright)                      ║
║     → Code execution tool (safe Python sandbox)              ║
║     → File system tool (read/write/search files)             ║
║     → Database query tool (real SQL calls)                   ║
║                                                               ║
║  🛠 Build-along project:                                      ║
║     A DevOps agent that monitors your app, detects issues,   ║
║     runs diagnostic commands, and opens GitHub issues —       ║
║     all without a human pressing a single button.            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Chapter 1 Summary

```
KEY TAKEAWAYS:
══════════════
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  LLM alone    = text in, text out, one turn, no memory     │
│  AI Agent     = goal in, actions out, many turns, memory   │
│                                                             │
│  The Agent Loop:                                            │
│    1. 💭 THINK  — LLM decides what to do next              │
│    2. ⚡ ACT    — tool is executed in the real world        │
│    3. 👁 OBSERVE — result added back to conversation        │
│    4. 🔁 REPEAT — until goal achieved or limit hit          │
│                                                             │
│  Every Agent needs:                                         │
│    ✅ A clear system prompt (identity + rules)              │
│    ✅ Tool definitions (JSON schema for LLM to read)        │
│    ✅ Tool implementations (actual Python functions)        │
│    ✅ A dispatcher (routes tool calls to functions)         │
│    ✅ Message history (short-term memory)                   │
│    ✅ MAX_ITERATIONS safety limit (always!)                 │
│                                                             │
│  Golden Rules:                                              │
│    → ALWAYS append tool results back to messages           │
│    → ALWAYS set a max iteration limit                       │
│    → Write tool descriptions for the LLM, not yourself     │
│    → Use cheaper models for loop steps, better for final   │
│    → The system prompt is the most important code you write │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

*📝 Chapter 1 Complete — Agentic AI Full Stack Developer Course*
*Next: Chapter 2 → Tools and Tool Calling Deep Dive*
