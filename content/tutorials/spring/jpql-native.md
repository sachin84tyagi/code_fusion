Welcome to **Chapter 25 — @Query, JPQL & Native SQL**.

> **When method names aren't enough, @Query lets you write any query — from simple JPQL to complex native SQL — directly in your repository.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you're at a restaurant.

Normally you order from the menu (derived query methods).

But sometimes you want a custom dish:

```
"I want biryani but no onions, extra gravy,
with raita on the side, but only if spicy."
```

That's too specific for the menu.

You tell the chef directly.

`@Query` = **talking directly to the database chef**.

---

# What is JPQL?

JPQL = **Java Persistence Query Language**

Like SQL, but uses **entity names and field names** instead of table/column names.

```
SQL:   SELECT * FROM users WHERE email = 'sachin@example.com'
JPQL:  SELECT u FROM User u WHERE u.email = 'sachin@example.com'
        ↑ entity name              ↑ field name (not column)
```

Works regardless of the database (MySQL, PostgreSQL, etc.).

---

# Basic @Query

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmailCustom(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.age >= :minAge ORDER BY u.name ASC")
    List<User> findAdults(@Param("minAge") int minAge);

    @Query("SELECT u FROM User u WHERE u.active = true")
    List<User> findAllActiveUsers();
}
```

---

# Named Parameters vs Positional Parameters

```java
// Named parameters (recommended)
@Query("SELECT u FROM User u WHERE u.name = :name AND u.city = :city")
List<User> findByNameAndCity(@Param("name") String name, @Param("city") String city);

// Positional parameters
@Query("SELECT u FROM User u WHERE u.name = ?1 AND u.city = ?2")
List<User> findByNameAndCity(String name, String city);
```

Named parameters are clearer — use them.

---

# JPQL with JOIN

```java
// Join User and Order entities
@Query("SELECT u FROM User u JOIN u.orders o WHERE o.status = :status")
List<User> findUsersWithOrderStatus(@Param("status") String status);

// FETCH JOIN — load related entity in same query
@Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id")
Optional<User> findUserWithOrders(@Param("id") Long id);
```

---

# Returning Specific Fields (Projections)

```java
// Return only id and name
@Query("SELECT u.id, u.name FROM User u WHERE u.active = true")
List<Object[]> findActiveUserIdAndName();

// Better: use a projection interface
public interface UserSummary {
    Long getId();
    String getName();
    String getEmail();
}

@Query("SELECT u.id as id, u.name as name, u.email as email FROM User u WHERE u.active = true")
List<UserSummary> findActiveUserSummaries();
```

---

# JPQL Aggregate Functions

```java
// Count
@Query("SELECT COUNT(u) FROM User u WHERE u.active = true")
long countActiveUsers();

// Average
@Query("SELECT AVG(u.age) FROM User u")
Double getAverageAge();

// Max / Min
@Query("SELECT MAX(u.salary) FROM User u WHERE u.department = :dept")
BigDecimal getMaxSalaryByDepartment(@Param("dept") String department);

// Sum
@Query("SELECT SUM(o.amount) FROM Order o WHERE o.userId = :userId")
BigDecimal getTotalOrderAmount(@Param("userId") Long userId);
```

---

# JPQL GROUP BY

```java
@Query("SELECT u.city, COUNT(u) FROM User u GROUP BY u.city ORDER BY COUNT(u) DESC")
List<Object[]> countUsersByCity();

// Or use a DTO projection
@Query("SELECT new com.example.dto.CityCount(u.city, COUNT(u)) FROM User u GROUP BY u.city")
List<CityCount> getUserCountByCity();
```

---

# Modifying Queries — @Modifying

For UPDATE and DELETE, use `@Modifying`:

```java
// Update
@Modifying
@Transactional
@Query("UPDATE User u SET u.active = false WHERE u.id = :id")
int deactivateUser(@Param("id") Long id);

// Bulk update
@Modifying
@Transactional
@Query("UPDATE User u SET u.active = false WHERE u.createdAt < :date")
int deactivateOldUsers(@Param("date") LocalDateTime date);

// Delete
@Modifying
@Transactional
@Query("DELETE FROM User u WHERE u.active = false")
int deleteInactiveUsers();
```

---

# Native SQL Queries

When JPQL isn't enough, use native SQL:

```java
@Query(value = "SELECT * FROM users WHERE city = :city LIMIT :limit", nativeQuery = true)
List<User> findUsersByCity(@Param("city") String city, @Param("limit") int limit);

// Complex native query
@Query(
    value = "SELECT u.*, COUNT(o.id) as order_count FROM users u " +
            "LEFT JOIN orders o ON u.id = o.user_id " +
            "WHERE u.active = 1 " +
            "GROUP BY u.id " +
            "HAVING COUNT(o.id) > :minOrders " +
            "ORDER BY order_count DESC",
    nativeQuery = true
)
List<User> findActiveUsersWithMinOrders(@Param("minOrders") int minOrders);
```

---

# Native Query with Pagination

```java
@Query(
    value = "SELECT * FROM users WHERE active = 1",
    countQuery = "SELECT COUNT(*) FROM users WHERE active = 1",
    nativeQuery = true
)
Page<User> findActiveUsersNative(Pageable pageable);
```

`countQuery` is required for native queries with `Page<>`.

---

# @NamedQuery (Entity Level)

Define queries directly on the entity:

```java
@Entity
@NamedQuery(
    name = "User.findByRole",
    query = "SELECT u FROM User u WHERE u.role = :role"
)
public class User { }

// Repository
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByRole(@Param("role") String role);
}
```

---

# Company Example — Zepto Analytics

```java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Revenue by city for a date range (native)
    @Query(
        value = "SELECT city, SUM(total_amount) as revenue, COUNT(id) as order_count " +
                "FROM orders " +
                "WHERE status = 'DELIVERED' AND order_date BETWEEN :start AND :end " +
                "GROUP BY city ORDER BY revenue DESC",
        nativeQuery = true
    )
    List<Object[]> getRevenueByCityAndDateRange(
        @Param("start") LocalDate start,
        @Param("end") LocalDate end
    );

    // Top customers by spend
    @Query("SELECT o.userId, SUM(o.totalAmount) as totalSpend " +
           "FROM Order o WHERE o.status = 'DELIVERED' " +
           "GROUP BY o.userId ORDER BY totalSpend DESC")
    List<Object[]> findTopCustomers(Pageable pageable);

    // Update order status in bulk
    @Modifying
    @Transactional
    @Query("UPDATE Order o SET o.status = :newStatus WHERE o.status = :oldStatus AND o.updatedAt < :cutoff")
    int updateStaleOrders(
        @Param("oldStatus") String oldStatus,
        @Param("newStatus") String newStatus,
        @Param("cutoff") LocalDateTime cutoff
    );

    // Orders with items (fetch join to avoid N+1)
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items WHERE o.userId = :userId")
    List<Order> findOrdersWithItemsByUser(@Param("userId") Long userId);
}
```

---

# Interview Questions

## Q1. What is @Query in Spring Data JPA?

**Best Answer**

> `@Query` allows you to define a custom JPQL or native SQL query directly on a repository method, overriding Spring's auto-generated query. It's used when derived method names can't express complex queries.

---

## Q2. What is JPQL?

Java Persistence Query Language — a query language similar to SQL but operating on JPA entity objects and their fields rather than database tables and columns. It is database-independent.

---

## Q3. When do you use native SQL vs JPQL?

Use JPQL for most queries (database-independent). Use native SQL (`nativeQuery = true`) for database-specific features like full-text search, window functions, complex joins, or performance-critical raw SQL.

---

## Q4. What is @Modifying?

Required for `@Query` methods that perform INSERT, UPDATE, or DELETE operations. Without it, Spring throws an error. Should be combined with `@Transactional`.

---

## Q5. What is a FETCH JOIN and why is it used?

A JPQL JOIN FETCH loads the related entities in the same SQL query, preventing the N+1 problem. Without it, accessing a lazy-loaded collection for each result would trigger N additional SQL queries.

---

# Professional Summary

```
@Query:
  JPQL:
    @Query("SELECT u FROM User u WHERE u.email = :email")
    → Database-independent, uses entity/field names

  Native:
    @Query(value = "SELECT * FROM users WHERE ...", nativeQuery = true)
    → Raw SQL, database-specific

  Modifying:
    @Modifying + @Transactional
    → For UPDATE / DELETE queries

  Projections:
    SELECT u.id, u.name → Object[] or interface projection
```

---

# 🧠 Memory Trick

```
@Query levels:

1. Derived methods   → Menu order (findByEmail)
2. JPQL @Query       → Custom order in restaurant language
3. Native @Query     → Directly to chef in kitchen language

Use 1 first, then 2, native only when needed
```

---

# 🚀 Next Chapter

We'll explore **Entity Relationships** — @OneToOne, @OneToMany, @ManyToOne, @ManyToMany — the heart of relational database modeling in JPA.
