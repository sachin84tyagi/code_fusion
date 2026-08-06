Year 2019।

एक Banking App — **SecureBank**।

Black Friday था।

लाखों Transactions हो रहे थे।

एक User ने Payment किया।

```text
Account A: ₹50,000
Account B: ₹0

Transfer: A → B → ₹10,000
```

System ने:

```text
Step 1: Account A से ₹10,000 Debit हुए
        Account A: ₹40,000 ✅
```

फिर...

```text
💥 Server Crash
```

```text
Step 2: Account B में ₹10,000 Credit हुए? → नहीं!
        Account B: ₹0 ❌
```

₹10,000 गायब।

Customer का पैसा गया।

Bank की reputation गई।

---

यहीं से **Transaction Management** समझ में आता है।

---

# Chapter 32 – Spring Transactions

---

# Transaction क्या होती है?

Transaction = **काम का एक Unit जो पूरा होगा या बिल्कुल नहीं होगा।**

---

## ACID Properties

```text
A → Atomicity  : सब होगा या कुछ नहीं
C → Consistency: Data Valid State में रहेगा
I → Isolation  : Parallel Transactions एक-दूसरे को affect नहीं करेंगी
D → Durability : Commit होने के बाद Data Save रहेगा
```

---

## Bank Transfer Without Transaction

```java
public void transfer(Long fromId, Long toId, double amount) {
    Account from = accountRepo.findById(fromId);
    Account to   = accountRepo.findById(toId);

    from.setBalance(from.getBalance() - amount);  // Step 1
    accountRepo.save(from);                        // Step 2

    // 💥 CRASH HERE!

    to.setBalance(to.getBalance() + amount);       // Step 3
    accountRepo.save(to);                          // Step 4
}
```

Step 2 के बाद Crash → ₹10,000 गायब।

---

## Bank Transfer With Transaction

```java
@Transactional
public void transfer(Long fromId, Long toId, double amount) {
    Account from = accountRepo.findById(fromId);
    Account to   = accountRepo.findById(toId);

    from.setBalance(from.getBalance() - amount);
    accountRepo.save(from);

    // 💥 CRASH HERE!
    // Transaction Rollback होगी
    // Account A का पैसा वापस आएगा

    to.setBalance(to.getBalance() + amount);
    accountRepo.save(to);
}
```

Crash → Rollback → Account A: ₹50,000 (पैसा सुरक्षित)।

---

# @Transactional Internal Flow

```text
1. Transfer Method call हुआ
         ↓
2. Proxy ने Intercept किया
         ↓
3. Transaction Begin (TransactionManager)
         ↓
4. Connection Pool से Connection लिया
         ↓
5. Connection पर: autoCommit = false
         ↓
6. Real Transfer Method चला
         ↓
7. अगर Success → COMMIT
   अगर Exception → ROLLBACK
         ↓
8. Connection Pool को Connection वापस
```

---

## @Transactional कहाँ से आता है?

```java
import org.springframework.transaction.annotation.Transactional;
```

Spring का।

या:

```java
import jakarta.transaction.Transactional;
```

JEE का। दोनों Spring Support करता है।

---

# Rollback Rules

Default में `@Transactional` किस Exception पर Rollback करता है?

---

## Default Behavior

```text
RuntimeException → Rollback ✅
Error            → Rollback ✅
CheckedException → NO Rollback ❌
```

---

## Example

```java
@Transactional
public void transfer() throws Exception {
    debitAccount();

    throw new IOException("File Error");  // CheckedException!
    // Transaction COMMIT होगा!!! ❌
}
```

---

## Custom Rollback Rules

```java
// CheckedException पर भी Rollback
@Transactional(rollbackFor = Exception.class)
public void transfer() throws Exception {
    debitAccount();
    throw new IOException("Error");
    // अब Rollback होगा ✅
}

// इस Exception पर Rollback नहीं
@Transactional(noRollbackFor = ValidationException.class)
public void processOrder() {
    // ValidationException आए तो Commit करो
}
```

---

# Propagation – Transaction का Behaviour

यह सबसे Important और Complex Topic है।

---

## Propagation क्या है?

> "जब एक Transactional Method दूसरे Transactional Method को Call करे, तो क्या होगा?"

---

## 7 Propagation Types

---

### 1. REQUIRED (Default) ⭐⭐⭐⭐⭐

```java
@Transactional(propagation = Propagation.REQUIRED)
public void methodA() {
    methodB();  // B भी उसी Transaction में
}

@Transactional(propagation = Propagation.REQUIRED)
public void methodB() {
    // A की Transaction Use करेगा अगर Available हो
    // नहीं तो नई बनाएगा
}
```

```text
A में Transaction है:
  B को A की Transaction मिलेगी।

A में Transaction नहीं:
  B नई Transaction बनाएगा।
```

---

### 2. REQUIRES_NEW ⭐⭐⭐

```java
@Transactional
public void processOrder() {
    saveOrder();    // Order Save
    sendAudit();    // Audit — Separate Transaction!
}

@Transactional(propagation = Propagation.REQUIRES_NEW)
public void sendAudit() {
    // हमेशा नई Transaction
    // processOrder() की Transaction Suspend होगी
    // sendAudit() अपनी Transaction में चलेगा
    // sendAudit() Fail होने पर processOrder() की Transaction alive
}
```

---

**Real Use Case:**

```text
Order Failed → Rollback होगा।
Audit Log → हमेशा Save होना चाहिए (Rollback नहीं)।

इसलिए AuditService पर REQUIRES_NEW।
```

---

### 3. NESTED

```java
@Transactional(propagation = Propagation.NESTED)
public void nestedOperation() {
    // Outer Transaction में Savepoint बनाता है
    // अगर fail हो → Savepoint तक Rollback (Outer alive)
    // अगर Outer fail हो → पूरा Rollback
}
```

---

### 4. SUPPORTS

```java
@Transactional(propagation = Propagation.SUPPORTS)
public void readData() {
    // Transaction है तो उसमें चलो
    // नहीं है तो बिना Transaction चलो
}
```

---

### 5. NOT_SUPPORTED

```java
@Transactional(propagation = Propagation.NOT_SUPPORTED)
public void heavyReadOperation() {
    // Transaction को Suspend करो
    // बिना Transaction चलो
    // (Long Read operations के लिए)
}
```

---

### 6. MANDATORY

```java
@Transactional(propagation = Propagation.MANDATORY)
public void criticalOperation() {
    // Transaction ज़रूरी है
    // अगर नहीं है → Exception!
}
```

---

### 7. NEVER

```java
@Transactional(propagation = Propagation.NEVER)
public void nonTransactionalOp() {
    // Transaction नहीं होनी चाहिए
    // अगर है → Exception!
}
```

---

## Propagation Summary

```text
┌──────────────────────────────────────────────────────────────┐
│ Propagation   │ Existing Tx  │ No Existing Tx               │
├──────────────────────────────────────────────────────────────┤
│ REQUIRED      │ Use Existing │ Create New                   │
│ REQUIRES_NEW  │ Suspend, New │ Create New                   │
│ NESTED        │ Savepoint    │ Create New                   │
│ SUPPORTS      │ Use Existing │ No Transaction               │
│ NOT_SUPPORTED │ Suspend      │ No Transaction               │
│ MANDATORY     │ Use Existing │ Exception!                   │
│ NEVER         │ Exception!   │ No Transaction               │
└──────────────────────────────────────────────────────────────┘
```

---

# Isolation Levels – Concurrent Transactions

एक साथ कई Transactions चल रही हैं।

वे एक-दूसरे को देख सकती हैं?

यह Isolation Level Decide करता है।

---

## Isolation Problems

```text
1. Dirty Read:
   Transaction A ने Data Change किया (Commit नहीं)
   Transaction B ने वह Change देखा
   A ने Rollback किया
   B ने गलत Data Use किया ❌

2. Non-Repeatable Read:
   B ने Row Read किया
   A ने Row Update और Commit किया
   B ने फिर Read किया → Different Data ❌

3. Phantom Read:
   B ने Rows Read किए (5 rows)
   A ने नई Row Insert और Commit की
   B ने फिर Read किया → 6 rows ❌
```

---

## 4 Isolation Levels

---

### READ_UNCOMMITTED (सबसे Loose)

```java
@Transactional(isolation = Isolation.READ_UNCOMMITTED)
public void readData() {
    // Dirty Read हो सकता है
    // Non-Repeatable Read हो सकता है
    // Phantom Read हो सकता है
    // Performance: Best
}
```

---

### READ_COMMITTED (Default for most DBs)

```java
@Transactional(isolation = Isolation.READ_COMMITTED)
public void readData() {
    // Dirty Read: ❌ नहीं होगा
    // Non-Repeatable Read: हो सकता है
    // Phantom Read: हो सकता है
    // Performance: Good
}
```

---

### REPEATABLE_READ

```java
@Transactional(isolation = Isolation.REPEATABLE_READ)
public void readData() {
    // Dirty Read: ❌
    // Non-Repeatable Read: ❌
    // Phantom Read: हो सकता है
    // Performance: Moderate
}
```

---

### SERIALIZABLE (सबसे Strict)

```java
@Transactional(isolation = Isolation.SERIALIZABLE)
public void readData() {
    // Dirty Read: ❌
    // Non-Repeatable Read: ❌
    // Phantom Read: ❌
    // Performance: Slowest (Locking)
}
```

---

## Isolation Summary

```text
┌────────────────────────────────────────────────────────────────┐
│ Isolation        │ Dirty │ Non-Rep │ Phantom │ Performance    │
├────────────────────────────────────────────────────────────────┤
│ READ_UNCOMMITTED │  ✅   │    ✅   │   ✅    │ Fastest        │
│ READ_COMMITTED   │  ❌   │    ✅   │   ✅    │ Fast           │
│ REPEATABLE_READ  │  ❌   │    ❌   │   ✅    │ Moderate       │
│ SERIALIZABLE     │  ❌   │    ❌   │   ❌    │ Slowest        │
└────────────────────────────────────────────────────────────────┘
(✅ = Problem Possible, ❌ = Problem Prevented)
```

---

# @Transactional के और Options

```java
@Transactional(
    propagation    = Propagation.REQUIRED,      // Default
    isolation      = Isolation.DEFAULT,          // DB Default
    timeout        = 30,                          // 30 seconds में खत्म
    readOnly       = false,                       // Read+Write
    rollbackFor    = {Exception.class},           // किस पर Rollback
    noRollbackFor  = {ValidationException.class}  // किस पर नहीं
)
```

---

## readOnly = true का फायदा

```java
@Transactional(readOnly = true)
public List<Order> getAllOrders() {
    return orderRepository.findAll();
}
```

```text
Benefits:
  ✅ Database Optimization (Flush नहीं होगा)
  ✅ Hibernate Dirty Checking Skip
  ✅ Some DBs Read Replicas Use कर सकते हैं
  ✅ Clearer Intent
```

---

# Real Project Example – Bank Transfer Complete

```java
@Service
public class BankTransferService {

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private AuditService auditService;

    @Transactional(
        rollbackFor = Exception.class,
        isolation = Isolation.REPEATABLE_READ,
        timeout = 30
    )
    public TransferResult transfer(TransferRequest req) {

        Account from = accountRepo.findByIdWithLock(req.getFromId());
        Account to   = accountRepo.findByIdWithLock(req.getToId());

        // Validation
        if (from.getBalance() < req.getAmount()) {
            throw new InsufficientFundsException("Balance कम है");
        }

        // Business Logic
        from.debit(req.getAmount());
        to.credit(req.getAmount());

        accountRepo.save(from);
        accountRepo.save(to);

        // Audit — Separate Transaction (हमेशा Save हो)
        auditService.logTransfer(req);  // REQUIRES_NEW

        return new TransferResult("SUCCESS", req.getAmount());
    }
}

@Service
class AuditService {

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logTransfer(TransferRequest req) {
        // यह अलग Transaction है
        // Transfer Fail हो तो भी यह Save होगा
        auditRepo.save(new AuditLog(req));
    }
}
```

---

# Interview Questions

---

## Q1. @Transactional कैसे काम करता है?

**Answer:**

AOP Proxy से।

Method Call → Proxy Intercept → Transaction Begin → Method चलाओ → Commit या Rollback।

Spring `TransactionInterceptor` (BeanPostProcessor) Bean पर `@Transactional` देखे → CGLIB/JDK Proxy बनाए।

---

## Q2. RuntimeException पर Rollback होता है, Checked पर क्यों नहीं?

**Answer:**

यह Spring का Default Design Decision है।

CheckedException को Recoverable माना जाता है।

RuntimeException को Unrecoverable।

`rollbackFor = Exception.class` से Checked पर भी Rollback होगा।

---

## Q3. REQUIRED और REQUIRES_NEW में क्या फर्क है?

**Answer:**

```text
REQUIRED:
  → Existing Transaction है → Use करो
  → नहीं है → नई बनाओ
  → दोनों का Fate Same (एक Rollback → दोनों Rollback)

REQUIRES_NEW:
  → हमेशा नई Transaction
  → Existing को Suspend करो
  → Independent Fate
  → Audit Logging के लिए Best
```

---

## Q4. @Transactional private method पर क्यों नहीं?

**Answer:**

Proxy Private Methods को Override नहीं कर सकती।

CGLIB Subclass में Private Method Override नहीं होती।

JDK Proxy Interface Methods ही Intercept करती है।

---

## Q5. readOnly = true क्या करता है?

**Answer:**

Database को Hint देता है — यह Read-Only Transaction है।

Hibernate Dirty Checking Skip करता है।

Performance Optimize होती है।

---

# Best Practices

---

## 1. Service Layer पर @Transactional

```java
// ✅ Service Layer पर
@Service
@Transactional  // Class Level — सभी Methods पर
class OrderService {

    @Transactional(readOnly = true)  // Override करो Read के लिए
    public Order findById(Long id) { }

    // Default: readOnly = false
    public void createOrder(OrderRequest req) { }
}
```

---

## 2. Repository पर @Transactional नहीं (Spring Data करता है)

```java
// Spring Data JPA already handles this
interface OrderRepository extends JpaRepository<Order, Long> {
    // @Transactional ज़रूरी नहीं — Spring Data देता है
}
```

---

## 3. Timeout Set करो

```java
@Transactional(timeout = 10)  // 10 seconds max
public void complexOperation() {
    // अगर 10 sec में नहीं हुआ → Rollback + Exception
}
```

---

# Common Mistakes

---

## Mistake 1 — Controller पर @Transactional

```java
// ❌ गलत
@RestController
class OrderController {
    @Transactional
    @PostMapping("/orders")
    public Order createOrder() { }
}

// ✅ Service पर
@Service
class OrderService {
    @Transactional
    public Order createOrder() { }
}
```

---

## Mistake 2 — Private Method @Transactional

```java
// ❌ काम नहीं करेगा — Proxy नहीं
@Transactional
private void saveOrder() { }

// ✅
@Transactional
public void saveOrder() { }
```

---

## Mistake 3 — CheckedException पर Rollback नहीं

```java
// ❌ IOException पर Rollback नहीं होगा
@Transactional
public void upload() throws IOException {
    saveToDb();
    throw new IOException("File error");
    // DB Save रहेगा!
}

// ✅ Rollback for Checked
@Transactional(rollbackFor = Exception.class)
public void upload() throws IOException { }
```

---

# इस Chapter का निष्कर्ष

```text
@Transactional = AOP + Transaction Manager

Flow:
  Method Call → Proxy → Begin Tx → Method → Commit/Rollback

Default Rollback:
  RuntimeException, Error → Rollback
  CheckedException → No Rollback (rollbackFor से Change)

Propagation:
  REQUIRED       → Existing Use या New (Default)
  REQUIRES_NEW   → Always New (Audit के लिए)

Isolation:
  READ_COMMITTED → Most Common
  REPEATABLE_READ → Consistent Read

Best Practice:
  Service Layer पर @Transactional
  readOnly = true Read Operations पर
  Timeout Set करो
```

---

### अगला Chapter

अब तक हमने Spring Framework का Core समझा।

लेकिन Production में कोई Spring Framework अकेला नहीं Use करता।

सब Use करते हैं — **Spring Boot**।

Spring Boot क्या जादू करता है?

`@SpringBootApplication` लिखते ही Database Connection कैसे मिलती है?

Starter Dependencies कैसे काम करती हैं?

अगला Chapter: **Spring Boot Auto Configuration**
