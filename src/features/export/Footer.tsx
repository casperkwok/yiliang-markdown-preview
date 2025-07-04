/**
 * @file Footer.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 页脚组件
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from './useCopyToClipboard';
import { useBaseSelection } from '../../core/bitable';
import { IoTime } from 'react-icons/io5';
import html2pdf from 'html2pdf.js';
import { FiDownload } from 'react-icons/fi';


type FooterProps = {
    content: string;

};

export const Footer: React.FC<FooterProps> = ({ 

    content,
}) => {
    const { t } = useTranslation();
    const { handleCopy } = useCopyToClipboard();
    const { selection, currentIndex } = useBaseSelection();
    
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 bg-opacity-100">
            <div className="flex items-center h-12 justify-between">
                {/* 中间信息区域 */}
                <div className="flex justify-center">
                    <div className="h-8 px-2 text-gray-600 flex items-center justify-center text-xs">
                        <IoTime className="mr-1 text-gray-500" />
                        {content.length}{t('footer.wordCount')}, {t('footer.readingTime')}{Math.round(content.length / 100)}{t('footer.minutes')}
                    </div>
                </div>
                
                {/* 右侧按钮组 */}
                <div className="px-4 flex space-x-2">
                    {/* 复制按钮 */}
                    <button
                        onClick={() => void handleCopy(window.getSelection(), 'preview-content')}
                        className="h-8 px-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-700 text-white rounded shadow-md hover:shadow-lg active:shadow transform active:translate-y-0.5 transition-all flex items-center justify-center text-xs"
                        title={t('contentPreview.copy')}
                    >
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {t('contentPreview.copy')}
                    </button>
                    {/* 导出 PDF 按钮 */}
                    <button
                        onClick={() => {
                            const element = document.getElementById('preview-content');
                            if (element) {
                                // Get current date
                                const now = new Date();
                                const dateStr = now.getFullYear().toString() +
                                              (now.getMonth() + 1).toString().padStart(2, '0') +
                                              now.getDate().toString().padStart(2, '0');
                                
                                // Construct filename with format: 字段名_行_日期.pdf
                                const fieldName = selection.fieldName || t('common.report');
                                const rowNumber = currentIndex >= 0 ? (currentIndex + 1) : 1;
                                
                                // Sanitize field name for filename (remove invalid characters)
                                const sanitizedFieldName = fieldName.replace(/[/\\?%*:|"<>]/g, '-');
                                
                                const dynamicFilename = `${sanitizedFieldName}_${rowNumber}_${dateStr}.pdf`;

                                // Configuration options for html2pdf
                                const opt = {
                                    margin:       1,
                                    filename:     dynamicFilename, // Use dynamic filename
                                    image:        { type: 'jpeg', quality: 0.98 },
                                    html2canvas:  { scale: 2, useCORS: true },
                                    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
                                    pagebreak:    { mode: 'css', before: '.page-break-before' }
                                };
                                // Use html2pdf to save the element as PDF
                                void html2pdf().set(opt).from(element).save();
                            } else {
                                console.error('Element with ID "preview-content" not found.');
                            }
                        }}
                        className="h-8 px-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-700 text-white rounded shadow-md hover:shadow-lg active:shadow transform active:translate-y-0.5 transition-all flex items-center justify-center text-xs"
                        title={t('footer.exportPdf')}
                    >
                        <FiDownload className="w-4 h-4 mr-1" />
                        {t('footer.exportPdfButton')}
                    </button>
                </div>
            </div>
        </footer>
    );
};