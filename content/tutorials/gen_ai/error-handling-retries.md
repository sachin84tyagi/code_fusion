# Phase 6: LLM Engineering (Real Systems) - Step 2 (Error Handling & Retries)

API calls are flaky. Servers go down, internet connections drop, and you will eventually hit **Rate Limits** (the AI telling you "You're talking too fast!"). 

In a real app, you can't just let the code crash. You need **Retry Logic**.

---

## 1. The Common AI Errors
1.  **RateLimitError:** You've exceeded your project's quota.
2.  **APITimeoutError:** The AI took too long to think.
3.  **APIConnectionError:** Your Wi-Fi or their server blinked.

## 2. Using the "Tenacity" Library
Instead of writing complex `while` loops and `try/except` blocks everywhere, professional Python developers use **Tenacity**. It uses **Decorators** to handle retries automatically.

- **Exponential Backoff:** Waiting longer and longer between retries (e.g., 1s, 2s, 4s, 8s). This prevents you from "bombarding" a struggling server.

---

## 3. The Coding Exercise (Hands-on)

We are going to build a script that simulates a "Flaky" AI connection and uses Tenacity to keep trying until it works.

#### Step 1: Install Tenacity
```bash
pip install tenacity
```

#### Step 2: The "Error Handling" script
Create a file named `error_handling.py` inside your `Phase6` folder:

```python
import random
from tenacity import retry, stop_after_attempt, wait_exponential

# Simulation of a "Flaky" API
attempt_count = 0

@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=2, max=10))
def call_flaky_ai():
    global attempt_count
    attempt_count += 1
    
    print(f"Connection attempt {attempt_count}...")
    
    # 70% chance of failure to simulate reality
    if random.random() < 0.7:
        print("❌ Server error! Retrying...")
        raise Exception("AI Server is Busy")
    
    return "✅ Success! The AI says Hello."

# Run the protected call
try:
    result = call_flaky_ai()
    print(f"\nFinal Result: {result}")
except Exception as e:
    print(f"\nStopped after 5 tries. Error: {e}")
```

---

## 4. Why this matters (Production Insight)
If your AI app is used by 1,000 people, errors *will* happen every day. By using Tenacity, you ensure that 99% of those errors are fixed instantly without the user ever seeing a "System Offline" screen. This is the difference between a "School Project" and "Production Software."

---
**Summary:**
- **Rate Limits:** The AI's physical speed limit.
- **Tenacity:** The library that makes your code "stubborn."
- **Backoff:** Waiting smarter, not harder.

**Next Step:** We'll dive into how AI actually interacts with the real world: [Tool Use / Function Calling](file:///d:/myFirstAITest/Phase6/phase6_tools.md). 🚀
