# Implementation Plan: InsightAI Meeting Assistant

## Overview

This implementation plan breaks down the InsightAI Meeting Assistant into incremental coding tasks. The approach follows a bottom-up strategy: starting with foundational components (entities, security), then building service layer logic, followed by API controllers, and finally the frontend. Each task builds on previous work, ensuring no orphaned code.

## Tasks

- [x] 1. Set up backend project structure and dependencies
  - Create Maven project with Spring Boot 3.x parent
  - Add dependencies: spring-boot-starter-web, spring-boot-starter-data-jpa, spring-boot-starter-security, postgresql, jjwt (JWT library), lombok
  - Create package structure: config, controller, dto, entity, repository, security, service, exception under com.insightai
  - Create InsightAiApplication.java main class
  - Create application.properties with PostgreSQL, JPA, JWT, and CORS configuration placeholders
  - _Requirements: 8.1, 8.2, 10.1, 10.2, 10.3_

- [x] 2. Implement database entities and repositories
  - [x] 2.1 Create User entity with audit fields
    - Define User entity with id, fullName, email (unique), password, role (enum: ADMIN, MEMBER), createdAt, updatedAt
    - Add JPA annotations including @Entity, @Table, @CreatedDate, @LastModifiedDate
    - Enable JPA auditing in configuration
    - _Requirements: 7.1, 14.1_
  
  - [x] 2.2 Create Meeting entity with relationships
    - Define Meeting entity with id, title, description, transcript, summary, meetingDateTime, createdBy (User), summaryGeneratedBy, createdAt, updatedAt
    - Add @ManyToOne relationship to User for createdBy
    - _Requirements: 7.2, 14.1, 14.2_
  
  - [x] 2.3 Create Task entity with relationships
    - Define Task entity with id, title, status (enum: TODO, IN_PROGRESS, DONE), meeting (ManyToOne), assignedTo (User), createdAt, updatedAt
    - Add @ManyToOne relationships to Meeting and User
    - _Requirements: 7.3, 14.1_
  
  - [x] 2.4 Create JPA repositories
    - Create UserRepository with findByEmail and existsByEmail methods
    - Create MeetingRepository with findByCreatedBy method
    - Create TaskRepository with findByMeeting_CreatedByOrAssignedTo method
    - _Requirements: 2.1, 4.1, 11.1, 11.3_

- [x] 3. Implement JWT security infrastructure
  - [x] 3.1 Create JWT token provider
    - Implement JwtTokenProvider with generateToken, validateToken, getUserIdFromToken, getEmailFromToken methods
    - Use HS256 algorithm with configurable secret from application.properties
    - Set token expiry to 24 hours
    - _Requirements: 1.3, 1.7_
  
  - [x] 3.2 Create JWT authentication filter
    - Implement JwtAuthenticationFilter extending OncePerRequestFilter
    - Extract JWT from Authorization header (Bearer token format)
    - Validate token and set authentication in SecurityContext
    - _Requirements: 1.5, 5.2_
  
  - [x] 3.3 Configure Spring Security
    - Create SecurityConfig with @EnableWebSecurity
    - Disable CSRF for REST API
    - Permit /auth/** endpoints without authentication
    - Secure all other endpoints
    - Register JwtAuthenticationFilter
    - Configure BCryptPasswordEncoder bean
    - Configure CORS for frontend origin
    - _Requirements: 1.6, 1.8, 5.1, 5.6, 5.7_

- [ ]* 3.4 Write property tests for JWT security
  - **Property 1: User registration creates hashed passwords**
  - **Validates: Requirements 1.1, 1.6**
  - **Property 3: Valid credentials return valid JWT**
  - **Validates: Requirements 1.3, 1.7**
  - **Property 6: Invalid or expired JWT returns 401**
  - **Validates: Requirements 1.9, 5.3, 5.4**
  - **Property 7: Public endpoints accessible without authentication**
  - **Validates: Requirements 1.8, 5.1**

- [x] 4. Implement global exception handling
  - [x] 4.1 Create custom exception classes
    - Create base CustomException class
    - Create ValidationException, AuthenticationException, AuthorizationException, ResourceNotFoundException, GeminiApiException
    - _Requirements: 12.3_
  
  - [x] 4.2 Create global exception handler
    - Implement GlobalExceptionHandler with @ControllerAdvice
    - Handle all custom exceptions and return unified error format with timestamp, status, error, message, path
    - Add logging for all exceptions with appropriate levels
    - _Requirements: 12.1, 12.2, 12.4_

- [ ]* 4.3 Write property tests for error handling
  - **Property 30: Unified error response format**
  - **Validates: Requirements 9.4, 12.2**
  - **Property 31: Comprehensive error handling**
  - **Validates: Requirements 12.3**
  - **Property 33: HTTP status code semantics**
  - **Validates: Requirements 9.5**

- [x] 5. Implement authentication service and DTOs
  - [x] 5.1 Create authentication DTOs
    - Create SignupRequest DTO with fullName, email, password fields and validation annotations
    - Create LoginRequest DTO with email, password fields
    - Create LoginResponse DTO with token, type, id, email, fullName, role fields
    - _Requirements: 1.1, 1.3_
  
  - [x] 5.2 Implement AuthService
    - Implement registerUser method: validate email uniqueness, hash password with BCrypt, save user with MEMBER role
    - Implement authenticateUser method: validate credentials, generate JWT token
    - Implement getCurrentUser method: fetch user by email from token
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]* 5.3 Write property tests for authentication service
  - **Property 1: User registration creates hashed passwords**
  - **Validates: Requirements 1.1, 1.6**
  - **Property 2: Duplicate email registration is rejected**
  - **Validates: Requirements 1.2**
  - **Property 4: Invalid credentials are rejected**
  - **Validates: Requirements 1.4**

- [x] 6. Implement authentication controller
  - [x] 6.1 Create AuthController
    - Implement POST /auth/signup endpoint calling AuthService.registerUser
    - Implement POST /auth/login endpoint calling AuthService.authenticateUser
    - Implement GET /auth/me endpoint calling AuthService.getCurrentUser (requires JWT)
    - Return appropriate HTTP status codes (201 for signup, 200 for login/me)
    - _Requirements: 1.1, 1.3, 1.5_

- [ ]* 6.2 Write integration tests for authentication endpoints
  - Test signup with valid data returns 201
  - Test signup with duplicate email returns 400
  - Test login with valid credentials returns JWT
  - Test login with invalid credentials returns 401
  - Test /auth/me with valid JWT returns user details
  - Test /auth/me without JWT returns 401

- [ ] 7. Checkpoint - Ensure authentication works end-to-end
  - Verify user can signup, login, and access /auth/me with JWT
  - Ensure all tests pass, ask the user if questions arise

- [x] 8. Implement meeting service and DTOs
  - [x] 8.1 Create meeting DTOs
    - Create MeetingRequest DTO with title, description, transcript, meetingDateTime fields
    - Create MeetingResponse DTO with all meeting fields including createdBy details
    - _Requirements: 2.1_
  
  - [x] 8.2 Implement MeetingService with authorization
    - Implement createMeeting method: save meeting with authenticated user as createdBy
    - Implement getUserMeetings method: return meetings created by user, or all meetings if user is ADMIN
    - Implement getMeetingById method: verify user owns meeting or is ADMIN, throw AuthorizationException if not
    - _Requirements: 2.1, 2.2, 2.3, 11.1, 11.2, 11.5_

- [ ]* 8.3 Write property tests for meeting service
  - **Property 10: Meeting creation with ownership**
  - **Validates: Requirements 2.1**
  - **Property 11: Meeting list filtered by ownership**
  - **Validates: Requirements 2.2, 11.1**
  - **Property 12: Meeting retrieval with authorization**
  - **Validates: Requirements 2.3, 11.2**
  - **Property 15: Meetings accept null transcripts**
  - **Validates: Requirements 2.7**
  - **Property 29: Unauthorized access returns 403**
  - **Validates: Requirements 11.4**

- [x] 9. Implement meeting controller
  - [x] 9.1 Create MeetingController
    - Implement POST /api/meetings endpoint calling MeetingService.createMeeting (return 201)
    - Implement GET /api/meetings endpoint calling MeetingService.getUserMeetings
    - Implement GET /api/meetings/{id} endpoint calling MeetingService.getMeetingById
    - All endpoints require JWT authentication
    - _Requirements: 2.1, 2.2, 2.3_

- [ ]* 9.2 Write integration tests for meeting endpoints
  - Test creating meeting with valid data returns 201
  - Test getting meetings returns only user's meetings
  - Test getting meeting by ID returns meeting details
  - Test getting another user's meeting returns 403
  - Test getting non-existent meeting returns 404
  - Test ADMIN can access all meetings

- [x] 10. Implement Gemini AI service
  - [x] 10.1 Create Gemini DTOs and response models
    - Create GeminiRequest DTO for API payload
    - Create GeminiResponse DTO for API response parsing
    - Create SummaryResponse DTO with summary, actionItems, tasksCreated fields
    - Create ActionItem model with title, owner, deadline fields
    - _Requirements: 3.1_
  
  - [x] 10.2 Implement GeminiService
    - Implement generateSummary method: build structured prompt with transcript, call Gemini API using RestTemplate
    - Configure API endpoint and key from application.properties
    - Set temperature to 0.4 and maxOutputTokens to 1024
    - Parse JSON response and extract summary and action items
    - Handle API errors (timeout, quota exceeded, invalid response) and throw GeminiApiException
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.8, 13.1, 13.2, 13.5_

- [ ]* 10.3 Write property tests for Gemini service
  - **Property 19: Gemini API errors handled gracefully**
  - **Validates: Requirements 3.3, 13.5**
  - **Property 21: Structured prompt consistency**
  - **Validates: Requirements 13.1**

- [x] 11. Implement summary generation in meeting service
  - [x] 11.1 Add generateSummary method to MeetingService
    - Verify user owns meeting or is ADMIN
    - Check if transcript exists, throw ValidationException if null/empty
    - Check if summary already exists, prevent regeneration unless explicit flag provided
    - Call GeminiService.generateSummary with transcript
    - Save summary to meeting and set summaryGeneratedBy to current user ID
    - Create Task entities from extracted action items and save to database
    - Return SummaryResponse with summary and tasks created count
    - _Requirements: 3.1, 3.2, 3.6, 3.7, 13.3, 13.4, 14.2_

- [ ]* 11.2 Write property tests for summary generation
  - **Property 17: Summary generation with valid transcript**
  - **Validates: Requirements 3.1, 3.6**
  - **Property 18: Summary generation requires transcript**
  - **Validates: Requirements 3.2**
  - **Property 20: No tasks created when no action items**
  - **Validates: Requirements 3.7**
  - **Property 22: Summary generation idempotency**
  - **Validates: Requirements 13.3, 13.4**
  - **Property 23: Summary generation audit trail**
  - **Validates: Requirements 14.2**

- [x] 12. Add summary generation endpoint to meeting controller
  - [x] 12.1 Implement POST /api/meetings/{id}/summary endpoint
    - Call MeetingService.generateSummary with meeting ID and authenticated user
    - Accept optional regenerate query parameter to allow re-generation
    - Return SummaryResponse with 200 status
    - _Requirements: 3.1_

- [ ]* 12.2 Write integration tests for summary generation
  - Test generating summary with valid transcript succeeds
  - Test generating summary without transcript returns 400
  - Test generating summary for another user's meeting returns 403
  - Test regenerating summary with flag succeeds
  - Test preventing duplicate summary generation without flag

- [ ] 13. Checkpoint - Ensure meeting and AI features work
  - Verify user can create meetings, generate summaries, and tasks are created
  - Ensure all tests pass, ask the user if questions arise

- [x] 14. Implement task service and DTOs
  - [x] 14.1 Create task DTOs
    - Create TaskResponse DTO with all task fields including meeting and assignedTo details
    - Create TaskUpdateRequest DTO with status field and validation
    - _Requirements: 4.2_
  
  - [x] 14.2 Implement TaskService with authorization
    - Implement getUserTasks method: return tasks where user owns the meeting or is assignedTo
    - Implement updateTaskStatus method: verify user owns meeting or is assignedTo, update status, save task
    - Validate status is one of TODO, IN_PROGRESS, DONE
    - _Requirements: 4.1, 4.2, 4.3, 11.3_

- [ ]* 14.3 Write property tests for task service
  - **Property 24: Task list filtered by ownership and assignment**
  - **Validates: Requirements 4.1, 11.3**
  - **Property 25: Task status update**
  - **Validates: Requirements 4.2**
  - **Property 26: Invalid task status rejected**
  - **Validates: Requirements 4.3**
  - **Property 27: Task-meeting association required**
  - **Validates: Requirements 4.4**
  - **Property 28: Task assignment is optional**
  - **Validates: Requirements 4.6**

- [x] 15. Implement task controller
  - [x] 15.1 Create TaskController
    - Implement GET /api/tasks endpoint calling TaskService.getUserTasks
    - Implement PUT /api/tasks/{id} endpoint calling TaskService.updateTaskStatus
    - All endpoints require JWT authentication
    - _Requirements: 4.1, 4.2_

- [ ]* 15.2 Write integration tests for task endpoints
  - Test getting tasks returns user's tasks
  - Test updating task status succeeds
  - Test updating task with invalid status returns 400
  - Test updating another user's task returns 403

- [x] 16. Finalize backend configuration
  - [x] 16.1 Complete application.properties
    - Add PostgreSQL connection URL, username, password
    - Add JPA settings: ddl-auto=update, show-sql=true, dialect=PostgreSQL
    - Add JWT secret and expiry (24 hours)
    - Add Gemini API key and URL
    - Add CORS allowed origins (http://localhost:3000)
    - Add logging configuration
    - _Requirements: 8.1_

- [ ] 17. Checkpoint - Backend complete and tested
  - Run all tests and ensure they pass
  - Verify backend can be started with mvn spring-boot:run
  - Test all endpoints via Postman or curl
  - Ensure all tests pass, ask the user if questions arise

- [x] 18. Set up frontend project structure
  - Create Next.js 14 project with TypeScript using create-next-app
  - Install dependencies: axios, tailwindcss, @radix-ui/react-* (shadcn/ui components), lucide-react (icons)
  - Configure tailwind.config.js with shadcn/ui theme
  - Create directory structure: app (pages), components, lib (utilities), styles
  - _Requirements: 8.4, 10.4_

- [x] 19. Implement frontend API client and auth context
  - [x] 19.1 Create Axios client with interceptors
    - Create axiosInstance in lib/api.ts with base URL http://localhost:8080
    - Add request interceptor to include JWT from localStorage in Authorization header
    - Add response interceptor to handle 401 errors and redirect to /login
    - _Requirements: 6.4, 6.5_
  
  - [x] 19.2 Create authentication context
    - Create AuthContext with user state, token state, loading state
    - Implement login, signup, logout, checkAuth methods
    - Store JWT in localStorage on login
    - Clear localStorage on logout
    - Provide AuthProvider wrapper component
    - _Requirements: 6.2, 6.3_
  
  - [x] 19.3 Create ProtectedRoute component
    - Check for JWT token in localStorage
    - Redirect to /login if no token
    - Show loading state while checking authentication
    - _Requirements: 6.3_

- [ ]* 19.4 Write property tests for frontend auth
  - **Property 34: JWT storage in localStorage**
  - **Validates: Requirements 6.2**
  - **Property 36: Axios interceptor adds JWT**
  - **Validates: Requirements 6.4**
  - **Property 37: 401 response triggers re-authentication**
  - **Validates: Requirements 6.5**

- [x] 20. Implement authentication pages
  - [x] 20.1 Create login page (app/login/page.tsx)
    - Create login form with email and password fields
    - Call AuthContext.login on form submit
    - Show loading indicator during login
    - Display error messages on failure
    - Redirect to /dashboard on success
    - _Requirements: 6.1, 15.1, 15.3_
  
  - [x] 20.2 Create signup page (app/signup/page.tsx)
    - Create signup form with fullName, email, password fields
    - Call AuthContext.signup on form submit
    - Show loading indicator during signup
    - Display error messages on failure
    - Redirect to /login on success
    - _Requirements: 6.1, 15.1, 15.3_

- [ ] 21. Implement dashboard page
  - [ ] 21.1 Create dashboard page (app/dashboard/page.tsx)
    - Wrap with ProtectedRoute
    - Fetch and display meeting count and task count
    - Show recent meetings list
    - Show pending tasks list
    - Include navigation to /meetings and /tasks
    - Show empty state if no data
    - _Requirements: 6.1, 15.2_

- [ ] 22. Implement meetings pages
  - [x] 22.1 Create meetings list page (app/meetings/page.tsx)
    - Wrap with ProtectedRoute
    - Fetch and display all user's meetings
    - Show meeting title, date, and summary status
    - Include "Create Meeting" button
    - Show empty state if no meetings
    - Link to individual meeting pages
    - _Requirements: 6.1, 15.2_
  
  - [x] 22.2 Create meeting detail page (app/meetings/[id]/page.tsx)
    - Wrap with ProtectedRoute
    - Fetch and display meeting details including transcript and summary
    - Show "Generate Summary" button if no summary exists
    - Show loading indicator during summary generation
    - Display generated summary and action items
    - Handle errors gracefully
    - _Requirements: 6.1, 15.1, 15.3_
  
  - [x] 22.3 Create meeting form component
    - Create form with title, description, transcript, meetingDateTime fields
    - Validate required fields
    - Call POST /api/meetings on submit
    - Show loading indicator during creation
    - Redirect to meeting detail page on success
    - Display error messages on failure
    - _Requirements: 15.1, 15.3_

- [ ]* 22.4 Write property tests for meeting pages
  - **Property 38: Loading indicators during async operations**
  - **Validates: Requirements 15.1**
  - **Property 39: Empty state messages**
  - **Validates: Requirements 15.2**
  - **Property 40: User-friendly error display**
  - **Validates: Requirements 15.3**

- [ ] 23. Implement tasks page
  - [x] 23.1 Create tasks list page (app/tasks/page.tsx)
    - Wrap with ProtectedRoute
    - Fetch and display all user's tasks
    - Show task title, status, meeting title, assigned user
    - Allow status updates via dropdown or buttons
    - Group tasks by status (TODO, IN_PROGRESS, DONE)
    - Show empty state if no tasks
    - _Requirements: 6.1, 15.2_

- [ ]* 23.2 Write property tests for task page
  - Test task status updates
  - Test empty state display
  - Test error handling

- [ ] 24. Add UI polish and error handling
  - [ ] 24.1 Create reusable UI components
    - Create LoadingSpinner component
    - Create EmptyState component with icon and message
    - Create ErrorMessage component with retry button
    - Create Button, Input, Card components using shadcn/ui
    - _Requirements: 15.1, 15.2, 15.3_
  
  - [ ] 24.2 Add toast notifications
    - Install and configure toast library (e.g., sonner)
    - Show success toasts for create/update operations
    - Show error toasts for failed operations
    - _Requirements: 15.3_

- [ ] 25. Final integration and testing
  - [ ] 25.1 Test complete user workflow
    - Test signup → login → create meeting → generate summary → view tasks flow
    - Verify authorization works correctly (users can't access others' data)
    - Test error scenarios (invalid inputs, network errors, unauthorized access)
    - _Requirements: 9.3_
  
  - [ ] 25.2 Create setup documentation
    - Document PostgreSQL setup steps
    - Document backend run steps (mvn spring-boot:run)
    - Document frontend run steps (npm install && npm run dev)
    - Document environment variables and configuration
    - Create sample Postman collection with all endpoints
    - _Requirements: 8.6, 9.1, 9.2_

- [ ] 26. Final checkpoint - Complete system verification
  - Verify backend starts without errors
  - Verify frontend starts without errors
  - Test all features work end-to-end
  - Ensure all tests pass
  - Verify Postman collection works
  - Ask the user if any issues or questions arise

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across many inputs
- Integration tests validate component interactions and API contracts
- The implementation follows a layered approach: entities → security → services → controllers → frontend
- All code must be production-ready with no placeholders or "implement later" comments
