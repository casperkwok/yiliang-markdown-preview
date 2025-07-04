/**
 * @file main.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 应用程序入口文件 - 简化版
 */
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initI18n } from '../shared/utils/i18n'
import { ThemeProvider } from '../core/theme/ThemeProvider'
import { bitable } from '@lark-base-open/js-sdk'
import { useTranslation } from 'react-i18next'
import '../index.css'
// Import template styles
import '../styles/templates/wechat.css'
import '../styles/templates/xiaohongshu.css'
// Import code theme styles
import '../styles/code-themes.css'

function LoadApp() {
  const [load, setLoad] = useState(false);
  const [loadErr, setLoadErr] = useState<React.ReactNode>(null)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      initI18n('en');
      setTimeout(() => {
        setLoadErr(<LoadErr />)
      }, 1000)
    }, 5000)
    
    void bitable.bridge.getLanguage().then((lang) => {
      clearTimeout(timer)
      // 确保语言代码是支持的类型
      const supportedLang = ['en', 'zh', 'ja'].includes(lang) ? lang as 'en' | 'zh' | 'ja' : 'zh';
      initI18n(supportedLang);
      setLoad(true);
    }).catch(() => {
      clearTimeout(timer)
      // 如果获取语言失败，使用默认语言
      initI18n('zh');
      setLoad(true);
    });
    
    return () => clearTimeout(timer)
  }, [])

  if (load) {
    return (
      <React.StrictMode>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </React.StrictMode>
    )
  }

  return loadErr
}

function LoadErr() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          {t('error.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('load_error.1')}
        </p>
        <div className="space-y-3">
          <a 
            href="https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=3cbueaf7-a6b9-44ca-96eb-d490646326c5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
              <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            {t('official.doclink')}
          </a>
        </div>
      </div>
    </div>
  );
}

// 导出组件以支持 Fast Refresh
export { LoadApp, LoadErr }

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<LoadApp />)
