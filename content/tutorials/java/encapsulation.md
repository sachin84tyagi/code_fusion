Welcome to **Java — Chapter 11: Encapsulation**.

> **Encapsulation protects your data. It hides the internal details and only exposes what's necessary. It's the reason you can't accidentally corrupt an object's state from outside.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a TV remote control.

```
What you CAN do:
  Press Volume Up  ✅
  Press Channel +  ✅
  Press Power      ✅

What you CANNOT do:
  Directly touch the circuits inside  ❌
  Manually change the battery voltage ❌
  Rewire the buttons                  ❌
```

The remote **hides** its internal circuits.
You interact only through the **buttons** (public methods).

Encapsulation = Hiding internal data, exposing controlled access.

---

# Without Encapsulation — The Problem

```java
public class BankAccount {
    public double balance = 10000.0;  // Public field — DANGEROUS!
}

// Anyone can do this:
BankAccount acc = new BankAccount();
acc.balance = -999999;   // Invalid! No validation!
acc.balance = 0.0001;    // No minimum check!
System.out.println(acc.balance); // Direct access — no logging!
```

---

# With Encapsulation — The Solution

```java
public class BankAccount {

    // private = hidden from outside
    private double balance;
    private String accountNumber;

    // Constructor
    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        if (initialBalance >= 0) {
            this.balance = initialBalance;
        } else {
            throw new IllegalArgumentException("Initial balance cannot be negative");
        }
    }

    // Getter — controlled READ access
    public double getBalance() {
        return balance;
    }

    // No setter for balance — balance only changes through deposit/withdraw
    // This is intentional encapsulation!

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        } else {
            throw new IllegalArgumentException("Deposit must be positive");
        }
    }

    public void withdraw(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        if (amount > balance) throw new IllegalStateException("Insufficient balance");
        balance -= amount;
    }
}

// Now outside code CANNOT do:
BankAccount acc = new BankAccount("ACC001", 10000);
// acc.balance = -999;   ❌ Compile error! balance is private
acc.deposit(5000);       // ✅ Controlled
acc.withdraw(2000);      // ✅ Validated
acc.getBalance();        // ✅ Read-only
```

---

# Getters and Setters (Standard Pattern)

```java
public class Employee {

    private String name;
    private String email;
    private double salary;
    private int age;

    // Getter — returns value
    public String getName() { return name; }
    public String getEmail() { return email; }
    public double getSalary() { return salary; }
    public int getAge() { return age; }

    // Setter — validates and sets value
    public void setName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name cannot be blank");
        }
        this.name = name.trim();
    }

    public void setEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
        this.email = email.toLowerCase();
    }

    public void setSalary(double salary) {
        if (salary < 15000) {
            throw new IllegalArgumentException("Salary below minimum wage");
        }
        this.salary = salary;
    }

    public void setAge(int age) {
        if (age < 18 || age > 65) {
            throw new IllegalArgumentException("Age must be 18-65");
        }
        this.age = age;
    }
}
```

---

# boolean Getter Convention

```java
public class User {
    private boolean active;
    private boolean verified;
    private boolean premium;

    // boolean uses "is" prefix, not "get"
    public boolean isActive() { return active; }
    public boolean isVerified() { return verified; }
    public boolean isPremium() { return premium; }

    public void setActive(boolean active) { this.active = active; }
}
```

---

# Lombok — Auto-Generate Boilerplate (Used in Spring Boot!)

```java
// WITHOUT Lombok: 50+ lines of getters/setters
// WITH Lombok: 5 lines!

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data              // Generates: getters, setters, toString, equals, hashCode
@AllArgsConstructor // Generates: constructor with all fields
@NoArgsConstructor  // Generates: no-arg constructor
@Builder           // Generates: Builder pattern
public class Product {
    private Long id;
    private String name;
    private double price;
    private int stock;
    private boolean available;
}

// Builder pattern usage (Lombok)
Product product = Product.builder()
    .name("iPhone 15")
    .price(79999.0)
    .stock(100)
    .available(true)
    .build();
```

---

# Read-Only and Write-Only Fields

```java
public class Transaction {

    // Read-only — getter only, no setter
    private final String transactionId;
    private final long timestamp;

    // Write-only — setter only, no getter (e.g., password)
    private String password;

    public Transaction(String transactionId) {
        this.transactionId = transactionId;
        this.timestamp = System.currentTimeMillis();
    }

    // Read-only fields
    public String getTransactionId() { return transactionId; }
    public long getTimestamp() { return timestamp; }

    // Write-only (set but never read externally)
    public void setPassword(String password) {
        this.password = hashPassword(password);
    }

    private String hashPassword(String pwd) { return "hashed:" + pwd; }
}
```

---

# 🏢 Company Example — Zomato Restaurant Profile

```java
public class Restaurant {

    private Long id;
    private String name;
    private double rating;       // 0.0 to 5.0
    private int totalReviews;
    private boolean isOpen;
    private double deliveryRadius; // in km
    private int minOrderAmount;

    // Controlled rating update (business logic inside setter)
    public void addRating(double newRating) {
        if (newRating < 0 || newRating > 5) {
            throw new IllegalArgumentException("Rating must be 0-5");
        }
        // Recalculate average
        double total = this.rating * this.totalReviews + newRating;
        this.totalReviews++;
        this.rating = Math.round((total / this.totalReviews) * 10.0) / 10.0;
    }

    public void openRestaurant() {
        this.isOpen = true;
    }

    public void closeRestaurant() {
        this.isOpen = false;
    }

    // Only expose what's needed
    public Long getId() { return id; }
    public String getName() { return name; }
    public double getRating() { return rating; }
    public boolean isOpen() { return isOpen; }

    public boolean canDeliver(double customerDistance) {
        return isOpen && customerDistance <= deliveryRadius;
    }
}
```

---

# Interview Questions

## Q1. What is encapsulation?

**Best Answer**
> Encapsulation is the OOP principle of bundling data (fields) and methods together in a class while restricting direct access to the data using `private` access modifier. External code interacts only through public getter/setter methods. This protects data integrity, allows validation, and hides implementation details.

---

## Q2. Why should fields be `private`?

> Private fields prevent external code from setting invalid values (e.g., negative salary, null name). All access goes through methods where validation logic can be enforced. It also allows changing the internal implementation without breaking external code.

---

## Q3. Is it mandatory to have getters/setters for every private field?

> No. Only expose what's necessary. Some fields might need no setter (read-only, set only in constructor). Some might need no getter (write-only, like passwords). Some fields might be changed only through specific business methods (like balance in BankAccount). Thoughtful encapsulation means exposing minimum necessary access.

---

# Professional Summary

```
Encapsulation = private fields + public methods

Pattern:
  private String name;
  public String getName() { return name; }
  public void setName(String name) {
      // validation here
      this.name = name;
  }

boolean convention:
  private boolean active;
  public boolean isActive() { return active; }

Read-only field:
  private final String id;  // Only getter, no setter

Lombok shortcuts:
  @Data = @Getter + @Setter + @ToString + @EqualsAndHashCode
  @AllArgsConstructor = all-fields constructor
  @NoArgsConstructor  = no-arg constructor
  @Builder = builder pattern
```

---

# 🧠 Memory Trick

```
Encapsulation = Capsule (medicine)

Inside capsule: bitter medicine (private data)
Outside: smooth coating (public methods)

You swallow the smooth coating — don't touch bitter inside!
Body absorbs medicine in controlled way.

private = bitter medicine inside
public methods = smooth coating outside
getters = window to see inside
setters = controlled door to change inside
```

---

# 🚀 Next Chapter

We'll learn **Inheritance** — how one class can inherit properties and methods from another, enabling powerful code reuse.
