export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  is_default: boolean;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  priority: Priority;
  status: TaskStatus;
  due_date: string | null; // ISO date string
  estimated_duration: number | null; // minutes
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  category_id?: string | null;
  priority: Priority;
  status: TaskStatus;
  due_date?: string | null;
  estimated_duration?: number | null;
}

export interface AISubtask {
  title: string;
  estimated_duration: number;
}

export interface AIBreakdownResponse {
  subtasks: AISubtask[];
}

export interface AIPrioritySuggestion {
  suggested_priority: Priority;
  reason: string;
}

export interface AIPlanItem {
  time: string;
  task_title: string;
  task_id?: string;
  duration_minutes: number;
  is_break: boolean;
}

export interface AIPlanResponse {
  plan: AIPlanItem[];
}

export interface AIInsightsResponse {
  insights: string[];
}
