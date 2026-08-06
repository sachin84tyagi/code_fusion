एक Developer था।

उसने Spring Framework सीखा।

```java
ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);

@Configuration
class AppConfig {

    @Bean
    public DataSource dataSource() {
        // Database Setup — खुद करो
    }

    @Bean
    public EntityManagerFactory emf() {
        // JPA Setup — खुद करो
    }

    @Bean
    public TransactionManager tm() {
        // Transaction Setup — खुद करो
    }

    @Bean
    public DispatcherServlet dispatcherServlet() {
        // MVC Setup — खुद करो
    }
}
```

200 Lines की Config।

Project शुरू होने से पहले।

---

फिर उसने **Spring Boot** देखा।

```java
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
```

यही था।

Database Connected।

JPA Ready।

Transaction Ready।

Tomcat Ready।

---

Developer हैरान।

> **"यह जादू कैसे हुआ?"**

---

# Chapter 33 – Spring Boot Auto Configuration ⭐⭐⭐⭐⭐

---

# @SpringBootApplication क्या है?

```java
@SpringBootApplication
```

यह एक Meta-Annotation है।

इसमें तीन Annotations हैं:

```java
@SpringBootConfiguration   // = @Configuration
@EnableAutoConfiguration   // ← यही जादू है
@ComponentScan             // सब Scan करो
```

---

# @EnableAutoConfiguration – यही जादू है

Spring Boot ने कहा:

> "Developer को Config नहीं लिखनी चाहिए।
> हम Classpath देखेंगे।
> जो Library मिले, उसकी Config automatic करेंगे।"

---

## Classpath देखना मतलब?

```text
तुमने pom.xml में लिखा:

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

Spring Boot ने पूछा:

> "Classpath में `HibernateJpaAutoConfiguration` है?"

हाँ है।

> "तो Database Config automatically करो।"

---

# Auto Configuration कैसे काम करती है?

---

## Step 1 – spring.factories (पुरानी) / AutoConfiguration.imports (नई)

Spring Boot के अंदर एक File है:

```text
spring-boot-autoconfigure-x.x.x.jar
  └── META-INF/
        └── spring/
              └── org.springframework.boot.autoconfigure.AutoConfiguration.imports
```

इस File में लिखा है:

```text
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration
org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
...
(144+ Auto Configurations!)
```

---

## Step 2 – @ConditionalOnClass

हर Auto Configuration के ऊपर Conditions हैं।

```java
@Configuration
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })
@ConditionalOnMissingBean(type = "io.r2dbc.spi.ConnectionFactory")
@AutoConfigureBefore(JndiDataSourceAutoConfiguration.class)
public class DataSourceAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public DataSource dataSource() {
        // DataSource बनाओ
    }
}
```

```text
@ConditionalOnClass:
  "अगर Classpath में DataSource Class है, तभी यह Config Apply करो।"

@ConditionalOnMissingBean:
  "अगर User ने खुद DataSource नहीं बनाया, तभी हम बनाएँगे।"
```

---

## Step 3 – Condition Chain

```text
Spring Boot Start होता है
        ↓
144+ Auto Configurations List
        ↓
हर Config की Conditions Check
        ↓
DataSourceAutoConfiguration:
  @ConditionalOnClass(DataSource.class) → Classpath में है? ✅
  @ConditionalOnMissingBean(DataSource) → User ने नहीं बनाया? ✅
  → Apply! DataSource Bean बनाओ
        ↓
WebMvcAutoConfiguration:
  @ConditionalOnClass(Servlet.class) → है? ✅
  @ConditionalOnWebApplication → Web App है? ✅
  → Apply! DispatcherServlet, ViewResolvers बनाओ
        ↓
SecurityAutoConfiguration:
  @ConditionalOnClass(AuthenticationManager.class) → है? ✅
  → Apply! Security Config बनाओ
```

---

# Starter Dependencies का जादू

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

यह एक Dependency नहीं है।

यह एक **Bundle** है।

---

## spring-boot-starter-web में क्या है?

```text
spring-boot-starter-web
  ├── spring-webmvc
  ├── spring-web
  ├── spring-boot-starter-tomcat
  │     └── tomcat-embed-core
  │     └── tomcat-embed-el
  │     └── tomcat-embed-websocket
  ├── spring-boot-starter
  │     └── spring-boot
  │     └── spring-boot-autoconfigure
  │     └── spring-boot-starter-logging
  └── jackson-databind (JSON)
```

एक Dependency → पूरा Web Stack।

---

## spring-boot-starter-data-jpa में क्या है?

```text
spring-boot-starter-data-jpa
  ├── spring-data-jpa
  ├── spring-orm
  ├── hibernate-core
  ├── spring-boot-starter-jdbc
  │     └── HikariCP (Connection Pool)
  │     └── spring-jdbc
  └── jakarta.transaction-api
```

---

# Common Conditions

```java
// Classpath में Class होनी चाहिए
@ConditionalOnClass(DataSource.class)

// Bean Missing हो तो Apply
@ConditionalOnMissingBean(DataSource.class)

// Property Set हो तो Apply
@ConditionalOnProperty(name = "spring.datasource.url")

// Web Application हो तो
@ConditionalOnWebApplication

// Web Application नहीं हो तो
@ConditionalOnNotWebApplication

// Expression True हो तो
@ConditionalOnExpression("${feature.enabled:false}")

// Production Profile हो तो
@ConditionalOnResource(resources = "classpath:application-prod.properties")
```

---

# application.properties – Auto Config को Control

Auto Config Defaults देती है।

तुम `application.properties` से Override करते हो।

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=secret
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Server
server.port=8080
server.servlet.context-path=/api

# Logging
logging.level.com.myapp=DEBUG
logging.level.org.springframework=INFO
```

---

# Custom Auto Configuration बनाओ

तुम खुद Library बना सकते हो जो Auto Configure हो।

```java
// अपनी Auto Configuration
@Configuration
@ConditionalOnClass(PaymentGateway.class)
@ConditionalOnProperty(name = "payment.enabled", havingValue = "true")
public class PaymentAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public PaymentGateway paymentGateway(PaymentProperties props) {
        return new StripePaymentGateway(props.getApiKey());
    }
}

// Configuration Properties
@ConfigurationProperties(prefix = "payment")
public class PaymentProperties {
    private String apiKey;
    private String mode = "sandbox";
    // getters/setters
}
```

```text
META-INF/spring/
  org.springframework.boot.autoconfigure.AutoConfiguration.imports

// इस File में लिखो:
com.mypayment.PaymentAutoConfiguration
```

---

# Spring Boot Startup Flow (पूरा)

```text
1. main() → SpringApplication.run()
         ↓
2. SpringApplication Create
   → ApplicationContext Type Decide (Web/Non-Web)
         ↓
3. ApplicationContext Create (Empty)
         ↓
4. Environment Prepare
   → application.properties Load
   → System Properties
   → Environment Variables
         ↓
5. Banner Print ("Spring" Logo)
         ↓
6. BeanDefinitions Load
   → @ComponentScan (तुम्हारी Classes)
   → Auto Configuration Classes
         ↓
7. BeanFactoryPostProcessors Run
   → @Value Placeholders Resolve
         ↓
8. Singleton Beans Create
   → Dependencies Inject
   → @PostConstruct
   → AOP Proxy बनाओ
         ↓
9. Embedded Tomcat Start (Web App)
         ↓
10. ApplicationReadyEvent Publish
         ↓
11. "Started App in X.XX seconds" ✅
```

---

# Auto Configuration Debug करना

```properties
# पूरी Auto Configuration Report देखो
debug=true
```

Output में मिलेगा:

```text
============================
CONDITIONS EVALUATION REPORT
============================

Positive matches:
-----------------
   DataSourceAutoConfiguration matched:
      - @ConditionalOnClass found required class 'javax.sql.DataSource' (OnClassCondition)

Negative matches:
-----------------
   ActiveMQAutoConfiguration:
      - @ConditionalOnClass did not find required class 'javax.jms.ConnectionFactory' (OnClassCondition)
```

---

# @SpringBootApplication का काम

```text
@SpringBootApplication
  ↓
┌──────────────────────────────────────────────────┐
│  @ComponentScan                                  │
│  → तुम्हारी सभी @Component, @Service Classes    │
│                                                  │
│  @SpringBootConfiguration (@Configuration)      │
│  → तुम्हारी @Bean Methods                       │
│                                                  │
│  @EnableAutoConfiguration                        │
│  → Spring Boot की 144+ Auto Configurations      │
│    (Conditions से Filter होकर Apply होती हैं)   │
└──────────────────────────────────────────────────┘
```

---

# Interview Questions

---

## Q1. Spring Boot Auto Configuration कैसे काम करती है?

**Answer:**

1. `@EnableAutoConfiguration` से Auto Configuration Enable होती है।
2. Classpath में `AutoConfiguration.imports` File है जिसमें 144+ Classes हैं।
3. हर Class पर `@ConditionalOnClass`, `@ConditionalOnMissingBean` जैसी Conditions हैं।
4. Classpath में Library हो AND User ने Override न किया हो → Auto Config Apply।
5. Spring Boot Intelligent Defaults देता है।

---

## Q2. @ConditionalOnMissingBean क्यों ज़रूरी है?

**Answer:**

> "अगर User ने खुद Bean बनाई है → Spring Boot की Default Use नहीं करो।"

यही Spring Boot की Philosophy है:

> "Opinionated but Overridable।"

---

## Q3. Starter Dependencies क्या होती हैं?

**Answer:**

Starter = Related Dependencies का Bundle।

```text
spring-boot-starter-web:
  Spring MVC + Tomcat + Jackson + Logging
  एक Dependency → पूरा Web Stack
```

Transitive Dependencies को Manage करना आसान हो जाता है।

---

## Q4. Auto Configuration को Exclude कैसे करें?

**Answer:**

```java
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    SecurityAutoConfiguration.class
})
```

या Properties में:

```properties
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

---

## Q5. Custom Properties के लिए क्या use करते हैं?

**Answer:**

```java
@ConfigurationProperties(prefix = "myapp")
@Component
public class MyAppProperties {
    private String apiKey;
    private int timeout = 30;
    // getters/setters
}
```

```properties
myapp.api-key=abc123
myapp.timeout=60
```

---

# Best Practices

---

## 1. application.properties में Configuration

```properties
# ✅ Properties File में रखो — Hard-code नहीं
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
```

---

## 2. @ConfigurationProperties Type-Safe

```java
// ✅ Type-Safe Configuration
@ConfigurationProperties(prefix = "payment")
public class PaymentConfig {
    private String apiKey;
    private String mode;
    private int timeout = 30;
}
```

---

## 3. Auto Configuration Exclude करो जो ज़रूरी नहीं

```java
// Database नहीं है?
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class App { }
```

---

# Common Mistakes

---

## Mistake 1 — application.properties में Typo

```properties
# ❌ spring.datasource.url की Spelling गलत
spring.datasources.url=jdbc:mysql://...  # datasources (plural!) — काम नहीं

# ✅
spring.datasource.url=jdbc:mysql://...
```

---

## Mistake 2 — Circular Auto Configuration

```java
// ❌ अपनी Auto Config पर @Component लगाना
@Configuration
@Component  // गलत — AutoConfiguration Import से आनी चाहिए
class MyAutoConfig { }
```

---

## Mistake 3 — @Value के बजाय Hard-code

```java
// ❌ Hard-coded
class PaymentService {
    private String apiKey = "sk_live_abc123";
}

// ✅
class PaymentService {
    @Value("${payment.api-key}")
    private String apiKey;
}
```

---

# इस Chapter का निष्कर्ष

```text
Spring Boot = Spring Framework + Auto Configuration + Embedded Server

@SpringBootApplication = @ComponentScan + @Configuration + @EnableAutoConfiguration

Auto Configuration:
  → 144+ Configurations Ready हैं
  → @ConditionalOnClass: Library है?
  → @ConditionalOnMissingBean: तुमने Override नहीं किया?
  → Yes → Apply!

Starters:
  → Related Dependencies का Bundle
  → एक Dependency → पूरा Stack

Philosophy:
  "Convention over Configuration"
  "Opinionated but Overridable"
```

---

### अगला Chapter

अब तुम Spring Boot जानते हो।

लेकिन एक Request आती है — Browser से।

वह Tomcat से होकर आती है।

फिर Spring को कैसे पहुँचती है?

Controller तक कैसे जाती है?

Response कैसे बनती है?

अगला Chapter: **Spring MVC Internal Flow**
