/**
 * @file useCopyToClipboard.ts
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 复制到剪贴板钩子函数，支持样式保留
 */
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from './useThemeContext';

interface CopyResult {
  success: boolean;
  message?: string;
}

export const useCopyToClipboard = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeContext();

  // 获取当前CSS变量的实际值
  const getCurrentCSSVariables = useCallback(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    return {
      themeColor: rootStyle.getPropertyValue('--theme-color').trim() || '#333',
      textColor: rootStyle.getPropertyValue('--text-color').trim() || '#333',
      blockquoteBackground: rootStyle.getPropertyValue('--blockquote-background').trim() || '#f8f9fa',
      fontSize: rootStyle.getPropertyValue('--font-size').trim() || '15px'
    };
  }, []);

  // 应用内联样式，替换CSS变量
  const applyInlineStyles = useCallback((element: HTMLElement): HTMLElement => {
    const clonedElement = element.cloneNode(true) as HTMLElement;
    const cssVars = getCurrentCSSVariables();
    
    // 创建一个样式表来替换CSS变量
    const styleSheet = `
      <style>
        * {
          --theme-color: ${cssVars.themeColor} !important;
          --text-color: ${cssVars.textColor} !important;
          --blockquote-background: ${cssVars.blockquoteBackground} !important;
          --font-size: ${cssVars.fontSize} !important;
        }
        
        /* 确保所有使用CSS变量的元素都能正确显示 */
        h1, h2, h3, h4, h5, h6 {
          color: ${cssVars.themeColor} !important;
        }
        
        p, li, td, th {
          color: ${cssVars.textColor} !important;
        }
        
        strong {
          color: ${cssVars.themeColor} !important;
        }
        
        blockquote {
          border-left-color: ${cssVars.themeColor} !important;
          background: ${cssVars.blockquoteBackground} !important;
        }
        
        /* 保持代码块的主题适配 */
        pre {
          background: ${isDarkMode ? '#0d1117' : '#f6f8fa'} !important;
          color: ${isDarkMode ? '#c9d1d9' : '#24292e'} !important;
        }
        
        code {
          background: rgba(27,31,35,.05) !important;
          color: ${cssVars.textColor} !important;
        }
      </style>
    `;
    
    // 将样式表插入到克隆的元素中
    clonedElement.insertAdjacentHTML('afterbegin', styleSheet);
    
    return clonedElement;
  }, [getCurrentCSSVariables, isDarkMode]);

  // 复制内容到剪贴板
  const copyToClipboard = useCallback(async (contentElement: HTMLElement | null): Promise<CopyResult> => {
    if (!contentElement) {
      return { success: false, message: t('errors.contentNotFound') };
    }

    try {
      // 应用内联样式
      const styledElement = applyInlineStyles(contentElement);
      
      // 创建临时容器
      const tempContainer = document.createElement('div');
      tempContainer.appendChild(styledElement);
      
      // 添加基础容器样式
      const cssVars = getCurrentCSSVariables();
      tempContainer.style.fontFamily = "'Source Han Sans', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif";
      tempContainer.style.fontSize = cssVars.fontSize;
      tempContainer.style.lineHeight = '2';
      tempContainer.style.color = cssVars.textColor;
      tempContainer.style.backgroundColor = isDarkMode ? '#111827' : '#ffffff';
      tempContainer.style.padding = '1rem 1.5rem';
      tempContainer.style.maxWidth = '100%';
      tempContainer.style.wordBreak = 'break-word';
      
      // 将临时容器添加到文档中（不可见）
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      document.body.appendChild(tempContainer);

      let success = false;
      
      try {
        // 优先使用 Clipboard API
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([tempContainer.innerHTML], { type: 'text/html' }),
            'text/plain': new Blob([tempContainer.textContent || ''], { type: 'text/plain' })
          })
        ]);
        success = true;
      } catch (clipboardError) {
        console.log('Clipboard API failed, trying execCommand:', clipboardError);
        
        try {
          // 降级使用 execCommand
          tempContainer.contentEditable = 'true';
          const selection = window.getSelection();
          if (selection) {
            const range = document.createRange();
            range.selectNodeContents(tempContainer);
            selection.removeAllRanges();
            selection.addRange(range);
            
            success = document.execCommand('copy');
            selection.removeAllRanges();
          }
        } catch (execError) {
          console.error('execCommand also failed:', execError);
        }
      }

      // 清理临时元素
      document.body.removeChild(tempContainer);
      
      if (success) {
        return { success: true, message: t('errors.copySuccess') };
      } else {
        throw new Error(t('errors.allCopyMethodsFailed'));
      }
    } catch (error) {
      console.error('Failed to copy content:', error);
      return { success: false, message: t('errors.copyFailed') };
    }
  }, [applyInlineStyles, getCurrentCSSVariables, isDarkMode, t]);

  // 处理复制操作
  const handleCopy = useCallback(async (elementId: string = 'preview-content'): Promise<CopyResult> => {
    try {
      const element = document.getElementById(elementId);
      return await copyToClipboard(element);
    } catch (error) {
      console.error('Handle copy error:', error);
      return { success: false, message: t('errors.copyOperationFailed') };
    }
  }, [copyToClipboard, t]);

  // 复制选中的内容
  const handleCopySelection = useCallback(async (): Promise<CopyResult> => {
    try {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        return { success: false, message: '没有选中的内容' };
      }

      const range = selection.getRangeAt(0);
      const container = range.cloneContents();
      const div = document.createElement('div');
      div.appendChild(container);
      
      return await copyToClipboard(div);
    } catch (error) {
      console.error('Copy selection error:', error);
      return { success: false, message: t('errors.copyOperationFailed') };
    }
  }, [copyToClipboard, t]);

  return {
    handleCopy,
    handleCopySelection,
    copyToClipboard
  };
}; 