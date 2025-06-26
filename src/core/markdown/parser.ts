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
      // 处理 ** 语法，但排除已经是 HTML 的部分
      .replace(/(?<!<[^>]*)\*\*([^*]+)\*\*(?![^<]*>)/g, '<strong>$1</strong>')
      // 处理无序列表的 - 标记，但排除代码块内的部分
      .replace(/^(?!\s*```)([ \t]*)-\s+/gm, '$1• ')
  }
} 