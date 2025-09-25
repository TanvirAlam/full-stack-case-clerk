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

  addTask(title: string, description?: string, priority: Task['priority'] = TASK_PRIORITIES.MEDIUM): void {
    if (!title || typeof title !== 'string' || isEffectivelyEmpty(title)) return;

    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      description: description?.trim() || undefined,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };

    this.tasks = [newTask, ...this.tasks];
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
}