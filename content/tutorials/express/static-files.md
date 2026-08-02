Welcome to **Chapter 9 — Static Files**.

> **Static files are HTML, CSS, images, and JavaScript files served directly to the browser without any processing.**

Every web application serves static files. Express makes it one line of code.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a library.

Some books are on open shelves.

Anyone can pick them up directly.

```
📚 Open Shelf

index.html

style.css

logo.png

script.js
```

No librarian needed.

No processing needed.

Just take the book.

That's what static files are.

---

# What Are Static Files?

Files that don't change per request.

```
HTML files

CSS files

JavaScript files

Images (PNG, JPG, SVG)

Fonts

PDFs

Videos
```

Same file for every user.

---

# Without express.static()

You'd have to write:

```javascript
app.get("/index.html", (req, res) => {
    res.sendFile("public/index.html");
});

app.get("/style.css", (req, res) => {
    res.sendFile("public/style.css");
});

app.get("/logo.png", (req, res) => {
    res.sendFile("public/logo.png");
});
```

Tedious.

---

# With express.static()

One line handles everything.

```javascript
app.use(express.static("public"));
```

Now Express automatically serves everything inside the `public` folder.

---

# Setup

Create folder structure:

```
project/
│
├── public/
│     ├── index.html
│     ├── style.css
│     ├── script.js
│     └── images/
│           logo.png
│
└── server.js
```

server.js:

```javascript
const express = require("express");
const app = express();

app.use(express.static("public"));

app.listen(3000, () => {
    console.log("Server running");
});
```

Now:

```
localhost:3000/index.html   → serves public/index.html
localhost:3000/style.css    → serves public/style.css
localhost:3000/images/logo.png → serves public/images/logo.png
```

---

# Default Index File

If you visit `/`, Express automatically serves `index.html` if it exists.

```
localhost:3000/  →  public/index.html
```

---

# With Path Module (Best Practice)

```javascript
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
```

Always use `path.join(__dirname, ...)` for cross-platform compatibility.

---

# Virtual Path Prefix

Serve files under a virtual URL prefix.

```javascript
app.use("/static", express.static("public"));
```

Now:

```
localhost:3000/static/style.css  →  public/style.css
localhost:3000/static/logo.png   →  public/logo.png
```

Useful to distinguish static from API routes.

---

# Multiple Static Folders

```javascript
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.static("assets"));
```

Express searches each folder in order.

First match wins.

---

# Serving a React Build

The most common use case in MERN apps.

```javascript
const path = require("path");

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
});
```

This serves the React frontend and handles client-side routing.

---

# Folder Structure (Full Stack MERN)

```
project/
│
├── server.js
│
├── client/
│     └── build/
│           index.html
│           static/
│
└── routes/
      api.js
```

---

# File Caching

Express adds cache headers automatically.

You can set max-age:

```javascript
app.use(express.static("public", {
    maxAge: "1d"
}));
```

Browser caches files for 1 day.

Reduces server load significantly.

---

# Company Example — Flipkart

```
flipkart.com/

↓

Express serves static/index.html

↓

Browser loads

↓

React app starts

↓

API calls to /api/...
```

---

# Company Example — Streaming Site

```
/videos/trailer.mp4     → serves from uploads/
/images/thumbnail.jpg   → serves from public/
/docs/terms.pdf         → serves from assets/
```

---

# Interview Questions

## Q1. What does `express.static()` do?

**Best Answer**

> `express.static()` is built-in Express middleware that serves static files (HTML, CSS, images, JS) from a specified directory without any custom route handlers.

---

## Q2. Why use `path.join(__dirname, "public")`?

To construct absolute file paths that work consistently on both Windows and Linux/macOS.

---

## Q3. What file is served at the root URL `/`?

`index.html` inside the static folder is automatically served.

---

## Q4. How do you serve a React build with Express?

```javascript
app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
});
```

---

# Professional Summary

```
public/
  index.html
  style.css
  logo.png

↓

app.use(express.static("public"))

↓

localhost:3000/index.html → served
localhost:3000/style.css  → served
localhost:3000/logo.png   → served
```

---

# 🧠 Memory Trick

Think of `express.static()` as a **self-service buffet**:

```
🍽️ Buffet (express.static("public"))

Guests (browsers) serve themselves

No waiter (route handler) needed

Just pick what you want (index.html, style.css)
```

---

# 🚀 Next Chapter

We'll build a complete **REST API** — the most important skill for any backend developer.
