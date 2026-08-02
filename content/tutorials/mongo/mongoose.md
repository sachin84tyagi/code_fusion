Welcome to **Chapter 12 — Mongoose**.

> **Mongoose is the most popular ODM (Object Document Mapper) for MongoDB in Node.js. It adds structure, validation, and power to your database layer.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you work at a library.

Without rules, anyone can put any book anywhere.

```
❌ Chaos:

A novel in the science section.
A textbook with no title.
A book with 0 pages.
```

With a librarian who enforces rules:

```
✅ Order:

Every book must have a title.
Every book must have an author.
Every book must have a category.
```

Mongoose is that librarian for MongoDB.

It enforces rules on your data.

---

# What is Mongoose?

Mongoose is a **Node.js library** that:

1. **Connects** to MongoDB
2. **Defines schemas** (structure/rules for documents)
3. **Provides models** (classes to interact with collections)
4. **Validates** data before saving
5. **Provides helper methods** for CRUD, hooks, virtuals, and more

---

# Install

```bash
npm install mongoose
```

---

# Connect to MongoDB

```javascript
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://user:pass@cluster0.mongodb.net/mydb")
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ Connection error:", err));
```

---

# Connection with Options (Production)

```javascript
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => {
    console.error("DB Error:", err);
    process.exit(1);
});
```

---

# Define a Schema

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email"]
    },
    age: {
        type: Number,
        min: 0,
        max: 120
    },
    role: {
        type: String,
        enum: ["user", "admin", "superadmin"],
        default: "user"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
```

---

# Create a Model

```javascript
const User = mongoose.model("User", userSchema);
```

Mongoose automatically uses the pluralized, lowercased collection name.

`"User"` → collection `"users"`

---

# CRUD with Mongoose

## Create

```javascript
const user = await User.create({
    name: "Sachin Tyagi",
    email: "sachin@gmail.com",
    age: 25
});
```

---

## Read

```javascript
const users = await User.find({ isActive: true });
const user = await User.findById(id);
const user = await User.findOne({ email: "sachin@gmail.com" });
```

---

## Update

```javascript
const updated = await User.findByIdAndUpdate(
    id,
    { $set: { age: 26 } },
    { new: true, runValidators: true }
);
```

---

## Delete

```javascript
await User.findByIdAndDelete(id);
```

---

# Schema Data Types

| Type         | Example              |
| ------------ | -------------------- |
| `String`     | Name, email          |
| `Number`     | Age, price           |
| `Boolean`    | isActive, isVerified |
| `Date`       | createdAt, updatedAt |
| `ObjectId`   | Foreign key refs     |
| `Array`      | Tags, skills         |
| `Mixed`      | Any type             |
| `Map`        | Key-value pairs      |

---

# Timestamps (Auto)

```javascript
const userSchema = new mongoose.Schema({
    name: String
}, { timestamps: true });
```

Automatically adds:

```json
{
  "createdAt": "2024-07-29T10:00:00Z",
  "updatedAt": "2024-07-29T11:00:00Z"
}
```

---

# Middleware (Hooks)

Run code before or after operations.

```javascript
// Hash password before saving
userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Log after delete
userSchema.post("findOneAndDelete", function(doc) {
    console.log(`User ${doc.email} deleted`);
});
```

---

# Virtual Fields

Computed fields that are NOT stored in the database.

```javascript
userSchema.virtual("fullName").get(function() {
    return `${this.firstName} ${this.lastName}`;
});

const user = await User.findById(id);
console.log(user.fullName); // "Sachin Tyagi"
```

---

# Methods and Statics

## Instance Method

```javascript
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const user = await User.findOne({ email });
const isMatch = await user.comparePassword("myPassword");
```

## Static Method

```javascript
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email });
};

const user = await User.findByEmail("sachin@gmail.com");
```

---

# Company Example — MERN Auth System

```javascript
// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
```

---

# Interview Questions

## Q1. What is Mongoose?

**Best Answer**

> Mongoose is an Object Document Mapper (ODM) for MongoDB in Node.js. It provides schema-based modeling, validation, middleware (hooks), virtuals, and helpful methods for interacting with MongoDB.

---

## Q2. What is the difference between Mongoose and MongoDB driver?

| MongoDB Driver           | Mongoose                      |
| ------------------------ | ----------------------------- |
| Low-level, no schema     | Schema-based, structured      |
| Raw queries              | Model-based, OOP style        |
| No validation            | Built-in validation           |

---

## Q3. What is `{ timestamps: true }`?

Automatically adds `createdAt` and `updatedAt` fields to every document.

---

## Q4. What are Mongoose hooks?

Functions (pre/post) that run automatically before or after operations like `save`, `find`, `delete`.

---

# Professional Summary

```
npm install mongoose

↓

mongoose.connect(MONGO_URI)

↓

Define Schema
  (types, validation, defaults)

↓

Create Model
  mongoose.model("Name", schema)

↓

Use Model for CRUD
  Model.create() / find() / update() / delete()
```

---

# 🧠 Memory Trick

```
Mongoose = Strict Librarian

MongoDB = Big messy library

Mongoose adds:
  📋 Rules (Schema)
  ✅ Validation
  🔧 Helper methods
  🔔 Automatic hooks
  🕐 Timestamps
```

---

# 🚀 Next Chapter

We'll learn **Schema** — how to define the structure and rules for your MongoDB documents in Mongoose.
