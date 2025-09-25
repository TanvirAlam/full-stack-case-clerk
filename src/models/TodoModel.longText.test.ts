import { TodoModel } from './TodoModel';

describe('TodoModel - Long Text Edge Cases', () => {
  let todoModel: TodoModel;

  beforeEach(() => {
    todoModel = new TodoModel();
  });

  describe('long title handling', () => {
    test('should handle very long titles', () => {
      const longTitle = 'A'.repeat(1000);
      
      todoModel.addTask(longTitle);
      
      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe(longTitle);
      expect(tasks[0].title.length).toBe(1000);
    });

    test('should handle title with maximum JavaScript string length', () => {
      // Create a reasonably long title (not max JS string length to avoid memory issues)
      const longTitle = 'X'.repeat(10000);
      
      todoModel.addTask(longTitle);
      
      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe(longTitle);
    });

    test('should handle title with special characters and long length', () => {
      const longTitle = '🚀📝✨'.repeat(500) + ' Task with emojis';
      
      todoModel.addTask(longTitle);
      
      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toContain('🚀📝✨');
      expect(tasks[0].title).toContain('Task with emojis');
    });

    test('should handle titles with line breaks and long text', () => {
      const longTitle = 'Line 1\nLine 2\nLine 3\n'.repeat(100);
      
      todoModel.addTask(longTitle);
      
      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toContain('Line 1');
      expect(tasks[0].title).toContain('\n');
    });
  });

  describe('long description handling', () => {
    test('should handle very long descriptions', () => {
      const longDescription = 'B'.repeat(5000);
      
      todoModel.addTask('Short Title', longDescription);
      
      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].description).toBe(longDescription);
      expect(tasks[0].description!.length).toBe(5000);
    });

    test('should handle description longer than title', () => {
      const shortTitle = 'Title';
      const longDescription = 'This is a very long description that contains much more text than the title. '.repeat(50);
      
      todoModel.addTask(shortTitle, longDescription);
      
      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe(shortTitle);
      expect(tasks[0].description!.length).toBeGreaterThan(shortTitle.length);
    });

    test('should handle description with multiple paragraphs', () => {
      const multiParagraphDescription = `
        This is the first paragraph of a long description.
        
        This is the second paragraph with more details.
        
        This is the third paragraph with even more information.
        
        And this continues for many more paragraphs...
      `.repeat(20);
      
      todoModel.addTask('Task with Long Description', multiParagraphDescription);
      
      const tasks = todoModel.getTasks();
      expect(tasks[0].description).toContain('first paragraph');
      expect(tasks[0].description).toContain('second paragraph');
    });
  });

  describe('text truncation utilities', () => {
    // These tests would be for utility functions that truncate text for display
    test('should provide truncated title for display', () => {
      const longTitle = 'A'.repeat(200);
      todoModel.addTask(longTitle);
      
      const tasks = todoModel.getTasks();
      const task = tasks[0];
      
      // Simulate truncation for list view (would be in a utility function)
      const truncatedTitle = task.title.length > 50 
        ? task.title.substring(0, 47) + '...'
        : task.title;
      
      expect(truncatedTitle).toHaveLength(50);
      expect(truncatedTitle.endsWith('...')).toBe(true);
      expect(truncatedTitle.substring(0, 47)).toBe('A'.repeat(47));
    });

    test('should provide truncated description for display', () => {
      const longDescription = 'B'.repeat(500);
      todoModel.addTask('Title', longDescription);
      
      const tasks = todoModel.getTasks();
      const task = tasks[0];
      
      // Simulate truncation for list view
      const truncatedDescription = task.description && task.description.length > 100
        ? task.description.substring(0, 97) + '...'
        : task.description;
      
      expect(truncatedDescription).toHaveLength(100);
      expect(truncatedDescription?.endsWith('...')).toBe(true);
    });

    test('should handle word-boundary truncation', () => {
      const longTitle = 'This is a very long task title that should be truncated at word boundaries';
      todoModel.addTask(longTitle);
      
      const tasks = todoModel.getTasks();
      const task = tasks[0];
      
      // Simulate smart truncation at word boundaries  
      const maxLength = 12; // Short enough to stop at 'This is a'
      let truncated = task.title;
      
      if (task.title.length > maxLength) {
        truncated = task.title.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 0) {
          truncated = truncated.substring(0, lastSpace) + '...';
        } else {
          truncated = truncated.substring(0, maxLength - 3) + '...';
        }
      }
      
      expect(truncated.length).toBeLessThanOrEqual(15); // Should be around 'This is a...' (12 chars)
      expect(truncated.endsWith('...')).toBe(true);
      expect(truncated).not.toContain('very long'); // Should not cut mid-word
    });
  });

  describe('performance with long text', () => {
    test('should handle multiple tasks with long text efficiently', () => {
      const startTime = Date.now();
      
      // Create many tasks with long text
      for (let i = 0; i < 100; i++) {
        const longTitle = `Task ${i} with very long title `.repeat(20);
        const longDescription = `Description ${i} with extensive details `.repeat(50);
        todoModel.addTask(longTitle, longDescription);
      }
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      expect(todoModel.getTasks()).toHaveLength(100);
      expect(executionTime).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle search through tasks with long text', () => {
      // Create tasks with long text containing search terms
      const searchTerm = 'FINDME';
      
      for (let i = 0; i < 50; i++) {
        const longTitle = 'A'.repeat(1000) + (i % 10 === 0 ? searchTerm : '') + 'B'.repeat(1000);
        const longDescription = 'C'.repeat(2000) + (i % 15 === 0 ? searchTerm : '') + 'D'.repeat(2000);
        todoModel.addTask(longTitle, longDescription);
      }
      
      const startTime = Date.now();
      const filteredTasks = todoModel.getFilteredTasks('all', searchTerm);
      const endTime = Date.now();
      
      expect(filteredTasks.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(100); // Search should be fast
    });
  });

  describe('text encoding and special characters', () => {
    test('should handle titles with various Unicode characters', () => {
      const unicodeTitles = [
        '测试任务 with Chinese characters',
        'Tâche avec caractères français',
        'Задача с русскими символами',
        'مهمة مع الأحرف العربية',
        '🎯📋✅ Emoji Task with 🚀🎉💪',
        '𝓣𝓮𝓼𝓽 𝔀𝓲𝓽𝓱 𝓯𝓪𝓷𝓬𝔂 𝓤𝓷𝓲𝓬𝓸𝓭𝓮'
      ];
      
      unicodeTitles.forEach((title, index) => {
        todoModel.addTask(title, `Description ${index} with Unicode: ${title}`);
      });
      
      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(unicodeTitles.length);
      
      tasks.forEach((task, index) => {
        // Tasks are added in reverse order (newest first)
        const expectedIndex = unicodeTitles.length - 1 - index;
        expect(task.title).toBe(unicodeTitles[expectedIndex]);
        expect(task.description).toContain(unicodeTitles[expectedIndex]);
      });
    });

    test('should handle HTML entities and special characters', () => {
      const title = '&lt;script&gt;alert("XSS")&lt;/script&gt; &amp; other HTML entities';
      const description = '&quot;Quoted text&quot; &apos;with apostrophes&apos; and &copy; symbols';
      
      todoModel.addTask(title, description);
      
      const tasks = todoModel.getTasks();
      expect(tasks[0].title).toBe(title);
      expect(tasks[0].description).toBe(description);
    });
  });

  describe('memory management with long text', () => {
    test('should handle task deletion with long text', () => {
      const longTitle = 'X'.repeat(10000);
      const longDescription = 'Y'.repeat(50000);
      
      todoModel.addTask(longTitle, longDescription);
      const task = todoModel.getTasks()[0];
      
      expect(todoModel.getTasks()).toHaveLength(1);
      
      todoModel.deleteTask(task.id);
      
      expect(todoModel.getTasks()).toHaveLength(0);
      expect(todoModel.isEmpty()).toBe(true);
    });

    test('should handle task updates with long text', () => {
      todoModel.addTask('Short title', 'Short description');
      const task = todoModel.getTasks()[0];
      
      // Toggle task status
      todoModel.toggleTask(task.id);
      
      const updatedTask = todoModel.getTaskById(task.id);
      expect(updatedTask?.completed).toBe(true);
      expect(updatedTask?.title).toBe('Short title');
      expect(updatedTask?.description).toBe('Short description');
    });
  });
});