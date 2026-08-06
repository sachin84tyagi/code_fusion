Senior Developer ने एक दिन Whiteboard पर लिखा:

> **"Bean एक Object है।"**

Junior Developer ने हाँ में सिर हिलाया।

Senior Developer ने फिर लिखा:

> **"लेकिन हर Object Bean नहीं है।"**

Junior Developer रुक गया।

---

# Chapter 23 – Bean आखिर है क्या?

---

यह सबसे Important Question है।

जब तक यह Clear नहीं होगा...

Spring Framework कभी पूरी तरह समझ नहीं आएगा।

---

# चार चीजें हैं जो लोग Confuse करते हैं

```text
1. Java Object
2. Spring Bean
3. Bean Definition
4. Bean Instance
```

इन चारों को अलग-अलग समझना होगा।

---

# Java Object – सबसे Basic

Java Object बनाना बहुत Simple है।

```java
PaymentService ps = new PaymentService();
```

बस।

Object बन गया।

---

इस Object को तुम Use करो।

```java
ps.processPayment();
```

काम हो गया।

Object Garbage Collect हो जाएगा।

**Java को इस Object की कोई जानकारी नहीं रखनी।**

**Spring को इस Object की कोई जानकारी नहीं।**

---

## Real Life Analogy

तुमने अपने घर में एक कुर्सी खरीदी।

कुर्सी तुम्हारे घर में है।

Company को नहीं पता।

Government को नहीं पता।

तुम Use करो, तोड़ो, फेंको — कोई record नहीं।

---

# Spring Bean – Managed Object

अब यही Class Spring को दे दो:

```java
@Component
class PaymentService {

}
```

अब Spring इसे **Manage** करेगा।

यानी:

```text
Spring Bean = Java Object + Spring Management
```

---

## Spring Bean के साथ क्या-क्या होता है?

```text
1. Spring ने Object बनाया
2. Spring ने Dependencies Inject कीं
3. Spring ने Lifecycle Callbacks चलाए
4. Spring इसे ApplicationContext में Store करता है
5. Spring इसका Scope manage करता है
6. Spring इसे Destroy करता है (जब ज़रूरत हो)
```

---

## Real Life Analogy

Company ने एक Employee Hire किया।

Employee = Managed Person।

```text
Company ने:
  ✅ Joining Process Complete की
  ✅ Laptop और Equipment दिया
  ✅ Training दी
  ✅ Department assign किया
  ✅ Salary Process करती है
  ✅ Exit Process करेगी जब जाएगा
```

यह Employee एक **Managed Resource** है।

घर वाली कुर्सी Managed नहीं है।

Employee Managed है।

---

# Bean Definition – Blueprint

पहले हमने पढ़ा था।

`@Component` देखते ही Spring Object नहीं बनाता।

पहले **BeanDefinition** बनता है।

---

BeanDefinition एक Document है।

जैसे घर बनाने से पहले **Architect का Blueprint** होता है।

```text
BeanDefinition
  ├── Class का नाम
  ├── Scope (singleton / prototype)
  ├── Constructor Arguments
  ├── Dependencies (@Autowired Fields)
  ├── Init Method
  ├── Destroy Method
  └── Lazy या Eager
```

---

## Real Life Analogy

Government ने एक New Employee का **Form** भरा।

Form में है:

```text
Employee Form:
  Name       : Rahul Sharma
  Post       : Software Engineer
  Department : Technology
  Reports to : Manager
  PF Account : Create करना है
```

यह Form भर गया।

लेकिन Rahul अभी Office नहीं आया।

Form = BeanDefinition।

---

# Bean Instance – Actual Object in Container

जब Spring ने BeanDefinition के आधार पर **Object बनाया**...

और उसे **ApplicationContext में रख दिया**...

तब वह **Bean Instance** बनी।

---

```java
// Bean Instance माँगना
ApplicationContext ctx = SpringApplication.run(App.class);
PaymentService ps = ctx.getBean(PaymentService.class);
```

यह `ps` एक **Bean Instance** है।

Spring ने बनाया।

Spring manage करता है।

---

## Real Life Analogy

Form भरने के बाद:

```text
1. Rahul ने Office Join किया         → Bean Instance बना
2. Rahul को Laptop मिला              → Dependencies Inject हुईं
3. Rahul HR System में Register हुआ  → ApplicationContext में Store
4. अब Rahul काम करता है             → Bean Use होती है
```

---

# चारों में सीधा अंतर

```text
┌──────────────────────────────────────────────────────────────┐
│  Concept         │  Kya hai?          │  Example             │
├──────────────────────────────────────────────────────────────┤
│  Java Object     │  new से बना Object │  new PaymentService()│
│                  │  Spring को नहीं    │  Spring नहीं जानता   │
│                  │  पता               │                      │
├──────────────────────────────────────────────────────────────┤
│  Bean Definition │  Object का         │  @Component पर       │
│                  │  Blueprint/Recipe  │  बना Document        │
├──────────────────────────────────────────────────────────────┤
│  Bean Instance   │  Spring ने बनाया  │  ctx.getBean()       │
│                  │  और Manage करता   │  से मिला Object      │
├──────────────────────────────────────────────────────────────┤
│  Spring Bean     │  Bean Instance +   │  Managed Object      │
│                  │  Full Lifecycle    │  with DI, Scope,     │
│                  │  Management        │  Lifecycle           │
└──────────────────────────────────────────────────────────────┘
```

---

# Bean का Scope – Spring का Special Feature

Java Object का कोई Scope नहीं होता।

बनाओ, use करो, GC करो।

Spring Bean का **Scope** होता है।

---

## Singleton Scope (Default)

```java
@Component
// या
@Component
@Scope("singleton")
class PaymentService {

}
```

पूरी Application में सिर्फ **एक ही Object** बनता है।

```text
ctx.getBean(PaymentService.class) → Object A
ctx.getBean(PaymentService.class) → Object A (same!)
ctx.getBean(PaymentService.class) → Object A (same!)
```

---

## Real Life Analogy

Company का CEO।

पूरी Company में एक ही CEO होता है।

कोई भी Department उनसे मिलना चाहे...

वही एक CEO आएगा।

```text
HR Department    → CEO (same person)
Tech Department  → CEO (same person)
Finance Dept     → CEO (same person)
```

---

## Prototype Scope

```java
@Component
@Scope("prototype")
class ReportBuilder {

}
```

हर बार माँगने पर **नया Object** बनता है।

```text
ctx.getBean(ReportBuilder.class) → Object A
ctx.getBean(ReportBuilder.class) → Object B (नया!)
ctx.getBean(ReportBuilder.class) → Object C (नया!)
```

---

## Real Life Analogy

Report बनाने के लिए।

हर बार नई Report Sheet।

```text
Employee 1 → नई Sheet मिली
Employee 2 → नई Sheet मिली
Employee 3 → नई Sheet मिली
```

---

## Web Scopes (Spring Web में)

```text
@Scope("request")  → हर HTTP Request के लिए नया Object
@Scope("session")  → हर User Session के लिए नया Object
```

---

# Bean का Lifecycle – Java Object से बड़ा Concept

Java Object का Lifecycle:

```text
new → use → GC (Garbage Collection)
```

बस।

---

Spring Bean का Lifecycle बहुत Rich है:

```text
BeanDefinition Read
       ↓
BeanFactoryPostProcessor चलता है
       ↓
Bean Instantiate होती है
       ↓
Properties/Dependencies Set होती हैं
       ↓
BeanPostProcessor (before init)
       ↓
@PostConstruct Method चलता है
       ↓
InitializingBean.afterPropertiesSet() चलता है
       ↓
Custom init-method चलता है
       ↓
BeanPostProcessor (after init)
       ↓
Bean Ready है (Application Use करती है)
       ↓
@PreDestroy Method चलता है
       ↓
DisposableBean.destroy() चलता है
       ↓
Custom destroy-method चलता है
```

---

## Lifecycle का Simple Example

```java
@Component
class DatabaseConnection {

    @PostConstruct
    public void initialize() {
        // Bean बनने के बाद — Connection Open करो
        System.out.println("DB Connection Opening...");
    }

    @PreDestroy
    public void cleanup() {
        // Application बंद होने से पहले — Connection Close करो
        System.out.println("DB Connection Closing...");
    }
}
```

---

Java Object में यह होता?

नहीं।

तुम्हें खुद `try-finally` लिखना पड़ता।

---

# ApplicationContext में Bean कैसे ढूँढें?

```java
ApplicationContext ctx = SpringApplication.run(App.class);

// Type से
PaymentService ps = ctx.getBean(PaymentService.class);

// Name से
PaymentService ps = (PaymentService) ctx.getBean("paymentService");

// Name + Type से
PaymentService ps = ctx.getBean("paymentService", PaymentService.class);
```

---

# Spring Beans की Real Life में कमाल

---

## Stateless Beans (सबसे Common)

```java
@Service
class TaxCalculator {

    public double calculate(double amount) {
        return amount * 0.18; // GST
    }
}
```

यह Bean Stateless है।

हर कोई share कर सकता है।

Singleton Perfect है।

---

## Stateful Beans (Careful!)

```java
@Component
@Scope("prototype")  // हर बार नया चाहिए
class ShoppingCart {

    private List<Item> items = new ArrayList<>();

    public void addItem(Item item) {
        items.add(item);
    }
}
```

Shopping Cart Stateful है।

हर User का अलग Cart चाहिए।

इसलिए Prototype या Session Scope।

---

# Interview Questions

---

## Q1. Java Object और Spring Bean में क्या अंतर है?

**Answer:**

Java Object सिर्फ एक Memory में बना Object है — कोई Management नहीं।

Spring Bean एक **Managed Object** है। Spring:
- इसे बनाता है
- Dependencies Inject करता है
- Lifecycle manage करता है
- Scope control करता है
- Destroy करता है

---

## Q2. BeanDefinition क्या है और कब बनती है?

**Answer:**

BeanDefinition एक **Blueprint** है जो Spring रखता है Bean बनाने से पहले।

Component Scan के दौरान `@Component` देखते ही BeanDefinition बनती है।

Actual Object (Bean Instance) बाद में बनता है — Context Refresh के समय।

---

## Q3. Singleton और Prototype Scope में अंतर?

**Answer:**

```text
Singleton  → पूरी Application में एक ही Object
           → Default Scope
           → Stateless Beans के लिए Best

Prototype  → हर बार माँगने पर नया Object
           → @Scope("prototype") लगाना पड़ता है
           → Stateful Beans के लिए
```

---

## Q4. @PostConstruct और @PreDestroy क्या करते हैं?

**Answer:**

```java
@PostConstruct → Bean Ready होने के बाद चलता है
                 (Resources initialize करने के लिए)

@PreDestroy    → Application बंद होने से पहले चलता है
                 (Resources cleanup के लिए)
```

---

## Q5. Singleton Bean Thread-Safe है?

**Answer:**

Default में **नहीं**।

Singleton का मतलब है एक Object।

अगर Multiple Threads उसे access करें और वह Stateful हो — Race Condition हो सकती है।

Solution:
- Beans को Stateless रखो
- या Synchronized करो
- या Prototype Scope use करो

---

# Best Practices

---

## 1. Beans को Stateless रखो

```java
// ✅ Stateless — Singleton Safe
@Service
class PaymentProcessor {
    public boolean process(Payment payment) {
        // सिर्फ Logic, कोई State नहीं
        return payment.getAmount() > 0;
    }
}
```

---

## 2. Lifecycle Callbacks का Use करो

```java
@Component
class CacheManager {

    @PostConstruct
    public void loadCache() {
        // Startup पर Cache Load करो
    }

    @PreDestroy
    public void clearCache() {
        // Shutdown पर Cache Clear करो
    }
}
```

---

## 3. Scope Wisely Choose करो

```java
// Service Layer → Singleton (default)
@Service
class UserService { }

// Per-Request → Request Scope
@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
class RequestContext { }
```

---

# Common Mistakes

---

## Mistake 1 — Singleton में State रखना

```java
// ❌ गलत — Singleton में Mutable State
@Service
class OrderService {
    private List<Order> orders = new ArrayList<>();  // Shared State!

    public void addOrder(Order o) {
        orders.add(o);  // Thread-Unsafe!
    }
}
```

---

## Mistake 2 — Prototype को Singleton में Inject करना

```java
// ❌ गलत — Prototype एक बार ही inject होगी
@Service  // Singleton
class ReportService {

    @Autowired
    ReportBuilder builder;  // Prototype — लेकिन एक बार inject हुई!
}
```

Solution: `ApplicationContext.getBean()` या `@Lookup` use करो।

---

## Mistake 3 — @PostConstruct में Heavy Work

```java
// ❌ गलत — Application Start Slow होगी
@Component
class DataLoader {

    @PostConstruct
    public void loadAllData() {
        // 10 लाख Records Load — Application Start बहुत Slow!
    }
}

// ✅ बेहतर — ApplicationReadyEvent use करो
@Component
class DataLoader {

    @EventListener(ApplicationReadyEvent.class)
    public void loadAllData() {
        // Application Ready के बाद Background में Load
    }
}
```

---

# इस Chapter का निष्कर्ष

```text
Java Object    = तुमने खुद बनाया — Spring अनजान
BeanDefinition = Spring का Blueprint — Object अभी नहीं बना
Bean Instance  = Spring ने बनाया — Container में है
Spring Bean    = Instance + Lifecycle + Scope + DI
```

---

जब तुम कहते हो:

> "Bean एक Object है।"

अब तुम जानते हो:

> "Bean एक **Managed Object** है, जिसका Lifecycle Spring Control करता है।"

---

### अगला Chapter

अब सबसे बड़ा सवाल:

> **"यह सब Manage कौन करता है?"**

Spring का Heart — **IoC Container**।

BeanFactory क्या है?

ApplicationContext क्या है?

दोनों में क्या अंतर है?

अगला Chapter: **IoC Container अंदर से कैसे चलता है?**
