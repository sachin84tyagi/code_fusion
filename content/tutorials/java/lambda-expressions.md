Welcome to **Java — Chapter 29: Lambda Expressions (Java 8)**.

> **Lambda Expressions revolutionized Java. They allow you to write short, functional, and highly readable code, drastically reducing boilerplate.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Before Java 8, if you wanted to pass a "behavior" (a function) into a method, you had to wrap it inside a massive, ugly Anonymous Class. 

It was like ordering a pizza and being forced to buy the whole restaurant.

Lambdas fix this. A Lambda is just a **method without a name** that you can pass around as a variable.
`() -> System.out.println("Pizza delivered!");`

---

# Functional Interfaces (The Prerequisite)

You can ONLY use a Lambda Expression with a **Functional Interface**.
A Functional Interface is an interface that has **exactly ONE abstract method**.

```java
@FunctionalInterface // Optional, but good practice
interface MathOperation {
    int operate(int a, int b);
}
```
Because there is only one method, Java can "guess" that your Lambda expression is meant to implement that exact method!

---

# 1. The Syntax

```text
(parameters) -> { body }
```

Let's convert old Java to Lambda Java:

### ❌ Old Way (Anonymous Inner Class)
```java
MathOperation addition = new MathOperation() {
    @Override
    public int operate(int a, int b) {
        return a + b;
    }
};
```

### ✅ New Way (Lambda)
```java
// Full syntax
MathOperation addition = (int a, int b) -> { return a + b; };

// Optimized Syntax! 
// (Java infers types, and if it's one line, you remove {} and 'return')
MathOperation additionOpt = (a, b) -> a + b;
MathOperation subtraction = (a, b) -> a - b;

System.out.println(additionOpt.operate(10, 5)); // 15
System.out.println(subtraction.operate(10, 5)); // 5
```

---

# Types of Lambdas

### No Parameters
```java
interface Greeting { void sayHi(); }

Greeting g = () -> System.out.println("Hello World!");
g.sayHi();
```

### One Parameter (Parentheses optional!)
```java
interface Printer { void print(String msg); }

Printer p = msg -> System.out.println(msg);
p.print("Printing...");
```

### Multiple Lines (Requires `{}` and `return`)
```java
MathOperation max = (a, b) -> {
    if (a > b) return a;
    else return b;
};
```

---

# Using Built-in Functional Interfaces

Java 8 provided a bunch of ready-made functional interfaces in `java.util.function` so you don't have to create your own!

1. **Predicate `<T>`**: Takes an input, returns `boolean`. (Used for filtering).
2. **Consumer `<T>`**: Takes an input, returns `void`. (Used for processing/printing).
3. **Supplier `<T>`**: Takes NO input, returns a value. (Used for generating).
4. **Function `<T, R>`**: Takes an input, returns a result. (Used for mapping/transforming).

```java
import java.util.function.Predicate;
import java.util.function.Consumer;

public class Main {
    public static void main(String[] args) {
        
        // Predicate: Is number even?
        Predicate<Integer> isEven = n -> n % 2 == 0;
        System.out.println(isEven.test(4)); // true

        // Consumer: Print with prefix
        Consumer<String> greeter = name -> System.out.println("Welcome, " + name);
        greeter.accept("Sachin"); // Welcome, Sachin
    }
}
```

---

# Method References (`::`)

Sometimes a lambda just calls an existing method. You can shorten it further using Method References.

```java
List<String> names = Arrays.asList("Sachin", "Rahul", "Priya");

// Standard Lambda
names.forEach(name -> System.out.println(name));

// Method Reference (Class::method)
names.forEach(System.out::println); 
```

---

# 🏢 Company Example — Sorting with Lambdas

Before Java 8, sorting a list of custom objects required creating bulky `Comparator` classes.

```java
class Employee {
    String name;
    int salary;
    // constructor, getters...
}

List<Employee> list = new ArrayList<>();
list.add(new Employee("Sachin", 80000));
list.add(new Employee("Amit", 50000));
list.add(new Employee("Rahul", 120000));

// Old Way:
Collections.sort(list, new Comparator<Employee>() {
    public int compare(Employee e1, Employee e2) {
        return Integer.compare(e1.getSalary(), e2.getSalary());
    }
});

// ✅ Lambda Way:
list.sort((e1, e2) -> Integer.compare(e1.getSalary(), e2.getSalary()));

// ✅ Method Reference Way (Absolute cleanest!):
list.sort(Comparator.comparingInt(Employee::getSalary));
```

---

# Interview Questions

## Q1. What is a Functional Interface?
> An interface that contains exactly one abstract method. It can have multiple `default` or `static` methods, but only one abstract method. The `@FunctionalInterface` annotation is used to enforce this rule at compile-time.

## Q2. Can Lambdas access variables outside their scope?
> Yes, but those variables must be `final` or "effectively final" (meaning their value is never changed after initialization). You cannot reassign an outer local variable inside a lambda.

## Q3. Why were Lambda expressions introduced?
> To enable Functional Programming in Java, reduce boilerplate code (Anonymous classes), and to make the new Streams API (for data manipulation and parallel processing) possible and readable.

---

# Professional Summary

```
Lambda Expression: (parameters) -> { body }

- A concise way to represent an anonymous function.
- Can only be used to implement Functional Interfaces (interfaces with 1 abstract method).
- Java infers data types automatically.
- Replaces bulky Anonymous Inner Classes.
- Core built-in interfaces: Predicate (test), Consumer (accept), Supplier (get), Function (apply).
```

---

# 🧠 Memory Trick
```
Anonymous Class = Writing a 10-page legal contract to borrow a pen.
Lambda = Saying "Here, use this." ->
```

---

# 🚀 Next Chapter
Lambdas unlock the true power of Java 8: The **Streams API**. Get ready to manipulate Collections like a wizard!
