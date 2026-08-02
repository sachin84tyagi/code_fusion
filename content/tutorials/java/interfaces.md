Welcome to **Java — Chapter 15: Interfaces**.

> **An interface is a completely abstract class (until Java 8). It groups related methods with empty bodies. It is a contract that classes sign to guarantee they provide certain behaviors.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a job contract for a "Driver".
The contract says: "You MUST know how to `steer()`, `brake()`, and `accelerate()`."
It doesn't care if you drive a Toyota, a Ferrari, or a Truck. It doesn't care HOW you do it, just that you CAN do it.

An Interface is that contract. If a class signs it (implements it), it promises to perform those actions.

---

# Interface Syntax

Use the `interface` keyword. A class uses the `implements` keyword.

```java
// The Contract
interface Animal {
    // By default, methods are public and abstract!
    void animalSound(); 
    void sleep();
}

// The Signee (must implement ALL methods)
class Pig implements Animal {
    public void animalSound() {
        System.out.println("The pig says: wee wee");
    }
    public void sleep() {
        System.out.println("Zzz");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal myPig = new Pig(); // Polymorphism!
        myPig.animalSound();
    }
}
```

---

# Multiple Inheritance (The Interface Superpower!)

Java classes cannot extend more than one class. BUT, a Java class can implement multiple interfaces!

```java
interface Flyable {
    void fly();
}

interface Swimmable {
    void swim();
}

// Class implementing multiple interfaces
class Duck implements Flyable, Swimmable {
    public void fly() {
        System.out.println("Duck is flying");
    }
    public void swim() {
        System.out.println("Duck is swimming");
    }
}
```

---

# Interface Variables

Variables declared inside an interface are implicitly `public`, `static`, and `final` (they are constants!).

```java
interface DatabaseConfig {
    String URL = "localhost:3306"; // This is actually: public static final String URL
}
```

---

# Default and Static Methods (Java 8+)

Before Java 8, interfaces could only have abstract methods. 
If you added a new method to an interface, it broke ALL classes implementing it.
Java 8 introduced `default` and `static` methods with bodies!

```java
interface Vehicle {
    void start(); // Abstract

    // Default method (has a body, child class CAN override but doesn't have to)
    default void blowHorn() {
        System.out.println("Beep beep!");
    }

    // Static method (called on the interface itself)
    static void serviceInfo() {
        System.out.println("Service every 5000km");
    }
}

class Car implements Vehicle {
    public void start() { System.out.println("Car started"); }
    // Inherits blowHorn() automatically!
}

// Usage
Car myCar = new Car();
myCar.start();
myCar.blowHorn(); // Uses default implementation
Vehicle.serviceInfo(); // Static method call
```

---

# Interface vs Abstract Class

| Feature | Interface | Abstract Class |
|---------|-----------|----------------|
| Inheritance | Class can implement multiple interfaces | Class can extend only one abstract class |
| Methods | Abstract (default), `default`, `static` | Abstract or regular methods |
| Variables | `public static final` only (Constants) | Any type (instance variables allowed) |
| Constructor | No constructors allowed | Can have constructors |
| Use Case | Defining a role or capability (e.g., `Runnable`) | Core identity/template (e.g., `Animal`) |

---

# 🏢 Company Example — Payment Gateway Integration

Companies use interfaces to allow easy swapping of third-party services.

```java
// The Contract
interface PaymentGateway {
    boolean pay(double amount);
}

// Implementation 1
class Razorpay implements PaymentGateway {
    public boolean pay(double amount) {
        System.out.println("Paid ₹" + amount + " using Razorpay.");
        return true;
    }
}

// Implementation 2
class Stripe implements PaymentGateway {
    public boolean pay(double amount) {
        System.out.println("Paid ₹" + amount + " using Stripe.");
        return true;
    }
}

// Business Logic — Doesn't care WHICH gateway is used!
class OrderService {
    private PaymentGateway gateway;

    // Dependency Injection! (Very important in Spring Boot)
    public OrderService(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    public void checkout(double total) {
        gateway.pay(total); // Works for any gateway!
    }
}

// Usage
PaymentGateway selectedGateway = new Razorpay(); // Or new Stripe()
OrderService service = new OrderService(selectedGateway);
service.checkout(999.0);
```

---

# Interview Questions

## Q1. What happens if a class implements two interfaces that have a default method with the exact same signature?
> This causes the "Diamond Problem" compile error. The class MUST override that default method to resolve the ambiguity, explicitly choosing one or providing a new implementation.

## Q2. Can an interface extend another interface?
> Yes! An interface can extend another interface using the `extends` keyword (and it can even extend multiple interfaces!). A class `implements` an interface, but an interface `extends` an interface.

## Q3. Why were default methods introduced in Java 8?
> To provide backward compatibility. They allowed adding new methods to existing interfaces (like `List` or `Collection`) without breaking the millions of existing classes that implemented those interfaces.

---

# Professional Summary

```
Interface:
- A contract dictating WHAT a class must do, not HOW.
- Keyword: 'interface' (to define), 'implements' (to use).
- Supports Multiple Inheritance.
- Variables are implicitly public static final.
- Methods are implicitly public abstract.
- Since Java 8, can have 'default' and 'static' methods with bodies.
- Since Java 9, can have 'private' methods (for internal default method logic).

Crucial for loosely coupled architecture (like Spring Boot Dependency Injection).
```

---

# 🧠 Memory Trick
```
Abstract Class = "I AM an Animal" (Identity - can only be one thing).
Interface = "I CAN Swim, I CAN Fly" (Capability/Role - can do many things).
```

---

# 🚀 Next Chapter
We'll learn about **Packages and Imports** — how to organize thousands of Java files neatly!
