Welcome to **Java — Chapter 9: Methods**.

> **Methods are reusable blocks of code with a name. Instead of writing the same logic 10 times, write it once as a method and call it 10 times. Methods are the building blocks of any Java program.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a vending machine.

```
Press B3 → Get Chips
Press C1 → Get Water
Press A2 → Get Chocolate
```

You press a button (call a method), it does the work, and gives you a result.

You don't need to know HOW it makes chips — you just press the button!

Methods = Named buttons that do specific work.

---

# Method Structure

```java
// Syntax:
// accessModifier returnType methodName(parameters) { body }

public int add(int a, int b) {
    return a + b;
}

// Breaking it down:
// public → access modifier (visible everywhere)
// int    → return type (gives back an int)
// add    → method name
// (int a, int b) → parameters (inputs)
// return a + b   → return statement (output)
```

---

# Types of Methods

```java
// 1. No parameters, no return (void)
public void greet() {
    System.out.println("Hello!");
}

// 2. With parameters, no return
public void greet(String name) {
    System.out.println("Hello, " + name + "!");
}

// 3. No parameters, with return
public String getGreeting() {
    return "Hello, World!";
}

// 4. With parameters, with return (most common)
public double calculateTax(double income, double rate) {
    return income * rate / 100;
}

// Calling methods
greet();                    // Hello!
greet("Sachin");            // Hello, Sachin!
String msg = getGreeting(); // Hello, World!
double tax = calculateTax(100000, 30); // 30000.0
```

---

# void Return Type

```java
// void = method does work but returns nothing
public void printReceipt(String item, double price) {
    System.out.println("=== Receipt ===");
    System.out.println("Item: " + item);
    System.out.println("Price: ₹" + price);
    System.out.println("===============");
    // No return statement needed
}

// Can use return; to exit early
public void validateAge(int age) {
    if (age < 0) {
        System.out.println("Invalid age!");
        return;  // Exit method early
    }
    System.out.println("Age is valid: " + age);
}
```

---

# return Statement

```java
// Method stops execution at return
public int max(int a, int b) {
    if (a > b) {
        return a;  // Returns here if a > b
    }
    return b;      // Returns here otherwise
}

// Multiple return points
public String getGrade(int marks) {
    if (marks >= 90) return "A";
    if (marks >= 80) return "B";
    if (marks >= 70) return "C";
    if (marks >= 60) return "D";
    return "F";
}
```

---

# Method Parameters

```java
// Primitive parameters — passed by VALUE (copy)
public void increment(int x) {
    x++;  // Changes local copy only
}

int a = 5;
increment(a);
System.out.println(a); // Still 5! (original unchanged)

// Reference parameters — passed by REFERENCE (address)
public void addItem(List<String> list, String item) {
    list.add(item);  // Modifies the original list!
}

List<String> names = new ArrayList<>();
addItem(names, "Sachin");
System.out.println(names); // [Sachin] (original changed!)
```

---

# Varargs — Variable Arguments

```java
// Accepts any number of arguments
public int sum(int... numbers) {
    int total = 0;
    for (int n : numbers) {
        total += n;
    }
    return total;
}

// Calling:
sum(1, 2);              // 3
sum(1, 2, 3, 4, 5);    // 15
sum();                  // 0

// Varargs must be last parameter
public void log(String level, String... messages) {
    for (String msg : messages) {
        System.out.println("[" + level + "] " + msg);
    }
}
log("INFO", "Server started", "Port: 8080");
```

---

# Method Overloading

Same method name, different parameters.

```java
public class Calculator {

    // Different number of parameters
    public int add(int a, int b) {
        return a + b;
    }

    public int add(int a, int b, int c) {
        return a + b + c;
    }

    // Different parameter types
    public double add(double a, double b) {
        return a + b;
    }

    public String add(String a, String b) {
        return a + b;  // Concatenation
    }
}

Calculator c = new Calculator();
c.add(1, 2);        // 3    (int, int)
c.add(1, 2, 3);     // 6    (int, int, int)
c.add(1.5, 2.5);    // 4.0  (double, double)
c.add("Hi", " Bye"); // "Hi Bye" (String, String)
```

---

# Static vs Instance Methods

```java
public class MathHelper {

    // Static method — belongs to CLASS, no object needed
    public static double circleArea(double radius) {
        return Math.PI * radius * radius;
    }

    // Instance method — belongs to OBJECT
    private double value;

    public MathHelper(double value) {
        this.value = value;
    }

    public double square() {
        return value * value;
    }
}

// Static method — call without object
double area = MathHelper.circleArea(5.0); // 78.54

// Instance method — need object
MathHelper m = new MathHelper(4.0);
double sq = m.square(); // 16.0
```

---

# Recursive Methods

A method that calls itself.

```java
// Factorial: n! = n × (n-1) × ... × 1
public int factorial(int n) {
    if (n <= 1) return 1;  // Base case (stop condition)
    return n * factorial(n - 1); // Recursive call
}

factorial(5)
= 5 * factorial(4)
= 5 * 4 * factorial(3)
= 5 * 4 * 3 * factorial(2)
= 5 * 4 * 3 * 2 * factorial(1)
= 5 * 4 * 3 * 2 * 1
= 120

// Fibonacci
public int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

---

# 🏢 Company Example — Ola Fare Calculator

```java
public class FareCalculator {

    private static final double BASE_FARE = 50.0;
    private static final double PER_KM_RATE = 12.0;
    private static final double NIGHT_SURCHARGE = 1.25;
    private static final double PEAK_MULTIPLIER = 1.5;

    // Main fare calculation
    public double calculateFare(double distanceKm, int hour, boolean isPeakHour) {
        double fare = BASE_FARE + (distanceKm * PER_KM_RATE);
        fare = applyNightSurcharge(fare, hour);
        fare = applyPeakMultiplier(fare, isPeakHour);
        return roundFare(fare);
    }

    // Helper methods (private — internal use only)
    private double applyNightSurcharge(double fare, int hour) {
        boolean isNight = hour >= 22 || hour < 6;
        return isNight ? fare * NIGHT_SURCHARGE : fare;
    }

    private double applyPeakMultiplier(double fare, boolean isPeak) {
        return isPeak ? fare * PEAK_MULTIPLIER : fare;
    }

    private double roundFare(double fare) {
        return Math.round(fare * 100.0) / 100.0;
    }

    // Overloaded method — different input scenarios
    public double calculateFare(double distanceKm) {
        return calculateFare(distanceKm, 12, false); // Day, non-peak defaults
    }

    // Static utility
    public static String formatFare(double fare) {
        return String.format("₹%.2f", fare);
    }
}

// Usage:
FareCalculator calc = new FareCalculator();
double fare = calc.calculateFare(10.5, 23, false); // Night ride
System.out.println(FareCalculator.formatFare(fare));
```

---

# Interview Questions

## Q1. What is method overloading?

**Best Answer**
> Method overloading is defining multiple methods with the same name but different parameter lists (different number, types, or order of parameters). It's a form of compile-time (static) polymorphism. The return type alone cannot distinguish overloaded methods.

---

## Q2. What is the difference between method overloading and method overriding?

> Overloading happens within the same class — same name, different parameters, resolved at compile time. Overriding happens in a subclass — same name AND same parameters, resolved at runtime (dynamic dispatch). Overriding requires inheritance; overloading doesn't.

---

## Q3. Are Java method arguments passed by value or by reference?

> Java is strictly pass-by-value. For primitives, the actual value is copied. For objects, the reference (memory address) is copied — so the method receives a copy of the reference, not the object itself. This means you can modify the object the reference points to, but you cannot reassign the reference itself in the caller's scope.

---

# Professional Summary

```
Method Anatomy:
  accessModifier returnType name(params) { return value; }

Return Types:
  void      → returns nothing
  int/double → returns primitive
  String     → returns object
  List<T>    → returns collection

Parameter Passing:
  Primitive → by value (copy — original unchanged)
  Object    → by reference (address — original can change)

Overloading:
  Same name + different params → compile-time polymorphism

Static vs Instance:
  static   → call on CLASS: Math.sqrt()
  instance → call on OBJECT: obj.method()

Varargs: methodName(Type... args) — any number of args

Recursion: method calls itself + must have base case
```

---

# 🧠 Memory Trick

```
Method = Vending Machine Button

Name      = Button label (add, calculateTax)
Params    = Coins you put in (inputs)
Return    = Item you get out (output)
void      = Machine does work but gives nothing back
static    = Button on the building wall (no key needed)
instance  = Button inside (need to unlock door first)

Overloading = Same button label, different compartments
  add(int, int)    → Button 1
  add(double, double) → Button 2
  add(String, String) → Button 3
```

---

# 🚀 Next Chapter

We'll learn **Classes & Objects** — the foundation of Object-Oriented Programming in Java. You'll create your own custom types!
