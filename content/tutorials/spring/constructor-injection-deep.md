Senior Developer ने कहा:

> "Constructor Injection Best Practice है।"

Junior Developer ने पूछा:

> "क्यों?"

Senior Developer बोला:

> "आज Spring के अंदर जाकर देखते हैं।"

---

# Chapter 26 – Constructor Injection (Deep Internal)

---

पिछले Chapter में हमने तीन Types देखे:

```text
Field Injection      → @Autowired private field
Constructor Injection → Constructor में parameter
Setter Injection     → @Autowired setter method
```

आज हम Constructor Injection को अंदर से खोलेंगे।

---

# Constructor Injection कैसे काम करता है?

---

## Simple Case – एक Constructor

```java
@Service
class OrderService {

    private final PaymentService paymentService;

    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```

Spring क्या करेगा?

---

**Step 1:** OrderService की BeanDefinition में Constructor देखा।

**Step 2:** Constructor का Parameter है `PaymentService`।

**Step 3:** ApplicationContext में `PaymentService` Bean ढूँढी।

**Step 4:** Found।

**Step 5:** Constructor Call किया:

```java
// Spring अंदर से यह कर रहा है:
Constructor<?> ctor = OrderService.class.getConstructor(PaymentService.class);
Object bean = ctor.newInstance(paymentServiceBean);
```

बस।

`orderService.paymentService` → **Not null**।

---

# Case 1 – No Constructor (Spring का Default Behavior)

```java
@Service
class SimpleService {
    // कोई Constructor नहीं लिखा
}
```

Java का Rule:

> "अगर कोई Constructor नहीं, तो Default No-Arg Constructor बनता है।"

Spring ने देखा — No-Arg Constructor।

```java
SimpleService bean = new SimpleService();
```

---

# Case 2 – दो Constructors हों तो?

यहाँ Spring को Decision लेना होता है।

---

## Situation A – @Autowired नहीं लगाया

```java
@Service
class PaymentService {

    private EmailService emailService;

    public PaymentService() {
        // No-Arg Constructor
    }

    public PaymentService(EmailService emailService) {
        this.emailService = emailService;
    }
}
```

Spring का Rule:

> "अगर @Autowired नहीं है, तो Default No-Arg Constructor use करो।"

```java
// Spring यह करेगा:
PaymentService bean = new PaymentService();  // emailService null!
```

---

## Situation B – एक पर @Autowired लगाया

```java
@Service
class PaymentService {

    private EmailService emailService;

    public PaymentService() {
        // No-Arg Constructor
    }

    @Autowired  // ← यह चुना जाएगा
    public PaymentService(EmailService emailService) {
        this.emailService = emailService;
    }
}
```

Spring ने देखा: `@Autowired` वाला Constructor।

```java
// Spring यह करेगा:
PaymentService bean = new PaymentService(emailServiceBean);
```

`emailService` → **Not null**।

---

## Situation C – दोनों पर @Autowired?

```java
@Service
class PaymentService {

    @Autowired
    public PaymentService() { }

    @Autowired
    public PaymentService(EmailService emailService) { }
}
```

Spring Confused।

Error:

```text
BeanCreationException:
Invalid autowire-marked constructors in bean class
[PaymentService]: configuration allows only a single autowire-marked
primary constructor
```

---

# Case 3 – तीन Constructors हों तो?

```java
@Service
class OrderService {

    private PaymentService paymentService;
    private EmailService emailService;
    private AuditService auditService;

    public OrderService() { }

    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @Autowired
    public OrderService(PaymentService paymentService,
                        EmailService emailService,
                        AuditService auditService) {
        this.paymentService = paymentService;
        this.emailService = emailService;
        this.auditService = auditService;
    }
}
```

Spring ने `@Autowired` वाला 3-Parameter Constructor चुना।

सभी तीनों Dependencies Inject होंगी।

---

# Case 4 – Spring Boot 4.3+ का Magic

```java
@Service
class OrderService {

    private final PaymentService paymentService;

    // @Autowired नहीं लिखा!
    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```

Spring Boot 4.3+ में अगर सिर्फ **एक ही Constructor** है:

Spring automatically उसे `@Autowired` मानता है।

`@Autowired` लिखना Optional हो गया।

---

## यह क्यों?

Spring का नया Rule:

> "Single Constructor = Autowired Constructor।"

इससे Boilerplate कम हुआ।

Lombok के साथ और Clean:

```java
@Service
@RequiredArgsConstructor  // Lombok → final fields का Constructor बनाता है
class OrderService {

    private final PaymentService paymentService;
    private final EmailService emailService;
    // Constructor @Autowired ज़रूरी नहीं ✅
}
```

---

# Case 5 – Dependency Missing हो तो?

```java
@Service
class OrderService {

    private final ReportService reportService;

    public OrderService(ReportService reportService) {
        this.reportService = reportService;
    }
}
```

लेकिन `ReportService` कोई Bean नहीं है।

Spring ने Constructor देखा।

Parameter है `ReportService`।

ApplicationContext में ढूँढा।

**नहीं मिली।**

```text
UnsatisfiedDependencyException:
Error creating bean with name 'orderService':
Unsatisfied dependency expressed through constructor parameter 0;
nested exception is NoSuchBeanDefinitionException:
No qualifying bean of type 'ReportService' available
```

Application Start नहीं होगी।

---

## यही Constructor Injection की Strength है!

Field Injection में:

```java
@Autowired
private ReportService reportService;
```

अगर Bean नहीं मिली और `required = true` (default):

तो भी Application Start नहीं होगी।

लेकिन Error Message Less Clear हो सकता है।

Constructor Injection में Error:

```text
"constructor parameter 0"
```

यह बताता है — किस Constructor Parameter ने Problem की।

---

# Case 6 – Optional Dependency in Constructor

```java
@Service
class NotificationService {

    private final EmailService emailService;
    private final SmsService smsService;

    public NotificationService(
            EmailService emailService,
            @Autowired(required = false) SmsService smsService) {
        this.emailService = emailService;
        this.smsService = smsService;  // null हो सकता है
    }
}
```

या Java Optional:

```java
public NotificationService(
        EmailService emailService,
        Optional<SmsService> smsService) {
    this.emailService = emailService;
    this.smsService = smsService.orElse(null);
}
```

---

# Spring Constructor Selection Algorithm

Spring के अंदर यह Logic चलता है:

```text
1. Constructors की List बनाओ
         ↓
2. @Autowired Constructors ढूँढो
         ↓
3. एक @Autowired मिला?
   → उसे Use करो
         ↓
4. Multiple @Autowired मिले?
   → Error (BeanCreationException)
         ↓
5. कोई @Autowired नहीं?
   → अगर सिर्फ एक Constructor है → उसे Use करो
   → अगर Multiple हैं → No-Arg Constructor ढूँढो
   → No-Arg नहीं है → Error
```

---

# Real Life Analogy

Construction Company को एक Builder चाहिए।

```text
Builder की Requirements:
  - Civil Engineer होना चाहिए (PaymentService)
  - Safety Certificate होना चाहिए (EmailService)
  - 5 साल Experience (AuditService)
```

Company Manager (Spring) ने HR से कहा:

> "इन तीनों Requirements के साथ जो भी आए, उसे Hire करो।"

अगर Civil Engineer नहीं मिला:

> "नहीं मिला — Project Start नहीं होगा।"

यही Constructor Injection है।

**Dependencies Required हैं। नहीं मिलीं तो Start नहीं।**

---

# Constructor Injection vs Field Injection की Testing

---

## Field Injection — Testing Hard

```java
@Service
class OrderService {
    @Autowired
    private EmailService emailService;
}

// Test में:
@Test
void testOrder() {
    OrderService service = new OrderService();
    // emailService null है!
    // Reflection से set करना होगा → Boilerplate
    service.processOrder();  // NullPointerException
}
```

---

## Constructor Injection — Testing Easy

```java
@Service
class OrderService {
    private final EmailService emailService;

    public OrderService(EmailService emailService) {
        this.emailService = emailService;
    }
}

// Test में:
@Test
void testOrder() {
    EmailService mockEmail = mock(EmailService.class);
    OrderService service = new OrderService(mockEmail);  // Clean!
    // No Spring needed, No Reflection, No Boilerplate
    service.processOrder();
}
```

---

# Interview Questions

---

## Q1. अगर Class में दो Constructors हों और कोई @Autowired नहीं, तो Spring क्या करेगा?

**Answer:**

Spring Default No-Arg Constructor ढूँढेगा।

अगर No-Arg Constructor है → उसे Use करेगा।

अगर No-Arg नहीं है और Multiple Constructors हैं → Error।

---

## Q2. Constructor Injection में @Autowired क्यों Optional है Spring Boot 4.3+ में?

**Answer:**

Spring Boot 4.3 से एक नया Rule आया:

> "अगर Class में Single Constructor है, तो Spring automatically उसे Autowired मानता है।"

यह Rule Boilerplate कम करता है।

---

## Q3. Constructor Injection से Circular Dependency क्यों जल्दी पकड़ी जाती है?

**Answer:**

Constructor Injection में Bean Create करते समय ही Dependency चाहिए।

```text
A बनना चाहता है → B चाहिए
B बनना चाहता है → A चाहिए
→ Deadlock → Spring Start पर Error
```

Field Injection में Spring पहले Object बनाता है (empty), फिर Fields Set करता है।

इसलिए Circular Dependency कभी-कभी Field Injection में छुप जाती है।

---

## Q4. final field सिर्फ Constructor Injection में क्यों होती है?

**Answer:**

Java में `final` field को Object Create होते समय ही set करना होता है।

Constructor में → Allowed।

Setter/Field में → Compile Error।

यही Constructor Injection की Immutability guarantee है।

---

## Q5. `@Autowired(required = false)` Constructor में कैसे use करते हैं?

**Answer:**

```java
public MyService(@Autowired(required = false) OptionalDep dep) {
    this.dep = dep; // null हो सकता है
}
```

या Java Optional:

```java
public MyService(Optional<OptionalDep> dep) {
    this.dep = dep.orElse(null);
}
```

---

# Best Practices

---

## 1. Constructor Injection हमेशा Use करो

```java
// ✅ Best
@Service
@RequiredArgsConstructor
class OrderService {
    private final PaymentService paymentService;
    private final EmailService emailService;
}
```

---

## 2. Lombok से Code Clean रखो

```java
// बिना Lombok:
@Service
class OrderService {
    private final PaymentService paymentService;
    private final EmailService emailService;

    public OrderService(PaymentService ps, EmailService es) {
        this.paymentService = ps;
        this.emailService = es;
    }
}

// Lombok के साथ:
@Service
@RequiredArgsConstructor
class OrderService {
    private final PaymentService paymentService;
    private final EmailService emailService;
}
```

---

## 3. बहुत ज़्यादा Constructor Parameters — Warning!

```java
// ❌ बहुत Dependencies — Class का SRP टूट रहा है
@Service
@RequiredArgsConstructor
class OrderService {
    private final PaymentService paymentService;
    private final EmailService emailService;
    private final AuditService auditService;
    private final InvoiceService invoiceService;
    private final InventoryService inventoryService;
    private final ReportService reportService;
    private final AnalyticsService analyticsService;
}
```

7+ Dependencies = Class बहुत बड़ी हो गई।

Split करो।

---

# Common Mistakes

---

## Mistake 1 — Mutable Fields (Field Injection)

```java
// ❌ Field Injection — field change हो सकती है
@Autowired
private EmailService emailService;
emailService = null;  // किसी ने change कर दिया!

// ✅ Constructor Injection — final, change नहीं होगा
private final EmailService emailService;
```

---

## Mistake 2 — Circular Dependency (Constructor में Deadlock)

```java
@Service
class A {
    public A(B b) { }
}

@Service
class B {
    public B(A a) { }  // A को B चाहिए, B को A चाहिए → Deadlock
}
```

Error:

```text
The dependencies of some of the beans in the application context 
form a cycle:
a → b → a
```

---

## Mistake 3 — No-Arg Constructor के बाद Field Uninitialized

```java
@Service
class OrderService {

    private final EmailService emailService;

    public OrderService() {
        // emailService initialize नहीं किया!
        // Compile Error: variable emailService might not be initialized
    }

    public OrderService(EmailService emailService) {
        this.emailService = emailService;
    }
}
```

---

# इस Chapter का निष्कर्ष

```text
Constructor Injection Spring का Preferred तरीका है।

Rules:
  1. @Autowired Constructor → Spring चुनेगा
  2. Single Constructor → Auto-Autowired (Boot 4.3+)
  3. No @Autowired, Multiple Constructors → No-Arg चुना जाएगा
  4. Dependency Missing → Application Start नहीं होगी

Benefits:
  ✅ Immutability (final fields)
  ✅ Testing आसान
  ✅ Circular Dependency जल्दी पकड़ी जाती है
  ✅ Null-Safety
```

---

### अगला Chapter

Constructor Injection से Circular Dependency का ज़िक्र आया।

```text
A → B → C → A
```

यह Spring का Interview Favorite Question है।

क्या Spring इसे Handle करता है?

Crash होता है?

या कोई Magic होता है?

अगला Chapter: **Circular Dependency**
