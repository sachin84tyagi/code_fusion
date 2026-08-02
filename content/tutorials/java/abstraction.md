Welcome to **Java — Chapter 14: Abstraction (Abstract Classes)**.

> **Abstraction is about hiding the complex implementation details and showing only the essential features to the user. It helps in reducing programming complexity and effort.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

When you drive a car, you know that pressing the accelerator increases speed and pressing the brake stops it. 
Do you need to know exactly how the fuel injector works or how the brake pads grip the disc? No!

The complex internal workings are **hidden** from you. You are only provided with a simple interface (pedals). 
This is Abstraction.

---

# How to Achieve Abstraction in Java?

There are two ways:
1. **Abstract Classes** (0 to 100% abstraction)
2. **Interfaces** (100% abstraction) — *We'll cover this in the next chapter.*

---

# Abstract Classes

An abstract class is a restricted class that **cannot be used to create objects** (to access it, it must be inherited from another class).

Use the `abstract` keyword.

```java
// Abstract Class (Idea/Concept)
abstract class Shape {
    String color;

    // Abstract method (does not have a body) - Forces children to implement it
    public abstract void draw(); 

    // Regular method (has a body)
    public void setColor(String color) {
        this.color = color;
    }
}
```

---

# Abstract Methods

An abstract method is a method that is declared without an implementation (without braces, followed by a semicolon).
**Rule:** If a class has an abstract method, the class MUST be declared abstract.

```java
// Child class MUST override the abstract method
class Circle extends Shape {
    @Override
    public void draw() {
        System.out.println("Drawing a " + color + " circle.");
    }
}

public class Main {
    public static void main(String[] args) {
        // Shape s = new Shape(); ❌ ERROR: Cannot instantiate an abstract class
        
        Shape circle = new Circle(); // Polymorphism!
        circle.setColor("Red");      // Inherited regular method
        circle.draw();               // Implemented abstract method
    }
}
```

---

# Why Use Abstract Classes?

If `Shape` was a normal class, someone could do `new Shape()`. But what does a generic "Shape" look like? It doesn't exist in reality! Only specific shapes (Circle, Square) exist.
Making it abstract prevents illogical object creation while providing a common template and shared code (like `color`) for subclasses.

---

# 🏢 Company Example — Notification System

```java
// Common abstract template
abstract class Notification {
    protected String recipient;
    protected String message;

    public Notification(String recipient, String message) {
        this.recipient = recipient;
        this.message = message;
    }

    // Every notification type must implement its own sending logic
    public abstract void send();
    
    // Shared logic
    public void logNotification() {
        System.out.println("Log: Notification sent to " + recipient);
    }
}

// Specific Implementations
class EmailNotification extends Notification {
    public EmailNotification(String recipient, String message) {
        super(recipient, message);
    }

    @Override
    public void send() {
        System.out.println("Connecting to SMTP server...");
        System.out.println("Emailing " + recipient + ": " + message);
        logNotification();
    }
}

class SMSNotification extends Notification {
    public SMSNotification(String recipient, String message) {
        super(recipient, message);
    }

    @Override
    public void send() {
        System.out.println("Connecting to Telecom API...");
        System.out.println("SMS to " + recipient + ": " + message);
        logNotification();
    }
}

// Usage in Business Logic
Notification email = new EmailNotification("user@gmail.com", "Welcome!");
email.send();
```

---

# Interview Questions

## Q1. Can an abstract class have a constructor?
> Yes, abstract classes can have constructors. Although you cannot instantiate them directly using `new`, their constructors are called when a child class object is created (via `super()`).

## Q2. Can an abstract class be final?
> No. The `abstract` keyword means the class must be extended. The `final` keyword means the class cannot be extended. They are complete opposites and cannot be used together.

## Q3. Does an abstract class have to contain abstract methods?
> No. An abstract class can have zero abstract methods. However, if a class contains even one abstract method, the class MUST be declared abstract.

---

# Professional Summary

```
Abstract Class:
- Declared with the 'abstract' keyword.
- Cannot be instantiated (no 'new').
- Can contain both abstract methods (no body) and regular methods (with body).
- Can have constructors and fields.
- Subclasses MUST provide implementations for all abstract methods (or be declared abstract themselves).

Purpose:
To provide a common template (partial implementation) for related child classes, ensuring certain methods are always implemented while sharing common logic.
```

---

# 🧠 Memory Trick
```
Abstract Class = A blueprint with some blank spaces.
You can't build a house directly from it (can't instantiate).
You must copy the blueprint (extend), fill in the blanks (override abstract methods), and THEN build the house.
```

---

# 🚀 Next Chapter
We'll learn about **Interfaces** — the ultimate form of abstraction, which solves the multiple inheritance problem!
