# 🤖 Agentic AI — A Beginner's Complete Guide

> **Your professor:** A Generative AI Senior Engineer with 20+ years of experience.
> **Your level:** Complete beginner. No experience needed.
> **Goal:** Understand and build your first AI Agent from scratch.

---

## 🧠 What is an Agentic AI?

Imagine you ask a very smart friend: *"What is 247 times 38?"*

A **normal chatbot** might just guess from memory.

An **AI Agent** thinks: *"I have a calculator tool. Let me USE it to get the exact answer!"* — then it uses the tool, reads the result, and gives you a perfect answer.

That's the magic: **the agent decides when and how to use tools on its own.**

---

## 🗺️ The Agent Decision Loop

![Agent Decision Loop](/images/decision-loop.jpg)

```
┌─────────────┐     question      ┌──────────────────┐     think      ┌──────────────┐
│  You (User) │ ────────────────▶ │  Agent Brain     │ ────────────▶ │  Need tool?  │
│ Ask a question│                  │  (LLM / Claude)  │               │  (Decision)  │
└─────────────┘                   │  Thinks + decides│               └──────┬───────┘
                                  │  what to do next │                      │
                                  └──────────────────┘              ┌───────┴────────┐
                                           ▲                        │                │
                                           │                      YES               NO
                                           │                        │                │
                                    Tool result                     ▼                ▼
                                           │               ┌──────────────┐  ┌─────────────┐
                                           └───────────────│     Tool     │  │ Final Answer│
                                                           │  Calculator, │  │  ✅ Done!   │
                                                           │  Search, etc.│  └─────────────┘
                                                           └──────────────┘
```

> **How an Agent is different from a regular chatbot:**
> A regular chatbot just answers. An agent **THINKS → DECIDES → ACTS → OBSERVES → REPEATS** until done.

---

## 🛠️ Let's Build One — Step by Step

We'll build an agent that:
- Gets a math question from you
- **Decides** if it needs the calculator tool
- **Uses** the tool if needed
- **Returns** the final answer

---

## 💻 Example 1 - Calculator Agent - Full Working Code (Every Line Explained)

```python
# ============================================================
# 🤖 MY FIRST AI AGENT - Calculator Agent
# ============================================================

# STEP 1: Import the Anthropic library
# Think of this like importing a "phone" so we can call Claude
import anthropic

# STEP 2: Create the Anthropic client
# This is like "turning on the phone" so we can talk to Claude
client = anthropic.Anthropic()
# Note: Your API key is automatically read from the environment variable
# ANTHROPIC_API_KEY. You set this once on your computer.


# ============================================================
# STEP 3: Define our Tool — the Calculator
# ============================================================
# A "tool" is just a description we give Claude so it knows:
#   - What the tool is called
#   - What it does
#   - What information it needs from us to work

tools = [
    {
        "name": "calculator",           # The tool's name (Claude will call it by this name)
        "description": "A simple calculator that can add, subtract, multiply, or divide two numbers. Use this whenever the user asks a math question.",
        # ↑ This description is KEY — Claude reads this to decide WHEN to use the tool

        "input_schema": {               # This tells Claude WHAT to send to the tool
            "type": "object",
            "properties": {
                "operation": {
                    "type": "string",
                    # ↓ Claude must pick one of these four operations
                    "enum": ["add", "subtract", "multiply", "divide"],
                    "description": "The math operation to perform"
                },
                "number1": {
                    "type": "number",   # A regular number (like 10 or 3.14)
                    "description": "The first number"
                },
                "number2": {
                    "type": "number",
                    "description": "The second number"
                }
            },
            "required": ["operation", "number1", "number2"]
            # ↑ All three fields are required. Claude can't skip any of them.
        }
    }
]


# ============================================================
# STEP 4: Define the ACTUAL calculator function
# ============================================================
# This is the REAL Python code that does the math.
# Claude describes WHAT to calculate — Python actually DOES it.

def run_calculator(operation, number1, number2):
    """This function actually does the math."""

    if operation == "add":
        result = number1 + number2
    elif operation == "subtract":
        result = number1 - number2
    elif operation == "multiply":
        result = number1 * number2
    elif operation == "divide":
        if number2 == 0:
            # Special case: you can't divide by zero!
            return "Error: Cannot divide by zero!"
        result = number1 / number2
    else:
        return "Error: Unknown operation"

    # Return a nice human-readable string
    return f"The result of {number1} {operation} {number2} = {result}"


# ============================================================
# STEP 5: The Agent Loop — the BRAIN of our agent
# ============================================================
# This is where the magic happens!
# The agent keeps thinking and acting until it has a final answer.

def run_agent(user_question):
    """
    This function runs our AI agent.
    Give it a question, it figures out the answer.
    """

    print(f"\n🧑 You asked: {user_question}")
    print("-" * 50)

    # Start the conversation — just one message from the user
    messages = [
        {"role": "user", "content": user_question}
    ]

    # ── The Agent Loop ──────────────────────────────────────
    # We use a while loop because the agent might need to:
    #   1. Think
    #   2. Use a tool
    #   3. Read the tool's result
    #   4. Think again
    #   5. THEN give a final answer
    # This loop keeps going until Claude says "I'm done!"

    while True:  # Keep looping until we break out

        # STEP 5a: Send messages to Claude
        # Claude reads the conversation and decides what to do next
        response = client.messages.create(
            model="claude-opus-4-5",        # Which Claude model to use
            max_tokens=1024,               # Maximum length of Claude's reply
            tools=tools,                   # Give Claude our tool descriptions
            messages=messages              # The full conversation so far
        )

        print(f"🤖 Claude's stop reason: {response.stop_reason}")
        # stop_reason tells us WHY Claude stopped:
        #   "tool_use"   → Claude wants to use a tool
        #   "end_turn"   → Claude is done and has a final answer


        # ── Decision Point ──────────────────────────────────
        # Did Claude decide to use a tool?

        if response.stop_reason == "tool_use":
            # Yes! Claude wants to use a tool.
            print("🔧 Claude decided to use the calculator tool!")

            # STEP 5b: Find out WHICH tool Claude wants to use
            # and WHAT numbers/operation it picked
            tool_use_block = None
            for block in response.content:
                if block.type == "tool_use":
                    tool_use_block = block
                    break
            # ↑ We loop through Claude's response to find the tool_use block

            tool_name   = tool_use_block.name    # e.g. "calculator"
            tool_inputs = tool_use_block.input    # e.g. {"operation": "multiply", "number1": 247, "number2": 38}
            tool_use_id = tool_use_block.id       # A unique ID for this tool call

            print(f"   Tool name: {tool_name}")
            print(f"   Tool inputs: {tool_inputs}")

            # STEP 5c: Actually RUN the tool with those inputs
            tool_result = run_calculator(
                operation=tool_inputs["operation"],
                number1=tool_inputs["number1"],
                number2=tool_inputs["number2"]
            )
            print(f"   Tool result: {tool_result}")

            # STEP 5d: Add Claude's response AND the tool result to the conversation
            # This is how Claude "reads" the result — we put it back in the messages!
            messages.append({"role": "assistant", "content": response.content})
            messages.append({
                "role": "user",
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": tool_use_id,  # Must match the ID from above!
                        "content": tool_result        # The actual answer from our calculator
                    }
                ]
            })
            # ↑ Now Claude will see this result and use it to form its final answer

            # Loop back to the top — let Claude think again with this new information

        else:
            # STEP 5e: Claude is done! Extract the final text answer.
            final_answer = ""
            for block in response.content:
                if hasattr(block, "text"):
                    final_answer += block.text

            print(f"\n✅ Final Answer: {final_answer}")
            return final_answer  # Exit the while loop and return the answer


# ============================================================
# STEP 6: Run the Agent!
# ============================================================

if __name__ == "__main__":

    # Test 1: A math question — agent SHOULD use the calculator
    run_agent("What is 247 multiplied by 38?")

    print("\n" + "=" * 50 + "\n")

    # Test 2: A non-math question — agent should NOT use the calculator
    run_agent("What is the capital of France?")
```

---

## 📊 What Happens When You Run It?

Here's exactly what you'll see in your terminal:

```
🧑 You asked: What is 247 multiplied by 38?
--------------------------------------------------
🤖 Claude's stop reason: tool_use
🔧 Claude decided to use the calculator tool!
   Tool name: calculator
   Tool inputs: {'operation': 'multiply', 'number1': 247, 'number2': 38}
   Tool result: The result of 247 multiply 38 = 9386
🤖 Claude's stop reason: end_turn

✅ Final Answer: 247 multiplied by 38 equals 9,386.

==================================================

🧑 You asked: What is the capital of France?
--------------------------------------------------
🤖 Claude's stop reason: end_turn

✅ Final Answer: The capital of France is Paris.
```

> **Notice:** For the second question, Claude **skipped the tool entirely** — because it already knew the answer! That's the agent's decision-making at work. 🧠

---

## 🔑 The 5 Key Ideas to Remember

| Concept | What it means in plain English |
|---|---|
| **Tool definition** | A menu you give Claude: "Here's what tools you can order" |
| **Tool decision** | Claude reads the menu and decides: "Do I need this?" |
| **Tool execution** | Your Python code does the actual work |
| **Tool result** | You hand the result back to Claude |
| **Agent loop** | This whole cycle can repeat until Claude has a full answer |

---

## 🚀 How to Run This Code

**Step 1 — Install the library:**
```bash
pip install anthropic
```

**Step 2 — Set your API key:**
```bash
export ANTHROPIC_API_KEY="your-key-here"
```

**Step 3 — Save and run:**
```bash
python my_agent.py
```

---
## 💻 Example 2 - Dice Roller Agent - Full Working Code (Every Line Explained)

```python
"""
 PROFESSOR'S GUIDE: YOUR VERY FIRST AI AGENT
==================================================
Hello, young inventor! I am your AI Professor.
Today, we are going to build a "Magic Dice Roller Agent".

 WHAT IS AN AGENT?
Imagine a super-smart robot brain. It can talk and think, but it has no hands!
If you ask it to roll a dice, it says "I can't, I don't have hands!"

An "Agent" is when we give that robot brain "Tools" (like hands).
The coolest part? We teach the robot how to use the hands, and it DECIDES when to use them!
Let's build it!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------

# 'json' is a magic translator. It translates the secret robot language into Python language.
import json 

# 'OpenAI' is the magic telephone. We use this to call the robot brain!
from openai import OpenAI

# 'random' is a tool that helps us pick random numbers, just like rolling a real dice!
import random

# 're' is a little broom we use to sweep away messy text if the robot makes a typo.
import re


# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------

# We are using our telephone (OpenAI) to call a robot that lives right on your computer.
# "http://localhost:11434/v1" is the robot's phone number!
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# We are choosing to talk to a very smart robot named "llama3.2".
MODEL_NAME = "llama3.2"


# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------

# This is the actual hand we are building. It's a block of code called a "function".
def roll_dice(sides):
    # First, we print a message to the screen so we can see the robot's hands moving.
    print(f"   [ TOOL RUNNING] Rolling a {sides}-sided dice...")
    
    # We ask the 'random' tool to pick a number between 1 and the number of sides.
    result = random.randint(1, int(sides))
    
    # We hand the result back as a word (string) so the robot can read it.
    return str(result)


# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------

# The robot doesn't know it has hands yet! We have to write a manual to teach it.
tools_manual = [{
    # We tell the robot: "This is a function (a tool you can use)."
    "type": "function", 
    
    "function": {
        # We tell the robot: "The name of this tool is exactly 'roll_dice'."
        "name": "roll_dice", 
        
        # We tell the robot: "Only use this tool when someone asks you to roll a dice!"
        "description": "Use this tool whenever the user asks you to roll a dice.", 
        
        # We tell the robot: "When you use this tool, you must give it some information."
        "parameters": { 
            "type": "object",
            "properties": {
                # We tell the robot: "You must tell the tool how many SIDES the dice has."
                "sides": { 
                    "type": "integer", # An integer just means a whole number, like 6 or 20.
                    "description": "The number of sides on the dice (for example: 6 or 20)"
                }
            }
        }
    }
}]


# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------

# You ask the robot a question that requires it to use its new hands!
user_question = "Can you roll a 6-sided dice for me and tell me if I got a high score?"
print(f" YOU ASKED: '{user_question}'\n")

# We create a diary (a list) to remember everything we say to the robot.
# We start the diary with your question.
messages = [{"role": "user", "content": user_question}]

print(" AI is thinking...")

# Now, we send the robot THREE things:
# 1. The robot's name (MODEL_NAME)
# 2. Our diary (messages)
# 3. The instruction manual for its new hands (tools_manual)
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

# We grab the very first sentence the robot says back to us.
ai_reply = response.choices[0].message


# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
# The robot has two choices: It can answer with words, OR it can ask to use its hands!

# We check: Did the robot ask to use a tool (tool_calls)?
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my dice roller tool to answer this!'\n")
    
    # We grab the exact tool the robot asked for.
    tool_request = ai_reply.tool_calls[0]
    
    # The robot asks for the tool in a secret language. We use 'json' to translate it into Python.
    arguments = json.loads(tool_request.function.arguments)
    
    # We look at the translated message to see how many sides the robot wants the dice to have.
    number_of_sides = arguments["sides"]
    print(f" AI wants to roll a dice with {number_of_sides} sides.")
    
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY ROLL THE DICE!
    # ---------------------------------------------------------
    
    # The robot asked us to do it, so our Python code physically rolls the dice!
    tool_result = roll_dice(number_of_sides)
    print(f" Tool returned: The dice landed on {tool_result}!\n")
    
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    
    # We write down the robot's request in our diary so it remembers what it asked.
    messages.append(ai_reply) 
    
    # We write down the actual dice roll number in the diary so the robot can read it.
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is looking at the dice roll and thinking about the final answer...")
    
    # We send the updated diary BACK to the robot. Now it knows what number we rolled!
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    # The robot reads the diary and tells us the final story!
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)


else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    
    # If the robot didn't ask for a tool, it means it already knew the answer!
    # For example, if you asked "What color is the sky?", it doesn't need a dice for that.
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

---

## 🛒 Example 3 - Smart Shopping List Agent - Full Working Code (Every Line Explained)

This is a very practical, real-life example! We will build an AI that actually writes down your groceries into a real text file on your computer.

```python
"""
 PROFESSOR'S GUIDE: YOUR DAILY LIFE AI AGENT
==================================================
Welcome back, young inventor! I am your AI Professor.
So far, we built a Calculator and a Dice Roller. Those are fun, but let's build something you can use EVERY DAY!

We are going to build a "Smart Shopping List Agent". 

 WHAT DOES IT DO?
Imagine you are cooking and realize you are out of milk and eggs.
You just tell the robot: "I'm baking a cake, please add milk and 2 eggs to my list."
The robot will DECIDE to use its "Shopping List" hands to write it down for you!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
# 'json' is the magic translator for the secret robot language.
import json 
# 'OpenAI' is the magic telephone to call the robot brain.
from openai import OpenAI
# 'os' is a tool that lets our Python code look at files on your computer.
import os

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
# We call the robot that lives on your computer using our telephone.
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# We are using our smart robot named "llama3.2".
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# Here is the actual hand we are building. It's a function that writes to a text file!
def add_to_shopping_list(item, quantity):
    print(f"   [🛒 TOOL RUNNING] Writing down: {quantity}x {item}...")
    
    # We open a real text file called "my_groceries.txt" and write the item inside!
    # The 'a' means "append" (add to the end of the list without deleting old stuff).
    with open("my_groceries.txt", "a") as file:
        file.write(f"- {quantity} {item}\n")
        
    return f"Successfully added {quantity} {item} to your grocery list!"

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We have to teach the robot how to use its new shopping list hands!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "add_to_shopping_list", # The exact name of our tool
        "description": "Use this tool whenever the user asks to buy something or add groceries to their list.",
        "parameters": { 
            "type": "object",
            "properties": {
                "item": { 
                    "type": "string", 
                    "description": "The name of the food or item (for example: 'milk' or 'apples')"
                },
                "quantity": {
                    "type": "integer",
                    "description": "How many they want to buy (for example: 2 or 10)"
                }
            }
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's tell the robot what we need for our recipe!
user_question = "I am making a giant omelette. Can you add 12 eggs to my shopping list?"
print(f" YOU ASKED: '{user_question}'\n")

# We create our diary (list) to remember the conversation.
messages = [{"role": "user", "content": user_question}]

print(" AI is thinking...")

# We send the robot its name, the diary, and the manual for its new hands.
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

# We grab the very first thing the robot says back to us.
ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
# Did the robot ask to use its shopping list tool?
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my shopping list tool to write this down!'\n")
    
    # We grab the exact tool the robot asked for.
    tool_request = ai_reply.tool_calls[0]
    
    # We translate the secret robot language into Python.
    arguments = json.loads(tool_request.function.arguments)
    
    # We pull out the exact food and amount the robot wants to write down.
    food_item = arguments["item"]
    amount = arguments["quantity"]
    print(f" AI wants to add: {amount} {food_item}")
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY WRITE THE LIST!
    # ---------------------------------------------------------
    # The robot asked us to do it, so our Python code physically writes it in the text file!
    tool_result = add_to_shopping_list(food_item, amount)
    print(f" Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    # We write down the robot's request in our diary so it remembers.
    messages.append(ai_reply) 
    
    # We write down the tool's success message in the diary.
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is double-checking the list and thinking about the final answer...")
    
    # We send the updated diary BACK to the robot.
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    # If you just said "Hello", the robot wouldn't need to write a shopping list!
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Congratulations!** You now have a working personal assistant that actually writes files on your computer! You can run this whenever you need to remember to buy something.

---

## 🌐 Example 4 - Smart Web Assistant Agent - Full Working Code

This is an incredibly fun example! We are going to give the AI the power to actually control your computer's internet browser and open websites for you.

```python
"""
 PROFESSOR'S GUIDE: YOUR COMPUTER ASSISTANT AGENT
==================================================
Welcome back! You are becoming a great AI Engineer.
We've built an AI that can calculate, roll dice, and write grocery lists.
Now, let's build an AI that can ACTUALLY control your computer!

We are going to build a "Smart Web Assistant". 

 WHAT DOES IT DO?
Imagine you are tired and want to watch videos.
You tell the robot: "I want to watch some funny cat videos."
The robot will DECIDE to use its "Web Browser" hands to physically open 
YouTube on your real computer screen!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
# 'json' translates the secret robot language.
import json 
# 'OpenAI' is the telephone to call the robot brain.
from openai import OpenAI
# 'webbrowser' is a VERY cool tool. It lets Python open your real internet browser!
import webbrowser

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
# We call our smart robot named "llama3.2"
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool physically opens a website on your computer monitor!
def open_website(url):
    print(f"   [🌐 TOOL RUNNING] Opening {url} in your web browser...")
    
    # We use the webbrowser tool to open the link!
    # (If the robot forgets 'https://', we add it so it doesn't break)
    if not url.startswith("http"):
        url = "https://" + url
        
    webbrowser.open(url)
    
    return f"Successfully opened {url} on the computer screen!"

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its new web browsing hands!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "open_website", 
        "description": "Use this tool whenever the user asks to go to a website, search the web, or watch a video online.",
        "parameters": { 
            "type": "object",
            "properties": {
                "url": { 
                    "type": "string", 
                    "description": "The web address to open (for example: 'youtube.com' or 'google.com')"
                }
            }
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot to open a website for us!
user_question = "I want to watch some funny dog videos. Can you open YouTube for me?"
print(f" YOU ASKED: '{user_question}'\n")

# We create our diary (list) to remember the conversation.
messages = [{"role": "user", "content": user_question}]

print(" AI is thinking...")

# We send the robot its name, the diary, and the manual for its new hands.
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

# We grab the very first thing the robot says back to us.
ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
# Did the robot ask to use its web browsing tool?
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my web browser tool to do this!'\n")
    
    # We grab the exact tool the robot asked for.
    tool_request = ai_reply.tool_calls[0]
    
    # We translate the secret robot language into Python.
    arguments = json.loads(tool_request.function.arguments)
    
    # We pull out the exact website address the robot wants to open.
    website_url = arguments["url"]
    print(f" AI wants to open this website: {website_url}")
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY OPEN THE WEBSITE!
    # ---------------------------------------------------------
    # The robot asked us to do it, so our Python code physically opens Google Chrome/Edge/Safari!
    tool_result = open_website(website_url)
    print(f" Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    # We write down the robot's request and the tool's success message in the diary.
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is checking if the website opened and thinking about the final answer...")
    
    # We send the updated diary BACK to the robot.
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Incredible!** You just built an AI that can break out of the terminal and actually control other apps on your computer. Your students will love testing this one out!

---

## ⏰ Example 5 - Smart Clock Agent - Full Working Code

Have you ever wondered why ChatGPT sometimes doesn't know what day it is?
It's because AI brains are frozen in time! To fix this, we need to build a "Smart Clock Agent" that can read your computer's clock.

```python
"""
 PROFESSOR'S GUIDE: YOUR SMART CLOCK AGENT
==================================================
Welcome back! You are doing amazing.
Have you ever wondered why ChatGPT sometimes doesn't know what day it is?
It's because AI brains are frozen in time from the day they were created!

To fix this, we need to build a "Smart Clock Agent". 

 WHAT DOES IT DO?
We are going to give the robot a "Watch" tool. 
If you ask it: "What time is it right now? Am I late for my 3:00 PM meeting?",
the robot will DECIDE to look at its watch (the computer's clock) before answering!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
# 'json' translates the secret robot language.
import json 
# 'OpenAI' is the telephone to call the robot brain.
from openai import OpenAI
# 'datetime' is our magic watch! It can tell us the exact time right now.
import datetime

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool simply looks at your computer's clock and returns the time!
def get_current_time():
    print("   [⏰ TOOL RUNNING] Looking at the computer's clock...")
    
    # We ask the datetime tool to give us the exact time and date right now.
    right_now = datetime.datetime.now()
    
    # We turn it into a nice readable string for the robot.
    time_string = right_now.strftime("%A, %B %d, %Y at %I:%M %p")
    return f"The current date and time is: {time_string}"

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its new watch!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "get_current_time", 
        "description": "Use this tool whenever the user asks for the current time, date, or what day of the week it is.",
        "parameters": { 
            "type": "object",
            "properties": {} # This tool doesn't need any extra information to work!
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot a time-sensitive question!
user_question = "What day of the week is it today, and what time is it?"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# We send the robot its name, the diary, and the manual for its new watch.
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
# Did the robot ask to use its clock tool?
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to look at my watch tool to answer this!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY CHECK THE TIME!
    # ---------------------------------------------------------
    # The robot asked us to do it, so our Python code checks the computer's clock!
    tool_result = get_current_time()
    print(f" Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is reading the time and thinking about the final answer...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Time Master!** You just solved one of the biggest limitations of language models by giving it real-time awareness.

---

## 🔒 Example 6 - Cybersecurity Agent (Password Generator) - Full Working Code

For our 6th agent, let's build something that keeps you safe online! We will build an AI agent that generates highly secure, un-hackable passwords for you.

```python
"""
 PROFESSOR'S GUIDE: YOUR CYBERSECURITY AGENT
==================================================
Welcome back! You are on fire. 

We have built 5 amazing agents so far. For our 6th agent, 
let's build something that keeps you safe online!

We are going to build a "Password Generator Agent". 

 WHAT DOES IT DO?
Imagine you are making a new account for a video game, and it says:
"Please enter a strong password."
Instead of guessing, you just ask your robot: 
"I need a super secure password that is 16 characters long."
The robot will use its "Password Generator" tool to instantly build 
an un-hackable password for you!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json 
from openai import OpenAI
import random # Helps us pick random letters and numbers
import string # Contains all the letters of the alphabet and symbols!

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool mixes up letters, numbers, and symbols to create a strong password!
def generate_secure_password(length):
    print(f"   [🔒 TOOL RUNNING] Generating a {length}-character secure password...")
    
    # We gather all possible letters, numbers, and symbols (!@#$)
    all_characters = string.ascii_letters + string.digits + string.punctuation
    
    # We ask Python to randomly pick characters until we reach the length we want!
    secure_password = "".join(random.choice(all_characters) for _ in range(length))
    
    return f"Your secure password is: {secure_password}"

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its new password generator tool!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "generate_secure_password", 
        "description": "Use this tool whenever the user asks you to create, make, or generate a strong password.",
        "parameters": { 
            "type": "object",
            "properties": {
                "length": { 
                    "type": "integer", 
                    "description": "How long the password should be (for example: 10 or 16). If the user doesn't say, use 12."
                }
            },
            "required": ["length"]
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot to keep us safe online!
user_question = "I am making a new bank account. Can you generate a really strong password that is 14 characters long?"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# Send everything to the robot!
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my password generator tool to do this safely!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    arguments = json.loads(tool_request.function.arguments)
    
    # The robot tells us how long the password should be
    password_length = arguments["length"]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY GENERATE THE PASSWORD!
    # ---------------------------------------------------------
    # Python does the hard work of picking the random letters and symbols.
    tool_result = generate_secure_password(password_length)
    print(f" Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is looking at the new password and preparing your answer...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Cyber Security Expert!** You have now taught your agent how to use python logic to protect your accounts!

---

## 📁 Example 7 - Computer Organizer Agent - Full Working Code

For our 7th agent, we are going to build an AI that can actually interact with your computer's hard drive! We will build a "Folder Creator Agent" that can organize your files for you.

```python
"""
 PROFESSOR'S GUIDE: YOUR COMPUTER ORGANIZER AGENT
==================================================
Welcome back! You are unstoppable. 

We have built 6 amazing agents so far. For our 7th agent, 
we are going to build a "Computer Organizer Agent".

 WHAT DOES IT DO?
Imagine your desktop is messy, and you are starting a new school project.
Instead of right-clicking, creating a new folder, and typing a name...
You just tell the robot: "I am doing a project on Dinosaurs. Can you make a folder for it?"
The robot will use its "Folder Creator" tool to physically create a brand new 
folder on your computer!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json 
from openai import OpenAI
import os # 'os' is the magic tool that lets Python talk to your computer's folders!

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool uses Python to actually create a new folder on your hard drive!
def create_new_folder(folder_name):
    print(f"   [📁 TOOL RUNNING] Creating a new folder named '{folder_name}'...")
    
    try:
        # We tell the computer's Operating System (os) to make a directory (mkdir)
        os.mkdir(folder_name)
        return f"Success! I created the folder '{folder_name}' right here on your computer."
    except FileExistsError:
        # Oops! What if the folder already exists? We tell the robot!
        return f"Oops! A folder named '{folder_name}' already exists. I didn't make a new one."

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its new folder-making tool!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "create_new_folder", 
        "description": "Use this tool whenever the user asks to create, make, or organize a new folder or directory on their computer.",
        "parameters": { 
            "type": "object",
            "properties": {
                "folder_name": { 
                    "type": "string", 
                    "description": "The exact name of the folder to create (for example: 'School_Project' or 'Vacation_Photos'). Use underscores instead of spaces."
                }
            },
            "required": ["folder_name"]
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot to help us organize our computer!
user_question = "I am starting a massive science project about Space. Can you create a new folder for me called 'Space_Project'?"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# Send everything to the robot!
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my folder creation tool to organize this!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    arguments = json.loads(tool_request.function.arguments)
    
    # The robot decides what to name the folder based on our question
    name_of_folder = arguments["folder_name"]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY CREATE THE FOLDER!
    # ---------------------------------------------------------
    # Python physically creates the folder on your hard drive!
    tool_result = create_new_folder(name_of_folder)
    print(f" Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is checking if the folder was created and preparing your answer...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Master Organizer!** You've just taught your AI how to reach into your computer's file system and organize your life!

---

## ⏳ Example 8 - Smart Timer Agent - Full Working Code

For our 8th agent, we are going to build a "Smart Timer Agent". Think about the smart speakers in your house (like Alexa or Siri). What is the #1 thing people use them for? Setting timers while cooking!

```python
"""
 PROFESSOR'S GUIDE: YOUR SMART TIMER AGENT
==================================================
Welcome back! 

Think about the smart speakers in your house (like Alexa or Siri). 
What is the #1 thing people use them for? Setting timers while cooking!

For our 8th agent, we are going to build a "Smart Timer Agent".

 WHAT DOES IT DO?
Imagine you just put some pasta in boiling water.
You tell the robot: "Set a timer for 5 seconds."
The robot will use its "Timer" tool to actually wait 5 seconds, 
and then it will BEEP to let you know the pasta is done!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json 
from openai import OpenAI
import time # 'time' is the magic tool that lets Python pause and wait!

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool uses Python to actually pause time, just like a real stopwatch!
def set_timer(seconds):
    print(f"\n   [⏳ TOOL RUNNING] Starting a timer for {seconds} seconds...")
    
    # We ask Python to literally go to sleep and wait!
    time.sleep(seconds)
    
    # Wake up!
    print("   [⏰ BEEP BEEP BEEP!] The timer is done!")
    
    return f"Success! I waited for exactly {seconds} seconds."

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its new stopwatch!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "set_timer", 
        "description": "Use this tool whenever the user asks you to set a timer, wait, or countdown.",
        "parameters": { 
            "type": "object",
            "properties": {
                "seconds": { 
                    "type": "integer", 
                    "description": "The exact number of seconds to wait (for example: 3 or 10)."
                }
            },
            "required": ["seconds"]
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot to set a quick timer for us!
user_question = "I am making tea. Can you set a quick timer for 3 seconds?"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# Send everything to the robot!
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my timer tool to wait for the user!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    arguments = json.loads(tool_request.function.arguments)
    
    # The robot decides how long to wait based on our question
    time_to_wait = arguments["seconds"]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY START THE TIMER!
    # ---------------------------------------------------------
    # Python physically stops and counts down!
    tool_result = set_timer(time_to_wait)
    print(f"\n Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI heard the alarm ring and is preparing your final message...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Master of Time!** You have now taught your agent how to wait, pause, and alert you just like a real smart speaker!

---

## 🕵️‍♂️ Example 9 - Secret Spy Agent - Full Working Code

For our 9th agent, we are going to build a "Spy Agent"! This is a super fun example that teaches how agents can use Python to manipulate and encode text. 

```python
"""
 PROFESSOR'S GUIDE: YOUR SPY AGENT (SECRET MESSAGES)
==================================================
Welcome back! 

Are you ready to build something super top-secret? 🕵️‍♂️
For our 9th agent, we are going to build a "Spy Agent"!

 WHAT DOES IT DO?
Imagine you want to send a secret note to your best friend, 
but you don't want anyone else to read it.
You tell the robot: "Encode this secret message: Meet me at the park."
The robot will use its "Encoder" tool to instantly scramble the 
words into a secret code!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json 
from openai import OpenAI
import codecs # 'codecs' is a magic tool that can scramble and unscramble words!

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool uses a famous old spy trick called "ROT13" to scramble letters!
def encode_secret_message(message):
    print(f"\n   [🕵️ TOOL RUNNING] Scrambling the secret message...")
    
    # We ask Python to scramble the message using 'rot_13'
    # (We use str() just in case the robot accidentally sent us a dictionary instead of text!)
    secret_code = codecs.encode(str(message), 'rot_13')
    
    return f"Success! The encoded secret message is: {secret_code}"

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its new spy tool!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "encode_secret_message", 
        "description": "Use this tool whenever the user asks you to hide, encode, or scramble a secret message.",
        "parameters": { 
            "type": "object",
            "properties": {
                "message": { 
                    "type": "string", 
                    "description": "The exact sentence or words the user wants to hide (for example: 'Meet me at the park')."
                }
            },
            "required": ["message"]
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot to hide a message for us!
user_question = "I want to send a secret note to my best friend. Can you encode this message: 'I hid the cookies in the treehouse!'"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# Send everything to the robot!
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my encoder tool to keep this safe!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    arguments = json.loads(tool_request.function.arguments)
    
    # The robot pulls out the exact message we want to hide
    text_to_hide = arguments["message"]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY ENCODE THE MESSAGE!
    # ---------------------------------------------------------
    # Python physically scrambles the letters!
    tool_result = encode_secret_message(text_to_hide)
    print(f"\n Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is preparing the final secret code delivery...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Top Secret Hacker!** You have now taught your agent how to use cryptography to hide secret messages!

---

## 🧠 Example 10 - Memory Agent (Reading Files) - Full Working Code

For our 10th and final agent in this chapter, we are going to bring everything full circle. In Example 3, we built an agent that *wrote* to a file. Now, we are going to build an agent that *reads* from that file to give our robot a Memory!

```python
"""
 PROFESSOR'S GUIDE: YOUR MEMORY AGENT (READING FILES)
==================================================
Welcome back! 

For our 10th and final agent in this chapter, we are going to do something
really special. We are going to give our robot a Memory!

 WHAT DOES IT DO?
Do you remember in Example 3, we built a Shopping List agent that wrote 
our groceries down in a file called "my_groceries.txt"?

Well, what if we forgot what we wrote down?
We are going to give our robot a "Reading Glasses" tool so it can physically 
open that file, read what's inside, and remind us what we need to buy!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json 
from openai import OpenAI
import os # 'os' helps us check if the file actually exists!

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool puts on its reading glasses and looks inside a text file!
def read_shopping_list():
    print(f"\n   [👓 TOOL RUNNING] Searching the computer for 'my_groceries.txt'...")
    
    file_name = "my_groceries.txt"
    
    # First, check if the file is even there!
    if not os.path.exists(file_name):
        return f"I couldn't find a file called {file_name}. Your shopping list is empty!"
        
    # If the file exists, we open it in "r" (read) mode
    with open(file_name, "r") as file:
        groceries = file.read()
        
    return f"Here is what I read from the file:\n{groceries}"

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its reading glasses!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "read_shopping_list", 
        "description": "Use this tool whenever the user asks you to read, check, or remember what is on their shopping list or grocery list.",
        "parameters": { 
            "type": "object",
            "properties": {} # No extra parameters needed! It just reads the file.
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot to jog our memory!
user_question = "I am at the supermarket, but I left my list at home! Can you read my grocery list to me?"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# Send everything to the robot!
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my reading tool to check the file!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY READ THE FILE!
    # ---------------------------------------------------------
    # Python physically opens the file and reads the text!
    tool_result = read_shopping_list()
    print(f"\n Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is summarizing what it read and preparing your answer...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Memory Master!** You've completed 10 incredible examples. You are now officially an Agentic AI Engineer!

---

## 🔍 Example 11 - Detective Agent (System Info) - Full Working Code

For our 11th agent, we are going to build a "Detective Agent". When an AI wakes up in the terminal, it doesn't know where it is or who it is talking to! We are going to give our robot a "Magnifying Glass" tool so it can look around your computer.

```python
"""
 PROFESSOR'S GUIDE: YOUR DETECTIVE AGENT (SYSTEM INFO)
==================================================
Welcome back! 

For our 11th agent, we are going to build a "Detective Agent". 

 WHAT DOES IT DO?
When an AI wakes up in the terminal, it doesn't know where it is or who it is talking to!
We are going to give our robot a "Magnifying Glass" tool so it can look around 
your computer and figure out what Operating System it is living inside of, 
and what your username is!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json 
from openai import OpenAI
import os       # Helps us find the user's name
import platform # Helps us figure out if this is a Mac, Windows, or Linux computer!

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool puts on its detective hat and investigates the computer!
def investigate_computer():
    print(f"\n   [🔍 TOOL RUNNING] Investigating the computer's system...")
    
    # We ask Python to check what kind of computer this is
    os_name = platform.system() # e.g., "Windows" or "Darwin" (Mac)
    os_version = platform.release()
    
    # We ask Python to check who is currently logged in!
    try:
        user_name = os.getlogin()
    except Exception:
        user_name = "Unknown User"
        
    return f"I am running on a {os_name} {os_version} computer. The logged-in user is: {user_name}"

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its magnifying glass!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "investigate_computer", 
        "description": "Use this tool whenever the user asks you about their computer, their operating system, or their username.",
        "parameters": { 
            "type": "object",
            "properties": {} # No extra parameters needed! It just looks around.
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot to figure out where it is!
user_question = "I forgot what kind of computer I am using. Can you investigate and tell me my operating system and my username?"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# Send everything to the robot!
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my magnifying glass tool to investigate!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY INVESTIGATE THE SYSTEM!
    # ---------------------------------------------------------
    # Python physically checks the hardware and software!
    tool_result = investigate_computer()
    print(f"\n Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is reading the clues and preparing your answer...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Super Sleuth!** You've taught your AI how to read its own environment!

---

## 🎱 Example 12 - Fortune Teller Agent (Magic 8-Ball) - Full Working Code

For our 12th agent, we are going to build a "Fortune Teller Agent" using a Magic 8-Ball! This is an incredibly fun, interactive example that shows how agents can trigger random events to answer questions.

```python
"""
 PROFESSOR'S GUIDE: YOUR FORTUNE TELLER AGENT
==================================================
Welcome back! 

For our 12th agent, we are going to build a "Fortune Teller Agent"
using a Magic 8-Ball! 🎱

 WHAT DOES IT DO?
Imagine you have a very important question about your future.
You ask the robot: "Will we have pizza for dinner tonight?"
The robot will use its "Magic 8-Ball" tool to physically shake the 
virtual 8-Ball and tell you your fortune!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json 
from openai import OpenAI
import random # 'random' helps us pick a random fortune!

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool shakes the virtual Magic 8-Ball and reads the answer!
def shake_magic_8_ball():
    print(f"\n   [🎱 TOOL RUNNING] Shaking the Magic 8-Ball...")
    
    # Here is a list of classic Magic 8-Ball answers!
    answers = [
        "It is certain.",
        "Without a doubt.",
        "Yes, definitely.",
        "Ask again later.",
        "Cannot predict now.",
        "Don't count on it.",
        "My sources say no.",
        "Very doubtful."
    ]
    
    # We ask Python to pick one randomly!
    fortune = random.choice(answers)
    
    return f"The Magic 8-Ball says: '{fortune}'"

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its new Magic 8-Ball!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "shake_magic_8_ball", 
        "description": "Use this tool whenever the user asks a yes/no question about the future, or asks for a fortune.",
        "parameters": { 
            "type": "object",
            "properties": {} # No extra parameters needed! We just shake the ball.
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot a very important question!
user_question = "I need to know my future! Will I get an A+ on my math test tomorrow?"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# Send everything to the robot!
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my Magic 8-Ball tool to predict the future!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY SHAKE THE 8-BALL!
    # ---------------------------------------------------------
    # Python physically picks a random fortune!
    tool_result = shake_magic_8_ball()
    print(f"\n Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is reading the fortune and preparing your answer...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Fortune Teller!** You've just taught your AI how to predict the future!

---

## 🍽️ Example 13 - Restaurant Assistant (Tip Calculator) - Full Working Code

For our 13th agent, we are going to build something that adults use every single day: A "Tip Calculator Agent"! 

```python
"""
 PROFESSOR'S GUIDE: YOUR RESTAURANT ASSISTANT AGENT
==================================================
Welcome back! 

For our 13th agent, we are going to build something that adults use 
every single day: A "Tip Calculator Agent"! 🍽️

 WHAT DOES IT DO?
Imagine you just finished eating a huge pizza at a restaurant. 
The bill arrives and it's $45. You want to leave a nice 20% tip, 
but you don't want to do the math in your head!

You just ask your robot: "My bill was $45 and I want to tip 20%. How much is that?"
The robot will use its "Tip Calculator" tool to figure out exactly 
how much you should pay!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json 
from openai import OpenAI

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool does the math to figure out the tip and the total bill!
def calculate_restaurant_tip(bill_amount, tip_percentage):
    print(f"\n   [🍽️ TOOL RUNNING] Calculating a {tip_percentage}% tip on a ${bill_amount} bill...")
    
    # We turn the percentage into a decimal (e.g., 20 becomes 0.20)
    decimal_tip = tip_percentage / 100
    
    # We multiply the bill by the decimal to find the tip amount
    tip_amount = bill_amount * decimal_tip
    
    # We add the tip to the original bill to get the final total
    total_bill = bill_amount + tip_amount
    
    # We return the answer nicely formatted with dollar signs!
    return f"The tip is ${tip_amount:.2f}, making the total bill ${total_bill:.2f}."

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its new tip calculator!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "calculate_restaurant_tip", 
        "description": "Use this tool whenever the user asks you to calculate a tip or gratuity for a restaurant bill.",
        "parameters": { 
            "type": "object",
            "properties": {
                "bill_amount": { 
                    "type": "number", 
                    "description": "The total cost of the food before the tip (for example: 45 or 100.50)."
                },
                "tip_percentage": {
                    "type": "number",
                    "description": "The percentage they want to tip (for example: 15 or 20)."
                }
            },
            "required": ["bill_amount", "tip_percentage"]
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot to help us pay the bill!
user_question = "I just had an amazing dinner. The bill is $45 and I want to leave a 20% tip. How much is the tip, and what is the total?"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# Send everything to the robot!
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my tip calculator tool to help the user pay!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    arguments = json.loads(tool_request.function.arguments)
    
    # The robot pulls out the numbers we gave it
    bill = arguments["bill_amount"]
    tip = arguments["tip_percentage"]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY CALCULATE THE TIP!
    # ---------------------------------------------------------
    # Python physically does the math!
    tool_result = calculate_restaurant_tip(bill, tip)
    print(f"\n Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is preparing the final receipt for you...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Master of Finance!** You just saved yourself from doing math after a big meal!

---

## 🚀 Example 14 - Time Machine Agent (Calendar Day Finder) - Full Working Code

For our 14th agent, we are going to build a "Time Machine Agent"! This example uses Python's built-in `datetime` module to travel back in time and find the exact day of the week for any historical date.

```python
"""
 PROFESSOR'S GUIDE: YOUR TIME MACHINE AGENT (CALENDAR)
==================================================
Welcome back! 

For our 14th agent, we are going to build a "Time Machine Agent"! 🚀

 WHAT DOES IT DO?
Have you ever wondered what day of the week you were born on? 
Was it a Tuesday? A Friday? 

Instead of looking at an old dusty calendar, you can just ask your robot: 
"I was born on October 31, 2010. What day of the week was that?"

The robot will use its "Calendar" tool to physically travel back in time 
and figure out the exact day of the week for any date in history!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json 
from openai import OpenAI
import datetime # 'datetime' is our magic time machine!

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool uses Python's time machine to find the day of the week!
def find_day_of_week(year, month, day):
    print(f"\n   [📅 TOOL RUNNING] Traveling back to {month}/{day}/{year}...")
    
    try:
        # We ask Python to create a special Date object
        special_date = datetime.date(year, month, day)
        
        # %A is a secret code that tells Python to give us the full name of the day!
        day_name = special_date.strftime("%A") 
        
        return f"Success! That date was a {day_name}."
    except Exception as e:
        return f"Oops! That is not a real date. Error: {e}"

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its time machine!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "find_day_of_week", 
        "description": "Use this tool whenever the user asks you what day of the week a specific date falls on.",
        "parameters": { 
            "type": "object",
            "properties": {
                "year": { 
                    "type": "integer", 
                    "description": "The 4-digit year (for example: 2010 or 1995)."
                },
                "month": {
                    "type": "integer",
                    "description": "The number of the month (for example: 10 for October)."
                },
                "day": {
                    "type": "integer",
                    "description": "The day of the month (for example: 31)."
                }
            },
            "required": ["year", "month", "day"]
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot to check a date for us!
user_question = "I was born on October 31, 2010. Can you tell me what day of the week I was born on?"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# Send everything to the robot!
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my calendar tool to check the day!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    arguments = json.loads(tool_request.function.arguments)
    
    # The robot pulls out the exact year, month, and day
    y = arguments["year"]
    m = arguments["month"]
    d = arguments["day"]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY USE THE CALENDAR!
    # ---------------------------------------------------------
    # Python physically calculates the day of the week!
    tool_result = find_day_of_week(y, m, d)
    print(f"\n Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is preparing to tell you what day it was...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Time Traveler!** You've just taught your AI how to travel through time and read the calendar!

---

## 🎒 Example 15 - Homework Checker Agent (Word Counter) - Full Working Code

For our 15th agent, we are going to build a "Homework Checker Agent"! This is a fantastic example for students. It teaches how an AI agent can analyze and manipulate raw text (Strings) using Python's built-in string functions.

```python
"""
 PROFESSOR'S GUIDE: YOUR HOMEWORK CHECKER AGENT
==================================================
Welcome back! 

For our 15th agent, we are going to build a "Homework Checker Agent"! 🎒

 WHAT DOES IT DO?
Imagine you just finished writing a big essay for school. 
Your teacher told you that it HAS to be exactly 10 words long. 

Instead of pointing your finger at the screen and counting every 
single word, you can just ask your robot: 
"Can you check my essay? Here it is: 'Dinosaurs are the coolest animals that ever lived on Earth.'"

The robot will use its "Text Analyzer" tool to instantly count 
the words and the letters for you!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json 
from openai import OpenAI

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool uses Python to count the words and letters in a sentence!
def analyze_text(essay):
    print(f"\n   [🎒 TOOL RUNNING] Analyzing your homework...")
    
    # Python can count all the letters and spaces using 'len()'
    total_characters = len(essay)
    
    # Python can split the sentence into a list of words, and count them!
    words_list = essay.split()
    total_words = len(words_list)
    
    return f"Success! Your essay has {total_words} words and {total_characters} characters."

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its text analyzer!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "analyze_text", 
        "description": "Use this tool whenever the user asks you to count the words, characters, or length of an essay or sentence.",
        "parameters": { 
            "type": "object",
            "properties": {
                "essay": { 
                    "type": "string", 
                    "description": "The exact sentence or essay the user wrote (for example: 'Hello world')."
                }
            },
            "required": ["essay"]
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot to grade our homework!
user_question = "My teacher said my essay must be 10 words long. Did I write enough? Here is my essay: 'Dinosaurs are the coolest animals that ever lived on Earth.'"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# Send everything to the robot!
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my text analyzer tool to count the words!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    arguments = json.loads(tool_request.function.arguments)
    
    # The robot pulls out the exact essay we wrote
    text_to_check = arguments["essay"]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY ANALYZE THE TEXT!
    # ---------------------------------------------------------
    # Python physically counts the words!
    tool_result = analyze_text(text_to_check)
    print(f"\n Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is preparing your final grade...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Straight A's!** You just saved yourself a ton of time checking your homework!

---

## 🤔 Example 16 - Decision Maker Agent (Random Picker) - Full Working Code

For our 16th agent, we are going to build a "Decision Maker Agent"! This example demonstrates how AI can process lists of data provided by the user and make unbiased, randomized selections. 

```python
"""
 PROFESSOR'S GUIDE: YOUR DECISION MAKER AGENT
==================================================
Welcome back! 

For our 16th agent, we are going to build a "Decision Maker Agent"! 🤔

 WHAT DOES IT DO?
Have you ever been unable to decide what to eat for dinner? 
Or maybe you are playing a board game with friends and you don't know 
who should go first?

Instead of arguing, you just ask your robot: 
"I can't decide what to eat. My options are: Pizza, Tacos, Burgers, or Sushi. 
Can you pick a random winner for me?"

The robot will use its "Random Picker" tool to act like a spinning wheel, 
fairly picking one option for you!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json 
from openai import OpenAI
import random # 'random' helps us pick a random winner fairly!

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool spins a virtual wheel to pick a random winner!
def pick_random_choice(options_text):
    print(f"\n   [🤔 TOOL RUNNING] Spinning the virtual wheel of choices...")
    
    # We split the long sentence into a nice list of options!
    # (For example: "Pizza, Tacos" becomes ["Pizza", "Tacos"])
    options_list = options_text.split(",")
    
    # We ask Python to pick one randomly!
    winner = random.choice(options_list)
    
    # .strip() just cleans up any extra spaces the user accidentally typed!
    clean_winner = winner.strip()
    
    return f"Success! I have randomly selected: {clean_winner}"

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its random picker!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "pick_random_choice", 
        "description": "Use this tool whenever the user asks you to make a decision, pick a random winner, or choose from a list of options.",
        "parameters": { 
            "type": "object",
            "properties": {
                "options_text": { 
                    "type": "string", 
                    "description": "A comma-separated list of the options (for example: 'Pizza, Tacos, Burgers')."
                }
            },
            "required": ["options_text"]
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot to make a tough decision for us!
user_question = "I can't decide what to eat for dinner. My options are: Pizza, Tacos, Burgers, or Sushi. Can you randomly pick one for me?"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# Send everything to the robot!
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my random picker tool to make a decision!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    arguments = json.loads(tool_request.function.arguments)
    
    # The robot pulls out the list of food options we gave it
    options = arguments["options_text"]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY SPIN THE WHEEL!
    # ---------------------------------------------------------
    # Python physically picks a random winner!
    tool_result = pick_random_choice(options)
    print(f"\n Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is preparing to announce the winner...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Decision Made!** You never have to argue about where to eat dinner again!

---

## ✈️ Example 17 - Travel Assistant Agent (Temperature Converter) - Full Working Code

For our 17th agent, we are going to build a "Travel Assistant Agent"! This example deals with unit conversion, a very common math task that is extremely practical for anyone traveling or talking to international friends.

```python
"""
 PROFESSOR'S GUIDE: YOUR TRAVEL ASSISTANT AGENT
==================================================
Welcome back! 

For our 17th agent, we are going to build a "Travel Assistant Agent"! ✈️

 WHAT DOES IT DO?
Imagine you live in the United States and you are packing for a trip to Europe.
Your friend in London says, "Make sure you pack warm clothes! It is only 15 degrees Celsius here!"

You have no idea what 15 degrees Celsius means! Is it freezing? Is it hot?
Instead of being confused, you ask your robot: 
"My friend says it is 15 degrees Celsius outside. What is that in Fahrenheit?"

The robot will use its "Temperature Converter" tool to instantly do the math
and tell you exactly how cold it is!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json 
from openai import OpenAI

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool uses the official math formula to convert temperatures!
def convert_celsius_to_fahrenheit(celsius):
    print(f"\n   [✈️ TOOL RUNNING] Converting {celsius}°C to Fahrenheit...")
    
    # The magic math formula: Multiply by 9/5 and add 32
    fahrenheit = (celsius * 9/5) + 32
    
    return f"Success! {celsius} degrees Celsius is equal to {fahrenheit} degrees Fahrenheit."

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its temperature converter!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "convert_celsius_to_fahrenheit", 
        "description": "Use this tool whenever the user asks you to convert a temperature from Celsius to Fahrenheit.",
        "parameters": { 
            "type": "object",
            "properties": {
                "celsius": { 
                    "type": "number", 
                    "description": "The temperature in Celsius that needs to be converted (for example: 15 or 30.5)."
                }
            },
            "required": ["celsius"]
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot to help us pack for our trip!
user_question = "My friend in London says it is 15 degrees Celsius outside. What is that in Fahrenheit? Do I need a winter coat?"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# Send everything to the robot!
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my temperature converter tool to help them pack!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    arguments = json.loads(tool_request.function.arguments)
    
    # The robot pulls out the exact Celsius number from our sentence
    temp_c = arguments["celsius"]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY CONVERT THE TEMPERATURE!
    # ---------------------------------------------------------
    # Python physically calculates the new temperature!
    tool_result = convert_celsius_to_fahrenheit(temp_c)
    print(f"\n Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is preparing your final travel advice...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Ready to Pack!** You just saved yourself a ton of confusion when traveling abroad!

---

## 🛍️ Example 18 - Shopping Assistant Agent (Discount Calculator) - Full Working Code

For our 18th agent, we are going to build a "Shopping Assistant Agent"! This is an incredibly practical daily-life tool that teaches AI how to calculate percentages and subtraction.

```python
"""
 PROFESSOR'S GUIDE: YOUR SHOPPING ASSISTANT AGENT
==================================================
Welcome back! 

For our 18th agent, we are going to build a "Shopping Assistant Agent"! 🛍️

 WHAT DOES IT DO?
Imagine you are at the mall and you find a pair of shoes you really want.
They cost $80, but there is a big sign that says "25% OFF SALE!"

You don't want to open your calculator app and try to remember how 
percentages work. Instead, you just ask your robot: 
"I found shoes for $80 and they are 25% off. How much do they cost now?"

The robot will use its "Discount Calculator" tool to instantly do the math
and tell you the exact final price!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json 
from openai import OpenAI

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tool)
# ---------------------------------------------------------
# This tool uses math to figure out how much money you are saving!
def calculate_sale_price(original_price, discount_percent):
    print(f"\n   [🛍️ TOOL RUNNING] Calculating a {discount_percent}% discount on ${original_price}...")
    
    # First, we figure out how much money we are saving
    money_saved = original_price * (discount_percent / 100)
    
    # Then we subtract our savings from the original price
    final_price = original_price - money_saved
    
    # We return the answer nicely formatted with dollar signs!
    return f"You save ${money_saved:.2f}! The final sale price is ${final_price:.2f}."

# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL
# ---------------------------------------------------------
# We teach the robot how to use its discount calculator!
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "calculate_sale_price", 
        "description": "Use this tool whenever the user asks you to calculate a discount, a sale price, or how much an item costs after a percentage off.",
        "parameters": { 
            "type": "object",
            "properties": {
                "original_price": { 
                    "type": "number", 
                    "description": "The original cost of the item before the sale (for example: 80 or 45.99)."
                },
                "discount_percent": {
                    "type": "number",
                    "description": "The percentage off the item is on sale for (for example: 25 or 50)."
                }
            },
            "required": ["original_price", "discount_percent"]
        }
    }
}]

# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# Let's ask the robot to help us shop!
user_question = "I found a pair of shoes I really want. They cost $80, but there is a 25% off sale. How much do they cost now?"
print(f" YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is thinking...")

# Send everything to the robot!
response = client.chat.completions.create(
    model=MODEL_NAME, 
    messages=messages, 
    tools=tools_manual
)

ai_reply = response.choices[0].message

# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:
    
    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT USES ITS HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I need to use my discount calculator tool to help them shop!'\n")
    
    tool_request = ai_reply.tool_calls[0]
    arguments = json.loads(tool_request.function.arguments)
    
    # The robot pulls out the exact price and discount from our sentence
    price = arguments["original_price"]
    discount = arguments["discount_percent"]
    
    # ---------------------------------------------------------
    # STEP 7: WE ACTUALLY CONVERT THE TEMPERATURE!
    # ---------------------------------------------------------
    # Python physically calculates the new sale price!
    tool_result = calculate_sale_price(price, discount)
    print(f"\n Tool returned: {tool_result}\n")
    
    # ---------------------------------------------------------
    # STEP 8: GIVE THE RESULT BACK TO THE ROBOT
    # ---------------------------------------------------------
    messages.append(ai_reply) 
    messages.append({
        "role": "tool", 
        "tool_call_id": tool_request.id, 
        "content": tool_result
    }) 
    
    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    print(" AI is preparing your final price check...")
    
    final_response = client.chat.completions.create(
        model=MODEL_NAME, 
        messages=messages
    )
    
    print("\n FINAL ANSWER FROM AI:")
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT DIDN'T NEED HANDS!
    # ---------------------------------------------------------
    print(" AI DECISION: 'I don't need a tool for this.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)
```

> 🎉 **Smart Shopper!** You just saved yourself the headache of doing percentage math!
