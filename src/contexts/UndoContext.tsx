import React, { createContext, useContext, useCallback, useRef } from 'react';
import { useToast } from './ToastContext';

interface UndoAction {
  type: 'DELETE_TASK' | 'COMPLETE_TASK' | 'DELETE_SUBTASK' | 'COMPLETE_SUBTASK';
  data: any;
  undo: () => void;
}

interface UndoContextType {
  executeWithUndo: (action: () => void, undoAction: UndoAction, message: string) => void;
}

const UndoContext = createContext<UndoContextType | undefined>(undefined);

export const useUndo = () => {
  const context = useContext(UndoContext);
  if (!context) {
    throw new Error('useUndo must be used within an UndoProvider');
  }
  return context;
};

interface UndoProviderProps {
  children: React.ReactNode;
}

export const UndoProvider: React.FC<UndoProviderProps> = ({ children }) => {
  const { showToast, hideToast } = useToast();
  const currentUndoRef = useRef<{ action: UndoAction; toastId: string } | null>(null);

  const executeWithUndo = useCallback((
    action: () => void, 
    undoAction: UndoAction, 
    message: string
  ) => {
    // Execute the main action
    action();

    // Clear any existing undo action
    if (currentUndoRef.current) {
      hideToast(currentUndoRef.current.toastId);
    }

    // Show undo toast
    const toastId = Math.random().toString(36).substr(2, 9);
    
    showToast({
      type: 'info',
      message,
      duration: 5000, // 5 seconds to undo
      action: {
        label: 'Undo',
        onClick: () => {
          undoAction.undo();
          hideToast(toastId);
          currentUndoRef.current = null;
          
          // Show confirmation
          showToast({
            type: 'success',
            message: 'Action undone',
            duration: 2000,
          });
        },
      },
    });

    // Store current undo action
    currentUndoRef.current = { action: undoAction, toastId };

    // Clear undo after timeout
    setTimeout(() => {
      if (currentUndoRef.current?.toastId === toastId) {
        currentUndoRef.current = null;
      }
    }, 5000);
  }, [showToast, hideToast]);

  return (
    <UndoContext.Provider value={{ executeWithUndo }}>
      {children}
    </UndoContext.Provider>
  );
};