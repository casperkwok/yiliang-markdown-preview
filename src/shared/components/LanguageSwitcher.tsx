/**
 * @file LanguageSwitcher.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 语言切换组件
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, type SupportedLanguage } from '../utils/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const currentLanguage = getCurrentLanguage();

  const languages: Array<{ value: SupportedLanguage; label: string }> = [
    { value: 'zh', label: t('language.zh') },
    { value: 'en', label: t('language.en') },
    { value: 'jp', label: t('language.jp') },
  ];

  const handleLanguageChange = (language: SupportedLanguage) => {
    changeLanguage(language);
  };

  return (
    <div className={`language-switcher ${className}`}>
      <select
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
        className="px-3 py-1 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-sm"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher; 