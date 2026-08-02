Welcome to **Chapter 7 — Compound Index**.

> **A Compound Index covers multiple fields in one index. It is the most powerful optimization tool for complex queries.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a library.

Books are organized by:

1. **Genre** (Fiction, Science, History)
2. **Author's last name** (alphabetically within genre)
3. **Year published** (newest first within author)

To find a book:

```
Genre: Science
Author: Hawking
Year: 2018
```

You can jump directly to the exact shelf.

That multi-level organization is a **Compound Index**.

---

# What is a Compound Index?

A compound index covers **more than one field** in a single index.

Single field index:

```javascript
{ email: 1 }
```

Compound index:

```javascript
{ lastName: 1, firstName: 1 }
```

One index that covers two fields together.

---

# Why Compound Indexes?

Suppose you frequently query:

```javascript
User.find({ role: "admin", isActive: true });
```

With two separate single indexes:

```
MongoDB picks ONE index (whichever it thinks is better)

Then filters the rest in memory.

Still some waste.
```

With a compound index `{ role: 1, isActive: 1 }`:

```
MongoDB uses both fields simultaneously.

Much faster.
```

---

# Creating a Compound Index

## MongoDB Shell

```javascript
db.users.createIndex({ role: 1, isActive: 1 });
```

## Mongoose Schema

```javascript
const userSchema = new mongoose.Schema({
    name: String,
    role: String,
    isActive: Boolean,
    createdAt: Date
});

userSchema.index({ role: 1, isActive: 1 });
```

---

# Query Examples with Compound Index

Index: `{ role: 1, isActive: 1 }`

---

## ✅ Uses the index

```javascript
User.find({ role: "admin", isActive: true });
```

Both fields — index used.

---

## ✅ Uses prefix — partial use

```javascript
User.find({ role: "admin" });
```

Queries the first field only — index still used.

---

## ❌ Does NOT use the index

```javascript
User.find({ isActive: true });
```

Skipping the first field (`role`) — index NOT used.

This is the **prefix rule** (ESR Rule).

---

# The ESR Rule

For compound indexes, field order matters.

**ESR = Equality → Sort → Range**

Put fields in this order in your compound index:

```
1. Equality fields first    (exact match: role === "admin")
2. Sort fields next         (sort: createdAt)
3. Range fields last        (range: age > 18)
```

Example:

```javascript
db.orders.createIndex({ status: 1, createdAt: -1, amount: 1 });
```

Query:

```javascript
Order.find({ status: "pending" })
     .sort({ createdAt: -1 })
     .where({ amount: { $gt: 100 } });
```

Perfect ESR order → index fully utilized.

---

# Sort with Compound Index

Compound indexes can also optimize sort operations.

```javascript
userSchema.index({ createdAt: -1 });
```

```javascript
User.find({ isActive: true }).sort({ createdAt: -1 });
```

The index already has data sorted — no in-memory sort needed.

---

# Compound Unique Index

Ensure a combination of fields is unique.

```javascript
// One user can only write one review per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });
```

Same user + same product → rejected.

Different user + same product → allowed.

---

# Real Example — Pagination

```javascript
postSchema.index({ authorId: 1, createdAt: -1 });
```

Optimizes:

```javascript
Post.find({ authorId: req.user.id })
    .sort({ createdAt: -1 })
    .skip(page * 10)
    .limit(10);
```

---

# Company Example — Amazon Search

Product search with filters:

```javascript
productSchema.index({ category: 1, price: 1, rating: -1 });
```

Query:

```javascript
Product.find({ category: "Electronics" })
       .where({ price: { $lt: 50000 } })
       .sort({ rating: -1 });
```

Without index → full collection scan of 50M products.

With compound index → milliseconds.

---

# Company Example — Twitter Feed

```javascript
tweetSchema.index({ userId: 1, createdAt: -1 });
```

Query:

```javascript
Tweet.find({ userId: { $in: followingIds } })
     .sort({ createdAt: -1 })
     .limit(20);
```

---

# How Many Compound Indexes?

Each compound index uses disk space and slows writes.

Guidelines:

* Index the fields you query TOGETHER most often
* Avoid indexing every combination
* Use `.explain()` to verify index usage

---

# Interview Questions

## Q1. What is a Compound Index?

**Best Answer**

> A Compound Index is a MongoDB index that covers multiple fields in a single index. It optimizes queries that filter or sort by more than one field and follows the prefix rule — queries must use the leftmost fields of the index.

---

## Q2. What is the prefix rule?

MongoDB can only use a compound index if the query includes the **leftmost field(s)** of the index. Skipping the first field means the index won't be used.

---

## Q3. What is the ESR rule?

For compound indexes, order fields as:
1. **E**quality (exact match)
2. **S**ort
3. **R**ange

---

## Q4. Can a Compound Index enforce uniqueness?

Yes. `{ userId: 1, productId: 1 }` with `{ unique: true }` ensures the combination is unique.

---

# Professional Summary

```
Compound index covers multiple fields

{ field1: 1, field2: 1, field3: -1 }

Prefix rule:
  Query must use field1 (leftmost)
  field2 alone = no index use

ESR order:
  Equality → Sort → Range

Use .explain() to verify
```

---

# 🧠 Memory Trick

```
Compound Index = Library shelving system

Fiction → Hawking → 2018

Skip "Fiction" → can't find Hawking (prefix rule)
```

The leftmost field is the entry point.

---

# 🚀 Next Chapter

We'll master **Aggregation** — MongoDB's most powerful feature for data transformation, analytics, and reporting.
