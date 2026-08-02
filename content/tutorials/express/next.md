Welcome to **Chapter 8 — next()**.

> **`next()` is the heartbeat of Express middleware. Without it, your request dies.**

Understanding `next()` deeply is what separates Express beginners from professionals.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a relay race.

Runner 1 runs.

Passes the baton to Runner 2.

Runner 2 passes to Runner 3.

Runner 3 crosses the finish line.

```
Runner 1 → Baton → Runner 2 → Baton → Runner 3 → 🏁
```

`next()` is that **baton pass**.

Without the baton pass, the race stops.

---

# What is next()?

`next()` is a function provided by Express to every middleware.

When called, it:

> "Passes control to the next middleware in the chain."

---

# Basic Example

```javascript
function middleware1(req, res, next) {
    console.log("Middleware 1");
    next();
}

function middleware2(req, res, next) {
    console.log("Middleware 2");
    next();
}

function routeHandler(req, res) {
    console.log("Route Handler");
    res.send("Done");
}

app.use(middleware1);
app.use(middleware2);
app.get("/", routeHandler);
```

Output:

```
Middleware 1
Middleware 2
Route Handler
```

---

# Without next()

```javascript
function middleware1(req, res, next) {
    console.log("Middleware 1");
    // next() NOT called
}

function middleware2(req, res, next) {
    console.log("Middleware 2");
    next();
}
```

Output:

```
Middleware 1
```

Request stops.

Client receives no response.

Eventually times out.

---

# Visual Diagram

```
Request

↓

Middleware 1
   └── next() called → ✅ continue

↓

Middleware 2
   └── next() NOT called → ❌ stop here

Route Handler never runs.
```

---

# next() with Error

```javascript
function middleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        next(new Error("No token provided"));
    } else {
        next();
    }
}
```

Passing an argument to `next()` tells Express to skip all remaining regular middleware and go directly to the **error handler**.

---

# Three Ways to Use next()

## 1. Call next() — continue

```javascript
next();
```

Move to the next middleware or route.

---

## 2. Call next(error) — jump to error handler

```javascript
next(new Error("Something went wrong"));
```

Skip all regular middleware. Go to error middleware.

---

## 3. Call next("route") — skip remaining handlers on this route

```javascript
next("route");
```

Advanced use. Skips remaining handlers for the current route.

---

# Auth Middleware Example

```javascript
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch (err) {
        next(err);
    }
}

app.get("/profile", authMiddleware, (req, res) => {
    res.json(req.user);
});
```

If no token → 401 response.

If invalid token → error handler.

If valid → `next()` → route handler runs.

---

# Chaining Multiple Middleware on a Route

```javascript
app.get(
    "/admin",
    authCheck,
    isAdmin,
    rateLimit,
    (req, res) => {
        res.send("Admin Panel");
    }
);
```

Each middleware calls `next()` to proceed.

If any stops without calling `next()`, the chain breaks.

---

# next() Inside async

```javascript
app.get("/users", async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        next(err);
    }
});
```

Always call `next(err)` in catch blocks, not `throw`.

`throw` inside async middleware does NOT automatically reach the error handler.

---

# Company Example — Swiggy Order

```
Order Request

↓

Logger Middleware (logs request) → next()

↓

Auth Middleware (checks token) → next()

↓

Rate Limiter (checks request count) → next()

↓

Validator (checks order body) → next()

↓

Order Controller

↓

Response
```

Each step calls `next()`.

If auth fails → `res.status(401).send()` — no `next()` — chain stops.

---

# Interview Questions

## Q1. What is `next()` in Express?

**Best Answer**

> `next()` is a function passed to every middleware that, when called, passes control to the next middleware or route handler in the chain. Without calling it, the request-response cycle stops.

---

## Q2. What happens when you call `next(error)`?

Express skips all remaining regular middleware and routes and jumps directly to the error-handling middleware (the 4-parameter middleware).

---

## Q3. What happens if you call both `res.send()` and `next()`?

A "headers already sent" error occurs. You should either send a response OR call `next()`, not both.

---

## Q4. What is `next("route")`?

It skips the remaining handlers for the current route and moves to the next matching route.

---

# Professional Summary

```
Request arrives

↓

Middleware 1
  → does work
  → calls next()

↓

Middleware 2
  → does work
  → calls next()

↓

Route Handler
  → does work
  → calls res.send()

↓

Response sent
```

---

# 🧠 Memory Trick

Think of `next()` as a **torch relay**:

```
🏃 Runner 1 (Middleware 1)
   runs... passes torch 🔦 → next()

🏃 Runner 2 (Middleware 2)
   runs... passes torch 🔦 → next()

🏁 Finish Line (Route Handler)
   res.send()
```

Drop the torch (don't call `next()`) → race stops.

---

# 🚀 Next Chapter

We'll learn **Static Files** — how to serve HTML, CSS, images, and other files directly from your Express server.
