Welcome to **Chapter 14 — JWT (JSON Web Tokens)**.

> **JWT is the most popular way to implement stateless authentication in modern REST APIs.**

Every MERN application, every production API uses JWT.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you go to an amusement park.

You buy a ticket.

```
🎟️ Ticket
```

The ticket says:

```
Valid for: 1 day
Name: Sachin
```

At every ride, the staff checks the ticket.

You don't need to go back to the ticket counter each time.

The ticket itself proves who you are.

**JWT is that ticket.**

---

# The Problem Without JWT

Traditional sessions:

```
User logs in

↓

Server creates session

↓

Stores in database/memory

↓

Sends session ID (cookie)

↓

Every request → check database
```

Problems:

* Server must remember every session
* Doesn't scale well
* Hard to use across multiple servers

---

# The Solution — JWT

```
User logs in

↓

Server creates JWT token

↓

Sends token to client

↓

Client stores token

↓

Every request → sends token in header

↓

Server verifies token (no database needed)
```

Stateless.

Scalable.

---

# What is JWT?

JWT is a compact, self-contained token.

Structure:

```
xxxxx.yyyyy.zzzzz

Header.Payload.Signature
```

---

## Header

Algorithm used.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

---

## Payload

Your data (claims).

```json
{
  "userId": 42,
  "email": "sachin@gmail.com",
  "role": "admin",
  "exp": 1700000000
}
```

---

## Signature

Verifies the token wasn't tampered with.

```
HMACSHA256(
  base64(header) + "." + base64(payload),
  secret
)
```

---

# Install

```bash
npm install jsonwebtoken
```

---

# Creating a Token

```javascript
const jwt = require("jsonwebtoken");

const token = jwt.sign(
    { userId: 42, email: "sachin@gmail.com" },
    "mySecretKey",
    { expiresIn: "1h" }
);

console.log(token);
```

Output:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2...
```

---

# Verifying a Token

```javascript
try {
    const decoded = jwt.verify(token, "mySecretKey");
    console.log(decoded);
} catch (err) {
    console.log("Invalid token");
}
```

Output:

```javascript
{
  userId: 42,
  email: "sachin@gmail.com",
  iat: 1700000000,
  exp: 1700003600
}
```

---

# Complete Login + Protected Route

```javascript
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "mySecret";

// Login route — generates token
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Check credentials (simplified)
    if (email === "sachin@gmail.com" && password === "123456") {
        const token = jwt.sign({ userId: 1, email }, SECRET, { expiresIn: "1h" });
        return res.json({ token });
    }

    res.status(401).json({ error: "Invalid credentials" });
});

// Auth middleware
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
}

// Protected route
app.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Profile", user: req.user });
});

app.listen(3000);
```

---

# Flow Diagram

```
POST /login
   email + password

↓

Verify credentials

↓

Generate JWT

↓

Return token to client

↓

Client stores token (localStorage)

↓

GET /profile
   Authorization: Bearer <token>

↓

authMiddleware verifies token

↓

req.user = decoded payload

↓

Return profile data
```

---

# Token Expiry

```javascript
jwt.sign(payload, secret, { expiresIn: "1h" });
```

Common values:

```
"1h"    → 1 hour
"7d"    → 7 days
"30m"   → 30 minutes
"1y"    → 1 year
```

---

# Company Example — Google

When you log into Google:

```
Login → Google verifies → Issues JWT

↓

You access Gmail, Drive, YouTube with same token

↓

Token contains: userId, scopes, expiry
```

No database lookup for each request.

---

# JWT vs Sessions

| JWT                              | Sessions                         |
| -------------------------------- | -------------------------------- |
| Stateless                        | Stateful                         |
| Token stored on client           | Session ID stored on server      |
| Scalable across servers          | Requires shared session store    |
| Cannot be invalidated easily     | Can be invalidated immediately   |

---

# Security Best Practices

✅ Store JWT secret in `.env`

✅ Set short expiry times

✅ Use HTTPS only

✅ Never store sensitive data in payload

❌ Don't store JWT in localStorage for high-security apps (use httpOnly cookies)

---

# Interview Questions

## Q1. What is JWT?

**Best Answer**

> JWT (JSON Web Token) is a compact, self-contained token used for stateless authentication. It consists of three parts: header, payload, and signature.

---

## Q2. What are the three parts of JWT?

1. **Header** — algorithm and type
2. **Payload** — user data (claims)
3. **Signature** — verifies integrity

---

## Q3. Is JWT secure?

The payload is base64-encoded (not encrypted), so don't store sensitive data. The signature ensures it hasn't been tampered with.

---

## Q4. How does the server verify a JWT?

Using `jwt.verify(token, secret)`. If the signature matches and the token hasn't expired, it's valid.

---

## Q5. JWT vs Sessions?

JWT is stateless (no server storage needed). Sessions require storing state on the server.

---

# 🧠 Memory Trick

```
JWT = Signed Passport

📕 Passport (JWT)

    Cover      → Header (algorithm)
    Details    → Payload (userId, email)
    Stamp      → Signature (server-signed)
```

When you enter a country (protected route), they verify the stamp — not your birth certificate.

---

# 🚀 Next Chapter

We'll learn **Authentication** — the complete system of registering, logging in, and protecting routes in a real Express application.
