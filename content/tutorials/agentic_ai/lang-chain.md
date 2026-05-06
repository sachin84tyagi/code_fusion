# 🚀 LangChain Master Course — Beginner → Advanced

## Build Real AI Agents, RAG Apps & Production AI Systems

Welcome to your complete LangChain journey.

You are NOT going to learn like a boring tutorial.

You are going to learn like a real AI Engineer building real AI products used in companies.

We will learn:

* 🧠 AI Agents
* 🤖 AI Chatbots
* 🔍 RAG Systems
* 🛠️ AI Tools
* ⚡ LangGraph
* 🧩 Multi-Agent Systems
* 🏭 Production AI Applications

And we’ll do it:

* Step-by-step
* Beginner-friendly
* Fun + practical
* With real-world projects

---

# 🗺️ BIG PICTURE FIRST

Before coding…

You must understand:

> “Why was LangChain even created?”

Because if you understand the problem…
you will understand the solution naturally.

---

# 📚 PHASE 1 — LangChain Fundamentals

# Lesson 1 — What is LangChain?

---

# 1. Simple Concept Explanation

Imagine this:

You have a super intelligent brain (LLM like GPT).

But…

That brain:

* cannot access files
* cannot search the internet
* cannot remember conversations well
* cannot use tools
* cannot call APIs
* cannot automate workflows
* cannot take actions by itself

It can only:

> read text → generate text

That’s it.

---

# 🧠 LLM Alone = Smart Brain Without Hands

Example:

You ask:

> “Read my PDF and summarize it.”

Normal LLM says:

❌ “Please upload the content.”

Because it cannot open files itself.

---

Now imagine we give AI:

* memory
* tools
* workflows
* decision-making
* file access
* internet access
* database access

NOW the AI becomes powerful.

This is where LangChain comes in.

---

# 🔥 LangChain = AI Operating System

LangChain helps connect:

* LLMs
* tools
* memory
* databases
* APIs
* workflows
* agents

into one complete AI application.

---

# 🧩 Simple Definition

## LangChain is a framework for building AI applications powered by LLMs.

It helps developers create:

* AI chatbots
* AI agents
* RAG systems
* AI assistants
* AI automation systems
* multi-step AI workflows

---

# 🏗️ Real Internal Idea

Without LangChain:

```text
User → LLM → Response
```

Very simple.
Very limited.

---

With LangChain:

```text
User
 ↓
Prompt
 ↓
LLM
 ↓
Tools
 ↓
Memory
 ↓
Database
 ↓
Reasoning
 ↓
Final Response
```

NOW the AI behaves more like an intelligent assistant.

---

# 2. Real-Life Analogy

Imagine:

## LLM = Smart Human Brain

But brain alone is not enough.

A software engineer also needs:

* laptop
* internet
* calculator
* Google
* memory
* documents
* APIs

LangChain gives those “extra powers” to AI.

---

# 🦸 Superhero Analogy

| Thing     | Real World     | AI World         |
| --------- | -------------- | ---------------- |
| Brain     | Human brain    | LLM              |
| Tools     | Laptop/apps    | LangChain Tools  |
| Memory    | Human memory   | LangChain Memory |
| Planning  | Thinking steps | Chains/Agents    |
| Internet  | Browser        | Search Tool      |
| Assistant | Employee       | AI Agent         |

---

# 3. Why This Matters

Without LangChain:

* AI is limited
* no memory
* no tools
* no workflows
* hard to build apps

With LangChain:

* build AI products faster
* connect multiple systems
* create autonomous agents
* build RAG applications
* create production AI systems

---

# 🌍 Real Industry Usage

Companies use LangChain for:

* AI customer support
* AI coding assistants
* document chatbots
* research assistants
* automation agents
* enterprise AI search
* workflow automation

---

# 4. Simple Code Example

Let’s create your FIRST LangChain program.

---

# 📦 Step 1 — Install LangChain

```bash
pip install langchain
```

---

# 📦 Step 2 — Install OpenAI

```bash
pip install openai langchain-openai
```

---

# 📄 Step 3 — Basic LangChain Example

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4o-mini",
    api_key="YOUR_API_KEY"
)

response = llm.invoke("Explain AI in simple words")

print(response.content)
```

---

# 5. Line-by-Line Explanation

---

## Line 1

```python
from langchain_openai import ChatOpenAI
```

We import a chat model class.

Think of this like:

> importing the AI brain.

---

## Line 2–5

```python
llm = ChatOpenAI(
    model="gpt-4o-mini",
    api_key="YOUR_API_KEY"
)
```

We create the AI model object.

### Important:

| Part    | Meaning                    |
| ------- | -------------------------- |
| model   | Which AI brain to use      |
| api_key | Secret password for OpenAI |

---

## Line 7

```python
response = llm.invoke("Explain AI in simple words")
```

We send a message to AI.

`invoke()` means:

> “Run this AI request.”

---

## Line 9

```python
print(response.content)
```

Display AI answer.

---

# 🧠 Flow Visualization

```text
Your Question
      ↓
LangChain
      ↓
OpenAI Model
      ↓
AI Generates Response
      ↓
Result Returned
```

---

# 6. Real Industry Example

## AI Customer Support Bot

Company flow:

```text
Customer Question
       ↓
LangChain
       ↓
AI Model
       ↓
Company Database
       ↓
Memory
       ↓
Final Response
```

Example:

Customer asks:

> “Where is my order?”

AI:

* checks order database
* remembers customer history
* responds intelligently

This is exactly how modern AI support systems work.

---

# 7. Common Beginner Mistakes

---

## ❌ Mistake 1 — Thinking LangChain is the AI model

LangChain is NOT GPT.

LangChain is the framework around the model.

---

## ❌ Mistake 2 — Confusing OpenAI with LangChain

| Thing     | Purpose                  |
| --------- | ------------------------ |
| OpenAI    | AI model provider        |
| LangChain | AI application framework |

---

## ❌ Mistake 3 — Installing wrong packages

Modern LangChain uses separate packages:

✅ Correct:

```bash
pip install langchain-openai
```

❌ Old style:

```bash
pip install openai
```

(You still may need openai SDK, but LangChain integrations are separate now.)

---

## ❌ Mistake 4 — Forgetting API key

Without API key:

```text
Authentication Error
```

---

# 🛠️ Debugging Tips

---

## If import fails:

```bash
pip install -U langchain langchain-openai
```

---

## Check Python environment:

```bash
which python
```

or Windows:

```bash
where python
```

---

## Check installed packages:

```bash
pip list
```

---

# 8. Mini Challenge 🧩

Try this yourself:

## Challenge 1

Ask AI:

```python
"Explain machine learning like I am 10 years old"
```

---

## Challenge 2

Change model:

```python
model="gpt-4o"
```

See response difference.

---

## Challenge 3

Ask:

```python
"Write a funny poem about robots"
```

---

# 9. Best Practices

---

# ✅ Use Virtual Environment

```bash
python -m venv venv
```

---

# ✅ Keep API keys secure

Never hardcode:

❌ Bad:

```python
api_key="sk-xxxxx"
```

✅ Better:

```python
import os
api_key=os.getenv("OPENAI_API_KEY")
```

---

# ✅ Start Small

Do NOT build AI agents immediately.

First learn:

1. Models
2. Prompts
3. Chains
4. Memory
5. Tools
6. Agents

---

# 10. Small Recap

---

# 🎯 What You Learned

## LangChain helps build AI applications.

It connects:

* LLMs
* tools
* memory
* workflows
* databases
* agents

---

# 🧠 Core Idea

```text
LLM = Brain
LangChain = Entire AI System
```

---

# 🏗️ You Also Learned

✅ What LangChain is
✅ Why LangChain exists
✅ Problems it solves
✅ First LangChain code
✅ How LangChain works internally
✅ Common beginner mistakes

---

# 🧪 Tiny Quiz

## Q1:

Is LangChain itself an LLM?

---

## Q2:

What does `invoke()` do?

---

## Q3:

Why do AI agents need tools?

---

# 🚀 NEXT LESSON

In the next lesson we will learn:

# 🔥 LangChain Ecosystem & Architecture

You will understand:

* Chains
* Prompts
* Memory
* Tools
* Agents
* RAG
* LangGraph

with visual diagrams and real-world examples.

That lesson is where everything starts connecting together like LEGO blocks.

---

# 🦜🔗 LangChain Mastery: From Zero to AI Engineer

> **Your complete beginner-to-advanced guide to building real AI products with LangChain**

---

## 👋 Welcome, Future AI Engineer!

Before we write a single line of code, let me tell you something exciting:

> You are about to learn the skill that companies like Google, Microsoft, Startups, and AI labs use to build real AI products.

LangChain is not just a library. It's your **superpower toolkit** for building AI systems that actually *do things* — not just chat.

Ready? Let's go! 🚀

---

# 🗺️ Course Roadmap

```
WEEK 1-2:   Phase 1-2   → Foundations & Environment Setup
WEEK 3-4:   Phase 3-4   → Models & Prompt Engineering
WEEK 5-6:   Phase 5-6   → Chains & Memory
WEEK 7-8:   Phase 7-8   → Tools & AI Agents ⭐
WEEK 9-10:  Phase 9-10  → RAG & LangGraph
WEEK 11-12: Phase 11-13 → Real Projects & Production
```

---

# 🧱 PHASE 1 — LangChain Fundamentals

---

## 📖 Lesson 1: What is LangChain?

### 1. Simple Concept Explanation

Imagine you want to build an AI assistant that can:

- Read your company's PDF documents
- Search the internet
- Remember your previous conversations
- Take actions on your behalf

If you tried to do this with just ChatGPT's API alone, you'd spend **months** writing custom code to connect all these pieces.

**LangChain is the bridge that connects all of this together — fast.**

> 💡 **One-line definition:** LangChain is an open-source framework that helps developers build powerful AI applications by connecting LLMs (like GPT-4 or Llama) with tools, memory, data, and logic.

---

### 2. Real-Life Analogy 🎯

Think of **an LLM (like GPT-4)** as a **super-smart brain** locked in a room.

- It's brilliant
- It knows almost everything up to its training date
- But it **can't leave the room**
- It can't browse the internet, read your files, remember you, or take actions

**LangChain is the hands, eyes, and memory** given to that brain.

```
Without LangChain:          With LangChain:
┌─────────────┐             ┌─────────────────────────────┐
│   GPT-4     │             │         LangChain           │
│  (Brain 🧠) │             │  ┌──────┐  ┌────────────┐  │
│             │             │  │Memory│  │    Tools   │  │
│  Knows a    │             │  │  🗂️  │  │ 🔍🧮📄🌐  │  │
│  lot, but   │             │  └──────┘  └────────────┘  │
│  can't DO   │             │         ↕                   │
│  anything   │             │     GPT-4 / Llama 🧠        │
└─────────────┘             │         ↕                   │
                            │  ┌──────────────────────┐   │
                            │  │  Your App / Product  │   │
                            └─────────────────────────────┘
```

---

### 3. Why This Matters 💼

Companies are building:

- **AI customer support bots** that remember your purchase history
- **AI research agents** that browse the web and write reports
- **AI coding assistants** that read your codebase and fix bugs
- **AI document analyzers** that process 1000 PDFs in minutes

**All of these are built with LangChain.**

---

### 4. Problems LangChain Solves

| Problem | Without LangChain | With LangChain |
|---|---|---|
| Connecting LLM to tools | Custom code, weeks of work | Built-in tool system |
| Giving AI memory | Complex database logic | 2 lines of code |
| Chaining AI steps | Messy manual pipelines | Clean `chain` objects |
| Building AI agents | Research + custom dev | Ready-made agent framework |
| Working with documents | Parse, chunk, embed yourself | Built-in RAG pipeline |

---

### 5. LangChain Ecosystem Overview

LangChain is not just one thing. It's a family:

```
🦜 LangChain Ecosystem
│
├── 🔗 langchain-core       ← Core building blocks (base classes)
├── 🧩 langchain            ← Main library (chains, agents, etc.)
├── 🤖 langchain-community  ← 300+ integrations (tools, databases)
├── 🌐 langchain-openai     ← OpenAI-specific integration
├── 🦙 langchain-ollama     ← Ollama local model integration
├── 📊 LangSmith            ← Monitoring & debugging platform
└── 🕸️  LangGraph           ← Advanced agent workflow framework
```

---

### 6. How LangChain Works Internally

```
You (Developer)
     │
     ▼
[Write a Prompt] ──→ [LangChain formats it] ──→ [Sends to LLM]
                                                        │
                                                        ▼
[Your App gets response] ←── [LangChain parses it] ←── [LLM responds]
     │
     ▼
[Chain to next step? Add memory? Call a tool?]
     │
     ▼
[Final output to user]
```

---

### 7. LLMs vs LangChain

| | LLM (e.g., GPT-4) | LangChain |
|---|---|---|
| What it is | AI brain / model | Framework / toolkit |
| What it does | Generates text | Connects & orchestrates |
| Memory | None (stateless) | Yes (via memory modules) |
| Tools | None | Yes (search, files, APIs) |
| Agents | No | Yes (full agent system) |
| Analogy | Smart brain in a box | The whole robot body |

---

### 8. Core LangChain Concepts (Quick Preview)

```
┌────────────────────────────────────────────────┐
│              LangChain App                     │
│                                                │
│  📝 Prompts  → What you ask the AI            │
│  🧠 Models   → The AI brain (GPT, Llama, etc) │
│  ⛓️  Chains   → Steps connected together       │
│  💾 Memory   → Remembering conversations       │
│  🔧 Tools    → AI's superpowers (search, etc) │
│  🤖 Agents   → AI that thinks and acts alone  │
│  📚 RAG      → AI + your own documents        │
└────────────────────────────────────────────────┘
```

---

### ✅ Mini Recap — Lesson 1

- LangChain = framework that gives LLMs hands, eyes & memory
- It solves the problem of connecting AI to the real world
- It has an ecosystem: core, community, LangSmith, LangGraph
- Core concepts: Prompts, Models, Chains, Memory, Tools, Agents, RAG

---

### 🎯 Mini Challenge #1

Answer these in your head (or write them down):

1. What's the difference between GPT-4 and LangChain?
2. Name 3 real-world AI products you could build with LangChain
3. Why can't you just use the OpenAI API directly for complex AI apps?

---

---

# ⚙️ PHASE 2 — Setting Up Your Environment

---

## 📖 Lesson 2: Setting Up Like a Pro

### 1. Best Project Structure

```
my_langchain_project/
│
├── 📁 src/                  ← All your source code
│   ├── agents/              ← Agent code
│   ├── chains/              ← Chain code
│   ├── tools/               ← Custom tools
│   └── rag/                 ← RAG pipeline code
│
├── 📁 data/                 ← PDFs, text files, data
├── 📁 notebooks/            ← Jupyter notebooks for testing
├── 📄 .env                  ← API keys (NEVER commit this!)
├── 📄 .gitignore            ← Ignore .env, venv, etc.
├── 📄 requirements.txt      ← All dependencies
└── 📄 main.py               ← Entry point
```

---

### 2. Step-by-Step Setup

#### Step 1: Check Python Version

```bash
python --version
# You need Python 3.9 or higher
```

#### Step 2: Create a Virtual Environment

```bash
# Create a clean isolated Python environment
python -m venv langchain-env

# Activate it (Mac/Linux)
source langchain-env/bin/activate

# Activate it (Windows)
langchain-env\Scripts\activate

# You'll see (langchain-env) in your terminal — you're inside!
```

> 💡 **Why virtual environment?** Think of each project as a separate apartment. A virtual env ensures the libraries in Project A don't conflict with Project B. Always use one!

#### Step 3: Install LangChain and Dependencies

```bash
pip install langchain
pip install langchain-core
pip install langchain-community
pip install langchain-openai
pip install langchain-ollama
pip install python-dotenv
pip install chromadb
pip install pypdf
```

#### Step 4: Create Your .env File

```bash
# Create a file called .env in your project folder
OPENAI_API_KEY=your_openai_api_key_here
```

> ⚠️ **NEVER share your .env file or push it to GitHub!** Always add `.env` to `.gitignore`.

#### Step 5: Install Ollama (Free Local AI Models)

```bash
# Go to https://ollama.com and download for your OS
ollama pull llama3.2        # Download Llama 3.2 (free!)
ollama pull mistral         # Another great free model
ollama run llama3.2         # Test it — chat right in terminal!
```

> 💡 **Why Ollama?** Run powerful AI models on your own computer — completely free, no API costs, no internet required!

#### Step 6: VS Code Extensions to Install

- **Python** (by Microsoft)
- **Pylance** (better autocomplete)
- **Python Indent** (auto-formatting)
- **dotenv** (highlights .env files)

---

### 3. Load API Keys Safely

```python
# config.py

from dotenv import load_dotenv
import os

load_dotenv()                                # Reads your .env file

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") # Get the key safely
```

---

### ✅ Mini Recap — Lesson 2

- Always use a virtual environment per project
- Use `.env` for API keys — never hardcode them
- Ollama = free local models (great for learning)
- OpenAI = paid but very powerful (GPT-4o, etc.)

---

---

# 🧠 PHASE 3 — Working With Models

---

## 📖 Lesson 3: Talking to AI Models with LangChain

### 1. Real-Life Analogy 🎯

Think of LangChain as a **universal TV remote**.

Whether your TV is Sony, Samsung, or LG — the remote works the same way. LangChain is that remote. Whether the AI model is from OpenAI, Google, or running locally on Ollama — your code stays the same.

---

### 2. Using OpenAI Models

```python
# File: 01_openai_basic.py

from dotenv import load_dotenv                    # imports the dotenv library
from langchain_openai import ChatOpenAI           # imports ChatOpenAI from langchain

load_dotenv()                                     # loads your .env file (reads API key)

llm = ChatOpenAI(                                 # creates the AI model object
    model="gpt-4o-mini",                          # which model to use (cheaper, fast)
    temperature=0.7,                              # how creative the AI should be (0-1)
)

response = llm.invoke("What is LangChain?")       # send a prompt to the model

print(response.content)                           # print just the text of the response
```

**Line-by-line breakdown:**

| Line | What it does |
|---|---|
| `load_dotenv()` | Reads your `.env` file and makes `OPENAI_API_KEY` available |
| `ChatOpenAI(...)` | Creates the model object — your connection to GPT |
| `model="gpt-4o-mini"` | Uses the faster, cheaper GPT-4o mini version |
| `temperature=0.7` | Controls creativity |
| `llm.invoke(...)` | Sends your message to the AI and waits for reply |
| `response.content` | The actual text the AI replied with |

---

### 3. Temperature Explained Simply 🌡️

```
Temperature controls how "creative" or "random" the AI is:

0.0  ──────────────────────────────────── 1.0
 │                                          │
 │  Deterministic                Creative   │
 │  Consistent                   Random     │
 │  Factual                      Fun        │
 │                                          │
 ▼                                          ▼
"The capital of France is Paris."    "Paris! A city of dreams,
                                      baguettes, and berets!"

USE LOW  (0.0 - 0.3) for: Code generation, factual Q&A, data extraction
USE HIGH (0.6 - 1.0) for: Creative writing, brainstorming, storytelling
```

---

### 4. Using Ollama (Free Local Models)

```python
# File: 02_ollama_basic.py

from langchain_ollama import ChatOllama

# Make sure 'ollama run llama3.2' is running in another terminal!
llm = ChatOllama(
    model="llama3.2",                 # use llama3.2 (you pulled this earlier)
    temperature=0.5,
)

response = llm.invoke("Explain AI agents simply")

print(response.content)
```

> 💡 **No API key needed for Ollama!** It runs 100% on your machine.

---

### 5. Tokens Explained Visually 🪙

```
"LangChain is awesome!"

Tokenized as:
┌──────────┬────┬─────────────┬────┐
│ LangChain│ is │   awesome   │ !  │
└──────────┴────┴─────────────┴────┘
  Token 1   T2      Token 3    T4

Each word (roughly) = 1 token
1000 tokens ≈ 750 words

WHY TOKENS MATTER:
- Models charge per token (OpenAI pricing)
- Models have a max token limit (context window)
- GPT-4o:    128,000 tokens max
- Llama 3.2: 128,000 tokens max
```

---

### 6. Streaming Responses

```python
# File: 03_streaming.py

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

# Stream the response word by word — like ChatGPT's typing effect
for chunk in llm.stream("Tell me a short story about a robot"):
    print(chunk.content, end="", flush=True)
```

---

### 7. Structured Output (Getting JSON from AI)

```python
# File: 04_structured_output.py

from langchain_openai import ChatOpenAI
from pydantic import BaseModel

class PersonInfo(BaseModel):
    name: str
    age: int
    job: str

llm = ChatOpenAI(model="gpt-4o-mini")
structured_llm = llm.with_structured_output(PersonInfo)

result = structured_llm.invoke(
    "Extract info: John is a 30-year-old software engineer."
)

print(result.name)   # John
print(result.age)    # 30
print(result.job)    # software engineer
```

---

### 8. Common Mistakes Beginners Make 🐛

| Mistake | Problem | Fix |
|---|---|---|
| Not loading `.env` | `API key not found` error | Always call `load_dotenv()` first |
| Forgetting `response.content` | Prints a big object | Use `.content` to get the text |
| Ollama not running | Connection refused error | Run `ollama serve` in terminal first |
| Temperature > 1 | Error or weird behavior | Keep between 0.0 and 1.0 |

---

### 🎯 Mini Challenge #3

Build a simple **"AI Explainer"** script:

1. Create `explainer.py`
2. Use either OpenAI or Ollama
3. Ask it to explain "blockchain" like you're 10 years old
4. Set temperature to 0.9 for fun, creative output
5. Try both `llm.invoke()` and `llm.stream()` and see the difference!

---

---

# 📝 PHASE 4 — Prompt Engineering in LangChain

---

## 📖 Lesson 4: The Art of Talking to AI

### 1. Real-Life Analogy 🎯

Think of a **prompt template** like a **job application form**.

The form structure stays the same (blanks for Name, Skills, Experience), but every applicant fills it with different data.

```
Template: "Write a {tone} email about {topic} for {audience}"
                 ↑            ↑              ↑
            (variable)   (variable)      (variable)

Used as:  "Write a formal email about project delay for the CEO"
Used as:  "Write a funny email about pizza party for the team"
```

---

### 2. PromptTemplate (Simple Text Prompts)

```python
# File: 05_prompt_template.py

from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

template = PromptTemplate(
    template="Explain {concept} to a {audience} in simple terms.",
    input_variables=["concept", "audience"]
)

prompt = template.invoke({
    "concept": "machine learning",
    "audience": "10-year-old child"
})

print(prompt.text)
# Output: "Explain machine learning to a 10-year-old child in simple terms."
```

---

### 3. ChatPromptTemplate (Most Important!)

```python
# File: 06_chat_prompt_template.py

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

# Real chat apps have ROLES:
# - system: sets the AI's personality/instructions
# - human: the user's message
# - ai: the AI's past responses

template = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful {role} assistant."),
    ("human", "Help me with: {user_request}")
])

messages = template.invoke({
    "role": "coding",
    "user_request": "How do I reverse a list in Python?"
})

llm = ChatOpenAI(model="gpt-4o-mini")
response = llm.invoke(messages)
print(response.content)
```

---

### 4. System Prompts — The Secret Weapon 🎭

```python
# File: 07_system_prompts.py

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

# ❌ BAD system prompt (vague, boring)
bad_system = "You are an assistant."

# ✅ GOOD system prompt (specific, clear, role-defining)
good_system = """
You are Alex, a senior customer support specialist at TechCorp.
Your personality: Friendly, empathetic, solution-focused.
Your rules:
- Always greet the customer by name if provided
- Keep responses under 100 words
- If you can't solve the issue, escalate politely
- Never say "I don't know" — instead say "Let me find that for you"
"""

template = ChatPromptTemplate.from_messages([
    ("system", good_system),
    ("human", "Hi, my name is {name}. My app keeps crashing!")
])

llm = ChatOpenAI(model="gpt-4o-mini")

chain = template | llm                           # LCEL syntax — connect with pipe!
response = chain.invoke({"name": "Priya"})
print(response.content)
```

> 💡 Notice the `template | llm` syntax? This is **LCEL (LangChain Expression Language)** — the modern way to chain things together!

---

### 5. Good Prompts vs Bad Prompts

```
❌ BAD PROMPT:
"Tell me about marketing"

Problems:
- Too vague
- No context
- No format specified
- No audience defined

✅ GOOD PROMPT:
"You are an expert marketing consultant.
Write 5 bullet-point strategies for a small Indian e-commerce
startup with ₹50,000 monthly budget targeting 18-25 year olds.
Keep each point under 30 words. Be specific and actionable."

Why better:
✓ Role defined (expert consultant)
✓ Specific task (5 bullet points)
✓ Context given (Indian startup, budget, audience)
✓ Format specified (bullet points, 30 words)
✓ Tone defined (specific, actionable)
```

---

### 🎯 Mini Challenge #4

Build a **"Personal Mentor Bot"** using ChatPromptTemplate:

1. Create a system prompt that makes the AI a strict but encouraging coding mentor
2. Add a human message template with `{student_name}` and `{coding_problem}` variables
3. Test it with your own name and a real problem you've faced
4. Try changing the system prompt personality and see how the output changes

---

---

# ⛓️ PHASE 5 — Chains

---

## 📖 Lesson 5: Connecting Steps Together

### 1. Real-Life Analogy 🏭

Think of an **assembly line at a car factory**:

```
[Steel sheets] → [Cutting] → [Welding] → [Painting] → [Quality Check] → [Car! 🚗]

LangChain Chain:
[User Input] → [Prompt Template] → [LLM Model] → [Output Parser] → [Final Answer]
```

---

### 2. Basic Chain with LCEL

```python
# File: 08_basic_chain.py

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert email writer."),
    ("human", "Write a professional email about: {topic}")
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

parser = StrOutputParser()       # Converts AIMessage object to plain string

# Chain them with | (pipe operator) — this is LCEL!
chain = prompt | llm | parser

result = chain.invoke({
    "topic": "project deadline extension request"
})

print(result)    # Clean string output
```

**How LCEL works:**

```
chain.invoke({"topic": "..."})
         │
         ▼
    [prompt]  → formats the message with variables
         │
         ▼
    [llm]     → sends to AI, gets AIMessage back
         │
         ▼
    [parser]  → extracts .content → plain string
         │
         ▼
    Your result! ✅
```

---

### 3. Sequential Chain — Multi-Step Processing

```python
# File: 09_sequential_chain.py
# Real Use Case: AI Resume Analyzer

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# Chain 1: Summarize the resume
summarize_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an HR expert. Summarize resumes concisely."),
    ("human", "Summarize this resume in 3 bullet points:\n{resume}")
])

# Chain 2: Generate interview questions from the summary
questions_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an interview coach."),
    ("human", "Based on this candidate summary, write 3 interview questions:\n{summary}")
])

summarize_chain = summarize_prompt | llm | parser
questions_chain = questions_prompt | llm | parser

# Connect them! Output of first becomes input of second
full_chain = (
    summarize_chain
    | (lambda summary: {"summary": summary})   # wrap output as dict for next prompt
    | questions_chain
)

resume = """
John Smith - Software Engineer
5 years experience in Python, Django, React
Led team of 8 developers at Infosys
Built payment system handling ₹10 crore monthly
B.Tech Computer Science, IIT Delhi
"""

result = full_chain.invoke({"resume": resume})
print(result)
```

---

### 4. Parallel Chains — Do Multiple Things at Once

```python
# File: 10_parallel_chain.py
# Use Case: Analyze email → get sentiment AND reply simultaneously

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel

llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

sentiment_chain = (
    ChatPromptTemplate.from_template(
        "What is the sentiment of this email? Answer in one word: {email}"
    ) | llm | parser
)

reply_chain = (
    ChatPromptTemplate.from_template(
        "Write a professional reply to this email: {email}"
    ) | llm | parser
)

# Run BOTH at the same time!
parallel_chain = RunnableParallel(
    sentiment=sentiment_chain,
    suggested_reply=reply_chain
)

email = "Hi, I'm frustrated that my order hasn't arrived in 2 weeks. Please resolve this."

result = parallel_chain.invoke({"email": email})

print("Sentiment:", result["sentiment"])
print("\nSuggested Reply:", result["suggested_reply"])
```

> 💡 **Parallel chains are faster!** Instead of doing step1 then step2 sequentially, both run simultaneously. Huge time savings in production!

---

### 5. Real Industry Project — AI Email Support System 📧

```python
# File: 11_email_support_system.py

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
parser = StrOutputParser()

classify_chain = (
    ChatPromptTemplate.from_template(
        "Classify this customer email into ONE category: "
        "[BILLING, TECHNICAL, COMPLAINT, GENERAL]\nEmail: {email}"
    ) | llm | parser
)

respond_chain = (
    ChatPromptTemplate.from_template(
        "You are a professional support agent. Write a helpful, empathetic reply.\n"
        "Email: {email}"
    ) | llm | parser
)

priority_chain = (
    ChatPromptTemplate.from_template(
        "Rate the urgency of this email: HIGH, MEDIUM, or LOW.\nEmail: {email}"
    ) | llm | parser
)

support_system = RunnableParallel(
    original_email=RunnablePassthrough(),
    category=classify_chain,
    response=respond_chain,
    priority=priority_chain
)

customer_email = {
    "email": "My entire team can't access the platform since yesterday. "
             "We have a client demo in 3 hours and need this fixed NOW!"
}

result = support_system.invoke(customer_email)

print(f"📧 ORIGINAL: {result['original_email']['email'][:60]}...")
print(f"🏷️  CATEGORY: {result['category']}")
print(f"🚨 PRIORITY: {result['priority']}")
print(f"💬 RESPONSE:\n{result['response']}")
```

---

### 🎯 Mini Challenge #5

Build an **AI Content Generator**:

1. Take a topic as input (e.g., "AI in healthcare")
2. Chain 1: Generate a catchy blog title
3. Chain 2: Use that title to generate a 3-paragraph blog intro
4. Print the final result

**Bonus:** Add a parallel chain that generates 5 SEO keywords alongside the title!

---

---

# 💾 PHASE 6 — Memory

---

## 📖 Lesson 6: Giving AI a Memory

### 1. Real-Life Analogy 🎯

```
WITHOUT Memory (Goldfish brain 🐟):
You: "My name is Arjun"
AI:  "Nice to meet you!"
You: "What's my name?"
AI:  "I don't know your name." ← 🤦

WITH Memory (Elephant brain 🐘):
You: "My name is Arjun"
AI:  "Nice to meet you, Arjun!"
You: "What's my name?"
AI:  "Your name is Arjun!" ← ✅
```

---

### 2. Simple Conversation Memory

```python
# File: 12_memory_basic.py

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

# Chat history is just a list of messages you manage yourself
chat_history = [
    SystemMessage(content="You are a helpful and friendly assistant named Max.")
]

def chat(user_input: str):
    chat_history.append(HumanMessage(content=user_input))  # add user message
    
    response = llm.invoke(chat_history)                     # send FULL history
    
    chat_history.append(AIMessage(content=response.content)) # add AI response
    
    return response.content

# Simulate a conversation
print(chat("Hi! My name is Priya and I'm learning Python."))
print(chat("What should I learn after basic Python?"))
print(chat("What's my name again?"))   # It will remember! ✅
```

---

### 3. Memory Types Overview

```
MEMORY TYPES in LangChain:

1. 📜 Buffer Memory
   Stores ALL messages. Simple but grows forever.
   Good for: Short conversations

2. 🪟 Window Memory
   Stores only LAST N messages. Controlled size.
   Good for: Ongoing chats with limited context

3. 📝 Summary Memory
   Summarizes old messages to save tokens.
   Good for: Long conversations, cost optimization

4. 💾 Persistent Memory
   Saves to database (SQLite, Redis, etc.)
   Good for: Production apps with returning users
```

---

### 4. Window Memory Implementation

```python
# File: 13_window_memory.py
# Keeps only the last 4 messages (2 pairs of human/AI)

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

llm = ChatOpenAI(model="gpt-4o-mini")

class WindowChatBot:
    def __init__(self, window_size: int = 4):
        self.window_size = window_size
        self.history = [
            SystemMessage(content="You are a helpful assistant.")
        ]

    def chat(self, user_input: str) -> str:
        self.history.append(HumanMessage(content=user_input))

        system_msg = self.history[0]                          # Always keep system prompt
        recent_msgs = self.history[1:][-self.window_size:]    # Only last N messages
        context = [system_msg] + recent_msgs

        response = llm.invoke(context)
        self.history.append(AIMessage(content=response.content))

        return response.content

bot = WindowChatBot(window_size=4)
print(bot.chat("I'm working on a FastAPI project"))
print(bot.chat("I'm getting a 422 error"))
print(bot.chat("The error is on the /users endpoint"))
print(bot.chat("Can you help me debug it?"))
```

---

### 🎯 Mini Challenge #6

Build a **Personal Study Assistant**:

1. Create a chatbot with memory
2. System prompt: "You are a patient Python tutor"
3. Have at least 5 turns of conversation
4. Ask it to remember something from earlier in the chat
5. Try the window memory version — what happens when you exceed the window?

---

---

# 🔧 PHASE 7 — Tools

---

## 📖 Lesson 7: Giving AI Superpowers

### 1. Real-Life Analogy 🎯

```
An LLM without tools = A brilliant consultant locked in a room.
  → Can give advice but can't DO anything.

An LLM with tools = That consultant with:
  📱 Phone (to call people)
  💻 Computer (to search & calculate)
  📁 File access (to read documents)
  🌐 Internet (to browse web)
```

---

### 2. Creating Custom Tools

```python
# File: 14_custom_tools.py

from langchain_core.tools import tool

# @tool decorator turns a regular Python function into an AI tool!
@tool
def calculate_bmi(weight_kg: float, height_m: float) -> str:
    """Calculate BMI given weight in kg and height in meters.
    Returns BMI value and category."""         # ← Docstring is CRITICAL — AI reads this!
    bmi = weight_kg / (height_m ** 2)
    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal weight"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"
    return f"BMI: {bmi:.1f} — Category: {category}"

@tool
def get_current_time() -> str:
    """Get the current date and time."""
    from datetime import datetime
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# Test tools directly
print(calculate_bmi.invoke({"weight_kg": 70, "height_m": 1.75}))
print(get_current_time.invoke({}))
```

> 💡 **The docstring is NOT optional!** The AI reads the docstring to understand WHAT the tool does and WHEN to use it.

---

### 3. Binding Tools to a Model

```python
# File: 15_tool_binding.py

from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

@tool
def search_weather(city: str) -> str:
    """Get current weather for a city. Returns temperature and conditions."""
    weather_data = {
        "delhi":     "32°C, Hot and sunny",
        "mumbai":    "28°C, Humid with clouds",
        "bangalore": "22°C, Pleasant and breezy"
    }
    return weather_data.get(city.lower(), "Weather data not available")

@tool
def convert_currency(amount: float, from_currency: str, to_currency: str) -> str:
    """Convert currency amounts. Supports USD, INR, EUR."""
    rates = {"USD_INR": 83.5, "EUR_INR": 90.2, "INR_USD": 0.012}
    key = f"{from_currency}_{to_currency}"
    if key in rates:
        converted = amount * rates[key]
        return f"{amount} {from_currency} = {converted:.2f} {to_currency}"
    return "Conversion not supported"

llm = ChatOpenAI(model="gpt-4o-mini")
llm_with_tools = llm.bind_tools([search_weather, convert_currency])

response = llm_with_tools.invoke("What's the weather in Delhi?")

print(response.content)       # AI's text response
print(response.tool_calls)    # What tools the AI wants to call
```

---

### 4. Tool Calling Flow — How AI Uses Tools

```
User: "What's the weather in Mumbai and how much is $100 in rupees?"
                │
                ▼
         [AI Thinks]
   "I need 2 tools for this:
    1. search_weather(city='Mumbai')
    2. convert_currency(100, 'USD', 'INR')"
                │
                ▼
    [AI returns tool_call requests]
                │
                ▼
    [LangChain executes the tools]
    → search_weather  → "28°C, Humid"
    → convert_currency → "$100 = ₹8,350"
                │
                ▼
    [Results sent back to AI]
                │
                ▼
    [AI generates final answer]
    "Mumbai is 28°C and humid today.
     $100 is approximately ₹8,350."
```

---

### 🎯 Mini Challenge #7

Build a **"Smart Calculator Assistant"**:

1. Create 3 tools: `add`, `multiply`, `calculate_percentage`
2. Bind them to an LLM
3. Ask: "What is 15% of 8500 plus 340?"
4. The AI should figure out which tools to call and in what order!

---

---

# 🤖 PHASE 8 — AI Agents (The Big One!)

---

## 📖 Lesson 8: Building AI That Thinks and Acts

### 1. Simple Concept Explanation

An **AI Agent** is an AI system that can:

1. **Think** about what it needs to do
2. **Decide** which tools to use
3. **Act** using those tools
4. **Observe** the results
5. **Repeat** until the goal is achieved

---

### 2. Real-Life Analogy 🕵️

```
CHATBOT = A smart receptionist
  → You ask: "What are the office hours?"
  → They answer from memory
  → Done. No action taken.

AI AGENT = A smart employee with initiative
  → You ask: "Book a meeting with the team for next week"
  → They THINK: "I need to check everyone's calendars"
  → They ACT:   Check Calendar API
  → They OBSERVE: "Tuesday 3pm works for everyone"
  → They ACT:   Book the meeting
  → They RESPOND: "Done! Meeting booked for Tuesday 3pm"
```

---

### 3. The ReAct Loop — How Agents Think

```
ReAct = Reason + Act

┌─────────────────────────────────────────────┐
│                Agent Loop                   │
│                                             │
│  User Request                               │
│       │                                     │
│       ▼                                     │
│  [THOUGHT] "What do I need to do?"          │
│       │                                     │
│       ▼                                     │
│  [ACTION] Call a tool                       │
│       │                                     │
│       ▼                                     │
│  [OBSERVATION] See tool result              │
│       │                                     │
│       ▼                                     │
│  [THOUGHT] "Is goal achieved?"              │
│       │                 │                   │
│      YES               NO                   │
│       │                 │                   │
│       ▼                 └──→ [ACTION] again  │
│  [FINAL ANSWER]                             │
└─────────────────────────────────────────────┘
```

---

### 4. Building a Real AI Agent

```python
# File: 16_basic_agent.py

from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent

@tool
def search_web(query: str) -> str:
    """Search the internet for information about a topic."""
    # Real app: integrate Tavily API here
    # from tavily import TavilyClient
    return f"Search results for '{query}': Python was created by Guido van Rossum in 1991."

@tool
def calculate(expression: str) -> str:
    """Evaluate a mathematical expression. Example: '2 + 2' or '100 * 0.15'"""
    try:
        result = eval(expression)
        return f"Result: {result}"
    except Exception as e:
        return f"Error calculating: {e}"

@tool
def save_note(content: str, filename: str) -> str:
    """Save a note or result to a text file."""
    with open(filename, 'w') as f:
        f.write(content)
    return f"Note saved to {filename}"

# Create the agent
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)   # temp=0 for consistent reasoning
tools = [search_web, calculate, save_note]

agent = create_react_agent(llm, tools)

result = agent.invoke({
    "messages": [HumanMessage(content=
        "Search for when Python was created, then calculate how old it is in 2025, "
        "and save the answer to 'python_age.txt'"
    )]
})

print(result["messages"][-1].content)
```

---

### 5. Agent vs Chatbot — Side by Side

```
CHATBOT                          AI AGENT
─────────                        ────────
Fixed responses                  Dynamic reasoning
Single LLM call                  Multiple LLM calls (loop)
No tools                         Uses tools autonomously
Answers questions                Completes tasks
Stateless                        Has goal-tracking state
"Tell me about X"                "Research X, summarize, email me"
```

---

### 6. Real Industry Project — AI Research Agent 🔍

```python
# File: 17_research_agent.py

from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent

@tool
def search_topic(topic: str) -> str:
    """Search for comprehensive information about a topic."""
    # Real app: use Tavily API
    return f"[Mock] Top results about {topic}: Major breakthroughs in 2024."

@tool
def summarize_findings(text: str, max_words: int = 100) -> str:
    """Summarize a piece of text to a specified word count."""
    words = text.split()
    if len(words) > max_words:
        return " ".join(words[:max_words]) + "..."
    return text

@tool
def create_report(title: str, content: str, filename: str) -> str:
    """Create a formatted markdown report and save it to a file."""
    report = f"# {title}\n\n{content}\n\n*Generated by AI Research Agent*"
    with open(filename, 'w') as f:
        f.write(report)
    return f"Report '{title}' saved to {filename}"

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
agent = create_react_agent(llm, [search_topic, summarize_findings, create_report])

task = """
Research 'Large Language Models in Healthcare 2024'.
Summarize the key findings in under 150 words.
Then create a professional report saved as 'healthcare_ai_report.md'
"""

result = agent.invoke({"messages": [HumanMessage(content=task)]})
print(result["messages"][-1].content)
```

---

### 7. Common Agent Mistakes 🐛

| Mistake | Problem | Fix |
|---|---|---|
| temperature > 0 | Agent loops or makes inconsistent decisions | Use temperature=0 for agents |
| No tool descriptions | Agent doesn't know when to use tools | Write detailed docstrings |
| Infinite loops | Agent keeps calling tools forever | Set `recursion_limit` in LangGraph |
| Too many tools | Agent gets confused | Give max 5-7 tools per agent |
| Vague task | Agent misunderstands goal | Be very specific in instructions |

---

### 🎯 Mini Challenge #8

Build your **first autonomous agent**:

1. Create tools: `get_stock_price(symbol)`, `calculate_portfolio_value(prices, quantities)`, `save_portfolio_report(data)`
2. Task: "Calculate the total value of my portfolio: 10 AAPL @ $150, 5 GOOGL @ $140, 20 MSFT @ $380. Save a report."
3. Watch the agent reason through each step!

---

---

# 📚 PHASE 9 — RAG (Retrieval-Augmented Generation)

---

## 📖 Lesson 9: Teaching AI Your Own Knowledge

### 1. Simple Concept Explanation

**RAG = Give the AI access to YOUR documents and data.**

LLMs are trained on public internet data. They don't know about your company's internal policies, private documents, or recent events after their training cutoff.

**RAG solves this by plugging in your own knowledge base.**

---

### 2. Real-Life Analogy 📖

```
WITHOUT RAG:
Student goes to exam knowing only what they memorized.
"What's your company's refund policy?" → "I don't know."

WITH RAG:
Student goes to exam WITH a reference book they can look up.
"What's your company's refund policy?" →
  [Searches company policy PDF] →
  "According to your policy doc: Full refund within 30 days."
```

---

### 3. RAG Architecture Visually

```
BUILDING PHASE (One-time setup):
┌─────────────────────────────────────────────────┐
│  Your Documents (PDFs, Docs, Website)           │
│         │                                       │
│         ▼                                       │
│  [TEXT SPLITTER] → Chunks of text               │
│         │                                       │
│         ▼                                       │
│  [EMBEDDING MODEL] → Convert text to numbers   │
│         │              (vectors)                │
│         ▼                                       │
│  [VECTOR DATABASE] → Store vectors              │
│    (ChromaDB / FAISS)                           │
└─────────────────────────────────────────────────┘

QUERY PHASE (Every user question):
┌─────────────────────────────────────────────────┐
│  User Question                                  │
│         │                                       │
│         ▼                                       │
│  [EMBED QUESTION] → Question as vector          │
│         │                                       │
│         ▼                                       │
│  [SIMILARITY SEARCH] → Find related chunks     │
│         │                                       │
│         ▼                                       │
│  [LLM] → Question + Relevant Chunks → Answer   │
└─────────────────────────────────────────────────┘
```

---

### 4. Understanding Embeddings Simply

```
Embedding = Converting words into numbers (vectors) that capture MEANING

"King"   → [0.2, 0.8, 0.1, 0.9, ...]  (list of 1536 numbers)
"Queen"  → [0.2, 0.7, 0.1, 0.8, ...]  (very similar vectors!)
"Car"    → [0.9, 0.1, 0.8, 0.2, ...]  (very different!)

Similar MEANING = Similar NUMBERS = Close in vector space

This lets us find semantically similar text — not just keyword matching!
"automobile" matches "car" even without shared keywords ✅
```

---

### 5. Building a PDF Chatbot with RAG

```python
# File: 18_rag_pdf_chatbot.py
# pip install pypdf chromadb langchain-chroma

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# ── STEP 1: Load the PDF ──────────────────────────────────────
loader = PyPDFLoader("your_document.pdf")
documents = loader.load()
print(f"Loaded {len(documents)} pages")

# ── STEP 2: Split into chunks ─────────────────────────────────
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,       # Each chunk = max 1000 characters
    chunk_overlap=200,     # 200 char overlap to not lose context at boundaries
)
chunks = splitter.split_documents(documents)
print(f"Split into {len(chunks)} chunks")

# ── STEP 3: Create embeddings and store in ChromaDB ───────────
embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")

vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_model,
    persist_directory="./chroma_db"    # Save to disk (reusable across sessions!)
)
print("Vector database created!")

# ── STEP 4: Create retriever ──────────────────────────────────
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}             # Return top 4 most relevant chunks
)

# ── STEP 5: Build the RAG chain ───────────────────────────────
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

rag_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a helpful assistant that answers questions
    based ONLY on the provided context.
    If the answer isn't in the context, say "I don't have that information."

    Context: {context}"""),
    ("human", "{question}")
])

def format_docs(docs):
    """Join all retrieved chunks into one string"""
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {
        "context": retriever | format_docs,   # Retrieve relevant chunks
        "question": RunnablePassthrough()     # Pass question through unchanged
    }
    | rag_prompt
    | llm
    | StrOutputParser()
)

# ── STEP 6: Chat with your document! ─────────────────────────
while True:
    question = input("\nAsk your PDF: ")
    if question.lower() == "exit":
        break
    answer = rag_chain.invoke(question)
    print(f"\nAnswer: {answer}")
```

---

### 6. Common RAG Mistakes 🐛

| Mistake | Problem | Fix |
|---|---|---|
| Chunk size too large | Irrelevant text retrieved | Try 500–1000 characters |
| No chunk overlap | Cuts sentences mid-thought | Use 10–20% overlap |
| Wrong retrieval k | Too few/many chunks | Start with k=4, tune from there |
| No "I don't know" instruction | AI hallucinates from memory | Always add explicit instruction |
| Re-building DB every run | Slow and expensive | Persist and reload the vector DB |

---

### 🎯 Mini Challenge #9

Build a **"Company FAQ Bot"**:

1. Create a text file `company_faq.txt` with 10 fake FAQ pairs
2. Load it, chunk it, embed it into ChromaDB
3. Build a RAG chain
4. Ask 5 questions — some in the FAQ, some not
5. Verify the bot says "I don't have that info" for unknown questions!

---

---

# 🕸️ PHASE 10 — LangGraph

---

## 📖 Lesson 10: Advanced Agent Workflows

### 1. Simple Concept Explanation

LangGraph is a library for building **complex, stateful, multi-step agent workflows** that go beyond simple linear chains.

```
LangChain Chains = Straight road (fixed, linear)
LangGraph        = Full road network (forks, loops, conditions, parallel lanes)
```

---

### 2. LangGraph Core Concepts

```
NODES = Functions that do work (LLM calls, tool calls, logic)
EDGES = Connections between nodes
STATE = Shared data that flows through the graph

┌─────────────────────────────────────────┐
│              LangGraph                  │
│                                         │
│  [Node A] ──→ [Node B] ──→ [Node C]    │
│      ↑              │                   │
│      └──────────────┘   (conditional    │
│         loop back!        edge)         │
└─────────────────────────────────────────┘
```

---

### 3. Building a Stateful Agent with LangGraph

```python
# File: 19_langgraph_agent.py
# pip install langgraph

from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, ToolMessage
from langchain_core.tools import tool

# ── STEP 1: Define State ──────────────────────────────────────
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]   # auto-appended message list

# ── STEP 2: Define tools ──────────────────────────────────────
@tool
def get_weather(city: str) -> str:
    """Get weather for a city."""
    return f"Weather in {city}: 28°C, Sunny"

tools = [get_weather]

# ── STEP 3: Create model with tools ──────────────────────────
llm = ChatOpenAI(model="gpt-4o-mini").bind_tools(tools)

# ── STEP 4: Define Node Functions ────────────────────────────
def agent_node(state: AgentState):
    """The main AI thinking node"""
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

def tool_node(state: AgentState):
    """Execute any tool calls the agent made"""
    last_message = state["messages"][-1]
    results = []
    for tool_call in last_message.tool_calls:
        tool_func = {t.name: t for t in tools}[tool_call["name"]]
        result = tool_func.invoke(tool_call["args"])
        results.append(ToolMessage(content=result, tool_call_id=tool_call["id"]))
    return {"messages": results}

def should_continue(state: AgentState):
    """Decide: call more tools or give final answer?"""
    last_message = state["messages"][-1]
    if last_message.tool_calls:    # AI wants to use a tool
        return "tools"
    return END                     # No more tools, we're done!

# ── STEP 5: Build the Graph ───────────────────────────────────
graph = StateGraph(AgentState)

graph.add_node("agent", agent_node)
graph.add_node("tools", tool_node)

graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", should_continue)
graph.add_edge("tools", "agent")                      # Loop back!

app = graph.compile()

# ── STEP 6: Run it! ───────────────────────────────────────────
result = app.invoke({
    "messages": [HumanMessage(content="What's the weather in Mumbai?")]
})

print(result["messages"][-1].content)
```

**The flow visually:**

```
START
  │
  ▼
[AGENT NODE] ─── Has tool calls? ──YES──→ [TOOL NODE]
    ↑                                           │
    └───────────────────────────────────────────┘
    │
    ◄── No tool calls?
    │
  [END]
```

---

### 🎯 Mini Challenge #10

Build a **Multi-Step Research Workflow** in LangGraph:

1. Node 1: Takes a topic, searches for info
2. Node 2: Summarizes findings
3. Node 3: Generates follow-up questions
4. Conditional edge: If questions exist → loop back to Node 1
5. End after 2 research cycles

---

---

# 🏭 PHASE 11 — Real Industry Project

---

## 📖 Project: Complete AI Customer Support System

### Architecture

```
Customer Message
       │
       ▼
[Classify Intent] ── Billing / Technical / Complaint / General
       │
       ▼
[Route to Specialist Agent]
       │
  ┌────┴────┬─────────────┬──────────────┐
  ▼         ▼             ▼              ▼
[Billing] [Technical] [Complaint]   [General]
  Agent     Agent       Agent         Agent
       │
       ▼
[Generate Response]
       │
       ▼
[Send to Customer]
```

```python
# File: 20_customer_support_system.py

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
parser = StrOutputParser()

# ── Classifier ────────────────────────────────────────────────
classifier_chain = (
    ChatPromptTemplate.from_messages([
        ("system", "Classify customer messages into: BILLING, TECHNICAL, COMPLAINT, or GENERAL. "
                   "Respond with only the category word."),
        ("human", "{message}")
    ]) | llm | parser
)

# ── Specialist Agents ──────────────────────────────────────────
def create_specialist(specialty: str, tone: str):
    return (
        ChatPromptTemplate.from_messages([
            ("system", f"You are a {specialty} specialist. Tone: {tone}. "
                       "Be helpful, concise, and solution-focused. Max 100 words."),
            ("human", "{message}")
        ]) | llm | parser
    )

billing_agent   = create_specialist("billing and payments", "professional and clear")
technical_agent = create_specialist("technical support", "patient and step-by-step")
complaint_agent = create_specialist("customer experience", "empathetic and apologetic")
general_agent   = create_specialist("general customer support", "friendly and helpful")

# ── Router ────────────────────────────────────────────────────
def route_to_agent(inputs: dict) -> str:
    category = inputs["category"]
    message  = inputs["message"]

    agents = {
        "BILLING":    billing_agent,
        "TECHNICAL":  technical_agent,
        "COMPLAINT":  complaint_agent,
        "GENERAL":    general_agent
    }

    agent = agents.get(category, general_agent)
    return agent.invoke({"message": message})

# ── Full Pipeline ──────────────────────────────────────────────
def handle_customer_message(message: str) -> dict:
    category = classifier_chain.invoke({"message": message}).strip().upper()
    response = route_to_agent({"category": category, "message": message})

    return {
        "customer_message": message,
        "category": category,
        "response": response
    }

# ── Test it! ──────────────────────────────────────────────────
test_messages = [
    "My invoice shows double charge for this month!",
    "The app keeps crashing when I try to upload files",
    "I've been waiting 3 weeks and nobody helps me. This is unacceptable!",
    "What are your business hours?"
]

for msg in test_messages:
    result = handle_customer_message(msg)
    print(f"\n📨 Customer: {result['customer_message']}")
    print(f"🏷️  Category: {result['category']}")
    print(f"💬 Response: {result['response']}")
    print("─" * 60)
```

---

---

# 🚀 PHASE 12 — Production & Advanced Topics

---

## LangSmith — Monitor Your AI in Production

```python
# Add to your .env file:
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_API_KEY=your_langsmith_key
# LANGCHAIN_PROJECT=my-project

# That's it! LangChain automatically sends traces to LangSmith.
# You can see: every LLM call, latency, cost, errors — all in one dashboard.
```

---

## FastAPI Integration

```python
# File: api.py

from fastapi import FastAPI
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel

app = FastAPI(title="LangChain AI API")
llm = ChatOpenAI(model="gpt-4o-mini")
chain = (
    ChatPromptTemplate.from_template("Answer: {question}")
    | llm
    | StrOutputParser()
)

class Question(BaseModel):
    question: str

@app.post("/ask")
async def ask_question(q: Question):
    answer = chain.invoke({"question": q.question})
    return {"answer": answer}

# Run with: uvicorn api:app --reload
```

---

## Streamlit UI (Fastest Way to Demo)

```python
# File: app.py

import streamlit as st
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage

st.title("🤖 My AI Chatbot")

llm = ChatOpenAI(model="gpt-4o-mini")

if "messages" not in st.session_state:
    st.session_state.messages = []

for msg in st.session_state.messages:
    role = "user" if isinstance(msg, HumanMessage) else "assistant"
    st.chat_message(role).write(msg.content)

if prompt := st.chat_input("Type your message..."):
    st.session_state.messages.append(HumanMessage(content=prompt))
    st.chat_message("user").write(prompt)

    response = llm.invoke(st.session_state.messages)
    st.session_state.messages.append(AIMessage(content=response.content))
    st.chat_message("assistant").write(response.content)

# Run with: streamlit run app.py
```

---

## Async LangChain (For Production Speed)

```python
# File: async_example.py

import asyncio
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini")
chain = ChatPromptTemplate.from_template("Write a tagline for {product}") | llm | StrOutputParser()

async def generate_taglines():
    products = ["AI assistant", "smart fridge", "AR glasses"]

    # Run all 3 requests concurrently!
    tasks = [chain.ainvoke({"product": p}) for p in products]
    results = await asyncio.gather(*tasks)

    for product, tagline in zip(products, results):
        print(f"{product}: {tagline}")

asyncio.run(generate_taglines())
```

---

---

# 📋 Complete Learning Roadmap

```
WEEK 1-2:   Foundations
  ✅ Phase 1: Understand LangChain ecosystem
  ✅ Phase 2: Setup environment perfectly
  ✅ Phase 3: Work with OpenAI + Ollama models

WEEK 3-4:   Core Building Blocks
  ✅ Phase 4: Master prompt templates
  ✅ Phase 5: Build chains with LCEL
  ✅ Phase 6: Implement memory

WEEK 5-6:   Power Features
  ✅ Phase 7: Create custom tools
  ✅ Phase 8: Build autonomous agents

WEEK 7-8:   Advanced
  ✅ Phase 9: RAG with vector databases
  ✅ Phase 10: LangGraph stateful workflows

WEEK 9-10:  Production
  ✅ Phase 11: Complete real projects
  ✅ Phase 12-13: FastAPI + Streamlit + Deployment
```

---

# 🔑 Key Concepts Quick Reference

| Concept | What it is | When to use |
|---|---|---|
| `ChatOpenAI` | GPT model wrapper | General AI tasks |
| `ChatOllama` | Local model wrapper | Free, private, offline |
| `PromptTemplate` | Dynamic text prompts | Simple string prompts |
| `ChatPromptTemplate` | Role-based prompts | Chat apps, chatbots |
| `StrOutputParser` | Parse AI output to string | End of most chains |
| `LCEL ( \| )` | Chain components together | Always — modern LangChain |
| `RunnableParallel` | Run chains in parallel | Multiple tasks at once |
| `@tool` | Make a function an AI tool | Giving AI capabilities |
| `create_react_agent` | Build autonomous agent | AI that does tasks |
| `StateGraph` | Build complex workflows | Multi-step, conditional AI |
| `ChromaDB` | Vector database | Storing document embeddings |
| `PyPDFLoader` | Load PDF files | RAG with PDF documents |

---

# 🏆 Final Words From Your AI Mentor

> You've now seen the **full LangChain landscape** — from "what is an LLM" to building multi-agent systems, RAG pipelines, and production APIs.

**The key principle to remember:**

```
LangChain = LEGO blocks for AI
  Every piece (prompt, model, tool, memory, agent)
  is a block you can snap together however you need.
```

**Your next steps:**

1. ✅ Set up your environment today (Phase 2)
2. ✅ Run your first `llm.invoke()` this week
3. ✅ Build one real mini project per phase
4. ✅ Join the LangChain Discord community
5. ✅ Explore `python.langchain.com/docs` — it's excellent
6. ✅ Build something real — that's the best teacher

---

**You're not just learning a library. You're learning how to build the future.** 🚀

---

*Ready to go deeper on any Phase? Come back with questions anytime!*

---

> 📄 **Course generated with Claude AI** | LangChain version: 0.3+ | Python 3.9+