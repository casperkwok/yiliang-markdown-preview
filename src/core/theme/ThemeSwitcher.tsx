/**
 * @file ThemeSwitcher.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 内容预览风格主题切换组件
 */
import React, { useState, useRef, useEffect } from 'react';
import { useThemeContext } from './useThemeContext';
import { useTemplateContext } from '../../features/template/useTemplateContext';
import { templates } from '../../features/template/wechat-templates';

export const ThemeSwitcher: React.FC = () => {
  const { isDarkMode } = useThemeContext();
  const { selectedTemplate, setSelectedTemplate } = useTemplateContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 主题选项配置 - 使用 wechat-templates 中的配置
  const themeSwitcherOptions = templates.map(template => ({
    value: template.id,
    label: template.name,
    icon: template.id === 'wechat' ? '💬' : template.id === 'xiaohongshu' ? '📱' : template.id === 'elegant' ? '✨' : '📄',
    desc: template.description
  }));
  
  // 获取当前选中的主题
  const currentTheme = themeSwitcherOptions.find(option => option.value === selectedTemplate) || themeSwitcherOptions[0];
  
  // 切换主题并关闭下拉菜单
  const handleSelectTheme = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsOpen(false);
    
    // 强制刷新样式
    setTimeout(() => {
      // 触发样式重新计算
      const styleElement = document.getElementById('markdown-preview-styles');
      if (styleElement && styleElement.textContent) {
        styleElement.textContent = styleElement.textContent + ' ';
      }
      
      // 触发预览容器重新应用样式
      const previewElement = document.querySelector('.markdown-preview');
      if (previewElement) {
        previewElement.classList.remove('style-loaded');
        void previewElement.getBoundingClientRect();
        previewElement.classList.add('style-loaded');
      }
      
      // 通过事件通知预览组件刷新
      window.dispatchEvent(new CustomEvent('template-changed', { 
        detail: { templateId } 
      }));
    }, 50);
  };
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-2 py-1.5 text-xs rounded-md transition-colors theme-switcher-option bg-white ${
          isDarkMode ? 'bg-white text-gray-900 hover:bg-gray-50' : ''
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="mr-1">{currentTheme.icon}</span>
        <span className="font-normal">{currentTheme.label}</span>
        <svg 
          className={`ml-1 h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className={`fixed left-4 mt-1 w-48 rounded-md shadow-lg z-50 border ${
          isDarkMode 
            ? 'bg-white border-gray-200' 
            : 'bg-white border-gray-200'
        }`} style={{ top: 'calc(var(--theme-switcher-top, 2.5rem) + 0.25rem)' }}>
          <ul className="py-1">
            {themeSwitcherOptions.map((option) => (
              <li key={option.value}>
                <button
                  onClick={() => handleSelectTheme(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center transition-colors theme-switcher-option ${
                    selectedTemplate === option.value 
                      ? isDarkMode 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'bg-blue-50 text-blue-700'
                      : isDarkMode 
                        ? 'text-gray-900 hover:bg-gray-50' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center">
                      <span className="mr-2">{option.icon}</span>
                      <span className="font-normal">{option.label}</span>
                    </div>
                    <p className={`mt-1 text-xs ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      {option.desc}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 