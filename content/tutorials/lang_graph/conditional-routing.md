# 🌿 Phase 4 — Conditional Routing
### "Building Smart AI That Decides Its Own Path"

> **Difficulty**: ⭐⭐ Intermediate | **Time**: ~75 minutes | **Prerequisites**: Phase 3 Complete

---

## 🎯 What You'll Learn

- ✅ Advanced conditional routing patterns
- ✅ Multi-way routing (3, 4, 5+ paths)
- ✅ Routing based on AI responses
- ✅ Fallback and error routing
- ✅ Dynamic routing with runtime decisions
- ✅ Build: Smart Customer Router, Content Pipeline

---

## 📖 Lesson 4.1 — Routing Patterns Deep Dive

### Pattern 1: Binary Routing (Pass/Fail)

The simplest: two possible outcomes.

```python
# ============================================================
# FILE: 02_routing/binary_routing.py
# PURPOSE: Simple pass/fail routing
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from typing import TypedDict, Annotated, List, Optional
import operator

llm = ChatOllama(model="llama3.2", temperature=0)

class ReviewState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    content: str
    decision: str          # "approved" or "rejected"
    reason: Optional[str]

def review_node(state: ReviewState) -> dict:
    """AI reviews content and makes a decision."""
    
    result = (
        ChatPromptTemplate.from_messages([
            ("system", """Review this content for a professional blog.
            Respond with EXACTLY:
            DECISION: APPROVED or REJECTED
            REASON: [one sentence reason]"""),
            ("human", "Content to review:\n{content}")
        ]) | llm | StrOutputParser()
    ).invoke({"content": state["content"]})
    
    # Parse decision
    decision = "rejected"
    reason = result
    
    for line in result.split('\n'):
        if "APPROVED" in line.upper():
            decision = "approved"
        elif "REJECTED" in line.upper():
            decision = "rejected"
        if line.startswith("REASON:"):
            reason = line.replace("REASON:", "").strip()
    
    print(f"  📋 Decision: {decision.upper()} | {reason[:80]}")
    return {"decision": decision, "reason": reason}

def approve_node(state: ReviewState) -> dict:
    """Handle approved content."""
    return {"messages": [AIMessage(content=f"✅ Content APPROVED and published!\nContent: {state['content'][:100]}")]}

def reject_node(state: ReviewState) -> dict:
    """Handle rejected content."""
    return {"messages": [AIMessage(content=f"❌ Content REJECTED.\nReason: {state['reason']}\nPlease revise and resubmit.")]}

# ---- Routing Function ----
def route_by_decision(state: ReviewState) -> str:
    """Route based on the review decision."""
    return state.get("decision", "rejected")

# ---- Build Graph ----
graph = StateGraph(ReviewState)
graph.add_node("review", review_node)
graph.add_node("approve", approve_node)
graph.add_node("reject", reject_node)

graph.set_entry_point("review")

graph.add_conditional_edges("review", route_by_decision, {
    "approved": "approve",
    "rejected": "reject"
})

graph.add_edge("approve", END)
graph.add_edge("reject", END)
app = graph.compile()

# Test
test_contents = [
    "The sky is blue and birds sing beautifully in spring mornings.",
    "BUY NOW!!! CHEAP PILLS!! CLICK HERE NOW!!! LIMITED TIME OFFER!!!",
]

for content in test_contents:
    print(f"\n📝 Content: {content[:60]}...")
    result = app.invoke({
        "messages": [],
        "content": content,
        "decision": "",
        "reason": None
    })
    print(result["messages"][-1].content)
```

---

### Pattern 2: Multi-Way Routing (4+ Paths)

```python
# ============================================================
# FILE: 02_routing/multiway_routing.py
# PURPOSE: Route to multiple specialized handlers
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from typing import TypedDict, Annotated, List
import operator

llm = ChatOllama(model="llama3.2", temperature=0)

class SupportState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    user_query: str
    category: str
    priority: str

# ---- Classifier Node (The Router Brain) ----
def classify_query(state: SupportState) -> dict:
    """Use AI to classify the query into a category."""
    
    result = (
        ChatPromptTemplate.from_messages([
            ("system", """Classify this customer query. Return ONLY one word:
billing → payment, invoice, refund, charges, subscription
technical → bug, error, crash, not working, broken
shipping → delivery, tracking, address, package, lost
account → login, password, access, profile, settings
general → greetings, hours, location, other"""),
            ("human", "{query}")
        ]) | llm | StrOutputParser()
    ).invoke({"query": state["user_query"]})
    
    # Extract just the category word
    category = result.strip().lower().split('\n')[0].split()[0]
    valid_categories = {"billing", "technical", "shipping", "account", "general"}
    
    if category not in valid_categories:
        category = "general"
    
    print(f"  🏷️  Classified as: {category.upper()}")
    return {"category": category}

# ---- Specialized Handler Nodes ----
def billing_handler(state: SupportState) -> dict:
    response = (ChatPromptTemplate.from_messages([
        ("system", "You are a billing specialist. Be clear about costs and refunds."),
        ("human", "{query}")
    ]) | llm | StrOutputParser()).invoke({"query": state["user_query"]})
    return {"messages": [AIMessage(content=f"💳 BILLING TEAM: {response}")]}

def tech_handler(state: SupportState) -> dict:
    response = (ChatPromptTemplate.from_messages([
        ("system", "You are a Level 2 tech support engineer. Give precise solutions."),
        ("human", "{query}")
    ]) | llm | StrOutputParser()).invoke({"query": state["user_query"]})
    return {"messages": [AIMessage(content=f"🔧 TECH SUPPORT: {response}")]}

def shipping_handler(state: SupportState) -> dict:
    response = (ChatPromptTemplate.from_messages([
        ("system", "You are a shipping specialist. Be proactive about solutions."),
        ("human", "{query}")
    ]) | llm | StrOutputParser()).invoke({"query": state["user_query"]})
    return {"messages": [AIMessage(content=f"📦 SHIPPING TEAM: {response}")]}

def account_handler(state: SupportState) -> dict:
    response = (ChatPromptTemplate.from_messages([
        ("system", "You are an account specialist. Help with login and access issues."),
        ("human", "{query}")
    ]) | llm | StrOutputParser()).invoke({"query": state["user_query"]})
    return {"messages": [AIMessage(content=f"👤 ACCOUNT TEAM: {response}")]}

def general_handler(state: SupportState) -> dict:
    response = (ChatPromptTemplate.from_messages([
        ("system", "You are a friendly general support agent."),
        ("human", "{query}")
    ]) | llm | StrOutputParser()).invoke({"query": state["user_query"]})
    return {"messages": [AIMessage(content=f"💬 SUPPORT: {response}")]}

# ---- Build Graph ----
graph = StateGraph(SupportState)

graph.add_node("classify", classify_query)
for name, fn in [("billing", billing_handler), ("technical", tech_handler),
                  ("shipping", shipping_handler), ("account", account_handler),
                  ("general", general_handler)]:
    graph.add_node(name, fn)

graph.set_entry_point("classify")

# Multi-way conditional routing
graph.add_conditional_edges(
    "classify",
    lambda state: state["category"],  # Lambda routing function
    {
        "billing": "billing",
        "technical": "technical",
        "shipping": "shipping",
        "account": "account",
        "general": "general",
    }
)

for handler in ["billing", "technical", "shipping", "account", "general"]:
    graph.add_edge(handler, END)

app = graph.compile()

# Test all routes
test_queries = [
    "I was charged twice for my subscription this month",
    "My app crashes when I try to upload images",
    "My package hasn't arrived after 2 weeks",
    "I forgot my password and can't login",
    "What are your business hours?",
]

print("🎧 Smart Customer Support Router\n")
for query in test_queries:
    print(f"❓ Query: {query}")
    result = app.invoke({
        "messages": [HumanMessage(content=query)],
        "user_query": query,
        "category": "",
        "priority": "normal"
    })
    print(f"   {result['messages'][-1].content[:150]}\n")
```

---

### Pattern 3: AI-Powered Dynamic Routing

```python
# ============================================================
# FILE: 02_routing/ai_powered_routing.py
# PURPOSE: Let AI itself decide the routing with structured output
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from pydantic import BaseModel, Field
from typing import TypedDict, Annotated, List, Literal
import operator

llm = ChatOllama(model="llama3.2", temperature=0)

# ---- Structured routing decision ----
class RoutingDecision(BaseModel):
    """AI decides where to route and WHY."""
    route: Literal["research", "calculate", "explain", "creative"] = Field(
        description="Which specialized agent should handle this"
    )
    confidence: int = Field(description="Confidence 0-100", ge=0, le=100)
    reasoning: str = Field(description="Why this route was chosen")

class SmartState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    query: str
    route: str
    routing_confidence: int
    routing_reason: str

# ---- AI Router ----
def ai_router(state: SmartState) -> dict:
    """AI decides the best route with full reasoning."""
    
    structured_llm = llm.with_structured_output(RoutingDecision)
    
    decision = structured_llm.invoke(
        f"""Analyze this query and decide which agent should handle it:
        
Query: {state["query"]}

Routes:
- research: needs web search, fact-finding, current events
- calculate: needs math, statistics, data analysis  
- explain: needs concept explanation, teaching, definitions
- creative: needs writing, brainstorming, storytelling"""
    )
    
    print(f"  🧭 Route: {decision.route} | Confidence: {decision.confidence}% | {decision.reasoning[:60]}")
    
    return {
        "route": decision.route,
        "routing_confidence": decision.confidence,
        "routing_reason": decision.reasoning
    }

def research_agent(state): 
    return {"messages": [AIMessage(content=f"🔍 RESEARCH: Investigating '{state['query']}' with web search...")]}

def calculate_agent(state): 
    return {"messages": [AIMessage(content=f"🧮 CALCULATOR: Processing math for '{state['query']}'...")]}

def explain_agent(state): 
    return {"messages": [AIMessage(content=f"📚 EXPLAINER: Breaking down '{state['query']}' step by step...")]}

def creative_agent(state): 
    return {"messages": [AIMessage(content=f"🎨 CREATIVE: Crafting creative content for '{state['query']}'...")]}

graph = StateGraph(SmartState)
graph.add_node("router", ai_router)
for name, fn in [("research", research_agent), ("calculate", calculate_agent),
                  ("explain", explain_agent), ("creative", creative_agent)]:
    graph.add_node(name, fn)

graph.set_entry_point("router")
graph.add_conditional_edges("router", lambda s: s["route"], {
    "research": "research", "calculate": "calculate",
    "explain": "explain", "creative": "creative"
})
for n in ["research", "calculate", "explain", "creative"]:
    graph.add_edge(n, END)

app = graph.compile()

test_queries = [
    "What is quantum entanglement?",
    "Calculate compound interest on $5000 at 8% for 10 years",
    "Latest AI news from this week",
    "Write a haiku about neural networks",
]

print("🧭 AI-Powered Smart Router\n")
for q in test_queries:
    print(f"❓ {q}")
    result = app.invoke({"messages": [], "query": q, "route": "", "routing_confidence": 0, "routing_reason": ""})
    print(f"   {result['messages'][-1].content[:120]}\n")
```

---

### Pattern 4: Fallback and Error Routing

```python
# ============================================================
# FILE: 02_routing/error_routing.py
# PURPOSE: Handle errors gracefully with fallback routes
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List, Optional
import operator, time

llm = ChatOllama(model="llama3.2")

class RobustState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    query: str
    attempts: int
    error: Optional[str]
    result: Optional[str]

def primary_node(state: RobustState) -> dict:
    """Primary processing. May fail."""
    try:
        # Simulate occasional failures
        if state["attempts"] == 0 and "force_error" in state["query"]:
            raise ValueError("Simulated primary failure")
        
        response = llm.invoke(state["messages"] + [HumanMessage(content=state["query"])])
        return {"result": response.content, "error": None, "attempts": state["attempts"] + 1}
    except Exception as e:
        print(f"  ❌ Primary failed: {e}")
        return {"error": str(e), "result": None, "attempts": state["attempts"] + 1}

def fallback_node(state: RobustState) -> dict:
    """Simpler fallback when primary fails."""
    print(f"  🔄 Using fallback (attempt {state['attempts'] + 1})...")
    try:
        # Simpler, more reliable approach
        response = llm.invoke([HumanMessage(content=f"Please help with: {state['query']}")])
        return {"result": response.content, "error": None, "attempts": state["attempts"] + 1}
    except Exception as e:
        return {"error": str(e), "result": None, "attempts": state["attempts"] + 1}

def error_handler(state: RobustState) -> dict:
    """Last resort error response."""
    return {"messages": [AIMessage(content=f"I'm having trouble processing your request after {state['attempts']} attempts. Please try again or contact support.")]}

def success_node(state: RobustState) -> dict:
    return {"messages": [AIMessage(content=state["result"])]}

# ---- Routing ----
def route_after_primary(state: RobustState) -> str:
    if state.get("result"):
        return "success"
    elif state.get("attempts", 0) < 2:
        return "fallback"
    else:
        return "error"

def route_after_fallback(state: RobustState) -> str:
    return "success" if state.get("result") else "error"

graph = StateGraph(RobustState)
for name, fn in [("primary", primary_node), ("fallback", fallback_node),
                  ("error_handler", error_handler), ("success", success_node)]:
    graph.add_node(name, fn)

graph.set_entry_point("primary")
graph.add_conditional_edges("primary", route_after_primary, {
    "success": "success", "fallback": "fallback", "error": "error_handler"
})
graph.add_conditional_edges("fallback", route_after_fallback, {
    "success": "success", "error": "error_handler"
})
graph.add_edge("success", END)
graph.add_edge("error_handler", END)

app = graph.compile()

# Test normal and error paths
result = app.invoke({"messages": [], "query": "What is Python?", "attempts": 0, "error": None, "result": None})
print("Normal:", result["messages"][-1].content[:100])

result = app.invoke({"messages": [], "query": "force_error test query", "attempts": 0, "error": None, "result": None})
print("\nError path:", result["messages"][-1].content[:100])
```

---

## ⚠️ Common Routing Mistakes

### Mistake 1: Missing Routes in the Map

```python
# ❌ AI might return "urgent" but it's not in the map!
def classify(state):
    return "urgent"  # Returns "urgent"

graph.add_conditional_edges("node", classify, {
    "normal": "normal_handler",
    # "urgent" is missing → KeyError crash!
})

# ✅ Always handle every possible return value
graph.add_conditional_edges("node", classify, {
    "normal": "normal_handler",
    "urgent": "urgent_handler",
    # Add default fallback:
})
# Or use a function with guaranteed outputs
def safe_classify(state):
    result = ai_classify(state)
    return result if result in {"normal", "urgent"} else "normal"  # Default
```

### Mistake 2: No Default Fallback

```python
# ✅ Always add a fallback for unexpected values
def route(state):
    category = state.get("category", "")
    valid = {"billing", "technical", "shipping"}
    return category if category in valid else "general"  # Safe default
```

---

## 🎯 Mini Challenges

**Challenge 1**: Build a "News Classifier Router" — classifies articles as: politics, technology, sports, business, entertainment. Route each to a specialized summarizer node.

**Challenge 2**: Create a "Medical Symptom Triage" router (educational only): routes symptoms to: emergency (critical symptoms), doctor (needs appointment), pharmacy (OTC treatment), or home_care (rest and fluids).

**Challenge 3**: Build a "Language Detector Router" — detects if input is in English, Spanish, French, or Other — and routes to a handler that responds in that language.

---

## ✅ Phase 4 Recap

| Pattern | When To Use |
|---------|------------|
| Binary routing | Pass/fail, yes/no decisions |
| Multi-way routing | 3+ specialized handlers |
| AI-powered routing | Complex classification needed |
| Fallback routing | Production reliability |
| Lambda routing | Simple state field checks |
| Safe routing | Always have a default return value |

---

## 🚀 What's Next?

**Phase 5** — Agent Loops & Tool Use: combining LangGraph with LangChain tools to build true autonomous agents that think-act-observe in a loop.

> **Go to**: `Phase05_Agents_Tools/lesson.md` →

---

*Phase 4 Complete! 🌿 You can route AI workflows like a pro. Time for agents!*
