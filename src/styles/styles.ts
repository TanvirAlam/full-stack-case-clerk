import styled, { createGlobalStyle, keyframes } from 'styled-components';

// Animations
export const floatingAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

export const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

// Global Styles
export const GlobalStyle = createGlobalStyle`
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

// Layout Components
export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
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

export const Title = styled.h1`
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

export const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  font-weight: 400;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

export const Card = styled.div`
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

// Form Components
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`;

export const Input = styled.input`
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

export const Select = styled.select`
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

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
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

// Task Components
export const TaskItem = styled.div<{ $completed: boolean }>`
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

export const TaskContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TaskTitle = styled.h3<{ $completed: boolean }>`
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 600;
  text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
  word-break: break-word;
  margin-bottom: 0.5rem;
`;

export const TaskDescription = styled.p<{ $completed: boolean }>`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.5;
  text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
  word-break: break-word;
  margin-bottom: 0.5rem;
`;

export const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  flex-wrap: wrap;
`;

export const PriorityBadge = styled.span<{ $color: string }>`
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

export const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
  flex-shrink: 0;

  @media (max-width: 640px) {
    margin-left: 0;
    justify-content: flex-end;
  }
`;

// Search and Filter Components
export const SearchInput = styled(Input)`
  margin-bottom: 1rem;
`;

export const FilterButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (min-width: 640px) {
    justify-content: flex-start;
  }
`;

// Empty State Components
export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

export const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${floatingAnimation} 3s ease-in-out infinite;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

export const EmptyDescription = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.6;
`;

// Subtask Components
export const SubtaskSection = styled.div`
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px solid rgba(255, 255, 255, 0.2);
`;

export const SubtaskToggle = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  margin-bottom: 0.75rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;

export const SubtaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const SubtaskItem = styled.div<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: ${({ $completed }) => $completed ? 0.6 : 1};
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

export const SubtaskContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

export const SubtaskTitle = styled.span<{ $completed: boolean }>`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
  word-break: break-word;
`;

export const SubtaskActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const SubtaskForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const SubtaskInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.1);
  color: #2d3748;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: rgba(45, 55, 72, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15);
  }
`;

export const SubtaskButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.7rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const SubtaskAddButton = styled(SubtaskButton)`
  background: linear-gradient(135deg, #48bb78, #38a169);
  
  &:hover {
    background: linear-gradient(135deg, #38a169, #2f855a);
  }
`;
