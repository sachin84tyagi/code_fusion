# Module 3: The Agent's Logic (Conditionals & Loops)

Welcome to Module 3! So far, our AI agents have been one-hit wonders. We ask them a question, they use a tool once, and the script ends. 

But what if the tool fails? What if the AI needs to try multiple times to solve a complex problem? To build truly autonomous agents, we need **Logic**. 

In Python, Logic is handled by **Conditionals** (`if/else`) and **Loops** (`while`).

---

## 🚦 1. Conditionals (`if` / `else`)
Conditionals are decision-making crossroads. They tell the script: "If something is true, do Action A. Otherwise, do Action B."

In Agentic AI, we use `if/else` constantly to check what the AI decided to do.

```python
# Did the AI decide to use a tool?
if ai_reply.tool_calls:
    # Yes! Run the tool!
    print("Running the tool...")
else:
    # No! Just print the text response!
    print("The AI said: " + ai_reply.content)
```

## 🔄 2. Loops (`while`)
A `while` loop repeats a block of code over and over again as long as a certain condition is true. 

This is the secret sauce of **Autonomous Agents**. We can put our AI inside a `while` loop and tell it: "Keep thinking and using tools until the problem is solved!" This is known as the **Think ➔ Act ➔ Observe** loop.

```python
# A simple while loop
attempts = 0

while attempts < 3:
    print("Trying to solve the problem...")
    attempts = attempts + 1 # Add 1 to the attempts so it eventually stops!
```

---

## 🚀 Let's Build an Autonomous Loop!

We are going to build a script where we challenge the AI to guess a secret number between 1 and 5. We will give the AI a `check_guess` tool and put it inside a `while` loop. 

The AI will autonomously loop, guessing numbers, checking the tool, and trying again until it gets it right!

Create a file named `03_decision_loop.py` in your `Python_For_AI_Course` folder.

```python
"""
==================================================
 MODULE 3: THE AGENT'S LOGIC
==================================================
In this script, we teach an AI to work autonomously.
We put the AI inside a 'while' loop so it can keep 
guessing a secret number until it wins!
"""

from openai import OpenAI
import json

# ---------------------------------------------------------
# 1. THE SECRET NUMBER TOOL
# ---------------------------------------------------------
SECRET_NUMBER = 3

def check_guess(guess) -> str:
    print(f"\n   [⚙️ TOOL RUNNING] Checking if {guess} is correct...")
    
    # We use 'if/else' to give the AI feedback!
    # We convert the guess to an integer just in case the AI handed us a String!
    if int(guess) == SECRET_NUMBER:
        return "Correct! You won!"
    else:
        return "Wrong guess. Try a different number."

tools_manual = [{
    "type": "function",
    "function": {
        "name": "check_guess",
        "description": "Use this to guess the secret number.",
        "parameters": {
            "type": "object",
            "properties": {"guess": {"type": "integer"}},
            "required": ["guess"]
        }
    }
}]

# ---------------------------------------------------------
# 2. SETTING UP THE AUTONOMOUS LOOP
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# We give the AI its initial instructions
chat_memory = [{"role": "user", "content": "I am thinking of a number between 1 and 5. Use your check_guess tool to guess it. Keep guessing until you get it right!"}]

solved = False
attempts = 0

print("🤖 Starting the Autonomous Agent Loop...")

# ---------------------------------------------------------
# 3. THE 'WHILE' LOOP (Think -> Act -> Observe)
# ---------------------------------------------------------
# Keep looping WHILE the problem is not solved, BUT stop if it takes more than 5 tries!
while solved == False and attempts < 5:
    
    attempts = attempts + 1
    print(f"\n--- Attempt #{attempts} ---")
    
    # Let the AI Think!
    response = client.chat.completions.create(
        model="llama3.2",
        messages=chat_memory,
        tools=tools_manual
    )
    
    ai_reply = response.choices[0].message
    chat_memory.append(ai_reply) # Save its thought to memory
    
    # Did it use the tool?
    if ai_reply.tool_calls:
        tool_request = ai_reply.tool_calls[0]
        arguments = json.loads(tool_request.function.arguments)
        
        # Grab the AI's guess
        ai_guess = arguments["guess"]
        
        # Act! Run the tool!
        tool_result = check_guess(ai_guess)
        
        # Save the observation back to memory so the AI learns from it!
        chat_memory.append({"role": "tool", "tool_call_id": tool_request.id, "content": tool_result})
        
        # ---------------------------------------------------------
        # 4. THE CONDITIONAL ('IF') TO BREAK THE LOOP
        # ---------------------------------------------------------
        if "Correct" in tool_result:
            print("\n🎉 The AI solved the puzzle!")
            solved = True # This tells the 'while' loop to stop!
        else:
            print("❌ The AI guessed wrong. It will try again.")
            
    else:
        # If the AI starts talking instead of guessing, we print its message
        print("\nThe AI says: " + str(ai_reply.content))

print("\n🏁 Loop Finished!")
```
