import React from 'react';
import { useToast, type Toast } from '../contexts/ToastContext';
import {
  ToastContainer as StyledToastContainer,
  ToastItem,
  ToastContent,
  ToastIcon,
  ToastMessage,
  ToastActions,
  ToastActionButton,
  ToastCloseButton,
} from '../styles/styles';

const ToastComponent: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { hideToast } = useToast();

  return (
    <ToastItem $type={toast.type}>
      <ToastContent>
        <ToastIcon $type={toast.type} />
        <ToastMessage>{toast.message}</ToastMessage>
      </ToastContent>
      <ToastActions>
        {toast.action && (
          <ToastActionButton onClick={toast.action.onClick}>
            {toast.action.label}
          </ToastActionButton>
        )}
        <ToastCloseButton 
          onClick={() => hideToast(toast.id)}
          title="Close"
        />
      </ToastActions>
    </ToastItem>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <StyledToastContainer>
      {toasts.map(toast => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
    </StyledToastContainer>
  );
};