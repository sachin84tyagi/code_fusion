Welcome to **Chapter 10 — REST API**.

> **REST API is the language that frontend and backend speak to each other. Master this and you become a full-stack developer.**

Every app you use — Amazon, Instagram, Zomato — has a REST API behind it.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a restaurant.

You (the customer) are the **client**.

The kitchen is the **server**.

The waiter is the **API**.

```
You → Waiter → Kitchen
You ← Waiter ← Kitchen
```

You don't go into the kitchen.

You give your order to the waiter.

The waiter brings your food back.

REST API is that waiter between your frontend and backend.

---

# What is REST?

REST = **Representational State Transfer**

A set of rules for building web APIs.

6 principles:

1. **Client-Server** — frontend and backend are separate
2. **Stateless** — server doesn't remember previous requests
3. **Uniform Interface** — consistent URL and method conventions
4. **Cacheable** — responses can be cached
5. **Layered System** — can have multiple layers (CDN, proxy)
6. **Code on Demand** — optional (not commonly used)

---

# HTTP Methods = Actions

```
GET    → Read (fetch data)

POST   → Create (add new data)

PUT    → Update (replace entire resource)

PATCH  → Update (partial update)

DELETE → Delete
```

---

# Resources and URLs

A resource is any piece of data your API manages.

```
/users           → Collection of all users

/users/5         → One specific user

/products        → All products

/products/42     → One product

/orders/101/items → All items in order 101
```

---

# Complete REST API — Products

```javascript
const express = require("express");
const app = express();

app.use(express.json());

let products = [
    { id: 1, name: "Laptop", price: 50000 },
    { id: 2, name: "Phone", price: 30000 }
];

// GET all products
app.get("/products", (req, res) => {
    res.json(products);
});

// GET one product
app.get("/products/:id", (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
});

// POST create product
app.post("/products", (req, res) => {
    const { name, price } = req.body;
    const newProduct = { id: products.length + 1, name, price };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PUT update product
app.put("/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    products[index] = { id, ...req.body };
    res.json(products[index]);
});

// DELETE product
app.delete("/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    products = products.filter(p => p.id !== id);
    res.json({ message: "Deleted" });
});

app.listen(3000);
```

---

# Standard Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Product created",
  "error": null
}
```

Professional APIs always have consistent structure.

---

# HTTP Status Codes Quick Reference

| Status | Meaning               |
| ------ | --------------------- |
| 200    | OK                    |
| 201    | Created               |
| 204    | No Content (delete)   |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 403    | Forbidden             |
| 404    | Not Found             |
| 500    | Internal Server Error |

---

# REST Conventions

| Action         | Method | URL            |
| -------------- | ------ | -------------- |
| Get all        | GET    | /products      |
| Get one        | GET    | /products/:id  |
| Create         | POST   | /products      |
| Update all     | PUT    | /products/:id  |
| Update partial | PATCH  | /products/:id  |
| Delete         | DELETE | /products/:id  |

---

# Nested Resources

```
/users/:userId/orders

↓

All orders of a specific user
```

```javascript
app.get("/users/:userId/orders", (req, res) => {
    const orders = getOrdersByUser(req.params.userId);
    res.json(orders);
});
```

---

# Company Example — Amazon REST API

```
GET  /products              → List all products
GET  /products/42           → Get one product
POST /cart                  → Add to cart
GET  /cart                  → View cart
POST /orders                → Place order
GET  /orders/1001           → Track order
DELETE /orders/1001         → Cancel order
```

---

# Company Example — Instagram

```
GET  /posts                 → All posts (feed)
POST /posts                 → Create post
GET  /posts/:id             → Single post
DELETE /posts/:id           → Delete post
POST /posts/:id/likes       → Like a post
GET  /users/:id/followers   → Followers list
```

---

# Interview Questions

## Q1. What is REST?

**Best Answer**

> REST (Representational State Transfer) is an architectural style for APIs that uses HTTP methods to perform CRUD operations on resources identified by URLs.

---

## Q2. What is the difference between PUT and PATCH?

| PUT                    | PATCH                  |
| ---------------------- | ---------------------- |
| Replaces entire resource | Updates specific fields only |

---

## Q3. What HTTP method is used to create a resource?

`POST` — and it should return status `201 Created`.

---

## Q4. What makes an API "RESTful"?

* Uses HTTP methods correctly
* Stateless
* Resources identified by URLs
* Consistent response format
* Appropriate status codes

---

# Professional Summary

```
Client

↓

HTTP Request (method + URL + body)

↓

Express Router

↓

Controller

↓

Model / Database

↓

JSON Response

↓

Client
```

---

# 🧠 Memory Trick

```
REST API = Waiter in a restaurant

GET    → "Show me the menu"
POST   → "I'd like to order"
PUT    → "Change my entire order"
PATCH  → "Just add more sauce"
DELETE → "Cancel my order"
```

---

# 🚀 Next Chapter

We'll build a full **CRUD** application — Create, Read, Update, Delete — the core of every backend application.
