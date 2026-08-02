Welcome to **Chapter 21 — JPA & Hibernate Introduction**.

> **JPA is Java's standard for talking to databases. Hibernate is the engine that powers it. Together they eliminate hundreds of lines of SQL.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you speak English but your database speaks SQL.

You need a translator.

```
You (Java):  "Give me all users"
Translator:  "SELECT * FROM users"
Database:    (returns results)
Translator:  "Here are your User objects"
You (Java):  (works with objects)
```

**JPA** is the translation agreement (contract).
**Hibernate** is the actual translator.

---

# What is JPA?

**JPA** = Java Persistence API

It is a **specification** (a set of rules) for mapping Java objects to database tables.

```
Java Object (User)  ←→  Database Row (users table)
```

JPA defines:
* How to map classes to tables
* How to query data
* How to handle transactions

---

# What is Hibernate?

**Hibernate** is the most popular **implementation** of JPA.

```
JPA = The rules (what to do)
Hibernate = The worker (how to do it)
```

Spring Boot uses Hibernate as the JPA provider by default.

---

# ORM — Object Relational Mapping

ORM maps Java classes ↔ database tables automatically.

```
Without ORM:
  // Manual SQL
  String sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  PreparedStatement ps = conn.prepareStatement(sql);
  ps.setString(1, user.getName());
  ps.setString(2, user.getEmail());
  ps.executeUpdate();

With ORM (JPA/Hibernate):
  userRepository.save(user); // One line!
```

---

# Adding JPA to Spring Boot

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

# Configure Database

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=root

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

---

# Your First Entity

```java
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;
}
```

This Java class maps to the `users` table.

Hibernate creates the table automatically.

---

# JPA vs JDBC vs Spring Data JPA

| Feature | JDBC | JPA | Spring Data JPA |
| --- | --- | --- | --- |
| SQL required | Manual | Optional (JPQL) | Almost none |
| Boilerplate | High | Medium | Minimal |
| Object mapping | Manual | Auto | Auto |
| Transactions | Manual | Supported | Supported |
| Level | Low | Medium | High |

Spring Data JPA = JPA + Hibernate + Spring magic

---

# How JPA Works Internally

```
Your Code:
  userRepository.save(user)

↓

Spring Data JPA:
  Calls EntityManager

↓

Hibernate:
  Generates SQL:
  INSERT INTO users (name, email) VALUES ('Sachin', 'sachin@example.com')

↓

JDBC:
  Sends SQL to MySQL

↓

MySQL:
  Executes and stores data
```

---

# JPA Entity State Machine

```
New (Transient)
  → new User()
  → Not tracked by JPA

Managed
  → After save() or find()
  → Tracked by JPA (changes auto-saved)

Detached
  → After session ends
  → No longer tracked

Removed
  → After delete()
  → Will be deleted from DB
```

---

# Persistence Context

The **persistence context** is JPA's first-level cache.

```java
@Transactional
public void example() {
    User user1 = userRepo.findById(1L).get();
    User user2 = userRepo.findById(1L).get(); // No DB hit - from cache!

    System.out.println(user1 == user2); // true - same instance!

    user1.setName("New Name");
    // No explicit save needed - Hibernate detects the change (dirty checking)
} // Transaction ends → Hibernate flushes → UPDATE SQL executed
```

---

# Company Example — IRCTC

Indian Railways booking system:

```
Without JPA (JDBC):
  - Write SQL for every operation
  - Manual connection management
  - Manual result set mapping
  - Error-prone
  - Hundreds of lines

With JPA (Spring Data JPA):
  - @Entity maps to trains, bookings tables
  - Spring generates queries automatically
  - Transactions handled by @Transactional
  - 90% less code
```

```java
// IRCTC Train entity
@Entity
@Table(name = "trains")
public class Train {

    @Id
    private String trainNumber;

    @Column(nullable = false)
    private String trainName;

    private String source;
    private String destination;

    @OneToMany(mappedBy = "train")
    private List<Booking> bookings;
}

// IRCTC Booking entity
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pnrNumber;

    @ManyToOne
    @JoinColumn(name = "train_number")
    private Train train;

    private String passengerName;
    private LocalDate journeyDate;
}
```

---

# Interview Questions

## Q1. What is JPA?

**Best Answer**

> JPA (Java Persistence API) is a Java specification that defines how Java objects are mapped to relational database tables (ORM). It provides annotations like `@Entity`, `@Table`, `@Id`, and an `EntityManager` API for CRUD operations. Hibernate is the most popular JPA implementation.

---

## Q2. What is Hibernate?

The leading ORM framework and most widely used JPA implementation. It translates Java operations on entities into SQL queries that the database executes.

---

## Q3. What is ORM?

Object-Relational Mapping — the technique of mapping Java objects (entities) to database tables, so you work with Java objects instead of writing raw SQL.

---

## Q4. What is the difference between JPA and Spring Data JPA?

JPA is the specification with `EntityManager`. Spring Data JPA is built on top of JPA, providing repositories with auto-generated CRUD methods and query generation from method names.

---

## Q5. What is the persistence context?

The JPA first-level cache — a context that tracks all managed entities within a transaction. It prevents duplicate queries and supports dirty checking (auto-detecting and saving changed entities).

---

# Professional Summary

```
JPA Stack:

  Spring Data JPA (highest level)
    ↓
  JPA Specification (EntityManager)
    ↓
  Hibernate (JPA Implementation)
    ↓
  JDBC (database driver)
    ↓
  Database (MySQL/PostgreSQL)

Key:
  @Entity   → maps class to table
  @Id       → primary key
  save()    → INSERT or UPDATE
  findAll() → SELECT *
  delete()  → DELETE
```

---

# 🧠 Memory Trick

JPA/Hibernate = **Google Translate**

```
You speak Java (English)
Database speaks SQL (French)

Google Translate (Hibernate)
  "Give me User #1" → SELECT * FROM users WHERE id=1

Specification (JPA) = The translation rules
Translator (Hibernate) = The one who follows rules
```

---

# 🚀 Next Chapter

We'll learn **@Entity** in depth — every annotation for mapping your Java class to a database table perfectly.
