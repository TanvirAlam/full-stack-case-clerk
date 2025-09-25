export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  subtasks: Subtask[];
  createdAt: string;
}

export type TaskFilter = 'all' | 'active' | 'done';

export interface TaskStats {
  total: number;
  active: number;
  completed: number;
}