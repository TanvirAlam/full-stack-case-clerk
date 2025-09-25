import { useMemo } from 'react';
import { GlobalStyle, Container } from './styles/styles';
import { TodoModel } from './models/TodoModel';
import { useTodoController } from './controllers/TodoController';
import {
  HeaderView,
  TaskFormView,
  FiltersView,
  BulkActionsView,
  DraggableTaskListView,
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
    
    // Bulk selection state
    selectedTaskIds,
    isSelectionMode,
    selectedCount,
    toggleSelection,
    selectAll,
    clearSelection,
    toggleSelectionMode,
    
    taskStats,
    isEmpty,
    filteredTasks,

    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    
    // Bulk actions
    handleBulkComplete,
    handleBulkDelete,
    
    // Drag and drop
    handleReorderTasks,
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
      <BulkActionsView
        selectedCount={selectedCount}
        isSelectionMode={isSelectionMode}
        onToggleSelectionMode={toggleSelectionMode}
        onSelectAll={() => selectAll(filteredTasks.map(task => task.id))}
        onClearSelection={clearSelection}
        onBulkComplete={() => {
          handleBulkComplete(Array.from(selectedTaskIds));
          clearSelection();
        }}
        onBulkDelete={() => {
          handleBulkDelete(Array.from(selectedTaskIds));
          clearSelection();
        }}
        totalVisibleTasks={filteredTasks.length}
      />
      <DraggableTaskListView
        tasks={filteredTasks}
        hasAnyTasks={!isEmpty}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onAddSubtask={handleAddSubtask}
        onToggleSubtask={handleToggleSubtask}
        onDeleteSubtask={handleDeleteSubtask}
        isSelectionMode={isSelectionMode}
        selectedTaskIds={selectedTaskIds}
        onToggleSelection={toggleSelection}
        onReorderTasks={handleReorderTasks}
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
