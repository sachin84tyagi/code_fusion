Welcome to **Chapter 7 — SQL Basics**.

> **Spring Data JPA generates SQL for you — but you MUST understand what SQL is being generated and why. Without SQL, debugging JPA issues is impossible.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a school library spreadsheet.

```
📚 Books Table:
  ID | Title           | Author    | Year | Available
  1  | Clean Code      | Robert C  | 2008 | Yes
  2  | Spring Boot     | Craig W   | 2019 | No
  3  | Java Basics     | James G   | 2021 | Yes
```

SQL is the language to talk to this spreadsheet:

```
"Show me all available books"   → SELECT
"Add a new book"                → INSERT
"Mark book as unavailable"      → UPDATE
"Remove a book"                 → DELETE
```

---

# What is SQL?

SQL = **Structured Query Language**

Used to interact with **relational databases** (MySQL, PostgreSQL, SQLite, Oracle).

Databases organize data in **tables** (like Excel sheets).

Each table has **rows** (records) and **columns** (fields).

---

# Setting Up (MySQL)

```sql
-- Create database
CREATE DATABASE myapp;

-- Use database
USE myapp;

-- Create table
CREATE TABLE users (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) UNIQUE NOT NULL,
    age         INT,
    city        VARCHAR(50),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# INSERT — Add Data

```sql
-- Single row
INSERT INTO users (name, email, age, city)
VALUES ('Sachin Tyagi', 'sachin@example.com', 25, 'Delhi');

-- Multiple rows
INSERT INTO users (name, email, age, city)
VALUES
  ('Rahul Kumar', 'rahul@example.com', 28, 'Mumbai'),
  ('Priya Sharma', 'priya@example.com', 22, 'Bangalore'),
  ('Amit Singh', 'amit@example.com', 30, 'Delhi');
```

---

# SELECT — Read Data

```sql
-- All rows, all columns
SELECT * FROM users;

-- Specific columns
SELECT name, email, age FROM users;

-- With alias
SELECT name AS "Full Name", email AS "Email ID" FROM users;

-- With condition (WHERE)
SELECT * FROM users WHERE city = 'Delhi';
SELECT * FROM users WHERE age > 25;
SELECT * FROM users WHERE is_active = TRUE;
SELECT * FROM users WHERE age BETWEEN 20 AND 30;
SELECT * FROM users WHERE name LIKE 'S%';      -- starts with S
SELECT * FROM users WHERE name LIKE '%ya%';    -- contains 'ya'
SELECT * FROM users WHERE city IN ('Delhi', 'Mumbai');

-- Combining conditions
SELECT * FROM users WHERE city = 'Delhi' AND age > 24;
SELECT * FROM users WHERE city = 'Delhi' OR city = 'Mumbai';
SELECT * FROM users WHERE NOT is_active = TRUE;
SELECT * FROM users WHERE age IS NULL;
SELECT * FROM users WHERE age IS NOT NULL;
```

---

# ORDER BY — Sorting

```sql
-- Ascending (default)
SELECT * FROM users ORDER BY name ASC;

-- Descending
SELECT * FROM users ORDER BY age DESC;

-- Multiple columns
SELECT * FROM users ORDER BY city ASC, age DESC;

-- Random order
SELECT * FROM users ORDER BY RAND() LIMIT 5;
```

---

# LIMIT & OFFSET — Pagination

```sql
-- First 10 rows
SELECT * FROM users LIMIT 10;

-- Skip 20, get next 10 (page 3)
SELECT * FROM users LIMIT 10 OFFSET 20;

-- JPA equivalent:
-- findAll(PageRequest.of(2, 10)) → LIMIT 10 OFFSET 20
```

---

# UPDATE — Modify Data

```sql
-- Update one record
UPDATE users
SET name = 'Sachin T', city = 'Gurgaon'
WHERE id = 1;

-- Update multiple records
UPDATE users
SET is_active = FALSE
WHERE city = 'Mumbai';

-- Update with expression
UPDATE users
SET age = age + 1
WHERE id = 1;
```

> ⚠️ **Always use WHERE in UPDATE.** Without it, ALL rows are updated!

---

# DELETE — Remove Data

```sql
-- Delete specific row
DELETE FROM users WHERE id = 1;

-- Delete by condition
DELETE FROM users WHERE is_active = FALSE;

-- Delete all rows (table still exists)
DELETE FROM users;

-- or
TRUNCATE TABLE users; -- Faster, resets auto-increment
```

> ⚠️ **Always use WHERE in DELETE.** Without it, ALL rows are deleted!

---

# Aggregate Functions

```sql
-- Count rows
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM users WHERE city = 'Delhi';

-- Sum
SELECT SUM(age) FROM users;

-- Average
SELECT AVG(age) FROM users;

-- Max and Min
SELECT MAX(age) FROM users;
SELECT MIN(age) FROM users;

-- Group stats
SELECT city, COUNT(*) AS user_count, AVG(age) AS avg_age
FROM users
GROUP BY city;

-- Filter groups
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city
HAVING COUNT(*) > 2;
```

---

# JOIN — Combining Tables

The most important SQL concept for Spring JPA relationships.

```sql
-- Sample data setup
CREATE TABLE orders (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    amount      DECIMAL(10, 2),
    status      VARCHAR(20),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO orders (user_id, amount, status) VALUES
  (1, 599.00, 'DELIVERED'),
  (1, 1299.00, 'PENDING'),
  (2, 499.00, 'DELIVERED'),
  (3, 899.00, 'CANCELLED');
```

---

## INNER JOIN — Only matching rows

```sql
-- Get all orders WITH user name
SELECT u.name, u.email, o.amount, o.status
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- Result: Only users who HAVE orders
-- Users with no orders are EXCLUDED
```

---

## LEFT JOIN — All left rows + matching right

```sql
-- Get ALL users, with their orders (if any)
SELECT u.name, u.email, o.amount, o.status
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Result: All users shown
-- Users with no orders show NULL in order columns
```

---

## RIGHT JOIN — All right rows + matching left

```sql
-- All orders, with user details
SELECT u.name, o.amount, o.status
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```

---

## Multiple JOINs

```sql
-- Users → Orders → Products
SELECT u.name, o.id as order_id, p.name as product_name
FROM users u
INNER JOIN orders o ON u.id = o.user_id
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
WHERE u.city = 'Delhi'
ORDER BY o.created_at DESC;
```

---

# Subqueries

```sql
-- Users who have placed orders
SELECT * FROM users
WHERE id IN (SELECT DISTINCT user_id FROM orders);

-- Users with order count
SELECT u.name,
       (SELECT COUNT(*) FROM orders WHERE user_id = u.id) AS order_count
FROM users u;

-- Users with highest order amount
SELECT * FROM users
WHERE id = (SELECT user_id FROM orders ORDER BY amount DESC LIMIT 1);
```

---

# Indexes (Performance)

```sql
-- Create index for faster queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- In JPA:
@Table(indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_city", columnList = "city")
})
```

---

# SQL → JPA Mapping Reference

| SQL | JPA / Spring Data |
|---|---|
| `SELECT * FROM users` | `userRepository.findAll()` |
| `SELECT * WHERE id=1` | `userRepository.findById(1L)` |
| `SELECT * WHERE email=?` | `findByEmail(email)` |
| `INSERT INTO users ...` | `userRepository.save(user)` |
| `UPDATE users SET ...` | `userRepository.save(user)` |
| `DELETE WHERE id=1` | `userRepository.deleteById(1L)` |
| `SELECT COUNT(*)` | `userRepository.count()` |
| `JOIN orders ON user_id` | `@OneToMany` / `@ManyToOne` |
| `LIMIT 10 OFFSET 20` | `PageRequest.of(2, 10)` |
| `ORDER BY name ASC` | `Sort.by("name").ascending()` |

---

# Company Example — Zepto Analytics

```sql
-- Daily revenue by city (used in @Query)
SELECT city,
       SUM(total_amount) AS revenue,
       COUNT(id) AS order_count,
       AVG(total_amount) AS avg_order_value
FROM orders
WHERE status = 'DELIVERED'
  AND DATE(created_at) = CURDATE()
GROUP BY city
ORDER BY revenue DESC;

-- Top 10 products today
SELECT p.name, COUNT(oi.id) AS sold_count
FROM products p
INNER JOIN order_items oi ON p.id = oi.product_id
INNER JOIN orders o ON oi.order_id = o.id
WHERE DATE(o.created_at) = CURDATE()
  AND o.status = 'DELIVERED'
GROUP BY p.id, p.name
ORDER BY sold_count DESC
LIMIT 10;

-- In Spring:
@Query(value = "SELECT p.name, COUNT(oi.id) AS sold_count FROM products p " +
               "INNER JOIN order_items oi ON p.id = oi.product_id " +
               "INNER JOIN orders o ON oi.order_id = o.id " +
               "WHERE DATE(o.created_at) = CURDATE() AND o.status = 'DELIVERED' " +
               "GROUP BY p.id ORDER BY sold_count DESC LIMIT 10",
       nativeQuery = true)
List<Object[]> getTopProductsToday();
```

---

# Interview Questions

## Q1. What is the difference between INNER JOIN and LEFT JOIN?

**Best Answer**
> `INNER JOIN` returns only rows where there is a match in BOTH tables. `LEFT JOIN` returns ALL rows from the left table, and matching rows from the right (NULLs if no match). Use `LEFT JOIN` when you want all records regardless of whether a related record exists.

---

## Q2. What does GROUP BY do?

`GROUP BY` groups rows with the same value in specified columns into summary rows. Always used with aggregate functions (`COUNT`, `SUM`, `AVG`, `MAX`, `MIN`).

---

## Q3. What is the difference between WHERE and HAVING?

`WHERE` filters individual rows before grouping. `HAVING` filters groups after `GROUP BY`. You cannot use aggregate functions in `WHERE`, but you can in `HAVING`.

---

## Q4. What is a FOREIGN KEY?

A column that references the PRIMARY KEY of another table, establishing a relationship between the two tables. It enforces referential integrity — you can't add an order for a non-existent user.

---

## Q5. What is an Index and why is it important?

An index is a data structure that speeds up data retrieval operations on a table. Without an index, the database scans every row (full table scan). With an index, it jumps directly to the relevant data.

---

# Professional Summary

```
Core SQL:

SELECT col FROM table WHERE condition ORDER BY col LIMIT n;

INSERT INTO table (col1, col2) VALUES (val1, val2);

UPDATE table SET col = val WHERE condition;

DELETE FROM table WHERE condition;

JOINs:
  INNER JOIN → both match
  LEFT JOIN  → all left + matching right
  RIGHT JOIN → all right + matching left

Aggregates:
  COUNT(*), SUM(col), AVG(col), MAX(col), MIN(col)
  + GROUP BY col
  + HAVING condition

Pagination:
  LIMIT 10 OFFSET 20 → page 3, size 10
```

---

# 🧠 Memory Trick

```
SQL = Library Management

SELECT = Find books
WHERE  = By author/genre filter
JOIN   = Find books WITH their author details
INSERT = Add new book
UPDATE = Change book info
DELETE = Remove book
GROUP BY = Count books per genre
ORDER BY = Sort alphabetically
LIMIT  = Show only first 10
```

---

# 🚀 Next Chapter

We'll cover **Git Basics** — version control for tracking your code changes. Then we jump into Spring Boot!
