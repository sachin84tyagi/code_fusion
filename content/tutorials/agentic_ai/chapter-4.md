# 📘 Chapter 4: Building Your First Agent in Python from Scratch

> **Course:** Practical AI Engineering for Full-Stack Developers  
> **Prerequisites:** Chapters 1–3 (LLMs, Prompting, Tool Calling)  
> **Time to Complete:** ~3 hours  
> **Difficulty:** ⭐⭐⭐☆☆ Intermediate  

---

## 🎓 Professor's Opening Note

Alright, class — settle in. Coffee in hand? Good.

In the last three chapters, we talked *about* agents. We drew diagrams. We used fancy words like "autonomy" and "tool orchestration." Very impressive at dinner parties.

Today? We *build one.* From scratch. In Python. No magic wrappers, no LangChain training wheels. Just you, an LLM SDK, and the beautiful chaos of a reasoning loop.

By the end of this chapter, you'll have a **fully working Research Assistant Agent** that can:
- 🔍 Search the web
- 🧮 Do calculations
- 📝 Summarize findings
- 🔁 Decide — on its own — when it's done

Let's get into it.

---

## 4.1 What Is a ReAct Agent, Really?

Before we write a single line of code, let's lock in the mental model.

**ReAct** stands for **Re**asoning + **Act**ing. It's a pattern (from the 2022 Yao et al. paper) where an LLM:

1. **Thinks** about what to do next (`Thought`)
2. **Chooses** a tool to use (`Action`)
3. **Gets** the result (`Observation`)
4. **Loops** until it has a final answer

This is *not* a one-shot prompt. It's a **control loop** — and your Python code is the loop controller.

### The ReAct Pattern in ASCII

```
┌─────────────────────────────────────────────────────────────────┐
│                        REACT AGENT LOOP                         │
└─────────────────────────────────────────────────────────────────┘

  User Query
      │
      ▼
┌─────────────┐
│  THINK      │  ◄── LLM reasons: "What do I know? What do I need?"
│  (Thought)  │
└──────┬──────┘
       │
       ▼
  ┌────────────┐    YES    ┌─────────────┐
  │  Need Tool?├──────────►│   ACTION    │  ◄── LLM picks tool + args
  └────────────┘           └──────┬──────┘
       │ NO                       │
       │                          ▼
       │                  ┌───────────────┐
       │                  │  TOOL RUNS    │  ◄── Your Python code executes
       │                  │ (Observation) │
       │                  └──────┬────────┘
       │                         │
       │                         ▼
       │                  ┌─────────────┐
       │                  │   THINK     │  ◄── LLM sees result, decides next
       │                  │  (Thought)  │
       │                  └──────┬──────┘
       │                         │
       ◄─────────────────────────┘  (loop continues)
       │
       ▼
┌─────────────┐
│ FINAL       │  ◄── LLM decides: "I have enough. Here's the answer."
│  ANSWER     │
└─────────────┘
```

---

## 4.2 Architecture Overview

Here's the full system we're building today:

```
┌────────────────────────────────────────────────────────────────────┐
│                    RESEARCH ASSISTANT AGENT                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────────────┐  │
│  │  User    │────►│  Agent       │────►│  Anthropic /         │  │
│  │  Input   │     │  Controller  │◄────│  OpenAI API          │  │
│  └──────────┘     │  (Python)    │     └──────────────────────┘  │
│                   └──────┬───────┘                               │
│                          │                                        │
│              ┌───────────┼───────────┐                           │
│              ▼           ▼           ▼                           │
│       ┌─────────┐ ┌──────────┐ ┌──────────┐                     │
│       │  search │ │calculate │ │summarize │  ← Tool Registry     │
│       │  tool   │ │  tool    │ │  tool    │                     │
│       └─────────┘ └──────────┘ └──────────┘                     │
│                                                                    │
│       ┌──────────────────────────────────────────┐               │
│       │           Conversation History            │               │
│       │  [user_msg, assistant_msg, tool_result,  │               │
│       │   assistant_msg, tool_result, ...]        │               │
│       └──────────────────────────────────────────┘               │
└────────────────────────────────────────────────────────────────────┘
```

**Key insight:** The "agent" is really just:
- A **loop** in Python
- A **list** of messages (conversation history)
- A **router** that calls the right tool based on LLM output

That's it. There's no black magic here. Let's build it.

---

## 4.3 Project Setup

### File Structure

```
research_agent/
├── agent.py          ← Main agent loop (our star today)
├── tools.py          ← Tool implementations
├── tool_schemas.py   ← Tool definitions for the API
├── config.py         ← Config & API key loading
└── main.py           ← Entry point
```

### Install Dependencies

```bash
pip install anthropic python-dotenv requests
```

> **Instructor Note:** We're using the **Anthropic SDK** with Claude. If you prefer OpenAI, I've included adapter notes throughout. The pattern is identical — only the SDK calls differ.

### `.env` File

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
# OR for OpenAI users:
# OPENAI_API_KEY=sk-your-key-here
```

---

## 4.4 Building the Tools (`tools.py`)

Our Research Assistant needs three capabilities. Let's build them — simply, reliably, testably.

```python
# tools.py
"""
Tool implementations for the Research Assistant Agent.
Each tool is a plain Python function. No magic, no decorators.
The agent controller calls these directly.
"""

import math
import json
import urllib.request
import urllib.parse
from datetime import datetime


def search_web(query: str) -> str:
    """
    Simulates a web search. In production, swap this with
    a real API call to Tavily, SerpAPI, or Brave Search.
    
    Args:
        query: The search query string
        
    Returns:
        A string of search results (simulated here)
    """
    # NOTE: In production, replace this block with a real search API.
    # Example with Tavily: https://docs.tavily.com
    #
    # import requests
    # response = requests.post("https://api.tavily.com/search", json={
    #     "api_key": TAVILY_API_KEY,
    #     "query": query,
    #     "max_results": 3
    # })
    # results = response.json()["results"]
    # return "\n".join([f"- {r['title']}: {r['content']}" for r in results])

    # ── SIMULATED RESULTS (for this tutorial) ────────────────────────
    simulated_db = {
        "python": "Python is a high-level, interpreted programming language created by Guido van Rossum in 1991. Known for its readability and versatility, it's used in web development, data science, AI, and automation.",
        "ai agent": "AI agents are autonomous systems that perceive their environment, make decisions, and take actions to achieve goals. Key components include: perception, reasoning, planning, and execution.",
        "react pattern": "The ReAct (Reasoning + Acting) pattern, introduced in 2022 by Yao et al., enables LLMs to interleave reasoning traces with action calls, improving task completion on complex multi-step problems.",
        "anthropic claude": "Anthropic's Claude is a family of AI assistants built with Constitutional AI for safety. Claude 3.5 Sonnet offers strong performance for complex reasoning tasks, with a 200K token context window.",
        "llm token cost": "As of 2024, LLM API costs vary: GPT-4o at ~$5/1M input tokens, Claude 3.5 Sonnet at ~$3/1M input tokens, Gemini 1.5 Pro at ~$3.50/1M input tokens. Prices continue to drop rapidly.",
    }
    
    # Find best matching topic
    query_lower = query.lower()
    best_result = None
    for key, value in simulated_db.items():
        if key in query_lower or any(word in query_lower for word in key.split()):
            best_result = value
            break
    
    if best_result:
        return f"Search results for '{query}':\n{best_result}"
    else:
        return f"Search results for '{query}':\nFound general information about {query}. This is a fast-growing area with significant developments in 2024, including improvements in efficiency, capability, and accessibility."


def calculate(expression: str) -> str:
    """
    Safely evaluates a mathematical expression.
    
    Args:
        expression: A math expression string e.g. "1000 * 0.03 * 12"
        
    Returns:
        The result as a formatted string, or an error message
    
    Security note: We use a whitelist approach — only math operations allowed.
    NEVER use raw eval() on user input in production!
    """
    # Whitelist of safe characters and functions
    allowed_names = {
        "abs": abs, "round": round, "min": min, "max": max,
        "pow": pow, "sum": sum,
        # math module functions
        "sqrt": math.sqrt, "log": math.log, "log10": math.log10,
        "sin": math.sin, "cos": math.cos, "tan": math.tan,
        "pi": math.pi, "e": math.e, "ceil": math.ceil, "floor": math.floor
    }
    
    try:
        # Only allow safe characters
        import re
        if re.search(r'[^0-9\+\-\*\/\.\(\)\s\,a-zA-Z\_]', expression):
            return "Error: Invalid characters in expression"
        
        result = eval(expression, {"__builtins__": {}}, allowed_names)
        
        # Format nicely
        if isinstance(result, float) and result.is_integer():
            return f"{expression} = {int(result)}"
        elif isinstance(result, float):
            return f"{expression} = {result:.4f}"
        else:
            return f"{expression} = {result}"
            
    except ZeroDivisionError:
        return "Error: Division by zero"
    except Exception as e:
        return f"Error evaluating '{expression}': {str(e)}"


def get_current_date() -> str:
    """
    Returns the current date and time.
    Useful when the agent needs temporal context.
    """
    now = datetime.now()
    return f"Current date and time: {now.strftime('%A, %B %d, %Y at %H:%M:%S')}"


def summarize_findings(findings: str, format: str = "bullet") -> str:
    """
    Formats and structures research findings.
    In a real agent, this might call the LLM again for summarization.
    Here, we do lightweight formatting.
    
    Args:
        findings: Raw text to summarize/format
        format: "bullet" or "paragraph"
        
    Returns:
        Formatted findings string
    """
    if format == "bullet":
        # Split into sentences and bullet them
        sentences = [s.strip() for s in findings.replace('\n', ' ').split('.') if s.strip()]
        bulleted = "\n".join(f"  • {s}." for s in sentences[:5])  # max 5 bullets
        return f"📋 Structured Summary:\n{bulleted}"
    else:
        return f"📋 Summary:\n{findings[:500]}..."  # truncate for paragraph mode


# ─── Tool Registry ────────────────────────────────────────────────────────────
# This is how the agent controller knows which function to call.
# Key = tool name (must match schema names in tool_schemas.py)

TOOL_REGISTRY = {
    "search_web": search_web,
    "calculate": calculate,
    "get_current_date": get_current_date,
    "summarize_findings": summarize_findings,
}
```

> **Full-Stack Dev Tip 🔧:** Notice `TOOL_REGISTRY` — it's just a dictionary mapping names to functions. When the LLM says "call search_web", your code does `TOOL_REGISTRY["search_web"](**args)`. That's the entire "tool dispatch" mechanism. You've been doing this for years; you just didn't call it agentic orchestration.

---

## 4.5 Tool Schemas (`tool_schemas.py`)

The LLM needs to know what tools exist and how to call them. We define this using JSON Schema — the same format Anthropic and OpenAI both support.

```python
# tool_schemas.py
"""
Tool schema definitions in Anthropic's format.
These tell the LLM: "Here are your available tools, 
their parameters, and what they do."

For OpenAI: wrap each schema in {"type": "function", "function": {...}}
"""

TOOL_SCHEMAS = [
    {
        "name": "search_web",
        "description": (
            "Search the internet for information on a topic. "
            "Use this when you need current facts, recent events, "
            "or any information you're not certain about. "
            "Prefer specific queries over vague ones."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The specific search query. Be precise. Example: 'Claude 3.5 Sonnet context window size 2024'"
                }
            },
            "required": ["query"]
        }
    },
    {
        "name": "calculate",
        "description": (
            "Evaluate a mathematical expression. Use this for any numeric "
            "computation: arithmetic, percentages, unit conversion, statistics. "
            "Supports: +, -, *, /, **, sqrt(), log(), sin(), cos(), pi, e, round(), etc."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "A valid Python math expression. Example: '1500 * 0.08 * 12' or 'sqrt(144)'"
                }
            },
            "required": ["expression"]
        }
    },
    {
        "name": "get_current_date",
        "description": "Get the current date and time. Use when temporal context is needed.",
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "summarize_findings",
        "description": (
            "Format and structure collected research findings into a clean summary. "
            "Use this as a FINAL step to organize all gathered information before "
            "presenting the answer to the user."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "findings": {
                    "type": "string",
                    "description": "All the raw information you've gathered during research"
                },
                "format": {
                    "type": "string",
                    "enum": ["bullet", "paragraph"],
                    "description": "Output format: 'bullet' for bullet points, 'paragraph' for prose"
                }
            },
            "required": ["findings", "format"]
        }
    }
]
```

> **Instructor Note:** The `description` fields are *critical*. This is how you communicate intent to the LLM. A poor description = the LLM uses the wrong tool at the wrong time. Think of it as your function's docstring, but written for an LLM audience.

---

## 4.6 Configuration (`config.py`)

```python
# config.py
"""
Configuration and client initialization.
Centralizing this makes it easy to swap providers.
"""

import os
from dotenv import load_dotenv
import anthropic

load_dotenv()  # Load from .env file

# ── Anthropic Setup ────────────────────────────────────────────────
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise EnvironmentError(
        "ANTHROPIC_API_KEY not found. "
        "Create a .env file with: ANTHROPIC_API_KEY=your-key-here"
    )

# Initialize the Anthropic client (reuse this — it handles connection pooling)
anthropic_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# ── Model Config ───────────────────────────────────────────────────
MODEL = "claude-opus-4-6"          # Swap to "claude-haiku-4-5-20251001" for speed/cost
MAX_TOKENS = 4096                   # Max tokens per LLM response
MAX_ITERATIONS = 10                 # Safety: max tool calls before forcing a stop

# ── System Prompt ──────────────────────────────────────────────────
# This defines the agent's persona, capabilities, and behavior.
# Think of this as the agent's "instruction manual."
SYSTEM_PROMPT = """You are an expert Research Assistant with access to web search, 
calculation, and summarization tools.

Your job is to answer research questions thoroughly and accurately by:
1. Breaking down complex questions into sub-tasks
2. Using tools to gather real information (don't rely on your training data alone)
3. Verifying numbers with calculations when needed
4. Structuring your final answer clearly

IMPORTANT GUIDELINES:
- Always search for facts rather than making them up
- Use calculate() for any numeric operations — don't do math in your head
- After gathering enough information, use summarize_findings() to structure your answer
- Be transparent about what you found and what you're uncertain about
- Aim for completeness, but stop when you have enough to give a solid answer

You have a maximum of 10 tool calls per query. Use them wisely.
"""

# ──────────────────────────────────────────────────────────────────
# OpenAI EQUIVALENT (for reference):
#
# from openai import OpenAI
# openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# MODEL = "gpt-4o"
# ──────────────────────────────────────────────────────────────────
```

---

## 4.7 The Agent Core — The Beating Heart (`agent.py`)

This is where it all comes together. Read every comment carefully. This file is dense by design — I want you to understand *why* each line exists.

```python
# agent.py
"""
The ReAct Agent Controller.

This file implements the core reasoning loop that:
  1. Sends messages to the LLM
  2. Processes tool call requests from the LLM
  3. Executes tools and feeds results back
  4. Loops until the LLM produces a final answer (no tool calls)

Architecture:
  ┌──────────┐   messages[]   ┌──────────┐
  │  Python  │◄──────────────►│  Claude  │
  │  (you)   │                │   API    │
  └──────────┘                └──────────┘
       │                           │
       │  tool_use block           │
       │◄──────────────────────────┘
       │
       ▼
  TOOL_REGISTRY["tool_name"](**args)
       │
       ▼
  Append tool_result → messages[]
       │
       ▼
  Next API call (loop continues)
"""

import json
from config import (
    anthropic_client, MODEL, MAX_TOKENS, 
    MAX_ITERATIONS, SYSTEM_PROMPT
)
from tools import TOOL_REGISTRY
from tool_schemas import TOOL_SCHEMAS


# ─── Color formatting for terminal output ─────────────────────────
# Not required, but makes debugging MUCH more pleasant
class Colors:
    CYAN    = '\033[96m'
    GREEN   = '\033[92m'
    YELLOW  = '\033[93m'
    RED     = '\033[91m'
    BLUE    = '\033[94m'
    MAGENTA = '\033[95m'
    RESET   = '\033[0m'
    BOLD    = '\033[1m'

def print_header(title: str):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'─'*60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}  {title}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'─'*60}{Colors.RESET}")

def print_thought(text: str):
    print(f"\n{Colors.CYAN}🤔 THOUGHT:{Colors.RESET} {text}")

def print_action(tool_name: str, tool_input: dict):
    print(f"\n{Colors.YELLOW}⚡ ACTION:{Colors.RESET} {tool_name}({json.dumps(tool_input, indent=2)})")

def print_observation(result: str):
    print(f"\n{Colors.GREEN}👁  OBSERVATION:{Colors.RESET} {result[:200]}{'...' if len(result) > 200 else ''}")

def print_final(text: str):
    print(f"\n{Colors.MAGENTA}✅ FINAL ANSWER:{Colors.RESET}")
    print(f"{Colors.MAGENTA}{'─'*60}{Colors.RESET}")
    print(text)
    print(f"{Colors.MAGENTA}{'─'*60}{Colors.RESET}")


# ─── Tool Execution ────────────────────────────────────────────────

def execute_tool(tool_name: str, tool_input: dict) -> str:
    """
    Routes a tool call from the LLM to the appropriate Python function.
    
    Args:
        tool_name:  Name of the tool (must match TOOL_REGISTRY key)
        tool_input: Dict of arguments to pass to the tool function
        
    Returns:
        Tool result as a string (always string — LLMs speak strings)
    """
    if tool_name not in TOOL_REGISTRY:
        # Return error back to LLM — it can recover from this
        return f"Error: Unknown tool '{tool_name}'. Available tools: {list(TOOL_REGISTRY.keys())}"
    
    tool_fn = TOOL_REGISTRY[tool_name]
    
    try:
        result = tool_fn(**tool_input)
        return str(result)
    except TypeError as e:
        return f"Error: Wrong arguments for '{tool_name}': {str(e)}"
    except Exception as e:
        return f"Error executing '{tool_name}': {str(e)}"


# ─── Process API Response ──────────────────────────────────────────

def process_response(response) -> tuple[str | None, list[dict]]:
    """
    Parses the LLM's response and extracts:
      - The final text answer (if the LLM is done)
      - Any tool use requests (if the LLM wants to take actions)
    
    The Anthropic API returns content as a list of "blocks":
      - {"type": "text", "text": "..."} — the LLM's reasoning text
      - {"type": "tool_use", "name": "...", "input": {...}, "id": "..."} — tool call
    
    Args:
        response: The raw response object from the Anthropic API
        
    Returns:
        Tuple of:
          - final_answer: str if done, None if more work needed
          - tool_calls: list of {id, name, input} dicts
    """
    final_text_parts = []   # Collect text blocks
    tool_calls = []          # Collect tool use requests
    
    for block in response.content:
        if block.type == "text":
            # LLM wrote some reasoning text — capture it
            final_text_parts.append(block.text)
            print_thought(block.text[:300] + ("..." if len(block.text) > 300 else ""))
            
        elif block.type == "tool_use":
            # LLM wants to call a tool — extract the call details
            tool_calls.append({
                "id":    block.id,      # Unique ID for this tool call
                "name":  block.name,    # Tool name (e.g., "search_web")
                "input": block.input    # Arguments dict (e.g., {"query": "..."})
            })
            print_action(block.name, block.input)
    
    # Determine if we're done
    # stop_reason == "end_turn" means the LLM is finished (no more tool calls)
    # stop_reason == "tool_use" means the LLM wants us to run tools
    if response.stop_reason == "end_turn" and not tool_calls:
        # We're done! Return the final answer text.
        final_answer = "\n".join(final_text_parts)
        return final_answer, []
    
    return None, tool_calls  # Not done yet — tool calls to process


# ─── Build Tool Result Message ─────────────────────────────────────

def build_tool_result_message(tool_results: list[dict]) -> dict:
    """
    Packages tool execution results into the correct message format
    for the Anthropic API's next call.
    
    Anthropic requires tool results as a "user" role message containing
    a list of "tool_result" content blocks (one per tool called).
    
    Args:
        tool_results: List of {"tool_use_id": ..., "content": ...} dicts
        
    Returns:
        A properly formatted message dict to append to conversation history
    
    ┌─────────────────────────────────────────────────────────────┐
    │  MESSAGE FORMAT (Anthropic)                                 │
    │                                                             │
    │  {                                                          │
    │    "role": "user",                                          │
    │    "content": [                                             │
    │      {                                                      │
    │        "type": "tool_result",                               │
    │        "tool_use_id": "toolu_01XYZ...",  ← matches call ID │
    │        "content": "the tool output string"                  │
    │      }                                                      │
    │    ]                                                        │
    │  }                                                          │
    └─────────────────────────────────────────────────────────────┘
    """
    return {
        "role": "user",
        "content": [
            {
                "type": "tool_result",
                "tool_use_id": result["tool_use_id"],
                "content": result["content"]
            }
            for result in tool_results
        ]
    }


# ─── THE MAIN AGENT LOOP ───────────────────────────────────────────

def run_agent(user_query: str) -> str:
    """
    The core ReAct agent loop.
    
    This is the function you call to run the agent on a query.
    It manages the conversation history and drives the Think→Act→Observe cycle.
    
    Flow Diagram:
    
    run_agent(query)
         │
         ▼
    Initialize messages = [{"role": "user", "content": query}]
         │
         ▼
    ┌────────────────────────────────────────────┐
    │  LOOP (max MAX_ITERATIONS times)           │
    │                                            │
    │  1. Call LLM API with full history         │
    │  2. Parse response for text & tool calls   │
    │     ├── No tool calls? → DONE (return)     │
    │     └── Has tool calls? → execute them     │
    │  3. Run each tool → get results            │
    │  4. Append assistant msg + tool results    │
    │     to messages (preserve full history)    │
    │  5. Loop back to step 1                    │
    └────────────────────────────────────────────┘
    
    Args:
        user_query: The user's research question (string)
        
    Returns:
        The agent's final answer (string)
    """
    
    print_header(f"RESEARCH ASSISTANT AGENT")
    print(f"\n{Colors.BOLD}User Query:{Colors.RESET} {user_query}\n")
    
    # ── Initialize conversation history ───────────────────────────
    # This list grows as the agent works. Every message — user, assistant,
    # and tool results — gets appended here. The full history goes to the
    # API on every call so the LLM has full context.
    messages = [
        {
            "role": "user",
            "content": user_query  # The initial user query
        }
    ]
    
    # ── Main ReAct Loop ───────────────────────────────────────────
    for iteration in range(MAX_ITERATIONS):
        print(f"\n{Colors.BOLD}{'═'*20} ITERATION {iteration + 1} {'═'*20}{Colors.RESET}")
        
        # ── Step 1: Call the LLM ─────────────────────────────────
        # We send the FULL conversation history on every call.
        # The LLM has no memory — we supply all context each time.
        response = anthropic_client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,  # Agent persona and instructions
            tools=TOOL_SCHEMAS,    # Available tools (LLM reads these)
            messages=messages      # Full conversation history
        )
        
        # ── Step 2: Parse the Response ───────────────────────────
        final_answer, tool_calls = process_response(response)
        
        # ── Step 3: Check if We're Done ──────────────────────────
        if final_answer:
            # LLM produced final answer with no tool calls → we're done!
            print_final(final_answer)
            return final_answer
        
        # ── Step 4: Append Assistant's Message ───────────────────
        # CRITICAL: We must preserve the LLM's full response in history.
        # The tool_use blocks in the response MUST appear before the
        # corresponding tool_result blocks. Anthropic API enforces this order.
        messages.append({
            "role": "assistant",
            "content": response.content  # ← The raw content blocks (text + tool_use)
        })
        
        # ── Step 5: Execute All Tool Calls ───────────────────────
        tool_results = []
        
        for tool_call in tool_calls:
            tool_name  = tool_call["name"]
            tool_input = tool_call["input"]
            tool_id    = tool_call["id"]
            
            # Run the actual tool function
            result = execute_tool(tool_name, tool_input)
            
            print_observation(result)
            
            # Collect result with its matching tool_use_id
            tool_results.append({
                "tool_use_id": tool_id,  # Must match the ID from tool_call
                "content": result
            })
        
        # ── Step 6: Append Tool Results to History ───────────────
        # These become the "Observations" in the ReAct pattern.
        # Format them as a user-role message (Anthropic's requirement).
        messages.append(build_tool_result_message(tool_results))
        
        # ── Loop back to Step 1 ───────────────────────────────────
    
    # ── Safety: Max Iterations Reached ───────────────────────────
    # We've hit our limit without a final answer.
    # Force the LLM to stop and summarize what it has.
    print(f"\n{Colors.RED}⚠  Max iterations ({MAX_ITERATIONS}) reached. Forcing final answer...{Colors.RESET}")
    
    messages.append({
        "role": "user",
        "content": "You've reached the maximum number of tool calls. Please provide your best answer based on what you've gathered so far."
    })
    
    # One last API call to get a forced final answer
    final_response = anthropic_client.messages.create(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        system=SYSTEM_PROMPT,
        tools=TOOL_SCHEMAS,
        messages=messages
    )
    
    forced_answer = "\n".join(
        block.text for block in final_response.content 
        if block.type == "text"
    )
    print_final(forced_answer)
    return forced_answer
```

> **⚠️ Professor Warning:** The most common beginner mistake is forgetting to append the assistant's message (Step 4) before the tool results (Step 6). The Anthropic API requires: `assistant message with tool_use` → `user message with tool_result`. Break this order and you'll get a cryptic 400 error. I've seen this derail many a smart developer's first agentic loop.

---

## 4.8 Entry Point (`main.py`)

```python
# main.py
"""
Entry point for the Research Assistant Agent.
Run this file to interact with your agent.
"""

from agent import run_agent


def main():
    print("\n" + "="*60)
    print("  🔬 RESEARCH ASSISTANT AGENT — Powered by Claude")
    print("="*60)
    print("Type your research question, or 'quit' to exit.\n")
    
    # ── Example queries to try ─────────────────────────────────────
    example_queries = [
        "What is the ReAct pattern in AI and how much would it cost to run 1 million Claude API calls at current pricing?",
        "Explain what AI agents are and calculate how many 8-hour workdays are in a 52-week year",
        "What is Python used for and what year was it created? Also calculate 2024 - 1991.",
    ]
    
    print("💡 Example queries:")
    for i, q in enumerate(example_queries, 1):
        print(f"   {i}. {q}")
    print()
    
    while True:
        try:
            user_input = input("You: ").strip()
            
            if not user_input:
                continue
            if user_input.lower() in ('quit', 'exit', 'q'):
                print("\n👋 Goodbye! Keep building.\n")
                break
            
            # Run the agent!
            answer = run_agent(user_input)
            
            # The answer was already printed inside run_agent() with formatting,
            # but you could also use it programmatically here:
            # e.g., save to DB, send via API, etc.
            
            print("\n" + "─"*60 + "\n")
            
        except KeyboardInterrupt:
            print("\n\n👋 Interrupted. Goodbye!\n")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}\n")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    main()
```

---

## 4.9 Running It: A Live Trace

Here's what a real run looks like. Let's trace the query:

> *"What is the ReAct pattern in AI and how much would it cost to run 1 million Claude API calls at current pricing?"*

```
════════════════════════════════════════════════════════════════
  RESEARCH ASSISTANT AGENT
════════════════════════════════════════════════════════════════

User Query: What is the ReAct pattern in AI and how much would 
            it cost to run 1 million Claude API calls?

════════════ ITERATION 1 ════════════

🤔 THOUGHT: Let me break this into two tasks: first understand 
            the ReAct pattern, then get current Claude API pricing
            to calculate the cost.

⚡ ACTION: search_web({
  "query": "ReAct pattern AI reasoning acting"
})

👁  OBSERVATION: Search results for 'ReAct pattern AI reasoning 
                 acting': The ReAct (Reasoning + Acting) pattern, 
                 introduced in 2022 by Yao et al., enables LLMs...

════════════ ITERATION 2 ════════════

🤔 THOUGHT: Good. Now let me get current Claude API pricing.

⚡ ACTION: search_web({
  "query": "Claude API pricing cost per token 2024"
})

👁  OBSERVATION: As of 2024, LLM API costs vary: GPT-4o at ~$5/1M 
                 input tokens, Claude 3.5 Sonnet at ~$3/1M input...

════════════ ITERATION 3 ════════════

🤔 THOUGHT: I have the pricing. Now let me calculate the cost for 
            1 million calls. Assuming ~1000 tokens per call average.

⚡ ACTION: calculate({
  "expression": "1000000 * 1000 * (3 / 1000000)"
})

👁  OBSERVATION: 1000000 * 1000 * (3 / 1000000) = 3000.0000

════════════ ITERATION 4 ════════════

🤔 THOUGHT: I now have all the information needed. Let me 
            structure this into a clear answer.

⚡ ACTION: summarize_findings({
  "findings": "ReAct pattern: ... Pricing: $3/1M tokens ... 
               Cost calculation: $3,000 for 1M calls at 1K tokens each",
  "format": "bullet"
})

👁  OBSERVATION: 📋 Structured Summary:
                 • ReAct (Reasoning + Acting) is a 2022 pattern...
                 • It interleaves reasoning traces with action calls...

════════════ ITERATION 5 ════════════

🤔 THOUGHT: I have all the information needed.

✅ FINAL ANSWER:
────────────────────────────────────────────────────────────────
## ReAct Pattern in AI

The **ReAct (Reasoning + Acting)** pattern, introduced in 2022 by 
Yao et al. at Google/Princeton, enables LLMs to interleave natural 
language reasoning with tool use actions...

## Cost Estimate for 1M Claude API Calls

At current Claude 3.5 Sonnet pricing (~$3/1M input tokens):
- Assuming 1,000 tokens per call average
- 1,000,000 calls × 1,000 tokens = 1 billion tokens
- **Total cost: ~$3,000**
────────────────────────────────────────────────────────────────
```

**That's 5 iterations, 4 tool calls, 1 coherent answer.** The agent reasoned, searched, calculated, summarized, and responded — all autonomously.

---

## 4.10 For OpenAI Users: The Adapter

The pattern is identical. Here's the translation layer:

```python
# openai_adapter.py
# Drop-in replacement for the Anthropic API calls in agent.py

from openai import OpenAI
import os

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def call_llm_openai(messages: list, tools: list, system: str) -> object:
    """
    OpenAI equivalent of the Anthropic messages.create() call.
    
    Key differences:
      - System message goes in the messages list (not a separate param)
      - Tool schemas use {"type": "function", "function": {...}} wrapper
      - Tool calls live in response.choices[0].message.tool_calls
      - Tool results use role="tool" (not "user")
    """
    # Prepend system message
    openai_messages = [{"role": "system", "content": system}] + messages
    
    # Wrap tool schemas in OpenAI format
    openai_tools = [
        {
            "type": "function",
            "function": {
                "name": tool["name"],
                "description": tool["description"],
                "parameters": tool["input_schema"]  # Anthropic uses "input_schema"
                                                     # OpenAI uses "parameters"
            }
        }
        for tool in tools
    ]
    
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=openai_messages,
        tools=openai_tools,
        tool_choice="auto"  # Let the model decide when to use tools
    )
    
    return response.choices[0].message


def process_response_openai(message) -> tuple:
    """
    Parse OpenAI response — equivalent to process_response() in agent.py
    """
    tool_calls = []
    text = message.content or ""
    
    if message.tool_calls:
        for tc in message.tool_calls:
            import json
            tool_calls.append({
                "id":    tc.id,
                "name":  tc.function.name,
                "input": json.loads(tc.function.arguments)
            })
        return None, tool_calls  # Has tool calls → not done
    
    return text, []  # No tool calls → done


# Tool result format for OpenAI:
# {
#     "role": "tool",           ← NOT "user" like Anthropic
#     "tool_call_id": "call_XYZ",
#     "content": "result string"
# }
```

---

## 4.11 Key Design Patterns to Internalize

Let's zoom out. Here are the architectural patterns you just implemented:

### Pattern 1: Conversation as State

```
messages[] is your entire state machine.
There is no separate "agent state" object.
The history IS the state.

[user_msg] → [assistant_msg + tool_use] → [user_msg + tool_result]
   → [assistant_msg + tool_use] → [user_msg + tool_result]
   → [assistant_msg (final)]
```

### Pattern 2: Tools are Just Functions

```python
# The "magic" of tool calling is just:
TOOL_REGISTRY[tool_name](**tool_input)
#                ↑              ↑
#    LLM tells us this    LLM tells us these args

# That's it. There is no magic.
```

### Pattern 3: The LLM is Stateless

```
Every API call starts fresh.
YOU manage state (via messages[]).
The LLM is a stateless function:

f(messages, tools, system_prompt) → response

Nothing more.
```

### Pattern 4: Stop Conditions Matter

```
Always have:
  1. Natural stop: stop_reason == "end_turn" with no tool calls
  2. Safety stop: MAX_ITERATIONS counter
  3. Forced stop: inject "please wrap up" message

Without these, agents can loop infinitely.
(Ask me how I know. 😅)
```

---

## 4.12 Error Handling Additions

Production-grade agents need resilience. Here's what to add:

```python
# Add to agent.py — wrap your API call with retry logic

import time
import anthropic

def call_llm_with_retry(client, max_retries=3, **kwargs):
    """
    Wraps the Anthropic API call with exponential backoff.
    
    Handles:
      - RateLimitError: Too many requests → wait and retry
      - APIStatusError: Server errors → retry with backoff  
      - APIConnectionError: Network issues → retry
    """
    for attempt in range(max_retries):
        try:
            return client.messages.create(**kwargs)
            
        except anthropic.RateLimitError as e:
            wait_time = 2 ** attempt  # 1s, 2s, 4s
            print(f"⏳ Rate limited. Waiting {wait_time}s... (attempt {attempt+1}/{max_retries})")
            time.sleep(wait_time)
            if attempt == max_retries - 1:
                raise  # Give up after max retries
                
        except anthropic.APIStatusError as e:
            if e.status_code >= 500:  # Server errors are retryable
                wait_time = 2 ** attempt
                print(f"⚠️  Server error {e.status_code}. Retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise  # Client errors (4xx) are not retryable
                
        except anthropic.APIConnectionError:
            wait_time = 2 ** attempt
            print(f"🔌 Connection error. Retrying in {wait_time}s...")
            time.sleep(wait_time)
    
    raise RuntimeError(f"Failed after {max_retries} attempts")
```

---

## 4.13 Observability: Logging the Agent's Trace

In production, you'll want structured logs of every iteration:

```python
# Add to agent.py — log every iteration to JSON

import json
import time
from datetime import datetime

class AgentTracer:
    """
    Records the complete trace of an agent run.
    Useful for debugging, cost tracking, and auditing.
    """
    
    def __init__(self, query: str):
        self.trace = {
            "query": query,
            "started_at": datetime.now().isoformat(),
            "iterations": [],
            "total_input_tokens": 0,
            "total_output_tokens": 0,
            "tools_called": [],
        }
    
    def log_iteration(self, iteration: int, response, tool_calls: list, tool_results: list):
        """Log a single ReAct iteration."""
        self.trace["total_input_tokens"]  += response.usage.input_tokens
        self.trace["total_output_tokens"] += response.usage.output_tokens
        
        for tc in tool_calls:
            self.trace["tools_called"].append(tc["name"])
        
        self.trace["iterations"].append({
            "iteration": iteration,
            "stop_reason": response.stop_reason,
            "tool_calls": [{"name": tc["name"], "input": tc["input"]} for tc in tool_calls],
            "tool_results": tool_results,
            "tokens_used": {
                "input":  response.usage.input_tokens,
                "output": response.usage.output_tokens,
            }
        })
    
    def finalize(self, final_answer: str) -> dict:
        """Complete the trace with final results."""
        self.trace["final_answer"] = final_answer
        self.trace["completed_at"] = datetime.now().isoformat()
        self.trace["total_iterations"] = len(self.trace["iterations"])
        
        # Estimated cost (Claude Sonnet: ~$3/1M input, ~$15/1M output)
        input_cost  = (self.trace["total_input_tokens"]  / 1_000_000) * 3.0
        output_cost = (self.trace["total_output_tokens"] / 1_000_000) * 15.0
        self.trace["estimated_cost_usd"] = round(input_cost + output_cost, 6)
        
        return self.trace
    
    def save(self, filepath: str):
        """Save trace to JSON file."""
        with open(filepath, 'w') as f:
            json.dump(self.trace, f, indent=2, default=str)
        print(f"📊 Trace saved to {filepath}")
```

---

## 4.14 Full Project Checklist

Here's your production readiness checklist for this agent:

```
RESEARCH ASSISTANT AGENT — PRODUCTION CHECKLIST
════════════════════════════════════════════════

Core Functionality
  [✅] ReAct loop implemented (Think → Act → Observe)
  [✅] Tool registry with dispatch
  [✅] Conversation history management
  [✅] Stop conditions (natural + safety)

API Integration
  [✅] Anthropic SDK initialized
  [✅] Tool schemas defined (JSON Schema)
  [✅] Response parsing for text + tool_use blocks
  [✅] Tool result message formatting

Robustness
  [✅] Unknown tool error handling
  [✅] Tool execution try/catch
  [✅] Max iterations safety stop
  [✅] Retry logic with backoff (4.12)

Observability
  [✅] Color-coded terminal output
  [✅] Per-iteration logging
  [✅] Token usage tracking
  [✅] Cost estimation

Production Additions (Chapter 5 Preview)
  [ ] Async support for concurrent agents
  [ ] Persistent conversation memory
  [ ] Tool result caching
  [ ] Multi-agent orchestration
  [ ] Streaming responses
```

---

## 📝 Chapter 4 Quiz

Let's see if it all stuck. No open-book on these — I'll know. 😏

---

**Q1.** In the ReAct pattern, what are the three phases that repeat in a loop?

> a) Request → Response → Retry  
> b) Thought → Action → Observation  
> c) Plan → Execute → Validate  
> d) Prompt → Completion → Cache  

---

**Q2.** In the Anthropic API, when an LLM wants to use a tool, what `stop_reason` does it return?

> a) `"tool_call"`  
> b) `"function_call"`  
> c) `"tool_use"`  
> d) `"action_required"`  

---

**Q3.** Look at this code. What is wrong with it?

```python
# Iteration 1
response = client.messages.create(...)
messages.append({"role": "user", "content": tool_results})  # ← Bug?
messages.append({"role": "assistant", "content": response.content})
```

> a) The role should be "system", not "user"  
> b) The assistant message must be appended BEFORE tool results  
> c) Tool results should be a string, not a list  
> d) Nothing is wrong — this code is correct  

---

**Q4.** Why does the agent send the complete `messages[]` list on every API call?

> a) To reduce latency through message caching  
> b) Because the API requires all messages to be re-validated  
> c) Because LLMs are stateless — they have no memory between calls  
> d) To allow the model to correct previous responses  

---

**Q5.** In the `execute_tool()` function, why do we return error messages as strings rather than raising exceptions back to the agent loop?

> a) Python exceptions are slower than string returns  
> b) So the LLM can read the error and potentially recover or try a different approach  
> c) The Anthropic API doesn't support exception propagation  
> d) To avoid breaking the MAX_ITERATIONS counter  

---

**Q6.** (Code Challenge) You've added a new tool called `fetch_url`. Write the tool schema entry for it. It takes one required string argument `url` and an optional integer `timeout` (default 30 seconds).

```python
# Your answer here:
{
    "name": "fetch_url",
    "description": "...",
    "input_schema": {
        # fill this in
    }
}
```

---

**Q7.** What's the maximum risk of NOT implementing a `MAX_ITERATIONS` limit?

> a) The agent will become too accurate and over-research  
> b) Memory will eventually fill up and crash the process  
> c) The agent could loop indefinitely, running up unbounded API costs  
> d) The API will rate-limit you after 10 calls anyway  

---

**Q8.** (Architectural question) A colleague suggests: *"Instead of building your own agent loop, just use LangChain's AgentExecutor — it does all this automatically."* What's the most compelling argument FOR your custom implementation?

> a) LangChain is written in JavaScript, not Python  
> b) Custom implementations have lower token usage by default  
> c) You have full visibility and control over every step — easier to debug, extend, and optimize  
> d) LangChain doesn't support Anthropic's API  

---

### ✅ Quiz Answers

| Q | Answer | Explanation |
|---|--------|-------------|
| 1 | **b** | Thought → Action → Observation — the core ReAct cycle |
| 2 | **c** | `"tool_use"` — Anthropic's stop reason when tool calls are requested |
| 3 | **b** | The assistant message (with `tool_use` blocks) MUST precede tool results in the history |
| 4 | **c** | LLMs are stateless functions — we supply all context each call |
| 5 | **b** | The LLM can read the error string and self-correct on the next iteration |
| 6 | See below | |
| 7 | **c** | Unbounded loops = unbounded costs. Always add safety stops. |
| 8 | **c** | Transparency and control — you know exactly what's happening at each step |

**Q6 Answer:**
```python
{
    "name": "fetch_url",
    "description": "Fetches the content of a web page. Use for reading specific URLs.",
    "input_schema": {
        "type": "object",
        "properties": {
            "url": {
                "type": "string",
                "description": "The URL to fetch. Must start with http:// or https://"
            },
            "timeout": {
                "type": "integer",
                "description": "Request timeout in seconds (default: 30)",
                "default": 30
            }
        },
        "required": ["url"]  ← "timeout" is NOT in required — it's optional
    }
}
```

---

## 🔭 Chapter 5 Preview: "Memory, Multi-Agent Systems, and Production Hardening"

You've built a single-agent loop. Impressive! But real-world agents need more:

### What's Coming in Chapter 5

**5.1 — Memory Systems**
```
Episodic Memory:  What happened in past conversations?
Semantic Memory:  What does this user generally prefer?
Working Memory:   What's relevant right now?

We'll implement all three using a vector database (pgvector or Chroma).
```

**5.2 — Multi-Agent Orchestration**
```
Orchestrator Agent
    ├── Research Agent   ← finds information
    ├── Analyst Agent    ← evaluates information  
    └── Writer Agent     ← produces the final output

We'll build a "supervisor" pattern where one agent delegates to specialists.
```

**5.3 — Async Agents**
```python
# Running 10 research tasks in parallel:
import asyncio

async def run_agents_parallel(queries: list[str]) -> list[str]:
    tasks = [run_agent_async(q) for q in queries]
    return await asyncio.gather(*tasks)  ← All 10 run simultaneously
```

**5.4 — Production Hardening**
- Streaming responses (show results as they generate)
- Tool result caching (don't search the same thing twice)
- Cost budgets (kill switch when spend exceeds threshold)
- Eval harnesses (did the agent actually get the right answer?)

**5.5 — The Agent Evaluator**
```
Building a second LLM that grades your first LLM's work.
Yes, it's agents all the way down. Welcome to the future.
```

---

## 📌 Chapter Summary

Here's everything you built today in one mental model:

```
ReAct Agent = 
  System Prompt          (WHO the agent is)
  + Tool Schemas         (WHAT it can do)
  + Tool Functions       (HOW tools work)
  + messages[] list      (STATE of the conversation)
  + A while loop         (The CONTROL structure)
  + One API call         (THINKING happens here)
  
That's it. That's an AI agent.
```

You now understand:
- ✅ The ReAct loop (Thought → Action → Observation)
- ✅ How to define tools and their schemas
- ✅ How conversation history drives agent state
- ✅ How to parse and dispatch tool calls
- ✅ Safety stops and error handling
- ✅ Cost tracking and observability
- ✅ The OpenAI equivalent pattern

The code you wrote today is production-capable. It's not a toy. Ship it responsibly.

---

*"The best way to understand AI agents is to build one. The best way to trust one in production is to understand exactly how it works. You now have both."*

**— Chapter 4 Complete. See you in Chapter 5. 🚀**

---

> **Resources**
> - [Anthropic Tool Use Docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)  
> - [ReAct Paper (Yao et al., 2022)](https://arxiv.org/abs/2210.03629)  
> - [OpenAI Function Calling Docs](https://platform.openai.com/docs/guides/function-calling)  
> - Course repo: `github.com/your-course/ai-engineering` (Chapter 4 branch)