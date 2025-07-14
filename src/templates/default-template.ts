import type { Template, RendererOptions } from '../types/template';

export const defaultOptions: RendererOptions = {
  base: {
    themeColor: 'var(--theme-color, #333)',
    fontFamily: '\'Source Han Sans\', -apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif',
    textAlign: 'left',
    lineHeight: '2',
    padding: '1rem 1.5rem',
    maxWidth: '100%',
    margin: '0 auto',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    fontSize: '15px',
    color: 'var(--text-color, #333)'
  },
  block: {
    h1: {
      display: 'block',
      padding: '0 1em 0.5em 1em',
      borderBottom: '2px solid var(--theme-color)',
      margin: '2em auto 1em',
      color: 'var(--theme-color)',
      fontSize: '1.2em',
      fontWeight: 'bold',
      textAlign: 'center',
      textDecoration: 'none',
      pageBreakInside: 'avoid'
    },
    h2: {
      display: 'block',
      padding: '0 0.2em 0.5em 0.2em',
      margin: '2em auto 2em',
      color: 'var(--theme-color)',
      borderBottom: '2px solid var(--theme-color)',
      fontSize: '1.2em',
      fontWeight: 'bold',
      textAlign: 'center',
      textDecoration: 'none',
      pageBreakInside: 'avoid'
    },
    h3: {
      paddingLeft: '12px',
      borderLeft: '4px solid var(--theme-color)',
      margin: '2em 8px 0.75em 0',
      color: 'var(--theme-color)',
      fontSize: '1.1em',
      fontWeight: 'bold',
      lineHeight: '1.2',
      pageBreakInside: 'avoid'
    },
    h4: {
      margin: '2em 8px 0.5em',
      color: 'var(--theme-color)',
      fontSize: '1em',
      fontWeight: 'bold',
      pageBreakInside: 'avoid'
    },
    h5: {
      margin: '1.5em 8px 0.5em',
      color: 'var(--theme-color)',
      fontSize: '1em',
      fontWeight: 'bold',
      pageBreakInside: 'avoid'
    },
    h6: {
      margin: '1.5em 8px 0.5em',
      fontSize: '1em',
      color: 'var(--theme-color)',
      pageBreakInside: 'avoid'
    },
    p: {
      fontSize: 'var(--font-size, 15px)',
      margin: '1.5em 8px',
      letterSpacing: '0.1em',
      color: 'var(--text-color, #333)',
      textAlign: 'justify',
      pageBreakInside: 'avoid'
    },
    blockquote: {
      fontStyle: 'normal',
      padding: '1em',
      borderLeft: '4px solid var(--theme-color)',
      borderRadius: '6px',
      color: 'rgba(0,0,0,0.5)',
      background: 'var(--blockquote-background, #f8f9fa)',
      margin: '0 0 1em 0',
      pageBreakInside: 'avoid'
    },
    code_pre: {
      fontSize: '14px',
      overflowX: 'auto',
      borderRadius: '8px',
      padding: '1em',
      lineHeight: '1.5',
      margin: '10px 8px',
      pageBreakInside: 'avoid'
    },
    code: {
      margin: '0',
      fontFamily: 'Menlo, Operator Mono, Consolas, Monaco, monospace'
    },
    image: {
      display: 'block',
      width: '100% !important',
      margin: '0.1em auto 0.5em',
      borderRadius: '4px'
    },
    ol: {
      paddingLeft: '1em',
      color: 'var(--text-color, #333)',
      listStyleType: 'decimal'
    },
    ul: {
      listStyleType: 'circle',
      paddingLeft: '1em',
      color: 'var(--text-color, #333)'
    },
    footnotes: {
      margin: '0.5em 8px',
      fontSize: '80%',
      color: 'var(--text-color, #333)'
    },
    table: {
      textAlign: 'center',
      margin: '1em 8px',
      color: 'var(--text-color, #333)'
    },
    thead: {
      background: 'rgba(0, 0, 0, 0.05)',
      fontWeight: 'bold',
      color: 'var(--text-color, #333)'
    },
    td: {
      border: '1px solid #dfdfdf',
      padding: '0.25em 0.5em',
      color: '#3f3f3f'
    }
  },
  inline: {
    listitem: {
      display: 'list-item',
      margin: '0.2em 8px',
      color: 'var(--text-color, #333)',
      pageBreakInside: 'avoid'
    },
    codespan: {
      fontSize: '90%',
      color: '#333333',
      background: 'rgba(27,31,35,.05)',
      padding: '3px 5px',
      borderRadius: '4px'
    },
    em: {
      fontStyle: 'italic',
      fontSize: 'inherit'
    },
    link: {
      color: '#576b95'
    },
    strong: {
      color: 'var(--theme-color)',
      fontWeight: 'bold',
      fontSize: 'inherit'
    },
    footnote: {
      fontSize: '12px',
      color: 'var(--text-color, #333)'
    }
  }
};

export const defaultTemplate: Template = {
  id: 'default',
  name: '默认',
  description: '默认文章样式',
  styles: 'default-template',
  options: defaultOptions,
  transform: (html: string) => html
};

export const templates: Template[] = [
  defaultTemplate
]; 