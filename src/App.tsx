import React from 'react';
import { useTodos } from './hooks/useTodos';
import { Logo } from './components/Logo';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { GlobalStyle, Container, Header, Title, Subtitle, Card } from './styles/components';

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

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>
            <Logo size={48} animated />
            Todo Master
          </Title>
          <Subtitle>Organize your life, one task at a time</Subtitle>
        </Header>
        
        <Card>
          <TaskForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            priority={priority}
            setPriority={setPriority}
            onSubmit={addTask}
          />
        </Card>

        {tasks.length > 0 && (
          <Card>
            <TaskFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filter={filter}
              onFilterChange={setFilter}
              taskStats={taskStats}
            />
          </Card>
        )}
        
        <Card>
          <TaskList
            tasks={filteredAndSearchedTasks}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        </Card>
      </Container>
    </>
  );
}

export default App;