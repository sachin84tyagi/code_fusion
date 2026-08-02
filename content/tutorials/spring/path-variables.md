Welcome to **Chapter 15 — @PathVariable & @RequestParam**.

> **@PathVariable reads from the URL path. @RequestParam reads from the query string. Together they let you build powerful, flexible APIs.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine ordering food at a restaurant.

**Path Variable = Table number on your receipt**

```
"Table 5, Order confirmed!"
         ↑
     fixed in URL
```

**Request Param = Customizations you asked for**

```
"Pizza with extra cheese, no onions"
                ↑
         optional preferences
```

```
URL:  /api/orders/5?cheese=extra&onions=false
         ↑                  ↑
   PathVariable         RequestParam
```

---

# @PathVariable

Extracts a value from the **URL path segment**.

```java
// URL: GET /api/users/42
@GetMapping("/api/users/{id}")
public User getUserById(@PathVariable Long id) {
    return userService.findById(id);
}
```

`{id}` in the path → extracted into `Long id` parameter.

---

# Multiple Path Variables

```java
// URL: GET /api/orders/2024/june/15
@GetMapping("/api/orders/{year}/{month}/{day}")
public List<Order> getOrdersByDate(
    @PathVariable int year,
    @PathVariable String month,
    @PathVariable int day
) {
    return orderService.getByDate(year, month, day);
}
```

---

# Custom Variable Name

When method param name differs from path variable:

```java
@GetMapping("/users/{userId}/orders/{orderId}")
public Order getOrder(
    @PathVariable("userId") Long uid,
    @PathVariable("orderId") Long oid
) {
    return orderService.findByUserAndOrder(uid, oid);
}
```

---

# Optional Path Variable

```java
@GetMapping({"/api/users", "/api/users/{id}"})
public Object getUser(
    @PathVariable(required = false) Long id
) {
    if (id == null) {
        return userService.getAll();
    }
    return userService.findById(id);
}
```

---

# @RequestParam

Extracts a value from the **query string** (`?key=value`).

```java
// URL: GET /api/users?name=sachin
@GetMapping("/api/users")
public List<User> searchUsers(@RequestParam String name) {
    return userService.searchByName(name);
}
```

---

# Optional with Default Value

```java
// URL: GET /api/products?page=0&size=10&sort=name
@GetMapping("/api/products")
public List<Product> getProducts(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "id") String sort
) {
    return productService.getProducts(page, size, sort);
}
```

---

# Required vs Optional

```java
@GetMapping("/search")
public List<Product> search(
    @RequestParam String keyword,                        // Required
    @RequestParam(required = false) String category,     // Optional, null if missing
    @RequestParam(required = false, defaultValue = "0") int page // Optional with default
) {
    return searchService.search(keyword, category, page);
}
```

---

# Custom Parameter Name

```java
// URL: /search?q=laptop
@GetMapping("/search")
public List<Product> search(@RequestParam("q") String keyword) {
    return searchService.search(keyword);
}
```

---

# Multiple Values for Same Key

```java
// URL: /filter?color=red&color=blue&color=green
@GetMapping("/filter")
public List<Product> filterByColors(@RequestParam List<String> color) {
    return productService.filterByColors(color);
}
```

---

# Map for All Params

```java
// URL: /search?name=sachin&city=delhi&age=25
@GetMapping("/search")
public List<User> search(@RequestParam Map<String, String> params) {
    String name = params.get("name");
    String city = params.get("city");
    return userService.search(name, city);
}
```

---

# @PathVariable vs @RequestParam

| Feature | @PathVariable | @RequestParam |
| --- | --- | --- |
| Source | URL path segment | Query string |
| Example | `/users/42` | `/users?id=42` |
| Required | Yes (by default) | Optional (with default) |
| Purpose | Resource identification | Filtering/sorting/pagination |
| RESTful | ✅ Yes | For extra options |

---

# When to Use Which?

```
Use @PathVariable for:
  Identifying a specific resource
  /users/{id}
  /products/{productId}
  /orders/{orderId}/items/{itemId}

Use @RequestParam for:
  Filtering
  Sorting
  Pagination
  Search keywords
  Optional customization
  /products?category=electronics&sort=price&page=2
```

---

# Real URL Examples

```
GET /api/users/42
→ @PathVariable Long id = 42

GET /api/users?name=sachin&city=delhi
→ @RequestParam String name = "sachin"
→ @RequestParam String city = "delhi"

GET /api/products/laptop/reviews?page=1&size=5&sort=rating
→ @PathVariable String category = "laptop"
→ @RequestParam int page = 1
→ @RequestParam int size = 5
→ @RequestParam String sort = "rating"
```

---

# Company Example — Amazon

Amazon's product search:

```java
@RestController
@RequestMapping("/api/v1/catalog")
public class CatalogController {

    // Get specific product by ID (PathVariable)
    // GET /api/v1/catalog/products/B08N5WRWNW
    @GetMapping("/products/{asin}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable String asin) {
        return ResponseEntity.ok(catalogService.getByAsin(asin));
    }

    // Search with filters (RequestParam)
    // GET /api/v1/catalog/products?q=laptop&brand=dell&minPrice=30000&maxPrice=80000&sort=popularity&page=0&size=24
    @GetMapping("/products")
    public Page<ProductDto> searchProducts(
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String brand,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(defaultValue = "popularity") String sort,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "24") int size
    ) {
        return catalogService.search(q, brand, minPrice, maxPrice, sort, page, size);
    }

    // Get reviews for a product (both)
    // GET /api/v1/catalog/products/B08N5WRWNW/reviews?rating=5&page=0
    @GetMapping("/products/{asin}/reviews")
    public Page<ReviewDto> getReviews(
        @PathVariable String asin,
        @RequestParam(required = false) Integer rating,
        @RequestParam(defaultValue = "0") int page
    ) {
        return reviewService.getReviews(asin, rating, page);
    }
}
```

---

# Interview Questions

## Q1. What is @PathVariable?

**Best Answer**

> `@PathVariable` extracts a value from a URI template variable — a segment in the URL path marked with `{variableName}`. It is used to identify a specific resource.

---

## Q2. What is @RequestParam?

`@RequestParam` extracts query parameters from the URL's query string (after `?`). It supports optional parameters, default values, and binding multiple values.

---

## Q3. When do you use @PathVariable vs @RequestParam?

Use `@PathVariable` for resource identification (`/users/{id}`). Use `@RequestParam` for filtering, searching, sorting, and pagination options (`/users?page=1&size=10`).

---

## Q4. How do you make a @RequestParam optional?

Set `required = false`: `@RequestParam(required = false) String name`. Or provide a `defaultValue`: `@RequestParam(defaultValue = "0") int page`.

---

## Q5. Can you use both in the same method?

Yes. Many REST APIs use both together:

```java
@GetMapping("/products/{categoryId}/items")
public List<Item> getItems(
    @PathVariable Long categoryId,
    @RequestParam(defaultValue = "0") int page
) { ... }
```

---

# Professional Summary

```
@PathVariable
  → Extract from URL segment
  → /users/{id}
  → Required by default

@RequestParam
  → Extract from query string
  → /users?page=0&size=10
  → Optional with defaultValue

Combine for powerful APIs:
  GET /products/{categoryId}?sort=price&page=2
         ↑                       ↑
   PathVariable             RequestParam
```

---

# 🧠 Memory Trick

```
URL: /shops/42/items?color=red&page=2

/shops/42/items  → PathVariable: 42
?color=red       → RequestParam: color="red"
&page=2          → RequestParam: page=2

PathVariable  = WHO (which resource)
RequestParam  = HOW (how to filter/sort)
```

---

# 🚀 Next Chapter

We'll learn **@RequestBody & @ResponseBody** — how to send and receive JSON data in the HTTP request and response body.
