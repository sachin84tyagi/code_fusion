# 🧑‍💼 Phase 7 — Human-in-the-Loop
### "AI That Knows When to Ask for Help"

> **Difficulty**: ⭐⭐⭐ Intermediate | **Time**: ~90 minutes | **Prerequisites**: Phase 6 Complete

---

## 🎯 What You'll Learn

- ✅ What Human-in-the-Loop (HITL) is and why it's critical
- ✅ `interrupt_before` — pause before a node runs
- ✅ `interrupt_after` — pause after a node runs  
- ✅ Resuming a paused workflow
- ✅ Updating state during a pause
- ✅ Build: Content Approval System, Financial Trade Review, Safe Email Bot

---

## 📖 Lesson 7.1 — Why Human-in-the-Loop?

### The Problem with Fully Autonomous AI

```
Fully Autonomous AI:
─────────────────────────────────────────────
Agent: "I'll send this email to 10,000 customers"
       → Sends embarrassing wrong email to everyone 😱

Agent: "I'll delete these old files"
       → Deletes important production data 💀

Agent: "I'll charge the customer's card"
       → Charges the wrong amount 😤
─────────────────────────────────────────────
```

### The Solution: Pause and Ask

```
With Human-in-the-Loop:
─────────────────────────────────────────────
Agent: "I'm about to send this email to 10,000 customers.
        Here's the draft: [shows draft]
        Should I proceed? [Y/N]"
        
Human: [Reads draft] "Yes, looks good!"

Agent: "Confirmed. Sending now..."
        → Sends correct email ✅
─────────────────────────────────────────────
```

### When To Use Human-in-the-Loop

```
✅ Use HITL when:
- Action is IRREVERSIBLE (send email, delete file, make payment)
- Action has HIGH STAKES (large amounts, many users)
- AI confidence is LOW (uncertain decisions)
- Action involves REAL WORLD EFFECTS (API calls, database writes)
- REGULATORY requirements (finance, healthcare)

❌ Don't use HITL when:
- Action is reversible and low-risk
- AI confidence is high for routine tasks
- Speed is critical and stakes are low
```

---

## 📖 Lesson 7.2 — `interrupt_before`: Pause Before a Node

```python
# ============================================================
# FILE: 05_human_loop/interrupt_before.py
# PURPOSE: Pause the workflow BEFORE a risky node runs
# ============================================================

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from typing import TypedDict, Annotated, List, Optional
import operator

llm = ChatOllama(model="llama3.2", temperature=0.3)
parser = StrOutputParser()

class EmailState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    email_to: str
    email_subject: str
    email_body: Optional[str]
    human_approved: bool
    status: str

# ---- Nodes ----
def draft_email_node(state: EmailState) -> dict:
    """AI drafts the email content."""
    print("✍️  AI is drafting email...")
    
    draft = (
        ChatPromptTemplate.from_messages([
            ("system", "You are a professional email writer."),
            ("human", "Write a professional email to: {to}\nSubject: {subject}\n\nWrite the email body only.")
        ]) | llm | parser
    ).invoke({"to": state["email_to"], "subject": state["email_subject"]})
    
    print(f"\n📧 Draft email ready for review:")
    print(f"   To: {state['email_to']}")
    print(f"   Subject: {state['email_subject']}")
    print(f"   Body preview: {draft[:100]}...")
    
    return {"email_body": draft, "status": "draft_ready"}

def send_email_node(state: EmailState) -> dict:
    """Actually sends the email — RISKY! Requires human approval."""
    print("\n📤 Sending email...")
    # In production: call email API here
    print(f"   ✅ Email sent to {state['email_to']}!")
    return {"status": "sent", "messages": [AIMessage(content=f"Email successfully sent to {state['email_to']}!")]}

def rejected_node(state: EmailState) -> dict:
    """Handle rejection."""
    print("\n❌ Email send cancelled by human.")
    return {"status": "rejected", "messages": [AIMessage(content="Email send was cancelled. No email was sent.")]}

def route_after_review(state: EmailState) -> str:
    return "send" if state.get("human_approved") else "rejected"

# ---- Build Graph ----
checkpointer = MemorySaver()
graph = StateGraph(EmailState)

graph.add_node("draft", draft_email_node)
graph.add_node("send_email", send_email_node)
graph.add_node("rejected", rejected_node)

graph.set_entry_point("draft")
graph.add_edge("draft", "send_email")  # Will be interrupted before send_email!
graph.add_conditional_edges("draft", route_after_review, {
    "send": "send_email",
    "rejected": "rejected"
})

graph.add_edge("send_email", END)
graph.add_edge("rejected", END)

# ---- KEY: interrupt_before pauses BEFORE the send_email node ----
app = graph.compile(
    checkpointer=checkpointer,
    interrupt_before=["send_email"]  # ← Pause HERE before sending!
)

# ---- Workflow ----
thread_config = {"configurable": {"thread_id": "email_workflow_001"}}

initial_state = {
    "messages": [],
    "email_to": "client@bigcompany.com",
    "email_subject": "Project Update - Q2 Milestone Achieved",
    "email_body": None,
    "human_approved": False,
    "status": "starting"
}

print("🤖 Email Bot with Human Approval\n")
print("=" * 50)

# ---- Step 1: Run until interrupt ----
print("🚀 Starting workflow...")
result = app.invoke(initial_state, config=thread_config)

# At this point, the graph has PAUSED before send_email
print(f"\n⏸️  Workflow PAUSED (status: {result['status']})")

# ---- Step 2: Human reviews ----
print("\n" + "="*50)
print("👤 HUMAN REVIEW REQUIRED")
print("="*50)
print(f"📧 Email Draft:")
print(f"   To: {result['email_to']}")
print(f"   Subject: {result['email_subject']}")
print(f"   Body:\n{result.get('email_body', 'No body')[:300]}")
print("="*50)

# In a real app: show this in a UI, wait for button click
approval = input("\n❓ Send this email? (yes/no): ").strip().lower()
human_approved = approval == "yes"
print(f"✅ Decision: {'APPROVED' if human_approved else 'REJECTED'}")

# ---- Step 3: Update state with human decision ----
app.update_state(
    thread_config,
    {"human_approved": human_approved}
)

# ---- Step 4: Resume the workflow ----
print("\n▶️  Resuming workflow...")
final_result = app.invoke(None, config=thread_config)  # None = continue from where we paused

print(f"\n🏁 Final status: {final_result['status']}")
print(f"📋 Final message: {final_result['messages'][-1].content if final_result['messages'] else 'No messages'}")
```

---

## 📖 Lesson 7.3 — `interrupt_after`: Pause After a Node

```python
# ============================================================
# FILE: 05_human_loop/interrupt_after.py
# PURPOSE: Pause AFTER a node to review its output
# ============================================================

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List, Optional
import operator

llm = ChatOllama(model="llama3.2", temperature=0.7)
parser = StrOutputParser()

class ContentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    topic: str
    content: Optional[str]
    human_feedback: Optional[str]
    status: str
    approved: bool

def generate_content(state: ContentState) -> dict:
    """Generate content that needs human review."""
    print("🤖 AI generating content...")
    
    content = (
        ChatPromptTemplate.from_messages([
            ("system", "You are a professional content writer."),
            ("human", "Write a 3-paragraph blog intro about: {topic}")
        ]) | llm | parser
    ).invoke({"topic": state["topic"]})
    
    print(f"📝 Content generated ({len(content)} chars)")
    return {"content": content, "status": "awaiting_review"}

def revise_content(state: ContentState) -> dict:
    """Revise content based on human feedback."""
    print("🔄 Revising content based on feedback...")
    
    revised = (
        ChatPromptTemplate.from_messages([
            ("system", "You are a content editor. Revise based on feedback."),
            ("human", "Original:\n{content}\n\nFeedback:\n{feedback}\n\nRevised version:")
        ]) | llm | parser
    ).invoke({"content": state["content"], "feedback": state["human_feedback"]})
    
    return {"content": revised, "status": "revised"}

def publish_content(state: ContentState) -> dict:
    """Publish the approved content."""
    print("🚀 Publishing content...")
    return {"status": "published", "messages": [AIMessage(content=f"✅ Published!\n\n{state['content'][:200]}...")]}

def route_after_review(state: ContentState) -> str:
    if state.get("approved"):
        return "publish"
    elif state.get("human_feedback"):
        return "revise"
    else:
        return "await"  # Shouldn't happen but safe fallback

checkpointer = MemorySaver()
graph = StateGraph(ContentState)

graph.add_node("generate", generate_content)
graph.add_node("revise", revise_content)
graph.add_node("publish", publish_content)

graph.set_entry_point("generate")
graph.add_edge("generate", "publish")  # interrupted_after will catch this

# After review decision:
graph.add_conditional_edges("generate", route_after_review, {
    "publish": "publish",
    "revise": "revise",
    "await": END
})
graph.add_edge("revise", "generate")   # Revised content goes back for re-review
graph.add_edge("publish", END)

# ---- interrupt_after: pause AFTER generate runs ----
app = graph.compile(
    checkpointer=checkpointer,
    interrupt_after=["generate"]  # ← Pause after generate to review output
)

config = {"configurable": {"thread_id": "content_review"}}

print("📝 Content Creation with Human Review\n")

# Step 1: Generate content (pauses after)
result = app.invoke({
    "messages": [],
    "topic": "Why AI agents are the future of software development",
    "content": None, "human_feedback": None, "status": "starting", "approved": False
}, config=config)

# Content has been generated, workflow paused
print("\n⏸️ PAUSED — Content ready for review")
print("\n" + "="*60)
print("GENERATED CONTENT:")
print("="*60)
print(result.get("content", "No content")[:400])
print("="*60)

action = input("\n❓ Your choice:\n  1. Approve and publish\n  2. Request revisions\n  3. Cancel\n> ").strip()

if action == "1":
    app.update_state(config, {"approved": True})
    final = app.invoke(None, config=config)
    print(f"\n✅ {final['status'].upper()}")
elif action == "2":
    feedback = input("📝 Your feedback: ").strip()
    app.update_state(config, {"human_feedback": feedback, "approved": False})
    final = app.invoke(None, config=config)
    print(f"\n📄 Content revised. Status: {final['status']}")
else:
    print("❌ Cancelled")
```

---

## 📖 Lesson 7.4 — Interactive Human-in-the-Loop Pattern

```python
# ============================================================
# FILE: 05_human_loop/interactive_hitl.py
# PURPOSE: Full interactive HITL for content moderation
# ============================================================

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from typing import TypedDict, Annotated, List, Optional, Literal
import operator

llm = ChatOllama(model="llama3.2", temperature=0)
parser = StrOutputParser()

class ModerationState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    content: str
    ai_verdict: str
    ai_confidence: int
    human_decision: Optional[str]
    reason: Optional[str]
    status: str

def ai_screen(state: ModerationState) -> dict:
    """AI does initial screening."""
    result = (
        ChatPromptTemplate.from_messages([
            ("system", """You are a content moderator. Assess content.
Respond with:
VERDICT: SAFE or REVIEW_NEEDED or BLOCK
CONFIDENCE: [0-100]
REASON: [brief reason]"""),
            ("human", "Content: {content}")
        ]) | llm | parser
    ).invoke({"content": state["content"]})
    
    verdict, confidence = "REVIEW_NEEDED", 50
    reason = result
    
    for line in result.split('\n'):
        if "VERDICT:" in line:
            if "SAFE" in line: verdict = "SAFE"
            elif "BLOCK" in line: verdict = "BLOCK"
            else: verdict = "REVIEW_NEEDED"
        elif "CONFIDENCE:" in line:
            try:
                confidence = int(''.join(filter(str.isdigit, line)))
            except: pass
        elif "REASON:" in line:
            reason = line.replace("REASON:", "").strip()
    
    print(f"  🤖 AI verdict: {verdict} ({confidence}% confident)")
    print(f"  📝 Reason: {reason[:80]}")
    
    return {"ai_verdict": verdict, "ai_confidence": confidence, "reason": reason}

def auto_approve(state: ModerationState) -> dict:
    print("  ✅ AUTO-APPROVED (AI confident it's safe)")
    return {"status": "auto_approved", "human_decision": "approved"}

def auto_block(state: ModerationState) -> dict:
    print("  🚫 AUTO-BLOCKED (AI confident it's harmful)")
    return {"status": "auto_blocked", "human_decision": "blocked"}

def human_review_prep(state: ModerationState) -> dict:
    """Prepares case for human review."""
    print("  👤 Preparing for human review...")
    return {"status": "awaiting_human_review"}

def apply_human_decision(state: ModerationState) -> dict:
    decision = state.get("human_decision", "rejected")
    print(f"  ✅ Human decision applied: {decision}")
    return {"status": f"human_{decision}"}

def route_ai_decision(state: ModerationState) -> str:
    verdict = state.get("ai_verdict", "REVIEW_NEEDED")
    confidence = state.get("ai_confidence", 0)
    
    # High confidence safe → auto approve
    if verdict == "SAFE" and confidence >= 90:
        return "auto_approve"
    # High confidence block → auto block
    elif verdict == "BLOCK" and confidence >= 90:
        return "auto_block"
    # Everything else → human reviews
    else:
        return "human_review"

def route_final(state: ModerationState) -> str:
    return "apply" if state.get("human_decision") else END

checkpointer = MemorySaver()
graph = StateGraph(ModerationState)

for name, fn in [("ai_screen", ai_screen), ("auto_approve", auto_approve),
                  ("auto_block", auto_block), ("human_review_prep", human_review_prep),
                  ("apply_human", apply_human_decision)]:
    graph.add_node(name, fn)

graph.set_entry_point("ai_screen")
graph.add_conditional_edges("ai_screen", route_ai_decision, {
    "auto_approve": "auto_approve",
    "auto_block": "auto_block",
    "human_review": "human_review_prep"
})
graph.add_conditional_edges("human_review_prep", route_final, {
    "apply": "apply_human", END: END
})
graph.add_edge("auto_approve", END)
graph.add_edge("auto_block", END)
graph.add_edge("apply_human", END)

app = graph.compile(
    checkpointer=checkpointer,
    interrupt_after=["human_review_prep"]  # Pause for human review
)

def moderate(content: str, content_id: str):
    print(f"\n🔍 Moderating content ID: {content_id}")
    print(f"   Preview: {content[:60]}...")
    
    config = {"configurable": {"thread_id": f"moderation_{content_id}"}}
    
    result = app.invoke({
        "messages": [], "content": content, "ai_verdict": "",
        "ai_confidence": 0, "human_decision": None, "reason": None, "status": "pending"
    }, config=config)
    
    if result["status"] == "awaiting_human_review":
        print(f"\n  ⚠️  Human review needed!")
        print(f"  AI said: {result['ai_verdict']} ({result['ai_confidence']}% confident)")
        print(f"  Content: {content[:200]}")
        
        decision = input("  👤 Your decision (approve/block/delete): ").strip().lower()
        decision = decision if decision in ["approve", "block", "delete"] else "block"
        
        app.update_state(config, {"human_decision": decision})
        result = app.invoke(None, config=config)
    
    print(f"  🏁 Final: {result['status']}")
    return result["status"]

# Test
test_contents = [
    ("A helpful guide to Python programming for beginners", "c001"),
    ("Click here for FREE MONEY!!! No work required!!!", "c002"),
]

print("🛡️ AI Content Moderation System\n")
for content, cid in test_contents:
    moderate(content, cid)
```

---

## ⚠️ Common HITL Mistakes

### Mistake 1: Resuming Without Updating State

```python
# ❌ Paused, but resuming without human input
result = app.invoke(initial_state, config=config)  # PAUSED
# ... forgot to get human input ...
final = app.invoke(None, config=config)  # Resumes with same (unapproved) state

# ✅ Always update state before resuming
result = app.invoke(initial_state, config=config)  # PAUSED
human_decision = get_human_input()               # Get decision
app.update_state(config, {"approved": human_decision})  # Update state
final = app.invoke(None, config=config)          # Resume with updated state
```

### Mistake 2: Wrong Interrupt Placement

```python
# interrupt_before: pauses BEFORE node runs (node hasn't executed yet)
# interrupt_after:  pauses AFTER node runs  (node has already executed)

# Use interrupt_before when: you want to show user what WILL happen
# Use interrupt_after  when: you want to show user what DID happen (for approval)
```

---

## 🎯 Mini Challenges

**Challenge 1**: Build a "Social Media Post Approval System" — AI drafts a LinkedIn post, human reviews and either approves (posts), edits (revises), or rejects (discards).

**Challenge 2**: Create a "Financial Transaction Approver" — for transactions over $1000, pause and require human approval. Auto-approve small transactions.

**Challenge 3**: Build a "Code Deployment Gate" — AI analyzes code changes, gives a risk score. Low risk = auto-deploy. High risk = require human sign-off before deployment.

---

## ✅ Phase 7 Recap

| Concept | Use When |
|---------|---------|
| `interrupt_before=["node"]` | Want human to see what AI WILL do |
| `interrupt_after=["node"]` | Want human to review what AI DID |
| `app.update_state()` | Inject human decision into paused state |
| `app.invoke(None, config=)` | Resume from checkpoint |
| Auto-approve paths | High confidence, low-risk actions |
| Human review paths | Low confidence, high-risk actions |

---

## 🚀 What's Next?

**Phase 8** — Multi-Agent Systems: orchestrating multiple specialized AI agents working together as a team, each with their own skills.

> **Go to**: `Phase08_Multi_Agent/lesson.md` →

---

*Phase 7 Complete! 🧑‍💼 Your AI now knows when to ask humans. Time for teamwork!*
