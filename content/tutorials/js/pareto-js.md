# JavaScript 80/20 — Pareto Mastery Reference

> **Audience:** Developer who knows programming basics and wants to master the JavaScript patterns that appear in 80% of real-world codebases.  
> **Goal:** One complete, runnable program + precise explanations covering the 20% of JS that gives 80% of practical power.  
> **Domain:** Developer Team Management system — consistent across all sections.  
> **Existing deep-dives:** `scope-closures.md`, `execution-context.md`, `asynchronous.md`, `array.md`, `objects.md` — this file is the **fast reference** that connects them all.

---

## The 20% That Covers 80%

| # | Topic | Why It's in the 20% |
|---|---|---|
| 1 | **`var` / `let` / `const` + hoisting** | Every JS file starts here — wrong choice = subtle bugs |
| 2 | **Functions — declarations, expressions, arrows, IIFE** | 80% of JS is functions inside functions |
| 3 | **Closures + scope** | The most misunderstood, most powerful feature |
| 4 | **Destructuring + spread + rest** | Modern JS — used in every React/Node codebase |
| 5 | **Array methods — map, filter, reduce, find, some, every** | Replaces 80% of for-loops in real code |
| 6 | **Objects — shorthand, computed keys, methods, `this`** | JS is prototype-based — objects are everywhere |
| 7 | **Classes + inheritance + `super`** | Modern OOP pattern used in frameworks |
| 8 | **Promises + async/await + error handling** | Every API call, file read, DB query needs this |
| 9 | **Modules — `import` / `export` (ESM)** | Every real project is multi-file |
| 10 | **Error handling + optional chaining + nullish coalescing** | Production-quality defensive code |

---

## Part 1 — Complete Code

```javascript
// ──────────────────────────────────────────────────────────────────
//  File: pareto-js.js
//  Environment: Node.js 18+ (ESM) — run with: node pareto-js.js
//  OR paste into browser DevTools console (remove import/export lines)
// ──────────────────────────────────────────────────────────────────

"use strict";

// ══════════════════════════════════════════════════════════════════
// 1. VAR vs LET vs CONST — Declarations & Hoisting
// ══════════════════════════════════════════════════════════════════

const APP_NAME    = "DevTracker";       // const — block-scoped, never reassigned
let   activeTeam  = "Alpha";            // let   — block-scoped, reassignable
// var  legacyVar = "avoid";            // var   — function-scoped, hoisted, avoid

// Hoisting demo — var is hoisted (undefined), let/const are NOT accessible before declaration
console.log(typeof hoistedVar);         // "undefined" — hoisted but not initialised
// console.log(hoistedLet);             // ❌ ReferenceError — Temporal Dead Zone
var   hoistedVar = "I was hoisted";
let   hoistedLet = "I was NOT hoisted";

// const with objects — reference is const, contents are mutable
const CONFIG = { version: "2.0", maxTeamSize: 10 };
CONFIG.version = "2.1";                 // ✅ allowed — mutating property
// CONFIG = {};                         // ❌ TypeError — cannot reassign const

// ══════════════════════════════════════════════════════════════════
// 2. FUNCTIONS — Declaration, Expression, Arrow, IIFE, Default Params
// ══════════════════════════════════════════════════════════════════

// Function Declaration — hoisted, can call before definition
function formatSalary(amount, currency = "INR") {   // default parameter
  return `${currency} ${amount.toLocaleString("en-IN")}`;
}

// Function Expression — NOT hoisted, stored in variable
const calcBonus = function(salary, percentage = 10) {
  return salary * (percentage / 100);
};

// Arrow Function — shorter syntax, no own `this`
const getInitials = (name) => name.split(" ").map(w => w[0]).join("").toUpperCase();

// Arrow with implicit return (single expression — no braces, no return keyword)
const double = n => n * 2;

// IIFE — Immediately Invoked Function Expression
// Runs once immediately — creates private scope
const teamConfig = (() => {
  const _private = "this is encapsulated";   // not accessible outside
  return { maxSize: 5, region: "APAC" };     // only return what's needed
})();

console.log(formatSalary(95000));             // "INR 95,000"
console.log(calcBonus(95000, 15));            // 14250
console.log(getInitials("Arjun Mehta"));      // "AM"
console.log(teamConfig.maxSize);              // 5

// ══════════════════════════════════════════════════════════════════
// 3. CLOSURES — Functions that remember their outer scope
// ══════════════════════════════════════════════════════════════════

// Closure: counter factory — each call creates independent state
function createCounter(label, start = 0) {
  let count = start;                    // this variable is "closed over"
  return {
    increment: ()  => ++count,
    decrement: ()  => --count,
    reset:     ()  => { count = start; },
    value:     ()  => count,
    toString:  ()  => `${label}: ${count}`,
  };
}

const loginCounter  = createCounter("Logins",  0);
const bugCounter    = createCounter("Bugs",   10);

loginCounter.increment();
loginCounter.increment();
bugCounter.decrement();

console.log(loginCounter.toString());   // "Logins: 2"
console.log(bugCounter.toString());     // "Bugs: 9"
// loginCounter and bugCounter each have their own private `count`

// Closure: memoization — cache expensive computation
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`[cache hit] ${key}`);
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalc = memoize((n) => {
  // simulate heavy computation
  return n * n * n;
});

console.log(expensiveCalc(5));          // computed: 125
console.log(expensiveCalc(5));          // [cache hit] — 125
console.log(expensiveCalc(6));          // computed: 216

// ══════════════════════════════════════════════════════════════════
// 4. DESTRUCTURING + SPREAD + REST
// ══════════════════════════════════════════════════════════════════

// Object destructuring — with rename and default value
const developer = {
  name:       "Priya Sharma",
  role:       "Frontend",
  salary:     82000,
  skills:     ["React", "TypeScript", "Node"],
  address:    { city: "Bangalore", country: "India" },
};

const { name, role, salary, skills, address: { city } } = developer;
const { name: devName, experience = 3 } = developer;   // rename + default

// Array destructuring
const [primarySkill, secondarySkill, ...otherSkills] = skills;
console.log(primarySkill);              // "React"
console.log(otherSkills);              // ["Node"]

// Destructuring in function params (most common pattern in React/Node)
function displayDev({ name, role, salary, skills = [] }) {
  return `${name} (${role}) — ${formatSalary(salary)} — ${skills.join(", ")}`;
}
console.log(displayDev(developer));

// Spread — expand iterable/object
const updatedDev = { ...developer, salary: 90000, city: "Mumbai" };   // object spread
const moreSkills = [...skills, "Python", "Docker"];                    // array spread
console.log(updatedDev.salary);         // 90000
console.log(moreSkills.length);         // 5

// Rest in function params — collect remaining args into array
function logActivity(timestamp, action, ...details) {
  console.log(`[${timestamp}] ${action}:`, details);
}
logActivity("2024-01-15", "LOGIN", "user=priya", "ip=192.168.1.1", "2FA=true");

// Swap without temp variable using destructuring
let a = "alpha", b = "beta";
[a, b] = [b, a];
console.log(a, b);                      // "beta", "alpha"

// ══════════════════════════════════════════════════════════════════
// 5. ARRAY METHODS — The Power Tools
// ══════════════════════════════════════════════════════════════════

const team = [
  { id: 1, name: "Arjun Mehta",  role: "Backend",  salary: 95000,  active: true,  skills: ["Node", "Python"] },
  { id: 2, name: "Priya Sharma", role: "Frontend", salary: 82000,  active: true,  skills: ["React", "TypeScript"] },
  { id: 3, name: "Rohan Verma",  role: "AI/ML",    salary: 110000, active: true,  skills: ["Python", "LangChain"] },
  { id: 4, name: "Sneha Patel",  role: "DevOps",   salary: 88000,  active: false, skills: ["Docker", "K8s"] },
];

// map — transform each element → new array (does not mutate original)
const names        = team.map(dev => dev.name);
const salaryBumped = team.map(dev => ({ ...dev, salary: dev.salary * 1.1 }));

// filter — keep elements matching condition → new array
const activeDevs   = team.filter(dev => dev.active);
const highEarners  = team.filter(dev => dev.salary > 90000);

// reduce — fold array into single value (most powerful, most complex)
const totalSalary  = team.reduce((acc, dev) => acc + dev.salary, 0);
const byRole       = team.reduce((acc, dev) => {
  if (!acc[dev.role]) acc[dev.role] = [];
  acc[dev.role].push(dev.name);
  return acc;
}, {});

// find — first match (or undefined)
const aiDev        = team.find(dev => dev.role === "AI/ML");

// findIndex — index of first match (or -1)
const arjunIndex   = team.findIndex(dev => dev.name.includes("Arjun"));

// some — true if ANY element matches
const hasInactive  = team.some(dev => !dev.active);

// every — true if ALL elements match
const allActive    = team.every(dev => dev.active);

// flat + flatMap — flatten nested arrays
const allSkills    = team.flatMap(dev => dev.skills);   // flat + map in one step
const uniqueSkills = [...new Set(allSkills)];            // deduplicate with Set

// sort — MUTATES original — always copy first!
const sortedBySalary = [...team].sort((a, b) => b.salary - a.salary);

// chaining — compose methods (reads like English)
const topActiveNames = team
  .filter(dev => dev.active)
  .sort((a, b) => b.salary - a.salary)
  .slice(0, 2)
  .map(dev => `${dev.name} (${formatSalary(dev.salary)})`);

console.log("Total salary:", formatSalary(totalSalary));
console.log("By role:", byRole);
console.log("Unique skills:", uniqueSkills);
console.log("Top 2 active:", topActiveNames);
console.log("Has inactive:", hasInactive);   // true

// ══════════════════════════════════════════════════════════════════
// 6. OBJECTS — Shorthand, Computed Keys, Methods, `this`
// ══════════════════════════════════════════════════════════════════

const name2 = "Rohan Verma", role2 = "AI/ML";
const metricKey = "accuracy";

const aiEngineer = {
  name2,                                  // shorthand property (ES6) — name2: name2
  role2,
  [metricKey]: 0.94,                      // computed property key
  [`${metricKey}_version`]: "v3",         // template literal as key

  // Method shorthand — no function keyword
  describe() {
    return `${this.name2} works on ${this.role2}`;  // 'this' = aiEngineer
  },

  // Arrow method — ❌ never use for object methods (no own `this`)
  // badMethod: () => this.name2,          // 'this' = outer scope (wrong!)
};

// Object utility methods
const keys      = Object.keys(aiEngineer);
const values    = Object.values(aiEngineer);
const entries   = Object.entries(aiEngineer);
const clone     = Object.assign({}, aiEngineer);      // shallow copy (older way)
const clone2    = { ...aiEngineer };                   // spread (preferred)
const frozen    = Object.freeze({ PI: 3.14159 });      // immutable object
// frozen.PI = 0;                                      // silently fails (strict: TypeError)

// Object.fromEntries — convert entries back to object
const salaryMap = Object.fromEntries(team.map(dev => [dev.name, dev.salary]));
console.log(salaryMap["Arjun Mehta"]);   // 95000

console.log(aiEngineer.describe());
console.log(Object.entries(aiEngineer));

// ══════════════════════════════════════════════════════════════════
// 7. CLASSES — Modern OOP
// ══════════════════════════════════════════════════════════════════

class Person {
  // Class field (no constructor needed for simple defaults)
  #id;                                   // private field (truly private)
  static count = 0;                      // static — shared across all instances

  constructor(name, age) {
    this.name  = name;
    this.age   = age;
    this.#id   = ++Person.count;
  }

  get id()  { return this.#id; }         // getter — access like property, not method

  greet()   { return `Hi, I'm ${this.name} (ID: ${this.#id})`; }

  static    getCount() { return Person.count; }   // static method

  toString() { return `Person(${this.name}, ${this.age})`; }
}

class Developer extends Person {
  #salary;                               // private field

  constructor(name, age, role, salary) {
    super(name, age);                    // must call super before using 'this'
    this.role   = role;
    this.#salary = salary;
    this.skills = [];
  }

  get salary()         { return this.#salary; }
  set salary(val) {
    if (val < 0) throw new RangeError("Salary cannot be negative");
    this.#salary = val;
  }

  addSkill(...newSkills) {
    this.skills.push(...newSkills);
    return this;                         // return this → method chaining
  }

  promote(increment = 10000) {
    this.#salary += increment;
    return this;
  }

  toString() {
    return `Developer(${this.name}, ${this.role}, ${formatSalary(this.#salary)})`;
  }
}

const dev1 = new Developer("Arjun Mehta", 28, "Backend", 95000);
dev1.addSkill("Node.js", "Python").addSkill("PostgreSQL").promote(5000);  // chaining

const dev2 = new Developer("Priya Sharma", 25, "Frontend", 82000);
dev2.addSkill("React", "TypeScript");

console.log(dev1.toString());            // Developer(Arjun Mehta, Backend, INR 1,00,000)
console.log(dev1 instanceof Developer);  // true
console.log(dev1 instanceof Person);     // true (inheritance)
console.log(Person.getCount());          // 2 (static method)
console.log(dev1.skills);               // ["Node.js", "Python", "PostgreSQL"]

// ══════════════════════════════════════════════════════════════════
// 8. PROMISES + ASYNC / AWAIT + ERROR HANDLING
// ══════════════════════════════════════════════════════════════════

// Simulated async data source
function fetchDeveloper(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { 1: dev1, 2: dev2 };
      if (data[id]) resolve(data[id]);
      else           reject(new Error(`Developer with id ${id} not found`));
    }, 100);
  });
}

function fetchTeamStats(devName) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ commits: 142, reviews: 38, bugs: 3 }), 50);
  });
}

// async/await — cleaner than .then() chains
async function loadDeveloperProfile(id) {
  try {
    const dev   = await fetchDeveloper(id);          // pause until resolved
    const stats = await fetchTeamStats(dev.name);    // sequential

    return {
      developer: dev.toString(),
      stats,
      summary: `${dev.name}: ${stats.commits} commits, ${stats.reviews} reviews`,
    };
  } catch (err) {
    console.error(`[loadDeveloperProfile] Failed:`, err.message);
    return null;                                      // graceful fallback
  } finally {
    console.log("[loadDeveloperProfile] Cleanup — always runs");
  }
}

// Promise.all — run multiple promises IN PARALLEL (faster than sequential await)
async function loadAllProfiles() {
  try {
    const [profile1, profile2] = await Promise.all([
      loadDeveloperProfile(1),
      loadDeveloperProfile(2),
    ]);
    console.log("Profile 1:", profile1?.summary);
    console.log("Profile 2:", profile2?.summary);
  } catch (err) {
    // Promise.all rejects if ANY promise rejects
    console.error("One failed:", err.message);
  }
}

// Promise.allSettled — run all, collect results even if some fail
async function loadWithFallback() {
  const results = await Promise.allSettled([
    loadDeveloperProfile(1),
    loadDeveloperProfile(999),             // will fail — id not found
  ]);
  results.forEach((result, i) => {
    if (result.status === "fulfilled") console.log(`[${i}] OK:`, result.value?.summary);
    else                               console.log(`[${i}] Error:`, result.reason?.message);
  });
}

// Execute the async functions
loadAllProfiles();
loadWithFallback();

// ══════════════════════════════════════════════════════════════════
// 9. OPTIONAL CHAINING + NULLISH COALESCING + ERROR HANDLING
// ══════════════════════════════════════════════════════════════════

const partialData = {
  user: {
    profile: {
      name: "Rohan",
      // address not present
    }
  }
};

// Optional chaining — stops and returns undefined instead of throwing
const city2    = partialData?.user?.profile?.address?.city;    // undefined (no throw)
const zipCode  = partialData?.user?.profile?.address?.zip;     // undefined

// Optional method call
const upper = partialData?.user?.profile?.name?.toUpperCase(); // "ROHAN"

// Nullish coalescing — use right side only if left is null or undefined (NOT falsy)
const displayCity = city2      ?? "Location not set";          // "Location not set"
const displayAge  = 0          ?? "Unknown";                   // 0 (not falsy check!)
const displayAge2 = 0          || "Unknown";                   // "Unknown" (falsy check)

console.log(displayCity);    // "Location not set"
console.log(displayAge);     // 0   ← correct — 0 is a valid age
console.log(displayAge2);    // "Unknown" ← wrong — 0 is falsy

// Nullish assignment ??=
let nickname = null;
nickname ??= "Dev";          // assigns only if null/undefined
console.log(nickname);       // "Dev"

// Custom Error classes
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name    = "ValidationError";
    this.field   = field;
    this.status  = 400;
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} with id '${id}' not found`);
    this.name   = "NotFoundError";
    this.status = 404;
  }
}

function validateDeveloper(data) {
  if (!data.name?.trim())   throw new ValidationError("name",   "Name is required");
  if (data.salary < 0)      throw new ValidationError("salary", "Salary must be positive");
  if (!data.role)           throw new ValidationError("role",   "Role is required");
  return true;
}

try {
  validateDeveloper({ name: "", salary: 50000, role: "Backend" });
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(`Validation failed on '${err.field}': ${err.message}`);
  } else {
    throw err;                           // re-throw unexpected errors
  }
}

// ══════════════════════════════════════════════════════════════════
// 10. MAP, SET, WeakMap — Modern Data Structures
// ══════════════════════════════════════════════════════════════════

// Map — any value as key, preserves insertion order
const devMap = new Map();
devMap.set(dev1.id,  dev1);
devMap.set(dev2.id,  dev2);
devMap.set("config", { theme: "dark" });

console.log(devMap.get(1));              // dev1 object
console.log(devMap.has("config"));       // true
console.log(devMap.size);               // 3

for (const [key, value] of devMap) {
  console.log(`Key: ${key}`, typeof value === "object" ? "object" : value);
}

// Set — unique values only
const roleSet = new Set(team.map(d => d.role));
console.log(roleSet);                   // Set {"Backend","Frontend","AI/ML","DevOps"}
console.log([...roleSet]);              // convert to array

// Set operations
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);
const union        = new Set([...setA, ...setB]);          // {1,2,3,4,5,6}
const intersection = new Set([...setA].filter(x => setB.has(x)));  // {3,4}
const difference   = new Set([...setA].filter(x => !setB.has(x))); // {1,2}
console.log("Union:", [...union]);
console.log("Intersection:", [...intersection]);

// ══════════════════════════════════════════════════════════════════
// 11. SYMBOLS + ITERATORS + GENERATORS (Brief — for awareness)
// ══════════════════════════════════════════════════════════════════

// Symbol — unique identifier, won't clash with string keys
const ID_KEY = Symbol("id");
const secret = { [ID_KEY]: "secret-123", name: "public" };
console.log(Object.keys(secret));       // ["name"] — Symbol not enumerated
console.log(secret[ID_KEY]);            // "secret-123"

// Generator — function that yields values lazily
function* idGenerator(start = 1) {
  while (true) yield start++;           // infinite sequence — pulled lazily
}

const nextId = idGenerator(100);
console.log(nextId.next().value);       // 100
console.log(nextId.next().value);       // 101
console.log(nextId.next().value);       // 102

// ══════════════════════════════════════════════════════════════════
// 12. THIS — Context Rules
// ══════════════════════════════════════════════════════════════════

const team2 = {
  name: "Alpha",
  members: ["Arjun", "Priya", "Rohan"],

  // Regular method — 'this' = team2 (the calling object)
  listMembers() {
    // ❌ Arrow in forEach would also work here (captures outer this)
    return this.members.map(m => `${this.name}: ${m}`);  // arrow captures 'this' = team2
  },

  // ❌ Arrow as method — 'this' = outer scope (NOT team2)
  // badMethod: () => this.name,          // undefined or window in browser

  // Delayed callback — 'this' problem
  listDelayed() {
    // ❌ Regular function in setTimeout — 'this' is undefined (strict) or window
    // setTimeout(function() { console.log(this.name); }, 0); // bug!

    // ✅ Arrow function — inherits 'this' from enclosing scope
    setTimeout(() => console.log(`Delayed: ${this.name}`), 0);
  },
};

console.log(team2.listMembers());       // ["Alpha: Arjun", "Alpha: Priya", "Alpha: Rohan"]
team2.listDelayed();                    // "Delayed: Alpha"

// bind / call / apply
function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const boundIntro = introduce.bind(dev1, "Hello");
console.log(boundIntro("!"));                          // "Hello, I'm Arjun Mehta!"
console.log(introduce.call(dev2, "Hi", "."));          // "Hi, I'm Priya Sharma."
console.log(introduce.apply(dev1, ["Hey", "..."]));    // "Hey, I'm Arjun Mehta..."
```

---

## Part 2 — Syntax Cheat Sheet

| Feature | JS Example | What It Does | Gotcha / Note |
|---|---|---|---|
| `const` | `const MAX = 100` | Block-scoped, no reassign | Object contents still mutable |
| `let` | `let count = 0` | Block-scoped, reassignable | Use over `var` always |
| `var` | *(avoid)* | Function-scoped, hoisted | Legacy — causes bugs |
| Default param | `function fn(x = 0)` | Fallback when arg is `undefined` | `null` does NOT trigger default |
| Arrow function | `const fn = x => x * 2` | Short syntax, no own `this` | Never use as object method |
| IIFE | `(() => { ... })()` | Run immediately, private scope | Module pattern (pre-ESM) |
| Closure | `function outer() { let x; return function inner() { use x } }` | Inner fn remembers outer scope | Each call creates new scope |
| Destructuring obj | `const { name, role } = dev` | Extract properties | Can rename: `{ name: n }` |
| Destructuring arr | `const [first, ...rest] = arr` | Extract elements | Rest must be last |
| Default in destruct | `const { age = 25 } = obj` | Fallback if key missing/undefined | Works with both obj and arr |
| Spread object | `{ ...obj, key: val }` | Shallow clone + override | Last key wins if duplicate |
| Spread array | `[...arr1, ...arr2]` | Concat / clone array | Does not deep-clone nested |
| Rest params | `function fn(...args)` | Collect remaining into array | `args` is a real Array (not `arguments`) |
| `.map()` | `arr.map(x => x * 2)` | Transform → new array | Never mutates original |
| `.filter()` | `arr.filter(x => x > 0)` | Keep matches → new array | Never mutates original |
| `.reduce()` | `arr.reduce((acc, x) => acc + x, 0)` | Fold to single value | Always provide initial value |
| `.find()` | `arr.find(x => x.id === 1)` | First match or `undefined` | Use `findIndex` for index |
| `.some()` | `arr.some(x => x > 100)` | `true` if any match | Short-circuits on first match |
| `.every()` | `arr.every(x => x > 0)` | `true` if all match | Short-circuits on first fail |
| `.flatMap()` | `arr.flatMap(x => [x, x*2])` | map + flat(1) in one step | Flattens one level only |
| `.sort()` | `[...arr].sort((a,b) => a-b)` | Sort — **mutates**! | Always spread-copy first |
| Computed key | `{ [varName]: value }` | Dynamic object key | Template literals work too |
| Object shorthand | `{ name, role }` | If key === variable name | ES6+ only |
| `Object.entries()` | `Object.entries(obj)` | `[[key, val], ...]` | Use with `for...of` |
| `Object.fromEntries()` | `Object.fromEntries(entries)` | `[[k,v]]` → object | Reverse of `Object.entries` |
| `Object.freeze()` | `Object.freeze(obj)` | Makes object immutable | Shallow freeze only |
| Private field | `#salary` in class | Truly private — only inside class | Cannot access from outside |
| Static field | `static count = 0` | Shared across all instances | Access via `ClassName.count` |
| `get` / `set` | `get salary() {}` | Getter/setter as property | No `()` when reading |
| Method chaining | `return this` from method | Enable `.method().method()` | Classic builder pattern |
| `instanceof` | `dev instanceof Developer` | Check prototype chain | Works across inheritance |
| `async` / `await` | `async function fn() { await promise }` | Pause for promise resolution | Only inside `async` function |
| `Promise.all` | `await Promise.all([p1, p2])` | Parallel — all must succeed | Rejects on first failure |
| `Promise.allSettled` | `await Promise.allSettled([p1, p2])` | Parallel — collect all results | Never rejects — check status |
| `try/catch/finally` | `try { } catch(err) { } finally { }` | Error handling | `finally` always runs |
| Optional chaining | `obj?.prop?.nested` | Stop at `undefined` not throw | Returns `undefined`, not error |
| Nullish coalescing | `val ?? "default"` | Default if `null` or `undefined` | `0`, `""`, `false` are valid! |
| `??=` | `x ??= "default"` | Assign only if null/undefined | Logical nullish assignment |
| `Map` | `new Map([[key, val]])` | Any key type, ordered | Better than `{}` for dynamic keys |
| `Set` | `new Set([1,2,2,3])` | Unique values only | Convert with `[...set]` |
| `Symbol` | `Symbol("id")` | Unique, non-enumerable key | Not in `Object.keys()` |
| Generator | `function* gen() { yield 1 }` | Lazy value sequence | `.next().value` to pull |
| `bind` | `fn.bind(obj, arg1)` | Permanent `this` binding | Returns new function |
| `call` | `fn.call(obj, arg1, arg2)` | Invoke with `this` + args | Immediate call |
| `apply` | `fn.apply(obj, [arg1, arg2])` | Like `call` but args as array | Immediate call |

---

## Part 3 — Closures Deep Dive (Q&A)

### Q1 — Closure exactly kya hai? Simple definition?

**Closure = inner function + outer function ka scope, even after outer function returns.**

```javascript
function outer() {
  let secret = "I am closed over";    // outer ka variable

  function inner() {
    console.log(secret);              // inner remembers 'secret' — this is a closure
  }

  return inner;                       // outer returns, but secret is NOT garbage collected
}

const fn = outer();                   // outer has returned — secret should be gone, right?
fn();                                 // "I am closed over" — nope! closure hai
```

Jab `inner` function return hoti hai, woh `secret` variable ka **reference** hold karti hai — garbage collector usse collect nahi karta jab tak `inner` accessible hai.

---

### Q2 — Counter factory example mein har call pe alag state kyun?

```javascript
const loginCounter = createCounter("Logins", 0);
const bugCounter   = createCounter("Bugs", 10);

loginCounter.increment();   // loginCounter ka count: 1
bugCounter.decrement();     // bugCounter ka count: 9

console.log(loginCounter.value());   // 1 — bugCounter se independent!
console.log(bugCounter.value());     // 9
```

Har baar `createCounter()` call hoti hai, **nayi execution context** banti hai jisme `count` ka **nayi copy** hoti hai. Dono closures apne apne `count` ko remember karte hain — ek doosre ko touch nahi karte.

**JS mein real `private` state ka ye sabse clean tarika hai — classes se pehle bhi, aaj bhi.**

---

### Q3 — Classic `var` loop bug — aur closure fix

```javascript
// ❌ Bug with var — all callbacks share the SAME 'i'
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3  ← NOT 0, 1, 2

// ✅ Fix 1: Use let — block-scoped, each iteration gets own 'i'
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2 ✅

// ✅ Fix 2: IIFE — creates new scope per iteration (older way)
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i);
}
// Output: 0, 1, 2 ✅
```

`var` ka `i` function-scoped hai — loop ke baad value `3` hai. Jab setTimeout fires hota hai, sab callbacks wahi `3` dekhte hain. `let` se har iteration ka apna `i` hota hai.

---

### Q4 — Memoization closure ka real-world use

```javascript
function memoize(fn) {
  const cache = new Map();             // 'cache' is closed over
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);  // cache hit
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Expensive Fibonacci without memo: O(2^n)
// With memo: O(n)
const memoFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return memoFib(n - 1) + memoFib(n - 2);
});

console.log(memoFib(40));   // instant — with memoization
```

`cache` Map sirf `memoize` ke andar define hai — bahar se accessible nahi. Ye closure ki power hai: **private state, public interface**.

---

## Part 4 — `this` Deep Dive (Q&A)

### Q1 — `this` ka value kaise decide hota hai? 4 Rules

```javascript
// Rule 1: Default binding — 'this' = global (sloppy) or undefined (strict)
function standalone() { return this; }
standalone();                          // undefined (strict mode)

// Rule 2: Implicit binding — 'this' = object before the dot
const obj = { name: "Arjun", getName() { return this.name; } };
obj.getName();                         // "Arjun" — obj is 'this'

// Rule 3: Explicit binding — bind/call/apply
getName.call(obj);                     // "Arjun" — explicitly set

// Rule 4: new binding — 'this' = newly created object
function Developer(name) { this.name = name; }
const d = new Developer("Priya");     // 'this' = new Developer instance

// Arrow function — none of the above — inherits 'this' from enclosing scope
const arrow = () => this;              // 'this' = same as where arrow was defined
```

---

### Q2 — Arrow function kyun use karte hain callbacks mein?

```javascript
class TeamManager {
  constructor(teamName) {
    this.teamName = teamName;
    this.members  = ["Arjun", "Priya", "Rohan"];
  }

  // ❌ Regular function — 'this' is lost inside callback
  listMembersWrong() {
    return this.members.map(function(member) {
      return `${this.teamName}: ${member}`;   // ❌ this.teamName = undefined
    });
  }

  // ✅ Arrow function — 'this' inherited from listMembersCorrect's scope (class instance)
  listMembersCorrect() {
    return this.members.map(member => {
      return `${this.teamName}: ${member}`;   // ✅ this.teamName = "Alpha"
    });
  }
}

const mgr = new TeamManager("Alpha");
console.log(mgr.listMembersWrong());     // ["undefined: Arjun", ...]
console.log(mgr.listMembersCorrect());   // ["Alpha: Arjun", ...]
```

---

### Q3 — `bind` vs `call` vs `apply` — practical difference

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const dev = { name: "Arjun" };

// bind — returns NEW function with 'this' permanently set
const greetArjun = greet.bind(dev, "Hello");
greetArjun("!");         // "Hello, I'm Arjun!" — can call later, multiple times

// call — calls IMMEDIATELY, args listed individually
greet.call(dev, "Hi", ".");   // "Hi, I'm Arjun."

// apply — calls IMMEDIATELY, args as array
greet.apply(dev, ["Hey", "..."]);   // "Hey, I'm Arjun..."
```

**When to use:**
- `bind` → when you need a reusable function with fixed context (event handlers, callbacks)
- `call` → immediate invocation with known args
- `apply` → immediate invocation with dynamic args array (e.g. `Math.max.apply(null, arr)`)

---

## Part 5 — Async/Await Deep Dive (Q&A)

### Q1 — Promise `.then()` vs `async/await` — kaunsa prefer karein?

```javascript
// .then() chain — callback hell se better, but still nested
fetchDeveloper(1)
  .then(dev   => fetchTeamStats(dev.name).then(stats => ({ dev, stats })))
  .then(({ dev, stats }) => console.log(`${dev.name}: ${stats.commits} commits`))
  .catch(err  => console.error(err.message));

// async/await — reads like synchronous code, same behavior
async function showProfile(id) {
  const dev   = await fetchDeveloper(id);
  const stats = await fetchTeamStats(dev.name);
  console.log(`${dev.name}: ${stats.commits} commits`);
}
```

**Real answer:** Use `async/await` for clarity. Use `.then()` only for simple one-step transforms.

---

### Q2 — Sequential vs Parallel await — performance difference

```javascript
// ❌ Sequential — total time = time1 + time2 + time3
async function sequential() {
  const dev1 = await fetchDeveloper(1);    // wait 100ms
  const dev2 = await fetchDeveloper(2);    // then wait another 100ms
  // Total: ~200ms
}

// ✅ Parallel — total time = max(time1, time2, time3)
async function parallel() {
  const [dev1, dev2] = await Promise.all([
    fetchDeveloper(1),
    fetchDeveloper(2),
  ]);
  // Total: ~100ms (both run simultaneously)
}
```

**Rule:** Agar requests independent hain (ek ka result doosre pe depend nahi karta), hamesha `Promise.all` use karo.

---

### Q3 — `Promise.all` vs `Promise.allSettled` vs `Promise.race`

```javascript
// Promise.all — ALL must succeed. First failure = rejects entire thing
const all = await Promise.all([p1, p2, p3]);      // array of resolved values

// Promise.allSettled — ALL run, collect results regardless
const settled = await Promise.allSettled([p1, p2, p3]);
// [{ status: 'fulfilled', value: ... }, { status: 'rejected', reason: Error }]

// Promise.race — first one to settle (resolve OR reject) wins
const first = await Promise.race([p1, p2, p3]);   // useful for timeouts

// Timeout pattern with Promise.race
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

// Usage
try {
  const data = await withTimeout(fetchDeveloper(1), 50);  // 50ms timeout
} catch (err) {
  console.log(err.message);   // "Timeout after 50ms" if fetch takes >50ms
}
```

---

### Q4 — try/catch ke saath async error handling patterns

```javascript
// Pattern 1: try/catch (recommended for most cases)
async function safe1() {
  try {
    const data = await riskyOperation();
    return data;
  } catch (err) {
    console.error(err);
    return null;               // graceful fallback
  }
}

// Pattern 2: .catch() on the promise (for specific promises)
const data = await riskyOperation().catch(err => {
  console.error(err);
  return null;                 // fallback value
});

// Pattern 3: Handle each differently
async function safe3() {
  let user, profile;
  try   { user    = await fetchUser(); }   catch { user    = guestUser; }
  try   { profile = await fetchProfile(); } catch { profile = defaultProfile; }
  return { user, profile };
}
```

---

## Part 6 — Array Methods Deep Dive (Q&A)

### Q1 — `reduce` ko simple se explain karo

```javascript
const numbers = [1, 2, 3, 4, 5];

// reduce(callback, initialValue)
// callback gets: (accumulator, currentValue, index, array)
const sum = numbers.reduce((acc, num) => acc + num, 0);
// Step 1: acc=0,  num=1 → acc=1
// Step 2: acc=1,  num=2 → acc=3
// Step 3: acc=3,  num=3 → acc=6
// Step 4: acc=6,  num=4 → acc=10
// Step 5: acc=10, num=5 → acc=15
// Result: 15

// Group by — reduce ka powerful real-world use
const byRole = team.reduce((groups, dev) => {
  const key = dev.role;
  if (!groups[key]) groups[key] = [];
  groups[key].push(dev.name);
  return groups;
}, {});
// { Backend: ["Arjun"], Frontend: ["Priya"], "AI/ML": ["Rohan"], DevOps: ["Sneha"] }

// Build lookup Map — O(1) access by id
const devById = team.reduce((map, dev) => {
  map.set(dev.id, dev);
  return map;
}, new Map());
console.log(devById.get(1).name);   // "Arjun Mehta"
```

---

### Q2 — `map` vs `forEach` — kab kya use karein?

```javascript
// map — returns NEW array — use when you need transformed values
const names = team.map(dev => dev.name);   // ["Arjun", "Priya", "Rohan", "Sneha"]

// forEach — returns undefined — use only for side effects (logging, DOM update)
team.forEach(dev => console.log(dev.name));  // returns undefined

// ❌ Using map for side effects — wrong (creates unused array)
team.map(dev => console.log(dev.name));      // works but semantically wrong

// ❌ Using forEach when you need a result — wrong
const result = team.forEach(dev => dev.name);  // undefined!
```

---

### Q3 — Immutability rules for array methods

```javascript
// ✅ These create NEW arrays (safe):
arr.map()       // new array
arr.filter()    // new array
arr.slice()     // new array
arr.concat()    // new array
arr.flat()      // new array
arr.flatMap()   // new array
[...arr]        // new array (spread)

// ⚠️ These MUTATE original (careful!):
arr.push()      // mutates — returns new length
arr.pop()       // mutates — returns removed element
arr.splice()    // mutates — returns removed elements
arr.sort()      // mutates — returns same array
arr.reverse()   // mutates — returns same array
arr.fill()      // mutates

// ✅ Safe sort: always spread copy first
const sorted = [...arr].sort((a, b) => a.salary - b.salary);
```

---

## Part 7 — ES Modules Deep Dive

### Export patterns

```javascript
// ── math.js ─────────────────────────────────────────────────────

// Named exports — multiple per file
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export class Calculator { /* ... */ }

// OR — export list at bottom (preferred for clarity)
const E = 2.71828;
function multiply(a, b) { return a * b; }
export { E, multiply };

// Default export — ONE per file
export default class MathHelper { /* ... */ }

// Re-export from another module (barrel file pattern)
export { add, multiply } from './arithmetic.js';
export { default as Vector } from './vector.js';
```

### Import patterns

```javascript
// ── app.js ───────────────────────────────────────────────────────

// Named import
import { PI, add } from './math.js';

// Rename on import
import { add as sum } from './math.js';

// Default import (any name — but use the exported class name by convention)
import MathHelper from './math.js';

// Import all as namespace
import * as Math2 from './math.js';
Math2.add(2, 3);   // Math2.PI, Math2.multiply, etc.

// Dynamic import — lazy loading (returns Promise)
const { add } = await import('./math.js');

// Side-effect only import
import './polyfills.js';
```

### Barrel file pattern (index.js)

```javascript
// ── utils/index.js ───────────────────────────────────────────────
export { formatSalary, formatDate }  from './formatters.js';
export { validateDeveloper }         from './validators.js';
export { createCounter, memoize }    from './functional.js';

// ── app.js — clean single-line import ────────────────────────────
import { formatSalary, validateDeveloper, createCounter } from './utils';
```

---

## Part 8 — JavaScript vs Python/TypeScript Key Differences

### 1. `var` hoisting — no equivalent in Python

```javascript
console.log(x);   // undefined — hoisted (not ReferenceError!)
var x = 5;

// Python equivalent:
// print(x)  # NameError — no hoisting
# x = 5
```

---

### 2. `this` — most unique JS concept

```javascript
// JS 'this' is dynamic — depends on HOW function is called
const obj = { name: "A", fn() { return this; } };
obj.fn();                    // this = obj
const fn = obj.fn;
fn();                        // this = undefined (strict) or global

// Python: 'self' is explicit parameter, always the instance
# class A:
#     def method(self): return self  # always the instance
```

---

### 3. `null` vs `undefined` — two nothings (Python has one: `None`)

```javascript
let x;                 // undefined — declared but not assigned
let y = null;          // null — explicitly empty
typeof x === "undefined"  // true
typeof y === "object"     // true (famous JS bug!)
y === null               // true

// Use nullish coalescing for both:
const val = x ?? y ?? "default";
```

---

### 4. Prototype chain — no direct Python equivalent

```javascript
// JS inheritance is prototype-based under the hood
dev1.__proto__ === Developer.prototype     // true
Developer.prototype.__proto__ === Person.prototype  // true

// class syntax is syntactic sugar over prototypes
// Python class = true class-based inheritance
```

---

### 5. Truthy / Falsy — bigger list than Python

```javascript
// JS falsy values (evaluate to false in boolean context):
false, 0, -0, 0n, "", '', ``, null, undefined, NaN

// EVERYTHING ELSE is truthy — including:
[], {}, "0", "false", -1  // ALL truthy in JS!

// Python falsy:
# False, 0, 0.0, "", [], {}, (), None, set()
```

---

## Part 9 — Practice Tasks

> **Instructions:** Usi `pareto-js.js` code mein minor modifications karo. Try karo pehle — solutions mat dekho.

---

**Task 1 — Enhance `createCounter` with a max limit**

`createCounter` function mein ek `max` parameter add karo. Jab `count === max` hojaye, `increment()` aur ek warning message print kare aur counter ko `max` se aage na jaane de. `loginCounter` ko `max: 3` ke saath test karo.

---

**Task 2 — `reduce` se advanced `groupBy`**

`team` array pe ek generic `groupBy(arr, keyFn)` utility function banao:

```javascript
// Usage:
const byRole   = groupBy(team, dev => dev.role);
const byActive = groupBy(team, dev => dev.active ? "active" : "inactive");
```

Ye function sirf `reduce` use kare — no `forEach`, no external loop.

---

**Task 3 — Method chaining on `Developer`**

`Developer` class mein nayi methods add karo:
- `assignProject(projectName)` — `this.project = projectName`
- `setSkills(...skills)` — replace skills array
- `promote(amount)` — already exists

In teeno ko ek chain mein call karo:

```javascript
dev1.assignProject("AI Dashboard").setSkills("Python", "LangChain").promote(10000);
```

Ensure karo ki `toString()` mein project bhi show ho.

---

**Task 4 — `withTimeout` + `Promise.allSettled` combine karo**

`loadAllProfiles` function ko modify karo:
1. Har profile fetch ko `withTimeout(promise, 80)` mein wrap karo
2. `Promise.all` ki jagah `Promise.allSettled` use karo
3. Successfully loaded profiles display karo, failed ones ke liye `"[Profile unavailable]"` print karo

---

**Task 5 — Custom `pipe` function**

Function composition utility banao:

```javascript
const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

// Usage with team data:
const processTeam = pipe(
  devs => devs.filter(d => d.active),
  devs => devs.sort((a, b) => b.salary - a.salary),
  devs => devs.map(d => `${d.name}: ${formatSalary(d.salary)}`),
);

console.log(processTeam(team));
```

`pipe` function banao using only `reduce`. Phir ek `compose` function bhi banao jo `pipe` ka reverse hoga (right-to-left).

---

## Summary — The 20% You Just Mastered

```
✅ var / let / const — scope, hoisting, Temporal Dead Zone
✅ Function declaration vs expression vs arrow — hoisting + this behavior
✅ Default params, rest params (...args)
✅ Closures — private state, factory pattern, memoization
✅ Destructuring — object, array, nested, with defaults
✅ Spread / rest — clone, merge, split
✅ Array power tools — map, filter, reduce, find, some, every, flatMap, sort
✅ Object — shorthand, computed keys, Object.entries/fromEntries/freeze
✅ Classes — private fields (#), static, getter/setter, method chaining
✅ Inheritance — extends, super(), instanceof
✅ Promises — .then(), Promise.all, Promise.allSettled, Promise.race
✅ async/await — sequential vs parallel, try/catch, timeout pattern
✅ Optional chaining ?. and nullish coalescing ??
✅ Custom error classes (extends Error)
✅ Map and Set — modern data structures
✅ this — 4 binding rules + arrow fix + bind/call/apply
✅ ES Modules — import/export, default, named, dynamic, barrel files
✅ Symbols + Generators (awareness level)
```

> **Combined with the deep-dive files** (`scope-closures.md`, `asynchronous.md`, `execution-context.md`, `array.md`, `objects.md`), this file and those give you complete JS mastery.

---

*File: `d:\code_fusion\content\tutorials\js\pareto-js.md`*  
*Series: `functions.md` → `pareto-js.md` (this file)*

