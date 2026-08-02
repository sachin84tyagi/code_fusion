Welcome to **Chapter 30 — Authentication & Authorization**.

> **Authentication proves who you are. Authorization decides what you can do. Together they are the backbone of every secure application.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Authentication = Showing your ID at the gate

```
Guard: "Who are you?"
You: "I'm Sachin, ID: 12345"
Guard: "ID verified. Welcome."
```

Authorization = What you can access inside

```
You: "I want to enter the CEO's office."
Guard: "Sorry, you're only an intern. Access denied."
You: "I want to use the cafeteria."
Guard: "Sure, all employees can."
```

---

# Full Authentication Flow

```
Client: POST /api/auth/login
  Body: { email, password }

↓

AuthController receives request

↓

AuthService:
  1. Find user by email
  2. Verify password with BCrypt
  3. Generate JWT token

↓

Response: { token, user info }

↓

Client stores token (localStorage / cookie)
Client sends token in Authorization header for future requests
```

---

# User Entity with Roles

```java
@Entity
@Table(name = "users")
@Data
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    private boolean active = true;

    // UserDetails methods
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() { return email; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return active; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return active; }
}

enum Role {
    USER, ADMIN, MANAGER
}
```

---

# UserDetailsService

Spring Security calls this to load user from DB:

```java
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
```

---

# Auth DTOs

```java
// Login request
@Data
public class LoginRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}

// Register request
@Data
public class RegisterRequest {
    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @Size(min = 8)
    private String password;
}

// Auth response
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private String email;
    private String name;
    private String role;
}
```

---

# Auth Service

```java
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, "Bearer", user.getEmail(), user.getName(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        // This validates credentials and throws if invalid
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.generateToken(user);

        return new AuthResponse(token, "Bearer", user.getEmail(), user.getName(), user.getRole().name());
    }
}
```

---

# Auth Controller

```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.status(201).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
```

---

# Role-Based Access Control

```java
// Method-level security (enable in config)
@EnableMethodSecurity
@Configuration
public class SecurityConfig { }

// Controller methods
@GetMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public List<User> getAllUsers() { ... }

@DeleteMapping("/admin/users/{id}")
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(@PathVariable Long id) { ... }

@GetMapping("/profile")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public UserResponse getProfile(@AuthenticationPrincipal UserDetails user) { ... }

// Check ownership
@PutMapping("/posts/{id}")
@PreAuthorize("hasRole('ADMIN') or @postService.isOwner(#id, authentication.name)")
public Post updatePost(@PathVariable Long id, @RequestBody Post post) { ... }
```

---

# @PreAuthorize Expressions

```java
@PreAuthorize("hasRole('ADMIN')")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
@PreAuthorize("hasAuthority('PERMISSION_READ')")
@PreAuthorize("isAuthenticated()")
@PreAuthorize("permitAll()")
@PreAuthorize("authentication.name == #username")  // Own resource
@PreAuthorize("@securityService.canEdit(#id, authentication)")  // Custom logic
```

---

# Company Example — GitHub

```java
// Anyone can view public repos
@GetMapping("/repos/{owner}/{repo}")
public Repository getRepository(@PathVariable String owner, @PathVariable String repo) {
    return repoService.findPublicRepo(owner, repo);
}

// Must be logged in to create
@PostMapping("/repos")
@PreAuthorize("isAuthenticated()")
public Repository createRepo(@RequestBody CreateRepoRequest request,
                              @AuthenticationPrincipal UserDetails user) {
    return repoService.create(user.getUsername(), request);
}

// Only owner or admin can delete
@DeleteMapping("/repos/{owner}/{repo}")
@PreAuthorize("authentication.name == #owner or hasRole('ADMIN')")
public void deleteRepo(@PathVariable String owner, @PathVariable String repo) {
    repoService.delete(owner, repo);
}

// Org admins only
@PostMapping("/orgs/{org}/members")
@PreAuthorize("@orgSecurityService.isAdmin(#org, authentication.name)")
public void addMember(@PathVariable String org, @RequestBody AddMemberRequest request) {
    orgService.addMember(org, request);
}
```

---

# Interview Questions

## Q1. What is the difference between Authentication and Authorization in Spring Security?

**Best Answer**

> Authentication verifies the user's identity (validates credentials via `AuthenticationManager`). Authorization checks if the authenticated user has permission to access a resource (via `SecurityFilterChain` URL matchers or `@PreAuthorize` on methods).

---

## Q2. What is UserDetailsService?

A core Spring Security interface with one method: `loadUserByUsername(String username)`. Spring calls it during authentication to load the user from the database for credential verification.

---

## Q3. What is AuthenticationManager?

The central interface for authentication. Its `authenticate()` method validates the credentials. `DaoAuthenticationManager` uses `UserDetailsService` + `PasswordEncoder` to verify username/password.

---

## Q4. What is @PreAuthorize?

A method-level security annotation that uses Spring Expression Language (SpEL) to control access. Requires `@EnableMethodSecurity` on the config class. Evaluated before the method executes.

---

## Q5. What is @AuthenticationPrincipal?

An annotation that injects the currently authenticated user's `UserDetails` object directly into a controller method parameter, avoiding `SecurityContextHolder.getContext().getAuthentication()`.

---

# Professional Summary

```
Authentication Flow:
  POST /api/auth/login
  → AuthenticationManager.authenticate()
  → UserDetailsService.loadUserByUsername()
  → PasswordEncoder.matches()
  → Generate JWT
  → Return token

Authorization:
  URL level:
    .requestMatchers("/admin/**").hasRole("ADMIN")
  Method level:
    @PreAuthorize("hasRole('ADMIN')")
    @PreAuthorize("authentication.name == #username")

Get current user:
  @AuthenticationPrincipal UserDetails user
  SecurityContextHolder.getContext().getAuthentication()
```

---

# 🧠 Memory Trick

```
Authentication = Getting into the country
  Passport check → credentials verified → entry granted
  Token = Visa stamp

Authorization = What you can do inside
  Tourist visa    → ROLE_USER  → visit only
  Work visa       → ROLE_EMPLOYEE → can work
  Diplomat visa   → ROLE_ADMIN → full access
```

---

# 🚀 Next Chapter

We'll implement **JWT Authentication** — the industry-standard stateless token-based authentication for REST APIs.
