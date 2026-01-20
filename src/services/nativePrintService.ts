/**
 * @file nativePrintService.ts
 * @description 基于浏览器原生打印功能的 PDF 导出服务
 * 优势：
 * 1. 矢量输出：文字可选、清晰度完美、文件体积小
 * 2. 性能极高：无 html2canvas 渲染开销
 * 3. 样式完美：支持所有 CSS 属性 (Grid, Flex, Filters 等)
 */

/**
 * 打印选项接口
 */
interface PrintOptions {
  filename?: string; // 虽然原生打印不能直接指定文件名，但我们可以尝试修改 document.title
}

/**
 * 准备打印样式
 * 包含强制亮色模式、打印布局优化等
 */
const getPrintStyles = () => `
  /* 隐藏页面上除了打印容器之外的所有元素 */
  @media print {
    body > *:not(#print-container) {
      display: none !important;
    }
    
    /* 确保打印容器可见且重置样式 */
    #print-container {
      display: block !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 20px !important; /* 默认边距 */
      background: white !important;
      color: #374151 !important; /* 强制深灰字体 */
      z-index: 99999 !important;
    }

    /* 强制重置页面背景 */
    html, body {
      background: white !important;
      height: auto !important;
      overflow: visible !important;
    }

    /* 
     * 打印分页控制 
     * 避免在这些元素内部断页
     */
    h1, h2, h3, h4, h5, h6, 
    table, figure, pre, blockquote, 
    .katex-display, img {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    /* 标题后尽量不要断页 */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }

    /* 链接优化：打印时不显示 URL 尾注，因为是生成 PDF */
    a[href]:after {
      content: none !important;
    }
  }

  /* 
   * 强制亮色模式样式覆盖 
   * 我们不需要复杂的 DOM 操作，只需 CSS 变量重写即可
   */
  #print-container {
    --theme-color: #374151;
    --text-color: #374151;
    --background-primary: #ffffff;
    --background-secondary: #f8fafc;
    color: #374151;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  /* 针对 Markdown 内容的特定修复 */
  #print-container .markdown-preview {
    background-color: transparent !important;
    color: #374151 !important;
    padding: 0 !important;
    box-shadow: none !important;
  }

  /* 代码块优化 */
  #print-container pre {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    color: #24292e !important;
    white-space: pre-wrap !important; /* 允许代码换行以免截断 */
    word-break: break-word !important;
  }

  #print-container code {
    color: #374151 !important;
    background-color: #f1f5f9 !important;
  }

  /* 表格优化 */
  #print-container table {
    width: 100% !important;
    border-collapse: collapse !important;
  }
  
  #print-container th, 
  #print-container td {
    border: 1px solid #d1d5db !important;
    color: #374151 !important;
  }
`;

/**
 * 简单的 DOM 清理：移除可能导致问题的元素
 */
const cleanDOMForPrint = (element: HTMLElement) => {
  // 移除 dark 类，强制 Light Mode
  const darkElements = element.querySelectorAll('.dark');
  darkElements.forEach(el => el.classList.remove('dark'));
  
  // 移除特定的 UI 控件（如果有的话，比如复制按钮）
  const uiElements = element.querySelectorAll('button, .copy-btn, .no-print');
  uiElements.forEach(el => el.remove());

  // 修复 KaTeX 的分数线 (在某些缩放下可能不可见，加粗一点)
  const fracLines = element.querySelectorAll('.katex .mfrac .frac-line');
  fracLines.forEach(line => {
    (line as HTMLElement).style.borderBottom = '1px solid #000';
  });
};

/**
 * 执行原生打印
 * @param sourceElementId 要打印的源元素 ID
 * @param options 打印选项
 */
export const exportNativePDF = async (
  sourceElementId: string = 'preview-content',
  options: PrintOptions = {}
): Promise<{ success: boolean; message: string }> => {
  try {
    const sourceElement = document.getElementById(sourceElementId);
    if (!sourceElement) {
      throw new Error('未找到内容元素');
    }

    // 1. 保存当前页面标题（打印时会用作默认文件名）
    const originalTitle = document.title;
    if (options.filename) {
      // 移除扩展名，因为浏览器会自动添加 .pdf
      document.title = options.filename.replace(/\.pdf$/i, '');
    }

    // 2. 创建打印容器
    let printContainer = document.getElementById('print-container');
    if (printContainer) {
      printContainer.remove(); // 清理旧的
    }
    
    printContainer = document.createElement('div');
    printContainer.id = 'print-container';
    
    // 3. 克隆内容
    // 使用 cloneNode(true) 深度克隆，保留所有子元素
    const contentClone = sourceElement.cloneNode(true) as HTMLElement;
    
    // 4. 清理和优化克隆的 DOM
    cleanDOMForPrint(contentClone);
    
    // 5. 将内容放入容器
    printContainer.appendChild(contentClone);
    document.body.appendChild(printContainer);

    // 6. 注入打印样式
    const styleElement = document.createElement('style');
    styleElement.id = 'print-styles';
    styleElement.textContent = getPrintStyles();
    document.head.appendChild(styleElement);

    // 7. 给予一点时间让 DOM 渲染和图片加载 (如果是本地图片通常很快)
    // 对于含有大量图片的文档，可能需要检测图片加载状态
    await new Promise(resolve => setTimeout(resolve, 100));

    // 8. 调用系统打印
    window.print();

    // 9. 清理工作 (打印对话框关闭后执行)
    // 注意：在某些浏览器中 window.print 是阻塞的，有些是非阻塞的
    // 为了安全起见，我们可以保留容器一小会儿，或者监听 afterprint 事件
    // 这里采用简单的做法：恢复标题，但在用户交互后稍后清理
    
    const cleanup = () => {
      document.title = originalTitle;
      const pc = document.getElementById('print-container');
      const ps = document.getElementById('print-styles');
      if (pc) pc.remove();
      if (ps) ps.remove();
      window.removeEventListener('focus', cleanup);
    };

    // 监听窗口重新获得焦点（通常意味着打印对话框关闭了）
    // 或者使用 matchMedia监听
    if (window.matchMedia) {
      const mediaQueryList = window.matchMedia('print');
      mediaQueryList.addEventListener('change', (mql) => {
        if (!mql.matches) {
          cleanup();
        }
      });
    }
    
    // 降级方案：1秒后自动清理（用户可能已经看到了预览）
    // 但如果用户还在预览窗口，移除元素可能会导致预览变白吗？
    // Chrome 的预览是快照，移除 DOM 不会影响已打开的预览窗口。
    setTimeout(cleanup, 2000);

    return { success: true, message: '打印对话框已打开' };

  } catch (error) {
    console.error('打印失败:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '打印启动失败' 
    };
  }
};
