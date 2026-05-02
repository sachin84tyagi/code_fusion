# Module 1: The Agent's Vocabulary (Variables & Data Types)

Welcome to the first module of the **Python for Agentic AI Masterclass**! 🚀

In traditional Python courses, they teach you about variables by having you store an apple's price or a person's name. That's boring! We are learning Python strictly to build AI. 

So, what is a variable in the world of Agentic AI? 

Think of a **Variable** as a labeled box where an AI stores its thoughts, its instructions, and its memories. Without variables, an AI would instantly forget everything you told it!

---

## 🔤 1. Strings (The AI's Language)
A **String** is just a fancy word for text. In Agentic AI, Strings are the most important data type because **Prompts are Strings!** 

When you type a message to ChatGPT, you are sending it a String.

```python
# A simple String
user_prompt = "Hello robot, what is the capital of France?"

# A System Prompt (Telling the AI who it is)
system_prompt = "You are a helpful travel assistant. Always be polite."
```

## 🔢 2. Integers and Floats (The AI's Dials)
**Integers** (whole numbers) and **Floats** (decimals) are used to control the AI's settings. 

For example, LLMs have a setting called `temperature` which controls how creative they are. A temperature of `0.0` makes the AI sound like a boring robot, while `0.9` makes it very creative!

```python
# A Float (Decimal) controlling creativity
creativity_temperature = 0.7 

# An Integer (Whole Number) setting a limit
max_words_in_answer = 100
```

## 📋 3. Lists (The AI's Notebook)
A **List** is exactly what it sounds like: a collection of items kept in order. 

Why do AI agents need Lists? **Memory!** To hold a conversation, an AI needs to keep a running list of everything you have said to it so far. 

```python
# A List holding the conversation history
chat_memory = ["Hello robot!", "Hi there, human!", "What is 2+2?"]

# Adding a new thought to the list
chat_memory.append("The answer is 4.")
```

## 📕 4. Dictionaries (The AI's Instruction Manual)
A **Dictionary** in Python holds data in `key: value` pairs. You look up a label (the key) to find the data inside it (the value).

Why do agents need Dictionaries? Because this is how we teach them to use **Tools**! When we give an AI a tool (like a calculator), we hand it a Dictionary that describes exactly what the tool is called and how to use it.

```python
# A Dictionary describing a tool to the AI
calculator_tool = {
    "name": "add_numbers",
    "description": "Use this tool to add two numbers together."
}

# Looking up the tool's name
print(calculator_tool["name"]) # Prints: add_numbers
```

---

## 🛠️ Let's Build Our First Script!

We are going to write a script that proves how agents use these 4 data types. 
Open your code editor and let's create `01_agent_vocabulary.py`. 

*(The code for this project is located in your `Python_For_AI_Course` folder!)*

```python
"""
==================================================
 MODULE 1: THE AGENT'S VOCABULARY
==================================================
In this script, we will see how Strings, Integers, 
Lists, and Dictionaries are the literal building blocks
of an AI Agent.
"""

from openai import OpenAI

# ---------------------------------------------------------
# 1. STRINGS (The Prompts)
# ---------------------------------------------------------
# Strings are just text wrapped in quotes. This is how we talk to the AI.
system_prompt = "You are a grumpy pirate. Always answer like a pirate."
user_prompt = "Hello! What is your favorite color?"

# ---------------------------------------------------------
# 2. INTEGERS & FLOATS (The Settings)
# ---------------------------------------------------------
# Numbers control how the AI behaves. No quotes around numbers!
max_words = 50           # Integer (Whole number)
creativity_level = 0.9   # Float (Decimal number for 'temperature')

# ---------------------------------------------------------
# 3. DICTIONARIES (The Message Format & Tool Manuals)
# ---------------------------------------------------------
# Dictionaries use { "key": "value" }. 
# AI APIs require our messages to be formatted as Dictionaries!
message_1 = {"role": "system", "content": system_prompt}
message_2 = {"role": "user", "content": user_prompt}

# ---------------------------------------------------------
# 4. LISTS (The Agent's Memory)
# ---------------------------------------------------------
# Lists are surrounded by [square brackets]. 
# An Agent's memory is just a List of Message Dictionaries!
chat_memory = []

# Let's add our messages to the memory list using .append()
chat_memory.append(message_1)
chat_memory.append(message_2)

print("--- AGENT'S MEMORY SO FAR ---")
print(chat_memory)
print("-----------------------------\n")

# ---------------------------------------------------------
# 5. WATCH IT ALL COME TOGETHER!
# ---------------------------------------------------------
print(" Sending our Strings, Floats, Dictionaries, and Lists to the AI...")

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# Look at how we plug all our variables into the AI!
response = client.chat.completions.create(
    model="llama3.2",
    messages=chat_memory,        # Our LIST of DICTIONARIES
    temperature=creativity_level,# Our FLOAT
    max_tokens=max_words         # Our INTEGER
)

# The AI's reply is also a String hidden inside an object!
ai_reply_string = response.choices[0].message.content

print("\n THE AI REPLIES:")
print(ai_reply_string)

# Let's save the AI's reply to our memory List so it doesn't forget!
chat_memory.append({"role": "assistant", "content": ai_reply_string})
```
---

# Module 1: Variables & Data Types for Agents
### *How agents store information like memory, API keys, and tool results*

---

## The Story: Your Agent's Notebook

Imagine your AI agent is a super-smart detective. Before it does anything, it opens a **notebook** and writes down everything it knows:

- Its name
- The user's question
- Its API key (to call tools)
- A list of tasks to complete
- Whether it already answered or not

That notebook? That's **variables**. And the different *kinds* of things it writes down? Those are **data types**.

---

## What is a Variable?

A variable is just a **labeled box** in your computer's memory.

```python
agent_name = "Aria"
```

When Python sees this line:
1. It creates a box in memory
2. Writes `"Aria"` inside it
3. Sticks the label `agent_name` on the outside

**The `=` sign means "store", not "equals."**  
It is a one-way arrow: `box ← value`

---

## The 3 Golden Rules of Variables

| Rule | Description | Example |
|------|-------------|---------|
| **Rule 1** | A variable is just a labeled box | `api_key = "sk-abc123"` |
| **Rule 2** | `=` means *store*, not *equals* | `count = 0` stores zero |
| **Rule 3** | Name variables like they tell a story | `agent_name` not `x` |

---

## The 6 Data Types Every Agent Uses

### 1. `str` — Text Strings

**What it is:** Any text wrapped in quotes.  
**Agent uses:** Names, prompts, API keys, user questions, answers.

```python
agent_name    = "Aria"
api_key       = "sk-abc123xyz"
user_question = "What is the weather in Delhi today?"
system_prompt = "You are a helpful assistant."

# Joining strings (concatenation)
greeting = "Hello, I am " + agent_name   # "Hello, I am Aria"

# f-strings — the most used pattern in agent building!
reply = f"Hi! I'm {agent_name}, your AI assistant."
```

> **Agent Insight:** f-strings (`f"...{variable}..."`) are used everywhere in agents — for building prompts, formatting API calls, and constructing messages dynamically.

---

### 2. `int` — Whole Numbers

**What it is:** Numbers without decimals.  
**Agent uses:** Retry count, token count, step number, loop counters.

```python
max_retries  = 3      # try API 3 times before giving up
max_tokens   = 1000   # max words in agent's response
current_step = 1      # which step in a multi-step plan
retry_count  = 0      # starts at 0, increases on failure

# Agents use ints for loop counters
for attempt in range(max_retries):
    # try calling the API here
    retry_count += 1   # += means "add 1 to itself"
```

> **Agent Insight:** Agents need integers to count retries, track steps, and manage token limits. Every real agent has a retry counter.

---

### 3. `float` — Decimal Numbers

**What it is:** Numbers with decimal points.  
**Agent uses:** Temperature (creativity dial), confidence scores, probabilities.

```python
temperature = 0.7    # creativity: 0=focused, 1=wildly creative
confidence  = 0.92   # how sure the agent is of its answer
top_p       = 0.95   # another LLM sampling parameter

# Used in API calls
response = call_llm(
    prompt=user_message,
    temperature=temperature,
    top_p=top_p
)
```

> **Agent Insight:** `temperature` is the most important float you will use. Set it **low (0.1–0.3)** for factual agents, **higher (0.7–0.9)** for creative ones.

---

### 4. `bool` — True or False

**What it is:** A value that is either `True` or `False`. Nothing else.  
**Agent uses:** Task done? API working? Has memory? Use tools?

```python
task_complete = False   # flips to True when done
has_memory    = True    # does agent remember past chats?
use_tools     = True    # can it use external tools?
api_available = False   # is the API down?

# Booleans power agent decisions
if task_complete:
    print("Done! Here is your answer.")
else:
    print("Still working on it...")
```

> **Agent Insight:** Booleans are the agent's on/off switches. Every decision an agent makes — "should I search?", "am I done?" — comes down to `True` or `False`.

---

### 5. `list` — Ordered Collection

**What it is:** A collection of items in a specific order, inside square brackets `[]`.  
**Agent uses:** Tool list, chat history, search results, multi-step plans.

```python
tools   = ["search", "email", "weather"]
steps   = ["understand", "plan", "act", "respond"]
results = []   # starts empty, agent fills it as it works

# Add to a list
results.append("Delhi weather: 38°C, Sunny")

# Access items (index starts at 0!)
first_tool = tools[0]    # "search"
last_tool  = tools[-1]   # "weather" (last item)

# Loop through all tools
for tool in tools:
    print(f"Agent can use: {tool}")
```

> **Agent Insight:** Lists store the agent's tool belt, search results, and multi-step plans. `results.append()` is how agents collect information as they work through a task.

---

### 6. `dict` — Key:Value Pairs

**What it is:** A collection of labeled data, like a mini-database. Uses curly braces `{}`.  
**Agent uses:** API responses, agent config, memory store, chat messages.

```python
# Storing an API response
weather = {
    "city":        "Delhi",
    "temperature": 38,
    "condition":   "Sunny",
    "humidity":    0.45
}

# Access values by key
city = weather["city"]          # "Delhi"
temp = weather["temperature"]   # 38

# Build an answer from a dict
print(f"It's {weather['temperature']}°C in {weather['city']}")
# Output: "It's 38°C in Delhi"
```

> **Agent Insight:** Dictionaries are how every AI API talks to you. OpenAI, Anthropic, Google — every response comes back as a dict. Learning to read dicts is the **#1 skill** for agent builders.

---

## The Pattern You Will Write 1000 Times

Every single AI API communicates using this exact structure — a **list of dicts**:

```python
# A single message (dict)
message = {
    "role":    "user",
    "content": "What's the weather in Delhi?"
}

# Chat history (list of dicts) — the DNA of every agent
chat_history = [
    {"role": "user",      "content": "Hi Aria!"},
    {"role": "assistant", "content": "Hello! How can I help?"},
    {"role": "user",      "content": "What's the weather in Delhi?"}
]
```

> **This is the most important pattern in all of Agentic AI.** OpenAI, Anthropic, Google Gemini — they all use this exact format. Memorize it.

---

## Full Agent Memory Notebook

Putting it all together — here is what a real agent's startup variables look like:

```python
# ===== AGENT MEMORY NOTEBOOK =====

# Identity (str)
agent_name    = "Aria"
agent_version = "1.0"

# Credentials (str) — keep these secret!
api_key       = "sk-abc123xyz"
model         = "claude-sonnet-4-6"

# Conversation (str)
user_question = "What is the weather in Delhi today?"

# Settings (int + float)
max_retries   = 3
temperature   = 0.7      # creativity dial
max_tokens    = 1000

# State tracking (bool)
task_complete = False
has_memory    = True

# Tools the agent can use (list)
available_tools = [
    "weather_api",
    "web_search",
    "send_email",
    "read_file"
]

# API response stored as dict (agent's "senses")
weather_result = {
    "city":        "Delhi",
    "temperature": 38,
    "condition":   "Sunny",
    "humidity":    0.45
}

# Chat memory — list of dicts (very common pattern)
chat_history = [
    {"role": "user",      "content": "Hi Aria!"},
    {"role": "assistant", "content": "Hello! How can I help?"}
]
```

---

## Quick Reference Table

| Data Type | Example | Agent Use Case |
|-----------|---------|----------------|
| `str` | `"Hello"` | Names, prompts, API keys, responses |
| `int` | `42` | Retry count, token limit, step number |
| `float` | `0.7` | Temperature, confidence score, top_p |
| `bool` | `True` | Task done? Has memory? Use tools? |
| `list` | `["search", "email"]` | Tool belt, chat history, results |
| `dict` | `{"city": "Delhi"}` | API response, config, memory store |

---

## Mini Challenge: Build Your Own Agent Notebook

Write Python variables for **your own agent** using all 6 data types:

```python
# Fill in the blanks with your own values!

# 1. str — give your agent a name and a task
agent_name   = "___"
user_request = "___"

# 2. int — set limits
max_retries  = ___
max_tokens   = ___

# 3. float — set creativity (0.0 to 1.0)
temperature  = ___

# 4. bool — set agent state
task_complete = ___
use_tools     = ___

# 5. list — give it 3 tools
available_tools = ["___", "___", "___"]

# 6. dict — what will it remember?
agent_memory = {
    "user_name":       "___",
    "last_question":   "___",
    "last_answer":     "___"
}

# Bonus: print a greeting using an f-string
print(f"___")
```

---

## Key Takeaways

- Variables are labeled boxes that store information — the agent's memory
- Python has 6 essential data types for agent building: `str`, `int`, `float`, `bool`, `list`, `dict`
- The `list of dicts` pattern (`chat_history`) is the universal format for AI APIs
- `f-strings` are how agents build dynamic prompts and messages
- `temperature` (float) controls creativity — low for facts, high for creativity
- `bool` variables are the agent's on/off decision switches

---

## What's Next: Module 2 — Functions

Now that your agent has a **memory** (variables), it needs **hands** — the ability to *do* things.

In **Module 2**, we'll build **functions**, which are reusable actions your agent can call like tools:

- `search_web(query)` — search the internet
- `call_api(endpoint, params)` — call any external API
- `send_email(to, subject, body)` — take action in the world
- `remember(key, value)` — save something to memory

> Functions are where your agent stops being a notebook and starts being an **agent**.

---

*Module 1 of 10 — Agentic AI Python Academy*  
*Next: Module 2 — Functions (The Building Blocks of Agent Tools)*