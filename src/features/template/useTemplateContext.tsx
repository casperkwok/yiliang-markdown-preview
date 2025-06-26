import { useContext } from 'react';
import { TemplateContext, TemplateContextType } from './TemplateContext';

export const useTemplateContext = (): TemplateContextType => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplateContext must be used within a TemplateProvider');
  }
  return context;
}; 