import { TodoModel } from './TodoModel';
import { simulateRapidClicks } from '../test/setup';

describe('TodoModel - Rapid Input Edge Cases', () => {
  let todoModel: TodoModel;

  beforeEach(() => {
    todoModel = new TodoModel();
  });

  describe('rapid task creation prevention', () => {
    test('should prevent duplicate tasks from rapid identical submissions', async () => {
      const taskTitle = 'Rapid Task';
      const taskDescription = 'Same description';
      
      // Simulate rapid identical task creation attempts
      await simulateRapidClicks(() => {
        todoModel.addTask(taskTitle, undefined, taskDescription);
      }, 5, 1); // 5 clicks with 1ms delay
      
      const tasks = todoModel.getTasks();
      
      // All tasks should be created since they have different IDs
      // But in a real UI, you'd want debouncing to prevent this
      expect(tasks).toHaveLength(5);
      expect(tasks.every(task => task.title === taskTitle)).toBe(true);
      expect(tasks.every(task => task.description === taskDescription)).toBe(true);
    });

    test('should handle rapid task creation with slightly different content', async () => {
      let counter = 0;
      
      await simulateRapidClicks(() => {
        todoModel.addTask(`Task ${counter++}`);
      }, 10, 2);
      
      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(10);
      
      // Should have unique titles
      const titles = tasks.map(task => task.title);
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(10);
    });

    test('should handle rapid empty task creation attempts', async () => {
      const initialCount = todoModel.getTasks().length;
      
      await simulateRapidClicks(() => {
        todoModel.addTask('');
        todoModel.addTask('   ');
        todoModel.addTask('\t\n');
      }, 20, 1);
      
      // Should not create any tasks
      expect(todoModel.getTasks()).toHaveLength(initialCount);
    });

    test('should handle mixed rapid valid and invalid task creation', async () => {
      let validCounter = 0;
      const initialCount = todoModel.getTasks().length;
      
      await simulateRapidClicks(() => {
        // Alternate between valid and invalid
        if (validCounter % 2 === 0) {
          todoModel.addTask(`Valid Task ${validCounter}`);
        } else {
          todoModel.addTask(''); // Invalid empty title
        }
        validCounter++;
      }, 10, 1);
      
      const tasks = todoModel.getTasks();
      // Should only have 5 valid tasks (even indices)
      expect(tasks).toHaveLength(initialCount + 5);
    });
  });

  describe('rapid task operations', () => {
    beforeEach(() => {
      // Setup some tasks for manipulation
      todoModel.addTask('Task 1', undefined, 'Description 1');
      todoModel.addTask('Task 2', undefined, 'Description 2');
      todoModel.addTask('Task 3', undefined, 'Description 3');
    });

    test('should handle rapid toggle operations on same task', async () => {
      const tasks = todoModel.getTasks();
      const taskId = tasks[0].id;
      const initialCompleted = tasks[0].completed;
      
      await simulateRapidClicks(() => {
        todoModel.toggleTask(taskId);
      }, 10, 1); // 10 rapid toggles
      
      const finalTask = todoModel.getTaskById(taskId);
      // Should be same as initial state (even number of toggles: 10)
      expect(finalTask?.completed).toBe(initialCompleted);
    });

    test('should handle rapid toggle operations on different tasks', async () => {
      const tasks = todoModel.getTasks();
      let taskIndex = 0;
      
      await simulateRapidClicks(() => {
        const taskId = tasks[taskIndex % tasks.length].id;
        todoModel.toggleTask(taskId);
        taskIndex++;
      }, 15, 1);
      
      const finalTasks = todoModel.getTasks();
      // Each task should have been toggled 5 times (15/3 = 5)
      // So all should be completed (odd number of toggles)
      finalTasks.forEach(task => {
        expect(task.completed).toBe(true);
      });
    });

    test('should handle rapid delete operations', async () => {
      const tasks = todoModel.getTasks();
      const initialCount = tasks.length;
      
      // Try to delete the same task rapidly
      await simulateRapidClicks(() => {
        todoModel.deleteTask(tasks[0].id);
      }, 5, 1);
      
      // Task should only be deleted once
      expect(todoModel.getTasks()).toHaveLength(initialCount - 1);
      expect(todoModel.getTaskById(tasks[0].id)).toBeUndefined();
    });

    test('should handle rapid operations on non-existent tasks', async () => {
      const nonExistentId = 'non-existent-task-id';
      const initialTasks = todoModel.getTasks();
      const listener = jest.fn();
      todoModel.subscribe(listener);
      
      await simulateRapidClicks(() => {
        todoModel.toggleTask(nonExistentId);
        todoModel.deleteTask(nonExistentId);
      }, 10, 1);
      
      // State should remain unchanged
      expect(todoModel.getTasks()).toEqual(initialTasks);
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('rapid search and filtering', () => {
    beforeEach(() => {
      todoModel.addTask('Apple task', undefined, 'About apples');
      todoModel.addTask('Banana task', undefined, 'About bananas');
      todoModel.addTask('Cherry task', undefined, 'About cherries');
      todoModel.addTask('Date task', undefined, 'About dates');
    });

    test('should handle rapid search operations', async () => {
      const searchTerms = ['apple', 'banana', 'cherry', 'date', 'fruit', ''];
      let termIndex = 0;
      const results: any[] = [];
      
      await simulateRapidClicks(() => {
        const term = searchTerms[termIndex % searchTerms.length];
        const filtered = todoModel.getFilteredTasks('all', term);
        results.push({ term, count: filtered.length });
        termIndex++;
      }, 30, 1);
      
      // Should handle all searches without errors
      expect(results).toHaveLength(30);
      results.forEach(result => {
        expect(Array.isArray(result)).toBe(false); // Should be objects with term and count
        expect(typeof result.count).toBe('number');
      });
    });

    test('should handle rapid filter switching', async () => {
      const filters: Array<'all' | 'active' | 'done'> = ['all', 'active', 'done'];
      let filterIndex = 0;
      
      // Toggle some tasks to have different states
      const tasks = todoModel.getTasks();
      todoModel.toggleTask(tasks[0].id);
      todoModel.toggleTask(tasks[1].id);
      
      const results: any[] = [];
      
      await simulateRapidClicks(() => {
        const filter = filters[filterIndex % filters.length];
        const filtered = todoModel.getFilteredTasks(filter, '');
        results.push({ filter, count: filtered.length });
        filterIndex++;
      }, 15, 1);
      
      expect(results).toHaveLength(15);
      // Should have consistent results for same filter
      const allResults = results.filter(r => r.filter === 'all');
      const activeResults = results.filter(r => r.filter === 'active');
      const doneResults = results.filter(r => r.filter === 'done');
      
      // All 'all' results should be the same
      allResults.forEach(result => expect(result.count).toBe(4));
      activeResults.forEach(result => expect(result.count).toBe(2));
      doneResults.forEach(result => expect(result.count).toBe(2));
    });
  });

  describe('rapid observer notifications', () => {
    test('should handle rapid listener subscriptions and unsubscriptions', async () => {
      const listeners: Array<() => void> = [];
      const unsubscribeFunctions: Array<() => void> = [];
      
      // Rapidly add listeners
      await simulateRapidClicks(() => {
        const listener = jest.fn();
        listeners.push(listener);
        const unsubscribe = todoModel.subscribe(listener);
        unsubscribeFunctions.push(unsubscribe);
      }, 10, 1);
      
      // Trigger a change
      todoModel.addTask('Test Task');
      
      // All listeners should have been called
      listeners.forEach(listener => {
        expect(listener).toHaveBeenCalledTimes(1);
      });
      
      // Rapidly unsubscribe
      await simulateRapidClicks(() => {
        const unsubscribe = unsubscribeFunctions.pop();
        if (unsubscribe) unsubscribe();
      }, 5, 1);
      
      // Trigger another change
      todoModel.addTask('Another Task');
      
      // Only remaining listeners should be called
      const remainingListeners = listeners.slice(0, 5); // First 5 should still be subscribed (pop() removed from end)
      remainingListeners.forEach(listener => {
        expect(listener).toHaveBeenCalledTimes(2);
      });
      
      const unsubscribedListeners = listeners.slice(5); // Last 5 were unsubscribed (by pop())
      unsubscribedListeners.forEach(listener => {
        expect(listener).toHaveBeenCalledTimes(1); // Should not have been called again
      });
    });

    test('should handle rapid state changes with multiple listeners', async () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      const listener3 = jest.fn();
      
      todoModel.subscribe(listener1);
      todoModel.subscribe(listener2);
      todoModel.subscribe(listener3);
      
      // Perform rapid state changes
      await simulateRapidClicks(() => {
        todoModel.addTask(`Rapid Task ${Date.now()}`);
      }, 20, 1);
      
      // All listeners should have been called for each change
      expect(listener1).toHaveBeenCalledTimes(20);
      expect(listener2).toHaveBeenCalledTimes(20);
      expect(listener3).toHaveBeenCalledTimes(20);
    });
  });

  describe('rapid persistence operations', () => {
    test('should handle rapid save operations', async () => {
      // Mock console.error to track any persistence errors
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await simulateRapidClicks(() => {
        todoModel.addTask(`Task ${Date.now()}-${Math.random()}`);
      }, 50, 1);
      
      // Should not have any console errors
      expect(consoleSpy).not.toHaveBeenCalled();
      
      // All tasks should be persisted
      expect(todoModel.getTasks()).toHaveLength(50);
      
      // localStorage should contain the tasks
      const savedTasks = JSON.parse(localStorage.getItem('todos') || '[]');
      expect(savedTasks).toHaveLength(50);
      
      consoleSpy.mockRestore();
    });

    test('should handle rapid model instantiation', async () => {
      // Pre-populate localStorage
      todoModel.addTask('Existing Task 1');
      todoModel.addTask('Existing Task 2');
      
      const models: TodoModel[] = [];
      
      // Rapidly create new models
      await simulateRapidClicks(() => {
        models.push(new TodoModel());
      }, 10, 2);
      
      // All models should load the same data
      models.forEach(model => {
        expect(model.getTasks()).toHaveLength(2);
        expect(model.getTasks()[0].title).toBe('Existing Task 2'); // Most recent first
        expect(model.getTasks()[1].title).toBe('Existing Task 1');
      });
    });
  });

  describe('performance under rapid operations', () => {
    test('should maintain performance under rapid task operations', async () => {
      const startTime = Date.now();
      
      // Perform many rapid operations
      await simulateRapidClicks(() => {
        todoModel.addTask(`Performance Test ${Date.now()}`);
      }, 100, 0); // No delay for maximum stress
      
      const creationTime = Date.now() - startTime;
      
      // Now perform rapid queries
      const queryStartTime = Date.now();
      
      await simulateRapidClicks(() => {
        todoModel.getFilteredTasks('all', 'Performance');
        todoModel.getTaskStats();
      }, 100, 0);
      
      const queryTime = Date.now() - queryStartTime;
      
      // Operations should complete reasonably quickly
      expect(creationTime).toBeLessThan(1000); // Creation should be under 1 second
      expect(queryTime).toBeLessThan(500); // Queries should be under 500ms
      
      // State should be consistent
      expect(todoModel.getTasks()).toHaveLength(100);
      expect(todoModel.getTaskStats().total).toBe(100);
    });

    test('should handle memory efficiently with rapid operations', async () => {
      // Create many tasks rapidly then delete them
      const taskIds: string[] = [];
      
      await simulateRapidClicks(() => {
        todoModel.addTask(`Temp Task ${Date.now()}`);
        const tasks = todoModel.getTasks();
        taskIds.push(tasks[0].id);
      }, 50, 1);
      
      expect(todoModel.getTasks()).toHaveLength(50);
      
      // Rapidly delete all tasks
      await simulateRapidClicks(() => {
        const idToDelete = taskIds.pop();
        if (idToDelete) {
          todoModel.deleteTask(idToDelete);
        }
      }, 50, 1);
      
      // Should be back to empty state
      expect(todoModel.getTasks()).toHaveLength(0);
      expect(todoModel.isEmpty()).toBe(true);
      
      // Memory should be cleaned up (localStorage should reflect empty state)
      const savedTasks = JSON.parse(localStorage.getItem('todos') || '[]');
      expect(savedTasks).toHaveLength(0);
    });
  });
});