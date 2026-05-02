# Module 6: The Agent's Body (Classes & OOP)

Welcome to Module 6! 🏗️

Up until now, our agent's brain, hands, and memory have been scattered all over our script. It's like having a robot whose head is in the kitchen, hands are in the garage, and memory is in the attic! 

To build complex agents, we need to package everything into a single, organized unit. In Python, we do this using **Classes** (Object-Oriented Programming).

---

## 🤖 1. What is a Class? (The Blueprint)
A **Class** is a blueprint for creating an "Object." 
Think of a class as the blueprint for a robot. It defines:
*   **Attributes:** What the robot *is* (Name, Model, Battery Level).
*   **Methods:** What the robot *does* (Think, Speak, Use Tool).

When we create an "instance" of the class, we are actually building the robot from that blueprint.

```python
class RobotAgent:
    # The __init__ method is like the robot's assembly line
    def __init__(self, name):
        self.name = name  # An Attribute
        self.memory = []  # Another Attribute
        
    # A Method (What the robot does)
    def say_hello(self):
        print(f"Hello, I am {self.name}!")

# Creating the robot!
my_agent = RobotAgent("Jarvis")
my_agent.say_hello()
```

## 🧠 2. Why use Classes for Agents?
Classes allow us to keep the Agent's **State** (its memory and settings) alive inside the object. Instead of passing `chat_history` back and forth between functions, the agent simply carries its memory around inside `self`.

---

## 🚀 Let's Build a Reusable Agent Class!

We are going to build a professional `AIAgent` class. It will hold its own name, its own memory, and its own "Brain" (the LLM connection). This makes it incredibly easy to create multiple different agents in one script!

Create a file named `06_agent_class.py` in your `Python_For_AI_Course` folder.

```python
"""
==================================================
 MODULE 6: THE AGENT'S BODY (CLASSES)
==================================================
In this script, we package our AI logic into a 
reusable 'Class'. This is how professional 
engineers build scalable Agent systems.
"""

from openai import OpenAI
import json

class AIAgent:
    # ---------------------------------------------------------
    # 1. INITIALIZING THE AGENT (The Constructor)
    # ---------------------------------------------------------
    def __init__(self, agent_name: str, system_prompt: str):
        self.name = agent_name
        self.client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
        
        # The agent keeps its OWN memory inside its body!
        self.memory = [{"role": "system", "content": system_prompt}]
        print(f"🤖 Agent '{self.name}' has been initialized!")

    # ---------------------------------------------------------
    # 2. THE THINKING METHOD
    # ---------------------------------------------------------
    def ask(self, user_question: str):
        print(f"\n[{self.name} is thinking...]")
        
        # Add the question to the agent's internal memory
        self.memory.append({"role": "user", "content": user_question})
        
        # Call the LLM
        response = self.client.chat.completions.create(
            model="llama3.2",
            messages=self.memory
        )
        
        answer = response.choices[0].message.content
        
        # Add the AI's answer to internal memory
        self.memory.append({"role": "assistant", "content": answer})
        
        return answer

# ---------------------------------------------------------
# 3. USING OUR NEW AGENT BLUEPRINT!
# ---------------------------------------------------------

# We can now create two DIFFERENT agents with DIFFERENT personalities
# using the exact same class!

# Agent 1: The Scientist
science_bot = AIAgent(
    agent_name="Dr. Quantum", 
    system_prompt="You are a brilliant physicist. Explain things simply."
)

# Agent 2: The Chef
chef_bot = AIAgent(
    agent_name="Chef Gordon", 
    system_prompt="You are a world-class chef. Give delicious recipe advice."
)

# Testing Agent 1
print(f"\nDR. QUANTUM SAYS: {science_bot.ask('What is an atom?')}")

# Testing Agent 2
print(f"\nCHEF GORDON SAYS: {chef_bot.ask('How do I make a perfect steak?')}")

print("\n--- SUMMARY ---")
print(f"Dr. Quantum's memory length: {len(science_bot.memory)} messages")
print(f"Chef Gordon's memory length: {len(chef_bot.memory)} messages")
```
