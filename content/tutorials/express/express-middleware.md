Welcome to **Chapter 2 — Express Middleware**.

> **Middleware is the most powerful concept in Express. Master this and everything else becomes easy.**

Every Express application runs on middleware — authentication, logging, parsing, error handling — all middleware.

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

Imagine you're going to a concert.

To enter you must pass through:

```
Gate 1 → Ticket Check

Gate 2 → Security Scan

Gate 3 → Bag Check

Gate 4 → Entry
```

Every gate is a **checkpoint**.

You cannot skip any.

Middleware in Express works exactly the same way.

Every request passes through checkpoints before reaching the final route.

---

# Another Example — Water Filter 🚰

Imagine a water purifier.

Water enters.

```
Raw Water

↓

Filter 1 (Remove Mud)

↓

Filter 2 (Remove Bacteria)

↓

Filter 3 (Add Minerals)

↓

Clean Water
```

Each filter is middleware.

The water (request) passes through every filter before reaching you.

---

# What is Middleware?

Middleware is a function that:

1. Receives `req`, `res`, and `next`
2. Does something (log, validate, parse, authenticate)
3. Either sends a response OR calls `next()` to pass to the next middleware

---

# Visual Diagram

```
HTTP Request

↓

Middleware 1 (Logger)

↓

Middleware 2 (Auth Check)

↓

Middleware 3 (Body Parser)

↓

Route Handler

↓

HTTP Response
```

---

# First Middleware

```javascript
const express = require("express");
const app = express();

function myMiddleware(req, res, next) {
    console.log("Request received:", req.method, req.url);
    next();
}

app.use(myMiddleware);

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.listen(3000);
```

Every request logs:

```
Request received: GET /
```

---

# Understanding next()

```javascript
function middleware(req, res, next) {

    console.log("Step 1");

    next();

}
```

`next()` says:

> "I'm done. Move to the next middleware."

Without `next()`:

```
Request → Middleware → STUCK
```

Request never reaches the route handler.

---

# Multiple Middleware

```javascript
app.use((req, res, next) => {
    console.log("Middleware 1");
    next();
});

app.use((req, res, next) => {
    console.log("Middleware 2");
    next();
});

app.get("/", (req, res) => {
    console.log("Route Handler");
    res.send("Done");
});
```

Output for every request:

```
Middleware 1
Middleware 2
Route Handler
```

---

# Types of Middleware

There are 5 types.

---

## 1. Application-Level Middleware

Applied to all routes.

```javascript
app.use((req, res, next) => {
    console.log("Every request");
    next();
});
```

---

## 2. Route-Level Middleware

Applied to specific routes.

```javascript
app.get("/admin", authCheck, (req, res) => {
    res.send("Admin Panel");
});
```

`authCheck` runs only for `/admin`.

---

## 3. Error-Handling Middleware

Has 4 parameters.

```javascript
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Something broke!");
});
```

---

## 4. Built-in Middleware

Provided by Express itself.

```javascript
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
```

---

## 5. Third-party Middleware

```javascript
const morgan = require("morgan");

app.use(morgan("dev"));
```

---

# Middleware with Route

```javascript
function isLoggedIn(req, res, next) {
    if (req.headers.authorization) {
        next();
    } else {
        res.status(401).send("Please login");
    }
}

app.get("/profile", isLoggedIn, (req, res) => {
    res.send("Profile Page");
});
```

Without auth header:

```
401 Please login
```

With auth header:

```
Profile Page
```

---

# Modifying the Request

Middleware can add data to `req`.

```javascript
app.use((req, res, next) => {
    req.startTime = Date.now();
    next();
});

app.get("/", (req, res) => {
    res.send(`Started at ${req.startTime}`);
});
```

This is how auth middleware attaches `req.user`.

---

# Company Example — Banking

Every banking API request goes through:

```
Request

↓

Logger Middleware (log everything)

↓

Auth Middleware (verify JWT token)

↓

Rate Limiter (max 100 req/min)

↓

Validator (check request body)

↓

Route Handler

↓

Response
```

Each is a separate middleware function.

---

# Professional Middleware Stack

```javascript
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000);
```

This is how production Express servers start.

---

# Interview Questions

## Q1. What is middleware in Express?

**Best Answer**

> Middleware is a function that has access to the request (`req`), response (`res`), and the `next` function. It can execute code, modify `req` and `res`, end the request-response cycle, or call `next()` to pass control to the next middleware.

---

## Q2. What happens if you don't call `next()`?

The request gets stuck and never reaches the route handler. The client will eventually time out.

---

## Q3. Difference between `app.use()` and `app.get()`?

| `app.use()`                      | `app.get()`                         |
| -------------------------------- | ----------------------------------- |
| Runs for ALL HTTP methods        | Runs only for GET requests          |
| Used for middleware              | Used for specific route handlers    |

---

## Q4. How many types of middleware are there?

Five:
1. Application-level
2. Route-level
3. Error-handling
4. Built-in
5. Third-party

---

## Q5. How do you handle errors with middleware?

Using a 4-parameter middleware function `(err, req, res, next)` registered with `app.use()` after all routes.

---

# Professional Summary

```
Request Arrives

↓

app.use() middleware (global)

↓

Route-specific middleware

↓

Route Handler

↓

(if error) Error Middleware

↓

Response Sent
```

---

# 🧠 Memory Trick

Think of middleware as **airport security**:

```
✈️ Airport (Express App)

Check-in Desk      → Route match

Security Scanner   → Auth Middleware

Customs            → Validator Middleware

Boarding Gate      → Route Handler
```

Every passenger (request) goes through every checkpoint in order.

---

# 🚀 Next Chapter

We'll learn **Route Parameters** — how to create dynamic URLs like `/users/123` or `/products/iphone-15`.
