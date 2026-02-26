# Phase 2: Python for AI - Step 1 (NumPy & Pandas Basics)

In Phase 1, we learned the "theory" of how AI works. Now, we need the "tools" to handle the massive amounts of data that AI processes. 

In the AI world, we don't just use standard Python lists. We use **NumPy** and **Pandas**.

---

## 1. NumPy: The Language of Tensors
AI models (like the Transformers we studied) think in "tensors"—which are just fancy multi-dimensional arrays. 

**Why NumPy?**
- **Speed:** Standard Python lists are slow. NumPy is written in C and is lightning fast.
- **Math:** It allows us to perform math on millions of numbers simultaneously (e.g., adding two lists of Embeddings).

## 2. Pandas: The AI Spreadsheet
If NumPy is for math, **Pandas** is for organization. It gives us a `DataFrame`, which is basically a supercharged Excel spreadsheet inside Python.

**Why Pandas?**
- **Cleaning:** AI needs clean data. Pandas helps you remove duplicates, fix missing text, and format JSON/CSV files.
- **Preparation:** Before we send text to an LLM, we often use Pandas to "chunk" it or structure it.

---

## 3. The Coding Exercise (Hands-on)

We are going to simulate a tiny AI dataset: a list of sentences and their "simulated" embedding scores.

#### Step 1: Install the libraries
```bash
pip install numpy pandas
```

#### Step 2: The Data Manipulation script
Create a file named `numpy_pandas_basics.py` inside your `Phase2` folder:

```python
import numpy as np
import pandas as pd

# --- PART 1: NumPy (The Vectors) ---
print("--- NumPy: Vector Math ---")
# Create two "Embeddings" (just 3 numbers for this example)
vector_a = np.array([0.1, 0.2, 0.3])
vector_b = np.array([0.4, 0.5, 0.6])

# In AI, we often add or multiply these vectors to combine meanings
combined = vector_a + vector_b
print(f"Vector A: {vector_a}")
print(f"Vector B: {vector_b}")
print(f"Combined Meaning: {combined}\n")

# --- PART 2: Pandas (The Dataset) ---
print("--- Pandas: Data Management ---")
# Create a tiny "AI Training Set"
data = {
    'Text': ["I love AI", "Python is great", "NumPy is fast"],
    'Topic': ["General", "Code", "Math"],
    'Tokens': [3, 3, 3]
}

df = pd.DataFrame(data)

# Show the "Spreadsheet"
print("Initial Dataset:")
print(df)

# AI Task: Filter the data (only show Code topics)
print("\nFiltered (Only Code):")
code_only = df[df['Topic'] == 'Code']
print(code_only)

# Add a calculation
df['TotalCharacters'] = df['Text'].apply(len)
print("\nUpdated Dataset with Length:")
print(df)
```

---

## 4. Why this matters for your AI journey
Soon, you will be making API calls to OpenAI or Claude. They often return data in JSON format. You will use **Pandas** to turn that JSON into a clean table and **NumPy** to handle the heavy mathematical similarity checks.

---
**Summary:**
- **NumPy:** Handling the math and vectors (Embeddings).
- **Pandas:** Handling the structured data (Datasets/Logs).

**Next Step:** Once you run this, we'll look at [Datasets, JSON, and CSV]
