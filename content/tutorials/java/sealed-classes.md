Welcome to **Java — Chapter 40: Sealed Classes (Java 17+)**.

> **In the past, a class was either `public` (anyone can extend it) or `final` (no one can extend it). Sealed Classes give you precise control: "Only these SPECIFIC classes are allowed to extend me!"**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you create a secret club recipe called `Burger`.
You want to let your two trusted friends, `CheeseBurger` and `VegBurger`, copy the recipe (extend it).
But you DO NOT want some random stranger, `MudBurger`, to copy your recipe.

Before Sealed classes, if `Burger` was public, `MudBurger` could copy it.
With Sealed classes, you put a VIP list on the door: "Only CheeseBurger and VegBurger are permitted!"

---

# The Syntax: `sealed` and `permits`

To seal a class, use the `sealed` keyword, followed by the `permits` keyword listing the allowed subclasses.

```java
// The VIP List!
public sealed class Shape permits Circle, Square, Triangle {
    public void draw() {
        System.out.println("Drawing a shape...");
    }
}
```

---

# The Rule of Subclasses

If a class is permitted to extend a sealed class, Java forces the subclass to declare exactly how it will continue the bloodline. 
The subclass **MUST** choose one of three modifiers:

1. **`final`** (Ends the bloodline. Cannot be extended further).
2. **`sealed`** (Continues the restriction, must permit its own subclasses).
3. **`non-sealed`** (Opens the bloodline! Anyone can extend this subclass).

```java
// 1. Final: Stops here. Nobody can extend Circle.
public final class Circle extends Shape {
    public double radius;
}

// 2. Sealed: Continues the restriction.
public sealed class Square extends Shape permits ColoredSquare {
    public double side;
}
public final class ColoredSquare extends Square { }

// 3. Non-Sealed: Opens it back up to the public!
public non-sealed class Triangle extends Shape {
    public double base, height;
}
// Anyone can extend Triangle now!
class WeirdTriangle extends Triangle { }
```

---

# Trying to break the rule...

If an uninvited class tries to extend the Sealed class, the compiler stops it instantly!

```java
// ❌ COMPILE ERROR: 'Pentagon' is not allowed in the sealed hierarchy of 'Shape'
public class Pentagon extends Shape { 
}
```

---

# Interfaces can be Sealed too!

You can apply the exact same logic to Interfaces.

```java
public sealed interface PaymentMethod permits CreditCard, UPI {
    boolean processPayment();
}

public final class CreditCard implements PaymentMethod {
    public boolean processPayment() { return true; }
}

public final class UPI implements PaymentMethod {
    public boolean processPayment() { return true; }
}

// ❌ ERROR: Cash is not permitted to implement PaymentMethod!
// public class Cash implements PaymentMethod {} 
```

---

# 🏢 Company Example — Secure Domain Modeling

In Domain-Driven Design (DDD), representing exact states is crucial. A server response can only be a `Success` or an `Error`. If a developer creates a third subclass called `MaybeSuccess`, it breaks the system logic! Sealed classes prevent this.

```java
// API Result can ONLY be Success or Error. Nothing else.
public sealed interface ApiResult<T> permits Success, Error {
}

// The Success record (Records are implicitly 'final', so they fit perfectly!)
public record Success<T>(T data) implements ApiResult<T> {
}

// The Error record
public record Error<T>(String errorMessage, int code) implements ApiResult<T> {
}

// Usage in Business Logic
public ApiResult<User> fetchUser(int id) {
    if (id == 1) {
        return new Success<>(new User("Sachin"));
    } else {
        return new Error<>("User not found", 404);
    }
}
```

---

# Interview Questions

## Q1. What problem do Sealed Classes solve?
> They solve the problem of unlimited inheritance. Before, you could either allow anyone to extend a class, or mark it `final` so no one could. Sealed classes allow domain modeling where the author defines exactly which subclasses exist, increasing security and making code predictable.

## Q2. What are the three modifiers a permitted subclass must use?
> A subclass of a sealed class must declare itself as `final` (cannot be extended), `sealed` (can only be extended by its own permitted subclasses), or `non-sealed` (can be extended by any class).

## Q3. Are Records good candidates for Sealed Classes?
> Yes! Because Records are implicitly `final`, they perfectly satisfy the rule that permitted subclasses must declare their inheritance status. You can have a `sealed interface` permitted to multiple `record` implementations.

---

# Professional Summary

```
Sealed Classes (Java 17):
- Restrict which other classes or interfaces may extend or implement them.
- Syntax: sealed class Parent permits ChildA, ChildB {}
- The permitted children MUST be in the same package (or module).
- The permitted children MUST declare themselves as final, sealed, or non-sealed.
- Enhances security and enables exhaustive Pattern Matching (Switch expressions).
```

---

# 🧠 Memory Trick
```
final = "I have NO children."
public = "I accept ANY children."
sealed = "I only accept THESE SPECIFIC children on my VIP list."
```

---

# 🚀 Next Chapter
Sealed Classes become incredibly powerful when combined with our next topic: **Pattern Matching**! Let's see how Java 17+ revolutionized the `switch` statement!
