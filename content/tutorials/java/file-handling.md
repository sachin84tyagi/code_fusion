Welcome to **Java — Chapter 37: File Handling (I/O)**.

> **Variables and Arrays are temporary. When your program stops, they are wiped from RAM. To save data permanently, you must write it to a File on your hard drive.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine your Java program is a whiteboard. You write formulas and names on it while you work.
But when you go to sleep (close the program), someone wipes the whiteboard clean!

If you want to keep that information for tomorrow, you need to write it down on a piece of paper (a File) and put it in a filing cabinet (your Hard Drive).
File I/O (Input/Output) is simply the act of reading from and writing to that paper.

---

# The `java.io.File` Class

The `File` class represents a *path* on your computer, not the actual data inside the file. You use it to check if a file exists, create it, or delete it.

```java
import java.io.File;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        
        File myFile = new File("data.txt"); // Represents a file in the project folder

        try {
            if (myFile.createNewFile()) {
                System.out.println("File created: " + myFile.getName());
            } else {
                System.out.println("File already exists.");
            }
            
            // Useful Methods
            System.out.println("Absolute path: " + myFile.getAbsolutePath());
            System.out.println("File size (bytes): " + myFile.length());
            
            // Delete the file
            // myFile.delete(); 
            
        } catch (IOException e) {
            System.out.println("An error occurred creating the file.");
        }
    }
}
```

---

# Writing to a File (`FileWriter`)

To actually put text into the file, we use `FileWriter`. We MUST close it after writing to save the changes! (We use `try-with-resources` to auto-close it).

```java
import java.io.FileWriter;
import java.io.IOException;

public class WriteFile {
    public static void main(String[] args) {
        
        // true = Append mode (adds to end of file). false = Overwrite mode.
        try (FileWriter writer = new FileWriter("data.txt", true)) {
            writer.write("Hello, Java!\n");
            writer.write("Writing to files is easy.\n");
            System.out.println("Successfully wrote to the file.");
        } 
        catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
        // writer is automatically closed here!
    }
}
```

---

# Reading from a File (`Scanner` or `BufferedReader`)

### Method 1: Using `Scanner` (Simple, good for small files)
```java
import java.io.File;
import java.util.Scanner;

public class ReadFile {
    public static void main(String[] args) {
        try (Scanner reader = new Scanner(new File("data.txt"))) {
            while (reader.hasNextLine()) {
                String line = reader.nextLine();
                System.out.println(line);
            }
        } catch (Exception e) {
            System.out.println("File not found.");
        }
    }
}
```

### Method 2: Using `BufferedReader` (Fast, good for large files)
```java
import java.io.BufferedReader;
import java.io.FileReader;

public class ReadFileFast {
    public static void main(String[] args) {
        try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (Exception e) {
            System.out.println("Error reading file.");
        }
    }
}
```

---

# The Problem with `java.io` (Why it's old)

The old `java.io` package (File, FileReader) works, but it has issues:
- Error messages are generic (`IOException` instead of specific reasons).
- It handles symbolic links poorly.
- It doesn't support modern file attributes easily.
- It is blocking (Thread has to wait while disk spins).

**The Solution:** Java 7 introduced `java.nio.file` (NIO.2) which we will cover in the next chapter!

---

# 🏢 Company Example — Application Logging

In the real world, you don't use `System.out.println` because when the terminal closes, the logs are gone. You write logs to a file!

```java
import java.io.FileWriter;
import java.io.PrintWriter;
import java.time.LocalDateTime;

public class SimpleLogger {

    private static final String LOG_FILE = "application.log";

    public static void log(String level, String message) {
        // PrintWriter gives us a nice println() method for files
        try (PrintWriter out = new PrintWriter(new FileWriter(LOG_FILE, true))) {
            String logEntry = String.format("[%s] [%s] - %s", 
                LocalDateTime.now(), level, message);
            out.println(logEntry);
        } catch (Exception e) {
            System.err.println("CRITICAL: Failed to write to log file!");
        }
    }

    public static void main(String[] args) {
        log("INFO", "Application started on Port 8080");
        log("ERROR", "Database connection timeout");
    }
}
/* Output in application.log:
[2024-03-15T10:00:00] [INFO] - Application started on Port 8080
[2024-03-15T10:00:05] [ERROR] - Database connection timeout
*/
```
*(Note: In real Spring Boot projects, you will use libraries like Logback or SLF4J to do this automatically!)*

---

# Interview Questions

## Q1. Why do we need to close a file after writing to it?
> When you write to a file, the OS often stores the data in a temporary memory buffer to improve performance. If you don't close the file (or call `.flush()`), the buffer might never be flushed to the actual hard drive, resulting in empty or partially written files. Closing it also releases the file lock, allowing other programs to use it.

## Q2. What is the advantage of `try-with-resources`?
> It automatically closes the resources (like Files, DB connections, Network sockets) at the end of the statement, even if an exception is thrown. This prevents memory leaks and file lock issues without requiring messy `finally` blocks.

## Q3. What is the difference between `FileReader` and `BufferedReader`?
> `FileReader` reads the file byte-by-byte or char-by-char directly from the hard drive, which is extremely slow due to disk seek times. `BufferedReader` reads a large chunk of the file into RAM (a buffer) all at once, and then lets your Java program read from RAM, which is thousands of times faster.

---

# Professional Summary

```
java.io Basics:
- File: Represents the file path metadata (create, delete, exists).
- FileWriter / FileReader: Used to write/read characters.
- BufferedWriter / BufferedReader: Wraps Readers/Writers to improve performance significantly.
- ALWAYS use try-with-resources to ensure files are closed and flushed to disk.
```

---

# 🧠 Memory Trick
```
FileReader = Carrying one brick at a time from a truck to the house. (Slow)
BufferedReader = Putting 100 bricks into a wheelbarrow and bringing them in all at once. (Fast)
```

---

# 🚀 Next Chapter
We're upgrading! We will learn **NIO.2 (`java.nio.file.Files`)** — the modern, one-line way to read and write files in Java!
