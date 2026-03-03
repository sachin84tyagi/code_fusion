# Phase 6: LLM Engineering (Real Systems) - Step 4 (Context Windows & Latency)

Building an AI app is easy. Building a **FAST** and **EFFICIENT** AI app is hard. 
Today, we focus on the two biggest constraints for an AI Engineer: **Memory** (Context Windows) and **Speed** (Latency).

---

## 1. The Context Window (AI's Short-Term Memory)
Every AI has a limit on how much text it can "see" at one time. 
- **The Problem:** If you send a 500-page book to a model with a small window, it will literally "forget" the beginning of the book by the time it reaches the end.
- **The Solution:** We use libraries like `tiktoken` to count tokens *before* we send them, making sure we don't hit the limit and crash our app.

## 2. Latency (The Wait Time)
Why does the AI take 5 seconds to answer? 
1.  **Time to First Token (TTFT):** The time it takes for the AI to start typing.
2.  **Tokens Per Second (TPS):** How fast the AI finishes its sentence.

**The Golden Rule:** Users hate waiting. As an engineer, you must use **Streaming** (where the AI types word-by-word) so the user sees progress immediately.

---

## 3. The Coding Exercise (Hands-on)

We are going to build a script that counts tokens and uses **Streaming** to make the AI feel instantaneous.

#### Step 1: Install tiktoken
```bash
pip install tiktoken
```

#### Step 2: The "Latency Basics" script
Create a file named `latency_basics.py` inside your `Phase6` folder:

```python
import time
import tiktoken

def count_tokens(text):
    # 'cl100k_base' is the encoding used by GPT-4
    encoding = tiktoken.get_encoding("cl100k_base")
    num_tokens = len(encoding.encode(text))
    return num_tokens

def simulate_streaming_response(text):
    print("\n[AI]: ", end="", flush=True)
    for word in text.split():
        print(word + " ", end="", flush=True)
        time.sleep(0.1) # Simulate the thinking process
    print("\n")

# --- THE TEST ---
my_prompt = "Tell me a short poem about Python programming."
tokens = count_tokens(my_prompt)

print(f"--- PERFORMANCE METRICS ---")
print(f"Prompt Length: {len(my_prompt)} chars")
print(f"Token Count:   {tokens} tokens")

print("\nStarting Stream...")
start_time = time.time()
simulate_streaming_response("Python is sleek, codes are neat, making AI work is a treat!")
end_time = time.time()

print(f"Total Latency: {end_time - start_time:.2f} seconds")
```

---

## 4. Why this matters (Production Insight)
When you build a professional chatbot, you don't wait for the whole answer to be ready. You **stream** it. This makes the "Perceived Latency" go from 5 seconds to 0.2 seconds. In the eyes of your user, your app just became 25x faster.

---
**Summary:**
- **Context Window:** Don't overflow the AI's "brain."
- **Tiktoken:** The tool for measuring memory usage.
- **Streaming:** The secret to making AI feel fast.

**Next Step:** We'll see why we use Frameworks to manage all this: [LangChain / LlamaIndex / DSPy overview](file:///d:/myFirstAITest/Phase6/phase6_frameworks.md). 🚀
