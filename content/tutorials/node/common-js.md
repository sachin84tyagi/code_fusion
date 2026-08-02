Excellent! 🎉

Now we're entering one of the **most confusing topics in Node.js**.

Almost every beginner gets confused between:

* `require()`
* `exports`
* `module.exports`
* CommonJS

After this chapter, you'll never confuse them again.

---

# Chapter 5 — CommonJS

> **Before learning `require()`, `exports`, and `module.exports`, you must first understand CommonJS.**

---

# Learning Roadmap

Today we'll learn:

1. What is CommonJS?
2. Why was it created?
3. How Node.js used JavaScript before ES Modules existed
4. How CommonJS works internally
5. Real company examples
6. Interview Questions

In the next chapters, we'll separately learn:

* `require()`
* `exports`
* `module.exports`

---

# 👶 Level 1 — Child Explanation

Imagine you and your friends are building a robot.

Rahul builds the head.

```text
Head
```

Amit builds the body.

```text
Body
```

Neha builds the legs.

```text
Legs
```

Finally

Someone joins all parts.

```text
Head
   │
Body
   │
Legs

↓

Robot
```

This is exactly what CommonJS does.

It allows many JavaScript files to work together.

---

# Before CommonJS Existed

Imagine writing an entire application in ONE file.

```javascript
// app.js

// Login Code

// Database Code

// Email Code

// Payment Code

// Cart Code

// Search Code

// Products Code

// Reviews Code

// Reports Code

// Analytics Code

// 25,000 lines...
```

Nightmare.

---

Companies wanted

```text
login.js

database.js

payment.js

email.js

cart.js
```

But JavaScript had no official way to connect files.

So developers created

# CommonJS

---

# What is CommonJS?

CommonJS is simply

> **A module system.**

It defines rules for

* Exporting code
* Importing code

Think of it like grammar.

English has grammar.

JavaScript has syntax.

Node.js had CommonJS.

---

# Real Life Example 📚

Imagine a library.

Each shelf has books.

```text
Shelf A

Math

Physics

Chemistry
```

Need Math?

You don't take the entire library.

You only take

```text
Math
```

Exactly what CommonJS does.

---

# Two Important Rules

Every CommonJS module follows two rules.

## Rule 1

Export something

```javascript
module.exports = ...
```

---

## Rule 2

Import it

```javascript
require(...)
```

That's all.

Everything else builds on these two ideas.

---

# Visual Diagram

```text
math.js

↓

module.exports

↓

require()

↓

app.js
```

Simple.

---

# Example

math.js

```javascript
function add(a,b){
    return a+b;
}

module.exports = add;
```

---

app.js

```javascript
const add = require("./math");

console.log(add(10,5));
```

Output

```text
15
```

---

# What Happens Internally?

Suppose

```javascript
require("./math")
```

Node performs these steps.

---

Step 1

Find the file.

```text
math.js
```

---

Step 2

Read the file.

```javascript
function add(a,b){
return a+b;
}
```

---

Step 3

Wrap the file.

This surprises many developers.

Node does **NOT** execute your file directly.

It secretly wraps it.

Internally Node transforms

```javascript
function add(a,b){
return a+b;
}
```

into something similar to

```javascript
(function(exports, require, module, __filename, __dirname){

function add(a,b){
return a+b;
}

});
```

Every module gets its own private scope.

---

# Why Wrap Modules?

Imagine

Two files

```text
math.js

login.js
```

Both contain

```javascript
const name = "Sachin";
```

Will they conflict?

No.

Because each file has its own wrapper function and therefore its own scope.

---

# Module Scope

Example

math.js

```javascript
const secret = "ABC123";

module.exports = {};
```

app.js

```javascript
require("./math");

console.log(secret);
```

Output

```text
ReferenceError
```

Why?

Because `secret` belongs only to `math.js`.

It is private.

---

# Company Example

Imagine Amazon.

Payment team

```text
payment.js
```

contains

```javascript
const apiKey = "...";
```

Search team

```text
search.js
```

cannot accidentally use it unless it is explicitly exported.

This improves security and keeps modules independent.

---

# CommonJS Flow

```text
Developer

↓

Writes module

↓

module.exports

↓

Node wraps module

↓

Module Cache

↓

require()

↓

Return exported object
```

---

# Why CommonJS Became Popular

Because it is

✅ Simple

✅ Fast

✅ Easy to understand

✅ Perfect for server-side applications

That's why early Node.js adopted it.

---

# Then Why ES Modules?

Years later JavaScript introduced an official module system.

Instead of

```javascript
const math = require("./math");
```

we can now write

```javascript
import math from "./math.js";
```

Instead of

```javascript
module.exports = math;
```

we write

```javascript
export default math;
```

Today Node.js supports both, depending on project configuration.

---

# CommonJS vs ES Modules

| CommonJS            | ES Modules           |
| ------------------- | -------------------- |
| require()           | import               |
| module.exports      | export               |
| Synchronous loading | Static module syntax |
| Older Node projects | Modern JavaScript    |

---

# Mini Project

logger.js

```javascript
function log(message){
    console.log("[LOG]", message);
}

module.exports = log;
```

---

app.js

```javascript
const log = require("./logger");

log("Server Started");
```

Output

```text
[LOG] Server Started
```

---

# Interview Questions

### Q1. What is CommonJS?

**Best Answer**

> CommonJS is the module system originally adopted by Node.js. It defines how JavaScript files export functionality and import functionality using `module.exports` and `require()`.

---

### Q2. Why was CommonJS created?

Answer

Because JavaScript originally had no built-in module system for sharing code between files.

---

### Q3. Does every file become a module?

✅ Yes.

Every `.js` file loaded as CommonJS becomes its own module.

---

### Q4. Does Node execute modules directly?

No.

Node wraps each module in a function before execution.

Conceptually:

```javascript
(function (exports, require, module, __filename, __dirname) {
  // Your module code
});
```

---

### Q5. Why doesn't one file's variable affect another?

Because each module has its own private scope created by the wrapper function.

---

# Professional Summary

```text
Developer
    │
    ▼
Create math.js
    │
    ▼
Node wraps module
    │
    ▼
Private Scope Created
    │
    ▼
module.exports
    │
    ▼
Module Cache
    │
    ▼
require()
    │
    ▼
Application Uses Module
```

---

# 🧠 HCL MERN Assessment Focus

Common questions include:

* What is CommonJS?
* Why was CommonJS introduced?
* Difference between CommonJS and ES Modules.
* Why are module variables private?
* What is the purpose of Node's module wrapper?

---

# 🎯 Next Chapter (Very Important)

Now that you understand **why CommonJS exists**, we're ready for the most practical topic in Node.js:

# **Chapter 6 — `require()`**

We'll cover:

* What `require()` really does internally
* Relative vs absolute paths
* Loading built-in modules
* Loading custom modules
* Loading third-party modules
* Module resolution algorithm
* Caching behavior
* Circular dependencies
* Common interview questions

By the end of that chapter, you'll understand exactly what happens every time you write:

```javascript
const express = require("express");
```

—not just how to use it, but what Node.js does behind the scenes.
