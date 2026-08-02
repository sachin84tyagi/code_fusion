Welcome to **Java — Chapter 35: Thread Synchronization**.

> **When multiple threads access and modify the same data at the same time, data corruption occurs. Synchronization acts as a lock, ensuring only one thread can access the critical data at a time.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a tiny bathroom with only one toilet, but two people (Threads) need to use it at the exact same time. If they both rush in together, it's a disaster (Data Corruption / Race Condition).

**Solution:** A Door Lock. 
Person A enters and locks the door (`synchronized`). 
Person B must wait outside (Blocked). 
When Person A finishes and unlocks the door, Person B can enter.

---

# The Problem: Race Condition

Let's look at a Bank Account without synchronization.

```java
class BankAccount {
    int balance = 100;

    // A method to withdraw money
    public void withdraw(int amount) {
        if (balance >= amount) {
            System.out.println(Thread.currentThread().getName() + " is withdrawing...");
            // Simulate network delay
            try { Thread.sleep(100); } catch(Exception e) {}
            balance -= amount;
            System.out.println("Withdrawal complete. Remaining: " + balance);
        } else {
            System.out.println("Not enough money for " + Thread.currentThread().getName());
        }
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount sharedAccount = new BankAccount();

        // Thread 1: Husband tries to withdraw 100
        Thread husband = new Thread(() -> sharedAccount.withdraw(100), "Husband");
        // Thread 2: Wife tries to withdraw 100 at the EXACT SAME TIME
        Thread wife = new Thread(() -> sharedAccount.withdraw(100), "Wife");

        husband.start();
        wife.start();
    }
}
/* DISASTER OUTPUT:
   Husband is withdrawing...
   Wife is withdrawing...
   Withdrawal complete. Remaining: 0
   Withdrawal complete. Remaining: -100   <-- Negative balance! The bank is ruined!
*/
```
**Why did this happen?** Both threads passed the `if (balance >= 100)` check simultaneously before either of them subtracted the amount!

---

# The Solution: `synchronized` Method

By adding the `synchronized` keyword to the method, we put a "lock" on the `BankAccount` object. 
If Husband is inside the method, Wife MUST wait until Husband is completely finished.

```java
class BankAccount {
    int balance = 100;

    // LOCK APPLIED! Only one thread allowed in at a time.
    public synchronized void withdraw(int amount) {
        if (balance >= amount) {
            System.out.println(Thread.currentThread().getName() + " is withdrawing...");
            try { Thread.sleep(100); } catch(Exception e) {}
            balance -= amount;
            System.out.println("Withdrawal complete. Remaining: " + balance);
        } else {
            System.out.println("Not enough money for " + Thread.currentThread().getName());
        }
    }
}
/* SAFE OUTPUT:
   Husband is withdrawing...
   Withdrawal complete. Remaining: 0
   Not enough money for Wife        <-- Wife was blocked until Husband finished, then balance was 0!
*/
```

---

# Synchronized Blocks (Finer Control)

Synchronizing a whole method can slow down your app (if the method has 1000 lines of code, other threads wait forever). 
You can synchronize just the *critical* lines of code using a `synchronized` block.

```java
public void processTransaction(int amount) {
    System.out.println("Doing non-critical setup tasks..."); // Multiple threads can run this simultaneously

    // Lock ONLY the critical modification part
    // 'this' refers to the object being locked (the lock is on the specific BankAccount object)
    synchronized (this) {
        if (balance >= amount) {
            balance -= amount;
        }
    }

    System.out.println("Doing non-critical cleanup tasks...");
}
```

---

# Static Synchronization

If a method is `static`, there is no `this` object to lock! Instead, Java locks the **Class** itself (`BankAccount.class`). This ensures that across ALL objects of that class, only one thread can access the static synchronized method.

```java
public static synchronized void updateGlobalCounter() {
    // Locks the entire Class. 
}
```

---

# 🏢 Company Example — Ticket Booking System

BookMyShow (Movie Tickets) faces massive concurrency when a blockbuster releases. Multiple users try to book Seat A1 at the exact same millisecond.

```java
public class Theatre {
    private int availableSeats = 1;

    // MUST be synchronized, or two people get the same seat!
    public synchronized boolean bookSeat(String user) {
        if (availableSeats > 0) {
            System.out.println(user + " is booking the seat...");
            try { Thread.sleep(50); } catch (Exception e) {} // Simulating DB write
            availableSeats--;
            System.out.println("Booking confirmed for " + user);
            return true;
        } else {
            System.out.println("Seat Sold Out for " + user);
            return false;
        }
    }
}

public class App {
    public static void main(String[] args) {
        Theatre inox = new Theatre();

        Thread user1 = new Thread(() -> inox.bookSeat("Sachin"));
        Thread user2 = new Thread(() -> inox.bookSeat("Rahul"));

        user1.start();
        user2.start(); 
        // Result: One gets confirmed, the other gets Sold Out. Safe!
    }
}
```

---

# Deadlock (The Danger of Locks)

If Thread A holds Lock 1 and waits for Lock 2, while Thread B holds Lock 2 and waits for Lock 1, they will wait forever. This is a **Deadlock**. 

**Prevention:** Always acquire locks in the same order across all threads.

---

# Interview Questions

## Q1. What is a Race Condition?
> A race condition occurs when multiple threads access and modify shared data concurrently, and the final outcome depends on the unpredictable timing (scheduling) of those threads.

## Q2. What is the difference between a synchronized method and a synchronized block?
> A synchronized method locks the entire method (using `this` as the lock object). A synchronized block allows you to lock only a specific subset of code, and you can specify exactly which object acts as the lock. Blocks provide finer granularity and better performance.

## Q3. What is Deadlock?
> Deadlock is a situation where two or more threads are blocked forever, each waiting for a lock that the other thread holds. It causes the application to freeze entirely.

---

# Professional Summary

```
Synchronization: Ensures Thread Safety.
- synchronized method: Locks the object ('this') during method execution.
- synchronized block: Locks a specific object for a specific block of code (better performance).
- static synchronized: Locks the Class object (ClassName.class).
- Deadlock: Infinite waiting scenario. Prevent by ordering locks carefully.

Rule: ONLY synchronize the absolute minimum code necessary that modifies shared mutable state. Reading data doesn't usually need locks.
```

---

# 🧠 Memory Trick
```
synchronized = The Bathroom Key.
Whoever holds the key gets to do their business. Everyone else waits in line.
```

---

# 🚀 Next Chapter
Manually creating `new Thread()` is highly inefficient. Professional developers use **Executors and Thread Pools** to manage threads. Let's learn how!
