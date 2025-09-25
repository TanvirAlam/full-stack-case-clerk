import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  AppState, 
  AppAction, 
  ActionType, 
  Task,
  TaskFilter,
  SortBy,
  Priority,
  CreateTaskPayload,
  CreateSubtaskPayload,
  UpdateTaskPayload,
  UpdateSubtaskPayload
} from '../types';
import { taskReducer, createInitialState } from './taskReducer';
import { 
  loadTasks, 
  saveTasks, 
  loadAppState, 
  saveAppState,
  createStorageListener 
} from '../utils/storage';
import { filterTasks, sortTasks, searchTasks } from '../utils';

interface TaskContextValue {
  // State
  state: AppState;
  filteredTasks: Task[];
  
  // Task operations
  createTask: (payload: CreateTaskPayload) => void;
  updateTask: (id: string, updates: UpdateTaskPayload) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  reorderTasks: (taskIds: string[]) => void;
  
  // Subtask operations
  createSubtask: (taskId: string, payload: CreateSubtaskPayload) => void;
  updateSubtask: (taskId: string, subtaskId: string, updates: UpdateSubtaskPayload) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  
  // UI operations
  setFilter: (filter: TaskFilter) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSearchQuery: (query: string) => void;
  
  // Selection operations
  selectTask: (id: string) => void;
  deselectTask: (id: string) => void;
  selectAllTasks: () => void;
  clearSelection: () => void;
  toggleTaskSelection: (id: string) => void;
  
  // Bulk operations
  bulkToggleTasks: (taskIds: string[], completed: boolean) => void;
  bulkDeleteTasks: (taskIds: string[]) => void;
  
  // Utility functions
  getTask: (id: string) => Task | undefined;
  isTaskSelected: (id: string) => boolean;
  getSelectedTaskIds: () => string[];
  getSelectedTasks: () => Task[];
  
  // Data operations
  resetState: () => void;
  loadData: () => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, createInitialState());

  // Load initial data on mount
  useEffect(() => {
    const initialTasks = loadTasks();
    const initialState = loadAppState();
    
    if (initialTasks.length > 0) {
      dispatch({ type: ActionType.LOAD_TASKS, payload: { tasks: initialTasks } });
    }
    
    dispatch({ type: ActionType.SET_FILTER, payload: { filter: initialState.filter } });
    dispatch({ type: ActionType.SET_SORT_BY, payload: { sortBy: initialState.sortBy } });
    dispatch({ type: ActionType.SET_SEARCH_QUERY, payload: { query: initialState.searchQuery } });
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    saveTasks(state.tasks);
  }, [state.tasks]);

  // Save app state to localStorage whenever UI state changes
  useEffect(() => {
    const uiState = {
      filter: state.filter,
      sortBy: state.sortBy,
      searchQuery: state.searchQuery,
      selectedTaskIds: state.selectedTaskIds,
    };
    saveAppState(uiState);
  }, [state.filter, state.sortBy, state.searchQuery, state.selectedTaskIds]);

  // Set up cross-tab synchronization
  useEffect(() => {
    const unsubscribe = createStorageListener(
      (tasks) => {
        dispatch({ type: ActionType.LOAD_TASKS, payload: { tasks } });
      },
      (uiState) => {
        dispatch({ type: ActionType.SET_FILTER, payload: { filter: uiState.filter } });
        dispatch({ type: ActionType.SET_SORT_BY, payload: { sortBy: uiState.sortBy } });
        dispatch({ type: ActionType.SET_SEARCH_QUERY, payload: { query: uiState.searchQuery } });
      }
    );

    return unsubscribe;
  }, []);

  // Task operations
  const createTask = useCallback((payload: CreateTaskPayload) => {
    dispatch({ type: ActionType.CREATE_TASK, payload });
  }, []);

  const updateTask = useCallback((id: string, updates: UpdateTaskPayload) => {
    dispatch({ type: ActionType.UPDATE_TASK, payload: { id, updates } });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: ActionType.DELETE_TASK, payload: { id } });
  }, []);

  const toggleTask = useCallback((id: string) => {
    dispatch({ type: ActionType.TOGGLE_TASK, payload: { id } });
  }, []);

  const reorderTasks = useCallback((taskIds: string[]) => {
    dispatch({ type: ActionType.REORDER_TASKS, payload: { taskIds } });
  }, []);

  // Subtask operations
  const createSubtask = useCallback((taskId: string, payload: CreateSubtaskPayload) => {
    dispatch({ type: ActionType.CREATE_SUBTASK, payload: { taskId, subtask: payload } });
  }, []);

  const updateSubtask = useCallback((taskId: string, subtaskId: string, updates: UpdateSubtaskPayload) => {
    dispatch({ type: ActionType.UPDATE_SUBTASK, payload: { taskId, subtaskId, updates } });
  }, []);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    dispatch({ type: ActionType.DELETE_SUBTASK, payload: { taskId, subtaskId } });
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    dispatch({ type: ActionType.TOGGLE_SUBTASK, payload: { taskId, subtaskId } });
  }, []);

  // UI operations
  const setFilter = useCallback((filter: TaskFilter) => {
    dispatch({ type: ActionType.SET_FILTER, payload: { filter } });
  }, []);

  const setSortBy = useCallback((sortBy: SortBy) => {
    dispatch({ type: ActionType.SET_SORT_BY, payload: { sortBy } });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, payload: { query } });
  }, []);

  // Selection operations
  const selectTask = useCallback((id: string) => {
    dispatch({ type: ActionType.SELECT_TASK, payload: { id } });
  }, []);

  const deselectTask = useCallback((id: string) => {
    dispatch({ type: ActionType.DESELECT_TASK, payload: { id } });
  }, []);

  const selectAllTasks = useCallback(() => {
    dispatch({ type: ActionType.SELECT_ALL_TASKS });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: ActionType.CLEAR_SELECTION });
  }, []);

  const toggleTaskSelection = useCallback((id: string) => {
    if (state.selectedTaskIds.has(id)) {
      deselectTask(id);
    } else {
      selectTask(id);
    }
  }, [state.selectedTaskIds, selectTask, deselectTask]);

  // Bulk operations
  const bulkToggleTasks = useCallback((taskIds: string[], completed: boolean) => {
    dispatch({ type: ActionType.BULK_TOGGLE_TASKS, payload: { taskIds, completed } });
  }, []);

  const bulkDeleteTasks = useCallback((taskIds: string[]) => {
    dispatch({ type: ActionType.BULK_DELETE_TASKS, payload: { taskIds } });
  }, []);

  // Utility functions
  const getTask = useCallback((id: string) => {
    return state.tasks.find(task => task.id === id);
  }, [state.tasks]);

  const isTaskSelected = useCallback((id: string) => {
    return state.selectedTaskIds.has(id);
  }, [state.selectedTaskIds]);

  const getSelectedTaskIds = useCallback(() => {
    return Array.from(state.selectedTaskIds);
  }, [state.selectedTaskIds]);

  const getSelectedTasks = useCallback(() => {
    return state.tasks.filter(task => state.selectedTaskIds.has(task.id));
  }, [state.tasks, state.selectedTaskIds]);

  // Data operations
  const resetState = useCallback(() => {
    dispatch({ type: ActionType.RESET_STATE });
  }, []);

  const loadData = useCallback(() => {
    const tasks = loadTasks();
    dispatch({ type: ActionType.LOAD_TASKS, payload: { tasks } });
  }, []);

  // Compute filtered tasks
  const filteredTasks = React.useMemo(() => {
    let tasks = [...state.tasks];
    
    // Apply filtering
    tasks = filterTasks(tasks, state.filter);
    
    // Apply search
    tasks = searchTasks(tasks, state.searchQuery);
    
    // Apply sorting
    tasks = sortTasks(tasks, state.sortBy);
    
    return tasks;
  }, [state.tasks, state.filter, state.searchQuery, state.sortBy]);

  const contextValue: TaskContextValue = {
    state,
    filteredTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    reorderTasks,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    toggleSubtask,
    setFilter,
    setSortBy,
    setSearchQuery,
    selectTask,
    deselectTask,
    selectAllTasks,
    clearSelection,
    toggleTaskSelection,
    bulkToggleTasks,
    bulkDeleteTasks,
    getTask,
    isTaskSelected,
    getSelectedTaskIds,
    getSelectedTasks,
    resetState,
    loadData,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTaskContext = (): TaskContextValue => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

// Convenience hooks for specific functionality
export const useTasks = () => {
  const { filteredTasks, state } = useTaskContext();
  return { tasks: filteredTasks, allTasks: state.tasks };
};

export const useTaskActions = () => {
  const {
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    reorderTasks,
  } = useTaskContext();
  
  return {
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    reorderTasks,
  };
};

export const useSubtaskActions = () => {
  const {
    createSubtask,
    updateSubtask,
    deleteSubtask,
    toggleSubtask,
  } = useTaskContext();
  
  return {
    createSubtask,
    updateSubtask,
    deleteSubtask,
    toggleSubtask,
  };
};

export const useTaskSelection = () => {
  const {
    state,
    selectTask,
    deselectTask,
    selectAllTasks,
    clearSelection,
    toggleTaskSelection,
    isTaskSelected,
    getSelectedTaskIds,
    getSelectedTasks,
    bulkToggleTasks,
    bulkDeleteTasks,
  } = useTaskContext();
  
  return {
    selectedTaskIds: state.selectedTaskIds,
    selectTask,
    deselectTask,
    selectAllTasks,
    clearSelection,
    toggleTaskSelection,
    isTaskSelected,
    getSelectedTaskIds,
    getSelectedTasks,
    bulkToggleTasks,
    bulkDeleteTasks,
  };
};

export const useTaskFilters = () => {
  const {
    state,
    setFilter,
    setSortBy,
    setSearchQuery,
  } = useTaskContext();
  
  return {
    filter: state.filter,
    sortBy: state.sortBy,
    searchQuery: state.searchQuery,
    setFilter,
    setSortBy,
    setSearchQuery,
  };
};