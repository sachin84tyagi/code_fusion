Welcome to **Chapter 3 — Document**.

> **A Document is the core unit of MongoDB. It's a JSON-like object that can store rich, nested data in a single place.**

Documents are why MongoDB is so powerful and developer-friendly.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a school report card.

```
📄 Report Card

Name:    Sachin
Class:   10th
Age:     15

Marks:
    Math:    90
    Science: 85
    English: 78

Activities:
    - Cricket
    - Coding Club

Result: PASS
```

Everything about one student on one paper.

That paper is a **MongoDB Document**.

---

# What is a Document?

A Document is a **JSON-like data structure** stored in a collection.

```json
{
  "_id": "64a1b2c3d4e5f6789abc1234",
  "name": "Sachin Tyagi",
  "age": 25,
  "email": "sachin@gmail.com",
  "address": {
    "city": "Delhi",
    "pincode": "110001"
  },
  "skills": ["Node.js", "React", "MongoDB"],
  "isActive": true,
  "joinedAt": "2024-01-15T08:00:00Z"
}
```

---

# Document Features

## 1. Nested Objects (Embedded Documents)

```json
{
  "name": "Sachin",
  "address": {
    "city": "Delhi",
    "state": "UP",
    "country": "India"
  }
}
```

No separate table needed for address.

---

## 2. Arrays

```json
{
  "name": "Sachin",
  "skills": ["Node.js", "React", "MongoDB"],
  "orders": [
    { "productId": 1, "qty": 2 },
    { "productId": 3, "qty": 1 }
  ]
}
```

Store multiple values in one field.

---

## 3. Mixed Types

```json
{
  "name": "Sachin",
  "age": 25,
  "isActive": true,
  "score": 98.5,
  "createdAt": "2024-01-01T00:00:00Z",
  "tags": null
}
```

String, number, boolean, float, date, null — all in one document.

---

# Data Types in MongoDB

| Type         | Example                         |
| ------------ | ------------------------------- |
| String       | `"Sachin"`                      |
| Number       | `25`, `98.5`                    |
| Boolean      | `true`, `false`                 |
| Array        | `["Node.js", "React"]`          |
| Object       | `{ city: "Delhi" }`             |
| ObjectId     | `ObjectId("64a1b2...")`         |
| Date         | `new Date()`                    |
| Null         | `null`                          |

---

# The _id Field

Every document automatically gets a unique `_id`.

```json
{ "_id": ObjectId("64a1b2c3d4e5f6789abc1234") }
```

You can also set it manually:

```json
{ "_id": "sachin@gmail.com", "name": "Sachin" }
```

Use email or any unique value as `_id`.

---

# Document Size Limit

Maximum size per document: **16 MB**

This is usually more than enough.

If you need more, use GridFS (for large files like images, videos).

---

# CRUD with Documents — Quick Reference

## Insert

```javascript
db.users.insertOne({
    name: "Sachin",
    email: "sachin@gmail.com"
});
```

---

## Find

```javascript
db.users.findOne({ name: "Sachin" });
```

---

## Update

```javascript
db.users.updateOne(
    { name: "Sachin" },
    { $set: { age: 26 } }
);
```

---

## Delete

```javascript
db.users.deleteOne({ name: "Sachin" });
```

---

# Embedded vs Referenced Documents

This is a key design decision.

---

## Embedded (Denormalized)

```json
{
  "name": "Sachin",
  "orders": [
    { "product": "Laptop", "price": 50000 },
    { "product": "Mouse", "price": 1000 }
  ]
}
```

All data in one document.

Fast reads.

Use when data is always accessed together.

---

## Referenced (Normalized)

```json
// User document
{ "_id": 1, "name": "Sachin" }

// Order document
{ "_id": 101, "userId": 1, "product": "Laptop" }
```

Separate documents linked by ID.

Use when data is large or accessed independently.

---

# Company Example — Twitter/X

A tweet document:

```json
{
  "_id": "tweet_123",
  "content": "Just learned MongoDB!",
  "author": {
    "userId": "user_456",
    "username": "sachin84",
    "displayName": "Sachin Tyagi"
  },
  "likes": 42,
  "retweets": 5,
  "hashtags": ["#MongoDB", "#MERN"],
  "media": [],
  "createdAt": "2024-07-29T10:00:00Z"
}
```

Everything about a tweet in one document.

No JOINs to fetch a tweet with author details.

---

# Interview Questions

## Q1. What is a MongoDB Document?

**Best Answer**

> A Document is the basic unit of data in MongoDB, stored as a BSON (JSON-like) object. It can contain strings, numbers, arrays, nested objects, and other data types, making it highly flexible for representing complex data.

---

## Q2. What is the maximum size of a MongoDB document?

16 MB per document.

---

## Q3. What is the `_id` field?

A unique identifier automatically assigned to every document. It is of type `ObjectId` by default but can be any unique value.

---

## Q4. What is an embedded document?

A document nested inside another document. Used to store related data together, avoiding the need for JOINs.

---

## Q5. When to embed vs reference?

Embed when data is always read together and doesn't grow unboundedly. Reference when data is large, accessed independently, or shared between multiple documents.

---

# Professional Summary

```
Document = JSON-like object

Features:
  ✅ Nested objects
  ✅ Arrays
  ✅ Multiple data types
  ✅ Auto _id
  ✅ Max 16 MB

Design choices:
  Embed  → when data is small and always together
  Reference → when data is large or shared
```

---

# 🧠 Memory Trick

```
Document = Report Card

One piece of paper with:
  - Name (String)
  - Marks (Object)
  - Activities (Array)
  - Passed (Boolean)
  - Date (Date)

All on one card. No extra papers needed.
```

---

# 🚀 Next Chapter

We'll learn **BSON** — the binary format MongoDB actually uses to store your JSON documents, and why it makes MongoDB so fast.
