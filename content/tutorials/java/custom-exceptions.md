Welcome to **Java — Chapter 23: Custom Exceptions**.

> **Sometimes, standard Java exceptions (like `NullPointerException` or `IllegalArgumentException`) don't describe the business error accurately. That's when we create Custom Exceptions!**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you are playing a video game.

If your computer breaks, that's a generic System Error (like `IOException`).
But what if your character tries to buy a sword and doesn't have enough gold? 
Java doesn't have a `NotEnoughGoldException`. 

So, you have to build your own custom error so the game knows exactly what went wrong!

---

# Why Create Custom Exceptions?

1. **Clarity**: `UserNotFoundException` is much clearer than a generic `Exception`.
2. **Business Logic**: It allows you to model business rules directly into your error handling.
3. **Specific Catching**: You can write specific `catch` blocks for specific business errors.

---

# Step 1: Create a Custom Exception Class

To create a custom exception, you simply create a class that `extends Exception` (Checked) or `extends RuntimeException` (Unchecked).

**Rule of Thumb in Spring Boot / Modern Java:** 
Almost always extend `RuntimeException` (Unchecked) so you don't clutter your code with `throws` declarations everywhere!

```java
// 1. Inherit from RuntimeException
public class InsufficientFundsException extends RuntimeException {

    // 2. Add a constructor that accepts a message
    public InsufficientFundsException(String message) {
        super(message); // Pass the message to the parent class (RuntimeException)
    }
}
```

---

# Step 2: Throw the Custom Exception

Now use the `throw` keyword in your business logic when a rule is violated.

```java
public class BankAccount {
    private double balance;

    public BankAccount(double balance) {
        this.balance = balance;
    }

    public void withdraw(double amount) {
        if (amount > balance) {
            // Throwing our custom exception!
            throw new InsufficientFundsException("Cannot withdraw ₹" + amount + ". Current balance: ₹" + balance);
        }
        balance -= amount;
        System.out.println("Withdrawal successful! Remaining: ₹" + balance);
    }
}
```

---

# Step 3: Catch and Handle It

```java
public class Main {
    public static void main(String[] args) {
        BankAccount myAccount = new BankAccount(5000);

        try {
            myAccount.withdraw(10000); // This will fail!
        } 
        catch (InsufficientFundsException e) {
            // Catching our specific custom exception
            System.out.println("TRANSACTION FAILED: " + e.getMessage());
        }
    }
}

/* Output:
   TRANSACTION FAILED: Cannot withdraw ₹10000.0. Current balance: ₹5000.0
*/
```

---

# Adding Custom Data to Exceptions

Sometimes you want the exception to hold specific data (like an Error Code) so the UI can display a specific pop-up.

```java
public class UserNotFoundException extends RuntimeException {
    
    private int errorCode;

    public UserNotFoundException(String message, int errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public int getErrorCode() {
        return errorCode;
    }
}
```

```java
try {
    throw new UserNotFoundException("User 'sachin99' does not exist in DB", 404);
} catch (UserNotFoundException e) {
    System.out.println("Error " + e.getErrorCode() + ": " + e.getMessage());
    // Output: Error 404: User 'sachin99' does not exist in DB
}
```

---

# 🏢 Company Example — Spring Boot Global Exception Handling

In professional Spring Boot projects, custom exceptions are the backbone of API error responses.

```java
// 1. Custom Exception
public class ProductOutOfStockException extends RuntimeException {
    public ProductOutOfStockException(String productName) {
        super(productName + " is currently out of stock!");
    }
}

// 2. Service Layer (Throws it)
@Service
public class OrderService {
    public void placeOrder(Product p) {
        if (p.getStock() <= 0) {
            throw new ProductOutOfStockException(p.getName());
        }
        // ... continue order
    }
}

// 3. ControllerAdvice (Catches it globally and formats JSON response)
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductOutOfStockException.class)
    public ResponseEntity<String> handleOutOfStock(ProductOutOfStockException ex) {
        // Translates the Java exception into a 400 Bad Request HTTP response
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
```
*(You will use this exact pattern in the Spring Boot section!)*

---

# Interview Questions

## Q1. Should a Custom Exception extend `Exception` or `RuntimeException`?
> It is highly recommended to extend `RuntimeException` (making it an Unchecked exception). Extending `Exception` makes it Checked, forcing every method in the call stack to write a `try-catch` or `throws` declaration, which leads to messy, unreadable code. Modern frameworks (like Spring) rely entirely on RuntimeExceptions.

## Q2. How do you pass the error message to the parent Exception class?
> By calling `super(message)` inside the custom exception's constructor. This passes the string up to the `Throwable` class, which makes it available when you call `e.getMessage()`.

---

# Professional Summary

```
Custom Exceptions:
- Allow modeling specific business rule violations.
- Always extend RuntimeException (Unchecked) in modern Java.
- Include a constructor that calls super(message).
- Can contain additional fields (like error codes) for more context.
- Essential for clean, global error handling in web applications.
```

---

# 🧠 Memory Trick
```
Custom Exception = Custom Name Tag.

Instead of a generic red "ERROR" sticker, you print a specific sticker that says:
"InsufficientFunds" or "UserNotFound".
Makes debugging 100x easier because the Exception NAME tells you the exact problem.
```

---

# 🚀 Next Chapter
We're entering Phase 5! We will explore the magnificent **Collections Framework** — the most powerful data structures in Java.
