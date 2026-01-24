# InsightAI Backend

AI-powered Meeting Assistant Backend built with Spring Boot 3.x

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 14+

## Database Setup

1. Install PostgreSQL if not already installed
2. Create the database:
```sql
CREATE DATABASE insightai_db;
```

3. Update database credentials in `src/main/resources/application.properties` if needed:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Gemini API Setup

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update the API key in `src/main/resources/application.properties`:
```properties
gemini.api.key=YOUR_ACTUAL_API_KEY
```

## Running the Application

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the application using Maven:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication (Public)
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user profile (requires JWT)

### Meetings (Protected)
- `POST /api/meetings` - Create new meeting
- `GET /api/meetings` - Get all user's meetings
- `GET /api/meetings/{id}` - Get meeting by ID
- `POST /api/meetings/{id}/summary` - Generate AI summary

### Tasks (Protected)
- `GET /api/tasks` - Get all user's tasks
- `PUT /api/tasks/{id}` - Update task status

## Testing with Postman

1. **Signup**: POST to `/auth/signup` with:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

2. **Login**: POST to `/auth/login` with:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Copy the `token` from response.

3. **Use Protected Endpoints**: Add header to all subsequent requests:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Project Structure

```
backend/
├── src/main/java/com/insightai/
│   ├── InsightAiApplication.java    # Main application class
│   ├── config/                      # Configuration classes
│   ├── controller/                  # REST controllers
│   ├── dto/                         # Data Transfer Objects
│   ├── entity/                      # JPA entities
│   ├── repository/                  # JPA repositories
│   ├── security/                    # JWT security components
│   ├── service/                     # Business logic
│   └── exception/                   # Custom exceptions
├── src/main/resources/
│   └── application.properties       # Application configuration
└── pom.xml                          # Maven dependencies
```

## Configuration

Key configuration properties in `application.properties`:

- **Server Port**: `server.port=8080`
- **Database**: PostgreSQL connection settings
- **JWT**: Secret key and expiration (24 hours)
- **Gemini API**: API key and endpoint URL
- **CORS**: Allowed origins for frontend

## Development Notes

- JPA will automatically create/update database schema on startup
- SQL queries are logged in console for debugging
- CORS is configured to allow requests from `http://localhost:3000`
- JWT tokens expire after 24 hours
