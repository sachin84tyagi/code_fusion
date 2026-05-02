# Module 7: The Unbreakable Agent (Error Handling & Secrets)

Welcome to the final module of our Python for Agentic AI course! 🛡️

In the real world, things go wrong. Servers crash, APIs go offline, and LLMs sometimes hallucinate garbage data. If your agent crashes the moment it hits a bump in the road, it's not a very good agent!

To build "Production-Grade" agents, we need to learn **Error Handling** and how to manage **Secrets**.

---

## 🛡️ 1. Error Handling (`try` / `except`)
In Python, we can "catch" errors before they crash our script. This is like giving your robot a safety net.

We use a `try` block to run our code, and an `except` block to tell the robot what to do if something fails.

```python
try:
    # Attempting something risky
    result = 10 / 0
except ZeroDivisionError:
    # What to do if it fails
    print("Oops! You can't divide by zero.")
    result = 0
```

In Agentic AI, we use this to handle tool failures. If a "Search Tool" fails, the agent can catch the error and tell the LLM: "Sorry, I couldn't search right now, let's try another way."

## 🔑 2. Environment Variables (Keeping Secrets)
You should **NEVER** type your API keys directly into your code. If you upload that code to GitHub, hackers will steal your keys and spend your money! 💸

Instead, we use a `.env` file to store our secrets and the `os.getenv()` function to read them.

```python
import os

# This looks for a secret named 'API_KEY' in your computer's environment
my_secret_key = os.getenv("MY_API_KEY")

print(f"Loaded key: {my_secret_key}")
```

---

## 🚀 Let's Build an Unbreakable Agent!

We are going to build a "Robust Agent" that has a broken tool. We will see how it uses `try/except` to stay alive and keep working even when its tools fail!

Create a file named `07_robust_agent.py` in your `Python_For_AI_Course` folder.

```python
"""
==================================================
 MODULE 7: THE UNBREAKABLE AGENT
==================================================
In this script, we learn how to handle errors 
gracefully and how to manage secret configuration
using environment variables.
"""

from openai import OpenAI
import json
import os

# ---------------------------------------------------------
# 1. THE BROKEN TOOL (Simulating a Failure)
# ---------------------------------------------------------
def risky_tool(data: str) -> str:
    print(f"\n   [⚠️ TOOL] Attempting to process: {data}")
    
    # We wrap our tool in a 'try' block to prevent a crash!
    try:
        # Let's simulate a crash if the user says 'crash'
        if "crash" in data:
            raise ValueError("The tool's engine exploded! 💥")
            
        return f"Tool successfully processed: {data}"
        
    except Exception as e:
        # Instead of crashing the whole script, we return the error as text!
        return f"TOOL ERROR: {str(e)}"

# ---------------------------------------------------------
# 2. SECURE CONFIGURATION
# ---------------------------------------------------------
# We pretend to load our URL and Key from environment variables
# In a real app, you would use a .env file!
BASE_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/v1")
API_KEY = os.getenv("OLLAMA_KEY", "ollama")

client = OpenAI(base_url=BASE_URL, api_key=API_KEY)

# ---------------------------------------------------------
# 3. THE ROBUST LOOP
# ---------------------------------------------------------
tools_manual = [{
    "type": "function",
    "function": {
        "name": "risky_tool",
        "description": "A tool that might fail sometimes.",
        "parameters": {
            "type": "object",
            "properties": {"data": {"type": "string"}},
            "required": ["data"]
        }
    }
}]

print("🤖 Testing the Unbreakable Agent...")

# We tell the AI to purposefully try to crash the tool
messages = [{"role": "user", "content": "Please try to use the risky_tool with the input 'crash me now'."}]

response = client.chat.completions.create(
    model="llama3.2",
    messages=messages,
    tools=tools_manual
)

if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    
    # Run the tool safely!
    result = risky_tool(args.get("data", ""))
    print(f"✅ Result: {result}")
    
    # We give the ERROR back to the AI so it can figure out what to do!
    messages.append(response.choices[0].message)
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": result
    })
    
    final_response = client.chat.completions.create(
        model="llama3.2",
        messages=messages
    )
    
    print("\n🤖 AI'S RECOVERY RESPONSE:")
    print(final_response.choices[0].message.content)

print("\n🛡️ Script finished without crashing!")
```
