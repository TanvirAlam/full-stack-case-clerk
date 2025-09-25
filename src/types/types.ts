export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export type TaskFilter = 'all' | 'active' | 'done';

export interface TaskStats {
  total: number;
  active: number;
  completed: number;
}