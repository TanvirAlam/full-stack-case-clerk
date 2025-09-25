import type { Task, TaskFilter, TaskStats } from '../types/types';
import { getPriorityColor } from '../utils/utils';
import {
  PLACEHOLDERS,
  BUTTON_LABELS,
  FILTER_LABELS,
  EMPTY_STATE,
  TASK_PRIORITIES,
  TASK_FILTERS,
  INPUT_TYPES,
  BUTTON_VARIANTS,
  CSS_VALUES,
} from '../utils/const';
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
          type={INPUT_TYPES.TEXT}
          placeholder={PLACEHOLDERS.TASK_TITLE}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />
        <Input
          type={INPUT_TYPES.TEXT}
          placeholder={PLACEHOLDERS.TASK_DESCRIPTION}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </InputGroup>
      <InputGroup style={{ minWidth: CSS_VALUES.MIN_WIDTH_140 }}>
        <Select 
          value={priority} 
          onChange={(e) => onPriorityChange(e.target.value as 'low' | 'medium' | 'high')}
        >
          <option value={TASK_PRIORITIES.LOW}>{BUTTON_LABELS.LOW_PRIORITY}</option>
          <option value={TASK_PRIORITIES.MEDIUM}>{BUTTON_LABELS.MEDIUM_PRIORITY}</option>
          <option value={TASK_PRIORITIES.HIGH}>{BUTTON_LABELS.HIGH_PRIORITY}</option>
        </Select>
        <Button type={INPUT_TYPES.SUBMIT}>{BUTTON_LABELS.ADD_TASK}</Button>
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
        type={INPUT_TYPES.TEXT}
        placeholder={PLACEHOLDERS.SEARCH_TASKS}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      <FilterButtons>
        <Button
          variant={filter === TASK_FILTERS.ALL ? BUTTON_VARIANTS.PRIMARY : BUTTON_VARIANTS.SECONDARY}
          onClick={() => onFilterChange(TASK_FILTERS.ALL)}
        >
          {FILTER_LABELS.ALL} ({taskStats.total})
        </Button>
        
        <Button
          variant={filter === TASK_FILTERS.ACTIVE ? BUTTON_VARIANTS.PRIMARY : BUTTON_VARIANTS.SECONDARY}
          onClick={() => onFilterChange(TASK_FILTERS.ACTIVE)}
        >
          {FILTER_LABELS.ACTIVE} ({taskStats.active})
        </Button>
        
        <Button
          variant={filter === TASK_FILTERS.DONE ? BUTTON_VARIANTS.PRIMARY : BUTTON_VARIANTS.SECONDARY}
          onClick={() => onFilterChange(TASK_FILTERS.DONE)}
        >
          {FILTER_LABELS.DONE} ({taskStats.completed})
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
        variant={task.completed ? BUTTON_VARIANTS.SECONDARY : BUTTON_VARIANTS.SUCCESS}
        onClick={() => onToggle(task.id)}
      >
        {task.completed ? BUTTON_LABELS.UNDO : BUTTON_LABELS.COMPLETE}
      </Button>
      <Button
        variant={BUTTON_VARIANTS.DANGER}
        onClick={() => onDelete(task.id)}
      >
        {BUTTON_LABELS.DELETE}
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
        <EmptyIcon>{EMPTY_STATE.NO_TASKS.ICON}</EmptyIcon>
        <EmptyTitle>{EMPTY_STATE.NO_TASKS.TITLE}</EmptyTitle>
        <EmptyDescription>
          {EMPTY_STATE.NO_TASKS.DESCRIPTION}
        </EmptyDescription>
      </EmptyState>
    );
  }

  return (
    <EmptyState>
      <EmptyIcon>{EMPTY_STATE.NO_SEARCH_RESULTS.ICON}</EmptyIcon>
      <EmptyTitle>{EMPTY_STATE.NO_SEARCH_RESULTS.TITLE}</EmptyTitle>
      <EmptyDescription>
        {EMPTY_STATE.NO_SEARCH_RESULTS.DESCRIPTION}
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