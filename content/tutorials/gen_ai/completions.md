# Phase 3: Using LLM APIs - Step 2 (Chat Completions & Parameters)

In the last step, we set up our "Waiter" (API Client). Now, let's learn how to give **specific instructions** to our "Chef" (AI) and how to control its "cooking style."

---

## 1. The Three Roles: Who is talking?
Modern AI models don't just take a prompt; they take a **Conversation History**. Every message in that history has a **Role**:

- **System:** The "Brain Settings." You tell the AI who it is (e.g., "You are a sarcastic pirate coach"). The user never sees this.
- **User:** Your input.
- **Assistant:** The AI's previous responses.

**Visual Intuition:** 
Think of the **System Prompt** as the "Rules of the Game." If you don't set it, the AI uses its default personality.

## 2. Parameters: Controlling the Output
Two dials are extremely important for an AI Engineer:

- **Temperature (0.0 to 2.0):** 
  - **0.0 (The Robot):** Always gives the most likely, factual answer. Perfect for code or math.
  - **1.0+ (The Poet):** More random and "creative." Might hallucinate more but sounds more human.
- **Max Tokens:** The limit on how long the AI's response can be.

---

## 3. The Coding Exercise (Hands-on)

We are going to see how a **System Prompt** and **Temperature** change the exact same question.

#### Step 1: The "Parameter Tester" script
Create a file named `chat_parameters.py` inside your `Phase3` folder:

```python
from openai import OpenAI

# Standard Setup with Mock Mode
client = OpenAI(api_key="sk-DUMMY")
USE_MOCK = True

def run_experiment(system_prompt, user_query, temperature):
    print(f"\n--- EXPERIMENT (Temp: {temperature}) ---")
    print(f"System Role: {system_prompt}")
    
    if USE_MOCK:
        # Simulated responses based on temperature
        if temperature < 0.5:
            response = "I am a logical assistant. The answer is factual."
        else:
            response = "ARGH! Listen here matey, the stars be tellin' me tales of wonder!"
        print(f"AI: {response}")
    else:
        # REAL API CALL
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            temperature=temperature,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ]
        )
        print(f"AI: {response.choices[0].message.content}")

# Test 1: Conservative/Factual (Low Temperature)
run_experiment(
    "You are a helpful assistant.", 
    "Tell me a story about a cat.", 
    temperature=0.0
)

# Test 2: Creative/Thematic (High Temperature)
run_experiment(
    "You are a creative storyteller who speaks like a pirate.", 
    "Tell me a story about a cat.", 
    temperature=1.2
)
```

---

## 4. Why this matters (Production Insight)
When building a **Customer Support Bot**, you would set Temperature to `0.0` and the System Prompt to `Focus only on our FAQ`. When building a **Creative Writing Assistant**, you'd set Temperature to `0.8` or higher to keep things interesting. 

Mastering these dials is what separates an "AI Hobbyist" from an "AI Engineer."

---
**Summary:**
- **Roles:** System, User, Assistant determine context.
- **Temperature:** Controls the balance between "Reliable" and "Random."

**Next Step:** Once you run this, we'll master [Structured Output (JSON mode)](file:///d:/myFirstAITest/Phase3/phase3_json_mode.md). This is how we get AI to return data your code can actually read! 🚀
