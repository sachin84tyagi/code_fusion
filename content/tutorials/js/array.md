# JavaScript Array Methods — Micro‑Font • Max Compression • Zero Overflow • No Right Cut

### Max Pro Super‑Premium Interview Cheat Sheet (A‑Z Coverage)

> **Design Goals:** Ultra‑dense layout • Micro‑font readability • A4 fit • Interview‑optimized • Real‑world use • Zero overflow • Clean professional format

---

| Method ⭐         | Category  | Mutates | Purpose (Micro‑Explain) | Time Complex | Return    | Core Syntax           | Real‑World Live Use Case             |
| ---------------- | --------- | ------- | ----------------------- | ------------ | --------- | --------------------- | ------------------------------------ |
| **map ⭐**        | Transform | ❌       | Transform each item     | O(n)         | New array | `arr.map(fn)`         | UI rendering lists, API data shaping |
| **filter ⭐**     | Query     | ❌       | Select matching items   | O(n)         | New array | `arr.filter(fn)`      | Active users, valid records          |
| **reduce ⭐**     | Aggregate | ❌       | Fold to single value    | O(n)         | Any       | `arr.reduce(fn,init)` | Cart total, grouping, analytics      |
| **forEach**      | Iterate   | ❌       | Loop side‑effects       | O(n)         | void      | `arr.forEach(fn)`     | Logging, DOM updates                 |
| **find ⭐**       | Search    | ❌       | First match             | O(n)         | Element   | `arr.find(fn)`        | Auth user lookup                     |
| **findIndex**    | Search    | ❌       | Index of match          | O(n)         | index     | `arr.findIndex(fn)`   | Edit item by id                      |
| **some**         | Validate  | ❌       | Any match?              | O(n)         | boolean   | `arr.some(fn)`        | Permission checks                    |
| **every**        | Validate  | ❌       | All match?              | O(n)         | boolean   | `arr.every(fn)`       | Form validation                      |
| **includes**     | Search    | ❌       | Exists?                 | O(n)         | boolean   | `arr.includes(x)`     | Role access check                    |
| **indexOf**      | Search    | ❌       | First index             | O(n)         | index     | `arr.indexOf(x)`      | Legacy lookup                        |
| **lastIndexOf**  | Search    | ❌       | Last index              | O(n)         | index     | `arr.lastIndexOf(x)`  | Log tracking                         |
| **push**         | Insert    | ✅       | Add end                 | O(1)         | length    | `arr.push(x)`         | Queue append                         |
| **pop**          | Remove    | ✅       | Remove end              | O(1)         | element   | `arr.pop()`           | Stack pop                            |
| **shift**        | Remove    | ✅       | Remove start            | O(n)         | element   | `arr.shift()`         | Task queue                           |
| **unshift**      | Insert    | ✅       | Add start               | O(n)         | length    | `arr.unshift(x)`      | Priority queue                       |
| **splice ⭐**     | CRUD      | ✅       | Add/Remove/Edit         | O(n)         | array     | `arr.splice(i,n,x)`   | Edit table rows                      |
| **slice ⭐**      | Copy      | ❌       | Extract part            | O(n)         | new array | `arr.slice(a,b)`      | Pagination                           |
| **concat**       | Merge     | ❌       | Merge arrays            | O(n)         | new array | `a.concat(b)`         | Data merge                           |
| **flat**         | Normalize | ❌       | Flatten depth           | O(n)         | new array | `arr.flat(d)`         | API nested data                      |
| **flatMap**      | Map+Flat  | ❌       | Map+flatten             | O(n)         | new array | `arr.flatMap(fn)`     | Form schema map                      |
| **sort ⭐**       | Order     | ✅       | Sort items              | O(n log n)   | array     | `arr.sort(fn)`        | Leaderboards                         |
| **reverse**      | Order     | ✅       | Reverse                 | O(n)         | array     | `arr.reverse()`       | Timeline reverse                     |
| **join**         | Format    | ❌       | To string               | O(n)         | string    | `arr.join(',')`       | CSV export                           |
| **toString**     | Format    | ❌       | Stringify               | O(n)         | string    | `arr.toString()`      | Debug                                |
| **fill**         | Populate  | ✅       | Fill values             | O(n)         | array     | `arr.fill(x)`         | Init buffers                         |
| **copyWithin**   | Memory    | ✅       | Internal copy           | O(n)         | array     | `arr.copyWithin()`    | Data shifting                        |
| **entries**      | Iterator  | ❌       | key/value               | O(n)         | iterator  | `arr.entries()`       | Indexed loops                        |
| **keys**         | Iterator  | ❌       | keys                    | O(n)         | iterator  | `arr.keys()`          | Index mapping                        |
| **values**       | Iterator  | ❌       | values                  | O(n)         | iterator  | `arr.values()`        | Stream data                          |
| **at ⭐**         | Access    | ❌       | Safe index              | O(1)         | element   | `arr.at(-1)`          | Last item access                     |
| **Array.from ⭐** | Create    | ❌       | From iterable           | O(n)         | array     | `Array.from(x)`       | DOM list convert                     |
| **Array.of**     | Create    | ❌       | Create array            | O(n)         | array     | `Array.of(1,2)`       | Safe init                            |
| **isArray ⭐**    | Check     | ❌       | Type check              | O(1)         | boolean   | `Array.isArray(x)`    | API validation                       |

---

## Interview Favorite ⭐ Power Combos

* `map + filter` → UI pipelines
* `reduce` → Grouping, totals, indexing
* `flatMap` → Nested API normalize
* `find + splice` → CRUD systems
* `sort + slice` → Ranking systems

---

## Real‑World Patterns

* **E‑commerce Cart:** `filter → map → reduce`
* **Auth System:** `find → some`
* **Dashboard:** `sort → slice → map`
* **Form Engine:** `flatMap → filter`
* **Logs:** `reverse → slice`

---

## Mutability Rule (Interview Gold)

* ❌ Immutable: `map, filter, reduce, slice, concat, flat, flatMap`
* ✅ Mutable: `push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin`

---

## Performance Interview Notes

* Loops: `for` > `forEach` > `map`
* Search heavy → Use `Map/Set`
* Large arrays → Avoid `shift/unshift`
* Sorting objects → Always comparator `(a,b)=>a.x-b.x`

---

## React‑Specific Best Practices

* Prefer immutable ops (`map/filter/slice`)
* Never mutate state arrays (`push/splice` directly)
* Use `key` with `map`
* Memoize heavy transforms (`useMemo`)

---

### Designed for: Interview Print • A4 Fit • Ultra Dense • Micro‑Font Layout • Zero Overflow • Professional Architecture View
