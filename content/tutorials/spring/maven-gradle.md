Welcome to **Chapter 3 — Maven & Gradle**.

> **Maven and Gradle are the package managers of Java. Without them, managing dependencies would be a nightmare.**

They are to Java what `npm` is to Node.js.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you are building a toy car.

You need:

```
4 wheels
1 engine
1 body
2 headlights
```

You can:

**Option A** — Go to each shop separately.

```
Wheel shop → Wheels
Engine shop → Engine
Body shop → Body
Headlight shop → Headlights
```

**Option B** — Give a list to one delivery person.

```
Delivery List:
  - 4 wheels
  - 1 engine
  - 1 body
  - 2 headlights

Delivery person brings everything.
```

Maven / Gradle is that **delivery person**.

You write a list. They fetch everything.

---

# What is Maven?

Maven is a **build automation and dependency management tool** for Java.

You describe your project in `pom.xml`.

Maven:
* Downloads dependencies
* Compiles code
* Runs tests
* Packages your app as a `.jar` or `.war`

---

# The pom.xml File

`pom.xml` = Project Object Model.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project>
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>demo</name>
    <description>Spring Boot Demo</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>

    <dependencies>

        <!-- Spring Web (REST APIs) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- MySQL Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

---

# Maven Key Concepts

| Term | Meaning |
| --- | --- |
| `groupId` | Your organization (like `com.google`) |
| `artifactId` | Project name |
| `version` | Project version |
| `dependency` | Library you need |
| `scope` | When the dependency is used |

---

# Dependency Scopes

| Scope | When used |
| --- | --- |
| `compile` | Always (default) |
| `test` | Only during tests |
| `runtime` | Only at runtime, not compile time |
| `provided` | Provided by server (like Tomcat) |

---

# Maven Commands

```bash
# Download all dependencies
mvn install

# Build the project
mvn package

# Run tests
mvn test

# Clean build output
mvn clean

# Clean + build
mvn clean install

# Run Spring Boot app
mvn spring-boot:run
```

---

# What is Gradle?

Gradle is a **newer, faster build tool** that uses `build.gradle` (Groovy or Kotlin DSL).

It is:
* Faster than Maven (incremental builds)
* More concise syntax
* Preferred for Android and newer projects

---

# build.gradle (Groovy DSL)

```groovy
plugins {
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
    id 'java'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '17'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly 'com.mysql:mysql-connector-j'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

---

# build.gradle.kts (Kotlin DSL)

```kotlin
plugins {
    id("org.springframework.boot") version "3.2.0"
    id("io.spring.dependency-management") version "1.1.4"
    kotlin("jvm") version "1.9.0"
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    runtimeOnly("com.mysql:mysql-connector-j")
}
```

---

# Gradle Commands

```bash
# Build project
./gradlew build

# Run tests
./gradlew test

# Clean
./gradlew clean

# Run Spring Boot
./gradlew bootRun

# Package as JAR
./gradlew bootJar
```

---

# Maven vs Gradle

| Feature | Maven | Gradle |
| --- | --- | --- |
| Config file | `pom.xml` | `build.gradle` |
| Language | XML | Groovy / Kotlin |
| Speed | Slower | Faster |
| Learning curve | Easier | Moderate |
| Flexibility | Less | More |
| Popularity | Very high | Growing |
| Default in Spring | ✅ Yes | Optional |

---

# Spring Boot Starter Dependencies

One starter = many libraries included automatically.

```xml
<!-- Adds: Spring MVC, Tomcat, Jackson, Hibernate Validator -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

```xml
<!-- Adds: JPA, Hibernate, Spring Data -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

```xml
<!-- Adds: Spring Security, BCrypt -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

---

# Company Example — Infosys

Large companies manage hundreds of microservices.

Each microservice has its own `pom.xml`:

```
payment-service/pom.xml
user-service/pom.xml
order-service/pom.xml
notification-service/pom.xml
```

Maven ensures every team uses the same library versions via a **parent POM**:

```xml
<parent>
    <groupId>com.infosys</groupId>
    <artifactId>infosys-parent</artifactId>
    <version>1.0.0</version>
</parent>
```

All child projects inherit versions from parent — no conflicts.

---

# Interview Questions

## Q1. What is Maven?

**Best Answer**

> Maven is a build automation and project management tool for Java. It manages dependencies, compiles code, runs tests, and packages the application using a `pom.xml` configuration file.

---

## Q2. What is `pom.xml`?

Project Object Model — the configuration file for a Maven project that defines dependencies, plugins, build configuration, and project metadata.

---

## Q3. What is a Spring Boot Starter?

A curated set of transitive dependencies that provides everything needed for a specific feature (e.g., `spring-boot-starter-web` provides Spring MVC, embedded Tomcat, and JSON support).

---

## Q4. What is the difference between Maven and Gradle?

Maven uses XML (`pom.xml`) and is more opinionated. Gradle uses a Groovy/Kotlin DSL (`build.gradle`), is faster due to incremental builds, and is more flexible but has a steeper learning curve.

---

## Q5. What does `mvn clean install` do?

`clean` deletes the `target/` directory. `install` compiles, tests, and packages the project, then installs it into the local Maven repository (`~/.m2`).

---

# Professional Summary

```
Maven:
  pom.xml
    → <dependencies>
    → <plugins>
    → mvn clean install
    → target/app.jar

Gradle:
  build.gradle
    → dependencies { }
    → ./gradlew bootRun
    → build/libs/app.jar
```

---

# 🧠 Memory Trick

Think of Maven/Gradle as a **grocery list manager**:

```
🛒 Shopping List (pom.xml / build.gradle)

spring-boot-starter-web    ← Add to cart
spring-boot-starter-jpa    ← Add to cart
mysql-connector-j          ← Add to cart

mvn install / ./gradlew build
→ Maven/Gradle goes shopping
→ Downloads all jars
→ Project is ready
```

---

# 🚀 Next Chapter

We'll learn **Spring Boot Setup** — how to properly create and structure your first Spring Boot project from scratch.
