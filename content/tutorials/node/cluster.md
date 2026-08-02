Excellent! 🚀

Now we're entering one of the **most powerful performance features in Node.js**.

# Chapter 17 — Cluster

> **Node.js runs on one CPU core by default. Cluster lets you use ALL of them.**

Without Cluster, a modern server with 8 cores wastes 7 of them.

---

# Learning Roadmap

By the end of this chapter, you'll know:

* ✅ What is Cluster?
* ✅ Why do we need it?
* ✅ How Cluster works
* ✅ Primary and Worker processes
* ✅ Load Balancing
* ✅ Automatic restart on crash
* ✅ Company Examples
* ✅ When to use Cluster vs Worker Threads
* ✅ Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a big restaurant.

Hundreds of customers arrive.

One manager handles everything.

```text
One Manager

↓

Customer 1

Customer 2

Customer 3

Customer 4

...
```

Slow.

Overloaded.

---

Now imagine

4 Managers.

```text
Manager 1 → Customer 1

Manager 2 → Customer 2

Manager 3 → Customer 3

Manager 4 → Customer 4
```

4 times faster.

That's exactly what Cluster does.

---

# The Problem

Node.js is single-threaded.

```text
Modern Server

8 CPUs

↓

Node.js uses only 1
```

Waste.

---

# The Solution

Cluster creates multiple worker processes.

Each worker runs on a separate CPU core.

```text
8 CPUs

↓

8 Workers

↓

8x More Requests Handled
```

---

# Visual Diagram

```text
Primary Process

        │

        ▼

┌───────────────────────────────┐
│                               │
▼                               ▼
Worker 1     Worker 2     Worker 3     Worker 4

(CPU 1)      (CPU 2)      (CPU 3)      (CPU 4)
```

---

# First Example

```javascript
const cluster = require("cluster");
const os = require("os");

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary PID: ${process.pid}`);
    console.log(`Creating ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

} else {
    console.log(`Worker PID: ${process.pid}`);
}
```

Output on a 4-core machine:

```text
Primary PID: 1234

Creating 4 workers...

Worker PID: 1235

Worker PID: 1236

Worker PID: 1237

Worker PID: 1238
```

---

# How It Works

```text
Primary Process

↓

cluster.fork()

↓

Creates Child Process

↓

Each Child Runs Same File

↓

cluster.isPrimary = false for children
```

---

# Step-by-Step

1. Node starts the `Primary` process.
2. Primary checks `cluster.isPrimary` — it is `true`.
3. Primary forks one worker per CPU.
4. Each worker runs the same file but `cluster.isPrimary` is `false`.
5. Workers start their HTTP servers.
6. OS distributes incoming connections across workers.

---

# Real Express Server with Cluster

```javascript
const cluster = require("cluster");
const express = require("express");
const os = require("os");

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    console.log(`Primary ${process.pid} is running`);

} else {

    const app = express();

    app.get("/", (req, res) => {
        res.send(`Worker ${process.pid} handled request`);
    });

    app.listen(3000);

    console.log(`Worker ${process.pid} started`);
}
```

---

# Auto-Restart on Crash

One of the biggest advantages of Cluster.

```javascript
if (cluster.isPrimary) {

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.pid} died. Restarting...`);
        cluster.fork();
    });
}
```

If any worker crashes,

Primary automatically creates a new one.

Zero downtime.

---

# Company Example — Large API

Imagine a payment API that receives thousands of requests per second.

Without Cluster:

```text
1 CPU

↓

Bottleneck

↓

Slow Responses
```

With Cluster:

```text
8 Workers

↓

8x Throughput

↓

Fast Responses
```

This is how large-scale APIs handle high traffic.

---

# Company Example — Amazon

Amazon servers use all available CPUs.

When one process crashes:

```text
Worker Crashed

↓

Primary Detects

↓

Fork New Worker

↓

Application Continues
```

No manual intervention.

---

# Load Balancing

How does Node decide which worker handles which request?

Node uses the **round-robin** strategy by default.

```text
Request 1 → Worker 1

Request 2 → Worker 2

Request 3 → Worker 3

Request 4 → Worker 4

Request 5 → Worker 1

Request 6 → Worker 2

...
```

Evenly distributed.

---

# Cluster vs Worker Threads

This is a common interview question.

| Cluster                                    | Worker Threads                          |
| ------------------------------------------ | --------------------------------------- |
| Multiple processes                         | Multiple threads in one process         |
| Separate memory                            | Shared memory                           |
| Best for I/O-bound tasks (web servers)     | Best for CPU-bound tasks (computation)  |
| Crash in one worker doesn't affect others  | Crash in one thread may affect process  |

---

# When to Use Cluster

Use Cluster when:

* Your application receives many concurrent HTTP requests
* You want to maximize CPU utilization
* You need automatic crash recovery
* You're running an Express/Fastify API server

---

# Interview Questions

## Q1. What is the Cluster module?

**Best Answer**

> The Cluster module allows Node.js to create child processes (workers) that all share the same server port, enabling the application to utilize multiple CPU cores and handle more concurrent requests.

---

## Q2. What is the Primary (master) process?

The parent process that manages worker creation, monitors their health, and restarts them if they crash.

---

## Q3. How many workers should you create?

Typically one worker per CPU core:

```javascript
const numCPUs = require("os").cpus().length;
```

---

## Q4. What happens when a worker crashes?

If you listen to the `"exit"` event, the primary can fork a new worker automatically, maintaining availability.

---

## Q5. Difference between Cluster and Worker Threads?

| Cluster               | Worker Threads            |
| --------------------- | ------------------------- |
| Separate processes    | Threads in same process   |
| Separate memory       | Shared memory             |
| Network requests      | CPU computation           |

---

# Professional Flow

```text
Server Starts

↓

Primary Process

↓

Detect CPU Count

↓

Fork Workers

↓

Each Worker Starts HTTP Server

↓

OS Distributes Requests

↓

If Worker Crashes → Fork Replacement

↓

Zero Downtime
```

---

# 🧠 Memory Trick

Think of Cluster like a **franchise restaurant**.

```text
🏢 Head Office (Primary)

        │

        ▼

🍕 Branch 1 (Worker)

🍕 Branch 2 (Worker)

🍕 Branch 3 (Worker)

🍕 Branch 4 (Worker)
```

Same menu (same code).

Different locations (different CPUs).

Head office manages them all.

---

# 🎯 HCL MERN Assessment Focus

Common interview questions:

* What is the Cluster module?
* Why do we need Cluster in Node.js?
* What is the Primary process?
* How many workers should you create?
* How do you restart a crashed worker?
* Difference between Cluster and Worker Threads.

---

# 🚀 Next Chapter

We'll study **Worker Threads**, which is the solution for CPU-intensive tasks like image processing, encryption, and data transformation — tasks that would otherwise block the Event Loop.
