Welcome to **Chapter 7 — app.use()**.

> **`app.use()` is the foundation of every Express application. It's how you register middleware, mount routers, and build your entire app.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a building.

Every floor has a guard.

```
Floor 1 Guard → Checks ID
Floor 2 Guard → Checks bags
Floor 3 Guard → Takes temperature
Floor 4 Guard → Gives entry pass
```

Before you reach any room, you pass through every guard.

`app.use()` is how you add guards to the building.

---

# What is app.use()?

`app.use()` registers middleware in Express.

It says:

> "For every incoming request, run this function."

---

# Basic Syntax

```javascript
app.use(middlewareFunction);
```

or with a path:

```javascript
app.use("/api", middlewareFunction);
```

---

# Simplest Example

```javascript
const express = require("express");
const app = express();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Home");
});

app.listen(3000);
```

Every request logs:

```
GET /
GET /about
POST /login
```

---

# app.use() Without a Path

Runs for **every request** regardless of URL.

```javascript
app.use(express.json());

app.use((req, res, next) => {
    console.log("Global middleware");
    next();
});
```

---

# app.use() With a Path

Runs only for requests starting with that path.

```javascript
app.use("/api", (req, res, next) => {
    console.log("API middleware");
    next();
});
```

`GET /api/users` → middleware runs

`GET /about` → middleware does NOT run

---

# Visual Diagram

```
app.use()

↓

Request comes in

↓

Does path match?

Yes → Run middleware → next()

No  → Skip → next middleware
```

---

# app.use() vs app.get()

```javascript
app.use("/users", handler);
```

Matches:

```
GET  /users
POST /users
PUT  /users/5
DELETE /users/5/profile
```

Any method, any path starting with `/users`.

---

```javascript
app.get("/users", handler);
```

Matches only:

```
GET /users
```

---

| `app.use()`                | `app.get()`             |
| -------------------------- | ----------------------- |
| All HTTP methods           | Only GET                |
| Partial path match         | Exact path match        |
| Used for middleware        | Used for route handlers |

---

# Mounting a Router

The most common use of `app.use()` in large projects.

```javascript
const userRouter = require("./routes/users");
const productRouter = require("./routes/products");

app.use("/users", userRouter);
app.use("/products", productRouter);
```

All requests to `/users/*` go to `userRouter`.

All requests to `/products/*` go to `productRouter`.

---

# routes/users.js

```javascript
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json([{ id: 1, name: "Sachin" }]);
});

router.get("/:id", (req, res) => {
    res.json({ id: req.params.id });
});

module.exports = router;
```

---

# Full Professional Setup

```javascript
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const userRouter = require("./routes/users");
const productRouter = require("./routes/products");

const app = express();

// Global middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Route-specific middleware
app.use("/users", userRouter);
app.use("/products", productRouter);

// Error handler
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

app.listen(3000);
```

---

# Order Matters

```javascript
app.use(A);
app.use(B);
app.use(C);
```

Every request goes through:

```
A → B → C → Route Handler
```

If A doesn't call `next()`, B and C never run.

---

# Company Example — Swiggy

```
Request

↓

Morgan (logging)

↓

Helmet (security headers)

↓

CORS (allow frontend)

↓

express.json() (parse body)

↓

Auth Middleware (/api routes only)

↓

Route Handler (/api/orders)

↓

Response
```

Every layer added with `app.use()`.

---

# Interview Questions

## Q1. What does `app.use()` do?

**Best Answer**

> `app.use()` registers a middleware function in Express. It runs for all HTTP methods and optionally matches a path prefix, making it essential for adding global middleware and mounting sub-routers.

---

## Q2. Difference between `app.use()` and `app.get()`?

| `app.use()`             | `app.get()`          |
| ----------------------- | -------------------- |
| All methods             | GET only             |
| Prefix path matching    | Exact path matching  |
| Middleware registration | Route handling       |

---

## Q3. What happens if you don't call `next()` inside `app.use()`?

The request is stuck. No further middleware or routes execute.

---

## Q4. Can you use `app.use()` to mount routers?

Yes. This is one of its most powerful uses for organizing large codebases.

---

# Professional Summary

```
app.use(express.json())        → Parse body

app.use(morgan("dev"))         → Log requests

app.use(cors())                → Allow cross-origin

app.use("/api", apiRouter)     → Mount routes

app.use(errorHandler)          → Handle errors
```

---

# 🧠 Memory Trick

Think of `app.use()` as **installing apps on a phone**:

```
📱 Phone = Express app

Install Camera    → app.use(logger)
Install Maps      → app.use(cors)
Install Bank      → app.use("/api", apiRouter)
Install Antivirus → app.use(helmet)
```

Each `app.use()` adds a new capability to your app.

---

# 🚀 Next Chapter

We'll deeply understand **next()** — the function that keeps the request moving through your middleware chain.
