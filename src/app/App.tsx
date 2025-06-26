/**
 * @file App.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 应用程序主组件 - 简化版
 */
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';
import { Navbar, ErrorContent, ContentSkeleton } from '../shared/components';
import { Footer } from '../features/export';
import ContentPreview from '../features/preview/ContentPreview';
import { useBaseSelection } from '../core/bitable';
import { useThemeContext } from '../core/theme';
import { TemplateProvider } from '../features/template';

function App() {
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  const { selection, recordIds, currentIndex, switchRecord, loading, error } = useBaseSelection();
  
  // 错误状态
  if (error) {
    return (
      <TemplateProvider>
        <div className={`min-h-screen flex flex-col text-app bg-app`} data-theme={theme.toLowerCase()}>
          <Toaster position="top-center" richColors={true} />
          <ErrorContent message={error.message || t('error.message')} />
        </div>
      </TemplateProvider>
    );
  }

  return (
    <TemplateProvider>
      <div className={`min-h-screen flex flex-col text-app bg-app`} data-theme={theme.toLowerCase()}>
        <Toaster position="top-center" richColors={true} />
        
        {/* 导航栏 */}
        <Navbar    
          recordIdsLength={recordIds.length}
          currentIndex={currentIndex}
          onSwitchRecord={(direction) => void switchRecord(direction)} 
        />
        
        {/* 主要内容 */}
        <main className="flex-1 bg-app-secondary overflow-auto">
          <div className="container mx-auto h-full">
            {loading ? (
              <ContentSkeleton />
            ) : (
              <ContentPreview 
                content={selection.content} 
                currentIndex={currentIndex}
                recordIdsLength={recordIds.length}
              />
            )}
          </div>
        </main>
        
        {/* 页脚 */}
        <Footer content={selection.content} />
        
        {/* 添加底部空白区域，防止内容被固定导航栏遮挡 */}
        <div className="h-14"></div>
      </div>
    </TemplateProvider>
  );
}

export default App;