# 🎯 JavaScript Execution Context (Complete Guide)

# 📘 JavaScript Variables & Execution Context (Complete Guide)

---

## 🔹 Variable Declaration

Creating a variable name in memory → Memory is allocated for the variable name

❌ No value assigned yet (except `var` auto = `undefined`)

```js
var a;
let b;
const c;   // ❌ invalid (const must be initialized)
```

---

## 🔹 Variable Initialization

Assigning the first value to a variable

```js
var a = 10;
let b = 20;
const c = 30;
```

---

## 🔹 Variable Definition

Declaration + Initialization together

```js
let x = 100;
```

This single line means:

* Declared → `x`
* Initialized → `100`
* Defined → `x = 100`

---

# ⚙️ JavaScript Execution Context

Whenever JavaScript runs code, it creates an **Execution Context**.

## 📌 Types:

* Global Execution Context (GEC)
* Function Execution Context (FEC)
* Eval (rarely used)

---

## 🔄 Two Phases of Execution

JavaScript runs in two phases:

### 1️⃣ Creation Phase (Memory Creation Phase / Hoisting)

* Create Memory (Variables, Functions)
* Set up Scope
* Decide `this`

### 2️⃣ Execution Phase

* Assign values
* Execute code line-by-line
* Call functions

---

## 🧠 JS Engine Structure

```
JS Engine
│
├── Phase 1: Creation Phase
│     ├── Create Memory (Variables, Functions)
│     ├── Set up Scope
│     ├── Decide 'this'
│
└── Phase 2: Execution Phase
      ├── Assign values
      ├── Execute code line-by-line
      ├── Call functions
```

---

## 🧩 Memory vs Execution

```
JS Engine
 ├─ Memory Heap   (variables, functions)
 └─ Call Stack    (execution contexts)
```

---

## 📦 Creation Phase – Visual Memory Snapshot

```js
console.log(a);
console.log(b);
foo();

var a = 10;
let b = 20;

function foo() {
  console.log("Hello");
}
```

### 🧠 Memory Created (Before Execution)

```
Global Execution Context
┌──────────────────────────┐
│ a   → undefined          │
│ b   → <uninitialized>    │
│ foo → function() {...}   │
└──────────────────────────┘
```

⚠️ No code runs yet.

---

## 🚀 Execution Context = What?

Execution Context = Environment where JavaScript code is evaluated & executed

Each context contains:

### Execution Phase

* Assign values
* Execute code line-by-line
* Call functions

---

## 🔥 Key Takeaways

* `var` is hoisted with `undefined`
* `let` & `const` are hoisted but stay in **Temporal Dead Zone (TDZ)**
* Functions are fully hoisted
* JS always runs in **two phases**
* Execution Context controls how code runs internally

---

## 🧠 Super Simple Flow

```
Code Starts
   ↓
Creation Phase (Memory Setup)
   ↓
Execution Phase (Run Code)
   ↓
Output
```

# 📘 JavaScript Variables & Execution Context (Complete Guide)

---

## 🔹 Variable Declaration

Creating a variable name in memory → Memory is allocated for the variable name

❌ No value assigned yet (except `var` auto = `undefined`)

```js
var a;
let b;
const c;   // ❌ invalid (const must be initialized)
```

---

## 🔹 Variable Initialization

Assigning the first value to a variable

```js
var a = 10;
let b = 20;
const c = 30;
```

---

## 🔹 Variable Definition

Declaration + Initialization together

```js
let x = 100;
```

This single line means:

* Declared → `x`
* Initialized → `100`
* Defined → `x = 100`

---

# ⚙️ JavaScript Execution Context

Whenever JavaScript runs code, it creates an **Execution Context**.

## 📌 Types:

* Global Execution Context (GEC)
* Function Execution Context (FEC)
* Eval (rarely used)

---

## 🔄 Two Phases of Execution

JavaScript runs in two phases:

### 1️⃣ Creation Phase (Memory Creation Phase / Hoisting)

* Create Memory (Variables, Functions)
* Set up Scope
* Decide `this`

### 2️⃣ Execution Phase

* Assign values
* Execute code line-by-line
* Call functions

---

## 🧠 JS Engine Structure

```
JS Engine
│
├── Phase 1: Creation Phase
│     ├── Create Memory (Variables, Functions)
│     ├── Set up Scope
│     ├── Decide 'this'
│
└── Phase 2: Execution Phase
      ├── Assign values
      ├── Execute code line-by-line
      ├── Call functions
```

---

## 🧩 Memory vs Execution

```
JS Engine
 ├─ Memory Heap   (variables, functions)
 └─ Call Stack    (execution contexts)
```

---

## 📦 Creation Phase – Visual Memory Snapshot

```js
console.log(a);
console.log(b);
foo();

var a = 10;
let b = 20;

function foo() {
  console.log("Hello");
}
```

### 🧠 Memory Created (Before Execution)

```
Global Execution Context
┌──────────────────────────┐
│ a   → undefined          │
│ b   → <uninitialized>    │
│ foo → function() {...}   │
└──────────────────────────┘
```

⚠️ No code runs yet.

---

## 🚀 Execution Context = What?

Execution Context = Environment where JavaScript code is evaluated & executed

Each context contains:

### Execution Phase

* Assign values
* Execute code line-by-line
* Call functions

---

## 🔥 Key Takeaways

* `var` is hoisted with `undefined`
* `let` & `const` are hoisted but stay in **Temporal Dead Zone (TDZ)**
* Functions are fully hoisted
* JS always runs in **two phases**
* Execution Context controls how code runs internally

---

## 🧠 Super Simple Flow

```
Code Starts
   ↓
Creation Phase (Memory Setup)
   ↓
Execution Phase (Run Code)
   ↓
Output
```

---

# 🔄 Execution Context Lifecycle (Step-by-Step)

## 📌 Example

```js
var x = 10;

function add(a, b) {
  var sum = a + b;
  return sum;
}

add(2, 3);
```

---

## 🧠 Phase 1: Memory Creation (Hoisting)

```
x   → undefined
add → function reference
```

---

## ⚡ Phase 2: Execution

```
x = 10

add(2, 3)
  a = 2
  b = 3
  sum = 5
```

---

# 📚 Call Stack (LIFO - Last In First Out)

* Call Stack manages execution contexts

### 🔄 Flow:

```
Global Execution Context pushed
↓
add() pushed
↓
add() popped
↓
Global EC remains
```

---

## 🚨 Stack Overflow Example

```js
function recurse() {
  recurse();
}

recurse(); // ❌ Maximum call stack size exceeded
```

👉 Infinite recursion keeps adding contexts → stack limit reached → crash

---

## 🔥 Key Insight

* Every function call creates a new Execution Context
* Call Stack handles order of execution
* JavaScript is single-threaded → one stack
* Overflow happens when stack exceeds limit

---

# 🎬 Visual Call Stack (Push/Pop Simulation)

## 📌 Example

```js
function one() {
  two();
}

function two() {
  three();
}

function three() {
  console.log("Done");
}

one();
```

---

## 🧠 Step-by-Step Execution

### 1️⃣ Global Execution Starts

```
Call Stack
┌───────────────┐
│ Global()      │
└───────────────┘
```

---

### 2️⃣ one() is called → PUSH

```
Call Stack
┌───────────────┐
│ one()         │
│ Global()      │
└───────────────┘
```

---

### 3️⃣ two() is called → PUSH

```
Call Stack
┌───────────────┐
│ two()         │
│ one()         │
│ Global()      │
└───────────────┘
```

---

### 4️⃣ three() is called → PUSH

```
Call Stack
┌───────────────┐
│ three()       │
│ two()         │
│ one()         │
│ Global()      │
└───────────────┘
```

---

### 5️⃣ three() completes → POP

```
Call Stack
┌───────────────┐
│ two()         │
│ one()         │
│ Global()      │
└───────────────┘
```

---

### 6️⃣ two() completes → POP

```
Call Stack
┌───────────────┐
│ one()         │
│ Global()      │
└───────────────┘
```

---

### 7️⃣ one() completes → POP

```
Call Stack
┌───────────────┐
│ Global()      │
└───────────────┘
```

---

## 🎯 Final Understanding

```
Push → When function is called
Pop  → When function finishes
```

👉 Last In → First Out (LIFO)

---

## 🧠 What is Execution Context?

Execution Context is the **environment where JavaScript code is executed**.

👉 Think of it like a "box" where:

* Variables are stored
* Functions are stored
* Code is executed

📌 Whenever JavaScript runs, it always runs inside an Execution Context.

---

## 🌍 Types of Execution Context

### 1. Global Execution Context (GEC)

* Created when your JavaScript program starts
* Only one global context exists
* `this` refers to the global object

```js
var name = "Sachin";

function greet() {
  console.log("Hello");
}
```

👉 Here, `name` and `greet` are stored in the Global Execution Context.

---

### 2. Function Execution Context (FEC)

* Created every time a function is called
* Each function gets its own context

```js
function sayHi() {
  var message = "Hi";
  console.log(message);
}

sayHi();
```

👉 When `sayHi()` runs, a new Execution Context is created.

---

### 3. Eval Execution Context

* Created when using `eval()` (rarely used)
* Not recommended due to security and performance issues

```js
eval("var x = 10");
console.log(x);
```

---

## ⚙️ Phases of Execution Context

Each Execution Context has 2 phases:

---

### 🏗️ 1. Creation Phase (Memory Creation Phase)

JavaScript prepares everything before running code.

What happens here?

* Variables are stored with `undefined`
* Functions are stored completely in memory
* `this` is assigned

```js
console.log(a); // undefined
var a = 5;
```

👉 During creation phase:

```
a = undefined
```

---

### ▶️ 2. Execution Phase

Now JavaScript executes code line by line.

* Assign values to variables
* Execute functions

```js
var a = 5;
console.log(a); // 5
```

---

## 🧩 Key Concepts

### 1. Variable Environment

Stores:

* Variables
* Function declarations

```js
var x = 10;
function test() {}
```

---

### 2. Scope Chain

JavaScript looks for variables in this order:

👉 Current scope → Parent scope → Global scope

```js
var a = 10;

function outer() {
  var b = 20;

  function inner() {
    console.log(a, b);
  }

  inner();
}

outer(); // 10 20
```

---

### 3. `this` Keyword

Value of `this` depends on how a function is called

```js
console.log(this); // global object (window in browser)

function show() {
  console.log(this);
}

show();
```

---

## 🔄 Real Flow Example

```js
var a = 10;

function foo() {
  var b = 20;
  console.log(a + b);
}

foo();
```

👉 Flow:

1. Global Execution Context created
2. `a` stored as undefined → then 10
3. `foo` stored in memory
4. `foo()` called → new Function Execution Context created
5. `b` stored → then assigned 20
6. Scope chain finds `a` from global
7. Output: 30

---

## ❌ Common Mistakes

### 1. Thinking variables are created during execution

```js
console.log(x); // undefined, not error
var x = 5;
```

👉 Due to hoisting (creation phase)

---

### 2. Confusing `this`

```js
function test() {
  console.log(this);
}

test();
```

👉 `this` is NOT always the same

---

### 3. Ignoring scope chain

```js
function demo() {
  console.log(a);
}

demo(); // ReferenceError if 'a' not found
```

---

## ✅ Best Practices

* Avoid using `eval()`
* Use `let` and `const` instead of `var`
* Understand scope before writing logic
* Keep functions small and predictable

---

## 🧾 Final Summary

* Execution Context = Environment where code runs
* Types: Global, Function, Eval
* Phases: Creation → Execution
* Key parts: Variable Environment, Scope Chain, `this`

👉 Master this, and you understand how JavaScript truly works internally 🚀

---

# 🔷 Visual Diagrams (Call Stack + Memory)

## 📦 Memory (Heap) vs 📞 Call Stack

```
MEMORY (Heap)                  CALL STACK
------------------            ------------------
a: 10                         Global()
foo: function {...}           
                              
                              foo()
                              
```

👉 Explanation:

* Memory stores variables & functions
* Call Stack keeps track of execution order

---

## 📞 Call Stack Flow

```js
function one() {
  two();
}

function two() {
  console.log("Hello");
}

one();
```

```
Call Stack:

[ Global() ]
[ one()    ]
[ two()    ]  -> executes -> removed
[ one()    ]  -> removed
[ Global() ]
```

---

# 🔷 Step-by-Step Animation Style Flow

## Example:

```js
var a = 5;

function test() {
  var b = 10;
  console.log(a + b);
}

test();
```

### 🎬 Step 1: Global Creation Phase

```
a = undefined
test = function
this = window
```

### 🎬 Step 2: Global Execution Phase

```
a = 5
```

### 🎬 Step 3: Function Call

```
New Execution Context pushed to Call Stack
```

### 🎬 Step 4: Function Creation Phase

```
b = undefined
```

### 🎬 Step 5: Function Execution Phase

```
b = 10
console.log(5 + 10) = 15
```

### 🎬 Step 6: Function Ends

```
Function removed from Call Stack
```

---

# 🔷 Advanced Concepts

## 🧬 1. Lexical Environment

👉 Lexical = "where code is written"

Each Execution Context has:

* Variable Environment
* Reference to outer environment

```js
function outer() {
  var a = 10;

  function inner() {
    console.log(a);
  }

  inner();
}

outer();
```

👉 `inner` remembers where it was created (not called!)

---

## 🔗 2. Closures (Very Important)

Closure = Function + its Lexical Environment

```js
function outer() {
  var count = 0;

  return function inner() {
    count++;
    console.log(count);
  };
}

const counter = outer();

counter(); // 1
counter(); // 2
```

👉 Why it works?

* `inner` remembers `count` even after `outer` is finished

---

## 🧠 Real-Life Analogy

👉 Closure is like a backpack 🎒

* Function carries its data even after leaving home

---

## ⚡ Key Takeaways (Advanced)

* Lexical Environment decides scope
* Functions remember their outer scope
* Closures enable data persistence
* Used in:

  * Data hiding
  * Factory functions
  * React hooks

---

## 🚀 Final Master Insight

👉 JavaScript is not just executing code...
👉 It is managing contexts, memory, and scope behind the scenes.

Once you understand:

* Execution Context
* Call Stack
* Lexical Environment
* Closures

💡 You think like a JavaScript engine, not a beginner anymore.
