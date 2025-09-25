import type { Task, TaskFilter, TaskStats } from '../types/types';
import {
  generateId,
  loadTasksFromStorage,
  saveTasksToStorage,
  filterTasksByStatus,
  filterTasksBySearch,
  sortTasks,
  calculateTaskStats,
  isEffectivelyEmpty,
} from '../utils/utils';
import { TASK_PRIORITIES } from '../utils/const';

export class TodoModel {
  private tasks: Task[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadTasks();
  }

  // Observer pattern for state changes
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  // Task management
  getTasks(): Task[] {
    return [...this.tasks];
  }

  addTask(title: string, subtitle?: string, description?: string, priority: Task['priority'] = TASK_PRIORITIES.MEDIUM): void {
    if (!title || typeof title !== 'string' || isEffectivelyEmpty(title)) return;

    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      subtitle: subtitle?.trim() || undefined,
      description: description?.trim() || undefined,
      completed: false,
      priority,
      subtasks: [],
      createdAt: new Date().toISOString(),
    };

    this.tasks = [newTask, ...this.tasks];
    this.saveTasks();
    this.notify();
  }

  updateTask(id: string, updates: Partial<Pick<Task, 'title' | 'subtitle' | 'description' | 'priority'>>): void {
    const taskExists = this.tasks.some(task => task.id === id);
    if (!taskExists) return;

    // Validate title if it's being updated
    if (updates.title !== undefined) {
      if (!updates.title || typeof updates.title !== 'string' || isEffectivelyEmpty(updates.title)) {
        return;
      }
      updates.title = updates.title.trim();
    }

    // Clean subtitle and description
    if (updates.subtitle !== undefined) {
      updates.subtitle = updates.subtitle?.trim() || undefined;
    }
    if (updates.description !== undefined) {
      updates.description = updates.description?.trim() || undefined;
    }

    this.tasks = this.tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    this.saveTasks();
    this.notify();
  }

  toggleTask(id: string): void {
    const taskExists = this.tasks.some(task => task.id === id);
    if (!taskExists) return;
    
    this.tasks = this.tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.saveTasks();
    this.notify();
  }

  deleteTask(id: string): void {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    
    // Only notify if a task was actually deleted
    if (this.tasks.length !== initialLength) {
      this.saveTasks();
      this.notify();
    }
  }

  // Data filtering and processing
  getFilteredTasks(filter: TaskFilter, searchQuery: string): Task[] {
    let filteredTasks = filterTasksByStatus(this.tasks, filter);
    filteredTasks = filterTasksBySearch(filteredTasks, searchQuery);
    return sortTasks([...filteredTasks]);
  }

  getTaskStats(): TaskStats {
    return calculateTaskStats(this.tasks);
  }

  // Persistence
  private loadTasks(): void {
    this.tasks = loadTasksFromStorage();
  }

  private saveTasks(): void {
    saveTasksToStorage(this.tasks);
  }

  // Utility methods
  isEmpty(): boolean {
    return this.tasks.length === 0;
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  reorderTasks(startIndex: number, endIndex: number): void {
    if (startIndex === endIndex || startIndex < 0 || endIndex < 0 || 
        startIndex >= this.tasks.length || endIndex >= this.tasks.length) {
      return;
    }

    const newTasks = [...this.tasks];
    const [removed] = newTasks.splice(startIndex, 1);
    newTasks.splice(endIndex, 0, removed);
    
    this.tasks = newTasks;
    this.saveTasks();
    this.notify();
  }

  // Subtask management
  addSubtask(taskId: string, subtaskTitle: string): void {
    if (!subtaskTitle || typeof subtaskTitle !== 'string' || isEffectivelyEmpty(subtaskTitle)) return;

    const taskExists = this.tasks.some(task => task.id === taskId);
    if (!taskExists) return;

    const newSubtask = {
      id: generateId(),
      title: subtaskTitle.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.tasks = this.tasks.map(task => 
      task.id === taskId 
        ? { ...task, subtasks: [...task.subtasks, newSubtask] }
        : task
    );

    this.saveTasks();
    this.notify();
  }

  toggleSubtask(taskId: string, subtaskId: string): void {
    const taskExists = this.tasks.some(task => task.id === taskId);
    if (!taskExists) return;

    this.tasks = this.tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(subtask =>
          subtask.id === subtaskId 
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        );
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    });

    this.saveTasks();
    this.notify();
  }

  deleteSubtask(taskId: string, subtaskId: string): void {
    const taskExists = this.tasks.some(task => task.id === taskId);
    if (!taskExists) return;

    this.tasks = this.tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId);
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    });

    this.saveTasks();
    this.notify();
  }

  updateSubtask(taskId: string, subtaskId: string, title: string): void {
    if (!title || typeof title !== 'string' || isEffectivelyEmpty(title)) return;

    const taskExists = this.tasks.some(task => task.id === taskId);
    if (!taskExists) return;

    this.tasks = this.tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(subtask =>
          subtask.id === subtaskId 
            ? { ...subtask, title: title.trim() }
            : subtask
        );
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    });

    this.saveTasks();
    this.notify();
  }
}
