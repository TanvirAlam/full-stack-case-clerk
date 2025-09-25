import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { Task, Priority, SortBy, TaskFilter } from '../types';

/**
 * Generate a unique ID using timestamp and random string
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format date for display in UI
 */
export const formatDate = (date: Date): string => {
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  }
  
  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }
  
  // For dates within a week, show relative time
  const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (daysAgo <= 7) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  
  return format(date, 'MMM d, yyyy');
};

/**
 * Get priority color for styling
 */
export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case Priority.HIGH:
      return '#EF4444'; // Red
    case Priority.MEDIUM:
      return '#F59E0B'; // Amber
    case Priority.LOW:
      return '#10B981'; // Green
    default:
      return '#6B7280'; // Gray
  }
};

/**
 * Get priority weight for sorting
 */
export const getPriorityWeight = (priority: Priority): number => {
  switch (priority) {
    case Priority.HIGH:
      return 3;
    case Priority.MEDIUM:
      return 2;
    case Priority.LOW:
      return 1;
    default:
      return 0;
  }
};

/**
 * Sort tasks based on sort criteria
 */
export const sortTasks = (tasks: Task[], sortBy: SortBy): Task[] => {
  const sortedTasks = [...tasks];
  
  switch (sortBy) {
    case SortBy.PRIORITY:
      return sortedTasks.sort((a, b) => {
        // First sort by completion status (active tasks first)
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Then by priority weight (high to low)
        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      });
      
    case SortBy.CREATED:
      return sortedTasks.sort((a, b) => {
        // First sort by completion status (active tasks first)
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Then by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
    case SortBy.UPDATED:
    default:
      return sortedTasks.sort((a, b) => {
        // First sort by completion status (active tasks first)
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Then by update date (most recently updated first)
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }
};

/**
 * Filter tasks based on filter criteria
 */
export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  switch (filter) {
    case TaskFilter.ACTIVE:
      return tasks.filter(task => !task.completed);
    case TaskFilter.DONE:
      return tasks.filter(task => task.completed);
    case TaskFilter.ALL:
    default:
      return tasks;
  }
};

/**
 * Search tasks by query string
 */
export const searchTasks = (tasks: Task[], query: string): Task[] => {
  if (!query.trim()) {
    return tasks;
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return tasks.filter(task => {
    // Search in title, subtitle, and notes
    const searchableText = [
      task.title,
      task.subtitle || '',
      task.notes || '',
      // Also search in subtasks
      ...task.subtasks.map(subtask => subtask.title)
    ].join(' ').toLowerCase();
    
    return searchableText.includes(normalizedQuery);
  });
};

/**
 * Check if a string is empty or only whitespace
 */
export const isEmpty = (str?: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Truncate text to specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Clamp a number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Debounce function to limit rapid calls
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Check if two arrays are equal (shallow comparison)
 */
export const arraysEqual = <T>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  
  return a.every((val, index) => val === b[index]);
};

/**
 * Get task completion statistics
 */
export const getTaskStats = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = total - completed;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    total,
    completed,
    active,
    completionRate,
  };
};

/**
 * Get subtask completion statistics for a task
 */
export const getSubtaskStats = (task: Task) => {
  const total = task.subtasks.length;
  const completed = task.subtasks.filter(subtask => subtask.completed).length;
  const active = total - completed;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    total,
    completed,
    active,
    completionRate,
  };
};

/**
 * Validate task title
 */
export const validateTaskTitle = (title: string): string | null => {
  if (isEmpty(title)) {
    return 'Task title is required';
  }
  
  if (title.trim().length > 200) {
    return 'Task title is too long (max 200 characters)';
  }
  
  return null;
};

/**
 * Validate subtask title
 */
export const validateSubtaskTitle = (title: string): string | null => {
  if (isEmpty(title)) {
    return 'Subtask title is required';
  }
  
  if (title.trim().length > 100) {
    return 'Subtask title is too long (max 100 characters)';
  }
  
  return null;
};

