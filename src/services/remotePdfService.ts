/**
 * @file remotePdfService.ts
 * @description 远程 PDF 导出服务
 * 将前端渲染好的 HTML 和 CSS 打包发送给后端 API 生成 PDF
 */

// @ts-ignore
import templateStyles from "../styles/templates.css?inline";

// 硬编码线上 PDF 服务地址
const API_BASE_URL = "https://base.xiaoliangai.com";
const API_URL = `${API_BASE_URL}/api/pdf/generate`;

interface RemoteExportOptions {
  filename?: string;
  returnBlob?: boolean;
}

/**
 * 获取页面所有生效的 CSS 样式
 * 遍历 document.styleSheets，将所有规则合并为一个 CSS 字符串
 * 这能确保 Tailwind、KaTeX 以及动态加载的样式都能被捕获
 */
const getAllStyles = (): string => {
  let cssString = "";

  try {
    // 遍历所有样式表
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        // 尝试访问 cssRules (可能会因为跨域报错，需要 try-catch)
        const rules = sheet.cssRules || sheet.rules;
        if (rules) {
          Array.from(rules).forEach((rule) => {
            cssString += rule.cssText;
          });
        }
      } catch (e) {
        console.warn("无法读取样式表规则 (可能是跨域限制):", sheet.href);
      }
    });

    // 添加一些特定于打印的强制样式
    cssString += `
      @media print {
        body { -webkit-print-color-adjust: exact; }
      }
      /* 强制 PDF 背景色 */
      body { background-color: white !important; }
      /* 修复 KaTeX */
      .katex-display { overflow: hidden; }
    `;
  } catch (error) {
    console.error("提取样式失败:", error);
  }

  return cssString;
};

/**
 * 将图片转换为 Base64
 * 解决后端无法访问飞书私有图片或 Blob 图片的问题
 */
const convertImagesToBase64 = async (element: HTMLElement): Promise<void> => {
  const images = Array.from(element.querySelectorAll('img'));

  const promises = images.map(async (img) => {
    try {
      // 如果已经是 data:image 开头，无需处理
      if (img.src.startsWith('data:')) return;

      // 创建一个 Canvas 来绘制图片并导出为 Base64
      // 注意：这需要图片服务器支持 CORS，如果仅仅是飞书插件内部的 Blob 通常没问题
      // 如果是跨域且无 CORS 的网络图片，这一步可能会失败 (污染 Canvas)
      // 但如果是同域或允许跨域的图片，这是最佳方案

      const response = await fetch(img.src);
      const blob = await response.blob();

      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            img.src = reader.result as string;
            // 移除 srcset 避免浏览器优先加载原图
            img.removeAttribute('srcset');
          }
          resolve();
        };
        reader.onerror = () => resolve(); // 失败也继续，保持原样
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn('图片 Base64 转换失败，保留原链接:', img.src);
    }
  });

  await Promise.all(promises);
};

/**
 * 准备要发送的 HTML
 */
const prepareHTML = async (sourceElementId: string): Promise<string> => {
  const sourceElement = document.getElementById(sourceElementId);
  if (!sourceElement) throw new Error("未找到内容元素");

  // 1. 克隆节点
  const clone = sourceElement.cloneNode(true) as HTMLElement;

  // 2. 清理 DOM (复用之前的逻辑)
  // 移除 dark 类
  const darkElements = clone.querySelectorAll('.dark');
  darkElements.forEach(el => el.classList.remove('dark'));

  // 移除无关元素
  clone.querySelectorAll('button, .copy-btn, .no-print').forEach(el => el.remove());

  // 3. 处理图片 (异步转 Base64)
  await convertImagesToBase64(clone);



  // ... (existing code)

  // 4. 提取所有 CSS
  const styles = getAllStyles();

  // 5. 组装完整 HTML
  // 显式注入 templates.css，确保核心排版样式不会因为跨域问题丢失
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          ${templateStyles}
          ${styles}
        </style>
        <style>
          /* 核心修复：防止内容截断和空白页 */
          html, body {
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
            overflow-x: hidden !important;
            overflow-y: visible !important;
            display: block !important;
            position: static !important;
          }

          /* 确保内容容器自动撑开高度 */
          #preview-content, .markdown-preview {
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            display: block !important; /* 防止 Flex/Grid 布局导致无法自动分页 */
            position: relative !important;
            width: 100% !important;
          }

          /* 避免元素内部滚动 */
          * {
            scrollbar-width: none !important;
          }

          /* 额外的布局重置 */
          body { margin: 0; padding: 20px; font-family: sans-serif; }
          #preview-content { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
          /* 确保 KaTeX 分数线可见 */
          .katex .mfrac .frac-line { border-bottom: 1px solid black !important; }
        </style>
      </head>
      <body>
        <div id="preview-content" class="markdown-preview">
          ${clone.innerHTML}
        </div>
      </body>
    </html>
  `;
};

/**
 * 调用后端 API 生成 PDF
 */
export const exportRemotePDF = async (
  sourceElementId: string = "preview-content",
  options: RemoteExportOptions = {}
): Promise<{ success: boolean; message: string; blob?: Blob }> => {
  try {
    console.log("正在打包页面内容...");
    const htmlContent = await prepareHTML(sourceElementId);

    console.log("正在发送请求到 PDF 服务...", API_URL);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: htmlContent,
        options: {
          format: "A4",
          printBackground: true,
          margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" }
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "生成失败");
    }

    const blob = await response.blob();

    // 如果只需要 Blob（例如保存到附件），则直接返回
    if (options.returnBlob) {
      return { success: true, message: "PDF 生成成功", blob };
    }

    console.log("PDF 生成成功，开始下载...");
    const url = window.URL.createObjectURL(blob);

    // 创建下载链接并触发
    const link = document.createElement("a");
    link.href = url;
    // 使用传入的文件名，或者默认名
    let downloadName = options.filename || "document.pdf";
    if (!downloadName.endsWith('.pdf')) downloadName += '.pdf';

    link.download = downloadName;
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: "PDF 下载已开始" };
  } catch (error) {
    console.error("PDF 导出错误:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "导出失败，请检查后端服务"
    };
  }
};
