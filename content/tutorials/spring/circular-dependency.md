Interview Room में Interviewer ने एक Diagram बनाया।

```text
A → B

B → C

C → A
```

और पूछा:

> **"Spring क्या करेगा?"**

यह एक Simple Question लगता है।

लेकिन इसमें Spring की पूरी Internal Complexity छुपी है।

---

# Chapter 27 – Circular Dependency

---

# पहले Problem समझो

**EduTech Platform** — एक Online Learning App।

```java
@Service
class CourseService {

    @Autowired
    private EnrollmentService enrollmentService;

}

@Service
class EnrollmentService {

    @Autowired
    private CourseService courseService;

}
```

यह Circular Dependency है।

```text
CourseService → EnrollmentService → CourseService → ...
```

---

## Spring क्या करेगा?

यह इस बात पर Depend करता है:

> **"किस Type का Injection है?"**

---

# Case 1 – Field Injection में Circular Dependency

```java
@Service
class A {
    @Autowired
    private B b;
}

@Service
class B {
    @Autowired
    private A a;
}
```

**Spring Boot 2.6 से पहले:**

Spring इसे Handle कर लेता था।

Application Start होती थी।

**Spring Boot 2.6+:**

```text
BeanCurrentlyInCreationException:
The dependencies of some of the beans in the application context 
form a cycle:
a → b → a
```

Application Start नहीं होती।

---

## Spring Boot 2.6 में यह Behavior क्यों बदला?

Spring Team ने कहा:

> "Circular Dependency एक Design Problem है।
> हम इसे automatically fix करते थे।
> लेकिन यह Developer को गलत Design छोड़ने की आदत देता था।
> इसलिए अब हम fail करेंगे।"

---

## Circular Dependency Allow करना (temporary fix)

```properties
# application.properties
spring.main.allow-circular-references=true
```

यह करो नहीं।

यह temporary workaround है।

असली Solution Design Fix है।

---

# Case 2 – Constructor Injection में Circular Dependency

```java
@Service
class A {
    private final B b;
    public A(B b) { this.b = b; }
}

@Service
class B {
    private final A a;
    public B(A a) { this.a = a; }
}
```

Spring ने A बनाने की कोशिश की।

A को B चाहिए।

B बनाने की कोशिश की।

B को A चाहिए।

A अभी बन ही रही है।

**Deadlock।**

```text
BeanCurrentlyInCreationException:
Requested bean is currently in creation: Is there an unresolvable 
circular reference?
```

**हमेशा Fail।**

---

# Spring का पुराना Magic — Early Reference

Spring Boot 2.6 से पहले Field Injection में Spring एक Trick करता था।

---

## Three-Phase Creation

```text
Phase 1: Instantiation
  → Object बनाओ (constructor call, fields null हैं)

Phase 2: Population
  → Fields Set करो (@Autowired)

Phase 3: Initialization
  → @PostConstruct चलाओ
```

---

## Circular को Handle करने का तरीका

```java
@Service
class A {
    @Autowired B b;
}

@Service
class B {
    @Autowired A a;
}
```

Spring का पुराना तरीका:

```text
Step 1: A का Object बनाओ (b = null अभी)
         → A को "Currently Creating" Cache में डालो (Early Reference)

Step 2: A की Fields Set करो → B चाहिए

Step 3: B का Object बनाओ (a = null अभी)

Step 4: B की Fields Set करो → A चाहिए
         → A "Currently Creating" Cache में है!
         → वही A दे दो (Early Reference)

Step 5: B Complete!

Step 6: A को B मिली → A Complete!
```

यह Trick **Three-Level Cache** से होती थी।

---

## Three-Level Cache (Internal Implementation)

```text
singletonObjects     → पूरी तरह तैयार Beans
                        (Level 1 — Final Cache)

earlySingletonObjects → Partially Created Beans
                        (Level 2 — Early Reference Cache)

singletonFactories   → ObjectFactory (Proxy के लिए)
                        (Level 3 — Factory Cache)
```

---

जब Circular Reference होती थी:

```text
A पहली बार माँगी
  → singletonObjects में नहीं
  → earlySingletonObjects में नहीं
  → singletonFactories में ObjectFactory है
  → ObjectFactory से Early A बनाओ
  → earlySingletonObjects में रखो
  → A की Dependency B को दो
     → B ने A माँगी
     → earlySingletonObjects में मिली! → B को दे दो
  → B Complete
→ A Complete
→ singletonObjects में रखो
```

---

## यह Field Injection में क्यों काम करता था?

Field Injection में:

```text
1. Object पहले बनो (Empty)
2. Fields बाद में Set हों
```

इसीलिए "Empty Object" Early Reference दे सकते थे।

---

## Constructor Injection में क्यों नहीं?

Constructor Injection में:

```text
Object बनाने के लिए Constructor चाहिए
Constructor के लिए Dependency चाहिए
Dependency के लिए उसका Object चाहिए
उसके Object के लिए Constructor चाहिए
→ Deadlock
```

कोई "Empty Object" नहीं बन सकता।

---

# Circular Dependency के Real Causes

---

## Cause 1 – Wrong Architecture

```java
// ❌ A और B एक-दूसरे को जानते हैं
@Service class CourseService {
    @Autowired EnrollmentService enrollmentService;
}

@Service class EnrollmentService {
    @Autowired CourseService courseService;
}
```

Problem: दोनों Services एक-दूसरे पर Depend हैं।

---

## Cause 2 – God Class

एक बड़ी Class जो सब कुछ जानती है।

वह कहीं भी Circular Dependency बना सकती है।

---

## Cause 3 – Missing Domain Concept

कभी-कभी Circular Dependency बताती है:

> "यहाँ एक Missing Class है।"

---

# Circular Dependency के Solutions

---

## Solution 1 – Refactor — तीसरी Class निकालो

```java
// ❌ Circular
@Service class A { @Autowired B b; }
@Service class B { @Autowired A a; }

// ✅ तीसरी Class
@Service class A { @Autowired C c; }
@Service class B { @Autowired C c; }
@Service class C {
    // A और B दोनों की Shared Logic यहाँ
}
```

---

## Solution 2 – @Lazy Annotation

```java
@Service
class A {

    @Autowired
    @Lazy  // B पहली बार use होने पर ही Create होगी
    private B b;

}

@Service
class B {

    @Autowired
    private A a;

}
```

`@Lazy` एक Proxy Create करता है।

Proxy Real Object की जगह Inject होता है।

Real Object पहली बार Use करने पर बनता है।

---

## यह Circular Dependency कैसे Break करता है?

```text
A बनाओ → B Proxy चाहिए
B Proxy बनाओ (B Real Object नहीं बनता)
A Complete!

B Real Object माँगा (जब A ने पहली बार use किया)
B को A चाहिए
A पहले से Complete है ✅
B Complete!
```

---

## Solution 3 – ApplicationContext.getBean() (Service Locator Pattern)

```java
@Service
class A {

    @Autowired
    ApplicationContext ctx;

    public void doSomething() {
        B b = ctx.getBean(B.class);  // Use करते समय लो, Start पर नहीं
        b.process();
    }
}
```

यह Anti-Pattern है।

Last Resort।

---

## Solution 4 – Interface से Decouple करो

```java
// Interface निकालो
interface EnrollmentHandler {
    void handleEnrollment(Course course);
}

@Service
class CourseService {
    @Autowired
    EnrollmentHandler enrollmentHandler;  // Interface
}

@Service
class EnrollmentService implements EnrollmentHandler {
    // CourseService का नाम नहीं लिया
    @Override
    public void handleEnrollment(Course course) { }
}
```

---

## Solution 5 – Event Driven (Best for Production)

```java
@Service
class CourseService {

    @Autowired
    ApplicationEventPublisher eventPublisher;

    public void publishCourse(Course course) {
        // EnrollmentService को सीधे call नहीं
        eventPublisher.publishEvent(new CoursePublishedEvent(course));
    }
}

@Service
class EnrollmentService {

    @EventListener
    public void onCoursePublished(CoursePublishedEvent event) {
        // Loose Coupling — Events से
    }
}
```

---

# Circular Dependency का Diagnosis

```text
Error Message में देखो:
  "The dependencies of some of the beans in the application context form a cycle"

  a → b → a  (यह Path दिखाता है)
```

---

## IntelliJ में देखो

Project > Inspect Code > Spring > Circular Dependencies

---

## Actuator से देखो (Production)

```
GET /actuator/beans
```

यहाँ सभी Beans और उनकी Dependencies का Graph मिलता है।

---

# Interview Questions

---

## Q1. Circular Dependency क्या है?

**Answer:**

जब Bean A को Bean B चाहिए, और Bean B को Bean A चाहिए, तो यह Circular Dependency है।

```text
A → B → A (loop)
```

Spring इसे Detection पर Fail करता है (Spring Boot 2.6+)।

---

## Q2. Field Injection में Circular Dependency handle होती थी, Constructor में क्यों नहीं?

**Answer:**

Field Injection में Spring पहले Empty Object बना सकता है (Early Reference)।

Constructor Injection में Object बनाने के लिए Dependency पहले चाहिए।

इसलिए Constructor Circular = Deadlock।

---

## Q3. Three-Level Cache क्या है?

**Answer:**

Spring का Internal Cache System:

```text
Level 1: singletonObjects       → पूरी तरह Ready Beans
Level 2: earlySingletonObjects  → Early Reference (Partially Created)
Level 3: singletonFactories     → ObjectFactory (AOP Proxy के लिए)
```

Circular Dependency handle करने के लिए Level 2/3 use होती थी।

---

## Q4. @Lazy से Circular कैसे Fix होती है?

**Answer:**

`@Lazy` Dependency की जगह एक Proxy Inject करता है।

Real Object पहली बार Use करने पर बनता है।

इससे Startup पर Circular Loop नहीं होती।

---

## Q5. Circular Dependency से बचने का Best Solution क्या है?

**Answer:**

Design Fix:

1. **Refactor** — Common Logic को तीसरी Class में निकालो
2. **Interface** — Direct Dependency की जगह Interface use करो
3. **Events** — ApplicationEvent से Loose Coupling
4. **SRP** — Single Responsibility Principle follow करो

`@Lazy` और `allow-circular-references=true` workarounds हैं, solutions नहीं।

---

# Best Practices

---

## 1. Constructor Injection Use करो — Circular जल्दी पकड़ी जाए

```java
// ✅ Constructor Injection — Startup पर Fail करेगा
@RequiredArgsConstructor
class A {
    private final B b;
}
```

---

## 2. Circular मिले तो Design Revisit करो

```text
A → B → A  मिला?

सोचो:
  क्या A और B एक Domain के हैं?
  क्या कोई तीसरी Class Missing है?
  क्या Event Driven approach better है?
```

---

## 3. allow-circular-references कभी Production में नहीं

```properties
# ❌ कभी Production में नहीं
spring.main.allow-circular-references=true
```

यह Technical Debt है।

---

# Real Life Analogy

```text
HR Manager (A) को Employee ID चाहिए Finance से।
Finance Department (B) को HR Approval चाहिए।

HR → Finance → HR → ∞
```

Solution:

```text
तीसरा Option:
  HR ने Form भरा (Event)
  Finance ने Form Process किया (Event Listener)
  कोई Direct Call नहीं
```

---

# इस Chapter का निष्कर्ष

```text
Circular Dependency = Design Problem

Spring Boot 2.6+:
  Field Injection → Fail (by default)
  Constructor Injection → Always Fail

Solutions (Best → Worst):
  1. Design Fix (Refactor / Interface / Events)
  2. @Lazy (Acceptable workaround)
  3. allow-circular-references (Never in Production)

Three-Level Cache:
  Spring का Internal Mechanism (पुराना तरीका)
  अब Discouraged
```

---

# Phase 2 – Real Spring Framework पूरा हुआ

तुमने पढ़ा:

```text
Chapter 21 → @Component Internal Journey
Chapter 22 → @Service क्यों आया
Chapter 23 → Bean आखिर है क्या
Chapter 24 → IoC Container अंदर से
Chapter 25 → @Autowired Internal
Chapter 26 → Constructor Injection Deep
Chapter 27 → Circular Dependency
```

यह सब Spring का **Core** है।

जो Senior Developer जानते हैं।

जो Interviewers पूछते हैं।

---

### आगे का रास्ता

```text
Phase 3 – Spring Boot Deep Dive
  Auto Configuration
  Starter POMs
  Spring Boot Internals

Phase 4 – AOP और Proxy
  Aspect Oriented Programming
  Dynamic Proxy
  CGLIB Proxy

Phase 5 – Transaction Management
  @Transactional Deep Dive
  Propagation Levels
  Isolation Levels

Phase 6 – Request Lifecycle
  DispatcherServlet
  Handler Mapping
  View Resolver
```

---

> **"Java Developer और Spring Developer में यही फर्क है।"**

> **"Java Developer Classes लिखता है।"**

> **"Spring Developer Spring के साथ Design करता है।"**
