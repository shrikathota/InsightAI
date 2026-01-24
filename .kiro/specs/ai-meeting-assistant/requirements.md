# Requirements Document

## Introduction

InsightAI is a full-stack AI-powered Meeting Assistant that enables users to manage meetings, generate AI-powered summaries and action items, and track tasks. The system provides secure authentication, meeting transcript management, AI-powered insights using Google Gemini Pro, and task management capabilities.

## Glossary

- **System**: The InsightAI application (backend and frontend combined)
- **Backend**: The Spring Boot REST API server
- **Frontend**: The Next.js web application
- **User**: A registered person who can create and manage meetings
- **Meeting**: A record containing title, description, transcript, and AI-generated summary
- **Task**: An action item extracted from a meeting with status tracking
- **JWT**: JSON Web Token used for stateless authentication
- **Gemini_API**: Google Gemini Pro REST API for AI processing
- **Admin**: A user with administrative privileges
- **Member**: A standard user with basic privileges

## Requirements

### Requirement 1: User Registration and Authentication

**User Story:** As a new user, I want to register an account and login securely, so that I can access the meeting assistant features.

#### Acceptance Criteria

1. WHEN a user submits valid registration data (fullName, email, password), THE System SHALL create a new user account with hashed password and return success confirmation
2. WHEN a user attempts to register with an existing email, THE System SHALL reject the registration and return an error message
3. WHEN a user submits valid login credentials (email, password), THE System SHALL validate credentials and return a JWT token valid for 24 hours
4. WHEN a user submits invalid login credentials, THE System SHALL reject the login and return an authentication error
5. WHEN an authenticated user requests their profile information, THE System SHALL validate the JWT token and return user details
6. THE Backend SHALL use BCrypt algorithm to hash all user passwords before storage
7. THE Backend SHALL generate JWT tokens using HS256 algorithm with a configurable secret key
8. THE Backend SHALL permit unauthenticated access to /auth/signup and /auth/login endpoints only
9. WHEN a JWT token expires or is invalid, THE System SHALL return 401 Unauthorized status

### Requirement 2: Meeting Management

**User Story:** As a user, I want to create and view meetings with transcripts, so that I can organize my meeting information.

#### Acceptance Criteria

1. WHEN an authenticated user creates a meeting with title, description, transcript, and meetingDateTime, THE System SHALL persist the meeting and associate it with the creating user
2. WHEN an authenticated user requests all meetings, THE System SHALL return a list of all meetings in the system
3. WHEN an authenticated user requests a specific meeting by ID, THE System SHALL return the complete meeting details including transcript and summary
4. WHEN a user requests a non-existent meeting, THE System SHALL return a 404 Not Found error
5. THE System SHALL store meeting transcripts as text without size limitations beyond database constraints
6. THE System SHALL record the creation timestamp for each meeting automatically
7. WHEN a meeting is created without a transcript, THE System SHALL accept the meeting with null or empty transcript

### Requirement 3: AI-Powered Summary Generation

**User Story:** As a user, I want to generate AI summaries and extract action items from meeting transcripts, so that I can quickly understand key points and next steps.

#### Acceptance Criteria

1. WHEN a user requests summary generation for a meeting with a valid transcript, THE System SHALL send the transcript to Gemini_API and store the returned summary
2. WHEN a user requests summary generation for a meeting without a transcript, THE System SHALL return an error indicating transcript is required
3. WHEN Gemini_API returns an error or is unavailable, THE System SHALL return a descriptive error message to the user
4. THE Backend SHALL use Google Gemini Pro REST API without SDK dependencies
5. THE Backend SHALL configure Gemini_API key and URL in application.properties
6. THE System SHALL extract action items from the AI response and create Task entities
7. WHEN the AI response contains no action items, THE System SHALL store the summary without creating tasks
8. THE Backend SHALL use RestTemplate or WebClient for Gemini_API communication

### Requirement 4: Task Management

**User Story:** As a user, I want to view and update tasks extracted from meetings, so that I can track action items and their completion status.

#### Acceptance Criteria

1. WHEN an authenticated user requests all tasks, THE System SHALL return a list of all tasks with their associated meeting and assigned user information
2. WHEN a user updates a task status to TODO, IN_PROGRESS, or DONE, THE System SHALL persist the status change
3. WHEN a user attempts to update a task with an invalid status value, THE System SHALL reject the update and return a validation error
4. THE System SHALL associate each task with exactly one meeting via ManyToOne relationship
5. THE System SHALL allow tasks to be assigned to users via assignedTo relationship
6. WHEN a task is created without an assigned user, THE System SHALL accept the task with null assignedTo

### Requirement 5: Security and Authorization

**User Story:** As a system administrator, I want all API endpoints except authentication to be secured, so that unauthorized users cannot access protected resources.

#### Acceptance Criteria

1. THE Backend SHALL require valid JWT token in Authorization header for all endpoints except /auth/signup and /auth/login
2. WHEN a request includes a valid JWT token in format "Bearer <TOKEN>", THE System SHALL authenticate the user and process the request
3. WHEN a request to a protected endpoint lacks a JWT token, THE System SHALL return 401 Unauthorized
4. WHEN a request includes an expired or invalid JWT token, THE System SHALL return 401 Unauthorized
5. THE Backend SHALL implement stateless authentication without session storage
6. THE Backend SHALL disable CSRF protection for REST API endpoints
7. THE Backend SHALL configure CORS to allow requests from the Frontend origin

### Requirement 6: Frontend User Interface

**User Story:** As a user, I want an intuitive web interface to interact with the meeting assistant, so that I can easily manage meetings and tasks.

#### Acceptance Criteria

1. THE Frontend SHALL provide pages for /login, /signup, /dashboard, /meetings, /meetings/[id], and /tasks routes
2. WHEN a user successfully logs in, THE Frontend SHALL store the JWT token in localStorage
3. WHEN a user accesses a protected page without authentication, THE Frontend SHALL redirect to /login
4. THE Frontend SHALL include an Axios interceptor that adds JWT token to all API request headers
5. WHEN the Backend returns 401 Unauthorized, THE Frontend SHALL redirect the user to /login
6. THE Frontend SHALL match Backend API paths exactly (/auth/signup, /auth/login, /api/meetings, /api/tasks)
7. THE Frontend SHALL use Next.js 14 App Router for routing and page structure
8. THE Frontend SHALL use React 18 for component rendering
9. THE Frontend SHALL use TypeScript for type safety
10. THE Frontend SHALL use Tailwind CSS and shadcn/ui for styling

### Requirement 7: Database Schema and Persistence

**User Story:** As a system architect, I want a well-structured database schema, so that data is stored efficiently and relationships are maintained correctly.

#### Acceptance Criteria

1. THE Backend SHALL define a User entity with id, fullName, email (unique), password (hashed), role (ADMIN or MEMBER), and createdAt fields
2. THE Backend SHALL define a Meeting entity with id, title, description, transcript, summary, meetingDateTime, and createdBy (User reference) fields
3. THE Backend SHALL define a Task entity with id, title, status (TODO, IN_PROGRESS, DONE), meeting (ManyToOne), and assignedTo (User reference) fields
4. THE Backend SHALL use PostgreSQL as the database system
5. THE Backend SHALL use Spring Data JPA for database operations
6. THE Backend SHALL configure database connection parameters in application.properties
7. THE Backend SHALL automatically create or update database schema based on entity definitions

### Requirement 8: Configuration and Deployment

**User Story:** As a developer, I want clear configuration and setup instructions, so that I can run the application locally and deploy it successfully.

#### Acceptance Criteria

1. THE Backend SHALL provide application.properties with PostgreSQL configuration, JPA settings, JWT secret and expiry, Gemini API key and URL, and CORS allowed origins
2. THE Backend SHALL use Maven for dependency management with pom.xml
3. THE Backend SHALL be runnable via "mvn spring-boot:run" command
4. THE Frontend SHALL provide package.json with all required dependencies
5. THE Frontend SHALL be runnable via "npm install && npm run dev" commands
6. THE System SHALL provide step-by-step setup instructions for PostgreSQL, Backend, and Frontend
7. THE System SHALL compile and run without broken imports or missing dependencies

### Requirement 9: API Testing and Documentation

**User Story:** As a developer or tester, I want to test all API endpoints via Postman, so that I can verify functionality without using the frontend.

#### Acceptance Criteria

1. THE System SHALL provide Postman test flow covering: signup → login → create meeting → generate summary → view tasks
2. THE System SHALL provide sample JSON request bodies for every API endpoint
3. WHEN testing via Postman, all endpoints SHALL return appropriate HTTP status codes and JSON responses
4. THE Backend SHALL return consistent error response format with message and status fields
5. THE Backend SHALL return 200 OK for successful operations, 201 Created for resource creation, 400 Bad Request for validation errors, 401 Unauthorized for authentication failures, and 404 Not Found for missing resources

### Requirement 10: Project Structure and Organization

**User Story:** As a developer, I want a well-organized project structure, so that code is maintainable and follows best practices.

#### Acceptance Criteria

1. THE Backend SHALL organize code into packages: config, controller, dto, entity, repository, security, service, and exception under com.insightai
2. THE Backend SHALL place application entry point in InsightAiApplication.java
3. THE Backend SHALL place configuration files in src/main/resources
4. THE Frontend SHALL organize code into app (pages), components, lib (utilities), and styles directories
5. THE System SHALL separate Backend and Frontend into distinct root directories
6. THE Backend SHALL follow Spring Boot 3.x conventions and best practices
7. THE Frontend SHALL follow Next.js 14 App Router conventions and best practices


### Requirement 11: Authorization, Ownership & Access Control

**User Story:** As a user, I want to access only my own meetings and tasks, so that my data remains private and secure.

#### Acceptance Criteria

1. WHEN an authenticated user requests meetings, THE System SHALL return ONLY meetings created by that user UNLESS the user has ADMIN role
2. WHEN an authenticated user requests a meeting by ID, THE System SHALL verify that the meeting belongs to the requesting user OR the user has ADMIN role
3. WHEN an authenticated user requests tasks, THE System SHALL return ONLY tasks associated with meetings owned by that user OR tasks assigned to that user
4. WHEN a user attempts to access another user's meeting or task without ADMIN role, THE System SHALL return 403 Forbidden
5. THE Backend SHALL enforce authorization rules at service level, not only controller level

### Requirement 12: Global Error Handling & Exception Strategy

**User Story:** As a developer, I want consistent and meaningful error responses, so that debugging and frontend handling are easier.

#### Acceptance Criteria

1. THE Backend SHALL implement a global exception handler using @ControllerAdvice
2. THE System SHALL return errors in the following unified JSON format:
```json
{
  "timestamp": "ISO-8601 string",
  "status": 400,
  "error": "Bad Request",
  "message": "Descriptive error message",
  "path": "/api/endpoint"
}
```
3. THE Backend SHALL handle validation errors, authentication errors, authorization errors, resource not found errors, AI API failures, and database errors
4. THE Backend SHALL log all errors with appropriate log levels

### Requirement 13: AI Prompt Control & Cost Safety

**User Story:** As a system owner, I want AI output to be structured and safe, so that results are predictable and costs are controlled.

#### Acceptance Criteria

1. THE Backend SHALL use a fixed structured prompt when calling Gemini_API
2. THE AI prompt SHALL instruct Gemini to return a concise meeting summary, bullet-point key decisions, and clearly listed action items with owner and deadline if mentioned
3. THE System SHALL allow only one summary generation per meeting by default
4. WHEN a user explicitly requests regeneration, THE System SHALL regenerate the summary
5. WHEN Gemini_API quota is exceeded or unavailable, THE System SHALL return a descriptive error message

### Requirement 14: Audit Fields & Metadata

**User Story:** As a system administrator, I want audit information for records, so that activity can be tracked.

#### Acceptance Criteria

1. THE Backend SHALL automatically populate createdAt and updatedAt fields for all entities
2. THE Backend SHALL record which user triggered AI summary generation

### Requirement 15: Frontend UX States

**User Story:** As a user, I want clear feedback during operations, so that the application feels responsive.

#### Acceptance Criteria

1. WHEN AI summary is generating, THE Frontend SHALL show a loading indicator
2. WHEN no meetings or tasks exist, THE Frontend SHALL show a clear empty state message
3. WHEN an error occurs, THE Frontend SHALL display user-friendly error messages
