# Transformers Deep Dive — Embeddings (Complete Guide)

## 1. Absolute Basics — What are Embeddings?

Computers do not understand words. They only understand numbers. So before a Transformer can read text, every word must be converted into numbers.

But simple numbers like **Token IDs (101, 542, 87...) are meaningless** to a neural network. They only represent dictionary positions, not meaning.

**Embeddings solve this problem.**

An **embedding** is a dense vector of numbers that represents the *meaning* of a word. Instead of saying:

> cat = 542

we say:

> cat = [0.21, -0.44, 0.90, 0.11, ...]

This vector captures semantic meaning.

---

## 2. Real‑World Intuition — Meaning as Position in Space

Imagine every word placed in a huge 3D/100D/1000D space:

* Words with similar meaning are **close together**
* Words with different meaning are **far apart**

Example:

* cat is near dog
* king is near queen
* apple (fruit) is far from car

So **meaning = position in vector space**.

This is the core intuition of embeddings.

---

## 3. Big Picture Flow

Text goes through the following pipeline:

Token → Token ID → Embedding Vector → Transformer Layers → Understanding

Step-by-step:

1. Tokenizer splits text into tokens
2. Each token becomes a Token ID
3. Token ID indexes into the **Embedding Matrix**
4. The selected row becomes the **Embedding Vector**
5. Transformer processes these vectors

---

## 4. Embedding Matrix

The embedding matrix is a large table of learnable numbers.

Size:

Vocabulary Size × Embedding Dimension

Example:

50,000 words × 768 = matrix of 50,000 rows

Each row = vector for one token.

If token ID = 542 → row 542 is selected → that row is the embedding.

The matrix is **random at start** and **learned during training**.

---

## 5. Vector Representation

Each word becomes a vector:

cat → [0.12, -0.88, 0.44, ...]

This vector is not random after training. Each dimension encodes hidden features like:

* Animal vs object
* Living vs non-living
* Size
* Emotion
* Syntax role

Humans cannot directly read these dimensions, but the model can.

---

## 6. Embedding Dimension

Embedding dimension = length of vector.

Common sizes:

* Small models → 128, 256
* BERT / GPT → 768
* Large models → 1024, 2048, 4096+

Higher dimension = more capacity to store meaning.

But larger dimension = more memory + compute.

---

## 7. Learnable Parameters

Embeddings are **trainable weights**.

During training:

* Model makes prediction
* Error is calculated
* Backpropagation updates embedding vectors

So embeddings gradually learn semantic meaning.

---

## 8. How Embeddings Capture Meaning

### Semantic Similarity

Vectors close in space have similar meaning:

king ≈ queen
cat ≈ dog
car far from banana

Distance in vector space ≈ meaning similarity.

---

### Context Relationships

Words appearing in similar contexts learn similar vectors.

Example sentences:

* The cat is sleeping
* The dog is sleeping

Model learns cat and dog behave similarly → vectors move closer.

---

### Meaning Through Distance

Vector math captures relationships:

king − man + woman ≈ queen

This shows embeddings store relational meaning.

---

## 9. Tiny Practical Examples

### Example 1 — "cat" becomes vector

Token: "cat"
Token ID: 542
Embedding lookup → row 542 → vector [0.18, -0.55, 0.73, ...]

This vector is sent into Transformer.

---

### Example 2 — Similar words → similar vectors

cat → [0.18, -0.55, 0.73]
dog → [0.16, -0.50, 0.70]

Vectors are close → meanings similar.

---

### Example 3 — Embeddings update during training

If model wrongly predicts "cat" instead of "dog":

* Loss computed
* Gradient flows back
* Embedding(cat) and Embedding(dog) slightly adjusted

After millions of updates → meaningful structure emerges.

---

## 10. Static vs Contextual Embeddings

### Static Embeddings

Same vector always:

"bank" (river) = same as "bank" (money)

Examples: Word2Vec, GloVe

---

### Contextual Embeddings (Transformers)

Vector changes based on sentence:

"river bank" → nature meaning
"bank account" → finance meaning

Transformer updates representation using attention.

This is why Transformers understand language better.

---

## 11. Input vs Output Embeddings

### Input Embeddings

Convert tokens → vectors for model input.

---

### Output Embeddings

Convert final hidden state → vocabulary probabilities.

Often **input and output embeddings share weights** (weight tying).

---

## 12. Embeddings + Positional Encoding

Embeddings know meaning but **not word order**.

So positional encoding adds position information:

Final input to Transformer =

Embedding + Positional Encoding

Now model knows:

* What word
* Where it appears

---

## 13. Embeddings + Attention

Attention compares embedding vectors.

It measures:

* Similarity
* Relevance
* Context importance

Because embeddings contain semantic meaning, attention can:

* Link related words
* Resolve ambiguity
* Understand sentence context

---

## 14. Why Embeddings Are the Foundation

Without embeddings:

* Model sees only token numbers
* No meaning
* No similarity
* No language understanding

Embeddings convert **symbols → meaning space**.

Everything in Transformers depends on this semantic space.

---

# One‑Page Mental Model (Cheat Sheet)

**Embeddings = Meaning Coordinates**

Token → ID → Embedding Vector → Transformer → Understanding

Key Ideas:

* Embedding = vector representing meaning
* Similar meaning → vectors close
* Embedding matrix stores all token vectors
* Dimension = meaning capacity
* Embeddings are learned via training
* Contextual embeddings change with sentence
* Input embeddings feed model
* Output embeddings generate words
* Add positional encoding for word order
* Attention reads relationships between embeddings

Simple Intuition:

Words are placed in a giant invisible map of meaning.

Transformers read this map to understand language.

If you understand this, you understand the foundation of modern NLP.
