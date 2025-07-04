/**
 * @file Navbar.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 导航栏组件 - 简化版
 */
import React, { useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { useBaseSelection } from "../../core/bitable";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import logo from "../../assets/logo.svg";
import logoEn from "../../assets/logo_en.svg";
import SponsorButton from "./SponsorButton";

type NavbarProps = {
    recordIdsLength: number;
    currentIndex?: number;
    onSwitchRecord: (direction: 'prev' | 'next') => void;
};

export const Navbar: React.FC<NavbarProps> = ({ 
    recordIdsLength, 
    currentIndex = -1, 
    onSwitchRecord 
}) => {
    const { t, i18n } = useTranslation();
    const { selection } = useBaseSelection();

    // 根据当前语言选择对应的logo
    const currentLogo = useMemo(() => {
        const currentLanguage = i18n.language;
        // 当语言为en或ja时使用英文logo，其他情况使用中文logo
        return (currentLanguage === 'en' || currentLanguage === 'ja') ? logoEn : logo;
    }, [i18n.language]);

    // 计算当前导航状态
    const isFirstRecord = currentIndex === 0;
    const isLastRecord = currentIndex === recordIdsLength - 1;

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <nav className="bg-app-card px-4 py-2">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img src={currentLogo} alt="Logo" className="h-6 w-auto" />
                    </div>
                    <SponsorButton />
                </div>
            </nav>
            
            <div className="flex justify-between items-center bg-app-card border-b border-app px-4 py-2">
                <span className="text-sm text-app opacity-70">
                    {t('navbar.current')} <span className="font-bold text-indigo-600">{selection.fieldName || t('navbar.defaultTitle')}</span>
                    {currentIndex > -1 && (
                        <> - {t('navbar.number')}<span className="font-bold text-indigo-600">{currentIndex + 1}</span> {t('navbar.row')}</>
                    )}
                </span>

                {/* Prev/Next Buttons */} 
                <div className="flex space-x-1">
                    <button 
                        className={`h-5 w-10 ${isFirstRecord ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-700'} text-white rounded shadow-md hover:shadow-lg active:shadow transform active:translate-y-0.5 transition-all flex items-center justify-center`}
                        onClick={() => !isFirstRecord && onSwitchRecord('prev')}
                        disabled={isFirstRecord}
                    >
                        <IoChevronBack className="text-lg" />
                    </button>
                    <button 
                        className={`h-5 w-10 ${isLastRecord ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-700'} text-white rounded shadow-md hover:shadow-lg active:shadow transform active:translate-y-0.5 transition-all flex items-center justify-center`}
                        onClick={() => !isLastRecord && onSwitchRecord('next')}
                        disabled={isLastRecord}
                    >
                        <IoChevronForward className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
};
