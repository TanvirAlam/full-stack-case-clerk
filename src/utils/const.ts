// App Configuration Constants
export const APP_CONFIG = {
  TITLE: '✨ Todo Master',
  SUBTITLE: 'Organize your life, one task at a time',
} as const;

// LocalStorage Keys
export const STORAGE_KEYS = {
  TODOS: 'todos',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  PARSING_TASKS: 'Error parsing saved tasks:',
} as const;

// Priority Colors
export const PRIORITY_COLORS = {
  HIGH: '#ff6b6b',
  MEDIUM: '#ffd43b',
  LOW: '#51cf66',
  DEFAULT: '#adb5bd',
} as const;

// Form Placeholders
export const PLACEHOLDERS = {
  TASK_TITLE: 'What needs to be done?',
  TASK_DESCRIPTION: 'Add a description (optional)',
  SEARCH_TASKS: 'Search tasks...',
} as const;

// Button Labels
export const BUTTON_LABELS = {
  ADD_TASK: 'Add Task',
  LOW_PRIORITY: 'Low Priority',
  MEDIUM_PRIORITY: 'Medium Priority',
  HIGH_PRIORITY: 'High Priority',
  UNDO: '↶',
  COMPLETE: '✓',
  DELETE: '🗑',
} as const;

// Filter Labels
export const FILTER_LABELS = {
  ALL: 'All',
  ACTIVE: 'Active', 
  DONE: 'Done',
} as const;

// Empty State Content
export const EMPTY_STATE = {
  NO_TASKS: {
    ICON: '✨',
    TITLE: 'All caught up!',
    DESCRIPTION: 'No tasks here. Time to add something new or enjoy the moment!',
  },
  NO_SEARCH_RESULTS: {
    ICON: '🔍',
    TITLE: 'No tasks found',
    DESCRIPTION: 'Try adjusting your search or filter criteria',
  },
} as const;

// Task Priority Values
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high',
} as const;

// Task Filter Values
export const TASK_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  DONE: 'done',
} as const;

// Form Input Types
export const INPUT_TYPES = {
  TEXT: 'text',
  SUBMIT: 'submit',
} as const;

// Button Variants
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary', 
  SUCCESS: 'success',
  DANGER: 'danger',
} as const;

// CSS Style Values
export const CSS_VALUES = {
  MIN_WIDTH_140: '140px',
} as const;

// Unicode Whitespace Pattern for regex
export const UNICODE_WHITESPACE_PATTERN = /[\u00A0\u1680\u2000-\u200B\u2028\u2029\u202F\u205F\u3000\uFEFF]/g;

// Priority Order for sorting
export const PRIORITY_ORDER = {
  [TASK_PRIORITIES.HIGH]: 3,
  [TASK_PRIORITIES.MEDIUM]: 2,
  [TASK_PRIORITIES.LOW]: 1,
} as const;

// Test Constants (for setup.ts)
export const TEST_CONSTANTS = {
  TEST_TASK_TITLE: 'Test Task',
  TEST_TASK_DESCRIPTION: 'Test Description',
  TEST_ID_PREFIX: 'test-id-',
  NODE_ENV_TEST: 'test',
} as const;