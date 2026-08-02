Welcome to **Chapter 2 — Java Basics for Spring Developers**.

> **You don't need to know all of Java. You need to know the right parts of Java that Spring uses every day.**

This chapter covers the exact Java concepts Spring Boot relies on most heavily.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you are learning to cook.

Before cooking a biryani, you need to know:

```
✅ How to boil rice
✅ How to chop vegetables
✅ How to use a knife
✅ How to use the stove
```

These are basic skills.

Without them, you can't cook.

Java basics are the **knife and stove** of Spring development.

---

# 1. Classes and Objects

Everything in Java is a class.

```java
// Define a class
public class User {
    String name;
    int age;
}

// Create an object
User user = new User();
user.name = "Sachin";
user.age = 25;
```

Spring manages these objects as **Beans**.

---

# 2. Constructors

```java
public class User {
    String name;
    int age;

    // Constructor
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

User user = new User("Sachin", 25);
```

Spring uses constructors for **Dependency Injection**.

---

# 3. Interfaces

An interface defines what a class **must do**.

```java
public interface PaymentService {
    void processPayment(double amount);
}

public class RazorpayService implements PaymentService {

    @Override
    public void processPayment(double amount) {
        System.out.println("Processing via Razorpay: " + amount);
    }
}
```

Spring uses interfaces everywhere for loose coupling.

---

# 4. Annotations

Annotations add metadata to classes, methods, and fields.

```java
@Override
public String toString() {
    return "User";
}
```

Spring is **annotation-driven**:

```java
@RestController
@GetMapping
@Autowired
@Service
@Repository
```

---

# 5. Generics

Generics allow type-safe collections.

```java
List<String> names = new ArrayList<>();
names.add("Sachin");
names.add("Rahul");
```

Spring Data uses generics:

```java
public interface UserRepository extends JpaRepository<User, Long> { }
```

`<User, Long>` — entity type and ID type.

---

# 6. Lambda Expressions

A short way to write anonymous functions.

```java
// Old way
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running");
    }
};

// Lambda
Runnable r = () -> System.out.println("Running");
```

Spring Boot uses lambdas in Security, Events, and Streams.

---

# 7. Optional

Handles null safely.

```java
Optional<User> user = userRepository.findById(1L);

if (user.isPresent()) {
    System.out.println(user.get().getName());
}

// Or
user.orElseThrow(() -> new RuntimeException("User not found"));
```

JPA repositories return `Optional`.

---

# 8. Streams API

Process collections elegantly.

```java
List<User> users = userRepository.findAll();

List<String> names = users.stream()
    .filter(u -> u.getAge() > 18)
    .map(User::getName)
    .collect(Collectors.toList());
```

Widely used in Spring services.

---

# 9. Exception Handling

```java
try {
    User user = findUser(id);
} catch (UserNotFoundException e) {
    System.out.println("User not found: " + e.getMessage());
} finally {
    System.out.println("Done");
}
```

Spring's `@ExceptionHandler` builds on this.

---

# 10. Access Modifiers

| Modifier | Same Class | Same Package | Subclass | Everywhere |
| --- | --- | --- | --- | --- |
| `private` | ✅ | ❌ | ❌ | ❌ |
| `default` | ✅ | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ | ✅ |

Most Spring beans use `public` methods.

---

# 11. Static vs Instance

```java
public class MathUtils {

    // Static — no object needed
    public static int add(int a, int b) {
        return a + b;
    }

    // Instance — need an object
    public int multiply(int a, int b) {
        return a * b;
    }
}

MathUtils.add(2, 3);          // Static
new MathUtils().multiply(2, 3); // Instance
```

Spring beans are instances managed by the container.

---

# 12. Inheritance

```java
public class Animal {
    public void speak() {
        System.out.println("...");
    }
}

public class Dog extends Animal {

    @Override
    public void speak() {
        System.out.println("Bark!");
    }
}
```

Spring Security and JPA use inheritance heavily.

---

# 13. Lombok (Essential for Spring)

Reduces boilerplate Java code.

```java
// Without Lombok
public class User {
    private String name;
    private int age;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
}

// With Lombok
@Data
public class User {
    private String name;
    private int age;
}
```

Lombok annotations:

| Annotation | What it generates |
| --- | --- |
| `@Data` | Getters, setters, toString, equals, hashCode |
| `@Getter` | Only getters |
| `@Setter` | Only setters |
| `@AllArgsConstructor` | Constructor with all fields |
| `@NoArgsConstructor` | No-args constructor |
| `@Builder` | Builder pattern |

---

# Company Example — Paytm

Paytm's payment service uses all these Java concepts:

```java
// Interface for loose coupling
public interface PaymentGateway {
    PaymentResponse charge(PaymentRequest request);
}

// Multiple implementations
@Service
public class RazorpayGateway implements PaymentGateway {
    @Override
    public PaymentResponse charge(PaymentRequest request) {
        // Razorpay logic
    }
}

@Service
public class StripeGateway implements PaymentGateway {
    @Override
    public PaymentResponse charge(PaymentRequest request) {
        // Stripe logic
    }
}
```

One interface — multiple payment providers.

Switching providers = just change the implementation.

---

# Interview Questions

## Q1. What is the difference between `==` and `.equals()` in Java?

**Best Answer**

> `==` compares object references (memory address). `.equals()` compares object content. For Strings and custom objects, always use `.equals()`.

---

## Q2. What is an interface in Java?

A contract that defines what methods a class must implement, without providing implementation details. Used for loose coupling and dependency injection.

---

## Q3. What is an Optional in Java?

A container object that may or may not contain a non-null value. It prevents `NullPointerException` and provides methods like `isPresent()`, `get()`, and `orElseThrow()`.

---

## Q4. What is a lambda expression?

A concise way to implement a functional interface (an interface with a single abstract method) without creating an anonymous class.

---

## Q5. Why is Lombok used in Spring Boot projects?

Lombok reduces boilerplate code by generating getters, setters, constructors, and other repetitive methods at compile time via annotations.

---

# Professional Summary

```
Java Concepts Spring Uses Most:

✅ Classes & Objects     → Spring Beans
✅ Interfaces            → Loose coupling
✅ Annotations           → @RestController, @Autowired
✅ Generics              → JpaRepository<User, Long>
✅ Lambdas               → Security, Events
✅ Optional              → Repository returns
✅ Streams               → Data processing
✅ Exception Handling    → @ExceptionHandler
✅ Lombok                → @Data, @Builder
```

---

# 🧠 Memory Trick

Think of Java basics as your **tools**:

```
🔧 Java Toolkit for Spring

Classes     → Building blocks
Interfaces  → Contracts/agreements
Annotations → Labels/instructions
Generics    → Type safety
Lambdas     → Shortcuts
Optional    → Safe null handling
```

Master these tools, and Spring becomes easy.

---

# 🚀 Next Chapter

We'll learn **Maven & Gradle** — the build tools that manage dependencies and build your Spring Boot project.
