# 📚 Phase 9 — RAG (Retrieval-Augmented Generation)
### "Teaching Your AI Your Own Data"

> **Difficulty**: ⭐⭐⭐⭐ Intermediate-Advanced | **Time**: ~120 minutes

---

## 🎯 What You'll Learn

- ✅ What RAG is and why it exists
- ✅ Embeddings explained simply
- ✅ Vector databases (ChromaDB, FAISS)
- ✅ Document loading (PDFs, text, web)
- ✅ Chunking strategies
- ✅ Retrieval and semantic search
- ✅ Build: PDF Chatbot, Knowledge Base

---

## 📖 Lesson 9.1 — The Problem RAG Solves

### Why RAG Exists

```
WITHOUT RAG:
User: "What is our company's refund policy?"
AI: "I don't have access to your company's specific policies..."

WITH RAG:
User: "What is our company's refund policy?"
AI reads company docs → Finds relevant section → 
AI: "Based on your company handbook, the refund policy is:
     - 30 days no questions asked
     - Items must be unopened
     - Refund processed within 5 business days"
```

### How RAG Works (The Big Picture)

```
INDEXING PHASE (done once):
    Documents (PDFs, docs, web)
           ↓
    [Text Splitter] → Chunks of text
           ↓
    [Embedding Model] → Vectors (numbers that represent meaning)
           ↓
    [Vector Database] → Stored for searching
    
RETRIEVAL PHASE (done every query):
    User Question
           ↓
    [Embed the question] → Question vector
           ↓
    [Search Vector DB] → Find similar chunks
           ↓
    [LLM + Retrieved Chunks] → Answer!
```

---

## 📖 Lesson 9.2 — Understanding Embeddings

### What Are Embeddings?

Embeddings convert text into numbers that capture **meaning**. Similar meanings = similar numbers.

```python
"The cat sat on the mat"  → [0.2, 0.8, 0.1, 0.9, ...]  (384 numbers)
"A feline rested on a rug" → [0.21, 0.79, 0.11, 0.88, ...] (similar numbers!)
"Python is a programming language" → [0.9, 0.1, 0.7, 0.2, ...] (very different)
```

This allows AI to find **semantically similar** text even if exact words differ!

### Simple Embedding Example

```python
# ============================================================
# FILE: rag/understanding_embeddings.py
# PURPOSE: See what embeddings actually look like
# ============================================================

# Install: pip install langchain-ollama

from langchain_ollama import OllamaEmbeddings

# Create embedding model
embeddings = OllamaEmbeddings(model="nomic-embed-text")
# Pull first: ollama pull nomic-embed-text

# Embed some sentences
sentences = [
    "I love Python programming",
    "Python is my favorite coding language",  # Similar to above
    "The weather is beautiful today",          # Very different
]

vectors = embeddings.embed_documents(sentences)

print(f"Each sentence → {len(vectors[0])} numbers")
print(f"\nFirst 5 numbers of each vector:")
for i, (sent, vec) in enumerate(zip(sentences, vectors)):
    print(f"  '{sent[:40]}...' → {[round(v, 3) for v in vec[:5]]}")

# Calculate similarity (similar sentences = similar vectors)
import numpy as np

def cosine_similarity(vec1, vec2):
    """Higher = more similar (1.0 = identical, 0.0 = completely different)"""
    v1, v2 = np.array(vec1), np.array(vec2)
    return float(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))

print("\n📊 Similarity Scores:")
print(f"  Python vs Python2: {cosine_similarity(vectors[0], vectors[1]):.3f} (should be HIGH)")
print(f"  Python vs Weather: {cosine_similarity(vectors[0], vectors[2]):.3f} (should be LOW)")
```

---

## 📖 Lesson 9.3 — Complete RAG Pipeline

```python
# ============================================================
# FILE: rag/complete_rag_pipeline.py
# PURPOSE: Full RAG system from scratch
# Install: pip install langchain-community chromadb langchain-ollama
# ============================================================

from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# ============================================================
# STEP 1: LOAD DOCUMENTS
# ============================================================

# Load from text file
def load_text_document(filepath: str):
    loader = TextLoader(filepath, encoding='utf-8')
    return loader.load()

# Load from PDF
def load_pdf_document(filepath: str):
    loader = PyPDFLoader(filepath)
    return loader.load()

# For this demo, create a sample document
sample_doc_content = """
TECHCORP AI ASSISTANT HANDBOOK

Section 1: Pricing
Our products are priced as follows:
- Starter Plan: $29/month (up to 5 users, 10GB storage)
- Professional Plan: $99/month (up to 25 users, 100GB storage)  
- Enterprise Plan: Custom pricing (unlimited users, unlimited storage)
All plans include 24/7 customer support.

Section 2: Refund Policy
We offer a 30-day money-back guarantee on all plans.
To request a refund: email billing@techcorp.com with your account ID.
Refunds are processed within 5-7 business days.
No refunds after 30 days.

Section 3: Technical Support
Support channels:
- Email: support@techcorp.com (response within 24 hours)
- Live Chat: Available Mon-Fri 9am-6pm EST
- Phone: 1-800-TECHCORP (Enterprise customers only)

Section 4: Security
We use AES-256 encryption for all data at rest.
All data is backed up daily to multiple geographic locations.
We are SOC2 Type II and GDPR compliant.
Two-factor authentication is available for all accounts.

Section 5: Integration Support
We integrate with: Slack, Teams, Salesforce, HubSpot, Zapier, and 200+ apps.
API documentation available at docs.techcorp.com
Rate limit: 1000 API calls per hour for Professional, 10000 for Enterprise.
"""

# Save sample document
with open("company_handbook.txt", "w") as f:
    f.write(sample_doc_content)

# Load it
from langchain_core.documents import Document
documents = [Document(page_content=sample_doc_content, metadata={"source": "company_handbook.txt"})]

print(f"📄 Loaded {len(documents)} document(s)")
print(f"   Total characters: {sum(len(d.page_content) for d in documents)}")

# ============================================================
# STEP 2: SPLIT INTO CHUNKS
# ============================================================

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,      # Max 300 characters per chunk
    chunk_overlap=50,    # 50 char overlap (so chunks connect smoothly)
    length_function=len,
    separators=["\n\n", "\n", " ", ""]  # Split preference order
)

chunks = text_splitter.split_documents(documents)

print(f"\n✂️ Created {len(chunks)} chunks")
print(f"   Average chunk size: {sum(len(c.page_content) for c in chunks)//len(chunks)} chars")
print(f"\n📋 Sample chunk:")
print(f"   '{chunks[0].page_content[:150]}...'")

# ============================================================
# STEP 3: CREATE EMBEDDINGS AND VECTOR STORE
# ============================================================

print("\n⏳ Creating vector store (this may take a moment)...")

# Use Ollama embeddings (free, local)
# First: ollama pull nomic-embed-text
embeddings = OllamaEmbeddings(model="nomic-embed-text")

# Create ChromaDB vector store
# persist_directory = save to disk so we don't re-embed every time
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"  # Saved to disk
)

print(f"✅ Vector store created with {len(chunks)} chunks")

# ============================================================
# STEP 4: CREATE RETRIEVER
# ============================================================

# Retriever = searches the vector store
retriever = vectorstore.as_retriever(
    search_type="similarity",  # Find most similar chunks
    search_kwargs={"k": 3}     # Return top 3 most relevant chunks
)

# Test retrieval
test_query = "What is the refund policy?"
relevant_docs = retriever.invoke(test_query)
print(f"\n🔍 Query: '{test_query}'")
print(f"   Found {len(relevant_docs)} relevant chunks:")
for i, doc in enumerate(relevant_docs):
    print(f"   Chunk {i+1}: '{doc.page_content[:100]}...'")

# ============================================================
# STEP 5: BUILD THE RAG CHAIN
# ============================================================

# The prompt that combines retrieved context with the question
rag_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a helpful customer support assistant for TechCorp.
    
Answer questions based ONLY on the provided context.
If the answer isn't in the context, say "I don't have that information in my knowledge base."
Be friendly and concise.

CONTEXT:
{context}"""),
    ("human", "{question}")
])

llm = ChatOllama(model="llama3.2", temperature=0.3)
parser = StrOutputParser()

def format_docs(docs):
    """Join retrieved documents into a single context string."""
    return "\n\n---\n\n".join(doc.page_content for doc in docs)

# The complete RAG chain
rag_chain = (
    {
        "context": retriever | format_docs,  # Retrieve and format context
        "question": RunnablePassthrough()     # Pass question through unchanged
    }
    | rag_prompt
    | llm
    | parser
)

# ============================================================
# STEP 6: ASK QUESTIONS!
# ============================================================

print("\n" + "="*60)
print("🤖 TechCorp AI Knowledge Base")
print("="*60)

questions = [
    "How much does the Professional plan cost?",
    "What is your refund policy?",
    "How do I contact technical support?",
    "Is my data encrypted?",
    "Do you integrate with Slack?",
    "What is the capital of France?",  # Should say "not in knowledge base"
]

for question in questions:
    print(f"\n❓ {question}")
    answer = rag_chain.invoke(question)
    print(f"🤖 {answer}")
```

---

## 📖 Lesson 9.4 — PDF Chatbot

```python
# ============================================================
# FILE: rag/projects/pdf_chatbot.py
# PURPOSE: Chat with any PDF file
# Install: pip install pypdf
# ============================================================

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
import os

class PDFChatbot:
    """
    A complete chatbot that can answer questions about any PDF.
    Remembers conversation history!
    """
    
    def __init__(self, pdf_path: str, model: str = "llama3.2"):
        print(f"📄 Loading PDF: {pdf_path}")
        self.llm = ChatOllama(model=model, temperature=0.3)
        self.embeddings = OllamaEmbeddings(model="nomic-embed-text")
        self.store = {}
        
        # Load and process the PDF
        self._load_pdf(pdf_path)
        self._build_rag_chain()
        print("✅ PDF Chatbot ready!")
    
    def _load_pdf(self, pdf_path: str):
        """Load PDF, split into chunks, create vector store."""
        
        # Load PDF
        loader = PyPDFLoader(pdf_path)
        pages = loader.load()
        print(f"  📖 Loaded {len(pages)} pages")
        
        # Split into chunks
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100
        )
        chunks = splitter.split_documents(pages)
        print(f"  ✂️  Created {len(chunks)} chunks")
        
        # Create vector store
        db_path = f"./pdf_db_{os.path.basename(pdf_path).replace('.pdf', '')}"
        
        if os.path.exists(db_path):
            print(f"  ♻️  Loading existing vector store...")
            self.vectorstore = Chroma(
                persist_directory=db_path,
                embedding_function=self.embeddings
            )
        else:
            print(f"  ⏳ Creating vector store (first time takes longer)...")
            self.vectorstore = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                persist_directory=db_path
            )
        
        self.retriever = self.vectorstore.as_retriever(
            search_kwargs={"k": 4}
        )
    
    def _build_rag_chain(self):
        """Build the RAG chain with memory."""
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a helpful document assistant.
            Answer questions based on the provided context from the PDF.
            If the answer isn't in the context, say so honestly.
            Reference specific parts of the document when helpful.
            
            PDF CONTEXT:
            {context}"""),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{question}")
        ])
        
        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)
        
        # RAG chain with memory
        rag_chain = (
            RunnablePassthrough.assign(
                context=lambda x: format_docs(self.retriever.invoke(x["question"]))
            )
            | prompt
            | self.llm
            | StrOutputParser()
        )
        
        def get_history(session_id):
            if session_id not in self.store:
                self.store[session_id] = InMemoryChatMessageHistory()
            return self.store[session_id]
        
        self.chain = RunnableWithMessageHistory(
            rag_chain,
            get_history,
            input_messages_key="question",
            history_messages_key="history"
        )
    
    def chat(self, question: str, session_id: str = "default") -> str:
        """Ask a question about the PDF."""
        return self.chain.invoke(
            {"question": question},
            config={"configurable": {"session_id": session_id}}
        )
    
    def interactive_chat(self):
        """Start an interactive chat session."""
        print("\n💬 PDF Chat Session Started")
        print("Type 'quit' to exit, 'clear' to start fresh\n")
        
        session_id = "session_1"
        
        while True:
            question = input("❓ You: ").strip()
            
            if question.lower() in ["quit", "exit"]:
                print("👋 Goodbye!")
                break
            elif question.lower() == "clear":
                session_id = f"session_{len(self.store) + 1}"
                print("🔄 New conversation started!\n")
                continue
            elif not question:
                continue
            
            response = self.chat(question, session_id)
            print(f"🤖 Bot: {response}\n")

# ---- Usage ----
# Create a sample PDF for testing (or use your own)
def create_sample_pdf():
    """Create a simple sample PDF for testing."""
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
        
        c = canvas.Canvas("sample_document.pdf", pagesize=letter)
        c.setFont("Helvetica", 12)
        
        text_lines = [
            "ANNUAL REPORT 2024",
            "",
            "Executive Summary:",
            "Company revenue grew 45% year-over-year to $12.5 million.",
            "We expanded to 3 new markets: Europe, Asia, and Latin America.",
            "",
            "Key Metrics:",
            "- Active customers: 5,000",
            "- Employee count: 87",
            "- Customer satisfaction: 94%",
            "- Net Promoter Score: 72",
            "",
            "Technology Investments:",
            "We invested $2M in AI infrastructure this year.",
            "Launched our AI product assistant in Q3.",
            "",
            "2025 Goals:",
            "- Reach $20M revenue",
            "- Expand to 10 countries",
            "- Hire 50 new engineers",
        ]
        
        y = 700
        for line in text_lines:
            c.drawString(100, y, line)
            y -= 20
        
        c.save()
        print("✅ Created sample_document.pdf")
        return True
    except ImportError:
        print("📝 To test PDF loading, install reportlab: pip install reportlab")
        print("   Or provide your own PDF file path")
        return False

# Run the chatbot
if create_sample_pdf():
    chatbot = PDFChatbot("sample_document.pdf")
    
    # Test some questions
    print("\n🧪 Testing PDF Chatbot:")
    questions = [
        "What was the revenue growth?",
        "How many employees does the company have?",
        "What are the 2025 goals?",
        "How much was invested in AI?"
    ]
    
    for q in questions:
        print(f"\n❓ {q}")
        print(f"🤖 {chatbot.chat(q)}")
    
    # Uncomment for interactive mode:
    # chatbot.interactive_chat()
```

---

## 📖 Lesson 9.5 — Advanced Chunking Strategies

```python
# ============================================================
# FILE: rag/advanced_chunking.py
# PURPOSE: Smart chunking strategies for better RAG
# ============================================================

from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
    CharacterTextSplitter,
    TokenTextSplitter,
    MarkdownHeaderTextSplitter,
    HTMLHeaderTextSplitter
)

# Sample document
sample_text = """
# Introduction to Machine Learning

Machine learning (ML) is a subset of artificial intelligence.
ML algorithms learn from data without being explicitly programmed.

## Types of Machine Learning

### 1. Supervised Learning
In supervised learning, the algorithm learns from labeled training data.
Examples include classification and regression tasks.
Common algorithms: Linear Regression, Decision Trees, Neural Networks.

### 2. Unsupervised Learning  
Here the algorithm finds patterns in unlabeled data.
Examples include clustering and dimensionality reduction.
Common algorithms: K-Means, PCA, Autoencoders.

### 3. Reinforcement Learning
The agent learns through interaction with an environment.
It receives rewards for good actions and penalties for bad ones.
Used in: game playing, robotics, recommendation systems.
"""

# ---- Strategy 1: Recursive Character Splitter (Best General-Purpose) ----
recursive_splitter = RecursiveCharacterTextSplitter(
    chunk_size=200,
    chunk_overlap=30,
    separators=["\n\n", "\n", ".", " ", ""]
)
recursive_chunks = recursive_splitter.split_text(sample_text)
print(f"📄 Recursive Splitter: {len(recursive_chunks)} chunks")

# ---- Strategy 2: Markdown-Aware Splitter (Best for Markdown Docs) ----
markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=[
        ("#", "Title"),
        ("##", "Section"),
        ("###", "Subsection"),
    ]
)
markdown_chunks = markdown_splitter.split_text(sample_text)
print(f"\n📑 Markdown Splitter: {len(markdown_chunks)} chunks")
for chunk in markdown_chunks:
    print(f"  - Metadata: {chunk.metadata} | Content: '{chunk.page_content[:60]}...'")

# ---- Strategy 3: Token-Based Splitter (Precise token control) ----
# Useful when you know exact token limits
token_splitter = TokenTextSplitter(
    chunk_size=100,    # 100 tokens per chunk
    chunk_overlap=20
)
token_chunks = token_splitter.split_text(sample_text)
print(f"\n🎯 Token Splitter: {len(token_chunks)} chunks")

# ---- Choosing the Right Strategy ----
print("""
📊 CHUNKING STRATEGY GUIDE:
─────────────────────────────────────────────────────
Content Type          → Best Strategy
─────────────────────────────────────────────────────
General text/docs     → RecursiveCharacterTextSplitter
Markdown files        → MarkdownHeaderTextSplitter
HTML pages            → HTMLHeaderTextSplitter
Code files            → Language-specific splitter
Token-sensitive       → TokenTextSplitter
─────────────────────────────────────────────────────

Chunk Size Tips:
- Short chunks (200-400): More precise retrieval, less context
- Long chunks (800-1500): More context, less precise retrieval
- Overlap (10-20%): Ensures important info isn't split across chunks
""")
```

---

## ⚠️ Common RAG Mistakes

### Mistake 1: Chunks Too Large or Too Small

```
❌ Too small (50 chars): "The refund pol-" → loses meaning
❌ Too large (5000 chars): Retrieves too much irrelevant text

✅ Sweet spot: 300-800 characters with 50-100 char overlap
```

### Mistake 2: Not Persisting the Vector Store

```python
# ❌ Re-embeds every time the app starts (slow + expensive!)
vectorstore = Chroma.from_documents(docs, embeddings)

# ✅ Save to disk once, load on subsequent runs
if os.path.exists("./my_db"):
    vectorstore = Chroma(persist_directory="./my_db", embedding_function=embeddings)
else:
    vectorstore = Chroma.from_documents(docs, embeddings, persist_directory="./my_db")
```

---

## 🎯 Mini Challenges

**Challenge 1**: Build a RAG system for a restaurant. Create a text file with: menu items, prices, dietary info, hours. Build a chatbot that answers customer questions.

**Challenge 2**: Create a RAG chatbot for your favorite book or Wikipedia article. Load the text, chunk it, and create a Q&A system.

**Challenge 3**: Build a "Multi-Document RAG" that can answer questions across multiple documents (e.g., multiple company policy files).

---

## ✅ Phase 9 Recap

| Component | Purpose |
|-----------|---------|
| Document Loader | Load PDFs, text, web pages |
| Text Splitter | Break docs into chunks |
| Embedding Model | Convert text to vectors |
| Vector Database | Store and search vectors |
| Retriever | Find relevant chunks |
| RAG Chain | Prompt + Retrieved Context + LLM |

---

## 🚀 What's Next?

**Phase 10 — LangGraph** builds on everything you've learned to create stateful, production-grade AI workflows and multi-agent orchestration systems.

> **Go to**: `Phase10_LangGraph/lesson.md` →

---

*Phase 9 Complete! 📚 You can now build AI that knows YOUR data. This is RAG mastery!*
