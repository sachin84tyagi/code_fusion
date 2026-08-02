Welcome to **Chapter 5 — CRUD in MongoDB**.

> **Create, Read, Update, Delete — every database operation you'll ever perform falls into one of these four categories.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a school register.

The teacher can:

```
📝 Add a new student     → CREATE

📖 Read the student list  → READ

✏️ Edit student marks     → UPDATE

🗑️ Remove a student      → DELETE
```

Every database operation is CRUD.

---

# The Model Setup (Mongoose)

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    age: Number,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
```

---

# C — CREATE

---

## insertOne / create

```javascript
// Mongoose
const user = await User.create({
    name: "Sachin Tyagi",
    email: "sachin@gmail.com",
    age: 25
});

console.log(user._id);
```

---

## insertMany

```javascript
const users = await User.insertMany([
    { name: "Sachin", email: "sachin@gmail.com" },
    { name: "Rahul", email: "rahul@gmail.com" },
    { name: "Priya", email: "priya@gmail.com" }
]);

console.log(`${users.length} users inserted`);
```

---

# R — READ

---

## Find All

```javascript
const users = await User.find();
```

---

## Find with Filter

```javascript
const activeUsers = await User.find({ isActive: true });
```

---

## Find One

```javascript
const user = await User.findOne({ email: "sachin@gmail.com" });
```

---

## Find by ID

```javascript
const user = await User.findById("64a1b2c3d4e5f6789abc1234");
```

---

## Query Operators

```javascript
// Greater than
User.find({ age: { $gt: 20 } });

// Less than or equal
User.find({ age: { $lte: 30 } });

// In a list
User.find({ name: { $in: ["Sachin", "Rahul"] } });

// Not equal
User.find({ status: { $ne: "banned" } });

// Multiple conditions (AND)
User.find({ age: { $gte: 18 }, isActive: true });

// OR condition
User.find({ $or: [{ age: 25 }, { name: "Rahul" }] });
```

---

## Select Specific Fields

```javascript
const users = await User.find({}, "name email");
// Returns only name and email
```

---

## Sort, Limit, Skip

```javascript
const users = await User.find()
    .sort({ createdAt: -1 })   // Newest first
    .limit(10)                  // Max 10 results
    .skip(20);                  // Skip first 20 (pagination)
```

---

# U — UPDATE

---

## updateOne

```javascript
await User.updateOne(
    { email: "sachin@gmail.com" },
    { $set: { age: 26 } }
);
```

---

## updateMany

```javascript
await User.updateMany(
    { isActive: false },
    { $set: { status: "archived" } }
);
```

---

## findByIdAndUpdate

```javascript
const updated = await User.findByIdAndUpdate(
    "64a1b2c3d4e5f6789abc1234",
    { $set: { name: "Sachin Tyagi" } },
    { new: true }  // Return updated document
);
```

---

## Update Operators

```javascript
// Set a field
{ $set: { age: 26 } }

// Increment a number
{ $inc: { score: 5 } }

// Push to array
{ $push: { skills: "Docker" } }

// Remove from array
{ $pull: { skills: "CSS" } }

// Add if not exists
{ $addToSet: { tags: "nodejs" } }

// Unset (remove) a field
{ $unset: { tempToken: "" } }
```

---

# D — DELETE

---

## deleteOne

```javascript
await User.deleteOne({ email: "sachin@gmail.com" });
```

---

## deleteMany

```javascript
await User.deleteMany({ isActive: false });
```

---

## findByIdAndDelete

```javascript
const deleted = await User.findByIdAndDelete("64a1b2c3...");
```

---

# Complete CRUD API Example

```javascript
const express = require("express");
const User = require("./models/User");

const router = express.Router();

// Create
router.post("/", async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
});

// Read All
router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Read One
router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
});

// Update
router.put("/:id", async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
});

// Delete
router.delete("/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;
```

---

# Company Example — Instagram

```
C → Create post        → Post.create({ userId, content, image })
R → Get feed           → Post.find({ userId: { $in: followingIds } }).sort({ createdAt: -1 }).limit(20)
U → Edit caption       → Post.findByIdAndUpdate(id, { $set: { caption } })
D → Delete post        → Post.findByIdAndDelete(id)
```

---

# Interview Questions

## Q1. How do you insert a document in MongoDB/Mongoose?

```javascript
await Model.create({ field: value });
```

---

## Q2. What is `findByIdAndUpdate` with `{ new: true }`?

`{ new: true }` returns the **updated** document instead of the original pre-update document.

---

## Q3. What does `$set` do?

Updates only the specified fields without affecting other fields in the document.

---

## Q4. How do you implement pagination?

```javascript
.skip((page - 1) * limit).limit(limit)
```

---

## Q5. Difference between `deleteOne` and `deleteMany`?

`deleteOne` removes the first matching document. `deleteMany` removes all matching documents.

---

# Professional Summary

```
CREATE   → User.create() / insertMany()
READ     → find() / findOne() / findById()
UPDATE   → updateOne() / findByIdAndUpdate()
DELETE   → deleteOne() / findByIdAndDelete()

Operators:
  $set   → update fields
  $inc   → increment
  $push  → add to array
  $pull  → remove from array
  $gt, $lt, $in, $or → query filters
```

---

# 🧠 Memory Trick

```
CRUD = Phone Contacts App

C → Add Contact    → insertOne
R → Find Contact   → findOne / find
U → Edit Contact   → updateOne
D → Delete Contact → deleteOne
```

---

# 🚀 Next Chapter

We'll learn **Indexes** — how MongoDB achieves lightning-fast queries even with millions of documents.
