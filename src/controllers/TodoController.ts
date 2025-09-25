import { useState, useEffect, useMemo, useCallback } from 'react';
import type { TaskFilter } from '../types/types';
import { TodoModel } from '../models/TodoModel';

export class TodoController {
  private model: TodoModel;

  constructor(model: TodoModel) {
    this.model = model;
  }

  // Form state management
  createFormState() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

    const resetForm = useCallback(() => {
      setTitle('');
      setDescription('');
      setPriority('medium');
    }, []);

    return {
      title,
      setTitle,
      description,
      setDescription,
      priority,
      setPriority,
      resetForm,
    };
  }

  // Filter state management
  createFilterState() {
    const [filter, setFilter] = useState<TaskFilter>('all');
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
    description: string;
    priority: 'low' | 'medium' | 'high';
    resetForm: () => void;
  }) => {
    e.preventDefault();
    this.model.addTask(formData.title, formData.description, formData.priority);
    formData.resetForm();
  };

  handleToggleTask = (id: string) => {
    this.model.toggleTask(id);
  };

  handleDeleteTask = (id: string) => {
    this.model.deleteTask(id);
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
  };
};