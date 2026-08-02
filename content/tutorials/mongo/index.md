Welcome to **Chapter 6 — Index**.

> **Indexes are the single biggest performance optimization in MongoDB. Without them, every query scans every document.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a thick textbook with 1000 pages.

You need to find the topic "MongoDB".

**Without an index:**

```
Start from page 1
Read every page
Find "MongoDB" on page 742
```

Time: Very slow.

**With an index (at the back of the book):**

```
Open index
M → MongoDB → Page 742
Go directly to page 742
```

Time: Instant.

MongoDB indexes work exactly the same way.

---

# What is an Index?

An Index is a **special data structure** that stores a small portion of the collection's data in an easy-to-traverse form.

Without an index:

```
Query: { email: "sachin@gmail.com" }

MongoDB scans every document.

100 documents → 100 scans
1,000,000 documents → 1,000,000 scans

Very slow.
```

With an index on `email`:

```
MongoDB jumps directly to the match.

100 documents → 1-2 scans
1,000,000 documents → still 1-2 scans

Instant.
```

---

# Visual Diagram — Without Index

```
Collection: users (1 million documents)

Query: { email: "sachin@gmail.com" }

Scan Doc 1  → Not match
Scan Doc 2  → Not match
...
Scan Doc 742,131 → ✅ Match!

Collection scan = SLOW
```

---

# Visual Diagram — With Index

```
Index on email field:

aaa@gmail.com → Doc pointer
...
sachin@gmail.com → Doc pointer  ← Jump directly here
...
zzz@gmail.com → Doc pointer

Result: Instant lookup
```

---

# Default Index — _id

Every collection automatically has an index on `_id`.

```javascript
db.users.findById("64a1b2c3..."); // Always fast — indexed
```

---

# Creating an Index

## Single Field Index

```javascript
// MongoDB Shell
db.users.createIndex({ email: 1 });

// 1 = ascending
// -1 = descending
```

## With Mongoose

```javascript
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, index: true }
});
```

Or separately:

```javascript
userSchema.index({ email: 1 });
```

---

# Unique Index

```javascript
userSchema.index({ email: 1 }, { unique: true });
```

Ensures no two documents have the same email.

Insert fails if duplicate.

---

# Listing Indexes

```javascript
db.users.getIndexes();
```

Output:

```json
[
  { "key": { "_id": 1 }, "name": "_id_" },
  { "key": { "email": 1 }, "name": "email_1", "unique": true }
]
```

---

# Dropping an Index

```javascript
db.users.dropIndex("email_1");
```

---

# Types of Indexes

---

## 1. Single Field

```javascript
db.users.createIndex({ email: 1 });
```

---

## 2. Compound (Multiple Fields)

```javascript
db.users.createIndex({ lastName: 1, firstName: 1 });
```

More on this in the next chapter.

---

## 3. Text Index (Full-Text Search)

```javascript
db.products.createIndex({ description: "text" });

db.products.find({ $text: { $search: "laptop gaming" } });
```

---

## 4. Sparse Index

Only indexes documents that have the field.

```javascript
db.users.createIndex({ phone: 1 }, { sparse: true });
```

Documents without `phone` are excluded from the index.

---

## 5. TTL Index (Auto-Delete)

Documents automatically deleted after a set time.

```javascript
db.sessions.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 3600 }
);
```

Sessions auto-expire after 1 hour.

Used for:

* Session management
* OTP expiry
* Cache documents

---

# When Indexes Slow Things Down

Indexes speed up reads but slow down writes.

Every `insert`, `update`, or `delete` must also update the index.

Rule:

* Create indexes on fields you **frequently query**
* Don't create indexes on every field

---

# Explain — Check if Index is Used

```javascript
db.users.find({ email: "sachin@gmail.com" }).explain("executionStats");
```

Look for:

```json
"stage": "IXSCAN"    ← Index scan (GOOD)
"stage": "COLLSCAN"  ← Collection scan (BAD — no index)
```

---

# Company Example — Amazon

Product search:

```
Collection: products (50 million documents)

Indexes:
  { name: "text" }              → Full text search
  { category: 1, price: 1 }    → Category filter + price sort
  { sellerId: 1 }               → Find seller's products
  { createdAt: -1 }             → Newest products first
```

Without indexes → each query takes seconds.

With indexes → milliseconds.

---

# Interview Questions

## Q1. What is a MongoDB index?

**Best Answer**

> An index is a data structure that improves query performance by allowing MongoDB to quickly locate documents matching a query condition, instead of scanning every document in the collection.

---

## Q2. What is the default index in MongoDB?

Every collection has an automatic unique index on the `_id` field.

---

## Q3. What is a TTL index?

A special index that automatically deletes documents after a specified number of seconds. Used for sessions, OTPs, and temporary data.

---

## Q4. What is COLLSCAN vs IXSCAN?

| COLLSCAN          | IXSCAN          |
| ----------------- | --------------- |
| Full scan (slow)  | Index scan (fast)|
| No index used     | Index used      |

---

## Q5. Do indexes affect write performance?

Yes. Indexes must be updated on every insert/update/delete, so too many indexes slow down writes.

---

# Professional Summary

```
Query without index  → COLLSCAN (slow)
Query with index     → IXSCAN (fast)

Create index:
  db.collection.createIndex({ field: 1 })

Mongoose:
  schema.index({ field: 1 })
  field: { type: String, index: true }

Use .explain() to verify index usage
```

---

# 🧠 Memory Trick

```
Index = Book Index at the back

Without: Read every page
With:    Jump to the page number

MongoDB without index = read every document
MongoDB with index    = jump to the match
```

---

# 🚀 Next Chapter

We'll learn **Compound Index** — how to create indexes across multiple fields for complex query optimization.
