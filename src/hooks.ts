import { useState, useEffect, useMemo } from 'react';
import type { Task, TaskFilter } from './types';
import {
  generateId,
  loadTasksFromStorage,
  saveTasksToStorage,
  filterTasksByStatus,
  filterTasksBySearch,
  sortTasks,
  calculateTaskStats,
} from './utils';

export const useTodos = () => {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = loadTasksFromStorage();
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage when tasks change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Task operations
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };

    setTasks(prevTasks => [newTask, ...prevTasks]);
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  const toggleTask = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  // Computed values
  const filteredAndSearchedTasks = useMemo(() => {
    let filteredTasks = filterTasksByStatus(tasks, filter);
    filteredTasks = filterTasksBySearch(filteredTasks, searchQuery);
    return sortTasks([...filteredTasks]);
  }, [tasks, filter, searchQuery]);

  const taskStats = useMemo(() => calculateTaskStats(tasks), [tasks]);

  return {
    // State
    tasks,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    
    // Actions
    addTask,
    toggleTask,
    deleteTask,
    
    // Computed
    filteredAndSearchedTasks,
    taskStats,
  };
};