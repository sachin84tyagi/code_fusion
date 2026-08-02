Welcome to **Chapter 4 — Spring Boot Setup**.

> **A well-structured Spring Boot project is the foundation of every great backend. Get the setup right from day one.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine building a Lego house.

You get a box with all pieces sorted.

```
📦 Lego Box
  - Blue pieces (walls)
  - Red pieces (roof)
  - Yellow pieces (windows)
  - Instructions booklet
```

Spring Initializr gives you that box — pre-sorted, ready to assemble.

---

# Spring Initializr

The fastest way to create a Spring Boot project.

```
https://start.spring.io
```

Select:

```
Project   : Maven
Language  : Java
Spring Boot: 3.2.x

Group     : com.example
Artifact  : myapp
Name      : myapp
Packaging : Jar
Java      : 17

Dependencies:
  ✅ Spring Web
  ✅ Spring Data JPA
  ✅ MySQL Driver
  ✅ Lombok
  ✅ Spring Boot DevTools
```

Click **Generate** → Download ZIP → Extract → Open in IDE.

---

# Project Structure

```
myapp/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/myapp/
│   │   │       ├── MyappApplication.java
│   │   │       ├── controller/
│   │   │       │   └── UserController.java
│   │   │       ├── service/
│   │   │       │   └── UserService.java
│   │   │       ├── repository/
│   │   │       │   └── UserRepository.java
│   │   │       └── model/
│   │   │           └── User.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   │           └── (static files)
│   └── test/
│       └── java/
│           └── com/example/myapp/
│               └── MyappApplicationTests.java
├── pom.xml
└── mvnw
```

---

# Main Application Class

```java
package com.example.myapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyappApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyappApplication.class, args);
    }
}
```

This is the entry point.

Run this class → Spring Boot starts.

---

# The Layer Architecture

```
Controller Layer  → Handles HTTP requests
        ↓
Service Layer     → Business logic
        ↓
Repository Layer  → Database access
        ↓
Database
```

---

# Controller

```java
package com.example.myapp.controller;

import com.example.myapp.model.User;
import com.example.myapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}
```

---

# Service

```java
package com.example.myapp.service;

import com.example.myapp.model.User;
import com.example.myapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
```

---

# Repository

```java
package com.example.myapp.repository;

import com.example.myapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
```

---

# Model

```java
package com.example.myapp.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
}
```

---

# Running the Application

```bash
# Using Maven
mvn spring-boot:run

# Or run MyappApplication.java from IDE
```

Output:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

Started MyappApplication in 2.345 seconds
```

Visit `http://localhost:8080/api/users`

---

# DevTools (Hot Reload)

Add `spring-boot-devtools` to `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

Changes to code → Server auto-restarts.

No need to stop and restart manually.

---

# application.properties

```properties
# Server port
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=secret

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

# Company Example — Zomato

Zomato's backend has multiple Spring Boot services:

```
restaurant-service/
  src/main/java/com/zomato/restaurant/
    controller/RestaurantController.java
    service/RestaurantService.java
    repository/RestaurantRepository.java
    model/Restaurant.java

order-service/
  src/main/java/com/zomato/order/
    controller/OrderController.java
    service/OrderService.java
    ...
```

Each service follows the same layered structure.

---

# Interview Questions

## Q1. What is the standard package structure for a Spring Boot project?

**Best Answer**

> A typical Spring Boot project has layers: `controller` (handles requests), `service` (business logic), `repository` (database access), and `model`/`entity` (data classes). All packages are under the main package that contains `@SpringBootApplication`.

---

## Q2. What is `@SpringBootApplication`?

A convenience annotation combining `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`. It enables auto-configuration and component scanning from the current package.

---

## Q3. What is Spring Initializr?

A web tool at `start.spring.io` that generates a Spring Boot project skeleton with the selected dependencies, reducing initial project setup time to seconds.

---

## Q4. What is the role of `application.properties`?

It is the central configuration file for a Spring Boot application, where you configure the server port, database connection, JPA settings, logging, and other properties.

---

## Q5. What is Spring Boot DevTools?

A development-time dependency that enables automatic application restart when class files change, live reload of browser pages, and enhanced logging during development.

---

# Professional Summary

```
Spring Boot Project Structure:

controller/   → HTTP request/response
service/      → Business logic
repository/   → Data access
model/        → Data classes
resources/    → Config files

Start:
  @SpringBootApplication
  SpringApplication.run()
  → Server on port 8080
```

---

# 🧠 Memory Trick

Think of project layers as a **restaurant**:

```
🏨 Restaurant

Waiter (Controller)
  → Takes order from customer
  → Passes to kitchen

Chef (Service)
  → Prepares the food
  → Business logic

Pantry (Repository)
  → Stores ingredients
  → Fetches from storage (DB)
```

---

# 🚀 Next Chapter

We'll master **application.properties** — the configuration file that controls every aspect of your Spring Boot application.
