Welcome to **Java — Chapter 32: Generics (Introduction)**.

> **Generics allow you to write a single class or method that can work with ANY data type, while still maintaining strict compile-time type safety. It's the magic behind `<String>` and `<Integer>`.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a magical lunchbox.
If you buy an "Apple Lunchbox", it physically refuses to let you put a Sandwich inside. If you buy a "Sandwich Lunchbox", you cannot put an Apple in it.

Instead of manufacturing 100 different types of lunchboxes, the factory builds ONE generic `<T>` Lunchbox. 
When you buy it, you put a sticker on it that says `<Apple>`. Now, that specific box only accepts apples!

In Java, `<T>` is the magic sticker.

---

# Why Generics? (The Problem before Java 5)

Before Generics, Collections held raw `Object` types. This led to dangerous runtime crashes (`ClassCastException`).

### ❌ Without Generics
```java
List list = new ArrayList(); // No type specified!
list.add("Sachin");
list.add(100);       // Allowed! (Int inserted by accident)

// Later, trying to retrieve the data...
String name = (String) list.get(0); // Requires casting
String age = (String) list.get(1);  // ❌ CRASH! ClassCastException at RUNTIME! 
```

### ✅ With Generics
```java
List<String> list = new ArrayList<>();
list.add("Sachin");
// list.add(100); ❌ COMPILE ERROR! Java prevents the bug immediately!

String name = list.get(0); // No casting required!
```

---

# Creating a Generic Class

You can create your own Generic classes using `<T>` (Type).

```java
// T stands for Type (It can be String, Integer, User, etc.)
class Box<T> {
    private T item;

    public void setItem(T item) {
        this.item = item;
    }

    public T getItem() {
        return item;
    }
}

public class Main {
    public static void main(String[] args) {
        
        // Creating a String Box
        Box<String> stringBox = new Box<>();
        stringBox.setItem("Hello Generics!");
        System.out.println(stringBox.getItem());

        // Creating an Integer Box
        Box<Integer> intBox = new Box<>();
        intBox.setItem(99);
        System.out.println(intBox.getItem());
    }
}
```

### Common Naming Conventions for Generics:
- `<T>` - Type
- `<E>` - Element (Used extensively by the Java Collections Framework)
- `<K>` - Key (Used in Maps)
- `<V>` - Value (Used in Maps)

---

# Generic Methods

You can make a single method generic, even if the class itself is NOT generic!

```java
public class Printer {

    // <T> before the return type tells Java this is a generic method
    public <T> void printArray(T[] array) {
        for (T element : array) {
            System.out.print(element + " ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        Printer myPrinter = new Printer();
        
        Integer[] intArray = {1, 2, 3};
        String[] stringArray = {"A", "B", "C"};

        myPrinter.printArray(intArray);    // Prints: 1 2 3
        myPrinter.printArray(stringArray); // Prints: A B C
    }
}
```

---

# Bounded Generics (Setting Limits)

Sometimes you want a Generic Type, but you want to restrict it. For example, a math calculator should accept `Integer` or `Double`, but NOT `String`.

Use the `extends` keyword inside the `< >`!

```java
// T MUST be a subclass of Number (Integer, Double, Float...)
class Calculator<T extends Number> {
    
    private T number;

    public Calculator(T number) {
        this.number = number;
    }

    public double square() {
        // We can safely call doubleValue() because we KNOW T is a Number!
        return number.doubleValue() * number.doubleValue(); 
    }
}

public class Main {
    public static void main(String[] args) {
        Calculator<Integer> calc1 = new Calculator<>(5);
        System.out.println(calc1.square()); // 25.0

        // Calculator<String> calc2 = new Calculator<>("Hi"); ❌ COMPILE ERROR! String is not a Number.
    }
}
```

---

# 🏢 Company Example — Generic API Response

In Spring Boot APIs, you want a standard JSON format for every response, regardless of what data you are sending (a single User, a List of Products, etc.). 
Generics solve this elegantly!

```java
// A generic wrapper for all API responses
public class ApiResponse<T> {
    private int statusCode;
    private String message;
    private T data; // The actual payload (could be User, List<Product>, etc.)

    public ApiResponse(int statusCode, String message, T data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
    
    // getters and setters...
}

// Controller usage
@RestController
public class UserController {

    @GetMapping("/users/1")
    public ApiResponse<User> getUser() {
        User u = new User("Sachin");
        return new ApiResponse<>(200, "Success", u); 
        // JSON: { "statusCode": 200, "message": "Success", "data": { "name": "Sachin" } }
    }

    @GetMapping("/products")
    public ApiResponse<List<Product>> getProducts() {
        List<Product> list = Arrays.asList(new Product("Laptop"));
        return new ApiResponse<>(200, "Success", list);
        // JSON: { "statusCode": 200, "message": "Success", "data": [ { "name": "Laptop" } ] }
    }
}
```

---

# Interview Questions

## Q1. What is Type Erasure?
> **Type Erasure** is a process where the Java compiler removes all Generic `<T>` type information during compilation. At runtime, a `List<String>` and a `List<Integer>` are both just `List`. This was done for backward compatibility with older Java versions.

## Q2. Can we use primitives with Generics?
> No. Generics only work with Objects (Reference Types). You cannot write `List<int>`. You must use the wrapper class `List<Integer>`.

## Q3. Why do we need Generics if we could just use `Object`?
> Because using `Object` requires manual casting when retrieving data, which is prone to `ClassCastException` at runtime. Generics push these errors to compile-time, making the code much safer and eliminating the need for casting.

---

# Professional Summary

```
Generics (<T>):
- Provides Compile-Time Type Safety.
- Eliminates the need for manual type casting.
- Allows writing highly reusable code (one class/method for many types).
- Bounded Generics (<T extends Class>) restrict the types allowed.
- Cannot use primitives (int, double); must use wrappers (Integer, Double).
```

---

# 🧠 Memory Trick
```
Generics = A Mold.
You build the mold once (<T>). 
Later, you pour plastic into it (<String>) or metal into it (<Integer>).
Same mold, completely different, but safe, results!
```

---

# 🚀 Next Chapter
We'll explore **Wildcards (`?`)** in Generics. What if you don't care what type it is, as long as it's a type of Animal? Wildcards solve this!
