# Phase 1: Foundations - Coding Step 1 (Tokenization)

Before we call an API, we need to speak the language of AI: **Tokens**.

## 1. What are Tokens?

#### 1️⃣ Simple Definition

**AI Tokens** are **small pieces of text** (words, parts of words, or symbols) that an AI reads and processes to understand language.

#### 2️⃣ Why Tokens Matter

* AI **cannot read full sentences directly**.
* It **breaks text into tokens** first.
* The model **understands and predicts using these tokens**.

#### 3️⃣ Example: Sentence → Tokens

Sentence:

```
"AI is very powerful"
```

Step-by-step tokens:

```
AI | is | very | power | ful
```

AI processes **each token separately** to understand meaning.


#### 4️⃣ Visual AI Diagram

```
User Sentence
     │
     ▼
"AI is very powerful"
     │
     ▼
Split into Words
AI | is | very | powerful
     │
     ▼
Split into Tokens
AI | is | very | power | ful
     │
     ▼
AI Model (LLM)
Processes tokens → Understands meaning → Generates response
```

#### 5️⃣ Real-Life Analogy (Lego Blocks)

* A **sentence is like a Lego house**.
**Tokens are the Lego blocks.**

* AI **builds and understands language by connecting these small blocks together.**

![Token image](/images/tokens.jpeg)
---

## 2. The Coding Exercise
Since you want to use **Python**, we will use a library called `tiktoken` (developed by OpenAI) to see how our words are chopped up.

#### Step 1: Install the library
Create a new folder `learning-ai` (if you haven't) and run:
```bash
# It's recommended to use a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

pip install tiktoken
```

#### Step 2: The "Token Counter" script
Create a file named `tokens.py`:

```python
import tiktoken

# 1. Choose a model (gpt-3.5-turbo uses 'cl100k_base' encoding)
encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")

text = "Generative AI is awesome!"

# 2. Encode text to tokens
tokens = encoding.encode(text)
print(f"Original Text: {text}")
print(f"Tokens (IDs): {tokens}")

# 3. See how many tokens it used
print(f"Token Count: {len(tokens)}")

# 4. Decode them back to see how they look individually
for token_id in tokens:
    # We decode each ID separately to see the string piece
    token_text = encoding.decode([token_id])
    print(f"ID: {token_id} -> Text: '{token_text}'")
```

### 3. Real-world Intuition
Why does this matter?
- **Cost:** Most AI providers (like OpenAI) charge you per token, not per word.
- **Memory:** LLMs have a "Context Window" (e.g., 128k tokens). If your conversation reaches this limit, the AI "forgets" the earlier parts.

### 4. Mini Task for You
1. Run the script: `python tokens.py`
2. Change the `text` variable to something with weird spacing or symbols (e.g., `"   Hi!   !!!"`).
3. Run it again and see how many tokens it creates.
4. **Question:** Does `"apple"` and `"Apple"` have the same ID? (Run it and check!)

---
**Once you run this, we will move to Step 2: Embeddings (turning these IDs into meaning).**
