/**
 * @file useTheme.ts
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description Theme hook for handling light/dark mode
 */
import { useEffect, useState } from 'react';
import { bitable } from '@lark-base-open/js-sdk';
import { ThemeModeType, ThemeContextType, ThemeModeCtx, IEventCbCtx } from '../../shared/types';

export const useTheme = (): ThemeContextType => {
  const [theme, setTheme] = useState<ThemeModeType>(ThemeModeType.LIGHT);
  
  // 初始化主题
  useEffect(() => {
    const initTheme = async () => {
      try {
        // 从Bitable SDK获取主题
        const currentTheme = await bitable.bridge.getTheme();
        setTheme(currentTheme as ThemeModeType);
      } catch (error) {
        // 如果SDK失败，回退到系统偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const fallbackTheme = prefersDark ? ThemeModeType.DARK : ThemeModeType.LIGHT;
        setTheme(fallbackTheme);
      }
    };
    
    void initTheme();
    
    // 监听主题变化
    const unsubscribe = bitable.bridge.onThemeChange((event: IEventCbCtx<ThemeModeCtx>) => {
      const newTheme = event.data.theme;
      setTheme(newTheme);
    });
    
    // 监听系统偏好变化作为回退
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在不使用Bitable主题时才应用
      if (!bitable.bridge) {
        const newTheme = e.matches ? ThemeModeType.DARK : ThemeModeType.LIGHT;
        setTheme(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      unsubscribe?.();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  return {
    theme,
    isDarkMode: theme === ThemeModeType.DARK
  };
}; 