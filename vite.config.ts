import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', 
  plugins: [react(), splitVendorChunkPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 将node_modules中的代码分割成不同的chunk
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler') || id.includes('prop-types')) {
              return 'react-vendor';
            }
            if (id.includes('react-markdown') || id.includes('remark') || id.includes('unified') || id.includes('micromark')) {
              return 'markdown-vendor';
            }
            if (id.includes('react-icons')) {
              return 'icons-vendor';
            }
            if (id.includes('@lark-base-open')) {
              return 'lark-vendor';
            }
            if (id.includes('sonner')) {
              return 'ui-vendor';
            }
            // 其他第三方库
            return 'vendor';
          }
          
          // 将组件按功能分组
          if (id.includes('/components/')) {
            if (id.includes('MarkdownRenderer') || id.includes('ContentPreview')) {
              return 'content-components';
            }
            return 'ui-components';
          }
          
          // 将hooks分组
          if (id.includes('/hooks/')) {
            return 'hooks';
          }
          
          // 将工具函数分组
          if (id.includes('/utils/')) {
            return 'utils';
          }
        }
      }
    },
    // 提高警告阈值，避免不必要的警告 - 增加到1000KB
    chunkSizeWarningLimit: 1000,
    // 启用源码映射，方便调试
    sourcemap: true,
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 移除console
        drop_debugger: true,  // 移除debugger
        pure_funcs: ['console.log', 'console.info', 'console.debug'] // 移除特定的函数调用
      },
      mangle: {
        safari10: true // 兼容Safari 10
      },
      format: {
        comments: false // 移除注释
      }
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 启用CSS压缩
    cssMinify: true,
    // 资源处理
    assetsInlineLimit: 4096, // 小于4kb的资源内联为base64
  },
  // 优化开发体验
  optimizeDeps: {
    include: ['react', 'react-dom', 'sonner']
  },
  // 服务器配置
  server: {
    hmr: true,
    open: true,
    // 允许的主机名
    allowedHosts: true
  },
  // 预览配置
  preview: {
    allowedHosts: [
      "preview.miaoruzhi.com",
      "miaoruzhi.com",
      ".miaoruzhi.com" // 允许所有子域名
    ]
  }
})
