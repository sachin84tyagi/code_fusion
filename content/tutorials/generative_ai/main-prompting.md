# Phase 1: Foundations - Step 4 (Prompt Engineering Basics)

You know how AI processes words (Tokens), understands meaning (Embeddings), and connects them all together (Transformers). 

Now, how do you actually *talk* to this system to get what you want? That's **Prompt Engineering**.

---

## 1. What is Prompt Engineering?
It is the skill of giving instructions to an AI in a way that minimizes confusion and maximizes output quality. 

If a Transformer is a world-class, super-fast chef, Prompt Engineering is writing down the exact recipe order so the chef doesn't accidentally bake a cake with salt instead of sugar.

## 2. The Golden Rule of Prompting
**"Garbage In, Garbage Out."**

If you say: *"Write an email about the project."*
The AI has to guess: Who is the email for? What is the project? What is the tone?

Instead, a good prompt uses the **PACE** framework:
- **P (Persona):** "Act as a Senior Project Manager..."
- **A (Action):** "...write an update email..."
- **C (Context):** "...regarding the website redesign delaying by 2 weeks due to server issues..."
- **E (Expectation/Format):** "...keep it under 3 paragraphs, professional but reassuring."

## 3. Real-World Intuition
Think of prompting like giving instructions to an extremely eager intern who takes everything *literally*.
- **Bad:** "Clean the house." (They might throw away your important papers on the desk because they looked "messy").
- **Good:** "Clean the house, but do not touch the papers on the office desk. Place all trash in the blue bin."

## 4. The Coding Exercise (Hands-on)
Let's see how much a prompt changes the output. We will use the `transformers` library again, but this time for **Text Generation**.

#### Step 1: The "Prompt Tester" script
Create a file named `prompt_engineering.py` inside your `learning-ai` folder:

```python
from transformers import pipeline

# 1. Load a text generation model
# We use 'gpt2'—a very early, small version of the GPT family. It's fast and runs locally.
print("Loading Text Generator (GPT-2)... Please wait.")
generator = pipeline('text-generation', model='gpt2')

# 2. Define our Prompts
# Notice the difference between a vague prompt and a specific one.
prompts = {
    "Bad Prompt": "A good way to learn programming is",
    
    "Better Prompt": "To learn Python programming quickly as a beginner, the top 3 actionable steps are: 1.",
}

print("\n--- Testing Prompts ---")

# 3. Generate text for each prompt
for name, prompt in prompts.items():
    print(f"\n[{name}]")
    print(f"Input: '{prompt}'")
    
    # We ask the model to generate a maximum of 40 extra tokens (words)
    output = generator(prompt, max_new_tokens=40, num_return_sequences=1, pad_token_id=50256)
    
    print("\nOutput:")
    # Print the generated text, removing the original prompt part to see what it added
    print(output[0]['generated_text'])
    print("-" * 40)
```

### 5. What's Happening in the Code?
- We load `gpt2`. It's not as smart as ChatGPT (which is GPT-3.5 or GPT-4), but it's perfect for seeing raw generation locally.
- The **Bad Prompt** is open-ended. The AI might ramble or go off-topic.
- The **Better Prompt** sets a clear context (`Python`, `beginner`) and a strict format (`top 3 actionable steps: 1.`). This forces the AI into a specific pattern.

## 6. Mini Task for You
1. Run the script: `python learning-ai/prompt_engineering.py`.
2. Notice how the "Bad Prompt" wanders, while the "Better Prompt" immediately starts listing items ("1...", "2...").
3. Change the prompts in the script. Try using the PACE framework (Persona, Action, Context, Expectation) and see if GPT-2 can follow it!

---
**Congratulations! You have officially completed Phase 1: AI & LLM Foundations.** 🎉
You now understand the core mechanics of how modern Generative AI works under the hood. 

**Next stop: Phase 2 (Python for AI), where we prep our coding environment for the big API calls!**
