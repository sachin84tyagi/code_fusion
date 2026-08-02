Welcome to **Chapter 18 — Complete CRUD REST API**.

> **This is where everything comes together. A full production-ready CRUD API — from entity to controller.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

CRUD = The 4 things you do with data.

```
C → Create  (Add new item)
R → Read    (See items)
U → Update  (Change item)
D → Delete  (Remove item)
```

Like managing your contacts:

```
Create → Add new contact
Read   → View contacts
Update → Edit phone number
Delete → Remove contact
```

---

# Project: User Management API

We'll build a complete API with:

```
GET    /api/users          → Get all users
GET    /api/users/{id}     → Get user by ID
POST   /api/users          → Create user
PUT    /api/users/{id}     → Update user
DELETE /api/users/{id}     → Delete user
```

---

# 1. Entity

```java
package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "is_active")
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

---

# 2. DTOs

```java
// Request DTO — Create
@Data
public class CreateUserRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}

// Request DTO — Update
@Data
public class UpdateUserRequest {
    private String name;

    @Email
    private String email;
}

// Response DTO
@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private boolean active;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}
```

---

# 3. Repository

```java
package com.example.api.repository;

import com.example.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByActiveTrue();
}
```

---

# 4. Custom Exception

```java
package com.example.api.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }
}
```

---

# 5. Service

```java
package com.example.api.service;

import com.example.api.dto.*;
import com.example.api.exception.*;
import com.example.api.model.User;
import com.example.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toResponse(user);
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setActive(user.isActive());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
```

---

# 6. Global Exception Handler

```java
package com.example.api.exception;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "Not Found");
        body.put("message", ex.getMessage());
        body.put("status", 404);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicate(DuplicateEmailException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "Conflict");
        body.put("message", ex.getMessage());
        body.put("status", 409);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "Validation Failed");

        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(err ->
            errors.put(err.getField(), err.getDefaultMessage())
        );
        body.put("fields", errors);
        body.put("status", 400);
        return ResponseEntity.badRequest().body(body);
    }
}
```

---

# 7. Controller

```java
package com.example.api.controller;

import com.example.api.dto.*;
import com.example.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody @Valid CreateUserRequest request) {
        UserResponse response = userService.createUser(request);
        URI location = URI.create("/api/users/" + response.getId());
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
        @PathVariable Long id,
        @RequestBody @Valid UpdateUserRequest request
    ) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

# 8. application.properties

```properties
server.port=8080

# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/userdb
spring.datasource.username=root
spring.datasource.password=root

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

# API Testing (Postman / curl)

```bash
# Create user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Sachin","email":"sachin@example.com","password":"pass1234"}'

# Get all users
curl http://localhost:8080/api/users

# Get by ID
curl http://localhost:8080/api/users/1

# Update user
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Sachin Tyagi"}'

# Delete user
curl -X DELETE http://localhost:8080/api/users/1
```

---

# Company Example — Atlassian Jira

Jira manages thousands of issues per project.

Their CRUD API follows the same exact pattern:

```
GET    /rest/api/3/issue/{issueId}         → Get issue
POST   /rest/api/3/issue                   → Create issue
PUT    /rest/api/3/issue/{issueId}         → Update issue
DELETE /rest/api/3/issue/{issueId}         → Delete issue
GET    /rest/api/3/project/{key}/issues    → Get all issues
```

Spring Boot powers the backend.

---

# Interview Questions

## Q1. What are the RESTful HTTP methods for CRUD?

**Best Answer**

> Create → POST (returns 201), Read → GET (returns 200), Update → PUT or PATCH (returns 200), Delete → DELETE (returns 204 No Content).

---

## Q2. Why use DTOs instead of exposing entities directly?

DTOs separate the API contract from the database model, prevent exposing sensitive fields (like passwords), allow different request/response shapes, and protect against over-posting attacks.

---

## Q3. What is @RestControllerAdvice?

A global exception handler that applies to all `@RestController` classes. Methods annotated with `@ExceptionHandler` in this class handle exceptions thrown anywhere in the application.

---

## Q4. How do you handle resource-not-found scenarios in a REST API?

Throw a custom exception (e.g., `ResourceNotFoundException`) in the service layer, and handle it with `@ExceptionHandler` in a global exception handler, returning 404 with a descriptive message.

---

## Q5. What does @Transactional do in the service layer?

It wraps the method in a database transaction. All database operations within the method either complete successfully (commit) or roll back entirely if an exception occurs.

---

# Professional Summary

```
CRUD API Layers:

Entity     → database table mapping
DTO        → request/response shape
Repository → data access (JpaRepository)
Service    → business logic + @Transactional
Controller → HTTP endpoints + ResponseEntity
Exception  → @RestControllerAdvice

HTTP:
  GET    → 200 OK
  POST   → 201 Created + Location header
  PUT    → 200 OK
  DELETE → 204 No Content
  Error  → 400/404/409/500
```

---

# 🧠 Memory Trick

CRUD API = **Restaurant Management System**

```
POST   /menu   → Add new dish        (Create)
GET    /menu   → See all dishes      (Read)
PUT    /menu/5 → Update dish         (Update)
DELETE /menu/5 → Remove dish         (Delete)

Chef (Service) → handles cooking
Waiter (Controller) → handles requests
Pantry (Repository) → stores ingredients
```

---

# 🚀 Next Chapter

We'll add **Bean Validation** — how to validate request data automatically using annotations like `@NotBlank`, `@Email`, `@Size`.
