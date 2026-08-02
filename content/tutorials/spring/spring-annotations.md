Welcome to **Chapter 6 — Spring Annotations**.

> **Annotations are the language of Spring. Every feature, every bean, every route — all controlled with annotations.**

Master annotations and you master Spring.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you work in a hospital.

Everyone wears a badge:

```
👨‍⚕️ Doctor badge   → Can treat patients
👩‍⚕️ Nurse badge    → Can give medicine
🧹 Janitor badge   → Can clean rooms
💻 Admin badge     → Can manage records
```

You see the badge → you know the role.

Spring **annotations** are those badges.

```java
@RestController  → This class handles web requests
@Service         → This class has business logic
@Repository      → This class accesses the database
```

---

# Core Spring Stereotypes

## @Component

Generic Spring-managed component.

```java
@Component
public class EmailValidator {
    public boolean isValid(String email) {
        return email.contains("@");
    }
}
```

---

## @Service

Business logic layer.

```java
@Service
public class UserService {
    public User createUser(User user) {
        // Business rules
        return userRepository.save(user);
    }
}
```

---

## @Repository

Data access layer. Also translates DB exceptions.

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
```

---

## @Controller

Web layer — returns views (HTML).

```java
@Controller
public class HomeController {

    @GetMapping("/home")
    public String home(Model model) {
        model.addAttribute("message", "Welcome!");
        return "home"; // returns home.html
    }
}
```

---

## @RestController

Web layer — returns data (JSON/XML).

```java
@RestController
public class UserController {

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}
```

`@RestController` = `@Controller` + `@ResponseBody`

---

# Configuration Annotations

## @SpringBootApplication

```java
@SpringBootApplication
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

Combines:
* `@Configuration`
* `@EnableAutoConfiguration`
* `@ComponentScan`

---

## @Configuration

Marks a class as a source of bean definitions.

```java
@Configuration
public class AppConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## @Bean

Declares a Spring bean inside a `@Configuration` class.

```java
@Bean
public ModelMapper modelMapper() {
    return new ModelMapper();
}
```

---

# Dependency Injection Annotations

## @Autowired

Injects a Spring bean automatically.

```java
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EmailService emailService;
}
```

---

## @Qualifier

When multiple beans of same type exist.

```java
@Autowired
@Qualifier("razorpayGateway")
private PaymentGateway paymentGateway;
```

---

## @Primary

Marks a bean as the default when multiple candidates exist.

```java
@Primary
@Service("razorpayGateway")
public class RazorpayGateway implements PaymentGateway { }
```

---

# Web Annotations

## @RequestMapping

Maps URL paths to controller methods.

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List<User> getAll() { ... }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) { ... }

    @PostMapping
    public User create(@RequestBody User user) { ... }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) { ... }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { ... }
}
```

---

## @PathVariable

Extracts value from the URL path.

```java
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    return userService.findById(id);
}
```

---

## @RequestParam

Extracts value from query parameters.

```java
// GET /users?page=1&size=10
@GetMapping("/users")
public List<User> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
) {
    return userService.getUsers(page, size);
}
```

---

## @RequestBody

Maps the HTTP request body to a Java object.

```java
@PostMapping("/users")
public User createUser(@RequestBody User user) {
    return userService.save(user);
}
```

---

# JPA / Entity Annotations

```java
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @OneToMany(mappedBy = "user")
    private List<Order> orders;
}
```

---

# Validation Annotations

```java
public class CreateUserRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email format")
    private String email;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @Min(value = 18, message = "Must be 18 or older")
    private int age;
}
```

---

# Transaction Annotation

```java
@Service
public class PaymentService {

    @Transactional
    public void processPayment(PaymentRequest request) {
        debitAccount(request.getFromAccount(), request.getAmount());
        creditAccount(request.getToAccount(), request.getAmount());
    }
}
```

---

# All Annotations at a Glance

| Annotation | Purpose |
| --- | --- |
| `@Component` | Generic bean |
| `@Service` | Business logic |
| `@Repository` | DB access |
| `@Controller` | View controller |
| `@RestController` | REST API controller |
| `@SpringBootApplication` | Main class |
| `@Configuration` | Config class |
| `@Bean` | Declare bean |
| `@Autowired` | Inject dependency |
| `@Qualifier` | Choose specific bean |
| `@Primary` | Default bean |
| `@GetMapping` | HTTP GET |
| `@PostMapping` | HTTP POST |
| `@PutMapping` | HTTP PUT |
| `@DeleteMapping` | HTTP DELETE |
| `@PathVariable` | URL segment |
| `@RequestParam` | Query parameter |
| `@RequestBody` | Request JSON body |
| `@Entity` | JPA entity |
| `@Id` | Primary key |
| `@Transactional` | Transaction |
| `@Value` | Inject property |
| `@Profile` | Environment profile |
| `@Scheduled` | Scheduled task |
| `@Async` | Async method |
| `@Cacheable` | Cache result |

---

# Company Example — Swiggy

Swiggy order service:

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody @Valid OrderRequest request) {
        Order order = orderService.placeOrder(request);
        return ResponseEntity.status(201).body(order);
    }
}

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Order placeOrder(OrderRequest request) {
        Order order = new Order(request);
        orderRepository.save(order);
        notificationService.sendConfirmation(order);
        return order;
    }
}

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}
```

---

# Interview Questions

## Q1. What is the difference between @Controller and @RestController?

**Best Answer**

> `@Controller` is used for web applications that return HTML views. `@RestController` = `@Controller` + `@ResponseBody`, meaning every method returns data (JSON/XML) directly in the response body, not a view name.

---

## Q2. What is the difference between @Component, @Service, and @Repository?

All three are specializations of `@Component` and are Spring-managed beans. `@Service` indicates business logic, `@Repository` indicates data access and adds exception translation, `@Component` is generic.

---

## Q3. What is @Autowired?

It tells Spring to inject the required dependency automatically from the application context into a field, constructor, or setter.

---

## Q4. What does @Transactional do?

It wraps a method in a database transaction. If the method succeeds, the transaction commits. If it throws an exception, the transaction rolls back, ensuring data consistency.

---

## Q5. What is @SpringBootApplication?

A convenience meta-annotation combining `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`. It is placed on the main class and bootstraps the entire Spring application.

---

# Professional Summary

```
Spring Annotations Quick Map:

Layer          Annotation
─────────────────────────────
Main class   → @SpringBootApplication
Web          → @RestController, @GetMapping, @PostMapping
Service      → @Service
Database     → @Repository, @Entity, @Id
Config       → @Configuration, @Bean
Injection    → @Autowired, @Qualifier
Validation   → @Valid, @NotBlank, @Email
Transaction  → @Transactional
Properties   → @Value, @ConfigurationProperties
```

---

# 🧠 Memory Trick

Annotations are **road signs**:

```
🚦 Road Signs (Annotations)

@RestController  = 🏨 Hotel (serve requests)
@Service         = 🏭 Factory (process logic)
@Repository      = 🗄️ Warehouse (store data)
@Autowired       = 🔌 Power outlet (connect)
@Transactional   = 🔒 Vault (all or nothing)
```

---

# 🚀 Next Chapter

We'll dive deep into **IoC & Dependency Injection** — the foundational concept that makes the entire Spring framework work.
