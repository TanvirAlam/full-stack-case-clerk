// Priority levels for tasks
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// Filter options for task display
export enum TaskFilter {
  ALL = 'all',
  ACTIVE = 'active',
  DONE = 'done',
}

// Sort options for tasks
export enum SortBy {
  UPDATED = 'updated',
  PRIORITY = 'priority',
  CREATED = 'created',
}

// Subtask interface
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Main task interface
export interface Task {
  id: string;
  title: string;
  subtitle?: string;
  notes?: string;
  priority: Priority;
  completed: boolean;
  subtasks: Subtask[];
  createdAt: Date;
  updatedAt: Date;
}

// Task creation payload (without generated fields)
export interface CreateTaskPayload {
  title: string;
  subtitle?: string;
  notes?: string;
  priority: Priority;
}

// Task update payload (partial updates)
export interface UpdateTaskPayload {
  title?: string;
  subtitle?: string;
  notes?: string;
  priority?: Priority;
  completed?: boolean;
}

// Subtask creation payload
export interface CreateSubtaskPayload {
  title: string;
}

// Subtask update payload
export interface UpdateSubtaskPayload {
  title?: string;
  completed?: boolean;
}

// App state interface
export interface AppState {
  tasks: Task[];
  filter: TaskFilter;
  sortBy: SortBy;
  searchQuery: string;
  selectedTaskIds: Set<string>;
}

// Action types for reducer
export enum ActionType {
  // Task actions
  CREATE_TASK = 'CREATE_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  TOGGLE_TASK = 'TOGGLE_TASK',
  REORDER_TASKS = 'REORDER_TASKS',
  
  // Subtask actions
  CREATE_SUBTASK = 'CREATE_SUBTASK',
  UPDATE_SUBTASK = 'UPDATE_SUBTASK',
  DELETE_SUBTASK = 'DELETE_SUBTASK',
  TOGGLE_SUBTASK = 'TOGGLE_SUBTASK',
  
  // UI actions
  SET_FILTER = 'SET_FILTER',
  SET_SORT_BY = 'SET_SORT_BY',
  SET_SEARCH_QUERY = 'SET_SEARCH_QUERY',
  
  // Selection actions
  SELECT_TASK = 'SELECT_TASK',
  DESELECT_TASK = 'DESELECT_TASK',
  SELECT_ALL_TASKS = 'SELECT_ALL_TASKS',
  CLEAR_SELECTION = 'CLEAR_SELECTION',
  
  // Bulk actions
  BULK_TOGGLE_TASKS = 'BULK_TOGGLE_TASKS',
  BULK_DELETE_TASKS = 'BULK_DELETE_TASKS',
  
  // Data management
  LOAD_TASKS = 'LOAD_TASKS',
  RESET_STATE = 'RESET_STATE',
}

// Action interfaces
export interface CreateTaskAction {
  type: ActionType.CREATE_TASK;
  payload: CreateTaskPayload;
}

export interface UpdateTaskAction {
  type: ActionType.UPDATE_TASK;
  payload: { id: string; updates: UpdateTaskPayload };
}

export interface DeleteTaskAction {
  type: ActionType.DELETE_TASK;
  payload: { id: string };
}

export interface ToggleTaskAction {
  type: ActionType.TOGGLE_TASK;
  payload: { id: string };
}

export interface ReorderTasksAction {
  type: ActionType.REORDER_TASKS;
  payload: { taskIds: string[] };
}

export interface CreateSubtaskAction {
  type: ActionType.CREATE_SUBTASK;
  payload: { taskId: string; subtask: CreateSubtaskPayload };
}

export interface UpdateSubtaskAction {
  type: ActionType.UPDATE_SUBTASK;
  payload: { taskId: string; subtaskId: string; updates: UpdateSubtaskPayload };
}

export interface DeleteSubtaskAction {
  type: ActionType.DELETE_SUBTASK;
  payload: { taskId: string; subtaskId: string };
}

export interface ToggleSubtaskAction {
  type: ActionType.TOGGLE_SUBTASK;
  payload: { taskId: string; subtaskId: string };
}

export interface SetFilterAction {
  type: ActionType.SET_FILTER;
  payload: { filter: TaskFilter };
}

export interface SetSortByAction {
  type: ActionType.SET_SORT_BY;
  payload: { sortBy: SortBy };
}

export interface SetSearchQueryAction {
  type: ActionType.SET_SEARCH_QUERY;
  payload: { query: string };
}

export interface SelectTaskAction {
  type: ActionType.SELECT_TASK;
  payload: { id: string };
}

export interface DeselectTaskAction {
  type: ActionType.DESELECT_TASK;
  payload: { id: string };
}

export interface SelectAllTasksAction {
  type: ActionType.SELECT_ALL_TASKS;
}

export interface ClearSelectionAction {
  type: ActionType.CLEAR_SELECTION;
}

export interface BulkToggleTasksAction {
  type: ActionType.BULK_TOGGLE_TASKS;
  payload: { taskIds: string[]; completed: boolean };
}

export interface BulkDeleteTasksAction {
  type: ActionType.BULK_DELETE_TASKS;
  payload: { taskIds: string[] };
}

export interface LoadTasksAction {
  type: ActionType.LOAD_TASKS;
  payload: { tasks: Task[] };
}

export interface ResetStateAction {
  type: ActionType.RESET_STATE;
}

// Union type for all actions
export type AppAction =
  | CreateTaskAction
  | UpdateTaskAction
  | DeleteTaskAction
  | ToggleTaskAction
  | ReorderTasksAction
  | CreateSubtaskAction
  | UpdateSubtaskAction
  | DeleteSubtaskAction
  | ToggleSubtaskAction
  | SetFilterAction
  | SetSortByAction
  | SetSearchQueryAction
  | SelectTaskAction
  | DeselectTaskAction
  | SelectAllTasksAction
  | ClearSelectionAction
  | BulkToggleTasksAction
  | BulkDeleteTasksAction
  | LoadTasksAction
  | ResetStateAction;

// Undo action interface
export interface UndoableAction {
  action: AppAction;
  undo: AppAction;
  description: string;
  timestamp: Date;
}

// Toast notification types
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Keyboard shortcuts
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}