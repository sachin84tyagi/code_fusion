Welcome to **Chapter 11 — $lookup**.

> **$lookup is MongoDB's JOIN. It lets you combine data from two collections in a single aggregation pipeline.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine two registers in a school.

```
📒 Student Register
  { id: 1, name: "Sachin", classId: 10 }
  { id: 2, name: "Rahul", classId: 11 }

📒 Class Register
  { id: 10, className: "10th A", teacher: "Mrs. Sharma" }
  { id: 11, className: "11th B", teacher: "Mr. Gupta" }
```

To find Sachin's class details, you:

1. Look at Sachin → `classId: 10`
2. Go to Class Register → `id: 10` → "10th A, Mrs. Sharma"

`$lookup` does this automatically.

It connects two collections.

---

# What is $lookup?

`$lookup` performs a **left outer join** between two collections.

It fetches matching documents from a foreign collection and embeds them in the result.

---

# Basic Syntax

```javascript
{
    $lookup: {
        from: "foreignCollection",
        localField: "localField",
        foreignField: "foreignField",
        as: "outputArrayName"
    }
}
```

| Field            | Purpose                                      |
| ---------------- | -------------------------------------------- |
| `from`           | The collection to join                       |
| `localField`     | Field in the current document                |
| `foreignField`   | Field in the joined collection               |
| `as`             | Name of the output array field               |

---

# Example Setup

```javascript
// Orders collection
{ _id: 1, userId: "user_101", amount: 5000, product: "Laptop" }
{ _id: 2, userId: "user_102", amount: 1000, product: "Mouse" }

// Users collection
{ _id: "user_101", name: "Sachin", email: "sachin@gmail.com" }
{ _id: "user_102", name: "Rahul", email: "rahul@gmail.com" }
```

---

# Basic $lookup Example

```javascript
await Order.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails"
        }
    }
]);
```

Output:

```json
{
  "_id": 1,
  "userId": "user_101",
  "amount": 5000,
  "product": "Laptop",
  "userDetails": [
    {
      "_id": "user_101",
      "name": "Sachin",
      "email": "sachin@gmail.com"
    }
  ]
}
```

`userDetails` is an **array** (always, even if single result).

---

# Flatten the Array with $unwind

```javascript
await Order.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $unwind: "$user"
    },
    {
        $project: {
            product: 1,
            amount: 1,
            "user.name": 1,
            "user.email": 1
        }
    }
]);
```

Output:

```json
{
  "product": "Laptop",
  "amount": 5000,
  "user": {
    "name": "Sachin",
    "email": "sachin@gmail.com"
  }
}
```

Clean. No array. Just the object.

---

# Multiple $lookups

```javascript
await Order.aggregate([
    // Join users
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    },
    { $unwind: "$user" },
    // Join products
    {
        $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product"
        }
    },
    { $unwind: "$product" }
]);
```

---

# $lookup with Pipeline (Advanced)

More flexible version with sub-pipeline filtering.

```javascript
await Order.aggregate([
    {
        $lookup: {
            from: "reviews",
            let: { orderId: "$_id" },
            pipeline: [
                {
                    $match: {
                        $expr: { $eq: ["$orderId", "$$orderId"] }
                    }
                },
                { $project: { rating: 1, comment: 1 } }
            ],
            as: "reviews"
        }
    }
]);
```

`$$orderId` refers to variables defined in `let`.

---

# Real Example — Blog Post with Author

```javascript
await Post.aggregate([
    { $match: { published: true } },
    {
        $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author"
        }
    },
    { $unwind: "$author" },
    {
        $project: {
            title: 1,
            content: 1,
            createdAt: 1,
            "author.name": 1,
            "author.avatar": 1
        }
    },
    { $sort: { createdAt: -1 } },
    { $limit: 10 }
]);
```

---

# $lookup vs Mongoose populate()

| `$lookup`                      | `populate()`                      |
| ------------------------------ | --------------------------------- |
| Aggregation stage              | Mongoose-specific method          |
| More powerful (pipeline)       | Simpler syntax                    |
| Single database query          | Two separate queries              |
| Better for complex joins       | Better for simple references      |

---

# Company Example — Amazon Order History

```javascript
await Order.aggregate([
    { $match: { userId: req.user.id } },
    {
        $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product"
        }
    },
    { $unwind: "$product" },
    {
        $lookup: {
            from: "deliveries",
            localField: "_id",
            foreignField: "orderId",
            as: "delivery"
        }
    },
    { $unwind: { path: "$delivery", preserveNullAndEmpty: true } }
]);
```

---

# Interview Questions

## Q1. What is `$lookup`?

**Best Answer**

> `$lookup` is an aggregation stage in MongoDB that performs a left outer join with another collection, embedding matching documents as an array in the result.

---

## Q2. Why does `$lookup` always return an array?

Because it's a left outer join — there could be multiple matching documents. Use `$unwind` to flatten it to a single object.

---

## Q3. Difference between `$lookup` and Mongoose `populate()`?

`$lookup` is a single aggregation query — more efficient and more flexible. `populate()` runs two separate queries.

---

## Q4. What is the `let` option in `$lookup`?

It allows you to define variables from the local document's fields for use inside the pipeline sub-query.

---

# Professional Summary

```
$lookup: {
    from: "other_collection",
    localField: "myField",
    foreignField: "_id",
    as: "result"
}

Result is always an array.
Use $unwind to flatten to object.
Chain multiple $lookups for complex joins.
```

---

# 🧠 Memory Trick

```
$lookup = Detective connecting two case files

Case File A (orders): { userId: "u101" }

$lookup cross-references

Case File B (users): { _id: "u101", name: "Sachin" }

Result: merged document with full info
```

---

# 🚀 Next Chapter

We'll learn **Mongoose** — the ODM (Object Document Mapper) that makes working with MongoDB in Node.js structured, safe, and productive.
