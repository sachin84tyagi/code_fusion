# ⚡ Asynchronous JavaScript — Interview Canvas

---

## 1️⃣ What is Asynchronous JavaScript?

**Definition:**
Asynchronous JavaScript allows long‑running operations (I/O, timers, network, disk) to execute **without blocking the main thread**.

**Why it exists:**

* JavaScript is **single‑threaded**
* Blocking = frozen UI / stalled server

```js
console.log('Start');
setTimeout(() => console.log('Async'), 0);
console.log('End');
// Output: Start → End → Async
```

---

## 2️⃣ JavaScript Runtime Model

### 🧠 Core Components

| Component            | Role                      |
| -------------------- | ------------------------- |
| Call Stack           | Executes synchronous code |
| Web APIs / Node APIs | Handle async tasks        |
| Callback Queue       | Macrotasks                |
| Microtask Queue      | Promises                  |
| Event Loop           | Orchestrates execution    |

### 🔁 Flow Diagram

```
┌───────────────┐
│   Call Stack  │
└───────▲───────┘
        │
┌───────┴───────┐
│   Event Loop  │
└───────▲───────┘
        │
┌───────┴───────────┐
│ Microtask Queue   │ ← Promises
└───────────────────┘
┌───────────────────┐
│ Callback Queue    │ ← setTimeout, I/O
└───────────────────┘
```

---

## 3️⃣ Execution Order (🔥 Very Important)

**Rule:**

> Microtasks always run before Macrotasks

```js
setTimeout(() => console.log('timeout'));
Promise.resolve().then(() => console.log('promise'));
console.log('sync');

// Output: sync → promise → timeout
```

💡 **Interview Tip:**

* "Promises can starve the callback queue"

---

## 4️⃣ Callbacks

**Definition:**
A function passed as an argument, executed later.

```js
function fetchData(cb) {
  setTimeout(() => cb('data'), 1000);
}
```

### ❌ Callback Hell

```js
login(() => {
  fetchUser(() => {
    fetchPosts(() => {
      fetchComments(() => {})
    })
  })
})
```

**Problems:**

* Hard to read
* Error handling nightmare
* Inversion of control

---

## 5️⃣ Promises (ES6)

### 🔄 Promise States

* Pending → Fulfilled
* Pending → Rejected

```js
const p = new Promise((resolve, reject) => {
  resolve(42);
});
```

### 🔗 Chaining

```js
fetchUser()
  .then(user => fetchPosts(user.id))
  .then(posts => console.log(posts))
  .catch(err => console.error(err))
```

### ⚙️ Utilities

| Method             | Behavior        |
| ------------------ | --------------- |
| Promise.all        | Fail fast       |
| Promise.race       | First settled   |
| Promise.allSettled | Always resolves |

---

## 6️⃣ Async / Await (ES2017)

**What it is:**

* Syntactic sugar over Promises

```js
async function getData() {
  try {
    const user = await fetchUser();
    return user;
  } catch (e) {
    console.error(e);
  }
}
```

### ✅ Key Points

* `await` pauses function, **not thread**
* Always returns a Promise
* Use `try/catch` for errors

---

## 7️⃣ Microtasks vs Macrotasks

| Microtasks       | Macrotasks    |
| ---------------- | ------------- |
| Promise.then     | setTimeout    |
| queueMicrotask   | setInterval   |
| MutationObserver | setImmediate  |
|                  | I/O callbacks |

```js
setTimeout(() => console.log(1));
queueMicrotask(() => console.log(2));
Promise.resolve().then(() => console.log(3));
// Output: 2 → 3 → 1
```

---

## 8️⃣ Error Handling Patterns

### 🔥 Promise Errors

```js
fetchData()
  .then()
  .catch(err => console.log(err))
```

### 🔥 Async/Await Errors

```js
try {
  await fetchData();
} catch (e) {}
```

### 🌐 Global Errors

* `unhandledrejection`
* `window.onerror`

---

## 9️⃣ Parallel vs Sequential Execution

### ❌ Sequential (Slow)

```js
await a();
await b();
```

### ✅ Parallel (Fast)

```js
await Promise.all([a(), b()]);
```

💡 **Interview Insight:**

* Use parallel execution when tasks are independent

---

## 🔟 Async Iteration

```js
for await (const chunk of stream) {
  console.log(chunk);
}
```

**Used In:**

* Streams
* File processing
* Large APIs

---

## 1️⃣1️⃣ Timers & Scheduling

```js
setTimeout(fn, 0);   // Not immediate
setInterval(fn, 1000);
```

### ❓ Why `setTimeout(0)` is delayed?

* Waits for call stack to clear
* Then microtasks execute
* Then macrotask runs

---

## 🧠 Ultra-Quick Recap

* JS is **single-threaded + async via runtime**
* **Event Loop = brain**
* **Microtasks > Macrotasks priority**
* Prefer **Promises / async-await over callbacks**
* Use **Promise.all for performance**

---

## 🎯 Interview One-Liner

> "JavaScript handles async operations using the event loop, where microtasks (Promises) are executed before macrotasks (timers), ensuring non-blocking execution in a single-threaded environment."

---

## 🎬 Visual Flow — Memory + Event Loop (Step-by-Step)

### 🧠 Phase 1: Global Execution Context (Memory Creation)

```
Memory (Heap)
──────────────
a → undefined
fn → function()

Call Stack
──────────────
| Global() |
```

---

### ⚙️ Phase 2: Execution + Async Registration

```js
console.log('Start');
setTimeout(() => console.log('Timer'), 0);
Promise.resolve().then(() => console.log('Promise'));
console.log('End');
```

```
Call Stack            Web APIs          Queues
────────────          ─────────         ───────────────
console.log           setTimeout        Microtask: then()
(setup done)          (registered)      
                                         Callback: timer
```

---

### 🔁 Phase 3: Event Loop Animation

```
Step 1: Run Sync Code
Output → Start, End

Step 2: Process Microtasks
Output → Promise

Step 3: Process Macrotasks
Output → Timer
```

### 🔥 Final Order

```
Start → End → Promise → Timer
```

---

## 🧩 Deep Visual — Priority Model

```
While (true) {
  if (CallStack empty) {
    execute ALL Microtasks
    execute ONE Macrotask
  }
}
```

💡 Key Insight:

* Microtasks drain completely before next macrotask

---

## 🌍 Real-World Scenarios (Production Level)

### 1️⃣ API Calls (Frontend / Backend)

```js
async function loadUser() {
  const res = await fetch('/api/user');
  const data = await res.json();
  return data;
}
```

💡 What happens internally:

* `fetch` → Web API
* Response → Promise (microtask)
* UI stays responsive

---

### 2️⃣ Database Calls (Node.js)

```js
async function getUsers() {
  const users = await db.query('SELECT * FROM users');
  return users;
}
```

💡 Flow:

* DB handled by libuv (Node runtime)
* Callback → microtask (Promise resolution)
* Non-blocking server

---

### 3️⃣ React useEffect (Async UI Rendering)

```js
useEffect(() => {
  async function fetchData() {
    const data = await fetch('/api/posts').then(r => r.json());
    setPosts(data);
  }
  fetchData();
}, []);
```

💡 Behavior:

* Initial render (sync)
* Effect runs after paint
* State update triggers re-render

⚠️ Interview Catch:

* useEffect itself cannot be async

---

### 4️⃣ Parallel API Optimization

```js
const [user, posts] = await Promise.all([
  fetchUser(),
  fetchPosts()
]);
```

💡 Why it matters:

* Runs concurrently
* Reduces total latency

---

### 5️⃣ Node.js Streams (Large Data)

```js
for await (const chunk of stream) {
  process(chunk);
}
```

💡 Use Case:

* File upload/download
* Video streaming
* Memory efficient processing

---

### 6️⃣ Debouncing (UI Performance)

```js
let timer;
function handleSearch() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    fetchResults();
  }, 300);
}
```

💡 Prevents:

* Excess API calls
* Improves UX

---

## 🧠 Interview Edge Cases (🔥 Advanced)

### Case 1

```js
Promise.resolve().then(() => console.log(1));
queueMicrotask(() => console.log(2));
console.log(3);
```

Output:

```
3 → 1 → 2
```

---

### Case 2

```js
setTimeout(() => console.log('A'), 0);
Promise.resolve().then(() => {
  console.log('B');
  Promise.resolve().then(() => console.log('C'));
});
```

Output:

```
B → C → A
```

---

## 🎯 Final Mental Model (Must Remember)

```
1. Run Sync Code
2. Drain Microtasks (Promises)
3. Run One Macrotask
4. Repeat
```

---

## 🚀 One-Line Mastery

> "Async JavaScript works via the event loop, prioritizing microtasks over macrotasks, enabling non-blocking execution using a single-threaded model."
