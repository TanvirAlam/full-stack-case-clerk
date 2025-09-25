/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ToastProvider } from '../contexts/ToastContext';
import { UndoProvider } from '../contexts/UndoContext';
import { ToastContainer } from '../components/ToastContainer';

// Mock the hooks for basic testing
jest.mock('../hooks/useKeyboard', () => ({
  useKeyboard: jest.fn(),
  useFormKeyboard: jest.fn(),
}));

describe('Usability Features Integration', () => {
  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ToastProvider>
      <UndoProvider>
        {children}
      </UndoProvider>
    </ToastProvider>
  );

  test('ToastProvider and UndoProvider should wrap components without error', () => {
    expect(() => {
      render(
        <TestWrapper>
          <div>Test Content</div>
          <ToastContainer />
        </TestWrapper>
      );
    }).not.toThrow();

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('ToastContainer should render empty when no toasts', () => {
    const { container } = render(
      <TestWrapper>
        <ToastContainer />
      </TestWrapper>
    );
    
    // Should not render anything when no toasts
    expect(container.firstChild).toBeNull();
  });
});