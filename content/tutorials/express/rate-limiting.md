Welcome to **Chapter 21 — Rate Limiting**.

> **Rate Limiting protects your API from abuse, bots, and DDoS attacks by restricting how many requests a single user can make in a time window.**

Every production API needs rate limiting. Without it, anyone can crash your server.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a water tap.

Normal use:

```
Fill 1 glass → Fine
Fill 2 glasses → Fine
Fill 10 glasses → Fine
```

But what if someone opens the tap at full speed all day?

```
Tank runs dry → No water for others
```

Rate limiting puts a meter on the tap.

```
Max 100 glasses per hour per person.
After that → Stop.
```

---

# Real Life Example 🏧

Think of an ATM.

It allows you 3 incorrect PIN attempts.

After that:

```
Card blocked for 24 hours.
```

That's rate limiting.

Protects against brute-force attacks.

---

# What is Rate Limiting?

Rate limiting restricts the number of requests a client can make to your API within a defined time window.

Example:

```
100 requests per 15 minutes per IP address
```

After 100 requests:

```
HTTP 429 Too Many Requests
```

---

# Why Rate Limiting?

| Threat                 | How Rate Limiting Helps          |
| ---------------------- | -------------------------------- |
| Brute force login      | Limit /login to 5 req/min        |
| DDoS attack            | Limit all routes to 100 req/min  |
| Web scraping           | Limit /products to 30 req/min    |
| API abuse              | Fair usage for all users         |
| Server overload        | Protect backend capacity         |

---

# Install

```bash
npm install express-rate-limit
```

---

# Basic Setup

```javascript
const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 100,                    // max 100 requests per window
    message: "Too many requests. Try again later."
});

app.use(limiter);

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.listen(3000);
```

After 100 requests from the same IP in 15 minutes:

```json
{
  "message": "Too many requests. Try again later."
}
```

Status: `429`

---

# Rate Limit Options

```javascript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: "Too many requests",
        retryAfter: "15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false
});
```

| Option            | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| `windowMs`        | Time window in milliseconds                      |
| `max`             | Max requests per window per IP                   |
| `message`         | Response when limit is exceeded                  |
| `standardHeaders` | Add `RateLimit-*` headers to response            |
| `legacyHeaders`   | Add `X-RateLimit-*` headers (deprecated)         |

---

# Response Headers

When `standardHeaders: true`:

```
RateLimit-Limit: 100
RateLimit-Remaining: 87
RateLimit-Reset: 1722239400
```

Client knows:

* Total allowed: 100
* Remaining: 87
* Resets at: timestamp

---

# Specific Route Limiting

Different limits for different routes.

```javascript
// Global limit: 100 req/15 min
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

// Login limit: 5 attempts/15 min (brute force protection)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many login attempts. Try again in 15 minutes."
});

// API limit: 50 req/min
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 50
});

app.use(globalLimiter);

app.post("/login", loginLimiter, authController.login);

app.use("/api", apiLimiter);
```

---

# Complete Professional Setup

```javascript
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({ origin: "https://myapp.com" }));

// Logging
app.use(morgan("dev"));

// Body parsing
app.use(express.json());

// Global rate limit
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true
}));

// Strict rate limit for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: "Too many login attempts" }
});

app.post("/auth/login", authLimiter, loginHandler);
app.post("/auth/register", authLimiter, registerHandler);

// Regular API
app.use("/api", apiRouter);

app.listen(3000);
```

---

# Custom Key Generator

By default, rate limiting is per IP.

You can customize by user ID:

```javascript
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    }
});
```

Authenticated users tracked by userId.

Anonymous users tracked by IP.

---

# Skip Certain Requests

```javascript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    skip: (req) => {
        return req.ip === "127.0.0.1";
    }
});
```

Localhost (your own machine) is never rate limited.

---

# Using Redis Store (Production)

By default, rate limit data is in memory.

Problem: Restart server → counters reset.

Multiple server instances → each has its own counter.

Solution: Use Redis.

```bash
npm install rate-limit-redis
```

```javascript
const RedisStore = require("rate-limit-redis");
const { createClient } = require("redis");

const redisClient = createClient();
redisClient.connect();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args)
    })
});
```

Now all server instances share the same counters.

---

# Visual Diagram

```
Request 1 → IP: 192.168.1.1 → Counter: 1/100

Request 2 → IP: 192.168.1.1 → Counter: 2/100

...

Request 100 → Counter: 100/100

Request 101 → ❌ 429 Too Many Requests
```

---

# Company Example — Twitter API

Twitter limits:

```
Free tier:   500,000 tweets/month
Basic tier:  3,000,000 tweets/month
```

And per endpoint:

```
GET /tweets  → 10 requests per 15 min (free)
POST /tweets → 17 requests per 24 hours (free)
```

Without rate limiting → Twitter's servers would be overwhelmed.

---

# Company Example — Banking App

Login endpoint:

```
Max 5 attempts per 15 minutes per IP
```

After 5 failed logins:

```json
{
  "error": "Too many login attempts. Please try again in 15 minutes."
}
```

Prevents brute-force password attacks.

---

# Company Example — Payment API

```
POST /payments → Max 10 per minute per user
```

Prevents:

* Duplicate charges
* Automated fraud
* Server overload

---

# Interview Questions

## Q1. What is Rate Limiting?

**Best Answer**

> Rate limiting restricts the number of HTTP requests a client can make to a server within a given time window. It protects against brute-force attacks, DDoS, and API abuse. In Express, the `express-rate-limit` package implements this as middleware.

---

## Q2. What HTTP status code does rate limiting return?

`429 Too Many Requests`

---

## Q3. Why use Redis for rate limiting in production?

In-memory stores reset on restart and aren't shared across multiple server instances. Redis provides a centralized, persistent counter.

---

## Q4. How would you rate-limit only the login route?

```javascript
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5
});

app.post("/login", loginLimiter, handler);
```

---

## Q5. What is the difference between rate limiting and throttling?

| Rate Limiting             | Throttling                      |
| ------------------------- | ------------------------------- |
| Hard block after limit    | Slow down requests gradually    |
| 429 after limit exceeded  | Delay response                  |

---

# Professional Summary

```
Request arrives

↓

Rate limiter checks:
  IP counter < max?

Yes → Allow request → Increment counter

No  → 429 Too Many Requests
       Retry-After header set

↓

Window expires → Counter resets
```

---

# 🧠 Memory Trick

Think of rate limiting as a **cinema booking system**:

```
🎬 Cinema (API Server)

Hall capacity: 100 seats (max requests)

15 min window = one show duration

After 100 bookings → "Sold Out. Next show in 15 min."
```

---

# 🎓 Express.js Core Mastery

You have now completed the **full Express.js foundation**:

1. ✅ Introduction
2. ✅ Express Middleware
3. ✅ Route Parameters
4. ✅ Query Parameters
5. ✅ Body Parser
6. ✅ Error Middleware
7. ✅ app.use()
8. ✅ next()
9. ✅ Static Files
10. ✅ REST API
11. ✅ CRUD
12. ✅ Status Codes
13. ✅ CORS
14. ✅ JWT
15. ✅ Authentication
16. ✅ Authorization
17. ✅ Cookies
18. ✅ Sessions
19. ✅ Helmet
20. ✅ Morgan
21. ✅ Rate Limiting

These topics are exactly what companies test in MERN stack interviews.

You are now ready to build production-grade Express.js backends. 🚀
