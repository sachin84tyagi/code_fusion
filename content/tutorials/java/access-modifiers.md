Welcome to **Java — Chapter 17: Access Modifiers**.

> **Access modifiers are the security guards of Java. They control who is allowed to see and use your classes, variables, and methods.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine your house:
1. **Public** (Front Yard): Anyone walking on the street can see it.
2. **Protected** (Living Room): Family members and invited guests can enter.
3. **Default** (Shared Backyard): Only neighbors in your specific neighborhood can see it.
4. **Private** (Your Bedroom/Diary): ONLY YOU can see it. No one else!

Access modifiers in Java do exactly this for your code.

---

# The 4 Access Modifiers

| Modifier | Class | Package | Subclass (diff pkg) | World |
|----------|-------|---------|---------------------|-------|
| `public` | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| `protected`| ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| `default`| ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| `private`| ✅ Yes | ❌ No | ❌ No | ❌ No |

*(Note: "Default" means you don't type any keyword at all).*

---

# 1. `private` (Highest Security)

Visible ONLY within the **same class**.

```java
public class Person {
    private String secretDiary = "Dear Diary...";

    private void readDiary() {
        System.out.println(secretDiary); // ✅ Allowed inside same class
    }
}

class Hacker {
    public void hack() {
        Person p = new Person();
        // p.secretDiary; ❌ Error! Cannot access private field
        // p.readDiary(); ❌ Error! Cannot access private method
    }
}
```
*Use case: Fields in Encapsulation. Hide internal state!*

---

# 2. `default` (Package-Private)

If you don't write any modifier, it is `default`.
Visible ONLY within the **same package** (folder).

```java
package com.mycompany.hr;

class Employee {
    // No modifier = default
    double salary = 50000; 
}

class Manager {
    public void viewSalary() {
        Employee e = new Employee();
        System.out.println(e.salary); // ✅ Allowed! (Same package)
    }
}
```
If a class in `com.mycompany.it` tries to access `salary`, it will fail!

---

# 3. `protected` (Family & Package)

Visible in the **same package**, AND in **subclasses** (even if they are in a different package).

```java
package com.game.core;

public class Player {
    protected int health = 100;
}
```

```java
package com.game.plugins;

import com.game.core.Player;

public class SuperPlayer extends Player {
    public void heal() {
        health = 200; // ✅ Allowed! Because SuperPlayer IS-A Player (Subclass)
    }
}

class Spectator {
    public void cheat() {
        Player p = new Player();
        // p.health = 999; ❌ Error! Not a subclass, and not in the same package.
    }
}
```
*Use case: When you want to hide something from the public, but allow child classes to use it.*

---

# 4. `public` (Zero Security)

Visible **everywhere** to everyone.

```java
package com.api;

public class MathUtils {
    public static final double PI = 3.14159; // ✅ Accessible everywhere!
}
```
*Use case: Classes and methods meant to be accessed by other parts of the application or external users (like API endpoints).*

---

# Class-Level Modifiers

Classes can only have TWO access modifiers: `public` or `default`.
(You cannot have a `private class` or `protected class` at the top level).

```java
public class A { }  // Accessible everywhere
class B { }         // Accessible only within the same package
```

---

# 🏢 Company Example — Banking System Security

```java
package com.bank.core;

public class BankAccount {
    
    // 1. private: Only the account itself should touch the raw balance.
    private double balance;

    // 2. protected: Child classes (like Savings/Current) need the account number.
    protected String accountNumber;

    // 3. public: Anyone can deposit money into the account.
    public void deposit(double amount) {
        if (amount > 0) this.balance += amount;
    }

    // 4. default (package-private): Only Bank internal systems (same package) 
    // can trigger an audit. External users cannot call this!
    void triggerInternalAudit() {
        System.out.println("Auditing account: " + accountNumber);
    }
}
```

---

# Interview Questions

## Q1. What happens if you don't put an access modifier on a variable?
> It gets the "default" (or package-private) access level. It will only be visible to classes inside the exact same package.

## Q2. Can a top-level class be private?
> No. Top-level classes can only be `public` or `default`. However, an *inner class* (a class inside another class) can be `private`, `protected`, `public`, or `default`.

## Q3. Which access modifier provides the strictest encapsulation?
> `private`. It ensures that the data/method cannot be touched from outside the class, forcing external code to use public getter/setter methods.

---

# Professional Summary

```
Access Modifiers from strictest to loosest:
1. private   → Class only
2. default   → Class + Package
3. protected → Class + Package + Subclasses
4. public    → Everywhere

Rules of thumb:
- Make fields 'private'.
- Make API/Helper methods 'public'.
- Use 'protected' for fields/methods intended for Inheritance.
- Keep classes 'default' unless they need to be accessed from outside the package.
```

---

# 🧠 Memory Trick
```
Private   = Diary (Me only)
Default   = Neighborhood (Same package)
Protected = Bloodline (Package + Children anywhere)
Public    = Billboard (Everyone)
```

---

# 🚀 Next Chapter
We'll dive into the **Static Keyword** — understanding class-level vs object-level memory!
