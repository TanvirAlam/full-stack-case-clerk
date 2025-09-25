import { Task, AppState, TaskFilter, SortBy } from '../types';

// Storage keys
const STORAGE_KEYS = {
  TASKS: 'todo-app-tasks',
  STATE: 'todo-app-state',
  VERSION: 'todo-app-version',
} as const;

// Current version for data migration
const CURRENT_VERSION = '1.0.0';

/**
 * Create a safe copy of a task (converts dates to Date objects)
 */
const safeTaskCopy = (task: any): Task => {
  return {
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    subtasks: task.subtasks.map((subtask: any) => ({
      ...subtask,
      createdAt: new Date(subtask.createdAt),
      updatedAt: new Date(subtask.updatedAt),
    })),
  };
};

// Default state
const DEFAULT_STATE: Omit<AppState, 'tasks'> = {
  filter: TaskFilter.ALL,
  sortBy: SortBy.UPDATED,
  searchQuery: '',
  selectedTaskIds: new Set(),
};

/**
 * Check if localStorage is available
 */
const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Safely parse JSON with fallback
 */
const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    const parsed = JSON.parse(json);
    return parsed;
  } catch (error) {
    console.warn('Failed to parse JSON from localStorage:', error);
    return fallback;
  }
};

/**
 * Safely stringify JSON
 */
const safeJsonStringify = (data: any): string | null => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Failed to stringify data for localStorage:', error);
    return null;
  }
};

/**
 * Validate task data structure
 */
const isValidTask = (task: any): task is Task => {
  return (
    task &&
    typeof task === 'object' &&
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.priority === 'string' &&
    typeof task.completed === 'boolean' &&
    Array.isArray(task.subtasks) &&
    task.createdAt &&
    task.updatedAt
  );
};

/**
 * Validate and sanitize tasks array
 */
const validateTasks = (tasks: any[]): Task[] => {
  if (!Array.isArray(tasks)) {
    console.warn('Tasks data is not an array, returning empty array');
    return [];
  }

  return tasks
    .filter((task) => {
      const isValid = isValidTask(task);
      if (!isValid) {
        console.warn('Invalid task data found, skipping:', task);
      }
      return isValid;
    })
    .map(safeTaskCopy);
};

/**
 * Save tasks to localStorage
 */
export const saveTasks = (tasks: Task[]): boolean => {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    const serialized = safeJsonStringify(tasks);
    if (serialized === null) {
      return false;
    }

    localStorage.setItem(STORAGE_KEYS.TASKS, serialized);
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    return true;
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
    return false;
  }
};

/**
 * Load tasks from localStorage
 */
export const loadTasks = (): Task[] => {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!stored) {
      return [];
    }

    const parsed = safeJsonParse(stored, []);
    return validateTasks(parsed);
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return [];
  }
};

/**
 * Save app state to localStorage
 */
export const saveAppState = (state: Omit<AppState, 'tasks'>): boolean => {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    // Convert Set to Array for serialization
    const serializable = {
      ...state,
      selectedTaskIds: Array.from(state.selectedTaskIds),
    };

    const serialized = safeJsonStringify(serializable);
    if (serialized === null) {
      return false;
    }

    localStorage.setItem(STORAGE_KEYS.STATE, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save app state to localStorage:', error);
    return false;
  }
};

/**
 * Load app state from localStorage
 */
export const loadAppState = (): Omit<AppState, 'tasks'> => {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return DEFAULT_STATE;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATE);
    if (!stored) {
      return DEFAULT_STATE;
    }

    const parsed = safeJsonParse(stored, DEFAULT_STATE);
    
    // Convert Array back to Set and validate
    return {
      filter: parsed.filter || DEFAULT_STATE.filter,
      sortBy: parsed.sortBy || DEFAULT_STATE.sortBy,
      searchQuery: parsed.searchQuery || DEFAULT_STATE.searchQuery,
      selectedTaskIds: new Set(
        Array.isArray(parsed.selectedTaskIds) 
          ? parsed.selectedTaskIds 
          : []
      ),
    };
  } catch (error) {
    console.error('Failed to load app state from localStorage:', error);
    return DEFAULT_STATE;
  }
};

/**
 * Clear all stored data
 */
export const clearStorage = (): boolean => {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
};

/**
 * Get storage usage information
 */
export const getStorageInfo = () => {
  if (!isStorageAvailable()) {
    return {
      available: false,
      tasksSize: 0,
      stateSize: 0,
      totalSize: 0,
    };
  }

  const getItemSize = (key: string): number => {
    const item = localStorage.getItem(key);
    return item ? new Blob([item]).size : 0;
  };

  const tasksSize = getItemSize(STORAGE_KEYS.TASKS);
  const stateSize = getItemSize(STORAGE_KEYS.STATE);
  const totalSize = tasksSize + stateSize;

  return {
    available: true,
    tasksSize,
    stateSize,
    totalSize,
  };
};

/**
 * Check if data migration is needed
 */
export const needsMigration = (): boolean => {
  if (!isStorageAvailable()) {
    return false;
  }

  const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
  return storedVersion !== CURRENT_VERSION;
};

/**
 * Perform data migration (placeholder for future versions)
 */
export const migrateData = (): boolean => {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    
    if (!storedVersion) {
      // First time user or pre-version data
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
      return true;
    }

    // Future migration logic would go here
    // For now, just update the version
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    return true;
  } catch (error) {
    console.error('Failed to migrate data:', error);
    return false;
  }
};

/**
 * Export tasks as JSON string for backup
 */
export const exportTasks = (tasks: Task[]): string | null => {
  try {
    return safeJsonStringify({
      version: CURRENT_VERSION,
      exportDate: new Date().toISOString(),
      tasks: tasks,
    });
  } catch (error) {
    console.error('Failed to export tasks:', error);
    return null;
  }
};

/**
 * Import tasks from JSON string
 */
export const importTasks = (jsonString: string): Task[] | null => {
  try {
    const parsed = safeJsonParse(jsonString, null);
    if (!parsed || !parsed.tasks) {
      return null;
    }

    return validateTasks(parsed.tasks);
  } catch (error) {
    console.error('Failed to import tasks:', error);
    return null;
  }
};

// Storage event handler for cross-tab synchronization
export const createStorageListener = (
  onTasksChange: (tasks: Task[]) => void,
  onStateChange: (state: Omit<AppState, 'tasks'>) => void
) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.TASKS) {
      const newTasks = loadTasks();
      onTasksChange(newTasks);
    } else if (event.key === STORAGE_KEYS.STATE) {
      const newState = loadAppState();
      onStateChange(newState);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};