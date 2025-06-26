/**
 * @file useCopyToClipboard.ts
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 复制到剪贴板钩子函数
 */
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
const DEFAULT_COLOR = '#212529'; // 默认的石墨黑颜色

interface ThemeColorChangeEvent extends CustomEvent {
  detail: {
    color: string;
  };
}

export const useCopyToClipboard = () => {
  const { t } = useTranslation();
  const [currentThemeColor, setCurrentThemeColor] = useState<string>(DEFAULT_COLOR);

  // 监听主题颜色变化
  useEffect(() => {
    const handleThemeColorChange = (event: Event) => {
      const customEvent = event as ThemeColorChangeEvent;
      if (customEvent.detail && customEvent.detail.color) {
        setCurrentThemeColor(customEvent.detail.color);
      }
    };

    // 初始化时获取当前主题色
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--themeColor').trim();
    if (themeColor) {
      setCurrentThemeColor(themeColor || DEFAULT_COLOR);
    }

    window.addEventListener('themeColorChange', handleThemeColorChange);
    return () => {
      window.removeEventListener('themeColorChange', handleThemeColorChange);
    };
  }, []);

  const copyToClipboard = useCallback(async (contentElement: HTMLElement | null) => {
    if (!contentElement) return false;

    try {
      // 创建临时容器
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentElement.innerHTML;
      
      // 获取当前实际使用的主题色
      let activeThemeColor = currentThemeColor;
      const rootStyle = getComputedStyle(document.documentElement);
      const cssThemeColor = rootStyle.getPropertyValue('--themeColor').trim();
      if (cssThemeColor) {
        activeThemeColor = cssThemeColor;
      }
      
      // 直接替换所有CSS变量引用
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        * {
          --themeColor: ${activeThemeColor} !important;
        }
      `;
      tempDiv.appendChild(styleElement);
      
      // 处理所有的 blockquote 元素
      const targetBlockquotes = tempDiv.getElementsByTagName('blockquote');
      for (let i = 0; i < targetBlockquotes.length; i++) {
        const targetBlockquote = targetBlockquotes[i];
        targetBlockquote.style.borderLeftColor = activeThemeColor;
      }

      // 直接处理标题和强调文本
      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i] as HTMLElement;
        heading.style.color = activeThemeColor;
      }
      
      const strongs = tempDiv.querySelectorAll('strong');
      for (let i = 0; i < strongs.length; i++) {
        const strong = strongs[i];
        if (strong instanceof HTMLElement) {
          strong.style.color = activeThemeColor;
        }
      }

      // 将临时容器添加到文档中
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);

      // 尝试复制
      let success = false;
      try {
        // 尝试使用 Clipboard API
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([tempDiv.innerHTML], { type: 'text/html' }),
            'text/plain': new Blob([tempDiv.textContent || ''], { type: 'text/plain' })
          })
        ]);
        success = true;
      } catch (clipboardError) {
        console.log('Clipboard API failed, trying execCommand', clipboardError);
        
        try {
          // 降级处理：使用 execCommand
          tempDiv.contentEditable = 'true';
          const selection = window.getSelection();
          if (selection) {
            const range = document.createRange();
            range.selectNodeContents(tempDiv);
            selection.removeAllRanges();
            selection.addRange(range);
            
            success = document.execCommand('copy');
            selection.removeAllRanges();
          }
        } catch (execError) {
          console.error('execCommand failed too', execError);
        }
      }

      // 清理临时元素
      document.body.removeChild(tempDiv);
      
      if (success) {
        // 显示成功提示
        toast.success(t('copy.success'));
        return true;
      } else {
        throw new Error('All copy methods failed');
      }
    } catch (error) {
      console.error('Failed to copy content:', error);
      // 显示错误提示
      toast.error(t('copy.error'));
      return false;
    }
  }, [t, currentThemeColor]);

  const handleCopy = useCallback(async (selection: Selection | null, content: string) => {
    try {
      // 如果有选中的文本，使用选中的内容
      if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const container = range.cloneContents();
        const div = document.createElement('div');
        div.appendChild(container);
        return await copyToClipboard(div);
      }

      // 否则复制整个内容
      return await copyToClipboard(document.getElementById(content));
    } catch (error) {
      console.error('Handle copy error:', error);
      // 显示错误提示
      toast.error(t('copy.error'));
      return false;
    }
  }, [copyToClipboard, t]);

  return {
    handleCopy,
    copyToClipboard
  };
};
