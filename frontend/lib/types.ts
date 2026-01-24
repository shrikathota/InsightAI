export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface Meeting {
  id: number;
  title: string;
  description?: string;
  transcript?: string;
  summary?: string;
  meetingDateTime: string;
  createdBy: User;
  summaryGeneratedBy?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingRequest {
  title: string;
  description?: string;
  transcript?: string;
  meetingDateTime: string;
}

export interface Task {
  id: number;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  meeting: Meeting;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ActionItem {
  action: string;
  owner: string;
  deadline: string;
}

export interface SummaryResponse {
  summary: string;
  actionItems: ActionItem[];
  tasksCreated: number;
}
