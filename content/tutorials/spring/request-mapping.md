Welcome to **Chapter 14 — @RequestMapping**.

> **@RequestMapping is how you tell Spring which URLs your methods handle. Master this and you control every route in your API.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a big apartment building.

```
Building Name: API Server
Floor 1: /users
Floor 2: /products
Floor 3: /orders
```

On each floor, specific doors (methods):

```
Floor 1 (/users):
  Room A → GET (get residents list)
  Room B → POST (add new resident)
  Room C → PUT (update resident)
  Room D → DELETE (remove resident)
```

`@RequestMapping` defines which floor and which room.

---

# What is @RequestMapping?

It maps HTTP requests to Java methods.

```java
@RestController
@RequestMapping("/api/users")    // base path for this controller
public class UserController {

    @RequestMapping(method = RequestMethod.GET)
    public List<User> getAll() { ... }
}
```

---

# Shorthand Annotations (Use These)

| Shorthand | Equivalent |
| --- | --- |
| `@GetMapping` | `@RequestMapping(method = GET)` |
| `@PostMapping` | `@RequestMapping(method = POST)` |
| `@PutMapping` | `@RequestMapping(method = PUT)` |
| `@DeleteMapping` | `@RequestMapping(method = DELETE)` |
| `@PatchMapping` | `@RequestMapping(method = PATCH)` |

---

# Class-Level + Method-Level

```java
@RestController
@RequestMapping("/api/products")    // All methods under /api/products
public class ProductController {

    @GetMapping                     // GET /api/products
    public List<Product> getAll() { ... }

    @GetMapping("/{id}")            // GET /api/products/1
    public Product getById(@PathVariable Long id) { ... }

    @PostMapping                    // POST /api/products
    public Product create(@RequestBody Product product) { ... }

    @PutMapping("/{id}")            // PUT /api/products/1
    public Product update(@PathVariable Long id, @RequestBody Product product) { ... }

    @DeleteMapping("/{id}")         // DELETE /api/products/1
    public void delete(@PathVariable Long id) { ... }
}
```

---

# @RequestMapping Options

```java
@RequestMapping(
    value = "/users",                        // URL path
    method = RequestMethod.GET,              // HTTP method
    produces = "application/json",           // Response content type
    consumes = "application/json",           // Request content type
    headers = "X-API-Version=2",             // Required headers
    params = "type=admin"                    // Required query params
)
public List<User> getAdminUsers() { ... }
```

---

# Produces and Consumes

```java
// Returns JSON
@GetMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
public List<User> getUsersJson() { ... }

// Returns XML
@GetMapping(value = "/users", produces = MediaType.APPLICATION_XML_VALUE)
public List<User> getUsersXml() { ... }

// Accepts JSON body only
@PostMapping(value = "/users", consumes = MediaType.APPLICATION_JSON_VALUE)
public User createUser(@RequestBody User user) { ... }
```

---

# Multiple Paths

```java
@GetMapping({"/home", "/", "/index"})
public String home() {
    return "Welcome!";
}
```

All three paths map to the same method.

---

# Ant-Style Path Patterns

```java
// Match any single segment
@GetMapping("/users/*/profile")
// Matches: /users/sachin/profile, /users/rahul/profile

// Match any multiple segments
@GetMapping("/users/**")
// Matches: /users/1, /users/1/orders, /users/1/orders/5

// Match any single character
@GetMapping("/user?")
// Matches: /users, /userx, /user1 (single char after /user)
```

---

# API Versioning with @RequestMapping

```java
// Version 1
@RestController
@RequestMapping("/api/v1/users")
public class UserV1Controller {
    @GetMapping
    public List<UserV1Dto> getUsers() { ... }
}

// Version 2
@RestController
@RequestMapping("/api/v2/users")
public class UserV2Controller {
    @GetMapping
    public List<UserV2Dto> getUsers() { ... }
}
```

---

# Request Mapping in Spring MVC Flow

```
Client: GET /api/users/42

↓

DispatcherServlet receives request

↓

HandlerMapping finds:
  @RequestMapping("/api/users")     → UserController
  @GetMapping("/{id}")              → getById()

↓

Method: getById(id = 42)

↓

Returns User object → Jackson → JSON

↓

HTTP 200 response
```

---

# Company Example — Myntra

Myntra's product catalog API:

```java
@RestController
@RequestMapping("/api/v2/catalog")
public class CatalogController {

    @GetMapping("/products")
    public Page<ProductDto> getProducts(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String brand,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "24") int size
    ) {
        return catalogService.search(category, brand, page, size);
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductDetailDto> getProduct(@PathVariable String productId) {
        return ResponseEntity.ok(catalogService.getProduct(productId));
    }

    @GetMapping("/categories")
    public List<CategoryDto> getCategories() {
        return catalogService.getAllCategories();
    }

    @PostMapping(
        value = "/products",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ProductDto> addProduct(@RequestBody CreateProductRequest request) {
        ProductDto product = catalogService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }
}
```

---

# Interview Questions

## Q1. What is @RequestMapping?

**Best Answer**

> `@RequestMapping` maps web requests to specific handler methods or classes. It can specify the URL path, HTTP method, content types, headers, and query parameters to match. Shorthand variants like `@GetMapping`, `@PostMapping` are preferred for common HTTP methods.

---

## Q2. What is the difference between @RequestMapping at class level vs method level?

Class-level `@RequestMapping` sets a base path shared by all methods. Method-level annotations (`@GetMapping`, `@PostMapping`, etc.) add specific sub-paths and HTTP methods relative to the class-level path.

---

## Q3. What does `produces` and `consumes` mean in @RequestMapping?

`produces` specifies the content type the method returns (e.g., JSON, XML). `consumes` specifies the content type the method expects in the request body. Spring only routes the request if the content types match.

---

## Q4. What is the difference between @PutMapping and @PatchMapping?

`@PutMapping` is for full resource replacement (all fields). `@PatchMapping` is for partial updates (only the fields being changed).

---

## Q5. How does Spring map a URL to a method?

The `DispatcherServlet` uses `HandlerMapping` to find which controller and method match the incoming request's URL, HTTP method, headers, and params. It then delegates to that method.

---

# Professional Summary

```
@RequestMapping

Class level:
  @RequestMapping("/api/users")  → base path

Method level:
  @GetMapping          → GET all
  @GetMapping("/{id}") → GET by ID
  @PostMapping         → CREATE
  @PutMapping("/{id}") → UPDATE
  @DeleteMapping("/{id}") → DELETE

Options:
  produces → response content type
  consumes → request content type
  headers  → required headers
  params   → required query params
```

---

# 🧠 Memory Trick

RequestMapping = **Phone Directory**

```
📞 Phone Directory

Company: /api/users  (@RequestMapping class level)

  Sales:  GET /api/users         (getAll)
  HR:     GET /api/users/{id}    (getById)
  Admin:  POST /api/users        (create)
  CEO:    DELETE /api/users/{id} (delete)

Caller tells exchange (DispatcherServlet):
  "I want Sales"  →  Route to @GetMapping
```

---

# 🚀 Next Chapter

We'll master **@PathVariable & @RequestParam** — how to extract data from the URL path and query string.
