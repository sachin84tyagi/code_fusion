Welcome to **Java — Chapter 46: The Factory Pattern**.

> **The Factory Pattern replaces direct object creation (`new Object()`). It provides a centralized method to create objects, hiding the complex creation logic from the user.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you go to a Car Factory to buy a car.
You don't bring the engine, tires, and steering wheel and build it yourself (`new Car()`).
You just walk to the counter and say: "I want an SUV."
The factory builds the SUV behind closed doors and hands you the keys.

You don't need to know HOW it was built, you just get the final product.

---

# The Problem with `new`

When a class relies heavily on the `new` keyword, it becomes **tightly coupled** to specific implementations.

```java
// ❌ Bad Code (Tightly Coupled)
public class NotificationService {
    public void notifyUser(String type) {
        if (type.equals("SMS")) {
            SMSNotification sms = new SMSNotification(); // Hardcoded 'new'
            sms.send();
        } else if (type.equals("EMAIL")) {
            EmailNotification email = new EmailNotification(); // Hardcoded 'new'
            email.send();
        }
    }
}
```
If we add "PushNotification" tomorrow, we have to modify `NotificationService`. This violates the **Open/Closed Principle (SOLID)**.

---

# Step 1: Create a Common Interface

All objects the factory produces must share a common interface or parent class.

```java
public interface Notification {
    void send();
}

public class SMSNotification implements Notification {
    public void send() { System.out.println("Sending SMS..."); }
}

public class EmailNotification implements Notification {
    public void send() { System.out.println("Sending Email..."); }
}
```

---

# Step 2: Create the Factory

The Factory is responsible for the `new` keyword.

```java
public class NotificationFactory {
    
    // The Factory Method
    public static Notification createNotification(String type) {
        if (type == null) return null;
        
        if (type.equalsIgnoreCase("SMS")) {
            return new SMSNotification();
        } else if (type.equalsIgnoreCase("EMAIL")) {
            return new EmailNotification();
        }
        
        throw new IllegalArgumentException("Unknown notification type");
    }
}
```

---

# Step 3: Use the Factory (Clean Client Code)

Now, the client code doesn't know anything about `SMSNotification` or `EmailNotification` classes. It only knows about the `Notification` interface!

```java
public class Client {
    public static void main(String[] args) {
        
        // Client says "Give me an EMAIL"
        Notification notif1 = NotificationFactory.createNotification("EMAIL");
        notif1.send(); // Output: Sending Email...

        // Client says "Give me an SMS"
        Notification notif2 = NotificationFactory.createNotification("SMS");
        notif2.send(); // Output: Sending SMS...
    }
}
```

---

# Why is this better?

1. **Encapsulation:** If creating an `EmailNotification` suddenly requires complex setups (like connecting to an SMTP server), you only update the Factory. The Client code remains untouched!
2. **Polymorphism:** The client works purely with the Interface.
3. **Single Responsibility:** The Client uses the object. The Factory creates the object. Jobs are separated.

---

# 🏢 Company Example — Database Connection Factory

Companies often need to connect to different databases depending on the environment (Testing = H2 In-Memory DB, Production = MySQL).

```java
interface Database {
    void connect();
}

class MySQL implements Database {
    public void connect() { System.out.println("Connected to MySQL Production"); }
}

class H2Database implements Database {
    public void connect() { System.out.println("Connected to H2 Testing"); }
}

// The Factory
class DatabaseFactory {
    public static Database getDatabase(String environment) {
        switch (environment) {
            case "PROD": return new MySQL();
            case "TEST": return new H2Database();
            default: throw new IllegalArgumentException("Invalid Environment");
        }
    }
}

// Application Startup
public class App {
    public static void main(String[] args) {
        // Read env variable, pass it to factory
        String env = System.getenv("APP_ENV"); // e.g., "PROD"
        
        Database db = DatabaseFactory.getDatabase(env);
        db.connect(); 
        // App is now connected without hardcoding which database to use!
    }
}
```

---

# Interview Questions

## Q1. What is the difference between Factory Method and Abstract Factory patterns?
> The **Factory Method** pattern uses a single method to create one of several related objects (like our `createNotification` method). 
> The **Abstract Factory** pattern creates *families* or groups of related objects. It is basically a Factory that creates other Factories.

## Q2. How does the Factory pattern support the Open/Closed Principle?
> If implemented with polymorphism and reflection (or an advanced registry), you can add new product classes to the system without modifying the existing client code that uses the factory. The client just asks for a new string type.

## Q3. When should you NOT use a Factory?
> Do not use a Factory for simple, primitive objects, or objects that have no variations/subclasses (like a basic `User` DTO). Adding a factory in these cases just adds unnecessary complexity and classes.

---

# Professional Summary

```
Factory Pattern:
- A Creational Pattern used to abstract object instantiation.
- Replaces 'new Object()' with 'Factory.create("TYPE")'.
- Promotes Loose Coupling by ensuring clients depend on Interfaces, not concrete classes.
- Centralizes creation logic, making future modifications (like adding parameters to constructors) much easier.
```

---

# 🧠 Memory Trick
```
Factory = The Vending Machine.
You press "A1" (String type). 
You don't know how it grabs the chips, you just get the chips (Interface object).
```

---

# 🚀 Next Chapter
We'll explore the **Builder Pattern** — the absolute best way to create objects that require 10 different constructor parameters!
