/**
 * @file lark.ts
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 飞书多维表格相关类型定义
 */

// 选区变化事件
export interface SelectionChangeEvent {
    data: {
        fieldId: string;
        recordId: string;
        tableId?: string;
        viewId?: string;
    };
}

// 单元格值变化事件
export interface CellValueChangeEvent {
    data: {
        fieldId: string;
        recordId: string;
        oldValue: unknown;
        newValue: unknown;
    };
}

// 选择状态
export interface SelectionState {
    fieldId?: string;
    recordId?: string;
    content: string;
    fieldName: string;
}

// 字段接口
export interface IField {
    getName(): Promise<string>;
    getId(): string;
    getType(): Promise<string>;
    // 其他字段方法可以根据需要添加
}

// 记录接口
export interface IRecord {
    getId(): string;
    getCellValue(fieldId: string): Promise<unknown>;
    setCellValue(fieldId: string, value: unknown): Promise<void>;
    // 其他记录方法可以根据需要添加
}

// 视图接口
export interface IView {
    getId(): string;
    getName(): Promise<string>;
    getVisibleRecordIdList(): Promise<string[]>;
    getVisibleFieldIdList(): Promise<string[]>;
    // 其他视图方法可以根据需要添加
}

// 表格接口
export interface ITable {
    getId(): string;
    getName(): Promise<string>;
    getActiveView(): Promise<IView>;
    getFieldById(fieldId: string): Promise<IField>;
    getRecordById(recordId: string): Promise<IRecord>;
    getCellValue(fieldId: string, recordId: string): Promise<unknown>;
    getCellString(fieldId: string, recordId: string): Promise<string>;
    setCellValue(fieldId: string, recordId: string, value: unknown): Promise<void>;
    // 其他表格方法可以根据需要添加
}

// 基础接口
export interface IBase {
    getActiveTable(): Promise<ITable>;
    onSelectionChange(callback: (event: SelectionChangeEvent) => void): () => void;
    onCellValueChange(callback: (event: CellValueChangeEvent) => void): () => void;
    // 其他基础方法可以根据需要添加
}

// 多维表格SDK主接口
export interface IBitable {
    base: IBase;
    // 其他SDK方法可以根据需要添加
}

// 富文本节点接口
export interface RichTextNode {
    type: string;
    text?: string;
    [key: string]: unknown;
}

// SDK加载状态
export interface SDKState {
    bitable: IBitable | null;
    loaded: boolean;
    loading: boolean;
    error: Error | null;
}

// 导出所有类型（已经通过 export interface 导出，无需重复导出） 