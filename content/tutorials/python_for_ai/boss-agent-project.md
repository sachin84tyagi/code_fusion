# Module 8: The Boss Agent (Capstone Project) 🏆

Welcome to the grand finale! You have mastered all the individual components of Agentic AI. Now, it's time to assemble them into a single, high-powered system.

We are going to build **The Research Assistant Agent**. This is a "Boss Agent" because it combines every single skill we have learned so far.

---

## 🛠️ What makes it a "Boss Agent"?

1.  **Classes (The Body):** We will wrap the entire agent in a `ResearchAgent` class.
2.  **APIs (The Senses):** It will use the internet to find information.
3.  **JSON & Files (The Memory):** It will save its findings into a permanent file so it doesn't forget.
4.  **Loops & Logic (The Brain):** It will autonomously loop until it has found enough information.
5.  **Error Handling (The Armor):** It will handle internet connection issues without crashing.

---

## 🚀 Let's Build the Final Boss!

Create a file named `08_boss_agent.py` in your `Python_For_AI_Course` folder.

```python
"""
==================================================
 MODULE 8: THE BOSS AGENT (CAPSTONE)
==================================================
This agent is a fully autonomous Research Assistant.
It combines Tools, Memory, Loops, Classes, and APIs.
"""

from openai import OpenAI
import requests
import json
import os

class ResearchAgent:
    def __init__(self, name):
        self.name = name
        self.memory_file = f"{name.lower()}_research.json"
        self.client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
        
        # Initial System Instructions
        self.history = [{
            "role": "system", 
            "content": f"You are {self.name}, an expert researcher. Use your tools to find facts and save them to memory."
        }]
        
        print(f"🏆 {self.name} is ready for duty!")

    # ---------------------------------------------------------
    # TOOL 1: WEB SEARCH (The Senses)
    # ---------------------------------------------------------
    def web_search(self, topic: str):
        print(f"   [🔍 SEARCHING] Finding info on: {topic}...")
        try:
            # Using our friendly weather/info API as a search simulator
            url = f"https://wttr.in/{topic}?format=j1"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                # Return a snippet of data
                return f"Found data for {topic}: It is currently {data['current_condition'][0]['temp_C']}C there."
            return "Search failed: Could not find that topic."
        except Exception as e:
            return f"Search Error: {e}"

    # ---------------------------------------------------------
    # TOOL 2: SAVE TO FILE (The Memory)
    # ---------------------------------------------------------
    def save_fact(self, fact: str):
        print(f"   [💾 SAVING] Writing to memory: {fact}")
        research_data = []
        if os.path.exists(self.memory_file):
            with open(self.memory_file, "r") as f:
                research_data = json.load(f)
        
        research_data.append(fact)
        
        with open(self.memory_file, "w") as f:
            json.dump(research_data, f, indent=4)
        
        return "Fact saved successfully."

    # ---------------------------------------------------------
    # THE AUTONOMOUS BRAIN (The Loop)
    # ---------------------------------------------------------
    def run_research(self, goal: str):
        print(f"\n🚀 STARTING RESEARCH GOAL: {goal}")
        self.history.append({"role": "user", "content": goal})
        
        tools_manual = [
            {
                "type": "function",
                "function": {
                    "name": "web_search",
                    "description": "Search the web for info.",
                    "parameters": {
                        "type": "object",
                        "properties": {"topic": {"type": "string"}},
                        "required": ["topic"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "save_fact",
                    "description": "Save a researched fact to permanent memory.",
                    "parameters": {
                        "type": "object",
                        "properties": {"fact": {"type": "string"}},
                        "required": ["fact"]
                    }
                }
            }
        ]

        # Autonomous loop (Logic)
        steps = 0
        while steps < 3:
            steps += 1
            print(f"\n--- Research Step {steps} ---")
            
            response = self.client.chat.completions.create(
                model="llama3.2",
                messages=self.history,
                tools=tools_manual
            )
            
            ai_msg = response.choices[0].message
            self.history.append(ai_msg)
            
            if ai_msg.tool_calls:
                for call in ai_msg.tool_calls:
                    args = json.loads(call.function.arguments)
                    
                    if call.function.name == "web_search":
                        result = self.web_search(args.get("topic", ""))
                    elif call.function.name == "save_fact":
                        result = self.save_fact(args.get("fact", ""))
                    
                    self.history.append({"role": "tool", "tool_call_id": call.id, "content": result})
            else:
                print("\n✅ Research Complete!")
                print(ai_msg.content)
                break

# ---------------------------------------------------------
# EXECUTION
# ---------------------------------------------------------
my_boss_agent = ResearchAgent("Titan")
my_boss_agent.run_research("Find the weather for New York and Tokyo, and save them to my memory file.")
```

---

## 🎉 THE GRADUATION CHALLENGE

You have the code. You have the knowledge. You have the power.

**Your final challenge:** Can you add a THIRD tool to the `ResearchAgent`? Maybe a `calculator` tool so it can compare the temperatures it finds?

Congratulations, Agentic AI Engineer. You are ready to build the future! 🚀
```
