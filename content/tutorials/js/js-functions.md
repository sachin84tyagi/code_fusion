# 🎯 JavaScript Functions — Complete Guide

---

## 1️⃣ What is a Function?

A **Function** is a reusable block of code that performs a specific task.

👉 Simple Meaning:

> Function = Named block of code you can call (execute) whenever you need it.

```js
function greet() {
  console.log("Hello, World!");
}

greet(); // call it → "Hello, World!"
greet(); // call again → "Hello, World!"
```

📌 Why Functions?

```
Without Functions:              With Functions:
──────────────────              ───────────────────
console.log("Hello Arjun");     function greet(name) {
console.log("Hello Priya");       console.log("Hello " + name);
console.log("Hello Rohan");     }
// repeated code ❌             greet("Arjun");  // ✅ reusable
                                greet("Priya");
                                greet("Rohan");
```

---

## 2️⃣ Types of Functions in JavaScript

```
JavaScript Functions
│
├── Function Declaration         → hoisted, traditional syntax
├── Function Expression          → stored in variable, not hoisted
├── Arrow Function               → ES6+, no own 'this'
├── IIFE                         → runs immediately, private scope
├── Constructor Function         → creates objects (pre-class)
├── Generator Function           → yields values lazily
└── Async Function               → handles promises cleanly
```

---

## 3️⃣ Function Declaration

**Syntax:**

```js
function functionName(parameters) {
  // body
  return value;
}
```

**Example:**

```js
function add(a, b) {
  return a + b;
}

const result = add(10, 20);
console.log(result); // 30
```

### ✅ Key Behavior: Fully Hoisted

```js
// Called BEFORE declaration — works!
console.log(multiply(5, 4));  // 20 ✅

function multiply(a, b) {
  return a * b;
}
```

### 📊 Memory Phase (Hoisting):

```
CREATION PHASE:
┌──────────────────────────────┐
│ multiply → function() {...}  │  ← fully stored in memory
└──────────────────────────────┘

EXECUTION PHASE:
multiply(5, 4) → 20  ✅
```

👉 Function declarations are **fully hoisted** — both name AND body are available before the line they're written.

---

## 4️⃣ Function Expression

A function stored inside a variable.

```js
const subtract = function(a, b) {
  return a - b;
};

console.log(subtract(10, 4)); // 6
```

### ❌ Not Hoisted (unlike declaration)

```js
console.log(square(5)); // ❌ TypeError: square is not a function

var square = function(n) {
  return n * n;
};
```

### 📊 Memory Phase:

```
CREATION PHASE:
┌───────────────────┐
│ square → undefined │  ← treated as variable, not function
└───────────────────┘

EXECUTION PHASE:
square(5) → ❌ TypeError (called before function assigned)
```

### Named Function Expression

```js
const factorial = function fact(n) {   // 'fact' is only accessible inside
  if (n <= 1) return 1;
  return n * fact(n - 1);             // can call itself by name
};

factorial(5);  // 120 ✅
// fact(5);    // ❌ ReferenceError — 'fact' not in outer scope
```

---

## 5️⃣ Arrow Functions (ES6+)

Shorter syntax for function expressions. Most commonly used in modern JS.

### Syntax Forms:

```js
// Form 1: Full body
const greet = (name) => {
  return `Hello, ${name}!`;
};

// Form 2: Implicit return (single expression — no braces, no return)
const greet = (name) => `Hello, ${name}!`;

// Form 3: Single parameter — no parentheses needed
const double = n => n * 2;

// Form 4: No parameters — parentheses required
const getDate = () => new Date().toISOString();

// Form 5: Returning an object — wrap in ()
const getUser = (id) => ({ id, role: "admin" });
```

### Examples:

```js
const add       = (a, b) => a + b;
const square    = n => n * n;
const isAdult   = age => age >= 18;
const greetUser = name => `Welcome, ${name}!`;

console.log(add(3, 4));           // 7
console.log(square(5));           // 25
console.log(isAdult(20));         // true
console.log(greetUser("Arjun"));  // "Welcome, Arjun!"
```

### ⚠️ Arrow Function — No Own `this`

```js
const team = {
  name: "Alpha",
  members: ["Arjun", "Priya", "Rohan"],

  // ✅ Regular method — 'this' = team object
  listRegular() {
    return this.members.map(function(m) {
      return `${this.name}: ${m}`; // ❌ this.name = undefined (lost context)
    });
  },

  // ✅ Arrow inside method — inherits 'this' from enclosing scope
  listArrow() {
    return this.members.map(m => `${this.name}: ${m}`); // ✅ this = team
  },

  // ❌ Arrow as method — 'this' = outer/global scope (NOT team)
  badMethod: () => {
    return this.name; // undefined — no own 'this'
  }
};

console.log(team.listArrow());
// ["Alpha: Arjun", "Alpha: Priya", "Alpha: Rohan"]
```

### 📊 Declaration vs Expression vs Arrow

```
┌─────────────────────┬────────────┬────────────────┬───────────────┐
│ Feature             │ Declaration│ Expression     │ Arrow         │
├─────────────────────┼────────────┼────────────────┼───────────────┤
│ Hoisting            │ ✅ Full     │ ❌ No           │ ❌ No          │
│ Own 'this'          │ ✅ Yes      │ ✅ Yes          │ ❌ No          │
│ arguments object    │ ✅ Yes      │ ✅ Yes          │ ❌ No          │
│ Used as constructor │ ✅ Yes      │ ✅ Yes          │ ❌ No          │
│ Implicit return     │ ❌ No       │ ❌ No           │ ✅ Yes         │
│ Best for            │ Named fns  │ Callbacks      │ Short fns     │
└─────────────────────┴────────────┴────────────────┴───────────────┘
```

---

## 6️⃣ Parameters vs Arguments

```js
function greet(name, role) {   // name, role = PARAMETERS (definition)
  return `${name} is a ${role}`;
}

greet("Arjun", "Backend Dev"); // "Arjun", "Backend Dev" = ARGUMENTS (call)
```

```
Parameters → placeholders in function definition
Arguments  → actual values passed during function call
```

### Too few or too many arguments:

```js
function show(a, b, c) {
  console.log(a, b, c);
}

show(1, 2);        // 1 2 undefined  ← missing arg = undefined
show(1, 2, 3, 4);  // 1 2 3          ← extra arg ignored
```

---

## 7️⃣ Default Parameters (ES6+)

```js
function greet(name = "Guest", role = "Visitor") {
  return `Hello, ${name}! You are a ${role}.`;
}

greet("Arjun", "Admin")   // "Hello, Arjun! You are a Admin."
greet("Priya")            // "Hello, Priya! You are a Visitor."
greet()                   // "Hello, Guest! You are a Visitor."
```

### ⚠️ Default only triggers on `undefined` — NOT on `null`

```js
function test(x = 10) {
  console.log(x);
}

test(undefined)  // 10  ← default used
test(null)       // null ← null does NOT trigger default!
test(0)          // 0   ← 0 does NOT trigger default!
test("")         // ""  ← "" does NOT trigger default!
```

### Default can use expressions and other params:

```js
function createUser(
  name,
  role = "viewer",
  id   = Date.now(),             // expression as default
  slug = name.toLowerCase()      // use earlier param as default
) {
  return { id, name, role, slug };
}

createUser("Arjun", "admin");
// { id: 1698573200000, name: "Arjun", role: "admin", slug: "arjun" }
```

---

## 8️⃣ Rest Parameters (...args)

Collect remaining arguments into a **real Array**.

```js
function sum(...numbers) {       // numbers = [10, 20, 30, 40]
  return numbers.reduce((acc, n) => acc + n, 0);
}

sum(10, 20)           // 30
sum(10, 20, 30, 40)   // 100
sum()                 // 0
```

### Rest with other parameters (rest must be LAST):

```js
function logActivity(action, timestamp, ...details) {
  console.log(`[${timestamp}] ${action}:`, details);
}

logActivity("LOGIN", "2024-01-15", "user=Arjun", "ip=192.168.1.1", "2FA=true");
// [2024-01-15] LOGIN: ["user=Arjun", "ip=192.168.1.1", "2FA=true"]
```

### ⚠️ Rest vs `arguments` object

```js
function old() {
  console.log(arguments);        // Arguments object (array-like, NOT real array)
  // arguments.map(...)          // ❌ TypeError — no array methods!
}

function modern(...args) {
  console.log(args);             // Real Array ✅
  args.map(x => x * 2);         // ✅ array methods work
}
```

```
Rest (...args)          arguments object
──────────────          ────────────────
Real Array ✅            Array-like ❌
Arrow-compatible ✅      Not in arrow fns ❌
Named + rest ✅          Captures ALL args
ES6+ ✅                  Legacy (avoid) ⚠️
```

---

## 9️⃣ Return Values

```js
function add(a, b) {
  return a + b;   // stops execution, sends value back
  console.log("never reached"); // ← dead code after return
}

const result = add(5, 3); // 8
```

### Functions without return → `undefined`

```js
function sayHi() {
  console.log("Hi!");
  // no return
}

const val = sayHi();  // prints "Hi!"
console.log(val);     // undefined ← implicit return
```

### Return multiple values → Object or Array

```js
// Return object (named values)
function getStats(arr) {
  return {
    min:  Math.min(...arr),
    max:  Math.max(...arr),
    sum:  arr.reduce((a, b) => a + b, 0),
    avg:  arr.reduce((a, b) => a + b, 0) / arr.length,
  };
}

const { min, max, avg } = getStats([10, 20, 30, 40]);
console.log(min, max, avg); // 10 40 25

// Return array (positional values)
function minMax(arr) {
  return [Math.min(...arr), Math.max(...arr)];
}

const [lo, hi] = minMax([3, 1, 4, 1, 5, 9]);
console.log(lo, hi); // 1 9
```

### Early return pattern (Guard Clause)

```js
// ❌ Nested conditions (hard to read)
function processUser(user) {
  if (user) {
    if (user.active) {
      if (user.role === "admin") {
        return doAdminWork(user);
      }
    }
  }
}

// ✅ Guard clauses (early return — clean & flat)
function processUser(user) {
  if (!user)               return null;
  if (!user.active)        return "User inactive";
  if (user.role !== "admin") return "Not authorized";
  return doAdminWork(user);
}
```

---

## 🔟 First-Class Functions

In JavaScript, functions are **first-class citizens** — treated like any other value.

This means you can:

```js
// 1. Assign to a variable
const greet = function() { return "Hello"; };

// 2. Store in an array
const actions = [
  () => console.log("action 1"),
  () => console.log("action 2"),
];
actions[0](); // "action 1"

// 3. Store in an object
const utils = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
};
utils.add(5, 3); // 8

// 4. Pass as argument to another function
function runTwice(fn) {
  fn();
  fn();
}
runTwice(() => console.log("Running!")); // "Running!" "Running!"

// 5. Return from another function
function multiplier(factor) {
  return (num) => num * factor;  // returns a function!
}
const triple = multiplier(3);
triple(5);  // 15
triple(10); // 30
```

---

## 1️⃣1️⃣ Higher-Order Functions (HOF)

A function that **receives** or **returns** another function.

```
Higher-Order Function
│
├── Takes a function as argument   → map, filter, reduce, forEach
└── Returns a function             → multiplier, createValidator
```

### Receives a function:

```js
const team = ["Arjun", "Priya", "Rohan"];

// map, filter, forEach are HOFs built-in
team.map(name => name.toUpperCase());       // ["ARJUN","PRIYA","ROHAN"]
team.filter(name => name.length > 5);       // ["Priya","Rohan"] (wait — Arjun=5, Priya=5...)
team.forEach(name => console.log(name));

// Custom HOF
function applyToAll(arr, fn) {
  return arr.map(fn);
}
applyToAll([1, 2, 3], n => n * 10);  // [10, 20, 30]
```

### Returns a function:

```js
function createGreeter(greeting) {
  return function(name) {         // returns a new function
    return `${greeting}, ${name}!`;
  };
}

const sayHello = createGreeter("Hello");
const sayHi    = createGreeter("Hi");

sayHello("Arjun");  // "Hello, Arjun!"
sayHi("Priya");     // "Hi, Priya!"
```

---

## 1️⃣2️⃣ Callback Functions

A function passed as an argument to another function, called later.

```js
function fetchData(onSuccess, onError) {
  const success = true;

  if (success) {
    onSuccess({ name: "Arjun", role: "Backend" });  // ← callback called here
  } else {
    onError("Network error");
  }
}

fetchData(
  (data) => console.log("Got:", data.name),    // success callback
  (err)  => console.error("Error:", err)        // error callback
);
// "Got: Arjun"
```

### Real-World Callbacks:

```js
// setTimeout — callback after delay
setTimeout(() => console.log("3 seconds later"), 3000);

// Event listener — callback on click
button.addEventListener("click", () => console.log("Clicked!"));

// Array methods — callback for each element
[1, 2, 3].map(n => n * 2);  // map's argument is a callback

// Node.js file read — callback with result
fs.readFile("data.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

### ⚠️ Callback Hell (Pyramid of Doom)

```js
// ❌ Nested callbacks — hard to read
getUser(1, (user) => {
  getProfile(user.id, (profile) => {
    getSettings(profile.id, (settings) => {
      getPermissions(settings.id, (perms) => {
        console.log(perms); // deeply nested!
      });
    });
  });
});

// ✅ Solution: Promises or async/await (see asynchronous.md)
const user     = await getUser(1);
const profile  = await getProfile(user.id);
const settings = await getSettings(profile.id);
const perms    = await getPermissions(settings.id);
```

---

## 1️⃣3️⃣ IIFE — Immediately Invoked Function Expression

A function that runs **immediately** when defined.

```js
// Syntax: wrap in () to create expression, then call with ()
(function() {
  console.log("I run immediately!");
})();

// Arrow version
(() => {
  console.log("Arrow IIFE");
})();

// With parameter
((name) => {
  console.log(`Hello, ${name}!`);
})("Arjun");
// "Hello, Arjun!"
```

### Why IIFE? → Private Scope

```js
const config = (() => {
  // 'privateKey' is NOT accessible outside
  const privateKey = "secret-api-key-123";
  const version    = "2.0";

  return {
    version,
    getKey() { return privateKey; }  // controlled access
  };
})();

console.log(config.version);       // "2.0"
console.log(config.getKey());      // "secret-api-key-123"
// console.log(privateKey);        // ❌ ReferenceError
```

### Real-World Uses:

```js
// 1. Avoid polluting global scope (module pattern pre-ESM)
// 2. Initialize app once
// 3. Create private state
// 4. Wrap third-party library code
```

---

## 1️⃣4️⃣ Pure vs Impure Functions

### ✅ Pure Function (Same input → Same output, No side effects)

```js
// Pure: result depends ONLY on input, no external state changed
function add(a, b) {
  return a + b;      // always same result for same input
}

function formatName(name) {
  return name.trim().toLowerCase();
}

// ✅ Pure
add(5, 3)   // always 8
add(5, 3)   // always 8
```

### ❌ Impure Function (Depends on/modifies external state)

```js
let total = 0;

// Impure: modifies external variable
function addToTotal(n) {
  total += n;         // side effect: changes outer state
  return total;
}

addToTotal(5);  // 5
addToTotal(5);  // 10  ← same input, different result!

// Impure: depends on Date (changes every call)
function getTimestamp() {
  return new Date().getTime(); // different every time
}
```

### 📊 Comparison:

```
┌─────────────────────────┬─────────────────────────┐
│ PURE                    │ IMPURE                  │
├─────────────────────────┼─────────────────────────┤
│ Same input = same output│ Output may vary         │
│ No side effects         │ May have side effects   │
│ Predictable             │ Less predictable        │
│ Easy to test            │ Harder to test          │
│ ✅ Preferred             │ Sometimes necessary     │
│ map, filter, reduce     │ console.log, fetch, DB  │
└─────────────────────────┴─────────────────────────┘
```

👉 **Functional Programming principle:** Prefer pure functions. Side effects (API calls, DOM updates, file I/O) should be isolated.

---

## 1️⃣5️⃣ Function Scope

Each function creates its own **scope** — variables inside are not accessible outside.

```js
function outer() {
  const x = 10;     // only accessible inside outer()

  function inner() {
    const y = 20;   // only accessible inside inner()
    console.log(x); // ✅ inner can access outer's variables (lexical scope)
  }

  inner();
  // console.log(y); // ❌ ReferenceError
}

outer();
// console.log(x); // ❌ ReferenceError
```

### 📊 Scope Chain Visual:

```
Global Scope
│
└── outer() scope
    │  x = 10
    │
    └── inner() scope
           y = 20
           ↑ can access x, y
```

```
Variable lookup order:
inner scope → outer scope → global scope → ReferenceError
```

---

## 1️⃣6️⃣ Closures (Quick Reference — see scope-closures.md for full guide)

A closure = function that **remembers** variables from its outer scope, even after outer function finishes.

```js
function createCounter(start = 0) {
  let count = start;   // 'count' is closed over

  return {
    increment: () => ++count,
    decrement: () => --count,
    reset:     () => { count = start; },
    value:     () => count,
  };
}

const loginCounter = createCounter(0);
const bugCounter   = createCounter(10);

loginCounter.increment();
loginCounter.increment();
bugCounter.decrement();

console.log(loginCounter.value()); // 2  ← own private count
console.log(bugCounter.value());   // 9  ← separate private count
```

### 📊 Memory Model:

```
Call Stack              Heap (Memory)
──────────             ──────────────
createCounter() ❌       count = 0  (loginCounter's)
                         count = 10 (bugCounter's)
                         ↑
loginCounter → { increment, decrement... }
                ── [[Environment]] → { count }
```

### Real-World Uses:

```js
// 1. Data privacy / encapsulation
// 2. Function factories (createGreeter, createMultiplier)
// 3. Memoization (cache results)
// 4. Callbacks with preserved state
// 5. React hooks (useState uses closures internally)
```

---

## 1️⃣7️⃣ `this` Inside Functions

`this` refers to the **object that called the function**.

```js
// Global context — 'this' = global object (window in browser)
console.log(this); // window / global

// Regular function — 'this' = depends on how it's called
function show() {
  console.log(this);
}
show();  // undefined (strict mode) or window (sloppy mode)

// Object method — 'this' = the object before the dot
const user = {
  name: "Arjun",
  greet() {
    console.log(this.name);  // "Arjun" — 'this' = user
  }
};
user.greet(); // "Arjun"

// Losing 'this' context — common bug
const greetFn = user.greet;
greetFn();   // ❌ undefined — 'this' is no longer 'user'

// Arrow function — NO own 'this', inherits from enclosing scope
const obj = {
  name: "Team Alpha",
  members: ["Arjun", "Priya"],
  list() {
    this.members.forEach(m => {
      console.log(`${this.name}: ${m}`); // ✅ 'this' = obj (arrow inherits)
    });
  }
};
obj.list();
```

---

## 1️⃣8️⃣ call(), apply(), bind()

Explicitly set `this` when calling a function.

### call() — Invoke immediately, pass args one by one

```js
function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const dev = { name: "Arjun" };

introduce.call(dev, "Hello", "!");
// "Hello, I'm Arjun!"
```

### apply() — Invoke immediately, pass args as array

```js
introduce.apply(dev, ["Hi", "."]);
// "Hi, I'm Arjun."

// ✅ Real use: Math.max with array
const nums = [3, 1, 4, 1, 5, 9];
Math.max.apply(null, nums);  // 9
// Modern: Math.max(...nums)  // preferred
```

### bind() — Returns NEW function with 'this' permanently set

```js
const greetArjun = introduce.bind(dev, "Hey");
// 'this' is fixed as dev, greeting is pre-filled

greetArjun("!");    // "Hey, I'm Arjun!"
greetArjun("...");  // "Hey, I'm Arjun..."

// Real-world: event handler with correct 'this'
class Button {
  constructor(label) {
    this.label = label;
    this.handleClick = this.handleClick.bind(this); // fix 'this'
  }
  handleClick() {
    console.log(`${this.label} clicked`);
  }
}
```

### 📊 call vs apply vs bind:

```
┌──────────┬──────────────────┬──────────────────────┬─────────────────────┐
│ Method   │ Invokes?         │ Args format          │ Returns             │
├──────────┼──────────────────┼──────────────────────┼─────────────────────┤
│ call     │ ✅ Immediately    │ Listed: fn(a, b)     │ Function result     │
│ apply    │ ✅ Immediately    │ Array: fn([a, b])    │ Function result     │
│ bind     │ ❌ Returns fn     │ Listed (pre-fill ok) │ New bound function  │
└──────────┴──────────────────┴──────────────────────┴─────────────────────┘

Use call  → immediate call, known args
Use apply → immediate call, dynamic args array
Use bind  → delayed call, event handlers, React class methods
```

---

## 1️⃣9️⃣ Recursion

A function that **calls itself** until a base condition is met.

```js
function factorial(n) {
  if (n <= 1) return 1;     // BASE CASE — stops recursion!
  return n * factorial(n - 1); // RECURSIVE CASE
}

factorial(5);
// 5 * factorial(4)
// 5 * 4 * factorial(3)
// 5 * 4 * 3 * factorial(2)
// 5 * 4 * 3 * 2 * factorial(1)
// 5 * 4 * 3 * 2 * 1 = 120
```

### 📊 Call Stack Visualization:

```
PUSH:                        POP (returning):
───────────────────          ────────────────────────
│ factorial(1) = 1  │        │ factorial(1) = 1     │ ← 1
│ factorial(2)      │        │ factorial(2) = 2*1=2 │ ← 2
│ factorial(3)      │        │ factorial(3) = 3*2=6 │ ← 6
│ factorial(4)      │        │ factorial(4) = 4*6=24│ ← 24
│ factorial(5)      │   →    │ factorial(5) = 5*24  │ ← 120
│ Global()          │        │ Global()             │
└───────────────────┘        └──────────────────────┘
```

### Real-World Recursive Examples:

```js
// 1. Fibonacci
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
fib(6); // 8

// 2. Flatten nested array
function flatten(arr) {
  return arr.reduce((acc, item) =>
    Array.isArray(item)
      ? [...acc, ...flatten(item)]  // recurse
      : [...acc, item],
    []
  );
}
flatten([1, [2, [3, [4]]]]); // [1, 2, 3, 4]

// 3. Traverse nested object (JSON)
function getAllValues(obj) {
  let values = [];
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      values = values.concat(getAllValues(obj[key])); // recurse
    } else {
      values.push(obj[key]);
    }
  }
  return values;
}
```

### ⚠️ Stack Overflow — Always define base case!

```js
function infinite() {
  return infinite(); // ❌ no base case → Maximum call stack exceeded
}
```

---

## 2️⃣0️⃣ Currying

Transform a function that takes **multiple arguments** into a series of functions each taking **one argument**.

```js
// Normal function
function add(a, b, c) {
  return a + b + c;
}
add(1, 2, 3); // 6

// Curried version
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

curriedAdd(1)(2)(3); // 6

// Arrow shorthand
const curriedAdd = a => b => c => a + b + c;
curriedAdd(1)(2)(3); // 6
```

### Real-World: Reusable partial application

```js
const multiply = a => b => a * b;

const double = multiply(2);   // a=2 fixed
const triple = multiply(3);   // a=3 fixed

double(5);  // 10
double(8);  // 16
triple(5);  // 15

// Real-world: API request builder
const request = method => url => body =>
  fetch(url, { method, body: JSON.stringify(body) });

const get  = request("GET");
const post = request("POST");

get("/api/users")();
post("/api/users")({ name: "Arjun" });
```

### 📊 Currying Visual:

```
add(1, 2, 3)           curriedAdd(1)(2)(3)
────────────           ───────────────────
ONE call               THREE calls
takes all args         each takes one arg
                       ↓
                       add(1)   → fn waiting for b
                       add(1)(2) → fn waiting for c
                       add(1)(2)(3) → 6
```

---

## 2️⃣1️⃣ Memoization

Cache the result of expensive function calls — if same args given again, return cached result.

```js
function memoize(fn) {
  const cache = {};   // private via closure

  return function(...args) {
    const key = JSON.stringify(args);

    if (key in cache) {
      console.log(`[cache hit] ${key}`);
      return cache[key];
    }

    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

// Expensive function
const slowSquare = memoize((n) => {
  // simulate slow computation
  return n * n;
});

slowSquare(5);   // computed: 25
slowSquare(5);   // [cache hit] → 25 (instant!)
slowSquare(6);   // computed: 36
slowSquare(6);   // [cache hit] → 36
```

### Real-World: Memoized Fibonacci

```js
const fib = memoize(function(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

fib(40);  // ← with memoization: O(n) — without: O(2^n)
```

### 📊 Without vs With Memoization:

```
fib(5) WITHOUT memo:        fib(5) WITH memo:
──────────────────          ─────────────────
fib(5)                      fib(5)
├── fib(4)                  ├── fib(4)
│   ├── fib(3)              │   ├── fib(3)  ← computed
│   │   ├── fib(2)          │   │   └── cached ✅
│   │   └── fib(1)          │   └── cached ✅
│   └── fib(2) ← repeated!  └── fib(3) ← cached ✅
└── fib(3) ← repeated!
    ├── fib(2) ← repeated!
    └── fib(1) ← repeated!

15 calls total              5 calls total ✅
```

---

## 2️⃣2️⃣ Function Composition

Combine multiple functions where output of one becomes input of the next.

```js
// compose: right to left (mathematical order)
const compose = (...fns) => value =>
  fns.reduceRight((acc, fn) => fn(acc), value);

// pipe: left to right (readable order — preferred)
const pipe = (...fns) => value =>
  fns.reduce((acc, fn) => fn(acc), value);

// Individual pure functions
const trim    = str => str.trim();
const lower   = str => str.toLowerCase();
const replace = str => str.replace(/\s+/g, "-");

// Compose them into one function
const slugify = pipe(trim, lower, replace);

slugify("  Hello World  "); // "hello-world"
slugify("  React JS  ");    // "react-js"
```

### Real-World Pipeline:

```js
const processUser = pipe(
  user => ({ ...user, name: user.name.trim() }),           // sanitize
  user => ({ ...user, email: user.email.toLowerCase() }),  // normalize
  user => ({ ...user, role: user.role || "viewer" }),      // default
  user => ({ ...user, createdAt: new Date().toISOString() }) // timestamp
);

const cleaned = processUser({
  name: "  Arjun Mehta  ",
  email: "ARJUN@EMAIL.COM",
  role: "",
});
// { name: "Arjun Mehta", email: "arjun@email.com", role: "viewer", createdAt: "..." }
```

---

## 2️⃣3️⃣ Common Mistakes & Traps

### ❌ 1. Calling function expression before declaration

```js
console.log(fn()); // ❌ TypeError: fn is not a function
var fn = function() { return "hello"; };

// ✅ Fix: use declaration (or define before calling)
console.log(fn2()); // ✅ works
function fn2() { return "hello"; }
```

---

### ❌ 2. Arrow function as object method (loses `this`)

```js
const user = {
  name: "Arjun",
  greet: () => `Hello, ${this.name}` // ❌ this = outer/global
};
user.greet(); // "Hello, undefined"

// ✅ Fix: use regular method
const user = {
  name: "Arjun",
  greet() { return `Hello, ${this.name}`; } // ✅
};
```

---

### ❌ 3. Forgetting `return` in arrow functions

```js
const double = n => { n * 2 };   // ❌ returns undefined (braces = body, needs return)
double(5);                         // undefined!

// ✅ Fix:
const double = n => n * 2;        // implicit return
const double = n => { return n * 2; }; // explicit return
```

---

### ❌ 4. Returning object literal from arrow — needs extra ()

```js
const getUser = id => { id, name: "Arjun" };  // ❌ JS sees {} as code block!

// ✅ Fix: wrap object in ()
const getUser = id => ({ id, name: "Arjun" });  // ✅
```

---

### ❌ 5. Using `arguments` object in arrow functions

```js
const fn = () => {
  console.log(arguments); // ❌ ReferenceError — arrows have no 'arguments'
};

// ✅ Fix: use rest params
const fn = (...args) => {
  console.log(args);  // ✅ real array
};
```

---

### ❌ 6. Recursion without base case

```js
function countDown(n) {
  console.log(n);
  return countDown(n - 1); // ❌ no base case → stack overflow!
}

// ✅ Fix
function countDown(n) {
  if (n <= 0) return; // base case
  console.log(n);
  return countDown(n - 1);
}
```

---

### ❌ 7. Default parameter with `null`

```js
function greet(name = "Guest") {
  console.log(name);
}

greet(undefined); // "Guest" ✅ default triggers
greet(null);      // null ❌ null does NOT trigger default
greet(0);         // 0    ❌ 0 does NOT trigger default
```

---

### ❌ 8. Mutating function parameters (objects pass by reference)

```js
function updateUser(user) {
  user.role = "admin"; // ❌ mutates the original object!
}

const arjun = { name: "Arjun", role: "viewer" };
updateUser(arjun);
console.log(arjun.role); // "admin" — CHANGED!

// ✅ Fix: return new object (immutable approach)
function updateUser(user) {
  return { ...user, role: "admin" }; // new object, original untouched
}
const updated = updateUser(arjun);
console.log(arjun.role);   // "viewer" ← unchanged ✅
```

---

## 2️⃣4️⃣ Interview Favorite Questions

### Q1 — What is the difference between function declaration and expression?

```js
// Declaration — hoisted fully, callable before definition
greet(); // ✅
function greet() { return "Hello"; }

// Expression — NOT hoisted, must define before calling
// hi(); // ❌ TypeError
const hi = function() { return "Hi"; };
hi(); // ✅ after definition
```

---

### Q2 — What will this output?

```js
var x = 1;

function outer() {
  var x = 2;

  function inner() {
    var x = 3;
    console.log(x); // ?
  }

  inner();
  console.log(x);   // ?
}

outer();
console.log(x);     // ?
```

```
Output:
3  ← inner's local x
2  ← outer's local x
1  ← global x
```

---

### Q3 — Output: var in callback

```js
for (var i = 1; i <= 3; i++) {
  setTimeout(function() { console.log(i); }, i * 100);
}
// Output: 4 4 4  (NOT 1 2 3)

// ✅ Fix 1: let (block scope per iteration)
for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), i * 100);
}
// 1 2 3

// ✅ Fix 2: IIFE (closure per iteration)
for (var i = 1; i <= 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), j * 100);
  })(i);
}
// 1 2 3
```

---

### Q4 — Implement your own `bind`

```js
Function.prototype.myBind = function(context, ...presetArgs) {
  const fn = this;  // the original function

  return function(...laterArgs) {
    return fn.apply(context, [...presetArgs, ...laterArgs]);
  };
};

function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const dev = { name: "Arjun" };
const boundGreet = greet.myBind(dev, "Hello");
boundGreet("!");  // "Hello, Arjun!"
```

---

### Q5 — What is the output?

```js
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

const add5  = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(3));    // ?
console.log(add10(3));   // ?
console.log(add5(10));   // ?
```

```
Output:
8   (5 + 3)
13  (10 + 3)
15  (5 + 10)
```

---

## ✅ Best Practices

✔️ Prefer `const` for function expressions and arrow functions  
✔️ Use arrow functions for callbacks — cleaner and no `this` binding issues  
✔️ Use regular methods for object methods — proper `this`  
✔️ Always define base case in recursion before recursive call  
✔️ Use early returns (guard clauses) instead of deep nesting  
✔️ Keep functions small and single-purpose (Single Responsibility)  
✔️ Name your functions — avoid anonymous functions in production  
✔️ Provide `initialValue` in `reduce()` always  
✔️ Use rest params `...args` instead of `arguments` object  
✔️ Write pure functions wherever possible — easier to test and debug

---

## 🧾 Final Summary

| Feature | Behavior |
|---|---|
| Function Declaration | Fully hoisted, callable before definition |
| Function Expression | Not hoisted, stored in variable |
| Arrow Function | Short syntax, no own `this`, no `arguments` |
| IIFE | Runs immediately, creates private scope |
| Default Params | Triggers on `undefined` only |
| Rest Params | Collects remaining args as real Array |
| `return` | Stops execution, sends value back |
| Pure Function | Same input → same output, no side effects |
| Closure | Inner function remembers outer scope |
| HOF | Takes/Returns a function |
| Callback | Function passed as argument, called later |
| Currying | `f(a,b,c)` → `f(a)(b)(c)` |
| Memoization | Cache results for same inputs |
| Composition | Chain functions: output → next input |
| `call/apply/bind` | Explicitly set `this` |
| Recursion | Function calls itself with base case |

---

## 🎯 Key Takeaways

```
FUNCTION MENTAL MODEL:
──────────────────────────────────────────────
Input → Process → Output

HOISTING RULE:
──────────────────────────────────────────────
Declaration → fully hoisted (name + body)
Expression  → not hoisted (treated as variable)
Arrow       → not hoisted (same as expression)

THIS RULE:
──────────────────────────────────────────────
Regular fn  → 'this' depends on who called it
Arrow fn    → 'this' inherited from outer scope
Method      → 'this' = object before the dot
call/bind   → 'this' set explicitly

PURITY RULE:
──────────────────────────────────────────────
Pure fn   → predictable, testable, no side effects
Impure fn → side effects (DB, DOM, network, time)

POWER TRIO:
──────────────────────────────────────────────
HOF + Closure + Currying = Functional JS mastery
```

---

*File: `d:\code_fusion\content\tutorials\js\js-functions.md`*  
*Series order: Variables & Data Types → Execution Context → Hoisting → Scope & Closures → Arrays → **Functions (this file)***

