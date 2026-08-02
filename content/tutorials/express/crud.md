Welcome to **Chapter 11 — CRUD**.

> **CRUD is the foundation of every database-driven application. Create, Read, Update, Delete — everything revolves around these four operations.**

Every project — from a simple todo app to Amazon — is built on CRUD.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a school register.

The teacher can:

```
📝 Add a new student         → CREATE

📖 Read the student list      → READ

✏️ Edit a student's marks     → UPDATE

🗑️ Remove a student          → DELETE
```

That's CRUD.

Every database operation is one of these four.

---

# What is CRUD?

| Letter | Operation | HTTP Method | SQL Equivalent |
| ------ | --------- | ----------- | -------------- |
| C      | Create    | POST        | INSERT         |
| R      | Read      | GET         | SELECT         |
| U      | Update    | PUT/PATCH   | UPDATE         |
| D      | Delete    | DELETE      | DELETE         |

---

# Visual Diagram

```
C → POST   /users         → Create user
R → GET    /users         → Read all users
R → GET    /users/:id     → Read one user
U → PUT    /users/:id     → Update user
D → DELETE /users/:id     → Delete user
```

---

# Full CRUD API — Users

```javascript
const express = require("express");
const app = express();

app.use(express.json());

let users = [
    { id: 1, name: "Sachin", email: "sachin@gmail.com" },
    { id: 2, name: "Rahul", email: "rahul@gmail.com" }
];

let nextId = 3;
```

---

## CREATE — POST /users

```javascript
app.post("/users", (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email required" });
    }

    const newUser = { id: nextId++, name, email };
    users.push(newUser);

    res.status(201).json({
        message: "User created",
        user: newUser
    });
});
```

---

## READ ALL — GET /users

```javascript
app.get("/users", (req, res) => {
    res.json(users);
});
```

---

## READ ONE — GET /users/:id

```javascript
app.get("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
});
```

---

## UPDATE — PUT /users/:id

```javascript
app.put("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    users[index] = { id, ...req.body };

    res.json({
        message: "User updated",
        user: users[index]
    });
});
```

---

## PARTIAL UPDATE — PATCH /users/:id

```javascript
app.patch("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    Object.assign(user, req.body);

    res.json({ message: "User updated", user });
});
```

---

## DELETE — DELETE /users/:id

```javascript
app.delete("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = users.length;

    users = users.filter(u => u.id !== id);

    if (users.length === initialLength) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted" });
});
```

---

# Testing the API

Using curl:

```bash
# Create
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Amit","email":"amit@gmail.com"}'

# Read All
curl http://localhost:3000/users

# Read One
curl http://localhost:3000/users/1

# Update
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Sachin Tyagi","email":"sachin@gmail.com"}'

# Delete
curl -X DELETE http://localhost:3000/users/1
```

---

# PUT vs PATCH

```
User: { id: 1, name: "Sachin", email: "sachin@gmail.com", age: 25 }
```

PUT request body:

```json
{ "name": "Sachin Tyagi" }
```

Result:

```json
{ "id": 1, "name": "Sachin Tyagi" }
```

Email and age are **lost**.

---

PATCH request body:

```json
{ "name": "Sachin Tyagi" }
```

Result:

```json
{ "id": 1, "name": "Sachin Tyagi", "email": "sachin@gmail.com", "age": 25 }
```

Only name updated. Others preserved.

---

# Company Example — Zomato

```
POST /restaurants          → Add a restaurant
GET  /restaurants          → List restaurants
GET  /restaurants/:id      → View restaurant
PUT  /restaurants/:id      → Update details
DELETE /restaurants/:id    → Remove restaurant

POST /restaurants/:id/menu → Add menu item
GET  /restaurants/:id/menu → View menu
```

---

# Validation Pattern

```javascript
app.post("/users", (req, res) => {
    const { name, email } = req.body;

    const errors = [];

    if (!name) errors.push("Name is required");
    if (!email) errors.push("Email is required");
    if (email && !email.includes("@")) errors.push("Invalid email");

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // proceed...
});
```

---

# Interview Questions

## Q1. What is CRUD?

**Best Answer**

> CRUD stands for Create, Read, Update, and Delete — the four fundamental operations performed on data in any database-driven application.

---

## Q2. Which HTTP methods map to CRUD?

| CRUD   | HTTP Method |
| ------ | ----------- |
| Create | POST        |
| Read   | GET         |
| Update | PUT / PATCH |
| Delete | DELETE      |

---

## Q3. Difference between PUT and PATCH?

PUT replaces the entire resource. PATCH updates only the specified fields.

---

## Q4. What status code should POST return on success?

`201 Created`

---

# Professional Summary

```
C → POST /resource    → 201 Created
R → GET  /resource    → 200 OK
R → GET  /resource/:id → 200 OK
U → PUT  /resource/:id → 200 OK
D → DELETE /resource/:id → 200 OK or 204 No Content
```

---

# 🧠 Memory Trick

```
📱 Contacts App = CRUD

➕ Add Contact     → CREATE
👁️ View Contacts   → READ
✏️ Edit Contact    → UPDATE
🗑️ Delete Contact → DELETE
```

Every app you use has CRUD underneath.

---

# 🚀 Next Chapter

We'll master **HTTP Status Codes** — the language your API uses to communicate success and failure to clients.
