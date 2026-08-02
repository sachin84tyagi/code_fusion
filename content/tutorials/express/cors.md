Welcome to **Chapter 13 — CORS**.

> **CORS is why your React app can't talk to your Express server by default. Understanding it will save you hours of debugging.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine two schools.

School A students cannot enter School B.

School B has a rule:

> "Only our own students can enter."

CORS is that rule for websites.

```
React App (School A)
        ↓
        Wants to talk to
        ↓
Express Server (School B)
        ↓
"Access Denied - Different Origin!"
```

Unless the server says:

> "School A students are allowed."

---

# What is CORS?

**CORS = Cross-Origin Resource Sharing**

It is a browser security feature.

When a webpage at `http://localhost:3000` tries to fetch from `http://localhost:5000`:

The browser says:

```
These are different origins!
Blocked for security.
```

---

# What is an Origin?

An origin is:

```
Protocol + Hostname + Port

http://localhost:3000

https://myapp.com

https://api.myapp.com
```

Same origin = same protocol, host, and port.

Different origin = CORS kicks in.

---

# The Error You've Seen

```
Access to fetch at 'http://localhost:5000/api/users'
from origin 'http://localhost:3000'
has been blocked by CORS policy.
```

Every developer sees this.

The fix is simple.

---

# The Solution

Install the `cors` package.

```bash
npm install cors
```

---

# Allow All Origins (Development)

```javascript
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/users", (req, res) => {
    res.json([{ name: "Sachin" }]);
});

app.listen(5000);
```

Now any frontend can access this server.

---

# Allow Specific Origins (Production)

```javascript
app.use(cors({
    origin: "https://myapp.com"
}));
```

Only `myapp.com` can access.

---

# Allow Multiple Origins

```javascript
const allowedOrigins = [
    "http://localhost:3000",
    "https://myapp.com",
    "https://www.myapp.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));
```

---

# CORS Options

```javascript
app.use(cors({
    origin: "https://myapp.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
```

| Option           | Purpose                                |
| ---------------- | -------------------------------------- |
| `origin`         | Which domains can access               |
| `methods`        | Which HTTP methods are allowed         |
| `allowedHeaders` | Which headers clients can send         |
| `credentials`    | Allow cookies and auth headers         |

---

# Preflight Request

For certain requests (DELETE, PUT, or custom headers), the browser sends an `OPTIONS` request first.

This is called a **preflight**.

The server must respond to it.

`cors()` handles this automatically.

---

# CORS for Specific Routes

```javascript
const cors = require("cors");

const publicCors = cors({ origin: "*" });
const privateCors = cors({ origin: "https://myapp.com" });

app.get("/public", publicCors, handler);
app.get("/private", privateCors, handler);
```

---

# Without cors Package (Manual)

```javascript
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

    if (req.method === "OPTIONS") {
        return res.status(200).send();
    }

    next();
});
```

The `cors` package does this automatically.

---

# Company Example — Full Stack MERN

```
Frontend: React on localhost:3000

Backend:  Express on localhost:5000
```

Without CORS:

```
React → fetch → Express → ❌ BLOCKED
```

With CORS:

```javascript
app.use(cors({ origin: "http://localhost:3000" }));
```

```
React → fetch → Express → ✅ Works
```

---

# Company Example — Production

```
Frontend: https://myapp.com

Backend:  https://api.myapp.com
```

```javascript
app.use(cors({
    origin: [
        "https://myapp.com",
        "https://www.myapp.com"
    ],
    credentials: true
}));
```

---

# Interview Questions

## Q1. What is CORS?

**Best Answer**

> CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web pages from making requests to a different origin than the one that served the page. On the server, you must explicitly allow cross-origin requests using CORS headers.

---

## Q2. Why does the CORS error appear?

Because the browser blocks requests from a different origin (protocol/domain/port) for security reasons.

---

## Q3. How do you fix CORS in Express?

```javascript
npm install cors

app.use(cors());
```

---

## Q4. What is a preflight request?

An HTTP `OPTIONS` request the browser sends before certain cross-origin requests to check if the server allows them.

---

## Q5. Should you use `origin: "*"` in production?

No. In production, always specify the exact allowed origins.

---

# Professional Summary

```
React App (port 3000)

↓

fetch("http://localhost:5000/api")

↓

Browser checks: different origin?

↓

Yes → CORS policy check

↓

Server has CORS header?

Yes → ✅ Allow
No  → ❌ Block
```

---

# 🧠 Memory Trick

Think of CORS as a **guest list at a club**:

```
🎶 Club (Express Server)

Bouncer (Browser) checks origin

myapp.com on list? → ✅ Enter
unknown.com on list? → ❌ Blocked
```

`app.use(cors())` adds everyone to the list.

`origin: "https://myapp.com"` adds only specific guests.

---

# 🚀 Next Chapter

We'll learn **JWT (JSON Web Tokens)** — the most popular way to implement authentication in REST APIs.
