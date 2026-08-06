एक बड़ी Company थी — **BankX**।

Project में एक Bug मिला।

```text
User 1 का Cart — User 2 को दिख रहा था।
```

Senior Developer ने Code खोला।

```java
@Service  // Singleton!
class ShoppingCart {

    private List<Item> items = new ArrayList<>();

    public void addItem(Item item) {
        items.add(item);
    }
}
```

उसने सिर पर हाथ रखा।

> "Shopping Cart Singleton है।
> पूरी Application में एक ही Cart है।
> हर User उसी Cart में Add कर रहा है।"

यहीं से **Bean Scope** की ज़रूरत समझ में आती है।

---

# Chapter 29 – Bean Scope

---

> "एक Bean = कितने Objects?"

यही Scope है।

---

# Spring के 6 Scopes

```text
1. singleton   → एक Object (Default)
2. prototype   → हर बार नया Object
3. request     → हर HTTP Request के लिए नया
4. session     → हर User Session के लिए नया
5. application → पूरे Web Application के लिए एक
6. websocket   → हर WebSocket Session के लिए नया
```

---

# Scope 1 – Singleton ⭐⭐⭐⭐⭐

```java
@Service
// Same as:
@Service
@Scope("singleton")
class PaymentService {

}
```

---

## यह क्या करता है?

```text
पूरी Application में सिर्फ एक Object।

ctx.getBean(PaymentService.class) → Object A
ctx.getBean(PaymentService.class) → Object A (same!)
ctx.getBean(PaymentService.class) → Object A (same!)
```

---

## Real Life Analogy

Company का **CEO**।

```text
HR ने CEO माँगा         → वही CEO
Finance ने CEO माँगा    → वही CEO
Tech ने CEO माँगा       → वही CEO
```

एक ही CEO है।

---

## Singleton कब Use करें?

```text
✅ Stateless Services (Business Logic)
✅ Stateless Repositories (Database Access)
✅ Utilities (TaxCalculator, PasswordEncoder)
✅ Infrastructure (Connection Pool, Cache Manager)
```

---

## Singleton का Danger

```java
// ❌ Singleton में Mutable State — बहुत गलत!
@Service
class OrderService {

    private int orderCount = 0;  // Shared State!

    public void placeOrder() {
        orderCount++;  // Thread-Unsafe!
        // User 1 और User 2 दोनों यही Counter share करते हैं
    }
}
```

---

## Singleton Thread Safety

```java
// ✅ Stateless — Thread Safe
@Service
class TaxCalculator {

    public double calculate(double amount, double rate) {
        return amount * rate;  // No Shared State
    }
}

// ✅ अगर State ज़रूरी हो — ThreadLocal Use करो
@Service
class RequestTracker {

    private final ThreadLocal<String> requestId = new ThreadLocal<>();

    public void setRequestId(String id) {
        requestId.set(id);
    }

    public String getRequestId() {
        return requestId.get();
    }
}
```

---

# Scope 2 – Prototype ⭐⭐⭐

```java
@Service
@Scope("prototype")
class ReportBuilder {

    private List<Section> sections = new ArrayList<>();

    public void addSection(Section s) {
        sections.add(s);
    }
}
```

---

## यह क्या करता है?

```text
हर getBean() call पर नया Object।

ctx.getBean(ReportBuilder.class) → Object A (नया!)
ctx.getBean(ReportBuilder.class) → Object B (नया!)
ctx.getBean(ReportBuilder.class) → Object C (नया!)
```

---

## Real Life Analogy

**Report Sheet**।

हर Employee को नई Sheet चाहिए।

```text
Rahul → नई Sheet
Priya → नई Sheet
Amit  → नई Sheet
```

---

## Prototype कब Use करें?

```text
✅ Stateful Objects (Shopping Cart, Report Builder)
✅ Mutable State जहाँ हर User का अलग चाहिए
✅ Non-Thread-Safe Objects
```

---

## Prototype + Singleton Problem ⭐

यह एक Common Mistake है।

```java
// ❌ गलत
@Service  // Singleton
class OrderService {

    @Autowired
    ReportBuilder builder;  // Prototype — लेकिन एक बार Inject!

    public void createReport() {
        builder.addSection(new Section("Header"));  // हमेशा same builder!
    }
}
```

**Problem:**

Singleton एक बार बनती है।

Inject होते समय एक Prototype Object बना।

वही हमेशा use होगा।

Prototype का फायदा खत्म।

---

## Solution 1 – ApplicationContext.getBean()

```java
@Service
class OrderService {

    @Autowired
    ApplicationContext ctx;

    public void createReport() {
        ReportBuilder builder = ctx.getBean(ReportBuilder.class);  // हर बार नया
        builder.addSection(new Section("Header"));
    }
}
```

---

## Solution 2 – @Lookup Annotation (Elegant)

```java
@Service
abstract class OrderService {

    public void createReport() {
        ReportBuilder builder = getReportBuilder();  // हर बार नया
        builder.addSection(new Section());
    }

    @Lookup
    protected abstract ReportBuilder getReportBuilder();
    // Spring इस Method को Override करेगा
}
```

---

## Solution 3 – ObjectProvider (Spring 4.3+)

```java
@Service
class OrderService {

    @Autowired
    ObjectProvider<ReportBuilder> builderProvider;

    public void createReport() {
        ReportBuilder builder = builderProvider.getObject();  // हर बार नया
    }
}
```

---

# Web Scopes (Spring Web में)

Web Scopes सिर्फ Web Application में काम करते हैं।

---

# Scope 3 – Request ⭐⭐

```java
@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
class RequestContext {

    private String correlationId;
    private String userIp;

    // getters and setters
}
```

---

## यह क्या करता है?

```text
हर HTTP Request के लिए नया Object।

GET /api/users (User 1)  → Object A
GET /api/users (User 2)  → Object B
POST /api/orders (User 1) → Object C
```

Request खत्म → Object Destroy।

---

## Real Example

```java
@Component
@RequestScope  // shortcut for @Scope("request")
class RequestMetadata {

    private final String requestId = UUID.randomUUID().toString();
    private String userId;
    private long startTime = System.currentTimeMillis();

    // getters and setters
}

@Service
class OrderService {

    @Autowired
    RequestMetadata requestMetadata;  // यह Request की unique instance है

    public Order createOrder(OrderRequest req) {
        log.info("Request: {}", requestMetadata.getRequestId());
        // ...
    }
}
```

---

## proxyMode क्यों?

`OrderService` Singleton है।

`RequestMetadata` Request Scope है।

Singleton एक बार बनता है।

अगर directly Inject करें:

```text
Singleton बना → उस Request की RequestMetadata Inject हुई
दूसरी Request में → वही पुरानी RequestMetadata!
```

**proxyMode से Spring एक Proxy Inject करता है।**

```text
Singleton को → RequestMetadata Proxy मिलती है
Proxy हर बार → Current Request की RequestMetadata दिखाती है
```

---

# Scope 4 – Session ⭐⭐

```java
@Component
@SessionScope  // shortcut
class UserSession {

    private String userId;
    private String username;
    private String role;
    private List<String> recentSearches = new ArrayList<>();

    // getters and setters
}
```

---

## यह क्या करता है?

```text
हर User Session के लिए एक Object।

Rahul Login किया  → UserSession Object A
Priya Login किया  → UserSession Object B

Rahul की 5 Requests → सब Object A use करती हैं
Priya की 5 Requests → सब Object B use करती हैं

Rahul Logout → Object A Destroy
```

---

## Real Example — Shopping Cart (Correct!)

```java
@Component
@SessionScope
class ShoppingCart {

    private List<CartItem> items = new ArrayList<>();

    public void addItem(CartItem item) {
        items.add(item);
    }

    public List<CartItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public double getTotal() {
        return items.stream()
                .mapToDouble(CartItem::getPrice)
                .sum();
    }
}
```

अब हर User का अलग Cart।

Chapter की शुरुआत की Bug Fix हो गई!

---

# Scope 5 – Application

```java
@Component
@Scope("application")
class ApplicationConfig {

    private Map<String, String> settings = new HashMap<>();

    public void setSetting(String key, String value) {
        settings.put(key, value);
    }
}
```

---

## यह क्या करता है?

```text
पूरे Web Application में एक Object।
(Singleton जैसा, लेकिन ServletContext में Store)
```

---

## Singleton vs Application

```text
Singleton    → Spring ApplicationContext में
Application  → ServletContext में (Web Server Level)
```

अधिकतर cases में Singleton काफी है।

---

# Scope 6 – WebSocket

```java
@Component
@Scope("websocket")
class WebSocketSession {

    private String sessionId;
    private List<String> messages = new ArrayList<>();

}
```

```text
हर WebSocket Connection के लिए एक Object।
Connection Close → Object Destroy।
```

---

# Scope Comparison Table

```text
┌─────────────────────────────────────────────────────────────────┐
│  Scope      │ Object Count    │ Lifetime          │ Use Case    │
├─────────────────────────────────────────────────────────────────┤
│ singleton   │ एक             │ App Lifetime       │ Services    │
│ prototype   │ हर बार नया     │ तुम्हारे हाथ में  │ Stateful    │
│ request     │ Per HTTP Req   │ Request End        │ Request Data│
│ session     │ Per User       │ Session End        │ Cart, Auth  │
│ application │ एक             │ App Lifetime       │ App Config  │
│ websocket   │ Per WS Conn    │ Connection Close   │ Chat, Stream│
└─────────────────────────────────────────────────────────────────┘
```

---

# Interview Questions

---

## Q1. Default Scope क्या है और क्यों?

**Answer:**

Default Scope है `singleton`।

क्योंकि:
- Services Stateless होती हैं
- एक Object = Memory Efficient
- Thread Safe (अगर Stateless हो)
- Performance Better

---

## Q2. Singleton और Application Scope में क्या फर्क है?

**Answer:**

```text
Singleton   → Spring ApplicationContext में stored
            → Multiple ApplicationContexts हों तो Multiple Objects

Application → ServletContext में stored
            → एक JVM में एक Object (Web Application Level)
```

Normal Applications में practically same।

---

## Q3. Prototype Bean को Spring Destroy क्यों नहीं करता?

**Answer:**

Spring Prototype Bean का Reference Release कर देता है।

Bean बनाई → दे दी → Spring ने छोड़ दिया।

Destroy करने के लिए Spring को Bean track करना होगा।

इससे Memory Leak हो सकती है।

इसलिए Developer की ज़िम्मेदारी।

---

## Q4. Request Scope में proxyMode क्यों ज़रूरी है?

**Answer:**

Singleton Bean एक बार बनती है।

Request Scope Bean हर Request पर नई बनती है।

Singleton में directly Inject करें → एक पुरानी Bean stuck रहेगी।

`proxyMode = ScopedProxyMode.TARGET_CLASS` से:
- Singleton को एक Proxy मिलती है
- Proxy हर बार Current Request की Bean return करती है

---

## Q5. Prototype Bean को Singleton में inject करने का सही तरीका?

**Answer:**

तीन तरीके:

1. `ApplicationContext.getBean()` — Simple but Anti-Pattern
2. `@Lookup` — Spring Override करता है Method को
3. `ObjectProvider<T>` — Modern, Clean Way

---

# Best Practices

---

## 1. Beans को Stateless रखो → Singleton

```java
// ✅ Stateless Singleton
@Service
class UserService {
    // No instance variables that change
    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }
}
```

---

## 2. User-Specific Data → Session Scope

```java
// ✅ User Data → Session
@Component
@SessionScope
class UserPreferences {
    private String theme = "light";
    private String language = "en";
}
```

---

## 3. Request Tracking → Request Scope

```java
// ✅ Request Correlation → Request Scope
@Component
@RequestScope
class RequestCorrelation {
    private final String id = UUID.randomUUID().toString();
}
```

---

# Common Mistakes

---

## Mistake 1 — Singleton में Mutable State

```java
// ❌ Race Condition
@Service
class CounterService {
    private int count = 0;  // Shared Mutable State!

    public int increment() {
        return count++;  // Thread-Unsafe
    }
}

// ✅ AtomicInteger Use करो
@Service
class CounterService {
    private AtomicInteger count = new AtomicInteger(0);

    public int increment() {
        return count.incrementAndGet();  // Thread-Safe
    }
}
```

---

## Mistake 2 — Session Scope लेकिन @SessionScope नहीं

```java
// ❌ Singleton Cart — सबका Data Mix
@Service
class ShoppingCart { }

// ✅ Session Cart — हर User का अलग
@Component
@SessionScope
class ShoppingCart { }
```

---

# इस Chapter का निष्कर्ष

```text
Scope = "कितने Objects बनेंगे?"

singleton  → एक Object, पूरी App (Default)
prototype  → हर बार नया Object
request    → हर HTTP Request के लिए नया
session    → हर User के लिए नया
application→ Web App Level एक
websocket  → हर WS Connection के लिए नया

Rule:
  Stateless → Singleton ✅
  Stateful per-user → Session ✅
  Stateful per-request → Request ✅
  Truly Stateful per-instance → Prototype ✅
```

---

### अगला Chapter

अब तक हमने Beans को Manage करना सीखा।

लेकिन एक बड़ा सवाल है:

> **"Logging, Security, Transaction — यह सब हर Method में कैसे होगा?"**

हर Method में manually लिखोगे?

या Spring कोई बेहतर तरीका देता है?

अगला Chapter: **Spring AOP – Aspect Oriented Programming**
