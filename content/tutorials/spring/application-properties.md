Welcome to **Chapter 5 — application.properties & application.yml**.

> **application.properties is the control center of your Spring Boot application. Every behavior can be tuned here without touching Java code.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you have a TV remote.

```
📺 TV Remote

Volume button  → Controls volume
Channel button → Changes channel
Power button   → On/Off
```

You don't open the TV to change volume.

You just press the remote.

`application.properties` is the **remote control** for Spring Boot.

Change settings without modifying code.

---

# What is application.properties?

Located at:

```
src/main/resources/application.properties
```

It configures:

```
✅ Server port
✅ Database connection
✅ JPA settings
✅ Logging
✅ Security
✅ Mail server
✅ Custom properties
```

---

# Basic Configuration

```properties
# ===========================
# SERVER CONFIGURATION
# ===========================
server.port=8080
server.servlet.context-path=/api

# ===========================
# DATABASE
# ===========================
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=rootpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ===========================
# JPA / HIBERNATE
# ===========================
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# ===========================
# LOGGING
# ===========================
logging.level.root=INFO
logging.level.com.example=DEBUG
logging.file.name=logs/app.log
```

---

# JPA DDL Auto Options

| Value | Behavior |
| --- | --- |
| `none` | No action |
| `validate` | Validates schema, no changes |
| `update` | Updates schema (adds columns) |
| `create` | Creates tables on startup |
| `create-drop` | Creates on start, drops on stop |

Use `update` in development, `validate` or `none` in production.

---

# application.yml (Alternative)

YAML is more readable for complex configurations.

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: rootpassword
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

logging:
  level:
    root: INFO
    com.example: DEBUG
```

`.properties` vs `.yml` — choose one. They are equivalent.

---

# Custom Properties

You can define your own properties:

```properties
# Custom properties
app.name=MyApplication
app.version=1.0.0
app.max-file-size=10MB
app.jwt.secret=mySecretKey123
app.jwt.expiration=86400000
```

Access in Java:

```java
@Component
public class AppConfig {

    @Value("${app.name}")
    private String appName;

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;
}
```

---

# @ConfigurationProperties

Better way for grouped properties:

```properties
app.mail.host=smtp.gmail.com
app.mail.port=587
app.mail.username=test@gmail.com
app.mail.password=secret
```

```java
@Component
@ConfigurationProperties(prefix = "app.mail")
@Data
public class MailProperties {
    private String host;
    private int port;
    private String username;
    private String password;
}
```

Spring auto-maps properties to fields.

---

# Multiple Profiles

Create environment-specific config files:

```
application.properties          ← Common config
application-dev.properties      ← Development
application-prod.properties     ← Production
application-test.properties     ← Testing
```

**application-dev.properties**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mydb_dev
spring.jpa.show-sql=true
logging.level.root=DEBUG
```

**application-prod.properties**

```properties
spring.datasource.url=jdbc:mysql://prod-server:3306/mydb_prod
spring.jpa.show-sql=false
logging.level.root=WARN
```

Activate a profile:

```properties
# In application.properties
spring.profiles.active=dev
```

Or via command line:

```bash
java -jar app.jar --spring.profiles.active=prod
```

---

# Common Properties Quick Reference

```properties
# Server
server.port=8080
server.error.include-message=always

# DataSource
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=

# JPA
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update

# Security
spring.security.user.name=admin
spring.security.user.password=admin123

# Mail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=
spring.mail.password=

# File upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Actuator
management.endpoints.web.exposure.include=*
```

---

# Environment Variables Override

In production, override properties with environment variables:

```bash
# System environment
export SPRING_DATASOURCE_URL=jdbc:mysql://prod:3306/db
export SPRING_DATASOURCE_PASSWORD=prodpassword
```

Spring automatically maps env vars to properties.

---

# Company Example — Netflix

Netflix runs thousands of Spring Boot instances.

Each environment has different configs:

```
Dev:
  spring.datasource.url=localhost:3306
  spring.jpa.show-sql=true

Staging:
  spring.datasource.url=staging-db:3306
  spring.jpa.show-sql=false

Production:
  spring.datasource.url=prod-cluster:3306
  spring.jpa.show-sql=false
  logging.level.root=WARN
```

No code change. Just switch the profile.

---

# Interview Questions

## Q1. What is application.properties?

**Best Answer**

> `application.properties` is the central configuration file in a Spring Boot application located in `src/main/resources`. It configures the server port, database connections, JPA settings, logging levels, and custom properties without modifying Java code.

---

## Q2. What is the difference between application.properties and application.yml?

They are equivalent — both configure Spring Boot. `.properties` uses key=value pairs, while `.yml` uses YAML hierarchical syntax which is more readable for complex nested configurations.

---

## Q3. How do you use profiles in Spring Boot?

Create profile-specific files like `application-dev.properties` and `application-prod.properties`, then activate with `spring.profiles.active=dev` or via command-line argument.

---

## Q4. What is `@Value` annotation?

It injects a value from `application.properties` into a Spring bean field. Example: `@Value("${app.jwt.secret}")` injects the `app.jwt.secret` property.

---

## Q5. What does `spring.jpa.hibernate.ddl-auto=update` do?

It tells Hibernate to automatically update the database schema to match the entity classes on startup, adding new columns or tables but never dropping existing ones.

---

# Professional Summary

```
application.properties

  Controls:
    server.port
    spring.datasource.*
    spring.jpa.*
    logging.level.*
    custom app.*

  Profiles:
    application-dev.properties
    application-prod.properties
    → spring.profiles.active=prod

  Access in code:
    @Value("${property.key}")
    @ConfigurationProperties(prefix = "app")
```

---

# 🧠 Memory Trick

Think of `application.properties` as a **settings menu**:

```
⚙️ App Settings

Server Settings    → server.port, context-path
Database Settings  → spring.datasource.*
Display Settings   → spring.jpa.show-sql
Security Settings  → spring.security.*
```

One file. All settings. No code changes needed.

---

# 🚀 Next Chapter

We'll explore **Spring Annotations** — the labels that power everything in Spring Boot.
