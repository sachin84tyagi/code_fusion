# LLM Engineering → Finetuning with PEFT, LoRA, and QLoRA

---

# 1. Why Full Finetuning Large Models Is Expensive

Imagine you have a 7B (7 billion parameter) model.

Full finetuning means:

* Updating **all 7 billion parameters**
* Storing gradients for all parameters
* Storing optimizer states (usually 2x parameters for Adam)

### What this means in practice

If model weights take:

* 14 GB (fp16)

Training requires roughly:

* 14 GB (model)
* 14 GB (gradients)
* 28 GB (optimizer states)

➡️ ~56+ GB VRAM required

Now imagine 13B, 30B, 70B models.

That is why:

* Full finetuning is expensive
* Requires multiple GPUs
* Slow to train
* Hard to maintain multiple task‑specific versions

---

# 2. Full Finetuning vs PEFT (Parameter Efficient Finetuning)

## Full Finetuning

* Update **all parameters**
* Large memory requirement
* Expensive compute
* High storage cost (one full copy per task)

Good when:

* You own massive GPU infrastructure
* You need maximum performance shift

---

## PEFT (Parameter Efficient Finetuning)

Core idea:

> Do NOT update entire model.
> Only train a **small subset of new parameters**.

How?

* Freeze base model weights
* Add small trainable components
* Train only those

### Result

* Tiny number of trainable parameters (often <1%)
* Massive VRAM savings
* Fast training
* Modular adapters per task

Think of it as:

> Keeping brain fixed, adding small “skill modules” on top.

---

# 3. PEFT Intuition (Engineering View)

Why does this work?

Because pretrained LLMs already:

* Understand language
* Have world knowledge
* Know reasoning patterns

Most tasks do NOT require rewriting the entire brain.

They only require:

* Slight directional adjustments

So instead of rewriting everything:

We learn a small "correction layer".

Benefits:

* Cheap
* Modular
* Easy to deploy
* Avoid catastrophic forgetting

---

# 4. LoRA (Low-Rank Adaptation)

LoRA is the most popular PEFT technique.

## Core Idea

Instead of updating weight matrix W directly:

W (frozen)  →  W + ΔW

But instead of learning full ΔW (large matrix),
we approximate it using low-rank matrices:

ΔW = A × B

Where:

* A: small matrix
* B: small matrix
* Rank r is small (like 4, 8, 16)

So instead of learning millions of values,
we learn a few thousand.

---

## Where LoRA Is Applied

Usually injected into:

* Attention layers (Query, Key, Value projections)

Because attention controls:

* How model focuses
* How knowledge flows

---

## Why Low Rank Works

In practice:

Weight updates during finetuning are often:

* Structured
* Redundant
* Low dimensional

So full matrix update is unnecessary.

Low-rank update captures most useful signal.

---

## Engineering Characteristics

* Trainable parameters: Often 0.1% – 1% of total
* Base model: frozen
* Can merge adapters into base model after training
* Or keep adapters separate (recommended for modularity)

---

# 5. QLoRA

QLoRA = Quantized LoRA

It combines:

* 4-bit quantization of base model
* LoRA training on top

---

## Step 1: Quantize Base Model to 4-bit

Instead of storing weights in 16-bit:

* Store in 4-bit

Memory reduces ~4x.

Example:

7B model:

* fp16: ~14GB
* 4-bit: ~3.5GB

---

## Step 2: Add LoRA Adapters

* Base model stays 4-bit (frozen)
* LoRA layers train in 16-bit

Result:

You can train a 7B model on:

* A single 24GB GPU
* Sometimes even 16GB

---

## Why QLoRA Is Powerful

It democratizes LLM finetuning.

You no longer need:

* Multi-GPU cluster
* Enterprise infra

You can:

* Finetune large models locally

---

# 6. Engineering Pipeline (Production)

Step 1: Load pretrained model
Step 2: Freeze base weights
Step 3: Add LoRA adapters to attention layers
Step 4: Prepare instruction/task dataset
Step 5: Train only adapter parameters
Step 6: Save adapter weights
Step 7: Deploy (base model + adapter)

Deployment options:

* Keep adapter separate
* Or merge adapter into base for single file inference

---

# 7. Tiny Practical Examples

## Example 1: Medical Assistant

Base Model: Generic 7B LLM

Goal: Medical QA assistant

Process:

* Collect medical instruction dataset
* Add LoRA (rank=8)
* Train for few epochs

Result:

* Small adapter (~100MB)
* Base model unchanged
* Medical expertise activated via adapter

---

## Example 2: Code Adaptation

Base Model: General LLM

Goal: Improve Python code quality

Use PEFT:

* Train only adapters on code dataset

Now you have:

* Base general model
* Code adapter
* Medical adapter

Same base model → multiple skills

---

## Example 3: Train 7B Model on Single GPU with QLoRA

* Quantize base to 4-bit
* Add LoRA rank 16
* Train on 24GB GPU

Total trainable parameters:

* Often < 20M

Instead of training 7B.

---

# 8. Key Engineering Concepts

## Rank (r) Intuition

Rank controls:

* Capacity of adaptation

Small r:

* Faster
* Less memory
* Lower flexibility

Large r:

* More expressive
* More memory

Typical values: 4, 8, 16, 32

---

## Trainable vs Total Parameters

Example:

7B model
LoRA rank 8

Total parameters: 7,000,000,000
Trainable: ~5–20 million

That is <1%.

---

## VRAM Savings

Full Finetuning:

* Model + grads + optimizer states

LoRA:

* Frozen model (no grads)
* Only adapter grads

QLoRA:

* 4-bit base model
* Tiny adapter grads

Huge reduction.

---

## Adapter Merging

Option A: Keep separate

* Modular
* Switch skills dynamically

Option B: Merge into base

* Simpler deployment
* Slightly faster inference

---

# 9. Full Finetuning vs LoRA vs QLoRA

| Feature           | Full FT    | LoRA          | QLoRA          |
| ----------------- | ---------- | ------------- | -------------- |
| Update All Params | Yes        | No            | No             |
| Memory Usage      | Very High  | Low           | Very Low       |
| Hardware Need     | Multi-GPU  | 1 GPU         | 1 Consumer GPU |
| Storage per Task  | Full Model | Small Adapter | Small Adapter  |
| Performance       | Highest    | Near Full     | Near Full      |

---

# 10. Production Concepts

## Instruction Tuning

Training model to follow prompts like:
"Explain this step by step"

LoRA is commonly used for this.

---

## Domain Adaptation

Adapting model to:

* Legal
* Finance
* Medical
* Internal company data

Best done with PEFT.

---

## Catastrophic Forgetting

Full finetuning can overwrite knowledge.

PEFT reduces this because:

* Base weights are frozen

---

## Model Versioning

Instead of storing:

* 10 full models

Store:

* 1 base model
* 10 adapters

Much cleaner system design.

---

# 11. One-Page Production Mental Model

Full Finetuning = Rewrite entire brain

LoRA = Add small skill patch

QLoRA = Compress brain + add skill patch

When to choose:

Use Full FT if:

* You need maximum possible shift
* You have strong GPU infra

Use LoRA if:

* You want high performance
* Moderate GPU
* Multiple task adapters

Use QLoRA if:

* Limited GPU
* Want large model training
* Startup / research environment

Final intuition:

Pretrained LLMs already know almost everything.
You usually do NOT need to change the whole model.

You only need to nudge it in the right direction.

PEFT, LoRA, and QLoRA are efficient ways to apply that nudge.

---

End of guide.


# LLM Engineering — Dataset Creation & Cleaning (Production Guide)

## 1. Foundation — Why Data Quality Matters Most

In Large Language Models (LLMs), **data quality is the single biggest factor** affecting model performance.

Simple rule:

**Better data → Better model → Better output**
**Bad data → Confused model → Poor results**

This is called:

> **Garbage In → Garbage Out**

The model does NOT understand truth. It learns **patterns from data**. If patterns are wrong, noisy, biased, duplicated, or inconsistent — the model learns those mistakes.

So real LLM engineering starts with **Dataset Engineering**, not model tuning.

---

## 2. Dataset Creation — How Training Data is Built

Dataset creation means **collecting useful, relevant, structured examples** that teach the model what you want it to learn.

### 2.1 Types of Raw Data

Raw data can be:

* Plain text (articles, books, documentation)
* Conversations / chat logs
* Question–Answer pairs
* Instructions and responses
* Domain knowledge (legal, medical, coding, finance, product docs)
* Structured text (JSON, tables, markdown)

### 2.2 Data Sources

#### 1. Public Data

* Open datasets
* Wikipedia, research papers, public documentation
* Open conversations and QA datasets

Pros: Large volume
Cons: Noisy, generic, inconsistent

#### 2. Human‑Generated Data

* Manually written instruction → response pairs
* Domain experts writing examples
* Annotated / labeled datasets

Pros: High quality, accurate
Cons: Expensive, slow

#### 3. Synthetic Data (AI Generated)

* Generated using strong LLMs
* Used for scaling dataset
* Useful for edge cases and rare patterns

Pros: Fast, scalable
Cons: Must validate quality (AI can hallucinate)

### 2.3 Task‑Specific Dataset Creation

Different tasks need different structure.

#### Chat Dataset

User → Assistant format

Example:
User: "How to reset password?"
Assistant: "Go to settings → click reset password → verify email"

#### Instruction Tuning Dataset

Instruction → Response

Example:
Instruction: "Explain HTTP in simple words"
Response: "HTTP is the protocol used to transfer web data..."

#### QA Dataset

Question → Answer

#### Classification Dataset

Text → Label

Example:
"This product is amazing" → Positive

---

## 3. Dataset Cleaning — Making Data Learnable

Raw data is always messy. Cleaning makes it **consistent, readable, and trainable**.

### 3.1 Remove Noise

Remove:

* Broken text
* Random symbols
* HTML garbage
* Logs / metadata not useful for learning
* Incomplete sentences

### 3.2 Remove Duplicates

Duplicates cause:

* Overfitting
* Bias toward repeated patterns

Always deduplicate dataset.

### 3.3 Remove Low‑Quality Samples

Remove:

* Wrong answers
* Very short meaningless text
* Irrelevant domain data
* Spam

### 3.4 Fix Formatting and Structure

Make data consistent:

* Same schema
* Clean sentence format
* Proper instruction → response pairing
* No mixed formats

### 3.5 Normalization

Normalize text:

* Encoding → UTF‑8
* Consistent casing (lower/standard)
* Fix punctuation
* Remove extra spaces
* Clean line breaks

---

## 4. Data Preparation Pipeline

Production pipeline looks like this:

Raw Data
→ Filtering (remove irrelevant)
→ Cleaning (noise, duplicates, format)
→ Structuring (task format)
→ Validation (quality checks)
→ Training‑Ready Dataset

---

## 5. Core Data Quality Principles

### Quality > Quantity

10k clean examples beat 1M noisy examples.

### Consistency

Same structure, same format, same style.

### Correct Labels

Wrong labels teach wrong behavior.

### Balanced Data

Avoid too much of one pattern.

### Domain Relevance

Train only on data related to your use case.

---

## 6. Tiny Practical Examples

### Example 1 — Cleaning Messy Chat Logs

Raw:
"User123: hey brooooo!!! how reset??? <html>"

Cleaned:
User: "How do I reset my password?"
Assistant: "Go to settings → reset password → verify email"

### Example 2 — Removing Duplicates

Before:
"Explain AI" → "AI means artificial intelligence" (100 times)

After:
Keep only one copy.

### Example 3 — Structuring Instruction Dataset

Before:
"HTTP explanation simple words"

After:
Instruction: "Explain HTTP in simple words"
Response: "HTTP is a protocol used for communication on the web..."

---

## 7. Advanced Dataset Strategies (Engineering Intuition)

### Data Augmentation

Create variations:

* Paraphrasing
* Rewriting
* Expanding

Improves robustness.

### Synthetic Data Generation

Use strong LLM to generate:

* Edge cases
* Rare scenarios
* Domain examples

Always validate quality.

### Hard Example Mining

Focus training on:

* Difficult questions
* Edge failures
* Mistakes model makes

Improves reasoning quality.

### Curriculum Learning (Easy → Hard)

Train model gradually:
Simple → Medium → Complex

Helps stable learning.

---

## 8. Critical Engineering Insights

### Garbage In → Garbage Out

Model mirrors data quality.

### Data Leakage Risk

Never allow validation/test data inside training.
Otherwise metrics become fake.

### Train vs Validation Split

Typical split:

* Train: 80–90%
* Validation: 10–20%

Validation checks generalization.

### Bias & Safety (High Level)

Check dataset for:

* Harmful patterns
* Toxic language
* Cultural bias
* Incorrect facts

Clean before training.

---

## 9. One‑Page Production Checklist (Mental Model)

Use this every time you build dataset:

### Step 1 — Define Goal

* What task? (Chat / QA / Instruction / Classification)
* What domain?

### Step 2 — Collect Data

* Public data
* Human written
* Synthetic

### Step 3 — Filter

* Remove irrelevant domain
* Remove junk

### Step 4 — Clean

* Remove noise
* Remove duplicates
* Fix text
* Normalize

### Step 5 — Structure

* Standard schema
* Instruction → Response
* Consistent formatting

### Step 6 — Quality Check

* Correct answers
* Balanced data
* No bias/toxicity

### Step 7 — Split

* Train vs Validation
* Prevent leakage

### Step 8 — Improve

* Add hard examples
* Augment data
* Add synthetic samples

### Step 9 — Final Rule

**Clean + Relevant + Consistent Data = Strong LLM**

---

This is the complete practical foundation of **LLM Dataset Engineering for real production systems**.
If you want, I can next add:

Real code examples (Python data cleaning pipeline)

Dataset schema templates (JSON / ChatML / Alpaca format)

Auto-cleaning + deduplication scripts

Data quality scoring system

LLM fine-tuning dataset builder architecture

Enterprise-level data pipeline design