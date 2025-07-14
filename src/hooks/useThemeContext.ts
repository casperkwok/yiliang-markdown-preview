import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import type { ThemeContextType } from '../types/template';

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}; 