# ProHire Spring Boot Backend

This is the new Java-based backend for the ProHire application, built using Spring Boot.

## Technologies
- Java 17+
- Spring Boot 3.2.4
- Spring Data JPA
- H2 Database (In-memory for development)
- PostgreSQL / MySQL (Optional)
- Project Lombok

## How to Run

### Prerequisites
- JDK 17 or higher
- Maven 3.6+ (or use the included wrapper if available)

### Running with Maven
```bash
mvn spring-boot:run
```

### Building the Project
```bash
mvn clean package
```

## API Endpoints
- **Health Check**: `GET /api/health`
- **H2 Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:prohiredb`
  - Username: `sa`
  - Password: `password`

## Project Structure
- `src/main/java/com/prohire/model`: Persistence entities
- `src/main/java/com/prohire/repository`: Data access interfaces
- `src/main/java/com/prohire/controller`: REST controllers
- `src/main/resources/application.properties`: Configuration file
