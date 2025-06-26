/**
 * @file ThemeContext.ts
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description Theme context definition
 */
import { createContext } from 'react';
import { ThemeContextType } from '../../shared/types';

// Create theme context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined); 