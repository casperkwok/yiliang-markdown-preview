import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useTranslation } from 'react-i18next';
import { useThemeContext } from "../hooks/useThemeContext";
import logo from "../assets/logo.svg";
import logoEn from "../assets/logo_en.svg";
import logoWhite from "../assets/logo_white.svg";
import logoEnWhite from "../assets/logo_en_white.svg";
import CommunityButton from "./CommunityButton";

type NavbarProps = {
    recordIdsLength: number;
    currentIndex?: number;
    onSwitchRecord: (direction: 'prev' | 'next') => void;
    fieldName?: string;
};

export const Navbar: React.FC<NavbarProps> = ({ 
    recordIdsLength, 
    currentIndex = -1, 
    onSwitchRecord,
    fieldName 
}) => {
    const { i18n, t } = useTranslation();
    const { isDarkMode } = useThemeContext();
    
    // 根据语言和主题选择logo
    const currentLogo = (() => {
        const isEnglish = i18n.language === 'en' || i18n.language === 'jp';
        if (isDarkMode) {
            return isEnglish ? logoEnWhite : logoWhite;
        } else {
            return isEnglish ? logoEn : logo;
        }
    })();
    
    // 计算当前导航状态
    const isFirstRecord = currentIndex === 0;
    const isLastRecord = currentIndex === recordIdsLength - 1;

    return (
        <div className={`w-full border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <nav className="px-4 py-2">
                <div className="flex items-center justify-between max-w-full">
                    <div className="flex items-center space-x-4 flex-shrink-0">
                        <img src={currentLogo} alt="Logo" className="h-6 w-auto" />
                    </div>
                    <div className="flex-shrink-0">
                        <CommunityButton />
                    </div>
                </div>
            </nav>
            
            <div className="flex justify-between items-center px-4 py-2">
                <span className={`text-sm opacity-70 flex-1 min-w-0 pr-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="truncate">
                        {t('navbar.current')}: <span className={`font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{fieldName || t('navbar.selectField')}</span>
                        {currentIndex > -1 && (
                            <> - {t('navbar.row')} <span className={`font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{currentIndex + 1}</span></>
                        )}
                    </span>
                </span>

                {/* Prev/Next Buttons */} 
                <div className="flex space-x-1 flex-shrink-0">
                    <button 
                        className={`h-5 w-10 ${isFirstRecord ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-700 cursor-pointer'} text-white rounded shadow-md hover:shadow-lg active:shadow transform active:translate-y-0.5 transition-all flex items-center justify-center`}
                        onClick={() => !isFirstRecord && onSwitchRecord('prev')}
                        disabled={isFirstRecord}
                        title={t('navbar.prevRecord')}
                    >
                        <IoChevronBack className="text-lg" />
                    </button>
                    <button 
                        className={`h-5 w-10 ${isLastRecord ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-700 cursor-pointer'} text-white rounded shadow-md hover:shadow-lg active:shadow transform active:translate-y-0.5 transition-all flex items-center justify-center`}
                        onClick={() => !isLastRecord && onSwitchRecord('next')}
                        disabled={isLastRecord}
                        title={t('navbar.nextRecord')}
                    >
                        <IoChevronForward className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
}; 