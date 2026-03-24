# 🧠 JavaScript Objects — Ultimate Interview Cheat Sheet

---

## 1️⃣ What is an Object?

An object is a collection of **key–value pairs**:

* **Keys** → string or symbol
* **Values** → any data type (primitive, object, function)

```js
const user = {
  name: 'Sachin',
  age: 30,
  isAdmin: true,
};
```

### 🧩 Mental Model

```
Object
 ├─ key → value
 ├─ property → data
 └─ method → function
```

---

## 2️⃣ Object Creation Patterns (🔥 Interview Favorite)

### a) Object Literal (Most Used)

```js
const car = { brand: 'BMW', speed: 120 };
```

### b) new Object()

```js
const obj = new Object();
obj.x = 10;
```

### c) Constructor Function

```js
function User(name) {
  this.name = name;
}
const u1 = new User('Amit');
```

### d) ES6 Class (Syntax Sugar)

```js
class User {
  constructor(name) {
    this.name = name;
  }
}
```

### e) Object.create() (Prototype-based)

```js
const proto = { greet() { return 'Hi'; } };
const obj = Object.create(proto);
```

📌 **Interview Insight:**

```js
Object.create(null); // No prototype → pure dictionary
```

---

## 3️⃣ Property Descriptors (Deep Dive)

```js
Object.getOwnPropertyDescriptor(obj, 'key');
```

| Attribute    | Meaning                    |
| ------------ | -------------------------- |
| value        | actual value               |
| writable     | can modify value           |
| enumerable   | visible in loops           |
| configurable | can delete/modify property |

```js
Object.defineProperty(user, 'id', {
  value: 1,
  writable: false,
});
```

---

## 4️⃣ Accessing Properties

### Dot vs Bracket

```js
obj.name;
obj['first-name'];
```

### Optional Chaining (🔥)

```js
user?.profile?.email;
```

### Nullish Coalescing

```js
const role = user.role ?? 'guest';
```

---

## 5️⃣ Mutability & References

Objects are **reference types**:

```
obj1 ─┐
      ├─▶ { x: 10 }
obj2 ─┘
```

```js
const a = { x: 1 };
const b = a;
b.x = 2; // affects a
```

### Shallow vs Deep Copy

```js
const shallow = { ...obj };
const deep = structuredClone(obj);
```

---

## 6️⃣ Enumeration & Iteration

### for...in (includes prototype)

```js
for (let key in obj) {}
```

### Safe Iteration

```js
Object.keys(obj);
Object.values(obj);
Object.entries(obj);
```

---

## 7️⃣ Object Utility Methods (Must-Know)

| Method        | Purpose            |
| ------------- | ------------------ |
| Object.assign | merge objects      |
| Object.freeze | make immutable     |
| Object.seal   | no add/remove      |
| Object.hasOwn | own property check |

```js
Object.freeze(config);
```

---

## 8️⃣ Prototypes & Inheritance (🔥 Core JS)

### Prototype Chain

```
obj → prototype → Object.prototype → null
```

```js
function A() {}
A.prototype.say = () => 'hi';
```

### Important

* `prototype` → used by constructor
* `__proto__` → internal linkage

---

## 9️⃣ this in Objects

```js
const user = {
  name: 'Sachin',
  greet() {
    return this.name;
  }
};
```

⚠️ **Arrow functions do NOT bind `this`**

---

## 🔟 Objects vs Map (🔥 Interview Trap)

| Feature   | Object                | Map      |
| --------- | --------------------- | -------- |
| Keys      | string/symbol         | any type |
| Iteration | not directly iterable | iterable |
| Prototype | has issues            | clean    |

👉 Use **Map** for dynamic key collections.

---

## 1️⃣1️⃣ Performance Internals (Advanced)

### Hidden Classes (V8 Engine)

```js
const a = { x: 1 };
a.y = 2; // shape change → slower
```

❌ Avoid dynamic property addition

✅ Define all properties upfront

---

## 🚀 Final Interview Summary

* Objects = **reference type**
* Stored in **heap memory**
* Access via **dot / bracket**
* Prototype enables **inheritance**
* `this` depends on **call site**
* Use `Map` for **complex key scenarios**

---

💡 **Pro Tip:**
Master objects → You master JavaScript fundamentals (Closures, Prototypes, Execution Context)
