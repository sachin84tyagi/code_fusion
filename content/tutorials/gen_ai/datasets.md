# Phase 2: Python for AI - Step 2 (Datasets, JSON, and CSV)

You know how to manipulate data with NumPy and Pandas. Now, let's learn how to **load and save** that data. In AI Engineering, we almost never type data manually; we read it from files or APIs.

---

## 1. JSON: The Language of APIs
**JSON (JavaScript Object Notation)** is the industry standard for sending data over the web. 
- **AI Use Case:** When you chat with ChatGPT or Gemini via code, the response comes back as a JSON object. It contains the text, the token count, and "metadata."

**Simple Intuition:** JSON is like a Python Dictionary. It uses `{key: value}` pairs and can be nested (a dictionary inside a list inside a dictionary).

## 2. CSV: The Language of Datasets
**CSV (Comma Separated Values)** is the standard for tabular data.
- **AI Use Case:** Collections of thousands of training examples, fine-tuning datasets, or log files are almost always stored as CSV (or the more advanced "Parquet" format).

**Simple Intuition:** CSV is like a simplified Excel spreadsheet saved as plain text.

---

## 3. The Coding Exercise (Hands-on)

We are going to simulate a production workflow:
1. Save a sample AI configuration as a **JSON** file.
2. Load a list of AI prompts from a **CSV** file using Pandas.

#### Step 1: The "Data I/O" script
Create a file named `datasets_io.py` inside your `Phase2` folder:

```python
import json
import pandas as pd
import os

# --- PART 1: Working with JSON (AI Config) ---
ai_config = {
    "model": "gpt-4",
    "temperature": 0.7,
    "max_tokens": 500,
    "tools": ["web_search", "calculator"]
}

# Save as JSON
with open('Phase2/config.json', 'w') as f:
    json.dump(ai_config, f, indent=4)

print("✅ JSON Config saved.")

# Load back
with open('Phase2/config.json', 'r') as f:
    loaded_config = json.load(f)
print(f"Loaded Model: {loaded_config['model']}\n")


# --- PART 2: Working with CSV (AI Training Data) ---
# We'll create a tiny CSV file for this example
data = {
    'id': [1, 2],
    'prompt': ["Explain gravity", "Write a joke"],
    'label': ["science", "humor"]
}
df_to_save = pd.DataFrame(data)
df_to_save.to_csv('Phase2/prompts.csv', index=False)
print("✅ CSV Prompts saved.")

# Load it with Pandas (The professional way)
df = pd.read_csv('Phase2/prompts.csv')
print("\nLoaded Dataset (Pandas):")
print(df)
```

---

## 4. Why this matters (Production Insight)
In a real job, you won't just have 2 prompts. You might have a `data.csv` with 10,000 customer reviews. You will use **Pandas** to load them, clean them, and then use a loop to send each one to an AI model via a **JSON** API call.

---
**Summary:**
- **JSON:** Great for small configurations and API communication.
- **CSV:** Great for large tables and datasets.

**Next Step:** Once you run this, we'll look at the final piece of Phase 2: [Virtual Environments & Jupyter Setup](file:///d:/myFirstAITest/Phase2/phase2_setup.md)—making your workflow professional!
