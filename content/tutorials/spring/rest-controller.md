Welcome to **Chapter 13 — @RestController**.

> **@RestController is the front door of your Spring Boot API. Every HTTP request enters here first.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a customer service desk at a bank.

```
Customer arrives
       ↓
Customer Service Rep (Controller)
       ↓
Listens to customer request
       ↓
Sends to the right department
       ↓
Returns the answer
```

`@RestController` is that customer service rep.

Every person who walks in (HTTP request) is handled here.

---

# What is @RestController?

`@RestController` = `@Controller` + `@ResponseBody`

```java
@RestController
public class UserController {

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}
```

Every method automatically returns JSON/XML in the HTTP response body.

---

# @Controller vs @RestController

## @Controller

Returns a **view name** (HTML template):

```java
@Controller
public class HomeController {

    @GetMapping("/home")
    public String home(Model model) {
        model.addAttribute("users", userService.getAll());
        return "home"; // → templates/home.html (Thymeleaf)
    }
}
```

---

## @RestController

Returns **data** (JSON/XML):

```java
@RestController
public class UserController {

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAll(); // → JSON array
    }
}
```

No view. Just data.

---

# Complete RestController Example

```java
package com.example.myapp.controller;

import com.example.myapp.model.User;
import com.example.myapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // GET /api/users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // GET /api/users/1
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    // POST /api/users
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User created = userService.save(user);
        return ResponseEntity.status(201).body(created);
    }

    // PUT /api/users/1
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updated = userService.update(id, user);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/users/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

# HTTP Method Mappings

| Annotation | HTTP Method | Purpose |
| --- | --- | --- |
| `@GetMapping` | GET | Read data |
| `@PostMapping` | POST | Create data |
| `@PutMapping` | PUT | Update (full replacement) |
| `@PatchMapping` | PATCH | Update (partial) |
| `@DeleteMapping` | DELETE | Delete data |

---

# Request Flow

```
Client sends GET /api/users

↓

DispatcherServlet

↓

UserController.getAllUsers()

↓

UserService.getAllUsers()

↓

UserRepository.findAll()

↓

Database query

↓

List<User> returned

↓

Jackson converts to JSON

↓

HTTP 200 response with JSON body
```

---

# JSON Serialization

Spring uses **Jackson** to convert Java objects to JSON automatically.

```java
public class User {
    private Long id;
    private String name;
    private String email;
}
```

Returns:

```json
{
    "id": 1,
    "name": "Sachin Tyagi",
    "email": "sachin@example.com"
}
```

---

# Jackson Annotations

Control JSON serialization:

```java
import com.fasterxml.jackson.annotation.*;

@JsonIgnoreProperties(ignoreUnknown = true)
public class User {

    private Long id;

    @JsonProperty("full_name")   // JSON key becomes full_name
    private String name;

    @JsonIgnore                  // Don't include in JSON
    private String password;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate createdAt;
}
```

---

# Returning Different Data Types

```java
// Return JSON object
@GetMapping("/user")
public User getUser() {
    return new User("Sachin", "sachin@example.com");
}

// Return JSON array
@GetMapping("/users")
public List<User> getUsers() {
    return userService.getAll();
}

// Return plain string
@GetMapping("/ping")
public String ping() {
    return "pong";
}

// Return Map as JSON
@GetMapping("/stats")
public Map<String, Object> getStats() {
    Map<String, Object> stats = new HashMap<>();
    stats.put("totalUsers", 1000);
    stats.put("activeUsers", 850);
    return stats;
}
```

---

# Company Example — LinkedIn

LinkedIn's profile API:

```java
@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    // Get profile
    @GetMapping("/{userId}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable String userId) {
        ProfileDto profile = profileService.getProfile(userId);
        return ResponseEntity.ok(profile);
    }

    // Update profile
    @PutMapping("/{userId}")
    public ResponseEntity<ProfileDto> updateProfile(
            @PathVariable String userId,
            @RequestBody UpdateProfileRequest request) {

        ProfileDto updated = profileService.update(userId, request);
        return ResponseEntity.ok(updated);
    }

    // Get connections
    @GetMapping("/{userId}/connections")
    public ResponseEntity<List<ConnectionDto>> getConnections(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        List<ConnectionDto> connections = profileService.getConnections(userId, page, size);
        return ResponseEntity.ok(connections);
    }
}
```

---

# Interview Questions

## Q1. What is @RestController?

**Best Answer**

> `@RestController` is a convenience annotation combining `@Controller` and `@ResponseBody`. It marks the class as a web controller and automatically serializes the return value of every method to JSON (or XML) in the HTTP response body.

---

## Q2. What is the difference between @Controller and @RestController?

`@Controller` is used for MVC applications returning view names (HTML templates). `@RestController` is used for REST APIs that return data (JSON/XML) directly in the response body without needing `@ResponseBody` on every method.

---

## Q3. What does Spring use to convert Java objects to JSON?

Spring uses the **Jackson** library (ObjectMapper) to automatically serialize Java objects to JSON and deserialize JSON to Java objects.

---

## Q4. What is @RequestMapping?

An annotation that maps HTTP requests to handler methods. It can be applied at the class level (sets a base path) and method level. Shorthand variants: `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`.

---

## Q5. How does `@ResponseBody` work?

It tells Spring that the return value of a method should be written directly to the HTTP response body, bypassing view resolution. `@RestController` applies `@ResponseBody` to all methods in the class.

---

# Professional Summary

```
@RestController
  = @Controller + @ResponseBody

Handles HTTP:
  @GetMapping     → Read
  @PostMapping    → Create
  @PutMapping     → Update
  @DeleteMapping  → Delete
  @PatchMapping   → Partial update

Returns:
  Object  → JSON via Jackson
  List    → JSON array
  String  → plain text

Best practice:
  @RequestMapping at class level → base path
  @GetMapping etc. at method level → specific paths
```

---

# 🧠 Memory Trick

```
@RestController = Hotel Receptionist

Guest arrives (HTTP Request)
Receptionist (Controller) handles it
Routes to kitchen/service
Returns food (JSON response)

No HTML, just data (that's the "REST" part)
```

---

# 🚀 Next Chapter

We'll master **@RequestMapping** — all the ways to map URLs to your controller methods with precision.
