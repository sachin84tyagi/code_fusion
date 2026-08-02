Welcome to **Chapter 5 — Body Parser**.

> **Body Parser is how Express reads what the client sends in the request body.**

Without it, `req.body` is `undefined` — and your POST/PUT routes won't work.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you write a letter.

You put it in an envelope.

You send it.

The post office delivers the envelope.

But someone needs to **open** the envelope and **read** the letter inside.

That's what Body Parser does.

The request is the envelope.

The data inside is the letter.

Body Parser opens it.

---

# What is Request Body?

When a client sends data (login, signup, create product), the data travels in the **request body**.

```
Client → POST /login → { email, password }
```

The email and password are in the **body**.

---

# The Problem

Without Body Parser:

```javascript
app.post("/login", (req, res) => {
    console.log(req.body);
});
```

Output:

```
undefined
```

Express doesn't read the body by default.

You must tell it how.

---

# The Solution — express.json()

```javascript
const express = require("express");
const app = express();

app.use(express.json());

app.post("/login", (req, res) => {
    console.log(req.body);
    res.json({ received: req.body });
});

app.listen(3000);
```

Now send a POST request with body:

```json
{
  "email": "sachin@gmail.com",
  "password": "123456"
}
```

`req.body` becomes:

```javascript
{
  email: "sachin@gmail.com",
  password: "123456"
}
```

---

# Visual Diagram

```
POST /login

Body: { email, password }

↓

express.json() middleware

↓

Parses JSON body

↓

req.body = { email, password }

↓

Route Handler uses req.body
```

---

# Two Built-in Body Parsers

Express provides two built-in parsers.

---

## 1. express.json()

For JSON data (most APIs).

```javascript
app.use(express.json());
```

Used when Content-Type is:

```
application/json
```

---

## 2. express.urlencoded()

For HTML form data.

```javascript
app.use(express.urlencoded({ extended: true }));
```

Used when Content-Type is:

```
application/x-www-form-urlencoded
```

Example: HTML form submission.

---

# Complete Setup

```javascript
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

This handles both JSON APIs and HTML form submissions.

---

# Live Example — User Registration

```javascript
const express = require("express");
const app = express();

app.use(express.json());

app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields required" });
    }

    res.status(201).json({
        message: "User registered",
        user: { name, email }
    });
});

app.listen(3000);
```

POST `/register` with:

```json
{
  "name": "Sachin",
  "email": "sachin@gmail.com",
  "password": "secure123"
}
```

Response:

```json
{
  "message": "User registered",
  "user": {
    "name": "Sachin",
    "email": "sachin@gmail.com"
  }
}
```

---

# Handling Nested Data

```javascript
app.post("/orders", (req, res) => {
    const { customerId, items, address } = req.body;

    res.json({
        orderId: 101,
        customerId,
        items,
        deliveryAddress: address
    });
});
```

POST body:

```json
{
  "customerId": 5,
  "items": [
    { "productId": 1, "qty": 2 },
    { "productId": 3, "qty": 1 }
  ],
  "address": "Mumbai, India"
}
```

---

# What about `extended: true`?

```javascript
app.use(express.urlencoded({ extended: true }));
```

| `extended: true`         | `extended: false`          |
| ------------------------ | -------------------------- |
| Uses `qs` library        | Uses built-in `querystring`|
| Supports nested objects  | Only simple key-value pairs|
| Recommended              | Basic use only             |

---

# Old Way — body-parser package

Before Express 4.16, you needed a separate package.

```bash
npm install body-parser
```

```javascript
const bodyParser = require("body-parser");

app.use(bodyParser.json());
```

Now `express.json()` is built-in and preferred.

---

# Company Example — Flipkart

User places an order.

```
POST /orders

Body:
{
  "userId": 501,
  "productId": 202,
  "quantity": 2,
  "address": "Delhi, India"
}
```

Without Body Parser → `req.body` is `undefined` → Cannot save order.

With Body Parser → All data available → Order saved.

---

# Interview Questions

## Q1. What is Body Parser?

**Best Answer**

> Body Parser is middleware that parses incoming request bodies and makes the data available on `req.body`. Express provides it built-in via `express.json()` and `express.urlencoded()`.

---

## Q2. Why is `req.body` undefined?

Because the body-parsing middleware hasn't been added. Add `app.use(express.json())`.

---

## Q3. Difference between `express.json()` and `express.urlencoded()`?

| `express.json()`         | `express.urlencoded()`         |
| ------------------------ | ------------------------------ |
| Parses JSON bodies       | Parses HTML form data          |
| `application/json`       | `application/x-www-form-urlencoded` |

---

## Q4. Is `body-parser` still needed?

No. Since Express 4.16+, `express.json()` and `express.urlencoded()` are built-in.

---

# Professional Summary

```
Client sends POST/PUT request

↓

Body: JSON data

↓

express.json() middleware

↓

req.body = parsed data

↓

Route Handler

↓

Use req.body
```

---

# 🧠 Memory Trick

```
📧 Envelope (request)

↓

📬 Post Office (express.json)

↓

📄 Letter opened (req.body)

↓

You read the letter
```

---

# 🚀 Next Chapter

We'll master **Error Middleware** — how to catch and handle all errors in your Express application professionally.
