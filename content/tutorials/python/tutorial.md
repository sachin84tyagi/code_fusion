# Python 80/20 — Pareto Mastery for JS/TS Developers

> **Pareto Principle:** 20% Python concepts → 80% of real-world Python code you'll read, write, and debug.  
> **Format:** Same as `functions.md` — complete code → cheat sheet → deep-dive → output → JS/TS diff → practice tasks.  
> **Domain:** A `Developer` class representing a backend/AI engineer — consistent across all sections.

---

## The 20% Topics That Cover 80% of Python

| # | Topic | Why It's in the 20% |
|---|---|---|
| 1 | **OOP** — classes, `__init__`, methods, inheritance, `super()` | Every Python library, framework, and AI SDK uses classes |
| 2 | **File I/O + `with` statement** | Scripts, data pipelines, config loading |
| 3 | **Modules & imports** | Every real project is multi-file |
| 4 | **Comprehensions** — list, dict, set + `zip()` | Replaces 80% of for-loops in idiomatic Python |
| 5 | **Error handling** — `try/except/finally/raise` | Production-quality code requires this |
| 6 | **Higher-order functions** — `map`, `filter`, `lambda`, `sorted(key=)` | Data transformation, AI/ML pipelines |
| 7 | **`*args` and `**kwargs`** + unpacking | Framework internals, flexible APIs |
| 8 | **String methods** | Text processing in every backend/AI project |
| 9 | **Type hints** | Modern Python, FastAPI, Pydantic, LangChain all use them |
| 10 | **`__name__ == "__main__"`** | Entry-point pattern for every Python script |

---

## Part 1 — Complete Code

```python
# ─────────────────────────────────────────────────────────
#  Python 80/20 Pareto Demo — Developer & Team Management
#  Run: python pareto_80_20.py
# ─────────────────────────────────────────────────────────

from __future__ import annotations          # enables forward type references
import os                                   # stdlib module

# ── Type Aliases (Type Hints) ────────────────────────────
SkillList = list[str]

# ══════════════════════════════════════════════════════════
# 1. OOP — Base Class
# ══════════════════════════════════════════════════════════

class Person:
    """Base class — like an abstract base in TS."""

    species: str = "Human"                  # class variable (shared across instances)

    def __init__(self, name: str, age: int) -> None:
        self.name = name                    # instance variable
        self.age  = age

    def greet(self) -> str:
        return f"Hi, I'm {self.name}, {self.age} years old."

    def __repr__(self) -> str:             # like .toString() in JS
        return f"Person(name={self.name!r}, age={self.age})"


# ══════════════════════════════════════════════════════════
# 2. Inheritance + super()
# ══════════════════════════════════════════════════════════

class Developer(Person):
    """Inherits Person — adds developer-specific attributes."""

    def __init__(self, name: str, age: int, skills: SkillList, salary: float) -> None:
        super().__init__(name, age)         # call parent __init__
        self.skills: SkillList = skills
        self.salary: float     = salary
        self._rating: int      = 0          # _ prefix = "private by convention"

    # ── Property (getter) ───────────────────────────────
    @property
    def rating(self) -> int:
        return self._rating

    @rating.setter
    def rating(self, value: int) -> None:
        if not isinstance(value, int) or not (1 <= value <= 5):
            raise ValueError(f"Rating must be int between 1–5, got {value!r}")
        self._rating = value

    # ── Instance method ─────────────────────────────────
    def skill_summary(self) -> str:
        return f"{self.name} knows: {', '.join(self.skills)}"

    # ── *args — accept variable positional args ──────────
    def add_skills(self, *new_skills: str) -> None:
        self.skills.extend(new_skills)

    # ── **kwargs — accept variable keyword args ──────────
    def update_profile(self, **updates) -> None:
        for key, value in updates.items():
            if hasattr(self, key):
                setattr(self, key, value)

    def __repr__(self) -> str:
        return f"Developer(name={self.name!r}, skills={self.skills})"


# ══════════════════════════════════════════════════════════
# 3. Higher-Order Functions — lambda, map, filter, sorted
# ══════════════════════════════════════════════════════════

def process_team(team: list[Developer]) -> dict:
    """Demonstrates map, filter, sorted, lambda — all in one place."""

    # map() — transform each element (like .map() in JS)
    names: list[str] = list(map(lambda dev: dev.name.upper(), team))

    # filter() — keep elements matching condition (like .filter() in JS)
    seniors: list[Developer] = list(
        filter(lambda dev: dev.salary >= 90_000, team)
    )

    # sorted() with key — sort by salary descending
    ranked: list[Developer] = sorted(team, key=lambda dev: dev.salary, reverse=True)

    # zip() — pair two iterables together (like _.zip in lodash)
    positions = ["Lead", "Senior", "Mid"]
    paired = list(zip(ranked, positions))   # → [(dev, "Lead"), ...]

    return {
        "names":   names,
        "seniors": [d.name for d in seniors],
        "ranked":  [d.name for d in ranked],
        "paired":  [(d.name, pos) for d, pos in paired],
    }


# ══════════════════════════════════════════════════════════
# 4. Comprehensions — list, dict, set
# ══════════════════════════════════════════════════════════

def comprehension_demo(team: list[Developer]) -> None:
    # List comprehension with condition (filter + map combined)
    high_earners = [dev.name for dev in team if dev.salary > 80_000]

    # Dict comprehension — name → salary mapping
    salary_map: dict[str, float] = {dev.name: dev.salary for dev in team}

    # Set comprehension — unique skills across all developers
    all_skills: set[str] = {skill for dev in team for skill in dev.skills}

    # Nested comprehension — list of skill lists flattened
    flat_skills: list[str] = [s.lower() for dev in team for s in dev.skills]

    print(f"High earners  : {high_earners}")
    print(f"Salary map    : {salary_map}")
    print(f"Unique skills : {all_skills}")
    print(f"All skills    : {flat_skills}")


# ══════════════════════════════════════════════════════════
# 5. String Methods — the essential 10
# ══════════════════════════════════════════════════════════

def string_demo(raw: str) -> None:
    print(raw.strip())                      # remove whitespace — like .trim()
    print(raw.lower(), raw.upper())         # case conversion
    print(raw.strip().replace(" ", "_"))    # replace — like .replaceAll()
    print(raw.strip().split(" "))           # split → list — like .split()
    print(",".join(["py", "js", "ts"]))     # join list → str — like .join()
    print(raw.strip().startswith("  "))     # startsWith equivalent
    print("python" in raw.lower())          # substring check — like .includes()
    print(raw.strip().center(30, "─"))      # padding / centering
    words = raw.strip().split()
    print(f"Word count: {len(words)}")
    print(f"{'hello':>10}")                 # right-align in f-string (10 chars wide)


# ══════════════════════════════════════════════════════════
# 6. Error Handling — try / except / finally / raise
# ══════════════════════════════════════════════════════════

class InvalidRatingError(ValueError):
    """Custom exception — subclass of ValueError."""
    pass


def set_developer_rating(dev: Developer, raw_input: str) -> None:
    try:
        rating = int(raw_input)             # may raise ValueError
        dev.rating = rating                 # may raise ValueError from setter
    except ValueError as err:
        print(f"[Error] Rating failed: {err}")
    except TypeError as err:
        print(f"[Error] Type problem: {err}")
    else:
        print(f"[OK] {dev.name}'s rating set to {dev.rating}")
    finally:
        print("[Done] Rating attempt complete.")  # always runs


# ══════════════════════════════════════════════════════════
# 7. File I/O + `with` (context manager)
# ══════════════════════════════════════════════════════════

def save_team_report(team: list[Developer], filepath: str) -> None:
    """Write team data to a file — context manager closes file automatically."""
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("=== Team Report ===\n")
        for dev in team:
            line = f"{dev.name} | {dev.salary:,.0f} | {', '.join(dev.skills)}\n"
            f.write(line)
    print(f"[Saved] Report written to {filepath}")


def load_team_report(filepath: str) -> list[str]:
    """Read file — returns list of lines."""
    if not os.path.exists(filepath):
        print(f"[Warning] File not found: {filepath}")
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()               # list of lines with \n
    return [line.strip() for line in lines] # strip whitespace from each line


# ══════════════════════════════════════════════════════════
# 8. Unpacking + Multiple Return Values
# ══════════════════════════════════════════════════════════

def get_top_and_bottom(team: list[Developer]) -> tuple[Developer, Developer]:
    """Return two values — Python functions can return tuples natively."""
    ranked = sorted(team, key=lambda d: d.salary)
    return ranked[-1], ranked[0]           # top earner, lowest earner


# ══════════════════════════════════════════════════════════
# 9. Modules & Entry Point — __name__ == "__main__"
# ══════════════════════════════════════════════════════════

if __name__ == "__main__":
    # ── Build team ──────────────────────────────────────
    dev1 = Developer("Arjun",  28, ["Python", "FastAPI", "PostgreSQL"], 95_000.0)
    dev2 = Developer("Priya",  25, ["React",  "TypeScript", "Node"],    82_000.0)
    dev3 = Developer("Rohan",  30, ["Python", "LangChain", "Docker"],  110_000.0)

    team: list[Developer] = [dev1, dev2, dev3]

    # ── add_skills with *args ────────────────────────────
    dev2.add_skills("Python", "Next.js")
    print(dev2.skill_summary())

    # ── update_profile with **kwargs ────────────────────
    dev1.update_profile(age=29, salary=98_000.0)
    print(dev1)

    # ── greet() — inherited from Person ─────────────────
    print(dev3.greet())
    print(f"Species: {Developer.species}")  # class variable access

    # ── Higher-order functions ───────────────────────────
    print("\n── process_team ──")
    report = process_team(team)
    for k, v in report.items():
        print(f"  {k}: {v}")

    # ── Comprehensions ───────────────────────────────────
    print("\n── comprehension_demo ──")
    comprehension_demo(team)

    # ── String methods ───────────────────────────────────
    print("\n── string_demo ──")
    string_demo("  Python Developer  ")

    # ── Error handling ───────────────────────────────────
    print("\n── rating attempts ──")
    set_developer_rating(dev1, "4")         # valid
    set_developer_rating(dev2, "9")         # invalid — out of range
    set_developer_rating(dev3, "abc")       # invalid — not a number

    # ── File I/O ─────────────────────────────────────────
    print("\n── file I/O ──")
    report_path = "team_report.txt"
    save_team_report(team, report_path)
    lines = load_team_report(report_path)
    for line in lines:
        print(f"  {line}")

    # ── Multiple return values + unpacking ───────────────
    print("\n── unpacking ──")
    top, bottom = get_top_and_bottom(team)  # tuple unpacking
    first, *rest = team                     # splat unpacking (like JS ...rest)
    print(f"Top earner : {top.name} @ {top.salary:,.0f}")
    print(f"Lowest pay : {bottom.name} @ {bottom.salary:,.0f}")
    print(f"First dev  : {first.name}")
    print(f"Rest devs  : {[d.name for d in rest]}")
```

---

## Part 2 — Syntax Cheat Sheet

| Feature | Program Example | What It Does | JS/TS Equivalent |
|---|---|---|---|
| `class` | `class Developer:` | Define a class | `class Developer` |
| `__init__` | `def __init__(self, name)` | Constructor | `constructor(name)` |
| `self` | `self.name = name` | Instance reference | `this.name = name` |
| Class variable | `species: str = "Human"` | Shared across all instances | `static species = "Human"` |
| `super().__init__()` | in `Developer.__init__` | Call parent constructor | `super(name, age)` |
| `__repr__` | `return f"Dev({self.name})"` | String representation | `.toString()` |
| `@property` | `def rating(self)` | Getter method | `get rating()` |
| `@rating.setter` | `def rating(self, val)` | Setter method | `set rating(val)` |
| `hasattr` | `hasattr(self, key)` | Check if attr exists | `key in obj` |
| `setattr` | `setattr(self, key, val)` | Dynamic attr set | `obj[key] = val` |
| `*args` | `def add_skills(*skills)` | Variable positional args | `...skills: string[]` |
| `**kwargs` | `def update(**updates)` | Variable keyword args | `options: Record<string,any>` |
| `lambda` | `lambda dev: dev.name` | Anonymous function | `dev => dev.name` |
| `map()` | `map(lambda d: d.name, team)` | Transform iterable | `.map()` |
| `filter()` | `filter(lambda d: d.salary>90k)` | Filter iterable | `.filter()` |
| `sorted(key=)` | `sorted(team, key=lambda d: d.salary)` | Sort with key function | `.sort((a,b) => a.salary-b.salary)` |
| `zip()` | `zip(ranked, positions)` | Pair two iterables | `_.zip()` / manual |
| List comprehension | `[d.name for d in team if ...]` | Map + filter inline | `.filter().map()` |
| Dict comprehension | `{d.name: d.salary for d in team}` | Build dict inline | `Object.fromEntries(...)` |
| Set comprehension | `{s for dev in team for s in dev.skills}` | Unique values | `new Set(arr.flat())` |
| `try/except/else/finally` | rating setter | Full error handling | `try/catch/finally` |
| `raise ValueError(msg)` | in `rating.setter` | Throw error | `throw new Error(msg)` |
| Custom exception | `class InvalidRatingError(ValueError)` | Subclass built-in error | `class MyError extends Error` |
| `with open(...) as f` | file read/write | Context manager (auto-close) | `fs.readFileSync` / streams |
| `f.readlines()` | load report | Read all lines → list | `fs.readFileSync().split('\n')` |
| `os.path.exists()` | before reading file | Check file existence | `fs.existsSync()` |
| Multiple return | `return ranked[-1], ranked[0]` | Return tuple of values | `return { top, bottom }` |
| Tuple unpacking | `top, bottom = get_top_and_bottom()` | Destructure tuple | `const { top, bottom } = fn()` |
| Splat unpacking | `first, *rest = team` | Head + tail split | `const [first, ...rest] = team` |
| Type hint | `name: str`, `-> dict` | Optional static typing | TypeScript types |
| `SkillList = list[str]` | type alias | Reusable type alias | `type SkillList = string[]` |
| `__name__ == "__main__"` | at bottom of file | Entry-point guard | `if (require.main === module)` |
| `from __future__ import annotations` | top of file | Forward type references | native in TS |

---

## Part 3 — OOP Deep Dive: Class vs Instance vs Static

Program mein teeno types demonstrate ki gayi hain. Yahan exact code se samjhate hain:

### Class Variable vs Instance Variable

```python
class Person:
    species: str = "Human"              # CLASS variable — sab instances share karte hain

    def __init__(self, name: str) -> None:
        self.name = name                # INSTANCE variable — har instance ka apna
```

```python
dev1 = Developer("Arjun", ...)
dev2 = Developer("Priya", ...)

print(dev1.name)            # "Arjun"   — dev1 ka apna
print(dev2.name)            # "Priya"   — dev2 ka apna
print(Developer.species)    # "Human"   — class pe access (recommended)
print(dev1.species)         # "Human"   — instance se bhi kaam karta hai (avoid)
```

> **JS equivalent:** `species` → `static species = "Human"` in class.

---

### `super().__init__()` — Parent Constructor Call

```python
class Developer(Person):
    def __init__(self, name, age, skills, salary):
        super().__init__(name, age)     # Person.__init__ call karo PEHLE
        self.skills = skills            # phir Developer-specific setup
        self.salary = salary
```

Agar `super().__init__()` miss karo → `self.name` aur `self.age` **exist hi nahi karenge** — `AttributeError` aayega.

---

### Property — Controlled Access

```python
@property
def rating(self) -> int:
    return self._rating                 # getter

@rating.setter
def rating(self, value: int) -> None:
    if not (1 <= value <= 5):
        raise ValueError(...)
    self._rating = value                # setter with validation
```

```python
dev1.rating = 4     # setter call hota hai — validation hoti hai
print(dev1.rating)  # getter call hota hai
dev1._rating = 99   # convention se bahar — avoid karo, underscore = "private"
```

> **JS equivalent:** `get rating()` and `set rating(val)` in class body.

---

### `__repr__` vs `__str__`

```python
def __repr__(self) -> str:
    return f"Developer(name={self.name!r}, skills={self.skills})"
```

```python
print(dev1)                    # __repr__ call hota hai (or __str__ if defined)
print(repr(dev1))              # explicitly __repr__
```

- `__repr__` → developer-friendly, unambiguous (Python console mein use hoti hai)
- `__str__` → user-friendly string (agar define karo)
- If only `__repr__` defined, `str()` bhi ussi ko use karta hai

---

### `hasattr` / `setattr` — Dynamic Attributes (`**kwargs` ke saath)

```python
def update_profile(self, **updates) -> None:
    for key, value in updates.items():
        if hasattr(self, key):          # attribute exist karta hai?
            setattr(self, key, value)   # dynamically set karo
```

```python
dev1.update_profile(age=29, salary=98_000.0)
# age=29 → hasattr check → setattr(dev1, "age", 29)
# salary=98_000 → hasattr check → setattr(dev1, "salary", 98000.0)
```

> **JS equivalent:** `if (key in obj) obj[key] = value`

---

## Part 4 — Higher-Order Functions Deep Dive

Ye section JS/TS developers ke liye sabse natural lagega — but Python ke nuances important hain.

### `map()` — Lazily Evaluated!

```python
names = list(map(lambda dev: dev.name.upper(), team))
```

`map()` Python mein ek **lazy iterator** return karta hai — values tabhi compute hoti hain jab access karo. `list()` call zaroori hai values nikalne ke liye.

```python
result = map(lambda d: d.name, team)  # koi computation nahi hui abhi
print(result)                          # <map object at 0x...>
print(list(result))                    # ["ARJUN", "PRIYA", "ROHAN"]
```

> **Real-world preference:** Pythonistas often prefer list comprehension over `map()`:  
> `[dev.name.upper() for dev in team]` — same result, more readable.

---

### `filter()` — Also Lazy

```python
seniors = list(filter(lambda dev: dev.salary >= 90_000, team))
```

> **Comprehension equivalent:** `[dev for dev in team if dev.salary >= 90_000]`

---

### `sorted()` vs `.sort()`

```python
ranked = sorted(team, key=lambda dev: dev.salary, reverse=True)  # NEW list
team.sort(key=lambda dev: dev.salary)   # MUTATES original list
```

| | `sorted()` | `.sort()` |
|---|---|---|
| Returns | New sorted list | `None` |
| Original | Unchanged | Mutated |
| Works on | Any iterable | Lists only |

> **JS equivalent:** `[...team].sort((a, b) => b.salary - a.salary)`

---

### `zip()` — Pair Two Iterables

```python
positions = ["Lead", "Senior", "Mid"]
paired = list(zip(ranked, positions))   # stops at shorter iterable
# → [(dev1, "Lead"), (dev2, "Senior"), (dev3, "Mid")]

for dev, pos in paired:
    print(f"{pos}: {dev.name}")
```

> **JS equivalent:** `ranked.map((dev, i) => [dev, positions[i]])`

---

## Part 5 — Error Handling Deep Dive

```python
try:
    rating = int(raw_input)     # may raise ValueError
    dev.rating = rating         # may raise ValueError from setter
except ValueError as err:       # catches BOTH
    print(f"[Error] {err}")
except TypeError as err:        # different exception type
    print(f"[Type Error] {err}")
else:
    print("[OK] Rating set.")   # runs ONLY if no exception
finally:
    print("[Done] Always runs.") # runs regardless
```

### Exception Hierarchy

```
BaseException
└── Exception
    ├── ValueError      ← wrong value (e.g., int("abc"))
    ├── TypeError       ← wrong type
    ├── KeyError        ← dict key not found
    ├── IndexError      ← list index out of range
    ├── AttributeError  ← attribute not found on object
    ├── FileNotFoundError ← file missing
    └── ...
```

### Custom Exception

```python
class InvalidRatingError(ValueError):
    pass

raise InvalidRatingError("Rating must be 1–5")
```

Catching `ValueError` will also catch `InvalidRatingError` (inheritance). Custom exceptions allow specific `except` clauses:

```python
except InvalidRatingError:      # only custom
except ValueError:              # custom + built-in ValueError
```

---

## Part 6 — File I/O + Context Manager Deep Dive

### `with` Statement — Why It Matters

```python
# Without with — risky, file may not close on error
f = open("file.txt", "w")
f.write("data")
f.close()                       # if write throws, close never called!

# With with — file ALWAYS closed, even on exception
with open("file.txt", "w", encoding="utf-8") as f:
    f.write("data")             # file auto-closed after block exits
```

> **JS equivalent:** `try { } finally { fd.close() }` — Python's `with` does this automatically.

### File Modes

| Mode | Meaning | Creates file? | Truncates? |
|---|---|---|---|
| `"r"` | Read (default) | No | No |
| `"w"` | Write | Yes | Yes (overwrites) |
| `"a"` | Append | Yes | No |
| `"r+"` | Read + Write | No | No |
| `"rb"` / `"wb"` | Binary read/write | — | — |

### Read Methods

```python
with open("file.txt") as f:
    content  = f.read()         # entire file as one string
    lines    = f.readlines()    # list of lines (with \n)
    for line in f:              # iterate line by line (memory efficient)
        print(line.strip())
```

---

## Part 7 — `__name__ == "__main__"` Explained

```python
# pareto_80_20.py

def process_team(team): ...     # function defined

if __name__ == "__main__":
    team = [...]
    process_team(team)          # runs ONLY when executed directly
```

**Kab kya hota hai:**

| How file is used | `__name__` value | `if` block runs? |
|---|---|---|
| `python pareto_80_20.py` (direct run) | `"__main__"` | ✅ Yes |
| `import pareto_80_20` from another file | `"pareto_80_20"` | ❌ No |

> **Why it matters:** Agar `if __name__ == "__main__"` nahi likha, toh `import` karte time sab code execute ho jaata hai — team objects bante, files write hoti — unwanted side effects.

> **JS equivalent:** `if (require.main === module) { ... }` in CommonJS, or top-level `if` in ES modules.

---

## Part 8 — Python vs JS/TS — New Differences (Beyond functions.md)

### 1. `self` vs `this`

```python
class Dev:
    def greet(self):
        return self.name        # self is EXPLICIT parameter — always first
```
```js
class Dev {
  greet() {
    return this.name;           // this is implicit — no parameter
  }
}
```

Python mein `self` explicitly likhna zaroori hai — warna `TypeError` (missing argument).

---

### 2. `__init__` vs `constructor`

```python
class Dev:
    def __init__(self, name: str) -> None:
        self.name = name
```
```js
class Dev {
  constructor(name) {
    this.name = name;
  }
}
```

Dono same kaam karte hain. Python mein return value `None` hona zaroori hai — `__init__` se kuch return mat karo.

---

### 3. No Access Modifiers (`private` / `public`)

```python
self._rating = 0        # convention: "private" — technically still accessible
self.__rating = 0       # name mangling: _ClassName__rating — harder to access outside
```
```ts
private rating: number = 0;   // truly private in TypeScript
```

Python mein `private` keyword nahi hai. `_` prefix = "please don't touch" by convention. `@property` se controlled access dete hain.

---

### 4. `lambda` vs Arrow Function

```python
double = lambda x: x * 2       # single expression only
```
```js
const double = x => x * 2;     // same — but arrow fn can have block body too
```

Python `lambda` sirf ek expression allow karta hai — no `return`, no multiple statements.

---

### 5. `map()` / `filter()` Return Iterators (Not Arrays)

```python
result = map(fn, items)         # <map object> — lazy
result = list(map(fn, items))   # force evaluation → list
```
```js
const result = items.map(fn);   // always returns Array immediately
```

---

### 6. `*args` vs `...rest`

```python
def add_skills(self, *new_skills: str) -> None:
    self.skills.extend(new_skills)  # new_skills is a TUPLE

add_skills("Python", "Docker")
```
```ts
addSkills(...newSkills: string[]): void {
    this.skills.push(...newSkills);  // newSkills is an Array
}
```

Python mein `*args` → `tuple` (immutable). JS mein `...rest` → `Array` (mutable).

---

### 7. `**kwargs` — No Direct JS Equivalent

```python
def update_profile(self, **updates) -> None:
    # updates = {"age": 29, "salary": 98000}

update_profile(age=29, salary=98_000)   # keyword arguments → dict
```
```ts
updateProfile(updates: Partial<Developer>): void { ... }
updateProfile({ age: 29, salary: 98000 });
```

Python `**kwargs` dynamically named arguments collect karta hai as dict. JS mein object destructuring closest equivalent hai.

---

### 8. Multiple Return Values

```python
def get_top_and_bottom(team) -> tuple[Developer, Developer]:
    return ranked[-1], ranked[0]    # actually returns a tuple

top, bottom = get_top_and_bottom(team)  # tuple unpacking
```
```ts
function getTopAndBottom(team): [Developer, Developer] {
  return [ranked.at(-1)!, ranked[0]];
}
const [top, bottom] = getTopAndBottom(team);
```

Python natively tuples return karta hai — TS mein explicitly array return karna padta hai.

---

### 9. Splat Unpacking

```python
first, *rest = team             # first = team[0], rest = team[1:]
a, b, *others, last = [1,2,3,4,5]  # a=1, b=2, others=[3,4], last=5
```
```js
const [first, ...rest] = team;
const [a, b, ...othersAndLast] = [1,2,3,4,5];  // JS can't do middle splat
```

Python ka splat **kahi bhi** aa sakta hai — middle mein bhi. JS mein sirf end mein.

---

### 10. Underscores in Numbers

```python
salary = 95_000.0       # same as 95000.0 — underscores for readability
large  = 1_000_000
```
```js
const salary = 95_000;  // JS also supports this (ES2021+)
```

---

## Part 9 — Practice Tasks

> **Instructions:** Same `Developer` class use karo. Ye exercises actual real-world patterns hain.

---

**Task 1 — Add a `__str__` method**

`Developer` class mein `__str__` method add karo jo human-readable summary return kare:

```
Arjun (28) — Python, FastAPI, PostgreSQL — ₹95,000/yr
```

Test: `print(dev1)` aur `print(str(dev1))` dono ye format dikhayein.

---

**Task 2 — List comprehension with `zip()`**

`process_team` function mein ek aur key add karo: `"salary_report"` — ye ek list of strings honi chahiye:

```
["Arjun: ₹95,000", "Priya: ₹82,000", "Rohan: ₹1,10,000"]
```

Sirf list comprehension aur `zip()` use karo — no loop.

---

**Task 3 — Custom exception in setter**

`Developer.rating` setter mein `ValueError` ki jagah apna `InvalidRatingError` raise karo. `set_developer_rating` function mein specifically `InvalidRatingError` catch karo (built-in `ValueError` se alag `except` block).

---

**Task 4 — File I/O extension**

`save_team_report` function ko modify karo ki woh CSV format mein save kare (comma-separated):

```
name,salary,skills
Arjun,95000,"Python,FastAPI,PostgreSQL"
```

`load_team_report` ko modify karo ki header line skip kare aur baaki lines dict ki list return kare.

---

**Task 5 — `**kwargs` safe update**

`update_profile` method mein ek validation add karo: agar `salary` update ho rahi hai aur nayi value `0` se kam ya equal hai, toh `ValueError` raise karo instead of silently setting it. Test karo `dev1.update_profile(salary=-5000)` se.

---

## Summary — The 20% You Just Learned

```
✅ OOP (class, __init__, self, class var, instance var)
✅ Inheritance + super()
✅ Property (getter/setter with validation)
✅ __repr__ / __str__
✅ *args and **kwargs
✅ lambda, map(), filter(), sorted(key=), zip()
✅ List / Dict / Set comprehensions (including nested)
✅ try / except / else / finally / raise
✅ Custom exceptions
✅ File I/O with context manager (with open)
✅ os.path.exists()
✅ Multiple return values + tuple unpacking
✅ Splat unpacking (*rest)
✅ Type hints + type aliases
✅ __name__ == "__main__" pattern
✅ String methods (strip, join, split, replace, startswith, in, center)
✅ Dynamic attributes (hasattr, setattr)
```

> **Combined with `functions.md`**, ye two files cover ~80% of Python syntax you'll encounter in backend development, APIs, data scripts, and AI/ML engineering.

---

*File: `d:\code_fusion\content\tutorials\python\pareto_80_20.md`*

