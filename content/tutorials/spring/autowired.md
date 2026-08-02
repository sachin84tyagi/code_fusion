Welcome to **Chapter 9 — @Autowired & Injection Types**.

> **@Autowired is how Spring connects the dots between your classes. Get this right and dependency injection becomes effortless.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

You are building a robot.

The robot needs:

```
🦾 Arms
👁️ Eyes
🧠 Brain
```

You say: "I need arms, eyes, and brain."

A supplier delivers everything.

You just plug them in.

```java
@Autowired
private Arms arms;

@Autowired
private Eyes eyes;

@Autowired
private Brain brain;
```

`@Autowired` = "Plug in whatever I need."

---

# What is @Autowired?

`@Autowired` tells Spring:

> "Find the matching bean in the container and inject it here."

```java
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    // Spring finds the bean of type OrderRepository and injects it
}
```

---

# How Spring Resolves @Autowired

```
1. Spring looks for a bean matching the type
2. If found one → inject it
3. If found multiple → look for @Primary or @Qualifier
4. If none found → throw NoSuchBeanDefinitionException
```

---

# Three Injection Types

## 1. Field Injection

```java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;
}
```

**Pros:** Simple, less code

**Cons:**
- Hard to unit test
- Fields are not `final`
- Hides dependencies

---

## 2. Constructor Injection (✅ Recommended)

```java
@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    // @Autowired is optional here if there's only one constructor (Spring 4.3+)
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
}
```

**Pros:**
- Dependencies are `final` (immutable)
- Explicit and clear
- Easy to unit test without Spring context
- Detected early if a required bean is missing

---

## 3. Setter Injection

```java
@Service
public class NotificationService {

    private EmailService emailService;

    @Autowired
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
}
```

**Use case:** Optional dependencies that can be changed after creation.

---

# @Qualifier — Resolve Ambiguity

When multiple beans of same type exist:

```java
public interface MessageSender {
    void send(String message);
}

@Service("emailSender")
public class EmailSender implements MessageSender {
    public void send(String message) { /* email */ }
}

@Service("smsSender")
public class SmsSender implements MessageSender {
    public void send(String message) { /* sms */ }
}
```

Without `@Qualifier`:

```
NoUniqueBeanDefinitionException: expected single matching bean but found 2
```

With `@Qualifier`:

```java
@Service
public class NotificationService {

    @Autowired
    @Qualifier("emailSender")
    private MessageSender messageSender;
}
```

---

# @Primary — Default Bean

Mark one bean as the default:

```java
@Primary
@Service("emailSender")
public class EmailSender implements MessageSender { }

@Service("smsSender")
public class SmsSender implements MessageSender { }
```

Now without `@Qualifier`, Spring injects `EmailSender`.

---

# required = false

By default, `@Autowired` fails if no bean is found.

Make optional:

```java
@Autowired(required = false)
private CacheService cacheService; // OK if not available
```

---

# @Autowired on Collections

Inject all beans of a type:

```java
public interface Plugin {
    void execute();
}

@Component
public class LogPlugin implements Plugin { ... }

@Component
public class MetricsPlugin implements Plugin { ... }

@Service
public class PluginRunner {

    @Autowired
    private List<Plugin> plugins; // All Plugin beans injected

    public void runAll() {
        plugins.forEach(Plugin::execute);
    }
}
```

---

# Lombok + Constructor Injection

With Lombok, constructor injection is even cleaner:

```java
@Service
@RequiredArgsConstructor // Lombok generates constructor for final fields
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtService jwtService;

    // No need to write constructor manually!
}
```

`@RequiredArgsConstructor` generates a constructor for all `final` fields.

Spring automatically uses it for injection.

---

# Company Example — Google Pay

Google Pay notification system:

```java
// Interface
public interface NotificationChannel {
    void notify(String userId, String message);
}

// Multiple implementations
@Service("push")
public class PushNotification implements NotificationChannel { ... }

@Service("email")
public class EmailNotification implements NotificationChannel { ... }

@Service("sms")
public class SmsNotification implements NotificationChannel { ... }

// Service injects ALL channels
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final List<NotificationChannel> channels;
    // Spring injects all 3: push, email, sms

    public void notifyAll(String userId, String message) {
        channels.forEach(ch -> ch.notify(userId, message));
    }
}
```

---

# Interview Questions

## Q1. What is @Autowired in Spring?

**Best Answer**

> `@Autowired` is Spring's annotation for automatic dependency injection. It tells the Spring container to find a matching bean by type and inject it into the annotated field, constructor, or setter method.

---

## Q2. Which injection type is recommended and why?

Constructor injection is recommended because it makes dependencies explicit, supports immutability (`final` fields), makes the class easier to unit test without Spring context, and ensures the bean is fully initialized.

---

## Q3. What happens when multiple beans of the same type exist?

Spring throws `NoUniqueBeanDefinitionException`. Resolve it with `@Qualifier` (to specify which bean) or `@Primary` (to designate a default bean).

---

## Q4. What is the difference between @Primary and @Qualifier?

`@Primary` marks one bean as the default candidate when multiple beans match. `@Qualifier` is used at the injection point to specify exactly which bean to inject by name.

---

## Q5. What is `@RequiredArgsConstructor` from Lombok?

A Lombok annotation that generates a constructor for all `final` and `@NonNull` fields. Combined with Spring's constructor injection, it eliminates boilerplate constructor code entirely.

---

# Professional Summary

```
@Autowired

  Field:        Quick but not recommended
  Constructor:  ✅ Best practice
  Setter:       For optional dependencies

Ambiguity:
  @Qualifier("beanName") → inject specific bean
  @Primary              → default bean

Multiple beans:
  @Autowired List<Interface> → inject all implementations

Lombok shortcut:
  @RequiredArgsConstructor → auto-generates constructor
```

---

# 🧠 Memory Trick

Think of `@Autowired` as **online delivery**:

```
🛒 Order placed (@Autowired)

Spring checks warehouse (ApplicationContext)

Finds matching product (bean by type)

Delivers to your door (injects into field/constructor)

If multiple similar products → specify brand (@Qualifier)
If you always prefer one brand → @Primary
```

---

# 🚀 Next Chapter

We'll learn **@Configuration & @Bean** — how to define beans manually for third-party libraries and advanced configurations.
