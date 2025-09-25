import React, { useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import logoSvg from './assets/logo.svg'

// Types
interface Task {
  id: string;
  title: string;
  subtitle?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
}

// Simple Logo Component
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LogoContainer = styled.div<{ $size: string; $animated: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  ${({ $size }) => {
    switch ($size) {
      case 'lg': return css`width: 48px; height: 48px;`;
      case 'xl': return css`width: 64px; height: 64px;`;
      default: return css`width: 32px; height: 32px;`;
    }
  }}
  
  ${({ $animated }) => $animated && css`
    animation: ${pulse} 2s ease-in-out infinite;
    cursor: pointer;
    &:hover { animation: ${rotate} 0.5s ease-in-out; }
  `}
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2));
`;

const Logo: React.FC<{ size?: string; animated?: boolean }> = ({ size = 'md', animated = false }) => (
  <LogoContainer $size={size} $animated={animated}>
    <LogoImage src={logoSvg} alt="A" />
  </LogoContainer>
);

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
    z-index: -1;
    animation: float 20s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -30px) rotate(1deg); }
    66% { transform: translate(-20px, 20px) rotate(-1deg); }
  }
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  
  @media (min-width: 640px) {
    padding: 1.5rem 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 2rem 2.5rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 640px) {
    max-width: 100%;
    padding: 0 0.5rem;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 0 0 1.5rem 0;
  animation: slideInDown 0.6s ease-out;
  
  @media (min-width: 640px) {
    justify-content: flex-start;
  }
  
  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  
  @media (min-width: 640px) {
    font-size: 2.5rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 3rem;
  }
`;

const Main = styled.main`
  padding: 1rem 1.5rem 3rem;
  
  @media (min-width: 640px) {
    padding: 2rem 2rem 4rem;
  }
  
  @media (min-width: 1024px) {
    padding: 3rem 2.5rem 5rem;
  }
`;

const TaskForm = styled.form`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeInUp 0.6s ease-out 0.2s both;
  
  @media (min-width: 640px) {
    padding: 2rem;
    gap: 1.5rem;
  }
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: stretch;
    gap: 1rem;
  }
  
  @media (min-width: 1024px) {
    padding: 2.5rem;
    gap: 1.5rem;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    align-self: flex-end;
    min-width: 140px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 3.5rem;
  padding: 0 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.75rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 
      0 0 0 3px rgba(102, 126, 234, 0.1),
      0 4px 12px rgba(102, 126, 234, 0.15);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: rgba(107, 114, 128, 0.7);
  }
  
  @media (min-width: 640px) {
    font-size: 1.1rem;
  }
`;

const Select = styled.select`
  height: 3.5rem;
  padding: 0 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.75rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 
      0 0 0 3px rgba(102, 126, 234, 0.1),
      0 4px 12px rgba(102, 126, 234, 0.15);
    transform: translateY(-1px);
  }
  
  @media (min-width: 640px) {
    font-size: 1.1rem;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  height: 3.5rem;
  padding: 0 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;
  font-size: 1rem;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (min-width: 640px) {
    padding: 0 2rem;
    font-size: 1rem;
  }
  
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
          }
        `;
      case 'secondary':
        return `
          background: rgba(255, 255, 255, 0.9);
          color: #4a5568;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          &:hover {
            background: rgba(255, 255, 255, 1);
            border-color: rgba(102, 126, 234, 0.3);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
          }
        `;
    }
  }}
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    gap: 2rem;
  }
`;

const TaskCard = styled.div<{ completed: boolean }>`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  animation: slideInUp 0.4s ease-out;
  
  ${({ completed }) => completed && `
    opacity: 0.75;
    background: rgba(249, 250, 251, 0.9);
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 35px -5px rgba(0, 0, 0, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.04);
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const TaskTitle = styled.h3<{ completed: boolean }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
  
  ${({ completed }) => completed && `
    text-decoration: line-through;
  `}
`;

const TaskSubtitle = styled.p<{ completed: boolean }>`
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0.25rem 0 0 0;
  
  ${({ completed }) => completed && `
    text-decoration: line-through;
  `}
`;

const PriorityBadge = styled.span<{ priority: 'low' | 'medium' | 'high' }>`
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  transition: all 0.2s ease;
  cursor: default;
  
  &:hover {
    transform: scale(1.05);
  }
  
  ${({ priority }) => {
    switch (priority) {
      case 'high':
        return `
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        `;
      case 'medium':
        return `
          background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 167, 38, 0.3);
        `;
      case 'low':
        return `
          background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        `;
    }
  }}
  
  @media (min-width: 640px) {
    padding: 0.5rem 1.25rem;
    font-size: 0.875rem;
  }
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease-out 0.4s both;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }
  
  p {
    color: #6B7280;
    margin: 0;
    font-size: 1.1rem;
  }
  
  @media (min-width: 640px) {
    padding: 5rem 3rem;
    gap: 2rem;
    
    h3 {
      font-size: 1.75rem;
    }
    
    p {
      font-size: 1.2rem;
    }
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (min-width: 640px) {
    justify-content: flex-start;
    gap: 1rem;
  }
`;

const SearchInput = styled(Input)`
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.4);
  
  &:focus {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(102, 126, 234, 0.6);
    box-shadow: 
      0 0 0 3px rgba(102, 126, 234, 0.15),
      0 8px 25px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }
`;

// Helper functions
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const saveToStorage = (tasks: Task[]) => {
  localStorage.setItem('todo-tasks', JSON.stringify(tasks));
};

const loadFromStorage = (): Task[] => {
  try {
    const saved = localStorage.getItem('todo-tasks');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
  return [];
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskSubtitle, setNewTaskSubtitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = loadFromStorage();
    setTasks(savedTasks);
  }, []);
  
  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    saveToStorage(tasks);
  }, [tasks]);
  
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: generateId(),
      title: newTaskTitle.trim(),
      subtitle: newTaskSubtitle.trim() || undefined,
      priority: newTaskPriority,
      completed: false,
      createdAt: new Date(),
    };
    
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskSubtitle('');
    setNewTaskPriority('medium');
  };
  
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };
  
  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by completion status
    if (filter === 'active' && task.completed) return false;
    if (filter === 'done' && !task.completed) return false;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        (task.subtitle && task.subtitle.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Sort tasks (active first, then by creation date)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  
  return (
    <AppContainer>
      <Header>
        <Container>
          <TitleSection>
            <Logo size="xl" animated />
            <Title>Todo App</Title>
          </TitleSection>
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
              All ({tasks.length})
            </Button>
            <Button
              variant={filter === 'active' ? 'primary' : 'secondary'}
              onClick={() => setFilter('active')}
            >
              Active ({tasks.filter(t => !t.completed).length})
            </Button>
            <Button
              variant={filter === 'done' ? 'primary' : 'secondary'}
              onClick={() => setFilter('done')}
            >
              Done ({tasks.filter(t => t.completed).length})
            </Button>
          </FilterButtons>
        </Container>
      </Header>
      
      <Main>
        <Container>
          <TaskForm onSubmit={addTask}>
            <FormGroup>
              <Input
                type="text"
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                placeholder="Add a subtitle (optional)"
                value={newTaskSubtitle}
                onChange={(e) => setNewTaskSubtitle(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </Select>
            </FormGroup>
            <ButtonGroup>
              <Button type="submit">
                Add Task
              </Button>
            </ButtonGroup>
          </TaskForm>
          
          {sortedTasks.length === 0 ? (
            <EmptyState>
              <Logo size="lg" animated />
              <h3>
                {searchQuery ? 'No tasks found' : filter === 'all' ? 'No tasks yet' : filter === 'active' ? 'No active tasks' : 'No completed tasks'}
              </h3>
              <p>
                {searchQuery ? 'Try a different search term' : filter === 'all' ? 'Create your first task above!' : ''}
              </p>
            </EmptyState>
          ) : (
            <TaskList>
              {sortedTasks.map((task) => (
                <TaskCard key={task.id} completed={task.completed}>
                  <TaskHeader>
                    <div>
                      <TaskTitle completed={task.completed}>
                        {task.title}
                      </TaskTitle>
                      {task.subtitle && (
                        <TaskSubtitle completed={task.completed}>
                          {task.subtitle}
                        </TaskSubtitle>
                      )}
                    </div>
                    <PriorityBadge priority={task.priority}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </PriorityBadge>
                  </TaskHeader>
                  
                  <TaskActions>
                    <Button
                      variant={task.completed ? 'secondary' : 'primary'}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed ? '✓ Completed' : 'Mark Done'}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </TaskActions>
                </TaskCard>
              ))}
            </TaskList>
          )}
        </Container>
      </Main>
    </AppContainer>
  )
}

export default App
