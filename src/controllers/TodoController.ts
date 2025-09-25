import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Task, TaskFilter } from '../types/types';
import { TodoModel } from '../models/TodoModel';
import { TASK_PRIORITIES, TASK_FILTERS } from '../utils/const';
import { useToast } from '../contexts/ToastContext';
import { useUndo } from '../contexts/UndoContext';
import { useFormKeyboard, useKeyboard } from '../hooks/useKeyboard';

export class TodoController {
  private model: TodoModel;
  private showToast?: (toast: any) => void;
  private executeWithUndo?: (action: () => void, undoAction: any, message: string) => void;

  constructor(model: TodoModel, showToast?: (toast: any) => void, executeWithUndo?: (action: () => void, undoAction: any, message: string) => void) {
    this.model = model;
    this.showToast = showToast;
    this.executeWithUndo = executeWithUndo;
  }

  // Form state management
  createFormState() {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(TASK_PRIORITIES.MEDIUM);

    const resetForm = useCallback(() => {
      setTitle('');
      setSubtitle('');
      setDescription('');
      setPriority(TASK_PRIORITIES.MEDIUM);
    }, []);

    return {
      title,
      setTitle,
      subtitle,
      setSubtitle,
      description,
      setDescription,
      priority,
      setPriority,
      resetForm,
    };
  }

  // Filter state management
  createFilterState() {
    const [filter, setFilter] = useState<TaskFilter>(TASK_FILTERS.ALL);
    const [searchQuery, setSearchQuery] = useState('');

    return {
      filter,
      setFilter,
      searchQuery,
      setSearchQuery,
    };
  }

  // Bulk selection state management
  createBulkSelectionState() {
    const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const toggleSelection = useCallback((taskId: string) => {
      setSelectedTaskIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(taskId)) {
          newSet.delete(taskId);
        } else {
          newSet.add(taskId);
        }
        return newSet;
      });
    }, []);

    const selectAll = useCallback((taskIds: string[]) => {
      setSelectedTaskIds(new Set(taskIds));
    }, []);

    const clearSelection = useCallback(() => {
      setSelectedTaskIds(new Set());
    }, []);

    const toggleSelectionMode = useCallback(() => {
      setIsSelectionMode(prev => {
        if (prev) {
          // Exiting selection mode, clear all selections
          setSelectedTaskIds(new Set());
        }
        return !prev;
      });
    }, []);

    return {
      selectedTaskIds,
      isSelectionMode,
      toggleSelection,
      selectAll,
      clearSelection,
      toggleSelectionMode,
      selectedCount: selectedTaskIds.size,
    };
  }

  // Model state subscription
  createModelState() {
    const [, forceUpdate] = useState({});
    
    useEffect(() => {
      const unsubscribe = this.model.subscribe(() => {
        forceUpdate({});
      });
      return unsubscribe;
    }, []);

    return {
      tasks: this.model.getTasks(),
      taskStats: this.model.getTaskStats(),
      isEmpty: this.model.isEmpty(),
    };
  }

  // Actions
  handleAddTask = (e: React.FormEvent, formData: {
    title: string;
    subtitle: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    resetForm: () => void;
  }) => {
    e.preventDefault();
    const initialTaskCount = this.model.getTasks().length;
    this.model.addTask(formData.title, formData.subtitle, formData.description, formData.priority);
    
    // Only reset form and show toast if task was actually added
    if (this.model.getTasks().length > initialTaskCount) {
      formData.resetForm();
      
      this.showToast?.({
        type: 'success',
        message: 'Task created successfully!',
        duration: 3000,
      });
    }
  };

  handleToggleTask = (id: string) => {
    const task = this.model.getTaskById(id);
    if (!task) return;
    
    const wasCompleted = task.completed;
    const taskCopy = { ...task };
    
    if (this.executeWithUndo) {
      this.executeWithUndo(
        () => this.model.toggleTask(id),
        {
          type: wasCompleted ? 'COMPLETE_TASK' : 'UNCOMPLETE_TASK',
          data: taskCopy,
          undo: () => this.model.toggleTask(id),
        },
        `Task ${wasCompleted ? 'restored' : 'completed'}`
      );
    } else {
      this.model.toggleTask(id);
      this.showToast?.({
        type: 'success',
        message: `Task ${wasCompleted ? 'restored' : 'completed'}!`,
        duration: 2000,
      });
    }
  };

  handleDeleteTask = (id: string) => {
    const task = this.model.getTaskById(id);
    if (!task) return;
    
    const taskCopy = { ...task };
    
    if (this.executeWithUndo) {
      this.executeWithUndo(
        () => this.model.deleteTask(id),
        {
          type: 'DELETE_TASK',
          data: taskCopy,
          undo: () => {
            // Re-add the task with all its properties
            this.model.addTask(taskCopy.title, taskCopy.subtitle, taskCopy.description, taskCopy.priority);
            const newTasks = this.model.getTasks();
            const newTask = newTasks[0]; // Most recent task
            
            // Update the new task with original properties
            this.model.updateTask(newTask.id, {
              title: taskCopy.title,
              subtitle: taskCopy.subtitle,
              description: taskCopy.description,
              priority: taskCopy.priority,
            });
            
            if (taskCopy.completed) {
              this.model.toggleTask(newTask.id);
            }
          },
        },
        'Task deleted'
      );
    } else {
      this.model.deleteTask(id);
      this.showToast?.({
        type: 'success',
        message: 'Task deleted!',
        duration: 2000,
      });
    }
  };

  handleUpdateTask = (id: string, updates: Partial<Pick<Task, 'title' | 'subtitle' | 'description' | 'priority'>>) => {
    this.model.updateTask(id, updates);
  };

  handleAddSubtask = (taskId: string, subtaskTitle: string) => {
    this.model.addSubtask(taskId, subtaskTitle);
  };

  handleToggleSubtask = (taskId: string, subtaskId: string) => {
    this.model.toggleSubtask(taskId, subtaskId);
  };

  handleDeleteSubtask = (taskId: string, subtaskId: string) => {
    this.model.deleteSubtask(taskId, subtaskId);
  };

  handleUpdateSubtask = (taskId: string, subtaskId: string, title: string) => {
    this.model.updateSubtask(taskId, subtaskId, title);
  };

  // Bulk actions
  handleBulkComplete = (taskIds: string[]) => {
    const tasks = taskIds.map(id => this.model.getTaskById(id)).filter(Boolean);
    const incompleteTasks = tasks.filter(task => !task?.completed);
    
    if (incompleteTasks.length === 0) return;
    
    if (this.executeWithUndo) {
      this.executeWithUndo(
        () => {
          incompleteTasks.forEach(task => {
            if (task) this.model.toggleTask(task.id);
          });
        },
        {
          type: 'BULK_COMPLETE',
          data: incompleteTasks,
          undo: () => {
            incompleteTasks.forEach(task => {
              if (task) this.model.toggleTask(task.id);
            });
          },
        },
        `${incompleteTasks.length} task${incompleteTasks.length !== 1 ? 's' : ''} completed`
      );
    } else {
      incompleteTasks.forEach(task => {
        if (task) this.model.toggleTask(task.id);
      });
      this.showToast?.({
        type: 'success',
        message: `${incompleteTasks.length} task${incompleteTasks.length !== 1 ? 's' : ''} completed!`,
        duration: 2000,
      });
    }
  };

  handleBulkDelete = (taskIds: string[]) => {
    const tasks = taskIds.map(id => this.model.getTaskById(id)).filter(Boolean);
    
    if (tasks.length === 0) return;
    
    if (this.executeWithUndo) {
      this.executeWithUndo(
        () => {
          taskIds.forEach(id => this.model.deleteTask(id));
        },
        {
          type: 'BULK_DELETE',
          data: tasks,
          undo: () => {
            tasks.forEach(task => {
              if (task) {
                this.model.addTask(task.title, task.subtitle, task.description, task.priority);
                const newTasks = this.model.getTasks();
                const newTask = newTasks[0];
                
                this.model.updateTask(newTask.id, {
                  title: task.title,
                  subtitle: task.subtitle,
                  description: task.description,
                  priority: task.priority,
                });
                
                if (task.completed) {
                  this.model.toggleTask(newTask.id);
                }
              }
            });
          },
        },
        `${tasks.length} task${tasks.length !== 1 ? 's' : ''} deleted`
      );
    } else {
      taskIds.forEach(id => this.model.deleteTask(id));
      this.showToast?.({
        type: 'success',
        message: `${tasks.length} task${tasks.length !== 1 ? 's' : ''} deleted!`,
        duration: 2000,
      });
    }
  };

  // Drag and drop reordering
  handleReorderTasks = (startIndex: number, endIndex: number) => {
    this.model.reorderTasks(startIndex, endIndex);
    this.showToast?.({
      type: 'success',
      message: 'Tasks reordered!',
      duration: 1500,
    });
  };

  // Computed values
  getFilteredTasks(filter: TaskFilter, searchQuery: string) {
    return this.model.getFilteredTasks(filter, searchQuery);
  }
}

// Custom hook that uses the controller
export const useTodoController = (model: TodoModel) => {
  const { showToast } = useToast();
  const { executeWithUndo } = useUndo();
  
  const controller = useMemo(() => new TodoController(model, showToast, executeWithUndo), [model, showToast, executeWithUndo]);
  
  const formState = controller.createFormState();
  const filterState = controller.createFilterState();
  const bulkSelectionState = controller.createBulkSelectionState();
  const modelState = controller.createModelState();
  
  // Add keyboard support for form submission
  useFormKeyboard(
    () => {
      if (formState.title.trim()) {
        const mockEvent = { preventDefault: () => {} } as React.FormEvent;
        controller.handleAddTask(mockEvent, formState);
      }
    },
    () => {
      // Clear form on Escape
      formState.resetForm();
    },
    true
  );
  
  // Add global keyboard shortcuts
  useKeyboard({
    'ctrl+n': (e) => {
      e.preventDefault();
      // Focus on the title input
      const titleInput = document.querySelector('input[placeholder*="What needs to be done"]') as HTMLInputElement;
      titleInput?.focus();
    },
    'ctrl+f': (e) => {
      e.preventDefault();
      // Focus on search input if it exists
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      searchInput?.focus();
    },
  }, []);

  const filteredTasks = useMemo(() => 
    controller.getFilteredTasks(filterState.filter, filterState.searchQuery),
    [controller, filterState.filter, filterState.searchQuery, modelState.tasks]
  );

  return {
    // State
    ...formState,
    ...filterState,
    ...bulkSelectionState,
    ...modelState,
    filteredTasks,
    
    // Actions
    handleAddTask: (e: React.FormEvent) => 
      controller.handleAddTask(e, formState),
    handleToggleTask: controller.handleToggleTask,
    handleDeleteTask: controller.handleDeleteTask,
    handleUpdateTask: controller.handleUpdateTask,
    
    // Subtask Actions
    handleAddSubtask: controller.handleAddSubtask,
    handleToggleSubtask: controller.handleToggleSubtask,
    handleDeleteSubtask: controller.handleDeleteSubtask,
    handleUpdateSubtask: controller.handleUpdateSubtask,
    
    // Bulk Actions
    handleBulkComplete: controller.handleBulkComplete,
    handleBulkDelete: controller.handleBulkDelete,
    
    // Drag and Drop
    handleReorderTasks: controller.handleReorderTasks,
  };
};