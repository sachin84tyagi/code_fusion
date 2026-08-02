Excellent! 🎉

Now we are entering one of the **most practical topics** in Node.js.

Every Node.js, Express, NestJS, React, Next.js project has this file.

```text
package.json
```

If you understand this file, you can understand **80% of any Node project**.

---

# 📦 Chapter 9 — package.json (Master Class)

## What You'll Learn

By the end of this chapter, you'll know:

* ✅ What is package.json?
* ✅ Why do we need it?
* ✅ Every important property
* ✅ Scripts
* ✅ Dependencies
* ✅ DevDependencies
* ✅ main
* ✅ type
* ✅ engines
* ✅ keywords
* ✅ author
* ✅ license
* ✅ Custom Scripts
* ✅ Production Best Practices
* ✅ Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you buy a toy.

The toy box has a sticker.

```
Robot Toy

Brand : LEGO

Age : 8+

Weight : 1kg

Made in : Denmark
```

Without opening the box,

you already know everything.

`package.json` is exactly that sticker.

It describes your project.

---

# Another Example 📕

Imagine a book.

First page contains

```
Book Name

Author

Version

Publisher

Language
```

That's exactly what package.json is.

---

# What is package.json?

It is a JSON file that describes your project.

It tells Node.js and npm:

* Project name
* Version
* Dependencies
* Scripts
* Entry point
* Module type
* License
* Author

Think of it as the **identity card** of your application.

---

# Creating package.json

Command

```bash
npm init
```

or

```bash
npm init -y
```

Creates

```text
package.json
```

---

# Default package.json

```json
{
  "name": "myapp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error\""
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Let's understand every property.

---

# 1️⃣ name

```json
"name":"ecommerce-api"
```

Project name.

Used when publishing to npm.

Rules

✅ Lowercase

✅ No spaces

Good

```text
inventory-api

user-service

mern-backend
```

Bad

```text
My Project

Inventory API
```

---

# 2️⃣ version

```json
"version":"1.0.0"
```

Every software has versions.

Example

```
1.0.0

↓

1.1.0

↓

1.2.0

↓

2.0.0
```

Version format

```
Major.Minor.Patch
```

Example

```
2.4.8

│ │ │

│ │ Bug Fix

│ New Feature

Breaking Change
```

---

# 3️⃣ description

```json
"description":"REST API for Ecommerce"
```

Only documentation.

No effect on code.

---

# 4️⃣ main

Very important.

```json
"main":"index.js"
```

Means

```
Application starts here.
```

Imagine your house.

Many rooms.

Where is the main entrance?

```
Front Door
```

That is

```json
main
```

---

Example

```text
project

│

├── server.js

├── app.js

├── routes
```

Then

```json
"main":"server.js"
```

---

# 5️⃣ scripts ⭐⭐⭐⭐⭐

This is one of the most important fields.

Example

```json
"scripts":{

"start":"node index.js"

}
```

Run

```bash
npm start
```

Actually executes

```bash
node index.js
```

---

Another

```json
"scripts":{

"dev":"nodemon index.js"

}
```

Run

```bash
npm run dev
```

Actually runs

```bash
nodemon index.js
```

---

# Custom Scripts

Example

```json
"scripts":{

"hello":"node hello.js"

}
```

Run

```bash
npm run hello
```

Node runs

```bash
node hello.js
```

You can name scripts almost anything meaningful.

---

# Professional Scripts

```json
"scripts":{

"start":"node server.js",

"dev":"nodemon server.js",

"test":"jest",

"lint":"eslint ."

}
```

Company developers use these every day.

---

# 6️⃣ dependencies

```json
"dependencies":{

"express":"^5.1.0",

"mongoose":"^8.0.0"

}
```

These packages are required in production.

---

Install

```bash
npm install express
```

Automatically updates

```json
dependencies
```

---

# 7️⃣ devDependencies

Development only.

```json
"devDependencies":{

"nodemon":"^3.0.0",

"eslint":"^9.0.0"

}
```

Not needed for production.

Install

```bash
npm install -D nodemon
```

---

# 8️⃣ type

Very important.

```json
"type":"module"
```

Means

Use ES Modules.

Then

```javascript
import express from "express";
```

Without

```json
"type":"module"
```

Use

```javascript
const express=require("express");
```

---

# 9️⃣ keywords

```json
"keywords":[

"node",

"express",

"mongodb"

]
```

Useful when publishing packages to npm.

---

# 🔟 author

```json
"author":"Sachin Tyagi"
```

Project creator.

---

# 1️⃣1️⃣ license

Example

```json
"license":"MIT"
```

Defines how others may use your software.

Common licenses include:

* MIT
* Apache-2.0
* ISC
* GPL

For personal learning projects, this often isn't critical, but for open-source projects it matters.

---

# 1️⃣2️⃣ engines

```json
"engines":{

"node":">=20"

}
```

Means

```
Requires Node.js 20 or newer.
```

Helpful for teams to avoid version mismatch.

---

# Real Company package.json

```json
{
  "name":"backend",

  "version":"1.0.0",

  "main":"server.js",

  "type":"commonjs",

  "scripts":{

    "start":"node server.js",

    "dev":"nodemon server.js",

    "test":"jest",

    "lint":"eslint ."

  },

  "dependencies":{

    "express":"^5.1.0",

    "mongoose":"^8.0.0",

    "dotenv":"^17.0.0",

    "jsonwebtoken":"^9.0.0"

  },

  "devDependencies":{

    "nodemon":"^3.0.0",

    "eslint":"^9.0.0"

  }
}
```

This is close to what you'll see in many real projects.

---

# Live Example

Suppose

package.json

```json
{
  "scripts":{

      "start":"node app.js",

      "dev":"nodemon app.js"

  }
}
```

Commands

```bash
npm start
```

↓

Runs

```bash
node app.js
```

---

Command

```bash
npm run dev
```

↓

Runs

```bash
nodemon app.js
```

---

# Visual Diagram

```
Developer

↓

npm run dev

↓

package.json

↓

scripts

↓

nodemon app.js

↓

Application Starts
```

---

# Company Example

Imagine an E-commerce company.

Developers don't remember long commands like:

```bash
node --inspect --trace-warnings server.js
```

Instead

package.json

```json
"scripts":{

"dev":"node --inspect server.js"

}
```

Now everyone simply runs:

```bash
npm run dev
```

Cleaner, consistent, and easier for teams.

---

# Interview Questions

## Q1 What is package.json?

**Best Answer**

> `package.json` is the manifest file of a Node.js project. It stores project metadata, dependencies, scripts, and configuration used by npm.

---

## Q2 Why do we need package.json?

* Project metadata
* Dependency management
* Custom scripts
* Version management

---

## Q3 Difference between start and dev?

Typical convention:

| start                      | dev                                              |
| -------------------------- | ------------------------------------------------ |
| Runs the production server | Runs the development server (often with nodemon) |

Note: These names are conventions. They work only if you define them in `scripts`.

---

## Q4 What does `main` do?

It specifies the default entry point of the package.

---

## Q5 What does `"type":"module"` do?

It tells Node.js to treat `.js` files as ES Modules by default, allowing `import`/`export` syntax.

---

# Professional Best Practices

✅ Keep only required packages.

✅ Use meaningful script names.

✅ Commit `package.json` and `package-lock.json` to Git.

❌ Never commit `node_modules`.

✅ Pin Node version using `engines` if your team depends on a specific version.

---

# 🎯 HCL MERN Assessment Focus

These are commonly asked:

* What is package.json?
* What is the purpose of scripts?
* Difference between `start` and `dev`.
* What is `main`?
* What is `type`?
* Difference between dependencies and devDependencies.
* What does `npm run` do?
* Why shouldn't `node_modules` be committed?

---

# 🧠 Memory Trick

Think of a Node.js project like a movie production:

```
🎬 Movie

├── Movie Name        → name

├── Version           → version

├── Director          → author

├── Main Actor        → main

├── Crew              → dependencies

├── Assistant Crew    → devDependencies

├── Shooting Plan     → scripts

└── Rules             → license
```

Just by reading the "movie information sheet," you know how the entire production is organized.

---

# 🚀 Next Chapter

We'll study **Streams**, one of the most powerful features of Node.js.

You'll learn:

* What are Streams?
* Why are Streams faster than `readFile()`?
* Readable Streams
* Writable Streams
* Duplex Streams
* Transform Streams
* Backpressure
* Piping (`pipe()`)
* Live file and video streaming examples
* Real-world use cases in Netflix, YouTube, and large-scale applications

This is one of the topics that separates a **beginner Node.js developer** from a **professional backend engineer** because it teaches how to process large amounts of data efficiently without exhausting memory.
