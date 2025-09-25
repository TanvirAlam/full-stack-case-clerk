import type { Task, TaskFilter, TaskStats } from '../types/types';
import {
  STORAGE_KEYS,
  ERROR_MESSAGES,
  PRIORITY_COLORS,
  TASK_FILTERS,
  PRIORITY_ORDER,
  TASK_PRIORITIES,
  UNICODE_WHITESPACE_PATTERN,
} from './const';

// Comprehensive whitespace checking including Unicode whitespace
export const isEffectivelyEmpty = (str: string): boolean => {
  if (!str) return true;
  // Remove all Unicode whitespace characters and check if anything remains
  const withoutUnicodeWhitespace = str.replace(UNICODE_WHITESPACE_PATTERN, '');
  return withoutUnicodeWhitespace.trim() === '';
};

// ID Generation
export const generateId = (): string => Math.random().toString(36).substr(2, 9);

// LocalStorage Operations
export const loadTasksFromStorage = (): Task[] => {
  const savedTasks = localStorage.getItem(STORAGE_KEYS.TODOS);
  if (savedTasks) {
    try {
      const parsed = JSON.parse(savedTasks);
      // Ensure we have a valid array of task objects
      if (Array.isArray(parsed)) {
        // Validate that each item is a valid task object
        const validTasks = parsed.filter(item => 
          item && 
          typeof item === 'object' && 
          typeof item.id === 'string' && 
          typeof item.title === 'string'
        );
        return validTasks;
      }
      return [];
    } catch (error) {
      console.error(ERROR_MESSAGES.PARSING_TASKS, error);
      localStorage.removeItem(STORAGE_KEYS.TODOS);
    }
  }
  return [];
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(tasks));
};

// Priority Colors
export const getPriorityColor = (priority: Task['priority']): string => {
  switch (priority) {
    case TASK_PRIORITIES.HIGH: return PRIORITY_COLORS.HIGH;
    case TASK_PRIORITIES.MEDIUM: return PRIORITY_COLORS.MEDIUM;
    case TASK_PRIORITIES.LOW: return PRIORITY_COLORS.LOW;
    default: return PRIORITY_COLORS.DEFAULT;
  }
};

// Task Filtering and Sorting
export const filterTasksByStatus = (tasks: Task[], filter: TaskFilter): Task[] => {
  switch (filter) {
    case TASK_FILTERS.ACTIVE: return tasks.filter(task => !task.completed);
    case TASK_FILTERS.DONE: return tasks.filter(task => task.completed);
    default: return tasks;
  }
};

export const filterTasksBySearch = (tasks: Task[], searchQuery: string): Task[] => {
  if (!searchQuery.trim()) return tasks;
  
  const query = searchQuery.toLowerCase();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(query) ||
    (task.description && task.description.toLowerCase().includes(query))
  );
};

export const sortTasks = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => {
    // Sort by completion status first (incomplete first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then by priority
    if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
      return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
    }
    // Finally by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

// Task Statistics
export const calculateTaskStats = (tasks: Task[]): TaskStats => ({
  total: tasks.length,
  active: tasks.filter(task => !task.completed).length,
  completed: tasks.filter(task => task.completed).length,
});