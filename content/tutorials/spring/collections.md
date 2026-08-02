Welcome to **Chapter 3 — Collections Framework**.

> **Collections is Java's built-in toolkit for storing groups of objects. Spring Boot uses them everywhere — service layers, API responses, security, JPA results.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Think of different storage containers in a kitchen:

```
📋 List (ArrayList)
  → Ordered list: first, second, third
  → Duplicates allowed
  → Like a shopping list

🗂️ Map (HashMap)
  → Key-Value pairs
  → "sachin" → his phone number
  → Like a contacts book

🧺 Set (HashSet)
  → No duplicates allowed
  → Like a VIP guest list (one entry per person)

📬 Queue
  → First In, First Out (FIFO)
  → Like a bank queue — first person served first
```

---

# Collections Hierarchy

```
Collection (interface)
├── List (interface)
│   ├── ArrayList      ← Most used
│   ├── LinkedList
│   └── Vector
├── Set (interface)
│   ├── HashSet        ← Most used
│   ├── LinkedHashSet  ← Ordered
│   └── TreeSet        ← Sorted
└── Queue (interface)
    ├── LinkedList
    ├── PriorityQueue
    └── ArrayDeque

Map (separate hierarchy)
├── HashMap            ← Most used
├── LinkedHashMap      ← Insertion order
├── TreeMap            ← Sorted keys
└── Hashtable
```

---

# ArrayList — Ordered List with Duplicates

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

List<String> cities = new ArrayList<>();

// Add
cities.add("Delhi");
cities.add("Mumbai");
cities.add("Bangalore");
cities.add("Delhi");    // Duplicate allowed!

// Access
System.out.println(cities.get(0));     // Delhi
System.out.println(cities.size());     // 4

// Check
System.out.println(cities.contains("Mumbai")); // true
System.out.println(cities.isEmpty());          // false

// Remove
cities.remove("Delhi");              // Removes first "Delhi"
cities.remove(0);                    // Removes by index

// Loop
for (String city : cities) {
    System.out.println(city);
}

// Java 8 forEach
cities.forEach(city -> System.out.println(city));

// Sort
Collections.sort(cities);             // Alphabetical
Collections.sort(cities, Collections.reverseOrder()); // Reverse

// Convert array to list
List<String> fixed = Arrays.asList("A", "B", "C");

// List.of (immutable, Java 9+)
List<String> immutable = List.of("A", "B", "C");

// In Spring:
List<User> users = userRepository.findAll();
List<UserResponse> responses = users.stream().map(toResponse).collect(Collectors.toList());
```

---

# HashMap — Key-Value Storage

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> scores = new HashMap<>();

// Add
scores.put("Sachin", 95);
scores.put("Rahul", 87);
scores.put("Priya", 92);
scores.put("Sachin", 98); // Overwrites existing key!

// Access
System.out.println(scores.get("Sachin"));           // 98
System.out.println(scores.getOrDefault("Amit", 0)); // 0 (key not found)

// Check
System.out.println(scores.containsKey("Rahul"));   // true
System.out.println(scores.containsValue(92));       // true
System.out.println(scores.size());                  // 3

// Remove
scores.remove("Rahul");

// Iterate
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + " → " + entry.getValue());
}

// Keys only
for (String key : scores.keySet()) { }

// Values only
for (int value : scores.values()) { }

// putIfAbsent — only add if key doesn't exist
scores.putIfAbsent("Amit", 80);

// In Spring — exception handling response body:
Map<String, Object> errorBody = new LinkedHashMap<>();
errorBody.put("status", 404);
errorBody.put("message", "User not found");

// In Spring Security — UserDetails → authorities
Map<String, UserDetails> userCache = new HashMap<>();
```

---

# LinkedHashMap — Preserves Insertion Order

```java
Map<String, String> config = new LinkedHashMap<>();
config.put("host", "localhost");
config.put("port", "8080");
config.put("db", "mydb");

// Iteration order = insertion order
for (Map.Entry<String, String> entry : config.entrySet()) {
    System.out.println(entry.getKey() + "=" + entry.getValue());
}
// host=localhost
// port=8080
// db=mydb
```

---

# HashSet — No Duplicates

```java
import java.util.HashSet;
import java.util.Set;

Set<String> tags = new HashSet<>();

tags.add("java");
tags.add("spring");
tags.add("backend");
tags.add("java");     // Duplicate — ignored silently!

System.out.println(tags.size()); // 3, not 4

// Check
System.out.println(tags.contains("java")); // true

// Remove
tags.remove("backend");

// Set operations
Set<String> a = new HashSet<>(Set.of("A", "B", "C"));
Set<String> b = new HashSet<>(Set.of("B", "C", "D"));

// Intersection
a.retainAll(b);    // a = {B, C}

// Union
a.addAll(b);       // a = {A, B, C, D}

// Difference
a.removeAll(b);    // a = {A}

// In Spring Security:
Set<GrantedAuthority> authorities = new HashSet<>();
authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
authorities.add(new SimpleGrantedAuthority("ROLE_USER")); // No duplicate!
```

---

# Queue — First In, First Out

```java
import java.util.Queue;
import java.util.LinkedList;
import java.util.ArrayDeque;

Queue<String> notificationQueue = new LinkedList<>();

// Add to queue
notificationQueue.offer("Email to sachin@example.com");
notificationQueue.offer("SMS to +91-9876543210");
notificationQueue.offer("Push to device-abc123");

// Peek (see front without removing)
System.out.println(notificationQueue.peek()); // Email to sachin...

// Poll (remove and return front)
String next = notificationQueue.poll(); // Email to sachin... (removed)
System.out.println(notificationQueue.size()); // 2

// Process entire queue
while (!notificationQueue.isEmpty()) {
    String notification = notificationQueue.poll();
    sendNotification(notification);
}

// PriorityQueue — sorted by natural order or comparator
Queue<Integer> pq = new PriorityQueue<>();
pq.offer(30);
pq.offer(10);
pq.offer(20);
System.out.println(pq.poll()); // 10 (smallest first!)
```

---

# Iterator — Traverse Collections

```java
List<String> users = new ArrayList<>(List.of("Sachin", "Rahul", "Priya"));

Iterator<String> it = users.iterator();
while (it.hasNext()) {
    String user = it.next();
    if (user.equals("Rahul")) {
        it.remove(); // Safe removal during iteration
    }
}

// ListIterator — can iterate forward and backward
ListIterator<String> lit = users.listIterator();
while (lit.hasNext()) {
    String u = lit.next();
    lit.set(u.toUpperCase()); // Replace during iteration
}
```

---

# Collections Utility Class

```java
List<Integer> nums = new ArrayList<>(Arrays.asList(5, 3, 1, 4, 2));

Collections.sort(nums);            // [1, 2, 3, 4, 5]
Collections.reverse(nums);         // [5, 4, 3, 2, 1]
Collections.shuffle(nums);         // Random order
Collections.max(nums);             // 5
Collections.min(nums);             // 1
Collections.frequency(nums, 3);    // How many times 3 appears

// Thread-safe wrapper
List<String> synced = Collections.synchronizedList(new ArrayList<>());

// Unmodifiable
List<String> readOnly = Collections.unmodifiableList(nums);
```

---

# Choosing the Right Collection

```
NEED                        USE
───────────────────────────────────────
Ordered, duplicates OK   → ArrayList
Fast key-value lookup    → HashMap
Key order preserved      → LinkedHashMap
Keys sorted              → TreeMap
No duplicates            → HashSet
No duplicates, ordered   → LinkedHashSet
FIFO queue               → LinkedList / ArrayDeque
Priority-based           → PriorityQueue
Thread-safe map          → ConcurrentHashMap
```

---

# Spring Boot — Collections Everywhere

```java
// Repository returns List
List<User> users = userRepository.findAll();

// Controller returns List
public ResponseEntity<List<UserResponse>> getUsers() {
    return ResponseEntity.ok(userService.getAll());
}

// Exception handler returns Map
Map<String, String> errors = new LinkedHashMap<>();
errors.put("name", "Name is required");
errors.put("email", "Invalid email");

// Security — authorities as Set
Set<GrantedAuthority> authorities = new HashSet<>();
authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));

// Service — filter with Set
Set<String> allowedRoles = Set.of("ADMIN", "MANAGER");
if (allowedRoles.contains(user.getRole())) { ... }

// Cache config — Map per cache name
Map<String, RedisCacheConfiguration> caches = Map.of(
    "users", config.entryTtl(Duration.ofMinutes(10)),
    "products", config.entryTtl(Duration.ofMinutes(30))
);
```

---

# Company Example — Amazon Order System

```java
@Service
public class OrderDashboardService {

    // Group orders by city using Map
    public Map<String, List<Order>> groupOrdersByCity(List<Order> orders) {
        Map<String, List<Order>> grouped = new HashMap<>();

        for (Order order : orders) {
            grouped.computeIfAbsent(order.getCity(), k -> new ArrayList<>())
                   .add(order);
        }
        return grouped;
    }

    // Get unique product categories
    public Set<String> getUniqueCategories(List<Product> products) {
        Set<String> categories = new HashSet<>();
        for (Product p : products) {
            categories.add(p.getCategory());
        }
        return categories;
    }

    // Notification queue
    public void processNotificationQueue(Queue<Notification> queue) {
        while (!queue.isEmpty()) {
            Notification n = queue.poll();
            notificationService.send(n);
        }
    }
}
```

---

# Interview Questions

## Q1. What is the difference between ArrayList and LinkedList?

**Best Answer**
> `ArrayList` uses a dynamic array — fast random access (O(1)) but slow insert/delete in the middle (O(n)). `LinkedList` uses doubly-linked nodes — fast insert/delete anywhere (O(1)) but slow random access (O(n)). Use `ArrayList` for most cases.

---

## Q2. What is the difference between HashMap and LinkedHashMap?

`HashMap` doesn't guarantee iteration order. `LinkedHashMap` maintains insertion order. `TreeMap` maintains sorted key order.

---

## Q3. How does HashSet prevent duplicates?

HashSet uses `hashCode()` and `equals()` internally. When adding an element, it calculates the hash, finds the bucket, then uses `equals()` to check for duplicates. If equal object exists, it's not added.

---

## Q4. What is the difference between `fail-fast` and `fail-safe` iterators?

`fail-fast` iterators (ArrayList, HashMap) throw `ConcurrentModificationException` if the collection is modified during iteration. `fail-safe` iterators (ConcurrentHashMap, CopyOnWriteArrayList) work on a copy and don't throw.

---

## Q5. When would you use a Queue?

When order matters and you need FIFO processing — like a task queue, notification queue, or BFS graph traversal. In Spring, useful for background job queues.

---

# Professional Summary

```
List  → Ordered, duplicates
  ArrayList      → Fast random access (most used)
  LinkedList     → Fast insert/delete

Map   → Key-Value
  HashMap        → Fast lookup, no order
  LinkedHashMap  → Insertion order preserved
  TreeMap        → Sorted by key

Set   → No duplicates
  HashSet        → Fast lookup, no order
  LinkedHashSet  → Insertion order
  TreeSet        → Sorted

Queue → FIFO
  LinkedList     → General queue
  PriorityQueue  → Ordered by priority
  ArrayDeque     → Fast stack/queue
```

---

# 🧠 Memory Trick

```
Collections = Kitchen utensils

ArrayList   = 📋 Shopping list (ordered, can repeat)
HashMap     = 📞 Contacts app (name → number)
HashSet     = 🎫 Guest list (no duplicates)
Queue       = 🏧 ATM queue (first come, first served)
PriorityQ   = 🏥 Hospital (most critical first)
```

---

# 🚀 Next Chapter

We'll master **Java 8 Features** — Lambda, Streams, Optional, and Functional Interfaces. These appear in every single Spring Boot project.
