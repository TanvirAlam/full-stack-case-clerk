import React, { useState } from 'react';
import { 
  TaskForm as StyledTaskForm,
  FormGroup,
  ButtonGroup,
  Input,
  Select,
  Button
} from '../styles/components';

interface TaskFormProps {
  onSubmit: (title: string, subtitle?: string, priority?: 'low' | 'medium' | 'high') => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit(title, subtitle, priority);
    setTitle('');
    setSubtitle('');
    setPriority('medium');
  };

  return (
    <StyledTaskForm onSubmit={handleSubmit}>
      <FormGroup>
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Input
          type="text"
          placeholder="Add a subtitle (optional)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
      </FormGroup>
      
      <FormGroup>
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
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
    </StyledTaskForm>
  );
};

export default TaskForm;