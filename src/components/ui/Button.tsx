import React from 'react';
import styled, { css } from 'styled-components';
import { media } from '../../styles/theme';

// Button variants
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

// Base button styles
const BaseButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: all ${({ theme }) => theme.animations.durations.fast} ${({ theme }) => theme.animations.easings.easeOut};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  ${({ loading }) => loading && css`
    pointer-events: none;
    opacity: 0.7;
  `}
  
  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
  
  /* Size variants */
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return css`
          height: ${theme.components.button.height.sm};
          padding: ${theme.components.button.padding.sm};
          font-size: ${theme.typography.fontSizes.sm};
        `;
      case 'lg':
        return css`
          height: ${theme.components.button.height.lg};
          padding: ${theme.components.button.padding.lg};
          font-size: ${theme.typography.fontSizes.lg};
        `;
      case 'md':
      default:
        return css`
          height: ${theme.components.button.height.md};
          padding: ${theme.components.button.padding.md};
          font-size: ${theme.typography.fontSizes.md};
        `;
    }
  }}
  
  /* Color variants */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primary[500]};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[600]};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.primary[700]};
          }
        `;
        
      case 'secondary':
        return css`
          background-color: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[900]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[200]};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.gray[300]};
          }
        `;
        
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.gray[700]};
          border: 1px solid ${theme.colors.gray[300]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.gray[100]};
          }
        `;
        
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.gray[700]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[100]};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.gray[200]};
          }
        `;
        
      case 'danger':
        return css`
          background-color: ${theme.colors.error[500]};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.error[600]};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.error[700]};
          }
        `;
        
      default:
        return css`
          background-color: ${theme.colors.primary[500]};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[600]};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.primary[700]};
          }
        `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  
  svg {
    width: 1em;
    height: 1em;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}) => {
  return (
    <BaseButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && leftIcon && (
        <IconWrapper>{leftIcon}</IconWrapper>
      )}
      {children}
      {!loading && rightIcon && (
        <IconWrapper>{rightIcon}</IconWrapper>
      )}
    </BaseButton>
  );
};

export default Button;