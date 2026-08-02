Welcome to **Chapter 29 — Spring Security Overview**.

> **Spring Security is the most powerful security framework for Java. It protects your application from unauthorized access, attacks, and data breaches.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a big office building.

```
🏢 Office Building

1. Security Guard at entrance (Authentication)
   → "Show me your ID card"
   → "Valid? Enter. Invalid? Sorry, no entry."

2. Access Control at each floor (Authorization)
   → CEO: Access all floors
   → Manager: Access floors 1-3
   → Employee: Access floor 1 only
   → Visitor: Access lobby only
```

Spring Security is the entire security system of that building.

---

# What is Spring Security?

Spring Security is a framework that provides:

```
✅ Authentication   → Who are you?
✅ Authorization    → What can you do?
✅ Protection       → CSRF, XSS, Session Fixation
✅ Password Encoding → BCrypt hashing
✅ OAuth2 / JWT     → Modern token-based security
```

---

# Adding Spring Security

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

**Immediately after adding this:**

All endpoints are secured. Access requires login.

Default login: username `user`, password printed in console:

```
Using generated security password: 3a52b6c8-...
```

---

# How Spring Security Works

```
HTTP Request
     ↓
Filter Chain (Spring Security Filters)
     ↓
Authentication Filter
  → Check credentials / token
     ↓
SecurityContext
  → Store authenticated user info
     ↓
Authorization Check
  → Does this user have permission?
     ↓
Controller (if authorized)
     ↓
Response
```

---

# Key Concepts

## Authentication

Verifying identity.

```
Who are you?
→ Username + Password
→ JWT Token
→ OAuth2 (Google, GitHub login)
```

---

## Authorization

Verifying permissions.

```
What can you do?
→ ROLE_USER    → Read data
→ ROLE_ADMIN   → CRUD data
→ ROLE_MANAGER → Partial access
```

---

## SecurityContext

Holds the authenticated user for the duration of the request.

```java
// Get current user anywhere in the app
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String username = auth.getName();

// Or use @AuthenticationPrincipal
@GetMapping("/profile")
public UserResponse getProfile(@AuthenticationPrincipal UserDetails userDetails) {
    return userService.findByEmail(userDetails.getUsername());
}
```

---

# SecurityFilterChain

The central configuration (Spring Security 6+):

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Disable CSRF for REST APIs
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()      // Public
                .requestMatchers("/api/admin/**").hasRole("ADMIN") // Admin only
                .anyRequest().authenticated()                      // All else needs auth
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // No sessions (JWT)
            );

        return http.build();
    }
}
```

---

# Common URL Matchers

```java
.requestMatchers("/api/public/**").permitAll()
// All sub-paths of /api/public/ are publicly accessible

.requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
// Only GET requests on /api/products/ are public

.requestMatchers("/api/admin/**").hasRole("ADMIN")
// Only ADMIN role

.requestMatchers("/api/users/**").hasAnyRole("USER", "ADMIN")
// Either role

.anyRequest().authenticated()
// Everything else needs any authenticated user
```

---

# Built-in Protection

Spring Security provides automatic protection against:

| Attack | Protection |
| --- | --- |
| CSRF | Cross-Site Request Forgery token |
| Session Fixation | Auto-regenerate session ID |
| Clickjacking | X-Frame-Options header |
| XSS | Content-Security-Policy |
| Brute Force | Can integrate with rate limiting |

---

# Spring Security Filters (Order Matters)

```
Request arrives
     ↓
SecurityContextPersistenceFilter
     ↓
UsernamePasswordAuthenticationFilter (or JwtAuthFilter)
     ↓
BasicAuthenticationFilter
     ↓
ExceptionTranslationFilter
     ↓
FilterSecurityInterceptor
     ↓
Controller
```

---

# Company Example — LinkedIn

LinkedIn's security requirements:

```
Public (no login needed):
  GET /jobs             → Anyone can browse jobs
  GET /company/{id}     → Company profile is public
  POST /auth/login      → Login endpoint

Authenticated (any logged-in user):
  GET /feed             → Must be logged in
  GET /profile/{id}     → Must be logged in

Role-based:
  POST /admin/users     → ADMIN only
  DELETE /admin/post    → ADMIN only

Premium features:
  GET /who-viewed        → PREMIUM role
```

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/jobs/**", "/company/**", "/auth/**").permitAll()
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .requestMatchers("/premium/**").hasRole("PREMIUM")
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    return http.build();
}
```

---

# Interview Questions

## Q1. What is Spring Security?

**Best Answer**

> Spring Security is a comprehensive security framework for Spring applications providing authentication (verifying identity), authorization (controlling access), and protection against common attacks like CSRF, XSS, and session fixation. It integrates as a filter chain that intercepts all HTTP requests.

---

## Q2. What is the difference between Authentication and Authorization?

Authentication verifies WHO the user is (login with credentials). Authorization determines WHAT they can do (which resources/actions they can access based on roles/permissions).

---

## Q3. What is SecurityFilterChain?

In Spring Security 6+, `SecurityFilterChain` is the primary way to configure security rules. It defines URL matchers, authentication mechanisms, session management, and custom filters.

---

## Q4. What is the SecurityContext?

A thread-local holder that stores the `Authentication` object for the current request. Access anywhere via `SecurityContextHolder.getContext().getAuthentication()`.

---

## Q5. Why disable CSRF for REST APIs?

CSRF attacks target browser-based cookie authentication. REST APIs typically use stateless token-based auth (JWT) sent in the `Authorization` header, which is not automatically sent by browsers, making CSRF irrelevant.

---

# Professional Summary

```
Spring Security Flow:

Request → Filter Chain → Auth Check → AuthZ Check → Controller

Key components:
  SecurityFilterChain  → Main config
  AuthenticationManager → Validates credentials
  UserDetailsService   → Loads user from DB
  PasswordEncoder      → BCrypt hashing
  SecurityContext      → Stores current user

Access control:
  .permitAll()                → No auth needed
  .authenticated()            → Any logged-in user
  .hasRole("ADMIN")           → Specific role
  .hasAnyRole("USER","ADMIN") → Multiple roles

Session:
  STATELESS → JWT (REST APIs)
  ALWAYS    → Sessions (Web apps)
```

---

# 🧠 Memory Trick

```
Spring Security = Airport Security

Check-in counter (Authentication)
→ Verify identity → boarding pass issued (token)

Security gate (Authorization)
→ Check boarding pass → right gate allowed

Different gates for different classes:
Economy  → ROLE_USER
Business → ROLE_PREMIUM
First    → ROLE_ADMIN
```

---

# 🚀 Next Chapter

We'll implement **Authentication & Authorization** — the full flow from login to accessing protected endpoints.
