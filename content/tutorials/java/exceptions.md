Welcome to **Java — Chapter 22: Exception Handling**.

> **Errors happen. Networks fail, databases go offline, and users type text into number fields. Exception handling stops your app from crashing and handles errors gracefully.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine driving a car on a highway.
Suddenly, a tire bursts (Exception!).

**Without Exception Handling:**
You panic, take your hands off the wheel, and the car crashes (App crashes).

**With Exception Handling:**
You detect the burst (`try`), safely steer to the shoulder (`catch`), and put on the spare tire to continue the journey (`finally`).

---

# Exception Hierarchy

In Java, everything is an object. Exceptions are objects too!

```text
               Object
                 |
             Throwable
              /     \
           Error   Exception
           (JVM)      /     \
                     /       \
      RuntimeException       Compile-Time Exceptions
      (Unchecked)            (Checked)
      - NullPointer          - IOException
      - Arithmetic           - SQLException
```

**Errors:** Serious JVM issues (e.g., `OutOfMemoryError`). You cannot catch or fix these. Let the app die.
**Exceptions:** Issues in your code. You CAN and SHOULD handle these.

---

# 1. try-catch Block

Put risky code in `try`. If it fails, execution jumps to `catch`.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Program started.");

        try {
            // Risky code
            int result = 10 / 0; 
            System.out.println("This line will NEVER print.");
        } 
        catch (ArithmeticException e) {
            // Handling the error safely
            System.out.println("Error: Cannot divide by zero!");
        }

        System.out.println("Program continues gracefully...");
    }
}
/* Output:
   Program started.
   Error: Cannot divide by zero!
   Program continues gracefully...
*/
```

---

# 2. Multiple Catch Blocks

You can catch different types of exceptions in different ways.

```java
try {
    String[] arr = new String[2];
    arr[0] = "Sachin";
    System.out.println(arr[5]); // Throws ArrayIndexOutOfBoundsException
    
    String nullString = null;
    System.out.println(nullString.length()); // Throws NullPointerException
} 
catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Error: Index out of bounds.");
} 
catch (NullPointerException e) {
    System.out.println("Error: Object is null.");
} 
catch (Exception e) {
    // The "catch-all" fallback! Must ALWAYS be the last catch block.
    System.out.println("Generic Error: " + e.getMessage());
}
```

### Multi-Catch (Java 7+)
```java
try {
    // Risky code
} catch (ArithmeticException | NullPointerException e) {
    System.out.println("Math or Null Error occurred.");
}
```

---

# 3. the `finally` Block

Code inside `finally` executes **ALWAYS** — whether an exception occurred or not. It is primarily used to close resources (like Database connections or File readers) to prevent memory leaks.

```java
import java.util.Scanner;

public class Test {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        try {
            System.out.print("Enter a number: ");
            int num = Integer.parseInt(sc.nextLine()); // Might throw NumberFormatException
        } 
        catch (NumberFormatException e) {
            System.out.println("Invalid input!");
        } 
        finally {
            // ALWAYS runs!
            System.out.println("Closing scanner to prevent memory leaks.");
            sc.close(); 
        }
    }
}
```

---

# 4. try-with-resources (Java 7+) — Best Practice!

Automatically closes resources so you don't need a `finally` block! Any object that implements `AutoCloseable` can be used.

```java
// Modern Way (Cleaner and safer)
try (Scanner sc = new Scanner(System.in)) {
    System.out.print("Enter name: ");
    String name = sc.nextLine();
} catch (Exception e) {
    System.out.println("Error reading input");
}
// Scanner is AUTOMATICALLY closed here! No finally block needed.
```

---

# Checked vs Unchecked Exceptions

## Checked Exceptions (Compile-Time)
Java FORCES you to handle them. The code will NOT compile until you write a `try-catch` or a `throws` declaration.
*Examples: `IOException`, `SQLException`, `ClassNotFoundException`.*

```java
import java.io.File;
import java.io.FileReader;

public class Main {
    public static void main(String[] args) {
        // FileReader fr = new FileReader("test.txt"); ❌ COMPILE ERROR!
        // Java forces you to handle FileNotFoundException

        try {
            FileReader fr = new FileReader("test.txt"); // ✅ Safe
        } catch (Exception e) {
            System.out.println("File not found!");
        }
    }
}
```

## Unchecked Exceptions (Run-Time)
Java does NOT force you to handle them. They usually represent logic bugs in your code.
*Examples: `NullPointerException`, `ArithmeticException`, `ArrayIndexOutOfBoundsException`.*

---

# 5. `throw` vs `throws`

- `throw`: Used to literally throw an exception object manually from inside a method.
- `throws`: Used in the method signature to declare that this method *might* throw an exception, forcing the caller to handle it.

```java
public class Validator {

    // throws: "Warning caller, you must handle Exception!"
    public static void checkAge(int age) throws Exception {
        if (age < 18) {
            // throw: manually creating and tossing the error
            throw new Exception("Age must be 18 or older!"); 
        }
        System.out.println("Access granted.");
    }

    public static void main(String[] args) {
        try {
            checkAge(15); // Caller MUST use try-catch because of "throws Exception"
        } catch (Exception e) {
            System.out.println("Rejected: " + e.getMessage());
        }
    }
}
```

---

# 🏢 Company Example — E-Commerce Checkout

```java
public class CheckoutService {

    public void processOrder(String cartId, String paymentToken) {
        try {
            validateCart(cartId);         // Might throw ValidationException
            chargeCard(paymentToken);     // Might throw PaymentGatewayException
            updateInventory(cartId);      // Might throw OutOfStockException
            
            System.out.println("Order Successful!");

        } catch (PaymentGatewayException e) {
            System.out.println("Payment failed. Ask user to try another card.");
        } catch (OutOfStockException e) {
            System.out.println("Item sold out while processing. Refund payment!");
        } catch (Exception e) {
            System.out.println("Unknown system error. Alert Ops Team!");
        } finally {
            // Ensure shopping cart lock is released, regardless of success/failure
            unlockCart(cartId); 
        }
    }
    
    // Stub methods
    private void validateCart(String id) {}
    private void chargeCard(String token) {}
    private void updateInventory(String id) {}
    private void unlockCart(String id) {}
}
```

---

# Interview Questions

## Q1. What is the difference between Checked and Unchecked exceptions?
> **Checked exceptions** occur at compile-time (e.g., `IOException`) and must be handled using try-catch or `throws`. **Unchecked exceptions** occur at runtime (`RuntimeException` subclasses like `NullPointerException`) and the compiler doesn't force you to handle them; they usually indicate programming errors.

## Q2. What is the difference between `throw` and `throws`?
> `throw` is used inside a method body to explicitly throw an exception object (`throw new Exception()`). `throws` is used in a method signature to declare that the method may throw exceptions, passing the responsibility to handle it to the calling method.

## Q3. Can a `finally` block NOT execute?
> Yes, but very rarely. It will not execute if you call `System.exit(0)` before it, if the JVM crashes, or if there is an infinite loop/deadlock in the `try` block.

---

# Professional Summary

```
try       -> Code that might fail.
catch     -> Code to handle the failure safely.
finally   -> Code that ALWAYS runs (clean up resources).

throw     -> Manually toss an error.
throws    -> Warn caller to handle the error.

Checked   -> Compiler forces handling (extends Exception).
Unchecked -> Runtime logic errors (extends RuntimeException).

Modern Java: Use 'try-with-resources' to auto-close Scanners/DB Connections.
```

---

# 🧠 Memory Trick
```
try     = Walking on ice.
catch   = The safety net when you slip.
finally = Taking off your ice skates at the end (always happens whether you slipped or not).
throw   = Throwing a snowball at someone.
throws  = Putting up a warning sign: "Beware of falling snowballs".
```

---

# 🚀 Next Chapter
We will learn how to create our own **Custom Exceptions** to represent business-specific errors (like `InsufficientFundsException`).
