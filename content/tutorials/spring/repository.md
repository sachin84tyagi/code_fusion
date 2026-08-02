Welcome to **Chapter 23 — JpaRepository & CrudRepository**.

> **JpaRepository is Spring's magic wand. Extend it and get 50+ database methods for free — no SQL required.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you have a magic notebook.

You just write the student's name.

The notebook automatically:

```
✅ Saves the name (INSERT)
✅ Finds the name (SELECT)
✅ Updates the name (UPDATE)
✅ Deletes the name (DELETE)
✅ Counts all names (COUNT)
```

You don't write any queries.

The notebook does it all.

That notebook is `JpaRepository`.

---

# Repository Hierarchy

```
Repository (marker interface)
    ↓
CrudRepository<T, ID>   → Basic CRUD
    ↓
PagingAndSortingRepository<T, ID>  → + Pagination & Sorting
    ↓
JpaRepository<T, ID>   → + JPA-specific features (flush, batch, etc.)
```

**Use `JpaRepository`** — it has everything.

---

# Defining a Repository

```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // T   = Entity type (User)
    // ID  = Primary key type (Long)
    // All CRUD methods come for FREE
}
```

That's it. No implementation needed.

Spring generates the implementation at runtime.

---

# Built-in Methods

## Save

```java
User user = new User("Sachin", "sachin@example.com");
User saved = userRepository.save(user);    // INSERT or UPDATE
```

---

## Find

```java
// Find by ID
Optional<User> user = userRepository.findById(1L);

// Find all
List<User> all = userRepository.findAll();

// Check existence
boolean exists = userRepository.existsById(1L);
```

---

## Count

```java
long count = userRepository.count();
```

---

## Delete

```java
userRepository.deleteById(1L);
userRepository.delete(user);
userRepository.deleteAll();
userRepository.deleteAllById(List.of(1L, 2L, 3L));
```

---

## Save All

```java
List<User> users = List.of(
    new User("Sachin", "s@example.com"),
    new User("Rahul", "r@example.com"),
    new User("Priya", "p@example.com")
);
List<User> saved = userRepository.saveAll(users);
```

---

# JpaRepository Extra Methods

```java
// Flush changes to database immediately
userRepository.flush();

// Save and flush immediately
userRepository.saveAndFlush(user);

// Delete in batch (one SQL instead of N)
userRepository.deleteAllInBatch();

// Find all, sorted
userRepository.findAll(Sort.by("name").ascending());

// Reference (lazy load - no DB hit until accessed)
User ref = userRepository.getReferenceById(1L);
```

---

# Optional — Handle Not Found

```java
@Service
public class UserService {

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        return toResponse(user);
    }

    // Or use orElse
    public User getUserOrDefault(Long id) {
        return userRepository.findById(id)
            .orElse(new User("Guest", "guest@example.com"));
    }
}
```

---

# Sorting

```java
// Single field sort
List<User> users = userRepository.findAll(Sort.by("name"));

// Multiple fields
List<User> users = userRepository.findAll(
    Sort.by("department").ascending()
        .and(Sort.by("name").ascending())
);

// Descending
List<User> users = userRepository.findAll(Sort.by("createdAt").descending());
```

---

# Pagination

```java
// Page 0, 10 items per page, sorted by name
Pageable pageable = PageRequest.of(0, 10, Sort.by("name"));

Page<User> page = userRepository.findAll(pageable);

// Page info
List<User> users = page.getContent();       // Items on this page
int totalPages = page.getTotalPages();      // Total pages
long totalElements = page.getTotalElements(); // Total records
int currentPage = page.getNumber();         // Current page number
boolean hasNext = page.hasNext();           // More pages?
boolean hasPrev = page.hasPrevious();       // Previous page?
```

---

# Controller with Pagination

```java
@GetMapping
public ResponseEntity<Page<UserResponse>> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "id") String sortBy
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
    Page<User> usersPage = userRepository.findAll(pageable);
    Page<UserResponse> response = usersPage.map(this::toResponse);
    return ResponseEntity.ok(response);
}
```

---

# Custom Repository Method

Extend the interface with your own implementation:

```java
// Interface
public interface UserRepository extends JpaRepository<User, Long>, UserRepositoryCustom {
}

// Custom interface
public interface UserRepositoryCustom {
    List<User> findByComplexCriteria(String name, String city, int minAge);
}

// Custom implementation
public class UserRepositoryCustomImpl implements UserRepositoryCustom {

    @Autowired
    private EntityManager entityManager;

    @Override
    public List<User> findByComplexCriteria(String name, String city, int minAge) {
        // Use Criteria API or custom JPQL
        return entityManager.createQuery(
            "SELECT u FROM User u WHERE u.name LIKE :name AND u.age >= :age",
            User.class
        )
        .setParameter("name", "%" + name + "%")
        .setParameter("age", minAge)
        .getResultList();
    }
}
```

---

# Company Example — OLA

OLA driver management:

```java
@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    // All of these are FREE - Spring generates them!

    Optional<Driver> findByPhone(String phone);
    List<Driver> findByStatus(DriverStatus status);
    List<Driver> findByCityAndActiveTrue(String city);
    long countByStatus(DriverStatus status);

    // Find available drivers for a city with pagination
    Page<Driver> findByStatusAndCity(DriverStatus status, String city, Pageable pageable);
}

// Service
@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;

    public Page<Driver> getAvailableDrivers(String city, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("rating").descending());
        return driverRepository.findByStatusAndCity(DriverStatus.AVAILABLE, city, pageable);
    }

    public long getOnlineDriverCount() {
        return driverRepository.countByStatus(DriverStatus.ONLINE);
    }
}
```

---

# Interview Questions

## Q1. What is JpaRepository?

**Best Answer**

> `JpaRepository<T, ID>` is a Spring Data JPA interface that provides auto-implemented CRUD methods (`save`, `findById`, `findAll`, `delete`, `count`) plus JPA-specific operations (`flush`, `saveAndFlush`). You only define the interface; Spring generates the implementation.

---

## Q2. What is the difference between CrudRepository and JpaRepository?

`CrudRepository` provides basic CRUD. `PagingAndSortingRepository` adds pagination and sorting. `JpaRepository` extends both and adds JPA-specific methods like `flush()`, `saveAndFlush()`, and `deleteAllInBatch()`.

---

## Q3. How does Spring Data JPA generate repository implementations?

At startup, Spring scans for interfaces extending `JpaRepository`, and the `JpaRepositoryFactory` creates dynamic proxy implementations using reflection, implementing all inherited methods against the `EntityManager`.

---

## Q4. What is `Pageable` and `Page`?

`Pageable` is an interface to hold pagination parameters (page number, page size, sort). `Page<T>` is the result containing the data for the current page plus metadata (total pages, total elements, etc.).

---

## Q5. Why should you return `Optional` from repository methods?

`Optional` forces the caller to handle the case where the entity is not found, preventing `NullPointerException`. Use `.orElseThrow()` to throw a meaningful exception.

---

# Professional Summary

```
JpaRepository<T, ID> methods:

  CRUD:
    save(entity)         → INSERT/UPDATE
    saveAll(list)        → Bulk INSERT/UPDATE
    findById(id)         → SELECT by PK → Optional
    findAll()            → SELECT all
    existsById(id)       → EXISTS check
    count()              → COUNT
    deleteById(id)       → DELETE
    deleteAll()          → DELETE all

  Pagination:
    findAll(Pageable)    → SELECT with LIMIT/OFFSET

  JPA-specific:
    saveAndFlush()
    deleteAllInBatch()
    getReferenceById()
```

---

# 🧠 Memory Trick

JpaRepository = **Swiss Army Knife**

```
🔪 Swiss Army Knife (JpaRepository)

Blade    → save() (create/update)
Scissors → delete() (cut away)
Spoon    → findAll() (scoop up data)
Fork     → findById() (pick specific)
Toothpick → count() (quick check)

One tool. All operations. No SQL needed.
```

---

# 🚀 Next Chapter

We'll master **Derived Query Methods** — the Spring Data magic where method names become SQL queries automatically.
