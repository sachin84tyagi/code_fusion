Welcome to **Chapter 2 - Event Loop**.

> **This is the #1 most asked Node.js interview topic.**

Once you truly understand the Event Loop, concepts like **Promises, Async/Await, Streams, Express.js, APIs, and even React** become much easier.

---

# Learning Roadmap

We'll learn it in 6 levels.

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions
* 🚀 Level 6 – Professional Developer

---

# 👶 Level 1 — Child Explanation

Imagine you are doing homework.

Mom says

> "Wash your hands."

You go wash your hands.

While washing...

Mom says

> "After washing, drink milk."

But you don't stop washing.

You finish washing first.

Then drink milk.

Node.js works exactly like this.

It never stops doing the current work.

Instead it says

> "I'll do this later."

That "later" is handled by the **Event Loop**.

---

# Imagine a Restaurant

Restaurant has only one manager.

Customers come continuously.

```
Customer 1
Customer 2
Customer 3
Customer 4
```

Manager

```
Take Order

↓

Send to Kitchen

↓

Take Next Order

↓

Take Next Order

↓

Take Next Order
```

Manager never cooks.

Kitchen cooks.

When food is ready,

Kitchen informs manager.

Manager serves food.

Node.js behaves exactly like this.

---

# Beginner Level

Many people think

```
Node.js = Single Thread
```

This is only partly true.

Actually

```
JavaScript
       │
       ▼
Main Thread
       │
       ▼
Event Loop
       │
       ▼
Background Workers
```

The JavaScript code runs on one main thread, while long-running I/O work is delegated so the main thread can continue processing.

---

# What Does Event Loop Actually Do?

Imagine a security guard.

Every second he checks

```
Any visitor?

↓

Any completed work?

↓

Any timer finished?

↓

Any callback waiting?

↓

Repeat
```

Millions of times.

That's the Event Loop.

---

# Event Loop Components

There are five important parts.

```
Call Stack

Web APIs / Node APIs

Callback Queue

Microtask Queue

Event Loop
```

We'll learn each one.

---

# 1. Call Stack

This is where JavaScript executes code.

Example

```javascript
console.log("A");

console.log("B");

console.log("C");
```

Execution

```
Call Stack

↓

A

↓

B

↓

C

↓

Empty
```

Output

```
A
B
C
```

Easy.

---

# Live Example

```javascript
function first() {
    console.log("First");
}

function second() {
    console.log("Second");
}

first();
second();
```

Stack

```
second()

↓

first()

↓

Global()
```

Output

```
First
Second
```

---

# 2. Timer (setTimeout)

Now watch carefully.

```javascript
console.log("Start");

setTimeout(() => {
    console.log("Timeout");
}, 2000);

console.log("End");
```

Many beginners think

```
Start

(wait 2 sec)

Timeout

End
```

Wrong.

Actual output

```
Start

End

(wait)

Timeout
```

Why?

Because

`setTimeout()` does NOT execute immediately.

Instead

```
setTimeout()

↓

Timer

↓

Wait 2 sec

↓

Callback Queue
```

---

# Event Loop Flow

```
console.log("Start");

↓

Print

↓

setTimeout()

↓

Register Timer

↓

Continue

↓

console.log("End")

↓

Call Stack Empty

↓

Timer Finished

↓

Move Callback

↓

Execute Callback

↓

Print Timeout
```

---

# Practical Example

```javascript
console.log("1");

setTimeout(() => {
    console.log("2");
},0);

console.log("3");
```

Question

What will be output?

Many students answer

```
1
2
3
```

Wrong.

Correct

```
1

3

2
```

Why?

Even a `0ms` timer is **not executed immediately**. It becomes eligible to run only after the current call stack is empty.

---

# 3. Callback Queue

Imagine

```
Timer Finished

↓

Read File Finished

↓

Database Finished
```

Where do they wait?

```
Callback Queue
```

Like people waiting outside a doctor's cabin.

Only one enters when the doctor is free.

---

# Example

```javascript
setTimeout(() => {
    console.log("A");
},1000);

setTimeout(() => {
    console.log("B");
},2000);

setTimeout(() => {
    console.log("C");
},3000);
```

Queue

```
1 sec → A

2 sec → B

3 sec → C
```

Output

```
A
B
C
```

---

# 4. Microtask Queue

This is the **highest priority queue**.

It contains

* Promise.then()
* Promise.catch()
* Promise.finally()
* queueMicrotask()

Example

```javascript
console.log("Start");

Promise.resolve().then(() => {
    console.log("Promise");
});

console.log("End");
```

Output

```
Start

End

Promise
```

---

# Interesting Example

```javascript
console.log("A");

setTimeout(() => {
    console.log("Timeout");
},0);

Promise.resolve().then(() => {
    console.log("Promise");
});

console.log("B");
```

Think for 10 seconds...

---

Answer

```
A

B

Promise

Timeout
```

Why?

Priority

```
Call Stack

↓

Microtask Queue

↓

Callback Queue
```

Microtasks always run before timer callbacks once the current JavaScript execution finishes.

---

# Visual Diagram

```
Call Stack

↓

Microtask Queue

↓

Callback Queue

↓

Event Loop

↓

Repeat
```

---

# Company Example

Imagine

Amazon receives

```
10,000 Login Requests
```

Each login needs

* Read Database
* Compare Password
* Generate JWT
* Return User

While one user waits for the database,

Node accepts thousands of other incoming requests instead of blocking.

---

# Professional Flow

```
Client Request

↓

Call Stack

↓

Node APIs

↓

Background Work

↓

Callback Queue

↓

Event Loop

↓

Call Stack

↓

Response
```

---

# Interview Questions

## Question 1

**What is Event Loop?**

Best Answer

> The Event Loop is the mechanism that continuously checks whether the call stack is empty and then moves pending asynchronous callbacks or microtasks into the stack for execution.

---

## Question 2

**Why does setTimeout(fn,0) execute later?**

Answer

Because JavaScript first finishes all synchronous code. Only after the call stack is empty does the Event Loop process eligible timer callbacks.

---

## Question 3

Output?

```javascript
console.log("A");

setTimeout(()=>{
console.log("B");
},0);

console.log("C");
```

Answer

```
A

C

B
```

---

## Question 4

Output?

```javascript
console.log("1");

Promise.resolve().then(()=>{
console.log("2");
});

setTimeout(()=>{
console.log("3");
},0);

console.log("4");
```

Answer

```
1

4

2

3
```

Because the execution order is:

1. Synchronous code
2. Microtasks (Promises)
3. Timer callbacks

---

# Professional Summary

```
                JavaScript Starts
                        │
                        ▼
                  Call Stack
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
 Synchronous Code               Async APIs
                                        │
                                        ▼
                               Background Work
                                        │
                                        ▼
                ┌───────────────────────────────┐
                │                               │
                ▼                               ▼
       Microtask Queue                 Callback Queue
      (Promise.then, etc.)          (setTimeout, I/O)
                │                               │
                └───────────────┬───────────────┘
                                ▼
                           Event Loop
                                │
                                ▼
                           Call Stack
```

---

# 🎯 Mini Quiz

Without running the code, predict the output:

```javascript
console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

Promise.resolve().then(() => {
    console.log("C");
});

console.log("D");
```

Write your answer in the chat (for example: `A D C B`), and I'll explain every single step of how the Event Loop executes it—just like a debugger. After that, we'll move to **Chapter 3: EventEmitter**, where you'll learn how Node.js components communicate using events.
