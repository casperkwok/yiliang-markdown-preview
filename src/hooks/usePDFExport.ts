/**
 * @file usePDFExport.ts
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description PDF导出Hook，使用html2pdf.js服务
 */
import { useCallback } from "react";
import { exportPreviewToPDF } from "../services/pdfService";

interface ExportResult {
  success: boolean;
  message?: string;
}

export const usePDFExport = () => {
  const handleExport = useCallback(
    async (filename: string): Promise<ExportResult> => {
      try {
        // 调用PDF服务导出
        const result = await exportPreviewToPDF(filename);

        return result;
      } catch (error) {
        console.error("PDF export error:", error);
        return {
          success: false,
          message: error instanceof Error ? error.message : "导出失败，请重试",
        };
      }
    },
    []
  );

  return {
    handleExport,
  };
};
