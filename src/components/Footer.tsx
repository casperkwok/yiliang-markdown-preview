/**
 * @file Footer.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 页脚组件
 */
import React, { useState } from 'react';
import { IoTime } from 'react-icons/io5';
import { FiDownload, FiEdit3, FiX, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../hooks/useThemeContext';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { usePDFExport } from '../hooks/usePDFExport';

type FooterProps = {
    content: string;
    fieldName?: string;
    currentIndex?: number;
    isEditMode?: boolean;
    onEditModeChange?: (editMode: boolean) => void;
    onSave?: () => Promise<boolean>;
    onCancel?: () => void;
};

export const Footer: React.FC<FooterProps> = ({ 
    content,
    fieldName,
    currentIndex = -1,
    isEditMode = false,
    onEditModeChange,
    onSave,
    onCancel
}) => {
    const { t } = useTranslation();
    const { isDarkMode } = useThemeContext();
    const { handleCopy } = useCopyToClipboard();
    const { handleExport } = usePDFExport();
    const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const handleCopyClick = async () => {
        const result = await handleCopy('preview-content');
        if (result.success) {
            setCopyStatus('success');
            setTimeout(() => setCopyStatus('idle'), 2000);
            console.log(t('errors.copySuccess'));
        } else {
            setCopyStatus('error');
            setTimeout(() => setCopyStatus('idle'), 2000);
            console.error(t('errors.copyFailed'), result.message);
        }
    };

    const handleExportPDF = async () => {
        setExportStatus('idle');
        const result = await handleExport(fieldName, currentIndex);
        if (result.success) {
            setExportStatus('success');
            setTimeout(() => setExportStatus('idle'), 2000);
            console.log(t('errors.exportSuccess'));
        } else {
            setExportStatus('error');
            setTimeout(() => setExportStatus('idle'), 2000);
            console.error(t('errors.exportFailed'), result.message);
        }
    };

    const handleEditClick = () => {
        onEditModeChange?.(true);
    };

    const handleSaveClick = async () => {
        if (!onSave) return;

        setSaveStatus('saving');
        const success = await onSave();
        
        if (success) {
            setSaveStatus('success');
            setTimeout(() => {
                setSaveStatus('idle');
                onEditModeChange?.(false);
            }, 1000);
        } else {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }
    };

    const handleCancelClick = () => {
        onCancel?.();
        onEditModeChange?.(false);
    };

    // 预览模式的按钮样式 - 参考 CommunityButton 的样式
    const buttonBaseClass = "px-3 py-1.5 font-bold rounded-md transition-colors text-xs flex items-center cursor-pointer";
    const buttonDefaultClass = "bg-indigo-500 hover:bg-indigo-600 text-white";
    const buttonSuccessClass = "bg-green-500 hover:bg-green-600 text-white";
    const buttonErrorClass = "bg-red-500 hover:bg-red-600 text-white";
    const buttonCancelClass = "bg-gray-500 hover:bg-gray-600 text-white";
    
    return (
        <footer className={`fixed bottom-0 left-0 right-0 z-20 border-t bg-opacity-100 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center h-12 justify-between">
                {!isEditMode ? (
                    <>
                        {/* 左侧编辑按钮 */}
                        <div className="px-4 flex space-x-2">
                            <button
                                onClick={handleEditClick}
                                className={`${buttonBaseClass} ${buttonDefaultClass}`}
                                title={t('footer.editContent')}
                            >
                                <FiEdit3 className="w-4 h-4 mr-1" />
                                {t('footer.edit')}
                            </button>
                        </div>

                        {/* 中间信息区域 */}
                        <div className="flex justify-center">
                            <div className={`py-1.5 flex items-center justify-center text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <IoTime className={`mr-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                                <span className="text-xs whitespace-nowrap">{content.length} {t('footer.characters')}</span>
                            </div>
                        </div>
                        
                        {/* 右侧按钮组 */}
                        <div className="px-4 flex space-x-2">
                            {/* 复制按钮 */}
                            <button
                                onClick={handleCopyClick}
                                className={`${buttonBaseClass} ${
                                    copyStatus === 'success' 
                                        ? buttonSuccessClass
                                        : copyStatus === 'error'
                                        ? buttonErrorClass
                                        : buttonDefaultClass
                                }`}
                                title={t('footer.copyContent')}
                            >
                                {copyStatus === 'success' ? (
                                    <>
                                        <FiCheck className="w-4 h-4 mr-1" />
                                        {t('footer.copied')}
                                    </>
                                ) : copyStatus === 'error' ? (
                                    <>
                                        <FiX className="w-4 h-4 mr-1" />
                                        {t('footer.failed')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        {t('footer.copy')}
                                    </>
                                )}
                            </button>
                            {/* 导出 PDF 按钮 */}
                            <button
                                onClick={handleExportPDF}
                                className={`${buttonBaseClass} ${
                                    exportStatus === 'success' 
                                        ? buttonSuccessClass
                                        : exportStatus === 'error'
                                        ? buttonErrorClass
                                        : buttonDefaultClass
                                }`}
                                title={t('footer.exportPDF')}
                            >
                                {exportStatus === 'success' ? (
                                    <>
                                        <FiCheck className="w-4 h-4 mr-1" />
                                        {t('footer.exported')}
                                    </>
                                ) : exportStatus === 'error' ? (
                                    <>
                                        <FiX className="w-4 h-4 mr-1" />
                                        {t('footer.failed')}
                                    </>
                                ) : (
                                    <>
                                        <FiDownload className="w-4 h-4 mr-1" />
                                        {t('footer.export')}
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* 编辑模式 - 左侧空白 */}
                        <div className="px-4"></div>

                        {/* 编辑模式 - 中间信息 */}
                        <div className="flex justify-center">
                            <div className={`py-1.5 flex items-center justify-center text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <FiEdit3 className={`mr-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                                <span className="text-xs whitespace-nowrap">{t('footer.editMode')}</span>
                            </div>
                        </div>

                        {/* 编辑模式 - 右侧按钮组 */}
                        <div className="px-4 flex space-x-2">
                            {/* 取消按钮 */}
                            <button
                                onClick={handleCancelClick}
                                className={`${buttonBaseClass} ${buttonCancelClass}`}
                                title={t('footer.cancelEdit')}
                            >
                                <FiX className="w-4 h-4 mr-1" />
                                {t('footer.cancel')}
                            </button>
                            {/* 保存按钮 */}
                            <button
                                onClick={handleSaveClick}
                                disabled={saveStatus === 'saving'}
                                className={`${buttonBaseClass} ${
                                    saveStatus === 'success' 
                                        ? buttonSuccessClass
                                        : saveStatus === 'error'
                                        ? buttonErrorClass
                                        : saveStatus === 'saving'
                                        ? 'bg-indigo-300 cursor-not-allowed text-white'
                                        : buttonDefaultClass
                                }`}
                                title={t('footer.saveContent')}
                            >
                                {saveStatus === 'saving' ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                                        {t('footer.saving')}
                                    </>
                                ) : saveStatus === 'success' ? (
                                    <>
                                        <FiCheck className="w-4 h-4 mr-1" />
                                        {t('footer.saved')}
                                    </>
                                ) : saveStatus === 'error' ? (
                                    <>
                                        <FiX className="w-4 h-4 mr-1" />
                                        {t('footer.failed')}
                                    </>
                                ) : (
                                    <>
                                        <FiCheck className="w-4 h-4 mr-1" />
                                        {t('footer.save')}
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </footer>
    );
}; 