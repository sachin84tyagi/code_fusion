Welcome to **Chapter 6 — Error Middleware**.

> **Without proper error handling, one bug crashes your entire server. Error middleware is your safety net.**

Every professional Express application has a centralized error handler.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you work in a call center.

A customer calls.

Something goes wrong.

```
Customer: "My order is missing!"
```

You don't say:

> "System crashed. Goodbye."

You say:

> "I'm sorry. Let me check that for you."

You handle the problem professionally.

Error Middleware in Express works exactly the same.

Instead of crashing the server, it catches errors and sends a proper response.

---

# The Problem Without Error Handling

```javascript
app.get("/user/:id", (req, res) => {
    const user = findUser(req.params.id);
    res.json(user.profile);
});
```

If `user` is `null`:

```
TypeError: Cannot read properties of null
```

Server crashes or sends an ugly error.

---

# The Solution — Error Middleware

Error middleware has **4 parameters**.

```javascript
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: err.message });
});
```

The `err` parameter makes it an error handler.

Express recognizes 4-param middleware as error handlers automatically.

---

# Visual Diagram

```
Route Handler throws error

↓

next(error) called

↓

Express skips regular middleware

↓

Error Middleware catches it

↓

Sends proper error response
```

---

# How to Trigger Error Middleware

Use `next(error)`.

```javascript
app.get("/user/:id", (req, res, next) => {
    try {
        const user = findUser(req.params.id);
        if (!user) {
            throw new Error("User not found");
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});
```

---

# Complete Error Handling Pattern

```javascript
const express = require("express");
const app = express();

app.use(express.json());

// Routes
app.get("/products/:id", (req, res, next) => {
    try {
        const product = getProduct(req.params.id);
        res.json(product);
    } catch (err) {
        next(err);
    }
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Error Handler (must be last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || "Internal server error"
    });
});

app.listen(3000);
```

---

# Custom Error Class

Professional applications create custom errors.

```javascript
class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

app.get("/user/:id", (req, res, next) => {
    const user = findUser(req.params.id);

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    res.json(user);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});
```

Proper HTTP status codes with proper messages.

---

# async/await Error Handling

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

Or use a wrapper function:

```javascript
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

app.get("/users", asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json(users);
}));
```

No more `try/catch` in every route.

---

# Error Types

```javascript
app.use((err, req, res, next) => {

    // Validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    }

    // JWT error
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token" });
    }

    // Default
    res.status(500).json({ error: "Something went wrong" });
});
```

---

# 404 vs 500

```
404 Not Found   → Route doesn't exist

500 Server Error → Something went wrong inside the app
```

```javascript
// 404 Middleware (after all routes)
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// 500 Error Handler (must be last, 4 params)
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});
```

---

# Company Example — Banking

A payment fails.

```
Database connection error
```

Without error middleware:

```
Server crash
Customer sees: "Cannot read property of undefined"
```

With error middleware:

```
Customer sees: "Payment could not be processed. Please try again."
```

Professional. Secure. No internal details leaked.

---

# Interview Questions

## Q1. What is Error Middleware in Express?

**Best Answer**

> Error middleware is a special middleware function with 4 parameters `(err, req, res, next)` that catches errors passed via `next(err)` and sends a proper error response. It must be registered after all routes.

---

## Q2. How is error middleware different from regular middleware?

Error middleware has 4 parameters (`err, req, res, next`) while regular middleware has 3 (`req, res, next`).

---

## Q3. Where should error middleware be placed?

**After all routes and regular middleware** — at the very end of the application.

---

## Q4. How do you pass an error to error middleware?

```javascript
next(new Error("Something went wrong"));
```

---

## Q5. How do you handle async errors?

Wrap in `try/catch` and call `next(err)`, or use an `asyncHandler` wrapper.

---

# Professional Summary

```
Route throws error

↓

next(err)

↓

Skip regular middleware

↓

Error Middleware (4 params)

↓

Log error

↓

Send status + message

↓

Client receives safe response
```

---

# 🧠 Memory Trick

Think of error middleware as a **hospital emergency room**:

```
🏥 Emergency Room (Error Middleware)

Patient arrives (error)

↓

Doctor examines (err.message, err.status)

↓

Treatment (res.status().json())

↓

Patient goes home safely
```

The ER catches all emergencies. The app never crashes.

---

# 🚀 Next Chapter

We'll master **app.use()** — the Swiss Army knife of Express that powers all middleware registration.
