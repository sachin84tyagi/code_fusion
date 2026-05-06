# 📚 Phase 10 — LangGraph + RAG
### "Stateful Knowledge Retrieval and Agentic Document Processing"

> **Difficulty**: ⭐⭐⭐⭐ Advanced | **Time**: ~90 minutes | **Prerequisites**: Phase 9 + LangChain RAG knowledge

---

## 🎯 What You'll Learn

- ✅ Why RAG needs LangGraph (standard RAG limitations)
- ✅ Adaptive RAG — route queries to different retrievers
- ✅ Corrective RAG — evaluate and re-retrieve if needed
- ✅ Agentic RAG — agent decides when to retrieve
- ✅ Multi-source RAG with stateful queries
- ✅ Build: Smart Document QA, Research Bot

---

## 📖 Lesson 10.1 — Why RAG Needs LangGraph

### Standard RAG (Limitations)

```
Standard RAG (LangChain only):
─────────────────────────────────────────────
Query → Retrieve → Stuff into prompt → Answer
         (one shot, no quality check)

Problems:
✗ Retrieved docs might be irrelevant
✗ Answer might be wrong — no verification
✗ Can't retry with different search
✗ Can't route to different knowledge sources
✗ No reasoning about WHEN to retrieve
─────────────────────────────────────────────
```

### Agentic RAG with LangGraph

```
Agentic RAG (LangGraph):
─────────────────────────────────────────────
Query
  ↓
[Understand query type]
  ↙       ↓         ↘
Simple  Complex    Factual
query   question   lookup
  ↓         ↓          ↓
Direct   Multi-hop  DB lookup
answer   retrieval   
  ↓         ↓          ↓
[Evaluate answer quality]
  ├── Good → Return answer
  └── Poor → Re-retrieve with better query
─────────────────────────────────────────────
```

---

## 📖 Lesson 10.2 — Corrective RAG (CRAG)

The core idea: after retrieving, check if the docs are relevant. If not, try again.

```python
# ============================================================
# FILE: 08_rag/corrective_rag.py
# PURPOSE: RAG with retrieval quality checking
# Install: pip install langchain-community chromadb langchain-ollama
# ============================================================

from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import TypedDict, Annotated, List, Optional, Literal
import operator

llm = ChatOllama(model="llama3.2", temperature=0)
parser = StrOutputParser()

# ---- Build a sample knowledge base ----
sample_docs = [
    Document(page_content="LangGraph is a library for building stateful multi-actor applications with LLMs. It provides tools for creating complex AI workflows with cycles and conditional logic.", metadata={"source": "langgraph_docs"}),
    Document(page_content="LangChain is a framework for developing applications powered by language models. Key components include models, prompts, chains, and agents.", metadata={"source": "langchain_docs"}),
    Document(page_content="Vector databases store embeddings for semantic search. Popular options include Chroma, Pinecone, Weaviate, and FAISS.", metadata={"source": "vectordb_guide"}),
    Document(page_content="RAG (Retrieval-Augmented Generation) enhances LLM responses with relevant context from a knowledge base, reducing hallucinations.", metadata={"source": "rag_guide"}),
    Document(page_content="Python was created by Guido van Rossum in 1991. It emphasizes code readability and supports multiple programming paradigms.", metadata={"source": "python_docs"}),
]

print("⏳ Creating vector store...")
embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectorstore = Chroma.from_documents(sample_docs, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
print("✅ Knowledge base ready!")

# ---- Relevance Grader ----
class GradeDocuments(BaseModel):
    """Score retrieved document relevance."""
    relevant: bool = Field(description="True if document is relevant to the question")
    score: int = Field(description="Relevance score 0-10", ge=0, le=10)

relevance_grader = llm.with_structured_output(GradeDocuments)

# ---- Answer Grader ----
class GradeAnswer(BaseModel):
    """Grade the quality of an answer."""
    supported: bool = Field(description="True if answer is supported by documents")
    useful: bool = Field(description="True if answer actually addresses the question")
    hallucination: bool = Field(description="True if answer contains hallucinated info")

answer_grader = llm.with_structured_output(GradeAnswer)

# ---- State ----
class CRAGState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    question: str
    retrieved_docs: List[Document]
    relevant_docs: List[Document]
    generation: Optional[str]
    retrieval_attempts: int
    web_search_needed: bool
    final_answer: Optional[str]

# ---- Nodes ----
def retrieve_node(state: CRAGState) -> dict:
    """Retrieve documents from knowledge base."""
    print(f"  🔍 Retrieving... (attempt {state.get('retrieval_attempts', 0) + 1})")
    
    docs = retriever.invoke(state["question"])
    return {
        "retrieved_docs": docs,
        "retrieval_attempts": state.get("retrieval_attempts", 0) + 1
    }

def grade_documents_node(state: CRAGState) -> dict:
    """Filter out irrelevant documents."""
    print("  📊 Grading document relevance...")
    
    relevant = []
    for doc in state["retrieved_docs"]:
        grade = relevance_grader.invoke(
            f"Question: {state['question']}\n\nDocument: {doc.page_content[:300]}\n\nIs this document relevant?"
        )
        if grade.relevant and grade.score >= 5:
            relevant.append(doc)
            print(f"    ✅ Relevant (score: {grade.score}): {doc.page_content[:60]}...")
        else:
            print(f"    ❌ Not relevant (score: {grade.score}): {doc.page_content[:60]}...")
    
    web_needed = len(relevant) == 0
    print(f"  📋 {len(relevant)} relevant docs | Web search needed: {web_needed}")
    
    return {"relevant_docs": relevant, "web_search_needed": web_needed}

def web_search_node(state: CRAGState) -> dict:
    """Fallback: mock web search when knowledge base fails."""
    print("  🌐 Performing web search (knowledge base didn't have it)...")
    # In production: use a real search tool
    web_result = Document(
        page_content=f"Web search result for '{state['question']}': [Retrieved from web - in production this would be real search results]",
        metadata={"source": "web_search"}
    )
    return {"relevant_docs": [web_result]}

def generate_answer_node(state: CRAGState) -> dict:
    """Generate answer from relevant documents."""
    print("  💬 Generating answer...")
    
    if not state["relevant_docs"]:
        return {"generation": "I don't have enough information to answer this question accurately."}
    
    context = "\n\n---\n\n".join(d.page_content for d in state["relevant_docs"])
    
    answer = (
        ChatPromptTemplate.from_messages([
            ("system", """Answer the question based ONLY on the provided context.
If the context doesn't contain the answer, say so clearly.
Be accurate and concise."""),
            ("human", "Context:\n{context}\n\nQuestion: {question}")
        ]) | llm | parser
    ).invoke({"context": context, "question": state["question"]})
    
    return {"generation": answer}

def validate_answer_node(state: CRAGState) -> dict:
    """Check if the generated answer is good."""
    print("  ✅ Validating answer quality...")
    
    if not state.get("generation"):
        return {"final_answer": "Unable to generate answer."}
    
    context = "\n".join(d.page_content for d in state["relevant_docs"])
    
    grade = answer_grader.invoke(
        f"Question: {state['question']}\nContext: {context[:500]}\nAnswer: {state['generation'][:300]}\n\nGrade this answer."
    )
    
    print(f"  📊 Answer grade: supported={grade.supported}, useful={grade.useful}, hallucination={grade.hallucination}")
    
    if grade.useful and not grade.hallucination:
        return {"final_answer": state["generation"]}
    else:
        return {"final_answer": None}  # Will trigger re-retrieval

# ---- Routing ----
def route_after_grading(state: CRAGState) -> str:
    if state.get("web_search_needed"):
        return "web_search"
    return "generate"

def route_after_validation(state: CRAGState) -> str:
    if state.get("final_answer"):
        return "end"
    elif state.get("retrieval_attempts", 0) >= 2:
        # Give up after 2 attempts
        return "force_end"
    return "retry"

def force_end_node(state: CRAGState) -> dict:
    """Last resort — just use what we have."""
    return {"final_answer": state.get("generation", "I was unable to find a reliable answer.")}

# ---- Build Graph ----
graph = StateGraph(CRAGState)

for name, fn in [("retrieve", retrieve_node), ("grade_docs", grade_documents_node),
                  ("web_search", web_search_node), ("generate", generate_answer_node),
                  ("validate", validate_answer_node), ("force_end", force_end_node)]:
    graph.add_node(name, fn)

graph.set_entry_point("retrieve")
graph.add_edge("retrieve", "grade_docs")
graph.add_conditional_edges("grade_docs", route_after_grading, {
    "web_search": "web_search",
    "generate": "generate"
})
graph.add_edge("web_search", "generate")
graph.add_edge("generate", "validate")
graph.add_conditional_edges("validate", route_after_validation, {
    "end": END,
    "force_end": "force_end",
    "retry": "retrieve"
})
graph.add_edge("force_end", END)

app = graph.compile()

# ---- Test ----
def ask(question: str) -> str:
    print(f"\n❓ Question: {question}")
    print("-" * 50)
    
    result = app.invoke({
        "messages": [HumanMessage(content=question)],
        "question": question,
        "retrieved_docs": [],
        "relevant_docs": [],
        "generation": None,
        "retrieval_attempts": 0,
        "web_search_needed": False,
        "final_answer": None
    })
    
    print(f"\n✅ Answer: {result['final_answer'][:300]}")
    return result["final_answer"]

ask("What is LangGraph and how does it differ from LangChain?")
ask("What is the capital of Japan?")  # Not in knowledge base — triggers web search
```

---

## 📖 Lesson 10.3 — Agentic RAG (Agent Decides When to Retrieve)

```python
# ============================================================
# FILE: 08_rag/agentic_rag.py
# PURPOSE: Agent that decides WHEN and WHAT to retrieve
# ============================================================

from langgraph.prebuilt import create_react_agent
from langchain_core.tools import tool
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_core.messages import HumanMessage

llm = ChatOllama(model="llama3.2", temperature=0.2)
embeddings = OllamaEmbeddings(model="nomic-embed-text")

# ---- Knowledge bases ----
tech_docs = [
    Document(page_content="Python 3.12 features: improved error messages, faster performance, new type system features.", metadata={"source": "python_changelog"}),
    Document(page_content="FastAPI is a modern web framework for Python APIs. Key features: async support, automatic docs, type hints.", metadata={"source": "fastapi_docs"}),
    Document(page_content="Docker containers package applications with dependencies. Use docker build, docker run commands.", metadata={"source": "docker_guide"}),
]

business_docs = [
    Document(page_content="Q2 2024 revenue: $2.4M (+45% YoY). Top customers: TechCorp, DataCo, StartupX.", metadata={"source": "q2_report"}),
    Document(page_content="Pricing plans: Starter $29/mo, Professional $99/mo, Enterprise custom pricing.", metadata={"source": "pricing_sheet"}),
    Document(page_content="Refund policy: 30-day money-back guarantee. Process via billing@company.com.", metadata={"source": "policies"}),
]

tech_store = Chroma.from_documents(tech_docs, embeddings, collection_name="tech")
biz_store = Chroma.from_documents(business_docs, embeddings, collection_name="business")

# ---- Tools ----
@tool
def search_technical_docs(query: str) -> str:
    """Search technical documentation about Python, APIs, Docker, and programming.
    Use for: technical questions, how-to guides, documentation."""
    docs = tech_store.similarity_search(query, k=2)
    if not docs:
        return "No technical documentation found for this query."
    return "\n\n".join(f"[{d.metadata['source']}]: {d.page_content}" for d in docs)

@tool
def search_business_docs(query: str) -> str:
    """Search business documents about pricing, revenue, policies, and company info.
    Use for: pricing questions, refunds, business metrics."""
    docs = biz_store.similarity_search(query, k=2)
    if not docs:
        return "No business documentation found for this query."
    return "\n\n".join(f"[{d.metadata['source']}]: {d.page_content}" for d in docs)

@tool
def answer_from_knowledge(question: str) -> str:
    """Answer a question using general knowledge (no retrieval needed).
    Use for: simple facts, well-known information, basic questions."""
    return f"Answering from general knowledge: {question}"

# ---- Create agentic RAG ----
rag_agent = create_react_agent(
    llm,
    [search_technical_docs, search_business_docs, answer_from_knowledge],
    prompt="You are a helpful assistant with access to technical and business knowledge bases. Always use the most appropriate tool to retrieve relevant information before answering."
)

# ---- Test ----
questions = [
    "What are the key features of FastAPI?",
    "What is the refund policy?",
    "What is 2 + 2?",  # General knowledge — no retrieval needed
    "What are the pricing plans and how does FastAPI help with APIs?",  # Needs both!
]

print("🤖 Agentic RAG Demo\n")
for q in questions:
    print(f"❓ {q}")
    result = rag_agent.invoke({"messages": [HumanMessage(content=q)]})
    print(f"🤖 {result['messages'][-1].content[:200]}\n")
```

---

## 🎯 Mini Challenges

**Challenge 1**: Build a "Self-Querying RAG" — when a user's question is vague, the agent first generates a better, more specific query, then retrieves and answers.

**Challenge 2**: Create a "Multi-Hop RAG" — answers questions that require chaining two pieces of information (e.g., "Who founded the company that made the language Python uses?").

**Challenge 3**: Build a "Fact-Checker RAG" — takes an AI-generated answer and verifies each claim against a knowledge base, flagging unsupported statements.

---

## ✅ Phase 10 Recap

| Pattern | Purpose |
|---------|---------|
| Corrective RAG (CRAG) | Grade relevance, re-retrieve if poor |
| Adaptive RAG | Route to different retrieval strategies |
| Agentic RAG | Agent decides when/what to retrieve |
| Self-RAG | Model grades its own output |
| Multi-hop RAG | Chain multiple retrievals |

---

## 🚀 What's Next?

**Phase 11** — Real Industry Projects: build 8 complete production applications combining everything from Phases 1-10!

> **Go to**: `Phase11_Projects/lesson.md` →

---

*Phase 10 Complete! 📚 You've combined LangGraph + RAG. This is expert-level AI engineering!*
