# Phase 06 — Building Your First RAG System

> **Level:** Beginner | **Goal:** Build a working RAG chatbot that answers questions from a PDF

---

## 1. The Big Picture

This is the moment everything comes together!

In Phases 01-05, you learned each ingredient separately:
- **Phase 01:** What RAG is and why it exists
- **Phase 03:** How to convert text to vectors (embeddings)
- **Phase 04:** How to split documents into chunks
- **Phase 05:** How to store and search vectors (vector databases)

Now we **combine all of them** into a working PDF Q&A chatbot.

---

## 2. Full Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    INDEXING PHASE (Run Once)                │
│                                                             │
│  your_document.pdf                                          │
│        ↓                                                    │
│  [PyPDFLoader] → Extracts text from each page              │
│        ↓                                                    │
│  [RecursiveCharacterTextSplitter] → Splits into chunks     │
│        ↓                                                    │
│  [Embedding Model] → Converts each chunk to a vector       │
│        ↓                                                    │
│  [ChromaDB] → Stores all (vector, text) pairs on disk      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    QUERY PHASE (Every Question)             │
│                                                             │
│  User: "What does the document say about refunds?"         │
│        ↓                                                    │
│  [Embedding Model] → Embeds the question                   │
│        ↓                                                    │
│  [ChromaDB] → Finds top 3 most similar chunks              │
│        ↓                                                    │
│  [Prompt Builder] → "Use this context: [chunks]            │
│                      Answer: What does it say about refunds?" │
│        ↓                                                    │
│  [LLM (Ollama/OpenAI)] → Generates final answer            │
│        ↓                                                    │
│  Response delivered to User                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Project Structure

```
Phase06_FirstRAGSystem/
├── lesson.md                  ← This file
└── code/
    ├── sample.txt             ← Sample document to test with
    ├── rag_basic.py           ← Project 1: Simple RAG (no PDF needed)
    ├── rag_pdf_chatbot.py     ← Project 2: PDF Chatbot
    ├── rag_faq_bot.py         ← Project 3: FAQ Chatbot
    └── requirements.txt
```

---

## 4. Project 1 — Simple RAG (No PDF Needed!)

Let's start with the absolute simplest RAG system possible. No PDF files, no complex setup. Just in-memory RAG.

```python
# rag_basic.py
# The simplest possible RAG system
# Uses: local Ollama model + local ChromaDB + local embeddings
# Cost: $0.00

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain.prompts import PromptTemplate

# ============================================================
# PART 1: Build the Knowledge Base
# ============================================================

# Our "documents" — in a real app, these come from PDFs/databases
knowledge_base = [
    "Acme Corp was founded in 1985 in San Francisco, California.",
    "Our CEO is Sarah Johnson, who joined the company in 2018.",
    "We have 5,200 employees across 12 countries.",
    "Our flagship product, AcmeCloud, was launched in 2020 and has 2M users.",
    "Refunds are accepted within 30 days with the original receipt.",
    "Customer support is available 24/7 via chat, email, and phone.",
    "Our free plan includes 5GB storage. Pro plan includes 100GB for $9.99/month.",
    "AcmeCloud integrates with Slack, Teams, Google Workspace, and Salesforce.",
    "Our data centers are located in the US, EU, and Singapore.",
    "We are SOC 2 Type II certified and GDPR compliant.",
]

print("[1] Setting up embedding model...")
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

print("[2] Creating vector store and indexing knowledge base...")
vector_store = Chroma.from_texts(
    texts=knowledge_base,
    embedding=embeddings
)
print(f"    Indexed {len(knowledge_base)} facts")

# ============================================================
# PART 2: Set up the LLM (Using Ollama — FREE!)
# ============================================================
print("[3] Connecting to local LLM via Ollama...")
llm = OllamaLLM(model="llama3.2")

# ============================================================
# PART 3: Create the RAG Prompt Template
# ============================================================
rag_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""You are a helpful AI assistant for Acme Corp.
Use ONLY the following context to answer the question.
If the answer is not in the context, say "I don't have that information."

Context:
{context}

Question: {question}

Answer:"""
)

# ============================================================
# PART 4: The RAG Function — This is the magic!
# ============================================================
def ask_question(question: str) -> str:
    # Step 1: Find relevant chunks from vector store
    relevant_docs = vector_store.similarity_search(question, k=3)
    
    # Step 2: Combine chunks into a single context string
    context = "\n".join([doc.page_content for doc in relevant_docs])
    
    # Step 3: Build the prompt with context + question
    full_prompt = rag_prompt.format(context=context, question=question)
    
    # Step 4: Send to LLM and get answer
    answer = llm.invoke(full_prompt)
    
    return answer

# ============================================================
# PART 5: Test it!
# ============================================================
test_questions = [
    "Who is the CEO of Acme Corp?",
    "How much does the Pro plan cost?",
    "What is the refund policy?",
    "How many employees does the company have?",
    "What is the company's stock price?",  # This info is NOT in our knowledge base
]

print("\n" + "=" * 60)
print("ACME CORP AI ASSISTANT — Ready!")
print("=" * 60)

for question in test_questions:
    print(f"\nQ: {question}")
    answer = ask_question(question)
    print(f"A: {answer}")
    print("-" * 60)
```

---

## 5. Line-by-Line Explanation of Project 1

```python
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
# ↑ Creates our "meaning translator"
# This converts sentences to 384-dimensional vectors for FREE

vector_store = Chroma.from_texts(texts=knowledge_base, embedding=embeddings)
# ↑ Creates an in-memory ChromaDB database
# It embeds all 10 facts and stores them
# (No persist_directory = stored in RAM, lost when program ends)

llm = OllamaLLM(model="llama3.2")
# ↑ Connects to your locally running Ollama
# llama3.2 is a powerful model that runs on your laptop for FREE

rag_prompt = PromptTemplate(...)
# ↑ A template with placeholders: {context} and {question}
# The template tells the LLM: "ONLY use the given context"
# This is called "grounding" — prevents the LLM from making things up

relevant_docs = vector_store.similarity_search(question, k=3)
# ↑ The core of RAG:
# 1. Embeds the question
# 2. Searches ChromaDB for the 3 most similar chunks
# 3. Returns those 3 Document objects

context = "\n".join([doc.page_content for doc in relevant_docs])
# ↑ Joins the 3 chunks into one string separated by newlines
# This becomes the "open book" the LLM reads from

answer = llm.invoke(full_prompt)
# ↑ Sends the full prompt (context + question) to the LLM
# The LLM reads the context and generates a grounded answer
```

---

## 6. Project 2 — PDF Chatbot

This is the real deal — a chatbot that reads a PDF and answers questions from it.

```python
# rag_pdf_chatbot.py

import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain.prompts import PromptTemplate

# ============================================================
# CONFIGURATION
# ============================================================
PDF_PATH = "your_document.pdf"    # ← Replace with your PDF path
VECTOR_DB_PATH = "./pdf_chroma_db"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
LLM_MODEL = "llama3.2"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

# ============================================================
# STEP 1: Load and Index the PDF (only needed once)
# ============================================================
def build_vector_store(pdf_path: str) -> Chroma:
    """Load a PDF, chunk it, embed it, and store in ChromaDB."""
    
    print(f"[1] Loading PDF: {pdf_path}")
    loader = PyPDFLoader(pdf_path)
    pages = loader.load()
    print(f"    Loaded {len(pages)} pages")
    
    print("[2] Splitting into chunks...")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )
    chunks = splitter.split_documents(pages)
    print(f"    Created {len(chunks)} chunks")
    
    print("[3] Embedding chunks and creating vector store...")
    embeddings = SentenceTransformerEmbeddings(model_name=EMBEDDING_MODEL)
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=VECTOR_DB_PATH
    )
    print(f"    Vector store saved to: {VECTOR_DB_PATH}")
    
    return vector_store

def load_existing_store() -> Chroma:
    """Load an already-built vector store from disk."""
    print("[1] Loading existing vector store from disk...")
    embeddings = SentenceTransformerEmbeddings(model_name=EMBEDDING_MODEL)
    return Chroma(
        persist_directory=VECTOR_DB_PATH,
        embedding_function=embeddings
    )

# ============================================================
# STEP 2: The RAG Q&A Function
# ============================================================
def create_rag_chain(vector_store: Chroma):
    """Create the full RAG pipeline."""
    llm = OllamaLLM(model=LLM_MODEL)
    
    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""You are an expert assistant. Use ONLY the provided context to answer.
If the context doesn't contain enough information, say so clearly.
Always cite which part of the document your answer comes from.

Context from the document:
{context}

User Question: {question}

Detailed Answer:"""
    )
    
    def answer_question(question: str) -> dict:
        # Retrieve relevant chunks
        docs = vector_store.similarity_search_with_score(question, k=4)
        
        # Build context with source tracking
        context_parts = []
        sources = []
        
        for doc, score in docs:
            page = doc.metadata.get("page", "?")
            source = doc.metadata.get("source", "document")
            context_parts.append(f"[Page {page}]: {doc.page_content}")
            sources.append(f"Page {page + 1}")
        
        context = "\n\n".join(context_parts)
        
        # Generate answer
        full_prompt = prompt.format(context=context, question=question)
        answer = llm.invoke(full_prompt)
        
        return {
            "answer": answer,
            "sources": list(set(sources)),  # Remove duplicates
        }
    
    return answer_question

# ============================================================
# STEP 3: Interactive Chat Interface
# ============================================================
def run_chatbot():
    """Run an interactive PDF chatbot in the terminal."""
    
    # Build or load vector store
    if os.path.exists(VECTOR_DB_PATH):
        vector_store = load_existing_store()
    else:
        if not os.path.exists(PDF_PATH):
            print(f"ERROR: PDF not found at {PDF_PATH}")
            print("Please place a PDF file at that path and try again.")
            return
        vector_store = build_vector_store(PDF_PATH)
    
    print("\n" + "=" * 60)
    print("PDF AI CHATBOT — Ready to answer your questions!")
    print("Type 'quit' to exit")
    print("=" * 60)
    
    answer_question = create_rag_chain(vector_store)
    
    while True:
        question = input("\nYour Question: ").strip()
        
        if question.lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break
        
        if not question:
            continue
        
        print("\nSearching document and generating answer...")
        result = answer_question(question)
        
        print(f"\nAnswer: {result['answer']}")
        print(f"Sources: {', '.join(result['sources'])}")
        print("-" * 60)

if __name__ == "__main__":
    run_chatbot()
```

---

## 7. Project 3 — FAQ Chatbot (No PDF Required)

```python
# rag_faq_bot.py
# Build a customer support FAQ bot from a simple text list

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain.prompts import PromptTemplate

# Your FAQ data
faq_data = {
    "How do I cancel my subscription?": "You can cancel anytime from Account > Billing > Cancel Subscription. Your access continues until the end of the billing period.",
    "What payment methods do you accept?": "We accept Visa, Mastercard, American Express, PayPal, and bank transfers for annual plans.",
    "Is there a free trial?": "Yes! We offer a 14-day free trial with full access to all Pro features. No credit card required.",
    "How do I export my data?": "Go to Settings > Data > Export. You can export in CSV, JSON, or PDF format.",
    "Can I use the app offline?": "The mobile apps support offline mode for reading. Creating and syncing require an internet connection.",
    "How secure is my data?": "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II certified.",
    "Do you offer team plans?": "Yes! Team plans start at $7/user/month with centralized billing and admin controls.",
    "How do I contact support?": "Email us at support@company.com, chat with us 24/7 on our website, or call +1-800-SUPPORT.",
}

# Convert FAQ into documents (Q + A combined for better retrieval)
faq_documents = [f"Q: {q}\nA: {a}" for q, a in faq_data.items()]

# Build the bot
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma.from_texts(texts=faq_documents, embedding=embeddings)
llm = OllamaLLM(model="llama3.2")

prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""You are a helpful customer support agent.
Use the FAQ information below to answer the customer's question.
Be friendly, concise, and helpful.

FAQ Information:
{context}

Customer Question: {question}

Your Response:"""
)

def get_support_answer(question: str) -> str:
    docs = vector_store.similarity_search(question, k=2)
    context = "\n\n".join([doc.page_content for doc in docs])
    full_prompt = prompt.format(context=context, question=question)
    return llm.invoke(full_prompt)

# Run it
print("Customer Support Bot Ready! (type 'quit' to exit)")
while True:
    user_input = input("\nCustomer: ").strip()
    if user_input.lower() == "quit":
        break
    if user_input:
        response = get_support_answer(user_input)
        print(f"Support: {response}")
```

---

## 8. Common Mistakes & Debugging

| Mistake | Error Message | Fix |
|---------|--------------|-----|
| Ollama not running | `ConnectionRefusedError` | Run `ollama serve` in a separate terminal |
| PDF file not found | `FileNotFoundError` | Check the PDF path is correct |
| Wrong model name | `model not found` | Run `ollama list` to see available models |
| Re-indexing every time | Slow startup | Check if `VECTOR_DB_PATH` exists first |
| Empty context in answer | Hallucinated answers | Check if vector store was built correctly |

---

## 9. Mini Challenge

1. Run `rag_basic.py` and ask it: *"What is the company's refund policy?"*
2. Now add a new fact to `knowledge_base`: `"We were founded by John and Jane Doe in a garage."`
3. Re-run and ask: *"Who founded the company?"*
4. Try asking something NOT in the knowledge base and observe how it responds

---

## Quick Recap

You just built:
- A simple in-memory RAG system with custom knowledge
- A PDF chatbot that reads and answers from a PDF
- A FAQ customer support bot

**The pattern is always the same:**
```
1. Load documents
2. Chunk documents
3. Embed chunks → Vector DB
4. Get user question → Embed → Search DB → Get top-K chunks
5. Build prompt: "Context: [chunks] + Question: [user question]"
6. Send to LLM → Get grounded answer
```

---

> **Up Next: Phase 07 — Retrieval Systems**
> Learn how to make retrieval smarter with hybrid search, re-ranking, and query expansion.
