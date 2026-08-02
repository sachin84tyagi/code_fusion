Welcome to **Chapter 4 — BSON**.

> **BSON is how MongoDB actually stores your data. You write JSON. MongoDB saves BSON. Understanding this makes you a better developer.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you write a letter in English.

You give it to a courier.

The courier encodes it in a special compact format for faster delivery.

```
You write:   "Hello Sachin, Age 25"

Courier converts:  0x48 0x65 0x6C 0x6C 0x6F ...
```

At the destination, it's decoded back to English.

You never see the courier's encoding.

You only deal with English.

That's exactly how BSON works.

You write JSON.

MongoDB stores BSON.

You read JSON.

---

# What is BSON?

**BSON = Binary JSON**

It is the binary-encoded serialization format used by MongoDB to store documents.

```
JSON  →  Human readable

BSON  →  Machine optimized (binary)
```

---

# JSON vs BSON

| Feature            | JSON                         | BSON                              |
| ------------------ | ---------------------------- | --------------------------------- |
| Format             | Text (readable)              | Binary (not human-readable)       |
| Speed              | Slower to parse              | Faster to parse                   |
| Size               | Smaller for simple data      | Slightly larger (includes types)  |
| Data types         | Limited (string, number, bool)| Rich types (Date, ObjectId, Binary)|
| Purpose            | Data exchange (APIs)         | Storage and internal use          |

---

# Why BSON Over JSON?

## 1. More Data Types

JSON only has:

```
string
number
boolean
null
object
array
```

BSON adds:

```
Date
ObjectId
Binary data
Decimal128 (precise decimals)
Regular Expression
Timestamp
32-bit and 64-bit integers
```

---

## 2. Faster Traversal

BSON includes length/size information for each element.

MongoDB can skip over elements it doesn't need.

Much faster than parsing the entire text.

---

## 3. Type Preservation

```javascript
// JSON loses type distinction:
{ "price": 99.99 }   // is this a float or integer?

// BSON preserves:
{ "price": Double(99.99) }
{ "count": Int32(100) }
```

---

# BSON Data Types

| BSON Type     | Description                           |
| ------------- | ------------------------------------- |
| `Double`      | 64-bit floating point                 |
| `String`      | UTF-8 string                          |
| `Object`      | Embedded document                     |
| `Array`       | Array of values                       |
| `Binary`      | Binary data (files, images)           |
| `ObjectId`    | 12-byte unique identifier             |
| `Boolean`     | `true` or `false`                     |
| `Date`        | 64-bit UTC datetime                   |
| `Null`        | Null value                            |
| `Regex`       | Regular expression                    |
| `Int32`       | 32-bit integer                        |
| `Int64`       | 64-bit integer                        |
| `Decimal128`  | High-precision decimal (financial)    |

---

# ObjectId — Most Important BSON Type

Every MongoDB document's `_id` is an `ObjectId` by default.

```javascript
ObjectId("64a1b2c3d4e5f6789abc1234")
```

12 bytes broken down:

```
Bytes 1-4:  Timestamp (seconds since epoch)
Bytes 5-7:  Machine identifier
Bytes 8-9:  Process ID
Bytes 10-12: Random counter
```

This means:

* Every ObjectId is globally unique
* You can extract the creation time from it

```javascript
const id = new mongoose.Types.ObjectId();
console.log(id.getTimestamp());
// 2024-07-29T00:00:00.000Z
```

---

# Date Type

In JSON, dates are just strings:

```json
{ "createdAt": "2024-07-29T10:00:00Z" }
```

In BSON, dates are native 64-bit integers (ms since epoch):

```javascript
{ createdAt: new Date() }
```

Sorting and comparing dates works perfectly.

---

# Do You Need to Write BSON?

**No.**

You always write JSON/JavaScript objects.

Mongoose and the MongoDB driver handle BSON conversion automatically.

```javascript
// You write:
await User.create({ name: "Sachin", createdAt: new Date() });

// MongoDB stores it as BSON internally
// Returns JSON when you query
```

---

# Company Example — Financial App

A banking application stores transaction amounts.

```javascript
// Regular number loses precision:
{ amount: 99999999999.99 }

// BSON Decimal128 preserves full precision:
const Decimal128 = mongoose.Types.Decimal128;
{ amount: Decimal128.fromString("99999999999.99") }
```

Decimal128 prevents floating-point errors in financial calculations.

---

# Company Example — File Upload

Storing small files directly in MongoDB:

```javascript
const doc = {
    filename: "profile.jpg",
    data: Buffer.from(imageBuffer),  // BSON Binary type
    contentType: "image/jpeg"
};

await File.create(doc);
```

BSON Binary type stores raw binary data efficiently.

---

# Interview Questions

## Q1. What is BSON?

**Best Answer**

> BSON (Binary JSON) is the binary-encoded serialization format used by MongoDB to store documents. It extends JSON with additional data types like ObjectId, Date, Binary, and Decimal128, and is optimized for speed and storage efficiency.

---

## Q2. What additional types does BSON provide over JSON?

ObjectId, Date, Binary, Decimal128, Int32, Int64, Regex — types that JSON doesn't natively support.

---

## Q3. What is an ObjectId?

A 12-byte BSON type used as the default `_id` in MongoDB. It encodes a timestamp, machine ID, process ID, and random counter, making it globally unique.

---

## Q4. Do developers interact with BSON directly?

No. Developers write JavaScript objects (JSON-like). The MongoDB driver converts to/from BSON automatically.

---

## Q5. Why is BSON faster than JSON?

BSON includes size/length information for fields, allowing MongoDB to skip irrelevant fields without parsing the entire document.

---

# Professional Summary

```
You write:    JavaScript / JSON
Driver converts: JSON → BSON
MongoDB stores:  BSON (binary, typed, fast)
You query:    BSON → JSON → JavaScript object
```

---

# 🧠 Memory Trick

```
BSON = Binary JSON

JSON  = English letter (human readable)
BSON  = Morse code (machine optimized)

You speak English.
Post office transmits in Morse.
Recipient reads English.
```

---

# 🚀 Next Chapter

We'll learn **CRUD in MongoDB** — all four fundamental database operations with real code examples using Mongoose.
