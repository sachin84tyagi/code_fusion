Welcome to **Chapter 9 — $match**.

> **$match is the filter stage of the aggregation pipeline. Put it first for maximum performance.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a conveyor belt in a factory.

All raw materials pass through.

At the very start is a **sorter**.

```
Sorter Rule:
Only let RED items through.

Red item  → ✅ Passes
Blue item → ❌ Rejected
Green item → ❌ Rejected
```

`$match` is that sorter.

Only documents matching your criteria continue to the next stage.

---

# What is $match?

`$match` filters documents in the aggregation pipeline.

It works exactly like `find()` queries — same syntax.

```javascript
{ $match: { status: "active" } }
```

Only active documents proceed to the next stage.

---

# Basic Syntax

```javascript
await User.aggregate([
    { $match: { isActive: true } }
]);
```

Same as:

```javascript
await User.find({ isActive: true });
```

But in a pipeline, you can chain stages after it.

---

# $match Operators

---

## Equality

```javascript
{ $match: { role: "admin" } }
```

---

## Greater Than / Less Than

```javascript
{ $match: { age: { $gt: 18, $lt: 60 } } }
```

---

## In a List

```javascript
{ $match: { status: { $in: ["pending", "processing"] } } }
```

---

## Not Equal

```javascript
{ $match: { role: { $ne: "banned" } } }
```

---

## AND (implicit)

```javascript
{ $match: { role: "user", isActive: true, age: { $gte: 18 } } }
```

---

## OR

```javascript
{ $match: { $or: [{ role: "admin" }, { role: "superadmin" }] } }
```

---

## Date Range

```javascript
{ $match: {
    createdAt: {
        $gte: new Date("2024-01-01"),
        $lte: new Date("2024-12-31")
    }
}}
```

---

## Regex (Text pattern)

```javascript
{ $match: { name: { $regex: /sachin/i } } }
```

---

# $match First — Performance Rule

Always put `$match` as the **first stage** in the pipeline.

```javascript
// ✅ GOOD — filter first, process less data
await Order.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: "$userId", total: { $sum: "$amount" } } }
]);

// ❌ BAD — groups ALL orders then filters
await Order.aggregate([
    { $group: { _id: "$userId", total: { $sum: "$amount" } } },
    { $match: { status: "completed" } }
]);
```

Early `$match` reduces documents processed in later stages.

MongoDB also uses indexes with early `$match`.

---

# Multiple $match Stages

You can use `$match` at multiple points in the pipeline.

```javascript
await Product.aggregate([
    { $match: { category: "electronics" } },   // Stage 1 filter

    { $group: {
        _id: "$brand",
        avgPrice: { $avg: "$price" }
    }},

    { $match: { avgPrice: { $gt: 10000 } } }   // Stage 3 filter (post-group)
]);
```

First `$match` → filter electronics

Then group by brand

Second `$match` → only brands with avg price > 10000

---

# Real Pipeline Example

User analytics: Active admin users in Delhi.

```javascript
const result = await User.aggregate([
    {
        $match: {
            role: "admin",
            isActive: true,
            "address.city": "Delhi"
        }
    },
    {
        $project: {
            name: 1,
            email: 1,
            "address.city": 1,
            _id: 0
        }
    },
    {
        $sort: { name: 1 }
    }
]);
```

---

# $match with $expr (Compare Fields)

Sometimes you need to compare two fields within the same document.

```javascript
// Find orders where actual delivery was late
await Order.aggregate([
    {
        $match: {
            $expr: {
                $gt: ["$deliveredAt", "$expectedAt"]
            }
        }
    }
]);
```

`$expr` lets you use aggregation expressions inside `$match`.

---

# Company Example — E-commerce

Find orders to process today:

```javascript
await Order.aggregate([
    {
        $match: {
            status: "pending",
            paymentStatus: "paid",
            orderDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }
    },
    {
        $group: {
            _id: "$warehouseId",
            orders: { $push: "$$ROOT" },
            count: { $sum: 1 }
        }
    }
]);
```

---

# Interview Questions

## Q1. What does `$match` do in aggregation?

**Best Answer**

> `$match` filters documents in the aggregation pipeline using query conditions, similar to `find()`. Documents that don't match are excluded from subsequent pipeline stages.

---

## Q2. Why should `$match` be the first stage?

To reduce the number of documents early, improving performance and allowing MongoDB to use indexes.

---

## Q3. What is `$expr` in `$match`?

`$expr` allows you to use aggregation expressions (like comparing two fields in the same document) within a `$match` stage.

---

## Q4. Can you use multiple `$match` stages?

Yes. You can apply `$match` at different points in the pipeline — once to filter inputs, again to filter grouped/computed results.

---

# Professional Summary

```
$match = WHERE clause for aggregation

{ $match: { field: value } }              → Equality
{ $match: { age: { $gt: 18 } } }         → Comparison
{ $match: { $or: [...] } }               → OR
{ $match: { createdAt: { $gte: date } } } → Date range

Rule: Always put $match FIRST
      → uses indexes
      → reduces docs in pipeline
```

---

# 🧠 Memory Trick

```
$match = Security Bouncer at the club door

Only people on the list (matching criteria) enter.

Everyone else is turned away.

The earlier the bouncer, the less crowd inside.
```

---

# 🚀 Next Chapter

We'll learn **$group** — how to group documents and compute aggregated values like totals, averages, and counts.
