एक Interview में Interviewer ने पूछा:

> **"Spring का Heart क्या है?"**

Candidate बोला:

> "IoC Container।"

Interviewer ने पूछा:

> **"अंदर से कैसे काम करता है?"**

Candidate चुप।

---

# Chapter 24 – IoC Container अंदर से कैसे चलता है?

---

आज हम Spring का Heart खोलेंगे।

---

# पहले एक Real Problem

**MediCare** — एक बड़ा Hospital Management System।

System में हैं:

```text
PatientService
DoctorService
AppointmentService
BillingService
PharmacyService
ReportService
```

हर Service को दूसरी Services चाहिए।

```text
AppointmentService को चाहिए:
  - PatientService
  - DoctorService
  - NotificationService

BillingService को चाहिए:
  - AppointmentService
  - InsuranceService
  - TaxService
```

अगर तुम यह सब खुद Manage करो...

```java
PatientService ps = new PatientService();
DoctorService ds = new DoctorService();
NotificationService ns = new NotificationService();
AppointmentService as = new AppointmentService(ps, ds, ns);
```

500 Classes में यह करना?

नामुमकिन।

---

यहीं IoC Container का काम शुरू होता है।

---

# IoC Container क्या है?

IoC = **Inversion of Control**

Control का Inversion।

---

पहले:

```text
तुम → Object बनाते थे
तुम → Dependencies देते थे
तुम → Lifecycle Manage करते थे
```

IoC के साथ:

```text
Spring → Object बनाता है
Spring → Dependencies देता है
Spring → Lifecycle Manage करता है
```

Control तुमसे Spring के पास चला गया।

यही Inversion है।

---

## Real Life Analogy

पुराना तरीका:

> "Employee खुद Laptop खरीदे, खुद Internet लगाए, खुद Email बनाए।"

IoC का तरीका:

> "IT Department सब करेगा। Employee सिर्फ आए और काम करे।"

Control Employee के पास नहीं रहा।

IT Department के पास आ गया।

---

# Spring में दो IoC Containers हैं

```text
1. BeanFactory
2. ApplicationContext
```

दोनों IoC Containers हैं।

लेकिन बहुत फर्क है।

---

# BeanFactory – Basic Container

```java
BeanFactory factory = new XmlBeanFactory(new ClassPathResource("beans.xml"));
PaymentService ps = (PaymentService) factory.getBean("paymentService");
```

यह सबसे Basic Container है।

---

## BeanFactory क्या करता है?

```text
✅ Beans को Define करता है
✅ Beans को बनाता है
✅ Dependencies Inject करता है
✅ Lazy Loading (माँगने पर Object बनाता है)
```

---

## BeanFactory क्या नहीं करता?

```text
❌ Annotation Support नहीं (@Component, @Autowired)
❌ AOP Support Limited है
❌ Event Publishing नहीं करता
❌ Internationalization (i18n) नहीं
❌ Environment/Profile Support नहीं
```

---

## Real Life Analogy

BeanFactory = Basic IT Department

```text
Basic IT:
  ✅ Laptop देता है
  ✅ Mouse देता है
  ❌ Training नहीं देता
  ❌ Onboarding नहीं करता
  ❌ Monitoring नहीं करता
```

---

# ApplicationContext – Full-Featured Container

```java
ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
// या
ApplicationContext ctx = SpringApplication.run(App.class, args);
```

यह Production का Real Container है।

---

## ApplicationContext क्या-क्या करता है?

```text
✅ BeanFactory का सब कुछ
✅ Annotation Support (@Component, @Autowired, @Service...)
✅ AOP Integration
✅ Event Publishing (ApplicationEvent)
✅ Internationalization (MessageSource)
✅ Environment और Profiles
✅ ResourceLoader (Files, URLs)
✅ BeanFactoryPostProcessor Support
✅ BeanPostProcessor Support
✅ Eager Initialization (Start होते ही सब Beans बनाता है)
```

---

## Real Life Analogy

ApplicationContext = Advanced IT Department + HR + Training + Admin

```text
Advanced:
  ✅ Laptop, Mouse देता है (BeanFactory)
  ✅ Training देता है (AOP)
  ✅ Onboarding करता है (Lifecycle)
  ✅ Events का Management (Event Publishing)
  ✅ सभी Employees की Monitoring (BeanPostProcessor)
  ✅ Different Rules for Different Cities (Profiles)
```

---

# BeanFactory vs ApplicationContext

```text
┌────────────────────────────────────────────────────┐
│  Feature                │ BeanFactory │ AppContext  │
├────────────────────────────────────────────────────┤
│  Basic DI               │     ✅      │     ✅      │
│  Annotation Support     │     ❌      │     ✅      │
│  AOP                    │  Limited   │     ✅      │
│  Events                 │     ❌      │     ✅      │
│  i18n                   │     ❌      │     ✅      │
│  Profiles               │     ❌      │     ✅      │
│  Lazy Initialization    │  Default   │  Optional  │
│  Eager Initialization   │     ❌      │  Default   │
│  BeanPostProcessor      │  Manual    │ Automatic  │
│  Production Use         │    Rare    │  Always    │
└────────────────────────────────────────────────────┘
```

---

# ApplicationContext के अंदर क्या-क्या है?

```text
ApplicationContext
  ├── BeanFactory (core engine)
  │     └── BeanDefinitionRegistry
  │           └── Map<String, BeanDefinition>
  │
  ├── BeanFactoryPostProcessor (Beans बनने से पहले)
  ├── BeanPostProcessor (Beans बनने के बाद)
  ├── MessageSource (i18n)
  ├── ApplicationEventPublisher (Events)
  ├── ResourceLoader (Files/URLs)
  └── Environment (Properties/Profiles)
```

---

# BeanFactoryPostProcessor – Beans बनने से पहले का Magic

यह एक बहुत Powerful Concept है।

---

## यह क्या करता है?

BeanDefinition बन जाने के बाद...

लेकिन Bean Instance बनने से पहले...

BeanFactoryPostProcessor Run होता है।

यह **BeanDefinition को Modify कर सकता है।**

---

```text
@Component Scan
      ↓
BeanDefinitions बनीं
      ↓
BeanFactoryPostProcessor Run होते हैं  ← यहाँ
      ↓
Bean Instances बनते हैं
```

---

## Real Example — PropertySourcesPlaceholderConfigurer

```java
@Component
class DatabaseConfig {

    @Value("${db.url}")
    private String dbUrl;

}
```

`application.properties` में है:

```properties
db.url=jdbc:mysql://localhost:3306/mydb
```

---

Spring ने `@Value("${db.url}")` देखा।

`${db.url}` एक Placeholder है।

**PropertySourcesPlaceholderConfigurer** (एक BeanFactoryPostProcessor) ने:

```text
BeanDefinition में देखा: ${db.url}
         ↓
application.properties खोली
         ↓
db.url = jdbc:mysql://localhost:3306/mydb मिला
         ↓
BeanDefinition Update की
         ↓
अब Bean बनेगी तो dbUrl = "jdbc:mysql://..."
```

---

## Custom BeanFactoryPostProcessor

```java
@Component
public class CustomBFPP implements BeanFactoryPostProcessor {

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory bf) {
        // BeanDefinition में बदलाव करो — Bean बनने से पहले
        BeanDefinition bd = bf.getBeanDefinition("paymentService");
        bd.setScope(BeanDefinition.SCOPE_PROTOTYPE);  // Scope बदल दो!
    }
}
```

---

# BeanPostProcessor – Beans बनने के बाद का Magic

यह Bean बनने के **बाद** चलता है।

दो Methods होते हैं:

```java
public interface BeanPostProcessor {

    // Bean Initialize होने से पहले
    Object postProcessBeforeInitialization(Object bean, String beanName);

    // Bean Initialize होने के बाद
    Object postProcessAfterInitialization(Object bean, String beanName);
}
```

---

## इसका Use कहाँ होता है?

```text
@Autowired        → AutowiredAnnotationBeanPostProcessor
@PostConstruct    → CommonAnnotationBeanPostProcessor
AOP Proxy         → AbstractAutoProxyCreator
@Async            → AsyncAnnotationBeanPostProcessor
@Transactional    → PersistenceAnnotationBeanPostProcessor
```

यानी Spring की सबसे Powerful Features BeanPostProcessor से काम करती हैं।

---

## Real Life Analogy

BeanPostProcessor = Quality Check Team

```text
Employee Join हुआ (Bean बनी)
         ↓
QC Team:
  Before Init:
    ✅ Background Verification
    ✅ Documents Check

  After Init:
    ✅ Training Complete?
    ✅ System Access दिया?
    ✅ Mentor Assign किया?
```

अगर कोई Issue मिले — QC Team Employee को Replace भी कर सकती है!

(यही AOP Proxy में होता है — Original Object की जगह Proxy Object आता है)

---

# ApplicationContext का Boot Process

पूरा Boot Process Step-by-Step:

```text
1. SpringApplication.run() call
         ↓
2. ApplicationContext Create होता है
         ↓
3. Environment Prepare होता है
   (Properties, Profiles load)
         ↓
4. BeanDefinitions Register होती हैं
   (Component Scan, @Configuration)
         ↓
5. BeanFactoryPostProcessors Run होते हैं
   (@Value Placeholder resolve)
         ↓
6. Bean Instantiation शुरू
   (Dependencies के Order में)
         ↓
7. BeanPostProcessor → Before Init
         ↓
8. @PostConstruct Methods Run
         ↓
9. BeanPostProcessor → After Init
   (AOP Proxy बनाया जाता है यहाँ)
         ↓
10. ApplicationContext Ready
          ↓
11. ApplicationReadyEvent Publish
          ↓
12. Application Running ✅
```

---

# ApplicationContext के Types

Spring में कई Types के ApplicationContext हैं:

```text
1. AnnotationConfigApplicationContext
   → Java Config (@Configuration) के लिए
   → Spring (without Boot) में

2. ClassPathXmlApplicationContext
   → XML Config के लिए (पुराना तरीका)

3. AnnotationConfigServletWebServerApplicationContext
   → Spring Boot Web Application में Default

4. AnnotationConfigReactiveWebServerApplicationContext
   → Spring Boot WebFlux में
```

---

## Daily Use में?

Spring Boot:

```java
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        ApplicationContext ctx = SpringApplication.run(App.class, args);
        // Spring ने अपने आप सही Context choose किया
    }
}
```

---

# Interview Questions

---

## Q1. BeanFactory और ApplicationContext में क्या फर्क है?

**Answer:**

BeanFactory एक Basic IoC Container है जो Bean Creation और DI करता है।

ApplicationContext BeanFactory को extend करता है और add करता है:
- Annotation Support
- AOP Integration
- Event System
- i18n
- Environment/Profiles
- Eager Initialization

Production में हमेशा ApplicationContext use करते हैं।

---

## Q2. IoC का मतलब क्या है?

**Answer:**

Inversion of Control।

पहले Developer Objects बनाता था और Dependencies manage करता था।

IoC में यह Control Spring के पास है।

Developer सिर्फ Classes लिखता है — Spring बाकी सब करता है।

---

## Q3. BeanFactoryPostProcessor और BeanPostProcessor में क्या अंतर है?

**Answer:**

```text
BeanFactoryPostProcessor:
  → BeanDefinition बनने के बाद
  → Bean Instance बनने से पहले
  → BeanDefinition को modify करता है
  → Example: PropertySourcesPlaceholderConfigurer

BeanPostProcessor:
  → Bean Instance बनने के बाद
  → Before और After Initialization
  → Bean Object को modify/replace कर सकता है
  → Example: AutowiredAnnotationBeanPostProcessor, AOP Proxy
```

---

## Q4. @Transactional कैसे काम करता है? (Advanced)

**Answer:**

BeanPostProcessor।

Spring ने एक `AbstractAutoProxyCreator` बनाया।

जब `@Transactional` Bean बनती है:

```text
Real UserService Object बना
         ↓
BeanPostProcessor → After Init
         ↓
Spring ने देखा: @Transactional है
         ↓
UserService का Proxy बना
         ↓
Container में Real Object की जगह Proxy Store हुआ
         ↓
तुम्हें Proxy मिलता है, Real Object नहीं
```

---

## Q5. Singleton Bean कब बनती है — BeanFactory में और ApplicationContext में?

**Answer:**

```text
BeanFactory:
  → Lazy — getBean() call पर बनती है

ApplicationContext:
  → Eager (Default) — Context Refresh पर बनती है
  → @Lazy लगाओ तो पहले use पर बनती है
```

---

# Best Practices

---

## 1. हमेशा ApplicationContext Use करो

```java
// ❌ Production में नहीं
BeanFactory bf = new XmlBeanFactory(...);

// ✅ Production में
ApplicationContext ctx = SpringApplication.run(App.class, args);
```

---

## 2. Direct Context.getBean() से बचो

```java
// ❌ Anti-Pattern — Spring way नहीं
@RestController
class UserController {

    @Autowired
    ApplicationContext ctx;

    public User getUser() {
        UserService us = ctx.getBean(UserService.class);  // Service Locator Anti-Pattern
        return us.findUser();
    }
}

// ✅ DI Use करो
@RestController
class UserController {

    @Autowired
    UserService userService;

    public User getUser() {
        return userService.findUser();
    }
}
```

---

## 3. ApplicationReadyEvent Use करो Startup Tasks के लिए

```java
@Component
class StartupTask {

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        // Application पूरी तरह Ready होने के बाद
        // Heavy Initialization यहाँ करो
    }
}
```

---

# इस Chapter का निष्कर्ष

```text
IoC Container = Spring का दिल

BeanFactory   = Basic Container (Lazy)
ApplicationContext = Full Container (Eager + Features)

Inside ApplicationContext:
  BeanDefinitionRegistry → Blueprints Store करता है
  BeanFactoryPostProcessor → Blueprints Modify करता है
  BeanPostProcessor → Beans Modify/Enhance करता है
  Environment → Properties/Profiles
  EventPublisher → Events broadcast करता है
```

---

यह Container ही वो जादू है जो:

> तुम्हारे `@Component` को Life देता है।
> तुम्हारे `@Autowired` को Inject करता है।
> तुम्हारे `@Transactional` को Proxy बनाता है।

---

### अगला Chapter

अब हम `@Autowired` के अंदर जाएँगे।

जब तुम लिखते हो:

```java
@Autowired
private EmailService emailService;
```

तो Spring Reflection से क्या करता है?

Field कैसे ढूँढता है?

Object कैसे Set करता है?

किस समय करता है?

अगला Chapter: **@Autowired अंदर क्या करता है?**
