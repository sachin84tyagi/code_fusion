Welcome to **Chapter 16 — @RequestBody & @ResponseBody**.

> **@RequestBody reads JSON from the incoming request. @ResponseBody writes Java objects as JSON in the response. This is the language of REST APIs.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you are sending a parcel.

**Sending a parcel (@RequestBody):**

```
You pack items in a box
Send it to the post office
Post office delivers the box
Spring unpacks the box into a Java object
```

**Receiving a parcel (@ResponseBody):**

```
Spring packs Java object into a box
Sends it as HTTP response
Client receives the box (JSON)
```

The box is **JSON**.
The items are your **Java objects**.

---

# @RequestBody

Reads the HTTP request body and converts it to a Java object.

```java
@PostMapping("/users")
public User createUser(@RequestBody User user) {
    // user is populated from JSON request body
    return userService.save(user);
}
```

Request body (JSON sent by client):

```json
{
    "name": "Sachin Tyagi",
    "email": "sachin@example.com",
    "age": 25
}
```

Spring automatically converts this JSON → `User` object.

---

# @ResponseBody

Converts Java object → JSON and writes to response body.

```java
@Controller
public class UserController {

    @GetMapping("/users")
    @ResponseBody  // Needed when using @Controller
    public List<User> getUsers() {
        return userService.getAll();
    }
}
```

With `@RestController`, `@ResponseBody` is applied automatically to all methods — no need to add it manually.

---

# How Jackson Works

Spring uses **Jackson ObjectMapper** internally.

```
Java Object → Jackson → JSON (Serialization)

JSON → Jackson → Java Object (Deserialization)
```

```java
User user = new User("Sachin", "sachin@example.com");

// Serialization (to JSON):
{
    "name": "Sachin",
    "email": "sachin@example.com"
}

// Deserialization (from JSON):
User{name="Sachin", email="sachin@example.com"}
```

---

# DTO Pattern (Best Practice)

Don't expose your entity directly. Use a DTO (Data Transfer Object).

```java
// Entity (internal, database)
@Entity
public class User {
    private Long id;
    private String name;
    private String email;
    private String password;    // Sensitive!
    private String createdBy;
}

// Request DTO (what client sends)
@Data
public class CreateUserRequest {
    private String name;
    private String email;
    private String password;
}

// Response DTO (what client receives)
@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    // No password exposed!
}

// Controller
@PostMapping("/users")
public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {
    User user = userService.create(request);
    UserResponse response = mapper.map(user, UserResponse.class);
    return ResponseEntity.status(201).body(response);
}
```

---

# Content Type Header

`@RequestBody` reads the body only if the request has:

```
Content-Type: application/json
```

Client must set this header:

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Sachin","email":"sachin@example.com"}'
```

---

# @RequestBody with @Valid (Validation)

```java
@PostMapping("/users")
public ResponseEntity<UserResponse> createUser(
    @RequestBody @Valid CreateUserRequest request
) {
    User user = userService.create(request);
    return ResponseEntity.status(201).body(toResponse(user));
}
```

```java
@Data
public class CreateUserRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email format")
    private String email;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
```

If validation fails → 400 Bad Request automatically.

---

# Nested Objects in @RequestBody

```json
{
    "name": "Sachin",
    "email": "sachin@example.com",
    "address": {
        "street": "123 Main St",
        "city": "Delhi",
        "pincode": "110001"
    },
    "roles": ["USER", "ADMIN"]
}
```

```java
@Data
public class CreateUserRequest {
    private String name;
    private String email;
    private AddressDto address;
    private List<String> roles;
}

@Data
public class AddressDto {
    private String street;
    private String city;
    private String pincode;
}
```

Spring/Jackson handles nested objects and arrays automatically.

---

# Customizing Jackson

```java
@Data
public class UserResponse {

    private Long id;

    @JsonProperty("full_name")    // JSON key: full_name, Java field: name
    private String name;

    @JsonIgnore                    // Never include in JSON
    private String password;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)  // Skip if null
    private String profilePicture;
}
```

---

# Company Example — PhonePe

PhonePe money transfer:

```java
// Request DTO
@Data
public class TransferRequest {

    @NotBlank
    private String fromAccount;

    @NotBlank
    private String toAccount;

    @NotNull
    @Positive(message = "Amount must be positive")
    private Double amount;

    @NotBlank
    private String upiPin;

    private String remarks;
}

// Response DTO
@Data
public class TransferResponse {
    private String transactionId;
    private String status;
    private Double amount;
    private String toAccount;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    @JsonIgnore
    private String internalReferenceId; // Not exposed to client
}

// Controller
@RestController
@RequestMapping("/api/v1/transfer")
public class TransferController {

    @PostMapping
    public ResponseEntity<TransferResponse> transfer(
        @RequestBody @Valid TransferRequest request
    ) {
        TransferResponse response = transferService.transfer(request);
        return ResponseEntity.ok(response);
    }
}
```

---

# Interview Questions

## Q1. What is @RequestBody?

**Best Answer**

> `@RequestBody` tells Spring to read the HTTP request body and deserialize it (typically from JSON) into the specified Java object using Jackson's `ObjectMapper`. The request must have `Content-Type: application/json`.

---

## Q2. What is @ResponseBody?

It tells Spring to serialize the method's return value to JSON and write it directly to the HTTP response body. `@RestController` applies it to all methods automatically.

---

## Q3. What is the DTO pattern and why use it?

A Data Transfer Object is a separate class used for API input/output, distinct from the entity. It prevents exposing sensitive fields, allows request/response shapes to differ from the database model, and provides a stable API contract.

---

## Q4. What library does Spring use for JSON serialization?

**Jackson** (specifically `com.fasterxml.jackson.core:jackson-databind`), included automatically with `spring-boot-starter-web`.

---

## Q5. What happens if @RequestBody JSON is invalid?

Spring throws an `HttpMessageNotReadableException` (400 Bad Request). If `@Valid` is used and validation fails, Spring throws `MethodArgumentNotValidException` (also 400).

---

# Professional Summary

```
@RequestBody
  Client sends JSON →  Spring reads → Java Object
  Must have: Content-Type: application/json

@ResponseBody
  Java Object → Spring converts → JSON in response
  Applied automatically by @RestController

Best practices:
  ✅ Use DTOs (not entities) for request/response
  ✅ Combine @RequestBody with @Valid
  ✅ Use @JsonIgnore for sensitive fields
  ✅ Use @JsonFormat for dates
  ✅ Use @JsonProperty for field renaming
```

---

# 🧠 Memory Trick

```
HTTP Request/Response = Package delivery

@RequestBody  = Unbox incoming package (JSON → Java)
@ResponseBody = Box outgoing package (Java → JSON)

Jackson = The shipping/packing machine

Client → JSON → [Jackson] → Java Object  (@RequestBody)
Java Object → [Jackson] → JSON → Client  (@ResponseBody)
```

---

# 🚀 Next Chapter

We'll master **ResponseEntity** — the powerful way to control HTTP status codes, headers, and the response body precisely.
