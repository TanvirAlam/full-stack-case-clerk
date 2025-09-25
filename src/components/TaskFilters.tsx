import React from 'react';
import { TaskFilter } from '../types';
import { SearchInput, FilterButtons, Button } from '../styles/components';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  taskStats: {
    total: number;
    active: number;
    completed: number;
  };
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  taskStats,
}) => {
  return (
    <>
      <SearchInput
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      <FilterButtons>
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => onFilterChange('all')}
        >
          All ({taskStats.total})
        </Button>
        
        <Button
          variant={filter === 'active' ? 'primary' : 'secondary'}
          onClick={() => onFilterChange('active')}
        >
          Active ({taskStats.active})
        </Button>
        
        <Button
          variant={filter === 'done' ? 'primary' : 'secondary'}
          onClick={() => onFilterChange('done')}
        >
          Done ({taskStats.completed})
        </Button>
      </FilterButtons>
    </>
  );
};

export default TaskFilters;