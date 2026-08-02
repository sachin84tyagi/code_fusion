Welcome to **Chapter 5 — Generics**.

> **Generics make Java type-safe. JpaRepository<User, Long>, List<Product>, ResponseEntity<UserResponse> — every Spring Boot line uses Generics. Understand it once, read Spring code forever.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a lunchbox.

```
Without Generics:
  Box → Can hold anything (book, food, pencil)
  You reach in → Surprise! May get something wrong.

With Generics:
  FoodBox<Rice>   → Only holds Rice
  FoodBox<Pizza>  → Only holds Pizza

No surprises. No wrong item. Type-safe.
```

---

# Why Generics?

Without Generics (old Java):

```java
List list = new ArrayList();
list.add("Hello");
list.add(42);           // No error! Added integer to String list

String s = (String) list.get(1); // ❌ ClassCastException at runtime!
```

With Generics:

```java
List<String> list = new ArrayList<>();
list.add("Hello");
list.add(42);           // ❌ Compile error! Caught early.

String s = list.get(0); // No cast needed
```

---

# Generic Classes

```java
// T = Type parameter (placeholder)
public class Box<T> {

    private T content;

    public Box(T content) {
        this.content = content;
    }

    public T getContent() {
        return content;
    }

    public void setContent(T content) {
        this.content = content;
    }
}

// Usage
Box<String> stringBox = new Box<>("Hello");
Box<Integer> intBox = new Box<>(42);
Box<User> userBox = new Box<>(new User("Sachin", "sachin@example.com"));

String s = stringBox.getContent();  // No cast needed!
int num = intBox.getContent();      // Type-safe!
```

---

# Generic Methods

```java
public class Utils {

    // Generic method
    public static <T> T getFirst(List<T> list) {
        if (list.isEmpty()) return null;
        return list.get(0);
    }

    // Generic method with multiple types
    public static <K, V> Map<V, K> invertMap(Map<K, V> original) {
        Map<V, K> inverted = new HashMap<>();
        for (Map.Entry<K, V> entry : original.entrySet()) {
            inverted.put(entry.getValue(), entry.getKey());
        }
        return inverted;
    }

    // Generic method that prints any list
    public static <T> void printAll(List<T> list) {
        list.forEach(item -> System.out.println(item));
    }
}

// Usage
String first = Utils.getFirst(List.of("A", "B", "C")); // "A"
Integer num = Utils.getFirst(List.of(10, 20, 30));      // 10
```

---

# Bounded Type Parameters

Restrict what types can be used:

```java
// Upper bound — T must be Number or its subclass
public static <T extends Number> double sum(List<T> list) {
    double total = 0;
    for (T item : list) {
        total += item.doubleValue();
    }
    return total;
}

sum(List.of(1, 2, 3));         // Works — Integer extends Number
sum(List.of(1.5, 2.5, 3.5));  // Works — Double extends Number
sum(List.of("a", "b"));        // ❌ Compile error — String not a Number

// Multiple bounds
public static <T extends Comparable<T> & Serializable> T findMax(List<T> list) {
    return list.stream().max(Comparator.naturalOrder()).orElseThrow();
}
```

---

# Wildcards

```java
// Upper bounded wildcard — "? extends Type"
// Read-only — accepts List<Integer>, List<Double>, List<Number>
public static double sumList(List<? extends Number> list) {
    return list.stream().mapToDouble(Number::doubleValue).sum();
}

sumList(List.of(1, 2, 3));       // Works
sumList(List.of(1.5, 2.5));     // Works
sumList(List.of("a", "b"));     // ❌ Compile error

// Lower bounded wildcard — "? super Type"
// Write-only — accepts List<Integer>, List<Number>, List<Object>
public static void addNumbers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
    list.add(3);
}

// Unbounded wildcard — "?"
// Unknown type — read-only as Object
public static void printList(List<?> list) {
    list.forEach(item -> System.out.println(item));
}
```

---

# PECS Rule — Producer Extends, Consumer Super

```java
// Producer (you READ from it) → ? extends T
public static <T> void copy(List<? extends T> source, List<? super T> dest) {
    for (T item : source) {
        dest.add(item);
    }
}

// Consumer (you WRITE to it) → ? super T
```

---

# Generics in Spring Boot — Where You See Them

```java
// 1. JpaRepository<T, ID>
public interface UserRepository extends JpaRepository<User, Long> {
// T = User (entity type), ID = Long (primary key type)
}

// 2. ResponseEntity<T>
public ResponseEntity<List<UserResponse>> getUsers() {
    return ResponseEntity.ok(userService.getAll());
}

public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
    return ResponseEntity.ok(userService.findById(id));
}

// 3. Optional<T>
Optional<User> user = userRepository.findById(id);

// 4. Page<T>
Page<Product> page = productRepository.findAll(pageable);

// 5. CompletableFuture<T>
CompletableFuture<String> future = asyncService.doWork();

// 6. Generic API Response Wrapper
@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;  // T can be User, List<Product>, anything!
}

// Usage:
return ResponseEntity.ok(new ApiResponse<>(true, "User found", userResponse));
return ResponseEntity.ok(new ApiResponse<>(true, "Products", productList));
```

---

# Generic Repository Pattern

```java
// Generic base repository interface
public interface BaseRepository<T, ID> {
    Optional<T> findById(ID id);
    List<T> findAll();
    T save(T entity);
    void deleteById(ID id);
}

// Specific implementations
public interface UserRepository extends BaseRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

public interface ProductRepository extends BaseRepository<Product, Long> {
    List<Product> findByCategory(String category);
}
```

---

# Generic Service Base

```java
// Generic CRUD service
public abstract class CrudService<T, ID, REQ, RESP> {

    protected abstract T toEntity(REQ request);
    protected abstract RESP toResponse(T entity);
    protected abstract JpaRepository<T, ID> getRepository();

    public RESP findById(ID id) {
        T entity = getRepository().findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Not found: " + id));
        return toResponse(entity);
    }

    public List<RESP> findAll() {
        return getRepository().findAll()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public RESP create(REQ request) {
        T entity = toEntity(request);
        return toResponse(getRepository().save(entity));
    }
}

// Concrete implementation
@Service
public class UserService extends CrudService<User, Long, CreateUserRequest, UserResponse> {

    @Autowired private UserRepository userRepository;

    @Override
    protected JpaRepository<User, Long> getRepository() { return userRepository; }

    @Override
    protected User toEntity(CreateUserRequest req) {
        return new User(req.getName(), req.getEmail());
    }

    @Override
    protected UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }
}
```

---

# Company Example — Paytm API Response

```java
// Generic API response — one class for all responses!
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaytmResponse<T> {

    private String status;
    private String message;
    private T data;
    private String transactionId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp = LocalDateTime.now();

    // Static factory methods
    public static <T> PaytmResponse<T> success(T data) {
        return new PaytmResponse<>("SUCCESS", "Request processed", data, UUID.randomUUID().toString());
    }

    public static <T> PaytmResponse<T> failure(String message) {
        return new PaytmResponse<>("FAILED", message, null, UUID.randomUUID().toString());
    }
}

// Controller usage
@GetMapping("/wallet/balance")
public ResponseEntity<PaytmResponse<WalletBalance>> getBalance(@AuthenticationPrincipal User user) {
    WalletBalance balance = walletService.getBalance(user.getId());
    return ResponseEntity.ok(PaytmResponse.success(balance));
}

@PostMapping("/transfer")
public ResponseEntity<PaytmResponse<TransferResult>> transfer(@RequestBody TransferRequest req) {
    try {
        TransferResult result = transferService.transfer(req);
        return ResponseEntity.ok(PaytmResponse.success(result));
    } catch (InsufficientBalanceException e) {
        return ResponseEntity.status(422).body(PaytmResponse.failure(e.getMessage()));
    }
}
```

---

# Interview Questions

## Q1. What are Generics in Java?

**Best Answer**
> Generics enable types (classes and interfaces) to be parameters when defining classes, interfaces, and methods. They provide compile-time type safety — catching type errors at compile time rather than runtime. They also eliminate the need for casting.

---

## Q2. What is the difference between `List<Object>` and `List<?>`?

`List<Object>` can hold any Object but can't receive `List<String>` or `List<Integer>` (not a subtype). `List<?>` (wildcard) accepts any typed list (`List<String>`, `List<Integer>`) but you can only read from it as Object (cannot add elements).

---

## Q3. What is type erasure?

Generics are a compile-time feature. At runtime, the JVM erases type parameters. `List<String>` and `List<Integer>` both become `List` at runtime. This is why you can't use `instanceof List<String>` or `new T[]`.

---

## Q4. What is `<T extends Comparable<T>>`?

A bounded type parameter. `T` must be a type that implements `Comparable<T>`. This ensures you can call `compareTo()` on elements of type `T`, allowing sorting or comparison operations.

---

## Q5. Why does `JpaRepository<User, Long>` need two type params?

The first (`User`) is the entity type — what the repository manages. The second (`Long`) is the ID type — the type of the primary key field. Spring uses these to generate correct SQL and method signatures.

---

# Professional Summary

```
Generics Syntax:

Class:   class Box<T> { T content; }
Method:  public <T> T getFirst(List<T> list)
Bounded: <T extends Number>
Wild:    List<?>, List<? extends T>, List<? super T>

In Spring:
  JpaRepository<User, Long>
  ResponseEntity<UserResponse>
  Optional<User>
  Page<ProductDto>
  CompletableFuture<Report>
  ApiResponse<T>

Benefits:
  Type-safe at compile time
  No ClassCastException at runtime
  No explicit casting needed
  Reusable generic classes
```

---

# 🧠 Memory Trick

```
Generics = Typed Envelope

Without Generics:
  📦 Box → Put anything → Open → Surprise!
  Might get wrong item → ClassCastException!

With Generics:
  📦 Box<String> → Only Strings go in
  📦 Box<User>   → Only Users go in
  No surprises. Type guaranteed. ✅

T = Template/Type placeholder
  Box<T> where T can be anything you specify
```

---

# 🚀 Next Chapter

We'll cover **Multithreading Basics** — Thread, Runnable, and ExecutorService, which power Spring's `@Async` and scheduling features.
