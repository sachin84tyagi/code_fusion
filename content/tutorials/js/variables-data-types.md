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
