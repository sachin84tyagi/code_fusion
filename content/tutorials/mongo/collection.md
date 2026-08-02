Welcome to **Chapter 2 — Collection**.

> **A Collection is the MongoDB equivalent of a SQL table — but far more flexible. No fixed schema. No rigid columns.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a school.

Each classroom has students.

```
🏫 School (Database)

    🧑‍🏫 Class 1 (Collection: students)

        Student 1: { name: "Sachin", age: 15 }
        Student 2: { name: "Rahul", age: 16 }

    🧑‍🏫 Class 2 (Collection: teachers)

        Teacher 1: { name: "Mrs. Sharma", subject: "Math" }
```

Each class is a **Collection**.

Students in the class are **Documents**.

---

# What is a Collection?

A Collection is a **group of MongoDB documents**.

Similar to a table in SQL, but:

* No fixed schema required
* Documents in the same collection can have different fields
* Very flexible and scalable

---

# SQL vs MongoDB

| SQL Table              | MongoDB Collection         |
| ---------------------- | -------------------------- |
| Fixed columns (schema) | Flexible fields            |
| All rows same structure| Documents can differ       |
| Enforced constraints   | No default constraints     |

---

# Visual Diagram

```
Database: myapp

    Collection: users

        { _id: 1, name: "Sachin", email: "sachin@gmail.com", age: 25 }

        { _id: 2, name: "Rahul", email: "rahul@gmail.com" }

        { _id: 3, name: "Priya", email: "priya@gmail.com", phone: "9876543210" }
```

Notice: Document 2 has no `age`. Document 3 has a `phone` field. Both are in the same collection.

In SQL this would cause an error.

In MongoDB, it's perfectly fine.

---

# Creating a Collection

## Implicit (Automatic)

MongoDB creates a collection automatically when you insert your first document.

```javascript
db.users.insertOne({ name: "Sachin", email: "sachin@gmail.com" });
```

The `users` collection is created automatically.

---

## Explicit

```javascript
db.createCollection("users");
```

Useful when you want to set specific options upfront.

---

# With Options

```javascript
db.createCollection("orders", {
    capped: true,
    size: 1000000,
    max: 5000
});
```

| Option    | Meaning                              |
| --------- | ------------------------------------ |
| `capped`  | Fixed-size collection (circular log) |
| `size`    | Max size in bytes                    |
| `max`     | Max number of documents              |

---

# Mongoose Way

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model("User", userSchema);
```

Mongoose automatically creates a collection named `users` (lowercase + pluralized).

---

# Listing Collections

```javascript
show collections
```

Or via code:

```javascript
const collections = await mongoose.connection.db.listCollections().toArray();
console.log(collections.map(c => c.name));
```

---

# Dropping a Collection

```javascript
db.users.drop();
```

Or with Mongoose:

```javascript
await User.collection.drop();
```

Permanently deletes all documents in the collection.

---

# Capped Collections

A special type of collection with a fixed size.

Like a circular buffer — when full, oldest documents are automatically deleted.

```javascript
db.createCollection("logs", {
    capped: true,
    size: 100000
});
```

Used for:

* Application logs
* Activity feeds
* Real-time event streams

---

# Company Example — E-commerce

An e-commerce platform like Amazon has multiple collections:

```
Database: amazon

    Collection: users
    Collection: products
    Collection: orders
    Collection: reviews
    Collection: categories
    Collection: payments
    Collection: shipments
```

Each collection handles one type of data.

---

# Flexible Schema in Action

```
Collection: products

Document 1 (Physical Product):
{ name: "Laptop", price: 50000, weight: "2kg", brand: "Dell" }

Document 2 (Digital Product):
{ name: "eBook", price: 299, format: "PDF", pages: 300 }

Document 3 (Service):
{ name: "Cleaning", price: 500, duration: "2 hours", area: "Mumbai" }
```

All three types in one collection.

Different fields.

Impossible in SQL without complex schema design.

---

# Interview Questions

## Q1. What is a Collection in MongoDB?

**Best Answer**

> A Collection is a group of MongoDB documents, analogous to a table in SQL. Unlike SQL tables, collections do not enforce a fixed schema — documents within the same collection can have different fields.

---

## Q2. How is a Collection different from a SQL Table?

| SQL Table           | MongoDB Collection    |
| ------------------- | --------------------- |
| Fixed schema        | Flexible schema       |
| Strict data types   | Mixed document types  |
| All rows must match | Documents can differ  |

---

## Q3. How does MongoDB create a collection?

Implicitly when the first document is inserted, or explicitly using `db.createCollection()`.

---

## Q4. What is a Capped Collection?

A fixed-size collection that overwrites the oldest documents when full. Used for logs and real-time data.

---

# Professional Summary

```
Database
  └── Collection (like a table)
        └── Document (like a row)
              └── Field (like a column)

No fixed schema
Documents in same collection can differ
Auto-created on first insert
```

---

# 🧠 Memory Trick

```
📚 Library = Database

📖 Genre Section (Collection)
   - Fiction
   - Science
   - Biography

📄 Each Book = Document

Books in Fiction section don't all need same pages/author fields.
```

---

# 🚀 Next Chapter

We'll deeply understand **Documents** — the core unit of MongoDB and how they store rich, nested data.
