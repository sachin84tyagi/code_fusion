Welcome to **Chapter 42 — File Upload & Download**.

> **Every real application needs file handling — profile pictures, invoice PDFs, product images. Spring Boot makes it clean and simple.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a post office.

**Sending a parcel (Upload):**

```
You bring a parcel to the counter
Counter accepts it
Stores it in the warehouse
Gives you a tracking ID
```

**Receiving a parcel (Download):**

```
You give your tracking ID
Counter fetches parcel from warehouse
Hands it to you
```

Spring File Upload/Download is exactly this.

---

# Configure File Upload Limits

```properties
# application.properties
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB

# Storage directory
file.upload.dir=uploads/
```

---

# Dependencies for Cloud Storage

```xml
<!-- AWS S3 -->
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.21.0</version>
</dependency>
```

---

# File Upload — Local Storage

```java
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    // Single file upload
    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(
        @RequestParam("file") MultipartFile file
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String filename = fileService.store(file);
        String fileUrl = "/api/files/download/" + filename;

        return ResponseEntity.status(201).body(new FileUploadResponse(filename, fileUrl));
    }

    // Multiple files
    @PostMapping("/upload/multiple")
    public ResponseEntity<List<FileUploadResponse>> uploadMultipleFiles(
        @RequestParam("files") List<MultipartFile> files
    ) {
        List<FileUploadResponse> responses = files.stream()
            .map(file -> {
                String filename = fileService.store(file);
                return new FileUploadResponse(filename, "/api/files/download/" + filename);
            })
            .collect(Collectors.toList());

        return ResponseEntity.status(201).body(responses);
    }

    // Download file
    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        Resource resource = fileService.loadAsResource(filename);

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(getContentType(filename)))
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + resource.getFilename() + "\"")
            .body(resource);
    }

    private String getContentType(String filename) {
        if (filename.endsWith(".pdf")) return "application/pdf";
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
        if (filename.endsWith(".png")) return "image/png";
        return "application/octet-stream";
    }
}
```

---

# File Service — Local Storage

```java
@Service
public class FileService {

    @Value("${file.upload.dir}")
    private String uploadDir;

    public String store(MultipartFile file) {
        validateFile(file);

        // Generate unique filename
        String originalName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = getExtension(originalName);
        String newFilename = UUID.randomUUID().toString() + "." + extension;

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return newFilename;

        } catch (IOException e) {
            throw new FileStorageException("Could not store file: " + e.getMessage());
        }
    }

    public Resource loadAsResource(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("File not found: " + filename);
        }
    }

    public void delete(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileStorageException("Could not delete file: " + filename);
        }
    }

    private void validateFile(MultipartFile file) {
        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isEmpty()) {
            throw new InvalidFileException("File name is empty");
        }

        String extension = getExtension(originalName).toLowerCase();
        Set<String> allowedExtensions = Set.of("jpg", "jpeg", "png", "gif", "pdf", "docx");
        if (!allowedExtensions.contains(extension)) {
            throw new InvalidFileException("File type not allowed: " + extension);
        }

        // 10 MB max
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new InvalidFileException("File too large. Maximum 10MB");
        }
    }

    private String getExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex >= 0) ? filename.substring(dotIndex + 1) : "";
    }
}
```

---

# File Upload with User Profile

```java
@PostMapping("/profile/picture")
public ResponseEntity<UserResponse> uploadProfilePicture(
    @RequestParam("file") MultipartFile file,
    @AuthenticationPrincipal UserDetails currentUser
) {
    String filename = fileService.store(file);
    String imageUrl = "/api/files/download/" + filename;

    User user = userRepository.findByEmail(currentUser.getUsername()).orElseThrow();
    user.setProfilePicture(imageUrl);
    userRepository.save(user);

    return ResponseEntity.ok(toResponse(user));
}
```

---

# AWS S3 Storage (Production)

```java
@Service
@RequiredArgsConstructor
public class S3FileService {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    public String uploadFile(MultipartFile file) {
        String key = "uploads/" + UUID.randomUUID() + "/" + file.getOriginalFilename();

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();

            s3Client.putObject(request,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );

            // Return public URL
            return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;

        } catch (IOException e) {
            throw new FileStorageException("Failed to upload to S3: " + e.getMessage());
        }
    }

    public void deleteFile(String fileUrl) {
        String key = extractKeyFromUrl(fileUrl);
        s3Client.deleteObject(DeleteObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .build()
        );
    }

    public String generatePresignedUrl(String key, Duration duration) {
        GetObjectPresignRequest request = GetObjectPresignRequest.builder()
            .signatureDuration(duration)
            .getObjectRequest(b -> b.bucket(bucketName).key(key))
            .build();

        return s3Presigner.presignGetObject(request).url().toString();
    }
}
```

---

# Serve Image Inline (Not Download)

```java
@GetMapping("/images/{filename}")
public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
    Resource resource = fileService.loadAsResource(filename);

    return ResponseEntity.ok()
        .contentType(MediaType.IMAGE_JPEG)
        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
        .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
        .body(resource);
}
```

---

# File Upload Response DTO

```java
@Data
@AllArgsConstructor
public class FileUploadResponse {
    private String filename;
    private String url;
    private long size;
    private String contentType;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime uploadedAt;
}
```

---

# Company Example — WhatsApp

WhatsApp media upload:

```java
@RestController
@RequestMapping("/api/v1/media")
public class MediaController {

    // Upload image/video before sending
    @PostMapping("/upload")
    public ResponseEntity<MediaResponse> uploadMedia(
        @RequestParam("file") MultipartFile file,
        @RequestParam("mediaType") String mediaType,
        @AuthenticationPrincipal UserDetails user
    ) {
        validateMediaType(file, mediaType);

        String mediaKey = s3Service.uploadMedia(file, mediaType);
        String mediaUrl = s3Service.getPresignedUrl(mediaKey, Duration.ofHours(24));

        Media media = mediaRepository.save(new Media(mediaKey, mediaUrl, user.getUsername()));
        return ResponseEntity.status(201).body(new MediaResponse(media.getId(), mediaUrl));
    }

    // Download media by message ID
    @GetMapping("/{mediaId}")
    public ResponseEntity<Resource> downloadMedia(
        @PathVariable String mediaId,
        @AuthenticationPrincipal UserDetails user
    ) {
        Media media = mediaRepository.findById(mediaId).orElseThrow();

        // Only sender and recipient can access
        if (!media.getUploadedBy().equals(user.getUsername()) &&
            !isRecipient(mediaId, user.getUsername())) {
            return ResponseEntity.status(403).build();
        }

        // Generate fresh presigned URL
        String presignedUrl = s3Service.getPresignedUrl(media.getKey(), Duration.ofMinutes(15));
        return ResponseEntity.status(HttpStatus.FOUND)
            .header("Location", presignedUrl)
            .build();
    }
}
```

---

# Interview Questions

## Q1. What is MultipartFile in Spring?

**Best Answer**

> `MultipartFile` is Spring's interface representing a file uploaded via a multipart/form-data HTTP request. It provides access to the file content (`getInputStream()`), metadata (`getOriginalFilename()`, `getSize()`, `getContentType()`), and methods to transfer the file to a destination.

---

## Q2. How do you limit file upload size?

Set `spring.servlet.multipart.max-file-size` (per file) and `spring.servlet.multipart.max-request-size` (total request) in `application.properties`. Spring throws `MaxUploadSizeExceededException` if exceeded.

---

## Q3. How do you prevent directory traversal attacks in file upload?

Use `StringUtils.cleanPath()` on the filename to remove path sequences like `../`. Also store files with generated UUIDs as names, not the original filename.

---

## Q4. What is a presigned URL (S3)?

A time-limited URL that grants temporary access to a private S3 object without exposing AWS credentials. Generated server-side and sent to clients who then download directly from S3, offloading traffic from your server.

---

## Q5. Should you store uploaded files in the database?

No. Store them in cloud storage (AWS S3, GCP Cloud Storage) or local filesystem. Store only the URL/path in the database. Files in databases cause performance issues.

---

# Professional Summary

```
File Upload:
  @RequestParam("file") MultipartFile file
  multipart.max-file-size=10MB

Storage options:
  Local filesystem  → dev/small apps
  AWS S3            → production

Local:
  Files.copy(file.getInputStream(), destination)
  new UrlResource(path.toUri())

Download:
  ResponseEntity<Resource>
  Content-Disposition: attachment (download)
  Content-Disposition: inline (browser view)

Security:
  Validate extension
  Validate file size
  Generate UUID filename (not original name)
  Use StringUtils.cleanPath()
```

---

# 🧠 Memory Trick

File Upload = **Post Office**

```
📦 Post Office (FileService)

Upload:
  You bring parcel (MultipartFile)
  Counter checks it (validate)
  Store in warehouse (filesystem/S3)
  Get tracking ID (UUID filename/key)

Download:
  Give tracking ID
  Fetch from warehouse (loadAsResource)
  Hand over (ResponseEntity<Resource>)
```

---

# 🚀 Next Chapter

We'll implement **Email Sending** with JavaMail — sending transactional emails from Spring Boot for registration, notifications, and alerts.
