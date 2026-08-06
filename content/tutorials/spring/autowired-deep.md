एक Junior Developer ने एक दिन पूछा:

> **"@Autowired कैसे जादू करता है?"**

Senior Developer मुस्कुराया।

> "जादू नहीं — Reflection।"

---

# Chapter 25 – @Autowired अंदर क्या करता है?

---

तुम लिखते हो:

```java
@Service
class OrderService {

    @Autowired
    private EmailService emailService;

}
```

और Spring automatically `emailService` में Object डाल देता है।

तुमने `new` नहीं किया।

तुमने कुछ नहीं किया।

लेकिन Object आ गया।

**कैसे?**

---

# Step 1 – Java Reflection क्या है?

पहले Reflection समझो।

Java में हर Class का एक Mirror होता है।

नाम है:

```java
Class<?>
```

---

इस Mirror से तुम Class के बारे में सब जान सकते हो।

**Runtime पर।**

---

```java
// Class का Mirror लो
Class<?> clazz = EmailService.class;

// सभी Fields देखो
Field[] fields = clazz.getDeclaredFields();

// सभी Methods देखो
Method[] methods = clazz.getDeclaredMethods();

// Annotations देखो
Annotation[] annotations = clazz.getAnnotations();
```

---

## Field को खुद Set करो (Private भी!)

```java
class OrderService {
    private EmailService emailService;  // private field
}

// Mirror से Field लो
Field field = OrderService.class.getDeclaredField("emailService");

// Private access खोलो
field.setAccessible(true);

// Value Set करो
field.set(orderServiceInstance, emailServiceInstance);
```

यही Spring करता है।

---

# Step 2 – @Autowired कब और कैसे काम करता है?

---

पिछले Chapter में हमने पढ़ा:

Bean बनने के बाद **BeanPostProcessor** run होता है।

`@Autowired` को Process करने वाला BeanPostProcessor है:

```java
AutowiredAnnotationBeanPostProcessor
```

---

## यह क्या करता है?

```text
1. OrderService Bean बनी (Object create हुआ)
         ↓
2. AutowiredAnnotationBeanPostProcessor चला
         ↓
3. OrderService की सभी Fields Scan कीं
         ↓
4. @Autowired वाली Fields ढूँढीं
         ↓
5. emailService Field मिली
         ↓
6. EmailService Type की Bean ApplicationContext में ढूँढी
         ↓
7. Bean मिली → Reflection से Field Set किया
         ↓
8. orderService.emailService = emailServiceBean
         ↓
9. Done!
```

---

## Source Code जैसा सोचो

```java
// Spring अंदर से यह कर रहा है:

OrderService orderServiceBean = new OrderService();

// Fields Scan करो
for (Field field : OrderService.class.getDeclaredFields()) {

    // @Autowired है?
    if (field.isAnnotationPresent(Autowired.class)) {

        // इस Field का Type क्या है?
        Class<?> fieldType = field.getType(); // EmailService.class

        // ApplicationContext में इस Type की Bean ढूँढो
        Object dependency = applicationContext.getBean(fieldType);

        // Private Field Access खोलो
        field.setAccessible(true);

        // Set करो
        field.set(orderServiceBean, dependency);
    }
}
```

यही `@Autowired` का असली काम है।

---

# Step 3 – Spring कैसे सही Bean ढूँढता है?

---

`emailService` Field का Type है `EmailService`।

Spring ने ApplicationContext में ढूँढा।

---

## Case 1 – एक ही Bean मिली

```java
@Service
class EmailService { }
```

सिर्फ एक EmailService है।

Spring ने ले ली।

✅ Done।

---

## Case 2 – दो Beans मिलीं (Ambiguity!)

```java
@Service
class GmailService implements EmailService { }

@Service
class SendgridService implements EmailService { }
```

दोनों `EmailService` Type की हैं।

Spring Confused हो गया।

```text
NoUniqueBeanDefinitionException:
Expected single matching bean but found 2:
gmailService, sendgridService
```

---

## Solution 1 – @Qualifier

```java
@Autowired
@Qualifier("gmailService")
private EmailService emailService;
```

Spring को बता दो — कौन सी चाहिए।

---

## Solution 2 – @Primary

```java
@Service
@Primary  // ← यह Default होगी
class GmailService implements EmailService { }

@Service
class SendgridService implements EmailService { }
```

अब बिना @Qualifier भी GmailService मिलेगी।

---

## Solution 3 – Variable Name से Match

```java
// Variable का नाम "gmailService" है
@Autowired
private EmailService gmailService;  // Spring नाम से match करेगा
```

Spring पहले Type से ढूँढता है।

अगर Multiple मिलें, तो Variable Name से match करता है।

---

# Step 4 – तीन तरह के @Autowired

---

## Type 1 – Field Injection (सबसे Popular, लेकिन Best नहीं)

```java
@Service
class OrderService {

    @Autowired
    private EmailService emailService;

}
```

Simple है।

लेकिन Testing में Problem।

Field Private है — Test में Inject नहीं कर सकते बिना Reflection के।

---

## Type 2 – Constructor Injection (Best Practice ✅)

```java
@Service
class OrderService {

    private final EmailService emailService;

    @Autowired  // Spring Boot 4.3+ में @Autowired ज़रूरी नहीं
    public OrderService(EmailService emailService) {
        this.emailService = emailService;
    }

}
```

क्यों Best है?

```text
✅ final field → Immutable
✅ Testing आसान (Constructor call करो)
✅ Circular Dependency जल्दी पकड़ी जाती है
✅ Spring इसे Prefer करता है
```

---

## Type 3 – Setter Injection (Optional Dependencies के लिए)

```java
@Service
class OrderService {

    private EmailService emailService;

    @Autowired(required = false)  // Optional Dependency
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }

}
```

अगर EmailService नहीं मिली — null रहेगी।

Application Start होगी।

---

# Step 5 – @Autowired किस समय होता है?

```text
Bean बनी (Constructor call)
         ↓
Before Init (BeanPostProcessor)
         ↓
@Autowired Process होता है ← यहाँ
  (AutowiredAnnotationBeanPostProcessor)
         ↓
@PostConstruct चलता है
         ↓
After Init (BeanPostProcessor)
         ↓
Bean Ready
```

---

**Important:**

`@PostConstruct` Method में Autowired Dependencies available होती हैं।

क्योंकि Inject पहले होता है।

```java
@Service
class DatabaseService {

    @Autowired
    private DataSource dataSource;  // पहले Inject होगा

    @PostConstruct
    public void init() {
        // यहाँ dataSource available है ✅
        connection = dataSource.getConnection();
    }
}
```

---

# Step 6 – required = false क्या करता है?

Default में:

```java
@Autowired
private SmsService smsService;
```

अगर `SmsService` की कोई Bean नहीं है:

```text
NoSuchBeanDefinitionException: 
No qualifying bean of type 'SmsService' available
```

Application Start नहीं होती।

---

Optional Dependency के लिए:

```java
@Autowired(required = false)
private SmsService smsService;  // null रहेगी अगर नहीं मिली
```

या Java Optional:

```java
@Autowired
private Optional<SmsService> smsService;
```

---

# Step 7 – @Autowired Collections

```java
@Service
class NotificationService {

    @Autowired
    private List<NotificationChannel> channels;
    // सभी NotificationChannel Beans inject होंगी

}

@Component
class EmailChannel implements NotificationChannel { }

@Component
class SmsChannel implements NotificationChannel { }

@Component
class WhatsAppChannel implements NotificationChannel { }
```

Spring ने `List<NotificationChannel>` देखा।

सभी `NotificationChannel` Beans ढूँढीं।

List में सब डाल दिया।

```text
channels = [emailChannel, smsChannel, whatsAppChannel]
```

---

## Real Project Use Case

```java
@Service
class PaymentService {

    @Autowired
    private List<PaymentGateway> gateways;
    // RazorpayGateway, StripeGateway, PaypalGateway

    public boolean processPayment(Payment payment) {
        for (PaymentGateway gateway : gateways) {
            if (gateway.supports(payment)) {
                return gateway.process(payment);
            }
        }
        throw new NoGatewayException();
    }
}
```

Strategy Pattern + @Autowired List = Powerful!

---

# Interview Questions

---

## Q1. @Autowired कैसे काम करता है अंदर से?

**Answer:**

`AutowiredAnnotationBeanPostProcessor` Spring का BeanPostProcessor है।

Bean बनने के बाद:
1. Class की सभी Fields Scan करता है
2. `@Autowired` Annotation ढूँढता है
3. Field का Type देखता है
4. ApplicationContext में उस Type की Bean ढूँढता है
5. Java Reflection से `field.setAccessible(true)` → `field.set()` करता है

---

## Q2. Field Injection vs Constructor Injection — कौन सा Better है?

**Answer:**

Constructor Injection Better है।

कारण:
- `final` field → Immutable → Thread Safe
- Testing में आसान (Framework के बिना भी Constructor Call कर सकते हो)
- Circular Dependency Application Start पर ही Detect होती है
- IntelliJ और Checkstyle Field Injection को Warn करते हैं

---

## Q3. दो Same Type की Beans हों तो क्या करें?

**Answer:**

तीन Solutions:
1. `@Qualifier("beanName")` — Specific Bean चुनो
2. `@Primary` — Default Bean mark करो
3. Variable Name — Spring Variable Name से Bean Match करता है

---

## Q4. @Autowired और @Inject में क्या फर्क है?

**Answer:**

```text
@Autowired → Spring का Annotation
@Inject    → Java CDI का Annotation (JSR-330)
```

Both same काम करते हैं।

लेकिन `@Autowired` में `required = false` है।

`@Inject` में नहीं।

---

## Q5. अगर Bean null आए @Autowired के बाद, तो क्या कारण हो सकते हैं?

**Answer:**

```text
1. Class पर @Component नहीं है
2. Class Spring के Scan Package के बाहर है
3. @Autowired(required = false) है और Bean नहीं मिली
4. Object new से बनाया है — Spring Manage नहीं करता
5. Test में Spring Context नहीं है
```

---

# Best Practices

---

## 1. Constructor Injection Use करो

```java
// ✅ Best Practice
@Service
class OrderService {

    private final PaymentService paymentService;
    private final EmailService emailService;

    public OrderService(PaymentService paymentService,
                        EmailService emailService) {
        this.paymentService = paymentService;
        this.emailService = emailService;
    }
}
```

---

## 2. Lombok के साथ और Clean

```java
// ✅ Lombok + Constructor Injection
@Service
@RequiredArgsConstructor  // final fields के लिए Constructor बनाता है
class OrderService {

    private final PaymentService paymentService;
    private final EmailService emailService;

}
```

---

## 3. Interface पर Inject करो, Implementation पर नहीं

```java
// ❌ Implementation पर
@Autowired
private GmailService gmailService;

// ✅ Interface पर — Loose Coupling
@Autowired
private EmailService emailService;
```

---

# Common Mistakes

---

## Mistake 1 — new से बना Object Inject नहीं होता

```java
// ❌ गलत
OrderService orderService = new OrderService();
// emailService null होगी!

// ✅ सही — Spring से लो
@Autowired
OrderService orderService;
```

---

## Mistake 2 — @PostConstruct में Null

```java
// ❌ Field Inject होने से पहले Constructor में use किया
@Service
class MyService {

    @Autowired
    EmailService emailService;

    public MyService() {
        emailService.send();  // NullPointerException!
        // Constructor के समय @Autowired नहीं हुआ
    }

    @PostConstruct
    public void init() {
        emailService.send();  // ✅ यहाँ ठीक है
    }
}
```

---

## Mistake 3 — Circular Dependency (Field Injection में छुपी रहती है)

```java
// ❌ Field Injection — Circular Dependency छुपी रहती है
@Service
class A {
    @Autowired B b;
}

@Service
class B {
    @Autowired A a;
}
// Start होगी लेकिन Runtime में Problem

// ✅ Constructor Injection — Start पर Error
@Service
class A {
    private final B b;
    A(B b) { this.b = b; }
}
// Start नहीं होगी — Clear Error Message
```

---

# इस Chapter का निष्कर्ष

`@Autowired` = Java Reflection + BeanPostProcessor

```text
Bean बनी
    ↓
AutowiredAnnotationBeanPostProcessor
    ↓
@Autowired Fields Scan
    ↓
ApplicationContext से Bean ढूँढो
    ↓
Reflection से Field Set करो
    ↓
Done
```

---

यह Magic नहीं है।

यह Engineering है।

---

### अगला Chapter

अब हम Constructor Injection को Deep में समझेंगे।

Spring Constructor कैसे चुनता है?

अगर दो Constructor हों तो?

अगर Dependency Missing हो तो?

अगला Chapter: **Constructor Injection – Deep Internal**
