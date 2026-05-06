# 🏗️ Phase 9 — Advanced State Patterns
### "Designing State Like a Senior AI Engineer"

> **Difficulty**: ⭐⭐⭐⭐ Advanced | **Time**: ~90 minutes | **Prerequisites**: Phase 8 Complete

---

## 🎯 What You'll Learn

- ✅ Advanced state design patterns
- ✅ Subgraphs (graphs within graphs)
- ✅ Input/Output schemas
- ✅ Custom reducers
- ✅ State channels and private state
- ✅ State versioning and migration
- ✅ Build: Enterprise workflow with nested subgraphs

---

## 📖 Lesson 9.1 — Advanced State Design

### Pattern 1: Strict Input/Output Schema

LangGraph lets you define different schemas for what goes IN vs what comes OUT:

```python
# ============================================================
# FILE: 07_advanced_state/input_output_schema.py
# PURPOSE: Control what enters and exits your graph
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List, Optional
import operator

llm = ChatOllama(model="llama3.2", temperature=0.3)

# ---- Full internal state (everything the graph tracks) ----
class InternalState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    user_query: str
    classification: str       # Internal only
    confidence: int           # Internal only
    processing_steps: List[str]  # Internal log
    result: Optional[str]
    error: Optional[str]

# ---- Input schema: what the CALLER must provide ----
class GraphInput(TypedDict):
    user_query: str            # Required
    # Everything else is optional/internal

# ---- Output schema: what the CALLER gets back ----
class GraphOutput(TypedDict):
    result: Optional[str]      # The answer
    error: Optional[str]       # Any error
    # Internal details are hidden from caller!

# ---- Nodes ----
def initialize(state: InternalState) -> dict:
    return {
        "messages": [HumanMessage(content=state["user_query"])],
        "classification": "unknown",
        "confidence": 0,
        "processing_steps": ["initialized"],
        "result": None,
        "error": None
    }

def classify(state: InternalState) -> dict:
    from langchain_core.output_parsers import StrOutputParser
    from langchain_core.prompts import ChatPromptTemplate
    
    result = (
        ChatPromptTemplate.from_messages([
            ("system", "Classify query. One word: question / request / complaint / other"),
            ("human", "{query}")
        ]) | llm | StrOutputParser()
    ).invoke({"query": state["user_query"]})
    
    category = result.strip().lower().split('\n')[0].split()[0]
    if category not in {"question", "request", "complaint", "other"}:
        category = "other"
    
    steps = state.get("processing_steps", []) + [f"classified as {category}"]
    return {"classification": category, "confidence": 80, "processing_steps": steps}

def process(state: InternalState) -> dict:
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser
    
    response = (
        ChatPromptTemplate.from_messages([
            ("system", f"You handle {state['classification']} queries. Be helpful and concise."),
            ("human", "{query}")
        ]) | llm | StrOutputParser()
    ).invoke({"query": state["user_query"]})
    
    steps = state.get("processing_steps", []) + ["processed"]
    return {"result": response, "processing_steps": steps}

# ---- Build graph with schemas ----
graph = StateGraph(
    InternalState,
    input=GraphInput,    # Validates input
    output=GraphOutput   # Filters output
)

graph.add_node("init", initialize)
graph.add_node("classify", classify)
graph.add_node("process", process)

graph.set_entry_point("init")
graph.add_edge("init", "classify")
graph.add_edge("classify", "process")
graph.add_edge("process", END)

app = graph.compile()

# ---- Test ----
# Caller only provides what GraphInput requires
result = app.invoke({"user_query": "What are the business hours?"})

# Caller only sees GraphOutput fields
print("📤 API Response:")
print(f"   Result: {result.get('result', 'N/A')[:150]}")
print(f"   Error: {result.get('error', None)}")
print(f"   (Internal fields like 'classification' are hidden from caller)")
```

---

### Pattern 2: Custom Reducers

```python
# ============================================================
# FILE: 07_advanced_state/custom_reducers.py
# PURPOSE: Custom state merge logic
# ============================================================

from typing import TypedDict, Annotated, List, Optional
import operator
from datetime import datetime

# ---- Custom reducer functions ----

def append_with_limit(max_items: int = 10):
    """Factory: creates a reducer that keeps only last N items."""
    def reducer(existing: list, new: list) -> list:
        combined = (existing or []) + (new or [])
        return combined[-max_items:]
    return reducer

def merge_dicts(existing: dict, new: dict) -> dict:
    """Merge dictionaries (new values overwrite existing for same keys)."""
    merged = {**(existing or {}), **(new or {})}
    return merged

def keep_max(existing: Optional[int], new: Optional[int]) -> Optional[int]:
    """Keep the maximum value."""
    if existing is None:
        return new
    if new is None:
        return existing
    return max(existing, new)

def timestamped_log(existing: list, new: list) -> list:
    """Add timestamps to log entries."""
    timestamped = [{"time": datetime.now().isoformat(), "entry": e} for e in (new or [])]
    return (existing or []) + timestamped

# ---- State using custom reducers ----
class AdvancedState(TypedDict):
    # Keep only last 5 messages
    messages: Annotated[list, append_with_limit(5)]
    
    # Merge config dicts (don't replace entirely)
    config: Annotated[dict, merge_dicts]
    
    # Track highest score seen
    peak_score: Annotated[Optional[int], keep_max]
    
    # Timestamped audit log
    audit_log: Annotated[list, timestamped_log]

# ---- Test reducers ----
from langgraph.graph import StateGraph, END

def node_a(state: AdvancedState) -> dict:
    return {
        "messages": ["Message from A"],
        "config": {"model": "llama3.2", "temp": 0.7},
        "peak_score": 45,
        "audit_log": ["Node A executed"]
    }

def node_b(state: AdvancedState) -> dict:
    return {
        "messages": ["Message from B"],
        "config": {"max_tokens": 500},  # Only updates this key, not the whole dict
        "peak_score": 82,               # This is higher, so it wins
        "audit_log": ["Node B executed"]
    }

def node_c(state: AdvancedState) -> dict:
    return {
        "messages": ["Message from C"],
        "config": {"temp": 0.3},        # Overrides temp but keeps model and max_tokens
        "peak_score": 61,               # Lower than 82, so 82 stays
        "audit_log": ["Node C executed"]
    }

graph = StateGraph(AdvancedState)
for name, fn in [("a", node_a), ("b", node_b), ("c", node_c)]:
    graph.add_node(name, fn)

graph.set_entry_point("a")
graph.add_edge("a", "b")
graph.add_edge("b", "c")
graph.add_edge("c", END)

app = graph.compile()

result = app.invoke({
    "messages": [],
    "config": {},
    "peak_score": None,
    "audit_log": []
})

print("📊 Advanced State Results:")
print(f"  Messages: {result['messages']}")  # Only last 5
print(f"  Config: {result['config']}")       # Merged dict
print(f"  Peak Score: {result['peak_score']}")  # Highest (82)
print(f"  Audit Log: {[e['entry'] for e in result['audit_log']]}")
```

---

## 📖 Lesson 9.2 — Subgraphs (Graphs Within Graphs)

Subgraphs let you build modular, reusable workflows:

```python
# ============================================================
# FILE: 07_advanced_state/subgraphs.py
# PURPOSE: Composing graphs from smaller graphs
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from typing import TypedDict, Annotated, List, Optional
import operator

llm = ChatOllama(model="llama3.2", temperature=0.3)
parser = StrOutputParser()

# ============================================================
# SUBGRAPH 1: Content Generation (reusable module)
# ============================================================
class ContentState(TypedDict):
    topic: str
    draft: Optional[str]
    revised: Optional[str]

def draft_content(state: ContentState) -> dict:
    draft = (
        ChatPromptTemplate.from_messages([
            ("system", "You are a content writer. Write clearly."),
            ("human", "Write 2 paragraphs about: {topic}")
        ]) | llm | parser
    ).invoke({"topic": state["topic"]})
    return {"draft": draft}

def revise_content(state: ContentState) -> dict:
    revised = (
        ChatPromptTemplate.from_messages([
            ("system", "Improve this text: make it more engaging and professional."),
            ("human", "{draft}")
        ]) | llm | parser
    ).invoke({"draft": state["draft"]})
    return {"revised": revised}

# Build content subgraph
content_graph = StateGraph(ContentState)
content_graph.add_node("draft", draft_content)
content_graph.add_node("revise", revise_content)
content_graph.set_entry_point("draft")
content_graph.add_edge("draft", "revise")
content_graph.add_edge("revise", END)
content_subgraph = content_graph.compile()

# ============================================================
# SUBGRAPH 2: SEO Optimizer (reusable module)
# ============================================================
class SEOState(TypedDict):
    content: str
    keywords: Optional[str]
    seo_score: Optional[int]
    seo_suggestions: Optional[str]

def extract_keywords(state: SEOState) -> dict:
    keywords = (
        ChatPromptTemplate.from_messages([
            ("system", "Extract 5-7 SEO keywords. Return comma-separated list only."),
            ("human", "{content}")
        ]) | llm | parser
    ).invoke({"content": state["content"]})
    return {"keywords": keywords}

def score_seo(state: SEOState) -> dict:
    result = (
        ChatPromptTemplate.from_messages([
            ("system", "Rate SEO quality 0-100 and give 2 improvement suggestions."),
            ("human", "Content: {content}\nKeywords: {keywords}")
        ]) | llm | parser
    ).invoke({"content": state["content"][:300], "keywords": state.get("keywords", "")})
    
    score = 70
    for word in result.split():
        if word.isdigit() and 0 <= int(word) <= 100:
            score = int(word)
            break
    
    return {"seo_score": score, "seo_suggestions": result}

seo_graph = StateGraph(SEOState)
seo_graph.add_node("keywords", extract_keywords)
seo_graph.add_node("score", score_seo)
seo_graph.set_entry_point("keywords")
seo_graph.add_edge("keywords", "score")
seo_graph.add_edge("score", END)
seo_subgraph = seo_graph.compile()

# ============================================================
# MAIN GRAPH: Composes both subgraphs
# ============================================================
class MainState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    topic: str
    # Content subgraph fields
    draft: Optional[str]
    revised: Optional[str]
    # SEO subgraph fields
    keywords: Optional[str]
    seo_score: Optional[int]
    seo_suggestions: Optional[str]
    # Main fields
    final_report: Optional[str]

def run_content_module(state: MainState) -> dict:
    """Invoke the content subgraph."""
    print("  📝 Running content module...")
    result = content_subgraph.invoke({
        "topic": state["topic"],
        "draft": None,
        "revised": None
    })
    return {"draft": result["draft"], "revised": result["revised"]}

def run_seo_module(state: MainState) -> dict:
    """Invoke the SEO subgraph."""
    print("  🔍 Running SEO module...")
    result = seo_subgraph.invoke({
        "content": state.get("revised", state.get("draft", "")),
        "keywords": None,
        "seo_score": None,
        "seo_suggestions": None
    })
    return {
        "keywords": result["keywords"],
        "seo_score": result["seo_score"],
        "seo_suggestions": result["seo_suggestions"]
    }

def compile_report(state: MainState) -> dict:
    """Combine everything into final report."""
    report = f"""# Content Report: {state['topic']}

## Content
{state.get('revised', 'N/A')}

## SEO Analysis
Score: {state.get('seo_score', 0)}/100
Keywords: {state.get('keywords', 'N/A')}
Suggestions: {state.get('seo_suggestions', 'N/A')[:200]}
"""
    print(f"  📊 SEO Score: {state.get('seo_score', 0)}/100")
    return {"final_report": report, "messages": [AIMessage(content="Report compiled!")]}

main_graph = StateGraph(MainState)
main_graph.add_node("content_module", run_content_module)
main_graph.add_node("seo_module", run_seo_module)
main_graph.add_node("compile", compile_report)

main_graph.set_entry_point("content_module")
main_graph.add_edge("content_module", "seo_module")
main_graph.add_edge("seo_module", "compile")
main_graph.add_edge("compile", END)

main_app = main_graph.compile()

print("🏗️ Subgraph Composition Demo\n")
result = main_app.invoke({
    "messages": [],
    "topic": "Benefits of remote work for tech companies",
    "draft": None, "revised": None,
    "keywords": None, "seo_score": None, "seo_suggestions": None,
    "final_report": None
})

print("\n📄 FINAL REPORT:")
print(result["final_report"][:600])
```

---

## 📖 Lesson 9.3 — State Channels (Private State)

```python
# ============================================================
# FILE: 07_advanced_state/state_channels.py
# PURPOSE: Public vs private state in multi-agent graphs
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List, Optional
import operator

llm = ChatOllama(model="llama3.2", temperature=0.3)

# ---- Public State: shared between all nodes and visible to caller ----
class PublicState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    task: str
    final_result: Optional[str]

# ---- Private State: internal tracking, extends public state ----
class PrivateState(PublicState):
    # These are internal — not shown in output if using input/output schemas
    _internal_score: int
    _retry_count: int
    _debug_log: List[str]
    _raw_llm_output: str

# In practice: use TypedDict with all needed fields,
# and use input/output schema to control what caller sees

class FullState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    task: str
    # Public
    final_result: Optional[str]
    status: str
    # Private/Internal (hidden from output schema)
    internal_score: int
    retry_count: int
    raw_outputs: Annotated[List[str], operator.add]

class OutputSchema(TypedDict):
    """Only these fields are returned to the caller."""
    final_result: Optional[str]
    status: str
    messages: Annotated[List[BaseMessage], operator.add]

def processor(state: FullState) -> dict:
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser
    
    raw = (
        ChatPromptTemplate.from_messages([("human", "{task}")]) 
        | llm | StrOutputParser()
    ).invoke({"task": state["task"]})
    
    score = min(100, max(0, len(raw.split()) * 2))  # Mock score
    
    return {
        "raw_outputs": [raw],     # Internal
        "internal_score": score,  # Internal
        "final_result": raw,
        "status": "complete"
    }

graph = StateGraph(FullState, output=OutputSchema)
graph.add_node("process", processor)
graph.set_entry_point("process")
graph.add_edge("process", END)
app = graph.compile()

result = app.invoke({
    "messages": [], "task": "Explain what an API is",
    "final_result": None, "status": "pending",
    "internal_score": 0, "retry_count": 0, "raw_outputs": []
})

print("📤 Caller sees (OutputSchema only):")
print(f"   Keys: {list(result.keys())}")  # Only output schema keys
print(f"   Status: {result['status']}")
print(f"   Result: {result.get('final_result', '')[:100]}")
print("   (internal_score, retry_count, raw_outputs are hidden)")
```

---

## 🎯 Mini Challenges

**Challenge 1**: Design a state for an "E-commerce Order Processing System" — include public fields (customer sees) and private fields (internal workflow only). Write the TypedDict.

**Challenge 2**: Build two reusable subgraphs: a "Translation Subgraph" (translates to Spanish) and a "Summary Subgraph" (condenses to 3 sentences). Compose them into a main graph.

**Challenge 3**: Create a custom reducer that implements a priority queue — items with "high" priority go to the front, "low" to the back.

---

## ✅ Phase 9 Recap

| Pattern | Purpose |
|---------|---------|
| Input/Output schemas | Control API surface |
| Custom reducers | Custom merge logic |
| Subgraphs | Modular, reusable workflows |
| Private state | Internal tracking, hidden from callers |
| State channels | Per-agent isolated state |

---

## 🚀 What's Next?

**Phase 10** — LangGraph + RAG: combining everything you've learned to build advanced RAG systems with stateful retrieval, multi-step reasoning, and agentic document processing.

> **Go to**: `Phase10_RAG/lesson.md` →

---

*Phase 9 Complete! 🏗️ You design state like a senior engineer. Almost at expert level!*
