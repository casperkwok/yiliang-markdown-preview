import { createContext } from 'react';
import type { ThemeContextType } from '../types/template';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined); 