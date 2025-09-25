import { TodoModel } from './TodoModel';

describe('TodoModel - Empty State Edge Cases', () => {
  let todoModel: TodoModel;

  beforeEach(() => {
    todoModel = new TodoModel();
  });

  describe('no tasks scenarios', () => {
    test('should initialize with empty state', () => {
      expect(todoModel.getTasks()).toEqual([]);
      expect(todoModel.isEmpty()).toBe(true);
      expect(todoModel.getTaskStats()).toEqual({
        total: 0,
        active: 0,
        completed: 0
      });
    });

    test('should handle getFilteredTasks when no tasks exist', () => {
      expect(todoModel.getFilteredTasks('all', '')).toEqual([]);
      expect(todoModel.getFilteredTasks('active', '')).toEqual([]);
      expect(todoModel.getFilteredTasks('done', '')).toEqual([]);
      expect(todoModel.getFilteredTasks('all', 'search term')).toEqual([]);
    });

    test('should handle toggleTask on non-existent task gracefully', () => {
      const nonExistentId = 'non-existent-id';
      
      // Should not throw error
      expect(() => todoModel.toggleTask(nonExistentId)).not.toThrow();
      
      // State should remain unchanged
      expect(todoModel.getTasks()).toEqual([]);
      expect(todoModel.isEmpty()).toBe(true);
    });

    test('should handle deleteTask on non-existent task gracefully', () => {
      const nonExistentId = 'non-existent-id';
      
      expect(() => todoModel.deleteTask(nonExistentId)).not.toThrow();
      expect(todoModel.getTasks()).toEqual([]);
      expect(todoModel.isEmpty()).toBe(true);
    });

    test('should handle getTaskById when no tasks exist', () => {
      const nonExistentId = 'non-existent-id';
      
      expect(todoModel.getTaskById(nonExistentId)).toBeUndefined();
    });

    test('should not notify listeners when no operations affect empty state', () => {
      const listener = jest.fn();
      todoModel.subscribe(listener);
      
      todoModel.toggleTask('non-existent');
      todoModel.deleteTask('non-existent');
      todoModel.getTaskById('non-existent');
      
      expect(listener).not.toHaveBeenCalled();
    });

    test('should handle persistence operations with empty state', () => {
      // Force save and load with empty state
      expect(() => todoModel.getTasks()).not.toThrow();
      
      // Verify localStorage is properly handled
      expect(localStorage.getItem('todos')).toBe(null);
    });
  });

  describe('no search results scenarios', () => {
    beforeEach(() => {
      // Add some tasks first
      todoModel.addTask('Buy groceries', undefined, 'Get milk and bread');
      todoModel.addTask('Walk the dog', undefined, 'Take Rex for a walk in the park');
      todoModel.addTask('Code review', undefined, 'Review PR #123');
    });

    test('should return empty array when search term has no matches', () => {
      const noMatchTerms = [
        'xyzzyx', // Random string
        '12345678909876543210', // Random numbers
        'こんにちは', // Japanese text not in tasks
        '🦄🌈✨', // Random emojis
        'CASE_SENSITIVE_TERM_NOT_IN_TASKS'
      ];
      
      noMatchTerms.forEach(term => {
        const results = todoModel.getFilteredTasks('all', term);
        expect(results).toEqual([]);
        expect(results).toHaveLength(0);
      });
    });

    test('should handle search with special regex characters', () => {
      const specialRegexTerms = [
        '.*', // Regex wildcard
        '^$', // Regex anchors
        '[abc]', // Regex character class
        '(group)', // Regex group
        '\\d+', // Regex digit pattern
        '+*?', // Regex quantifiers
      ];
      
      specialRegexTerms.forEach(term => {
        expect(() => {
          const results = todoModel.getFilteredTasks('all', term);
          expect(Array.isArray(results)).toBe(true);
        }).not.toThrow();
      });
    });

    test('should return empty array when filtering completed tasks but none exist', () => {
      // All tasks are active by default
      const completedTasks = todoModel.getFilteredTasks('done', '');
      expect(completedTasks).toEqual([]);
      expect(completedTasks).toHaveLength(0);
    });

    test('should return empty array when filtering active tasks but all are completed', () => {
      // Complete all tasks
      const allTasks = todoModel.getTasks();
      allTasks.forEach(task => todoModel.toggleTask(task.id));
      
      const activeTasks = todoModel.getFilteredTasks('active', '');
      expect(activeTasks).toEqual([]);
      expect(activeTasks).toHaveLength(0);
    });

    test('should handle combined filter and search with no results', () => {
      // Complete one task
      const tasks = todoModel.getTasks();
      todoModel.toggleTask(tasks[0].id);
      
      // Search for term that doesn't exist in completed tasks
      const results = todoModel.getFilteredTasks('done', 'nonexistent term');
      expect(results).toEqual([]);
    });

    test('should handle search with very long search terms', () => {
      const veryLongSearchTerm = 'thisisaverylongsearchtermthatdefinitelydoesnotexistinanyofthetasks'.repeat(10);
      
      const results = todoModel.getFilteredTasks('all', veryLongSearchTerm);
      expect(results).toEqual([]);
    });

    test('should handle empty search term correctly', () => {
      const resultsEmptyString = todoModel.getFilteredTasks('all', '');
      const resultsWhitespace = todoModel.getFilteredTasks('all', '   ');
      
      // Empty search should return all tasks
      expect(resultsEmptyString).toHaveLength(3);
      expect(resultsWhitespace).toHaveLength(3);
    });
  });

  describe('transitioning from empty to populated state', () => {
    test('should correctly transition from empty to populated state', () => {
      expect(todoModel.isEmpty()).toBe(true);
      
      todoModel.addTask('First task');
      
      expect(todoModel.isEmpty()).toBe(false);
      expect(todoModel.getTasks()).toHaveLength(1);
      expect(todoModel.getTaskStats().total).toBe(1);
    });

    test('should correctly transition back to empty state', () => {
      todoModel.addTask('Task to be deleted');
      const task = todoModel.getTasks()[0];
      
      expect(todoModel.isEmpty()).toBe(false);
      
      todoModel.deleteTask(task.id);
      
      expect(todoModel.isEmpty()).toBe(true);
      expect(todoModel.getTasks()).toEqual([]);
    });

    test('should handle multiple transitions correctly', () => {
      const listener = jest.fn();
      todoModel.subscribe(listener);
      
      // Empty -> Populated
      todoModel.addTask('Task 1');
      expect(listener).toHaveBeenCalledTimes(1);
      expect(todoModel.isEmpty()).toBe(false);
      
      // Add more
      todoModel.addTask('Task 2');
      expect(listener).toHaveBeenCalledTimes(2);
      
      // Delete all
      const tasks = todoModel.getTasks();
      tasks.forEach(task => todoModel.deleteTask(task.id));
      
      expect(listener).toHaveBeenCalledTimes(4); // 2 additions + 2 deletions
      expect(todoModel.isEmpty()).toBe(true);
    });
  });

  describe('empty state edge cases with filtering', () => {
    test('should handle rapid filtering operations on empty state', () => {
      const filters: Array<'all' | 'active' | 'done'> = ['all', 'active', 'done'];
      const searchTerms = ['', 'test', '123', 'ñoñó', '🎯'];
      
      filters.forEach(filter => {
        searchTerms.forEach(search => {
          const results = todoModel.getFilteredTasks(filter, search);
          expect(results).toEqual([]);
          expect(Array.isArray(results)).toBe(true);
        });
      });
    });

    test('should maintain consistent empty state with concurrent operations', () => {
      const operations = [
        () => todoModel.getFilteredTasks('all', ''),
        () => todoModel.getFilteredTasks('active', 'search'),
        () => todoModel.getFilteredTasks('done', 'another search'),
        () => todoModel.toggleTask('non-existent'),
        () => todoModel.deleteTask('also-non-existent'),
        () => todoModel.getTaskById('missing'),
        () => todoModel.getTaskStats(),
      ];
      
      // Execute operations multiple times
      for (let i = 0; i < 100; i++) {
        operations[i % operations.length]();
        expect(todoModel.isEmpty()).toBe(true);
        expect(todoModel.getTasks()).toEqual([]);
      }
    });
  });

  describe('empty state with persistence', () => {
    test('should handle localStorage corruption scenarios with empty state', () => {
      // Corrupt localStorage
      localStorage.setItem('todos', 'invalid json');
      
      // Create new model - should handle corruption gracefully
      const newModel = new TodoModel();
      
      expect(newModel.isEmpty()).toBe(true);
      expect(newModel.getTasks()).toEqual([]);
      
      // Should have cleared corrupted data
      expect(localStorage.getItem('todos')).toBe(null);
    });

    test('should handle localStorage with empty array', () => {
      localStorage.setItem('todos', '[]');
      
      const newModel = new TodoModel();
      
      expect(newModel.isEmpty()).toBe(true);
      expect(newModel.getTasks()).toEqual([]);
    });

    test('should handle localStorage with null/undefined', () => {
      localStorage.setItem('todos', 'null');
      
      const newModel = new TodoModel();
      
      expect(newModel.isEmpty()).toBe(true);
      expect(newModel.getTasks()).toEqual([]);
    });
  });

  describe('empty state statistics and metrics', () => {
    test('should provide correct statistics for empty state', () => {
      const stats = todoModel.getTaskStats();
      
      expect(stats).toEqual({
        total: 0,
        active: 0,
        completed: 0
      });
      
      // Stats should be consistent
      expect(stats.total).toBe(stats.active + stats.completed);
    });

    test('should handle statistics calculation with empty filtered results', () => {
      todoModel.addTask('Task 1');
      todoModel.addTask('Task 2');
      
      const noResults = todoModel.getFilteredTasks('all', 'nonexistent');
      expect(noResults).toHaveLength(0);
      
      // Original stats should be unaffected
      const stats = todoModel.getTaskStats();
      expect(stats.total).toBe(2);
      expect(stats.active).toBe(2);
      expect(stats.completed).toBe(0);
    });
  });
});