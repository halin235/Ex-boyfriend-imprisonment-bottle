import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const tossFrameworkStub = path.resolve(
  rootDir,
  'src/mocks/apps-in-toss-web-framework.js',
)

function jsxInJs() {
  return {
    name: 'jsx-in-js',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\/src\/.*\.js$/.test(id)) return null
      return transformWithEsbuild(code, id, {
        loader: 'jsx',
        jsx: 'automatic',
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [jsxInJs(), react(), tailwindcss()],
  resolve: {
    alias:
      mode === 'development'
        ? {
            '@apps-in-toss/web-framework': tossFrameworkStub,
          }
        : {},
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      mode === 'production' ? 'production' : 'development',
    ),
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      external: ['@apps-in-toss/web-framework'],
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
}))
