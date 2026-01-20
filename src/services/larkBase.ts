/**
 * @file larkBase.ts
 * @author CK
 * @date 2025-07-13
 * @version 1.0.0
 * @description 飞书多维表格服务层，封装SDK操作
 */

import { bitable } from "@lark-base-open/js-sdk";
import type { IEventCbCtx, ThemeModeCtx } from "../types/template";

export class LarkBaseService {
  /**
   * 获取当前活动表格
   */
  async getActiveTable() {
    return await bitable.base.getActiveTable();
  }

  /**
   * 获取单元格内容
   */
  async getCellContent(fieldId: string, recordId: string): Promise<string> {
    const table = await this.getActiveTable();
    const cellValue = await table.getCellString(fieldId, recordId);
    return cellValue || "";
  }

  /**
   * 设置单元格内容
   */
  async setCellContent(
    fieldId: string,
    recordId: string,
    value: string
  ): Promise<void> {
    const table = await this.getActiveTable();
    await table.setCellValue(fieldId, recordId, value);
  }

  /**
   * 获取字段名称
   */
  async getFieldName(fieldId: string): Promise<string> {
    const table = await this.getActiveTable();
    const field = await table.getFieldById(fieldId);
    return await field.getName();
  }

  /**
   * 获取可见记录ID列表
   */
  async getRecordIds(): Promise<string[]> {
    const table = await this.getActiveTable();
    const view = await table.getActiveView();
    const ids = await view.getVisibleRecordIdList();
    return ids.filter((id): id is string => id !== undefined);
  }

  /**
   * 获取可见字段列表
   */
  async getVisibleFields(): Promise<{ id: string; name: string }[]> {
    const table = await this.getActiveTable();
    const view = await table.getActiveView();
    const fieldIds = await view.getVisibleFieldIdList();

    const fields = await Promise.all(
      fieldIds.map(async (fieldId) => {
        const field = await table.getFieldById(fieldId);
        const name = await field.getName();
        return { id: fieldId, name };
      })
    );

    return fields;
  }

  /**
   * 监听选区变化
   */
  onSelectionChange(
    callback: (event: {
      data: { fieldId: string | null; recordId: string | null };
    }) => void
  ) {
    return bitable.base.onSelectionChange(callback);
  }

  /**
   * 获取当前主题模式
   */
  async getTheme(): Promise<"light" | "dark"> {
    try {
      if (
        typeof bitable !== "undefined" &&
        bitable.bridge &&
        bitable.bridge.getTheme
      ) {
        const theme = await bitable.bridge.getTheme();
        // 将 Lark Base 的主题类型转换为我们的类型
        return theme === "DARK" ? "dark" : "light";
      }
      // 如果不在 Lark Base 环境中，返回系统偏好
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch (error) {
      console.warn("Failed to get theme from Lark Base:", error);
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
  }

  /**
   * 监听主题变化
   */
  onThemeChange(callback: (theme: "light" | "dark") => void): () => void {
    try {
      if (
        typeof bitable !== "undefined" &&
        bitable.bridge &&
        bitable.bridge.onThemeChange
      ) {
        return bitable.bridge.onThemeChange(
          (event: IEventCbCtx<ThemeModeCtx>) => {
            // 将 Lark Base 的主题事件转换为我们的类型
            const theme = event.data?.theme;
            callback(theme === "DARK" ? "dark" : "light");
          }
        );
      }
      // 如果不在 Lark Base 环境中，监听系统主题变化
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        callback(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } catch (error) {
      console.warn("Failed to listen to theme changes from Lark Base:", error);
      // 降级到系统主题监听
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        callback(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }

  /**
   * 获取当前选区（用于确定要把附件存到哪一行）
   */
  async getSelection() {
    return await bitable.base.getSelection();
  }

  /**
   * 将文件保存到附件字段
   * @param file 文件对象
   * @param recordId 目标记录ID（如果为空则尝试获取当前选中行）
   */
  async saveToAttachment(file: File, recordId?: string): Promise<{ success: boolean; message: string }> {
    try {
      const table = await this.getActiveTable();

      // 1. 确定 Record ID
      let targetRecordId = recordId;
      if (!targetRecordId) {
        const selection = await this.getSelection();
        targetRecordId = selection?.recordId || undefined;
      }

      if (!targetRecordId) {
        return { success: false, message: "未选中任何记录，无法保存" };
      }

      // 2. 寻找合适的附件字段
      // 优先找名字包含 "附件"、"PDF"、"简历" 的字段，且类型必须是 Attachment (17)
      const visibleFields = await this.getVisibleFields();

      let targetFieldId: string | null = null;

      // 遍历字段获取详细信息
      for (const fieldMeta of visibleFields) {
        const field = await table.getFieldById(fieldMeta.id);
        const type = await field.getType();
        const name = await field.getName();

        // Attachment 类型通常是 17
        if (type === 17) {
          // 检查名字
          if (
            name.includes("附件") ||
            name.includes("PDF") ||
            name.includes("简历") ||
            name.includes("报告") ||
            name === "Attachment"
          ) {
            targetFieldId = fieldMeta.id;
            break;
          }
        }
      }

      // 如果没找到名字匹配的，找第一个附件类型的字段
      if (!targetFieldId) {
        for (const fieldMeta of visibleFields) {
          const field = await table.getFieldById(fieldMeta.id);
          const type = await field.getType();
          if (type === 17) {
            targetFieldId = fieldMeta.id;
            break;
          }
        }
      }

      // 自动创建 "PDF附件" 字段 (User Feature Request)
      if (!targetFieldId) {
        try {
          console.log("未找到附件字段，尝试自动创建 'PDF附件' 字段...");
          targetFieldId = await table.addField({
            type: 17, // Attachment
            name: "PDF附件"
          });
        } catch (createError) {
          console.error("自动创建字段失败:", createError);
        }
      }

      if (!targetFieldId) {
        return { success: false, message: "当前表格没有找到附件字段，且自动创建失败。" };
      }

      // 3. 上传文件处理 (Robust Logic)
      let attachmentObj: any = file;

      try {
        console.log("尝试上传文件...", file.name);

        // 策略1: 尝试使用 batchUploadFile (官方推荐)
        // @ts-ignore
        if (bitable.base.batchUploadFile) {
          // @ts-ignore
          const tokens = await bitable.base.batchUploadFile([file]);
          if (tokens && tokens.length > 0) {
            console.log("通过 batchUploadFile 上传成功，Token:", tokens[0]);
            attachmentObj = {
              name: file.name,
              type: file.type,
              token: tokens[0],
              size: file.size,
              timeStamp: Date.now()
            };
          }
        }
        // 策略2: 尝试使用 uploadFile (旧版，可能 deprecated 但兼容性好)
        // @ts-ignore
        else if (bitable.base.uploadFile) {
          console.log("batchUploadFile 不存在，降级尝试 uploadFile...");
          // @ts-ignore
          const token = await bitable.base.uploadFile(file);
          console.log("通过 uploadFile 上传成功，Token:", token);
          attachmentObj = {
            name: file.name,
            type: file.type,
            token: token,
            size: file.size,
            timeStamp: Date.now()
          };
        }
        else {
          console.log("未找到显式上传接口，将直接写入 File 对象到单元格...");
        }

      } catch (uploadError) {
        console.warn("显式上传失败，降级为直接写入 File 对象。错误详情:", uploadError);
        // 上传失败不阻断，继续尝试直接写入 File，让 setCellValue 内部去处理
        attachmentObj = file;
      }

      // 4. 读取该字段现有的内容 (避免覆盖)
      let currentAttachments: any[] = [];
      try {
        const val = await table.getCellValue(targetFieldId, targetRecordId);
        if (Array.isArray(val)) {
          currentAttachments = val;
        }
      } catch (e) {
        // 忽略
      }

      // 5. 追加附件
      const newAttachments = [...currentAttachments, attachmentObj];
      await table.setCellValue(targetFieldId, targetRecordId, newAttachments);

      const fieldName = await this.getFieldName(targetFieldId);
      return { success: true, message: `已成功保存到【${fieldName}】字段` };

    } catch (error) {
      console.error("保存附件失败:", error);
      return { success: false, message: error instanceof Error ? error.message : "保存失败（请检查网络或刷新重试）" };
    }
  }
}

// 创建单例实例
export const larkBaseService = new LarkBaseService();
