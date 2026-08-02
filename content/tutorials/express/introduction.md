Welcome to **Express.js**.

> **Express is the #1 most used Node.js framework in the world.**

Every MERN stack application, REST API, and production backend uses Express.js.

---

# Learning Roadmap

We'll learn Express in levels.

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions
* 🚀 Level 6 – Professional Developer

---

# 👶 Level 1 — Child Explanation

Imagine you open a hotel.

Guests arrive.

```
Guest 1 → Wants a room
Guest 2 → Wants food
Guest 3 → Wants a taxi
```

One receptionist handles all requests.

She knows:

```
/room     → Go to Room Desk
/food     → Go to Restaurant
/taxi     → Go to Taxi Desk
```

That receptionist is **Express.js**.

---

# Real Life Example 🚦

Imagine a traffic signal.

Every car follows the signal.

```
Red    → Stop
Green  → Go
Yellow → Slow Down
```

Express is the traffic signal for HTTP requests.

Every request follows the rules Express defines.

---

# What is Express.js?

Express is a **minimal and fast web framework for Node.js**.

It helps you:

* Create HTTP servers
* Define routes
* Handle requests and responses
* Use middleware
* Build REST APIs

---

# Why Do We Need Express?

Without Express, using plain Node.js:

```javascript
const http = require("http");

const server = http.createServer((req, res) => {

    if (req.url === "/home") {
        res.end("Home Page");
    }

    if (req.url === "/about") {
        res.end("About Page");
    }

});

server.listen(3000);
```

This gets very messy.

With Express:

```javascript
const express = require("express");
const app = express();

app.get("/home", (req, res) => {
    res.send("Home Page");
});

app.get("/about", (req, res) => {
    res.send("About Page");
});

app.listen(3000);
```

Clean.

Simple.

Professional.

---

# Installing Express

```bash
npm init -y

npm install express
```

Done.

---

# Your First Express Server

```javascript
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
```

Visit `http://localhost:3000`

Output in browser:

```
Hello World!
```

---

# Step-by-Step

```
const express = require("express")
```

Import Express.

---

```
const app = express()
```

Create the application.

---

```
app.get("/", callback)
```

Define a route.

---

```
app.listen(3000)
```

Start the server.

---

# Visual Diagram

```
Browser

↓

HTTP Request

↓

Express Server

↓

Route Matching

↓

Handler Function

↓

Response

↓

Browser
```

---

# HTTP Methods

Express supports all HTTP methods.

```javascript
app.get("/users", handler);

app.post("/users", handler);

app.put("/users/:id", handler);

app.delete("/users/:id", handler);
```

Each maps to a different action.

---

# req and res

Every route handler receives two objects.

```javascript
app.get("/", (req, res) => {

    console.log(req.url);

    res.send("Response");

});
```

| Object | Purpose                |
| ------ | ---------------------- |
| `req`  | Incoming request data  |
| `res`  | Outgoing response data |

---

# Company Example — Amazon

Amazon's backend has thousands of routes.

```
GET  /products       → List Products

POST /cart           → Add to Cart

PUT  /cart/:id       → Update Item

DELETE /cart/:id     → Remove Item

POST /orders         → Place Order
```

Express handles all of them.

---

# Professional Project Structure

```
backend/

│

├── index.js

├── routes/

│     users.js

│     products.js

│     orders.js

│

├── controllers/

│     userController.js

│

├── middleware/

│     auth.js

│

└── models/

      User.js
```

---

# Interview Questions

## Q1. What is Express.js?

**Best Answer**

> Express is a minimal, fast, and unopinionated web framework for Node.js used to build HTTP servers and REST APIs.

---

## Q2. Why use Express over plain Node.js HTTP?

Express provides routing, middleware support, and cleaner syntax, making it significantly easier to build scalable APIs compared to Node's raw `http` module.

---

## Q3. What is `app.listen()`?

It starts the Express server and binds it to a port to accept incoming connections.

---

## Q4. What is `req` and `res`?

* `req` — represents the incoming HTTP request (URL, headers, body, params).
* `res` — represents the outgoing HTTP response (send, json, status).

---

# Professional Summary

```
npm install express

↓

const app = express()

↓

Define Routes

↓

app.listen(PORT)

↓

Server Ready

↓

Handle Requests

↓

Send Responses
```

---

# 🧠 Memory Trick

Think of Express like a **hotel front desk**:

```
🏨 Hotel Front Desk (Express)

Guest Arrives    → req (request)

Receptionist     → Route Handler

Room Assignment  → Response Logic

Room Key Given   → res.send()
```

---

# 🚀 Next Chapter

We'll dive into **Express Middleware** — the most powerful concept in Express that every developer must master.