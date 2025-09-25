export interface Task {
  id: string;
  title: string;
  subtitle?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
}

export interface LogoProps {
  size?: string;
  animated?: boolean;
  className?: string;
}

export type TaskFilter = 'all' | 'active' | 'done';