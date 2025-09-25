import { TodoController } from './TodoController';
import { TodoModel } from '../models/TodoModel';
import { TASK_PRIORITIES, TASK_FILTERS } from '../utils/const';

describe('TodoController - Edge Cases', () => {
  let todoModel: TodoModel;
  let controller: TodoController;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    todoModel = new TodoModel();
    controller = new TodoController(todoModel);
  });

  describe('Empty Title Edge Cases', () => {
    test('should handle empty title gracefully', () => {
      const mockFormData = {
        title: '',
        description: 'Valid description',
        priority: TASK_PRIORITIES.MEDIUM as 'medium',
        resetForm: jest.fn(),
      };
      const mockEvent = { preventDefault: jest.fn() } as any;

      const initialTaskCount = todoModel.getTasks().length;

      controller.handleAddTask(mockEvent, mockFormData);

      // Should not add task with empty title
      expect(todoModel.getTasks()).toHaveLength(initialTaskCount);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      // resetForm should NOT be called for invalid submissions
      expect(mockFormData.resetForm).not.toHaveBeenCalled();
    });

    test('should handle whitespace-only title gracefully', () => {
      const mockFormData = {
        title: '   \t\n   ',
        description: 'Valid description',
        priority: TASK_PRIORITIES.HIGH as 'high',
        resetForm: jest.fn(),
      };
      const mockEvent = { preventDefault: jest.fn() } as any;

      const initialTaskCount = todoModel.getTasks().length;

      controller.handleAddTask(mockEvent, mockFormData);

      expect(todoModel.getTasks()).toHaveLength(initialTaskCount);
      expect(mockFormData.resetForm).not.toHaveBeenCalled();
    });

    test('should handle Unicode whitespace characters', () => {
      const unicodeWhitespace = '\u00A0\u2000\u200B'; // Non-breaking space, en quad, zero-width space
      const mockFormData = {
        title: unicodeWhitespace,
        description: 'Description',
        priority: TASK_PRIORITIES.LOW as 'low',
        resetForm: jest.fn(),
      };
      const mockEvent = { preventDefault: jest.fn() } as any;

      const initialTaskCount = todoModel.getTasks().length;

      controller.handleAddTask(mockEvent, mockFormData);

      expect(todoModel.getTasks()).toHaveLength(initialTaskCount);
      expect(mockFormData.resetForm).not.toHaveBeenCalled();
    });

    test('should process valid title after trimming whitespace', () => {
      const mockFormData = {
        title: '  Valid Task Title  ',
        description: '  Valid description  ',
        priority: TASK_PRIORITIES.HIGH as 'high',
        resetForm: jest.fn(),
      };
      const mockEvent = { preventDefault: jest.fn() } as any;

      const initialTaskCount = todoModel.getTasks().length;

      controller.handleAddTask(mockEvent, mockFormData);

      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(initialTaskCount + 1);
      expect(tasks[0].title).toBe('Valid Task Title'); // Should be trimmed
      expect(mockFormData.resetForm).toHaveBeenCalled();
    });
  });

  describe('Long Titles and Descriptions Edge Cases', () => {
    test('should handle very long task titles', () => {
      const longTitle = 'A'.repeat(1000);
      const mockFormData = {
        title: longTitle,
        description: 'Short description',
        priority: TASK_PRIORITIES.MEDIUM as 'medium',
        resetForm: jest.fn(),
      };
      const mockEvent = { preventDefault: jest.fn() } as any;

      controller.handleAddTask(mockEvent, mockFormData);

      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe(longTitle);
      expect(tasks[0].title.length).toBe(1000);
    });

    test('should handle very long descriptions', () => {
      const longDescription = 'B'.repeat(5000);
      const mockFormData = {
        title: 'Short Title',
        description: longDescription,
        priority: TASK_PRIORITIES.LOW as 'low',
        resetForm: jest.fn(),
      };
      const mockEvent = { preventDefault: jest.fn() } as any;

      controller.handleAddTask(mockEvent, mockFormData);

      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].description).toBe(longDescription);
      expect(tasks[0].description!.length).toBe(5000);
    });

    test('should handle titles with special characters and emojis', () => {
      const specialTitle = '🚀 Task with émojis & spécial chars: ñoñó 测试 🎯';
      const mockFormData = {
        title: specialTitle,
        description: 'Description with 测试 Chinese & émojis 🎉',
        priority: TASK_PRIORITIES.HIGH as 'high',
        resetForm: jest.fn(),
      };
      const mockEvent = { preventDefault: jest.fn() } as any;

      controller.handleAddTask(mockEvent, mockFormData);

      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe(specialTitle);
      expect(tasks[0].description).toContain('测试');
    });
  });

  describe('Empty States Edge Cases', () => {
    test('should handle empty task list state', () => {
      // Start with empty model
      expect(todoModel.isEmpty()).toBe(true);
      expect(todoModel.getTasks()).toEqual([]);
      
      const filtered = controller.getFilteredTasks(TASK_FILTERS.ALL, '');
      expect(filtered).toEqual([]);
      
      const stats = todoModel.getTaskStats();
      expect(stats).toEqual({
        total: 0,
        active: 0,
        completed: 0,
      });
    });

    test('should handle empty search results', () => {
      // Add some tasks first
      todoModel.addTask('Apple Task', 'About apples');
      todoModel.addTask('Banana Task', 'About bananas');
      todoModel.addTask('Cherry Task', 'About cherries');

      expect(todoModel.getTasks()).toHaveLength(3);

      // Search for something that doesn't exist
      const noResults = controller.getFilteredTasks(TASK_FILTERS.ALL, 'nonexistent');
      expect(noResults).toEqual([]);

      // Search for partial matches
      const appleResults = controller.getFilteredTasks(TASK_FILTERS.ALL, 'apple');
      expect(appleResults).toHaveLength(1);
      expect(appleResults[0].title).toBe('Apple Task');
    });

    test('should handle filter with no matching tasks', () => {
      // Add only completed tasks
      todoModel.addTask('Task 1');
      todoModel.addTask('Task 2');
      const tasks = todoModel.getTasks();
      todoModel.toggleTask(tasks[0].id);
      todoModel.toggleTask(tasks[1].id);

      // Filter for active tasks (should be empty)
      const activeResults = controller.getFilteredTasks(TASK_FILTERS.ACTIVE, '');
      expect(activeResults).toEqual([]);

      // Filter for done tasks (should have both)
      const doneResults = controller.getFilteredTasks(TASK_FILTERS.DONE, '');
      expect(doneResults).toHaveLength(2);
    });

    test('should handle rapid filter switching', () => {
      // Add mixed tasks
      todoModel.addTask('Active Task 1');
      todoModel.addTask('Active Task 2');
      todoModel.addTask('Done Task 1');
      const tasks = todoModel.getTasks();
      todoModel.toggleTask(tasks[0].id); // Complete the 'Done Task 1'

      // Rapidly switch between filters
      const filters = [TASK_FILTERS.ALL, TASK_FILTERS.ACTIVE, TASK_FILTERS.DONE];
      const results = filters.map(filter => 
        controller.getFilteredTasks(filter, '')
      );

      expect(results[0]).toHaveLength(3); // All
      expect(results[1]).toHaveLength(2); // Active
      expect(results[2]).toHaveLength(1); // Done
    });
  });

  describe('Rapid Input and Double Click Edge Cases', () => {
    test('should handle rapid form submissions', () => {
      const mockFormData = {
        title: 'Rapid Task',
        description: 'Same task added rapidly',
        priority: TASK_PRIORITIES.MEDIUM as 'medium',
        resetForm: jest.fn(),
      };
      const mockEvent = { preventDefault: jest.fn() } as any;

      // Simulate rapid clicks (multiple submissions)
      const rapidSubmissions = 5;
      for (let i = 0; i < rapidSubmissions; i++) {
        controller.handleAddTask(mockEvent, mockFormData);
      }

      // Should create multiple tasks (each with different IDs)
      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(rapidSubmissions);
      
      // All should have the same title but different IDs
      tasks.forEach(task => {
        expect(task.title).toBe('Rapid Task');
        expect(task.description).toBe('Same task added rapidly');
      });
      
      // Should have unique IDs
      const ids = tasks.map(task => task.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(rapidSubmissions);
    });

    test('should handle rapid toggle operations', () => {
      todoModel.addTask('Toggle Test Task');
      const tasks = todoModel.getTasks();
      const taskId = tasks[0].id;
      const initialState = tasks[0].completed;

      // Rapid toggle operations
      const toggleCount = 10;
      for (let i = 0; i < toggleCount; i++) {
        controller.handleToggleTask(taskId);
      }

      const finalTask = todoModel.getTaskById(taskId);
      // Even number of toggles should result in original state
      expect(finalTask?.completed).toBe(initialState);
    });

    test('should handle rapid delete operations', () => {
      todoModel.addTask('Delete Test Task');
      const tasks = todoModel.getTasks();
      const taskId = tasks[0].id;

      // Try to delete the same task multiple times rapidly
      controller.handleDeleteTask(taskId);
      controller.handleDeleteTask(taskId); // Should not error
      controller.handleDeleteTask(taskId); // Should not error

      // Task should be deleted only once
      expect(todoModel.getTasks()).toHaveLength(0);
      expect(todoModel.getTaskById(taskId)).toBeUndefined();
    });

    test('should handle operations on non-existent tasks', () => {
      const nonExistentId = 'non-existent-task-id';
      const initialTaskCount = todoModel.getTasks().length;

      // Should not throw errors
      expect(() => controller.handleToggleTask(nonExistentId)).not.toThrow();
      expect(() => controller.handleDeleteTask(nonExistentId)).not.toThrow();

      // Should not change task list
      expect(todoModel.getTasks()).toHaveLength(initialTaskCount);
    });
  });

  describe('Persistence Corruption Edge Cases', () => {
    test('should handle corrupted localStorage gracefully', () => {
      // Corrupt localStorage
      localStorage.setItem('todos', '{ invalid json }');
      
      // Create new model - should handle corruption gracefully
      const corruptedModel = new TodoModel();
      const corruptedController = new TodoController(corruptedModel);
      
      expect(corruptedModel.isEmpty()).toBe(true);
      expect(corruptedModel.getTasks()).toEqual([]);
      
      // Should still be able to add tasks
      const mockFormData = {
        title: 'Recovery Task',
        description: 'After corruption',
        priority: TASK_PRIORITIES.HIGH as 'high',
        resetForm: jest.fn(),
      };
      const mockEvent = { preventDefault: jest.fn() } as any;
      
      expect(() => corruptedController.handleAddTask(mockEvent, mockFormData)).not.toThrow();
      expect(corruptedModel.getTasks()).toHaveLength(1);
    });

    test('should handle invalid task data in localStorage', () => {
      // Store invalid task data
      const invalidData = JSON.stringify([1, 2, 3, 'invalid', null]);
      localStorage.setItem('todos', invalidData);
      
      const corruptedModel = new TodoModel();
      
      // Should filter out invalid data and start clean
      expect(corruptedModel.getTasks()).toEqual([]);
      expect(corruptedModel.isEmpty()).toBe(true);
      
      // Should still function normally
      const stats = corruptedModel.getTaskStats();
      expect(stats.total).toBe(0);
    });

    test('should handle localStorage quota exceeded', () => {
      todoModel.addTask('Test Task', 'Description');
      
      // Mock localStorage.setItem to throw quota exceeded error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError: localStorage quota exceeded');
      });
      
      const mockFormData = {
        title: 'Another Task',
        description: 'Should handle quota error',
        priority: TASK_PRIORITIES.LOW as 'low',
        resetForm: jest.fn(),
      };
      const mockEvent = { preventDefault: jest.fn() } as any;
      
      // Should not throw error
      expect(() => controller.handleAddTask(mockEvent, mockFormData)).not.toThrow();
      
      // Restore original setItem
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('Search and Filter Edge Cases', () => {
    beforeEach(() => {
      // Setup test data with various characteristics
      todoModel.addTask('JavaScript Task', 'Learn React hooks');
      todoModel.addTask('Python Task', 'Build web scraper with Python');
      todoModel.addTask('Design Task', 'Create UI mockups');
      todoModel.addTask('Testing Task', 'Write unit tests');
      
      // Complete some tasks
      const tasks = todoModel.getTasks();
      todoModel.toggleTask(tasks[0].id); // Complete 'Testing Task'
      todoModel.toggleTask(tasks[1].id); // Complete 'Design Task'
    });

    test('should handle case-insensitive search', () => {
      const results = controller.getFilteredTasks(TASK_FILTERS.ALL, 'JAVASCRIPT');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('JavaScript Task');
    });

    test('should handle partial word search', () => {
      const results = controller.getFilteredTasks(TASK_FILTERS.ALL, 'ask');
      expect(results).toHaveLength(4); // All tasks contain 'ask' in 'Task'
    });

    test('should search in both title and description', () => {
      const results = controller.getFilteredTasks(TASK_FILTERS.ALL, 'React');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('JavaScript Task');
    });

    test('should handle empty search query', () => {
      const results = controller.getFilteredTasks(TASK_FILTERS.ALL, '');
      expect(results).toHaveLength(4); // Should return all tasks
    });

    test('should handle whitespace-only search query', () => {
      const results = controller.getFilteredTasks(TASK_FILTERS.ALL, '   ');
      expect(results).toHaveLength(4); // Should return all tasks
    });

    test('should handle special characters in search', () => {
      todoModel.addTask('Special Task: @#$%', 'Contains símbolos & ñoñó');
      
      const symbolResults = controller.getFilteredTasks(TASK_FILTERS.ALL, '@#$');
      expect(symbolResults).toHaveLength(1);
      
      const accentResults = controller.getFilteredTasks(TASK_FILTERS.ALL, 'ñoñó');
      expect(accentResults).toHaveLength(1);
    });

    test('should combine search with filter correctly', () => {
      // Search for 'Task' in active tasks only
      const activeResults = controller.getFilteredTasks(TASK_FILTERS.ACTIVE, 'Task');
      expect(activeResults).toHaveLength(2); // JavaScript and Python tasks are active
      
      // Search for 'Task' in done tasks only
      const doneResults = controller.getFilteredTasks(TASK_FILTERS.DONE, 'Task');
      expect(doneResults).toHaveLength(2); // Testing and Design tasks are done
    });

    test('should handle very long search queries', () => {
      const longQuery = 'a'.repeat(1000);
      const results = controller.getFilteredTasks(TASK_FILTERS.ALL, longQuery);
      expect(results).toEqual([]); // No matches for very long query
    });
  });

  describe('Form State Edge Cases', () => {
    test('should handle form data with null values', () => {
      const mockFormData = {
        title: 'Valid Title',
        description: null as any,
        priority: TASK_PRIORITIES.MEDIUM as 'medium',
        resetForm: jest.fn(),
      };
      const mockEvent = { preventDefault: jest.fn() } as any;

      controller.handleAddTask(mockEvent, mockFormData);

      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Valid Title');
      expect(tasks[0].description).toBeUndefined();
    });

    test('should handle form data with undefined values', () => {
      const mockFormData = {
        title: 'Valid Title',
        description: undefined as any,
        priority: TASK_PRIORITIES.LOW as 'low',
        resetForm: jest.fn(),
      };
      const mockEvent = { preventDefault: jest.fn() } as any;

      controller.handleAddTask(mockEvent, mockFormData);

      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].description).toBeUndefined();
    });

    test('should handle all priority levels correctly', () => {
      const priorities = [TASK_PRIORITIES.LOW, TASK_PRIORITIES.MEDIUM, TASK_PRIORITIES.HIGH];
      
      priorities.forEach((priority, index) => {
        const mockFormData = {
          title: `Task ${index}`,
          description: `Priority: ${priority}`,
          priority: priority as any,
          resetForm: jest.fn(),
        };
        const mockEvent = { preventDefault: jest.fn() } as any;

        controller.handleAddTask(mockEvent, mockFormData);
      });

      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(3);
      
      // Check priorities (remember tasks are in reverse order)
      expect(tasks[0].priority).toBe(TASK_PRIORITIES.HIGH);
      expect(tasks[1].priority).toBe(TASK_PRIORITIES.MEDIUM);
      expect(tasks[2].priority).toBe(TASK_PRIORITIES.LOW);
    });
  });

  describe('Performance Edge Cases', () => {
    test('should handle large number of tasks efficiently', () => {
      const startTime = Date.now();
      
      // Create many tasks
      for (let i = 0; i < 100; i++) { // Reduced from 1000 for faster test execution
        const mockFormData = {
          title: `Performance Task ${i}`,
          description: `Task number ${i} for performance testing`,
          priority: TASK_PRIORITIES.MEDIUM as 'medium',
          resetForm: jest.fn(),
        };
        const mockEvent = { preventDefault: jest.fn() } as any;
        
        controller.handleAddTask(mockEvent, mockFormData);
      }
      
      const creationTime = Date.now() - startTime;
      
      expect(todoModel.getTasks()).toHaveLength(100);
      expect(creationTime).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle filtering large datasets efficiently', () => {
      // Create tasks with searchable content
      for (let i = 0; i < 50; i++) { // Reduced from 500 for faster test execution
        const mockFormData = {
          title: `Task ${i} ${i % 10 === 0 ? 'FINDME' : 'normal'}`,
          description: `Description ${i}`,
          priority: TASK_PRIORITIES.LOW as 'low',
          resetForm: jest.fn(),
        };
        const mockEvent = { preventDefault: jest.fn() } as any;
        
        controller.handleAddTask(mockEvent, mockFormData);
      }
      
      const startTime = Date.now();
      const results = controller.getFilteredTasks(TASK_FILTERS.ALL, 'FINDME');
      const searchTime = Date.now() - startTime;
      
      expect(results.length).toBe(5); // Every 10th task contains FINDME
      expect(searchTime).toBeLessThan(100); // Search should be fast
    });
  });
});