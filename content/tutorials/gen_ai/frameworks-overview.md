# Phase 6: LLM Engineering (Real Systems) - Step 5 (AI Frameworks Overview)

You've been building AI apps "from scratch" using raw Python and APIs. This is the best way to learn! But for big projects, engineers use **Frameworks** to save time and add structure.

Today, we look at the "Big Three" of the AI world.

---

## 1. LangChain: The Swiss Army Knife
**LangChain** is the most famous framework. It's built on the idea of **Chains** (linking different AI steps together).
- **Best for:** Complex agents, multi-step workflows, and integrating with 100+ different tools.
- **Vibe:** "I have a tool for everything, but it might be a bit complicated."

## 2. LlamaIndex: The Librarian
**LlamaIndex** focuses 100% on **Data**. It is the king of **RAG**.
- **Best for:** When you have massive amounts of data (PDFs, Databases, Slack) and you want the AI to "search" them perfectly.
- **Vibe:** "I'm the expert at connecting LLMs to your private data."

## 3. DSPy: The Scientist
**DSPy** is the newest and most "advanced" approach. It stops using "magic prompts" and starts using **Programming logic** to optimize your AI.
- **Best for:** High-accuracy production systems where you want the computer to "write the prompt" for you.
- **Vibe:** "Prompts are brittle; code is reliable."

---

## 4. The "Framework vs. Raw" Experiment

#### Step 1: The "Frameworks Demo" script
Create a file named `frameworks_demo.py` inside your `Phase6` folder:

```python
# Simulation of what a 'Chain' does in LangChain
# Why use a framework? Because it handles the "Glue" between steps.

def step_1_retrieve(query):
    return f"Context about {query}"

def step_2_format_prompt(context, query):
    return f"Use this: {context} to answer: {query}"

def step_3_call_ai(prompt):
    return "AI Answer based on context"

# THE RAW WAY (Manually connecting everything)
def raw_workflow(query):
    ctx = step_1_retrieve(query)
    p = step_2_format_prompt(ctx, query)
    ans = step_3_call_ai(p)
    return ans

# THE FRAMEWORK WAY (Conceptual)
# In LangChain, you would do: chain = step1 | step2 | step3
# The framework handles error logging, retries, and data passing automatically.

print("--- AI FRAMEWORKS OVERVIEW ---")
print(f"Result: {raw_workflow('Python AI')}")
print("\nPRO TIP: Frameworks like LangChain add a lot of 'under-the-hood' "
      "logic like automatic logging and tracing (LangSmith), which is "
      "huge for production teams!")
```

---

## 5. When to use which? (Job Insight)
- **Start Raw:** When learning or building a simple one-feature tool.
- **Use LlamaIndex:** If your main goal is "Chat with my Documents."
- **Use LangChain:** If your main goal is "Build an Autonomous Agent that uses tools."
- **Use DSPy:** If you are a Senior Engineer at a top-tier AI company.

---
**Summary:**
- **Frameworks:** Pre-built "Glue" for AI steps.
- **LangChain:** Agents & Tools.
- **LlamaIndex:** Data & RAG.
- **DSPy:** Scientific optimization.

**Next Step:** It's time for the Phase 6 Graduation! [Project: AI SQL Query Generator](file:///d:/myFirstAITest/Phase6/phase6_project.md). 🚀


# Phase 6: LLM Engineering (Real Systems) - Step 5 (Frameworks Overview)

As an AI Engineer, you don't always want to write every API call, retry loop, and database query from scratch. You want to use **LEGO blocks**. 

These LEGO blocks are called **AI Frameworks**.

---

## 1. The Big Three
| Framework | Best For... | The Vibe |
| :--- | :--- | :--- |
| **LangChain** | General Agents & Complexity | "I want to connect AI to *everything*." |
| **LlamaIndex** | Data Heavy / RAG | "I want the best search for my private files." |
| **DSPy** | Automatic Prompting | "I'm tired of writing prompts; let the code do it." |

---

## 2. Core Concepts You Must Know
Regardless of the framework, they all solve three problems:
1.  **Chains:** Connecting multiple steps. (Step A -> Step B -> Step C).
2.  **Memory:** Storing the history of a conversation.
3.  **Agents:** Letting the AI decide which tool to use in which order.

## 3. The "Framework" Mindset (Hands-on Simulation)

Instead of installing 2GB of libraries, let's look at the **Logic** that LangChain uses under the hood. We'll build a "Mini-Chain."

#### Step 1: The "Framework Patterns" script
Create a file named `framework_patterns.py` inside your `Phase6` folder:

```python
class SimpleChain:
    """Simulating the logic of LangChain."""
    def __init__(self, steps):
        self.steps = steps

    def run(self, initial_input):
        current_data = initial_input
        print(f"--- CHAIN STARTING ---")
        for i, step in enumerate(self.steps):
            print(f"Processing Step {i+1}...")
            # Each step 'transforms' the data for the next step
            current_data = step(current_data)
        return current_data

# --- OUR LEGO BLOCKS ---

def step_summarize(text):
    return f"SUMMARY: {text[:20]}..."

def step_translate(text):
    return f"TRANSLATION (Spanish): {text.replace('SUMMARY', 'RESUMEN')}"

# --- ASSEMBLING THE CHAIN ---
my_chain = SimpleChain([step_summarize, step_translate])

# Execute
final_output = my_chain.run("Large Language Models are changing how we write code.")
print(f"\nFINAL OUTPUT: {final_output}")
```

---

## 4. Why this matters (Job Insight)
In a job interview, don't just say "I know LangChain." Say: *"I use LangChain to manage complex, multi-step chains where I need to maintain state and handle tool routing automatically."*

**Pro Tip:** Start with **Pure Python** first. Only move to a framework when your code becomes 10 nested `if` statements. Frameworks make simple things harder, but they make impossible things possible.

---
**Summary:**
- **Frameworks:** Pre-built tools for common AI tasks.
- **LangChain:** The Swiss Army Knife.
- **LlamaIndex:** The Data Master.

**Next Step:** It's time for the final Phase 6 Graduation Project! [Project: AI SQL Query Generator](file:///d:/myFirstAITest/Phase6/phase6_project.md). 🚀
