# 🚀 Bello API — Complete End-to-End Workflow

---

## 🏛️ The Big Picture: Meet the Four Layers

Before we dive into actual requests, let's understand the cast of characters.
Think of your API like a **restaurant** 🍽️:

| Layer | Java Class | Restaurant Analogy | Job |
|---|---|---|---|
| **Controller** | `BelloController` | 🧑‍💼 Waiter | Takes the customer's order, passes it to the kitchen |
| **Service** | `BelloService` | 👨‍🍳 Head Chef | Decides HOW to cook, applies the business logic |
| **Repository** | `BelloRepository` | 🏪 Pantry/Storeroom | Fetches raw ingredients (data) |
| **Entity** | `Bello` | 🥩 Raw Ingredient | The raw data object from the database/store |

And then there are the **delivery boxes** (DTOs — Data Transfer Objects):

| Class | Purpose |
|---|---|
| `BelloRequest` | 📦 Box the CLIENT sends TO the server (carries `id` and `name`) |
| `BelloResponse` | 📤 Box the SERVER sends BACK to the client (carries `message`, `id`, `name`) |

---

## 📦 The Supporting Classes (DTOs & Entity) — Explained First

> Before we trace a request, let's understand all the data containers used in the workflow.

### 📥 `BelloRequest` — What the Client Sends (POST & PUT only)

```java
public class BelloRequest {
    private int id;
    private String name;

    // Getters & Setters
    public int getId()          { return id; }
    public void setId(int id)   { this.id = id; }
    public String getName()          { return name; }
    public void setName(String name) { this.name = name; }
}
```

**Simple rule:** When the user sends a JSON body like `{"id": 10, "name": "Rahul"}`,
Spring Boot automatically uses `setId()` and `setName()` to fill this object.
The magic library doing this behind the scenes is called **Jackson**.

---

### 📤 `BelloResponse` — What the Server Sends Back (ALL endpoints)

```java
public class BelloResponse {
    private String message;
    private int id;
    private String name;

    // Constructor (used to create the response in one shot)
    public BelloResponse(String message, int id, String name) {
        this.message = message;
        this.id = id;
        this.name = name;
    }

    // Getters & Setters (Spring Boot reads getters to build the JSON)
    public String getMessage() { return message; }
    public int getId()         { return id; }
    public String getName()    { return name; }
    // ... and setters
}
```

**Simple rule:** When we `return` a `BelloResponse`, Spring Boot reads all the
**getter methods** (`getMessage()`, `getId()`, `getName()`) and converts them into JSON automatically.

---

### 🥩 `Bello` — The Entity (Raw Data Object)

```java
public class Bello {
    private String message;
    private int id;
    private String name;

    public Bello(String message, int id, String name) {
        this.message = message;
        this.id = id;
        this.name = name;
    }

    public String getMessage() { return message; }
    public int getId()         { return id; }
    public String getName()    { return name; }
}
```

**Simple rule:** `Bello` is the **internal data object**. It lives in the
`Entity` package and represents data as it comes from the storage/database layer.
We **never** send this directly to the user. We always convert it into a `BelloResponse` first.

> 💡 **Why not just use `Bello` as the response?**
> Because in a real application, the database entity might have sensitive fields
> (like passwords, internal IDs, etc.) that you don't want to expose to the outside world.
> The `BelloResponse` DTO acts as a **safe filter** — you choose exactly what to share.

---

## 🌐 The 5 API Endpoints — Full Workflow For Each

Your `BelloController` handles **5 types of requests**.
Let's trace each one from the first character typed in Postman/browser
all the way to the JSON response the user receives.

---

## 1️⃣ GET `/bello/{id}` — Fetch by Path Variable

**Real Example:** User visits `GET http://localhost:8080/bello/10`

### Step-by-Step Flow:

**🟢 Step 1 — Request hits the Controller**
```java
// BelloController.java
@GetMapping("/bello/{id}")
public BelloResponse sayBello(@PathVariable int id) {
    return service.sayBello("Bello, World!", id, "Suresh");
}
```
- `@GetMapping("/bello/{id}")` — Spring Boot sees this URL pattern and routes the request here.
- `@PathVariable int id` — Spring Boot pulls `10` straight out of the URL path (`/bello/10`) and puts it into the `id` variable.
- The controller then calls the **Service** (the chef), passing `message = "Bello, World!"`, `id = 10`, `name = "Suresh"` (hardcoded here).

---

**🟡 Step 2 — Service processes the request**
```java
// BelloService.java
public BelloResponse sayBello(String message, Integer id, String name) {
    System.out.println("I'm in Serice " + message + id + name);
    Bello bello = belloRepository.findById(id, name);
    return new BelloResponse("Hello, " + name + "!!", id, name);
}
```
- Prints a log message to your console: `I'm in Serice Bello, World!10Suresh`
- Asks the Repository (the pantry) to fetch data: `belloRepository.findById(10, "Suresh")`
- Receives a `Bello` entity back from the Repository.
- Packages the result into a `BelloResponse` delivery box and sends it back to the Controller.

---

**🔵 Step 3 — Repository fetches the data**
```java
// BelloRepository.java
public Bello findById(int id, String name) {
    return new Bello("Hello, " + name + "!!", id, name);
}
```
- In a real production app, this would hit a database (MySQL, PostgreSQL, etc.).
- Here, it simulates it by constructing a `Bello` object manually:
  `new Bello("Hello, Suresh!!", 10, "Suresh")`
- Returns this `Bello` entity back to the Service.

---

**✅ Step 4 — Response travels back & becomes JSON**
- The `BelloResponse` object travels: **Repository → Service → Controller → Spring Boot → JSON → User**
- Spring Boot calls the getter methods on `BelloResponse` and creates JSON automatically.

**Final JSON response the user sees:**
```json
{
  "message": "Hello, Suresh!!",
  "id": 10,
  "name": "Suresh"
}
```

---

## 2️⃣ GET `/bello` — Fetch by Query Parameters

**Real Example:** User visits `GET http://localhost:8080/bello?id=10&name=Rahul`

### Step-by-Step Flow:

**🟢 Step 1 — Request hits the Controller**
```java
// BelloController.java
@GetMapping("/bello")
public BelloResponse sayBello(
    @RequestParam(required = false) Integer id,
    @RequestParam(required = false) String name) {
    return service.sayBello("Hello, " + name + "!!", id, name);
}
```
- `@GetMapping("/bello")` — Routes the request here (no `{id}` in the path this time).
- `@RequestParam` — Spring Boot reads the part AFTER the `?` in the URL.
  - `id = 10` is extracted from `?id=10`
  - `name = "Rahul"` is extracted from `&name=Rahul`
- `required = false` means these are optional — the app won't crash if the user doesn't send them (they'll just be `null`).
- Calls `service.sayBello("Hello, Rahul!!", 10, "Rahul")`.

---

**🟡 Step 2 — Service processes the request**
```java
// BelloService.java
public BelloResponse sayBello(String message, Integer id, String name) {
    System.out.println("I'm in Serice " + message + id + name);
    Bello bello = belloRepository.findById(id, name);
    return new BelloResponse("Hello, " + name + "!!", id, name);
}
```
- Console prints: `I'm in Serice Hello, Rahul!!10Rahul`
- Fetches `Bello` from Repository.
- Creates and returns `BelloResponse("Hello, Rahul!!", 10, "Rahul")`.

---

**🔵 Step 3 — Repository fetches the data**
```java
// BelloRepository.java
public Bello findById(int id, String name) {
    return new Bello("Hello, Rahul!!", 10, "Rahul");
}
```

---

**✅ Final JSON response:**
```json
{
  "message": "Hello, Rahul!!",
  "id": 10,
  "name": "Rahul"
}
```

> 💡 **Path Variable vs Query Param — What's the difference?**
>
> | Feature | Path Variable | Query Parameter |
> |---|---|---|
> | URL looks like | `/bello/10` | `/bello?id=10` |
> | Annotation | `@PathVariable` | `@RequestParam` |
> | Typically used for | Required, specific resource ID | Optional filters, search params |

---

## 3️⃣ POST `/bello` — Create a New Bello

**Real Example:** User sends `POST http://localhost:8080/bello`
with this JSON body:
```json
{
  "id": 5,
  "name": "Priya"
}
```

### Step-by-Step Flow:

**🟢 Step 1 — Request hits the Controller**
```java
// BelloController.java
@PostMapping("/bello")
public BelloResponse createBello(@RequestBody BelloRequest request) {
    return new BelloResponse("Bello Created", request.getId(), request.getName());
}
```
- `@PostMapping("/bello")` — Routes POST requests to this URL here.
- `@RequestBody BelloRequest request` — This is where the magic happens!
  - Spring Boot's **Jackson library** reads the JSON body `{"id": 5, "name": "Priya"}`
  - It automatically calls `request.setId(5)` and `request.setName("Priya")` on the `BelloRequest` object.
  - Now `request.getId()` returns `5` and `request.getName()` returns `"Priya"`.
- The controller creates a `BelloResponse` **directly** (no Service call here for now).
- Returns `new BelloResponse("Bello Created", 5, "Priya")`.

> 📝 **Notice!** This endpoint does NOT call the Service or Repository.
> The Controller handles it directly. In a real production app,
> you'd call `service.createBello(request)` to save to the database.

---

**✅ Final JSON response:**
```json
{
  "message": "Bello Created",
  "id": 5,
  "name": "Priya"
}
```

---

## 4️⃣ PUT `/bello/{id}` — Update an Existing Bello

**Real Example:** User sends `PUT http://localhost:8080/bello/5`
with this JSON body:
```json
{
  "name": "Priya Updated"
}
```

### Step-by-Step Flow:

**🟢 Step 1 — Request hits the Controller**
```java
// BelloController.java
@PutMapping("/bello/{id}")
public BelloResponse updateBello(@PathVariable int id, @RequestBody BelloRequest request) {
    return new BelloResponse("Bello Updated", id, request.getName());
}
```
- `@PutMapping("/bello/{id}")` — Routes PUT requests here.
- **Two sources of data this time!**
  - `@PathVariable int id` — Extracts `5` from the URL path (`/bello/5`). This tells us WHICH record to update.
  - `@RequestBody BelloRequest request` — Reads the JSON body to get the NEW values (`name = "Priya Updated"`).
- Directly creates and returns `new BelloResponse("Bello Updated", 5, "Priya Updated")`.

> 📝 **Why two sources?** The ID comes from the URL (which record to update)
> and the NEW data comes from the body (what to update it to).
> This is a standard REST API design pattern.

---

**✅ Final JSON response:**
```json
{
  "message": "Bello Updated",
  "id": 5,
  "name": "Priya Updated"
}
```

---

## 5️⃣ DELETE `/bello/{id}` — Delete a Bello

**Real Example:** User sends `DELETE http://localhost:8080/bello/5`

### Step-by-Step Flow:

**🟢 Step 1 — Request hits the Controller**
```java
// BelloController.java
@DeleteMapping("/bello/{id}")
public BelloResponse deleteBello(@PathVariable int id) {
    return new BelloResponse("Bello Deleted", id, "Suresh");
}
```
- `@DeleteMapping("/bello/{id}")` — Routes DELETE requests here.
- `@PathVariable int id` — Extracts `5` from the URL (the record to delete).
- Directly creates and returns a confirmation response.

> 📝 **Notice!** A DELETE request has no body. You only need to tell the server
> WHICH record to delete (via the URL `id`).

---

**✅ Final JSON response:**
```json
{
  "message": "Bello Deleted",
  "id": 5,
  "name": "Suresh"
}
```

---

## 🔁 The Complete Layer-by-Layer Data Flow (Visual)

```
USER / POSTMAN / BROWSER
         │
         │  HTTP Request (URL + Method + Body)
         ▼
┌─────────────────────────────────────────────┐
│           BelloController                   │
│  (@RestController)                          │
│                                             │
│  - Reads @PathVariable → from URL path      │
│  - Reads @RequestParam → from URL ?key=val  │
│  - Reads @RequestBody  → from JSON body     │
│  - Calls service.sayBello(...)              │
└───────────────┬─────────────────────────────┘
                │  service.sayBello(message, id, name)
                ▼
┌─────────────────────────────────────────────┐
│             BelloService                    │
│  (@Service)                                 │
│                                             │
│  - Applies business logic                   │
│  - Calls belloRepository.findById(id, name) │
│  - Creates BelloResponse from Bello data    │
└───────────────┬─────────────────────────────┘
                │  belloRepository.findById(id, name)
                ▼
┌─────────────────────────────────────────────┐
│           BelloRepository                   │
│  (@Repository)                              │
│                                             │
│  - Fetches data from DB (simulated here)    │
│  - Returns a Bello entity object            │
└───────────────┬─────────────────────────────┘
                │  returns Bello object
                ▼
┌─────────────────────────────────────────────┐
│              Bello (Entity)                 │
│                                             │
│  - Raw data object: message, id, name       │
│  - Has getters: getMessage(), getId(),      │
│    getName()                                │
└───────────────┬─────────────────────────────┘
                │  Service reads Bello, creates BelloResponse
                ▼
┌─────────────────────────────────────────────┐
│           BelloResponse (DTO)               │
│                                             │
│  - Safe delivery box for the user           │
│  - Has: message, id, name                  │
│  - Spring Boot reads getters → JSON         │
└───────────────┬─────────────────────────────┘
                │  JSON Response
                ▼
         USER sees JSON ✅
```

---

## 📊 All 5 Endpoints at a Glance

| # | Method | URL | Input | Who does work | Response message |
|---|---|---|---|---|---|
| 1 | GET | `/bello/{id}` | Path Variable | Controller → Service → Repository | `Hello, Suresh!!` |
| 2 | GET | `/bello?id=&name=` | Query Params | Controller → Service → Repository | `Hello, Rahul!!` |
| 3 | POST | `/bello` | JSON Body | Controller only | `Bello Created` |
| 4 | PUT | `/bello/{id}` | Path Var + JSON Body | Controller only | `Bello Updated` |
| 5 | DELETE | `/bello/{id}` | Path Variable | Controller only | `Bello Deleted` |

---

## 🧠 Key Concepts Summary

| Concept | What it does | Where used |
|---|---|---|
| `@RestController` | Marks class as a REST API controller. Every method returns data (JSON), not a web page | `BelloController` |
| `@GetMapping` | Handles HTTP GET requests | Read data endpoints |
| `@PostMapping` | Handles HTTP POST requests | Create data endpoints |
| `@PutMapping` | Handles HTTP PUT requests | Update data endpoints |
| `@DeleteMapping` | Handles HTTP DELETE requests | Delete data endpoints |
| `@PathVariable` | Reads value from URL path (e.g., `/bello/10` → `id = 10`) | GET, PUT, DELETE |
| `@RequestParam` | Reads value from URL query string (e.g., `?name=Rahul`) | GET with filters |
| `@RequestBody` | Reads value from JSON request body | POST, PUT |
| `@Service` | Marks class as a Service (business logic layer) | `BelloService` |
| `@Repository` | Marks class as a Repository (data access layer) | `BelloRepository` |
| **DTO** | Data Transfer Object — safe data container for input/output | `BelloRequest`, `BelloResponse` |
| **Entity** | Raw database/domain object — internal use only | `Bello` |
| **Jackson** | The Spring Boot library that converts JSON ↔ Java automatically | Behind the scenes everywhere |

---

> 🎉 **You now know the complete Bello API workflow from end to end!**
> Every request, every layer, every annotation — nothing was skipped.
> Happy coding! 🚀
