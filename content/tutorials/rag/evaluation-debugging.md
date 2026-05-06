# Phase 15 — Evaluation & Debugging: Making Your RAG System Better

> **Level:** Expert | **Goal:** Measure, debug, and systematically improve every part of your RAG system

---

## 1. Why Evaluation Is Not Optional

Most beginners build a RAG system, test it with 3 questions, and say "it works!" Then in production, 30% of real user questions get wrong answers. That's a disaster.

**Professional AI engineers measure everything:**

```
Without evaluation:
"My RAG seems to work pretty well based on testing."

With evaluation:
"My RAG has:
- Answer Relevancy: 0.87 (good)
- Faithfulness: 0.91 (good — low hallucination)
- Context Recall: 0.73 (NEEDS IMPROVEMENT — missing relevant docs)
- Context Precision: 0.68 (NEEDS IMPROVEMENT — too much noise in retrieval)

Action plan: Improve chunking strategy and increase chunk overlap from 50 to 100."
```

The second approach leads to systematic improvement. The first leads to guessing.

---

## 2. The Four RAGAS Metrics (Industry Standard)

```
Metric               What It Measures              Target Score
──────────────────────────────────────────────────────────────────
Answer Relevancy     Is the answer on-topic?        > 0.85
Faithfulness         Does the answer stick to       > 0.90 ← MOST IMPORTANT
                     the retrieved context?
Context Recall       Were all needed chunks         > 0.80
                     actually retrieved?
Context Precision    Are retrieved chunks            > 0.75
                     actually useful?
```

### Understanding Each Metric

**Faithfulness** (anti-hallucination score):
```
Question: "What is our return window?"
Retrieved Context: "Returns accepted within 14 days."
AI Answer: "Returns are accepted within 30 days."  ← WRONG! Not in context!
Faithfulness: 0.0  ← FAIL: Answer contradicts context

AI Answer: "Based on the policy, returns are accepted within 14 days."
Faithfulness: 1.0  ← PASS: Answer is grounded in context
```

**Context Recall**:
```
Question: "What are the main product features?"
Correct answer requires 3 chunks: A, B, C

Retrieved chunks: A, B, D  ← Missed C, retrieved irrelevant D
Context Recall: 0.67 (found 2 of 3 needed chunks)

Fix: Increase top-K from 3 to 5, or improve chunking
```

---

## 3. Building a RAG Evaluation Suite

```python
# evaluation_suite.py
# Complete RAG evaluation system

from dataclasses import dataclass
from typing import List, Optional
import json
import time

@dataclass
class TestCase:
    """A single test case for evaluating a RAG system."""
    question: str
    expected_answer: str      # The correct answer
    relevant_docs: List[str]  # Which documents SHOULD be retrieved

@dataclass 
class EvalResult:
    """Results from evaluating one test case."""
    question: str
    ai_answer: str
    retrieved_docs: List[str]
    answer_correct: bool
    docs_found: float         # % of relevant docs that were retrieved
    response_time_ms: float
    notes: str = ""

class RAGEvaluator:
    """Systematically evaluate a RAG system against test cases."""
    
    def __init__(self, rag_function):
        """
        rag_function: callable that takes a question and returns
                     {"answer": str, "sources": list}
        """
        self.rag = rag_function
        self.results: List[EvalResult] = []
    
    def evaluate_test_case(self, test_case: TestCase) -> EvalResult:
        """Evaluate a single test case."""
        
        start_time = time.time()
        result = self.rag(test_case.question)
        latency = (time.time() - start_time) * 1000
        
        retrieved_sources = result.get("sources", [])
        
        # Calculate document recall
        if test_case.relevant_docs:
            found = sum(
                1 for doc in test_case.relevant_docs
                if any(doc.lower() in src.lower() for src in retrieved_sources)
            )
            doc_recall = found / len(test_case.relevant_docs)
        else:
            doc_recall = 1.0  # No specific docs required
        
        # Check if answer contains key information
        expected_lower = test_case.expected_answer.lower()
        ai_lower = result["answer"].lower()
        
        # Simple keyword-based correctness check
        key_terms = [word for word in expected_lower.split() if len(word) > 4]
        matches = sum(1 for term in key_terms if term in ai_lower)
        answer_correct = (matches / len(key_terms)) > 0.6 if key_terms else True
        
        return EvalResult(
            question=test_case.question,
            ai_answer=result["answer"],
            retrieved_docs=retrieved_sources,
            answer_correct=answer_correct,
            docs_found=doc_recall,
            response_time_ms=latency
        )
    
    def run_evaluation(self, test_suite: List[TestCase]) -> dict:
        """Run evaluation on all test cases and return summary."""
        
        print(f"\nRunning evaluation on {len(test_suite)} test cases...")
        print("=" * 60)
        
        self.results = []
        for i, test_case in enumerate(test_suite, 1):
            print(f"Test {i}/{len(test_suite)}: {test_case.question[:50]}...")
            result = self.evaluate_test_case(test_case)
            self.results.append(result)
            
            status = "PASS" if result.answer_correct else "FAIL"
            print(f"  [{status}] Latency: {result.response_time_ms:.0f}ms | Doc Recall: {result.docs_found:.0%}")
        
        # Calculate summary metrics
        total = len(self.results)
        accuracy = sum(1 for r in self.results if r.answer_correct) / total
        avg_doc_recall = sum(r.docs_found for r in self.results) / total
        avg_latency = sum(r.response_time_ms for r in self.results) / total
        
        summary = {
            "total_tests": total,
            "accuracy": round(accuracy, 3),
            "avg_doc_recall": round(avg_doc_recall, 3),
            "avg_latency_ms": round(avg_latency, 1),
            "passed": sum(1 for r in self.results if r.answer_correct),
            "failed": sum(1 for r in self.results if not r.answer_correct),
        }
        
        print("\n" + "=" * 60)
        print("EVALUATION SUMMARY:")
        print(f"  Accuracy:        {summary['accuracy']:.1%} ({summary['passed']}/{total} correct)")
        print(f"  Doc Recall:      {summary['avg_doc_recall']:.1%}")
        print(f"  Avg Latency:     {summary['avg_latency_ms']:.0f}ms")
        print("=" * 60)
        
        # Print failures
        failures = [r for r in self.results if not r.answer_correct]
        if failures:
            print(f"\nFailed Questions ({len(failures)}):")
            for f in failures:
                print(f"\n  Q: {f.question}")
                print(f"  AI: {f.ai_answer[:100]}...")
        
        return summary
    
    def save_report(self, filepath: str = "eval_report.json"):
        """Save detailed results to a JSON file."""
        report = {
            "results": [
                {
                    "question": r.question,
                    "ai_answer": r.ai_answer,
                    "correct": r.answer_correct,
                    "doc_recall": r.docs_found,
                    "latency_ms": r.response_time_ms
                }
                for r in self.results
            ]
        }
        with open(filepath, "w") as f:
            json.dump(report, f, indent=2)
        print(f"\nDetailed report saved to: {filepath}")
```

---

## 4. Systematic Debugging Guide

### Debug 1: AI Gives Wrong Answers

```
SYMPTOM: AI answer is incorrect or made up
DIAGNOSIS STEPS:
1. Print the retrieved chunks → Are the RIGHT chunks being retrieved?
2. Print the full prompt → Is the context being formatted correctly?
3. Check chunk size → Are chunks too large (lots of noise)?

DEBUG CODE:
```

```python
def debug_rag_query(question: str, vector_store, llm):
    """Run a RAG query with full debug output."""
    
    print(f"\n{'='*60}")
    print(f"DEBUG MODE — Question: {question}")
    print('='*60)
    
    # Step 1: Show what was retrieved
    docs = vector_store.similarity_search_with_score(question, k=4)
    
    print(f"\n[DEBUG] Retrieved {len(docs)} chunks:")
    for i, (doc, score) in enumerate(docs, 1):
        print(f"\n  Chunk {i} (similarity: {1-score:.3f}):")
        print(f"  Source: {doc.metadata.get('source', '?')}, Page: {doc.metadata.get('page', '?')}")
        print(f"  Content: {doc.page_content[:200]}...")
    
    # Step 2: Show the full prompt
    context = "\n\n".join([doc.page_content for doc, _ in docs])
    full_prompt = f"Context: {context}\n\nQuestion: {question}\nAnswer:"
    
    print(f"\n[DEBUG] Full prompt ({len(full_prompt)} chars):")
    print(f"  {full_prompt[:500]}...")
    
    # Step 3: Show the answer
    answer = llm.invoke(full_prompt)
    print(f"\n[DEBUG] AI Answer:")
    print(f"  {answer}")
    
    # Analysis
    print(f"\n[DEBUG] Analysis:")
    if not docs:
        print("  WARNING: No documents retrieved! Check embedding model and vector store.")
    elif all(1-score < 0.5 for _, score in docs):
        print("  WARNING: Low similarity scores. The question may not match indexed content.")
        print("  FIX: Check if the document contains relevant info. Re-index if needed.")
    elif len(full_prompt) > 4000:
        print("  WARNING: Prompt is very long. Consider reducing chunk_size or top_k.")
```

---

### Debug 2: Retrieval Finds Wrong Documents

```
SYMPTOM: Retrieved chunks are not about the question
DIAGNOSIS: Embedding model mismatch or poor chunking

COMMON CAUSES:
1. Different embedding model used at indexing vs query time
2. Chunks too large (contain multiple unrelated topics)
3. Document preprocessing removed important text
4. Query uses different terminology than documents

FIXES:
```

```python
# Fix 1: Verify embedding consistency
def verify_embedding_model(vector_store_path: str, test_text: str):
    """Make sure you're using the same embedding model that created the store."""
    
    # Load the store
    from langchain_community.vectorstores import Chroma
    from langchain_community.embeddings import SentenceTransformerEmbeddings
    
    embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    store = Chroma(persist_directory=vector_store_path, embedding_function=embeddings)
    
    # Do a simple test query
    results = store.similarity_search(test_text, k=1)
    if results:
        print("[OK] Vector store is accessible and returning results")
        print(f"Sample result: {results[0].page_content[:100]}...")
    else:
        print("[ERROR] No results returned. Check embedding model consistency.")

# Fix 2: Query expansion (rephrase the query)
def expand_query(question: str, llm) -> list:
    """Generate multiple versions of the query to improve retrieval."""
    prompt = f"""Generate 3 different ways to phrase this question for document search:
Original: "{question}"
Variations (one per line):"""
    
    variations = llm.invoke(prompt).strip().split("\n")
    return [v.strip() for v in variations if v.strip()]
```

---

### Debug 3: Answers Contain Hallucinations

```
SYMPTOM: AI adds information that isn't in the retrieved chunks
ROOT CAUSE: The prompt doesn't restrict the LLM enough

BAD PROMPT:
"Answer the question using the following context: {context}"
(LLM can use its own training knowledge to fill gaps!)

GOOD PROMPT:
"ONLY use the EXACT information provided in the context below.
Do NOT use any other knowledge you have.
If the answer isn't in the context, say 'I don't have that information.'

Context:
{context}

Question: {question}"

ADDITIONAL FIXES:
- Use temperature=0 (makes LLM less creative/inventive)
- Use a "grounding checker" after generation
- Use RAGAS faithfulness score to detect hallucinations
```

---

## 5. RAG Quality Improvement Playbook

```
Problem: Low Faithfulness (< 0.80)
─────────────────────────────────
Symptoms: AI makes up facts not in documents
Action 1: Tighten the prompt — add "ONLY use context" instructions
Action 2: Set temperature = 0 on the LLM
Action 3: Use contextual compression to reduce noise in context

Problem: Low Context Recall (< 0.70)
─────────────────────────────────────
Symptoms: AI says "I don't have info" but document exists
Action 1: Increase top-K from 3 to 5 or 7
Action 2: Use Multi-Query retrieval (generates 3+ query variations)
Action 3: Decrease chunk size (more, smaller chunks = better retrieval)
Action 4: Use Hybrid Search (add BM25 for exact term matching)

Problem: Low Context Precision (< 0.65)
────────────────────────────────────────
Symptoms: Retrieved chunks are mostly noise
Action 1: Use a re-ranker (cross-encoder) to filter results
Action 2: Increase the similarity threshold (ignore low-score results)
Action 3: Use metadata filtering to narrow the search
Action 4: Decrease top-K (retrieve less, but more targeted)

Problem: High Latency (> 3 seconds)
──────────────────────────────────
Symptoms: Users complain about slow responses
Action 1: Enable Redis caching for repeated queries
Action 2: Use a smaller/faster embedding model
Action 3: Switch to FAISS instead of ChromaDB
Action 4: Use streaming response (show partial answers as they generate)
Action 5: Pre-warm the model (don't load on first request)
```

---

## 6. Continuous Improvement Loop

```
               ┌─────────────────────────────┐
               ↓                             │
  Build RAG System → Deploy → Collect User Feedback
               ↓
  Analyze Failures (which questions fail?)
               ↓
  Root Cause Analysis (retrieval? chunking? prompt? LLM?)
               ↓
  Apply Fix (see playbook above)
               ↓
  Run Evaluation Suite (RAGAS scores)
               ↓
  Did scores improve? → YES → Deploy improved version
                      → NO → Try different fix
               ↓
  ─────────────────────────────────────────────┘
```

---

## 7. Complete Evaluation Checklist

```
Monthly RAG Health Check:
[ ] Run full RAGAS evaluation on 50+ test cases
[ ] Faithfulness score > 0.90
[ ] Answer Relevancy > 0.85
[ ] Context Recall > 0.80
[ ] Context Precision > 0.75
[ ] Avg latency < 2 seconds
[ ] 99th percentile latency < 5 seconds
[ ] Zero PII leaks in last 30 days
[ ] Hallucination incidents tracked and addressed
[ ] New documents added and re-indexed
[ ] Cache hit rate > 40% (means common questions are cached)
[ ] Monitoring alerts configured and tested
```

---

## 8. Mini Challenge — Final Project

Design and build a complete RAG evaluation system:

1. Pick any topic (your company's HR policies, cooking recipes, Python docs — anything)
2. Create 10 test documents about that topic
3. Index them with ChromaDB
4. Write 15 test questions with expected answers
5. Run the `RAGEvaluator` against all 15 questions
6. Identify your weakest metric
7. Apply ONE fix from the improvement playbook
8. Re-evaluate and show the score improved

---

## Course Complete! What's Next?

Congratulations! You have completed the full RAG Mastery Course. Here is your learning path forward:

```
You Now Know:                          Next Level:
─────────────────────────────────────────────────────
RAG fundamentals                    → GraphRAG, HyperRAG
LangChain RAG                       → LangChain Agents
LangGraph RAG                       → Complex multi-agent systems
Production deployment               → MLOps, CI/CD for AI
Evaluation                          → Red teaming, adversarial testing
Vector databases                    → pgvector, Weaviate schemas
Multi-modal RAG                     → Full Vision + Audio pipelines

Recommended Projects to Build:
1. A RAG system over YOUR company's actual documents
2. A multi-agent research assistant with self-reflection
3. A production RAG API with Redis cache + LangSmith monitoring
4. A RAG system with automated RAGAS evaluation in CI/CD
```

---

## Master Cheat Sheet: RAG at a Glance

```
QUICK REFERENCE:

Chunking:       RecursiveCharacterTextSplitter, 300-600 chars, 50 overlap
Embeddings:     nomic-embed-text (free), text-embedding-3-small (OpenAI)
Vector DB:      ChromaDB (dev), Pinecone/Weaviate (prod)
Retrieval:      top-k=4, Hybrid (Dense+BM25), re-rank with CrossEncoder
LLM:            llama3.2 (free local), GPT-4o (paid, high quality)
Prompt:         "ONLY use the context. If not found, say so."
Evaluation:     RAGAS — Faithfulness > 0.90, Recall > 0.80
Production:     FastAPI + Redis cache + LangSmith + Docker
```
