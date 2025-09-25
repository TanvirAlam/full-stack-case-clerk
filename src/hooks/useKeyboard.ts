import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  [key: string]: (event: KeyboardEvent) => void;
}

export const useKeyboard = (shortcuts: KeyboardShortcuts, deps: any[] = []) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const modifiers = {
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
      meta: event.metaKey,
    };

    // Create key combination string
    const keyCombo = [
      modifiers.ctrl && 'ctrl',
      modifiers.shift && 'shift', 
      modifiers.alt && 'alt',
      modifiers.meta && 'meta',
      key
    ].filter(Boolean).join('+');

    // Check for exact match or just key
    if (shortcuts[keyCombo]) {
      shortcuts[keyCombo](event);
    } else if (shortcuts[key]) {
      shortcuts[key](event);
    }
  }, deps);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export const useFormKeyboard = (
  onSubmit: () => void,
  onCancel?: () => void,
  isActive: boolean = true
) => {
  useKeyboard({
    'enter': (e) => {
      if (!isActive) return;
      
      // Only submit if we're not in a textarea or if it's a submit button
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA') return;
      
      e.preventDefault();
      onSubmit();
    },
    'escape': (e) => {
      if (!isActive || !onCancel) return;
      
      e.preventDefault();
      onCancel();
    },
  }, [onSubmit, onCancel, isActive]);
};