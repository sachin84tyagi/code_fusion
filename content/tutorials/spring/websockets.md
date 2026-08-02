Welcome to **Chapter 44 — WebSockets with Spring Boot**.

> **WebSockets enable real-time, bidirectional communication. Live chat, notifications, dashboards — all become possible without polling.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine two people connected by a tin-can telephone.

```
Normal HTTP (request-response):
  You shout "Hello?" → Wait → Other person replies → Connection ends
  Every message = new phone call

WebSocket (persistent):
  You connect → Line stays open
  Either person can speak anytime
  No need to call again and again
```

WebSockets = **tin-can telephone that stays connected**.

---

# HTTP vs WebSocket

| Feature | HTTP | WebSocket |
| --- | --- | --- |
| Connection | New per request | Persistent |
| Direction | Request-Response | Bidirectional |
| Use case | CRUD APIs | Real-time, chat, games |
| Overhead | High (headers per request) | Low (after handshake) |
| Protocol | HTTP/HTTPS | ws:// / wss:// |

---

# Adding WebSocket Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

---

# WebSocket Configuration (STOMP)

STOMP = Simple Text Oriented Messaging Protocol — provides message channels over WebSocket.

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Prefix for messages from server to client
        registry.enableSimpleBroker("/topic", "/queue");

        // Prefix for messages from client to server
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")           // WebSocket URL
            .setAllowedOriginPatterns("*")    // CORS
            .withSockJS();                     // Fallback for older browsers
    }
}
```

---

# Message Model

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private String sender;
    private String content;
    private MessageType type;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime timestamp;

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
}
```

---

# WebSocket Controller

```java
@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Handle messages from client to /app/chat.sendMessage
    // Broadcasts to /topic/public
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage message) {
        message.setTimestamp(LocalTime.now());
        return message; // Broadcast to all subscribers
    }

    // Handle join event
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        message.setType(ChatMessage.MessageType.JOIN);
        message.setContent(message.getSender() + " joined the chat");
        message.setTimestamp(LocalTime.now());
        return message;
    }
}
```

---

# Private Messaging (User-Specific)

```java
@Controller
@RequiredArgsConstructor
public class PrivateChatController {

    private final SimpMessagingTemplate messagingTemplate;

    // Send private message to specific user
    @MessageMapping("/private-message")
    public void sendPrivateMessage(@Payload PrivateMessage message) {
        // Send to /queue/messages for the specific recipient
        messagingTemplate.convertAndSendToUser(
            message.getRecipient(),
            "/queue/messages",
            message
        );
    }

    // Push notification from server to specific user (outside request context)
    public void pushNotification(String username, Notification notification) {
        messagingTemplate.convertAndSendToUser(
            username,
            "/queue/notifications",
            notification
        );
    }
}
```

---

# Handling Connect/Disconnect Events

```java
@Component
@Slf4j
public class WebSocketEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        log.info("New WebSocket connection");
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            log.info("User disconnected: {}", username);

            ChatMessage leaveMessage = new ChatMessage();
            leaveMessage.setType(ChatMessage.MessageType.LEAVE);
            leaveMessage.setContent(username + " left the chat");
            leaveMessage.setSender(username);

            messagingTemplate.convertAndSend("/topic/public", leaveMessage);
        }
    }
}
```

---

# Frontend JavaScript Client

```html
<!-- index.html -->
<script src="https://cdn.jsdelivr.net/npm/sockjs-client/dist/sockjs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@stomp/stompjs/bundles/stomp.umd.min.js"></script>

<script>
    let stompClient = null;

    function connect() {
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);

            // Subscribe to public channel
            stompClient.subscribe('/topic/public', function (message) {
                const msg = JSON.parse(message.body);
                showMessage(msg);
            });

            // Subscribe to private messages
            stompClient.subscribe('/user/queue/messages', function (message) {
                const msg = JSON.parse(message.body);
                showPrivateMessage(msg);
            });

            // Join
            stompClient.send('/app/chat.addUser',
                {},
                JSON.stringify({ sender: 'Sachin', type: 'JOIN' })
            );
        });
    }

    function sendMessage(content) {
        stompClient.send('/app/chat.sendMessage',
            {},
            JSON.stringify({ sender: 'Sachin', content: content, type: 'CHAT' })
        );
    }

    function disconnect() {
        stompClient.disconnect();
    }
</script>
```

---

# WebSocket with Security

```java
@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
            .simpDestMatchers("/app/**").authenticated()
            .simpSubscribeDestMatchers("/topic/**").authenticated()
            .simpSubscribeDestMatchers("/user/**").authenticated()
            .anyMessage().authenticated();
    }

    @Override
    protected boolean sameOriginDisabled() {
        return true; // Required for SockJS
    }
}
```

---

# Real-Time Dashboard Updates

Push updates from server to all connected clients:

```java
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate = 5000) // Every 5 seconds
    public void pushDashboardUpdate() {
        DashboardStats stats = collectStats();
        messagingTemplate.convertAndSend("/topic/dashboard", stats);
    }

    private DashboardStats collectStats() {
        return new DashboardStats(
            orderService.getActiveOrderCount(),
            driverService.getOnlineDriverCount(),
            revenueService.getTodayRevenue()
        );
    }
}
```

---

# Company Example — Slack

Slack's real-time messaging:

```java
@Controller
@RequiredArgsConstructor
public class SlackMessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    // User sends message to a channel
    @MessageMapping("/channels/{channelId}/send")
    public void sendChannelMessage(
        @DestinationVariable String channelId,
        @Payload SendMessageRequest request,
        Principal principal
    ) {
        Message message = messageService.save(channelId, principal.getName(), request);

        // Broadcast to all channel subscribers
        messagingTemplate.convertAndSend(
            "/topic/channels/" + channelId,
            message
        );
    }

    // User is typing
    @MessageMapping("/channels/{channelId}/typing")
    public void userTyping(@DestinationVariable String channelId, Principal principal) {
        messagingTemplate.convertAndSend(
            "/topic/channels/" + channelId + "/typing",
            Map.of("user", principal.getName(), "typing", true)
        );
    }

    // Direct message
    @MessageMapping("/dm/{recipientId}/send")
    public void sendDirectMessage(
        @DestinationVariable String recipientId,
        @Payload SendMessageRequest request,
        Principal principal
    ) {
        Message message = messageService.saveDirect(principal.getName(), recipientId, request);

        // Send to sender too
        messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/dm", message);

        // Send to recipient
        messagingTemplate.convertAndSendToUser(recipientId, "/queue/dm", message);
    }

    // Push notification for new message (from another event)
    public void pushNewMessageBadge(String userId, int unreadCount) {
        messagingTemplate.convertAndSendToUser(
            userId,
            "/queue/badge",
            Map.of("unread", unreadCount)
        );
    }
}
```

---

# Interview Questions

## Q1. What is a WebSocket?

**Best Answer**

> WebSocket is a full-duplex communication protocol over a single TCP connection. Unlike HTTP (request-response), WebSocket keeps the connection open, allowing both client and server to send messages at any time. Ideal for real-time applications like chat, live dashboards, and notifications.

---

## Q2. What is STOMP?

Simple Text Oriented Messaging Protocol — a sub-protocol that runs over WebSocket. It provides message channels (topics and queues), subscriptions, and heartbeat. Spring Boot uses STOMP for structured WebSocket messaging.

---

## Q3. What is SimpMessagingTemplate?

Spring's template for sending messages over WebSocket. `convertAndSend("/topic/public", message)` broadcasts to all subscribers. `convertAndSendToUser(user, "/queue/...", message)` sends to a specific user.

---

## Q4. What is the difference between /topic and /queue in STOMP?

`/topic/*` → Publish-subscribe (broadcast to all subscribers). `/queue/*` → Point-to-point (sent to a single user, via `convertAndSendToUser`).

---

## Q5. Why use SockJS?

SockJS is a JavaScript library that provides a WebSocket-like object even in browsers/networks that don't support WebSocket. It automatically falls back to HTTP long-polling or server-sent events.

---

# Professional Summary

```
WebSocket in Spring Boot:

1. @EnableWebSocketMessageBroker
2. Config: /topic (broadcast), /queue (private), /app (in)

Controller:
  @MessageMapping("/route")  → receive from client
  @SendTo("/topic/...")      → broadcast to all
  messagingTemplate.convertAndSendToUser() → private msg

Events:
  SessionConnectedEvent    → on connect
  SessionDisconnectEvent   → on disconnect

Client (JavaScript):
  SockJS("/ws") → STOMP.over(socket)
  .subscribe("/topic/...") → receive
  .send("/app/...")        → send

Push from server:
  messagingTemplate.convertAndSend("/topic/...", data)
```

---

# 🧠 Memory Trick

WebSocket = **Phone Call (not SMS)**

```
SMS (HTTP):
  Send text → Delivered → Conversation over
  Next message = new SMS

Phone Call (WebSocket):
  Call connected → Line stays open
  Both speak anytime
  One call = many messages

STOMP = Phone protocol rules
  /topic = conference call (everyone hears)
  /queue = private call (just one person)
```

---

# 🚀 Final Chapter

We arrive at **Microservices with Spring Boot** — the architectural pattern that powers Netflix, Amazon, and Uber at massive scale.
