Welcome to **Chapter 38 — @Scheduled & Task Scheduling**.

> **@Scheduled turns your Spring Boot app into a job scheduler. From sending daily reports to clearing old data — all automated, no external tools needed.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a cleaning service for your home.

```
Every Monday 8AM  → Clean living room
Every day midnight → Take out trash
Every 30 minutes   → Check mailbox
First of every month → Pay rent
```

These are scheduled tasks.

You set them once. They run automatically.

**@Scheduled** is Spring's alarm clock.

---

# Enabling Scheduling

```java
@SpringBootApplication
@EnableScheduling // Must enable scheduling
public class MyApp { }
```

---

# @Scheduled Options

| Attribute | Description |
| --- | --- |
| `fixedRate` | Run every N ms (from start of previous) |
| `fixedDelay` | Run every N ms (from end of previous) |
| `initialDelay` | Wait N ms before first run |
| `cron` | Cron expression |

---

# fixedRate vs fixedDelay

```
fixedRate = 1000ms (every 1 second from START of previous)
  Task 1 starts at 0s, takes 3s
  Task 2 starts at 1s regardless (can overlap!)

fixedDelay = 1000ms (every 1 second from END of previous)
  Task 1 starts at 0s, takes 3s, ends at 3s
  Task 2 starts at 4s (3s + 1s delay)
```

---

# Basic Examples

```java
@Service
public class ScheduledTasks {

    // Run every 5 seconds
    @Scheduled(fixedRate = 5000)
    public void checkPaymentStatus() {
        System.out.println("Checking payment status...");
    }

    // Run 1 second after previous finishes
    @Scheduled(fixedDelay = 1000)
    public void processQueue() {
        System.out.println("Processing queue...");
    }

    // Wait 10 seconds before first run, then every 5 seconds
    @Scheduled(initialDelay = 10000, fixedRate = 5000)
    public void warmupTask() {
        System.out.println("Running after warmup...");
    }
}
```

---

# Cron Expressions

```
Second Minute Hour DayOfMonth Month DayOfWeek
  *      *     *       *       *        *
```

| Expression | Meaning |
| --- | --- |
| `0 0 * * * *` | Every hour |
| `0 0 9 * * MON-FRI` | 9 AM weekdays |
| `0 0 0 * * *` | Midnight every day |
| `0 0 12 * * *` | Noon every day |
| `0 */30 * * * *` | Every 30 minutes |
| `0 0 0 1 * *` | First of every month |
| `0 0 8 ? * MON` | 8 AM every Monday |
| `0 0 9,17 * * MON-FRI` | 9 AM and 5 PM weekdays |

---

# Real Scheduled Tasks

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledJobService {

    private final OrderRepository orderRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final CacheManager cacheManager;

    // Send daily sales report at 9 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void sendDailySalesReport() {
        log.info("Generating daily sales report...");
        SalesReport report = generateReport();
        emailService.sendReportToManagement(report);
        log.info("Daily sales report sent");
    }

    // Clear expired sessions every hour
    @Scheduled(cron = "0 0 * * * *")
    public void clearExpiredSessions() {
        log.info("Clearing expired sessions...");
        int deleted = sessionRepository.deleteExpiredBefore(LocalDateTime.now());
        log.info("Cleared {} expired sessions", deleted);
    }

    // Check pending orders every 30 minutes
    @Scheduled(cron = "0 */30 * * * *")
    public void checkPendingOrders() {
        List<Order> stuckOrders = orderRepository.findPendingOlderThan(
            LocalDateTime.now().minusHours(2)
        );

        if (!stuckOrders.isEmpty()) {
            log.warn("Found {} stuck orders", stuckOrders.size());
            stuckOrders.forEach(order -> {
                order.setStatus(OrderStatus.FAILED);
                orderRepository.save(order);
                emailService.notifyOrderFailed(order);
            });
        }
    }

    // Send birthday emails at 8 AM
    @Scheduled(cron = "0 0 8 * * *")
    public void sendBirthdayEmails() {
        LocalDate today = LocalDate.now();
        List<User> birthdayUsers = userRepository.findByBirthday(today.getMonth(), today.getDayOfMonth());
        birthdayUsers.forEach(user -> emailService.sendBirthdayEmail(user));
        log.info("Sent {} birthday emails", birthdayUsers.size());
    }

    // Clear cache at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void clearAllCaches() {
        cacheManager.getCacheNames().forEach(name ->
            Objects.requireNonNull(cacheManager.getCache(name)).clear()
        );
        log.info("All caches cleared at midnight");
    }
}
```

---

# Externalize Cron Expressions

Don't hardcode cron expressions — use properties:

```properties
scheduling.jobs.daily-report=0 0 9 * * *
scheduling.jobs.clear-cache=0 0 0 * * *
scheduling.jobs.check-orders=0 */30 * * * *
```

```java
@Scheduled(cron = "${scheduling.jobs.daily-report}")
public void sendDailySalesReport() { }

@Scheduled(cron = "${scheduling.jobs.clear-cache}")
public void clearAllCaches() { }
```

Now you can change schedule without code change!

---

# Concurrent Execution

By default, scheduled tasks run in a **single thread** — they don't overlap.

Configure a thread pool for concurrent execution:

```java
@Configuration
@EnableScheduling
public class SchedulingConfig implements SchedulingConfigurer {

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(10);                    // 10 concurrent scheduled tasks
        scheduler.setThreadNamePrefix("scheduler-");
        scheduler.initialize();
        taskRegistrar.setTaskScheduler(scheduler);
    }
}
```

---

# Programmatic Scheduling (Dynamic)

Schedule tasks at runtime:

```java
@Service
@RequiredArgsConstructor
public class DynamicScheduler {

    private final TaskScheduler taskScheduler;
    private final Map<String, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    public void schedule(String taskId, Runnable task, String cronExpression) {
        CronTrigger trigger = new CronTrigger(cronExpression);
        ScheduledFuture<?> future = taskScheduler.schedule(task, trigger);
        scheduledTasks.put(taskId, future);
    }

    public void cancel(String taskId) {
        ScheduledFuture<?> future = scheduledTasks.get(taskId);
        if (future != null) {
            future.cancel(false);
            scheduledTasks.remove(taskId);
        }
    }
}
```

---

# Company Example — Zepto Grocery

```java
@Service
@Slf4j
public class ZeptoScheduler {

    // Update product availability every 2 minutes (inventory sync)
    @Scheduled(fixedRate = 120_000)
    public void syncInventory() {
        List<Product> products = inventoryService.getChangedProducts();
        products.forEach(p -> {
            catalogService.updateAvailability(p.getId(), p.getStock() > 0);
        });
        log.info("Inventory synced: {} products updated", products.size());
    }

    // Send reminders for abandoned carts at 6 PM
    @Scheduled(cron = "0 0 18 * * *")
    public void sendAbandonedCartReminders() {
        List<Cart> abandonedCarts = cartService.findAbandonedCarts(2); // 2 hours
        abandonedCarts.forEach(cart ->
            notificationService.sendAbandonedCartReminder(cart.getUserId())
        );
        log.info("Sent {} cart reminders", abandonedCarts.size());
    }

    // Generate hourly analytics
    @Scheduled(cron = "0 0 * * * *")
    public void generateHourlyAnalytics() {
        AnalyticsReport report = analyticsService.generate(LocalDateTime.now().minusHours(1));
        analyticsRepository.save(report);
    }

    // Close dark stores at 11 PM
    @Scheduled(cron = "0 0 23 * * *")
    public void closeDarkStores() {
        storeService.closeAllDarkStores();
        log.info("All dark stores closed for the night");
    }
}
```

---

# Interview Questions

## Q1. What is @Scheduled?

**Best Answer**

> `@Scheduled` marks a method to run automatically at a specified time or interval. Spring's task scheduler executes it based on `fixedRate`, `fixedDelay`, or a cron expression. `@EnableScheduling` must be on a configuration class.

---

## Q2. What is the difference between fixedRate and fixedDelay?

`fixedRate` schedules the task at a fixed interval from the START of the previous execution (can overlap if execution takes longer). `fixedDelay` waits the specified delay from the END of the previous execution (tasks never overlap).

---

## Q3. What is a cron expression?

A string of 6 fields (second, minute, hour, day-of-month, month, day-of-week) defining when to execute a task. Example: `"0 0 9 * * MON-FRI"` = 9 AM Monday through Friday.

---

## Q4. Can multiple scheduled tasks run concurrently?

By default, no. Spring uses a single thread. Configure `ThreadPoolTaskScheduler` or use `@Async` on the scheduled method with an async executor to allow parallel execution.

---

## Q5. How do you make cron expressions configurable without recompiling?

Use property references: `@Scheduled(cron = "${scheduling.job.cron}")`. Define the value in `application.properties`. Change the schedule by updating the property file or environment variable.

---

# Professional Summary

```
@EnableScheduling  → on @SpringBootApplication

@Scheduled options:
  fixedRate = 5000          → every 5s from start
  fixedDelay = 5000         → every 5s from end
  initialDelay = 10000      → wait 10s before first run
  cron = "0 0 9 * * *"     → 9 AM every day

Cron syntax:
  Sec Min Hour Dom Month Dow
  0   0   9    *    *     *    → 9 AM daily
  0   */30 *   *    *     *    → every 30 min

Externalize:
  @Scheduled(cron = "${my.cron}")
  my.cron=0 0 9 * * *

Thread pool:
  ThreadPoolTaskScheduler.setPoolSize(10)
```

---

# 🧠 Memory Trick

@Scheduled = **Alarm Clock**

```
⏰ Alarm Clock (@Scheduled)

fixedRate  = Alarm rings every 5 minutes
             (regardless of when you silenced last)

fixedDelay = Alarm rings 5 minutes after you silence it
             (then resets)

cron       = Alarm set for 9:00 AM every weekday
             (precise time)
```

---

# 🚀 Next Chapter

We'll master **@Async** — running methods in background threads so your API stays fast even for time-consuming operations.
