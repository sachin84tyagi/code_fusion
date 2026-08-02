Welcome to **Chapter 28 — Pagination & Sorting**.

> **Loading 1 million records at once will kill your server. Pagination is non-negotiable in production APIs.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a library with 10,000 books.

If you ask: "Show me all books"

```
Librarian brings 10,000 books at once
Table collapses 📚💥
```

Instead you ask: "Show me books 1-10"

```
Librarian brings 10 books
You read them
Then ask for books 11-20
```

This is **pagination**.

Pages. Not all at once.

---

# Without Pagination (Dangerous)

```java
// BAD - loads entire table into memory!
@GetMapping("/users")
public List<User> getAllUsers() {
    return userRepository.findAll(); // Could be millions of records!
}
```

With 1 million records:
- Slow response
- High memory usage
- Server crash possible

---

# With Pagination (Correct)

```java
@GetMapping("/users")
public ResponseEntity<Page<User>> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
) {
    Pageable pageable = PageRequest.of(page, size);
    Page<User> users = userRepository.findAll(pageable);
    return ResponseEntity.ok(users);
}
```

---

# Pageable and PageRequest

```java
// Page 0, 10 records per page
Pageable pageable = PageRequest.of(0, 10);

// With sorting
Pageable pageable = PageRequest.of(0, 10, Sort.by("name").ascending());

// Multiple sort fields
Pageable pageable = PageRequest.of(0, 10,
    Sort.by("department").ascending()
        .and(Sort.by("salary").descending())
);
```

---

# Page<T> Object

```java
Page<User> page = userRepository.findAll(pageable);

page.getContent();          // List<User> — data on this page
page.getTotalElements();    // Total records in DB (e.g., 1000)
page.getTotalPages();       // Total pages (e.g., 100 for size=10)
page.getNumber();           // Current page number (0-indexed)
page.getSize();             // Page size
page.hasNext();             // Is there a next page?
page.hasPrevious();         // Is there a previous page?
page.isFirst();             // Is this the first page?
page.isLast();              // Is this the last page?
page.getNumberOfElements(); // Records on this page
```

---

# Sort

```java
// Ascending by name
Sort sort = Sort.by("name").ascending();

// Descending by createdAt
Sort sort = Sort.by("createdAt").descending();

// Multiple fields
Sort sort = Sort.by(
    Sort.Order.asc("department"),
    Sort.Order.desc("salary"),
    Sort.Order.asc("name")
);

// Ignoring case
Sort sort = Sort.by(Sort.Order.asc("name").ignoreCase());
```

---

# Custom Page Response DTO

Spring's `Page<T>` returns too much metadata. Create a clean DTO:

```java
@Data
@AllArgsConstructor
public class PageResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;

    public static <T> PageResponse<T> of(Page<T> page) {
        return new PageResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isFirst(),
            page.isLast()
        );
    }
}

// Usage in controller
@GetMapping("/users")
public ResponseEntity<PageResponse<UserResponse>> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "id") String sortBy,
    @RequestParam(defaultValue = "asc") String direction
) {
    Sort sort = direction.equalsIgnoreCase("desc")
        ? Sort.by(sortBy).descending()
        : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<User> users = userRepository.findAll(pageable);
    Page<UserResponse> responses = users.map(this::toResponse);

    return ResponseEntity.ok(PageResponse.of(responses));
}
```

---

# Paginated Custom Queries

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Derived method + pagination
    Page<User> findByActive(boolean active, Pageable pageable);

    Page<User> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<User> findByCityAndRole(String city, String role, Pageable pageable);

    // @Query + pagination
    @Query("SELECT u FROM User u WHERE u.age BETWEEN :min AND :max")
    Page<User> findByAgeRange(
        @Param("min") int min,
        @Param("max") int max,
        Pageable pageable
    );
}
```

---

# Slice — Lighter Than Page

`Slice<T>` = like `Page<T>` but **no total count query**.

```java
// No COUNT(*) query fired
Slice<User> slice = userRepository.findAll(pageable);

slice.getContent();    // Data
slice.hasNext();       // Is there a next page?
// No total count available
```

Use `Slice` for infinite scrolling where you don't need total count.

---

# Response JSON Structure

```json
{
    "content": [
        { "id": 1, "name": "Sachin", "email": "sachin@example.com" },
        { "id": 2, "name": "Rahul", "email": "rahul@example.com" }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 150,
    "totalPages": 15,
    "first": true,
    "last": false
}
```

---

# Limit Results Without Pagination

```java
// Top 5 users by rating
List<User> findTop5ByOrderByRatingDesc();

// First 10 active users
List<User> findFirst10ByActiveOrderByCreatedAtDesc(boolean active);
```

---

# Company Example — Instagram (Feed)

Instagram shows posts in pages (infinite scroll):

```java
@RestController
@RequestMapping("/api/v1/feed")
public class FeedController {

    @GetMapping
    public ResponseEntity<PageResponse<PostDto>> getFeed(
        @RequestParam String userId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        // Infinite scroll — use Slice (no total count needed)
        Pageable pageable = PageRequest.of(page, size,
            Sort.by("createdAt").descending());

        Slice<Post> posts = postRepository.findByFollowedUsers(userId, pageable);

        // Map to DTO
        List<PostDto> dtos = posts.getContent().stream()
            .map(this::toDto)
            .collect(Collectors.toList());

        return ResponseEntity.ok(new FeedResponse(dtos, posts.hasNext()));
    }
}

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Find posts from users that userId follows
    @Query("SELECT p FROM Post p WHERE p.userId IN " +
           "(SELECT f.followingId FROM Follow f WHERE f.followerId = :userId) " +
           "ORDER BY p.createdAt DESC")
    Slice<Post> findByFollowedUsers(@Param("userId") String userId, Pageable pageable);
}
```

---

# Interview Questions

## Q1. What is Pageable in Spring Data JPA?

**Best Answer**

> `Pageable` is an interface that encapsulates pagination parameters — page number, page size, and sort order. `PageRequest.of(page, size, sort)` creates a `Pageable` instance that repository methods accept to generate `LIMIT/OFFSET` SQL.

---

## Q2. What is the difference between Page and Slice?

`Page<T>` fires two queries: one for data and one for total count (`COUNT(*)`). `Slice<T>` only fires the data query, making it faster. Use `Page` when you need total count (numbered pagination), `Slice` for infinite scroll.

---

## Q3. How does Spring Data JPA implement pagination in SQL?

Spring adds `LIMIT` and `OFFSET` to the SQL query. `PageRequest.of(2, 10)` → `LIMIT 10 OFFSET 20` (page 2, 10 records per page, skipping first 20).

---

## Q4. How do you support dynamic sorting from request parameters?

Accept `sortBy` and `direction` parameters, then create: `Sort sort = direction.equals("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();`

---

## Q5. What are the drawbacks of deep pagination (page 1000 of 10)?

Deep pagination with `OFFSET` gets slow because the database must scan and skip all previous records. Solutions: cursor-based pagination (using `WHERE id > lastId`) or Elasticsearch for large datasets.

---

# Professional Summary

```
Pagination:
  PageRequest.of(page, size)
  PageRequest.of(page, size, sort)

  findAll(pageable)         → Page<T>
  findByField(x, pageable)  → Page<T>

Page<T> contains:
  getContent()       → actual data
  getTotalElements() → total count
  getTotalPages()    → total pages
  hasNext()
  hasPrevious()

Sort:
  Sort.by("name").ascending()
  Sort.by("createdAt").descending()
  Sort.by(Order.asc("a"), Order.desc("b"))
```

---

# 🧠 Memory Trick

Pagination = **Book pages**

```
📖 Book with 1000 pages

You don't carry all 1000 pages at once
You read page by page

PageRequest.of(0, 10) = Pages 1-10
PageRequest.of(1, 10) = Pages 11-20
PageRequest.of(99, 10) = Pages 991-1000

LIMIT 10 OFFSET 0
LIMIT 10 OFFSET 10
LIMIT 10 OFFSET 990
```

---

# 🚀 Next Chapter

We're entering **Spring Security** — the most important security framework for Java backends, covering authentication, authorization, and JWT.
