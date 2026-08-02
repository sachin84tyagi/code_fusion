Welcome to **Chapter 34 — BCrypt Password Encoding**.

> **Never store plain text passwords. BCrypt is the gold standard for password hashing. Every professional application uses it.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a locker with a combination.

Your combination is `1234`.

You can't tell anyone, so you lock it in a safe.

But you store only a **scrambled version**: `$2a$X#@K9...`

When someone tries to open:
```
They enter 1234
System scrambles 1234 in the same way
Compares with stored scramble
✅ Match? → Open
❌ No match? → Denied
```

The scrambled version is called a **hash**.

BCrypt creates this unbreakable scramble.

---

# Why Not Store Plain Passwords?

```
Database breach:
  Plain text: "password123" → Hackers have your password!
  BCrypt hash: "$2a$10$N9q..." → Hackers get nothing useful
```

BCrypt is a **one-way** function.

You cannot reverse a BCrypt hash to get the original password.

---

# BCryptPasswordEncoder

```java
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10); // strength = 10 (recommended)
    }
}
```

**Strength (cost factor):**

| Strength | Hash Time | Security |
| --- | --- | --- |
| 4 | 1ms | Weak |
| 10 | 100ms | ✅ Recommended |
| 12 | 400ms | Stronger |
| 14 | 1.5s | Very strong |

Higher strength = more secure but slower. 10-12 is standard.

---

# Encoding a Password

```java
@Autowired
private PasswordEncoder passwordEncoder;

// Register user
public User registerUser(RegisterRequest request) {
    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash it!

    return userRepository.save(user);
}
```

Plain: `"myPassword123"`

BCrypt hash: `"$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"`

---

# Verifying a Password

```java
// Login
public AuthResponse login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

    // Verify password
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new UnauthorizedException("Invalid credentials");
    }

    String token = jwtService.generateToken(user);
    return new AuthResponse(token);
}
```

`passwordEncoder.matches("plain", "hash")` → `true` or `false`

---

# BCrypt Automatically Salts

BCrypt automatically generates a unique **salt** for each password.

Same password → Different hash every time:

```
"password123" → $2a$10$abc1...xyz
"password123" → $2a$10$def2...uvw  (different hash!)
"password123" → $2a$10$ghi3...rst  (different again!)
```

This defeats **rainbow table attacks** (precomputed hash tables).

---

# PasswordEncoder Methods

```java
// Hash a password
String hash = passwordEncoder.encode("myPassword");

// Verify password
boolean matches = passwordEncoder.matches("myPassword", hash); // true

// Check if re-encoding needed (strength upgrade)
boolean needsUpgrade = passwordEncoder.upgradeEncoding(hash);
```

---

# Change Password

```java
public void changePassword(Long userId, ChangePasswordRequest request) {
    User user = userRepository.findById(userId).orElseThrow();

    // Verify old password
    if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
        throw new BadRequestException("Current password is incorrect");
    }

    // Encode new password
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
}
```

---

# Reset Password

```java
public void resetPassword(ResetPasswordRequest request) {
    // Verify reset token (from email link)
    PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
        .filter(t -> t.getExpiresAt().isAfter(LocalDateTime.now()))
        .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

    User user = resetToken.getUser();
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);

    // Invalidate the token
    tokenRepository.delete(resetToken);
}
```

---

# DelegatingPasswordEncoder (Multi-Algorithm Support)

For migrating legacy systems with different hash algorithms:

```java
@Bean
public PasswordEncoder passwordEncoder() {
    // Default encoder is BCrypt
    // But can verify MD5, SHA-256, etc. from legacy systems
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
}
```

Password format:

```
{bcrypt}$2a$10$...    → BCrypt
{noop}password123     → Plain text (dev only!)
{sha256}...           → SHA-256 (legacy)
```

---

# Company Example — Razorpay Dashboard

```java
@Service
@RequiredArgsConstructor
public class AccountService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public void register(CreateAccountRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt hash

        // Set strict password requirements
        validatePasswordStrength(request.getPassword());

        userRepository.save(user);
        emailService.sendWelcomeEmail(request.getEmail());
    }

    private void validatePasswordStrength(String password) {
        // Razorpay enforces strong passwords
        if (password.length() < 8) throw new BadRequestException("Minimum 8 characters");
        if (!password.matches(".*[A-Z].*")) throw new BadRequestException("Must have uppercase");
        if (!password.matches(".*[0-9].*")) throw new BadRequestException("Must have a number");
        if (!password.matches(".*[!@#$%^&*].*")) throw new BadRequestException("Must have special char");
    }

    @Transactional
    public void changePassword(String userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId).orElseThrow();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordChangedAt(LocalDateTime.now());
        userRepository.save(user);

        // Invalidate all existing sessions
        sessionService.invalidateAll(userId);
    }
}
```

---

# Interview Questions

## Q1. What is BCrypt?

**Best Answer**

> BCrypt is a password hashing function designed for security. It is slow by design (configurable cost factor), uses a unique salt for each password (preventing rainbow table attacks), and produces a one-way hash that cannot be reversed to the original password.

---

## Q2. What is `passwordEncoder.encode()` vs `passwordEncoder.matches()`?

`encode(rawPassword)` hashes the plain text password using BCrypt. `matches(rawPassword, encodedPassword)` checks if a plain text password matches a stored BCrypt hash. Never store raw passwords.

---

## Q3. Why is BCrypt recommended over MD5 or SHA-256?

MD5 and SHA-256 are fast (millions of hashes/second), making brute force easy. BCrypt is intentionally slow (configurable work factor), making brute force impractical. It also has built-in salting.

---

## Q4. What is a salt in password hashing?

A salt is a random value added to the password before hashing. BCrypt generates a unique salt per password, ensuring the same password produces different hashes, defeating precomputed rainbow table attacks.

---

## Q5. What is the recommended BCrypt strength?

**10** is the industry standard. It produces a hash in about 100ms, which is fast enough for users but slow enough to make brute force attacks take millions of years.

---

# Professional Summary

```
BCryptPasswordEncoder

Encode:
  passwordEncoder.encode("myPass")
  → "$2a$10$...random-hash..."
  → Different hash every time (salted)

Verify:
  passwordEncoder.matches("myPass", "$2a$10$...")
  → true (correct) or false (wrong)

Strength:
  BCryptPasswordEncoder(10)  → recommended
  BCryptPasswordEncoder(12)  → stronger (for high-security apps)

NEVER:
  ❌ store plain text passwords
  ❌ use MD5 or SHA-1 for passwords
  ❌ use the same salt for all passwords
```

---

# 🧠 Memory Trick

```
BCrypt = One-way blender

Input: "password123"  ← goes in

Blender (BCrypt) shreds it completely

Output: "$2a$10$N9q..."  ← comes out

Can you "un-blend" it back?
❌ NO! That's the point.

To verify → blend the input again and compare outputs
```

---

# 🚀 Next Chapter

We'll implement **Role-Based Access Control** — complete permission management with roles and fine-grained permissions.
