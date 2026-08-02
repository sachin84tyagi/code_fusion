Welcome to **Java — Chapter 42: The `var` Keyword (Java 10)**.

> **Java is heavily statically typed. You used to have to declare the type of every single variable. Java 10 introduced `var` to let the compiler figure out the type for you, saving keystrokes and cleaning up your code.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

If I point to an apple and say "This is an apple object named Apple1", it's redundant.
I can just point to it and say "This is Apple1", and you *know* it's an apple because you can see it.

**Old Java:** `Apple apple1 = new Apple();` (Redundant)
**New Java:** `var apple1 = new Apple();` (Smart)

The compiler looks at the right side (`new Apple()`) and automatically assigns the type `Apple` to `apple1`.

---

# The Rules of `var`

`var` is **NOT a keyword** for dynamic typing (like JavaScript or Python). 
Java is still 100% strictly typed. `var` is simply **Local Variable Type Inference**.

### Rule 1: Local Variables ONLY
You can only use `var` inside methods. You CANNOT use it for class fields, method parameters, or return types.

```java
public class User {
    // var name = "Sachin"; ❌ ERROR: Cannot use var for class fields!

    // public void print(var message) { ❌ ERROR: Cannot use var for parameters!
    // }

    public void demo() {
        var age = 25; // ✅ Allowed (Local variable)
    }
}
```

### Rule 2: Must be initialized immediately
The compiler needs the right side to figure out the type.

```java
// var count; ❌ ERROR: Compiler doesn't know what type this is!
// count = 10;

var count = 10; // ✅ Allowed. Compiler knows it's an int.
```

### Rule 3: Cannot change type later
Once the compiler infers the type, it is locked. (This proves Java is still statically typed).

```java
var name = "Sachin"; // Type is locked as String
// name = 100;       ❌ ERROR: Incompatible types!
```

---

# Why `var` is Awesome!

It cleans up ugly, repetitive code involving Generics and Collections.

### ❌ Old Way (Repetitive)
```java
HashMap<String, List<Integer>> map = new HashMap<String, List<Integer>>();

for (Map.Entry<String, List<Integer>> entry : map.entrySet()) {
    System.out.println(entry.getKey());
}
```

### ✅ New Way (Clean)
```java
var map = new HashMap<String, List<Integer>>();

for (var entry : map.entrySet()) {
    System.out.println(entry.getKey());
}
```

---

# Caution: The Readability Rule

Just because you *can* use `var` everywhere doesn't mean you *should*.
**Only use `var` if the right side makes it 100% obvious what the type is.**

```java
// GOOD
var user = new User(); 
var list = new ArrayList<String>(); 
var stream = Files.lines(path); 

// BAD (What does this method return? Int? Double? BigDecimal?)
var result = calculateDiscount(); 
```
In the "BAD" example, the developer reading the code has no idea what `result` is without hovering over `calculateDiscount`. In these cases, it's better to explicitly write the type.

---

# 🏢 Company Example — Chaining Streams

`var` shines when writing long stream pipelines where you don't really care about the intermediate types, you just want to store the final result.

```java
public class ReportGenerator {
    
    public void generateReport() {
        
        // Fetch raw data
        var rawData = database.fetchLogs();
        
        // Process data
        var processedList = rawData.stream()
                .filter(log -> log.contains("ERROR"))
                .map(String::toUpperCase)
                .collect(Collectors.toList());

        // Write to file
        var path = Path.of("error_report.txt");
        Files.write(path, processedList);
    }
}
```

---

# Interview Questions

## Q1. Does `var` make Java a dynamically typed language like JavaScript?
> Absolutely not. Java remains strongly and statically typed. `var` is just syntactical sugar that tells the compiler to infer the type at compile-time. At runtime, the variable has a strict, unchangeable type just like normal.

## Q2. Why is `var` restricted to local variables?
> Fields, method parameters, and return types form the public API (the contract) of a class. The Java designers wanted to ensure that API contracts remain explicit and clear to anyone reading the class structure, without forcing them to trace assignments to figure out types.

## Q3. Is `var` a reserved keyword?
> No. `var` is a "reserved type name". This means you can still use `var` as a variable name or a method name (e.g., `int var = 5;` is totally valid!), but you cannot create a class named `var`. This was done to ensure backward compatibility with older code.

---

# Professional Summary

```
Local Variable Type Inference (var):
- Used ONLY for local variables inside methods.
- MUST be initialized on the same line it is declared.
- Does NOT change Java's static typing.
- Best used to reduce boilerplate with Generics, Iterators, and long class names.
- Do not use if it makes the code harder to read (e.g., when the return type of a method isn't obvious).
```

---

# 🧠 Memory Trick
```
var = "Compiler, you do the math. I'm tired of typing."
```

---

# 🚀 Next Chapter
Phase 11 begins! It is time to learn how Seniors write code. We start with the holy grail of software design: **The S.O.L.I.D. Principles**!
