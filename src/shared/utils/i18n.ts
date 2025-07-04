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
import translationJA from '../locales/ja.json';



export function initI18n(lang: 'en' | 'zh' | 'ja') {
  // 初始化 i18n
  void i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: translationEN,
      },
      zh: {
        translation: translationZH,
      },
      ja: {
        translation: translationJA,
      },
    },
    lng: lang, // 设置默认语言
    fallbackLng: 'zh', // 如果没有对应的语言文件，则使用默认语言
    interpolation: {
      escapeValue: false, // 不进行 HTML 转义
    },
  });
}

// 导出默认实例
export default i18n; 