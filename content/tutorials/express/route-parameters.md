Welcome to **Chapter 3 — Route Parameters**.

> **Route Parameters make your URLs dynamic. Instead of 100 routes, you write one.**

Every modern API uses route parameters.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a post office.

Every house has a unique address.

```
House 1 → Door Number 1

House 2 → Door Number 2

House 3 → Door Number 3
```

The postman doesn't memorize every single address.

He uses a pattern:

```
Street Name → House Number
```

Route parameters work exactly the same way.

---

# The Problem Without Parameters

Suppose you have users.

```
User 1
User 2
User 3
User 4
...
User 10000
```

Without route parameters you'd write:

```javascript
app.get("/users/1", handler);
app.get("/users/2", handler);
app.get("/users/3", handler);
// Impossible...
```

---

# The Solution

One route handles all of them.

```javascript
app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    res.send(`User ID: ${id}`);
});
```

Visit `/users/1` → `User ID: 1`

Visit `/users/99` → `User ID: 99`

---

# What is `:id`?

The `:` marks a **parameter placeholder**.

```
/users/:id
```

When a request comes in:

```
/users/42
```

Express sets:

```javascript
req.params.id = "42"
```

---

# Visual Diagram

```
Request: GET /users/42

↓

Route: /users/:id

↓

req.params.id = "42"

↓

Handler runs

↓

Response
```

---

# Multiple Parameters

```javascript
app.get("/users/:userId/posts/:postId", (req, res) => {
    const { userId, postId } = req.params;
    res.json({ userId, postId });
});
```

Visit `/users/5/posts/12`

Response:

```json
{
  "userId": "5",
  "postId": "12"
}
```

---

# Live Example — Product API

```javascript
const express = require("express");
const app = express();

const products = [
    { id: 1, name: "Laptop" },
    { id: 2, name: "Phone" },
    { id: 3, name: "Tablet" }
];

app.get("/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ error: "Not found" });
    }

    res.json(product);
});

app.listen(3000);
```

Visit `/products/2`

Response:

```json
{
  "id": 2,
  "name": "Phone"
}
```

---

# Important: Parameters are Strings

```javascript
req.params.id
```

This is always a **string**.

```
"/users/42"

↓

req.params.id = "42"  (string, not number)
```

Convert when needed:

```javascript
const id = parseInt(req.params.id);
```

---

# Optional Parameters

Use `?` to make a parameter optional.

```javascript
app.get("/users/:id?", (req, res) => {
    if (req.params.id) {
        res.send(`User: ${req.params.id}`);
    } else {
        res.send("All Users");
    }
});
```

`/users/5` → `User: 5`

`/users` → `All Users`

---

# Route Patterns

Express also supports wildcards.

```javascript
app.get("/files/*", (req, res) => {
    res.send(`File path: ${req.params[0]}`);
});
```

`/files/images/photo.jpg` → `File path: images/photo.jpg`

---

# Company Example — YouTube

Every YouTube video has a unique ID.

```
youtube.com/watch?v=dQw4w9WgXcQ
```

But many platforms use URL-based IDs:

```
/videos/:videoId
```

Or for nested resources:

```
/channels/:channelId/videos/:videoId
```

One route definition.

Millions of videos handled.

---

# Company Example — Amazon

```
/products/:productId

/categories/:categoryId/products/:productId

/orders/:orderId/items/:itemId
```

---

# Interview Questions

## Q1. What are route parameters?

**Best Answer**

> Route parameters are named URL segments that capture the values specified at their position in the URL. They are accessed via `req.params`.

---

## Q2. How do you define a route parameter?

Using `:` prefix in the route path:

```javascript
app.get("/users/:id", handler);
```

---

## Q3. What data type is `req.params.id`?

Always a **string**. Convert with `parseInt()` or `Number()` when needed.

---

## Q4. Difference between route params and query params?

| Route Params `/users/:id` | Query Params `/users?id=5` |
| ------------------------- | -------------------------- |
| Part of the URL path      | After the `?` symbol       |
| Required by default       | Optional                   |
| Identifies a resource     | Filters/sorts resources    |

---

# Professional Summary

```
Route Definition
   /users/:id

↓

Request: GET /users/42

↓

Express extracts
   req.params.id = "42"

↓

Handler uses the value

↓

Response
```

---

# 🧠 Memory Trick

Think of route parameters like **door numbers on a street**:

```
🏘️ Street: /users/

🏠 House :id → req.params.id

Visit house 42 → req.params.id = "42"
Visit house 99 → req.params.id = "99"
```

One street pattern. Every house reachable.

---

# 🚀 Next Chapter

We'll learn **Query Parameters** — how to handle `/products?category=electronics&sort=price` style URLs.
