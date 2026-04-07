# 🎓 RAG Mastery Course
## Chapter 1: Documents & Data Sources
### *Load PDFs, Websites, Databases & APIs into Your Pipeline*

---

> **Professor's Note:** Welcome, future RAG engineer! 🚀 Before machines can answer your questions intelligently, they need to *read* stuff — just like you can't answer an exam question without studying. This chapter is all about the very first step: **getting data IN**. Buckle up!

---

## 📚 Table of Contents

1. [What is a RAG Pipeline? (The Big Picture)](#big-picture)
2. [What Are Document Loaders?](#document-loaders)
3. [Loading PDFs](#loading-pdfs)
4. [Loading Websites](#loading-websites)
5. [Loading Databases](#loading-databases)
6. [Loading APIs](#loading-apis)
7. [Industry Use Cases](#use-cases)
8. [Putting It All Together](#together)
9. [Mini Quiz](#quiz)
10. [What's Next?](#next)

---

## 1. 🗺️ What is a RAG Pipeline? (The Big Picture) {#big-picture}

**RAG = Retrieval-Augmented Generation**

Think of it like this: instead of asking an AI to *memorize* everything, you give it a **library** and teach it to *look things up* before answering.

```
THE RAG PIPELINE — FULL OVERVIEW
═══════════════════════════════════════════════════════════════════════

  YOUR DATA WORLD                    THE PIPELINE                   USER
  ┌─────────────┐                                                  
  │  📄 PDFs    │──┐                                               
  │  🌐 Websites│──┤   ┌──────────┐   ┌──────────┐   ┌────────┐  
  │  🗄️ Database │──┼──▶│  LOAD    │──▶│  CHUNK   │──▶│ EMBED  │  
  │  🔌 APIs    │──┘   │ (Ch. 1)  │   │ (Ch. 2)  │   │(Ch. 3) │  
  └─────────────┘      └──────────┘   └──────────┘   └────┬───┘  
                                                           │        
                                                           ▼        
  ┌──────────────────────────────────────────────┐   ┌────────────┐
  │            VECTOR DATABASE                   │◀──│   STORE    │
  │  [0.23, 0.87, 0.11...]  "AI is amazing"      │   │  (Ch. 4)   │
  │  [0.91, 0.02, 0.65...]  "Python is fun"      │   └────────────┘
  └──────────────────┬───────────────────────────┘        
                     │                                     
            User asks a question                           
                     │                                     
                     ▼                                     
  ┌──────────────────────────────────────────────┐        
  │           RETRIEVE + GENERATE                │──▶ 💬 Answer!
  │  Find similar docs → Feed to LLM → Answer   │        
  └──────────────────────────────────────────────┘        

  ★ YOU ARE HERE: Chapter 1 = The LOAD step ★
═══════════════════════════════════════════════════════════════════════
```

**In this chapter, we focus ONLY on the LOAD step** — feeding raw data into the pipeline.

---

## 2. 🔌 What Are Document Loaders? {#document-loaders}

### Concept

A **Document Loader** is a Python object that knows how to read a specific type of data source and convert it into a standardized format that your pipeline can use.

```
WITHOUT A LOADER (Chaos!):              WITH A LOADER (Clean!):
═══════════════════════════             ══════════════════════════
                                        
PDF  ──▶ binary garbage ??              PDF  ──┐
HTML ──▶ <div><span>mess??              HTML ──┤  ┌────────────┐   ┌──────────────────────┐
CSV  ──▶ col1,col2,col3...              CSV  ──┼─▶│  DOCUMENT  │──▶│ page_content: "text" │
JSON ──▶ {"key": "val"}??              JSON ──┘  │  LOADER    │   │ metadata: {source,   │
                                                  └────────────┘   │   page, date, ...}   │
Your code: 😰😰😰                                                   └──────────────────────┘
                                        Your code: 😎
```

### Why It Matters

Every data source has a different format. Document loaders handle the messy conversion so your RAG pipeline always receives **clean, consistent text**.

A **Document** object in LangChain (the most popular RAG framework) looks like this:

```python
Document(
    page_content="This is the actual text content...",
    metadata={
        "source": "report.pdf",
        "page": 3,
        "author": "Dr. Smith",
        "date": "2024-01-15"
    }
)
```

- `page_content` → The actual text your AI will read
- `metadata` → Extra info about WHERE this text came from (very useful later!)

---

## 3. 📄 Loading PDFs {#loading-pdfs}

### Concept

PDFs are the most common document format in business. They look simple but are actually complex binary files. A PDF loader cracks them open and extracts the text.

```
HOW PDF LOADING WORKS
═════════════════════════════════════════════════════

  report.pdf (binary)         PyPDF / pdfminer
  ┌─────────────────┐         ┌──────────────────┐
  │ %PDF-1.4        │         │  Read binary     │
  │ 1 0 obj         │         │  Parse structure │
  │ << /Type /Page  │──────▶  │  Extract text    │──▶  "Q3 revenue grew
  │ BT              │         │  per page        │      by 23% driven
  │ /F1 12 Tf       │         │  Preserve order  │      by APAC region"
  │ (Q3 revenue...  │         └──────────────────┘
  └─────────────────┘
  
  Page 1 ──▶ Document(page_content="...", metadata={"page": 1})
  Page 2 ──▶ Document(page_content="...", metadata={"page": 2})
  Page N ──▶ Document(page_content="...", metadata={"page": N})
```

### How It Works — Step by Step

**Step 1: Install the required library**

```bash
pip install langchain langchain-community pypdf
```

**Step 2: Load a single PDF**

```python
# Import the PDF loader from LangChain
from langchain_community.document_loaders import PyPDFLoader

# --- Line by line explanation ---

# Create a loader object pointing to your PDF file
loader = PyPDFLoader("company_report.pdf")

# .load() reads the entire PDF and returns a LIST of Document objects
# One Document = One Page (by default)
documents = loader.load()

# Let's see what we got!
print(f"Total pages loaded: {len(documents)}")
# Output: Total pages loaded: 12

# Look at the first page
first_page = documents[0]
print(first_page.page_content[:200])  # First 200 characters
# Output: "Annual Report 2024. Our company achieved record revenues..."

print(first_page.metadata)
# Output: {'source': 'company_report.pdf', 'page': 0}
```

**Step 3: Load a PDF from a URL (no download needed!)**

```python
from langchain_community.document_loaders import PyPDFLoader

# PyPDFLoader can also handle URLs directly!
url = "https://arxiv.org/pdf/1706.03762"  # The famous "Attention is All You Need" paper
loader = PyPDFLoader(url)

# load_and_split() loads AND chunks the document
# (we'll learn chunking in Ch. 2, but handy to know it exists)
pages = loader.load()

print(f"Loaded {len(pages)} pages from the URL")
for i, page in enumerate(pages[:3]):  # Show first 3 pages
    print(f"\n--- Page {i+1} ---")
    print(page.page_content[:150])  # Print first 150 chars
```

**Step 4: Load multiple PDFs from a folder**

```python
from langchain_community.document_loaders import PyPDFDirectoryLoader

# This is SUPER useful in real projects!
# Point it at a folder — it loads ALL PDFs automatically
loader = PyPDFDirectoryLoader("./pdf_documents/")

# Load every single PDF in that folder
all_docs = loader.load()

print(f"Total documents loaded: {len(all_docs)}")

# Group by source file to see what we got
from collections import defaultdict
files = defaultdict(list)
for doc in all_docs:
    files[doc.metadata['source']].append(doc)

for filename, pages in files.items():
    print(f"  {filename}: {len(pages)} pages")
# Output:
#   ./pdf_documents/q1_report.pdf: 8 pages
#   ./pdf_documents/q2_report.pdf: 11 pages
#   ./pdf_documents/q3_report.pdf: 9 pages
```

**Step 5: Advanced — Extract with metadata preservation**

```python
from langchain_community.document_loaders import PyPDFLoader
import os

def load_pdf_with_custom_metadata(filepath: str, category: str) -> list:
    """
    Load a PDF and add our OWN custom metadata.
    This is useful for tagging documents before storing them.
    """
    loader = PyPDFLoader(filepath)
    documents = loader.load()
    
    # Loop through each page document
    for doc in documents:
        # Add custom metadata fields
        doc.metadata["category"] = category           # e.g., "legal", "financial"
        doc.metadata["filename"] = os.path.basename(filepath)
        doc.metadata["total_pages"] = len(documents)
        doc.metadata["char_count"] = len(doc.page_content)
    
    return documents

# Usage
legal_docs = load_pdf_with_custom_metadata("contract_2024.pdf", "legal")
print(legal_docs[0].metadata)
# Output: {
#   'source': 'contract_2024.pdf',
#   'page': 0,
#   'category': 'legal',
#   'filename': 'contract_2024.pdf',
#   'total_pages': 5,
#   'char_count': 3420
# }
```

---

## 4. 🌐 Loading Websites {#loading-websites}

### Concept

Websites are written in HTML — a language full of tags like `<div>`, `<p>`, `<span>`. A web loader fetches the page and strips away the HTML "noise", keeping only the readable text.

```
HOW WEB LOADING WORKS
═══════════════════════════════════════════════════════════════

  WEBSITE (HTML)                   LOADER                  CLEAN TEXT
  ─────────────────                ──────────              ──────────
  <!DOCTYPE html>                  ┌────────────────────┐
  <html>                           │ 1. HTTP GET request │
    <head>                         │ 2. Parse HTML tree  │
      <title>AI News</title>       │ 3. Remove tags      │──▶  "AI News
    </head>                        │ 4. Keep text nodes  │     
    <body>                         │ 5. Clean whitespace │     OpenAI releases
      <nav>HOME | ABOUT</nav>      └────────────────────┘     new model...
      <article>                    
        <h1>OpenAI releases...     ⚠️ nav, footer, ads are
        <p>The company said...     usually stripped out!
      </article>
      <footer>© 2024</footer>
    </body>
  </html>
```

### How It Works — Step by Step

**Step 1: Install the required libraries**

```bash
pip install langchain langchain-community beautifulsoup4 requests
```

**Step 2: Load a single webpage**

```python
from langchain_community.document_loaders import WebBaseLoader

# Create the loader with a URL
loader = WebBaseLoader("https://en.wikipedia.org/wiki/Retrieval-augmented_generation")

# .load() fetches the page and returns Document objects
docs = loader.load()

print(f"Number of documents: {len(docs)}")  # Usually 1 doc per URL
print(f"Content length: {len(docs[0].page_content)} characters")
print("\nFirst 300 characters:")
print(docs[0].page_content[:300])

print("\nMetadata:")
print(docs[0].metadata)
# Output: {'source': 'https://en.wikipedia.org/...', 'title': 'RAG', 'language': 'en'}
```

**Step 3: Load multiple URLs at once**

```python
from langchain_community.document_loaders import WebBaseLoader

# Pass a LIST of URLs — it fetches them all!
urls = [
    "https://python.org/about/",
    "https://docs.python.org/3/tutorial/",
    "https://pypi.org/",
]

# One loader, many URLs
loader = WebBaseLoader(urls)
docs = loader.load()

print(f"Loaded {len(docs)} pages")
for doc in docs:
    print(f"  URL: {doc.metadata['source']}")
    print(f"  Length: {len(doc.page_content)} chars")
    print()
```

**Step 4: Customize what gets extracted with BeautifulSoup**

```python
from langchain_community.document_loaders import WebBaseLoader
import bs4  # BeautifulSoup

# By default, WebBaseLoader grabs EVERYTHING on the page
# But we can tell it to ONLY grab specific HTML sections

loader = WebBaseLoader(
    web_paths=["https://example-blog.com/article/"],
    
    # bs_kwargs = BeautifulSoup keyword arguments
    # This tells the loader which HTML tags to focus on
    bs_kwargs=dict(
        parse_only=bs4.SoupStrainer(
            class_=("article-content", "post-body", "main-text")
            # Only extract divs/sections with these CSS classes
        )
    )
)

docs = loader.load()
# Now you get ONLY the article text, not nav/footer/ads!
print(docs[0].page_content[:500])
```

**Step 5: Sitemap loader — crawl an entire website**

```python
from langchain_community.document_loaders.sitemap import SitemapLoader

# Many websites have a sitemap.xml listing ALL their pages
# This loader automatically finds and loads ALL of them!

loader = SitemapLoader(
    web_path="https://docs.python.org/sitemap.xml",
    filter_urls=["https://docs.python.org/3/library/"],  # Only load these URLs
)

# This may take a while — it's fetching many pages!
docs = loader.load()
print(f"Loaded {len(docs)} pages from the Python docs")
```

---

## 5. 🗄️ Loading Databases {#loading-databases}

### Concept

Sometimes your data lives in a SQL database (like PostgreSQL, MySQL, SQLite). The database loader runs a SQL query and converts the rows into Document objects.

```
HOW DATABASE LOADING WORKS
════════════════════════════════════════════════════════════════

  SQL DATABASE                                         DOCUMENTS
  ────────────────────────────────                     ─────────
  TABLE: products                                      
  ┌────┬─────────────┬──────────┬──────────────────┐  Document(
  │ id │ name        │ price    │ description       │  page_content=
  ├────┼─────────────┼──────────┼──────────────────┤  "Product: Laptop Pro
  │  1 │ Laptop Pro  │ 1299.99  │ High-perf laptop  │   Price: $1299.99
  │  2 │ Mouse X     │   29.99  │ Ergonomic mouse   │   Desc: High-perf...",
  │  3 │ Keyboard Z  │   79.99  │ Mechanical keys   │  metadata={"id": 1}
  └────┴─────────────┴──────────┴──────────────────┘  )
            │                                          
            │  SELECT * FROM products                  Document(...)
            │  WHERE in_stock = TRUE                   Document(...)
            ▼                                          
       ┌──────────────────────┐                        
       │  SQL Database Loader │──────────────────────▶ List[Document]
       └──────────────────────┘                        
```

### How It Works — Step by Step

**Step 1: Install the required libraries**

```bash
pip install langchain sqlalchemy
# For specific databases:
pip install psycopg2-binary   # PostgreSQL
pip install pymysql           # MySQL
# SQLite is built into Python — no install needed!
```

**Step 2: Load from SQLite (easiest, great for testing)**

```python
from langchain_community.document_loaders import SQLDatabaseLoader
from langchain_community.utilities import SQLDatabase
import sqlite3

# First, let's CREATE a demo database to practice with
conn = sqlite3.connect("products.db")
cursor = conn.cursor()

# Create a products table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        price REAL,
        description TEXT,
        category TEXT
    )
""")

# Insert some sample data
cursor.executemany(
    "INSERT OR IGNORE INTO products VALUES (?, ?, ?, ?, ?)",
    [
        (1, "Laptop Pro X", 1299.99, "High-performance 16-inch laptop with 32GB RAM", "Electronics"),
        (2, "Ergonomic Mouse", 29.99, "Wireless ergonomic mouse for all-day comfort", "Accessories"),
        (3, "Mechanical Keyboard", 79.99, "Tactile mechanical keyboard with RGB lighting", "Accessories"),
        (4, "4K Monitor", 499.99, "27-inch 4K IPS display with USB-C", "Electronics"),
    ]
)
conn.commit()
conn.close()
print("Demo database created!")
```

```python
from langchain_community.document_loaders import SQLDatabaseLoader
from langchain_community.utilities import SQLDatabase

# Connect to the database
db = SQLDatabase.from_uri("sqlite:///products.db")

# Create the loader with a SQL query
loader = SQLDatabaseLoader(
    query="SELECT id, name, price, category, description FROM products",
    db=db,
    # page_content_mapper tells the loader HOW to format each row as text
    page_content_mapper=lambda row: (
        f"Product: {row['name']}\n"
        f"Category: {row['category']}\n"
        f"Price: ${row['price']:.2f}\n"
        f"Description: {row['description']}"
    ),
    # metadata_mapper tells the loader what to put in metadata
    metadata_mapper=lambda row: {
        "product_id": row["id"],
        "category": row["category"],
        "price": row["price"]
    }
)

docs = loader.load()
print(f"Loaded {len(docs)} product documents\n")

# See what a document looks like
print("=== DOCUMENT EXAMPLE ===")
print(docs[0].page_content)
print("\nMetadata:", docs[0].metadata)
```

**Step 3: Load from PostgreSQL (Production-ready)**

```python
from langchain_community.document_loaders import SQLDatabaseLoader
from langchain_community.utilities import SQLDatabase

# Connection string format: dialect+driver://user:password@host:port/database
db = SQLDatabase.from_uri(
    "postgresql+psycopg2://admin:mypassword@localhost:5432/medical_records"
)

# Load patient records (anonymized for HIPAA compliance!)
loader = SQLDatabaseLoader(
    query="""
        SELECT 
            p.patient_id,
            p.diagnosis,
            p.treatment_notes,
            p.visit_date,
            d.specialty
        FROM patient_records p
        JOIN doctors d ON p.doctor_id = d.id
        WHERE p.visit_date >= '2024-01-01'
        ORDER BY p.visit_date DESC
        LIMIT 1000
    """,
    db=db,
    page_content_mapper=lambda row: (
        f"Diagnosis: {row['diagnosis']}\n"
        f"Treatment: {row['treatment_notes']}\n"
        f"Visit Date: {row['visit_date']}\n"
        f"Specialty: {row['specialty']}"
    ),
    metadata_mapper=lambda row: {
        "patient_id": row["patient_id"],
        "visit_date": str(row["visit_date"]),
        "specialty": row["specialty"]
    }
)

records = loader.load()
print(f"Loaded {len(records)} patient records")
```

---

## 6. 🔌 Loading APIs {#loading-apis}

### Concept

Many data sources are accessible via APIs (Application Programming Interfaces). These are web services that return structured data (usually JSON). We need to call them, extract the text, and create Document objects.

```
HOW API LOADING WORKS
═══════════════════════════════════════════════════════════════════

  YOUR CODE                    API SERVER              RESPONSE
  ─────────                    ──────────              ────────
  
  ┌─────────────────┐         ┌──────────────┐        {
  │ requests.get(   │ ──HTTP─▶│ REST API     │          "articles": [
  │  url,           │ ◀──JSON─│ (news, CRM,  │            {"title": "...",
  │  headers=...,   │         │  weather...) │             "body":  "...",
  │  params=...     │         └──────────────┘             "date":  "..."}
  │ )               │                                    ]
  └─────────────────┘                                  }
           │
           │  Parse JSON
           ▼
  ┌────────────────────────────────────┐
  │  Convert each item to a Document   │
  │                                    │
  │  Document(                         │
  │    page_content = title + body,    │──▶ List[Document]
  │    metadata = {date, source, ...}  │
  │  )                                 │
  └────────────────────────────────────┘
```

### How It Works — Step by Step

**Step 1: Install required libraries**

```bash
pip install langchain requests
```

**Step 2: Load from a public REST API**

```python
import requests
from langchain.schema import Document

def load_from_api(api_url: str, headers: dict = None, params: dict = None) -> list:
    """
    Generic function to load documents from any REST API.
    
    Args:
        api_url: The endpoint URL
        headers: HTTP headers (auth tokens go here)
        params: URL query parameters (filters, pagination, etc.)
    
    Returns:
        List of Document objects
    """
    # Make the HTTP GET request
    response = requests.get(
        url=api_url,
        headers=headers or {},  # Use empty dict if no headers
        params=params or {}      # Use empty dict if no params
    )
    
    # Always check if the request was successful!
    response.raise_for_status()  # Raises error if status code >= 400
    
    # Parse the JSON response
    data = response.json()
    
    return data  # We'll process this in the next step


# Example: Load news articles from a public API
# Using NewsAPI (free tier available at newsapi.org)
NEWS_API_KEY = "your_api_key_here"  # Replace with your actual key

raw_data = load_from_api(
    api_url="https://newsapi.org/v2/top-headlines",
    headers={"Authorization": f"Bearer {NEWS_API_KEY}"},
    params={
        "country": "us",
        "category": "technology",
        "pageSize": 20  # Get 20 articles
    }
)

print(f"API returned {raw_data['totalResults']} total results")
print(f"Got {len(raw_data['articles'])} articles in this page")
```

**Step 3: Convert API response to Documents**

```python
from langchain.schema import Document
from datetime import datetime

def news_to_documents(api_response: dict) -> list:
    """
    Convert NewsAPI response into LangChain Document objects.
    """
    documents = []
    
    # Loop through each article in the response
    for article in api_response.get("articles", []):
        
        # Skip articles with no content (sometimes APIs return incomplete data)
        if not article.get("content") and not article.get("description"):
            continue
        
        # Build the page_content — what the AI will actually read
        # We combine multiple fields into one readable text block
        page_content = f"""
Title: {article.get('title', 'No title')}

Description: {article.get('description', 'No description')}

Content: {article.get('content', 'No content')}
        """.strip()
        
        # Build the metadata — information ABOUT the article
        metadata = {
            "source": article.get("source", {}).get("name", "Unknown"),
            "url": article.get("url", ""),
            "published_at": article.get("publishedAt", ""),
            "author": article.get("author", "Unknown"),
            "data_type": "news_article",  # Custom tag!
        }
        
        # Create the Document object
        doc = Document(
            page_content=page_content,
            metadata=metadata
        )
        documents.append(doc)
    
    return documents

# Convert our raw API data
news_docs = news_to_documents(raw_data)
print(f"Created {len(news_docs)} Document objects")
print("\n=== SAMPLE DOCUMENT ===")
print(news_docs[0].page_content[:300])
print("\nMetadata:", news_docs[0].metadata)
```

**Step 4: Load from an API with pagination**

```python
import requests
import time
from langchain.schema import Document

def load_paginated_api(base_url: str, api_key: str, max_pages: int = 5) -> list:
    """
    Many APIs paginate results (like pages in a book).
    This function loads ALL pages automatically.
    """
    all_documents = []
    page = 1
    
    while page <= max_pages:
        print(f"Loading page {page}/{max_pages}...")
        
        response = requests.get(
            url=base_url,
            headers={"Authorization": f"Bearer {api_key}"},
            params={
                "page": page,
                "per_page": 100  # 100 items per page
            }
        )
        
        # Stop if we get an error
        if response.status_code != 200:
            print(f"Stopped at page {page}: HTTP {response.status_code}")
            break
        
        data = response.json()
        items = data.get("items", [])
        
        # Stop if there are no more items
        if not items:
            print(f"No more items found at page {page}. Done!")
            break
        
        # Convert items to Documents
        for item in items:
            doc = Document(
                page_content=item.get("text", ""),
                metadata={
                    "id": item.get("id"),
                    "page": page,
                    "source": base_url
                }
            )
            all_documents.append(doc)
        
        page += 1
        
        # Be polite to the API — don't hammer it!
        time.sleep(0.5)  # Wait 0.5 seconds between requests
    
    print(f"\nTotal documents loaded: {len(all_documents)}")
    return all_documents
```

---

## 7. 🏭 Real Industry Use Cases {#use-cases}

### Use Case #1: 🏥 Healthcare — Clinical Document Assistant

**The Problem:** A hospital has thousands of PDF clinical guidelines, drug manuals, and research papers. Nurses and doctors spend hours searching through them for answers.

**The RAG Solution:**

```
HEALTHCARE RAG PIPELINE — DOCUMENT LOADING PHASE
══════════════════════════════════════════════════════════════════

  DATA SOURCES                          LOADED DOCUMENTS
  ────────────                          ────────────────
  
  📁 /clinical_docs/                    ┌──────────────────────────────┐
  ├── drug_interactions.pdf  ──────────▶│ Doc: "Metformin should not   │
  ├── icu_protocols.pdf      ──────────▶│  be used with..."            │
  ├── surgical_guidelines/   ──────────▶│ metadata: {category: "drug", │
  │   ├── cardiac.pdf                   │   department: "cardiology"}  │
  │   └── ortho.pdf                     └──────────────────────────────┘
  │
  🗄️ HOSPITAL DATABASE                  ┌──────────────────────────────┐
  └── patient_protocols      ──────────▶│ Doc: "Patient John D. (ID    │
      WHERE active = TRUE               │  #4521) Protocol: ..."       │
                                        │ metadata: {patient_id: 4521} │
  🌐 MedlinePlus API                    └──────────────────────────────┘
  └── drug info endpoint     ──────────▶│ Doc: "Drug: Aspirin          │
                                        │  Class: NSAID..."            │
                                        └──────────────────────────────┘
  
  QUERY: "What are contraindications for Metformin in ICU patients?"
  RESULT: Pulls from drug PDF + ICU protocols + MedlinePlus API ✅
══════════════════════════════════════════════════════════════════
```

```python
# Real-world healthcare document loading setup
from langchain_community.document_loaders import PyPDFDirectoryLoader, SQLDatabaseLoader
from langchain_community.utilities import SQLDatabase
from langchain.schema import Document
import requests

class HealthcareDocumentLoader:
    """
    Loads clinical documents from multiple sources for a hospital RAG system.
    """
    
    def __init__(self, pdf_dir: str, db_connection_string: str):
        self.pdf_dir = pdf_dir
        self.db = SQLDatabase.from_uri(db_connection_string)
    
    def load_clinical_pdfs(self) -> list:
        """Load all clinical guideline PDFs."""
        loader = PyPDFDirectoryLoader(self.pdf_dir)
        docs = loader.load()
        
        # Tag each document for the RAG system
        for doc in docs:
            doc.metadata["data_type"] = "clinical_guideline"
            doc.metadata["access_level"] = "clinical_staff_only"
        
        print(f"Loaded {len(docs)} clinical guideline pages")
        return docs
    
    def load_patient_protocols(self) -> list:
        """Load active patient protocols from the database."""
        loader = SQLDatabaseLoader(
            query="""
                SELECT patient_id, protocol_name, instructions, 
                       last_updated, department
                FROM patient_protocols
                WHERE is_active = TRUE
                AND last_updated >= DATE('now', '-30 days')
            """,
            db=self.db,
            page_content_mapper=lambda row: (
                f"Protocol: {row['protocol_name']}\n"
                f"Department: {row['department']}\n"
                f"Instructions: {row['instructions']}"
            ),
            metadata_mapper=lambda row: {
                "patient_id": row["patient_id"],
                "data_type": "patient_protocol",
                "department": row["department"],
                "last_updated": str(row["last_updated"])
            }
        )
        return loader.load()
    
    def load_all(self) -> list:
        """Load ALL documents from all sources."""
        all_docs = []
        all_docs.extend(self.load_clinical_pdfs())
        all_docs.extend(self.load_patient_protocols())
        
        print(f"\n✅ Total documents loaded: {len(all_docs)}")
        return all_docs

# Usage
loader = HealthcareDocumentLoader(
    pdf_dir="./clinical_pdfs/",
    db_connection_string="postgresql://admin:pass@localhost/hospital_db"
)
documents = loader.load_all()
```

---

### Use Case #2: 🛒 E-Commerce — Product Knowledge Base

**The Problem:** A large e-commerce platform (like Amazon or Flipkart) has 100,000+ products, customer reviews, and support tickets. The customer support chatbot needs to answer "Does this laptop support Windows 11?" or "What is the return policy for electronics?"

**The RAG Solution:**

```
E-COMMERCE RAG PIPELINE — DOCUMENT LOADING PHASE  
══════════════════════════════════════════════════════════════════

  DATA SOURCES                          PURPOSE
  ────────────                          ───────
  
  🗄️ Products Database                 Loads product specs, descriptions
  └── SELECT * FROM products  ────────▶ Doc: "Sony WH-1000XM5 headphones.
      JOIN categories                        Noise canceling: Yes.
      JOIN specs                             Battery: 30 hours..."
  
  🌐 Reviews API                        Loads customer experience data
  └── GET /api/reviews         ────────▶ Doc: "★★★★☆ Great sound quality
      ?product_id=XYZ                        but charging takes long. - User"
      &min_rating=3
  
  📄 Policy PDFs                        Loads return/warranty info
  ├── return_policy.pdf        ────────▶ Doc: "Electronics can be returned
  └── warranty_terms.pdf                     within 30 days of purchase..."
  
  🌐 FAQ Website                        Loads common Q&A pairs
  └── /support/faq             ────────▶ Doc: "Q: How to track my order?
                                              A: Use the 'Orders' section..."
  
  CUSTOMER ASKS: "Can I return a laptop if it doesn't work with my monitor?"
  ANSWER: Pulls from policy PDF + product specs + FAQ ✅
══════════════════════════════════════════════════════════════════
```

```python
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader, SQLDatabaseLoader
from langchain_community.utilities import SQLDatabase
from langchain.schema import Document
import requests

class EcommerceDocumentLoader:
    """
    Comprehensive document loader for e-commerce RAG system.
    Loads products, reviews, policies, and FAQs.
    """
    
    def __init__(self, db_url: str, api_base_url: str, api_key: str):
        self.db = SQLDatabase.from_uri(db_url)
        self.api_base_url = api_base_url
        self.api_headers = {"Authorization": f"Bearer {api_key}"}
    
    def load_products(self) -> list:
        """Load product catalog from database."""
        loader = SQLDatabaseLoader(
            query="""
                SELECT p.id, p.name, p.brand, p.price, p.description,
                       c.name as category, s.specifications
                FROM products p
                JOIN categories c ON p.category_id = c.id
                JOIN product_specs s ON p.id = s.product_id
                WHERE p.is_active = TRUE
            """,
            db=self.db,
            page_content_mapper=lambda row: (
                f"Product: {row['name']}\n"
                f"Brand: {row['brand']}\n"
                f"Category: {row['category']}\n"
                f"Price: ₹{row['price']:,.2f}\n"   # Indian Rupees!
                f"Description: {row['description']}\n"
                f"Specifications: {row['specifications']}"
            ),
            metadata_mapper=lambda row: {
                "product_id": str(row["id"]),
                "data_type": "product",
                "category": row["category"],
                "brand": row["brand"],
                "price": float(row["price"])
            }
        )
        products = loader.load()
        print(f"  Loaded {len(products)} products")
        return products
    
    def load_reviews(self, min_rating: int = 3) -> list:
        """Load product reviews from API."""
        documents = []
        page = 1
        
        while True:
            response = requests.get(
                f"{self.api_base_url}/reviews",
                headers=self.api_headers,
                params={"page": page, "min_rating": min_rating, "per_page": 100}
            )
            
            if response.status_code != 200 or not response.json().get("reviews"):
                break
            
            for review in response.json()["reviews"]:
                stars = "★" * review["rating"] + "☆" * (5 - review["rating"])
                doc = Document(
                    page_content=(
                        f"Product Review ({stars})\n"
                        f"Product: {review['product_name']}\n"
                        f"Review: {review['text']}\n"
                        f"Helpful: {review['helpful_votes']} people found this helpful"
                    ),
                    metadata={
                        "product_id": str(review["product_id"]),
                        "rating": review["rating"],
                        "data_type": "review",
                        "verified_purchase": review.get("verified", False)
                    }
                )
                documents.append(doc)
            
            page += 1
        
        print(f"  Loaded {len(documents)} reviews")
        return documents
    
    def load_policies(self) -> list:
        """Load policy documents from PDFs."""
        policy_files = [
            ("return_policy.pdf", "return_policy"),
            ("warranty_terms.pdf", "warranty"),
            ("shipping_policy.pdf", "shipping"),
        ]
        
        documents = []
        for filename, policy_type in policy_files:
            loader = PyPDFLoader(f"./policies/{filename}")
            docs = loader.load()
            for doc in docs:
                doc.metadata["data_type"] = "policy"
                doc.metadata["policy_type"] = policy_type
            documents.extend(docs)
        
        print(f"  Loaded {len(documents)} policy pages")
        return documents
    
    def load_all(self) -> list:
        """Load everything!"""
        print("🛒 Loading E-Commerce Knowledge Base...")
        all_docs = []
        all_docs.extend(self.load_products())
        all_docs.extend(self.load_reviews())
        all_docs.extend(self.load_policies())
        print(f"\n✅ Total: {len(all_docs)} documents ready for RAG!")
        return all_docs

# Usage
loader = EcommerceDocumentLoader(
    db_url="postgresql://admin:pass@localhost/ecommerce_db",
    api_base_url="https://api.mystore.com/v1",
    api_key="sk-my-secret-api-key"
)
all_documents = loader.load_all()
```

---

## 8. 🔗 Putting It All Together {#together}

Here's a unified, production-style document loader that combines all four source types:

```
UNIFIED LOADER ARCHITECTURE
═══════════════════════════════════════════════════════════════════

     ┌─────────────────────────────────────────────────────┐
     │              UniversalDocumentLoader                 │
     │                                                     │
     │  ┌───────────┐ ┌───────────┐ ┌─────────┐ ┌──────┐ │
     │  │ PDF       │ │ Website   │ │Database │ │ API  │ │
     │  │ Loader    │ │ Loader    │ │ Loader  │ │Loader│ │
     │  └─────┬─────┘ └─────┬─────┘ └────┬────┘ └──┬───┘ │
     │        └─────────────┴────────────┴──────────┘     │
     │                          │                          │
     │                          ▼                          │
     │              ┌───────────────────┐                  │
     │              │  Combine & Dedupe │                  │
     │              └─────────┬─────────┘                  │
     └────────────────────────┼────────────────────────────┘
                              │
                              ▼
                   List[Document]  →  Next: Chunking!
═══════════════════════════════════════════════════════════════════
```

```python
from langchain_community.document_loaders import (
    PyPDFDirectoryLoader,
    WebBaseLoader,
    SQLDatabaseLoader
)
from langchain_community.utilities import SQLDatabase
from langchain.schema import Document
import requests
import logging

# Set up logging so we can track what's happening
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

class UniversalDocumentLoader:
    """
    Production-ready document loader that combines multiple data sources.
    
    Follows the principle of "fail gracefully":
    - If one source fails, others still load
    - Errors are logged, not silently swallowed
    """
    
    def __init__(self, config: dict):
        """
        config = {
            "pdf_dir": "./docs/",
            "web_urls": ["https://..."],
            "db_url": "postgresql://...",
            "api_url": "https://...",
            "api_key": "..."
        }
        """
        self.config = config
        self.all_documents = []
    
    def _load_pdfs(self) -> list:
        """Load all PDFs from directory."""
        try:
            loader = PyPDFDirectoryLoader(self.config["pdf_dir"])
            docs = loader.load()
            logger.info(f"✅ PDFs: {len(docs)} pages loaded")
            return docs
        except Exception as e:
            logger.error(f"❌ PDF loading failed: {e}")
            return []  # Return empty list instead of crashing
    
    def _load_websites(self) -> list:
        """Load web pages."""
        try:
            loader = WebBaseLoader(self.config["web_urls"])
            docs = loader.load()
            for doc in docs:
                doc.metadata["data_type"] = "webpage"
            logger.info(f"✅ Websites: {len(docs)} pages loaded")
            return docs
        except Exception as e:
            logger.error(f"❌ Website loading failed: {e}")
            return []
    
    def _load_database(self) -> list:
        """Load records from SQL database."""
        try:
            db = SQLDatabase.from_uri(self.config["db_url"])
            loader = SQLDatabaseLoader(
                query=self.config.get("db_query", "SELECT * FROM documents"),
                db=db,
                page_content_mapper=lambda row: str(row),
                metadata_mapper=lambda row: {"data_type": "database_record"}
            )
            docs = loader.load()
            logger.info(f"✅ Database: {len(docs)} records loaded")
            return docs
        except Exception as e:
            logger.error(f"❌ Database loading failed: {e}")
            return []
    
    def _load_api(self) -> list:
        """Load data from REST API."""
        try:
            response = requests.get(
                self.config["api_url"],
                headers={"Authorization": f"Bearer {self.config['api_key']}"},
                timeout=30  # Don't wait forever!
            )
            response.raise_for_status()
            
            items = response.json().get("data", [])
            docs = [
                Document(
                    page_content=str(item.get("content", "")),
                    metadata={"data_type": "api_data", "id": item.get("id")}
                )
                for item in items
            ]
            logger.info(f"✅ API: {len(docs)} items loaded")
            return docs
        except Exception as e:
            logger.error(f"❌ API loading failed: {e}")
            return []
    
    def load_all(self) -> list:
        """
        Load from all sources and combine results.
        Returns all documents as a single list.
        """
        logger.info("🚀 Starting Universal Document Loader...")
        
        # Load from each source
        all_docs = []
        all_docs.extend(self._load_pdfs())
        all_docs.extend(self._load_websites())
        all_docs.extend(self._load_database())
        all_docs.extend(self._load_api())
        
        # Filter out empty documents
        all_docs = [doc for doc in all_docs if doc.page_content.strip()]
        
        logger.info(f"\n📊 SUMMARY:")
        logger.info(f"   Total documents: {len(all_docs)}")
        logger.info(f"   Ready for next step: CHUNKING (Chapter 2)")
        
        return all_docs

# --- USAGE ---
config = {
    "pdf_dir": "./company_docs/",
    "web_urls": [
        "https://company.com/about",
        "https://company.com/products",
        "https://company.com/faq",
    ],
    "db_url": "sqlite:///products.db",
    "db_query": "SELECT name, description, category FROM products",
    "api_url": "https://api.company.com/v1/knowledge-base",
    "api_key": "your-api-key-here"
}

universal_loader = UniversalDocumentLoader(config)
documents = universal_loader.load_all()

# Your documents are now ready!
# documents = [Document(...), Document(...), Document(...), ...]
print(f"\nReady to chunk {len(documents)} documents in Chapter 2! 🎉")
```

---

## 9. 🧠 Mini Quiz {#quiz}

Test yourself! Write your answers before checking below.

---

**Question 1:**

You're building a RAG system for a law firm. They have 500 case files as PDFs in a folder called `/legal/cases/`. Which code correctly loads all of them at once?

```
Option A:
  loader = PyPDFLoader("/legal/cases/")
  docs = loader.load()

Option B:
  loader = PyPDFDirectoryLoader("/legal/cases/")
  docs = loader.load()

Option C:
  for file in os.listdir("/legal/cases/"):
      loader = PyPDFLoader(file)
```

<details>
<summary>👆 Click to reveal answer</summary>

**Answer: Option B** ✅

`PyPDFDirectoryLoader` is specifically designed to load ALL PDFs from a directory automatically. Option A would fail because `PyPDFLoader` expects a single file, not a directory. Option C would work but is the manual "hard way" — why do it yourself when there's a loader for that?

</details>

---

**Question 2:**

A Document object has two main parts. Fill in the blanks:

```python
Document(
    _____________ = "The actual text content here",  # Part 1: What the AI reads
    _____________ = {"source": "file.pdf", "page": 3}  # Part 2: Info about the content
)
```

<details>
<summary>👆 Click to reveal answer</summary>

```python
Document(
    page_content = "The actual text content here",
    metadata = {"source": "file.pdf", "page": 3}
)
```

**`page_content`** is what gets embedded and searched. **`metadata`** is used for filtering, attribution, and context. Both are critical!

</details>

---

**Question 3:**

You're loading data from a paginated API. Your code works for the first page but stops there. What's wrong with this code?

```python
def load_api_data(url, api_key):
    response = requests.get(url, headers={"Authorization": api_key})
    data = response.json()
    return [Document(page_content=str(item)) for item in data["items"]]
```

<details>
<summary>👆 Click to reveal answer</summary>

**Three problems:**

1. **No pagination loop** — it only fetches page 1 and stops. You need a `while` loop that increments the page number.

2. **No error handling** — if the API returns a 404 or 500 error, `response.json()` might crash or return unexpected data. Always add `response.raise_for_status()`.

3. **No rate limiting** — hammering an API without `time.sleep()` between calls can get your IP banned or result in 429 (Too Many Requests) errors.

**Fixed version:**

```python
def load_api_data(url, api_key, max_pages=10):
    documents = []
    for page in range(1, max_pages + 1):
        response = requests.get(
            url,
            headers={"Authorization": api_key},
            params={"page": page}
        )
        response.raise_for_status()       # ✅ Error check
        items = response.json().get("items", [])
        if not items:
            break                         # ✅ Stop when no more data
        documents.extend([Document(page_content=str(item)) for item in items])
        time.sleep(0.5)                  # ✅ Be polite!
    return documents
```

</details>

---

## 10. 🔭 What's Next? {#next}

```
THE RAG JOURNEY — YOU ARE HERE
════════════════════════════════════════════════════════════════

  ✅ Chapter 1: LOAD          ←  YOU COMPLETED THIS!
  ┌──────────────────────────────────────────────────┐
  │  📄 PDFs  🌐 Web  🗄️ DB  🔌 APIs → Documents   │
  └──────────────────────────────────────────────────┘
                       │
                       ▼
  📖 Chapter 2: CHUNK  ←  COMING UP NEXT!
  ┌──────────────────────────────────────────────────┐
  │  "This document is 50,000 words long..."         │
  │                                                  │
  │  Should you feed the WHOLE thing to the AI?      │
  │  (Spoiler: No! That's too much. You need to      │
  │   SPLIT it into smart, meaningful pieces!)       │
  │                                                  │
  │  You'll learn:                                   │
  │  • Fixed-size chunking vs semantic chunking      │
  │  • How overlap prevents losing context           │
  │  • Why chunk size is the #1 RAG tuning knob      │
  │  • RecursiveCharacterTextSplitter in action      │
  └──────────────────────────────────────────────────┘
                       │
                       ▼
  📖 Chapter 3: EMBED  →  Chapter 4: STORE  →  ...

════════════════════════════════════════════════════════════════
```

**🎯 Before Chapter 2: Your Exercise**

Try this at home to lock in what you learned:

1. Pick **any PDF** from your computer (or download one from the web)
2. Load it with `PyPDFLoader`
3. Print the number of pages, the first 200 characters, and the metadata
4. **Bonus:** Load a Wikipedia page about your favorite topic using `WebBaseLoader`
5. **Super Bonus:** Create a small SQLite database with 5 rows and load it using `SQLDatabaseLoader`

```python
# Starter code for your exercise:
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader

# YOUR TURN — fill these in:
pdf_path = "your_file_here.pdf"          # Change this!
wiki_topic = "https://en.wikipedia.org/wiki/YOUR_TOPIC"  # Change this!

# Load the PDF
pdf_loader = PyPDFLoader(pdf_path)
pdf_docs = pdf_loader.load()
print(f"PDF Pages: {len(pdf_docs)}")
print(f"First 200 chars: {pdf_docs[0].page_content[:200]}")

# Load the webpage
web_loader = WebBaseLoader(wiki_topic)
web_docs = web_loader.load()
print(f"\nWebpage loaded: {web_docs[0].metadata.get('title', 'No title')}")
print(f"Content length: {len(web_docs[0].page_content)} characters")
```

---

## 📌 Chapter Summary

```
WHAT YOU LEARNED IN CHAPTER 1
═══════════════════════════════════════════════════════

  CONCEPT             TOOL                    USE WHEN
  ─────────────────   ─────────────────────   ──────────────────────
  Single PDF          PyPDFLoader             1 specific PDF file
  Many PDFs           PyPDFDirectoryLoader    Folder of PDFs
  Single Webpage      WebBaseLoader           1-5 URLs
  Full Website        SitemapLoader           Entire site via sitemap
  SQL Database        SQLDatabaseLoader       Structured tabular data
  REST API            requests + Document     External services/APIs
  Combined            Custom Class            Production systems

  KEY TAKEAWAYS:
  ✅ Every loader returns List[Document]
  ✅ Document has page_content (text) + metadata (info)
  ✅ Add custom metadata to tag and filter docs later
  ✅ Always handle errors gracefully in production
  ✅ Respect APIs: check errors + rate limit requests

═══════════════════════════════════════════════════════
```

---

*📖 Chapter 1 of 8 | RAG Mastery Course | Professor's Edition*

*Next Chapter drops when you're ready: **Chapter 2: Chunking Strategies — The Art of Splitting Text***