Welcome to **Java — Chapter 20: Inner Classes**.

> **An inner class is a class written inside another class. It is used to logically group classes that are only used in one place, increasing encapsulation and making code more readable.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a Car. 
A Car has an Engine. 
Does it make sense for the Engine to exist alone on the street? No. An Engine only makes sense *inside* a Car.

In Java, if Class B is ONLY useful to Class A, we put Class B *inside* Class A.

```java
class Car {
    class Engine {
        // Engine logic here
    }
}
```

---

# Types of Inner Classes

There are 4 types of nested classes in Java:
1. Non-static Inner Class (Member Inner Class)
2. Static Nested Class
3. Local Inner Class (inside a method)
4. Anonymous Inner Class

---

# 1. Member Inner Class (Non-static)

A normal class defined inside another class. It has access to ALL members (even `private`) of the outer class.

```java
class Outer {
    private String secret = "Outer's Private Data";

    // Inner Class
    class Inner {
        public void display() {
            // Can access private members of Outer directly!
            System.out.println("Accessing: " + secret); 
        }
    }
}

public class Main {
    public static void main(String[] args) {
        // To create an instance of Inner, you MUST have an instance of Outer first!
        Outer out = new Outer();
        Outer.Inner in = out.new Inner(); // Weird syntax!
        
        in.display();
    }
}
```

---

# 2. Static Nested Class

If you add `static` to the inner class, it behaves differently. It does NOT need an instance of the Outer class to exist. However, it CANNOT access non-static members of the Outer class.

```java
class Outer {
    static String staticData = "Static Data";
    String instanceData = "Instance Data";

    // Static Nested Class
    static class Nested {
        public void show() {
            System.out.println(staticData); // ✅ Allowed
            // System.out.println(instanceData); ❌ ERROR: Cannot access non-static
        }
    }
}

public class Main {
    public static void main(String[] args) {
        // No Outer object needed!
        Outer.Nested nestedObj = new Outer.Nested(); 
        nestedObj.show();
    }
}
```
*Note: A Static Nested Class is technically not an "Inner" class, it's just nested for packaging convenience.*

---

# 3. Local Inner Class

A class created *inside* a method. It is only accessible within that specific method. (Rarely used).

```java
class Outer {
    public void myMethod() {
        
        // Local Inner Class
        class Local {
            void print() {
                System.out.println("Inside local inner class!");
            }
        }
        
        // Must instantiate and use it INSIDE the method
        Local l = new Local();
        l.print();
    }
}
```

---

# 4. Anonymous Inner Class (Very Important!)

A class that has **no name**. It is used to instantiate objects with certain "overrides" on the fly. Heavy usage in Android development (button clicks) and older Java before Lambdas.

```java
interface Greeting {
    void sayHello();
}

public class Main {
    public static void main(String[] args) {
        
        // We are creating a class that implements Greeting and instantiating it instantly!
        Greeting g = new Greeting() {
            @Override
            public void sayHello() {
                System.out.println("Hello from Anonymous Class!");
            }
        };
        
        g.sayHello();
    }
}
```
*Modern Java (Java 8+) replaces many Anonymous Inner Classes with Lambda Expressions, which are much cleaner.*

---

# 🏢 Company Example — Builder Pattern

Inner classes are extensively used to create the **Builder Design Pattern**, which is the standard way to create complex objects in enterprise Java (often automated by Lombok's `@Builder`).

```java
public class User {
    private String username;
    private String email;
    private int age;

    // Private constructor (forces use of Builder)
    private User(UserBuilder builder) {
        this.username = builder.username;
        this.email = builder.email;
        this.age = builder.age;
    }

    // Static Nested Class
    public static class UserBuilder {
        private String username;
        private String email;
        private int age;

        public UserBuilder setUsername(String username) {
            this.username = username;
            return this;
        }

        public UserBuilder setEmail(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder setAge(int age) {
            this.age = age;
            return this;
        }

        public User build() {
            return new User(this); // Calls outer private constructor
        }
    }
    
    @Override
    public String toString() { return username + " (" + email + ")"; }
}

// Usage in Business Logic
public class Main {
    public static void main(String[] args) {
        // Extremely clean object creation
        User u = new User.UserBuilder()
                    .setUsername("sachin99")
                    .setEmail("sachin@gmail.com")
                    .setAge(25)
                    .build();
    }
}
```

---

# Interview Questions

## Q1. Can an inner class access private members of the outer class?
> Yes! A non-static member inner class has full access to all fields and methods of the outer class, including `private` ones. This is one of the main reasons they are used (strong encapsulation).

## Q2. How do you instantiate a non-static inner class?
> You must first create an instance of the Outer class, and use that object to instantiate the Inner class:
> `Outer outer = new Outer();`
> `Outer.Inner inner = outer.new Inner();`

## Q3. Can a local inner class access local variables of the method it is inside?
> Yes, but ONLY if those local variables are `final` (or effectively final, meaning they are never modified after initialization).

---

# Professional Summary

```
Nested Classes grouping related code:

1. Non-static Inner Class: Requires outer instance. Can access all outer members.
2. Static Nested Class: Does not require outer instance. Can only access static outer members.
3. Local Inner Class: Inside a method. Scope limited to that method.
4. Anonymous Inner Class: No name, created on the fly. Usually implements an interface or extends a class quickly.

Widely used in the Builder Pattern and Event Listeners (GUI/Android).
```

---

# 🧠 Memory Trick
```
Outer Class = Human Body
Inner Class = Heart

Can a Heart exist outside a Body? No. (Non-static Inner Class needs Outer instance).
Can a Heart access the Body's private blood? Yes.
```

---

# 🚀 Next Chapter
We'll learn about **Enums** — a special "class" representing a group of constants!
