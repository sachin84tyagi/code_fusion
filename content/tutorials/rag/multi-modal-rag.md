# Phase 12 — Multi-Modal RAG: Images, Tables & Mixed Documents

> **Level:** Advanced | **Goal:** Build RAG systems that handle images, tables, PDFs with mixed content, and scanned documents

---

## 1. What is Multi-Modal RAG?

Standard RAG handles text. Multi-Modal RAG handles **multiple content types** in the same pipeline:

```
Traditional RAG:           Multi-Modal RAG:
  Text only                  Text + Images + Tables + Charts
  PDFs (text)                Scanned PDFs (OCR)
  Simple documents           Medical reports, invoices, legal contracts
```

**Real-world examples where you need Multi-Modal RAG:**
- Invoice AI: Read invoice image → extract line items → answer billing questions
- Medical RAG: Scan lab report → extract values → answer "Is my potassium normal?"
- Research RAG: Parse papers with equations, charts, and citations
- Contract RAG: Analyze contracts with tables, signatures, and complex formatting

---

## 2. Types of Multi-Modal Content

```
TYPE                    CHALLENGE               SOLUTION
─────────────────────────────────────────────────────────
Scanned PDFs            No text layer           OCR (Tesseract/AWS Textract)
Tables in PDFs          Structure lost          Camelot/Tabula/Unstructured
Images (charts)         Visual information      Vision LLM (describe image)
Mixed PDF (text+img)    Multiple content types  Unstructured library
Audio files             Non-text               Speech-to-text (Whisper)
Video                   Temporal + visual       Frame extraction + transcript
```

---

## 3. Technique 1: OCR for Scanned PDFs

Scanned PDFs are just images of pages. They have NO text layer. OCR (Optical Character Recognition) converts the image to text.

```python
# ocr_rag.py
# pip install pytesseract pillow pdf2image
# Also need: tesseract-ocr installed on system

import pytesseract
from PIL import Image
from pdf2image import convert_from_path
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM

def extract_text_from_scanned_pdf(pdf_path: str) -> list[Document]:
    """Convert a scanned PDF to text using OCR."""
    
    print(f"[OCR] Converting PDF pages to images: {pdf_path}")
    # Convert each PDF page to a PIL Image
    pages = convert_from_path(pdf_path, dpi=300)  # Higher DPI = better OCR
    
    documents = []
    for page_num, page_image in enumerate(pages, 1):
        print(f"[OCR] Processing page {page_num}/{len(pages)}...")
        
        # Run OCR on the image
        text = pytesseract.image_to_string(
            page_image,
            config="--psm 6"  # Assume a single block of text
        )
        
        # Only keep pages with actual content
        if text.strip():
            documents.append(Document(
                page_content=text,
                metadata={
                    "source": pdf_path,
                    "page": page_num,
                    "extraction_method": "ocr"
                }
            ))
    
    print(f"[OCR] Extracted text from {len(documents)} pages")
    return documents

# Example usage (requires a scanned PDF file)
# documents = extract_text_from_scanned_pdf("scanned_contract.pdf")
# Then feed into your normal RAG pipeline!
```

---

## 4. Technique 2: Table Extraction from PDFs

Tables in PDFs are notoriously hard to extract. Standard PDF text extractors merge all cells into one line of text.

```python
# table_extraction.py
# pip install camelot-py[cv] tabulate

import camelot
from langchain_core.documents import Document

def extract_tables_from_pdf(pdf_path: str) -> list[Document]:
    """Extract tables from PDF and convert to readable text format."""
    
    print(f"[Tables] Extracting tables from: {pdf_path}")
    
    # Extract tables (lattice = bordered tables, stream = borderless)
    tables = camelot.read_pdf(pdf_path, pages="all", flavor="lattice")
    
    table_documents = []
    for i, table in enumerate(tables):
        # Convert table to markdown format
        markdown_table = table.df.to_markdown(index=False)
        
        table_doc = Document(
            page_content=f"Table {i+1}:\n{markdown_table}",
            metadata={
                "source": pdf_path,
                "page": table.page,
                "content_type": "table",
                "table_index": i
            }
        )
        table_documents.append(table_doc)
        
        print(f"[Tables] Extracted table {i+1} from page {table.page}")
    
    return table_documents

# Example: Invoice table
# invoice_tables = extract_tables_from_pdf("invoice.pdf")
# 
# The markdown output would look like:
# | Item         | Qty | Unit Price | Total  |
# |-------------|-----|-----------|--------|
# | Cloud Server | 3   | $200      | $600   |
# | Support Plan | 1   | $150      | $150   |
# | TOTAL        |     |           | $750   |
```

---

## 5. Technique 3: Using Unstructured Library (Best All-in-One)

The `unstructured` library is the industry standard for parsing complex documents.

```python
# unstructured_loader.py
# pip install "unstructured[all-docs]" langchain-community

from langchain_community.document_loaders import UnstructuredFileLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings

def load_complex_document(file_path: str):
    """
    Load complex documents that contain:
    - Regular text paragraphs
    - Tables
    - Headers and footers
    - Lists and bullet points
    """
    
    loader = UnstructuredFileLoader(
        file_path,
        mode="elements",  # Returns each element separately (text, table, image, etc.)
        strategy="hi_res"  # High resolution for better accuracy
    )
    
    elements = loader.load()
    
    # Separate by element type
    text_elements = [e for e in elements if e.metadata.get("category") != "Table"]
    table_elements = [e for e in elements if e.metadata.get("category") == "Table"]
    
    print(f"[Unstructured] Loaded {len(text_elements)} text elements")
    print(f"[Unstructured] Loaded {len(table_elements)} table elements")
    
    return text_elements, table_elements

# file_path = "complex_report.pdf"  # Can be PDF, DOCX, PPTX, HTML, etc.
# text_docs, table_docs = load_complex_document(file_path)
```

---

## 6. Technique 4: Vision LLM for Images and Charts

When documents contain charts or diagrams that carry information, use a Vision LLM to describe them.

```python
# vision_rag.py
# pip install langchain-openai pillow
# Requires OpenAI API key (GPT-4o has vision capability)
# Or use Ollama with llava model: ollama pull llava

import base64
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document
from langchain_ollama import OllamaLLM

def encode_image_to_base64(image_path: str) -> str:
    """Convert an image file to base64 string for API transmission."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def describe_chart_with_vision_llm(image_path: str) -> str:
    """
    Use a vision model to convert a chart/image into text description.
    Uses Ollama with llava model (free, local).
    """
    
    # NOTE: This uses the Ollama Python client directly for multimodal
    import ollama
    
    with open(image_path, "rb") as f:
        image_data = f.read()
    
    response = ollama.chat(
        model="llava",  # Vision model (ollama pull llava)
        messages=[{
            "role": "user",
            "content": """Analyze this chart/image carefully and provide:
1. Type of chart (bar, pie, line, etc.)
2. Title of the chart (if visible)
3. Key data points and values
4. Main trend or insight
5. Any notable anomalies

Be specific with numbers and labels.""",
            "images": [image_data]
        }]
    )
    
    return response["message"]["content"]

def create_image_document(image_path: str, page_num: int) -> Document:
    """Convert an image to a searchable text Document."""
    description = describe_chart_with_vision_llm(image_path)
    
    return Document(
        page_content=f"[Image from page {page_num}]: {description}",
        metadata={
            "source": image_path,
            "page": page_num,
            "content_type": "image",
        }
    )

# Example:
# chart_doc = create_image_document("sales_chart.png", page_num=3)
# Now this chart description is searchable in your vector store!
```

---

## 7. Complete Multi-Modal RAG Pipeline

```python
# multimodal_rag_pipeline.py
# Handles text, tables, and describes images — all in one RAG system

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaLLM
from langchain_core.documents import Document
from langchain.prompts import PromptTemplate
from typing import List

class MultiModalRAG:
    """A RAG system that handles text, tables, and images."""
    
    def __init__(self):
        self.embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
        self.llm = OllamaLLM(model="llama3.2")
        self.all_documents: List[Document] = []
        self.vector_store = None
    
    def add_text_document(self, text: str, source: str, page: int = 0):
        """Add a plain text document."""
        doc = Document(
            page_content=text,
            metadata={"source": source, "page": page, "content_type": "text"}
        )
        self.all_documents.append(doc)
    
    def add_table(self, table_markdown: str, source: str, page: int = 0):
        """Add a table in markdown format."""
        doc = Document(
            page_content=f"Table data:\n{table_markdown}",
            metadata={"source": source, "page": page, "content_type": "table"}
        )
        self.all_documents.append(doc)
    
    def add_image_description(self, description: str, source: str, page: int = 0):
        """Add an image's text description."""
        doc = Document(
            page_content=f"Visual content: {description}",
            metadata={"source": source, "page": page, "content_type": "image"}
        )
        self.all_documents.append(doc)
    
    def build_index(self):
        """Embed and index all added documents."""
        print(f"[MultiModal RAG] Indexing {len(self.all_documents)} elements")
        
        # Split text documents but keep tables/images as-is
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        
        text_docs = [d for d in self.all_documents if d.metadata["content_type"] == "text"]
        structured_docs = [d for d in self.all_documents if d.metadata["content_type"] != "text"]
        
        chunked_text = splitter.split_documents(text_docs) if text_docs else []
        all_chunks = chunked_text + structured_docs
        
        self.vector_store = Chroma.from_documents(
            documents=all_chunks,
            embedding=self.embeddings
        )
        print(f"[MultiModal RAG] Indexed {len(all_chunks)} total chunks")
    
    def ask(self, question: str) -> dict:
        """Answer a question using all document types."""
        if not self.vector_store:
            raise ValueError("Run build_index() first!")
        
        docs = self.vector_store.similarity_search_with_score(question, k=4)
        
        context_parts = []
        sources = []
        
        for doc, score in docs:
            content_type = doc.metadata.get("content_type", "text")
            source = doc.metadata.get("source", "unknown")
            page = doc.metadata.get("page", "?")
            
            context_parts.append(
                f"[{content_type.upper()} from {source} page {page}]:\n{doc.page_content}"
            )
            sources.append(f"{source} (p.{page}) - {content_type}")
        
        context = "\n\n---\n\n".join(context_parts)
        
        prompt = f"""You are an expert analyst. Use the multi-modal context below to answer.
The context may include text paragraphs, table data, and descriptions of visual elements.

Context:
{context}

Question: {question}

Comprehensive Answer:"""
        
        answer = self.llm.invoke(prompt)
        return {"answer": answer, "sources": sources}

# DEMO: Simulate a financial report with mixed content
if __name__ == "__main__":
    rag = MultiModalRAG()
    
    # Add text
    rag.add_text_document(
        "Acme Corp reported Q3 2024 revenue of $4.2M, up 18% year-over-year.",
        source="q3_report.pdf", page=1
    )
    
    # Add table (extracted from PDF)
    rag.add_table(
        """| Quarter | Revenue | Growth |
|---------|---------|--------|
| Q1 2024 | $3.2M   | +12%   |
| Q2 2024 | $3.8M   | +15%   |
| Q3 2024 | $4.2M   | +18%   |""",
        source="q3_report.pdf", page=2
    )
    
    # Add image description (from vision model)
    rag.add_image_description(
        "Bar chart showing customer growth by region. North America: 45%, Europe: 30%, Asia: 25%. All regions show upward trend.",
        source="q3_report.pdf", page=3
    )
    
    rag.build_index()
    
    result = rag.ask("What was Q3 growth and how does customer distribution look?")
    print(f"\nAnswer: {result['answer']}")
    print(f"\nSources: {result['sources']}")
```

---

## 8. Use Case: Invoice AI Assistant

```
Input: An invoice image (JPEG/PNG/PDF scan)
Processing:
  1. OCR extracts text from the invoice
  2. Table extractor finds line items
  3. Vision LLM describes any charts or logos
  4. All content indexed in vector store

User Questions:
  "What is the total amount due?"     → Finds in extracted text
  "What are the line items?"          → Finds in table data
  "When is payment due?"              → Finds in extracted text
  "Which company sent this invoice?"  → Finds from vision description
```

---

## 9. Common Multi-Modal Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Not using high DPI for OCR | Blurry text, wrong extraction | Use 300+ DPI in `convert_from_path` |
| Chunking tables like text | Breaks table structure | Keep tables as single Documents |
| Not describing images | Image content invisible to RAG | Use vision LLM to describe all images |
| Mixing content types in one chunk | Context confusion for LLM | Tag each chunk with content_type metadata |

---

## 10. Mini Challenge

1. Take a webpage with a table (any news article with a data table)
2. Copy the table as plain text
3. Add it to the `MultiModalRAG` class using `add_table()`
4. Ask a question that requires reading the table
5. Does RAG find the right row/cell?

---

> **Up Next: Phase 13 — Production-Level RAG**
> How real companies deploy, monitor, scale, and optimize RAG systems.
