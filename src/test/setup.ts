import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string | null => {
      return store[key] || null;
    },
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    length: 0,
    key: (index: number): string | null => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();
  
  // Reset console mocks
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  // Restore console methods after each test if needed for debugging
  if (process.env.NODE_ENV !== 'test') {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  }
});

// Global test utilities
export const createMockTask = (overrides: Partial<import('../types/types').Task> = {}) => ({
  id: 'test-id-' + Math.random().toString(36).substr(2, 9),
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  priority: 'medium' as const,
  createdAt: new Date().toISOString(),
  ...overrides
});

export const createMockTasks = (count: number) => 
  Array.from({ length: count }, (_, i) => createMockTask({
    id: `task-${i}`,
    title: `Task ${i + 1}`,
    description: `Description ${i + 1}`
  }));

// Mock corrupted localStorage
export const corruptLocalStorage = (corruptedData: string) => {
  localStorage.setItem('todos', corruptedData);
};

// Utility to wait for async operations
export const waitFor = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate rapid user interactions
export const simulateRapidClicks = async (callback: () => void, count: number = 3, delay: number = 10) => {
  for (let i = 0; i < count; i++) {
    callback();
    await waitFor(delay);
  }
};