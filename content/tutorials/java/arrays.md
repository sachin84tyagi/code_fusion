Welcome to **Java — Chapter 7: Arrays**.

> **Arrays store multiple values of the same type in one variable. They are the simplest and fastest data structure in Java.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a row of lockers in school.

```
Locker[0] → Book
Locker[1] → Bag
Locker[2] → Bottle
Locker[3] → Shoes
```

An Array is like this row of lockers.
Each locker has a number (index) starting from 0.
Every locker holds the same type of thing.

---

# Declaring & Initializing Arrays

```java
// Method 1: Declare then assign
int[] numbers = new int[5];  // 5 slots, all default to 0
numbers[0] = 10;
numbers[1] = 20;
numbers[2] = 30;
numbers[3] = 40;
numbers[4] = 50;

// Method 2: Declare + Initialize (most common)
int[] scores = {90, 85, 78, 92, 88};

// Method 3: new keyword with values
String[] names = new String[]{"Sachin", "Rahul", "Priya"};

// Accessing elements
System.out.println(scores[0]); // 90 (first element)
System.out.println(scores[4]); // 88 (last element)
System.out.println(scores.length); // 5 (count of elements)
```

---

# Array Index Rules

```java
int[] arr = {10, 20, 30, 40, 50};
//  index:    0   1   2   3   4

// Valid:    arr[0] to arr[arr.length - 1]
// Invalid:  arr[-1]       → ArrayIndexOutOfBoundsException
//           arr[5]        → ArrayIndexOutOfBoundsException (max index = 4)

// Last element always at: arr[arr.length - 1]
System.out.println(arr[arr.length - 1]); // 50
```

---

# Iterating Arrays

```java
int[] marks = {85, 90, 78, 92, 88};

// 1. Traditional for loop (when you need index)
for (int i = 0; i < marks.length; i++) {
    System.out.println("Student " + (i + 1) + ": " + marks[i]);
}

// 2. Enhanced for-each (when you don't need index)
for (int mark : marks) {
    System.out.println(mark);
}

// 3. Sum and average
int sum = 0;
for (int mark : marks) {
    sum += mark;
}
double average = (double) sum / marks.length;
System.out.println("Average: " + average); // 86.6

// 4. Find max
int max = marks[0];
for (int mark : marks) {
    if (mark > max) max = mark;
}
System.out.println("Max: " + max); // 92
```

---

# Common Array Operations

```java
int[] arr = {5, 3, 1, 4, 2};

// Sort (ascending)
Arrays.sort(arr);
System.out.println(Arrays.toString(arr)); // [1, 2, 3, 4, 5]

// Binary search (array must be sorted first!)
int index = Arrays.binarySearch(arr, 3);
System.out.println("Found at index: " + index); // 2

// Copy array
int[] copy = Arrays.copyOf(arr, arr.length);
int[] partial = Arrays.copyOfRange(arr, 1, 4); // [2, 3, 4]

// Fill array
int[] zeros = new int[5];
Arrays.fill(zeros, 7);
System.out.println(Arrays.toString(zeros)); // [7, 7, 7, 7, 7]

// Compare arrays
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};
System.out.println(a == b);              // false (different objects!)
System.out.println(Arrays.equals(a, b)); // true ✅

// Print array
System.out.println(Arrays.toString(arr)); // [1, 2, 3, 4, 5]
```

---

# 2D Arrays (Matrix)

```java
// Declaration
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Access: matrix[row][column]
System.out.println(matrix[0][0]); // 1 (top-left)
System.out.println(matrix[1][1]); // 5 (center)
System.out.println(matrix[2][2]); // 9 (bottom-right)

// Iterate 2D array
for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        System.out.printf("%4d", matrix[i][j]);
    }
    System.out.println();
}
// Output:
//    1   2   3
//    4   5   6
//    7   8   9

// Jagged array (rows of different lengths)
int[][] jagged = new int[3][];
jagged[0] = new int[]{1};
jagged[1] = new int[]{2, 3};
jagged[2] = new int[]{4, 5, 6};
```

---

# Passing Arrays to Methods

```java
public static int findMax(int[] arr) {
    int max = arr[0];
    for (int num : arr) {
        if (num > max) max = num;
    }
    return max;
}

public static void doubleAll(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        arr[i] *= 2; // Modifies the original array!
    }
}

// Usage
int[] numbers = {5, 3, 8, 1, 9};
System.out.println(findMax(numbers)); // 9
doubleAll(numbers);
System.out.println(Arrays.toString(numbers)); // [10, 6, 16, 2, 18]

// Note: Arrays are passed by REFERENCE — changes affect original!
```

---

# Array vs ArrayList

| Feature | Array | ArrayList |
|---|---|---|
| Size | Fixed at creation | Dynamic (grows/shrinks) |
| Type | Primitive or Object | Only Objects |
| Syntax | `int[]` | `ArrayList<Integer>` |
| Performance | Faster | Slightly slower |
| Methods | `Arrays.sort()` | `list.sort()`, `list.add()` etc. |
| Use When | Fixed size known | Size unknown or changes |

---

# 🏢 Company Example — IRCTC Seat Matrix

```java
public class TrainSeatManager {

    // 2D array: [coachNumber][seatNumber]
    // true = available, false = booked
    private boolean[][] seats = new boolean[10][72]; // 10 coaches, 72 seats each

    public TrainSeatManager() {
        // Initialize all seats as available
        for (boolean[] coach : seats) {
            Arrays.fill(coach, true);
        }
    }

    public int[] findFirstAvailableSeat() {
        for (int coach = 0; coach < seats.length; coach++) {
            for (int seat = 0; seat < seats[coach].length; seat++) {
                if (seats[coach][seat]) {
                    return new int[]{coach + 1, seat + 1}; // 1-indexed
                }
            }
        }
        return null; // No seats available
    }

    public boolean bookSeat(int coach, int seat) {
        int c = coach - 1, s = seat - 1; // Convert to 0-indexed
        if (seats[c][s]) {
            seats[c][s] = false;
            return true;
        }
        return false; // Already booked
    }

    public int getAvailableCount() {
        int count = 0;
        for (boolean[] coach : seats) {
            for (boolean available : coach) {
                if (available) count++;
            }
        }
        return count;
    }
}
```

---

# Interview Questions

## Q1. What is the default value of array elements in Java?

**Best Answer**
> When an array is created with `new`, Java initializes all elements to their default values: `0` for numeric types (int, double, etc.), `false` for boolean, `'\u0000'` for char, and `null` for reference types (String, Object, etc.).

---

## Q2. What is `ArrayIndexOutOfBoundsException`?

> It is a runtime exception thrown when you try to access an array element with an index that is negative or greater than or equal to the array's length. Valid indices for an array of length `n` are `0` to `n-1`.

---

## Q3. Why are arrays passed by reference in Java?

> In Java, arrays are objects stored on the heap. When you pass an array to a method, you pass the reference (address) of the array, not a copy. So any modifications made inside the method affect the original array.

---

# Professional Summary

```
Array Basics:
  int[] arr = new int[5];
  int[] arr = {1, 2, 3, 4, 5};
  arr[0]        → first element
  arr.length    → number of elements
  arr[arr.length-1] → last element

Arrays class:
  Arrays.sort(arr)
  Arrays.toString(arr)
  Arrays.equals(a, b)
  Arrays.fill(arr, value)
  Arrays.copyOf(arr, length)
  Arrays.binarySearch(arr, key)

2D Array:
  int[][] matrix = {{1,2},{3,4}};
  matrix[row][col]

Key Rules:
  Index starts at 0, ends at length-1
  Fixed size after creation
  Pass by reference — modifications affect original
  Arrays.equals() for comparison (not ==)
```

---

# 🧠 Memory Trick

```
Array = Row of numbered lockers

arr[0]  arr[1]  arr[2]  arr[3]  arr[4]
  |       |       |       |       |
 10      20      30      40      50

Index starts at 0 (not 1!)
Length = number of lockers
Max index = length - 1

2D Array = School building with floors and rooms
matrix[floor][room]
matrix[0][0] = ground floor, first room
```

---

# 🚀 Next Chapter

We'll master **Strings** — the most-used type in every Java application, with dozens of built-in methods for text manipulation.
