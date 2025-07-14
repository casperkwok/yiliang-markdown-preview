import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLarkBase } from './hooks/useLarkBase';
import { useLanguage } from './hooks/useLanguage';
import { useThemeContext } from './hooks/useThemeContext';
import { Navbar } from './components/Navbar';
import { ContentDisplay } from './components/ContentDisplay';
import { Footer } from './components/Footer';
import { ThemeProvider } from './components/ThemeProvider';

function AppContent() {
  const { t } = useTranslation();
  const { isLoaded } = useLanguage();
  const { isDarkMode } = useThemeContext();
  const {
    selection,
    recordIds,
    currentIndex,
    loading,
    error,
    switchRecord,
    updateCellContent
  } = useLarkBase();

  const [isEditMode, setIsEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');

  const handleEditModeChange = (editMode: boolean) => {
    setIsEditMode(editMode);
    if (editMode) {
      // Initialize edit content with current content
      setEditContent(selection.content);
    }
  };

  const handleContentChange = (content: string) => {
    setEditContent(content);
  };

  const handleSave = async (): Promise<boolean> => {
    const success = await updateCellContent(editContent);
    if (success) {
      setIsEditMode(false);
    }
    return success;
  };

  const handleCancel = () => {
    setEditContent(selection.content);
  };

  // 等待语言加载
  if (!isLoaded) {
    return (
      <div className={`h-screen w-full flex flex-col overflow-hidden ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className={`h-screen w-full flex flex-col overflow-hidden ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-red-400 mb-2">{t('common.error')}</p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{error.message || t('common.unknownError')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* 导航栏 */}
      <div className="flex-shrink-0">
        <Navbar    
          recordIdsLength={recordIds.length}
          currentIndex={currentIndex}
          onSwitchRecord={(direction) => void switchRecord(direction)}
          fieldName={selection.fieldName}
        />
      </div>
      
      {/* 主要内容 */}
      <div className="flex-1 min-h-0">
        <ContentDisplay 
          content={selection.content}
          loading={loading}
          error={error}
          isEditMode={isEditMode}
          onContentChange={handleContentChange}
        />
      </div>
      
      {/* 页脚 */}
      <div className="flex-shrink-0">
        <Footer 
          content={isEditMode ? editContent : selection.content}
          fieldName={selection.fieldName}
          currentIndex={currentIndex}
          isEditMode={isEditMode}
          onEditModeChange={handleEditModeChange}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
