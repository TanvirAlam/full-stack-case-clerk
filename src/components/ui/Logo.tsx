import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import logoSvg from '../../assets/logo.svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LogoContainer = styled.div<{ $size: string; $animated: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          width: 24px;
          height: 24px;
        `;
      case 'md':
        return css`
          width: 32px;
          height: 32px;
        `;
      case 'lg':
        return css`
          width: 48px;
          height: 48px;
        `;
      case 'xl':
        return css`
          width: 64px;
          height: 64px;
        `;
      default:
        return css`
          width: 32px;
          height: 32px;
        `;
    }
  }}
  
  ${({ $animated }) => $animated && css`
    animation: ${pulse} 2s ease-in-out infinite;
    cursor: pointer;
    
    &:hover {
      animation: ${rotate} 0.5s ease-in-out;
    }
  `}
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2));
`;

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  animated = false,
  className,
}) => {
  return (
    <LogoContainer $size={size} $animated={animated} className={className}>
      <LogoImage src={logoSvg} alt="A" />
    </LogoContainer>
  );
};

export default Logo;