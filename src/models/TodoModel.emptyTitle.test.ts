import { TodoModel } from './TodoModel';

describe('TodoModel - Empty Title Edge Cases', () => {
  let todoModel: TodoModel;

  beforeEach(() => {
    todoModel = new TodoModel();
  });

  describe('addTask with empty title variations', () => {
    test('should not create task with empty string title', () => {
      const initialTaskCount = todoModel.getTasks().length;
      
      todoModel.addTask('');
      
      expect(todoModel.getTasks()).toHaveLength(initialTaskCount);
    });

    test('should not create task with whitespace-only title', () => {
      const initialTaskCount = todoModel.getTasks().length;
      
      todoModel.addTask('   ');
      todoModel.addTask('\t\n');
      todoModel.addTask('  \t  \n  ');
      
      expect(todoModel.getTasks()).toHaveLength(initialTaskCount);
    });

    test('should not create task with null title', () => {
      const initialTaskCount = todoModel.getTasks().length;
      
      // @ts-expect-error - Testing runtime behavior with null
      todoModel.addTask(null);
      
      expect(todoModel.getTasks()).toHaveLength(initialTaskCount);
    });

    test('should not create task with undefined title', () => {
      const initialTaskCount = todoModel.getTasks().length;
      
      // @ts-expect-error - Testing runtime behavior with undefined
      todoModel.addTask(undefined);
      
      expect(todoModel.getTasks()).toHaveLength(initialTaskCount);
    });

    test('should trim and create task with title that has leading/trailing whitespace', () => {
      const initialTaskCount = todoModel.getTasks().length;
      
      todoModel.addTask('  Valid Task  ');
      
      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(initialTaskCount + 1);
      expect(tasks[0].title).toBe('Valid Task');
    });

    test('should handle mixed whitespace scenarios correctly', () => {
      const testCases = [
        { input: '', shouldCreate: false },
        { input: ' ', shouldCreate: false },
        { input: '\t', shouldCreate: false },
        { input: '\n', shouldCreate: false },
        { input: '  a  ', shouldCreate: true, expected: 'a' },
        { input: '\t\nHello\t\n', shouldCreate: true, expected: 'Hello' },
      ];

      testCases.forEach(({ input, shouldCreate, expected }) => {
        const initialCount = todoModel.getTasks().length;
        
        todoModel.addTask(input);
        
        if (shouldCreate) {
          expect(todoModel.getTasks()).toHaveLength(initialCount + 1);
          expect(todoModel.getTasks()[0].title).toBe(expected);
        } else {
          expect(todoModel.getTasks()).toHaveLength(initialCount);
        }
      });
    });
  });

  describe('addTask with empty description variations', () => {
    test('should handle empty description gracefully', () => {
      todoModel.addTask('Valid Title', '');
      
      const tasks = todoModel.getTasks();
      expect(tasks[0].description).toBeUndefined();
    });

    test('should handle whitespace-only description', () => {
      todoModel.addTask('Valid Title', '   ');
      
      const tasks = todoModel.getTasks();
      expect(tasks[0].description).toBeUndefined();
    });

    test('should trim description with leading/trailing whitespace', () => {
      todoModel.addTask('Valid Title', '  Valid Description  ');
      
      const tasks = todoModel.getTasks();
      expect(tasks[0].description).toBe('Valid Description');
    });

    test('should handle null and undefined description', () => {
      todoModel.addTask('Valid Title', null as any);
      todoModel.addTask('Valid Title 2', undefined);
      
      const tasks = todoModel.getTasks();
      expect(tasks[0].description).toBeUndefined();
      expect(tasks[1].description).toBeUndefined();
    });
  });

  describe('observer notification with empty title attempts', () => {
    test('should not notify listeners when empty title task creation fails', () => {
      const listener = jest.fn();
      todoModel.subscribe(listener);
      
      todoModel.addTask('');
      todoModel.addTask('   ');
      
      expect(listener).not.toHaveBeenCalled();
    });

    test('should notify listeners only when valid task is created', () => {
      const listener = jest.fn();
      todoModel.subscribe(listener);
      
      todoModel.addTask(''); // Should not notify
      todoModel.addTask('Valid Task'); // Should notify
      todoModel.addTask('   '); // Should not notify
      
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases with special characters', () => {
    test('should handle unicode whitespace characters', () => {
      // Test various unicode whitespace characters
      const unicodeWhitespace = [
        '\u00A0', // Non-breaking space
        '\u2000', // En quad
        '\u2001', // Em quad
        '\u2009', // Thin space
        '\u200B', // Zero-width space
      ];

      unicodeWhitespace.forEach(whitespace => {
        const initialCount = todoModel.getTasks().length;
        todoModel.addTask(whitespace);
        expect(todoModel.getTasks()).toHaveLength(initialCount);
      });
    });

    test('should handle mixed unicode and regular whitespace', () => {
      const initialCount = todoModel.getTasks().length;
      
      todoModel.addTask('\u00A0 \t Valid \u2000 Task \n\u200B');
      
      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(initialCount + 1);
      // Note: trim() may not handle all unicode whitespace, 
      // but this tests current behavior
    });
  });

  describe('memory and performance with empty title attempts', () => {
    test('should not consume memory for failed task creations', () => {
      const initialCount = todoModel.getTasks().length;
      
      // Attempt to create many invalid tasks
      for (let i = 0; i < 1000; i++) {
        todoModel.addTask('');
        todoModel.addTask('   ');
      }
      
      expect(todoModel.getTasks()).toHaveLength(initialCount);
      expect(todoModel.isEmpty()).toBe(initialCount === 0);
    });
  });
});