Welcome to **Java — Chapter 41: Pattern Matching & Switch Expressions (Java 14 - 21)**.

> **Java completely modernized the `switch` statement and `instanceof` check. No more break statements, no more tedious casting. It is clean, safe, and powerful.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

**Old Java:** "Are you a dog? Yes? Okay, let me cast you into a Dog suit. Now bark."
**New Java:** "If you are a dog (named d), just bark(d)!"

It automatically extracts the object into a usable variable!

---

# 1. Pattern Matching for `instanceof` (Java 16)

Look at how much boilerplate we used to write just to check a type and use it!

### ❌ Old Way
```java
Object obj = "Hello Java";

if (obj instanceof String) {
    String s = (String) obj; // Tedious manual casting
    System.out.println(s.toUpperCase());
}
```

### ✅ New Way (Pattern Matching)
```java
Object obj = "Hello Java";

// Declare the variable 's' directly in the if statement!
if (obj instanceof String s) {
    // 's' is automatically cast and ready to use!
    System.out.println(s.toUpperCase()); 
}
```

---

# 2. Modern Switch Expressions (Java 14)

The old `switch` statement was annoying because if you forgot the `break;` keyword, it would "fall through" and execute the next cases (a massive source of bugs).

Modern Switch uses the `->` arrow syntax (like lambdas). **No `break` needed!**

### ❌ Old Switch Statement
```java
String day = "MONDAY";
String type;

switch (day) {
    case "MONDAY":
    case "TUESDAY":
    case "WEDNESDAY":
    case "THURSDAY":
    case "FRIDAY":
        type = "Weekday";
        break; // DONT FORGET THIS!
    case "SATURDAY":
    case "SUNDAY":
        type = "Weekend";
        break;
    default:
        type = "Unknown";
}
```

### ✅ New Switch Expression (Returns a value directly!)
```java
String day = "MONDAY";

// The switch itself RETURNS the value directly into the variable!
String type = switch (day) {
    case "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" -> "Weekday";
    case "SATURDAY", "SUNDAY" -> "Weekend";
    default -> "Unknown";
};

System.out.println(type); // "Weekday"
```
*Note the semicolon `;` at the end of the switch expression because it is acting as an assignment!*

---

# 3. Pattern Matching in Switch (Java 21)

This is the holy grail. We can now switch on the **TYPE** of an object!

```java
public String formatObject(Object obj) {
    
    return switch (obj) {
        case Integer i -> "It is an Integer: " + (i * 10);
        case String s  -> "It is a String: " + s.toUpperCase();
        case null      -> "It is NULL!"; // Yes, we can handle null directly now!
        default        -> "Unknown object type";
    };
    
}
```

---

# 🏢 Company Example — Exhaustive Switch with Sealed Classes

Remember Sealed Classes from the last chapter? If you use a `switch` expression on a `sealed` interface, the compiler knows exactly how many subclasses exist. 

Therefore, **you don't even need a `default` case!** If you add a new subclass later, the compiler throws an error reminding you to update the switch statement. This prevents massive production bugs!

```java
// Sealed Interface restricts implementation to exactly two classes
public sealed interface Payment permits CreditCard, PayPal {}
public record CreditCard(String cardNumber) implements Payment {}
public record PayPal(String email) implements Payment {}

public class PaymentProcessor {
    
    public void process(Payment payment) {
        
        // No 'default' case needed! The compiler guarantees exhaustive coverage.
        switch (payment) {
            case CreditCard cc -> System.out.println("Swiping card: " + cc.cardNumber());
            case PayPal pp     -> System.out.println("Calling PayPal API for: " + pp.email());
        }
        
    }
}
```

---

# Interview Questions

## Q1. What is the difference between a Switch Statement and a Switch Expression?
> A Switch *Statement* executes blocks of code and requires `break` to prevent fall-through. A Switch *Expression* evaluates to a single value, uses the `->` arrow syntax, automatically prevents fall-through, and can be assigned directly to a variable.

## Q2. What happens if you forget a `case` in a Switch Expression?
> Switch Expressions must be **exhaustive**. If you don't cover every possible case (or provide a `default` case), the Java compiler will throw an error and refuse to compile. This makes them much safer than old switch statements.

## Q3. How do Pattern Matching and Sealed Classes work together?
> Sealed classes strictly define all possible subclasses. When you pattern match a sealed class in a switch expression, the compiler can verify that you have written a `case` for every single allowed subclass. This allows you to omit the `default` case and ensures perfect type safety.

---

# Professional Summary

```
Modern Java Features:

1. instanceof Pattern Matching: if (obj instanceof String s) { ... }
   - Automatically casts and binds the variable.
   
2. Switch Expressions:
   - Uses arrow syntax '->'.
   - No 'break' needed (no fall-through bugs).
   - Returns a value directly.
   - Multiple labels allowed: case "A", "B" -> ...
   
3. Switch Pattern Matching:
   - Switch based on the Object's type (case Integer i).
   - Perfect synergy with Sealed Classes for exhaustive checking.
```

---

# 🧠 Memory Trick
```
Arrow (->) in Switch = "Go straight to the result and STOP." No falling through floors like the old colon (:).
```

---

# 🚀 Next Chapter
We'll cover the **`var` Keyword** — how Java adopted Local Variable Type Inference to save you even more typing!
