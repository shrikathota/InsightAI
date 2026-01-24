# InsightAI Frontend

AI-powered Meeting Assistant Frontend built with Next.js 14

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Project Structure

```
frontend/
├── app/                    # Next.js 14 App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── dashboard/         # Dashboard page
│   ├── meetings/          # Meetings pages
│   └── tasks/             # Tasks page
├── components/            # Reusable React components
├── lib/                   # Utility functions and API client
├── styles/                # Additional styles
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── next.config.js         # Next.js configuration
```

## Features

- **Authentication**: JWT-based login and signup
- **Meetings**: Create and manage meetings with transcripts
- **AI Summaries**: Generate AI-powered summaries using Gemini Pro
- **Tasks**: View and update tasks extracted from meetings
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Environment Variables

The frontend connects to the backend at `http://localhost:8080` by default.

## Building for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: UI component library
- **Axios**: HTTP client
- **Lucide React**: Icon library
