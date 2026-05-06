# Phase 09 — Advanced RAG Techniques

> **Level:** Advanced | **Goal:** Master the patterns used in real enterprise RAG systems

---

## 1. Why You Need Advanced RAG

Basic RAG fails in these real situations:

```
Situation 1: "What are all the safety requirements mentioned in Section 4?"
Problem: Section 4 is 20 pages. Basic RAG retrieves only 3 random chunks.
Solution: Parent-Child Retrieval + Summary Retrieval

Situation 2: "Show me contracts from 2024 in the healthcare industry."
Problem: Basic RAG can't filter by metadata during retrieval.
Solution: Self-Query Retriever

Situation 3: "Compare the pricing of Plan A and Plan B"
Problem: The answer requires information from TWO separate parts of the document.
Solution: Multi-Hop Retrieval / Agentic RAG

Situation 4: The document connects companies, people, and dates
Problem: Vector similarity can't capture relationships between entities
Solution: Graph RAG
```

---

## 2. Technique 1: Parent-Child Retrieval

**Problem:** Large chunks = better context. Small chunks = better retrieval precision.

**Solution:** Store small chunks for retrieval BUT return their parent (larger) chunk to the LLM.

```
Document:
┌──────────────────────────────────────────────────────────┐
│          PARENT CHUNK (Full 1500-char section)           │
│  Our refund policy covers all products purchased         │
│  through our official channels. To initiate a refund,   │
│  contact support within 30 days. ... [many more lines]  │
│                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │ Child Chunk 1│ │ Child Chunk 2│ │ Child Chunk 3│     │
│  │ "refund 30   │ │ "contact     │ │ "digital     │     │
│  │  days"       │ │  support"    │ │  non-refund" │     │
│  └──────────────┘ └──────────────┘ └──────────────┘     │
└──────────────────────────────────────────────────────────┘

1. USER ASKS: "What is the refund window?"
2. SEARCH: Small child chunks (fast, precise)
3. RETRIEVER: Finds "refund 30 days" child chunk
4. FETCH: Returns the entire PARENT section to the LLM
5. LLM: Has full context, gives complete answer!
```

```python
# parent_child_retrieval.py

from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

# Sample document
documents = [
    Document(page_content="""
    SECTION 3: REFUND AND RETURN POLICY
    
    Our refund policy covers all products purchased through our official channels.
    To initiate a refund, contact support within 30 days of purchase.
    Provide your order number and reason for return.
    
    Digital products are non-refundable once downloaded.
    Physical products must be returned in original packaging.
    Damaged or defective items qualify for immediate replacement at no cost.
    
    Processing time: Refunds are credited within 5-7 business days.
    Payment method: Refunds are returned to the original payment method only.
    Exceptions: Gift cards and sale items cannot be refunded.
    """,
    metadata={"source": "policy.pdf", "section": "3"}),
]

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

# Parent splitter: large chunks stored in document store
parent_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

# Child splitter: small chunks indexed in vector store (for precise retrieval)
child_splitter = RecursiveCharacterTextSplitter(chunk_size=150, chunk_overlap=20)

# Vector store for child chunks (searched during retrieval)
child_vectorstore = Chroma(
    embedding_function=embeddings,
    collection_name="child_chunks"
)

# In-memory store for parent chunks (returned to LLM)
parent_docstore = InMemoryStore()

# Create the retriever
retriever = ParentDocumentRetriever(
    vectorstore=child_vectorstore,
    docstore=parent_docstore,
    child_splitter=child_splitter,
    parent_splitter=parent_splitter,
)

# Add documents (splits into parent AND child automatically)
retriever.add_documents(documents)

# Search returns PARENT chunks (big context!)
results = retriever.invoke("How long do I have to request a refund?")

print("Results (notice: full parent sections returned, not tiny child chunks):")
for doc in results:
    print(f"\n--- Source: {doc.metadata.get('source', '?')} ---")
    print(doc.page_content[:400])
```

---

## 3. Technique 2: Self-Query Retriever

**Problem:** User wants to filter by metadata (date, category, author) in natural language.
**Solution:** LLM converts the user's question into both a semantic query AND a metadata filter.

```
User asks: "What are the refund policies updated in 2024 for enterprise customers?"

Self-Query LLM parses this as:
  semantic_query: "refund policy"
  metadata_filter: {
      "year": 2024,
      "customer_type": "enterprise"
  }

Vector search uses BOTH! Much more precise results.
```

```python
# self_query_retrieval.py

from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain.chains.query_constructor.base import AttributeInfo
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain_core.documents import Document

# Documents with rich metadata
documents = [
    Document(page_content="Enterprise refund policy: 60-day return window for all products",
             metadata={"year": 2024, "category": "refunds", "plan": "enterprise"}),
    Document(page_content="Basic plan refund: 14-day return, no exceptions",
             metadata={"year": 2023, "category": "refunds", "plan": "basic"}),
    Document(page_content="Enterprise SLA: 99.99% uptime guaranteed with 4-hour response",
             metadata={"year": 2024, "category": "sla", "plan": "enterprise"}),
    Document(page_content="Basic plan support: Email only, 48-hour response time",
             metadata={"year": 2024, "category": "support", "plan": "basic"}),
    Document(page_content="Pro plan pricing: $49/month, includes priority support",
             metadata={"year": 2023, "category": "pricing", "plan": "pro"}),
]

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma.from_documents(documents=documents, embedding=embeddings)

# Tell the retriever what metadata fields exist and what they mean
metadata_field_info = [
    AttributeInfo(name="year", description="The year the document was published", type="integer"),
    AttributeInfo(name="category", description="Category: refunds, sla, support, pricing", type="string"),
    AttributeInfo(name="plan", description="Customer plan: basic, pro, enterprise", type="string"),
]

document_content_description = "Company policy and plan documentation"

llm = OllamaLLM(model="llama3.2")

# Create the self-query retriever
retriever = SelfQueryRetriever.from_llm(
    llm=llm,
    vectorstore=vector_store,
    document_contents=document_content_description,
    metadata_field_info=metadata_field_info,
    verbose=True  # Shows how the LLM parsed the query
)

# Ask a question that requires metadata filtering
results = retriever.invoke("What is the enterprise refund policy from 2024?")
print("\nSelf-Query Results:")
for doc in results:
    print(f"  [{doc.metadata}]: {doc.page_content}")
```

---

## 4. Technique 3: Adaptive RAG

**Problem:** Not every question needs RAG. Some questions are general knowledge.
**Solution:** Route the question to the right strategy based on its type.

```
QUERY ROUTING:

User asks: "What is Python?"
    ↓ Classifier: This is GENERAL KNOWLEDGE
    ↓ Route: Direct LLM (no retrieval needed)

User asks: "What does our API contract say about SLAs?"
    ↓ Classifier: This is PRIVATE COMPANY KNOWLEDGE
    ↓ Route: RAG (search company documents)

User asks: "What happened in AI news this week?"
    ↓ Classifier: This needs REAL-TIME DATA
    ↓ Route: Web search tool

This is Adaptive RAG!
```

```python
# adaptive_rag.py

from langchain_ollama import OllamaLLM
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_core.documents import Document

# --- Router ---
def route_query(question: str, llm) -> str:
    """Use LLM to decide if we need RAG or direct answer."""
    
    router_prompt = f"""Classify this question into ONE of these categories:
- COMPANY: Question about specific company policies, products, or internal data
- GENERAL: General knowledge question (history, science, common facts)
- REALTIME: Question needing current/live data (news, stock prices, weather)

Question: "{question}"

Category (just the one word):"""
    
    category = llm.invoke(router_prompt).strip().upper()
    
    if "COMPANY" in category:
        return "company"
    elif "REALTIME" in category:
        return "realtime"
    else:
        return "general"

# --- RAG System ---
def company_rag(question: str, vector_store, llm) -> str:
    """Answer from company documents."""
    docs = vector_store.similarity_search(question, k=3)
    context = "\n".join([d.page_content for d in docs])
    prompt = f"Use this company info to answer:\n{context}\n\nQuestion: {question}\nAnswer:"
    return llm.invoke(prompt)

def general_answer(question: str, llm) -> str:
    """Answer directly from LLM knowledge."""
    return llm.invoke(f"Answer this question concisely: {question}")

def realtime_answer(question: str) -> str:
    """Would connect to web search in production."""
    return "This question needs real-time data. In production, I would search the web here."

# --- Adaptive RAG Main ---
def adaptive_rag(question: str, vector_store, llm) -> dict:
    """Route the question and get the best answer."""
    
    route = route_query(question, llm)
    
    if route == "company":
        answer = company_rag(question, vector_store, llm)
    elif route == "realtime":
        answer = realtime_answer(question)
    else:
        answer = general_answer(question, llm)
    
    return {"answer": answer, "route": route}

# --- Test ---
from langchain_ollama import OllamaLLM

documents = [
    Document(page_content="Our premium plan costs $99/month with unlimited users"),
    Document(page_content="Support SLA: 1-hour response time for enterprise customers"),
]

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma.from_documents(documents=documents, embedding=embeddings)
llm = OllamaLLM(model="llama3.2")

questions = [
    "How much does our premium plan cost?",  # → company
    "What is the speed of light?",            # → general
    "What is today's Bitcoin price?",         # → realtime
]

for q in questions:
    result = adaptive_rag(q, vector_store, llm)
    print(f"\nQ: {q}")
    print(f"Route: {result['route'].upper()}")
    print(f"A: {result['answer'][:100]}...")
```

---

## 5. Technique 4: Multi-Hop Retrieval

**Problem:** Some questions require combining info from multiple document sections.
**Solution:** Retrieve iteratively — use first answer to form the next retrieval query.

```
User: "What are the cancellation fees for enterprise customers who paid with PayPal?"

Hop 1: Retrieve "enterprise cancellation policy"
        → Found: "Enterprise customers have 60-day cancellation window with 10% fee"

Hop 2: Now retrieve "PayPal refund processing fees"
        → Found: "PayPal charges 2.9% for refund processing"

Final: LLM combines both → "Enterprise customers cancel with 10% fee + 2.9% PayPal processing fee"
```

---

## 6. Technique 5: Graph RAG

**Problem:** Documents have relationships between entities (people, companies, events) that vector search can't capture.

**Solution:** Build a knowledge graph of entities and their relationships, then combine with vector search.

```
Knowledge Graph Example:
  
  Sarah Johnson ──[CEO of]──→ Acme Corp
       │                          │
  [founded]                   [product]
       │                          │
  AI Department              AcmeCloud
       │                          │
  [leads]                    [launched]
       │                          │
  Research Team               Year 2020

Vector RAG: "Who leads research?" → Searches text chunks
Graph RAG: Traverses graph → Sarah → AI Department → Research Team
Result: More accurate for relationship-based questions!
```

---

## 7. Advanced Techniques Quick Reference

| Technique | Use When | Complexity |
|-----------|---------|-----------|
| Parent-Child | Need both precision AND context | Medium |
| Self-Query | Users filter by metadata in natural language | Medium |
| Adaptive RAG | Mix of document questions and general knowledge | High |
| Multi-Hop | Answer requires combining multiple document sections | High |
| Graph RAG | Documents have complex entity relationships | Very High |
| Recursive RAG | Deep research tasks requiring multiple iterations | Very High |

---

## 8. Mini Challenge

1. Take the `parent_child_retrieval.py` code above
2. Add 2 more policy sections to the `documents` list (invent them)
3. Run the code and ask: *"What happens to damaged products?"*
4. Notice the size of the returned chunk vs a basic retrieval
5. Why is the full parent section more useful for the LLM?

---

> **Up Next: Phase 10 — RAG with LangChain**
> Master LangChain's built-in RAG chains, LCEL, and conversational RAG with memory.
