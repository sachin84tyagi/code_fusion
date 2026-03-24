## 🧠 JavaScript Data Types — Complete, Clear & Practical Guide

JavaScript has **2 main categories of data types**:

1. Primitive (simple, single values)
2. Non-Primitive (complex, collections)

![data-types](/images/data-types.png)
---

# 🔹 1. Primitive Data Types

👉 Stored **by value** (copy is created when assigned)

## ✅ 1. Number

Represents all numbers (integers + decimals)

```js
let age = 25;
let price = 99.99;
```

**Real-world:** price, age, quantity

⚠️ **Common mistake:**

```js
console.log(0.1 + 0.2); // 0.30000000000000004 ❌
```

✔️ Fix:

```js
console.log((0.1 + 0.2).toFixed(2)); // "0.30"
```

---

## ✅ 2. String

Text data (written in quotes)

```js
let name = "Sachin";
let message = 'Hello World';
```

**Real-world:** usernames, messages

✔️ Best Practice (Template Strings):

```js
let user = "Sachin";
console.log(`Welcome ${user}`); // cleaner
```

---

## ✅ 3. Boolean

Only `true` or `false`

```js
let isLoggedIn = true;
```

**Real-world:** login status, conditions

---

## ✅ 4. Undefined

Variable declared but not assigned

```js
let x;
console.log(x); // undefined
```

⚠️ Mistake: Confusing with `null`

---

## ✅ 5. Null

Intentional empty value

```js
let data = null;
```

**Real-world:** "No value yet"

---

## ✅ 6. BigInt

For very large numbers

```js
let big = 123456789012345678901234567890n;
```

---

## ✅ 7. Symbol

Unique identifiers (used in advanced cases)

```js
let id = Symbol("id");
```

**Real-world:** object property uniqueness

---

# 🔹 2. Non-Primitive Data Types

👉 Stored **by reference** (memory address)

---

## ✅ 1. Object

Collection of key-value pairs

```js
let user = {
  name: "Sachin",
  age: 25
};
```

**Real-world:** user profiles, configs

---

## ✅ 2. Array

Ordered list of values

```js
let fruits = ["apple", "banana", "mango"];
```

**Real-world:** lists, items, products

---

## ✅ 3. Function

Reusable block of code

```js
function greet() {
  return "Hello!";
}
```

**Real-world:** actions (login, calculate, fetch)

---

# 🔥 Primitive vs Non-Primitive (IMPORTANT)

```js
// Primitive (copy)
let a = 10;
let b = a;
b = 20;

console.log(a); // 10 ✅


// Non-Primitive (reference)
let obj1 = { name: "Sachin" };
let obj2 = obj1;

obj2.name = "Tyagi";

console.log(obj1.name); // "Tyagi" ❌ (changed!)
```

---

# ⚠️ Common Mistakes

### ❌ 1. typeof null

```js
console.log(typeof null); // "object" (JS bug)
```

---

### ❌ 2. Array is Object

```js
typeof [] // "object"
```

✔️ Correct way:

```js
Array.isArray([]); // true
```

---

### ❌ 3. Comparing Objects

```js
{} === {} // false ❌
```

✔️ Because references differ

---

# ✅ Best Practices

✔️ Use `const` by default
✔️ Use `===` instead of `==`
✔️ Use meaningful variable names
✔️ Prefer template literals (`)
✔️ Avoid unnecessary mutation of objects

---

# 🧾 Final Summary

| Type      | Category      | Example        |
| --------- | ------------- | -------------- |
| Number    | Primitive     | `10`, `99.9`   |
| String    | Primitive     | `"Hello"`      |
| Boolean   | Primitive     | `true`         |
| Undefined | Primitive     | `let x;`       |
| Null      | Primitive     | `null`         |
| BigInt    | Primitive     | `123n`         |
| Symbol    | Primitive     | `Symbol()`     |
| Object    | Non-Primitive | `{}`           |
| Array     | Non-Primitive | `[]`           |
| Function  | Non-Primitive | `function(){}` |

---

# 🎯 Key Takeaway

👉 **Primitive = simple & copied**
👉 **Non-Primitive = complex & referenced**




# 🧠 JavaScript Data Types — ASCII Master Diagram

```
                    ┌──────────────────────────────┐
                    │      JAVASCRIPT TYPES        │
                    └──────────────┬───────────────┘
                                   │
                 ┌─────────────────┴─────────────────┐
                 │                                   │
        ┌────────▼────────┐                ┌─────────▼─────────┐
        │   PRIMITIVE      │                │   NON-PRIMITIVE    │
        │ (VALUE TYPES)    │                │ (REFERENCE TYPES)  │
        └────────┬────────┘                └─────────┬─────────┘
                 │                                   │
     ┌───────────┼───────────┐           ┌───────────┼──────────────┐
     │           │           │           │           │              │
 ┌───▼───┐   ┌───▼────┐  ┌───▼────┐  ┌───▼────┐  ┌───▼────┐   ┌────▼────┐
 │string │   │number  │  │boolean │  │object  │  │array   │   │function │
 └───────┘   └────────┘  └────────┘  └────────┘  └────────┘   └─────────┘
     │
     ├───────────────┬───────────────┬───────────────┐
     │               │               │               │
 ┌───▼────┐    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
 │null    │    │undefined  │   │symbol     │   │bigint     │
 └────────┘    └───────────┘   └───────────┘   └───────────┘
```

---

# 🔹 MEMORY MODEL (MOST IMPORTANT)

```
PRIMITIVE → Stored in STACK (Direct Value)

   let a = 10
   let b = a

   STACK
   ┌───────┐
   │ a:10  │
   │ b:10  │   ← COPY created
   └───────┘


NON-PRIMITIVE → Stored in HEAP (Reference Pointer in Stack)

   let obj1 = {name:"JS"}
   let obj2 = obj1

   STACK                  HEAP
   ┌─────────────┐        ┌──────────────┐
   │ obj1 → 0x1 ─────────► {name:"JS"}   │
   │ obj2 → 0x1 ─────────► (same object) │
   └─────────────┘        └──────────────┘
```

👉 Primitive = Copy
👉 Non-Primitive = Reference

---

# 🔹 MUTABILITY

```
PRIMITIVE → IMMUTABLE
--------------------------------
let a = "hello"
a[0] = "H"   ❌ not possible

NEW value created instead


NON-PRIMITIVE → MUTABLE
--------------------------------
let obj = {name:"JS"}
obj.name = "NextJS"   ✅ allowed
```

---

# 🔹 COMPARISON (===)

```
PRIMITIVE → VALUE COMPARISON
--------------------------------
10 === 10        → true
"JS" === "JS"    → true


NON-PRIMITIVE → REFERENCE COMPARISON
--------------------------------
{} === {}        → false
[] === []        → false

let a = {}
let b = a
a === b          → true
```

---

# 🔹 TYPEOF RESULT (INTERVIEW GOLD)

```
typeof "JS"        → "string"
typeof 10          → "number"
typeof true        → "boolean"
typeof undefined   → "undefined"
typeof null        → "object"   ⚠️ JS Bug
typeof Symbol()    → "symbol"
typeof 10n         → "bigint"

typeof {}          → "object"
typeof []          → "object"
typeof function(){}→ "function"
```

---

# 🔹 PASS BY VALUE vs REFERENCE

```
PRIMITIVE → PASS BY VALUE
--------------------------------
function change(x){
  x = 20
}
let a = 10
change(a)
a → 10   (unchanged)


NON-PRIMITIVE → PASS BY REFERENCE (actually pass by sharing)
--------------------------------
function change(obj){
  obj.name = "NextJS"
}
let user = {name:"JS"}
change(user)
user.name → "NextJS"
```

---

# 🔹 COPYING

```
PRIMITIVE → SIMPLE COPY
let a = 10
let b = a


NON-PRIMITIVE → SHALLOW vs DEEP

SHALLOW COPY
let b = {...a}
let b = Object.assign({}, a)

DEEP COPY
structuredClone(a)
JSON.parse(JSON.stringify(a))
```

---

# 🔹 FREEZE vs CONST

```
const obj = {name:"JS"}

obj = {}          ❌ not allowed
obj.name="Next"   ✅ allowed


Object.freeze(obj)

obj.name="Next"   ❌ blocked
```

---

# 🔹 NEXT.JS / REACT REAL-WORLD USAGE

## Rendering Optimization

```
Primitive change → triggers re-render (simple)

Object/Array change → must create NEW reference

❌ WRONG
state.user.name="Next"

✅ CORRECT
setUser({...user, name:"Next"})
```

## React Dependency Comparison

```
useEffect(() => {}, [obj])

Primitive → stable compare
Object → reference compare → may re-run

Use:
useMemo
useCallback
```

---

# 🔹 COMPLETE DIFFERENCE TABLE

```
┌───────────────┬──────────────────────┬──────────────────────┐
│ FEATURE       │ PRIMITIVE            │ NON-PRIMITIVE        │
├───────────────┼──────────────────────┼──────────────────────┤
│ Stored In     │ Stack                │ Heap                 │
│ Copy          │ By Value             │ By Reference         │
│ Mutable       │ No                   │ Yes                  │
│ Compare       │ Value                │ Reference            │
│ Speed         │ Faster               │ Slight slower        │
│ Memory        │ Less                 │ More                 │
│ typeof        │ Actual type          │ object/function      │
│ JSON          │ Direct               │ Serialized           │
│ React Render  │ Easy                 │ Need new reference   │
└───────────────┴──────────────────────┴──────────────────────┘
```

---

# 🔹 INTERVIEW TRAPS (IMPORTANT)

```
1. typeof null → "object"
2. [] === [] → false
3. {} === {} → false
4. const object still mutable
5. Object.assign → shallow copy
6. Spread → shallow copy
7. JSON deep copy loses:
   - functions
   - undefined
   - symbol
   - bigint
```

---

# 🔹 FINAL BRAIN MAP

```
PRIMITIVE → string | number | boolean | null | undefined | symbol | bigint
           → Immutable
           → Value Copy
           → Fast

NON-PRIMITIVE → object | array | function | map | set | date | regex
               → Mutable
               → Reference Copy
               → Powerful
```
