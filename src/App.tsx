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
import { APP_CONFIG } from './utils/const';
import { ToastProvider } from './contexts/ToastContext';
import { UndoProvider } from './contexts/UndoContext';
import { ToastContainer } from './components/ToastContainer';

const AppContent: React.FC<{ model: TodoModel }> = ({ model }) => {
  
  const {
    title,
    setTitle,
    subtitle,
    setSubtitle,
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
    handleUpdateTask,
    
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    handleUpdateSubtask,
  } = useTodoController(model);

  return (
    <Container>
      <HeaderView 
        title={APP_CONFIG.TITLE}
        subtitle={APP_CONFIG.SUBTITLE}
      />
      <TaskFormView
        title={title}
        subtitle={subtitle}
        description={description}
        priority={priority}
        onTitleChange={setTitle}
        onSubtitleChange={setSubtitle}
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
        onAddSubtask={handleAddSubtask}
        onToggleSubtask={handleToggleSubtask}
        onDeleteSubtask={handleDeleteSubtask}
      />
    </Container>
  );
};

function App() {
  const model = useMemo(() => new TodoModel(), []);

  return (
    <ToastProvider>
      <UndoProvider>
        <>
          <GlobalStyle />
          <AppContent model={model} />
          <ToastContainer />
        </>
      </UndoProvider>
    </ToastProvider>
  );
}

export default App;
