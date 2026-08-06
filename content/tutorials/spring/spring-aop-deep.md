Team Meeting था।

CTO ने कहा:

> "हर API Call में Logging चाहिए।"

Developer ने हाँ किया।

> "हर Payment Method में Transaction चाहिए।"

Developer ने हाँ किया।

> "हर Sensitive Endpoint पर Security Check चाहिए।"

Developer ने हाँ किया।

---

Developer ने Code खोला।

500 Methods थे।

उसे हर Method में यह लिखना था:

```java
public void processPayment() {
    log.info("Method started: processPayment");  // Logging
    checkAuth();                                  // Security
    Transaction tx = beginTransaction();          // Transaction

    // Business Logic (5 lines)
    payment.process();

    tx.commit();                                  // Transaction
    log.info("Method ended: processPayment");    // Logging
}
```

Business Logic = 5 lines।

Boilerplate = 6 lines।

500 Methods × 6 lines = 3000 lines of boilerplate।

---

Developer ने पूछा:

> **"क्या इसका कोई बेहतर तरीका है?"**

यहीं से **AOP** का जन्म हुआ।

---

# Chapter 30 – Spring AOP (Aspect-Oriented Programming)

---

# AOP की जरूरत क्यों पड़ी?

हमने OOP सीखा।

OOP में हम Code को Classes में organize करते हैं।

लेकिन कुछ Concerns ऐसे होते हैं जो **हर Class को छूते हैं।**

इन्हें कहते हैं:

```text
Cross-Cutting Concerns
```

---

## Cross-Cutting Concerns Examples

```text
✅ Logging        → हर Method में
✅ Security       → हर Protected Method में
✅ Transaction    → हर DB Operation में
✅ Caching        → कुछ Methods में
✅ Exception Handling → हर Method में
✅ Performance Monitoring → हर Method में
✅ Rate Limiting  → हर API में
```

---

## OOP में Problem

OOP में तुम इन्हें Separate नहीं कर सकते।

```java
class PaymentService {
    void processPayment() {
        // Logging यहाँ
        // Security यहाँ
        // Transaction यहाँ
        // Business Logic यहाँ
        // Logging यहाँ
    }
}

class OrderService {
    void createOrder() {
        // Logging यहाँ (duplicate!)
        // Security यहाँ (duplicate!)
        // Transaction यहाँ (duplicate!)
        // Business Logic यहाँ
        // Logging यहाँ (duplicate!)
    }
}
```

Business Logic और Boilerplate Mix हो गए।

---

# AOP का Solution

```text
AOP = "यह Code अलग रखो।
       Spring खुद सही जगह लगाएगा।"
```

---

## AOP का Idea

```java
// ❌ पहले — Business Code में Logging
public void processPayment() {
    log.info("Started");
    payment.process();
    log.info("Ended");
}

// ✅ AOP के बाद — सिर्फ Business Code
public void processPayment() {
    payment.process();
}

// Logging अलग Class में
@Aspect
class LoggingAspect {
    // सभी Methods पर automatic Logging
}
```

---

# AOP की Vocabulary

AOP में कुछ नए शब्द हैं।

---

## 1. Aspect

```text
Aspect = Cross-Cutting Concern की Class

उदाहरण:
  LoggingAspect
  SecurityAspect
  TransactionAspect
```

---

## 2. Advice

```text
Advice = Aspect का Code जो चलेगा

Types:
  @Before    → Method से पहले
  @After     → Method के बाद (हमेशा)
  @AfterReturning → Method Normal Return के बाद
  @AfterThrowing  → Method Exception Throw करे तो
  @Around    → Method को Wrap करो (सबसे Powerful)
```

---

## 3. JoinPoint

```text
JoinPoint = वह Point जहाँ Aspect Apply हो सकता है

Spring में:
  हर Method Call एक JoinPoint है।
```

---

## 4. Pointcut

```text
Pointcut = JoinPoints का Selection Expression

"किन Methods पर Aspect Apply होगा?"

उदाहरण:
  "सभी Service Methods"
  "Payment Package के Methods"
  "@Transactional Annotation वाले Methods"
```

---

## 5. Weaving

```text
Weaving = Aspect को Target Class से जोड़ना

Spring में: Runtime Weaving (Proxy से)
AspectJ में: Compile Time / Load Time भी
```

---

# Real Example – Logging Aspect

```java
@Aspect
@Component
class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    // सभी Service Layer के Methods पर
    @Before("execution(* com.payflow.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        log.info("Method called: {}", joinPoint.getSignature().getName());
        log.info("Arguments: {}", Arrays.toString(joinPoint.getArgs()));
    }

    @After("execution(* com.payflow.service.*.*(..))")
    public void logAfter(JoinPoint joinPoint) {
        log.info("Method completed: {}", joinPoint.getSignature().getName());
    }
}
```

---

## Pointcut Expression समझो

```java
"execution(* com.payflow.service.*.*(..))"
   ↑           ↑            ↑ ↑   ↑
   |           |            | |   └── कोई भी Arguments
   |           |            | └── कोई भी Method
   |           |            └── कोई भी Class
   |           └── com.payflow.service Package
   └── Return Type (* = कोई भी)
```

---

# @Around Advice – सबसे Powerful ⭐⭐⭐

```java
@Aspect
@Component
class PerformanceAspect {

    @Around("execution(* com.payflow.service.*.*(..))")
    public Object measureTime(ProceedingJoinPoint pjp) throws Throwable {

        long start = System.currentTimeMillis();

        try {
            // Original Method चलाओ
            Object result = pjp.proceed();

            long end = System.currentTimeMillis();
            log.info("{} took {}ms",
                pjp.getSignature().getName(),
                (end - start));

            return result;

        } catch (Exception e) {
            log.error("Exception in {}: {}",
                pjp.getSignature().getName(), e.getMessage());
            throw e;
        }
    }
}
```

---

## @Around का Flow

```text
@Around Method शुरू
      ↓
pjp.proceed() से पहले का Code  (like @Before)
      ↓
pjp.proceed()  ← Original Method यहाँ चलता है
      ↓
पजp.proceed() के बाद का Code  (like @After)
      ↓
Result Return
```

---

# Real Project Examples

---

## Example 1 – Security Aspect

```java
@Aspect
@Component
class SecurityAspect {

    @Before("@annotation(requiresAdmin)")
    public void checkAdmin(JoinPoint jp, RequiresAdmin requiresAdmin) {
        User currentUser = SecurityContext.getUser();
        if (!currentUser.isAdmin()) {
            throw new AccessDeniedException("Admin access required");
        }
    }
}

// Custom Annotation
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresAdmin { }

// Use करना
@Service
class AdminService {

    @RequiresAdmin  // ← Aspect automatically check करेगा
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
```

---

## Example 2 – Retry Aspect

```java
@Aspect
@Component
class RetryAspect {

    @Around("@annotation(retryable)")
    public Object retry(ProceedingJoinPoint pjp, Retryable retryable) throws Throwable {

        int maxAttempts = retryable.maxAttempts();
        int attempts = 0;

        while (attempts < maxAttempts) {
            try {
                return pjp.proceed();
            } catch (Exception e) {
                attempts++;
                if (attempts >= maxAttempts) throw e;
                Thread.sleep(1000 * attempts);  // Exponential Backoff
                log.warn("Retry {} of {}", attempts, maxAttempts);
            }
        }
        throw new RuntimeException("Max retries exceeded");
    }
}

// Use
@Service
class PaymentService {

    @Retryable(maxAttempts = 3)
    public void callPaymentGateway() {
        // Network call जो fail हो सकती है
    }
}
```

---

## Example 3 – Audit Aspect

```java
@Aspect
@Component
class AuditAspect {

    @Autowired
    AuditRepository auditRepo;

    @AfterReturning(
        pointcut = "@annotation(auditable)",
        returning = "result"
    )
    public void audit(JoinPoint jp, Auditable auditable, Object result) {

        AuditLog log = AuditLog.builder()
            .method(jp.getSignature().getName())
            .user(SecurityContext.getCurrentUser())
            .action(auditable.action())
            .timestamp(LocalDateTime.now())
            .result(result.toString())
            .build();

        auditRepo.save(log);
    }
}
```

---

# Pointcut Expressions

```java
// सभी Methods — सभी Packages
execution(* *(..))

// एक Package के सभी Methods
execution(* com.payflow.service.*.*(..))

// एक Class के सभी Methods
execution(* com.payflow.service.PaymentService.*(..))

// एक Annotation वाले Methods
@annotation(org.springframework.transaction.annotation.Transactional)

// एक Annotation वाली Classes के Methods
@within(org.springframework.stereotype.Service)

// Method का पहला Argument Long हो
execution(* *(Long, ..))

// Method का नाम "find" से शुरू हो
execution(* find*(..))
```

---

# Pointcut Combine करना

```java
@Aspect
@Component
class MyAspect {

    // Reusable Pointcut Define करो
    @Pointcut("execution(* com.payflow.service.*.*(..))")
    private void serviceLayer() {}

    @Pointcut("execution(* com.payflow.repository.*.*(..))")
    private void repositoryLayer() {}

    // Use करो
    @Before("serviceLayer()")
    public void beforeService() { }

    @Before("serviceLayer() || repositoryLayer()")
    public void beforeServiceOrRepo() { }

    @Before("serviceLayer() && !repositoryLayer()")
    public void onlyService() { }
}
```

---

# AOP का Full Flow (Internal)

```text
1. @Aspect Class Spring ने Scan की
         ↓
2. BeanPostProcessor (AbstractAutoProxyCreator) ने देखा:
   "PaymentService पर कोई Aspect Apply होता है?"
         ↓
3. हाँ → PaymentService का Proxy बनाया
   (JDK Proxy या CGLIB — अगले Chapter में)
         ↓
4. Proxy Container में Store हुई
         ↓
5. तुम्हें Proxy मिलती है
         ↓
6. तुमने paymentService.process() call किया
         ↓
7. Proxy ने Aspect Code चलाया (Before)
         ↓
8. Proxy ने Original Method call किया
         ↓
9. Proxy ने Aspect Code चलाया (After)
         ↓
10. Result Return
```

---

# Interview Questions

---

## Q1. AOP क्या है और Spring में इसकी ज़रूरत क्यों है?

**Answer:**

AOP (Aspect Oriented Programming) Cross-Cutting Concerns को Business Logic से अलग रखने का तरीका है।

Cross-Cutting Concerns जैसे Logging, Security, Transaction हर Class को affect करते हैं।

AOP से:
- Business Code Clean रहता है
- Boilerplate Code नहीं
- Separation of Concerns

---

## Q2. @Before, @After, @Around में क्या अंतर है?

**Answer:**

```text
@Before          → Method से पहले
@After           → Method के बाद (Exception हो तब भी)
@AfterReturning  → Method Normal Return के बाद (Exception नहीं)
@AfterThrowing   → Method Exception Throw करे तब
@Around          → Method Wrap करता है — सबसे Powerful
                   pjp.proceed() से Method call करता है
```

---

## Q3. AOP Proxy कब बनती है?

**Answer:**

`AbstractAutoProxyCreator` (BeanPostProcessor) Bean बनने के बाद check करता है।

अगर कोई Aspect उस Bean पर Apply होता है → Proxy बनाता है।

Container में Original की जगह Proxy Store होती है।

---

## Q4. @Transactional AOP से कैसे काम करता है?

**Answer:**

`@Transactional` Spring का built-in Aspect है।

`TransactionInterceptor` एक Advice है।

`@Around` की तरह:
1. Transaction Begin
2. Method चलाओ (pjp.proceed())
3. Success → Commit
4. Exception → Rollback

---

## Q5. AOP की Limitations क्या हैं?

**Answer:**

```text
1. Self-Invocation Problem:
   PaymentService के अंदर से अपना Method call → Proxy bypass!

2. Final Classes:
   CGLIB Proxy Final Class को Subclass नहीं कर सकती

3. Private Methods:
   Private Methods पर AOP Apply नहीं होती

4. Compile-Time:
   Spring AOP Runtime है — AspectJ Full AOP है
```

---

## Self-Invocation Problem (Important!)

```java
@Service
class PaymentService {

    @Transactional
    public void processPayment() {
        sendReceipt();  // ❌ Proxy Bypass! Transaction नहीं होगा
    }

    @Transactional
    public void sendReceipt() {
        // Transaction expected but NOT applied!
    }
}

// Solution: खुद को inject करो (hacky)
@Service
class PaymentService {

    @Autowired
    @Lazy
    PaymentService self;  // Self-injection

    public void processPayment() {
        self.sendReceipt();  // ✅ Proxy से जाएगा
    }
}
```

---

# Best Practices

---

## 1. @Around Use करो Performance/Logging के लिए

```java
@Around("serviceLayer()")
public Object logAndTime(ProceedingJoinPoint pjp) throws Throwable {
    // Logging + Timing एक ही Aspect में
}
```

---

## 2. @AfterThrowing से Exception Monitor करो

```java
@AfterThrowing(pointcut = "serviceLayer()", throwing = "ex")
public void logException(JoinPoint jp, Exception ex) {
    alertService.sendAlert(jp.getSignature().getName(), ex);
}
```

---

## 3. Custom Annotations Use करो Pointcut के लिए

```java
// Specific Methods Mark करो — सभी Service Methods नहीं
@Auditable(action = "USER_LOGIN")
public void login(String username) { }
```

---

# Common Mistakes

---

## Mistake 1 — Private Methods पर @Transactional

```java
// ❌ काम नहीं करेगा
@Service
class UserService {

    @Transactional
    private void saveUser(User user) {  // Private!
        // Transaction WILL NOT apply
    }
}
```

---

## Mistake 2 — Same Class Self Invocation

```java
// ❌ Proxy Bypass
@Service
class OrderService {

    public void placeOrder() {
        validateOrder();  // @Transactional नहीं चलेगा
    }

    @Transactional
    public void validateOrder() {
        // AOP here? NO!
    }
}
```

---

# इस Chapter का निष्कर्ष

```text
AOP = Cross-Cutting Concerns को अलग करो

Aspect    → Concern की Class (LoggingAspect)
Advice    → Code जो चलेगा (@Before, @After, @Around)
Pointcut  → कहाँ Apply करना है (Expression)
JoinPoint → हर Method = Potential JoinPoint

Spring AOP:
  Runtime → Proxy Based
  Method Level Only
  @Aspect + @Component लगाओ
```

---

### अगला Chapter

AOP में Proxy का बार-बार ज़िक्र हुआ।

> **"Proxy क्या है?"**
> **"Spring Direct Object क्यों नहीं देता?"**
> **"JDK Proxy और CGLIB में क्या फर्क है?"**

अगला Chapter: **Spring Proxy – JDK vs CGLIB**
