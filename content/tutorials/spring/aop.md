Welcome to **Chapter 41 — Aspect-Oriented Programming (AOP)**.

> **AOP lets you add behaviors — logging, security, timing — to any method without touching that method's code. Write once, apply everywhere.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a VIP club.

At every door:

```
Security guard checks ID → ID verified → person enters
```

You don't build a security check inside each room.

You put it at the door.

Every room gets protection without any room knowing about it.

**AOP = Security guard at the door.**

Add behavior to any method without modifying it.

---

# AOP Terminology

| Term | Meaning |
| --- | --- |
| **Aspect** | The class containing cross-cutting logic |
| **Advice** | The actual code that runs (the action) |
| **Pointcut** | Expression defining which methods to intercept |
| **Join Point** | The actual method execution |
| **Weaving** | Applying aspects to target objects |

---

# Adding AOP Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

---

# Advice Types

| Advice | When it runs |
| --- | --- |
| `@Before` | Before the method |
| `@After` | After the method (always) |
| `@AfterReturning` | After method returns successfully |
| `@AfterThrowing` | After method throws exception |
| `@Around` | Before + after (most powerful) |

---

# Your First Aspect — Logging

```java
@Aspect
@Component
@Slf4j
public class LoggingAspect {

    // Before all methods in service package
    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        log.info("Calling: {}.{}",
            joinPoint.getSignature().getDeclaringTypeName(),
            joinPoint.getSignature().getName()
        );
    }

    // After method returns
    @AfterReturning(
        pointcut = "execution(* com.example.service.*.*(..))",
        returning = "result"
    )
    public void logAfter(JoinPoint joinPoint, Object result) {
        log.info("Completed: {} → {}",
            joinPoint.getSignature().getName(), result
        );
    }

    // After exception
    @AfterThrowing(
        pointcut = "execution(* com.example.service.*.*(..))",
        throwing = "exception"
    )
    public void logException(JoinPoint joinPoint, Exception exception) {
        log.error("Exception in {} → {}",
            joinPoint.getSignature().getName(), exception.getMessage()
        );
    }
}
```

---

# Pointcut Expressions

```java
// All methods in a package
"execution(* com.example.service.*.*(..))"

// All public methods in a class
"execution(public * com.example.UserService.*(..))"

// Methods starting with 'find'
"execution(* com.example.*.find*(..))"

// Methods with specific return type
"execution(java.util.List com.example.*.*(..))"

// Methods with specific parameter type
"execution(* com.example.*.*( com.example.dto.UserRequest))"

// Any method with @Transactional
"@annotation(org.springframework.transaction.annotation.Transactional)"

// Any bean with @Service
"within(@org.springframework.stereotype.Service *)"

// Named pointcut (reusable)
@Pointcut("execution(* com.example.service.*.*(..))")
private void serviceLayer() {}
```

---

# @Around — Most Powerful

```java
@Aspect
@Component
@Slf4j
public class PerformanceAspect {

    @Around("execution(* com.example.service.*.*(..))")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {

        long start = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().getName();

        try {
            Object result = joinPoint.proceed(); // Execute the actual method
            long duration = System.currentTimeMillis() - start;

            log.info("{} executed in {} ms", methodName, duration);

            if (duration > 1000) {
                log.warn("SLOW METHOD: {} took {}ms", methodName, duration);
            }

            return result;

        } catch (Exception e) {
            long duration = System.currentTimeMillis() - start;
            log.error("{} failed after {}ms: {}", methodName, duration, e.getMessage());
            throw e; // Re-throw
        }
    }
}
```

---

# Reusable Pointcuts

```java
@Aspect
@Component
public class AppAspects {

    // Define reusable pointcuts
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceLayer() {}

    @Pointcut("execution(* com.example.repository.*.*(..))")
    public void repositoryLayer() {}

    @Pointcut("@annotation(com.example.annotation.Audited)")
    public void auditedMethod() {}

    // Use pointcuts in advice
    @Before("serviceLayer()")
    public void beforeService(JoinPoint jp) { ... }

    @Before("serviceLayer() || repositoryLayer()")
    public void beforeServiceOrRepo(JoinPoint jp) { ... }

    @Around("auditedMethod()")
    public Object aroundAuditedMethod(ProceedingJoinPoint pjp) throws Throwable { ... }
}
```

---

# Custom Annotation + AOP

Create a custom annotation and apply AOP to it:

**Step 1 — Create annotation:**

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogExecutionTime {
    String value() default "";
}
```

**Step 2 — Create aspect:**

```java
@Aspect
@Component
@Slf4j
public class LogExecutionTimeAspect {

    @Around("@annotation(logExecutionTime)")
    public Object logExecutionTime(
        ProceedingJoinPoint joinPoint,
        LogExecutionTime logExecutionTime
    ) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long duration = System.currentTimeMillis() - start;

        log.info("[{}] {} executed in {}ms",
            logExecutionTime.value(),
            joinPoint.getSignature().getName(),
            duration
        );

        return result;
    }
}
```

**Step 3 — Use it:**

```java
@Service
public class ProductService {

    @LogExecutionTime("ProductService")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @LogExecutionTime("Search")
    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContaining(query);
    }
}
```

---

# Common AOP Use Cases

## 1. Security Audit

```java
@Aspect
@Component
public class SecurityAuditAspect {

    @AfterReturning("@annotation(org.springframework.security.access.prepost.PreAuthorize)")
    public void auditSecuredAccess(JoinPoint jp) {
        String user = SecurityContextHolder.getContext().getAuthentication().getName();
        String method = jp.getSignature().getName();
        auditService.log(user, "ACCESSED", method);
    }
}
```

---

## 2. Rate Limiting

```java
@Aspect
@Component
public class RateLimitAspect {

    @Around("@annotation(com.example.annotation.RateLimit)")
    public Object rateLimit(ProceedingJoinPoint pjp, RateLimit rateLimit) throws Throwable {
        String key = pjp.getSignature().toShortString();
        if (rateLimiterService.isLimitExceeded(key, rateLimit.requests(), rateLimit.seconds())) {
            throw new TooManyRequestsException("Rate limit exceeded");
        }
        return pjp.proceed();
    }
}
```

---

## 3. Retry Logic

```java
@Aspect
@Component
public class RetryAspect {

    @Around("@annotation(retry)")
    public Object retryOnFailure(ProceedingJoinPoint pjp, Retry retry) throws Throwable {
        int attempts = retry.attempts();
        int delay = retry.delayMs();
        Throwable lastException = null;

        for (int i = 0; i < attempts; i++) {
            try {
                return pjp.proceed();
            } catch (Exception e) {
                lastException = e;
                log.warn("Attempt {} failed: {}", i + 1, e.getMessage());
                Thread.sleep(delay);
            }
        }

        throw lastException;
    }
}
```

---

# Company Example — Razorpay

```java
@Aspect
@Component
@Slf4j
public class RazorpayPaymentAspect {

    // Log all payment method calls
    @Around("execution(* com.razorpay.payment.service.*.*(..))")
    public Object logPaymentOperations(ProceedingJoinPoint pjp) throws Throwable {
        String method = pjp.getSignature().getName();
        String requestId = UUID.randomUUID().toString();

        log.info("[{}] Payment operation started: {}", requestId, method);
        Instant start = Instant.now();

        try {
            Object result = pjp.proceed();
            long duration = Duration.between(start, Instant.now()).toMillis();
            log.info("[{}] {} completed in {}ms", requestId, method, duration);

            // Track success metric
            metricsService.recordSuccess("payment." + method, duration);
            return result;

        } catch (PaymentException e) {
            long duration = Duration.between(start, Instant.now()).toMillis();
            log.error("[{}] {} FAILED in {}ms: {}", requestId, method, duration, e.getMessage());

            // Track failure metric
            metricsService.recordFailure("payment." + method, e.getErrorCode());
            throw e;
        }
    }

    // Audit all admin actions
    @AfterReturning("@annotation(com.razorpay.annotation.AdminAction)")
    public void auditAdminAction(JoinPoint jp) {
        String admin = SecurityContextHolder.getContext().getAuthentication().getName();
        String action = jp.getSignature().getName();
        Object[] args = jp.getArgs();

        auditService.recordAdminAction(admin, action, args);
    }
}
```

---

# Interview Questions

## Q1. What is AOP?

**Best Answer**

> Aspect-Oriented Programming is a programming paradigm that separates cross-cutting concerns (logging, security, transactions, monitoring) from business logic. Spring AOP uses proxies to intercept method calls and execute advice code before, after, or around them.

---

## Q2. What is the difference between @Before and @Around?

`@Before` runs code before the method, but cannot control method execution (cannot prevent it or modify arguments). `@Around` wraps the entire method — can run code before and after, prevent execution, modify arguments/return values, and catch exceptions.

---

## Q3. What is a Pointcut?

An expression that selects which methods the aspect will intercept. Uses AspectJ expression language. Example: `execution(* com.example.service.*.*(..))` matches all methods in all classes in the service package.

---

## Q4. What is `ProceedingJoinPoint.proceed()`?

In `@Around` advice, `proceed()` calls the actual intercepted method. Without calling it, the method never executes. You can add code before and after this call.

---

## Q5. What is the self-invocation limitation in Spring AOP?

Spring AOP works via proxy. If a method in the same class calls another method in the same class directly, the call bypasses the proxy, so AOP advice won't apply. Use separate beans or AspectJ weaving to avoid this.

---

# Professional Summary

```
AOP in Spring:

@Aspect + @Component = Aspect class

Advice types:
  @Before         → runs before method
  @After          → runs after (always)
  @AfterReturning → on success
  @AfterThrowing  → on exception
  @Around         → full control (most used)

Pointcut:
  execution(* com.example.service.*.*(..))
  @annotation(MyAnnotation)
  within(@Service *)

Common uses:
  Logging method calls and execution time
  Security audit trail
  Retry logic
  Rate limiting
  Transaction management (@Transactional uses AOP!)
```

---

# 🧠 Memory Trick

AOP = **Hotel CCTV System**

```
🏨 Hotel CCTV (AOP)

Every room has a camera (Pointcut)
Camera records before entry (@Before)
Camera records on exit (@After)
Security watches everything (Aspect)

Hotels don't put security guards inside every room.
They put cameras everywhere → centralized monitoring.

AOP = Put logic once → applies everywhere.
```

---

# 🚀 Next Chapter

We'll learn **File Upload & Download** — how to handle multipart file uploads and serve files from Spring Boot.
