# 🚀 Ollama Agent Gallery Guide

Welcome to the next generation of local AI. This guide explains the **Agentic AI** tools now available in your Ollama installation.

---

## 🤖 Available AI Agents

| Agent | Developer | Primary Focus | Launch Command |
| :--- | :--- | :--- | :--- |
| **OpenClaw** | Community | **Personal Assistant** with 100+ skills. | `ollama launch openclaw` |
| **Claude** | Anthropic | **Coding Architect** with subagent support. | `ollama launch claude` |
| **Codex** | OpenAI | **Technical Specialist** for surgical code fixes. | `ollama launch codex` |
| **OpenCode** | Anomaly | **Open-Source** coding agent for privacy. | `ollama launch opencode` |
| **Droid** | Factory | **IDE Integration** across terminal and editors. | `ollama launch droid` |

---

## 🌟 Key Benefits of Using Agents

> [!TIP]
> **What is an Agent?** Unlike a basic chatbot, an Agent can "act." It can read your files, run terminal commands, and solve multi-step problems without you doing the work manually.

### 1. Zero Configuration
No more setting up complex folders or system variables. One command handles the entire installation and setup for you.

### 2. Privacy & Cost
Because these run through Ollama on your **local machine**:
- Your data never leaves your computer.
- You don't need to pay for expensive monthly AI subscriptions.

### 3. Deep File System Access
These agents are designed to "collaborate" with your filesystem. You can ask them to:
- "Refactor all files in this directory."
- "Find where the bug is in my logic."
- "Write unit tests for my new Python script."

---

## 🛠 How to Use These Benefits

To start using any of these agents, simply copy the command and paste it into your terminal.

### Example: Running Claude Code
If you have a coding problem you want to solve right now, run:
```powershell
ollama launch claude
```

### Example: Running OpenClaw for General Tasks
If you need an assistant to help manage your day-to-day work, run:
```powershell
ollama launch openclaw
```

---
*Created on: 2026-04-15*


# 🚀 Ollama Agent Gallery — Beginner to Pro Guide

## 🧠 What Changed in Ollama?

After upgrading to the latest version of **Ollama**, it is no longer just a chatbot.

👉 It has evolved into an **Agent Platform**.

### 🤖 What is an Agent?

An **Agent** is an AI that:

* Talks like a chatbot ✅
* **Takes actions** on your behalf ✅

### 💡 Examples of Actions

* Create files
* Run code/tests
* Search the web
* Debug projects
* Manage workflows

---

# 🖼️ 1. Understanding the Agent Gallery

Below is a simplified breakdown of the agents you see:

| Agent Name   | Role             | Description                       | Key Feature                      |
| ------------ | ---------------- | --------------------------------- | -------------------------------- |
| **OpenClaw** | All-Rounder      | General-purpose assistant         | 100+ built-in skills             |
| **Claude**   | Architect        | Advanced reasoning & coding agent | Handles complex code + subagents |
| **Codex**    | Specialist       | Precision coding agent            | High accuracy code editing       |
| **OpenCode** | Open Alternative | Fully open-source agent           | Privacy + community-driven       |
| **Droid**    | Multi-Tasker     | Works across tools                | Terminal + IDE integration       |

---

# ⚙️ 2. Why This is a BIG Upgrade

## 🔥 1. Zero Configuration

Earlier:

* You had to manually build agents (like `agentic01.py`)
* Write logic, tools, integrations

Now:

```bash
ollama launch <agent>
```

👉 Everything is ready instantly.

---

## 🔗 2. Deep Integration (Real Power)

These agents can **interact with your system**.

### 🧪 Example:

```
Find all bugs in my Project001 folder and fix them
```

👉 The agent can:

* Read your files
* Analyze code
* Fix issues automatically

---

## 💰 3. No API Keys Needed

* Runs **locally on your machine**
* No need for:

  * OpenAI API key ❌
  * Anthropic subscription ❌

👉 Full power with **zero cost (local compute)**

---

# 🧪 3. How to Try an Agent

## ▶️ Step 1: Open Terminal

## ▶️ Step 2: Run Command

```powershell
ollama launch claude
```

## ▶️ Step 3: Start Giving Instructions

Example:

* "Refactor my code"
* "Explain this project"
* "Fix all bugs"

---

# ⭐ My Recommendation

👉 Start with:

```bash
ollama launch claude
```

### Why?

* Best reasoning capability
* Excellent for developers
* Handles complex tasks
* Supports multi-step thinking

---

# 🧠 Pro Insight (Important)

Think of Agents like this:

```
ChatGPT = Brain 🧠
Agent = Brain + Hands 🤖
```

👉 Agents don’t just think…
👉 They **DO the work for you**

---

# 🛠️ Claude Code: The Ultimate Terminal Guide

When you run `ollama launch claude`, you aren't just starting a chatbot—you are activating a **Full-Stack Coding Agent**. This guide explains how to use it effectively inside your VS Code terminal.

---

## 🚀 1. Getting Started

### Launching in VS Code
1. Open your project in VS Code.
2. Open the Integrated Terminal (``Ctrl + ` ``).
3. Type the following and press Enter:
   ```powershell
   ollama launch claude
   ```

### Giving Permissions
Claude is an **Agent**, meaning it can read and write files. The first time you run a command that impacts your files, it will ask for permission. Just type `y` to allow it.

---

## 🔍 2. Core Use Cases (Step-by-Step)

### A. Understanding a New Project
If you just opened a folder and don't know where to start, ask Claude to explain it.
- **Command:** `"Explain the architecture of this project."`
- **What happens:** Claude scans all your files, identifies the main entry points, and gives you a high-level summary.

### B. Finding and Fixing Bugs
Claude can act as a debugger.
- **Command:** `"I'm getting a KeyError in chatbot.py. Find it and fix it."`
- **What happens:** Claude opens the file, finds the missing key logic, writes the fix, and **saves the file automatically**.

### C. Adding New Features
Instead of writing the code yourself, describe the feature.
- **Command:** `"Add a new tool to agentic01.py that fetches the current weather."`
- **What happens:** Claude will import the necessary libraries, define the function, and update the `TOOLS` list in your code.

---

## ⚡ 3. Advanced Terminal Power

One of Claude’s biggest advantages is that it can **run terminal commands** for you.

### 🧪 Automated Testing
Ask Claude to verify its own work:
- **Prompt:** `"Fix the logic in utils.py and then run 'pytest' to make sure it works."`
- **Action:** Claude will edit the file, then execute the command in your terminal and check the output.

### 📜 Git Management
Claude can handle your version control:
- **Prompt:** `"Review my changes and create a git commit with a clear message."`
- **Action:** Claude runs `git diff`, understands what changed, and executes `git commit -m "..."` for you.

---

## 💡 4. Top 5 Power Phrases
Use these proven prompts to get the most out of Claude:

1. **"Deep Scan":** `"Go through my whole project and find any security vulnerabilities."`
2. **"Refactor":** `"Rewrite the functions in this file to be cleaner and more efficient."`
3. **"Document":** `"Add clear docstrings and comments to every function in this folder."`
4. **"Bridge":** `"I need to connect my Python script to a local SQLite database. Set that up for me."`
5. **"Check":** `"Check if I have all the necessary libraries installed to run this app."`

---

## ⚠️ 5. Best Practices

> [!IMPORTANT]
> **Review its work:** Claude is very smart, but it's always good practice to look at the code it wrote. Since you are in VS Code, you will see the changes highlighted immediately!

> [!TIP]
> **Use the Integrated Terminal:** Always run Claude inside the VS Code terminal. This way, you can see the files it's editing in the editor window while the agent works in the terminal below.

---
*Generated by Antigravity AI Guide*


# 🚀 Final Takeaway

The Ollama Agent Gallery turns your system into a:

* Personal AI Developer 👨‍💻
* Automation Engine ⚙️
* Problem Solver 🧠

👉 This is a major step toward **fully autonomous AI workflows**.

# 🚀 Ollama Agent Gallery — From Basics to Building Your Own Agent

---

# 🧠 0. What You’ll Learn (Roadmap)

By the end of this guide, you will:

* Understand what AI Agents really are
* Use prebuilt Ollama agents
* Build your **own custom agent from scratch**
* Add tools (files, terminal, APIs)
* Create autonomous workflows

---

# 🧠 1. What Changed in Ollama?

Ollama is no longer just a chatbot.

👉 It is now an **Agent Platform**

## 🤖 Agent = Brain + Actions

| Capability         | Chatbot | Agent |
| ------------------ | ------- | ----- |
| Answer questions   | ✅       | ✅     |
| Execute tasks      | ❌       | ✅     |
| Use tools          | ❌       | ✅     |
| Automate workflows | ❌       | ✅     |

---

# 🖼️ 2. Agent Gallery Overview

| Agent Name | Role         | Key Feature                   |
| ---------- | ------------ | ----------------------------- |
| OpenClaw   | All-Rounder  | 100+ skills                   |
| Claude     | Architect    | Complex reasoning + subagents |
| Codex      | Specialist   | Precision coding              |
| OpenCode   | Open Source  | Privacy-first                 |
| Droid      | Multi-Tasker | Terminal + IDE                |

---

# ⚙️ 3. Using Prebuilt Agents (Fast Start)

## ▶️ Run an Agent

```bash
ollama launch claude
```

## 💡 Example Commands

* "Fix bugs in my project"
* "Create a REST API"
* "Explain this codebase"

👉 These agents can **read, edit, and execute code**.

---

# 🏗️ 4. Build Your Own Agent (Core Concept)

## 🧩 Agent Architecture

```
User Input
   ↓
LLM (Brain)
   ↓
Tool Selector
   ↓
Tools (Files / APIs / Terminal)
   ↓
Final Output
```

---

# ⚙️ 5. Step-by-Step: Create Your First Agent

## 🪜 Step 1: Setup Environment

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)
```

---

## 🪜 Step 2: Basic Chat Agent

```python
response = client.chat.completions.create(
    model="llama3",
    messages=[
        {"role": "user", "content": "Explain recursion simply"}
    ]
)

print(response.choices[0].message.content)
```

👉 This is just a chatbot (no actions yet)

---

# 🧠 6. Adding Tools (Turning into Agent)

## 🔧 Example Tool: File Reader

```python
import os

def read_file(path):
    with open(path, "r") as f:
        return f.read()
```

---

## 🔗 Tool Integration Logic

```python
def agent(user_input):
    if "read file" in user_input:
        return read_file("example.txt")
    else:
        response = client.chat.completions.create(
            model="llama3",
            messages=[{"role": "user", "content": user_input}]
        )
        return response.choices[0].message.content
```

---

# 🤖 7. Smart Agent (Tool Selection via LLM)

```python
import json

tools = [
    {
        "name": "read_file",
        "description": "Read content of a file"
    }
]

response = client.chat.completions.create(
    model="llama3",
    messages=[{"role": "user", "content": "Read data.txt"}],
    tools=tools
)
```

👉 Model decides **which tool to use automatically**

---

# ⚡ 8. Real-World Agent Example

## 🧪 Auto Bug Fixer Agent

### Workflow:

1. Scan project
2. Detect errors
3. Fix code
4. Save file

```python
import subprocess

def run_tests():
    return subprocess.getoutput("pytest")


def fix_code(code):
    prompt = f"Fix this code:\n{code}"
    response = client.chat.completions.create(
        model="llama3",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
```

---

# 🔄 9. Agent Loop (Autonomous Behavior)

```python
while True:
    task = input("Enter task: ")
    result = agent(task)
    print(result)
```

👉 Makes agent **interactive + continuous**

---

# 🧠 10. Memory (Persistent Intelligence)

## 💾 Save Memory

```python
import json

memory = []

memory.append({"user": "Hi", "assistant": "Hello"})

with open("memory.json", "w") as f:
    json.dump(memory, f)
```

---

## 🔄 Load Memory

```python
with open("memory.json", "r") as f:
    memory = json.load(f)
```

👉 Agent remembers past interactions

---

# 🌐 11. Add More Tools (Power Boost)

## 🔧 Useful Tools

* File system (read/write)
* Terminal execution
* Web search
* Database queries
* APIs

---

# 🧠 12. Pro-Level Architecture

```
Planner Agent
   ↓
Executor Agent
   ↓
Tool Layer
   ↓
Memory Layer
```

👉 Multi-agent systems = **next level AI**

---

# 🔥 13. Real Use Cases

## 👨‍💻 Developer Agent

* Fix bugs
* Write code
* Run tests

## 📊 Data Agent

* Analyze CSV
* Generate reports

## 🧑‍💼 Personal Assistant

* Schedule tasks
* Manage files

---

# ⚠️ 14. Best Practices

* Always validate tool output
* Limit dangerous commands
* Use logging
* Keep memory optimized

---

# 🚀 Final Insight

```
LLM Alone = Smart
Agent = Smart + Action + Memory
```

👉 This is the future of software development

---

# 🖥️ 15. Build a VS Code AI Agent (Full Guide)

Now let’s build a **real AI agent inside VS Code** that can:

* Read your project
* Modify code
* Run terminal commands
* Assist like GitHub Copilot (but more powerful)

---

## 🧰 Step 1: Project Setup

Create a folder:

```bash
vscode-agent
cd vscode-agent
```

Create files:

```
agent.py
memory.json
```

---

## ⚙️ Step 2: Install Dependencies

```bash
pip install openai watchdog
```

---

## 🔌 Step 3: Connect to Ollama

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)
```

---

## 📂 Step 4: File System Tools

```python
import os


def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        return "File updated successfully"
```

---

## 💻 Step 5: Terminal Tool

```python
import subprocess


def run_command(cmd):
    return subprocess.getoutput(cmd)
```

---

## 🧠 Step 6: Agent Brain

```python
def ask_llm(prompt):
    response = client.chat.completions.create(
        model="llama3",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
```

---

## 🔀 Step 7: Decision Engine (Core Agent Logic)

```python
def agent(task):
    if "read" in task:
        return read_file("app.py")

    elif "run" in task:
        return run_command("python app.py")

    elif "fix" in task:
        code = read_file("app.py")
        fixed = ask_llm(f"Fix this code:
{code}")
        write_file("app.py", fixed)
        return "Code fixed"

    else:
        return ask_llm(task)
```

---

## 🔄 Step 8: Live VS Code Interaction Loop

```python
while True:
    task = input("🧠 Agent > ")

    if task.lower() == "exit":
        break

    result = agent(task)
    print("⚡", result)
```

---

## ⚡ Step 9: Auto File Watcher (Real VS Code Feel)

```python
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class ChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        print(f"File changed: {event.src_path}")


observer = Observer()
observer.schedule(ChangeHandler(), path=".", recursive=True)
observer.start()
```

👉 Now your agent can **detect file changes automatically**

---

# 🧪 16. Example Usage in VS Code

Run your agent:

```bash
python agent.py
```

Then type:

* "Read app.py"
* "Fix bugs in app.py"
* "Run project"
* "Optimize this code"

👉 It will act like a **real coding assistant**

---

# 🔥 17. Upgrade Ideas (Next Level)

## 🧠 Add Memory

* Store chat history
* Recall past fixes

## 🌐 Add Web Search

* Use APIs
* Fetch documentation

## 🧑‍🤝‍🧑 Multi-Agent System

* Planner → decides task
* Executor → performs task

## 🖥️ UI Layer

* Streamlit dashboard
* VS Code extension (advanced)

---

# 🚀 Final Takeaway

Your VS Code is no longer just an editor.

👉 It becomes a **self-operating AI development environment**

---

If you want next upgrade 🔥:

* Build a **VS Code Extension (like Copilot)**
* Add **real-time code suggestions**
* Integrate **RAG + vector DB**

## 💻 Deep Dive: Using Agents with VS Code

When you run `ollama launch claude`, it operates through your **Integrated Terminal** inside VS Code (press ``Ctrl + ` ``).

### How it works:
* **Real-time Editing:** The agent "lives" alongside your code. When you ask it to fix a bug, it will **physically rewrite the code** in your editor.
* **Terminal Power:** It can run your tests and terminal commands automatically.

### Agents vs. Extensions: A Quick Comparison

| Feature | VS Code Extensions (e.g., Copilot) | Ollama Agents (e.g., Claude/Droid) |
| :--- | :--- | :--- |
| **Action** | Suggests text for you to click. | **Performs the work for you.** |
| **Terminal** | Passive (doesn't run commands). | **Active (can run tests and deploy).** |
| **Planning** | Focused on the current file. | **Scans the entire project.** |
| **Control** | You are the driver. | **The AI is the driver.** |

> [!IMPORTANT]
> To get the best of both worlds, use **`ollama launch droid`**. It is specifically designed to bridge your terminal and your VS Code editor exactly like an extension!


---

## 💎 PRO HACK: Run Claude for FREE with Ollama

You can use the powerful **Claude Code** tool without an Anthropic subscription by connecting it to your local Ollama server.

### 1. Setup Complete
I have already installed the Claude engine and downloaded the **`qwen2.5-coder`** model for you.

### 2. How to Launch
I created a special script to handle the connection automatically. Just run this in your terminal:
```powershell
./Project001/start_claude_free.ps1
```

### 3. What to expect
*   **The tool will open in your terminal.**
*   **It will use your computer's power (GPU/RAM) instead of the internet.**
*   **All your data stays 100% private on your machine.**

---
