import { marked } from 'marked'
import type { RendererOptions } from './types'
import { cssPropertiesToString } from './styles'
import { highlightCode } from './code-highlight'

export class MarkdownRenderer {
  private renderer: marked.Renderer
  private options: RendererOptions

  constructor(options: RendererOptions) {
    this.options = options
    this.renderer = new marked.Renderer()
    this.initializeRenderer()
  }

  private initializeRenderer() {
    // 重写 heading 方法
    this.renderer.heading = (text: string, level: number) => {
      const headingKey = `h${level}` as keyof RendererOptions['block']
      const headingStyle = (this.options.block?.[headingKey] || {})
      const style = {
        ...headingStyle,
        color: this.options.base?.themeColor
      }
      const styleStr = cssPropertiesToString(style)
      return `<h${level}${styleStr ? ` style="${styleStr}"` : ''}>${text}</h${level}>`
    }

    // 重写 paragraph 方法
    this.renderer.paragraph = (text: string) => {
      const paragraphStyle = (this.options.block?.p || {})
      const style = {
        ...paragraphStyle,
        fontSize: this.options.base?.fontSize,
        lineHeight: this.options.base?.lineHeight
      }
      const styleStr = cssPropertiesToString(style)
      return `<p${styleStr ? ` style="${styleStr}"` : ''}>${text}</p>`
    }

    // 重写 blockquote 方法
    this.renderer.blockquote = (text: string) => {
      const blockquoteStyle = (this.options.block?.blockquote || {})
      const style = {
        ...blockquoteStyle,
        borderLeft: `4px solid ${this.options.base?.themeColor || '#1a1a1a'}`
      }
      const styleStr = cssPropertiesToString(style)
      return `<blockquote${styleStr ? ` style="${styleStr}"` : ''}>${text}</blockquote>`
    }

    // 重写 code 方法
    this.renderer.code = (code: string, language: string | undefined) => {
      const codeStyle = (this.options.block?.code_pre || {})
      const style = {
        ...codeStyle
      }
      const styleStr = cssPropertiesToString(style)
      const highlighted = highlightCode(code, language || '', this.options.codeTheme || 'github')
      return `<pre${styleStr ? ` style="${styleStr}"` : ''}><code class="language-${language || ''}">${highlighted}</code></pre>`
    }

    // 重写 codespan 方法
    this.renderer.codespan = (text: string) => {
      const codespanStyle = (this.options.inline?.codespan || {})
      const styleStr = cssPropertiesToString(codespanStyle)
      return `<code${styleStr ? ` style="${styleStr}"` : ''}>${text}</code>`
    }

    // 重写 em 方法
    this.renderer.em = (text: string) => {
      const emStyle = (this.options.inline?.em || {})
      const style = {
        ...emStyle,
        fontStyle: 'italic'
      }
      const styleStr = cssPropertiesToString(style)
      return `<em${styleStr ? ` style="${styleStr}"` : ''}>${text}</em>`
    }

    // 重写 strong 方法
    this.renderer.strong = (text: string) => {
      const strongStyle = (this.options.inline?.strong || {})
      const style = {
        ...strongStyle,
        color: this.options.base?.themeColor,
        fontWeight: 'bold'
      }
      const styleStr = cssPropertiesToString(style)
      return `<strong${styleStr ? ` style="${styleStr}"` : ''}>${text}</strong>`
    }

    // 重写 link 方法
    this.renderer.link = (href: string, title: string | null | undefined, text: string) => {
      const linkStyle = (this.options.inline?.link || {})
      const styleStr = cssPropertiesToString(linkStyle)
      return `<a href="${href}"${title ? ` title="${title}"` : ''}${styleStr ? ` style="${styleStr}"` : ''}>${text}</a>`
    }

    // 重写 image 方法
    this.renderer.image = (href: string, title: string | null | undefined, text: string) => {
      const imageStyle = (this.options.block?.image || {})
      const style = {
        ...imageStyle,
        maxWidth: '100%',
        display: 'block',
        margin: '0.5em auto'
      }
      const styleStr = cssPropertiesToString(style)
      return `<img src="${href}"${title ? ` title="${title}"` : ''} alt="${text}"${styleStr ? ` style="${styleStr}"` : ''}>`
    }

    // 重写 list 方法
    this.renderer.list = (body: string, ordered: boolean, start: number | '') => {
      const tag = ordered ? 'ol' : 'ul'
      const listStyle = (this.options.block?.[tag] || {})
      const style = {
        ...listStyle,
        listStyle: ordered ? 'decimal' : 'disc',
        paddingLeft: '2em',
        marginBottom: '16px'
      }
      const styleStr = cssPropertiesToString(style)
      const startAttr = ordered && start !== 1 ? ` start="${start}"` : ''
      return `<${tag}${startAttr}${styleStr ? ` style="${styleStr}"` : ''}>${body}</${tag}>`
    }

    // 重写 listitem 方法
    this.renderer.listitem = (text: string, task: boolean, checked: boolean) => {
      const listitemStyle = (this.options.inline?.listitem || {})
      const style = {
        ...listitemStyle,
        marginBottom: '8px',
        display: 'list-item'
      }
      const styleStr = cssPropertiesToString(style)
      
      let content = text
      if (task) {
        const checkbox = `<input type="checkbox"${checked ? ' checked=""' : ''} disabled="" /> `
        content = checkbox + content
      }
      
      return `<li${styleStr ? ` style="${styleStr}"` : ''}>${content}</li>`
    }

    // 重写 del 方法
    this.renderer.del = (text: string) => {
      const delStyle = (this.options.inline?.del || {})
      const styleStr = cssPropertiesToString(delStyle)
      return `<del${styleStr ? ` style="${styleStr}"` : ''}>${text}</del>`
    }
  }

  public getRenderer(): marked.Renderer {
    return this.renderer
  }
} 