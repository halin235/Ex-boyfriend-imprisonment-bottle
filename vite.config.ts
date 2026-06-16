import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, transformWithEsbuild, type PluginOption } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const tossFrameworkStub = path.resolve(
  rootDir,
  'src/mocks/apps-in-toss-web-framework.js',
)

function jsxInJs(): PluginOption {
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

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [jsxInJs(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@apps-in-toss/web-framework': tossFrameworkStub,
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      mode === 'production' ? 'production' : 'development',
    ),
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
}))
