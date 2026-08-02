Welcome to **Chapter 4 — Query Parameters**.

> **Query parameters are how you search, filter, sort, and paginate data in REST APIs.**

Every time you search on Amazon or Google, query parameters are working.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you're in a library.

You ask the librarian:

> "I want books about science, for age 10, sorted by newest."

You don't go to a specific bookshelf.

Instead you give **filters**.

Query parameters are exactly those filters for APIs.

---

# Real Life Example 🛒

Imagine Amazon.

You search:

```
amazon.com/products?category=laptop&brand=dell&sort=price&page=2
```

```
category=laptop   → Show only laptops
brand=dell        → Only Dell brand
sort=price        → Cheapest first
page=2            → Second page of results
```

All of these are **query parameters**.

---

# What is a Query Parameter?

Query parameters come after `?` in the URL.

Format:

```
/path?key1=value1&key2=value2
```

Examples:

```
/products?category=phone

/users?role=admin&active=true

/posts?sort=latest&limit=10&page=3
```

---

# Accessing in Express

```javascript
app.get("/products", (req, res) => {
    console.log(req.query);
});
```

Request: `GET /products?category=phone&sort=price`

`req.query` is:

```javascript
{
  category: "phone",
  sort: "price"
}
```

---

# First Example

```javascript
const express = require("express");
const app = express();

app.get("/search", (req, res) => {
    const { q, sort } = req.query;
    res.json({
        query: q,
        sortBy: sort
    });
});

app.listen(3000);
```

Request: `GET /search?q=laptop&sort=price`

Response:

```json
{
  "query": "laptop",
  "sortBy": "price"
}
```

---

# With Default Values

```javascript
app.get("/products", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    res.json({ page, limit });
});
```

`/products` → `{ page: 1, limit: 10 }`

`/products?page=3&limit=20` → `{ page: 3, limit: 20 }`

---

# Filtering Example

```javascript
const products = [
    { id: 1, name: "Laptop", category: "electronics" },
    { id: 2, name: "Shirt", category: "clothing" },
    { id: 3, name: "Phone", category: "electronics" }
];

app.get("/products", (req, res) => {
    const { category } = req.query;

    let result = products;

    if (category) {
        result = products.filter(p => p.category === category);
    }

    res.json(result);
});
```

`/products` → All 3 products

`/products?category=electronics` → Laptop and Phone only

---

# Sorting Example

```javascript
app.get("/users", (req, res) => {
    const { sort } = req.query;
    let users = [...allUsers];

    if (sort === "name") {
        users.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json(users);
});
```

---

# Pagination

```javascript
app.get("/posts", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const result = allPosts.slice(skip, skip + limit);

    res.json({
        page,
        limit,
        total: allPosts.length,
        data: result
    });
});
```

`/posts?page=2&limit=5` → items 6 to 10

---

# Route Params vs Query Params

This is a very common interview question.

| Route Params `/users/:id`   | Query Params `/users?sort=name` |
| --------------------------- | --------------------------------|
| Identifies a specific item  | Filters, sorts, or paginates    |
| Part of the URL path        | After `?` in the URL            |
| Required                    | Optional                        |
| Example: `/products/42`     | Example: `/products?page=2`     |

---

# Company Example — Google Search

```
google.com/search?q=express+js&lang=en&safe=on
```

```
q=express+js  → Search term
lang=en        → Language filter
safe=on        → Safe search enabled
```

All query parameters.

---

# Company Example — Twitter/X

```
/tweets?user=sachin&limit=20&page=3&media=true
```

Fetch 20 tweets from page 3 for user Sachin with media only.

---

# Interview Questions

## Q1. What are query parameters?

**Best Answer**

> Query parameters are key-value pairs appended to the URL after `?`, used to filter, sort, search, or paginate data. They are accessed in Express via `req.query`.

---

## Q2. How do you access query parameters in Express?

```javascript
const { page, limit } = req.query;
```

---

## Q3. Are query parameters required?

No. They are always optional. Always use default values when they might be missing.

---

## Q4. Difference between `req.params` and `req.query`?

| `req.params`                 | `req.query`                    |
| ---------------------------- | ------------------------------ |
| Route parameters (`:id`)     | Query string (`?key=value`)    |
| Part of the path             | After `?`                      |
| Identifies a resource        | Filters or paginates           |

---

# Professional Summary

```
Request: GET /products?category=phone&page=2

↓

req.query = {
  category: "phone",
  page: "2"
}

↓

Filter/sort/paginate

↓

Return result
```

---

# 🧠 Memory Trick

```
URL: /products?category=phone&sort=price

?    → Start of query params
&    → Separator between params
key  → category, sort
val  → phone, price
```

Think of `?` as the **"Options menu"** of your URL.

---

# 🚀 Next Chapter

We'll learn **Body Parser** — how Express reads data sent in the request body (POST/PUT requests).
