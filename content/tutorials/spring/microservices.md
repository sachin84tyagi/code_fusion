Welcome to **Chapter 45 — Microservices with Spring Boot** *(Final Chapter)*.

> **Microservices is how Netflix, Amazon, Uber, and Flipkart scale to millions of users. This is the pinnacle of modern Java backend architecture.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a big restaurant.

**Monolith (One Big Restaurant):**

```
One kitchen does everything:
  → Cooking
  → Washing
  → Billing
  → Delivery

If the kitchen catches fire → entire restaurant shuts down!
```

**Microservices (Food Court):**

```
Separate stalls:
  🍕 Pizza stall   → Only pizza
  🍔 Burger stall  → Only burgers
  💳 Billing stall → Only payments
  🚚 Delivery stall → Only delivery

If pizza stall has problem → only pizza affected
Others still work!
```

Each stall = a Microservice.

---

# Monolith vs Microservices

| Feature | Monolith | Microservices |
| --- | --- | --- |
| Deployment | All at once | Independent |
| Scale | Entire app | Individual services |
| Failure | Entire app | Single service |
| Team | One team | Multiple teams |
| Technology | One stack | Mixed stacks |
| Complexity | Simple | Complex |
| Best for | Small apps | Large-scale systems |

---

# Microservices Architecture

```
Client (Browser/Mobile)
         ↓
    API Gateway (Spring Cloud Gateway)
         ↓
┌────────────────────────────────────────────┐
│  User      Product    Order     Payment    │
│  Service   Service    Service   Service    │
│  :8081     :8082      :8083     :8084      │
└────────────────────────────────────────────┘
         ↓               ↓           ↓
    User DB         Product DB    Order DB

Service Discovery → Eureka Server
Config Server     → Spring Cloud Config
Message Queue     → Kafka / RabbitMQ
```

---

# Spring Cloud Components

| Component | Purpose |
| --- | --- |
| Spring Cloud Gateway | API Gateway — single entry point |
| Eureka (Service Discovery) | Services find each other by name |
| Spring Cloud Config | Centralized configuration |
| OpenFeign | Declarative HTTP client for inter-service calls |
| Resilience4j | Circuit breaker, retry, rate limiting |
| Zipkin / Sleuth | Distributed tracing |
| Kafka / RabbitMQ | Async inter-service communication |

---

# 1. Eureka Server (Service Registry)

All services register here. Others discover them by name.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

```java
@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServer { }
```

```properties
# application.properties
server.port=8761
spring.application.name=discovery-server
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

---

# 2. Microservice (Eureka Client)

Each service registers with Eureka.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

```java
@SpringBootApplication
@EnableEurekaClient
public class UserServiceApplication { }
```

```properties
spring.application.name=user-service
server.port=8081
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

---

# 3. API Gateway (Spring Cloud Gateway)

Single entry point for all client requests.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

```yaml
# application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service          # lb = load balance via Eureka
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=0

        - id: product-service
          uri: lb://product-service
          predicates:
            - Path=/api/products/**

        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
```

---

# 4. OpenFeign — Inter-Service Communication

User Service calling Order Service.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

```java
@SpringBootApplication
@EnableFeignClients
public class UserServiceApplication { }

// Feign client — declare interface, Spring generates implementation
@FeignClient(name = "order-service")  // Discovers via Eureka
public interface OrderClient {

    @GetMapping("/api/orders/user/{userId}")
    List<OrderDto> getOrdersByUserId(@PathVariable Long userId);

    @PostMapping("/api/orders")
    OrderDto createOrder(@RequestBody CreateOrderRequest request);
}

// Use in service
@Service
@RequiredArgsConstructor
public class UserService {

    private final OrderClient orderClient;

    public UserWithOrdersResponse getUserWithOrders(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<OrderDto> orders = orderClient.getOrdersByUserId(userId); // HTTP call to order-service
        return new UserWithOrdersResponse(user, orders);
    }
}
```

---

# 5. Resilience4j — Circuit Breaker

Prevents cascading failures when a service is down.

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
</dependency>
```

```java
@FeignClient(name = "order-service", fallback = OrderClientFallback.class)
public interface OrderClient {
    @GetMapping("/api/orders/user/{userId}")
    List<OrderDto> getOrdersByUserId(@PathVariable Long userId);
}

// Fallback — when order-service is down
@Component
public class OrderClientFallback implements OrderClient {
    @Override
    public List<OrderDto> getOrdersByUserId(Long userId) {
        return Collections.emptyList(); // Return empty instead of failing
    }
}
```

```yaml
resilience4j:
  circuitbreaker:
    instances:
      order-service:
        failure-rate-threshold: 50          # Open circuit at 50% failures
        wait-duration-in-open-state: 10s    # Wait 10s before trying again
        sliding-window-size: 10             # Track last 10 calls
```

---

# 6. Spring Cloud Config — Centralized Config

All microservices get config from one place.

```yaml
# Config server
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/myorg/config-repo
```

Each service fetches:

```properties
spring.config.import=configserver:http://localhost:8888
spring.application.name=user-service
```

Config file in repo: `user-service.properties`

---

# 7. Inter-Service Communication — Async with Kafka

For non-blocking communication between services:

```java
// Order Service publishes event
@Service
@RequiredArgsConstructor
public class OrderService {

    private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;

    @Transactional
    public Order placeOrder(PlaceOrderRequest request) {
        Order order = orderRepository.save(createOrder(request));

        // Publish to Kafka
        kafkaTemplate.send("order-placed", new OrderPlacedEvent(order));

        return order;
    }
}

// Payment Service consumes
@Service
@Slf4j
public class PaymentConsumer {

    @KafkaListener(topics = "order-placed", groupId = "payment-service")
    public void processPayment(OrderPlacedEvent event) {
        log.info("Processing payment for order: {}", event.getOrderId());
        paymentService.process(event);
    }
}

// Notification Service also consumes same event
@Service
public class NotificationConsumer {

    @KafkaListener(topics = "order-placed", groupId = "notification-service")
    public void sendNotification(OrderPlacedEvent event) {
        notificationService.sendOrderConfirmation(event.getUserId(), event.getOrderId());
    }
}
```

---

# 8. Distributed Tracing

Track a request across multiple services.

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-brave</artifactId>
</dependency>
<dependency>
    <groupId>io.zipkin.reporter2</groupId>
    <artifactId>zipkin-reporter-brave</artifactId>
</dependency>
```

```properties
management.tracing.sampling.probability=1.0
spring.zipkin.base-url=http://localhost:9411
```

Every log line automatically includes `traceId` and `spanId`:

```
2024-01-15 10:00:00 [user-service,traceId=abc123,spanId=def456] - User found
2024-01-15 10:00:01 [order-service,traceId=abc123,spanId=ghi789] - Order created
2024-01-15 10:00:02 [payment-service,traceId=abc123,spanId=jkl012] - Payment processed
```

Same `traceId` — one user request traced across 3 services!

---

# Company Example — Uber (Simplified)

```
Uber Microservices:

user-service:8081
  → Manage users, drivers, accounts

ride-service:8082
  → Create rides, match drivers

pricing-service:8083
  → Calculate surge pricing

payment-service:8084
  → Process payments

notification-service:8085
  → Push, SMS, email

tracking-service:8086
  → Real-time GPS location

All behind:
  API Gateway:8080
  Eureka:8761
```

```java
// Ride Service → calls multiple services via Feign
@Service
@RequiredArgsConstructor
public class RideService {

    private final UserClient userClient;
    private final PricingClient pricingClient;
    private final DriverClient driverClient;

    @CircuitBreaker(name = "pricing-service", fallbackMethod = "defaultPrice")
    public Ride createRide(CreateRideRequest request) {
        // Get user
        UserDto user = userClient.getUser(request.getUserId());

        // Get pricing
        PriceEstimate price = pricingClient.estimate(request.getPickup(), request.getDrop());

        // Match driver
        DriverDto driver = driverClient.findNearestDriver(request.getPickup());

        return rideRepository.save(new Ride(user, driver, price));
    }

    public PriceEstimate defaultPrice(CreateRideRequest request, Throwable t) {
        // Fallback to base price if pricing service is down
        return new PriceEstimate(50.0, "Base price");
    }
}
```

---

# Interview Questions

## Q1. What are Microservices?

**Best Answer**

> Microservices is an architectural style where an application is decomposed into small, independently deployable services, each responsible for a specific business domain. Each service has its own database, can be deployed independently, and communicates via APIs or messaging.

---

## Q2. What is Service Discovery (Eureka)?

A system where microservices register themselves (name, host, port) at startup, and other services query it to find their targets. Avoids hardcoding IP addresses — services discover each other dynamically.

---

## Q3. What is a Circuit Breaker?

A pattern that monitors calls to a remote service. If failures exceed a threshold, it "opens" the circuit and returns a fallback immediately without calling the failing service. Prevents cascading failures across services.

---

## Q4. What is the difference between Feign (sync) and Kafka (async)?

OpenFeign makes synchronous HTTP calls — the caller waits for the response. Kafka/RabbitMQ enable asynchronous messaging — the publisher sends a message and continues; the consumer processes it independently. Use sync for queries, async for commands.

---

## Q5. What is an API Gateway?

A single entry point for all client requests. It routes to appropriate microservices, handles authentication/authorization, rate limiting, load balancing, and SSL termination. Spring Cloud Gateway is the standard choice.

---

# Professional Summary

```
Microservices Stack:

Discovery:     Eureka Server + EurekaClient
Gateway:       Spring Cloud Gateway
Config:        Spring Cloud Config Server
Communication: OpenFeign (sync) + Kafka (async)
Resilience:    Resilience4j (circuit breaker, retry)
Tracing:       Micrometer + Zipkin
Monitoring:    Actuator + Prometheus + Grafana

Architecture:
  Each service → own DB, own codebase, own deployment
  Services communicate via REST or Kafka
  API Gateway → single public entry point
  Eureka → dynamic service discovery

Best for:
  Large teams, large scale, independent deployments
  Each team owns their service end-to-end
```

---

# 🧠 Memory Trick

Microservices = **City with Departments**

```
🏙️ City (Application)

🏥 Hospital (User Service)
🏬 Mall (Product Service)
🚚 Courier (Order Service)
🏦 Bank (Payment Service)

Each building:
  → Has its own staff (team)
  → Has its own entrance (API)
  → Has its own storage (database)
  → Works independently

City Hall (API Gateway) = Directs you to the right building
Phone Book (Eureka) = Lists all buildings and addresses
```

---

# 🎓 You've Completed the Tutorial!

Congratulations! You've gone from **Spring Basics to Microservices**.

Here's what you've mastered:

```
✅ Spring Boot Core (IOC, DI, Beans, Profiles)
✅ REST APIs (Controllers, Mapping, Validation)
✅ JPA & Hibernate (CRUD, Relations, Transactions)
✅ Spring Security (JWT, BCrypt, RBAC)
✅ Advanced Features (Caching, Scheduling, Async, AOP)
✅ Real-World Features (File Upload, Email, WebSockets)
✅ Microservices (Eureka, Gateway, Feign, Kafka)
```

---

# What to Build Next?

Apply everything by building these real projects:

1. **E-Commerce API** — Users, Products, Orders, Payments, JWT Security
2. **Chat Application** — WebSockets, Spring Security, Message History
3. **Job Portal** — File Upload (Resume), Email Notifications, Search
4. **Microservices Shop** — 4+ services, Eureka, Gateway, Kafka

---

# The Spring Boot Developer Path

```
Junior Dev    → REST API + JPA + Spring Security
Mid-Level Dev → + Caching + Async + AOP + Testing
Senior Dev    → + Microservices + Kafka + Docker + K8s
Architect     → Design systems for millions of users
```

---

# 🚀 The Journey Continues

Keep building. Keep learning. The best way to master Spring Boot is to build real applications that solve real problems.

> "The expert in anything was once a beginner."

Welcome to professional Java Spring Boot development.
