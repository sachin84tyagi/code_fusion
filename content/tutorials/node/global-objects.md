Excellent! 🎉

Now let's explore the **built-in global objects** that Node.js provides to every application automatically.

# Chapter 15 — Global Objects

> **Global Objects are always available in Node.js. You never need to `require()` them.**

These are the unsung heroes of every Node.js application.

---

# Learning Roadmap

By the end of this chapter, you'll know:

* ✅ What are Global Objects?
* ✅ `__dirname`
* ✅ `__filename`
* ✅ `global`
* ✅ `console`
* ✅ `setTimeout()` and `setInterval()`
* ✅ `setImmediate()`
* ✅ `clearTimeout()` and `clearInterval()`
* ✅ `process`
* ✅ `Buffer`
* ✅ `module` and `exports`
* ✅ Company Examples
* ✅ Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine your school.

Some things are always available everywhere.

```text
🏫 School

Blackboard    → Available in every class

Chalk         → Available in every class

Teacher       → Available in every class
```

You don't need to "import" the blackboard.

It is always there.

Node.js Global Objects work exactly the same way.

---

# What are Global Objects?

Global objects are variables, functions, and objects that are **automatically available** in every Node.js file.

You don't need to import them.

They are ready to use.

---

# Visual Diagram

```text
Node.js Application

        │

        ▼

Every File gets access to

        │

        ▼

Global Objects

__dirname

__filename

console

setTimeout

setInterval

process

Buffer

global
```

---

# 1️⃣ __dirname

The absolute path of the **current directory**.

```javascript
console.log(__dirname);
```

Output (Windows)

```text
C:\Projects\myapp
```

Output (Linux)

```text
/home/user/myapp
```

---

# Why Is It Useful?

Suppose you want to send a file.

```javascript
const path = require("path");

res.sendFile(path.join(__dirname, "public", "index.html"));
```

Always works correctly regardless of where Node is started from.

---

# 2️⃣ __filename

The absolute path of the **current file**.

```javascript
console.log(__filename);
```

Output

```text
C:\Projects\myapp\server.js
```

---

# Difference

| `__dirname`       | `__filename`            |
| ----------------- | ----------------------- |
| Current directory | Current file's full path |

---

# 3️⃣ global

Just like `window` in browsers, Node.js has `global`.

```javascript
global.myName = "Sachin";

console.log(myName);
```

Output

```text
Sachin
```

Variables added to `global` are accessible anywhere.

---

# Warning ⚠️

Avoid using `global` for sharing data between files.

It creates hard-to-find bugs.

Use proper modules instead.

---

# 4️⃣ console

Used for logging.

```javascript
console.log("Normal log");

console.error("Error message");

console.warn("Warning message");

console.table({ name: "Sachin", age: 25 });
```

Output

```text
Normal log

Error message

Warning message

┌─────────┬─────────┐
│ (index) │ Values  │
├─────────┼─────────┤
│  name   │ Sachin  │
│  age    │   25    │
└─────────┴─────────┘
```

---

# 5️⃣ setTimeout()

Runs a function after a delay.

```javascript
setTimeout(() => {
    console.log("After 2 seconds");
}, 2000);

console.log("Running...");
```

Output

```text
Running...

After 2 seconds
```

---

# 6️⃣ setInterval()

Runs a function repeatedly.

```javascript
setInterval(() => {
    console.log("Every 1 second");
}, 1000);
```

Output

```text
Every 1 second

Every 1 second

Every 1 second

...
```

---

# 7️⃣ clearTimeout() and clearInterval()

Stop timers.

```javascript
const timer = setTimeout(() => {
    console.log("This won't run");
}, 5000);

clearTimeout(timer);
```

Nothing prints.

---

Stop interval

```javascript
let count = 0;

const interval = setInterval(() => {
    count++;
    console.log(count);

    if (count === 3) {
        clearInterval(interval);
    }
}, 1000);
```

Output

```text
1

2

3
```

Stops at 3.

---

# 8️⃣ setImmediate()

Runs a callback after the current operation completes but before any `setTimeout()` timers.

```javascript
setImmediate(() => {
    console.log("Immediate");
});

console.log("Synchronous");
```

Output

```text
Synchronous

Immediate
```

---

# Comparison

```javascript
console.log("Start");

setTimeout(() => {
    console.log("Timeout");
}, 0);

setImmediate(() => {
    console.log("Immediate");
});

console.log("End");
```

Output (typical)

```text
Start

End

Immediate

Timeout
```

---

# 9️⃣ process

Already learned in the previous chapter.

```javascript
console.log(process.env.PORT);
```

Always globally available.

---

# 🔟 Buffer

Already learned in the Buffers chapter.

```javascript
const buf = Buffer.from("Hello");
```

Always globally available.

---

# 1️⃣1️⃣ module and exports

```javascript
module.exports = {
    name: "Sachin"
};
```

Always globally available.

---

# Company Example

Imagine a logging system.

```javascript
const logFile = require("path").join(__dirname, "logs.txt");

const fs = require("fs");

function log(message) {
    const line = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFileSync(logFile, line);
}

log("Server started");
```

The `__dirname` global ensures the log file is always saved in the right location regardless of where the process was started.

---

# Interview Questions

## Q1. What are Global Objects in Node.js?

**Answer**

> Global objects are built-in objects and variables available in every Node.js file without requiring any import.

---

## Q2. Difference between `global` in Node.js and `window` in browsers?

| `window`                     | `global`                   |
| ---------------------------- | -------------------------- |
| Browser's global object      | Node.js's global object    |
| `document`, `localStorage`  | `__dirname`, `__filename`  |

---

## Q3. What is `__dirname`?

Absolute path of the folder containing the current file.

---

## Q4. Difference between `setTimeout()` and `setImmediate()`?

| `setTimeout(fn, 0)`           | `setImmediate(fn)`                                  |
| ----------------------------- | --------------------------------------------------- |
| Waits for a minimum time      | Runs after current I/O callbacks in event loop      |

---

## Q5. What does `global.x = value` do?

Makes `x` accessible from any file in the Node.js process.

---

# Professional Best Practices

✅ Use `__dirname` for file paths.

✅ Use `console.error()` for errors (sends to stderr).

✅ Prefer `clearInterval()` when a timer is no longer needed to prevent memory leaks.

❌ Avoid polluting `global` with custom variables.

---

# 🧠 Memory Trick

Think of global objects as **office supplies on every desk**:

```text
🖊️ Pen          → console
📅 Calendar     → setTimeout / setInterval
📌 Pin Board    → global
📁 Current File → __filename
📂 Current Folder → __dirname
```

They're always there. You don't sign them out from storage. They just exist.

---

# 🚀 Next Chapter

We'll cover **Environment Variables** in depth, which is how production applications manage configuration securely across development, staging, and production environments.
