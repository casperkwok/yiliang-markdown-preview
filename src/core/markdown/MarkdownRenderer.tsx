/**
 * @file MarkdownRenderer.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description Markdown渲染器组件
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { useThemeContext } from '../theme/useThemeContext';

type MarkdownRendererProps = {
    content: string;
    className?: string;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
    const { isDarkMode } = useThemeContext();
    
    // 预处理内容，确保换行符被正确处理
    const processedContent = content
        // 确保所有换行符统一
        .replace(/\r\n/g, '\n')
        // 不再对列表项添加额外换行，让ReactMarkdown自己处理列表
        // 只处理可能导致问题的连续列表项
        .replace(/^(- .*?)\n(?=- )/gm, '$1\n\n')
        .replace(/^(\d+\. .*?)\n(?=\d+\. )/gm, '$1\n\n');
    
    return (
        <div className={`markdown-content ${className} ${isDarkMode ? 'dark-mode' : ''} 
            [&>*]:my-1 
            [&>p]:my-1.5 
            [&>ul]:my-1.5 [&>ul>li]:my-0.5 
            [&>ol]:my-1.5 [&>ol>li]:my-0.5
            [&>h1]:mt-4 [&>h1]:mb-2
            [&>h2]:mt-3 [&>h2]:mb-1.5
            [&>h3]:mt-2 [&>h3]:mb-1
            [&>h4]:mt-2 [&>h4]:mb-1
            [&>blockquote]:my-2
            [&>pre]:my-2
            [&_code]:px-1 [&_code]:py-0.5
            leading-normal
            text-app
            ${isDarkMode ? 'text-gray-200 [&_code]:bg-gray-800 [&_code]:text-orange-300' : 'text-gray-800 [&_code]:bg-gray-100 [&_code]:text-orange-600'}
        `}>
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                {processedContent}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer; 