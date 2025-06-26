import { MarkdownParser } from './parser'
import type { RendererOptions } from './types'
import { getCodeThemeStyles } from './styles'

export const defaultOptions: RendererOptions = {
  base: {
    fontSize: '16px',
    lineHeight: '1.75',
    color: '#333333',
    padding: '20px',
    themeColor: '#1a1a1a'
  },
  block: {
    h1: {
      fontSize: '24px',
      fontWeight: 'bold',
      lineHeight: 1.5,
      margin: '24px 0 16px 0',
      padding: '0',
      borderBottom: '2px solid #1a1a1a'
    },
    h2: {
      fontSize: '20px',
      fontWeight: 'bold',
      lineHeight: 1.5,
      margin: '24px 0 16px 0',
      padding: '0',
      borderBottom: '1px solid #1a1a1a'
    },
    h3: {
      fontSize: '18px',
      fontWeight: 'bold',
      lineHeight: 1.5,
      margin: '24px 0 16px 0',
      padding: '0'
    },
    h4: {
      fontSize: '16px',
      fontWeight: 'bold',
      lineHeight: 1.5,
      margin: '24px 0 16px 0',
      padding: '0'
    },
    h5: {
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: 1.5,
      margin: '24px 0 16px 0',
      padding: '0'
    },
    h6: {
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: 1.5,
      margin: '24px 0 16px 0',
      padding: '0'
    },
    p: {
      margin: '16px 0',
      lineHeight: 1.75
    },
    blockquote: {
      margin: '16px 0',
      padding: '0 16px',
      color: '#666666',
      borderLeft: '4px solid #dddddd',
      backgroundColor: '#f5f5f5'
    },
    code_pre: {
      margin: '16px 0',
      padding: '16px',
      borderRadius: '4px',
      backgroundColor: '#f6f8fa',
      fontSize: '14px',
      lineHeight: 1.5,
      overflowX: 'auto'
    }
  },
  inline: {
    codespan: {
      padding: '2px 4px',
      borderRadius: '4px',
      backgroundColor: '#f6f8fa',
      fontSize: '14px'
    },
    strong: {
      fontWeight: 'bold'
    },
    em: {
      fontStyle: 'italic'
    },
    del: {
      textDecoration: 'line-through'
    },
    link: {
      color: '#0366d6',
      textDecoration: 'none'
    }
  }
}

export async function convertToWechat(markdown: string, options: RendererOptions = defaultOptions): Promise<string> {
  const mergedOptions: RendererOptions = {
    base: { ...defaultOptions.base, ...options.base },
    block: { ...defaultOptions.block, ...options.block },
    inline: { ...defaultOptions.inline, ...options.inline },
    codeTheme: options.codeTheme || 'github'
  }

  const parser = new MarkdownParser(mergedOptions)
  return await parser.parse(markdown)
}

export { getCodeThemeStyles }
export type { RendererOptions }
export * from './types' 