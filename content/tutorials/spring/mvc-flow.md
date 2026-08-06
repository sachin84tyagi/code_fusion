User ने Browser खोला।

URL टाइप किया:

```text
GET http://localhost:8080/api/orders/123
```

Enter दबाया।

Response मिला:

```json
{
  "orderId": 123,
  "status": "DELIVERED",
  "total": 1299.00
}
```

---

लेकिन इस Response के पीछे।

Spring के अंदर।

एक पूरी कहानी चली।

---

# Chapter 34 – Spring MVC Internal Flow

---

# पूरा Flow एक नज़र में

```text
Browser
    ↓
Tomcat (HTTP Server)
    ↓
DispatcherServlet (Spring का Front Controller)
    ↓
HandlerMapping (कौन सा Controller?)
    ↓
HandlerAdapter (Controller को Call करो)
    ↓
Controller Method
    ↓
Service Layer
    ↓
Repository Layer
    ↓
Database
    ↓
Response (JSON/View)
    ↓
MessageConverter
    ↓
HTTP Response
    ↓
Browser
```

---

# Step 1 – Browser ने Request भेजी

```text
GET http://localhost:8080/api/orders/123
```

यह एक HTTP Request है।

TCP Connection बना।

Data भेजा।

---

# Step 2 – Tomcat ने Request Receive की

Tomcat = Embedded Web Server।

Spring Boot ने Startup पर Tomcat Start किया था।

```text
Server Started on Port 8080
```

Tomcat ने Request Receive की।

अब उसे किसी Servlet को देना है।

---

# Step 3 – DispatcherServlet – Spring का Front Controller ⭐⭐⭐⭐⭐

Tomcat ने Request `DispatcherServlet` को दी।

---

## DispatcherServlet क्या है?

```text
DispatcherServlet = Spring MVC का Heart

यह एक Servlet है जो:
  - सभी Requests Receive करता है
  - सही Controller ढूँढता है
  - Response बनाता है
```

---

## Front Controller Pattern

```text
❌ पुराना तरीका:
  /login  → LoginServlet
  /orders → OrderServlet
  /users  → UserServlet
  (हर URL का अलग Servlet)

✅ Spring MVC:
  सभी URLs → DispatcherServlet → Controller
  (एक Entry Point — सब Handle करता है)
```

---

## DispatcherServlet URL Mapping

```text
/* → DispatcherServlet (सभी Requests)
```

Spring Boot में यह Auto Configure होता है।

```java
// Auto Configured by WebMvcAutoConfiguration:
servletRegistrationBean.addUrlMappings("/*");
```

---

# Step 4 – HandlerMapping – Controller ढूँढना

DispatcherServlet के पास Request आई।

```text
GET /api/orders/123
```

DispatcherServlet ने पूछा:

> **"इस URL के लिए कौन सा Controller है?"**

उसने `HandlerMapping` से पूछा।

---

## HandlerMapping क्या करती है?

Application Start पर।

Spring ने सभी Controllers Scan किए।

सभी `@RequestMapping` / `@GetMapping` / `@PostMapping` Read किए।

एक Map बनाया:

```text
URL Pattern          → Controller Method
─────────────────────────────────────────
GET /api/orders/{id} → OrderController.getOrder()
POST /api/orders     → OrderController.createOrder()
DELETE /api/orders/{id} → OrderController.deleteOrder()
GET /api/users       → UserController.getAllUsers()
```

---

## DispatcherServlet ने Map देखा:

```text
Request: GET /api/orders/123

Map में ढूँढा: GET /api/orders/{id}

Match! → OrderController.getOrder(Long id)
```

---

## HandlerMapping Types

```text
RequestMappingHandlerMapping    → @RequestMapping Annotations
BeanNameUrlHandlerMapping       → Bean Name से URL Match
SimpleUrlHandlerMapping         → XML Configuration
```

Default: `RequestMappingHandlerMapping`।

---

# Step 5 – HandlerAdapter – Controller Call करना

HandlerMapping ने Method ढूँढ दिया।

लेकिन Method Call कौन करेगा?

**HandlerAdapter।**

---

## HandlerAdapter क्यों?

DispatcherServlet Generic है।

वह किसी भी Type के Handler को Call कर सकता है:

```text
@Controller Method
HttpRequestHandler
Servlet Interface
```

HandlerAdapter बीच में है।

---

## What HandlerAdapter Does

```java
// HandlerAdapter की Internal Logic (simplified):

public ModelAndView handle(HttpServletRequest req,
                           HttpServletResponse res,
                           Object handler) {

    // handler = OrderController.getOrder() method

    // Path Variable Extract करो
    // {id} = 123
    Long id = extractPathVariable(req, "id");

    // Method Call करो (Reflection)
    Object result = method.invoke(controller, id);

    // Result को ModelAndView में convert करो
    return new ModelAndView(result);
}
```

---

# Step 6 – Controller Method Executes

```java
@RestController
@RequestMapping("/api/orders")
class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable Long id) {

        // id = 123
        return orderService.findById(id);

    }
}
```

Controller ने Service Call की।

---

# Step 7 – Service Layer

```java
@Service
class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public OrderResponse findById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        return OrderMapper.toResponse(order);
    }
}
```

Service ने Repository Call की।

---

# Step 8 – Repository Layer

```java
@Repository
interface OrderRepository extends JpaRepository<Order, Long> {
    // findById Spring Data JPA देता है
}
```

Database Query चली।

```sql
SELECT * FROM orders WHERE id = 123
```

Data आया।

---

# Step 9 – Response बनना

Data Controller तक वापस आया।

```java
OrderResponse response = new OrderResponse(
    123L,
    "DELIVERED",
    1299.00
);
```

---

# Step 10 – MessageConverter – JSON Conversion

Controller ने `OrderResponse` Return किया।

यह Java Object है।

Browser को JSON चाहिए।

**MessageConverter** ने Convert किया।

---

## MessageConverter क्या करता है?

```text
Java Object → JSON (Jackson)
Java Object → XML (JAXB)
Java Object → Plain Text
```

---

## कौन सा Converter Use होगा?

```text
Request Header: Accept: application/json
    ↓
Spring ने देखा: Client JSON चाहता है
    ↓
MappingJackson2HttpMessageConverter चुना
    ↓
OrderResponse → JSON String
```

---

## Jackson Conversion

```java
OrderResponse response = new OrderResponse(123L, "DELIVERED", 1299.00);

// Jackson ने:
{
  "orderId": 123,
  "status": "DELIVERED",
  "total": 1299.00
}
```

---

# Step 11 – HTTP Response

JSON String HTTP Response में लिखी गई।

```text
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 65

{
  "orderId": 123,
  "status": "DELIVERED",
  "total": 1299.00
}
```

Browser को Response मिली।

---

# पूरा Flow — एक Diagram

```text
Browser: GET /api/orders/123
         ↓
Tomcat (HTTP Server)
         ↓
DispatcherServlet (Front Controller)
         ↓
HandlerMapping: "GET /api/orders/{id}" → OrderController.getOrder()
         ↓
HandlerAdapter: Method Arguments Resolve करो
  - @PathVariable id = 123
  - @RequestBody (if POST)
  - @RequestParam
  - etc.
         ↓
OrderController.getOrder(123L)
         ↓
OrderService.findById(123L)  [@Transactional]
         ↓
OrderRepository.findById(123L)
         ↓
Database: SELECT * FROM orders WHERE id = 123
         ↓
Order Entity → OrderResponse DTO
         ↓
Controller returns OrderResponse
         ↓
MappingJackson2HttpMessageConverter
  OrderResponse → JSON String
         ↓
HTTP Response 200 OK + JSON Body
         ↓
Browser
```

---

# Handler Interceptors

Request के आगे-पीछे Code चलाना हो:

```java
@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest req,
                             HttpServletResponse res,
                             Object handler) {
        // Controller से पहले
        String token = req.getHeader("Authorization");
        if (!isValid(token)) {
            res.setStatus(401);
            return false;  // Request Reject
        }
        return true;  // Continue
    }

    @Override
    public void postHandle(HttpServletRequest req,
                           HttpServletResponse res,
                           Object handler,
                           ModelAndView mav) {
        // Controller के बाद, Response Commit से पहले
    }

    @Override
    public void afterCompletion(HttpServletRequest req,
                                HttpServletResponse res,
                                Object handler,
                                Exception ex) {
        // Request Complete होने के बाद
        // Logging, Cleanup
    }
}

// Register करो:
@Configuration
class WebConfig implements WebMvcConfigurer {

    @Autowired
    AuthInterceptor authInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/auth/**");
    }
}
```

---

# ExceptionHandler – Error Response

```java
@RestController
class OrderController {

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable Long id) {
        return orderService.findById(id);
        // OrderNotFoundException throw हो सकती है
    }
}

// Global Exception Handler
@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(OrderNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleOrderNotFound(OrderNotFoundException ex) {
        return new ErrorResponse("ORDER_NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGeneral(Exception ex) {
        return new ErrorResponse("INTERNAL_ERROR", "Something went wrong");
    }
}
```

---

# @RequestBody और @ResponseBody

```java
@RestController
class OrderController {

    @PostMapping
    public OrderResponse createOrder(@RequestBody OrderRequest request) {
        // @RequestBody: JSON → Java Object (Jackson)
        return orderService.create(request);
        // @ResponseBody (from @RestController): Java Object → JSON
    }
}
```

---

## Content Negotiation

```text
Request: Accept: application/xml
    ↓
Spring: XML Converter चाहिए
    ↓
Jackson-XML Converter → XML Response

Request: Accept: application/json
    ↓
Spring: JSON Converter चाहिए
    ↓
Jackson JSON Converter → JSON Response
```

---

# Interview Questions

---

## Q1. DispatcherServlet क्या है?

**Answer:**

Spring MVC का Front Controller।

सभी HTTP Requests पहले DispatcherServlet पर आती हैं।

वह HandlerMapping से Controller ढूँढता है, HandlerAdapter से Call करता है, MessageConverter से Response बनाता है।

---

## Q2. HandlerMapping और HandlerAdapter में क्या अंतर है?

**Answer:**

```text
HandlerMapping:
  → कौन सा Controller/Method?
  → URL → Method Mapping ढूँढना

HandlerAdapter:
  → Controller को कैसे Call करें?
  → Arguments Resolve करना (@PathVariable, @RequestBody)
  → Method Invoke करना
```

---

## Q3. @RestController और @Controller में क्या अंतर है?

**Answer:**

```text
@Controller:
  → HTML View Return करता है (Thymeleaf, JSP)
  → @ResponseBody manually add करना होगा JSON के लिए

@RestController = @Controller + @ResponseBody
  → JSON/XML Return करता है
  → REST APIs के लिए
```

---

## Q4. Filter और Interceptor में क्या अंतर है?

**Answer:**

```text
Filter (Servlet Level):
  → Spring से पहले चलता है
  → सभी Requests (Static + Dynamic)
  → javax.servlet.Filter
  → CORS, Compression, Security

Interceptor (Spring MVC Level):
  → DispatcherServlet के बाद, Controller से पहले
  → Spring Beans Access कर सकता है
  → HandlerInterceptor
  → Authentication, Logging, Audit
```

---

## Q5. @ExceptionHandler और @ControllerAdvice क्या करते हैं?

**Answer:**

```text
@ExceptionHandler:
  → एक Controller के Exception Handle करो

@ControllerAdvice / @RestControllerAdvice:
  → सभी Controllers के Exceptions Handle करो (Global)
  → Centralized Exception Handling
```

---

# Best Practices

---

## 1. @RestControllerAdvice से Global Error Handling

```java
@RestControllerAdvice
class GlobalExceptionHandler {
    // एक जगह सब Exceptions Handle करो
}
```

---

## 2. DTO Pattern Use करो

```java
// ✅ Entity Direct Expose मत करो
@GetMapping("/{id}")
public OrderResponse getOrder(@PathVariable Long id) {
    // OrderResponse = DTO (Data Transfer Object)
    // Entity नहीं
}
```

---

## 3. ResponseEntity से Full Control

```java
@GetMapping("/{id}")
public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
    OrderResponse order = orderService.findById(id);
    return ResponseEntity
            .ok()
            .header("X-Custom-Header", "value")
            .body(order);
}
```

---

# Common Mistakes

---

## Mistake 1 — Service में Request/Response Objects

```java
// ❌ Service Layer को HTTP पता नहीं होनी चाहिए
@Service
class OrderService {
    public OrderResponse create(HttpServletRequest req) { }  // HTTP Object!
}

// ✅
@Service
class OrderService {
    public OrderResponse create(OrderRequest dto) { }  // Domain Object
}
```

---

## Mistake 2 — Entity Directly Return करना

```java
// ❌ Entity Expose करना — Security/Performance Risk
@GetMapping
public List<Order> getAllOrders() {
    return orderRepo.findAll();  // Lazy Loaded Relations → N+1
}

// ✅ DTO Return करो
@GetMapping
public List<OrderResponse> getAllOrders() {
    return orderService.getAllOrders();  // DTO with only needed fields
}
```

---

# इस Chapter का निष्कर्ष

```text
Request Journey:
  Browser → Tomcat → DispatcherServlet → HandlerMapping
  → HandlerAdapter → Controller → Service → Repository
  → Database → DTO → MessageConverter → JSON → Browser

Key Components:
  DispatcherServlet  → Front Controller (एक Entry Point)
  HandlerMapping     → URL → Method Mapping
  HandlerAdapter     → Controller Call करना
  MessageConverter   → Java ↔ JSON Conversion
  ExceptionHandler   → Error Response
  Interceptor        → Pre/Post Processing
```

---

### अगला Chapter

Request Flow समझ गए।

लेकिन अब एक सवाल:

> **"हर Request को Authenticate कैसे करें?"**
> **"कौन Login कर सकता है? कौन नहीं?"**
> **"Admin Pages सिर्फ Admin को?"**

अगला Chapter: **Spring Security Basics**
