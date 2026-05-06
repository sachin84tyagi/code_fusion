# 🏭 Phase 11 — Real Industry Projects
### "Building 10 Production-Ready AI Applications"

> **Difficulty**: ⭐⭐⭐⭐⭐ Advanced | **Time**: Self-paced | **Prerequisites**: All Previous Phases

---

## 🎯 Overview

This phase is your **capstone**. You'll build 10 complete, production-quality AI projects that you can add to your portfolio.

Each project includes:
- Full folder structure
- Complete code with explanations
- Error handling
- Best practices
- Deployment notes

---

## 📦 Project Overview

| # | Project | Key Skills | Difficulty |
|---|---------|-----------|-----------|
| 1 | AI Customer Support System | Agents + Memory + RAG | ⭐⭐⭐ |
| 2 | AI Resume Screening System | Chains + Structured Output | ⭐⭐⭐ |
| 3 | AI Coding Assistant | Agents + Tools + Code Execution | ⭐⭐⭐⭐ |
| 4 | AI Research Agent | Multi-step Agents + Search | ⭐⭐⭐⭐ |
| 5 | AI PDF Chatbot | RAG + Memory + UI | ⭐⭐⭐ |
| 6 | AI Email Automation | Chains + Templates | ⭐⭐⭐ |
| 7 | AI Meeting Summarizer | Audio/Text + Chains | ⭐⭐⭐ |
| 8 | AI Data Analysis Assistant | Agents + Code + Viz | ⭐⭐⭐⭐ |
| 9 | AI Business Automation Agent | LangGraph + Multi-tool | ⭐⭐⭐⭐⭐ |
| 10 | AI Multi-Agent Team | LangGraph + Multi-agent | ⭐⭐⭐⭐⭐ |

---

## 🏗️ Project 1: AI Customer Support System

### Folder Structure

```
project_01_customer_support/
├── README.md
├── requirements.txt
├── .env
├── config.py          ← All configurations
├── knowledge_base/    ← Company documents for RAG
│   ├── faq.txt
│   ├── policies.txt
│   └── products.txt
├── agents/
│   ├── support_agent.py    ← Main agent logic
│   └── escalation.py       ← Human escalation logic
├── memory/
│   └── session_manager.py  ← Session management
├── api/
│   └── main.py             ← FastAPI server
└── ui/
    └── app.py              ← Streamlit chat UI
```

### Core Code

```python
# ============================================================
# FILE: project_01_customer_support/agents/support_agent.py
# PURPOSE: Complete AI Customer Support Agent
# ============================================================

import os
from pathlib import Path
from langchain_core.tools import tool
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.runnables import RunnablePassthrough
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from datetime import datetime
from typing import Optional
import json

# ============================================================
# CONFIGURATION
# ============================================================
class Config:
    MODEL_NAME = "llama3.2"
    EMBED_MODEL = "nomic-embed-text"
    KNOWLEDGE_BASE_DIR = "knowledge_base"
    VECTOR_DB_PATH = "./support_vector_db"
    MAX_HISTORY = 20  # Max messages to keep in memory
    LOG_FILE = "support_logs.json"

# ============================================================
# KNOWLEDGE BASE SETUP (RAG)
# ============================================================
class KnowledgeBase:
    """Manages company knowledge for RAG retrieval."""
    
    def __init__(self, config: Config):
        self.config = config
        self.embeddings = OllamaEmbeddings(model=config.EMBED_MODEL)
        self.vectorstore = self._load_or_create_vectorstore()
        self.retriever = self.vectorstore.as_retriever(search_kwargs={"k": 3})
    
    def _load_or_create_vectorstore(self):
        """Load existing vector store or create new one."""
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        from langchain_core.documents import Document
        
        if Path(self.config.VECTOR_DB_PATH).exists():
            print("📂 Loading existing knowledge base...")
            return Chroma(
                persist_directory=self.config.VECTOR_DB_PATH,
                embedding_function=self.embeddings
            )
        
        print("📚 Building knowledge base...")
        
        # Load all documents from knowledge base directory
        documents = []
        kb_path = Path(self.config.KNOWLEDGE_BASE_DIR)
        
        if kb_path.exists():
            for file in kb_path.glob("*.txt"):
                with open(file, 'r', encoding='utf-8') as f:
                    content = f.read()
                documents.append(Document(
                    page_content=content,
                    metadata={"source": file.name}
                ))
        else:
            # Create sample knowledge base
            kb_path.mkdir(exist_ok=True)
            sample_docs = {
                "faq.txt": """
FREQUENTLY ASKED QUESTIONS

Q: How do I reset my password?
A: Go to login page, click "Forgot Password", enter your email, check inbox for reset link.

Q: What payment methods do you accept?
A: We accept Visa, Mastercard, PayPal, and bank transfers.

Q: How long does shipping take?
A: Standard shipping: 3-5 business days. Express: 1-2 business days.
""",
                "policies.txt": """
COMPANY POLICIES

Return Policy:
- 30-day return window from purchase date
- Items must be in original condition
- Refund processed within 5-7 business days
- Contact returns@company.com to initiate

Privacy Policy:
- We never sell your data
- Data encrypted with AES-256
- You can request data deletion anytime
""",
                "products.txt": """
PRODUCT CATALOG

Basic Plan - $9.99/month
- 5 users included
- 10GB storage
- Email support

Professional Plan - $29.99/month  
- 25 users included
- 100GB storage
- Priority support
- API access

Enterprise Plan - Custom pricing
- Unlimited users
- Unlimited storage
- Dedicated support
- Custom integrations
"""
                }
            
            for filename, content in sample_docs.items():
                with open(kb_path / filename, 'w') as f:
                    f.write(content)
                documents.append(Document(
                    page_content=content,
                    metadata={"source": filename}
                ))
        
        # Split and embed
        splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=80)
        chunks = splitter.split_documents(documents)
        
        return Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=self.config.VECTOR_DB_PATH
        )
    
    def retrieve(self, query: str) -> str:
        """Retrieve relevant knowledge for a query."""
        docs = self.retriever.invoke(query)
        if not docs:
            return "No specific information found in knowledge base."
        return "\n\n".join(f"[Source: {d.metadata.get('source', 'unknown')}]\n{d.page_content}" 
                          for d in docs)

# ============================================================
# TOOLS
# ============================================================
def create_tools(knowledge_base: KnowledgeBase):
    """Create tools for the support agent."""
    
    @tool
    def search_knowledge_base(query: str) -> str:
        """
        Search the company knowledge base for information.
        Use for: FAQs, policies, product info, pricing.
        Input: search query string
        """
        return knowledge_base.retrieve(query)
    
    @tool
    def check_order_status(order_id: str) -> str:
        """
        Check the status of a customer order.
        Use when customer provides an order ID.
        Input: order ID string (e.g., 'ORD-12345')
        """
        # In production: query your database
        mock_orders = {
            "ORD-12345": {"status": "Shipped", "eta": "Tomorrow", "carrier": "FedEx", "tracking": "FX789012"},
            "ORD-67890": {"status": "Processing", "eta": "3-5 days", "carrier": "Pending"},
            "ORD-11111": {"status": "Delivered", "eta": "Delivered on May 3rd", "carrier": "UPS"},
        }
        
        if order_id in mock_orders:
            order = mock_orders[order_id]
            return f"Order {order_id}: Status={order['status']}, ETA={order['eta']}, Carrier={order.get('carrier', 'TBD')}"
        
        return f"Order {order_id} not found. Please verify the order ID."
    
    @tool
    def create_support_ticket(
        customer_email: str,
        issue_summary: str, 
        priority: str = "medium"
    ) -> str:
        """
        Create a support ticket for complex issues requiring human review.
        Use when: issue is complex, customer is very upset, needs escalation.
        Input: customer_email, issue_summary, priority (low/medium/high/urgent)
        """
        import random
        ticket_id = f"TKT-{random.randint(10000, 99999)}"
        
        # Log the ticket
        ticket = {
            "ticket_id": ticket_id,
            "email": customer_email,
            "issue": issue_summary,
            "priority": priority,
            "created_at": datetime.now().isoformat(),
            "status": "open"
        }
        
        # Save to log file
        logs = []
        if Path(Config.LOG_FILE).exists():
            with open(Config.LOG_FILE) as f:
                logs = json.load(f)
        logs.append(ticket)
        with open(Config.LOG_FILE, 'w') as f:
            json.dump(logs, f, indent=2)
        
        return f"✅ Ticket {ticket_id} created (Priority: {priority}). Our team will contact {customer_email} within 24 hours."
    
    return [search_knowledge_base, check_order_status, create_support_ticket]

# ============================================================
# SUPPORT AGENT
# ============================================================
class CustomerSupportAgent:
    """AI-powered customer support agent with memory and RAG."""
    
    SYSTEM_PROMPT = """You are Alex, a professional AI customer support agent.

PERSONALITY: Empathetic, helpful, professional, solution-focused.

APPROACH:
1. Greet warmly and identify the issue
2. Search knowledge base for relevant information  
3. If order-related, check order status
4. If you can solve it → solve it clearly
5. If too complex → create a support ticket

RULES:
- Always address customers by name once known
- Never make promises you can't keep
- Be honest if you don't have information
- For complex issues, create a ticket
- End with: "Is there anything else I can help you with?"

IMPORTANT: Only answer based on retrieved knowledge base information for policy/pricing questions."""
    
    def __init__(self):
        self.config = Config()
        print("🚀 Initializing Customer Support Agent...")
        
        self.knowledge_base = KnowledgeBase(self.config)
        self.tools = create_tools(self.knowledge_base)
        self.tool_map = {t.name: t for t in self.tools}
        
        self.llm = ChatOllama(model=self.config.MODEL_NAME, temperature=0.3)
        self.llm_with_tools = self.llm.bind_tools(self.tools)
        
        self.sessions = {}
        print("✅ Agent ready to help customers!")
    
    def get_session(self, session_id: str) -> InMemoryChatMessageHistory:
        if session_id not in self.sessions:
            self.sessions[session_id] = InMemoryChatMessageHistory()
        return self.sessions[session_id]
    
    def respond(self, customer_message: str, session_id: str = "default") -> str:
        """Process a customer message and return a response."""
        
        # Get session history
        history = self.get_session(session_id)
        
        # Build messages
        messages = [
            SystemMessage(content=self.SYSTEM_PROMPT),
            *history.messages,
            HumanMessage(content=customer_message)
        ]
        
        # Run agent loop (max 3 tool calls)
        for _ in range(3):
            response = self.llm_with_tools.invoke(messages)
            messages.append(response)
            
            if not response.tool_calls:
                break
            
            # Execute tools
            for tc in response.tool_calls:
                tool_name = tc["name"]
                result = self.tool_map[tool_name].invoke(tc["args"]) if tool_name in self.tool_map else "Tool not found"
                messages.append(ToolMessage(content=str(result), tool_call_id=tc["id"]))
        
        # Save to history
        history.add_message(HumanMessage(content=customer_message))
        history.add_message(response)
        
        return response.content
    
    def interactive(self):
        """Start interactive support session."""
        print("\n🎧 TechCorp Customer Support")
        print("Type 'quit' to exit, 'new' for new session\n")
        
        session_id = f"session_{datetime.now().strftime('%H%M%S')}"
        
        while True:
            msg = input("💬 Customer: ").strip()
            
            if msg.lower() == "quit":
                print("Thank you for contacting support!")
                break
            elif msg.lower() == "new":
                session_id = f"session_{datetime.now().strftime('%H%M%S')}"
                print("🔄 New session started!\n")
                continue
            elif not msg:
                continue
            
            response = self.respond(msg, session_id)
            print(f"\n🤖 Alex: {response}\n")

# ---- Run it! ----
if __name__ == "__main__":
    agent = CustomerSupportAgent()
    
    # Test some interactions
    test_session = "test_001"
    
    print("\n📋 RUNNING TEST CONVERSATIONS:")
    print("="*60)
    
    test_messages = [
        "Hi! I need help with my recent order.",
        "My order ID is ORD-12345",
        "Also, what's your return policy?",
        "Can I return something after 45 days?",
    ]
    
    for msg in test_messages:
        print(f"\n👤 Customer: {msg}")
        response = agent.respond(msg, test_session)
        print(f"🤖 Alex: {response[:300]}")
        print("-"*40)
    
    # Uncomment for interactive mode:
    # agent.interactive()
```

---

## 🏗️ Project 2: AI Resume Screener

```python
# ============================================================
# FILE: project_02_resume_screener/screener.py
# PURPOSE: Automated AI resume screening system
# ============================================================

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from pydantic import BaseModel, Field
from typing import List
import json

class ResumeScore(BaseModel):
    """Structured resume evaluation."""
    candidate_name: str = Field(description="Candidate's full name")
    overall_score: int = Field(description="Overall score 0-100", ge=0, le=100)
    years_experience: float = Field(description="Years of relevant experience")
    technical_skills_match: int = Field(description="Technical skills match % (0-100)")
    education_score: int = Field(description="Education relevance score (0-100)")
    recommendation: str = Field(description="HIRE / INTERVIEW / REJECT")
    key_strengths: List[str] = Field(description="Top 3 candidate strengths")
    concerns: List[str] = Field(description="Top 2 concerns or gaps")
    summary: str = Field(description="2-sentence summary for hiring manager")

class AIResumeScreener:
    """Automated resume screening with AI."""
    
    def __init__(self, job_description: str):
        self.job_description = job_description
        llm = ChatOllama(model="llama3.2", temperature=0)
        self.structured_llm = llm.with_structured_output(ResumeScore)
        
        # Analysis chains running in parallel
        self.skills_chain = (
            ChatPromptTemplate.from_messages([
                ("system", "You are a technical recruiter. Analyze skills objectively."),
                ("human", f"JOB REQUIREMENTS:\n{job_description}\n\nRESUME:\n{{resume}}\n\nAnalyze technical skills match.")
            ]) | ChatOllama(model="llama3.2", temperature=0) | StrOutputParser()
        )
        
        self.experience_chain = (
            ChatPromptTemplate.from_messages([
                ("system", "You are an experienced talent acquisition specialist."),
                ("human", f"JOB:\n{job_description}\n\nRESUME:\n{{resume}}\n\nAnalyze experience relevance.")
            ]) | ChatOllama(model="llama3.2", temperature=0) | StrOutputParser()
        )
    
    def screen(self, resume_text: str) -> ResumeScore:
        """Screen a resume against the job description."""
        
        full_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a senior technical recruiter with 15 years of experience.
            Evaluate resumes objectively and fairly.
            Be strict but fair with scoring."""),
            ("human", f"""Evaluate this resume for the following job:
            
JOB DESCRIPTION:
{self.job_description}

RESUME:
{{resume}}

Provide a complete, fair evaluation.""")
        ])
        
        chain = full_prompt | self.structured_llm
        return chain.invoke({"resume": resume_text})
    
    def batch_screen(self, resumes: List[dict]) -> List[dict]:
        """Screen multiple resumes and rank them."""
        results = []
        
        for i, resume_data in enumerate(resumes, 1):
            print(f"Screening resume {i}/{len(resumes)}: {resume_data.get('name', 'Unknown')}")
            try:
                score = self.screen(resume_data["text"])
                results.append({
                    "id": i,
                    "name": resume_data.get("name", score.candidate_name),
                    "score": score,
                    "data": resume_data
                })
            except Exception as e:
                print(f"  ❌ Error screening: {e}")
        
        # Sort by overall score (highest first)
        results.sort(key=lambda x: x["score"].overall_score, reverse=True)
        return results

# ---- Test the Screener ----
JOB_DESCRIPTION = """
SENIOR PYTHON DEVELOPER - AI TEAM

Requirements:
- 5+ years Python experience
- Experience with LangChain or similar LLM frameworks
- Machine Learning knowledge (TensorFlow/PyTorch)
- REST API development (FastAPI/Django)
- AWS/Cloud experience
- Strong communication skills

Nice to have:
- Vector databases (ChromaDB, Pinecone)
- LangGraph or similar agentic frameworks
- Production AI deployment experience
"""

SAMPLE_RESUMES = [
    {
        "name": "Sarah Chen",
        "text": """
Sarah Chen | sarah@email.com | LinkedIn: linkedin.com/in/sarahchen

EXPERIENCE:
Senior ML Engineer - TechAI Corp (2021-2024)
- Built LLM-powered applications using LangChain and OpenAI
- Deployed 5 production AI agents handling 10k+ requests/day
- Python expert with 7 years experience

ML Engineer - StartupX (2019-2021)
- Developed recommendation system using PyTorch
- Built FastAPI REST services

SKILLS: Python, LangChain, LangGraph, PyTorch, FastAPI, AWS, ChromaDB
EDUCATION: M.S. Computer Science, MIT (2019)
"""
    },
    {
        "name": "Bob Johnson",
        "text": """
Bob Johnson | bob@email.com

EXPERIENCE:
Junior Developer - WebAgency (2022-2024)
- Built websites using JavaScript and PHP
- Basic Python scripting

SKILLS: JavaScript, HTML, CSS, Python (beginner), WordPress
EDUCATION: B.S. Information Technology (2022)
"""
    }
]

screener = AIResumeScreener(JOB_DESCRIPTION)
results = screener.batch_screen(SAMPLE_RESUMES)

print("\n" + "="*60)
print("📊 RESUME SCREENING RESULTS (Ranked)")
print("="*60)

for rank, result in enumerate(results, 1):
    score = result["score"]
    print(f"\n#{rank} {score.candidate_name}")
    print(f"   Overall Score: {score.overall_score}/100")
    print(f"   Recommendation: {score.recommendation}")
    print(f"   Years Experience: {score.years_experience}")
    print(f"   Summary: {score.summary}")
    print(f"   Strengths: {', '.join(score.key_strengths)}")

print("\n📋 Shortlist for Interviews:")
for r in results:
    if r["score"].recommendation in ["HIRE", "INTERVIEW"]:
        print(f"  ✅ {r['name']} - Score: {r['score'].overall_score}/100")
```

---

## 🏗️ Projects 3-10: Quick Summaries

### Project 3: AI Coding Assistant
```
Key Features:
- Write code from natural language descriptions
- Debug existing code 
- Add docstrings and comments automatically
- Run and test generated code
- Explain code line by line

Tech Stack: LangChain + Code execution tool + Ollama
File: project_03_coding_assistant/assistant.py
```

### Project 4: AI Research Agent
```
Key Features:
- Web search for latest information
- Multi-source research synthesis
- Citation tracking
- Save research to formatted reports
- Follow-up question generation

Tech Stack: LangGraph + Search tools + File tools
File: project_04_research_agent/agent.py
```

### Project 5: AI PDF Chatbot (See Phase 9)
```
Key Features:
- Upload any PDF
- Multi-turn conversation about content
- Source citations in answers
- Streamlit web UI
- Session management

Tech Stack: RAG + Memory + Streamlit
File: project_05_pdf_chatbot/app.py
```

### Project 6: AI Email Automation System
```
Key Features:
- Generate professional emails from bullet points
- Classify incoming emails by category/urgency
- Auto-draft responses to common queries
- Email personalization with user context

Tech Stack: Chains + Templates + Structured Output
File: project_06_email_automation/system.py
```

### Project 7: AI Meeting Summarizer
```
Key Features:
- Process meeting transcripts
- Extract action items automatically
- Identify decisions made
- Generate follow-up email
- Create JIRA/task tickets

Tech Stack: Chains + Structured Output + File tools
File: project_07_meeting_summarizer/summarizer.py
```

### Project 8: AI Data Analysis Assistant
```
Key Features:
- Load CSV/Excel files
- Generate charts and visualizations
- Statistical analysis
- Natural language queries
- Generate insight reports

Tech Stack: Agents + Code execution + Pandas + Matplotlib
File: project_08_data_analyst/analyst.py
```

### Project 9: AI Business Automation Agent
```
Key Features:
- Process customer orders end-to-end
- Automated invoice generation
- Inventory checking
- Customer notification
- Exception handling with human escalation

Tech Stack: LangGraph + Multiple tools + Human-in-loop
File: project_09_business_automation/workflow.py
```

### Project 10: AI Multi-Agent Team
```
Key Features:
- Supervisor orchestrates 4 specialized agents
- Research Agent: gathers information
- Analysis Agent: processes data
- Writing Agent: creates content
- QA Agent: validates output
- Full LangGraph workflow with state management

Tech Stack: LangGraph + Multiple agents + All tools
File: project_10_multi_agent_team/team.py
```

---

## 📁 How To Run Each Project

```bash
# 1. Navigate to project folder
cd project_01_customer_support

# 2. Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# 5. Run the project
python agents/support_agent.py     # For terminal version
streamlit run ui/app.py            # For web UI (if available)
```

---

## 🎯 Portfolio Challenge

After completing all 10 projects, challenge yourself to build a **custom project** that solves a real problem you care about. This becomes your flagship portfolio piece.

**Ideas**:
- AI Language Learning Tutor
- AI Financial Advisor (risk monitoring)
- AI Health Journal Analyzer
- AI Code Review System for your team
- AI News Aggregator and Summarizer

---

## 🚀 What's Next?

**Phase 12 — Advanced LangChain**: Async operations, callbacks, LangSmith monitoring, and production optimizations.

> **Go to**: `Phase12_Advanced/lesson.md` →

---

*Phase 11 Complete! 🏭 You're building real AI products. That's what professionals do!*
