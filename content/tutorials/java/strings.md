Welcome to **Java — Chapter 8: Strings**.

> **String is the most used data type in Java. Every API response, user input, database query, and log message is a String. Master this chapter completely.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Think of a String as a necklace of characters.

```
"Sachin"
 S - a - c - h - i - n
 0   1   2   3   4   5  (index positions)
```

A String is just a sequence of characters stored together. You can count them, pick individual ones, join them, and compare them.

---

# Creating Strings

```java
// String literal (most common — uses String Pool)
String name = "Sachin Tyagi";

// Using new keyword (creates object on heap — rarely used)
String name2 = new String("Sachin Tyagi");

// Empty string
String empty = "";

// Null string (no string at all)
String nothing = null;

// Multi-line (Java 13+ Text Blocks)
String json = """
        {
            "name": "Sachin",
            "age": 25
        }
        """;
```

---

# String is Immutable

```java
String name = "Sachin";
name.toUpperCase();      // Does NOT change name!
System.out.println(name); // Still "Sachin"

// Must capture the result:
String upper = name.toUpperCase();
System.out.println(upper); // "SACHIN"

// Or reassign:
name = name.toUpperCase();
System.out.println(name); // "SACHIN"
```

**Why immutable?**
- Thread-safe
- Security (passwords, class names)
- String pool optimization

---

# Essential String Methods

## Length & Access

```java
String s = "Hello, Java!";

s.length()              // 12 — number of characters
s.charAt(0)             // 'H' — character at index
s.indexOf('a')          // 7  — first occurrence of 'a'
s.lastIndexOf('a')      // 10 — last occurrence of 'a'
s.indexOf("Java")       // 7  — first occurrence of substring
s.isEmpty()             // false
s.isBlank()             // false (Java 11 — also checks whitespace)
```

## Case Conversion

```java
String s = "Hello World";
s.toUpperCase()         // "HELLO WORLD"
s.toLowerCase()         // "hello world"
```

## Trimming & Stripping

```java
String s = "  Hello  ";
s.trim()                // "Hello" (removes leading/trailing whitespace)
s.strip()               // "Hello" (Java 11 — handles Unicode whitespace too)
s.stripLeading()        // "Hello  "
s.stripTrailing()       // "  Hello"
```

## Checking Content

```java
String email = "sachin@gmail.com";
email.contains("gmail")         // true
email.startsWith("sachin")      // true
email.endsWith(".com")          // true
email.equals("sachin@gmail.com") // true (case-sensitive)
email.equalsIgnoreCase("SACHIN@GMAIL.COM") // true
```

## Extracting Substrings

```java
String s = "Hello, Java!";
s.substring(7)          // "Java!"  (from index 7 to end)
s.substring(7, 11)      // "Java"   (from 7 to 11, exclusive)
```

## Replacing

```java
String s = "Hello World";
s.replace('l', 'r')          // "Herro Worrd" (char replacement)
s.replace("World", "Java")   // "Hello Java"  (string replacement)
s.replaceAll("[aeiou]", "*") // "H*ll* W*rld" (regex replacement)
s.replaceFirst("l", "r")     // "Herlo World" (first occurrence)
```

## Splitting & Joining

```java
// Split
String csv = "Sachin,Rahul,Priya,Amit";
String[] names = csv.split(",");
// ["Sachin", "Rahul", "Priya", "Amit"]

String sentence = "Hello World Java";
String[] words = sentence.split(" ");
// ["Hello", "World", "Java"]

// Split with limit
String s = "a:b:c:d";
String[] parts = s.split(":", 2); // ["a", "b:c:d"]

// Join
String joined = String.join(", ", "Sachin", "Rahul", "Priya");
// "Sachin, Rahul, Priya"

String joined2 = String.join("-", names); // array version
// "Sachin-Rahul-Priya-Amit"
```

## Formatting

```java
// String.format
String msg = String.format("Hello %s, you are %d years old!", "Sachin", 25);
// "Hello Sachin, you are 25 years old!"

// Format specifiers:
// %s → String
// %d → int/long
// %f → float/double
// %n → newline
// %.2f → 2 decimal places
// %05d → pad with zeros to 5 digits

double price = 1234.5678;
System.out.printf("Price: ₹%.2f%n", price); // Price: ₹1234.57

// String.valueOf — convert anything to String
String numStr = String.valueOf(42);       // "42"
String boolStr = String.valueOf(true);    // "true"
String doubleStr = String.valueOf(3.14);  // "3.14"
```

## Converting Strings

```java
// String to number
int age = Integer.parseInt("25");
double salary = Double.parseDouble("75000.50");
long id = Long.parseLong("1234567890");
boolean flag = Boolean.parseBoolean("true");

// Number to String
String s1 = String.valueOf(42);           // "42"
String s2 = Integer.toString(42);         // "42"
String s3 = "" + 42;                      // "42" (concatenation trick)
```

---

# String Comparison — Critical!

```java
String a = "hello";
String b = "hello";
String c = new String("hello");

// == compares REFERENCES (memory addresses)
System.out.println(a == b);     // true  (same String pool object)
System.out.println(a == c);     // false (c is a new object on heap!)

// .equals() compares CONTENT — ALWAYS use this!
System.out.println(a.equals(b));            // true ✅
System.out.println(a.equals(c));            // true ✅
System.out.println(a.equalsIgnoreCase("HELLO")); // true ✅

// Null-safe comparison (avoid NullPointerException)
String name = null;
// name.equals("Sachin")       // ❌ NullPointerException!
"Sachin".equals(name)          // ✅ false (no exception)
Objects.equals(name, "Sachin") // ✅ false (Java 7+ null-safe)
```

---

# String Pool

```java
// String literals go to String Pool (shared area in Heap)
String s1 = "hello";
String s2 = "hello"; // Points to SAME object in pool
System.out.println(s1 == s2); // true (same reference)

// new String() bypasses String Pool
String s3 = new String("hello");
System.out.println(s1 == s3); // false (different objects)

// intern() — manually add to pool
String s4 = s3.intern();
System.out.println(s1 == s4); // true (now same pool object)
```

---

# StringBuilder — Mutable String

When you need to modify strings frequently, use `StringBuilder`.

```java
// BAD — creates many String objects (slow!)
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i; // Creates new String object every iteration!
}

// GOOD — StringBuilder modifies in place (fast!)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String result = sb.toString();

// StringBuilder methods
StringBuilder sb = new StringBuilder("Hello");
sb.append(" World");       // "Hello World"
sb.insert(5, ",");         // "Hello, World"
sb.delete(5, 6);           // "Hello World"
sb.replace(6, 11, "Java"); // "Hello Java"
sb.reverse();              // "avaJ olleH"
sb.length();               // length
sb.charAt(0);              // first char
sb.toString();             // convert to String

// StringBuffer — thread-safe version of StringBuilder
// Use StringBuilder (faster) unless you need thread safety
```

---

# 🏢 Company Example — PhonePe KYC Validation

```java
public class KycValidator {

    public boolean isValidEmail(String email) {
        if (email == null || email.isBlank()) return false;
        return email.contains("@") && email.contains(".") &&
               email.indexOf("@") < email.lastIndexOf(".");
    }

    public boolean isValidPhone(String phone) {
        if (phone == null) return false;
        String cleaned = phone.strip().replace("-", "").replace(" ", "");
        return cleaned.length() == 10 && cleaned.matches("[6-9]\\d{9}");
    }

    public String maskAadhar(String aadhar) {
        if (aadhar == null || aadhar.length() != 12) return "Invalid";
        return "XXXX-XXXX-" + aadhar.substring(8);
        // "1234-5678-9012" → "XXXX-XXXX-9012"
    }

    public String formatCurrency(double amount) {
        return String.format("₹%,.2f", amount);
        // 75000.5 → "₹75,000.50"
    }

    public String buildWelcomeMessage(String name, String accountNumber) {
        return new StringBuilder()
            .append("Welcome, ")
            .append(name)
            .append("! Your account number is: ")
            .append(accountNumber)
            .append(". Happy transacting! 🎉")
            .toString();
    }
}
```

---

# Interview Questions

## Q1. Why is String immutable in Java?

**Best Answer**
> String is immutable for three key reasons: (1) Security — strings used as class names, file paths, and passwords shouldn't be modified. (2) String Pool optimization — immutability allows multiple variables to safely share the same String object in the pool. (3) Thread safety — immutable objects are inherently thread-safe and can be shared across threads.

---

## Q2. What is the String Pool?

> The String Pool (or String Intern Pool) is a special area in the heap where Java stores String literals. When you write `String s = "hello"`, Java checks if "hello" already exists in the pool. If it does, it reuses the existing object; if not, it creates a new one. This saves memory.

---

## Q3. What is the difference between String and StringBuilder?

> String is immutable — every operation creates a new String object. StringBuilder is mutable — it modifies the same object. Use String for fixed, read-only text. Use StringBuilder when building strings in loops or concatenating many strings (much faster — O(n) vs O(n²)).

---

## Q4. What is the difference between `equals()` and `==` for Strings?

> `==` compares references (memory addresses). `equals()` compares content. Two String objects with the same content can have different references (e.g., `new String("hello") == new String("hello")` is false). Always use `equals()` for String content comparison.

---

# Professional Summary

```
String Creation:
  String s = "hello";           // String pool
  String s = new String("hi");  // Heap object

Key Methods:
  length(), charAt(i), indexOf(), contains()
  toUpperCase(), toLowerCase()
  trim(), strip(), isBlank()
  substring(start, end)
  replace(), replaceAll()
  split(delimiter), join(separator, ...)
  equals(), equalsIgnoreCase()
  String.format(), String.valueOf()
  Integer.parseInt(str)

Comparison:
  s.equals(other)                 // content (correct!)
  s.equalsIgnoreCase(other)       // case-insensitive
  Objects.equals(s, other)        // null-safe
  NEVER use == for String content!

StringBuilder:
  new StringBuilder()
  .append(), .insert(), .delete()
  .replace(), .reverse()
  .toString()
```

---

# 🧠 Memory Trick

```
String = Read-only necklace of characters
  Once made, you can't change individual beads
  You make a NEW necklace for every change

StringBuilder = Clay → Mold it however you want
  append()  = add clay at end
  insert()  = add clay in middle
  delete()  = remove clay
  toString() = bake it into final necklace

NEVER use == for String comparison!
  == asks "Are you the same object?"
  .equals() asks "Do you have the same content?" ✅
```

---

# 🚀 Next Chapter

We'll learn **Methods** — reusable blocks of code that make your programs modular, clean, and maintainable.
