import { Task } from '../types';

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// LocalStorage utilities
export const saveToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const loadFromStorage = (): Task[] => {
  try {
    const saved = localStorage.getItem('todo-tasks');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
  return [];
};

// Task filtering and sorting
export const filterTasks = (tasks: Task[], filter: 'all' | 'active' | 'done'): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter(task => !task.completed);
    case 'done':
      return tasks.filter(task => task.completed);
    default:
      return tasks;
  }
};

export const searchTasks = (tasks: Task[], query: string): Task[] => {
  if (!query.trim()) return tasks;
  
  const normalizedQuery = query.toLowerCase().trim();
  return tasks.filter(task => {
    const searchableText = [
      task.title,
      task.subtitle || '',
    ].join(' ').toLowerCase();
    
    return searchableText.includes(normalizedQuery);
  });
};

export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // Active tasks first, then by creation date
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
};