Welcome to **Java — Chapter 13: Polymorphism**.

> **Polymorphism means "many forms". It allows us to perform a single action in different ways. It is the secret behind flexible and scalable Java code.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Think of a button on a remote control labeled "Play".

If you press "Play" on a TV remote, a movie plays.
If you press "Play" on a Music System remote, a song plays.
If you press "Play" on a Game Console, a game starts.

One action ("Play"), but different behaviors depending on the object. That is Polymorphism!

---

# Types of Polymorphism

1. **Compile-time Polymorphism** (Static Binding) — Achieved by **Method Overloading**.
2. **Runtime Polymorphism** (Dynamic Binding) — Achieved by **Method Overriding**.

---

# 1. Compile-Time Polymorphism (Overloading)

We already saw this in the Methods chapter. Same method name, different parameters. The compiler decides which method to call at compile time.

```java
class MathUtils {
    public int add(int a, int b) {
        return a + b;
    }

    public double add(double a, double b) {
        return a + b;
    }
}

// The compiler knows exactly which one to call based on arguments.
MathUtils m = new MathUtils();
m.add(2, 3);       // Calls int version
m.add(2.5, 3.5);   // Calls double version
```

---

# 2. Runtime Polymorphism (Overriding) — The Magic!

This is where Java shines. A parent reference variable can point to a child object. The method that gets called is determined at RUNTIME based on the actual object type, not the reference type.

## The Rule:
> **Reference Type determines WHAT you can call. Object Type determines HOW it executes.**

```java
class Animal {
    public void sound() {
        System.out.println("Some generic animal sound");
    }
}

class Dog extends Animal {
    @Override
    public void sound() {
        System.out.println("Bark!");
    }
}

class Cat extends Animal {
    @Override
    public void sound() {
        System.out.println("Meow!");
    }
}

public class Main {
    public static void main(String[] args) {
        
        // Parent Reference = Parent Object
        Animal a = new Animal();
        a.sound(); // Output: Some generic animal sound

        // Parent Reference = Child Object (UPCASTING)
        Animal myDog = new Dog();
        myDog.sound(); // Output: Bark!  (Resolved at runtime)

        Animal myCat = new Cat();
        myCat.sound(); // Output: Meow!
    }
}
```

---

# Why is Upcasting Useful?

Imagine you have a zoo with many animals. Without polymorphism, you'd need separate lists and loops for dogs, cats, lions, etc.

With polymorphism, you group them under the parent!

```java
Animal[] zoo = new Animal[3];
zoo[0] = new Dog();
zoo[1] = new Cat();
zoo[2] = new Animal();

// One loop handles everything!
for (Animal animal : zoo) {
    animal.sound(); 
    // Java automatically figures out if it should Bark, Meow, or generic sound.
}
```
This makes code highly extensible. If you add a `Lion` class later, the loop doesn't change!

---

# Downcasting & `instanceof`

If you upcast, you lose access to child-specific methods.

```java
Animal myDog = new Dog();
// myDog.fetch(); ❌ Compile Error! The 'Animal' reference doesn't know about fetch()

// We must Downcast it back to Dog to use fetch()
if (myDog instanceof Dog) { // Always check first to avoid ClassCastException
    Dog realDog = (Dog) myDog;
    realDog.fetch(); // ✅ Now it works
}
```

---

# 🏢 Company Example — Payment Processing

```java
// Parent
class Payment {
    public void processPayment(double amount) {
        System.out.println("Processing generic payment: ₹" + amount);
    }
}

// Child 1
class CreditCardPayment extends Payment {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing Credit Card payment: ₹" + amount + " (Includes 2% fee)");
    }
}

// Child 2
class UPIPayment extends Payment {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing UPI payment: ₹" + amount + " (Zero fee, instant)");
    }
}

// Service class that accepts ANY Payment type
class CheckoutService {
    public void checkout(Payment paymentMethod, double amount) {
        // Polymorphism in action! The caller decides the payment type.
        paymentMethod.processPayment(amount); 
    }
}

// Usage
CheckoutService checkout = new CheckoutService();

Payment upi = new UPIPayment();
checkout.checkout(upi, 500.0); // Output: Processing UPI payment...

Payment cc = new CreditCardPayment();
checkout.checkout(cc, 1000.0); // Output: Processing Credit Card payment...
```

---

# Interview Questions

## Q1. What is the difference between Compile-time and Runtime Polymorphism?
> Compile-time (static binding) is achieved through method overloading. The compiler resolves the method call based on the arguments.
> Runtime (dynamic binding) is achieved through method overriding. The JVM resolves the method call based on the actual object created in memory, not the reference type.

## Q2. Can we override private or static methods?
> No. Private methods are not visible to child classes. Static methods belong to the class, not the instance. If you write a static method in a child class with the same signature, it's called "Method Hiding", not overriding.

## Q3. What is Upcasting and Downcasting?
> Upcasting is casting a child object to a parent reference (e.g., `Animal a = new Dog();`). It is implicit and safe.
> Downcasting is casting a parent reference back to a child reference (e.g., `Dog d = (Dog) a;`). It requires an explicit cast and you should use `instanceof` to prevent `ClassCastException`.

---

# Professional Summary

```
Polymorphism = One interface, multiple implementations.

Compile-Time: Overloading (Same method name, different params)
Runtime: Overriding (Parent reference holding child object)

Rule of thumb for Runtime Polymorphism:
ParentReference obj = new ChildObject();
- The Compiler checks if the method exists in ParentReference.
- The JVM executes the overridden method in ChildObject.

Allows for extensible code (e.g., processing arrays of parent types without knowing specific child types).
```

---

# 🧠 Memory Trick
```
Polymorphism = Actor playing roles.
Actor = Parent Reference
Role = Child Object

An Actor can be a Doctor (new Doctor()), or a Cop (new Cop()).
When the director says "Action!" (method call), 
the Actor behaves like the specific Role they are playing today.
```

---

# 🚀 Next Chapter
We will look at **Abstraction** — hiding the implementation details completely using Abstract Classes.
