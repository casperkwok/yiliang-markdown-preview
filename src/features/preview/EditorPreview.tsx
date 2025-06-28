import { cn } from '../../shared/utils/utils'
import { Loader2 } from 'lucide-react'
import { templates } from '../template/wechat-templates'
import { useRef } from 'react'
import { type CodeThemeId } from '../../shared/utils/code-themes'
import '../../styles/code-themes.css'
import { useScrollSync } from './useScrollSync'

interface EditorPreviewProps {
  previewRef: React.RefObject<HTMLDivElement>
  selectedTemplate?: string
  isConverting: boolean
  previewContent: string
  codeTheme: CodeThemeId
}

// 在渲染HTML内容前，最后清理一次
const cleanHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/\[object Object\]/g, '');
};

export function EditorPreview({
  previewRef,
  selectedTemplate,
  isConverting,
  previewContent,
  codeTheme
}: EditorPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { handlePreviewScroll } = useScrollSync()

  // 确保清理HTML
  const cleanedContent = cleanHtml(previewContent);

  return (
    <div 
      id="preview-content"
      ref={previewRef}
      className={cn(
        "preview-container bg-white h-full w-full flex flex-col",
        "markdown-body relative",
        selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles,
        `code-theme-${codeTheme}`
      )}
    >
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto"
        onScroll={handlePreviewScroll}
      >
        {isConverting ? (
          <div className="flex flex-col items-center justify-center gap-2 p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">正在生成预览...</span>
          </div>
        ) : (
          <div 
            className={cn(
              "preview-content py-4 px-6 w-full max-w-none",
              selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
            )}
            dangerouslySetInnerHTML={{ __html: cleanedContent }}
          />
        )}
      </div>
    </div>
  )
}