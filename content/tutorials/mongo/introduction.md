Welcome to **MongoDB**.

> **MongoDB is the most popular NoSQL database in the world and the M in the MERN stack.**

If you're building with Node.js and React, MongoDB is your database.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions
* 🚀 Level 6 – Professional Developer

---

# 👶 Level 1 — Child Explanation

Imagine a big filing cabinet.

Inside are folders.

Each folder has papers.

```
📁 Filing Cabinet (Database)

    📂 Folder: Users (Collection)

        📄 Paper: { name: "Sachin", age: 25 }

        📄 Paper: { name: "Rahul", age: 30 }

    📂 Folder: Products (Collection)

        📄 Paper: { name: "Laptop", price: 50000 }
```

MongoDB is that filing cabinet.

But digital.

And incredibly fast.

---

# What is MongoDB?

MongoDB is a **NoSQL document database**.

Instead of tables and rows (SQL), it stores data as **JSON-like documents** in **collections**.

```
SQL           →   MongoDB

Database      →   Database

Table         →   Collection

Row           →   Document

Column        →   Field
```

---

# SQL vs MongoDB

| SQL                          | MongoDB                        |
| ---------------------------- | ------------------------------ |
| Relational database          | Non-relational (NoSQL)         |
| Tables with fixed schema     | Collections with flexible docs |
| Rows and columns             | Documents (JSON)               |
| JOIN to relate tables        | Embedded docs or `$lookup`     |
| Strict schema                | Schema-less (flexible)         |
| MySQL, PostgreSQL             | MongoDB, CouchDB               |

---

# Why MongoDB?

* **Flexible schema** — no fixed columns
* **JSON format** — JavaScript developers feel at home
* **Horizontally scalable** — can handle millions of records
* **Fast queries** — with indexes
* **Rich query language** — aggregation, filters, geo queries

---

# MongoDB Document Example

```json
{
  "_id": "64a1b2c3d4e5f6789abc1234",
  "name": "Sachin Tyagi",
  "email": "sachin@gmail.com",
  "age": 25,
  "address": {
    "city": "Delhi",
    "state": "UP",
    "pincode": "110001"
  },
  "skills": ["Node.js", "React", "MongoDB"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

One document holds all related data — including nested objects and arrays.

No JOINs needed.

---

# Visual Diagram

```
MongoDB Server

    │

    ├── Database: myapp

    │       │

    │       ├── Collection: users

    │       │       │

    │       │       ├── Document: { _id, name, email }

    │       │       ├── Document: { _id, name, email }

    │       │

    │       ├── Collection: products

    │               │

    │               ├── Document: { _id, name, price }

    │               ├── Document: { _id, name, price }
```

---

# The _id Field

Every MongoDB document has a unique `_id` field.

```json
{
  "_id": "64a1b2c3d4e5f6789abc1234"
}
```

This is an **ObjectId** — a 12-byte unique identifier.

Automatically generated if not provided.

---

# Installing MongoDB

## Cloud (Recommended — MongoDB Atlas)

```
1. Go to mongodb.com/atlas

2. Create free cluster

3. Get connection string

mongodb+srv://username:password@cluster0.mongodb.net/mydb
```

## Local

```bash
# Windows (using Chocolatey)
choco install mongodb

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
```

---

# Connecting with Mongoose

```bash
npm install mongoose
```

```javascript
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://user:pass@cluster0.mongodb.net/mydb")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));
```

---

# Company Example — LinkedIn

LinkedIn stores user profiles.

A single user document contains:

```json
{
  "name": "Sachin Tyagi",
  "headline": "Full Stack Developer",
  "experience": [
    { "company": "TCS", "role": "SDE", "years": 2 },
    { "company": "Infosys", "role": "Senior SDE", "years": 3 }
  ],
  "skills": ["Node.js", "React", "MongoDB"],
  "connections": 500
}
```

One document. All data. No JOINs.

Impossible with rigid SQL tables.

---

# Interview Questions

## Q1. What is MongoDB?

**Best Answer**

> MongoDB is a NoSQL, document-oriented database that stores data as JSON-like BSON documents in collections. It is flexible, scalable, and the default database choice for MERN stack applications.

---

## Q2. Difference between SQL and MongoDB?

| SQL                | MongoDB             |
| ------------------ | ------------------- |
| Tables and rows    | Collections and docs|
| Fixed schema       | Flexible schema     |
| JOINs              | Embedded documents  |

---

## Q3. What is a document in MongoDB?

A JSON-like object stored in a collection. It can contain nested objects and arrays.

---

## Q4. What is `_id` in MongoDB?

A unique identifier automatically added to every document. It is of type `ObjectId` by default.

---

# Professional Summary

```
MongoDB

↓

Database (myapp)

↓

Collection (users)

↓

Document ({ _id, name, email, ... })

↓

Fields (name, age, address, skills)
```

---

# 🧠 Memory Trick

```
MongoDB = Super Digital Filing Cabinet

Cabinet      → Database
Drawer       → Collection
Paper        → Document
Info on paper → Fields
Paper ID     → _id (ObjectId)
```

---

# 🚀 Next Chapter

We'll dive deep into **Collections** — what they are, how to create and manage them, and how they differ from SQL tables.