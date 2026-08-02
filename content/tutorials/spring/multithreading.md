Welcome to **Chapter 6 — Multithreading Basics**.

> **Multithreading lets Java do multiple things at the same time. Spring's @Async, @Scheduled, and WebSocket all run on threads under the hood. Understand the foundation first.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a restaurant kitchen.

**Single Thread (one cook):**

```
Cook chops vegetables → then boils water → then fries paneer
Each task WAITS for previous one to finish
Total time = 5 + 10 + 8 = 23 minutes
```

**Multithreading (multiple cooks):**

```
Cook 1 → chops vegetables (5 min)
Cook 2 → boils water simultaneously (10 min)
Cook 3 → fries paneer simultaneously (8 min)
Total time = 10 minutes (longest task)
```

**Thread = One cook doing one task.**

Multiple threads = Multiple cooks working at same time.

---

# What is a Thread?

A **Thread** is the smallest unit of execution in Java.

```
JVM Process (Your Spring Boot App)
├── Main Thread        → Handles HTTP requests
├── Thread-1           → Sends email in background
├── Thread-2           → Processes payment
├── Thread-3           → Generates report
└── Scheduled Thread   → Runs cron jobs
```

Every Java program starts with **one main thread**.

Multithreading creates additional threads to run tasks in parallel.

---

# Thread States

```
NEW → RUNNABLE → RUNNING → BLOCKED/WAITING → TERMINATED

NEW:       Thread created, not started
RUNNABLE:  Ready to run, waiting for CPU
RUNNING:   Actually executing
BLOCKED:   Waiting for a lock
WAITING:   Waiting for notify/signal
TIMED_WAITING: Waiting for fixed time (sleep)
TERMINATED: Finished execution
```

---

# Creating Threads — 3 Ways

## Way 1: Extend Thread class

```java
public class EmailSenderThread extends Thread {

    private final String recipient;

    public EmailSenderThread(String recipient) {
        this.recipient = recipient;
    }

    @Override
    public void run() {
        // This runs in a new thread
        System.out.println("Sending email to: " + recipient +
            " on thread: " + Thread.currentThread().getName());
        // ... email sending logic
    }
}

// Usage
EmailSenderThread thread = new EmailSenderThread("sachin@example.com");
thread.start(); // Start the new thread
// DON'T call thread.run() — that runs on current thread!
```

---

## Way 2: Implement Runnable (Preferred)

```java
public class ReportGenerator implements Runnable {

    private final String reportType;

    public ReportGenerator(String reportType) {
        this.reportType = reportType;
    }

    @Override
    public void run() {
        System.out.println("Generating " + reportType + " report...");
        // ... heavy computation
    }
}

// Usage
Runnable task = new ReportGenerator("SALES");
Thread thread = new Thread(task);
thread.start();

// Lambda shorthand
Thread thread2 = new Thread(() -> System.out.println("Quick task!"));
thread2.start();
```

---

## Way 3: ExecutorService — Thread Pool (Production Way)

```java
// Don't create threads manually in production!
// Use a thread pool instead.

ExecutorService executor = Executors.newFixedThreadPool(5); // 5 threads

// Submit tasks
executor.submit(() -> sendEmail("sachin@example.com"));
executor.submit(() -> generateReport("SALES"));
executor.submit(() -> processPayment(orderId));

// Shutdown gracefully
executor.shutdown(); // Wait for running tasks
// or
executor.shutdownNow(); // Cancel all tasks
```

---

# Thread Pool Types

```java
// Fixed pool — exact number of threads
ExecutorService fixed = Executors.newFixedThreadPool(5);

// Single thread — sequential execution
ExecutorService single = Executors.newSingleThreadExecutor();

// Cached — creates threads as needed, reuses idle ones
ExecutorService cached = Executors.newCachedThreadPool();

// Scheduled — for delayed/repeated tasks
ScheduledExecutorService scheduled = Executors.newScheduledThreadPool(3);
```

---

# Thread Safety — The Problem

When multiple threads access shared data — **race conditions** happen:

```java
// DANGEROUS — Not thread safe!
public class Counter {
    private int count = 0; // Shared state

    public void increment() {
        count++; // NOT atomic! Read → Modify → Write (3 steps)
    }

    public int getCount() { return count; }
}

Counter counter = new Counter();

// Thread 1 and Thread 2 both do counter.increment() simultaneously
// Thread 1 reads count = 0
// Thread 2 reads count = 0 (before Thread 1 wrote!)
// Thread 1 writes count = 1
// Thread 2 writes count = 1
// RESULT: count = 1 instead of 2!
```

---

# synchronized — Thread Safety Solution

```java
// Solution 1: synchronized method
public class SafeCounter {
    private int count = 0;

    // Only ONE thread can execute this at a time
    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() { return count; }
}

// Solution 2: synchronized block (more precise)
public class SafeCounter2 {
    private int count = 0;
    private final Object lock = new Object();

    public void increment() {
        synchronized (lock) {
            count++; // Only this block is locked
        }
        // Other code runs normally
    }
}

// Solution 3: AtomicInteger (best for simple counters)
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCounter {
    private AtomicInteger count = new AtomicInteger(0);

    public void increment() {
        count.incrementAndGet(); // Thread-safe, no lock needed
    }

    public int getCount() { return count.get(); }
}
```

---

# volatile — Visibility

```java
public class StatusChecker {
    // volatile ensures all threads see the latest value
    private volatile boolean running = true;

    public void stop() {
        running = false; // Immediately visible to all threads
    }

    public void run() {
        while (running) {
            // Without volatile, thread might cache old value!
            doWork();
        }
    }
}
```

---

# CompletableFuture — Modern Async (Java 8+)

```java
// Run task async and get result later
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    // Runs in ForkJoinPool background thread
    Thread.sleep(2000);
    return "Report generated";
});

// Do other work while task runs...
System.out.println("Working on other stuff...");

// Get result (blocks until done)
String result = future.get(); // "Report generated"

// Chain operations
CompletableFuture<String> chain = CompletableFuture
    .supplyAsync(() -> fetchData())      // async: fetch data
    .thenApply(data -> processData(data))  // transform result
    .thenApply(result -> formatResult(result)); // format

// Run multiple tasks in parallel
CompletableFuture<String> emailFuture = CompletableFuture.supplyAsync(() -> sendEmail());
CompletableFuture<String> smsFuture = CompletableFuture.supplyAsync(() -> sendSMS());

// Wait for ALL to complete
CompletableFuture.allOf(emailFuture, smsFuture).join();

// Wait for FIRST to complete
CompletableFuture.anyOf(emailFuture, smsFuture).join();
```

---

# ThreadLocal — Per-Thread Storage

```java
// Each thread gets its own copy of the value
public class RequestContext {
    private static final ThreadLocal<String> userId = new ThreadLocal<>();

    public static void setUserId(String id) {
        userId.set(id);
    }

    public static String getUserId() {
        return userId.get();
    }

    public static void clear() {
        userId.remove(); // IMPORTANT: Clean up!
    }
}

// Used in Spring Security internally for SecurityContext
// Each HTTP request thread has its own security context
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
// getContext() uses ThreadLocal internally!
```

---

# Deadlock — The Danger

Two threads waiting for each other forever:

```java
// DEADLOCK EXAMPLE
Object lockA = new Object();
Object lockB = new Object();

// Thread 1: Locks A, then tries to lock B
Thread t1 = new Thread(() -> {
    synchronized (lockA) {
        System.out.println("Thread 1: Holding A, waiting for B");
        synchronized (lockB) { // Waits forever!
            System.out.println("Thread 1: Got B");
        }
    }
});

// Thread 2: Locks B, then tries to lock A
Thread t2 = new Thread(() -> {
    synchronized (lockB) {
        System.out.println("Thread 2: Holding B, waiting for A");
        synchronized (lockA) { // Waits forever!
            System.out.println("Thread 2: Got A");
        }
    }
});

t1.start();
t2.start();
// DEADLOCK! Both wait forever.

// FIX: Always acquire locks in the SAME order
```

---

# How Spring Uses Threads

```java
// @Async uses ExecutorService internally
@Async("emailExecutor") // Uses configured ThreadPoolTaskExecutor
public void sendWelcomeEmail(String email) {
    // Runs in emailExecutor's thread pool
}

// @Scheduled uses ScheduledThreadPoolExecutor internally
@Scheduled(fixedRate = 5000)
public void checkInventory() {
    // Runs in scheduler thread
}

// Tomcat (embedded server) uses thread pool for HTTP
// Each HTTP request gets its own thread from Tomcat's pool
// Spring Security's ThreadLocal stores auth per request thread

// WebSocket uses NIO threads for connections

// You configure Spring's executor:
@Bean
public Executor taskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(5);     // Min threads
    executor.setMaxPoolSize(20);     // Max threads
    executor.setQueueCapacity(100);  // Queue before rejection
    return executor;
}
```

---

# Common Thread Problems

| Problem | Cause | Solution |
|---|---|---|
| Race Condition | Multiple threads modify shared data | `synchronized`, `AtomicInteger` |
| Deadlock | Two threads wait for each other | Consistent lock ordering, timeouts |
| Starvation | Thread never gets CPU | Fair locks, priority tuning |
| Livelock | Threads keep changing state | Randomize retry timing |
| Memory Leak | ThreadLocal not cleaned | Always call `remove()` |

---

# Company Example — Zomato Parallel Processing

```java
@Service
public class OrderProcessingService {

    private final ExecutorService executor = Executors.newFixedThreadPool(10);

    public void processOrderBatch(List<Order> orders) {
        // Process all orders in parallel
        List<CompletableFuture<Void>> futures = orders.stream()
            .map(order -> CompletableFuture.runAsync(() -> {
                try {
                    paymentService.charge(order);
                    restaurantService.notify(order);
                    notificationService.sendConfirmation(order);
                } catch (Exception e) {
                    log.error("Order processing failed: {}", order.getId(), e);
                }
            }, executor))
            .collect(Collectors.toList());

        // Wait for all to complete
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        log.info("Batch of {} orders processed", orders.size());
    }

    // AtomicInteger for concurrent order counter
    private AtomicInteger activeOrders = new AtomicInteger(0);

    public void startOrder(Order order) {
        activeOrders.incrementAndGet();
    }

    public void completeOrder(Order order) {
        activeOrders.decrementAndGet();
    }

    public int getActiveOrderCount() {
        return activeOrders.get();
    }
}
```

---

# Interview Questions

## Q1. What is the difference between Thread and Runnable?

**Best Answer**
> `Thread` is a class that represents a thread of execution. `Runnable` is a functional interface with one method `run()`. Implementing `Runnable` is preferred because Java doesn't support multiple inheritance — implementing `Runnable` allows your class to extend another class.

---

## Q2. What is the difference between `start()` and `run()`?

`start()` creates a new thread and executes `run()` in that new thread. Calling `run()` directly just executes the method on the current thread — no new thread is created.

---

## Q3. What is a thread pool?

A pool of pre-created threads waiting to execute tasks. Instead of creating and destroying threads for every task (expensive), tasks are queued and executed by available threads. `ExecutorService` provides thread pool management.

---

## Q4. What is the difference between synchronized method and synchronized block?

A synchronized method locks the entire object for the duration of the method. A synchronized block locks only the specified object for just the critical section — more precise, better performance.

---

## Q5. What is CompletableFuture?

A `Future` implementation that supports chaining asynchronous operations, combining multiple async tasks, and handling exceptions. It's non-blocking — you can attach callbacks that run when the result is ready.

---

# Professional Summary

```
Thread creation:
  extends Thread → override run()
  implements Runnable → override run()
  Lambda → () -> { task }

Thread pool (production):
  ExecutorService = Executors.newFixedThreadPool(n)
  submit(task) → executes in pool
  shutdown()   → graceful stop

Thread safety:
  synchronized method/block → mutual exclusion
  AtomicInteger, AtomicLong → lock-free
  volatile                  → visibility

Modern async:
  CompletableFuture.supplyAsync(() -> task)
  .thenApply(result -> transform)
  CompletableFuture.allOf(f1, f2).join()

Spring mapping:
  @Async → executor.submit()
  @Scheduled → scheduledExecutor
  SecurityContext → ThreadLocal
```

---

# 🧠 Memory Trick

```
Threads = Workers in a factory

Factory (JVM)
  ├── Worker 1 → assembles product (Main Thread)
  ├── Worker 2 → paints it (@Async email)
  ├── Worker 3 → packages it (@Async notification)
  └── Supervisor → checks hourly (@Scheduled)

synchronized = Only 1 worker at the machine at a time
AtomicInteger = Digital counter all workers read correctly
ThreadLocal   = Each worker's personal notebook
ExecutorService = Worker hiring office (hires on demand)
```

---

# 🚀 Next Chapter

We'll learn **SQL Basics** — the language that talks to databases. Mandatory before JPA.
