import React from 'react';
import styled, { css } from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<{ 
  hasError?: boolean; 
  hasLeftIcon?: boolean; 
  hasRightIcon?: boolean;
}>`
  width: 100%;
  height: ${({ theme }) => theme.components.input.height.md};
  padding: ${({ theme }) => theme.components.input.padding};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.white};
  transition: all ${({ theme }) => theme.animations.durations.fast} ${({ theme }) => theme.animations.easings.easeOut};
  
  ${({ hasLeftIcon, theme }) => hasLeftIcon && css`
    padding-left: ${theme.spacing[10]};
  `}
  
  ${({ hasRightIcon, theme }) => hasRightIcon && css`
    padding-right: ${theme.spacing[10]};
  `}
  
  ${({ hasError, theme }) => hasError && css`
    border-color: ${theme.colors.error[500]};
    
    &:focus {
      border-color: ${theme.colors.error[500]};
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const IconWrapper = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  ${({ position }) => position}: ${({ theme }) => theme.spacing[3]};
  display: flex;
  align-items: center;
  pointer-events: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  return (
    <InputContainer fullWidth={fullWidth} className={className}>
      {label && <Label>{label}</Label>}
      <InputWrapper>
        {leftIcon && (
          <IconWrapper position="left">{leftIcon}</IconWrapper>
        )}
        <StyledInput
          hasError={!!error}
          hasLeftIcon={!!leftIcon}
          hasRightIcon={!!rightIcon}
          {...props}
        />
        {rightIcon && (
          <IconWrapper position="right">{rightIcon}</IconWrapper>
        )}
      </InputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default Input;