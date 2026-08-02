Welcome to **Chapter 31 — JWT Authentication with Spring Security**.

> **JWT is the industry standard for stateless authentication in REST APIs. Every modern backend system uses it.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine going to an amusement park.

You buy a ticket at the entrance.

```
Ticket = JWT Token

Ticket contains:
  Your name
  Rides you're allowed on
  Expiry time
```

Every time you go to a ride:

```
Ride staff scans ticket
✅ Valid? → Enter
❌ Expired? → Buy new ticket
```

The ticket is self-contained.

No need to check the database at every ride.

**JWT = Self-contained ticket.**

---

# What is JWT?

**JSON Web Token** = A compact, URL-safe token with encoded data.

Structure: `header.payload.signature`

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJzdWIiOiJzYWNoaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

# JWT Structure

## Header

```json
{
    "alg": "HS256",
    "typ": "JWT"
}
```

---

## Payload (Claims)

```json
{
    "sub": "sachin@example.com",
    "name": "Sachin Tyagi",
    "role": "USER",
    "iat": 1700000000,
    "exp": 1700086400
}
```

Standard claims:
- `sub` — subject (user identifier)
- `iat` — issued at (timestamp)
- `exp` — expiration time
- `iss` — issuer

---

## Signature

```
HMACSHA256(
    base64(header) + "." + base64(payload),
    secretKey
)
```

---

# Dependency

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

---

# Properties

```properties
app.jwt.secret=myVeryLongAndSecureSecretKeyThatIsAtLeast256BitsLong123456789
app.jwt.expiration=86400000
```

---

# JwtService

```java
@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secretKey;

    @Value("${app.jwt.expiration}")
    private long expiration;

    // Generate token
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
            .claims(extraClaims)
            .subject(userDetails.getUsername())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact();
    }

    // Extract username from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Validate token
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

---

# JWT Authentication Filter

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // Check for Bearer token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7); // Remove "Bearer "

        try {
            final String userEmail = jwtService.extractUsername(jwt);

            // If username found and no existing auth
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                        );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (JwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
```

---

# Security Config with JWT

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

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
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
        throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

# Complete Flow

```
1. POST /api/auth/login { email, password }
   → AuthService.login()
   → authManager.authenticate() → validates with UserDetailsService + BCrypt
   → JwtService.generateToken(user)
   → Response: { "token": "eyJ..." }

2. GET /api/profile (with token)
   → Authorization: Bearer eyJ...
   → JwtAuthenticationFilter
   → jwtService.extractUsername("eyJ...")
   → userDetailsService.loadUserByUsername(email)
   → jwtService.isTokenValid()
   → Set SecurityContext
   → Controller runs
   → Response: user profile data
```

---

# Refresh Token (Production Pattern)

```java
@Entity
@Table(name = "refresh_tokens")
@Data
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String token;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime expiresAt;
}

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository repository;

    public RefreshToken createRefreshToken(User user) {
        RefreshToken token = new RefreshToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiresAt(LocalDateTime.now().plusDays(30));
        return repository.save(token);
    }

    public RefreshToken verify(String token) {
        return repository.findByToken(token)
            .filter(t -> t.getExpiresAt().isAfter(LocalDateTime.now()))
            .orElseThrow(() -> new UnauthorizedException("Invalid or expired refresh token"));
    }
}
```

---

# Company Example — Swiggy

```
POST /api/auth/login
  → Returns accessToken (15 min) + refreshToken (30 days)

GET /api/orders (with accessToken)
  → JWT filter validates token → loads user → controller runs

POST /api/auth/refresh (when accessToken expires)
  Body: { refreshToken }
  → Validates refreshToken in DB
  → Issues new accessToken

POST /api/auth/logout
  → Delete refreshToken from DB
  → Client discards accessToken
```

---

# Interview Questions

## Q1. What is JWT?

**Best Answer**

> JWT (JSON Web Token) is a compact, self-contained token for securely transmitting information between parties. It has three Base64-encoded parts: header (algorithm), payload (claims like user email and roles), and signature (HMAC for integrity verification).

---

## Q2. Why is JWT stateless?

The server doesn't need to store the token. All user information is in the payload. The server only verifies the signature to trust the token — no database lookup needed per request.

---

## Q3. What is the difference between access token and refresh token?

The access token is short-lived (15-60 minutes) and sent with every API request. The refresh token is long-lived (days/weeks) and used only to obtain new access tokens when they expire.

---

## Q4. How do you invalidate a JWT token?

JWTs are stateless and can't be invalidated server-side. Common patterns: short expiry times, maintain a blacklist in Redis, use refresh token rotation (invalidate old refresh tokens on use).

---

## Q5. Where should the JWT secret key be stored?

Never in code. Use environment variables, application properties (excluded from version control), or a secrets manager (AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager).

---

# Professional Summary

```
JWT = header.payload.signature

Flow:
  Login → validate credentials → generate JWT → return
  Request → Extract JWT → validate → load user → controller

JwtService:
  generateToken(user)
  extractUsername(token)
  isTokenValid(token, user)

Filter:
  JwtAuthenticationFilter extends OncePerRequestFilter
  → Before UsernamePasswordAuthenticationFilter
  → Sets SecurityContext on valid token

Security Config:
  .sessionManagement(STATELESS)
  .addFilterBefore(jwtFilter, ...)
```

---

# 🧠 Memory Trick

```
JWT = Concert Ticket

Header  = Type of ticket (VIP/General)
Payload = What you can access (stage, backstage)
Signature = Hologram (anti-counterfeit)

Short-lived: Access token = 1-day pass
Long-lived: Refresh token = Season pass
```

---

# 🚀 Next Chapter

We'll configure **SecurityFilterChain** in depth — the complete security configuration with all options.
