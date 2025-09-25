/**
 * @jest-environment jsdom
 */
import { TodoController } from '../controllers/TodoController';
import { TodoModel } from '../models/TodoModel';
import { TASK_PRIORITIES } from '../utils/const';

describe('Bulk Actions Tests', () => {
  let todoModel: TodoModel;
  let controller: TodoController;

  beforeEach(() => {
    localStorage.clear();
    todoModel = new TodoModel();
    controller = new TodoController(todoModel);
  });

  describe('Bulk Complete Functionality', () => {
    test('should complete multiple incomplete tasks', () => {
      // Add some tasks
      todoModel.addTask('Task 1', undefined, undefined, TASK_PRIORITIES.HIGH);
      todoModel.addTask('Task 2', undefined, undefined, TASK_PRIORITIES.MEDIUM);
      todoModel.addTask('Task 3', undefined, undefined, TASK_PRIORITIES.LOW);

      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(3);
      expect(tasks.every(task => !task.completed)).toBe(true);

      // Bulk complete first two tasks
      const taskIds = [tasks[0].id, tasks[1].id];
      controller.handleBulkComplete(taskIds);

      const updatedTasks = todoModel.getTasks();
      expect(updatedTasks[0].completed).toBe(true);
      expect(updatedTasks[1].completed).toBe(true);
      expect(updatedTasks[2].completed).toBe(false);
    });

    test('should not affect already completed tasks', () => {
      // Add tasks and complete one
      todoModel.addTask('Task 1', undefined, undefined, TASK_PRIORITIES.HIGH);
      todoModel.addTask('Task 2', undefined, undefined, TASK_PRIORITIES.MEDIUM);

      const tasks = todoModel.getTasks();
      todoModel.toggleTask(tasks[0].id); // Complete first task

      // Try bulk complete both tasks
      const taskIds = [tasks[0].id, tasks[1].id];
      controller.handleBulkComplete(taskIds);

      const updatedTasks = todoModel.getTasks();
      expect(updatedTasks[0].completed).toBe(true); // Already completed
      expect(updatedTasks[1].completed).toBe(true); // Newly completed
    });

    test('should handle empty task list gracefully', () => {
      expect(() => {
        controller.handleBulkComplete([]);
      }).not.toThrow();

      expect(() => {
        controller.handleBulkComplete(['nonexistent-id']);
      }).not.toThrow();
    });
  });

  describe('Bulk Delete Functionality', () => {
    test('should delete multiple tasks', () => {
      // Add some tasks
      todoModel.addTask('Task 1', undefined, undefined, TASK_PRIORITIES.HIGH);
      todoModel.addTask('Task 2', undefined, undefined, TASK_PRIORITIES.MEDIUM);
      todoModel.addTask('Task 3', undefined, undefined, TASK_PRIORITIES.LOW);

      const tasks = todoModel.getTasks();
      expect(tasks).toHaveLength(3);

      // Bulk delete first two tasks
      const taskIds = [tasks[0].id, tasks[1].id];
      controller.handleBulkDelete(taskIds);

      const remainingTasks = todoModel.getTasks();
      expect(remainingTasks).toHaveLength(1);
      expect(remainingTasks[0].id).toBe(tasks[2].id);
    });

    test('should handle deletion of completed and incomplete tasks', () => {
      // Add tasks and complete one
      todoModel.addTask('Task 1', undefined, undefined, TASK_PRIORITIES.HIGH);
      todoModel.addTask('Task 2', undefined, undefined, TASK_PRIORITIES.MEDIUM);

      const tasks = todoModel.getTasks();
      todoModel.toggleTask(tasks[0].id); // Complete first task

      // Delete both tasks
      const taskIds = [tasks[0].id, tasks[1].id];
      controller.handleBulkDelete(taskIds);

      const remainingTasks = todoModel.getTasks();
      expect(remainingTasks).toHaveLength(0);
    });
  });

  describe('Task Reordering Functionality', () => {
    test('should reorder tasks correctly', () => {
      // Add tasks in order
      todoModel.addTask('First Task', undefined, undefined, TASK_PRIORITIES.HIGH);
      todoModel.addTask('Second Task', undefined, undefined, TASK_PRIORITIES.MEDIUM);
      todoModel.addTask('Third Task', undefined, undefined, TASK_PRIORITIES.LOW);

      const initialTasks = todoModel.getTasks();
      expect(initialTasks[0].title).toBe('Third Task'); // Most recent first
      expect(initialTasks[1].title).toBe('Second Task');
      expect(initialTasks[2].title).toBe('First Task');

      // Move first task to third position (index 0 to index 2)
      controller.handleReorderTasks(0, 2);

      const reorderedTasks = todoModel.getTasks();
      expect(reorderedTasks[0].title).toBe('Second Task');
      expect(reorderedTasks[1].title).toBe('First Task');
      expect(reorderedTasks[2].title).toBe('Third Task');
    });

    test('should handle invalid reorder indices gracefully', () => {
      todoModel.addTask('Task 1');
      todoModel.addTask('Task 2');

      const initialTasks = todoModel.getTasks();
      const initialLength = initialTasks.length;

      // Test invalid indices
      expect(() => {
        controller.handleReorderTasks(-1, 0);
      }).not.toThrow();

      expect(() => {
        controller.handleReorderTasks(0, 10);
      }).not.toThrow();

      expect(() => {
        controller.handleReorderTasks(0, 0);
      }).not.toThrow();

      // Tasks should remain unchanged
      expect(todoModel.getTasks()).toHaveLength(initialLength);
    });
  });

  describe('Controller Integration Tests', () => {
    test('should handle bulk actions without throwing errors', () => {
      // Add tasks
      todoModel.addTask('Task 1');
      todoModel.addTask('Task 2');
      
      const tasks = todoModel.getTasks();
      const taskIds = tasks.map(task => task.id);
      
      // Test that methods exist and don't throw
      expect(() => controller.handleBulkComplete(taskIds)).not.toThrow();
      expect(() => controller.handleBulkDelete(taskIds)).not.toThrow();
      expect(() => controller.handleReorderTasks(0, 1)).not.toThrow();
    });
    
    test('should properly expose bulk selection state creation method', () => {
      // Test that the method exists (without calling it since it uses React hooks)
      expect(typeof controller.createBulkSelectionState).toBe('function');
    });
  });
});