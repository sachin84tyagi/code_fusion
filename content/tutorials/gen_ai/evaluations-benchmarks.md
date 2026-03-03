# Phase 6: LLM Engineering (Real Systems) - Step 1 (Evaluations & Benchmarks)

Up until now, we've been saying "The AI answer looks good." But in a real job, "Looks good" isn't enough. You need to **measure** how good it is. 

This is called **Evaluations (Evals)**.

---

## 1. Why Evals?
Imagine you change your prompt slightly. How do you know if it got better or worse?
- Did it become more accurate?
- Did it start hallucinating more?
- Did it get faster?

**Benchmarks** are standardized tests (like the SATs for AI) that compare models. **Evals** are custom tests you write for *your* specific app.

## 2. Common Evaluation Metrics
1.  **Exact Match:** Does the AI output exactly what we expected (e.g., for code or JSON)?
2.  **Semantic Similarity:** Is the *meaning* of the answer close to our ground truth?
3.  **LLM-as-a-Judge:** Using a stronger AI (like GPT-4) to grade the answer of a smaller AI (like GPT-3.5).

---

## 3. The Coding Exercise (Hands-on)

We are going to build a "Scoring Engine" that evaluates an AI's answer against a "Ground Truth" (The correct answer).

#### Step 1: The "Eval Basics" script
Create a file named `eval_basics.py` inside your `Phase6` folder:

```python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# 1. Load the similarity brain
model = SentenceTransformer('all-MiniLM-L6-v2')

def evaluate_answer(ai_response, ground_truth):
    print(f"\n[AI RESPONSE]: {ai_response}")
    print(f"[GROUND TRUTH]: {ground_truth}")

    # --- METRIC 1: EXACT MATCH ---
    is_exact = ai_response.strip().lower() == ground_truth.strip().lower()

    # --- METRIC 2: SEMANTIC SCORE ---
    # We use vector math to see if they mean the same thing
    vec1 = model.encode([ai_response])
    vec2 = model.encode([ground_truth])
    similarity = cosine_similarity(vec1, vec2)[0][0]

    print(f"-> Exact Match: {is_exact}")
    print(f"-> Semantic Score: {similarity:.2f} / 1.0")

    if similarity > 0.85:
        print("✅ PASS: Answer is reliable.")
    else:
        print("❌ FAIL: Answer is too different.")

# Test it
evaluate_answer("The capital of France is Paris.", "Paris is the capital city of France.")
evaluate_answer("Python was made in 1995.", "Python was released in 1991.")
```

---

## 4. Why this matters (Production Insight)
In a real AI company, you run thousands of these "Evals" every time you change a single word in your prompt. This prevents **Regressions** (where fixing one bug creates two new ones). 

**The Golden Rule of LLM Engineering:** You cannot improve what you cannot measure.

---
**Summary:**
- **Evaluations:** Custom tests for your AI.
- **Benchmarks:** General tests for all AI models.
- **Semantic Score:** Measuring meaning, not just letters.

**Next Step:** We'll learn how to handle when the AI actually fails or hits a speed limit: [Error Handling & Retries (Tenacity)](file:///d:/myFirstAITest/Phase6/phase6_errors.md). 🚀
