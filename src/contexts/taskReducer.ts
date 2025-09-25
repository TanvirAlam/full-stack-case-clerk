import { 
  AppState, 
  AppAction, 
  ActionType, 
  Task, 
  Subtask,
  TaskFilter,
  SortBy,
  Priority,
  CreateTaskPayload,
  CreateSubtaskPayload,
  UpdateTaskPayload,
  UpdateSubtaskPayload
} from '../types';
import { generateId } from '../utils';

/**
 * Create a new task from payload
 */
const createTask = (payload: CreateTaskPayload): Task => {
  const now = new Date();
  return {
    id: generateId(),
    title: payload.title.trim(),
    subtitle: payload.subtitle?.trim(),
    notes: payload.notes?.trim(),
    priority: payload.priority,
    completed: false,
    subtasks: [],
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Create a new subtask from payload
 */
const createSubtask = (payload: CreateSubtaskPayload): Subtask => {
  const now = new Date();
  return {
    id: generateId(),
    title: payload.title.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Update task and set updatedAt timestamp
 */
const updateTask = (task: Task, updates: UpdateTaskPayload): Task => {
  return {
    ...task,
    ...updates,
    updatedAt: new Date(),
  };
};

/**
 * Update subtask and set updatedAt timestamp
 */
const updateSubtask = (subtask: Subtask, updates: UpdateSubtaskPayload): Subtask => {
  return {
    ...subtask,
    ...updates,
    updatedAt: new Date(),
  };
};

/**
 * Main task reducer
 */
export const taskReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // Task CRUD operations
    case ActionType.CREATE_TASK: {
      const newTask = createTask(action.payload);
      return {
        ...state,
        tasks: [newTask, ...state.tasks],
      };
    }

    case ActionType.UPDATE_TASK: {
      const { id, updates } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === id ? updateTask(task, updates) : task
        ),
      };
    }

    case ActionType.DELETE_TASK: {
      const { id } = action.payload;
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== id),
        selectedTaskIds: new Set(
          Array.from(state.selectedTaskIds).filter(taskId => taskId !== id)
        ),
      };
    }

    case ActionType.TOGGLE_TASK: {
      const { id } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === id 
            ? updateTask(task, { completed: !task.completed })
            : task
        ),
      };
    }

    case ActionType.REORDER_TASKS: {
      const { taskIds } = action.payload;
      const taskMap = new Map(state.tasks.map(task => [task.id, task]));
      const reorderedTasks = taskIds
        .map(id => taskMap.get(id))
        .filter((task): task is Task => task !== undefined);
      
      return {
        ...state,
        tasks: reorderedTasks,
      };
    }

    // Subtask CRUD operations
    case ActionType.CREATE_SUBTASK: {
      const { taskId, subtask } = action.payload;
      const newSubtask = createSubtask(subtask);
      
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === taskId
            ? updateTask(task, { 
                subtasks: [...task.subtasks, newSubtask] 
              })
            : task
        ),
      };
    }

    case ActionType.UPDATE_SUBTASK: {
      const { taskId, subtaskId, updates } = action.payload;
      
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === taskId
            ? updateTask(task, {
                subtasks: task.subtasks.map(subtask =>
                  subtask.id === subtaskId
                    ? updateSubtask(subtask, updates)
                    : subtask
                )
              })
            : task
        ),
      };
    }

    case ActionType.DELETE_SUBTASK: {
      const { taskId, subtaskId } = action.payload;
      
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === taskId
            ? updateTask(task, {
                subtasks: task.subtasks.filter(subtask => 
                  subtask.id !== subtaskId
                )
              })
            : task
        ),
      };
    }

    case ActionType.TOGGLE_SUBTASK: {
      const { taskId, subtaskId } = action.payload;
      
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === taskId
            ? updateTask(task, {
                subtasks: task.subtasks.map(subtask =>
                  subtask.id === subtaskId
                    ? updateSubtask(subtask, { completed: !subtask.completed })
                    : subtask
                )
              })
            : task
        ),
      };
    }

    // UI state operations
    case ActionType.SET_FILTER: {
      const { filter } = action.payload;
      return {
        ...state,
        filter,
        selectedTaskIds: new Set(), // Clear selection when filter changes
      };
    }

    case ActionType.SET_SORT_BY: {
      const { sortBy } = action.payload;
      return {
        ...state,
        sortBy,
      };
    }

    case ActionType.SET_SEARCH_QUERY: {
      const { query } = action.payload;
      return {
        ...state,
        searchQuery: query,
        selectedTaskIds: new Set(), // Clear selection when search changes
      };
    }

    // Selection operations
    case ActionType.SELECT_TASK: {
      const { id } = action.payload;
      const newSelectedIds = new Set(state.selectedTaskIds);
      newSelectedIds.add(id);
      
      return {
        ...state,
        selectedTaskIds: newSelectedIds,
      };
    }

    case ActionType.DESELECT_TASK: {
      const { id } = action.payload;
      const newSelectedIds = new Set(state.selectedTaskIds);
      newSelectedIds.delete(id);
      
      return {
        ...state,
        selectedTaskIds: newSelectedIds,
      };
    }

    case ActionType.SELECT_ALL_TASKS: {
      const visibleTaskIds = new Set(state.tasks.map(task => task.id));
      
      return {
        ...state,
        selectedTaskIds: visibleTaskIds,
      };
    }

    case ActionType.CLEAR_SELECTION: {
      return {
        ...state,
        selectedTaskIds: new Set(),
      };
    }

    // Bulk operations
    case ActionType.BULK_TOGGLE_TASKS: {
      const { taskIds, completed } = action.payload;
      const taskIdSet = new Set(taskIds);
      
      return {
        ...state,
        tasks: state.tasks.map(task =>
          taskIdSet.has(task.id)
            ? updateTask(task, { completed })
            : task
        ),
        selectedTaskIds: new Set(), // Clear selection after bulk action
      };
    }

    case ActionType.BULK_DELETE_TASKS: {
      const { taskIds } = action.payload;
      const taskIdSet = new Set(taskIds);
      
      return {
        ...state,
        tasks: state.tasks.filter(task => !taskIdSet.has(task.id)),
        selectedTaskIds: new Set(), // Clear selection after bulk action
      };
    }

    // Data management operations
    case ActionType.LOAD_TASKS: {
      const { tasks } = action.payload;
      return {
        ...state,
        tasks,
      };
    }

    case ActionType.RESET_STATE: {
      return {
        tasks: [],
        filter: TaskFilter.ALL,
        sortBy: SortBy.UPDATED,
        searchQuery: '',
        selectedTaskIds: new Set(),
      };
    }

    default:
      return state;
  }
};

/**
 * Create initial state
 */
export const createInitialState = (tasks: Task[] = []): AppState => ({
  tasks,
  filter: TaskFilter.ALL,
  sortBy: SortBy.UPDATED,
  searchQuery: '',
  selectedTaskIds: new Set(),
});