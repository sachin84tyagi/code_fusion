# Phase 5: Embeddings + Vector DB + RAG - Step 4 (Chunking Strategies)

You know how to store data in a Vector DB. But what if your "Document" is a **300-page book**? 
You can't just turn the whole book into one vector. It would lose all the details! 

This is where **Chunking** comes in.

---

## 1. What is Chunking?
Chunking is the process of breaking a large document into smaller, manageable "pieces" (chunks) before vectorizing them.

- **Bad Chunking:** Breaking a sentence in the middle. *"The sky is blue and the grass* ... *is green."* The AI loses the context of the first part.
- **Good Chunking:** Breaking at logical points (paragraphs or sentences) and using **Overlap**.

## 2. The Overlap Trick
To ensure the AI doesn't lose context between chunks, we often use **Overlapping Windows**. 
Imagine chunking a sentence with 20% overlap:
- **Chunk 1:** "The AI is a powerful tool for coding."
- **Chunk 2:** "**for coding** but it needs good prompts."

The bolded part "for coding" appears in both. This ensures the meaning flows across chunks.

---

## 3. The Coding Exercise (Hands-on)

We are going to build a "Recursive Chunker" that takes a paragraph and breaks it down into small pieces with overlap.

#### Step 1: The "Chunking Demo" script
Create a file named `chunking_demo.py` inside your `Phase5` folder:

```python
def simple_chunker(text, chunk_size, overlap):
    chunks = []
    start = 0
    
    while start < len(text):
        # Determine the end of our current chunk
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        
        # 'Overlap' means we don't jump forward by the full chunk size
        start += (chunk_size - overlap)
        
    return chunks

# Test Data
long_text = "Prompt Engineering is the art of talking to AI. It requires practice, logic, and a deep understanding of how models process tokens and embeddings."

# Let's chunk this into 20-character pieces with 5-character overlap
my_chunks = simple_chunker(long_text, chunk_size=30, overlap=10)

print(f"--- CHUNKING DEMO ---")
print(f"Original Length: {len(long_text)}")
print(f"Number of Chunks: {len(my_chunks)}\n")

for i, c in enumerate(my_chunks):
    print(f"Chunk {i+1}: '{c}'")
```

---

## 4. Why this matters (Production Insight)
In a real RAG system (like a "PDF Chat"), you have to decide:
- **Small Chunks:** Great for finding specific facts (phone numbers, names).
- **Large Chunks:** Great for understanding the general "summary" or complex logic.

**Pro Tip:** Most AI Engineers use **"Recursive Character Text Splitting."** It tries to split at `\n\n` (paragraphs) first, then `\n` (lines), then ` ` (words) to keep the meaning intact.

---
**Summary:**
- **Chunking:** Slicing big data into small vectors.
- **Overlap:** Keeping context alive between slices.

**Next Step:** We'll compare the big players in [Vector Databases (FAISS, Chroma, Pinecone)](file:///d:/myFirstAITest/Phase5/phase5_ecosystem.md). 🚀
