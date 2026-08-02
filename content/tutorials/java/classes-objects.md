Welcome to **Java — Chapter 10: Classes & Objects**.

> **Classes are blueprints. Objects are the actual things built from those blueprints. This is the heart of Object-Oriented Programming — and the heart of Java.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

A **Class** is like a cookie cutter.
An **Object** is the actual cookie made from it.

```
Cookie Cutter (Class):
  Shape: Star
  Size: 5cm
  Material: Steel

Cookie 1 (Object): chocolate flavour, red colour
Cookie 2 (Object): vanilla flavour, yellow colour
Cookie 3 (Object): strawberry flavour, pink colour
```

Same cutter (class) → Different cookies (objects).

---

# Defining a Class

```java
public class Car {

    // Fields (attributes/properties)
    String brand;
    String colour;
    int year;
    double price;
    boolean isElectric;

    // Method (behaviour)
    public void start() {
        System.out.println(brand + " is starting...");
    }

    public void stop() {
        System.out.println(brand + " has stopped.");
    }

    public String getInfo() {
        return brand + " (" + year + ") - ₹" + price;
    }
}
```

---

# Creating Objects

```java
// Syntax: ClassName objectName = new ClassName();
Car car1 = new Car();

// Set field values
car1.brand = "Tata Nexon";
car1.colour = "Blue";
car1.year = 2024;
car1.price = 950000;
car1.isElectric = true;

// Access fields
System.out.println(car1.brand);     // Tata Nexon
System.out.println(car1.year);      // 2024

// Call methods
car1.start();                        // Tata Nexon is starting...
System.out.println(car1.getInfo()); // Tata Nexon (2024) - ₹950000.0

// Multiple objects from same class
Car car2 = new Car();
car2.brand = "Mahindra XUV400";
car2.year = 2023;
car2.price = 1500000;
car2.isElectric = true;

car2.start(); // Mahindra XUV400 is starting...
```

---

# Constructors

A special method that runs automatically when an object is created.

```java
public class User {
    String name;
    String email;
    int age;

    // Default constructor (no parameters)
    public User() {
        name = "Anonymous";
        email = "unknown@email.com";
        age = 0;
    }

    // Parameterized constructor
    public User(String name, String email, int age) {
        this.name = name;      // this.name = field, name = parameter
        this.email = email;
        this.age = age;
    }

    // Constructor overloading
    public User(String name, String email) {
        this(name, email, 0); // Calls the 3-param constructor
    }
}

// Usage
User u1 = new User();                           // Default
User u2 = new User("Sachin", "s@g.com", 25);  // Parameterized
User u3 = new User("Rahul", "r@g.com");        // Overloaded
```

---

# this Keyword

Refers to the current object.

```java
public class Employee {
    String name;
    double salary;

    public Employee(String name, double salary) {
        this.name = name;      // "this.name" = field, "name" = parameter
        this.salary = salary;
    }

    // this() — call another constructor
    public Employee(String name) {
        this(name, 30000.0); // Calls above constructor
    }

    // this as method argument
    public void printDetails() {
        display(this);  // Pass current object to method
    }

    // Return current object (method chaining)
    public Employee setName(String name) {
        this.name = name;
        return this;  // Return current object
    }

    public Employee setSalary(double salary) {
        this.salary = salary;
        return this;
    }
}

// Method chaining using this
Employee emp = new Employee("Sachin")
    .setName("Sachin Tyagi")
    .setSalary(75000.0);
```

---

# null and Object References

```java
Car car = null;    // car points to nothing

car.start();       // ❌ NullPointerException!

// Always check for null before using object
if (car != null) {
    car.start();   // Safe
}

// Java 8+ — Optional (preferred)
Optional<Car> optCar = Optional.ofNullable(getCar());
optCar.ifPresent(c -> c.start());
```

---

# Memory — Stack & Heap

```java
Car car1 = new Car();
Car car2 = car1;     // Both point to SAME object!

car2.brand = "Changed!";
System.out.println(car1.brand); // "Changed!" (same object!)

// Stack:
//   car1 → [reference: 0x1234]
//   car2 → [reference: 0x1234]  ← same!
// Heap:
//   0x1234: Car { brand: "Changed!", ... }
```

---

# Record — Modern Java (Java 16+)

For simple data-holder classes, use `record` instead.

```java
// Traditional class (verbose):
public class Point {
    private final int x;
    private final int y;
    public Point(int x, int y) { this.x = x; this.y = y; }
    public int x() { return x; }
    public int y() { return y; }
    // equals, hashCode, toString auto-generated
}

// Record (concise — immutable by default):
public record Point(int x, int y) {}

// Usage — same!
Point p = new Point(3, 4);
System.out.println(p.x()); // 3
System.out.println(p);     // Point[x=3, y=4]
```

---

# 🏢 Company Example — Paytm Account System

```java
public class Account {

    private final long accountNumber;
    private String holderName;
    private double balance;
    private boolean isActive;

    // Constructor
    public Account(long accountNumber, String holderName, double initialBalance) {
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.balance = initialBalance;
        this.isActive = true;
    }

    // Business methods
    public boolean deposit(double amount) {
        if (!isActive || amount <= 0) return false;
        this.balance += amount;
        return true;
    }

    public boolean withdraw(double amount) {
        if (!isActive || amount <= 0 || balance < amount) return false;
        this.balance -= amount;
        return true;
    }

    public boolean transfer(Account target, double amount) {
        if (this.withdraw(amount)) {
            target.deposit(amount);
            return true;
        }
        return false;
    }

    // Getters
    public long getAccountNumber() { return accountNumber; }
    public double getBalance() { return balance; }
    public boolean isActive() { return isActive; }

    @Override
    public String toString() {
        return String.format("Account[%d | %s | ₹%.2f]",
            accountNumber, holderName, balance);
    }
}

// Usage:
Account acc1 = new Account(1001L, "Sachin", 10000.0);
Account acc2 = new Account(1002L, "Rahul", 5000.0);
acc1.transfer(acc2, 3000.0);
System.out.println(acc1); // Account[1001 | Sachin | ₹7000.00]
System.out.println(acc2); // Account[1002 | Rahul  | ₹8000.00]
```

---

# Interview Questions

## Q1. What is the difference between a class and an object?

**Best Answer**
> A class is a blueprint or template that defines the properties (fields) and behaviors (methods) of a type. An object is an instance of a class — a concrete entity in memory created using `new`. A class exists once in code; multiple objects can be created from it.

---

## Q2. What is a constructor? How is it different from a method?

> A constructor is a special block of code that initializes an object when it is created with `new`. Key differences: a constructor has the same name as the class, no return type (not even void), is called automatically on object creation, and cannot be called explicitly.

---

## Q3. What is `this` keyword?

> `this` refers to the current object instance. It is used to: (1) distinguish instance fields from parameters with the same name, (2) call another constructor with `this()`, (3) pass the current object as an argument, and (4) return the current object for method chaining.

---

# Professional Summary

```
Class:
  Fields   → state (what it has)
  Methods  → behaviour (what it does)
  Constructor → initialization (how to create)

Object:
  ClassName obj = new ClassName(args);
  obj.field
  obj.method()

Constructor:
  Same name as class
  No return type
  Can be overloaded
  this() → call another constructor

this keyword:
  this.field  → disambiguate field from param
  this()      → call another constructor
  return this → method chaining

null:
  Default value of object references
  Causes NullPointerException if dereferenced
  Always null-check before use
```

---

# 🧠 Memory Trick

```
Class = House Blueprint (paper drawing)
Object = Actual house built from blueprint

Blueprint defines:
  - Number of rooms (fields)
  - What each room does (methods)

Constructor = Builder who reads blueprint and builds house
  new User("Sachin", "s@g.com") = "Build a User house for Sachin"

this = "Talking about MY house specifically"
  this.name = MY name (not someone else's)
```

---

# 🚀 Next Chapter

We'll learn **Encapsulation** — how to protect your data using `private` fields and controlled access through getters and setters.
