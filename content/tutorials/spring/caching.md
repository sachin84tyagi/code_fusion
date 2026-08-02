Welcome to **Chapter 37 — @Cacheable & Caching**.

> **Caching is the fastest database query — the one you never make. A well-cached API serves millions of requests per second.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you're a teacher.

A student asks: "What is 2 + 2?"

You calculate: "4"

Another student asks: "What is 2 + 2?"

You don't calculate again. You remember: "4"

**Cache = Your memory**

You store the answer and reuse it.

No need to recalculate every time.

---

# Without Caching

```
Request 1 → DB query (50ms) → Result
Request 2 → DB query (50ms) → Same Result
Request 3 → DB query (50ms) → Same Result
...
1000 requests → 1000 DB queries!
```

---

# With Caching

```
Request 1 → DB query (50ms) → Store in cache → Result
Request 2 → Cache hit (1ms) → Result
Request 3 → Cache hit (1ms) → Result
...
1000 requests → 1 DB query + 999 cache hits
```

---

# Enabling Caching

```xml
<!-- Spring Cache (simple in-memory) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>

<!-- Redis Cache (distributed, production-ready) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

```java
@SpringBootApplication
@EnableCaching // Enable caching
public class MyApp { }
```

---

# @Cacheable

Caches method result. Next call with same arguments → returns cached value.

```java
@Service
public class ProductService {

    @Cacheable("products")
    public List<Product> getAllProducts() {
        // First call: hits DB
        // Subsequent calls: returned from cache
        return productRepository.findAll();
    }

    @Cacheable(value = "products", key = "#id")
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow();
    }
}
```

---

# @CacheEvict

Remove from cache when data changes.

```java
@CacheEvict(value = "products", key = "#id")
public Product updateProduct(Long id, UpdateProductRequest request) {
    // Clears cache entry for this product after update
    Product product = productRepository.findById(id).orElseThrow();
    // ... update product
    return productRepository.save(product);
}

// Clear all products cache
@CacheEvict(value = "products", allEntries = true)
public void deleteProduct(Long id) {
    productRepository.deleteById(id);
}
```

---

# @CachePut

Always executes and updates the cache:

```java
@CachePut(value = "products", key = "#result.id")
public Product createProduct(CreateProductRequest request) {
    // Always runs the method
    // Saves the result to cache
    Product product = new Product(request);
    return productRepository.save(product);
}
```

---

# Caching Annotations Summary

| Annotation | When to use |
| --- | --- |
| `@Cacheable` | Read — cache if not cached |
| `@CacheEvict` | Delete — remove from cache |
| `@CachePut` | Write — always update cache |
| `@Caching` | Multiple cache operations |

---

# @Caching — Multiple Operations

```java
@Caching(
    evict = {
        @CacheEvict(value = "products", key = "#id"),
        @CacheEvict(value = "productList", allEntries = true)
    }
)
public void deleteProduct(Long id) {
    productRepository.deleteById(id);
}
```

---

# Cache Keys

```java
// Default key: method arguments
@Cacheable("products")
public Product getProduct(Long id) { ... }
// Cache key: id

// Custom key with SpEL
@Cacheable(value = "products", key = "#category + '_' + #page")
public Page<Product> getProductsByCategory(String category, int page) { ... }

// Complex key
@Cacheable(value = "search", key = "#query.toLowerCase() + ':' + #page + ':' + #size")
public Page<Product> search(String query, int page, int size) { ... }

// Key from object field
@Cacheable(value = "users", key = "#user.email")
public UserResponse getUser(UserDto user) { ... }
```

---

# Cache Condition

```java
// Only cache if results > 0
@Cacheable(value = "products", condition = "#result != null")
public Product getProduct(Long id) { ... }

// Don't cache if list is empty
@Cacheable(value = "products", unless = "#result.isEmpty()")
public List<Product> getProducts() { ... }

// Cache only when page = 0 (first page)
@Cacheable(value = "products", condition = "#page == 0")
public Page<Product> getProducts(int page, int size) { ... }
```

---

# Redis Cache (Production)

```properties
# Redis config
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.data.redis.password=
spring.data.redis.timeout=2000

# Cache type
spring.cache.type=redis
```

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))              // 10 min default TTL
            .disableCachingNullValues()                    // Don't cache nulls
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new GenericJackson2JsonRedisSerializer()
                )
            );

        Map<String, RedisCacheConfiguration> cacheConfigs = Map.of(
            "products", config.entryTtl(Duration.ofMinutes(30)),   // 30 min
            "users", config.entryTtl(Duration.ofMinutes(10)),      // 10 min
            "categories", config.entryTtl(Duration.ofHours(24))    // 24 hours
        );

        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(config)
            .withInitialCacheConfigurations(cacheConfigs)
            .build();
    }
}
```

---

# Company Example — Swiggy Menu

Swiggy's restaurant menu is read thousands of times per second:

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class MenuService {

    private final MenuRepository menuRepository;

    // Cache restaurant menu for 5 minutes
    @Cacheable(value = "restaurant:menu", key = "#restaurantId", unless = "#result == null")
    public MenuDto getMenu(String restaurantId) {
        log.info("Cache miss - fetching menu from DB: {}", restaurantId);
        Menu menu = menuRepository.findByRestaurantId(restaurantId).orElseThrow();
        return toDto(menu);
    }

    // Clear menu cache when restaurant updates their menu
    @CacheEvict(value = "restaurant:menu", key = "#restaurantId")
    public MenuDto updateMenu(String restaurantId, UpdateMenuRequest request) {
        Menu menu = menuRepository.findByRestaurantId(restaurantId).orElseThrow();
        // ... update
        return toDto(menuRepository.save(menu));
    }

    // Most popular items - cache for 1 hour
    @Cacheable(value = "popular:items", key = "#city")
    public List<ItemDto> getPopularItems(String city) {
        return menuRepository.findTop20PopularItemsByCity(city);
    }
}
```

Without caching: 1000 req/s × 50ms DB = 50 seconds of DB load

With caching: 999 req/s from Redis (1ms) + 1 DB query = negligible

---

# Interview Questions

## Q1. What is Spring Caching?

**Best Answer**

> Spring's caching abstraction provides a set of annotations (`@Cacheable`, `@CacheEvict`, `@CachePut`) to transparently cache method results. It supports multiple backends (in-memory, Redis, EhCache, Caffeine) without changing application code.

---

## Q2. What does @Cacheable do?

On first invocation with given arguments, it executes the method and stores the result in cache. On subsequent invocations with the same arguments, it returns the cached result without executing the method.

---

## Q3. What is the difference between @CacheEvict and @CachePut?

`@CacheEvict` removes entries from cache (used on delete/update operations). `@CachePut` always executes the method and updates (overwrites) the cache with the new result (used when you want cache to always reflect the latest data).

---

## Q4. Why use Redis for caching instead of in-memory?

Redis is a separate process, so cache survives application restart and is shared across multiple application instances (essential for horizontal scaling). In-memory caches are per-process and lost on restart.

---

## Q5. What is cache eviction and when is it needed?

Cache eviction removes stale data from cache. Needed when underlying data changes (update/delete operations). Failure to evict leads to clients seeing outdated data (stale reads).

---

# Professional Summary

```
Spring Caching Annotations:

@Cacheable("name")           → Cache if not cached
@CacheEvict("name")          → Remove from cache
@CachePut("name")            → Always update cache
@Caching(evict={}, put={})   → Multiple operations

Key options:
  value = "cacheName"
  key = "#param"             → SpEL expression
  condition = "#page == 0"   → Cache conditionally
  unless = "#result.empty"   → Don't cache if...
  allEntries = true          → Clear all entries

Production:
  Redis + RedisCacheManager
  Set TTL per cache
  Disable null caching
```

---

# 🧠 Memory Trick

Cache = **Notebook in your pocket**

```
Without cache:
  Every question → go to library → find answer (50ms)

With cache:
  Question asked before → check notebook (1ms)
  New question → library → write answer in notebook → (50ms, but saved for next time)

@Cacheable = Write to notebook
@CacheEvict = Erase outdated answer
@CachePut   = Always update the notebook
```

---

# 🚀 Next Chapter

We'll learn **@Scheduled** — how to run recurring tasks automatically in Spring Boot.
