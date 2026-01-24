# InsightAI - AI-Powered Meeting Assistant

> Transform your meeting transcripts into actionable insights with AI

InsightAI is a full-stack web application that helps teams manage meetings, generate AI-powered summaries, and track action items automatically.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user registration and login
- 📝 **Meeting Management** - Create and organize meetings with transcripts
- 🤖 **AI Summaries** - Generate intelligent summaries using Google Gemini Pro
- ✅ **Task Extraction** - Automatically extract action items from meetings
- 📊 **Task Board** - Kanban-style task management (To Do, In Progress, Done)
- 🎨 **Modern UI** - Clean, responsive interface built with Next.js and Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 18+
- PostgreSQL 14+
- [Gemini API Key](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd InsightAI
   ```

2. **Setup Database**
   ```bash
   createdb insightai_db
   ```

3. **Configure Backend**
   - Copy the template file:
     ```bash
     cp backend/src/main/resources/application.properties.template backend/src/main/resources/application.properties
     ```
   - Edit `backend/src/main/resources/application.properties`
   - Add your Gemini API key:
     ```properties
     gemini.api.key=YOUR_API_KEY_HERE
     ```
   - **Note:** `application.properties` is gitignored for security

4. **Start Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Backend runs on `http://localhost:8080`

5. **Start Frontend** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

6. **Open Browser**
   ```
   http://localhost:3000
   ```

## 📖 Usage

1. **Sign Up** - Create a new account
2. **Create Meeting** - Add meeting details and transcript
3. **Generate Summary** - Click to generate AI-powered summary
4. **View Tasks** - See extracted action items in the task board
5. **Update Status** - Track progress by updating task status

## 🏗️ Tech Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.x** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database access
- **PostgreSQL** - Database
- **JWT** - Token-based authentication
- **Google Gemini Pro** - AI summary generation

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **shadcn/ui** - UI component theme

## 📁 Project Structure

```
InsightAI/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/insightai/
│   │       ├── config/      # Security, CORS configuration
│   │       ├── controller/  # REST API endpoints
│   │       ├── dto/         # Data transfer objects
│   │       ├── entity/      # JPA entities
│   │       ├── exception/   # Custom exceptions
│   │       ├── repository/  # Database repositories
│   │       ├── security/    # JWT, authentication
│   │       └── service/     # Business logic
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/                # Next.js frontend
│   ├── app/                 # Pages (App Router)
│   │   ├── dashboard/       # Dashboard page
│   │   ├── login/           # Login page
│   │   ├── meetings/        # Meetings pages
│   │   ├── signup/          # Signup page
│   │   └── tasks/           # Tasks page
│   ├── components/          # React components
│   ├── lib/                 # Utilities, API client
│   └── styles/              # Global styles
│
└── docs/                    # Documentation
    ├── SETUP_AND_TEST.md    # Detailed setup guide
    ├── POSTMAN_COLLECTION.md # API documentation
    └── PROJECT_SUMMARY.md   # Complete project overview
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings` - List all meetings
- `GET /api/meetings/{id}` - Get meeting details
- `POST /api/meetings/{id}/summary` - Generate AI summary

### Tasks
- `GET /api/tasks` - List all tasks
- `PUT /api/tasks/{id}` - Update task status

See [POSTMAN_COLLECTION.md](POSTMAN_COLLECTION.md) for detailed API documentation.

## 🧪 Testing

### Test the Complete Flow

1. Sign up with a new account
2. Create a meeting with this transcript:
   ```
   We discussed the Q1 roadmap. John will complete the API by Friday. 
   Sarah will review the documentation. We need to schedule a client 
   demo next week.
   ```
3. Generate AI summary
4. View extracted tasks in the task board
5. Update task statuses

### API Testing

Use Postman or curl to test the backend APIs directly. See [POSTMAN_COLLECTION.md](POSTMAN_COLLECTION.md) for examples.

## 📚 Documentation

- **[SETUP_AND_TEST.md](SETUP_AND_TEST.md)** - Complete setup and testing guide
- **[POSTMAN_COLLECTION.md](POSTMAN_COLLECTION.md)** - API documentation with examples
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Detailed project overview
- **[.kiro/specs/](.kiro/specs/ai-meeting-assistant/)** - Requirements and design documents

## 🔒 Security

- Passwords hashed with BCrypt
- JWT-based stateless authentication
- Role-based authorization (ADMIN, MEMBER)
- CORS protection
- Input validation
- SQL injection prevention with JPA

## 🎯 Key Features Explained

### AI Summary Generation

InsightAI uses Google Gemini Pro to analyze meeting transcripts and generate:
- **Concise Summary** - Overview of the meeting
- **Key Decisions** - Important decisions made
- **Action Items** - Tasks with owner and deadline

### Task Management

Tasks are automatically extracted from AI summaries and can be:
- Viewed in a kanban-style board
- Updated with status (To Do, In Progress, Done)
- Linked back to source meetings

### Authorization

Users can only access their own meetings and tasks, ensuring data privacy. ADMIN users have access to all resources.

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify database `insightai_db` exists
- Check port 8080 is available

### Frontend won't start
- Run `npm install` first
- Check port 3000 is available
- Clear `.next` folder and rebuild

### AI summary fails
- Verify Gemini API key is correct
- Check internet connection
- Ensure transcript is not empty

See [SETUP_AND_TEST.md](SETUP_AND_TEST.md) for more troubleshooting tips.

## 📝 License

This project is for educational purposes.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your own use.

## 📧 Support

For issues or questions, please refer to the documentation files in the project.

---

**Built with ❤️ using Spring Boot, Next.js, and Google Gemini Pro**
