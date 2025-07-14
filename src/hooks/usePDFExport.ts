/**
 * @file usePDFExport.ts
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description PDF导出Hook，使用html2pdf.js服务
 */
import { useCallback } from 'react';
import { exportPreviewToPDF } from '../services/pdfService';

interface ExportResult {
  success: boolean;
  message?: string;
}

export const usePDFExport = () => {
  const handleExport = useCallback(async (
    fieldName?: string,
    currentIndex?: number
  ): Promise<ExportResult> => {
    try {
      // 生成文件名
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
      
      let filename = 'markdown-preview';
      if (fieldName && currentIndex !== undefined && currentIndex >= 0) {
        filename = `${fieldName}_${currentIndex + 1}_${dateStr}`;
      } else {
        filename = `markdown-preview_${dateStr}`;
      }
      
      // 确保文件名以.pdf结尾
      if (!filename.endsWith('.pdf')) {
        filename += '.pdf';
      }
      
      // 调用PDF服务导出
      const result = await exportPreviewToPDF(filename);
      
      return result;
    } catch (error) {
      console.error('PDF export error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '导出失败，请重试'
      };
    }
  }, []);

  return {
    handleExport
  };
}; 