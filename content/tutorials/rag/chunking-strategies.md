# Phase 04 — Chunking Strategies: The #1 Factor in RAG Quality

> **Level:** Beginner-Intermediate | **Goal:** Master the art of splitting documents so your RAG system finds the right answers

---

## 1. Why Chunking Is The Most Important Step

Here is a secret that most RAG tutorials skip:

**The quality of your RAG system is 80% determined by how well you chunk your documents.**

Not by which LLM you use. Not by which vector database you choose. **Chunking.**

Why? Because the retriever can only fetch whole chunks. If your chunk is too big, it contains too many ideas and becomes noise. If your chunk is too small, it loses the context needed to make sense.

---

## 2. Real-Life Analogy — The Library Card Index

Imagine a library. Every book is divided into chapters. Each chapter is divided into sections.

When you search for something, the librarian doesn't bring you the entire encyclopedia. They bring you just the **relevant section** — a few paragraphs that answer your exact question.

**That section = a chunk**

If the section is 50 pages long → hard to find the exact answer → your AI response will be vague.

If the section is 2 sentences long → not enough context → your AI will misunderstand.

The perfect chunk is like a well-defined section of a textbook: **self-contained, complete enough to make sense, short enough to be specific.**

---

## 3. Visual Workflow

```
Original Document (a 50-page PDF)
        ↓
  [Chunker / Text Splitter]
        ↓
  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
  │Chunk 1 │ │Chunk 2 │ │Chunk 3 │ │Chunk 4 │ │Chunk 5 │  ...
  │(500    │ │(500    │ │(500    │ │(500    │ │(500    │
  │tokens) │ │tokens) │ │tokens) │ │tokens) │ │tokens) │
  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
        ↓
  Each chunk gets embedded (converted to a vector)
        ↓
  All vectors stored in Vector Database
```

---

## 4. Key Concepts: Chunk Size and Overlap

### Chunk Size
How many characters (or tokens) each chunk contains.

```
Small chunks (100-200 tokens):
+ Very precise retrieval
+ Less noise
- Loses surrounding context
- May cut off important sentences

Medium chunks (300-600 tokens):  ← Most common for RAG
+ Balances precision and context
+ Enough text to make sense on its own

Large chunks (800-2000 tokens):
+ More context per chunk
- Retriever fetches less useful specific info
- LLM context window fills up faster
```

### Chunk Overlap
How many characters/tokens are shared between consecutive chunks.

```
Without overlap:
Chunk 1: "The refund policy states that returns... [end]"
Chunk 2: "[start] ...must be made within 30 days"

Problem: The sentence "returns must be made within 30 days" 
         is SPLIT across two chunks. Neither chunk has the full sentence!

With overlap (50 tokens):
Chunk 1: "The refund policy states that returns must be made within 30 days [+ 50 more tokens]"
Chunk 2: "[last 50 tokens of chunk 1] ...must be made within 30 days of purchase with receipt"

Solution: Important sentences appear in BOTH chunks.
         Retrieval won't miss them!
```

---

## 5. The Four Types of Chunking

### Type 1: Fixed-Size Chunking
Split by exact character count. Simple but crude.

```
Text: "The quick brown fox jumps over the lazy dog sitting by the tree"
Chunk size: 20 characters
Overlap: 5 characters

Chunk 1: "The quick brown fox "
Chunk 2: " fox jumps over the "   ← 5 char overlap
Chunk 3: " the lazy dog sittin"
Chunk 4: "sittin by the tree"      ← 6 char overlap
```

**Problem:** Cuts words and sentences mid-way. Creates broken, meaningless chunks.

### Type 2: Recursive Character Text Splitting (BEST for most cases)
Tries to split at natural boundaries: paragraphs → sentences → words → characters.

```python
# This is the most popular splitter in LangChain
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,      # Max characters per chunk
    chunk_overlap=50,    # Characters shared between chunks
    separators=["\n\n", "\n", ". ", " ", ""]
    # ↑ Try to split at paragraph breaks first
    #   Then at line breaks
    #   Then at sentences
    #   Then at spaces
    #   Only as last resort, split mid-word
)
```

The algorithm:
```
Step 1: Try to split at "\n\n" (paragraph break)
        If a piece is still too big, go to Step 2
Step 2: Try to split at "\n" (line break)
        If a piece is still too big, go to Step 3
Step 3: Try to split at ". " (sentence end)
        If a piece is still too big, go to Step 4
Step 4: Try to split at " " (space / word boundary)
        If a piece is still too big, go to Step 5
Step 5: Split at any character (last resort)
```

### Type 3: Document-Specific Chunking
Split using the actual structure of the document type.

```python
# For Markdown files: split by headers
from langchain_text_splitters import MarkdownHeaderTextSplitter

headers = [
    ("#", "Header 1"),
    ("##", "Header 2"),
    ("###", "Header 3"),
]

splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers)
# Each section under a header becomes its own chunk
```

### Type 4: Semantic Chunking (Advanced)
Group sentences together based on semantic similarity. Split when the TOPIC changes.

```
Normal chunking: Splits by character count
                 May put two unrelated topics in the same chunk

Semantic chunking: Detects when the topic changes
                   Splits THERE, regardless of character count

Example:
"Our company was founded in 1985. We started in a small garage... [topic: history]
...We have 5000 employees today. [topic: company size]"

Fixed chunking: Might put both in same chunk
Semantic chunking: Splits at the topic change!
```

---

## 6. Full Code Example — Chunking a PDF

```python
# chunking_demo.py
# Demonstrates all major chunking strategies

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# ============================================================
# STEP 1: Load the PDF
# ============================================================
# Replace with any PDF file on your computer
pdf_path = "sample.pdf"
loader = PyPDFLoader(pdf_path)

# This returns a list of Document objects, one per page
pages = loader.load()

print(f"[1] Loaded {len(pages)} pages from the PDF")
print(f"    Page 1 preview: {pages[0].page_content[:100]}...")

# ============================================================
# STEP 2: Create the text splitter
# ============================================================
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,      # Each chunk will be at most 500 characters
    chunk_overlap=50,    # 50 characters shared with the next chunk
    length_function=len, # We measure in characters (you can use tiktoken for tokens)
    add_start_index=True # Adds metadata: where in the original doc this chunk is
)

# ============================================================
# STEP 3: Split all pages into chunks
# ============================================================
chunks = splitter.split_documents(pages)

print(f"\n[2] Split into {len(chunks)} chunks")
print(f"    Average chunk size: {sum(len(c.page_content) for c in chunks) // len(chunks)} chars")

# ============================================================
# STEP 4: Inspect what the chunks look like
# ============================================================
print("\n[3] Sample chunks:")
print("-" * 60)
for i, chunk in enumerate(chunks[:3]):  # Show first 3 chunks
    print(f"\n  CHUNK {i+1}:")
    print(f"  Source: {chunk.metadata.get('source', 'unknown')}, Page: {chunk.metadata.get('page', '?')}")
    print(f"  Size: {len(chunk.page_content)} characters")
    print(f"  Content: {chunk.page_content[:150]}...")
    print("-" * 60)
```

---

## 7. Line-by-Line Explanation

```python
loader = PyPDFLoader(pdf_path)
# ↑ Creates a loader that knows how to read PDF files
# It extracts text from each page of the PDF

pages = loader.load()
# ↑ Actually reads the PDF and returns a list
# Each element is a Document object with:
#   .page_content = the text of that page
#   .metadata = {"source": "file.pdf", "page": 0}

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
# ↑ Maximum number of characters in one chunk

    chunk_overlap=50,
# ↑ Each chunk shares its last 50 characters with the next chunk
#   This prevents important sentences from being cut in half

    length_function=len,
# ↑ How to measure chunk size. len() counts characters.
#   Alternative: use tiktoken to count tokens instead

    add_start_index=True
# ↑ Adds a "start_index" to metadata
#   Useful for debugging: tells you WHERE in the document this chunk starts
)

chunks = splitter.split_documents(pages)
# ↑ Takes the list of pages and splits ALL of them into chunks
# Respects the separator hierarchy (paragraph → sentence → word)
```

---

## 8. Good Chunking vs Bad Chunking

### Bad Chunking Example (Too small, no overlap)
```
Chunk A: "The company's refund policy"
Chunk B: "allows returns within"
Chunk C: "14 days of purchase."

User asks: "What is the refund window?"
Retriever finds Chunk B: "allows returns within" ← USELESS out of context!
```

### Good Chunking Example (Right size, with overlap)
```
Chunk A: "The company's refund policy allows returns within 14 days of purchase. Items must be in original packaging. Digital products are non-refundable."
Chunk B: "...14 days of purchase. Items must be in original packaging. Digital products are non-refundable. For damaged goods, contact support within 48 hours."

User asks: "What is the refund window?"
Retriever finds Chunk A: Complete, self-contained, answers the question perfectly!
```

---

## 9. Choosing the Right Chunk Size

```
Document Type          Recommended Chunk Size    Overlap
──────────────────────────────────────────────────────────
Short FAQ documents    200-300 characters        20-30
Product manuals        400-600 characters        50-75
Legal contracts        600-800 characters        75-100
Research papers        500-700 characters        50-75
Customer emails        100-200 characters        15-20
News articles          300-500 characters        40-60
Code documentation     400-600 characters        50

Rule: If your LLM answers are too vague → DECREASE chunk size
      If your LLM answers miss context → INCREASE chunk size
```

---

## 10. Token-Based Chunking (Production Recommended)

In production, count TOKENS, not characters. This is because LLMs have token limits, not character limits.

```python
import tiktoken
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Create a tokenizer for the specific LLM you are using
tokenizer = tiktoken.encoding_for_model("gpt-4o")

def count_tokens(text: str) -> int:
    """Count the number of tokens in a string."""
    return len(tokenizer.encode(text))

# Use token-based length function
splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,           # Max 300 TOKENS per chunk
    chunk_overlap=30,         # 30 TOKENS shared between chunks
    length_function=count_tokens,  # ← Now counting tokens, not chars!
)
```

---

## 11. Common Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Chunk size = 0 overlap | Important sentences get cut in half | Always use 10-15% overlap |
| Chunks too small (< 100 chars) | Loses all context, useless retrieval | Use at least 200-300 chars |
| Chunks too large (> 1500 chars) | LLM drowns in noise, slow responses | Keep under 600-800 chars for most cases |
| Not cleaning documents first | Headers/footers become noise chunks | Strip irrelevant text before chunking |
| Same chunk size for all docs | Legal docs ≠ FAQs ≠ emails | Tune chunk size per document type |

---

## 12. Mini Challenge

1. Copy any text (at least 500 words) from a Wikipedia article
2. Write a script that uses `RecursiveCharacterTextSplitter` with:
   - Chunk size: 300 characters
   - Overlap: 30 characters
3. Print all chunks with their sizes
4. Now change chunk size to 100. What happens to the number of chunks?
5. Which setting gave you chunks that make more sense when read alone?

---

## Quick Recap

| Concept | Explanation |
|---------|-------------|
| Chunking | Breaking a document into small, manageable pieces |
| Chunk size | Maximum characters/tokens per chunk |
| Chunk overlap | Characters shared between consecutive chunks |
| RecursiveCharacterTextSplitter | The best general-purpose splitter — tries natural breaks first |
| Semantic chunking | Advanced method — splits where TOPIC changes |
| Token-based chunking | Production-grade — measures in tokens instead of characters |

---

> **Up Next: Phase 05 — Vector Databases**
> Where your chunks live and how they are searched at lightning speed.
