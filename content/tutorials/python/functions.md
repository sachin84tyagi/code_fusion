# Python Syntax Mastery — JS/TS Developer's Fast Reference

> **Audience:** Experienced JavaScript/TypeScript developer learning Python syntax.  
> **Goal:** One runnable program covering the most-used Python syntax in one place.

---

## Part 1 — Complete Code

```python
# ─────────────────────────────────────────────
#  Python Syntax Mastery — Developer Profile Demo
#  Run: python functions.py
# ─────────────────────────────────────────────

# Global variable (module-level scope)
app_version: str = "1.0.0"

def show_developer_profile() -> dict:
    """Demonstrate core Python syntax using a developer profile."""

    # ── User Input ──────────────────────────────
    name = input("Enter your name: ")                   # input() always returns str
    try:
        experience = int(input("Years of experience: ")) # convert str → int
    except ValueError:
        print("Invalid number. Defaulting to 0.")
        experience = 0

    # ── Variables & Types ───────────────────────
    role: str    = "Full-Stack Developer"
    salary: float = 85000.50
    is_hired: bool = True
    bonus = None                                        # Python's null equivalent

    print(type(name), type(salary), type(is_hired), type(bonus))

    # ── List ────────────────────────────────────
    skills: list = ["JavaScript", "TypeScript", "React"]
    skills.append("Python")
    print(skills[0], skills[-1])                        # first / last
    print(skills[1:3])                                  # slicing
    print(len(skills), "Python" in skills)

    # ── Tuple (immutable) ───────────────────────
    languages = ("English", "Hindi", "German")          # cannot reassign elements
    print(languages[0], languages[-1])

    # ── Set (unique values only) ─────────────────
    tags = {"backend", "api", "backend", "python"}      # duplicate removed
    tags.add("ai")
    print("api" in tags, "java" not in tags)

    # ── Dictionary ──────────────────────────────
    profile: dict = {
        "name": name,
        "role": role,
        "experience": experience,
        "skills": skills,
    }
    profile["location"] = "Remote"                      # add new key
    profile["role"] = "Senior " + role                  # update existing key
    print(profile.get("salary", "N/A"))                 # safe read with default
    print(list(profile.keys()))
    print(list(profile.values()))
    for key, value in profile.items():
        print(f"  {key}: {value}")

    # ── Conditions ──────────────────────────────
    if experience >= 5:
        level = "Senior"
    elif experience >= 2:
        level = "Mid"
    else:
        level = "Junior"

    # ── Loops, enumerate, list comprehension ────
    print("\nSkill Index:")
    for index, skill in enumerate(skills):
        print(f"  {index}: {skill}")

    upper_skills = [s.upper() for s in skills]         # list comprehension
    print(upper_skills)

    # ── Type checking ───────────────────────────
    print(isinstance(experience, int))                  # True
    print(isinstance(salary, (int, float)))             # True — tuple of types

    # ── == vs is ────────────────────────────────
    a = [1, 2, 3]
    b = [1, 2, 3]
    print(a == b)       # True  — same value
    print(a is b)       # False — different objects in memory
    print(bonus is None) # True  — correct way to check None

    # ── and / or / not ──────────────────────────
    print(is_hired and experience > 0)
    print(not is_hired or experience >= 1)

    # ── Global variable read (no keyword needed) ─
    local_version = "9.9.9"                             # local, same name differs
    print("Inside  fn — local_version :", local_version)
    print("Inside  fn — app_version   :", app_version)  # reads global fine

    # ── Numeric conversion ───────────────────────
    salary_str = str(salary)                            # float → str
    base_pay   = int(salary)                            # float → int (truncated)
    print(f"Salary as str: {salary_str!r}, as int: {base_pay}")

    # ── Return ──────────────────────────────────
    return {
        "developer": name,
        "level": level,
        "version": app_version,
    }


# ── Call the function & capture return value ──
result = show_developer_profile()

# ── Use returned value ─────────────────────────
print("\n── Returned Result ──")
print(f"Developer : {result['developer']}")
print(f"Level     : {result['level']}")
print(f"App Ver   : {result['version']}")

# ── Global variable OUTSIDE function ──────────
print(f"\nOutside fn — app_version: {app_version}")   # same value, still "1.0.0"

# local_version is NOT accessible here → would raise NameError
```

---

## Part 2 — Syntax Cheat Sheet

| Syntax / Feature | Program Example | What It Does | JS/TS Equivalent |
|---|---|---|---|
| `str`, `int`, `float`, `bool` | `role: str = "Dev"` | Typed variable (optional hint) | `let role: string = "Dev"` |
| `None` | `bonus = None` | Absence of value | `null` / `undefined` |
| `type()` | `type(salary)` | Returns runtime type | `typeof salary` |
| `input()` | `name = input("...")` | Reads user input as **string** | `readline` / `prompt()` |
| `int()` `float()` `str()` | `int(input(...))` | Type conversion | `Number()`, `String()`, `parseInt()` |
| `try / except ValueError` | around `int(input(...))` | Safe type conversion | `try / catch` |
| `list` | `skills = [...]` | Ordered, mutable sequence | `Array` |
| `.append()` | `skills.append("Python")` | Add to end | `.push()` |
| Slicing | `skills[1:3]` | Sublist | `.slice(1, 3)` |
| `in` | `"Python" in skills` | Membership check | `.includes()` |
| `not in` | `"java" not in tags` | Negative membership | `!arr.includes()` |
| `tuple` | `("English", "Hindi")` | Immutable sequence | `readonly [...]` / `as const` |
| `set` | `{"backend", "api"}` | Unique values, no order | `new Set()` |
| `.add()` | `tags.add("ai")` | Add to set | `set.add()` |
| `dict` | `{"name": name}` | Key-value store | `object` / `Map` |
| `.get(key, default)` | `profile.get("salary","N/A")` | Safe read | `obj?.salary ?? "N/A"` |
| `.keys()` `.values()` `.items()` | `profile.items()` | Dict views | `Object.keys/values/entries()` |
| `f"..."` | `f"Level: {level}"` | String interpolation | `` `Level: ${level}` `` |
| `if / elif / else` | experience checks | Branching | `if / else if / else` |
| `for … in` | `for skill in skills` | Iteration | `for…of` |
| `range()` | `range(3)` | Number sequence | `Array.from({length:3},(_,i)=>i)` |
| `enumerate()` | `for i, s in enumerate(skills)` | Index + value | `.entries()` / `.forEach((s,i)=>)` |
| List comprehension | `[s.upper() for s in skills]` | Inline map | `.map(s => s.toUpperCase())` |
| `isinstance()` | `isinstance(x, int)` | Runtime type check | `typeof` / `instanceof` |
| `==` | `a == b` | Value equality | deep equal |
| `is` | `bonus is None` | Identity / same object | `===` (for primitives) |
| `and / or / not` | `is_hired and exp > 0` | Logical operators | `&& / \|\| / !` |
| `-> dict` | `def fn() -> dict:` | Return type hint | `: ReturnType` in TS |
| `global` keyword | *(explained below)* | Modify global inside fn | *(no direct equivalent)* |
| `True / False` | `is_hired: bool = True` | Boolean literals | `true / false` |

---

## Part 3 — Global vs Local Variables

Program mein do variables hain jo scope demonstrate karte hain:

| Variable | Defined Where | Value |
|---|---|---|
| `app_version` | **Outside** function (global) | `"1.0.0"` |
| `local_version` | **Inside** function (local) | `"9.9.9"` |

### Q1 — Function ke andar kya print hoga?

```python
# Function ke ANDAR:
local_version = "9.9.9"
print("Inside  fn — local_version :", local_version)  # → "9.9.9"
print("Inside  fn — app_version   :", app_version)    # → "1.0.0"  (global read)
```

Python **global variable ko read karne ke liye** koi keyword nahi chahiye — bas naam likho, Python automatically outer scope mein dhundhta hai.

---

### Q2 — Function ke bahar kya print hoga?

```python
# Function ke BAHAR:
print(f"Outside fn — app_version: {app_version}")    # → "1.0.0"
```

`app_version` unchanged hai kyunki function ne sirf **read** kiya, modify nahi kiya.

---

### Q3 — Agar local aur global ka naam same ho?

```python
app_version = "1.0.0"           # global

def show_developer_profile():
    local_version = "9.9.9"     # alag naam — koi conflict nahi
    # agar hum likhte: app_version = "2.0.0"
    # toh Python ek NAYI local variable banata, global ko touch nahi karta
```

Same naam likhne par Python **local shadow** banata hai — global variable safe rehta hai. Ye JavaScript ke `var`/`let` scoping se alag hai.

---

### Q4 — Kya `return` local variable ko global banata hai?

**Nahi.** `return` sirf ek **value** wapas karta hai — variable nahi. Caller us value ko apne scope mein ek nayi variable mein store kar sakta hai:

```python
result = show_developer_profile()   # result is a NEW variable in global scope
# local_version is still gone forever
```

---

### Q5 — `global` keyword kab zaroori hai?

**Sirf jab** tum function ke andar ek global variable ki **value change** karna chahte ho:

```python
app_version = "1.0.0"

def update_version():
    global app_version            # ab ye GLOBAL wali hai
    app_version = "2.0.0"         # global change ho gayi

update_version()
print(app_version)                # → "2.0.0"
```

`global` ke bina likhte `app_version = "2.0.0"`, toh Python ek **nayi local variable** bana deta aur global untouched rehti.

> **Real-world tip:** `global` keyword ka use avoid karo — ye code ka state unpredictable banata hai. Return values ya class attributes prefer karo.

---

### Q6 — Local variable bahar access karne par kya hoga?

```python
result = show_developer_profile()
print(local_version)   # NameError: name 'local_version' is not defined
```

Function khatam hote hi `local_version` **destroy** ho jaati hai. Ye JS ke block-scoped `let`/`const` ki tarah hai lekin function boundary pe.

---

### Expected Scope Output (sample)

```
Inside  fn — local_version : 9.9.9
Inside  fn — app_version   : 1.0.0
...
Outside fn — app_version: 1.0.0
```

---

## Part 4 — Execution and Output

### Function kaise call hoti hai?

```python
result = show_developer_profile()   # () se call, return value result mein
```

Sirf `show_developer_profile` likhne se function **define** hoti hai, **execute** nahi. `()` lagana zaroori hai.

### Return value kaise capture hoti hai?

```python
return {                            # function andar
    "developer": name,
    "level": level,
    "version": app_version,
}

result = show_developer_profile()   # dict yahan aa gayi
print(result['developer'])          # dict ki tarah access karo
```

---

### Sample Run (input: "Arjun", experience: 3)

```
Enter your name: Arjun
Years of experience: 3
<class 'str'> <class 'float'> <class 'bool'> <class 'NoneType'>
JavaScript Python
['TypeScript', 'React']
4 True
English German
True True
N/A
['name', 'role', 'experience', 'skills', 'location']
['Arjun', 'Senior Full-Stack Developer', 3, ['JavaScript', 'TypeScript', 'React', 'Python'], 'Remote']
  name: Arjun
  role: Senior Full-Stack Developer
  experience: 3
  skills: ['JavaScript', 'TypeScript', 'React', 'Python']
  location: Remote

Skill Index:
  0: JavaScript
  1: TypeScript
  2: React
  3: Python
['JAVASCRIPT', 'TYPESCRIPT', 'REACT', 'PYTHON']
True
True
True
False
True
True
Inside  fn — local_version : 9.9.9
Inside  fn — app_version   : 1.0.0
Salary as str: '85000.5', as int: 85000

── Returned Result ──
Developer : Arjun
Level     : Mid
App Ver   : 1.0.0

Outside fn — app_version: 1.0.0
```

> Lines marked with user input (`name`, `experience`) change karte hain based on what you type. `level` bhi input pe depend karta hai.

---

## Part 5 — Python vs JavaScript/TypeScript — Key Differences

### 1. Boolean Literals

```python
# Python — capital first letter
is_active = True
is_deleted = False
```
```js
// JavaScript
const isActive = true;
const isDeleted = false;
```

---

### 2. `None` vs `null` / `undefined`

```python
bonus = None             # only one "nothing" value in Python
print(bonus is None)     # True — use `is`, not `==`
```
```js
let bonus = null;        // or undefined — two different things
console.log(bonus === null);
```

Python mein `undefined` concept nahi hai — sirf `None`.

---

### 3. `input()` vs Node.js / Browser Input

```python
name = input("Enter name: ")   # BLOCKS execution, returns str
```
```js
// Node.js
const readline = require('readline');
// or in browser: prompt("Enter name:") — non-blocking in async context
```

Python ka `input()` synchronous hai — async/await ki zaroorat nahi basic scripts mein.

---

### 4. List vs Array

```python
skills = ["JS", "Python"]      # ordered, any type, mutable
skills.append("Go")            # push equivalent
skills[1:3]                    # slicing — JS mein .slice(1,3)
```
```js
const skills = ["JS", "Python"];
skills.push("Go");
skills.slice(1, 3);
```

Python list slicing `[start:stop:step]` bahut powerful hai — JS mein natively nahi hota.

---

### 5. Tuple — No Direct JS Equivalent

```python
coords = (10, 20)       # immutable — cannot reassign coords[0] = 99
```
```ts
const coords = [10, 20] as const;   // closest TS equivalent
```

Tuple ka main use: **multiple return values**, **dict keys**, **fixed data**.

---

### 6. Set

```python
tags = {"api", "backend", "api"}    # → {"api", "backend"} — no duplicates
```
```js
const tags = new Set(["api", "backend", "api"]);
```

Concept same, Python ka syntax zyada concise.

---

### 7. Dictionary vs Object / Map

```python
profile = {"name": "Arjun", "exp": 3}
profile["city"] = "Delhi"             # add key
profile.get("salary", 0)              # safe read
for k, v in profile.items(): ...      # iterate entries
```
```js
const profile = { name: "Arjun", exp: 3 };
profile.city = "Delhi";
profile.salary ?? 0;
Object.entries(profile).forEach(([k, v]) => ...);
```

Python dict keys **must be quoted strings** (or other hashable types) — JS shorthand property names nahi hote.

---

### 8. Indentation — No Curly Braces

```python
if experience > 5:
    level = "Senior"     # 4 spaces = block
    print(level)
```
```js
if (experience > 5) {
    const level = "Senior";
}
```

Python mein **indentation hi block define karti hai** — braces nahi. Wrong indentation = `IndentationError`.

---

### 9. `==` vs `is` — Value vs Identity

```python
a = [1, 2, 3]
b = [1, 2, 3]
a == b        # True  — same content
a is b        # False — different objects in memory

bonus = None
bonus == None  # works but NOT idiomatic
bonus is None  # ✅ correct — checks identity
```
```js
// JS has no `is` — === checks reference for objects
[1,2,3] === [1,2,3]   // false — different references
```

`is` Python mein object identity check karta hai. `None`, `True`, `False` ke liye hamesha `is` use karo.

---

### 10. Function Scope & `global`

```python
count = 0
def increment():
    global count       # zaroori hai modify karne ke liye
    count += 1
```
```js
let count = 0;
function increment() {
    count++;           // JS automatically modifies outer variable
}
```

JS mein outer variable ko modify karna direct hota hai (closure). Python mein **`global` keyword explicitly chahiye** — warna Python nayi local variable banata hai.

---

## Part 6 — Practice Tasks

> **Instructions:** Ye 5 exercises usi program mein **minor modifications** hain. Solutions try karo pehle — help ke liye poocho baad mein.

---

**Task 1 — Add a new field to the profile dict**

`profile` dictionary mein `"github"` key add karo jisme user se GitHub username input lo. Usse `profile.items()` loop mein print hone do.

---

**Task 2 — Extend the level condition**

`if/elif/else` block ko extend karo:
- `experience >= 8` → `"Staff Engineer"`
- `experience >= 5` → `"Senior"`
- `experience >= 2` → `"Mid"`
- else → `"Junior"`

---

**Task 3 — Use `global` keyword safely**

Ek aur global variable `login_count: int = 0` define karo. Function ke andar `global login_count` use karke usse `1` se increment karo. Function ke baad print karo — confirm karo ki value `1` hai.

---

**Task 4 — Add set operations**

`tags` set ke alawa ek aur set banao:

```python
required_tags = {"backend", "python", "database"}
```

`tags & required_tags` (intersection) aur `tags | required_tags` (union) print karo.

---

**Task 5 — Handle float input too**

`experience` ke saath ek aur input lo: `expected_salary` as `float`. Agar salary `50000.0` se kam ho toh print karo `"Entry level budget"`, warna `"Competitive salary"`. Ye condition `and` operator se `experience` ke saath combine karo.

---

*File: `d:\code_fusion\content\tutorials\python\functions.md`*
