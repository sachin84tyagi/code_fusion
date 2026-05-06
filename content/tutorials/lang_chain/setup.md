# 🛠️ Phase 2 — Setting Up Your Environment
### "Building Your AI Engineering Workbench"

> **Difficulty**: ⭐ Beginner | **Time**: ~60 minutes | **Prerequisites**: Phase 1 Complete

---

## 🎯 What You'll Set Up In This Phase

By the end of this phase, you will have:

- ✅ Python virtual environment (clean, professional setup)
- ✅ LangChain installed and working
- ✅ Ollama running locally (FREE local AI — no API costs!)
- ✅ OpenAI SDK installed (for cloud AI)
- ✅ VS Code configured for AI engineering
- ✅ Your first LangChain "Hello World" running
- ✅ Professional project folder structure

---

## 📖 Lesson 2.1 — Understanding The Setup

### Why Do We Need All This?

```
YOUR LANGCHAIN APP
        │
        ├── Needs Python (the language)
        ├── Needs LangChain (the framework)
        ├── Needs an AI Model:
        │       ├── Option A: OpenAI (cloud, costs money, very powerful)
        │       └── Option B: Ollama (local, FREE, runs on your machine)
        └── Needs VS Code (where you write code)
```

### The Choice: Cloud AI vs Local AI

```
┌─────────────────────────────────────────────────────────┐
│                    AI MODEL OPTIONS                      │
├──────────────────────┬──────────────────────────────────┤
│    OpenAI (Cloud)    │        Ollama (Local)            │
├──────────────────────┼──────────────────────────────────┤
│ 💰 Costs money       │ 🆓 Completely FREE               │
│ 🌐 Needs internet    │ 📴 Works offline                 │
│ ⚡ Very fast         │ 🐌 Slower (depends on your PC)   │
│ 🧠 Most powerful     │ 🔒 100% private (stays on PC)   │
│ 📊 Best for prod     │ 🎓 Perfect for learning          │
└──────────────────────┴──────────────────────────────────┘
```

**Recommendation for beginners**: Use **Ollama** (free!) for learning. Add OpenAI later when you build real products.

---

## 📖 Lesson 2.2 — Step 1: Install Python

### Check If You Have Python

Open your terminal (Command Prompt or PowerShell on Windows):

```bash
python --version
# or
python3 --version
```

You need **Python 3.9 or higher**. If you see `Python 3.9.x` or higher — you're good!

### If You Need To Install Python

1. Go to **https://python.org/downloads**
2. Download Python 3.11 or 3.12 (latest stable)
3. During installation: ✅ **Check "Add Python to PATH"** (very important!)
4. After install, restart your terminal and run `python --version`

---

## 📖 Lesson 2.3 — Step 2: Create Your Project Folder

Professional AI engineers always use a clean folder structure. Let's create yours:

### Open Terminal and Run These Commands

```bash
# Navigate to where you want your project
# (This course assumes you're in d:\myFirstAITest\LangChain_Course)

# Create your working directory
mkdir langchain_projects
cd langchain_projects
```

### Create a Virtual Environment

> 🤔 **What's a virtual environment?**
> 
> Think of it like a separate room in your house. Each project gets its own room with its own tools. This prevents "tool conflicts" between projects.

```bash
# Create virtual environment (named .venv)
python -m venv .venv
```

### Activate The Virtual Environment

**On Windows:**
```bash
.venv\Scripts\activate
```

**On Mac/Linux:**
```bash
source .venv/bin/activate
```

**You'll know it worked when you see** `(.venv)` at the start of your terminal line:
```
(.venv) PS d:\myFirstAITest\LangChain_Course\langchain_projects>
```

> ⚠️ **Always activate your virtual environment before working!** If you forget, packages won't install to the right place.

---

## 📖 Lesson 2.4 — Step 3: Install LangChain

Now let's install LangChain. We install specific packages for what we need:

```bash
# Core LangChain packages
pip install langchain                  # Main framework
pip install langchain-core             # Core abstractions
pip install langchain-community        # Community integrations

# For OpenAI models
pip install langchain-openai           # OpenAI integration
pip install openai                     # OpenAI SDK

# For Ollama (local models)
pip install langchain-ollama           # Ollama integration

# Useful utilities
pip install python-dotenv              # For managing API keys safely
```

### Verify Installation

```bash
python -c "import langchain; print(langchain.__version__)"
# Should print something like: 0.3.x
```

---

## 📖 Lesson 2.5 — Step 4: Install and Setup Ollama (FREE Local AI)

### What Is Ollama?

Ollama lets you run powerful AI models **directly on your computer** — no internet needed, completely free, completely private.

```
Without Ollama:                    With Ollama:
Your Code → Internet → OpenAI     Your Code → Ollama → Local AI
            ($$$ per call)                    (FREE, private!)
```

### Install Ollama

1. Go to **https://ollama.com**
2. Download for your OS (Windows/Mac/Linux)
3. Install it (just click through the installer)
4. After install, Ollama runs in the background automatically

### Download An AI Model

Open terminal and run:

```bash
# Download Llama 3.2 (3 billion parameters — runs on most computers)
ollama pull llama3.2

# OR download a smaller model (faster, less RAM needed)
ollama pull llama3.2:1b

# OR download Gemma 2 by Google
ollama pull gemma2:2b
```

> 📦 This downloads the model file. It's like downloading an AI brain to your computer.
> Size: 1-4 GB depending on the model.

### Test Ollama Is Working

```bash
# Chat with the model directly in terminal
ollama run llama3.2

# Type a message, press Enter
>>> Hello! Who are you?
# You should get a response from the AI!

# Press Ctrl+D or type /bye to exit
```

---

## 📖 Lesson 2.6 — Step 5: Setup OpenAI API Key (Optional for Now)

If you want to use OpenAI's powerful GPT models, you need an API key.

### Get Your API Key

1. Go to **https://platform.openai.com**
2. Create an account (or sign in)
3. Go to **API Keys** section
4. Click **Create new secret key**
5. Copy and save it somewhere safe

> ⚠️ **NEVER share your API key! NEVER put it directly in your code!**

### Store Your API Key Safely

Create a file called `.env` in your project folder:

```bash
# In your project folder, create a file called .env
# Add this line (replace with your actual key):
OPENAI_API_KEY=sk-your-actual-key-here
```

Create a `.gitignore` file so you never accidentally share it:

```bash
# .gitignore
.env
.venv/
__pycache__/
*.pyc
```

### Load API Key In Your Code

```python
# At the top of EVERY Python file
from dotenv import load_dotenv
import os

load_dotenv()  # This reads your .env file
api_key = os.getenv("OPENAI_API_KEY")  # Gets the key safely
```

---

## 📖 Lesson 2.7 — Step 6: VS Code Setup

### Install VS Code

Download from: **https://code.visualstudio.com**

### Essential Extensions For AI Engineering

Install these VS Code extensions:

1. **Python** (by Microsoft) — Python support, linting
2. **Pylance** — Smart Python autocomplete
3. **Python Debugger** — Debug your Python code
4. **GitLens** — Git superpowers
5. **GitHub Copilot** (optional) — AI coding assistant

### VS Code Settings For Python

Press `Ctrl+Shift+P` → Type "Select Python Interpreter" → Select your `.venv` environment.

---

## 📖 Lesson 2.8 — Professional Project Structure

Every professional AI project should be organized like this:

```
my_langchain_project/
│
├── .env                  ← API keys (NEVER commit this!)
├── .gitignore            ← Files Git should ignore
├── README.md             ← Project description
├── requirements.txt      ← All dependencies listed
│
├── src/                  ← Your source code
│   ├── __init__.py
│   ├── agents/           ← Agent code
│   ├── chains/           ← Chain code
│   ├── tools/            ← Custom tools
│   ├── memory/           ← Memory configurations
│   └── prompts/          ← Prompt templates
│
├── data/                 ← Documents, PDFs, datasets
│   ├── pdfs/
│   └── raw/
│
├── tests/                ← Test files
│
└── notebooks/            ← Jupyter notebooks for experiments
```

### Create requirements.txt

Always track your dependencies:

```bash
# After installing packages, run:
pip freeze > requirements.txt

# To install from requirements.txt on a new machine:
pip install -r requirements.txt
```

---

## 📖 Lesson 2.9 — Your First LangChain "Hello World"

Now let's write actual code! We'll start with Ollama (free, no API key needed).

### File: `hello_langchain.py`

```python
# ============================================================
# FILE: hello_langchain.py
# PURPOSE: Your very first LangChain program!
# ============================================================

# Import the Ollama chat model from LangChain
from langchain_ollama import ChatOllama

# Import message types
from langchain_core.messages import HumanMessage, SystemMessage

# ---- Step 1: Create the model ----
# Think of this as "connecting to your local AI brain"
# model="llama3.2" tells LangChain which AI to use
llm = ChatOllama(model="llama3.2")

# ---- Step 2: Create a message ----
# HumanMessage = message from the user (you)
# SystemMessage = instructions for how the AI should behave
messages = [
    SystemMessage(content="You are a friendly AI tutor who explains things simply."),
    HumanMessage(content="What is LangChain? Explain in 2 sentences.")
]

# ---- Step 3: Send to AI and get response ----
# .invoke() means "run this and wait for the answer"
response = llm.invoke(messages)

# ---- Step 4: Print the response ----
# response.content contains the actual text reply
print("🤖 AI Response:")
print(response.content)
```

### Run It!

```bash
python hello_langchain.py
```

### Expected Output

```
🤖 AI Response:
LangChain is a framework that makes it easy to build applications 
powered by large language models (LLMs). It provides building blocks 
like chains, memory, and agents that help developers create 
sophisticated AI apps without writing everything from scratch.
```

🎉 **Congratulations! You just ran your first LangChain code!**

---

### Now Let's Try With OpenAI (If You Have A Key)

```python
# ============================================================
# FILE: hello_openai.py
# PURPOSE: Same program but with OpenAI GPT
# ============================================================

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

# Load API key from .env file
load_dotenv()

# Create OpenAI model
# Notice: same interface, just different class!
llm = ChatOpenAI(model="gpt-4o-mini")  # gpt-4o-mini is cheap and fast

# Same messages as before!
messages = [
    SystemMessage(content="You are a friendly AI tutor who explains things simply."),
    HumanMessage(content="What is LangChain? Explain in 2 sentences.")
]

# Same invoke pattern!
response = llm.invoke(messages)
print("🤖 AI Response:")
print(response.content)
```

> 🔑 **Key Insight**: The code is almost identical! This is LangChain's power — swap models by changing ONE line.

---

## 📖 Lesson 2.10 — Line-By-Line Code Explanation

Let's break down every line of `hello_langchain.py`:

```python
from langchain_ollama import ChatOllama
```
- `from langchain_ollama` → Go to the langchain-ollama package
- `import ChatOllama` → Get the ChatOllama class (a wrapper around the Ollama AI)

```python
from langchain_core.messages import HumanMessage, SystemMessage
```
- LangChain uses typed messages (not just raw strings)
- `HumanMessage` = what the user says
- `SystemMessage` = background instructions for the AI (it sees this but user doesn't)
- `AIMessage` = what the AI replies (you'll use this later)

```python
llm = ChatOllama(model="llama3.2")
```
- Creates a "connection" to the llama3.2 model
- This doesn't send anything yet — just sets up the connection

```python
messages = [
    SystemMessage(content="You are a friendly AI tutor..."),
    HumanMessage(content="What is LangChain?...")
]
```
- A list of messages — this is the "conversation so far"
- Order matters: System first, then Human message(s)

```python
response = llm.invoke(messages)
```
- `.invoke()` is the standard LangChain method to "run" something
- Sends all messages to the AI, waits for response
- Returns an `AIMessage` object

```python
print(response.content)
```
- `response` is an `AIMessage` object
- `.content` extracts just the text from it

---

## ⚠️ Common Mistakes & Debugging

### Mistake 1: Ollama Not Running

```
Error: ConnectionRefusedError: ... connection refused
```
**Fix**: Make sure Ollama is running! It should start automatically on Windows. 
Or run: `ollama serve` in a separate terminal.

---

### Mistake 2: Model Not Downloaded

```
Error: model "llama3.2" not found
```
**Fix**: Run `ollama pull llama3.2` first to download the model.

---

### Mistake 3: Virtual Environment Not Activated

```
Error: ModuleNotFoundError: No module named 'langchain_ollama'
```
**Fix**: Activate your virtual environment first:
```bash
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux
```

---

### Mistake 4: Wrong Package Name

```
# ❌ WRONG - old LangChain style
from langchain.llms import OpenAI  

# ✅ CORRECT - modern LangChain style
from langchain_openai import ChatOpenAI
```

LangChain updated its package structure. Always use the modern imports.

---

## 🔋 Bonus: Streaming Responses

Instead of waiting for the full response, you can stream it word-by-word (like ChatGPT does):

```python
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage

llm = ChatOllama(model="llama3.2")

# stream() instead of invoke()
# This prints each word as it's generated!
print("🤖 AI Response (streaming):")
for chunk in llm.stream([HumanMessage(content="Tell me a short fun fact about AI!")]):
    print(chunk.content, end="", flush=True)
print()  # New line at the end
```

---

## 🎯 Mini Challenge

**Challenge 1 (Beginner)**:
Modify `hello_langchain.py` so the AI introduces itself as a professional AI teaching assistant named "Professor Langgy". Ask it to explain what "tokens" are in simple terms.

**Challenge 2 (Intermediate)**:
Create a file called `ask_anything.py` that:
1. Asks the USER to type a question (use `input()`)
2. Sends that question to the AI
3. Prints the AI's answer

**Challenge 3 (Advanced)**:
Modify your program to print:
1. The AI's response
2. The total number of tokens used (hint: check `response.usage_metadata`)

---

## ✅ Phase 2 Recap

| Step | What You Did | Why It Matters |
|------|-------------|----------------|
| Python venv | Created isolated environment | Prevents package conflicts |
| LangChain install | Installed framework packages | Have the tools ready |
| Ollama setup | Running local AI | Free AI for development |
| API key setup | `.env` file for secrets | Security best practice |
| VS Code setup | Professional IDE | Better coding experience |
| Hello World | First working LangChain code | Proof everything works! |
| Project structure | Organized folders | Scales to big projects |

---

## 📁 Files Created In This Phase

```
LangChain_Course/
└── langchain_projects/
    ├── .env              ← Your API keys
    ├── .gitignore        ← Git ignore file
    ├── requirements.txt  ← Package list
    ├── hello_langchain.py ← First program (Ollama)
    ├── hello_openai.py   ← First program (OpenAI)
    └── ask_anything.py   ← Your challenge file
```

---

## 🚀 What's Next?

In **Phase 3**, we go deep into Models:
- Using different AI models
- Understanding temperature (creativity setting)
- Understanding tokens (AI's currency)
- Streaming responses
- Getting structured output from AI

> **Go to**: `Phase03_Models/lesson.md` →

---

*Phase 2 Complete! 🛠️ Your development environment is ready. Let's build!*
