/**
 * @file useThemeContext.ts
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description Theme context hook
 */
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { ThemeContextType } from '../../shared/types';

/**
 * Hook to use theme context
 * Must be used within a ThemeProvider
 */
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
} 