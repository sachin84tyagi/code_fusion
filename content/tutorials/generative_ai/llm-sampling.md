# LLM Engineering — Sampling (Temperature, Top‑p)

## 1. Absolute Basics — What is Sampling?

When a Language Model (LLM) generates text, it **does not write full sentences at once**. It generates **one token at a time**.

At each step, the model predicts a **probability distribution over the vocabulary** (which word/token is most likely next).

Example probability output for next token after: "The sky is"

* blue → 0.62
* clear → 0.18
* dark → 0.08
* green → 0.01
* pizza → 0.0001

Now the system must choose **one token** from this distribution. This decision process is called **Sampling**.

### Why not always pick the highest probability token?

If we always pick the highest probability ("blue"), output becomes:

* Repetitive
* Robotic
* Less creative
* Sometimes stuck in loops

Real language has **variety**, so controlled randomness improves naturalness.

Sampling = **Controlled randomness for better generation quality.**

---

## 2. Real‑World Intuition

Think of sampling like choosing a word while speaking:

* Safe mode → predictable, factual, consistent
* Creative mode → diverse, expressive, imaginative

Sampling controls where on this spectrum the model operates.

---

## 3. Generation Pipeline (System View)

At every token step:

1. Model computes probability distribution over vocabulary
2. Sampling strategy modifies/filters distribution
3. One token is selected
4. Token appended to sequence
5. Repeat until stop

Pipeline:

Model → Probability Distribution → Sampling → Next Token → Loop

---

## 4. Temperature — Controls Randomness

Temperature adjusts **how sharp or flat the probability distribution becomes**.

### Intuition

* Low temperature → sharp distribution → safe, deterministic
* High temperature → flat distribution → creative, risky

### Behavior

**Temperature = 0 (or very low)**

* Almost greedy
* Picks highest probability token
* Deterministic
* Focused and factual
* Less diversity

**Temperature ≈ 0.7 (balanced)**

* Natural conversation
* Slight creativity
* Still reliable

**Temperature ≥ 1.0 (high)**

* Diverse output
* More surprising
* Can hallucinate or drift

### Real intuition

Temperature = "confidence vs exploration knob"

Low → "Be safe"
High → "Take creative risks"

---

## 5. Top‑p (Nucleus Sampling)

Instead of picking from entire vocabulary, Top‑p keeps only the **smallest group of tokens whose cumulative probability ≥ p**.

Example distribution:

* blue → 0.62
* clear → 0.18
* dark → 0.08
* cloudy → 0.05
* green → 0.01
* pizza → 0.0001

If **Top‑p = 0.9**, we keep tokens until cumulative ≥ 0.9:

blue (0.62) + clear (0.18) + dark (0.08) + cloudy (0.05) = 0.93

Only these tokens remain. Others removed.

### Why Top‑p is powerful

* Removes meaningless low‑probability tokens
* Keeps only realistic choices
* Dynamic cutoff (unlike fixed Top‑k)

Top‑p = "Keep only sensible options"

---

## 6. Behavior Comparison

**Low Temperature + Low Top‑p**

* Precise
* Factual
* Deterministic
* Safe for QA, coding, reasoning

**High Temperature + High Top‑p**

* Creative
* Diverse
* Risky
* Good for storytelling, brainstorming

**Balanced (Temp ~0.6–0.8, Top‑p ~0.9)**

* Natural chat
* Good mix of reliability + diversity

---

## 7. Tiny Practical Examples

### Same prompt — Different Temperature

Prompt: "Write one word: The sky is"

Temperature 0 → blue
Temperature 1 → blue / clear / dark / cloudy (varies each run)

---

### How Top‑p removes unlikely tokens

Without Top‑p → could sample "pizza" (rare but possible)
With Top‑p = 0.9 → "pizza" removed → safer output

---

### Recommended settings

Factual QA / Coding → Temperature 0–0.3, Top‑p 0.8–0.95
Chatbot → Temperature 0.6–0.8, Top‑p 0.9
Creative writing → Temperature 0.9–1.2, Top‑p 0.95–1

---

## 8. Related Concepts

### Greedy Decoding

Always pick highest probability token.

* Deterministic
* No randomness
* Can be repetitive

### Top‑k Sampling

Pick from top k tokens only.

* Fixed cutoff
* Simpler but less adaptive than Top‑p

### Deterministic vs Stochastic

* Deterministic → same output every run (Temp=0)
* Stochastic → output varies (Temp>0)

---

## 9. Engineering Insight (Real LLM Behavior)

Sampling controls:

* Output style
* Creativity vs accuracy
* Diversity
* Stability
* Hallucination risk

Critical in:

* Chatbots
* Coding assistants
* Reasoning systems
* Creative generation
* Multi‑turn dialogue

Production rule:
Lower randomness for correctness, higher randomness for creativity.

---

## 10. One‑Page Mental Model (Production Cheat Sheet)

### Core Idea

Sampling = "How the model chooses the next word"

### Temperature

* Controls randomness
* Low → safe, focused, deterministic
* High → creative, diverse, risky

### Top‑p

* Keeps only meaningful tokens
* Removes unlikely words
* Dynamic filtering

### Quick Settings

Safe / Factual → Temp 0–0.3, Top‑p 0.8–0.95
Balanced Chat → Temp 0.6–0.8, Top‑p 0.9
Creative → Temp 0.9–1.2, Top‑p 0.95–1

### If output is

* Too robotic → increase Temperature
* Too random → decrease Temperature
* Nonsense words → lower Top‑p
* Repetitive → slightly increase Temperature

### Golden Rule

Temperature = creativity knob
Top‑p = safety filter

Together → control intelligence style of the LLM.

---

End of document.
