Excellent! 🎉

Now we've reached one of the **most powerful objects in Node.js**.

Every Node.js application has access to it automatically.

# Chapter 14 — The `process` Object (Master Class)

> **The `process` object is your application's bridge to the operating system.**

It lets Node.js know things like:

* Which command started the app?
* What environment is it running in?
* How much memory is being used?
* How can the application shut down safely?

Almost every production Node.js application uses the `process` object.

---

# 📚 Learning Roadmap

By the end of this chapter, you'll know:

* ✅ What is `process`?
* ✅ `process.argv`
* ✅ `process.env`
* ✅ `process.cwd()`
* ✅ `process.exit()`
* ✅ `process.pid`
* ✅ `process.memoryUsage()`
* ✅ `process.uptime()`
* ✅ Events (`exit`, `SIGINT`, `SIGTERM`)
* ✅ Graceful Shutdown
* ✅ Company Examples
* ✅ Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you're driving a car.

The dashboard shows:

```text
🚗 Dashboard

Speed

Fuel

Engine Temperature

Engine Running Time
```

The dashboard tells you **everything about your car**.

The `process` object is the dashboard of your Node.js application.

It tells you everything about your running program.

---

# What is `process`?

It is a **global object**.

That means you don't import it.

❌ No need for:

```javascript
const process = require("process");
```

Simply use:

```javascript
console.log(process);
```

Node automatically provides it.

---

# Visual Diagram

```text
Operating System

        ▲

        │

process object

        │

        ▼

Your Node.js Application
```

---

# Example

```javascript
console.log(process.platform);
```

Possible Output

```text
win32
```

or

```text
linux
```

or

```text
darwin
```

(macOS)

---

# process.argv

One of the most asked interview topics.

Imagine you run:

```bash
node app.js Sachin 25
```

Inside app.js

```javascript
console.log(process.argv);
```

Output

```javascript
[
  '/usr/local/bin/node',
  '/project/app.js',
  'Sachin',
  '25'
]
```

---

# Understanding argv

```text
node app.js Sachin 25

│      │      │      │

│      │      │      User Input

│      │      First Argument

│      Script File

Node Executable
```

---

# Practical Example

app.js

```javascript
const name = process.argv[2];

console.log("Hello", name);
```

Run

```bash
node app.js Sachin
```

Output

```text
Hello Sachin
```

---

# Mini Project — Calculator

```javascript
const a = Number(process.argv[2]);
const b = Number(process.argv[3]);

console.log(a + b);
```

Run

```bash
node app.js 10 20
```

Output

```text
30
```

---

# process.env ⭐⭐⭐⭐⭐

One of the **most important** features in Node.js.

Environment variables store configuration.

Example:

```text
DATABASE_URL

JWT_SECRET

PORT

API_KEY
```

Never hardcode these values.

---

# Why Environment Variables?

❌ Bad

```javascript
const password = "myPassword123";
```

If this code goes to GitHub...

Everyone can see it.

---

## Better

Create

```text
.env
```

```text
PORT=5000

DB_URL=mongodb://localhost/test

JWT_SECRET=mysecretkey
```

Load it (commonly using the `dotenv` package):

```javascript
require("dotenv").config();

console.log(process.env.PORT);
```

Output

```text
5000
```

---

# Visual

```text
.env File

↓

process.env

↓

Application
```

---

# process.cwd()

Current Working Directory

Suppose

```bash
cd myProject

node app.js
```

```javascript
console.log(process.cwd());
```

Output

```text
/project/myProject
```

This tells you **where the command was executed from**, which may differ from the location of the current source file.

---

# Difference

| `process.cwd()`           | `__dirname`                           |
| ------------------------- | ------------------------------------- |
| Current working directory | Directory containing the current file |

---

# Example

```text
project

├── src

│     app.js
```

If you execute:

```bash
cd project

node src/app.js
```

Then

```text
process.cwd()

↓

project
```

But

```text
__dirname

↓

project/src
```

Very common interview question.

---

# process.exit()

Stops the application.

```javascript
console.log("Start");

process.exit();

console.log("End");
```

Output

```text
Start
```

Application exits before printing `"End"`.

---

# Exit Codes

```javascript
process.exit(0);
```

Success

---

```javascript
process.exit(1);
```

Error

Conventionally:

| Code     | Meaning |
| -------- | ------- |
| 0        | Success |
| Non-zero | Error   |

---

# process.pid

Every running application has a Process ID.

```javascript
console.log(process.pid);
```

Output

```text
14236
```

Different every run.

---

# process.uptime()

How long has the application been running?

```javascript
console.log(process.uptime());
```

Output

```text
15.32
```

Seconds.

---

# process.memoryUsage()

Very useful for monitoring.

```javascript
console.log(process.memoryUsage());
```

Example Output

```javascript
{
  rss: 52000000,
  heapTotal: 9000000,
  heapUsed: 6500000,
  external: 1400000
}
```

---

# What Do These Mean?

| Property    | Meaning                                           |
| ----------- | ------------------------------------------------- |
| `rss`       | Total memory used by the process                  |
| `heapTotal` | Memory allocated for the V8 heap                  |
| `heapUsed`  | Heap memory currently in use                      |
| `external`  | Memory used outside the V8 heap (such as Buffers) |

---

# Process Events

Node emits events during its lifecycle.

---

## exit

```javascript
process.on("exit", (code) => {
    console.log("Application exiting:", code);
});
```

---

## SIGINT

Triggered when you press

```text
CTRL + C
```

```javascript
process.on("SIGINT", () => {
    console.log("Stopping...");
    process.exit(0);
});
```

---

## SIGTERM

Often sent by Docker, Kubernetes, or Linux when asking your app to shut down gracefully.

```javascript
process.on("SIGTERM", () => {
    console.log("Received SIGTERM");
    process.exit(0);
});
```

---

# Graceful Shutdown

Imagine your application has:

* Database connection
* Redis connection
* Log file
* HTTP server

Don't kill the process immediately.

Instead:

```text
Stop Accepting Requests

↓

Finish Current Requests

↓

Close Database

↓

Close Files

↓

Exit
```

This is called **Graceful Shutdown**.

---

# Professional Example

```javascript
process.on("SIGINT", () => {

    console.log("Closing Database...");

    console.log("Stopping Server...");

    process.exit(0);

});
```

Real production servers perform cleanup before exiting.

---

# Company Example — Express Server

```javascript
const server = app.listen(3000);

process.on("SIGTERM", () => {

    server.close(() => {

        console.log("Server Closed");

        process.exit(0);

    });

});
```

This allows existing requests to finish before the server exits.

---

# Company Example — Kubernetes

```text
Kubernetes

↓

SIGTERM

↓

Node Server

↓

Close Database

↓

Close HTTP Server

↓

Exit
```

This is standard behavior in modern cloud deployments.

---

# Company Example — Banking

Before shutting down:

```text
Save Logs

↓

Finish Transactions

↓

Close Database

↓

Exit
```

Critical systems cannot simply terminate abruptly.

---

# Interview Questions

## Q1. What is the `process` object?

**Best Answer**

> The `process` object is a global Node.js object that provides information and control over the current Node.js process.

---

## Q2. What is `process.argv`?

Returns the command-line arguments passed when starting the Node.js application.

---

## Q3. What is `process.env`?

An object containing the environment variables available to the application.

---

## Q4. Difference between `process.cwd()` and `__dirname`?

| `process.cwd()`   | `__dirname`              |
| ----------------- | ------------------------ |
| Working directory | Current file's directory |

---

## Q5. Why use `process.exit(0)`?

To terminate the process successfully after completing required work.

---

## Q6. Why handle `SIGTERM`?

To perform a graceful shutdown by cleaning up resources before the application exits.

---

# 🏢 Real Production Flow

```text
Application Starts

↓

Read process.env

↓

Connect Database

↓

Start Server

↓

SIGTERM

↓

Finish Requests

↓

Close Database

↓

Close Server

↓

process.exit(0)
```

---

# 🎯 HCL MERN Assessment Focus

Frequently asked topics include:

* What is the `process` object?
* `process.argv`
* `process.env`
* `process.cwd()` vs `__dirname`
* `process.exit()`
* `process.pid`
* `process.memoryUsage()`
* Graceful shutdown
* `SIGINT` and `SIGTERM`

---

# 🧠 Memory Trick

Think of your Node.js application as a **car**.

```text
🚗 Car Dashboard

Fuel        → process.memoryUsage()

Running Time → process.uptime()

Engine ID    → process.pid

GPS          → process.cwd()

Driver Input → process.argv()

Settings     → process.env()

Stop Engine  → process.exit()
```

The `process` object is your application's **dashboard and control panel**.

---

# 🎓 Node.js Progress

You've now completed **14 core Node.js topics**.

At this point, you have a solid understanding of the Node.js runtime and many of the concepts expected in MERN interviews.

---

# 🚀 Next Chapter

We'll move to **HTTP Module**, where you'll build a web server **without Express**.

You'll learn:

* What HTTP is
* Request (`req`) and Response (`res`)
* HTTP methods (`GET`, `POST`, `PUT`, `DELETE`)
* Status codes
* Headers
* Routing
* Building a REST API using only Node.js
* How Express is built on top of the HTTP module

Understanding the HTTP module is essential because **Express is essentially a higher-level framework built around Node's native HTTP capabilities**.
