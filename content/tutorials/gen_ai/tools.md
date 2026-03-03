# Phase 6: LLM Engineering (Real Systems) - Step 3 (Tool Use / Function Calling)

How does ChatGPT know the current weather? Or how does an AI Agent book a flight? 
The AI doesn't "know" these things. It uses **Tools**.

This is called **Function Calling** (or Tool Use).

---

## 1. The Analogy: The Phone Operator
Imagine the AI is a **Phone Operator**. 
- It can't visit the grocery store itself.
- But it has a list of **Phone Numbers** (Tools) it can call.
- If a user asks for milk, the AI doesn't draw a picture of milk; it looks at its list, sees the "Grocery Store" number, and tells you: *"Please call the store and ask for 1 gallon of milk."*

## 2. How it works technically
You provide the AI with a **JSON description** of your Python functions.
1.  **User asks:** "What is 15% of 850?"
2.  **AI thinks:** "I'm bad at math, but I have a `calculate_percentage` tool."
3.  **AI output:** Instead of text, it returns a special **Tool Call** object: `{"function": "calculate_percentage", "args": {"percentage": 15, "value": 850}}`.
4.  **Your code:** You see that object, run the real Python function, and give the result back to the AI.

---

## 3. The Coding Exercise (Hands-on)

We are going to build a script where the AI "calls" a custom Python function to get the current stock price.

#### Step 1: The "Function Calling" script
Create a file named `function_calling.py` inside your `Phase6` folder:

```python
import json

# 1. Our REAL Python tool
def get_stock_price(ticker):
    # In reality, this would call a Finance API
    data = {"AAPL": 175.50, "GOOGL": 142.10, "TSLA": 190.30}
    return str(data.get(ticker.upper(), "Ticker not found"))

# 2. Telling the AI about the tool (The 'Instruction Manual')
tools_description = [
    {
        "type": "function",
        "function": {
            "name": "get_stock_price",
            "description": "Get the current stock price of a company",
            "parameters": {
                "type": "object",
                "properties": {
                    "ticker": {"type": "string", "description": "The stock symbol, e.g. AAPL"}
                },
                "required": ["ticker"]
            }
        }
    }
]

def simulate_ai_tool_call(user_query):
    print(f"\n[USER]: {user_query}")

    # SIMULATION: AI identifies it needs a tool
    # In a real API call, the AI would return this JSON automatically.
    if "aapl" in user_query.lower():
        tool_call = {"name": "get_stock_price", "args": {"ticker": "AAPL"}}
        
        print(f"🤖 AI: I need to use a tool: {tool_call['name']}")
        
        # YOUR CODE: Execute the function
        result = get_stock_price(tool_call['args']['ticker'])
        print(f"🔧 TOOL RESULT: {result}")
        
        # FINAL STEP: Give result back to AI to summarize
        print(f"🤖 AI: The current price of Apple is ${result}.")
    else:
        print("🤖 AI: I don't need a tool for that.")

# Test it
simulate_ai_tool_call("What is the price of Apple right now?")
```

---

## 4. Why this matters (Production Insight)
Function calling is the "Hands" of the AI. It allows an LLM to:
- Delete a file.
- Send an Email.
- Query a SQL Database.
- Interact with your private internal APIs.

**The Golden Security Rule:** The AI never *commands* your computer. It *requests* a function, and **your code** decides whether to run it.

---
**Summary:**
- **Function Calling:** AI requesting an external action.
- **Tool Definition:** Telling the AI "what" a function does.
- **Agency:** Moving from "Talking" to "Doing."

**Next Step:** We'll see why we use Frameworks to manage all this: [LangChain / LlamaIndex / DSPy overview](file:///d:/myFirstAITest/Phase6/phase6_frameworks.md). 🚀
