/**
 * @file main.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 应用程序入口文件 - 简化版
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '../index.css'
// Import template styles
import '../styles/templates/wechat.css'
import '../styles/templates/xiaohongshu.css'
// Import code theme styles
import '../styles/code-themes.css'
// 导入并初始化i18n
import { initI18n } from '../shared/utils/i18n'
// 导入主题提供者
import { ThemeProvider } from '../core/theme/ThemeProvider'

// 初始化国际化
initI18n();

// 应用程序提供者组合
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.StrictMode>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <App />
  </AppProviders>
);
