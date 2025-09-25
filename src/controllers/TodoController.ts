import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Task, TaskFilter } from '../types/types';
import { TodoModel } from '../models/TodoModel';
import { TASK_PRIORITIES, TASK_FILTERS } from '../utils/const';

export class TodoController {
  private model: TodoModel;

  constructor(model: TodoModel) {
    this.model = model;
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
    
    // Only reset form if task was actually added
    if (this.model.getTasks().length > initialTaskCount) {
      formData.resetForm();
    }
  };

  handleToggleTask = (id: string) => {
    this.model.toggleTask(id);
  };

  handleDeleteTask = (id: string) => {
    this.model.deleteTask(id);
  };

  handleUpdateTask = (id: string, updates: Partial<Pick<Task, 'title' | 'subtitle' | 'description' | 'priority'>>) => {
    this.model.updateTask(id, updates);
  };

  // Computed values
  getFilteredTasks(filter: TaskFilter, searchQuery: string) {
    return this.model.getFilteredTasks(filter, searchQuery);
  }
}

// Custom hook that uses the controller
export const useTodoController = (model: TodoModel) => {
  const controller = useMemo(() => new TodoController(model), [model]);
  
  const formState = controller.createFormState();
  const filterState = controller.createFilterState();
  const modelState = controller.createModelState();

  const filteredTasks = useMemo(() => 
    controller.getFilteredTasks(filterState.filter, filterState.searchQuery),
    [controller, filterState.filter, filterState.searchQuery, modelState.tasks]
  );

  return {
    // State
    ...formState,
    ...filterState,
    ...modelState,
    filteredTasks,
    
    // Actions
    handleAddTask: (e: React.FormEvent) => 
      controller.handleAddTask(e, formState),
    handleToggleTask: controller.handleToggleTask,
    handleDeleteTask: controller.handleDeleteTask,
    handleUpdateTask: controller.handleUpdateTask,
  };
};