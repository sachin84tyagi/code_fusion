Welcome to **Java — Chapter 47: The Builder Pattern**.

> **When a class has many optional fields, creating constructors becomes a nightmare (The Telescoping Constructor Anti-Pattern). The Builder pattern solves this by providing a clean, step-by-step way to construct objects.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine ordering a Subway Sandwich.
You don't just say "Give me Sandwich Type 4." 
You say:
1. "Give me Italian bread."
2. "Add Chicken."
3. "No onions."
4. "Extra mayo."
5. "Wrap it up!" (Build it).

The Builder pattern does exactly this in code. You chain commands together step-by-step, and at the end, you call `.build()` to get the final object.

---

# The Problem: Telescoping Constructors

Imagine a `User` class with many optional fields.

```java
// ❌ Bad Code
public class User {
    private String firstName; // Required
    private String lastName;  // Required
    private int age;          // Optional
    private String phone;     // Optional
    private String address;   // Optional

    // Now you have to create constructors for every possible combination!
    public User(String fn, String ln) { ... }
    public User(String fn, String ln, int age) { ... }
    public User(String fn, String ln, String phone) { ... }
    public User(String fn, String ln, int age, String phone, String addr) { ... }
}

// Client code becomes an unreadable mess:
// What does '0' and 'null' mean here?!
User u = new User("Sachin", "Tyagi", 0, null, "Delhi"); 
```

---

# The Solution: The Builder Pattern

We create a static inner class called `Builder`. It mirrors all the fields of the main class.

```java
public class User {
    private final String firstName; // Required
    private final String lastName;  // Required
    private final int age;          // Optional
    private final String phone;     // Optional
    private final String address;   // Optional

    // Private constructor! Only the Builder can call this.
    private User(UserBuilder builder) {
        this.firstName = builder.firstName;
        this.lastName  = builder.lastName;
        this.age       = builder.age;
        this.phone     = builder.phone;
        this.address   = builder.address;
    }

    // --- Static Builder Class ---
    public static class UserBuilder {
        private final String firstName;
        private final String lastName;
        private int age;
        private String phone;
        private String address;

        // Required parameters go in the Builder's constructor
        public UserBuilder(String firstName, String lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        }

        // Optional parameters have setter methods that RETURN THE BUILDER (this)
        public UserBuilder age(int age) {
            this.age = age;
            return this;
        }

        public UserBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public UserBuilder address(String address) {
            this.address = address;
            return this;
        }

        // The magical build() method returns the final User object
        public User build() {
            return new User(this);
        }
    }
}
```

---

# Usage: Beautiful, Readable Code!

Now look at how the client creates a User object. It is perfectly readable, completely immutable, and highly flexible!

```java
public class Main {
    public static void main(String[] args) {
        
        // Creating a user with only required fields
        User user1 = new User.UserBuilder("Sachin", "Tyagi").build();

        // Creating a user with specific optional fields (Method Chaining!)
        User user2 = new User.UserBuilder("Rahul", "Sharma")
                        .age(30)
                        .address("Mumbai, India")
                        .build(); 
                        
        // Notice we didn't have to pass 'null' for phone!
    }
}
```

---

# The Lombok `@Builder` Shortcut

In modern enterprise Java (like Spring Boot), writing 50 lines of Builder code manually is rare. We use the **Lombok** library to auto-generate the entire Builder class at compile time with a single annotation!

```java
import lombok.Builder;

// ✅ This ONE annotation generates the entire 50-line Builder class from above!
@Builder
public class Product {
    private String id;
    private String name;
    private double price;
    private String category;
}

// Usage remains exactly the same!
Product p = Product.builder()
               .id("P1")
               .name("Laptop")
               .price(999.99)
               .build();
```

---

# 🏢 Company Example — API Request Payloads

When a company builds a client SDK (e.g., the Stripe Payment SDK), they use Builders to allow developers to construct complex API requests easily.

```java
// Imaginary Stripe API call
ChargeRequest request = ChargeRequest.builder()
                            .amount(1000) // $10.00
                            .currency("USD")
                            .source("tok_visa") // Card token
                            .description("Payment for Order #1234")
                            .receiptEmail("customer@gmail.com")
                            .build();

stripeClient.charge(request);
```

---

# Interview Questions

## Q1. What is the main advantage of the Builder pattern?
> It solves the Telescoping Constructor anti-pattern. It makes object instantiation highly readable (using named methods instead of positional arguments), allows for easy handling of optional parameters without passing `null`s, and allows the resulting object to be entirely immutable (no setters required on the main class).

## Q2. How is the Builder pattern different from the Factory pattern?
> The Factory pattern is used when the creation of an object is a single-step process, but the *type* of the object is determined at runtime (e.g., returning an SMS or Email notification). The Builder pattern is used when the creation of an object is a complex, multi-step process requiring many parameters, but the type is known.

## Q3. Can a Builder pattern throw exceptions?
> Yes. The `build()` method is the perfect place to put complex cross-field validation logic. If the user calls `.build()` but provided an invalid combination of data (e.g., provided an email but didn't provide a required username), the `build()` method can throw an `IllegalStateException`.

---

# Professional Summary

```
Builder Pattern:
- A Creational Pattern used for complex object construction.
- Solves the problem of constructors with too many parameters.
- Uses a static inner 'Builder' class.
- Uses 'Method Chaining' (methods returning 'this').
- Keeps the target class Immutable (all fields final, private constructor).
- Heavily automated in modern Java using Lombok's @Builder.
```

---

# 🧠 Memory Trick
```
Builder = The Subway Sandwich artist.
You give them a chain of commands (bread, meat, sauce).
They return the final product only when you say "build()" (Wrap it up!).
```

---

# 🚀 Next Chapter
Congratulations! You have completed the Core Java track! Let's wrap up with **What's Next** to see how to apply this knowledge to Real-World Frameworks.
