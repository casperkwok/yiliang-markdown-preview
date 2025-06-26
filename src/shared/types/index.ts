// Selection related types
export type SelectionState = {
    fieldId: string | undefined
    recordId: string | undefined
    content: string
    fieldName: string
}

export type SelectionChangeEvent = {
    data: {
        fieldId: string | null
        recordId: string | null
    }
}

// Bitable SDK related types
export interface IField {
    getName(): Promise<string>;
}

export interface ITable {
    getActiveView(): Promise<IView>;
    getCellString(fieldId: string, recordId: string): Promise<string | null>;
    getFieldById(fieldId: string): Promise<IField>;
}

export interface IView {
    getVisibleRecordIdList(): Promise<string[]>;
}

export interface IBase {
    getActiveTable(): Promise<ITable>;
    onSelectionChange(callback: (event: SelectionChangeEvent) => void): () => void;
}

export interface IBitable {
    base: IBase;
    bridge: IBitableBridge;
}

// Theme related types
export enum ThemeModeType {
    LIGHT = "LIGHT",
    DARK = "DARK"
}

// Config option interface
export interface IConfigOption<T = string> {
  label: string;
  value: T;
  desc: string;
}

export type ThemeContextType = {
    theme: ThemeModeType;
    isDarkMode: boolean;
}

export type ThemeModeCtx = {
    theme: ThemeModeType;
}

export interface IEventCbCtx<T> {
    data: T;
}

export interface IBitableBridge {
    getTheme(): Promise<ThemeModeType>;
    onThemeChange(callback: (event: IEventCbCtx<ThemeModeCtx>) => void): () => void;
} 