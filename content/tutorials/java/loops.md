Welcome to **Java — Chapter 6: Loops**.

> **Loops make computers do repetitive work so you don't have to. Print 1000 lines? Process 1 million records? Loops do it in a single block of code.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a teacher says:

"Write 'I will not talk in class' 100 times."

Without loops:
```
System.out.println("I will not talk in class");
System.out.println("I will not talk in class");
// ... 98 more times 😫
```

With a loop:
```java
for (int i = 0; i < 100; i++) {
    System.out.println("I will not talk in class");
}
// 3 lines → same result ✅
```

---

# 1. for Loop — When you know the count

```java
// Syntax:
// for (initialization; condition; update) { body }

for (int i = 1; i <= 5; i++) {
    System.out.println("Count: " + i);
}
// Output: Count: 1, Count: 2, Count: 3, Count: 4, Count: 5

// Countdown
for (int i = 10; i >= 1; i--) {
    System.out.println(i);
}
// 10, 9, 8 ... 1

// Step by 2
for (int i = 0; i <= 10; i += 2) {
    System.out.println(i); // 0, 2, 4, 6, 8, 10
}

// Sum of 1 to 100
int sum = 0;
for (int i = 1; i <= 100; i++) {
    sum += i;
}
System.out.println(sum); // 5050

// Multiplication table of 5
for (int i = 1; i <= 10; i++) {
    System.out.println("5 × " + i + " = " + (5 * i));
}
```

---

# 2. while Loop — When you DON'T know the count

```java
// Syntax:
// while (condition) { body }

// Count up
int i = 1;
while (i <= 5) {
    System.out.println(i);
    i++;
}

// Read until exit
Scanner scanner = new Scanner(System.in);
String input = "";
while (!input.equals("exit")) {
    System.out.print("Enter command: ");
    input = scanner.nextLine();
    System.out.println("You typed: " + input);
}

// ATM withdrawal example
double balance = 5000.0;
while (balance > 0) {
    System.out.println("Balance: " + balance);
    balance -= 1000; // withdraw ₹1000
}
```

---

# 3. do-while Loop — Executes at Least Once

```java
// Syntax:
// do { body } while (condition);

int i = 1;
do {
    System.out.println(i);
    i++;
} while (i <= 5);

// Key difference: body runs FIRST, then checks condition
int x = 100;
do {
    System.out.println("This always runs once!"); // Prints!
} while (x < 10); // false — but body already ran

// Perfect for: Menu-driven programs
int choice;
do {
    System.out.println("1. View Balance");
    System.out.println("2. Withdraw");
    System.out.println("3. Exit");
    System.out.print("Enter choice: ");
    choice = 3; // simulated
} while (choice != 3);
```

---

# 4. Enhanced for Loop (for-each) — Collections & Arrays

```java
// Arrays
int[] numbers = {10, 20, 30, 40, 50};
for (int num : numbers) {
    System.out.println(num);
}

// String array
String[] names = {"Sachin", "Rahul", "Priya"};
for (String name : names) {
    System.out.println("Hello, " + name);
}

// ArrayList
List<String> cities = List.of("Delhi", "Mumbai", "Bangalore");
for (String city : cities) {
    System.out.println(city);
}

// Cannot modify collection during for-each
// Cannot access index in for-each (use normal for instead)
```

---

# break and continue

```java
// break — Exit the loop immediately
for (int i = 1; i <= 10; i++) {
    if (i == 5) {
        break;          // Stop loop at 5
    }
    System.out.println(i); // 1, 2, 3, 4
}

// continue — Skip current iteration, go to next
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue;       // Skip even numbers
    }
    System.out.println(i); // 1, 3, 5, 7, 9
}

// Finding first match in list
List<String> emails = List.of("a@gmail.com", "b@yahoo.com", "c@gmail.com");
String target = null;
for (String email : emails) {
    if (email.contains("yahoo")) {
        target = email;
        break; // Found! No need to continue
    }
}
```

---

# Labeled break (Nested loops)

```java
// Exit outer loop from inner loop
outer:
for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (i == 2 && j == 2) {
            break outer;  // Breaks BOTH loops
        }
        System.out.println(i + "," + j);
    }
}
```

---

# Nested Loops — 2D Patterns

```java
// Multiplication table
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= 5; j++) {
        System.out.printf("%4d", i * j);
    }
    System.out.println();
}

// Star pattern
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print("* ");
    }
    System.out.println();
}
// *
// * *
// * * *
// * * * *
// * * * * *
```

---

# Infinite Loop — Intentional

```java
// Used for servers, polling, event listeners
while (true) {
    // Check for new messages
    Message msg = queue.poll();
    if (msg != null) {
        process(msg);
    }
    Thread.sleep(100); // Wait 100ms before checking again
}

// Spring Boot app itself runs in an "infinite loop":
// Tomcat server listens forever for HTTP requests
```

---

# for vs while vs do-while

| Loop | Use When |
|------|----------|
| `for` | You know the exact number of iterations |
| `while` | Repeat while a condition is true (count unknown) |
| `do-while` | Must execute at least once |
| `for-each` | Iterating over arrays or collections |

---

# 🏢 Company Example — Amazon Order Processing

```java
@Service
public class OrderBatchProcessor {

    // Process all pending orders (for-each)
    public void processPendingOrders(List<Order> orders) {
        for (Order order : orders) {
            try {
                paymentService.charge(order);
                warehouseService.prepare(order);
                notificationService.sendConfirmation(order);
            } catch (PaymentException e) {
                log.error("Payment failed for order: {}", order.getId());
                continue; // Skip failed orders, process rest
            }
        }
    }

    // Retry logic with while loop
    public boolean retryPayment(Order order, int maxRetries) {
        int attempt = 0;
        while (attempt < maxRetries) {
            try {
                paymentService.charge(order);
                return true; // Success — exit loop
            } catch (Exception e) {
                attempt++;
                log.warn("Payment attempt {} failed", attempt);
            }
        }
        return false; // All retries exhausted
    }

    // Pagination: process in batches of 100
    public void processAllOrders() {
        int page = 0;
        int pageSize = 100;
        List<Order> batch;

        do {
            batch = orderRepository.findPending(page, pageSize);
            for (Order order : batch) {
                processOrder(order);
            }
            page++;
        } while (!batch.isEmpty());
    }
}
```

---

# Interview Questions

## Q1. What is the difference between `for`, `while`, and `do-while` loops?

**Best Answer**
> `for` loop is best when the number of iterations is known in advance. `while` loop runs as long as a condition is true — the condition is checked before each iteration. `do-while` is similar to `while` but the body executes at least once because the condition is checked AFTER the body.

---

## Q2. What is the difference between `break` and `continue`?

> `break` immediately exits the entire loop. `continue` skips the rest of the current iteration and jumps to the next iteration. `break` is used to stop when a condition is met; `continue` is used to skip certain iterations.

---

## Q3. Can you modify a collection inside a for-each loop?

> No. Modifying a collection while iterating with for-each throws `ConcurrentModificationException`. To safely remove elements during iteration, use an explicit `Iterator` and `iterator.remove()`, or use `removeIf()` (Java 8+).

---

# Professional Summary

```
Loop Types:
  for (int i=0; i<n; i++) {}     // Known count
  while (condition) {}            // Unknown count
  do { } while (condition);       // At least once
  for (T item : collection) {}    // Arrays/Collections

Control:
  break    → Exit loop completely
  continue → Skip to next iteration

Common Patterns:
  Sum:      sum += i;
  Search:   if (found) break;
  Filter:   if (skip) continue;
  Batch:    do { page++ } while(!empty)
  Retry:    while (attempt < max) { try/catch; attempt++ }
```

---

# 🧠 Memory Trick

```
Loops = Washing Machine Cycles

for       = Set timer for 30 min (known duration)
while     = Keep washing UNTIL clothes are clean (unknown)
do-while  = Start washing, check if done after each cycle
for-each  = Take each cloth out one by one

break    = Emergency stop button
continue = Skip this item, take next cloth
```

---

# 🚀 Next Chapter

We'll learn **Arrays** — the first data structure in Java, which stores multiple values of the same type in a single variable.
