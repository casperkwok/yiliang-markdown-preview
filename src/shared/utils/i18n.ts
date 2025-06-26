/**
 * @file i18n.ts
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 国际化配置文件
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '../locales/en.json';
import translationZH from '../locales/zh.json';
import translationJP from '../locales/jp.json';

// 设置支持的语言列表
export const supportedLanguages = ['zh', 'en', 'jp'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

// 获取用户首选语言
const getDefaultLanguage = (): SupportedLanguage => {
  console.log('🔍 语言检测开始...');
  
  // 优先从本地存储获取
  const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
  console.log('📱 本地存储的语言:', savedLanguage);
  if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
    console.log('✅ 使用本地存储的语言:', savedLanguage);
    return savedLanguage;
  }
  
  // 直接返回默认中文，不检查浏览器语言
  console.log('⚠️ 忽略浏览器语言设置，直接使用默认中文 zh');
  return 'zh';
};

// 初始化 i18n
export const initI18n = (lang?: SupportedLanguage) => {
  const language = lang || getDefaultLanguage();
  console.log('🚀 初始化 i18n，最终使用语言:', language);
  
  void i18n.use(initReactI18next).init({
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
    lng: language,
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
    },
  });
  
  return i18n;
};

// 切换语言
export const changeLanguage = (lang: SupportedLanguage) => {
  localStorage.setItem('language', lang);
  void i18n.changeLanguage(lang);
};

// 获取当前语言
export const getCurrentLanguage = (): SupportedLanguage => {
  return (i18n.language as SupportedLanguage) || 'zh';
};

// 导出默认实例
export default i18n; 