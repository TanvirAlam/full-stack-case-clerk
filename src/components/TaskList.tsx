import React from 'react';
import { Task } from '../types';
import {
  TaskItem,
  TaskContent,
  TaskText,
  TaskTitle,
  TaskDescription,
  PriorityBadge,
  TaskMeta,
  TaskActions,
  Button,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from '../styles/components';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
}) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffd43b';
      case 'low': return '#51cf66';
      default: return '#adb5bd';
    }
  };

  if (tasks.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>✨</EmptyIcon>
        <EmptyTitle>All caught up!</EmptyTitle>
        <EmptyDescription>
          No tasks here. Time to add something new or enjoy the moment!
        </EmptyDescription>
      </EmptyState>
    );
  }

  return (
    <>
      {tasks.map((task) => (
        <TaskItem key={task.id} $completed={task.completed}>
          <TaskContent>
            <TaskText>
              <TaskTitle $completed={task.completed}>
                {task.title}
              </TaskTitle>
              {task.description && (
                <TaskDescription $completed={task.completed}>
                  {task.description}
                </TaskDescription>
              )}
              <TaskMeta>
                <PriorityBadge $color={getPriorityColor(task.priority)}>
                  {task.priority}
                </PriorityBadge>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </TaskMeta>
            </TaskText>
          </TaskContent>
          
          <TaskActions>
            <Button
              variant={task.completed ? 'secondary' : 'success'}
              onClick={() => onToggleTask(task.id)}
            >
              {task.completed ? '↶' : '✓'}
            </Button>
            <Button
              variant="danger"
              onClick={() => onDeleteTask(task.id)}
            >
              🗑
            </Button>
          </TaskActions>
        </TaskItem>
      ))}
    </>
  );
};

export default TaskList;