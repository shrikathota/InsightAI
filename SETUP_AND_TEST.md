# InsightAI - Setup and Testing Guide

## Prerequisites

Before you begin, ensure you have:
- **Java 17+** installed
- **Maven 3.6+** installed
- **Node.js 18+** installed
- **PostgreSQL 14+** installed and running
- **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Step 1: Database Setup

1. Start PostgreSQL service
2. Create the database:
```sql
CREATE DATABASE insightai_db;
```

3. Verify connection:
```bash
psql -U postgres -d insightai_db
```

## Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Update `src/main/resources/application.properties`:
   - Set your PostgreSQL username/password if different from defaults
   - **IMPORTANT**: Replace `YOUR_GEMINI_API_KEY_HERE` with your actual Gemini API key

3. Build and run the backend:
```bash
mvn clean install
mvn spring-boot:run
```

4. Verify backend is running:
   - You should see: "Started InsightAiApplication"
   - Backend runs on: `http://localhost:8080`

## Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Verify frontend is running:
   - Frontend runs on: `http://localhost:3000`
   - Open browser to `http://localhost:3000`

## Step 4: Test the Application

### Test 1: Complete User Flow (Recommended)

1. **Sign Up:**
   - Go to `http://localhost:3000`
   - Click "Sign Up"
   - Fill in: Full Name: `Test User`, Email: `test@example.com`, Password: `password123`
   - Click "Sign Up"
   - ✅ You should be auto-logged in and redirected to `/dashboard`

2. **View Dashboard:**
   - ✅ See your name in the navigation
   - ✅ See stats showing 0 meetings, 0 summaries, 0 tasks
   - ✅ See empty state messages

3. **Create a Meeting:**
   - Click "Meetings" in navigation or "Create Your First Meeting"
   - Click "+ Create Meeting" button
   - Fill in:
     - Title: `Team Planning Meeting`
     - Date & Time: Select today's date
     - Description: `Q1 planning session`
     - Transcript: `We discussed the Q1 roadmap. John will complete the API by Friday. Sarah will review the documentation. We need to schedule a client demo next week. The team agreed to use Agile methodology.`
   - Click "Create Meeting"
   - ✅ Modal closes and meeting appears in the list

4. **Generate AI Summary:**
   - Click on the meeting you just created
   - ✅ See meeting details and transcript
   - Click "✨ Generate AI Summary" button
   - ✅ See loading indicator
   - Wait 3-5 seconds for Gemini API
   - ✅ See success message with summary and tasks created count
   - ✅ Summary appears in green box with AI-generated content

5. **View Tasks:**
   - Click "View Tasks" button or "Tasks" in navigation
   - ✅ See tasks extracted from the meeting in "To Do" column
   - Try changing a task status to "In Progress"
   - ✅ Task moves to "In Progress" column
   - Change status to "Done"
   - ✅ Task moves to "Done" column

6. **Return to Dashboard:**
   - Click "Dashboard" in navigation
   - ✅ See updated stats (1 meeting, 1 summary, X tasks)
   - ✅ See recent meeting in the list
   - ✅ See pending tasks

7. **Logout:**
   - Click "Logout" button
   - ✅ Redirected to login page
   - ✅ Cannot access protected pages without logging in

### Test 2: User Login

1. Go to `http://localhost:3000/login`
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Sign In"
4. ✅ You should be redirected to `/dashboard` with all your data

### Test 3: Backend API with Postman/curl

#### Signup
```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Expected response (201 Created):
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "MEMBER",
  "createdAt": "2026-01-19T..."
}
```

#### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Expected response (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "MEMBER"
}
```

**Copy the token for next requests!**

#### Get Current User
```bash
curl -X GET http://localhost:8080/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Create Meeting
```bash
curl -X POST http://localhost:8080/api/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Team Standup",
    "description": "Daily standup meeting",
    "transcript": "We discussed the project progress. John will complete the API by Friday. Sarah will review the documentation. We need to schedule a client demo next week.",
    "meetingDateTime": "2026-01-19T10:00:00"
  }'
```

Expected response (201 Created):
```json
{
  "id": 1,
  "title": "Team Standup",
  "description": "Daily standup meeting",
  "transcript": "We discussed...",
  "summary": null,
  "meetingDateTime": "2026-01-19T10:00:00",
  "createdBy": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "MEMBER"
  },
  "createdAt": "2026-01-19T..."
}
```

#### Generate AI Summary
```bash
curl -X POST http://localhost:8080/api/meetings/1/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected response (200 OK):
```json
{
  "summary": "SUMMARY:\nThe team discussed project progress...\n\nKEY DECISIONS:\n- Schedule client demo next week",
  "actionItems": [
    {
      "action": "Complete the API",
      "owner": "John",
      "deadline": "Friday"
    },
    {
      "action": "Review the documentation",
      "owner": "Sarah",
      "deadline": "Not specified"
    }
  ],
  "tasksCreated": 2
}
```

#### Get All Meetings
```bash
curl -X GET http://localhost:8080/api/meetings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get All Tasks
```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Update Task Status
```bash
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

## Troubleshooting

### Backend Issues

**Database Connection Error:**
- Verify PostgreSQL is running
- Check username/password in `application.properties`
- Ensure database `insightai_db` exists

**Port 8080 Already in Use:**
- Change port in `application.properties`: `server.port=8081`
- Update frontend API URL in `frontend/lib/api.ts`

**JWT Errors:**
- Ensure JWT secret is at least 256 bits (current default is fine)
- Check token is being sent in Authorization header

### Frontend Issues

**Cannot Connect to Backend:**
- Verify backend is running on port 8080
- Check browser console for CORS errors
- Ensure `cors.allowed.origins` includes `http://localhost:3000`

**npm install Fails:**
- Try: `npm install --legacy-peer-deps`
- Clear cache: `npm cache clean --force`

**Page Not Found:**
- Ensure you're using Next.js 14 App Router structure
- Check file is in `app/` directory, not `pages/`

### Gemini API Issues

**Invalid API Key:**
- Get a new key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Update in `application.properties`
- Restart backend

**Quota Exceeded:**
- Gemini Pro has rate limits on free tier
- Wait a few minutes and try again
- Consider upgrading API plan

## What's Working

✅ **Backend:**
- User registration and login
- JWT authentication
- Meeting CRUD operations
- AI summary generation with Gemini Pro
- Task creation from action items
- Task status updates
- Authorization (users can only access their own data)
- Global exception handling

✅ **Frontend:**
- User registration page
- User login page
- Dashboard with meeting/task counts and recent items
- Meetings list page with create meeting modal
- Meeting detail page with AI summary generation
- Tasks page with kanban-style board (To Do, In Progress, Done)
- JWT token storage
- Automatic token injection in API calls
- 401 error handling with redirect
- Loading states and empty states
- Error handling with user-friendly messages

## Complete Feature List

✅ **All Core Features Implemented:**
- ✅ User authentication (signup, login, logout)
- ✅ Meeting management (create, list, view details)
- ✅ AI-powered summary generation using Gemini Pro
- ✅ Automatic action item extraction
- ✅ Task management with status updates
- ✅ Role-based authorization
- ✅ Responsive UI with Tailwind CSS
- ✅ Real-time data updates

## Next Steps

Once you've verified everything works:
1. Test user registration and login
2. Use Postman/curl to test backend APIs
3. Verify JWT authentication works
4. Test AI summary generation
5. Continue with remaining frontend pages

## Support

If you encounter issues:
1. Check backend logs in terminal
2. Check frontend console in browser DevTools
3. Verify all prerequisites are installed
4. Ensure ports 3000 and 8080 are available
