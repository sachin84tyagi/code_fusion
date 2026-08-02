Welcome to **Chapter 26 — Entity Relationships**.

> **Real applications have relationships. Products have categories. Users have orders. JPA maps these relationships to SQL joins automatically.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Think of a school:

```
One Teacher → Many Students     (@OneToMany)
One Student → One Teacher       (@ManyToOne)

One Student → One Library Card  (@OneToOne)

Students ↔ Subjects             (@ManyToMany)
  One student has many subjects
  One subject has many students
```

JPA maps these real-world relationships to database tables.

---

# Relationship Types

| Annotation | Meaning | Example |
| --- | --- | --- |
| `@OneToOne` | One-to-one | User ↔ UserProfile |
| `@OneToMany` | One-to-many | User → Orders |
| `@ManyToOne` | Many-to-one | Order → User |
| `@ManyToMany` | Many-to-many | Student ↔ Course |

---

# @OneToOne

One User has exactly one Profile.

```java
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserProfile profile;
}

@Entity
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bio;
    private String profilePicture;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}
```

`@JoinColumn` creates a foreign key `user_id` in the `user_profiles` table.

---

# @OneToMany and @ManyToOne

One User has Many Orders.

```java
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();
}

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
```

`mappedBy = "user"` means: "The `user` field in Order owns the relationship (has the FK)."

---

# @ManyToMany

Students and Courses.

```java
@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(
        name = "student_courses",              // Join table name
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private List<Course> courses = new ArrayList<>();
}

@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToMany(mappedBy = "courses")
    private List<Student> students = new ArrayList<>();
}
```

Creates a `student_courses` join table with `student_id` and `course_id` columns.

---

# Cascade Types

Define what happens to child entities when parent is updated/deleted.

| CascadeType | Effect |
| --- | --- |
| `PERSIST` | Saving parent also saves children |
| `MERGE` | Updating parent also updates children |
| `REMOVE` | Deleting parent also deletes children |
| `REFRESH` | Refreshing parent also refreshes children |
| `DETACH` | Detaching parent also detaches children |
| `ALL` | All of the above |

```java
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
private List<Order> orders;

// Saving user also saves orders
userRepository.save(user);
```

---

# Fetch Types

| FetchType | When data is loaded |
| --- | --- |
| `EAGER` | Immediately when parent is loaded |
| `LAZY` | Only when you access the collection |

```java
// LAZY (recommended for collections)
@OneToMany(fetch = FetchType.LAZY)
private List<Order> orders;

// EAGER (only for @ManyToOne or @OneToOne sometimes)
@ManyToOne(fetch = FetchType.EAGER)
private User user;

// Defaults:
// @OneToMany  → LAZY
// @ManyToMany → LAZY
// @ManyToOne  → EAGER (change to LAZY!)
// @OneToOne   → EAGER (change to LAZY!)
```

**Always prefer LAZY for performance.**

---

# The N+1 Problem

```java
// Without fetch join — N+1 queries!
List<User> users = userRepository.findAll();
for (User user : users) {
    // Each access triggers another SELECT!
    System.out.println(user.getOrders().size());
}
```

Fix with fetch join:

```java
@Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.orders")
List<User> findAllWithOrders();
```

One query instead of N+1.

---

# orphanRemoval

Remove child when it's removed from parent's collection:

```java
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Order> orders;

// Usage:
user.getOrders().remove(order);
userRepository.save(user);
// → Hibernate deletes the order from DB
```

---

# Company Example — Flipkart

```java
@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private BigDecimal price;

    // Many products belong to one category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // One product has many reviews
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();

    // Many products can be in many orders (via order items)
    @ManyToMany
    @JoinTable(
        name = "order_items",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "order_id")
    )
    private List<Order> orders = new ArrayList<>();
}

@Entity
@Table(name = "categories")
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // One category has many products
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<Product> products = new ArrayList<>();
}

@Entity
@Table(name = "reviews")
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
```

---

# Interview Questions

## Q1. What is the difference between @OneToMany and @ManyToOne?

**Best Answer**

> `@OneToMany` is on the parent entity and defines a collection of child entities. `@ManyToOne` is on the child entity and holds the foreign key reference to the parent. They are always used together — the `@ManyToOne` side owns the relationship.

---

## Q2. What does `mappedBy` mean?

`mappedBy` indicates the inverse side of a bidirectional relationship. The entity that owns the relationship (has the foreign key column) is the other side. `mappedBy = "fieldName"` points to the field on the owning side.

---

## Q3. What is the N+1 problem?

When loading N parent entities, and then accessing a lazy collection on each one, JPA fires 1 + N SQL queries (1 for parents + N for each child collection). Fix with `JOIN FETCH` to load everything in one query.

---

## Q4. What is the difference between EAGER and LAZY fetching?

`EAGER` loads related entities immediately with the parent (always). `LAZY` defers loading until the relationship is first accessed. Use LAZY for collections to avoid loading unnecessary data.

---

## Q5. What does `orphanRemoval = true` do?

When a child entity is removed from the parent's collection and the parent is saved, Hibernate automatically deletes the orphaned child from the database.

---

# Professional Summary

```
Relationships:

@OneToOne   → User ←→ UserProfile
@OneToMany  → User ← Orders (User side)
@ManyToOne  → Order → User (Order side, FK here)
@ManyToMany → Student ←→ Course (join table)

Key settings:
  cascade = CascadeType.ALL  → operations cascade to children
  fetch = FetchType.LAZY     → load only when accessed
  orphanRemoval = true       → auto-delete removed children
  mappedBy = "fieldName"     → inverse side (no FK here)
  @JoinColumn                → owner side (FK here)
```

---

# 🧠 Memory Trick

```
Relationships in real life:

OneToOne   = Husband ←→ Wife (1 each)
OneToMany  = Mother → Children (1 to many)
ManyToOne  = Children → Mother (many to 1)
ManyToMany = Students ←→ Subjects (many to many)

mappedBy = "I'm not the one holding the key"
@JoinColumn = "I hold the foreign key"
```

---

# 🚀 Next Chapter

We'll master **@Transactional** — ensuring that multiple database operations succeed or fail together as a single atomic unit.
