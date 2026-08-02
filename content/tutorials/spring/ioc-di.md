Welcome to **Chapter 7 — IoC & Dependency Injection**.

> **Inversion of Control and Dependency Injection are the heart of Spring. Everything else is built on top of this one powerful idea.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you are a chef.

**Without IoC:**

```
Chef needs a knife.
Chef goes to the market.
Chef buys a knife.
Chef uses it.
```

The chef is in control of getting his own tools.

**With IoC (Inversion of Control):**

```
Chef tells the restaurant: "I need a knife."
Restaurant provides the knife.
Chef uses it.
```

The chef doesn't go looking for tools.

The restaurant provides what is needed.

**Spring is the restaurant.**

Your classes are the chefs.

Spring provides everything they need.

---

# What is IoC?

**Inversion of Control** means:

> Instead of your code creating and managing its dependencies, you give control to the **Spring Container**.

```
Traditional:
  Class A creates Class B

IoC:
  Spring creates Class B and gives it to Class A
```

---

# What is Dependency Injection?

**Dependency Injection** is how IoC is implemented.

Spring injects the dependencies into your class.

Three ways:

```
1. Field Injection
2. Constructor Injection
3. Setter Injection
```

---

# 1. Field Injection

```java
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository; // Spring injects this

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }
}
```

Easy but not recommended for production (hard to test).

---

# 2. Constructor Injection (Recommended ✅)

```java
@Service
public class OrderService {

    private final OrderRepository orderRepository;

    // Spring calls this constructor and injects
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }
}
```

Best practice. Dependencies are explicit. Easy to test.

---

# 3. Setter Injection

```java
@Service
public class OrderService {

    private OrderRepository orderRepository;

    @Autowired
    public void setOrderRepository(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
}
```

Used for optional dependencies.

---

# The Spring IoC Container

Spring has a container (ApplicationContext) that:

```
1. Scans for @Component, @Service, @Repository, @Controller
2. Creates instances (beans)
3. Manages their lifecycle
4. Injects dependencies where needed
```

```
@SpringBootApplication
        ↓
ComponentScan
        ↓
Find all annotated classes
        ↓
Create beans in ApplicationContext
        ↓
Inject dependencies
        ↓
Your application runs
```

---

# Why IoC / DI?

**Without DI:**

```java
public class OrderService {
    // Tightly coupled — hard to change
    private OrderRepository orderRepository = new OrderRepository();
    private EmailService emailService = new EmailService();
    private PaymentGateway gateway = new RazorpayGateway(); // hardcoded!
}
```

**With DI:**

```java
@Service
public class OrderService {

    // Loosely coupled — easy to swap
    private final OrderRepository orderRepository;
    private final EmailService emailService;
    private final PaymentGateway gateway; // interface — any implementation

    public OrderService(OrderRepository repo, EmailService email, PaymentGateway gw) {
        this.orderRepository = repo;
        this.emailService = email;
        this.gateway = gw;
    }
}
```

Benefits:
```
✅ Loosely coupled code
✅ Easy to test (mock dependencies)
✅ Easy to switch implementations
✅ Spring manages object lifecycle
```

---

# Interface + DI = Power

```java
// Define interface
public interface PaymentGateway {
    PaymentResponse charge(double amount);
}

// Implementation 1
@Service("razorpay")
public class RazorpayGateway implements PaymentGateway {
    public PaymentResponse charge(double amount) {
        // Razorpay code
    }
}

// Implementation 2
@Service("stripe")
public class StripeGateway implements PaymentGateway {
    public PaymentResponse charge(double amount) {
        // Stripe code
    }
}

// Use it
@Service
public class OrderService {

    @Autowired
    @Qualifier("razorpay")
    private PaymentGateway paymentGateway;
}
```

Switching to Stripe:

```java
@Qualifier("stripe")
```

One line change. No logic modified.

---

# ApplicationContext

The Spring IoC container is the `ApplicationContext`.

```java
@SpringBootApplication
public class MyApp {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MyApp.class, args);

        // Access bean manually
        UserService userService = context.getBean(UserService.class);
    }
}
```

Usually you don't access beans directly — Spring injects them for you.

---

# Company Example — Uber

Uber's ride-matching service:

```java
// Interface
public interface MapService {
    double calculateDistance(Location from, Location to);
}

// Google Maps implementation
@Primary
@Service
public class GoogleMapsService implements MapService {
    public double calculateDistance(Location from, Location to) {
        // Google Maps API call
    }
}

// OpenStreetMap — fallback
@Service("openStreetMap")
public class OpenStreetMapService implements MapService {
    public double calculateDistance(Location from, Location to) {
        // OSM API call
    }
}

// RideService — doesn't care which map provider
@Service
public class RideService {

    private final MapService mapService; // injected by Spring

    public RideService(MapService mapService) {
        this.mapService = mapService;
    }

    public double calculateFare(Ride ride) {
        double distance = mapService.calculateDistance(ride.getPickup(), ride.getDrop());
        return distance * 15; // ₹15 per km
    }
}
```

---

# Interview Questions

## Q1. What is Inversion of Control (IoC)?

**Best Answer**

> IoC is a design principle where the control of creating and managing object dependencies is transferred from the class itself to an external container (Spring's ApplicationContext). The class declares what it needs, and Spring provides it.

---

## Q2. What is Dependency Injection?

The design pattern used to implement IoC. Spring injects required objects (dependencies) into a class via constructor, field, or setter injection instead of the class creating them with `new`.

---

## Q3. What is the Spring IoC Container?

The `ApplicationContext` — the central Spring component that instantiates, configures, and manages all Spring beans and their dependencies.

---

## Q4. Which type of injection is recommended?

**Constructor injection** is recommended because:
- Dependencies are explicit and required
- Enables immutability (`final` fields)
- Easier to unit test (no Spring context needed)

---

## Q5. What is the difference between `@Component`, `@Service`, and `@Repository`?

All are `@Component` specializations. They all enable Spring to detect and manage the bean. `@Service` implies business logic, `@Repository` adds exception translation from DB-specific exceptions to Spring's DataAccessException hierarchy.

---

# Professional Summary

```
IoC:
  Spring creates and manages objects

DI:
  Spring injects dependencies

Three types:
  1. Constructor (✅ Best)
  2. Field (@Autowired)
  3. Setter

Benefits:
  Loose coupling
  Easy testing
  Swappable implementations
  Spring manages lifecycle
```

---

# 🧠 Memory Trick

IoC = **Inversion of Control**

```
Traditional (Your control):
  You go to market → buy tools → use them

IoC (Spring's control):
  You say "I need tools"
  Spring delivers them to you

DI = Spring's delivery mechanism
```

---

# 🚀 Next Chapter

We'll explore **Spring Beans** — the fundamental building blocks managed by the Spring IoC container.
