# Module 2: The Agent's Tools (Functions)

Welcome to Module 2! In the last lesson, we learned the Agent's Vocabulary (Variables). Now, it is time to give our Agent hands! 🤲

In traditional programming, a **Function** is just a reusable block of code. But in the world of Agentic AI, functions are **Tools**. 

When an AI wants to search the web, calculate a math problem, or turn on the lights in your house, it cannot do it with its brain alone. It has to reach out and trigger a Python function that you wrote!

---

## 🛠️ Defining a Function (Building a Tool)
To build a tool in Python, we use the magic word `def` (which stands for "define"). 

Every tool has three parts:
1. **The Name:** What the tool is called.
2. **The Arguments (Inputs):** The specific data the tool needs to do its job.
3. **The Return (Output):** What the tool hands back to the AI when it's done.

```python
# 1. 'def' creates the tool
# 2. 'add_numbers' is the name
# 3. (num1, num2) are the arguments it needs
def add_numbers(num1, num2):
    
    # The tool does the math
    answer = num1 + num2
    
    # 4. 'return' gives the answer back to the AI
    return answer
```

## 📦 Using the Tool
Once you build the tool, the AI can "call" it. Calling a tool means handing it the arguments it needs and waiting for the return value.

```python
# The AI hands the tool a 5 and a 10
result = add_numbers(5, 10)

print(result) # Prints: 15
```

## 📝 Type Hinting (Helping the AI)
AI Agents are very smart, but they need to know *exactly* what kind of arguments to hand to your tool. If your tool expects Integers but the AI hands it Strings, the tool will crash!

We use **Type Hints** to tell the AI exactly what data types to use.

```python
# We tell the AI: "num1 must be a float, and I will return a string!"
def calculate_discount(price: float, discount: float) -> str:
    savings = price * (discount / 100)
    return f"You saved ${savings}!"
```

---

## 🚀 Let's Build Our Tool Builder!

We are going to write a script that defines two distinct tools: A Math Tool and a Search Tool. We will then see how the AI calls them!

Create a file named `02_tool_builder.py` in your `Python_For_AI_Course` folder.

```python
"""
==================================================
 MODULE 2: THE AGENT'S TOOLS (FUNCTIONS)
==================================================
In this script, we will define Python functions and
see how they act as the physical "hands" for an AI Agent.
"""

from openai import OpenAI
import json

# ---------------------------------------------------------
# 1. BUILDING TOOL #1 (The Math Hands)
# ---------------------------------------------------------
# We use 'def' to create the tool. We use type hints (float) 
# to ensure the AI hands us numbers, not text!
def multiply_numbers(num1: float, num2: float) -> str:
    print(f"\n   [⚙️ TOOL RUNNING] Multiplying {num1} by {num2}...")
    answer = num1 * num2
    return f"The mathematical answer is {answer}."

# ---------------------------------------------------------
# 2. BUILDING TOOL #2 (The Weather Hands)
# ---------------------------------------------------------
# This tool expects a String (the name of the city).
def check_weather(city_name: str) -> str:
    print(f"\n   [☁️ TOOL RUNNING] Looking up the weather for {city_name}...")
    
    # In a real app, this would check the internet!
    if "London" in city_name:
        return f"It is raining in {city_name}."
    else:
        return f"It is sunny in {city_name}."

# ---------------------------------------------------------
# 3. WRITING THE INSTRUCTION MANUALS
# ---------------------------------------------------------
# The AI cannot see our Python code. We have to describe our 
# tools to the AI using Dictionaries (from Module 1!)
tools_manual = [
    {
        "type": "function",
        "function": {
            "name": "multiply_numbers",
            "description": "Use this to multiply two numbers together.",
            "parameters": {
                "type": "object",
                "properties": {
                    "num1": {"type": "number"},
                    "num2": {"type": "number"}
                },
                "required": ["num1", "num2"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "check_weather",
            "description": "Use this to check the weather in a specific city.",
            "parameters": {
                "type": "object",
                "properties": {
                    "city_name": {"type": "string"}
                },
                "required": ["city_name"]
            }
        }
    }
]

# ---------------------------------------------------------
# 4. TESTING THE TOOLS!
# ---------------------------------------------------------
print("🤖 Asking the AI a math question...")

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# We ask the AI to do math.
messages = [{"role": "user", "content": "What is 45 multiplied by 12?"}]

response = client.chat.completions.create(
    model="llama3.2",
    messages=messages,
    tools=tools_manual # We hand the manuals to the AI!
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# 5. WATCHING THE AI USE THE TOOL
# ---------------------------------------------------------
if ai_reply.tool_calls:
    print("\n💡 The AI decided it needs a tool to answer this!")
    
    # 1. Grab the tool request
    tool_request = ai_reply.tool_calls[0]
    
    # 2. Extract the arguments (the Strings/Floats the AI gave us)
    arguments = json.loads(tool_request.function.arguments)
    
    # 3. Check WHICH tool the AI wants to use
    if tool_request.function.name == "multiply_numbers":
        # The AI is calling our Math Tool!
        result = multiply_numbers(arguments["num1"], arguments["num2"])
        print(f"\n✅ The tool handed back: {result}")
        
    elif tool_request.function.name == "check_weather":
        # The AI is calling our Weather Tool!
        result = check_weather(arguments["city_name"])
        print(f"\n✅ The tool handed back: {result}")
        
else:
    print("\n🤖 The AI answered without tools:")
    print(ai_reply.content)
```
