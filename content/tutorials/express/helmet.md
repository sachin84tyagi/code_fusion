Welcome to **Chapter 19 — Helmet**.

> **Helmet protects your Express app by setting critical HTTP security headers. One line of code. Huge security improvement.**

Every production Express application should use Helmet.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you build a house.

The house has windows, doors, and a front gate.

But you forgot to:

```
❌ Put locks on windows

❌ Add a security camera

❌ Install a burglar alarm
```

Hackers can easily break in.

Helmet puts all these security measures in place for your Express app.

---

# What Attacks Does Helmet Prevent?

| Attack            | What It Does                                |
| ----------------- | ------------------------------------------- |
| XSS               | Injects malicious scripts                   |
| Clickjacking      | Embeds your site in iframe to steal clicks  |
| MIME Sniffing     | Browser guesses file types incorrectly      |
| Sniffing headers  | Reveals what tech stack you use             |

---

# Install

```bash
npm install helmet
```

---

# Basic Usage

```javascript
const express = require("express");
const helmet = require("helmet");

const app = express();

app.use(helmet());

app.get("/", (req, res) => {
    res.send("Secure server!");
});

app.listen(3000);
```

That's it. One line.

Helmet automatically sets 15+ security HTTP headers.

---

# What Headers Does Helmet Set?

---

## X-Content-Type-Options

```
X-Content-Type-Options: nosniff
```

Prevents browsers from guessing content types.

Stops MIME sniffing attacks.

---

## X-Frame-Options

```
X-Frame-Options: SAMEORIGIN
```

Prevents your site from being embedded in iframes on other sites.

Stops clickjacking.

---

## X-XSS-Protection

```
X-XSS-Protection: 0
```

Disables broken XSS filter in older browsers.

---

## Strict-Transport-Security (HSTS)

```
Strict-Transport-Security: max-age=15552000; includeSubDomains
```

Forces HTTPS for future connections.

---

## Content-Security-Policy (CSP)

Controls which resources the browser can load.

---

## Referrer-Policy

```
Referrer-Policy: no-referrer
```

Controls what URL info is shared when clicking links.

---

## X-Powered-By Removed

Without Helmet:

```
X-Powered-By: Express
```

With Helmet: This header is removed.

Hackers can't see what framework you're using.

---

# Before Helmet (Dangerous Headers)

```
HTTP/1.1 200 OK

X-Powered-By: Express
```

This tells everyone you're running Express.

Hackers look for known vulnerabilities in that version.

---

# After Helmet (Safe)

```
HTTP/1.1 200 OK

Content-Security-Policy: default-src 'self';...
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=15552000
Referrer-Policy: no-referrer
```

Professional. Secure.

---

# Custom Configuration

You can configure individual protections.

```javascript
app.use(helmet({
    contentSecurityPolicy: false,
    frameguard: {
        action: "deny"
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));
```

---

# Content Security Policy Example

```javascript
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:"]
    }
}));
```

Only allows scripts from your domain and jsdelivr.net.

Blocks all others.

---

# Professional Setup

```javascript
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Security — must be first
app.use(helmet());

// CORS
app.use(cors({ origin: "https://myapp.com" }));

// Logging
app.use(morgan("combined"));

// Body parsing
app.use(express.json());

// Routes
app.use("/api", apiRouter);

app.listen(3000);
```

Always place Helmet first.

---

# Company Example — Banking

A bank's API without security headers:

```
X-Powered-By: Express 4.18.2
```

Hackers immediately know the framework and its vulnerabilities.

With Helmet:

```
X-Powered-By: (removed)
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
```

Much harder to attack.

---

# Company Example — SaaS Platform

Every request to the platform has:

```
Strict-Transport-Security → force HTTPS
X-Frame-Options: SAMEORIGIN → no iframe embedding
X-Content-Type-Options: nosniff → no MIME sniffing
Referrer-Policy: same-origin → no referrer leak
```

All set automatically by Helmet.

---

# Interview Questions

## Q1. What is Helmet?

**Best Answer**

> Helmet is an Express middleware that automatically sets several HTTP security headers to protect against common web vulnerabilities like XSS, clickjacking, and MIME sniffing.

---

## Q2. What attack does `X-Frame-Options` prevent?

Clickjacking — embedding your site in an iframe on an attacker's website to steal clicks.

---

## Q3. What is HSTS?

HTTP Strict Transport Security — it forces browsers to use HTTPS for all future connections.

---

## Q4. What happens to the `X-Powered-By` header with Helmet?

It is removed, hiding the framework from attackers.

---

## Q5. Is Helmet enough for security?

No. Helmet is one layer. You also need: input validation, rate limiting, auth, HTTPS, and CORS.

---

# Professional Summary

```
npm install helmet

↓

app.use(helmet())

↓

15+ security headers set automatically

↓

Hide framework info

↓

Prevent XSS, clickjacking, MIME sniffing

↓

Secure server
```

---

# 🧠 Memory Trick

Think of Helmet like a **motorbike helmet**:

```
🪖 Helmet protects you from attacks:

XSS         → Face visor (blocks flying debris)
Clickjacking → Hard shell (absorbs impact)
MIME sniff  → Chin guard (protects weak spot)
HSTS        → Neck guard (forces HTTPS)
```

One item. Many protections.

---

# 🚀 Next Chapter

We'll learn **Morgan** — the HTTP request logger that helps you monitor and debug your Express application.
