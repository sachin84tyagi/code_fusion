# 📝 Phase 4 — Prompt Engineering in LangChain
### "Talking to AI Like a Pro — The Art of the Perfect Prompt"

> **Difficulty**: ⭐⭐ Beginner-Intermediate | **Time**: ~75 minutes | **Prerequisites**: Phase 3 Complete

---

## 🎯 What You'll Learn

- ✅ What PromptTemplate is and why it's powerful
- ✅ ChatPromptTemplate for role-based conversations
- ✅ Dynamic prompts with variables
- ✅ System prompts that control AI personality
- ✅ Few-shot prompting (teach by example)
- ✅ Good prompts vs bad prompts
- ✅ Real company prompts analyzed

---

## 📖 Lesson 4.1 — What Is Prompt Engineering?

### Simple Explanation

**Prompt Engineering** is the art of writing instructions for AI.

Just like how you'd give different instructions to a new employee vs a senior engineer, you need to tell AI EXACTLY what you want, how to behave, and what format to use.

```
Bad Prompt:          "Write about marketing"
Good Prompt:         "You are a senior marketing strategist.
                      Write a 3-paragraph analysis of social media 
                      marketing for a B2B SaaS company. Focus on 
                      LinkedIn strategy. Use data-driven language.
                      Target audience: CTOs and VPs of Engineering."
```

The difference in output quality is ENORMOUS.

### Real-Life Analogy

Prompt engineering is like ordering food at a restaurant:

```
❌ Bad order: "Give me something good."
✅ Good order: "I'd like the grilled salmon, medium-well, 
                with steamed vegetables (no broccoli), and 
                brown rice on the side. Extra lemon, please."
```

The more specific you are, the better the result.

---

## 📖 Lesson 4.2 — PromptTemplate (The Basics)

### What Is It?

A `PromptTemplate` is a reusable prompt with **placeholders** (variables) that get filled in at runtime.

Think of it like a **mad-lib template**:
```
"Dear [NAME], I would like to [ACTION] your [PRODUCT]."
```

In LangChain, you define the template ONCE and fill it with different values every time.

### Without PromptTemplate (Bad Way)

```python
# ❌ This is the messy, non-scalable way
name = "Ahmed"
topic = "machine learning"
level = "beginner"

prompt = f"Explain {topic} to a {level} student named {name}. Keep it simple."
# You have to manually manage this string every time!
```

### With PromptTemplate (Good Way)

```python
# ============================================================
# FILE: prompts/basic_prompt_template.py
# PURPOSE: Learning PromptTemplate in LangChain
# ============================================================

from langchain_core.prompts import PromptTemplate
from langchain_ollama import ChatOllama

# ---- Step 1: Create the template ----
# {name}, {topic}, {level} are placeholders (variables)
template = PromptTemplate(
    template="Explain {topic} to a {level} student named {name}. Keep it simple and fun.",
    input_variables=["topic", "level", "name"]  # List all variable names
)

# ---- Step 2: Format the template with actual values ----
# This creates the actual prompt string
formatted_prompt = template.format(
    topic="machine learning",
    level="beginner",
    name="Ahmed"
)

print("📝 Formatted Prompt:")
print(formatted_prompt)
# Output: "Explain machine learning to a beginner student named Ahmed. Keep it simple and fun."

# ---- Step 3: Use with a model ----
llm = ChatOllama(model="llama3.2")
response = llm.invoke(formatted_prompt)
print("\n🤖 AI Response:")
print(response.content)
```

### Why This Is Better

```python
# Now you can reuse the SAME template with different values!
students = [
    {"name": "Sara",  "topic": "neural networks",  "level": "beginner"},
    {"name": "John",  "topic": "Python functions", "level": "intermediate"},
    {"name": "Maria", "topic": "transformers",      "level": "advanced"},
]

for student in students:
    # Same template, different values — powerful!
    prompt = template.format(**student)
    response = llm.invoke(prompt)
    print(f"\n📚 For {student['name']}:")
    print(response.content[:200])  # First 200 chars
```

---

## 📖 Lesson 4.3 — ChatPromptTemplate (The Professional Way)

### Why ChatPromptTemplate?

Modern AI works with **roles** in a conversation:
- `system` — Background instructions (the AI's "personality")
- `human` — What the user says
- `ai` — What the AI previously said (for conversation history)

`ChatPromptTemplate` handles all these roles with variables.

```
┌─────────────────────────────────────────────────────┐
│              CHAT PROMPT STRUCTURE                   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  SYSTEM: "You are a {role} expert.           │   │
│  │           Always respond in {language}."     │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │  HUMAN: "{user_question}"                    │   │
│  └──────────────────────────────────────────────┘   │
│                   ↓                                  │
│  Variables: role, language, user_question            │
└─────────────────────────────────────────────────────┘
```

### Basic ChatPromptTemplate

```python
# ============================================================
# FILE: prompts/chat_prompt_template.py
# PURPOSE: The modern way to create prompts in LangChain
# ============================================================

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama

# ---- Create Chat Prompt Template ----
prompt = ChatPromptTemplate.from_messages([
    # ("role", "content with {variables}")
    ("system", "You are an expert {role}. Your communication style is {style}."),
    ("human", "{question}")
])

# ---- Fill in the variables ----
formatted = prompt.format_messages(
    role="Python developer",
    style="clear, concise, and practical",
    question="How do I handle exceptions in Python?"
)

# formatted is now a list of messages ready for the model!
llm = ChatOllama(model="llama3.2")
response = llm.invoke(formatted)
print(response.content)
```

### Using The LCEL Pipe Operator (Modern Pattern)

This is the **modern LangChain way** — called LCEL (LangChain Expression Language):

```python
# ============================================================
# FILE: prompts/lcel_pattern.py
# PURPOSE: The modern LCEL (pipe) pattern in LangChain
# ============================================================

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser

# The pipe operator (|) chains things together
# Think: input → prompt → model → output_parser
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a professional {role}."),
    ("human", "{question}")
])

llm = ChatOllama(model="llama3.2")
parser = StrOutputParser()  # Converts AIMessage to plain string

# ---- Create a chain using the pipe | operator ----
chain = prompt | llm | parser
#        ↑        ↑      ↑
#     Template  Model  Parser

# ---- Run the chain ----
result = chain.invoke({
    "role": "chef",
    "question": "What's the secret to perfect pasta?"
})

print(result)  # Plain string, not AIMessage object
```

> 🔑 **Key Insight**: This `|` pipe pattern is LCEL. It's how modern LangChain chains things together. You'll use this everywhere!

---

## 📖 Lesson 4.4 — System Prompts (The Personality Setter)

### What Is A System Prompt?

The system prompt is like giving an employee their **job description and personality guidelines** before they start working. The user never sees it, but it controls everything.

```
System Prompt:                   Effect:
─────────────────────────────────────────────────────────
"Always respond in bullet points" → Every answer is bullet points
"You are grumpy and sarcastic"    → AI acts grumpy
"Never discuss competitors"       → AI avoids competitor topics
"Always respond in French"        → Every answer is in French
"You are a doctor. Give medical   → AI gives medical context
 information with disclaimers"
```

### Real Company System Prompts

```python
# ============================================================
# FILE: prompts/system_prompts.py
# PURPOSE: Powerful system prompts for real applications
# ============================================================

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser

llm = ChatOllama(model="llama3.2")
parser = StrOutputParser()

# ---- 1. Customer Support Bot (E-commerce) ----
ecommerce_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are Alex, a friendly customer support agent for ShopFast.
    
RULES:
- Always greet the customer warmly
- Be empathetic and understanding
- Never make promises you can't keep
- For refunds: Always apologize and say "I'll escalate this to our team"
- For shipping: Check order status (user will provide order ID)
- Never discuss competitors
- Always end with "Is there anything else I can help you with?"
    
Company policies:
- 30-day return window
- Free shipping on orders over $50
- Delivery: 3-5 business days standard, 1-2 days express"""),
    ("human", "{customer_message}")
])

support_chain = ecommerce_prompt | llm | parser

print("=== Customer Support Bot ===")
print(support_chain.invoke({
    "customer_message": "My order #45678 hasn't arrived and it's been 10 days!"
}))

# ---- 2. AI Coding Teacher ----
coding_teacher_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are CodeMentor, a patient Python coding teacher for beginners.
    
TEACHING STYLE:
- Explain like the student is 12 years old
- Always use real-life analogies
- Break down code line by line
- Include common mistakes and how to avoid them
- End with a mini practice challenge

When showing code:
- Use comments to explain each line
- Show both wrong and right ways
- Keep examples under 20 lines"""),
    ("human", "{coding_question}")
])

coding_chain = coding_teacher_prompt | llm | parser

print("\n=== Coding Teacher Bot ===")
print(coding_chain.invoke({
    "coding_question": "How do Python loops work?"
}))
```

---

## 📖 Lesson 4.5 — Dynamic Prompts & Few-Shot Prompting

### What Is Few-Shot Prompting?

Instead of just telling the AI what to do, you **show it examples**. Like teaching by example.

```
Zero-Shot (no examples):
"Classify this as positive or negative: 'This product is amazing!'"

Few-Shot (with examples):
"Classify sentiment. Here are examples:
 'Great quality!' → POSITIVE
 'Terrible experience' → NEGATIVE  
 'It's okay' → NEUTRAL
 
 Now classify: 'This product is amazing!'"
```

Few-shot almost always gives better, more consistent results!

### Few-Shot Prompt Example

```python
# ============================================================
# FILE: prompts/few_shot_prompting.py
# PURPOSE: Teach AI by showing examples
# ============================================================

from langchain_core.prompts import (
    ChatPromptTemplate,
    FewShotChatMessagePromptTemplate
)
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser

llm = ChatOllama(model="llama3.2", temperature=0)
parser = StrOutputParser()

# ---- Step 1: Define your examples ----
examples = [
    {
        "input": "The battery life is incredible, lasts 3 days!",
        "output": "POSITIVE | Battery life praised"
    },
    {
        "input": "Worst customer service I've ever experienced",
        "output": "NEGATIVE | Poor customer service"
    },
    {
        "input": "Product works as described, nothing special",
        "output": "NEUTRAL | Meets expectations"
    },
    {
        "input": "Absolutely love this! Changed my life!",
        "output": "POSITIVE | Strong positive emotion"
    },
]

# ---- Step 2: Create example template ----
# This defines the format for EACH example
example_prompt = ChatPromptTemplate.from_messages([
    ("human", "{input}"),
    ("ai", "{output}"),
])

# ---- Step 3: Create few-shot template ----
few_shot_prompt = FewShotChatMessagePromptTemplate(
    example_prompt=example_prompt,
    examples=examples,
)

# ---- Step 4: Create full prompt ----
final_prompt = ChatPromptTemplate.from_messages([
    ("system", "You analyze product reviews. Respond with: SENTIMENT | Key insight"),
    few_shot_prompt,  # Include all examples
    ("human", "{input}"),  # Then the actual question
])

chain = final_prompt | llm | parser

# ---- Test It ----
test_reviews = [
    "The quality is decent but the price is too high",
    "AMAZING product! Can't imagine life without it!",
    "Arrived broken, completely unusable",
]

print("📊 Sentiment Analysis Results:")
for review in test_reviews:
    result = chain.invoke({"input": review})
    print(f"\n  Review: '{review}'")
    print(f"  Result: {result}")
```

---

## 📖 Lesson 4.6 — Good Prompts vs Bad Prompts

This is the most practical lesson in this phase. Study these examples carefully.

### Comparison Examples

```
╔══════════════════════════════════════════════════════════════╗
║                  PROMPT QUALITY COMPARISON                   ║
╠══════════════════════╦═══════════════════════════════════════╣
║  ❌ BAD PROMPT        ║  ✅ GOOD PROMPT                        ║
╠══════════════════════╬═══════════════════════════════════════╣
║                      ║                                       ║
║  "Write a blog"      ║  "Write a 500-word blog post about   ║
║                      ║   'Top 5 Python Tips for Beginners.' ║
║                      ║   Tone: Friendly, conversational.    ║
║                      ║   Include code examples.             ║
║                      ║   End with a call-to-action."        ║
║                      ║                                       ║
╠══════════════════════╬═══════════════════════════════════════╣
║                      ║                                       ║
║  "Summarize this"    ║  "Summarize the following article    ║
║                      ║   in exactly 3 bullet points.        ║
║                      ║   Each bullet should be one          ║
║                      ║   sentence. Focus on main action     ║
║                      ║   items and business impact."        ║
║                      ║                                       ║
╠══════════════════════╬═══════════════════════════════════════╣
║                      ║                                       ║
║  "Translate this"    ║  "Translate the following text from  ║
║                      ║   English to Spanish. Maintain the   ║
║                      ║   formal business tone. Do not       ║
║                      ║   translate proper nouns or brand    ║
║                      ║   names. Text: {text}"               ║
║                      ║                                       ║
╚══════════════════════╩═══════════════════════════════════════╝
```

### The CLEAR Framework For Prompts

Use this mental checklist for every prompt you write:

```
C — Context    : Who is the AI? What's the situation?
L — Length     : How long should the response be?
E — Examples   : Show examples if possible (few-shot)
A — Audience   : Who is this for? (beginner, expert, etc.)
R — Role       : What role/persona should the AI take?
```

---

## 📖 Lesson 4.7 — Prompt Chaining

Sometimes one prompt isn't enough. You need to chain prompts where **the output of one becomes the input of the next**.

```python
# ============================================================
# FILE: prompts/prompt_chaining.py
# PURPOSE: Chain multiple prompts together
# ============================================================

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser

llm = ChatOllama(model="llama3.2")
parser = StrOutputParser()

# ---- Chain 1: Generate business idea ----
idea_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a creative entrepreneur and startup advisor."),
    ("human", "Generate ONE unique AI startup idea for the {industry} industry. "
              "Give just the idea name and a 2-sentence description.")
])

# ---- Chain 2: Analyze the idea ----
analysis_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a venture capital analyst with 20 years experience."),
    ("human", "Analyze this startup idea and give a SWOT analysis:\n\n{idea}\n\n"
              "Format: Strengths, Weaknesses, Opportunities, Threats. "
              "Be concise, 2 points each.")
])

# ---- Build the full chain ----
# Chain 1 output feeds into Chain 2 as "idea"
idea_chain = idea_prompt | llm | parser
analysis_chain = analysis_prompt | llm | parser

# Method 1: Manual chaining
idea = idea_chain.invoke({"industry": "healthcare"})
print("💡 Startup Idea:")
print(idea)

analysis = analysis_chain.invoke({"idea": idea})
print("\n📊 SWOT Analysis:")
print(analysis)

# ---- Method 2: LCEL Chain Composition ----
# This is cleaner and more powerful
from langchain_core.runnables import RunnablePassthrough

full_chain = (
    idea_prompt 
    | llm 
    | parser 
    | {"idea": RunnablePassthrough()}  # Pass output as "idea" to next prompt
    | analysis_prompt 
    | llm 
    | parser
)

print("\n=== Full Pipeline Result ===")
result = full_chain.invoke({"industry": "education"})
print(result)
```

---

## 📖 Lesson 4.8 — Real Industry Prompt Patterns

### Pattern 1: Email Writer

```python
# ============================================================
# FILE: prompts/email_writer.py
# PURPOSE: Professional email writer prompt
# ============================================================

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser

llm = ChatOllama(model="llama3.2")
parser = StrOutputParser()

email_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a professional business email writer.

RULES:
- Write in {tone} tone
- Keep emails concise and purposeful
- Use professional formatting (Subject, Body, Sign-off)
- Adjust formality based on recipient type"""),
    
    ("human", """Write an email with these details:
From: {sender_name} ({sender_role})
To: {recipient_type}
Purpose: {email_purpose}
Key points to cover: {key_points}""")
])

email_chain = email_prompt | llm | parser

result = email_chain.invoke({
    "tone": "professional but friendly",
    "sender_name": "Ahmed Hassan",
    "sender_role": "Senior Developer",
    "recipient_type": "potential client (CEO of a startup)",
    "email_purpose": "Follow up after a demo meeting",
    "key_points": "Thank them for their time, summarize key points from demo, propose next steps"
})

print(result)
```

---

## ⚠️ Common Mistakes in Prompt Engineering

### Mistake 1: Vague Instructions

```python
# ❌ BAD - Vague
template = PromptTemplate(
    template="Improve this text: {text}",
    input_variables=["text"]
)

# ✅ GOOD - Specific
template = PromptTemplate(
    template="""Improve this text by:
1. Fixing grammar and spelling errors
2. Making it more concise (reduce by 20%)
3. Using active voice instead of passive
4. Maintaining the original tone and meaning

Text to improve: {text}

Improved version:""",
    input_variables=["text"]
)
```

### Mistake 2: No Output Format Specified

```python
# ❌ BAD - AI decides format randomly
"Analyze the pros and cons of {product}"

# ✅ GOOD - Explicitly specify format
"""Analyze {product}. Return EXACTLY in this format:
PROS:
- [pro 1]
- [pro 2]  
- [pro 3]

CONS:
- [con 1]
- [con 2]
- [con 3]

VERDICT: [One sentence recommendation]"""
```

### Mistake 3: Forgetting to Escape Curly Braces

```python
# ❌ PROBLEM: LangChain thinks {name} is a variable!
template = PromptTemplate(
    template="Return JSON: {name: 'result', value: {value}}",
    input_variables=["value"]
)

# ✅ FIX: Use double braces {{ }} to escape literal braces
template = PromptTemplate(
    template="Return JSON: {{\"name\": \"result\", \"value\": {value}}}",
    input_variables=["value"]
)
```

---

## 🧠 Quick Quiz

1. What's the difference between `PromptTemplate` and `ChatPromptTemplate`?
2. What are the 3 roles in a chat prompt?
3. What is few-shot prompting? Give one use case.
4. What does the `|` pipe operator do in LCEL?
5. What is the CLEAR framework?
6. How do you escape literal `{` in a PromptTemplate?

---

## 🎯 Mini Challenges

**Challenge 1**: Create a `ChatPromptTemplate` for an AI tutor that teaches any subject. Variables: `{subject}`, `{difficulty_level}`, `{student_question}`. Test it with 3 different subjects.

**Challenge 2**: Build a "Product Description Generator" using few-shot prompting. Show 3 examples of product descriptions, then generate one for a new product.

**Challenge 3**: Create a 3-step prompt chain:
1. **Step 1**: Generate a LinkedIn post topic given an industry
2. **Step 2**: Write the full LinkedIn post 
3. **Step 3**: Generate 5 relevant hashtags for the post

---

## ✅ Phase 4 Recap

| Concept | What It Does | When To Use |
|---------|-------------|-------------|
| PromptTemplate | Reusable prompts with variables | Single-turn Q&A |
| ChatPromptTemplate | Role-based prompt templates | Chatbots, agents |
| System Prompt | AI personality and rules | Every AI application |
| Few-Shot | Teach by example | Consistency needed |
| LCEL (`\|`) | Chain components together | Modern LangChain apps |
| Prompt Chaining | Multi-step AI pipelines | Complex workflows |

---

## 🚀 What's Next?

In **Phase 5**, we build **Chains** — automated pipelines that connect prompts, models, and outputs into powerful workflows:
- Simple chains
- Sequential chains
- Parallel chains
- Custom chains
- Real projects: Email writer, Resume analyzer

> **Go to**: `Phase05_Chains/lesson.md` →

---

*Phase 4 Complete! 📝 You now write prompts like a pro. Time to chain them together!*
