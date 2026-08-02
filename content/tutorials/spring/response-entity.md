Welcome to **Chapter 17 — ResponseEntity & HTTP Status Codes**.

> **ResponseEntity gives you full control over the HTTP response. Status code, headers, body — all in your hands.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine ordering a parcel from an online store.

When it arrives, the delivery boy gives you:

```
1. The parcel (response body)
2. A receipt (status code)
3. A note explaining special instructions (headers)
```

`ResponseEntity` is that complete delivery.

Not just the parcel — the whole package with all information.

---

# The Problem Without ResponseEntity

```java
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    return userService.findById(id); // Always returns 200 OK
}
```

What if user is not found? You can't easily return 404.

---

# With ResponseEntity

```java
@GetMapping("/users/{id}")
public ResponseEntity<User> getUser(@PathVariable Long id) {
    User user = userService.findById(id);

    if (user == null) {
        return ResponseEntity.notFound().build(); // 404
    }

    return ResponseEntity.ok(user); // 200
}
```

Full control over the response.

---

# ResponseEntity Structure

```java
ResponseEntity<T>
  T body         → The response data
  HttpStatus     → The status code
  HttpHeaders    → Response headers
```

---

# Common HTTP Status Codes

| Code | Name | When to Use |
| --- | --- | --- |
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Not logged in |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate data (e.g., email taken) |
| 500 | Internal Server Error | Unexpected server error |

---

# Creating ResponseEntity

## Static Methods (Preferred)

```java
// 200 OK with body
ResponseEntity.ok(user)

// 201 Created with body
ResponseEntity.status(HttpStatus.CREATED).body(user)

// 204 No Content
ResponseEntity.noContent().build()

// 404 Not Found
ResponseEntity.notFound().build()

// 400 Bad Request
ResponseEntity.badRequest().body("Invalid email")

// 500 Internal Server Error
ResponseEntity.internalServerError().body("Something went wrong")
```

---

## Builder Pattern

```java
return ResponseEntity
    .status(HttpStatus.CREATED)
    .header("Location", "/api/users/" + user.getId())
    .header("X-User-Created", "true")
    .body(user);
```

---

# Full CRUD with Proper Status Codes

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // GET all users → 200 OK
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // GET by ID → 200 OK or 404
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // POST → 201 Created
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody @Valid CreateUserRequest request) {
        User user = userService.create(request);
        URI location = URI.create("/api/users/" + user.getId());
        return ResponseEntity.created(location).body(user);
    }

    // PUT → 200 OK
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
        @PathVariable Long id,
        @RequestBody @Valid UpdateUserRequest request
    ) {
        User updated = userService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    // DELETE → 204 No Content
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

# Adding Custom Headers

```java
@GetMapping("/users/{id}")
public ResponseEntity<User> getUser(@PathVariable Long id) {
    User user = userService.findById(id);

    HttpHeaders headers = new HttpHeaders();
    headers.add("X-Rate-Limit-Remaining", "99");
    headers.add("X-Request-ID", UUID.randomUUID().toString());

    return ResponseEntity
        .ok()
        .headers(headers)
        .body(user);
}
```

---

# ResponseEntity with Generic Error

```java
// Standard API response wrapper
@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}

// Usage
@GetMapping("/users/{id}")
public ResponseEntity<ApiResponse<User>> getUser(@PathVariable Long id) {
    User user = userService.findById(id);

    ApiResponse<User> response = new ApiResponse<>(true, "User found", user);
    return ResponseEntity.ok(response);
}

// Error response
@PostMapping("/users")
public ResponseEntity<ApiResponse<Void>> createUser(@RequestBody CreateUserRequest req) {
    if (userService.emailExists(req.getEmail())) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(new ApiResponse<>(false, "Email already registered", null));
    }
    // ...
}
```

---

# @ResponseStatus Shortcut

For simple cases, annotate the method directly:

```java
@ResponseStatus(HttpStatus.CREATED)
@PostMapping("/users")
public User createUser(@RequestBody User user) {
    return userService.save(user); // Always returns 201
}

@ResponseStatus(HttpStatus.NO_CONTENT)
@DeleteMapping("/users/{id}")
public void deleteUser(@PathVariable Long id) {
    userService.delete(id); // Always returns 204
}
```

---

# Company Example — Razorpay API

Razorpay follows strict HTTP conventions:

```java
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    // Create payment order → 201 Created
    @PostMapping("/orders")
    public ResponseEntity<PaymentOrder> createOrder(@RequestBody @Valid CreateOrderRequest request) {
        PaymentOrder order = paymentService.createOrder(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .header("Location", "/api/v1/payments/orders/" + order.getId())
            .body(order);
    }

    // Get payment details → 200 OK or 404
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentDetail> getPayment(@PathVariable String paymentId) {
        return paymentService.findById(paymentId)
            .map(ResponseEntity::ok)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId));
    }

    // Refund payment → 200 OK or 422 Unprocessable
    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<RefundResponse> refundPayment(@PathVariable String paymentId) {
        try {
            RefundResponse refund = paymentService.refund(paymentId);
            return ResponseEntity.ok(refund);
        } catch (PaymentAlreadyRefundedException e) {
            return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(null);
        }
    }
}
```

---

# Interview Questions

## Q1. What is ResponseEntity?

**Best Answer**

> `ResponseEntity` is a Spring class that represents the entire HTTP response, including the status code, headers, and body. It gives full control over what is returned to the client, unlike returning just an object which always gives 200 OK.

---

## Q2. What is the difference between returning an object and returning ResponseEntity?

Returning an object directly always results in HTTP 200. `ResponseEntity` allows you to specify any HTTP status code, add custom headers, and control the body — essential for proper REST API design.

---

## Q3. When should you return 201 vs 200?

Return `201 Created` when a new resource is successfully created (POST). Return `200 OK` for successful reads (GET) and updates (PUT/PATCH). Return `204 No Content` for successful deletes.

---

## Q4. What is the Location header and when to use it?

The `Location` header points to the URL of the newly created resource. It should be included in `201 Created` responses: `ResponseEntity.created(URI.create("/api/users/42")).body(user)`.

---

## Q5. What does @ResponseStatus do?

It annotates a controller method or exception class with a default HTTP status code. Simpler than `ResponseEntity` for cases where the status never changes.

---

# Professional Summary

```
ResponseEntity<T>
  = status + headers + body

Common patterns:
  ResponseEntity.ok(data)                          → 200
  ResponseEntity.status(201).body(data)            → 201
  ResponseEntity.created(location).body(data)      → 201 + Location
  ResponseEntity.noContent().build()               → 204
  ResponseEntity.notFound().build()                → 404
  ResponseEntity.badRequest().body(errorMsg)       → 400

RESTful conventions:
  GET    → 200 OK
  POST   → 201 Created
  PUT    → 200 OK
  DELETE → 204 No Content
  Error  → 4xx or 5xx
```

---

# 🧠 Memory Trick

ResponseEntity = **Official Letter**

```
📨 Official Letter (ResponseEntity)

Header     → Metadata, special instructions
Status     → Success/failure stamp (200, 201, 404...)
Body       → The actual content

Without ResponseEntity → just sending content
With ResponseEntity    → sending a complete, official document
```

---

# 🚀 Next Chapter

We'll build a **Complete CRUD REST API** — putting everything together in one full production-ready project.
