Welcome to **Java — Chapter 39: Records (Java 16+)**.

> **Records are the ultimate boilerplate killer. They replace 50 lines of Getters, Setters, Constructors, `equals()`, `hashCode()`, and `toString()` with exactly ONE line of code!**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine applying for an ID Card.
**The Old Way:** You have to fill out 10 different forms, write your name 5 times, and sign 3 documents just to prove who you are. (Lots of paperwork/boilerplate).

**The Record Way:** You just say "My name is Sachin, age 25." The clerk hits a button, and the ID card prints instantly with everything formatted perfectly.

A Record is a data carrier. It holds data simply, with zero unnecessary typing.

---

# The Problem: Boilerplate Code

If we want a simple class just to hold X and Y coordinates, look at how much code we have to write in traditional Java:

```java
// ❌ Old Way (POJO - Plain Old Java Object)
public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() { return x; }
    public int getY() { return y; }

    @Override
    public boolean equals(Object o) { /* 10 lines of logic */ }

    @Override
    public int hashCode() { /* 3 lines of logic */ }

    @Override
    public String toString() { return "Point[x=" + x + ", y=" + y + "]"; }
}
```

---

# The Solution: Records

We can replace ALL of that with just one keyword: `record`.

```java
// ✅ New Way (Java 16+)
public record Point(int x, int y) {}
```
That's it. It automatically generates the constructor, the getters (named `x()` instead of `getX()`), `toString`, `equals`, and `hashCode` under the hood!

### Using the Record:
```java
public class Main {
    public static void main(String[] args) {
        
        // 1. Constructor is auto-generated
        Point p1 = new Point(10, 20);
        Point p2 = new Point(10, 20);
        
        // 2. Getters are auto-generated (without "get" prefix)
        System.out.println(p1.x()); // 10
        
        // 3. toString() is auto-generated
        System.out.println(p1); // Point[x=10, y=20]
        
        // 4. equals() is auto-generated (compares values, not memory)
        System.out.println(p1.equals(p2)); // true!
    }
}
```

---

# Immutable by Default

Records are strictly **Immutable**.
Once you create a `new Point(10, 20)`, you CANNOT change `x` or `y`. 
There are NO setters generated. The fields are `final` under the hood.

This makes Records incredibly safe for multithreading, and perfect for Data Transfer Objects (DTOs).

---

# Adding Custom Logic to Records

You can still add your own methods, or override the constructor if you need validation.

```java
public record User(String username, int age) {

    // Compact Constructor (Special feature for Records!)
    // No need to do "this.age = age", it happens automatically AFTER this block.
    public User {
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative");
        }
        username = username.trim().toLowerCase();
    }

    // Custom method
    public boolean isAdult() {
        return age >= 18;
    }
}

// Usage:
User u = new User("  SACHIN  ", 25);
System.out.println(u.username()); // "sachin" (Trimmed and lowercased!)
System.out.println(u.isAdult());  // true
```

---

# 🏢 Company Example — Spring Boot API Responses

Records are absolutely perfect for returning JSON responses in Spring Boot, replacing the need for the Lombok `@Data` annotation in many cases.

```java
// Record used as a Data Transfer Object (DTO)
public record ProductResponse(String id, String name, double price) {}

@RestController
public class ProductController {

    @GetMapping("/api/product")
    public ProductResponse getProduct() {
        // Spring Boot automatically converts this Record into a clean JSON string!
        return new ProductResponse("P123", "MacBook Pro", 1999.99);
    }
}
/* JSON Output:
{
  "id": "P123",
  "name": "MacBook Pro",
  "price": 1999.99
}
*/
```

---

# Interview Questions

## Q1. Can a Record extend another class?
> No. All records implicitly extend `java.lang.Record`. Since Java doesn't support multiple inheritance, they cannot extend any other class. However, they CAN implement interfaces!

## Q2. How is a Record different from a Class using Lombok's `@Data`?
> Lombok `@Data` modifies bytecode at compile-time and usually generates mutable objects (with Setters). A Java Record is a native language feature that strictly enforces Immutability (all fields are `final`, no Setters).

## Q3. What is a "Compact Constructor" in a record?
> It is a special constructor syntax allowed only in records (`public RecordName { ... }`). It omits the parameter list. It is used strictly for validation or normalization of the data before the fields are assigned automatically.

---

# Professional Summary

```
Records (Java 16):
- Keyword: 'record'
- Purpose: A transparent carrier for immutable data.
- Automatically generates: Constructor, Getters (e.g., name() instead of getName()), equals(), hashCode(), toString().
- State is final (Immutable, thread-safe).
- Perfect for DTOs (Data Transfer Objects) and returning multiple values from a method.
- Cannot extend classes, but can implement interfaces.
```

---

# 🧠 Memory Trick
```
Record = A Read-Only Vinyl Record. 
You record the song onto it once (constructor). 
You can play it (getters) perfectly, but you can NEVER change the music on it (no setters).
```

---

# 🚀 Next Chapter
We'll cover another modern feature: **Sealed Classes** — taking exact control over who is allowed to inherit your code!
