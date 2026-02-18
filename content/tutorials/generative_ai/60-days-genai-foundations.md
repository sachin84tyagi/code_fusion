# 🚀 GENAI FOUNDATIONS — DAYS 1–3

**Goal:** Build strong intuition of AI → LLMs → Transformers, understand tokens/embeddings/attention, set up environment, and run your first Hello‑LLM (API + Local).

---

# DAY 1 — AI / ML / DL / GENERATIVE AI (CORE INTUITION)

## 1. What is AI?

Artificial Intelligence (AI) = Machines performing tasks that normally require human intelligence.
Examples: Chatbots, Recommendation Systems, Self‑Driving, Voice Assistants.

## 2. Machine Learning (ML)

ML = Machines learn patterns from data instead of explicit programming.

Example:
Spam Detection → Learn from thousands of emails.

## 3. Deep Learning (DL)

DL = Subset of ML using Neural Networks with many layers.
Used for: Vision, Speech, Language, Generative AI.

## 4. Generative AI

Generative AI = Models that CREATE new content.

Creates:

- Text (ChatGPT)
- Images (Stable Diffusion)
- Code (Copilot)
- Audio / Video

Key Idea: Learn probability of next token.

---

## AI → ML → DL → GENAI RELATION

```
Artificial Intelligence
    ├── Machine Learning
    │     ├── Deep Learning
    │     │     ├── Generative AI
```

---

## Mini Lab — Understanding Probability

Sentence: "The sky is \_\_\_"
Model predicts:

- blue (0.85)
- dark (0.08)
- green (0.01)

Model chooses highest probability.

---

# DAY 2 — LLM + TRANSFORMER INTUITION

## 1. What is LLM?

LLM = Large Language Model trained on massive text.
Goal: Predict next token.

Examples:

- GPT
- LLaMA
- Mistral

---

## 2. Transformer — Core Idea

Transformer = Architecture that understands CONTEXT using ATTENTION.

Before Transformer → RNN (slow, forget context)
After Transformer → Parallel, long memory, powerful.

---

## Transformer Flow (High Level)

```
Input Text → Tokens → Embeddings → Transformer Blocks → Output Tokens
```

---

## 3. Tokens (Conceptual)

Token = Smallest unit model understands.

Example:
"Generative AI is amazing"
→ ["Gener", "ative", " AI", " is", " amazing"]

Model works on NUMBERS not text.

---

## 4. Embeddings

Embedding = Convert token → vector (meaning in numbers).

Example:
King ≈ Queen (similar vectors)
Paris ≈ France

Embedding captures SEMANTIC MEANING.

---

## 5. Attention (The MAGIC)

Attention = Each word looks at other words to understand meaning.

Example:
"The animal didn't cross the road because IT was tired"
"IT" refers to → animal (model learns using attention).

---

## Self‑Attention Intuition

```
Every word asks:
Which other words are important for me?
```

---

## Mini Lab — Human Attention

Sentence: "I deposited money in the bank"

Possible meanings of "bank":

- River bank
- Financial bank

Context decides meaning → Same as attention.

---

# DAY 3 — TOKENS / EMBEDDINGS / SETUP / HELLO‑LLM

## 1. Environment Setup

### Install Python

Download → [https://python.org](https://python.org)

Verify:

```
python --version
```

### Install VS Code + Extensions

- Python
- Pylance
- Jupyter (optional)

### Install Git

```
git --version
```

---

## Optional GPU Setup

Only needed for LOCAL models / training.

- Install NVIDIA Drivers
- Install CUDA
- Install PyTorch with CUDA

Check:

```
python -c "import torch; print(torch.cuda.is_available())"
```

---

## 2. Python Virtual Environment

```
python -m venv venv
venv\\Scripts\\activate   (Windows)
source venv/bin/activate   (Mac/Linux)
```

Install basic libs:

```
pip install openai transformers torch python-dotenv
```

---

## 3. HELLO‑LLM (API VERSION)

Create file: `hello_llm_api.py`

```python
from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Explain Generative AI in one line"}]
)

print(response.choices[0].message.content)
```

Run:

```
python hello_llm_api.py
```

---

## 4. HELLO‑LLM (LOCAL MODEL — HuggingFace)

Create file: `hello_llm_local.py`

```python
from transformers import pipeline

pipe = pipeline("text-generation", model="distilgpt2")

result = pipe("Generative AI is", max_length=30)
print(result[0]['generated_text'])
```

Run:

```
python hello_llm_local.py
```

---

## What You Learned (Days 1–3)

- AI vs ML vs DL vs Generative AI
- LLM intuition
- Transformer high‑level flow
- Tokens / Embeddings / Attention concept
- Python + VS Code + Git setup
- Virtual environment
- API LLM call
- Local LLM run

---

## Real‑World Understanding

When you use ChatGPT:

1. Text → Tokens
2. Tokens → Embeddings
3. Transformer processes context using Attention
4. Model predicts next token
5. Tokens → Text output

You now understand the CORE of GenAI 🚀

---

## Next (Day 4–7 Preview)

- Prompt Engineering Deep Dive
- Temperature / Top‑p / Tokens control
- Chat vs Completion APIs
- Cost optimization
- Streaming responses
- Build Smart CLI Chatbot

---

**End of Days 1–3 — GenAI Foundations**

---

# 🚀 DAYS 4–7 — PROMPT ENGINEERING + PARAMETERS + CHATBOT

**Goal:** Master prompting, understand LLM parameters, control output, and build a smart CLI chatbot.

---

# DAY 4 — PROMPT ENGINEERING FUNDAMENTALS

## What is Prompt Engineering?

Prompt Engineering = Designing clear, structured inputs to get best output from LLM.

Bad Prompt:

```
Explain AI
```

Good Prompt:

```
Explain Artificial Intelligence in simple language with 3 real-world examples in 5 bullet points.
```

---

## Core Prompt Patterns

### 1. Instruction Prompt

Tell model what to do.

```
Summarize this article in 5 bullet points.
```

### 2. Role Prompt

Assign role to model.

```
Act as a senior Python engineer and explain decorators.
```

### 3. Few‑Shot Prompt

Give examples.

```
Input: 2+2
Output: 4
Input: 5+3
Output: 8
Input: 10+6
Output:
```

### 4. Chain‑of‑Thought

Force reasoning.

```
Solve step‑by‑step.
```

---

## Mini Lab

Improve this prompt:

```
Tell about ML
```

→ Add: role + structure + depth + examples.

---

# DAY 5 — LLM PARAMETERS (CONTROL THE MODEL)

## 1. Temperature (Creativity)

- 0 → Deterministic / factual
- 0.7 → Balanced
- 1.0 → Creative / random

Example:

```
Temperature 0 → "Sky is blue"
Temperature 1 → "Sky glows with endless blue"
```

---

## 2. Top‑P (Nucleus Sampling)

Controls probability mass.

- 0.9 → Safer
- 1.0 → Open

---

## 3. Max Tokens

Limits output length.

---

## 4. Frequency Penalty

Reduces repetition.

---

## 5. Presence Penalty

Encourages new topics.

---

## Mini Lab — Experiment

Change temperature = 0 vs 1 and compare output.

---

# DAY 6 — BUILD SMART CLI CHATBOT (API)

## Create: `chatbot.py`

```python
from openai import OpenAI
client = OpenAI()

print("AI Chatbot — type 'exit' to quit
")

while True:
    user = input("You: ")
    if user.lower() == "exit":
        break

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": user}],
        temperature=0.7,
        max_tokens=200
    )

    print("AI:", response.choices[0].message.content)
```

Run:

```
python chatbot.py
```

---

## Add Memory (Conversation Context)

```python
messages = []

while True:
    user = input("You: ")
    messages.append({"role": "user", "content": user})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    reply = response.choices[0].message.content
    messages.append({"role": "assistant", "content": reply})

    print("AI:", reply)
```

---

# DAY 7 — LOCAL CHATBOT + PROMPT MASTERY

## Local Chatbot (Transformers)

```python
from transformers import pipeline

chat = pipeline("text-generation", model="distilgpt2")

while True:
    user = input("You: ")
    result = chat(user, max_length=100)
    print("AI:", result[0]['generated_text'])
```

---

## Prompt Mastery Checklist

- Clear instruction
- Assign role
- Define format
- Limit length
- Ask reasoning
- Provide examples

---
