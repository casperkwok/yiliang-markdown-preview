/**
 * @file ThemeProvider.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 主题提供者组件
 */
import { ReactNode, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { useTheme } from './useTheme';

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const themeContext = useTheme();
  const { theme } = themeContext;
  
  // 设置应用的明暗主题样式
  useEffect(() => {
    const root = document.documentElement;
    
    // 定义应用明暗主题样式
    const themeStyles = {
      LIGHT: {
        '--app-bg-color': '#ffffff',
        '--app-text-color': '#213547',
        '--app-border-color': '#dee0e3',
        '--app-primary-color': '#333333',
        '--app-secondary-bg': '#f5f5f5',
        '--app-card-bg': '#ffffff',
        '--app-hover-bg': '#f0f0f0',
      },
      DARK: {
        '--app-bg-color': '#1a1a1a',
        '--app-text-color': '#ffffff',
        '--app-border-color': '#333333',
        '--app-primary-color': '#ffffff',
        '--app-secondary-bg': '#2a2a2a',
        '--app-card-bg': '#262626',
        '--app-hover-bg': '#3a3a3a',
      }
    };
    
    // 应用明暗主题样式
    const currentThemeStyles = themeStyles[theme];
    Object.entries(currentThemeStyles).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // 添加明暗主题类到body
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme.toLowerCase()}`);
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};