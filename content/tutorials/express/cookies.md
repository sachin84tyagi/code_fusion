Welcome to **Chapter 17 — Cookies**.

> **Cookies are small pieces of data the browser stores and automatically sends with every request. They power sessions, auth, and personalization.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you visit a shop.

The shopkeeper gives you a **loyalty card**.

```
🎟️ Loyalty Card

Name: Sachin

Member Since: 2024
```

Every time you visit, you show the card.

The shopkeeper knows who you are instantly.

You don't re-register every time.

**Cookies** are that loyalty card for websites.

---

# What is a Cookie?

A cookie is a small key-value pair stored in the browser.

```
name=Sachin
token=eyJhbGci...
theme=dark
cartId=12345
```

The browser sends cookies automatically with every request to the same domain.

---

# How Cookies Work

```
1. User visits website

↓

2. Server sets cookie in response
   Set-Cookie: token=abc123

↓

3. Browser stores cookie

↓

4. Every subsequent request
   → Browser sends cookie automatically
   Cookie: token=abc123

↓

5. Server reads cookie
```

---

# Setting Cookies in Express

```bash
npm install cookie-parser
```

```javascript
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

app.get("/set-cookie", (req, res) => {
    res.cookie("username", "Sachin");
    res.send("Cookie set!");
});

app.get("/get-cookie", (req, res) => {
    const username = req.cookies.username;
    res.send(`Hello ${username}`);
});

app.listen(3000);
```

---

# Cookie Options

```javascript
res.cookie("token", "abc123", {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "strict"
});
```

| Option     | Purpose                                        |
| ---------- | ---------------------------------------------- |
| `httpOnly` | JS cannot access cookie (XSS protection)       |
| `secure`   | Only sent over HTTPS                           |
| `maxAge`   | Expiry time in milliseconds                    |
| `expires`  | Specific expiry date                           |
| `sameSite` | CSRF protection (`strict`, `lax`, `none`)      |
| `signed`   | Tamper-proof cookie (requires secret)          |

---

# httpOnly — Most Important

```javascript
res.cookie("token", jwt, { httpOnly: true });
```

`httpOnly: true` means:

> JavaScript on the page **cannot** read this cookie.

Protection against XSS attacks.

---

# Signed Cookies

Prevents client from tampering.

```javascript
app.use(cookieParser("mySigningSecret"));

// Set
res.cookie("userId", "42", { signed: true });

// Read
const userId = req.signedCookies.userId;
```

---

# Delete Cookie

```javascript
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});
```

---

# Cookie-Based Auth Flow

```javascript
// Login
app.post("/login", (req, res) => {
    const token = jwt.sign({ userId: 1 }, SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ message: "Logged in" });
});

// Protected route
app.get("/profile", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token" });

    try {
        const user = jwt.verify(token, SECRET);
        res.json({ user });
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
});

// Logout
app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});
```

---

# Cookies vs localStorage

| Cookies                           | localStorage                       |
| --------------------------------- | ---------------------------------- |
| Sent automatically with requests  | Must be sent manually              |
| Can be httpOnly (JS can't read)   | Always accessible by JS            |
| More secure for auth tokens       | Vulnerable to XSS                  |
| Server can set and read           | Client-side only                   |

For auth tokens in production → **httpOnly cookies** are more secure.

---

# Company Example — Amazon

When you add items to your cart without logging in:

```
Cart items stored in cookie

↓

When you come back tomorrow

↓

Browser sends cookie

↓

Server restores your cart
```

---

# Company Example — Google

```
You log into Google

↓

Server sets httpOnly cookie with session ID

↓

Browser sends cookie with every request

↓

Google knows it's you (Gmail, Drive, YouTube)
```

---

# Interview Questions

## Q1. What is a cookie?

**Best Answer**

> A cookie is a small piece of data stored by the browser and automatically sent with every request to the same domain. They are used for sessions, authentication, and personalization.

---

## Q2. What does `httpOnly: true` do?

Prevents JavaScript from accessing the cookie, protecting against XSS attacks.

---

## Q3. Difference between cookies and localStorage?

Cookies are sent automatically with requests and can be `httpOnly` (inaccessible to JS). localStorage must be manually included in requests and is always readable by JS.

---

## Q4. How do you delete a cookie in Express?

```javascript
res.clearCookie("cookieName");
```

---

# Professional Summary

```
Login
  → Create JWT
  → res.cookie("token", jwt, { httpOnly: true })

Request
  → Browser sends cookie automatically
  → req.cookies.token

Logout
  → res.clearCookie("token")
```

---

# 🧠 Memory Trick

```
🍪 Cookie = Loyalty Card

Browser stores it

Sends it with every visit

Server reads it

Knows who you are
```

`httpOnly` = only the server can see this card.

---

# 🚀 Next Chapter

We'll learn **Sessions** — server-side user state management and how it compares to JWT-based stateless authentication.
