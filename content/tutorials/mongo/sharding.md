Welcome to **Chapter 16 — Sharding**.

> **Sharding is how MongoDB scales horizontally to handle billions of documents — distributing data across multiple servers (shards).**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a huge exam with 1 million students.

One teacher cannot grade 1 million papers.

Solution:

```
Divide papers into groups:

A-F → Teacher 1
G-M → Teacher 2
N-S → Teacher 3
T-Z → Teacher 4
```

Each teacher handles their group.

Grading happens in parallel.

Much faster.

**Sharding** divides your data the same way across multiple servers.

---

# What is Sharding?

Sharding is the process of **distributing data across multiple machines** (shards).

Each shard is a separate MongoDB instance holding a portion of the data.

```
10 million users split across 4 shards:

Shard 1: Users 1 - 2,500,000
Shard 2: Users 2,500,001 - 5,000,000
Shard 3: Users 5,000,001 - 7,500,000
Shard 4: Users 7,500,001 - 10,000,000
```

---

# Why Sharding?

## The Problem — Vertical Scaling Limit

One server can only hold so much:

```
More RAM → Bigger server
More CPU → Better server
More Disk → Still one machine
```

Eventually you hit the ceiling.

Too expensive. Still limited.

---

## The Solution — Horizontal Scaling

Add more servers.

```
1 server → 100 GB

↓

10 servers → 1 TB (distributed)
```

Each server holds a piece of the data.

Queries are distributed across servers.

Linear performance growth.

---

# Sharding Architecture

```
Client Application

↓

mongos (Query Router)

↓

Config Servers (Metadata)

↓

┌──────────┬──────────┬──────────┐

Shard 1    Shard 2    Shard 3

(Replica)  (Replica)  (Replica)
```

---

## Components

| Component        | Role                                              |
| ---------------- | ------------------------------------------------- |
| `mongos`         | Query router — directs queries to correct shard   |
| Config Servers   | Store cluster metadata and shard mapping          |
| Shards           | Actual MongoDB instances holding data chunks      |

---

# Shard Key

The shard key determines **how data is distributed** across shards.

Choosing the right shard key is critical.

```javascript
db.users.createIndex({ userId: "hashed" });

sh.shardCollection("mydb.users", { userId: "hashed" });
```

---

# Shard Key Strategies

---

## 1. Hashed Sharding

```javascript
{ userId: "hashed" }
```

MongoDB computes a hash of the field value.

Data distributed randomly but evenly.

Good for: Preventing hotspots.

Bad for: Range queries (hash breaks ordering).

---

## 2. Range Sharding

```javascript
{ createdAt: 1 }
```

Data distributed based on value ranges.

Good for: Range queries.

Bad for: Monotonically increasing keys (last shard gets all new data → hotspot).

---

## 3. Zone-Based Sharding

Assign specific data ranges to specific shards.

```
Shard 1 (India server)   → region: "IN"
Shard 2 (US server)      → region: "US"
Shard 3 (Europe server)  → region: "EU"
```

Useful for data locality (GDPR compliance).

---

# Chunk Distribution

MongoDB divides collections into **chunks** (64 MB by default).

The **balancer** moves chunks between shards to keep data evenly distributed.

```
Shard 1: 50 chunks
Shard 2: 48 chunks
Shard 3: 52 chunks

Balancer moves chunks to equalize → All shards ~50 chunks
```

---

# Choosing a Good Shard Key

A good shard key:

✅ High cardinality (many distinct values)

✅ Even distribution (no shard gets more traffic)

✅ Matches query patterns

✅ Not monotonically increasing

---

Bad shard key examples:

❌ `{ isActive: 1 }` — only 2 values (true/false) → data goes to 2 shards only

❌ `{ createdAt: 1 }` — all new documents go to the last shard → hotspot

---

Good shard key examples:

✅ `{ userId: "hashed" }` — even hash distribution

✅ `{ country: 1, userId: 1 }` — composite, balanced

---

# Replication + Sharding

Each shard is itself a **Replica Set** (3 nodes for high availability).

```
Shard 1 = Primary + Secondary + Secondary
Shard 2 = Primary + Secondary + Secondary
Shard 3 = Primary + Secondary + Secondary
```

If one shard's primary goes down → Secondary takes over.

Zero downtime.

---

# Company Example — MongoDB Atlas (Sharded)

Amazon's product catalog:

```
500 million products

Split across 10 shards by { productId: "hashed" }

Each shard: ~50 million products

Query routing:
  - mongos receives query
  - Computes target shard from productId hash
  - Routes to correct shard
  - Returns result in milliseconds
```

---

# Company Example — Twitter

```
3 billion tweets

Sharded by { userId: "hashed" }

Each shard holds tweets for a range of users

Timeline query:
  - mongos routes to shards of followed users
  - Merges results
  - Returns sorted feed
```

---

# Sharding vs Replication

| Replication                   | Sharding                          |
| ----------------------------- | --------------------------------- |
| Multiple copies of same data  | Data split across servers         |
| High availability             | Horizontal scaling                |
| Automatic failover            | More capacity, more performance   |
| Cannot scale beyond one server| Scales to petabytes               |

Production MongoDB: **Both together** (each shard is a replica set).

---

# Interview Questions

## Q1. What is Sharding in MongoDB?

**Best Answer**

> Sharding is MongoDB's horizontal scaling strategy. It distributes data across multiple servers (shards), each holding a portion of the data. A query router (mongos) directs queries to the correct shard based on the shard key.

---

## Q2. What is a Shard Key?

The field (or compound fields) that MongoDB uses to distribute documents across shards. Choosing a good shard key is critical for performance.

---

## Q3. What is a Hotspot in sharding?

When most data or queries go to a single shard, overloading it. Caused by poor shard key choices (like monotonically increasing keys).

---

## Q4. Difference between Replication and Sharding?

| Replication       | Sharding             |
| ----------------- | -------------------- |
| Data availability | Data distribution    |
| Failover          | Horizontal scale     |
| Same data on all  | Different data on each|

---

## Q5. What is `mongos`?

The query router that receives client queries, determines which shard(s) to contact, and returns the merged result.

---

# Professional Summary

```
Sharding = Horizontal Scaling

Components:
  mongos        → Query router
  Config Servers → Cluster metadata
  Shards        → Data holders (replica sets)

Shard Key strategies:
  Hashed   → Even distribution, no range queries
  Range    → Range queries, risk of hotspot

Rule: Each shard = Replica Set
      Best for: Billions of documents, global scale
```

---

# 🧠 Memory Trick

```
Sharding = Distributing exam papers

📝 1 million papers

Teacher 1 (Shard 1): A-F → 250K papers
Teacher 2 (Shard 2): G-M → 250K papers
Teacher 3 (Shard 3): N-S → 250K papers
Teacher 4 (Shard 4): T-Z → 250K papers

mongos = Principal who assigns papers to teachers
Shard Key = Alphabetical split rule
```

---

# 🎓 MongoDB Core Mastery

You have now completed the **full MongoDB foundation**:

1. ✅ MongoDB
2. ✅ Collection
3. ✅ Document
4. ✅ BSON
5. ✅ CRUD
6. ✅ Index
7. ✅ Compound Index
8. ✅ Aggregation
9. ✅ $match
10. ✅ $group
11. ✅ $lookup
12. ✅ Mongoose
13. ✅ Schema
14. ✅ populate()
15. ✅ Transactions
16. ✅ Sharding

These topics cover everything asked in MERN stack interviews — from junior to senior level.

You are now ready to design, build, and optimize production MongoDB databases. 🚀
