import { TodoModel } from '../models/TodoModel';

describe('Subtask Integration Test', () => {
  let todoModel: TodoModel;

  beforeEach(() => {
    localStorage.clear();
    todoModel = new TodoModel();
  });

  test('should be able to add, toggle, and delete subtasks', () => {
    // Add a main task
    todoModel.addTask('Main Task', undefined, 'Main task description');
    const tasks = todoModel.getTasks();
    expect(tasks).toHaveLength(1);
    
    const mainTaskId = tasks[0].id;
    
    // Add subtasks
    todoModel.addSubtask(mainTaskId, 'Subtask 1');
    todoModel.addSubtask(mainTaskId, 'Subtask 2');
    
    // Verify subtasks were added
    const updatedTasks = todoModel.getTasks();
    expect(updatedTasks[0].subtasks).toHaveLength(2);
    expect(updatedTasks[0].subtasks[0].title).toBe('Subtask 1');
    expect(updatedTasks[0].subtasks[1].title).toBe('Subtask 2');
    
    // Toggle subtask completion
    const subtask1Id = updatedTasks[0].subtasks[0].id;
    todoModel.toggleSubtask(mainTaskId, subtask1Id);
    
    const tasksAfterToggle = todoModel.getTasks();
    expect(tasksAfterToggle[0].subtasks[0].completed).toBe(true);
    expect(tasksAfterToggle[0].subtasks[1].completed).toBe(false);
    
    // Delete a subtask
    todoModel.deleteSubtask(mainTaskId, subtask1Id);
    
    const tasksAfterDelete = todoModel.getTasks();
    expect(tasksAfterDelete[0].subtasks).toHaveLength(1);
    expect(tasksAfterDelete[0].subtasks[0].title).toBe('Subtask 2');
  });

  test('should not add empty subtasks', () => {
    todoModel.addTask('Main Task');
    const mainTaskId = todoModel.getTasks()[0].id;
    
    // Try to add empty subtasks
    todoModel.addSubtask(mainTaskId, '');
    todoModel.addSubtask(mainTaskId, '   ');
    todoModel.addSubtask(mainTaskId, '\t\n');
    
    const tasks = todoModel.getTasks();
    expect(tasks[0].subtasks).toHaveLength(0);
  });

  test('should handle subtask operations on non-existent tasks gracefully', () => {
    const nonExistentTaskId = 'non-existent-task';
    
    expect(() => {
      todoModel.addSubtask(nonExistentTaskId, 'Subtask');
      todoModel.toggleSubtask(nonExistentTaskId, 'subtask-id');
      todoModel.deleteSubtask(nonExistentTaskId, 'subtask-id');
    }).not.toThrow();
    
    expect(todoModel.getTasks()).toHaveLength(0);
  });
});