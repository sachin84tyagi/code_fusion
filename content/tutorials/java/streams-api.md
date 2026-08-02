Welcome to **Java — Chapter 30: Streams API (Java 8)**.

> **The Streams API is the most powerful data manipulation tool in Java. Combined with Lambdas, it allows you to filter, map, and reduce Collections with zero loops and zero boilerplate.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a factory assembly line.
A box of raw apples arrives.
1. The **Filter** machine throws away rotten apples.
2. The **Map** machine peels the remaining apples.
3. The **Collect** machine puts the peeled apples into a new box.

A Stream is an assembly line for Data. It doesn't store data; it moves data through a series of operations.

---

# The Old Way vs The Stream Way

Task: Filter a list of numbers, keep only the even ones, and multiply them by 10.

### ❌ Old Way (For-Loop)
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);
List<Integer> result = new ArrayList<>();

for (Integer n : numbers) {
    if (n % 2 == 0) {
        result.add(n * 10);
    }
}
System.out.println(result); // [20, 40, 60]
```

### ✅ Stream Way (Declarative)
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);

List<Integer> result = numbers.stream()               // 1. Create Stream
        .filter(n -> n % 2 == 0)                      // 2. Filter evens
        .map(n -> n * 10)                             // 3. Multiply by 10
        .collect(Collectors.toList());                // 4. Collect back to List

System.out.println(result); // [20, 40, 60]
```
*It reads like plain English! "Stream the numbers, filter evens, map multiply by 10, collect to list."*

---

# Intermediate vs Terminal Operations

A Stream pipeline consists of a Source, Intermediate Operations, and ONE Terminal Operation.

### 1. Intermediate Operations (Lazy)
These operations return another Stream, allowing you to chain them. They do NOT execute until a terminal operation is called.
- `filter(Predicate)`: Keeps elements that return true.
- `map(Function)`: Transforms elements.
- `sorted()`: Sorts elements.
- `distinct()`: Removes duplicates.
- `limit(n)`: Keeps only the first `n` elements.

### 2. Terminal Operations (Eager)
These trigger the stream to execute and return a final result (List, int, void). Once a terminal operation is called, the stream is closed and cannot be reused!
- `collect(Collectors.toList())`: Packs results into a Collection.
- `forEach(Consumer)`: Loops over results and does something.
- `count()`: Returns number of elements.
- `anyMatch(Predicate)`: Returns true if any element matches.
- `findFirst()`: Returns an Optional containing the first element.

---

# Powerful Stream Examples

```java
List<String> names = Arrays.asList("Sachin", "Rahul", "Priya", "Amit", "Sachin");

// 1. filter() and count()
long countA = names.stream()
                   .filter(name -> name.startsWith("A"))
                   .count(); // 1

// 2. distinct() and sorted()
List<String> uniqueSorted = names.stream()
                                 .distinct()
                                 .sorted()
                                 .collect(Collectors.toList()); 
// [Amit, Priya, Rahul, Sachin]

// 3. map() to transform types (String -> Integer length)
List<Integer> nameLengths = names.stream()
                                 .map(name -> name.length()) // or String::length
                                 .collect(Collectors.toList());
// [6, 5, 5, 4, 6]
```

---

# `reduce()` — Combining Elements

Reduce takes all elements in the stream and combines them into a single result (like summing a list of numbers).

```java
List<Integer> prices = Arrays.asList(10, 20, 30);

// reduce(initialValue, (accumulator, element) -> operation)
int sum = prices.stream()
                .reduce(0, (a, b) -> a + b); 

System.out.println("Total: " + sum); // 60
```

---

# 🏢 Company Example — Employee Data Processing

In backend development, you constantly use Streams to process data from databases before sending it to the frontend.

```java
class Employee {
    String name;
    String department;
    double salary;
    // constructors, getters...
}

List<Employee> dbResults = getEmployeesFromDB();

// Task 1: Get names of all IT employees earning over 80k, sorted alphabetically
List<String> topItStaff = dbResults.stream()
    .filter(e -> e.getDepartment().equals("IT"))
    .filter(e -> e.getSalary() > 80000)
    .map(Employee::getName)
    .sorted()
    .collect(Collectors.toList());

// Task 2: Check if ANY employee earns more than 200k
boolean hasCEO = dbResults.stream()
    .anyMatch(e -> e.getSalary() > 200000);

// Task 3: Group employees by Department (Advanced!)
Map<String, List<Employee>> byDept = dbResults.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));
```

---

# Interview Questions

## Q1. What is the difference between a Collection and a Stream?
> A **Collection** is an in-memory data structure that holds elements. A **Stream** is an API that processes elements from a source (like a Collection). Streams do not store data, they do not modify the original source, and they are consumed (can only be traversed once).

## Q2. What does it mean that Streams are "Lazy"?
> Intermediate operations (like `filter` or `map`) are lazy. They do not execute immediately when written. They are only executed when a **Terminal Operation** (like `collect` or `count`) is invoked. This allows Java to optimize the pipeline under the hood.

## Q3. How do you process a Stream in parallel?
> Simply replace `.stream()` with `.parallelStream()`. This divides the data into chunks and processes them simultaneously using multiple CPU cores. However, it should only be used for massive datasets where the operation is thread-safe, as thread management has overhead.

---

# Professional Summary

```
Streams API:
- Allows functional-style operations on collections.
- Does not store data (it's a pipeline).
- Pipeline: Source -> Intermediate Ops (Lazy) -> Terminal Op (Eager).

Common Ops:
- Intermediate: filter(), map(), sorted(), distinct()
- Terminal: collect(), forEach(), count(), reduce(), anyMatch()
```

---

# 🧠 Memory Trick
```
Stream = Water Filter Pitcher.
Water (Data) goes in -> Passes through carbon filter (filter) -> Passes through flavor infuser (map) -> Pours into glass (collect). 
The pitcher doesn't STORE the water permanently, it just processes it.
```

---

# 🚀 Next Chapter
We'll cover **Optional** — Java 8's brilliant solution to the dreaded `NullPointerException`!
