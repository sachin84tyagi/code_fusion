Welcome to **Java — Chapter 18: The `static` Keyword**.

> **In Java, `static` means "belongs to the CLASS, not the OBJECT." It is a memory management tool that allows you to share data and methods across all instances.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a classroom.

Every student has their own **notebook**. (This is an instance variable — unique to each object).
If Rahul writes in his notebook, Priya's notebook doesn't change.

But there is only ONE **whiteboard** at the front of the class. (This is a `static` variable).
If the teacher writes "Exam on Friday" on the whiteboard, ALL students see it. If one student erases it, it's erased for EVERYONE.

`static` = The Shared Whiteboard.

---

# 1. Static Variables

A static variable gets memory ONLY ONCE in the class area at the time of class loading.

```java
class Student {
    String name;                 // Instance variable (Unique for each object)
    static String collegeName;   // Static variable (Shared by ALL objects)
}

public class Main {
    public static void main(String[] args) {
        Student.collegeName = "MIT"; // Set it on the CLASS, not the object!

        Student s1 = new Student();
        s1.name = "Sachin";

        Student s2 = new Student();
        s2.name = "Rahul";

        // Both students share the same collegeName!
        System.out.println(s1.name + " goes to " + s1.collegeName); // Sachin goes to MIT
        System.out.println(s2.name + " goes to " + s2.collegeName); // Rahul goes to MIT
        
        // Note: Accessing static via instance (s1.collegeName) works but is bad practice.
        // ALWAYS use the ClassName: Student.collegeName
    }
}
```

---

# 2. Static Methods

A static method belongs to the class. You can call it WITHOUT creating an object.

**Crucial Rule:** A static method can ONLY access other static variables and static methods directly. It CANNOT use `this` or `super`.

```java
class MathUtils {
    // Static method
    public static int square(int x) {
        return x * x;
    }
}

public class Main {
    public static void main(String[] args) {
        // No need to do: MathUtils m = new MathUtils();
        
        int result = MathUtils.square(5); // Called directly using Class Name!
        System.out.println(result); // 25
    }
}
```
*Real-world example: `Math.max(10, 20)` — `Math` is the class, `max` is a static method.*

---

# 3. Static Blocks

Used to initialize static variables. It is executed exactly ONCE when the class is loaded into memory, even before the `main` method!

```java
class Database {
    static String connectionString;

    // Static block
    static {
        System.out.println("Static block executed!");
        connectionString = "jdbc:mysql://localhost:3306/db";
    }

    public Database() {
        System.out.println("Constructor executed!");
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Main method started.");
        Database db1 = new Database();
        Database db2 = new Database();
    }
}
/* Output:
   Main method started.
   Static block executed!  <-- Runs only ONCE when Database class is first touched
   Constructor executed!   <-- Runs for db1
   Constructor executed!   <-- Runs for db2
*/
```

---

# 4. Static Classes (Nested)

You cannot make a top-level class static. But you CAN make a class inside another class static. (Covered deeply in Inner Classes chapter).

---

# Why is `main` method static?

```java
public static void main(String[] args)
```
Because the JVM needs to call the `main` method to start the program. If it wasn't static, the JVM would have to create an object of your class first. But to create an object, it needs memory, and memory isn't allocated until the program starts... Chicken and egg problem!
`static` allows the JVM to call `main` without creating an object.

---

# 🏢 Company Example — Object Counter & Constants

```java
public class UserAccount {
    // 1. Static Constant (Shared, unchangeable)
    public static final String BANK_NAME = "HDFC Bank";

    // 2. Static Counter (Tracks something across ALL objects)
    private static int totalAccountsCreated = 0;

    // Instance variables (Unique per user)
    private String username;

    public UserAccount(String username) {
        this.username = username;
        totalAccountsCreated++; // Increment the shared counter
    }

    // Static method to get the static data
    public static int getTotalAccounts() {
        return totalAccountsCreated;
    }
}

// Usage:
new UserAccount("Sachin");
new UserAccount("Rahul");
new UserAccount("Priya");

// Accessing static method without an object!
System.out.println("Total Users: " + UserAccount.getTotalAccounts()); // Output: 3
```

---

# Interview Questions

## Q1. Can a static method access non-static (instance) variables?
> No. Static methods run at the class level, independent of any specific object. Instance variables require an object to exist. Therefore, a static method cannot directly access non-static variables or use the `this` keyword.

## Q2. Can we override a static method?
> No. Overriding relies on dynamic binding at runtime (which object is created). Static methods are resolved at compile-time (static binding) based on the Reference Type. If a child class has the same static method, it "hides" the parent's method, but it is not overriding.

## Q3. What is the order of execution between static blocks and constructors?
> Static blocks are executed FIRST, exactly once, when the Class is loaded by the ClassLoader. Constructors are executed AFTER, every time a new Object is instantiated using `new`.

---

# Professional Summary

```
The 'static' keyword means Class-Level.

- Static Variable: Shared copy across all objects. Good for constants and counters.
- Static Method: Called using ClassName.methodName(). Cannot use 'this' or access instance variables.
- Static Block: Used to initialize static variables. Runs once upon class loading.

Rule of Thumb:
If a variable or method doesn't depend on the state of a specific object, make it static! (e.g., utility methods).
```

---

# 🧠 Memory Trick
```
Instance = Backpack (everyone has their own).
Static = Billboard (one for the whole town, everyone looks at the same one).
```

---

# 🚀 Next Chapter
We'll learn about the **Final Keyword** — how to lock your variables, methods, and classes to prevent modification!
