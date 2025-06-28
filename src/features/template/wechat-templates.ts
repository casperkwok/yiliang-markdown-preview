import type { RendererOptions } from '../../core/markdown'

export interface Template {
  id: string
  name: string
  description: string
  styles: string
  options: RendererOptions
  transform?: (html: string) => string | { html?: string; content?: string }
}

export const templates: Template[] = [
  {
    id: 'wechat',
    name: '默认主题',
    description: '微信公众号文章样式',
    styles: 'wechat-template',
    options: {
        base: {
            themeColor: 'var(--themeColor, rgb(0, 0, 0))',
            fontFamily: '\'Source Han Sans\', -apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif',
            textAlign: 'left',
            lineHeight: '2',
            padding: '1rem 1.5rem',
            maxWidth: '100%',
            margin: '0 auto',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            fontSize: '15px',
            color: '#333'
          },
          block: {                // 一级标题
            h1: {
              display: 'block',
              padding: '0 1em 0.5em 1em',
              borderBottom: '2px solid var(--themeColor)',
              margin: '2em auto 1em',
              color: 'var(--themeColor)',
              fontSize: '1.2em',
              fontWeight: 'bold',
              textAlign: 'center',
              textDecoration: 'none',
              pageBreakInside: 'avoid'
            },
        
            // 二级标题
            h2: {
              display: 'block',
              padding: '0 0.2em 0.5em 0.2em',
              margin: '2em auto 2em',
              color: 'var(--themeColor)',
              borderBottom: '2px solid var(--themeColor)',
              fontSize: '1.2em',
              fontWeight: 'bold',
              textAlign: 'center',
              textDecoration: 'none',
              pageBreakInside: 'avoid'
            },
        
            // 三级标题
            h3: {
              paddingLeft: '12px',
              borderLeft: '4px solid var(--themeColor)',
              margin: '2em 8px 0.75em 0',
              color: 'var(--themeColor)',
              fontSize: '1.1em',
              fontWeight: 'bold',
              lineHeight: '1.2',
              pageBreakInside: 'avoid'
            },
        
            // 四级标题
            h4: {
              'margin': `2em 8px 0.5em`,
              'color': `var(--themeColor)`,
              'fontSize': `1em`,
              'fontWeight': `bold`,
              pageBreakInside: 'avoid'
            },
        
            // 五级标题
            h5: {
              'margin': `1.5em 8px 0.5em`,
              'color': `var(--themeColor)`,
              'fontSize': `1em`,
              'fontWeight': `bold`,
              pageBreakInside: 'avoid'
            },
        
            // 六级标题
            h6: {
              'margin': `1.5em 8px 0.5em`,
              'fontSize': `1em`,
              'color': `var(--themeColor)`,
              pageBreakInside: 'avoid'
            },
        
            // 段落
            p: {
              'fontSize': `var(--fontSize)`,
              'margin': `1.5em 8px`,
              'letterSpacing': `0.1em`,
              'color': `hsl(var(--foreground))`,
              'textAlign': `justify`,
              pageBreakInside: 'avoid'
            },
        
            // 引用
            blockquote: {
              fontStyle: 'normal',
              padding: '1em',
              borderLeft: '4px solid var(--themeColor)',
              borderRadius: '6px',
              color: 'rgba(0,0,0,0.5)',
              background: 'var(--blockquote-background)',
              margin: '0 0 1em 0',
              pageBreakInside: 'avoid'
            },
        
            // 代码块
            code_pre: {
              'fontSize': `14px`,
              'overflowX': `auto`,
              'borderRadius': `8px`,
              'padding': `1em`,
              'lineHeight': `1.5`,
              'margin': `10px 8px`,
              pageBreakInside: 'avoid'
            },
        
            // 行内代码
            code: {
              margin: '0',
              fontFamily: 'Menlo, Operator Mono, Consolas, Monaco, monospace'
            },
        
            // 图片
            image: {
              'display': `block`,
              'width': `100% !important`,
              'margin': `0.1em auto 0.5em`,
              'borderRadius': `4px`,
            },
        
            // 有序列表
            ol: {
              paddingLeft: '1em',
              color: 'hsl(var(--foreground))'
            },
        
            // 无序列表
            ul: {
              listStyle: 'circle',
              paddingLeft: '1em',
              color: 'hsl(var(--foreground))'
            },
        
            footnotes: {
              'margin': `0.5em 8px`,
              'fontSize': `80%`,
              'color': `hsl(var(--foreground))`,
            },

            table: {
              textAlign: 'center',
              margin: '1em 8px',
              color: 'hsl(var(--foreground))'
            },

            thead: {
              'background': `rgba(0, 0, 0, 0.05)`,
              'fontWeight': `bold`,
              'color': `hsl(var(--foreground))`,
            },

            td: {
              border: '1px solid #dfdfdf',
              padding: '0.25em 0.5em',
              color: '#3f3f3f',
            },

          
          },
          inline: {
            listitem: {
              display: 'block',
              margin: '0.2em 8px',
              color: 'hsl(var(--foreground))',
              pageBreakInside: 'avoid'
            },
        
            codespan: {
              'fontSize': `90%`,
              'color': `#333333`,
              'background': `rgba(27,31,35,.05)`,
              'padding': `3px 5px`,
              'borderRadius': `4px`,
              // 'word-break': `break-all`,
            },
        
            em: {
              'fontStyle': `italic`,
              'fontSize': `inherit`,
            },
        
            link: {
              color: `#576b95`,
            },
      
            // 字体加粗样式
            strong: {
              'color': `var(--themeColor)`,
              'fontWeight': `bold`,
              'fontSize': `inherit`,
            },
        
            footnote: {
              'fontSize': `12px`,
              'color': `hsl(var(--foreground))`,
            }
          }
        },
        transform: (html: string) => html
  }
]; 