Welcome to **Chapter 10 — @Configuration & @Bean**.

> **@Configuration and @Bean give you full control over how Spring creates your objects. Use them when annotations alone aren't enough.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you're setting up a new office.

Most employees have standard desks (auto-configured).

But the CEO needs a custom executive desk with special requirements:

```
CEO Desk:
  - Standing desk
  - 3 monitors
  - Leather chair
  - Private room
```

You can't use a standard desk for the CEO.

You need to manually set it up.

`@Configuration` + `@Bean` = **custom setup for special cases**.

---

# What is @Configuration?

`@Configuration` marks a class as a source of bean definitions.

It tells Spring: "This class defines how to create certain beans."

```java
@Configuration
public class AppConfig {
    // Bean definitions go here
}
```

---

# What is @Bean?

`@Bean` on a method means:

> "The return value of this method is a Spring-managed bean."

```java
@Configuration
public class AppConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

Now `BCryptPasswordEncoder` is a bean — inject anywhere with `@Autowired`.

---

# Why Use @Bean?

Use `@Bean` when:

```
1. The class is from a third-party library
   (You can't add @Component to it)

2. You need custom configuration
   (e.g., RestTemplate with timeout settings)

3. You need conditional bean creation

4. You need to control the exact construction
```

---

# Common @Bean Examples

## PasswordEncoder

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(10); // strength = 10
}
```

---

## RestTemplate (HTTP Client)

```java
@Bean
public RestTemplate restTemplate() {
    RestTemplate restTemplate = new RestTemplate();

    // Set timeouts
    HttpComponentsClientHttpRequestFactory factory =
        new HttpComponentsClientHttpRequestFactory();
    factory.setConnectTimeout(5000);
    factory.setReadTimeout(10000);

    restTemplate.setRequestFactory(factory);
    return restTemplate;
}
```

---

## ModelMapper

```java
@Bean
public ModelMapper modelMapper() {
    ModelMapper mapper = new ModelMapper();
    mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
    return mapper;
}
```

---

## CORS Configuration

```java
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "https://myapp.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
        }
    };
}
```

---

# @Bean with Dependencies

Beans can depend on other beans:

```java
@Configuration
public class AppConfig {

    @Bean
    public UserRepository userRepository(DataSource dataSource) {
        return new UserRepository(dataSource);
    }

    @Bean
    public UserService userService(UserRepository userRepository) {
        return new UserService(userRepository);
    }
}
```

Or call @Bean methods directly:

```java
@Configuration
public class AppConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthService authService() {
        return new AuthService(passwordEncoder()); // Spring intercepts this call
    }
}
```

Spring ensures `passwordEncoder()` returns the singleton — doesn't create a new one.

---

# @Configuration vs @Component

| Feature | @Configuration | @Component |
| --- | --- | --- |
| Purpose | Define beans manually | Auto-detected component |
| @Bean support | ✅ Full support | ⚠️ Limited (no proxy) |
| Bean singleton | ✅ Properly proxied | ⚠️ May create duplicates |
| Use case | Third-party, custom setup | Your own classes |

---

# Separation by Concern

Good practice — split configurations:

```java
@Configuration
public class DatabaseConfig {

    @Bean
    public DataSource dataSource() { ... }

    @Bean
    public JpaVendorAdapter jpaVendorAdapter() { ... }
}

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() { ... }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) { ... }
}

@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() { ... }
}
```

---

# @Import — Combine Configurations

```java
@Configuration
@Import({ DatabaseConfig.class, SecurityConfig.class, CacheConfig.class })
public class RootConfig {
    // All three configurations loaded
}
```

---

# Company Example — Razorpay SDK

Razorpay doesn't have Spring annotations.

You need to configure it as a bean:

```java
@Configuration
public class RazorpayConfig {

    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret}")
    private String secret;

    @Bean
    public RazorpayClient razorpayClient() throws RazorpayException {
        RazorpayClient client = new RazorpayClient(key, secret);
        return client;
    }
}

// Use anywhere
@Service
public class PaymentService {

    @Autowired
    private RazorpayClient razorpayClient; // injected!
}
```

---

# Interview Questions

## Q1. What is @Configuration in Spring?

**Best Answer**

> `@Configuration` marks a class as a Spring configuration class. It can contain `@Bean` methods that define beans to be registered in the Spring ApplicationContext. Spring proxies `@Configuration` classes to ensure singleton behavior for `@Bean` methods.

---

## Q2. When do you use @Bean instead of @Component?

Use `@Bean` when you need to create a bean from a third-party library class (which you can't annotate with `@Component`), or when you need custom setup logic during bean creation.

---

## Q3. What is the difference between @Configuration and @Component for defining @Bean?

`@Configuration` classes are CGLIB-proxied, so calling a `@Bean` method always returns the same singleton instance. In a `@Component` class, each `@Bean` method call creates a new instance.

---

## Q4. Can @Bean methods have parameters?

Yes. Spring will inject the required beans as method parameters automatically.

---

## Q5. What does @Import do?

It imports one or more `@Configuration` classes into the current configuration, allowing you to organize configurations into separate files.

---

# Professional Summary

```
@Configuration  → Config class (defines beans)
@Bean           → Method that returns a managed bean

When to use:
  Third-party libraries    → Can't add @Component
  Custom initialization    → Need specific setup
  Conditional creation     → @ConditionalOnProperty

Examples:
  PasswordEncoder, RestTemplate, ModelMapper, CORS, etc.
```

---

# 🧠 Memory Trick

```
@Configuration = Recipe Book
@Bean = A single Recipe

"How to make BCrypt Password Encoder"
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

Spring reads the recipe, makes it once, serves it everywhere.
```

---

# 🚀 Next Chapter

We'll learn **Component Scanning** — how Spring automatically discovers your classes and turns them into beans.
