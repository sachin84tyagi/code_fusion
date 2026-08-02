Welcome to **Chapter 16 — Authorization**.

> **Authorization answers: "What are you allowed to do?" It is the second layer of security after authentication.**

Authentication tells us who you are. Authorization tells us what you can do.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine an office building.

You get an ID card (authentication).

But the ID card has different access levels.

```
Security Guard   → Can enter gate
Office Staff     → Can enter their floor
Manager          → Can enter manager cabin
CEO              → Can enter everywhere
```

Everyone is verified.

But they have different permissions.

That's **Authorization**.

---

# Authentication vs Authorization

| Authentication             | Authorization                       |
| -------------------------- | ----------------------------------- |
| Verify who you are         | What you are allowed to do          |
| Login with credentials     | Role-based access control           |
| "I know you."              | "But you can only do this."         |
| First step                 | Second step                         |

---

# Role-Based Access Control (RBAC)

The most common authorization pattern.

Users are assigned **roles**.

Roles have **permissions**.

```
user  → Can view products, place orders
admin → Can add/edit/delete products
super → Can manage users, access reports
```

---

# Storing Role in JWT

```javascript
const token = jwt.sign(
    { userId: 1, email: "sachin@gmail.com", role: "admin" },
    SECRET,
    { expiresIn: "1h" }
);
```

The role travels with the token.

No extra database lookup needed.

---

# Auth Middleware

```javascript
function auth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}
```

---

# Role Middleware (Authorization)

```javascript
function authorize(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied" });
        }
        next();
    };
}
```

---

# Using Both Middleware

```javascript
// Everyone authenticated can view
app.get("/products", auth, handler);

// Only admins can create
app.post("/products", auth, authorize("admin"), handler);

// Only admins can delete
app.delete("/products/:id", auth, authorize("admin"), handler);

// Only super admins can manage users
app.delete("/users/:id", auth, authorize("super"), handler);
```

---

# Flow Diagram

```
Request: DELETE /products/5

↓

auth middleware
  → verify JWT
  → attach req.user = { userId, role: "user" }

↓

authorize("admin") middleware
  → req.user.role = "user"
  → "user" not in ["admin"]
  → 403 Forbidden

↓

Route never runs
```

---

# Multiple Roles

```javascript
// Allow both admin and super
app.put("/products/:id", auth, authorize("admin", "super"), handler);
```

---

# Resource-Level Authorization

Sometimes you need to check ownership.

```javascript
app.delete("/posts/:id", auth, async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Not found" });

    // Check ownership
    if (post.authorId !== req.user.userId && req.user.role !== "admin") {
        return res.status(403).json({ error: "Not your post" });
    }

    await post.delete();
    res.json({ message: "Post deleted" });
});
```

Users can only delete their own posts.

Admins can delete any post.

---

# Full Auth System

```javascript
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const SECRET = "mySecret";

// Fake users
const users = [
    { id: 1, email: "user@gmail.com", role: "user" },
    { id: 2, email: "admin@gmail.com", role: "admin" }
];

// Auth middleware
function auth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}

// Authorize middleware
function authorize(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden" });
        }
        next();
    };
}

// Routes
app.get("/dashboard", auth, (req, res) => {
    res.json({ message: "Welcome", user: req.user });
});

app.post("/products", auth, authorize("admin"), (req, res) => {
    res.status(201).json({ message: "Product created (admin only)" });
});

app.delete("/users/:id", auth, authorize("admin", "super"), (req, res) => {
    res.json({ message: "User deleted (admin/super only)" });
});

app.listen(3000);
```

---

# Company Example — YouTube

```
viewer   → Watch videos
creator  → Upload, edit own videos
moderator → Delete any video
admin    → Manage users, monetization
```

Every action is protected by role-based authorization.

---

# Company Example — Banking App

```
customer → View balance, transfer within limit
teller   → Deposit, withdraw
manager  → Approve large transactions
admin    → Access audit logs, manage accounts
```

---

# Interview Questions

## Q1. What is Authorization?

**Best Answer**

> Authorization is the process of determining what an authenticated user is allowed to do. It typically uses roles or permissions to grant or restrict access to specific routes or resources.

---

## Q2. What is RBAC?

Role-Based Access Control — assigning users to roles (admin, user, moderator) and granting permissions based on those roles.

---

## Q3. Difference between Authentication and Authorization?

Authentication = "Who are you?" (login)

Authorization = "What can you do?" (permissions)

---

## Q4. What status code for authorization failure?

`403 Forbidden` — the user is authenticated but doesn't have permission.

---

## Q5. Where should you store the role?

In the JWT payload. This avoids an extra database lookup on every request.

---

# Professional Summary

```
Request

↓

auth middleware
  → Verify JWT
  → Attach req.user (with role)

↓

authorize middleware
  → Check role
  → Allow or 403

↓

Route Handler

↓

Response
```

---

# 🧠 Memory Trick

```
🏢 Office Building

ID Card Check = Authentication

Floor Access Level = Authorization

Security Guard = auth middleware
Floor Scanner  = authorize middleware
```

---

# 🚀 Next Chapter

We'll learn **Cookies** — how browsers and servers store small pieces of data for sessions, tracking, and authentication.
