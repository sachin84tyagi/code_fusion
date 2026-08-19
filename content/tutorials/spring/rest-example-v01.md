# REST Workflow — BelloController Explained
> A simple, top-to-bottom explanation of how the REST API works in this project.

---

## 📄 BelloController.java — Top to Bottom

---

### 🔹 Lines 1–10 — Package & Imports

```java
package com.example.helloapi;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
// ... more imports
```

**Simply:** You are telling Java —
- `package` → *"This file lives in this folder/group"*
- `import` → *"I need these Spring tools to build my API"*

Think of imports like **plugging in tools** before you start building.

---

### 🔹 Line 12 — `@RestController`

```java
@RestController
public class BelloController {
```

**Simply:** This one annotation does **two jobs** at once:
1. Tells Spring → *"This class handles web requests"*
2. Tells Spring → *"Always return data as JSON, not a web page"*

Without this, Spring would not know this class is an API.

---

### 🔹 Lines 36–39 — First GET Method (PathVariable)

```java
@GetMapping("/bello/{id}")
public BelloResponse sayBello(@PathVariable int id) {
    return new BelloResponse("Bello, World!", id, "Suresh");
}
```

**Simply:**
- Someone visits → `GET /bello/42`
- `{id}` in the URL → the `42` is captured by `@PathVariable` and stored as `int id`
- The method builds a `BelloResponse` and sends it back as JSON

```
Browser hits:  /bello/42
                      ↑
              id = 42 (captured from URL)

Response JSON: { "message": "Bello, World!", "id": 42, "name": "Suresh" }
```

---

### 🔹 Lines 41–44 — Second GET Method (RequestParam)

```java
@GetMapping("/bello")
public BelloResponse sayBello(@RequestParam int id, @RequestParam(required = false) String name) {
    return new BelloResponse("Bello, World!", id, name);
}
```

**Simply:**
- Someone visits → `GET /bello?id=42&name=Ram`
- Values come from the **query string** (after the `?`)
- `required = false` on `name` means → name is **optional**, won't crash if missing

```
Browser hits:  /bello?id=42&name=Ram
                      ↑        ↑
                  id=42     name="Ram"

Response JSON: { "message": "Bello, World!", "id": 42, "name": "Ram" }
```

> **PathVariable vs RequestParam in one line:**
> - PathVariable → value is **inside** the URL path `/bello/42`
> - RequestParam → value is **after `?`** in the URL `/bello?id=42`

---

### 🔹 Lines 53–56 — POST Method

```java
@PostMapping("/bello")
public BelloResponse createBello(@RequestBody BelloRequest request) {
    return new BelloResponse("Bello Created", request.getId(), request.getName());
}
```

**Simply:**
- Client sends → `POST /bello` with a **JSON body**
- `@RequestBody` reads that JSON and converts it into a `BelloRequest` object
- You call `request.getId()` and `request.getName()` to read the values
- Return a `BelloResponse` confirming creation

```
Client sends:
  POST /bello
  Body: { "id": 1, "name": "Suresh" }
               ↓
  @RequestBody converts it → BelloRequest object
               ↓
Response JSON: { "message": "Bello Created", "id": 1, "name": "Suresh" }
```

---

### 🔹 Lines 65–68 — PUT Method

```java
@PutMapping("/bello/{id}")
public BelloResponse updateBello(@PathVariable int id, @RequestBody BelloRequest request) {
    return new BelloResponse("Bello Updated", id, request.getName());
}
```

**Simply:**
- Client sends → `PUT /bello/42` with a **JSON body**
- Two sources of data here:
  - `@PathVariable` → gets `42` from the URL (which record to update)
  - `@RequestBody` → gets the new data from the JSON body (what to update it to)

```
Client sends:
  PUT /bello/42              <- which one to update (PathVariable)
  Body: { "name": "Ram" }   <- what to update it with (RequestBody)
               ↓
Response JSON: { "message": "Bello Updated", "id": 42, "name": "Ram" }
```

---

### 🔹 Lines 77–80 — DELETE Method

```java
@DeleteMapping("/bello/{id}")
public BelloResponse deleteBello(@PathVariable int id) {
    return new BelloResponse("Bello Deleted", id, "Suresh");
}
```

**Simply:**
- Client sends → `DELETE /bello/42`
- `@PathVariable` grabs `42` from the URL
- **No body is needed** — the URL alone is enough to identify what to delete

```
Client sends:
  DELETE /bello/42
               ↑
          id = 42 (PathVariable)

Response JSON: { "message": "Bello Deleted", "id": 42, "name": "Suresh" }
```

---

## 🗺️ The Whole File at a Glance

| Method | URL | Where data comes from | Purpose |
|--------|-----|-----------------------|---------|
| `GET` | `/bello/42` | URL path (`@PathVariable`) | Read one record by ID |
| `GET` | `/bello?id=42` | Query string (`@RequestParam`) | Read with optional filters |
| `POST` | `/bello` | JSON body (`@RequestBody`) | Create a new record |
| `PUT` | `/bello/42` | URL path **+** JSON body | Update an existing record |
| `DELETE` | `/bello/42` | URL path only, no body | Delete a record by ID |

---

## 📥 BelloRequest.java — Incoming Data

> **Role:** Represents what the **client sends TO the server** (the request body JSON).

```java
public class BelloRequest {
    private int id;
    private String name;
    // getters + setters
}
```

| Step | Element | Purpose |
|------|---------|---------|
| **1** | `private int id` / `private String name` | Fields that mirror the JSON the client sends — `{"id":1,"name":"Suresh"}` |
| **2** | `getId()` | Getter — Controller reads the id with `request.getId()` |
| **3** | `setId()` | Setter — Spring/Jackson calls this automatically to fill the field from JSON |
| **4** | `getName()` | Getter — Controller reads the name with `request.getName()` |
| **5** | `setName()` | Setter — Spring/Jackson calls this automatically to fill the field from JSON |

**Key insight:** You never call the setters yourself. When `@RequestBody` receives the JSON,
**Jackson (Spring's JSON library)** automatically calls `setId()` and `setName()` behind the scenes.

```
Client JSON                      BelloRequest Object
{ "id": 1, "name": "Suresh" }  ->  id=1, name="Suresh"
                                         ↑
                                   Jackson did this
```

---

## 📤 BelloResponse.java — Outgoing Data

> **Role:** Represents what the **server sends BACK to the client** (the response body JSON).

```java
public class BelloResponse {
    private String message;
    private int id;
    private String name;

    public BelloResponse(String message, int id, String name) { ... }
    // getters + setters
}
```

| Step | Element | Purpose |
|------|---------|---------|
| **1** | `private String message` / `int id` / `String name` | Three fields that become the JSON keys in the response |
| **2** | `BelloResponse(message, id, name)` | Constructor — Controller builds the reply object in one line |
| **3** | `getMessage()` | Getter — Spring reads this → puts `"message": "..."` in JSON |
| **4** | `setMessage()` | Setter — allows changing message after object creation |
| **5** | `getId()` | Getter — Spring reads this → puts `"id": 1` in JSON |
| **6** | `setId()` | Setter — allows changing id after object creation |
| **7** | `getName()` | Getter — Spring reads this → puts `"name": "..."` in JSON |
| **8** | `setName()` | Setter — allows changing name after object creation |

**Key insight:** You never call the getters yourself for JSON conversion. When the Controller
returns a `BelloResponse` object, **Jackson automatically calls all getters** and builds the JSON.

```
BelloResponse Object               Client JSON
message="Bello Created"            { "message": "Bello Created",
id=1                      ->         "id": 1,
name="Suresh"                        "name": "Suresh" }
                                            ↑
                                      Jackson did this
```

---

## 🔄 Full Request → Response Flow

```
Client                Controller               BelloRequest / BelloResponse
  │                       │                              │
  │── POST /bello ────────►│                              │
  │  {"id":1,"name":"X"}   │── @RequestBody ─────────────►│  BelloRequest (Jackson fills it)
  │                        │◄── request.getId()            │
  │                        │    request.getName()          │
  │                        │── new BelloResponse(...) ────►│  BelloResponse (you fill it)
  │◄── JSON response ──────│◄── Jackson serializes ────────│
```

---

*Generated for learning purposes — Spring Boot REST API v01*




```java
package com.example.helloapi;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
public class BelloController {


    // 1. @RestController
    //         ↓
    // Controller को REST controller बनाता है

    // 2. @GetMapping
    //         ↓
    // GET URL को method से जोड़ता है

    // 3. @PathVariable
    //         ↓
    // /bello/42
    //         ↑
    // URL path से value लेता है

    // 4. @RequestParam
    //         ↓
    // /bello?id=42
    //       ↑
    // Query string से value लेता है

    @GetMapping("/bello/{id}")
    public BelloResponse sayBello(@PathVariable int id) {
    return new BelloResponse("Bello, World!", id, "Suresh");
    }

    @GetMapping("/bello")
    public BelloResponse sayBello(@RequestParam int id, @RequestParam(required = false) String name) {
        return new BelloResponse("Bello, World!", id, name);
    }

    // 5. @PostMapping + @RequestBody
    //         ↓
    // POST /bello
    //         ↑
    // नया resource बनाता है
    // Client JSON body भेजता है → @RequestBody उसे BelloRequest object में convert करता है

    @PostMapping("/bello")
    public BelloResponse createBello(@RequestBody BelloRequest request){
        return new BelloResponse("Bello Created", request.getId(), request.getName());
    }

    // 6. @PutMapping + @PathVariable + @RequestBody
    //         ↓
    // PUT /bello/42
    //         ↑
    // Existing resource को update करता है
    // URL से id लेता है (@PathVariable) + body से नया data लेता है (@RequestBody)

    @PutMapping("/bello/{id}")
    public BelloResponse updateBello(@PathVariable int id, @RequestBody BelloRequest request){
        return new BelloResponse("Bello Updated", id, request.getName());
    }

    // 7. @DeleteMapping + @PathVariable
    //         ↓
    // DELETE /bello/42
    //         ↑
    // Resource को delete करता है
    // URL path से id लेता है — कोई body नहीं भेजी जाती

    @DeleteMapping("/bello/{id}")
    public BelloResponse deleteBello(@PathVariable int id){
        return new BelloResponse("Bello Deleted", id, "Suresh" );
    }
}
```



```java
package com.example.helloapi;

public class BelloRequest {

    // 1. Private Fields (निजी fields)
    //         ↓
    // यह class client के भेजे हुए JSON data को hold करती है
    // { "id": 1, "name": "Suresh" }
    //       ↑           ↑
    //    int id      String name
    private int id;
    private String name;

    // 2. Getter — getId()
    //         ↓
    // id की value बाहर देता है (read करने के लिए)
    // Controller इसे use करता है: request.getId()
    public int getId() {
        return id;
    }

    // 3. Setter — setId()
    //         ↓
    // Spring Boot JSON से id की value यहाँ set करता है
    // (Jackson library automatically call करती है)
    public void setId(int id) {
        this.id = id;
    }

    // 4. Getter — getName()
    //         ↓
    // name की value बाहर देता है (read करने के लिए)
    // Controller इसे use करता है: request.getName()
    public String getName() {
        return name;
    }

    // 5. Setter — setName()
    //         ↓
    // Spring Boot JSON से name की value यहाँ set करता है
    // (Jackson library automatically call करती है)
    public void setName(String name) {
        this.name = name;
    }

}
```


```java
package com.example.helloapi;

public class BelloResponse {

    // 1. Private Fields (निजी fields)
    //         ↓
    // यह class server का reply hold करती है
    // तीन चीज़ें: message, id, और name
    //
    //  { "message": "Bello Created", "id": 1, "name": "Suresh" }
    //        ↑                          ↑            ↑
    //    String message              int id       String name
    private String message;
    private int id;
    private String name;

    // 2. Constructor
    //         ↓
    // Object बनाते वक्त एक साथ तीनों values set हो जाती हैं
    // Controller यहीं से object बनाता है:
    // return new BelloResponse("Bello Created", request.getId(), request.getName());
    //                               ↑                  ↑                ↑
    //                           message               id              name
    public BelloResponse(String message, int id, String name) {
        this.message = message;
        this.id = id;
        this.name = name;
    }

    // 3. Getter — getMessage()
    //         ↓
    // Spring Boot यह value JSON में डालता है → "message": "Bello Created"
    public String getMessage() {
        return message;
    }

    // 4. Setter — setMessage()
    //         ↓
    // Constructor के बाद message बदलना हो तो यह use होता है
    public void setMessage(String message) {
        this.message = message;
    }

    // 5. Getter — getId()
    //         ↓
    // Spring Boot यह value JSON में डालता है → "id": 1
    public int getId() {
        return id;
    }

    // 6. Setter — setId()
    //         ↓
    // Constructor के बाद id बदलना हो तो यह use होता है
    public void setId(int id) {
        this.id = id;
    }

    // 7. Getter — getName()
    //         ↓
    // Spring Boot यह value JSON में डालता है → "name": "Suresh"
    public String getName() {
        return name;
    }

    // 8. Setter — setName()
    //         ↓
    // Constructor के बाद name बदलना हो तो यह use होता है
    public void setName(String name) {
        this.name = name;
    }
}
```
