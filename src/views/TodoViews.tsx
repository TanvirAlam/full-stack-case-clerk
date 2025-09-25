import type { Task, TaskFilter, TaskStats } from '../types/types';
import { getPriorityColor } from '../utils/utils';
import {
  Header,
  Title,
  Subtitle,
  Card,
  Form,
  InputGroup,
  Input,
  Select,
  Button,
  SearchInput,
  FilterButtons,
  TaskItem,
  TaskContent,
  TaskTitle,
  TaskDescription,
  TaskMeta,
  PriorityBadge,
  TaskActions,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from '../styles/styles';

// Header View
interface HeaderViewProps {
  title: string;
  subtitle: string;
}

export const HeaderView: React.FC<HeaderViewProps> = ({ title, subtitle }) => (
  <Header>
    <Title>{title}</Title>
    <Subtitle>{subtitle}</Subtitle>
  </Header>
);

// Task Form View
interface TaskFormViewProps {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: 'low' | 'medium' | 'high') => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TaskFormView: React.FC<TaskFormViewProps> = ({
  title,
  description,
  priority,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onSubmit,
}) => (
  <Card>
    <Form onSubmit={onSubmit}>
      <InputGroup>
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Add a description (optional)"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </InputGroup>
      <InputGroup style={{ minWidth: '140px' }}>
        <Select 
          value={priority} 
          onChange={(e) => onPriorityChange(e.target.value as 'low' | 'medium' | 'high')}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </Select>
        <Button type="submit">Add Task</Button>
      </InputGroup>
    </Form>
  </Card>
);

// Filters View
interface FiltersViewProps {
  searchQuery: string;
  filter: TaskFilter;
  taskStats: TaskStats;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: TaskFilter) => void;
  hasAnyTasks: boolean;
}

export const FiltersView: React.FC<FiltersViewProps> = ({
  searchQuery,
  filter,
  taskStats,
  onSearchChange,
  onFilterChange,
  hasAnyTasks,
}) => {
  if (!hasAnyTasks) return null;

  return (
    <Card>
      <SearchInput
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      <FilterButtons>
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => onFilterChange('all')}
        >
          All ({taskStats.total})
        </Button>
        
        <Button
          variant={filter === 'active' ? 'primary' : 'secondary'}
          onClick={() => onFilterChange('active')}
        >
          Active ({taskStats.active})
        </Button>
        
        <Button
          variant={filter === 'done' ? 'primary' : 'secondary'}
          onClick={() => onFilterChange('done')}
        >
          Done ({taskStats.completed})
        </Button>
      </FilterButtons>
    </Card>
  );
};

// Single Task View
interface TaskViewProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskView: React.FC<TaskViewProps> = ({ task, onToggle, onDelete }) => (
  <TaskItem $completed={task.completed}>
    <TaskContent>
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
    </TaskContent>
    
    <TaskActions>
      <Button
        variant={task.completed ? 'secondary' : 'success'}
        onClick={() => onToggle(task.id)}
      >
        {task.completed ? '↶' : '✓'}
      </Button>
      <Button
        variant="danger"
        onClick={() => onDelete(task.id)}
      >
        🗑
      </Button>
    </TaskActions>
  </TaskItem>
);

// Empty State View
interface EmptyStateViewProps {
  hasAnyTasks: boolean;
  hasFilteredTasks: boolean;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({
  hasAnyTasks,
  hasFilteredTasks,
}) => {
  if (hasFilteredTasks) return null;

  if (!hasAnyTasks) {
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
    <EmptyState>
      <EmptyIcon>🔍</EmptyIcon>
      <EmptyTitle>No tasks found</EmptyTitle>
      <EmptyDescription>
        Try adjusting your search or filter criteria
      </EmptyDescription>
    </EmptyState>
  );
};

// Task List View
interface TaskListViewProps {
  tasks: Task[];
  hasAnyTasks: boolean;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  hasAnyTasks,
  onToggleTask,
  onDeleteTask,
}) => (
  <Card>
    <EmptyStateView 
      hasAnyTasks={hasAnyTasks}
      hasFilteredTasks={tasks.length > 0}
    />
    {tasks.map(task => (
      <TaskView
        key={task.id}
        task={task}
        onToggle={onToggleTask}
        onDelete={onDeleteTask}
      />
    ))}
  </Card>
);