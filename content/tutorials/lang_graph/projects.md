# 🏭 Phase 11 — Real Industry Projects
### "8 Complete Production Applications"

> **Difficulty**: ⭐⭐⭐⭐⭐ Expert | **Time**: Self-paced | **Prerequisites**: All Previous Phases

---

## 🎯 Overview

This is your capstone phase. Build 8 real-world LangGraph applications ready for your portfolio.

| # | Project | Core Patterns | Difficulty |
|---|---------|--------------|-----------|
| 1 | Smart Customer Support System | HITL + RAG + Memory | ⭐⭐⭐ |
| 2 | Content Creation Pipeline | Supervisor + Multi-agent | ⭐⭐⭐ |
| 3 | Code Review & Debug Agent | Agent loop + Tools | ⭐⭐⭐⭐ |
| 4 | Research Synthesis Bot | Multi-hop RAG + Corrective | ⭐⭐⭐⭐ |
| 5 | Financial Compliance Checker | HITL + Routing + Audit | ⭐⭐⭐⭐ |
| 6 | AI Hiring Pipeline | Multi-agent + Subgraphs | ⭐⭐⭐⭐ |
| 7 | Self-Healing Data Pipeline | Error routing + Retry | ⭐⭐⭐⭐⭐ |
| 8 | Enterprise AI Orchestrator | Full LangGraph mastery | ⭐⭐⭐⭐⭐ |

---

## 🏗️ Project 1: Smart Customer Support System

### Architecture

```
Customer Message
      ↓
[Classify Urgency & Category]
      ↓
  Urgent?
  ├── YES → [HITL: Escalate to Human] → [Human responds]
  └── NO  → [RAG: Search Knowledge Base]
                  ↓
            Answer found?
            ├── YES → [Generate Response] → Send
            └── NO  → [Escalate to Tier-2 Bot]
                           ↓
                      [Create Ticket + Notify]
```

```python
# ============================================================
# FILE: projects/project_01_customer_support/workflow.py
# ============================================================

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.tools import tool
from langchain_core.documents import Document
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import TypedDict, Annotated, List, Optional, Literal
import operator, json, os
from datetime import datetime

llm = ChatOllama(model="llama3.2", temperature=0.3)
parser = StrOutputParser()

# ---- Knowledge Base ----
kb_docs = [
    Document(page_content="Refund Policy: 30-day money back guarantee. Email billing@company.com. Processed within 5-7 business days.", metadata={"source": "policies"}),
    Document(page_content="Pricing: Starter $29/mo (5 users), Professional $99/mo (25 users), Enterprise custom.", metadata={"source": "pricing"}),
    Document(page_content="Technical Support: Email support@company.com. Live chat Mon-Fri 9am-6pm EST. Phone for Enterprise only.", metadata={"source": "support"}),
    Document(page_content="Password reset: Go to login page → Forgot Password → Enter email → Check inbox for reset link.", metadata={"source": "faq"}),
    Document(page_content="Integrations: Slack, Teams, Salesforce, HubSpot, Zapier, and 200+ apps. API at docs.company.com.", metadata={"source": "integrations"}),
]
embeddings = OllamaEmbeddings(model="nomic-embed-text")
kb = Chroma.from_documents(kb_docs, embeddings)
retriever = kb.as_retriever(search_kwargs={"k": 3})

# ---- Classification Schema ----
class QueryClassification(BaseModel):
    category: Literal["billing", "technical", "shipping", "account", "general"]
    urgency: Literal["low", "medium", "high", "critical"]
    sentiment: Literal["positive", "neutral", "negative", "angry"]
    requires_escalation: bool

# ---- Tools ----
@tool
def search_knowledge_base(query: str) -> str:
    """Search the company knowledge base for answers."""
    docs = retriever.invoke(query)
    if not docs:
        return "No information found in knowledge base."
    return "\n\n".join(f"[{d.metadata['source']}]: {d.page_content}" for d in docs)

@tool
def create_support_ticket(
    customer_id: str,
    category: str,
    issue: str,
    priority: str = "medium"
) -> str:
    """Create a support ticket. Use for unresolved issues."""
    ticket = {
        "ticket_id": f"TKT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "customer_id": customer_id,
        "category": category,
        "issue": issue[:200],
        "priority": priority,
        "created_at": datetime.now().isoformat(),
        "status": "open"
    }
    with open("tickets.jsonl", "a") as f:
        f.write(json.dumps(ticket) + "\n")
    return f"Ticket created: {ticket['ticket_id']} | Priority: {priority} | Our team will contact you within 24 hours."

@tool
def lookup_customer_account(customer_id: str) -> str:
    """Look up customer account information."""
    mock_accounts = {
        "CUST-001": {"name": "Ahmed Hassan", "plan": "Professional", "since": "2023-01", "status": "active"},
        "CUST-002": {"name": "Sara Johnson", "plan": "Enterprise", "since": "2022-06", "status": "active"},
    }
    account = mock_accounts.get(customer_id, {"name": "Unknown", "plan": "Unknown", "status": "not_found"})
    return f"Account: {account}"

tools = [search_knowledge_base, create_support_ticket, lookup_customer_account]

# ---- State ----
class SupportState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    customer_id: str
    customer_query: str
    classification: Optional[dict]
    escalated: bool
    resolved: bool
    human_response: Optional[str]
    session_id: str

# ---- Nodes ----
classifier_llm = llm.with_structured_output(QueryClassification)

def classify_node(state: SupportState) -> dict:
    print("  🏷️  Classifying query...")
    result = classifier_llm.invoke(
        f"Classify this customer support query:\n{state['customer_query']}"
    )
    print(f"     Category: {result.category} | Urgency: {result.urgency} | Escalate: {result.requires_escalation}")
    return {"classification": result.model_dump()}

def rag_agent_node(state: SupportState) -> dict:
    print("  🤖 RAG Agent responding...")
    llm_with_tools = llm.bind_tools(tools)
    
    messages = [
        SystemMessage(content=f"""You are a helpful customer support agent for TechCorp.
Customer ID: {state['customer_id']}
Use search_knowledge_base to find answers. Create tickets for unresolved issues.
Be empathetic and professional."""),
        HumanMessage(content=state['customer_query'])
    ]
    
    # Run tool loop (max 3 iterations)
    for _ in range(3):
        response = llm_with_tools.invoke(messages)
        messages.append(response)
        
        if not response.tool_calls:
            return {"messages": [response], "resolved": True}
        
        from langchain_core.messages import ToolMessage
        for tc in response.tool_calls:
            tool_map = {t.name: t for t in tools}
            result = tool_map.get(tc["name"], lambda x: "Tool not found").invoke(tc["args"])
            messages.append(ToolMessage(content=str(result), tool_call_id=tc["id"]))
    
    return {"messages": messages[-1:], "resolved": True}

def escalation_prep_node(state: SupportState) -> dict:
    print("  ⚠️  Preparing escalation...")
    return {"escalated": True}

def human_response_node(state: SupportState) -> dict:
    """Simulates human agent (in production: UI shows this to real human)."""
    print("  👤 Human agent reviewing...")
    # Mock human response
    return {
        "human_response": "Hello! Thank you for contacting us. A senior specialist will review your case and respond within 2 hours.",
        "messages": [AIMessage(content="Your case has been escalated to a senior specialist. You'll hear from us within 2 hours.")]
    }

def route_after_classify(state: SupportState) -> str:
    classification = state.get("classification", {})
    urgency = classification.get("urgency", "low")
    escalate = classification.get("requires_escalation", False)
    sentiment = classification.get("sentiment", "neutral")
    
    if urgency == "critical" or escalate or sentiment == "angry":
        return "escalate"
    return "rag_agent"

# ---- Build Graph ----
checkpointer = MemorySaver()
graph = StateGraph(SupportState)

for name, fn in [("classify", classify_node), ("rag_agent", rag_agent_node),
                  ("escalation_prep", escalation_prep_node), ("human_response", human_response_node)]:
    graph.add_node(name, fn)

graph.set_entry_point("classify")
graph.add_conditional_edges("classify", route_after_classify, {
    "escalate": "escalation_prep",
    "rag_agent": "rag_agent"
})
graph.add_edge("escalation_prep", "human_response")
graph.add_edge("human_response", END)
graph.add_edge("rag_agent", END)

app = graph.compile(
    checkpointer=checkpointer,
    interrupt_before=["human_response"]  # HITL: pause for human review
)

def handle_query(customer_id: str, query: str) -> dict:
    session_id = f"{customer_id}_{datetime.now().strftime('%H%M%S')}"
    config = {"configurable": {"thread_id": session_id}}
    
    print(f"\n🎧 Support Query from {customer_id}")
    print(f"   Query: {query[:80]}")
    print("-" * 50)
    
    result = app.invoke({
        "messages": [HumanMessage(content=query)],
        "customer_id": customer_id,
        "customer_query": query,
        "classification": None,
        "escalated": False,
        "resolved": False,
        "human_response": None,
        "session_id": session_id
    }, config=config)
    
    # Check if paused for human review
    state = app.get_state(config)
    if state.next and "human_response" in str(state.next):
        print("  ⏸️  PAUSED: Waiting for human agent review")
        # In production: notify human agent, get their response
        # For demo: auto-continue
        final = app.invoke(None, config=config)
        return final
    
    return result

# Test
handle_query("CUST-001", "What is the refund policy?")
handle_query("CUST-001", "I'm EXTREMELY ANGRY! Your service deleted all my data and I want a refund NOW!")
```

---

## 🏗️ Project 2: Content Creation Pipeline

```python
# ============================================================
# FILE: projects/project_02_content_pipeline/workflow.py
# ARCHITECTURE: Supervisor + 4 Specialist Agents + Quality Gate
# ============================================================

# Full supervisor-worker pipeline:
# Supervisor → routes to: Researcher, Outline Writer, Content Writer, Editor
# Quality Gate → scores content, loops if below threshold
# Human Gate (optional) → pause for human approval before publish

# Key concepts: supervisor pattern + HITL + quality loop
# See Phase 8 for the full supervisor pattern implementation
# Extend with: quality scoring, HITL gate, publish node

print("""
Project 2: Content Pipeline
─────────────────────────────
Flow: Topic → Research → Outline → Write → Edit → Quality Check
                                              ↑              |
                                              └── Loop ───────┘ (if score < 75)
                                                          ↓
                                               Human Approval → Publish

Key Files to Create:
  - workflow.py (main LangGraph workflow)
  - agents/researcher.py
  - agents/writer.py  
  - agents/editor.py
  - tools/publisher.py

Run: python workflow.py --topic "AI in Healthcare"
""")
```

---

## 🏗️ Projects 3-8: Architecture Blueprints

```python
# ============================================================
# PROJECT 3: Code Review & Debug Agent
# ============================================================
"""
Flow:
  Code submitted → Static analysis → AI review 
  → Issues found?
    ├── YES → Generate fixes → Run tests → Pass?
    │              ├── YES → Approve + explain
    │              └── NO  → Loop (max 3 times)
    └── NO  → Auto-approve with compliment

Tools: write_file, run_python, check_syntax, run_tests
Patterns: Agent loop + Tool use + Error routing
File: projects/project_03_code_reviewer/agent.py
"""

# ============================================================
# PROJECT 4: Research Synthesis Bot
# ============================================================
"""
Flow:
  Research query → Query decomposition (split into sub-questions)
  → Parallel retrieval for each sub-question
  → Relevance grading (CRAG pattern)
  → Synthesis into coherent report
  → Fact-checking pass
  → Final report generation

Tools: search_kb, web_search, save_report
Patterns: Corrective RAG + Parallel agents + Multi-hop
File: projects/project_04_research_bot/bot.py
"""

# ============================================================
# PROJECT 5: Financial Compliance Checker
# ============================================================
"""
Flow:
  Transaction data → Parse and validate
  → Risk scoring (rule-based + AI)
  → Risk level routing:
    - Low risk:    Auto-approve + log
    - Medium risk: AI review + recommend
    - High risk:   HITL — human compliance officer reviews
    - Critical:    Block + alert + full audit trail
  → Immutable audit log (append-only state)

Tools: check_rules, calculate_risk, send_alert, write_audit_log
Patterns: HITL + Custom reducers + Audit trail
File: projects/project_05_compliance/checker.py
"""

# ============================================================
# PROJECT 6: AI Hiring Pipeline
# ============================================================
"""
Flow:
  Application received
  → Resume Parser Agent (extract structured data)
  → Skills Matcher Agent (compare to job requirements)
  → Cultural Fit Agent (assess soft skills from writing)
  → Supervisor compiles scores
  → Decision:
    - Score > 80: Auto-advance to interview
    - Score 60-80: HR review (HITL)
    - Score < 60: Auto-reject with kind feedback
  → Notification Agent (sends appropriate email)

Tools: parse_resume, match_skills, send_email, update_ats
Patterns: Multi-agent + Subgraphs + HITL
File: projects/project_06_hiring/pipeline.py
"""

# ============================================================
# PROJECT 7: Self-Healing Data Pipeline
# ============================================================
"""
Flow:
  Raw data arrives → Validate schema
  → Validation result:
    - Valid:   Process normally
    - Minor issues:  Auto-fix + log correction
    - Major issues:  Alert data team (HITL)
    - Critical:      Quarantine + rollback + alert
  
  Processing:
  → Transform data → Load to destination
  → Verify load success
  → Failure: Retry with exponential backoff (max 3)
  → After 3 failures: Quarantine + human alert

Tools: validate_schema, transform_data, load_data, send_alert
Patterns: Error routing + Retry loops + HITL + Audit
File: projects/project_07_data_pipeline/pipeline.py
"""

# ============================================================
# PROJECT 8: Enterprise AI Orchestrator
# ============================================================
"""
The capstone: combines ALL LangGraph patterns

Flow:
  Complex business task received by Orchestrator
  → Task decomposition into subtasks
  → Subtasks routed to specialized sub-graphs:
    - Research sub-graph (CRAG pattern)
    - Analysis sub-graph (parallel agents)
    - Content sub-graph (supervisor pattern)
    - Review sub-graph (HITL + quality loop)
  → Results aggregated by Orchestrator
  → Quality validation
  → Human approval gate (HITL)
  → Delivery + Audit trail

Architecture: Nested subgraphs + Multi-agent + HITL + Persistence
File: projects/project_08_orchestrator/orchestrator.py
"""
```

---

## 📁 Running Each Project

```bash
# Setup for each project
cd projects/project_01_customer_support
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Add your keys

# Run
python workflow.py

# Or with a specific input
python workflow.py --customer "CUST-001" --query "What is the refund policy?"
```

---

## 🎯 Portfolio Challenge

After completing all 8 projects, pick ONE and:
1. Add a proper `README.md` explaining what it does
2. Add a Streamlit UI (next phase!)
3. Containerize with Docker
4. Deploy to Railway or similar
5. Add the live URL to your LinkedIn profile

This is your flagship portfolio piece that proves you're a production AI engineer.

---

## ✅ Phase 11 Recap

You've built (or designed) 8 real-world LangGraph applications. Each demonstrates:
- State management
- Conditional routing
- Multi-agent coordination
- Human-in-the-loop
- Persistence and memory
- Error handling
- Production patterns

---

## 🚀 What's Next?

**Phase 12** — Advanced Patterns: async LangGraph, streaming, callbacks, LangSmith monitoring, and enterprise optimizations.

> **Go to**: `Phase12_Advanced/lesson.md` →

---

*Phase 11 Complete! 🏭 You've built real AI products. You are an AI Engineer!*
