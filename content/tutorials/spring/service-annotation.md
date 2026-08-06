पिछले Chapter में हमने देखा।

`@Component` लिखते हो, तो Spring पूरी Journey चलाता है।

Bean बनाता है।

Inject करता है।

सब कुछ।

---

लेकिन एक दिन Team Meeting में Senior Developer ने एक सवाल उठाया।

---

# Chapter 22 – @Service क्यों आया?

---

Meeting Room में Senior Developer ने Code दिखाया:

```java
@Component
class UserService { }

@Component
class UserRepository { }

@Component
class UserController { }
```

और पूछा:

> **"तीनों पर @Component है। तो मुझे कैसे पता चलेगा कि कौन सी Class क्या करती है?"**

पूरा Room चुप।

---

# Real Project Problem

**ShopKart** का Project था।

500+ Classes थीं।

हर Class पर `@Component` था।

```text
@Component class OrderService       → Business Logic
@Component class OrderRepository    → Database
@Component class OrderController    → HTTP Request
@Component class OrderMapper        → Data Transform
@Component class OrderValidator     → Validation
@Component class OrderCache         → Caching
```

एक नया Developer Join हुआ।

उसने Code खोला।

सब Classes पर `@Component`।

वह समझ नहीं पाया:

> **"यह Class Business Logic है? Database है? या HTTP Handle करती है?"**

---

## Real Life Analogy

एक Hospital है।

हर Staff को एक ही ID Card दिया — **"Employee"**।

```text
Employee → Doctor
Employee → Nurse
Employee → Receptionist
Employee → Lab Technician
Employee → Cleaner
```

Hospital चल रही है।

लेकिन...

जब Emergency आई, तो Security ने सबको अंदर जाने दिया।

क्योंकि सबका ID Card एक जैसा था।

---

Hospital Management ने decide किया:

> "हर Role को अलग ID Card देंगे।"

```text
Doctor ID      → Special Access (Operation Theater)
Nurse ID       → Ward Access
Receptionist ID → Reception Only
Lab ID         → Lab Access
```

अब System Organized हो गया।

---

# Spring ने यही किया

Spring ने सोचा:

> "@Component एक Generic Label है।
> लेकिन हर Layer की अपनी Role होती है।
> तो हर Layer को अपना Annotation होना चाहिए।"

इसीलिए आए:

```text
@Component   → Generic (सब कुछ)
@Service     → Business Logic Layer
@Repository  → Data Access Layer (Database)
@Controller  → Web Layer (HTTP Requests)
```

---

# Technical सच्चाई

अब एक Important बात।

> **क्या @Service, @Repository, @Controller में @Component से अलग कोई Magic है?**

देखो `@Service` का Source Code:

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component           // ← यहाँ देखो!
public @interface Service {
    @AliasFor(annotation = Component.class)
    String value() default "";
}
```

`@Service` के अंदर `@Component` है।

यानी...

```text
@Service    = @Component + "Service" Label
@Repository = @Component + "Repository" Label
@Controller = @Component + "Controller" Label
```

---

## तो क्या ये सिर्फ नाम हैं?

पूरी तरह नहीं।

यहाँ तीन अलग-अलग बातें हैं।

---

# Difference 1 – Readability (सबसे बड़ा फायदा)

```java
// ❌ पढ़ने में confusion
@Component
class UserService { }

// ✅ Crystal Clear
@Service
class UserService { }
```

नया Developer देखते ही समझ जाता है:

> "यह Business Logic है।"

---

# Difference 2 – @Repository का Special Behaviour

यहाँ Spring कुछ **Extra** करता है।

`@Repository` पर Spring एक Special Feature Add करता है:

**Exception Translation।**

---

## क्या होता है Exception Translation में?

Database Layer में बहुत तरह के Exceptions आते हैं।

```text
Hibernate Exception
JDBC Exception
JPA Exception
```

ये सब अलग-अलग Frameworks की Exceptions हैं।

अगर तुम इन्हें सीधे Business Layer में Handle करो:

```java
@Service
class UserService {

    void createUser() {
        try {
            userRepository.save(user);
        } catch (HibernateException e) {   // ❌ Business Layer में Hibernate?
            // handle
        }
    }
}
```

तुम्हारा Business Layer Hibernate से Tightly Coupled हो गया।

---

## Spring का Solution

`@Repository` लगाओ।

Spring automatically:

```text
HibernateException
        ↓
DataAccessException (Spring का अपना)
```

अब Business Layer को Hibernate नहीं पता।

```java
@Service
class UserService {

    void createUser() {
        try {
            userRepository.save(user);
        } catch (DataAccessException e) {  // ✅ Spring की Exception
            // handle
        }
    }
}
```

यह **Exception Translation** है।

और यह सिर्फ `@Repository` पर होता है।

`@Component` पर नहीं।

---

# Difference 3 – AOP और Future Behaviour

Spring AOP (Aspect Oriented Programming) में।

तुम एक Rule लगा सकते हो:

> "सभी @Service Methods में Logging होगी।"

```java
@Aspect
@Component
class LoggingAspect {

    @Before("@within(org.springframework.stereotype.Service)")
    public void logServiceMethod() {
        // सभी @Service Methods पर Logging
    }
}
```

अगर तुमने `@Component` use किया होता...

तो Controller, Repository, सब पर Logging होती।

`@Service` ने Layer को अलग रखा।

---

# चारों Annotations एक जगह

```text
┌──────────────────────────────────────────────────┐
│  Annotation    │  Layer       │  Extra Behaviour  │
├──────────────────────────────────────────────────┤
│  @Component    │  Generic     │  कोई नहीं        │
│  @Service      │  Business    │  कोई नहीं        │
│                │  Logic       │  (Semantic Only)  │
│  @Repository   │  Data Access │  Exception        │
│                │  (Database)  │  Translation ✅   │
│  @Controller   │  Web Layer   │  Request Mapping  │
│                │  (HTTP)      │  Support ✅       │
└──────────────────────────────────────────────────┘
```

---

# Real Project में कब क्या Use करें?

---

## @Service — Business Logic

```java
@Service
class PaymentService {

    public void processPayment(Order order) {
        // Business Rules यहाँ हैं
        validateOrder(order);
        chargeCard(order);
        sendConfirmation(order);
    }
}
```

---

## @Repository — Database Operations

```java
@Repository
class UserRepository {

    public User findById(Long id) {
        // Database से Data लाओ
        return entityManager.find(User.class, id);
    }

    public void save(User user) {
        entityManager.persist(user);
    }
}
```

---

## @Controller — HTTP Requests

```java
@Controller
class UserController {

    @GetMapping("/users/{id}")
    public String getUser(@PathVariable Long id, Model model) {
        // HTTP Request Handle करो
        model.addAttribute("user", userService.findById(id));
        return "user-detail";
    }
}
```

---

## @RestController क्या है?

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Controller
@ResponseBody   // ← यह Extra है
public @interface RestController {
}
```

`@RestController = @Controller + @ResponseBody`

---

```java
@RestController
class UserRestController {

    @GetMapping("/api/users/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);  // JSON Return होगा
    }
}
```

---

# ShopKart का Code अब Organized हो गया

```java
// Business Logic
@Service
class OrderService { }

// Database
@Repository
class OrderRepository { }

// HTTP Requests
@RestController
class OrderController { }

// Utility
@Component
class OrderMapper { }

// Configuration
@Configuration
class AppConfig { }
```

अब नया Developer Code खोले।

तुरंत समझ जाए:

> "यह Service है — Business Logic।"
> "यह Repository है — Database।"
> "यह Controller है — HTTP।"

---

# Interview Questions

---

## Q1. @Service और @Component में क्या अंतर है?

**Answer:**

Technically `@Service` के अंदर `@Component` ही है।

फर्क सिर्फ **Semantic** है — Layer की पहचान के लिए।

लेकिन यह Semantic Difference बड़े Projects में बहुत Important है:
- Code Readability
- AOP में Layer-specific Behaviour
- Architecture की Clarity

---

## Q2. @Repository को @Component से replace कर सकते हैं?

**Answer:**

Technically हाँ।

लेकिन तुम **Exception Translation** खो दोगे।

`@Repository` Spring की PersistenceExceptionTranslationPostProcessor को activate करता है जो Database Exceptions को Spring के DataAccessException में translate करती है।

---

## Q3. @Component कब use करना चाहिए?

**Answer:**

जब Class किसी specific Layer (Service/Repository/Controller) में fit नहीं होती।

जैसे:
- Utility Classes
- Helper Classes
- Custom Validators
- Event Listeners

```java
@Component
class EmailTemplateBuilder { }

@Component
class PasswordEncoder { }
```

---

## Q4. क्या @Service पर @Repository का Exception Translation मिलेगा?

**Answer:**

नहीं।

Exception Translation केवल `@Repository` पर होता है।

इसीलिए Database code हमेशा `@Repository` में रखना चाहिए।

---

## Q5. @RestController और @Controller में क्या फर्क है?

**Answer:**

```text
@Controller
  → HTML View Return करता है (MVC)
  → @ResponseBody manually लगाना पड़ता है JSON के लिए

@RestController
  → JSON/XML Return करता है (REST API)
  → @ResponseBody already include है
```

---

# Best Practices

---

## 1. सही Layer पर सही Annotation

```java
// ✅ सही
@Service
class UserService { }          // Business Logic

@Repository
class UserRepository { }       // Database

@RestController
class UserController { }       // HTTP API

// ❌ गलत
@Component
class UserService { }          // Layer unclear
```

---

## 2. Thin Controller, Fat Service

```java
// ✅ Business Logic Service में रखो
@RestController
class OrderController {

    @PostMapping("/orders")
    public Order createOrder(@RequestBody OrderRequest req) {
        return orderService.createOrder(req);  // Service call करो
    }
}

@Service
class OrderService {

    public Order createOrder(OrderRequest req) {
        // सारी Business Logic यहाँ
        validateStock(req);
        calculatePrice(req);
        applyDiscount(req);
        return saveOrder(req);
    }
}
```

---

## 3. Repository सिर्फ Data Access के लिए

```java
// ✅ Repository सिर्फ DB Operations
@Repository
class UserRepository {
    User findByEmail(String email);
    void save(User user);
    void delete(Long id);
}

// ❌ Business Logic Repository में नहीं
@Repository
class UserRepository {
    User findByEmailAndValidateAndSendEmail(String email); // गलत!
}
```

---

# Common Mistakes

---

## Mistake 1 — Controller में Business Logic

```java
// ❌ गलत
@RestController
class OrderController {

    @PostMapping("/orders")
    public Order createOrder(@RequestBody OrderRequest req) {
        // Controller में Business Logic — बहुत बुरा!
        if (req.getAmount() <= 0) throw new Exception();
        Order order = new Order();
        order.setStatus("PENDING");
        orderRepository.save(order);
        emailService.send(order);
        return order;
    }
}
```

---

## Mistake 2 — Service में Database Direct Access

```java
// ❌ गलत
@Service
class OrderService {

    @Autowired
    EntityManager em;  // Service सीधे Database छू रही है

    public Order findOrder(Long id) {
        return em.find(Order.class, id);  // Repository की ज़रूरत थी
    }
}
```

---

# इस Chapter का निष्कर्ष

```text
@Component = Raw Material (कोई भी काम)

@Service     = Engineer (Business Logic)
@Repository  = Clerk (Database Record)
@Controller  = Receptionist (HTTP Requests)
```

तीनों के अंदर `@Component` है।

लेकिन तीनों का **Role** अलग है।

Spring इन Roles से:

1. Code को Organize रखता है
2. AOP Apply करना आसान बनाता है
3. Exception Handling improve करता है

---

### अगला Chapter

अब एक और बड़ा सवाल है:

> **"Bean आखिर है क्या?"**

सब कहते हैं — "Bean एक Object है।"

लेकिन क्या यह पूरी सच्चाई है?

Java Object और Spring Bean में क्या अंतर है?

अगले Chapter में हम यही खोलेंगे।
