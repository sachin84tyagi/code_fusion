Welcome to **Chapter 43 — Sending Emails with Spring Boot**.

> **Email is essential for any production application — welcome emails, OTPs, password resets, order confirmations. Spring Boot makes it clean and simple.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you're at a post office.

You write a letter (email content).

You give it to the postman (JavaMailSender).

The postman delivers it to the address (SMTP server sends to recipient).

**Spring Email:**

```
Your Java code → JavaMailSender → SMTP Server → Recipient's inbox
```

---

# Adding Email Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

---

# SMTP Configuration

```properties
# Gmail SMTP
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=youremail@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.default-encoding=UTF-8

# From address
spring.mail.properties.mail.smtp.from=noreply@yourapp.com
```

For Gmail, use **App Password** (not your regular password):

`Google Account → Security → 2-Step Verification → App Passwords`

---

# Simple Email Service

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // Simple text email
    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
        log.info("Simple email sent to: {}", to);
    }

    // HTML email
    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true = isHtml

        mailSender.send(message);
        log.info("HTML email sent to: {}", to);
    }

    // Email with attachment
    public void sendEmailWithAttachment(
        String to, String subject, String text, File attachment
    ) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text);
        helper.addAttachment(attachment.getName(), attachment);

        mailSender.send(message);
    }

    // Multiple recipients
    public void sendBulkEmail(List<String> recipients, String subject, String html)
        throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromEmail);
        helper.setTo(recipients.toArray(String[]::new));
        helper.setSubject(subject);
        helper.setText(html, true);

        mailSender.send(message);
    }
}
```

---

# HTML Email Templates with Thymeleaf

Use Thymeleaf to generate dynamic HTML emails:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
<dependency>
    <groupId>org.thymeleaf.extras</groupId>
    <artifactId>thymeleaf-extras-java8time</artifactId>
</dependency>
```

---

# Email Template (`src/main/resources/templates/emails/welcome.html`)

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .btn { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to MyApp!</h1>
        </div>
        <div style="padding: 20px;">
            <h2>Hi <span th:text="${name}">User</span>!</h2>
            <p>Thanks for joining MyApp. Your account is now active.</p>
            <p>
                <a th:href="${verificationUrl}" class="btn">Verify Your Email</a>
            </p>
            <p style="color: #999;">This link expires in 24 hours.</p>
        </div>
    </div>
</body>
</html>
```

---

# Thymeleaf Email Service

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateEmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendWelcomeEmail(User user, String verificationToken) throws MessagingException {
        Context context = new Context();
        context.setVariable("name", user.getName());
        context.setVariable("email", user.getEmail());
        context.setVariable("verificationUrl",
            "https://myapp.com/verify?token=" + verificationToken);

        String htmlContent = templateEngine.process("emails/welcome", context);
        sendHtmlEmail(user.getEmail(), "Welcome to MyApp!", htmlContent);
    }

    public void sendPasswordResetEmail(User user, String resetToken) throws MessagingException {
        Context context = new Context();
        context.setVariable("name", user.getName());
        context.setVariable("resetUrl",
            "https://myapp.com/reset-password?token=" + resetToken);
        context.setVariable("expiresIn", "1 hour");

        String htmlContent = templateEngine.process("emails/password-reset", context);
        sendHtmlEmail(user.getEmail(), "Reset Your Password", htmlContent);
    }

    public void sendOrderConfirmation(Order order, User user) throws MessagingException {
        Context context = new Context();
        context.setVariable("user", user);
        context.setVariable("order", order);
        context.setVariable("items", order.getItems());
        context.setVariable("total", order.getTotalAmount());

        String htmlContent = templateEngine.process("emails/order-confirmation", context);
        sendHtmlEmail(user.getEmail(), "Order Confirmed - #" + order.getId(), htmlContent);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent)
        throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(message);
        log.info("Email sent to {} | Subject: {}", to, subject);
    }
}
```

---

# Async Email Sending

Always send emails asynchronously — SMTP can be slow:

```java
@Service
@RequiredArgsConstructor
public class AsyncEmailService {

    private final TemplateEmailService emailService;

    @Async("emailExecutor")
    public void sendWelcomeEmailAsync(User user, String token) {
        try {
            emailService.sendWelcomeEmail(user, token);
        } catch (MessagingException e) {
            log.error("Failed to send welcome email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    @Async("emailExecutor")
    public void sendOrderConfirmationAsync(Order order, User user) {
        try {
            emailService.sendOrderConfirmation(order, user);
        } catch (MessagingException e) {
            log.error("Failed to send order confirmation for order {}", order.getId());
        }
    }
}
```

---

# OTP Email

```java
@Service
@RequiredArgsConstructor
public class OtpService {

    private final EmailService emailService;
    private final OtpRepository otpRepository;

    public void sendOtp(String email) throws MessagingException {
        String otp = String.format("%06d", new Random().nextInt(1000000));

        // Store OTP with expiry
        OtpRecord record = new OtpRecord(email, otp, LocalDateTime.now().plusMinutes(10));
        otpRepository.save(record);

        // Send via email
        emailService.sendSimpleEmail(
            email,
            "Your OTP Code",
            "Your OTP is: " + otp + "\nValid for 10 minutes.\nDo not share with anyone."
        );
    }

    public boolean verifyOtp(String email, String otp) {
        return otpRepository.findByEmailAndOtpAndExpiresAtAfter(email, otp, LocalDateTime.now())
            .isPresent();
    }
}
```

---

# Company Example — Swiggy

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class SwiggyEmailService {

    private final TemplateEmailService templateService;

    // Order placed confirmation
    @Async
    public void sendOrderPlacedEmail(Order order, User user) {
        try {
            Context ctx = new Context();
            ctx.setVariable("userName", user.getName());
            ctx.setVariable("orderId", order.getId());
            ctx.setVariable("restaurantName", order.getRestaurantName());
            ctx.setVariable("items", order.getItems());
            ctx.setVariable("total", order.getTotalAmount());
            ctx.setVariable("estimatedDelivery", order.getEstimatedDeliveryTime());
            ctx.setVariable("trackingUrl", "https://swiggy.com/track/" + order.getId());

            String html = templateEngine.process("emails/order-placed", ctx);
            templateService.sendHtmlEmail(user.getEmail(), "Order Confirmed 🍔", html);
        } catch (Exception e) {
            log.error("Failed to send order email: {}", e.getMessage());
        }
    }

    // Delivery confirmation
    @Async
    public void sendDeliveredEmail(Order order, User user) {
        try {
            Context ctx = new Context();
            ctx.setVariable("orderId", order.getId());
            ctx.setVariable("ratingUrl", "https://swiggy.com/rate/" + order.getId());

            String html = templateEngine.process("emails/order-delivered", ctx);
            templateService.sendHtmlEmail(user.getEmail(), "Order Delivered! Rate your experience ⭐", html);
        } catch (Exception e) {
            log.error("Failed to send delivery email: {}", e.getMessage());
        }
    }
}
```

---

# Interview Questions

## Q1. What is JavaMailSender?

**Best Answer**

> `JavaMailSender` is Spring's interface for sending email. It extends `MailSender` with MIME message support. `JavaMailSenderImpl` is the standard implementation that wraps JavaMail and connects to an SMTP server.

---

## Q2. What is the difference between SimpleMailMessage and MimeMessage?

`SimpleMailMessage` supports only plain text. `MimeMessage` (via `MimeMessageHelper`) supports HTML, attachments, inline images, and multiple recipients.

---

## Q3. Why should emails be sent asynchronously?

SMTP operations can take 1-5 seconds. If sent synchronously, the HTTP request is blocked. Using `@Async`, the email is queued in a thread pool and the API returns immediately.

---

## Q4. How do you use Thymeleaf for email templates?

`SpringTemplateEngine` processes a Thymeleaf template file with a `Context` containing variables. The result is an HTML string passed to `MimeMessageHelper.setText(html, true)`.

---

## Q5. What should you use instead of your Gmail password for SMTP?

Use an **App Password** generated in Google Account security settings (requires 2-step verification). Never use your real Google account password in application properties.

---

# Professional Summary

```
Email in Spring Boot:

1. Dependency: spring-boot-starter-mail

2. Config (application.properties):
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=...
   spring.mail.password=...

3. Inject JavaMailSender

4. Simple text:
   SimpleMailMessage → mailSender.send()

5. HTML:
   MimeMessage + MimeMessageHelper
   helper.setText(html, true)

6. Templates:
   SpringTemplateEngine + Context
   templateEngine.process("template-name", ctx)

7. Always @Async
```

---

# 🧠 Memory Trick

Email = **Postal System**

```
JavaMailSender = Post Office
SMTP Config    = Post Office address
SimpleMailMessage = Postcard (plain text)
MimeMessage    = Package with photos + attachments
Thymeleaf      = Pre-printed form you fill in
@Async         = Drop-off, don't wait in queue
```

---

# 🚀 Next Chapter

We'll implement **WebSockets** — real-time bidirectional communication between server and browser.
