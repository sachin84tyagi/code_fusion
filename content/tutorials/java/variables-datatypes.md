Welcome to **Java — Chapter 3: Variables & Data Types**.

> **Every program stores information. Variables are the containers. Data types define what kind of information they hold. This is the foundation of everything in Java.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Think of variables as labeled boxes.

```
📦 Box labeled "age"      → stores: 25
📦 Box labeled "name"     → stores: "Sachin"
📦 Box labeled "price"    → stores: 99.99
📦 Box labeled "isActive" → stores: true
```

Different boxes hold different types of things.

You can't put water in a box meant for books!

**Data Type** = What kind of box it is.
**Variable** = The box's name.

---

# Variables in Java

```java
// Syntax:
// dataType variableName = value;

int age = 25;
String name = "Sachin Tyagi";
double price = 99.99;
boolean isActive = true;
char grade = 'A';
```

---

# Primitive Data Types (8 Types)

## Integer Types

```java
byte   b = 127;               // -128 to 127 (1 byte)
short  s = 32767;             // -32,768 to 32,767 (2 bytes)
int    i = 2147483647;        // ~2.1 billion (4 bytes) ← Most used
long   l = 9223372036854775807L; // Very large numbers (8 bytes)
// Note: Long values end with L

// In Spring Boot — most common:
Long id = 1L;                // Entity primary key
int count = 100;             // Simple counters
```

## Decimal Types

```java
float  f = 3.14f;            // Less precise (4 bytes)
double d = 3.14159265358979; // More precise (8 bytes) ← Use this
// Note: Float values end with f

// Example:
double salary = 75000.50;
double taxRate = 0.30;
double tax = salary * taxRate; // 22500.15
```

## Other Types

```java
boolean flag = true;          // true or false
boolean isLoggedIn = false;

char c = 'A';                 // Single character in single quotes
char digit = '5';
char symbol = '@';
```

---

# Primitive Types — Size & Range

| Type | Size | Min | Max |
|------|------|-----|-----|
| `byte` | 1 byte | -128 | 127 |
| `short` | 2 bytes | -32,768 | 32,767 |
| `int` | 4 bytes | -2,147,483,648 | 2,147,483,647 |
| `long` | 8 bytes | -9.2 × 10¹⁸ | 9.2 × 10¹⁸ |
| `float` | 4 bytes | ~1.4 × 10⁻⁴⁵ | ~3.4 × 10³⁸ |
| `double` | 8 bytes | ~5 × 10⁻³²⁴ | ~1.8 × 10³⁰⁸ |
| `boolean` | 1 bit | false | true |
| `char` | 2 bytes | '\u0000' | '\uffff' |

---

# Reference Data Types

Everything else is a Reference Type — stored differently in memory.

```java
String name = "Sachin";       // String (most common)
int[] numbers = {1, 2, 3};   // Array
ArrayList<String> list = new ArrayList<>(); // Collection

// Reference types store the ADDRESS of the object, not the value directly.
```

---

# Variable Declaration vs Initialization

```java
// Declaration only (no value yet)
int age;

// Initialization (assign value)
age = 25;

// Declaration + Initialization (combined — preferred)
int age = 25;

// Multiple variables of same type
int x = 10, y = 20, z = 30;
```

---

# var — Type Inference (Java 10+)

```java
// Compiler infers the type automatically
var name = "Sachin";          // String
var age = 25;                 // int
var price = 99.99;            // double
var list = new ArrayList<String>(); // ArrayList<String>

// Useful in IntelliJ — you still see the type in IDE
// Cannot be used for class fields (only local variables)
```

---

# final — Constants

```java
// final = value cannot change after assignment
final int MAX_RETRY = 3;
final double PI = 3.14159;
final String APP_NAME = "CodeFusion";

MAX_RETRY = 5; // ❌ Compile Error: Cannot assign to final variable

// Convention: UPPER_SNAKE_CASE for constants
```

---

# Type Casting

## Widening (Automatic — No Data Loss)

```java
// Smaller type → Larger type (automatic)
int i = 100;
long l = i;        // int → long (safe)
double d = i;      // int → double (safe)
float f = i;       // int → float (safe)

// Order: byte → short → int → long → float → double
```

## Narrowing (Manual — Possible Data Loss)

```java
// Larger type → Smaller type (manual cast needed)
double d = 9.99;
int i = (int) d;   // 9 — decimal part LOST!

long l = 1000L;
int i2 = (int) l;  // 1000 — safe here, but dangerous with large values

// Always be careful with narrowing!
```

---

# Common Operations with Variables

```java
int a = 10;
int b = 3;

System.out.println(a + b);    // 13 (addition)
System.out.println(a - b);    // 7  (subtraction)
System.out.println(a * b);    // 30 (multiplication)
System.out.println(a / b);    // 3  (integer division — truncates!)
System.out.println(a % b);    // 1  (remainder / modulo)

// Integer division gotcha!
double result = 10 / 3;       // 3.0 (WRONG! Integer division first)
double result2 = 10.0 / 3;    // 3.3333 (CORRECT! One double → double division)
double result3 = (double) 10 / 3; // 3.3333 (cast forces double division)

// String concatenation with +
String msg = "Age: " + 25;    // "Age: 25"
String msg2 = "Sum: " + (a + b); // "Sum: 13" (brackets matter!)
String msg3 = "Sum: " + a + b;   // "Sum: 103" (WRONG! left-to-right)
```

---

# Memory: Stack vs Heap

```
Stack (Fast, small, ordered)
├── Primitive variables (int, double, boolean, char)
└── Reference variables (the ADDRESS, not the object)

Heap (Larger, slower, managed by GC)
└── Objects (String, Array, ArrayList, etc.)

Example:
  int age = 25;                 → age (25) stored in Stack
  String name = "Sachin";      → name (address) in Stack
                                   "Sachin" object in Heap
```

---

# 🏢 Company Example — Flipkart Product Data

```java
public class Product {
    // Product fields — data types in real code
    private long id = 1001L;              // Auto-incremented ID (long)
    private String name = "iPhone 15";    // Product name (String)
    private double price = 79999.00;      // Price (double — decimal)
    private int stockCount = 250;         // Available stock (int)
    private boolean isAvailable = true;   // Availability (boolean)
    private char category = 'E';          // E=Electronics, C=Clothing (char)

    // Discount calculation
    public double getDiscountedPrice(int discountPercent) {
        double discount = price * discountPercent / 100.0;
        return price - discount;
    }
}

// Usage in service:
Product p = new Product();
System.out.println(p.getDiscountedPrice(10)); // 71999.1
```

---

# Interview Questions

## Q1. What is the difference between primitive and reference data types?

**Best Answer**
> Primitive data types (int, double, boolean, char, etc.) store the actual value directly in memory on the stack. Reference data types (String, Array, Objects) store a reference (address) to the object on the heap. Primitives have fixed sizes and cannot be null, while reference types can be null.

---

## Q2. Why can't we use `==` to compare Strings?

> `==` compares references (memory addresses), not values. Two String objects with the same content can be at different memory addresses. We use `.equals()` to compare content. Example: `"Hello" == "Hello"` might be true due to String pooling, but `new String("Hello") == new String("Hello")` is false.

---

## Q3. What is type casting? What's the difference between widening and narrowing?

> Widening conversion goes from a smaller to larger data type (e.g., int to long) and is automatic with no data loss. Narrowing conversion goes from larger to smaller type (e.g., double to int) and requires an explicit cast `(int)`, with possible data loss (decimal truncation).

---

## Q4. What is the difference between `int` and `Integer`?

> `int` is a primitive data type — fast, cannot be null, stored in stack. `Integer` is a wrapper class — an object, can be null, stored in heap, has useful methods like `Integer.parseInt()`. Java auto-boxes `int` to `Integer` and unboxes automatically.

---

## Q5. What is `var` in Java?

> `var` (introduced in Java 10) enables local variable type inference. The compiler infers the type from the assigned value. It can only be used for local variables (not fields or method parameters), and the variable cannot be uninitialized. It doesn't make Java dynamically typed — it's still statically typed.

---

# Professional Summary

```
Primitive Types (8):
  Integer:  byte (1B) | short (2B) | int (4B) | long (8B)
  Decimal:  float (4B) | double (8B)
  Other:    boolean (1bit) | char (2B)

Most used in Spring Boot:
  Long    → Entity IDs
  int     → Counters, page numbers
  double  → Prices, rates, amounts
  boolean → flags, isActive, isAdmin
  String  → Names, emails, tokens

Type Casting:
  Widening:  small → big (automatic): int i = 5; long l = i;
  Narrowing: big → small (manual):    double d = 9.9; int i = (int) d;

Constants:
  final int MAX = 100; (cannot reassign)

Type Inference (Java 10+):
  var name = "Sachin"; (compiler figures out String)
```

---

# 🧠 Memory Trick

```
Data Types = Containers of different sizes

byte  = Teaspoon  (tiny, just 127)
short = Cup       (small)
int   = Bucket    (everyday use) ← USE THIS
long  = Tank      (huge numbers)
float = Small bottle of water (less precise)
double = Accurate measuring jar ← USE THIS
boolean = Light switch (on/off)
char = Single letter card

WIDEN = Pouring water from small to big (safe!)
NARROW = Pouring from big to small (might spill!)
```

---

# 🚀 Next Chapter

We'll learn **Operators** — Arithmetic, Relational, Logical, and Bitwise operators that let you perform calculations and make decisions with your variables.
