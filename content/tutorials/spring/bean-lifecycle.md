नया Developer था — **Arjun**।

उसने एक Spring Project Join किया।

पहले दिन उसने एक Bean देखी।

```java
@Service
class PaymentService {

    @PostConstruct
    public void init() {
        System.out.println("Payment Service Ready!");
    }
}
```

उसने पूछा:

> "यह `@PostConstruct` कब चलता है?"

Senior Developer ने कहा:

> "Bean के Lifecycle में।"

Arjun ने पूछा:

> "Lifecycle मतलब?"

Senior Developer ने Whiteboard उठाया।

---

# Chapter 28 – Bean Lifecycle

---

## एक सवाल से शुरू करते हैं

तुम घर बनाते हो।

क्या घर एक दिन में तैयार होता है?

नहीं।

```text
Phase 1: नींव खोदो
Phase 2: Pillars खड़े करो
Phase 3: दीवारें बनाओ
Phase 4: छत डालो
Phase 5: Plastering
Phase 6: Painting
Phase 7: Furniture
Phase 8: Ready to Live In
```

Spring Bean भी ऐसे ही बनती है।

Step by Step।

---

# पूरा Bean Lifecycle

```text
┌─────────────────────────────────────────────┐
│         BEAN LIFECYCLE (पूरा Flow)          │
├─────────────────────────────────────────────┤
│                                             │
│  1. BeanDefinition Load                     │
│     (@Component Scan)                       │
│           ↓                                 │
│  2. BeanFactoryPostProcessor                │
│     (BeanDefinition Modify)                 │
│           ↓                                 │
│  3. Bean Instantiation                      │
│     (Constructor Call)                      │
│           ↓                                 │
│  4. Dependency Injection                    │
│     (@Autowired Fields Set)                 │
│           ↓                                 │
│  5. Aware Interface Callbacks               │
│     (BeanNameAware, ApplicationContextAware)│
│           ↓                                 │
│  6. BeanPostProcessor – Before Init         │
│           ↓                                 │
│  7. @PostConstruct                          │
│           ↓                                 │
│  8. InitializingBean.afterPropertiesSet()   │
│           ↓                                 │
│  9. Custom init-method                      │
│           ↓                                 │
│  10. BeanPostProcessor – After Init         │
│      (AOP Proxy यहाँ बनता है)               │
│           ↓                                 │
│  11. ✅ BEAN READY (Application Use करती है) │
│           ↓                                 │
│  ─ ─ ─ Application चलती है ─ ─ ─           │
│           ↓                                 │
│  12. @PreDestroy                            │
│           ↓                                 │
│  13. DisposableBean.destroy()               │
│           ↓                                 │
│  14. Custom destroy-method                  │
│           ↓                                 │
│  15. ❌ BEAN DESTROYED                      │
│                                             │
└─────────────────────────────────────────────┘
```

---

# Phase 1 – BeanDefinition Load

हम यह पहले पढ़ चुके हैं।

`@Component` Scan होता है।

BeanDefinition बनती है (Blueprint)।

Registry में Store होती है।

---

# Phase 2 – BeanFactoryPostProcessor

BeanDefinitions बन गईं।

लेकिन अभी Beans नहीं बनीं।

इस वक्त BeanFactoryPostProcessor run होता है।

```java
@Component
public class MyBFPP implements BeanFactoryPostProcessor {
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory bf) {
        // BeanDefinitions में बदलाव करो
        System.out.println("Before any bean is created!");
    }
}
```

---

# Phase 3 – Bean Instantiation (Constructor Call)

अब Java का `new` चलता है।

Reflection से Constructor Call।

```java
// Spring अंदर से:
Constructor<?> ctor = PaymentService.class.getDeclaredConstructor();
Object bean = ctor.newInstance();
```

**इस वक्त:**

* Object बना।
* Fields null हैं।
* `@Autowired` नहीं हुआ।

---

## Real Example देखो

```java
@Service
class PaymentService {

    @Autowired
    private EmailService emailService;

    public PaymentService() {
        System.out.println("Constructor called");
        System.out.println("emailService = " + emailService);  // null!
    }
}
```

Output:

```text
Constructor called
emailService = null
```

Constructor में `@Autowired` नहीं होता।

---

# Phase 4 – Dependency Injection

Object बन गया।

अब `@Autowired` Fields Set होती हैं।

```java
Field field = PaymentService.class.getDeclaredField("emailService");
field.setAccessible(true);
field.set(paymentServiceBean, emailServiceBean);
```

अब `emailService` **null नहीं** है।

---

# Phase 5 – Aware Interface Callbacks

Spring कुछ Special Interfaces देता है।

Bean इन्हें Implement करे, तो Spring उसे कुछ Extra दे देता है।

---

## BeanNameAware

```java
@Service
class PaymentService implements BeanNameAware {

    private String beanName;

    @Override
    public void setBeanName(String name) {
        this.beanName = name;  // "paymentService" मिलेगा
        System.out.println("My Bean Name: " + name);
    }
}
```

---

## ApplicationContextAware

```java
@Service
class PaymentService implements ApplicationContextAware {

    private ApplicationContext ctx;

    @Override
    public void setApplicationContext(ApplicationContext ctx) {
        this.ctx = ctx;  // पूरा Container मिल गया
    }
}
```

---

## Aware Interfaces का Order

```text
BeanNameAware.setBeanName()
BeanClassLoaderAware.setBeanClassLoader()
BeanFactoryAware.setBeanFactory()
EnvironmentAware.setEnvironment()
ApplicationContextAware.setApplicationContext()
```

---

# Phase 6 – BeanPostProcessor (Before Initialization)

```java
public interface BeanPostProcessor {
    Object postProcessBeforeInitialization(Object bean, String beanName);
}
```

यह Bean के `@PostConstruct` से **पहले** चलता है।

```java
@Component
class LoggingBPP implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String name) {
        System.out.println("Before init: " + name);
        return bean;  // Bean return करो (modify भी कर सकते हो)
    }
}
```

---

# Phase 7 – @PostConstruct ⭐

यह सबसे Popular Lifecycle Method है।

```java
@Service
class DatabaseService {

    @Autowired
    private DataSource dataSource;

    private Connection connection;

    @PostConstruct
    public void initialize() {
        // Dependencies Available हैं (Phase 4 हो चुका)
        connection = dataSource.getConnection();
        System.out.println("Database Connection Ready!");
    }
}
```

**यह कब चलता है:**

> Dependencies Inject होने के बाद।
> Bean Use होने से पहले।

---

## @PostConstruct का Real Use Case

```java
@Service
class CacheService {

    @Autowired
    private CacheRepository cacheRepo;

    private Map<String, Object> localCache;

    @PostConstruct
    public void loadCache() {
        // Application Start पर Cache Load करो
        localCache = cacheRepo.loadAll();
        System.out.println("Cache loaded: " + localCache.size() + " entries");
    }
}
```

---

## @PostConstruct में क्या नहीं करना?

```java
// ❌ गलत — बहुत Heavy काम
@PostConstruct
public void loadMillionRecords() {
    // 10 लाख Records Load → Application Start बहुत Slow!
}

// ✅ बेहतर
@EventListener(ApplicationReadyEvent.class)
public void loadAfterReady() {
    // Application Ready होने के बाद
}
```

---

# Phase 8 – InitializingBean

```java
@Service
class PaymentService implements InitializingBean {

    @Autowired
    private PaymentGateway gateway;

    @Override
    public void afterPropertiesSet() throws Exception {
        // @PostConstruct के बाद चलता है
        gateway.validateConfig();
        System.out.println("Payment Gateway Validated!");
    }
}
```

---

## @PostConstruct vs InitializingBean

```text
┌──────────────────────────────────────────────────────┐
│                   │ @PostConstruct  │ InitializingBean │
├──────────────────────────────────────────────────────┤
│ Type              │ Annotation      │ Interface        │
│ Spring Dependency │ No (JSR-250)    │ Yes              │
│ Method Name       │ Any             │ afterPropertiesSet│
│ Order             │ First           │ Second           │
│ Recommended       │ ✅ Yes          │ Only if needed   │
└──────────────────────────────────────────────────────┘
```

---

# Phase 9 – Custom init-method

XML या Java Config में:

```java
@Bean(initMethod = "customInit")
public PaymentService paymentService() {
    return new PaymentService();
}
```

```java
class PaymentService {

    public void customInit() {
        // InitializingBean के बाद चलता है
        System.out.println("Custom Init Method!");
    }
}
```

---

# Phase 10 – BeanPostProcessor (After Initialization) ⭐⭐⭐

यह सबसे Powerful Phase है।

```java
public interface BeanPostProcessor {
    Object postProcessAfterInitialization(Object bean, String beanName);
}
```

**यहाँ AOP Proxy बनता है।**

---

## AOP Proxy क्या होता है?

```java
@Service
class PaymentService {

    @Transactional  // Transaction Management चाहिए
    public void processPayment() {
        // Business Logic
    }
}
```

Spring ने सोचा:

> "PaymentService पर `@Transactional` है।
> इसे Original Object की जगह Proxy से Replace करना होगा।"

```text
AfterInitialization में:
  Original PaymentService Object बना था
       ↓
  AbstractAutoProxyCreator ने देखा: @Transactional है
       ↓
  PaymentService का Proxy बनाया
       ↓
  Original की जगह Proxy Container में Store हुआ
       ↓
  तुम्हें Proxy मिलती है, Original नहीं
```

---

# Phase 11 – BEAN READY ✅

```text
Started Application in 2.345 seconds
```

अब तुम्हारा Code:

```java
@Autowired
PaymentService paymentService;
```

`paymentService` → Actually एक Proxy है।

Proxy की पीछे Real Object है।

---

# DESTROY PHASE

Application बंद होती है।

`ctx.close()` या `Ctrl+C`।

---

# Phase 12 – @PreDestroy ⭐

```java
@Service
class DatabaseService {

    private Connection connection;

    @PostConstruct
    public void init() {
        connection = dataSource.getConnection();
    }

    @PreDestroy
    public void cleanup() {
        // Application बंद होने से पहले
        connection.close();
        System.out.println("Database Connection Closed!");
    }
}
```

---

## @PreDestroy का Real Use Case

```java
@Service
class RedisService {

    private RedisClient client;

    @PostConstruct
    public void connect() {
        client = RedisClient.create("redis://localhost");
        System.out.println("Redis Connected!");
    }

    @PreDestroy
    public void disconnect() {
        client.shutdown();
        System.out.println("Redis Disconnected!");
    }
}
```

---

# Phase 13 – DisposableBean

```java
@Service
class PaymentService implements DisposableBean {

    @Override
    public void destroy() throws Exception {
        // @PreDestroy के बाद
        System.out.println("DisposableBean.destroy() called");
    }
}
```

---

# Phase 14 – Custom destroy-method

```java
@Bean(destroyMethod = "customDestroy")
public PaymentService paymentService() {
    return new PaymentService();
}
```

---

# Lifecycle एक Real Example में

```java
@Service
class AnalyticsService
        implements BeanNameAware, InitializingBean, DisposableBean {

    @Autowired
    private AnalyticsClient client;

    private String beanName;

    // Phase 3 — Constructor
    public AnalyticsService() {
        System.out.println("1. Constructor called (client = null)");
    }

    // Phase 5 — Aware
    @Override
    public void setBeanName(String name) {
        this.beanName = name;
        System.out.println("2. BeanNameAware: " + beanName);
    }

    // Phase 7 — @PostConstruct
    @PostConstruct
    public void postConstruct() {
        System.out.println("3. @PostConstruct (client = " + client + ")");
    }

    // Phase 8 — InitializingBean
    @Override
    public void afterPropertiesSet() {
        System.out.println("4. InitializingBean.afterPropertiesSet()");
        client.connect();
    }

    // Phase 12 — @PreDestroy
    @PreDestroy
    public void preDestroy() {
        System.out.println("5. @PreDestroy");
    }

    // Phase 13 — DisposableBean
    @Override
    public void destroy() {
        System.out.println("6. DisposableBean.destroy()");
        client.disconnect();
    }
}
```

Output:

```text
1. Constructor called (client = null)
2. BeanNameAware: analyticsService
3. @PostConstruct (client = AnalyticsClient@...)
4. InitializingBean.afterPropertiesSet()
5. @PreDestroy
6. DisposableBean.destroy()
```

---

# Prototype Bean का Lifecycle

**Important:** Prototype Beans को Spring Destroy नहीं करता!

```java
@Component
@Scope("prototype")
class ReportBuilder {

    @PostConstruct
    public void init() {
        System.out.println("ReportBuilder Created!");
    }

    @PreDestroy
    public void destroy() {
        System.out.println("This NEVER prints for Prototype!");
    }
}
```

```text
Singleton  → Spring Create करता है + Destroy करता है
Prototype  → Spring Create करता है + Destroy नहीं करता
             (तुम्हारी ज़िम्मेदारी)
```

---

# Interview Questions

---

## Q1. @PostConstruct और Constructor में क्या अंतर है?

**Answer:**

```text
Constructor:
  → Object बनते समय
  → @Autowired नहीं हुआ
  → Dependencies null हैं

@PostConstruct:
  → Dependencies Inject होने के बाद
  → Bean Use होने से पहले
  → Dependencies Available हैं
```

---

## Q2. Bean Lifecycle में @PostConstruct कहाँ आता है?

**Answer:**

```text
1. Constructor
2. @Autowired (DI)
3. Aware Callbacks
4. BeanPostProcessor Before Init
5. @PostConstruct  ← यहाँ
6. InitializingBean.afterPropertiesSet()
7. BeanPostProcessor After Init
8. READY
```

---

## Q3. @PreDestroy Prototype Bean में काम करता है?

**Answer:**

नहीं।

Spring Prototype Bean को Destroy नहीं करता।

Prototype Bean का Lifecycle Developer की ज़िम्मेदारी है।

---

## Q4. AOP Proxy कब बनती है?

**Answer:**

`BeanPostProcessor.postProcessAfterInitialization()` में।

`AbstractAutoProxyCreator` Bean को Check करता है।

`@Transactional`, `@Async`, `@Cacheable` जैसे Annotations मिलें → Proxy बनाता है।

---

## Q5. InitializingBean और @PostConstruct में कौन पहले चलता है?

**Answer:**

`@PostConstruct` पहले चलता है।

फिर `InitializingBean.afterPropertiesSet()`।

---

# Best Practices

---

## 1. Resources के लिए @PostConstruct और @PreDestroy

```java
@Component
class ConnectionPool {

    @PostConstruct
    public void openConnections() { /* Open */ }

    @PreDestroy
    public void closeConnections() { /* Close */ }
}
```

---

## 2. Constructor में Dependencies मत Use करो

```java
// ❌ गलत
public MyService(@Autowired OtherService os) {
    os.doSomething();  // अगर os null हो?
}

// ✅ सही
@PostConstruct
public void init() {
    otherService.doSomething();  // Guaranteed non-null
}
```

---

## 3. Spring Specific Interfaces कम Use करो

```java
// ❌ Spring Tightly Coupled
class MyService implements InitializingBean { }

// ✅ Framework Independent
class MyService {
    @PostConstruct
    public void init() { }
}
```

---

# Common Mistakes

---

## Mistake 1 — Constructor में @Autowired Use

```java
@Service
class OrderService {

    @Autowired
    EmailService emailService;

    public OrderService() {
        emailService.send();  // ❌ NullPointerException!
    }
}
```

---

## Mistake 2 — @PreDestroy में Heavy Cleanup

```java
@PreDestroy
public void cleanup() {
    // ❌ बहुत Time लेगा — Application Shutdown Slow
    exportAllDataToS3();  // Heavy Operation
}
```

---

# इस Chapter का निष्कर्ष

```text
Bean Lifecycle = Birth → Life → Death

Birth:
  Constructor → DI → Aware → BPP Before → @PostConstruct → afterPropertiesSet → BPP After

Life:
  Application Use करती है

Death:
  @PreDestroy → destroy() → Custom destroy-method
```

---

### अगला Chapter

अब Bean का एक और Important पहलू।

> **"एक Bean कितने Objects बनाती है?"**

यही है Bean Scope।

Singleton से लेकर WebSocket Scope तक।

अगला Chapter: **Bean Scope**
