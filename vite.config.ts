import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    // Increase the chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000,
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],

          // Milkdown editor - group all milkdown packages
          'milkdown': [
            '@milkdown/core',
            '@milkdown/ctx',
            '@milkdown/plugin-block',
            '@milkdown/plugin-clipboard',
            '@milkdown/plugin-cursor',
            '@milkdown/plugin-emoji',
            '@milkdown/plugin-history',
            '@milkdown/plugin-indent',
            '@milkdown/plugin-listener',
            '@milkdown/plugin-prism',
            '@milkdown/plugin-slash',
            '@milkdown/plugin-tooltip',
            '@milkdown/plugin-upload',
            '@milkdown/preset-commonmark',
            '@milkdown/preset-gfm',
            '@milkdown/prose',
            '@milkdown/react',
            '@milkdown/theme-nord',
            '@milkdown/utils'
          ],

          // Diagram and math rendering
          'diagram-math': ['mermaid', 'katex'],

          // PDF generation
          'pdf-vendor': ['html2pdf.js'],

          // Markdown processing
          'markdown-vendor': [
            'marked',
            'react-markdown',
            'remark-breaks',
            'remark-gfm',
            'remark-math',
            'rehype-katex',
            'rehype-raw'
          ],

          // Syntax highlighting
          'syntax-vendor': ['prismjs'],

          // UI and icons
          'ui-vendor': ['react-icons', '@tailwindcss/typography'],

          // Internationalization
          'i18n-vendor': ['i18next', 'react-i18next'],

          // Lark SDK
          'lark-vendor': ['@lark-base-open/js-sdk']
        }
      }
    }
  }
})
