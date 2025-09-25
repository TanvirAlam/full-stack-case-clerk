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
    // Form state
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    
    // Filter state
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    
    // Model state
    taskStats,
    isEmpty,
    filteredTasks,
    
    // Actions
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
  } = useTodoController(model);

  return (
    <>
      <GlobalStyle />
      <Container>
        {/* Header View - Static presentation */}
        <HeaderView 
          title="✨ Todo Master"
          subtitle="Organize your life, one task at a time"
        />
        
        {/* Task Form View - Form state management */}
        <TaskFormView
          title={title}
          description={description}
          priority={priority}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onPriorityChange={setPriority}
          onSubmit={handleAddTask}
        />
        
        {/* Filters View - Filter state and actions */}
        <FiltersView
          searchQuery={searchQuery}
          filter={filter}
          taskStats={taskStats}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilter}
          hasAnyTasks={!isEmpty}
        />
        
        {/* Task List View - Data presentation and task actions */}
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