import type { Task } from './types';
import { useTodos } from './hooks';
import { getPriorityColor } from './utils';
import {
  GlobalStyle,
  Container,
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
} from './styles';

function App() {
  const {
    tasks,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    addTask,
    toggleTask,
    deleteTask,
    filteredAndSearchedTasks,
    taskStats,
  } = useTodos();

  const renderEmptyState = () => {
    if (filteredAndSearchedTasks.length === 0 && tasks.length > 0) {
      return (
        <EmptyState>
          <EmptyIcon>🔍</EmptyIcon>
          <EmptyTitle>No tasks found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your search or filter criteria
          </EmptyDescription>
        </EmptyState>
      );
    }

    if (filteredAndSearchedTasks.length === 0) {
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

    return null;
  };

  const renderTaskForm = () => (
    <Card>
      <Form onSubmit={addTask}>
        <InputGroup>
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Add a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </InputGroup>
        <InputGroup style={{ minWidth: '140px' }}>
          <Select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
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

  const renderFilters = () => (
    tasks.length > 0 && (
      <Card>
        <SearchInput
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <FilterButtons>
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            All ({taskStats.total})
          </Button>
          
          <Button
            variant={filter === 'active' ? 'primary' : 'secondary'}
            onClick={() => setFilter('active')}
          >
            Active ({taskStats.active})
          </Button>
          
          <Button
            variant={filter === 'done' ? 'primary' : 'secondary'}
            onClick={() => setFilter('done')}
          >
            Done ({taskStats.completed})
          </Button>
        </FilterButtons>
      </Card>
    )
  );

  const renderTask = (task: Task) => (
    <TaskItem key={task.id} $completed={task.completed}>
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
          onClick={() => toggleTask(task.id)}
        >
          {task.completed ? '↶' : '✓'}
        </Button>
        <Button
          variant="danger"
          onClick={() => deleteTask(task.id)}
        >
          🗑
        </Button>
      </TaskActions>
    </TaskItem>
  );

  const renderTaskList = () => (
    <Card>
      {renderEmptyState() || filteredAndSearchedTasks.map(renderTask)}
    </Card>
  );

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>✨ Todo Master</Title>
          <Subtitle>Organize your life, one task at a time</Subtitle>
        </Header>
        
        {renderTaskForm()}
        {renderFilters()}
        {renderTaskList()}
      </Container>
    </>
  );
}

export default App;