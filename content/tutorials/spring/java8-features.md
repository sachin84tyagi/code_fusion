Welcome to **Chapter 4 — Java 8 Features**.

> **Java 8 completely changed how Java is written. Lambda, Streams, and Optional are in every Spring Boot project. Without these, modern Spring code is unreadable.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Old way to give instructions:

```
"Go to the kitchen.
 Open the fridge.
 Take the milk.
 Close the fridge.
 Come back."
```

Java 8 way (Lambda):

```
"Bring milk" → done
```

Java 8 made code **shorter, cleaner, and expressive**.

---

# 1. Lambda Expressions

A lambda is an **anonymous function** — a function without a name.

```java
// Old way — Anonymous class
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running...");
    }
};

// Lambda way
Runnable r = () -> System.out.println("Running...");

// With parameters
// Old way
Comparator<String> comp = new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.compareTo(b);
    }
};

// Lambda
Comparator<String> comp = (a, b) -> a.compareTo(b);

// Lambda with block body
Comparator<String> comp = (a, b) -> {
    System.out.println("Comparing...");
    return a.compareTo(b);
};
```

---

# Lambda Syntax

```java
// No params
() -> expression

// One param (no parentheses needed)
x -> x * 2

// Multiple params
(x, y) -> x + y

// With types (optional, Java infers)
(int x, int y) -> x + y

// Block body (multiple statements)
(x, y) -> {
    int sum = x + y;
    return sum;
}
```

---

# Lambda with Collections

```java
List<String> names = List.of("Sachin", "Rahul", "Priya", "Amit");

// Sort with lambda
names.sort((a, b) -> a.compareTo(b));

// forEach with lambda
names.forEach(name -> System.out.println(name));

// removeIf with lambda
List<String> mutable = new ArrayList<>(names);
mutable.removeIf(name -> name.startsWith("A"));

// replaceAll with lambda
mutable.replaceAll(name -> name.toUpperCase());
```

---

# 2. Functional Interfaces

An interface with **exactly one abstract method**.

Lambdas implement functional interfaces.

```java
// Built-in Functional Interfaces

// Predicate<T> — takes T, returns boolean
Predicate<String> isLong = s -> s.length() > 5;
System.out.println(isLong.test("Sachin")); // true
System.out.println(isLong.test("Hi"));     // false

// Function<T, R> — takes T, returns R
Function<String, Integer> getLength = s -> s.length();
System.out.println(getLength.apply("Sachin")); // 6

// Consumer<T> — takes T, returns nothing (void)
Consumer<String> printer = s -> System.out.println(s);
printer.accept("Hello!"); // Hello!

// Supplier<T> — takes nothing, returns T
Supplier<String> greeting = () -> "Hello, World!";
System.out.println(greeting.get()); // Hello, World!

// BiFunction<T, U, R> — takes T and U, returns R
BiFunction<String, Integer, String> repeat = (s, n) -> s.repeat(n);
System.out.println(repeat.apply("Ha", 3)); // HaHaHa
```

---

# Custom Functional Interface

```java
@FunctionalInterface  // Optional but good practice
public interface Validator<T> {
    boolean validate(T value);

    // Can have default methods
    default Validator<T> and(Validator<T> other) {
        return value -> this.validate(value) && other.validate(value);
    }
}

// Usage
Validator<String> notEmpty = s -> !s.isEmpty();
Validator<String> notTooLong = s -> s.length() <= 100;
Validator<String> emailValidator = notEmpty.and(notTooLong);

System.out.println(emailValidator.validate("sachin@example.com")); // true
```

---

# 3. Method References

Shorthand for lambdas that just call an existing method.

```java
// Lambda → Method Reference
names.forEach(name -> System.out.println(name));
names.forEach(System.out::println);  // Same!

// Static method reference
Function<String, Integer> parse = Integer::parseInt;
// = s -> Integer.parseInt(s)

// Instance method reference (on specific object)
String prefix = "Hello ";
Function<String, String> greet = prefix::concat;
// = s -> prefix.concat(s)

// Instance method reference (on any object of type)
Function<String, String> upper = String::toUpperCase;
// = s -> s.toUpperCase()

// Constructor reference
Supplier<ArrayList<String>> listMaker = ArrayList::new;
// = () -> new ArrayList<>()
```

---

# 4. Stream API — The Powerhouse

Stream is a pipeline of operations on a data source (collection, array, etc.).

```
Source → Filter → Map → Collect
```

```java
List<User> users = List.of(
    new User("Sachin", "sachin@gmail.com", 25, true),
    new User("Rahul", "rahul@yahoo.com", 30, false),
    new User("Priya", "priya@gmail.com", 22, true),
    new User("Amit", "amit@gmail.com", 28, true)
);
```

---

## Filter

```java
// Get active users only
List<User> activeUsers = users.stream()
    .filter(u -> u.isActive())
    .collect(Collectors.toList());

// Filter by age
List<User> youngUsers = users.stream()
    .filter(u -> u.getAge() < 28)
    .collect(Collectors.toList());

// Multiple filters
List<User> result = users.stream()
    .filter(u -> u.isActive())
    .filter(u -> u.getEmail().endsWith("@gmail.com"))
    .collect(Collectors.toList());
```

---

## Map — Transform Each Element

```java
// Get list of names
List<String> names = users.stream()
    .map(u -> u.getName())
    .collect(Collectors.toList());
// ["Sachin", "Rahul", "Priya", "Amit"]

// Convert User → UserResponse DTO
List<UserResponse> responses = users.stream()
    .map(u -> new UserResponse(u.getId(), u.getName(), u.getEmail()))
    .collect(Collectors.toList());

// Map to uppercase
List<String> upperNames = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

---

## Sorted

```java
// Sort by name
List<User> sorted = users.stream()
    .sorted((a, b) -> a.getName().compareTo(b.getName()))
    .collect(Collectors.toList());

// Using Comparator
List<User> sortedByAge = users.stream()
    .sorted(Comparator.comparing(User::getAge))
    .collect(Collectors.toList());

// Reversed
List<User> sortedDesc = users.stream()
    .sorted(Comparator.comparing(User::getAge).reversed())
    .collect(Collectors.toList());

// Multiple sort
List<User> multi = users.stream()
    .sorted(Comparator.comparing(User::getAge)
        .thenComparing(User::getName))
    .collect(Collectors.toList());
```

---

## Collect — Terminal Operations

```java
// To List
List<String> nameList = users.stream()
    .map(User::getName)
    .collect(Collectors.toList());

// To Set (no duplicates)
Set<String> nameSet = users.stream()
    .map(User::getEmail)
    .collect(Collectors.toSet());

// To String
String joined = users.stream()
    .map(User::getName)
    .collect(Collectors.joining(", "));
// "Sachin, Rahul, Priya, Amit"

// Count
long count = users.stream()
    .filter(User::isActive)
    .count();

// Group by
Map<Boolean, List<User>> grouped = users.stream()
    .collect(Collectors.groupingBy(User::isActive));
// {true=[Sachin, Priya, Amit], false=[Rahul]}

// Group by with count
Map<String, Long> cityCount = orders.stream()
    .collect(Collectors.groupingBy(Order::getCity, Collectors.counting()));
```

---

## Find & Match

```java
// anyMatch — any element matches?
boolean hasGmail = users.stream()
    .anyMatch(u -> u.getEmail().endsWith("@gmail.com")); // true

// allMatch — all elements match?
boolean allActive = users.stream()
    .allMatch(User::isActive); // false

// noneMatch — no elements match?
boolean noneUnder18 = users.stream()
    .noneMatch(u -> u.getAge() < 18); // true

// findFirst — first matching element
Optional<User> first = users.stream()
    .filter(User::isActive)
    .findFirst();

// findAny — any matching (faster in parallel)
Optional<User> any = users.stream()
    .filter(u -> u.getAge() > 25)
    .findAny();
```

---

## Reduce — Aggregate

```java
// Sum of ages
int totalAge = users.stream()
    .mapToInt(User::getAge)
    .sum();

// Average age
OptionalDouble avgAge = users.stream()
    .mapToInt(User::getAge)
    .average();

// Max age
OptionalInt maxAge = users.stream()
    .mapToInt(User::getAge)
    .max();

// Custom reduce
int product = Stream.of(1, 2, 3, 4, 5)
    .reduce(1, (a, b) -> a * b); // 120
```

---

# 5. Optional — Null Safety

```java
// Creating Optional
Optional<String> opt1 = Optional.of("Hello");        // Value present
Optional<String> opt2 = Optional.ofNullable(null);    // May be null
Optional<String> opt3 = Optional.empty();             // Definitely empty

// Check and get
if (opt1.isPresent()) {
    System.out.println(opt1.get()); // Hello
}

// orElse — default value
String val = opt2.orElse("Default");  // "Default"

// orElseGet — compute default lazily
String val2 = opt2.orElseGet(() -> computeDefault());

// orElseThrow — throw if empty
String val3 = opt2.orElseThrow(() -> new RuntimeException("Value missing"));

// map — transform if present
Optional<Integer> length = opt1.map(String::length); // Optional[5]

// filter — filter if present
Optional<String> filtered = opt1.filter(s -> s.length() > 3); // Optional[Hello]

// ifPresent — action if present
opt1.ifPresent(s -> System.out.println("Found: " + s));

// In Spring Repository — MOST COMMON USAGE:
Optional<User> userOpt = userRepository.findById(1L);

// Pattern 1: throw exception if not found
User user = userOpt.orElseThrow(
    () -> new ResourceNotFoundException("User not found")
);

// Pattern 2: map to response
Optional<UserResponse> response = userOpt.map(u -> new UserResponse(u));

// Pattern 3: default user
User guest = userOpt.orElse(new User("Guest", "guest@example.com"));
```

---

# Java 8 in Spring Boot — Real Examples

```java
@Service
public class ProductService {

    // map + filter + collect → DTO conversion with filtering
    public List<ProductResponse> getActiveProducts() {
        return productRepository.findAll()
            .stream()
            .filter(Product::isActive)
            .map(this::toResponse)
            .sorted(Comparator.comparing(ProductResponse::getName))
            .collect(Collectors.toList());
    }

    // Optional → orElseThrow pattern
    public ProductResponse getById(Long id) {
        return productRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    // groupingBy for analytics
    public Map<String, Long> getProductCountByCategory() {
        return productRepository.findAll()
            .stream()
            .collect(Collectors.groupingBy(Product::getCategory, Collectors.counting()));
    }

    // anyMatch for validation
    public boolean categoryExists(String category) {
        return productRepository.findAll()
            .stream()
            .anyMatch(p -> p.getCategory().equalsIgnoreCase(category));
    }
}
```

---

# Company Example — Flipkart Search

```java
@Service
public class SearchService {

    public SearchResult search(SearchRequest request) {
        return productRepository.findAll()
            .stream()
            // Filter by keyword
            .filter(p -> p.getName().toLowerCase()
                .contains(request.getKeyword().toLowerCase()))
            // Filter by category if specified
            .filter(p -> request.getCategory() == null ||
                p.getCategory().equals(request.getCategory()))
            // Filter by price range
            .filter(p -> p.getPrice().compareTo(request.getMinPrice()) >= 0 &&
                p.getPrice().compareTo(request.getMaxPrice()) <= 0)
            // Sort
            .sorted(Comparator.comparing(Product::getRating).reversed())
            // Convert to DTO
            .map(this::toSearchResult)
            // Collect
            .collect(Collectors.collectingAndThen(
                Collectors.toList(),
                list -> new SearchResult(list, list.size())
            ));
    }
}
```

---

# Interview Questions

## Q1. What is a Lambda Expression?

**Best Answer**
> A lambda expression is an anonymous function that can be passed around as a value. It implements a functional interface. Syntax: `(params) -> body`. Lambda expressions enable functional-style programming in Java.

---

## Q2. What is a Functional Interface?

An interface with exactly one abstract method. Can have multiple default or static methods. `@FunctionalInterface` annotation is optional but documents the intent. Built-in ones: `Predicate`, `Function`, `Consumer`, `Supplier`.

---

## Q3. What is the difference between `map()` and `flatMap()` in Streams?

`map()` transforms each element (1-to-1). `flatMap()` transforms each element into a stream and flattens the result (1-to-many). Example: `flatMap(list -> list.stream())` converts a `List<List<T>>` into `Stream<T>`.

---

## Q4. What is `Optional` and why use it?

`Optional<T>` is a container that may or may not hold a value — a better alternative to returning `null`. It forces the caller to handle the "no value" case, preventing `NullPointerException`.

---

## Q5. What is the difference between `filter()` and `findFirst()`?

`filter()` is an intermediate operation — it returns a new stream with elements matching the predicate. `findFirst()` is a terminal operation — it returns the first element as an `Optional`. They're often chained: `.filter(...).findFirst()`.

---

# Professional Summary

```
Java 8 Key Features:

Lambda:
  () -> expression
  (a, b) -> a + b
  name -> name.toUpperCase()

Functional Interfaces:
  Predicate<T>     → boolean test(T t)
  Function<T,R>    → R apply(T t)
  Consumer<T>      → void accept(T t)
  Supplier<T>      → T get()

Stream Pipeline:
  source.stream()
    .filter(predicate)
    .map(function)
    .sorted(comparator)
    .collect(Collectors.toList())

Optional:
  .orElse(default)
  .orElseThrow(exception)
  .map(function)
  .ifPresent(consumer)
```

---

# 🧠 Memory Trick

```
Stream = Water filter pipeline

Source (bucket of water = List)
  ↓
filter() = Removes impurities (filter elements)
  ↓
map()    = Changes form (water → ice → steam)
  ↓
sorted() = Arrange by size
  ↓
collect  = Collect in bottle (Collectors.toList())

Optional = Schrodinger's box
  May have something OR nothing
  Must check before opening!
```

---

# 🚀 Next Chapter

We'll learn **Generics** — Java's type system that makes Collections, JpaRepository, and ResponseEntity type-safe and reusable.
