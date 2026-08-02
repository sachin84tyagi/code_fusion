Welcome to **Chapter 36 — Spring Boot Actuator**.

> **Actuator gives your application a built-in health dashboard and monitoring system. Production apps live or die based on observability.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a car dashboard.

```
🚗 Car Dashboard

Speedometer → How fast?
Fuel gauge  → How much fuel?
Engine temp → Overheating?
Oil light   → Need oil?
```

Without a dashboard, you drive blind.

**Spring Actuator** is the dashboard for your application.

```
/actuator/health   → Is app running?
/actuator/metrics  → CPU, memory, requests?
/actuator/info     → App version, name?
/actuator/env      → Config values?
```

---

# Adding Actuator

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

---

# Enabling Endpoints

```properties
# Expose all endpoints
management.endpoints.web.exposure.include=*

# Expose only specific ones
management.endpoints.web.exposure.include=health,info,metrics

# Change base path (default: /actuator)
management.endpoints.web.base-path=/admin/monitor

# Management port (separate from app port)
management.server.port=9090
```

---

# Key Actuator Endpoints

| Endpoint | Description |
| --- | --- |
| `/actuator/health` | Application health |
| `/actuator/info` | App info |
| `/actuator/metrics` | Application metrics |
| `/actuator/env` | Environment variables |
| `/actuator/beans` | All Spring beans |
| `/actuator/mappings` | All URL mappings |
| `/actuator/loggers` | Logging levels |
| `/actuator/threaddump` | Thread information |
| `/actuator/heapdump` | JVM heap dump |
| `/actuator/shutdown` | Shut down app (dangerous!) |
| `/actuator/caches` | Cache info |
| `/actuator/flyway` | DB migration status |

---

# /actuator/health

```json
{
    "status": "UP",
    "components": {
        "db": {
            "status": "UP",
            "details": {
                "database": "MySQL",
                "validationQuery": "isValid()"
            }
        },
        "diskSpace": {
            "status": "UP",
            "details": {
                "total": 499963174912,
                "free": 91300077568,
                "threshold": 10485760
            }
        },
        "ping": {
            "status": "UP"
        }
    }
}
```

Show details:

```properties
management.endpoint.health.show-details=always
```

---

# Custom Health Indicator

```java
@Component
public class PaymentGatewayHealthIndicator implements HealthIndicator {

    @Autowired
    private RazorpayClient razorpayClient;

    @Override
    public Health health() {
        try {
            // Ping Razorpay API
            boolean isUp = razorpayClient.isReachable();

            if (isUp) {
                return Health.up()
                    .withDetail("razorpay", "Reachable")
                    .withDetail("latency", "45ms")
                    .build();
            } else {
                return Health.down()
                    .withDetail("razorpay", "Unreachable")
                    .withDetail("reason", "Connection timeout")
                    .build();
            }
        } catch (Exception e) {
            return Health.down(e).build();
        }
    }
}
```

---

# /actuator/metrics

```
GET /actuator/metrics
```

```json
{
    "names": [
        "jvm.memory.used",
        "jvm.memory.max",
        "http.server.requests",
        "process.cpu.usage",
        "system.cpu.count",
        "disk.free",
        "hikaricp.connections.active"
    ]
}
```

Get specific metric:

```
GET /actuator/metrics/http.server.requests
```

```json
{
    "name": "http.server.requests",
    "measurements": [
        { "statistic": "COUNT", "value": 1523 },
        { "statistic": "TOTAL_TIME", "value": 45.234 },
        { "statistic": "MAX", "value": 2.341 }
    ],
    "availableTags": [
        { "tag": "method", "values": ["GET", "POST"] },
        { "tag": "status", "values": ["200", "404", "500"] }
    ]
}
```

---

# Custom Metrics with Micrometer

```java
@RestController
@RequiredArgsConstructor
public class OrderController {

    private final MeterRegistry meterRegistry;
    private final OrderService orderService;

    @PostMapping("/api/orders")
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        Order order = orderService.createOrder(request);

        // Record custom metric
        meterRegistry.counter("orders.created",
            "status", "SUCCESS",
            "city", order.getCity()
        ).increment();

        meterRegistry.record(Duration.ofMillis(order.getProcessingTime()),
            "orders.processing.time"
        );

        return ResponseEntity.status(201).body(order);
    }
}
```

---

# /actuator/info

```properties
# application.properties
info.app.name=My Spring Boot App
info.app.version=@project.version@
info.app.description=Production API
info.author.name=Sachin Tyagi
info.author.email=sachin@example.com
management.info.env.enabled=true
```

Response:

```json
{
    "app": {
        "name": "My Spring Boot App",
        "version": "1.0.0",
        "description": "Production API"
    },
    "author": {
        "name": "Sachin Tyagi",
        "email": "sachin@example.com"
    }
}
```

---

# Securing Actuator Endpoints

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            // Public health check
            .requestMatchers("/actuator/health").permitAll()

            // Admin only for other actuator endpoints
            .requestMatchers("/actuator/**").hasRole("ADMIN")

            .anyRequest().authenticated()
        );

    return http.build();
}
```

Or put actuator on a different port:

```properties
management.server.port=9090
# Then only expose this port internally, not to the internet
```

---

# Loggers Endpoint

Change log level at runtime without restart:

```bash
# Get current log level
GET /actuator/loggers/com.example.service

# Change log level (POST)
curl -X POST http://localhost:8080/actuator/loggers/com.example.service \
  -H "Content-Type: application/json" \
  -d '{"configuredLevel": "DEBUG"}'
```

---

# Company Example — Uber

Uber monitors thousands of microservices:

```java
@Component
public class DatabaseConnectionHealthIndicator implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Override
    public Health health() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(1)) {
                return Health.up()
                    .withDetail("database", "Connected")
                    .withDetail("poolSize", getPoolSize())
                    .build();
            }
        } catch (SQLException e) {
            return Health.down()
                .withDetail("database", "Disconnected")
                .withException(e)
                .build();
        }
        return Health.unknown().build();
    }
}

// Prometheus metrics (for Grafana dashboards)
@Configuration
public class MetricsConfig {

    @Bean
    public TimedAspect timedAspect(MeterRegistry registry) {
        return new TimedAspect(registry);
    }
}

// Mark methods to be timed automatically
@Timed(value = "ride.matching.time", description = "Time to match driver with rider")
public Driver matchDriver(RideRequest request) { ... }
```

---

# Interview Questions

## Q1. What is Spring Boot Actuator?

**Best Answer**

> Spring Boot Actuator provides production-ready features for monitoring and managing your application. It exposes HTTP endpoints like `/actuator/health`, `/actuator/metrics`, and `/actuator/env` that give insight into the application's health, performance, and configuration.

---

## Q2. What does `/actuator/health` return?

An `UP` or `DOWN` status with optional details about individual components (database, disk space, custom health indicators). Status codes: `UP`, `DOWN`, `OUT_OF_SERVICE`, `UNKNOWN`.

---

## Q3. How do you create a custom health indicator?

Implement `HealthIndicator` interface with the `health()` method. Return `Health.up()` or `Health.down()` with optional details. Spring automatically includes it in `/actuator/health`.

---

## Q4. How do you secure Actuator endpoints?

Put sensitive endpoints (env, beans, shutdown) behind ROLE_ADMIN in `SecurityFilterChain`. Expose only `/actuator/health` publicly. Optionally run Actuator on a separate management port not exposed externally.

---

## Q5. What is Micrometer?

A metrics instrumentation library integrated into Spring Boot Actuator. It provides a vendor-neutral API for metrics that can be exported to Prometheus, Datadog, CloudWatch, and other monitoring systems.

---

# Professional Summary

```
Spring Boot Actuator

Add dependency: spring-boot-starter-actuator

Expose endpoints:
  management.endpoints.web.exposure.include=*

Key endpoints:
  /actuator/health   → UP/DOWN status
  /actuator/metrics  → JVM, HTTP, custom metrics
  /actuator/info     → App info
  /actuator/loggers  → Change log levels at runtime
  /actuator/env      → Config properties
  /actuator/beans    → All beans

Custom health:
  implements HealthIndicator
  returns Health.up() or Health.down()

Custom metrics:
  MeterRegistry.counter(), gauge(), timer()
```

---

# 🧠 Memory Trick

Actuator = **Car Dashboard**

```
🚗 Car Dashboard = Spring Actuator

Speedometer        → /actuator/metrics (request rate)
Fuel gauge         → /actuator/metrics/jvm.memory.used
Engine light       → /actuator/health
GPS position       → /actuator/env
Service history    → /actuator/flyway
```

---

# 🚀 Next Chapter

We'll learn **@Cacheable** — how to dramatically speed up your API by caching frequently accessed data.
