Welcome to **Chapter 10 — $group**.

> **$group is the most powerful aggregation stage. It groups documents by a field and lets you compute totals, averages, counts, and more.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine your teacher asks:

> "How many students are in each city?"

You take the class register.

You group all students by their city.

```
Mumbai Group:  Sachin, Priya, Amit → 3 students
Delhi Group:   Rahul, Neha         → 2 students
Pune Group:    Raj                  → 1 student
```

`$group` does exactly this for your MongoDB documents.

---

# What is $group?

`$group` groups documents by a specified field and computes **accumulator expressions** for each group.

Similar to SQL `GROUP BY`.

---

# Basic Syntax

```javascript
{
    $group: {
        _id: "$fieldToGroupBy",
        result: { $accumulator: "$field" }
    }
}
```

`_id` → the grouping key

Everything else → computed values

---

# Accumulators

| Accumulator | Purpose                        |
| ----------- | ------------------------------ |
| `$sum`      | Sum of values                  |
| `$avg`      | Average of values              |
| `$min`      | Minimum value                  |
| `$max`      | Maximum value                  |
| `$count`    | Count documents                |
| `$push`     | Collect values into array      |
| `$addToSet` | Collect unique values          |
| `$first`    | First value in the group       |
| `$last`     | Last value in the group        |

---

# Example 1 — Count Documents

Total number of documents:

```javascript
await Order.aggregate([
    {
        $group: {
            _id: null,
            totalOrders: { $sum: 1 }
        }
    }
]);
```

Output:

```json
[{ "_id": null, "totalOrders": 1500 }]
```

`_id: null` means group ALL documents together.

---

# Example 2 — Count by Field

Count orders by status:

```javascript
await Order.aggregate([
    {
        $group: {
            _id: "$status",
            count: { $sum: 1 }
        }
    }
]);
```

Output:

```json
[
  { "_id": "pending", "count": 45 },
  { "_id": "shipped", "count": 120 },
  { "_id": "delivered", "count": 890 }
]
```

---

# Example 3 — Sum Revenue

Total revenue per user:

```javascript
await Order.aggregate([
    {
        $group: {
            _id: "$userId",
            totalSpent: { $sum: "$amount" },
            orderCount: { $sum: 1 }
        }
    }
]);
```

Output:

```json
[
  { "_id": "user1", "totalSpent": 15000, "orderCount": 5 },
  { "_id": "user2", "totalSpent": 8500, "orderCount": 3 }
]
```

---

# Example 4 — Average

Average product price by category:

```javascript
await Product.aggregate([
    {
        $group: {
            _id: "$category",
            avgPrice: { $avg: "$price" },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
            count: { $sum: 1 }
        }
    },
    { $sort: { avgPrice: -1 } }
]);
```

---

# Example 5 — $push (Collect into Array)

List all emails per city:

```javascript
await User.aggregate([
    {
        $group: {
            _id: "$city",
            emails: { $push: "$email" },
            names: { $push: "$name" }
        }
    }
]);
```

Output:

```json
[
  { "_id": "Mumbai", "emails": ["sachin@...", "priya@..."], "names": ["Sachin", "Priya"] }
]
```

---

# Example 6 — Group by Multiple Fields

Group by year AND month:

```javascript
await Order.aggregate([
    {
        $group: {
            _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" }
            },
            revenue: { $sum: "$amount" },
            orders: { $sum: 1 }
        }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
]);
```

Output:

```json
[
  { "_id": { "year": 2024, "month": 1 }, "revenue": 150000, "orders": 320 },
  { "_id": { "year": 2024, "month": 2 }, "revenue": 132000, "orders": 290 }
]
```

---

# Full Pipeline — Top Customers

```javascript
await Order.aggregate([
    { $match: { status: "completed" } },
    {
        $group: {
            _id: "$userId",
            totalSpent: { $sum: "$amount" },
            orderCount: { $sum: 1 },
            lastOrder: { $max: "$createdAt" }
        }
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 10 },
    {
        $project: {
            userId: "$_id",
            totalSpent: 1,
            orderCount: 1,
            lastOrder: 1,
            _id: 0
        }
    }
]);
```

Top 10 customers by total spending.

---

# Company Example — Swiggy

Daily restaurant revenue report:

```javascript
await Order.aggregate([
    { $match: { date: today, status: "delivered" } },
    {
        $group: {
            _id: "$restaurantId",
            revenue: { $sum: "$amount" },
            orders: { $sum: 1 },
            avgOrder: { $avg: "$amount" }
        }
    },
    { $sort: { revenue: -1 } }
]);
```

---

# Interview Questions

## Q1. What does `$group` do?

**Best Answer**

> `$group` groups input documents by a specified key and applies accumulator expressions to compute values like sum, average, count, or collect arrays for each group.

---

## Q2. What does `_id: null` mean in `$group`?

It groups ALL documents into a single group — useful for computing grand totals.

---

## Q3. What is the difference between `$push` and `$addToSet`?

| `$push`               | `$addToSet`              |
| --------------------- | ------------------------ |
| Collects all values   | Collects unique values   |
| Allows duplicates     | No duplicates            |

---

## Q4. How do you group by multiple fields?

Use an object as the `_id`:

```javascript
_id: { year: { $year: "$date" }, month: { $month: "$date" } }
```

---

# Professional Summary

```
$group: {
    _id: "$fieldToGroupBy",

    total:    { $sum: "$amount" },
    average:  { $avg: "$price" },
    minimum:  { $min: "$price" },
    maximum:  { $max: "$price" },
    count:    { $sum: 1 },
    list:     { $push: "$name" },
    unique:   { $addToSet: "$tag" }
}
```

---

# 🧠 Memory Trick

```
$group = School roll call by city

"Delhi students: Rahul, Neha → 2"
"Mumbai students: Sachin, Priya → 2"

_id         = city (grouping key)
$push       = collect names into array
$sum: 1     = count students
```

---

# 🚀 Next Chapter

We'll learn **$lookup** — how to join data from two collections, like SQL JOIN, inside an aggregation pipeline.
