/**
 * @file pdfService.ts
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description PDF生成服务，使用html2pdf.js保持完全样式一致性
 */

interface PDFOptions {
  filename: string;
  quality?: number;
  format?: string;
  orientation?: 'portrait' | 'landscape';
}

interface ExportResult {
  success: boolean;
  message?: string;
  blob?: Blob;
}

/**
 * 将HTML元素转换为PDF
 * @param element - 要转换的HTML元素
 * @param options - PDF选项
 * @returns 导出结果
 */
export const exportElementToPDF = async (
  element: HTMLElement,
  options: PDFOptions
): Promise<ExportResult> => {
  try {
    // Dynamically import html2pdf to reduce initial bundle size
    const { default: html2pdf } = await import('html2pdf.js');
    
    // 克隆元素以避免影响原始DOM
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // 强制使用 light 模式样式进行 PDF 导出
    forceLightModeForPDF(clonedElement);
    
    // 添加PDF专用样式修复
    addPDFStyles(clonedElement);
    
    // 简化的html2pdf配置
    const opt = {
      margin: 1,
      filename: options.filename,
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait'
      }
    };

    console.log('Starting PDF export...');
    await html2pdf().set(opt).from(clonedElement).save();
    console.log('PDF export completed successfully');
    
    return {
      success: true,
      message: 'PDF导出成功'
    };
  } catch (error) {
    console.error('PDF export failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '导出失败，请重试'
    };
  }
};

/**
 * 强制使用 light 模式样式进行 PDF 导出
 */
const forceLightModeForPDF = (element: HTMLElement): void => {
  // 移除 dark 模式的类名
  const darkElements = element.querySelectorAll('.dark');
  darkElements.forEach(el => {
    el.classList.remove('dark');
  });
  
  // 移除 markdown-preview 上的 dark 类
  const markdownPreview = element.querySelector('.markdown-preview');
  if (markdownPreview) {
    markdownPreview.classList.remove('dark');
  }
  
  // 强制设置 light 模式的 CSS 变量
  const style = document.createElement('style');
  style.textContent = `
    /* 强制 PDF 使用 light 模式样式 */
    .markdown-preview {
      --theme-color: #333 !important;
      --text-color: #333 !important;
      --blockquote-background: #f8f9fa !important;
      --font-size: 15px !important;
      background-color: #ffffff !important;
      color: #333 !important;
    }
    
    /* 确保所有元素使用 light 模式颜色 */
    h1, h2, h3, h4, h5, h6 {
      color: #333 !important;
    }
    
    p, li, td, th, span, div {
      color: #333 !important;
    }
    
    strong {
      color: #333 !important;
    }
    
    blockquote {
      border-left-color: #333 !important;
      background: #f8f9fa !important;
      color: #333 !important;
    }
    
    /* 代码块使用 light 模式样式 */
    pre {
      background: #f6f8fa !important;
      color: #24292e !important;
      border: 1px solid #e1e4e8 !important;
    }
    
    code {
      background: rgba(27,31,35,.05) !important;
      color: #333 !important;
    }
    
    /* 表格样式 */
    table {
      color: #333 !important;
    }
    
    th {
      background: rgba(0, 0, 0, 0.05) !important;
      color: #333 !important;
    }
    
    /* 链接样式 */
    a {
      color: #0969da !important;
    }
  `;
  element.appendChild(style);
};

/**
 * 使用字符替换方法修复竖线问题
 * 这种方法比CSS border更可靠，因为它是实际的文本内容
 */
const fixVerticalLinesWithCharacters = (element: HTMLElement): void => {
  // 修复H3标题的竖线
  const h3Elements = element.querySelectorAll('h3[style*="border-left"]');
  h3Elements.forEach((h3) => {
    const h3Element = h3 as HTMLElement;
    const currentText = h3Element.textContent || '';
    
    // 如果还没有竖线字符，则添加
    if (!currentText.startsWith('▍')) {
      h3Element.textContent = `▍ ${currentText}`;
    }
  });
  
  // 修复blockquote的竖线
  const blockquoteElements = element.querySelectorAll('blockquote[style*="border-left"]');
  blockquoteElements.forEach((blockquote) => {
    const blockquoteElement = blockquote as HTMLElement;
    const currentHTML = blockquoteElement.innerHTML;
    
    // 在每行前添加竖线字符
    if (!currentHTML.includes('▍')) {
      // 将内容按行分割，在每行前加上竖线
      const lines = currentHTML.split('<br>');
      const modifiedLines = lines.map(line => line.trim() ? `▍ ${line}` : line);
      blockquoteElement.innerHTML = modifiedLines.join('<br>');
    }
  });
};

/**
 * 添加PDF专用样式修复
 */
const addPDFStyles = (element: HTMLElement): void => {
  // 使用字符替换方法修复竖线问题
  fixVerticalLinesWithCharacters(element);
  
  // 使用更强的CSS覆盖，确保样式生效
  const style = document.createElement('style');
  style.textContent = `
    /* 强制PDF样式修复 - 使用更高优先级 */
    
    /* 移除所有border-left，使用字符替换 */
    h3[style*="border-left"] {
      border-left: none !important;
      padding-left: 0 !important;
    }
    
    blockquote[style*="border-left"] {
      border-left: none !important;
      padding-left: 16px !important;
    }
    
    /* 表格对齐修复 */
    table {
      border-collapse: collapse !important;
      width: 100% !important;
    }
    
    td, th {
      border: 1px solid #dfdfdf !important;
      padding: 0.25em 0.5em !important;
      text-align: center !important;
      vertical-align: middle !important;
    }
    
    thead {
      background: rgba(0, 0, 0, 0.05) !important;
      font-weight: bold !important;
    }
    
    /* 基础对齐修复 */
    h1, h2 {
      text-align: center !important;
    }
    
    p {
      text-align: justify !important;
      line-height: 2 !important;
      letter-spacing: 0.1em !important;
    }
    
    pre {
      background: #f6f8fa !important;
      border: 1px solid #e1e4e8 !important;
      border-radius: 8px !important;
      padding: 1em !important;
      overflow: visible !important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
    }
    
    code {
      background: rgba(27,31,35,.05) !important;
      padding: 3px 5px !important;
      border-radius: 4px !important;
    }
    
    a {
      color: #576b95 !important;
    }
    
    strong {
      font-weight: bold !important;
    }
  `;
  
  // 将样式插入到head中，确保最高优先级
  element.appendChild(style);
  
  // 同时进行DOM操作作为备选方案
  setTimeout(() => {
    // 修复H3元素
    const h3Elements = element.querySelectorAll('h3');
    h3Elements.forEach((h3) => {
      const h3Element = h3 as HTMLElement;
      const computedStyle = getComputedStyle(h3Element);
      
      if (computedStyle.borderLeftWidth && computedStyle.borderLeftWidth !== '0px') {
        // 如果有border-left，则替换为伪元素
        h3Element.style.setProperty('border-left', 'none', 'important');
        h3Element.style.setProperty('padding-left', '16px', 'important');
        h3Element.style.setProperty('position', 'relative', 'important');
        
        // 创建伪元素的替代方案
        const existingLine = h3Element.querySelector('.pdf-line');
        if (!existingLine) {
          const line = document.createElement('span');
          line.className = 'pdf-line';
          line.style.cssText = `
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            width: 4px !important;
            background-color: var(--theme-color, #333) !important;
          `;
          h3Element.insertBefore(line, h3Element.firstChild);
        }
      }
    });
    
    // 修复引用块
    const blockquotes = element.querySelectorAll('blockquote');
    blockquotes.forEach((blockquote) => {
      const bqElement = blockquote as HTMLElement;
      const computedStyle = getComputedStyle(bqElement);
      
      if (computedStyle.borderLeftWidth && computedStyle.borderLeftWidth !== '0px') {
        bqElement.style.setProperty('border-left', 'none', 'important');
        bqElement.style.setProperty('padding-left', '1.5em', 'important');
        bqElement.style.setProperty('position', 'relative', 'important');
        
        const existingLine = bqElement.querySelector('.pdf-line');
        if (!existingLine) {
          const line = document.createElement('span');
          line.className = 'pdf-line';
          line.style.cssText = `
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            width: 4px !important;
            background-color: var(--theme-color, #333) !important;
            border-radius: 6px !important;
          `;
          bqElement.insertBefore(line, bqElement.firstChild);
        }
      }
    });
  }, 100);
};



/**
 * 导出当前预览内容为PDF
 * @param filename - 文件名
 * @param options - 额外选项
 * @returns 导出结果
 */
export const exportPreviewToPDF = async (
  filename: string,
  options: Partial<PDFOptions> = {}
): Promise<ExportResult> => {
  const element = document.getElementById('preview-content');
  
  if (!element) {
    return {
      success: false,
      message: '未找到要导出的内容'
    };
  }
  
  return exportElementToPDF(element, {
    filename,
    quality: 0.98,
    format: 'a4',
    orientation: 'portrait',
    ...options
  });
}; 