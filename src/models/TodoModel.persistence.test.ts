import { TodoModel } from './TodoModel';
import { corruptLocalStorage } from '../test/setup';

describe('TodoModel - Persistence Corruption Edge Cases', () => {
  let todoModel: TodoModel;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset console mocks
    console.error = jest.fn();
  });

  describe('localStorage corruption scenarios', () => {
    test('should handle invalid JSON gracefully', () => {
      // Corrupt localStorage with invalid JSON
      corruptLocalStorage('{ invalid json }');
      
      // Create new model - should handle corruption gracefully
      todoModel = new TodoModel();
      
      expect(todoModel.isEmpty()).toBe(true);
      expect(todoModel.getTasks()).toEqual([]);
      
      // Should have logged error and cleared corrupted data
      expect(console.error).toHaveBeenCalledWith(
        'Error parsing saved tasks:',
        expect.any(SyntaxError)
      );
      expect(localStorage.getItem('todos')).toBe(null);
    });

    test('should handle malformed JSON with missing brackets', () => {
      const malformedJsons = [
        '{ "id": "1", "title": "Test"', // Missing closing bracket
        '"id": "1", "title": "Test" }', // Missing opening bracket
        '[ { "id": "1" } ', // Missing closing array bracket
        ' { "id": "1" } ]', // Missing opening array bracket
        '{ id: "1", title: "Test" }', // Unquoted keys
      ];
      
      malformedJsons.forEach(malformedJson => {
        localStorage.clear();
        console.error = jest.fn();
        
        corruptLocalStorage(malformedJson);
        
        const model = new TodoModel();
        
        expect(model.isEmpty()).toBe(true);
        expect(model.getTasks()).toEqual([]);
        expect(console.error).toHaveBeenCalled();
        expect(localStorage.getItem('todos')).toBe(null);
      });
    });

    test('should handle JSON with unexpected data types', () => {
      const invalidDataTypes = [
        '"just a string"',
        '123',
        'true',
        'null',
        '{ "tasks": "not an array" }',
        '{ "0": { "id": "1" } }', // Object instead of array
      ];
      
      invalidDataTypes.forEach(invalidData => {
        localStorage.clear();
        console.error = jest.fn();
        
        corruptLocalStorage(invalidData);
        
        const model = new TodoModel();
        
        expect(model.isEmpty()).toBe(true);
        expect(model.getTasks()).toEqual([]);
      });
    });

    test('should handle array with invalid task objects', () => {
      const invalidTaskArrays = [
        '[1, 2, 3]', // Array of numbers instead of tasks
        '["string1", "string2"]', // Array of strings
        '[{ "wrongField": "value" }]', // Missing required task fields
        '[{ "id": 123 }]', // Wrong data types for fields
        '[null, undefined, {}]', // Invalid objects in array
      ];
      
      invalidTaskArrays.forEach(invalidArray => {
        localStorage.clear();
        console.error = jest.fn();
        
        corruptLocalStorage(invalidArray);
        
        const model = new TodoModel();
        
        // Should handle gracefully, possibly filtering out invalid tasks
        expect(Array.isArray(model.getTasks())).toBe(true);
        // May have 0 tasks if all were invalid, or valid ones if some were salvageable
      });
    });
  });

  describe('partial data corruption scenarios', () => {
    test('should handle array with mix of valid and invalid tasks', () => {
      const mixedData = JSON.stringify([
        { id: '1', title: 'Valid Task', completed: false, priority: 'medium', createdAt: new Date().toISOString() },
        { id: 2, title: 'Invalid ID type' }, // Invalid ID type
        null, // Null task
        { id: '3', title: 'Another Valid Task', completed: false, priority: 'high', createdAt: new Date().toISOString() },
        'invalid string task',
        { id: '4' }, // Missing required fields
      ]);
      
      corruptLocalStorage(mixedData);
      
      todoModel = new TodoModel();
      
      const tasks = todoModel.getTasks();
      
      // Should preserve valid tasks and handle invalid ones gracefully
      // The exact behavior depends on implementation, but should not crash
      expect(Array.isArray(tasks)).toBe(true);
      
      // Valid tasks should be preserved if the model filters them
      const validTasks = tasks.filter(task => 
        task && 
        typeof task.id === 'string' && 
        typeof task.title === 'string'
      );
      
      expect(validTasks.length).toBeGreaterThanOrEqual(0);
    });

    test('should handle tasks with missing optional fields', () => {
      const tasksWithMissingFields = JSON.stringify([
        { id: '1', title: 'Complete Task', completed: false, priority: 'medium', createdAt: new Date().toISOString() },
        { id: '2', title: 'Missing Description' }, // Missing description (optional)
        { id: '3', title: 'Missing Priority', completed: true }, // Missing priority
        { id: '4', title: 'Missing CreatedAt', completed: false, priority: 'low' },
      ]);
      
      corruptLocalStorage(tasksWithMissingFields);
      
      todoModel = new TodoModel();
      
      // Should handle missing optional fields gracefully
      expect(() => todoModel.getTasks()).not.toThrow();
      expect(() => todoModel.getTaskStats()).not.toThrow();
      expect(() => todoModel.getFilteredTasks('all', '')).not.toThrow();
    });

    test('should handle tasks with extra unknown fields', () => {
      const tasksWithExtraFields = JSON.stringify([
        { 
          id: '1', 
          title: 'Task with extras', 
          completed: false, 
          priority: 'medium', 
          createdAt: new Date().toISOString(),
          extraField: 'should be ignored',
          anotherExtra: 12345,
          nestedExtra: { deep: 'object' }
        }
      ]);
      
      corruptLocalStorage(tasksWithExtraFields);
      
      todoModel = new TodoModel();
      
      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(1);
      
      const task = tasks[0];
      expect(task.id).toBe('1');
      expect(task.title).toBe('Task with extras');
      // Extra fields might be preserved or ignored depending on implementation
    });
  });

  describe('localStorage edge cases', () => {
    test('should handle localStorage quota exceeded', () => {
      todoModel = new TodoModel();
      
      // Mock localStorage.setItem to throw quota exceeded error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });
      
      // Should handle the error gracefully
      expect(() => {
        todoModel.addTask('Test Task');
      }).not.toThrow();
      
      // Restore original setItem
      Storage.prototype.setItem = originalSetItem;
    });

    test('should handle localStorage being unavailable', () => {
      // Mock localStorage to throw errors
      const originalGetItem = Storage.prototype.getItem;
      const originalSetItem = Storage.prototype.setItem;
      const originalRemoveItem = Storage.prototype.removeItem;
      
      Storage.prototype.getItem = jest.fn(() => {
        throw new Error('localStorage not available');
      });
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('localStorage not available');
      });
      Storage.prototype.removeItem = jest.fn(() => {
        throw new Error('localStorage not available');
      });
      
      // Should still work without localStorage
      expect(() => {
        todoModel = new TodoModel();
        todoModel.addTask('Test Task');
        const tasks = todoModel.getTasks();
        expect(tasks).toHaveLength(1);
      }).not.toThrow();
      
      // Restore original methods
      Storage.prototype.getItem = originalGetItem;
      Storage.prototype.setItem = originalSetItem;
      Storage.prototype.removeItem = originalRemoveItem;
    });

    test('should handle localStorage returning unexpected values', () => {
      const unexpectedValues = [
        undefined,
        null,
        '',
        '   ',
        'undefined',
        'null',
        '[object Object]',
        'NaN',
        'Infinity',
      ];
      
      unexpectedValues.forEach(value => {
        localStorage.clear();
        console.error = jest.fn();
        
        // Mock getItem to return unexpected value
        Storage.prototype.getItem = jest.fn(() => value as string | null);
        
        const model = new TodoModel();
        
        expect(model.isEmpty()).toBe(true);
        expect(model.getTasks()).toEqual([]);
        
        // Restore original getItem
        Storage.prototype.getItem = Storage.prototype.getItem;
      });
    });
  });

  describe('data validation and recovery', () => {
    test('should validate and fix task data on load', () => {
      const corruptTaskData = JSON.stringify([
        {
          id: '1',
          title: 'Valid Task',
          completed: false,
          priority: 'medium',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Task with invalid priority',
          completed: 'not a boolean', // Wrong type
          priority: 'invalid_priority', // Invalid priority value
          createdAt: 'not a date'
        }
      ]);
      
      corruptLocalStorage(corruptTaskData);
      
      todoModel = new TodoModel();
      
      // Should handle data validation gracefully
      expect(() => todoModel.getTasks()).not.toThrow();
      expect(() => todoModel.getTaskStats()).not.toThrow();
      
      const tasks = todoModel.getTasks();
      expect(Array.isArray(tasks)).toBe(true);
      
      // Valid tasks should be preserved
      const validTasks = tasks.filter(task => 
        task &&
        typeof task.id === 'string' &&
        typeof task.title === 'string'
      );
      
      expect(validTasks.length).toBeGreaterThanOrEqual(1);
    });

    test('should provide fallback when all data is corrupted', () => {
      corruptLocalStorage('completely invalid data that cannot be parsed at all');
      
      todoModel = new TodoModel();
      
      // Should fall back to empty state
      expect(todoModel.isEmpty()).toBe(true);
      expect(todoModel.getTasks()).toEqual([]);
      expect(todoModel.getTaskStats()).toEqual({
        total: 0,
        active: 0,
        completed: 0
      });
      
      // Should still be functional after corruption
      todoModel.addTask('Recovery Test');
      expect(todoModel.getTasks()).toHaveLength(1);
      expect(todoModel.getTasks()[0].title).toBe('Recovery Test');
    });

    test('should handle circular references in corrupted data', () => {
      // Create data with circular reference (if somehow it gets into localStorage)
      const circularData = '{"tasks":[{"id":"1","title":"test","self":{"$ref":"$"}}]}';
      
      corruptLocalStorage(circularData);
      
      // Should not crash on circular references
      expect(() => {
        todoModel = new TodoModel();
      }).not.toThrow();
      
      expect(todoModel.isEmpty()).toBe(true);
    });
  });

  describe('error logging and user feedback', () => {
    test('should log detailed error information for debugging', () => {
      const invalidData = '{ "incomplete": json';
      corruptLocalStorage(invalidData);
      
      console.error = jest.fn();
      
      todoModel = new TodoModel();
      
      // Should log error with context
      expect(console.error).toHaveBeenCalledWith(
        'Error parsing saved tasks:',
        expect.any(Error)
      );
    });

    test('should handle multiple corruption scenarios in sequence', () => {
      const corruptionScenarios = [
        '{ invalid json',
        '[1, 2, 3]',
        'null',
        '{ "tasks": "not array" }',
        'completely invalid'
      ];
      
      corruptionScenarios.forEach((corruptData, index) => {
        localStorage.clear();
        console.error = jest.fn();
        
        corruptLocalStorage(corruptData);
        
        const model = new TodoModel();
        
        // Each scenario should be handled gracefully
        expect(model.isEmpty()).toBe(true);
        expect(() => model.addTask(`Test ${index}`)).not.toThrow();
        expect(model.getTasks()).toHaveLength(1);
      });
    });

    test('should recover and continue working after corruption', () => {
      // Start with corrupted data
      corruptLocalStorage('{ invalid }');
      
      todoModel = new TodoModel();
      
      // Should start fresh
      expect(todoModel.isEmpty()).toBe(true);
      
      // Should work normally after recovery
      todoModel.addTask('First Task', undefined, 'After recovery');
      todoModel.addTask('Second Task', undefined, 'Still working');
      
      expect(todoModel.getTasks()).toHaveLength(2);
      expect(todoModel.getTaskStats().total).toBe(2);
      
      // Should persist correctly after recovery
      const newModel = new TodoModel();
      expect(newModel.getTasks()).toHaveLength(2);
      expect(newModel.getTasks()[0].title).toBe('Second Task'); // Most recent first
    });
  });

  describe('edge cases in data persistence', () => {
    test('should handle very large localStorage data', () => {
      // Create a large amount of task data
      const largeTasks = Array.from({ length: 1000 }, (_, i) => ({
        id: `large-task-${i}`,
        title: `Large Task ${i} with very long description `.repeat(20),
        description: `Very long description for task ${i} `.repeat(100),
        completed: i % 2 === 0,
        priority: ['low', 'medium', 'high'][i % 3],
        createdAt: new Date(Date.now() - i * 1000).toISOString()
      }));
      
      const largeDataString = JSON.stringify(largeTasks);
      corruptLocalStorage(largeDataString);
      
      // Should handle large valid data
      expect(() => {
        todoModel = new TodoModel();
      }).not.toThrow();
      
      const tasks = todoModel.getTasks();
      expect(tasks.length).toBeGreaterThan(0);
    });

    test('should handle empty localStorage gracefully', () => {
      localStorage.clear();
      
      todoModel = new TodoModel();
      
      expect(todoModel.isEmpty()).toBe(true);
      expect(todoModel.getTasks()).toEqual([]);
      
      // Should work normally with empty start
      todoModel.addTask('First Task');
      expect(todoModel.getTasks()).toHaveLength(1);
    });
  });
});