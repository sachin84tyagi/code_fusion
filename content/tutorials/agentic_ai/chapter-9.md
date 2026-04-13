# 🤖 Agentic AI Full Stack Developer Course
## Chapter 9: Agentic Workflows — Automating Real Business Pipelines

> **Professor's Note:** You've built agents that think (ReAct), remember (RAG), plan (ToT), collaborate (multi-agent), and talk to users (full-stack UI). That's all still mostly toys unless they're doing *real work* while you sleep. In this chapter, we stop building demo agents and start building **production automation agents** — the kind that save companies thousands of hours per month. We're talking about agents that triage your inbox, update your CRM, run your data pipelines, and review your pull requests. This is where agentic AI stops being a project and starts being a product. Ready? Let's automate some businesses. 🏭⚡

---

```
╔══════════════════════════════════════════════════════════════╗
║  📦 CHAPTER 9 AT A GLANCE                                   ║
╠══════════════════════════════════════════════════════════════╣
║  📧  Email Triage Agent — classify, prioritize, auto-reply  ║
║  🏢  CRM Update Agent — extract entities, enrich, sync      ║
║  🔄  Data Pipeline Agent — ETL with AI validation           ║
║  🔍  Code Review Bot — AST analysis + LLM critique          ║
║  ⏰  Scheduling & Triggers — cron, webhooks, event-driven   ║
║  🔁  Retry Logic & Idempotency — production-grade patterns  ║
║  📊  Workflow Observability — logging, alerting, dashboards  ║
║  📝  Mini quiz — 5 questions                                ║
║  👀  Chapter 10 preview — Evaluation & Red-Teaming          ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 📋 Table of Contents

1. [What Is an Agentic Workflow?](#1-what-is-an-agentic-workflow)
2. [Email Triage Agent](#2-email-triage-agent)
3. [CRM Update Agent](#3-crm-update-agent)
4. [Data Pipeline Agent](#4-data-pipeline-agent)
5. [Code Review Bot](#5-code-review-bot)
6. [Triggers and Scheduling](#6-triggers-and-scheduling)
7. [Retry Logic and Idempotency](#7-retry-logic-and-idempotency)
8. [Workflow Observability](#8-workflow-observability)
9. [Mini Quiz](#9-mini-quiz)
10. [Chapter 10 Preview](#10-chapter-10-preview)

---

## 1. What Is an Agentic Workflow?

A **workflow** is a sequence of steps that process data to achieve a business goal. An **agentic workflow** is one where one or more AI agents make decisions at key points — replacing hard-coded `if/else` with intelligent reasoning.

```
TRADITIONAL WORKFLOW vs AGENTIC WORKFLOW:
════════════════════════════════════════════════════════════════

  TRADITIONAL (rule-based):
  ─────────────────────────────────────────────────────────
  Email arrives
      │
      ▼
  if subject contains "invoice" → move to Finance folder
  if from @vip-client.com → flag as urgent
  else → move to General folder
      │
      ▼
  Done. (Brittle. Misses context. Misses nuance.)


  AGENTIC (LLM-based decisions):
  ─────────────────────────────────────────────────────────
  Email arrives
      │
      ▼
  Agent reads email → understands intent, urgency, sentiment
      │
      ├─► Is it a complaint? → draft empathetic reply
      ├─► Is it a sales opportunity? → alert sales team + enrich CRM
      ├─► Is it a routine question? → search KB and auto-reply
      └─► Is it a legal matter? → flag for lawyer, DO NOT auto-reply
      │
      ▼
  Done. (Adapts to context. Handles edge cases. Learns from feedback.)


  THE 4 AGENTIC WORKFLOW PATTERNS WE'LL BUILD:
  ─────────────────────────────────────────────────────────
  ┌─────────────────────────────────────────────────────┐
  │                                                     │
  │  1. EMAIL TRIAGE AGENT                              │
  │     Classify → Prioritize → Route → Draft reply    │
  │     Real use: Support inbox at 10,000 emails/day   │
  │                                                     │
  │  2. CRM UPDATE AGENT                                │
  │     Extract entities → Enrich → Dedupe → Sync      │
  │     Real use: Sales team with Salesforce / HubSpot  │
  │                                                     │
  │  3. DATA PIPELINE AGENT                             │
  │     Fetch → Validate → Transform → Load → Alert    │
  │     Real use: Marketing analytics ETL pipeline     │
  │                                                     │
  │  4. CODE REVIEW BOT                                 │
  │     Parse AST → Find issues → Generate PR comments │
  │     Real use: GitHub Action on every pull request  │
  │                                                     │
  └─────────────────────────────────────────────────────┘


  ANATOMY OF EVERY AGENTIC WORKFLOW:
  ─────────────────────────────────────────────────────────

   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
   │ TRIGGER  │───►│  AGENT   │───►│ ACTIONS  │───►│ OUTPUTS  │
   │          │    │ (LLM +   │    │ (tools,  │    │ (emails, │
   │ cron/    │    │  memory  │    │  APIs,   │    │  DB      │
   │ webhook/ │    │  tools)  │    │  writes) │    │  writes, │
   │ event    │    │          │    │          │    │  alerts) │
   └──────────┘    └──────────┘    └──────────┘    └──────────┘
        │                │                               │
        │         ┌──────┴──────┐                        │
        │         │  GUARDRAILS │                        │
        │         │  - budget   │◄───────────────────────┘
        │         │  - approval │
        │         │  - audit log│
        └────────►└─────────────┘
```

### Project Setup

```bash
# Install once for this chapter
pip install openai python-dotenv pydantic requests aiohttp \
            schedule apscheduler sqlalchemy psutil

# Project structure
mkdir -p agentic_workflows
cd agentic_workflows
```

```python
# =========================================================
# FILE: agentic_workflows/shared/base.py
# Base classes and utilities shared across all workflows.
# =========================================================

import os
import json
import time
import logging
from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import Any, Optional
from enum import Enum

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


# ── Logging setup ──────────────────────────────────────────
# Use structured JSON logs — easier to query in CloudWatch/Datadog
logging.basicConfig(
    level=logging.INFO,
    format='{"ts":"%(asctime)s","level":"%(levelname)s","msg":"%(message)s"}',
    datefmt='%Y-%m-%dT%H:%M:%SZ'
)
log = logging.getLogger("agentic_workflow")


class WorkflowStatus(str, Enum):
    PENDING   = "pending"
    RUNNING   = "running"
    SUCCESS   = "success"
    FAILED    = "failed"
    SKIPPED   = "skipped"    # idempotency: already processed


@dataclass
class WorkflowResult:
    """
    Standard result object for all agentic workflows.
    Makes it easy to log, audit, and chain workflows together.
    """
    workflow_name: str
    input_id:      str             # unique ID of the input (email ID, record ID, etc.)
    status:        WorkflowStatus
    output:        dict = field(default_factory=dict)
    actions_taken: list = field(default_factory=list)  # audit trail
    errors:        list = field(default_factory=list)
    elapsed_ms:    int  = 0
    agent_tokens:  int  = 0

    def to_dict(self) -> dict:
        d = asdict(self)
        d["status"] = self.status.value
        return d

    def log(self) -> None:
        log.info(json.dumps(self.to_dict()))


class BaseWorkflowAgent:
    """
    Base class for all agentic workflow agents.
    Handles: LLM client, structured output calls, error wrapping.
    """

    def __init__(self, model: str = "gpt-4o-mini"):
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        self.model  = model

    def _llm(
        self,
        system:      str,
        user:        str,
        temperature: float = 0.1,
        max_tokens:  int   = 800,
    ) -> str:
        """
        Simple LLM call — returns the response content as a string.
        Low temperature by default: we want deterministic, consistent output
        for business workflows (not creative exploration).
        """
        resp = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system",  "content": system},
                {"role": "user",    "content": user},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return resp.choices[0].message.content.strip()

    def _llm_json(
        self,
        system:      str,
        user:        str,
        temperature: float = 0.0,
        max_tokens:  int   = 800,
    ) -> dict:
        """
        LLM call that guarantees a JSON response.
        Uses response_format=json_object — never hallucinate broken JSON.
        Returns empty dict on parse failure (never raises).
        """
        resp = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system + "\n\nAlways respond with valid JSON only."},
                {"role": "user",   "content": user},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
            response_format={"type": "json_object"},   # ← enforces JSON output
        )
        content = resp.choices[0].message.content.strip()
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            log.error(f"JSON parse failed: {e} | raw: {content[:200]}")
            return {}
```

---

## 2. Email Triage Agent

The **Email Triage Agent** is the most immediately impactful workflow you can build. Every company with a support inbox loses hours to manual triage. Let's automate it.

```
EMAIL TRIAGE AGENT — PIPELINE:
════════════════════════════════════════════════════════════════

  New Email
      │
      ▼
  ┌─────────────────────────────────────────────────────────┐
  │  STEP 1: CLASSIFY                                       │
  │  Category: complaint | sales | support | spam | legal  │
  │  Urgency: critical | high | medium | low               │
  │  Sentiment: positive | neutral | negative | angry      │
  └──────────────────────┬──────────────────────────────────┘
                         │
                         ▼
  ┌─────────────────────────────────────────────────────────┐
  │  STEP 2: ROUTE                                          │
  │  complaint + angry → escalate to support manager       │
  │  sales → notify sales team + enrich in CRM             │
  │  support → search knowledge base → draft reply         │
  │  spam → move to spam folder                            │
  │  legal → flag for legal team, DO NOT auto-reply        │
  └──────────────────────┬──────────────────────────────────┘
                         │
                         ▼
  ┌─────────────────────────────────────────────────────────┐
  │  STEP 3: ACTION                                         │
  │  Draft reply (if appropriate)                          │
  │  Create ticket in support system                       │
  │  Send Slack alert to relevant team                     │
  │  Log to audit trail                                    │
  └─────────────────────────────────────────────────────────┘

  SAFETY GUARDRAILS:
  - Never auto-send replies to "legal" category emails
  - Never auto-send if confidence < 0.85
  - Always log every action for audit compliance
  - Human approval required for replies > $500 value mentions
```

```python
# =========================================================
# FILE: agentic_workflows/email_triage_agent.py
# Classifies, routes, and drafts replies for incoming emails.
# pip install openai python-dotenv pydantic
# =========================================================

import json
import time
from dataclasses import dataclass
from typing import Optional
from pydantic import BaseModel

from shared.base import BaseWorkflowAgent, WorkflowResult, WorkflowStatus, log


# ── Data Models ────────────────────────────────────────────

class EmailClassification(BaseModel):
    """
    Structured output from the classification step.
    Pydantic validates the LLM's JSON response matches this schema.
    """
    category:       str    # complaint | sales | support | spam | legal | other
    urgency:        str    # critical | high | medium | low
    sentiment:      str    # positive | neutral | negative | angry
    confidence:     float  # 0.0 - 1.0
    key_topics:     list[str]
    requires_human: bool   # True if agent shouldn't auto-reply
    summary:        str    # one-sentence summary of the email


@dataclass
class Email:
    """Represents an incoming email."""
    id:      str
    from_:   str
    subject: str
    body:    str
    date:    str


# ── Email Triage Agent ─────────────────────────────────────

class EmailTriageAgent(BaseWorkflowAgent):
    """
    A three-step email triage pipeline:
    1. Classify (what is this email about?)
    2. Route (who/what should handle it?)
    3. Act (draft reply, create ticket, send alert)

    Designed to run against an email inbox via IMAP or an ESP webhook.
    """

    # Categories that NEVER get auto-replies (human review required)
    NO_AUTO_REPLY_CATEGORIES = {"legal", "complaint", "spam"}

    # Urgency → response time SLA (in hours)
    URGENCY_SLA = {
        "critical": 1,
        "high":     4,
        "medium":   24,
        "low":      72,
    }

    def run(self, email: Email) -> WorkflowResult:
        """
        Main entry point: process one email end-to-end.

        Args:
            email: The Email object to triage

        Returns:
            WorkflowResult with classification, routing, and actions taken
        """
        start     = time.time()
        actions   = []
        result_kv = {}

        try:
            # ── Step 1: Classify ─────────────────────────
            log.info(f"Classifying email: {email.id}")
            classification = self._classify(email)
            result_kv["classification"] = classification.model_dump()
            actions.append(f"classified as {classification.category} / {classification.urgency}")

            # ── Step 2: Route ─────────────────────────────
            route = self._determine_route(classification)
            result_kv["route"] = route
            actions.append(f"routed to: {route['destination']}")

            # ── Step 3: Act ───────────────────────────────
            if classification.category == "spam":
                actions.append("moved to spam — no further action")

            elif classification.requires_human or \
                 classification.category in self.NO_AUTO_REPLY_CATEGORIES:
                # Safety guardrail: flag for human, do NOT auto-reply
                self._create_support_ticket(email, classification, priority=route["priority"])
                actions.append("created support ticket — flagged for human review")

            elif classification.confidence >= 0.85:
                # High confidence → draft auto-reply
                reply = self._draft_reply(email, classification)
                result_kv["draft_reply"] = reply
                actions.append("drafted auto-reply (pending send approval)")

                # Also create a ticket for tracking
                self._create_support_ticket(email, classification, priority=route["priority"])
                actions.append("created support ticket for tracking")

            else:
                # Low confidence → escalate for human review
                actions.append(f"low confidence ({classification.confidence:.2f}) — escalated to human")
                result_kv["escalation_reason"] = "classification confidence below threshold 0.85"

            # ── Step 4: Alert if urgent ───────────────────
            if classification.urgency in ("critical", "high"):
                self._send_slack_alert(email, classification)
                actions.append(f"sent Slack alert for {classification.urgency} urgency")

            elapsed = int((time.time() - start) * 1000)
            return WorkflowResult(
                workflow_name = "email_triage",
                input_id      = email.id,
                status        = WorkflowStatus.SUCCESS,
                output        = result_kv,
                actions_taken = actions,
                elapsed_ms    = elapsed,
            )

        except Exception as e:
            return WorkflowResult(
                workflow_name = "email_triage",
                input_id      = email.id,
                status        = WorkflowStatus.FAILED,
                errors        = [str(e)],
                actions_taken = actions,
                elapsed_ms    = int((time.time() - start) * 1000),
            )

    def _classify(self, email: Email) -> EmailClassification:
        """
        Step 1: Classify the email using structured LLM output.
        Returns an EmailClassification object validated by Pydantic.

        Why JSON mode? Without it, LLMs sometimes output:
          "Here is the classification: {"category": ...}"
        With response_format=json_object, you get ONLY the JSON.
        """
        system = """You are an email classification expert for a B2B SaaS company.
Classify incoming emails accurately and conservatively — when in doubt, require human review.

Categories:
- complaint: customer expressing dissatisfaction or reporting a problem
- sales: potential new customer, upsell opportunity, pricing inquiry
- support: existing customer with a technical question or how-to request
- legal: legal notices, GDPR requests, contracts, threats of litigation
- spam: unsolicited marketing, phishing, irrelevant
- other: doesn't fit the above

Urgency:
- critical: system down, data breach, legal deadline within 24h
- high: customer blocked, SLA breach risk, deal at risk
- medium: general support question, feedback
- low: newsletter, feature request, general inquiry

Return JSON with keys:
  category, urgency, sentiment, confidence (0.0-1.0),
  key_topics (list), requires_human (bool), summary (string)"""

        user = f"""Email to classify:
From: {email.from_}
Subject: {email.subject}
Date: {email.date}

Body:
{email.body[:2000]}"""

        raw = self._llm_json(system, user, temperature=0.0)

        # Pydantic validates and coerces the LLM output
        # If the LLM returns a float as a string, Pydantic converts it.
        # If a field is missing, Pydantic raises ValidationError (we catch upstream)
        try:
            return EmailClassification(**raw)
        except Exception as e:
            # Fallback: require human review on any classification failure
            log.warning(f"Classification parse failed: {e}. Defaulting to human review.")
            return EmailClassification(
                category="other", urgency="medium", sentiment="neutral",
                confidence=0.0, key_topics=[], requires_human=True,
                summary="Classification failed — manual review required"
            )

    def _determine_route(self, cls: EmailClassification) -> dict:
        """
        Step 2: Determine where/who this email goes to.
        Pure logic — no LLM needed here. Fast and deterministic.
        """
        routing_table = {
            "legal":     {"destination": "legal-team@company.com",   "priority": "p0"},
            "complaint": {"destination": "support-manager@company.com", "priority": "p1"},
            "sales":     {"destination": "sales@company.com",         "priority": "p2"},
            "support":   {"destination": "support@company.com",       "priority": "p2"},
            "spam":      {"destination": "trash",                     "priority": "p5"},
            "other":     {"destination": "general@company.com",       "priority": "p3"},
        }

        route = routing_table.get(cls.category, routing_table["other"]).copy()

        # Urgency overrides: critical issues always go to on-call
        if cls.urgency == "critical":
            route["destination"] = "oncall@company.com"
            route["priority"]    = "p0"

        return route

    def _draft_reply(self, email: Email, cls: EmailClassification) -> str:
        """
        Step 3a: Draft a reply using the classification context.
        The agent uses tone guidance based on sentiment — irritated customers
        get a more empathetic opening than neutral inquiries.
        """
        tone_guide = {
            "angry":    "Be very empathetic, apologetic, and offer immediate help.",
            "negative": "Be empathetic and solution-focused.",
            "neutral":  "Be professional, concise, and helpful.",
            "positive": "Be warm, professional, and helpful.",
        }
        tone = tone_guide.get(cls.sentiment, "Be professional and helpful.")

        system = f"""You are a professional customer support agent.
Draft an email reply. {tone}

Rules:
- Keep it under 150 words
- Do NOT make promises you can't keep (no "we'll fix this today")
- Sign off as "Support Team, Acme Corp"
- Do NOT include a subject line — just the body
- Use plain text, no markdown"""

        user = f"""Draft a reply to this {cls.category} email about: {cls.summary}

Original email:
From: {email.from_}
Subject: {email.subject}

{email.body[:1000]}"""

        return self._llm(system, user, temperature=0.3, max_tokens=250)

    def _create_support_ticket(
        self,
        email:          Email,
        cls:            EmailClassification,
        priority:       str,
    ) -> str:
        """
        Step 3b: Create a ticket in the support system.
        In production: call Zendesk/Freshdesk/Linear API.
        Here: simulates the API call with logging.

        Returns:
            Ticket ID (simulated)
        """
        ticket = {
            "title":    f"[{cls.urgency.upper()}] {email.subject[:80]}",
            "from":     email.from_,
            "priority": priority,
            "category": cls.category,
            "topics":   cls.key_topics,
            "summary":  cls.summary,
            "sla_hours": self.URGENCY_SLA.get(cls.urgency, 24),
        }

        # In production: requests.post("https://your-helpdesk.com/api/tickets", json=ticket)
        ticket_id = f"TKT-{email.id[:8].upper()}"
        log.info(json.dumps({"event": "ticket_created", "ticket_id": ticket_id, **ticket}))
        return ticket_id

    def _send_slack_alert(self, email: Email, cls: EmailClassification) -> None:
        """
        Send a Slack message for high/critical urgency emails.
        In production: use Slack's incoming webhooks API.
        """
        emoji = "🚨" if cls.urgency == "critical" else "⚠️"
        message = {
            "text": (
                f"{emoji} *{cls.urgency.upper()} {cls.category.upper()}* email received\n"
                f"*From:* {email.from_}\n"
                f"*Subject:* {email.subject}\n"
                f"*Summary:* {cls.summary}\n"
                f"*Sentiment:* {cls.sentiment} | *Confidence:* {cls.confidence:.0%}"
            )
        }

        # In production:
        # import requests
        # requests.post(os.environ["SLACK_WEBHOOK_URL"], json=message)
        log.info(json.dumps({"event": "slack_alert_sent", "urgency": cls.urgency}))
        print(f"\n📣 SLACK ALERT:\n{message['text']}\n")


# ── Demo ───────────────────────────────────────────────────
if __name__ == "__main__":
    agent = EmailTriageAgent()

    test_emails = [
        Email(
            id      = "email-001",
            from_   = "sarah.johnson@acmecorp.com",
            subject = "URGENT: Production database is DOWN",
            body    = """Hi Support,

Our main production database has been unreachable for the past 30 minutes.
All our customers are unable to log in and we're losing $50,000 per hour.
We have an SLA with you that guarantees 99.9% uptime.

I need someone on the phone RIGHT NOW.

Sarah Johnson
CTO, AcmeCorp
+1-555-0123""",
            date    = "2024-01-15T09:30:00Z",
        ),
        Email(
            id      = "email-002",
            from_   = "john.doe@gmail.com",
            subject = "Question about your pricing",
            body    = """Hello,

I'm evaluating your platform for our startup (about 50 users).
Could you tell me more about your Team plan? Specifically:
- What's the per-seat cost?
- Do you offer annual discounts?
- Is there an API rate limit on the basic plan?

Looking forward to hearing from you.

John""",
            date    = "2024-01-15T10:15:00Z",
        ),
        Email(
            id      = "email-003",
            from_   = "legal@lawfirm.com",
            subject = "Data Subject Access Request — GDPR Article 15",
            body    = """Dear Data Controller,

On behalf of our client Mr. Robert Smith, we hereby submit a formal
Data Subject Access Request pursuant to Article 15 of the General
Data Protection Regulation (GDPR/EU 2016/679).

You have 30 days to comply. Failure to do so may result in a complaint
to the supervisory authority and civil proceedings.

Reference: DS-2024-001847

Smith & Associates Law Firm""",
            date    = "2024-01-15T11:00:00Z",
        ),
    ]

    print("=" * 65)
    print("  EMAIL TRIAGE AGENT — DEMO RUN")
    print("=" * 65)

    for email in test_emails:
        print(f"\n📧 Processing: [{email.id}] {email.subject}")
        print("-" * 55)

        result = agent.run(email)
        result.log()

        print(f"  Status:   {result.status.value}")
        if "classification" in result.output:
            cls = result.output["classification"]
            print(f"  Category: {cls.get('category')} | Urgency: {cls.get('urgency')}")
            print(f"  Sentiment:{cls.get('sentiment')} | Confidence: {cls.get('confidence', 0):.0%}")
        print(f"  Actions:")
        for action in result.actions_taken:
            print(f"    ✓ {action}")
        if "draft_reply" in result.output:
            print(f"\n  📝 Draft Reply:\n  {result.output['draft_reply'][:200]}...")
        print(f"  Elapsed: {result.elapsed_ms}ms")
```

---

## 3. CRM Update Agent

After emails are triaged, sales opportunities need to be captured in the CRM. The **CRM Update Agent** extracts entities from unstructured text, enriches them, and syncs to your CRM — replacing hours of manual data entry.

```
CRM UPDATE AGENT — DATA FLOW:
════════════════════════════════════════════════════════════════

  Trigger: New "sales" email OR sales call transcript
      │
      ▼
  ┌──────────────────────────────────────────────────────────┐
  │  STEP 1: ENTITY EXTRACTION                               │
  │  Who:    name, email, phone, title, company              │
  │  What:   product interest, budget, timeline              │
  │  Context: pain points, competitors mentioned             │
  └──────────────────────────────────┬───────────────────────┘
                                     │
                                     ▼
  ┌──────────────────────────────────────────────────────────┐
  │  STEP 2: ENRICHMENT                                      │
  │  Lookup company → firmographics (size, industry, ARR)   │
  │  Validate email domain → catch typos                     │
  │  Check existing CRM → duplicate detection               │
  └──────────────────────────────────┬───────────────────────┘
                                     │
                                     ▼
  ┌──────────────────────────────────────────────────────────┐
  │  STEP 3: QUALIFY (LLM-based lead scoring)               │
  │  Budget fit: does their budget match our ACV?           │
  │  Authority: is this person a decision-maker?            │
  │  Need: do they have the pain our product solves?        │
  │  Timeline: are they buying in the next 90 days?         │
  │  Score: HOT / WARM / COLD / DISQUALIFIED               │
  └──────────────────────────────────┬───────────────────────┘
                                     │
                                     ▼
  ┌──────────────────────────────────────────────────────────┐
  │  STEP 4: CRM SYNC                                        │
  │  Create/update Contact record                           │
  │  Create/update Company record                           │
  │  Create Deal opportunity (if qualified)                 │
  │  Log activity (email/call touchpoint)                   │
  └──────────────────────────────────────────────────────────┘
```

```python
# =========================================================
# FILE: agentic_workflows/crm_update_agent.py
# Extracts, enriches, qualifies, and syncs lead data to CRM.
# pip install openai python-dotenv pydantic requests
# =========================================================

import json
import time
import requests
from dataclasses import dataclass
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator

from shared.base import BaseWorkflowAgent, WorkflowResult, WorkflowStatus, log


# ── Data Models ────────────────────────────────────────────

class ContactInfo(BaseModel):
    """Extracted contact information from text."""
    first_name:   Optional[str] = None
    last_name:    Optional[str] = None
    email:        Optional[str] = None
    phone:        Optional[str] = None
    job_title:    Optional[str] = None
    company_name: Optional[str] = None

class OpportunityInfo(BaseModel):
    """Extracted sales opportunity details."""
    product_interest: list[str] = []
    budget_mentioned: Optional[str] = None    # e.g. "$10k-50k/year"
    timeline:         Optional[str] = None    # e.g. "Q2 2024"
    use_case:         Optional[str] = None
    pain_points:      list[str] = []
    competitors:      list[str] = []
    team_size:        Optional[int] = None

class ExtractedCRMData(BaseModel):
    """Complete extraction result."""
    contact:     ContactInfo
    opportunity: OpportunityInfo
    confidence:  float

class LeadScore(BaseModel):
    """BANT-based lead qualification score."""
    score:          str     # HOT | WARM | COLD | DISQUALIFIED
    numeric:        int     # 0-100
    budget_fit:     str     # "yes" | "no" | "unknown"
    is_decision_maker: bool
    has_clear_need:    bool
    timeline_defined:  bool
    reasoning:      str     # one paragraph explaining the score


# ── CRM Update Agent ───────────────────────────────────────

class CRMUpdateAgent(BaseWorkflowAgent):
    """
    Processes unstructured text (emails, call transcripts, notes)
    and syncs structured data to a CRM system.

    The BANT framework (Budget, Authority, Need, Timeline) is
    the gold standard for B2B lead qualification. We implement
    it as an LLM prompt.
    """

    # Product ACV range for budget fit calculation
    PRODUCT_MIN_ACV = 5_000    # $5k/year minimum
    PRODUCT_MAX_ACV = 500_000  # $500k/year maximum

    def run(
        self,
        text:       str,
        source:     str    = "email",  # email | call_transcript | form
        source_id:  str    = "unknown",
    ) -> WorkflowResult:
        """
        End-to-end: extract → qualify → sync.

        Args:
            text:       The raw text to process
            source:     Where this text came from
            source_id:  ID of the source record (email ID, call ID, etc.)
        """
        start   = time.time()
        actions = []
        output  = {}

        try:
            # ── Step 1: Extract entities ──────────────────
            log.info(f"Extracting entities from {source}: {source_id}")
            extracted = self._extract_entities(text, source)
            output["extracted"] = extracted.model_dump()
            actions.append(f"extracted entities: {extracted.contact.first_name} {extracted.contact.last_name} @ {extracted.contact.company_name}")

            # ── Step 2: Enrich ────────────────────────────
            enriched = self._enrich_company(extracted.contact.company_name or "")
            output["enriched"] = enriched
            if enriched.get("industry"):
                actions.append(f"enriched company: {enriched.get('industry')} / {enriched.get('employee_count', '?')} employees")

            # ── Step 3: Deduplication check ───────────────
            existing = self._check_duplicate(extracted.contact.email)
            if existing:
                output["existing_record"] = existing
                actions.append(f"found existing CRM record: {existing['id']} — will update")
            else:
                actions.append("no duplicate found — will create new record")

            # ── Step 4: Lead qualification (BANT) ────────
            lead_score = self._qualify_lead(extracted, enriched)
            output["lead_score"] = lead_score.model_dump()
            actions.append(f"qualified lead: {lead_score.score} ({lead_score.numeric}/100) — {lead_score.reasoning[:60]}...")

            # ── Step 5: CRM sync ──────────────────────────
            if lead_score.score != "DISQUALIFIED":
                sync_result = self._sync_to_crm(extracted, enriched, lead_score, existing)
                output["crm_sync"] = sync_result
                actions.append(f"synced to CRM: contact={sync_result.get('contact_id')}, deal={sync_result.get('deal_id')}")
            else:
                actions.append("lead disqualified — not syncing to CRM")

            return WorkflowResult(
                workflow_name = "crm_update",
                input_id      = source_id,
                status        = WorkflowStatus.SUCCESS,
                output        = output,
                actions_taken = actions,
                elapsed_ms    = int((time.time() - start) * 1000),
            )

        except Exception as e:
            return WorkflowResult(
                workflow_name = "crm_update",
                input_id      = source_id,
                status        = WorkflowStatus.FAILED,
                errors        = [str(e)],
                actions_taken = actions,
                elapsed_ms    = int((time.time() - start) * 1000),
            )

    def _extract_entities(self, text: str, source: str) -> ExtractedCRMData:
        """
        Extract structured contact and opportunity data from raw text.
        Uses JSON mode for reliable structured output.
        """
        system = """You are a CRM data extraction specialist.
Extract ALL available contact and opportunity information from the text.
Be conservative: only extract what is explicitly stated or clearly implied.
Do NOT invent or assume information.

Return JSON with this structure:
{
  "contact": {
    "first_name": string|null,
    "last_name": string|null,
    "email": string|null,
    "phone": string|null,
    "job_title": string|null,
    "company_name": string|null
  },
  "opportunity": {
    "product_interest": [list of strings],
    "budget_mentioned": string|null,
    "timeline": string|null,
    "use_case": string|null,
    "pain_points": [list of strings],
    "competitors": [list of strings],
    "team_size": integer|null
  },
  "confidence": float (0.0-1.0, how confident are you in the extraction)
}"""

        data = self._llm_json(system, f"Source: {source}\n\nText:\n{text[:3000]}")

        try:
            return ExtractedCRMData(**data)
        except Exception as e:
            log.warning(f"Extraction parse failed: {e}")
            return ExtractedCRMData(
                contact=ContactInfo(),
                opportunity=OpportunityInfo(),
                confidence=0.0,
            )

    def _enrich_company(self, company_name: str) -> dict:
        """
        Look up company firmographics.
        In production: call Clearbit, Apollo.io, or LinkedIn API.
        Here: simulates enrichment with realistic mock data.
        """
        if not company_name:
            return {}

        # Simulated enrichment response (replace with real API call)
        # In production: resp = clearbit.Company.find(name=company_name)
        mock_enrichment = {
            "name":           company_name,
            "domain":         f"{company_name.lower().replace(' ', '')}.com",
            "industry":       "Software / SaaS",
            "employee_count": 150,
            "estimated_arr":  "$5M-$20M",
            "headquarters":   "San Francisco, CA",
            "founded":        2018,
            "tech_stack":     ["AWS", "React", "PostgreSQL"],
        }

        log.info(json.dumps({"event": "company_enriched", "company": company_name}))
        return mock_enrichment

    def _check_duplicate(self, email: Optional[str]) -> Optional[dict]:
        """
        Check if a contact with this email already exists in CRM.
        In production: call Salesforce/HubSpot/Pipedrive API.
        Returns existing record or None.
        """
        if not email:
            return None

        # In production:
        # resp = requests.get(
        #     f"https://api.hubapi.com/crm/v3/objects/contacts/search",
        #     headers={"Authorization": f"Bearer {os.environ['HUBSPOT_API_KEY']}"},
        #     json={"filterGroups": [{"filters": [{"propertyName": "email", "operator": "EQ", "value": email}]}]}
        # )
        # return resp.json().get("results", [None])[0]

        # Simulated: 30% chance of finding existing record
        import random
        if hash(email) % 10 < 3:    # deterministic based on email content
            return {"id": f"CRM-{abs(hash(email)) % 100000}", "email": email}
        return None

    def _qualify_lead(
        self,
        extracted: ExtractedCRMData,
        enriched:  dict,
    ) -> LeadScore:
        """
        BANT qualification using LLM reasoning.
        BANT = Budget, Authority, Need, Timeline

        Why LLM for this and not pure logic?
        Because human language about budget/timeline is ambiguous:
        - "We have budget for this" = yes
        - "We need to check with finance" = maybe
        - "We're bootstrapped" = probably no for $50k ACV
        LLMs understand these nuances; if/else doesn't.
        """
        system = """You are a B2B sales qualification expert using the BANT framework.
Evaluate the lead and return a JSON qualification score.

Our product: B2B SaaS data analytics platform
Ideal Customer Profile: Tech companies, 50-5000 employees, $10k-$500k annual budget

BANT criteria:
- Budget: Can they afford us? ($10k-$500k/year)
- Authority: Is the contact a decision maker? (VP+, Director, C-suite, or says they are)
- Need: Do they have a clear problem our product solves?
- Timeline: Are they buying within 90 days?

Score: HOT (75-100), WARM (40-74), COLD (10-39), DISQUALIFIED (<10 or explicit disqualifier)

Return JSON:
{
  "score": "HOT|WARM|COLD|DISQUALIFIED",
  "numeric": integer 0-100,
  "budget_fit": "yes|no|unknown",
  "is_decision_maker": boolean,
  "has_clear_need": boolean,
  "timeline_defined": boolean,
  "reasoning": "one paragraph explanation"
}"""

        user = f"""Lead information:
Contact: {extracted.contact.model_dump_json(indent=2)}
Opportunity: {extracted.opportunity.model_dump_json(indent=2)}
Company Enrichment: {json.dumps(enriched, indent=2)}"""

        data = self._llm_json(system, user, temperature=0.0)

        try:
            return LeadScore(**data)
        except Exception:
            return LeadScore(
                score="COLD", numeric=20,
                budget_fit="unknown", is_decision_maker=False,
                has_clear_need=False, timeline_defined=False,
                reasoning="Qualification failed — defaulted to COLD"
            )

    def _sync_to_crm(
        self,
        extracted:  ExtractedCRMData,
        enriched:   dict,
        score:      LeadScore,
        existing:   Optional[dict],
    ) -> dict:
        """
        Sync the contact and deal to the CRM.
        In production: use HubSpot/Salesforce/Pipedrive REST API.
        """
        contact_payload = {
            "email":      extracted.contact.email,
            "firstname":  extracted.contact.first_name,
            "lastname":   extracted.contact.last_name,
            "jobtitle":   extracted.contact.job_title,
            "phone":      extracted.contact.phone,
            "company":    extracted.contact.company_name or enriched.get("name"),
            "industry":   enriched.get("industry"),
            "lead_score": score.numeric,
            "lead_grade": score.score,
        }

        if existing:
            # UPDATE existing contact
            # requests.patch(f"https://api.hubapi.com/crm/v3/objects/contacts/{existing['id']}", ...)
            contact_id = existing["id"]
            log.info(json.dumps({"event": "crm_contact_updated", "id": contact_id}))
        else:
            # CREATE new contact
            # requests.post("https://api.hubapi.com/crm/v3/objects/contacts", ...)
            contact_id = f"CRM-NEW-{int(time.time())}"
            log.info(json.dumps({"event": "crm_contact_created", "id": contact_id}))

        # Create a Deal if lead is WARM or HOT
        deal_id = None
        if score.score in ("HOT", "WARM"):
            deal_payload = {
                "dealname":   f"{extracted.contact.company_name} — {score.score} Lead",
                "pipeline":   "default",
                "dealstage":  "qualifiedtobuy" if score.score == "HOT" else "appointmentscheduled",
                "amount":     None,     # fill in after discovery call
                "closedate":  None,
                "description": extracted.opportunity.use_case,
            }
            deal_id = f"DEAL-{int(time.time())}"
            log.info(json.dumps({"event": "crm_deal_created", "id": deal_id, "score": score.score}))

        return {"contact_id": contact_id, "deal_id": deal_id}


# ── Demo ───────────────────────────────────────────────────
if __name__ == "__main__":
    agent = CRMUpdateAgent()

    sample_text = """Hi there,

My name is Jennifer Park, VP of Engineering at CloudFlow Inc.
I came across your analytics platform through a colleague's recommendation.

We're currently using Mixpanel but we're hitting limitations with our
custom data pipelines. We have about 200 engineers and our data team
processes roughly 50GB of events per day. We need better SQL access
and real-time dashboards for our executive team.

Budget-wise, we've allocated around $80,000 for this initiative and
we're looking to make a decision by end of Q1.

Could we schedule a demo for next week? My email is jennifer.park@cloudflow.io
and I can be reached at +1-415-555-0198.

Jennifer Park
VP Engineering, CloudFlow Inc."""

    print("=" * 65)
    print("  CRM UPDATE AGENT — DEMO RUN")
    print("=" * 65)

    result = agent.run(
        text      = sample_text,
        source    = "email",
        source_id = "email-demo-001",
    )
    result.log()

    print(f"\n✅ Status: {result.status.value}")
    print(f"\n📊 Lead Score: {result.output.get('lead_score', {}).get('score')} "
          f"({result.output.get('lead_score', {}).get('numeric')}/100)")
    print(f"   {result.output.get('lead_score', {}).get('reasoning', '')[:150]}...")
    print(f"\n📋 Actions taken:")
    for action in result.actions_taken:
        print(f"  ✓ {action}")
    print(f"\n⏱️  Elapsed: {result.elapsed_ms}ms")
```

---

## 4. Data Pipeline Agent

Traditional ETL pipelines are rigid — a schema change breaks everything. An **agentic ETL pipeline** can *understand* data, detect anomalies, fix formatting errors, and alert you to quality issues before bad data reaches your warehouse.

```
DATA PIPELINE AGENT — ARCHITECTURE:
════════════════════════════════════════════════════════════════

  Source Data (CSV / API / DB)
      │
      ▼
  ┌──────────────────────────────────────────────────────────┐
  │  STEP 1: FETCH & INSPECT                                │
  │  Load data → profile (types, nulls, distributions)     │
  │  Agent: "Are these columns what I expect?"              │
  └──────────────────────────────────┬───────────────────────┘
                                     │
                                     ▼
  ┌──────────────────────────────────────────────────────────┐
  │  STEP 2: VALIDATE                                        │
  │  Schema validation: column names, types, required fields│
  │  Business rules: price > 0, date not in future, etc.   │
  │  Agent: flags anomalies, suggests corrections           │
  └──────────────────────────────────┬───────────────────────┘
                                     │
                                     ▼
  ┌──────────────────────────────────────────────────────────┐
  │  STEP 3: TRANSFORM                                       │
  │  Normalize formats, deduplicate, fill nulls             │
  │  Agent: writes and executes transformation rules        │
  └──────────────────────────────────┬───────────────────────┘
                                     │
                                     ▼
  ┌──────────────────────────────────────────────────────────┐
  │  STEP 4: LOAD + REPORT                                   │
  │  Write to destination (DB, warehouse, S3)               │
  │  Generate data quality report                           │
  │  Alert on critical issues                               │
  └──────────────────────────────────────────────────────────┘
```

```python
# =========================================================
# FILE: agentic_workflows/data_pipeline_agent.py
# AI-powered ETL pipeline with schema validation + quality checks.
# pip install openai python-dotenv pandas pydantic
# =========================================================

import json
import time
import io
import csv
from dataclasses import dataclass
from typing import Any
import random

from shared.base import BaseWorkflowAgent, WorkflowResult, WorkflowStatus, log


@dataclass
class DataProfile:
    """Statistical profile of a dataset column."""
    name:         str
    dtype:        str
    null_count:   int
    null_pct:     float
    distinct:     int
    sample_values: list


class DataPipelineAgent(BaseWorkflowAgent):
    """
    An intelligent ETL pipeline agent.

    What makes it "agentic" vs traditional ETL:
    - It UNDERSTANDS the data semantically (not just structurally)
    - It can detect issues that regex-based validators miss:
      e.g., a real customer name "NULL" vs actual null value
      e.g., a date "2024-31-01" that's clearly day/month swapped
    - It generates human-readable quality reports
    - It suggests transformations rather than just failing
    """

    def run(
        self,
        data:          list[dict],
        pipeline_name: str,
        expected_schema: dict,
    ) -> WorkflowResult:
        """
        Run the full pipeline against a dataset.

        Args:
            data:            List of row dicts (e.g., from CSV or API)
            pipeline_name:   Name of this pipeline (for logging/alerting)
            expected_schema: Dict of {column_name: "type_description"}
                            e.g. {"email": "valid email address",
                                  "price": "positive number in USD",
                                  "date": "ISO 8601 date string"}
        """
        start   = time.time()
        actions = []
        output  = {}

        try:
            # ── Step 1: Profile the data ──────────────────
            log.info(f"Profiling dataset: {len(data)} rows")
            profiles = self._profile_data(data)
            output["profile"] = {p.name: {"null_pct": p.null_pct, "dtype": p.dtype} for p in profiles}
            actions.append(f"profiled {len(data)} rows × {len(profiles)} columns")

            # ── Step 2: Validate schema ───────────────────
            validation = self._validate_schema(data[:20], profiles, expected_schema)
            output["validation"] = validation
            issue_count = len(validation.get("issues", []))
            actions.append(f"validated schema: {issue_count} issues found")

            # ── Step 3: Fix common issues ─────────────────
            if validation.get("issues"):
                cleaned_data, fixes = self._auto_fix(data, validation["issues"])
                output["fixes_applied"] = fixes
                actions.append(f"auto-fixed {len(fixes)} issue types")
            else:
                cleaned_data = data
                actions.append("no auto-fixes needed — data looks clean")

            # ── Step 4: Generate quality report ──────────
            report = self._generate_quality_report(
                pipeline_name = pipeline_name,
                original_rows = len(data),
                cleaned_rows  = len(cleaned_data),
                validation    = validation,
                profiles      = profiles,
            )
            output["quality_report"] = report
            actions.append("generated data quality report")

            # ── Step 5: Load (simulate) ───────────────────
            if validation.get("critical_errors", []):
                # Critical errors: STOP the pipeline, do not load bad data
                output["load_skipped"] = True
                output["load_reason"]  = validation["critical_errors"]
                actions.append(f"⚠️ LOAD SKIPPED — {len(validation['critical_errors'])} critical errors")
            else:
                rows_loaded = self._load_to_destination(cleaned_data, pipeline_name)
                output["rows_loaded"] = rows_loaded
                actions.append(f"loaded {rows_loaded} rows to destination")

            return WorkflowResult(
                workflow_name = f"data_pipeline.{pipeline_name}",
                input_id      = f"batch-{int(time.time())}",
                status        = WorkflowStatus.SUCCESS,
                output        = output,
                actions_taken = actions,
                elapsed_ms    = int((time.time() - start) * 1000),
            )

        except Exception as e:
            return WorkflowResult(
                workflow_name = f"data_pipeline.{pipeline_name}",
                input_id      = f"batch-{int(time.time())}",
                status        = WorkflowStatus.FAILED,
                errors        = [str(e)],
                actions_taken = actions,
                elapsed_ms    = int((time.time() - start) * 1000),
            )

    def _profile_data(self, data: list[dict]) -> list[DataProfile]:
        """Profile each column: types, nulls, sample values. Pure Python, no LLM."""
        if not data:
            return []

        profiles = []
        columns  = data[0].keys()

        for col in columns:
            values       = [row.get(col) for row in data]
            null_count   = sum(1 for v in values if v is None or v == "" or str(v).strip().upper() == "NULL")
            non_null     = [v for v in values if v is not None and v != ""]
            distinct     = len(set(str(v) for v in non_null))

            # Infer type
            if all(self._is_numeric(v) for v in non_null[:20]):
                dtype = "numeric"
            elif all(self._is_date(v) for v in non_null[:20]):
                dtype = "date"
            else:
                dtype = "string"

            profiles.append(DataProfile(
                name         = col,
                dtype        = dtype,
                null_count   = null_count,
                null_pct     = null_count / len(data) if data else 0,
                distinct     = distinct,
                sample_values = non_null[:5],
            ))

        return profiles

    def _is_numeric(self, v: Any) -> bool:
        try:
            float(str(v).replace(",", "").replace("$", ""))
            return True
        except:
            return False

    def _is_date(self, v: Any) -> bool:
        from datetime import datetime
        for fmt in ["%Y-%m-%d", "%m/%d/%Y", "%d-%m-%Y", "%Y-%m-%dT%H:%M:%S"]:
            try:
                datetime.strptime(str(v), fmt)
                return True
            except:
                continue
        return False

    def _validate_schema(
        self,
        sample_data:     list[dict],
        profiles:        list[DataProfile],
        expected_schema: dict,
    ) -> dict:
        """
        Agent validates the data against expected schema.
        LLM understands semantic expectations, not just types.

        Example: expected {"price": "positive number in USD"}
        LLM will flag: -50.0, 0, "free", "N/A"
        A type-checker would only flag "free" and "N/A".
        """
        system = """You are a data quality expert. Analyze this dataset sample and schema.
Identify:
1. Schema mismatches (wrong types, missing required columns)
2. Data quality issues (nulls, format errors, outliers, semantic violations)
3. Critical errors that should BLOCK loading (data corruption, key constraint violations)
4. Suggestions for auto-fix (format normalization, null filling)

Return JSON:
{
  "issues": [
    {
      "column": string,
      "issue_type": "null|type_mismatch|format_error|semantic_error|outlier",
      "severity": "critical|warning|info",
      "description": string,
      "affected_rows": integer (estimate),
      "auto_fixable": boolean,
      "fix_suggestion": string|null
    }
  ],
  "critical_errors": [string],
  "overall_quality_score": integer 0-100,
  "summary": string
}"""

        profile_summary = [
            {"column": p.name, "dtype": p.dtype, "null_pct": f"{p.null_pct:.1%}",
             "samples": p.sample_values[:3]}
            for p in profiles
        ]

        user = f"""Expected Schema: {json.dumps(expected_schema, indent=2)}

Data Profile (all rows): {json.dumps(profile_summary, indent=2)}

Sample Rows (first 10):
{json.dumps(sample_data[:10], indent=2, default=str)}"""

        return self._llm_json(system, user, temperature=0.0, max_tokens=1200)

    def _auto_fix(
        self,
        data:   list[dict],
        issues: list[dict],
    ) -> tuple[list[dict], list[str]]:
        """
        Apply automatic fixes for fixable issues.
        Only touches rows with clear, safe transformations.
        Unfixable issues are left for human review.
        """
        data  = [row.copy() for row in data]    # don't mutate original
        fixes = []

        for issue in issues:
            if not issue.get("auto_fixable"):
                continue

            col  = issue.get("column")
            kind = issue.get("issue_type")

            if not col or col not in (data[0].keys() if data else []):
                continue

            if kind == "null":
                # Fill nulls with a sentinel value rather than deleting rows
                null_count = sum(
                    1 for r in data if r.get(col) is None or r.get(col) == ""
                )
                for row in data:
                    if row.get(col) is None or row.get(col) == "":
                        row[col] = "UNKNOWN"
                if null_count:
                    fixes.append(f"filled {null_count} nulls in '{col}' with 'UNKNOWN'")

            elif kind == "format_error":
                # Try to normalize date formats to ISO 8601
                from datetime import datetime
                fixed = 0
                for row in data:
                    val = str(row.get(col, ""))
                    for fmt in ["%m/%d/%Y", "%d-%m-%Y", "%d/%m/%Y"]:
                        try:
                            row[col] = datetime.strptime(val, fmt).strftime("%Y-%m-%d")
                            fixed += 1
                            break
                        except:
                            pass
                if fixed:
                    fixes.append(f"normalized {fixed} date formats in '{col}' to ISO 8601")

        return data, fixes

    def _generate_quality_report(
        self,
        pipeline_name: str,
        original_rows: int,
        cleaned_rows:  int,
        validation:    dict,
        profiles:      list[DataProfile],
    ) -> str:
        """Generate a human-readable quality report using the LLM."""
        system = """You are a data engineering lead writing a data quality report.
Write a concise, professional report (under 200 words).
Use bullet points. Include: overall health, key issues, recommendations."""

        user = f"""Pipeline: {pipeline_name}
Rows processed: {original_rows} (cleaned: {cleaned_rows})
Quality score: {validation.get('overall_quality_score', 'N/A')}/100
Issues found: {len(validation.get('issues', []))}
Critical errors: {len(validation.get('critical_errors', []))}

Top issues:
{json.dumps(validation.get('issues', [])[:5], indent=2)}

Column profiles:
{json.dumps([{"name": p.name, "null_pct": f"{p.null_pct:.1%}"} for p in profiles], indent=2)}"""

        return self._llm(system, user, temperature=0.2, max_tokens=300)

    def _load_to_destination(self, data: list[dict], pipeline_name: str) -> int:
        """
        Load clean data to the destination.
        In production: write to BigQuery, Snowflake, PostgreSQL, or S3.
        """
        # In production:
        # db.executemany("INSERT INTO table (...) VALUES (...)", data)
        # OR: pd.DataFrame(data).to_gbq("dataset.table", project_id=...)
        log.info(json.dumps({
            "event":         "pipeline_load_complete",
            "pipeline":      pipeline_name,
            "rows":          len(data),
        }))
        return len(data)


# ── Demo ───────────────────────────────────────────────────
if __name__ == "__main__":
    agent = DataPipelineAgent()

    # Simulate a messy marketing events dataset
    sample_data = [
        {"user_id": "u001", "event":  "purchase", "amount": "$49.99",  "date": "01/15/2024", "email": "alice@example.com"},
        {"user_id": "u002", "event":  "signup",   "amount": "0",       "date": "2024-01-16",   "email": "bob@example.com"},
        {"user_id": "u003", "event":  "purchase", "amount": "-15.00",  "date": "2024-01-16",   "email": "bad-email"},
        {"user_id": "u004", "event":  "purchase", "amount": "199.00",  "date": "31/01/2024",   "email": "diana@example.com"},
        {"user_id": "",     "event":  "refund",   "amount": "49.99",   "date": "2024-01-17",   "email": ""},
        {"user_id": "u006", "event":  "purchase", "amount": "9999999", "date": "2024-01-17",   "email": "frank@example.com"},
    ]

    expected_schema = {
        "user_id": "non-empty unique user identifier string",
        "event":   "one of: purchase, signup, refund, view",
        "amount":  "positive number in USD, no currency symbols",
        "date":    "ISO 8601 date string (YYYY-MM-DD)",
        "email":   "valid email address, non-empty",
    }

    print("=" * 65)
    print("  DATA PIPELINE AGENT — DEMO RUN")
    print("=" * 65)

    result = agent.run(
        data             = sample_data,
        pipeline_name    = "marketing_events",
        expected_schema  = expected_schema,
    )
    result.log()

    print(f"\n✅ Status: {result.status.value}")
    print(f"\n📊 Quality Score: {result.output.get('validation', {}).get('overall_quality_score', 'N/A')}/100")
    print(f"\n📋 Actions taken:")
    for action in result.actions_taken:
        print(f"  ✓ {action}")
    print(f"\n📝 Quality Report:\n{result.output.get('quality_report', 'N/A')}")
    print(f"\n⏱️  Elapsed: {result.elapsed_ms}ms")
```

---

## 5. Code Review Bot

The **Code Review Bot** runs on every pull request. It combines static analysis (AST parsing — no LLM needed for finding undefined variables) with LLM-powered semantic review (architectural concerns, security patterns, logic bugs). The combination catches what each alone would miss.

```
CODE REVIEW BOT — ANALYSIS PIPELINE:
════════════════════════════════════════════════════════════════

  Pull Request opened/updated
      │
      ▼
  ┌───────────────────────────────────────────────────────┐
  │  STEP 1: STATIC ANALYSIS (AST — no LLM, fast)        │
  │  - Syntax errors                                      │
  │  - Unused imports                                     │
  │  - Complexity metrics (cyclomatic complexity)         │
  │  - Security: hardcoded secrets, unsafe eval()         │
  │  - Type annotation coverage                           │
  └──────────────────────────────┬────────────────────────┘
                                 │
                                 ▼
  ┌───────────────────────────────────────────────────────┐
  │  STEP 2: LLM SEMANTIC REVIEW                          │
  │  - Logic correctness (does it do what it claims?)     │
  │  - Edge cases and off-by-one errors                   │
  │  - Performance anti-patterns                          │
  │  - Architectural concerns (violates patterns?)        │
  │  - Missing error handling                             │
  │  - Documentation gaps                                 │
  └──────────────────────────────┬────────────────────────┘
                                 │
                                 ▼
  ┌───────────────────────────────────────────────────────┐
  │  STEP 3: PR COMMENT GENERATION                        │
  │  - Grouped by severity: 🚨 Critical, ⚠️ Warning, 💡 Info │
  │  - Line-specific comments (GitHub diff format)        │
  │  - Overall verdict: APPROVE / REQUEST_CHANGES / COMMENT│
  └───────────────────────────────────────────────────────┘

  RULES OF ENGAGEMENT:
  - Suggest, never block on stylistic issues
  - Only block (REQUEST_CHANGES) on security or critical logic bugs
  - Praise good code too — not just complaints
  - One comment per issue — no repetition
```

```python
# =========================================================
# FILE: agentic_workflows/code_review_bot.py
# Automated code review: static analysis + LLM semantic review.
# pip install openai python-dotenv pydantic
# =========================================================

import ast
import json
import time
import re
from dataclasses import dataclass
from typing import Optional

from shared.base import BaseWorkflowAgent, WorkflowResult, WorkflowStatus, log


@dataclass
class StaticIssue:
    """An issue found by the static analyzer."""
    line:        Optional[int]
    severity:    str           # critical | warning | info
    category:    str           # security | complexity | style | bug
    message:     str
    suggestion:  Optional[str] = None


class CodeReviewBot(BaseWorkflowAgent):
    """
    Automated code review agent for Python pull requests.

    Two-layer analysis:
    1. AST static analysis: fast, deterministic, finds structural issues
    2. LLM semantic review: slower, but catches logic and design issues

    Verdict:
    - APPROVE:          no issues or only minor suggestions
    - REQUEST_CHANGES:  security issues or critical bugs
    - COMMENT:          warnings that need author awareness
    """

    MAX_COMPLEXITY = 10     # McCabe cyclomatic complexity threshold
    MAX_FILE_LINES = 500    # flag files over this length

    def run(
        self,
        code:         str,
        filename:     str,
        pr_title:     str,
        pr_description: str = "",
    ) -> WorkflowResult:
        """
        Review a single file from a PR.

        Args:
            code:           Python source code as a string
            filename:       File name (used in comments)
            pr_title:       PR title for context
            pr_description: PR description for context

        Returns:
            WorkflowResult with review comments and verdict
        """
        start   = time.time()
        actions = []
        output  = {}

        try:
            # ── Step 1: Parse the AST ──────────────────
            try:
                tree = ast.parse(code)
                actions.append("parsed AST successfully")
            except SyntaxError as e:
                # Syntax error → immediate REQUEST_CHANGES, skip further analysis
                return WorkflowResult(
                    workflow_name = "code_review",
                    input_id      = filename,
                    status        = WorkflowStatus.SUCCESS,
                    output        = {
                        "verdict":  "REQUEST_CHANGES",
                        "comments": [f"🚨 **Syntax Error** on line {e.lineno}: {e.msg}"],
                        "static_issues": 1,
                    },
                    actions_taken = [f"syntax error found on line {e.lineno} — review blocked"],
                    elapsed_ms    = int((time.time() - start) * 1000),
                )

            # ── Step 2: Static Analysis ────────────────
            static_issues = self._static_analysis(code, tree)
            output["static_issues"] = [
                {"line": i.line, "severity": i.severity, "category": i.category, "message": i.message}
                for i in static_issues
            ]
            actions.append(f"static analysis: {len(static_issues)} issues ({sum(1 for i in static_issues if i.severity == 'critical')} critical)")

            # ── Step 3: LLM Semantic Review ────────────
            semantic_review = self._semantic_review(code, filename, pr_title, pr_description)
            output["semantic_review"] = semantic_review
            actions.append(f"LLM review: {len(semantic_review.get('issues', []))} issues, verdict: {semantic_review.get('verdict')}")

            # ── Step 4: Generate PR comments ──────────
            comments = self._format_pr_comments(static_issues, semantic_review, filename)
            output["comments"]         = comments
            output["verdict"]          = self._determine_verdict(static_issues, semantic_review)
            output["summary"]          = semantic_review.get("summary", "Review complete.")
            output["praise"]           = semantic_review.get("praise", "")
            actions.append(f"generated {len(comments)} PR comments, verdict: {output['verdict']}")

            return WorkflowResult(
                workflow_name = "code_review",
                input_id      = filename,
                status        = WorkflowStatus.SUCCESS,
                output        = output,
                actions_taken = actions,
                elapsed_ms    = int((time.time() - start) * 1000),
            )

        except Exception as e:
            return WorkflowResult(
                workflow_name = "code_review",
                input_id      = filename,
                status        = WorkflowStatus.FAILED,
                errors        = [str(e)],
                actions_taken = actions,
                elapsed_ms    = int((time.time() - start) * 1000),
            )

    def _static_analysis(self, code: str, tree: ast.AST) -> list[StaticIssue]:
        """
        AST-based static analysis. No LLM needed — fast and deterministic.
        Catches: unused imports, hardcoded secrets, complexity, bare excepts.
        """
        issues = []

        # ── Check 1: Hardcoded secrets ─────────────────
        # Common secret patterns: API keys, passwords, tokens in assignments
        secret_patterns = [
            r'(?i)(api_key|secret|password|token|passwd)\s*=\s*["\'][^"\']{8,}["\']',
            r'(?i)(AWS_ACCESS_KEY|AWS_SECRET)',
            r'sk-[a-zA-Z0-9]{32,}',    # OpenAI key pattern
        ]
        for i, line in enumerate(code.splitlines(), 1):
            for pattern in secret_patterns:
                if re.search(pattern, line) and "#" not in line.split("=")[0]:
                    issues.append(StaticIssue(
                        line       = i,
                        severity   = "critical",
                        category   = "security",
                        message    = f"Potential hardcoded secret detected",
                        suggestion = "Use environment variables: os.environ.get('SECRET_NAME')"
                    ))
                    break

        # ── Check 2: Bare except clauses ──────────────
        # bare `except:` catches KeyboardInterrupt, SystemExit — very bad practice
        for node in ast.walk(tree):
            if isinstance(node, ast.ExceptHandler) and node.type is None:
                issues.append(StaticIssue(
                    line       = node.lineno,
                    severity   = "warning",
                    category   = "bug",
                    message    = "Bare `except:` clause catches all exceptions including KeyboardInterrupt",
                    suggestion = "Specify exception type: `except Exception as e:`"
                ))

        # ── Check 3: Unsafe eval() usage ──────────────
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name) and node.func.id == "eval":
                    issues.append(StaticIssue(
                        line      = node.lineno,
                        severity  = "critical",
                        category  = "security",
                        message   = "`eval()` is a code injection risk",
                        suggestion = "Use ast.literal_eval() for safe literal parsing"
                    ))

        # ── Check 4: Function complexity ──────────────
        # Cyclomatic complexity = branches + 1
        # High complexity → hard to test, prone to bugs
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                complexity = 1 + sum(
                    1 for n in ast.walk(node)
                    if isinstance(n, (ast.If, ast.While, ast.For, ast.ExceptHandler,
                                      ast.With, ast.Assert, ast.comprehension))
                )
                if complexity > self.MAX_COMPLEXITY:
                    issues.append(StaticIssue(
                        line      = node.lineno,
                        severity  = "warning",
                        category  = "complexity",
                        message   = f"Function `{node.name}` has cyclomatic complexity {complexity} (threshold: {self.MAX_COMPLEXITY})",
                        suggestion = "Consider splitting into smaller functions"
                    ))

        # ── Check 5: Missing type annotations ─────────
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                unannotated_args = [
                    a.arg for a in node.args.args
                    if a.annotation is None and a.arg != "self"
                ]
                if unannotated_args and node.returns is None:
                    issues.append(StaticIssue(
                        line      = node.lineno,
                        severity  = "info",
                        category  = "style",
                        message   = f"Function `{node.name}` missing type annotations for: {unannotated_args}",
                        suggestion = "Add type hints for better IDE support and documentation"
                    ))

        return issues

    def _semantic_review(
        self,
        code:           str,
        filename:       str,
        pr_title:       str,
        pr_description: str,
    ) -> dict:
        """
        LLM-powered semantic review.
        Catches: logic bugs, edge cases, missing error handling, design issues.
        This is what a senior engineer would catch in a human review.
        """
        system = """You are a senior software engineer doing a careful code review.
Your job is to catch real bugs and improvements — not nitpick style.

Focus on:
1. Correctness: Will this code do what it's supposed to do?
2. Edge cases: What inputs could break this? (empty lists, None, 0, negatives)
3. Error handling: What happens when external calls fail?
4. Security: Any injection risks, data exposure, or privilege escalation?
5. Performance: Any obvious O(n²) loops or N+1 query patterns?
6. Maintainability: Is it clear what this code does?

Return JSON:
{
  "issues": [
    {
      "line": integer|null,
      "severity": "critical|warning|suggestion",
      "category": "logic|security|performance|error_handling|clarity",
      "comment": "specific, actionable comment",
      "suggestion": "concrete fix or approach"
    }
  ],
  "praise": "1-2 sentences about what's done well (be genuine)",
  "verdict": "APPROVE|COMMENT|REQUEST_CHANGES",
  "summary": "2-3 sentence overall assessment"
}

Rules:
- Only include REQUEST_CHANGES for actual bugs or security issues
- Be specific — no vague comments like "improve error handling"
- If the code is clean, say so — don't invent issues
- Max 8 issues — quality over quantity"""

        user = f"""PR Title: {pr_title}
PR Description: {pr_description or 'No description provided.'}

File: {filename}
```python
{code[:4000]}
```"""

        return self._llm_json(system, user, temperature=0.1, max_tokens=1500)

    def _format_pr_comments(
        self,
        static_issues:   list[StaticIssue],
        semantic_review: dict,
        filename:        str,
    ) -> list[str]:
        """Format all issues into readable PR comment strings."""
        comments = []

        severity_emoji = {
            "critical": "🚨",
            "warning":  "⚠️",
            "info":     "💡",
            "suggestion": "💡",
        }

        # Static issues
        for issue in static_issues:
            emoji  = severity_emoji.get(issue.severity, "•")
            line   = f" (line {issue.line})" if issue.line else ""
            comment = f"{emoji} **[{issue.category.upper()}]{line}** {issue.message}"
            if issue.suggestion:
                comment += f"\n   → {issue.suggestion}"
            comments.append(comment)

        # Semantic issues
        for issue in semantic_review.get("issues", []):
            emoji  = severity_emoji.get(issue.get("severity", "info"), "•")
            line   = f" (line {issue['line']})" if issue.get("line") else ""
            comment = f"{emoji} **[{issue.get('category', 'review').upper()}{line}]** {issue.get('comment', '')}"
            if issue.get("suggestion"):
                comment += f"\n   → {issue['suggestion']}"
            comments.append(comment)

        return comments

    def _determine_verdict(
        self,
        static_issues:   list[StaticIssue],
        semantic_review: dict,
    ) -> str:
        """
        Final verdict: APPROVE / REQUEST_CHANGES / COMMENT

        Logic:
        - Any critical static issue → REQUEST_CHANGES
        - Semantic verdict REQUEST_CHANGES → REQUEST_CHANGES
        - Any warnings → COMMENT
        - Otherwise → APPROVE
        """
        has_critical_static = any(i.severity == "critical" for i in static_issues)
        semantic_verdict     = semantic_review.get("verdict", "APPROVE")

        if has_critical_static or semantic_verdict == "REQUEST_CHANGES":
            return "REQUEST_CHANGES"
        elif static_issues or semantic_review.get("issues"):
            return "COMMENT"
        else:
            return "APPROVE"


# ── Demo ───────────────────────────────────────────────────
if __name__ == "__main__":
    bot = CodeReviewBot()

    # Intentionally buggy code for the demo
    code_to_review = '''
import os
import json

# Hardcoded secret — should use env var
api_key = "sk-prod-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"

def process_user_data(user_id, data=None):
    """Process user data from the API."""
    try:
        result = eval(data)  # dangerous! code injection risk
        users = get_all_users()
        for user in users:
            if user["id"] == user_id:
                for item in result:
                    if item["active"]:
                        for sub in item["subscriptions"]:
                            if sub["status"] == "paid":
                                db.update(user_id, sub)
        return result
    except:
        pass


def get_all_users():
    return db.query("SELECT * FROM users")
'''

    result = bot.run(
        code            = code_to_review,
        filename        = "user_service.py",
        pr_title        = "Add user subscription processing",
        pr_description  = "Processes subscription data from external API",
    )
    result.log()

    print("=" * 65)
    print("  CODE REVIEW BOT — DEMO RUN")
    print("=" * 65)
    print(f"\n📁 File: user_service.py")
    print(f"🏛️  Verdict: {result.output.get('verdict')}")
    print(f"\n📝 Summary: {result.output.get('summary', 'N/A')}")
    if result.output.get("praise"):
        print(f"\n👏 Praise: {result.output.get('praise')}")
    print(f"\n💬 Comments ({len(result.output.get('comments', []))}):")
    for comment in result.output.get("comments", []):
        print(f"\n  {comment}")
    print(f"\n⏱️  Elapsed: {result.elapsed_ms}ms")
```

---

## 6. Triggers and Scheduling

All four agents above need to be triggered somehow. Let's look at the three main patterns.

```
TRIGGER PATTERNS:
════════════════════════════════════════════════════════════════

  1. CRON (time-based)
  ─────────────────────────────────────────────────────────
  "Run the data pipeline every night at 2am"
  "Check the email inbox every 5 minutes"

  Use: APScheduler, cron service in container, system cron

  2. WEBHOOK (event-triggered, real-time)
  ─────────────────────────────────────────────────────────
  "Run code review when a PR is opened on GitHub"
  "Run CRM update when a form is submitted"

  Use: FastAPI endpoint receiving webhook payload from GitHub/Stripe/etc.

  3. MESSAGE QUEUE (decoupled, scalable)
  ─────────────────────────────────────────────────────────
  "Process items from an email queue at controlled rate"
  "Multiple agents processing jobs in parallel"

  Use: Redis Queue, Celery, AWS SQS

  ┌────────────┐   ┌───────────────┐   ┌──────────────┐
  │  CRON      │   │  WEBHOOK      │   │  QUEUE       │
  │  scheduler │   │  FastAPI      │   │  Redis/SQS   │
  │  ↓         │   │  endpoint     │   │  ↓           │
  │  runs      │   │  ↓            │   │  workers     │
  │  every N   │   │  immediate    │   │  consume     │
  │  minutes   │   │  on event     │   │  at own pace │
  └────────────┘   └───────────────┘   └──────────────┘
  Best for:        Best for:           Best for:
  ETL, reports     Code review,        High volume,
  batch emails     CRM updates         email triage
```

```python
# =========================================================
# FILE: agentic_workflows/triggers.py
# Scheduling and webhook trigger patterns for agentic workflows.
# pip install apscheduler fastapi uvicorn
# =========================================================

import json
import time
import asyncio
from datetime import datetime
from typing import Any

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import hmac
import hashlib


# ══════════════════════════════════════════════════════════
# PATTERN 1: CRON SCHEDULER
# ══════════════════════════════════════════════════════════

class WorkflowScheduler:
    """
    APScheduler-based cron for recurring agentic workflows.
    Runs in-process — no separate scheduler service needed.
    For production: replace with Celery Beat or AWS EventBridge.
    """

    def __init__(self):
        # AsyncIOScheduler: compatible with FastAPI's async event loop
        self.scheduler = AsyncIOScheduler()

    def add_job(self, fn, cron_expr: str, name: str, **kwargs) -> None:
        """
        Add a workflow function to the schedule.

        Args:
            fn:        Async function to run (the workflow)
            cron_expr: Cron expression, e.g. "0 2 * * *" = daily at 2am
            name:      Job name for logging
        """
        self.scheduler.add_job(
            func          = fn,
            trigger       = CronTrigger.from_crontab(cron_expr),
            id            = name,
            name          = name,
            replace_existing = True,
            kwargs        = kwargs,
        )
        print(f"  📅 Scheduled [{name}] → '{cron_expr}'")

    def start(self):
        self.scheduler.start()
        print("  ✅ Workflow scheduler started")

    def stop(self):
        self.scheduler.shutdown()


# Example: schedule the data pipeline agent
async def run_daily_etl():
    """
    Called by the scheduler every night at 2am.
    Fetches data from source and runs the pipeline.
    """
    from data_pipeline_agent import DataPipelineAgent
    agent = DataPipelineAgent()

    # In production: fetch from real source (API, S3, DB)
    data = fetch_todays_events()    # your data fetch function

    result = agent.run(
        data             = data,
        pipeline_name    = "nightly_events",
        expected_schema  = {
            "user_id": "non-empty string",
            "event":   "string action name",
            "amount":  "positive number",
        }
    )
    result.log()

    if result.status.value == "failed":
        # Alert on failure — PagerDuty, Slack, email
        send_alert(f"⚠️ Nightly ETL pipeline failed: {result.errors}")


def fetch_todays_events():
    """Stub — replace with real data fetch."""
    return [{"user_id": "u1", "event": "purchase", "amount": 49.99}]

def send_alert(message: str):
    """Stub — replace with Slack/PagerDuty call."""
    print(f"ALERT: {message}")


# ══════════════════════════════════════════════════════════
# PATTERN 2: WEBHOOK TRIGGERS
# ══════════════════════════════════════════════════════════

app = FastAPI()

def verify_github_signature(payload: bytes, signature: str, secret: str) -> bool:
    """
    Verify that a webhook actually came from GitHub.
    ALWAYS verify webhook signatures — anyone can POST to your endpoint.
    GitHub signs the payload with your webhook secret using HMAC-SHA256.
    """
    expected = "sha256=" + hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    # Use constant-time comparison to prevent timing attacks
    return hmac.compare_digest(expected, signature)


@app.post("/webhooks/github/pull-request")
async def github_pr_webhook(request: Request):
    """
    GitHub webhook endpoint for pull request events.
    GitHub sends a POST here whenever a PR is opened, updated, or closed.

    Setup in GitHub repo:
    Settings → Webhooks → Add webhook
    Payload URL: https://yourserver.com/webhooks/github/pull-request
    Content type: application/json
    Events: Pull requests
    """
    # ── Verify this is really from GitHub ────────────────
    signature = request.headers.get("X-Hub-Signature-256", "")
    body      = await request.body()

    if not verify_github_signature(body, signature, secret="your-webhook-secret"):
        raise HTTPException(status_code=403, detail="Invalid webhook signature")

    payload    = json.loads(body)
    action     = payload.get("action")               # opened, synchronize, closed
    pr         = payload.get("pull_request", {})
    pr_number  = pr.get("number")
    pr_title   = pr.get("title", "")
    pr_body    = pr.get("body", "")

    # Only review when a PR is opened or new commits pushed
    if action not in ("opened", "synchronize"):
        return JSONResponse({"status": "ignored", "action": action})

    # Run the code review agent asynchronously
    # Use asyncio.create_task to return immediately without blocking the webhook
    asyncio.create_task(
        run_code_review_for_pr(pr_number, pr_title, pr_body, payload)
    )

    # Respond quickly to GitHub (must respond within 10 seconds)
    return JSONResponse({"status": "accepted", "pr": pr_number})


async def run_code_review_for_pr(
    pr_number:  int,
    pr_title:   str,
    pr_body:    str,
    payload:    dict,
) -> None:
    """
    Fetch changed files and run the code review bot.
    In production: use PyGitHub or GitHub REST API to get diff.
    """
    from code_review_bot import CodeReviewBot
    bot = CodeReviewBot()

    # In production: fetch actual changed files from GitHub API
    # files = github.get_pull(pr_number).get_files()
    # for file in files:
    #     result = bot.run(file.decoded_content.decode(), file.filename, pr_title, pr_body)
    #     post_review_comment(pr_number, result)

    print(f"  🔍 Running code review for PR #{pr_number}: {pr_title}")


@app.post("/webhooks/email-provider")
async def email_webhook(request: Request):
    """
    Webhook from your email provider (SendGrid Inbound Parse, Postmark, etc.)
    Called in real-time when a new email arrives.
    Much faster than polling IMAP every N minutes.
    """
    body = await request.json()

    from email_triage_agent import EmailTriageAgent, Email
    agent = EmailTriageAgent()

    email = Email(
        id      = body.get("message_id", str(time.time())),
        from_   = body.get("from", ""),
        subject = body.get("subject", ""),
        body    = body.get("text", body.get("html", "")),
        date    = body.get("date", datetime.utcnow().isoformat()),
    )

    # Run triage in background — respond immediately to webhook
    asyncio.create_task(run_email_triage(agent, email))
    return JSONResponse({"status": "accepted", "email_id": email.id})


async def run_email_triage(agent, email):
    """Background task for email triage."""
    result = agent.run(email)
    result.log()
```

---

## 7. Retry Logic and Idempotency

Production workflows fail. The LLM API times out. The CRM webhook drops a packet. A database lock blocks your write. **Retry logic** gets you back on track. **Idempotency** ensures you never process the same item twice.

```
RETRY PATTERNS:
════════════════════════════════════════════════════════════════

  WITHOUT retries:           WITH exponential backoff:
  ─────────────────          ─────────────────────────
  Attempt 1: fails           Attempt 1: fails
  → WORKFLOW FAILED          Wait 1 second
                             Attempt 2: fails
                             Wait 2 seconds
  IDEMPOTENCY PROBLEM:       Attempt 3: fails
  ─────────────────          Wait 4 seconds
  Agent processes email001   Attempt 4: succeeds ✓
  → crash before marking done
  → restart → processes email001 AGAIN  IDEMPOTENCY KEY:
  → creates duplicate ticket            ─────────────────
  → sends duplicate reply               Before processing:
                                          if already_processed(id):
                                            return SKIPPED
                                        After success:
                                          mark_as_processed(id)
```

```python
# =========================================================
# FILE: agentic_workflows/retry_idempotency.py
# Production-grade retry logic with exponential backoff + idempotency.
# pip install python-dotenv
# =========================================================

import time
import functools
import json
import sqlite3
import hashlib
from typing import Callable, TypeVar, Any, Optional

from shared.base import WorkflowStatus, log


# ══════════════════════════════════════════════════════════
# RETRY WITH EXPONENTIAL BACKOFF
# ══════════════════════════════════════════════════════════

def retry(
    max_attempts:     int   = 3,
    initial_delay_s:  float = 1.0,
    backoff_factor:   float = 2.0,
    max_delay_s:      float = 60.0,
    exceptions:       tuple = (Exception,),
):
    """
    Decorator: retry a function on failure with exponential backoff.

    Exponential backoff prevents "thundering herd" — if 1000 workers
    all retry at the same time, they hammer the API and all fail again.
    With backoff, they spread out their retries over time.

    Args:
        max_attempts:    How many times to try total (including first attempt)
        initial_delay_s: Wait time before first retry
        backoff_factor:  Multiply delay by this after each failure
        max_delay_s:     Never wait longer than this
        exceptions:      Which exception types to retry on

    Usage:
        @retry(max_attempts=4, initial_delay_s=2.0)
        def call_crm_api():
            return requests.post(...)
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            delay      = initial_delay_s
            last_error = None

            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)

                except exceptions as e:
                    last_error = e

                    if attempt == max_attempts:
                        log.error(json.dumps({
                            "event":   "retry_exhausted",
                            "fn":      func.__name__,
                            "attempts": max_attempts,
                            "error":   str(e),
                        }))
                        raise   # re-raise after all retries exhausted

                    # Calculate next wait time (with jitter to spread retries)
                    import random
                    jitter     = random.uniform(0, 0.1 * delay)
                    sleep_time = min(delay + jitter, max_delay_s)

                    log.warning(json.dumps({
                        "event":   "retry_attempt",
                        "fn":      func.__name__,
                        "attempt": attempt,
                        "delay_s": round(sleep_time, 2),
                        "error":   str(e),
                    }))

                    time.sleep(sleep_time)
                    delay *= backoff_factor   # exponential: 1s → 2s → 4s → 8s...

        return wrapper
    return decorator


# Example usage:
@retry(max_attempts=4, initial_delay_s=1.0, backoff_factor=2.0)
def call_crm_api_with_retry(payload: dict) -> dict:
    """
    Wrapped CRM API call that retries on failure.
    With max_attempts=4 and initial_delay=1s: waits 1s, 2s, 4s before giving up.
    Total max wait: 7 seconds.
    """
    import requests
    resp = requests.post("https://api.your-crm.com/contacts", json=payload, timeout=10)
    resp.raise_for_status()   # raises requests.HTTPError on 4xx/5xx
    return resp.json()


# ══════════════════════════════════════════════════════════
# IDEMPOTENCY STORE
# ══════════════════════════════════════════════════════════

class IdempotencyStore:
    """
    SQLite-backed idempotency store.
    Tracks which input IDs have been successfully processed.
    Prevents duplicate processing when workflows are retried.

    In production: use Redis with TTL for automatic expiry.
    Redis command: SET idempotency:{key} "processed" EX 86400
    (expires after 24 hours — adjust to your needs)
    """

    def __init__(self, db_path: str = "idempotency.db"):
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self._init()

    def _init(self):
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS processed_ids (
                id          TEXT PRIMARY KEY,
                workflow    TEXT NOT NULL,
                processed_at REAL NOT NULL,
                result_hash  TEXT
            )
        """)
        self.conn.commit()

    def is_processed(self, workflow: str, input_id: str) -> bool:
        """
        Check if this input was already successfully processed.
        Returns True if processed → caller should skip.
        """
        row = self.conn.execute(
            "SELECT id FROM processed_ids WHERE id = ? AND workflow = ?",
            (input_id, workflow)
        ).fetchone()
        return row is not None

    def mark_processed(
        self,
        workflow:  str,
        input_id:  str,
        result:    Optional[dict] = None,
    ) -> None:
        """
        Mark an input as successfully processed.
        Call this AFTER the workflow completes successfully.
        (Not before — if the workflow crashes, it should re-run)
        """
        result_hash = hashlib.md5(
            json.dumps(result or {}, sort_keys=True).encode()
        ).hexdigest() if result else None

        self.conn.execute(
            "INSERT OR REPLACE INTO processed_ids (id, workflow, processed_at, result_hash) VALUES (?, ?, ?, ?)",
            (input_id, workflow, time.time(), result_hash)
        )
        self.conn.commit()


# ── Idempotent workflow runner ─────────────────────────────

# Global idempotency store (shared across all workflows)
_idempotency_store = IdempotencyStore()


def idempotent_run(workflow_fn, workflow_name: str, input_id: str, **kwargs):
    """
    Wrapper that makes any workflow idempotent.

    Usage:
        result = idempotent_run(
            workflow_fn   = email_agent.run,
            workflow_name = "email_triage",
            input_id      = email.id,
            email         = email,
        )

    If email.id was already processed → returns SKIPPED result.
    Otherwise: runs the workflow, marks as processed, returns result.
    """
    from shared.base import WorkflowResult

    # Check idempotency FIRST
    if _idempotency_store.is_processed(workflow_name, input_id):
        log.info(json.dumps({
            "event":    "workflow_skipped_idempotent",
            "workflow": workflow_name,
            "input_id": input_id,
        }))
        return WorkflowResult(
            workflow_name = workflow_name,
            input_id      = input_id,
            status        = WorkflowStatus.SKIPPED,
            output        = {},
            actions_taken = ["skipped — already processed"],
        )

    # Run the workflow
    result = workflow_fn(**kwargs)

    # Mark as processed ONLY on success
    if result.status == WorkflowStatus.SUCCESS:
        _idempotency_store.mark_processed(
            workflow  = workflow_name,
            input_id  = input_id,
            result    = result.output,
        )

    return result
```

---

## 8. Workflow Observability

You can't improve what you can't measure. Every production agentic workflow needs structured logging, cost tracking, and alerting.

```python
# =========================================================
# FILE: agentic_workflows/observability.py
# Metrics, cost tracking, and alerting for agentic workflows.
# pip install openai
# =========================================================

import json
import time
import os
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

from shared.base import WorkflowResult, WorkflowStatus, log


# ── Token Cost Tracker ──────────────────────────────────────

# OpenAI pricing as of early 2024 (update as needed)
# Price per 1,000 tokens
MODEL_COSTS = {
    "gpt-4o":       {"input": 0.005,   "output": 0.015},    # $5/$15 per 1M tokens
    "gpt-4o-mini":  {"input": 0.00015, "output": 0.0006},   # $0.15/$0.60 per 1M tokens
    "gpt-4-turbo":  {"input": 0.01,    "output": 0.03},
}


def estimate_cost_usd(
    model:         str,
    input_tokens:  int,
    output_tokens: int,
) -> float:
    """
    Estimate LLM API cost for a single call.
    Use this to track spending per workflow run and alert on budget overruns.
    """
    costs = MODEL_COSTS.get(model, MODEL_COSTS["gpt-4o-mini"])
    return (
        input_tokens  / 1_000 * costs["input"] +
        output_tokens / 1_000 * costs["output"]
    )


@dataclass
class WorkflowMetrics:
    """Aggregated metrics for all workflow runs."""

    total_runs:       int   = 0
    successful:       int   = 0
    failed:           int   = 0
    skipped:          int   = 0
    total_elapsed_ms: int   = 0
    total_cost_usd:   float = 0.0
    runs_by_workflow: dict  = field(default_factory=lambda: defaultdict(int))
    failures_by_workflow: dict = field(default_factory=lambda: defaultdict(int))

    @property
    def success_rate(self) -> float:
        if self.total_runs == 0:
            return 0.0
        return self.successful / self.total_runs

    @property
    def avg_elapsed_ms(self) -> float:
        if self.total_runs == 0:
            return 0.0
        return self.total_elapsed_ms / self.total_runs

    def record(self, result: WorkflowResult, cost_usd: float = 0.0) -> None:
        """Record a workflow result into the metrics."""
        self.total_runs       += 1
        self.total_elapsed_ms += result.elapsed_ms
        self.total_cost_usd   += cost_usd
        self.runs_by_workflow[result.workflow_name] += 1

        if result.status == WorkflowStatus.SUCCESS:
            self.successful += 1
        elif result.status == WorkflowStatus.FAILED:
            self.failed     += 1
            self.failures_by_workflow[result.workflow_name] += 1
        elif result.status == WorkflowStatus.SKIPPED:
            self.skipped    += 1

    def report(self) -> dict:
        """Generate a metrics summary report."""
        return {
            "total_runs":      self.total_runs,
            "success_rate":    f"{self.success_rate:.1%}",
            "failed":          self.failed,
            "skipped":         self.skipped,
            "avg_elapsed_ms":  round(self.avg_elapsed_ms, 1),
            "total_cost_usd":  round(self.total_cost_usd, 4),
            "cost_per_run":    round(self.total_cost_usd / max(self.total_runs, 1), 4),
            "by_workflow":     dict(self.runs_by_workflow),
            "failures":        dict(self.failures_by_workflow),
        }

    def print_dashboard(self) -> None:
        """Print a nice terminal dashboard."""
        r = self.report()
        print(f"""
╔══════════════════════════════════════════════════════╗
║  AGENTIC WORKFLOW METRICS DASHBOARD                  ║
╠══════════════════════════════════════════════════════╣
║  Total Runs:     {r['total_runs']:<34} ║
║  Success Rate:   {r['success_rate']:<34} ║
║  Failed:         {r['failed']:<34} ║
║  Skipped:        {r['skipped']:<34} ║
║  Avg Latency:    {r['avg_elapsed_ms']}ms{'':<30} ║
║  Total Cost:     ${r['total_cost_usd']:<33} ║
║  Cost/Run:       ${r['cost_per_run']:<33} ║
╠══════════════════════════════════════════════════════╣
║  By Workflow:{'':<39} ║""")
        for wf, count in r["by_workflow"].items():
            fails = r["failures"].get(wf, 0)
            print(f"║    {wf[:30]:<30}: {count} runs, {fails} fails{'':>4} ║")
        print("╚══════════════════════════════════════════════════════╝")


# ── Global metrics instance ───────────────────────────────
metrics = WorkflowMetrics()


def observe(fn):
    """
    Decorator: automatically records metrics for any workflow function.
    Wraps the function's WorkflowResult return value.

    Usage:
        @observe
        def run_email_triage(email):
            return agent.run(email)
    """
    import functools
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        result = fn(*args, **kwargs)
        if isinstance(result, WorkflowResult):
            metrics.record(result)
            result.log()   # structured JSON log
        return result
    return wrapper
```

---

## 9. Mini Quiz

**Question 1 — Architecture Decision**

Your company receives 50,000 support emails per day. The email triage agent takes ~3 seconds per email (LLM call). If you run it sequentially, it would take 50,000 × 3 = 150,000 seconds = 41.7 hours to process one day's emails. That's obviously unacceptable. Describe two architectural approaches to handle this volume. Which would you choose and why?

<details>
<summary>👆 Click to reveal answer</summary>

**Two approaches: Parallel Workers + Message Queue**

**Option 1: Parallel async workers with asyncio.gather()**
```python
async def process_batch(emails: list) -> list:
    tasks = [agent.run_async(email) for email in emails]
    return await asyncio.gather(*tasks, return_exceptions=True)
```
- If you process 50 emails in parallel → 3 seconds per batch of 50 → 1,000 batches → 3,000 seconds = 50 minutes. Manageable.
- Works for moderate volume without extra infrastructure.

**Option 2: Distributed message queue (Redis Queue / AWS SQS + multiple workers)**
```
Email arrives → push to SQS → 50 worker processes each consume 1 email → parallel processing
```
- Scales horizontally: add more workers → more throughput
- Built-in retry on failure
- Decoupled: email receiving is separate from processing
- Can handle bursts (emails pile up in queue, workers drain at steady rate)

**The right answer depends on context:**
- Small startup, 50K emails/day: asyncio.gather() with batched processing. Simple, cheap, good enough.
- Enterprise, 500K emails/day, SLA requirements: SQS + EC2 worker fleet. Failure isolation, autoscaling, dead-letter queues for failed emails.

**The key metric is: at what throughput do you *need* horizontal scaling?**
Rule of thumb: asyncio works until ~10 concurrent requests saturate your LLM rate limit. Beyond that, you need rate limiting + queue-based distribution.
</details>

---

**Question 2 — Idempotency Bug**

In the `IdempotencyStore`, there's a subtle design decision: we call `mark_processed()` AFTER the workflow completes, not before. What specific failure scenario does this prevent? What problem would occur if we marked it as processed BEFORE running the workflow?

<details>
<summary>👆 Click to reveal answer</summary>

**The "mark before run" problem: losing data permanently**

**If you mark as processed BEFORE running:**
```python
idempotency.mark_processed("email_triage", email.id)  # ← mark first
result = agent.run(email)   # ← if this crashes...
# email.id is now marked as processed
# On restart, is_processed() → True → SKIP
# The email is NEVER processed. Gone forever.
```

**Real failure scenario:** You start marking the email as processed, then:
- The LLM API times out
- Your server runs out of memory and OOMs
- Someone kills the process with SIGKILL

The email.id is now in the idempotency store. When your worker restarts, it sees "already processed" and skips it. The customer never gets a reply. The ticket is never created. The bug is silent — the system "appears" to be working (it's not failing) but work is being silently dropped.

**The correct pattern: mark AFTER success only**
```python
result = agent.run(email)   # ← run first
if result.status == WorkflowStatus.SUCCESS:
    idempotency.mark_processed(...)   # ← mark only on success
# If the workflow fails → not marked → will retry → correct behavior
```

**The tradeoff:** This means if the workflow SUCCEEDS but the process crashes BEFORE `mark_processed()`, the workflow runs twice. You need your actions (sending emails, creating tickets) to be idempotent too.
- Sending an email twice: bad (duplicate)
- Creating a ticket twice: bad (duplicate)

**Defense:** Use "upsert" patterns in your actions:
- `INSERT OR IGNORE INTO tickets` (SQL)
- HubSpot's `create_or_update` contact by email
- Slack's deduplication_id in message payloads

The general principle: **"at least once" delivery + idempotent actions = exactly once semantics**.
</details>

---

**Question 3 — LLM vs Rules**

In the `EmailTriageAgent._classify()`, we use an LLM. In `_determine_route()`, we use a plain Python dict lookup. In `CRMUpdateAgent._qualify_lead()`, we use an LLM for BANT scoring. Why isn't `_determine_route()` an LLM call too? State the principle for deciding when to use LLMs vs deterministic code.

<details>
<summary>👆 Click to reveal answer</summary>

**The principle: Use LLMs for understanding; use code for decisions with known inputs.**

**`_classify()` → LLM required:**
- Input: raw, unstructured human language (infinite variability)
- The task is semantic understanding: "Is this a legal threat or just an angry customer?"
- No set of regexes can reliably distinguish "We'll see you in court!" (frustrated hyperbole) from a legal notice. LLMs can.

**`_determine_route()` → Pure code:**
- Input: a classification string with ~6 known values ("sales", "legal", "complaint", etc.)
- Every possible input is enumerated
- The mapping is 100% deterministic, stable, and auditable
- There is NO ambiguity: `legal` always goes to `legal-team@company.com`
- If you used an LLM: you'd add latency, cost, and risk of wrong routing. The LLM might route "legal" to "support@company.com" on a bad day. Unacceptable.

**`_qualify_lead()` → LLM required:**
- BANT scoring requires understanding natural language budget/authority signals:
  - "We've budgeted around $80k" → budget_fit: yes
  - "We'll need to check with the steering committee" → is_decision_maker: false
  - "We're evaluating options for next year" → timeline_defined: uncertain
- Deterministic code would need to parse every possible way humans express these → impossible

**The decision principle:**
```
┌─────────────────────────────────────────────────────────────┐
│ USE CODE when:                  │ USE LLM when:             │
│ - input states are enumerable   │ - input is open-ended     │
│ - rule can be exactly defined   │ - requires semantic        │
│ - zero tolerance for error      │   understanding            │
│ - performance is critical       │ - exceptions exist to      │
│ - auditability is required      │   every rule               │
│                                 │ - human judgment needed    │
└─────────────────────────────────────────────────────────────┘
```

**A good heuristic:** Could an intern follow a printed rulebook for this? → Use code. Would an intern need to "use their judgment"? → Use an LLM.
</details>

---

**Question 4 — Code Review Bot Design**

In `_semantic_review()`, we limit the code to 4000 characters (`code[:4000]`). What happens to a 2000-line file (roughly 80,000 characters)? Describe two production strategies for handling large file reviews without this truncation.

<details>
<summary>👆 Click to reveal answer</summary>

**The problem: 2000-line files lose all code after the first ~150 lines.**

Only the import section and first few functions get reviewed. The entire bottom half of the file — likely where the new feature code IS — gets zero LLM attention. The bot appears to be working (no errors) but is reviewing the wrong code.

**Strategy 1: Review only the diff (what actually changed in the PR)**

The most correct solution: don't review the whole file, just what changed.

```python
# Fetch the PR diff from GitHub API
diff = github.get_pull(pr_number).get_files()
for file_change in diff:
    patch = file_change.patch   # just the changed lines (git diff format)
    # This is typically 50-500 lines for most PRs
    result = bot.run(code=patch, filename=file_change.filename, ...)
```

Benefits:
- Natural context window: most PRs change <200 lines
- More focused feedback on what's actually new
- Reviewer attention isn't diluted by unchanged code

**Strategy 2: Chunk and summarize**

For cases where you need full-file context:

```python
def review_large_file(code: str, chunk_size: int = 4000) -> list[ReviewResult]:
    chunks   = [code[i:i+chunk_size] for i in range(0, len(code), chunk_size)]
    results  = [bot._semantic_review(chunk, ...) for chunk in chunks]
    # Merge and deduplicate issues across chunks
    return merge_review_results(results)
```

**Strategy 3: Hierarchical review**

```
Step 1: LLM reads the FULL file and writes a module summary (500 tokens)
Step 2: LLM reviews each function in isolation using the module summary as context
Step 3: Merge + deduplicate all function-level reviews
```

This catches both global design issues (from step 1) and local bugs (from step 2).

**In practice:** GitHub Copilot and CodeRabbit use the diff-only approach for PR reviews, with optional full-file context on demand. It's the most cost-effective and accurate strategy.
</details>

---

**Question 5 — The `@retry` Decorator**

The `@retry` decorator adds random jitter to the sleep time: `jitter = random.uniform(0, 0.1 * delay)`. Why is this jitter important? What specific distributed systems failure does it prevent, and can you give a concrete scenario where removing jitter would cause a cascading failure?

<details>
<summary>👆 Click to reveal answer</summary>

**Jitter prevents "thundering herd" / "synchronized retry storm"**

**Without jitter (deterministic backoff):**

Scenario: Your server has 500 worker processes, each sending requests to the OpenAI API. At T=0, OpenAI has a brief 2-second service hiccup:
- All 500 workers get a rate limit error simultaneously
- All 500 workers wait exactly 1.0 second → retry at T=1.0
- All 500 workers hit OpenAI at T=1.0 → OpenAI can't handle 500 simultaneous retries → rate limits them all AGAIN
- All 500 workers wait exactly 2.0 seconds → retry at T=3.0
- All 500 workers hit at T=3.0 → rate limited AGAIN
- This continues indefinitely — the API NEVER recovers

The workers are perfectly synchronized (like a metronome), creating a pulsing wave of traffic that keeps overwhelming the API.

**With jitter (randomized delay):**
- Worker 1 waits 1.02 seconds
- Worker 2 waits 0.94 seconds
- Worker 3 waits 1.08 seconds
- Workers spread their retries across a window → OpenAI handles a trickle → recovers
- Workers gradually succeed as the API comes back online

**The math:**
Without jitter: N retries all land at the same timestamp → instantaneous load = N
With jitter ±10%: N retries spread over a window → load per unit time = N / window_duration

**This principle is documented in Amazon's distributed systems guidelines** and is implemented in virtually every production HTTP retry library (axios-retry, tenacity, AWS SDK). It's also why your iPhone uses random backoff for WiFi reconnection — if every device reconnected at exactly the same time, the router would be overwhelmed.

Rule: Any time you have multiple clients retrying a shared resource, add jitter.
</details>

---

## 10. Chapter 10 Preview

```
╔══════════════════════════════════════════════════════════════╗
║  👀 COMING UP: Chapter 10                                    ║
║  "Evaluation & Red-Teaming — Is Your Agent Actually Good?"  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Chapter 9 gave you agents that DO things.                  ║
║  Chapter 10 asks the harder question: do they do them WELL? ║
║                                                              ║
║  The brutal truth: LLMs are inconsistent.                   ║
║  Your email classifier gets 94% accuracy on your test set,  ║
║  but silently misclassifies "i am contacting my lawyer"     ║
║  as "support" instead of "legal". In prod. Every day.       ║
║                                                              ║
║  🧪  LLM-AS-A-JUDGE                                        ║
║      Using GPT-4 to evaluate GPT-4o-mini's outputs         ║
║      Why this works and when it breaks                      ║
║      Building eval harnesses for classification + generation║
║                                                              ║
║  📊  BENCHMARK DATASETS                                      ║
║      Building golden datasets for your specific domain      ║
║      Sampling strategy: diversity over volume               ║
║      Annotation guidelines for consistent labeling         ║
║                                                              ║
║  📉  REGRESSION TESTING                                      ║
║      GitHub Actions: run evals on every agent change        ║
║      Fail PR if accuracy drops below threshold              ║
║      Track metric trends across model versions             ║
║                                                              ║
║  🔴  RED-TEAMING                                             ║
║      Adversarial inputs: prompt injection, jailbreaks       ║
║      Bias testing: does your CRM agent score women lower?   ║
║      Data poisoning: can bad inputs corrupt the system?     ║
║                                                              ║
║  🔭  OBSERVABILITY IN PROD                                   ║
║      LangSmith / Langfuse: trace every agent run            ║
║      Where did the agent go wrong? Token-level tracing      ║
║      A/B testing: old vs new agent in production            ║
║                                                              ║
║  🚀  Real use case:                                          ║
║      Full eval suite for the email triage agent:           ║
║      100-item labeled test set, LLM judge, GitHub CI/CD,   ║
║      adversarial test cases, performance dashboard.         ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  PREREQUISITE CHECKLIST BEFORE CHAPTER 10:                   ║
║  ✅ Email triage agent classifies at least 3 categories     ║
║  ✅ You understand why idempotency prevents duplicates       ║
║  ✅ You can explain when to use LLM vs deterministic code   ║
║  ✅ You've run the code review bot on your own code         ║
║  ✅ You can describe what triggers a workflow               ║
╚══════════════════════════════════════════════════════════════╝
```

> **Professor's Final Word:** The four agents in this chapter — email triage, CRM update, data pipeline, and code review — represent the four most high-ROI categories of business automation. Any one of them, deployed properly, can replace 10-40 hours of weekly manual work. The patterns you've learned (classify → route → act, extract → enrich → qualify → sync, profile → validate → fix → load, static → semantic → comment) are not just for these four use cases. They're *generalizable*. Your next agent — whatever it processes — will follow the same structure. When you build it, you won't be starting from scratch. You'll be remixing these patterns. That's what it means to think like a senior AI engineer. 🎓⚡

---

```
────────────────────────────────────────────────────────────────────
  Chapter 9 Complete ✅  |  Next: Chapter 10 — Evaluation & Red-Teaming
  Agents built this chapter:
    email_triage_agent.py   — classify → route → draft reply → ticket → alert
    crm_update_agent.py     — extract → enrich → qualify (BANT) → CRM sync
    data_pipeline_agent.py  — profile → validate → auto-fix → load → report
    code_review_bot.py      — AST analysis → LLM semantic review → PR comments
  Infrastructure built:
    shared/base.py          — BaseWorkflowAgent, WorkflowResult, structured logging
    triggers.py             — APScheduler cron + FastAPI webhooks + GitHub HMAC verify
    retry_idempotency.py    — @retry exponential backoff + IdempotencyStore (SQLite)
    observability.py        — WorkflowMetrics, cost tracking, @observe decorator
────────────────────────────────────────────────────────────────────
```
