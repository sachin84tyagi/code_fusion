एक E-Commerce Site थी — **ShopKart**।

किसी दिन उन्होंने Notice किया:

```text
Anonymous User ने Access किया:
  /admin/users → User List देखी ✅
  /admin/delete → Product Delete किया ✅
  /admin/reports → Revenue देखा ✅
```

कोई भी Admin Panel Access कर रहा था।

Business ने कहा:

> **"यह कैसे हुआ?"**

Developer ने कहा:

> "Security नहीं लगाई थी।"

---

यहीं से **Spring Security** की ज़रूरत समझ आती है।

---

# Chapter 35 – Spring Security Basics

---

# Security के दो Main Concepts

```text
Authentication (प्रमाणीकरण):
  "तुम कौन हो?"
  → Username + Password Check
  → Token Verify

Authorization (प्राधिकरण):
  "तुम्हें क्या Access है?"
  → Admin? User? Guest?
  → Role-Based Access
```

---

# Spring Security कैसे काम करता है?

## Filter Chain – यही Core है

```text
HTTP Request
    ↓
Tomcat
    ↓
┌───────────────────────────────────────────┐
│         SPRING SECURITY FILTER CHAIN      │
│                                           │
│  SecurityContextPersistenceFilter         │
│    ↓                                      │
│  UsernamePasswordAuthenticationFilter     │
│    ↓                                      │
│  BasicAuthenticationFilter               │
│    ↓                                      │
│  BearerTokenAuthenticationFilter (JWT)   │
│    ↓                                      │
│  ExceptionTranslationFilter              │
│    ↓                                      │
│  FilterSecurityInterceptor               │
│                                           │
└───────────────────────────────────────────┘
    ↓
DispatcherServlet
    ↓
Controller
```

---

## Filter Chain क्या है?

Filters की एक Chain।

हर Request इस Chain से गुज़रती है।

हर Filter एक काम करता है।

---

## Real Life Analogy

Airport Security।

```text
Passport Check (Authentication Filter)
    ↓
Boarding Pass Check (Authorization Filter)
    ↓
Baggage Scanner (Content Filter)
    ↓
Gate Check (Final Access Control)
    ↓
✅ Gate पर बैठो (Controller)
```

कोई भी Step Fail हो → Reject।

---

# Spring Security Setup

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

यह Add करते ही:

```text
✅ सभी URLs Protected हो गए
✅ Default Login Page बन गई
✅ Default User: "user" / Random Password (Console में Print)
```

---

# SecurityConfig – Custom Configuration

```java
@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()     // Login/Register
                .requestMatchers("/api/admin/**").hasRole("ADMIN") // Admin Only
                .requestMatchers("/api/public/**").permitAll()   // Public
                .anyRequest().authenticated()                    // बाकी Login चाहिए
            )
            .csrf(csrf -> csrf.disable())  // REST API के लिए
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                // JWT Use करेंगे — Sessions नहीं
            );

        return http.build();
    }
}
```

---

# Authentication – User Verify करना

## UserDetailsService

```java
@Service
class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() ->
                    new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())  // BCrypt Encoded
                .roles(user.getRole())          // "ADMIN", "USER"
                .build();
    }
}
```

---

## BCrypt Password

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// Registration में:
String encodedPassword = passwordEncoder.encode("rawPassword");
user.setPassword(encodedPassword);

// Spring Security automatically:
// Login Time → rawPassword → BCrypt → Compare with DB
```

---

# JWT – JSON Web Token ⭐⭐⭐⭐⭐

Modern REST APIs में Sessions नहीं।

JWT Use होता है।

---

## JWT क्या है?

```text
JWT = Header.Payload.Signature

Header:
  {
    "alg": "HS256",
    "typ": "JWT"
  }

Payload:
  {
    "sub": "rahul@example.com",
    "role": "ADMIN",
    "iat": 1720000000,
    "exp": 1720003600  // 1 hour expiry
  }

Signature:
  HMACSHA256(
    base64(header) + "." + base64(payload),
    secretKey
  )
```

---

## JWT Flow

```text
1. User Login करता है (POST /api/auth/login)
         ↓
2. Server: Username/Password Verify
         ↓
3. Server: JWT Token Generate करता है
         ↓
4. Client को Token मिलता है
         ↓
5. Client हर Request में Token भेजता है:
   Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
         ↓
6. Server Token Verify करता है
         ↓
7. Valid → Request Process
   Invalid → 401 Unauthorized
```

---

## JWT Implementation

```java
// JWT Utility
@Component
class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", userDetails.getAuthorities());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }
}
```

---

## JWT Filter

```java
@Component
class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
            throws ServletException, IOException {

        // 1. Header से Token निकालो
        String authHeader = req.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }

        String token = authHeader.substring(7);

        // 2. Token से Username निकालो
        String username = jwtUtil.extractUsername(token);

        // 3. अगर Username है और Already Authenticated नहीं
        if (username != null &&
            SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails =
                userDetailsService.loadUserByUsername(username);

            // 4. Token Valid है?
            if (jwtUtil.isTokenValid(token, userDetails)) {

                // 5. SecurityContext में Set करो
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );
                authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(req)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        chain.doFilter(req, res);
    }
}
```

---

## SecurityConfig with JWT

```java
@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

# Authorization – Role-Based Access

## @PreAuthorize

```java
@RestController
class AdminController {

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")  // ADMIN ही Access कर सकता है
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}

// Enable करो Config में:
@EnableMethodSecurity  // @PreAuthorize enable करने के लिए
```

---

## SecurityContext से Current User

```java
@Service
class OrderService {

    public Order createOrder(OrderRequest req) {

        // Current Logged-In User लो
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User currentUser = userService.findByUsername(username);

        Order order = new Order();
        order.setUser(currentUser);
        // ...
        return orderRepository.save(order);
    }
}
```

---

# Login API

```java
@RestController
@RequestMapping("/api/auth")
class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {

        // 1. Authentication Attempt
        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    req.getUsername(),
                    req.getPassword()
                )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401)
                    .body(new LoginResponse(null, "Invalid credentials"));
        }

        // 2. JWT Generate करो
        UserDetails userDetails =
            userDetailsService.loadUserByUsername(req.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new LoginResponse(token, "Login successful"));
    }
}
```

---

# Security Filter Chain – पूरा Flow

```text
Request: GET /api/admin/users
         Header: Authorization: Bearer eyJhbG...

    ↓

JwtAuthFilter:
  Token Extract किया
  JWT Verify किया
  Username: "rahul@example.com"
  Role: ["ADMIN"]
  SecurityContext में Set किया

    ↓

FilterSecurityInterceptor:
  URL: /api/admin/users
  Required Role: ADMIN
  Current User Role: ADMIN ✅
  Access Granted!

    ↓

DispatcherServlet → AdminController.getAllUsers()
```

---

# Interview Questions

---

## Q1. Authentication और Authorization में क्या अंतर है?

**Answer:**

```text
Authentication: "तुम कौन हो?"
  → Username/Password Verify
  → Token Verify
  → "Identity Confirm"

Authorization: "तुम्हें क्या Access है?"
  → Role Check (ADMIN, USER, GUEST)
  → Permission Check
  → "Access Decision"
```

---

## Q2. Spring Security Filter Chain क्या है?

**Answer:**

Servlet Filters की एक Chain जो हर Request से पहले चलती है।

Security-related काम यहाँ होता है:
- JWT Token Extract और Verify
- Session Check
- CSRF Protection
- Exception Handle (401, 403)

DispatcherServlet से **पहले** चलती है।

---

## Q3. JWT Session-based Authentication से Better क्यों है?

**Answer:**

```text
Session-based:
  → Server Side State रखता है
  → Multiple Servers → Session Sync Problem
  → Scale करना मुश्किल

JWT:
  → Stateless (Server कोई State नहीं रखता)
  → Token में सब Info है
  → Horizontally Scale करना आसान
  → Microservices Friendly
```

---

## Q4. @PreAuthorize कैसे काम करता है?

**Answer:**

AOP से।

Method Call से पहले Spring `AccessDecisionManager` से Check करता है।

Current User की Role/Permission देखता है।

Match नहीं → `AccessDeniedException` → 403 Forbidden।

---

## Q5. SecurityContextHolder क्या है?

**Answer:**

Current Thread का Security Context Store करता है।

Default: `ThreadLocal` based।

इसमें Authenticated User की Information है।

```java
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String username = auth.getName();
Collection<? extends GrantedAuthority> roles = auth.getAuthorities();
```

---

# Best Practices

---

## 1. Passwords हमेशा BCrypt से

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);  // Strength: 12
}
```

---

## 2. JWT Secret Strong रखो

```properties
# ❌ गलत — Short Secret
jwt.secret=secret

# ✅ Strong Secret (256+ bits)
jwt.secret=myVeryLongAndStrongSecretKey2024ForJWTTokenGenerationThatIsAtLeast256Bits
```

---

## 3. HTTPS Production में ज़रूरी

```text
JWT Intercepted हो सकता है HTTP पर।
HTTPS = Encrypted Channel।
```

---

## 4. Token Expiry Short रखो

```properties
jwt.expiration=3600000  # 1 hour (milliseconds)
```

---

# Common Mistakes

---

## Mistake 1 — CSRF Disable नहीं करना (REST API में)

```java
// REST API में Session नहीं — CSRF ज़रूरी नहीं
http.csrf(csrf -> csrf.disable());
```

---

## Mistake 2 — Plain Password Store करना

```java
// ❌ Plain Text
user.setPassword("mypassword");

// ✅ BCrypt
user.setPassword(passwordEncoder.encode("mypassword"));
```

---

## Mistake 3 — JWT Secret को Properties में Hard-code

```java
// ❌ Source Code में Secret
String secret = "mySecret";

// ✅ Environment Variable से
@Value("${JWT_SECRET}")
private String secret;
```

---

# इस Chapter का निष्कर्ष

```text
Spring Security = Filter Chain + Authentication + Authorization

Filter Chain:
  → सभी Requests से पहले चलती है
  → JWT Verify करती है
  → SecurityContext Set करती है

Authentication:
  → UserDetailsService
  → BCrypt Password
  → JWT Token

Authorization:
  → Role-Based (@PreAuthorize)
  → URL-Based (SecurityFilterChain)

JWT Flow:
  Login → Token Generate → Token Send
  Next Request → Token Verify → Access Grant/Deny
```

---

# Phase 3 – Advanced Spring Internals Complete ✅

```text
Chapter 28 → Bean Lifecycle
Chapter 29 → Bean Scope
Chapter 30 → Spring AOP
Chapter 31 → Spring Proxy (JDK vs CGLIB)
Chapter 32 → Spring Transactions
Chapter 33 → Spring Boot Auto Configuration
Chapter 34 → Spring MVC Internal Flow
Chapter 35 → Spring Security Basics
```

---

### आगे का रास्ता

```text
Phase 4 – Spring Boot Enterprise Project
  Real Amazon Clone
  Login, JWT, Products, Cart, Orders
  Payment, Exception Handling, Validation
  Docker, Testing, Swagger

Phase 5 – Senior Spring Developer
  Reflection Deep Dive
  Dynamic Proxy Source Code
  BeanFactory Source Code Debugging
  Memory Optimization
  Performance Tuning

Phase 6 – Enterprise Architecture
  Microservices
  API Gateway, Kafka, Redis
  Kubernetes, AWS
```

---

> **"Spring Framework सीखना अब नहीं रुकता।"**

> **"यह एक Career है।"**

> **"और यहाँ से तुम्हारा असली सफर शुरू होता है।"**
