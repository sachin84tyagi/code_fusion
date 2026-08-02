Welcome to **Chapter 20 — Morgan**.

> **Morgan is an HTTP request logger for Express. It tells you exactly what's happening in your server — every request, every response, every error.**

No professional application runs without logging.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a hotel receptionist.

Every guest who enters or leaves, she writes in a register:

```
📒 Register

10:00 AM → Guest Sachin → Room 201 → Checked In
11:30 AM → Guest Rahul  → Room 305 → Checked Out
12:00 PM → Unknown Person → Lobby → Rejected
```

If something goes wrong, the manager checks the register.

Morgan is that register for your Express server.

---

# What is Morgan?

Morgan is an HTTP request logger middleware for Node.js.

Every time a request hits your server, Morgan logs:

```
GET /users 200 15ms
POST /login 401 8ms
DELETE /products/5 404 3ms
```

Date, method, URL, status code, response time.

---

# Install

```bash
npm install morgan
```

---

# Basic Usage

```javascript
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.listen(3000);
```

Now every request logs to the terminal:

```
GET / 200 5.123 ms - 6
```

---

# Morgan Formats (Predefined)

Morgan comes with 5 built-in formats.

---

## dev

Colorized. Great for development.

```
GET /users 200 4.321 ms - 54
```

Green = success

Red = error

---

## combined

Apache standard format. Great for production logs.

```
::1 - - [29/Jul/2026:10:30:00 +0000] "GET /users HTTP/1.1" 200 54 "-" "PostmanRuntime/7.0"
```

IP address, date, method, URL, status, size, user-agent.

---

## common

Similar to combined but without referrer and user-agent.

```
::1 - - [29/Jul/2026:10:30:00 +0000] "GET /users HTTP/1.1" 200 54
```

---

## short

Shorter version.

```
::1 - GET /users HTTP/1.1 200 54 - 4.321 ms
```

---

## tiny

Minimal.

```
GET /users 200 54 - 4.321 ms
```

---

# Format Comparison

| Format     | Use Case                      |
| ---------- | ----------------------------- |
| `dev`      | Development (colorized)       |
| `combined` | Production logs               |
| `common`   | Standard Apache-style logs    |
| `short`    | Balanced detail               |
| `tiny`     | Minimal, fastest              |

---

# Custom Format

```javascript
app.use(morgan(":method :url :status :response-time ms"));
```

Output:

```
GET /users 200 3.21 ms
```

---

# Available Tokens

| Token              | Value                  |
| ------------------ | ---------------------- |
| `:method`          | HTTP method (GET, POST)|
| `:url`             | Request URL            |
| `:status`          | HTTP status code       |
| `:response-time`   | Time in ms             |
| `:date`            | Date and time          |
| `:res[header]`     | Response header value  |
| `:req[header]`     | Request header value   |
| `:remote-addr`     | Client IP address      |
| `:user-agent`      | Browser/client info    |

---

# Logging to a File

In production, you want logs saved to a file.

```javascript
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

// Create log stream
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
);

// Log to file (combined format)
app.use(morgan("combined", { stream: accessLogStream }));
```

All requests saved to `access.log`.

---

# Log Only Errors

```javascript
app.use(morgan("combined", {
    skip: (req, res) => res.statusCode < 400
}));
```

Only logs requests with status code 400 or higher.

Great for production error monitoring.

---

# Both Console and File

```javascript
// Console (development)
app.use(morgan("dev"));

// File (production)
app.use(morgan("combined", { stream: accessLogStream }));
```

---

# Professional Setup

```javascript
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: "https://myapp.com" }));

// Logging
if (process.env.NODE_ENV === "production") {
    const logStream = fs.createWriteStream(
        path.join(__dirname, "logs", "access.log"),
        { flags: "a" }
    );
    app.use(morgan("combined", { stream: logStream }));
} else {
    app.use(morgan("dev"));
}

// Body parsing
app.use(express.json());

app.listen(3000);
```

---

# Why Logging Matters

## Debugging

```
POST /login 401 2ms
```

Someone failed to login.

Check the logs. See which email. Identify the issue.

---

## Security Monitoring

```
GET /admin 403 1ms  ← Repeated attempts
GET /admin 403 1ms
GET /admin 403 1ms
```

Someone is trying to access the admin panel.

Alert. Block the IP.

---

## Performance

```
GET /report 200 4532ms  ← Too slow!
```

Something is taking 4 seconds.

Need to optimize.

---

# Company Example — Amazon

Every API request to Amazon's servers is logged.

```
[IP] [DATE] "GET /products/42" 200 15ms
```

Millions of log entries per day.

Stored, analyzed, monitored.

If a server goes down → check logs → find the cause.

---

# Company Example — Banking

```
combined log → log/access.log

Error log    → log/error.log
```

Logs are kept for audit compliance.

Regulators can review who accessed what and when.

---

# Interview Questions

## Q1. What is Morgan?

**Best Answer**

> Morgan is an HTTP request logger middleware for Express. It logs details about every request — method, URL, status code, response time — to the console or a file.

---

## Q2. Which Morgan format should you use in production?

`combined` — it provides the most detailed logs including IP address, date, user-agent, and referrer.

---

## Q3. How do you log only errors with Morgan?

```javascript
app.use(morgan("combined", {
    skip: (req, res) => res.statusCode < 400
}));
```

---

## Q4. How do you write Morgan logs to a file?

Use `fs.createWriteStream` and pass it as the `stream` option.

---

# Professional Summary

```
Development
  app.use(morgan("dev"))
  → Colorized console logs

Production
  app.use(morgan("combined", { stream: logFile }))
  → Full logs saved to file

Error only
  app.use(morgan("combined", {
    skip: (req, res) => res.statusCode < 400
  }))
```

---

# 🧠 Memory Trick

Think of Morgan as a **hotel security camera**:

```
📹 Camera (Morgan)

Records every visitor (request)

Time, date, who (IP), what (URL), outcome (status)

Review footage (logs) when something goes wrong
```

---

# 🚀 Next Chapter

We'll learn **Rate Limiting** — how to protect your API from abuse, bots, and DDoS attacks by limiting how many requests a user can make.
