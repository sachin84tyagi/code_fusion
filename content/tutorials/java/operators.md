Welcome to **Java — Chapter 4: Operators**.

> **Operators are the tools that perform actions on data — calculations, comparisons, and decisions. Without operators, your program can't do anything useful.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Operators are like calculator buttons.

```
5 + 3 = 8    → + is an operator
10 > 5       → > is an operator (is 10 bigger than 5? YES)
true && false → && is an operator (both must be true)
```

Just like a calculator, operators take values and produce results.

---

# 1. Arithmetic Operators

```java
int a = 10, b = 3;

System.out.println(a + b);   // 13  Addition
System.out.println(a - b);   // 7   Subtraction
System.out.println(a * b);   // 30  Multiplication
System.out.println(a / b);   // 3   Division (integer — truncates!)
System.out.println(a % b);   // 1   Modulo (remainder)

// Increment and Decrement
int x = 5;
x++;                          // x = 6 (post-increment)
++x;                          // x = 7 (pre-increment)
x--;                          // x = 6 (post-decrement)
--x;                          // x = 5 (pre-decrement)

// Pre vs Post difference:
int a1 = 5;
System.out.println(a1++);     // 5 (prints THEN increments)
System.out.println(a1);       // 6

int a2 = 5;
System.out.println(++a2);     // 6 (increments THEN prints)
System.out.println(a2);       // 6
```

---

# 2. Assignment Operators

```java
int x = 10;         // Assign

x += 5;             // x = x + 5  → 15
x -= 3;             // x = x - 3  → 12
x *= 2;             // x = x * 2  → 24
x /= 4;             // x = x / 4  → 6
x %= 4;             // x = x % 4  → 2

// Useful in loops:
int sum = 0;
for (int i = 1; i <= 10; i++) {
    sum += i;       // sum = sum + i
}
System.out.println(sum); // 55
```

---

# 3. Relational (Comparison) Operators

Return `true` or `false`

```java
int a = 10, b = 20;

System.out.println(a == b);   // false (equal to)
System.out.println(a != b);   // true  (not equal to)
System.out.println(a > b);    // false (greater than)
System.out.println(a < b);    // true  (less than)
System.out.println(a >= b);   // false (greater than or equal)
System.out.println(a <= b);   // true  (less than or equal)

// Common use: if condition
int age = 18;
if (age >= 18) {
    System.out.println("Eligible to vote");
}

// ⚠️ Never use == for Strings!
String s1 = "hello";
String s2 = "hello";
System.out.println(s1 == s2);      // true (due to String pool — unreliable!)
System.out.println(s1.equals(s2)); // true ✅ Always use .equals() for Strings
```

---

# 4. Logical Operators

Combine multiple boolean conditions.

```java
boolean a = true, b = false;

// AND — Both must be true
System.out.println(a && b);   // false
System.out.println(true && true);  // true

// OR — At least one must be true
System.out.println(a || b);   // true
System.out.println(false || false); // false

// NOT — Reverses the boolean
System.out.println(!a);        // false
System.out.println(!b);        // true

// Real examples:
int age = 25;
boolean hasId = true;
boolean canDrive = age >= 18 && hasId;  // true
System.out.println(canDrive);

int marks = 75;
boolean passed = marks >= 40 || marks == 0;  // true (75 >= 40)

boolean isLoggedIn = true;
boolean isAdmin = false;
boolean canDelete = isLoggedIn && isAdmin;   // false
```

---

# Short-Circuit Evaluation

```java
// &&: If left side is false → right side NOT evaluated
boolean result = (5 > 10) && (10 / 0 == 1); // No ArithmeticException!
// 5 > 10 is false → skips right side → result = false

// ||: If left side is true → right side NOT evaluated
boolean result2 = (5 < 10) || (10 / 0 == 1); // No ArithmeticException!
// 5 < 10 is true → skips right side → result2 = true

// CRITICAL use in null checks:
String name = null;
if (name != null && name.equals("Sachin")) {  // ✅ Safe!
    System.out.println("Found!");
}
// If name == null, right side skipped. No NullPointerException!
```

---

# 5. Ternary Operator

Shorthand for simple if-else.

```java
// Syntax: condition ? valueIfTrue : valueIfFalse
int age = 20;
String status = age >= 18 ? "Adult" : "Minor";
System.out.println(status);  // Adult

// More examples:
int a = 10, b = 20;
int max = a > b ? a : b;     // 20
int min = a < b ? a : b;     // 10

double price = 1000.0;
double finalPrice = price > 500 ? price * 0.9 : price; // 10% off if > 500

// Can be nested (but avoid — hard to read):
int x = 15;
String category = x > 20 ? "High" : x > 10 ? "Medium" : "Low"; // "Medium"
```

---

# 6. Bitwise Operators

Operate on individual bits (used in performance-critical code, flags, permissions).

```java
int a = 5;  // Binary: 0101
int b = 3;  // Binary: 0011

System.out.println(a & b);    // 1  (0101 & 0011 = 0001) AND
System.out.println(a | b);    // 7  (0101 | 0011 = 0111) OR
System.out.println(a ^ b);    // 6  (0101 ^ 0011 = 0110) XOR
System.out.println(~a);       // -6 (bitwise NOT)
System.out.println(a << 1);   // 10 (left shift, multiply by 2)
System.out.println(a >> 1);   // 2  (right shift, divide by 2)
System.out.println(a >>> 1);  // 2  (unsigned right shift)

// Common use: checking if a number is even/odd
int num = 7;
if ((num & 1) == 0) {
    System.out.println("Even");
} else {
    System.out.println("Odd"); // 7 is odd
}

// Permission flags (like Linux file permissions)
final int READ  = 4;  // 100
final int WRITE = 2;  // 010
final int EXEC  = 1;  // 001

int userPermission = READ | WRITE;    // 110 = 6
boolean canRead  = (userPermission & READ)  != 0;  // true
boolean canWrite = (userPermission & WRITE) != 0;  // true
boolean canExec  = (userPermission & EXEC)  != 0;  // false
```

---

# 7. instanceof Operator

Check if an object is an instance of a class.

```java
Object obj = "Hello";
System.out.println(obj instanceof String);   // true
System.out.println(obj instanceof Integer);  // false

// Java 16+ Pattern Matching with instanceof
if (obj instanceof String s) {
    System.out.println(s.toUpperCase()); // No cast needed!
}

// Used in Spring for type checking
Object response = apiService.getResponse();
if (response instanceof ErrorResponse error) {
    log.error("API Error: {}", error.getMessage());
}
```

---

# Operator Precedence

Higher precedence = evaluated first

```
Priority (High → Low):
1.  ()  []  .           Parentheses, array access, member access
2.  ++  --  !  ~        Unary operators
3.  *   /   %           Multiplication, division, modulo
4.  +   -               Addition, subtraction
5.  <<  >>  >>>         Bit shift
6.  <   >   <=  >=  instanceof  Comparison
7.  ==  !=              Equality
8.  &               Bitwise AND
9.  ^               Bitwise XOR
10. |               Bitwise OR
11. &&              Logical AND
12. ||              Logical OR
13. ?:              Ternary
14. =  +=  -=  ...  Assignment

// When in doubt — use parentheses!
int result = 2 + 3 * 4;        // 14 (not 20! * before +)
int result2 = (2 + 3) * 4;     // 20 (parentheses first)
```

---

# 🏢 Company Example — E-Commerce Discount Engine (Meesho)

```java
public class DiscountCalculator {

    public double calculate(double price, int qty, boolean isPremiumUser, String code) {

        double discount = 0.0;

        // Quantity discount (arithmetic + relational)
        if (qty >= 10) {
            discount += price * 0.10;   // 10% off for bulk
        }

        // Premium user discount (logical)
        if (isPremiumUser && price > 500) {
            discount += price * 0.05;   // Extra 5% for premium
        }

        // Coupon code (relational + assignment)
        if ("SAVE20".equals(code)) {
            discount += price * 0.20;
        }

        // Final price (ternary for minimum price guard)
        double finalPrice = price - discount;
        return finalPrice > 0 ? finalPrice : 1.0; // Never go below ₹1

    }

    // Check eligibility with logical operators
    public boolean isEligibleForFreeShipping(double price, int pincode) {
        return price > 499 && (pincode >= 110000 && pincode <= 110099);
    }

    // Even/odd trick for A/B testing using bitwise
    public boolean isInTestGroup(long userId) {
        return (userId & 1) == 0;  // Even IDs in test group
    }
}
```

---

# Interview Questions

## Q1. What is the difference between `==` and `.equals()` in Java?

**Best Answer**
> `==` compares references (memory addresses) for objects and compares values for primitives. `.equals()` compares the actual content/values of objects. For String comparison, always use `.equals()` because two different String objects with the same content will have different references.

---

## Q2. What is short-circuit evaluation?

> In logical `&&` and `||`, Java doesn't evaluate the right operand if the result can be determined from the left operand alone. For `&&`, if left is false, result is always false (right skipped). For `||`, if left is true, result is always true (right skipped). This prevents NullPointerExceptions in null checks like `if (obj != null && obj.getValue() > 0)`.

---

## Q3. What is the difference between prefix (`++i`) and postfix (`i++`)?

> Prefix `++i` increments the value FIRST then returns it. Postfix `i++` returns the current value FIRST then increments. Example: if `i = 5`, then `System.out.println(++i)` prints 6 and `System.out.println(i++)` prints 5 (then i becomes 6).

---

# Professional Summary

```
Java Operators:

Arithmetic:  +  -  *  /  %  ++  --
Assignment:  =  +=  -=  *=  /=  %=
Relational:  ==  !=  >  <  >=  <=
Logical:     &&  ||  !
Ternary:     condition ? trueVal : falseVal
Bitwise:     &  |  ^  ~  <<  >>  >>>
instanceof:  obj instanceof ClassName

Key Rules:
  Strings: use .equals() not ==
  Short-circuit: && stops at first false, || at first true
  Null guard: obj != null && obj.doSomething()
  Precedence: * / % before + - (use parentheses to be safe)
```

---

# 🧠 Memory Trick

```
Operator Groups = ARLTBI

A → Arithmetic  (+ - * / %)
R → Relational  (== != > < >= <=)
L → Logical     (&& || !)
T → Ternary     (? :)
B → Bitwise     (& | ^ ~ << >>)
I → instanceof  (type checking)

Short-circuit memory:
  && = "Both doors must be unlocked" → if first is locked, don't check second
  || = "Either door works" → if first opens, don't check second
```

---

# 🚀 Next Chapter

We'll learn **Control Flow** — if/else, switch, and ternary statements that let your program make decisions based on conditions.
