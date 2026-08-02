Welcome to **Chapter 24 — Derived Query Methods**.

> **Spring Data JPA turns method names into SQL. Write findByEmailAndActive() and Spring writes SELECT * FROM users WHERE email=? AND active=? automatically.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a librarian.

You say: "Find me all books by author Sachin, published after 2020."

The librarian understands English and finds the books.

```
"FindBooksByAuthorAndPublishedYearAfter(sachin, 2020)"
→ Librarian searches the right shelf
```

Spring does the same with method names.

```
findByAuthorAndPublishedYearAfter("Sachin", 2020)
→ SELECT * FROM books WHERE author='Sachin' AND published_year > 2020
```

---

# How It Works

Spring parses the method name and generates SQL.

```
find + By + FieldName + Condition
```

```java
public interface UserRepository extends JpaRepository<User, Long> {

    // Generated SQL: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    // Generated SQL: SELECT * FROM users WHERE name = ? AND active = ?
    List<User> findByNameAndActive(String name, boolean active);

    // Generated SQL: SELECT * FROM users WHERE age > ?
    List<User> findByAgeGreaterThan(int age);
}
```

---

# Keywords Reference

| Keyword | SQL | Example |
| --- | --- | --- |
| `And` | AND | `findByNameAndEmail` |
| `Or` | OR | `findByNameOrEmail` |
| `Is`, `Equals` | = | `findByNameIs`, `findByNameEquals` |
| `Not` | <> | `findByNameNot` |
| `Like` | LIKE | `findByNameLike` |
| `NotLike` | NOT LIKE | `findByNameNotLike` |
| `StartingWith` | LIKE 'x%' | `findByNameStartingWith` |
| `EndingWith` | LIKE '%x' | `findByNameEndingWith` |
| `Containing` | LIKE '%x%' | `findByNameContaining` |
| `GreaterThan` | > | `findByAgeGreaterThan` |
| `GreaterThanEqual` | >= | `findByAgeGreaterThanEqual` |
| `LessThan` | < | `findByAgeLessThan` |
| `LessThanEqual` | <= | `findByAgeLessThanEqual` |
| `Between` | BETWEEN | `findByAgeBetween` |
| `IsNull` | IS NULL | `findByEmailIsNull` |
| `IsNotNull` | IS NOT NULL | `findByEmailIsNotNull` |
| `In` | IN | `findByStatusIn` |
| `NotIn` | NOT IN | `findByStatusNotIn` |
| `OrderBy` | ORDER BY | `findAllByOrderByNameAsc` |
| `True` | = true | `findByActiveTrue` |
| `False` | = false | `findByActiveFalse` |

---

# Complete Repository Example

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Basic finds
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);

    // Boolean
    List<User> findByActiveTrue();
    List<User> findByActiveFalse();
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    // Like / Contains
    List<User> findByNameContaining(String keyword);
    List<User> findByEmailEndingWith(String domain);     // e.g., "@gmail.com"
    List<User> findByNameStartingWith(String prefix);

    // Comparisons
    List<User> findByAgeGreaterThanEqual(int minAge);
    List<User> findByAgeBetween(int min, int max);
    List<User> findByCreatedAtAfter(LocalDateTime date);

    // IN clause
    List<User> findByRoleIn(List<String> roles);
    List<User> findByIdIn(List<Long> ids);

    // AND conditions
    List<User> findByActiveAndRole(boolean active, String role);
    List<User> findByCityAndActiveTrue(String city);

    // OR conditions
    List<User> findByFirstNameOrLastName(String firstName, String lastName);

    // NULL checks
    List<User> findByPhoneIsNull();
    List<User> findByPhoneIsNotNull();

    // Sorting
    List<User> findByActiveOrderByNameAsc(boolean active);
    List<User> findAllByOrderByCreatedAtDesc();

    // Count
    long countByRole(String role);
    long countByActiveTrue();

    // Delete
    void deleteByActive(boolean active);
    int deleteByEmail(String email);

    // Pagination
    Page<User> findByActive(boolean active, Pageable pageable);
    Page<User> findByRoleAndCity(String role, String city, Pageable pageable);

    // Top / First
    Optional<User> findFirstByOrderByCreatedAtDesc(); // Most recent
    List<User> findTop5ByOrderByRatingDesc();          // Top 5 by rating
    List<User> findFirst10ByActiveOrderByNameAsc(boolean active);
}
```

---

# Return Types

| Return Type | Description |
| --- | --- |
| `Optional<T>` | Single result, may be empty |
| `T` | Single result, throws if not found |
| `List<T>` | Multiple results |
| `Page<T>` | Paginated results |
| `Slice<T>` | Like Page but no total count |
| `Stream<T>` | Java Stream (close after use) |
| `long` / `int` | Count or affected rows |
| `boolean` | Existence check |
| `void` | Delete operations |

---

# Distinct

```java
// Remove duplicates
List<String> findDistinctCityByActiveTrue();

// SELECT DISTINCT city FROM users WHERE active = true
```

---

# Limiting Results

```java
// First record
Optional<User> findFirstByOrderByCreatedAtDesc();

// Top 5
List<User> findTop5ByOrderByRatingDesc();

// First by condition
Optional<User> findFirstByRole(String role);
```

---

# Case Insensitive

```java
// LOWER(name) = LOWER(?)
Optional<User> findByEmailIgnoreCase(String email);

List<User> findByNameIgnoreCase(String name);
```

---

# Company Example — Swiggy

```java
@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    // Find open restaurants in a city
    List<Restaurant> findByCityAndIsOpenTrue(String city);

    // Find by cuisine
    List<Restaurant> findByCuisineTypeIn(List<String> cuisineTypes);

    // Search by name (like a search bar)
    List<Restaurant> findByNameContainingIgnoreCase(String name);

    // Top-rated restaurants
    List<Restaurant> findTop10ByCityOrderByRatingDesc(String city);

    // Recently added
    List<Restaurant> findFirst5ByCityOrderByCreatedAtDesc(String city);

    // Find with rating above threshold
    Page<Restaurant> findByCityAndRatingGreaterThanEqual(
        String city,
        double minRating,
        Pageable pageable
    );

    // Find vegetarian restaurants
    List<Restaurant> findByCityAndIsVegTrue(String city);

    // Count open restaurants
    long countByCityAndIsOpenTrue(String city);

    // Free delivery restaurants
    List<Restaurant> findByDeliveryChargeEquals(double charge); // charge = 0.0
}
```

---

# Interview Questions

## Q1. What are Derived Query Methods?

**Best Answer**

> Spring Data JPA can generate SQL queries from the method name in a repository interface. By following a naming convention (find/count/delete + By + FieldName + Condition), Spring automatically creates the corresponding SQL query without any implementation code.

---

## Q2. How does Spring Data parse method names?

Spring parses the method name by splitting at `By`, then reads field names and conditions. For example, `findByEmailAndActive` → `SELECT * FROM users WHERE email = ? AND active = ?`.

---

## Q3. What is the difference between `findBy` and `existsBy`?

`findBy` returns the entity/entities (or Optional). `existsBy` returns a `boolean` — it's more efficient as it doesn't fetch the entity data.

---

## Q4. When should you use `Page<T>` vs `List<T>`?

Use `Page<T>` when the client needs pagination metadata (total pages, total count). Use `List<T>` when you want all results or are controlling the count yourself.

---

## Q5. What is `findTop5ByOrderByRatingDesc()`?

It returns the top 5 records ordered by the `rating` field in descending order — essentially `SELECT * FROM table ORDER BY rating DESC LIMIT 5`.

---

# Professional Summary

```
findBy[FieldName][Keyword]([params])

Structure:
  find/count/delete + By + Field + Condition

Examples:
  findByEmail                → WHERE email = ?
  findByNameContaining       → WHERE name LIKE %?%
  findByAgeGreaterThan       → WHERE age > ?
  findByActiveTrue           → WHERE active = true
  findByStatusIn(list)       → WHERE status IN (...)
  findByCityAndActiveTrue    → WHERE city = ? AND active = true
  findTop5ByOrderByRatingDesc → ORDER BY rating DESC LIMIT 5
  countByRole                → COUNT WHERE role = ?
  existsByEmail              → EXISTS WHERE email = ?
```

---

# 🧠 Memory Trick

Derived queries = **Autocomplete for SQL**

```
You type: findByCity
Spring understands: WHERE city = ?

You type: findByCityAndActiveTrue
Spring understands: WHERE city = ? AND active = true

You type: findTop5ByOrderByRatingDesc
Spring understands: ORDER BY rating DESC LIMIT 5

Spring reads English method names and writes SQL
```

---

# 🚀 Next Chapter

We'll learn **@Query — JPQL and Native SQL** — when you need custom queries beyond what method names can express.
