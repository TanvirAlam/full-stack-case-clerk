import React from 'react';
import styled, { css } from 'styled-components';
import { Priority } from '../../types';
import { getPriorityColor } from '../../utils';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const Badge = styled.span<{ 
  priority: Priority; 
  size: 'sm' | 'md';
  showLabel: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${showLabel => showLabel ? '0.125rem 0.5rem' : '0.25rem'};
          font-size: ${theme.typography.fontSizes.xs};
        `;
      case 'md':
      default:
        return css`
          padding: ${showLabel => showLabel ? '0.25rem 0.75rem' : '0.375rem'};
          font-size: ${theme.typography.fontSizes.sm};
        `;
    }
  }}
  
  ${({ priority, theme }) => {
    const color = getPriorityColor(priority);
    
    return css`
      background-color: ${color}15; /* 15% opacity */
      color: ${color};
      border: 1px solid ${color}30; /* 30% opacity */
    `;
  }}
`;

const Dot = styled.span<{ priority: Priority }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
  
  ${({ priority }) => {
    const color = getPriorityColor(priority);
    return css`
      background-color: ${color};
    `;
  }}
`;

const Label = styled.span`
  text-transform: capitalize;
`;

const getPriorityLabel = (priority: Priority): string => {
  switch (priority) {
    case Priority.HIGH:
      return 'High';
    case Priority.MEDIUM:
      return 'Medium';
    case Priority.LOW:
      return 'Low';
    default:
      return 'Medium';
  }
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  showLabel = true,
}) => {
  return (
    <Badge priority={priority} size={size} showLabel={showLabel}>
      <Dot priority={priority} />
      {showLabel && <Label>{getPriorityLabel(priority)}</Label>}
    </Badge>
  );
};

export default PriorityBadge;