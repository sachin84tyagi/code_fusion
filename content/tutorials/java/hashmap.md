Welcome to **Java — Chapter 27: HashMap**.

> **HashMap is the dictionary of Java. It stores data in Key-Value pairs. It is famous for one thing: Lightning-fast data lookup.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a physical Dictionary book.
If you want to find the meaning of the word "Java", you don't read the book from page 1 to page 500 until you find it (that's what a `List` does!). 

Instead, you use the Alphabet (the **Key**) to jump directly to the 'J' section and instantly find the meaning (the **Value**).

In HashMap:
- **Key** = The word you search for (Must be unique).
- **Value** = The meaning (Can be duplicated).

---

# Basic Syntax & Methods

Notice how `HashMap` takes TWO generic types: `<KeyType, ValueType>`.

```java
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        
        // 1. Creation
        Map<String, Integer> phoneBook = new HashMap<>();

        // 2. Add Key-Value pairs (.put instead of .add)
        phoneBook.put("Sachin", 98765);
        phoneBook.put("Rahul", 12345);
        phoneBook.put("Priya", 55555);

        // 3. Update a Value (If key exists, it overwrites the value)
        phoneBook.put("Sachin", 11111); // Sachin's number is now 11111

        // 4. Retrieve a Value by Key (SUPER FAST! O(1))
        System.out.println(phoneBook.get("Rahul")); // 12345

        // If key doesn't exist, it returns null
        System.out.println(phoneBook.get("Amit")); // null

        // 5. Remove a pair
        phoneBook.remove("Priya");

        // 6. Check existence
        System.out.println(phoneBook.containsKey("Sachin")); // true
        System.out.println(phoneBook.containsValue(12345));  // true
    }
}
```

---

# Iterating over a HashMap

Because Map is not a true Collection, you can't just `for(String s : map)`. You have to iterate over its Keys, its Values, or its Entries (pairs).

```java
Map<String, String> capitals = new HashMap<>();
capitals.put("India", "New Delhi");
capitals.put("USA", "Washington DC");

// Method 1: Iterating over Keys (keySet)
for (String country : capitals.keySet()) {
    System.out.println("Country: " + country + ", Capital: " + capitals.get(country));
}

// Method 2: Iterating over Values (values)
for (String capital : capitals.values()) {
    System.out.println(capital);
}

// Method 3: Iterating over Entries (Best for Performance)
for (Map.Entry<String, String> entry : capitals.entrySet()) {
    System.out.println(entry.getKey() + " = " + entry.getValue());
}

// Method 4: Java 8 forEach (Cleanest!)
capitals.forEach((country, capital) -> System.out.println(country + " -> " + capital));
```

---

# Important Characteristics

1. **Unordered:** HashMap does NOT maintain insertion order. If you put A, B, C, it might print C, A, B. (Use `LinkedHashMap` if you need order).
2. **Null Keys:** Allows exactly ONE `null` key (and multiple `null` values).
3. **No Duplicate Keys:** If you `put()` an existing key, the old value is overwritten.

---

# How HashMap Works Internally (Advanced)

When you do `map.put("Sachin", 100)`:
1. Java takes the key ("Sachin") and passes it through a mathematical **Hash Function**.
2. This generates a **Hash Code** (an integer, e.g., 4059).
3. Java uses this number to jump directly to a specific "bucket" (index) in its internal array.
4. It places the Key and Value in that bucket.

When you do `map.get("Sachin")`:
Java hashes "Sachin", gets 4059, jumps instantly to bucket 4059, and returns the value `100`. No looping required! 

*(This is why HashMap lookups are O(1) time complexity).*

---

# 🏢 Company Example — User Session Management

```java
public class SessionManager {
    
    // Key: SessionToken (String), Value: UserID (String)
    private Map<String, String> activeSessions = new HashMap<>();

    public String login(String userId) {
        String token = "TOKEN_" + System.currentTimeMillis();
        activeSessions.put(token, userId);
        return token;
    }

    public boolean validateToken(String token) {
        return activeSessions.containsKey(token);
    }

    public String getUserId(String token) {
        // Returns null if token is invalid
        return activeSessions.get(token);
    }

    public void logout(String token) {
        activeSessions.remove(token);
        System.out.println("User logged out.");
    }
}
```

---

# Interview Questions

## Q1. What happens if two different keys generate the same Hash Code?
> This is called a **Hash Collision**. HashMap handles this by storing a `LinkedList` (or a `TreeSet` in Java 8+ if the list gets too long) inside that specific bucket. When you call `get()`, it jumps to the bucket and then searches through the small list using the `.equals()` method to find the exact key.

## Q2. Why is overriding `equals()` and `hashCode()` important when using custom objects as HashMap keys?
> Because HashMap relies entirely on `hashCode()` to find the correct bucket, and `.equals()` to identify the exact object inside that bucket. If you don't override them, Java uses memory addresses, meaning two logically identical objects (e.g., two `User` objects with ID 1) will be treated as completely different keys.

## Q3. What is the difference between HashMap and HashTable?
> `HashTable` is a legacy class from Java 1.0. It is synchronized (Thread-Safe) but very slow, and it does NOT allow null keys or values. `HashMap` is modern, fast, not synchronized, and allows one null key.

---

# Professional Summary

```
HashMap<K, V>:
- Implements Map interface.
- Stores data in Key-Value pairs.
- Keys must be unique. Values can be duplicated.
- Provides O(1) constant-time performance for get() and put().
- Does not maintain insertion order.
- Iteration: keySet(), values(), entrySet().
```

---

# 🧠 Memory Trick
```
List = Locker Room (Lockers 1, 2, 3, 4). You have to remember the locker number (index).
HashMap = Valet Parking. You give them a unique Ticket (Key), they instantly give you back your Car (Value).
```

---

# 🚀 Next Chapter
We'll cover **HashSet** — the perfect collection for filtering out duplicates and ensuring data uniqueness!
