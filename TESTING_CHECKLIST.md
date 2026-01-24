# InsightAI - Testing Checklist

Use this checklist to verify all features are working correctly.

## ✅ Pre-Testing Setup

- [ ] PostgreSQL is running
- [ ] Database `insightai_db` exists
- [ ] Gemini API key is configured in `backend/src/main/resources/application.properties`
- [ ] Backend is running on `http://localhost:8080`
- [ ] Frontend is running on `http://localhost:3000`
- [ ] Browser is open to `http://localhost:3000`

---

## 🔐 Authentication Tests

### Sign Up Flow
- [ ] Navigate to `http://localhost:3000`
- [ ] Click "Sign Up" link
- [ ] Fill in form:
  - Full Name: `Test User`
  - Email: `test@example.com`
  - Password: `password123`
- [ ] Click "Sign Up" button
- [ ] ✅ Should auto-login and redirect to `/dashboard`
- [ ] ✅ Should see "Welcome, Test User!" message
- [ ] ✅ Should see navigation with Dashboard, Meetings, Tasks
- [ ] ✅ Should see user name in top right
- [ ] ✅ Should see Logout button

### Login Flow
- [ ] Click "Logout" button
- [ ] ✅ Should redirect to `/login`
- [ ] Enter credentials:
  - Email: `test@example.com`
  - Password: `password123`
- [ ] Click "Sign In" button
- [ ] ✅ Should redirect to `/dashboard`
- [ ] ✅ Should see user data loaded

### Invalid Login
- [ ] Logout again
- [ ] Try login with wrong password
- [ ] ✅ Should see error message "Invalid credentials"
- [ ] ✅ Should stay on login page

### Protected Routes
- [ ] While logged out, try to access `http://localhost:3000/dashboard`
- [ ] ✅ Should redirect to `/login`
- [ ] Try to access `http://localhost:3000/meetings`
- [ ] ✅ Should redirect to `/login`

---

## 📊 Dashboard Tests

- [ ] Login and go to `/dashboard`
- [ ] ✅ Should see three stat cards:
  - Meetings: 0
  - Summaries: 0
  - Tasks: 0
- [ ] ✅ Should see "Recent Meetings" section with empty state
- [ ] ✅ Should see "Pending Tasks" section with empty state
- [ ] ✅ Empty states should have helpful messages

---

## 📝 Meeting Tests

### Create Meeting
- [ ] Click "Meetings" in navigation
- [ ] ✅ Should see empty state with "Create Your First Meeting" button
- [ ] Click "+ Create Meeting" button
- [ ] ✅ Modal should open
- [ ] Fill in form:
  - Title: `Team Planning Meeting`
  - Date & Time: Select today's date and time
  - Description: `Q1 planning session`
  - Transcript: 
    ```
    We discussed the Q1 roadmap. John will complete the API by Friday. Sarah will review the documentation. We need to schedule a client demo next week. The team agreed to use Agile methodology.
    ```
- [ ] Click "Create Meeting" button
- [ ] ✅ Modal should close
- [ ] ✅ Meeting should appear in the grid
- [ ] ✅ Meeting card should show:
  - Title: "Team Planning Meeting"
  - Date
  - "No Summary" badge

### View Meeting List
- [ ] ✅ Should see meeting in grid layout
- [ ] ✅ Meeting card should be clickable
- [ ] Create 2-3 more meetings (can use shorter transcripts)
- [ ] ✅ All meetings should appear in the grid

### View Meeting Details
- [ ] Click on "Team Planning Meeting" card
- [ ] ✅ Should navigate to `/meetings/1`
- [ ] ✅ Should see:
  - Meeting title
  - Meeting date and creator name
  - Description
  - Full transcript
  - "Generate AI Summary" button
- [ ] ✅ Should see "Back to Meetings" link
- [ ] Click "Back to Meetings"
- [ ] ✅ Should return to meetings list

---

## 🤖 AI Summary Tests

### Generate Summary
- [ ] Go to meeting detail page for "Team Planning Meeting"
- [ ] Click "✨ Generate AI Summary" button
- [ ] ✅ Button should show loading state: "Generating Summary..."
- [ ] ✅ Should see spinner animation
- [ ] Wait 3-5 seconds for Gemini API
- [ ] ✅ Should see success message in blue box:
  - "Summary Generated!"
  - "✓ Summary created successfully"
  - "✓ X action item(s) extracted and added to tasks"
- [ ] ✅ Should see AI summary in green box with:
  - Summary text
  - Key decisions
  - "Regenerate Summary" button
- [ ] ✅ Summary should be relevant to the transcript

### Verify Summary Saved
- [ ] Go back to meetings list
- [ ] ✅ Meeting card should now show "✓ Summary" badge (green)
- [ ] Go to dashboard
- [ ] ✅ Summaries count should be 1
- [ ] ✅ Meeting should appear in "Recent Meetings" with "Summary Generated" badge

### Regenerate Summary
- [ ] Go back to meeting detail page
- [ ] Click "Regenerate Summary" button
- [ ] ✅ Should generate new summary
- [ ] ✅ Should see success message again

### Summary Without Transcript
- [ ] Create a new meeting without transcript
- [ ] Go to its detail page
- [ ] ✅ Should see warning: "⚠️ No transcript available"
- [ ] ✅ Should NOT see "Generate AI Summary" button

---

## ✅ Task Tests

### View Tasks
- [ ] Click "Tasks" in navigation
- [ ] ✅ Should see kanban board with three columns:
  - To Do
  - In Progress
  - Done
- [ ] ✅ Should see tasks in "To Do" column
- [ ] ✅ Each task card should show:
  - Task title (with owner and deadline)
  - Source meeting name (clickable)
  - Status dropdown

### Update Task Status
- [ ] Select a task
- [ ] Change status dropdown to "In Progress"
- [ ] ✅ Task should move to "In Progress" column
- [ ] ✅ Column count badges should update
- [ ] Change status to "Done"
- [ ] ✅ Task should move to "Done" column
- [ ] ✅ Badge should be green

### Task-Meeting Link
- [ ] Click on meeting name in a task card
- [ ] ✅ Should navigate to meeting detail page
- [ ] ✅ Should see the source meeting

### Dashboard Task Count
- [ ] Go to dashboard
- [ ] ✅ "Pending Tasks" count should show tasks in To Do + In Progress
- [ ] ✅ Should NOT count Done tasks
- [ ] ✅ Should see pending tasks in "Pending Tasks" section

---

## 🎨 UI/UX Tests

### Navigation
- [ ] Click "Dashboard" in nav
- [ ] ✅ Should navigate to dashboard
- [ ] ✅ "Dashboard" link should be highlighted
- [ ] Click "Meetings" in nav
- [ ] ✅ Should navigate to meetings
- [ ] ✅ "Meetings" link should be highlighted
- [ ] Click "Tasks" in nav
- [ ] ✅ Should navigate to tasks
- [ ] ✅ "Tasks" link should be highlighted

### Loading States
- [ ] Refresh dashboard page
- [ ] ✅ Should see loading spinner while fetching data
- [ ] Go to meetings page
- [ ] ✅ Should see loading spinner while fetching meetings
- [ ] Generate AI summary
- [ ] ✅ Should see loading indicator on button

### Empty States
- [ ] Create a new user account
- [ ] Login with new account
- [ ] ✅ Dashboard should show 0 for all stats
- [ ] ✅ Should see empty state messages
- [ ] Go to meetings
- [ ] ✅ Should see "No meetings yet" with call-to-action
- [ ] Go to tasks
- [ ] ✅ Should see "No tasks yet" with call-to-action

### Responsive Design
- [ ] Resize browser window to mobile size
- [ ] ✅ Layout should adapt to smaller screen
- [ ] ✅ Navigation should still be accessible
- [ ] ✅ Cards should stack vertically
- [ ] Resize back to desktop
- [ ] ✅ Should return to grid layout

---

## 🔒 Authorization Tests

### User Isolation
- [ ] Login as first user
- [ ] Create a meeting
- [ ] Note the meeting ID in URL (e.g., `/meetings/1`)
- [ ] Logout
- [ ] Create a second user account
- [ ] Login as second user
- [ ] Try to access first user's meeting: `http://localhost:3000/meetings/1`
- [ ] ✅ Should see error or "Meeting not found"
- [ ] ✅ Should NOT see first user's meeting data

### Token Expiry
- [ ] Login
- [ ] Open browser DevTools → Application → Local Storage
- [ ] Delete the `token` key
- [ ] Try to navigate to dashboard
- [ ] ✅ Should redirect to login
- [ ] Try to access any API endpoint
- [ ] ✅ Should redirect to login

---

## 🔌 Backend API Tests (Optional)

### Using Postman or curl

#### Test Signup
```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"API Test","email":"api@test.com","password":"test123"}'
```
- [ ] ✅ Should return 201 Created with user data

#### Test Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"api@test.com","password":"test123"}'
```
- [ ] ✅ Should return 200 OK with JWT token
- [ ] Copy the token for next tests

#### Test Create Meeting
```bash
curl -X POST http://localhost:8080/api/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"API Test Meeting","description":"Test","transcript":"Test transcript","meetingDateTime":"2026-01-20T10:00:00"}'
```
- [ ] ✅ Should return 201 Created with meeting data

#### Test Get Meetings
```bash
curl -X GET http://localhost:8080/api/meetings \
  -H "Authorization: Bearer YOUR_TOKEN"
```
- [ ] ✅ Should return 200 OK with array of meetings

#### Test Generate Summary
```bash
curl -X POST http://localhost:8080/api/meetings/1/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```
- [ ] ✅ Should return 200 OK with summary and action items
- [ ] ✅ Should take 3-5 seconds (Gemini API call)

#### Test Get Tasks
```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```
- [ ] ✅ Should return 200 OK with array of tasks

#### Test Update Task
```bash
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status":"IN_PROGRESS"}'
```
- [ ] ✅ Should return 200 OK with updated task

---

## 🐛 Error Handling Tests

### Invalid Credentials
- [ ] Try login with wrong password
- [ ] ✅ Should see error message
- [ ] ✅ Should stay on login page

### Duplicate Email
- [ ] Try to sign up with existing email
- [ ] ✅ Should see error: "Email already exists"

### Missing Required Fields
- [ ] Try to create meeting without title
- [ ] ✅ Should see validation error

### Network Error Simulation
- [ ] Stop backend server
- [ ] Try to create a meeting
- [ ] ✅ Should see error message
- [ ] Start backend server
- [ ] Try again
- [ ] ✅ Should work

---

## 📊 Data Verification

### Database Check (Optional)
```sql
-- Connect to database
psql -U postgres -d insightai_db

-- Check users
SELECT id, full_name, email, role FROM users;

-- Check meetings
SELECT id, title, created_by_id, summary IS NOT NULL as has_summary FROM meetings;

-- Check tasks
SELECT id, title, status, meeting_id FROM tasks;
```

---

## ✅ Final Checklist

- [ ] All authentication tests passed
- [ ] All dashboard tests passed
- [ ] All meeting tests passed
- [ ] All AI summary tests passed
- [ ] All task tests passed
- [ ] All UI/UX tests passed
- [ ] All authorization tests passed
- [ ] All error handling tests passed

---

## 🎉 Success Criteria

If all tests pass, you should be able to:

1. ✅ Sign up and login securely
2. ✅ Create meetings with transcripts
3. ✅ Generate AI summaries using Gemini Pro
4. ✅ See extracted action items as tasks
5. ✅ Update task statuses
6. ✅ View dashboard with real-time stats
7. ✅ Navigate seamlessly between pages
8. ✅ See appropriate loading and empty states
9. ✅ Handle errors gracefully
10. ✅ Ensure data privacy (users can't access others' data)

---

## 📝 Notes

- Gemini API calls may take 3-5 seconds
- Free tier has rate limits (wait if quota exceeded)
- JWT tokens expire after 24 hours
- All data is stored in PostgreSQL
- Frontend uses localStorage for token storage

---

## 🆘 If Something Fails

1. Check browser console for errors
2. Check backend terminal for errors
3. Verify database connection
4. Verify Gemini API key
5. Clear browser cache and localStorage
6. Restart backend and frontend
7. Check `SETUP_AND_TEST.md` for troubleshooting

---

**Happy Testing! 🚀**
