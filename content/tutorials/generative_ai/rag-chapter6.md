# 📚 RAG Mastery Course — Chapter 6
## Query Understanding & Rewriting: Make Bad Queries Good Before They Hit Retrieval

> *"Garbage in, garbage out. But with query rewriting? We turn garbage into gold."*
> — Your RAG Professor (probably)

---

## 🗺️ Chapter Roadmap

```
┌─────────────────────────────────────────────────────────────────┐
│                     CHAPTER 6 JOURNEY                           │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│ Concept  │   Why    │   How    │  Code    │  Cases   │  Quiz    │
│  🧠      │  ❓      │  ⚙️      │  💻      │  🏭      │  🎯      │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## 🧠 Section 1: The Concept — What Is Query Understanding?

Imagine you're a librarian. A user walks in and says:

> *"thing for heart"*

Do they want:
- ❤️ A book about love?
- 🏥 Cardiology textbooks?
- 💊 Heart medication information?
- 🎵 A music recommendation?

**That's the query understanding problem.** Users type messy, vague, incomplete queries — and your retrieval system has to figure out what they *actually* mean before searching.

**Query Rewriting** is the process of transforming a user's raw query into one (or more) better queries that will return more relevant results.

```
RAW QUERY LIFECYCLE
====================

User types:          "thing for heart"
                            │
                            ▼
              ┌─────────────────────────┐
              │   QUERY UNDERSTANDING   │
              │  ┌───────────────────┐  │
              │  │ Intent Detection  │  │
              │  │ Entity Extraction │  │
              │  │ Expansion/Rewrite │  │
              │  └───────────────────┘  │
              └──────────┬──────────────┘
                         │
                         ▼
Rewritten:    "cardiac medication treatment options
               heart disease therapy recommendations"
                         │
                         ▼
              ┌──────────────────────┐
              │   VECTOR RETRIEVAL   │
              │   (Now finds the     │
              │   RIGHT documents!)  │
              └──────────────────────┘
```

### 🔑 Core Techniques We'll Cover

```
QUERY REWRITING TOOLKIT
========================
┌──────────────────────────────────────────────────────────────┐
│  1. Query Expansion     → Add synonyms & related terms       │
│  2. Query Decomposition → Break complex Q into sub-questions │
│  3. HyDE               → Generate hypothetical answers       │
│  4. Step-Back Prompting → Abstract to broader concepts       │
│  5. Multi-Query         → Generate N variations, merge hits  │
└──────────────────────────────────────────────────────────────┘
```

---

## ❓ Section 2: Why It Matters

Let's look at what happens WITHOUT query rewriting:

```
WITHOUT QUERY REWRITING
=========================

User Query: "my computer wont turn on"
                    │
                    ▼
         Vector Search (raw query)
                    │
         Finds docs about:
         - "computer" ✓
         - "turn" ✗ (irrelevant matches)
         - "wont" → might miss "won't"
                    │
                    ▼
         POOR RESULTS 😢
         Misses: "laptop power failure",
                 "PC boot issue", "no POST"


WITH QUERY REWRITING
=====================

User Query: "my computer wont turn on"
                    │
                    ▼
         Query Rewriter:
         → "laptop won't power on troubleshooting"
         → "PC boot failure no power"
         → "computer startup problem diagnosis"
                    │
                    ▼
         GREAT RESULTS 🎉
         Finds: power supply guides,
                boot sequence docs,
                hardware diagnostics
```

### 📊 The Numbers Don't Lie

```
RETRIEVAL QUALITY COMPARISON
==============================

Metric           │ Raw Query │ Rewritten Query
─────────────────┼───────────┼────────────────
Recall@5         │   42%     │    78%   ↑ 86%
Precision@5      │   51%     │    73%   ↑ 43%
User Satisfaction│   3.1/5   │    4.4/5 ↑ 42%
```

*(Typical numbers from production RAG systems — your mileage may vary!)*

---

## ⚙️ Section 3: How It Works — The 5 Techniques

### Technique 1: Query Expansion

```
QUERY EXPANSION FLOW
=====================

Original: "buy shoes online"
               │
               ▼
   ┌───────────────────────┐
   │   Synonym Expansion   │
   │  shoes → footwear,    │
   │  sneakers, boots      │
   │                       │
   │   Context Addition    │
   │  buy → purchase,      │
   │  order, shop for      │
   └───────────────────────┘
               │
               ▼
Expanded: "purchase footwear sneakers
           boots online shopping store"
```

### Technique 2: Query Decomposition

```
QUERY DECOMPOSITION FLOW
=========================

Complex Query:
"What are the side effects of metformin
 and how does it compare to insulin
 for type 2 diabetes?"
               │
               ▼
   ┌─────────────────────────────┐
   │       DECOMPOSER            │
   └──────┬──────────┬───────────┘
          │          │
          ▼          ▼
  Sub-Query 1:  Sub-Query 2:  Sub-Query 3:
  "metformin    "insulin      "metformin vs
   side         mechanism      insulin type
   effects"     of action"     2 diabetes"
          │          │              │
          └──────────┴──────────────┘
                     │
                     ▼
              Merge & Re-rank
                     │
                     ▼
             Better Final Answer!
```

### Technique 3: HyDE (Hypothetical Document Embeddings)

> 🤯 **Mind-bending idea**: Instead of searching with the *question*, generate a *fake answer* and search with THAT!

```
HyDE FLOW
==========

Query: "How does BERT work?"
               │
               ▼
   ┌─────────────────────────┐
   │   LLM GENERATES         │
   │   FAKE ANSWER:          │
   │                         │
   │  "BERT is a transformer │
   │   model pre-trained on  │
   │   masked language       │
   │   modeling and next     │
   │   sentence prediction…" │
   └──────────┬──────────────┘
              │
              ▼
   Embed the FAKE answer
              │
              ▼
   Search vector DB with it
              │
              ▼
   REAL documents with similar
   embedding will match! 🎯
```

**Why this works**: Real documents look more like other documents than like questions. The fake answer "looks like" a real document!

### Technique 4: Step-Back Prompting

```
STEP-BACK PROMPTING
====================

Specific Query:
"What medication should I take
 for my fever of 102°F?"
         │
         ▼  (Step Back — be more general)
         │
"What are general treatments
 for fever management?"
         │
         ▼  (Search with BOTH queries)
         │
More context → Better grounded answer!

Specific → General (Step Back) → More Docs Found
```

### Technique 5: Multi-Query Generation

```
MULTI-QUERY GENERATION
=======================

Original: "best coffee shop"

LLM generates 3 variations:
  Q1: "top rated coffee shops nearby"
  Q2: "best cafe for working remote"
  Q3: "highly reviewed coffee places"
         │
         ▼
Run 3 parallel searches
         │
         ▼
┌────────┬────────┬────────┐
│ Hits1  │ Hits2  │ Hits3  │
│ A,B,C  │ B,C,D  │ C,D,E  │
└────────┴────────┴────────┘
         │
         ▼
  Reciprocal Rank Fusion
  (merge & deduplicate)
         │
         ▼
Final: [C, B, D, A, E]
(C appeared in all 3 → ranked highest!)
```

---

## 💻 Section 4: Code — Let's Build It!

### Setup: Install What We Need

```python
# Install required libraries
# Run this in your terminal first:
# pip install openai langchain langchain-openai chromadb

import os
from openai import OpenAI

# Initialize OpenAI client
# Replace with your actual API key, or set as environment variable
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "your-key-here"))

print("✅ Setup complete!")
```

---

### Code Block 1: Query Expansion

```python
def expand_query(original_query: str) -> list[str]:
    """
    Takes a user's raw query and expands it with
    synonyms and related terms.

    Args:
        original_query: What the user typed

    Returns:
        List of expanded query strings
    """

    # We give the LLM a very specific instruction
    system_prompt = """You are a query expansion expert.
    Given a search query, generate 3 alternative versions that:
    1. Use synonyms for key terms
    2. Add related context
    3. Cover different phrasings

    Return ONLY a Python list of strings, nothing else.
    Example output: ["query 1", "query 2", "query 3"]
    """

    # Send the query to the LLM
    response = client.chat.completions.create(
        model="gpt-4o-mini",          # Fast and cheap model
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Expand this query: {original_query}"}
        ],
        temperature=0.3               # Low temp = more focused output
    )

    # Extract the text response
    raw_output = response.choices[0].message.content

    # Safely parse the list (the LLM returns a string that looks like a list)
    import ast
    expanded_queries = ast.literal_eval(raw_output)

    # Add original query to the front (always keep the original!)
    all_queries = [original_query] + expanded_queries

    return all_queries


# --- TEST IT ---
user_query = "heart medication"
results = expand_query(user_query)

print(f"Original: {user_query}\n")
print("Expanded queries:")
for i, q in enumerate(results):
    print(f"  {i+1}. {q}")

# Expected output:
# Original: heart medication
#
# Expanded queries:
#   1. heart medication
#   2. cardiac drugs treatment options
#   3. cardiovascular medicine prescriptions
#   4. heart disease pharmaceutical therapy
```

---

### Code Block 2: Query Decomposition

```python
def decompose_complex_query(query: str) -> list[str]:
    """
    Breaks a complex, multi-part question into
    simpler sub-questions that can each be searched
    independently.

    Args:
        query: A complex, multi-part question

    Returns:
        List of simpler sub-questions
    """

    system_prompt = """You are a query decomposition expert.
    If a question has multiple parts or requires multiple lookups,
    break it into simple, atomic sub-questions.
    If the question is already simple, return it as-is in a list.

    Return ONLY a Python list of strings.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ],
        temperature=0.1               # Very low temp = consistent decomposition
    )

    raw_output = response.choices[0].message.content

    import ast
    sub_questions = ast.literal_eval(raw_output)

    return sub_questions


# --- TEST IT ---
complex_query = """What are the side effects of metformin,
how does it compare to insulin for type 2 diabetes,
and what lifestyle changes should accompany treatment?"""

sub_questions = decompose_complex_query(complex_query)

print("Complex query decomposed into:\n")
for i, q in enumerate(sub_questions, 1):
    print(f"  Sub-Q{i}: {q}")

# Expected output:
# Sub-Q1: What are the side effects of metformin?
# Sub-Q2: How does metformin compare to insulin for type 2 diabetes?
# Sub-Q3: What lifestyle changes should accompany diabetes treatment?
```

---

### Code Block 3: HyDE (Hypothetical Document Embedding)

```python
def hyde_query_transform(query: str) -> str:
    """
    HyDE: Instead of searching with the question,
    generate a FAKE answer and search with that.

    Why? Because documents look like documents,
    not like questions. A fake answer looks more
    like real documents!

    Args:
        query: The user's question

    Returns:
        A hypothetical (fake) answer to embed & search with
    """

    system_prompt = """You are a helpful assistant.
    Write a short, dense, factual paragraph that ANSWERS
    the given question. Write it as if it's from a
    reference document, not as a conversational answer.
    Keep it to 3-5 sentences.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ],
        temperature=0.5               # Medium temp = varied but realistic
    )

    # This fake answer will be embedded and used for search
    hypothetical_doc = response.choices[0].message.content

    return hypothetical_doc


# --- TEST IT ---
question = "How does transformer attention mechanism work?"

fake_answer = hyde_query_transform(question)

print(f"Original question:\n{question}\n")
print(f"HyDE fake answer (will be embedded for search):\n{fake_answer}")

# Now you'd embed fake_answer and search your vector DB with it!
# embeddings = get_embedding(fake_answer)
# results = vector_db.search(embeddings)
```

---

### Code Block 4: Multi-Query + Reciprocal Rank Fusion

```python
def generate_multi_queries(query: str, n: int = 3) -> list[str]:
    """
    Generate N different versions of the same query
    to improve recall through diversity.
    """

    system_prompt = f"""Generate {n} different versions of the given query.
    Each version should approach the topic from a slightly different angle.
    Return ONLY a Python list of {n} strings.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ],
        temperature=0.7               # Higher temp = more diverse queries
    )

    import ast
    queries = ast.literal_eval(response.choices[0].message.content)
    return [query] + queries          # Always include original!


def reciprocal_rank_fusion(
    search_results: list[list[str]],
    k: int = 60
) -> list[tuple[str, float]]:
    """
    Merge multiple ranked result lists into one final ranking.

    RRF Formula: score(doc) = sum(1 / (k + rank))
    Documents appearing in multiple lists get higher scores!

    Args:
        search_results: List of lists, each inner list is ranked docs
        k: Constant (60 is standard, reduces impact of top ranks)

    Returns:
        Sorted list of (doc_id, score) tuples
    """

    # Dictionary to accumulate scores for each document
    scores = {}

    # For each result list...
    for result_list in search_results:
        # For each document and its rank in that list...
        for rank, doc_id in enumerate(result_list, start=1):
            # Add RRF score: 1 / (k + rank)
            if doc_id not in scores:
                scores[doc_id] = 0.0

            scores[doc_id] += 1.0 / (k + rank)
            # ↑ Documents ranked #1 get: 1/(60+1) = 0.0164
            # Documents ranked #10 get: 1/(60+10) = 0.0143
            # Small difference → top ranks matter but not excessively

    # Sort by score (highest first) and return
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return ranked


# --- TEST IT ---

# Simulate 3 search result lists (these would come from your vector DB)
results_from_query_1 = ["doc_C", "doc_A", "doc_B", "doc_E"]
results_from_query_2 = ["doc_B", "doc_C", "doc_D", "doc_A"]
results_from_query_3 = ["doc_C", "doc_D", "doc_E", "doc_B"]

all_results = [
    results_from_query_1,
    results_from_query_2,
    results_from_query_3
]

fused = reciprocal_rank_fusion(all_results)

print("RRF Final Ranking:")
print("-" * 35)
for rank, (doc_id, score) in enumerate(fused, 1):
    print(f"  #{rank}: {doc_id}  (score: {score:.4f})")

# Expected output:
# #1: doc_C  (score: 0.0490)  ← appeared in all 3 lists!
# #2: doc_B  (score: 0.0447)  ← appeared in all 3 lists
# #3: doc_D  (score: 0.0290)  ← appeared in 2 lists
# ...
```

---

### Code Block 5: The Complete Query Rewriting Pipeline 🚀

```python
class QueryRewritingPipeline:
    """
    A complete pipeline that:
    1. Detects if the query is simple or complex
    2. Applies the right rewriting strategy
    3. Returns optimized queries ready for retrieval
    """

    def __init__(self, strategy: str = "multi_query"):
        """
        Args:
            strategy: One of:
                - "expand"      → Query expansion
                - "decompose"   → Decompose complex queries
                - "hyde"        → Hypothetical Document Embedding
                - "multi_query" → Generate multiple query variants
        """
        self.strategy = strategy
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def rewrite(self, query: str) -> dict:
        """
        Main method: rewrite a query using the chosen strategy.

        Returns a dict with original query + rewritten queries
        """

        print(f"\n🔍 Original query: '{query}'")
        print(f"⚙️  Strategy: {self.strategy}\n")

        if self.strategy == "expand":
            rewritten = expand_query(query)
            result_type = "expanded_queries"

        elif self.strategy == "decompose":
            rewritten = decompose_complex_query(query)
            result_type = "sub_questions"

        elif self.strategy == "hyde":
            rewritten = [hyde_query_transform(query)]
            result_type = "hypothetical_document"

        elif self.strategy == "multi_query":
            rewritten = generate_multi_queries(query)
            result_type = "query_variants"

        else:
            raise ValueError(f"Unknown strategy: {self.strategy}")

        return {
            "original": query,
            "strategy": self.strategy,
            result_type: rewritten,
            "count": len(rewritten)
        }


# --- TEST THE FULL PIPELINE ---

# Example 1: Simple query → expand it
pipeline = QueryRewritingPipeline(strategy="expand")
result = pipeline.rewrite("best laptop for students")

print(f"Generated {result['count']} queries:")
for q in result.get("expanded_queries", []):
    print(f"  → {q}")

print("\n" + "="*50 + "\n")

# Example 2: Complex query → decompose it
pipeline2 = QueryRewritingPipeline(strategy="decompose")
result2 = pipeline2.rewrite(
    "What are the tax implications of selling stocks "
    "and how does it differ between short-term and "
    "long-term capital gains in 2024?"
)

print(f"Decomposed into {result2['count']} sub-questions:")
for q in result2.get("sub_questions", []):
    print(f"  → {q}")
```

---

## 🏭 Section 5: Real Industry Use Cases

### 🛒 Use Case 1: E-Commerce — "The Amazon Problem"

**Scenario**: Users search for products using wildly inconsistent language.

```
E-COMMERCE QUERY REWRITING
============================

Customer types:    "blue pants mens"
                       │
        ┌──────────────┴──────────────┐
        │     QUERY REWRITER          │
        └──────────────┬──────────────┘
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
"men's blue       "navy trousers   "blue denim
 jeans denim"      formal men"      chinos mens"
       │               │               │
       └───────────────┴───────────────┘
                       │
               Vector Search
               (searches all 3)
                       │
                       ▼
            RRF Merged Results:
            ✅ Blue jeans (exact match)
            ✅ Navy chinos (close match)
            ✅ Indigo dress pants (semantic match)

WITHOUT REWRITING:
            ❌ Might only show results with exact
               phrase "blue pants mens" in product title
```

```python
# E-Commerce implementation sketch
class EcommerceQueryRewriter:

    def rewrite_product_search(self, raw_query: str) -> list[str]:
        """
        Specialized rewriter for product searches.
        Handles: typos, slang, abbreviations, and
        generates category-aware expansions.
        """

        system_prompt = """You are an e-commerce search expert.
        Rewrite the product search query to maximize recall.
        Consider:
        - Gender variants (men's/women's/unisex)
        - Color synonyms (navy = dark blue, crimson = red)
        - Material synonyms (denim = jeans, cotton = fabric)
        - Category terms (pants = trousers = slacks)

        Return a Python list of 3 search queries.
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": raw_query}
            ]
        )

        import ast
        return ast.literal_eval(response.choices[0].message.content)


# Usage
rewriter = EcommerceQueryRewriter()
queries = rewriter.rewrite_product_search("blu pant for man")
print(queries)
# → ["blue pants men", "men's blue trousers", "male blue denim jeans"]
```

**Business impact**: Major retailers report 15-25% improvement in product discovery and add-to-cart rates with query rewriting.

---

### 🏥 Use Case 2: Healthcare — "The Patient Communication Gap"

**Scenario**: Patients use everyday language; medical databases use clinical terminology.

```
HEALTHCARE QUERY TRANSLATION
==============================

Patient types:         Doctor types:
"bad chest pain        "acute myocardial
 left side heart       infarction anterior
 feels heavy"          chest presentation"
       │                       │
       └──────────┬────────────┘
                  │
       ┌──────────▼────────────┐
       │   MEDICAL TRANSLATOR  │
       │   (Query Rewriter)    │
       └──────────┬────────────┘
                  │
       ┌──────────▼────────────┐
       │  Medical Terms:       │
       │  • chest pain → chest │
       │    discomfort, angina,│
       │    thoracic pain      │
       │  • left side → left   │
       │    lateral, cardiac   │
       │  • heavy feeling →    │
       │    pressure, squeezing│
       └──────────┬────────────┘
                  │
                  ▼
       Searches clinical docs,
       treatment protocols,
       drug interaction databases
```

```python
class MedicalQueryTranslator:
    """
    Bridges the gap between patient language
    and clinical/medical terminology.

    ⚠️  DISCLAIMER: This is for educational purposes.
        Real medical RAG systems need clinical validation!
    """

    def translate_patient_query(self, patient_query: str) -> dict:
        """
        Translates casual patient language to clinical terms
        while preserving the original for patient-facing UI.
        """

        system_prompt = """You are a medical terminology expert.
        Given a patient's description of symptoms in everyday language,
        provide:
        1. Clinical search query using medical terms
        2. ICD-10 category hints if applicable
        3. Differential keywords for comprehensive search

        Return as a Python dict with keys:
        'clinical_query', 'icd_hints', 'differentials'
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": patient_query}
            ]
        )

        import ast
        result = ast.literal_eval(
            response.choices[0].message.content
        )

        # Always include the original for audit trails
        result["original_patient_query"] = patient_query
        return result


# Usage
translator = MedicalQueryTranslator()
output = translator.translate_patient_query(
    "my stomach hurts after eating and I feel like throwing up"
)

print(output)
# {
#   "clinical_query": "postprandial abdominal pain nausea",
#   "icd_hints": ["K21", "K25", "K29"],
#   "differentials": ["GERD", "peptic ulcer", "gastroparesis"],
#   "original_patient_query": "my stomach hurts after eating..."
# }
```

**Business impact**: Hospital systems using semantic query rewriting see 40% faster nurse information retrieval and reduced clinical documentation lookup time.

---

### ⚖️ Bonus Use Case: Legal — "The Statute Language Problem"

```
LEGAL QUERY REWRITING
=======================

Lawyer's casual note:    → Formal legal search:
"tenant won't pay rent"  → "breach of lease agreement
                             non-payment of rent
                             unlawful detainer eviction"

"car accident injury"    → "motor vehicle collision
                             personal injury tort
                             negligence liability damages"

"fired without reason"   → "wrongful termination
                             at-will employment breach
                             constructive dismissal"
```

The pattern: **legal language is precise and standardized** — query rewriting maps natural language to legal terms that actually appear in case law and statutes.

---

## 🏋️ Section 6: Exercise — Build Your Own Rewriter

**Your Mission**: Build a query rewriter for a **customer support chatbot** for a software company.

### Requirements

1. Handle vague queries like "it's broken", "doesn't work", "help"
2. Expand to include product-specific terms
3. Decompose multi-issue reports into single-issue sub-queries

### Starter Code (fill in the blanks!)

```python
class CustomerSupportQueryRewriter:
    """
    Exercise: Complete this class!
    """

    def __init__(self, product_name: str):
        self.product_name = product_name
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def rewrite(self, user_complaint: str) -> list[str]:
        """
        TODO: Implement this method!

        Steps:
        1. Check if complaint is vague → if yes, ask LLM to
           infer what technical issue it might be

        2. Add product name context to the query

        3. If complaint has multiple issues, decompose it

        4. Return a list of search-ready queries

        Hint: Start with a system prompt that explains
        the software support context!
        """

        # YOUR CODE HERE
        system_prompt = f"""
        You are a {self.product_name} technical support expert.
        # TODO: Complete this prompt...
        """

        # TODO: Call the API, parse response, return list of queries
        pass


# Test your solution with:
rewriter = CustomerSupportQueryRewriter("VS Code")
queries = rewriter.rewrite("the blue thing on the left keeps crashing")
print(queries)
# Good output would be something like:
# [
#   "VS Code sidebar panel crash",
#   "VS Code Explorer panel not responding",
#   "VS Code activity bar freeze"
# ]
```

### ✅ Solution Checklist
- [ ] Handles vague language ("thing", "broken", "doesn't work")
- [ ] Adds product context to all queries
- [ ] Decomposes multi-issue reports
- [ ] Returns at least 2 query variations
- [ ] Doesn't crash on empty input

---

## 🎯 Section 7: Mini Quiz

### Question 1

**What problem does HyDE (Hypothetical Document Embedding) solve?**

A) It makes the vector database faster  
B) It transforms a question into something that "looks like" a real document for better semantic matching  
C) It compresses embeddings to save memory  
D) It filters out irrelevant documents after retrieval

*(Answer: B — questions and documents live in different embedding "neighborhoods"; HyDE bridges that gap!)*

---

### Question 2

**You have a user query: "compare apple vs samsung vs google phones camera quality battery life price".**

**Which technique is MOST appropriate?**

A) HyDE — generate a fake product review  
B) Query Expansion — add synonyms  
C) Query Decomposition — break into one query per dimension  
D) Step-Back Prompting — ask a more general question

*(Answer: C — this is a multi-dimensional comparison. Decompose into: "Apple iPhone camera quality", "Samsung camera quality", "Google Pixel camera quality", "battery life comparison", "price comparison". Each sub-query retrieves focused results!)*

---

### Question 3

**In Reciprocal Rank Fusion (RRF), a document appears in:**
- List 1 at rank #1
- List 2 at rank #2
- List 3 at rank #50

**Another document appears in:**
- List 1 at rank #2
- List 2 at rank #3
- (Not in List 3 at all)

**Which document gets a higher RRF score? (k=60)**

```
Document A score = 1/(60+1) + 1/(60+2) + 1/(60+50)
                 = 0.01639 + 0.01613 + 0.00901
                 = 0.04153

Document B score = 1/(60+2) + 1/(60+3) + 0
                 = 0.01613 + 0.01587 + 0
                 = 0.03200
```

**Answer: Document A** — even though it ranked #50 in List 3, its top rankings in Lists 1 and 2 give it an edge. Appearing in MORE lists matters a lot!

---

## 🔭 What's Coming in Chapter 7...

You've learned how to make queries *better* before retrieval. But what happens *during* retrieval?

> **Chapter 7: Advanced Retrieval Strategies — Dense, Sparse & Hybrid Search**
>
> *"Not all searches are created equal. Sometimes cosine similarity just isn't enough."*

We'll cover:
- 🔷 **Dense Retrieval** (embeddings) vs 🔶 **Sparse Retrieval** (BM25/TF-IDF)
- 🔀 **Hybrid Search** — combining both for best-of-both-worlds results
- 📐 **Reranking** with cross-encoders (the secret weapon of top RAG systems)
- 🏎️ **Approximate Nearest Neighbor (ANN)** — making search lightning fast at scale
- 🎛️ **Tuning retrieval parameters** for precision vs recall tradeoffs

**Sneak peek**:
```python
# This is what we'll build in Chapter 7...
results = hybrid_search(
    query="cardiac medication dosage",
    dense_weight=0.7,    # Semantic understanding
    sparse_weight=0.3,   # Exact keyword matching
    top_k=10,
    rerank=True          # Cross-encoder re-scoring
)
# Best of both worlds! 🎯
```

---

## 📖 Chapter 6 Summary Cheat Sheet

```
┌───────────────────────────────────────────────────────────────────┐
│              CHAPTER 6: QUERY REWRITING CHEAT SHEET               │
├──────────────────┬────────────────────────────────────────────────┤
│ Technique        │ Best For                                        │
├──────────────────┼────────────────────────────────────────────────┤
│ Query Expansion  │ Short/vague queries, synonym-heavy domains      │
│ Decomposition    │ Multi-part questions, comparison queries        │
│ HyDE             │ Technical/academic domains, question-heavy RAG  │
│ Step-Back        │ Overly specific queries, need broader context   │
│ Multi-Query+RRF  │ General use, highest recall, most robust        │
├──────────────────┼────────────────────────────────────────────────┤
│ When to use what?│                                                 │
│ Simple query     │ → Expansion or Multi-Query                      │
│ Complex query    │ → Decomposition                                 │
│ Technical query  │ → HyDE                                          │
│ Narrow query     │ → Step-Back                                     │
│ High-stakes RAG  │ → Multi-Query + RRF (use this as default!)      │
└──────────────────┴────────────────────────────────────────────────┘
```

---

*Happy querying! Remember: a great RAG system starts with a great query. Now go make those queries shine.* ✨

> 📌 **GitHub**: All code from this chapter → `rag-course/chapter6/`
> 💬 **Discord**: Share your exercise solutions in `#chapter6-solutions`