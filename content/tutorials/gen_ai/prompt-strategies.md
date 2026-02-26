# Phase 4: Prompt Engineering (PRO) - Step 1 (Advanced Strategies)

You know how to talk to AI. Now, let's learn how to make it **smarter** using advanced communication patterns. High-level AI Engineering is 80% architectural design and 20% elite prompting.

## What to Watch For

- **Few-Shot:** Notice how the AI copies the exact format of your examples.  
- **Chain of Thought:** Notice how the AI explains its logic step-by-step, just like a human would.
---

## 1. Zero-Shot vs. Few-Shot
- **Zero-Shot:** You give the AI a task and no examples. 
  - *Example:* "Translate 'Apple' to Spanish."
- **Few-Shot:** You give the AI a few examples of how you want it to behave **before** asking your question. This is arguably the most powerful way to "program" an LLM.

**Simple Intuition:** Few-shot is like showing a new employee 3 finished reports before asking them to write a fourth one.

## 2. Chain of Thought (CoT)
AI models often "rush" to an answer, which leads to mistakes in logic. **Chain of Thought** forces the AI to "think out loud" step-by-step before giving the final answer.

**The Magic Phrase:** *"Let's think step by step."* (Adding this to a prompt can significantly increase accuracy in math and reasoning).

---

## 3. The Coding Exercise (Hands-on)

We are going to compare a "Lazy" prompt with a "Professional" Chain-of-Thought prompt for a complex logic puzzle.

#### Step 1: The "Strategy Tester" script
Create a file named `prompt_strategies.py` inside your `Phase4` folder:

```python
from openai import OpenAI

# Setup (Mock Mode enabled)
client = OpenAI(api_key="sk-DUMMY")
USE_MOCK = True

def test_prompt(strategy_name, prompt):
    print(f"\n--- Strategy: {strategy_name} ---")
    print(f"Prompt: {prompt[:60]}...")
    
    if USE_MOCK:
        if "Few-Shot" in strategy_name:
            reply = "Correct Answer: 42 (Pattern matched from examples)."
        elif "Chain" in strategy_name:
            reply = "Step 1: Analyze X. Step 2: Calculate Y. Result: 42."
        else:
            reply = "I think the answer is 40."
        print(f"AI: {reply}")
    else:
        # REAL API CALL
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        print(f"AI: {response.choices[0].message.content}")

# 1. Zero-Shot (Simple ask)
test_prompt("Zero-Shot", "Solve this math puzzle: 5 + 5 * 2")

# 2. Few-Shot (Give examples)
few_shot_prompt = """
Q: 2 + 2 * 2
A: 6
Q: 3 + 3 * 3
A: 12
Q: 5 + 5 * 2
A:
"""
test_prompt("Few-Shot", few_shot_prompt)

# 3. Chain of Thought (Force reasoning)
cot_prompt = "Solve 5 + 5 * 2. Let's think step by step to ensure we use PEMDAS correctly."
test_prompt("Chain of Thought", cot_prompt)
```

---

## 4. Why this matters (Production Insight)
In production, if your AI is making mistakes, don't just "try again." 
- Use **Few-Shot** to fix formatting errors.
- Use **Chain of Thought** to fix logic errors.

This is the bridge between a "shaky" AI feature and a "reliable" AI product.

---
**Summary:**
- **Few-Shot:** Use examples to show, not just tell.
- **CoT:** Use logic steps to prevent "brain farts."

**Next Step:** Once you run this, we'll look at [Role Prompting and Output Formatting](file:///d:/myFirstAITest/Phase4/phase4_formatting.md). 🚀
