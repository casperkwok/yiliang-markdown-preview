import React, { memo, useMemo, useState, useEffect, useRef, lazy, Suspense } from "react";
import { useTranslation } from 'react-i18next';
import { MarkdownProcessor } from "../services/markdownProcessor";
import { templates } from "../templates/default-template";
import { useThemeContext } from "../hooks/useThemeContext";
import type { CodeThemeId } from "../types/template";

// Lazy load the MilkdownEditor component
const MilkdownEditor = lazy(() => import("./MilkdownEditor").then(module => ({ default: module.MilkdownEditor })));

type ContentDisplayProps = {
    content: string;
    loading?: boolean;
    error?: Error | null;
    selectedTemplate?: string;
    codeTheme?: CodeThemeId;
    isEditMode?: boolean;
    onContentChange?: (content: string) => void;
};

export const ContentDisplay: React.FC<ContentDisplayProps> = memo(({ 
    content, 
    loading = false,
    error = null,
    selectedTemplate = 'default',
    codeTheme = 'github',
    isEditMode = false,
    onContentChange
}) => {
    const { t } = useTranslation();
    const { isDarkMode } = useThemeContext();
    const [editContent, setEditContent] = useState(content);
    const previewRef = useRef<HTMLDivElement>(null);
    
    const processedContent = useMemo(() => {
        if (!content) return '';
        
        try {
            const template = templates.find(t => t.id === selectedTemplate) || templates[0];
            const processor = new MarkdownProcessor({
                template,
                codeTheme: isDarkMode ? 'github-dark' : codeTheme,
                isDarkMode
            });
            
            return processor.process(content);
        } catch (err) {
            console.error('Error processing markdown:', err);
            return `<div class="markdown-error">${t('errors.processingMarkdown')}</div>`;
        }
    }, [content, selectedTemplate, codeTheme, isDarkMode]);

    // Update edit content when content prop changes
    React.useEffect(() => {
        setEditContent(content);
    }, [content]);

    // Render Mermaid diagrams after content is updated
    useEffect(() => {
        if (!isEditMode && previewRef.current && processedContent) {
            const renderDiagrams = async () => {
                try {
                    const { renderMermaidDiagrams: renderFn } = await import("../services/mermaidExtension");
                    await renderFn(previewRef.current!, isDarkMode);
                } catch (error) {
                    console.error('Error rendering Mermaid diagrams:', error);
                }
            };
            
            // Use a small delay to ensure DOM is updated
            const timeoutId = setTimeout(renderDiagrams, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [processedContent, isDarkMode, isEditMode]);

    const handleContentChange = (newContent: string) => {
        setEditContent(newContent);
        onContentChange?.(newContent);
    };

    if (loading) {
        return (
            <div className={`h-full w-full flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`h-full w-full flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="text-center">
                    <div className="text-red-500 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-red-600 font-medium">{t('common.loadingError')}</p>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error.message}</p>
                </div>
            </div>
        );
    }

    if (!content && !isEditMode) {
        return (
            <div className={`h-full w-full flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="text-center my-10">
                    <p className={`font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{t('common.noContent')}</p>
                    <p className={`text-sm opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('common.selectCell')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-full w-full ${isEditMode ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'} ${isDarkMode ? 'bg-gray-900 dark' : 'bg-white'}`}>
            {isEditMode ? (
                <Suspense fallback={
                    <div className={`h-full w-full flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{t('common.loading')}</p>
                        </div>
                    </div>
                }>
                    <MilkdownEditor
                        content={editContent}
                        onChange={handleContentChange}
                        className="h-full w-full"
                    />
                </Suspense>
            ) : (
                <div id="preview-content" className="p-6 pb-20" ref={previewRef}>
                    <div 
                        className="markdown-content"
                        dangerouslySetInnerHTML={{ __html: processedContent }}
                    />
                </div>
            )}
        </div>
    );
}); 