Interview में एक सवाल आया:

> **"जब तुम @Autowired करते हो, तो क्या तुम्हें Real Object मिलता है?"**

Candidate ने कहा:

> "हाँ।"

Interviewer ने कहा:

> "गलत।"

---

# Chapter 31 – Spring Proxy (JDK Proxy vs CGLIB)

---

# पहले समझो — Proxy क्या होती है?

Real Life में Proxy = किसी की तरफ से काम करने वाला।

```text
Client → Proxy → Real Service
```

Proxy:

1. Request Receive करती है।
2. कुछ Extra काम करती है।
3. Real Service को Forward करती है।
4. Response Return करती है।

---

## Real Life Analogy

तुम एक Celebrity हो।

तुम्हारा Manager (Proxy) है।

```text
Fan ने Call किया
       ↓
Manager (Proxy) ने Receive किया
       ↓
Manager ने Check किया: "क्या यह Legit है?"
       ↓
Manager ने Celebrity (Real Object) को बताया
       ↓
Celebrity ने Response दिया
       ↓
Manager ने Fan को Response दिया
```

Celebrity को सीधे कोई नहीं पहुँच सकता।

Manager बीच में है।

---

# Spring में Proxy क्यों?

AOP के बिना:

```java
@Autowired
PaymentService paymentService;
// Real PaymentService Object
```

AOP के साथ:

```java
@Autowired
PaymentService paymentService;
// Actually एक Proxy Object!
// Proxy के पीछे Real PaymentService है
```

---

## Spring Proxy क्यों बनाता है?

```text
@Transactional → Transaction Proxy
@Async         → Async Execution Proxy
@Cacheable     → Caching Proxy
@Retryable     → Retry Proxy
Custom @Aspect → Custom Proxy
```

हर बार जब Spring को Method के आगे-पीछे कुछ करना हो → Proxy।

---

# दो Types की Proxies

```text
1. JDK Dynamic Proxy
2. CGLIB Proxy
```

---

# Type 1 – JDK Dynamic Proxy

```text
Java का Built-in Mechanism।
java.lang.reflect.Proxy use करता है।
```

---

## Rule

**JDK Proxy तभी बनती है जब Class कोई Interface Implement करती हो।**

---

## Example

```java
interface PaymentGateway {
    boolean charge(double amount);
}

@Service
class StripeGateway implements PaymentGateway {

    @Override
    @Transactional
    public boolean charge(double amount) {
        // Stripe API Call
        return true;
    }
}
```

`StripeGateway` → `PaymentGateway` Interface implement करती है।

Spring ने JDK Proxy बनाई:

```java
// Spring अंदर से (simplified):
PaymentGateway proxy = (PaymentGateway) Proxy.newProxyInstance(
    PaymentGateway.class.getClassLoader(),
    new Class[]{PaymentGateway.class},
    new TransactionInvocationHandler(stripeGatewayBean)
);
```

---

## JDK Proxy कैसे काम करती है?

```text
तुमने call किया: paymentGateway.charge(100.0)
         ↓
Proxy का InvocationHandler.invoke() चला
         ↓
Transaction Begin
         ↓
Real StripeGateway.charge(100.0) call हुआ
         ↓
Result मिला
         ↓
Transaction Commit
         ↓
Result Return
```

---

## JDK Proxy की Limitation

```java
// ❌ JDK Proxy नहीं बन सकती अगर Interface नहीं
@Service
class PaymentService {  // No interface!

    @Transactional
    public void process() { }
}
```

JDK Proxy को Interface चाहिए।

---

# Type 2 – CGLIB Proxy

```text
CGLIB = Code Generation Library
```

---

## CGLIB का Approach

> "Interface नहीं है? कोई बात नहीं।"
> "हम Class को Extend करके Subclass बनाएँगे।"

---

## Example

```java
@Service
class PaymentService {  // Interface नहीं!

    @Transactional
    public void processPayment() {
        // Business Logic
    }
}
```

CGLIB ने यह किया:

```java
// Spring ने Internally एक Subclass बनाई:
class PaymentService$CGLIB extends PaymentService {

    @Override
    public void processPayment() {
        // Transaction Begin
        transactionManager.begin();

        try {
            super.processPayment();  // Original Method
            transactionManager.commit();
        } catch (Exception e) {
            transactionManager.rollback();
            throw e;
        }
    }
}
```

---

## CGLIB Proxy कैसे काम करती है?

```text
PaymentService → CGLIB ने Subclass बनाई
                 PaymentService$$EnhancerByCGLIB

Container में:
  "paymentService" → CGLIB Subclass का Object

तुमने @Autowired किया → CGLIB Object मिला

paymentService.processPayment() call
         ↓
CGLIB Subclass का Override Method चला
         ↓
Transaction Begin
         ↓
super.processPayment() — Original Code
         ↓
Transaction Commit
         ↓
Done
```

---

## CGLIB की Limitations

```java
// ❌ final class — CGLIB Subclass नहीं बना सकती
@Service
final class PaymentService {
    @Transactional
    public void process() { }
    // AOP काम नहीं करेगा!
}

// ❌ final method — CGLIB Override नहीं कर सकती
@Service
class PaymentService {
    @Transactional
    public final void process() { }
    // Transaction नहीं लगेगा!
}
```

---

# JDK Proxy vs CGLIB

```text
┌──────────────────────────────────────────────────────────────────┐
│  Feature          │ JDK Dynamic Proxy  │ CGLIB Proxy             │
├──────────────────────────────────────────────────────────────────┤
│ Requirement       │ Interface ज़रूरी   │ Interface ज़रूरी नहीं   │
│ Mechanism         │ java.lang.reflect  │ Bytecode Generation     │
│                   │ .Proxy             │ (Subclass)              │
│ Final Class       │ N/A                │ ❌ नहीं                 │
│ Final Method      │ N/A                │ ❌ नहीं                 │
│ Performance       │ थोड़ा Slow         │ थोड़ा Fast (Modern JVM) │
│ Spring Boot 2.x+  │ Less Common        │ Default                 │
│ Default in Boot   │ No (2.x से)        │ Yes (2.x से)            │
└──────────────────────────────────────────────────────────────────┘
```

---

# Spring Boot 2.x में CGLIB Default क्यों?

Spring Boot 2.0 से CGLIB Default हो गया।

क्योंकि:

1. Interface होना **ज़रूरी नहीं**।
2. Developer को Interface Force नहीं करना।
3. CGLIB Modern JVM में Fast है।

---

## Force करना हो तो:

```properties
# application.properties
spring.aop.proxy-target-class=false  # JDK Proxy Force करो
```

या Code में:

```java
@EnableAspectJAutoProxy(proxyTargetClass = false)  // JDK Proxy
@EnableAspectJAutoProxy(proxyTargetClass = true)   // CGLIB (default)
```

---

# Proxy को पहचानो

```java
ApplicationContext ctx = SpringApplication.run(App.class, args);
PaymentService ps = ctx.getBean(PaymentService.class);

System.out.println(ps.getClass().getName());
// Output: com.payflow.service.PaymentService$$EnhancerBySpringCGLIB$$1234abcd
//                                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                                            यह Proxy है!
```

---

## AopUtils से Check करो

```java
import org.springframework.aop.support.AopUtils;

boolean isProxy = AopUtils.isAopProxy(ps);     // true
boolean isCGLIB = AopUtils.isCglibProxy(ps);   // true
boolean isJDK = AopUtils.isJdkDynamicProxy(ps); // false
```

---

# Proxy का Self-Invocation Problem

यह बहुत Important है।

```java
@Service
class PaymentService {

    @Transactional
    public void processPayment() {
        // ...
        sendReceipt();  // ❌ Proxy Bypass!
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sendReceipt() {
        // यह Transaction नहीं चलेगा!
    }
}
```

---

## क्यों होता है?

```text
तुमने call किया: paymentService.processPayment()
         ↓
Proxy ने Intercept किया → Transaction Begin
         ↓
Real PaymentService.processPayment() चला
         ↓
processPayment() ने sendReceipt() call किया
         ↓
यह call Proxy को नहीं गया — Real Object ने किया!
         ↓
Proxy Bypass → Transaction नहीं चला
```

---

## Solutions

```java
// Solution 1: Self-Injection (Spring 4.3+)
@Service
class PaymentService {

    @Autowired
    @Lazy
    private PaymentService self;  // खुद को inject करो

    @Transactional
    public void processPayment() {
        self.sendReceipt();  // ✅ Proxy से जाएगा
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sendReceipt() { }
}

// Solution 2: Method अलग Service में निकालो (Best)
@Service
class PaymentService {

    @Autowired
    NotificationService notificationService;

    @Transactional
    public void processPayment() {
        notificationService.sendReceipt();  // ✅ Different Bean = Proxy
    }
}
```

---

# Interview Questions

---

## Q1. JDK Proxy और CGLIB में क्या अंतर है?

**Answer:**

```text
JDK Proxy:
  → java.lang.reflect.Proxy use करता है
  → Interface ज़रूरी है
  → Interface के Methods पर ही Intercept करता है

CGLIB:
  → Bytecode Generation से Subclass बनाता है
  → Interface ज़रूरी नहीं
  → Final Class/Method पर काम नहीं करता
  → Spring Boot 2.x में Default
```

---

## Q2. @Transactional private method पर क्यों काम नहीं करता?

**Answer:**

Proxy Subclassing (CGLIB) या Interface Method (JDK) से काम करती है।

Private Methods को Override नहीं किया जा सकता।

Proxy Intercept नहीं कर सकती।

इसलिए `@Transactional` Public Methods पर ही लगाओ।

---

## Q3. Spring Boot 2.x में CGLIB Default क्यों है?

**Answer:**

Spring Boot 2.0 में `spring.aop.proxy-target-class=true` Default हो गया।

कारण:
- Developer को Interface लिखने के लिए Force नहीं
- CGLIB Modern JVM में Performance अच्छी है
- Simpler Configuration

---

## Q4. Proxy को Detect कैसे करें?

**Answer:**

```java
AopUtils.isAopProxy(bean)          // Proxy है?
AopUtils.isCglibProxy(bean)        // CGLIB है?
AopUtils.isJdkDynamicProxy(bean)   // JDK है?

// या Class Name से:
bean.getClass().getName()
// Output में "CGLIB" या "Proxy" दिखेगा
```

---

## Q5. क्या `@Autowired` पर Real Object मिलता है?

**Answer:**

AOP Annotations जैसे `@Transactional`, `@Async`, `@Cacheable` हों → Proxy मिलती है।

`AopUtils.getTargetClass(bean)` से Real Class पता कर सकते हो।

`((Advised) bean).getTargetSource().getTarget()` से Real Object।

---

# Best Practices

---

## 1. Interface Use करो — Clean Code

```java
interface PaymentService {
    boolean process(Payment p);
}

@Service
class StripePaymentService implements PaymentService {
    @Override
    @Transactional
    public boolean process(Payment p) { }
}
```

---

## 2. Final Class/Method AOP में मत Use करो

```java
// ❌ CGLIB Fail
@Service
final class PaymentService { }

// ✅
@Service
class PaymentService { }
```

---

## 3. Self-Invocation → Different Class में निकालो

```java
// ❌ Same Class Self Call
void processPayment() { sendReceipt(); }

// ✅ Different Service
void processPayment() { notificationService.sendReceipt(); }
```

---

# Common Mistakes

---

## Mistake 1 — Protected Method पर @Transactional

```java
// ❌ Protected भी Proxy intercept नहीं कर सकती (JDK)
@Transactional
protected void saveOrder() { }

// ✅ Public
@Transactional
public void saveOrder() { }
```

---

## Mistake 2 — Proxy Type Assumption

```java
// ❌ Direct Cast — Fail हो सकता है
PaymentService ps = (PaymentService) ctx.getBean("paymentService");
ps.doSomethingInternal();  // Proxy आई, Cast fail

// ✅ Interface Type
PaymentGateway pg = ctx.getBean(PaymentGateway.class);  // Safe
```

---

# इस Chapter का निष्कर्ष

```text
Spring Proxy = Invisible Wrapper

JDK Proxy:
  Interface Required
  java.lang.reflect.Proxy

CGLIB Proxy:
  Interface Not Required
  Subclass Generation
  Spring Boot Default

Proxy क्यों:
  @Transactional, @Async, @Cacheable, Custom Aspects

Limitations:
  final class/method → CGLIB Fail
  private method → Proxy can't intercept
  self-invocation → Proxy bypass
```

---

### अगला Chapter

Spring Transactions — सबसे Important Topic।

```text
Bank Transfer:
  Account A → -1000
  Account B → +1000
```

अगर बीच में System Crash हो?

`@Transactional` के पीछे क्या है?

Propagation क्या है?

Isolation Levels क्या हैं?

अगला Chapter: **Spring Transactions**
