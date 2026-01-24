# InsightAI - Postman API Collection

This document provides a complete set of API requests for testing the InsightAI backend.

## Base URL
```
http://localhost:8080
```

## Authentication Flow

### 1. Sign Up (Create New User)

**POST** `/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "MEMBER",
  "createdAt": "2026-01-20T19:00:00"
}
```

---

### 2. Login (Get JWT Token)

**POST** `/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiaWQiOjEsImlhdCI6MTcwNTc3MDAwMCwiZXhwIjoxNzA1ODU2NDAwfQ.xyz...",
  "type": "Bearer",
  "id": 1,
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "MEMBER"
}
```

**⚠️ IMPORTANT:** Copy the `token` value and use it in all subsequent requests!

---

### 3. Get Current User

**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "MEMBER",
  "createdAt": "2026-01-20T19:00:00"
}
```

---

## Meeting Management

### 4. Create Meeting

**POST** `/api/meetings`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "title": "Team Planning Meeting",
  "description": "Q1 planning session",
  "transcript": "We discussed the Q1 roadmap. John will complete the API by Friday. Sarah will review the documentation. We need to schedule a client demo next week. The team agreed to use Agile methodology.",
  "meetingDateTime": "2026-01-20T10:00:00"
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "title": "Team Planning Meeting",
  "description": "Q1 planning session",
  "transcript": "We discussed the Q1 roadmap...",
  "summary": null,
  "meetingDateTime": "2026-01-20T10:00:00",
  "createdBy": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "MEMBER",
    "createdAt": "2026-01-20T19:00:00"
  },
  "summaryGeneratedBy": null,
  "createdAt": "2026-01-20T19:05:00",
  "updatedAt": "2026-01-20T19:05:00"
}
```

---

### 5. Get All Meetings

**GET** `/api/meetings`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Team Planning Meeting",
    "description": "Q1 planning session",
    "transcript": "We discussed...",
    "summary": null,
    "meetingDateTime": "2026-01-20T10:00:00",
    "createdBy": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "MEMBER",
      "createdAt": "2026-01-20T19:00:00"
    },
    "summaryGeneratedBy": null,
    "createdAt": "2026-01-20T19:05:00",
    "updatedAt": "2026-01-20T19:05:00"
  }
]
```

---

### 6. Get Meeting by ID

**GET** `/api/meetings/1`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "title": "Team Planning Meeting",
  "description": "Q1 planning session",
  "transcript": "We discussed...",
  "summary": null,
  "meetingDateTime": "2026-01-20T10:00:00",
  "createdBy": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "MEMBER",
    "createdAt": "2026-01-20T19:00:00"
  },
  "summaryGeneratedBy": null,
  "createdAt": "2026-01-20T19:05:00",
  "updatedAt": "2026-01-20T19:05:00"
}
```

---

## AI Summary Generation

### 7. Generate AI Summary

**POST** `/api/meetings/1/summary`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Query Parameters:**
- `regenerate` (optional): `true` or `false` (default: `false`)

**Expected Response (200 OK):**
```json
{
  "summary": "SUMMARY:\nThe team discussed the Q1 roadmap and project planning. Key focus areas include API development, documentation review, and client engagement.\n\nKEY DECISIONS:\n- Adopt Agile methodology for project management\n- Schedule client demo for next week\n- Prioritize API completion and documentation review",
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
    },
    {
      "action": "Schedule client demo",
      "owner": "Team",
      "deadline": "Next week"
    }
  ],
  "tasksCreated": 3
}
```

**Note:** This endpoint calls the Gemini Pro API, so it may take 3-5 seconds to respond.

---

### 8. Regenerate Summary

**POST** `/api/meetings/1/summary?regenerate=true`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Use Case:** If you want to generate a new summary for a meeting that already has one.

---

## Task Management

### 9. Get All Tasks

**GET** `/api/tasks`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Complete the API - Owner: John - Deadline: Friday",
    "status": "TODO",
    "meeting": {
      "id": 1,
      "title": "Team Planning Meeting",
      "description": "Q1 planning session",
      "transcript": "We discussed...",
      "summary": "SUMMARY:\n...",
      "meetingDateTime": "2026-01-20T10:00:00",
      "createdBy": {
        "id": 1,
        "fullName": "John Doe",
        "email": "john@example.com",
        "role": "MEMBER",
        "createdAt": "2026-01-20T19:00:00"
      },
      "summaryGeneratedBy": 1,
      "createdAt": "2026-01-20T19:05:00",
      "updatedAt": "2026-01-20T19:10:00"
    },
    "assignedTo": null,
    "createdAt": "2026-01-20T19:10:00",
    "updatedAt": "2026-01-20T19:10:00"
  },
  {
    "id": 2,
    "title": "Review the documentation - Owner: Sarah - Deadline: Not specified",
    "status": "TODO",
    "meeting": {
      "id": 1,
      "title": "Team Planning Meeting",
      ...
    },
    "assignedTo": null,
    "createdAt": "2026-01-20T19:10:00",
    "updatedAt": "2026-01-20T19:10:00"
  }
]
```

---

### 10. Update Task Status

**PUT** `/api/tasks/1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "status": "IN_PROGRESS"
}
```

**Valid Status Values:**
- `TODO`
- `IN_PROGRESS`
- `DONE`

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "title": "Complete the API - Owner: John - Deadline: Friday",
  "status": "IN_PROGRESS",
  "meeting": {
    "id": 1,
    "title": "Team Planning Meeting",
    ...
  },
  "assignedTo": null,
  "createdAt": "2026-01-20T19:10:00",
  "updatedAt": "2026-01-20T19:15:00"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2026-01-20T19:20:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already exists",
  "path": "/auth/signup"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2026-01-20T19:20:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid credentials",
  "path": "/auth/login"
}
```

### 403 Forbidden
```json
{
  "timestamp": "2026-01-20T19:20:00",
  "status": 403,
  "error": "Forbidden",
  "message": "You don't have permission to access this meeting",
  "path": "/api/meetings/2"
}
```

### 404 Not Found
```json
{
  "timestamp": "2026-01-20T19:20:00",
  "status": 404,
  "error": "Not Found",
  "message": "Meeting not found with id: 999",
  "path": "/api/meetings/999"
}
```

---

## Testing Workflow

1. **Sign Up** → Get user created
2. **Login** → Get JWT token
3. **Create Meeting** → Get meeting ID
4. **Generate Summary** → Get AI summary and tasks
5. **Get Tasks** → See extracted action items
6. **Update Task Status** → Change task to IN_PROGRESS or DONE
7. **Get All Meetings** → See all your meetings
8. **Get Meeting by ID** → See meeting with summary

---

## Tips for Postman

1. **Save Token as Variable:**
   - After login, save the token as a Postman environment variable
   - Use `{{token}}` in Authorization headers

2. **Create Collection:**
   - Group all requests in a collection
   - Set Authorization at collection level

3. **Use Pre-request Scripts:**
   ```javascript
   // Auto-login before each request
   if (!pm.environment.get("token")) {
       pm.sendRequest({
           url: 'http://localhost:8080/auth/login',
           method: 'POST',
           header: 'Content-Type: application/json',
           body: {
               mode: 'raw',
               raw: JSON.stringify({
                   email: "john@example.com",
                   password: "password123"
               })
           }
       }, function (err, res) {
           pm.environment.set("token", res.json().token);
       });
   }
   ```

4. **Test Scripts:**
   ```javascript
   // Verify response status
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });
   
   // Save token from login response
   if (pm.response.json().token) {
       pm.environment.set("token", pm.response.json().token);
   }
   ```

---

## cURL Examples

### Sign Up
```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create Meeting (replace TOKEN)
```bash
curl -X POST http://localhost:8080/api/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Team Meeting","description":"Planning","transcript":"We discussed...","meetingDateTime":"2026-01-20T10:00:00"}'
```

### Generate Summary (replace TOKEN)
```bash
curl -X POST http://localhost:8080/api/meetings/1/summary \
  -H "Authorization: Bearer TOKEN"
```

### Get Tasks (replace TOKEN)
```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

### Update Task (replace TOKEN)
```bash
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"status":"IN_PROGRESS"}'
```

---

## PowerShell Examples (Windows)

### Login
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8080/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"john@example.com","password":"password123"}'

$token = ($response.Content | ConvertFrom-Json).token
```

### Create Meeting
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/meetings" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{"Authorization"="Bearer $token"} `
  -Body '{"title":"Team Meeting","description":"Planning","transcript":"We discussed...","meetingDateTime":"2026-01-20T10:00:00"}'
```

---

## Notes

- All timestamps are in ISO-8601 format
- JWT tokens expire after 24 hours
- The Gemini API may take 3-5 seconds to generate summaries
- Tasks are automatically created from action items in the summary
- Users can only access their own meetings and tasks (unless ADMIN role)
