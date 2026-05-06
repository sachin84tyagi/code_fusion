# Phase 02 — Environment Setup

> **Level:** Beginner | **Goal:** Set up a clean, professional Python environment for building RAG systems

---

## 1. Simple Explanation

Before building a house, you need the right tools — a hammer, nails, wood. Before building a RAG system, you need the right software tools installed correctly.

This phase sets up your **workshop** so that every RAG project you build will work smoothly.

---

## 2. What You Will Install (And WHY Each One Is Needed)

```
Tool                    Purpose
─────────────────────────────────────────────────────────
Python 3.11+            The programming language we use
pip                     Package installer (comes with Python)
venv                    Creates isolated project environments
LangChain               The main RAG framework (orchestration)
langchain-community     Community integrations (loaders, tools)
langchain-openai        OpenAI model connector
langchain-ollama        Ollama (local model) connector
chromadb                Local vector database
faiss-cpu               Facebook's fast similarity search library
sentence-transformers   Open-source embedding models
ollama                  Run AI models locally (no API cost!)
python-dotenv           Safely manage API keys
pypdf                   Read PDF files
unstructured            Advanced document parsing
tiktoken                Count tokens (important for chunk sizing)
```

---

## 3. Step-by-Step Setup

### Step 1: Check Python Version

Open your terminal and run:

```bash
python --version
```

You should see `Python 3.11.x` or higher. If not, download it from https://python.org

### Step 2: Create a Dedicated Project Folder

```bash
# Navigate to where you want your project
cd d:\myFirstAITest

# Create the project
mkdir RAG_Projects
cd RAG_Projects
```

### Step 3: Create a Virtual Environment

This keeps your RAG packages separate from other projects. Think of it as a "clean room" for your project.

```bash
# Create a virtual environment named 'venv'
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Activate it (Mac/Linux)
source venv/bin/activate

# You will see (venv) appear at the start of your terminal line
# (venv) PS d:\myFirstAITest\RAG_Projects>
```

> **Why virtual environments?** Without them, installing packages for one project can break another. This is a professional best practice used at every tech company.

### Step 4: Install All Required Packages

```bash
# Core RAG framework
pip install langchain langchain-community langchain-openai langchain-ollama

# Vector databases
pip install chromadb faiss-cpu

# Embedding models (local, free)
pip install sentence-transformers

# Document handling
pip install pypdf python-docx unstructured

# Token counting
pip install tiktoken

# Environment variables
pip install python-dotenv

# Web scraping (for website RAG)
pip install beautifulsoup4 requests

# Optional: Streamlit for UI
pip install streamlit
```

Or install everything at once with our requirements file (see below).

### Step 5: Install Ollama (Run AI Models Locally — FREE!)

Ollama lets you run powerful AI models on YOUR computer without paying for API calls.

1. Download from: https://ollama.com
2. Install and restart your terminal
3. Pull the models you need:

```bash
# Pull a good local LLM for chat
ollama pull llama3.2

# Pull a local embedding model (for converting text to vectors)
ollama pull nomic-embed-text

# Verify they are installed
ollama list
```

### Step 6: Set Up API Keys (For OpenAI — Optional)

If you want to use OpenAI's models (GPT-4, text-embedding-3-small), you need an API key.

Create a `.env` file in your project root:

```bash
# .env file — NEVER commit this to GitHub!
OPENAI_API_KEY=sk-your-key-here
LANGCHAIN_API_KEY=ls-your-key-here  # For LangSmith observability (optional)
LANGCHAIN_TRACING_V2=true
```

Load these in your Python code:

```python
from dotenv import load_dotenv
import os

load_dotenv()  # Reads the .env file

api_key = os.getenv("OPENAI_API_KEY")
```

### Step 7: Create a Professional Project Structure

Every RAG project you build should follow this structure:

```
my_rag_project/
├── .env                    # API keys (NEVER commit to git)
├── .gitignore              # Tells git what to ignore
├── requirements.txt        # All packages and versions
├── README.md               # Project description
│
├── data/                   # Your raw documents
│   ├── pdfs/
│   ├── text_files/
│   └── websites/
│
├── vector_store/           # Saved vector database (auto-created)
│
├── src/                    # Your Python code
│   ├── __init__.py
│   ├── loader.py           # Document loading logic
│   ├── chunker.py          # Text splitting logic
│   ├── embedder.py         # Embedding generation logic
│   ├── retriever.py        # Retrieval logic
│   └── rag_chain.py        # The full RAG pipeline
│
├── notebooks/              # Jupyter notebooks for experiments
└── main.py                 # Entry point
```

---

## 4. requirements.txt File

Create this file in your project root:

```text
# RAG_Course_new/requirements.txt

# Core Framework
langchain>=0.3.0
langchain-community>=0.3.0
langchain-openai>=0.2.0
langchain-ollama>=0.2.0

# Vector Databases
chromadb>=0.5.0
faiss-cpu>=1.8.0

# Embeddings
sentence-transformers>=3.0.0

# Document Loaders
pypdf>=4.0.0
python-docx>=1.1.0
unstructured>=0.15.0

# Utilities
tiktoken>=0.7.0
python-dotenv>=1.0.0
requests>=2.31.0
beautifulsoup4>=4.12.0

# UI (Optional)
streamlit>=1.38.0
```

Install from requirements file:

```bash
pip install -r requirements.txt
```

---

## 5. Test Your Setup

Create this file and run it to confirm everything is working:

```python
# test_setup.py

import sys

def test_imports():
    print("Testing all RAG dependencies...")
    print("-" * 40)
    
    packages = [
        ("langchain", "LangChain Core"),
        ("langchain_community", "LangChain Community"),
        ("chromadb", "ChromaDB Vector Store"),
        ("sentence_transformers", "Sentence Transformers (Embeddings)"),
        ("pypdf", "PyPDF (PDF Reader)"),
        ("dotenv", "Python Dotenv (API Keys)"),
    ]
    
    all_good = True
    for package, name in packages:
        try:
            __import__(package)
            print(f"[OK] {name}")
        except ImportError:
            print(f"[MISSING] {name} — run: pip install {package}")
            all_good = False
    
    print("-" * 40)
    if all_good:
        print("[SUCCESS] All packages installed! You are ready to build RAG systems.")
    else:
        print("[WARNING] Some packages are missing. Install them before continuing.")

if __name__ == "__main__":
    test_imports()
```

Run it:

```bash
python test_setup.py
```

Expected output:
```
Testing all RAG dependencies...
----------------------------------------
[OK] LangChain Core
[OK] LangChain Community
[OK] ChromaDB Vector Store
[OK] Sentence Transformers (Embeddings)
[OK] PyPDF (PDF Reader)
[OK] Python Dotenv (API Keys)
----------------------------------------
[SUCCESS] All packages installed! You are ready to build RAG systems.
```

---

## 6. VS Code Setup Tips

Install these VS Code extensions for the best development experience:

| Extension | Purpose |
|-----------|---------|
| Python (Microsoft) | Python language support |
| Pylance | Better autocomplete |
| Jupyter | Run .ipynb notebooks |
| GitHub Copilot | AI code suggestions |
| Better Comments | Color-coded comments |
| GitLens | Git blame and history |

---

## 7. Common Setup Mistakes

| Mistake | Fix |
|---------|-----|
| `pip` installs globally, not in venv | Always activate venv first: `venv\Scripts\activate` |
| `.env` file committed to GitHub | Add `.env` to `.gitignore` immediately |
| Wrong Python version | Use `python 3.11+`. Use `pyenv` to manage versions |
| Packages conflict with each other | Use a fresh venv for each project |
| Forgetting to run `load_dotenv()` | Add it at the top of every file that uses API keys |

---

## 8. Mini Challenge

1. Create a virtual environment named `rag_env`
2. Activate it
3. Install `langchain`, `chromadb`, and `sentence-transformers`
4. Create a `.env` file (you can use fake keys for now)
5. Run the `test_setup.py` script and show that it passes

---

## Quick Recap

- Always use virtual environments — they prevent package conflicts
- Use `.env` files for API keys — never hardcode them
- Follow the standard project structure — it makes your code professional
- Install Ollama — it lets you run powerful AI models for FREE locally

---

> **Up Next: Phase 03 — Embeddings Deep Dive**
> The most important concept in RAG — how AI turns words into numbers that carry meaning.
