Welcome to **Java — Chapter 31: Optional (Java 8)**.

> **The inventor of `null` called it his "Billion-Dollar Mistake" because of how many systems it has crashed. Java 8 introduced `Optional` to elegantly prevent `NullPointerException`s (NPEs).**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine ordering a mystery toy box. 
When you open it, there are two possibilities:
1. It contains a toy.
2. It is completely empty.

If you assume there is ALWAYS a toy inside and try to play with it without checking, and it's empty... you cry (`NullPointerException`).

`Optional` is the box. It forces you to say: "Hey Java, check if there's a toy in the box first. If there is, play with it. If it's empty, do something else instead of crashing!"

---

# The Problem with Null

```java
// Pre-Java 8 Way
String name = getUsernameFromDatabase(100); 

// If ID 100 doesn't exist, this returns null!
// Calling .toUpperCase() on null CRASHES the application.
System.out.println(name.toUpperCase()); // ❌ NullPointerException
```
To fix this, developers had to write endless `if (name != null)` checks, which cluttered the code.

---

# The Optional Solution

An `Optional` is a container object which may or may not contain a non-null value.

### 1. Creating Optionals

```java
// 1. Empty Box
Optional<String> emptyBox = Optional.empty();

// 2. Box with definite value (Will crash if you pass null to it)
Optional<String> fullBox = Optional.of("Sachin");

// 3. Box with Maybe value (Best practice! Safely holds value OR null)
String data = null;
Optional<String> mysteryBox = Optional.ofNullable(data); 
```

### 2. Extracting Values Safely

```java
Optional<String> optName = Optional.ofNullable(getUsername());

// ❌ BAD: Defeats the purpose. Will crash if empty.
// String name = optName.get(); 

// ✅ GOOD: Provide a default fallback value if empty
String name = optName.orElse("Guest User");

// ✅ GOOD: Throw an exception if empty
String name2 = optName.orElseThrow(() -> new UserNotFoundException("User missing!"));
```

---

# Functional Approach (The Real Magic)

`Optional` shines when combined with Lambda expressions. You can execute code ONLY if the value is present, without writing `if-else`.

```java
Optional<String> email = Optional.ofNullable("sachin@codefusion.com");

// ifPresent: Do something ONLY if the box has a value
email.ifPresent(e -> System.out.println("Sending email to: " + e));

// map: Safely transform the value inside the box (if it exists)
Optional<Integer> length = email.map(String::length);
System.out.println(length.orElse(0)); // 23
```

---

# 🏢 Company Example — Spring Data JPA

In modern Spring Boot, when you query a database for a specific record, it no longer returns the Object or `null`. It returns an `Optional<Object>`!

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository repo;

    // BAD (Old Java)
    public User getUserOld(Long id) {
        User u = repo.findById(id);
        if (u == null) {
            throw new NotFoundException();
        }
        return u;
    }

    // AMAZING (Modern Java)
    public User getUserModern(Long id) {
        // repo.findById() returns Optional<User>
        return repo.findById(id)
                   .orElseThrow(() -> new NotFoundException("User ID " + id + " not found!"));
    }
    
    // Safely updating
    public void activateUser(Long id) {
        repo.findById(id).ifPresent(user -> {
            user.setActive(true);
            repo.save(user); // Only executes if user exists in DB!
        });
    }
}
```

---

# Interview Questions

## Q1. What is the purpose of `Optional`?
> `Optional` is a container object used to represent the presence or absence of a value. It was introduced to reduce the occurrence of `NullPointerException`s and to design clearer APIs where a return value might legitimately be missing.

## Q2. Should I use `Optional` as a parameter to methods or in class fields?
> No! The designers of Java intended `Optional` primarily to be used as a **return type** for methods. Using it as a class field breaks serialization, and using it as a method parameter clutters the caller code (forcing them to wrap arguments in Optionals).

## Q3. What is the difference between `of()` and `ofNullable()`?
> `Optional.of(value)` expects a non-null value. If you pass `null` to it, it immediately throws a `NullPointerException`. 
> `Optional.ofNullable(value)` is safe. If you pass a value, it creates an Optional with that value. If you pass `null`, it smoothly returns `Optional.empty()`.

---

# Professional Summary

```
Optional<T>: Container that may hold a value or be empty.

Creation: Optional.empty(), Optional.of(val), Optional.ofNullable(val)

Consumption:
- orElse(fallback) -> Returns value or fallback if empty.
- orElseThrow(Exception) -> Returns value or throws Exception if empty.
- ifPresent(Consumer) -> Executes lambda ONLY if value exists.
- map(Function) -> Transforms inner value safely.

Rule: Use mainly as method return types to signal that a result might be absent!
```

---

# 🧠 Memory Trick
```
Optional = Bubble Wrap for your variables.
If the variable drops (is null), it bounces safely instead of shattering your application!
```

---

# 🚀 Next Chapter
We're moving into Phase 7! We'll look at **Generics** — the system that allows Collections to be type-safe.
