import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '../locales/en.json';
import translationZH from '../locales/zh.json';
import translationJP from '../locales/jp.json';

// 设置支持的语言列表
const supportedLanguages = ['en', 'zh', 'jp'];

// 默认初始化 i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEN,
    },
    zh: {
      translation: translationZH,
    },
    jp: {
      translation: translationJP,
    },
  },
  lng: 'zh', // 默认语言
  fallbackLng: 'en', // 如果没有对应的语言文件，则使用默认语言
  interpolation: {
    escapeValue: false, // 不进行 HTML 转义
  },
  // 添加调试模式（生产环境中会被禁用）
  debug: process.env.NODE_ENV === 'development',
});

export function initI18n(lang: 'en' | 'zh' | 'jp') {
  // 切换语言
  i18n.changeLanguage(lang);
}

export { supportedLanguages };
export default i18n; 