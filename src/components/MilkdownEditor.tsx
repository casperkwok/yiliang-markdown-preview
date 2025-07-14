/**
 * @file MilkdownEditor.tsx
 * @author Peng
 * @date 2025-01-13
 * @version 1.0.0
 * @description Simple markdown editor component
 */
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../hooks/useThemeContext';

type MilkdownEditorProps = {
    content: string;
    onChange: (content: string) => void;
    className?: string;
};

export const MilkdownEditor: React.FC<MilkdownEditorProps> = ({
    content,
    onChange,
    className = ''
}) => {
    const { t } = useTranslation();
    const { isDarkMode } = useThemeContext();
    const [localContent, setLocalContent] = useState(content);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setLocalContent(content);
    }, [content]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setLocalContent(newContent);
        onChange(newContent);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = e.currentTarget;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent = localContent.substring(0, start) + '  ' + localContent.substring(end);
            setLocalContent(newContent);
            onChange(newContent);
            
            // Set cursor position after the inserted spaces
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 2;
            }, 0);
        }
    };

    return (
        <div className={`markdown-editor-wrapper ${className}`}>
            <style>{`
                .markdown-editor-wrapper {
                    background: ${isDarkMode ? '#1f2937' : 'white'};
                    color: ${isDarkMode ? '#f3f4f6' : 'black'};
                    height: 100%;
                    width: 100%;
                }
                
                .markdown-editor-wrapper .markdown-textarea {
                    width: 100%;
                    height: 100%;
                    background: ${isDarkMode ? '#1f2937' : 'white'};
                    color: ${isDarkMode ? '#f3f4f6' : 'black'};
                    border: none;
                    outline: none;
                    resize: none;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                    font-size: 14px;
                    line-height: 1.6;
                    padding: 24px 24px 80px 24px;
                    margin: 0;
                    box-sizing: border-box;
                }
                
                .markdown-editor-wrapper .markdown-textarea:focus {
                    outline: none;
                    box-shadow: none;
                }
                
                .markdown-editor-wrapper .markdown-textarea::placeholder {
                    color: ${isDarkMode ? '#9ca3af' : '#999'};
                }
            `}</style>
            <textarea
                ref={textareaRef}
                className="markdown-textarea"
                value={localContent}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={t('editor.placeholder')}
                spellCheck={false}
            />
        </div>
    );
}; 