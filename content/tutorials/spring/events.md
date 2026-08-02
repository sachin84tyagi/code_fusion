Welcome to **Chapter 40 — Spring Application Events**.

> **Application Events let Spring components communicate without knowing about each other. The ultimate loose coupling.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a school announcement system.

```
Principal (Publisher):
  "Attention everyone! School is closed tomorrow."

Teachers hear it → Mark attendance
Students hear it → Plan holiday
Security Guard hears it → Lock earlier
```

The Principal didn't call each person individually.

He made one announcement.

Everyone who was listening acted on it.

**Spring Events = School announcement system.**

Publish once. Multiple listeners react.

---

# Why Events?

Without events:

```java
// UserService knows about ALL these services
@Service
public class UserService {

    @Autowired EmailService emailService;
    @Autowired AuditService auditService;
    @Autowired NotificationService notificationService;
    @Autowired AnalyticsService analyticsService;

    public User register(RegisterRequest request) {
        User user = userRepository.save(createUser(request));

        // Tightly coupled to 4 services!
        emailService.sendWelcomeEmail(user);
        auditService.logRegistration(user);
        notificationService.sendPush(user);
        analyticsService.trackNewUser(user);

        return user;
    }
}
```

With events:

```java
@Service
public class UserService {

    @Autowired ApplicationEventPublisher publisher;

    public User register(RegisterRequest request) {
        User user = userRepository.save(createUser(request));

        publisher.publishEvent(new UserRegisteredEvent(user));
        // UserService knows nothing about what happens next!

        return user;
    }
}
```

---

# Creating a Custom Event

```java
// Event class
public class UserRegisteredEvent extends ApplicationEvent {

    private final User user;

    public UserRegisteredEvent(User user) {
        super(user);
        this.user = user;
    }

    public User getUser() {
        return user;
    }
}
```

Or simpler (Spring 4.2+) — just a plain object:

```java
// No need to extend ApplicationEvent!
@Data
@AllArgsConstructor
public class UserRegisteredEvent {
    private final User user;
    private final LocalDateTime registeredAt;
}
```

---

# Publishing Events

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public User register(RegisterRequest request) {
        User user = userRepository.save(createUser(request));

        // Publish event — listeners will react
        eventPublisher.publishEvent(new UserRegisteredEvent(user, LocalDateTime.now()));

        return user;
    }
}
```

---

# Listening to Events — @EventListener

```java
@Component
@Slf4j
public class UserEventListener {

    // Listen to UserRegisteredEvent
    @EventListener
    public void onUserRegistered(UserRegisteredEvent event) {
        log.info("User registered: {}", event.getUser().getEmail());
        // Send welcome email
        emailService.sendWelcomeEmail(event.getUser());
    }
}

@Component
public class AuditEventListener {

    @EventListener
    public void onUserRegistered(UserRegisteredEvent event) {
        // Log to audit trail
        auditService.log("USER_REGISTERED", event.getUser().getId());
    }
}

@Component
public class AnalyticsListener {

    @EventListener
    public void onUserRegistered(UserRegisteredEvent event) {
        // Track in analytics
        analyticsService.track("new_user", event.getUser().getId());
    }
}
```

All 3 listeners react to the same event.

`UserService` knows about none of them.

---

# Async Event Listeners

By default, events are synchronous (listeners run in same thread).

Make them async:

```java
@Component
public class EmailEventListener {

    @Async
    @EventListener
    public void onUserRegistered(UserRegisteredEvent event) {
        // Runs in background thread
        emailService.sendWelcomeEmail(event.getUser()); // 2 seconds
        // Publisher doesn't wait!
    }
}
```

---

# @TransactionalEventListener

Fire the event AFTER the transaction commits successfully:

```java
@Service
public class PaymentService {

    @Autowired ApplicationEventPublisher publisher;

    @Transactional
    public void processPayment(PaymentRequest request) {
        paymentRepository.save(new Payment(request));
        publisher.publishEvent(new PaymentSuccessEvent(request));
        // Event fires AFTER this transaction commits!
    }
}

@Component
public class PaymentEventListener {

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPaymentSuccess(PaymentSuccessEvent event) {
        // Only called if transaction committed successfully
        // Safe to send confirmation email now
        emailService.sendPaymentConfirmation(event.getPaymentId());
    }
}
```

Transaction phases:

| Phase | When fired |
| --- | --- |
| `AFTER_COMMIT` | After successful commit |
| `AFTER_ROLLBACK` | After rollback |
| `AFTER_COMPLETION` | After commit OR rollback |
| `BEFORE_COMMIT` | Before commit |

---

# Built-in Spring Events

Spring publishes its own lifecycle events:

```java
@Component
public class AppLifecycleListener {

    // Application started
    @EventListener(ApplicationStartedEvent.class)
    public void onStarted() {
        System.out.println("Application started!");
    }

    // Application fully ready
    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        System.out.println("Application is ready to serve requests!");
        warmUpCache();
    }

    // Context refreshed
    @EventListener(ContextRefreshedEvent.class)
    public void onRefresh() {
        System.out.println("Context refreshed");
    }

    // Application shutting down
    @EventListener(ContextClosedEvent.class)
    public void onClose() {
        System.out.println("Shutting down...");
        cleanup();
    }
}
```

---

# Conditional Event Listening

```java
// Only listen if user is premium
@EventListener(condition = "#event.user.role == 'PREMIUM'")
public void onPremiumUserAction(UserActionEvent event) { }

// Only listen during specific profile
@EventListener
@Profile("prod")
public void onProdEvent(SomeEvent event) { }
```

---

# Event Ordering

Control the order of multiple listeners:

```java
@EventListener
@Order(1)  // Runs first
public void firstListener(MyEvent event) { }

@EventListener
@Order(2)  // Runs second
public void secondListener(MyEvent event) { }

@EventListener
@Order(Ordered.LOWEST_PRECEDENCE)  // Runs last
public void lastListener(MyEvent event) { }
```

---

# Company Example — Swiggy Order System

```java
// Event
@Data
@AllArgsConstructor
public class OrderPlacedEvent {
    private final Order order;
    private final User user;
    private final LocalDateTime placedAt;
}

// Publisher
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public Order placeOrder(PlaceOrderRequest request) {
        Order order = createOrder(request);
        orderRepository.save(order);

        // Publish → everyone reacts
        eventPublisher.publishEvent(
            new OrderPlacedEvent(order, request.getUser(), LocalDateTime.now())
        );

        return order;
    }
}

// Listeners — completely decoupled from OrderService
@Component
public class OrderNotificationListener {

    @Async
    @EventListener
    public void sendPushNotification(OrderPlacedEvent event) {
        pushService.send(event.getUser().getDeviceToken(),
            "Order #" + event.getOrder().getId() + " placed!");
    }

    @Async
    @EventListener
    public void sendEmailConfirmation(OrderPlacedEvent event) {
        emailService.sendOrderConfirmation(event.getOrder(), event.getUser());
    }
}

@Component
public class OrderAnalyticsListener {

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void trackOrder(OrderPlacedEvent event) {
        // After DB commit — safe to track
        analyticsService.track("order_placed", Map.of(
            "orderId", event.getOrder().getId(),
            "amount", event.getOrder().getTotalAmount(),
            "city", event.getOrder().getDeliveryCity()
        ));
    }
}

@Component
public class RestaurantNotificationListener {

    @EventListener
    public void notifyRestaurant(OrderPlacedEvent event) {
        restaurantService.notifyNewOrder(
            event.getOrder().getRestaurantId(),
            event.getOrder()
        );
    }
}
```

---

# Interview Questions

## Q1. What are Spring Application Events?

**Best Answer**

> Spring Application Events implement the Observer/Publish-Subscribe pattern. A publisher fires an event using `ApplicationEventPublisher`, and any number of `@EventListener` methods react to it. This decouples the publisher from its subscribers completely.

---

## Q2. What is the benefit of events over direct method calls?

Events provide loose coupling — the publisher doesn't know about or depend on the listeners. Adding a new listener doesn't require changing the publisher. Makes code more maintainable and testable.

---

## Q3. What is @TransactionalEventListener?

A specialized `@EventListener` that fires based on the outcome of the surrounding transaction. `AFTER_COMMIT` fires only if the transaction committed successfully — preventing notifications for rolled-back transactions.

---

## Q4. How do you make event listeners asynchronous?

Add `@Async` to the listener method (and ensure `@EnableAsync` is configured). This runs the listener in a separate thread pool, not blocking the publisher.

---

## Q5. What are Spring's built-in events?

`ApplicationStartedEvent`, `ApplicationReadyEvent`, `ContextRefreshedEvent`, `ContextClosedEvent`, `ApplicationFailedEvent`. Use them for initialization, warm-up, and shutdown logic.

---

# Professional Summary

```
Spring Events:

1. Create event class (POJO or extends ApplicationEvent)
2. Publish: applicationEventPublisher.publishEvent(event)
3. Listen: @EventListener on a @Component method

Flavors:
  @EventListener         → Synchronous
  @Async @EventListener  → Asynchronous (non-blocking)
  @TransactionalEventListener(AFTER_COMMIT) → Post-commit

Built-in:
  ApplicationReadyEvent   → on startup
  ContextClosedEvent      → on shutdown

Benefits:
  Publisher knows nothing about listeners
  Add/remove listeners without touching publisher
  Perfect for cross-cutting concerns
```

---

# 🧠 Memory Trick

Events = **Radio Broadcast**

```
📻 Radio Station (Publisher)
  Broadcasts: "News at 9 PM" (publishEvent)

Listeners:
  👤 Person A tunes in → hears news (@EventListener)
  👤 Person B tunes in → hears news (@EventListener)
  👤 Person C doesn't tune in → hears nothing

Station doesn't know who is listening.
Listeners don't know who else is listening.
Pure decoupling.
```

---

# 🚀 Next Chapter

We'll dive into **Aspect-Oriented Programming (AOP)** — the power to add cross-cutting behavior like logging, security, and timing to any method without modifying it.
