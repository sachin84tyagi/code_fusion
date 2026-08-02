Welcome to **Java — Chapter 21: Enums**.

> **An Enum (Enumeration) is a special Java type used to define collections of constants. Whenever you have a variable that can only take one out of a small set of possible values, use an Enum.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Think of a Traffic Light. It can only be:
- RED
- YELLOW
- GREEN

It cannot be "Blue" or "Purple".

If you use a `String` for the traffic light, someone might accidentally type `"PURPLE"`.
If you use an `Enum`, Java physically stops anyone from choosing a color outside of Red, Yellow, or Green. It guarantees safety!

---

# Basic Enum Definition

Use the `enum` keyword. Constants are written in ALL_CAPS.

```java
// Definition
enum Level {
    LOW,
    MEDIUM,
    HIGH
}

public class Main {
    public static void main(String[] args) {
        // Usage
        Level myVar = Level.MEDIUM; 
        
        System.out.println(myVar); // Output: MEDIUM
    }
}
```

---

# Enums in `switch` Statements

Enums are heavily used with `switch` cases.

```java
enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

public class Test {
    public static void main(String[] args) {
        Day today = Day.FRIDAY;

        switch (today) {
            case MONDAY:
                System.out.println("Back to work");
                break;
            case FRIDAY:
                System.out.println("Weekend is near!"); // This prints
                break;
            case SATURDAY:
            case SUNDAY:
                System.out.println("Weekend!");
                break;
            default:
                System.out.println("Midweek");
        }
    }
}
```
*Note: In the switch cases, you just write `FRIDAY`, not `Day.FRIDAY`.*

---

# Looping Through Enums

Every Enum automatically gets a `values()` method that returns an array of all constants.

```java
for (Level l : Level.values()) {
    System.out.println(l);
}
/* Output:
   LOW
   MEDIUM
   HIGH
*/
```

---

# Advanced Enums (Constructors & Fields)

Enums in Java are actually full classes! They can have fields, constructors, and methods.

```java
enum Size {
    // These call the constructor!
    SMALL(10), 
    MEDIUM(20), 
    LARGE(30); 

    // Instance variable
    private int value;

    // Enum Constructor (Must be private or default!)
    private Size(int value) {
        this.value = value;
    }

    // Method
    public int getValue() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Size pizzaSize = Size.LARGE;
        
        System.out.println(pizzaSize); // LARGE
        System.out.println("Radius: " + pizzaSize.getValue() + "cm"); // Radius: 30cm
    }
}
```

---

# Useful Enum Built-in Methods

```java
enum Status { PENDING, SUCCESS, FAILED }

Status s = Status.SUCCESS;

// 1. name() -> Returns exact string name
System.out.println(s.name()); // "SUCCESS"

// 2. ordinal() -> Returns index (starts at 0)
System.out.println(s.ordinal()); // 1

// 3. valueOf() -> Converts String to Enum object
Status s2 = Status.valueOf("FAILED");
System.out.println(s2); // FAILED
// Status.valueOf("UNKNOWN"); ❌ Throws IllegalArgumentException!
```

---

# 🏢 Company Example — E-Commerce Order Status

In real-world applications (like Spring Boot backend), Enums are used to track the status of entities in the database.

```java
public enum OrderStatus {
    CREATED("Order placed by customer", true),
    PAYMENT_FAILED("Payment was declined", false),
    PROCESSING("Warehouse is packing", true),
    SHIPPED("Out for delivery", true),
    DELIVERED("Delivered successfully", false),
    CANCELLED("Order was cancelled", false);

    private final String description;
    private final boolean canBeCancelled; // Can user still cancel it?

    OrderStatus(String description, boolean canBeCancelled) {
        this.description = description;
        this.canBeCancelled = canBeCancelled;
    }

    public String getDescription() { return description; }
    public boolean canBeCancelled() { return canBeCancelled; }
}

class OrderService {
    public void cancelOrder(OrderStatus currentStatus) {
        if (currentStatus.canBeCancelled()) {
            System.out.println("Cancelling order...");
            // Change status to CANCELLED in DB
        } else {
            System.out.println("Error: Order in status " + currentStatus.name() + " cannot be cancelled.");
            System.out.println("Reason: " + currentStatus.getDescription());
        }
    }
}

// Usage
OrderService service = new OrderService();
service.cancelOrder(OrderStatus.PROCESSING); // Succeeds
service.cancelOrder(OrderStatus.SHIPPED);    // Succeeds
service.cancelOrder(OrderStatus.DELIVERED);  // Fails: "Order in status DELIVERED cannot be cancelled"
```

---

# Interview Questions

## Q1. Can an Enum extend a class?
> No. All Enums in Java implicitly extend `java.lang.Enum`. Since Java doesn't support multiple inheritance, an Enum cannot extend another class. However, an Enum CAN `implement` interfaces!

## Q2. Why is Enum constructor always private?
> Because Enums represent a fixed set of constants. If the constructor was public, a developer could write `new Status()` to create a new status dynamically at runtime, which defeats the entire purpose of having a fixed set of constants.

## Q3. What is the difference between `==` and `.equals()` for Enums?
> For Enums, `==` and `.equals()` do the exact same thing. Because Enum constants are singletons (only one instance of `RED` exists in memory), `==` is safe, faster, and avoids `NullPointerException`. It is highly recommended to use `==` for Enums.

---

# Professional Summary

```
Enum (Enumeration):
- Defines a fixed set of constants.
- Type-safe alternative to using Strings or Integer constants.
- Implicitly extends java.lang.Enum.
- Methods: values(), name(), ordinal(), valueOf(String).
- Can contain fields, methods, and a private constructor.
- Highly used in switch statements and database status tracking (JPA @Enumerated).
```

---

# 🧠 Memory Trick
```
Enum = A Dropdown Menu.
You can't type whatever you want. You MUST pick from the predefined list.
```

---

# 🚀 Next Chapter
We will step into Phase 4: **Exception Handling** — learning how to elegantly catch and handle runtime errors so your program doesn't crash!
