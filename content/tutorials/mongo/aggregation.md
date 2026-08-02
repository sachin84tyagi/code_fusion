Welcome to **Chapter 8 — Aggregation**.

> **Aggregation is MongoDB's data processing pipeline. It transforms, groups, filters, and analyzes documents — like SQL GROUP BY on steroids.**

Every analytics dashboard, report, and complex query uses aggregation.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a factory.

Raw materials enter.

They pass through machines.

```
Machine 1: Sort raw material

↓

Machine 2: Cut and shape

↓

Machine 3: Paint

↓

Machine 4: Quality check

↓

Final Product
```

Each machine transforms the material.

MongoDB Aggregation works the same way.

Documents enter a pipeline.

Each stage transforms them.

Final output is your result.

---

# What is Aggregation?

Aggregation processes documents through a sequence of **stages** in a **pipeline**.

```javascript
collection.aggregate([
    { stage 1 },
    { stage 2 },
    { stage 3 }
])
```

Output of each stage is input to the next.

---

# Common Pipeline Stages

| Stage      | Purpose                                   |
| ---------- | ----------------------------------------- |
| `$match`   | Filter documents (like WHERE in SQL)      |
| `$group`   | Group and aggregate (like GROUP BY)       |
| `$sort`    | Sort results                              |
| `$limit`   | Limit number of results                   |
| `$skip`    | Skip documents (pagination)               |
| `$project` | Select/rename/compute fields              |
| `$lookup`  | Join documents from another collection    |
| `$unwind`  | Deconstruct an array into separate docs   |
| `$count`   | Count documents                           |
| `$addFields` | Add computed fields                     |

---

# Simple Example — Count by Status

```javascript
const result = await Order.aggregate([
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

# $project — Shape the Output

```javascript
await User.aggregate([
    {
        $project: {
            name: 1,
            email: 1,
            _id: 0,                        // exclude _id
            nameUppercase: { $toUpper: "$name" }
        }
    }
]);
```

Output:

```json
[
  { "name": "Sachin", "email": "sachin@gmail.com", "nameUppercase": "SACHIN" }
]
```

---

# $sort, $limit, $skip

```javascript
await Product.aggregate([
    { $sort: { price: -1 } },   // Most expensive first
    { $skip: 10 },              // Skip first 10
    { $limit: 5 }               // Take next 5
]);
```

---

# $unwind — Flatten Arrays

```javascript
// Document:
{ _id: 1, name: "Sachin", skills: ["Node", "React", "MongoDB"] }
```

After `$unwind`:

```javascript
await User.aggregate([
    { $unwind: "$skills" }
]);
```

Output:

```json
[
  { "_id": 1, "name": "Sachin", "skills": "Node" },
  { "_id": 1, "name": "Sachin", "skills": "React" },
  { "_id": 1, "name": "Sachin", "skills": "MongoDB" }
]
```

One document becomes three.

---

# $addFields — Compute New Fields

```javascript
await Product.aggregate([
    {
        $addFields: {
            discountedPrice: {
                $multiply: ["$price", 0.9]
            }
        }
    }
]);
```

---

# Real Pipeline Example — Sales Report

```javascript
const salesReport = await Order.aggregate([
    // Step 1: Only completed orders in 2024
    {
        $match: {
            status: "completed",
            createdAt: {
                $gte: new Date("2024-01-01"),
                $lte: new Date("2024-12-31")
            }
        }
    },
    // Step 2: Group by month
    {
        $group: {
            _id: { $month: "$createdAt" },
            totalRevenue: { $sum: "$amount" },
            orderCount: { $sum: 1 },
            avgOrderValue: { $avg: "$amount" }
        }
    },
    // Step 3: Sort by month
    {
        $sort: { _id: 1 }
    },
    // Step 4: Rename _id to month
    {
        $project: {
            month: "$_id",
            totalRevenue: 1,
            orderCount: 1,
            avgOrderValue: { $round: ["$avgOrderValue", 2] },
            _id: 0
        }
    }
]);
```

Output:

```json
[
  { "month": 1, "totalRevenue": 150000, "orderCount": 320, "avgOrderValue": 468.75 },
  { "month": 2, "totalRevenue": 132000, "orderCount": 290, "avgOrderValue": 455.17 }
]
```

---

# Aggregation Operators

## Math

```javascript
$sum, $avg, $min, $max, $multiply, $divide, $subtract, $add
```

## String

```javascript
$toUpper, $toLower, $concat, $trim, $substr
```

## Date

```javascript
$year, $month, $dayOfMonth, $hour, $dateToString
```

## Conditional

```javascript
$cond, $ifNull, $switch
```

---

# Company Example — Zomato

Daily order analytics:

```javascript
await Order.aggregate([
    { $match: { date: today } },
    {
        $group: {
            _id: "$restaurantId",
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$amount" }
        }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 10 }
]);
```

Top 10 restaurants by revenue today.

---

# Interview Questions

## Q1. What is Aggregation in MongoDB?

**Best Answer**

> Aggregation is a pipeline-based data processing framework in MongoDB that allows you to filter, transform, group, and analyze documents through a series of stages. Each stage receives documents from the previous stage.

---

## Q2. What is the difference between `find()` and `aggregate()`?

`find()` retrieves documents. `aggregate()` transforms and analyzes documents through multiple pipeline stages.

---

## Q3. What does `$unwind` do?

Deconstructs an array field, creating one document per array element.

---

## Q4. How is `$group` similar to SQL `GROUP BY`?

Both group documents/rows by a field and allow applying aggregation functions like SUM, COUNT, AVG.

---

# Professional Summary

```
aggregate([
  { $match: ... },      // Filter (like WHERE)
  { $group: ... },      // Group (like GROUP BY)
  { $sort: ... },       // Sort (like ORDER BY)
  { $project: ... },    // Select fields (like SELECT)
  { $lookup: ... },     // Join (like JOIN)
  { $limit: ... },      // Limit results
  { $skip: ... }        // Pagination
])
```

---

# 🧠 Memory Trick

```
Aggregation = Factory Assembly Line

Raw Docs → [$match] → [$group] → [$sort] → [$project] → Final Output

Each stage = one machine on the assembly line
```

---

# 🚀 Next Chapter

We'll master **$match** — the filtering powerhouse of the aggregation pipeline.
