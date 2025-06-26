/**
 * @file ErrorContent.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 错误内容展示组件
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorContentProps {
  message: string;
}

const ErrorContent: React.FC<ErrorContentProps> = ({ message }) => {
  const { t } = useTranslation();
  
  return (
    <div className="h-full flex items-center justify-center bg-app-card rounded-lg shadow-sm">
      <div className="text-center max-w-md p-6">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-600 mb-2">{t('error.title')}</h3>
        <p className="text-gray-600 mb-4">{message || t('error.message')}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {t('error.reload')}
        </button>
      </div>
    </div>
  );
};

export default ErrorContent; 