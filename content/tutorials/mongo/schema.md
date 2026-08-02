Welcome to **Chapter 13 — Schema**.

> **Schema is the blueprint of your data. It defines what fields exist, what types they are, and what rules they must follow.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you're building a house.

Before construction, the architect draws a blueprint.

```
Blueprint defines:
  - How many rooms
  - Where the kitchen is
  - Minimum room size
  - Required features (bathroom, door)
```

No builder can deviate from the blueprint.

A Mongoose **Schema** is the blueprint for your documents.

---

# What is a Schema?

A Schema defines:

1. **Fields** — what data can be stored
2. **Types** — what type each field must be
3. **Validation** — rules the data must satisfy
4. **Defaults** — values when not provided
5. **Indexes** — which fields are indexed

---

# Basic Schema

```javascript
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    inStock: Boolean
});
```

Simple. But lacks validation.

---

# Full Schema with Validation

```javascript
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [100, "Name cannot exceed 100 characters"]
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    category: {
        type: String,
        required: true,
        enum: {
            values: ["electronics", "clothing", "food", "books"],
            message: "{VALUE} is not a valid category"
        }
    },
    description: {
        type: String,
        default: "No description available"
    },
    inStock: {
        type: Boolean,
        default: true
    },
    tags: [String],
    ratings: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });
```

---

# Schema Validation Options

| Validator    | Type    | Example                                  |
| ------------ | ------- | ---------------------------------------- |
| `required`   | Any     | `required: true`                         |
| `min`        | Number  | `min: 0`                                 |
| `max`        | Number  | `max: 100`                               |
| `minlength`  | String  | `minlength: 3`                           |
| `maxlength`  | String  | `maxlength: 50`                          |
| `enum`       | String  | `enum: ["admin", "user"]`                |
| `match`      | String  | `match: /^[\w]+@[\w]+\.com$/`            |
| `unique`     | Any     | `unique: true`                           |
| `trim`       | String  | `trim: true`                             |
| `lowercase`  | String  | `lowercase: true`                        |
| `uppercase`  | String  | `uppercase: true`                        |
| `default`    | Any     | `default: Date.now`                      |

---

# Nested Schema (Embedded Document)

```javascript
const addressSchema = new mongoose.Schema({
    street: String,
    city: { type: String, required: true },
    state: String,
    pincode: { type: String, match: /^\d{6}$/ }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    address: addressSchema
});
```

---

# Array of Embedded Documents

```javascript
const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, min: 1, required: true },
    price: Number
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [orderItemSchema],
    totalAmount: Number,
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    }
}, { timestamps: true });
```

---

# Custom Validators

```javascript
const userSchema = new mongoose.Schema({
    age: {
        type: Number,
        validate: {
            validator: function(v) {
                return v >= 18 && v <= 120;
            },
            message: props => `${props.value} is not a valid age`
        }
    },
    phone: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: "Phone must be 10 digits"
        }
    }
});
```

---

# Schema Options

```javascript
const userSchema = new mongoose.Schema({
    name: String
}, {
    timestamps: true,           // Add createdAt, updatedAt
    collection: "myUsers",      // Custom collection name
    versionKey: false,          // Remove __v field
    strict: true,               // Ignore extra fields
    toJSON: { virtuals: true }, // Include virtuals in JSON output
    toObject: { virtuals: true }
});
```

---

# Schema Indexes

```javascript
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });
```

---

# Company Example — Product Catalog

```javascript
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    sku: { type: String, unique: true, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, min: 0, max: 100, default: 0 },
    category: { type: String, required: true },
    brand: String,
    images: [String],
    specifications: mongoose.Schema.Types.Mixed,
    inventory: {
        quantity: { type: Number, default: 0, min: 0 },
        warehouse: String
    },
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: "text" });
```

---

# Interview Questions

## Q1. What is a Mongoose Schema?

**Best Answer**

> A Schema in Mongoose defines the structure, data types, validation rules, and defaults for documents in a MongoDB collection. It acts as a blueprint that every document must conform to.

---

## Q2. How do you define a required field?

```javascript
{ type: String, required: [true, "Name is required"] }
```

---

## Q3. What does `timestamps: true` do?

Automatically adds `createdAt` and `updatedAt` fields managed by Mongoose.

---

## Q4. What is `enum` validation?

Restricts a field to a predefined list of allowed values:

```javascript
{ type: String, enum: ["admin", "user", "moderator"] }
```

---

## Q5. What is `strict: true`?

(Default) Extra fields not defined in the schema are ignored and not saved to the database.

---

# Professional Summary

```
Schema = Blueprint

new mongoose.Schema({
    field: {
        type: Type,
        required: true,
        default: value,
        validate: fn,
        enum: [...],
        min/max: n,
        unique: true
    }
}, { timestamps: true })

↓

mongoose.model("Name", schema) → Model
```

---

# 🧠 Memory Trick

```
Schema = Job Application Form

The form defines:
  - Name (required, String)
  - Email (required, unique)
  - Age (Number, min: 18)
  - Role (enum: ["dev", "designer"])

You cannot submit without filling required fields.
You cannot submit invalid values.
```

---

# 🚀 Next Chapter

We'll learn **populate()** — how Mongoose automatically fetches referenced documents and replaces ObjectIds with full objects.
