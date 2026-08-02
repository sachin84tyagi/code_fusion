Welcome to **Java — Chapter 5: Control Flow**.

> **Control flow decides WHICH code runs and WHEN. Without it, your program is just a straight line — boring and useless. With it, your program can make smart decisions.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Think of a traffic signal.

```
Red Light   → STOP (don't execute this code)
Green Light → GO   (execute this code)
```

Control flow = Traffic signals for your code.

Your program asks a question.
Based on the answer — it takes a different road.

---

# 1. if Statement

```java
int age = 20;

if (age >= 18) {
    System.out.println("You can vote!");
}
// Output: You can vote!

// Only executes if condition is true
int temperature = 15;
if (temperature < 0) {
    System.out.println("Freezing!"); // NOT printed
}
```

---

# 2. if-else Statement

```java
int marks = 45;

if (marks >= 40) {
    System.out.println("PASS");
} else {
    System.out.println("FAIL");
}
// Output: PASS

// Balance check
double balance = 500.0;
double withdrawal = 1000.0;

if (balance >= withdrawal) {
    System.out.println("Transaction successful");
} else {
    System.out.println("Insufficient balance");
}
// Output: Insufficient balance
```

---

# 3. if-else if-else Ladder

```java
int marks = 75;

if (marks >= 90) {
    System.out.println("Grade: A+");
} else if (marks >= 80) {
    System.out.println("Grade: A");
} else if (marks >= 70) {
    System.out.println("Grade: B");
} else if (marks >= 60) {
    System.out.println("Grade: C");
} else if (marks >= 40) {
    System.out.println("Grade: D");
} else {
    System.out.println("Grade: F (Fail)");
}
// Output: Grade: B
```

---

# 4. Nested if

```java
int age = 25;
boolean hasLicense = true;

if (age >= 18) {
    if (hasLicense) {
        System.out.println("You can drive!");
    } else {
        System.out.println("Get a license first.");
    }
} else {
    System.out.println("Too young to drive.");
}
```

---

# 5. switch Statement

Use when checking the SAME variable against multiple values.

```java
int day = 3;

switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday"); // ← This runs
        break;
    case 4:
        System.out.println("Thursday");
        break;
    case 5:
        System.out.println("Friday");
        break;
    default:
        System.out.println("Weekend");
}
// Output: Wednesday
```

### Without `break` — Fall-through

```java
int x = 2;
switch (x) {
    case 1:
        System.out.println("One");
    case 2:
        System.out.println("Two");   // ← Runs
    case 3:
        System.out.println("Three"); // ← Also runs (fall-through!)
    default:
        System.out.println("Other"); // ← Also runs!
}
// Output: Two  Three  Other
// Always use break unless fall-through is intentional!
```

---

# 6. Switch Expression (Java 14+) — Modern Way

```java
// Cleaner syntax — no break needed, no fall-through
String day = "MONDAY";

String type = switch (day) {
    case "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" -> "Weekday";
    case "SATURDAY", "SUNDAY" -> "Weekend";
    default -> "Unknown";
};
System.out.println(type); // Weekday

// With multiple lines using yield
int month = 4;
int days = switch (month) {
    case 1, 3, 5, 7, 8, 10, 12 -> 31;
    case 4, 6, 9, 11 -> 30;
    case 2 -> {
        boolean isLeapYear = true; // simplified
        yield isLeapYear ? 29 : 28;
    }
    default -> throw new IllegalArgumentException("Invalid month: " + month);
};
System.out.println(days); // 30
```

---

# 7. switch with String (Java 7+)

```java
String role = "ADMIN";

switch (role) {
    case "ADMIN":
        System.out.println("Full access");
        break;
    case "USER":
        System.out.println("Limited access");
        break;
    case "GUEST":
        System.out.println("Read-only access");
        break;
    default:
        System.out.println("Access denied");
}
```

---

# if vs switch — When to Use

| Use `if-else` when | Use `switch` when |
|---|---|
| Range checks (age > 18) | Exact value match |
| Complex conditions (&&, ||) | Same variable, many values |
| Boolean expressions | String/int/enum comparison |
| Null checks | Menu selections |

---

# 🏢 Company Example — Swiggy Order Status

```java
public class OrderStatusHandler {

    public String getStatusMessage(String status) {
        return switch (status) {
            case "PLACED"      -> "✅ Your order has been placed!";
            case "CONFIRMED"   -> "👨‍🍳 Restaurant confirmed your order";
            case "PREPARING"   -> "🍳 Your food is being prepared";
            case "PICKED_UP"   -> "🛵 Delivery partner picked up your order";
            case "OUT_FOR_DELIVERY" -> "🚴 Almost there! 5 minutes away";
            case "DELIVERED"   -> "🎉 Enjoy your meal!";
            case "CANCELLED"   -> "❌ Order cancelled. Refund in 3-5 days";
            default            -> "📦 Status unknown: " + status;
        };
    }

    public double calculateDeliveryFee(double orderAmount, boolean isPremium) {
        if (isPremium) {
            return 0.0; // Free delivery for premium users
        } else if (orderAmount >= 500) {
            return 0.0; // Free above ₹500
        } else if (orderAmount >= 200) {
            return 29.0;
        } else {
            return 49.0;
        }
    }
}
```

---

# Interview Questions

## Q1. What is the difference between `if-else` and `switch`?

**Best Answer**
> `if-else` can evaluate complex boolean expressions with ranges, multiple conditions, and any comparison. `switch` is cleaner and faster when checking a single variable against multiple discrete values. `switch` works with int, String, char, and enums. Modern Java 14+ switch expressions eliminate fall-through issues.

---

## Q2. What is fall-through in switch?

> Fall-through occurs when a `case` block does not have a `break` statement. Execution continues into the next `case` block even if it doesn't match. This is usually a bug, but sometimes intentionally used (e.g., multiple cases sharing the same code block).

---

## Q3. What is the difference between switch statement and switch expression (Java 14+)?

> Switch statement is the traditional form requiring `break` and prone to fall-through. Switch expression (Java 14+) uses `->` arrow syntax, is exhaustive (must handle all cases), returns a value, and eliminates fall-through by default. It is more concise and less error-prone.

---

# Professional Summary

```
Control Flow:

if (condition) { }
if (condition) { } else { }
if (c1) { } else if (c2) { } else { }

switch (variable) {
    case value: ... break;
    default: ...
}

// Modern (Java 14+):
String result = switch (var) {
    case "A" -> "Alpha";
    case "B" -> "Beta";
    default  -> "Unknown";
};

Rules:
  Use if-else for: ranges, complex conditions, null checks
  Use switch for: exact value matching, many discrete options
  Always use break in classic switch (or use modern ->)
```

---

# 🧠 Memory Trick

```
Control Flow = GPS Navigation

if-else = "Turn left if road is clear, else turn right"
switch   = "Choose from menu options 1-5"
default  = "If no match → fallback route"
break    = "Exit the switch building (don't walk into next room)"
fall-through = "Forgot to close a door — walked into next room!"
```

---

# 🚀 Next Chapter

We'll learn **Loops** — for, while, do-while, and enhanced for-each that let your program repeat code automatically.
