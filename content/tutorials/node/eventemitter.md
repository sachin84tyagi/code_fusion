Perfect! Now let's learn one of the most useful Node.js concepts.

# Chapter 3 — EventEmitter

> **If the Event Loop is Node.js's Heart ❤️, then EventEmitter is its Nervous System 🧠.**

Many built-in Node.js modules (HTTP, Streams, File System, Process) use EventEmitter internally.

---

# 👶 Level 1 — Child Explanation

Imagine you're in school.

The teacher says:

> 🔔 "When the school bell rings, everyone go home."

Students don't continuously ask:

> "Has the bell rung?"
> "Has the bell rung?"

Instead...

The bell rings **once**.

Everyone reacts.

This is called an **Event**.

---

Another example.

Your phone.

When someone calls you

📞 Phone rings

You answer.

Your phone doesn't keep asking:

> "Should I ring?"
> "Should I ring?"

It waits.

When an event happens

It reacts.

Node.js works exactly like this.

---

# What is an Event?

An event means

> **Something happened.**

Examples

```text
Button Clicked

↓

User Logged In

↓

File Uploaded

↓

Email Sent

↓

Payment Success

↓

Server Started
```

Every one of these is an **Event**.

---

# What is EventEmitter?

EventEmitter is a class that allows one object to:

* Emit (fire) an event
* Listen for an event
* React to an event

Think of it like WhatsApp.

One person sends a message.

Everyone in the group immediately receives it.

---

# Real-Life Example 🚪

Imagine a smart home.

There are devices:

```text
Door Sensor

Alarm

Light

Camera

Mobile Notification
```

When someone opens the door

Door Sensor says

```text
Door Opened!
```

Immediately

Alarm starts

↓

Lights turn on

↓

Camera records

↓

Mobile receives notification

The door doesn't know about the alarm or camera. It simply emits an event.

---

# Node.js Example

Node provides a built-in module called `events`.

```javascript
const EventEmitter = require("events");

const emitter = new EventEmitter();
```

Think of `emitter` as a loudspeaker.

---

# Step 1 — Listen for an Event

```javascript
emitter.on("login", () => {
    console.log("User Logged In");
});
```

Nothing happens yet.

We only registered a listener.

---

# Step 2 — Emit the Event

```javascript
emitter.emit("login");
```

Output

```text
User Logged In
```

Simple!

---

# Full Example

```javascript
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("welcome", () => {
    console.log("Welcome to Node.js!");
});

emitter.emit("welcome");
```

Output

```text
Welcome to Node.js!
```

---

# Step-by-Step Flow

```text
Program Starts

↓

Register Listener

↓

Wait...

↓

Event Happens

↓

Listener Executes

↓

Program Continues
```

---

# Multiple Listeners

One event can have many listeners.

```javascript
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("payment", () => {
    console.log("Send Invoice");
});

emitter.on("payment", () => {
    console.log("Send Email");
});

emitter.on("payment", () => {
    console.log("Update Database");
});

emitter.emit("payment");
```

Output

```text
Send Invoice

Send Email

Update Database
```

One event.

Three actions.

---

# Passing Data

Events can carry data.

```javascript
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("user", (name) => {
    console.log(`Welcome ${name}`);
});

emitter.emit("user", "Sachin");
```

Output

```text
Welcome Sachin
```

---

More data

```javascript
emitter.on("order", (id, amount) => {
    console.log(id);
    console.log(amount);
});

emitter.emit("order", 101, 2500);
```

Output

```text
101

2500
```

---

# Real Company Example

Imagine Amazon.

Customer places an order.

Instead of one giant function doing everything:

```text
Place Order

↓

Save Order

↓

Update Inventory

↓

Send Email

↓

Generate Invoice

↓

Reward Points

↓

SMS
```

A cleaner approach is event-driven.

```text
Order Created Event

↓

Inventory Service

↓

Email Service

↓

SMS Service

↓

Invoice Service

↓

Reward Service
```

Each service listens for the event and performs its own task independently.

---

# once()

Sometimes you want an event to run only one time.

```javascript
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.once("login", () => {
    console.log("First Login");
});

emitter.emit("login");

emitter.emit("login");
```

Output

```text
First Login
```

Only once.

---

# removeListener()

Suppose

A user logs out.

No more notifications.

```javascript
function notify() {
    console.log("Notification");
}

emitter.on("message", notify);

emitter.removeListener("message", notify);

emitter.emit("message");
```

Nothing happens.

---

# EventEmitter Behind the Scenes

Many Node.js modules emit events.

## File Stream

```javascript
stream.on("data", () => {

});

stream.on("end", () => {

});
```

---

## HTTP Server

```javascript
server.on("request", () => {

});
```

---

## Process

```javascript
process.on("exit", () => {

});
```

---

## Readline

```javascript
rl.on("line", () => {

});
```

Everything is event-based.

---

# Mini Project — Door Bell

```javascript
const EventEmitter = require("events");

const bell = new EventEmitter();

bell.on("ring", () => {
    console.log("Someone is at the door");
});

bell.emit("ring");
```

Output

```text
Someone is at the door
```

---

# Mini Project — Chat Application

```javascript
const EventEmitter = require("events");

const chat = new EventEmitter();

chat.on("message", (user, msg) => {
    console.log(`${user}: ${msg}`);
});

chat.emit("message", "Rahul", "Hello");

chat.emit("message", "Amit", "Hi");
```

Output

```text
Rahul: Hello

Amit: Hi
```

---

# Mini Project — Online Shopping

```javascript
const EventEmitter = require("events");

const shop = new EventEmitter();

shop.on("orderPlaced", () => {
    console.log("Inventory Updated");
});

shop.on("orderPlaced", () => {
    console.log("Invoice Generated");
});

shop.on("orderPlaced", () => {
    console.log("Email Sent");
});

shop.emit("orderPlaced");
```

Output

```text
Inventory Updated

Invoice Generated

Email Sent
```

---

# Interview Questions

### Q1. What is EventEmitter?

**Answer:**

> EventEmitter is a Node.js class that enables event-driven programming by allowing objects to emit events and other parts of the application to listen and respond to those events.

---

### Q2. Difference between `on()` and `once()`?

| on()                | once()                       |
| ------------------- | ---------------------------- |
| Executes every time | Executes only the first time |

---

### Q3. Can one event have multiple listeners?

✅ Yes.

---

### Q4. Can data be passed with an event?

✅ Yes.

Example

```javascript
emitter.emit("login", "Sachin", 40);
```

---

# Professional Summary

```text
Application Starts
        │
        ▼
Create EventEmitter
        │
        ▼
Register Listeners (on/once)
        │
        ▼
Wait...
        │
        ▼
Event Happens (emit)
        │
        ▼
All Matching Listeners Execute
        │
        ▼
Application Continues
```

---

# 🎯 HCL MERN Assessment Tips

These are common questions around EventEmitter:

* What is EventEmitter?
* What is the difference between `emit()`, `on()`, and `once()`?
* How do you pass data through an event?
* Can multiple listeners listen to the same event?
* Which built-in Node.js modules use EventEmitter?

If you can confidently answer these and write the small examples above from memory, you're well prepared for this topic.

## Next Chapter

We'll move to **Chapter 4: Modules**, where you'll learn:

* What a module is
* Why modules exist
* `require()` vs `import`
* Creating your own modules
* How large Node.js applications organize their code into reusable files.
