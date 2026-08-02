Welcome to **Chapter 33 — UserDetailsService & UserDetails**.

> **UserDetailsService is how Spring Security loads your users. UserDetails is what Spring Security knows about each user.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a company's security system.

When an employee uses their badge:

```
Badge scanned → System looks up employee ID
System fetches: Name, Department, Clearance Level
Grant or deny access based on clearance
```

**UserDetailsService** = The employee lookup system

**UserDetails** = The employee's security profile

---

# UserDetails Interface

Represents the authenticated user.

```java
public interface UserDetails extends Serializable {
    Collection<? extends GrantedAuthority> getAuthorities();  // Roles/permissions
    String getPassword();                                       // Encoded password
    String getUsername();                                       // Username (email)
    boolean isAccountNonExpired();                             // Account expired?
    boolean isAccountNonLocked();                              // Account locked?
    boolean isCredentialsNonExpired();                         // Password expired?
    boolean isEnabled();                                        // Account active?
}
```

---

# Implementing UserDetails on Entity

```java
@Entity
@Table(name = "users")
@Data
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    private boolean active = true;
    private boolean locked = false;
    private boolean credentialsExpired = false;

    // UserDetails Implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email; // Spring uses email as username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !credentialsExpired;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
```

---

# UserDetailsService Interface

Spring Security calls this to load user during authentication.

```java
public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

---

# Implementing UserDetailsService

```java
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException(
                "User not found with email: " + email
            ));
    }
}
```

---

# Multiple Roles / Permissions

```java
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();

        roles.forEach(role -> {
            // Add role
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));

            // Add permissions of that role
            role.getPermissions().forEach(permission ->
                authorities.add(new SimpleGrantedAuthority(permission.getName()))
            );
        });

        return authorities;
    }
}
```

---

# Role and Permission Entities

```java
@Entity
@Table(name = "roles")
@Data
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // ADMIN, USER, MANAGER

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions;
}

@Entity
@Table(name = "permissions")
@Data
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // user:read, user:write, product:delete

    private String description;
}
```

---

# Using Permissions in Security

```java
// Check permission (not just role)
@GetMapping("/users")
@PreAuthorize("hasAuthority('user:read')")
public List<User> getAllUsers() { ... }

@PostMapping("/users")
@PreAuthorize("hasAuthority('user:write')")
public User createUser(@RequestBody User user) { ... }

@DeleteMapping("/users/{id}")
@PreAuthorize("hasAuthority('user:delete')")
public void deleteUser(@PathVariable Long id) { ... }
```

---

# Custom UserDetails (Without Entity Implementation)

Separate UserDetails from the entity:

```java
@Data
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private Long id;
    private String email;
    private String password;
    private String name;
    private Collection<? extends GrantedAuthority> authorities;
    private boolean active;

    public static CustomUserDetails from(User user) {
        List<GrantedAuthority> authorities = List.of(
            new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
        return new CustomUserDetails(
            user.getId(), user.getEmail(), user.getPassword(),
            user.getName(), authorities, user.isActive()
        );
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

// Service uses it
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException(email));
        return CustomUserDetails.from(user); // Convert to custom UserDetails
    }
}
```

---

# Getting Current User in Controller

```java
// Option 1: @AuthenticationPrincipal
@GetMapping("/profile")
public ResponseEntity<UserResponse> getProfile(
    @AuthenticationPrincipal User currentUser  // Injected directly if UserDetails = User entity
) {
    return ResponseEntity.ok(toResponse(currentUser));
}

// Option 2: via SecurityContextHolder
@GetMapping("/profile")
public ResponseEntity<UserResponse> getProfile() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String email = auth.getName();
    User user = userRepository.findByEmail(email).orElseThrow();
    return ResponseEntity.ok(toResponse(user));
}

// Option 3: Custom annotation (via a utility)
@GetMapping("/profile")
public ResponseEntity<UserResponse> getProfile() {
    User user = SecurityUtils.getCurrentUser();
    return ResponseEntity.ok(toResponse(user));
}
```

---

# Company Example — Atlassian

Atlassian (Jira/Confluence) has complex permissions:

```java
@Service
public class AtlassianUserDetailsService implements UserDetailsService {

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String accountId) {
        AtlassianUser user = userRepository.findByAccountId(accountId)
            .orElseThrow(() -> new UsernameNotFoundException(accountId));

        // Build all authorities: global roles + project-specific permissions
        Set<GrantedAuthority> authorities = new HashSet<>();

        // Global role
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getGlobalRole()));

        // Product permissions
        user.getProductAccess().forEach(access -> {
            authorities.add(new SimpleGrantedAuthority(access.getProduct() + ":ACCESS"));
            access.getPermissions().forEach(p ->
                authorities.add(new SimpleGrantedAuthority(access.getProduct() + ":" + p))
            );
        });

        // Site admin
        if (user.isSiteAdmin()) {
            authorities.add(new SimpleGrantedAuthority("SITE_ADMIN"));
        }

        return new AtlassianUserDetails(user, authorities);
    }
}
```

---

# Interview Questions

## Q1. What is UserDetailsService?

**Best Answer**

> `UserDetailsService` is a Spring Security interface with one method: `loadUserByUsername(String username)`. Spring calls it during authentication to retrieve user details from the database. You implement it to load your user entity.

---

## Q2. What is UserDetails?

An interface representing the authenticated user that Spring Security works with. It provides the username (usually email), encoded password, authorities (roles/permissions), and account status flags.

---

## Q3. What is `getAuthorities()`?

Returns a collection of `GrantedAuthority` objects representing the user's roles and permissions. Spring Security checks these against `hasRole()`/`hasAuthority()` rules.

---

## Q4. What is `SimpleGrantedAuthority`?

A simple `GrantedAuthority` implementation that holds a string authority name. `hasRole("ADMIN")` checks for `"ROLE_ADMIN"`, while `hasAuthority("user:read")` checks the exact string.

---

## Q5. What is the difference between `hasRole()` and `hasAuthority()`?

`hasRole("ADMIN")` automatically prepends `"ROLE_"` and looks for `"ROLE_ADMIN"`. `hasAuthority("user:read")` checks the exact string without any prefix. Use `hasRole` for role-based checks, `hasAuthority` for fine-grained permissions.

---

# Professional Summary

```
UserDetailsService:
  loadUserByUsername(email)
  → finds user in DB
  → returns UserDetails

UserDetails:
  getUsername()       → email
  getPassword()       → BCrypt hash
  getAuthorities()    → [ROLE_USER, user:read, ...]
  isEnabled()         → active check
  isAccountNonLocked() → not blocked
  isAccountNonExpired()
  isCredentialsNonExpired()

Access current user:
  @AuthenticationPrincipal UserDetails user
  SecurityContextHolder.getContext().getAuthentication()
```

---

# 🧠 Memory Trick

```
UserDetailsService = HR Database

"Who is user@email.com?"
→ HR Database (UserDetailsService.loadUserByUsername)
→ Returns employee file (UserDetails)

Employee file (UserDetails):
  Name (username)
  ID (password-equivalent)
  Clearance level (authorities/roles)
  Employment status (isEnabled, isLocked)
```

---

# 🚀 Next Chapter

We'll cover **BCrypt Password Encoding** — how to securely hash and verify passwords in Spring Boot.
