Excellent! 🧵

Now we're entering one of the **most advanced topics in Node.js**.

# Chapter 18 — Worker Threads

> **Worker Threads let you run JavaScript in parallel threads, solving the single biggest limitation of Node.js — CPU-intensive tasks.**

If Cluster is for handling many web requests, Worker Threads are for doing heavy computation without freezing your server.

---

# Learning Roadmap

By the end of this chapter, you'll know:

* ✅ What are Worker Threads?
* ✅ Why do we need them?
* ✅ The Problem (blocking the Event Loop)
* ✅ `worker_threads` module
* ✅ Main Thread and Worker Thread
* ✅ Communication between threads
* ✅ `parentPort` and `workerData`
* ✅ Shared Memory (`SharedArrayBuffer`)
* ✅ Cluster vs Worker Threads
* ✅ Company Examples
* ✅ Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you're cooking.

You need to:

1. Boil rice (30 minutes)
2. Chop vegetables (10 minutes)
3. Make curry (20 minutes)

If one person does everything in order:

```text
Boil Rice (30 min)

↓

Chop Vegetables (10 min)

↓

Make Curry (20 min)

↓

Total: 60 minutes
```

But if three people work at the same time:

```text
Person 1: Boil Rice

Person 2: Chop Vegetables

Person 3: Make Curry

↓

Total: 30 minutes
```

Worker Threads are like extra kitchen helpers.

---

# The Real Problem

Node.js is great at I/O.

```text
Read File

Network Request

Database Query
```

But it struggles with CPU-heavy tasks.

Example:

```javascript
function heavyCalculation() {
    let sum = 0;
    for (let i = 0; i < 10_000_000_000; i++) {
        sum += i;
    }
    return sum;
}

console.log(heavyCalculation());
```

While this runs:

```text
ALL other requests are BLOCKED.
```

No user can get a response.

Server appears frozen.

---

# Visual Problem

```text
Request 1 → heavyCalculation()

↓

10 seconds of blocking

↓

Request 2 waits

Request 3 waits

Request 4 waits
```

Very bad in production.

---

# The Solution — Worker Threads

```text
Main Thread

↓

Receives Request

↓

Sends to Worker Thread

↓

Returns to Event Loop

↓

Handles other requests

↓

Worker Thread Finishes

↓

Sends Result Back
```

The main thread is never blocked.

---

# The `worker_threads` Module

```javascript
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
```

Important exports:

| Export         | Purpose                                    |
| -------------- | ------------------------------------------ |
| `Worker`       | Class to create a new worker thread        |
| `isMainThread` | `true` in main thread, `false` in worker   |
| `parentPort`   | Used in worker to communicate with main    |
| `workerData`   | Data passed from main thread to worker     |

---

# First Example

**Single File Pattern**

```javascript
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

if (isMainThread) {

    // Main Thread
    const worker = new Worker(__filename, {
        workerData: { number: 10 }
    });

    worker.on("message", (result) => {
        console.log("Result:", result);
    });

} else {

    // Worker Thread
    const num = workerData.number;
    const square = num * num;

    parentPort.postMessage(square);
}
```

Output:

```text
Result: 100
```

---

# Step-by-Step

1. Main thread creates a Worker using the same file (`__filename`).
2. Passes data via `workerData`.
3. Worker checks `isMainThread === false`.
4. Worker reads `workerData.number`.
5. Worker computes the square.
6. Worker sends result back via `parentPort.postMessage()`.
7. Main thread receives it via `worker.on("message", ...)`.

---

# Two-File Pattern (Professional)

This is the cleaner way used in real projects.

**main.js**

```javascript
const { Worker } = require("worker_threads");

const worker = new Worker("./worker.js", {
    workerData: { start: 1, end: 1_000_000 }
});

worker.on("message", (result) => {
    console.log("Sum:", result);
});

worker.on("error", (err) => {
    console.error("Worker error:", err);
});

worker.on("exit", (code) => {
    if (code !== 0) {
        console.error(`Worker exited with code ${code}`);
    }
});
```

---

**worker.js**

```javascript
const { parentPort, workerData } = require("worker_threads");

let sum = 0;

for (let i = workerData.start; i <= workerData.end; i++) {
    sum += i;
}

parentPort.postMessage(sum);
```

Output:

```text
Sum: 500000500000
```

The main thread was free the entire time.

---

# Communication

## Main → Worker

Via `workerData` (passed at creation):

```javascript
new Worker("./worker.js", {
    workerData: { task: "resize-image", quality: 80 }
});
```

---

## Worker → Main

Via `parentPort.postMessage()`:

```javascript
parentPort.postMessage({ done: true, result: 42 });
```

---

## Main listening

Via `worker.on("message", callback)`:

```javascript
worker.on("message", (data) => {
    console.log(data.result);
});
```

---

# Multiple Workers

```javascript
const { Worker } = require("worker_threads");
const os = require("os");

const numCPUs = os.cpus().length;

for (let i = 0; i < numCPUs; i++) {
    const worker = new Worker("./worker.js", {
        workerData: { id: i }
    });

    worker.on("message", (result) => {
        console.log(`Worker ${i} result:`, result);
    });
}
```

All workers run in parallel.

---

# Shared Memory — SharedArrayBuffer

Workers can share memory directly without copying.

```javascript
const sharedBuffer = new SharedArrayBuffer(4);
const arr = new Int32Array(sharedBuffer);

arr[0] = 42;

const worker = new Worker("./worker.js", {
    workerData: { sharedBuffer }
});
```

worker.js:

```javascript
const arr = new Int32Array(workerData.sharedBuffer);
console.log(arr[0]); // 42
arr[0] = 99;
```

Very fast.

But requires careful synchronization to avoid race conditions.

---

# Company Example — Image Processing

Suppose users upload profile photos.

Resize to multiple formats:

```text
256x256

128x128

64x64
```

Without Worker Threads:

```text
Upload Request

↓

Resize (blocks 2 seconds)

↓

All other requests wait
```

With Worker Threads:

```text
Upload Request

↓

Main Thread: accept request

↓

Worker Thread: resize images

↓

Main Thread: handles other requests

↓

Worker Thread: done → notify main
```

---

# Company Example — Data Processing

A fintech company processes millions of transactions.

```text
Main Thread → Accept API requests

Worker 1   → Process batch A

Worker 2   → Process batch B

Worker 3   → Process batch C

Worker 4   → Process batch D
```

4x faster.

---

# Company Example — Machine Learning

```text
Main Thread → Accept prediction requests

Worker Thread → Run ML model

↓

Prediction returned
```

---

# Cluster vs Worker Threads

This is one of the most important interview questions.

| Feature         | Cluster                          | Worker Threads                    |
| --------------- | -------------------------------- | --------------------------------- |
| Process Type    | Separate processes               | Threads in same process           |
| Memory          | Separate memory per worker       | Can share memory                  |
| Best For        | Handling many HTTP requests      | CPU-intensive computation         |
| Communication   | IPC (slower)                     | `postMessage` or shared memory    |
| Crash Isolation | Worker crash doesn't affect others | Thread crash can affect process |
| Startup         | Slower (new process)             | Faster (same process)             |

---

# When to Use Each

Use **Cluster** when:

* Running an HTTP server
* Handling many concurrent connections
* You want automatic crash recovery per instance

Use **Worker Threads** when:

* Doing CPU-heavy work (encryption, compression, ML)
* Processing large datasets
* Running complex calculations

---

# Interview Questions

## Q1. What are Worker Threads?

**Best Answer**

> Worker Threads allow Node.js to run JavaScript code in parallel on separate threads, enabling CPU-intensive tasks to execute without blocking the main event loop.

---

## Q2. Why do we need Worker Threads?

Because Node.js is single-threaded. Heavy computation would block the Event Loop and freeze all other request handling.

---

## Q3. What is `parentPort`?

The communication channel from a worker thread back to the main thread.

---

## Q4. What is `workerData`?

A read-only copy of the data passed from the main thread to the worker at creation time.

---

## Q5. Difference between Cluster and Worker Threads?

| Cluster             | Worker Threads       |
| ------------------- | -------------------- |
| Multiple processes  | Multiple threads     |
| I/O workloads       | CPU workloads        |
| Separate memory     | Shareable memory     |

---

# Professional Flow

```text
HTTP Request

↓

Main Thread (Event Loop)

↓

Heavy Task Detected

↓

Create Worker Thread

↓

Pass Data (workerData)

↓

Worker Computes

↓

parentPort.postMessage(result)

↓

Main Thread Receives Result

↓

Send HTTP Response
```

---

# 🧠 Memory Trick

Think of your Node.js app as an **office**:

```text
🏢 Office

👔 Manager (Main Thread)
    → Talks to clients
    → Coordinates work

👷 Worker 1 → Heavy Report
👷 Worker 2 → Data Analysis
👷 Worker 3 → PDF Generation
```

The manager never does the heavy lifting.

The workers do.

The manager is always free to take new calls.

---

# 🎯 HCL MERN Assessment Focus

Common interview questions:

* What are Worker Threads?
* Why are they needed?
* What is `isMainThread`?
* What is `parentPort`?
* What is `workerData`?
* Difference between Cluster and Worker Threads.
* When would you use Worker Threads over Cluster?

---

# 🎓 Node.js Core Mastery

You have now completed the **full Node.js foundation**:

1. ✅ Node.js Architecture
2. ✅ Event Loop
3. ✅ EventEmitter
4. ✅ Modules
5. ✅ CommonJS
6. ✅ `require()`
7. ✅ `exports` vs `module.exports`
8. ✅ npm
9. ✅ `package.json`
10. ✅ Streams
11. ✅ Buffers
12. ✅ File System (`fs`)
13. ✅ Path Module
14. ✅ Process Object
15. ✅ Global Objects
16. ✅ Environment Variables
17. ✅ Cluster
18. ✅ Worker Threads

These are the topics that distinguish a **professional Node.js developer** from a beginner.

You are now ready to build real-world backend applications, clear MERN interviews, and understand how production Node.js systems are designed.

Keep practicing. Keep building. 🚀
