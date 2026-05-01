# Understanding `simple_agent01.py`

```python
import json
from openai import OpenAI

# 1. Connect to Local AI
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# 2. Our Single Tool
def calculate(expression):
    return str(eval(expression))

# 3. Tell AI about our tool
tools = [{
    "type": "function",
    "function": {
        "name": "calculate",
        "description": "Perform math",
        "parameters": {
            "type": "object",
            "properties": {"expression": {"type": "string"}}
        }
    }
}]

# 4. Ask the AI a question
messages = [{"role": "user", "content": "What is 150 * 12?"}]
response = client.chat.completions.create(model="qwen2.5-coder:3b", messages=messages, tools=tools)
ai_msg = response.choices[0].message

# 5. Check if AI wants to use the tool
if ai_msg.tool_calls:
    tool_call = ai_msg.tool_calls[0] # Get the first tool it asked for
    args = json.loads(tool_call.function.arguments)
    
    # Run our tool
    result = calculate(args["expression"])
    
    # Give the result back to the AI
    messages.append(ai_msg)
    messages.append({"role": "tool", "tool_call_id": tool_call.id, "content": result})
    
    final_response = client.chat.completions.create(model="qwen2.5-coder:3b", messages=messages)
    print("FINAL ANSWER:", final_response.choices[0].message.content)
else:
    print("FINAL ANSWER:", ai_msg.content)

```

This document provides a simple, line-by-line explanation of our minimalist AI Agent script. 

An "Agent" is just an AI that can **use tools** (like a calculator or fetching the weather) to help answer your questions, instead of just guessing!

Here is how the code works, broken down step-by-step.

---

### Step 1: Connect to the AI
```python
import json
from openai import OpenAI

# 1. Connect to Local AI
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
```
- **`import json`**: Brings in a tool to read JSON (which is just a way computers format text).
- **`from openai import OpenAI`**: We are using the official OpenAI library because it's the industry standard for talking to AI.
- **`client = OpenAI(...)`**: We connect to our local Ollama AI running on our computer (`localhost:11434`). If we wanted to use real ChatGPT, we would just put our real OpenAI API key here instead!

---

### Step 2: Our Single Tool
```python
# 2. Our Single Tool
def calculate(expression):
    return str(eval(expression))
```
- **`def calculate(expression):`**: We create a standard Python function. This is the "tool" the AI will be allowed to use.
- **`return str(eval(expression))`**: It takes a math problem (like `"150 * 12"`), solves it, and returns the answer as text. 

---

### Step 3: Tell AI about our tool
```python
# 3. Tell AI about our tool
tools = [{
    "type": "function",
    "function": {
        "name": "calculate",
        "description": "Perform math",
        "parameters": {
            "type": "object",
            "properties": {"expression": {"type": "string"}}
        }
    }
}]
```
- **`tools = [...]`**: The AI doesn't automatically know our Python code exists. We have to write a "manual" describing our tool.
- **`"name": "calculate"`**: The exact name of our function.
- **`"description": "Perform math"`**: We tell the AI *when* it should use this tool (e.g., when the user asks a math question).
- **`"properties": {"expression": ...}`**: We tell the AI what input it needs to provide to the tool.

---

### Step 4: Ask the AI a question
```python
# 4. Ask the AI a question
messages = [{"role": "user", "content": "What is 150 * 12?"}]
response = client.chat.completions.create(model="qwen2.5-coder:3b", messages=messages, tools=tools)
ai_msg = response.choices[0].message
```
- **`messages = [...]`**: We package our question for the AI.
- **`client.chat.completions.create(...)`**: We send the AI three things: the model name, our question, AND the manual for our `tools`.
- **`ai_msg = ...`**: We grab the AI's response. Instead of answering the question directly, the AI will say, *"Wait, I need to use the calculator tool first!"*

---

### Step 5: Check if AI wants to use the tool
```python
# 5. Check if AI wants to use the tool
if ai_msg.tool_calls:
    tool_call = ai_msg.tool_calls[0] # Get the first tool it asked for
    args = json.loads(tool_call.function.arguments)
```
- **`if ai_msg.tool_calls:`**: We check if the AI decided to use a tool.
- **`tool_call = ai_msg.tool_calls[0]`**: We look at the specific tool it requested.
- **`args = json.loads(...)`**: We extract the input the AI gave us (which should be `{"expression": "150 * 12"}`).

```python
    # Run our tool
    result = calculate(args["expression"])
```
- **`calculate(...)`**: We physically run the Python tool on our computer and get the result (`1800`).

```python
    # Give the result back to the AI
    messages.append(ai_msg)
    messages.append({"role": "tool", "tool_call_id": tool_call.id, "content": result})
```
- **`messages.append(...)`**: We update our conversation history to include:
  1. The AI's request to use the tool.
  2. The actual result (`1800`) from the tool. 

```python
    final_response = client.chat.completions.create(model="qwen2.5-coder:3b", messages=messages)
    print("FINAL ANSWER:", final_response.choices[0].message.content)
```
- **`final_response = ...`**: We send the entire history back to the AI. Now the AI sees the math result!
- **`print(...)`**: The AI finally reads the result and gives us a nice human sentence like *"The answer is 1800."*

```python
else:
    print("FINAL ANSWER:", ai_msg.content)
```
- **`else:`**: If the user asked a non-math question (like *"Hello"*), the AI wouldn't use a tool, and we just print its answer immediately.

```python
import json
import re
from openai import OpenAI

# ==========================================
# 1. Setup & Connection
# ==========================================
# We connect to our local AI (Ollama) instead of the real OpenAI servers.
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# ==========================================
# 2. Define Our Tool (A simple calculator)
# ==========================================
def calculate(expression):
    """Evaluates a math expression and returns the result as a string."""
    return str(eval(expression))

# ==========================================
# 3. Create the "Manual" for the AI
# ==========================================
# This tells the AI what tools it has, what they are called, and how to use them.
calculator_tool = {
    "type": "function",
    "function": {
        "name": "calculate",
        "description": "Use this tool to perform math calculations.",
        "parameters": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string", 
                    "description": "The math expression (e.g. '150 * 12')"
                }
            }
        }
    }
}
tools = [calculator_tool]

# ==========================================
# Helper Function for Clean Output
# ==========================================
def print_final_answer(text):
    """Removes weird math formatting slashes and prints the final answer."""
    clean_text = text.replace(r"\(", "").replace(r"\)", "")
    print("FINAL ANSWER:", clean_text)

# ==========================================
# 4. Start the Conversation
# ==========================================
# We ask the AI a math question. 
conversation_history = [{"role": "user", "content": "What is 150 * 12?"}]

# Send the question AND the tool manual to the AI
response = client.chat.completions.create(
    model="qwen2.5-coder:3b", 
    messages=conversation_history, 
    tools=tools
)

# Get the AI's first reply
ai_reply = response.choices[0].message


# ==========================================
# 5. Handle the AI's Response
# ==========================================

# SCENARIO A: The AI perfectly used the official "tool_calls" structure
if ai_reply.tool_calls:
    tool_request = ai_reply.tool_calls[0]
    
    # 1. Read what math problem the AI wants us to solve
    arguments = json.loads(tool_request.function.arguments)
    math_problem = arguments["expression"]
    
    # 2. Run the tool on our computer
    tool_result = calculate(math_problem)
    
    # 3. Add the AI's request and our tool's result to the history
    conversation_history.append(ai_reply)
    conversation_history.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    })
    
    # 4. Let the AI read the result and give us the final answer
    final_response = client.chat.completions.create(
        model="qwen2.5-coder:3b", 
        messages=conversation_history
    )
    print_final_answer(final_response.choices[0].message.content)

# SCENARIO B: The local AI messed up and just output raw JSON text
else:
    try:
        # Sometimes local models wrap JSON in markdown blocks (```json ... ```)
        # We strip that out so we can read it.
        clean_json_text = re.sub(r"```(json)?\n?|\n?```", "", ai_reply.content.strip()).strip()
        hidden_tool_request = json.loads(clean_json_text)
        
        # Did we find a hidden tool request?
        if "name" in hidden_tool_request and "arguments" in hidden_tool_request:
            args = hidden_tool_request["arguments"]
            
            # Extract the math problem (handling slightly weird formatting from local models)
            if isinstance(args.get("expression"), dict):
                math_problem = args["expression"]["value"] 
            else:
                math_problem = args.get("expression")
                
            # Run the tool
            tool_result = calculate(math_problem)
            
            # Mock the conversation history to pretend we used the official tool structure
            conversation_history.append({"role": "assistant", "content": ai_reply.content})
            conversation_history.append({
                "role": "user", 
                "content": f"The calculate tool returned: {tool_result}. Please summarize this for the user."
            })
            
            # Ask the AI for the final answer
            final_response = client.chat.completions.create(
                model="qwen2.5-coder:3b", 
                messages=conversation_history
            )
            print_final_answer(final_response.choices[0].message.content)
            
        else:
            # It was valid JSON, but not a tool call. Just print it.
            print_final_answer(ai_reply.content)
            
    except Exception:
        # SCENARIO C: The AI just answered normally in plain text (no tools needed)
        print_final_answer(ai_reply.content)

```