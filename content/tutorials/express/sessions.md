Welcome to **Chapter 18 — Sessions**.

> **Sessions allow the server to remember users across multiple requests. It's the classic way to manage authenticated state.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you go to a hospital.

You register at the front desk.

The nurse gives you a **token number**.

```
🎟️ Token: 47
```

Every time you go to a different department, you show token 47.

They look up your file using that number.

They know your name, age, history — everything.

**Sessions** work exactly the same way.

Your session ID is the token.

The server stores all your data internally.

---

# What is a Session?

A session is data stored **on the server** for each user.

```
Session Store (Server Memory or Redis)

Session ID: abc123
  userId: 42
  cart: [...]
  lastLogin: "2024-01-01"

Session ID: xyz789
  userId: 7
  cart: []
```

The client receives only the **session ID** (via cookie).

The actual data lives on the server.

---

# Sessions vs JWT

| Sessions                          | JWT                               |
| --------------------------------- | --------------------------------- |
| State stored on server            | State stored in token (client)    |
| Server must look up session ID    | Server only verifies signature    |
| Can be invalidated immediately    | Hard to invalidate before expiry  |
| Harder to scale (shared store)    | Easy to scale (stateless)         |
| Secure against token theft        | Vulnerable if token is stolen     |

---

# Install

```bash
npm install express-session
```

---

# Basic Setup

```javascript
const express = require("express");
const session = require("express-session");

const app = express();

app.use(session({
    secret: "mySessionSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.listen(3000);
```

---

# Session Options

| Option              | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `secret`            | Signs the session ID cookie                          |
| `resave`            | Re-save session even if unchanged (set `false`)      |
| `saveUninitialized` | Save new empty sessions (set `false`)                |
| `cookie.secure`     | Only send over HTTPS (`true` in production)          |
| `cookie.maxAge`     | Session expiry in milliseconds                       |

---

# Using Sessions

```javascript
// Login — save to session
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Fake auth check
    if (email === "sachin@gmail.com" && password === "123456") {
        req.session.userId = 1;
        req.session.email = email;
        return res.json({ message: "Logged in" });
    }

    res.status(401).json({ error: "Invalid credentials" });
});

// Protected route — read from session
app.get("/profile", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not logged in" });
    }

    res.json({
        message: "Profile",
        email: req.session.email
    });
});

// Logout — destroy session
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out" });
    });
});
```

---

# Flow Diagram

```
POST /login

↓

req.session.userId = 1

↓

Express saves session to store

↓

Sends cookie: Set-Cookie: connect.sid=abc123

↓

──────────────────────────────

GET /profile

↓

Browser sends: Cookie: connect.sid=abc123

↓

Express looks up session by abc123

↓

req.session = { userId: 1, email: ... }

↓

Route runs
```

---

# Session Stores

By default, sessions are stored in **memory** (RAM).

Problem: Restart server → all sessions lost.

For production, use a persistent store.

---

## Redis (Most Common)

```bash
npm install connect-redis redis
```

```javascript
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

const redisClient = createClient();
redisClient.connect();

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
```

Sessions survive server restarts.

Scale to multiple servers.

---

## MongoDB (connect-mongo)

```bash
npm install connect-mongo
```

```javascript
const MongoStore = require("connect-mongo");

app.use(session({
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/mydb" }),
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
```

---

# Shopping Cart with Sessions

```javascript
app.post("/cart/add", (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }

    req.session.cart.push(req.body.product);

    res.json({ cart: req.session.cart });
});

app.get("/cart", (req, res) => {
    res.json({ cart: req.session.cart || [] });
});

app.delete("/cart", (req, res) => {
    req.session.cart = [];
    res.json({ message: "Cart cleared" });
});
```

---

# Company Example — Online Banking

Banks prefer sessions because:

```
Session can be invalidated immediately
(Force logout if suspicious activity)
```

With JWT — you can't easily revoke.

With sessions — delete from Redis → user is logged out instantly.

---

# Interview Questions

## Q1. What is a session?

**Best Answer**

> A session is server-side storage of user-specific data, identified by a session ID sent to the client via cookie. Unlike JWT, the actual data lives on the server.

---

## Q2. Why not use in-memory sessions in production?

Sessions are lost when the server restarts and can't be shared across multiple server instances.

---

## Q3. What is the default session cookie name in express-session?

`connect.sid`

---

## Q4. How do you log out with sessions?

```javascript
req.session.destroy(callback);
res.clearCookie("connect.sid");
```

---

## Q5. Sessions vs JWT?

| Sessions           | JWT              |
| ------------------ | ---------------- |
| Server stores state| Client stores state |
| Easily revocable   | Hard to revoke   |
| Harder to scale    | Easy to scale    |

---

# Professional Summary

```
Login
  → Set req.session.userId
  → Session stored server-side
  → Cookie: session ID sent to client

Request
  → Client sends session ID cookie
  → Server looks up session
  → req.session contains data

Logout
  → req.session.destroy()
  → Clear cookie
```

---

# 🧠 Memory Trick

```
Session = Hospital Token System

🏥 Hospital (Server) stores your file

🎟️ Token (session ID) sent to you

Show token → Hospital retrieves your file instantly
```

---

# 🚀 Next Chapter

We'll learn **Helmet** — a critical security package that adds important HTTP headers to protect your Express app from common vulnerabilities.
