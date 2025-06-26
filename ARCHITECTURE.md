# 📁 项目架构文档 - 功能导向架构

## 🎯 设计原则

基于 **Unix 哲学** 和 **功能导向架构** 重新设计：
- **做一件事并做好** - 每个模块职责单一
- **按功能分组** - 相关功能聚合在一个模块内
- **组合胜过继承** - 通过组合简单模块构建复杂功能
- **清晰的依赖关系** - 核心模块独立，功能模块依赖核心模块

## 🏗️ 新项目结构

```
src/
├── app/                 # 应用层 - 应用入口和主组件
│   ├── App.tsx                # 主应用组件
│   └── main.tsx               # 应用入口文件
├── core/                # 核心功能模块 - 独立的业务核心
│   ├── bitable/               # 飞书SDK集成
│   │   ├── index.ts           # 统一导出
│   │   ├── useBaseSelection.ts # 数据选择逻辑
│   │   └── useBitableSDK.ts   # SDK封装
│   ├── markdown/              # Markdown处理引擎
│   │   ├── index.ts           # 统一导出
│   │   ├── MarkdownRenderer.tsx
│   │   ├── code-highlight.ts  # 代码高亮
│   │   ├── mermaid-init.ts    # 流程图支持
│   │   ├── parser.ts          # 解析器
│   │   ├── renderer.ts        # 渲染器
│   │   ├── styles.ts          # 样式处理
│   │   └── types.ts           # 类型定义
│   └── theme/                 # 主题系统
│       ├── index.ts           # 统一导出
│       ├── ThemeContext.ts    # 主题上下文
│       ├── ThemeProvider.tsx  # 主题提供者
│       ├── ThemeSwitcher.tsx  # 主题切换器
│       ├── useTheme.ts        # 主题逻辑
│       └── useThemeContext.ts # 主题上下文Hook
├── features/            # 功能模块 - 具体业务功能
│   ├── export/                # 导出功能
│   │   ├── index.ts           # 统一导出
│   │   ├── Footer.tsx         # 导出工具栏
│   │   └── useCopyToClipboard.ts # 复制功能
│   ├── preview/               # 预览功能
│   │   ├── index.ts           # 统一导出
│   │   ├── ContentPreview.tsx # 内容预览组件
│   │   ├── EditorPreview.tsx  # 编辑器预览
│   │   ├── usePreviewContent.ts # 预览逻辑
│   │   └── useScrollSync.ts   # 滚动同步
│   └── template/              # 模板系统
│       ├── index.ts           # 统一导出
│       ├── TemplateContext.tsx # 模板上下文
│       ├── TemplateProvider.tsx # 模板提供者
│       ├── useTemplateContext.tsx # 模板上下文Hook
│       └── wechat-templates.ts # 模板配置
└── shared/              # 共享资源 - 通用组件和工具
    ├── components/            # 通用UI组件
    │   ├── index.ts           # 统一导出
    │   ├── ContentSkeleton.tsx # 加载骨架屏
    │   ├── ErrorContent.tsx   # 错误展示
    │   ├── IconComponent.tsx  # 图标组件
    │   ├── Navbar.tsx         # 导航栏
    │   └── SponsorButton.tsx  # 赞助按钮
    ├── types/                 # 全局类型定义
    │   └── index.ts
    └── utils/                 # 工具函数和配置
        ├── code-themes.ts     # 代码主题配置
        ├── constants.ts       # 常量定义
        ├── helpers.ts         # 辅助函数
        ├── i18n.ts           # 国际化配置
        └── utils.ts          # 通用工具
```

## 🔄 架构重构亮点

### ✅ 功能导向组织
- **按业务功能分组**：相关的组件、Hook、类型定义放在同一模块内
- **模块自包含**：每个模块都有自己的index.ts统一导出
- **清晰的依赖层级**：App -> Features -> Core/Shared

### ✅ 模块化导入
```typescript
// 老的导入方式 - 分散且路径复杂
import { useBaseSelection } from '../hooks/useBaseSelection';
import { ContentPreview } from '../components/ContentPreview';
import { TemplateProvider } from '../providers/TemplateProvider';

// 新的导入方式 - 模块化且简洁
import { useBaseSelection } from '../core/bitable';
import { ContentPreview } from '../features/preview';
import { TemplateProvider } from '../features/template';
```

### ✅ 架构层级
```
┌─────────────────┐
│   应用层 (App)   │ ← 组合各个功能模块
├─────────────────┤
│   功能层         │ ← 具体业务功能实现
│ Features        │
├─────────────────┤
│   核心层 (Core)  │ ← 独立的业务逻辑内核
├─────────────────┤
│  共享层 (Shared) │ ← 通用组件和工具
└─────────────────┘
```

## 🚀 架构优势

### 1. **可维护性**
- 功能相关的代码聚集在一起，易于定位和修改
- 每个模块职责清晰，修改影响范围可控

### 2. **可扩展性**
- 新功能只需添加新的feature模块
- 核心功能独立，不影响业务功能开发

### 3. **可测试性**
- 每个模块可以独立测试
- 依赖关系清晰，易于Mock

### 4. **团队协作**
- 不同功能模块可以并行开发
- 代码冲突减少

### 5. **代码复用**
- 共享模块可以在多个功能中使用
- 核心模块可以独立提取为库

## 🔧 开发规范

### 1. **模块导入规则**
- 同模块内使用相对路径：`./ComponentName`
- 跨模块使用模块路径：`../core/bitable`
- 统一通过index.ts导出

### 2. **依赖关系约束**
- Core模块不能依赖Features或App
- Features模块可以依赖Core和Shared
- App模块可以依赖所有模块
- Shared模块保持独立性

### 3. **文件命名约定**
- 组件：PascalCase (ContentPreview.tsx)
- Hook：camelCase with use前缀 (useBaseSelection.ts)
- 工具：camelCase (helpers.ts)
- 类型：PascalCase (index.ts)

## 📊 重构对比

| 方面 | 重构前 | 重构后 |
|------|--------|--------|
| 组织方式 | 按文件类型分组 | 按功能模块分组 |
| 导入路径 | 深层嵌套路径 | 简洁的模块路径 |
| 依赖关系 | 复杂交叉依赖 | 清晰的单向依赖 |
| 代码定位 | 需要在多个目录查找 | 功能内聚，易于定位 |
| 新功能开发 | 需要在多个目录添加文件 | 在单个feature目录内开发 |
| 团队协作 | 容易产生文件冲突 | 模块独立，冲突减少 |

这种架构更符合现代前端项目的最佳实践，为项目的长期维护和扩展奠定了坚实的基础。 