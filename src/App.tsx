import { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

type TaskFilter = 'all' | 'active' | 'done';

// Animations
const floatingAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe);
    background-size: 400% 400%;
    animation: ${floatingAnimation} 15s ease-in-out infinite;
    min-height: 100vh;
    color: #2d3748;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 105, 180, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 193, 7, 0.2) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }

  #root {
    position: relative;
    z-index: 2;
  }
`;

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.5);
  }
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  margin: 0 0 0.5rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #ffffff, #f0f9ff, #e0f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  font-weight: 400;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 1.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.5);
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`;

const Input = styled.input`
  padding: 0.875rem 1.125rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: #2d3748;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  
  &::placeholder {
    color: rgba(45, 55, 72, 0.6);
    font-weight: 400;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(31, 38, 135, 0.3);
  }
`;

const Select = styled.select`
  padding: 0.875rem 1.125rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: #2d3748;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  font-weight: 500;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(31, 38, 135, 0.3);
  }

  option {
    background: #ffffff;
    color: #2d3748;
    font-weight: 500;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-transform: capitalize;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return `
          background: rgba(255, 255, 255, 0.2);
          color: #4a5568;
          border: 2px solid rgba(255, 255, 255, 0.3);
          
          &:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
            box-shadow: 0 4px 20px rgba(31, 38, 135, 0.3);
          }
        `;
      case 'success':
        return `
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          
          &:hover {
            background: linear-gradient(135deg, #38a169, #2f855a);
            box-shadow: 0 4px 20px rgba(72, 187, 120, 0.4);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #f56565, #e53e3e);
          color: white;
          
          &:hover {
            background: linear-gradient(135deg, #e53e3e, #c53030);
            box-shadow: 0 4px 20px rgba(245, 101, 101, 0.4);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          
          &:hover {
            background: linear-gradient(135deg, #764ba2, #667eea);
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
          }
        `;
    }
  }}
`;

const TaskItem = styled.div<{ $completed: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${({ $completed }) => $completed ? 0.7 : 1};
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(4px);
    border-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 640px) {
    padding: 1rem;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const TaskContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TaskTitle = styled.h3<{ $completed: boolean }>`
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 600;
  text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
  word-break: break-word;
  margin-bottom: 0.5rem;
`;

const TaskDescription = styled.p<{ $completed: boolean }>`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.5;
  text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
  word-break: break-word;
  margin-bottom: 0.5rem;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  flex-wrap: wrap;
`;

const PriorityBadge = styled.span<{ $color: string }>`
  background: ${({ $color }) => $color};
  color: white;
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  animation: ${pulse} 2s ease-in-out infinite;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
  flex-shrink: 0;

  @media (max-width: 640px) {
    margin-left: 0;
    justify-content: flex-end;
  }
`;

const SearchInput = styled(Input)`
  margin-bottom: 1rem;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (min-width: 640px) {
    justify-content: flex-start;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${floatingAnimation} 3s ease-in-out infinite;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.6;
`;

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('todos');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
        localStorage.removeItem('todos');
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(tasks));
  }, [tasks]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };

    setTasks(prevTasks => [newTask, ...prevTasks]);
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  const toggleTask = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffd43b';
      case 'low': return '#51cf66';
      default: return '#adb5bd';
    }
  };

  const filteredAndSearchedTasks = tasks
    .filter(task => {
      switch (filter) {
        case 'active': return !task.completed;
        case 'done': return task.completed;
        default: return true;
      }
    })
    .filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      // Sort by completion status first (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      // Finally by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const taskStats = {
    total: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>✨ Todo Master</Title>
          <Subtitle>Organize your life, one task at a time</Subtitle>
        </Header>
        
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

        {tasks.length > 0 && (
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
        )}
        
        <Card>
          {filteredAndSearchedTasks.length === 0 && tasks.length > 0 ? (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle>No tasks found</EmptyTitle>
              <EmptyDescription>
                Try adjusting your search or filter criteria
              </EmptyDescription>
            </EmptyState>
          ) : filteredAndSearchedTasks.length === 0 ? (
            <EmptyState>
              <EmptyIcon>✨</EmptyIcon>
              <EmptyTitle>All caught up!</EmptyTitle>
              <EmptyDescription>
                No tasks here. Time to add something new or enjoy the moment!
              </EmptyDescription>
            </EmptyState>
          ) : (
            filteredAndSearchedTasks.map(task => (
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
            ))
          )}
        </Card>
      </Container>
    </>
  );
}

export default App;