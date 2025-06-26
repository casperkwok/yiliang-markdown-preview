/**
 * @file Navbar.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 导航栏组件 - 简化版
 */
import React from "react";
import { useBaseSelection } from "../../core/bitable";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import logo from "../../assets/logo.svg";
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
    const { selection } = useBaseSelection();

    // 计算当前导航状态
    const isFirstRecord = currentIndex === 0;
    const isLastRecord = currentIndex === recordIdsLength - 1;

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <nav className="bg-[#f6f8fe] dark:bg-gray-800 px-4 py-2">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img src={logo} alt="Logo" className="h-6 w-auto" />
                    </div>
                    <SponsorButton />
                </div>
            </nav>
            
            <div className="flex justify-between items-center bg-white border-b border-app px-4 py-2">
                <span className="text-sm text-app opacity-70">
                    当前 <span className="font-bold text-indigo-600">{selection.fieldName || 'AI 评估报告'}</span>
                    {currentIndex > -1 && (
                        <> - 第 <span className="font-bold text-indigo-600">{currentIndex + 1}</span> 行</>
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
