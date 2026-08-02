Welcome to **Chapter 27 — @Transactional**.

> **@Transactional is your guarantee that all or nothing happens. In banking, payment, and any critical data operation — this is non-negotiable.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

You transfer ₹1000 from your account to your friend's.

Two steps:
1. Debit your account: ₹1000 removed
2. Credit friend's account: ₹1000 added

What if step 1 succeeds but step 2 fails?

```
Your account: -1000
Friend's account: +0
₹1000 vanished!
```

This is a disaster.

**Transaction**: Both steps must succeed. If either fails, undo everything.

```
If all steps succeed → COMMIT (save everything)
If any step fails   → ROLLBACK (undo everything)
```

`@Transactional` = the bank's guarantee.

---

# What is a Transaction?

A transaction is a group of database operations treated as a single unit.

**ACID Properties:**

```
A - Atomicity   → All or nothing
C - Consistency → Data remains valid
I - Isolation   → Transactions don't interfere with each other
D - Durability  → Committed data persists even after crash
```

---

# @Transactional Basics

```java
@Service
public class PaymentService {

    @Transactional
    public void transfer(Long fromId, Long toId, double amount) {
        User from = userRepository.findById(fromId).orElseThrow();
        User to = userRepository.findById(toId).orElseThrow();

        from.setBalance(from.getBalance() - amount);
        to.setBalance(to.getBalance() + amount);

        userRepository.save(from);
        userRepository.save(to);
        // If any line throws → ROLLBACK
    }
}
```

If `save(to)` throws an exception, Spring automatically rolls back `save(from)`.

---

# @Transactional on Class

```java
@Service
@Transactional  // All public methods are transactional
public class UserService {

    public User create(CreateUserRequest request) { ... }

    public User update(Long id, UpdateUserRequest request) { ... }

    @Transactional(readOnly = true)  // Override for read operations
    public User findById(Long id) { ... }
}
```

---

# readOnly = true

For methods that only read data:

```java
@Transactional(readOnly = true)
public List<User> getAllUsers() {
    return userRepository.findAll();
    // Hibernate skips dirty checking → faster!
}
```

Benefits:
- Better performance (no dirty checking)
- Prevents accidental writes
- Can be routed to read replicas

---

# Propagation

Controls how transactions nest.

```java
@Transactional(propagation = Propagation.REQUIRED)
```

| Propagation | Behavior |
| --- | --- |
| `REQUIRED` | Use existing TX, or create new (default) |
| `REQUIRES_NEW` | Always create a new TX, suspend existing |
| `SUPPORTS` | Use existing TX if present, otherwise no TX |
| `NOT_SUPPORTED` | Suspend existing TX, run without TX |
| `MANDATORY` | Must have existing TX, throw if none |
| `NEVER` | Must NOT have TX, throw if one exists |
| `NESTED` | Run as nested TX (savepoint) |

---

## REQUIRED (Default)

```java
@Transactional
public void methodA() {
    methodB(); // runs in same transaction as A
}

@Transactional(propagation = Propagation.REQUIRED)
public void methodB() {
    // If A started TX → use it
    // If no TX → create new
}
```

---

## REQUIRES_NEW

```java
@Transactional
public void placeOrder(Order order) {
    orderRepository.save(order);
    auditService.log("ORDER_PLACED"); // Runs in its OWN transaction
    // If order fails → log is STILL saved (separate TX)
}

@Transactional(propagation = Propagation.REQUIRES_NEW)
public void log(String event) {
    // New transaction, committed independently
}
```

---

# Isolation Levels

Controls how transactions are isolated from each other.

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
| --- | --- | --- | --- |
| `READ_UNCOMMITTED` | Possible | Possible | Possible |
| `READ_COMMITTED` | Prevented | Possible | Possible |
| `REPEATABLE_READ` | Prevented | Prevented | Possible |
| `SERIALIZABLE` | Prevented | Prevented | Prevented |

```java
@Transactional(isolation = Isolation.READ_COMMITTED)
public void process() { ... }
```

Default is usually `READ_COMMITTED` (MySQL, PostgreSQL).

---

# Rollback Rules

By default, `@Transactional` rolls back on unchecked exceptions (RuntimeException).

```java
// Rollback on specific exceptions
@Transactional(rollbackFor = {Exception.class, IOException.class})
public void process() throws IOException { ... }

// Don't rollback on specific exceptions
@Transactional(noRollbackFor = BusinessException.class)
public void process() { ... }
```

---

# @Transactional Self-Invocation Problem

```java
@Service
public class OrderService {

    @Transactional
    public void placeOrder(Order order) {
        saveOrder(order);        // This calls self
        sendNotification(order);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveOrder(Order order) {
        // ❌ This @Transactional is IGNORED!
        // Self-invocation bypasses Spring proxy
    }
}
```

**Fix**: Move to a different class, or inject self:

```java
@Service
public class OrderService {

    @Autowired
    private OrderService self; // Inject self-proxy

    public void placeOrder(Order order) {
        self.saveOrder(order); // Now goes through proxy
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveOrder(Order order) { }
}
```

---

# Company Example — HDFC Bank

```java
@Service
@RequiredArgsConstructor
public class BankTransferService {

    private final AccountRepository accountRepository;
    private final TransactionLogRepository logRepository;
    private final AuditService auditService;

    @Transactional(
        isolation = Isolation.REPEATABLE_READ,
        rollbackFor = Exception.class
    )
    public TransferResult transfer(TransferRequest request) {

        // Lock rows to prevent concurrent modification
        Account from = accountRepository.findByIdWithLock(request.getFromAccountId());
        Account to = accountRepository.findByIdWithLock(request.getToAccountId());

        // Validate
        if (from.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }

        // Debit
        from.setBalance(from.getBalance().subtract(request.getAmount()));
        accountRepository.save(from);

        // Credit
        to.setBalance(to.getBalance().add(request.getAmount()));
        accountRepository.save(to);

        // Log transaction (same TX)
        TransactionLog log = new TransactionLog(from, to, request.getAmount());
        logRepository.save(log);

        // Audit (separate TX — always saved even if main TX fails)
        auditService.logTransfer(log.getId(), "TRANSFER_INITIATED");

        return new TransferResult("SUCCESS", log.getId());
    }
}

@Service
public class AuditService {

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logTransfer(Long logId, String event) {
        // Always committed independently
        auditRepository.save(new AuditEntry(logId, event, LocalDateTime.now()));
    }
}
```

---

# Interview Questions

## Q1. What is @Transactional?

**Best Answer**

> `@Transactional` marks a method or class so that Spring wraps the execution in a database transaction. If all operations succeed, the transaction commits. If any unchecked exception is thrown, the transaction rolls back automatically, ensuring ACID compliance.

---

## Q2. What ACID properties does @Transactional guarantee?

- **Atomicity**: All operations succeed or all are rolled back.
- **Consistency**: Database remains in a valid state.
- **Isolation**: Configurable via `isolation` attribute.
- **Durability**: Committed transactions survive crashes.

---

## Q3. What is the difference between Propagation.REQUIRED and REQUIRES_NEW?

`REQUIRED` (default) joins an existing transaction or creates one. `REQUIRES_NEW` always creates a new transaction, suspending any existing one. Use `REQUIRES_NEW` for operations that must be committed independently (like audit logging).

---

## Q4. Why use readOnly = true?

It optimizes read-only operations by skipping Hibernate's dirty checking, reducing memory usage, and allowing the query to be routed to read replicas in a multi-database setup.

---

## Q5. What is the self-invocation problem?

When a `@Transactional` method calls another `@Transactional` method in the same class, the second method's transaction settings are ignored because Spring's proxy is bypassed. Fix by injecting the bean from the context or moving the method to another bean.

---

# Professional Summary

```
@Transactional

Basic:
  @Transactional         → REQUIRED, rollback on RuntimeException

Read-only:
  @Transactional(readOnly = true)  → faster, no dirty checking

Propagation:
  REQUIRED       → default, join or create
  REQUIRES_NEW   → always new TX
  SUPPORTS       → use if exists, else none
  MANDATORY      → must exist

Isolation:
  READ_COMMITTED  → default (MySQL)
  REPEATABLE_READ → stronger, prevents non-repeatable reads
  SERIALIZABLE    → strongest, no concurrency issues

Rollback:
  rollbackFor = Exception.class   → rollback on checked too
  noRollbackFor = BusinessEx.class
```

---

# 🧠 Memory Trick

```
@Transactional = Bank Transaction

All steps:
  ✅ Step 1 succeeds
  ✅ Step 2 succeeds
  ✅ Step 3 succeeds
  → COMMIT (all saved)

If any fails:
  ✅ Step 1 ok
  ❌ Step 2 fails!
  → ROLLBACK (Step 1 undone too)

ALL or NOTHING. Always.
```

---

# 🚀 Next Chapter

We'll learn **Pagination & Sorting** — how to efficiently retrieve large datasets in manageable chunks with Spring Data JPA.
