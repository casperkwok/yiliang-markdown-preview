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
}

// 创建单例实例
export const larkBaseService = new LarkBaseService();
