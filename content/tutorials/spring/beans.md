Welcome to **Chapter 8 — Spring Beans**.

> **A Bean is an object managed by the Spring container. Everything in Spring is a bean. Understanding beans means understanding Spring.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a toy factory.

The factory has machines.

When you start the factory:

```
Machine 1: Coffee Maker   → Ready
Machine 2: Toaster        → Ready
Machine 3: Blender        → Ready
```

All machines are created and ready.

When you need coffee → use Machine 1.

You don't build a new coffee maker every time.

**Spring Beans are those machines.**

Created once. Ready to use whenever needed.

---

# What is a Spring Bean?

A **Bean** is any Java object managed by the Spring IoC container.

Spring:
```
1. Creates the bean
2. Injects its dependencies
3. Manages its lifecycle
4. Destroys it when done
```

---

# How to Define a Bean

## Method 1 — @Component (and stereotypes)

```java
@Component
public class EmailValidator { }

@Service
public class UserService { }

@Repository
public interface UserRepository extends JpaRepository<User, Long> { }
```

---

## Method 2 — @Bean in @Configuration

```java
@Configuration
public class AppConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

Use `@Bean` when:
- You can't add annotations to the class (third-party library)
- You need custom initialization

---

# Bean Scopes

Scope determines how many instances are created.

| Scope | Description |
| --- | --- |
| `singleton` | One instance per Spring context (default) |
| `prototype` | New instance every time requested |
| `request` | One instance per HTTP request (web) |
| `session` | One instance per HTTP session (web) |
| `application` | One instance per ServletContext |

---

## Singleton (Default)

```java
@Service // singleton by default
public class UserService {
    // Created once, reused everywhere
}
```

---

## Prototype

```java
@Scope("prototype")
@Component
public class ReportGenerator {
    // New instance created every time
}
```

---

## Request Scope

```java
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Component
public class RequestContext {
    private String requestId;
    // New instance per HTTP request
}
```

---

# Bean Lifecycle

```
Spring Container Starts
        ↓
Bean Instantiation (constructor)
        ↓
Dependency Injection
        ↓
@PostConstruct (initialization)
        ↓
Bean is Ready for Use
        ↓
(Application runs)
        ↓
@PreDestroy (cleanup)
        ↓
Bean Destroyed
        ↓
Spring Container Shuts Down
```

---

# @PostConstruct and @PreDestroy

```java
@Service
public class CacheService {

    private Map<String, Object> cache;

    @PostConstruct
    public void init() {
        // Called after dependency injection
        cache = new HashMap<>();
        System.out.println("CacheService initialized");
    }

    @PreDestroy
    public void cleanup() {
        // Called before bean is destroyed
        cache.clear();
        System.out.println("CacheService cleaned up");
    }
}
```

---

# InitializingBean and DisposableBean

Older approach (avoid in new code):

```java
@Service
public class DataService implements InitializingBean, DisposableBean {

    @Override
    public void afterPropertiesSet() throws Exception {
        // Same as @PostConstruct
    }

    @Override
    public void destroy() throws Exception {
        // Same as @PreDestroy
    }
}
```

---

# @Bean with init and destroy

```java
@Configuration
public class AppConfig {

    @Bean(initMethod = "init", destroyMethod = "cleanup")
    public DataSource dataSource() {
        return new CustomDataSource();
    }
}
```

---

# Lazy Initialization

By default, singleton beans are created at startup.

With `@Lazy`, beans are created on first use:

```java
@Lazy
@Service
public class HeavyService {
    // Not created at startup
    // Created when first @Autowired call happens
}
```

Or globally in `application.properties`:

```properties
spring.main.lazy-initialization=true
```

---

# BeanFactory vs ApplicationContext

| Feature | BeanFactory | ApplicationContext |
| --- | --- | --- |
| Basic DI | ✅ | ✅ |
| Event publishing | ❌ | ✅ |
| i18n support | ❌ | ✅ |
| AOP integration | Limited | ✅ |
| Auto configuration | ❌ | ✅ |
| Recommended | ❌ (legacy) | ✅ Always use this |

---

# Accessing Beans Programmatically

```java
@Component
public class BeanAccessExample implements ApplicationContextAware {

    private ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext context) {
        this.context = context;
    }

    public void doSomething() {
        UserService service = context.getBean(UserService.class);
        // use it
    }
}
```

Or via injection directly — preferred:

```java
@Autowired
private ApplicationContext context;
```

---

# Company Example — Amazon

Amazon's product recommendation engine:

```java
@Service // singleton — one instance, shared across all requests
public class RecommendationEngine {

    private final Map<String, List<Product>> cache = new ConcurrentHashMap<>();

    @PostConstruct
    public void warmUpCache() {
        // Load popular recommendations into memory at startup
        System.out.println("Warming up recommendation cache...");
        // Loads thousands of pre-computed recommendations
    }

    public List<Product> getRecommendations(String userId) {
        return cache.getOrDefault(userId, Collections.emptyList());
    }

    @PreDestroy
    public void persistCache() {
        // Save cache to Redis before shutdown
        System.out.println("Persisting recommendation cache...");
    }
}
```

One instance — serves all users.
Loads on startup. Cleans up on shutdown.

---

# Interview Questions

## Q1. What is a Spring Bean?

**Best Answer**

> A Spring Bean is any Java object that is created, configured, and managed by the Spring IoC container. Beans are defined using `@Component` (and stereotypes) or `@Bean` in configuration classes.

---

## Q2. What is the default scope of a Spring Bean?

**Singleton** — one instance per Spring ApplicationContext, shared across all injection points.

---

## Q3. What is the difference between Singleton and Prototype scope?

Singleton creates one instance for the entire application context. Prototype creates a new instance every time the bean is requested.

---

## Q4. What is `@PostConstruct`?

An annotation on a method that Spring calls after the bean is created and all dependencies are injected. Used for initialization tasks.

---

## Q5. What is `@PreDestroy`?

An annotation on a method that Spring calls just before the bean is destroyed (when the application shuts down). Used for cleanup tasks like closing connections.

---

# Professional Summary

```
Bean = Object managed by Spring

Define with:
  @Component / @Service / @Repository
  @Bean in @Configuration class

Scopes:
  singleton  → 1 instance (default)
  prototype  → new instance each time
  request    → per HTTP request
  session    → per HTTP session

Lifecycle:
  Create → Inject → @PostConstruct → Use → @PreDestroy → Destroy
```

---

# 🧠 Memory Trick

Beans are like **employees** in a company:

```
🏢 Company (Spring Container)

Hired once (singleton)
Ready to work anytime
Given their tools (DI)
Called to work (method calls)
Retired on company shutdown (@PreDestroy)
```

---

# 🚀 Next Chapter

We'll master **@Autowired** — how Spring decides which bean to inject and how to handle ambiguity.
