Welcome to **Java — Chapter 43: S.O.L.I.D. Principles**.

> **Anyone can write code that a computer understands. Good programmers write code that humans can understand and maintain. SOLID is the rulebook for writing professional, scalable code.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

If you build a Lego castle by gluing all the pieces together, and later decide you want to change the tower, you have to break the whole castle.

If you just click them together properly, you can snap off the tower and attach a new one without breaking anything.

**SOLID principles** teach you how to build your Java code so pieces can be snapped on and off without breaking the whole application.

---

# The 5 Principles (S.O.L.I.D.)

## 1. S - Single Responsibility Principle (SRP)
> **"A class should have one, and only one, reason to change."**

A class should only do ONE job.

### ❌ Bad
```java
class Employee {
    public void calculatePay() { /* logic */ }
    public void saveToDatabase() { /* logic */ } // Database logic in Employee? BAD!
    public void generateReport() { /* logic */ } // Reporting logic? BAD!
}
```

### ✅ Good
```java
class Employee { /* Holds data */ }
class SalaryCalculator { public void calculatePay(Employee e) { } }
class EmployeeRepository { public void saveToDatabase(Employee e) { } }
```

---

## 2. O - Open/Closed Principle (OCP)
> **"Software entities should be OPEN for extension, but CLOSED for modification."**

You should be able to add new features without touching existing, tested code.

### ❌ Bad
```java
class DiscountCalculator {
    public double calculate(String type, double amount) {
        if (type.equals("FESTIVAL")) return amount * 0.2;
        if (type.equals("NEW_YEAR")) return amount * 0.3; // Had to MODIFY existing class!
        return 0;
    }
}
```

### ✅ Good (Using Polymorphism / Interfaces)
```java
interface Discount { double calculate(double amount); }

class FestivalDiscount implements Discount {
    public double calculate(double amount) { return amount * 0.2; }
}

class NewYearDiscount implements Discount {
    public double calculate(double amount) { return amount * 0.3; } // EXTENDED without modifying old code!
}
```

---

## 3. L - Liskov Substitution Principle (LSP)
> **"Child classes should never break the parent class's type definitions."**

If Class B extends Class A, you should be able to replace A with B without the program crashing. 

### ❌ Bad
```java
class Bird {
    public void fly() { System.out.println("Flying"); }
}

class Penguin extends Bird {
    @Override
    public void fly() {
        throw new RuntimeException("I can't fly!"); // Breaking the Parent's promise!
    }
}
// If the system expects a Bird and calls fly(), Penguin crashes it!
```

### ✅ Good
```java
class Bird { }
class FlyingBird extends Bird { public void fly() { } }

class Sparrow extends FlyingBird { }
class Penguin extends Bird { public void swim() { } } // Doesn't implement fly()
```

---

## 4. I - Interface Segregation Principle (ISP)
> **"Do not force a class to implement an interface it doesn't use."**

Keep interfaces small and specific. Don't create "Fat Interfaces".

### ❌ Bad
```java
interface Worker {
    void work();
    void eat();
}

class Robot implements Worker {
    public void work() { System.out.println("Working"); }
    public void eat() { throw new RuntimeException("Robots don't eat!"); } // Forced to implement!
}
```

### ✅ Good
```java
interface Workable { void work(); }
interface Eatable { void eat(); }

class Human implements Workable, Eatable { /* Implements both */ }
class Robot implements Workable { /* Only implements work */ }
```

---

## 5. D - Dependency Inversion Principle (DIP)
> **"High-level modules should not depend on low-level modules. Both should depend on abstractions (interfaces)."**

Don't hardcode exact classes inside other classes. Pass interfaces instead! (This is the entire foundation of Spring Boot Dependency Injection).

### ❌ Bad
```java
class MySQLDatabase {
    public void insert() { System.out.println("Saving to MySQL"); }
}

class UserService {
    // Hardcoded tightly coupled dependency!
    private MySQLDatabase db = new MySQLDatabase(); 
}
```

### ✅ Good
```java
interface Database { void insert(); }

class MySQLDatabase implements Database { public void insert() {} }
class MongoDatabase implements Database { public void insert() {} }

class UserService {
    private Database db;

    // We pass the interface via constructor. UserService doesn't care WHICH db it is!
    public UserService(Database db) { 
        this.db = db;
    }
}
```

---

# 🏢 Company Example — Putting it together

Companies use SOLID because codebases survive for 10+ years. If a codebase violates SRP and OCP, adding a new feature takes weeks and introduces dozens of bugs because everything is tangled together (Spaghetti code). 

By strictly adhering to SOLID, a junior dev can add `ApplePay` to a payment system just by creating a new class `ApplePay implements PaymentMethod`, without ever touching the core `CheckoutService` class!

---

# Interview Questions

## Q1. Can you explain the Open/Closed Principle with an example?
> It means code should be open for extension but closed for modification. For example, instead of writing a massive `switch` statement that checks user roles (Admin, Guest, User) to calculate permissions, we should create a `Role` interface with a `getPermissions()` method. If we add a new `SuperAdmin` role later, we just create a new class implementing `Role`. We extended the system without modifying the existing calculator logic.

## Q2. How is Dependency Inversion implemented in modern Java frameworks?
> Through Inversion of Control (IoC) containers and Dependency Injection (DI). In Spring Boot, instead of using `new` to instantiate dependencies, we use the `@Autowired` or constructor injection to inject interfaces. Spring handles providing the actual implementation at runtime.

## Q3. Which SOLID principle does the "God Object" anti-pattern violate?
> The Single Responsibility Principle (SRP). A "God Object" is a massive class (e.g., `GlobalManager`) that knows too much and does too much (handling DB, UI, validation, and networking). It has dozens of reasons to change, making it a maintenance nightmare.

---

# Professional Summary

```
SOLID Principles:
S - Single Responsibility: One class, one job.
O - Open/Closed: Add new code via interfaces/inheritance, don't edit old code.
L - Liskov Substitution: Child classes must behave exactly like Parent classes without crashing.
I - Interface Segregation: Keep interfaces tiny. Don't force methods on classes that don't need them.
D - Dependency Inversion: Depend on Interfaces, not concrete classes.
```

---

# 🧠 Memory Trick
```
S - Single Job
O - Open to Add, Closed to Edit
L - Lego Substitution (Green block fits exactly where Red block did)
I - Interfaces Should Be Tiny
D - Depend on Interfaces
```

---

# 🚀 Next Chapter
Now that we know the rules of clean code, let's look at the standard solutions to common programming problems: **Design Patterns**!
