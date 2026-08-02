Welcome to **Java — Chapter 26: LinkedList**.

> **While ArrayList is great for reading data, it is terrible for inserting or deleting data in the middle. LinkedList fixes this problem using nodes and pointers.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine an `ArrayList` as people sitting tightly next to each other on a bench. If a new person wants to sit in the middle, everyone to the right has to stand up, slide over, and sit back down. (Very slow!)

A `LinkedList` is like people holding hands in a circle. If a new person wants to join, two people just let go of each other's hands and hold the new person's hands. No one else has to move! (Very fast!)

---

# How LinkedList Works Internally

Java's LinkedList is a **Doubly-Linked List**.
Instead of an array, data is stored in individual objects called **Nodes**.

Each Node holds 3 things:
1. The Data.
2. A pointer to the Previous Node.
3. A pointer to the Next Node.

```text
[null | A | Next] <---> [Prev | B | Next] <---> [Prev | C | null]
```
Because they are just pointing to each other, inserting data means changing two pointers. Shifting elements is not required!

---

# Basic Syntax & Methods

Notice that the methods are identical to `ArrayList` because they both implement the `List` interface!

```java
import java.util.LinkedList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        
        List<String> list = new LinkedList<>();

        // Add
        list.add("Apple");
        list.add("Banana");
        list.add("Cherry");

        // Insert in middle (SUPER FAST compared to ArrayList)
        list.add(1, "Mango"); 

        // Access (SLOW compared to ArrayList)
        System.out.println(list.get(2)); 

        // Remove
        list.remove("Banana");
        
        System.out.println(list); // [Apple, Mango, Cherry]
    }
}
```

---

# LinkedList Specific Methods

Because `LinkedList` also implements the `Deque` (Double Ended Queue) interface, it has extra methods for manipulating the head and tail easily.
*(Note: To use these, the reference type must be `LinkedList`, not `List`)*.

```java
LinkedList<String> list = new LinkedList<>();
list.add("Middle");

// Add to ends
list.addFirst("Start");
list.addLast("End");

// Get from ends
System.out.println(list.getFirst()); // Start
System.out.println(list.getLast());  // End

// Remove from ends
list.removeFirst();
list.removeLast();
```

---

# ArrayList vs LinkedList (The Ultimate Showdown)

| Operation | ArrayList | LinkedList | Winner |
|-----------|-----------|------------|--------|
| **Access `.get(i)`** | **Fast O(1)** | Slow O(n) | **ArrayList** 🏆 |
| **Insert at End** | Fast O(1)* | Fast O(1) | Tie (Mostly) |
| **Insert in Middle** | Slow O(n) | **Fast O(1)** | **LinkedList** 🏆 |
| **Remove in Middle** | Slow O(n) | **Fast O(1)** | **LinkedList** 🏆 |
| **Memory Usage** | Less | More (Stores pointers) | **ArrayList** 🏆 |

*Conclusion:* Use `ArrayList` 95% of the time (because most apps just read data). Use `LinkedList` ONLY when you are doing massive amounts of insertions and deletions in the middle of a massive list.

---

# 🏢 Company Example — Browser History

A web browser's "Back" and "Forward" buttons are perfectly modeled by a Doubly LinkedList.

```java
public class BrowserHistory {
    
    private LinkedList<String> history = new LinkedList<>();
    private int currentIndex = -1;

    public void visitPage(String url) {
        // If we went back, and then visit a new page, clear the "forward" history
        while (history.size() > currentIndex + 1) {
            history.removeLast();
        }
        history.addLast(url);
        currentIndex++;
        System.out.println("Visited: " + url);
    }

    public void goBack() {
        if (currentIndex > 0) {
            currentIndex--;
            System.out.println("Going back to: " + history.get(currentIndex));
        } else {
            System.out.println("No history to go back to!");
        }
    }

    public void goForward() {
        if (currentIndex < history.size() - 1) {
            currentIndex++;
            System.out.println("Going forward to: " + history.get(currentIndex));
        } else {
            System.out.println("No history to go forward to!");
        }
    }
}
```

---

# Interview Questions

## Q1. How does LinkedList store elements in memory compared to ArrayList?
> ArrayList stores elements in contiguous (side-by-side) memory locations. LinkedList stores elements in non-contiguous memory scattered across the heap, connected by pointers.

## Q2. Why is LinkedList slower at searching / `.get(index)`?
> Because memory is non-contiguous, Java cannot mathematically calculate where index `5000` is. It has to start at the Head (index 0) and jump node-by-node 5000 times to find the data. This is O(n) time complexity. ArrayList just jumps straight there O(1).

## Q3. Which is better for a Queue implementation?
> LinkedList. Because Queues require constant removal from the front (`poll()`) and addition at the back. Removing from the front of an ArrayList forces every single element to shift left (terrible performance).

---

# Professional Summary

```
LinkedList:
- Implements List and Deque interfaces.
- Backed by a Doubly-Linked List (Nodes with Prev/Next pointers).
- Ordered, allows duplicates.
- Best for: Insertions and Deletions (O(1)).
- Worst for: Data retrieval/Searching (O(n)).

Use only when your application is write-heavy and read-light.
```

---

# 🧠 Memory Trick
```
ArrayList  = Train cars rigidly bolted together.
LinkedList = Train cars connected by chains. Easy to unhook the chain and slide a new car in!
```

---

# 🚀 Next Chapter
We'll explore **HashMap** — the undisputed king of Java Collections used for instant data lookup!
