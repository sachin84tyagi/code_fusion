Welcome to **Java — Chapter 19: The `final` Keyword**.

> **The `final` keyword in Java is used to restrict the user. It is a lock. Once you make something `final`, it cannot be changed, overridden, or inherited.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine writing something in a notebook.

If you write with a **Pencil** (Normal Variable), you can erase it and change it later.
If you write with a **Permanent Marker** (`final` keyword), you can NEVER erase or change it. It is locked forever.

---

# The 3 Uses of `final`

1. **`final` Variable** → Cannot be reassigned (Constant).
2. **`final` Method** → Cannot be overridden by child classes.
3. **`final` Class** → Cannot be inherited (extended).

---

# 1. Final Variables (Constants)

Once a final variable is assigned a value, it can NEVER be changed.

```java
public class Configuration {
    // Standard final variable
    final int MAX_USERS = 100;

    public void changeMax() {
        // MAX_USERS = 200; ❌ Compile Error! Cannot assign a value to final variable.
    }
}
```

### Blank Final Variables
You can declare a final variable without initializing it immediately, BUT you MUST initialize it in the constructor.

```java
public class User {
    final String PAN_NUMBER; // Blank final variable

    public User(String pan) {
        this.PAN_NUMBER = pan; // ✅ Allowed here!
    }

    public void updatePan() {
        // this.PAN_NUMBER = "NEW_PAN"; ❌ Error! Already initialized.
    }
}
```

### Global Constants (`static final`)
Usually, `final` variables are combined with `static` to create global constants. Convention dictates they are written in ALL_CAPS.

```java
public static final double PI = 3.14159;
```

---

# 2. Final Methods

If you make a method `final`, no child class can override it. This is used to prevent child classes from altering critical business logic.

```java
class PaymentGateway {
    // This logic must NEVER be changed by subclasses
    public final void connectToBank() {
        System.out.println("Connecting securely to RBI...");
    }

    public void calculateFee() {
        System.out.println("Default fee is 2%");
    }
}

class CustomPayment extends PaymentGateway {
    // ✅ Allowed: Overriding a normal method
    @Override
    public void calculateFee() {
        System.out.println("Custom fee is 1%");
    }

    // ❌ Compile Error! Cannot override final method
    // @Override
    // public void connectToBank() {
    //     System.out.println("Connecting to hacker server..."); 
    // }
}
```

---

# 3. Final Classes

If you make a class `final`, it cannot be inherited. End of the bloodline!

```java
// Locked class
final class SecuritySystem {
    public void encryptPassword() {
        System.out.println("Encrypting...");
    }
}

// ❌ Compile Error! Cannot inherit from final SecuritySystem
// class MySecurity extends SecuritySystem { } 
```
*Note: Many core Java classes, like `java.lang.String`, are declared `final` for security and performance reasons.*

---

# `final` with Reference Variables (Tricky!)

If a reference variable (Object/Array) is `final`, you cannot reassign it to a *new* object. BUT, you CAN change the internal state of that object!

```java
class Student {
    String name;
}

public class Main {
    public static void main(String[] args) {
        final Student s1 = new Student();
        
        // ✅ Allowed! Changing internal state of the object
        s1.name = "Sachin"; 
        s1.name = "Rahul";  

        // ❌ Compile Error! Cannot assign a NEW object to a final reference
        // s1 = new Student(); 
        
        
        // Same for Arrays:
        final int[] arr = {1, 2, 3};
        arr[0] = 99; // ✅ Allowed (Modifying contents)
        // arr = new int[]{4,5,6}; ❌ Error (Reassigning reference)
    }
}
```

---

# 🏢 Company Example — Core Configurations

```java
// 1. Final Class: Cannot be extended
public final class AppConfig {
    
    // 2. Static Final Variables: Global Constants
    public static final String DB_URL = "jdbc:mysql://localhost:3306/prod_db";
    public static final int TIMEOUT_MS = 5000;

    // 3. Final Method: Cannot be overridden (though redundant in a final class)
    public final void printConfig() {
        System.out.println("Connecting to: " + DB_URL);
    }
}
```
*In Spring Boot, you'll often use `final` for dependency injection via constructor to ensure services cannot be swapped out at runtime.*

---

# Interview Questions

## Q1. Can a constructor be made `final`?
> No. Constructors are not inherited in Java, so it makes no sense to mark them as `final`. The compiler will throw an error.

## Q2. What is the difference between `finally`, `final`, and `finalize`?
> - `final` is a keyword used to restrict variables, methods, and classes.
> - `finally` is a block used in Exception Handling (`try-catch-finally`) that executes important code regardless of exceptions.
> - `finalize()` is a method in the `Object` class called by the Garbage Collector before destroying an object (Deprecated in modern Java).

## Q3. Is it true that a `final` object cannot be modified?
> False! If the reference is `final`, you cannot point it to a *new* object. However, you CAN modify the internal data/fields of that object (unless those fields themselves are also `final` or private without setters).

---

# Professional Summary

```
The 'final' keyword = Restriction / Lock.

1. final variable: Value cannot be changed (Constant).
2. final method: Cannot be overridden by a subclass.
3. final class: Cannot be inherited (extended).

Blank Final Variable: Declared without value, MUST be initialized in the constructor.
Final References: The pointer is locked, but the object's internal data can still be mutated.
```

---

# 🧠 Memory Trick
```
final = Super Glue.

final variable = Glued to its value.
final method   = Glued to its implementation.
final class    = Glued to the end of the inheritance tree.
```

---

# 🚀 Next Chapter
We'll explore **Inner Classes** — writing classes inside other classes to group code tightly together.
