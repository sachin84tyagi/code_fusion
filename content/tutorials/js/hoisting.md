# 🎯 JavaScript Hoisting — Complete Guide

---

## 1. Hoisting

Hoisting = JavaScript moves **declarations** to the top of their scope during the **memory creation phase**.

* Only **declarations are hoisted**
* **Assignments are NOT hoisted**

### Example:

```js
var a;
```

### During hoisting:

```js
a = undefined;
```

### Summary:

* Hoisted + Initialized → `undefined`
* Hoisted but NOT initialized → ❌ Temporal Dead Zone (TDZ)

---

### Example 1

```js
console.log(a); // undefined
var a = 10;
```

### Memory Phase:

```js
var a = undefined;
```

### Execution Phase:

```js
a = 10;
```

| Keyword | Hoisted | Initialized | Scope    |
| ------- | ------- | ----------- | -------- |
| var     | ✅ Yes   | undefined   | Function |

---

### Example 2

```js
console.log(a); // ❌ ReferenceError
let a = 10;
```

### Why?

It is hoisted but inside **Temporal Dead Zone (TDZ)**

**TDZ = Time between hoisting and initialization**

| Keyword | Hoisted | Initialized | Scope |
| ------- | ------- | ----------- | ----- |
| let     | ✅ Yes   | ❌ No        | Block |

---

## 2. Hoisting by Keyword (Critical Table)

| Keyword  | Hoisted | Initialized | Scope    |
| -------- | ------- | ----------- | -------- |
| var      | ✅ Yes   | undefined   | Function |
| let      | ✅ Yes   | ❌ No        | Block    |
| const    | ✅ Yes   | ❌ No        | Block    |
| function | ✅ Yes   | ✅ Yes       | Function |
| class    | ✅ Yes   | ❌ No (TDZ)  | Block    |

---

## 3. var Hoisting (Legacy Behavior)

```js
console.log(a); // undefined
var a = 10;
```

### Memory Phase:

```
a → undefined
```

---

## 4. let & const Hoisting (TDZ)

### ⏳ Temporal Dead Zone (TDZ)

`let` and `const` exist but **cannot be accessed before initialization**

👉 If accessed before initialization → ❌ ReferenceError

```js
console.log(b); // ReferenceError
let b = 20;
```

### Visual Understanding:

```
Creation Phase ───────── Execution Phase
        |         TDZ         |   Initialized
```

### TDZ Zone

```
 ├─ b exists
 └─ cannot be accessed
```

---

## 5. Function Hoisting (Function Declaration)

```js
sayHi(); // works

function sayHi() {
  console.log('Hi');
}
```

### Why?

`sayHi` is hoisted with its **full function body**

---

## 6. Function Expression Hoisting

```js
sayHello(); // TypeError

var sayHello = function () {
  console.log('Hello');
};
```

### Reason:

```
sayHello → undefined
```

---

## 7. Arrow Functions & Hoisting

```js
run(); // TypeError

const run = () => console.log('Run');
```

👉 Arrow functions follow **variable hoisting rules**

---

## 8. Class Hoisting (Trick Question)

```js
new Car(); // ReferenceError
class Car {}
```

👉 Classes are hoisted but live inside **TDZ**

---

# ✅ Final Summary

* `var` → Hoisted + initialized with `undefined`
* `let` & `const` → Hoisted but in TDZ
* `function` → Fully hoisted with body
* `function expression` & `arrow` → Behave like variables
* `class` → Hoisted but in TDZ

---

💡 **Golden Rule:**

> Hoisting moves declarations, not initializations.


## 🧠 What is Hoisting?

Hoisting is JavaScript's behavior of **moving declarations to the top of their scope (before execution)**.

👉 Simple Meaning:

> JavaScript reads your code first (creation phase), and registers variables & functions before running it.

---

## ⚙️ Behind the Scenes (Execution Phases)

JavaScript runs code in 2 phases:

### 1. Creation Phase

* Memory is allocated
* Variables are initialized
* Functions are stored completely

### 2. Execution Phase

* Code runs line by line

---

## 📦 Hoisting Behavior by Type

### 🔹 1. var Hoisting

```javascript
console.log(a); // undefined
var a = 10;
```

👉 What JS sees internally:

```javascript
var a; // hoisted
console.log(a);
a = 10;
```

✔️ Behavior:

* Hoisted to top
* Initialized with `undefined`

---

### 🔹 2. let Hoisting

```javascript
console.log(b); // ❌ ReferenceError
let b = 20;
```

✔️ Behavior:

* Hoisted BUT not initialized
* Exists in **Temporal Dead Zone (TDZ)**

---

### 🔹 3. const Hoisting

```javascript
console.log(c); // ❌ ReferenceError
const c = 30;
```

✔️ Behavior:

* Hoisted BUT not initialized
* Must be assigned at declaration
* Also in TDZ

---

## ⛔ Temporal Dead Zone (TDZ)

👉 Definition:

> The time between variable hoisting and its initialization where accessing it causes an error.

```javascript
{
  console.log(x); // ❌ TDZ
  let x = 5;
}
```

✔️ Key Point:

* TDZ prevents accidental usage before declaration

---

## 🔥 Functions Hoisting

### ✅ Function Declaration

```javascript
sayHello(); // ✅ Works

function sayHello() {
  console.log("Hello");
}
```

✔️ Behavior:

* Fully hoisted (function + body)

---

### ❌ Function Expression

```javascript
sayHi(); // ❌ Error

var sayHi = function () {
  console.log("Hi");
};
```

👉 Internally:

```javascript
var sayHi; // hoisted as undefined
sayHi(); // ❌ not a function
```

✔️ Behavior:

* Only variable is hoisted
* Function is NOT available early

---

## ⚖️ Declaration vs Expression (Key Difference)

| Feature                 | Function Declaration | Function Expression |
| ----------------------- | -------------------- | ------------------- |
| Hoisting                | ✅ Fully hoisted      | ❌ Not fully         |
| Usage before definition | ✅ Allowed            | ❌ Not allowed       |

---

## 🌍 Real-World Examples

### Example 1: Bug with var

```javascript
var total = 100;

function calculate() {
  console.log(total); // undefined ❗
  var total = 50;
}

calculate();
```

👉 Reason:

* Local `var total` is hoisted

---

### Example 2: Safe with let

```javascript
let price = 100;

function show() {
  // console.log(price); ❌ TDZ
  let price = 200;
}
```

👉 Prevents unexpected bugs

---

## ⚠️ Common Mistakes

### 1. Using variables before declaration

```javascript
console.log(x);
let x = 10;
```

### 2. Assuming function expressions are hoisted

```javascript
run(); // ❌
var run = function() {};
```

### 3. Confusing undefined with error

* `var` → undefined
* `let/const` → ReferenceError

---

## ✅ Best Practices

* Always declare variables at the top of scope
* Prefer `let` and `const` over `var`
* Use function declarations when early access is needed
* Avoid relying on hoisting (write clean, predictable code)

---

## 🧾 Final Summary

* Hoisting = declarations moved to top
* `var` → hoisted + initialized as undefined
* `let/const` → hoisted but in TDZ
* Function declarations → fully hoisted
* Function expressions → not fully hoisted

---

## 🧠 One-Line Memory Trick

> "JavaScript knows your variables before execution, but doesn’t always let you use them early."

---

✅ After this, you should fully understand JavaScript Hoisting like a professional.

---

## 📊 Visual Diagram — Memory + Call Stack (Hoisting)

### 🔹 Example Code

```javascript
console.log(a);
var a = 10;

function greet() {
  console.log("Hello");
}

greet();
```

---

## 🧠 Phase 1: Creation Phase (Memory Setup)

```
MEMORY (Variable Environment)        CALL STACK
---------------------------------    -----------------
a: undefined                         [ Global Execution Context ]
greet: function() {...}
```

✔️ What happened:

* `var a` → hoisted with `undefined`
* `greet` → fully stored in memory

---

## ⚙️ Phase 2: Execution Phase (Code Runs Line-by-Line)

### Step 1:

```javascript
console.log(a);
```

```
OUTPUT → undefined
```

---

### Step 2:

```javascript
a = 10;
```

```
MEMORY UPDATE:
a: 10
```

---

### Step 3:

```javascript
greet();
```

```
CALL STACK
-----------------
[ greet() ]
[ Global EC ]
```

👉 Function executes:

```
OUTPUT → Hello
```

After execution:

```
CALL STACK
-----------------
[ Global EC ]
```

---

## 🔥 TDZ Visual (let / const)

### Code:

```javascript
console.log(x);
let x = 5;
```

### Memory View:

```
MEMORY                         STATUS
----------------------------  ------------------
x: <uninitialized>            🚫 TDZ (Cannot access)
```

👉 Accessing `x` before initialization:

```
❌ ReferenceError
```

---

## ⚖️ Function Expression Visual

### Code:

```javascript
sayHi();
var sayHi = function() {
  console.log("Hi");
};
```

### Creation Phase:

```
MEMORY
-----------------
sayHi: undefined
```

### Execution:

```
sayHi() → ❌ TypeError: not a function
```

---

## 🧠 Super Simple Mental Model

```
STEP 1 (Creation Phase):
👉 JS scans code
👉 Stores variables/functions in memory

STEP 2 (Execution Phase):
👉 Runs code line by line
👉 Uses memory values
```

---

## 🎯 Final Visual Summary

```
CREATION PHASE              EXECUTION PHASE
----------------------     ----------------------
var → undefined            values assigned
let/const → TDZ            usable after init
functions → fully ready    can call anytime
```

---

✅ Now you can *visualize hoisting like a machine*, not just remember it.
