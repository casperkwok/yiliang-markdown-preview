export interface RendererOptions {
  base: {
    themeColor: string;
    fontFamily: string;
    textAlign: string;
    lineHeight: string;
    padding: string;
    maxWidth: string;
    margin: string;
    wordBreak: string;
    whiteSpace: string;
    fontSize: string;
    color: string;
  };
  block: {
    h1: Record<string, string>;
    h2: Record<string, string>;
    h3: Record<string, string>;
    h4: Record<string, string>;
    h5: Record<string, string>;
    h6: Record<string, string>;
    p: Record<string, string>;
    blockquote: Record<string, string>;
    code_pre: Record<string, string>;
    code: Record<string, string>;
    image: Record<string, string>;
    ol: Record<string, string>;
    ul: Record<string, string>;
    footnotes: Record<string, string>;
    table: Record<string, string>;
    thead: Record<string, string>;
    td: Record<string, string>;
  };
  inline: {
    listitem: Record<string, string>;
    codespan: Record<string, string>;
    em: Record<string, string>;
    link: Record<string, string>;
    strong: Record<string, string>;
    footnote: Record<string, string>;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  styles: string;
  options: RendererOptions;
  transform?: (html: string) => string | { html?: string; content?: string };
}

export type CodeThemeId = 
  | 'github'
  | 'github-dark'
  | 'monokai'
  | 'solarized-light'
  | 'solarized-dark'
  | 'vs'
  | 'vs-dark'
  | 'atom-one-light'
  | 'atom-one-dark';

export interface CodeTheme {
  id: CodeThemeId;
  name: string;
  className: string;
}

export const ThemeModeType = {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
  AUTO: 'AUTO'
} as const;

export type ThemeModeType = typeof ThemeModeType[keyof typeof ThemeModeType];

export interface ThemeContextType {
  theme: ThemeModeType;
  isDarkMode: boolean;
}

export interface ThemeModeCtx {
  theme: ThemeModeType;
}

export interface IEventCbCtx<T = unknown> {
  data: T;
} 