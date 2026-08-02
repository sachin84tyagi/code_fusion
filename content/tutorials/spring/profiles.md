Welcome to **Chapter 12 — Spring Profiles**.

> **Profiles let you run the same application with different configurations in different environments — dev, test, prod — without changing code.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you are a student.

In school, you wear a **uniform**.

At a party, you wear **party clothes**.

At a wedding, you wear **formal clothes**.

Same person. Different outfits for different occasions.

```
School   → Uniform
Party    → Casual
Wedding  → Formal
```

Spring Profiles are those outfits.

```
dev  → Local database, debug logs
test → In-memory database, test data
prod → Real database, minimal logs
```

---

# What is a Spring Profile?

A profile is a named configuration set.

You activate a profile, and Spring loads the matching config.

```
dev    → development settings
test   → test settings
prod   → production settings
```

---

# application.properties with Profiles

```
src/main/resources/
  application.properties          ← Shared config
  application-dev.properties      ← Dev-specific
  application-test.properties     ← Test-specific
  application-prod.properties     ← Prod-specific
```

**application.properties** (common):

```properties
spring.application.name=myapp
app.version=1.0.0
```

**application-dev.properties**:

```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/mydb_dev
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
logging.level.root=DEBUG
```

**application-prod.properties**:

```properties
server.port=80
spring.datasource.url=jdbc:mysql://prod-db:3306/mydb_prod
spring.jpa.show-sql=false
spring.jpa.hibernate.ddl-auto=validate
logging.level.root=WARN
```

---

# Activating a Profile

**In application.properties:**

```properties
spring.profiles.active=dev
```

**Via command line:**

```bash
java -jar app.jar --spring.profiles.active=prod
```

**Via environment variable:**

```bash
export SPRING_PROFILES_ACTIVE=prod
```

**In tests:**

```java
@ActiveProfiles("test")
@SpringBootTest
public class UserServiceTest { }
```

---

# YAML Profile Config (Single File)

```yaml
# application.yml

spring:
  application:
    name: myapp
  profiles:
    active: dev

---
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:mysql://localhost:3306/mydb_dev
  jpa:
    show-sql: true

---
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:mysql://prod-db:3306/mydb_prod
  jpa:
    show-sql: false
```

---

# @Profile on Beans

Load different beans based on the active profile:

```java
public interface PaymentGateway {
    void processPayment(double amount);
}

@Service
@Profile("dev")
public class MockPaymentGateway implements PaymentGateway {
    public void processPayment(double amount) {
        System.out.println("Mock payment: " + amount); // No real payment in dev
    }
}

@Service
@Profile("prod")
public class RazorpayGateway implements PaymentGateway {
    public void processPayment(double amount) {
        // Real Razorpay API call
    }
}
```

In `dev` profile → `MockPaymentGateway` is active.

In `prod` profile → `RazorpayGateway` is active.

---

# @Profile on @Configuration

```java
@Configuration
@Profile("dev")
public class DevDatabaseConfig {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .build();
    }
}

@Configuration
@Profile("prod")
public class ProdDatabaseConfig {

    @Bean
    public DataSource dataSource() {
        // Configure production connection pool
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://prod-db:3306/mydb");
        return new HikariDataSource(config);
    }
}
```

---

# Profile Expressions

```java
// Active when dev OR test
@Profile({"dev", "test"})
public class MockEmailService { }

// Active when NOT prod
@Profile("!prod")
public class DebugLoggingBean { }
```

---

# Multiple Active Profiles

```properties
spring.profiles.active=dev,monitoring
```

Both `dev` and `monitoring` profile beans are loaded.

---

# Company Example — HDFC Bank

HDFC Bank has 4 environments:

```
dev     → Local development
qa      → Quality assurance testing
staging → Pre-production testing
prod    → Live production
```

```java
@Service
@Profile("dev")
public class DevEmailService implements EmailService {
    // Logs email to console, doesn't actually send
    public void sendEmail(String to, String subject, String body) {
        System.out.println("DEV EMAIL → " + to + ": " + subject);
    }
}

@Service
@Profile("prod")
public class SmtpEmailService implements EmailService {
    // Sends real emails via SMTP
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
```

In `dev` — no real emails (no spam!).
In `prod` — real SMTP emails.

Activate on deployment:

```bash
java -jar hdfc-app.jar --spring.profiles.active=prod
```

---

# Interview Questions

## Q1. What are Spring Profiles?

**Best Answer**

> Spring Profiles allow you to define groups of beans and configurations that are only active in a specific environment. You can separate dev, test, and prod configurations, activating the right one via `spring.profiles.active`.

---

## Q2. How do you activate a Spring profile?

Via `spring.profiles.active=prod` in `application.properties`, via command-line argument `--spring.profiles.active=prod`, via environment variable `SPRING_PROFILES_ACTIVE=prod`, or via `@ActiveProfiles("test")` in tests.

---

## Q3. What does `@Profile("!prod")` mean?

The bean is active in any profile **except** production. The `!` is a NOT operator in profile expressions.

---

## Q4. Can multiple profiles be active at the same time?

Yes. Set `spring.profiles.active=dev,monitoring` to activate multiple profiles simultaneously.

---

## Q5. How do you load profile-specific property files?

Create files named `application-{profile}.properties`. Spring automatically loads the file matching the active profile.

---

# Professional Summary

```
Spring Profiles:

  Files:
    application-dev.properties
    application-prod.properties
    application-test.properties

  Activate:
    spring.profiles.active=dev        (properties)
    --spring.profiles.active=prod     (CLI)
    SPRING_PROFILES_ACTIVE=prod       (env var)

  On beans:
    @Profile("dev")    → dev only
    @Profile("!prod")  → all except prod
    @Profile({"dev","test"}) → dev or test
```

---

# 🧠 Memory Trick

Profiles = **SIM cards**

```
📱 Same phone (your app)

SIM Dev  → Local network (local DB)
SIM Test → Test network (H2 DB)
SIM Prod → Full network (prod DB)

Swap SIM → Different behavior
spring.profiles.active=prod → Insert prod SIM
```

---

# 🚀 Next Chapter

We'll enter the world of **Spring Web** with `@RestController` — the class that handles all HTTP requests in your Spring Boot REST API.
