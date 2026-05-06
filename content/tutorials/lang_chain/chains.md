# ⛓️ Phase 5 — Chains
### "Building AI Pipelines That Actually Work"

> **Difficulty**: ⭐⭐ Intermediate | **Time**: ~90 minutes | **Prerequisites**: Phase 4 Complete

---

## 🎯 What You'll Learn

- ✅ What chains are and why they exist
- ✅ Simple chains (Prompt → Model → Output)
- ✅ Sequential chains (step 1 → step 2 → step 3)
- ✅ Parallel chains (multiple tasks at once)
- ✅ Router chains (smart routing based on input)
- ✅ Custom chains
- ✅ Real projects: Email Writer, Resume Analyzer, AI Support Bot

---

## 📖 Lesson 5.1 — What Is A Chain?

### Simple Explanation

A **chain** is a sequence of operations where the output of one step becomes the input of the next.

Think of it like an assembly line in a factory:

```
Raw Material → [Machine 1] → Semi-finished → [Machine 2] → Final Product
Customer Email→ [Classify]  → Category     →  [Generate]  → Support Reply
```

In LangChain, each "machine" can be:
- A prompt template (formats data)
- A model (AI processes data)
- An output parser (structures the response)
- A tool (performs an action)
- Another chain!

### Why Use Chains?

Without chains, you'd manually pass output from step to step:

```python
# ❌ Manual (messy, repetitive, error-prone)
step1_result = llm.invoke(step1_prompt.format(input=user_input))
step2_result = llm.invoke(step2_prompt.format(input=step1_result.content))
step3_result = llm.invoke(step3_prompt.format(input=step2_result.content))
# ...this gets messy fast with error handling!

# ✅ Chain (clean, automatic, composable)
result = (step1_prompt | llm | step2_prompt | llm | step3_prompt | llm | parser).invoke({"input": user_input})
```

---

## 📖 Lesson 5.2 — Simple Chain (The Foundation)

### The LCEL Simple Chain

```
Prompt Template → LLM Model → Output Parser
       ↓                           ↓
  "Hello {name}!"            "Hello Ahmed!"
```

```python
# ============================================================
# FILE: chains/simple_chain.py
# PURPOSE: Building your first LangChain chain
# ============================================================

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser

# ---- The 3 Components ----
# 1. Prompt: Formats input
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a professional {role}. Be concise."),
    ("human", "{question}")
])

# 2. Model: Processes input
llm = ChatOllama(model="llama3.2", temperature=0.7)

# 3. Parser: Formats output (AIMessage → plain string)
parser = StrOutputParser()

# ---- Connect with | (pipe) ----
chain = prompt | llm | parser

# ---- Run the chain ----
result = chain.invoke({
    "role": "marketing expert",
    "question": "Give me 3 tips for social media growth"
})

print(result)

# ---- Reuse with different inputs ----
tech_answer = chain.invoke({
    "role": "software engineer",
    "question": "What makes Python great for AI?"
})

legal_answer = chain.invoke({
    "role": "lawyer",
    "question": "What's the most common startup legal mistake?"
})

print("\n📱 Marketing:", result[:100])
print("💻 Tech:", tech_answer[:100])
print("⚖️ Legal:", legal_answer[:100])
```

---

## 📖 Lesson 5.3 — Sequential Chains

### What Is A Sequential Chain?

Multiple chains connected in a sequence. **Output of Chain 1 → Input of Chain 2 → Input of Chain 3...**

```
User Input
    ↓
[Chain 1: Analyze the problem]
    ↓  (analysis text)
[Chain 2: Generate solution]
    ↓  (solution text)
[Chain 3: Create action plan]
    ↓
Final Output
```

### Sequential Chain Example: Blog Post Generator

```python
# ============================================================
# FILE: chains/sequential_chain.py
# PURPOSE: Multi-step AI pipeline
# ============================================================

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser

llm = ChatOllama(model="llama3.2")
parser = StrOutputParser()

# ---- Chain 1: Generate blog title ----
title_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a viral content creator. Create catchy titles."),
    ("human", "Generate ONE compelling blog title about: {topic}\n"
              "The title should be clickable and SEO-friendly. "
              "Return ONLY the title, nothing else.")
])
title_chain = title_prompt | llm | parser

# ---- Chain 2: Generate blog outline ----
outline_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a professional content strategist."),
    ("human", "Create a detailed blog outline for this title:\n\n"
              "Title: {title}\n\n"
              "Format: Introduction, 4-5 main sections with subpoints, Conclusion. "
              "Return only the outline.")
])
outline_chain = outline_prompt | llm | parser

# ---- Chain 3: Write the full blog post ----
blog_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert blogger who writes engaging, informative content."),
    ("human", "Write a full blog post based on this outline:\n\n"
              "{outline}\n\n"
              "Guidelines: 600 words, conversational tone, include examples, "
              "end with a strong call-to-action.")
])
blog_chain = blog_prompt | llm | parser

# ---- Run the sequential pipeline ----
def generate_blog_post(topic: str):
    print(f"🚀 Generating blog post about: {topic}\n")
    
    # Step 1: Generate title
    print("📝 Step 1: Creating title...")
    title = title_chain.invoke({"topic": topic})
    print(f"  Title: {title}")
    
    # Step 2: Generate outline (uses title from step 1)
    print("\n📋 Step 2: Creating outline...")
    outline = outline_chain.invoke({"title": title})
    print(outline)
    
    # Step 3: Write full post (uses outline from step 2)
    print("\n✍️ Step 3: Writing blog post...")
    blog_post = blog_chain.invoke({"outline": outline})
    
    return {
        "title": title,
        "outline": outline,
        "blog_post": blog_post
    }

# Run it!
result = generate_blog_post("How AI is changing software development")

print("\n" + "="*50)
print("📰 FINAL BLOG POST:")
print("="*50)
print(f"# {result['title']}\n")
print(result['blog_post'])
```

### LCEL Sequential Chain (Cleaner Version)

```python
# ============================================================
# FILE: chains/lcel_sequential.py
# PURPOSE: Clean LCEL sequential chain with RunnablePassthrough
# ============================================================

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda

llm = ChatOllama(model="llama3.2")
parser = StrOutputParser()

# Individual chains
title_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "Create viral blog titles."),
        ("human", "ONE catchy title for: {topic}")
    ]) | llm | parser
)

blog_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "You are an expert blogger."),
        ("human", "Write a 300-word blog intro for this title: {title}")
    ]) | llm | parser
)

# ---- Full pipeline with state passing ----
full_pipeline = (
    RunnablePassthrough.assign(title=title_chain)
    | RunnablePassthrough.assign(blog_intro=blog_chain)
)

# Run it
result = full_pipeline.invoke({"topic": "AI automation"})
print("Title:", result["title"])
print("\nBlog Intro:", result["blog_intro"])
```

---

## 📖 Lesson 5.4 — Parallel Chains

### What Is A Parallel Chain?

Run multiple chains at the **same time** (simultaneously). This is great when you have independent tasks.

```
                    ┌─→ [Chain A: Pros analysis]  ─┐
User Input ────────┤                                 ├──→ Combine Results
                    └─→ [Chain B: Cons analysis]  ─┘
```

Instead of: Chain A (3s) → Chain B (3s) = **6 seconds**
Parallel:   Chain A + Chain B simultaneously = **3 seconds**

### Parallel Chain Example

```python
# ============================================================
# FILE: chains/parallel_chain.py
# PURPOSE: Running multiple chains simultaneously
# ============================================================

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel

llm = ChatOllama(model="llama3.2")
parser = StrOutputParser()

# Three independent analysis chains
pros_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "Identify advantages clearly and concisely."),
        ("human", "List 3 main PROS of: {topic}")
    ]) | llm | parser
)

cons_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "Identify disadvantages honestly."),
        ("human", "List 3 main CONS of: {topic}")
    ]) | llm | parser
)

verdict_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "You give balanced, expert verdicts."),
        ("human", "Give a one-paragraph expert verdict on: {topic}")
    ]) | llm | parser
)

# ---- Create Parallel Chain ----
# RunnableParallel runs ALL chains at the same time
analysis_chain = RunnableParallel(
    pros=pros_chain,
    cons=cons_chain,
    verdict=verdict_chain
)

# ---- Run all three simultaneously ----
print("🔄 Running parallel analysis...")
result = analysis_chain.invoke({"topic": "using AI in education"})

print("\n✅ PROS:")
print(result["pros"])

print("\n❌ CONS:")
print(result["cons"])

print("\n⚖️ VERDICT:")
print(result["verdict"])
```

---

## 📖 Lesson 5.5 — Router Chain

### What Is A Router Chain?

A smart chain that **decides which chain to use** based on the input. Like a receptionist who directs you to the right department.

```
Customer Message
       ↓
  [ROUTER]
  ↙  ↓  ↘
Tech  Billing  Shipping
Chain  Chain   Chain
  ↘   ↓   ↙
    Result
```

### Router Chain Example: Smart Customer Support

```python
# ============================================================
# FILE: chains/router_chain.py
# PURPOSE: Route requests to specialized chains
# ============================================================

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableBranch, RunnableLambda

llm = ChatOllama(model="llama3.2", temperature=0.3)
parser = StrOutputParser()

# ---- Specialized Chains for Each Department ----
technical_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "You are a Level 2 technical support engineer. "
                   "Give precise technical solutions."),
        ("human", "{message}")
    ]) | llm | parser
)

billing_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "You are a billing specialist. Be empathetic about money issues. "
                   "Always offer to review accounts manually."),
        ("human", "{message}")
    ]) | llm | parser
)

shipping_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "You are a shipping specialist. Check order details. "
                   "Be proactive about solutions."),
        ("human", "{message}")
    ]) | llm | parser
)

general_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "You are a helpful general customer support agent."),
        ("human", "{message}")
    ]) | llm | parser
)

# ---- Classifier Chain ----
# This chain decides which department to route to
classifier_prompt = ChatPromptTemplate.from_messages([
    ("system", """Classify this customer message into ONE category.
Only respond with one word: technical, billing, shipping, or general.

technical = product not working, bugs, error messages, account access
billing = payment, invoice, refund, charges, subscription
shipping = delivery, tracking, return, address, package
general = everything else"""),
    ("human", "{message}")
])
classifier_chain = classifier_prompt | llm | StrOutputParser()

# ---- The Router Logic ----
def route_message(info):
    """
    This function decides which chain to use.
    info = {"message": "...", "category": "..."}
    """
    category = info.get("category", "general").strip().lower()
    message = info["message"]
    
    if "technical" in category:
        return technical_chain.invoke({"message": message})
    elif "billing" in category:
        return billing_chain.invoke({"message": message})
    elif "shipping" in category:
        return shipping_chain.invoke({"message": message})
    else:
        return general_chain.invoke({"message": message})

# ---- Full Router Pipeline ----
from langchain_core.runnables import RunnablePassthrough

router_chain = (
    RunnablePassthrough.assign(
        category=classifier_chain  # First classify the message
    ) 
    | RunnableLambda(route_message)  # Then route to correct chain
)

# ---- Test It ----
test_messages = [
    "My app keeps crashing when I try to upload files",  # Technical
    "I was charged twice for my subscription",           # Billing
    "My package hasn't arrived, it's been 2 weeks",      # Shipping
    "What are your business hours?",                     # General
]

for message in test_messages:
    print(f"\n💬 Customer: {message}")
    response = router_chain.invoke({"message": message})
    print(f"🤖 Support: {response[:200]}")
    print("-" * 60)
```

---

## 🏭 Real Project: Resume Analyzer

```python
# ============================================================
# FILE: chains/projects/resume_analyzer.py
# PURPOSE: Complete AI resume analysis system
# ============================================================

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

llm = ChatOllama(model="llama3.2", temperature=0.3)
parser = StrOutputParser()

# ---- Analysis Chains ----
skills_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "You are an expert HR recruiter specializing in tech hiring."),
        ("human", "Extract and categorize ALL technical skills from this resume:\n\n"
                  "{resume}\n\nFormat: Technical Skills, Soft Skills, Tools/Frameworks")
    ]) | llm | parser
)

experience_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "You are an experienced talent acquisition specialist."),
        ("human", "Analyze the work experience in this resume:\n\n"
                  "{resume}\n\n"
                  "Provide: Total years of experience, career progression, "
                  "notable achievements, and industry expertise.")
    ]) | llm | parser
)

strength_weakness_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "You are an objective career coach."),
        ("human", "Based on this resume:\n\n{resume}\n\n"
                  "List 3 STRENGTHS and 3 areas for IMPROVEMENT. Be specific.")
    ]) | llm | parser
)

# ---- Combine and Score ----
scoring_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "You are a senior hiring manager making final decisions."),
        ("human", """Score this candidate out of 100 and make a hiring recommendation.

RESUME:
{resume}

ANALYSIS:
Skills: {skills}
Experience: {experience}
Strengths/Weaknesses: {strengths_weaknesses}

Provide:
1. Score: X/100
2. Recommendation: HIRE / CONSIDER / REJECT
3. Reason (2 sentences)
4. Suggested role level: Junior/Mid/Senior""")
    ]) | llm | parser
)

def analyze_resume(resume_text: str) -> dict:
    """Run complete resume analysis."""
    
    print("🔍 Analyzing resume...\n")
    
    # Run skills, experience, and strength analysis in PARALLEL
    parallel_analysis = RunnableParallel(
        skills=skills_chain,
        experience=experience_chain,
        strengths_weaknesses=strength_weakness_chain
    )
    
    analysis = parallel_analysis.invoke({"resume": resume_text})
    
    # Now score using all the analysis
    score = scoring_chain.invoke({
        "resume": resume_text,
        "skills": analysis["skills"],
        "experience": analysis["experience"],
        "strengths_weaknesses": analysis["strengths_weaknesses"]
    })
    
    return {
        "skills": analysis["skills"],
        "experience": analysis["experience"],
        "strengths_weaknesses": analysis["strengths_weaknesses"],
        "final_score": score
    }

# ---- Test with sample resume ----
sample_resume = """
JOHN SMITH
Email: john@email.com | LinkedIn: linkedin.com/in/johnsmith

EXPERIENCE:
Senior Software Engineer at TechStartup (2021-2024)
- Led team of 5 engineers building microservices architecture
- Reduced API response time by 60% through optimization
- Implemented CI/CD pipeline reducing deployment time by 80%

Software Engineer at BigCorp (2018-2021)
- Developed React frontend for 100k+ user platform
- Built REST APIs using Python FastAPI and PostgreSQL
- Mentored 3 junior developers

EDUCATION:
B.S. Computer Science, State University (2018)

SKILLS:
Python, JavaScript, React, FastAPI, AWS, Docker, Kubernetes, PostgreSQL, Redis
Leadership, Communication, Problem-solving
"""

results = analyze_resume(sample_resume)

print("="*60)
print("📊 RESUME ANALYSIS REPORT")
print("="*60)
print("\n🛠️ SKILLS:")
print(results["skills"])
print("\n💼 EXPERIENCE:")
print(results["experience"])
print("\n💪 STRENGTHS & WEAKNESSES:")
print(results["strengths_weaknesses"])
print("\n🏆 FINAL VERDICT:")
print(results["final_score"])
```

---

## ⚠️ Common Chain Mistakes

### Mistake 1: Not Handling Errors In Chains

```python
# ❌ No error handling
result = chain.invoke({"input": user_input})

# ✅ With error handling
try:
    result = chain.invoke({"input": user_input})
except Exception as e:
    print(f"Chain failed: {e}")
    result = "Sorry, I couldn't process that."
```

### Mistake 2: Missing Variable Names

```python
# ❌ Template has {name} but you pass "username"
chain.invoke({"username": "Ahmed"})  # KeyError!

# ✅ Match variable names exactly
chain.invoke({"name": "Ahmed"})
```

### Mistake 3: Overcomplicating Chains

```python
# ❌ Trying to do too much in one chain
massive_prompt = "Do A, B, C, D, E, F, G all at once"

# ✅ Break into smaller focused chains
chain_a = ... # Does A
chain_b = ... # Does B
chain_c = ... # Does C
full_chain = chain_a | chain_b | chain_c
```

---

## 🧠 Quick Quiz

1. What is the difference between Sequential and Parallel chains?
2. What does the `|` operator do in LangChain?
3. When would you use a Router chain?
4. What is `StrOutputParser` and why do you need it?
5. What's `RunnableParallel` used for?
6. In what order does data flow through a chain?

---

## 🎯 Mini Challenges

**Challenge 1** (Beginner): Build a "Story Generator Chain" — takes a genre (horror, comedy, sci-fi) and character name, generates a story title, then writes a 200-word story.

**Challenge 2** (Intermediate): Build an "Email Analyzer Chain" — takes an email text and in parallel analyzes: sentiment, urgency level, and action items. Then combine into a structured summary.

**Challenge 3** (Advanced): Build a "Smart FAQ Router" — create 3 specialized chains for different product categories (Electronics, Clothing, Food). Use a classifier to route customer questions to the right chain.

---

## ✅ Phase 5 Recap

| Chain Type | What It Does | Use Case |
|-----------|-------------|----------|
| Simple Chain | Prompt → LLM → Output | Basic Q&A, transformations |
| Sequential Chain | Step1 → Step2 → Step3 | Blog writing, multi-step analysis |
| Parallel Chain | Step A + Step B simultaneously | When tasks are independent |
| Router Chain | Classify → Route to right chain | Customer support, smart assistants |
| Custom Chain | Your own logic + LLM | Unique workflows |

---

## 🚀 What's Next?

In **Phase 6**, we add **Memory** to our AI apps — making them remember past conversations, user preferences, and context:
- Buffer memory
- Summary memory
- Window memory
- Persistent memory (saves to disk/database)

> **Go to**: `Phase06_Memory/lesson.md` →

---

*Phase 5 Complete! ⛓️ You can now build powerful multi-step AI pipelines!*
