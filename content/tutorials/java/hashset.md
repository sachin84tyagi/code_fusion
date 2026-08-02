Welcome to **Java — Chapter 28: HashSet**.

> **HashSet is the "Bouncer" of the Java Collections Framework. Its only job is to ensure that absolutely NO duplicates enter the collection.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a VIP Guest List for a party.

If "Sachin" is on the list, and someone tries to add "Sachin" again, the list says: "He is already here, ignore!"

A `List` would let "Sachin" enter 10 times.
A `Set` ensures "Sachin" only enters once. 

---

# Basic Syntax & Methods

```java
import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        
        // 1. Creation
        Set<String> uniqueNames = new HashSet<>();

        // 2. Add elements
        uniqueNames.add("Sachin");
        uniqueNames.add("Rahul");
        
        // Trying to add duplicates!
        boolean added1 = uniqueNames.add("Sachin"); // Returns false! Already exists.
        boolean added2 = uniqueNames.add("Priya");  // Returns true!

        System.out.println("Was second Sachin added? " + added1); // false

        // 3. Print Set (Notice: No duplicates, and order is random!)
        System.out.println(uniqueNames); // [Rahul, Sachin, Priya]

        // 4. Check existence (Super Fast!)
        System.out.println(uniqueNames.contains("Rahul")); // true

        // 5. Remove element
        uniqueNames.remove("Rahul");

        // 6. Size
        System.out.println(uniqueNames.size()); // 2
    }
}
```

---

# Important Characteristics

1. **NO Duplicates:** It simply ignores duplicate entries.
2. **Unordered:** Just like HashMap, it does not guarantee the order of elements.
3. **No Indexing:** You CANNOT do `set.get(0)`. There are no indexes! You must use a `for-each` loop or an `Iterator` to read values.
4. **Nulls:** Allows a maximum of ONE `null` value.

---

# How HashSet Works Internally (The Secret)

This is a favorite interview question: **HashSet is actually just a HashMap in disguise!**

When you write `set.add("Sachin")`, Java secretly creates a `HashMap`. 
It uses your data ("Sachin") as the **Key** in the HashMap, and puts a dummy constant object as the **Value**.

Because HashMaps do not allow duplicate *Keys*, HashSet automatically gets its duplicate-preventing superpower for free!

---

# TreeSet & LinkedHashSet

If you need unique elements BUT you also care about order, Java provides two alternatives:

1. **LinkedHashSet:** Maintains **Insertion Order**.
   ```java
   Set<String> s = new LinkedHashSet<>();
   s.add("Z"); s.add("A"); s.add("M");
   // Prints: [Z, A, M]
   ```

2. **TreeSet:** Automatically **Sorts** the elements. (Slower performance, O(log n)).
   ```java
   Set<String> s = new TreeSet<>();
   s.add("Z"); s.add("A"); s.add("M");
   // Prints: [A, M, Z] (Alphabetical)
   ```

---

# 🏢 Company Example — Removing Duplicate Emails

A very common real-world task: You have a database dump of user emails, but there are thousands of duplicates. How do you clean it?

```java
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class EmailCleaner {
    public static void main(String[] args) {
        
        // 1. Messy List with duplicates
        List<String> rawEmails = new ArrayList<>();
        rawEmails.add("sachin@gmail.com");
        rawEmails.add("rahul@yahoo.com");
        rawEmails.add("sachin@gmail.com"); // Duplicate
        rawEmails.add("priya@hotmail.com");
        rawEmails.add("rahul@yahoo.com");  // Duplicate

        System.out.println("Raw count: " + rawEmails.size()); // 5

        // 2. The Magic Trick: Pass List into HashSet constructor!
        Set<String> cleanEmails = new HashSet<>(rawEmails);

        System.out.println("Clean count: " + cleanEmails.size()); // 3
        System.out.println(cleanEmails); 
        // [sachin@gmail.com, priya@hotmail.com, rahul@yahoo.com]
    }
}
```

---

# Interview Questions

## Q1. Why does HashSet not have a `get(index)` method?
> Because a HashSet does not maintain insertion order and uses mathematical hashing to scatter elements in memory. Therefore, the concept of an "index" or a "position" does not exist in a Set.

## Q2. What is the difference between HashSet and TreeSet?
> `HashSet` is backed by a HashMap, is unordered, allows one null, and is extremely fast (O(1) for add/contains). 
> `TreeSet` is backed by a TreeMap, automatically sorts elements (ascending), does NOT allow nulls, and is slower (O(log n)).

## Q3. How do you find the union and intersection of two Sets?
> Using built-in methods!
> **Union:** `set1.addAll(set2)` (Combines both, ignoring duplicates)
> **Intersection:** `set1.retainAll(set2)` (Keeps only elements present in both sets)

---

# Professional Summary

```
HashSet:
- Implements Set interface.
- Prevents duplicate elements.
- Backed by a HashMap internally.
- Does NOT guarantee insertion order.
- No index-based access.
- O(1) performance for add, remove, and contains operations.

Alternatives: LinkedHashSet (maintains order), TreeSet (sorts automatically).
```

---

# 🧠 Memory Trick
```
List = A Journal. You can write the same thought twice on different pages.
Set  = A Dictionary. A word only appears once, no matter how hard you try to add it again.
```

---

# 🚀 Next Chapter
Welcome to Phase 6! We are entering Modern Java (Java 8+). Get ready to learn **Lambda Expressions** — the feature that completely transformed how Java code is written!
