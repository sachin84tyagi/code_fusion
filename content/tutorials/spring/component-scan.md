Welcome to **Chapter 11 — Component Scanning**.

> **Component Scanning is Spring's auto-discovery system. It finds your annotated classes and registers them as beans automatically.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a school.

The principal sends a scout to find all teachers.

```
Scout goes to every room

Room 101: Found a Math Teacher (@Service) → Register!
Room 102: Found a Science Teacher (@Service) → Register!
Room 103: Found a Librarian (@Repository) → Register!
Room 104: Found an Admin (@Component) → Register!
```

The principal now has a list of all staff.

**Component Scanning** is that scout.

Spring scans your packages and finds all annotated classes.

---

# How Component Scanning Works

```
@SpringBootApplication
       ↓
@ComponentScan (included automatically)
       ↓
Scans base package and all sub-packages
       ↓
Finds @Component, @Service, @Repository, @Controller, @RestController
       ↓
Registers them as beans in ApplicationContext
```

---

# Default Behavior

`@SpringBootApplication` triggers component scanning from the **package where it's declared** and all sub-packages.

```
com.example.myapp/
  MyappApplication.java   ← @SpringBootApplication here
  controller/
    UserController.java   ← ✅ Scanned
  service/
    UserService.java      ← ✅ Scanned
  repository/
    UserRepository.java   ← ✅ Scanned

com.other.package/
    SomeClass.java        ← ❌ NOT scanned (outside base package)
```

---

# Custom Component Scan

Explicitly specify which packages to scan:

```java
@SpringBootApplication
@ComponentScan(basePackages = {
    "com.example.myapp",
    "com.example.shared"
})
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

---

# @ComponentScan Options

```java
@ComponentScan(
    basePackages = "com.example",                // scan package
    basePackageClasses = MyApp.class,            // scan from class location
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ANNOTATION,
        classes = Repository.class               // exclude @Repository
    ),
    includeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = SpecialService.class
    )
)
```

---

# Filter Types

| Filter Type | Description |
| --- | --- |
| `ANNOTATION` | Exclude/include by annotation |
| `ASSIGNABLE_TYPE` | Exclude/include by class/interface |
| `REGEX` | Exclude/include by regex pattern |
| `CUSTOM` | Custom TypeFilter implementation |

---

# Excluding a Class

Suppose you have a test class you don't want scanned:

```java
@ComponentScan(
    basePackages = "com.example",
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = TestDataLoader.class
    )
)
```

---

# @Component with Custom Name

By default, bean name = class name in camelCase.

```java
@Service
public class UserService { }
// Bean name: "userService"

@Service("accountService")
public class UserService { }
// Bean name: "accountService"
```

---

# Project Package Structure Best Practice

Keep all your code under one root package:

```
com.example.myapp/          ← Main package
  MyappApplication.java     ← @SpringBootApplication
  controller/
  service/
  repository/
  model/
  config/
  dto/
  exception/
  security/
  util/
```

All sub-packages are automatically scanned.

---

# Company Example — BookMyShow

```
com.bookmyshow/
  BookMyShowApplication.java    ← Scanning starts here

  controller/
    MovieController.java        ✅ Scanned
    BookingController.java      ✅ Scanned
    TheaterController.java      ✅ Scanned

  service/
    MovieService.java           ✅ Scanned
    BookingService.java         ✅ Scanned
    NotificationService.java    ✅ Scanned

  repository/
    MovieRepository.java        ✅ Scanned
    BookingRepository.java      ✅ Scanned

  config/
    SecurityConfig.java         ✅ Scanned (@Configuration)
    CacheConfig.java            ✅ Scanned (@Configuration)
```

Every class is discovered automatically — no manual registration.

---

# Interview Questions

## Q1. What is Component Scanning in Spring?

**Best Answer**

> Component scanning is Spring's mechanism to automatically detect classes annotated with `@Component` (and its specializations `@Service`, `@Repository`, `@Controller`) and register them as beans in the ApplicationContext without explicit bean declarations.

---

## Q2. What triggers component scanning in Spring Boot?

The `@SpringBootApplication` annotation, which includes `@ComponentScan`, triggers scanning from the package of the main class and all its sub-packages.

---

## Q3. What happens if a class is outside the base package?

It will not be scanned and will not become a Spring bean. You need to either move it inside the base package or add it to the scan with `@ComponentScan(basePackages = "...")`.

---

## Q4. How can you exclude a class from component scanning?

Use `@ComponentScan(excludeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, classes = YourClass.class))`.

---

## Q5. What is the default bean name for a class annotated with @Service?

The class name in camelCase. `UserService` → `"userService"`. You can override it with `@Service("customName")`.

---

# Professional Summary

```
Component Scanning:

  @SpringBootApplication
    → Scans base package + sub-packages
    → Finds @Component, @Service, @Repository, @Controller
    → Registers as beans

  Custom scan:
    @ComponentScan(basePackages = "com.example")

  Exclude:
    excludeFilters = @Filter(...)

  Bean naming:
    Default: ClassName → "className"
    Custom:  @Service("myName")
```

---

# 🧠 Memory Trick

Component Scanning = **Airport Security Scanner**

```
🛂 Airport Security (ComponentScan)

Scans all bags (packages)
Finds items with specific labels (@Service, @Repository...)
Registers them in the system (ApplicationContext)
Rejects unlabeled items (no annotation = not a bean)
```

---

# 🚀 Next Chapter

We'll learn **Spring Profiles** — how to run different configurations for development, testing, and production environments.
