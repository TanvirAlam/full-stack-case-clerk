import styled, { keyframes, css } from 'styled-components';

// Animations
export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const slideInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

export const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Layout Components
export const AppContainer = styled.div`
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

export const Header = styled.header`
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

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 640px) {
    max-width: 100%;
    padding: 0 0.5rem;
  }
`;

export const Main = styled.main`
  padding: 1rem 1.5rem 3rem;
  
  @media (min-width: 640px) {
    padding: 2rem 2rem 4rem;
  }
  
  @media (min-width: 1024px) {
    padding: 3rem 2.5rem 5rem;
  }
`;

// Title Section
export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 0 0 1.5rem 0;
  animation: ${slideInDown} 0.6s ease-out;
  
  @media (min-width: 640px) {
    justify-content: flex-start;
  }
`;

export const Title = styled.h1`
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

// Form Components
export const TaskForm = styled.form`
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
  animation: ${fadeInUp} 0.6s ease-out 0.2s both;
  
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
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    align-self: flex-end;
    min-width: 140px;
  }
`;

export const Input = styled.input`
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

export const Select = styled.select`
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

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
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
        return css`
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
          }
        `;
      case 'secondary':
        return css`
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
        return css`
          background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
          }
        `;
    }
  }}
`;

// Filter Components
export const SearchInput = styled(Input)`
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

export const FilterButtons = styled.div`
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

// Task Components
export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    gap: 2rem;
  }
`;

export const TaskCard = styled.div<{ completed: boolean }>`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  animation: ${slideInUp} 0.4s ease-out;
  
  ${({ completed }) => completed && css`
    opacity: 0.75;
    background: rgba(249, 250, 251, 0.9);
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 35px -5px rgba(0, 0, 0, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.04);
  }
  
  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

export const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const TaskTitle = styled.h3<{ completed: boolean }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  
  ${({ completed }) => completed && css`
    text-decoration: line-through;
  `}
`;

export const TaskSubtitle = styled.p<{ completed: boolean }>`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
  
  ${({ completed }) => completed && css`
    text-decoration: line-through;
  `}
`;

export const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// Priority Badge
export const PriorityBadge = styled.span<{ priority: 'low' | 'medium' | 'high' }>`
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
        return css`
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        `;
      case 'medium':
        return css`
          background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 167, 38, 0.3);
        `;
      case 'low':
        return css`
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

// Empty State
export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  animation: ${fadeInUp} 0.6s ease-out 0.4s both;
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
    color: #6b7280;
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