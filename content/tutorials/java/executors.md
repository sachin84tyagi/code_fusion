Welcome to **Java — Chapter 36: Executors & Thread Pools**.

> **Creating a `new Thread()` for every task is a terrible idea. Threads are heavy OS resources. The modern, professional way to handle multithreading is using Thread Pools via the Executor Framework.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a Restaurant.
**The Bad Way (`new Thread()`):** Every time a customer walks in, the manager hires a brand new waiter, trains them on the spot, has them serve the customer, and then fires them when the customer leaves. (Huge waste of time and money!)

**The Good Way (Thread Pool):** The manager hires a pool of 5 permanent waiters. When a customer arrives, an idle waiter serves them. When done, the waiter goes back to the pool to wait for the next customer. (Fast and efficient!)

---

# The Problem with `new Thread()`

1. **OS Overhead:** Creating an OS thread takes significant time and memory.
2. **Out of Memory:** If 10,000 users hit your server, and you create 10,000 threads, your server will crash (`OutOfMemoryError`).
3. **Context Switching:** Too many threads fighting for CPU time slows down the whole system.

---

# The Solution: `ExecutorService` (Thread Pools)

Introduced in Java 5, the Executor framework manages a pool of worker threads for you.

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) {
        
        // 1. Create a Pool of exactly 3 permanent threads
        ExecutorService executor = Executors.newFixedThreadPool(3);

        // 2. Submit 10 tasks to the pool
        for (int i = 1; i <= 10; i++) {
            final int taskNumber = i;
            
            // Submitting a Runnable task
            executor.execute(() -> {
                System.out.println("Executing Task " + taskNumber + " by " + Thread.currentThread().getName());
                try { Thread.sleep(1000); } catch (Exception e) {} // Simulate work
            });
        }

        // 3. Gracefully shut down the executor (rejects new tasks, finishes existing ones)
        executor.shutdown(); 
    }
}
```
**Output:** You will see Tasks 1, 2, 3 executed by `pool-1-thread-1`, `thread-2`, `thread-3`. Then they will grab tasks 4, 5, 6, etc. *No more than 3 threads are ever created!*

---

# Types of Thread Pools

The `Executors` factory class provides several types of pools:

### 1. FixedThreadPool (Most Common)
`Executors.newFixedThreadPool(n)`
Maintains exactly `n` threads. If all are busy, new tasks wait in a Queue. Great for predictable workloads (e.g., DB connections).

### 2. CachedThreadPool
`Executors.newCachedThreadPool()`
Creates new threads as needed, but reuses idle ones. If a thread is idle for 60 seconds, it dies. Great for many short-lived, unpredictable tasks.

### 3. SingleThreadExecutor
`Executors.newSingleThreadExecutor()`
A pool with exactly 1 thread. Guarantees tasks execute sequentially, one after the other.

### 4. ScheduledThreadPool
`Executors.newScheduledThreadPool(n)`
Used for running tasks after a delay, or running them repeatedly (like a cron job).

```java
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
// Run task after an initial delay of 2 secs, then repeat every 5 secs
scheduler.scheduleAtFixedRate(
    () -> System.out.println("Pinging server..."), 
    2, 5, TimeUnit.SECONDS
);
```

---

# `Runnable` vs `Callable` (Getting Results)

A `Runnable` task returns `void`. What if you want your thread to calculate something and return a result?
Use **`Callable<T>`**! It has a `call()` method that returns a value and can throw exceptions.

To get the result from a Callable, you use a **`Future`**.

```java
import java.util.concurrent.*;

public class FutureExample {
    public static void main(String[] args) throws Exception {
        ExecutorService executor = Executors.newFixedThreadPool(2);

        // Submit a Callable (returns an Integer)
        Future<Integer> futureResult = executor.submit(() -> {
            System.out.println("Calculating in background...");
            Thread.sleep(2000);
            return 5 * 5; // The result
        });

        System.out.println("Main thread is free to do other things...");

        // future.get() BLOCKS the main thread until the result is ready!
        Integer result = futureResult.get(); 
        System.out.println("The result is: " + result);

        executor.shutdown();
    }
}
```

---

# 🏢 Company Example — Batch Image Processing

A backend system needs to resize 100 uploaded images. Doing it sequentially takes 100 seconds. With a Thread Pool, we do it in parallel safely!

```java
public class ImageProcessor {
    public static void main(String[] args) {
        
        // Use threads equal to the number of CPU cores for CPU-heavy tasks
        int cores = Runtime.getRuntime().availableProcessors();
        ExecutorService pool = Executors.newFixedThreadPool(cores);

        for (int i = 1; i <= 100; i++) {
            final String image = "Image_" + i + ".jpg";
            
            pool.submit(() -> {
                System.out.println("Resizing " + image + " on " + Thread.currentThread().getName());
                // Simulate CPU heavy resizing
                try { Thread.sleep(500); } catch(Exception e){} 
            });
        }
        
        pool.shutdown();
    }
}
```
*Note: In Spring Boot, you don't even write this code manually. You just annotate a method with `@Async` and Spring handles the Thread Pool under the hood!*

---

# Interview Questions

## Q1. What is the difference between `execute()` and `submit()` in ExecutorService?
> `execute()` takes a `Runnable` and returns `void`. If an exception occurs, it prints to the console.
> `submit()` can take a `Runnable` or `Callable` and returns a `Future` object. If an exception occurs, it is captured inside the `Future` and thrown when you call `future.get()`.

## Q2. What happens if you don't call `.shutdown()` on an ExecutorService?
> The ExecutorService threads are non-daemon threads. If you don't shut them down, they will stay alive waiting for new tasks, which prevents the JVM from exiting. Your program will hang forever!

## Q3. How do you size a Thread Pool?
> For **CPU-bound tasks** (heavy math, image processing), Pool Size = Number of CPU Cores.
> For **I/O-bound tasks** (Database calls, Network API calls), Pool Size can be much larger (e.g., 50-100) because threads spend most of their time blocked/waiting, not using the CPU.

---

# Professional Summary

```
Executor Framework: 
Replaces 'new Thread()'. Manages a pool of reusable threads.

- FixedThreadPool: Fixed size. Safe, predictable memory usage.
- CachedThreadPool: Grows infinitely, shrinks when idle.
- ScheduledThreadPool: For delayed or recurring tasks.

Callable & Future:
- Callable<T>: Like Runnable, but returns a value of type T.
- Future.get(): Blocks until the thread finishes and returns the Callable's result.

Always call executor.shutdown() when finished!
```

---

# 🧠 Memory Trick
```
Thread Pool = Uber Fleet.
Instead of building a new car every time you need a ride (new Thread), 
Uber has a fleet of existing cars waiting. They pick you up (execute task), 
drop you off, and wait for the next passenger.
```

---

# 🚀 Next Chapter
Phase 9 begins! We will look at **File I/O** — reading and writing data to physical files on your hard drive!
