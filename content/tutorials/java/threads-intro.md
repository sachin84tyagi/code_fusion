Welcome to **Java — Chapter 34: Multithreading Introduction**.

> **Multithreading allows your Java application to do multiple things simultaneously. It is the reason a web server can handle 10,000 users at the exact same time without freezing.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you are cooking dinner.
**Single-Threaded:** You boil pasta. You wait 10 minutes staring at the pot. When it's done, you start chopping tomatoes. When done, you fry the sauce. (Slow!)

**Multi-Threaded:** You put the pasta on to boil (Thread 1). While it boils, you chop tomatoes (Thread 2). While they fry, you set the table (Thread 3). (Fast and efficient!)

A Thread is just an independent path of execution in your program.

---

# Two Ways to Create a Thread

In Java, there are two ways to spin up a new thread:
1. Extending the `Thread` class.
2. Implementing the `Runnable` interface. (Preferred!)

### Approach 1: Extending `Thread`

```java
// 1. Create a class that extends Thread
class MyThread extends Thread {
    @Override
    public void run() { // The code to run in parallel goes here!
        for (int i = 1; i <= 5; i++) {
            System.out.println("Thread 1 executing: " + i);
            try { Thread.sleep(500); } catch (Exception e) {} // Pause for 0.5s
        }
    }
}

public class Main {
    public static void main(String[] args) { // main is the "Main Thread"
        MyThread t1 = new MyThread();
        
        // 2. Start the thread! (NEVER call run() directly)
        t1.start(); 
        
        // Main thread continues doing its own thing!
        for (int i = 1; i <= 5; i++) {
            System.out.println("Main Thread executing: " + i);
            try { Thread.sleep(500); } catch (Exception e) {}
        }
    }
}
/* Output (Interleaved! They run at the exact same time):
   Main Thread executing: 1
   Thread 1 executing: 1
   Thread 1 executing: 2
   Main Thread executing: 2
*/
```

---

### Approach 2: Implementing `Runnable` (Best Practice)

Because Java doesn't support multiple inheritance, extending `Thread` locks your class from extending anything else. Implementing `Runnable` keeps your class flexible!

```java
// 1. Implement Runnable
class MyTask implements Runnable {
    @Override
    public void run() {
        System.out.println("Task is running in: " + Thread.currentThread().getName());
    }
}

public class Main {
    public static void main(String[] args) {
        // 2. Pass the Runnable into a Thread object
        MyTask task = new MyTask();
        Thread t1 = new Thread(task);
        
        t1.start(); 
    }
}
```

---

# Modern Approach: Lambdas (Java 8+)

Because `Runnable` is a Functional Interface (it only has one method: `run()`), you can create a thread instantly using a Lambda expression!

```java
public class Main {
    public static void main(String[] args) {
        
        // Spin up a thread in 1 line of code!
        Thread t = new Thread(() -> {
            System.out.println("Lambda Thread running!");
        });
        
        t.start();
    }
}
```

---

# Thread Lifecycle States

A thread isn't just "running". It goes through states:
1. **NEW:** `new Thread()` created, but `start()` not called.
2. **RUNNABLE:** `start()` called. Waiting for the CPU to give it time.
3. **RUNNING:** CPU is actively executing the `run()` method.
4. **BLOCKED/WAITING:** Thread is paused (e.g., waiting for database lock, or `Thread.sleep()`).
5. **TERMINATED:** The `run()` method has finished. Thread dies and cannot be restarted.

---

# The `join()` Method

Sometimes the Main thread needs to wait for a worker thread to finish before continuing (e.g., waiting for an image download to finish before displaying it). Use `.join()`.

```java
Thread t1 = new Thread(() -> {
    try { Thread.sleep(2000); } catch(Exception e){}
    System.out.println("Download complete.");
});

t1.start();

try {
    t1.join(); // Main thread PAUSES here until t1 is completely finished!
} catch (InterruptedException e) {}

System.out.println("Displaying image...");
```

---

# 🏢 Company Example — Email Broadcaster

Imagine a system that needs to send a welcome email to 100 new users. Doing it one by one (single-threaded) would take forever.

```java
public class EmailService {
    
    public void sendEmailToUser(String email) {
        // Simulate network delay
        try { Thread.sleep(100); } catch (Exception e) {} 
        System.out.println("Email sent to " + email);
    }

    public static void main(String[] args) {
        EmailService service = new EmailService();
        List<String> newUsers = Arrays.asList("a@gmail", "b@gmail", "c@gmail");

        // Fire a new thread for EACH email. Total time is ~100ms instead of 300ms!
        for (String email : newUsers) {
            new Thread(() -> service.sendEmailToUser(email)).start();
        }
    }
}
```
*(Note: Creating raw threads like this in a real loop is bad practice. In Chapter 36, we will learn about Executors/Thread Pools to handle this professionally).*

---

# Interview Questions

## Q1. What happens if you call `run()` instead of `start()` on a Thread?
> It will NOT create a new thread. The `run()` method will simply execute synchronously on the current thread (usually the Main thread) just like a normal method call. `start()` is required to tell the JVM to spawn a new OS-level thread.

## Q2. Why is implementing `Runnable` better than extending `Thread`?
> Two reasons: 
> 1. Java does not support multiple inheritance. If you extend `Thread`, your class cannot extend any other business class. Implementing `Runnable` keeps the class hierarchy open.
> 2. It separates the "Task" (the Runnable) from the "Runner" (the Thread). This is crucial for modern Thread Pool architectures.

## Q3. What is a Daemon Thread?
> A Daemon thread is a low-priority background thread (like the Garbage Collector). If all user threads (like the Main thread) finish execution, the JVM automatically kills all running Daemon threads and exits. You can make a thread daemon by calling `t1.setDaemon(true)` before starting it.

---

# Professional Summary

```
Multithreading: Doing things in parallel.
- Creation: Implement Runnable (preferred) or extend Thread.
- Execution: MUST call .start() to spawn the thread.
- Thread.sleep(ms): Pauses the current thread.
- thread.join(): Forces the caller thread to wait until 'thread' dies.
- Lifecycle: New -> Runnable -> Running -> Blocked/Waiting -> Terminated.
```

---

# 🧠 Memory Trick
```
Thread = A kitchen worker.
start() = Telling the worker to begin their shift.
Runnable = The recipe they are told to cook.
```

---

# 🚀 Next Chapter
What happens when two threads try to modify the exact same bank account balance at the exact same time? Disaster. We'll fix it in **Synchronization**!
