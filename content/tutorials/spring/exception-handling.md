Welcome to **Chapter 20 — Exception Handling**.

> **@ControllerAdvice is your API's safety net. Without it, one uncaught exception exposes internals to clients. With it, every error is handled gracefully.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a call center.

Customer calls with a problem.

**Without exception handling:**

```
Customer: "My order is missing"
Agent: "ERROR: NullPointerException at line 342... CRASH"
```

Not professional. Exposes internal system.

**With exception handling:**

```
Customer: "My order is missing"
Agent: "Sorry, we couldn't find your order. Please check the order ID."
```

Professional. Safe. Helpful.

`@ControllerAdvice` is the training manual that tells all agents what to say when things go wrong.

---

# The Problem Without Exception Handling

```java
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    return userRepository.findById(id).get(); // Throws NoSuchElementException if not found
}
```

Response:

```
HTTP 500 Internal Server Error

{
    "timestamp": "2024-01-15T10:00:00.000+00:00",
    "status": 500,
    "error": "Internal Server Error",
    "trace": "java.util.NoSuchElementException: No value present\n\tat java.util.Optional.get...",
    "path": "/api/users/999"
}
```

Stack trace exposed. Very unprofessional.

---

# @ControllerAdvice

Handles exceptions globally across all controllers.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(404, ex.getMessage(), "NOT_FOUND");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
```

---

# Error Response DTO

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private int status;
    private String message;
    private String errorCode;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp = LocalDateTime.now();

    public ErrorResponse(int status, String message, String errorCode) {
        this.status = status;
        this.message = message;
        this.errorCode = errorCode;
    }
}
```

---

# Custom Exceptions

```java
// Base exception
public class AppException extends RuntimeException {
    private final int status;
    private final String errorCode;

    public AppException(String message, int status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public int getStatus() { return status; }
    public String getErrorCode() { return errorCode; }
}

// Specific exceptions
public class ResourceNotFoundException extends AppException {
    public ResourceNotFoundException(String message) {
        super(message, 404, "RESOURCE_NOT_FOUND");
    }
}

public class DuplicateResourceException extends AppException {
    public DuplicateResourceException(String message) {
        super(message, 409, "DUPLICATE_RESOURCE");
    }
}

public class UnauthorizedException extends AppException {
    public UnauthorizedException(String message) {
        super(message, 401, "UNAUTHORIZED");
    }
}

public class ForbiddenException extends AppException {
    public ForbiddenException(String message) {
        super(message, 403, "FORBIDDEN");
    }
}
```

---

# Complete Global Exception Handler

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // Handle custom AppException (and all subclasses)
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleAppException(AppException ex) {
        log.error("App exception: {}", ex.getMessage());
        return ResponseEntity
            .status(ex.getStatus())
            .body(new ErrorResponse(ex.getStatus(), ex.getMessage(), ex.getErrorCode()));
    }

    // Handle validation failures
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
        MethodArgumentNotValidException ex
    ) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(err -> fieldErrors.put(err.getField(), err.getDefaultMessage()));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", 400);
        body.put("error", "Validation Failed");
        body.put("fields", fieldErrors);
        body.put("timestamp", LocalDateTime.now());

        return ResponseEntity.badRequest().body(body);
    }

    // Handle constraint violations (path variable, request param validation)
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(
        ConstraintViolationException ex
    ) {
        String message = ex.getConstraintViolations().stream()
            .map(v -> v.getPropertyPath() + ": " + v.getMessage())
            .collect(Collectors.joining(", "));

        return ResponseEntity.badRequest()
            .body(new ErrorResponse(400, message, "CONSTRAINT_VIOLATION"));
    }

    // Handle JWT errors
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorResponse> handleJwtException(JwtException ex) {
        return ResponseEntity.status(401)
            .body(new ErrorResponse(401, "Invalid or expired token", "INVALID_TOKEN"));
    }

    // Handle database constraint violations
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex) {
        return ResponseEntity.status(409)
            .body(new ErrorResponse(409, "Data conflict: " + ex.getMostSpecificCause().getMessage(), "DATA_CONFLICT"));
    }

    // Handle everything else
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(Exception ex) {
        log.error("Unexpected error: ", ex); // Log full stack trace
        return ResponseEntity.status(500)
            .body(new ErrorResponse(500, "An unexpected error occurred. Please try again.", "INTERNAL_ERROR"));
    }
}
```

---

# @ExceptionHandler in Controller (Local)

Handle exceptions for a specific controller only:

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(404)
            .body(new ErrorResponse(404, ex.getMessage(), "USER_NOT_FOUND"));
    }
}
```

Local handlers take priority over `@ControllerAdvice` for their own controller.

---

# @ResponseStatus on Exception Class

```java
@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("User not found with id: " + id);
    }
}
```

Spring automatically returns 404 when this exception is thrown.

---

# Company Example — Paytm

```java
@RestControllerAdvice
@Slf4j
public class PaytmExceptionHandler {

    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<PaytmErrorResponse> handleInsufficientBalance(
        InsufficientBalanceException ex
    ) {
        log.warn("Insufficient balance for user: {}", ex.getUserId());
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(
            PaytmErrorResponse.builder()
                .status("FAILED")
                .errorCode("E_INSUFFICIENT_BALANCE")
                .message("Insufficient wallet balance. Please add money.")
                .build()
        );
    }

    @ExceptionHandler(TransactionLimitExceededException.class)
    public ResponseEntity<PaytmErrorResponse> handleLimitExceeded(
        TransactionLimitExceededException ex
    ) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(
            PaytmErrorResponse.builder()
                .status("FAILED")
                .errorCode("E_DAILY_LIMIT_EXCEEDED")
                .message("Daily transaction limit exceeded. Limit resets at midnight.")
                .build()
        );
    }

    @ExceptionHandler(PaymentGatewayException.class)
    public ResponseEntity<PaytmErrorResponse> handleGatewayError(PaymentGatewayException ex) {
        log.error("Payment gateway error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(
            PaytmErrorResponse.builder()
                .status("FAILED")
                .errorCode("E_GATEWAY_ERROR")
                .message("Payment gateway is temporarily unavailable. Please try again.")
                .build()
        );
    }
}
```

---

# Interview Questions

## Q1. What is @ControllerAdvice?

**Best Answer**

> `@ControllerAdvice` (or `@RestControllerAdvice` for REST) is a global exception handling class. Methods annotated with `@ExceptionHandler` inside it handle exceptions thrown by any controller in the application, allowing centralized error handling.

---

## Q2. What is the difference between @ControllerAdvice and @RestControllerAdvice?

`@RestControllerAdvice` = `@ControllerAdvice` + `@ResponseBody`. It returns JSON from exception handlers automatically, while `@ControllerAdvice` can return views.

---

## Q3. What is @ExceptionHandler?

An annotation on a method inside `@ControllerAdvice` (or a controller) that handles a specific exception type. The method receives the exception and returns a `ResponseEntity` with the appropriate error response.

---

## Q4. What is the order of exception handler resolution?

1. Local `@ExceptionHandler` in the same controller (highest priority)
2. `@ExceptionHandler` in `@ControllerAdvice` classes (ordered by `@Order`)
3. Spring's default exception handling

---

## Q5. How do you hide internal error details from clients?

In the catch-all `@ExceptionHandler(Exception.class)`, return a generic message like "An unexpected error occurred" while logging the full stack trace server-side with `log.error("Unexpected error:", ex)`.

---

# Professional Summary

```
Exception Handling:

1. Custom exceptions extend RuntimeException
2. @RestControllerAdvice catches them globally
3. @ExceptionHandler maps exception type → response
4. Return proper HTTP status codes

Error Response:
  {
    "status": 404,
    "message": "User not found",
    "errorCode": "RESOURCE_NOT_FOUND",
    "timestamp": "2024-01-15 10:00:00"
  }

Never expose:
  ❌ Stack traces
  ❌ Database errors
  ❌ Internal package names
```

---

# 🧠 Memory Trick

```
@RestControllerAdvice = 🏥 Hospital Emergency Room

All emergencies (exceptions) come here
Different rooms for different emergencies:
  404 → Missing Persons Unit
  400 → Invalid Request Ward
  500 → Critical Care Unit

Each room (@ExceptionHandler) knows exactly
how to treat its emergency
```

---

# 🚀 Next Chapter

We'll dive into **JPA Introduction** — how Spring Boot connects to databases using the Java Persistence API.
