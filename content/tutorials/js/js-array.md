# 🎯 JavaScript Arrays — Complete Guide

---

## 1️⃣ What is an Array?

An **Array** is an ordered, indexed collection of values stored in a single variable.

👉 Simple Meaning:

> Array = List of items stored together, accessible by position (index).

```js
let fruits = ["apple", "banana", "mango"];
//              0         1         2      ← index
```

📌 In JavaScript, arrays are **objects** (non-primitive) — stored by reference in heap memory.

```js
typeof []         // "object"
Array.isArray([]) // true ✅  ← correct way to check
```

---

## 2️⃣ Creating Arrays — All 4 Ways

### ✅ 1. Array Literal (Most Common)

```js
const skills = ["React", "Node", "Python"];
```

### ✅ 2. Array Constructor

```js
const arr = new Array(3);         // [empty × 3]  ← just length
const arr2 = new Array(1, 2, 3);  // [1, 2, 3]
```

⚠️ **Gotcha:**

```js
new Array(3)     // → [empty × 3]  (NOT [3])
new Array(1,2,3) // → [1, 2, 3]
```

### ✅ 3. Array.of() — Safe Constructor

```js
Array.of(3)      // → [3]   ← always creates array from args
Array.of(1,2,3)  // → [1, 2, 3]
```

### ✅ 4. Array.from() — Convert Iterables

```js
Array.from("hello")          // → ["h","e","l","l","o"]
Array.from({length: 3}, (_,i) => i)  // → [0, 1, 2]
Array.from(new Set([1,2,2,3])) // → [1, 2, 3]  ← deduplicate!
```

**Real-world:** Convert NodeList to array:

```js
const divs = Array.from(document.querySelectorAll("div")); // DOM → array
```

---

## 3️⃣ Array Indexing — Accessing Elements

```js
const team = ["Arjun", "Priya", "Rohan", "Sneha"];
//              0        1        2        3
```

```js
team[0]          // "Arjun"   ← first element
team[3]          // "Sneha"   ← last element
team[10]         // undefined  ← no error, just undefined
team[-1]         // undefined  ← negative index doesn't work in []
team.at(-1)      // "Sneha"  ✅ ← use .at() for negative index (ES2022)
team.at(-2)      // "Rohan"
team[team.length - 1]  // "Sneha"  ← older way
```

### 📊 Visual: Positive & Negative Index

```
Index (positive)  →   0       1       2       3
                    ┌───────┬───────┬───────┬───────┐
                    │ Arjun │ Priya │ Rohan │ Sneha │
                    └───────┴───────┴───────┴───────┘
Index (negative)  →  -4      -3      -2      -1
```

---

## 4️⃣ Array Properties

```js
const arr = [10, 20, 30];

arr.length    // 3 ← number of elements
```

⚠️ **length is mutable:**

```js
arr.length = 2;  // truncates → [10, 20]
arr.length = 5;  // expands  → [10, 20, empty × 3]
```

---

## 5️⃣ Mutating Methods (Modify Original Array)

> ⚠️ These change the original array directly.

---

### ✅ push() — Add to End

```js
const arr = [1, 2, 3];
arr.push(4);        // returns new length: 4
arr.push(5, 6);     // add multiple: [1,2,3,4,5,6]
console.log(arr);   // [1, 2, 3, 4, 5, 6]
```

**Real-world:** Add item to cart

---

### ✅ pop() — Remove from End

```js
const arr = [1, 2, 3];
const removed = arr.pop();   // returns removed element: 3
console.log(arr);            // [1, 2]
```

**Real-world:** Undo last action

---

### ✅ unshift() — Add to Start

```js
const arr = [2, 3];
arr.unshift(1);       // returns new length: 3
arr.unshift(-1, 0);   // [−1, 0, 1, 2, 3]
console.log(arr);     // [-1, 0, 1, 2, 3]
```

⚠️ Slower than `push` — shifts all existing elements

---

### ✅ shift() — Remove from Start

```js
const arr = [1, 2, 3];
const removed = arr.shift();  // returns: 1
console.log(arr);             // [2, 3]
```

⚠️ Slower than `pop` — re-indexes all elements

---

### ✅ splice() — The Swiss Army Knife (Add / Remove / Replace)

**Syntax:** `arr.splice(startIndex, deleteCount, ...itemsToAdd)`

```js
const arr = ["a", "b", "c", "d", "e"];

// REMOVE: delete 2 items starting at index 1
arr.splice(1, 2);
// removed: ["b","c"]  →  arr: ["a","d","e"]

// INSERT: at index 1, delete 0, add "X" "Y"
arr.splice(1, 0, "X", "Y");
// arr: ["a","X","Y","d","e"]

// REPLACE: at index 2, delete 1, add "Z"
arr.splice(2, 1, "Z");
// arr: ["a","X","Z","d","e"]
```

```
arr.splice(startIndex, deleteCount, newItem1, newItem2...)
              ↑            ↑             ↑
         where to start  how many    what to insert
                          to delete
```

**Real-world:** Edit/Remove a row in a table, insert notification

---

### ✅ sort() — Sort (MUTATES!)

```js
// Strings: alphabetically (default)
["banana", "apple", "mango"].sort()
// → ["apple", "banana", "mango"]

// Numbers: ❌ default sort is wrong for numbers!
[10, 2, 30, 1].sort()
// → [1, 10, 2, 30]  ← sorted as strings!

// ✅ Correct: use comparator function
[10, 2, 30, 1].sort((a, b) => a - b)    // ascending
// → [1, 2, 10, 30]

[10, 2, 30, 1].sort((a, b) => b - a)    // descending
// → [30, 10, 2, 1]
```

**Comparator Rule:**
```
(a, b) => a - b
   ↑      ↑
  if < 0 → a comes first (ascending)
  if > 0 → b comes first (descending)
  if = 0 → order unchanged
```

⚠️ **Always copy before sorting to avoid mutation:**

```js
const sorted = [...arr].sort((a, b) => a - b);   // ✅ safe copy
```

**Real-world:** Leaderboard ranking, sort products by price

---

### ✅ reverse() — Reverse Array (MUTATES!)

```js
const arr = [1, 2, 3];
arr.reverse();     // [3, 2, 1]
// original arr is CHANGED
```

✅ Safe way:

```js
const reversed = [...arr].reverse();  // copy first!
```

---

### ✅ fill() — Fill with Value (MUTATES!)

```js
new Array(5).fill(0)          // [0, 0, 0, 0, 0]
[1,2,3,4,5].fill(9, 2, 4)    // [1, 2, 9, 9, 5]
//                   ↑ ↑
//                start end (exclusive)
```

**Real-world:** Initialize grid, reset scores

---

## 6️⃣ Non-Mutating Methods (Return New Array)

> ✅ These never modify the original.

---

### ✅ slice() — Extract a Portion

**Syntax:** `arr.slice(startIndex, endIndex)`  — end is **exclusive**

```js
const arr = ["a", "b", "c", "d", "e"];

arr.slice(1, 3)   // ["b", "c"]  ← index 1,2 (not 3)
arr.slice(2)      // ["c", "d", "e"]  ← from index 2 to end
arr.slice(-2)     // ["d", "e"]  ← last 2 items
arr.slice()       // ["a","b","c","d","e"]  ← full shallow copy!
```

### 📊 slice vs splice

```
slice  → non-mutating, returns portion    ← READ only
splice → mutating, modifies original      ← READ + WRITE
```

**Real-world:** Pagination — show page 2 of 10 items per page:

```js
const page = 2;
const perPage = 10;
const results = data.slice((page - 1) * perPage, page * perPage);
```

---

### ✅ concat() — Merge Arrays

```js
const a = [1, 2];
const b = [3, 4];
const c = a.concat(b);          // [1, 2, 3, 4]
const d = a.concat(b, [5, 6]);  // [1, 2, 3, 4, 5, 6]
const e = [...a, ...b];         // same result — spread preferred
```

**Real-world:** Merge paginated API results

---

### ✅ flat() — Flatten Nested Arrays

```js
[1, [2, 3], [4, [5]]].flat()        // [1, 2, 3, 4, [5]]  ← 1 level
[1, [2, 3], [4, [5]]].flat(2)       // [1, 2, 3, 4, 5]    ← 2 levels
[1, [2, [3, [4]]]].flat(Infinity)   // [1, 2, 3, 4]        ← all levels
```

**Real-world:** Normalize nested API responses

---

## 7️⃣ Iteration Methods — The Power Tools

> ✅ These are the most important methods. Master these.

---

### ✅ forEach() — Loop with Side Effects

```js
const team = ["Arjun", "Priya", "Rohan"];

team.forEach((name, index) => {
  console.log(`${index}: ${name}`);
});
// 0: Arjun
// 1: Priya
// 2: Rohan
```

**Returns:** `undefined` (always)

⚠️ **Key rule:**  Use `forEach` only for side effects (logging, DOM updates).  
❌ Never use `forEach` when you need a returned value.

---

### ✅ map() — Transform → New Array

```js
const salaries = [80000, 95000, 110000];

const formatted = salaries.map(s => `₹${s.toLocaleString()}`);
// ["₹80,000", "₹95,000", "₹1,10,000"]

const bumped = salaries.map(s => s * 1.1);
// [88000, 104500, 121000]
```

```
map(callback(currentValue, index, array))
    ↑ each element → return transformed value
```

**Real-world:** Shape API data, render JSX lists in React

---

### ✅ filter() — Select Matching Items → New Array

```js
const team = [
  { name: "Arjun", active: true,  salary: 95000 },
  { name: "Priya", active: true,  salary: 82000 },
  { name: "Sneha", active: false, salary: 88000 },
];

const activeTeam = team.filter(dev => dev.active);
// [Arjun, Priya]

const highEarners = team.filter(dev => dev.salary > 90000);
// [Arjun]
```

**Real-world:** Active users, valid cart items, in-stock products

---

### ✅ reduce() — Fold to Single Value (Most Powerful)

**Syntax:** `arr.reduce(callback(accumulator, currentValue, index, array), initialValue)`

```js
// Sum
[10, 20, 30].reduce((acc, n) => acc + n, 0)   // 60

// Product
[1, 2, 3, 4].reduce((acc, n) => acc * n, 1)   // 24

// Max value
[3, 7, 1, 9, 4].reduce((max, n) => n > max ? n : max, -Infinity)  // 9
```

### 📊 Visual Step-by-Step (Sum):

```
Initial:   acc = 0

Step 1:    acc = 0  + 10 = 10
Step 2:    acc = 10 + 20 = 30
Step 3:    acc = 30 + 30 = 60

Result:    60
```

### 🔥 Advanced reduce — Real-World Patterns:

```js
const team = [
  { name: "Arjun", role: "Backend",  salary: 95000  },
  { name: "Priya", role: "Frontend", salary: 82000  },
  { name: "Rohan", role: "Backend",  salary: 110000 },
];

// 1. Total salary
const total = team.reduce((acc, dev) => acc + dev.salary, 0);
// 287000

// 2. Group by role → object
const byRole = team.reduce((groups, dev) => {
  if (!groups[dev.role]) groups[dev.role] = [];
  groups[dev.role].push(dev.name);
  return groups;
}, {});
// { Backend: ["Arjun","Rohan"], Frontend: ["Priya"] }

// 3. Build id→object lookup (O(1) access)
const byId = team.reduce((map, dev, i) => {
  map[i] = dev;
  return map;
}, {});

// 4. Count occurrences
const roleCounts = team.reduce((acc, dev) => {
  acc[dev.role] = (acc[dev.role] || 0) + 1;
  return acc;
}, {});
// { Backend: 2, Frontend: 1 }
```

---

### ✅ find() — First Match (or undefined)

```js
const team = [
  { id: 1, name: "Arjun", role: "Backend"  },
  { id: 2, name: "Priya", role: "Frontend" },
  { id: 3, name: "Rohan", role: "Backend"  },
];

const backend = team.find(dev => dev.role === "Backend");
// { id: 1, name: "Arjun", role: "Backend" }  ← FIRST match only

const notFound = team.find(dev => dev.role === "DevOps");
// undefined
```

**Real-world:** Find user by ID after login, lookup product by SKU

---

### ✅ findIndex() — Index of First Match (or -1)

```js
team.findIndex(dev => dev.id === 2)  // 1
team.findIndex(dev => dev.id === 99) // -1
```

**Real-world:** Edit item in array — find its index, then splice

```js
const idx = team.findIndex(dev => dev.id === 2);
if (idx !== -1) team[idx] = { ...team[idx], role: "Full-Stack" }; // update
```

---

### ✅ some() — Does ANY Element Match?

```js
const arr = [10, 25, 50, 100];

arr.some(n => n > 80)    // true  ← 100 qualifies
arr.some(n => n > 200)   // false ← none qualify
```

⚡ Short-circuits: stops checking as soon as `true` found.

**Real-world:** Check if user has admin role, if any item is out of stock

```js
const hasAdmin = users.some(u => u.role === "admin");
const hasInactive = team.some(dev => !dev.active);
```

---

### ✅ every() — Do ALL Elements Match?

```js
const arr = [10, 25, 50, 100];

arr.every(n => n > 0)    // true  ← all positive
arr.every(n => n > 20)   // false ← 10 fails
```

⚡ Short-circuits: stops as soon as `false` found.

**Real-world:** Validate all form fields, check all items in stock

```js
const allActive = team.every(dev => dev.active);
const formValid = fields.every(f => f.value.trim() !== "");
```

---

### ✅ includes() — Does Value Exist?

```js
[1, 2, 3].includes(2)         // true
[1, 2, 3].includes(5)         // false
["a", "b"].includes("a")      // true

// ✅ Works with NaN (unlike indexOf)
[NaN].includes(NaN)           // true
[NaN].indexOf(NaN)            // -1  ← indexOf can't find NaN
```

**Real-world:** Check if tag exists, if role is allowed

```js
const allowedRoles = ["admin", "editor", "viewer"];
if (allowedRoles.includes(user.role)) { /* grant access */ }
```

---

### ✅ flatMap() — Map + Flat(1) in One Step

```js
const sentences = ["Hello World", "React JS"];

sentences.flatMap(s => s.split(" "))
// ["Hello", "World", "React", "JS"]

// Compare:
sentences.map(s => s.split(" "))
// [["Hello","World"], ["React","JS"]]  ← nested

sentences.map(s => s.split(" ")).flat()
// ["Hello", "World", "React", "JS"]   ← same as flatMap
```

**Real-world:** Expand each user's skills into a flat list

```js
const allSkills = team.flatMap(dev => dev.skills);
// ["Node","Python","React","TypeScript","LangChain","Docker"]
```

---

## 8️⃣ Search Methods

### ✅ indexOf() / lastIndexOf()

```js
const arr = ["a", "b", "c", "b", "a"];

arr.indexOf("b")       // 1  ← first occurrence
arr.lastIndexOf("b")   // 3  ← last occurrence
arr.indexOf("z")       // -1 ← not found
```

⚠️ Cannot find `NaN` — use `includes()` instead.

---

### ✅ findLast() / findLastIndex() (ES2023)

```js
const arr = [5, 12, 8, 130, 44];

arr.findLast(n => n > 10)       // 44  ← last match
arr.findLastIndex(n => n > 10)  // 4   ← index of last match
```

---

## 9️⃣ Transformation Methods

### ✅ join() — Array → String

```js
["React", "Node", "Python"].join(", ")   // "React, Node, Python"
["a", "b", "c"].join("")                 // "abc"
["a", "b", "c"].join("-")                // "a-b-c"
["a", "b", "c"].join()                   // "a,b,c"  ← default comma
```

**Real-world:** CSV export, build URL paths, display tags

---

### ✅ toString()

```js
[1, 2, 3].toString()   // "1,2,3"  ← same as .join(',')
```

---

## 🔟 Iterator Methods

### ✅ entries() — [index, value] pairs

```js
for (const [index, value] of ["a", "b", "c"].entries()) {
  console.log(index, value);
}
// 0 "a"
// 1 "b"
// 2 "c"
```

### ✅ keys() — Indices only

```js
for (const i of ["a","b","c"].keys()) console.log(i); // 0 1 2
```

### ✅ values() — Values only

```js
for (const v of ["a","b","c"].values()) console.log(v); // a b c
```

---

## 1️⃣1️⃣ Immutability — The Most Important Rule

> ⚠️ Arrays are passed **by reference** — mutating them affects the original everywhere.

### ❌ Wrong (Mutating shared state)

```js
const state = [1, 2, 3];
const copy  = state;         // same reference!
copy.push(4);

console.log(state);          // [1, 2, 3, 4]  ← state is CHANGED
```

### ✅ Correct — Shallow Copy Methods

```js
const state = [1, 2, 3];

const copy1 = [...state];             // spread  ← preferred
const copy2 = state.slice();          // slice with no args
const copy3 = Array.from(state);      // Array.from
const copy4 = state.concat();         // concat with nothing

copy1.push(4);
console.log(state);   // [1, 2, 3]  ← original untouched ✅
```

### ⚠️ Shallow vs Deep Copy

```js
const deep = [[1, 2], [3, 4]];

const shallow = [...deep];     // shallow copy
shallow[0].push(99);

console.log(deep[0]);          // [1, 2, 99] ← nested object CHANGED!
// because shallow[0] and deep[0] point to the SAME array

// ✅ True deep copy:
const deepCopy = structuredClone(deep);
deepCopy[0].push(99);
console.log(deep[0]);          // [1, 2]  ← unchanged ✅
```

### 📊 Memory Model: Shallow vs Deep

```
SHALLOW COPY              DEEP COPY
─────────────────         ─────────────────
Stack     Heap            Stack     Heap
┌───┐     ┌──────┐        ┌───┐     ┌──────┐
│ a ──────► [1,2] │        │ a ──────► [1,2] │
│ b ──────► [1,2] │        │ b ──────► [1,2] │ ← new copy
└───┘     └──────┘        └───┘     └──────┘
 same reference!           different objects!
```

---

## 1️⃣2️⃣ Immutable Array Patterns (React / State Management)

> ✅ In React, state must never be directly mutated — always return new arrays.

### Add Item

```js
// ❌ Wrong
state.push(newItem);
setState(state);

// ✅ Correct
setState([...state, newItem]);
setState(prev => [...prev, newItem]);   // with functional update
```

### Remove Item

```js
// ❌ Wrong
state.splice(index, 1);
setState(state);

// ✅ Correct
setState(state.filter(item => item.id !== id));
```

### Update Item

```js
// ❌ Wrong
state[index].name = "New Name";
setState(state);

// ✅ Correct
setState(state.map(item =>
  item.id === id ? { ...item, name: "New Name" } : item
));
```

### Reorder / Sort

```js
// ❌ Wrong — sort mutates!
state.sort((a, b) => a.price - b.price);
setState(state);

// ✅ Correct
setState([...state].sort((a, b) => a.price - b.price));
```

---

## 1️⃣3️⃣ Method Chaining — Compose Multiple Operations

```js
const team = [
  { name: "Arjun", role: "Backend",  salary: 95000,  active: true  },
  { name: "Priya", role: "Frontend", salary: 82000,  active: true  },
  { name: "Rohan", role: "AI/ML",    salary: 110000, active: true  },
  { name: "Sneha", role: "DevOps",   salary: 88000,  active: false },
];

// Top 2 active developer names sorted by salary
const result = team
  .filter(dev => dev.active)               // step 1: active only
  .sort((a, b) => b.salary - a.salary)     // step 2: sort descending
  .slice(0, 2)                             // step 3: top 2
  .map(dev => `${dev.name}: ₹${dev.salary.toLocaleString()}`); // step 4: format

// ["Rohan: ₹1,10,000", "Arjun: ₹95,000"]
```

### 📊 Chain Flow Visual

```
team (4 items)
    ↓ filter(active)    → 3 items [Arjun, Priya, Rohan]
    ↓ sort(salary desc) → 3 items [Rohan, Arjun, Priya]
    ↓ slice(0, 2)       → 2 items [Rohan, Arjun]
    ↓ map(format)       → 2 strings
    = ["Rohan: ₹1,10,000", "Arjun: ₹95,000"]
```

---

## 1️⃣4️⃣ Real-World Patterns

### 🛒 E-Commerce Cart

```js
const cart = [
  { id: 1, name: "Laptop",  price: 75000, qty: 1 },
  { id: 2, name: "Mouse",   price: 1500,  qty: 2 },
  { id: 3, name: "Monitor", price: 25000, qty: 1 },
];

// Total price
const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
// 103000

// Remove item
const removed = cart.filter(item => item.id !== 2);

// Update quantity
const updated = cart.map(item =>
  item.id === 1 ? { ...item, qty: 2 } : item
);

// Check if expensive item in cart
const hasExpensive = cart.some(item => item.price > 50000);   // true

// Check all items available
const allAvailable = cart.every(item => item.qty > 0);         // true

// Top 2 most expensive
const topItems = [...cart]
  .sort((a, b) => b.price - a.price)
  .slice(0, 2)
  .map(item => item.name);
// ["Laptop", "Monitor"]
```

---

### 🔑 Auth System

```js
const users = [
  { id: 1, name: "Arjun", role: "admin",  active: true  },
  { id: 2, name: "Priya", role: "editor", active: true  },
  { id: 3, name: "Rohan", role: "viewer", active: false },
];

// Login lookup
const user = users.find(u => u.name === "Arjun" && u.active);

// Admin check
const isAdmin = users.some(u => u.id === 1 && u.role === "admin");

// Active users only
const activeUsers = users.filter(u => u.active);

// Role-based access
const allowedRoles = ["admin", "editor"];
const canEdit = allowedRoles.includes(user?.role);

// Build name list
const names = users.map(u => u.name).join(", ");  // "Arjun, Priya, Rohan"
```

---

### 📊 Dashboard / Analytics

```js
const transactions = [
  { month: "Jan", amount: 45000 },
  { month: "Feb", amount: 62000 },
  { month: "Mar", amount: 38000 },
  { month: "Apr", amount: 71000 },
];

// Total revenue
const revenue = transactions.reduce((sum, t) => sum + t.amount, 0);

// Monthly trend (sorted)
const sorted = [...transactions].sort((a, b) => a.amount - b.amount);

// Best month
const best = transactions.reduce((max, t) =>
  t.amount > max.amount ? t : max
);
// { month: "Apr", amount: 71000 }

// Months above average
const avg = revenue / transactions.length;
const aboveAvg = transactions.filter(t => t.amount > avg).map(t => t.month);
```

---

## 1️⃣5️⃣ Sorting — Deep Dive

```js
// Strings — natural alphabetical
["mango","apple","banana"].sort()
// ["apple","banana","mango"]

// Numbers — ALWAYS use comparator!
[100, 2, 30].sort()              // ❌ ["100","2","30"] — string sort!
[100, 2, 30].sort((a,b) => a-b) // ✅ [2, 30, 100]

// Objects by string property
const devs = [
  { name: "Rohan", salary: 110000 },
  { name: "Arjun", salary: 95000  },
  { name: "Priya", salary: 82000  },
];

devs.sort((a, b) => a.name.localeCompare(b.name));  // alphabetical name
// [Arjun, Priya, Rohan]

devs.sort((a, b) => b.salary - a.salary);           // salary desc
// [Rohan, Arjun, Priya]

// Multi-criteria sort
devs.sort((a, b) =>
  a.role !== b.role
    ? a.role.localeCompare(b.role)     // sort by role first
    : b.salary - a.salary              // then by salary desc
);
```

### 📊 Comparator Logic Table

```
(a, b) return value:
┌─────────────┬───────────────────────────────┐
│  Return < 0 │ a comes BEFORE b              │
│  Return > 0 │ b comes BEFORE a              │
│  Return = 0 │ order unchanged               │
└─────────────┴───────────────────────────────┘

Ascending  → (a, b) => a - b   (smaller first)
Descending → (a, b) => b - a   (larger first)
```

---

## 1️⃣6️⃣ Destructuring + Spread with Arrays

### Array Destructuring

```js
const [first, second, ...rest] = ["Arjun", "Priya", "Rohan", "Sneha"];
first   // "Arjun"
second  // "Priya"
rest    // ["Rohan", "Sneha"]

// Skip elements
const [, , third] = ["a", "b", "c"];
third   // "c"

// Default values
const [x = 10, y = 20] = [5];
x  // 5
y  // 20 ← default used

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a];
// a = 2, b = 1
```

### Spread in Arrays

```js
const a = [1, 2, 3];
const b = [4, 5, 6];

// Merge
const merged = [...a, ...b];       // [1,2,3,4,5,6]

// Clone
const clone = [...a];              // new array, same values

// Prepend/Append
const withStart = [0, ...a];       // [0,1,2,3]
const withEnd   = [...a, 4];       // [1,2,3,4]

// Pass as arguments
Math.max(...[3, 1, 4, 1, 5, 9])   // 9
```

---

## 1️⃣7️⃣ Looping Over Arrays — All Ways

```js
const arr = ["a", "b", "c"];

// 1. Classic for loop — most flexible
for (let i = 0; i < arr.length; i++) {
  console.log(i, arr[i]);
}

// 2. for...of — cleanest for values
for (const val of arr) {
  console.log(val);
}

// 3. for...of with entries() — index + value
for (const [i, val] of arr.entries()) {
  console.log(i, val);
}

// 4. forEach — side effects
arr.forEach((val, i) => console.log(i, val));

// 5. while — when condition is more complex
let i = 0;
while (i < arr.length) {
  console.log(arr[i++]);
}
```

### 📊 Loop Comparison

```
┌────────────────┬─────────────┬──────────────┬───────────────┐
│ Loop           │ Returns     │ break/skip   │ Best For      │
├────────────────┼─────────────┼──────────────┼───────────────┤
│ for            │ —           │ ✅            │ Full control  │
│ for...of       │ —           │ ✅            │ Clean values  │
│ forEach        │ undefined   │ ❌            │ Side effects  │
│ map            │ new array   │ ❌            │ Transform     │
│ filter         │ new array   │ ❌            │ Select        │
│ reduce         │ any value   │ ❌            │ Aggregate     │
└────────────────┴─────────────┴──────────────┴───────────────┘
```

---

## 1️⃣8️⃣ Common Mistakes & Traps

### ❌ 1. sort() mutates original

```js
const arr = [3, 1, 2];
const sorted = arr.sort();   // arr is now [1, 2, 3]!
// ✅ Fix: const sorted = [...arr].sort();
```

---

### ❌ 2. Default sort is string-based

```js
[10, 2, 100].sort()            // [10, 100, 2]  ← WRONG
[10, 2, 100].sort((a,b)=>a-b)  // [2, 10, 100]  ← CORRECT
```

---

### ❌ 3. forEach can't be broken out of

```js
// ❌ break doesn't work in forEach
arr.forEach(item => {
  if (item === "stop") break;   // SyntaxError!
});

// ✅ Use for...of instead
for (const item of arr) {
  if (item === "stop") break;   // works
}
```

---

### ❌ 4. forEach return value is always undefined

```js
const result = [1,2,3].forEach(n => n * 2);
console.log(result);   // undefined ← not [2,4,6]!
// ✅ Use map for transformation
const result2 = [1,2,3].map(n => n * 2);  // [2, 4, 6]
```

---

### ❌ 5. Checking if value is array

```js
typeof []      // "object"   ← wrong check!
[] instanceof Array  // true (works, but can fail cross-frame)

// ✅ Always use:
Array.isArray([])   // true
Array.isArray({})   // false
```

---

### ❌ 6. splice vs slice confusion

```js
const arr = [1, 2, 3, 4];
arr.splice(1, 2)    // MUTATES arr → returns [2,3]  arr=[1,4]
arr.slice(1, 2)     // no mutation → returns [2]    arr unchanged
```

---

### ❌ 7. indexOf can't find NaN

```js
[1, NaN, 3].indexOf(NaN)    // -1  ← fails!
[1, NaN, 3].includes(NaN)   // true ✅
```

---

### ❌ 8. Nested array spread is shallow

```js
const nested = [[1,2],[3,4]];
const copy   = [...nested];    // shallow — inner arrays still shared
copy[0].push(99);
console.log(nested[0]);        // [1,2,99] ← mutated!

// ✅ Deep copy
const deep = structuredClone(nested);
```

---

## 1️⃣9️⃣ Performance Notes

```
✅ Fast (O(1)):
  push, pop, at, length

⚠️ Slower (O(n)):
  shift, unshift (re-indexes everything)
  splice, sort, indexOf

🚨 Search Heavy → Use Map or Set instead of find/includes
   Map: O(1) lookup by key
   Set: O(1) membership check

Large Array Sorting: O(n log n)
  → V8 uses TimSort (hybrid merge+insertion)

Loop Speed (fastest → slowest):
  for > for...of > forEach > map/filter/reduce
  (in practice, difference is negligible unless 1M+ items)
```

---

## 2️⃣0️⃣ Interview Favorite Questions

### Q1 — Remove duplicates from array

```js
const arr = [1, 2, 2, 3, 3, 4];

// Method 1: Set (fastest)
[...new Set(arr)]                          // [1, 2, 3, 4]

// Method 2: filter + indexOf
arr.filter((val, i) => arr.indexOf(val) === i)  // [1, 2, 3, 4]

// Method 3: reduce
arr.reduce((acc, val) => acc.includes(val) ? acc : [...acc, val], [])
```

---

### Q2 — Flatten deeply nested array

```js
const nested = [1, [2, [3, [4, [5]]]]];

nested.flat(Infinity)      // [1, 2, 3, 4, 5]

// Manual recursive:
function flatten(arr) {
  return arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(flatten(val)) : [...acc, val], []
  );
}
```

---

### Q3 — Group array of objects by property

```js
const team = [
  { name: "Arjun", role: "Backend"  },
  { name: "Priya", role: "Frontend" },
  { name: "Rohan", role: "Backend"  },
];

const grouped = team.reduce((acc, dev) => {
  (acc[dev.role] = acc[dev.role] || []).push(dev.name);
  return acc;
}, {});
// { Backend: ["Arjun","Rohan"], Frontend: ["Priya"] }

// ES2024 — Object.groupBy (new!)
Object.groupBy(team, dev => dev.role);
```

---

### Q4 — Chunk array into smaller arrays

```js
function chunk(arr, size) {
  return Array.from(
    { length: Math.ceil(arr.length / size) },
    (_, i) => arr.slice(i * size, i * size + size)
  );
}

chunk([1,2,3,4,5,6,7], 3)
// [[1,2,3],[4,5,6],[7]]
```

---

### Q5 — Find intersection of two arrays

```js
const a = [1, 2, 3, 4];
const b = [3, 4, 5, 6];

const intersection = a.filter(x => b.includes(x));    // [3, 4]

// Efficient with Set:
const setB = new Set(b);
const fast = a.filter(x => setB.has(x));               // [3, 4]  O(n)
```

---

## ✅ Best Practices

✔️ Always use `Array.isArray()` to check arrays  
✔️ Prefer `const` for arrays (reference is const, contents can change)  
✔️ Spread copy before `sort()` and `reverse()`  
✔️ Use `map/filter/reduce` over manual `for` loops for readability  
✔️ Use `find()` not `filter()[0]` when you need one match  
✔️ Always provide `initialValue` to `reduce()` to avoid bugs on empty arrays  
✔️ Use `flatMap()` instead of `map().flat()` for performance  
✔️ Use `structuredClone()` for true deep copy  
✔️ Prefer `for...of` over `forEach` when you need `break`/`continue`  
✔️ Use `at(-1)` instead of `arr[arr.length - 1]`

---

## 🧾 Final Summary

| Category | Methods | Mutates? |
|---|---|---|
| **Add/Remove** | push, pop, shift, unshift | ✅ Yes |
| **CRUD** | splice | ✅ Yes |
| **Sort/Order** | sort, reverse, fill | ✅ Yes |
| **Extract** | slice, concat, flat, flatMap | ❌ No |
| **Transform** | map | ❌ No |
| **Filter** | filter | ❌ No |
| **Aggregate** | reduce, reduceRight | ❌ No |
| **Search** | find, findIndex, findLast, indexOf, lastIndexOf | ❌ No |
| **Validate** | some, every, includes | ❌ No |
| **Iterate** | forEach, entries, keys, values | ❌ No |
| **Create** | Array.from, Array.of, Array.isArray | ❌ No |
| **Access** | at | ❌ No |

---

## 🎯 Key Takeaways

```
ARRAY MENTAL MODEL:
──────────────────────────────────────────────
Ordered list → access by index (0-based)
Stored by reference → pass by reference
Dynamic → no fixed size or type

MUTATION RULE:
──────────────────────────────────────────────
Push/Pop/Sort/Splice/Reverse/Fill → MUTATES
Map/Filter/Reduce/Slice/Concat     → NEW ARRAY
→ Always spread copy before mutating ops!

POWER TRIO (Master these):
──────────────────────────────────────────────
map    → transform each item
filter → select matching items
reduce → fold to one value (most powerful)

IMMUTABILITY IN REACT:
──────────────────────────────────────────────
Add    → setState([...prev, newItem])
Remove → setState(prev.filter(...))
Update → setState(prev.map(...))
Sort   → setState([...prev].sort(...))
```

---

*File: `d:\code_fusion\content\tutorials\js\js-array.md`*  
*Series order: Variables & Data Types → Execution Context → Hoisting → Scope & Closures → **Arrays (this file)***

