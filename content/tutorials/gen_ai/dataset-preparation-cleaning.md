# Phase 7: Fine-tuning + LoRA - Step 2 (Dataset Preparation & Cleaning)

In AI, the phrase **"Garbage In, Garbage Out"** is absolute law. If your training data is messy, your fine-tuned model will be useless. 

Today, we learn how to build a **Golden Dataset**.

---

## 1. The Standard Format: JSONL
Most professional fine-tuning tools (OpenAI, HuggingFace) require data in **JSONL** (JSON Lines) format. Every line is a complete JSON object representing one conversation.

**Example Structure (Chat Model):**
```json
{"messages": [{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "Hi!"}, {"role": "assistant", "content": "Hello!"}]}
```

## 2. The Three Pillars of Data Quality
1.  **Diversity:** Don't just give the AI 1,000 examples of the same thing. Give it 1,000 *different* ways to solve the same problem.
2.  **Accuracy:** Every "Assistant" answer in your dataset must be the perfect, ideal response.
3.  **Balance:** If you want the AI to be polite, 100% of your examples must be polite.

---

## 3. The Coding Exercise (Hands-on)

We are going to build a "Data Factory." This script takes raw "Question - Answer" pairs and converts them into the professional JSONL format.

#### Step 1: The "Data Prep" script
Create a file named `data_prep.py` inside your `Phase7` folder:

```python
import json

# 1. RAW DATA (Usually comes from your logs or a CSV)
raw_data = [
    {"q": "What is the capital of France?", "a": "The capital is Paris."},
    {"q": "Who wrote Romeo and Juliet?", "a": "William Shakespeare wrote the play."},
    {"q": "What is 2+2?", "a": "The answer is 4."}
]

def convert_to_jsonl(input_list, output_file):
    print(f"Creating {output_file}...")
    
    with open(output_file, 'w') as f:
        for item in input_list:
            # Construct the 'Chat' format
            entry = {
                "messages": [
                    {"role": "system", "content": "You are a factual encyclopedia."},
                    {"role": "user", "content": item['q']},
                    {"role": "assistant", "content": item['a']}
                ]
            }
            # Write as a single line
            f.write(json.dumps(entry) + '\n')
            
    print("✅ Conversion Complete!")

# Run it
convert_to_jsonl(raw_data, "Phase7/training_data.jsonl")
```

---

## 4. Why this matters (Production Insight)
When you fine-tune a model, you aren't just giving it information; you are giving it **Habits**. 
If you forget the "System" prompt in your training data, the model might "forget" how to follow system instructions in production. 

**Pro Tip:** Always double-check your JSONL file for "Hidden characters" or "Broken JSON." Even one small typo can crash a $5,000 training run.

---
**Summary:**
- **JSONL:** The universal language of fine-tuning.
- **Garbage In, Garbage Out:** Quality is more important than quantity.
- **Consistency:** Training data must match production prompts.

**Next Step:** Learn the math magic that makes training affordable: [PEFT, LoRA, and QLoRA techniques](file:///d:/myFirstAITest/Phase7/phase7_lora.md). 🚀
