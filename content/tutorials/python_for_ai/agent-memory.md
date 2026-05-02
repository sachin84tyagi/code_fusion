# Module 4: The Agent's Memory (JSON & File Handling)

Welcome to Module 4! 🧠

If you close your Python script right now, everything the AI "learned" or "said" is gone forever. In the world of AI, we call this the **Stateless** problem. It's like the AI has the memory of a goldfish! 🐟

To build real agents that can manage projects, remember your preferences, or keep a to-do list, we need to teach them how to use **Files** and **JSON**.

---

## 📄 1. File Handling (The AI's Notebook)
Python can "open" files on your computer just like you open a notebook. We use the `with open()` command.

*   **'w' (Write):** Overwrites the file with new notes.
*   **'a' (Append):** Adds a new note to the end of the existing ones.
*   **'r' (Read):** Reads the notebook to remember what was written.

```python
# Saving a note
with open("memory.txt", "w") as file:
    file.write("User likes the color Blue.")

# Reading a note
with open("memory.txt", "r") as file:
    print(file.read())
```

## 📦 2. JSON (The AI's Filing Cabinet)
While a `.txt` file is just messy text, a **JSON** file is organized. It stands for **JavaScript Object Notation**, but don't let the name fool you—it's the universal language of AI.

Remember **Dictionaries** from Module 1? JSON is just a way to save those dictionaries into a file.

```python
import json

# A dictionary (The AI's structured thought)
data = {"user": "Sachi", "task": "Learn Python", "progress": "Module 4"}

# Saving it as JSON (Structured Note)
with open("data.json", "w") as f:
    json.dump(data, f)
```

---

## 🚀 Let's Build a Memory Agent!

We are going to build an agent that can **Save Notes** and **Read Notes**. This gives the agent a "Long-Term Memory" that survives even if you turn off your computer!

Create a file named `04_memory_agent.py` in your `Python_For_AI_Course` folder.

```python
"""
==================================================
 MODULE 4: THE AGENT'S MEMORY
==================================================
In this script, we teach an AI to read and write
to its own 'memory' file so it never forgets.
"""

from openai import OpenAI
import json
import os

# The path to our AI's "Notebook"
MEMORY_FILE = "agent_memory.json"

# ---------------------------------------------------------
# 1. TOOL: Save information to memory
# ---------------------------------------------------------
def save_to_memory(topic: str, info: str) -> str:
    print(f"\n   [🧠 MEMORY] Saving: {topic} -> {info}")
    
    # First, read existing memory if it exists
    memory = {}
    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE, "r") as f:
                memory = json.load(f)
        except:
            memory = {}
    
    # Add the new info
    memory[topic] = info
    
    # Save it back to the file
    with open(MEMORY_FILE, "w") as f:
        json.dump(memory, f, indent=4)
        
    return f"Successfully remembered that {topic} is {info}."

# ---------------------------------------------------------
# 2. TOOL: Read information from memory
# ---------------------------------------------------------
def read_from_memory(topic: str) -> str:
    print(f"\n   [🧠 MEMORY] Searching for: {topic}")
    
    if not os.path.exists(MEMORY_FILE):
        return "Memory is currently empty."
        
    try:
        with open(MEMORY_FILE, "r") as f:
            memory = json.load(f)
    except:
        return "Memory file is corrupted or empty."
        
    result = memory.get(topic, "I don't remember that yet.")
    return f"The information for {topic} is: {result}"

# ---------------------------------------------------------
# 3. AI CONFIGURATION
# ---------------------------------------------------------
tools_manual = [
    {
        "type": "function",
        "function": {
            "name": "save_to_memory",
            "description": "Save a piece of information about the user.",
            "parameters": {
                "type": "object",
                "properties": {
                    "topic": {"type": "string"},
                    "info": {"type": "string"}
                },
                "required": ["topic", "info"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "read_from_memory",
            "description": "Retrieve information you saved earlier.",
            "parameters": {
                "type": "object",
                "properties": {
                    "topic": {"type": "string"}
                },
                "required": ["topic"]
            }
        }
    }
]

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# ---------------------------------------------------------
# 4. THE PRACTICAL TEST
# ---------------------------------------------------------
system_msg = {"role": "system", "content": "You are a helpful memory assistant. Use your tools to save and read facts. Only provide the requested info."}

print("🤖 Telling the AI a fact to remember...")

messages = [
    system_msg,
    {"role": "user", "content": "My name is Sachi and my favorite food is Pizza. Please remember this."}
]

# Step 1: AI decides to Save
response = client.chat.completions.create(
    model="llama3.2",
    messages=messages,
    tools=tools_manual
)

# Process tool calls
if response.choices[0].message.tool_calls:
    for tool_call in response.choices[0].message.tool_calls:
        args = json.loads(tool_call.function.arguments)
        if tool_call.function.name == "save_to_memory":
            # Handle possible nested hallucinations
            topic = args.get("topic")
            if isinstance(topic, dict): topic = topic.get("value") or topic.get("topic")
            info = args.get("info")
            if isinstance(info, dict): info = info.get("value") or info.get("info")
            
            result = save_to_memory(str(topic), str(info))
            print(result)

print("\n🤖 Now asking the AI to retrieve that memory...")

messages = [
    system_msg,
    {"role": "user", "content": "What is my favorite food?"}
]

# Step 2: AI decides to Read
response = client.chat.completions.create(
    model="llama3.2",
    messages=messages,
    tools=tools_manual
)

# Process tool calls
if response.choices[0].message.tool_calls:
    for tool_call in response.choices[0].message.tool_calls:
        args = json.loads(tool_call.function.arguments)
        if tool_call.function.name == "read_from_memory":
            topic = args.get("topic")
            if isinstance(topic, dict): topic = topic.get("value") or topic.get("topic")
            
            result = read_from_memory(str(topic))
            print(f"Agent Memory Output: {result}")
```

