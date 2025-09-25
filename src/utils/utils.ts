import type { Task, TaskFilter, TaskStats } from '../types/types';

// Comprehensive whitespace checking including Unicode whitespace
export const isEffectivelyEmpty = (str: string): boolean => {
  if (!str) return true;
  // Remove all Unicode whitespace characters and check if anything remains
  const withoutUnicodeWhitespace = str.replace(/[\u00A0\u1680\u2000-\u200B\u2028\u2029\u202F\u205F\u3000\uFEFF]/g, '');
  return withoutUnicodeWhitespace.trim() === '';
};

// ID Generation
export const generateId = (): string => Math.random().toString(36).substr(2, 9);

// LocalStorage Operations
export const loadTasksFromStorage = (): Task[] => {
  const savedTasks = localStorage.getItem('todos');
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
      console.error('Error parsing saved tasks:', error);
      localStorage.removeItem('todos');
    }
  }
  return [];
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  localStorage.setItem('todos', JSON.stringify(tasks));
};

// Priority Colors
export const getPriorityColor = (priority: Task['priority']): string => {
  switch (priority) {
    case 'high': return '#ff6b6b';
    case 'medium': return '#ffd43b';
    case 'low': return '#51cf66';
    default: return '#adb5bd';
  }
};

// Task Filtering and Sorting
export const filterTasksByStatus = (tasks: Task[], filter: TaskFilter): Task[] => {
  switch (filter) {
    case 'active': return tasks.filter(task => !task.completed);
    case 'done': return tasks.filter(task => task.completed);
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
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
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