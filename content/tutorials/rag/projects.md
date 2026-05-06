# Phase 14 — Real Industry Projects: 10 Production-Grade RAG Applications

> **Level:** Expert | **Goal:** Build complete, deployable RAG applications with architecture, code, and explanations

---

## Project Overview

| # | Project | Difficulty | Tech Stack |
|---|---------|-----------|-----------|
| 1 | AI PDF Chatbot | Beginner | ChromaDB + Ollama + Streamlit |
| 2 | Company Knowledge Assistant | Intermediate | ChromaDB + OpenAI + FastAPI |
| 3 | AI Research Assistant | Intermediate | FAISS + Ollama + Multi-query |
| 4 | AI Legal Document Assistant | Advanced | Pinecone + GPT-4 + Parent-Child |
| 5 | AI Medical Knowledge System | Advanced | ChromaDB + GPT-4 + Guardrails |
| 6 | AI Customer Support Chatbot | Intermediate | Redis + ChromaDB + LangGraph |
| 7 | AI Documentation Search Engine | Advanced | Hybrid Search + Re-ranking |
| 8 | AI Resume Search System | Intermediate | FAISS + Metadata filtering |
| 9 | AI Enterprise Search Platform | Expert | Multi-agent + Graph RAG |
| 10 | AI Multi-Agent Knowledge System | Expert | LangGraph + Multi-agent + LangSmith |

---

## Project 1 — AI PDF Chatbot with Streamlit UI

### Architecture
```
user browser
    ↓
Streamlit Web App
    ↓
Upload PDF → Chunk → Embed → ChromaDB
    ↓
User asks question → Retrieve → Ollama LLM → Answer
```

### Folder Structure
```
project1_pdf_chatbot/
├── app.py              ← Streamlit UI + RAG logic
├── requirements.txt
└── README.md
```

### Full Code

```python
# app.py — Complete PDF Chatbot with Streamlit UI

import streamlit as st
import os
import tempfile
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain.prompts import PromptTemplate

# --- Page Config ---
st.set_page_config(
    page_title="AI PDF Chatbot",
    page_icon="📄",
    layout="wide"
)

# --- Initialize Components (cached to avoid reloading) ---
@st.cache_resource
def get_embeddings():
    return SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

@st.cache_resource
def get_llm():
    return OllamaLLM(model="llama3.2", temperature=0)

@st.cache_data
def process_pdf(pdf_bytes: bytes, filename: str):
    """Load, chunk, and embed a PDF. Cached by file content."""
    
    # Save to temp file (PyPDFLoader needs a file path)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(pdf_bytes)
        tmp_path = tmp.name
    
    try:
        loader = PyPDFLoader(tmp_path)
        pages = loader.load()
        
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500, chunk_overlap=50
        )
        chunks = splitter.split_documents(pages)
        
        embeddings = get_embeddings()
        vector_store = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
        )
        
        return vector_store, len(chunks), len(pages)
    finally:
        os.unlink(tmp_path)  # Clean up temp file

def ask_pdf(question: str, vector_store, llm) -> dict:
    """RAG query against the uploaded PDF."""
    
    docs = vector_store.similarity_search_with_score(question, k=4)
    
    if not docs:
        return {"answer": "I couldn't find relevant information.", "sources": []}
    
    context = "\n\n".join([doc.page_content for doc, _ in docs])
    sources = [f"Page {doc.metadata.get('page', '?') + 1}" for doc, _ in docs]
    
    prompt = f"""You are an AI assistant analyzing a PDF document.
Answer the question using ONLY the information from the document.
If the answer isn't in the document, say "This information is not in the document."

Document Content:
{context}

Question: {question}

Answer:"""
    
    answer = llm.invoke(prompt)
    return {"answer": answer, "sources": list(set(sources))}

# --- Streamlit UI ---
st.title("AI PDF Chatbot")
st.caption("Upload any PDF and start asking questions!")

col1, col2 = st.columns([1, 2])

with col1:
    st.subheader("Upload PDF")
    uploaded_file = st.file_uploader("Choose a PDF file", type=["pdf"])
    
    if uploaded_file:
        with st.spinner("Processing PDF..."):
            vector_store, num_chunks, num_pages = process_pdf(
                uploaded_file.read(), uploaded_file.name
            )
        st.success(f"Ready! Indexed {num_chunks} chunks from {num_pages} pages")
        st.session_state.vector_store = vector_store

with col2:
    st.subheader("Ask Questions")
    
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    # Display conversation history
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
            if "sources" in message:
                st.caption(f"Sources: {', '.join(message['sources'])}")
    
    # Chat input
    if prompt := st.chat_input("Ask something about your PDF..."):
        if "vector_store" not in st.session_state:
            st.error("Please upload a PDF first!")
        else:
            # Add user message
            st.session_state.messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)
            
            # Get AI answer
            with st.chat_message("assistant"):
                with st.spinner("Searching and generating answer..."):
                    llm = get_llm()
                    result = ask_pdf(prompt, st.session_state.vector_store, llm)
                
                st.markdown(result["answer"])
                if result["sources"]:
                    st.caption(f"From: {', '.join(result['sources'])}")
                
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": result["answer"],
                    "sources": result["sources"]
                })
```

Run with: `streamlit run app.py`

---

## Project 2 — Company Knowledge Assistant

### Architecture
```
Company Docs (PDFs, TXT, DOCX)
        ↓
Ingestion Script (run once)
        ↓
ChromaDB Vector Store
        ↓
FastAPI REST API
        ↓
Any Frontend (React, Streamlit, Slack bot)
```

### Core Files

```python
# ingest.py — Run this ONCE to index all company documents
import sys
from pathlib import Path
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings

def ingest_company_docs(docs_folder: str = "./company_docs"):
    """Index all company documents."""
    
    print(f"Ingesting from: {docs_folder}")
    
    loader = DirectoryLoader(
        docs_folder,
        glob="**/*",
        use_multithreading=True  # Process multiple files at once
    )
    docs = loader.load()
    print(f"Loaded {len(docs)} documents")
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=60
    )
    chunks = splitter.split_documents(docs)
    print(f"Created {len(chunks)} chunks")
    
    embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    
    Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory="./company_vector_db"
    )
    
    print(f"Done! {len(chunks)} chunks indexed and saved.")

if __name__ == "__main__":
    folder = sys.argv[1] if len(sys.argv) > 1 else "./company_docs"
    ingest_company_docs(folder)
```

---

## Project 3 — AI Research Assistant

This assistant helps researchers find information across academic papers.

```python
# research_assistant.py

from langchain.retrievers.multi_query import MultiQueryRetriever
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain.prompts import PromptTemplate

class ResearchAssistant:
    """AI assistant for research papers and technical documents."""
    
    def __init__(self, vector_db_path: str = "./research_db"):
        self.embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
        self.llm = OllamaLLM(model="llama3.2", temperature=0.1)
        
        self.vector_store = Chroma(
            persist_directory=vector_db_path,
            embedding_function=self.embeddings
        )
        
        # Multi-query retriever for better research coverage
        self.retriever = MultiQueryRetriever.from_llm(
            retriever=self.vector_store.as_retriever(search_kwargs={"k": 3}),
            llm=self.llm
        )
        
        self.prompt = PromptTemplate(
            input_variables=["context", "question"],
            template="""You are an expert research assistant with deep academic knowledge.
Analyze the provided research context and answer the question thoroughly.
Include: key findings, methodology if relevant, and limitations.
Always distinguish between what the research says vs your own interpretation.

Research Context:
{context}

Research Question: {question}

Detailed Analysis:"""
        )
    
    def research(self, question: str) -> dict:
        """Research a question across all indexed papers."""
        docs = self.retriever.invoke(question)
        
        context_parts = []
        papers = set()
        
        for doc in docs:
            source = doc.metadata.get("source", "unknown paper")
            context_parts.append(f"[From: {source}]\n{doc.page_content}")
            papers.add(source)
        
        context = "\n\n".join(context_parts)
        answer = self.llm.invoke(self.prompt.format(context=context, question=question))
        
        return {"answer": answer, "papers_consulted": list(papers)}
    
    def run(self):
        """Interactive research session."""
        print("AI Research Assistant")
        print("Enter your research questions (type 'quit' to exit)")
        print("=" * 60)
        
        while True:
            question = input("\nResearch Question: ").strip()
            if question.lower() == "quit":
                break
            if question:
                result = self.research(question)
                print(f"\nAnalysis:\n{result['answer']}")
                print(f"\nPapers Consulted: {', '.join(result['papers_consulted'])}")

if __name__ == "__main__":
    assistant = ResearchAssistant()
    assistant.run()
```

---

## Project 6 — AI Customer Support Chatbot with LangGraph

```python
# support_bot.py
# Stateful customer support with escalation logic

from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain_core.documents import Document

class SupportState(TypedDict):
    customer_id: str
    question: str
    category: str        # billing, technical, general
    documents: List[Document]
    answer: str
    needs_human: bool    # True if AI can't resolve it

# Sample knowledge base
kb_docs = [
    Document(page_content="To reset password: click 'Forgot Password' on login page.", 
             metadata={"category": "technical"}),
    Document(page_content="Billing disputes: email billing@company.com within 30 days.",
             metadata={"category": "billing"}),
    Document(page_content="Service outages are posted at status.company.com",
             metadata={"category": "technical"}),
    Document(page_content="Refunds processed in 5-7 business days to original payment method.",
             metadata={"category": "billing"}),
]

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma.from_documents(kb_docs, embeddings)
llm = OllamaLLM(model="llama3.2")

def classify_ticket(state: SupportState) -> SupportState:
    """Classify the support ticket category."""
    prompt = f"""Classify this support request:
Question: "{state['question']}"
Categories: billing, technical, general
Reply with ONE word only:"""
    category = llm.invoke(prompt).strip().lower()
    if "billing" in category:
        cat = "billing"
    elif "technical" in category or "tech" in category:
        cat = "technical"
    else:
        cat = "general"
    print(f"[Support] Category: {cat}")
    return {"category": cat}

def retrieve_solution(state: SupportState) -> SupportState:
    """Find relevant knowledge base articles."""
    docs = vector_store.similarity_search(state["question"], k=3,
           filter={"category": state["category"]} if state["category"] != "general" else None)
    return {"documents": docs}

def generate_response(state: SupportState) -> SupportState:
    """Generate support response."""
    context = "\n".join([d.page_content for d in state["documents"]])
    
    if not context.strip():
        return {"answer": "I'll need to connect you with a human agent for this.", "needs_human": True}
    
    prompt = f"""You are a friendly customer support agent.
Use the knowledge base to help the customer.
Be empathetic and professional.

Knowledge Base:
{context}

Customer Question: {state['question']}

Your Response:"""
    
    answer = llm.invoke(prompt)
    needs_human = "human agent" in answer.lower() or not state["documents"]
    return {"answer": answer, "needs_human": needs_human}

def escalate_to_human(state: SupportState) -> SupportState:
    """Escalate complex issues to human agents."""
    print(f"[Support] Escalating to human agent — Customer: {state['customer_id']}")
    return {"answer": f"{state['answer']}\n\n[A human agent will contact you within 4 hours. Ticket #{state['customer_id'][:6].upper()}]"}

def route_after_response(state: SupportState) -> str:
    return "escalate" if state.get("needs_human") else "done"

# Build graph
workflow = StateGraph(SupportState)
workflow.add_node("classify", classify_ticket)
workflow.add_node("retrieve", retrieve_solution)
workflow.add_node("respond", generate_response)
workflow.add_node("escalate", escalate_to_human)
workflow.set_entry_point("classify")
workflow.add_edge("classify", "retrieve")
workflow.add_edge("retrieve", "respond")
workflow.add_conditional_edges("respond", route_after_response,
                               {"escalate": "escalate", "done": END})
workflow.add_edge("escalate", END)

app = workflow.compile()

# Test
result = app.invoke({
    "customer_id": "cust_abc123",
    "question": "How do I reset my password?",
    "category": "", "documents": [], "answer": "", "needs_human": False
})
print(f"\nSupport Response:\n{result['answer']}")
```

---

## Project 8 — AI Resume Search System

```python
# resume_search.py
# Search and match resumes to job descriptions

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_core.documents import Document
from langchain_ollama import OllamaLLM

# Sample resumes (in production, load from PDF files)
resumes = [
    Document(
        page_content="Sarah Chen - Senior Python Developer. Skills: Python, FastAPI, LangChain, RAG, Docker, AWS. Experience: 7 years. Built 3 production AI systems.",
        metadata={"name": "Sarah Chen", "experience_years": 7, "role": "developer"}
    ),
    Document(
        page_content="Ahmed Al-Rashid - Data Scientist. Skills: Python, ML, TensorFlow, PyTorch, SQL, Tableau. Experience: 5 years. Led ML pipeline at fintech startup.",
        metadata={"name": "Ahmed Al-Rashid", "experience_years": 5, "role": "data_scientist"}
    ),
    Document(
        page_content="Priya Patel - AI Engineer. Skills: LangChain, LangGraph, OpenAI API, Python, Vector Databases, Prompt Engineering. Experience: 3 years.",
        metadata={"name": "Priya Patel", "experience_years": 3, "role": "ai_engineer"}
    ),
    Document(
        page_content="James Rodriguez - Frontend Developer. Skills: React, TypeScript, Next.js, CSS, GraphQL. Experience: 6 years. Built scalable UIs for 10M+ users.",
        metadata={"name": "James Rodriguez", "experience_years": 6, "role": "frontend"}
    ),
]

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma.from_documents(resumes, embeddings)
llm = OllamaLLM(model="llama3.2")

def find_candidates(job_description: str, top_k: int = 3) -> list:
    """Find the best matching candidates for a job."""
    
    # Search for semantically similar resumes
    matches = vector_store.similarity_search_with_score(job_description, k=top_k)
    
    results = []
    for doc, score in matches:
        # Ask LLM to evaluate the match
        eval_prompt = f"""Rate this candidate's fit for the job on a scale of 1-10.

Job Description: {job_description}

Candidate Profile: {doc.page_content}

Give a score (1-10) and ONE sentence explanation. Format: "Score: X - Reason"
"""
        evaluation = llm.invoke(eval_prompt).strip()
        
        results.append({
            "name": doc.metadata.get("name"),
            "profile": doc.page_content,
            "similarity_score": round(1 - score, 3),
            "ai_evaluation": evaluation
        })
    
    return results

# Test it
job = """
We are looking for an AI Engineer with experience in LangChain, RAG systems,
Python, and vector databases. Must have built production AI applications.
3+ years of experience required.
"""

print("Finding best candidates for AI Engineer role...\n")
candidates = find_candidates(job)

for i, candidate in enumerate(candidates, 1):
    print(f"Rank {i}: {candidate['name']}")
    print(f"  Similarity: {candidate['similarity_score']}")
    print(f"  AI Evaluation: {candidate['ai_evaluation']}")
    print()
```

---

## Project 10 — AI Multi-Agent Knowledge System

```python
# multi_agent_knowledge.py
# Enterprise knowledge system with specialized agents

from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain_ollama import OllamaLLM
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_core.documents import Document

class EnterpriseState(TypedDict):
    user_id: str
    department: str
    question: str
    sub_questions: List[str]   # Decomposed sub-questions
    retrieved_facts: List[str] # Gathered from multiple sources
    draft_answer: str
    final_answer: str
    confidence: str

llm = OllamaLLM(model="llama3.2")

# Department knowledge bases
hr_docs = [Document(page_content="PTO: 20 days/year, carry-over max 5 days.")]
finance_docs = [Document(page_content="Budget requests over $5K need VP approval.")]
tech_docs = [Document(page_content="AWS credentials via AWS SSO, never stored locally.")]

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
hr_db = Chroma.from_documents(hr_docs, embeddings, collection_name="hr_multi")
finance_db = Chroma.from_documents(finance_docs, embeddings, collection_name="fin_multi")
tech_db = Chroma.from_documents(tech_docs, embeddings, collection_name="tech_multi")

def query_planner(state: EnterpriseState) -> EnterpriseState:
    """Break complex question into sub-questions."""
    prompt = f"""Break this question into 2-3 specific sub-questions that can be answered separately:
Question: "{state['question']}"
Format: List each sub-question on a new line starting with "- "
Sub-questions:"""
    response = llm.invoke(prompt)
    sub_questions = [line.strip("- ").strip() for line in response.split("\n") if line.strip().startswith("-")]
    return {"sub_questions": sub_questions or [state["question"]]}

def parallel_researcher(state: EnterpriseState) -> EnterpriseState:
    """Search all knowledge bases for each sub-question."""
    all_facts = []
    
    for sub_q in state["sub_questions"][:3]:
        for db, dept in [(hr_db, "HR"), (finance_db, "Finance"), (tech_db, "Tech")]:
            docs = db.similarity_search(sub_q, k=1)
            for doc in docs:
                all_facts.append(f"[{dept}]: {doc.page_content}")
    
    return {"retrieved_facts": list(set(all_facts))}  # Deduplicate

def synthesizer(state: EnterpriseState) -> EnterpriseState:
    """Synthesize all retrieved facts into a complete answer."""
    facts = "\n".join(state["retrieved_facts"])
    
    prompt = f"""Synthesize these facts to answer the question comprehensively:
Question: {state["question"]}
Facts:
{facts}

Comprehensive Answer:"""
    
    answer = llm.invoke(prompt)
    return {"draft_answer": answer}

def quality_checker(state: EnterpriseState) -> EnterpriseState:
    """Check if the answer is complete and accurate."""
    prompt = f"""Rate the completeness of this answer (high/medium/low):
Question: {state["question"]}
Answer: {state["draft_answer"]}
Rating:"""
    
    confidence = llm.invoke(prompt).strip().lower()
    confidence = "high" if "high" in confidence else "medium" if "medium" in confidence else "low"
    
    final_answer = state["draft_answer"]
    if confidence == "low":
        final_answer += "\n\n[Note: This answer may be incomplete. Please consult your department head for full details.]"
    
    return {"final_answer": final_answer, "confidence": confidence}

# Build the graph
workflow = StateGraph(EnterpriseState)
workflow.add_node("planner", query_planner)
workflow.add_node("researcher", parallel_researcher)
workflow.add_node("synthesizer", synthesizer)
workflow.add_node("quality_checker", quality_checker)
workflow.set_entry_point("planner")
workflow.add_edge("planner", "researcher")
workflow.add_edge("researcher", "synthesizer")
workflow.add_edge("synthesizer", "quality_checker")
workflow.add_edge("quality_checker", END)
app = workflow.compile()

# Test
result = app.invoke({
    "user_id": "emp_001", "department": "engineering",
    "question": "I need to buy $3000 of AWS credits. What is the approval process and how do I set up AWS access?",
    "sub_questions": [], "retrieved_facts": [], "draft_answer": "", "final_answer": "", "confidence": ""
})
print(f"Final Answer:\n{result['final_answer']}")
print(f"Confidence: {result['confidence']}")
```

---

## Best Practices Across All Projects

```
Consistency Principles:
1. Always separate ingestion from query pipeline
2. Always use metadata (source, page, date, category)
3. Always validate and sanitize user input
4. Always cache expensive operations
5. Always log queries for monitoring and improvement
6. Always evaluate with RAGAS before going to production
7. Always handle the "not found" case gracefully
8. Always version your vector stores (v1, v2, v3...)
```

---

> **Up Next: Phase 15 — Evaluation & Debugging**
> Learn exactly how to measure, debug, and continuously improve your RAG systems.
