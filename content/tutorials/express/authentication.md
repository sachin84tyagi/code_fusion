Welcome to **Chapter 15 — Authentication**.

> **Authentication answers one question: "Who are you?" It is the front door of your application.**

Every application with users needs authentication.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a gated society.

A stranger arrives at the gate.

Guard asks:

> "Who are you? What's your name and flat number?"

Stranger says:

> "I'm Sachin, Flat 201."

Guard checks the register.

Confirms.

Opens the gate.

That process is **Authentication**.

---

# Authentication vs Authorization

This is the most common interview question.

| Authentication                 | Authorization                         |
| ------------------------------ | ------------------------------------- |
| Who are you?                   | What are you allowed to do?           |
| Login with email + password    | Access admin panel, delete posts      |
| First step                     | Second step (after authentication)    |

---

# Authentication Flow

```
User submits email + password

↓

Server checks database

↓

Password matches?

Yes → Generate JWT → Send to client

No  → 401 Unauthorized
```

---

# Password Hashing

Never store plain text passwords.

```javascript
// ❌ Never do this
user.password = "mypassword123"
```

Always hash with bcrypt.

```bash
npm install bcrypt
```

---

# How bcrypt Works

```javascript
const bcrypt = require("bcrypt");

// Hashing (during registration)
const hashed = await bcrypt.hash("myPassword123", 10);

// Comparing (during login)
const match = await bcrypt.compare("myPassword123", hashed);
```

The number `10` is the **salt rounds** — how many times the hashing algorithm runs.

More rounds = more secure but slower.

---

# Complete Auth System

```javascript
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "secret";

// Fake DB
const users = [];

// REGISTER
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields required" });
    }

    const existing = users.find(u => u.email === email);
    if (existing) {
        return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = { id: users.length + 1, name, email, password: hashedPassword };
    users.push(user);

    res.status(201).json({ message: "User registered" });
});

// LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, email }, SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
});

// AUTH MIDDLEWARE
function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "No token" });

    const token = header.split(" ")[1];

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}

// PROTECTED ROUTE
app.get("/profile", auth, (req, res) => {
    const user = users.find(u => u.id === req.user.userId);
    res.json({ name: user.name, email: user.email });
});

app.listen(3000);
```

---

# Full Flow Diagram

```
1. POST /register
   { name, email, password }

   ↓

   Hash password with bcrypt

   ↓

   Save user to DB

   ↓

   201 Created

─────────────────────

2. POST /login
   { email, password }

   ↓

   Find user by email

   ↓

   Compare password with bcrypt

   ↓

   Generate JWT

   ↓

   Return token

─────────────────────

3. GET /profile
   Authorization: Bearer <token>

   ↓

   Auth middleware verifies token

   ↓

   Attach user to req.user

   ↓

   Return profile
```

---

# Logout

JWT is stateless — there's no "logout" from the server's perspective.

Options:

1. Client deletes the token
2. Maintain a token blacklist (Redis)
3. Short expiry + refresh tokens

---

# Refresh Token Pattern

```
Access Token  → Short lived (15 minutes)
Refresh Token → Long lived (7 days)
```

When access token expires:

```
Client sends refresh token

↓

Server generates new access token

↓

Client continues
```

---

# Company Example — Swiggy

```
POST /auth/register   → Create account
POST /auth/login      → Get JWT token
GET  /profile         → Auth middleware → user data
POST /orders          → Auth middleware → place order
GET  /orders          → Auth middleware → view orders
DELETE /account       → Auth middleware → delete account
```

---

# Interview Questions

## Q1. What is Authentication?

**Best Answer**

> Authentication is the process of verifying the identity of a user. In REST APIs, it typically involves verifying credentials (email/password) and returning a JWT token for subsequent requests.

---

## Q2. Why do we hash passwords?

To protect user passwords from being exposed if the database is compromised. Hashing is one-way — you cannot reverse it.

---

## Q3. What is bcrypt?

A password hashing library. It uses salt rounds to make brute-force attacks slow and impractical.

---

## Q4. What are salt rounds in bcrypt?

The number of times the hashing algorithm runs. More rounds = more secure but slower. 10 is the standard default.

---

## Q5. Authentication vs Authorization?

Authentication verifies who you are. Authorization determines what you're allowed to do.

---

# Professional Summary

```
Register
  → Hash password
  → Save to DB

Login
  → Find user
  → Compare password
  → Generate JWT

Protected Route
  → Verify JWT
  → req.user = decoded
  → Handle request
```

---

# 🧠 Memory Trick

```
Authentication = Hotel Check-in

🏨 Show ID + Booking → Verified → Room Key (JWT)

Every room (route) → Scan key card (send token)
```

---

# 🚀 Next Chapter

We'll learn **Authorization** — how to control what each authenticated user is allowed to do, using roles and permissions.
