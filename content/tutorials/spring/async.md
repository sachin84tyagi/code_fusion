Welcome to **Chapter 39 — @Async & Asynchronous Methods**.

> **@Async runs your code in a separate thread. The caller doesn't wait. Your API stays fast while background work happens in parallel.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

You order food at a restaurant.

**Without @Async (synchronous):**

```
You order
Waiter goes to kitchen
Kitchen cooks (20 min)
Waiter returns with food
Only then waiter takes next order!

You = 20 min wait
Everyone after you = blocked!
```

**With @Async (asynchronous):**

```
You order
Waiter puts order in kitchen (non-blocking)
Waiter takes next customer's order immediately
Kitchen cooks in background (20 min)
When ready → serve you

You = 20 min
Other customers = served immediately!
```

---

# Enabling Async

```java
@SpringBootApplication
@EnableAsync // Enable async support
public class MyApp { }
```

---

# @Async Basics

```java
@Service
public class EmailService {

    @Async
    public void sendWelcomeEmail(String email, String name) {
        // Runs in a different thread
        // Caller returns immediately!
        System.out.println("Sending email to: " + email);
        // ... SMTP logic (takes 2 seconds)
        System.out.println("Email sent to: " + email);
    }
}

// Caller
@Service
public class UserService {

    @Autowired
    private EmailService emailService;

    public User register(RegisterRequest request) {
        User user = userRepository.save(createUser(request));

        emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        // Returns IMMEDIATELY! Email sends in background

        return user; // User returned before email is sent
    }
}
```

---

# @Async Return Types

```java
// No return value
@Async
public void sendEmail(String to) { }

// Return Future (for results)
@Async
public Future<String> generateReport() {
    String report = heavyReportGeneration();
    return new AsyncResult<>(report);
}

// Return CompletableFuture (modern, preferred)
@Async
public CompletableFuture<String> generateReport() {
    String report = heavyReportGeneration();
    return CompletableFuture.completedFuture(report);
}
```

---

# Using CompletableFuture

```java
@Service
public class AnalyticsService {

    @Async
    public CompletableFuture<SalesReport> getSalesReport(String period) {
        SalesReport report = generateReport(period);
        return CompletableFuture.completedFuture(report);
    }

    @Async
    public CompletableFuture<UserReport> getUserReport(String period) {
        UserReport report = analyzeUsers(period);
        return CompletableFuture.completedFuture(report);
    }
}

// Run multiple async tasks in parallel
@Service
public class DashboardService {

    @Autowired
    private AnalyticsService analyticsService;

    public DashboardData getDashboard(String period) throws Exception {
        // Both run in parallel!
        CompletableFuture<SalesReport> salesFuture = analyticsService.getSalesReport(period);
        CompletableFuture<UserReport> userFuture = analyticsService.getUserReport(period);

        // Wait for both to complete
        CompletableFuture.allOf(salesFuture, userFuture).join();

        return new DashboardData(salesFuture.get(), userFuture.get());
    }
}
```

---

# Custom Thread Pool Executor

By default, @Async uses a `SimpleAsyncTaskExecutor` (no thread pool — creates thread per call — BAD for production).

Configure a proper thread pool:

```java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);          // Min threads always alive
        executor.setMaxPoolSize(20);          // Max threads at peak
        executor.setQueueCapacity(100);       // Queue size before rejecting
        executor.setThreadNamePrefix("async-"); // Thread name prefix
        executor.setKeepAliveSeconds(60);     // Idle thread TTL
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }

    // Separate pool for emails
    @Bean(name = "emailExecutor")
    public Executor emailExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("email-");
        executor.initialize();
        return executor;
    }
}
```

---

# Specifying Which Executor

```java
@Async("emailExecutor")  // Use emailExecutor bean
public void sendEmail(String to) { }

@Async("taskExecutor")  // Use taskExecutor bean
public CompletableFuture<Report> generateReport() { }
```

---

# Exception Handling in Async

Exceptions in `@Async` void methods are lost by default.

Handle them with `AsyncUncaughtExceptionHandler`:

```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Override
    public Executor getAsyncExecutor() {
        // ... configure executor
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (throwable, method, params) -> {
            System.err.println("Async error in " + method.getName() + ": " + throwable.getMessage());
            // Log, alert, etc.
        };
    }
}
```

For `CompletableFuture` methods, handle exceptions on the future:

```java
CompletableFuture<Report> future = analyticsService.generateReport();
future.exceptionally(throwable -> {
    log.error("Report generation failed: {}", throwable.getMessage());
    return null;
});
```

---

# @Async Self-Invocation Problem

Same as `@Transactional` — self-calls bypass Spring proxy!

```java
@Service
public class MyService {

    @Async
    public void asyncMethod() { }

    public void regularMethod() {
        asyncMethod(); // ❌ @Async IGNORED - direct call, no proxy
    }
}

// Fix: Inject self or move to separate class
@Service
public class MyService {

    @Autowired
    private MyService self;

    public void regularMethod() {
        self.asyncMethod(); // ✅ Goes through Spring proxy
    }

    @Async
    public void asyncMethod() { }
}
```

---

# Company Example — Zomato Order Notifications

After placing an order, multiple notifications need to be sent:

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    // Send push notification (background, don't block order response)
    @Async("notificationExecutor")
    public void sendPushNotification(String userId, String message) {
        try {
            pushNotificationClient.send(userId, message);
            log.info("Push notification sent to {}", userId);
        } catch (Exception e) {
            log.error("Failed to send push notification: {}", e.getMessage());
        }
    }

    // Send email receipt (background)
    @Async("emailExecutor")
    public void sendEmailReceipt(Order order) {
        try {
            emailService.sendOrderConfirmation(order);
            log.info("Email receipt sent for order {}", order.getId());
        } catch (Exception e) {
            log.error("Failed to send email for order {}: {}", order.getId(), e.getMessage());
        }
    }

    // Send SMS (background)
    @Async("smsExecutor")
    public void sendSmsConfirmation(String phone, Order order) {
        smsService.send(phone, "Order confirmed! " + order.getId() + " will arrive in 30 min");
    }
}

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final NotificationService notificationService;

    public Order placeOrder(PlaceOrderRequest request) {
        Order order = createOrder(request);
        orderRepository.save(order);

        // All 3 notifications run in background
        // API returns immediately!
        notificationService.sendPushNotification(request.getUserId(), "Order placed!");
        notificationService.sendEmailReceipt(order);
        notificationService.sendSmsConfirmation(request.getPhone(), order);

        return order; // Returns in ~5ms, not ~3s
    }
}
```

---

# Interview Questions

## Q1. What is @Async in Spring?

**Best Answer**

> `@Async` marks a method to run in a separate thread, making it non-blocking for the caller. The method executes asynchronously in a configured thread pool. `@EnableAsync` must be on a configuration class.

---

## Q2. What are the return type options for @Async methods?

`void` (fire-and-forget), `Future<T>` (Java standard future), or `CompletableFuture<T>` (preferred, supports chaining and combining multiple async tasks).

---

## Q3. Why should you configure a custom ThreadPoolTaskExecutor?

The default `SimpleAsyncTaskExecutor` creates a new thread per call, which can exhaust system resources. A `ThreadPoolTaskExecutor` with a bounded thread pool and queue prevents thread exhaustion and provides better performance control.

---

## Q4. What happens to exceptions in void @Async methods?

They are silently ignored unless you implement `AsyncUncaughtExceptionHandler` in your `AsyncConfigurer` configuration. For `CompletableFuture` methods, use `.exceptionally()` to handle errors.

---

## Q5. What is the self-invocation problem with @Async?

When a method in the same class calls an `@Async` method directly (not through the Spring proxy), the async annotation is ignored and the method runs synchronously. Fix by injecting the bean into itself or moving to a separate class.

---

# Professional Summary

```
@EnableAsync  → on @SpringBootApplication or config

@Async        → runs method in thread pool
  void        → fire and forget
  CompletableFuture<T> → get result later

Custom pool:
  ThreadPoolTaskExecutor
    corePoolSize = 5
    maxPoolSize  = 20
    queueCapacity = 100

Multiple pools:
  @Async("emailExecutor")
  @Async("reportExecutor")

Error handling:
  AsyncUncaughtExceptionHandler
  CompletableFuture.exceptionally()
```

---

# 🧠 Memory Trick

@Async = **Restaurant Kitchen**

```
🍕 Pizza order placed

Without @Async:
  Waiter stands at kitchen window
  Waiter waits 20 minutes for pizza
  No other orders taken!

With @Async:
  Waiter gives order to kitchen (non-blocking)
  Waiter takes more orders
  Kitchen makes pizza in background
  When done → deliver to table
```

---

# 🚀 Next Chapter

We'll learn **Spring Application Events** — the publish-subscribe pattern built into Spring for loose coupling between components.
