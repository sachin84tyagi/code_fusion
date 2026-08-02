Excellent! 🎉

You've now reached one of the **most frequently used modules in Node.js**.

Almost every backend application—whether it's a Banking App, WhatsApp, Amazon, or Netflix—uses the **File System (fs) module**.

---

# 📂 Chapter 12 — File System (fs Module) Master Class

> **The `fs` module allows your Node.js application to interact with files and folders on your computer.**

Without `fs`, your application cannot:

* Read files
* Write files
* Create folders
* Delete files
* Upload files
* Save logs
* Generate reports

---

# 📚 Learning Roadmap

By the end of this chapter, you'll know:

* ✅ What is the File System?
* ✅ Why do we need `fs`?
* ✅ Synchronous vs Asynchronous operations
* ✅ Reading files
* ✅ Writing files
* ✅ Appending files
* ✅ Renaming files
* ✅ Deleting files
* ✅ Creating folders
* ✅ Reading directories
* ✅ Checking file existence
* ✅ File metadata
* ✅ Company examples
* ✅ Interview questions

---

# 👶 Level 1 — Child Explanation

Imagine your school bag.

Inside your bag you have:

```text
🎒 School Bag

📘 Math Book

📗 Science Book

📙 English Book

📓 Notebook
```

You can:

* Open a book
* Add a new notebook
* Remove an old notebook
* Rename a notebook

The **File System** works exactly the same way.

Folders are like bags.

Files are like books.

---

# 🏠 Real-Life Example

Imagine your house.

```text
🏠 Home

├── Bedroom

├── Kitchen

├── Study Room

│     ├── Notes.txt

│     ├── Homework.pdf

│     └── Photo.jpg
```

Node.js can:

* Read Notes.txt
* Delete Homework.pdf
* Rename Photo.jpg
* Create a new file
* Create a new folder

---

# What is `fs`?

`fs` stands for **File System**.

It is a **built-in Node.js module**.

No installation needed.

Import it like this:

```javascript
const fs = require("fs");
```

---

# Visual Diagram

```text
Node.js

↓

fs Module

↓

Computer Files

↓

Read / Write / Delete / Rename
```

---

# Two Ways to Work with Files

Node.js provides two styles.

## 1️⃣ Synchronous (Blocking)

```javascript
fs.readFileSync(...)
```

Node waits.

Nothing else happens.

```text
Read File

↓

Wait

↓

Continue
```

---

## 2️⃣ Asynchronous (Non-Blocking)

```javascript
fs.readFile(...)
```

Node continues doing other work.

```text
Read File

↓

Background

↓

Callback

↓

Continue
```

This is the preferred style for servers because it doesn't block other users.

---

# Reading a File (Async)

Suppose we have:

```text
hello.txt
```

Content:

```text
Hello Node.js
```

Code:

```javascript
const fs = require("fs");

fs.readFile("hello.txt", "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(data);
});
```

Output:

```text
Hello Node.js
```

---

# Understanding the Parameters

```javascript
fs.readFile(
    "hello.txt",
    "utf8",
    callback
);
```

| Parameter     | Meaning                     |
| ------------- | --------------------------- |
| `"hello.txt"` | File path                   |
| `"utf8"`      | Convert bytes to text       |
| `callback`    | Runs after reading finishes |

---

# Reading Without UTF-8

```javascript
fs.readFile("hello.txt", (err, data) => {
    console.log(data);
});
```

Output:

```text
<Buffer 48 65 6c 6c 6f ...>
```

Because files are read as **Buffers** by default.

---

# Synchronous Read

```javascript
const fs = require("fs");

const data = fs.readFileSync("hello.txt", "utf8");

console.log(data);
```

Simple.

But Node waits until reading completes.

---

# When Should You Use Sync?

Good:

* Small scripts
* Learning
* CLI tools

Avoid in:

* Express servers
* APIs
* High-traffic applications

Because one slow file can block every request.

---

# Writing a File

Create or overwrite a file.

```javascript
const fs = require("fs");

fs.writeFile(
    "notes.txt",
    "Welcome to Node.js!",
    (err) => {
        if (err) throw err;

        console.log("File saved.");
    }
);
```

Result:

```text
notes.txt

↓

Welcome to Node.js!
```

---

# Writing Synchronously

```javascript
fs.writeFileSync(
    "notes.txt",
    "Hello"
);
```

---

# Appending to a File

Suppose:

```text
notes.txt

Hello
```

Now:

```javascript
fs.appendFile(
    "notes.txt",
    "\nWelcome",
    (err) => {
        if (err) throw err;
    }
);
```

Result:

```text
Hello

Welcome
```

No existing content is lost.

---

# Renaming a File

Before:

```text
old.txt
```

Code:

```javascript
fs.rename(
    "old.txt",
    "new.txt",
    (err) => {
        if (err) throw err;
    }
);
```

After:

```text
new.txt
```

---

# Deleting a File

```javascript
fs.unlink(
    "notes.txt",
    (err) => {
        if (err) throw err;

        console.log("Deleted");
    }
);
```

---

# Creating a Folder

```javascript
fs.mkdir(
    "uploads",
    (err) => {
        if (err) throw err;
    }
);
```

Folder created:

```text
uploads/
```

---

# Reading Folder Contents

Suppose:

```text
documents/

resume.pdf

photo.jpg

notes.txt
```

Code:

```javascript
fs.readdir(
    "documents",
    (err, files) => {
        if (err) throw err;

        console.log(files);
    }
);
```

Output:

```text
[
 "resume.pdf",
 "photo.jpg",
 "notes.txt"
]
```

---

# File Information

```javascript
fs.stat(
    "hello.txt",
    (err, stats) => {
        if (err) throw err;

        console.log(stats.size);
    }
);
```

You can get:

* File size
* Created time
* Modified time
* Is file?
* Is directory?

Example:

```javascript
console.log(stats.isFile());
console.log(stats.isDirectory());
```

---

# Checking If a File Exists

Instead of checking separately, a common practice is:

```javascript
fs.readFile("hello.txt", (err, data) => {
    if (err) {
        console.log("File not found");
        return;
    }

    console.log(data.toString());
});
```

Attempt the operation and handle the error if it fails.

---

# Professional Flow

```text
Application

↓

fs Module

↓

Operating System

↓

Hard Disk / SSD

↓

File
```

---

# Company Example — Banking

Every login attempt is stored.

```text
User Login

↓

API

↓

fs.appendFile()

↓

logs.txt
```

Result:

```text
08:10 Login Success

08:12 Login Failed

08:20 Login Success
```

---

# Company Example — WhatsApp

User uploads

```text
photo.jpg
```

Server:

```text
Receive Upload

↓

fs.writeFile()

↓

Store Image

↓

Return Success
```

---

# Company Example — Report Generator

A company generates a daily report.

```text
Database

↓

Generate CSV

↓

fs.writeFile()

↓

sales-report.csv
```

---

# Interview Questions

## Q1. What is the `fs` module?

**Best Answer**

> `fs` is Node.js's built-in File System module used to interact with files and directories.

---

## Q2. Difference between `readFile()` and `readFileSync()`?

| readFile()            | readFileSync()             |
| --------------------- | -------------------------- |
| Asynchronous          | Synchronous                |
| Non-blocking          | Blocking                   |
| Preferred for servers | Suitable for scripts/tools |

---

## Q3. What is `appendFile()`?

Adds new content to the end of an existing file without overwriting it.

---

## Q4. What is `readdir()`?

Reads the names of files and folders inside a directory.

---

## Q5. What is `stat()`?

Returns metadata such as file size, timestamps, and whether the path is a file or directory.

---

# 🏢 Real Production Example (Express)

Imagine an API that saves user feedback.

```javascript
const fs = require("fs");

app.post("/feedback", (req, res) => {
    fs.appendFile(
        "feedback.txt",
        req.body.message + "\n",
        (err) => {
            if (err) {
                return res.status(500).send("Error");
            }

            res.send("Saved");
        }
    );
});
```

In real production systems, you'd usually store feedback in a database, but this example clearly demonstrates file operations.

---

# 🎯 HCL MERN Assessment Focus

Frequently asked questions include:

* What is the `fs` module?
* Difference between synchronous and asynchronous file operations.
* `readFile()` vs `readFileSync()`.
* `writeFile()` vs `appendFile()`.
* `mkdir()`, `rename()`, `unlink()`, `readdir()`, `stat()`.
* Why asynchronous file operations are preferred in web servers.

---

# 🧠 Memory Trick

Imagine a personal assistant:

```text
📁 File Cabinet

↓

📖 Read File

✍️ Write File

➕ Append

✏️ Rename

🗑️ Delete

📂 Create Folder
```

The `fs` module is your assistant that performs all these file operations for you.

---

# 🎓 Node.js Progress

You've now completed **12 major Node.js topics**, covering the foundation used in real-world backend development.

---

# 🚀 Next Chapter

We'll learn **Path Module (`path`)**, another essential built-in module.

You'll learn:

* `path.join()`
* `path.resolve()`
* `path.basename()`
* `path.dirname()`
* `path.extname()`
* `__dirname`
* `__filename`
* Cross-platform file paths (Windows vs Linux)
* Real-world Express usage
* Professional project structure

The `path` module is small, but it's used in almost every Express application to safely work with file and directory paths across different operating systems.
