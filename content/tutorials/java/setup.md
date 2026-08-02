Welcome to **Java — Chapter 2: Setup & First Program**.

> **The best way to learn Java is to run it yourself. Let's set up your environment and write your very first Java program in under 10 minutes.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Before you can cook food, you need:
1. A **kitchen** (Computer with JDK)
2. **Utensils** (IDE — IntelliJ IDEA)
3. A **recipe** (Your Java code)

Setup = Preparing your kitchen before cooking!

---

# Step 1: Install JDK (Java Development Kit)

## What to Download?

Always use an **LTS (Long Term Support)** version.

| Version | Status | Recommended For |
|---|---|---|
| Java 8 | Old LTS | Legacy projects |
| Java 11 | Old LTS | Still common |
| Java 17 | LTS ✅ | Most companies |
| Java 21 | Latest LTS ✅ | New projects |

**Download Java 21:** [https://adoptium.net](https://adoptium.net) (Eclipse Temurin — Free, Open Source)

---

## Installation Steps

### Windows

```bash
# 1. Download .msi installer from adoptium.net
# 2. Run the installer (click Next → Next → Finish)
# 3. Verify installation:
java -version
# Output: openjdk version "21.0.1" ...

javac -version
# Output: javac 21.0.1
```

### Mac

```bash
# Using Homebrew
brew install --cask temurin@21

# Verify
java -version
javac -version
```

---

# Step 2: Install IntelliJ IDEA

The best IDE (Integrated Development Environment) for Java.

**Download:** [https://www.jetbrains.com/idea/download/](https://www.jetbrains.com/idea/download/)

Choose **Community Edition** (Free) — it has everything you need.

### Key Features of IntelliJ
- Code completion (suggests code as you type)
- Error highlighting in real time
- Integrated debugger
- Built-in terminal
- Git integration
- Refactoring tools

---

# Step 3: Create Your First Project

### In IntelliJ IDEA:

```
1. Open IntelliJ IDEA
2. Click "New Project"
3. Select "Java"
4. Choose JDK 21
5. Project Name: "java-learning"
6. Click "Create"
```

### Project Structure

```
java-learning/
├── src/
│   └── Main.java     ← Your code goes here
├── .idea/            ← IntelliJ config (ignore this)
└── java-learning.iml ← Project file
```

---

# Step 4: Your First Java Program

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

### Run It

```
In IntelliJ: Click the green ▶ button
In Terminal:
  javac Main.java
  java Main
```

### Output

```
Hello, Java!
```

🎉 You just ran your first Java program!

---

# 👨‍💻 Understanding Every Word

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

| Part | Meaning |
|---|---|
| `public` | Accessible from anywhere |
| `class Main` | Blueprint named "Main" |
| `public static void main` | Entry point of every Java program |
| `String[] args` | Command-line arguments (ignore for now) |
| `System.out.println()` | Print text + newline to console |
| `"Hello, Java!"` | The text to print (String literal) |

---

# System.out.println vs System.out.print

```java
// println → Prints + adds a new line at end
System.out.println("Hello");   // Hello\n
System.out.println("World");   // World\n
// Output:
// Hello
// World

// print → Prints WITHOUT new line
System.out.print("Hello");     // Hello
System.out.print(" World");    // World
// Output:
// Hello World

// printf → Formatted printing
System.out.printf("Name: %s, Age: %d%n", "Sachin", 25);
// Output: Name: Sachin, Age: 25
```

---

# Java Program Structure

```java
// 1. Package declaration (optional)
package com.sachin.learning;

// 2. Import statements (optional)
import java.util.Scanner;

// 3. Class declaration (mandatory)
public class Main {

    // 4. main method (entry point — mandatory)
    public static void main(String[] args) {

        // 5. Statements
        System.out.println("Hello, Java!");

    }
}
```

---

# Naming Rules in Java

## Class Names
```java
public class MyClass {}         // ✅ PascalCase
public class myclass {}         // ❌ Wrong
public class My_Class {}        // ❌ Avoid underscores
public class 1MyClass {}        // ❌ Can't start with number
```

## Method Names
```java
public void sayHello() {}       // ✅ camelCase
public void SayHello() {}       // ❌ Wrong (looks like class)
```

## Variable Names
```java
int userAge = 25;               // ✅ camelCase
int UserAge = 25;               // ❌ Avoid for variables
int user_age = 25;              // ❌ Python style, avoid in Java
```

## Constants
```java
final int MAX_SIZE = 100;       // ✅ UPPER_SNAKE_CASE
```

## File Name Rule
```java
// CRITICAL: File name MUST match class name exactly!
// Class: public class Hello
// File:  Hello.java          ✅
// File:  hello.java          ❌ (case matters!)
```

---

# Comments in Java

```java
// Single line comment

/* Multi-line
   comment */

/**
 * Javadoc comment — for documentation
 * @param args command line arguments
 * @author Sachin Tyagi
 */
public static void main(String[] args) {
    // Your code here
}
```

---

# Common IntelliJ Shortcuts

| Shortcut | Action |
|---|---|
| `Shift + F10` | Run program |
| `Ctrl + Space` | Auto-complete |
| `Alt + Enter` | Quick fix |
| `Ctrl + /` | Comment/Uncomment |
| `Shift + Shift` | Search everywhere |
| `Ctrl + Alt + L` | Format code |
| `Ctrl + Z` | Undo |
| `Ctrl + D` | Duplicate line |
| `Ctrl + Y` | Delete line |
| `psvm + Tab` | Generate main method |
| `sout + Tab` | Generate System.out.println |

---

# 🏢 Company Example — TCS Java Environment

At TCS (Tata Consultancy Services), every new Java developer:

```
Day 1 Setup:
  1. Install JDK 17 (company standard)
  2. Install IntelliJ IDEA Ultimate (company license)
  3. Install Maven (build tool)
  4. Clone project from Git
  5. Import into IntelliJ
  6. Run the application

Company Standards:
  Java Version:  JDK 17 LTS
  IDE:           IntelliJ IDEA
  Build Tool:    Maven
  Code Style:    Google Java Style Guide
  Version Control: Git + GitLab
```

---

# Interview Questions

## Q1. What is the role of the `main` method in Java?

**Best Answer**
> The `main` method is the entry point of every Java application. When the JVM starts executing a program, it looks for `public static void main(String[] args)` and begins execution from there. `public` makes it accessible to JVM, `static` allows calling without creating an object, `void` means it returns nothing, and `String[] args` accepts command-line arguments.

---

## Q2. Why must the Java file name match the class name?

> In Java, the file name must match the public class name (case-sensitive) because the Java compiler uses the file name to locate the class. When you compile `Hello.java`, the compiler produces `Hello.class`. If the names don't match, the compiler throws an error.

---

## Q3. What is the difference between `println` and `print`?

> `System.out.println()` prints the text and adds a newline character at the end, so the next output starts on a new line. `System.out.print()` prints without a newline, so the next output continues on the same line.

---

# Professional Summary

```
Java Setup:
  1. Install JDK (java -version to verify)
  2. Install IntelliJ IDEA Community (free)
  3. Create New Project → Java → JDK 21
  4. Create Main.java
  5. Write main() method
  6. Run with ▶ button

Program Structure:
  package (optional)
  imports (optional)
  public class FileName {
      public static void main(String[] args) {
          // code here
      }
  }

Print methods:
  System.out.println() → print + newline
  System.out.print()   → print only
  System.out.printf()  → formatted print

Naming conventions:
  Classes:   PascalCase
  Methods:   camelCase
  Variables: camelCase
  Constants: UPPER_SNAKE_CASE
  File:      Must match class name!
```

---

# 🧠 Memory Trick

```
Java Setup = Setting up a Kitchen

JDK  = The stove (must have to cook)
IDE  = The kitchen counter (makes cooking easier)
.java = Recipe book (your instructions)
javac = Prepping ingredients (compilation)
java  = Actually cooking (running)
Output = The final dish (result)

Main method memory trick:
  "Public Static Void Main String Args"
  = "Please Start Very Meaningful Software Applications"
```

---

# 🚀 Next Chapter

We'll learn **Variables & Data Types** — the building blocks of every Java program. You'll understand `int`, `String`, `double`, `boolean`, and how Java stores data in memory.
