# Phase 11 — RAG with LangGraph: Stateful & Agentic RAG Workflows

> **Level:** Advanced | **Goal:** Build intelligent RAG systems that think, reflect, and make decisions using workflow graphs

---

## 1. Why LangGraph for RAG?

LangChain chains are linear: Step 1 → Step 2 → Step 3. Done.

But real RAG problems need **decision-making**:
- "Did retrieval find good results? If NOT → try web search."
- "Is the generated answer accurate? If NOT → retrieve again."
- "Is the question about finance or legal? Route to different knowledge bases."

LangGraph gives your RAG system a **brain** — it can think, reflect, and loop.

---

## 2. Corrective RAG (CRAG) — The Self-Checking RAG

CRAG is a RAG system that **checks the quality of retrieval** and corrects itself before answering.

```
NORMAL RAG:
User Question → Retrieve → Generate → Answer (even if retrieval was bad!)

CORRECTIVE RAG:
User Question → Retrieve → Grade Quality?
                               ↓ YES (good)    ↓ NO (bad)
                           Generate         Web Search
                               ↓                 ↓
                           Answer ←─────────────┘
```

```python
# corrective_rag.py
# CRAG with LangGraph

from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain_core.documents import Document

# ============================================================
# STATE: What information flows through the graph
# ============================================================
class CRAGState(TypedDict):
    question: str
    documents: List[Document]
    relevance: str          # "relevant" or "irrelevant"
    generation: str         # Final answer

# ============================================================
# SET UP COMPONENTS
# ============================================================
documents_data = [
    Document(page_content="Our return policy: 30-day returns with receipt."),
    Document(page_content="Shipping: free over $75, standard rates below."),
    Document(page_content="Enterprise pricing starts at $499/month."),
]
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma.from_documents(documents=documents_data, embedding=embeddings)
llm = OllamaLLM(model="llama3.2")

# ============================================================
# NODES: Each is a function that modifies state
# ============================================================

def retrieve(state: CRAGState) -> CRAGState:
    """Retrieve documents based on question."""
    print("[CRAG] Node: retrieve")
    question = state["question"]
    docs = vector_store.similarity_search(question, k=3)
    return {"documents": docs}

def grade_documents(state: CRAGState) -> CRAGState:
    """Grade if retrieved documents are relevant to the question."""
    print("[CRAG] Node: grade_documents")
    
    question = state["question"]
    docs = state["documents"]
    
    if not docs:
        return {"relevance": "irrelevant"}
    
    # Ask LLM to judge relevance
    context = "\n".join([d.page_content for d in docs])
    grader_prompt = f"""Given this question: "{question}"
And these retrieved documents:
{context}

Are these documents relevant to answer the question?
Respond with ONLY one word: "relevant" or "irrelevant" """
    
    grade = llm.invoke(grader_prompt).strip().lower()
    relevance = "relevant" if "relevant" in grade else "irrelevant"
    
    print(f"[CRAG] Relevance grade: {relevance}")
    return {"relevance": relevance}

def web_search_fallback(state: CRAGState) -> CRAGState:
    """Fallback: simulate web search when retrieval fails."""
    print("[CRAG] Node: web_search_fallback (retrieval was not helpful)")
    # In production: use Tavily, SerpAPI, or DuckDuckGo
    fake_web_result = Document(
        page_content="[Web Search Result]: General policy information found online.",
        metadata={"source": "web_search"}
    )
    return {"documents": [fake_web_result]}

def generate_answer(state: CRAGState) -> CRAGState:
    """Generate final answer from retrieved documents."""
    print("[CRAG] Node: generate_answer")
    
    question = state["question"]
    docs = state["documents"]
    context = "\n\n".join([d.page_content for d in docs])
    
    prompt = f"""Use the context below to answer the question accurately.
If context is insufficient, say so clearly.

Context: {context}

Question: {question}
Answer:"""
    
    answer = llm.invoke(prompt)
    return {"generation": answer}

# ============================================================
# CONDITIONAL EDGE: Route based on relevance grade
# ============================================================
def decide_to_generate(state: CRAGState) -> str:
    """Decide: generate from docs OR do web search first."""
    if state["relevance"] == "relevant":
        return "generate"      # Go straight to answer
    else:
        return "web_search"    # Get better docs first

# ============================================================
# BUILD THE GRAPH
# ============================================================
workflow = StateGraph(CRAGState)

# Add nodes
workflow.add_node("retrieve", retrieve)
workflow.add_node("grade_documents", grade_documents)
workflow.add_node("web_search_fallback", web_search_fallback)
workflow.add_node("generate_answer", generate_answer)

# Set entry point
workflow.set_entry_point("retrieve")

# Add edges
workflow.add_edge("retrieve", "grade_documents")

# Conditional routing based on grade
workflow.add_conditional_edges(
    "grade_documents",
    decide_to_generate,
    {
        "generate": "generate_answer",     # Relevant → generate
        "web_search": "web_search_fallback" # Irrelevant → web search
    }
)

workflow.add_edge("web_search_fallback", "generate_answer")
workflow.add_edge("generate_answer", END)

# Compile
app = workflow.compile()

# ============================================================
# RUN IT
# ============================================================
print("Testing Corrective RAG...\n")

result = app.invoke({"question": "What is the return policy?"})
print(f"\nFinal Answer: {result['generation']}")
```

---

## 3. Self-RAG — Reflecting On The Answer

Self-RAG goes one step further: it also checks if the **generated answer** is good, and can loop to try again.

```
Self-RAG Flow:

Question → Retrieve → Generate → Grade Answer?
                                      ↓ YES (good)  ↓ NO (bad)
                                   Return it      Retrieve again
                                                       ↓
                                               Generate again
                                                       ↓
                                             Grade again (max 3 loops)
```

```python
# self_rag.py

from typing import TypedDict, List, Annotated
from langgraph.graph import StateGraph, END
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain_core.documents import Document
import operator

class SelfRAGState(TypedDict):
    question: str
    documents: List[Document]
    generation: str
    loop_count: int
    answer_grade: str  # "good" or "needs_improvement"

documents_data = [
    Document(page_content="We offer 24/7 customer support via chat and email."),
    Document(page_content="Technical support tickets are responded to within 4 hours for enterprise."),
    Document(page_content="Basic plan support: responses within 48 hours on business days."),
]

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma.from_documents(documents=documents_data, embedding=embeddings)
llm = OllamaLLM(model="llama3.2")

def retrieve(state: SelfRAGState) -> SelfRAGState:
    docs = vector_store.similarity_search(state["question"], k=3)
    return {"documents": docs, "loop_count": state.get("loop_count", 0) + 1}

def generate(state: SelfRAGState) -> SelfRAGState:
    context = "\n".join([d.page_content for d in state["documents"]])
    prompt = f"Context: {context}\n\nQuestion: {state['question']}\nAnswer:"
    answer = llm.invoke(prompt)
    return {"generation": answer}

def grade_answer(state: SelfRAGState) -> SelfRAGState:
    """Check if the answer is grounded in the retrieved documents."""
    grader_prompt = f"""Is this answer grounded in the provided context?
Question: {state['question']}
Context: {chr(10).join([d.page_content for d in state['documents']])}
Answer: {state['generation']}

Respond with ONLY "good" or "needs_improvement":"""
    
    grade = llm.invoke(grader_prompt).strip().lower()
    answer_grade = "good" if "good" in grade else "needs_improvement"
    print(f"[Self-RAG] Answer grade: {answer_grade} (loop #{state['loop_count']})")
    return {"answer_grade": answer_grade}

def should_retry(state: SelfRAGState) -> str:
    """Loop back to retrieve or end."""
    if state["answer_grade"] == "good" or state["loop_count"] >= 3:
        return "end"
    return "retry"

workflow = StateGraph(SelfRAGState)
workflow.add_node("retrieve", retrieve)
workflow.add_node("generate", generate)
workflow.add_node("grade_answer", grade_answer)
workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "generate")
workflow.add_edge("generate", "grade_answer")
workflow.add_conditional_edges(
    "grade_answer",
    should_retry,
    {"end": END, "retry": "retrieve"}  # Loop back if needed!
)

app = workflow.compile()
result = app.invoke({"question": "How quickly does enterprise support respond?", "loop_count": 0})
print(f"\nFinal Answer: {result['generation']}")
```

---

## 4. Multi-Agent RAG System

A supervisor routes questions to specialized sub-agents, each with their own knowledge base.

```
                    Supervisor Agent
                          │
              ┌───────────┼───────────┐
              ↓           ↓           ↓
        Legal Agent  Finance Agent  HR Agent
        (contracts)  (invoices)     (policies)
              │           │           │
        Legal KB     Finance KB    HR KB
```

```python
# multi_agent_rag.py

from typing import TypedDict, Literal
from langgraph.graph import StateGraph, END
from langchain_ollama import OllamaLLM
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_core.documents import Document

# State
class MultiAgentState(TypedDict):
    question: str
    department: str
    answer: str

# Knowledge bases per department
hr_docs = [Document(page_content="Vacation: 20 days per year for full-time employees."),
           Document(page_content="Remote work: up to 3 days per week with manager approval.")]

finance_docs = [Document(page_content="Expense reimbursement: submit within 30 days with receipts."),
                Document(page_content="Budget approval: expenses over $1000 need CFO sign-off.")]

legal_docs = [Document(page_content="NDAs must be signed before sharing proprietary information."),
              Document(page_content="All contracts over $10K require legal team review.")]

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

hr_store = Chroma.from_documents(hr_docs, embeddings, collection_name="hr")
finance_store = Chroma.from_documents(finance_docs, embeddings, collection_name="finance")
legal_store = Chroma.from_documents(legal_docs, embeddings, collection_name="legal")

llm = OllamaLLM(model="llama3.2")

# Supervisor: routes to the right department
def supervisor(state: MultiAgentState) -> MultiAgentState:
    prompt = f"""Which department handles this question?
Question: "{state['question']}"
Options: HR, Finance, Legal
Answer with ONE word only (HR, Finance, or Legal):"""
    
    dept = llm.invoke(prompt).strip().upper()
    if "FINANCE" in dept:
        department = "finance"
    elif "LEGAL" in dept:
        department = "legal"
    else:
        department = "hr"
    
    print(f"[Supervisor] Routing to: {department.upper()}")
    return {"department": department}

# Generic agent function
def create_agent(store: Chroma, dept_name: str):
    def agent(state: MultiAgentState) -> MultiAgentState:
        print(f"[{dept_name.upper()} Agent] Answering question")
        docs = store.similarity_search(state["question"], k=2)
        context = "\n".join([d.page_content for d in docs])
        prompt = f"You are the {dept_name} department assistant.\nContext: {context}\nQuestion: {state['question']}\nAnswer:"
        answer = llm.invoke(prompt)
        return {"answer": answer}
    return agent

# Route based on department
def route_to_department(state: MultiAgentState) -> str:
    return state["department"]

# Build graph
workflow = StateGraph(MultiAgentState)
workflow.add_node("supervisor", supervisor)
workflow.add_node("hr", create_agent(hr_store, "HR"))
workflow.add_node("finance", create_agent(finance_store, "Finance"))
workflow.add_node("legal", create_agent(legal_store, "Legal"))

workflow.set_entry_point("supervisor")
workflow.add_conditional_edges(
    "supervisor",
    route_to_department,
    {"hr": "hr", "finance": "finance", "legal": "legal"}
)
workflow.add_edge("hr", END)
workflow.add_edge("finance", END)
workflow.add_edge("legal", END)

app = workflow.compile()

# Test
questions = [
    "How many vacation days do I get?",
    "What is the expense reimbursement deadline?",
    "Do I need to sign an NDA before the partnership call?",
]

for q in questions:
    result = app.invoke({"question": q})
    print(f"\nQ: {q}")
    print(f"A: {result['answer'][:100]}...")
    print("-" * 50)
```

---

## 5. When to Use LangGraph for RAG

```
Use Regular LangChain when:
- Simple Q&A, one knowledge base
- Linear flow (retrieve → generate)
- No conditional logic needed

Use LangGraph when:
- Need to grade/check retrieval quality (CRAG)
- Need retry loops (Self-RAG)
- Need routing between multiple knowledge bases
- Need human-in-the-loop approval
- Building multi-agent knowledge systems
- Need stateful multi-turn reasoning
```

---

## 6. Mini Challenge

1. Run `corrective_rag.py`
2. Ask a question that IS in the knowledge base
3. Ask a question that is NOT in the knowledge base
4. Observe which path the graph takes in each case
5. Add a `print` statement to confirm which node runs!

---

> **Up Next: Phase 12 — Multi-Modal RAG**
> Extend RAG to images, audio, tables, and documents with mixed content.
