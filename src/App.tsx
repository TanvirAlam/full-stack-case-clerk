import { useMemo } from 'react';
import { GlobalStyle, Container } from './styles/styles';
import { TodoModel } from './models/TodoModel';
import { useTodoController } from './controllers/TodoController';
import {
  HeaderView,
  TaskFormView,
  FiltersView,
  TaskListView,
} from './views/TodoViews';

function App() {
  const model = useMemo(() => new TodoModel(), []);
  
  const {
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
    
    taskStats,
    isEmpty,
    filteredTasks,

    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
  } = useTodoController(model);

  return (
    <>
      <GlobalStyle />
      <Container>
        <HeaderView 
          title="✨ Todo Master"
          subtitle="Organize your life, one task at a time"
        />
        <TaskFormView
          title={title}
          description={description}
          priority={priority}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onPriorityChange={setPriority}
          onSubmit={handleAddTask}
        />
        <FiltersView
          searchQuery={searchQuery}
          filter={filter}
          taskStats={taskStats}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilter}
          hasAnyTasks={!isEmpty}
        />
        <TaskListView
          tasks={filteredTasks}
          hasAnyTasks={!isEmpty}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      </Container>
    </>
  );
}

export default App;