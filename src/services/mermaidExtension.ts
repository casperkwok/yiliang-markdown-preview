import mermaid from 'mermaid';

// Mermaid token interface
interface MermaidToken {
  type: 'mermaid';
  raw: string;
  text: string;
}

// Initialize Mermaid with default configuration
let mermaidInitialized = false;

const initializeMermaid = (isDarkMode: boolean = false) => {
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkMode ? 'dark' : 'base',
      securityLevel: 'loose',
      fontFamily: 'Source Han Sans, -apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif',
      themeVariables: {
        // 主要颜色 - 使用现代蓝色系
        primaryColor: isDarkMode ? '#3b82f6' : '#2563eb',
        primaryTextColor: isDarkMode ? '#ffffff' : '#1f2937',
        primaryBorderColor: isDarkMode ? '#1e40af' : '#1d4ed8',
        
        // 次要颜色 - 使用柔和的灰色
        secondaryColor: isDarkMode ? '#6366f1' : '#f1f5f9',
        tertiaryColor: isDarkMode ? '#1e293b' : '#f8fafc',
        
        // 背景色
        background: isDarkMode ? '#0f172a' : '#ffffff',
        mainBkg: isDarkMode ? '#1e293b' : '#ffffff',
        secondBkg: isDarkMode ? '#334155' : '#f8fafc',
        tertiaryBkg: isDarkMode ? '#475569' : '#f1f5f9',
        
        // 线条颜色
        lineColor: isDarkMode ? '#64748b' : '#475569',
        
        // 文本颜色
        textColor: isDarkMode ? '#f1f5f9' : '#1e293b',
        labelTextColor: isDarkMode ? '#ffffff' : '#1f2937',
        
        // 节点样式
        nodeBkg: isDarkMode ? '#1e40af' : '#dbeafe',
        nodeTextColor: isDarkMode ? '#ffffff' : '#1e40af',
        nodeBorder: isDarkMode ? '#3b82f6' : '#2563eb',
        
        // 特殊元素
        clusterBkg: isDarkMode ? '#1e293b' : '#f8fafc',
        clusterBorder: isDarkMode ? '#475569' : '#cbd5e1',
        defaultLinkColor: isDarkMode ? '#64748b' : '#475569',
        titleColor: isDarkMode ? '#f1f5f9' : '#1e293b',
        
        // 活动状态
        activeTaskBkgColor: isDarkMode ? '#059669' : '#10b981',
        activeTaskBorderColor: isDarkMode ? '#047857' : '#059669',
        
        // 网格
        gridColor: isDarkMode ? '#374151' : '#e2e8f0',
        section0: isDarkMode ? '#1e293b' : '#f8fafc',
        section1: isDarkMode ? '#334155' : '#f1f5f9',
        section2: isDarkMode ? '#475569' : '#e2e8f0',
        section3: isDarkMode ? '#64748b' : '#cbd5e1',
      }
    });
    mermaidInitialized = true;
  }
};

// Update Mermaid theme
export const updateMermaidTheme = (isDarkMode: boolean) => {
  mermaid.initialize({
    startOnLoad: false,
    theme: isDarkMode ? 'dark' : 'base',
    securityLevel: 'loose',
    fontFamily: 'Source Han Sans, -apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif',
    themeVariables: {
      // 主要颜色 - 使用现代蓝色系
      primaryColor: isDarkMode ? '#3b82f6' : '#2563eb',
      primaryTextColor: isDarkMode ? '#ffffff' : '#1f2937',
      primaryBorderColor: isDarkMode ? '#1e40af' : '#1d4ed8',
      
      // 次要颜色 - 使用柔和的灰色
      secondaryColor: isDarkMode ? '#6366f1' : '#f1f5f9',
      tertiaryColor: isDarkMode ? '#1e293b' : '#f8fafc',
      
      // 背景色
      background: isDarkMode ? '#0f172a' : '#ffffff',
      mainBkg: isDarkMode ? '#1e293b' : '#ffffff',
      secondBkg: isDarkMode ? '#334155' : '#f8fafc',
      tertiaryBkg: isDarkMode ? '#475569' : '#f1f5f9',
      
      // 线条颜色
      lineColor: isDarkMode ? '#64748b' : '#475569',
      
      // 文本颜色
      textColor: isDarkMode ? '#f1f5f9' : '#1e293b',
      labelTextColor: isDarkMode ? '#ffffff' : '#1f2937',
      
      // 节点样式
      nodeBkg: isDarkMode ? '#1e40af' : '#dbeafe',
      nodeTextColor: isDarkMode ? '#ffffff' : '#1e40af',
      nodeBorder: isDarkMode ? '#3b82f6' : '#2563eb',
      
      // 特殊元素
      clusterBkg: isDarkMode ? '#1e293b' : '#f8fafc',
      clusterBorder: isDarkMode ? '#475569' : '#cbd5e1',
      defaultLinkColor: isDarkMode ? '#64748b' : '#475569',
      titleColor: isDarkMode ? '#f1f5f9' : '#1e293b',
      
      // 活动状态
      activeTaskBkgColor: isDarkMode ? '#059669' : '#10b981',
      activeTaskBorderColor: isDarkMode ? '#047857' : '#059669',
      
      // 网格
      gridColor: isDarkMode ? '#374151' : '#e2e8f0',
      section0: isDarkMode ? '#1e293b' : '#f8fafc',
      section1: isDarkMode ? '#334155' : '#f1f5f9',
      section2: isDarkMode ? '#475569' : '#e2e8f0',
      section3: isDarkMode ? '#64748b' : '#cbd5e1',
    }
  });
};

// Generate unique ID for each diagram
let diagramCounter = 0;
const generateDiagramId = () => `mermaid-diagram-${Date.now()}-${++diagramCounter}`;

export const mermaidExtension = {
  name: 'mermaid',
  level: 'block' as const,
  start(src: string) {
    return src.indexOf('```mermaid');
  },
  tokenizer(src: string): MermaidToken | undefined {
    const rule = /^```mermaid\s*\n?([\s\S]*?)\n?```(?:\s|$)/;
    const match = src.match(rule);
    if (match) {
      return {
        type: 'mermaid',
        raw: match[0],
        text: match[1].trim(),
      };
    }
    return undefined;
  },
  renderer(token: MermaidToken) {
    try {
      const diagramId = generateDiagramId();
      const diagramText = token.text;
      
      // Return a placeholder div that will be processed later
      return `<div class="mermaid-diagram" data-diagram-id="${diagramId}" data-diagram-text="${encodeURIComponent(diagramText)}" style="text-align: center; margin: 1em 0; padding: 1em; border: 1px solid var(--mermaid-border-color, #e5e7eb); border-radius: 8px; background: var(--mermaid-bg-color, #ffffff);">
        <div class="mermaid-loading" style="color: var(--text-color, #666); font-style: italic;">Loading diagram...</div>
      </div>`;
    } catch (error) {
      console.error('Error rendering Mermaid diagram:', error);
      return `<div class="mermaid-error" style="color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 1em; margin: 1em 0;">
        <strong>Mermaid Error:</strong> ${(error as Error).message}
        <pre style="margin-top: 0.5em; font-size: 0.9em; background: rgba(0,0,0,0.1); padding: 0.5em; border-radius: 4px;">${token.text}</pre>
      </div>`;
    }
  },
};

// Function to render all Mermaid diagrams in a container
export const renderMermaidDiagrams = async (container: HTMLElement, isDarkMode: boolean = false) => {
  // Initialize Mermaid with current theme
  initializeMermaid(isDarkMode);
  updateMermaidTheme(isDarkMode);
  
  const diagrams = container.querySelectorAll('.mermaid-diagram');
  
  for (const diagram of diagrams) {
    const diagramId = diagram.getAttribute('data-diagram-id');
    const diagramText = decodeURIComponent(diagram.getAttribute('data-diagram-text') || '');
    
    if (!diagramId || !diagramText) continue;
    
    try {
      // Validate the diagram syntax
      const isValid = await mermaid.parse(diagramText);
      if (!isValid) {
        throw new Error('Invalid Mermaid syntax');
      }
      
      // Render the diagram
      const { svg } = await mermaid.render(diagramId, diagramText);
      
      // Replace the loading placeholder with the rendered SVG
      diagram.innerHTML = svg;
      diagram.classList.add('mermaid-rendered');
      
    } catch (error) {
      console.error('Error rendering Mermaid diagram:', error);
      diagram.innerHTML = `<div class="mermaid-error" style="color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 1em; margin: 1em 0;">
        <strong>Mermaid Error:</strong> ${(error as Error).message}
        <pre style="margin-top: 0.5em; font-size: 0.9em; background: rgba(0,0,0,0.1); padding: 0.5em; border-radius: 4px;">${diagramText}</pre>
      </div>`;
    }
  }
}; 