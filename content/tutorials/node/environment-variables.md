Excellent! 🔐

Now let's master one of the most important concepts in professional Node.js development.

# Chapter 16 — Environment Variables

> **Environment Variables are the secret safe of every production application.**

Every experienced developer manages configuration through environment variables.

---

# Learning Roadmap

By the end of this chapter, you'll understand:

* ✅ What are Environment Variables?
* ✅ Why do we need them?
* ✅ `process.env`
* ✅ `.env` files
* ✅ The `dotenv` package
* ✅ Development vs Production
* ✅ Security Best Practices
* ✅ Company Examples
* ✅ Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you have a lock box at home.

Inside it you store:

```text
🔒 Lock Box

Bank PIN

Email Password

WiFi Password
```

You don't write these on the wall.

You don't share them.

Only you know.

That's exactly what Environment Variables are for your Node.js application.

---

# Real Life Example 🏦

Imagine a bank employee.

Every morning they arrive at work.

They enter a **secret code** to access the vault.

That code is **not written in the employee handbook**.

It is stored in a secure system.

Node.js uses Environment Variables exactly the same way.

---

# What is an Environment Variable?

An environment variable is a **key-value pair** stored outside your code.

Example:

```text
PORT=5000

DATABASE_URL=mongodb://localhost/mydb

JWT_SECRET=myultrasecretkey

API_KEY=abc123xyz
```

These values are separate from your code.

They change between environments.

---

# Visual Diagram

```text
Development Machine

↓

process.env.PORT = 3000

-----------------------

Staging Server

↓

process.env.PORT = 4000

-----------------------

Production Server

↓

process.env.PORT = 5000
```

Same code.

Different configuration.

---

# The Big Problem

Suppose you hardcode:

```javascript
const dbUrl = "mongodb://localhost/mydb";
```

Then you push to GitHub.

Everyone sees your database URL.

Very dangerous.

---

Instead:

```javascript
const dbUrl = process.env.DATABASE_URL;
```

The actual URL lives outside your code.

---

# How to Use Environment Variables

## Method 1 — Terminal

Windows PowerShell:

```bash
$env:PORT=3000
node app.js
```

Linux/macOS:

```bash
PORT=3000 node app.js
```

---

## Method 2 — .env File (Professional)

Create a file named:

```text
.env
```

Inside:

```text
PORT=5000
DATABASE_URL=mongodb://localhost/mydb
JWT_SECRET=mysecretkey123
```

---

# dotenv Package

Node.js does NOT load `.env` automatically.

You need the `dotenv` package.

Install:

```bash
npm install dotenv
```

Use:

```javascript
require("dotenv").config();

console.log(process.env.PORT);
```

Output:

```text
5000
```

---

# Full Example

.env

```text
PORT=5000
DB_URL=mongodb://localhost/shop
JWT_SECRET=superSecret123
NODE_ENV=development
```

---

app.js

```javascript
require("dotenv").config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Output:

```text
Server running on port 5000
```

---

# Why `|| 3000`?

```javascript
const PORT = process.env.PORT || 3000;
```

If `PORT` is not set in the environment, use `3000` as the default.

This is a common professional pattern.

---

# NODE_ENV — Very Important

```javascript
if (process.env.NODE_ENV === "production") {
    console.log("Production mode");
} else {
    console.log("Development mode");
}
```

Common values:

```text
development

staging

production

test
```

---

# Different .env Files

Professional projects often have multiple `.env` files:

```text
.env               → Default values

.env.development   → Development overrides

.env.production    → Production overrides

.env.test          → Test environment
```

---

# Security Rules

## ✅ Always add .env to .gitignore

```text
.gitignore

↓

.env
```

Otherwise your secrets go to GitHub.

---

## ✅ Never hardcode secrets

❌ Wrong

```javascript
const secret = "ABC123";
```

✅ Correct

```javascript
const secret = process.env.JWT_SECRET;
```

---

## ✅ Share .env.example (not .env)

```text
.env.example

↓

PORT=
DATABASE_URL=
JWT_SECRET=
```

Share the template.

Not the actual values.

---

# Company Example — Amazon

Every Amazon service has a different configuration for:

```text
Development

↓

Staging

↓

Production
```

```text
dev-api.amazon.com

staging-api.amazon.com

api.amazon.com
```

Each uses different environment variables.

---

# Company Example — Banking App

```text
.env.production

↓

DB_HOST=prod-db.bank.com

DB_PASSWORD=<ultra secure>

JWT_SECRET=<rotate monthly>

ENCRYPTION_KEY=<256 bit>
```

These are NEVER in the source code.

---

# Company Example — Express Server

```javascript
require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("DB Connected"))
    .catch(err => console.error(err));

const app = express();

app.listen(process.env.PORT);
```

Clean.

No sensitive data in the code.

---

# Interview Questions

## Q1. What is an Environment Variable?

**Best Answer**

> An environment variable is a key-value pair stored outside the application code, used to configure the application for different environments without modifying the source code.

---

## Q2. Why not hardcode secrets?

Because source code is often shared (Git, teams). Hardcoded secrets expose credentials to anyone with access to the code.

---

## Q3. What is `process.env`?

An object in Node.js that contains all environment variables available to the current process.

---

## Q4. What does `dotenv` do?

It reads a `.env` file and loads the key-value pairs into `process.env` so your application can access them.

---

## Q5. What is `NODE_ENV`?

A standard environment variable that tells the application which environment it is running in (development, production, test, etc.).

---

## Q6. Why add `.env` to `.gitignore`?

To prevent secrets and sensitive configuration from being committed to version control and exposed publicly.

---

# Professional Summary

```text
.env File

↓

dotenv.config()

↓

process.env

↓

Application Uses Config

↓

Same Code

↓

Different Behavior in Dev / Staging / Production
```

---

# 🧠 Memory Trick

Think of environment variables as a **car's key fob**.

```text
🚗 Car Key Fob

Office Car Key → DATABASE_URL (office)

Home Car Key   → DATABASE_URL (dev)

Rental Key     → DATABASE_URL (staging)
```

Same car (your app).

Different keys (config) for each environment.

---

# 🎯 HCL MERN Assessment Focus

Frequently tested:

* What is an environment variable?
* What is `process.env`?
* What is the purpose of `dotenv`?
* What is `NODE_ENV`?
* Why should `.env` be in `.gitignore`?
* How do you provide default values for environment variables?

---

# 🚀 Next Chapter

We'll move to **Cluster** — one of the most powerful Node.js features for production performance, where you'll learn how to use all CPU cores in a server instead of just one.
