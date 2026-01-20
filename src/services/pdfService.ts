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
  orientation?: "portrait" | "landscape";
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
    const { default: html2pdf } = await import("html2pdf.js");

    // 克隆元素以避免影响原始DOM
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // 强制使用 light 模式样式进行 PDF 导出
    forceLightModeForPDF(clonedElement);

    // 添加PDF专用样式修复
    addPDFStyles(clonedElement);

    // 优化的html2pdf配置 - 简化版，避免内容丢失
    const opt = {
      margin: 10, // 统一边距
      filename: options.filename,
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc: Document) => {
          // 在html2canvas的隔离环境中执行DOM操作
          const clonedContent = clonedDoc.querySelector("#preview-content");
          if (clonedContent) {
            fixPDFDisplayIssues(clonedContent as HTMLElement);
          }
        },
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["css", "legacy"],
        before: ".page-break-before",
        after: ".page-break-after",
        avoid: [],
      },
    };

    console.log("Starting PDF export...");
    await html2pdf().set(opt).from(clonedElement).save();
    console.log("PDF export completed successfully");

    return {
      success: true,
      message: "PDF导出成功",
    };
  } catch (error) {
    console.error("PDF export failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "导出失败，请重试",
    };
  }
};

/**
 * 强制使用 light 模式样式进行 PDF 导出
 */
const forceLightModeForPDF = (element: HTMLElement): void => {
  // 移除 dark 模式的类名
  const darkElements = element.querySelectorAll(".dark");
  darkElements.forEach((el) => {
    el.classList.remove("dark");
  });

  // 移除 markdown-preview 上的 dark 类
  const markdownPreview = element.querySelector(".markdown-preview");
  if (markdownPreview) {
    markdownPreview.classList.remove("dark");
  }

  // 强制设置 light 模式的 CSS 变量
  const style = document.createElement("style");
  style.textContent = `
    /* 强制 PDF 使用 light 模式样式 */
    .markdown-preview {
      --theme-color: #374151 !important;
      --text-color: #374151 !important;
      --blockquote-background: #f8fafc !important;
      --font-size: 16px !important;
      background-color: #ffffff !important;
      color: #374151 !important;
      /* 高清字体渲染优化 */
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      text-rendering: optimizeLegibility !important;
      font-variant-ligatures: none !important;
      /* 使用系统高质量字体 */
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" !important;
    }
    
    /* 确保所有元素使用 light 模式颜色 */
    h1, h2, h3, h4, h5, h6 {
      color: #374151 !important;
      font-weight: 600 !important;
    }
    
    h1 {
      font-size: 1.75rem !important;
      font-weight: 700 !important;
      border-bottom: none !important;
      padding-bottom: 0.5rem !important;
      margin-bottom: 1.5rem !important;
      line-height: 1.2 !important;
      display: block !important;
      position: relative !important;
    }
    
    h2 {
      font-size: 1.375rem !important;
      border-bottom: none !important;
      padding-bottom: 0.25rem !important;
      margin-top: 2rem !important;
      margin-bottom: 1rem !important;
      line-height: 1.2 !important;
      display: block !important;
      position: relative !important;
    }
    
    h3 {
      font-size: 1.25rem !important;
      margin-top: 1.5rem !important;
      margin-bottom: 0.75rem !important;
    }
    
    h6 {
      color: #6b7280 !important;
      font-size: 0.875rem !important;
    }
    
    p, li, td, th {
      color: #374151 !important;
      line-height: 1.7 !important;
    }
    
    strong {
      color: #374151 !important;
      font-weight: 600 !important;
    }
    
    blockquote {
      border-left: 3px solid #374151 !important;
      background: #f8fafc !important;
      color: #374151 !important;
      padding: 1rem 1.5rem !important;
      margin: 1.5rem 0 !important;
      border-radius: 0.375rem !important;
      font-style: italic !important;
    }
    
    /* 水平分割线样式 - 只应用于markdown中的hr，不影响我们创建的分割线 */
    .markdown-content > hr {
      border: none !important;
      height: 1px !important;
      background: #f1f5f9 !important;
      margin: 2rem 0 !important;
    }
    
    /* 代码块使用 light 模式样式 */
    pre {
      background: #f8fafc !important;
      color: #24292e !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 0.5rem !important;
      padding: 1.25rem !important;
      margin: 1.5rem 0 !important;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
    }
    
    code {
      background: rgba(0, 0, 0, 0.08) !important;
      color: #374151 !important;
      padding: 0.125rem 0.375rem !important;
      border-radius: 0.25rem !important;
      font-size: 0.875em !important;
      font-weight: 500 !important;
    }
    
    /* 表格样式 - 优化为传统表格样式 + 防切割 */
    table {
      color: #374151 !important;
      border-collapse: collapse !important;
      margin: 1.5rem 0 !important;
      border: 2px solid #d1d5db !important;
      background: #ffffff !important;
      width: 100% !important;
    }
    
    th, td {
      border: 1px solid #d1d5db !important;
      padding: 0.75rem 1rem !important;
      text-align: left !important;
      color: #374151 !important;
      min-width: 6em !important;
      word-break: break-word !important;
    }
    
    th {
      background: #f3f4f6 !important;
      font-weight: 600 !important;
      color: #374151 !important;
      border-bottom: 2px solid #9ca3af !important;
    }
    
    tbody tr:nth-child(even) {
      background: #f9fafb !important;
    }
    
    /* 链接样式 */
    a {
      color: #374151 !important;
      text-decoration: none !important;
    }
  `;
  element.appendChild(style);
};

/**
 * 修复PDF导出中的显示问题
 * 简化方案，避免内容丢失
 */
const fixPDFDisplayIssues = (element: HTMLElement): void => {
  console.log("开始修复PDF显示问题...");

  // 修复标题下划线 - 使用div而非hr，避免样式冲突
  const h1Elements = element.querySelectorAll("h1");
  console.log(`找到 ${h1Elements.length} 个H1标题`);
  h1Elements.forEach((h1, index) => {
    const h1Element = h1 as HTMLElement;
    console.log(
      `处理H1 #${index + 1}: "${h1Element.textContent?.substring(0, 30)}..."`
    );

    // 移除原有边框和间距
    h1Element.style.setProperty("border-bottom", "none", "important");
    h1Element.style.setProperty("padding-bottom", "0.5rem", "important");
    h1Element.style.setProperty("margin-bottom", "0", "important");

    // 使用div作为分割线容器，确保有足够间距
    const separator = document.createElement("div");
    separator.className = "pdf-title-separator"; // 添加类名便于调试
    separator.style.cssText = `
      width: 100% !important;
      height: 1px !important;
      background-color: #f1f5f9 !important;
      margin-top: 10px !important;
      margin-bottom: 1.5rem !important;
      border: none !important;
      padding: 0 !important;
      display: block !important;
    `;
    if (h1Element.nextSibling) {
      h1Element.parentNode?.insertBefore(separator, h1Element.nextSibling);
      console.log(`  - 在H1后插入了分割线`);
    } else {
      h1Element.parentNode?.appendChild(separator);
      console.log(`  - 在父元素末尾添加了分割线`);
    }
  });

  const h2Elements = element.querySelectorAll("h2");
  h2Elements.forEach((h2) => {
    const h2Element = h2 as HTMLElement;
    // 移除原有边框和间距
    h2Element.style.setProperty("border-bottom", "none", "important");
    h2Element.style.setProperty("padding-bottom", "0.25rem", "important");
    h2Element.style.setProperty("margin-bottom", "0", "important");

    // 使用div作为分割线容器
    const separator = document.createElement("div");
    separator.className = "pdf-title-separator"; // 添加类名便于调试
    separator.style.cssText = `
      width: 100% !important;
      height: 1px !important;
      background-color: #f8fafc !important;
      margin-top: 8px !important;
      margin-bottom: 1rem !important;
      border: none !important;
      padding: 0 !important;
      display: block !important;
    `;
    if (h2Element.nextSibling) {
      h2Element.parentNode?.insertBefore(separator, h2Element.nextSibling);
    } else {
      h2Element.parentNode?.appendChild(separator);
    }
  });

  // 简化列表圆点处理 - 只添加前缀，不修改结构
  const ulElements = element.querySelectorAll("ul");
  ulElements.forEach((ul) => {
    const liElements = ul.querySelectorAll("li");
    liElements.forEach((li) => {
      const liElement = li as HTMLElement;
      // 检查是否已经处理过
      const firstChild = liElement.firstChild;
      if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
        const textNode = firstChild as Text;
        if (!textNode.textContent?.startsWith("· ")) {
          // 在文本节点前添加圆点
          textNode.textContent = "· " + textNode.textContent;
        }
      } else if (firstChild && firstChild.nodeType === Node.ELEMENT_NODE) {
        // 如果第一个是元素节点，插入文本节点
        const bulletText = document.createTextNode("· ");
        liElement.insertBefore(bulletText, firstChild);
      }

      // 设置样式
      liElement.style.setProperty("list-style", "none", "important");
      liElement.style.setProperty("padding-left", "0", "important");
    });
    (ul as HTMLElement).style.setProperty("list-style", "none", "important");
    (ul as HTMLElement).style.setProperty("padding-left", "1rem", "important");
  });

  // 修复 KaTeX 分数线 - 使用 DOM 操作替代脆弱的 CSS border
  const fracLines = element.querySelectorAll(".katex .mfrac .frac-line");
  console.log(`找到 ${fracLines.length} 个分数线`);
  fracLines.forEach((line) => {
    const el = line as HTMLElement;
    // 强制使用显式样式，避免 html2canvas 渲染边框问题
    el.style.setProperty("border-bottom", "none", "important");
    el.style.setProperty("height", "1px", "important"); // 稍微增加高度确保可见
    el.style.setProperty("min-height", "1px", "important");
    el.style.setProperty("background-color", "#374151", "important");
    el.style.setProperty("display", "block", "important");
    el.style.setProperty("width", "100%", "important");
    // 确保不被其他样式覆盖
    el.style.setProperty("opacity", "1", "important");
    el.style.setProperty("visibility", "visible", "important");
  });

  // 移除所有红色高亮框 - 包括边框和背景
  console.log("移除红色高亮框...");
  const allElements = element.querySelectorAll("*");
  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const computedStyle = window.getComputedStyle(htmlEl);

    // 检测并移除红色边框
    if (computedStyle.borderColor && computedStyle.borderColor.includes("rgb(255, 0, 0)") ||
      computedStyle.borderColor && computedStyle.borderColor.includes("red")) {
      htmlEl.style.setProperty("border", "none", "important");
      htmlEl.style.setProperty("outline", "none", "important");
      console.log(`  - 移除元素红色边框: ${htmlEl.tagName}`);
    }

    // 检测并移除红色背景
    if (computedStyle.backgroundColor && (computedStyle.backgroundColor.includes("rgba(255, 0, 0") ||
      computedStyle.backgroundColor.includes("rgb(255, 0, 0"))) {
      htmlEl.style.setProperty("background-color", "transparent", "important");
      console.log(`  - 移除元素红色背景: ${htmlEl.tagName}`);
    }
  });

  // 处理命题编号样式（命题①、命题②等）
  console.log("处理命题编号样式...");
  const textNodes: Node[] = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );

  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }

  textNodes.forEach((textNode) => {
    const text = textNode.textContent || "";
    // 匹配 "命题①" 等模式
    const pattern = /命题([①②③④⑤⑥⑦⑧⑨⑩])/g;
    if (pattern.test(text)) {
      const parent = textNode.parentElement;
      if (parent) {
        // 用带样式的 HTML 替换文本
        const newHTML = text.replace(
          /命题([①②③④⑤⑥⑦⑧⑨⑩])/g,
          '<strong style="color: #dc2626;">命题<span style="display: inline-block; color: #dc2626;">$1</span></strong>'
        );
        const span = document.createElement("span");
        span.innerHTML = newHTML;
        parent.replaceChild(span, textNode);
        console.log(`  - 样式化命题编号: ${text}`);
      }
    }
  });

  console.log("PDF显示问题修复完成");
};

/**
 * 添加PDF专用样式修复
 */
const addPDFStyles = (element: HTMLElement): void => {
  // 修复PDF显示问题
  fixPDFDisplayIssues(element);

  // 使用更强的CSS覆盖，确保样式生效
  const style = document.createElement("style");
  style.textContent = `
    /* 强制PDF样式修复 - 使用更高优先级 */
    
    /* 整体容器宽度控制 */
    #preview-content {
      max-width: 100% !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 1cm 1.5cm !important;
      box-sizing: border-box !important;
    }
    
    .markdown-content {
      max-width: 100% !important;
      width: 100% !important;
      overflow: visible !important;
    }
    
    /* 表格对齐修复 - 传统表格样式 + 加强防切割 */
    table {
      border-collapse: collapse !important;
      width: 100% !important;
      margin: 1.5rem 0 !important;
      border: 2px solid #d1d5db !important;
      background: #ffffff !important;
      page-break-before: auto !important;
      page-break-after: auto !important;
      page-break-inside: avoid !important;
      break-inside: avoid-page !important;
      display: table !important;
    }
    
    thead {
      background: #f3f4f6 !important;
      font-weight: 600 !important;
      display: table-header-group !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    thead th {
      border-bottom: 2px solid #9ca3af !important;
    }
    
    tbody {
      display: table-row-group !important;
      page-break-inside: auto !important;
    }
    
    td, th {
      border: 1px solid #d1d5db !important;
      padding: 0.75rem 1rem !important;
      text-align: left !important;
      vertical-align: middle !important;
      color: #374151 !important;
      min-width: 6em !important;
      word-break: break-word !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    tbody tr {
      background: #ffffff !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      display: table-row !important;
    }
    
    tbody tr:nth-child(even) {
      background: #f9fafb !important;
    }
    
    tr {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      display: table-row !important;
    }
    
    /* 基础对齐修复 */
    h1, h2 {
      text-align: left !important;
    }
    
    p {
      text-align: left !important;
      line-height: 1.7 !important;
      letter-spacing: 0 !important;
      margin: 1rem 0 !important;
    }
    
    pre {
      background: #f8fafc !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 0.5rem !important;
      padding: 1.25rem !important;
      overflow: visible !important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      margin: 1.5rem 0 !important;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
    }
    
    code {
      background: rgba(0, 0, 0, 0.08) !important;
      padding: 0.125rem 0.375rem !important;
      border-radius: 0.25rem !important;
      color: #374151 !important;
      font-size: 0.875em !important;
      font-weight: 500 !important;
    }
    
    a {
      color: #374151 !important;
    }
    
    strong {
      font-weight: 600 !important;
      color: #374151 !important;
    }
    
    /* 列表样式 - 简化版 */
    ul {
      padding-left: 1rem !important;
      margin: 1rem 0 !important;
      list-style: none !important;
    }
    
    ol {
      padding-left: 1.5rem !important;
      margin: 1rem 0 !important;
    }
    
    li {
      margin: 0.375rem 0 !important;
      line-height: 1.6 !important;
      color: #374151 !important;
      list-style: none !important;
      padding-left: 0 !important;
    }
    
    /* 分页优化 */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    
    p, blockquote, pre {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    /* 避免孤立行 */
    p {
      orphans: 3 !important;
      widows: 3 !important;
    }

    /* KaTeX 公式修复 - 保护内部样式不被全局样式破坏 */
    .katex, .katex * {
      line-height: 1.2 !important;
      font-family: KaTeX_Main, 'Times New Roman', serif !important;
      border-color: currentColor;
    }

    /* 分数线修复 - 确保可见且位置正确 */
    .katex .mfrac .frac-line {
      border-bottom: none !important;
      background-color: #374151 !important;
      height: 1px !important;
      min-height: 1px !important;
      display: inline-block !important;
    }

    .katex .frac-line:before {
      display: none !important;
    }

    /* 确保数学公式清晰度 */
    .katex {
      font-size: 1.1em !important;
      text-rendering: geometricPrecision !important;
      margin: 0.2em 0 !important;
    }
    
    /* 根号线修复 */
    .katex .sqrt > .root {
      margin-top: -1px !important;
    }

    /* 移除所有红色边框和高亮 */
    * {
      border-color: currentColor !important;
    }
    
    *[style*="border"][style*="red"],
    *[style*="border-color"][style*="red"] {
      border: none !important;
    }
    
    *[style*="background"][style*="red"] {
      background: transparent !important;
    }

    /* 命题编号样式 - 红色显示 */
    strong:has(span) {
      color: #dc2626 !important;
    }
  `;

  // 将样式插入到head中，确保最高优先级
  element.appendChild(style);
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
  const element = document.getElementById("preview-content");

  if (!element) {
    return {
      success: false,
      message: "未找到要导出的内容",
    };
  }

  return exportElementToPDF(element, {
    filename,
    quality: 0.98,
    format: "a4",
    orientation: "portrait",
    ...options,
  });
};
