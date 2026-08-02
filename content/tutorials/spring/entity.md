Welcome to **Chapter 22 — @Entity, @Table, @Id, @Column**.

> **@Entity maps your Java class to a database table. Get these annotations right and your data model becomes your database schema.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a school register book.

```
📒 Student Register

Page layout (table structure):
  Column 1: Roll Number (ID)
  Column 2: Student Name
  Column 3: Class
  Column 4: Phone
```

`@Entity` says: "This Java class = one page in the register book"
`@Table` says: "Call this register 'students'"
`@Id` says: "Roll Number is the unique identifier"
`@Column` says: "How to write each field in the register"

---

# @Entity

Marks a class as a JPA entity (maps to a database table).

```java
@Entity
public class User {
    // ...
}
```

Hibernate creates a `user` table (lowercase by default).

---

# @Table

Customize the table name and options.

```java
@Entity
@Table(
    name = "users",                           // Table name
    schema = "myapp",                         // Database schema
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"email"}),
        @UniqueConstraint(columnNames = {"username"})
    },
    indexes = {
        @Index(name = "idx_user_email", columnList = "email"),
        @Index(name = "idx_user_created", columnList = "created_at")
    }
)
public class User {
    // ...
}
```

---

# @Id and @GeneratedValue

Every entity must have a primary key.

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

**Generation Strategies:**

| Strategy | Description |
| --- | --- |
| `IDENTITY` | DB auto-increment (MySQL default) |
| `SEQUENCE` | DB sequence object (PostgreSQL) |
| `TABLE` | Uses a separate key table |
| `AUTO` | Let Hibernate decide |
| `UUID` | Generate UUID (Spring Boot 3+) |

---

# UUID Primary Key

```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
private String id; // "550e8400-e29b-41d4-a716-446655440000"
```

---

# @Column

Customize column mapping.

```java
@Column(
    name = "full_name",          // Column name in DB
    nullable = false,            // NOT NULL constraint
    unique = false,              // UNIQUE constraint
    length = 100,                // VARCHAR(100)
    updatable = false,           // Never UPDATE this column
    insertable = true            // Include in INSERT
)
private String name;
```

---

# Full Entity Example

```java
package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "employees",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"email"}),
        @UniqueConstraint(columnNames = {"employee_code"})
    }
)
@Data
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_code", nullable = false, updatable = false, length = 20)
    private String employeeCode;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal salary;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Column(name = "is_active")
    private boolean active = true;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Department department;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

enum Department {
    ENGINEERING, HR, FINANCE, MARKETING, OPERATIONS
}
```

---

# @Enumerated

Map Java enums to database columns.

```java
public enum Status { ACTIVE, INACTIVE, PENDING }

// Store as string "ACTIVE" (recommended)
@Enumerated(EnumType.STRING)
private Status status;

// Store as ordinal 0, 1, 2 (avoid - fragile)
@Enumerated(EnumType.ORDINAL)
private Status status;
```

Always use `EnumType.STRING` — ordinal breaks if enum order changes.

---

# @Transient

Mark a field to be ignored by JPA:

```java
@Entity
public class User {

    private String firstName;
    private String lastName;

    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }

    @Transient
    private String tempVerificationCode; // Not persisted
}
```

---

# @Lob — Large Objects

```java
@Lob
@Column(name = "profile_picture")
private byte[] profilePicture; // Binary (image)

@Lob
@Column(columnDefinition = "LONGTEXT")
private String description;    // Large text
```

---

# Timestamps with Hibernate Annotations

```java
// Automatically set on INSERT
@CreationTimestamp
@Column(name = "created_at", updatable = false)
private LocalDateTime createdAt;

// Automatically updated on UPDATE
@UpdateTimestamp
@Column(name = "updated_at")
private LocalDateTime updatedAt;
```

Or using JPA's `@EntityListeners`:

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class User {

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(updatable = false)
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;
}

// Enable auditing in config class:
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaConfig { }
```

---

# SQL Generated by Hibernate

For this entity:

```java
@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
}
```

Hibernate generates:

```sql
CREATE TABLE products (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id)
);
```

---

# Company Example — Amazon Product Catalog

```java
@Entity
@Table(
    name = "products",
    indexes = {
        @Index(name = "idx_asin", columnList = "asin"),
        @Index(name = "idx_category", columnList = "category_id"),
        @Index(name = "idx_price", columnList = "price")
    }
)
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 10, updatable = false)
    private String asin; // Amazon Standard Identification Number

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal mrp;

    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "rating_average", precision = 3, scale = 2)
    private BigDecimal ratingAverage;

    @Column(name = "rating_count")
    private Long ratingCount;

    @CreationTimestamp
    @Column(name = "listed_at", updatable = false)
    private LocalDateTime listedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

---

# Interview Questions

## Q1. What is @Entity?

**Best Answer**

> `@Entity` marks a Java class as a JPA entity, meaning Hibernate will map it to a database table. Every entity must have an `@Id` field. The table name defaults to the class name but can be customized with `@Table(name = "...")`.

---

## Q2. What are the @GeneratedValue strategies?

`IDENTITY` (auto-increment in MySQL), `SEQUENCE` (sequence object in PostgreSQL), `TABLE` (dedicated key table), `AUTO` (Hibernate decides), `UUID` (Spring Boot 3+, generates UUID).

---

## Q3. What is the difference between @Column nullable and @NotNull?

`@Column(nullable = false)` is a database-level constraint that prevents NULL in the DB column. `@NotNull` is a Java Bean Validation constraint that prevents null at the application level. Use both for complete protection.

---

## Q4. What does @Transient do?

It marks a field to be excluded from JPA persistence — the field won't be mapped to a database column and won't be included in SQL INSERT or SELECT statements.

---

## Q5. Why use EnumType.STRING instead of EnumType.ORDINAL?

`EnumType.STRING` stores the enum name (e.g., "ACTIVE") as a string, which is readable and safe if enum values are reordered. `EnumType.ORDINAL` stores the numeric position (0, 1, 2...) which breaks if new enum values are inserted in the middle.

---

# Professional Summary

```
@Entity          → class = table
@Table           → customize table name, indexes, constraints
@Id              → primary key
@GeneratedValue  → auto-generate ID (IDENTITY, UUID, SEQUENCE)
@Column          → customize column (name, nullable, length, unique)
@Enumerated      → enum → STRING or ORDINAL
@Transient       → exclude from DB
@Lob             → large objects (TEXT, BLOB)
@CreationTimestamp → set on insert
@UpdateTimestamp   → update on every save
```

---

# 🧠 Memory Trick

```
@Entity    = 📋 Form template
@Table     = 📁 Folder name for forms
@Id        = 🔑 Unique key/stamp on each form
@Column    = 📝 Each field on the form
@Transient = ✏️ Pencil note (not filed)
```

---

# 🚀 Next Chapter

We'll learn **JpaRepository** — Spring Data's magic that generates all CRUD queries automatically without writing SQL.
