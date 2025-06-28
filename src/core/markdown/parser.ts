import { marked } from 'marked'
import type { RendererOptions } from './types'
import { MarkdownRenderer } from './renderer'
import { baseStylesToString } from './styles'

interface ListItem {
  task?: boolean
  checked?: boolean
  type: string
}

interface ListToken {
  type: 'list'
  items: ListItem[]
}

export class MarkdownParser {
  private options: RendererOptions
  private renderer: MarkdownRenderer

  constructor(options: RendererOptions) {
    this.options = options
    this.renderer = new MarkdownRenderer(options)
    this.initializeMarked()
  }

  private initializeMarked() {
    marked.setOptions({
      gfm: true,
      breaks: true,
      pedantic: false,
      renderer: this.renderer.getRenderer()
    })

    marked.use({
      breaks: true,
      gfm: true,
      walkTokens(token: { type: string }) {
        // 确保列表项被正确处理
        if (token.type === 'list') {
          const listToken = token as ListToken
          listToken.items.forEach((item: ListItem) => {
            if (item.task) {
              item.checked = !!item.checked
            }
          })
        }
      }
    })
  }

  public async parse(markdown: string): Promise<string> {
    const preprocessed = this.preprocessMarkdown(markdown)
    const html = await Promise.resolve(marked(preprocessed))
    const baseStyles = baseStylesToString(this.options.base)
    return baseStyles ? `<section style="${baseStyles}">${html}</section>` : html
  }

  // 预处理 markdown 文本
  private preprocessMarkdown(markdown: string): string {
    return markdown
      // 处理自定义 text_tag 标签
      .replace(/<text_tag\s+color='([^']+)'>(.*?)<\/text_tag>/g, (_match: string, color: string, content: string) => {
        return this.renderTextTag(content, color)
      })
      // 处理 ** 语法，但排除已经是 HTML 的部分
      .replace(/(?<!<[^>]*)\*\*([^*]+)\*\*(?![^<]*>)/g, '<strong>$1</strong>')
      // 处理无序列表的 - 标记，但排除代码块内的部分
      .replace(/^(?!\s*```)([ \t]*)-\s+/gm, '$1• ')
  }

  // 渲染自定义文本标签
  private renderTextTag(content: string, color: string): string {
    const colorMap: { [key: string]: string } = {
      'purple': '#8b5cf6',
      'green': '#10b981',
      'blue': '#3b82f6',
      'red': '#ef4444',
      'yellow': '#f59e0b',
      'gray': '#6b7280',
      'indigo': '#6366f1',
      'pink': '#ec4899'
    }
    
    const textColor = colorMap[color] || color
    
    // Only apply color to the text, for maximum PDF compatibility.
    return `<span style="color: ${textColor}; font-weight: bold; font-family: 'Source Han Sans TC', sans-serif;">${content}</span>`
  }
} 