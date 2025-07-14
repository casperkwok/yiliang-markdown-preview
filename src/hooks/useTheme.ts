import { useEffect, useState } from 'react';
import type { ThemeContextType, ThemeModeType } from '../types/template';
import { ThemeModeType as ThemeMode } from '../types/template';
import { larkBaseService } from '../services/larkBase';

export const useTheme = (): ThemeContextType => {
  const [theme, setTheme] = useState<ThemeModeType>(ThemeMode.LIGHT);
  
  // Initialize theme
  useEffect(() => {
    const initTheme = async () => {
      try {
        // 优先使用 Lark Base 的主题设置
        const larkTheme = await larkBaseService.getTheme();
        const newTheme = larkTheme === 'dark' ? ThemeMode.DARK : ThemeMode.LIGHT;
        setTheme(newTheme);
      } catch (error) {
        console.warn('Failed to get theme from Lark Base, falling back to system preference:', error);
        // 降级到系统偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const fallbackTheme = prefersDark ? ThemeMode.DARK : ThemeMode.LIGHT;
        setTheme(fallbackTheme);
      }
    };
    
    initTheme();
    
    // 监听 Lark Base 主题变化
    const unsubscribe = larkBaseService.onThemeChange((larkTheme) => {
      const newTheme = larkTheme === 'dark' ? ThemeMode.DARK : ThemeMode.LIGHT;
      setTheme(newTheme);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  return {
    theme,
    isDarkMode: theme === ThemeMode.DARK
  };
}; 