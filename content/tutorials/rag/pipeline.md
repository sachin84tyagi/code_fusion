# Phase 08 — RAG Pipeline Architecture: The Full Blueprint

> **Level:** Intermediate | **Goal:** Design a professional, modular RAG pipeline the way real companies build it

---

## 1. Why Architecture Matters

Imagine building a house vs an apartment building.

A house is built however feels right. An apartment building follows blueprints, building codes, and engineering standards — so it's safe, scalable, and maintainable.

Your RAG system needs to be the **apartment building**. A professional, modular architecture that:
- Other engineers can understand
- Can be updated without breaking everything
- Can scale from 100 users to 100,000 users
- Has each component doing one job well

---

## 2. The Full Production RAG Architecture

```
═══════════════════════════════════════════════════════════════
                  INGESTION PIPELINE (Run Once / Scheduled)
═══════════════════════════════════════════════════════════════

  Raw Data Sources
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │  PDFs    │  │ Word Docs│  │Websites  │  │Databases │
  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
       └──────────────┴─────────────┴──────────────┘
                             ↓
                    [Document Loaders]
                    Extract raw text from each source
                             ↓
                    [Text Cleaners]
                    Remove headers, footers, noise
                             ↓
                    [Text Splitters]
                    Chunk into 300-600 char pieces
                             ↓
                    [Embedding Models]
                    Convert each chunk to a vector
                             ↓
                    [Vector Database]
                    Store (vector, text, metadata)

═══════════════════════════════════════════════════════════════
                  QUERY PIPELINE (Every User Request)
═══════════════════════════════════════════════════════════════

  User Question
       ↓
  [Query Preprocessor]
  Clean, validate, detect language
       ↓
  [Query Embedding]
  Convert question to vector
       ↓
  [Retriever]
  Dense + BM25 hybrid search
  Return top-K chunks
       ↓
  [Re-Ranker] (optional but recommended)
  Re-score chunks by true relevance
       ↓
  [Context Builder]
  Assemble retrieved chunks into prompt context
       ↓
  [Prompt Constructor]
  "Context: [chunks] + Question: [question]"
       ↓
  [LLM]
  Generate the final answer
       ↓
  [Response Processor]
  Format, validate, add source citations
       ↓
  User gets the final answer with sources
```

---

## 3. Modular Code Architecture

A real production system splits each stage into its own module:

```
rag_system/
├── config.py          ← All settings in one place
├── loader.py          ← Document loading logic
├── cleaner.py         ← Text cleaning
├── chunker.py         ← Text splitting
├── embedder.py        ← Embedding logic
├── vector_store.py    ← ChromaDB/FAISS management
├── retriever.py       ← Retrieval strategies
├── prompt.py          ← Prompt templates
├── llm.py             ← LLM connections
├── pipeline.py        ← Orchestrates everything
└── main.py            ← Entry point
```

---

## 4. Building the Full Modular Pipeline

### config.py

```python
# config.py — All settings in one place
import os
from dataclasses import dataclass

@dataclass
class RAGConfig:
    # Embedding settings
    embedding_model: str = "all-MiniLM-L6-v2"
    
    # Chunking settings
    chunk_size: int = 500
    chunk_overlap: int = 50
    
    # Vector DB settings
    vector_db_path: str = "./vector_store"
    collection_name: str = "knowledge_base"
    
    # Retrieval settings
    retrieval_k: int = 4          # How many chunks to retrieve
    retrieval_score_threshold: float = 0.5  # Minimum similarity
    
    # LLM settings
    llm_model: str = "llama3.2"   # Ollama model
    llm_temperature: float = 0.0  # 0 = focused/factual, 1 = creative
    
    # API Keys (from environment)
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")

# Create a singleton config
config = RAGConfig()
```

---

### loader.py

```python
# loader.py — Handles loading documents from different sources

from pathlib import Path
from typing import List
from langchain_core.documents import Document
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader,
    WebBaseLoader,
    DirectoryLoader,
)

class DocumentLoader:
    """Loads documents from various sources into LangChain Document format."""
    
    @staticmethod
    def load_pdf(file_path: str) -> List[Document]:
        """Load a single PDF file."""
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        print(f"[Loader] Loaded {len(docs)} pages from {Path(file_path).name}")
        return docs
    
    @staticmethod
    def load_text(file_path: str) -> List[Document]:
        """Load a plain text file."""
        loader = TextLoader(file_path, encoding="utf-8")
        return loader.load()
    
    @staticmethod
    def load_docx(file_path: str) -> List[Document]:
        """Load a Word document."""
        loader = Docx2txtLoader(file_path)
        return loader.load()
    
    @staticmethod
    def load_url(url: str) -> List[Document]:
        """Load content from a website URL."""
        loader = WebBaseLoader(url)
        return loader.load()
    
    @staticmethod
    def load_directory(dir_path: str, pattern: str = "**/*.pdf") -> List[Document]:
        """Load all matching files from a directory."""
        loader = DirectoryLoader(dir_path, glob=pattern)
        docs = loader.load()
        print(f"[Loader] Loaded {len(docs)} documents from {dir_path}")
        return docs
    
    @staticmethod
    def load_any(path: str) -> List[Document]:
        """Auto-detect file type and load accordingly."""
        path = Path(path)
        
        if path.suffix == ".pdf":
            return DocumentLoader.load_pdf(str(path))
        elif path.suffix == ".txt":
            return DocumentLoader.load_text(str(path))
        elif path.suffix in [".docx", ".doc"]:
            return DocumentLoader.load_docx(str(path))
        elif path.is_dir():
            return DocumentLoader.load_directory(str(path))
        else:
            raise ValueError(f"Unsupported file type: {path.suffix}")
```

---

### chunker.py

```python
# chunker.py — Handles splitting documents into chunks

from typing import List
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from config import config

class DocumentChunker:
    """Splits documents into overlapping chunks for indexing."""
    
    def __init__(
        self,
        chunk_size: int = config.chunk_size,
        chunk_overlap: int = config.chunk_overlap
    ):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ". ", " ", ""],
            add_start_index=True,
        )
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
    
    def split(self, documents: List[Document]) -> List[Document]:
        """Split a list of documents into chunks."""
        chunks = self.splitter.split_documents(documents)
        
        # Add chunk index metadata
        for i, chunk in enumerate(chunks):
            chunk.metadata["chunk_index"] = i
        
        total_chars = sum(len(c.page_content) for c in chunks)
        avg_size = total_chars // len(chunks) if chunks else 0
        
        print(f"[Chunker] Split into {len(chunks)} chunks")
        print(f"          Average chunk size: {avg_size} chars")
        
        return chunks
    
    def split_text(self, text: str, source: str = "unknown") -> List[Document]:
        """Split raw text (not Document objects) into chunks."""
        chunks = self.splitter.create_documents(
            [text],
            metadatas=[{"source": source}]
        )
        return chunks
```

---

### vector_store.py

```python
# vector_store.py — Vector database management

import os
from typing import List, Optional
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from config import config

class VectorStoreManager:
    """Manages the ChromaDB vector store — creation, loading, and searching."""
    
    def __init__(self):
        self.embeddings = SentenceTransformerEmbeddings(
            model_name=config.embedding_model
        )
        self._store: Optional[Chroma] = None
    
    def build(self, chunks: List[Document]) -> Chroma:
        """Create a new vector store from document chunks."""
        print(f"[VectorStore] Building with {len(chunks)} chunks...")
        
        self._store = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=config.vector_db_path,
            collection_name=config.collection_name
        )
        
        print(f"[VectorStore] Saved to: {config.vector_db_path}")
        return self._store
    
    def load(self) -> Chroma:
        """Load an existing vector store from disk."""
        if not os.path.exists(config.vector_db_path):
            raise FileNotFoundError(
                f"No vector store found at {config.vector_db_path}. "
                "Run build() first."
            )
        
        print(f"[VectorStore] Loading from: {config.vector_db_path}")
        self._store = Chroma(
            persist_directory=config.vector_db_path,
            embedding_function=self.embeddings,
            collection_name=config.collection_name
        )
        return self._store
    
    def get_or_build(self, chunks: Optional[List[Document]] = None) -> Chroma:
        """Load existing store or build new one from chunks."""
        if os.path.exists(config.vector_db_path):
            return self.load()
        elif chunks:
            return self.build(chunks)
        else:
            raise ValueError("No existing store and no chunks provided to build one.")
    
    def as_retriever(self):
        """Get a retriever from the vector store."""
        if not self._store:
            self.load()
        return self._store.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={
                "k": config.retrieval_k,
                "score_threshold": config.retrieval_score_threshold
            }
        )
    
    def search(self, query: str, k: int = None) -> List[Document]:
        """Direct similarity search."""
        if not self._store:
            self.load()
        return self._store.similarity_search(query, k=k or config.retrieval_k)
```

---

### pipeline.py

```python
# pipeline.py — The orchestrator: ties all modules together

from typing import Optional
from loader import DocumentLoader
from chunker import DocumentChunker
from vector_store import VectorStoreManager
from langchain_ollama import OllamaLLM
from langchain.prompts import PromptTemplate
from config import config

class RAGPipeline:
    """The complete RAG pipeline from document to answer."""
    
    def __init__(self):
        self.loader = DocumentLoader()
        self.chunker = DocumentChunker()
        self.vector_manager = VectorStoreManager()
        self.llm = OllamaLLM(
            model=config.llm_model,
            temperature=config.llm_temperature
        )
        
        self.prompt = PromptTemplate(
            input_variables=["context", "question", "num_sources"],
            template="""You are a knowledgeable AI assistant.
Use ONLY the context below to answer the question accurately and concisely.
If the context doesn't contain the answer, say: "I don't have enough information to answer this."

Context ({num_sources} relevant sections found):
{context}

Question: {question}

Answer (be specific and cite the source if possible):"""
        )
    
    def ingest(self, file_path: str) -> int:
        """Full ingestion pipeline: load → chunk → embed → store."""
        print(f"\n[Pipeline] Starting ingestion: {file_path}")
        
        # Load
        documents = self.loader.load_any(file_path)
        
        # Chunk
        chunks = self.chunker.split(documents)
        
        # Store
        self.vector_manager.build(chunks)
        
        print(f"[Pipeline] Ingestion complete. {len(chunks)} chunks indexed.")
        return len(chunks)
    
    def query(self, question: str) -> dict:
        """Full query pipeline: search → build context → generate answer."""
        
        # Search
        retriever = self.vector_manager.as_retriever()
        docs = retriever.invoke(question)
        
        if not docs:
            return {
                "answer": "I couldn't find any relevant information to answer your question.",
                "sources": [],
                "chunks_used": 0
            }
        
        # Build context
        context_parts = []
        sources = set()
        
        for doc in docs:
            context_parts.append(doc.page_content)
            source = doc.metadata.get("source", "unknown")
            page = doc.metadata.get("page", "")
            sources.add(f"{source}" + (f" (page {page+1})" if page != "" else ""))
        
        context = "\n\n---\n\n".join(context_parts)
        
        # Generate
        full_prompt = self.prompt.format(
            context=context,
            question=question,
            num_sources=len(docs)
        )
        
        answer = self.llm.invoke(full_prompt)
        
        return {
            "answer": answer,
            "sources": list(sources),
            "chunks_used": len(docs)
        }
```

---

### main.py

```python
# main.py — Entry point

import os
from pipeline import RAGPipeline

def main():
    pipeline = RAGPipeline()
    
    # If no vector store exists, ingest a document
    if not os.path.exists("./vector_store"):
        # Replace with your document path
        pipeline.ingest("your_document.pdf")
    
    print("\n" + "=" * 60)
    print("RAG System Ready — Ask anything!")
    print("Type 'quit' to exit")
    print("=" * 60)
    
    while True:
        question = input("\nQuestion: ").strip()
        
        if question.lower() in ["quit", "exit"]:
            break
        
        if not question:
            continue
        
        result = pipeline.query(question)
        
        print(f"\nAnswer: {result['answer']}")
        print(f"\nSources ({result['chunks_used']} chunks used):")
        for source in result['sources']:
            print(f"  - {source}")

if __name__ == "__main__":
    main()
```

---

## 5. Common Architecture Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Everything in one file | Impossible to maintain or test | Separate into modules |
| Hardcoded settings everywhere | Changing one setting requires editing 10 files | Use a single config.py |
| Re-ingesting every run | Slow startup, high API cost | Check if vector store exists first |
| No metadata on chunks | Can't trace answers to sources | Always add source, page, date |
| No error handling | One bad PDF crashes the entire system | Wrap loaders in try/except |

---

## 6. Mini Challenge

1. Create the full folder structure shown in section 3
2. Copy the module files above into their respective files
3. Create a simple `.txt` file with 200 words on any topic
4. Run `main.py` and ingest the text file
5. Ask 3 questions — do you get accurate answers?

---

> **Up Next: Phase 09 — Advanced RAG Techniques**
> Parent-child retrieval, self-query, graph RAG, agentic RAG, and more powerful patterns.
