Welcome to **Chapter 19 — Bean Validation**.

> **Validation is your API's immune system. Without it, bad data enters your system and corrupts everything downstream.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a form at the bank.

```
Name:  [____________] ← Can't be empty
Age:   [____________] ← Must be number, 18+
Email: [____________] ← Must have @
Phone: [____________] ← Must be 10 digits
```

If you fill it wrong:

```
❌ Name is required
❌ You must be 18 or older
❌ Invalid email format
```

Spring Validation does this automatically for your API.

---

# Adding Validation Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

---

# Common Validation Annotations

| Annotation | Description |
| --- | --- |
| `@NotNull` | Must not be null |
| `@NotBlank` | Must not be null or empty string |
| `@NotEmpty` | Must not be null or empty collection/string |
| `@Size(min, max)` | String/collection size range |
| `@Min(value)` | Minimum numeric value |
| `@Max(value)` | Maximum numeric value |
| `@Email` | Valid email format |
| `@Pattern(regexp)` | Matches regex pattern |
| `@Positive` | Must be > 0 |
| `@PositiveOrZero` | Must be >= 0 |
| `@Negative` | Must be < 0 |
| `@Past` | Date must be in the past |
| `@Future` | Date must be in the future |
| `@DecimalMin` | Minimum decimal value |
| `@DecimalMax` | Maximum decimal value |

---

# Annotate DTO

```java
@Data
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 20, message = "Password must be between 8 and 20 characters")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$",
        message = "Password must contain at least one digit, one lowercase, and one uppercase letter"
    )
    private String password;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "You must be at least 18 years old")
    @Max(value = 120, message = "Invalid age")
    private Integer age;

    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Invalid Indian phone number")
    private String phone;
}
```

---

# Trigger Validation with @Valid

```java
@PostMapping("/register")
public ResponseEntity<UserResponse> register(
    @RequestBody @Valid RegisterRequest request
) {
    UserResponse user = userService.register(request);
    return ResponseEntity.status(201).body(user);
}
```

`@Valid` triggers validation.

If any field fails → Spring throws `MethodArgumentNotValidException` automatically.

---

# Handle Validation Errors

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
        MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = new LinkedHashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", 400);
        body.put("error", "Validation Failed");
        body.put("fields", errors);

        return ResponseEntity.badRequest().body(body);
    }
}
```

Error response:

```json
{
    "status": 400,
    "error": "Validation Failed",
    "fields": {
        "name": "Full name is required",
        "email": "Please provide a valid email address",
        "age": "You must be at least 18 years old"
    }
}
```

---

# @Validated for Path Variables and Params

```java
@RestController
@Validated // Enables validation on method parameters
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(
        @PathVariable @Min(value = 1, message = "ID must be positive") Long id
    ) {
        return ResponseEntity.ok(userService.findById(id));
    }
}
```

---

# Nested Object Validation

```java
@Data
public class CreateOrderRequest {

    @NotNull
    @Valid  // Triggers validation on nested object
    private ShippingAddressDto address;

    @NotEmpty
    private List<@Valid OrderItemDto> items;
}

@Data
public class ShippingAddressDto {

    @NotBlank
    private String street;

    @NotBlank
    private String city;

    @NotBlank
    @Size(min = 6, max = 6)
    private String pincode;
}
```

---

# Custom Validator

Create your own validation annotation.

**Step 1 — Create annotation**:

```java
@Documented
@Constraint(validatedBy = UniqueEmailValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface UniqueEmail {
    String message() default "Email is already registered";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

**Step 2 — Implement validator**:

```java
@Component
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) return true;
        return !userRepository.existsByEmail(email);
    }
}
```

**Step 3 — Use it**:

```java
@Data
public class RegisterRequest {

    @UniqueEmail
    @Email
    private String email;
}
```

---

# @Valid vs @Validated

| Feature | @Valid | @Validated |
| --- | --- | --- |
| Source | Jakarta EE | Spring |
| Nested validation | ✅ | ✅ |
| Validation groups | ❌ | ✅ |
| Method-level params | ❌ | ✅ |
| Usual location | Method param | Class / param |

---

# Validation Groups

Run different validations in different scenarios:

```java
// Define groups
public interface OnCreate {}
public interface OnUpdate {}

@Data
public class UserDto {

    @NotNull(groups = OnUpdate.class)
    private Long id;

    @NotBlank(groups = OnCreate.class)
    private String name;

    @Email
    private String email;
}

// Controller
@PostMapping
public ResponseEntity<User> create(@RequestBody @Validated(OnCreate.class) UserDto dto) { ... }

@PutMapping("/{id}")
public ResponseEntity<User> update(@RequestBody @Validated(OnUpdate.class) UserDto dto) { ... }
```

---

# Company Example — OYO Rooms

OYO's booking validation:

```java
@Data
public class BookingRequest {

    @NotBlank(message = "Hotel ID is required")
    private String hotelId;

    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in must be today or future")
    private LocalDate checkIn;

    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out must be in the future")
    private LocalDate checkOut;

    @NotNull
    @Min(value = 1, message = "At least 1 guest required")
    @Max(value = 6, message = "Maximum 6 guests allowed")
    private Integer guests;

    @NotBlank(message = "Room type is required")
    @Pattern(regexp = "STANDARD|DELUXE|SUITE", message = "Invalid room type")
    private String roomType;

    @Valid
    @NotNull
    private GuestDetailsDto guestDetails;
}

@Data
public class GuestDetailsDto {
    @NotBlank
    private String name;

    @Email
    private String email;

    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Invalid phone number")
    private String phone;
}
```

---

# Interview Questions

## Q1. What is Bean Validation in Spring Boot?

**Best Answer**

> Bean Validation is the Java standard (JSR-380) for declarative validation using annotations like `@NotBlank`, `@Email`, `@Min`. Spring Boot's `spring-boot-starter-validation` integrates it, and `@Valid` on a controller parameter triggers validation automatically.

---

## Q2. What happens when validation fails?

Spring throws `MethodArgumentNotValidException` (for `@RequestBody`) or `ConstraintViolationException` (for path variables with `@Validated`). These should be caught in a `@RestControllerAdvice` to return a structured 400 error response.

---

## Q3. What is the difference between @NotNull, @NotEmpty, and @NotBlank?

`@NotNull` — value must not be null. `@NotEmpty` — must not be null or empty string/collection. `@NotBlank` — must not be null and must contain at least one non-whitespace character (most useful for strings).

---

## Q4. How do you validate nested objects?

Add `@Valid` on the nested object field in the parent DTO. Spring will then recursively validate the nested object's constraints.

---

## Q5. How do you create a custom validator?

Create a custom annotation with `@Constraint(validatedBy = YourValidator.class)`, then implement `ConstraintValidator<YourAnnotation, YourType>` with the validation logic in the `isValid()` method.

---

# Professional Summary

```
1. Add dependency: spring-boot-starter-validation

2. Annotate DTO fields:
   @NotBlank, @Email, @Size, @Min, @Max, @Pattern

3. Trigger with @Valid:
   @PostMapping
   public User create(@RequestBody @Valid CreateRequest req)

4. Handle errors globally:
   @ExceptionHandler(MethodArgumentNotValidException.class)

5. Custom validators:
   @Constraint → ConstraintValidator<A, T>
```

---

# 🧠 Memory Trick

Validation = **Airport Security Check**

```
✈️ Airport Security (Validation)

ID check         → @NotNull (must have ID)
Age verification → @Min(18)
Email check      → @Email
Bag size         → @Size(max = 100)

If any check fails → Can't board (400 Bad Request)
If all pass        → Welcome aboard! ✅
```

---

# 🚀 Next Chapter

We'll learn **Exception Handling** with `@ControllerAdvice` — building a centralized, professional error handling system for your API.
