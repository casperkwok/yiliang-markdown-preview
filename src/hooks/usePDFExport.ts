/**
 * @file usePDFExport.ts
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description PDF导出Hook，使用html2pdf.js服务
 */
import { useCallback } from "react";
import { exportRemotePDF } from "../services/remotePdfService";

interface ExportResult {
  success: boolean;
  message?: string;
}

export const usePDFExport = () => {
  const handleExport = useCallback(
    async (filename: string): Promise<ExportResult> => {
      try {
        // 切换到远程后端生成服务，实现“点击即下载”且样式完美
        const result = await exportRemotePDF("preview-content", {
          filename,
        });

        // 成功处理由 remotePdfService 内部处理 (包括触发下载)
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
