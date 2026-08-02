Welcome to **Chapter 32 — SecurityFilterChain & WebSecurityConfig**.

> **SecurityFilterChain is your application's security blueprint. Every rule about who can access what is defined here.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a gated community.

Security rules are posted at the gate:

```
Security Rules:

✅ Residents: Full access
✅ Delivery: Access to lobby only
✅ Guests: Access with resident's permission
❌ Strangers: No access
```

`SecurityFilterChain` is that rulebook at the gate.

---

# SecurityFilterChain (Spring Security 6+)

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // 1. Disable CSRF (not needed for stateless REST)
            .csrf(csrf -> csrf.disable())

            // 2. CORS Configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 3. URL Authorization Rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()

                // Swagger UI (development only)
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // Role-based access
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
                .requestMatchers("/api/manager/**").hasAnyRole("ADMIN", "MANAGER")

                // Secure everything else
                .anyRequest().authenticated()
            )

            // 4. Stateless session (no cookies, use JWT)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // 5. Custom authentication provider
            .authenticationProvider(authenticationProvider())

            // 6. Add JWT filter before username/password filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

            // 7. Exception handling
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(unauthorizedHandler())
                .accessDeniedHandler(accessDeniedHandler())
            );

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
        AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "https://myapp.com"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationEntryPoint unauthorizedHandler() {
        return (request, response, ex) -> {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Please log in\"}");
        };
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, ex) -> {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("{\"error\":\"Forbidden\",\"message\":\"Access denied\"}");
        };
    }
}
```

---

# CORS Explained

CORS (Cross-Origin Resource Sharing) — allows your React frontend to call your Spring backend.

```
Frontend: http://localhost:3000
Backend:  http://localhost:8080

Without CORS: Browser blocks the request
With CORS: Backend tells browser "it's OK"
```

---

# Session Policies

| Policy | Description | Use Case |
| --- | --- | --- |
| `STATELESS` | No session created | REST APIs with JWT |
| `IF_REQUIRED` | Create if needed | Default |
| `ALWAYS` | Always create session | Traditional web apps |
| `NEVER` | Never create, use if exists | Rare |

---

# HTTP Security Headers

Spring Security adds security headers automatically:

```java
http.headers(headers -> headers
    .frameOptions(frame -> frame.deny())              // X-Frame-Options: DENY
    .contentTypeOptions(ct -> ct.disable())           // X-Content-Type-Options
    .httpStrictTransportSecurity(hsts -> hsts
        .includeSubDomains(true)
        .maxAgeInSeconds(31536000)
    )
);
```

---

# Multiple Security Chains

Different rules for different URL groups:

```java
// API Security
@Bean
@Order(1)
public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
    http
        .securityMatcher("/api/**")
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

// Admin Console Security (with form login)
@Bean
@Order(2)
public SecurityFilterChain adminFilterChain(HttpSecurity http) throws Exception {
    http
        .securityMatcher("/admin/**")
        .authorizeHttpRequests(auth -> auth.anyRequest().hasRole("ADMIN"))
        .formLogin(form -> form.loginPage("/admin/login").permitAll());

    return http.build();
}
```

---

# Permit All vs Anonymous

```java
.requestMatchers("/api/public/**").permitAll()
// Both authenticated and anonymous can access

.requestMatchers("/api/test/**").anonymous()
// Only unauthenticated (anonymous) users
```

---

# Company Example — Razorpay Dashboard

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class RazorpaySecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfig()))
            .authorizeHttpRequests(auth -> auth
                // Webhook endpoint — public but verified by signature
                .requestMatchers(HttpMethod.POST, "/api/webhooks/**").permitAll()

                // Public dashboard data
                .requestMatchers(HttpMethod.GET, "/api/v1/plans").permitAll()

                // Authentication
                .requestMatchers("/api/v1/auth/**").permitAll()

                // Test mode endpoints
                .requestMatchers("/api/v1/test/**").hasAuthority("SCOPE_TEST")

                // Live mode endpoints
                .requestMatchers("/api/v1/live/**").hasAuthority("SCOPE_LIVE")

                // Admin
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Everything else
                .anyRequest().authenticated()
            )
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(apiKeyFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtFilter, ApiKeyAuthFilter.class)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(customUnauthorizedHandler)
                .accessDeniedHandler(customForbiddenHandler)
            );

        return http.build();
    }
}
```

---

# Interview Questions

## Q1. What is SecurityFilterChain?

**Best Answer**

> `SecurityFilterChain` is the primary configuration mechanism in Spring Security 6+ that defines security rules for HTTP requests: URL authorization, authentication mechanisms, CORS, CSRF, session management, and custom filters. It replaces the older `WebSecurityConfigurerAdapter`.

---

## Q2. What does `.csrf(csrf -> csrf.disable())` do?

It disables CSRF protection. This is appropriate for REST APIs that use JWT (stateless, no cookies), since CSRF attacks target cookie-based sessions.

---

## Q3. What is `SessionCreationPolicy.STATELESS`?

It tells Spring Security not to create or use HTTP sessions. Each request must contain all necessary information (e.g., JWT token). This is the correct setting for REST APIs.

---

## Q4. What is `AuthenticationEntryPoint`?

It handles the response when an unauthenticated request tries to access a secured endpoint. The default sends a 401 redirect to a login page; for REST APIs, override it to return JSON.

---

## Q5. What is the difference between `AccessDeniedHandler` and `AuthenticationEntryPoint`?

`AuthenticationEntryPoint` handles 401 Unauthorized (user not logged in). `AccessDeniedHandler` handles 403 Forbidden (user is logged in but lacks required role/permission).

---

# Professional Summary

```
SecurityFilterChain configuration order:

1. csrf().disable()            → REST API, no CSRF needed
2. cors()                      → Allow frontend domain
3. authorizeHttpRequests():
   .permitAll()                → Public
   .authenticated()            → Any logged-in user
   .hasRole("ADMIN")           → Specific role
4. sessionManagement(STATELESS) → JWT, no sessions
5. authenticationProvider()    → DaoAuth + BCrypt
6. addFilterBefore(jwtFilter)  → JWT validation
7. exceptionHandling()         → 401/403 JSON responses
```

---

# 🧠 Memory Trick

SecurityFilterChain = **Hotel Security Protocol**

```
🏨 Hotel Security

Reception (Auth Entry): "Show ID or get 401"
Concierge (Access Denied): "Wrong floor, get 403"
Elevator (Filter Chain): Process each floor's rules
Room Keys (JWT): Your access token per room

Rules book (filterChain):
  /lobby/** → anyone
  /room/**  → guests only
  /vip/**   → VIP guests only
  /staff/** → employees only
```

---

# 🚀 Next Chapter

We'll master **UserDetailsService & UserDetails** — the core interfaces Spring Security uses to load and represent users.
