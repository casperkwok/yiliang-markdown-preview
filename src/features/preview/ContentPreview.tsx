/**
 * @file ContentPreview.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 内容预览组件
 */
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EditorPreview } from './EditorPreview';
import { type CodeThemeId } from '../../shared/utils/code-themes';
import { usePreviewContent } from './usePreviewContent';
import { useTemplateContext } from '../template/useTemplateContext';
import { defaultOptions } from '../../core/markdown';
import { templates } from '../template/wechat-templates';

type ContentPreviewProps = {
    content: string;
    currentIndex?: number;
    recordIdsLength?: number;
    codeTheme?: CodeThemeId;
};

const ContentPreview: React.FC<ContentPreviewProps> = ({ 
    content, 
    codeTheme = 'github'
}) => {
    const { t } = useTranslation();
    const { selectedTemplate } = useTemplateContext();
    const previewRef = useRef<HTMLDivElement>(null);

    // 获取选中模板的样式配置
    const templateConfig = templates.find(t => t.id === selectedTemplate);

    const { isConverting, previewContent } = usePreviewContent({
        value: content,
        selectedTemplate,
        styleOptions: templateConfig?.options || defaultOptions,
        codeTheme
    });

    if (!content) {
        return (
            <div className="h-full flex items-center justify-center bg-app-card rounded-lg shadow-sm mt-20">
                <div className="text-center my-10">
                    <p className="text-app font-bold mb-2">{t('contentPreview.empty')}</p>
                    <p className="text-sm text-app opacity-60">{t('contentPreview.empty')}</p>
                </div>
            </div>
        );
    }

    // 使用 Editor 预览组件
    return (
        <div className="h-full w-full mt-20">
            <EditorPreview 
                previewRef={previewRef}
                previewContent={previewContent}
                isConverting={isConverting}
                codeTheme={codeTheme}
                selectedTemplate={selectedTemplate}
            />
        </div>
    );
};

export default ContentPreview;