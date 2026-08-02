Welcome to **Chapter 2 — Core Java OOP**.

> **Java OOP is the foundation of everything in Spring Boot. Without it, annotations, interfaces, and the entire framework will feel like magic — and not the good kind.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Think of a blueprint for a house.

```
Blueprint (Class):
  - Rooms: bedroom, kitchen, bathroom
  - Features: colour, size, floors

Actual House (Object):
  - Built from blueprint
  - Each house is different, but same design
```

**Class** = Blueprint  
**Object** = Actual house built from it

---

# Variables & Data Types

```java
// Primitive types
int age = 25;
double salary = 75000.50;
boolean isActive = true;
char grade = 'A';

// Reference types
String name = "Sachin Tyagi";
int[] scores = {90, 85, 92};

// Final (constant)
final int MAX_RETRY = 3;
```

---

# Methods

```java
public class Calculator {

    // Return type, method name, parameters
    public int add(int a, int b) {
        return a + b;
    }

    // Void method
    public void printResult(int result) {
        System.out.println("Result: " + result);
    }

    // Static method (no object needed)
    public static double calculateTax(double income) {
        return income * 0.30;
    }
}

// Usage
Calculator calc = new Calculator();
int result = calc.add(5, 3);          // 8
Calculator.calculateTax(100000);       // Static call
```

---

# Class & Object

```java
// Class definition
public class User {

    // Fields (state)
    private String name;
    private String email;
    private int age;

    // Constructor
    public User(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }

    // Method
    public String getInfo() {
        return name + " (" + email + ")";
    }

    // toString
    @Override
    public String toString() {
        return "User{name='" + name + "', email='" + email + "'}";
    }
}

// Creating objects
User user1 = new User("Sachin", "sachin@example.com", 25);
User user2 = new User("Rahul", "rahul@example.com", 28);

System.out.println(user1.getName());   // Sachin
System.out.println(user1.getInfo());   // Sachin (sachin@example.com)
```

---

# The 4 Pillars of OOP

## 1. Encapsulation — Data hiding

```java
public class BankAccount {

    private double balance; // Private — hidden from outside

    public double getBalance() {
        return balance;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount; // Controlled access
        }
    }

    public void withdraw(double amount) {
        if (amount <= balance) {
            balance -= amount;
        } else {
            throw new IllegalArgumentException("Insufficient balance");
        }
    }
}
```

---

## 2. Inheritance — Reuse

```java
// Parent class
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void breathe() {
        System.out.println(name + " is breathing");
    }

    public void eat() {
        System.out.println(name + " is eating");
    }
}

// Child class — inherits parent
public class Dog extends Animal {

    public Dog(String name) {
        super(name); // Call parent constructor
    }

    // New method
    public void bark() {
        System.out.println(name + " says: Woof!");
    }
}

// Usage
Dog dog = new Dog("Bruno");
dog.breathe();  // Inherited from Animal
dog.eat();      // Inherited from Animal
dog.bark();     // Dog's own method
```

---

## 3. Polymorphism — Many forms

```java
// Method Overriding (Runtime polymorphism)
public class Shape {
    public double area() {
        return 0;
    }
}

public class Circle extends Shape {
    private double radius;
    public Circle(double radius) { this.radius = radius; }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

public class Rectangle extends Shape {
    private double width, height;
    public Rectangle(double w, double h) { width = w; height = h; }

    @Override
    public double area() {
        return width * height;
    }
}

// Polymorphic usage
Shape[] shapes = { new Circle(5), new Rectangle(4, 6) };
for (Shape s : shapes) {
    System.out.println("Area: " + s.area()); // Correct method called automatically!
}
```

---

## 4. Abstraction — Hide complexity

```java
// Abstract class — blueprint with partial implementation
public abstract class Payment {

    public abstract void processPayment(double amount); // Must implement

    public void generateReceipt(double amount) { // Common for all
        System.out.println("Receipt generated for ₹" + amount);
    }
}

public class UpiPayment extends Payment {
    @Override
    public void processPayment(double amount) {
        System.out.println("UPI payment of ₹" + amount + " processed");
    }
}

public class CardPayment extends Payment {
    @Override
    public void processPayment(double amount) {
        System.out.println("Card payment of ₹" + amount + " processed");
    }
}
```

---

# Interface — Contract

Interfaces define WHAT to do, not HOW.

```java
// Interface
public interface Flyable {
    void fly();       // abstract by default
    void land();

    // Default method (Java 8+)
    default void takeOff() {
        System.out.println("Taking off...");
    }
}

public interface Swimmable {
    void swim();
}

// Class can implement multiple interfaces (unlike extend — only one class)
public class Duck extends Animal implements Flyable, Swimmable {

    public Duck(String name) { super(name); }

    @Override
    public void fly() { System.out.println(name + " is flying"); }

    @Override
    public void land() { System.out.println(name + " landed"); }

    @Override
    public void swim() { System.out.println(name + " is swimming"); }
}
```

---

# Abstract Class vs Interface

| Feature | Abstract Class | Interface |
|---|---|---|
| Keyword | `abstract class` | `interface` |
| Variables | Any type | `public static final` only |
| Methods | Abstract + concrete | Abstract + default |
| Extends | Only one | Multiple with `implements` |
| Constructor | Yes | No |
| Use when | Shared code + structure | Pure contract / capability |

---

# Exception Handling

```java
// Types of Exceptions
// Checked Exception → must handle (compile error if not)
// Unchecked Exception (RuntimeException) → optional handling

public class ExceptionExample {

    // try-catch-finally
    public void readFile(String path) {
        try {
            // Risky code
            FileReader reader = new FileReader(path);
            // ... read file
        } catch (FileNotFoundException e) {
            System.err.println("File not found: " + e.getMessage());
        } catch (IOException e) {
            System.err.println("IO Error: " + e.getMessage());
        } finally {
            System.out.println("This ALWAYS runs — cleanup here");
        }
    }

    // Throwing exception
    public User findUser(Long id) {
        User user = userRepository.find(id);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + id);
        }
        return user;
    }

    // Custom exception
    public class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(Long id) {
            super("User not found with id: " + id);
        }
    }
}
```

---

# Strings

```java
String name = "Sachin Tyagi";

// Common methods
name.length()              // 12
name.toUpperCase()         // SACHIN TYAGI
name.toLowerCase()         // sachin tyagi
name.trim()                // Remove spaces
name.contains("Sachin")    // true
name.startsWith("Sac")     // true
name.endsWith("agi")       // true
name.replace("Sachin", "Rahul")  // Rahul Tyagi
name.split(" ")            // ["Sachin", "Tyagi"]
name.substring(0, 6)       // Sachin
name.charAt(0)             // 'S'
name.isEmpty()             // false
name.isBlank()             // false (Java 11+)

// String comparison (NEVER use == for strings)
String a = "hello";
String b = "hello";
a.equals(b)                // ✅ true
a.equalsIgnoreCase("HELLO") // ✅ true
a == b                     // ❌ Don't use for content comparison!

// StringBuilder (mutable, efficient)
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(", ");
sb.append("World");
String result = sb.toString(); // "Hello, World"

// String.format
String message = String.format("Hello %s, you are %d years old", "Sachin", 25);
// Hello Sachin, you are 25 years old
```

---

# Arrays

```java
// Declaration and initialization
int[] numbers = {10, 20, 30, 40, 50};
String[] names = new String[3];
names[0] = "Sachin";
names[1] = "Rahul";
names[2] = "Priya";

// Access
System.out.println(numbers[0]); // 10
System.out.println(numbers.length); // 5

// Loop
for (int num : numbers) {
    System.out.println(num);
}

// Sort
Arrays.sort(numbers); // {10, 20, 30, 40, 50}

// 2D array
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
System.out.println(matrix[1][2]); // 6

// In Spring — you'll use List<T> mostly, but Arrays appear in:
// @RequestParam List<String> tags
// String[] roles = {"ADMIN", "USER"}
```

---

# How Spring Uses OOP

```java
// @Service is a CLASS
@Service
public class UserService {
    // Fields
    private final UserRepository userRepository;

    // Constructor injection (Dependency Injection = OOP Composition)
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Methods
    public User findById(Long id) { ... }
}

// @RestController EXTENDS nothing but IMPLEMENTS Spring's dispatcher pattern
@RestController
public class UserController {
    // Composition over inheritance
}

// UserDetails — INTERFACE you implement
public class User implements UserDetails {
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { ... }
}

// JpaRepository — INTERFACE you extend
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring generates the implementation!
}
```

---

# Company Example — Infosys Core Java Assessment

Before Spring Boot interviews, Infosys/TCS/Wipro test:

```java
// Q: Design an Employee Management System

abstract class Employee {
    protected String name;
    protected double baseSalary;

    public abstract double calculateSalary();

    public void printPaySlip() {
        System.out.printf("Employee: %s | Salary: ₹%.2f%n", name, calculateSalary());
    }
}

class FullTimeEmployee extends Employee {
    private double bonus;

    @Override
    public double calculateSalary() {
        return baseSalary + bonus;
    }
}

class Contractor extends Employee {
    private int hoursWorked;
    private double hourlyRate;

    @Override
    public double calculateSalary() {
        return hoursWorked * hourlyRate;
    }
}
```

---

# Interview Questions

## Q1. What is OOP?

**Best Answer**
> Object-Oriented Programming organizes code around objects (data + behavior). The 4 pillars are Encapsulation (data hiding), Inheritance (code reuse), Polymorphism (multiple forms), and Abstraction (hiding complexity).

---

## Q2. What is the difference between abstract class and interface?

Abstract class can have constructor, instance variables, and concrete methods — used for partial implementation. Interface is a pure contract with abstract methods (and default methods since Java 8) — a class can implement multiple interfaces.

---

## Q3. What is the difference between checked and unchecked exceptions?

Checked exceptions (e.g., `IOException`) must be handled at compile time using `try-catch` or `throws`. Unchecked exceptions (e.g., `NullPointerException`, `RuntimeException`) don't require explicit handling.

---

## Q4. Why should you not use `==` to compare Strings?

`==` compares object references (memory addresses). `equals()` compares content. Two String objects with the same content can be at different memory addresses.

---

## Q5. What is polymorphism in simple terms?

One interface, many implementations. A parent reference can hold a child object, and the correct overridden method is called at runtime. Example: `Shape s = new Circle(); s.area();` calls Circle's area().

---

# Professional Summary

```
OOP Pillars:
  Encapsulation → private fields + getters/setters
  Inheritance   → extends (one class only)
  Polymorphism  → @Override + parent reference
  Abstraction   → abstract class / interface

In Spring:
  Class    → @Service, @Controller, @Repository
  Interface → JpaRepository, UserDetails
  extends  → JpaRepository<User, Long>
  implements → UserDetails, HealthIndicator

Exception:
  try { } catch (Exception e) { } finally { }
  throw new RuntimeException("msg")
  Custom: class MyEx extends RuntimeException {}
```

---

# 🧠 Memory Trick

```
OOP = AEIOU

A → Abstraction   (hide complexity)
E → Encapsulation (data protection)
I → Inheritance   (code reuse)
O → Object        (instance of class)
U → bUtton (public methods = buttons to interact)
```

---

# 🚀 Next Chapter

We'll master **Collections Framework** — the most-used Java data structures that appear in every Spring Boot application.
