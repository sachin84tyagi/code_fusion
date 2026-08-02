Welcome to **Chapter 35 — Role-Based Access Control (RBAC)**.

> **RBAC is how you control who can do what in your application. Without it, all authenticated users have equal access — which is a security disaster.**

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

```
Principal   → Can do everything
Teacher     → Can grade students, access class records
Student     → Can view own grades only
Visitor     → Can see school notice board only
```

Same school. Different people. Different access.

That's **Role-Based Access Control**.

---

# RBAC Concepts

```
User → has → Roles → have → Permissions

User: Sachin
  Role: MANAGER
    Permission: user:read
    Permission: product:read
    Permission: product:write

User: Admin
  Role: ADMIN
    Permission: user:read, user:write, user:delete
    Permission: product:* (all)
```

---

# Role Enum (Simple Approach)

```java
public enum Role {
    USER,
    MANAGER,
    ADMIN
}
```

User entity:

```java
@Enumerated(EnumType.STRING)
@Column(nullable = false)
private Role role = Role.USER;
```

---

# Permission Enum

```java
public enum Permission {
    USER_READ("user:read"),
    USER_WRITE("user:write"),
    USER_DELETE("user:delete"),
    PRODUCT_READ("product:read"),
    PRODUCT_WRITE("product:write"),
    PRODUCT_DELETE("product:delete"),
    ORDER_READ("order:read"),
    ORDER_WRITE("order:write"),
    ADMIN_ALL("admin:*");

    private final String permission;

    Permission(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }
}
```

---

# Role to Permissions Mapping

```java
public enum Role {

    USER(Set.of(
        Permission.USER_READ,
        Permission.PRODUCT_READ,
        Permission.ORDER_READ,
        Permission.ORDER_WRITE
    )),

    MANAGER(Set.of(
        Permission.USER_READ,
        Permission.PRODUCT_READ,
        Permission.PRODUCT_WRITE,
        Permission.ORDER_READ,
        Permission.ORDER_WRITE
    )),

    ADMIN(Set.of(
        Permission.USER_READ, Permission.USER_WRITE, Permission.USER_DELETE,
        Permission.PRODUCT_READ, Permission.PRODUCT_WRITE, Permission.PRODUCT_DELETE,
        Permission.ORDER_READ, Permission.ORDER_WRITE,
        Permission.ADMIN_ALL
    ));

    private final Set<Permission> permissions;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }
}
```

---

# Building Authorities from Roles

```java
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    // Add role
    List<GrantedAuthority> authorities = new ArrayList<>();
    authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));

    // Add permissions from role
    role.getPermissions().forEach(p ->
        authorities.add(new SimpleGrantedAuthority(p.getPermission()))
    );

    return authorities;
}
```

For a USER:

```
ROLE_USER
user:read
product:read
order:read
order:write
```

---

# URL-Level Role Control

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()

    // User access
    .requestMatchers(HttpMethod.GET, "/api/products/**").hasRole("USER")

    // Manager access
    .requestMatchers(HttpMethod.POST, "/api/products").hasAnyRole("MANAGER", "ADMIN")
    .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAnyRole("MANAGER", "ADMIN")

    // Admin only
    .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
    .requestMatchers("/api/admin/**").hasRole("ADMIN")

    .anyRequest().authenticated()
)
```

---

# Method-Level Permission Control

```java
@EnableMethodSecurity
@Configuration
public class SecurityConfig { }
```

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    @PreAuthorize("hasAuthority('user:read')")
    public List<UserResponse> getAllUsers() { ... }

    @PostMapping
    @PreAuthorize("hasAuthority('user:write')")
    public UserResponse createUser(@RequestBody @Valid CreateUserRequest request) { ... }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('user:delete') or hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) { ... }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public UserResponse getMyProfile(@AuthenticationPrincipal User user) { ... }

    // Owner check
    @GetMapping("/{id}/orders")
    @PreAuthorize("hasRole('ADMIN') or authentication.name == @userService.getEmail(#id)")
    public List<OrderResponse> getUserOrders(@PathVariable Long id) { ... }
}
```

---

# @PostAuthorize (After Execution Check)

Check authorization after method runs:

```java
@GetMapping("/posts/{id}")
@PostAuthorize("returnObject.author == authentication.name or hasRole('ADMIN')")
public Post getPost(@PathVariable Long id) {
    return postService.findById(id); // Returns post, then checks author
}
```

---

# Admin Service

```java
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public void promoteToManager(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setRole(Role.MANAGER);
        userRepository.save(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setActive(false);
        userRepository.save(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsersWithRoles() {
        return userRepository.findAll();
    }
}
```

---

# Company Example — Slack

Slack workspace roles:

```java
public enum SlackRole {
    MEMBER(Set.of(
        Permission.MESSAGE_READ, Permission.MESSAGE_WRITE,
        Permission.CHANNEL_READ
    )),

    ADMIN(Set.of(
        Permission.MESSAGE_READ, Permission.MESSAGE_WRITE, Permission.MESSAGE_DELETE,
        Permission.CHANNEL_READ, Permission.CHANNEL_WRITE, Permission.CHANNEL_DELETE,
        Permission.MEMBER_READ, Permission.MEMBER_INVITE
    )),

    OWNER(Set.of(
        Permission.values() // All permissions
    ));
}

@RestController
@RequestMapping("/api/v1/workspace")
public class WorkspaceController {

    // All members can read channels
    @GetMapping("/channels")
    @PreAuthorize("hasAuthority('channel:read')")
    public List<ChannelDto> getChannels() { ... }

    // Only admins/owners can create channels
    @PostMapping("/channels")
    @PreAuthorize("hasAuthority('channel:write')")
    public ChannelDto createChannel(@RequestBody CreateChannelRequest request) { ... }

    // Only owners can delete workspace
    @DeleteMapping
    @PreAuthorize("hasRole('OWNER')")
    public void deleteWorkspace() { ... }

    // Admin can delete any message, members only their own
    @DeleteMapping("/messages/{messageId}")
    @PreAuthorize("hasAuthority('message:delete') or @messageService.isAuthor(#messageId, authentication.name)")
    public void deleteMessage(@PathVariable Long messageId) { ... }
}
```

---

# Interview Questions

## Q1. What is Role-Based Access Control?

**Best Answer**

> RBAC is a security model where users are assigned roles, and roles define what permissions (actions) users can perform. Instead of assigning permissions directly to users, you manage roles, and users inherit all permissions of their assigned role(s).

---

## Q2. What is the difference between `hasRole()` and `hasAuthority()`?

`hasRole("ADMIN")` matches the authority `"ROLE_ADMIN"` (auto-prefixed). `hasAuthority("user:read")` matches the exact string. Use `hasRole` for broad role checks, `hasAuthority` for fine-grained permission checks.

---

## Q3. What is `@EnableMethodSecurity`?

Enables method-level security annotations like `@PreAuthorize`, `@PostAuthorize`, `@Secured`. Without it, these annotations are ignored.

---

## Q4. What is the difference between @PreAuthorize and @PostAuthorize?

`@PreAuthorize` evaluates before method execution and can prevent it from running. `@PostAuthorize` evaluates after execution, using the return value in the expression (e.g., to check if the returned object belongs to the current user).

---

## Q5. How do you implement ownership check in Spring Security?

Use Spring Expression Language in `@PreAuthorize`:
```java
@PreAuthorize("authentication.name == @userService.getEmail(#id) or hasRole('ADMIN')")
```
This calls a service method to get the resource owner's email and compares with the authenticated user's name.

---

# Professional Summary

```
RBAC Implementation:

1. Define roles: USER, MANAGER, ADMIN
2. Define permissions: user:read, user:write, ...
3. Map roles → permissions
4. Entity implements UserDetails:
   getAuthorities() returns ROLE_X + permissions
5. Security config:
   URL level: hasRole(), hasAnyRole()
   Method level: @PreAuthorize, @PostAuthorize
6. Enable: @EnableMethodSecurity on config class
```

---

# 🧠 Memory Trick

RBAC = **Military Rank System**

```
Private     (USER)    → Can carry rifle
Sergeant    (MANAGER) → Can command a squad
Colonel     (ADMIN)   → Can command a battalion

Rank determines what you can access.
Higher rank = more permissions.
You can't grant permissions above your own rank.
```

---

# 🚀 Next Chapter

We enter **Advanced Spring** — starting with **Spring Boot Actuator**, the monitoring and health check system built into Spring Boot.
