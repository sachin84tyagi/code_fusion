Welcome to **Java — Chapter 38: NIO.2 (Modern File I/O)**.

> **Reading a file used to require 10 lines of `BufferedReader` and `try-catch` blocks. With Java NIO.2 (`java.nio.file`), you can do it in a single line of code!**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Old `java.io` is like sending a letter through the traditional post office. Lots of steps, lots of manual checking, very slow.

New `java.nio` (New I/O) is like sending an Email. One click, one line, and it's done immediately!

---

# The `Path` and `Paths` Classes

Instead of the old `File` class, NIO uses the `Path` interface. It is much smarter about handling operating system differences (Windows `\` vs Mac/Linux `/`).

```java
import java.nio.file.Path;
import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) {
        // Creating a Path (Modern alternative to new File())
        Path myPath = Paths.get("data.txt");
        // Or in Java 11+: Path myPath = Path.of("data.txt");
        
        System.out.println("File name: " + myPath.getFileName());
        System.out.println("Parent folder: " + myPath.getParent());
    }
}
```

---

# The Ultimate Helper Class: `Files`

The `Files` class contains static methods that do ALL the heavy lifting for you.

### 1. Read an entire file into a String (Java 11+)
```java
import java.nio.file.Files;
import java.nio.file.Path;

public class ReadWrite {
    public static void main(String[] args) throws Exception {
        Path path = Path.of("data.txt");

        // ONE LINE to read the whole file!
        String content = Files.readString(path);
        System.out.println(content);
    }
}
```

### 2. Read a file into a List of Strings (Line by Line)
```java
Path path = Path.of("data.txt");
List<String> lines = Files.readAllLines(path);

for (String line : lines) {
    System.out.println(line);
}
```

### 3. Write a String to a file (Java 11+)
```java
Path path = Path.of("output.txt");

// ONE LINE to write! (Automatically creates file, or overwrites if exists)
Files.writeString(path, "Hello Modern Java!");
```

---

# Powerful File Operations

The `Files` class makes copying, moving, and deleting incredibly simple.

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

public class FileOps {
    public static void main(String[] args) throws Exception {
        Path source = Path.of("source.txt");
        Path destination = Path.of("backup/source_backup.txt");

        // 1. Check if exists
        if (Files.exists(source)) {
            
            // 2. Copy (and replace if destination already exists)
            Files.copy(source, destination, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("File copied!");

            // 3. Move (Rename)
            // Files.move(source, Path.of("new_name.txt"));

            // 4. Delete
            // Files.delete(source); 
        }
    }
}
```

---

# Reading Massive Files (Streams)

If you have a 10GB log file, `Files.readAllLines()` will crash your app (`OutOfMemoryError`) because it tries to put 10GB into a `List`.
Instead, you should return a `Stream` of lines! The Stream processes the file line-by-line in memory, keeping memory usage virtually zero.

```java
Path logPath = Path.of("server.log");

// Combine NIO with the Streams API!
try (Stream<String> lines = Files.lines(logPath)) {
    
    // Find all "ERROR" lines and count them, without loading the whole file into RAM!
    long errorCount = lines
        .filter(line -> line.contains("ERROR"))
        .count();
        
    System.out.println("Total Errors: " + errorCount);
}
```

---

# 🏢 Company Example — Config File Loader

Applications need to load configuration settings (like Database URLs) from `.properties` files.

```java
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

public class ConfigLoader {
    public static Map<String, String> loadConfig(String filePath) {
        Map<String, String> config = new HashMap<>();
        Path path = Path.of(filePath);

        if (!Files.exists(path)) {
            System.out.println("Config file missing! Using defaults.");
            return config;
        }

        try (Stream<String> lines = Files.lines(path)) {
            lines.filter(line -> !line.isBlank() && !line.startsWith("#")) // Ignore empty & comments
                 .map(line -> line.split("=")) // Split key and value
                 .filter(parts -> parts.length == 2)
                 .forEach(parts -> config.put(parts[0].trim(), parts[1].trim()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return config;
    }

    public static void main(String[] args) {
        // Assuming app.properties contains: "db.port=3306"
        Map<String, String> conf = loadConfig("app.properties");
        System.out.println("DB Port is: " + conf.get("db.port"));
    }
}
```

---

# Interview Questions

## Q1. What is the difference between `java.io.File` and `java.nio.file.Path`?
> `File` is the old way (Java 1.0). `Path` is the modern way (Java 7+). `Path` is an interface, much more flexible, handles OS path formats better, and integrates seamlessly with the highly efficient `Files` utility class.

## Q2. How do you prevent OutOfMemoryError when reading a massive file?
> Do NOT use `Files.readAllLines()` or `Files.readString()`, as they load the entire file into RAM. Instead, use `Files.lines()`, which returns a `Stream<String>`. The stream reads and processes the file lazily, line-by-line, keeping memory footprint tiny.

## Q3. Are NIO file operations blocking or non-blocking?
> The basic methods in `Files` (like `readString` or `copy`) are blocking. However, the NIO (New I/O) package provides an `AsynchronousFileChannel` class that allows non-blocking file I/O operations (using Futures or callbacks) for high-performance servers.

---

# Professional Summary

```
NIO.2 (java.nio.file) is the modern standard for File handling.

- Path / Paths: Replaces the old java.io.File.
- Files: The ultimate utility class.
- Files.readString() / writeString(): 1-line I/O for small files.
- Files.lines(): Returns a Stream<String> for processing huge files efficiently.
- Files.copy() / move() / delete(): Easy file manipulation.
```

---

# 🧠 Memory Trick
```
io = Old, clunky, 10 lines of code.
nio = NEW, sleek, 1 line of code using the Files class.
```

---

# 🚀 Next Chapter
Phase 10 begins! We'll look at the newest, cutting-edge features of Java, starting with **Records** (Java 16) — the ultimate boilerplate killer!
