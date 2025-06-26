import { createContext } from 'react';

export interface TemplateContextType {
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
}

export const TemplateContext = createContext<TemplateContextType | undefined>(undefined); 