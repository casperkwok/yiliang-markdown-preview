import { marked } from 'marked';
import type { Template, CodeThemeId } from '../types/template';
import { getCodeThemeClassName } from '../utils/code-themes';
import { katexExtension } from './mathExtension';

// Configure marked with extensions
marked.use({
  breaks: true,
  gfm: true,
  extensions: [katexExtension]
});

export interface MarkdownProcessorOptions {
  template: Template;
  codeTheme?: CodeThemeId;
  isDarkMode?: boolean;
}

export class MarkdownProcessor {
  private template: Template;
  private codeTheme: CodeThemeId;
  private isDarkMode: boolean;

  constructor(options: MarkdownProcessorOptions) {
    this.template = options.template;
    this.codeTheme = options.codeTheme || 'github';
    this.isDarkMode = options.isDarkMode || false;
  }

  private getStylesForElement(styleObj: Record<string, string>): string {
    return Object.entries(styleObj)
      .map(([key, value]) => `${this.camelToKebab(key)}: ${value}`)
      .join('; ');
  }

  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  private applyTemplateStyles(html: string): string {
    const options = this.template.options;
    
    // Apply styles to various elements
    const styleMap = {
      'h1': options.block.h1,
      'h2': options.block.h2,
      'h3': options.block.h3,
      'h4': options.block.h4,
      'h5': options.block.h5,
      'h6': options.block.h6,
      'p': options.block.p,
      'blockquote': options.block.blockquote,
      'pre': options.block.code_pre,
      'code': options.inline.codespan,
      'img': options.block.image,
      'ol': options.block.ol,
      'ul': options.block.ul,
      'li': options.inline.listitem,
      'strong': options.inline.strong,
      'em': options.inline.em,
      'a': options.inline.link,
      'table': options.block.table,
      'thead': options.block.thead,
      'td': options.block.td,
      'th': options.block.td,
    };

    // Apply styles to each element type
    Object.entries(styleMap).forEach(([tag, styles]) => {
      const styleString = this.getStylesForElement(styles);
      const regex = new RegExp(`<${tag}([^>]*)>`, 'g');
      html = html.replace(regex, (match, attributes) => {
        const existingStyle = attributes.match(/style="([^"]*)"/);
        const newStyle = existingStyle 
          ? `style="${existingStyle[1]}; ${styleString}"` 
          : `style="${styleString}"`;
        
        if (existingStyle) {
          return match.replace(/style="[^"]*"/, newStyle);
        } else {
          return `<${tag}${attributes} ${newStyle}>`;
        }
      });
    });

    // Add code theme class to pre elements
    const codeThemeClass = getCodeThemeClassName(this.codeTheme);
    html = html.replace(/<pre([^>]*)>/g, `<pre$1 class="${codeThemeClass}">`);

    return html;
  }

  public process(markdown: string): string {
    if (!markdown.trim()) {
      return '';
    }

    try {
      // Pre-process Mermaid blocks to prevent them from being treated as code blocks
      const processedMarkdown = this.preprocessMermaidBlocks(markdown);
      
      // Process markdown to HTML
      let html = marked(processedMarkdown) as string;

      // Apply template styles
      html = this.applyTemplateStyles(html);

      // Apply template transform if available
      if (this.template.transform) {
        const result = this.template.transform(html);
        html = typeof result === 'string' ? result : result.html || result.content || html;
      }

      // Wrap with base styles
      const baseStyles = this.getStylesForElement(this.template.options.base);
      const darkClass = this.isDarkMode ? ' dark' : '';
      html = `<div class="markdown-preview ${this.template.styles}${darkClass}" style="${baseStyles}">${html}</div>`;

      return html;
    } catch (error) {
      console.error('Error processing markdown:', error);
      return `<div class="markdown-error">Error processing markdown content</div>`;
    }
  }

  private preprocessMermaidBlocks(markdown: string): string {
    // Replace mermaid code blocks with custom tokens
    // Updated regex to handle cases where closing ``` might be missing or at the end
    const mermaidRegex = /```mermaid\s*\n([\s\S]*?)(?:\n```|$)/g;
    let diagramCounter = 0;
    
    return markdown.replace(mermaidRegex, (_, diagramText) => {
      const diagramId = `mermaid-diagram-${Date.now()}-${++diagramCounter}`;
      const encodedText = encodeURIComponent(diagramText.trim());
      
      return `<div class="mermaid-diagram" data-diagram-id="${diagramId}" data-diagram-text="${encodedText}">
        <div class="mermaid-loading" style="color: var(--text-color, #666); font-style: italic;">Loading diagram...</div>
      </div>`;
    });
  }

  public updateTemplate(template: Template): void {
    this.template = template;
  }

  public updateCodeTheme(codeTheme: CodeThemeId): void {
    this.codeTheme = codeTheme;
  }

  public updateDarkMode(isDarkMode: boolean): void {
    this.isDarkMode = isDarkMode;
  }
} 