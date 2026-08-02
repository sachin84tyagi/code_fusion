Welcome to **Chapter 12 — HTTP Status Codes**.

> **Status codes are how your API communicates success, failure, and everything in between. Using the wrong code is one of the most common beginner mistakes.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you send a letter.

The post office tells you what happened.

```
✅ Delivered          → 200 OK

📭 Address Not Found  → 404 Not Found

🔒 Restricted Area   → 403 Forbidden

💥 Post Office Fire  → 500 Server Error
```

HTTP status codes are exactly those notifications from the server.

---

# What Are Status Codes?

Every HTTP response has a 3-digit status code.

```
1xx → Informational

2xx → Success

3xx → Redirection

4xx → Client Error

5xx → Server Error
```

---

# 2xx — Success

---

## 200 OK

The most common.

Request succeeded.

```javascript
res.status(200).json({ users: [] });

// or simply
res.json({ users: [] }); // 200 is default
```

---

## 201 Created

Resource was successfully created.

```javascript
app.post("/users", (req, res) => {
    const user = createUser(req.body);
    res.status(201).json(user);
});
```

---

## 204 No Content

Success but nothing to return.

Used for DELETE.

```javascript
app.delete("/users/:id", (req, res) => {
    deleteUser(req.params.id);
    res.status(204).send();
});
```

---

# 3xx — Redirection

---

## 301 Moved Permanently

URL has changed forever.

```javascript
res.redirect(301, "/new-url");
```

---

## 302 Found (Temporary Redirect)

```javascript
res.redirect("/login");
```

---

# 4xx — Client Errors

These are the client's fault.

---

## 400 Bad Request

Invalid request data.

```javascript
if (!req.body.email) {
    return res.status(400).json({ error: "Email required" });
}
```

---

## 401 Unauthorized

Not authenticated. Must log in first.

```javascript
if (!token) {
    return res.status(401).json({ error: "Please login" });
}
```

---

## 403 Forbidden

Authenticated but not allowed.

```javascript
if (user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
}
```

---

## 404 Not Found

Resource doesn't exist.

```javascript
const user = findUser(id);
if (!user) {
    return res.status(404).json({ error: "User not found" });
}
```

---

## 409 Conflict

Resource already exists.

```javascript
const existing = findByEmail(email);
if (existing) {
    return res.status(409).json({ error: "Email already registered" });
}
```

---

## 422 Unprocessable Entity

Validation failed.

```javascript
res.status(422).json({ errors: validationErrors });
```

---

## 429 Too Many Requests

Rate limit exceeded.

```javascript
res.status(429).json({ error: "Too many requests. Slow down." });
```

---

# 5xx — Server Errors

These are the server's fault.

---

## 500 Internal Server Error

Something went wrong on the server.

```javascript
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});
```

---

## 502 Bad Gateway

Upstream server returned invalid response.

---

## 503 Service Unavailable

Server is temporarily down (maintenance, overload).

---

# Status Codes in Express

```javascript
res.status(200).json({ data: users });

res.status(201).json({ data: newUser });

res.status(400).json({ error: "Invalid input" });

res.status(401).json({ error: "Unauthorized" });

res.status(403).json({ error: "Forbidden" });

res.status(404).json({ error: "Not found" });

res.status(500).json({ error: "Server error" });
```

---

# Quick Reference Table

| Code | Name                  | When to Use                        |
| ---- | --------------------- | ---------------------------------- |
| 200  | OK                    | Successful GET, PUT, PATCH         |
| 201  | Created               | Successful POST                    |
| 204  | No Content            | Successful DELETE                  |
| 301  | Moved Permanently     | Permanent redirect                 |
| 400  | Bad Request           | Invalid input/body                 |
| 401  | Unauthorized          | Not logged in                      |
| 403  | Forbidden             | Logged in but no permission        |
| 404  | Not Found             | Resource doesn't exist             |
| 409  | Conflict              | Duplicate resource                 |
| 422  | Unprocessable Entity  | Validation failed                  |
| 429  | Too Many Requests     | Rate limit hit                     |
| 500  | Internal Server Error | Server bug                         |
| 503  | Service Unavailable   | Server down                        |

---

# Company Example — Login Flow

```
POST /login

No email/password       → 400 Bad Request
Wrong email             → 401 Unauthorized
Account suspended       → 403 Forbidden
Login success           → 200 OK + token
```

---

# Company Example — Admin Panel

```
GET /admin/users

Not logged in           → 401 Unauthorized
Logged in, not admin    → 403 Forbidden
Logged in as admin      → 200 OK + data
```

---

# 401 vs 403

This is the most confused pair.

| 401 Unauthorized                  | 403 Forbidden                     |
| --------------------------------- | --------------------------------- |
| Not logged in (no identity)       | Logged in but no permission       |
| "Who are you?"                    | "I know who you are, but NO"      |

---

# Interview Questions

## Q1. What is a status code?

**Best Answer**

> An HTTP status code is a 3-digit number returned by the server indicating the outcome of the request. 2xx means success, 4xx means client error, and 5xx means server error.

---

## Q2. Difference between 401 and 403?

401 means not authenticated (not logged in). 403 means authenticated but not authorized (no permission).

---

## Q3. What status code should POST return?

`201 Created` when a resource is successfully created.

---

## Q4. What status code for DELETE?

`204 No Content` (success, nothing to return) or `200 OK` with a confirmation message.

---

# Professional Summary

```
2xx Success
  200 OK
  201 Created
  204 No Content

4xx Client Error
  400 Bad Request
  401 Unauthorized
  403 Forbidden
  404 Not Found

5xx Server Error
  500 Internal Server Error
```

---

# 🧠 Memory Trick

```
2xx = ✅ Good
3xx = 🔄 Redirect
4xx = ❌ Your fault (client)
5xx = 💥 My fault (server)
```

---

# 🚀 Next Chapter

We'll learn **CORS** — Cross-Origin Resource Sharing — why your browser blocks API calls and how to fix it.
