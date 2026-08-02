Excellent! 🎉

Now we are entering the topic that every Node.js developer writes **hundreds of times every day**.

```javascript
const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
```

Have you ever wondered...

> **What actually happens when you write `require()`?**

Today you'll know exactly.

---

# Chapter 6 — require()

> **If CommonJS is the language, then `require()` is the "Import" command.**

---

# Learning Roadmap

By the end of this chapter, you'll understand:

* ✅ What is `require()`?
* ✅ Why do we need it?
* ✅ How it works internally
* ✅ Loading Built-in Modules
* ✅ Loading Custom Modules
* ✅ Loading Third-party Modules
* ✅ Relative vs Absolute Paths
* ✅ Module Resolution Algorithm
* ✅ Module Cache
* ✅ Circular Dependencies
* ✅ Professional Best Practices
* ✅ Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine your mother says:

> "Go bring the Mathematics book."

You go to the bookshelf.

Find the Math book.

Bring it.

That's exactly what `require()` does.

It says:

> "Go find this module and bring it to me."

---

# Real Life Example 📚

Imagine your house.

```
Kitchen

Bedroom

Bathroom

Library
```

You are sitting in the bedroom.

You need a spoon.

You don't rebuild a spoon.

You go to the kitchen and bring it.

That's exactly what require() does.

---

# What is require()?

Definition

> `require()` is a function that loads another module and returns whatever that module exports.

Simple.

---

# First Example

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

console.log(add(5,8));
```

Output

```
13
```

---

# What Happens Internally?

Suppose

```javascript
const add = require("./math");
```

Node performs these steps.

---

## Step 1

Read

```javascript
require("./math")
```

---

## Step 2

Find the file.

```
math.js
```

---

## Step 3

Read file.

```javascript
function add(a,b){
return a+b;
}
```

---

## Step 4

Execute file.

---

## Step 5

Take

```javascript
module.exports
```

---

## Step 6

Return it.

So

```javascript
const add = require("./math");
```

becomes

```javascript
const add = function(a,b){

return a+b;

}
```

---

# Visual Diagram

```
app.js

↓

require("./math")

↓

Find File

↓

Read File

↓

Execute

↓

module.exports

↓

Return Object
```

---

# Types of require()

There are three major types.

---

# 1. Built-in Module

Node already provides them.

Example

```javascript
const fs = require("fs");

const path = require("path");

const http = require("http");
```

Nothing to install.

---

Example

```javascript
const os = require("os");

console.log(os.platform());
```

Output

```
win32
```

(or linux, darwin)

---

# 2. Custom Module

Created by you.

```
calculator.js
```

```javascript
function square(x){

return x*x;

}

module.exports = square;
```

---

Use

```javascript
const square = require("./calculator");

console.log(square(9));
```

Output

```
81
```

---

# 3. Third-party Module

Created by others.

Install

```bash
npm install express
```

Use

```javascript
const express = require("express");
```

Express is not inside Node.

Node searches inside

```
node_modules
```

---

# Relative Path

Notice

```javascript
require("./math")
```

Why `./`?

Because

```
.

means

Current Folder
```

Example

```
project

│

├── app.js

└── math.js
```

app.js

```javascript
require("./math")
```

works.

---

# Parent Folder

```
..
```

means

Parent Folder

Example

```
project

│

├── utils

│      math.js

│

└── src

       app.js
```

Inside app.js

```javascript
require("../utils/math")
```

because

```
..

↓

Go back one folder
```

---

# Module Resolution

This is VERY IMPORTANT.

Suppose

```javascript
require("express")
```

Node searches in this order.

```
Built-in?

↓

No

↓

node_modules?

↓

Found?

↓

Load

↓

Not Found?

↓

Error
```

---

Now

```javascript
require("./math")
```

Node searches

```
Current Folder

↓

math.js

↓

math.json

↓

math.node
```

If not found

Error.

---

# Live Demo

Suppose

```javascript
require("./student");
```

Folder

```
student.js
```

exists.

Node loads

```
student.js
```

Automatically.

No need to write

```javascript
require("./student.js")
```

---

# Module Cache

This surprises everyone.

Suppose

```javascript
require("./math");

require("./math");

require("./math");
```

Does Node execute the file three times?

No.

Only once.

---

Example

math.js

```javascript
console.log("Math Loaded");

module.exports={};
```

app.js

```javascript
require("./math");

require("./math");

require("./math");
```

Output

```
Math Loaded
```

Only one time.

---

# Why Cache?

Imagine

Database connection.

Without cache

```
1000 Users

↓

1000 Connections
```

Terrible.

With cache

```
Database

↓

One Connection

↓

Reuse
```

Much faster.

---

# Circular Dependency

Imagine

```
A requires B

↓

B requires A
```

Problem.

Example

```
A

↓

B

↓

A

↓

B

↓

A

↓

...
```

This is called

**Circular Dependency**

Node handles it by returning partially initialized exports, but it can lead to unexpected behavior. In production code, it's best to redesign modules to avoid circular dependencies.

---

# Company Example

Imagine Amazon.

```
Order Service

↓

Inventory Service

↓

Email Service

↓

Payment Service
```

Every service imports only the modules it needs.

Not the whole project.

---

# require() with JSON

Node can even load JSON.

config.json

```json
{
    "port":5000
}
```

app.js

```javascript
const config = require("./config.json");

console.log(config.port);
```

Output

```
5000
```

---

# Common Mistakes

## Wrong

```javascript
require("math")
```

Node thinks it is a built-in or third-party package.

---

Correct

```javascript
require("./math")
```

---

Wrong

```javascript
require("./utils")
```

when

```
utils.js
```

doesn't exist.

---

Wrong Path

```
project

│

├── app.js

└── helper

       math.js
```

Wrong

```javascript
require("./math")
```

Correct

```javascript
require("./helper/math")
```

---

# Interview Questions

## Q1. What is require()?

**Best Answer**

> `require()` is a CommonJS function that loads a module, executes it if needed, caches it, and returns its exported value.

---

## Q2. Does require() execute a module every time?

No.

It executes only once.

After that

Module Cache.

---

## Q3. Why use "./"?

It tells Node to look in the current directory instead of searching built-in modules or `node_modules`.

---

## Q4. Difference

```javascript
require("express")
```

vs

```javascript
require("./math")
```

Answer

| require("express")                             | require("./math")                     |
| ---------------------------------------------- | ------------------------------------- |
| Searches built-in modules, then `node_modules` | Searches relative to the current file |

---

## Q5. What happens if module isn't found?

Node throws

```text
Error: Cannot find module '...'
```

---

# Professional Summary

```
Developer

↓

require()

↓

Resolve Path

↓

Find Module

↓

Read File

↓

Execute

↓

module.exports

↓

Cache Module

↓

Return Exports
```

---

# 🏆 Real Production Example (Express Server)

```javascript
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

app.listen(3000, () => {
    console.log("Server Started");
});
```

Here, every `require()` brings one reusable module into your application, making your code clean and modular.

---

# 🎯 HCL MERN Assessment Focus

These are the most commonly asked `require()` questions:

* What is `require()`?
* How does `require()` work internally?
* What is module caching?
* Difference between `require("express")` and `require("./math")`.
* Why do we use `./`?
* What is the module resolution algorithm?
* What happens if a module cannot be found?

---

# 📚 Next Chapter (One of the Most Confusing)

Now we're ready for the topic that confuses almost every Node.js beginner:

# **Chapter 7 — `exports` vs `module.exports`**

We'll learn:

* Why both exist.
* How they are related.
* When to use `exports`.
* When to use `module.exports`.
* Common mistakes that break applications.
* Live coding examples.
* Internal implementation inside Node.js.
* Professional best practices used in real-world projects.

This is one of the highest-value Node.js concepts because understanding it prevents many subtle bugs in larger applications.
