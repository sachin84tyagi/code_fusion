Welcome to **Java — Chapter 33: Generic Wildcards (`?`)**.

> **Wildcards are the `?` symbol in Generics. They are used when you want a method to accept a collection of an unknown type, or a specific family of types (like any child of Animal).**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a parking lot attendant.
If his rule is exactly `<SportsCar>`, he will reject a Sedan.
If you want him to accept ANY car, you use a Wildcard `<?>`. Now he says, "I don't know what specific type of car it is, but as long as it's some kind of car, let it in!"

---

# The Problem: Generics are NOT Covariant

This is a massive gotcha in Java:
Even though `Integer` is a subclass of `Number`, a `List<Integer>` is **NOT** a subclass of `List<Number>`!

```java
public class Main {
    public static void printNumbers(List<Number> list) {
        for (Number n : list) {
            System.out.println(n);
        }
    }

    public static void main(String[] args) {
        List<Integer> myInts = Arrays.asList(1, 2, 3);
        
        // printNumbers(myInts); ❌ COMPILE ERROR!
        // List<Integer> cannot be converted to List<Number>
    }
}
```
Why? Because if Java allowed this, `printNumbers` could secretly add a `Double` into your `List<Integer>`, corrupting your integer list!

**Solution:** Wildcards!

---

# The 3 Types of Wildcards

### 1. Unbounded Wildcard `<?>`
Accepts a List of absolutely ANYTHING. 
*(Read-only: You cannot add items to a `<?>` list because Java doesn't know its exact type).*

```java
public static void printAnything(List<?> list) {
    for (Object obj : list) {
        System.out.println(obj);
    }
    // list.add("Test"); ❌ Error! Cannot add to <?>
}

List<String> strList = Arrays.asList("A", "B");
List<Integer> intList = Arrays.asList(1, 2);

printAnything(strList); // ✅ Works
printAnything(intList); // ✅ Works
```

---

### 2. Upper Bounded Wildcard `<? extends T>`
Accepts type `T` **or any of its subclasses**.
*(Used when you want to READ data from a collection safely).*

Let's fix our Number problem from earlier!

```java
// Accepts List<Number>, List<Integer>, List<Double>, etc.
public static void printNumbers(List<? extends Number> list) {
    for (Number n : list) {
        System.out.println(n); // Safe to read as Number!
    }
    // list.add(10); ❌ Error! Still can't add. (What if the list is actually List<Double>?)
}

List<Integer> ints = Arrays.asList(1, 2);
printNumbers(ints); // ✅ Works!
```

---

### 3. Lower Bounded Wildcard `<? super T>`
Accepts type `T` **or any of its superclasses**.
*(Used when you want to ADD/WRITE data into a collection safely).*

```java
// Accepts List<Integer>, List<Number>, List<Object>
public static void addIntegers(List<? super Integer> list) {
    list.add(50); // ✅ Safe to add Integer!
    list.add(100);
}

List<Number> numList = new ArrayList<>();
addIntegers(numList); // ✅ Works! We added integers to a Number list.
System.out.println(numList); // [50, 100]
```

---

# The PECS Rule (Crucial for Interviews!)

Joshua Bloch (creator of Java Collections) coined the acronym **PECS**:
**P**roducer **E**xtends, **C**onsumer **S**uper.

- If you want a collection to **produce** (read) data for you to use: Use `<? extends T>`. (You can read, but can't add).
- If you want a collection to **consume** (write) data you give it: Use `<? super T>`. (You can add, but reading is messy because it returns `Object`).
- If you need to do BOTH read and write: Do NOT use wildcards. Use an exact type `<T>`.

---

# 🏢 Company Example — Sorting System

In Java's actual `Collections.sort()` method, wildcards are used to ensure maximum flexibility.

```java
class Animal { int size; }
class Dog extends Animal { }

// A method to sort ANY list of animals, using ANY comparator 
// that understands Animals (or superclasses of Animal)
public static <T> void customSort(List<T> list, Comparator<? super T> comp) {
    list.sort(comp);
}

public static void main(String[] args) {
    List<Dog> dogs = new ArrayList<>();
    
    // We can use a Comparator that compares generic Animals to sort specific Dogs!
    // This works because the method signature uses `? super T`
    Comparator<Animal> sizeComparator = (a1, a2) -> Integer.compare(a1.size, a2.size);
    
    customSort(dogs, sizeComparator); // ✅ Valid because Animal is a superclass of Dog
}
```

---

# Interview Questions

## Q1. What is the difference between `<T>` and `<?>`?
> `<T>` (Type Parameter) is a specific, though unknown, type. You can use `T` multiple times in a method signature to enforce that two arguments are of the exact same type (e.g., `void merge(List<T> l1, List<T> l2)`). 
> `<?>` (Wildcard) means "I don't care what type this is". You cannot enforce type matching between multiple arguments using wildcards.

## Q2. Why can't you add elements to a `List<? extends Number>`?
> Because the compiler doesn't know the *exact* type of the list at runtime. It could be a `List<Integer>` or a `List<Double>`. If it allowed you to add an `Integer`, and the list was actually a `List<Double>`, it would corrupt the heap and cause a ClassCastException later. Thus, the compiler makes it strictly Read-Only.

## Q3. Explain the PECS rule.
> Producer Extends, Consumer Super. Use `? extends T` when you only need to read (produce) values from a collection. Use `? super T` when you only need to insert (consume) values into a collection.

---

# Professional Summary

```
Wildcards (?):
- ? : Unbounded (Any type. Read-only as Object).
- ? extends T : Upper Bound (T or its children. Read-only as T).
- ? super T : Lower Bound (T or its parents. Write-allowed for T).

Rule: Collections of Generics are NOT covariant! 
List<Integer> is NOT a subclass of List<Number>. Wildcards solve this.
```

---

# 🧠 Memory Trick
```
extends = Look DOWN the family tree (Read data from kids).
super   = Look UP the family tree (Push data to parents).
```

---

# 🚀 Next Chapter
Phase 8 Begins! We are entering the realm of **Multithreading** — making your Java program do multiple things at the exact same time!
