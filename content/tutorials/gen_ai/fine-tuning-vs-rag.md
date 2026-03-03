# Phase 7: Fine-tuning + LoRA - Step 1 (When to Fine-tune vs. RAG)

You've mastered **RAG** (Retrieval-Augmented Generation). You might think: *"If RAG is so good, why do we need Fine-tuning?"*

Today, we learn the most important strategic decision an AI Engineer makes: **Updating the Knowledge (RAG)** vs. **Updating the Behavior (Fine-tuning).**

---

## 1. The Core Difference

| Feature | **RAG** (The Library) | **Fine-tuning** (The Education) |
| :--- | :--- | :--- |
| **Analogy** | Like giving a student an open textbook during an exam. | Like the student studying for weeks before the exam. |
| **Best for...** | New facts, news, private documents. | Specific tone, complex format, specialized jargon. |
| **Cost** | Cheap (Storing files in a database). | Expensive (High GPU costs and GPU time). |
| **Updating** | Instant (Just add a new file to the DB). | Slow (Needs a new training run). |

---

## 2. The "Golden Rule"
- If the AI needs to **KNOW** something new (e.g., "What is our company's Q3 revenue?"), use **RAG**.
- If the AI needs to **ACT** differently (e.g., "Speak only in 18th-century medical Latin"), use **Fine-tuning**.

---

## 3. The Coding Exercise (Hands-on)

We are going to build a "Project Diagnostic" script. This script asks you about your project and tells you whether you should use RAG, Fine-tuning, or both.

#### Step 1: The "Decision Logic" script
Create a file named `decision_logic.py` inside your `Phase7` folder:

```python
def recommend_strategy(needs_new_facts, needs_new_style, data_changes_often):
    print(f"\nEvaluating Project: Facts={needs_new_facts}, Style={needs_new_style}, Dynamic={data_changes_often}")
    
    if data_changes_often:
        return "STRATEGY: RAG (Fine-tuning is too slow for data that changes daily)."
    
    if needs_new_style and not needs_new_facts:
        return "STRATEGY: Fine-tuning (Better for teaching a specific voice or formatting logic)."
    
    if needs_new_facts and needs_new_style:
        return "STRATEGY: Hybrid (Fine-tune for the style, use RAG for the facts)."
    
    return "STRATEGY: Start with RAG (It's easier and cheaper)."

# --- SIMULATION ---
print("--- AI ARCHITECTURE CONSULTANT ---")
# Scenario: A Law firm needs a bot for their private cases (which update daily)
print(recommend_strategy(True, False, True))

# Scenario: A company wants a bot that writes code exactly in their proprietary language style
print(recommend_strategy(False, True, False))
```

---

## 4. Why this matters (Job Insight)
A common mistake juniors make is trying to fine-tune a model to "learn" their company's documents. **Don't do this.** Models are bad at memorizing facts during fine-tuning. 

Senior Engineers use Fine-tuning to make a model **shorter, cheaper, and specialized** at a specific task (like converting Medical Notes to JSON).

---
**Summary:**
- **RAG:** For Knowledge.
- **Fine-tuning:** For Behavior/Style.

**Next Step:** Learn how to create the "Golden Dataset": [Dataset preparation & cleaning](file:///d:/myFirstAITest/Phase7/phase7_data.md). 🚀
