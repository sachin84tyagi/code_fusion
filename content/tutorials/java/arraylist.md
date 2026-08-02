Welcome to **Java — Chapter 25: ArrayList**.

> **If you learn only one data structure in Java, learn ArrayList. It is the go-to solution for 90% of your array needs. It’s basically an Array that grows dynamically.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

An `ArrayList` is a stretchy Array.
If you create an array of size 3 and try to put a 4th item in it, Java gets mad and crashes.
If you use an `ArrayList`, and you put a 4th item in, the `ArrayList` secretly creates a bigger box, moves everything over, and lets you add the 4th item. 

You never have to worry about the size again!

---

# Basic Syntax & Methods

```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        
        // 1. Creation (Program to the Interface!)
        List<String> names = new ArrayList<>();

        // 2. Add elements
        names.add("Sachin");
        names.add("Rahul");
        names.add("Priya");
        names.add(1, "Amit"); // Inserts at index 1, shifts others to the right

        // 3. Access elements (Like array[0])
        System.out.println(names.get(0)); // Sachin

        // 4. Update elements (Like array[0] = "New")
        names.set(0, "Sachin Tyagi");

        // 5. Remove elements
        names.remove("Rahul"); // By value
        names.remove(2);       // By index

        // 6. Check size (Like array.length)
        System.out.println(names.size()); // 2

        // 7. Check if exists
        System.out.println(names.contains("Priya")); // false (we removed index 2)

        // 8. Clear the list
        names.clear(); // Empties the list
        System.out.println(names.isEmpty()); // true
    }
}
```

---

# Iterating over ArrayList

```java
List<Integer> numbers = new ArrayList<>();
numbers.add(10);
numbers.add(20);
numbers.add(30);

// 1. Enhanced For-Loop (Best approach!)
for (Integer num : numbers) {
    System.out.println(num);
}

// 2. Standard For-Loop (When you need the index)
for (int i = 0; i < numbers.size(); i++) {
    System.out.println("Index " + i + ": " + numbers.get(i));
}

// 3. ForEach with Lambda (Java 8+)
numbers.forEach(num -> System.out.println(num));
```

---

# How ArrayList Works Internally (Important!)

An `ArrayList` uses a standard primitive array under the hood.

1. When you create `new ArrayList<>()`, Java creates a hidden array of capacity **10**.
2. You add 10 items. It's full.
3. You add the 11th item. 
4. Java creates a NEW array that is **1.5x bigger** (capacity 15).
5. It copies the old 10 items to the new array.
6. It adds your 11th item.
7. It trashes the old array.

This process is called **Dynamic Resizing**. 
Because copying takes time, inserting millions of records one by one can be slightly slow when it resizes.

---

# Useful Utility Methods (`java.util.Collections`)

```java
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;

List<Integer> list = new ArrayList<>();
list.add(50);
list.add(10);
list.add(90);

// Sort Ascending
Collections.sort(list);
System.out.println(list); // [10, 50, 90]

// Reverse order
Collections.reverse(list);
System.out.println(list); // [90, 50, 10]

// Shuffle randomly
Collections.shuffle(list);
```

---

# 🏢 Company Example — E-Commerce Shopping Cart

```java
public class ShoppingCart {

    // Using ArrayList for the cart items
    private List<String> cartItems = new ArrayList<>();

    public void addItem(String item) {
        cartItems.add(item);
        System.out.println(item + " added to cart. Total items: " + cartItems.size());
    }

    public void removeItem(String item) {
        if (cartItems.remove(item)) {
            System.out.println(item + " removed.");
        } else {
            System.out.println(item + " not found in cart.");
        }
    }

    public void checkout() {
        if (cartItems.isEmpty()) {
            System.out.println("Cart is empty! Nothing to checkout.");
            return;
        }
        System.out.println("Checking out " + cartItems.size() + " items...");
        // Processing logic...
        cartItems.clear(); // Empty cart after successful checkout
    }
}
```
*Notice how easy this is compared to tracking a fixed-size primitive Array and a separate `count` variable!*

---

# Interview Questions

## Q1. What is the initial capacity of an ArrayList?
> The default initial capacity is **10**. When it fills up, it grows by 50% (Capacity = OldCapacity + (OldCapacity >> 1)).

## Q2. ArrayList vs Array — When to use which?
> Use a primitive Array when the size is strictly fixed and performance/memory is critical (like a matrix for a math algorithm). Use ArrayList for 99% of business logic where the amount of data fluctuates (like rows from a database or user inputs).

## Q3. Is ArrayList Thread-Safe?
> No. If multiple threads try to add/remove items from an ArrayList simultaneously, it can crash or corrupt data (`ConcurrentModificationException`). If you need thread safety, use `Collections.synchronizedList(new ArrayList<>())` or `CopyOnWriteArrayList`.

---

# Professional Summary

```
ArrayList:
- Implements List interface.
- Backed by a dynamic array.
- Ordered (Maintains insertion order).
- Allows duplicates and null values.
- Best for: Fast access/reading ( O(1) using .get(index) ).
- Worst for: Insertions/Deletions in the middle (O(n) because it has to shift all subsequent elements).

Key Methods: .add(), .get(index), .set(index, value), .remove(), .size(), .clear()
```

---

# 🧠 Memory Trick
```
Array     = Buying a house with 3 rooms. (Can't add a 4th room).
ArrayList = Renting an apartment. If you get more roommates, the landlord just moves you to a bigger apartment automatically.
```

---

# 🚀 Next Chapter
We'll learn about **LinkedList** — the sibling of ArrayList. When ArrayList struggles with speed, LinkedList comes to the rescue!
