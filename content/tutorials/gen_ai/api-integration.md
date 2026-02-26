# Phase 3: Using LLM APIs - Step 1 (API Integration)

In Phase 1 & 2, we learned how AI thinks (Tokens/Embeddings) and how to handle its data (NumPy/Pandas). Now, it's time to connect your Python code to the **"Deep Blue Sea" of Intelligence**: The LLM APIs.

---

## 1. What is an API? (The Restaurant Analogy)
Think of an LLM (like GPT-4) as a **Chef** in a kitchen.
- **You (The Customer):** You don't go into the kitchen and cook. You sit at a table.
- **The API (The Waiter):** You give the waiter your order (The Prompt). The waiter takes it to the kitchen, the Chef cooks it, and the waiter brings it back to you.

In code, the **API** is just a URL that accepts your text and returns the AI's response.

## 2. Why use the OpenAI SDK?
Even if you use local models or other providers (like Groq, Together, or Mistral), almost everyone uses the **OpenAI Python Library**. It has become the "Standard Language" for AI communication.

---

## 3. The Coding Exercise (Hands-on)

We are going to write a professional "AI Client." 

> [!TIP]
> **No API Key? No problem!** I've built a "Mock Mode" into the script so you can learn the professional structure without paying a cent.

#### Step 1: Install the library
Run this in your terminal:
```bash
pip install openai
```

#### Step 2: The "API Basics" script
Create a file named `api_basics.py` inside your `Phase3` folder:

```python
from openai import OpenAI

# 1. Step: Set up the Client
# In the real world, you'd put your 'sk-...' key here.
# For learning, we are using a "DUMMY" key.
client = OpenAI(api_key="sk-DUMMY-KEY-FOR-LEARNING")

# 2. Step: Define the "Mock Mode" vs "Real Mode"
USE_MOCK = True  # Set to False only if you have a real API key!

def ask_ai(prompt):
    print(f"\n[USER]: {prompt}")
    
    if USE_MOCK:
        # This mimics exactly what a real API response looks like
        response_text = f"MOCK RESPONSE: I am an AI. You asked about '{prompt}'. I processed your tokens and here is the result!"
        print(f"[AI]: {response_text}")
        return response_text
    else:
        # REAL API CALL (Requires $ balance and a valid key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        print(f"[AI]: {response.choices[0].message.content}")
        return response.choices[0].message.content

# 3. Test our Client
ask_ai("What is the capital of France?")
ask_ai("Write a 1-line Python code to print 'Hello AI'.")
```

---

## 4. Why this matters (Job Insight)
In a production environment, you will handle **API Keys** using environment variables (never hardcoded!). You will also learn about **Rate Limits** (how many "orders" the kitchen can handle at once) and **Cost Tracking**. 

But for now, mastering this `Request -> Response` loop is your #1 priority.

---
**Summary:**
- **API:** The "Waiter" that connects your code to the AI "Chef".
- **SDK:** The library that makes sending requests easy.

**Next Step:** Once you run this, we'll dive into [Chat Completions, System Prompts, and Parameters](file:///d:/myFirstAITest/Phase3/phase3_completions.md). This is where you learn to control the AI's behavior! 🚀
