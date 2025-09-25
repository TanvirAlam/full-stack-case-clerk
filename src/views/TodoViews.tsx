import React, { useState } from 'react';
import type { Task, TaskFilter, TaskStats, Subtask } from '../types/types';
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
  SubtaskSection,
  SubtaskToggle,
  SubtaskList,
  SubtaskItem,
  SubtaskContent,
  SubtaskTitle,
  SubtaskActions,
  SubtaskForm,
  SubtaskInput,
  SubtaskButton,
  SubtaskAddButton,
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
  subtitle: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: 'low' | 'medium' | 'high') => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TaskFormView: React.FC<TaskFormViewProps> = ({
  title,
  subtitle,
  description,
  priority,
  onTitleChange,
  onSubtitleChange,
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
          placeholder={PLACEHOLDERS.TASK_SUBTITLE}
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
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

// Subtask View
interface SubtaskViewProps {
  subtask: Subtask;
  onToggle: (subtaskId: string) => void;
  onDelete: (subtaskId: string) => void;
}

export const SubtaskView: React.FC<SubtaskViewProps> = ({ subtask, onToggle, onDelete }) => (
  <SubtaskItem $completed={subtask.completed}>
    <SubtaskContent>
      <SubtaskTitle $completed={subtask.completed}>
        {subtask.title}
      </SubtaskTitle>
    </SubtaskContent>
    <SubtaskActions>
      <SubtaskButton
        onClick={() => onToggle(subtask.id)}
        title={subtask.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {subtask.completed ? BUTTON_LABELS.UNDO : BUTTON_LABELS.COMPLETE}
      </SubtaskButton>
      <SubtaskButton
        onClick={() => onDelete(subtask.id)}
        title="Delete subtask"
      >
        {BUTTON_LABELS.DELETE}
      </SubtaskButton>
    </SubtaskActions>
  </SubtaskItem>
);

// Subtask List View
interface SubtaskListViewProps {
  taskId: string;
  subtasks: Subtask[];
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}

export const SubtaskListView: React.FC<SubtaskListViewProps> = ({
  taskId,
  subtasks,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      onAddSubtask(taskId, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  if (subtasks.length === 0 && !isExpanded) {
    return (
      <SubtaskSection>
        <SubtaskToggle onClick={() => setIsExpanded(true)}>
          + Add subtask
        </SubtaskToggle>
      </SubtaskSection>
    );
  }

  return (
    <SubtaskSection>
      <SubtaskToggle onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? BUTTON_LABELS.HIDE_SUBTASKS : BUTTON_LABELS.SHOW_SUBTASKS}
        {subtasks.length > 0 && ` ${subtasks.length} subtask${subtasks.length !== 1 ? 's' : ''}`}
      </SubtaskToggle>
      
      {isExpanded && (
        <>
          <SubtaskForm onSubmit={handleSubmit}>
            <SubtaskInput
              type="text"
              placeholder={PLACEHOLDERS.SUBTASK_TITLE}
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
            />
            <SubtaskAddButton type="submit">
              {BUTTON_LABELS.ADD_SUBTASK}
            </SubtaskAddButton>
          </SubtaskForm>
          
          {subtasks.length > 0 && (
            <SubtaskList>
              {subtasks.map(subtask => (
                <SubtaskView
                  key={subtask.id}
                  subtask={subtask}
                  onToggle={(subtaskId) => onToggleSubtask(taskId, subtaskId)}
                  onDelete={(subtaskId) => onDeleteSubtask(taskId, subtaskId)}
                />
              ))}
            </SubtaskList>
          )}
        </>
      )}
    </SubtaskSection>
  );
};

// Single Task View
interface TaskViewProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask?: (taskId: string, subtaskId: string) => void;
}

export const TaskView: React.FC<TaskViewProps> = ({ 
  task, 
  onToggle, 
  onDelete, 
  onAddSubtask, 
  onToggleSubtask, 
  onDeleteSubtask 
}) => (
  <TaskItem $completed={task.completed}>
    <TaskContent>
      <TaskTitle $completed={task.completed}>
        {task.title}
      </TaskTitle>
      {task.subtitle && (
        <TaskDescription $completed={task.completed} style={{ fontWeight: 500, fontSize: '1rem', marginBottom: '0.25rem' }}>
          {task.subtitle}
        </TaskDescription>
      )}
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
      
      {onAddSubtask && onToggleSubtask && onDeleteSubtask && (
        <SubtaskListView
          taskId={task.id}
          subtasks={task.subtasks}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          onDeleteSubtask={onDeleteSubtask}
        />
      )}
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
  onAddSubtask?: (taskId: string, title: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask?: (taskId: string, subtaskId: string) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  hasAnyTasks,
  onToggleTask,
  onDeleteTask,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
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
        onAddSubtask={onAddSubtask}
        onToggleSubtask={onToggleSubtask}
        onDeleteSubtask={onDeleteSubtask}
      />
    ))}
  </Card>
);