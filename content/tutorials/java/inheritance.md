Welcome to **Java — Chapter 12: Inheritance**.

> **Inheritance allows one class to inherit the properties and methods of another class. It promotes code reusability and establishes a parent-child relationship between classes.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a family.
A child inherits features from their parent (like eye color, hair type, or family name).

In Java, if we have a parent class (e.g., `Vehicle`) that has properties like `brand` and `honk()`, a child class (e.g., `Car`) can inherit these without writing the code again!

```
Vehicle (Parent)
 - brand
 - honk()
       ↓
Car (Child) inherits brand and honk()
 - numberOfDoors
```

---

# Syntax of Inheritance

Java uses the `extends` keyword.

```java
// Parent Class (Superclass / Base Class)
class Animal {
    String name;

    public void eat() {
        System.out.println(name + " is eating...");
    }
}

// Child Class (Subclass / Derived Class)
class Dog extends Animal {
    public void bark() {
        System.out.println(name + " is barking...");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.name = "Buddy";  // Inherited field
        myDog.eat();           // Inherited method!
        myDog.bark();          // Own method
    }
}
```

---

# Types of Inheritance in Java

```
1. Single Inheritance:       A → B  (Supported)
2. Multilevel Inheritance:   A → B → C (Supported)
3. Hierarchical Inheritance: A → B, A → C (Supported)
4. Multiple Inheritance:     A, B → C (NOT Supported with classes!)
```

**Why doesn't Java support Multiple Inheritance (with classes)?**
To prevent the "Diamond Problem". If class C inherits from A and B, and both have a `show()` method, which one should C call? Java avoids this confusion. (We use Interfaces for this later).

---

# Method Overriding

When a child class provides a specific implementation of a method that is already provided by its parent.

```java
class Animal {
    public void makeSound() {
        System.out.println("Animal makes a sound");
    }
}

class Cat extends Animal {
    // Overriding the parent's method
    @Override
    public void makeSound() {
        System.out.println("Meow!");
    }
}

// Usage:
Animal a = new Animal();
a.makeSound(); // "Animal makes a sound"

Cat c = new Cat();
c.makeSound(); // "Meow!"
```
*Note: `@Override` is an annotation that tells the compiler we intend to override. It's best practice!*

---

# The `super` Keyword

`super` is used to refer to the immediate parent class object.

```java
class Parent {
    String color = "White";

    public void display() {
        System.out.println("Parent display");
    }
}

class Child extends Parent {
    String color = "Black";

    public void printColors() {
        System.out.println("Child color: " + color);        // "Black"
        System.out.println("Parent color: " + super.color); // "White"
    }

    @Override
    public void display() {
        super.display(); // Calls parent's display method
        System.out.println("Child display");
    }
}
```

---

# `super()` in Constructors

Constructors are NOT inherited. But the child class constructor MUST call the parent's constructor using `super()`.
If you don't write it, Java adds a hidden `super()` (calling the no-arg constructor) as the first line.

```java
class Person {
    String name;

    public Person(String name) {
        this.name = name;
        System.out.println("Person created: " + name);
    }
}

class Employee extends Person {
    int id;

    public Employee(String name, int id) {
        super(name); // MUST be the first statement!
        this.id = id;
        System.out.println("Employee created: " + id);
    }
}
```

---

# The `Object` Class

In Java, every class you create implicitly inherits from the `java.lang.Object` class. It is the cosmic superclass!
This is why all your objects automatically have methods like `toString()`, `equals()`, and `hashCode()`.

---

# 🏢 Company Example — E-Commerce User Roles

```java
// Parent Class
public class User {
    protected String username;
    protected String email;

    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }

    public void login() {
        System.out.println(username + " logged in.");
    }
}

// Child Class 1
public class Customer extends User {
    private String shippingAddress;

    public Customer(String username, String email, String address) {
        super(username, email);
        this.shippingAddress = address;
    }

    public void placeOrder() {
        System.out.println(username + " placed an order to " + shippingAddress);
    }
}

// Child Class 2
public class Admin extends User {
    public Admin(String username, String email) {
        super(username, email);
    }

    public void deleteUser(String targetUser) {
        System.out.println(username + " deleted user: " + targetUser);
    }
    
    @Override
    public void login() {
        super.login();
        System.out.println("Admin privileges granted.");
    }
}
```

---

# Interview Questions

## Q1. Can we inherit a private member of a class?
> No. `private` members (fields/methods) are not inherited. To allow a subclass to access a parent's field while keeping it hidden from the outside world, use the `protected` access modifier.

---

## Q2. What is the difference between `this` and `super`?
> `this` refers to the current instance of the class, used to access its own fields and methods, or call its own constructors (`this()`).
> `super` refers to the parent class instance, used to access parent fields/methods, or call parent constructors (`super()`).

---

## Q3. Can we override a static method?
> No. Static methods belong to the class, not the object. If a child class defines a static method with the same signature as the parent, it "hides" the parent's method (Method Hiding), but it is not true overriding (no dynamic polymorphism).

---

# Professional Summary

```
Inheritance (IS-A Relationship):
  class Child extends Parent { ... }
  Promotes code reusability.

Types:
  Single, Multilevel, Hierarchical.
  No Multiple Inheritance for classes in Java.

Method Overriding:
  Child provides specific implementation of parent's method.
  Use @Override.

The super keyword:
  super.field   → Parent's field
  super.method()→ Parent's method
  super()       → Parent's constructor (must be first line in child constructor)

Object Class:
  The root of all classes in Java.
```

---

# 🧠 Memory Trick
```
Inheritance = Genetic transfer
extends = "gets DNA from"

Parent has a house.
Child extends Parent → Child gets the house automatically.

super = "Call my Dad"
super() = "Ask Dad to build his part first"
```

---

# 🚀 Next Chapter
We'll explore **Polymorphism** — the ability of an object to take many forms, allowing for flexible and dynamic code execution!
