Welcome to **Java — Chapter 16: Packages and Imports**.

> **When a project grows to hundreds of classes, you need organization. Packages act like folders on your computer, keeping your Java classes organized and preventing name conflicts.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you have a file named `report.pdf`.
You want to save another file also named `report.pdf`. 
Your computer says: "File already exists!"

How do you solve this? You put them in different folders!
`Documents/report.pdf`
`Downloads/report.pdf`

In Java, **Folders = Packages**. They group related classes and prevent naming collisions.

---

# 1. Defining a Package

The `package` statement must be the **FIRST line** of code in a Java source file.

```java
// File: src/com/codefusion/utils/MathHelper.java

package com.codefusion.utils; // Declares the package

public class MathHelper {
    public int add(int a, int b) {
        return a + b;
    }
}
```

### Naming Convention
Packages are written in all lowercase to avoid conflict with class names. Companies use their reversed internet domain name to ensure global uniqueness.
Example: `com.google.maps`, `org.apache.commons`.

---

# 2. Importing Classes

If you want to use a class from a different package, you must `import` it.

```java
// File: src/com/codefusion/main/App.java

package com.codefusion.main;

// Import the specific class
import com.codefusion.utils.MathHelper;

// Or import ALL classes from that package using *
// import com.codefusion.utils.*; 

public class App {
    public static void main(String[] args) {
        MathHelper helper = new MathHelper();
        System.out.println(helper.add(5, 10));
    }
}
```

---

# Built-in Packages

Java comes with a massive library of pre-written classes (the Java API), organized into packages.

- `java.lang` — Contains core classes like `String`, `Math`, `System`. **(Automatically imported in every file!)**
- `java.util` — Contains collections (List, Map), Scanner, Date.
- `java.io` — Contains input/output classes for file reading/writing.
- `java.net` — Networking classes.

```java
import java.util.Scanner; // Importing from the built-in API

public class Test {
    Scanner sc = new Scanner(System.in);
}
```

---

# Resolving Name Conflicts

What if you need two classes with the exact same name from different packages? (e.g., `java.util.Date` and `java.sql.Date`)

You cannot import both. You must use the **Fully Qualified Class Name** for at least one of them.

```java
import java.util.Date;

public class Test {
    public static void main(String[] args) {
        // Uses java.util.Date (because it's imported)
        Date today = new Date(); 
        
        // Fully Qualified Class Name for the other one
        java.sql.Date sqlDate = new java.sql.Date(System.currentTimeMillis()); 
    }
}
```

---

# Static Imports (Java 5+)

Static imports allow you to use `static` methods and fields of a class without prefixing them with the class name.

```java
// Normal way
import java.lang.Math;

public class Normal {
    double r = Math.sqrt(25);
    double pi = Math.PI;
}

// With Static Import
import static java.lang.Math.sqrt;
import static java.lang.Math.PI;

public class StaticImp {
    double r = sqrt(25); // No "Math." needed!
    double pi = PI;
}
```
*Tip: Use sparingly, as it can make code harder to read if overused.*

---

# 🏢 Company Example — Spring Boot Project Structure

In real-world Spring Boot applications, packages are used to separate architectural layers.

```text
com.codefusion.ecommerce
 ├── EcommerceApplication.java     (Main File)
 │
 ├── controller/                   (Handles HTTP requests)
 │    └── ProductController.java
 │
 ├── service/                      (Business logic)
 │    └── ProductService.java
 │
 ├── repository/                   (Database operations)
 │    └── ProductRepository.java
 │
 └── entity/                       (Database tables / Models)
      └── Product.java
```
This is called **Package-by-Layer**. It keeps massive enterprise projects clean and navigable.

---

# Interview Questions

## Q1. What is the difference between `import java.util.*;` and `import java.util.Scanner;`?
> `import java.util.*;` imports all classes in the `java.util` package. `import java.util.Scanner;` imports only the specific class. 
> *Note: Using `*` does NOT impact runtime performance or make the final compiled application bigger, but specific imports are preferred for readability and avoiding naming conflicts.*

## Q2. Are sub-packages imported when using `*`?
> No! If you write `import java.util.*;`, it imports classes directly inside `util`. It does NOT import classes inside `java.util.concurrent`. You would need a separate `import java.util.concurrent.*;`.

## Q3. Which package is imported automatically in Java?
> The `java.lang` package is implicitly imported into every Java source file. This is why you don't need to import `String`, `System`, or `Math`.

---

# Professional Summary

```
Packages:
- First line in the file: package com.company.project;
- Act as directories to organize classes and prevent naming collisions.

Imports:
- Follows the package declaration.
- Used to access classes outside the current package.
- Single import: import java.util.List;
- Wildcard import: import java.util.*;
- Fully Qualified Name: Used when two classes have the same name.

Static Import:
- import static java.lang.Math.*;
- Allows calling static members without the class name prefix.
```

---

# 🧠 Memory Trick
```
Package = File Folder
Class = Document in the folder
Import = Giving your document a map to find another document in a different folder.
```

---

# 🚀 Next Chapter
We'll cover **Access Modifiers** (public, private, protected) — the security guards that control who can see your packages and classes!
