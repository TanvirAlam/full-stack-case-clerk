import { useState, useEffect, useMemo } from 'react';
import { Task, TaskFilter } from '../types';
import { 
  generateId, 
  saveToStorage, 
  loadFromStorage, 
  filterTasks, 
  searchTasks, 
  sortTasks 
} from '../utils';

export const useTodos = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = loadFromStorage();
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    saveToStorage(tasks);
  }, [tasks]);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    result = filterTasks(result, filter);
    result = searchTasks(result, searchQuery);
    result = sortTasks(result);
    return result;
  }, [tasks, filter, searchQuery]);

  // Task operations
  const addTask = (title: string, subtitle?: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      subtitle: subtitle?.trim() || undefined,
      priority,
      completed: false,
      createdAt: new Date(),
    };

    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Task statistics
  const taskStats = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks]);

  return {
    // Data
    tasks: filteredTasks,
    allTasks: tasks,
    filter,
    searchQuery,
    taskStats,

    // Actions
    addTask,
    toggleTask,
    deleteTask,
    setFilter,
    setSearchQuery,
  };
};