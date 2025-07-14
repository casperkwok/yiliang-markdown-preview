import { useState, useEffect } from 'react';
import { bitable } from '@lark-base-open/js-sdk';
import { initI18n } from '../i18n';

type SupportedLanguage = 'en' | 'zh' | 'jp';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('zh');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.warn('Language detection timeout, using default language');
      initI18n('zh');
      setCurrentLanguage('zh');
      setIsLoaded(true);
    }, 2000); // 减少超时时间到2秒

    // 检查是否在 Lark Base 环境中
    if (typeof bitable !== 'undefined' && bitable.bridge && bitable.bridge.getLanguage) {
      // 获取 Lark Base 的语言设置
      void bitable.bridge.getLanguage().then((lang) => {
        clearTimeout(timer);
        // 确保语言代码是支持的类型，并处理 'ja' 到 'jp' 的映射
        let mappedLang: SupportedLanguage;
        if (lang === 'ja') {
          mappedLang = 'jp';
        } else if (['en', 'zh'].includes(lang)) {
          mappedLang = lang as SupportedLanguage;
        } else {
          mappedLang = 'zh'; // 默认语言
        }
        
        initI18n(mappedLang);
        setCurrentLanguage(mappedLang);
        setIsLoaded(true);
      }).catch((error) => {
        clearTimeout(timer);
        console.error('Failed to get language from Lark Base:', error);
        // 如果获取语言失败，使用默认语言
        initI18n('zh');
        setCurrentLanguage('zh');
        setIsLoaded(true);
      });
    } else {
      // 不在 Lark Base 环境中，直接使用默认语言
      clearTimeout(timer);
      console.log('Not in Lark Base environment, using default language');
      initI18n('zh');
      setCurrentLanguage('zh');
      setIsLoaded(true);
    }

    // 清理函数
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return {
    currentLanguage,
    isLoaded
  };
}; 