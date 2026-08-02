Welcome to **Java — Chapter 45: The Singleton Pattern**.

> **The Singleton pattern ensures that a class has only ONE instance in the entire application, and provides a global point of access to it.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a country. A country can have millions of citizens, but it can only have **ONE** President.

If someone asks to talk to the President, you don't create a *new* President. You give them the *existing* President.

A Singleton class guarantees that no matter how many times you ask for an object, you always get the exact same one.

---

# Why do we need Singleton?

If you connect to a Database, creating a connection is very slow and takes a lot of memory. 
If 10 users click a button, you DO NOT want to execute `new DatabaseConnection()` 10 times. You want to create it once, and let all 10 users share that exact same connection object.

---

# Step-by-Step: Building a Singleton

To make a class a Singleton, we need to do 3 things:
1. Make the constructor `private` (so nobody can use `new`).
2. Create a `private static` instance of the class inside itself.
3. Provide a `public static` method to return that instance.

### The Basic Implementation (Lazy Initialization)
```java
public class DatabaseConnection {

    // 2. Private static variable to hold the ONE instance
    private static DatabaseConnection instance;

    // 1. Private constructor prevents anyone from doing `new DatabaseConnection()`
    private DatabaseConnection() {
        System.out.println("Database Connection Created!");
    }

    // 3. Public static method to get the instance
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            // First time it's called, create the object
            instance = new DatabaseConnection(); 
        }
        return instance; // Return the existing object
    }
}
```

### Usage:
```java
public class Main {
    public static void main(String[] args) {
        
        // DatabaseConnection db = new DatabaseConnection(); ❌ ERROR: private constructor
        
        DatabaseConnection db1 = DatabaseConnection.getInstance();
        DatabaseConnection db2 = DatabaseConnection.getInstance();
        
        System.out.println(db1 == db2); // TRUE! They are the exact same object in memory!
    }
}
/* Output:
   Database Connection Created!  <-- Printed only once!
   true
*/
```

---

# The Problem: Multithreading (Race Conditions)

The basic Lazy Initialization fails spectacularly in a multithreaded environment.
If Thread A and Thread B call `getInstance()` at the exact same millisecond, they both see `instance == null`, and they **both** create a new object. We now have 2 Presidents!

### The Solution: Double-Checked Locking (The Professional Way)

We use the `synchronized` block and the `volatile` keyword to ensure absolute thread safety while keeping performance extremely high.

```java
public class ThreadSafeDatabase {

    // volatile ensures memory visibility across all threads immediately
    private static volatile ThreadSafeDatabase instance;

    private ThreadSafeDatabase() {}

    public static ThreadSafeDatabase getInstance() {
        if (instance == null) { // 1st Check (No lock, fast)
            
            synchronized (ThreadSafeDatabase.class) { // Lock the class
                
                if (instance == null) { // 2nd Check (Inside lock, safe)
                    instance = new ThreadSafeDatabase();
                }
            }
        }
        return instance;
    }
}
```

---

# Enum Singleton (The Ultimate Java Trick)

Joshua Bloch (author of Effective Java) states that the absolute best way to create a Singleton in Java is using an `Enum`. 
Why? Because Java internally guarantees that Enums are instantiated only once, and they automatically protect against multithreading and Serialization attacks!

```java
public enum PerfectSingleton {
    INSTANCE; // This is the one and only object!

    public void doWork() {
        System.out.println("Doing secure work...");
    }
}

// Usage:
PerfectSingleton.INSTANCE.doWork();
```
*It feels weird using an Enum for logic instead of constants, but it is architecturally bulletproof!*

---

# 🏢 Company Example — Application Cache

Companies use Singletons for Caching. You want one central cache that every part of the application can read from and write to.

```java
import java.util.HashMap;
import java.util.Map;

public enum AppCache {
    INSTANCE;

    private Map<String, String> cache = new HashMap<>();

    public void put(String key, String value) {
        cache.put(key, value);
    }

    public String get(String key) {
        return cache.get(key);
    }
}

// Any class in the application can access the exact same cache:
class UserService {
    public void fetchUser() {
        AppCache.INSTANCE.put("User1", "Sachin");
    }
}

class ReportService {
    public void printReport() {
        System.out.println(AppCache.INSTANCE.get("User1")); // Gets "Sachin"
    }
}
```

---

# Interview Questions

## Q1. What is the difference between Lazy Initialization and Eager Initialization in Singleton?
> **Eager** initialization creates the instance immediately when the class is loaded (`private static Singleton instance = new Singleton();`). It's thread-safe but wastes memory if the object is never used.
> **Lazy** initialization creates the object only when `getInstance()` is called for the first time. It saves memory but requires complex synchronization to be thread-safe.

## Q2. Why is Singleton considered an "Anti-Pattern" by some developers?
> Singletons act like global variables. They hide dependencies (a class just calls `Singleton.getInstance()` instead of having it injected), which makes Unit Testing extremely difficult because you can't easily mock a static method. (Spring Boot solves this by managing Singletons via Dependency Injection!).

## Q3. How does double-checked locking work?
> It checks if the instance is null without locking to maintain high performance. Only if it is null, it enters a `synchronized` block and checks for null *again* (in case another thread slipped in while it was waiting for the lock) before creating the instance.

---

# Professional Summary

```
Singleton Pattern:
- Creational pattern ensuring exactly 1 instance exists globally.
- Key elements: private constructor, private static instance, public static getter.
- Multi-threading requires 'volatile' and double-checked 'synchronized' locking.
- Enum is the safest, most robust implementation in modern Java.
```

---

# 🧠 Memory Trick
```
Singleton = The Highlander.
"There can be only one."
```

---

# 🚀 Next Chapter
We'll explore the **Factory Pattern** — how to delegate object creation to a dedicated factory class instead of hardcoding `new`!
